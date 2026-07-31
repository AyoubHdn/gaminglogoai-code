import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { shouldWatermarkPurchaseStatus } from "~/server/imageWatermark";

export const userRouter = createTRPCRouter({
  getCredits: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user?.gamingCredits;
  }),
  getWatermarkStatus: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        hasPurchasedCredits: true,
      },
    });

    return {
      watermarked: shouldWatermarkPurchaseStatus(user?.hasPurchasedCredits),
    };
  }),
});
