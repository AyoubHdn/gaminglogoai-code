import {
  prepareLogoRequest,
  type GenerationExecutionRequest,
} from "../../../src/server/generation/contract.ts";
import type { ExecutorConfig } from "./config.ts";

export async function validateExecutionRequest(
  input: GenerationExecutionRequest,
  config: ExecutorConfig,
) {
  if (input.userId.length === 0 || input.requestId.length === 0)
    throw new Error("EXECUTION_IDENTITY_INVALID");
  if (config.executionScope.length === 0)
    throw new Error("EXECUTION_SCOPE_INVALID");
  if (input.executionScope !== config.executionScope)
    throw new Error("EXECUTION_SCOPE_MISMATCH");

  const prepared = await prepareLogoRequest(input);
  if (input.fingerprint !== prepared.fingerprint)
    throw new Error("EXECUTION_FINGERPRINT_MISMATCH");
  if (input.plannedOutputIds.length !== prepared.icons.length)
    throw new Error("EXECUTION_OUTPUT_COUNT_MISMATCH");
  if (
    input.plannedOutputIds.some(
      (id, index) => id !== prepared.icons[index]?.id,
    )
  )
    throw new Error("EXECUTION_OUTPUT_PLAN_MISMATCH");
  return prepared;
}
