# Request-scoped application reads

`DB_READS_BACKEND` is a server-only selector. Its default `prisma` preserves the
Vercel application path. In `service` mode, `createRequestGamingDbService()`
obtains the current OpenNext `DB_SERVICE` binding and uses the existing remote
adapter. Missing/malformed bindings, context failures, unsupported selectors and
RPC failures reject without a Prisma fallback. No client headers or RPC inputs
can choose the backend.

The five migrated operations remain credits, purchase/watermark status, saved
icons, emote bases and public community icons. Protected handlers derive the
user ID from the NextAuth session. The remote adapter converts icon dates before
tRPC/SuperJSON serializes them. Existing DB Worker operations and schemas are
unchanged; this slice requires no DB Worker deployment or migration.

## Explicit staging HTTP profile

`CLOUDFLARE_READ_ONLY_MODE=true` makes the tRPC HTTP entrypoint load only the
`user` and `icons` read routers. It requires `DB_READS_BACKEND=service`.
Other tRPC namespaces, including checkout and generation, return NOT_FOUND.
The default `false` keeps the full Vercel router. The client AppRouter types
remain the full application contract; this is a deliberately incomplete staging
profile, not a claim that all product features are migrated.

The small read router uses the pure watermark policy directly and never loads
native Sharp processing. `imageWatermark.ts` reexports that same policy for
existing generation callers. The tRPC context does not import Prisma in the
read-only profile. Its legacy `prisma` field is an explicit throwing access
guard, not a fake database implementation. Accidental legacy access fails.

This flag scopes only the tRPC endpoint. Other API routes remain subject to
their own migration and validation; it is not a global read-only firewall.
No public Worker URLs or routes are enabled by this change.

## Validation

Request-level unit tests cover backend defaults, request binding isolation,
unsupported selectors, context/binding failures, and RPC error propagation.
The existing disposable PostgreSQL integration tests remain in CI.

The packaged application is exercised inside local workerd with dummy inputs,
network egress blocked and a mocked DB service. Synthetic accounts have different
credits, purchase flags and icon sets. HTTP checks exercise all five read
operations, account isolation, an attempted caller-supplied user ID, Date
serialization, anonymous protection, public community reads, remote-service
failure, and rejection of an unmigrated checkout route. They do not call Google,
Mautic, Stripe, S3 or a real database.

The fixture artifact remains non-deployable and records its content hashes and
runtime report. Real Google login, deployed compatibility-date behavior, real
Cloudflare application-to-DB binding behavior and all unmigrated writes still
require separate validation.
