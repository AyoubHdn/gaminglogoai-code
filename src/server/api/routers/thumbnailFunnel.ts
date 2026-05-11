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
import { THUMBNAIL_TEMPLATES } from "~/data/thumbnailTemplates";
import { THUMBNAIL_PLATFORMS } from "~/data/thumbnailPlatforms";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { buildThumbnailPrompt } from "~/server/lib/buildThumbnailPrompt";
import { computeGenerationDimensions } from "~/server/lib/computeGenerationDimensions";
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

const THUMBNAIL_FUNNEL_RATE_LIMIT_MS = 3000;
const lastGenerateCallByUserId = new Map<string, number>();
const lastRefineCallByUserId = new Map<string, number>();

function assertWithinThumbnailRateLimit(
  userId: string,
  store: Map<string, number>
): void {
  const now = Date.now();
  const lastCallAt = store.get(userId);

  if (lastCallAt && now - lastCallAt < THUMBNAIL_FUNNEL_RATE_LIMIT_MS) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Please wait a moment before generating another thumbnail.",
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
      message: "Failed to fetch generated thumbnail image",
    });
  }

  return Buffer.from(await imageResponse.arrayBuffer());
}

async function resolveReplicateOutputToBuffer(output: unknown): Promise<Buffer> {
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

  if (Array.isArray(output) && typeof output[0] === "string") {
    return fetchBufferFromUrl(output[0]);
  }

  if (typeof output === "string" && output.startsWith("http")) {
    return fetchBufferFromUrl(output);
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Replicate returned an unexpected thumbnail output",
  });
}

async function fetchGeneratedThumbnailBuffer(
  prompt: string,
  width: number,
  height: number,
  referenceImageUrl: string | null
): Promise<Buffer> {
  if (env.MOCK_REPLICATE === "true") {
    return Buffer.from(b64Image, "base64");
  }

  const replicateInput: Record<string, unknown> = {
    prompt,
    aspect_ratio: "custom",
    width,
    height,
    output_format: "png",
  };

  if (referenceImageUrl) {
    replicateInput.input_images = [referenceImageUrl];
  }

  const output = await replicate.run("black-forest-labs/flux-2-max", {
    input: replicateInput,
  });

  return resolveReplicateOutputToBuffer(output);
}

async function fetchRefinedThumbnailBuffer(
  sourceImageUrl: string,
  prompt: string,
  width: number,
  height: number
): Promise<Buffer> {
  if (env.MOCK_REPLICATE === "true") {
    return Buffer.from(b64Image, "base64");
  }

  const output = await replicate.run("black-forest-labs/flux-2-max", {
    input: {
      input_images: [sourceImageUrl],
      prompt,
      aspect_ratio: "custom",
      width,
      height,
      output_format: "png",
    },
  });

  return resolveReplicateOutputToBuffer(output);
}

function getPublicThumbnailUrl(imageKey: string): string {
  return `https://${BUCKET}.s3.${env.NEXT_PUBLIC_AWS_REGION_GAMING}.amazonaws.com/${imageKey}`;
}

async function normalizeThumbnailBufferToCanvas(
  sourceBuffer: Buffer,
  targetWidth: number,
  targetHeight: number,
  contextLabel: string
): Promise<Buffer> {
  const inputMetadata = await sharp(sourceBuffer).metadata();

  console.log("[thumbnailFunnel] normalizing thumbnail buffer", {
    contextLabel,
    inputWidth: inputMetadata.width ?? null,
    inputHeight: inputMetadata.height ?? null,
    targetWidth,
    targetHeight,
  });

  const normalizedBuffer = await sharp(sourceBuffer)
    .rotate()
    .resize(targetWidth, targetHeight, {
      fit: "cover",
      position: "centre",
    })
    .png()
    .toBuffer();

  const outputMetadata = await sharp(normalizedBuffer).metadata();

  console.log("[thumbnailFunnel] normalized thumbnail buffer result", {
    contextLabel,
    outputWidth: outputMetadata.width ?? null,
    outputHeight: outputMetadata.height ?? null,
    targetWidth,
    targetHeight,
  });

  if (
    outputMetadata.width !== targetWidth ||
    outputMetadata.height !== targetHeight
  ) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Thumbnail normalization failed to reach the target canvas size",
    });
  }

  return normalizedBuffer;
}

export const thumbnailFunnelRouter = createTRPCRouter({
  generate: protectedProcedure
    .input(
      z.object({
        platform: z.literal("youtube"),
        templateId: z.string(),
        referenceImageUrl: z.string().nullable(),
        title: z.string().min(1),
        subtitle: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertWithinThumbnailRateLimit(
        ctx.session.user.id,
        lastGenerateCallByUserId
      );
      const platform = THUMBNAIL_PLATFORMS[input.platform];

      if (!platform.enabled) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This thumbnail platform is not yet available.",
        });
      }

      const template = THUMBNAIL_TEMPLATES.find(
        (candidate) =>
          candidate.id === input.templateId && candidate.platform === input.platform
      );

      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Thumbnail template not found",
        });
      }

      const prompt = buildThumbnailPrompt({
        template,
        title: input.title,
        subtitle: input.subtitle,
        hasReferenceImage: Boolean(input.referenceImageUrl),
      });

      return withCreditTransaction(
        ctx.session.user.id,
        template.credits,
        async () => {
          let createdIconId: string | null = null;

          try {
            const targetWidth = platform.surface.canvas.width;
            const targetHeight = platform.surface.canvas.height;
            const generationDimensions = computeGenerationDimensions(
              targetWidth,
              targetHeight,
              1024,
              2048,
              32
            );

            const generatedBuffer = await fetchGeneratedThumbnailBuffer(
              prompt,
              generationDimensions.width,
              generationDimensions.height,
              input.referenceImageUrl
            );

            const finalPngBuffer = await normalizeThumbnailBufferToCanvas(
              generatedBuffer,
              targetWidth,
              targetHeight,
              "generate"
            );

            const icon = await ctx.prisma.icon.create({
              data: {
                prompt: `Thumbnail:${input.platform}:${template.id}:${input.title.trim()}`,
                userId: ctx.session.user.id,
              },
            });

            createdIconId = icon.id;

            const imageKey = `${platform.surface.storagePrefix}/${ctx.session.user.id}/${icon.id}.png`;

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

            return {
              url: getPublicThumbnailUrl(imageKey),
              iconId: icon.id,
              creditsCharged: template.credits,
            };
          } catch (error) {
            if (createdIconId) {
              await ctx.prisma.icon.deleteMany({
                where: { id: createdIconId },
              });
            }

            throw error;
          }
        }
      );
    }),
  refine: protectedProcedure
    .input(
      z.object({
        platform: z.literal("youtube"),
        iconId: z.string(),
        refinementPrompt: z.string().trim().min(1).max(500),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertWithinThumbnailRateLimit(
        ctx.session.user.id,
        lastRefineCallByUserId
      );
      const platform = THUMBNAIL_PLATFORMS[input.platform];

      if (!platform.enabled) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This thumbnail platform is not yet available.",
        });
      }

      const sourceIcon = await ctx.prisma.icon.findFirst({
        where: {
          id: input.iconId,
          userId: ctx.session.user.id,
        },
      });

      if (!sourceIcon) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Thumbnail image not found",
        });
      }

      const sourceImageUrl = getPublicThumbnailUrl(
        sourceIcon.imageKey ?? sourceIcon.id
      );
      const refinePrompt = `Edit this ${platform.displayName} thumbnail: ${input.refinementPrompt}. Maintain the overall composition, title visibility, and professional thumbnail aesthetic. Do not add watermarks or signatures.`;

      return withCreditTransaction(ctx.session.user.id, 6, async () => {
        let createdIconId: string | null = null;

        try {
          const refinedBuffer = await fetchRefinedThumbnailBuffer(
            sourceImageUrl,
            refinePrompt,
            platform.surface.canvas.width,
            platform.surface.canvas.height
          );

          const finalPngBuffer = await normalizeThumbnailBufferToCanvas(
            refinedBuffer,
            platform.surface.canvas.width,
            platform.surface.canvas.height,
            "refine"
          );

          const icon = await ctx.prisma.icon.create({
            data: {
              prompt: `Thumbnail:${input.platform}:refined:${sourceIcon.id}`,
              userId: ctx.session.user.id,
            },
          });

          createdIconId = icon.id;

          const imageKey = `${platform.surface.storagePrefix}/${ctx.session.user.id}/${icon.id}.png`;

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

          return {
            url: getPublicThumbnailUrl(imageKey),
            iconId: icon.id,
            creditsCharged: 6,
            originalIconId: sourceIcon.id,
          };
        } catch (error) {
          if (createdIconId) {
            await ctx.prisma.icon.deleteMany({
              where: { id: createdIconId },
            });
          }

          throw error;
        }
      });
    }),
});
