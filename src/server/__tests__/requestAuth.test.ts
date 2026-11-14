import assert from "node:assert/strict";
import test from "node:test";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type {
  getServerSession as GetServerSession,
  NextAuthOptions,
  Session,
} from "next-auth";

import {
  createRequestAuthOptions,
  getServerAuthSession,
  getServerPageAuthSession,
  type RequestAuthDependencies,
} from "../requestAuth.ts";
import type { GamingAuthDbService } from "../authDbService.ts";
import type { GamingRemoteNextAuthAdapter } from "../remoteNextAuthAdapter.ts";

import {
  requireAuthDbBinding,
  selectAuthBackend,
  type AuthRuntime,
} from "../authRuntime.ts";

void test("trusted backend defaults to Prisma and ignores client-shaped input", () => {
  const runtime: AuthRuntime = { DB_AUTH_BACKEND: undefined };
  assert.equal(selectAuthBackend(runtime), "prisma");
  assert.equal(selectAuthBackend({ DB_AUTH_BACKEND: "service" }), "service");
});

void test("unsupported backend is rejected before a database is selected", () => {
  assert.throws(
    () => selectAuthBackend({ DB_AUTH_BACKEND: "remote-from-header" }),
    /Unsupported DB_AUTH_BACKEND/,
  );
});

void test("service mode fails closed without its request-scoped binding", () => {
  assert.throws(
    () => requireAuthDbBinding({ DB_AUTH_BACKEND: "service" }),
    /DB_SERVICE binding is required/,
  );
});

void test("service mode returns the exact request-scoped binding", () => {
  const binding = {
    fetch: () => Promise.resolve(new Response(JSON.stringify({ ok: true, data: null }))),
  };
  assert.equal(
    requireAuthDbBinding({ DB_AUTH_BACKEND: "service", DB_SERVICE: binding }),
    binding,
  );
});

type AuthOptionsInput = Parameters<
  RequestAuthDependencies["createGamingAuthOptions"]
>[0];

type SessionCall = {
  req: unknown;
  res: unknown;
  options: NextAuthOptions;
};

function makeBinding(
  label: string,
): NonNullable<AuthRuntime["DB_SERVICE"]> {
  return {
    fetch: () =>
      Promise.resolve(
        new Response(JSON.stringify({ ok: true, data: { label } }), {
          headers: { "content-type": "application/json" },
        }),
      ),
  };
}

function makeDependencies(runtime: () => Promise<AuthRuntime>) {
  const prismaOptions: NextAuthOptions = {
    providers: [],
    session: { strategy: "database" },
  };
  const serviceOptions: NextAuthOptions = {
    providers: [],
    session: { strategy: "database" },
  };
  const prismaLoads: { count: number } = { count: 0 };
  const serviceBindings: Array<NonNullable<AuthRuntime["DB_SERVICE"]>> = [];
  const adapterBindings: Array<NonNullable<AuthRuntime["DB_SERVICE"]>> = [];
  const optionInputs: AuthOptionsInput[] = [];
  const sessionCalls: SessionCall[] = [];

  const fakeGetServerSession = ((
    req: NextApiRequest,
    res: NextApiResponse,
    options: NextAuthOptions,
  ): Promise<Session | null> => {
    sessionCalls.push({ req, res, options });
    return Promise.resolve(null);
  }) as typeof GetServerSession;

  const dependencies: RequestAuthDependencies = {
    config: {
      GOOGLE_CLIENT_ID: "test-client-id",
      GOOGLE_CLIENT_SECRET: "test-client-secret",
      NEXTAUTH_SECRET: "test-nextauth-secret",
    },
    getCloudflareRuntime: runtime,
    getPrismaAuthOptions: () => {
      prismaLoads.count += 1;
      return Promise.resolve(prismaOptions);
    },
    createRemoteGamingAuthDbService: (binding) => {
      if (!binding) throw new Error("unexpected missing binding");
      serviceBindings.push(binding);
      return {
        getUserForMautic: () => Promise.resolve(null),
      } as unknown as GamingAuthDbService;
    },
    createRemoteNextAuthAdapter: (binding) => {
      if (!binding) throw new Error("unexpected missing binding");
      adapterBindings.push(binding);
      return {} as GamingRemoteNextAuthAdapter;
    },
    createGamingAuthOptions: (input) => {
      optionInputs.push(input);
      return serviceOptions;
    },
    syncUserToMautic: () => Promise.resolve(undefined),
    getServerSession: fakeGetServerSession,
  };

  return {
    dependencies,
    prismaOptions,
    serviceOptions,
    prismaLoads,
    serviceBindings,
    adapterBindings,
    optionInputs,
    sessionCalls,
  };
}

async function withBackend<T>(
  backend: string | undefined,
  callback: () => Promise<T>,
): Promise<T> {
  const previous = process.env.DB_AUTH_BACKEND;
  if (backend === undefined) delete process.env.DB_AUTH_BACKEND;
  else process.env.DB_AUTH_BACKEND = backend;
  try {
    return await callback();
  } finally {
    if (previous === undefined) delete process.env.DB_AUTH_BACKEND;
    else process.env.DB_AUTH_BACKEND = previous;
  }
}

void test("createRequestAuthOptions defaults to the Prisma options", async () => {
  const state = makeDependencies(() =>
    Promise.reject(
      new Error("Cloudflare context must not be requested in Prisma mode"),
    ),
  );

  await withBackend(undefined, async () => {
    const options = await createRequestAuthOptions(state.dependencies);
    assert.equal(options, state.prismaOptions);
  });
  assert.equal(state.prismaLoads.count, 1);
  assert.equal(state.serviceBindings.length, 0);
});

void test("service mode resolves the request-scoped DB_SERVICE binding", async () => {
  const binding = makeBinding("request-one");
  const state = makeDependencies(() => Promise.resolve({ DB_SERVICE: binding }));

  await withBackend("service", async () => {
    const options = await createRequestAuthOptions(state.dependencies);
    assert.equal(options, state.serviceOptions);
  });

  assert.deepEqual(state.serviceBindings, [binding]);
  assert.deepEqual(state.adapterBindings, [binding]);
  assert.equal(state.optionInputs[0]?.clientId, "test-client-id");
  assert.equal(state.optionInputs[0]?.clientSecret, "test-client-secret");
  assert.equal(state.prismaLoads.count, 0);
});

void test("service mode fails closed for missing binding or context failure", async () => {
  const missingBinding = makeDependencies(() => Promise.resolve({}));
  const contextFailure = makeDependencies(() =>
    Promise.reject(new Error("request context unavailable")),
  );

  await withBackend("service", async () => {
    await assert.rejects(
      createRequestAuthOptions(missingBinding.dependencies),
      /DB_SERVICE binding is required/,
    );
    await assert.rejects(
      createRequestAuthOptions(contextFailure.dependencies),
      /request context unavailable/,
    );
  });

  assert.equal(missingBinding.prismaLoads.count, 0);
  assert.equal(contextFailure.prismaLoads.count, 0);
  assert.equal(missingBinding.serviceBindings.length, 0);
  assert.equal(contextFailure.serviceBindings.length, 0);
});

void test("separate request bindings produce separate auth adapters", async () => {
  const first = makeBinding("first");
  const second = makeBinding("second");
  const runtimes = [{ DB_SERVICE: first }, { DB_SERVICE: second }];
  const state = makeDependencies(() => {
    const runtime = runtimes.shift();
    if (!runtime) throw new Error("unexpected third request");
    return Promise.resolve(runtime);
  });

  await withBackend("service", async () => {
    await createRequestAuthOptions(state.dependencies);
    await createRequestAuthOptions(state.dependencies);
  });

  assert.deepEqual(state.serviceBindings, [first, second]);
  assert.deepEqual(state.adapterBindings, [first, second]);
  assert.notEqual(state.optionInputs[0]?.adapter, state.optionInputs[1]?.adapter);
});

void test("unsupported backend values reject before Prisma or service loading", async () => {
  const state = makeDependencies(() =>
    Promise.reject(new Error("Cloudflare context must not be requested")),
  );

  await withBackend("from-client-header", async () => {
    await assert.rejects(
      createRequestAuthOptions(state.dependencies),
      /Unsupported DB_AUTH_BACKEND/,
    );
  });

  assert.equal(state.prismaLoads.count, 0);
  assert.equal(state.serviceBindings.length, 0);
});

void test("API and SSR session helpers pass resolved options to NextAuth", async () => {
  const binding = makeBinding("session-request");
  const state = makeDependencies(() => Promise.resolve({ DB_SERVICE: binding }));
  const apiReq = {} as NextApiRequest;
  const apiRes = {} as NextApiResponse;
  const pageReq = {} as GetServerSidePropsContext["req"];
  const pageRes = {} as GetServerSidePropsContext["res"];

  await withBackend("service", async () => {
    assert.equal(
      await getServerAuthSession(
        { req: apiReq, res: apiRes },
        state.dependencies,
      ),
      null,
    );
    assert.equal(
      await getServerPageAuthSession(
        { req: pageReq, res: pageRes },
        state.dependencies,
      ),
      null,
    );
  });

  assert.equal(state.sessionCalls.length, 2);
  assert.equal(state.sessionCalls[0]?.req, apiReq);
  assert.equal(state.sessionCalls[0]?.res, apiRes);
  assert.equal(state.sessionCalls[0]?.options, state.serviceOptions);
  assert.equal(state.sessionCalls[1]?.req, pageReq);
  assert.equal(state.sessionCalls[1]?.res, pageRes);
  assert.equal(state.sessionCalls[1]?.options, state.serviceOptions);
});
