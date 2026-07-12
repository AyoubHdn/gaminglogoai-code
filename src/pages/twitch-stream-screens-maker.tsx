import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  FaBolt,
  FaChevronRight,
  FaClock,
  FaImages,
  FaPaintBrush,
  FaQuestionCircle,
  FaTv,
} from "react-icons/fa";

const TwitchStreamScreensLandingPage: NextPage = () => {
  const router = useRouter();

  const handleStart = () => {
    void router.push("/twitch-stream-screens-generator");
  };

  const features = [
    {
      title: "Guided 4-Step Flow",
      description:
        "Choose a platform, pick a template, personalize the whole set, and generate your stream screens together.",
      icon: <FaTv className="h-10 w-10" />,
    },
    {
      title: "Expanded Screen Types",
      description:
        "Create Starting Soon, BRB, Offline, Ending, Intermission, Countdown, Chatting, AFK, Schedule, Raid, and custom Other screens.",
      icon: <FaImages className="h-10 w-10" />,
    },
    {
      title: "Add More Than Four Screens",
      description:
        "Build a full screen pack with extra scenes, duplicate scene types, and custom additions inside one batch.",
      icon: <FaClock className="h-10 w-10" />,
    },
    {
      title: "Game-Based Templates",
      description:
        "Start from neon, cyberpunk, pastel, retro, and other presets shaped around the game and stream vibe you choose.",
      icon: <FaPaintBrush className="h-10 w-10" />,
    },
    {
      title: "Adaptive AI Prompting",
      description:
        "Each selected screen type gets its own prompt behavior so the AI treats Starting Soon, Schedule, Raid, and custom scenes differently.",
      icon: <FaBolt className="h-10 w-10" />,
    },
    {
      title: "Result Step Actions",
      description:
        "Generate the set, preview it, share it, regenerate variations, and download the final PNG screens.",
      icon: <FaChevronRight className="h-10 w-10" />,
    },
  ];

  const workflowSteps = [
    {
      step: "1. Platform",
      detail: "Start with Twitch so the builder uses stream-screen-friendly defaults and sizing.",
    },
    {
      step: "2. Template",
      detail: "Choose a visual direction based on the game or style you want your stream scenes to follow.",
    },
    {
      step: "3. Personalize",
      detail: "Edit titles, subtitles, and screen types, then add extra scenes like Schedule, Raid, or Other.",
    },
    {
      step: "4. Result",
      detail: "Generate the full set together, then regenerate, share, refine, or download the final screens.",
    },
  ];

  const exampleScreens = [
    { src: "/twitch/screens/starting-soon-prv.webp", caption: "Starting Soon" },
    { src: "/twitch/screens/brb-prv.webp", caption: "BRB" },
    { src: "/twitch/screens/offline-prv.webp", caption: "Offline" },
    { src: "/twitch/screens/ending-prv.webp", caption: "Ending" },
  ];

  const faq = [
    {
      q: "What are Twitch stream screens?",
      a: "They are full-screen graphics shown while you are getting ready, stepping away, wrapping up, or temporarily offline during a livestream.",
    },
    {
      q: "Does the new builder only support four screen types?",
      a: "No. The updated flow supports the standard core screens plus Intermission, Countdown, Chatting, AFK, Schedule, Raid, and a custom Other scene.",
    },
    {
      q: "Do these work in OBS and Twitch?",
      a: "Yes. The generator is built around a 1920x1080 stream-screen canvas, which fits common OBS scene setups and fullscreen use.",
    },
    {
      q: "Can I change the screen text?",
      a: "Yes. You can start with presets like Starting Soon or BRB, then edit the title and subtitle before generating the full set.",
    },
    {
      q: "Can I add extra or custom screens?",
      a: "Yes. The personalize step supports adding more screens, including custom Other scenes, so you are not limited to the original starter set.",
    },
    {
      q: "Can I regenerate if I want another version?",
      a: "Yes. Once you reach the result step, you can regenerate the same screen setup to get a fresh variation.",
    },
  ];

  return (
    <>
      <Head>
        <title>Twitch Stream Screens Maker — Free AI Screens | GamingLogoAI</title>
        <meta
          name="description"
          content="Create Twitch stream screens free with AI. Make Starting Soon, BRB, Offline, and Ending screens in 1920x1080 — guided presets, no design skills needed."
        />
        <link
          rel="canonical"
          href="https://gaminglogoai.com/twitch-stream-screens-maker"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://gaminglogoai.com/twitch-stream-screens-maker"
        />
        <meta
          property="og:title"
          content="Twitch Stream Screens Maker — Free AI Screens | GamingLogoAI"
        />
        <meta
          property="og:description"
          content="Create Twitch stream screens free with AI. Make Starting Soon, BRB, Offline, and Ending screens in 1920x1080 — guided presets, no design skills needed."
        />
        <meta
          property="og:image"
          content="https://gaminglogoai.com/og-image-gaminglogoai.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="GamingLogoAI" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Twitch Stream Screens Maker — Free AI Screens | GamingLogoAI"
        />
        <meta
          name="twitter:description"
          content="Create Twitch stream screens free with AI. Make Starting Soon, BRB, Offline, and Ending screens in 1920x1080 — guided presets, no design skills needed."
        />
        <meta
          name="twitter:image"
          content="https://gaminglogoai.com/og-image-gaminglogoai.png"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "AI Twitch Stream Screens Maker",
              description:
                "Create Twitch stream screens free with AI. Make Starting Soon, BRB, Offline, and Ending screens in 1920x1080 — guided presets, no design skills needed.",
              url: "https://gaminglogoai.com/twitch-stream-screens-maker",
              applicationCategory: "DesignApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                description:
                  "Free to start with 1 credit on signup. Credit packs available.",
              },
              publisher: {
                "@type": "Organization",
                name: "GamingLogoAI",
                url: "https://gaminglogoai.com",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faq.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.a,
                },
              })),
            }),
          }}
        />
      </Head>

      <main className="bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-200">
        <section className="relative overflow-hidden py-20 text-center text-white md:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-900/90" />

          <div className="relative z-20 mx-auto max-w-3xl px-4">
            <h1 className="mb-6 text-4xl font-extrabold md:text-6xl">
              AI <span className="text-cyan-300">Twitch Stream Screens Maker</span>
            </h1>
            <p className="mb-10 text-lg text-slate-200 md:text-xl">
              Create full Twitch scene packs with a guided flow: choose a platform,
              pick a template, personalize every screen, then generate
              <strong> Starting Soon</strong>, <strong>BRB</strong>, <strong>Schedule</strong>,
              <strong> Raid</strong>, custom scenes, and more.
            </p>

            <button
              onClick={handleStart}
              className="rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-4 text-lg font-bold text-slate-950 shadow-lg transition-all hover:scale-105"
            >
              Start Creating Screens <FaChevronRight className="ml-2 inline" />
            </button>
          </div>
        </section>

        <section className="bg-white py-16 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              Why Streamers Use Our{" "}
              <span className="text-cyan-500">Stream Screens Generator</span>
            </h2>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-lg dark:border-slate-700/50 dark:bg-slate-800/60"
                >
                  <div className="mr-5 text-cyan-500">{feature.icon}</div>
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
              How The New Stream Screens Flow Works
            </h2>

            <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-4">
              {workflowSteps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/60"
                >
                  <p className="mb-2 text-lg font-semibold text-cyan-500">
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
              Twitch Stream Screen Style Examples
            </h2>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {exampleScreens.map((example) => (
                <div
                  key={example.caption}
                  className="rounded-lg bg-white p-2 shadow-lg dark:bg-slate-800"
                >
                  <Image
                    src={example.src}
                    alt={example.caption}
                    width={640}
                    height={360}
                    className="rounded"
                    unoptimized
                  />
                  <p className="mt-2 text-center text-sm font-medium">
                    {example.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 dark:bg-slate-900">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="mb-8 text-center text-3xl font-bold">
              <FaQuestionCircle className="mr-2 inline text-cyan-500" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faq.map((item, index) => (
                <details
                  key={item.q}
                  className="cursor-pointer rounded-lg border bg-slate-50 p-4 dark:bg-slate-800"
                  open={index === 0}
                >
                  <summary className="text-lg font-semibold">{item.q}</summary>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-tr from-slate-950 via-indigo-950 to-cyan-950 py-20 text-center text-white">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Ready to Upgrade Your{" "}
            <span className="text-cyan-300">Twitch Stream Scenes?</span>
          </h2>
          <button
            onClick={handleStart}
            className="rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-10 py-4 text-xl font-bold text-slate-950 shadow-xl transition-all hover:scale-105"
          >
            Create Stream Screens Now
          </button>
        </section>
      </main>
    </>
  );
};

export default TwitchStreamScreensLandingPage;
