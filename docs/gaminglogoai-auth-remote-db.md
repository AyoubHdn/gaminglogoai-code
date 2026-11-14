# GamingLogoAI remote authentication slice

This slice adds typed NextAuth adapter operations to the private DB Worker.
The normal Vercel path still constructs `PrismaAdapter(prisma)` and remains the
default. `createRemoteNextAuthAdapter` is Worker-safe and uses only the DB
service binding; it does not import Prisma at runtime.

The DB Worker owns the parameterized queries for users, Google accounts,
database sessions, and verification tokens. User creation supplies the schema
defaults (one gaming credit, `None`, and `hasPurchasedCredits=false`) and user
updates intentionally whitelist only NextAuth profile fields. Account linking
uses an insert-if-absent operation followed by an ownership check, and
verification-token consumption is a single `DELETE ... RETURNING` operation.

The application request-entrypoint seam now constructs NextAuth with
`createRemoteNextAuthAdapter` when the trusted server-only
`DB_AUTH_BACKEND=service` setting is active. It obtains `DB_SERVICE` from the
request-scoped OpenNext Cloudflare context and fails closed when the binding is
absent; Vercel continues to use the Prisma adapter. The NextAuth API route,
tRPC context, SSR session helper, and CPA API handlers use the same resolver.
The root OpenNext/Wrangler deployment configuration is not part of this slice,
so the packaged/deployed Cloudflare route and live Google sign-in/session
behavior remain unverified. No live OAuth validation is claimed here.

Integration tests require only the disposable CI/local variable
`GAMING_DB_SERVICE_TEST_DATABASE_URL` and reject non-local or non-
`gaminglogoai_ci` targets. They do not load production environment files.

The adapter integration suite covers profile credit-field injection, legacy CUID
lookups, concurrent account-link ownership, session ownership and revocation,
account unlinking, and user deletion with dependent account/session cleanup.
Fixtures are removed by their unique synthetic email namespace because new
remote users receive opaque UUID IDs. These remain Node/PostgreSQL boundary
tests, not a live OAuth callback or Cloudflare NextAuth entrypoint test.

Redirect callbacks require an exact URL origin match; a hostname that merely
starts with the configured base URL cannot be used as an external destination.
