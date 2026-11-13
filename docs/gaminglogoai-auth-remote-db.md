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

The Cloudflare request-entrypoint wiring remains unfinished: the root Worker
does not yet construct NextAuth with `createRemoteNextAuthAdapter` or route
NextAuth callbacks to the DB Worker. This commit therefore does not claim live
Google sign-in or session validation in Cloudflare. A later entrypoint change
must inject the binding and the remote profile reader into
`createGamingAuthOptions`; no Vercel behavior should be changed as part of that
step.

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
