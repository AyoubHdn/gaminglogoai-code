// src/pages/buy-credits.tsx
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import {
  FaCheckCircle,
  FaChevronRight,
  FaImages,
  FaPaintBrush,
  FaSmile,
  FaUserCircle,
} from "react-icons/fa";
import { useBuyCredits } from "~/hook/useBuyCredits";

const BuyCreditsPage: React.FC = () => {
  const { data: session, status: sessionStatus } = useSession();
  const isLoggedIn = !!session;

  const { buyCredits } = useBuyCredits();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  type Offer = {
    name: string;
    images: number;
    price: number;
    description: string;
    plan: "starter" | "pro" | "elite";
    popular?: boolean;
  };

  const offers: Offer[] = [
    {
      name: "Starter Pack",
      images: 20,
      price: 1.99,
      description: "Perfect for trying the tools or creating a few essentials.",
      plan: "starter",
    },
    {
      name: "Pro Gamer Pack",
      images: 50,
      price: 3.99,
      description: "Best choice for streamers building a full branded setup.",
      plan: "pro",
      popular: true,
    },
    {
      name: "Elite Studio Pack",
      images: 100,
      price: 6.99,
      description: "For complete branding systems, emote packs, or multiple projects.",
      plan: "elite",
    },
  ];

  const handleBuy = async (plan: "starter" | "pro" | "elite") => {
    if (!isLoggedIn) {
      void signIn("google", { callbackUrl: "/buy-credits" });
      return;
    }

    try {
      setLoadingPlan(plan);
      await buyCredits(plan);
    } finally {
      setLoadingPlan(null);
    }
  };

  if (sessionStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-slate-900">
        <p className="text-xl text-slate-700 dark:text-slate-300">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Buy Credits & Build Your Stream Branding</title>
        <meta
          name="description"
          content="Buy credits for gaming logos, PFPs, Twitch banners, panels, stream screens, YouTube thumbnails, and emotes. One shared credit system. No subscriptions."
        />
        <link rel="canonical" href="https://gaminglogoai.com/buy-credits" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gaminglogoai.com/buy-credits" />
        <meta property="og:title" content="Buy Credits & Build Your Stream Branding" />
        <meta
          property="og:description"
          content="Buy credits for gaming logos, PFPs, Twitch banners, panels, stream screens, YouTube thumbnails, and emotes. One shared credit system. No subscriptions."
        />
        <meta property="og:image" content="https://gaminglogoai.com/og-image-gaminglogoai.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="GamingLogoAI" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Buy Credits & Build Your Stream Branding" />
        <meta
          name="twitter:description"
          content="Buy credits for gaming logos, PFPs, Twitch banners, panels, stream screens, YouTube thumbnails, and emotes. One shared credit system. No subscriptions."
        />
        <meta name="twitter:image" content="https://gaminglogoai.com/og-image-gaminglogoai.png" />
      </Head>

      <main className="min-h-screen bg-gray-100 px-4 py-16 text-slate-800 dark:bg-slate-900 dark:text-slate-200">
        <section className="mx-auto mb-16 max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">
            Buy Credits & Build Your Stream Branding
          </h1>

          <p className="mb-6 text-lg text-slate-600 dark:text-slate-400">
            Design your <strong>logo</strong>, <strong>banner</strong>,{" "}
            <strong>profile picture</strong>, <strong>panels</strong>,{" "}
            <strong>stream screens</strong>, <strong>thumbnails</strong>, and{" "}
            <strong>emotes</strong> with one shared credit system.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-2">
              <FaCheckCircle className="text-purple-600" /> No subscriptions
            </span>
            <span className="flex items-center gap-2">
              <FaCheckCircle className="text-purple-600" /> No design skills needed
            </span>
            <span className="flex items-center gap-2">
              <FaCheckCircle className="text-purple-600" /> Credits never expire
            </span>
          </div>
        </section>

        <section className="mx-auto mb-20 max-w-5xl">
          <h2 className="mb-6 text-center text-3xl font-bold">How Credits Work</h2>

          <div className="mb-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
              <ul className="space-y-3 text-sm">
                <li>- Credits are shared across all tools</li>
                <li>- Each tool uses credits based on generation complexity</li>
                <li>- Use credits anytime, on any tool</li>
                <li>- Refine and regenerate actions use credits when shown in the tool</li>
              </ul>
            </div>

            <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Typical current credit costs
                  </p>
                  <p className="mt-1 text-slate-500 dark:text-slate-400">
                    These match the updated tools currently in the product.
                  </p>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2">
                      <FaPaintBrush /> Gaming Logo Maker
                    </span>
                    <span className="text-slate-500">1-2 credits</span>
                  </li>

                  <li className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2">
                      <FaUserCircle /> AI PFP Maker
                    </span>
                    <span className="text-slate-500">4-6 credits</span>
                  </li>

                  <li className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2">
                      <FaImages /> Twitch Banner Generator
                    </span>
                    <span className="text-slate-500">10 credits</span>
                  </li>

                  <li className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2">
                      <FaImages /> YouTube Thumbnail Maker
                    </span>
                    <span className="text-slate-500">10 credits</span>
                  </li>

                  <li className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2">
                      <FaImages /> Twitch Panels
                    </span>
                    <span className="text-slate-500">2-8+ credits per set</span>
                  </li>

                  <li className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2">
                      <FaImages /> Twitch Stream Screens
                    </span>
                    <span className="text-slate-500">4 credits per screen</span>
                  </li>

                  <li className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-2">
                      <FaSmile /> Emote Generator
                    </span>
                    <span className="text-slate-500">3 base + 3 per emote</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Banner and thumbnail refine
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Refining a generated banner or thumbnail currently costs{" "}
                <strong>6 credits</strong>.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Stream screen pricing
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Stream screens are priced at <strong>4 credits per screen</strong>,
                so a 4-screen Twitch set costs <strong>16 credits</strong> total and
                extra scenes scale with the number of screens you add.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Small Twitch panel batch
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Panel pricing is batch-based: <strong>2 credits</strong> for 1 panel,{" "}
                <strong>5 credits</strong> for 2, and <strong>8 credits</strong> for 3.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Choose Your Credit Pack
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {offers.map((offer) => (
              <div
                key={offer.plan}
                className={`relative rounded-xl border bg-white p-6 shadow-xl dark:bg-slate-800 ${
                  offer.popular
                    ? "border-purple-600 ring-2 ring-purple-500"
                    : "border-slate-300 dark:border-slate-700"
                }`}
              >
                {offer.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-purple-600 px-4 py-1 text-xs font-bold text-white">
                    Most Popular
                  </span>
                )}

                <h3 className="mb-2 text-2xl font-bold">{offer.name}</h3>
                <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                  {offer.description}
                </p>

                <p className="mb-2 text-4xl font-extrabold">${offer.price.toFixed(2)}</p>
                <p className="mb-6 text-sm">{offer.images} Credits</p>

                <button
                  onClick={() => void handleBuy(offer.plan)}
                  disabled={loadingPlan === offer.plan}
                  className={`w-full rounded-lg py-3 font-semibold transition ${
                    offer.popular
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-slate-700 text-white hover:bg-slate-800"
                  } disabled:opacity-50`}
                >
                  {loadingPlan === offer.plan ? "Processing..." : `Get ${offer.name}`}
                </button>

                <div className="mt-6 text-xs text-slate-500">
                  <p className="mb-1">What you can make:</p>

                  {offer.plan === "starter" && (
                    <ul className="list-inside list-disc">
                      <li>2 banners or 2 thumbnails</li>
                      <li>1 PFP plus several logos</li>
                      <li>A small panel or screen bundle</li>
                    </ul>
                  )}

                  {offer.plan === "pro" && (
                    <ul className="list-inside list-disc">
                      <li>Banner + thumbnail + multiple logos</li>
                      <li>Full 4-screen Twitch set</li>
                      <li>Profile picture + panel batch</li>
                      <li>Base emote plus emote set</li>
                    </ul>
                  )}

                  {offer.plan === "elite" && (
                    <ul className="list-inside list-disc">
                      <li>Complete stream branding across multiple tools</li>
                      <li>Multiple banners, thumbnails, and PFPs</li>
                      <li>Large emote and panel projects</li>
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-24 max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Start Designing Now</h2>

          <p className="mb-8 text-slate-600 dark:text-slate-400">
            Pick a pack, use your credits across any tool, and upgrade your stream
            branding before your next live session.
          </p>

          <Link
            href="/twitch-graphics"
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-8 py-4 font-bold text-white hover:bg-purple-700"
          >
            Explore Twitch Tools <FaChevronRight />
          </Link>
        </section>
      </main>
    </>
  );
};

export default BuyCreditsPage;
