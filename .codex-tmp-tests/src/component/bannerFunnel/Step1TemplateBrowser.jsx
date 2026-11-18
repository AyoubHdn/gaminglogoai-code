import clsx from "clsx";
import React, { useMemo, useState } from "react";
import { useFunnel } from "~/component/bannerFunnel/FunnelContext";
import { BANNER_TEMPLATES } from "~/data/bannerTemplates";
import { gamerStylesData } from "~/data/gamerStylesData";
import { PLATFORMS } from "~/data/platforms";
import { filterTemplates } from "~/lib/templateBrowser";
const FILTER_DIMENSIONS = [
    { key: "games", label: "Games", sourceCategory: "Game Titles" },
    { key: "styles", label: "Styles", sourceCategory: "Art" },
    { key: "themes", label: "Themes", sourceCategory: "Themes & Motifs" },
    { key: "colors", label: "Colors", sourceCategory: "Colors" },
];
function formatFilterLabel(value) {
    return value
        .split("-")
        .map((part) => /^\d+$/.test(part) ? part : part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}
function toFilterSlug(value) {
    return value
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[’']/g, "")
        .replace(/\//g, " ")
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}
const FILTER_OPTIONS = FILTER_DIMENSIONS.reduce((options, dimension) => {
    var _a;
    options[dimension.key] = Object.keys((_a = gamerStylesData[dimension.sourceCategory]) !== null && _a !== void 0 ? _a : {}).map((label) => ({
        slug: toFilterSlug(label),
        label,
    }));
    return options;
}, {
    games: [],
    styles: [],
    themes: [],
    colors: [],
});
const FILTER_LABEL_LOOKUP = new Map(Object.values(FILTER_OPTIONS)
    .flat()
    .map((option) => [option.slug, option.label]));
function getDisplayLabel(value) {
    var _a;
    return (_a = FILTER_LABEL_LOOKUP.get(value)) !== null && _a !== void 0 ? _a : formatFilterLabel(value);
}
function getGradientStartClass(color) {
    switch (color) {
        case "blue":
            return "from-sky-500";
        case "purple":
            return "from-violet-500";
        case "pink":
            return "from-pink-500";
        case "orange":
            return "from-orange-500";
        case "green":
            return "from-emerald-500";
        case "black":
            return "from-slate-800";
        default:
            return "from-slate-700";
    }
}
function getGradientEndClass(color) {
    switch (color) {
        case "blue":
            return "to-indigo-700";
        case "purple":
            return "to-fuchsia-700";
        case "pink":
            return "to-rose-600";
        case "orange":
            return "to-amber-600";
        case "green":
            return "to-lime-500";
        case "black":
            return "to-slate-950";
        default:
            return "to-cyan-600";
    }
}
function TemplateThumbnail({ template, }) {
    const [hasImageError, setHasImageError] = useState(false);
    if (!template.thumbnailUrl || hasImageError) {
        const [firstColor, secondColor] = template.categories.colors;
        return (<div className={clsx("flex h-full w-full flex-col justify-between bg-gradient-to-br p-4 text-white", getGradientStartClass(firstColor), getGradientEndClass(secondColor !== null && secondColor !== void 0 ? secondColor : firstColor))}>
        <div className="flex flex-wrap gap-2">
          {template.categories.games.slice(0, 1).map((game) => (<span key={`${template.id}-${game}`} className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold backdrop-blur">
              {getDisplayLabel(game)}
            </span>))}
        </div>
        <div>
          <p className="text-lg font-semibold">{template.name}</p>
          <p className="mt-1 text-xs text-white/80">
            Preview unavailable, but this preset is still ready to use.
          </p>
        </div>
      </div>);
    }
    return (<img src={template.thumbnailUrl} alt={`${template.name} banner preview`} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" loading="lazy" onError={() => setHasImageError(true)}/>);
}
export function Step1TemplateBrowser() {
    const { selectedPlatform, selectedTemplateId, selectTemplate, templateFilters, setTemplateFilters, setCurrentStep, } = useFunnel();
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const platformTemplates = useMemo(() => {
        if (!selectedPlatform) {
            return [];
        }
        return BANNER_TEMPLATES.filter((template) => template.platform === selectedPlatform);
    }, [selectedPlatform]);
    const filteredTemplates = useMemo(() => filterTemplates(platformTemplates, templateFilters), [platformTemplates, templateFilters]);
    const activeFilterCount = useMemo(() => FILTER_DIMENSIONS.reduce((count, dimension) => { var _a, _b; return count + ((_b = (_a = templateFilters[dimension.key]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0); }, 0), [templateFilters]);
    const toggleFilter = (dimension, value) => {
        var _a;
        const currentValues = (_a = templateFilters[dimension]) !== null && _a !== void 0 ? _a : [];
        const nextValues = currentValues.includes(value)
            ? currentValues.filter((item) => item !== value)
            : [...currentValues, value];
        setTemplateFilters(Object.assign(Object.assign({}, templateFilters), { [dimension]: nextValues }));
    };
    const clearFilters = () => {
        setTemplateFilters({});
    };
    const filtersPanel = (<div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Filter Templates
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Browse the same game, style, theme, and color vocabulary used by the
            logo maker.
          </p>
        </div>
        {activeFilterCount > 0 && (<button type="button" onClick={clearFilters} className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-cyan-400 dark:hover:text-cyan-300">
            Clear filters
          </button>)}
      </div>

      {FILTER_DIMENSIONS.map((dimension) => {
            const values = FILTER_OPTIONS[dimension.key];
            if (values.length === 0) {
                return null;
            }
            return (<section key={dimension.key}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {dimension.label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                    var _a, _b;
                    const isActive = (_b = (_a = templateFilters[dimension.key]) === null || _a === void 0 ? void 0 : _a.includes(value.slug)) !== null && _b !== void 0 ? _b : false;
                    return (<button key={`${dimension.key}-${value.slug}`} type="button" onClick={() => toggleFilter(dimension.key, value.slug)} className={clsx("rounded-full border px-3 py-1.5 text-sm transition-colors", isActive
                            ? "border-purple-600 bg-purple-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950"
                            : "border-slate-300 bg-white text-slate-700 hover:border-purple-300 hover:text-purple-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-cyan-400 dark:hover:text-cyan-300")}>
                    {value.label}
                  </button>);
                })}
            </div>
          </section>);
        })}
    </div>);
    return (<section className="grid gap-6 lg:grid-cols-[280px,minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {filtersPanel}
        </div>
      </aside>

      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <button type="button" onClick={() => setCurrentStep("step0")} className="mb-2 inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-cyan-400 dark:hover:text-cyan-300">
              Back to platform selection
            </button>
            <p className="text-sm font-medium text-purple-600 dark:text-cyan-400">
              Step 2 of 4
            </p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Choose a Banner Template
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {selectedPlatform
            ? `${PLATFORMS[selectedPlatform].displayName} presets • `
            : ""}
              {filteredTemplates.length} matching template
              {filteredTemplates.length === 1 ? "" : "s"} ready for personalization.
            </p>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            {activeFilterCount > 0 && (<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {activeFilterCount} active
              </span>)}
            <button type="button" onClick={() => setIsMobileFiltersOpen(true)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-purple-300 hover:text-purple-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300">
              Filters
            </button>
          </div>
        </div>

        {!selectedPlatform ? (<div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900/60">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Choose a platform first
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Step 1 starts with selecting a platform so we can lock banner
              dimensions before template selection.
            </p>
            <button type="button" onClick={() => setCurrentStep("step0")} className="mt-4 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400">
              Go to platform selection
            </button>
          </div>) : filteredTemplates.length === 0 ? (<div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900/60">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              {platformTemplates.length === 0
                ? "No templates available yet for this platform"
                : "No templates match those filters"}
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {platformTemplates.length === 0
                ? "This platform is pre-wired, but template presets are not published yet."
                : "Clear a filter or broaden one of the dimensions to see more banner styles."}
            </p>
            {platformTemplates.length > 0 && (<button type="button" onClick={clearFilters} className="mt-4 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400">
                Reset filters
              </button>)}
          </div>) : (<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredTemplates.map((template) => {
                const isSelected = template.id === selectedTemplateId;
                return (<button key={template.id} type="button" onClick={() => selectTemplate(template.id)} className={clsx("group overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900", isSelected
                        ? "border-purple-500 ring-2 ring-purple-500/20 dark:border-cyan-400 dark:ring-cyan-400/20"
                        : "border-slate-200 hover:border-purple-300 dark:border-slate-800 dark:hover:border-cyan-400")}>
                  <div className="relative aspect-[5/2] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <TemplateThumbnail template={template}/>
                    <span className="absolute right-3 top-3 rounded-full bg-slate-950/80 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                      {template.credits} credit{template.credits === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="space-y-2 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {template.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {selectedPlatform
                        ? `${PLATFORMS[selectedPlatform].displayName} banner template`
                        : "Banner template"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {template.categories.styles.slice(0, 2).map((style) => (<span key={`${template.id}-${style}`} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {getDisplayLabel(style)}
                        </span>))}
                    </div>
                  </div>
                </button>);
            })}
          </div>)}
      </div>

      {isMobileFiltersOpen && (<div className="fixed inset-0 z-[70] bg-slate-950/60 backdrop-blur-sm lg:hidden">
          <div className="h-full max-w-sm overflow-y-auto bg-white p-5 shadow-2xl dark:bg-slate-950">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Filters
              </h2>
              <button type="button" onClick={() => setIsMobileFiltersOpen(false)} className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
                Close
              </button>
            </div>
            {filtersPanel}
          </div>
        </div>)}
    </section>);
}
