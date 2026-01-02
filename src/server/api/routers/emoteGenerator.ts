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
): Promise<string> {
  const key = `${keyPrefix}/${uuidv4()}.png`;

  await s3
    .putObject({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: Buffer.from(base64, "base64"),
      ContentType: "image/png",
    })
    .promise();

  return `https://${BUCKET_NAME}.s3.${AWS_REGION || "us-east-1"}.amazonaws.com/${key}`;
}

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
      const BASE_COST = 1;

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

      const base64Data = input.inputImageBase64.split(",")[1];
      if (!base64Data) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid image format",
        });
      }
      const inputImageUrl = await uploadBase64ToS3(base64Data, `emotes/input/${user.id}`);

      /* ------------------ Replicate call ------------------ */
      const output = (await replicate.run("openai/gpt-image-1", {
        input: {
            openai_api_key: env.OPENAI_API_KEY,
            prompt: input.prompt,
            input_images: [inputImageUrl],
            input_fidelity: "high",
            aspect_ratio: "1:1",
            background: "transparent",
            output_format: "png",
            number_of_images: 1,
            user_id: user.id,
        },
      })) as string[];

      if (!output?.length) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "AI did not return an image",
        });
      }

      /* ------------------ Save output ------------------ */
      const base64 = await fetchAndEncodeImage(output[0]!);
      const finalImageUrl = await uploadBase64ToS3(
        base64,
        `emotes/base/${user.id}`
      );

      await ctx.prisma.icon.create({
        data: {
          userId: user.id,
          prompt: `EmoteBase: ${input.prompt.substring(0, 150)}`,
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
});
