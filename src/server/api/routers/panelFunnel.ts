/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TRPCError } from "@trpc/server";
import AWS from "aws-sdk";
import fetch from "node-fetch";
import Replicate from "replicate";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  FaCalendarAlt,
  FaDesktop,
  FaDiscord,
  FaDonate,
  FaHashtag,
  FaQuestionCircle,
  FaShieldAlt,
  FaStar,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";
import { type IconType } from "react-icons";
import sharp from "sharp";
import { Readable } from "stream";
import type { ReadableStream as WebReadableStream } from "stream/web";
import { z } from "zod";

import { b64Image } from "~/data/b64Image";
import { PANEL_PLATFORMS, type PanelShapeOption } from "~/data/panelPlatforms";
import { PANEL_TEMPLATES } from "~/data/panelTemplates";
import { env } from "~/env.mjs";
import { getPanelBatchCredits } from "~/lib/panelPricing";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { buildPanelPrompt } from "~/server/lib/buildPanelPrompt";
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

const PANEL_FUNNEL_RATE_LIMIT_MS = 3000;
const lastGenerateCallByUserId = new Map<string, number>();

function assertWithinPanelRateLimit(
  userId: string,
  store: Map<string, number>
): void {
  const now = Date.now();
  const lastCallAt = store.get(userId);

  if (lastCallAt && now - lastCallAt < PANEL_FUNNEL_RATE_LIMIT_MS) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Please wait a moment before generating another panel set.",
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
      message: "Failed to fetch generated panel image",
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
        message: "Replicate returned an empty panel output",
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
    const resolvedUrl = output.url();
    return fetchBufferFromUrl(String(resolvedUrl));
  }

  if (
    typeof output === "object" &&
    output !== null &&
    "url" in output &&
    typeof output.url === "string"
  ) {
    return fetchBufferFromUrl(output.url);
  }

  console.error("[panelFunnel] unexpected replicate output", {
    isArray: Array.isArray(output),
    type: typeof output,
    constructorName:
      typeof output === "object" && output !== null && "constructor" in output
        ? String(output.constructor?.name ?? "unknown")
        : null,
  });

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Replicate returned an unexpected panel output",
  });
}

async function fetchGeneratedPanelBufferWithFluxFlex(
  prompt: string,
  shape: PanelShapeOption,
  referenceImages: string[]
): Promise<Buffer> {
  if (env.MOCK_REPLICATE === "true") {
    return Buffer.from(b64Image, "base64");
  }

  const replicateInput: Record<string, unknown> = {
    prompt,
    aspect_ratio: "custom",
    width: shape.width,
    height: shape.height,
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

function getPublicPanelUrl(imageKey: string): string {
  return `https://${BUCKET}.s3.${env.NEXT_PUBLIC_AWS_REGION_GAMING}.amazonaws.com/${imageKey}`;
}

function getPanelIconComponent(title: string): IconType {
  const token = title.toLowerCase();

  if (token.includes("schedule") || token.includes("calendar")) {
    return FaCalendarAlt;
  }

  if (token.includes("about") || token.includes("profile") || token.includes("me")) {
    return FaUserCircle;
  }

  if (token.includes("donate") || token.includes("tip") || token.includes("heart")) {
    return FaDonate;
  }

  if (token.includes("rule") || token.includes("shield")) {
    return FaShieldAlt;
  }

  if (token.includes("discord") || token.includes("community")) {
    return FaDiscord;
  }

  if (token.includes("spec") || token.includes("pc") || token.includes("hardware")) {
    return FaDesktop;
  }

  if (token.includes("faq") || token.includes("question") || token.includes("info")) {
    return FaQuestionCircle;
  }

  if (token.includes("social")) {
    return FaHashtag;
  }

  if (token.includes("team") || token.includes("group")) {
    return FaUsers;
  }

  return FaStar;
}

function getPanelReferenceLayout(shape: PanelShapeOption) {
  switch (shape.id) {
    case "wide-3-1":
      return {
        iconBox: {
          left: 0.065,
          top: 0.18,
          width: 0.22,
          height: 0.64,
        },
        titleMask: {
          left: 0.35,
          top: 0.2,
          width: 0.5,
          height: 0.2,
        },
        contentMask: {
          left: 0.35,
          top: 0.48,
          width: 0.48,
          height: 0.2,
        },
      };
    case "landscape-4-3":
      return {
        iconBox: {
          left: 0.09,
          top: 0.18,
          width: 0.24,
          height: 0.3,
        },
        titleMask: {
          left: 0.39,
          top: 0.18,
          width: 0.44,
          height: 0.16,
        },
        contentMask: {
          left: 0.18,
          top: 0.56,
          width: 0.64,
          height: 0.16,
        },
      };
    case "square-1-1":
      return {
        iconBox: {
          left: 0.34,
          top: 0.13,
          width: 0.32,
          height: 0.24,
        },
        titleMask: {
          left: 0.18,
          top: 0.48,
          width: 0.64,
          height: 0.14,
        },
        contentMask: {
          left: 0.15,
          top: 0.68,
          width: 0.7,
          height: 0.14,
        },
      };
    case "portrait-3-4":
      return {
        iconBox: {
          left: 0.26,
          top: 0.1,
          width: 0.48,
          height: 0.22,
        },
        titleMask: {
          left: 0.16,
          top: 0.42,
          width: 0.68,
          height: 0.12,
        },
        contentMask: {
          left: 0.14,
          top: 0.62,
          width: 0.72,
          height: 0.16,
        },
      };
    default:
      return {
        iconBox: {
          left: 0.08,
          top: 0.18,
          width: 0.24,
          height: 0.32,
        },
        titleMask: {
          left: 0.38,
          top: 0.2,
          width: 0.42,
          height: 0.18,
        },
        contentMask: {
          left: 0.22,
          top: 0.56,
          width: 0.56,
          height: 0.18,
        },
      };
  }
}

function buildOverlaySvg(
  width: number,
  height: number,
  shape: PanelShapeOption,
  includeIcon: boolean
): Buffer {
  const layout = getPanelReferenceLayout(shape);
  const iconBoxX = Math.round(width * layout.iconBox.left);
  const iconBoxY = Math.round(height * layout.iconBox.top);
  const iconBoxWidth = Math.round(width * layout.iconBox.width);
  const iconBoxHeight = Math.round(height * layout.iconBox.height);
  const titleMaskX = Math.round(width * layout.titleMask.left);
  const titleMaskY = Math.round(height * layout.titleMask.top);
  const titleMaskWidth = Math.round(width * layout.titleMask.width);
  const titleMaskHeight = Math.round(height * layout.titleMask.height);
  const contentMaskX = Math.round(width * layout.contentMask.left);
  const contentMaskY = Math.round(height * layout.contentMask.top);
  const contentMaskWidth = Math.round(width * layout.contentMask.width);
  const contentMaskHeight = Math.round(height * layout.contentMask.height);

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      ${
        includeIcon
          ? `<rect x="${iconBoxX}" y="${iconBoxY}" width="${iconBoxWidth}" height="${iconBoxHeight}" rx="${Math.max(18, Math.round(height * 0.04))}" fill="rgba(9, 16, 34, 0.86)" stroke="rgba(186, 230, 253, 0.22)" stroke-width="3" />`
          : `<rect x="${iconBoxX}" y="${iconBoxY}" width="${iconBoxWidth}" height="${iconBoxHeight}" rx="${Math.max(18, Math.round(height * 0.04))}" fill="rgba(9, 16, 34, 0.94)" />`
      }
      <rect x="${titleMaskX}" y="${titleMaskY}" width="${titleMaskWidth}" height="${titleMaskHeight}" rx="${Math.max(14, Math.round(height * 0.03))}" fill="rgba(9, 16, 34, 0.84)" />
      <rect x="${contentMaskX}" y="${contentMaskY}" width="${contentMaskWidth}" height="${contentMaskHeight}" rx="${Math.max(14, Math.round(height * 0.03))}" fill="rgba(9, 16, 34, 0.8)" />
    </svg>
  `.trim();

  return Buffer.from(svg);
}

async function buildPanelIconBuffer(
  title: string,
  maxSize: number
): Promise<Buffer> {
  const IconComponent = getPanelIconComponent(title);
  const iconMarkup = renderToStaticMarkup(
    createElement(IconComponent, {
      size: maxSize,
      color: "#f8fafc",
    })
  );

  return sharp(Buffer.from(iconMarkup))
    .resize(maxSize, maxSize, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function buildPanelStyleReferenceImage(
  sourceBuffer: Buffer,
  shape: PanelShapeOption,
  title: string,
  includeIcon: boolean
): Promise<string> {
  const width = shape.width;
  const height = shape.height;
  const layout = getPanelReferenceLayout(shape);
  const overlaySvg = buildOverlaySvg(width, height, shape, includeIcon);
  const composites: sharp.OverlayOptions[] = [
    {
      input: overlaySvg,
      blend: "over",
    },
  ];

  if (includeIcon) {
    const iconBoxWidth = Math.round(width * layout.iconBox.width);
    const iconBoxHeight = Math.round(height * layout.iconBox.height);
    const iconBoxX = Math.round(width * layout.iconBox.left);
    const iconBoxY = Math.round(height * layout.iconBox.top);
    const iconSize = Math.max(
      64,
      Math.round(Math.min(iconBoxWidth, iconBoxHeight) * 0.58)
    );
    const iconBuffer = await buildPanelIconBuffer(title, iconSize);
    const iconMetadata = await sharp(iconBuffer).metadata();
    const iconWidth = iconMetadata.width ?? iconSize;
    const iconHeight = iconMetadata.height ?? iconSize;
    const iconLeft = iconBoxX + Math.round((iconBoxWidth - iconWidth) / 2);
    const iconTop = iconBoxY + Math.round((iconBoxHeight - iconHeight) / 2);

    composites.push({
      input: iconBuffer,
      left: iconLeft,
      top: iconTop,
      blend: "over",
    });
  }

  const referenceBuffer = await sharp(sourceBuffer)
    .resize(width, height, {
      fit: "cover",
      position: "centre",
    })
    .composite(composites)
    .png()
    .toBuffer();

  return `data:image/png;base64,${referenceBuffer.toString("base64")}`;
}

async function normalizePanelBufferToCanvas(
  sourceBuffer: Buffer,
  targetWidth: number,
  targetHeight: number,
  contextLabel: string
): Promise<Buffer> {
  const inputMetadata = await sharp(sourceBuffer).metadata();

  console.log("[panelFunnel] normalizing panel buffer", {
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

  console.log("[panelFunnel] normalized panel buffer result", {
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
      message: "Panel normalization failed to reach the target canvas size",
    });
  }

  return normalizedBuffer;
}

const panelInputSchema = z.object({
  draftId: z.string(),
  title: z.string().trim().min(1).max(40),
  includeIcon: z.boolean().default(true),
  content: z.string().trim().max(220).nullable(),
});

export const panelFunnelRouter = createTRPCRouter({
  generateBatch: protectedProcedure
    .input(
      z.object({
        platform: z.literal("twitch"),
        templateId: z.string(),
        shapeId: z.enum([
          "wide-3-1",
          "landscape-4-3",
          "square-1-1",
          "portrait-3-4",
        ]),
        panels: z.array(panelInputSchema).min(1).max(12),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertWithinPanelRateLimit(ctx.session.user.id, lastGenerateCallByUserId);
      const platform = PANEL_PLATFORMS[input.platform];

      if (!platform.enabled) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This panel platform is not yet available.",
        });
      }

      const template = PANEL_TEMPLATES.find(
        (candidate) =>
          candidate.id === input.templateId && candidate.platform === input.platform
      );

      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Panel template not found",
        });
      }

      const shape = platform.shapes[input.shapeId];

      if (!shape) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Panel shape not found",
        });
      }

      const totalCredits = getPanelBatchCredits(input.panels.length);

      return withCreditTransaction(ctx.session.user.id, totalCredits, async () => {
        const createdIconIds: string[] = [];
        let sharedStyleAnchorBuffer: Buffer | null = null;

        try {
          const items: Array<{
            draftId: string;
            iconId: string;
            url: string;
            title: string;
            includeIcon: boolean;
            content: string;
          }> = [];

          for (const panel of input.panels) {
            const referenceImage = sharedStyleAnchorBuffer
              ? await buildPanelStyleReferenceImage(
                  sharedStyleAnchorBuffer,
                  shape,
                  panel.title,
                  panel.includeIcon
                )
              : null;

            const prompt = buildPanelPrompt({
              platform,
              template,
              shape,
              title: panel.title,
              includeIcon: panel.includeIcon,
              content: panel.content,
              useStyleReference: Boolean(referenceImage),
            });

            const generatedBuffer = referenceImage
              ? await fetchGeneratedPanelBufferWithFluxFlex(
                  prompt,
                  shape,
                  [referenceImage]
                )
              : await fetchGeneratedPanelBufferWithFluxFlex(
                  prompt,
                  shape,
                  []
                );

            const finalPngBuffer = await normalizePanelBufferToCanvas(
              generatedBuffer,
              shape.width,
              shape.height,
              `generate:${panel.draftId}`
            );

            if (!sharedStyleAnchorBuffer) {
              sharedStyleAnchorBuffer = finalPngBuffer;
            }

            const icon = await ctx.prisma.icon.create({
              data: {
                prompt: `Panel:${input.platform}:${template.id}:${shape.id}:${panel.title.trim()}`,
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
              draftId: panel.draftId,
              iconId: icon.id,
              url: getPublicPanelUrl(imageKey),
              title: panel.title,
              includeIcon: panel.includeIcon,
              content: panel.content ?? "",
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
