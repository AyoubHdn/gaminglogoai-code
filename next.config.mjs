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
    domains: [
      "gaminglogoai-images.s3.us-east-1.amazonaws.com",
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
          source: '/(.*)',
          has: [{ type: 'host', value: 'www.gaminglogoai.com' }],
          destination: 'https://gaminglogoai.com/:1',
          permanent: true, // 👈 this makes it 301
        },
        {
          source: '/face-logo-generator', // The OLD path
          destination: '/pfp-maker', // The NEW path
          permanent: true, // This signifies a 301 redirect
        },
       // Add any other redirects you need here
       // For example, if you also had a landing page for face-logo that's changing:
       // {
       //   source: '/old-face-logo-landing-page-url',
       //   destination: '/ai-profile-picture-maker', // New landing page URL
       //   permanent: true,
       // },
     ];
   },
};

export default config;