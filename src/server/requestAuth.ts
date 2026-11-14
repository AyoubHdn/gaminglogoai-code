import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { getServerSession } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import type { NextAuthOptions } from "next-auth";

import type {
  GamingAuthDbService,
  createRemoteGamingAuthDbService,
} from "./authDbService.ts";
import type { createGamingAuthOptions } from "./authOptionsFactory.ts";
import type { createRemoteNextAuthAdapter } from "./remoteNextAuthAdapter.ts";
import {
  requireAuthDbBinding,
  selectAuthBackend,
  type AuthRuntime,
} from "./authRuntime.ts";

export type { AuthRuntime } from "./authRuntime.ts";
export { requireAuthDbBinding, selectAuthBackend } from "./authRuntime.ts";

type AuthConfig = {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  NEXTAUTH_SECRET: string | undefined;
};

export type RequestAuthDependencies = {
  config: AuthConfig;
  getCloudflareRuntime: () => Promise<AuthRuntime>;
  getPrismaAuthOptions: () => Promise<NextAuthOptions>;
  createRemoteGamingAuthDbService: typeof createRemoteGamingAuthDbService;
  createRemoteNextAuthAdapter: typeof createRemoteNextAuthAdapter;
  createGamingAuthOptions: typeof createGamingAuthOptions;
  syncUserToMautic: (
    input: {
      email: string;
      name: string | null;
      brand_specific_credits: number;
      brand_specific_plan: string;
    },
    brand: "gaminglogoai",
  ) => Promise<unknown>;
  getServerSession: typeof getServerSession;
};

async function loadDefaultRequestAuthDependencies(): Promise<RequestAuthDependencies> {
  const [
    { getCloudflareContext },
    { env },
    authDbService,
    authOptionsFactory,
    remoteNextAuthAdapter,
  ] = await Promise.all([
    import("@opennextjs/cloudflare"),
    import("../env.mjs"),
    import("./authDbService.ts"),
    import("./authOptionsFactory.ts"),
    import("./remoteNextAuthAdapter.ts"),
  ]);

  return {
    config: {
      GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
      NEXTAUTH_SECRET: env.NEXTAUTH_SECRET,
    },
    getCloudflareRuntime: async () => {
      const context = await getCloudflareContext({ async: true });
      return context.env as AuthRuntime;
    },
    getPrismaAuthOptions: async () => (await import("./auth.ts")).authOptions,
    createRemoteGamingAuthDbService:
      authDbService.createRemoteGamingAuthDbService,
    createRemoteNextAuthAdapter:
      remoteNextAuthAdapter.createRemoteNextAuthAdapter,
    createGamingAuthOptions: authOptionsFactory.createGamingAuthOptions,
    syncUserToMautic: async (input, brand) => {
      const { syncUserToMautic } = await import(
        "./api/routers/mautic-utils.ts"
      );
      return syncUserToMautic(input, brand);
    },
    getServerSession,
  };
}

async function resolveRequestAuthDependencies(
  overrides: Partial<RequestAuthDependencies> = {},
): Promise<RequestAuthDependencies> {
  const requiredKeys = [
    "config",
    "getCloudflareRuntime",
    "getPrismaAuthOptions",
    "createRemoteGamingAuthDbService",
    "createRemoteNextAuthAdapter",
    "createGamingAuthOptions",
    "syncUserToMautic",
    "getServerSession",
  ] as const;

  if (requiredKeys.every((key) => key in overrides)) {
    return overrides as RequestAuthDependencies;
  }

  return {
    ...(await loadDefaultRequestAuthDependencies()),
    ...overrides,
  };
}

function createOptionsForService(
  service: GamingAuthDbService,
  adapter: Adapter,
  dependencies: RequestAuthDependencies,
): NextAuthOptions {
  return dependencies.createGamingAuthOptions({
    adapter,
    clientId: dependencies.config.GOOGLE_CLIENT_ID,
    clientSecret: dependencies.config.GOOGLE_CLIENT_SECRET,
    secret: dependencies.config.NEXTAUTH_SECRET,
    syncUserToMautic: async (input, brand) =>
      dependencies.syncUserToMautic(
        {
          ...input,
          brand_specific_plan: input.brand_specific_plan,
        },
        brand,
      ),
    getUserForMautic: (id) => service.getUserForMautic(id),
  });
}

/**
 * Resolves auth options from trusted server configuration only. No request
 * header, query parameter, or cookie can select the database backend.
 */
export async function createRequestAuthOptions(
  overrides: Partial<RequestAuthDependencies> = {},
): Promise<NextAuthOptions> {
  const dependencies = await resolveRequestAuthDependencies(overrides);
  const configuredBackend = selectAuthBackend({
    // Read this server-only selector at request time so Wrangler vars are not
    // frozen to the build machine's value by Next.js env inlining.
    DB_AUTH_BACKEND: process.env.DB_AUTH_BACKEND,
  });

  if (configuredBackend === "prisma") {
    return dependencies.getPrismaAuthOptions();
  }

  const runtime = await dependencies.getCloudflareRuntime();
  const binding = requireAuthDbBinding(runtime);
  const service = dependencies.createRemoteGamingAuthDbService(binding);
  return createOptionsForService(
    service,
    dependencies.createRemoteNextAuthAdapter(binding),
    dependencies,
  );
}

export async function getServerAuthSession(
  ctx: { req: NextApiRequest; res: NextApiResponse },
  overrides: Partial<RequestAuthDependencies> = {},
) {
  const dependencies = await resolveRequestAuthDependencies(overrides);
  return dependencies.getServerSession(
    ctx.req,
    ctx.res,
    await createRequestAuthOptions(dependencies),
  );
}

export async function getServerPageAuthSession(
  ctx: {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
  },
  overrides: Partial<RequestAuthDependencies> = {},
) {
  const dependencies = await resolveRequestAuthDependencies(overrides);
  return dependencies.getServerSession(
    ctx.req,
    ctx.res,
    await createRequestAuthOptions(dependencies),
  );
}
