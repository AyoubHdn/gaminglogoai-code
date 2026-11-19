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
  // Profiles are selected only from trusted server configuration. The legacy
  // Vercel path remains the default; service-backed profiles expose only the
  // routers whose dependencies are safe for that runtime.
  const generationBackend = process.env.DB_GENERATION_BACKEND ?? "legacy";
  const router =
    readOnly === "true"
      ? (await import("~/server/api/readRoot")).readAppRouter
      : generationBackend === "service"
        ? (await import("~/server/api/generationRoot")).generationAppRouter
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

