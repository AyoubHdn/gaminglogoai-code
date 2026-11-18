// src/pages/cancel.tsx
import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link"; // Import Link

const CancelPage: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Payment Canceled - Gaming Logo AI</title>
        <meta name="description" content="Your payment process was canceled. You can try purchasing credits again for Gaming Logo AI." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 px-4">
        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-8 sm:p-12 text-center max-w-md w-full">
          <svg className="mx-auto h-16 w-16 text-red-500 dark:text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-3xl sm:text-4xl font-bold text-red-600 dark:text-red-500 mb-4">
            Payment Canceled
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            It looks like your payment was canceled. No worries, your credits are waiting when you&apos;re ready!
          </p>
          <button
            className="w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out
                       bg-purple-600 hover:bg-purple-700 text-white
                       dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-slate-900
                       transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-cyan-400"
            onClick={() => {
              void router.push("/buy-credits");
            }}
          >
            Try Again
          </button>
          <Link href="/" className="mt-4 inline-block text-sm text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-cyan-400 hover:underline">
              Back to Homepage
          </Link>
        </div>
      </div>
    </>
  );
};

export default CancelPage;