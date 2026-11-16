import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const sourceRoot = fileURLToPath(new URL("../src/", import.meta.url));

/**
 * @param {URL} base
 * @param {string} relative
 */
function resolveLocal(base, relative) {
  const candidates = [
    `${relative}.ts`,
    `${relative}.tsx`,
    `${relative}.mjs`,
    `${relative}.js`,
    `${relative}/index.ts`,
    `${relative}/index.mjs`,
    relative,
  ];
  const match = candidates.find((candidate) =>
    existsSync(new URL(candidate, base)),
  );
  return match ? new URL(match, base).href : null;
}

/**
 * @param {string} specifier
 * @param {{ parentURL?: string }} context
 * @param {(specifier: string, context: { parentURL?: string }) => Promise<{ url: string }>} nextResolve
 */
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("~/")) {
    const resolved = resolveLocal(pathToFileURL(sourceRoot), specifier.slice(2));
    if (!resolved) throw new Error(`Unresolved test source alias: ${specifier}`);
    return nextResolve(resolved, context);
  }

  if (specifier.startsWith(".") && context.parentURL) {
    const resolved = resolveLocal(new URL("./", context.parentURL), specifier);
    if (resolved) return nextResolve(resolved, context);
  }

  return nextResolve(specifier, context);
}

