import fetch from "node-fetch";
import Replicate from "replicate";
import AWS from "aws-sdk";

import { env } from "~/env.mjs";
import { b64Image } from "~/data/b64Image";
import { finalizeGeneratedImage } from "~/server/imageWatermark";
import { createFunctionGenerationExecutor } from "./executor.ts";
import type {
  GenerationExecutor,
  GenerationIcon,
  LogoRequest,
} from "./contract.ts";

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
  region: env.NEXT_PUBLIC_AWS_REGION_GAMING,
});
const bucketName = env.NEXT_PUBLIC_S3_BUCKET_NAME_GAMING;
const replicate = new Replicate({ auth: env.REPLICATE_API_TOKEN });

async function fetchAndEncodeImage(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch generated image");
  return (await response.buffer()).toString("base64");
}

export async function generateNodeImages(input: LogoRequest): Promise<string[]> {
  let path: `${string}/${string}`;
  let modelInput: Record<string, unknown>;
  if (input.model === "flux-schnell") {
    path = "black-forest-labs/flux-schnell";
    modelInput = {
      prompt: input.prompt,
      go_fast: false,
      megapixels: "1",
      num_outputs: input.numberOfImages,
      aspect_ratio: input.aspectRatio,
      output_format: "png",
      output_quality: 80,
      num_inference_steps: 4,
      disable_safety_checker: true,
    };
  } else {
    path = "black-forest-labs/flux-dev";
    modelInput = {
      prompt: input.prompt,
      go_fast: false,
      megapixels: "1",
      num_outputs: input.numberOfImages,
      aspect_ratio: input.aspectRatio,
      output_format: "png",
      output_quality: 80,
      num_inference_steps: 28,
      disable_safety_checker: true,
    };
  }
  if (env.MOCK_REPLICATE === "true")
    return Array(input.numberOfImages).fill(b64Image) as string[];
  const output = (await replicate.run(path, { input: modelInput })) as unknown;
  if (!Array.isArray(output) || output.some((url) => typeof url !== "string"))
    throw new Error("Failed to generate image URLs");
  return Promise.all(output.map((url) => fetchAndEncodeImage(url)));
}

export async function uploadNodeImage(
  icon: GenerationIcon,
  base64: string,
  shouldWatermark: boolean,
): Promise<void> {
  const image = await finalizeGeneratedImage(Buffer.from(base64, "base64"), {
    shouldWatermark,
    toolType: "Gaming logo",
  });
  await s3
    .putObject({
      Bucket: bucketName,
      Body: image,
      Key: icon.id,
      ContentType: "image/png",
    })
    .promise();
}

export type NodeGenerationExecutorDependencies = {
  generate?: (input: LogoRequest) => Promise<string[]>;
  upload?: (
    icon: GenerationIcon,
    base64: string,
    shouldWatermark: boolean,
  ) => Promise<void>;
};

export function createNodeGenerationExecutor(
  overrides: NodeGenerationExecutorDependencies = {},
): GenerationExecutor {
  const generate = overrides.generate ?? generateNodeImages;
  const upload = overrides.upload ?? uploadNodeImage;
  return createFunctionGenerationExecutor(generate, upload);
}


