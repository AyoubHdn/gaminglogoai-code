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
import { BANNER_TEMPLATES } from "~/data/bannerTemplates";
import { PLATFORMS } from "~/data/platforms";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { buildBannerPrompt } from "~/server/lib/buildBannerPrompt";
import { computeGenerationDimensions } from "~/server/lib/computeGenerationDimensions";
import { withCreditTransaction } from "~/server/lib/creditTransaction";
import { BANNER_SOCIAL_PLATFORM_IDS } from "~/lib/bannerSocials";

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
const BANNER_FUNNEL_RATE_LIMIT_MS = 3000;
const lastGenerateCallByUserId = new Map<string, number>();
const lastRefineCallByUserId = new Map<string, number>();

function assertWithinBannerRateLimit(
  userId: string,
  store: Map<string, number>
): void {
  const now = Date.now();
  const lastCallAt = store.get(userId);

  if (lastCallAt && now - lastCallAt < BANNER_FUNNEL_RATE_LIMIT_MS) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Please wait a moment before generating another banner.",
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
      message: "Failed to fetch generated banner image",
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
    message: "Replicate returned an unexpected banner output",
  });
}

async function fetchGeneratedBannerBuffer(
  prompt: string,
  width: number,
  height: number,
  logoReferenceUrl: string | null
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

  if (logoReferenceUrl) {
    replicateInput.input_images = [logoReferenceUrl];
  }

  // FLUX.2 Max supports custom width/height, stronger prompt adherence, and
  // reference-image guidance that fits the banner funnel's logo-aware
  // generation flow.
  const output = await replicate.run("black-forest-labs/flux-2-max", {
    input: replicateInput,
  });

  return resolveReplicateOutputToBuffer(output);
}

async function fetchRefinedBannerBuffer(
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

function getPublicBannerUrl(imageKey: string): string {
  return `https://${BUCKET}.s3.${env.NEXT_PUBLIC_AWS_REGION_GAMING}.amazonaws.com/${imageKey}`;
}

async function normalizeBannerBufferToCanvas(
  sourceBuffer: Buffer,
  targetWidth: number,
  targetHeight: number,
  contextLabel: string
): Promise<Buffer> {
  const inputMetadata = await sharp(sourceBuffer).metadata();

  console.log("[bannerFunnel] normalizing banner buffer", {
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

  console.log("[bannerFunnel] normalized banner buffer result", {
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
      message: "Banner normalization failed to reach the target canvas size",
    });
  }

  return normalizedBuffer;
}

export const bannerFunnelRouter = createTRPCRouter({
  // Logo handling uses one layer:
  // flux-2-max input_images - the uploaded logo is passed as a visual
  // reference so the model can echo its colors, styling, and overall identity
  // inside the generated banner. We do not paste the original logo over the
  // final image after generation.
  generate: protectedProcedure
    .input(
      z.object({
        platform: z.enum(["twitch", "youtube", "kick", "discord", "tiktok"]),
        templateId: z.string(),
        logoUrl: z.string().nullable(),
        channelName: z.string().min(1),
        tagline: z.string().nullable(),
        socialHandles: z
          .array(
            z.object({
              platform: z.enum(BANNER_SOCIAL_PLATFORM_IDS),
              handle: z.string(),
            })
          )
          .max(BANNER_SOCIAL_PLATFORM_IDS.length),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertWithinBannerRateLimit(
        ctx.session.user.id,
        lastGenerateCallByUserId
      );
      const platform = PLATFORMS[input.platform];

      if (!platform.enabled) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This platform is not yet available.",
        });
      }

      const template = BANNER_TEMPLATES.find(
        (candidate) =>
          candidate.id === input.templateId && candidate.platform === input.platform
      );

      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Banner template not found",
        });
      }

      const surface = platform.surfaces.banner;

      if (!surface) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Banner platform surface is not configured",
        });
      }

      const prompt = buildBannerPrompt({
        template,
        channelName: input.channelName,
        tagline: input.tagline,
        socialHandles: input.socialHandles,
        hasLogo: Boolean(input.logoUrl),
      });

      return withCreditTransaction(
        ctx.session.user.id,
        template.credits,
        async () => {
          let createdIconId: string | null = null;

          try {
            const targetWidth = surface.canvas.width;
            const targetHeight = surface.canvas.height;
            const generationDimensions = computeGenerationDimensions(
              targetWidth,
              targetHeight,
              1024,
              2048,
              32
            );
            const generationWidth = generationDimensions.width;
            const generationHeight = generationDimensions.height;

            console.log("[bannerFunnel] generating at", {
              generationWidth,
              generationHeight,
              targetWidth,
              targetHeight,
            });

            const generatedBuffer = await fetchGeneratedBannerBuffer(
              prompt,
              generationWidth,
              generationHeight,
              input.logoUrl
            );

            const generatedMetadata = await sharp(generatedBuffer).metadata();
            if (
              generatedMetadata.width !== generationWidth ||
              generatedMetadata.height !== generationHeight
            ) {
              console.warn("[bannerFunnel] flux-2-max output dimensions differ from request", {
                requestedWidth: generationWidth,
                requestedHeight: generationHeight,
                actualWidth: generatedMetadata.width ?? null,
                actualHeight: generatedMetadata.height ?? null,
              });
            }

            const finalPngBuffer = await normalizeBannerBufferToCanvas(
              generatedBuffer,
              targetWidth,
              targetHeight,
              "generate"
            );

            const icon = await ctx.prisma.icon.create({
              data: {
                prompt: `Banner:${input.platform}:${template.id}:${input.channelName.trim()}`,
                userId: ctx.session.user.id,
              },
            });

            createdIconId = icon.id;

            const imageKey = `${surface.storagePrefix}/${ctx.session.user.id}/${icon.id}.png`;

            await ctx.prisma.icon.update({
              where: {
                id: icon.id,
              },
              data: {
                imageKey,
              },
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
              url: getPublicBannerUrl(imageKey),
              iconId: icon.id,
              creditsCharged: template.credits,
            };
          } catch (error) {
            if (createdIconId) {
              await ctx.prisma.icon.deleteMany({
                where: {
                  id: createdIconId,
                },
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
        platform: z.enum(["twitch", "youtube", "kick", "discord", "tiktok"]),
        iconId: z.string(),
        refinementPrompt: z.string().trim().min(1).max(500),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertWithinBannerRateLimit(
        ctx.session.user.id,
        lastRefineCallByUserId
      );
      const platform = PLATFORMS[input.platform];
      const platformName = platform.displayName;

      if (!platform.enabled) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This platform is not yet available.",
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
          message: "Banner image not found",
        });
      }

      const surface = platform.surfaces.banner;

      if (!surface) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Banner platform surface is not configured",
        });
      }

      const sourceImageUrl = getPublicBannerUrl(sourceIcon.imageKey ?? sourceIcon.id);
      const refinePrompt = `Edit this ${platformName} banner: ${input.refinementPrompt}. Maintain the overall composition, channel name visibility, and professional banner aesthetic. Do not add watermarks or signatures.`;

      return withCreditTransaction(ctx.session.user.id, 6, async () => {
        let createdIconId: string | null = null;

        try {
          const refinedBuffer = await fetchRefinedBannerBuffer(
            sourceImageUrl,
            refinePrompt,
            surface.canvas.width,
            surface.canvas.height
          );
          const refinedMetadata = await sharp(refinedBuffer).metadata();
          console.log("[bannerFunnel] refine raw model output", {
            inputWidth: refinedMetadata.width ?? null,
            inputHeight: refinedMetadata.height ?? null,
            targetWidth: surface.canvas.width,
            targetHeight: surface.canvas.height,
          });

          const finalPngBuffer = await normalizeBannerBufferToCanvas(
            refinedBuffer,
            surface.canvas.width,
            surface.canvas.height,
            "refine"
          );

          const icon = await ctx.prisma.icon.create({
            data: {
              prompt: `Banner:${input.platform}:refined:${sourceIcon.id}`,
              userId: ctx.session.user.id,
            },
          });

          createdIconId = icon.id;

          const imageKey = `${surface.storagePrefix}/${ctx.session.user.id}/${icon.id}.png`;

          await ctx.prisma.icon.update({
            where: {
              id: icon.id,
            },
            data: {
              imageKey,
            },
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
            url: getPublicBannerUrl(imageKey),
            iconId: icon.id,
            creditsCharged: 6,
            originalIconId: sourceIcon.id,
          };
        } catch (error) {
          if (createdIconId) {
            await ctx.prisma.icon.deleteMany({
              where: {
                id: createdIconId,
              },
            });
          }

          throw error;
        }
      });
    }),
});

