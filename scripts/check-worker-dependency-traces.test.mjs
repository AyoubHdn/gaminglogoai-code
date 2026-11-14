import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { checkWorkerDependencyTraces } from './check-worker-dependency-traces.mjs';

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'gla-worker-traces-'));
  const trees = {
    stripe: ['node_modules/stripe/esm/stripe.esm.worker.js', 'node_modules/stripe/esm/platforms/PlatformFunctions.js'],
    jose: ['node_modules/jose/dist/browser/index.js', 'node_modules/jose/dist/browser/lib/crypto.js'],
    hkdf: ['node_modules/@panva/hkdf/dist/web/index.js', 'node_modules/@panva/hkdf/dist/web/runtime/hkdf.js'],
  };
  const requirements = [
    ['api/stripe.js.nft.json', ['stripe']],
    ['api/trpc/[trpc].js.nft.json', ['stripe']],
    ['api/cron-sync.js.nft.json', ['stripe']],
    ['api/auth/[...nextauth].js.nft.json', ['jose', 'hkdf']],
  ];
  for (const file of Object.values(trees).flat()) {
    const target = path.join(root, file);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, 'export const fixture = true;\n');
  }
  for (const [route, dependencies] of requirements) {
    const target = path.join(root, '.next/server/pages', route);
    await mkdir(path.dirname(target), { recursive: true });
    const files = dependencies.flatMap(name => trees[name]).map(file => path.relative(path.dirname(target), path.join(root, file)));
    await writeFile(target, JSON.stringify({version:1,files}));
  }
  return {root, trees, cleanup:()=>rm(root,{recursive:true,force:true})};
}

test('complete worker implementation trees are traced for each affected route', async () => {
  const f = await fixture();
  try {
    assert.deepEqual(await checkWorkerDependencyTraces(f.root), {
      result:'WORKER_DEPENDENCY_TRACES_PASS', routesChecked:4, runtimeFilesChecked:10,
    });
  } finally { await f.cleanup(); }
});

test('package metadata without worker implementation traces is rejected', async () => {
  const f = await fixture();
  try {
    const trace = path.join(f.root, '.next/server/pages/api/stripe.js.nft.json');
    await writeFile(trace, JSON.stringify({version:1,files:['../../../../node_modules/stripe/package.json']}));
    await assert.rejects(checkWorkerDependencyTraces(f.root), /Worker implementation missing/);
  } finally { await f.cleanup(); }
});

test('a traced entrypoint with a missing transitive implementation is rejected', async () => {
  const f = await fixture();
  try {
    const trace = path.join(f.root, '.next/server/pages/api/auth/[...nextauth].js.nft.json');
    const value = JSON.parse(await readFile(trace,'utf8'));
    value.files = value.files.filter(file => !file.endsWith('runtime/hkdf.js'));
    await writeFile(trace,JSON.stringify(value));
    await assert.rejects(checkWorkerDependencyTraces(f.root), /runtime[/\\]hkdf.js/);
  } finally { await f.cleanup(); }
});

test('an entrypoint missing from the installed package is rejected', async () => {
  const f = await fixture();
  try {
    await rm(path.join(f.root, f.trees.stripe[0]));
    await assert.rejects(checkWorkerDependencyTraces(f.root), /ENOENT/);
  } finally { await f.cleanup(); }
});
