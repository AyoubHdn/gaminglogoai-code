import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const TwitchStreamScreensLanding: NextPage = () => {
  return (
    <>
      <Head>
        <title>Twitch Stream Screens Maker | Starting Soon, BRB & Offline</title>
        <meta
          name="description"
          content="Create professional Twitch stream screens in seconds. Generate Starting Soon, BRB, Offline, and Intermission screens with AI. Perfect 1920x1080 resolution."
        />
        <link
          rel="canonical"
          href="https://gaminglogoai.com/twitch-stream-screens-maker"
        />
      </Head>

      <main className="overflow-x-hidden">

        {/* -------------------------------------------------- */}
        {/* HERO */}
        {/* -------------------------------------------------- */}
        <section className="relative py-20 md:py-28 text-center text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950" />
          <div className="container mx-auto px-4 relative z-10">

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
              AI Twitch Stream Screens Maker
            </h1>

            <p className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto mb-10">
              Instantly create <strong>Starting Soon</strong>, <strong>BRB</strong>,
              <strong> Offline</strong> and <strong>Intermission</strong> screens for your Twitch stream.
              Designed in perfect <strong>1920×1080</strong> resolution.
            </p>

            <Link
              href="/twitch-stream-screens-generator"
              className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold text-lg shadow-xl transition"
              id="cta-hero-stream-screens"
            >
              Create Stream Screens →
            </Link>

            <p className="mt-4 text-xs text-slate-400">
              Free credit on signup • No design skills needed
            </p>
          </div>
        </section>

        {/* -------------------------------------------------- */}
        {/* WHAT ARE STREAM SCREENS */}
        {/* -------------------------------------------------- */}
        <section className="py-16 md:py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 max-w-5xl text-center">

            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              What Are Twitch Stream Screens?
            </h2>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Stream screens are full-screen visuals shown during different moments of your live stream.
              They keep your channel professional and engaging when you are not actively on camera.
            </p>
          </div>
        </section>

        {/* -------------------------------------------------- */}
        {/* PREVIEW GALLERY */}
        {/* -------------------------------------------------- */}
        <section className="py-16 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto px-4">

            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              Preview Stream Screens
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

              {[
                { title: "Starting Soon", img: "/twitch/starting-soon-preview.webp" },
                { title: "Be Right Back", img: "/twitch/brb-preview.webp" },
                { title: "Stream Offline", img: "/twitch/offline-preview.webp" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-slate-800"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={item.img}
                      alt={`${item.title} Twitch screen`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-4 text-center font-semibold">
                    {item.title}
                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* -------------------------------------------------- */}
        {/* BENEFITS */}
        {/* -------------------------------------------------- */}
        <section className="py-16 md:py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">

            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              Why Use Our Stream Screens Generator?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

              {[
                {
                  title: "Perfect Resolution",
                  desc: "All screens are generated in full HD 1920×1080 — no cropping needed.",
                },
                {
                  title: "Instant AI Design",
                  desc: "Generate professional screens in seconds without Photoshop or templates.",
                },
                {
                  title: "Streamer Branding",
                  desc: "Designed specifically for Twitch streamers and gaming creators.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800 shadow"
                >
                  <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {f.desc}
                  </p>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* -------------------------------------------------- */}
        {/* HOW IT WORKS */}
        {/* -------------------------------------------------- */}
        <section className="py-16 bg-slate-100 dark:bg-slate-950">
          <div className="container mx-auto px-4">

            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
              How It Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {[
                { step: "1", title: "Choose Style", desc: "Pick a visual style that matches your stream branding." },
                { step: "2", title: "Enter Text", desc: "Use presets like Starting Soon or write your own message." },
                { step: "3", title: "Generate & Download", desc: "Download your screen instantly and use it in OBS." },
              ].map((s) => (
                <div key={s.step} className="relative p-6 bg-white dark:bg-slate-800 rounded-xl shadow">
                  <div className="absolute -top-5 left-5 w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    {s.step}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {s.desc}
                  </p>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* -------------------------------------------------- */}
        {/* FINAL CTA */}
        {/* -------------------------------------------------- */}
        <section className="py-20 bg-gradient-to-r from-purple-700 via-indigo-800 to-purple-900 text-white text-center">
          <div className="container mx-auto px-4">

            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Upgrade Your Twitch Stream?
            </h2>

            <p className="text-slate-200 max-w-2xl mx-auto mb-10">
              Create stunning stream screens that keep viewers engaged even when you’re off camera.
            </p>

            <Link
              href="/twitch-stream-screens-generator"
              className="inline-block px-10 py-4 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold rounded-lg shadow-lg transition"
            >
              Create Stream Screens Now
            </Link>

          </div>
        </section>

      </main>
    </>
  );
};

export default TwitchStreamScreensLanding;
