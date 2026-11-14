import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dependencyTrees = {
  stripe: {
    directory: 'node_modules/stripe/esm',
    entrypoint: 'stripe.esm.worker.js',
  },
  jose: {
    directory: 'node_modules/jose/dist/browser',
    entrypoint: 'index.js',
  },
  hkdf: {
    directory: 'node_modules/@panva/hkdf/dist/web',
    entrypoint: 'index.js',
  },
};

/** @type {Array<[string, Array<keyof typeof dependencyTrees>]>} */
const routeRequirements = [
  ['api/stripe.js.nft.json', ['stripe']],
  ['api/trpc/[trpc].js.nft.json', ['stripe']],
  ['api/cron-sync.js.nft.json', ['stripe']],
  ['api/auth/[...nextauth].js.nft.json', ['jose', 'hkdf']],
];

/** @param {string} directory @returns {Promise<string[]>} */
async function javascriptFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await javascriptFiles(file));
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(file);
  }
  return files;
}

export async function checkWorkerDependencyTraces(root = process.cwd()) {
  root = path.resolve(root);
  /** @type {Map<string, string[]>} */
  const runtimeFiles = new Map();
  for (const [name, tree] of Object.entries(dependencyTrees)) {
    const directory = path.join(root, tree.directory);
    const entrypoint = path.join(directory, tree.entrypoint);
    if ((await stat(entrypoint)).size === 0) throw new Error(`Empty worker entrypoint: ${name}`);
    const files = await javascriptFiles(directory);
    if (files.length === 0) throw new Error(`Missing worker implementations: ${name}`);
    runtimeFiles.set(name, files);
  }

  let runtimeFilesChecked = 0;
  for (const [route, dependencies] of routeRequirements) {
    const tracePath = path.join(root, '.next/server/pages', route);
    const trace = /** @type {{files?: unknown}} */ (JSON.parse(await readFile(tracePath, 'utf8')));
    if (!Array.isArray(trace.files) || !trace.files.every(file => typeof file === 'string')) {
      throw new Error(`Invalid dependency trace: ${route}`);
    }
    const files = /** @type {string[]} */ (trace.files);
    const traced = new Set(files.map(file => path.resolve(path.dirname(tracePath), file)));
    for (const dependency of dependencies) {
      const implementations = runtimeFiles.get(dependency);
      if (!implementations) throw new Error(`Missing implementation tree: ${dependency}`);
      for (const file of implementations) {
        if (!traced.has(file)) {
          throw new Error(`Worker implementation missing from ${route}: ${path.relative(root, file)}`);
        }
        runtimeFilesChecked++;
      }
    }
  }
  return { result: 'WORKER_DEPENDENCY_TRACES_PASS', routesChecked: routeRequirements.length, runtimeFilesChecked };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    console.log(JSON.stringify(await checkWorkerDependencyTraces()));
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Worker dependency trace verification failed');
    process.exitCode = 1;
  }
}
