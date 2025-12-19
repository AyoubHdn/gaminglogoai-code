/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useState } from "react";
import Head from "next/head";
import { getDeviceInfo } from "~/lib/getDevice";

interface Offer {
  id: string;
  title: string;
  description: string;
}

export default function FreeCreditUnlock() {
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { device, os } = getDeviceInfo();

    fetch(`/api/cpa/offer?device=${device}&os=${os}`)
      .then((res) => res.json())
      .then((data: { offer: Offer }) => {
        setOffer(data.offer);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Unlock Free Credit</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="max-w-lg mx-auto mt-20 text-center">
        {loading && <p>Loading offers…</p>}

        {!loading && !offer && (
          <div>
            <h2 className="text-xl font-bold">
              Free credit unavailable
            </h2>
            <p className="mt-2 text-gray-500">
              No tasks available for your region or device.
              Please check back later.
            </p>
          </div>
        )}

        {!loading && offer && (
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold">{offer.title}</h2>
            <p className="mt-2 text-gray-600">
              {offer.description}
            </p>

            <button
              className="mt-4 px-6 py-3 bg-purple-600 text-white rounded"
              onClick={() => {
                window.open(
                  `/api/cpa/mylead/unlock?offerId=${offer.id}`,
                  "_blank"
                );
              }}
            >
              Unlock 1 Free Credit
            </button>
          </div>
        )}
      </div>
    </>
  );
}
