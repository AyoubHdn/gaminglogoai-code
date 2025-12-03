/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// ~/server/api/routers/s3.ts

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import AWS from "aws-sdk";
import { env } from "~/env.mjs";
import { v4 as uuidv4 } from "uuid";

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
  region: env.NEXT_PUBLIC_AWS_REGION_GAMING,
});

const BUCKET = env.NEXT_PUBLIC_S3_BUCKET_NAME_GAMING;

export const s3Router = createTRPCRouter({
  createUploadUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        filetype: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const extension = input.filename.split(".").pop() || "png";

      const key = `user-uploads/twitch/${ctx.session.user.id}/${uuidv4()}.${extension}`;

      const presignedPost = await s3.createPresignedPost({
        Bucket: BUCKET,
        Fields: {
          key,
          "Content-Type": input.filetype,
          acl: "public-read"
        },
        Conditions: [
          { acl: "public-read" },
          ["starts-with", "$Content-Type", ""],
          ["content-length-range", 0, 10 * 1024 * 1024],
        ],
        Expires: 60,
      });

      return {
        url: presignedPost.url,
        fields: presignedPost.fields,
        publicUrl: `https://${BUCKET}.s3.${env.NEXT_PUBLIC_AWS_REGION_GAMING}.amazonaws.com/${key}`,
      };
    }),
});
