// src/pages/free-credit/result.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
const GENERATORS = [
    {
        href: "/gaming-logo-maker",
        title: "Gaming Logo Maker",
        description: "Create a professional gaming logo in seconds",
    },
    {
        href: "/banner-maker",
        title: "Twitch Banner Maker",
        description: "Design a custom Twitch banner for your channel",
    },
];
function GeneratorLinks() {
    return (<div className="mt-6 grid gap-4">
      {GENERATORS.map((g) => (<Link key={g.href} href={g.href} className="block border rounded-lg p-4 hover:border-purple-600 transition">
          <h3 className="font-semibold text-lg">{g.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{g.description}</p>
        </Link>))}
    </div>);
}
export default function FreeCreditResult() {
    const [result, setResult] = useState("loading");
    const [payout, setPayout] = useState(0);
    useEffect(() => {
        fetch("/api/cpa/cpx/result", { credentials: "include" })
            .then(res => res.json())
            .then(data => {
            var _a;
            if (!data || data.error) {
                setResult("error");
                return;
            }
            if (data.status === "approved") {
                if (data.payout > 0) {
                    setResult("completed");
                }
                else if (data.payout > 0) {
                    setResult("screenout_bonus");
                }
                else {
                    setResult("screenout_no_bonus");
                }
                setPayout((_a = data.payout) !== null && _a !== void 0 ? _a : 0);
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
    return (<>
      <Head>
        <title>Free Credit Result</title>
        <meta name="robots" content="noindex,nofollow"/>
      </Head>

      <div className="max-w-lg mx-auto mt-20 text-center">
        {result === "loading" && <p>Checking your reward…</p>}

        {result === "pending" && (<p>⏳ Verifying your reward… Please wait.</p>)}

        {result === "completed" && (<>
            <h1 className="text-2xl font-bold text-green-600">
              🎉 Survey Completed!
            </h1>
            <p className="mt-3">
              You earned <strong>1 free credit</strong>.
            </p>
            <GeneratorLinks />
          </>)}

        {result === "screenout_bonus" && (<>
            <h1 className="text-2xl font-bold text-yellow-500">
              Survey Ended Early
            </h1>
            <p className="mt-3">
              You earned <strong>1 free credit</strong>.
            </p>
            <GeneratorLinks />
          </>)}

        {result === "screenout_no_bonus" && (<>
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
            <Link href="/unlock/free-credit" className="inline-block mt-6 px-6 py-3 bg-purple-600 text-white rounded">
              Try Another Survey
            </Link>
          </>)}

        {result === "rejected" && (<>
            <h1 className="text-2xl font-bold text-red-600">
              ⚠️ Reward Reversed
            </h1>
            <p className="mt-3">
              This reward was canceled by the provider.
            </p>
            <Link href="/dashboard" className="inline-block mt-6 px-6 py-3 bg-gray-700 text-white rounded">
              Back to Dashboard
            </Link>
          </>)}

        {result === "error" && (<>
            <h1 className="text-2xl font-bold text-red-600">
              Something went wrong
            </h1>
            <p className="mt-3">
              We couldn’t verify your reward. Please try again later.
            </p>
          </>)}
      </div>
    </>);
}
