import type { PrismaClient } from "@prisma/client";
import type { DbServiceBinding } from "../dbService.ts";
import {
  GenerationError,
  isGenerationErrorCode,
  isRecord,
  parseReservation,
  parseState,
  type GenerationDbService,
} from "./contract.ts";
import { createSqlGenerationDbService } from "./sqlService.ts";

export function createPrismaGenerationDbService(
  prisma: PrismaClient,
): GenerationDbService {
  return createSqlGenerationDbService((action) =>
    prisma.$transaction((tx) =>
      action((query, values) => tx.$queryRawUnsafe(query, ...values)),
    ),
  );
}
export function createRemoteGenerationDbService(
  binding: DbServiceBinding | undefined,
): GenerationDbService {
  if (!binding || typeof binding.fetch !== "function")
    throw new Error("DB_SERVICE binding is required for generation");
  const service = binding;
  async function call(operation: string, input: unknown): Promise<unknown> {
    // No retries: a lost response may follow a committed write.
    const response = await service.fetch("https://gaming-db.internal/rpc", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ operation, input }),
    });
    const body: unknown = await response.json();
    if (
      !response.ok ||
      !isRecord(body) ||
      body.ok !== true ||
      !("data" in body)
    ) {
      if (
        isRecord(body) &&
        isRecord(body.error) &&
        isGenerationErrorCode(body.error.code)
      )
        throw new GenerationError(body.error.code);
      throw new Error("Generation DB service request failed");
    }
    return body.data;
  }
  return {
    async reserveLogo(input) {
      return parseReservation(await call("generation.reserveLogo", input));
    },
    async completeLogo(input) {
      return parseState(await call("generation.completeLogo", input));
    },
    async refundLogo(input) {
      return parseState(await call("generation.refundLogo", input));
    },
  };
}
