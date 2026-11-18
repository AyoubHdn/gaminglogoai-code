import assert from 'node:assert/strict';
import {generateKeyPairSync,sign,createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {readFile,readdir,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {stagingOrigin,allowedReads} from '../workers/staging-auth/profile.mjs';
import {supportedRuntimeDate} from './workers-runtime-smoke.mjs';

/** @typedef {Record<string,any>} Row */
/** @param {unknown} data @param {number=} status */
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json'}});
/** @param {string} directory @returns {Promise<string[]>} */
async function files(directory){const all=[];for(const item of await readdir(directory,{withFileTypes:true})){const full=path.join(directory,item.name);if(item.isDirectory())all.push(...await files(full));else if(item.isFile())all.push(full);}return all;}

/** @param {{root?:string,bundlePath?:string,reportPath?:string}} options */
export async function runStagingAuthRuntime(options={}) {
 const root=path.resolve(options.root??process.cwd());
 const require=createRequire(path.join(root,'package.json')),wranglerRequire=createRequire(require.resolve('wrangler/package.json'));
 const miniflarePath=wranglerRequire.resolve('miniflare'),mfRequire=createRequire(miniflarePath);
 const workerdVersion=JSON.parse(await readFile(mfRequire.resolve('workerd/package.json'),'utf8')).version;
 const {Miniflare,Log,LogLevel,convertV4MiniflareOptions}=await import(pathToFileURL(miniflarePath).href);
 const config=JSON.parse(await readFile(path.join(root,'wrangler.auth-staging.jsonc'),'utf8'));
 const runtimeDate=supportedRuntimeDate(config.compatibility_date,String(workerdVersion));
 const bindingVars={...config.vars,NEXTAUTH_SECRET:'ci-staging-nextauth-secret-not-for-real-deployment',GOOGLE_CLIENT_ID:'123456789-staging-ci.apps.googleusercontent.com',GOOGLE_CLIENT_SECRET:'ci-google-secret'};
 const bundle=path.resolve(root,options.bundlePath??'.ci-auth-runtime/bundle'),entry=path.join(bundle,'staging-auth-entry.js');
 const bundled=[entry,...(await files(bundle)).filter(p=>p!==entry&&!p.endsWith('.map'))];
 const modules=bundled.map(p=>({path:p,type:p.endsWith('.wasm')?'CompiledWasm':/\.(js|mjs)$/.test(p)?'ESModule':/\.(json|html|txt)$/.test(p)?'Text':'Data'}));
 /** @type {Map<string,Row>} */const users=new Map();
 /** @type {Map<string,Row>} */const accounts=new Map();
 /** @type {Map<string,Row>} */const sessions=new Map();
 /** @type {string[]} */const operations=[];
 /** @type {string[]} */const checks=[];
 let blockedOutbound=0,mockedGoogleRequests=0,mauticAttempts=0;
 /** @type {URL|null} */let authorizationUrl=null;
 const {privateKey,publicKey}=generateKeyPairSync('rsa',{modulusLength:2048});
 const publicJwk={...publicKey.export({format:'jwk'}),kid:'gla-staging-ci',alg:'RS256',use:'sig'};
 const claims=()=>({iss:'https://accounts.google.com',aud:bindingVars.GOOGLE_CLIENT_ID,sub:'ci-staging-google-subject',email:'staging-oauth-fixture@example.invalid',email_verified:true,name:'Staging OAuth fixture',iat:Math.floor(Date.now()/1000),exp:Math.floor(Date.now()/1000)+300,...(authorizationUrl?.searchParams.get('nonce')?{nonce:authorizationUrl.searchParams.get('nonce')}:{})});
 const idToken=()=>{const head=Buffer.from(JSON.stringify({alg:'RS256',kid:publicJwk.kid,typ:'JWT'})).toString('base64url'),body=Buffer.from(JSON.stringify(claims())).toString('base64url'),unsigned=head+'.'+body;return unsigned+'.'+sign('RSA-SHA256',Buffer.from(unsigned),privateKey).toString('base64url');};
 /** @param {Request} request */
 const database=async request=>{
   const {operation,input}=/** @type {{operation:string,input:Row}} */(await request.json());operations.push(operation);
   let data;
   switch(operation){
    case 'auth.getUser':data=users.get(input.id)??null;break;
    case 'auth.getUserByEmail':data=[...users.values()].find(u=>u.email===input.email)??null;break;
    case 'auth.getUserByAccount':{const a=accounts.get(input.account.provider+':'+input.account.providerAccountId);data=a?users.get(a.userId)??null:null;break;}
    case 'auth.createUser':assert.equal(input.email,claims().email);data={...input};users.set(input.id,data);break;
    case 'auth.updateUser':{const prior=users.get(input.id);assert.ok(prior);data={...prior,...input};users.set(input.id,data);break;}
    case 'auth.linkAccount':{const a=input.account;assert.equal(a.provider,'google');assert.equal(a.providerAccountId,claims().sub);assert.ok(users.has(a.userId));data={id:'ci-staging-account',refresh_token:null,access_token:null,expires_at:null,token_type:null,scope:null,id_token:null,session_state:null,...a};accounts.set(a.provider+':'+a.providerAccountId,data);break;}
    case 'auth.createSession':assert.ok(users.has(input.userId));data={...input};sessions.set(input.sessionToken,data);break;
    case 'auth.getSessionAndUser':{const s=sessions.get(input.sessionToken);data=s?{session:s,user:users.get(s.userId)}:null;break;}
    case 'auth.deleteSession':sessions.delete(input.sessionToken);data=null;break;
    case 'user.getCredits':assert.ok(users.has(input.userId));data=1;break;
    case 'user.getHasPurchasedCredits':assert.ok(users.has(input.userId));data=false;break;
    case 'icons.getSavedIcons':case 'icons.getEmoteBases':assert.ok(users.has(input.userId));data=[];break;
    case 'icons.getCommunityIcons':assert.equal(input.limit,50);data=[];break;
    default:throw new Error('Unexpected auth fixture DB operation');
   }
   return json({ok:true,data});
 };
 /** @param {Request} request */
 const outbound=async request=>{
   const url=new URL(request.url);
   if(request.method==='GET'&&url.href==='https://accounts.google.com/.well-known/openid-configuration'){
     mockedGoogleRequests++;return json({issuer:'https://accounts.google.com',authorization_endpoint:'https://accounts.google.com/o/oauth2/v2/auth',token_endpoint:'https://oauth2.googleapis.com/token',userinfo_endpoint:'https://openidconnect.googleapis.com/v1/userinfo',jwks_uri:'https://www.googleapis.com/oauth2/v3/certs',response_types_supported:['code'],subject_types_supported:['public'],id_token_signing_alg_values_supported:['RS256'],token_endpoint_auth_methods_supported:['client_secret_post','client_secret_basic'],code_challenge_methods_supported:['S256']});
   }
   if(request.method==='GET'&&url.href==='https://www.googleapis.com/oauth2/v3/certs'){mockedGoogleRequests++;return json({keys:[publicJwk]});}
   if(request.method==='POST'&&url.href==='https://oauth2.googleapis.com/token'){
     mockedGoogleRequests++;
     const fields=new URLSearchParams(await request.text());
     assert.equal(fields.get('code'),'ci-staging-authorization-code');assert.equal(fields.get('redirect_uri'),stagingOrigin+'/api/auth/callback/google');
     assert.equal(fields.get('grant_type'),'authorization_code');
     const verifier=fields.get('code_verifier');assert.ok(verifier);assert.ok(authorizationUrl);
     assert.equal(createHash('sha256').update(verifier).digest('base64url'),authorizationUrl.searchParams.get('code_challenge'));
     const auth=request.headers.get('authorization');
     if(auth){assert.equal(Buffer.from(auth.replace(/^Basic /,''),'base64').toString(),bindingVars.GOOGLE_CLIENT_ID+':'+bindingVars.GOOGLE_CLIENT_SECRET);}
     else {assert.equal(fields.get('client_id'),bindingVars.GOOGLE_CLIENT_ID);assert.equal(fields.get('client_secret'),bindingVars.GOOGLE_CLIENT_SECRET);}
     return json({access_token:'ci-staging-access-token',token_type:'Bearer',expires_in:300,id_token:idToken(),scope:'openid email profile'});
   }
   if(request.method==='GET'&&url.href==='https://openidconnect.googleapis.com/v1/userinfo'){mockedGoogleRequests++;return json(claims());}
   if(url.hostname==='127.0.0.1'&&url.port==='9'&&url.pathname.startsWith('/api/'))mauticAttempts++;
   blockedOutbound++;return json({error:'external_http_blocked'},502);
 };
 const runtimeOptions={host:'127.0.0.1',port:0,cf:false,log:new Log(LogLevel.ERROR),workers:[{name:'gla-staging-auth-local-fixture',modules,modulesRoot:bundle,compatibilityDate:runtimeDate,compatibilityFlags:['nodejs_compat'],bindings:bindingVars,serviceBindings:{DB_SERVICE:database,ASSETS:()=>new Response(null,{status:404})},outboundService:outbound}]};
 const mf=new Miniflare(typeof convertV4MiniflareOptions==='function'?convertV4MiniflareOptions(runtimeOptions):runtimeOptions);
 /** @type {Map<string,string>} */const cookies=new Map();
 /** @param {Headers} headers @param {Map<string,string>} jar */
 const remember=(headers,jar)=>{const h=/** @type {Headers&{getSetCookie?:()=>string[]}} */(headers);const list=h.getSetCookie?h.getSetCookie():[h.get('set-cookie')??''];for(const group of list)for(const cookie of group.split(/,(?=\s*[A-Za-z0-9_.-]+=)/)){const pair=cookie.trim().split(';')[0],index=pair?.indexOf('=')??-1;if(pair&&index>0){const name=pair.slice(0,index),value=pair.slice(index+1);if(!value)jar.delete(name);else jar.set(name,value);}}};
 /** @param {string} route @param {RequestInit=} init @param {Map<string,string>=} jar */
 const call=async(route,init={},jar=cookies)=>{const headers=new Headers(init.headers);if(jar.size)headers.set('cookie',[...jar].map(([k,v])=>k+'='+v).join('; '));const response=await mf.dispatchFetch(stagingOrigin+route,{...init,headers,redirect:'manual'});remember(response.headers,jar);return response;};
 let phase='startup';
 const report={result:'STAGING_AUTH_PROFILE_RUNTIME_STOPPED',fixtureOnly:true,deployable:false,realDatabaseUsed:false,liveGoogleLoginVerified:false,mockedGoogleOAuth:true,mauticCalled:false,mauticAttempted:false,generationSubmitted:false,runtimeCompatibilityDate:runtimeDate,deploymentCompatibilityDate:config.compatibility_date,checks,dbOperations:operations,mockedGoogleRequests:0,blockedOutbound:0,failurePhase:/** @type {string|null} */(null)};
 try{
   await mf.ready;checks.push(phase);
   phase='staging-signin-page';const page=await call('/');assert.equal(page.status,200);assert.match(await page.text(),/Sign in with Google/);checks.push(phase);
   phase='anonymous-session';const anonymous=await(await call('/api/auth/session')).json();assert.ok(!anonymous?.user&&!anonymous?.error);checks.push(phase);
   phase='google-provider-origin';const providers=await(await call('/api/auth/providers')).json();assert.equal(providers.google.callbackUrl,stagingOrigin+'/api/auth/callback/google');checks.push(phase);
   phase='csrf-and-google-authorization';const csrf=await(await call('/api/auth/csrf')).json();assert.equal(typeof csrf.csrfToken,'string');
   const signin=await call('/api/auth/signin/google',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded',origin:stagingOrigin},body:new URLSearchParams({csrfToken:csrf.csrfToken,callbackUrl:stagingOrigin+'/',json:'true'}).toString()});
   assert.equal(signin.status,200);const authorization=await signin.json();authorizationUrl=new URL(authorization.url);
   assert.equal(authorizationUrl.hostname,'accounts.google.com');assert.equal(authorizationUrl.searchParams.get('client_id'),bindingVars.GOOGLE_CLIENT_ID);assert.equal(authorizationUrl.searchParams.get('redirect_uri'),stagingOrigin+'/api/auth/callback/google');assert.equal(authorizationUrl.searchParams.get('code_challenge_method'),'S256');assert.ok(authorizationUrl.searchParams.get('state'));checks.push(phase);
   phase='invalid-state-does-not-create-user';const invalid=await call('/api/auth/callback/google?code=ci-staging-authorization-code&state=wrong-state',{},new Map(cookies));assert.ok((invalid.headers.get('location')??'').includes('/api/auth/error'));assert.equal(users.size,0);assert.equal(sessions.size,0);checks.push(phase);
   phase='signed-mock-google-callback';const callback=await call('/api/auth/callback/google?'+new URLSearchParams({code:'ci-staging-authorization-code',state:authorizationUrl.searchParams.get('state')??''}));assert.equal(callback.status,302);assert.equal(callback.headers.get('location'),stagingOrigin+'/');assert.equal(users.size,1);assert.equal(accounts.size,1);assert.equal(sessions.size,1);checks.push(phase);
   phase='authenticated-session';const signedIn=await(await call('/api/auth/session')).json();assert.equal(signedIn.user.email,claims().email);assert.ok(users.has(signedIn.user.id));checks.push(phase);
   phase='five-request-scoped-reads';for(const procedure of allowedReads){const response=await call('/api/trpc/'+procedure);assert.equal(response.status,200);const body=await response.json();assert.ok(!body.error&&body.result?.data);if(procedure==='user.getCredits')assert.equal(body.result.data.json,1);if(procedure==='user.getWatermarkStatus')assert.equal(body.result.data.json.watermarked,true);}checks.push(phase);
   phase='blocked-write-and-nonauth-routes';const before=operations.length;for(const route of ['/api/stripe','/api/stripe/webhook','/api/cron-sync','/api/cpa/unlock','/api/trpc/icons.generate','/api/trpc/checkout.createCheckout'])assert.equal((await call(route,{method:'POST',body:'{}'})).status,404);assert.equal(operations.length,before);checks.push(phase);
   phase='signout-session-deletion';const outCsrf=await(await call('/api/auth/csrf')).json();const signout=await call('/api/auth/signout',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded',origin:stagingOrigin},body:new URLSearchParams({csrfToken:outCsrf.csrfToken,callbackUrl:stagingOrigin+'/',json:'true'}).toString()});assert.equal(signout.status,200);assert.equal(sessions.size,0);const signedOut=await(await call('/api/auth/session')).json();assert.ok(!signedOut?.user&&!signedOut?.error);checks.push(phase);
   phase='no-mautic-or-real-provider-http';assert.ok(!operations.includes('auth.getUserForMautic'));assert.equal(blockedOutbound,0);assert.equal(mauticAttempts,0);assert.ok(mockedGoogleRequests>=3);checks.push(phase);
   report.result='STAGING_AUTH_PROFILE_RUNTIME_PASS';
 }catch{report.failurePhase=phase;}
 finally{await mf.dispose();}
 report.mockedGoogleRequests=mockedGoogleRequests;report.blockedOutbound=blockedOutbound;report.mauticAttempted=mauticAttempts>0;
 const reportPath=path.resolve(root,options.reportPath??'.staging-auth/runtime-smoke-report.json');await mkdir(path.dirname(reportPath),{recursive:true});await writeFile(reportPath,JSON.stringify(report,null,2)+'\n');
 return report;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){const result=await runStagingAuthRuntime();console.log(JSON.stringify(result,null,2));if(result.result!=='STAGING_AUTH_PROFILE_RUNTIME_PASS')process.exitCode=1;}
