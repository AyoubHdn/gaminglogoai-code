/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION_GAMING,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID as string,
    secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
  },
});

export const s3Router = createTRPCRouter({
  createPresignedUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        filetype: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      if (!process.env.S3_BUCKET_NAME) {
        throw new Error("S3_BUCKET_NAME is not configured.");
      }

      // Generate unique key
      const fileKey = `uploads/${Date.now()}-${input.filename.replace(/\s+/g, "_")}`;

      // Configure upload settings
      const presigned = await createPresignedPost(s3, {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
        Conditions: [
          ["content-length-range", 0, 15 * 1024 * 1024], // Limit to 15MB
          ["starts-with", "$Content-Type", ""],
        ],
        Fields: {
          "Content-Type": input.filetype,
        },
        Expires: 300, // 5 minutes
      });

      const publicUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION_GAMING}.amazonaws.com/${fileKey}`;

      return {
        url: presigned.url,
        fields: presigned.fields,
        publicUrl,
      };
    }),
});
