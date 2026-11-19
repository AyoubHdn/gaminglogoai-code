# Private Cloudflare generation gateway (inert template)

This Worker is the proposed termination point for the root Worker's
`GENERATION_EXECUTOR` Service Binding. Cloudflare Service Bindings call another
Worker, not an AWS Lambda function. The gateway therefore verifies the
root-to-gateway HMAC and then invokes an AWS Lambda Function URL authenticated
with SigV4/AWS_IAM.

The template has no routes, custom domains, workers.dev URL, or credentials.
Its function URL, AWS region, scope, HMAC, and restricted invoker credentials
must be supplied only through reviewed deployment configuration later.

The gateway does not perform provider or storage work and does not contain
application secrets. It forwards only the validated execution request body and
the internal authentication headers.
