// ~/server/api/routers/generate.ts

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import fetch from "node-fetch";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import Replicate from "replicate";
import { env } from "~/env.mjs";
import { b64Image } from "~/data/b64Image";
import AWS from "aws-sdk";
import { syncUserToMautic } from "~/server/api/routers/mautic-utils";
import { buffer as readStreamIntoBuffer } from "stream/consumers";
import { Readable } from "stream";

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
  region: env.AWS_REGION_GAMING,
});

const BUCKET_NAME = env.S3_BUCKET_NAME_GAMING; // Replace with your S3 bucket name

const replicate = new Replicate({
  auth: env.REPLICATE_API_TOKEN,
});

// Helper function to fetch an image from a URL and encode it as Base64
async function fetchAndEncodeImage(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to fetch image from ${url}`,
    });
  }
  const buf = await response.buffer();
  return buf.toString("base64");
}


// Generate the image and encode it as Base64
const generateIcon = async (
  prompt: string,
  numberOfImages = 1,
  aspectRatio = "1:1",
  model = "flux-schnell"
): Promise<string[]> => {
  let path: `${string}/${string}`;
  let input: Record<string, any>;
  let outputs: string[] = [];

  // Model-specific settings
  if (model === "flux-schnell") {
    path = "black-forest-labs/flux-schnell";
    input = {
      prompt,
      go_fast: true,
      megapixels: "1",
      num_outputs: numberOfImages,
      aspect_ratio: aspectRatio,
      output_format: "webp",
      output_quality: 80,
      num_inference_steps: 4,
    };
  } else if (model === "flux-dev") {
    path = "black-forest-labs/flux-dev";
    input = {
      prompt,
      go_fast: true,
      megapixels: "1",
      num_outputs: numberOfImages,
      aspect_ratio: aspectRatio,
      output_format: "webp",
      output_quality: 80,
      num_inference_steps: 28,
    };
  } else {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid model selected",
    });
  }

  // Mock mode for testing
  if (env.MOCK_REPLICATE === "true") {
    return Array(numberOfImages).fill(b64Image) as string[];
  }

    // For flux models, we expect an array of URLs
    const output = (await replicate.run(path, { input })) as string[];
    if (!Array.isArray(output) || output.length === 0) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate image URLs",
      });
    }
    // Convert each URL to base64
    outputs = await Promise.all(output.map(fetchAndEncodeImage));
  

  return outputs;
};

export const generateRouter = createTRPCRouter({
  generateIcon: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        numberOfImages: z.number().min(1).max(10),
        aspectRatio: z.string().optional(),
        model: z.enum([
          "flux-schnell",
          "flux-dev",
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Define credit costs
      const modelConfig = {
        "flux-schnell": { credits: 1 },
        "flux-dev": { credits: 4 },
      }[input.model];

      if (!modelConfig) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid model selected",
        });
      }

      // Calculate total credits needed
      const totalCredits =
        modelConfig.credits *
        input.numberOfImages;

      // Deduct credits
      const { count } = await ctx.prisma.user.updateMany({
        where: {
          id: ctx.session.user.id,
          gamingCredits: { gte: totalCredits },
        },
        data: {
          gamingCredits: { decrement: totalCredits },
        },
      });

      if (count <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You do not have enough credits",
        });
      }

      // Fetch updated user data
      const updatedUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });
      if (!updatedUser || !updatedUser.email) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found after credit update",
        });
      }

      // Update Mautic contact
      try {
        await syncUserToMautic({
          email: updatedUser.email,
          name: updatedUser.name,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          brand_specific_credits: updatedUser.gamingCredits,
        },'gaminglogoai');
        console.log("Mautic contact updated after credit deduction.");
      } catch (err) {
        console.error("Error updating Mautic after credit deduction:", err);
      }

      // Generate images
      const b64Images: string[] = await generateIcon(
        input.prompt,
        input.numberOfImages,
        input.aspectRatio,
        input.model
      );

      // Store images in DB & upload to S3
      const createdIcons = await Promise.all(
        b64Images.map(async (image: string) => {
          const icon = await ctx.prisma.icon.create({
            data: {
              prompt: input.prompt,
              userId: ctx.session.user.id,
            },
          });

          try {
            await s3
              .putObject({
                Bucket: BUCKET_NAME,
                Body: Buffer.from(image, "base64"),
                Key: icon.id,
                ContentEncoding: "base64",
                ContentType:"image/webp",
              })
              .promise();
          } catch (s3Error) {
            console.error("S3 Upload Error:", s3Error);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to upload image to S3",
            });
          }

          return icon;
        })
      );

      // Return the URLs
      return createdIcons.map((icon) => ({
        imageUrl: `https://${BUCKET_NAME}.s3.us-east-1.amazonaws.com/${icon.id}`,
      }));
    }),
});
