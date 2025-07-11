import { z } from "zod";

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const server = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXTAUTH_SECRET:
    process.env.NODE_ENV === "production"
      ? z.string().min(1)
      : z.string().min(1).optional(),
  NEXTAUTH_URL: z.preprocess(
    // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
    // Since NextAuth.js automatically uses the VERCEL_URL if present.
    (str) => process.env.VERCEL_URL ?? str,
    // VERCEL_URL doesn't include `https` so it cant be validated as a URL
    process.env.VERCEL ? z.string().min(1) : z.string().url(),
  ),
  // Add `.min(1) on ID and SECRET if you want to make sure they're not empty
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  REPLICATE_API_TOKEN: z.string(),
  MOCK_REPLICATE: z.string(),
  SECRET_ACCESS_KEY: z.string(),
  ACCESS_KEY_ID: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  HOST_NAME: z.string(),
  STRIPE_WEB_HOOK_SECRET: z.string(),
  PRICE_ID_STARTER: z.string(),
  PRICE_ID_PRO: z.string(),
  PRICE_ID_ELITE: z.string(),
  MAUTIC_BASE_URL: z.string(),
  MAUTIC_USERNAME: z.string(),
  MAUTIC_PASSWORD: z.string(),
  CRON_SECRET: z.string(),
  
});

/**
 * Specify your client-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const client = z.object({
  // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
  NEXT_PUBLIC_STRIPE_KEY: z.string(),
  NEXT_PUBLIC_AWS_REGION_GAMING: z.string(),
  NEXT_PUBLIC_S3_BUCKET_NAME_GAMING: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side so we need to destruct manually.
 *
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
  MOCK_REPLICATE: process.env.MOCK_REPLICATE,
  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
  ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
  NEXT_PUBLIC_STRIPE_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  HOST_NAME: process.env.HOST_NAME,
  STRIPE_WEB_HOOK_SECRET: process.env.STRIPE_WEB_HOOK_SECRET,
  PRICE_ID_STARTER: process.env.PRICE_ID_STARTER,
  PRICE_ID_PRO: process.env.PRICE_ID_PRO,
  PRICE_ID_ELITE: process.env.PRICE_ID_ELITE,
  MAUTIC_BASE_URL: process.env.MAUTIC_BASE_URL,
  MAUTIC_USERNAME: process.env.MAUTIC_USERNAME,
  MAUTIC_PASSWORD: process.env.MAUTIC_PASSWORD,
  CRON_SECRET: process.env.CRON_SECRET,
  NEXT_PUBLIC_AWS_REGION_GAMING: process.env.NEXT_PUBLIC_AWS_REGION_GAMING,
  NEXT_PUBLIC_S3_BUCKET_NAME_GAMING: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_GAMING,
  // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
};

// Don't touch the part below
// --------------------------

const merged = server.merge(client);

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ (process.env);

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = typeof window === "undefined";

  const parsed = /** @type {MergedSafeParseReturn} */ (
    isServer
      ? merged.safeParse(processEnv) // on server we can validate all env vars
      : client.safeParse(processEnv) // on client we can only validate the ones that are exposed
  );

  if (parsed.success === false) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment variables");
  }

  env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== "string") return undefined;
      // Throw a descriptive error if a server-side env var is accessed on the client
      // Otherwise it would just be returning `undefined` and be annoying to debug
      if (!isServer && !prop.startsWith("NEXT_PUBLIC_"))
        throw new Error(
          process.env.NODE_ENV === "production"
            ? "❌ Attempted to access a server-side environment variable on the client"
            : `❌ Attempted to access server-side environment variable '${prop}' on the client`,
        );
      return target[/** @type {keyof typeof target} */ (prop)];
    },
  });
}

export { env };
