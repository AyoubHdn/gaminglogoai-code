// ~/server/api/routers/nanoFace.ts
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import fetch from "node-fetch";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import Replicate from "replicate";
import { env } from "~/env.mjs";
import { b64Image as mockB64Image } from "~/data/b64Image";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from 'uuid';

// --- Configuration (This part can be refactored into a shared file later if needed) ---
const s3 = new AWS.S3({
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
  region: env.NEXT_PUBLIC_AWS_REGION_GAMING || "us-east-1",
});

const BUCKET_NAME = env.NEXT_PUBLIC_S3_BUCKET_NAME_GAMING;
if (!BUCKET_NAME) {
  throw new Error("S3 bucket for gaming logos is not configured.");
}

const replicate = new Replicate({
  auth: env.REPLICATE_API_TOKEN,
});

async function fetchAndEncodeOutputImage(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `AI model output URL error (${response.status})` });
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer).toString("base64");
}
// --- End Configuration ---


// ==================================================================
// The dedicated helper function for the google/nano-banana model
// ==================================================================
async function generateNanoBananaLogo(prompt: string, inputImageS3Url: string): Promise<string> {
  const replicatePath = "google/nano-banana";
  const replicateApiInput = {
    prompt,
    image: inputImageS3Url, // This model uses the 'image' parameter
    output_format: "png",
    safety_checker: "yes",
    seed: Math.floor(Math.random() * 1_000_000_000),
  };

  console.log(`NANO_FACE_HELPER: Calling ${replicatePath}`);
  
  if (env.MOCK_REPLICATE === "true") {
    console.log("NANO_FACE_HELPER: MOCK REPLICATE active.");
    return mockB64Image.split(',')[1] ?? "";
  }

  const outputFromReplicate = await replicate.run(replicatePath, { input: replicateApiInput });
  console.log("NANO_FACE_HELPER: Raw output:", JSON.stringify(outputFromReplicate).substring(0, 200) + "...");

  if (Array.isArray(outputFromReplicate) && typeof outputFromReplicate[0] === 'string' && outputFromReplicate[0].startsWith('http')) {
    const outputUrl = outputFromReplicate[0];
    console.log("NANO_FACE_HELPER: Processing URL:", outputUrl);
    return await fetchAndEncodeOutputImage(outputUrl);
  } else {
    console.error("NANO_FACE_HELPER: Unexpected output format.", outputFromReplicate);
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "AI model (Nano Banana) returned an unexpected data format." });
  }
}

// ==================================================================
// The new tRPC Router for Nano Banana
// ==================================================================
export const nanoFaceRouter = createTRPCRouter({
  generateLogo: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        inputImageBase64: z.string(),
        // No 'model' or 'aspectRatio' needed, as this router is specific
      })
    )
    .mutation(async ({ ctx, input }) => {
      // --- Credit deduction logic ---
      const creditsNeeded = 6; // Cost for Nano Banana
      const user = await ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } });
      if (!user || (user.gamingCredits ?? 0) < creditsNeeded) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "You do not have enough gaming credits." });
      }
      await ctx.prisma.user.update({ where: { id: ctx.session.user.id }, data: { gamingCredits: { decrement: creditsNeeded } } });

      // --- S3 Upload of user's input image ---
      let userImageS3Url: string;
      try {
        if (!input.inputImageBase64.startsWith('data:image')) throw new Error("Invalid base64 data URI for user image.");
        const parts = input.inputImageBase64.split(',');
        const mimeMatch = parts[0]?.match(/:(.*?);/);
        if (!mimeMatch || !mimeMatch[1] || !parts[1]) throw new Error("Cannot parse base64 data URI parts.");
        const contentType = mimeMatch[1]; const base64Data = parts[1];
        const imageBuffer = Buffer.from(base64Data, 'base64');
        const extension = contentType.split('/')[1]?.replace("jpeg", "jpg") ?? 'jpg';
        const s3Key = `user-uploads/faces/${ctx.session.user.id}/${uuidv4()}.${extension}`;
        await s3.putObject({ Bucket: BUCKET_NAME, Key: s3Key, Body: imageBuffer, ContentType: contentType }).promise();
        userImageS3Url = `https://${BUCKET_NAME}.s3.${env.NEXT_PUBLIC_AWS_REGION_GAMING || "us-east-1"}.amazonaws.com/${s3Key}`;
      } catch (e) { const msg = e instanceof Error ? e.message : "S3 Upload failed"; throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Input image S3 upload: ${msg}` }); }

      // --- Call the specific helper for Nano Banana ---
      const base64ImageString = await generateNanoBananaLogo(input.prompt, userImageS3Url);

      // --- Save the generated image to S3 and Prisma ---
      const icon = await ctx.prisma.icon.create({
        data: { prompt: `NanoFace: ${input.prompt.substring(0,150)}...`, userId: ctx.session.user.id },
      });
      await s3.putObject({ Bucket: BUCKET_NAME, Body: Buffer.from(base64ImageString, "base64"), Key: icon.id, ContentEncoding: "base64", ContentType: "image/png" }).promise();

      return [{ imageUrl: `https://${BUCKET_NAME}.s3.${env.NEXT_PUBLIC_AWS_REGION_GAMING || "us-east-1"}.amazonaws.com/${icon.id}` }];
    }),
});