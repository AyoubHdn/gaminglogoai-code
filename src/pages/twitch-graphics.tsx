// src/pages/twitch-graphics.tsx
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  FaTwitch,
  FaPalette,
  FaUserCircle,
  FaSmile,
  FaImages,
  FaLayerGroup,
  FaPlayCircle,
  FaChevronRight,
  FaCheckCircle,
} from "react-icons/fa";

const TwitchGraphicsLandingPage: NextPage = () => {
  const tools = [
    {
      title: "Gaming Logo Maker",
      desc: "Create a professional Twitch logo or mascot for your channel.",
      href: "/gaming-logo",
      icon: <FaPalette className="h-8 w-8" />,
      img: "gaminglogo-ai-banner.webp",
    },
    {
      title: "AI Profile Picture (PFP)",
      desc: "Turn your photo into a clean avatar for Twitch, Discord, and socials.",
      href: "/ai-profile-picture-maker",
      icon: <FaUserCircle className="h-8 w-8" />,
      img: "face-logo-image.webp",
    },
    {
      title: "Twitch Banner Maker",
      desc: "Design a professional Twitch banner (1200×480) with your name & style.",
      href: "/twitch-banner-maker",
      icon: <FaImages className="h-8 w-8" />,
      img: "/twitch/enhance-after.webp",
    },
    {
      title: "Twitch Panels Maker",
      desc: "Create About, Donate, Rules, and Specs panels in 320×100 size.",
      href: "/twitch-panels-maker",
      icon: <FaLayerGroup className="h-8 w-8" />,
      img: "/twitch/panels/neon_retro_prv.webp",
    },
    {
      title: "Twitch Stream Screens",
      desc: "Generate Starting Soon, BRB, Offline & Intermission screens (1920×1080).",
      href: "/twitch-stream-screens-maker",
      icon: <FaPlayCircle className="h-8 w-8" />,
      img: "/twitch/screens/cyberpunk-prv.webp",
    },
    {
      title: "Twitch Emote Maker",
      desc: "Turn your face into custom Twitch emotes like GG, LOL, HYPE & RIP.",
      href: "/twitch-emote-maker",
      icon: <FaSmile className="h-8 w-8" />,
      img: "/twitch/emotes/emotes-boy.png",
    },
  ];

  return (
    <>
      <Head>
        <title>Twitch Graphics Pack – Logos, Emotes, Banners & Stream Screens</title>
        <meta
          name="description"
          content="Create professional Twitch graphics with AI. Logos, emotes, banners, panels, PFPs & stream screens — everything your Twitch channel needs."
        />
        <meta
          name="keywords"
          content="twitch graphics, twitch branding, twitch stream graphics, twitch emotes, twitch panels, twitch banner, twitch logo"
        />
        <link
          rel="canonical"
          href="https://gaminglogoai.com/twitch-graphics"
        />
      </Head>

      <main className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-x-hidden">

        {/* -------------------------------------------------- */}
        {/* HERO */}
        {/* -------------------------------------------------- */}
        <section className="relative py-24 md:py-32 text-center text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-950/90 to-slate-900" />

          <div className="relative z-10 max-w-4xl mx-auto px-4">
            <FaTwitch className="mx-auto mb-6 h-16 w-16 text-purple-400" />

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
              Complete <span className="text-purple-400">Twitch Graphics</span> Pack
            </h1>

            <p className="text-lg sm:text-xl text-slate-200 mb-10">
              Everything you need to make your Twitch channel look
              <strong> professional</strong> — even if you’re just starting or
              your graphics look outdated.
            </p>

            <Link
              href="#tools"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-purple-500 to-purple-700
                         text-white font-bold rounded-lg text-lg hover:scale-105 transition shadow-xl"
            >
              Explore Twitch Tools <FaChevronRight />
            </Link>

            <p className="mt-4 text-xs text-slate-400">
              No design skills • AI-powered • Free credit on signup
            </p>
          </div>
        </section>

        {/* -------------------------------------------------- */}
        {/* WHO THIS IS FOR */}
        {/* -------------------------------------------------- */}
        <section className="py-16 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6">
              Built for Twitch Streamers Like You
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
              {[
                "You are starting on Twitch and don’t know what graphics you need",
                "Your stream looks unprofessional or outdated",
                "You use default Twitch panels and no branding",
                "You want emotes but don’t know how to design them",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <FaCheckCircle className="text-purple-600 mt-1" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- */}
        {/* TOOLS GRID */}
        {/* -------------------------------------------------- */}
        <section id="tools" className="py-20 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              All Twitch Graphics Tools in One Place
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools.map((tool) => (
                <div
                  key={tool.title}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={tool.img}
                      alt={tool.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="p-6 flex flex-col grow">
                    <div className="flex items-center gap-3 mb-3 text-purple-600">
                      {tool.icon}
                      <h3 className="text-xl font-semibold">{tool.title}</h3>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                      {tool.desc}
                    </p>

                    <Link
                      href={tool.href}
                      className="mt-auto inline-flex items-center justify-center gap-2 px-6 py-3
                                 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
                    >
                      Open Tool <FaChevronRight />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- */}
        {/* FINAL CTA */}
        {/* -------------------------------------------------- */}
        <section className="py-20 text-center bg-gradient-to-tr from-indigo-900 via-purple-950 to-slate-900 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Make Your Twitch Channel Look Professional Today
          </h2>

          <p className="text-slate-200 max-w-2xl mx-auto mb-10">
            Logos, emotes, banners, panels, stream screens — all generated with AI
            and optimized for Twitch.
          </p>

          <Link
            href="/gaming-logo"
            className="inline-block px-10 py-4 bg-gradient-to-r from-purple-500 to-purple-700
                       text-white font-bold rounded-lg text-xl hover:scale-105 transition shadow-xl"
          >
            Start Creating Twitch Graphics
          </Link>
        </section>

      </main>
    </>
  );
};

export default TwitchGraphicsLandingPage;
