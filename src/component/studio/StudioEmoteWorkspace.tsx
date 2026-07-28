import {
  EMOTE_BASE_CREDITS,
  EMOTE_EXPRESSION_CREDITS,
} from "~/lib/generationPricing";
import { StudioEmoteFunnel } from "./StudioEmoteFunnel";

export function StudioEmoteWorkspace() {
  return (
    <section aria-label="Twitch Emote Maker workspace" className="pb-4">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-purple-400">
            Studio Canvas
          </p>
          <h2 className="text-xl font-bold text-slate-50 sm:text-2xl">
            Create your Twitch emote set
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Turn a photo into one consistent base character, then generate the
            expressions your community uses most.
          </p>
        </div>
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-400">
          {EMOTE_BASE_CREDITS} credits base · {EMOTE_EXPRESSION_CREDITS} per
          emote
        </div>
      </div>

      <StudioEmoteFunnel />
    </section>
  );
}
