import { useRouter } from "next/router";
import { useMemo } from "react";

import { PANEL_TEMPLATES, type PanelTemplate } from "~/data/panelTemplates";
import { getPanelBatchCredits } from "~/lib/panelPricing";
import { StudioPanelsFunnel } from "./StudioPanelsFunnel";

export interface PanelsDeepLinkContext {
  game: string;
  template: PanelTemplate;
}

function normalizeGameSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function resolvePanelsContext(
  gameQuery: string | undefined,
): PanelsDeepLinkContext | null {
  if (!gameQuery) {
    return null;
  }

  const game = normalizeGameSlug(gameQuery);
  if (!game) {
    return null;
  }

  const template = PANEL_TEMPLATES.find(
    (candidate) =>
      candidate.platform === "twitch" &&
      candidate.categories.games.some(
        (candidateGame) => normalizeGameSlug(candidateGame) === game,
      ),
  );

  return template ? { game, template } : null;
}

export function StudioPanelsWorkspace() {
  const router = useRouter();
  const requestedContext = useMemo(
    () =>
      resolvePanelsContext(
        typeof router.query.game === "string" ? router.query.game : undefined,
      ),
    [router.query.game],
  );
  const firstPanelCredits = getPanelBatchCredits(1);
  const additionalPanelCredits =
    getPanelBatchCredits(2) - firstPanelCredits;

  if (!router.isReady) {
    return (
      <section className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center shadow-md">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-purple-500" />
        <p className="mt-4 text-sm text-slate-400">
          Preparing your panels workspace…
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Twitch Panels Maker workspace" className="pb-4">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-purple-400">
            Studio Canvas
          </p>
          <h2 className="text-xl font-bold text-slate-50 sm:text-2xl">
            Create a matching Twitch panel set
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Choose a game-based direction, select the panels your channel needs,
            and generate the complete set with one consistent style.
          </p>
        </div>
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-400">
          {firstPanelCredits} credits first panel · {additionalPanelCredits} each
          after
        </div>
      </div>

      <StudioPanelsFunnel requestedContext={requestedContext} />
    </section>
  );
}
