import {createHash} from 'node:crypto';
import {createReadStream} from 'node:fs';
import {lstat,readdir,readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const metadataFiles=new Set(['content-manifest.json','build-provenance.json','runtime-smoke-report.json']);
/** @param {string} file @returns {Promise<string>} */
async function digest(file){
  const hash=createHash('sha256');
  for await(const chunk of createReadStream(file))hash.update(chunk);
  return hash.digest('hex');
}

/** @param {string} directory @param {string} root @returns {Promise<Array<{path:string,size:number,sha256:string}>>} */
async function manifest(directory,root){
  /** @type {Array<{path:string,size:number,sha256:string}>} */
  const entries=[];
  for(const entry of await readdir(directory,{withFileTypes:true})){
    const full=path.join(directory,entry.name);
    const relative=path.relative(root,full).split(path.sep).join('/');
    const info=await lstat(full);
    if(info.isFile()&&/^(?:\.env(?:\..*)?|\.dev\.vars(?:\..*)?|auth\.json|credentials)$/i.test(entry.name))throw new Error('Environment or credential file found in build output');
    if(info.isSymbolicLink())throw new Error('Artifact symlinks require explicit review');
    if(info.isDirectory())entries.push(...await manifest(full,root));
    else if(info.isFile()&&!metadataFiles.has(relative))entries.push({path:relative,size:info.size,sha256:await digest(full)});
  }
  return entries;
}

/** @param {{root:string,sourceSha:string,runId:string,runAttempt:string,workflowRef:string}} options */
export async function packageStagingFixture(options){
  assertMetadata(options);
  const root=path.resolve(options.root),output=path.join(root,'.open-next');
  const entries=(await manifest(output,output)).sort((a,b)=>a.path.localeCompare(b.path,'en'));
  const worker=entries.find(e=>e.path==='worker.js');
  if(!worker||worker.size===0||!entries.some(e=>e.path.startsWith('assets/'))||!entries.some(e=>e.path.startsWith('server-functions/')))throw new Error('Incomplete OpenNext fixture layout');
  let runtime;
  try{runtime=JSON.parse(await readFile(path.join(output,'runtime-smoke-report.json'),'utf8'));}
  catch(error){
    if(/** @type {{code?:string}} */(error).code!=='ENOENT')throw error;
    runtime={result:'NOT_COMPLETED',fixtureOnly:true,deployable:false};
    await writeFile(path.join(output,'runtime-smoke-report.json'),JSON.stringify(runtime,null,2)+'\n');
  }
  if(runtime.fixtureOnly!==true||runtime.deployable!==false)throw new Error('Invalid fixture runtime report');
  const manifestBytes=JSON.stringify({algorithm:'sha256',files:entries},null,2)+'\n';
  await writeFile(path.join(output,'content-manifest.json'),manifestBytes);
  const sourcePackage=JSON.parse(await readFile(path.join(root,'package.json'),'utf8'));
  const provenance={
    schemaVersion:1,purpose:'staging-local-runtime-fixture',fixtureOnly:true,deployable:false,
    applicationSha:options.sourceSha,workflowSha:options.sourceSha,
    ciRunId:options.runId,ciRunAttempt:options.runAttempt,workflowRef:options.workflowRef,
    builtAtUtc:new Date().toISOString(),
    nextVersion:sourcePackage.dependencies.next,
    openNextVersion:sourcePackage.devDependencies['@opennextjs/cloudflare'],
    wranglerVersion:sourcePackage.devDependencies.wrangler,
    unsupportedNextVersionOverride:true,
    packageLockSha256:await digest(path.join(root,'package-lock.json')),
    wranglerConfigSha256:await digest(path.join(root,'wrangler.jsonc')),
    openNextConfigSha256:await digest(path.join(root,'open-next.config.ts')),
    workflowFileSha256:await digest(path.join(root,'.github/workflows/gaminglogoai-auth-entrypoint-bea0.yml')),
    workerSha256:worker.sha256,
    contentManifestSha256:createHash('sha256').update(manifestBytes).digest('hex'),
    extractedBuildContentSha256:createHash('sha256').update(JSON.stringify(entries)).digest('hex'),
    buildFileCount:entries.length,buildBytes:entries.reduce((total,e)=>total+e.size,0),
    publicBuildInputs:{stripeKey:'pk_test_ci',region:'us-east-1',bucket:'gaminglogoai-ci'},
    runtimeSmokeResult:runtime.result,
    runtimeCompatibilityDate:runtime.runtimeCompatibilityDate??null,
    deploymentCompatibilityDate:runtime.deploymentCompatibilityDate??null,
    productionInputsCompared:false,realGoogleLoginVerified:false,
  };
  await writeFile(path.join(output,'build-provenance.json'),JSON.stringify(provenance,null,2)+'\n');
  return {result:'STAGING_FIXTURE_ARTIFACT_PREPARED',sourceSha:options.sourceSha,buildFileCount:entries.length,workerSha256:worker.sha256,runtimeSmokeResult:runtime.result,deployable:false};
}

/** @param {{sourceSha:string,runId:string,runAttempt:string,workflowRef:string}} options */
function assertMetadata(options){
  if(!/^[a-f0-9]{40}$/.test(options.sourceSha)||!/^\d+$/.test(options.runId)||!/^\d+$/.test(options.runAttempt)||
      options.workflowRef!=='AyoubHdn/gaminglogoai-code/.github/workflows/gaminglogoai-auth-entrypoint-bea0.yml@refs/heads/staging/gaminglogoai-auth-entrypoint-bea0')throw new Error('Invalid pinned fixture provenance');
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  try{
    if(process.env.GITHUB_ACTIONS!=='true'||process.env.GITHUB_REPOSITORY!=='AyoubHdn/gaminglogoai-code'||process.env.GITHUB_REF_NAME!=='staging/gaminglogoai-auth-entrypoint-bea0')throw new Error('Only the dedicated staging CI branch may publish this fixture');
    for(const [name,value] of Object.entries({NEXT_PUBLIC_STRIPE_KEY:'pk_test_ci',NEXT_PUBLIC_AWS_REGION_GAMING:'us-east-1',NEXT_PUBLIC_S3_BUCKET_NAME_GAMING:'gaminglogoai-ci'}))if(process.env[name]!==value)throw new Error('Expected dummy public inputs only');
    const sourceSha=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
    if(sourceSha!==process.env.GITHUB_SHA)throw new Error('Checkout provenance mismatch');
    console.log(JSON.stringify(await packageStagingFixture({root:process.cwd(),sourceSha,runId:process.env.GITHUB_RUN_ID??'',runAttempt:process.env.GITHUB_RUN_ATTEMPT??'',workflowRef:process.env.GITHUB_WORKFLOW_REF??''})));
  }catch(error){console.error(error instanceof Error?error.message:'Fixture packaging failed');process.exitCode=1;}
}
