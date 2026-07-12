import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  FaMagic,
  FaBolt,
  FaImages,
  FaLayerGroup,
  FaPaintBrush,
  FaQuestionCircle,
  FaChevronRight,
} from "react-icons/fa";

const TwitchPanelsLandingPage: NextPage = () => {
  const router = useRouter();

  const handleStart = () => {
    void router.push("/twitch-panels-generator");
  };

  const features = [
    {
      title: "Guided 4-Step Funnel",
      description:
        "Pick Twitch, choose a game-based template, personalize your content, and generate the final panel set in one flow.",
      icon: <FaMagic className="h-10 w-10" />,
    },
    {
      title: "Batch Panel Generation",
      description:
        "Build About, Donate, Rules, FAQ, Specs, Socials, Schedule, and other panels together instead of one by one.",
      icon: <FaImages className="h-10 w-10" />,
    },
    {
      title: "Logo, Socials, and Content",
      description:
        "Add a logo reference, social handles, supporting content, and shape selection in one guided flow.",
      icon: <FaLayerGroup className="h-10 w-10" />,
    },
    {
      title: "Game-Based Templates",
      description:
        "Choose from neon, futuristic, retro, pastel, minimal, and other panel-ready visual directions.",
      icon: <FaPaintBrush className="h-10 w-10" />,
    },
    {
      title: "AI Refinement and Regeneration",
      description:
        "Regenerate for a fresh variation or refine the result for stronger hierarchy, cleaner text, and sharper presentation.",
      icon: <FaBolt className="h-10 w-10" />,
    },
    {
      title: "Result Step Actions",
      description:
        "Preview, share, refine, and download your final panel graphics from the result step.",
      icon: <FaChevronRight className="h-10 w-10" />,
    },
  ];

  const workflowSteps = [
    {
      step: "1. Platform",
      detail: "Start with Twitch so the builder uses panel-friendly defaults and sizing.",
    },
    {
      step: "2. Template",
      detail: "Pick the visual direction you want to build from before editing any panel content.",
    },
    {
      step: "3. Personalize",
      detail: "Add titles, descriptions, socials, logo references, and multiple panel types in one set.",
    },
    {
      step: "4. Result",
      detail: "Generate the set, regenerate variations, refine the best one, and download the final PNGs.",
    },
  ];

  const examplePanels = [
    { src: "/twitch/panels/night-ops-prv.webp", caption: "Night Ops" },
    { src: "/twitch/panels/apex-squad-prv.webp", caption: "Apex Squad" },
    { src: "/twitch/panels/arcane-champion-prv.webp", caption: "Arcane Champion" },
    { src: "/twitch/panels/roblox-champion-prv.webp", caption: "Roblox Chaos" },
  ];

  const faq = [
    {
      q: "What are Twitch panels?",
      a: "Twitch panels appear below your stream and are often used for About, Donate, Rules, FAQ, Schedule, Specs, Socials, and other creator information.",
    },
    {
      q: "How does the new panel builder work?",
      a: "The updated flow uses four steps: Platform, Template, Personalize, and Result. It is designed to help you build a full panel set instead of only one isolated graphic.",
    },
    {
      q: "Do I need to upload a logo?",
      a: "No. You can generate a panel with no logo, upload a logo or character reference, or choose one of your saved designs.",
    },
    {
      q: "What panel shapes are supported?",
      a: "The generator defaults to a wide 3:1 panel because that is the most common Twitch panel layout. It also supports 4:3, 1:1, and 3:4 shapes.",
    },
    {
      q: "Can I add social handles and content?",
      a: "Yes. The new flow supports a panel title, short supporting content, and optional social handle rows with platform icons.",
    },
    {
      q: "Can I refine the generated panel?",
      a: "Yes. After generation, you can send a refinement prompt to improve the composition, emphasis, styling, and overall polish.",
    },
    {
      q: "Can I regenerate the same setup?",
      a: "Yes. The result step lets you regenerate from the same panel setup if you want another direction before downloading.",
    },
  ];

  return (
    <>
      <Head>
        <title>Twitch Panels Maker — Free AI Panel Generator | GamingLogoAI</title>
        <meta
          name="description"
          content="Create branded Twitch panels free with AI. Pick a template, add your logo, socials, and content, then generate a full panel set — no design skills needed."
        />
        <link
          rel="canonical"
          href="https://gaminglogoai.com/twitch-panels-maker"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gaminglogoai.com/twitch-panels-maker" />
        <meta property="og:title" content="Twitch Panels Maker — Free AI Panel Generator | GamingLogoAI" />
        <meta property="og:description" content="Create branded Twitch panels free with AI. Pick a template, add your logo, socials, and content, then generate a full panel set — no design skills needed." />
        <meta property="og:image" content="https://gaminglogoai.com/og-image-gaminglogoai.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="GamingLogoAI" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Twitch Panels Maker — Free AI Panel Generator | GamingLogoAI" />
        <meta name="twitter:description" content="Create branded Twitch panels free with AI. Pick a template, add your logo, socials, and content, then generate a full panel set — no design skills needed." />
        <meta name="twitter:image" content="https://gaminglogoai.com/og-image-gaminglogoai.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "AI Twitch Panels Maker",
              description:
                "Create branded Twitch panels free with AI. Pick a template, add your logo, socials, and content, then generate a full panel set — no design skills needed.",
              url: "https://gaminglogoai.com/twitch-panels-maker",
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
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-950/90 to-slate-900" />

          <div className="relative z-20 mx-auto max-w-3xl px-4">
            <h1 className="mb-6 text-4xl font-extrabold md:text-6xl">
              AI <span className="text-purple-400">Twitch Panels Maker</span>
            </h1>
            <p className="mb-10 text-lg text-slate-200 md:text-xl">
              Build full Twitch panel sets with a guided flow: choose a platform,
              pick a template, personalize titles and socials, then generate
              <strong> About</strong>, <strong>Donate</strong>, <strong>Rules</strong>,
              and more together.
            </p>

            <button
              onClick={handleStart}
              className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105"
            >
              Start Creating Panels <FaChevronRight className="ml-2 inline" />
            </button>
          </div>
        </section>

        <section className="bg-white py-16 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              Why Streamers Use Our{" "}
              <span className="text-purple-600">Twitch Panels Generator</span>
            </h2>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-lg dark:border-slate-700/50 dark:bg-slate-800/60"
                >
                  <div className="mr-5 text-purple-600">{feature.icon}</div>
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
              How The New Panels Flow Works
            </h2>

            <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-4">
              {workflowSteps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/60"
                >
                  <p className="mb-2 text-lg font-semibold text-purple-600">
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
              Twitch Panel Style Examples
            </h2>

            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
              {examplePanels.map((example) => (
                <div
                  key={example.caption}
                  className="rounded-lg bg-white p-2 shadow-lg dark:bg-slate-800"
                >
                  <Image
                    src={example.src}
                    alt={example.caption}
                    width={320}
                    height={100}
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
              <FaQuestionCircle className="mr-2 inline text-purple-600" />
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

        <section className="bg-gradient-to-tr from-indigo-900 via-purple-950 to-slate-900 py-20 text-center text-white">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Ready to Upgrade Your{" "}
            <span className="text-purple-400">Twitch Panels?</span>
          </h2>
          <button
            onClick={handleStart}
            className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 px-10 py-4 text-xl font-bold text-white shadow-xl transition-all hover:scale-105"
          >
            Create Twitch Panels Now
          </button>
        </section>
      </main>
    </>
  );
};

export default TwitchPanelsLandingPage;
