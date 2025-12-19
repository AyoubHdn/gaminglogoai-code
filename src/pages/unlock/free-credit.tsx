/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useState } from "react";
import Head from "next/head";
import { getDeviceInfo } from "~/lib/getDevice";

interface Offer {
  externalId: string;
  title: string;
  description: string;
}

export default function FreeCreditUnlock() {
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { device, os } = getDeviceInfo();

    fetch(`/api/cpa/offer?device=${device}&os=${os}`)
      .then((res) => res.json())
      .then((data: { offer: Offer }) => {
        setOffer(data.offer);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const unlock = async () => {
    if (!offer) return;

    setUnlocking(true);
    setError(null);

    try {
      const res = await fetch("/api/cpa/cpagrip/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId: offer.externalId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unlock failed");
      }

      // Redirect to CPAGrip offer
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
        {loading && <p>Loading offers…</p>}

        {!loading && !offer && (
          <>
            <h2 className="text-xl font-bold">Free credit unavailable</h2>
            <p className="mt-2 text-gray-500">
              No tasks available for your region or device.
            </p>
          </>
        )}

        {!loading && offer && (
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold">{offer.title}</h2>
            <p className="mt-2 text-gray-600">{offer.description}</p>

            <button
              className="mt-4 px-6 py-3 bg-purple-600 text-white rounded"
              onClick={unlock}
              disabled={unlocking}
            >
              {unlocking ? "Redirecting…" : "Unlock 1 Free Credit"}
            </button>

            {error && (
              <p className="mt-3 text-red-500 text-sm">{error}</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
