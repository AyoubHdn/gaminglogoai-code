import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { gamerStylesData } from "~/data/gamerStylesData";
import { LOGO_MODEL_CREDITS } from "~/lib/generationPricing";
import { StudioLogoFunnel } from "./StudioLogoFunnel";

function resolveGameSubcategory(gameQuery: string | undefined): string | null {
  if (!gameQuery) {
    return null;
  }

  const normalizedGame = gameQuery.trim().toLowerCase();
  if (!normalizedGame) {
    return null;
  }

  const gameTitleCategories = gamerStylesData["Game Titles"];
  if (!gameTitleCategories) {
    return null;
  }

  return (
    Object.keys(gameTitleCategories).find(
      (subcategory) => subcategory.toLowerCase() === normalizedGame,
    ) ?? null
  );
}

export function StudioLogoWorkspace() {
  const router = useRouter();
  const [isPrepared, setIsPrepared] = useState(false);

  const requestedGame = useMemo(
    () =>
      resolveGameSubcategory(
        typeof router.query.game === "string" ? router.query.game : undefined,
      ),
    [router.query.game],
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!requestedGame) {
      setIsPrepared(true);
      return;
    }

    setIsPrepared(true);
  }, [requestedGame, router.isReady]);

  if (!isPrepared) {
    return (
      <section className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center shadow-md">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-500" />
        <p className="mt-4 text-sm text-slate-400">
          Preparing your logo workspace…
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Gaming Logo Maker workspace" className="pb-4">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-purple-400">
            Studio Canvas
          </p>
          <h2 className="text-xl font-bold text-slate-50 sm:text-2xl">
            Create your gaming logo
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Your existing logo generator is running here with the same styles,
            engines, credits, and saved results.
          </p>
        </div>
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-400">
          {LOGO_MODEL_CREDITS["flux-schnell"]}–
          {LOGO_MODEL_CREDITS["flux-dev"]} credits per logo
        </div>
      </div>

      <StudioLogoFunnel requestedGame={requestedGame} />
    </section>
  );
}
