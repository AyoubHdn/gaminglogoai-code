import assert from 'node:assert/strict';
import {mkdtemp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {packageStagingFixture} from './package-staging-fixture.mjs';

test('fixture manifest preserves build identity and never claims deployment readiness',async()=>{
  const root=await mkdtemp(path.join(os.tmpdir(),'gla-fixture-package-'));
  const options={root,sourceSha:'a'.repeat(40),runId:'123',runAttempt:'1',workflowRef:'AyoubHdn/gaminglogoai-code/.github/workflows/gaminglogoai-auth-entrypoint-bea0.yml@refs/heads/staging/gaminglogoai-auth-entrypoint-bea0'};
  try{
    for(const name of ['.open-next/assets','.open-next/server-functions','.github/workflows'])await mkdir(path.join(root,name),{recursive:true});
    for(const name of ['.open-next/worker.js','.open-next/assets/a.css','.open-next/server-functions/handler.mjs','package-lock.json','wrangler.jsonc','open-next.config.ts','.github/workflows/gaminglogoai-auth-entrypoint-bea0.yml'])await writeFile(path.join(root,name),'fixture');
    await writeFile(path.join(root,'package.json'),JSON.stringify({dependencies:{next:'14.2.15'},devDependencies:{'@opennextjs/cloudflare':'1.14.0',wrangler:'4.148.0'}}));
    const first=await packageStagingFixture(options);assert.equal(first.deployable,false);assert.equal(first.runtimeSmokeResult,'NOT_COMPLETED');
    const provenance=JSON.parse(await readFile(path.join(root,'.open-next/build-provenance.json'),'utf8'));
    assert.equal(provenance.applicationSha,options.sourceSha);assert.equal(provenance.fixtureOnly,true);
    const second=await packageStagingFixture(options);assert.equal(second.workerSha256,first.workerSha256);assert.equal(second.buildFileCount,3);
    await writeFile(path.join(root,'.open-next/.env'),'DO_NOT_PACKAGE=fixture');
    await assert.rejects(packageStagingFixture(options),/Environment or credential file/);
    await assert.rejects(packageStagingFixture({...options,sourceSha:'unpinned'}),/Invalid pinned fixture provenance/);
  }finally{await rm(root,{recursive:true,force:true});}
});
