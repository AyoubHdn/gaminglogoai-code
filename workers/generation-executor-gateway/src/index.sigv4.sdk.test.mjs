import assert from "node:assert/strict";
import test from "node:test";
import { Sha256 } from "@aws-crypto/sha256-js";
import { HttpRequest } from "@smithy/protocol-http";
import { SignatureV4 } from "@smithy/signature-v4";
import { signedLambdaRequest } from "./index.ts";

/** @typedef {import("./index.ts").SigningEnv} SigningEnv */
/** @typedef {{ input: string, headers: Headers, body: string }} CapturedRequest */
/** @type {SigningEnv} */
const baseEnv = { AWS_REGION: "us-east-1", GENERATION_LAMBDA_FUNCTION_URL: "https://example.lambda-url.us-east-1.on.aws/execute?mode=fixture", AWS_ACCESS_KEY_ID: "ASIAEXAMPLE", AWS_SECRET_ACCESS_KEY: "secret-example" };
/** @param {string} value */
function dateOf(value) { return new Date(`${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}T${value.slice(9, 11)}:${value.slice(11, 13)}:${value.slice(13, 15)}.000Z`); }
/** @param {SigningEnv} env @returns {Promise<CapturedRequest>} */
async function capture(env) {
  const original = globalThis.fetch; /** @type {CapturedRequest | undefined} */ let captured;
  globalThis.fetch = async (input, init) => { captured = { input: String(input), headers: new Headers(init?.headers), body: String(init?.body ?? "") }; return new Response("ok"); };
  try { await signedLambdaRequest(env, JSON.stringify({ requestId: "fixture", executionScope: "gaminglogoai-staging" }), "1760000000000", "root-signature"); } finally { globalThis.fetch = original; }
  assert.ok(captured); return captured;
}
/** @param {CapturedRequest} captured @param {SigningEnv} env @returns {Promise<string>} */
async function sdkAuth(captured, env) {
  const target = new URL(captured.input); const headers = Object.fromEntries(captured.headers.entries()); delete headers.authorization; headers.host = target.host;
  const request = new HttpRequest({ protocol: target.protocol, hostname: target.hostname, port: target.port ? Number(target.port) : undefined, method: "POST", path: target.pathname, query: Object.fromEntries(target.searchParams.entries()), headers, body: captured.body });
  const signer = new SignatureV4({ service: "lambda", region: env.AWS_REGION, credentials: { accessKeyId: env.AWS_ACCESS_KEY_ID, secretAccessKey: env.AWS_SECRET_ACCESS_KEY, ...(env.AWS_SESSION_TOKEN ? { sessionToken: env.AWS_SESSION_TOKEN } : {}) }, sha256: Sha256 });
  const amzDate = captured.headers.get("x-amz-date");
  assert.ok(amzDate);
  const authorization = (await signer.sign(request, { signingDate: dateOf(amzDate) })).headers.authorization;
  if (typeof authorization !== "string") throw new Error("AWS SDK authorization header missing");
  return authorization;
}
/** @type {SigningEnv} */
const temporaryEnv = { ...baseEnv, AWS_SESSION_TOKEN: "session-token-example" };
for (const env of [baseEnv, temporaryEnv]) test(`manual SigV4 matches AWS SDK (${env.AWS_SESSION_TOKEN ? "temporary" : "long-lived"})`, async () => { const captured = await capture(env); assert.equal(captured.headers.get("authorization"), await sdkAuth(captured, env)); });
