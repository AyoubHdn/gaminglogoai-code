// ~/server/api/routers/s3.ts
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import AWS from "aws-sdk";
import { env } from "~/env.mjs";
import { v4 as uuid } from "uuid";

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
  region: env.NEXT_PUBLIC_AWS_REGION_GAMING,
});

export const s3Router = createTRPCRouter({
  createUploadUrl: protectedProcedure
    .input(
      z.object({
        tool: z.enum(["faces", "text", "banners", "twitch", "pfp"]),
        extension: z.string().default("png"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { tool, extension } = input;
      const userId = ctx.session.user.id;

      const key = `user-uploads/${tool}/${userId}/${uuid()}.${extension}`;

      const uploadUrl = await s3.getSignedUrlPromise("putObject", {
        Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_GAMING,
        Key: key,
        ContentType: extension === "png" ? "image/png" : "image/jpeg",
        Expires: 300,
      });

      return {
        uploadUrl,
        fileUrl: `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_GAMING}.s3.${env.NEXT_PUBLIC_AWS_REGION_GAMING}.amazonaws.com/${key}`,
      };
    }),
});
