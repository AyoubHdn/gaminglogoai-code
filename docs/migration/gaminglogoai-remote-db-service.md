# GamingLogoAI private DB Worker prototype

Base source: 99f322de8bfa0ffa9a2fce2dbb2307a894989bf1.

## Boundary

Vercel remains on the Prisma adapter. The new createRemoteGamingDbService uses a Cloudflare Service Binding only when the caller explicitly selects backend: "service"; a missing binding throws before a database request. No environment default is changed.

The five remote operations are:
- user.getCredits
- user.getHasPurchasedCredits
- icons.getSavedIcons
- icons.getEmoteBases
- icons.getCommunityIcons

The adapter sends a small JSON RPC envelope and converts returned ISO createdAt strings back to Date instances. The Worker enforces the same account filters, emote-base prefix rules, newest-first ordering, public limit clamp, and null-for-missing-user behavior as Prisma.

## Packaging evidence

The Worker uses postgres@3.4.7, nodejs_compat, and Wrangler 4.148.0 dry-run. Prisma 5.20.0 is not imported by the Worker. CI installs the Worker-only dependency, runs the Worker TypeScript check, packages it with Wrangler dry-run, and executes the RPC handler against disposable PostgreSQL.

The dry-run has no Hyperdrive binding because the staging Hyperdrive ID is not yet verified. This intentionally validates packaging only; it is not deployment-ready. The Worker returns a fail-closed DB_BINDING_MISSING response without HYPERDRIVE.

## Scope

No authentication migration, native rendering, write RPC, generation path, external resource, schema migration, or live database access is included.
