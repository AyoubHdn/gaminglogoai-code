// src/pages/twitch-banner-maker.tsx
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  FaPaintBrush,
  FaBolt,
  FaImages,
  FaUsers,
  FaCogs,
  FaMagic,
  FaQuestionCircle,
  FaChevronRight,
} from "react-icons/fa";

const TwitchBannerLandingPage: NextPage = () => {
  const router = useRouter();

  const handleStart = () => {
    void router.push("/twitch-banner-generator");
  };

  const features = [
    {
      title: "AI-Powered Banner Generation",
      description: "Create stunning Twitch banners using AI-trained visual styles.",
      icon: <FaMagic className="h-10 w-10" />,
    },
    {
      title: "Stream-Ready Dimensions",
      description: "Every banner is exported in 1200×480 resolution optimized for Twitch.",
      icon: <FaImages className="h-10 w-10" />,
    },
    {
      title: "Add Your Name & Tagline",
      description: "Personalize your banner with your channel name and optional tagline.",
      icon: <FaCogs className="h-10 w-10" />,
    },
    {
      title: "Upload Your Logo",
      description: "Include your logo or mascot to create a complete branding kit.",
      icon: <FaUsers className="h-10 w-10" />,
    },
    {
      title: "Multiple Styles",
      description: "Choose from clean, neon, bold, esports, gradient, minimalist, and more.",
      icon: <FaPaintBrush className="h-10 w-10" />,
    },
    {
      title: "Instant Preview",
      description: "Get your banner variations instantly—no waiting.",
      icon: <FaBolt className="h-10 w-10" />,
    },
  ];

  const exampleShowcase = [
    { src: "/twitch/banner/futuristic_stream_prv.png", caption: "Futuristic Stream" },
    { src: "/twitch/banner/pastel_play_prv.png", caption: "Pastel Play" },
    { src: "/twitch/banner/neon_retro_prv.png", caption: "Neon Retro" },
    { src: "/twitch/banner/blue_tech_glitch_prv.png", caption: "Blue Tech Glitch" },
  ];

  const faq = [
    {
      q: "Is this tool free to use?",
      a: "You get 1 free credit after signing in, which allows you to generate one full-quality Twitch banner. After using your free credit, additional credits are required to create more banners.",
    },
    {
      q: "Can I use my own logo?",
      a: "Yes — upload your logo (we recommend 1:1 PNG with transparent background) and the AI will integrate it into the banner layout.",
    },
    {
      q: "What size does Twitch require?",
      a: "Twitch recommends 1200×480 pixels. Our generator produces banners in the exact recommended size so they display perfectly.",
    },
    {
      q: "How many characters can I use for channel name & tagline?",
      a: "Each style has character limits to prevent overflow. We truncate or scale text to fit; common limits are ~11 chars for name and ~24 for taglines. You’ll see a preview before downloading.",
    },
    {
      q: "Can I change fonts and colors?",
      a: "Some templates let you tweak colors and font weights; others are fixed to preserve the designer aesthetic. We show available options per style in the editor.",
    },
    {
      q: "How does AI enhancement work?",
      a: "After generating your Twitch banner, you can optionally enhance it with AI. The enhancement adds cinematic lighting and visual effects while keeping your design intact. AI enhancement uses additional credits."
    }
  ];

  return (
    <>
      <Head>
        <title>Twitch Banner Maker – Create Professional Twitch Banners with AI</title>
        <meta
          name="description"
          content="Create custom Twitch banners with your name, tagline, and logo. Fully AI-generated in 1200×480 resolution. Choose from clean, neon, bold, esports, and more styles."
        />
        <link rel="canonical" href="https://gaminglogoai.com/twitch-banner-maker" />
      </Head>

      <main className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        {/* HERO */}
        <section className="relative py-20 md:py-32 text-center text-white overflow-hidden">
          <Image
            src="/twitch/twitch-banner-bg.webp"
            alt="Twitch banner background"
            layout="fill"
            objectFit="cover"
            className="opacity-30 dark:opacity-20"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-indigo-950/80 to-slate-900/90"></div>

          <div className="relative z-20 px-4 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              AI <span className="text-purple-400 dark:text-cyan-400">Twitch Banner Maker</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-10">
              Design stunning, professional Twitch banners in seconds — customize your name, tagline, logo, and style.
            </p>

            <button
              onClick={handleStart}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 dark:from-cyan-400 dark:to-cyan-600 text-white font-bold rounded-lg text-lg hover:scale-105 transition-all shadow-lg"
            >
              Start Designing <FaChevronRight className="inline ml-2 -mr-1" />
            </button>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Streamers Love Our <span className="text-purple-600 dark:text-cyan-400">Twitch Banner Maker</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 flex"
                >
                  <div className="text-purple-600 dark:text-cyan-400 mr-5">{f.icon}</div>
                  <div>
                    <p className="font-semibold text-lg mb-1">{f.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SHOWCASE */}
        <section className="py-20 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Twitch Banner Style Examples</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {exampleShowcase.map((ex, i) => (
                <div key={i} className="group relative rounded-lg overflow-hidden shadow-lg aspect-video">
                  <Image
                    src={ex.src}
                    alt={ex.caption}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <p className="absolute bottom-0 p-3 text-white text-sm font-semibold drop-shadow-lg">{ex.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI ENHANCEMENT SECTION */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
              Enhance Your Twitch Banner with <span className="text-purple-600 dark:text-cyan-400">AI</span>
            </h2>

            <p className="text-center max-w-3xl mx-auto text-slate-600 dark:text-slate-300 mb-12">
              After generating your Twitch banner, you can apply an optional AI enhancement
              to add cinematic lighting, neon glow, and professional esports effects.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* BEFORE */}
              <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="bg-slate-900 text-white text-sm px-4 py-2 font-semibold">
                  Before Enhancement
                </div>
                <Image
                  src="/twitch/enhance-before.webp"
                  alt="Twitch banner before AI enhancement"
                  width={1200}
                  height={480}
                  className="w-full h-auto"
                  unoptimized
                />
              </div>

              {/* AFTER */}
              <div className="rounded-xl overflow-hidden shadow-xl border border-purple-500/40">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm px-4 py-2 font-semibold">
                  After AI Enhancement
                </div>
                <Image
                  src="/twitch/enhance-after.webp"
                  alt="Twitch banner after AI enhancement"
                  width={1200}
                  height={480}
                  className="w-full h-auto"
                  unoptimized
                />
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
                AI enhancement uses an advanced image-to-image model to refine lighting,
                contrast, and visual effects — without changing your text or layout.
              </p>

              <button
                onClick={handleStart}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-700 dark:from-cyan-400 dark:to-cyan-600
                text-white font-bold rounded-lg text-lg hover:scale-105 transition-all shadow-lg"
              >
                Try AI Enhancement
              </button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-slate-900 dark:text-white">
              <FaQuestionCircle className="inline-block mr-2 align-middle text-purple-600 dark:text-cyan-400" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faq.map((item, idx) => (
                <details
                  key={idx}
                  className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 group cursor-pointer"
                  open={idx === 0}
                >
                  <summary className="font-semibold text-lg text-slate-800 dark:text-white flex justify-between items-center list-none">
                    <span>{item.q}</span>
                    <span className="transform transition-transform duration-300 group-open:rotate-180 ml-2">
                      {/* small chevron */}
                      <svg className="h-4 w-4 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>

                  <div className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-700 pt-3">
                    <p>{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center bg-gradient-to-tr from-indigo-900 via-purple-950 to-slate-900 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Design Your <span className="text-purple-400 dark:text-cyan-400">Twitch Banner?</span>
          </h2>
          <button
            onClick={handleStart}
            className="px-10 py-4 bg-gradient-to-r from-purple-500 to-purple-700 dark:from-cyan-400 dark:to-cyan-600 text-white font-bold rounded-lg text-xl hover:scale-105 transition-all shadow-xl"
          >
            Create My Banner Now
          </button>
        </section>
      </main>
    </>
  );
};

export default TwitchBannerLandingPage;
