import type { GenerationExecutionRequest } from "../../../src/server/generation/contract.ts";
import { loadExecutorConfig, type ExecutorConfig } from "./config.ts";
import { verifyExecutorBody } from "./hmac.ts";
import { createNodeExecutorPipeline, runPipeline, type ExecutorPipeline } from "./pipeline.ts";
import {
  DynamoExecutionStore,
  type ExecutionStore,
} from "./store.ts";
import { validateExecutionRequest } from "./validation.ts";

export type LambdaEvent = {
  body?: string | null;
  isBase64Encoded?: boolean;
  headers?: Record<string, string | undefined>;
};
export type LambdaResponse = {
  statusCode: number;
  headers: { "content-type": string };
  body: string;
};
export type HandlerDependencies = {
  config: ExecutorConfig;
  store: ExecutionStore;
  pipeline: ExecutorPipeline;
  now?: () => number;
};

function response(statusCode: number, data: unknown): LambdaResponse {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  };
}

function bodyOf(event: LambdaEvent): string {
  if (typeof event.body !== "string") throw new Error("REQUEST_BODY_REQUIRED");
  if (!event.isBase64Encoded) return event.body;
  return Buffer.from(event.body, "base64").toString("utf8");
}

export function createGenerationExecutorHandler(dependencies: HandlerDependencies) {
  return async function generationExecutorHandler(event: LambdaEvent): Promise<LambdaResponse> {
    let body: string;
    try {
      body = bodyOf(event);
    } catch {
      return response(400, { ok: false, error: "REQUEST_BODY_REQUIRED" });
    }
    const headers = Object.fromEntries(
      Object.entries(event.headers ?? {}).map(([key, value]) => [key.toLowerCase(), value]),
    );
    const timestamp = headers["x-generation-executor-timestamp"];
    const signature = headers["x-generation-executor-signature"];
    if (
      !timestamp ||
      !signature ||
      !verifyExecutorBody(
        dependencies.config.hmacSecret,
        timestamp,
        body,
        signature,
        dependencies.now?.() ?? Date.now(),
      )
    )
      return response(401, { ok: false, error: "EXECUTOR_AUTH_FAILED" });

    let input: GenerationExecutionRequest;
    try {
      input = JSON.parse(body) as GenerationExecutionRequest;
      await validateExecutionRequest(input, dependencies.config);
    } catch (error) {
      return response(400, {
        ok: false,
        error: error instanceof Error ? error.message : "EXECUTION_REQUEST_INVALID",
      });
    }

    let started;
    try {
      started = await dependencies.store.begin(input);
    } catch {
      return response(503, { ok: false, error: "EXECUTION_STATE_UNAVAILABLE" });
    }
    if (started.kind === "completed")
      return response(200, { ok: true, data: { status: "completed", outputIds: started.outputIds } });
    if (started.kind === "failed")
      return response(200, {
        ok: true,
        data: { status: "failed", certainty: "definitive", reason: started.reason },
      });
    if (started.kind === "ambiguous")
      return response(200, {
        ok: true,
        data: { status: "failed", certainty: "ambiguous", reason: "unavailable" },
      });

    try {
      const outputIds = await runPipeline(input, dependencies.pipeline);
      await dependencies.store.complete(input, started.ownerToken);
      return response(200, { ok: true, data: { status: "completed", outputIds } });
    } catch {
      const failure = {
        status: "failed" as const,
        certainty: "ambiguous" as const,
        reason: "unavailable" as const,
      };
      try {
        await dependencies.store.fail(input, started.ownerToken, failure);
      } catch {
        return response(503, { ok: false, error: "EXECUTION_STATE_UNAVAILABLE" });
      }
      return response(200, { ok: true, data: failure });
    }
  };
}

let liveHandler:
  | ReturnType<typeof createGenerationExecutorHandler>
  | undefined;

export async function handler(event: LambdaEvent): Promise<LambdaResponse> {
  liveHandler ??= (() => {
    const config = loadExecutorConfig();
    return createGenerationExecutorHandler({
      config,
      store: new DynamoExecutionStore(config),
      pipeline: createNodeExecutorPipeline(config),
    });
  })();
  return liveHandler(event);
}
