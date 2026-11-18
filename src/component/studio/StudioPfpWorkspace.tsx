import { useRouter } from "next/router";
import { useMemo } from "react";

import { faceStylesData } from "~/data/faceStylesData";
import { PFP_MODEL_CREDITS } from "~/lib/generationPricing";
import { StudioPfpFunnel, type PfpStyleContext } from "./StudioPfpFunnel";

function normalizeStyleLookup(value: string): string {
  return value.trim().toLowerCase().replace(/[-_]+/g, " ");
}

function resolvePfpStyleContext(
  styleQuery: string | undefined,
): PfpStyleContext | null {
  if (!styleQuery) {
    return null;
  }

  const normalizedQuery = normalizeStyleLookup(styleQuery);
  if (!normalizedQuery) {
    return null;
  }

  for (const [category, subcategories] of Object.entries(faceStylesData)) {
    for (const [subcategory, styles] of Object.entries(subcategories)) {
      const exactStyle = styles.find(
        (style) => normalizeStyleLookup(style.name) === normalizedQuery,
      );

      if (exactStyle) {
        return { category, subcategory, style: exactStyle };
      }
    }
  }

  return null;
}

export function StudioPfpWorkspace() {
  const router = useRouter();
  const requestedStyleContext = useMemo(
    () =>
      resolvePfpStyleContext(
        typeof router.query.game === "string" ? router.query.game : undefined,
      ),
    [router.query.game],
  );

  if (!router.isReady) {
    return (
      <section className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center shadow-md">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-purple-500" />
        <p className="mt-4 text-sm text-slate-400">
          Preparing your PFP workspace…
        </p>
      </section>
    );
  }

  return (
    <section aria-label="PFP and Avatar Maker workspace" className="pb-4">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-purple-400">
            Studio Canvas
          </p>
          <h2 className="text-xl font-bold text-slate-50 sm:text-2xl">
            Create your gaming PFP
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Upload a photo, choose an existing avatar style, and generate with
            the same engines, credits, and saved outputs as the PFP maker.
          </p>
        </div>
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-400">
          {PFP_MODEL_CREDITS["flux-kontext-pro"]}–
          {PFP_MODEL_CREDITS["flux-kontext-max"]} credits per PFP
        </div>
      </div>

      <StudioPfpFunnel requestedStyleContext={requestedStyleContext} />
    </section>
  );
}
