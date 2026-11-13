# GamingLogoAI private DB Worker prototype

This prototype exposes only the five read operations needed by the first migration slice through a private Service Binding RPC. It does not expose workers.dev or preview URLs, and it has no public routes or custom domains.

The Vercel application continues to use Prisma by default. The remote adapter is selected explicitly with createGamingDbService({ backend: "service", ... }); it throws before any request if the binding is absent.

The Worker uses postgres@3.4.7 with nodejs_compat and Hyperdrive's connectionString. The CI job installs this Worker-only dependency, runs the Worker TypeScript check, packages it with Wrangler dry-run, and executes the RPC handler against disposable PostgreSQL.

The staging resource IDs for this private candidate are:
- Worker name: gaminglogoai-db-staging
- Hyperdrive binding name: HYPERDRIVE
- Hyperdrive ID: 207b5736cff94597b679eafb1478be35
- Hyperdrive target: `gaminglogoai-staging-db` at `db.wvwjeqynnnplmcaljfqk.supabase.co:5432/postgres`
- Hyperdrive caching: disabled

The configuration keeps `workers_dev` and `preview_urls` disabled and declares no routes or custom domains. The staging Hyperdrive was verified read-only before this configuration was prepared. This commit does not deploy the Worker.

Before any deployment, re-verify the binding with provider read-only inspection. No production Supabase project or live database is used by this prototype.
