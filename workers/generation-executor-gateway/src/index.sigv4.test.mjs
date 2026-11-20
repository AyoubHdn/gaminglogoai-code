import assert from "node:assert/strict";
import test from "node:test";
import { signedLambdaRequest } from "./index.ts";

const baseEnv = { AWS_REGION: "us-east-1", GENERATION_LAMBDA_FUNCTION_URL: "https://example.lambda-url.us-east-1.on.aws/", AWS_ACCESS_KEY_ID: "ASIAEXAMPLE", AWS_SECRET_ACCESS_KEY: "secret-example" };

test("temporary credentials include the security token in the signature", async () => {
  const original = globalThis.fetch;
  /** @type {Array<{headers: Headers}>} */ const captured = [];
  globalThis.fetch = async (input, init) => { captured.push({ headers: new Headers(init?.headers) }); return new Response("ok"); };
  try { await signedLambdaRequest({ ...baseEnv, AWS_SESSION_TOKEN: "session-token-example" }, JSON.stringify({ requestId: "fixture" }), "1760000000000", "root-signature"); } finally { globalThis.fetch = original; }
  assert.equal(captured.length, 1);
  const result = captured[0]; assert.ok(result);
  assert.equal(result.headers.get("x-amz-security-token"), "session-token-example");
  assert.match(result.headers.get("authorization") ?? "", /x-amz-security-token/);
});

test("long-lived credentials omit the security token", async () => {
  const original = globalThis.fetch;
  /** @type {Array<{headers: Headers}>} */ const captured = [];
  globalThis.fetch = async (input, init) => { captured.push({ headers: new Headers(init?.headers) }); return new Response("ok"); };
  try { await signedLambdaRequest(baseEnv, JSON.stringify({ requestId: "fixture" }), "1760000000000", "root-signature"); } finally { globalThis.fetch = original; }
  assert.equal(captured.length, 1);
  const result = captured[0]; assert.ok(result);
  assert.equal(result.headers.get("x-amz-security-token"), null);
  assert.doesNotMatch(result.headers.get("authorization") ?? "", /x-amz-security-token/);
});
