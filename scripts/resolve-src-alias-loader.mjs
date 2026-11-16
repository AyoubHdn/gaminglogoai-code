
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const sourceRoot = fileURLToPath(new URL("../src/", import.meta.url));

export async function resolve(specifier, context, nextResolve) {
  if (!specifier.startsWith("~/")) return nextResolve(specifier, context);

  const relative = specifier.slice(2);
  const candidates = [
    `${relative}.ts`,
    `${relative}.tsx`,
    `${relative}.mjs`,
    `${relative}.js`,
    relative,
  ];
  const match = candidates.find((candidate) =>
    existsSync(new URL(candidate, pathToFileURL(sourceRoot)),),
  );
  if (!match) throw new Error(`Unresolved test source alias: ${specifier}`);

  return nextResolve(
    new URL(match, pathToFileURL(sourceRoot)).href,
    context,
  );
}

