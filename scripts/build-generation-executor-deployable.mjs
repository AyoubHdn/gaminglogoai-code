import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { cp, mkdtemp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const exec = promisify(execFile);
const root = process.cwd();
const sourceSha = (await exec("git", ["rev-parse", "HEAD"], { cwd: root })).stdout.trim();
const expectedSha = process.env.EXPECTED_SOURCE_SHA;
if (expectedSha && sourceSha !== expectedSha)
  throw new Error(`Source SHA mismatch: expected ${expectedSha}, got ${sourceSha}`);
const baseImage = "public.ecr.aws/lambda/nodejs:22";
const context = await mkdtemp(path.join(os.tmpdir(), "gaminglogoai-generation-staging-build-"));
const output = path.join(root, ".codex-tmp-tests", `generation-executor-staging-deployable-${sourceSha}`);
const zip = path.join(root, ".codex-tmp-tests", `gaminglogoai-generation-staging-deployable-${sourceSha}.zip`);
const extracted = path.join(root, ".codex-tmp-tests", `generation-executor-staging-deployable-${sourceSha}-extracted`);

/** @param {string[]} args */
async function runDocker(args) {
  return exec("docker", args, { cwd: root, maxBuffer: 64 * 1024 * 1024 });
}
/** @param {string} file */
async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}
/** @param {string} directory @param {string} [prefix] @returns {Promise<Array<{path: string, full: string}>>} */
async function walk(directory, prefix = "") {
  /** @type {Array<{path: string, full: string}>} */
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = path.join(prefix, entry.name);
    const full = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`External symlink is not allowed: ${relative}`);
    if (entry.isDirectory()) result.push(...await walk(full, relative));
    else if (entry.isFile()) result.push({ path: relative.replaceAll(path.sep, "/"), full });
    else throw new Error(`Unsupported package entry: ${relative}`);
  }
  return result;
}

await mkdir(context, { recursive: true });
await cp(path.join(root, "workers/generation-executor/package.json"), path.join(context, "package.json"));
await cp(path.join(root, "workers/generation-executor/package-lock.json"), path.join(context, "package-lock.json"));
await cp(path.join(root, "src"), path.join(context, "src"), { recursive: true });
await cp(path.join(root, "workers/generation-executor/src"), path.join(context, "workers/generation-executor/src"), { recursive: true });
await cp(path.join(root, "public/watermark.png"), path.join(context, "public-watermark.png"));
await cp(path.join(root, "scripts/generation-executor-packed-runtime-smoke.mjs"), path.join(context, "runtime-smoke.mjs"));

await runDocker(["pull", baseImage]);
/** @type {{ RepoDigests?: unknown; Architecture?: unknown; Os?: unknown }} */
const imageInspect = JSON.parse((await runDocker(["image", "inspect", baseImage, "--format", "{{json .}}"])).stdout);
const repoDigests = Array.isArray(imageInspect.RepoDigests) ? imageInspect.RepoDigests.filter((item) => typeof item === "string") : [];
const digest = repoDigests.find((item) => item.startsWith("public.ecr.aws/lambda/nodejs@sha256:"));
if (!digest || imageInspect.Architecture !== "amd64") throw new Error("Lambda base image is not pinned amd64");
const imageDigest = digest.split("@")[1];

const dockerfile = `FROM ${digest}
ENV NPM_CONFIG_UPDATE_NOTIFIER=false NPM_CONFIG_FUND=false NPM_CONFIG_AUDIT=false
WORKDIR /build
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
COPY src ./src
COPY workers ./workers
COPY public-watermark.png ./public-watermark.png
COPY runtime-smoke.mjs ./runtime-smoke.mjs
COPY build-inside-container.mjs ./build-inside-container.mjs
RUN npm ci --include=dev
RUN node --experimental-strip-types /build/build-inside-container.mjs
RUN npm prune --omit=dev
RUN mkdir -p /opt/package/public /opt/test-fixture && cp /build/dist/handler.cjs /opt/package/handler.cjs && cp /build/dist/fixture-request.json /opt/test-fixture/fixture-request.json && cp /build/public-watermark.png /opt/package/public/watermark.png && cp -R /build/node_modules /opt/package/node_modules && cp /build/package.json /opt/package/package.json && cp /build/package-lock.json /opt/package/package-lock.json
RUN rm -rf /opt/package/node_modules/.bin
CMD ["sleep", "3600"]
`;
const buildInside = `import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
import { prepareLogoRequest } from "/build/src/server/generation/contract.ts";
await mkdir("/build/dist", { recursive: true });
await build({ entryPoints: ["/build/workers/generation-executor/src/handler.ts"], bundle: true, platform: "node", target: "node22", format: "cjs", outfile: "/build/dist/handler.cjs", external: ["sharp"], sourcemap: false, legalComments: "none" });
const raw = { userId: "fixture-user", requestId: "11111111-1111-4111-8111-111111111111", prompt: "offline packaged executor staging candidate", model: "flux-schnell", numberOfImages: 1, aspectRatio: "1:1" };
const prepared = await prepareLogoRequest(raw);
await writeFile("/build/dist/fixture-request.json", JSON.stringify({ ...raw, executionScope: "fixture-scope", fingerprint: prepared.fingerprint, shouldWatermark: true, plannedOutputIds: prepared.icons.map((icon) => icon.id) }, null, 2));
`;
await writeFile(path.join(context, "Dockerfile"), dockerfile, "utf8");
await writeFile(path.join(context, "build-inside-container.mjs"), buildInside, "utf8");
const tag = `gaminglogoai-generation-staging-builder:${sourceSha.slice(0, 16)}`;
await runDocker(["build", "--pull=false", "--tag", tag, context]);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const builder = (await runDocker(["create", tag])).stdout.trim();
const fixtureInput = path.join(context, "fixture-request.json");
try {
  await runDocker(["cp", `${builder}:/opt/package/.`, output]);
  await runDocker(["cp", `${builder}:/opt/test-fixture/fixture-request.json`, fixtureInput]);
} finally { await runDocker(["rm", builder]).catch(() => undefined); }

const sourcePackageLockSha256 = await sha256(path.join(root, "workers/generation-executor/package-lock.json"));
const packagedPackageLockSha256 = await sha256(path.join(output, "package-lock.json"));
if (sourcePackageLockSha256 !== packagedPackageLockSha256)
  throw new Error("Packaged executor lockfile does not match the committed source lockfile");

const files = await walk(output);
for (const required of ["handler.cjs", "package.json", "package-lock.json", "public/watermark.png", "node_modules/sharp/package.json"]) {
  if (!files.some((file) => file.path === required)) throw new Error(`Missing package file: ${required}`);
}
if (files.some((file) => file.path === "fixture-request.json")) throw new Error("Synthetic fixture input must not be packaged");
const handler = await readFile(path.join(output, "handler.cjs"), "utf8");
if (!handler.includes("exports.handler") && !handler.includes("handler =")) throw new Error("handler export missing");
/** @type {Record<string, {bytes: number, sha256: string}>} */
const manifest = {};
let uncompressedBytes = 0;
for (const file of files) {
  const bytes = (await stat(file.full)).size;
  uncompressedBytes += bytes;
  manifest[file.path] = { bytes, sha256: await sha256(file.full) };
}
const provenance = {
  schemaVersion: 3,
  fixtureOnly: false,
  deployable: true,
  productionDeploymentAllowed: false,
  sourceSha,
  sourcePackageLockSha256,
  packagedPackageLockSha256,
  baseImage: { reference: baseImage, digest: imageDigest, architecture: imageInspect.Architecture, os: imageInspect.Os },
  runtime: "nodejs22.x",
  architecture: "x86_64",
  handler: "handler.handler",
  format: "CommonJS",
  outputPrefix: "generation-staging/",
  files: manifest,
  uncompressedBytes,
  cloudExecution: "UNVERIFIED",
};
await writeFile(path.join(output, "build-provenance.json"), `${JSON.stringify(provenance, null, 2)}\n`, "utf8");
await rm(zip, { force: true });
await exec("zip", ["-q", "-r", "-9", zip, "."], { cwd: output });
const zipSha256 = await sha256(zip);

await rm(extracted, { recursive: true, force: true });
await mkdir(extracted, { recursive: true });
await exec("unzip", ["-q", zip, "-d", extracted]);
const extractedFiles = await walk(extracted);
const extractedProvenance = JSON.parse(await readFile(path.join(extracted, "build-provenance.json"), "utf8"));
if (extractedProvenance.sourceSha !== sourceSha || extractedProvenance.packagedPackageLockSha256 !== packagedPackageLockSha256)
  throw new Error("Extracted provenance does not match the build inputs");
for (const file of extractedFiles) {
  if (file.path === "build-provenance.json") continue;
  const expected = manifest[file.path];
  if (!expected || expected.bytes !== await stat(file.full).then((value) => value.size) || expected.sha256 !== await sha256(file.full))
    throw new Error(`Extracted package manifest mismatch: ${file.path}`);
}
if (extractedFiles.some((file) => file.path === "fixture-request.json")) throw new Error("Synthetic fixture input is present in the final ZIP");

const runtime = (await runDocker([
  "create",
  "--network", "none",
  "--entrypoint", "/bin/sh",
  digest,
  "-c", "sleep 3600",
])).stdout.trim();
try {
  await runDocker(["start", runtime]);
  await runDocker(["cp", `${extracted}${path.sep}.`, `${runtime}:/opt/package`]);
  await runDocker(["cp", fixtureInput, `${runtime}:/tmp/fixture-request.json`]);
  await runDocker(["cp", path.join(context, "runtime-smoke.mjs"), `${runtime}:/tmp/runtime-smoke.mjs`]);
  const runtimeSmoke = await runDocker(["exec", runtime, "node", "/tmp/runtime-smoke.mjs"]);
  if (!runtimeSmoke.stdout.includes("watermarkRendering") || !runtimeSmoke.stdout.includes("completedReplayWithoutProviderOrUpload"))
    throw new Error("Packaged offline runtime evidence is incomplete");
  console.log(`PACKAGED_RUNTIME_EVIDENCE=${runtimeSmoke.stdout.trim()}`);
} finally {
  await runDocker(["rm", "--force", runtime]).catch(() => undefined);
}

const scan = [];
for (const file of extractedFiles.filter((entry) => !entry.path.endsWith(".d.ts") && entry.path !== "build-provenance.json")) {
  const text = (await readFile(file.full)).toString("utf8");
  if (/AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]+ PRIVATE KEY-----|sk_(?:live|test)_[A-Za-z0-9]+|whsec_[A-Za-z0-9]+/.test(text)) scan.push(file.path);
}
if (scan.length) throw new Error(`Credential scan failed: ${scan.join(",")}`);
console.log(JSON.stringify({ sourceSha, zip, zipSha256, sourcePackageLockSha256, packagedPackageLockSha256, imageDigest, handler: "handler.handler", runtime: "nodejs22.x", architecture: "x86_64", fixtureOnly: false, credentialScan: "PASS", extractedManifest: "PASS", fixtureRequestPackaged: false }));
await rm(context, { recursive: true, force: true });
