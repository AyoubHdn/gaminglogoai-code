import clsx from "clsx";
import React, { useMemo, useState } from "react";

import { useFunnel } from "~/component/panelFunnel/FunnelContext";
import { PANEL_PLATFORMS } from "~/data/panelPlatforms";
import { PANEL_TEMPLATES } from "~/data/panelTemplates";
import { getPanelBatchCredits } from "~/lib/panelPricing";

function formatGameLabel(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function Step1TemplateBrowser() {
  const {
    selectedPlatform,
    selectedTemplateId,
    selectTemplate,
    setCurrentStep,
  } = useFunnel();
  const [activeGameFilter, setActiveGameFilter] = useState<string | null>(null);

  const platformTemplates = useMemo(() => {
    if (!selectedPlatform) {
      return [];
    }

    return PANEL_TEMPLATES.filter(
      (template) => template.platform === selectedPlatform
    );
  }, [selectedPlatform]);

  const availableGames = useMemo(
    () =>
      Array.from(
        new Set(platformTemplates.flatMap((template) => template.categories.games))
      ),
    [platformTemplates]
  );

  const filteredTemplates = useMemo(() => {
    if (!activeGameFilter) {
      return platformTemplates;
    }

    return platformTemplates.filter((template) =>
      template.categories.games.includes(activeGameFilter)
    );
  }, [activeGameFilter, platformTemplates]);
  const minimumBatchCredits = getPanelBatchCredits(1);
  const threePanelCredits = getPanelBatchCredits(3);

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <button
            type="button"
            onClick={() => setCurrentStep("step0")}
            className="mb-2 inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-cyan-400 dark:hover:text-cyan-300"
          >
            Back
          </button>
          <p className="text-sm font-medium text-purple-600 dark:text-cyan-400">
            Step 2 of 4
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Choose a Game-Based Panel Template
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {selectedPlatform
              ? `${PANEL_PLATFORMS[selectedPlatform].displayName} presets`
              : "Panel presets"}{" "}
            built around game direction first, then panel styling.
          </p>
        </div>
      </div>

      {availableGames.length > 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveGameFilter(null)}
              className={clsx(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                activeGameFilter === null
                  ? "border-purple-600 bg-purple-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950"
                  : "border-slate-300 bg-white text-slate-700 hover:border-purple-300 hover:text-purple-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
              )}
            >
              All Games
            </button>

            {availableGames.map((game) => (
              <button
                key={game}
                type="button"
                onClick={() => setActiveGameFilter(game)}
                className={clsx(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  activeGameFilter === game
                    ? "border-purple-600 bg-purple-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950"
                    : "border-slate-300 bg-white text-slate-700 hover:border-purple-300 hover:text-purple-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
                )}
              >
                {formatGameLabel(game)}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {!selectedPlatform ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900/60">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            Choose a platform first
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Start with the platform so we can keep the panel experience aligned
            with how creators actually use it.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredTemplates.map((template) => {
            const isSelected = template.id === selectedTemplateId;

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => selectTemplate(template.id)}
                className={clsx(
                  "group overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900",
                  isSelected
                    ? "border-purple-500 ring-2 ring-purple-500/20 dark:border-cyan-400 dark:ring-cyan-400/20"
                    : "border-slate-200 hover:border-purple-300 dark:border-slate-800 dark:hover:border-cyan-400"
                )}
              >
                <div className="relative aspect-[16/5] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={template.previewUrl}
                    alt={`${template.name} panel preview`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-slate-950/80 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                    {minimumBatchCredits}-{threePanelCredits} credits
                  </span>
                </div>
                <div className="space-y-2 p-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {template.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {formatGameLabel(template.categories.games[0] ?? "gaming")} panel template
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {template.categories.games.slice(0, 1).map((game) => (
                      <span
                        key={`${template.id}-${game}`}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {formatGameLabel(game)}
                      </span>
                    ))}
                    {template.categories.colors.slice(0, 2).map((color) => (
                      <span
                        key={`${template.id}-${color}`}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
