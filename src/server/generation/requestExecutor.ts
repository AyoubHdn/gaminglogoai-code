import {
  createRemoteGenerationExecutor,
  type GenerationExecutorBinding,
} from "./executor.ts";
import type { GenerationExecutor } from "./contract.ts";

type Runtime = { GENERATION_EXECUTOR?: GenerationExecutorBinding };

function getGenerationExecutorBinding(value: unknown): GenerationExecutorBinding | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const binding = Reflect.get(value, "GENERATION_EXECUTOR");
  if (typeof binding !== "object" || binding === null) return undefined;
  const fetch = Reflect.get(binding, "fetch");
  if (typeof fetch !== "function") return undefined;
  return {
    fetch(input, init) {
      return Reflect.apply(fetch, binding, [input, init]);
    },
  };
}

export type RequestGenerationExecutorDependencies = {
  getCloudflareRuntime(): Promise<Runtime>;
};

/**
 * Resolves only the explicitly configured Worker executor. There is no mock or
 * legacy fallback here: a service-backed generation request must have its own
 * execution binding before it reserves credits.
 */
export async function createRequestGenerationExecutor(
  overrides: Partial<RequestGenerationExecutorDependencies> = {},
): Promise<GenerationExecutor> {
  if (process.env.GENERATION_EXECUTION_BACKEND !== "service")
    throw new Error("GENERATION_EXECUTION_BACKEND must be service");

  const runtime = overrides.getCloudflareRuntime
    ? await overrides.getCloudflareRuntime()
    : (
        await (
          await import("@opennextjs/cloudflare")
        ).getCloudflareContext({ async: true })
      ).env;
  return createRemoteGenerationExecutor(
    getGenerationExecutorBinding(runtime),
    process.env.GENERATION_EXECUTOR_HMAC_SECRET,
  );
}


