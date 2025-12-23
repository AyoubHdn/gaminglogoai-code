/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";


  const GENERATORS = [
  {
    href: "/gaming-logo-maker",
    title: "Gaming Logo Generator",
    description: "Create a professional gaming logo in seconds",
  },
  {
    href: "/twitch-banner-generator",
    title: "Twitch Banner Generator",
    description: "Design a custom Twitch banner for your channel",
  },
];

function GeneratorLinks() {
  return (
    <div className="mt-6 grid gap-4">
      {GENERATORS.map((g) => (
        <Link
          key={g.href}
          href={g.href}
          className="block border rounded-lg p-4 hover:border-purple-600 transition"
        >
          <h3 className="font-semibold text-lg">{g.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{g.description}</p>
        </Link>
      ))}
    </div>
  );
}

type Result =
  | "loading"
  | "completed"
  | "screenout_bonus"
  | "screenout_no_bonus"
  | "rejected"
  | "pending"
  | "error";

export default function FreeCreditResult() {
  const [result, setResult] = useState<Result>("loading");
  const [payout, setPayout] = useState<number>(0);



  useEffect(() => {
    fetch("/api/cpa/cpx/result", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (!data || data.error) {
          setResult("error");
          return;
        }

        if (data.status === "approved") {
          if (data.payout > 0) {
            setResult("completed");
          } else if (data.payout > 0) {
            setResult("screenout_bonus");
          } else {
            setResult("screenout_no_bonus");
          }
          setPayout(data.payout ?? 0);
          return;
        }

        if (data.status === "screenout") {
          setResult("screenout_no_bonus");
          return;
        }

        if (data.status === "rejected") {
          setResult("rejected");
          return;
        }

        if (data.status === "pending") {
          setResult("pending");
          return;
        }

        setResult("error");
      })
      .catch(() => setResult("error"));
  }, []);

  return (
    <>
      <Head>
        <title>Free Credit Result</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="max-w-lg mx-auto mt-20 text-center">
        {result === "loading" && <p>Checking your reward…</p>}

        {result === "pending" && (
          <p>⏳ Verifying your reward… Please wait.</p>
        )}

        {result === "completed" && (
          <>
            <h1 className="text-2xl font-bold text-green-600">
              🎉 Survey Completed!
            </h1>
            <p className="mt-3">
              You earned <strong>1 free credit</strong>.
            </p>
            <GeneratorLinks />
          </>
        )}

        {result === "screenout_bonus" && (
          <>
            <h1 className="text-2xl font-bold text-yellow-500">
              Survey Ended Early
            </h1>
            <p className="mt-3">
              You earned <strong>1 free credit</strong>.
            </p>
            <GeneratorLinks />
          </>
        )}

        {result === "screenout_no_bonus" && (
          <>
            <h1 className="text-2xl font-bold text-gray-700">
              Survey Not a Match
            </h1>
            <p className="mt-3 text-gray-600">
              This survey wasn’t the right fit for your profile.
              Don’t worry — this happens often and is completely normal.
            </p>
            <p className="mt-2 text-gray-500 text-sm">
              Try another survey to earn your free credit.
            </p>
            <Link
              href="/unlock/free-credit"
              className="inline-block mt-6 px-6 py-3 bg-purple-600 text-white rounded"
            >
              Try Another Survey
            </Link>
          </>
        )}

        {result === "rejected" && (
          <>
            <h1 className="text-2xl font-bold text-red-600">
              ⚠️ Reward Reversed
            </h1>
            <p className="mt-3">
              This reward was canceled by the provider.
            </p>
            <Link
              href="/dashboard"
              className="inline-block mt-6 px-6 py-3 bg-gray-700 text-white rounded"
            >
              Back to Dashboard
            </Link>
          </>
        )}

        {result === "error" && (
          <>
            <h1 className="text-2xl font-bold text-red-600">
              Something went wrong
            </h1>
            <p className="mt-3">
              We couldn’t verify your reward. Please try again later.
            </p>
          </>
        )}
      </div>
    </>
  );
}
