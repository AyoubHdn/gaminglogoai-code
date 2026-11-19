# GamingLogoAI generation executor review

## Proposed topology

The root Worker cannot bind directly to AWS Lambda: Cloudflare Service
Bindings are Worker-to-Worker bindings and are intentionally private. The
proposed staging topology is:

```text
root Worker
  └─ GENERATION_EXECUTOR Service Binding
       └─ private Cloudflare gateway Worker
            └─ AWS_IAM SigV4 request to Lambda Function URL
                 └─ Node.js 22 Lambda
                      ├─ DynamoDB execution idempotency table
                      └─ S3 output bucket
```

The gateway has no public route, custom domain, or workers.dev URL. It checks
the root HMAC and forwards the exact body. AWS_IAM is required on the Function
URL; `NONE` is prohibited. The Lambda receives the same HMAC headers for
defense in depth. The gateway's invoker identity is restricted to
`lambda:InvokeFunctionUrl` and `lambda:InvokeFunction` on the one function.
The Lambda execution role, not the gateway, owns S3/DynamoDB permissions.

This matches Cloudflare's Service Binding model and AWS's Function URL
authentication requirements. See [Cloudflare Service Bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/),
[AWS Lambda Function URL auth](https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html),
and [AWS Lambda URL invocation](https://docs.aws.amazon.com/lambda/latest/dg/urls-invocation.html).

## Pins and packaging

- Node.js: 22.x / AWS Lambda `nodejs22.x`.
- Lambda architecture proposal: `x86_64`.
- Lambda timeout proposal: 300 seconds, pending measured provider behavior.
- Lambda memory proposal: 2048 MB, pending Sharp/provider measurements.
- Sharp: `0.34.5`; it must be installed for Linux x64/AL2023, not copied from
  Windows. AWS documents that native packages such as Sharp must match the
  Lambda OS and architecture.
- Replicate: `1.4.0`.
- AWS SDK S3: `3.946.0`.
- AWS SDK DynamoDB: `3.1169.0`.
- esbuild: `0.25.4`.

The package uses `scripts/build-generation-executor.mjs` and keeps the full
application environment module out of the Lambda. The only shared application
module is the pure generation contract/watermark finalizer; no Google,
Stripe, Mautic, Prisma, or NextAuth configuration is loaded.

The emitted local build is fixture-only because Sharp remains external until a
Linux x64 dependency package is produced. No output from this review is
deployable.

## Durable idempotency and uncertainty

The DynamoDB table key is `executionKey`, composed from trusted scope, user ID,
and request ID. A conditional put wins exactly one owner token. Existing
`completed` records replay output IDs; `running` and `ambiguous` records stop
another paid execution; mismatched fingerprint/model/identity is a conflict.
Completion/failure updates require the owner token and `running` state.

Provider exceptions, network timeouts, and S3 errors are ambiguous by default.
They do not trigger a refund, retry, or object deletion. Only an explicitly
classified pre-dispatch/definitive failure can be returned as definitive. A
process restart cannot use an in-memory map to claim a running request.

## Proposed staging resources (unresolved IDs)

- Cloudflare Worker: `gaminglogoai-generation-gateway-staging` (private only).
- Root binding: `GENERATION_EXECUTOR` → the gateway Worker.
- AWS Lambda: `gaminglogoai-generation-staging`, `nodejs22.x`, x86_64.
- Lambda Function URL: private `AWS_IAM`, alias-qualified; URL unresolved.
- DynamoDB: `gaminglogoai-generation-executions-staging`, on-demand, TTL on
  `expiresAt`; table ARN unresolved.
- S3 bucket: existing staging bucket identity unresolved; no new bucket is
  proposed here.
- IAM role, invoker principal, and function ARN: unresolved until a separate
  approval and read-only inventory.

## Creation order and rollback

1. Read-only verify account, current root/DB versions, bucket, and any existing
   Lambda names; stop on conflicts.
2. Create DynamoDB table and wait for active status.
3. Create the Lambda role/policy and wait for IAM propagation.
4. Build the Linux x64 package and verify hashes/provenance.
5. Create Lambda, alias it, configure AWS_IAM Function URL, and verify the
   policy is not public.
6. Create the restricted gateway Worker with no public exposure.
7. Add the root Service Binding only in a diagnostic candidate; keep client
   and server generation flags disabled until separately approved.
8. Run synthetic tests using a fixture namespace; never use live users.

Rollback is the reverse only after read-only reconciliation: remove the root
binding/candidate, disable the gateway, remove the Function URL policy, then
delete only newly-created Lambda/table/role resources after retention review.
Do not delete S3 outputs or touch the database ledger automatically.

## Evidence boundary

The compiled Worker fixture and current Node Sharp regression remain local/CI
evidence. The new package tests cover HMAC, durable-store semantics through a
memory implementation, identity conflicts, and credential-free templates.
Cloud AWS IAM, DynamoDB concurrency, Lambda packaging on AL2023, Replicate,
and S3 behavior remain unverified until a separately approved isolated staging
environment exists.
