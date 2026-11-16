
/* eslint-disable @typescript-eslint/require-await -- Test doubles implement async contracts. */
import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import postgres from "postgres";
import { PrismaClient } from "@prisma/client";
import type { Session } from "next-auth";
import { createDbRpcHandler } from "../../../workers/db/src/index.ts";
import {
  createGenerateRouter,
  type GenerateRouterDependencies,
} from "../api/routers/generate.ts";
import { createRequestGenerationDbService } from "../generation/requestService.ts";
import { createRemoteGenerationDbService } from "../generation/dbService.ts";
import type {
  GenerationDbService,
  GenerationIcon,
  LogoRequest,
} from "../generation/contract.ts";
import type { GenerationTransaction } from "../generation/sqlService.ts";
import type { GamingDbService as ReadGamingDbService } from "../dbService.ts";

type ProcedureInput = {
  requestId?: string;
  prompt: string;
  numberOfImages: number;
  aspectRatio?: string;
  model: "flux-schnell" | "flux-dev";
};

const databaseUrl = process.env.GAMING_DB_SERVICE_TEST_DATABASE_URL;
if (!databaseUrl)
  throw new Error("GAMING_DB_SERVICE_TEST_DATABASE_URL is required");
if (process.env.AUTH_EXTERNAL_SYNC_MODE !== "disabled")
  throw new Error("AUTH_EXTERNAL_SYNC_MODE must be disabled for this test");
const target = new URL(databaseUrl);
if (
  target.protocol !== "postgresql:" ||
  target.hostname !== "127.0.0.1" ||
  target.port !== "5432" ||
  target.pathname !== "/gaminglogoai_ci" ||
  target.search ||
  target.hash
)
  throw new Error("Only disposable localhost gaminglogoai_ci PostgreSQL is allowed");

const sql = postgres(databaseUrl, { prepare: false });
const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
const prefix = "generate-procedure-ci-" + randomUUID();
let userCounter = 0;
const createdUserIds: string[] = [];

type TestContext = {
  session: Session | null;
  dbService: ReadGamingDbService;
  prisma: PrismaClient;
};

const unusedReadService: ReadGamingDbService = {
  async getCredits() {
    throw new Error("read service is not used by generateIcon");
  },
  async getHasPurchasedCredits() {
    throw new Error("read service is not used by generateIcon");
  },
  async getSavedIcons() {
    throw new Error("read service is not used by generateIcon");
  },
  async getEmoteBases() {
    throw new Error("read service is not used by generateIcon");
  },
  async getCommunityIcons() {
    throw new Error("read service is not used by generateIcon");
  },
};

const sessionFor = (id: string): Session => ({
  user: { id, email: `${id}@synthetic.invalid`, name: "Synthetic User" },
  expires: "2099-01-01T00:00:00.000Z",
});

async function user(credits = 10): Promise<string> {
  const id = `${prefix}-${userCounter++}`;
  createdUserIds.push(id);
  await prisma.user.create({
    data: {
      id,
      email: `${id}@synthetic.invalid`,
      gamingCredits: credits,
    },
  });
  return id;
}

function request(requestId?: string): ProcedureInput {
  return {
    ...(requestId ? { requestId } : {}),
    prompt: "synthetic protected logo",
    numberOfImages: 1,
    aspectRatio: "1:1",
    model: "flux-schnell",
  };
}

const transaction: GenerationTransaction = (action) =>
  sql
    .begin(async (tx) => ({
      result: await action((query, values) =>
        tx.unsafe(query, values as never[]),
      ),
    }))
    .then(({ result }) => result);

function remoteService() {
  const operations: string[] = [];
  const handler = createDbRpcHandler(
    (query, values) => sql.unsafe(query, values as never[]),
    transaction,
  );
  const service = createRemoteGenerationDbService({
    async fetch(input, init) {
      const request = new Request(input, init);
      const body = (await request.clone().json()) as { operation?: unknown };
      if (typeof body.operation === "string") operations.push(body.operation);
      return handler(request);
    },
  });
  return { service, operations };
}

function routerWith(
  service: GenerationDbService,
  overrides: Pick<
    GenerateRouterDependencies,
    "generate" | "upload" | "syncUserToMautic"
  >,
) {
  return createGenerateRouter({
    createGenerationDbService: async () => service,
    ...overrides,
  });
}

function callerFor(
  router: ReturnType<typeof createGenerateRouter>,
  session: Session | null,
) {
  const context: TestContext = { session, dbService: unusedReadService, prisma };
  return router.createCaller(context);
}

test("protected procedure uses the remote DB service and authenticated ownership", async () => {
  const { service, operations } = remoteService();
  const generated: string[] = [];
  const uploaded: string[] = [];
  let mauticCalls = 0;
  const router = routerWith(service, {
    async generate(input: LogoRequest) {
      generated.push(input.requestId);
      return ["synthetic-image"];
    },
    async upload(icon: GenerationIcon) {
      uploaded.push(icon.id);
    },
    async syncUserToMautic() {
      mauticCalls++;
      return {};
    },
  });
  const anonymous = callerFor(router, null);
  const accountA = await user();
  const accountB = await user();
  const requestId = randomUUID();
  const callerA = callerFor(router, sessionFor(accountA));

  await assert.rejects(
    anonymous.generateIcon(request(requestId)),
    /UNAUTHORIZED/,
  );
  assert.equal(
    (await prisma.user.findUniqueOrThrow({ where: { id: accountA } }))
      .gamingCredits,
    10,
  );

  await assert.rejects(
    callerA.generateIcon({
      prompt: "missing id",
      numberOfImages: 1,
      model: "flux-schnell",
    }),
  );
  await assert.rejects(
    callerA.generateIcon({ ...request(requestId), numberOfImages: 0 }),
  );
  assert.deepEqual(operations, []);
  assert.equal(generated.length, 0);

  const untrustedInput = {
    ...request(requestId),
    userId: accountB,
  } as unknown as Parameters<typeof callerA.generateIcon>[0];
  const result = await callerA.generateIcon(untrustedInput);
  assert.equal(result.length, 1);
  assert.equal(generated.length, 1);
  assert.equal(uploaded.length, 1);
  assert.equal(mauticCalls, 0);
  assert.equal(
    (await prisma.user.findUniqueOrThrow({ where: { id: accountA } }))
      .gamingCredits,
    9,
  );
  assert.equal(
    (await prisma.user.findUniqueOrThrow({ where: { id: accountB } }))
      .gamingCredits,
    10,
  );
  assert.equal(await prisma.icon.count({ where: { userId: accountA } }), 1);
  assert.equal(await prisma.icon.count({ where: { userId: accountB } }), 0);

  const replay = await callerA.generateIcon(untrustedInput);
  assert.deepEqual(replay, result);
  assert.equal(generated.length, 1);
  assert.equal(uploaded.length, 1);
  assert.equal(
    (await prisma.user.findUniqueOrThrow({ where: { id: accountA } }))
      .gamingCredits,
    9,
  );
  assert.equal(await prisma.icon.count({ where: { userId: accountA } }), 1);
});

test("provider and upload failures refund through the protected procedure", async () => {
  const { service } = remoteService();
  const account = await user();
  const providerRequestId = randomUUID();
  let providerCalls = 0;
  const providerRouter = routerWith(service, {
    async generate() {
      providerCalls++;
      throw new Error("synthetic provider failure");
    },
    async upload() {
      throw new Error("upload must not run");
    },
  });
  await assert.rejects(
    callerFor(providerRouter, sessionFor(account)).generateIcon(
      request(providerRequestId),
    ),
  );
  assert.equal(providerCalls, 1);
  assert.equal(
    (await prisma.user.findUniqueOrThrow({ where: { id: account } }))
      .gamingCredits,
    10,
  );
  assert.equal(await prisma.icon.count({ where: { userId: account } }), 0);

  const uploadAccount = await user();
  const uploadRouter = routerWith(service, {
    async generate() {
      return ["synthetic-image"];
    },
    async upload() {
      throw new Error("synthetic upload failure");
    },
  });
  await assert.rejects(
    callerFor(uploadRouter, sessionFor(uploadAccount)).generateIcon(
      request(randomUUID()),
    ),
  );
  assert.equal(
    (await prisma.user.findUniqueOrThrow({ where: { id: uploadAccount } }))
      .gamingCredits,
    10,
  );
  assert.equal(await prisma.icon.count({ where: { userId: uploadAccount } }), 0);
});

test("service mode missing binding fails closed without Prisma fallback", async () => {
  const previous = process.env.DB_GENERATION_BACKEND;
  const { service } = remoteService();
  const account = await user();
  try {
    process.env.DB_GENERATION_BACKEND = "service";
    const router = createGenerateRouter({
      createGenerationDbService: () =>
        createRequestGenerationDbService({
          getCloudflareRuntime: async () => ({}),
          getPrismaService: async () => {
            throw new Error("PRISMA_FALLBACK_USED");
          },
        }),
    });
    await assert.rejects(
      callerFor(router, sessionFor(account)).generateIcon(
        request(randomUUID()),
      ),
      /DB_SERVICE binding is required/,
    );
  } finally {
    if (previous === undefined) delete process.env.DB_GENERATION_BACKEND;
    else process.env.DB_GENERATION_BACKEND = previous;
  }
});

test.after(async () => {
  if (createdUserIds.length > 0) {
    await prisma.icon.deleteMany({ where: { userId: { in: createdUserIds } } });
    await sql`DELETE FROM "GamingGenerationRequest" WHERE "userId" = ANY(${sql.array(createdUserIds)})`;
    await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
  }
  await prisma.$disconnect();
  await sql.end({ timeout: 1 });
});

