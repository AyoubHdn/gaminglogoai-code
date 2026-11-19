import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  cp,
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const exec = promisify(execFile);
const root = process.cwd();
const output = path.join(root, ".codex-tmp-tests", "generation-executor-lambda-package");
const context = await mkdtemp(path.join(os.tmpdir(), "gaminglogoai-lambda-context-"));
const image = "public.ecr.aws/lambda/nodejs:22";
const sourceSha = (await exec("git", ["rev-parse", "HEAD"], { cwd: root })).stdout.trim();

/**
 * @param {string[]} args
 * @param {import("node:child_process").ExecFileOptions} [options]
 */
async function runDocker(args, options = {}) {
  return exec("docker", args, {
    cwd: root,
    maxBuffer: 32 * 1024 * 1024,
    ...options,
  });
}

/** @param {string} file */
async function digest(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

async function walk(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const relative = path.join(prefix, entry.name);
    const full = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`External symlink is not allowed: ${relative}`);
    if (entry.isDirectory()) result.push(...(await walk(full, relative)));
    else if (entry.isFile()) result.push({ path: relative.replaceAll(path.sep, "/"), full });
    else throw new Error(`Unsupported package entry: ${relative}`);
  }
  return result;
}

async function copyBuildContext() {
  await mkdir(context, { recursive: true });
  await cp(
    path.join(root, "workers", "generation-executor", "package.json"),
    path.join(context, "package.json"),
  );
  await cp(path.join(root, "src"), path.join(context, "src"), { recursive: true });
  await cp(
    path.join(root, "workers", "generation-executor", "src"),
    path.join(context, "workers", "generation-executor", "src"),
    { recursive: true },
  );
  await cp(
    path.join(root, "public", "watermark.png"),
    path.join(context, "public-watermark.png"),
  );
  await cp(
    path.join(root, "scripts", "generation-executor-packed-runtime-smoke.mjs"),
    path.join(context, "runtime-smoke.mjs"),
  );
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await copyBuildContext();

await runDocker(["pull", image]);
const inspected = JSON.parse(
  (await runDocker(["image", "inspect", image, "--format", "{{json .}}"]))
    .stdout,
);
const repoDigest = (inspected.RepoDigests ?? []).find((value) =>
  value.startsWith("public.ecr.aws/lambda/nodejs@sha256:"),
);
if (!repoDigest) throw new Error("The Lambda base image did not expose a pinned digest");
if (inspected.Architecture !== "amd64")
  throw new Error(`Expected amd64 Lambda base image, got ${inspected.Architecture}`);
const imageDigest = repoDigest.split("@")[1];

const dockerfile = `FROM ${repoDigest}
ENV NPM_CONFIG_UPDATE_NOTIFIER=false NPM_CONFIG_FUND=false NPM_CONFIG_AUDIT=false
WORKDIR /build
COPY package.json ./package.json
RUN npm install --package-lock-only --ignore-scripts --save-exact
COPY src ./src
COPY workers ./workers
COPY public-watermark.png ./public-watermark.png
COPY runtime-smoke.mjs ./runtime-smoke.mjs
COPY build-inside-container.mjs ./build-inside-container.mjs
RUN npm ci --include=dev
RUN node --experimental-strip-types /build/build-inside-container.mjs
RUN npm prune --omit=dev
RUN mkdir -p /opt/package/public
RUN cp /build/dist/handler.cjs /opt/package/handler.cjs
RUN cp /build/dist/fixture-request.json /opt/package/fixture-request.json
RUN cp /build/public-watermark.png /opt/package/public/watermark.png
RUN cp -R /build/node_modules /opt/package/node_modules
RUN cp /build/package.json /opt/package/package.json
RUN cp /build/package-lock.json /opt/package/package-lock.json
RUN rm -rf /opt/package/node_modules/.bin
CMD ["sleep", "3600"]
`;
const buildInside = `import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
import { prepareLogoRequest } from "/build/src/server/generation/contract.ts";
await mkdir("/build/dist", { recursive: true });
await build({
  entryPoints: ["/build/workers/generation-executor/src/handler.ts"],
  bundle: true,
  platform: "node",
  target: "node22",
  format: "cjs",
  outfile: "/build/dist/handler.cjs",
  external: ["sharp"],
  sourcemap: false,
  legalComments: "none",
});
const raw = {
  userId: "fixture-user",
  requestId: "11111111-1111-4111-8111-111111111111",
  prompt: "offline packaged executor fixture",
  model: "flux-schnell",
  numberOfImages: 1,
  aspectRatio: "1:1",
};
const prepared = await prepareLogoRequest(raw);
await writeFile(
  "/build/dist/fixture-request.json",
  JSON.stringify({
    ...raw,
    executionScope: "fixture-scope",
    fingerprint: prepared.fingerprint,
    shouldWatermark: true,
    plannedOutputIds: prepared.icons.map((icon) => icon.id),
  }, null, 2),
);
`;
await writeFile(path.join(context, "Dockerfile"), dockerfile, "utf8");
await writeFile(path.join(context, "build-inside-container.mjs"), buildInside, "utf8");

const tag = `gaminglogoai-lambda-builder:${sourceSha.slice(0, 16)}`;
await runDocker(["build", "--pull=false", "--tag", tag, context]);
const builder = (await runDocker(["create", tag])).stdout.trim();
try {
  await runDocker(["cp", `${builder}:/opt/package/.`, output]);
} finally {
  await runDocker(["rm", builder]).catch(() => undefined);
}

const packageFiles = await walk(output);
const required = [
  "handler.cjs",
  "fixture-request.json",
  "package.json",
  "package-lock.json",
  "public/watermark.png",
  "node_modules/sharp/package.json",
];
for (const requiredPath of required) {
  if (!packageFiles.some((file) => file.path === requiredPath))
    throw new Error(`Required packaged path is missing: ${requiredPath}`);
}
const handlerText = await readFile(path.join(output, "handler.mjs"), "utf8");
if (!handlerText.includes("createGenerationExecutorHandler"))
  throw new Error("Packaged handler does not contain the expected export");
const packageLockSha256 = await digest(path.join(output, "package-lock.json"));
const manifestFiles = {};
let uncompressedBytes = 0;
for (const file of packageFiles) {
  const fileStat = await stat(file.full);
  uncompressedBytes += fileStat.size;
  manifestFiles[file.path] = { sha256: await digest(file.full), bytes: fileStat.size };
}
await writeFile(
  path.join(output, "build-provenance.json"),
  `${JSON.stringify({
    schemaVersion: 1,
    fixtureOnly: true,
    deployable: false,
    productionDeploymentAllowed: false,
    sourceSha,
    packageLockSha256,
    baseImage: {
      reference: image,
      digest: imageDigest,
      architecture: inspected.Architecture,
      os: inspected.Os,
    },
    handler: "handler.handler",
    format: "CommonJS",
    externalNativeDependency: "sharp",
    files: manifestFiles,
    uncompressedBytes,
    cloudExecution: "UNVERIFIED",
  }, null, 2)}\n`,
  "utf8",
);

const runtimeContainer = (
  await runDocker([
    "create",
    "--network",
    "none",
    "--entrypoint",
    "/bin/sh",
    repoDigest,
    "-c",
    "sleep 3600",
  ])
).stdout.trim();
try {
  await runDocker(["start", runtimeContainer]);
  await runDocker(["cp", output, `${runtimeContainer}:/opt/package`]);
  await runDocker(["cp", path.join(context, "runtime-smoke.mjs"), `${runtimeContainer}:/tmp/runtime-smoke.mjs`]);
  await runDocker(["exec", runtimeContainer, "node", "/tmp/runtime-smoke.mjs"]);
} finally {
  await runDocker(["rm", "--force", runtimeContainer]).catch(() => undefined);
}

const zip = path.join(root, ".codex-tmp-tests", `${packageName}-${sourceSha}.zip`);
await rm(zip, { force: true });
await exec("zip", ["-q", "-r", "-9", zip, "."], { cwd: output });
const zipSha256 = await digest(zip);
const zipStat = await stat(zip);
const forbidden = [/AKIA[0-9A-Z]{16}/, /-----BEGIN [A-Z ]+ PRIVATE KEY-----/, /sk_(?:live|test)_[A-Za-z0-9]+/, /whsec_[A-Za-z0-9]+/];
const credentialScan = [];
for (const file of packageFiles) {
  const bytes = await readFile(file.full);
  if (forbidden.some((pattern) => pattern.test(bytes.toString("utf8")))) credentialScan.push(file.path);
}
if (credentialScan.length) throw new Error(`Credential scan failed for ${credentialScan.join(",")}`);
console.log(JSON.stringify({
  fixtureOnly: true,
  deployable: false,
  sourceSha,
  zip,
  zipSha256,
  compressedBytes: zipStat.size,
  uncompressedBytes,
  imageDigest,
  architecture: inspected.Architecture,
  node: (await runDocker(["run", "--rm", "--network", "none", repoDigest, "node", "--version"])).stdout.trim(),
  handler: "handler.handler",
  packageLockSha256,
  credentialScan: "PASS",
}));
await rm(context, { recursive: true, force: true });

