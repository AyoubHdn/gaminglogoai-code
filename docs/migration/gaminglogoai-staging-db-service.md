# GamingLogoAI staging DB-service slice

Base application commit: `0c14e96965783863f5f2be42fcc5ff8bfe3e8eb3`.

This slice introduces a typed database-service boundary for authentication-backed
credit, saved-image, and community reads. The existing Prisma client remains the
default Vercel adapter. No Cloudflare Worker, Hyperdrive ID, Supabase production
connection, or remote RPC implementation is claimed by this change.

## Staging contract

Use a separate disposable/test PostgreSQL database only:

```text
DATABASE_URL=postgresql://<staging-user>:<staging-password>@<staging-host>:5432/<staging-database>?schema=public
NEXTAUTH_URL=https://<staging-hostname>
HOST_NAME=https://<staging-hostname>
DB_SERVICE_BACKEND=prisma
```

The placeholders above are documentation only and must not be copied into
production or committed as real credentials. The production Supabase project
`qvceidstmgnsthzrhxqx` is explicitly out of scope for staging tests.

The first concrete adapter is `createPrismaDbService`. A Cloudflare/remote
adapter requires a separately reviewed RPC contract and test database; this
slice intentionally does not add empty RPC stubs or provider resource IDs.

## Covered reads

- authenticated session enforcement remains NextAuth/tRPC protected-procedure behavior;
- `user.getCredits` and watermark status;
- `icons.getIcons` and `icons.getEmoteBases`;
- public `icons.getCommunityIcons`.

Generation, Stripe fulfillment, native Sharp/Puppeteer rendering, and direct
Prisma writes remain on their existing Vercel path.
