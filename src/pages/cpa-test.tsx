/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { useState } from "react";

export default function CpaTestPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unlock = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/cpa/cpagrip/unlock", {
        method: "POST",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Request failed");
      }

      const data = await res.json();

      // Redirect user to CPA offer
      window.location.href = data.redirectUrl;
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>CPA Test Page</h1>
      <p>Click to unlock 1 free credit.</p>

      <button
        onClick={unlock}
        disabled={loading}
        style={{
          padding: "12px 20px",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        {loading ? "Redirecting..." : "Unlock 1 Free Credit"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
