// src/pages/twitch-emote-maker.tsx
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  FaBolt,
  FaChevronRight,
  FaImages,
  FaMagic,
  FaQuestionCircle,
  FaSmile,
  FaUserCircle,
} from "react-icons/fa";

const TwitchEmoteMakerPage: NextPage = () => {
  const router = useRouter();

  const handleStart = () => {
    void router.push("/emote-generator");
  };

  const features = [
    {
      title: "Face-To-Emote Workflow",
      description:
        "Upload a real photo, choose an art style, and turn yourself into a Twitch-ready emote base character.",
      icon: <FaUserCircle className="h-10 w-10" />,
    },
    {
      title: "Base Plus Full Emote Set",
      description:
        "Generate one clean base emote first, then build GG, LOL, HYPE, RIP, WOW, RAID, and more from the same character.",
      icon: <FaSmile className="h-10 w-10" />,
    },
    {
      title: "Twitch-Ready Output",
      description:
        "The results are optimized for Twitch-style usage and small-size readability in chat.",
      icon: <FaImages className="h-10 w-10" />,
    },
    {
      title: "Style Browser Included",
      description:
        "Pick from anime, cartoon, mascot, and other expressive emote-friendly art styles before generation.",
      icon: <FaMagic className="h-10 w-10" />,
    },
    {
      title: "Text or No-Text Variations",
      description:
        "Choose whether your emotes should include expression text or stay cleaner with no text overlays.",
      icon: <FaBolt className="h-10 w-10" />,
    },
    {
      title: "Download The Whole Pack",
      description:
        "Download the base emote and each generated expression individually once the set is ready.",
      icon: <FaChevronRight className="h-10 w-10" />,
    },
  ];

  const workflowSteps = [
    {
      step: "1. Upload",
      detail: "Start with a face photo that the AI can transform into a base emote character.",
    },
    {
      step: "2. Style",
      detail: "Choose the art direction that will shape the base emote and the whole expression pack.",
    },
    {
      step: "3. Base Emote",
      detail: "Generate the clean neutral emote base that all later expressions will build from.",
    },
    {
      step: "4. Emote Set",
      detail: "Select the expressions you want, choose text or no-text output, and download each final emote.",
    },
  ];

  const faq = [
    {
      q: "What is a Twitch emote maker?",
      a: "A Twitch emote maker allows streamers to create custom emotes for chat, usually showing emotions like GG, LOL, HYPE, or RIP.",
    },
    {
      q: "Can I use my real face?",
      a: "Yes. Upload a real photo and the AI converts it into a stylized emote character.",
    },
    {
      q: "How does the updated emote workflow work?",
      a: "You first create a base emote character from your photo, then generate a full set of expressions from that same base so the pack stays visually consistent.",
    },
    {
      q: "Are the emotes ready for Twitch?",
      a: "Yes. All emotes are optimized for Twitch sizes and transparent backgrounds.",
    },
    {
      q: "Can I choose text or no-text emotes?",
      a: "Yes. The generator supports expression text variants as well as cleaner no-text versions depending on the look you want.",
    },
    {
      q: "Do I need design skills?",
      a: "No. The AI handles everything - just upload a photo, choose a style, and pick the expressions you want.",
    },
    {
      q: "Is there a free version?",
      a: "You receive free credits after signing in. More emotes require credits.",
    },
  ];

  return (
    <>
      <Head>
        <title>Twitch Emote Maker — Free Custom AI Emotes | GamingLogoAI</title>
        <meta
          name="description"
          content="Create custom Twitch emotes free with AI. Turn your face into a base emote, generate a full expression set (GG, LOL, HYPE), and download Twitch-ready."
        />
        <link rel="canonical" href="https://gaminglogoai.com/twitch-emote-maker" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gaminglogoai.com/twitch-emote-maker" />
        <meta property="og:title" content="Twitch Emote Maker — Free Custom AI Emotes | GamingLogoAI" />
        <meta property="og:description" content="Create custom Twitch emotes free with AI. Turn your face into a base emote, generate a full expression set (GG, LOL, HYPE), and download Twitch-ready." />
        <meta property="og:image" content="https://gaminglogoai.com/og-image-gaminglogoai.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="GamingLogoAI" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Twitch Emote Maker — Free Custom AI Emotes | GamingLogoAI" />
        <meta name="twitter:description" content="Create custom Twitch emotes free with AI. Turn your face into a base emote, generate a full expression set (GG, LOL, HYPE), and download Twitch-ready." />
        <meta name="twitter:image" content="https://gaminglogoai.com/og-image-gaminglogoai.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "AI Twitch Emote Maker",
              description:
                "Create custom Twitch emotes free with AI. Turn your face into a base emote, generate a full expression set (GG, LOL, HYPE), and download Twitch-ready.",
              url: "https://gaminglogoai.com/twitch-emote-maker",
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
        <section className="relative overflow-hidden py-24 text-center text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-950/90 to-slate-900" />

          <div className="relative z-20 mx-auto max-w-4xl px-4">
            <h1 className="mb-6 text-4xl font-extrabold md:text-6xl">
              AI <span className="text-purple-400">Twitch Emote Maker</span>
            </h1>

            <p className="mb-10 text-lg text-slate-200 md:text-xl">
              Turn your real photo into custom Twitch emotes like{" "}
              <strong>GG</strong>, <strong>LOL</strong>, <strong>HYPE</strong>,{" "}
              <strong>RIP</strong>, and more with a base-character workflow built
              for full emote packs.
            </p>

            <button
              onClick={handleStart}
              className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 px-10 py-4 text-lg font-bold text-white shadow-xl transition-all hover:scale-105"
            >
              Create Twitch Emotes <FaChevronRight className="ml-2 inline" />
            </button>
          </div>
        </section>

        <section className="bg-white py-20 dark:bg-slate-900">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="mb-14 text-center text-3xl font-bold md:text-4xl">
              From Photo to Twitch Emotes
            </h2>

            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-3">
              <div className="text-center">
                <Image
                  src="/twitch/emotes/front-view-beautiful-model.webp"
                  alt="Upload your photo"
                  width={300}
                  height={400}
                  className="mx-auto rounded-xl shadow-lg"
                  unoptimized
                />
                <p className="mt-4 font-semibold">1. Upload Your Photo</p>
              </div>

              <div className="text-center">
                <Image
                  src="/twitch/emotes/emote-base.webp"
                  alt="AI emote base"
                  width={260}
                  height={260}
                  className="mx-auto rounded-xl shadow-lg"
                  unoptimized
                />
                <p className="mt-4 font-semibold">2. AI Creates Base Emote</p>
              </div>

              <div className="text-center">
                <Image
                  src="/twitch/emotes/HI.webp"
                  alt="Twitch emote set"
                  width={320}
                  height={320}
                  className="mx-auto rounded-xl shadow-lg"
                  unoptimized
                />
                <p className="mt-4 font-semibold">3. Generate Emote Set</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-20 dark:bg-slate-950">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              How The Emote Builder Works
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
              Why Streamers Use Our <span className="text-purple-600">Twitch Emote Maker</span>
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
              Real Examples Generated with AI
            </h2>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">
              <Image
                src="/twitch/emotes/emotes-girl.webp"
                alt="Female Twitch emotes example"
                width={600}
                height={400}
                className="rounded-xl shadow-lg"
                unoptimized
              />
              <Image
                src="/twitch/emotes/emotes-boy.webp"
                alt="Male Twitch emotes example"
                width={600}
                height={400}
                className="rounded-xl shadow-lg"
                unoptimized
              />
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
              {faq.map((item, idx) => (
                <details
                  key={item.q}
                  className="cursor-pointer rounded-lg border bg-slate-50 p-4 dark:bg-slate-800"
                  open={idx === 0}
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
            Ready to Create Your <span className="text-purple-400">Twitch Emotes?</span>
          </h2>

          <button
            onClick={handleStart}
            className="rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 px-10 py-4 text-xl font-bold text-white shadow-xl transition-all hover:scale-105"
          >
            Start Emote Generator
          </button>
        </section>
      </main>
    </>
  );
};

export default TwitchEmoteMakerPage;
