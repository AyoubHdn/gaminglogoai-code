import assert from 'node:assert/strict';
import { mkdtemp,mkdir,symlink,readFile,writeFile,rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {createDbFixture,runWorkersRuntimeSmoke,supportedRuntimeDate} from './workers-runtime-smoke.mjs';

test('runtime compatibility date never exceeds the pinned binary date',()=>{
  assert.equal(supportedRuntimeDate('2026-11-12','1.20261006.1'),'2026-10-06');
  assert.equal(supportedRuntimeDate('2026-09-01','1.20261006.1'),'2026-09-01');
  assert.throws(()=>supportedRuntimeDate('2026-11-12','unknown'));
});

test('DB fixture rejects unrelated identities and write operations',async()=>{
  const fixture=createDbFixture();
  for(const [operation,token] of [
    ['auth.getSessionAndUser','unrelated-token'],
    ['auth.deleteUser','gla-local-runtime-session'],
    ['auth.deleteSession','gla-local-runtime-session'],
  ]){
    const response=await fixture.fetch(new Request('https://fixture.invalid/rpc',{method:'POST',body:JSON.stringify({operation,input:{sessionToken:token}})}));
    assert.equal(response.status,403);
  }
  assert.equal(fixture.unexpectedCalls,3);assert.equal(fixture.operations.length,0);
});

// This tests the harness against a tiny fixture application. CI separately runs
// the same harness against the actual Wrangler-bundled OpenNext application.
test('local workerd harness exercises sessions with a mocked service binding',async()=>{
  const root=await mkdtemp(path.join(os.tmpdir(),'gla-workerd-harness-'));
  try {
    await symlink(path.resolve('node_modules'),path.join(root,'node_modules'),'junction');
    await mkdir(path.join(root,'.ci-runtime/bundle'),{recursive:true});
    await mkdir(path.join(root,'.open-next/assets'),{recursive:true});
    await writeFile(path.join(root,'package.json'),'{}');
    await writeFile(path.join(root,'.open-next/assets/fixture.css'),'body{color:black}');
    await writeFile(path.join(root,'wrangler.jsonc'),JSON.stringify({
      name:'gaminglogoai-cloudflare-staging',compatibility_date:'2026-11-12',workers_dev:false,preview_urls:false,
      vars:{DB_AUTH_BACKEND:'service',DB_READS_BACKEND:'service',CLOUDFLARE_READ_ONLY_MODE:'true'},services:[{binding:'DB_SERVICE',service:'gaminglogoai-db-staging'}],
    }));
    await writeFile(path.join(root,'.ci-runtime/bundle/worker.js'),`
      export default {async fetch(request,env){
        const url=new URL(request.url);
        if(url.pathname==='/')return new Response('<html>fixture</html>',{headers:{'content-type':'text/html'}});
        if(url.pathname.endsWith('.css'))return env.ASSETS.fetch(request);
        if(url.pathname==='/api/auth/providers')return Response.json({google:{id:'google',callbackUrl:env.NEXTAUTH_URL+'/api/auth/callback/google'}});
        if(url.pathname==='/api/stripe')return new Response(null,{status:405,headers:{allow:'POST'}});
        const rpc=url.pathname.startsWith('/api/trpc/');
        const procedure=rpc?url.pathname.slice('/api/trpc/'.length):'';
        const procedures={
          'user.getCredits':'user.getCredits','user.getWatermarkStatus':'user.getHasPurchasedCredits',
          'icons.getIcons':'icons.getSavedIcons','icons.getEmoteBases':'icons.getEmoteBases','icons.getCommunityIcons':'icons.getCommunityIcons',
        };
        const db=async(operation,input)=>env.DB_SERVICE.fetch('https://fixture.invalid/rpc',{method:'POST',body:JSON.stringify({operation,input})});
        if(rpc&&!procedures[procedure])return Response.json({error:{}},{status:404});
        const cookie=request.headers.get('cookie');
        if(!cookie&&procedure!=='icons.getCommunityIcons')return rpc?Response.json({error:{}},{status:401}):Response.json(null);
        const sessionToken=cookie?.split('=')[1];
        const call=async operation=>(await env.DB_SERVICE.fetch('https://fixture.invalid/rpc',{method:'POST',body:JSON.stringify({operation,input:{sessionToken}})})).json();
        const result=cookie?await call('auth.getSessionAndUser'):null;
        if(result&&new Date(result.data.session.expires)<new Date()){
          await call('auth.deleteSession');return Response.json(null);
        }
        if(rpc){
          const response=await db(procedures[procedure],procedure==='icons.getCommunityIcons'?{limit:50}:{userId:result.data.user.id});
          if(!response.ok)return Response.json({error:{}},{status:500});
          let data=(await response.json()).data;
          if(procedure==='user.getWatermarkStatus')data={watermarked:data!==true};
          return Response.json({result:{data:{json:data,...(Array.isArray(data)?{meta:{values:{'0.createdAt':['Date']}}}:{})}}});
        }
        return Response.json({user:result.data.user,expires:result.data.session.expires});
      }};
    `);
    const result=await runWorkersRuntimeSmoke({root});
    assert.equal(result.result,'WORKERS_RUNTIME_SMOKE_PASS',JSON.stringify(result));
    assert.equal(result.outboundAttempts,0);assert.equal(result.realDatabaseUsed,false);
    assert.ok(result.dbOperations.filter(x=>x==='auth.getSessionAndUser').length>=2);
    assert.equal(result.dbOperations.filter(x=>x==='auth.deleteSession').length,1);
    const worker=path.join(root,'.ci-runtime/bundle/worker.js');
    const original=await readFile(worker,'utf8');
    await writeFile(worker,original.replace("if(url.pathname==='/')return", "if(url.pathname==='/')await fetch('https://blocked.fixture.invalid'); if(url.pathname==='/')return"));
    const denied=await runWorkersRuntimeSmoke({root});
    assert.equal(denied.result,'WORKERS_RUNTIME_SMOKE_STOPPED');assert.equal(denied.outboundAttempts,1);
  }finally{await rm(root,{recursive:true,force:true});}
});
