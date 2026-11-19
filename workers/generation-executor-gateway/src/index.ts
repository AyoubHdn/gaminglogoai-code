type Env = {
  GENERATION_EXECUTOR_HMAC_SECRET: string;
  GENERATION_EXECUTION_SCOPE: string;
  AWS_REGION: string;
  GENERATION_LAMBDA_FUNCTION_URL: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_SESSION_TOKEN?: string;
};

const encoder = new TextEncoder();

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

async function hmac(secret: ArrayBuffer | string, value: string): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey(
    "raw",
    typeof secret === "string" ? encoder.encode(secret) : secret,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", key, encoder.encode(value));
}

function hex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

async function verifyRootHmac(
  env: Env,
  body: string,
  timestamp: string | null,
  signature: string | null,
): Promise<boolean> {
  if (!timestamp || !signature) return false;
  const milliseconds = Number(timestamp);
  if (!Number.isSafeInteger(milliseconds) || Math.abs(Date.now() - milliseconds) > 5 * 60 * 1000)
    return false;
  const expected = hex(await hmac(env.GENERATION_EXECUTOR_HMAC_SECRET, `${timestamp}.${body}`));
  if (expected.length !== signature.length) return false;
  let difference = 0;
  for (let index = 0; index < expected.length; index++)
    difference |= expected.charCodeAt(index) ^ signature.charCodeAt(index);
  return difference === 0;
}

function awsPath(pathname: string): string {
  return pathname || "/";
}

async function signedLambdaRequest(
  env: Env,
  body: string,
  rootTimestamp: string,
  rootSignature: string,
): Promise<Response> {
  const target = new URL(env.GENERATION_LAMBDA_FUNCTION_URL);
  const payloadHash = await sha256Hex(body);
  const now = new Date();
  const amzDate = now.toISOString().replace(/[-:]|\.\d{3}/g, "");
  const date = amzDate.slice(0, 8);
  const service = "lambda";
  const scope = `${date}/${env.AWS_REGION}/${service}/aws4_request`;
  const canonicalHeaders = [
    `content-type:application/json`,
    `host:${target.host}`,
    `x-amz-content-sha256:${payloadHash}`,
    `x-amz-date:${amzDate}`,
    `x-generation-executor-signature:${rootSignature}`,
    `x-generation-executor-timestamp:${rootTimestamp}`,
  ].join("\n") + "\n";
  const signedHeaders =
    "content-type;host;x-amz-content-sha256;x-amz-date;x-generation-executor-signature;x-generation-executor-timestamp";
  const canonicalRequest = [
    "POST",
    awsPath(target.pathname),
    target.search.slice(1),
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    await sha256Hex(canonicalRequest),
  ].join("\n");
  const kDate = await hmac(`AWS4${env.AWS_SECRET_ACCESS_KEY}`, date);
  const kRegion = await hmac(kDate, env.AWS_REGION);
  const kService = await hmac(kRegion, service);
  const signingKey = await hmac(kService, "aws4_request");
  const signature = hex(await hmac(signingKey, stringToSign));
  const authorization = `AWS4-HMAC-SHA256 Credential=${env.AWS_ACCESS_KEY_ID}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  const headers = new Headers({
    "content-type": "application/json",
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
    "x-generation-executor-signature": rootSignature,
    "x-generation-executor-timestamp": rootTimestamp,
    authorization,
  });
  if (env.AWS_SESSION_TOKEN) headers.set("x-amz-security-token", env.AWS_SESSION_TOKEN);
  return fetch(target, { method: "POST", headers, body });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") return new Response("Not Found", { status: 404 });
    const body = await request.text();
    if (
      !(await verifyRootHmac(
        env,
        body,
        request.headers.get("x-generation-executor-timestamp"),
        request.headers.get("x-generation-executor-signature"),
      ))
    )
      return Response.json({ ok: false, error: "EXECUTOR_AUTH_FAILED" }, { status: 401 });
    try {
      const target = JSON.parse(body) as { userId?: unknown };
      if (!target.userId) return Response.json({ ok: false, error: "EXECUTION_REQUEST_INVALID" }, { status: 400 });
      if ((target as { executionScope?: unknown }).executionScope !== env.GENERATION_EXECUTION_SCOPE)
        return Response.json({ ok: false, error: "EXECUTION_SCOPE_MISMATCH" }, { status: 400 });
    } catch {
      return Response.json({ ok: false, error: "EXECUTION_REQUEST_INVALID" }, { status: 400 });
    }
    const timestamp = request.headers.get("x-generation-executor-timestamp")!;
    const signature = request.headers.get("x-generation-executor-signature")!;
    return signedLambdaRequest(env, body, timestamp, signature);
  },
};
