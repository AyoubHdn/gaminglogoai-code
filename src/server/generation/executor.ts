import {
  GenerationError,
  GenerationExecutionFailure,
  isRecord,
  type GenerationExecutionRequest,
  type GenerationExecutionResult,
  type GenerationExecutor,
  type GenerationIcon,
  type LogoRequest,
} from "./contract.ts";

export type GenerationExecutorBinding = {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
};

async function signExecutorRequest(
  secret: string,
  timestamp: string,
  body: string,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${body}`),
  );
  return Array.from(new Uint8Array(signature), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export function createFunctionGenerationExecutor(
  generate: (input: LogoRequest) => Promise<string[]>,
  upload: (
    icon: GenerationIcon,
    base64: string,
    shouldWatermark: boolean,
  ) => Promise<void>,
): GenerationExecutor {
  return {
    async execute(input) {
      let images: string[];
      try {
        images = await generate(input);
      } catch (error) {
        const failure =
          error instanceof GenerationExecutionFailure
            ? error
            : new GenerationExecutionFailure("ambiguous", "provider");
        return {
          status: "failed",
          certainty: failure.certainty,
          reason: failure.reason,
        };
      }
      if (
        images.length !== input.plannedOutputIds.length ||
        images.some((image) => typeof image !== "string" || image.length === 0)
      )
        return {
          status: "failed",
          certainty: "definitive",
          reason: "invalid-result",
        };
      try {
        const uploads = await Promise.allSettled(
          input.plannedOutputIds.map((id, index) =>
            upload(
              { id, prompt: input.prompt, imageKey: null },
              images[index]!,
              input.shouldWatermark,
            ),
          ),
        );
        const failures = uploads.filter(
          (upload): upload is PromiseRejectedResult => upload.status === "rejected",
        );
        if (failures.length > 0) {
          const definitive = failures.every(
            ({ reason }) =>
              reason instanceof GenerationExecutionFailure &&
              reason.certainty === "definitive",
          );
          return {
            status: "failed",
            certainty: definitive ? "definitive" : "ambiguous",
            reason: "storage",
          };
        }
      } catch {
        return {
          status: "failed",
          certainty: "ambiguous",
          reason: "storage",
        };
      }
      return { status: "completed", outputIds: input.plannedOutputIds };
    },
  };
}

function parseResult(value: unknown): GenerationExecutionResult {
  if (!isRecord(value) || value.status === undefined)
    throw new GenerationError("GENERATION_EXECUTION_AMBIGUOUS");

  if (value.status === "failed") {
    if (
      (value.certainty !== "definitive" && value.certainty !== "ambiguous") ||
      (value.reason !== "provider" &&
        value.reason !== "storage" &&
        value.reason !== "invalid-result" &&
        value.reason !== "unavailable")
    )
      throw new GenerationError("GENERATION_EXECUTION_AMBIGUOUS");
    return {
      status: "failed",
      certainty: value.certainty,
      reason: value.reason,
    };
  }

  if (
    value.status !== "completed" ||
    !Array.isArray(value.outputIds) ||
    value.outputIds.some((id) => typeof id !== "string")
  )
    throw new GenerationError("GENERATION_EXECUTION_AMBIGUOUS");

  return {
    status: "completed",
    outputIds: value.outputIds,
  };
}

export function createRemoteGenerationExecutor(
  binding: GenerationExecutorBinding | undefined,
  hmacSecret = "",
): GenerationExecutor {
  if (!binding || typeof binding.fetch !== "function")
    throw new Error("GENERATION_EXECUTOR binding is required for service generation");
  if (!hmacSecret)
    throw new Error("GENERATION_EXECUTOR_HMAC_SECRET is required for service generation");

  return {
    async execute(input: GenerationExecutionRequest) {
      const body = JSON.stringify(input);
      const timestamp = String(Date.now());
      let response: Response;
      try {
        response = await binding.fetch("https://generation-executor.internal/execute", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-generation-executor-timestamp": timestamp,
            "x-generation-executor-signature": await signExecutorRequest(
              hmacSecret,
              timestamp,
              body,
            ),
          },
          body,
        });
      } catch {
        return {
          status: "failed",
          certainty: "ambiguous",
          reason: "unavailable",
        };
      }

      let body: unknown;
      try {
        body = await response.json();
      } catch {
        return {
          status: "failed",
          certainty: "ambiguous",
          reason: "invalid-result",
        };
      }
      if (!response.ok || !isRecord(body) || body.ok !== true)
        return {
          status: "failed",
          certainty: "ambiguous",
          reason: "unavailable",
        };
      try {
        return parseResult(body.data);
      } catch {
        return {
          status: "failed",
          certainty: "ambiguous",
          reason: "invalid-result",
        };
      }
    },
  };
}


