// src/pages/buy-credits.tsx
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import {
  FaCheckCircle,
  FaChevronRight,
  FaPaintBrush,
  FaSmile,
  FaImages,
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
      description: "Best choice for small streamers building a full Twitch profile.",
      plan: "pro",
      popular: true,
    },
    {
      name: "Elite Studio Pack",
      images: 100,
      price: 6.99,
      description: "For full branding, emote packs, or multiple projects.",
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
          content="Buy credits and design your Twitch logo, banner, profile picture, panels, stream screens, and emotes. One simple credit system. No subscriptions."
        />
        <link rel="canonical" href="https://gaminglogoai.com/buy-credits" />
      </Head>

      <main className="min-h-screen bg-gray-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-4 py-16">

        {/* -------------------------------------------------- */}
        {/* HERO */}
        {/* -------------------------------------------------- */}
        <section className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-slate-900 dark:text-white">
            Buy Credits & Build Your Stream Branding
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            Design your <strong>logo</strong>, <strong>banner</strong>,{" "}
            <strong>profile picture</strong>, <strong>panels</strong>,{" "}
            <strong>stream screens</strong>, and <strong>emotes</strong> —
            all with one simple credit system.
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

        {/* -------------------------------------------------- */}
        {/* HOW CREDITS WORK */}
        {/* -------------------------------------------------- */}
        <section className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-bold mb-6 text-center">
            How Credits Work
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
              <ul className="space-y-3 text-sm">
                <li>• Credits are shared across all tools</li>
                <li>• Each tool uses credits based on complexity</li>
                <li>• Use credits anytime, on any tool</li>
                <li>• New tools will use the same credits</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <FaPaintBrush /> Text Logo: 1–2 credits
                  <p className="text-sm text-slate-500">
                    (Just ~$0.1 per logo)
                  </p>
                </li>
                <li className="flex gap-2">
                  <FaUserCircle /> Profile Picture: 4–6 credits
                  <p className="text-sm text-slate-500">
                    (Just ~$0.4 per pfp)
                  </p>
                </li>
                <li className="flex gap-2">
                  <FaImages /> Banner / Panel / Screen: 1 credit
                  <p className="text-sm text-slate-500">
                    (Just ~$0.1 per image)
                  </p>
                </li>
                <li className="flex gap-2">
                  <FaSmile /> Emotes: 3 credits per emote
                  <p className="text-sm text-slate-500">
                    (Just ~$0.3 per emote)
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- */}
        {/* CREDIT PACKS */}
        {/* -------------------------------------------------- */}
        <section className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Choose Your Credit Pack
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {offers.map((offer) => (
              <div
                key={offer.plan}
                className={`relative bg-white dark:bg-slate-800 rounded-xl p-6 shadow-xl border
                  ${offer.popular
                    ? "border-purple-600 ring-2 ring-purple-500"
                    : "border-slate-300 dark:border-slate-700"}`}
              >
                {offer.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                )}

                <h3 className="text-2xl font-bold mb-2">{offer.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {offer.description}
                </p>

                <p className="text-4xl font-extrabold mb-2">
                  ${offer.price.toFixed(2)}
                </p>

                <p className="text-sm mb-6">{offer.images} Credits</p>

                <button
                  onClick={() => void handleBuy(offer.plan)}
                  disabled={loadingPlan === offer.plan}
                  className={`w-full py-3 font-semibold rounded-lg transition
                    ${offer.popular
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-slate-700 hover:bg-slate-800 text-white"}
                    disabled:opacity-50`}
                >
                  {loadingPlan === offer.plan
                    ? "Processing..."
                    : `Get ${offer.name}`}
                </button>

                <div className="mt-6 text-xs text-slate-500">
                  <p className="mb-1">What you can make:</p>
                  {offer.plan === "starter" && (
                    <ul className="list-disc list-inside">
                      <li>Logo + Banner</li>
                      <li>OR 1 Profile Picture</li>
                      <li>OR a few emotes</li>
                    </ul>
                  )}
                  {offer.plan === "pro" && (
                    <ul className="list-disc list-inside">
                      <li>Logo</li>
                      <li>Banner + Panels</li>
                      <li>Profile Picture</li>
                      <li>Stream Screens</li>
                      <li>Emote packs</li>
                    </ul>
                  )}
                  {offer.plan === "elite" && (
                    <ul className="list-disc list-inside">
                      <li>Complete stream branding</li>
                      <li>Emote packs</li>
                      <li>Multiple projects</li>
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------- */}
        {/* FINAL CTA */}
        {/* -------------------------------------------------- */}
        <section className="max-w-4xl mx-auto text-center mt-24">
          <h2 className="text-3xl font-bold mb-4">
            Start Designing Now
          </h2>

          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Pick a pack, use your credits, and upgrade your stream before your next live session.
          </p>

          <Link
            href="/twitch-graphics"
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg"
          >
            Explore Twitch Tools <FaChevronRight />
          </Link>
        </section>

      </main>
    </>
  );
};

export default BuyCreditsPage;
