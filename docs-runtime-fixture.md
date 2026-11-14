# Staging fixture artifact and local Workers-runtime check

The auth-entrypoint branch CI retains its OpenNext build for 14 days after a
successful build and root Wrangler dry-run. The artifact is deliberately
`fixtureOnly=true` and `deployable=false`: its client Stripe key, S3 bucket,
provider credentials and other inputs are CI dummy values. It is not a
production build or a configured staging deployment.

The archive root contains `worker.js`, `assets/`, `server-functions/` and the
rest of the OpenNext output, including required hidden `.next` files. It also
contains:

- `build-provenance.json`: exact source/workflow SHA, CI run/attempt, versions,
  input purpose, config/lockfile hashes, Worker hash and manifest digest.
- `content-manifest.json`: sorted file paths, sizes and SHA-256 hashes for all
  generated build files. These three metadata files are excluded from that
  content manifest to avoid circular hashes.
- `runtime-smoke-report.json`: runtime checks, statuses, actual binary/date,
  mocked session operations, outbound-attempt count and sanitized failures.

The upload is intentionally allowed after a runtime failure so the failing
bundle and report can be reviewed. A retained artifact is not proof that its
runtime check passed; the workflow still fails when the runtime check fails.

## Runtime test boundaries

The actual root Worker is first bundled by the locked Wrangler dry-run into
`.ci-runtime/bundle/`. The smoke harness loads that output in the `workerd`
runtime supplied by Wrangler's installed Miniflare dependency. It does not
use a Next.js Node server or deploy anything to Cloudflare.

Only explicit dummy bindings reach workerd. The local `DB_SERVICE` fixture
accepts the known synthetic session identities, session lookup/expiry deletion,
and the five read operations for the two fixture accounts. It does not connect
to PostgreSQL/Hyperdrive.
The ASSETS service reads the real generated assets from disk, with guarded
paths. A small local front Worker serves matching files first and forwards
other requests to the actual application Worker, matching the configured
asset-first boundary. This is a local platform fixture, not Cloudflare's
deployed asset router.
Global outbound network calls are blocked and cause the test to fail.

Checks cover startup, homepage, one compiled CSS asset, Google provider
discovery, anonymous session, synthetic authenticated session, expired-session
revocation, authenticated tRPC reads with account isolation and Date metadata,
anonymous protection, public community reads, remote-service failure handling,
an unmigrated-route guard, and the Stripe GET method guard. These do not initiate OAuth,
generate images, make payments, call Mautic, or create real accounts.

The deployed-style config retains its private settings: workers.dev and preview
URLs disabled, no custom routes/domains, DB_SERVICE naming the staging Worker.
The intended bootstrap URL includes the account subdomain `hdnstudio`; no
hostname is enabled or provisioned by this workflow.

Wrangler 4.148's bundled workerd may predate the configured compatibility date.
The harness uses the earlier of the configuration date and its installed
binary's release date and records both. A local pass therefore does not prove
behavior at a newer deployment compatibility date.

The existing unsupported-Next-version build override remains explicitly
recorded in provenance. Real Google login, production-input equality,
Cloudflare deployment behavior, and unmigrated tRPC writes/generation/CPA routes
remain unverified by this fixture. Those routes need their own migration and
runtime validation before live routing changes.
