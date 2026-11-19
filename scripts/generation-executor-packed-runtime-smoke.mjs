import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import path from "node:path";

const packageRoot = "/opt/package";
const require = createRequire(path.join(packageRoot, "package.json"));
const sharp = require("sharp");
const handlerModule = require(path.join(packageRoot, "handler.cjs"));
assert.equal(typeof handlerModule.createGenerationExecutorHandler, "function");
assert.equal(typeof handlerModule.handler, "function");

/** @typedef {{userId: string, requestId: string, prompt: string, model: string, numberOfImages: number, aspectRatio: string, executionScope: string, fingerprint: string, shouldWatermark: boolean, plannedOutputIds: string[]}} FixtureInput */
/** @type {FixtureInput} */
const fixture = JSON.parse(await readFile(path.join(packageRoot, "fixture-request.json"), "utf8"));
const secret = "fixture-executor-secret";
const records = new Map();
let providerCalls = 0;
let uploadCalls = 0;

const store = {
  /** @param {FixtureInput} input */
  async begin(input) {
    const key = `${input.executionScope}:${input.userId}:${input.requestId}`;
    const existing = records.get(key);
    if (!existing) {
      const ownerToken = "fixture-owner-token";
      records.set(key, { status: "running", ownerToken });
      return { kind: "new", ownerToken };
    }
    if (existing.status === "completed") return { kind: "completed", outputIds: fixture.plannedOutputIds };
    if (existing.status === "failed") return { kind: "failed", certainty: "definitive", reason: "provider" };
    return { kind: "ambiguous" };
  },
  /** @param {FixtureInput} input @param {string} ownerToken */
  async complete(input, ownerToken) {
    const key = `${input.executionScope}:${input.userId}:${input.requestId}`;
    const existing = records.get(key);
    assert.equal(existing?.ownerToken, ownerToken);
    records.set(key, { status: "completed", outputIds: input.plannedOutputIds });
  },
  /** @param {FixtureInput} input @param {string} ownerToken @param {Record<string, unknown>} failure */
  async fail(input, ownerToken, failure) {
    const key = `${input.executionScope}:${input.userId}:${input.requestId}`;
    const existing = records.get(key);
    assert.equal(existing?.ownerToken, ownerToken);
    records.set(key, { status: "failed", failure });
  },
};

const baseImage = await sharp({
  create: { width: 64, height: 64, channels: 4, background: { r: 40, g: 80, b: 160, alpha: 1 } },
}).png().toBuffer();
const watermark = await sharp(path.join(packageRoot, "public", "watermark.png"))
  .resize({ width: 16 })
  .png()
  .toBuffer();

/** @param {string} base64 @param {boolean} shouldWatermark */
async function render(base64, shouldWatermark) {
  const input = sharp(Buffer.from(base64, "base64"));
  const output = shouldWatermark
    ? await input.composite([{ input: watermark, gravity: "southeast" }]).png().toBuffer()
    : await input.png().toBuffer();
  const metadata = await sharp(output).metadata();
  assert.equal(metadata.format, "png");
  assert.equal(metadata.width, 64);
  assert.equal(metadata.height, 64);
  return output;
}

const pipeline = {
  async generate() {
    providerCalls++;
    return [baseImage.toString("base64")];
  },
  /** @param {unknown} _icon @param {string} base64 @param {boolean} shouldWatermark */
  async upload(_icon, base64, shouldWatermark) {
    uploadCalls++;
    await render(base64, shouldWatermark);
  },
};

const handler = handlerModule.createGenerationExecutorHandler({
  config: {
    replicateApiToken: "fixture-only",
    hmacSecret: secret,
    executionScope: "fixture-scope",
    executionTable: "fixture-only",
    awsRegion: "us-east-1",
    bucketName: "fixture-only",
  },
  store,
  pipeline,
});

/** @param {string} body @param {string} [signatureSecret] */
function event(body, signatureSecret = secret) {
  const timestamp = String(Date.now());
  const signature = createHmac("sha256", signatureSecret)
    .update(`${timestamp}.${body}`)
    .digest("hex");
  return {
    body,
    headers: {
      "x-generation-executor-timestamp": timestamp,
      "x-generation-executor-signature": signature,
    },
  };
}

assert.equal((await handler(event(JSON.stringify(fixture), "wrong-secret"))).statusCode, 401);
assert.equal((await handler(event("{}"))).statusCode, 400);
const first = await handler(event(JSON.stringify(fixture)));
assert.equal(first.statusCode, 200);
assert.equal(JSON.parse(first.body).data.status, "completed");
assert.deepEqual(JSON.parse(first.body).data.outputIds, fixture.plannedOutputIds);
assert.equal(providerCalls, 1);
assert.equal(uploadCalls, 1);
const replay = await handler(event(JSON.stringify(fixture)));
assert.equal(replay.statusCode, 200);
assert.equal(JSON.parse(replay.body).data.status, "completed");
assert.equal(providerCalls, 1);
assert.equal(uploadCalls, 1);
const watermarked = await render(baseImage.toString("base64"), true);
const plain = await render(baseImage.toString("base64"), false);
assert.notDeepEqual(watermarked, plain);
console.log(JSON.stringify({
  handler: "PASS",
  invalidHmac: "PASS",
  invalidInput: "PASS",
  freshExecution: "PASS",
  completedReplayWithoutProviderOrUpload: "PASS",
  watermarkRendering: "PASS",
  noWatermarkRendering: "PASS",
  unexpectedNetwork: "BLOCKED_BY_NETWORK_NONE",
}));

