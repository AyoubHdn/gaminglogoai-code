# Logo generation database boundary

This is the first generation write slice. It covers `generate.generateIcon` (Flux Schnell/Dev logos), its two web callers, and the private DB RPC implementation. It is not a full generation or production migration.

## Activation and current defaults

`DB_GENERATION_BACKEND` is trusted server configuration:

| Value | Behavior |
| --- | --- |
| absent / `legacy` | Existing Vercel Prisma/credit helper behavior, unchanged |
| `prisma` | New transaction/ledger behavior through Prisma interactive transactions |
| `service` | New behavior through the request-scoped `DB_SERVICE` binding; no Prisma fallback |

The additive migration `20261115120000_add_gaming_generation_request` must be applied before opting in. CI applies all 25 migrations only to disposable localhost PostgreSQL. No migration/deployment is run against a live database by this workflow.

Do not enable this selector or open generation on the deployed auth-only staging app yet. Its route allowlist, `CLOUDFLARE_READ_ONLY_MODE`, disabled external sync, secrets and deployed versions are unchanged. Native image processing and the generation compute backend still require a separate packaging/runtime plan.

## Contract and ownership

- The authenticated tRPC session supplies `userId`. Client-provided account IDs cannot select a credit balance.
- Both logo web callers generate a UUID v4 once per mutation. Network retries must retain that mutation's `requestId`; a new explicit submit is a new request. The new backend rejects a missing request ID. Legacy callers remain compatible while the selector is `legacy`.
- The DB service validates integer image count (1–10), model, prompt and aspect ratio. It computes the 1/2-credit model price itself, not from caller-supplied cost.
- `(userId, requestId)` is the ledger key. A fingerprint binds it to the prompt, model, count and aspect ratio. Reusing it for different inputs rejects without charging.
- Planned icon IDs are deterministic hashes including account, request and output index. The private service never accepts arbitrary saved-icon IDs or owners from a browser.

## Atomic operations

Each operation uses one real transaction/connection, with the user row locked first. There is no manual `BEGIN` on a shared pool.

1. Reserve: lock the user, inspect the ledger, conditionally decrement credits, insert the reserved request and planned icons. Any error rolls back the charge.
2. Run image generation, watermarking and S3 uploads outside the transaction. All uploads settle before failure handling. No saved `Icon` rows exist yet.
3. Complete: insert the entire planned icon set and mark the ledger completed in one transaction. Any insert failure rolls back every saved icon.
4. On failure, refund only a reserved request and mark it refunded atomically. Repeated refunds do nothing. A completed request can never be refunded by this operation.

Concurrent same-key reservations acquire work exactly once. Other callers see reserved/completed/refunded state. Completed replay returns the same image URLs without another provider call, charge, upload or Mautic sync. Reserved replay reports in-progress; refunded keys cannot restart generation.

Mautic synchronization is best-effort after completion and honors `AUTH_EXTERNAL_SYNC_MODE=disabled`. It cannot roll back saved icons or trigger a refund after a successful generation.

## Ambiguous results and known limits

- The adapter never automatically retries mutations. If a reservation response is lost, provider work does not start and no speculative refund occurs. The reserved charge requires explicit reconciliation.
- If completion committed but its response was lost, the guarded refund sees completed and leaves credits/icons intact. A same-key replay recovers the saved result.
- A process crash or persistent DB outage can leave a reserved request. There is no automatic recovery, lease expiration or blind refund in this slice. Inspect the ledger, provider and object state before manual reconciliation.
- S3 is outside the SQL transaction. Upload failure or SQL completion failure may leave unreferenced uploaded objects. No automatic object deletion is implemented. SQL consistency does not imply cross-provider atomicity.
- Ledger rows restrict user deletion, like purchase receipts; account deletion after activation needs an explicit retention/reconciliation policy.
- Old generation paths retain their existing behavior until explicitly ported. Face/nano-face, emote, enhancement, Twitch banner/panel/stream-screen, banner/panel/stream-screen/thumbnail funnels and refinement ownership checks remain separate work. No claim is made that their charge/refund behavior is fixed by this change.

## Validation

`src/server/__tests__/generation.test.ts` exercises backend guards, validation, orchestration order, duplicate requests, ambiguous reservations, upload failure and best-effort sync with test doubles.

`workers/db/src/generation.remote.integration.test.ts` invokes the actual Worker RPC handler against disposable PostgreSQL and compares the new Prisma and remote adapters. It covers concurrent duplicate reservations, competing balances, ownership, fingerprint conflicts, terminal races, transaction rollback, partial icon insertion, lost committed responses and single-use refunds. Provider/S3 operations in these tests are synthetic; no real generation is submitted.

These are Node/PostgreSQL integration tests. A Wrangler dry-run establishes packaging only. Actual Cloudflare transaction behavior with the isolated staging Hyperdrive remains a later guarded runtime test, after reviewing/applying only the new staging migration and deploying a separate DB candidate.
