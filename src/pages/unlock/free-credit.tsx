/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Head from "next/head";

export default function FreeCreditUnlock() {
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unlock = async () => {
    setUnlocking(true);
    setError(null);

    try {
      const res = await fetch("/api/cpa/cpx/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      let data: any;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data.error || "Unlock failed");
      }

      // Redirect user to CPX survey wall
      window.location.href = data.redirectUrl;
    } catch (err) {
      setError((err as Error).message);
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

          {error && (
            <p className="mt-3 text-red-500 text-sm">{error}</p>
          )}
        </div>
      </div>
    </>
  );
}
