// src/pages/buy-credits.tsx
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import { useBuyCredits } from "~/hook/useBuyCredits"; // Assuming hook path is correct

const BuyCreditsPage: React.FC = () => {
  const { buyCredits } = useBuyCredits();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  type Offer = {
    name: string;
    images: number;
    price: number;
    description: string;
    plan: "starter" | "pro" | "elite";
    popular?: boolean;
    pricePerImage?: string;
  };

  const offers: Offer[] = [
    {
      name: "Starter Pack",
      images: 20,
      price: 1.99,
      description: "Perfect for trying out designs or small projects.",
      plan: "starter",
    },
    {
      name: "Pro Gamer Pack",
      images: 50,
      price: 3.99,
      description: "Best value for regular logo creation and variations.",
      plan: "pro",
      popular: true,
    },
    {
      name: "Elite Studio Pack",
      images: 100,
      price: 6.99,
      description: "Ideal for extensive design needs or multiple projects.",
      plan: "elite",
    },
  ].map((offer) => ({
    ...offer,
    pricePerImage: (offer.price / offer.images).toFixed(2),
  })) as Offer[];

  const handleBuy = async (plan: "starter" | "pro" | "elite") => {
    try {
      setLoadingPlan(plan);
      await buyCredits(plan);
    } catch (error) {
      console.error("Error during purchase:", error);
      alert("Something went wrong with the purchase. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <>
      <Head>
        <title>Buy Credits - Gaming Logo AI | Affordable Logo Design Packs</title>
        <meta
          name="description"
          content="Get more credits for Gaming Logo AI. Choose from Starter, Pro Gamer, or Elite Studio packs to generate unique gaming logos."
        />
        <meta name="keywords" content="gaming logo credits, buy logo credits, ai logo generator pricing, gaming logo packs" />
        <link rel="icon" href="/favicon.ico" /> {/* New favicon */}
      </Head>
      {/* Dark mode: bg-slate-900, Light mode: bg-gray-100 */}
      <main className="flex min-h-screen mt-16 sm:mt-24 flex-col container mx-auto gap-4 px-4 sm:px-8 py-8 bg-gray-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-slate-900 dark:text-white">
            Level Up Your Credits!
          </h1>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-4">
            Please review our{" "}
            <Link href="/refund-policy" className="text-purple-600 dark:text-purple-400 hover:underline">
              Refund Policy
            </Link>{" "}
            before purchasing credits.
          </p>
          <p className="text-center text-slate-700 dark:text-slate-300 mb-10">
            Grab a credit pack and start designing your epic gaming logos.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {offers.map((offer, index) => {
              const oldPrice = (offer.price * 2).toFixed(2);
              return (
                <div
                  key={index}
                  className={`relative border rounded-lg p-6 shadow-xl 
                              bg-white dark:bg-slate-800 
                              transition-all duration-300 hover:shadow-purple-500/30 dark:hover:shadow-cyan-500/30
                              ${
                                offer.popular
                                  ? "border-purple-600 dark:border-cyan-500 ring-2 ring-purple-500 dark:ring-cyan-400"
                                  : "border-gray-300 dark:border-slate-700"
                              }`}
                >
                  {/* Discount badge */}
                  <div className="absolute top-0 right-0 -mt-3 -mr-3">
                    <span className="bg-red-500 text-white text-xs font-bold uppercase px-3 py-1 rounded-full shadow-md">
                      50% OFF
                    </span>
                  </div>
                  {offer.popular && (
                    <div className="bg-purple-600 dark:bg-cyan-500 text-white dark:text-slate-900 text-xs font-semibold uppercase px-3 py-1 rounded-full inline-block mb-4 shadow">
                      Most Popular
                    </div>
                  )}
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {offer.name}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
                    {offer.description}
                  </p>
                  <div className="mb-6">
                    <p className="text-md text-slate-500 dark:text-slate-500 line-through">
                      Old Price: ${oldPrice}
                    </p>
                    <p className="text-4xl font-bold text-slate-800 dark:text-white">
                      ${offer.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-2 font-semibold">
                    {offer.images} Credits
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    (Just ${offer.pricePerImage} per logo concept)
                  </p>
                  <p className="text-center text-sm text-red-500 dark:text-red-400 mb-4 font-bold">
                    Limited Time Offer!
                  </p>
                  <button
                    id={`plan_${offer.plan}`}
                    onClick={() => {
                      void handleBuy(offer.plan);
                    }}
                    className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out
                                text-white dark:text-slate-900
                                ${offer.popular 
                                  ? 'bg-purple-600 hover:bg-purple-700 dark:bg-cyan-500 dark:hover:bg-cyan-600' 
                                  : 'bg-slate-700 hover:bg-slate-800 dark:bg-purple-500 dark:hover:bg-purple-600'}
                                disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                ${offer.popular ? 'focus:ring-purple-500 dark:focus:ring-cyan-400' : 'focus:ring-slate-500 dark:focus:ring-purple-400'}`}
                    disabled={loadingPlan === offer.plan}
                  >
                    {loadingPlan === offer.plan ? "Processing..." : `Get ${offer.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
};

export default BuyCreditsPage;