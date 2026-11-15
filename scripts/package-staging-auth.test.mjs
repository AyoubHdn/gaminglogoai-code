import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm,copyFile} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
import {assertStagingAuthConfig,prepareStagingAuth,finalizeStagingAuth} from './package-staging-auth.mjs';
const sourceRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');

void test('staging auth config cannot expose a domain or include private auth values',async()=>{
 const source=JSON.parse(await readFile(path.join(sourceRoot,'wrangler.auth-staging.jsonc'),'utf8'));
 assert.doesNotThrow(()=>assertStagingAuthConfig(source));
 for(const changed of [{workers_dev:true},{routes:['gaminglogoai.com/*']},{name:'namedesignai-cloudflare-production'},{services:[{binding:'DB_SERVICE',service:'namedesignai-db-production'}]},{vars:{...source.vars,AUTH_EXTERNAL_SYNC_MODE:'enabled'}},{vars:{...source.vars,GOOGLE_CLIENT_SECRET:'private-values-not-allowed'}}])assert.throws(()=>assertStagingAuthConfig({...source,...changed}));
});

void test('candidate packaging needs runtime proof and preserves non-production provenance',async()=>{
 const root=await mkdtemp(path.join(os.tmpdir(),'gla-auth-candidate-'));
 const sourceSha='a'.repeat(40),options={root,sourceSha,runId:'12345',runAttempt:'1'};
 try{
   for(const folder of ['.open-next/assets','.open-next/server-functions','workers/staging-auth'])await mkdir(path.join(root,folder),{recursive:true});
   for(const file of ['worker.js','assets/fixture.css','server-functions/handler.mjs'])await writeFile(path.join(root,'.open-next',file),'fixture build bytes');
   await writeFile(path.join(root,'.open-next/build-provenance.json'),JSON.stringify({applicationSha:sourceSha,workflowSha:sourceSha,ciRunId:options.runId,fixtureOnly:true,deployable:false,runtimeSmokeResult:'WORKERS_RUNTIME_SMOKE_PASS',publicBuildInputs:{stripeKey:'pk_test_ci',region:'us-east-1',bucket:'gaminglogoai-ci'},nextVersion:'14.2.15',openNextVersion:'1.14.0',wranglerVersion:'4.148.0',packageLockSha256:'fixture-lock-hash'}));
   await writeFile(path.join(root,'.open-next/content-manifest.json'),'{}');
   await writeFile(path.join(root,'.open-next/runtime-smoke-report.json'),JSON.stringify({result:'WORKERS_RUNTIME_SMOKE_PASS',fixtureOnly:true,deployable:false}));
   for(const file of ['wrangler.auth-staging.jsonc','workers/staging-auth/profile.mjs','workers/staging-auth/entry.mjs.template'])await copyFile(path.join(sourceRoot,file),path.join(root,file));
   assert.equal((await prepareStagingAuth(options)).publicUrlsEnabled,false);
   await assert.rejects(prepareStagingAuth(options));
   await assert.rejects(finalizeStagingAuth(options));
   const runtime={result:'STAGING_AUTH_PROFILE_RUNTIME_PASS',realDatabaseUsed:false,liveGoogleLoginVerified:false,mockedGoogleOAuth:true,mauticCalled:false,mauticAttempted:false,generationSubmitted:false,blockedOutbound:0,mockedGoogleRequests:3,checks:['csrf-and-google-authorization','invalid-state-does-not-create-user','signed-mock-google-callback','authenticated-session','five-request-scoped-reads','blocked-write-and-nonauth-routes','signout-session-deletion','no-mautic-or-real-provider-http']};
   await writeFile(path.join(root,'.staging-auth/runtime-smoke-report.json'),JSON.stringify({...runtime,liveGoogleLoginVerified:true}));
   await assert.rejects(finalizeStagingAuth(options));
   await writeFile(path.join(root,'.staging-auth/runtime-smoke-report.json'),JSON.stringify(runtime));
   assert.equal((await finalizeStagingAuth(options)).result,'STAGING_AUTH_CANDIDATE_VERIFIED');
   const provenance=JSON.parse(await readFile(path.join(root,'.staging-auth/build-provenance.json'),'utf8'));
   assert.equal(provenance.deployable,false);assert.equal(provenance.productionDeploymentAllowed,false);assert.equal(provenance.liveGoogleLoginVerified,false);
   assert.equal(provenance.expectedSupabaseProject,'wvwjeqynnnplmcaljfqk');
   const manifest=JSON.parse(await readFile(path.join(root,'.staging-auth/content-manifest.json'),'utf8'));
   assert.ok(manifest.files.some(/** @param {{path:string}} entry */entry=>entry.path==='staging-auth-profile.mjs'));
   assert.ok(manifest.files.some(/** @param {{path:string}} entry */entry=>entry.path==='wrangler.auth-staging.json'));
   await writeFile(path.join(root,'.staging-auth/.dev.vars'),'NEVER_PACKAGE=fixture');
   await assert.rejects(finalizeStagingAuth(options),/Environment or credential file/);
 }finally{await rm(root,{recursive:true,force:true});}
});
