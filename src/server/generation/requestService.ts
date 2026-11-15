import type { DbServiceBinding } from "../dbService.ts";
import {
  createPrismaGenerationDbService,
  createRemoteGenerationDbService,
} from "./dbService.ts";
import type { GenerationDbService } from "./contract.ts";

type Dependencies = {
  getCloudflareRuntime(): Promise<{ DB_SERVICE?: DbServiceBinding }>;
  getPrismaService(): Promise<GenerationDbService>;
};
/** Explicit opt-in until the ledger migration is reviewed and applied. */
export async function createRequestGenerationDbService(
  overrides: Partial<Dependencies> = {},
): Promise<GenerationDbService | null> {
  const backend = process.env.DB_GENERATION_BACKEND ?? "legacy";
  if (backend === "legacy") return null;
  if (backend !== "prisma" && backend !== "service")
    throw new Error("Unsupported DB_GENERATION_BACKEND");
  if (backend === "prisma") {
    if (overrides.getPrismaService) return overrides.getPrismaService();
    const { prisma } = await import("../db.ts");
    return createPrismaGenerationDbService(prisma);
  }
  const runtime = overrides.getCloudflareRuntime
    ? await overrides.getCloudflareRuntime()
    : (
        await (
          await import("@opennextjs/cloudflare")
        ).getCloudflareContext({ async: true })
      ).env;
  return createRemoteGenerationDbService(
    (runtime as { DB_SERVICE?: DbServiceBinding }).DB_SERVICE,
  );
}
