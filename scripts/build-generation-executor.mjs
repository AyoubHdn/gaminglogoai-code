import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, copyFile, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";

const root = process.cwd();
const output = path.join(root, ".codex-tmp-tests", "generation-executor-build");
const entry = path.join(root, "workers", "generation-executor", "src", "handler.ts");
const asset = path.join(root, "public", "watermark.png");

await rm(output, { recursive: true, force: true });
await mkdir(path.join(output, "public"), { recursive: true });
await build({
  entryPoints: [entry],
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  outfile: path.join(output, "handler.mjs"),
  external: ["sharp"],
  sourcemap: false,
  legalComments: "none",
});
await copyFile(asset, path.join(output, "public", "watermark.png"));

/**
 * @param {string} file
 * @returns {Promise<string>}
 */
const sha256 = async (file) =>
  createHash("sha256").update(await readFile(file)).digest("hex");
const sourceSha = execFileSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
const manifest = {
  fixtureOnly: true,
  deployable: false,
  sourceSha,
  node: process.version,
  entry: "workers/generation-executor/src/handler.ts",
  output: "handler.mjs",
  externalNativeDependency: "sharp",
  files: {
    "handler.mjs": await sha256(path.join(output, "handler.mjs")),
    "public/watermark.png": await sha256(path.join(output, "public", "watermark.png")),
  },
};
await writeFile(
  path.join(output, "build-provenance.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(manifest));
