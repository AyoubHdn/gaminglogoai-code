# GamingLogoAI Stripe safety preparation

Base application: 3c7198f02cd3cb49b873dd75e54d570d4ec704b4.
This branch is not a production deployment or a completed Cloudflare migration.

- Verify the exact raw body with awaited Stripe Web Crypto verification.
- Only paid payment-mode checkout completions are eligible.
- The configured price ID and quantity authorize the 20/50/100-credit pack.
  Metadata credits/plan no longer authorize fulfillment. A different explicit project tag is ignored.
- The metadata user ID selects the website account, independent of checkout email.
- GamingStripePurchase has unique event and checkout-session keys.
  It commits in the same transaction as an atomic balance increment, plan update,
  and hasPurchasedCredits=true. Conflicting reuse fails closed.
- Mautic runs after the commit, is awaited and emits a fixed diagnostic on failure.
  It remains best effort; there is no durable Mautic outbox in this phase.
  Duplicate deliveries do not repeat synchronization.
- The additive receipt migration has no backfill and has not been applied to live data.
  Before any activation, reconcile historical fulfilled sessions and pending events:
  a new empty receipt table cannot deduplicate purchases fulfilled by the old handler.
  Do not replay historical live events to test this implementation.
- The CI suite applies only this migration on the base schema in a disposable
  localhost PostgreSQL database. It cannot use production credentials.
- CI covers the Stripe modules/tests, not the full Next application or a Worker build.
  Full application typecheck/build and runtime validation remain required before rollout.
- Keep /api/stripe as the registered endpoint. No /api/stripe/webhook alias is introduced.
- Vercel ownership/deployed SHA, production environment pairing and Android dependencies
  remain unverified until authenticated read-only inventory is available.
- No deployment, provider calls, DNS changes, production DDL/DML, or NameDesignAI changes
  are included in this work.
