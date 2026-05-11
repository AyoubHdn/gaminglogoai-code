// src/pages/twitch-banner-maker.tsx
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  FaBolt,
  FaCogs,
  FaChevronRight,
  FaImages,
  FaMagic,
  FaPaintBrush,
  FaQuestionCircle,
  FaUsers,
} from "react-icons/fa";

const TwitchBannerLandingPage: NextPage = () => {
  const router = useRouter();

  const handleStart = () => {
    void router.push("/twitch-banner-generator");
  };

  const features = [
    {
      title: "Guided 4-Step Funnel",
      description:
        "Choose a platform, pick a template, personalize the banner, and generate the result in one flow.",
      icon: <FaMagic className="h-10 w-10" />,
    },
    {
      title: "Platform-Ready Banner Sizes",
      description:
        "The banner builder supports Twitch and other platforms while keeping output aligned with each destination.",
      icon: <FaImages className="h-10 w-10" />,
    },
    {
      title: "Template First, Then Personalize",
      description:
        "Start from a visual preset, then add your name, tagline, logo, and branding details in the personalize step.",
      icon: <FaCogs className="h-10 w-10" />,
    },
    {
      title: "Logo and Brand Support",
      description:
        "Upload your logo or mascot reference to build a cleaner banner that matches your channel identity.",
      icon: <FaUsers className="h-10 w-10" />,
    },
    {
      title: "Multiple Visual Directions",
      description:
        "Choose from clean, neon, bold, esports, gradient, minimalist, and other stream-ready banner templates.",
      icon: <FaPaintBrush className="h-10 w-10" />,
    },
    {
      title: "Generate, Refine, Download",
      description:
        "Use the result step to generate a variation, refine the banner, and download the final export.",
      icon: <FaBolt className="h-10 w-10" />,
    },
  ];

  const workflowSteps = [
    {
      step: "1. Platform",
      detail: "Start by choosing the destination so the banner generator uses the right layout and output behavior.",
    },
    {
      step: "2. Template",
      detail: "Choose the visual direction you want to build from before editing your content.",
    },
    {
      step: "3. Personalize",
      detail: "Add your name, tagline, logo, and other branding details in the guided editor.",
    },
    {
      step: "4. Result",
      detail: "Generate the final banner, refine it, and download the version you want to use.",
    },
  ];

  const exampleShowcase = [
    { src: "/twitch/banner/cod-prv.webp", caption: "Call of Duty Night Ops" },
    { src: "/twitch/banner/minecraft-prv.webp", caption: "Minecraft Pixel Realms" },
    { src: "/twitch/banner/cyberpunk-prv.webp", caption: "Cyberpunk Neon Grid" },
    { src: "/twitch/banner/fortnite-prv.webp", caption: "Fortnite Neon Rush" },
  ];

  const faq = [
    {
      q: "Is this tool free to use?",
      a: "You get 1 free credit after signing in, which you can put toward your first Twitch banner or use on other tools. Twitch banner generation currently costs 10 credits, and additional credits are required to create more banners.",
    },
    {
      q: "Does the banner maker use the new guided flow?",
      a: "Yes. The updated banner builder uses four steps: Platform, Template, Personalize, and Result, matching the newer Twitch tool workflow.",
    },
    {
      q: "Can I use my own logo?",
      a: "Yes - upload your logo, ideally a 1:1 PNG with a transparent background, and the AI will integrate it into the banner layout.",
    },
    {
      q: "What size does Twitch require?",
      a: "Twitch recommends 1200 x 480 pixels. The generator is designed to produce a Twitch-ready banner while still supporting other platforms in the broader funnel.",
    },
    {
      q: "How many characters can I use for channel name and tagline?",
      a: "Each style has character limits to prevent overflow. We truncate or scale text to fit, and you will see the result before downloading.",
    },
    {
      q: "How does refine work?",
      a: "After the first generation, you can send a refine prompt from the result step to improve title readability, logo emphasis, glow, contrast, and overall polish without rebuilding the banner setup from scratch.",
    },
  ];

  return (
    <>
      <Head>
        <title>Twitch Banner Maker - Create Professional Twitch Banners with AI</title>
        <meta
          name="description"
          content="Create custom Twitch banners with a guided AI flow. Choose a template, personalize your branding, generate the banner, and refine the result."
        />
        <link rel="canonical" href="https://gaminglogoai.com/twitch-banner-maker" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gaminglogoai.com/twitch-banner-maker" />
        <meta property="og:title" content="Twitch Banner Maker - Create Professional Twitch Banners with AI" />
        <meta property="og:description" content="Create custom Twitch banners with a guided AI flow. Choose a template, personalize your branding, generate the banner, and refine the result." />
        <meta property="og:image" content="https://gaminglogoai.com/og-image-gaminglogoai.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="GamingLogoAI" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Twitch Banner Maker - Create Professional Twitch Banners with AI" />
        <meta name="twitter:description" content="Create custom Twitch banners with a guided AI flow. Choose a template, personalize your branding, generate the banner, and refine the result." />
        <meta name="twitter:image" content="https://gaminglogoai.com/og-image-gaminglogoai.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "AI Twitch Banner Maker",
              description:
                "Create custom Twitch banners with a guided AI flow. Choose a template, personalize your branding, generate the banner, and refine the result.",
              url: "https://gaminglogoai.com/twitch-banner-maker",
              applicationCategory: "DesignApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                description: "Free to start with 1 credit on signup. Credit packs available.",
              },
              publisher: {
                "@type": "Organization",
                name: "GamingLogoAI",
                url: "https://gaminglogoai.com",
              },
            }),
          }}
        />
      </Head>

      <main className="bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-200">
        <section className="relative overflow-hidden py-20 text-center text-white md:py-32">
          <Image
            src="/twitch/banner/twitch-banner-bg.webp"
            alt="Twitch banner background"
            layout="fill"
            objectFit="cover"
            className="opacity-30 dark:opacity-20"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-indigo-950/80 to-slate-900/90" />

          <div className="relative z-20 mx-auto max-w-3xl px-4">
            <h1 className="mb-6 text-4xl font-extrabold md:text-6xl">
              AI <span className="text-purple-400 dark:text-cyan-400">Twitch Banner Maker</span>
            </h1>
            <p className="mb-10 text-lg text-slate-200 md:text-xl">
              Design Twitch banners with the new guided flow: choose a platform,
              pick a template, personalize your branding, then generate and refine
              the final result.
            </p>

            <button
              onClick={handleStart}
              className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 dark:from-cyan-400 dark:to-cyan-600"
            >
              Start Designing <FaChevronRight className="ml-2 inline" />
            </button>
          </div>
        </section>

        <section className="bg-white py-16 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              Why Streamers Love Our <span className="text-purple-600 dark:text-cyan-400">Twitch Banner Maker</span>
            </h2>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-lg dark:border-slate-700/50 dark:bg-slate-800/60"
                >
                  <div className="mr-5 text-purple-600 dark:text-cyan-400">{feature.icon}</div>
                  <div>
                    <p className="mb-1 text-lg font-semibold">{feature.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-20 dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              How The New Banner Flow Works
            </h2>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-4">
              {workflowSteps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/60"
                >
                  <p className="mb-2 text-lg font-semibold text-purple-600 dark:text-cyan-400">
                    {item.step}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              Twitch Banner Style Examples
            </h2>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {exampleShowcase.map((example) => (
                <div key={example.caption} className="group relative aspect-video overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={example.src}
                    alt={example.caption}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <p className="absolute bottom-0 p-3 text-sm font-semibold text-white drop-shadow-lg">
                    {example.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 dark:bg-slate-900">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="mb-6 text-center text-3xl font-bold md:text-4xl">
              Refine Your Banner in the <span className="text-purple-600 dark:text-cyan-400">Result Step</span>
            </h2>

            <p className="mx-auto mb-12 max-w-3xl text-center text-slate-600 dark:text-slate-300">
              After generating the first version, use the refine option to sharpen the
              headline, improve logo focus, clean the spacing, and push the banner toward
              a stronger streamer-ready final result.
            </p>

            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
              <div className="overflow-hidden rounded-xl border border-slate-200 shadow-lg dark:border-slate-700">
                <div className="bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                  Initial Generation
                </div>
                <Image
                  src="/twitch/banner/enhance-before.webp"
                  alt="Twitch banner before refine prompt"
                  width={1200}
                  height={480}
                  className="w-full h-auto"
                  unoptimized
                />
              </div>

              <div className="overflow-hidden rounded-xl border border-purple-500/40 shadow-xl">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white">
                  After Refine Prompt
                </div>
                <Image
                  src="/twitch/banner/enhance-after.webp"
                  alt="Twitch banner after refine prompt"
                  width={1200}
                  height={480}
                  className="w-full h-auto"
                  unoptimized
                />
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="mx-auto mb-6 max-w-2xl text-slate-600 dark:text-slate-300">
                Refine is ideal when the layout is already close and you want better text
                treatment, cleaner contrast, improved hierarchy, or more premium esports energy.
              </p>

              <button
                onClick={handleStart}
                className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 dark:from-cyan-400 dark:to-cyan-600"
              >
                Try Banner Refine
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 dark:bg-slate-900">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="mb-8 text-center text-3xl font-bold sm:text-4xl">
              <FaQuestionCircle className="mr-2 inline-block align-middle text-purple-600 dark:text-cyan-400" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faq.map((item, idx) => (
                <details
                  key={item.q}
                  className="group cursor-pointer rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                  open={idx === 0}
                >
                  <summary className="flex list-none items-center justify-between text-lg font-semibold text-slate-800 dark:text-white">
                    <span>{item.q}</span>
                    <span className="ml-2 transform transition-transform duration-300 group-open:rotate-180">
                      <svg className="h-4 w-4 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>

                  <div className="mt-4 border-t border-slate-200 pt-3 text-sm leading-relaxed text-slate-600 dark:border-slate-700 dark:text-slate-300">
                    <p>{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-tr from-indigo-900 via-purple-950 to-slate-900 py-20 text-center text-white">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Ready to Design Your <span className="text-purple-400 dark:text-cyan-400">Twitch Banner?</span>
          </h2>
          <button
            onClick={handleStart}
            className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 px-10 py-4 text-xl font-bold text-white shadow-xl transition-all hover:scale-105 dark:from-cyan-400 dark:to-cyan-600"
          >
            Create My Banner Now
          </button>
        </section>
      </main>
    </>
  );
};

export default TwitchBannerLandingPage;
