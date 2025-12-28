// src/pages/twitch-panels-maker.tsx
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
      title: "AI-Generated Twitch Panels",
      description:
        "Create professional Twitch panels like About, Donate, Rules, Specs, and more using AI.",
      icon: <FaMagic className="h-10 w-10" />,
    },
    {
      title: "Perfect Twitch Size",
      description:
        "Every panel is generated in the official Twitch panel size: 320×100 pixels.",
      icon: <FaImages className="h-10 w-10" />,
    },
    {
      title: "Text-Only Panels",
      description:
        "No logos or uploads needed. Just type the text you want on your panel.",
      icon: <FaLayerGroup className="h-10 w-10" />,
    },
    {
      title: "Multiple Styles",
      description:
        "Choose from Minimal, Neon, Dark, and Gradient panel styles.",
      icon: <FaPaintBrush className="h-10 w-10" />,
    },
    {
      title: "AI Enhancement",
      description:
        "Upgrade your panel with AI polish for sharper text, glow, contrast, and modern UI.",
      icon: <FaBolt className="h-10 w-10" />,
    },
    {
      title: "Instant Download",
      description:
        "Generate, preview, download, and share your panel in seconds.",
      icon: <FaChevronRight className="h-10 w-10" />,
    },
  ];

  const examplePanels = [
    { src: "/twitch/panels/blue_tech_glitch_prv.webp", caption: "Blue Tech Glitch" },
    { src: "/twitch/panels/futuristic_stream_prv.webp", caption: "Futuristic Stream" },
    { src: "/twitch/panels/neon_retro_prv.webp", caption: "Neon Retro" },
    { src: "/twitch/panels/pastel_play_prv.webp", caption: "Soft Gradient" },
  ];

  const faq = [
    {
      q: "What are Twitch panels?",
      a: "Twitch panels appear below your stream and are used for About, Donate, Rules, PC Specs, Socials, and more.",
    },
    {
      q: "Do I need to upload images or logos?",
      a: "No. Panels are text-only. Just type the text you want and choose a style.",
    },
    {
      q: "What size are the panels?",
      a: "All panels are generated at 320×100 pixels, which is the Twitch standard.",
    },
    {
      q: "Is there a free version?",
      a: "You receive free credits after signing in. Additional panels require credits.",
    },
    {
      q: "What does AI Enhancement do?",
      a: "AI Enhancement improves text sharpness, glow, contrast, and overall UI quality.",
    },
  ];

  return (
    <>
      <Head>
        <title>AI Twitch Panels Maker – About, Donate & More</title>
        <meta
          name="description"
          content="Create clean, neon, dark, and gradient Twitch panels with AI. Text-only panels in perfect 320×100 size."
        />
        <link
          rel="canonical"
          href="https://gaminglogoai.com/twitch-panels-maker"
        />
      </Head>

      <main className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        {/* HERO */}
        <section className="relative py-20 md:py-28 text-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-950/90 to-slate-900"></div>

          <div className="relative z-20 px-4 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              AI <span className="text-purple-400">Twitch Panels Maker</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-10">
              Create professional Twitch panels like <strong>About</strong>,{" "}
              <strong>Donate</strong>, <strong>Rules</strong>, and more — instantly
              with AI.
            </p>

            <button
              onClick={handleStart}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold rounded-lg text-lg hover:scale-105 transition-all shadow-lg"
            >
              Start Creating Panels <FaChevronRight className="inline ml-2" />
            </button>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Streamers Use Our{" "}
              <span className="text-purple-600">Twitch Panels Generator</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 flex"
                >
                  <div className="text-purple-600 mr-5">{f.icon}</div>
                  <div>
                    <p className="font-semibold text-lg mb-1">{f.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {f.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SHOWCASE */}
        <section className="py-20 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Twitch Panel Style Examples
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {examplePanels.map((ex, i) => (
                <div
                  key={i}
                  className="rounded-lg overflow-hidden shadow-lg bg-white dark:bg-slate-800 p-2"
                >
                  <Image
                    src={ex.src}
                    alt={ex.caption}
                    width={320}
                    height={100}
                    className="rounded"
                    unoptimized
                  />
                  <p className="text-center mt-2 text-sm font-medium">
                    {ex.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-8">
              <FaQuestionCircle className="inline mr-2 text-purple-600" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faq.map((item, idx) => (
                <details
                  key={idx}
                  className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border cursor-pointer"
                  open={idx === 0}
                >
                  <summary className="font-semibold text-lg">
                    {item.q}
                  </summary>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center bg-gradient-to-tr from-indigo-900 via-purple-950 to-slate-900 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Upgrade Your{" "}
            <span className="text-purple-400">Twitch Panels?</span>
          </h2>
          <button
            onClick={handleStart}
            className="px-10 py-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold rounded-lg text-xl hover:scale-105 transition-all shadow-xl"
          >
            Create Twitch Panels Now
          </button>
        </section>
      </main>
    </>
  );
};

export default TwitchPanelsLandingPage;
