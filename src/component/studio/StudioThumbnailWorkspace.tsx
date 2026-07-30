import { useRouter } from "next/router";
import { useMemo } from "react";

import { FunnelProvider } from "~/component/thumbnailFunnel/FunnelContext";
import { THUMBNAIL_GAMES, type ThumbnailGame } from "~/data/thumbnailGames";
import { THUMBNAIL_GENERATION_CREDITS } from "~/data/thumbnailTemplates";
import { StudioThumbnailFunnel } from "./StudioThumbnailFunnel";

export interface ThumbnailDeepLinkContext {
  game: ThumbnailGame;
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

function resolveThumbnailContext(
  gameQuery: string | undefined,
): ThumbnailDeepLinkContext | null {
  if (!gameQuery) {
    return null;
  }

  const game = normalizeGameSlug(gameQuery);
  if (!game) {
    return null;
  }

  const selectedGame = THUMBNAIL_GAMES.find(
    (candidate) =>
      normalizeGameSlug(candidate.id) === game ||
      normalizeGameSlug(candidate.name) === game,
  );

  return selectedGame ? { game: selectedGame } : null;
}

export function StudioThumbnailWorkspace() {
  const router = useRouter();
  const requestedContext = useMemo(
    () =>
      resolveThumbnailContext(
        typeof router.query.game === "string" ? router.query.game : undefined,
      ),
    [router.query.game],
  );

  if (!router.isReady) {
    return (
      <section className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center shadow-md">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-purple-500" />
        <p className="mt-4 text-sm text-slate-400">
          Preparing your thumbnail workspace…
        </p>
      </section>
    );
  }

  return (
    <section aria-label="YouTube Thumbnail Maker workspace" className="pb-4">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-purple-400">
            Studio Canvas
          </p>
          <h2 className="text-xl font-bold text-slate-50 sm:text-2xl">
            Create your YouTube thumbnail
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Choose a proven gaming content format, add a game, title, and
            optional reference, then generate a platform-ready thumbnail.
          </p>
        </div>
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-400">
          From {THUMBNAIL_GENERATION_CREDITS} credits per thumbnail
        </div>
      </div>

      <FunnelProvider>
        <StudioThumbnailFunnel requestedContext={requestedContext} />
      </FunnelProvider>
    </section>
  );
}
