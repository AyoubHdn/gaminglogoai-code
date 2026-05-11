// src/pages/twitch-graphics.tsx
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  FaCheckCircle,
  FaChevronRight,
  FaImages,
  FaLayerGroup,
  FaPalette,
  FaPlayCircle,
  FaSmile,
  FaTwitch,
  FaUserCircle,
} from "react-icons/fa";

const TwitchGraphicsLandingPage: NextPage = () => {
  const tools = [
    {
      title: "Gaming Logo Maker",
      desc: "Create a professional Twitch logo or mascot for your channel.",
      href: "/gaming-logo",
      cta: "Open Gaming Logo Maker",
      icon: <FaPalette className="h-8 w-8" />,
      img: "gaminglogo-ai-banner.webp",
    },
    {
      title: "AI Profile Picture (PFP)",
      desc: "Turn your photo into a clean avatar for Twitch, Discord, and socials.",
      href: "/ai-profile-picture-maker",
      cta: "Open AI PFP Maker",
      icon: <FaUserCircle className="h-8 w-8" />,
      img: "face-logo-image.webp",
    },
    {
      title: "Twitch Banner Maker",
      desc: "Use the guided banner flow to choose a template, personalize branding, and generate a Twitch-ready header.",
      href: "/twitch-banner-maker",
      cta: "Open Twitch Banner Maker",
      icon: <FaImages className="h-8 w-8" />,
      img: "/twitch/banner/enhance-after.webp",
    },
    {
      title: "Twitch Panels Maker",
      desc: "Build full panel sets with platform, template, personalize, and result steps.",
      href: "/twitch-panels-maker",
      cta: "Open Twitch Panels Maker",
      icon: <FaLayerGroup className="h-8 w-8" />,
      img: "/twitch/panels/roblox_chaos_prv.webp",
    },
    {
      title: "Twitch Stream Screens",
      desc: "Generate full stream-screen packs with presets, extra screen types, and custom scenes.",
      href: "/twitch-stream-screens-maker",
      cta: "Open Stream Screens Maker",
      icon: <FaPlayCircle className="h-8 w-8" />,
      img: "/twitch/screens/brb-prv.webp",
    },
    {
      title: "Twitch Emote Maker",
      desc: "Turn your face into custom Twitch emotes with a base character plus full expression-set workflow.",
      href: "/twitch-emote-maker",
      cta: "Open Twitch Emote Maker",
      icon: <FaSmile className="h-8 w-8" />,
      img: "/twitch/emotes/emotes-boy.png",
    },
  ];

  const audienceChecks = [
    "You are starting on Twitch and do not know what graphics you need.",
    "Your stream looks unprofessional or outdated.",
    "You still use default Twitch panels and weak branding.",
    "You want banners, emotes, and stream scenes without designing them manually.",
  ];

  return (
    <>
      <Head>
        <title>Twitch Graphics Pack - Logos, Emotes, Banners & Stream Screens</title>
        <meta
          name="description"
          content="Create professional Twitch graphics with AI. Logos, emotes, banners, panels, PFPs, and stream screens in guided workflows built for creators."
        />
        <meta
          name="keywords"
          content="twitch graphics, twitch branding, twitch stream graphics, twitch emotes, twitch panels, twitch banner, twitch logo"
        />
        <link rel="canonical" href="https://gaminglogoai.com/twitch-graphics" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gaminglogoai.com/twitch-graphics" />
        <meta property="og:title" content="Twitch Graphics Pack - Logos, Emotes, Banners & Stream Screens" />
        <meta property="og:description" content="Create professional Twitch graphics with AI. Logos, emotes, banners, panels, PFPs, and stream screens in guided workflows built for creators." />
        <meta property="og:image" content="https://gaminglogoai.com/og-image-gaminglogoai.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="GamingLogoAI" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Twitch Graphics Pack - Logos, Emotes, Banners & Stream Screens" />
        <meta name="twitter:description" content="Create professional Twitch graphics with AI. Logos, emotes, banners, panels, PFPs, and stream screens in guided workflows built for creators." />
        <meta name="twitter:image" content="https://gaminglogoai.com/og-image-gaminglogoai.png" />
      </Head>

      <main className="overflow-x-hidden bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-200">
        <section className="relative py-24 text-center text-white md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-950/90 to-slate-900" />

          <div className="relative z-10 mx-auto max-w-4xl px-4">
            <FaTwitch className="mx-auto mb-6 h-16 w-16 text-purple-400" />

            <h1 className="mb-6 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
              Complete <span className="text-purple-400">Twitch Graphics</span> Pack
            </h1>

            <p className="mb-10 text-lg text-slate-200 sm:text-xl">
              Everything you need to make your Twitch channel look
              <strong> professional</strong> - even if you are just starting or your
              graphics look outdated.
            </p>

            <Link
              href="#tools"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 px-10 py-4 text-lg font-bold text-white shadow-xl transition hover:scale-105"
            >
              Explore Twitch Tools <FaChevronRight />
            </Link>

            <p className="mt-4 text-xs text-slate-400">
              No design skills - AI-powered - Free credit on signup
            </p>
          </div>
        </section>

        <section className="bg-white py-16 dark:bg-slate-900">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold">
              Built for Twitch Streamers Like You
            </h2>

            <div className="grid grid-cols-1 gap-6 text-left sm:grid-cols-2">
              {audienceChecks.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <FaCheckCircle className="mt-1 text-purple-600" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="tools" className="bg-slate-50 py-20 dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              All Twitch Graphics Tools in One Place
            </h2>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <div
                  key={tool.title}
                  className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800"
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

                  <div className="flex grow flex-col p-6">
                    <div className="mb-3 flex items-center gap-3 text-purple-600">
                      {tool.icon}
                      <h3 className="text-xl font-semibold">{tool.title}</h3>
                    </div>

                    <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">
                      {tool.desc}
                    </p>

                    <Link
                      href={tool.href}
                      className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
                    >
                      {tool.cta} <FaChevronRight />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-tr from-indigo-900 via-purple-950 to-slate-900 py-20 text-center text-white">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Make Your Twitch Channel Look Professional Today
          </h2>

          <p className="mx-auto mb-10 max-w-2xl text-slate-200">
            Logos, emotes, banners, panels, and stream screens - all generated with AI
            and optimized for Twitch.
          </p>

          <Link
            href="/gaming-logo"
            className="inline-block rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 px-10 py-4 text-xl font-bold text-white shadow-xl transition hover:scale-105"
          >
            Start Creating Twitch Graphics
          </Link>
        </section>
      </main>
    </>
  );
};

export default TwitchGraphicsLandingPage;
