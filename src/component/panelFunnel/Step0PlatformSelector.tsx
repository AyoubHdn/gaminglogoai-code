import clsx from "clsx";

import { useFunnel } from "~/component/panelFunnel/FunnelContext";
import { PANEL_PLATFORMS } from "~/data/panelPlatforms";

export function Step0PlatformSelector() {
  const { selectedPlatform, setSelectedPlatform, setCurrentStep } = useFunnel();
  const platform = PANEL_PLATFORMS.twitch;
  const isSelected = selectedPlatform === platform.id;

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-medium text-purple-600 dark:text-cyan-400">
          Step 1 of 4
        </p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Choose your platform
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          We&apos;re starting with platforms that actually use panel-style channel
          graphics in a meaningful way.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:max-w-xl">
        <button
          type="button"
          onClick={() => {
            setSelectedPlatform(platform.id);
            setCurrentStep("step1");
          }}
          className={clsx(
            "relative overflow-hidden rounded-2xl border bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900",
            isSelected
              ? "border-purple-500 ring-2 ring-purple-500/20 dark:border-cyan-400 dark:ring-cyan-400/20"
              : "border-slate-200 hover:border-purple-300 dark:border-slate-800 dark:hover:border-cyan-400"
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-base font-bold text-white">
                T
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {platform.displayName}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  About section panels and branded info blocks
                </p>
              </div>
            </div>

            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
              Available
            </span>
          </div>

          <p className="mt-4 max-w-xl text-sm text-slate-600 dark:text-slate-300">
            {platform.description}
          </p>
        </button>
      </div>
    </section>
  );
}
