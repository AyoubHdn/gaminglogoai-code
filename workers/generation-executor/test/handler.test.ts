import assert from "node:assert/strict";
import test from "node:test";
import { createGenerationExecutorHandler } from "../src/handler.ts";
import { signExecutorBody } from "../src/hmac.ts";
import { MemoryExecutionStore } from "../src/store.ts";
import type { ExecutorConfig } from "../src/config.ts";
import type { ExecutorPipeline } from "../src/pipeline.ts";
import type { GenerationExecutionRequest } from "../../../src/server/generation/contract.ts";

const config: ExecutorConfig = {
  replicateApiToken: "fixture",
  hmacSecret: "fixture-secret",
  executionScope: "gaminglogoai-staging",
  executionTable: "fixture-table",
  awsRegion: "us-east-1",
  bucketName: "fixture-bucket",
  outputPrefix: "generation-staging/",
};
const input: GenerationExecutionRequest = {
  userId: "user-a",
  requestId: "0d3291ec-71f2-47db-9170-7a087b573bd5",
  executionScope: "gaminglogoai-staging",
  prompt: "logo",
  model: "flux-schnell",
  numberOfImages: 1,
  aspectRatio: "1:1",
  fingerprint: "invalid",
  shouldWatermark: false,
  plannedOutputIds: [],
};

async function signedEvent(body: string, now = Date.now()) {
  const timestamp = String(now);
  return {
    body,
    headers: {
      "x-generation-executor-timestamp": timestamp,
      "x-generation-executor-signature": signExecutorBody(
        config.hmacSecret,
        timestamp,
        body,
      ),
    },
  };
}

function fixture(
  pipeline: ExecutorPipeline,
  store = new MemoryExecutionStore(config.executionScope),
) {
  return {
    handler: createGenerationExecutorHandler({ config, store, pipeline }),
    store,
  };
}

test("rejects invalid authentication before provider or storage", async () => {
  let calls = 0;
  const { handler } = fixture({
    async generate() {
      calls++;
      return [];
    },
    async upload() {
      calls++;
    },
  });
  const response = await handler({ body: JSON.stringify(input), headers: {} });
  assert.equal(response.statusCode, 401);
  assert.equal(calls, 0);
});

test("deduplicates concurrent execution and replays completion", async () => {
  const { prepareLogoRequest } = await import("../../../src/server/generation/contract.ts");
  const prepared = await prepareLogoRequest(input);
  const valid = {
    ...input,
    fingerprint: prepared.fingerprint,
    plannedOutputIds: prepared.icons.map((icon) => icon.id),
  };
  let providerCalls = 0;
  let uploadCalls = 0;
  const { handler } = fixture({
    async generate() {
      providerCalls++;
      await new Promise((resolve) => setTimeout(resolve, 10));
      return ["fixture-image"];
    },
    async upload() {
      uploadCalls++;
    },
  });
  const body = JSON.stringify(valid);
  const event = await signedEvent(body);
  const [first, second] = await Promise.all([handler(event), handler(event)]);
  assert.equal([first.statusCode, second.statusCode].filter((code) => code === 200).length, 2);
  assert.equal(providerCalls, 1);
  assert.equal(uploadCalls, 1);
  const replay = await handler(event);
  assert.equal(replay.body.includes('"completed"'), true);
});
