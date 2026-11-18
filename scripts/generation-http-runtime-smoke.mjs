import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { copyFile, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(process.env.GENERATION_HTTP_FIXTURE_ROOT ?? process.cwd());
const outputRoot = process.env.GENERATION_HTTP_FIXTURE_ROOT
  ? path.resolve(process.env.GENERATION_HTTP_FIXTURE_ROOT)
  : path.join(root, ".open-next");
const require = createRequire(path.join(root, "package.json"));
const wranglerRequire = createRequire(require.resolve("wrangler/package.json"));
const miniflarePath = wranglerRequire.resolve("miniflare");
const miniflareRequire = createRequire(miniflarePath);
const workerdVersion = JSON.parse(
  await readFile(miniflareRequire.resolve("workerd/package.json"), "utf8"),
).version;
const miniflareVersion = JSON.parse(
  await readFile(wranglerRequire.resolve("miniflare/package.json"), "utf8"),
).version;
const { Miniflare, Log, LogLevel, convertV4MiniflareOptions } =
  await import(pathToFileURL(miniflarePath).href);

const origin = "https://gaminglogoai-generation.fixture.invalid";
const userA = "gla-generation-http-user-a";
const userB = "gla-generation-http-user-b";
const tokenA = "gla-generation-http-token-a";
const tokenB = "gla-generation-http-token-b";
const requestA = "8a8b8c8d-8e8f-4a4b-8c8d-8e8f8a8b8c8d";
const requestB = "9a9b9c9d-9e9f-4a4b-8c9d-9e9f9a9b9c9d";
const iconId = "a".repeat(64);

/** @param {string} compatibilityDate @param {string} version */
function supportedRuntimeDate(compatibilityDate, version) {
  const match = /^1\.(\d{4})(\d{2})(\d{2})\./.exec(version);
  if (!match) throw new Error("Unrecognized workerd version");
  const binaryDate = `${match[1]}-${match[2]}-${match[3]}`;
  return compatibilityDate < binaryDate ? compatibilityDate : binaryDate;
}

/** @param {string} directory */
/** @param {string} directory @returns {Promise<string[]>} */
async function allFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await allFiles(full)));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

/** @param {string} directory */
function createAssetFixture(directory) {
  /** @param {Request} request */
  return async (request) => {
    const pathname = decodeURIComponent(new URL(request.url).pathname);
    if (pathname.includes("\\") || pathname.includes("\0"))
      return new Response(null, { status: 400 });
    const file = path.resolve(directory, pathname.replace(/^\/+/, ""));
    const relative = path.relative(directory, file);
    if (
      relative === ".." ||
      relative.startsWith(`..${path.sep}`) ||
      path.isAbsolute(relative)
    )
      return new Response(null, { status: 403 });
    for (const candidate of [file, `${file}.html`, path.join(file, "index.html")]) {
      try {
        if (!(await stat(candidate)).isFile()) continue;
        return new Response(await readFile(candidate));
      } catch (error) {
        const code = /** @type {{code?: string}} */ (error).code;
        if (code !== "ENOENT" && code !== "ENOTDIR") throw error;
      }
    }
    return new Response(null, { status: 404 });
  };
}

function createDbFixture() {
  /** @type {string[]} */
  const operations = [];
  /** @type {Array<{operation: unknown, input: Record<string, unknown>}>} */
  const calls = [];
  const states = new Map();
  let unexpected = 0;
  const users = new Map([
    [tokenA, { id: userA, email: "a@gaminglogoai.invalid" }],
    [tokenB, { id: userB, email: "b@gaminglogoai.invalid" }],
  ]);
  /** @param {unknown} data @param {number=} status */
  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { "content-type": "application/json" },
    });
  return {
    operations,
    calls,
    get unexpected() {
      return unexpected;
    },
    /** @param {Request} request */
    async fetch(request) {
      if (request.method !== "POST") {
        unexpected += 1;
        return json({ ok: false, error: { code: "METHOD" } }, 405);
      }
      const body = /** @type {{operation?: unknown, input?: Record<string, unknown>}} */ (await request.json());
      const operation = body?.operation;
      const input = body?.input ?? {};
      calls.push({ operation, input });
      if (operation === "auth.getSessionAndUser") {
        const user = users.get(String(input.sessionToken));
        if (!user) return json({ ok: true, data: null });
        operations.push(operation);
        return json({
          ok: true,
          data: {
            session: {
              sessionToken: input.sessionToken,
              userId: user.id,
              expires: "2030-01-01T00:00:00.000Z",
            },
            user: {
              id: user.id,
              email: user.email,
              name: user.id,
              image: null,
              emailVerified: null,
            },
          },
        });
      }
      if (operation === "auth.deleteSession") {
        operations.push(operation);
        return json({ ok: true, data: null });
      }
      if (operation === "generation.reserveLogo") {
        if (input.userId !== userA && input.userId !== userB)
          return json(
            { ok: false, error: { code: "GENERATION_USER_NOT_FOUND" } },
            404,
          );
        const key = `${input.userId}:${input.requestId}`;
        const previous = states.get(key);
        operations.push(operation);
        if (previous)
          return json({
            ok: true,
            data: {
              acquired: false,
              state: previous.state,
              icons: previous.icons,
              shouldWatermark: false,
              credits: 9,
              email: null,
              name: null,
            },
          });
        const reservation = {
          acquired: true,
          state: "reserved",
          icons: [{ id: iconId, prompt: input.prompt, imageKey: null }],
          shouldWatermark: false,
          credits: 9,
          email: null,
          name: null,
        };
        states.set(key, { state: "reserved", icons: reservation.icons });
        return json({ ok: true, data: reservation });
      }
      if (
        operation === "generation.completeLogo" ||
        operation === "generation.refundLogo"
      ) {
        operations.push(operation);
        const state = states.get(`${input.userId}:${input.requestId}`);
        if (!state)
          return json(
            { ok: false, error: { code: "GENERATION_NOT_FOUND" } },
            404,
          );
        if (operation === "generation.completeLogo" && state.state === "reserved")
          state.state = "completed";
        if (operation === "generation.refundLogo" && state.state === "reserved")
          state.state = "refunded";
        return json({ ok: true, data: state.state });
      }
      unexpected += 1;
      return json({ ok: false, error: { code: "UNEXPECTED_OPERATION" } }, 403);
    },
  };
}

const bundle = path.join(outputRoot, "worker.js");
const assets = path.join(outputRoot, "assets");
const compiledWorker = path.join(root, ".ci-generation-worker.mjs");
await copyFile(bundle, compiledWorker);
const entryShim = path.join(root, ".ci-generation-entry.mjs");
await writeFile(
  entryShim,
  'import { AsyncLocalStorage } from "node:async_hooks";\n' +
    'import * as fs from "node:fs";\n' +
    'import * as fsPromises from "node:fs/promises";\n' +
    'import * as path from "node:path";\n' +
    'import * as url from "node:url";\n' +
    'import * as vm from "node:vm";\n' +
    'import * as crypto from "node:crypto";\n' +
    'import * as buffer from "node:buffer";\n' +
    'import * as util from "node:util";\n' +
    'import * as processModule from "node:process";\n' +
    'import * as stream from "node:stream";\n' +
    'import * as events from "node:events";\n' +
    'import * as os from "node:os";\n' +
    'import * as querystring from "node:querystring";\n' +
    'import * as stringDecoder from "node:string_decoder";\n' +
    'import * as assert from "node:assert";\n' +
    'import * as http from "node:http";\n' +
    'import * as https from "node:https";\n' +
    'globalThis.AsyncLocalStorage = AsyncLocalStorage;\n' +
    'globalThis.require = (specifier) => {\n' +
    '  if (specifier === "async_hooks") return { AsyncLocalStorage };\n' +
    '  if (specifier === "fs") return fs;\n' +
    '  if (specifier === "fs/promises") return fsPromises;\n' +
    '  if (specifier === "path") return path;\n' +
    '  if (specifier === "url") return url;\n' +
    '  if (specifier === "vm") return vm;\n' +
    '  if (specifier === "crypto") return crypto;\n' +
    '  if (specifier === "buffer") return buffer;\n' +
    '  if (specifier === "util") return util;\n' +
    '  if (specifier === "process") return processModule;\n' +
    '  if (specifier === "stream") return stream;\n' +
    '  if (specifier === "events") return events;\n' +
    '  if (specifier === "os") return os;\n' +
    '  if (specifier === "querystring") return querystring;\n' +
    '  if (specifier === "string_decoder") return stringDecoder;\n' +
    '  if (specifier === "assert") return assert;\n' +
    '  if (specifier === "http") return http;\n' +
    '  if (specifier === "https") return https;\n' +
    '  throw new Error(`Unsupported fixture require: ${String(specifier)}`);\n' +
    '};\n' +
    'const compiled = await import("./.ci-generation-worker.mjs");\n' +
    'export default compiled.default;\n',
);
const appProxy = path.join(root, ".ci-generation-app-proxy.mjs");
await writeFile(
  appProxy,
  'export default {async fetch(request,env){const url=new URL(request.url);if(url.pathname==="/__fixture/body-echo"){try{const bytes=new Uint8Array(await request.arrayBuffer());return new Response(JSON.stringify({receivedBytes:bytes.byteLength,contentLength:request.headers.get("content-length"),transferEncoding:request.headers.get("transfer-encoding")}),{status:200,headers:{"content-type":"application/json"}});}catch(error){return new Response(JSON.stringify({errorType:error?.constructor?.name??"unknown",errorCode:error?.code??null}),{status:500,headers:{"content-type":"application/json"}});}}return env.NEXT.fetch(request);}};'
);
const moduleFiles = [
  entryShim,
  compiledWorker,
  appProxy,
  ...(await allFiles(outputRoot)).filter(
    (file) => file !== bundle && file !== compiledWorker && file !== entryShim && file !== appProxy,
  ),
]
  .filter((file) => file.endsWith(".js") || file.endsWith(".mjs"))
  .map((file) => ({ type: "ESModule", path: file }));
const runtimeDate = supportedRuntimeDate("2026-11-12", workerdVersion);
const fixture = createDbFixture();
let blockedOutbound = 0;
let mockedS3Uploads = 0;
/** @type {string[]} */
const blockedUrls = [];
const bindings = {
  NODE_ENV: "production",
  DB_AUTH_BACKEND: "service",
  DB_READS_BACKEND: "service",
  DB_GENERATION_BACKEND: "service",
  CLOUDFLARE_READ_ONLY_MODE: "false",
  DATABASE_URL: "postgresql://invalid:invalid@db.invalid:5432/invalid",
  NEXTAUTH_SECRET: "fixture-nextauth-secret",
  NEXTAUTH_URL: origin,
  HOST_NAME: origin,
  GOOGLE_CLIENT_ID: "fixture-google-client",
  GOOGLE_CLIENT_SECRET: "fixture-google-secret",
  REPLICATE_API_TOKEN: "fixture-replicate-token",
  MOCK_REPLICATE: "true",
  ACCESS_KEY_ID: "fixture-access-key",
  SECRET_ACCESS_KEY: "fixture-secret-key",
  STRIPE_SECRET_KEY: "sk_test_fixture",
  STRIPE_WEB_HOOK_SECRET: "whsec_fixture",
  PRICE_ID_STARTER: "price_fixture_starter",
  PRICE_ID_PRO: "price_fixture_pro",
  PRICE_ID_ELITE: "price_fixture_elite",
  NEXT_PUBLIC_AWS_REGION_GAMING: "us-east-1",
  NEXT_PUBLIC_S3_BUCKET_NAME_GAMING: "gaminglogoai-fixture",
  NEXT_PUBLIC_STRIPE_KEY: "pk_test_fixture",
  AUTH_EXTERNAL_SYNC_MODE: "disabled",
  MAUTIC_BASE_URL: "http://127.0.0.1:9",
  MAUTIC_USERNAME: "fixture-mautic-user",
  MAUTIC_PASSWORD: "fixture-mautic-password",
  CRON_SECRET: "fixture-cron-secret",
  MYLEAD_SECURITY_KEY: "fixture-mylead-key",
  IPAPI_KEY: "fixture-ipapi-key",
};
/** @param {Request} request */
const dbServiceBinding = (request) => fixture.fetch(request);
const appOptions = {
  name: "gaminglogoai-generation-http-fixture",
  modules: moduleFiles,
  modulesRoot: outputRoot,
  compatibilityDate: runtimeDate,
  compatibilityFlags: ["nodejs_compat", "nodejs_als"],
  bindings,
  serviceBindings: {
    DB_SERVICE: dbServiceBinding,
    ASSETS: createAssetFixture(assets),
  },
  /** @param {Request} request */
  outboundService: async (request) => {
    const url = new URL(request.url);
    if (url.hostname.endsWith(".amazonaws.com") && request.method === "PUT") {
      mockedS3Uploads += 1;
      return new Response(null, { status: 200 });
    }
    blockedOutbound += 1;
    blockedUrls.push(`${request.method} ${url.origin}${url.pathname}`);
    return new Response("blocked", { status: 502 });
  },
};
const runtimeOptions = {
  host: "127.0.0.1",
  port: 0,
  cf: false,
  log: new Log(LogLevel.ERROR),
  workers: [
    {
      name: "gaminglogoai-generation-http-front",
      routes: ["gaminglogoai-generation.fixture.invalid/*"],
      compatibilityDate: runtimeDate,
      compatibilityFlags: ["nodejs_compat", "nodejs_als"],
      modules: [
        {
          type: "ESModule",
          path: path.join(root, ".ci-generation-front.mjs"),
          contents:
            "export default {async fetch(request,env){if(request.method!=='GET'&&request.method!=='HEAD')return env.APP.fetch(request);const asset=await env.ASSETS.fetch(request);return asset.status===404?env.APP.fetch(request):asset;}};",
        },
      ],
      modulesRoot: root,
      serviceBindings: {
        APP: "gaminglogoai-generation-http-proxy",
        ASSETS: createAssetFixture(assets),
      },
    },
    {
      name: "gaminglogoai-generation-http-proxy",
      modules: [{ type: "ESModule", path: appProxy }],
      modulesRoot: root,
      compatibilityDate: runtimeDate,
      compatibilityFlags: ["nodejs_compat", "nodejs_als"],
      serviceBindings: {
        NEXT: "gaminglogoai-generation-http-fixture",
      },
    },
    appOptions,
  ],
};
/** @param {Record<string, unknown>} options */
const makeMiniflare = (options) =>
  new Miniflare(
    typeof convertV4MiniflareOptions === "function"
      ? convertV4MiniflareOptions(options)
      : options,
  );
const mf = makeMiniflare(runtimeOptions);
/** @type {string[]} */
const checks = [];
/** @typedef {{result: string, fixtureOnly: boolean, deployable: boolean, workerdVersion: string, miniflareVersion: string, runtimeCompatibilityDate: string, checks: string[], dbOperations: string[], dbCalls: Array<Record<string, unknown>>, mockedProviderCalls: number, mockedS3Uploads: number, blockedOutbound: number, blockedUrls: string[], missingBindingLayer: string|null, failurePhase: string|null, transportDiagnostics: Record<string, unknown>}} ProbeReport */
/** @type {ProbeReport} */
const report = {
  result: "GAMINGLOGOAI_GENERATION_HTTP_PROBE_STOPPED",
  fixtureOnly: true,
  deployable: false,
  workerdVersion,
  miniflareVersion,
  runtimeCompatibilityDate: runtimeDate,
  checks,
  dbOperations: fixture.operations,
  dbCalls: [],
  mockedProviderCalls: 0,
  mockedS3Uploads: 0,
  blockedOutbound: 0,
  blockedUrls,
  missingBindingLayer: null,
  failurePhase: null,
  transportDiagnostics: {},
};
/** @param {string|undefined} token @returns {Record<string, string>} */
const headers = (token) => ({
  ...(token ? { cookie: `__Secure-next-auth.session-token=${token}` } : {}),
  "content-type": "application/json",
});
/** @param {string} requestId @param {string=} prompt */
const mutationInput = (requestId, prompt = "Fixture gaming logo") => ({
  0: {
    json: {
      requestId,
      prompt,
      numberOfImages: 1,
      aspectRatio: "1:1",
      model: "flux-schnell",
    },
  },
});
/** @param {string} body @param {string|undefined} token @param {boolean} manual */
function postInit(body, token, manual) {
  return {
    method: "POST",
    headers: {
      ...headers(token),
      ...(manual ? { "content-length": String(Buffer.byteLength(body)) } : {}),
    },
    body,
  };
}
/** @param {"dispatch"|"loopback"} mode @param {string} pathname @param {string} body @param {string|undefined} token @param {boolean} manual */
async function post(mode, pathname, body, token, manual) {
  const init = postInit(body, token, manual);
  if (mode === "dispatch") return mf.dispatchFetch("https://gaminglogoai-generation.fixture.invalid" + pathname, init);
  const loopback = new URL(pathname, await mf.ready);
  return fetch(loopback, {
    ...init,
    headers: { ...init.headers, host: new URL(origin).host },
  });
}
/** @param {string} requestId @param {string=} token @param {string=} prompt @param {"dispatch"|"loopback"} mode @param {boolean} manual */
async function mutation(requestId, token, prompt, mode = "dispatch", manual = true) {
  const body = JSON.stringify(mutationInput(requestId, prompt));
  return post(
    mode,
    "/api/trpc/generate.generateIcon?batch=1",
    body,
    token,
    manual,
  );
}

/** @param {Response} response @returns {Promise<Record<string, unknown>>} */
async function summarizeErrorResponse(response) {
  const text = await response.text();
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const firstLine = lines[0]?.slice(0, 240) ?? "empty response";
  const frames = lines
    .filter((line) => line.startsWith("at "))
    .slice(0, 5)
    .map((line) => line.slice(0, 240));
  return { status: response.status, firstLine, frames };
}
try {
  await mf.ready;
  const echoBody = JSON.stringify({ fixture: "body-transport", value: "x".repeat(64) });
  const echoCases = {};
  for (const [mode, manual] of [
    ["dispatch", true],
    ["dispatch", false],
    ["loopback", true],
    ["loopback", false],
  ]) {
    const key = mode + "-" + (manual ? "manual" : "automatic");
    const echoResponse = await post(mode, "/__fixture/body-echo", echoBody, undefined, manual);
    const echoPayload = await echoResponse.json();
    const expectedBytes = Buffer.byteLength(echoBody);
    assert.equal(echoResponse.status, 200);
    assert.equal(echoPayload.receivedBytes, expectedBytes);
    if (manual) assert.equal(echoPayload.contentLength, String(expectedBytes));
    echoCases[key] = {
      status: echoResponse.status,
      sentBytes: expectedBytes,
      receivedBytes: echoPayload.receivedBytes,
      contentLength: echoPayload.contentLength ?? null,
      transferEncoding: echoPayload.transferEncoding ?? null,
    };
  }
  report.transportDiagnostics.echo = echoCases;
  checks.push("front-to-app-body-echo-preserved");

  const unknownBody = JSON.stringify({ 0: { json: {} } });
  for (const [mode, manual] of [["dispatch", true], ["loopback", false]]) {
    const key = mode + "-app-post";
    const unknownResponse = await post(
      mode,
      "/api/trpc/fixture.unknown?batch=1",
      unknownBody,
      undefined,
      manual,
    );
    const summary = await summarizeErrorResponse(unknownResponse);
    report.transportDiagnostics[key] = summary;
    assert.notEqual(summary.firstLine, "Invalid body");
  }
  checks.push("compiled-app-post-body-parsed");

  const anonymous = await mutation(requestA);
  if (anonymous.status !== 401) {
    report.failurePhase = JSON.stringify({
      expectedStatus: 401,
      response: await summarizeErrorResponse(anonymous),
    });
    throw new Error("anonymous request did not reach the protected route");
  }
  assert.equal(
    fixture.operations.filter((operation) => operation.startsWith("generation.")).length,
    0,
  );
  checks.push("anonymous-rejected-before-generation");

  const invalid = await mutation("not-a-uuid", tokenA);
  assert.ok(invalid.status === 400 || invalid.status === 422);
  assert.equal(
    fixture.operations.filter((operation) => operation === "generation.reserveLogo").length,
    0,
  );
  checks.push("invalid-input-rejected-before-charge");

  const first = await mutation(requestA, tokenA, "First fixture logo");
  assert.equal(first.status, 200);
  const firstBody = await first.json();
  assert.ok(JSON.stringify(firstBody).includes(iconId));
  const firstReserve = fixture.calls.find(
    (call) => call.operation === "generation.reserveLogo",
  );
  assert.equal(firstReserve?.input.userId, userA);
  checks.push("authenticated-generation-reached-db-service");

  const uploadsAfterFirst = mockedS3Uploads;
  const duplicate = await mutation(requestA, tokenA, "First fixture logo");
  assert.equal(duplicate.status, 200);
  assert.deepEqual(await duplicate.json(), firstBody);
  assert.equal(mockedS3Uploads, uploadsAfterFirst);
  assert.equal(
    fixture.operations.filter((operation) => operation === "generation.completeLogo").length,
    1,
  );
  checks.push("completed-replay-without-provider-or-upload");

  const second = await mutation(requestB, tokenB, "Second fixture logo");
  assert.equal(second.status, 200);
  const reserves = fixture.calls.filter(
    (call) => call.operation === "generation.reserveLogo",
  );
  assert.equal(reserves.at(-1)?.input.userId, userB);
  assert.notEqual(reserves[0]?.input.userId, reserves.at(-1)?.input.userId);
  checks.push("request-scoped-account-isolation");

  const noBindingOptions = {
    ...appOptions,
    serviceBindings: { ASSETS: createAssetFixture(assets) },
  };
  const noBindingMf = makeMiniflare({
    ...runtimeOptions,
    workers: [noBindingOptions],
  });
  try {
    await noBindingMf.ready;
    const missingBody = JSON.stringify(mutationInput(requestA));
    const missing = await noBindingMf.dispatchFetch(
      `${origin}/api/trpc/generate.generateIcon?batch=1`,
      {
        method: "POST",
        headers: {
          ...headers(tokenA),
          "content-length": String(Buffer.byteLength(missingBody)),
        },
        body: missingBody,
      },
    );
    assert.ok(missing.status >= 400);
    report.missingBindingLayer =
      "request authentication/runtime resolution before generation resolver";
    checks.push("missing-binding-fails-closed-before-generation");
  } finally {
    await noBindingMf.dispose();
  }

  assert.equal(fixture.unexpected, 0);
  report.result = "GAMINGLOGOAI_GENERATION_HTTP_PROBE_PASS";
} catch (error) {
  if (!report.failurePhase) {
    report.failurePhase = error instanceof Error ? error.message : "unknown";
  }
} finally {
  report.dbOperations = fixture.operations;
  report.dbCalls = fixture.calls.map(({ operation, input }) => ({
    operation,
    userId: input.userId ?? null,
    requestId: input.requestId ?? null,
    sessionTokenSeen: Boolean(input.sessionToken),
  }));
  report.mockedS3Uploads = mockedS3Uploads;
  report.blockedOutbound = blockedOutbound;
  await mf.dispose();
}
await mkdir(path.join(root, ".ci-generation-runtime"), { recursive: true });
await writeFile(
  path.join(root, ".ci-generation-runtime", "runtime-smoke-report.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
if (report.result !== "GAMINGLOGOAI_GENERATION_HTTP_PROBE_PASS") process.exitCode = 1;

