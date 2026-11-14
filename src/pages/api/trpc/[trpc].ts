import { createNextApiHandler } from "@trpc/server/adapters/next";
import type { NextApiRequest, NextApiResponse } from "next";

import { env } from "~/env.mjs";
import { createTRPCContext } from "~/server/api/trpc";

// export API handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const readOnly = process.env.CLOUDFLARE_READ_ONLY_MODE ?? "false";
  if (readOnly !== "true" && readOnly !== "false") {
    throw new Error("Unsupported CLOUDFLARE_READ_ONLY_MODE");
  }
  if (readOnly === "true" && process.env.DB_READS_BACKEND !== "service") {
    throw new Error("Read-only Worker profile requires service reads");
  }
  // The read-only staging profile never loads the native generation routers.
  const router =
    readOnly === "true"
      ? (await import("~/server/api/readRoot")).readAppRouter
      : (await import("~/server/api/root")).appRouter;
  return createNextApiHandler({
    router,
    createContext: createTRPCContext,
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : undefined,
  })(req, res);
}
