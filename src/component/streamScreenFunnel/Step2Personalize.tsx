import React, { useMemo } from "react";

import { Button } from "~/component/Button";
import { FormGroup } from "~/component/FormGroup";
import { Input } from "~/component/Input";
import {
  createStreamScreenDraft,
  useFunnel,
} from "~/component/streamScreenFunnel/FunnelContext";
import {
  STREAM_SCREEN_PLATFORMS,
  type StreamScreenKind,
} from "~/data/streamScreenPlatforms";
import { STREAM_SCREEN_TEMPLATES } from "~/data/streamScreenTemplates";

export function Step2Personalize() {
  const {
    selectedPlatform,
    selectedTemplateId,
    screenItems,
    setCurrentStep,
    setScreenItems,
    resetDraftsToDefaults,
    resetResultState,
  } = useFunnel();

  const selectedTemplate = useMemo(
    () =>
      STREAM_SCREEN_TEMPLATES.find(
        (template) => template.id === (selectedTemplateId ?? "")
      ),
    [selectedTemplateId]
  );
  const platform = selectedPlatform ? STREAM_SCREEN_PLATFORMS[selectedPlatform] : null;

  const maxScreens = 12;
  const allTitlesReady =
    screenItems.length > 0 &&
    screenItems.every((item) => item.title.trim().length > 0);

  const updateDraft = (
    draftId: string,
    patch: Partial<{ title: string; subtitle: string }>
  ) => {
    setScreenItems(
      screenItems.map((item) =>
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

  const removeDraft = (draftId: string) => {
    setScreenItems(screenItems.filter((item) => item.id !== draftId));
    resetResultState();
  };

  const updateDraftKind = (draftId: string, kind: StreamScreenKind) => {
    setScreenItems(
      screenItems.map((item) =>
        item.id === draftId
          ? {
              ...item,
              kind,
            }
          : item
      )
    );
    resetResultState();
  };

  const addDraft = (kind: StreamScreenKind, useDefaults = true) => {
    if (!selectedPlatform || screenItems.length >= maxScreens) {
      return;
    }

    setScreenItems([
      ...screenItems,
      createStreamScreenDraft(selectedPlatform, kind, useDefaults),
    ]);
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
          Build Your Stream Screen Set
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Template selected:{" "}
          <span className="font-semibold">{selectedTemplate.name}</span>
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">
              Fixed output size
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {platform.displayName} stream scenes use a fixed{" "}
              {platform.canvas.width}x{platform.canvas.height} canvas.
            </p>
          </div>
          <Button variant="secondary" onClick={resetDraftsToDefaults}>
            Reset all default text
          </Button>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
          <p className="font-semibold text-slate-900 dark:text-white">
            {screenItems.length} screen{screenItems.length === 1 ? "" : "s"} in this set
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Add preset screens or blank screens, duplicate any screen type you need,
            and generate the whole batch together.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {platform.screenPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => addDraft(preset.id)}
                disabled={screenItems.length >= maxScreens}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-purple-300 hover:text-purple-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
              >
                Add {preset.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => addDraft(platform.screenPresets[0]!.id, false)}
              disabled={screenItems.length >= maxScreens}
              className="rounded-full border border-dashed border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-purple-300 hover:text-purple-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
            >
              Add Empty Screen
            </button>
          </div>

          {screenItems.length < maxScreens ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                You can build larger sets here. The current limit is {maxScreens} screens
                per batch.
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              You&apos;ve reached the current batch limit of {maxScreens} screens.
            </p>
          )}
        </div>

        <div className="mt-6 space-y-4">
          {screenItems.map((draft, index) => {
            const preset = platform.screenPresets.find((item) => item.id === draft.kind);

            if (!preset) {
              return null;
            }

            return (
              <section
                key={draft.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-cyan-400">
                      Screen {index + 1}
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {preset.label}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {preset.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDraft(draft.id)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-5">
                  <FormGroup>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Screen type
                    </label>
                    <select
                      value={draft.kind}
                      onChange={(event) =>
                        updateDraftKind(draft.id, event.target.value as StreamScreenKind)
                      }
                      className="w-full rounded-md border border-slate-300 bg-white p-3 text-slate-900 shadow-sm outline-none transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-cyan-500"
                    >
                      {platform.screenPresets.map((presetOption) => (
                        <option key={presetOption.id} value={presetOption.id}>
                          {presetOption.label}
                        </option>
                      ))}
                    </select>
                  </FormGroup>

                  <FormGroup>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Title *
                    </label>
                    <Input
                      value={draft.title}
                      onChange={(event) => {
                        if (event.target.value.length <= platform.maxTitleChars) {
                          updateDraft(draft.id, { title: event.target.value });
                        }
                      }}
                      placeholder={preset.defaultTitle}
                    />
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {draft.title.length}/{platform.maxTitleChars}
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                      Subtitle
                    </label>
                    <Input
                      value={draft.subtitle}
                      onChange={(event) => {
                        if (event.target.value.length <= platform.maxSubtitleChars) {
                          updateDraft(draft.id, { subtitle: event.target.value });
                        }
                      }}
                      placeholder={preset.defaultSubtitle}
                    />
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {draft.subtitle.length}/{platform.maxSubtitleChars}
                    </div>
                  </FormGroup>
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="secondary" onClick={() => setCurrentStep("step1")}>
          Back
        </Button>
        <Button
          onClick={() => {
            if (!allTitlesReady) {
              return;
            }

            resetResultState();
            setCurrentStep("step3");
          }}
          disabled={!allTitlesReady}
        >
          Continue
        </Button>
      </div>
    </section>
  );
}
