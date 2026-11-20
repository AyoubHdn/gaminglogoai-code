import assert from "node:assert/strict";
import test from "node:test";
import { createSqlGenerationDbService } from "../../../src/server/generation/sqlService.ts";
import type { LogoRequest } from "../../../src/server/generation/contract.ts";

const request: LogoRequest = { userId: "prefix-user", requestId: "11111111-1111-4111-8111-111111111111", prompt: "prefix test", model: "flux-schnell", numberOfImages: 1, aspectRatio: "1:1" };
test("DB reservation stores the trusted prefix and legacy default stays null", async () => {
  const transaction = async <T>(action: (query: (sql: string, values: unknown[]) => Promise<ReadonlyArray<Record<string, unknown>>>) => Promise<T>): Promise<T> => action(async (sql, values) => {
    if (sql.includes('FROM "User"')) return [{ gamingCredits: 2, hasPurchasedCredits: false, email: null, name: null }];
    if (sql.includes('FROM "GamingGenerationRequest"')) return [];
    if (sql.startsWith('UPDATE "User"')) return [{ gamingCredits: 1 }];
    if (sql.startsWith('INSERT INTO "GamingGenerationRequest"')) return [{ state: "reserved", icons: JSON.parse(String(values[4])), shouldWatermark: true, creditCost: 1 }];
    throw new Error("unexpected fixture SQL");
  });
  const prefixed = await createSqlGenerationDbService(transaction, "generation-staging/").reserveLogo(request);
  assert.equal(prefixed.icons[0]?.imageKey?.startsWith("generation-staging/"), true);
  const legacy = await createSqlGenerationDbService(transaction).reserveLogo({ ...request, requestId: "22222222-2222-4222-8222-222222222222" });
  assert.equal(legacy.icons[0]?.imageKey, null);
});
