// ~/server/api/routers/faceLogo.ts
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import fetch from "node-fetch";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import Replicate from "replicate";
import { env } from "~/env.mjs";
import { b64Image as mockB64Image } from "~/data/b64Image"; // Used for MOCK_REPLICATE
import AWS from "aws-sdk";
import { syncUserToMautic } from "~/server/api/routers/mautic-utils";
import { v4 as uuidv4 } from 'uuid';
import { Plan as PrismaPlan } from "@prisma/client";
import { buffer as streamToBuffer } from "stream/consumers";
import { Readable } from "stream";

// S3 Client Configuration (uses gaming specific env vars)
const s3 = new AWS.S3({
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID, // Assuming these are your general AWS keys
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
  region: env.NEXT_PUBLIC_AWS_REGION_GAMING || "us-east-1",
});

const BUCKET_NAME = env.NEXT_PUBLIC_S3_BUCKET_NAME_GAMING; // Bucket for gaminglogoai images
if (!BUCKET_NAME) {
  console.error("CRITICAL_ERROR: S3_BUCKET_NAME_GAMING env var not set for faceLogo.ts!");
  throw new Error("S3 bucket for gaming logos is not configured."); // Fail fast
}

const replicate = new Replicate({
  auth: env.REPLICATE_API_TOKEN,
});

// Helper function to fetch an image from a URL and encode it as Base64
// (This function can be identical to the one in generate.ts or moved to a shared util)
async function fetchAndEncodeOutputImage(url: string): Promise<string> {
  console.log(`FACELOGO.TS: Fetching to encode Replicate output URL: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text().catch(() => `Failed to retrieve error text from ${url}`);
    console.error(`FACELOGO.TS: Failed to fetch image from ${url}. Status: ${response.status}. Body: ${errorText}`);
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `AI model output URL error (${response.status}): ${errorText.substring(0,100)}` });
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer).toString("base64");
}

// Helper to generate face logo using FLUX Kontext models
async function generateKontextFaceLogo(
  prompt: string,
  modelName: "flux-kontext-pro" | "flux-kontext-max",
  aspectRatio: "1:1", // Fixed for face logos
  inputImageS3Url: string // Publicly accessible URL of the user's uploaded face
): Promise<string> { // Returns a single base64 string
  let replicatePath: `${string}/${string}`;
  const replicateApiInput: Record<string, any> = {
    prompt,
    input_image: inputImageS3Url, // As per model schema
    aspect_ratio: aspectRatio,    // Use passed value, likely "1:1" or "match_input_image"
    output_format: "png",         // As per model schema default
    safety_tolerance: 6,          // As per model schema default
    seed: Math.floor(Math.random() * 1_000_000_000),
    // num_outputs is not in Kontext schema, they output 1 image
  };

  if (modelName === "flux-kontext-pro") {
    replicatePath = "black-forest-labs/flux-kontext-pro"; // ** YOU MUST VERIFY THIS PATH **
    // Add any specific parameters for flux-kontext-pro if needed
    // e.g., replicateApiInput.num_inference_steps = 20;
  } else { // flux-kontext-max
    replicatePath = "black-forest-labs/flux-kontext-max"; // ** YOU MUST VERIFY THIS PATH **
    // e.g., replicateApiInput.num_inference_steps = 30;
  }

  console.log(`FACELOGO.TS: Calling ${modelName} with input:`, JSON.stringify(replicateApiInput));

  if (env.MOCK_REPLICATE === "true") {
    console.log("FACELOGO.TS: MOCK REPLICATE for face logo.");
    return mockB64Image.split(',')[1] || "mockFaceLogoBase64";
  }

  const outputFromReplicate: unknown = await replicate.run(replicatePath, { input: replicateApiInput });
  console.log("FACELOGO.TS: Replicate raw output (typeof):", typeof outputFromReplicate);
  console.log("FACELOGO.TS: Replicate raw output (value):", JSON.stringify(outputFromReplicate).substring(0, 500) + "...");

  // Robust output processing, similar to Ideogram's from your old code
  function isNodeReadableStream(obj: any): obj is Readable { return obj instanceof Readable; }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  function isWebReadableStream(obj: any): obj is ReadableStream<Uint8Array> { return typeof obj?.getReader === "function"; }

  let base64Image: string;

  if (isNodeReadableStream(outputFromReplicate)) {
    console.log("FACELOGO.TS: Processing Node.js ReadableStream from Kontext model.");
    const streamBuffer = await streamToBuffer(outputFromReplicate);
    base64Image = streamBuffer.toString("base64");
  } else if (isWebReadableStream(outputFromReplicate)) {
    console.log("FACELOGO.TS: Processing Web ReadableStream from Kontext model.");
    const reader = outputFromReplicate.getReader();
    const chunks: Uint8Array[] = [];
    while (true) { const { value, done } = await reader.read(); if (done) break; if (value) chunks.push(value); }
    base64Image = Buffer.concat(chunks).toString("base64");
  } else if (Buffer.isBuffer(outputFromReplicate)) {
    console.log("FACELOGO.TS: Processing Buffer output from Kontext model.");
    base64Image = outputFromReplicate.toString("base64");
  } else if (typeof outputFromReplicate === 'string' && outputFromReplicate.startsWith('http')) {
    console.log("FACELOGO.TS: Processing URL output from Kontext model:", outputFromReplicate);
    base64Image = await fetchAndEncodeOutputImage(outputFromReplicate);
  } else if (typeof outputFromReplicate === 'object' && outputFromReplicate !== null && 'url' in outputFromReplicate && typeof (outputFromReplicate).url === 'string' && (outputFromReplicate).url.startsWith('http')) {
    console.log("FACELOGO.TS: Processing object with URL from Kontext model:", (outputFromReplicate).url);
    base64Image = await fetchAndEncodeOutputImage((outputFromReplicate).url);
  } else if (Array.isArray(outputFromReplicate) && outputFromReplicate.length > 0) {
      // If it's an array, take the first item and process it
      console.log("FACELOGO.TS: Kontext model returned an array, processing first item.");
      const firstItem: unknown = outputFromReplicate[0];
      // Re-process the first item using the same logic
      if (typeof firstItem === 'string' && firstItem.startsWith('http')) base64Image = await fetchAndEncodeOutputImage(firstItem);
      // Add other checks for stream/buffer if firstItem could be those
      else {
        console.error("FACELOGO.TS: First item in Kontext output array not a URL:", firstItem);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unexpected array output format from Kontext model."});
      }
  } else {
    let errorDetail = "Unexpected or empty output type from AI model.";
    if(typeof outputFromReplicate === 'object' && outputFromReplicate !== null) {
        const errObj = outputFromReplicate as {error?: string, detail?: string};
        if(errObj.error) errorDetail = `AI Model Error: ${errObj.error}`;
        else if(errObj.detail) errorDetail = `AI Model Detail: ${errObj.detail}`;
    }
    console.error("FACELOGO.TS: Unexpected output type from Kontext model:", outputFromReplicate);
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: errorDetail });
  }
  
  if (!base64Image || base64Image.length < 100) { // Basic sanity check
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to obtain valid image data from AI model." });
  }
  return base64Image; // Return a single base64 string
}


export const faceLogoRouter = createTRPCRouter({
  generateFaceLogo: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        inputImageBase64: z.string(), // data URI: "data:image/jpeg;base64,..."
        model: z.enum(["flux-kontext-pro", "flux-kontext-max"]),
        aspectRatio: z.enum(["1:1"]), // Fixed for face logos
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("FACELOGO_ROUTER: [1] generateFaceLogo mutation ENTERED. User:", ctx.session.user.id, "Model:", input.model);
      const modelCosts: Record<typeof input.model, number> = {
        "flux-kontext-pro": 4, // Example cost
        "flux-kontext-max": 6, // Example cost
      };
      const creditsNeeded = modelCosts[input.model];
      console.log("FACELOGO_ROUTER: [2] Credits needed:", creditsNeeded);

      const user = await ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } });
      if (!user || (user.gamingCredits ?? 0) < creditsNeeded) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "You do not have enough gaming credits for this face logo." });
      }
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { gamingCredits: { decrement: creditsNeeded } },
      });
      console.log("FACELOGO_ROUTER: [3] Credits deducted for user:", ctx.session.user.id);
      
      const updatedUser = await ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } });
      if (updatedUser?.email && env.MAUTIC_BASE_URL) {
        try {
          await syncUserToMautic(
            { email: updatedUser.email, name: updatedUser.name,
              brand_specific_credits: updatedUser.gamingCredits,
              brand_specific_plan: updatedUser.gamingPlan?.toString() ?? PrismaPlan.None.toString(),
            }, 'gaminglogoai' // This is for gaminglogoai context
          );
        } catch (err) { console.error("Error updating Mautic (generateFaceLogo):", err); }
      }

      let userImageS3Url: string;
      console.log("FACELOGO_ROUTER: [5] Starting S3 upload for user's input image.");
      try {
        if (!input.inputImageBase64.startsWith('data:image')) throw new Error("Invalid base64 data URI for user image.");
        const parts = input.inputImageBase64.split(',');
        const mimeMatch = parts[0]?.match(/:(.*?);/);
        if (!mimeMatch || !mimeMatch[1] || !parts[1]) throw new Error("Cannot parse base64 data URI parts.");
        const contentType = mimeMatch[1]; const base64Data = parts[1];
        const imageBuffer = Buffer.from(base64Data, 'base64');
        const extensionPart = contentType.split('/')[1];
        if (!extensionPart) throw new Error("Cannot determine file extension from content type.");
        const extension = extensionPart.replace("jpeg", "jpg");
        const s3Key = `user-uploads/faces/${ctx.session.user.id}/${uuidv4()}.${extension}`;
        if (!BUCKET_NAME) throw new Error("S3_BUCKET_NAME_GAMING not configured.");
        await s3.putObject({ Bucket: BUCKET_NAME, Key: s3Key, Body: imageBuffer, ContentType: contentType }).promise();
        userImageS3Url = `https://${BUCKET_NAME}.s3.${env.NEXT_PUBLIC_AWS_REGION_GAMING || "us-east-1"}.amazonaws.com/${s3Key}`;
        console.log("FACELOGO_ROUTER: [6] User image uploaded to S3:", userImageS3Url);
      } catch (e) { const msg = e instanceof Error ? e.message : "S3 Upload failed"; throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: `Input image S3 upload: ${msg}` }); }

      console.log(`FACELOGO_ROUTER: [7] Calling generateKontextFaceLogo. Model: ${input.model}, S3 URL: ${userImageS3Url}`);
      const base64ImageString = await generateKontextFaceLogo( // Call the specific helper
        input.prompt, input.model, input.aspectRatio, userImageS3Url
      );
      // Since generateKontextFaceLogo now returns a single string, wrap it in an array if needed by downstream.
      // Or, adjust the S3 upload logic to handle a single base64 string.
      // For consistency with how b64Images was used before, let's make it an array of one.
      const b64Images = [base64ImageString]; 
      console.log("FACELOGO_ROUTER: [9] Received base64 images from Replicate helper. Count:", b64Images.length);

      const awsRegionToUse = env.NEXT_PUBLIC_AWS_REGION_GAMING || "us-east-1";
      if (!BUCKET_NAME) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "S3_BUCKET_NAME_GAMING not configured for final upload."});

      const createdIcons = await Promise.all(
        b64Images.map(async (imgBase64) => {
          if (!imgBase64 || typeof imgBase64 !== 'string' || imgBase64.length < 100) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Received invalid image data from AI after processing." });
          }
          const icon = await ctx.prisma.icon.create({
            data: { prompt: `FaceLogo: ${input.prompt.substring(0,150)}...`, userId: ctx.session.user.id, /* type: "FACE_LOGO" */ },
          });
          await s3.putObject({ Bucket: BUCKET_NAME, Body: Buffer.from(imgBase64, "base64"), Key: icon.id, ContentEncoding: "base64", ContentType: "image/png" }).promise();
          return icon;
        })
      );
      console.log("FACELOGO_ROUTER: [10] Processing complete, returning image URLs to client.");
      return createdIcons.map((icon) => ({ imageUrl: `https://${BUCKET_NAME}.s3.${awsRegionToUse}.amazonaws.com/${icon.id}` }));
    }),
});