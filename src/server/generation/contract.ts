import { LOGO_MODEL_CREDITS } from "../../lib/generationPricing.ts";

export type LogoRequest = {
  userId: string;
  requestId: string;
  prompt: string;
  model: keyof typeof LOGO_MODEL_CREDITS;
  numberOfImages: number;
  aspectRatio: string;
};
export type GenerationKey = Pick<LogoRequest, "userId" | "requestId">;
export type GenerationState = "reserved" | "completed" | "refunded";
export type GenerationIcon = { id: string; prompt: string; imageKey: null };
export type GenerationReservation = {
  acquired: boolean;
  state: GenerationState;
  icons: GenerationIcon[];
  shouldWatermark: boolean;
  credits: number;
  email: string | null;
  name: string | null;
};
export type GenerationDbService = {
  reserveLogo(input: LogoRequest): Promise<GenerationReservation>;
  completeLogo(input: GenerationKey): Promise<GenerationState>;
  refundLogo(input: GenerationKey): Promise<GenerationState>;
};
export type GenerationExecutionRequest = LogoRequest & {
  executionScope: string;
  fingerprint: string;
  shouldWatermark: boolean;
  plannedOutputIds: string[];
};
export type GenerationExecutionResult =
  | { status: "completed"; outputIds: string[] }
  | {
      status: "failed";
      certainty: "definitive" | "ambiguous";
      reason: "provider" | "storage" | "invalid-result" | "unavailable";
    };
export type GenerationExecutor = {
  execute(input: GenerationExecutionRequest): Promise<GenerationExecutionResult>;
};
export type GenerationExecutionFailureReason =
  | "provider"
  | "storage"
  | "invalid-result"
  | "unavailable";
export class GenerationExecutionFailure extends Error {
  readonly certainty: "definitive" | "ambiguous";
  readonly reason: GenerationExecutionFailureReason;

  constructor(
    certainty: "definitive" | "ambiguous",
    reason: GenerationExecutionFailureReason,
    message = reason,
  ) {
    super(message);
    this.certainty = certainty;
    this.reason = reason;
  }
}
export const generationErrorCodes = [
  "GENERATION_BAD_INPUT",
  "GENERATION_USER_NOT_FOUND",
  "GENERATION_NOT_FOUND",
  "GENERATION_INSUFFICIENT_CREDITS",
  "GENERATION_REQUEST_CONFLICT",
  "GENERATION_IN_PROGRESS",
  "GENERATION_ALREADY_REFUNDED",
  "GENERATION_EXECUTION_FAILED",
  "GENERATION_EXECUTION_AMBIGUOUS",
] as const;
export type GenerationErrorCode = (typeof generationErrorCodes)[number];
export class GenerationError extends Error {
  readonly code: GenerationErrorCode;
  constructor(code: GenerationErrorCode, message: string = code) {
    super(message);
    this.code = code;
  }
}
export function isGenerationErrorCode(
  value: unknown,
): value is GenerationErrorCode {
  return generationErrorCodes.some((code) => code === value);
}
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function parseGenerationKey(value: unknown): GenerationKey {
  if (
    !isRecord(value) ||
    typeof value.userId !== "string" ||
    !value.userId ||
    value.userId.length > 200 ||
    typeof value.requestId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value.requestId,
    )
  ) {
    throw new GenerationError("GENERATION_BAD_INPUT");
  }
  return { userId: value.userId, requestId: value.requestId.toLowerCase() };
}
export function parseLogoRequest(value: unknown): LogoRequest {
  const key = parseGenerationKey(value);
  if (
    !isRecord(value) ||
    typeof value.prompt !== "string" ||
    value.prompt.trim().length === 0 ||
    value.prompt.length > 4000 ||
    (value.model !== "flux-schnell" && value.model !== "flux-dev") ||
    typeof value.numberOfImages !== "number" ||
    !Number.isInteger(value.numberOfImages) ||
    value.numberOfImages < 1 ||
    value.numberOfImages > 10 ||
    typeof value.aspectRatio !== "string" ||
    ![
      "1:1",
      "16:9",
      "9:16",
      "4:3",
      "3:4",
      "3:2",
      "2:3",
      "5:4",
      "4:5",
      "21:9",
      "9:21",
    ].includes(value.aspectRatio)
  ) {
    throw new GenerationError("GENERATION_BAD_INPUT");
  }
  return {
    ...key,
    prompt: value.prompt,
    model: value.model,
    numberOfImages: value.numberOfImages,
    aspectRatio: value.aspectRatio,
  };
}
export async function digest(value: string): Promise<string> {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(bytes), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
export async function prepareLogoRequest(value: unknown) {
  const input = parseLogoRequest(value);
  const fingerprint = await digest(
    JSON.stringify([
      "logo-v1",
      input.prompt,
      input.model,
      input.numberOfImages,
      input.aspectRatio,
    ]),
  );
  const icons = await Promise.all(
    Array.from({ length: input.numberOfImages }, async (_, index) => ({
      id: await digest(
        JSON.stringify(["logo-v1", input.userId, input.requestId, index]),
      ),
      prompt: input.prompt,
      imageKey: null,
    })),
  );
  return {
    input,
    fingerprint,
    icons,
    cost: LOGO_MODEL_CREDITS[input.model] * input.numberOfImages,
  };
}
export function parseState(value: unknown): GenerationState {
  if (value !== "reserved" && value !== "completed" && value !== "refunded")
    throw new Error("Invalid generation state");
  return value;
}
export function parseIcons(value: unknown): GenerationIcon[] {
  if (!Array.isArray(value) || value.length < 1 || value.length > 10)
    throw new Error("Invalid generation icons");
  return value.map((icon: unknown) => {
    if (
      !isRecord(icon) ||
      typeof icon.id !== "string" ||
      !/^[a-f0-9]{64}$/.test(icon.id) ||
      typeof icon.prompt !== "string" ||
      icon.imageKey !== null
    )
      throw new Error("Invalid generation icon");
    return { id: icon.id, prompt: icon.prompt, imageKey: null };
  });
}
export function parseReservation(value: unknown): GenerationReservation {
  if (
    !isRecord(value) ||
    typeof value.acquired !== "boolean" ||
    typeof value.shouldWatermark !== "boolean" ||
    typeof value.credits !== "number" ||
    !Number.isInteger(value.credits) ||
    value.credits < 0 ||
    (value.email !== null && typeof value.email !== "string") ||
    (value.name !== null && typeof value.name !== "string")
  )
    throw new Error("Invalid generation reservation");
  return {
    acquired: value.acquired,
    state: parseState(value.state),
    icons: parseIcons(value.icons),
    shouldWatermark: value.shouldWatermark,
    credits: value.credits,
    email: value.email,
    name: value.name,
  };
}

