import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import {allowedReads,stagingOrigin,allowedStagingRequest,assertStagingAuthEnvironment,stagingAuthFetch} from './profile.mjs';

function environment() {
  return {GAMING_AUTH_STAGING_ONLY:'true',DB_AUTH_BACKEND:'service',DB_READS_BACKEND:'service',CLOUDFLARE_READ_ONLY_MODE:'true',AUTH_EXTERNAL_SYNC_MODE:'disabled',NEXTAUTH_URL:stagingOrigin,HOST_NAME:stagingOrigin,NEXTAUTH_SECRET:'ci-staging-secret-that-is-at-least-32-characters',GOOGLE_CLIENT_ID:'12345-staging-test.apps.googleusercontent.com',GOOGLE_CLIENT_SECRET:'ci-google-secret',DB_SERVICE:{fetch:()=>Promise.resolve(new Response('fixture'))}};
}

void test('staging profile rejects missing credentials and unsafe server selectors',()=>{
  assert.doesNotThrow(()=>assertStagingAuthEnvironment(environment()));
  for (const change of [{AUTH_EXTERNAL_SYNC_MODE:'enabled'},{DB_AUTH_BACKEND:'prisma'},{DB_READS_BACKEND:'prisma'},{CLOUDFLARE_READ_ONLY_MODE:'false'},{HOST_NAME:'https://gaminglogoai.com'},{NEXTAUTH_URL:'https://www.namedesignai.com'},{DB_SERVICE:undefined},{NEXTAUTH_SECRET:'ci-short'},{GOOGLE_CLIENT_ID:'ci-google-client'},{GOOGLE_CLIENT_SECRET:''}]) assert.throws(()=>assertStagingAuthEnvironment({...environment(),...change}));
});

void test('only the exact staging host, auth endpoints and five GET reads are allowed',()=>{
  for (const procedure of allowedReads) assert.equal(allowedStagingRequest(new Request(stagingOrigin+'/api/trpc/'+procedure)),true);
  for (const route of ['/api/auth/session','/api/auth/providers','/api/auth/csrf','/api/auth/callback/google']) assert.equal(allowedStagingRequest(new Request(stagingOrigin+route)),true);
  for (const route of ['/api/auth/signin/google','/api/auth/signout']) assert.equal(allowedStagingRequest(new Request(stagingOrigin+route,{method:'POST',headers:{origin:stagingOrigin}})),true);
  for (const route of ['/api/stripe','/api/stripe/webhook','/api/cron-sync','/api/cpa/unlock','/api/trpc/checkout.createCheckout','/api/trpc/icons.generate','/api/trpc/user.getCredits,icons.getIcons','/_next/static/anything.js','/api/auth/callback/credentials']) for (const method of ['GET','POST']) assert.equal(allowedStagingRequest(new Request(stagingOrigin+route,{method})),false);
  for (const target of [stagingOrigin+'/api/auth/session?nextauth=callback/google',stagingOrigin+'/api/trpc/user.getCredits?trpc=checkout.createCheckout',stagingOrigin+'/api/trpc/user.getCredits?batch=1','https://gaminglogoai.com/api/auth/session','https://www.namedesignai.com/api/auth/session']) assert.equal(allowedStagingRequest(new Request(target)),false);
  assert.equal(allowedStagingRequest(new Request(stagingOrigin+'/api/auth/signout',{method:'POST',headers:{origin:'https://outside.invalid'}})),false);
});

void test('blocked requests never enter the app; safe forwarding pins origin headers',async()=>{
  let calls=0;
  /** @type {{fetch:(request:Request)=>Promise<Response>}} */
  const app={async fetch(request){calls++;assert.equal(request.headers.get('x-forwarded-host'),new URL(stagingOrigin).host);assert.equal(request.headers.get('x-forwarded-proto'),'https');return new Response('fixture',{headers:{'set-cookie':'fixture=value; HttpOnly; Secure'}});}};
  for (const route of ['/api/stripe','/api/trpc/icons.generate','/api/cpa/unlock']) assert.equal((await stagingAuthFetch(new Request(stagingOrigin+route,{method:'POST'}),environment(),{},app)).status,404);
  assert.equal(calls,0);
  assert.equal((await stagingAuthFetch(new Request(stagingOrigin+'/api/auth/session'),{...environment(),GOOGLE_CLIENT_SECRET:''},{},app)).status,503);
  assert.equal(calls,0);
  const r=await stagingAuthFetch(new Request(stagingOrigin+'/api/auth/session',{headers:{'x-forwarded-host':'gaminglogoai.com'}}),environment(),{},app);
  assert.equal(calls,1);assert.equal(r.headers.get('cache-control'),'no-store');assert.equal(r.headers.get('set-cookie'),'fixture=value; HttpOnly; Secure');
});

void test('staging page is self-contained with a valid browser script and no shared app assets',async()=>{
  const app={async fetch(){throw new Error('Root page must not call the app');}};
  const response=await stagingAuthFetch(new Request(stagingOrigin+'/'),environment(),{},app),html=await response.text();
  assert.equal(response.status,200);assert.match(response.headers.get('content-security-policy')??'',/connect-src 'self'/);assert.match(html,/Sign in with Google/);assert.doesNotMatch(html,/<script[^>]+src=/);
  const source=html.match(/<script nonce="[^"]+">([\s\S]+)<\/script>/)?.[1];assert.ok(source);assert.doesNotThrow(()=>new vm.Script(source));
});
