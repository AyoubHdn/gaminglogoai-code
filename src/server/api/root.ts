import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { generateRouter } from "~/server/api/routers/generate";
import { checkoutRouter } from "~/server/api/routers/checkout";
import { iconRouter } from "./routers/icons";
import { mauticRouter } from "~/server/api/routers/mautic";
import { faceLogoRouter } from "~/server/api/routers/faceLogo";
import { nanoFaceRouter } from "~/server/api/routers/nanoFace";
import { s3Router } from "./routers/s3";
import { twitchBannerRouter } from "./routers/twitchBanner";
import { enhancementRouter } from "./routers/enhancement";
import { twitchPanelRouter } from "./routers/twitchPanel";
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
  s3: s3Router,
  twitchBanner: twitchBannerRouter,
  enhancement: enhancementRouter,
  twitchPanel: twitchPanelRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
