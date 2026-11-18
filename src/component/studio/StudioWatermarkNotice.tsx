import Link from "next/link";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";

export function StudioWatermarkNotice() {
  const { status } = useSession();
  const watermarkStatus = api.user.getWatermarkStatus.useQuery(undefined, {
    enabled: status === "authenticated",
    staleTime: 30_000,
  });

  if (!watermarkStatus.data?.watermarked) {
    return null;
  }

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3">
      <p className="text-sm text-amber-100">
        Downloads before your first credit purchase include a small
        GamingLogoAI.com watermark.
      </p>
      <Link
        href="/buy-credits"
        className="inline-flex items-center justify-center rounded-lg bg-amber-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
      >
        Remove watermark
      </Link>
    </div>
  );
}
