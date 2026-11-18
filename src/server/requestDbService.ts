import {
  createPrismaDbService,
  createRemoteGamingDbService,
  type DbServiceBinding,
  type GamingDbService,
} from "./dbService.ts";

export type RequestDbServiceDependencies = {
  getCloudflareRuntime: () => Promise<{ DB_SERVICE?: DbServiceBinding }>;
  getPrismaDbService: () => Promise<GamingDbService>;
};

/** Server-owned configuration only; no HTTP input can select the backend. */
export async function createRequestGamingDbService(
  overrides: Partial<RequestDbServiceDependencies> = {},
): Promise<GamingDbService> {
  const backend = process.env.DB_READS_BACKEND ?? "prisma";
  if (backend !== "prisma" && backend !== "service") {
    throw new Error("Unsupported DB_READS_BACKEND");
  }
  if (backend === "prisma") {
    if (overrides.getPrismaDbService) return overrides.getPrismaDbService();
    const { prisma } = await import("./db.ts");
    return createPrismaDbService(prisma);
  }
  const runtime = overrides.getCloudflareRuntime
    ? await overrides.getCloudflareRuntime()
    : (
        await (
          await import("@opennextjs/cloudflare")
        ).getCloudflareContext({ async: true })
      ).env;
  const binding = (runtime as { DB_SERVICE?: DbServiceBinding }).DB_SERVICE;
  if (!binding || typeof binding.fetch !== "function") {
    throw new Error("DB_SERVICE binding is required for service reads");
  }
  return createRemoteGamingDbService(binding);
}
