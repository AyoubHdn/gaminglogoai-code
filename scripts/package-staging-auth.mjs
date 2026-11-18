import assert from 'node:assert/strict';
import {cp,mkdir,readFile,rename,rm,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {digest,manifest} from './package-staging-fixture.mjs';
import {stagingOrigin} from '../workers/staging-auth/profile.mjs';

/** @param {Record<string,any>} config */
export function assertStagingAuthConfig(config) {
 assert.equal(config.account_id,'29d5671996cfe92470361986eda7b679');assert.equal(config.name,'gaminglogoai-cloudflare-staging');
 assert.equal(config.workers_dev,false);assert.equal(config.preview_urls,false);
 for(const key of ['routes','route','triggers','queues','durable_objects','unsafe','env'])assert.ok(!(key in config));
 assert.deepEqual(config.services,[{binding:'DB_SERVICE',service:'gaminglogoai-db-staging'}]);
 assert.equal(config.assets?.run_worker_first,true);assert.equal(config.assets?.binding,'ASSETS');
 for(const [key,value]of Object.entries({GAMING_AUTH_STAGING_ONLY:'true',DB_AUTH_BACKEND:'service',DB_READS_BACKEND:'service',CLOUDFLARE_READ_ONLY_MODE:'true',AUTH_EXTERNAL_SYNC_MODE:'disabled',NEXTAUTH_URL:stagingOrigin,HOST_NAME:stagingOrigin,DATABASE_URL:'postgresql://invalid:invalid@db.invalid:5432/invalid',NEXT_PUBLIC_STRIPE_KEY:'pk_test_ci',NEXT_PUBLIC_AWS_REGION_GAMING:'us-east-1',NEXT_PUBLIC_S3_BUCKET_NAME_GAMING:'gaminglogoai-ci'}))assert.equal(config.vars?.[key],value);
 for(const key of ['GOOGLE_CLIENT_ID','GOOGLE_CLIENT_SECRET','NEXTAUTH_SECRET'])assert.ok(!(key in config.vars));
}

/** @param {{root:string,sourceSha:string,runId:string,runAttempt:string}} options */
function validateOptions(options){assert.match(options.sourceSha,/^[a-f0-9]{40}$/);assert.match(options.runId,/^\d+$/);assert.match(options.runAttempt,/^\d+$/);}

/** @param {{root:string,sourceSha:string,runId:string,runAttempt:string}} options */
export async function prepareStagingAuth(options) {
 validateOptions(options);
 const root=path.resolve(options.root),out=path.join(root,'.staging-auth');
 const base=JSON.parse(await readFile(path.join(root,'.open-next/build-provenance.json'),'utf8'));
 assert.equal(base.applicationSha,options.sourceSha);assert.equal(base.workflowSha,options.sourceSha);assert.equal(base.ciRunId,options.runId);assert.equal(base.fixtureOnly,true);assert.equal(base.deployable,false);assert.equal(base.runtimeSmokeResult,'WORKERS_RUNTIME_SMOKE_PASS');
 const config=JSON.parse(await readFile(path.join(root,'wrangler.auth-staging.jsonc'),'utf8'));assertStagingAuthConfig(config);
 // Refuse an existing output directory; never erase a prior candidate implicitly.
 await mkdir(out);
 await cp(path.join(root,'.open-next'),out,{recursive:true});
 await rename(path.join(out,'runtime-smoke-report.json'),path.join(out,'base-runtime-smoke-report.json'));
 await rm(path.join(out,'build-provenance.json'));await rm(path.join(out,'content-manifest.json'));
 const entry=await readFile(path.join(root,'workers/staging-auth/entry.mjs.template'),'utf8');
 assert.ok(entry.includes("from './worker.js'"));assert.ok(entry.includes("from './staging-auth-profile.mjs'"));
 await writeFile(path.join(out,'staging-auth-entry.mjs'),entry);
 await cp(path.join(root,'workers/staging-auth/profile.mjs'),path.join(out,'staging-auth-profile.mjs'));
 const standalone={...config,main:'./staging-auth-entry.mjs',assets:{...config.assets,directory:'./assets'}};delete standalone.$schema;
 await writeFile(path.join(out,'wrangler.auth-staging.json'),JSON.stringify(standalone,null,2)+'\n');
 return {result:'STAGING_AUTH_CANDIDATE_PREPARED',sourceSha:options.sourceSha,deployable:false,publicUrlsEnabled:false};
}

/** @param {{root:string,sourceSha:string,runId:string,runAttempt:string}} options */
export async function finalizeStagingAuth(options) {
 validateOptions(options);
 const root=path.resolve(options.root),out=path.join(root,'.staging-auth');
 const config=JSON.parse(await readFile(path.join(out,'wrangler.auth-staging.json'),'utf8'));assertStagingAuthConfig(config);
 assert.equal(config.main,'./staging-auth-entry.mjs');assert.equal(config.assets.directory,'./assets');
 assert.equal(await digest(path.join(out,'staging-auth-entry.mjs')),await digest(path.join(root,'workers/staging-auth/entry.mjs.template')));
 assert.equal(await digest(path.join(out,'staging-auth-profile.mjs')),await digest(path.join(root,'workers/staging-auth/profile.mjs')));
 const runtime=JSON.parse(await readFile(path.join(out,'runtime-smoke-report.json'),'utf8'));
 assert.equal(runtime.result,'STAGING_AUTH_PROFILE_RUNTIME_PASS');assert.equal(runtime.realDatabaseUsed,false);assert.equal(runtime.liveGoogleLoginVerified,false);assert.equal(runtime.mockedGoogleOAuth,true);assert.equal(runtime.mauticCalled,false);assert.equal(runtime.mauticAttempted,false);assert.equal(runtime.generationSubmitted,false);assert.equal(runtime.blockedOutbound,0);assert.ok(runtime.mockedGoogleRequests>=3);
 for(const check of ['csrf-and-google-authorization','invalid-state-does-not-create-user','signed-mock-google-callback','authenticated-session','five-request-scoped-reads','blocked-write-and-nonauth-routes','signout-session-deletion','no-mautic-or-real-provider-http'])assert.ok(runtime.checks?.includes(check));
 const files=(await manifest(out,out)).sort((a,b)=>a.path.localeCompare(b.path,'en'));
 const bytes=JSON.stringify({algorithm:'sha256',files},null,2)+'\n';await writeFile(path.join(out,'content-manifest.json'),bytes);
 const base=JSON.parse(await readFile(path.join(root,'.open-next/build-provenance.json'),'utf8'));
 const provenance={schemaVersion:1,purpose:'staging-google-oauth-candidate',fixtureOnly:false,deployable:false,productionDeploymentAllowed:false,deploymentReadiness:'requires-private-runtime-credentials-and-provider-inventory',applicationSha:options.sourceSha,workflowSha:options.sourceSha,ciRunId:options.runId,ciRunAttempt:options.runAttempt,workerName:config.name,stagingOrigin,requiredRuntimeSecrets:['NEXTAUTH_SECRET','GOOGLE_CLIENT_ID','GOOGLE_CLIENT_SECRET'],authExternalSyncMode:'disabled',dbService:'gaminglogoai-db-staging',expectedDbVersion:'cfd80dca-cead-4e7b-a937-3e60020a6bef',expectedHyperdriveId:'207b5736cff94597b679eafb1478be35',expectedSupabaseProject:'wvwjeqynnnplmcaljfqk',publicUrlsEnabled:false,customRoutes:[],publicBuildInputs:base.publicBuildInputs,nextVersion:base.nextVersion,openNextVersion:base.openNextVersion,wranglerVersion:base.wranglerVersion,unsupportedNextVersionOverride:true,packageLockSha256:base.packageLockSha256,configSha256:await digest(path.join(out,'wrangler.auth-staging.json')),profileSha256:await digest(path.join(out,'staging-auth-profile.mjs')),entrySha256:await digest(path.join(out,'staging-auth-entry.mjs')),runtimeReportSha256:await digest(path.join(out,'runtime-smoke-report.json')),contentManifestSha256:createHash('sha256').update(bytes).digest('hex'),extractedBuildContentSha256:createHash('sha256').update(JSON.stringify(files)).digest('hex'),buildFileCount:files.length,buildBytes:files.reduce((sum,file)=>sum+file.size,0),localMockedOAuthFlowVerified:true,liveGoogleLoginVerified:false,realStagingDatabaseLoginVerified:false,productionInputsCompared:false};
 await writeFile(path.join(out,'build-provenance.json'),JSON.stringify(provenance,null,2)+'\n');
 return {result:'STAGING_AUTH_CANDIDATE_VERIFIED',sourceSha:options.sourceSha,buildFileCount:files.length,deployable:false,liveGoogleLoginVerified:false};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 try{
   assert.equal(process.env.GITHUB_ACTIONS,'true');assert.equal(process.env.GITHUB_REPOSITORY,'AyoubHdn/gaminglogoai-code');assert.equal(process.env.GITHUB_REF_NAME,'staging/gaminglogoai-auth-entrypoint-bea0');
   const sourceSha=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();assert.equal(sourceSha,process.env.GITHUB_SHA);
   const options={root:process.cwd(),sourceSha,runId:process.env.GITHUB_RUN_ID??'',runAttempt:process.env.GITHUB_RUN_ATTEMPT??''};
   const mode=process.argv[2];assert.ok(mode==='prepare'||mode==='finalize');
   console.log(JSON.stringify(await(mode==='prepare'?prepareStagingAuth(options):finalizeStagingAuth(options))));
 }catch{console.error('STAGING_AUTH_PACKAGING_REJECTED; no deployment performed');process.exitCode=1;}
}
