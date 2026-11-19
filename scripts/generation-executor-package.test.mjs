import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { MemoryExecutionStore } from "../workers/generation-executor/src/store.ts";
import { signExecutorBody, verifyExecutorBody } from "../workers/generation-executor/src/hmac.ts";

test("executor HMAC accepts the exact body and rejects stale or changed bodies", () => {
  const body = JSON.stringify({ requestId: "request" });
  const timestamp = String(Date.now());
  const signature = signExecutorBody("fixture-secret", timestamp, body);
  assert.equal(verifyExecutorBody("fixture-secret", timestamp, body, signature), true);
  assert.equal(verifyExecutorBody("fixture-secret", timestamp, `${body}x`, signature), false);
  assert.equal(
    verifyExecutorBody("fixture-secret", String(Date.now() - 6 * 60 * 1000), body, signature),
    false,
  );
});

test("durable-store fixture does not replay a running execution", async () => {
  const store = new MemoryExecutionStore("gaminglogoai-staging");
  /** @type {import("../src/server/generation/contract.ts").GenerationExecutionRequest} */
  const input = {
    userId: "user",
    requestId: "request",
    executionScope: "gaminglogoai-staging",
    fingerprint: "fingerprint",
    prompt: "prompt",
    model: "flux-schnell",
    numberOfImages: 1,
    aspectRatio: "1:1",
    shouldWatermark: false,
    plannedOutputIds: ["output"],
  };
  assert.equal((await store.begin(input)).kind, "new");
  assert.equal((await store.begin(input)).kind, "ambiguous");
  await store.complete(input, store.records.values().next().value.ownerToken);
  assert.deepEqual((await store.begin(input)), { kind: "completed", outputIds: ["output"] });
});

test("package manifest stays credential-free", async () => {
  const source = await readFile("workers/generation-executor/template.yaml", "utf8");
  assert.equal(source.includes("REPLICATE_API_TOKEN"), true);
  assert.equal(source.includes("<SECRET_MANAGER_OR_PARAMETER_STORE_REFERENCE>"), true);
  assert.equal(source.includes("sk_live_"), false);
  assert.equal(source.includes("AKIA"), false);
  assert.ok(createHash("sha256").update(source).digest("hex").length === 64);
});
