import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const fixtureOrigin = 'https://gaminglogoai-runtime.fixture.invalid';
const fixtureUserId = 'gla-local-runtime-user';
const validToken = 'gla-local-runtime-session';
const expiredToken = 'gla-local-runtime-expired';

/** @param {string} compatibilityDate @param {string} workerdVersion */
export function supportedRuntimeDate(compatibilityDate, workerdVersion) {
  const match = /^1\.(\d{4})(\d{2})(\d{2})\./.exec(workerdVersion);
  if (!match) throw new Error('Unrecognized pinned workerd version');
  const binaryDate = `${match[1]}-${match[2]}-${match[3]}`;
  return compatibilityDate < binaryDate ? compatibilityDate : binaryDate;
}

export function createDbFixture() {
  /** @type {string[]} */
  const operations = [];
  let unexpectedCalls = 0;
  /** @param {unknown} data @param {number=} status */
  const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json'}});
  return {
    operations,
    get unexpectedCalls() { return unexpectedCalls; },
    /** @param {Request} request */
    async fetch(request) {
      const body = /** @type {{operation?:unknown,input?:{sessionToken?:unknown}}} */ (await request.json());
      const operation = body?.operation;
      const token = body?.input?.sessionToken;
      if (request.method !== 'POST' ||
          !['auth.getSessionAndUser','auth.deleteSession'].includes(String(operation)) ||
          ![validToken,expiredToken].includes(String(token)) ||
          (operation === 'auth.deleteSession' && token !== expiredToken)) {
        unexpectedCalls++;
        return json({ok:false,error:{code:'FIXTURE_OPERATION_REJECTED'}},403);
      }
      operations.push(String(operation));
      if (operation === 'auth.deleteSession') return json({ok:true,data:null});
      return json({ok:true,data:{
        session:{sessionToken:token,userId:fixtureUserId,expires:token===expiredToken?'2000-01-01T00:00:00.000Z':'2030-01-01T00:00:00.000Z'},
        user:{id:fixtureUserId,email:'runtime-fixture@example.invalid',name:'Runtime fixture',image:null,emailVerified:null},
      }});
    },
  };
}

/** @param {string} directory */
export function createAssetFixture(directory) {
  const root=path.resolve(directory);
  /** @param {Request} request */
  return async(request)=>{
    const pathname=decodeURIComponent(new URL(request.url).pathname);
    if(pathname.includes('\\')||pathname.includes('\0'))return new Response(null,{status:400});
    const file=path.resolve(root,pathname.replace(/^\/+/,''));
    const relative=path.relative(root,file);
    if(relative==='..'||relative.startsWith('..'+path.sep)||path.isAbsolute(relative))return new Response(null,{status:403});
    for(const candidate of [file,file+'.html',path.join(file,'index.html')]){
      try{
        if(!(await stat(candidate)).isFile())continue;
        /** @type {Record<string,string>} */
        const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
        return new Response(await readFile(candidate),{headers:{'content-type':mime[path.extname(candidate)]??'application/octet-stream'}});
      }catch(error){if(/** @type {{code?:string}} */(error).code!=='ENOENT'&&/** @type {{code?:string}} */(error).code!=='ENOTDIR')throw error;}
    }
    return new Response(null,{status:404});
  };
}

/** @param {string} directory @returns {Promise<string[]>} */
async function allFiles(directory) {
  /** @type {string[]} */
  const files=[];
  for (const entry of await readdir(directory,{withFileTypes:true})) {
    const full=path.join(directory,entry.name);
    if(entry.isDirectory())files.push(...await allFiles(full));
    else if(entry.isFile())files.push(full);
  }
  return files;
}

/** @template T @param {Promise<T>} promise @param {number} milliseconds @param {string} phase @returns {Promise<T>} */
async function bounded(promise,milliseconds,phase) {
  /** @type {ReturnType<typeof setTimeout>|undefined} */
  let timer;
  try {
    return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error(`Timeout: ${phase}`)),milliseconds);})]);
  } finally {if(timer)clearTimeout(timer);}
}

/** @param {unknown} error */
function safeDiagnostic(error) {
  return (error instanceof Error?error.message:'Unknown runtime error')
    .replace(/postgres(?:ql)?:\/\/[^\s"']+/g,'[database-url]')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,'[email]')
    .replace(/gla-local-runtime-(?:session|expired)/g,'[fixture-session]')
    .slice(0,1200);
}

/** @param {{root?:string,bundlePath?:string,assetsDirectory?:string}} options */
export async function runWorkersRuntimeSmoke(options={}) {
  const root=path.resolve(options.root??process.cwd());
  const require=createRequire(path.join(root,'package.json'));
  const wranglerRequire=createRequire(require.resolve('wrangler/package.json'));
  const miniflarePath=wranglerRequire.resolve('miniflare');
  const miniflareRequire=createRequire(miniflarePath);
  const workerdVersion=JSON.parse(await readFile(miniflareRequire.resolve('workerd/package.json'),'utf8')).version;
  const miniflareVersion=JSON.parse(await readFile(wranglerRequire.resolve('miniflare/package.json'),'utf8')).version;
  const {Miniflare,Log,LogLevel,convertV4MiniflareOptions}=await import(pathToFileURL(miniflarePath).href);
  const config=JSON.parse(await readFile(path.join(root,'wrangler.jsonc'),'utf8'));
  assert.equal(config.name,'gaminglogoai-cloudflare-staging');
  assert.equal(config.workers_dev,false);
  assert.equal(config.preview_urls,false);
  assert.equal(config.vars.DB_AUTH_BACKEND,'service');
  assert.equal(config.services.length,1);
  assert.equal(config.services[0].binding,'DB_SERVICE');
  assert.equal(config.services[0].service,'gaminglogoai-db-staging');
  const runtimeDate=supportedRuntimeDate(config.compatibility_date,workerdVersion);
  const bundle=path.resolve(root,options.bundlePath??'.ci-runtime/bundle/worker.js');
  assert.ok((await stat(bundle)).size>0);
  const bundledModules=[bundle,...(await allFiles(path.dirname(bundle))).filter(file=>file!==bundle&&!file.endsWith('.map'))];
  const modules=bundledModules.map(file=>({path:file,type:file.endsWith('.wasm')?'CompiledWasm':/\.(?:html|txt|json)$/.test(file)?'Text':/\.(?:js|mjs)$/.test(file)?'ESModule':'Data'}));
  const assets=path.resolve(root,options.assetsDirectory??'.open-next/assets');
  const css=(await allFiles(assets)).find(file=>file.endsWith('.css'));
  if(!css)throw new Error('No compiled CSS asset found');
  const fixture=createDbFixture();
  let outboundAttempts=0;
  /** @type {Array<{route:string,status:number}>} */
  const requests=[];
  const result={
    result:'WORKERS_RUNTIME_SMOKE_STOPPED',
    fixtureOnly:true,deployable:false,
    assetsBackend:'generated-files-local-service-fixture',
    deploymentCompatibilityDate:String(config.compatibility_date),
    runtimeCompatibilityDate:runtimeDate,
    compatibilityDateMatches:runtimeDate===config.compatibility_date,
    miniflareVersion:String(miniflareVersion),workerdVersion:String(workerdVersion),
    checks:/** @type {string[]} */([]),requests,
    dbOperations:fixture.operations,outboundAttempts:0,
    realDatabaseUsed:false,googleLoginTested:false,mauticCalled:false,
    generationSubmitted:false,mutationsToLiveResources:false,
    failurePhase:/** @type {string|null} */(null),diagnostic:/** @type {string|null} */(null),
  };
  let phase='startup';
  // Only explicit dummy bindings reach workerd; Node process credentials are not copied.
  const bindings={
    NODE_ENV:'production',DB_AUTH_BACKEND:'service',
    DATABASE_URL:'postgresql://invalid:invalid@db.invalid:5432/invalid',
    NEXTAUTH_SECRET:'ci-nextauth-secret',NEXTAUTH_URL:fixtureOrigin,HOST_NAME:fixtureOrigin,
    GOOGLE_CLIENT_ID:'ci-google-client',GOOGLE_CLIENT_SECRET:'ci-google-secret',
    REPLICATE_API_TOKEN:'ci-replicate-token',MOCK_REPLICATE:'true',
    SECRET_ACCESS_KEY:'ci-secret',ACCESS_KEY_ID:'ci-access-key',STRIPE_SECRET_KEY:'sk_test_ci',STRIPE_WEB_HOOK_SECRET:'whsec_ci',
    PRICE_ID_STARTER:'price_ci_starter',PRICE_ID_PRO:'price_ci_pro',PRICE_ID_ELITE:'price_ci_elite',
    MAUTIC_BASE_URL:'http://127.0.0.1:9',MAUTIC_USERNAME:'ci-mautic',MAUTIC_PASSWORD:'ci-mautic-password',
    CRON_SECRET:'ci-cron-secret',MYLEAD_SECURITY_KEY:'ci-mylead-key',IPAPI_KEY:'ci-ipapi-key',
    NEXT_PUBLIC_STRIPE_KEY:'pk_test_ci',NEXT_PUBLIC_AWS_REGION_GAMING:'us-east-1',NEXT_PUBLIC_S3_BUCKET_NAME_GAMING:'gaminglogoai-ci',
  };
  const runtimeOptions={
    host:'127.0.0.1',port:0,cf:false,log:new Log(LogLevel.ERROR),
    name:'gaminglogoai-local-runtime-fixture',modules,modulesRoot:path.dirname(bundle),
    compatibilityDate:runtimeDate,compatibilityFlags:['nodejs_compat'],
    bindings,
    serviceBindings:{DB_SERVICE:/** @param {Request} request */(request)=>fixture.fetch(request),ASSETS:createAssetFixture(assets)},
    outboundService:()=>{outboundAttempts++;return new Response('Outbound network blocked by local fixture',{status:502});},
    cachePersist:false,kvPersist:false,d1Persist:false,r2Persist:false,durableObjectsPersist:false,
  };
  // Miniflare 5 exposes a public converter for the Miniflare 4 options shape.
  const mf=new Miniflare(typeof convertV4MiniflareOptions==='function'?convertV4MiniflareOptions(runtimeOptions):runtimeOptions);
  /** @param {string} route @param {string=} token @returns {Promise<Response>} */
  const get=async(route,token)=>{
    const response=await bounded(mf.dispatchFetch(fixtureOrigin+route,{method:'GET',redirect:'manual',headers:token?{cookie:`__Secure-next-auth.session-token=${token}`}:{}}),30_000,route);
    requests.push({route,status:response.status});
    if(response.status>=500)throw new Error(`Worker HTTP ${response.status}: ${(await response.text()).slice(0,4000)}`);
    return response;
  };
  try {
    await bounded(mf.ready,45_000,'startup');result.checks.push('workerd-startup');
    phase='homepage';
    const home=await get('/');assert.equal(home.status,200);assert.match(await home.text(),/<html/i);result.checks.push(phase);
    phase='static-asset';
    const assetPath='/'+path.relative(assets,css).split(path.sep).join('/');
    const asset=await get(assetPath);assert.equal(asset.status,200);assert.ok((await asset.arrayBuffer()).byteLength>0);result.checks.push(phase);
    phase='auth-providers';
    const providers=await get('/api/auth/providers');assert.equal(providers.status,200);
    const providerBody=await providers.json();assert.equal(providerBody.google?.id,'google');
    assert.equal(providerBody.google.callbackUrl,fixtureOrigin+'/api/auth/callback/google');result.checks.push(phase);
    phase='anonymous-session';
    const anonymous=await get('/api/auth/session');assert.equal(anonymous.status,200);
    const anonymousBody=await anonymous.json();assert.ok(anonymousBody===null||(!anonymousBody.user&&!anonymousBody.error));result.checks.push(phase);
    phase='synthetic-authenticated-session';
    const authenticated=await get('/api/auth/session',validToken);assert.equal(authenticated.status,200);
    const authenticatedBody=await authenticated.json();assert.equal(authenticatedBody.user?.id,fixtureUserId);result.checks.push(phase);
    phase='expired-session';
    const expired=await get('/api/auth/session',expiredToken);assert.equal(expired.status,200);
    const expiredBody=await expired.json();assert.ok(expiredBody===null||(!expiredBody.user&&!expiredBody.error));
    assert.equal(fixture.operations.filter(x=>x==='auth.deleteSession').length,1);result.checks.push(phase);
    phase='stripe-method-guard';
    const stripe=await get('/api/stripe');assert.equal(stripe.status,405);assert.match(stripe.headers.get('allow')??'',/POST/i);result.checks.push(phase);
    assert.equal(fixture.unexpectedCalls,0);assert.equal(outboundAttempts,0);
    result.result='WORKERS_RUNTIME_SMOKE_PASS';
  } catch(error) {
    result.failurePhase=phase;result.diagnostic=safeDiagnostic(error);
  } finally {
    result.outboundAttempts=outboundAttempts;
    try {await bounded(mf.dispose(),15_000,'dispose');}
    catch(error){result.result='WORKERS_RUNTIME_SMOKE_STOPPED';result.failurePhase='dispose';result.diagnostic=safeDiagnostic(error);}
  }
  return result;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  const report=path.resolve('.open-next/runtime-smoke-report.json');
  try {
    const result=await runWorkersRuntimeSmoke();
    await mkdir(path.dirname(report),{recursive:true});
    await writeFile(report,JSON.stringify(result,null,2)+'\n');
    console.log(JSON.stringify(result));
    if(result.result!=='WORKERS_RUNTIME_SMOKE_PASS')process.exitCode=1;
  } catch(error) {
    const result={result:'WORKERS_RUNTIME_SMOKE_STOPPED',fixtureOnly:true,deployable:false,failurePhase:'harness-setup',diagnostic:safeDiagnostic(error),realDatabaseUsed:false};
    await mkdir(path.dirname(report),{recursive:true});await writeFile(report,JSON.stringify(result,null,2)+'\n');
    console.error(JSON.stringify(result));process.exitCode=1;
  }
}
