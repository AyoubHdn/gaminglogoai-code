// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gaminglogoai-images.s3.us-east-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  async redirects() {
    return [
      {
        source: '/face-logo-generator', // The OLD path
        destination: '/pfp-maker', // The NEW path
        permanent: true, // This signifies a 301 redirect
      },
      {
        source: '/fortnite-logos',
        destination: '/logo/games/fortnite-logo-maker',
        permanent: true, // This sets the status code to 301
      },
      {
        source: '/minecraft-logos',
        destination: '/logo/games/minecraft-logo-maker',
        permanent: true,
      },
      {
        source: '/fortnite-pfp-maker',
        destination: '/pfp/games/fortnite-pfp-maker',
        permanent: true, // This sets the status code to 301
      },
      {
        source: '/minecraft-pfp-maker',
        destination: '/pfp/games/minecraft-pfp-maker',
        permanent: true,
      },
    ];
  },
};

export default config;