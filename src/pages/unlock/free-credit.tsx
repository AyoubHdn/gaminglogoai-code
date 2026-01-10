// src/pages/unlock/free-credit.tsx
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function FreeCreditUnlock() {
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);

  const unlock = async () => {
    setUnlocking(true);
    setError(null);
    setRetryAfter(null);

    try {
      const res = await fetch("/api/cpa/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      let data: any;
      try {
        data = await res.json();
        if (res.status === 403 && data?.error) {
          setError(data.error);
          return;
        }

      } catch {
        throw new Error("Invalid server response");
      }

      // 🔐 Not logged in
      if (res.status === 401) {
        setError("You must sign in to start a survey.");
        return;
      }

      // ⏳ Pending survey cooldown
      if (!res.ok && data?.retryAfterMinutes) {
        setRetryAfter(data.retryAfterMinutes);
        setError(
          `You already started a survey. Try again in ${data.retryAfterMinutes} minute${
            data.retryAfterMinutes > 1 ? "s" : ""
          }.`
        );
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Unlock failed");
      }

      // ✅ Redirect to CPX
      window.location.href = data.redirectUrl;
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <>
      <Head>
        <title>Unlock Free Credit</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="max-w-lg mx-auto mt-20 text-center">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-bold">Unlock 1 Free Credit</h2>
          <p className="mt-2 text-gray-600">
            Complete a short survey to unlock one free gaming credit.
          </p>

          <button
            className="mt-4 px-6 py-3 bg-purple-600 text-white rounded disabled:opacity-60"
            onClick={unlock}
            disabled={unlocking}
          >
            {unlocking ? "Redirecting…" : "Start Survey"}
          </button>

          {/* 🔐 Login hint */}
          {error === "You must sign in to start a survey." && (
            <p className="mt-3 text-sm text-gray-600">
              Please{" "}
              <Link href="/api/auth/signin" className="text-purple-600 underline">
                sign in
              </Link>{" "}
              to continue.
            </p>
          )}

          {/* ⏳ Pending / generic error */}
          {error && error !== "You must sign in to start a survey." && (
            <p className="mt-3 text-red-500 text-sm">{error}</p>
          )}

          {/* ⏱ Retry hint */}
          {retryAfter !== null && (
            <p className="mt-2 text-xs text-gray-500">
              Surveys reset automatically after the cooldown.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
