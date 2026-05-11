import clsx from "clsx";
import React, { useMemo, useState } from "react";

import { useFunnel } from "~/component/thumbnailFunnel/FunnelContext";
import { THUMBNAIL_PLATFORMS } from "~/data/thumbnailPlatforms";
import { THUMBNAIL_TEMPLATES } from "~/data/thumbnailTemplates";
import {
  filterTemplates,
  getAvailableFilters,
  type TemplateFilters,
} from "~/lib/templateBrowser";

type FilterDimension = "games";

const FILTER_DIMENSIONS: Array<{
  key: FilterDimension;
  label: string;
}> = [
  { key: "games", label: "Games" },
];

function formatFilterLabel(value: string): string {
  return value
    .split("-")
    .map((part) =>
      /^\d+$/.test(part) ? part : part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(" ");
}

function toFilterSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[â€™']/g, "")
    .replace(/\//g, " ")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getDisplayLabel(value: string): string {
  return formatFilterLabel(value);
}

export function Step1TemplateBrowser() {
  const {
    selectedPlatform,
    selectedTemplateId,
    selectTemplate,
    templateFilters,
    setTemplateFilters,
    setCurrentStep,
  } = useFunnel();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const platformTemplates = useMemo(() => {
    if (!selectedPlatform) {
      return [];
    }

    return THUMBNAIL_TEMPLATES.filter(
      (template) => template.platform === selectedPlatform
    );
  }, [selectedPlatform]);

  const filteredTemplates = useMemo(
    () => filterTemplates(platformTemplates, templateFilters),
    [platformTemplates, templateFilters]
  );

  const filterOptions = useMemo(
    () =>
      Array.from(getAvailableFilters(platformTemplates).games)
        .map((value) => ({
          slug: value,
          label: getDisplayLabel(value),
          sortValue: toFilterSlug(value),
        }))
        .sort((left, right) => left.sortValue.localeCompare(right.sortValue)),
    [platformTemplates]
  );

  const activeFilterCount = useMemo(
    () =>
      FILTER_DIMENSIONS.reduce(
        (count, dimension) => count + (templateFilters[dimension.key]?.length ?? 0),
        0
      ),
    [templateFilters]
  );

  const toggleFilter = (dimension: FilterDimension, value: string) => {
    const currentValues = templateFilters[dimension] ?? [];
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    setTemplateFilters({
      ...templateFilters,
      [dimension]: nextValues,
    });
  };

  const clearFilters = () => {
    setTemplateFilters({});
  };

  const filtersPanel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Filter Templates
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Browse thumbnail presets by game first. We can layer deeper style
            controls in later once the prompt direction is locked in.
          </p>
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-cyan-400 dark:hover:text-cyan-300"
          >
            Clear filters
          </button>
        )}
      </div>

      {FILTER_DIMENSIONS.map((dimension) => {
        const values = filterOptions;

        if (values.length === 0) {
          return null;
        }

        return (
          <section key={dimension.key}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {dimension.label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                const isActive =
                  templateFilters[dimension.key]?.includes(value.slug) ?? false;

                return (
                  <button
                    key={`${dimension.key}-${value.slug}`}
                    type="button"
                    onClick={() => toggleFilter(dimension.key, value.slug)}
                    className={clsx(
                      "rounded-full border px-3 py-1.5 text-sm transition-colors",
                      isActive
                        ? "border-purple-600 bg-purple-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950"
                        : "border-slate-300 bg-white text-slate-700 hover:border-purple-300 hover:text-purple-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
                    )}
                  >
                    {value.label}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );

  return (
    <section className="grid gap-6 lg:grid-cols-[280px,minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {filtersPanel}
        </div>
      </aside>

      <div className="space-y-5">
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
              Choose a Thumbnail Template
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {selectedPlatform
                ? `${THUMBNAIL_PLATFORMS.youtube.displayName} presets • `
                : ""}
              {filteredTemplates.length} matching template
              {filteredTemplates.length === 1 ? "" : "s"} ready for personalization.
            </p>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {activeFilterCount} active
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsMobileFiltersOpen(true)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-purple-300 hover:text-purple-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
            >
              Filters
            </button>
          </div>
        </div>

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
                <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={template.thumbnailUrl}
                    alt={`${template.name} thumbnail preview`}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-slate-950/80 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                    {template.credits} credit{template.credits === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="space-y-2 p-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {template.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      YouTube thumbnail template
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {template.categories.games.slice(0, 2).map((game) => (
                      <span
                        key={`${template.id}-${game}`}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {getDisplayLabel(game)}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-sm lg:hidden">
          <div className="h-full max-w-sm overflow-y-auto bg-white p-5 shadow-2xl dark:bg-slate-950">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Filters
              </h2>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                Close
              </button>
            </div>
            {filtersPanel}
          </div>
        </div>
      )}
    </section>
  );
}
