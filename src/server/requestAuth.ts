import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { getServerSession } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import type { NextAuthOptions } from "next-auth";

import { env } from "~/env.mjs";
import { syncUserToMautic } from "~/server/api/routers/mautic-utils";
import {
  createRemoteGamingAuthDbService,
  type GamingAuthDbService,
} from "~/server/authDbService";
import { createGamingAuthOptions } from "~/server/authOptionsFactory";
import { createRemoteNextAuthAdapter } from "~/server/remoteNextAuthAdapter";
import {
  requireAuthDbBinding,
  selectAuthBackend,
  type AuthRuntime,
} from "./authRuntime";

export type { AuthRuntime } from "./authRuntime";
export { requireAuthDbBinding, selectAuthBackend } from "./authRuntime";

function createOptionsForService(
  service: GamingAuthDbService,
  adapter: Adapter,
): NextAuthOptions {
  return createGamingAuthOptions({
    adapter,
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    secret: env.NEXTAUTH_SECRET,
    syncUserToMautic: async (input, brand) =>
      syncUserToMautic(
        {
          ...input,
          brand_specific_plan: input.brand_specific_plan,
        },
        brand,
      ),
    getUserForMautic: (id) => service.getUserForMautic(id),
  });
}

async function getCloudflareRuntime(): Promise<AuthRuntime> {
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  const context = await getCloudflareContext({ async: true });
  return context.env as AuthRuntime;
}

/**
 * Resolves auth options from trusted server configuration only. No request
 * header, query parameter, or cookie can select the database backend.
 */
export async function createRequestAuthOptions(): Promise<NextAuthOptions> {
  const configuredBackend = selectAuthBackend({
    // Read this server-only selector at request time so Wrangler vars are not
    // frozen to the build machine's value by Next.js env inlining.
    DB_AUTH_BACKEND: process.env.DB_AUTH_BACKEND,
  });

  if (configuredBackend === "prisma") {
    const { authOptions } = await import("~/server/auth");
    return authOptions;
  }

  const runtime = await getCloudflareRuntime();
  const binding = requireAuthDbBinding(runtime);
  const service = createRemoteGamingAuthDbService(binding);
  return createOptionsForService(service, createRemoteNextAuthAdapter(binding));
}

export async function getServerAuthSession(ctx: {
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  return getServerSession(
    ctx.req,
    ctx.res,
    await createRequestAuthOptions(),
  );
}

export async function getServerPageAuthSession(ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) {
  return getServerSession(
    ctx.req,
    ctx.res,
    await createRequestAuthOptions(),
  );
}
