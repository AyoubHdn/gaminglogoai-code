import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
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
const moduleFiles = [bundle, ...(await allFiles(outputRoot)).filter((file) => file !== bundle)]
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
  compatibilityFlags: ["nodejs_compat"],
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
      compatibilityFlags: ["nodejs_compat"],
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
        APP: "gaminglogoai-generation-http-fixture",
        ASSETS: createAssetFixture(assets),
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
/** @typedef {{result: string, fixtureOnly: boolean, deployable: boolean, workerdVersion: string, miniflareVersion: string, runtimeCompatibilityDate: string, checks: string[], dbOperations: string[], dbCalls: Array<Record<string, unknown>>, mockedProviderCalls: number, mockedS3Uploads: number, blockedOutbound: number, blockedUrls: string[], missingBindingLayer: string|null, failurePhase: string|null}} ProbeReport */
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
/** @param {string} requestId @param {string=} token @param {string=} prompt */
async function mutation(requestId, token, prompt) {
  return mf.dispatchFetch(`${origin}/api/trpc/generate.generateIcon?batch=1`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(mutationInput(requestId, prompt)),
  });
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
    const missing = await noBindingMf.dispatchFetch(
      `${origin}/api/trpc/generate.generateIcon?batch=1`,
      {
        method: "POST",
        headers: headers(tokenA),
        body: JSON.stringify(mutationInput(requestA)),
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

