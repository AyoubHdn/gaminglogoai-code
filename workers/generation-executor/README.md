# GamingLogoAI Node generation executor review package

This directory is a non-live integration package. It contains a Node.js 22
Lambda handler and a private Cloudflare gateway design for the
`GENERATION_EXECUTOR` Service Binding. It does not provision resources, contain
credentials, or expose a public endpoint.

The binding cannot target AWS Lambda directly. The proposed path is:

`gaminglogoai-cloudflare-*` → private Service Binding →
`gaminglogoai-generation-gateway-*` → AWS_IAM-signed Lambda Function URL →
`gaminglogoai-generation-*`.

The root-to-gateway request is authenticated with an HMAC secret. The gateway
to Lambda request uses AWS Signature Version 4 and a dedicated restricted
invoker identity. The Lambda uses its execution role for S3 and DynamoDB.

## Runtime contract

The Lambda accepts the existing `GenerationExecutionRequest` plus a required
`fingerprint`. It validates the trusted execution scope, request identity,
fingerprint, model, watermark decision, output count, and deterministic output
IDs before provider or storage work.

`GamingLogoExecutionStore` is the durable idempotency boundary. The proposed
production implementation is DynamoDB with a conditional put keyed by
`executionKey = <scope>:<userId>:<requestId>`. `running`, `completed`,
`failed`, and `ambiguous` are persisted. A duplicate completed request returns
the stored output IDs; a running or ambiguous request is not retried. A process
restart therefore cannot create a second provider execution from an in-memory
map. An unresolved provider timeout or S3 response remains ambiguous and is
reconciled separately; it is never automatically refunded or retried.

## Required names only

Lambda: `REPLICATE_API_TOKEN`, `GENERATION_EXECUTOR_HMAC_SECRET`,
`GENERATION_EXECUTION_SCOPE`, `GENERATION_EXECUTION_TABLE`,
`NEXT_PUBLIC_AWS_REGION_GAMING`, `NEXT_PUBLIC_S3_BUCKET_NAME_GAMING`.
The staging deployment also sets the server-controlled
`GENERATION_OUTPUT_PREFIX` to `generation-staging/`. An empty value preserves
the legacy Vercel layout; request payloads never select this prefix.

Gateway: `GENERATION_EXECUTOR_HMAC_SECRET`, `GENERATION_EXECUTION_SCOPE`,
`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, optional `AWS_SESSION_TOKEN`,
`AWS_REGION`, and `GENERATION_LAMBDA_FUNCTION_URL`.

No Google, Stripe, Mautic, Prisma, NextAuth, or application-wide env module is
required by the executor package.

## Local validation

Use the repository's pinned root lockfile and Node 22. The package tests use a
memory store, mocked provider/storage, and the real Sharp finalizer. They do
not contact AWS, Replicate, S3, DynamoDB, Cloudflare, or a database. The
Linux packaging command emits a fixture-only bundle manifest and provenance;
it is not a deployable artifact until resource IDs, secrets, and IAM policies
are separately reviewed and approved.
