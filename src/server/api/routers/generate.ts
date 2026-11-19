// ~/server/api/routers/generate.ts

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";
import { LOGO_MODEL_CREDITS } from "~/lib/generationPricing";
import { syncUserToMautic } from "~/server/api/routers/mautic-utils";
import { shouldWatermarkPurchaseStatus } from "~/server/imageWatermark";
import { createRequestGenerationDbService } from "~/server/generation/requestService";
import { createRequestGenerationExecutor } from "~/server/generation/requestExecutor";
import { runLogoGeneration } from "~/server/generation/runLogo";
import {
  GenerationError,
  type GenerationDbService,
  type GenerationExecutor,
  type GenerationIcon,
  type GenerationReservation,
  type LogoRequest,
} from "~/server/generation/contract";
import { withCreditTransaction } from "~/server/lib/creditTransaction";

const BUCKET_NAME = env.NEXT_PUBLIC_S3_BUCKET_NAME_GAMING; // Replace with your S3 bucket name

export type GenerateRouterDependencies = {
  createGenerationDbService?: () => Promise<GenerationDbService | null>;
  createGenerationExecutor?: () => Promise<GenerationExecutor>;
  generate?: (input: LogoRequest) => Promise<string[]>;
  upload?: (
    icon: GenerationIcon,
    base64: string,
    shouldWatermark: boolean,
  ) => Promise<void>;
  syncUserToMautic?: typeof syncUserToMautic;
};

function createSyncDependency(
  sync: typeof syncUserToMautic,
): (reservation: GenerationReservation) => Promise<void> {
  return async (reservation) => {
    if (
      env.AUTH_EXTERNAL_SYNC_MODE === "disabled" ||
      !reservation.email
    )
      return;
    await sync(
      {
        email: reservation.email,
        name: reservation.name,
        brand_specific_credits: reservation.credits,
      },
      "gaminglogoai",
    );
  };
}

export function createGenerateRouter(
  overrides: GenerateRouterDependencies = {},
) {
  const createGenerationDbService =
    overrides.createGenerationDbService ?? createRequestGenerationDbService;
  const createGenerationExecutor =
    overrides.createGenerationExecutor ??
    (overrides.generate || overrides.upload
      ? async () => {
          const { createNodeGenerationExecutor } = await import(
            "~/server/generation/nodeExecutor"
          );
          return createNodeGenerationExecutor({
            generate: overrides.generate,
            upload: overrides.upload,
          });
        }
      : createRequestGenerationExecutor);
  const sync = createSyncDependency(
    overrides.syncUserToMautic ?? syncUserToMautic,
  );

  return createTRPCRouter({
  generateIcon: protectedProcedure
    .input(
      z.object({
        requestId: z.string().uuid().optional(),
        prompt: z.string(),
        numberOfImages: z.number().min(1).max(10),
        aspectRatio: z.string().optional(),
        model: z.enum(["flux-schnell", "flux-dev"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const generationService = await createGenerationDbService();
      if (generationService) {
        if (!input.requestId)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "A generation request ID is required",
          });
        // Resolve the trusted executor before reserving credits. A missing or
        // unavailable Worker binding therefore has zero ledger side effects.
        const generationExecutor = await createGenerationExecutor();
        try {
          const completed = await runLogoGeneration(
            {
              userId: ctx.session.user.id,
              requestId: input.requestId,
              prompt: input.prompt,
              numberOfImages: input.numberOfImages,
              model: input.model,
              aspectRatio: input.aspectRatio ?? "1:1",
            },
            {
              service: generationService,
              executor: generationExecutor,
              sync,
            },
          );
          return completed.icons.map((icon) => ({
            imageUrl: `https://${BUCKET_NAME}.s3.${env.NEXT_PUBLIC_AWS_REGION_GAMING}.amazonaws.com/${icon.id}`,
            watermarked: completed.shouldWatermark,
          }));
        } catch (error) {
          if (error instanceof GenerationError) {
            throw new TRPCError({
              code:
                error.code === "GENERATION_BAD_INPUT" ||
                error.code === "GENERATION_INSUFFICIENT_CREDITS"
                  ? "BAD_REQUEST"
                  : "CONFLICT",
              message:
                error.code === "GENERATION_INSUFFICIENT_CREDITS"
                  ? "Not enough gaming credits"
                  : error.code,
            });
          }
          throw error;
        }
      }
      // Legacy Vercel remains the default until the new migration/backend is explicitly enabled.
      // Define credit costs
      const modelConfig = {
        credits: LOGO_MODEL_CREDITS[input.model],
      };

      if (!modelConfig) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid model selected",
        });
      }

      // Calculate total credits needed
      const totalCredits = modelConfig.credits * input.numberOfImages;

      return withCreditTransaction(
        ctx.session.user.id,
        totalCredits,
        async () => {
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
          const shouldWatermark = shouldWatermarkPurchaseStatus(
            updatedUser.hasPurchasedCredits,
          );

          // Update Mautic contact
          try {
            await syncUserToMautic(
              {
                email: updatedUser.email,
                name: updatedUser.name,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                brand_specific_credits: updatedUser.gamingCredits,
              },
              "gaminglogoai",
            );
            console.log("Mautic contact updated after credit deduction.");
          } catch (err) {
            console.error("Error updating Mautic after credit deduction:", err);
          }

          const { generateNodeImages, uploadNodeImage } = await import(
            "~/server/generation/nodeExecutor"
          );
          const generate = overrides.generate ?? generateNodeImages;
          const upload = overrides.upload ?? uploadNodeImage;
          const legacyRequest: LogoRequest = {
            userId: ctx.session.user.id,
            requestId: input.requestId ?? "legacy",
            prompt: input.prompt,
            numberOfImages: input.numberOfImages,
            aspectRatio: input.aspectRatio ?? "1:1",
            model: input.model,
          };
          const b64Images = await generate(legacyRequest);

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
                await upload(icon, image, shouldWatermark);
              } catch (s3Error) {
                console.error("S3 Upload Error:", s3Error);
                throw new TRPCError({
                  code: "INTERNAL_SERVER_ERROR",
                  message: "Failed to upload image to S3",
                });
              }

              return icon;
            }),
          );

          // Return the URLs
          return createdIcons.map((icon) => ({
            imageUrl: `https://${BUCKET_NAME}.s3.us-east-1.amazonaws.com/${icon.id}`,
            watermarked: shouldWatermark,
          }));
        },
      );
    }),
  });
}

export const generateRouter = createGenerateRouter();


