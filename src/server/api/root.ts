import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { generateRouter } from "~/server/api/routers/generate";
import { checkoutRouter } from "~/server/api/routers/checkout";
import { iconRouter } from "./routers/icons";
import { mauticRouter } from "~/server/api/routers/mautic";
import { faceLogoRouter } from "~/server/api/routers/faceLogo";
import { nanoFaceRouter } from "~/server/api/routers/nanoFace";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  generate: generateRouter,
  faceLogo: faceLogoRouter,
  checkout: checkoutRouter,
  icons: iconRouter,
  mautic: mauticRouter,
  nanoFace: nanoFaceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
