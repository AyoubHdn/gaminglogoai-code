import { validateGenerationOutputPrefix } from "../../../src/server/generation/storageKey.ts";

export type ExecutorConfig = {
  replicateApiToken: string;
  hmacSecret: string;
  executionScope: string;
  executionTable: string;
  awsRegion: string;
  bucketName: string;
  outputPrefix: string;
};

function required(env: NodeJS.ProcessEnv, name: string): string {
  const value = env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

export function loadExecutorConfig(
  env: NodeJS.ProcessEnv = process.env,
): ExecutorConfig {
  return {
    replicateApiToken: required(env, "REPLICATE_API_TOKEN"),
    hmacSecret: required(env, "GENERATION_EXECUTOR_HMAC_SECRET"),
    executionScope: required(env, "GENERATION_EXECUTION_SCOPE"),
    executionTable: required(env, "GENERATION_EXECUTION_TABLE"),
    awsRegion: required(env, "NEXT_PUBLIC_AWS_REGION_GAMING"),
    bucketName: required(env, "NEXT_PUBLIC_S3_BUCKET_NAME_GAMING"),
    outputPrefix: validateGenerationOutputPrefix(required(env, "GENERATION_OUTPUT_PREFIX")),
  };
}
