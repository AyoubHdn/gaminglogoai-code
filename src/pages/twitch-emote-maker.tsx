// src/pages/twitch-emote-maker.tsx
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  FaMagic,
  FaSmile,
  FaBolt,
  FaUserCircle,
  FaImages,
  FaChevronRight,
  FaQuestionCircle,
} from "react-icons/fa";

const TwitchEmoteMakerPage: NextPage = () => {
  const router = useRouter();

  const handleStart = () => {
    void router.push("/emote-generator");
  };

  const features = [
    {
      title: "Turn Your Face Into Twitch Emotes",
      description:
        "Upload a real photo and instantly transform it into a Twitch-ready emote character.",
      icon: <FaUserCircle className="h-10 w-10" />,
    },
    {
      title: "Generate Multiple Emote Expressions",
      description:
        "Create GG, LOL, HYPE, RIP, WOW, and more emotes from the same base character.",
      icon: <FaSmile className="h-10 w-10" />,
    },
    {
      title: "Perfect Twitch Emote Sizes",
      description:
        "Optimized for Twitch emote resolutions (28px, 56px, 112px).",
      icon: <FaImages className="h-10 w-10" />,
    },
    {
      title: "Anime & Cartoon Styles",
      description:
        "Clean outlines, expressive faces, and high-contrast styles made for chat.",
      icon: <FaMagic className="h-10 w-10" />,
    },
    {
      title: "Transparent Background",
      description:
        "Every emote is generated with a transparent background, ready to upload.",
      icon: <FaBolt className="h-10 w-10" />,
    },
    {
      title: "Instant Download",
      description:
        "Preview, download, and use your emotes on Twitch in seconds.",
      icon: <FaChevronRight className="h-10 w-10" />,
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
      q: "Are the emotes ready for Twitch?",
      a: "Yes. All emotes are optimized for Twitch sizes and transparent backgrounds.",
    },
    {
      q: "Do I need design skills?",
      a: "No. The AI handles everything — just upload a photo and choose expressions.",
    },
    {
      q: "Is there a free version?",
      a: "You receive free credits after signing in. More emotes require credits.",
    },
  ];

  return (
    <>
      <Head>
        <title>Twitch Emote Maker – Create Custom Twitch Emotes from Your Face</title>
        <meta
          name="description"
          content="Create custom Twitch emotes from your real face using AI. Turn your photo into GG, LOL, HYPE, RIP emotes with transparent background."
        />
        <link
          rel="canonical"
          href="https://gaminglogoai.com/twitch-emote-maker"
        />
      </Head>

      <main className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        {/* HERO */}
        <section className="relative py-24 text-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-950/90 to-slate-900"></div>

          <div className="relative z-20 px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              AI <span className="text-purple-400">Twitch Emote Maker</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-200 mb-10">
              Turn your real photo into custom Twitch emotes like{" "}
              <strong>GG</strong>, <strong>LOL</strong>, <strong>HYPE</strong>,{" "}
              <strong>RIP</strong>, and more — instantly with AI.
            </p>

            <button
              onClick={handleStart}
              className="px-10 py-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold rounded-lg text-lg hover:scale-105 transition-all shadow-xl"
            >
              Create Twitch Emotes <FaChevronRight className="inline ml-2" />
            </button>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
              From Photo to Twitch Emotes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
              <div className="text-center">
                <Image
                  src="/twitch/emotes/front-view-beautiful-model.jpg"
                  alt="Upload your photo"
                  width={300}
                  height={400}
                  className="rounded-xl mx-auto shadow-lg"
                  unoptimized
                />
                <p className="mt-4 font-semibold">1. Upload Your Photo</p>
              </div>

              <div className="text-center">
                <Image
                  src="/twitch/emotes/emote-base(3).png"
                  alt="AI emote base"
                  width={260}
                  height={260}
                  className="rounded-xl mx-auto shadow-lg"
                  unoptimized
                />
                <p className="mt-4 font-semibold">2. AI Creates Base Emote</p>
              </div>

              <div className="text-center">
                <Image
                  src="/twitch/emotes/HI.png"
                  alt="Twitch emote set"
                  width={320}
                  height={320}
                  className="rounded-xl mx-auto shadow-lg"
                  unoptimized
                />
                <p className="mt-4 font-semibold">3. Generate Emote Set</p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-20 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Streamers Use Our{" "}
              <span className="text-purple-600">Twitch Emote Maker</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="p-6 bg-white dark:bg-slate-800/60 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 flex"
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
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Real Examples Generated with AI
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
              <Image
                src="/twitch/emotes/emotes-girl.png"
                alt="Female Twitch emotes example"
                width={600}
                height={400}
                className="rounded-xl shadow-lg"
                unoptimized
              />
              <Image
                src="/twitch/emotes/emotes-boy.png"
                alt="Male Twitch emotes example"
                width={600}
                height={400}
                className="rounded-xl shadow-lg"
                unoptimized
              />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-8">
              <FaQuestionCircle className="inline mr-2 text-purple-600" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faq.map((item, idx) => (
                <details
                  key={idx}
                  className="p-4 bg-white dark:bg-slate-800 rounded-lg border cursor-pointer"
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
            Ready to Create Your{" "}
            <span className="text-purple-400">Twitch Emotes?</span>
          </h2>

          <button
            onClick={handleStart}
            className="px-10 py-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold rounded-lg text-xl hover:scale-105 transition-all shadow-xl"
          >
            Start Emote Generator
          </button>
        </section>
      </main>
    </>
  );
};

export default TwitchEmoteMakerPage;
