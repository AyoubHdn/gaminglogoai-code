import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const iconRouter = createTRPCRouter({
  getIcons: protectedProcedure.query(({ ctx }) => {
    return ctx.dbService.getSavedIcons(ctx.session.user.id);
  }),

  getEmoteBases: protectedProcedure.query(({ ctx }) => {
    return ctx.dbService.getEmoteBases(ctx.session.user.id);
  }),

  getCommunityIcons: publicProcedure.query(({ ctx }) => {
    return ctx.dbService.getCommunityIcons(50);
  }),
});
