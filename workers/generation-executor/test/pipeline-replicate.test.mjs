import assert from "node:assert/strict";
import test from "node:test";
import Replicate from "replicate";
import { Response as NodeFetchResponse } from "node-fetch";
import sharp from "sharp";
import { prepareLogoRequest } from "../../../src/server/generation/contract.ts";
import { signExecutorBody } from "../src/hmac.ts";
import { createNodeExecutorPipeline } from "../src/pipeline.ts";
import { MemoryExecutionStore } from "../src/store.ts";

/** @type {import("../src/config.ts").ExecutorConfig} */
const config = {
  replicateApiToken: "offline-replicate-token",
  hmacSecret: "offline-hmac",
  executionScope: "gaminglogoai-staging",
  executionTable: "offline-table",
  awsRegion: "us-east-1",
  bucketName: "offline-bucket",
  outputPrefix: "generation-staging/",
};

/** @returns {Promise<Buffer>} */
async function makePng() {
  return sharp({
    create: { width: 32, height: 32, channels: 4, background: { r: 20, g: 80, b: 180, alpha: 1 } },
  }).png().toBuffer();
}

/** @typedef {{ input?: { num_outputs?: unknown, output_format?: unknown }, [key: string]: unknown }} ApiBody */
/** @typedef {{ mode: "success" | "invalid", outputUrl: string, apiCalls: number, downloadCalls: number, lastApiUrl: string, lastApiBody: ApiBody | null }} ApiState */
/** @typedef {{ Bucket?: unknown, Key?: unknown, Body?: unknown }} UploadInput */
/** @typedef {typeof globalThis.fetch} GlobalFetch */
/** @typedef {typeof import("node-fetch").default} NodeFetch */
/** @param {ApiState} state */
function apiFetchFactory(state) {
  /** @type {GlobalFetch} */
  const fetcher = async (url, init) => {
    state.apiCalls += 1;
    state.lastApiUrl = String(url);
    state.lastApiBody = JSON.parse(String(init?.body ?? "{}"));
    if (state.mode === "invalid") {
      return new Response(JSON.stringify({ id: "prediction-invalid", status: "succeeded", output: { unexpected: true } }), {
        status: 201,
        headers: { "content-type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ id: "prediction-offline", status: "succeeded", output: [state.outputUrl] }), {
      status: 201,
      headers: { "content-type": "application/json" },
    });
  };
  return fetcher;
}

/** @param {Buffer} image @param {ApiState} state */
function downloadFetchFactory(image, state) {
  /** @type {NodeFetch} */
  const fetcher = async (url) => {
    state.downloadCalls += 1;
    assert.equal(String(url), state.outputUrl);
    return new NodeFetchResponse(image, { status: 200, headers: { "content-type": "image/png" } });
  };
  return fetcher;
}

/** @param {unknown} output @returns {string[]} */
function requireStringOutputs(output) {
  if (!Array.isArray(output) || !output.every((value) => typeof value === "string")) {
    throw new Error("PROVIDER_OUTPUT_INVALID");
  }
  return output;
}

/** @param {import("../../../src/server/generation/contract.ts").GenerationExecutionRequest} input */
async function signedEvent(input) {
  const body = JSON.stringify(input);
  const timestamp = String(Date.now());
  return {
    body,
    headers: {
      "x-generation-executor-timestamp": timestamp,
      "x-generation-executor-signature": signExecutorBody(config.hmacSecret, timestamp, body),
    },
  };
}

/** @returns {Promise<import("../../../src/server/generation/contract.ts").GenerationExecutionRequest>} */
async function validInput() {
  const prepared = await prepareLogoRequest({
    userId: "gla-offline-sdk-user",
    requestId: "22222222-2222-4222-8222-222222222222",
    prompt: "offline logo",
    model: "flux-schnell",
    numberOfImages: 1,
    aspectRatio: "1:1",
  });
  return {
    ...prepared.input,
    executionScope: config.executionScope,
    fingerprint: prepared.fingerprint,
    shouldWatermark: false,
    plannedOutputIds: prepared.icons.map((icon) => icon.id),
  };
}

test("Replicate 1.4.0 FileOutput behavior and fixed URL-string pipeline use mocked HTTP only", async () => {
  const image = await makePng();
  /** @type {ApiState} */
  const state = { mode: "success", outputUrl: "https://files.replicate.com/offline.png", apiCalls: 0, downloadCalls: 0, lastApiUrl: "", lastApiBody: null };
  const originalFetch = globalThis.fetch;
  globalThis.fetch = apiFetchFactory(state);
  try {
    const defaultClient = new Replicate({ auth: config.replicateApiToken, fetch: globalThis.fetch });
    const defaultOutput = /** @type {unknown[]} */ (/** @type {unknown} */ (await defaultClient.run("black-forest-labs/flux-schnell", { input: { prompt: "offline" } })));
    assert.equal(Array.isArray(defaultOutput), true);
    const firstOutput = defaultOutput[0];
    assert.ok(firstOutput && typeof firstOutput === "object");
    const firstOutputObject = /** @type {{ constructor: { name: string } }} */ (firstOutput);
    assert.equal(firstOutputObject.constructor.name, "FileOutput");
    assert.throws(() => requireStringOutputs(defaultOutput), /PROVIDER_OUTPUT_INVALID/);

    /** @type {UploadInput[]} */
    const uploads = [];
    const pipeline = createNodeExecutorPipeline(config, {}, {
      download: downloadFetchFactory(image, state),
      s3: { async send(command) { uploads.push(command.input); return {}; } },
    });
    const input = await validInput();
    const generated = await pipeline.generate(input);
    const generatedImage = generated[0];
    assert.equal(typeof generatedImage, "string");
    if (typeof generatedImage !== "string") throw new Error("expected generated image");
    assert.equal(Buffer.from(generatedImage, "base64").equals(image), true);
    assert.ok(state.lastApiBody);
    const apiBody = state.lastApiBody;
    assert.ok(apiBody.input);
    assert.match(state.lastApiUrl, /^https:\/\/api\.replicate\.com\/v1\/models\/black-forest-labs\/flux-schnell\/predictions$/);
    assert.equal(apiBody.input.num_outputs, 1);
    assert.equal(apiBody.input.output_format, "png");
    assert.equal("useFileOutput" in apiBody, false);
    assert.equal(state.downloadCalls, 1);
    const outputId = input.plannedOutputIds[0];
    if (typeof outputId !== "string") throw new Error("expected planned output id");
    await pipeline.upload({ id: outputId, prompt: input.prompt, imageKey: null }, generatedImage, false);
    assert.equal(uploads.length, 1);
    const upload = uploads[0];
    assert.ok(upload);
    assert.equal(upload.Bucket, config.bucketName);
    assert.equal(upload.Key, `${config.outputPrefix}${outputId}`);
    assert.ok(upload.Body instanceof Uint8Array);
    const metadata = await sharp(upload.Body).metadata();
    assert.equal(metadata.format, "png");
    assert.equal(metadata.width, 32);
    assert.equal(metadata.height, 32);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("actual SDK pipeline replays without another provider, download, or upload", async () => {
  const image = await makePng();
  /** @type {ApiState} */
  const state = { mode: "success", outputUrl: "https://files.replicate.com/offline.png", apiCalls: 0, downloadCalls: 0, lastApiUrl: "", lastApiBody: null };
  const originalFetch = globalThis.fetch;
  globalThis.fetch = apiFetchFactory(state);
  try {
    /** @type {UploadInput[]} */
    const uploads = [];
    const pipeline = createNodeExecutorPipeline(config, {}, { download: downloadFetchFactory(image, state), s3: { async send(command) { uploads.push(command.input); return {}; } } });
    const input = await validInput();
    const store = new MemoryExecutionStore(config.executionScope);
    const { createGenerationExecutorHandler } = await import("../src/handler.ts");
    const handler = createGenerationExecutorHandler({ config, store, pipeline });
    const event = await signedEvent(input);
    const first = await handler(event);
    const replay = await handler(event);
    assert.equal(first.statusCode, 200, first.body);
    assert.equal(JSON.parse(first.body).data.status, "completed", first.body);
    assert.equal(replay.statusCode, 200);
    assert.equal(JSON.parse(first.body).data.status, "completed");
    assert.deepEqual(JSON.parse(replay.body).data.outputIds, input.plannedOutputIds);
    assert.equal(state.apiCalls, 1);
    assert.equal(state.downloadCalls, 1);
    assert.equal(uploads.length, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("provider output failure is persisted as ambiguous without an upload", async () => {
  const image = await makePng();
  /** @type {ApiState} */
  const state = { mode: "invalid", outputUrl: "https://files.replicate.com/offline.png", apiCalls: 0, downloadCalls: 0, lastApiUrl: "", lastApiBody: null };
  const originalFetch = globalThis.fetch;
  globalThis.fetch = apiFetchFactory(state);
  try {
    /** @type {UploadInput[]} */
    const uploads = [];
    const pipeline = createNodeExecutorPipeline(config, {}, { download: downloadFetchFactory(image, state), s3: { async send(command) { uploads.push(command.input); return {}; } } });
    const input = await validInput();
    const store = new MemoryExecutionStore(config.executionScope);
    const { createGenerationExecutorHandler } = await import("../src/handler.ts");
    const handler = createGenerationExecutorHandler({ config, store, pipeline });
    const response = await handler(await signedEvent(input));
    assert.equal(response.statusCode, 200);
    assert.deepEqual(JSON.parse(response.body).data, { status: "failed", certainty: "ambiguous", reason: "unavailable" });
    assert.equal(state.apiCalls, 1);
    assert.equal(state.downloadCalls, 0);
    assert.equal(uploads.length, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("upload failure is persisted as ambiguous after actual image finalization", async () => {
  const image = await makePng();
  /** @type {ApiState} */
  const state = { mode: "success", outputUrl: "https://files.replicate.com/offline.png", apiCalls: 0, downloadCalls: 0, lastApiUrl: "", lastApiBody: null };
  const originalFetch = globalThis.fetch;
  globalThis.fetch = apiFetchFactory(state);
  try {
    const pipeline = createNodeExecutorPipeline(config, {}, { download: downloadFetchFactory(image, state), s3: { async send() { throw new Error("offline S3 failure"); } } });
    const input = await validInput();
    const store = new MemoryExecutionStore(config.executionScope);
    const { createGenerationExecutorHandler } = await import("../src/handler.ts");
    const handler = createGenerationExecutorHandler({ config, store, pipeline });
    const response = await handler(await signedEvent(input));
    assert.equal(response.statusCode, 200);
    assert.deepEqual(JSON.parse(response.body).data, { status: "failed", certainty: "ambiguous", reason: "unavailable" });
    assert.equal(state.apiCalls, 1);
    assert.equal(state.downloadCalls, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
