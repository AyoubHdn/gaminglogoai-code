import clsx from "clsx";
import { useMemo, useState } from "react";
import { useFunnel } from "~/component/bannerFunnel/FunnelContext";
import { PLATFORMS } from "~/data/platforms";
const PLATFORM_SUBTEXT = {
    twitch: "Available now",
    youtube: "YouTube banners launching soon",
    kick: "Kick banners launching soon",
    discord: "Discord banners launching soon",
    tiktok: "TikTok banners launching soon",
};
const PLATFORM_ICON_STYLE = {
    twitch: "bg-purple-600 text-white",
    youtube: "bg-red-600 text-white",
    kick: "bg-emerald-500 text-emerald-950",
    discord: "bg-indigo-500 text-white",
    tiktok: "bg-slate-900 text-white",
};
function getPlatformInitial(name) {
    return name.trim().charAt(0).toUpperCase();
}
export function Step0PlatformSelector() {
    const { selectedPlatform, setSelectedPlatform, setCurrentStep } = useFunnel();
    const [tooltipPlatformId, setTooltipPlatformId] = useState(null);
    const platforms = useMemo(() => {
        return Object.values(PLATFORMS)
            .map((platform) => {
            const bannerSurface = platform.surfaces.banner;
            if (!bannerSurface) {
                return null;
            }
            return {
                id: platform.id,
                name: platform.displayName,
                enabled: platform.enabled,
                width: bannerSurface.canvas.width,
                height: bannerSurface.canvas.height,
            };
        })
            .filter((platform) => Boolean(platform));
    }, []);
    return (<section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-medium text-purple-600 dark:text-cyan-400">
          Step 1 of 4
        </p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Choose your platform
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Pick the platform you&apos;re creating a banner for. We&apos;ll generate
          it at the exact dimensions that platform expects.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {platforms.map((platform) => {
            const isSelected = selectedPlatform === platform.id;
            const comingSoonLabel = PLATFORM_SUBTEXT[platform.id];
            return (<button key={platform.id} type="button" disabled={!platform.enabled} title={platform.enabled ? undefined : comingSoonLabel} onClick={() => {
                    if (!platform.enabled) {
                        setTooltipPlatformId(platform.id);
                        return;
                    }
                    setSelectedPlatform(platform.id);
                    setCurrentStep("step1");
                }} className={clsx("relative overflow-hidden rounded-2xl border bg-white p-5 text-left shadow-sm transition-all dark:bg-slate-900", platform.enabled
                    ? "hover:-translate-y-0.5 hover:border-purple-400 hover:shadow-lg dark:hover:border-cyan-400"
                    : "cursor-not-allowed border-slate-200 opacity-75 dark:border-slate-800", isSelected
                    ? "border-purple-500 ring-2 ring-purple-500/20 dark:border-cyan-400 dark:ring-cyan-400/20"
                    : "border-slate-200 dark:border-slate-800")}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={clsx("flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold", PLATFORM_ICON_STYLE[platform.id])}>
                    {getPlatformInitial(platform.name)}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {platform.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {platform.width} × {platform.height}
                    </p>
                  </div>
                </div>

                <span className={clsx("rounded-full px-2.5 py-1 text-xs font-semibold", platform.enabled
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                    : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300")}>
                  {platform.enabled ? "Available" : "Coming soon"}
                </span>
              </div>

              {!platform.enabled && tooltipPlatformId === platform.id && (<p className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {comingSoonLabel}
                </p>)}
            </button>);
        })}
      </div>
    </section>);
}
