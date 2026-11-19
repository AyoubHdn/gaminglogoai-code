import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fetch from "node-fetch";
import Replicate from "replicate";
import { finalizeGeneratedImage } from "../../../src/server/imageWatermark.ts";
import type {
  GenerationExecutionRequest,
  GenerationIcon,
  LogoRequest,
} from "../../../src/server/generation/contract.ts";
import type { ExecutorConfig } from "./config.ts";

export type ExecutorPipeline = {
  generate(input: LogoRequest): Promise<string[]>;
  upload(
    icon: GenerationIcon,
    base64: string,
    shouldWatermark: boolean,
  ): Promise<void>;
};

async function fetchImage(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("PROVIDER_OUTPUT_DOWNLOAD_FAILED");
  return Buffer.from(await response.arrayBuffer()).toString("base64");
}

function modelInput(input: LogoRequest): Record<string, unknown> {
  return {
    prompt: input.prompt,
    go_fast: false,
    megapixels: "1",
    num_outputs: input.numberOfImages,
    aspect_ratio: input.aspectRatio,
    output_format: "png",
    output_quality: 80,
    num_inference_steps: input.model === "flux-schnell" ? 4 : 28,
    disable_safety_checker: true,
  };
}

export function createNodeExecutorPipeline(
  config: ExecutorConfig,
  overrides: Partial<ExecutorPipeline> = {},
): ExecutorPipeline {
  const replicate = new Replicate({ auth: config.replicateApiToken });
  const s3 = new S3Client({ region: config.awsRegion });
  return {
    async generate(input) {
      if (overrides.generate) return overrides.generate(input);
      const path =
        input.model === "flux-schnell"
          ? "black-forest-labs/flux-schnell"
          : "black-forest-labs/flux-dev";
      const output = (await replicate.run(path, {
        input: modelInput(input),
      })) as unknown;
      if (!Array.isArray(output) || output.some((url) => typeof url !== "string"))
        throw new Error("PROVIDER_OUTPUT_INVALID");
      return Promise.all(output.map((url) => fetchImage(url)));
    },
    async upload(icon, base64, shouldWatermark) {
      if (overrides.upload) return overrides.upload(icon, base64, shouldWatermark);
      const image = await finalizeGeneratedImage(Buffer.from(base64, "base64"), {
        shouldWatermark,
        toolType: "Gaming logo",
      });
      await s3.send(
        new PutObjectCommand({
          Bucket: config.bucketName,
          Key: icon.id,
          Body: image,
          ContentType: "image/png",
        }),
      );
    },
  };
}

export async function runPipeline(
  input: GenerationExecutionRequest,
  pipeline: ExecutorPipeline,
): Promise<string[]> {
  const images = await pipeline.generate(input);
  if (
    images.length !== input.plannedOutputIds.length ||
    images.some((image) => typeof image !== "string" || image.length === 0)
  )
    throw new Error("EXECUTION_OUTPUT_INVALID");
  const uploads = await Promise.allSettled(
    input.plannedOutputIds.map((id, index) =>
      pipeline.upload(
        { id, prompt: input.prompt, imageKey: null },
        images[index]!,
        input.shouldWatermark,
      ),
    ),
  );
  if (uploads.some((result) => result.status === "rejected"))
    throw new Error("EXECUTION_UPLOAD_UNCERTAIN");
  return [...input.plannedOutputIds];
}
