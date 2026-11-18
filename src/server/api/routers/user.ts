import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { shouldWatermarkPurchaseStatus } from "~/server/watermarkPolicy";

export const userRouter = createTRPCRouter({
  getCredits: protectedProcedure.query(async ({ ctx }) => {
    return ctx.dbService.getCredits(ctx.session.user.id);
  }),

  getWatermarkStatus: protectedProcedure.query(async ({ ctx }) => {
    const hasPurchasedCredits = await ctx.dbService.getHasPurchasedCredits(
      ctx.session.user.id,
    );

    return {
      watermarked: shouldWatermarkPurchaseStatus(hasPurchasedCredits),
    };
  }),
});
