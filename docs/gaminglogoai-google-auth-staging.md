# GamingLogoAI Google sign-in staging candidate

This adds a separate auth-only application profile for a future workers.dev
staging test. No deployment, remote migration, DNS edit, provider call, production
credential read, or NameDesignAI operation is performed by its build workflow.
The existing root `wrangler.jsonc` and Vercel/Prisma default are preserved.

## Prerequisite already demonstrated

The locally running real application passed all five reads through the deployed
`gaminglogoai-db-staging` Worker and real isolated Supabase database. Its two
synthetic users/sessions were removed and verified absent. Source was
`f01f171bbfe3b5c376a12c8dc71cddb63a9c3c5e`; run ID was
`gla-app-3a39b306-b231-406c-8000-cbe5f0c00271`. DB version remained
`cfd80dca-cead-4e7b-a937-3e60020a6bef` at 100%.
That test did not exercise Google login.

## Staging profile

- Intended Worker: `gaminglogoai-cloudflare-staging`.
- Intended origin: `https://gaminglogoai-cloudflare-staging.hdnstudio.workers.dev`.
- Private Service Binding: `DB_SERVICE -> gaminglogoai-db-staging`.
- Hyperdrive required by later provider preflight: `207b5736cff94597b679eafb1478be35`.
- Isolated Supabase project: `wvwjeqynnnplmcaljfqk`.
- `DB_AUTH_BACKEND=service`, `DB_READS_BACKEND=service`, `CLOUDFLARE_READ_ONLY_MODE=true`.
- `AUTH_EXTERNAL_SYNC_MODE=disabled` returns from both auth events before a
  Mautic profile read or synchronization. The default remains `enabled` for the
  existing Vercel/Prisma behavior.
- `GAMING_AUTH_STAGING_ONLY=true` gates the wrapper. Missing/mismatched flags,
  runtime credentials, hostname, or binding produce a closed response.
- workers.dev and preview URLs remain disabled in every committed/packaged config.
- No custom routes, custom domains, schedules, generation providers or payment routes.

The root page is a self-contained sign-in/check/sign-out page. It does not load
the full app's advertising, payment, or generation UI. All requests enter the
wrapper before assets. Only the exact staging origin is accepted.

The wrapper allows the needed NextAuth Google/session/CSRF/sign-out routes and
GET requests for exactly five tRPC procedures:
`user.getCredits`, `user.getWatermarkStatus`, `icons.getIcons`,
`icons.getEmoteBases`, and `icons.getCommunityIcons`.
Reserved router overrides and batched/mixed procedure paths are blocked.
Payment, generation, CPA, cron and unrelated API requests are blocked before
entering the application. NextAuth retains its CSRF, state, PKCE, secure cookies,
database-session strategy and same-origin redirect policy.

The browser page's copied result reports authenticated reads and sign-out only.
An operator must separately observe the real Google authorization/callback;
a copied session result alone is not proof of that real provider exchange.

## CI proof and artifact

The existing staging workflow first retains its fixture-only OpenNext artifact.
It then creates `.staging-auth/`, bundles it with Wrangler, and runs the actual
application in workerd against an in-memory DB fixture and a mocked Google OIDC
provider. The provider returns a freshly RSA-signed ID token; the real NextAuth
implementation validates its issuer, audience, signature, state and PKCE flow.
The fixture also exercises invalid state rejection, account/user/session creation,
five protected/public reads, sign-out/session deletion, and absence of Mautic or
unapproved outbound requests. No real Google or database network is used by CI.

Only a passing auth runtime proof produces the candidate artifact:
`gaminglogoai-staging-google-auth-candidate-<application SHA>`.
It includes the full build, auth wrapper/profile, private standalone config,
content hashes, CI/source provenance, and both runtime reports. The public inputs
are explicitly CI dummy Stripe/S3 values, appropriate only for this restricted
sign-in profile. This is not a production application build.

Provenance stays `deployable=false`, with readiness requiring private runtime
credentials and fresh provider inventory. Local mocked OAuth success is recorded
separately from real Google login and real staging-database login, which remain
unverified until an operator performs that browser test.
OpenNext's existing unsupported Next-version override remains disclosed.

## Next operator steps (not executed by this change)

1. Verify the retained artifact's ZIP digest, complete contents, source SHA and CI run.
2. Use a separate staging Google Cloud project and create a Google OAuth Web
   application client there. Its consent audience can remain in testing without
   changing production publishing status. Register
   exactly `https://gaminglogoai-cloudflare-staging.hdnstudio.workers.dev/api/auth/callback/google`.
   Use the staging origin for an Authorized JavaScript origin if one is requested.
   Keep that staging consent application in testing and use designated test accounts.
   Do not change the production OAuth client's redirect configuration.
3. Privately provide `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and a fresh
   staging-only `NEXTAUTH_SECRET` of at least 32 characters. Do not paste them into
   chat, save them in the artifact, or add them to the CI workflow.
4. Prepare a guarded deployment launcher. It must freshly verify the Cloudflare
   account/subdomain, DB Worker version/binding/Hyperdrive target, closed public
   routing, and the candidate's complete integrity. Private upload comes before
   secret configuration; enable only the intended workers.dev hostname after all
   checks. No production routing or other Worker should be changed.
5. Observe real Google sign-in, confirm the returned account in the staging page,
   run the account reads, sign out, and verify the session is gone. Retain sanitized
   evidence only. This intentionally creates isolated staging account/session rows;
   no automatic real-user deletion or production data copying is implemented.

No guarded deployment launcher or live Google verification is implied by a
successful build. Those operations need the private inputs and fresh inventory.
