/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TRPCError } from "@trpc/server";
import AWS from "aws-sdk";
import fetch from "node-fetch";
import Replicate from "replicate";
import sharp from "sharp";
import { Readable } from "stream";
import type { ReadableStream as WebReadableStream } from "stream/web";
import { z } from "zod";

import { b64Image } from "~/data/b64Image";
import {
  STREAM_SCREEN_PLATFORMS,
  type StreamScreenCanvas,
  type StreamScreenKind,
} from "~/data/streamScreenPlatforms";
import { STREAM_SCREEN_TEMPLATES } from "~/data/streamScreenTemplates";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { buildStreamScreenPrompt } from "~/server/lib/buildStreamScreenPrompt";
import { withCreditTransaction } from "~/server/lib/creditTransaction";

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
  region: env.NEXT_PUBLIC_AWS_REGION_GAMING,
});

const BUCKET = env.NEXT_PUBLIC_S3_BUCKET_NAME_GAMING;

if (!BUCKET) {
  throw new Error("Missing S3 bucket");
}

const replicate = new Replicate({
  auth: env.REPLICATE_API_TOKEN,
});

const STREAM_SCREEN_FUNNEL_RATE_LIMIT_MS = 3000;
const lastGenerateCallByUserId = new Map<string, number>();

function assertWithinStreamScreenRateLimit(
  userId: string,
  store: Map<string, number>
): void {
  const now = Date.now();
  const lastCallAt = store.get(userId);

  if (lastCallAt && now - lastCallAt < STREAM_SCREEN_FUNNEL_RATE_LIMIT_MS) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Please wait a moment before generating another stream screen set.",
    });
  }

  store.set(userId, now);
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    stream.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });

    stream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    stream.on("error", reject);
  });
}

function isNodeReadableStream(value: unknown): value is Readable {
  return value instanceof Readable;
}

function isWebReadableStream(
  value: unknown
): value is WebReadableStream<Uint8Array> {
  return (
    typeof value === "object" &&
    value !== null &&
    "getReader" in value &&
    typeof value.getReader === "function"
  );
}

async function fetchBufferFromUrl(url: string): Promise<Buffer> {
  const imageResponse = await fetch(url);

  if (!imageResponse.ok) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch generated stream screen image",
    });
  }

  return Buffer.from(await imageResponse.arrayBuffer());
}

async function resolveReplicateOutputToBuffer(output: unknown): Promise<Buffer> {
  if (Array.isArray(output)) {
    const firstItem = output[0];

    if (!firstItem) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Replicate returned an empty stream screen output",
      });
    }

    return resolveReplicateOutputToBuffer(firstItem);
  }

  if (isNodeReadableStream(output)) {
    return streamToBuffer(output);
  }

  if (isWebReadableStream(output)) {
    const reader = output.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      if (value) {
        chunks.push(value);
      }
    }

    return Buffer.concat(chunks);
  }

  if (typeof output === "string" && output.startsWith("http")) {
    return fetchBufferFromUrl(output);
  }

  if (
    typeof output === "object" &&
    output !== null &&
    "url" in output &&
    typeof output.url === "function"
  ) {
    return fetchBufferFromUrl(String(output.url()));
  }

  if (
    typeof output === "object" &&
    output !== null &&
    "url" in output &&
    typeof output.url === "string"
  ) {
    return fetchBufferFromUrl(output.url);
  }

  console.error("[streamScreenFunnel] unexpected replicate output", {
    isArray: Array.isArray(output),
    type: typeof output,
  });

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Replicate returned an unexpected stream screen output",
  });
}

async function fetchGeneratedStreamScreenBufferWithFluxFlex(
  prompt: string,
  canvas: StreamScreenCanvas,
  referenceImages: string[]
): Promise<Buffer> {
  if (env.MOCK_REPLICATE === "true") {
    return Buffer.from(b64Image, "base64");
  }

  const replicateInput: Record<string, unknown> = {
    prompt,
    aspect_ratio: "custom",
    width: canvas.width,
    height: canvas.height,
    output_format: "png",
    steps: 32,
    guidance: 4.5,
    prompt_upsampling: false,
    safety_tolerance: 2,
  };

  if (referenceImages.length > 0) {
    replicateInput.input_images = referenceImages;
  }

  const output = await replicate.run("black-forest-labs/flux-2-flex", {
    input: replicateInput,
  });

  return resolveReplicateOutputToBuffer(output);
}

function getPublicStreamScreenUrl(imageKey: string): string {
  return `https://${BUCKET}.s3.${env.NEXT_PUBLIC_AWS_REGION_GAMING}.amazonaws.com/${imageKey}`;
}

function buildReferenceOverlaySvg(width: number, height: number): Buffer {
  const titleX = Math.round(width * 0.22);
  const titleY = Math.round(height * 0.47);
  const titleWidth = Math.round(width * 0.56);
  const titleHeight = Math.round(height * 0.13);
  const subtitleX = Math.round(width * 0.28);
  const subtitleY = Math.round(height * 0.64);
  const subtitleWidth = Math.round(width * 0.44);
  const subtitleHeight = Math.round(height * 0.09);

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="${titleX}" y="${titleY}" width="${titleWidth}" height="${titleHeight}" rx="${Math.max(22, Math.round(height * 0.03))}" fill="rgba(9, 16, 34, 0.9)" />
      <rect x="${subtitleX}" y="${subtitleY}" width="${subtitleWidth}" height="${subtitleHeight}" rx="${Math.max(18, Math.round(height * 0.024))}" fill="rgba(9, 16, 34, 0.82)" />
    </svg>
  `.trim();

  return Buffer.from(svg);
}

async function buildStreamScreenStyleReferenceImage(
  sourceBuffer: Buffer,
  canvas: StreamScreenCanvas
): Promise<string> {
  const referenceBuffer = await sharp(sourceBuffer)
    .resize(canvas.width, canvas.height, {
      fit: "cover",
      position: "centre",
    })
    .composite([
      {
        input: buildReferenceOverlaySvg(canvas.width, canvas.height),
        blend: "over",
      },
    ])
    .png()
    .toBuffer();

  return `data:image/png;base64,${referenceBuffer.toString("base64")}`;
}

async function normalizeStreamScreenBufferToCanvas(
  sourceBuffer: Buffer,
  canvas: StreamScreenCanvas,
  contextLabel: string
): Promise<Buffer> {
  const normalizedBuffer = await sharp(sourceBuffer)
    .rotate()
    .resize(canvas.width, canvas.height, {
      fit: "cover",
      position: "centre",
    })
    .png()
    .toBuffer();

  const outputMetadata = await sharp(normalizedBuffer).metadata();

  if (
    outputMetadata.width !== canvas.width ||
    outputMetadata.height !== canvas.height
  ) {
    console.error("[streamScreenFunnel] normalization mismatch", {
      contextLabel,
      outputWidth: outputMetadata.width ?? null,
      outputHeight: outputMetadata.height ?? null,
      targetWidth: canvas.width,
      targetHeight: canvas.height,
    });

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Stream screen normalization failed to reach the target canvas size",
    });
  }

  return normalizedBuffer;
}

const screenInputSchema = z.object({
  draftId: z.string(),
  kind: z.enum(["starting", "brb", "offline", "ending"]),
  title: z.string().trim().min(1).max(40),
  subtitle: z.string().trim().max(90).nullable(),
});

export const streamScreenFunnelRouter = createTRPCRouter({
  generateBatch: protectedProcedure
    .input(
      z.object({
        platform: z.literal("twitch"),
        templateId: z.string(),
        screens: z.array(screenInputSchema).min(1).max(12),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertWithinStreamScreenRateLimit(
        ctx.session.user.id,
        lastGenerateCallByUserId
      );

      const platform = STREAM_SCREEN_PLATFORMS[input.platform];

      if (!platform.enabled) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This stream screen platform is not yet available.",
        });
      }

      const template = STREAM_SCREEN_TEMPLATES.find(
        (candidate) =>
          candidate.id === input.templateId && candidate.platform === input.platform
      );

      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Stream screen template not found",
        });
      }

      const totalCredits = input.screens.length * template.credits;

      return withCreditTransaction(ctx.session.user.id, totalCredits, async () => {
        const createdIconIds: string[] = [];
        let sharedStyleAnchorBuffer: Buffer | null = null;

        try {
          const items: Array<{
            draftId: string;
            iconId: string;
            url: string;
            kind: StreamScreenKind;
            title: string;
            subtitle: string;
          }> = [];

          for (const screen of input.screens) {
            const screenPreset = platform.screenPresets.find(
              (preset) => preset.id === screen.kind
            );

            if (!screenPreset) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Invalid stream screen kind",
              });
            }

            const referenceImage = sharedStyleAnchorBuffer
              ? await buildStreamScreenStyleReferenceImage(
                  sharedStyleAnchorBuffer,
                  platform.canvas
                )
              : null;

            const prompt = buildStreamScreenPrompt({
              platform,
              template,
              screenPreset,
              title: screen.title,
              subtitle: screen.subtitle,
              useStyleReference: Boolean(referenceImage),
            });

            const generatedBuffer = referenceImage
              ? await fetchGeneratedStreamScreenBufferWithFluxFlex(
                  prompt,
                  platform.canvas,
                  [referenceImage]
                )
              : await fetchGeneratedStreamScreenBufferWithFluxFlex(
                  prompt,
                  platform.canvas,
                  []
                );

            const finalPngBuffer = await normalizeStreamScreenBufferToCanvas(
              generatedBuffer,
              platform.canvas,
              `generate:${screen.draftId}`
            );

            if (!sharedStyleAnchorBuffer) {
              sharedStyleAnchorBuffer = finalPngBuffer;
            }

            const icon = await ctx.prisma.icon.create({
              data: {
                prompt: `StreamScreen:${input.platform}:${template.id}:${screen.kind}:${screen.title.trim()}`,
                userId: ctx.session.user.id,
              },
            });

            createdIconIds.push(icon.id);

            const imageKey = `${platform.storagePrefix}/${ctx.session.user.id}/${icon.id}.png`;

            await ctx.prisma.icon.update({
              where: { id: icon.id },
              data: { imageKey },
            });

            await s3
              .putObject({
                Bucket: BUCKET,
                Key: imageKey,
                Body: finalPngBuffer,
                ContentType: "image/png",
              })
              .promise();

            items.push({
              draftId: screen.draftId,
              iconId: icon.id,
              url: getPublicStreamScreenUrl(imageKey),
              kind: screen.kind,
              title: screen.title,
              subtitle: screen.subtitle ?? "",
            });
          }

          return {
            items,
            totalCreditsCharged: totalCredits,
          };
        } catch (error) {
          if (createdIconIds.length > 0) {
            await ctx.prisma.icon.deleteMany({
              where: {
                id: {
                  in: createdIconIds,
                },
              },
            });
          }

          throw error;
        }
      });
    }),
});
