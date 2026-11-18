import { mkdir, rm, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import path from "node:path";

const root = path.resolve(process.env.COMPAT_CONTROL_ROOT ?? ".ci-pages-api-control");
const nextVersion = process.env.COMPAT_NEXT_VERSION;
const openNextVersion = process.env.COMPAT_OPENNEXT_VERSION;
const wranglerVersion = process.env.COMPAT_WRANGLER_VERSION;
const compatibilityDate = process.env.COMPATIBILITY_DATE ?? "2026-10-06";
if (!nextVersion || !openNextVersion || !wranglerVersion) throw new Error("missing compatibility version");

/**
 * @param {string} command
 * @param {string[]} args
 * @returns {Promise<void>}
 */
function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: "inherit", env: process.env });
    child.on("error", reject);
    child.on("exit", code => code === 0 ? resolve() : reject(new Error(command + " exited " + code)));
  });
}
await rm(root, { recursive: true, force: true });
await mkdir(path.join(root, "pages", "api"), { recursive: true });
await writeFile(path.join(root, "package.json"), JSON.stringify({
  private: true,
  scripts: { build: "next build", openNext: "opennextjs-cloudflare build" },
  dependencies: { next: nextVersion, react: "18.2.0", "react-dom": "18.2.0" },
  devDependencies: { "@opennextjs/cloudflare": openNextVersion, wrangler: wranglerVersion }
}, null, 2) + "\n");
await writeFile(path.join(root, "pages", "api", "echo.js"), `export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  return res.status(200).json({ body: req.body ?? null });
}
export const config = { api: { bodyParser: true } };
`);
await writeFile(path.join(root, "next.config.mjs"), "export default { reactStrictMode: true };\n");
await writeFile(path.join(root, "tsconfig.json"), JSON.stringify({
  compilerOptions: {
    allowJs: true,
    checkJs: false,
    noEmit: true,
    module: "esnext",
    moduleResolution: "bundler",
    skipLibCheck: true,
  },
  include: ["pages/**/*.js"],
}, null, 2) + "\n");
await writeFile(path.join(root, "open-next.config.ts"), 'import { defineCloudflareConfig } from "@opennextjs/cloudflare";\nexport default defineCloudflareConfig({});\n');
await writeFile(path.join(root, "wrangler.jsonc"), JSON.stringify({
  name: "gaminglogoai-pages-api-compat-fixture",
  main: ".open-next/worker.js",
  compatibility_date: compatibilityDate,
  compatibility_flags: ["nodejs_compat", "nodejs_als"],
  workers_dev: false,
  preview_urls: false,
  assets: { binding: "ASSETS", directory: ".open-next/assets" }
}, null, 2) + "\n");
await run("npm", ["install", "--package-lock-only", "--ignore-scripts", "--save-exact", "--no-audit", "--no-fund"]);
const lockSha = createHash("sha256").update(await readFile(path.join(root, "package-lock.json"))).digest("hex");
await run("npm", ["ci", "--ignore-scripts", "--no-audit", "--no-fund"]);
await run("npx", ["next", "build"]);
await run("npx", ["opennextjs-cloudflare", "build"]);
const port = 18700 + Math.floor(Math.random() * 200);
const child = spawn("npx", ["wrangler", "dev", "--local", "--config", "wrangler.jsonc", "--ip", "127.0.0.1", "--port", String(port)], {
  cwd: root, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, WRANGLER_LOG_SANITIZE: "true" }
});
const url = "http://127.0.0.1:" + port + "/api/echo";
const deadline = Date.now() + 30000;
while (Date.now() < deadline) {
  try { const response = await fetch(url); if (response.status > 0) break; } catch {}
  await new Promise(resolve => setTimeout(resolve, 250));
}
const cases = [
  { name: "ascii", body: JSON.stringify({ message: "hello" }), expected: 200 },
  { name: "unicode", body: JSON.stringify({ message: "مرحبا🌙" }), expected: 200 },
  { name: "empty", body: "", expected: 200 },
  { name: "malformed", body: "{", expected: 400 }
];
const results = [];
try {
  for (const item of cases) {
    const response = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: item.body });
    const text = await response.text();
    if (response.status !== item.expected) throw new Error(item.name + ": expected " + item.expected + ", got " + response.status);
    results.push({ name: item.name, status: response.status, parsed: item.name === "malformed" ? null : JSON.parse(text) });
  }
  console.log(JSON.stringify({ result: "PAGES_API_POST_CONTROL_PASS", versions: { node: process.version, next: nextVersion, openNext: openNextVersion, wrangler: wranglerVersion }, lockSha, compatibilityDate, flags: ["nodejs_compat", "nodejs_als"], cases: results }));
} finally {
  child.kill("SIGTERM");
  await new Promise(resolve => child.once("exit", resolve));
}
