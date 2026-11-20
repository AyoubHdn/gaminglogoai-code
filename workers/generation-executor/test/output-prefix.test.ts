import assert from "node:assert/strict";
import test from "node:test";
import { prepareLogoRequest, type GenerationExecutionRequest } from "../../../src/server/generation/contract.ts";
import { b64Image } from "../../../src/data/b64Image.ts";
import { configuredGenerationOutputPrefix, generationObjectKey } from "../../../src/server/generation/storageKey.ts";
import { createNodeExecutorPipeline, runPipeline } from "../src/pipeline.ts";
import type { ExecutorConfig } from "../src/config.ts";

const config: ExecutorConfig = { replicateApiToken: "fixture", hmacSecret: "fixture-secret", executionScope: "gaminglogoai-staging", executionTable: "fixture-table", awsRegion: "us-east-1", bucketName: "fixture-bucket", outputPrefix: "generation-staging/" };
test("prefix validation and legacy default", () => {
  assert.equal(configuredGenerationOutputPrefix(undefined), "");
  assert.equal(generationObjectKey("generation-staging/", "output-id"), "generation-staging/output-id");
  for (const value of ["generation-staging", "/generation-staging/", "../"]) assert.throws(() => configuredGenerationOutputPrefix(value));
});
async function input(): Promise<GenerationExecutionRequest> {
  const raw = { userId: "fixture-user", requestId: "11111111-1111-4111-8111-111111111111", prompt: "prefix regression", model: "flux-schnell" as const, numberOfImages: 1, aspectRatio: "1:1" };
  const prepared = await prepareLogoRequest(raw);
  return { ...raw, executionScope: config.executionScope, fingerprint: prepared.fingerprint, shouldWatermark: true, plannedOutputIds: prepared.icons.map((icon) => icon.id) };
}
test("watermark variants, replay and upload failure retain the trusted key", async () => {
  const keys: string[] = [];
  const pipeline = createNodeExecutorPipeline(config, { generate: async () => [b64Image] }, { s3: { async send(command) { keys.push(String(command.input.Key)); return {}; } } });
  const value = await input();
  await runPipeline({ ...value, outputPrefix: "attacker/" } as GenerationExecutionRequest, pipeline);
  await runPipeline(value, pipeline);
  await runPipeline({ ...value, shouldWatermark: false }, pipeline);
  assert.equal(new Set(keys).size, 1); assert.match(keys[0] ?? "", /^generation-staging\//);
  const failing = createNodeExecutorPipeline(config, { generate: async () => [b64Image] }, { s3: { async send() { throw new Error("fixture upload failure"); } } });
  await assert.rejects(runPipeline(value, failing), /EXECUTION_UPLOAD_UNCERTAIN/);
});
