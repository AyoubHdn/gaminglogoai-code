import clsx from "clsx";
import React, { useMemo } from "react";

import { Button } from "~/component/Button";
import { FormGroup } from "~/component/FormGroup";
import { Input } from "~/component/Input";
import {
  createEmptyPanelDraft,
  useFunnel,
  type PanelDraft,
} from "~/component/panelFunnel/FunnelContext";
import {
  PANEL_PLATFORMS,
  type PanelShapeId,
  type PanelShapeOption,
} from "~/data/panelPlatforms";
import { PANEL_TEMPLATES } from "~/data/panelTemplates";

const TITLE_LIMIT = 40;
const CONTENT_LIMIT = 220;

function humanizeCategory(value: string): string {
  return value.replace(/[-_]+/g, " ").trim();
}

function getShapePreviewStyle(shape: PanelShapeOption): React.CSSProperties {
  const maxWidth = 156;
  const maxHeight = 72;
  const ratio = shape.width / shape.height;
  let width = maxWidth;
  let height = Math.round(width / ratio);

  if (height > maxHeight) {
    height = maxHeight;
    width = Math.round(height * ratio);
  }

  return {
    width: `${width}px`,
    height: `${height}px`,
  };
}

export function Step2Personalize() {
  const {
    selectedPlatform,
    selectedTemplateId,
    shapeId,
    panelItems,
    setCurrentStep,
    setShapeId,
    setPanelItems,
    resetResultState,
  } = useFunnel();

  const selectedTemplate = useMemo(
    () =>
      PANEL_TEMPLATES.find((template) => template.id === (selectedTemplateId ?? "")),
    [selectedTemplateId]
  );
  const platform = selectedPlatform ? PANEL_PLATFORMS[selectedPlatform] : null;

  const usedSuggestionTitles = useMemo(
    () =>
      new Set(
        panelItems
          .map((item) => item.title.trim().toLowerCase())
          .filter((value) => value.length > 0)
      ),
    [panelItems]
  );

  const readyPanelCount = panelItems.filter((item) => item.title.trim().length > 0).length;
  const canContinue = readyPanelCount > 0;

  const templateStyleSummary = useMemo(() => {
    if (!selectedTemplate) {
      return "the selected game template";
    }

    const game = selectedTemplate.categories.games[0]
      ? humanizeCategory(selectedTemplate.categories.games[0])
      : "the selected game";
    const style = selectedTemplate.categories.styles[0]
      ? humanizeCategory(selectedTemplate.categories.styles[0])
      : "the chosen art style";

    return `${game} style with ${style} design energy`;
  }, [selectedTemplate]);

  const updateDraft = (draftId: string, patch: Partial<PanelDraft>) => {
    setPanelItems(
      panelItems.map((item) =>
        item.id === draftId
          ? {
              ...item,
              ...patch,
            }
          : item
      )
    );
    resetResultState();
  };

  const addDraft = (preset?: Partial<PanelDraft>) => {
    setPanelItems([
      ...panelItems,
      {
        ...createEmptyPanelDraft(),
        ...preset,
      },
    ]);
    resetResultState();
  };

  const removeDraft = (draftId: string) => {
    if (panelItems.length <= 1) {
      return;
    }

    setPanelItems(panelItems.filter((item) => item.id !== draftId));
    resetResultState();
  };

  const handleApplySuggestion = (suggestionTitle: string, suggestionContent: string) => {
    addDraft({
      title: suggestionTitle,
      content: suggestionContent,
      includeIcon: true,
    });
  };

  const handleSelectShape = (nextShapeId: PanelShapeId) => {
    setShapeId(nextShapeId);
    resetResultState();
  };

  if (!selectedTemplate || !platform) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-medium text-purple-600 dark:text-cyan-400">
          Step 3 of 4
        </p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Build Your Panel Set
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Template selected: <span className="font-semibold">{selectedTemplate.name}</span>
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            Frame shape
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Choose one frame layout for the whole set. We&apos;ll style the frame, automatic icon treatment,
            and typography to match {templateStyleSummary}.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Object.values(platform.shapes).map((shape) => {
            const isActive = shapeId === shape.id;

            return (
              <button
                key={shape.id}
                type="button"
                onClick={() => handleSelectShape(shape.id)}
                className={clsx(
                  "overflow-hidden rounded-2xl border bg-[#182235] text-left transition-all",
                  isActive
                    ? "border-cyan-400 shadow-[0_0_0_1px_rgba(34,211,238,0.3)]"
                    : "border-[#334155] hover:border-cyan-300"
                )}
              >
                <div className="flex min-h-[184px] flex-col justify-between p-4">
                  <div className="rounded-2xl border border-[#334155] bg-[#1d293d] px-3 py-6">
                    <div className="flex items-center justify-center">
                      <div
                        className={clsx(
                          "rounded-lg border border-slate-500/70 bg-slate-500/60",
                          isActive && "border-cyan-200/50 bg-slate-400/70"
                        )}
                        style={getShapePreviewStyle(shape)}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{shape.aspectRatioLabel}</p>
                        <p className="text-xs text-slate-300">{shape.label}</p>
                      </div>
                      {shape.recommended ? (
                        <span className="rounded-full bg-cyan-500/15 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-200">
                          Most used
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 text-xs leading-5 text-slate-300/90">
                      {shape.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            Add panels to this set
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Add as many panels as you want in one batch, like Donate, About Me, Rules, FAQ, or Schedule.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {platform.popularPanelSuggestions.map((suggestion) => {
            const isDisabled = usedSuggestionTitles.has(
              suggestion.title.trim().toLowerCase()
            );

            return (
              <button
                key={suggestion.title}
                type="button"
                onClick={() =>
                  handleApplySuggestion(
                    suggestion.title,
                    suggestion.content
                  )
                }
                disabled={isDisabled}
                className={clsx(
                  "rounded-2xl border p-4 text-left transition-colors",
                  isDisabled
                    ? "cursor-not-allowed border-slate-200 bg-slate-100 opacity-60 dark:border-slate-800 dark:bg-slate-900/60"
                    : "border-slate-200 bg-slate-50 hover:border-purple-300 hover:bg-purple-50/60 dark:border-slate-800 dark:bg-slate-950/70 dark:hover:border-cyan-400 dark:hover:bg-cyan-500/10"
                )}
              >
                <div className="font-semibold text-slate-900 dark:text-white">
                  {suggestion.title}
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {suggestion.content}
                </p>
                <p className="mt-3 text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  {isDisabled ? "Already added" : "Suggested panel"}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              {panelItems.length} panel draft{panelItems.length === 1 ? "" : "s"}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {readyPanelCount} ready to generate
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => addDraft()}
          >
            Add Blank Panel
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          {panelItems.map((draft, panelIndex) => (
            <section
              key={draft.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-cyan-400">
                    Panel {panelIndex + 1}
                  </p>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {draft.title.trim() || "Untitled panel"}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => removeDraft(draft.id)}
                  disabled={panelItems.length <= 1}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-5">
                <FormGroup>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Panel title *
                  </label>
                  <Input
                    value={draft.title}
                    onChange={(event) => {
                      if (event.target.value.length <= TITLE_LIMIT) {
                        updateDraft(draft.id, { title: event.target.value });
                      }
                    }}
                    placeholder="e.g. ABOUT ME"
                  />
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {draft.title.length}/{TITLE_LIMIT}
                  </div>
                </FormGroup>

                <FormGroup>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Panel icon
                  </label>
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                    <input
                      type="checkbox"
                      checked={draft.includeIcon}
                      onChange={(event) => {
                        updateDraft(draft.id, { includeIcon: event.target.checked });
                      }}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-950 dark:text-cyan-400 dark:focus:ring-cyan-400"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Include icon
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        We&apos;ll automatically choose a cleaner symbolic icon based on the panel title instead of asking you to describe it.
                      </p>
                    </div>
                  </label>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {draft.includeIcon
                      ? "Icon panels work best for About Me, Schedule, Donate, Rules, FAQ, and Discord."
                      : "Text-only panels focus more on typography and content without a dedicated icon zone."}
                  </div>
                </FormGroup>

                <FormGroup>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                    Content
                  </label>
                  <textarea
                    value={draft.content}
                    onChange={(event) => {
                      if (event.target.value.length <= CONTENT_LIMIT) {
                        updateDraft(draft.id, { content: event.target.value });
                      }
                    }}
                    placeholder="Add short supporting text, schedule notes, rules, specs, or CTA copy."
                    rows={4}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20"
                  />
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {draft.content.length}/{CONTENT_LIMIT}
                  </div>
                </FormGroup>
              </div>
            </section>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="secondary"
          onClick={() => setCurrentStep("step1")}
        >
          Back
        </Button>
        <Button
          onClick={() => {
            if (!canContinue) {
              return;
            }

            resetResultState();
            setCurrentStep("step3");
          }}
          disabled={!canContinue}
        >
          Continue
        </Button>
      </div>
    </section>
  );
}
