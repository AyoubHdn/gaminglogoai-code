/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import fetch from "node-fetch";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import Replicate from "replicate";
import { env } from "~/env.mjs";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { Plan as PrismaPlan } from "@prisma/client";
import { syncUserToMautic } from "~/server/api/routers/mautic-utils";
import { emotes } from "~/data/emotes";
import sharp from "sharp";

const EmoteKeyEnum = z.enum([
  "GG", "LOL", "RIP", "WOW", "HYPE",
  "HI", "HEY", "YO", "SUP", "WELCOME",
  "OMG", "WTF", "REALLY", "YIKES",
  "POG", "PROGGERS", "OOP", "OOF",
  "EZ", "EASY", "DUB", "TOP1", "1HP",
  "CRACK", "TOXIC", "REKT", "FAIL",
  "THANKS", "BYE", "NOOO", "YESSS",
  "LEGEND", "POWER", "DEAD", "200IQ",
  "GOTEM", "GOODVIBES", "CLIPTHAT",
  "RAID", "BAN", "LIT"
]);

/* ------------------------------------------------------------------ */
/* AWS S3 CONFIG */
/* ------------------------------------------------------------------ */

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
  region: env.NEXT_PUBLIC_AWS_REGION_GAMING || "us-east-1",
});

const BUCKET_NAME = env.NEXT_PUBLIC_S3_BUCKET_NAME_GAMING;
if (!BUCKET_NAME) {
  throw new Error("S3 bucket for gaminglogoai is not configured.");
}

const AWS_REGION = env.NEXT_PUBLIC_AWS_REGION_GAMING || "us-east-1";

/* ------------------------------------------------------------------ */
/* REPLICATE */
/* ------------------------------------------------------------------ */

const replicate = new Replicate({
  auth: env.REPLICATE_API_TOKEN,
});

/* ------------------------------------------------------------------ */
/* HELPERS */
/* ------------------------------------------------------------------ */

async function normalizeImage(base64: string): Promise<string> {
  const buffer = Buffer.from(base64, "base64");

  const normalized = await sharp(buffer)
    .rotate() // fixes EXIF orientation
    .resize(1024, 1024, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .png({ quality: 90 }) // force PNG
    .toBuffer();

  return normalized.toString("base64");
}

async function fetchAndEncodeImage(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch image from AI output",
    });
  }
  const buffer = await res.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}

async function uploadBase64ToS3(
  base64: string,
  keyPrefix: string
): Promise<{ key: string; url: string }> {
  const key = `${keyPrefix}/${uuidv4()}.png`;

  await s3.putObject({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: Buffer.from(base64, "base64"),
    ContentType: "image/png",
  }).promise();

  return {
    key,
    url: `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`,
  };
}

const EMOTE_BASE_PROMPT = `
Create a Twitch emote.
Face only, centered, transparent background.
Bold outlines, simplified shapes, high contrast.
Optimized for very small sizes (28px–112px).
`;

const buildTextOverlayPrompt = (
  text: string,
  position: "top-left" | "top-right",
  color?: string
) => `
Add a small text overlay displaying "${text}".
- Position: ${position === "top-left" ? "top left" : "top right"}
- Very small size, emote-scale
- Matches the art style of the character
- Bold and readable at 28px
- No background box
- Subtle outline for contrast
${color ? `Text color: ${color}.` : "Choose a color that fits the style."}
`;


/* ------------------------------------------------------------------ */
/* ROUTER */
/* ------------------------------------------------------------------ */

export const emoteRouter = createTRPCRouter({
  /* ================================================================
     STEP 2 — BASE IMAGE GENERATION (WITH USER IMAGE)
  ================================================================ */
  generateBaseImage: protectedProcedure
    .input(
      z.object({
        prompt: z.string().min(10),
        platform: z.literal("twitch"),
        inputImageBase64: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const BASE_COST = 3;

      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user || (user.gamingCredits ?? 0) < BASE_COST) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not enough gaming credits",
        });
      }

      /* ------------------ Deduct credits ------------------ */
      await ctx.prisma.user.update({
        where: { id: user.id },
        data: { gamingCredits: { decrement: BASE_COST } },
      });

      /* ------------------ Upload input image ------------------ */
      if (!input.inputImageBase64.startsWith("data:image")) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid image format",
        });
      }

      const parts = input.inputImageBase64.split(",");

      if (parts.length !== 2 || !parts[1]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid base64 image format",
        });
      }

      const rawBase64 = parts[1]; // now guaranteed string
      const base64Data = await normalizeImage(rawBase64);

      if (!base64Data) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid image format",
        });
      }
      const { url: inputImageUrl } = await uploadBase64ToS3(base64Data, `emotes/input/${user.id}`);

      /* ------------------ Replicate call ------------------ */
      let output: string[];

      try {
        const prediction = await replicate.run("openai/gpt-image-1.5", {
          input: {
            prompt: input.prompt,
            input_images: [inputImageUrl],
            input_fidelity: "high",
            aspect_ratio: "1:1",
            background: "transparent",
            output_format: "png",
            number_of_images: 1,
            user_id: user.id,
          },
        });

        if (!Array.isArray(prediction)) {
          console.error("Replicate non-array output:", prediction);
          throw new Error("Invalid Replicate output");
        }

        output = prediction;
      } catch (err: any) {
        console.error("REPLICATE ERROR FULL:", {
          message: err?.message,
          response: err?.response?.data,
          stack: err?.stack,
        });

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Image generation failed. Please try a different image.",
        });
      }

      /* ------------------ Save output ------------------ */
      const base64 = await fetchAndEncodeImage(output[0]!);
      const { key: s3Key, url: finalImageUrl } = await uploadBase64ToS3(base64, `emotes/base/${user.id}`);

      await ctx.prisma.icon.create({
        data: {
          userId: user.id,
          prompt: `EmoteBase: ${input.prompt.substring(0, 150)}`,
          imageKey: s3Key, // ✅ SAME key
        },
      });

      /* ------------------ Sync Mautic ------------------ */
      if (user.email && env.MAUTIC_BASE_URL) {
        await syncUserToMautic(
          {
            email: user.email,
            name: user.name,
            brand_specific_credits: (user.gamingCredits ?? 0) - BASE_COST,
            brand_specific_plan:
              user.gamingPlan?.toString() ?? PrismaPlan.None.toString(),
          },
          "gaminglogoai"
        );
      }

      return {
        baseImageUrl: finalImageUrl,
      };
    }),
    generateEmotes: protectedProcedure
  .input(
    z.object({
      baseImageUrl: z.string().url(),
      emotes: z.array(EmoteKeyEnum).min(1),

      // NEW
      withText: z.boolean(),
      textPosition: z.enum(["top-left", "top-right"]),
      textColor: z.string().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const COST_PER_EMOTE = 3;
    const totalCost = input.emotes.length * COST_PER_EMOTE;

    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    });

    if (!user || (user.gamingCredits ?? 0) < totalCost) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Not enough gaming credits",
      });
    }

    // Deduct credits ONCE
    await ctx.prisma.user.update({
      where: { id: user.id },
      data: { gamingCredits: { decrement: totalCost } },
    });

    const results: { emote: string; imageUrl: string }[] = [];

    for (const emoteKey of input.emotes) {
      const emoteDef = emotes.find((e) => e.key === emoteKey);
      if (!emoteDef) continue;

      let prompt = `
${EMOTE_BASE_PROMPT}
Same character and same art style as the base image.
Expression: ${emoteDef.prompt}.
`;

      if (input.withText) {
        prompt += buildTextOverlayPrompt(
          emoteDef.label,
          input.textPosition,
          input.textColor
        );
      }

      let output: string[];

      try {
        output = (await replicate.run("openai/gpt-image-1.5", {
          input: {
            prompt: prompt.trim(),
            input_images: [input.baseImageUrl],
            input_fidelity: "high",
            aspect_ratio: "1:1",
            background: "transparent",
            output_format: "png",
            number_of_images: 1,
            user_id: user.id,
          },
        })) as string[];
      } catch (err) {
        console.error("REPLICATE EMOTE ERROR:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate emotes",
        });
      }

      if (!output?.length) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to generate ${emoteKey}`,
        });
      }

      const base64 = await fetchAndEncodeImage(output[0]!);
    const { key: s3Key, url: imageUrl } =
      await uploadBase64ToS3(
        base64,
        `emotes/final/${user.id}/${emoteKey.toLowerCase()}`
      );

    await ctx.prisma.icon.create({
      data: {
        userId: user.id,
        prompt: `Emote:${emoteKey}${input.withText ? ":text" : ""}`,
        imageKey: s3Key, // ✅ SAME key
      },
    });

    results.push({ emote: emoteKey, imageUrl });

    }

    return results;
  }),
});
