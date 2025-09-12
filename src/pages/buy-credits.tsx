// src/pages/buy-credits.tsx
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "~/component/Button"; // Your themed Button
import { useBuyCredits } from "~/hook/useBuyCredits";
import { FaCheckCircle, FaQuestionCircle } from "react-icons/fa"; // Icons

const BuyCreditsPage: React.FC = () => {
  const { data: session, status: sessionStatus } = useSession();
  const isLoggedIn = sessionStatus === "authenticated";

  const { buyCredits } = useBuyCredits();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  type Offer = {
    name: string;
    credits: number;
    price?: number; // Price is optional for the free plan
    description: string;
    plan: "free" | "starter" | "pro" | "elite";
    popular?: boolean;
    pricePerCredit?: string;
    features: string[]; // List of what you get
  };

  const creditExamples = [
    {
      cost: "1 Credit",
      type: "Text Logo (Speedy)",
      imageUrl: "/styles/s646.webp", // ** REPLACE with an actual example image **
      alt: "Example of a Speedy text logo generated for 1 credit"
    },
    {
      cost: "4 Credits",
      type: "Text Logo (Balanced)",
      imageUrl: "/styles/s646e.webp", // ** REPLACE with an actual example image **
      alt: "Example of a Balanced text logo generated for 4 credits"
    },
    {
      cost: "6 Credits",
      type: "Photo Avatar (Pro)",
      imageUrl: "/Pro.webp", // ** REPLACE with an actual example image **
      alt: "Example of a Pro quality photo avatar generated for 6 credits"
    },
    {
      cost: "12 Credits",
      type: "Photo Avatar (Max)",
      imageUrl: "/Max.webp", // ** REPLACE with an actual example image **
      alt: "Example of a Max quality photo avatar generated for 12 credits"
    },
  ];

  const offers: Offer[] = [
    {
      name: "Free Trial",
      credits: 1,
      description: "Get a taste of our AI. Your first logo is on us!",
      plan: "free",
      features: [
        "Generate 1 Text Logo (Speedy Engine)",
        "Perfect for a quick test drive",
      ]
    },
    {
      name: "Starter Pack",
      credits: 20,
      price: 1.99,
      description: "Great for trying out a few styles or a small project.",
      plan: "starter",
      features: [
        "Up to 20 Text Logos (Speedy)",
        "OR up to 5 Text Logos (Balanced)",
        "OR up to 3 Photo Avatars (Pro)",
        "OR 1 Photo Avatar (Max)",
      ]
    },
    {
      name: "Pro Gamer Pack",
      credits: 50,
      price: 3.99,
      description: "Best value for regular creators and small teams.",
      plan: "pro",
      popular: true,
      features: [
        "Up to 50 Text Logos (Speedy)",
        "OR up to 12 Text Logos (Balanced)",
        "OR up to 8 Photo Avatars (Pro)",
        "OR up to 4 Photo Avatars (Max)",
      ]
    },
    {
      name: "Elite Studio Pack",
      credits: 100,
      price: 6.99,
      description: "For power users, clans, and extensive design needs.",
      plan: "elite",
      features: [
        "Up to 100 Text Logos (Speedy)",
        "OR up to 25 Text Logos (Balanced)",
        "OR up to 16 Photo Avatars (Pro)",
        "OR up to 8 Photo Avatars (Max)",
      ]
    },
  ].map((offer) => ({
    ...offer,
    plan: offer.plan as "free" | "starter" | "pro" | "elite",
    pricePerCredit: offer.price ? (offer.price / offer.credits).toFixed(3) : undefined, // Calculate price per credit
  }));

  const handleBuy = async (plan: "starter" | "pro" | "elite") => {
    if (!isLoggedIn) {
      const callbackUrl = window.location.pathname;
      void signIn("google", { callbackUrl });
      return;
    }
    try {
      setLoadingPlan(plan);
      await buyCredits(plan);
    } catch (error) { /* ... (your existing error handling) ... */ }
    finally { setLoadingPlan(null); }
  };

  const faqItems = [
    { q: "What is a credit?", a: "A credit is a token you use to generate logos. Different AI models and generation types have different credit costs, allowing you to choose between speed and maximum quality." },
    { q: "Do my credits expire?", a: "No, your purchased credits never expire! You can use them whenever you need a new logo or avatar." },
    { q: "What can I do with the logos I generate?", a: "Once you download a logo using your credits, you get a full commercial license to use it for your team, stream, YouTube channel, merchandise, and more." },
    { q: "What if I don't like the generated logos?", a: "AI generation is a creative process! We recommend trying different styles and text prompts. Your credits are only consumed for the generations you run. Please see our Refund Policy for more details." },
  ];


  if (sessionStatus === "loading") { /* ... (loading UI) ... */ }

  return (
    <>
      <Head>
        <title>Pricing - Gaming Logo AI | Buy Credits for AI Logo Generation</title>
        <meta name="description" content="Explore affordable credit packs for Gaming Logo AI. From a free trial to our Elite Studio pack, find the perfect plan to generate text logos and AI photo avatars." />
        <meta name="keywords" content="gaming logo pricing, buy credits, ai logo costs, pfp maker price, esports logo packs" />
        <link rel="canonical" href="https://gaminglogoai.com/buy-credits" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen mt-16 sm:mt-24 flex-col container mx-auto gap-12 sm:gap-16 px-4 sm:px-8 py-8 bg-gray-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        <div className="container mx-auto px-4">
          <header className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-4 text-slate-900 dark:text-white">
              Choose Your Power-Up
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
              Every great gamer needs resources. Grab a credit pack to fuel your creativity and generate unlimited logo variations.
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offers.map((offer, index) => {
              const oldPrice = offer.price ? (offer.price * 2).toFixed(2) : undefined;
              return (
                <div key={index} className={`relative flex flex-col border rounded-lg p-6 shadow-xl bg-white dark:bg-slate-800 transition-all duration-300 ${offer.popular ? "border-purple-600 dark:border-cyan-500 ring-2 ring-purple-500 dark:ring-cyan-400" : "border-gray-300 dark:border-slate-700"}`}>
                  {offer.popular && ( <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-purple-600 dark:bg-cyan-500 text-white dark:text-slate-900 text-xs font-semibold uppercase px-4 py-1 rounded-full shadow"> Most Popular </div> )}
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mt-4 mb-2">{offer.name}</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-center text-sm mb-6 h-10">{offer.description}</p>
                  
                  <div className="text-center mb-6">
                    {offer.price !== undefined ? (
                      <>
                        <p className="text-md text-slate-500 dark:text-slate-500 line-through">${oldPrice}</p>
                        <p className="text-5xl font-bold text-slate-800 dark:text-white">${offer.price.toFixed(2)}</p>
                      </>
                    ) : (
                       <p className="text-5xl font-bold text-slate-800 dark:text-white">Free</p>
                    )}
                     <p className="text-4xl font-bold text-slate-800 dark:text-white flex items-baseline justify-center gap-2">
                        <span>{offer.credits}</span> 
                        <span className="text-xl font-medium text-slate-500 dark:text-slate-400">Credits</span>
                    </p>
                    {offer.pricePerCredit && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">~${offer.pricePerCredit} per credit</p>}
                  </div>
                  
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 mb-6 grow">
                    {offer.features.map(feature => (
                        <li key={feature} className="flex items-start">
                            <FaCheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                  </ul>
                  
                  {offer.plan === 'free' ? (
                     <Button variant="secondary" size="md" fullWidth disabled={isLoggedIn} onClick={() => void signIn("google")}>
                        {isLoggedIn ? "Claimed!" : "Sign Up to Claim"}
                     </Button>
                  ) : (
                    <Button
                      id={`plan_${offer.plan}`}
                      onClick={() => { void handleBuy(offer.plan as "starter" | "pro" | "elite"); }}
                      variant={offer.popular ? "primary" : "accent"}
                      size="md"
                      fullWidth
                      isLoading={loadingPlan === offer.plan}
                      disabled={loadingPlan === offer.plan}
                    >
                      {loadingPlan === offer.plan ? "Processing..." : `Get ${offer.name}`}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
           <p className="text-center text-slate-500 dark:text-slate-400 mt-4 text-xs">
            Payments are securely processed by Stripe. Please review our{" "}
            <Link href="/refund-policy" className="text-purple-600 dark:text-purple-400 hover:underline">
              Refund Policy
            </Link>.
          </p>
        </div>
        
        {/* --- HOW CREDITS WORK SECTION --- */}
        <section className="container mx-auto px-4 mt-12 sm:mt-16">
            <h2 className="text-3xl font-bold text-center mb-4 text-slate-900 dark:text-white">
              See What Your Credits Can Create
            </h2>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
                Higher credit costs use more advanced AI models, resulting in greater detail and complexity. Choose the quality that fits your needs.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                {creditExamples.map(example => (
                    <div key={example.type} className="flex flex-col p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-700">
                            <Image 
                                src={example.imageUrl}
                                alt={example.alt}
                                layout="fill"
                                objectFit="cover"
                                className="transition-transform duration-300 hover:scale-105"
                            />
                        </div>
                        <p className="text-purple-600 dark:text-cyan-400 font-bold text-2xl">{example.cost}</p>
                        <p className="text-sm mt-1 text-slate-700 dark:text-slate-200">{example.type}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* --- PRICING FAQ SECTION --- */}
        <section className="container mx-auto px-4 mt-12 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-slate-900 dark:text-white">
                <FaQuestionCircle className="inline-block mr-2 align-middle text-purple-600 dark:text-cyan-400" />
                Pricing FAQ
            </h2>
            <div className="space-y-4">
                {faqItems.map((item, index) => (
                    <details key={index} className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm cursor-pointer group">
                        <summary className="font-semibold text-slate-800 dark:text-white flex justify-between items-center">
                            {item.q}
                            <span className="transform transition-transform duration-200 group-open:rotate-180">▼</span>
                        </summary>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {item.a}
                        </p>
                    </details>
                ))}
            </div>
        </section>
      </main>
    </>
  );
};

export default BuyCreditsPage;