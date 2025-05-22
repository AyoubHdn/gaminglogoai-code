// src/pages/success.tsx
import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";

// No need for 'declare global' here if it's in global.ts

const SuccessPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const conversionId = "AW-YOUR_GAMINGLOGOAI_CONVERSION_ID"; // Replace!
    const conversionLabel = "YOUR_GAMINGLOGOAI_PURCHASE_LABEL"; // Replace!

    if (typeof window !== "undefined" && window.gtag) { // gtag is now correctly typed from global.ts
      const transactionId = (router.query.session_id as string) || `tx_${Date.now()}`;
      let purchaseValue = 1.0; // Default value
      if (router.query.amount && !isNaN(parseFloat(router.query.amount as string))) {
          purchaseValue = parseFloat(router.query.amount as string);
      }

      window.gtag("event", "conversion", {
        send_to: `${conversionId}/${conversionLabel}`,
        value: purchaseValue,
        currency: (router.query.currency as string) || "USD", // Get currency from query or default
        transaction_id: transactionId,
      });
      console.log('GTag conversion event sent for GamingLogoAI purchase.');
    } else {
      console.log('GTag not available on window or not a function.');
    }
  }, [router.query]); // Depend on router.query to re-run if it changes

  return (
    <>
      <Head>
        <title>Payment Successful! - Gaming Logo AI</title>
        <meta name="description" content="Your credit purchase for Gaming Logo AI was successful. Start designing your new gaming logos now!" />
        <link rel="icon" href="/favicon-gaming.ico" /> {/* Ensure this exists */}
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 px-4">
        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-8 sm:p-12 text-center max-w-md w-full">
          <svg className="mx-auto h-16 w-16 text-green-500 dark:text-green-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-500 mb-4">
            Payment Successful!
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Awesome! Your credits have been added. Time to forge some legendary logos!
          </p>
          <button
            className="w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out
                       bg-purple-600 hover:bg-purple-700 text-white
                       dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-slate-900
                       transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-cyan-400"
            onClick={() => {
              void router.push("/gaming-logo-maker"); // Or your main generator page
            }}
          >
            Start Designing Now
          </button>
           <Link href="/collection"  className="mt-4 inline-block text-sm text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-cyan-400 hover:underline">
              View My Logos
          </Link>
        </div>
      </div>
    </>
  );
};

export default SuccessPage;