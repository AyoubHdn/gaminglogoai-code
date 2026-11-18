import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/user";
import { iconRouter } from "./routers/icons";

/** Explicit staging profile: unsupported tRPC routes return NOT_FOUND. */
export const readAppRouter = createTRPCRouter({
  user: userRouter,
  icons: iconRouter,
});
