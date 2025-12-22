/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";

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
          if (data.payout >= 0.5) {
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
            <Link
              href="/generate"
              className="inline-block mt-6 px-6 py-3 bg-purple-600 text-white rounded"
            >
              Generate My Logo
            </Link>
          </>
        )}

        {result === "screenout_bonus" && (
          <>
            <h1 className="text-2xl font-bold text-yellow-500">
              ⚠️ Survey Ended Early
            </h1>
            <p className="mt-3">
              You earned a small bonus (${payout.toFixed(2)}).
            </p>
            <Link
              href="/free-credit"
              className="inline-block mt-6 px-6 py-3 bg-purple-600 text-white rounded"
            >
              Try Another Survey
            </Link>
          </>
        )}

        {result === "screenout_no_bonus" && (
          <>
            <h1 className="text-2xl font-bold text-gray-600">
              ❌ Not Eligible
            </h1>
            <p className="mt-3">
              This survey wasn’t a match. No reward this time.
            </p>
            <Link
              href="/dashboard"
              className="inline-block mt-6 px-6 py-3 bg-gray-700 text-white rounded"
            >
              Back to Dashboard
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
