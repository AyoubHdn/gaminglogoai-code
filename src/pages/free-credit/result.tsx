/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";

type Result =
  | "loading"
  | "completed"
  | "screenout_no_bonus"
  | "screenout_bonus"
  | "rejected"
  | "pending"
  | "error";

export default function FreeCreditResult() {
  const [result, setResult] = useState<Result>("loading");

  useEffect(() => {
    fetch("/api/cpa/cpx/result", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.error) {
          setResult("error");
          return;
        }

        if (data.status === "pending") {
          setResult("pending");
          return;
        }

        if (data.status === "rejected") {
          setResult("rejected");
          return;
        }

        // ✅ Backend is authoritative
        // Any payout > 0 already mapped to:
        // result = "complete" | "screenout_bonus"
        if (
          data.result === "complete" ||
          data.result === "screenout_bonus"
        ) {
          setResult("completed");
          return;
        }

        if (data.result === "screenout_no_bonus") {
          setResult("screenout_no_bonus");
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
        {/* Loading */}
        {result === "loading" && <p>Checking your reward…</p>}

        {/* Pending */}
        {result === "pending" && (
          <p className="text-gray-600">
            ⏳ Verifying your reward… Please wait.
          </p>
        )}

        {/* ✅ Completed (complete OR bonus OR out_okay) */}
        {result === "completed" && (
          <>
            <h1 className="text-2xl font-bold text-green-600">
              🎉 Free Credit Unlocked!
            </h1>
            <p className="mt-3">
              You earned <strong>1 free credit</strong>. Choose what to generate:
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/gaming-logo-maker"
                className="px-6 py-3 bg-purple-600 text-white rounded"
              >
                Generate Gaming Logo
              </Link>

              <Link
                href="/twitch-banner-generator"
                className="px-6 py-3 bg-indigo-600 text-white rounded"
              >
                Generate Twitch Banner
              </Link>
            </div>
          </>
        )}

        {/* ❌ Screenout without bonus (out_quality) */}
        {result === "screenout_no_bonus" && (
          <>
            <h1 className="text-2xl font-bold text-gray-600">
              ❌ Not Eligible This Time
            </h1>
            <p className="mt-3">
              This survey wasn’t a good match. You can try another one.
            </p>

            <Link
              href="/free-credit"
              className="inline-block mt-6 px-6 py-3 bg-purple-600 text-white rounded"
            >
              Try Another Survey
            </Link>
          </>
        )}

        {/* ❌ Rejected / reversed */}
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

        {/* Error */}
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
