/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TRPCError } from "@trpc/server";
import AWS from "aws-sdk";
import fetch from "node-fetch";
import Replicate from "replicate";
import sharp from "sharp";
import { Readable } from "stream";
import { z } from "zod";
import { b64Image } from "~/data/b64Image";
import { BANNER_TEMPLATES } from "~/data/bannerTemplates";
import { PLATFORMS } from "~/data/platforms";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { buildBannerPrompt } from "~/server/lib/buildBannerPrompt";
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
const BANNER_FUNNEL_RATE_LIMIT_MS = 3000;
const lastGenerateCallByUserId = new Map();
const lastRefineCallByUserId = new Map();
function assertWithinBannerRateLimit(userId, store) {
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
async function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });
        stream.on("end", () => {
            resolve(Buffer.concat(chunks));
        });
        stream.on("error", reject);
    });
}
function isNodeReadableStream(value) {
    return value instanceof Readable;
}
function isWebReadableStream(value) {
    return (typeof value === "object" &&
        value !== null &&
        "getReader" in value &&
        typeof value.getReader === "function");
}
async function fetchBufferFromUrl(url) {
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch generated banner image",
        });
    }
    return Buffer.from(await imageResponse.arrayBuffer());
}
async function resolveReplicateOutputToBuffer(output) {
    if (isNodeReadableStream(output)) {
        return streamToBuffer(output);
    }
    if (isWebReadableStream(output)) {
        const reader = output.getReader();
        const chunks = [];
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
async function fetchGeneratedBannerBuffer(prompt, width, height, logoReferenceUrl) {
    if (env.MOCK_REPLICATE === "true") {
        return Buffer.from(b64Image, "base64");
    }
    const replicateInput = {
        prompt,
        size: "custom",
        width,
        height,
        sequential_image_generation: "disabled",
        max_images: 1,
    };
    if (logoReferenceUrl) {
        replicateInput.image_input = [logoReferenceUrl];
        // NOTE: seedream-4's current public schema does not expose a
        // prompt_image_strength field, so we rely on default reference strength.
    }
    // seedream-4 chosen over flux-dev for: (1) arbitrary width/height instead
    // of fixed aspect ratios, enabling exact-size per-platform output; (2)
    // stronger text rendering; (3) future support for multi-image input for
    // logo-aware generation.
    const output = await replicate.run("bytedance/seedream-4", {
        input: replicateInput,
    });
    return resolveReplicateOutputToBuffer(output);
}
async function fetchRefinedBannerBuffer(sourceImageUrl, prompt) {
    if (env.MOCK_REPLICATE === "true") {
        return Buffer.from(b64Image, "base64");
    }
    const output = await replicate.run("black-forest-labs/flux-kontext-pro", {
        input: {
            input_image: sourceImageUrl,
            prompt,
            aspect_ratio: "match_input_image",
            output_format: "png",
        },
    });
    return resolveReplicateOutputToBuffer(output);
}
function getPublicBannerUrl(imageKey) {
    return `https://${BUCKET}.s3.${env.NEXT_PUBLIC_AWS_REGION_GAMING}.amazonaws.com/${imageKey}`;
}
async function compositeLogoIfPresent(sourceBuffer, logoUrl) {
    if (!logoUrl) {
        return sourceBuffer;
    }
    try {
        const logoResponse = await fetch(logoUrl);
        if (!logoResponse.ok) {
            throw new Error("Failed to fetch uploaded logo");
        }
        const logoBuffer = await sharp(Buffer.from(await logoResponse.arrayBuffer()))
            .resize(200, 200, {
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
            .png()
            .toBuffer();
        return await sharp(sourceBuffer)
            .composite([
            {
                input: logoBuffer,
                left: 40,
                top: 40,
            },
        ])
            .png()
            .toBuffer();
    }
    catch (error) {
        console.error("BANNER FUNNEL LOGO COMPOSITE ERROR:", error);
        return sourceBuffer;
    }
}
export const bannerFunnelRouter = createTRPCRouter({
    // Logo handling has two layers:
    // (A) seedream-4 image_input — logo is passed as a style reference so the
    //     model generates a banner that visually coheres with the logo's colors
    //     and aesthetic.
    // (B) sharp composite — the literal logo is placed onto the upper-left of
    //     the final image so the user's actual logo appears on the banner (not
    //     just a vague visual reflection of it).
    // Both layers run when logoUrl is provided. Layer B is best-effort — a
    // composite failure degrades gracefully to AI-only output rather than
    // failing the whole request.
    generate: protectedProcedure
        .input(z.object({
        platform: z.enum(["twitch", "youtube", "kick", "discord", "tiktok"]),
        templateId: z.string(),
        logoUrl: z.string().nullable(),
        channelName: z.string().min(1),
        tagline: z.string().nullable(),
        socialHandles: z.string().nullable(),
    }))
        .mutation(async ({ ctx, input }) => {
        assertWithinBannerRateLimit(ctx.session.user.id, lastGenerateCallByUserId);
        const platform = PLATFORMS[input.platform];
        if (!platform.enabled) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "This platform is not yet available.",
            });
        }
        const template = BANNER_TEMPLATES.find((candidate) => candidate.id === input.templateId && candidate.platform === input.platform);
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
        return withCreditTransaction(ctx.session.user.id, template.credits, async () => {
            var _a, _b;
            let createdIconId = null;
            try {
                const targetWidth = surface.canvas.width;
                const targetHeight = surface.canvas.height;
                const generationDimensions = computeGenerationDimensions(targetWidth, targetHeight);
                const generationWidth = generationDimensions.width;
                const generationHeight = generationDimensions.height;
                console.log("[bannerFunnel] generating at", {
                    generationWidth,
                    generationHeight,
                    targetWidth,
                    targetHeight,
                });
                const generatedBuffer = await fetchGeneratedBannerBuffer(prompt, generationWidth, generationHeight, input.logoUrl);
                const generatedMetadata = await sharp(generatedBuffer).metadata();
                if (generatedMetadata.width !== generationWidth ||
                    generatedMetadata.height !== generationHeight) {
                    console.warn("[bannerFunnel] seedream output dimensions differ from request", {
                        requestedWidth: generationWidth,
                        requestedHeight: generationHeight,
                        actualWidth: (_a = generatedMetadata.width) !== null && _a !== void 0 ? _a : null,
                        actualHeight: (_b = generatedMetadata.height) !== null && _b !== void 0 ? _b : null,
                    });
                }
                const resizedBuffer = await sharp(generatedBuffer)
                    .resize(targetWidth, targetHeight, {
                    fit: "cover",
                })
                    .png()
                    .toBuffer();
                const withLogoBuffer = await compositeLogoIfPresent(resizedBuffer, input.logoUrl);
                const finalPngBuffer = withLogoBuffer;
                const icon = await ctx.prisma.icon.create({
                    data: {
                        prompt: `TwitchBanner:${template.id}:${input.channelName.trim()}`,
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
            }
            catch (error) {
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
    refine: protectedProcedure
        .input(z.object({
        platform: z.enum(["twitch", "youtube", "kick", "discord", "tiktok"]),
        iconId: z.string(),
        refinementPrompt: z.string().trim().min(1).max(500),
    }))
        .mutation(async ({ ctx, input }) => {
        var _a;
        assertWithinBannerRateLimit(ctx.session.user.id, lastRefineCallByUserId);
        const platform = PLATFORMS[input.platform];
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
        const sourceImageUrl = getPublicBannerUrl((_a = sourceIcon.imageKey) !== null && _a !== void 0 ? _a : sourceIcon.id);
        const refinePrompt = `Edit this Twitch banner: ${input.refinementPrompt}. Maintain the overall composition, channel name visibility, and professional banner aesthetic. Do not add watermarks or signatures.`;
        return withCreditTransaction(ctx.session.user.id, 4, async () => {
            let createdIconId = null;
            try {
                const refinedBuffer = await fetchRefinedBannerBuffer(sourceImageUrl, refinePrompt);
                const finalPngBuffer = await sharp(refinedBuffer)
                    .resize(surface.canvas.width, surface.canvas.height, {
                    fit: "cover",
                })
                    .png()
                    .toBuffer();
                const icon = await ctx.prisma.icon.create({
                    data: {
                        prompt: `TwitchBanner: refined from ${sourceIcon.id}`,
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
                    creditsCharged: 4,
                    originalIconId: sourceIcon.id,
                };
            }
            catch (error) {
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
