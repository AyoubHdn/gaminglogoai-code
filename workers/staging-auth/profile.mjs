export const stagingOrigin = 'https://gaminglogoai-cloudflare-staging.hdnstudio.workers.dev';
export const allowedReads = Object.freeze([
  'user.getCredits', 'user.getWatermarkStatus', 'icons.getIcons',
  'icons.getEmoteBases', 'icons.getCommunityIcons',
]);
const authGets = new Set(['providers', 'session', 'csrf', 'signin', 'signin/google', 'callback/google', 'signout', 'error']);
const authPosts = new Set(['signin/google', 'signout']);

/** @param {Record<string,unknown>} env */
export function assertStagingAuthEnvironment(env) {
  if (env.GAMING_AUTH_STAGING_ONLY !== 'true' || env.DB_AUTH_BACKEND !== 'service' ||
      env.DB_READS_BACKEND !== 'service' || env.CLOUDFLARE_READ_ONLY_MODE !== 'true' ||
      env.AUTH_EXTERNAL_SYNC_MODE !== 'disabled' || env.NEXTAUTH_URL !== stagingOrigin ||
      env.HOST_NAME !== stagingOrigin || !env.DB_SERVICE || typeof env.DB_SERVICE !== 'object' ||
      typeof /** @type {{fetch?:unknown}} */(env.DB_SERVICE).fetch !== 'function') {
    throw new Error('STAGING_AUTH_PROFILE_REJECTED');
  }
  if (typeof env.NEXTAUTH_SECRET !== 'string' || env.NEXTAUTH_SECRET.length < 32 ||
      typeof env.GOOGLE_CLIENT_ID !== 'string' || !/^[A-Za-z0-9_-]+\.apps\.googleusercontent\.com$/.test(env.GOOGLE_CLIENT_ID) ||
      typeof env.GOOGLE_CLIENT_SECRET !== 'string' || env.GOOGLE_CLIENT_SECRET.length === 0) {
    throw new Error('STAGING_AUTH_CREDENTIALS_MISSING');
  }
}

/** @param {Request} request */
export function allowedStagingRequest(request) {
  const url = new URL(request.url);
  if (url.origin !== stagingOrigin || url.searchParams.has('nextauth') || url.searchParams.has('trpc')) return false;
  if (request.method === 'GET' || request.method === 'HEAD') {
    if (url.pathname === '/') return true;
    if (request.method === 'HEAD') return false;
    if (url.pathname.startsWith('/api/auth/')) return authGets.has(url.pathname.slice('/api/auth/'.length));
    if (url.pathname.startsWith('/api/trpc/')) {
      return allowedReads.includes(url.pathname.slice('/api/trpc/'.length)) &&
        [...url.searchParams.keys()].every(key => key === 'input') && url.searchParams.getAll('input').length <= 1;
    }
  }
  if (request.method === 'POST' && url.pathname.startsWith('/api/auth/')) {
    const origin = request.headers.get('origin');
    return (!origin || origin === stagingOrigin) && authPosts.has(url.pathname.slice('/api/auth/'.length));
  }
  return false;
}

const browserScript = `
const status = document.querySelector('#status');
const detail = document.querySelector('#detail');
const output = document.querySelector('#result');
let lastResult = null;
async function session() {
  const response = await fetch('/api/auth/session', {cache:'no-store'});
  if (!response.ok) throw new Error('Session check failed');
  const value = await response.json();
  if (value && value.error) throw new Error('Session check failed');
  return value;
}
async function refresh() {
  const current = await session();
  const signedIn = !!(current && current.user && typeof current.user.id === 'string');
  status.textContent = signedIn ? 'Signed in' : 'Signed out';
  detail.textContent = signedIn ? (current.user.email || 'Google account connected') : 'Use your staging test Google account.';
  return current;
}
async function authAction(action) {
  const csrfResponse = await fetch('/api/auth/csrf', {cache:'no-store'});
  const csrf = await csrfResponse.json();
  if (!csrfResponse.ok || typeof csrf.csrfToken !== 'string') throw new Error('Security check failed');
  const response = await fetch('/api/auth/' + action, {method:'POST', headers:{'content-type':'application/x-www-form-urlencoded'}, body:new URLSearchParams({csrfToken:csrf.csrfToken, callbackUrl:location.origin+'/', json:'true'})});
  if (!response.ok) throw new Error('Sign-in action failed');
  const body = await response.json();
  if (action === 'signout') {
    const current = await refresh();
    if (current && current.user) throw new Error('Sign-out check failed');
    if (lastResult) {lastResult.signedOutVerified = true; output.textContent = JSON.stringify(lastResult,null,2);}
    return;
  }
  const target = new URL(body.url);
  if (target.protocol !== 'https:' || target.hostname !== 'accounts.google.com') throw new Error('Google authorization did not start');
  location.assign(target.href);
}
async function checkReads() {
  const current = await refresh();
  if (!current || !current.user || typeof current.user.id !== 'string') throw new Error('Sign in first');
  const results = {};
  for (const procedure of ['user.getCredits','user.getWatermarkStatus','icons.getIcons','icons.getEmoteBases','icons.getCommunityIcons']) {
    const response = await fetch('/api/trpc/'+procedure, {cache:'no-store'});
    const body = await response.json();
    if (!response.ok || body.error || !body.result || !body.result.data) throw new Error('Account read check failed');
    results[procedure] = body.result.data.json;
  }
  if (typeof results['user.getCredits'] !== 'number' || typeof results['user.getWatermarkStatus'].watermarked !== 'boolean' ||
      !Array.isArray(results['icons.getIcons']) || !Array.isArray(results['icons.getEmoteBases']) || !Array.isArray(results['icons.getCommunityIcons'])) throw new Error('Unexpected account read result');
  lastResult = {result:'STAGING_AUTHENTICATED_READS_PASS', checks:{authenticatedSession:true, sessionUserIdPresent:true, creditsRead:true, watermarkRead:true, savedIconsRead:true, emoteBasesRead:true, communityRead:true}, externalSyncMode:'disabled', generationSubmitted:false, signedOutVerified:false};
  output.textContent = JSON.stringify(lastResult,null,2);
}
function action(button, handler) {
  document.querySelector(button).addEventListener('click', async () => {
    try {await handler();} catch {output.textContent='Check stopped. No generation or payment was submitted. Review the browser sign-in result.';}
  });
}
action('#signin',()=>authAction('signin/google'));
action('#check',checkReads);
action('#signout',()=>authAction('signout'));
action('#copy',async()=>{if(!lastResult)throw new Error('No result');await navigator.clipboard.writeText(JSON.stringify(lastResult,null,2));});
refresh().catch(()=>{status.textContent='Session check unavailable';});
`;

function page() {
  const nonce = crypto.randomUUID().replaceAll('-', '');
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>GamingLogoAI staging sign-in</title><style>body{font:16px system-ui,sans-serif;max-width:760px;margin:48px auto;padding:0 20px;background:#111827;color:#f8fafc}button{padding:12px 16px;margin:8px 8px 8px 0;border:0;border-radius:8px;cursor:pointer}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#1f2937;padding:18px;border-radius:8px}p{line-height:1.6}.badge{color:#fbbf24}</style></head><body><p class="badge">Isolated staging test</p><h1>GamingLogoAI sign-in</h1><p>Sign in with your test Google account, check your account reads, then sign out. Purchases and image generation are unavailable here.</p><h2 id="status">Checking session…</h2><p id="detail"></p><button id="signin">Sign in with Google</button><button id="check">Check my account</button><button id="signout">Sign out</button><button id="copy">Copy test result</button><pre id="result">No account test has run yet.</pre><script nonce="${nonce}">${browserScript}</script></body></html>`;
  return new Response(html, {headers:{'content-type':'text/html; charset=utf-8','content-security-policy':`default-src 'none'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'`}});
}

/** @param {Response} response */
function privateResponse(response) {
  const result = new Response(response.body, response);
  result.headers.set('cache-control', 'no-store');
  result.headers.set('x-robots-tag', 'noindex, nofollow');
  result.headers.set('x-content-type-options', 'nosniff');
  result.headers.set('referrer-policy', 'no-referrer');
  return result;
}

/** @param {Request} request @param {Record<string,unknown>} env @param {unknown} ctx @param {{fetch:(request:Request,env:Record<string,unknown>,ctx:unknown)=>Promise<Response>}} application */
export async function stagingAuthFetch(request, env, ctx, application) {
  if (!allowedStagingRequest(request)) return privateResponse(new Response('Not available on the staging sign-in site', {status:404}));
  try {assertStagingAuthEnvironment(env);} catch {return privateResponse(new Response('Staging sign-in is not configured yet', {status:503}));}
  if (new URL(request.url).pathname === '/') {
    const response = page();
    return privateResponse(request.method === 'HEAD' ? new Response(null,response) : response);
  }
  const headers = new Headers(request.headers);
  headers.set('host', new URL(stagingOrigin).host);
  headers.set('x-forwarded-host', new URL(stagingOrigin).host);
  headers.set('x-forwarded-proto', 'https');
  return privateResponse(await application.fetch(new Request(request,{headers}),env,ctx));
}
