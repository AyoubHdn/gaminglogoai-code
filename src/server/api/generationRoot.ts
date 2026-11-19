import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/user";
import { iconRouter } from "./routers/icons";
import { generateRouter } from "./routers/generate";

/**
 * Worker-safe generation profile.
 *
 * Only procedures whose dependencies are service-backed and whose module graph
 * does not eagerly load native rendering are exposed here. Unmigrated routers
 * remain absent and therefore fail closed with NOT_FOUND.
 */
export const generationAppRouter = createTRPCRouter({
  user: userRouter,
  icons: iconRouter,
  generate: generateRouter,
});

export type GenerationAppRouter = typeof generationAppRouter;

