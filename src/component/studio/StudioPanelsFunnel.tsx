import clsx from "clsx";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaCoins,
  FaDownload,
  FaLayerGroup,
  FaPlus,
  FaRedo,
  FaTimes,
} from "react-icons/fa";

import { Button } from "~/component/Button";
import { StudioWatermarkNotice } from "~/component/studio/StudioWatermarkNotice";
import {
  PANEL_PLATFORMS,
  type PanelShapeId,
  type PanelShapeOption,
  type PanelSuggestion,
} from "~/data/panelPlatforms";
import { PANEL_TEMPLATES, type PanelTemplate } from "~/data/panelTemplates";
import { getPanelBatchCredits } from "~/lib/panelPricing";
import { buildStudioDownloadFilename } from "~/lib/studioDownload";
import { api } from "~/utils/api";
import { type PanelsDeepLinkContext } from "./StudioPanelsWorkspace";

type FunnelStep = 1 | 2 | 3;

interface PanelDraft {
  id: string;
  title: string;
  includeIcon: boolean;
  content: string;
  sourceSuggestion?: string;
}

interface GeneratedPanel {
  draftId: string;
  iconId: string;
  url: string;
  title: string;
  includeIcon: boolean;
  content: string;
}

const PLATFORM = PANEL_PLATFORMS.twitch;
const MAX_PANELS = 12;
const TITLE_LIMIT = 40;
const CONTENT_LIMIT = 220;

const STEP_DETAILS: Array<{
  step: FunnelStep;
  shortTitle: string;
}> = [
  { step: 1, shortTitle: "Style" },
  { step: 2, shortTitle: "Panels" },
  { step: 3, shortTitle: "Generate" },
];

function humanize(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "We couldn't finish that panel request. Please try again.";
}

function createPanelDraft(
  title: string,
  content = "",
  includeIcon = true,
  sourceSuggestion?: string,
): PanelDraft {
  return {
    id: `studio-panel-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    content,
    includeIcon,
    sourceSuggestion,
  };
}

function getShapePreviewStyle(shape: PanelShapeOption): CSSProperties {
  const maxWidth = 140;
  const maxHeight = 64;
  const ratio = shape.width / shape.height;
  let width = maxWidth;
  let height = Math.round(width / ratio);

  if (height > maxHeight) {
    height = maxHeight;
    width = Math.round(height * ratio);
  }

  return { width, height };
}

function getResultWidthClass(shapeId: PanelShapeId): string {
  switch (shapeId) {
    case "wide-3-1":
      return "max-w-4xl";
    case "landscape-4-3":
      return "max-w-xl";
    case "square-1-1":
      return "max-w-md";
    case "portrait-3-4":
      return "max-w-sm";
  }
}

function FunnelProgress({ currentStep }: { currentStep: FunnelStep }) {
  return (
    <ol
      className="grid grid-cols-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-sm"
      aria-label="Twitch panels creation progress"
    >
      {STEP_DETAILS.map((item) => {
        const isCurrent = item.step === currentStep;
        const isComplete = item.step < currentStep;

        return (
          <li
            key={item.step}
            className={clsx(
              "relative flex min-w-0 items-center gap-2 border-r border-slate-800 px-3 py-3 last:border-r-0 sm:px-5",
              isCurrent && "bg-purple-600/10",
            )}
            aria-current={isCurrent ? "step" : undefined}
          >
            <span
              className={clsx(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                isCurrent
                  ? "bg-purple-600 text-white"
                  : isComplete
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-800 text-slate-400",
              )}
            >
              {isComplete ? <FaCheck aria-hidden="true" /> : item.step}
            </span>
            <span
              className={clsx(
                "truncate text-xs font-semibold",
                isCurrent
                  ? "text-purple-300"
                  : isComplete
                    ? "text-slate-200"
                    : "text-slate-500",
              )}
            >
              {item.shortTitle}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function StepHeading({
  step,
  title,
  description,
}: {
  step: FunnelStep;
  title: string;
  description: string;
}) {
  return (
    <header className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-400">
        Step {step} of 3
      </p>
      <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
        {description}
      </p>
    </header>
  );
}

function StepNavigation({
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = "Continue",
}: {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="mt-10 flex items-center justify-between gap-4 border-t border-slate-800 pt-6">
      {onBack ? (
        <Button type="button" variant="ghost" onClick={onBack}>
          <FaArrowLeft aria-hidden="true" />
          Back
        </Button>
      ) : (
        <span />
      )}
      <Button type="button" onClick={onNext} disabled={nextDisabled}>
        {nextLabel}
        <FaArrowRight aria-hidden="true" />
      </Button>
    </div>
  );
}

function StyleStep({
  activeGame,
  selectedTemplate,
  onGameChange,
  onTemplateSelect,
  onNext,
}: {
  activeGame: string | null;
  selectedTemplate: PanelTemplate | null;
  onGameChange: (game: string | null) => void;
  onTemplateSelect: (template: PanelTemplate) => void;
  onNext: () => void;
}) {
  const availableGames = useMemo(
    () =>
      Array.from(
        new Set(
          PANEL_TEMPLATES.filter(
            (template) => template.platform === "twitch",
          ).flatMap((template) => template.categories.games),
        ),
      ),
    [],
  );
  const templates = useMemo(
    () =>
      PANEL_TEMPLATES.filter(
        (template) =>
          template.platform === "twitch" &&
          (!activeGame || template.categories.games.includes(activeGame)),
      ),
    [activeGame],
  );

  return (
    <div className="min-h-[540px]">
      <StepHeading
        step={1}
        title="Choose the set style"
        description="Pick one game-based art direction. Every panel in the batch will use this same visual language."
      />

      <div className="mx-auto mt-9 max-w-6xl">
        <div className="studio-scrollbar flex gap-2 overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => onGameChange(null)}
            className={clsx(
              "shrink-0 rounded-full border px-3.5 py-2 text-sm font-semibold transition",
              activeGame === null
                ? "border-purple-500 bg-purple-600 text-white"
                : "border-slate-700 bg-slate-950/60 text-slate-400 hover:border-purple-500/70 hover:text-white",
            )}
          >
            All Games
          </button>
          {availableGames.map((game) => (
            <button
              key={game}
              type="button"
              onClick={() => onGameChange(game)}
              className={clsx(
                "shrink-0 rounded-full border px-3.5 py-2 text-sm font-semibold transition",
                activeGame === game
                  ? "border-purple-500 bg-purple-600 text-white"
                  : "border-slate-700 bg-slate-950/60 text-slate-400 hover:border-purple-500/70 hover:text-white",
              )}
            >
              {humanize(game)}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => {
            const isSelected = selectedTemplate?.id === template.id;

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => onTemplateSelect(template)}
                className={clsx(
                  "group overflow-hidden rounded-xl border-2 bg-slate-950/60 text-left transition hover:-translate-y-0.5",
                  isSelected
                    ? "border-purple-500 ring-4 ring-purple-500/10"
                    : "border-slate-800 hover:border-purple-500/60",
                )}
                aria-pressed={isSelected}
              >
                <div className="relative aspect-[16/5] overflow-hidden bg-slate-800">
                  <img
                    src={template.previewUrl}
                    alt={`${template.name} Twitch panel style`}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  {isSelected && (
                    <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-xs text-white shadow-md">
                      <FaCheck aria-hidden="true" />
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-white">{template.name}</h4>
                  <p className="mt-1 text-xs text-slate-400">
                    {humanize(template.categories.games[0] ?? "gaming")} ·{" "}
                    {humanize(template.categories.styles[0] ?? "custom")}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {template.categories.colors.map((color) => (
                      <span
                        key={color}
                        className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] font-semibold capitalize text-slate-400"
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
      </div>

      <StepNavigation
        onNext={onNext}
        nextDisabled={!selectedTemplate}
        nextLabel="Choose panels"
      />
    </div>
  );
}

function PanelChip({
  suggestion,
  selected,
  onToggle,
}: {
  suggestion: PanelSuggestion;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition",
        selected
          ? "border-purple-500 bg-purple-600 text-white shadow-sm"
          : "border-slate-700 bg-slate-900 text-slate-300 hover:border-purple-500/70 hover:text-white",
      )}
      aria-pressed={selected}
    >
      <span
        className={clsx(
          "flex h-4 w-4 items-center justify-center rounded-full border text-[8px]",
          selected ? "border-white/70 bg-white/15" : "border-slate-600",
        )}
      >
        {selected && <FaCheck aria-hidden="true" />}
      </span>
      {suggestion.title}
    </button>
  );
}

function PanelsStep({
  shapeId,
  panels,
  activePanelId,
  onShapeChange,
  onSuggestionToggle,
  onAddCustom,
  onActivatePanel,
  onUpdatePanel,
  onRemovePanel,
  onBack,
  onNext,
}: {
  shapeId: PanelShapeId;
  panels: PanelDraft[];
  activePanelId: string | null;
  onShapeChange: (shape: PanelShapeId) => void;
  onSuggestionToggle: (suggestion: PanelSuggestion) => void;
  onAddCustom: (title: string) => boolean;
  onActivatePanel: (id: string) => void;
  onUpdatePanel: (id: string, patch: Partial<PanelDraft>) => void;
  onRemovePanel: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [customLabel, setCustomLabel] = useState("");
  const [customError, setCustomError] = useState("");
  const activePanel =
    panels.find((panel) => panel.id === activePanelId) ?? panels[0] ?? null;
  const batchCost = getPanelBatchCredits(panels.length);

  const handleAddCustom = () => {
    const title = customLabel.trim();
    if (!title) {
      setCustomError("Enter a panel label first.");
      return;
    }

    if (!onAddCustom(title)) {
      setCustomError(
        panels.length >= MAX_PANELS
          ? `A batch can contain up to ${MAX_PANELS} panels.`
          : "That panel is already in the set.",
      );
      return;
    }

    setCustomLabel("");
    setCustomError("");
  };

  return (
    <div>
      <StepHeading
        step={2}
        title="Build your panel set"
        description="Select the channel sections you need, choose one frame shape, and fine-tune the active panel without losing the matching-set structure."
      />

      <div className="mx-auto mt-9 max-w-5xl space-y-8">
        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h4 className="font-bold text-white">Frame shape</h4>
              <p className="mt-1 text-sm text-slate-400">
                The real generator applies one canvas shape to the whole set.
              </p>
            </div>
            <span className="text-xs font-semibold text-cyan-300">
              3:1 is the recommended Twitch panel format
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.values(PLATFORM.shapes).map((shape) => {
              const isSelected = shape.id === shapeId;

              return (
                <button
                  key={shape.id}
                  type="button"
                  onClick={() => onShapeChange(shape.id)}
                  className={clsx(
                    "min-w-0 rounded-xl border-2 bg-slate-950/60 p-4 text-left transition",
                    isSelected
                      ? "border-purple-500 ring-4 ring-purple-500/10"
                      : "border-slate-800 hover:border-purple-500/60",
                  )}
                  aria-pressed={isSelected}
                >
                  <div className="flex h-20 items-center justify-center rounded-lg border border-slate-800 bg-slate-900">
                    <span
                      className={clsx(
                        "rounded border",
                        isSelected
                          ? "border-purple-300 bg-purple-500/30"
                          : "border-slate-600 bg-slate-700/70",
                      )}
                      style={getShapePreviewStyle(shape)}
                    />
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-white">
                        {shape.aspectRatioLabel}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {shape.label}
                      </p>
                    </div>
                    {shape.recommended && (
                      <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-cyan-300">
                        Best
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-white">Panel types</h4>
              <p className="mt-1 text-sm text-slate-400">
                Select any combination from the current Twitch presets.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-300">
              <FaCoins aria-hidden="true" />
              {batchCost} credits · {panels.length} selected
            </span>
          </div>

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex flex-wrap gap-2.5">
              {PLATFORM.popularPanelSuggestions.map((suggestion) => {
                const selected = panels.some(
                  (panel) => panel.sourceSuggestion === suggestion.title,
                );

                return (
                  <PanelChip
                    key={suggestion.title}
                    suggestion={suggestion}
                    selected={selected}
                    onToggle={() => onSuggestionToggle(suggestion)}
                  />
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr),auto]">
            <div>
              <label
                htmlFor="studio-custom-panel"
                className="text-sm font-bold text-white"
              >
                Custom panel label
              </label>
              <input
                id="studio-custom-panel"
                value={customLabel}
                onChange={(event) => {
                  setCustomLabel(event.target.value.slice(0, TITLE_LIMIT));
                  setCustomError("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddCustom();
                  }
                }}
                placeholder="e.g. SUBSCRIBE"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddCustom}
              disabled={panels.length >= MAX_PANELS}
              className="self-end"
            >
              <FaPlus aria-hidden="true" />
              Add custom
            </Button>
          </div>
          {customError && (
            <p className="mt-2 text-xs font-medium text-red-300">
              {customError}
            </p>
          )}
        </section>

        {panels.length > 0 && (
          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-bold text-white">Selected set</h4>
              <p className="text-xs text-slate-500">
                Choose a label below to edit its content.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {panels.map((panel) => (
                <button
                  key={panel.id}
                  type="button"
                  onClick={() => onActivatePanel(panel.id)}
                  className={clsx(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    activePanel?.id === panel.id
                      ? "border-cyan-400 bg-cyan-500/10 text-cyan-200"
                      : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-white",
                  )}
                >
                  {panel.title || "Untitled"}
                </button>
              ))}
            </div>

            {activePanel && (
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-purple-400">
                      Active panel
                    </p>
                    <h5 className="mt-1 font-bold text-white">
                      {activePanel.title || "Untitled panel"}
                    </h5>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemovePanel(activePanel.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"
                  >
                    <FaTimes aria-hidden="true" />
                    Remove
                  </button>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`panel-title-${activePanel.id}`}
                      className="text-sm font-semibold text-slate-200"
                    >
                      Panel title
                    </label>
                    <input
                      id={`panel-title-${activePanel.id}`}
                      value={activePanel.title}
                      onChange={(event) =>
                        onUpdatePanel(activePanel.id, {
                          title: event.target.value.slice(0, TITLE_LIMIT),
                        })
                      }
                      className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                    <p className="mt-1 text-right text-[11px] text-slate-600">
                      {activePanel.title.length}/{TITLE_LIMIT}
                    </p>
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 self-start rounded-lg border border-slate-700 bg-slate-900 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={activePanel.includeIcon}
                      onChange={(event) =>
                        onUpdatePanel(activePanel.id, {
                          includeIcon: event.target.checked,
                        })
                      }
                      className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-950 text-purple-600 focus:ring-purple-500"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-white">
                        Include automatic icon
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        Uses the existing title-based icon treatment.
                      </span>
                    </span>
                  </label>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor={`panel-content-${activePanel.id}`}
                    className="text-sm font-semibold text-slate-200"
                  >
                    Supporting content{" "}
                    <span className="font-normal text-slate-500">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id={`panel-content-${activePanel.id}`}
                    value={activePanel.content}
                    onChange={(event) =>
                      onUpdatePanel(activePanel.id, {
                        content: event.target.value.slice(0, CONTENT_LIMIT),
                      })
                    }
                    rows={3}
                    placeholder="Short supporting copy, schedule, rules, specs, or CTA."
                    className="mt-2 w-full resize-y rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  />
                  <p className="mt-1 text-right text-[11px] text-slate-600">
                    {activePanel.content.length}/{CONTENT_LIMIT}
                  </p>
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        nextDisabled={
          panels.length === 0 ||
          panels.some((panel) => panel.title.trim().length === 0)
        }
        nextLabel="Review panel set"
      />
    </div>
  );
}

function PanelResults({
  panels,
  results,
  shape,
  isDownloadingAll,
  onDownload,
  onDownloadAll,
}: {
  panels: PanelDraft[];
  results: GeneratedPanel[];
  shape: PanelShapeOption;
  isDownloadingAll: boolean;
  onDownload: (panel: GeneratedPanel) => void;
  onDownloadAll: () => void;
}) {
  return (
    <section
      id="studio-panels-results"
      className="mt-10 border-t border-slate-800 pt-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-400">
            Generation complete
          </p>
          <h4 className="mt-1 text-xl font-bold text-white">
            Your matching Twitch panel set
          </h4>
          <p className="mt-2 text-sm text-slate-400">
            {shape.width}×{shape.height} PNG · {shape.aspectRatioLabel} frame
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={onDownloadAll}
          isLoading={isDownloadingAll}
        >
          <FaLayerGroup aria-hidden="true" />
          Download all
        </Button>
      </div>

      <StudioWatermarkNotice />

      <div className="mt-6 space-y-4">
        {panels.map((panel, index) => {
          const generated = results.find(
            (result) => result.draftId === panel.id,
          );

          if (!generated) {
            return null;
          }

          return (
            <article
              key={panel.id}
              className={clsx(
                "mx-auto overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60 shadow-md",
                getResultWidthClass(shape.id),
              )}
            >
              <div
                className="relative overflow-hidden bg-slate-900"
                style={{ aspectRatio: `${shape.width} / ${shape.height}` }}
              >
                <img
                  src={generated.url}
                  alt={`Generated ${panel.title} Twitch panel`}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 px-4 py-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                    Panel {index + 1}
                  </p>
                  <h5 className="font-bold text-white">{panel.title}</h5>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => onDownload(generated)}
                >
                  <FaDownload aria-hidden="true" />
                  Download PNG
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function StudioPanelsFunnel({
  requestedContext,
}: {
  requestedContext: PanelsDeepLinkContext | null;
}) {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);
  const [currentStep, setCurrentStep] = useState<FunnelStep>(1);
  const [activeGame, setActiveGame] = useState<string | null>(
    requestedContext?.game ?? null,
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<PanelTemplate | null>(requestedContext?.template ?? null);
  const [shapeId, setShapeId] = useState<PanelShapeId>("wide-3-1");
  const [panels, setPanels] = useState<PanelDraft[]>([]);
  const [activePanelId, setActivePanelId] = useState<string | null>(null);
  const [generatedPanels, setGeneratedPanels] = useState<GeneratedPanel[]>([]);
  const [error, setError] = useState("");
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const generatePanels = api.panelFunnel.generateBatch.useMutation();
  const shape = PLATFORM.shapes[shapeId];
  const batchCost = getPanelBatchCredits(panels.length);

  useEffect(() => {
    if (!requestedContext) {
      return;
    }

    setActiveGame(requestedContext.game);
    setSelectedTemplate(requestedContext.template);
    setGeneratedPanels([]);
  }, [requestedContext]);

  const clearResults = () => {
    setGeneratedPanels([]);
    setError("");
  };

  const handleTemplateSelect = (template: PanelTemplate) => {
    setSelectedTemplate(template);
    clearResults();
  };

  const handleSuggestionToggle = (suggestion: PanelSuggestion) => {
    const existing = panels.find(
      (panel) => panel.sourceSuggestion === suggestion.title,
    );

    if (existing) {
      const nextPanels = panels.filter((panel) => panel.id !== existing.id);
      setPanels(nextPanels);
      if (activePanelId === existing.id) {
        setActivePanelId(nextPanels[0]?.id ?? null);
      }
      clearResults();
      return;
    }

    if (panels.length >= MAX_PANELS) {
      setError(`A batch can contain up to ${MAX_PANELS} panels.`);
      return;
    }

    const panel = createPanelDraft(
      suggestion.title,
      suggestion.content,
      true,
      suggestion.title,
    );
    setPanels([...panels, panel]);
    setActivePanelId(panel.id);
    clearResults();
  };

  const handleAddCustom = (title: string): boolean => {
    if (
      panels.length >= MAX_PANELS ||
      panels.some(
        (panel) =>
          panel.title.trim().toLowerCase() === title.trim().toLowerCase(),
      )
    ) {
      return false;
    }

    const panel = createPanelDraft(title.trim());
    setPanels([...panels, panel]);
    setActivePanelId(panel.id);
    clearResults();
    return true;
  };

  const handleUpdatePanel = (id: string, patch: Partial<PanelDraft>) => {
    setPanels((current) =>
      current.map((panel) =>
        panel.id === id ? { ...panel, ...patch } : panel,
      ),
    );
    clearResults();
  };

  const handleRemovePanel = (id: string) => {
    const nextPanels = panels.filter((panel) => panel.id !== id);
    setPanels(nextPanels);
    if (activePanelId === id) {
      setActivePanelId(nextPanels[0]?.id ?? null);
    }
    clearResults();
  };

  const handleGenerate = async () => {
    setError("");

    if (!isLoggedIn) {
      void signIn("google", {
        callbackUrl:
          typeof window !== "undefined"
            ? window.location.href
            : "/studio?tool=panels",
      });
      return;
    }

    if (!selectedTemplate || panels.length === 0) {
      setError("Choose a template and at least one panel first.");
      return;
    }

    try {
      const result = await generatePanels.mutateAsync({
        platform: "twitch",
        templateId: selectedTemplate.id,
        shapeId,
        panels: panels.map((panel) => ({
          draftId: panel.id,
          title: panel.title.trim(),
          includeIcon: panel.includeIcon,
          content: panel.content.trim() || null,
        })),
      });

      setGeneratedPanels(result.items);
      window.setTimeout(() => {
        document
          .getElementById("studio-panels-results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch (generationError) {
      console.error("Studio panel set generation failed:", generationError);
      setError(getErrorMessage(generationError));
    }
  };

  const downloadPanel = async (panel: GeneratedPanel) => {
    const response = await fetch(panel.url);
    if (!response.ok) {
      throw new Error(`Failed to download ${panel.title}.`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = buildStudioDownloadFilename({
      text: panel.title || session?.user?.name,
      toolType: "twitch-panel",
    });
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  };

  const handleDownload = async (panel: GeneratedPanel) => {
    setError("");
    try {
      await downloadPanel(panel);
    } catch (downloadError) {
      console.error("Studio panel download failed:", downloadError);
      setError(getErrorMessage(downloadError));
    }
  };

  const handleDownloadAll = async () => {
    setError("");
    setIsDownloadingAll(true);
    try {
      for (const panel of generatedPanels) {
        await downloadPanel(panel);
      }
    } catch (downloadError) {
      console.error("Studio panel batch download failed:", downloadError);
      setError(getErrorMessage(downloadError));
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const renderGenerateStep = () => (
    <div>
      <StepHeading
        step={3}
        title="Review and generate"
        description="Confirm the style, frame, panel list, and batch credit total before creating the matching PNG set."
      />

      <div className="mx-auto mt-10 max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-[320px,minmax(0,1fr)]">
          <div>
            <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-md">
              <div className="aspect-[16/5] overflow-hidden">
                {selectedTemplate && (
                  <img
                    src={selectedTemplate.previewUrl}
                    alt={`${selectedTemplate.name} style summary`}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="border-t border-slate-800 px-4 py-3">
                <p className="font-bold text-white">
                  {selectedTemplate?.name ?? "No style selected"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Matching visual anchor for the full batch
                </p>
              </div>
            </div>
          </div>

          <div>
            <dl className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  label: "Platform",
                  value: "Twitch",
                },
                {
                  label: "Panels",
                  value: `${panels.length} selected`,
                },
                {
                  label: "Frame",
                  value: `${shape.label} · ${shape.aspectRatioLabel}`,
                },
                {
                  label: "Output",
                  value: `${shape.width}×${shape.height} PNG`,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3"
                >
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {item.label}
                  </dt>
                  <dd className="mt-1 truncate text-sm font-semibold text-slate-100">
                    {item.value}
                  </dd>
                </div>
              ))}
              <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-cyan-400">
                  Batch cost
                </dt>
                <dd className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-cyan-300">
                  <FaCoins aria-hidden="true" />
                  {batchCost} credits
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              {panels.map((panel) => (
                <span
                  key={panel.id}
                  className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-200"
                >
                  {panel.title}
                </span>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div
            className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            role="alert"
          >
            {error.toLowerCase().includes("not enough") ? (
              <p>
                You do not have enough gaming credits.{" "}
                <Link
                  href="/buy-credits"
                  className="font-semibold underline hover:text-white"
                >
                  Purchase more credits
                </Link>
                .
              </p>
            ) : (
              error
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setCurrentStep(2)}
            disabled={generatePanels.isLoading}
          >
            <FaArrowLeft aria-hidden="true" />
            Back
          </Button>
          <Button
            type="button"
            onClick={() => void handleGenerate()}
            isLoading={generatePanels.isLoading}
            className="min-w-[210px]"
          >
            {generatedPanels.length > 0 && !generatePanels.isLoading && (
              <FaRedo aria-hidden="true" />
            )}
            {generatePanels.isLoading
              ? "Generating panel set…"
              : isLoggedIn
                ? generatedPanels.length > 0
                  ? `Generate again for ${batchCost} credits`
                  : `Generate for ${batchCost} credits`
                : "Sign in to generate"}
          </Button>
        </div>

        {generatePanels.isLoading && generatedPanels.length === 0 && (
          <div className="mt-8 rounded-xl border border-purple-500/30 bg-purple-500/10 p-6 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-purple-500" />
            <p className="mt-4 font-semibold text-white">
              Creating your matching panel set
            </p>
            <p className="mt-1 text-sm text-slate-400">
              The first panel establishes the style anchor for every panel that
              follows.
            </p>
          </div>
        )}

        {generatedPanels.length > 0 && (
          <PanelResults
            panels={panels}
            results={generatedPanels}
            shape={shape}
            isDownloadingAll={isDownloadingAll}
            onDownload={(panel) => void handleDownload(panel)}
            onDownloadAll={() => void handleDownloadAll()}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl">
      <FunnelProgress currentStep={currentStep} />
      <section className="mt-5 rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-md sm:p-8 lg:p-10">
        {error && currentStep !== 3 && (
          <div
            className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            role="alert"
          >
            {error}
          </div>
        )}

        {currentStep === 1 ? (
          <StyleStep
            activeGame={activeGame}
            selectedTemplate={selectedTemplate}
            onGameChange={setActiveGame}
            onTemplateSelect={handleTemplateSelect}
            onNext={() => setCurrentStep(2)}
          />
        ) : currentStep === 2 ? (
          <PanelsStep
            shapeId={shapeId}
            panels={panels}
            activePanelId={activePanelId}
            onShapeChange={(nextShape) => {
              setShapeId(nextShape);
              clearResults();
            }}
            onSuggestionToggle={handleSuggestionToggle}
            onAddCustom={handleAddCustom}
            onActivatePanel={setActivePanelId}
            onUpdatePanel={handleUpdatePanel}
            onRemovePanel={handleRemovePanel}
            onBack={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
          />
        ) : (
          renderGenerateStep()
        )}
      </section>
    </div>
  );
}
