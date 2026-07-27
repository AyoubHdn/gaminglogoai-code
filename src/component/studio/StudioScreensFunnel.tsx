import clsx from "clsx";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaCoins,
  FaDownload,
  FaExpand,
  FaLayerGroup,
  FaPlus,
  FaRedo,
  FaTimes,
} from "react-icons/fa";

import { Button } from "~/component/Button";
import {
  STREAM_SCREEN_PLATFORMS,
  type StreamScreenKind,
  type StreamScreenPreset,
} from "~/data/streamScreenPlatforms";
import {
  STREAM_SCREEN_TEMPLATES,
  type StreamScreenTemplate,
} from "~/data/streamScreenTemplates";
import { api } from "~/utils/api";
import { type ScreensDeepLinkContext } from "./StudioScreensWorkspace";

type FunnelStep = 1 | 2 | 3;

interface ScreenDraft {
  id: string;
  kind: StreamScreenKind;
  title: string;
  subtitle: string;
  sourcePreset?: StreamScreenKind;
}

interface GeneratedScreen {
  draftId: string;
  iconId: string;
  url: string;
  kind: StreamScreenKind;
  title: string;
  subtitle: string;
}

const PLATFORM = STREAM_SCREEN_PLATFORMS.twitch;
const MAX_SCREENS = 12;

const STEP_DETAILS: Array<{
  step: FunnelStep;
  shortTitle: string;
}> = [
  { step: 1, shortTitle: "Style" },
  { step: 2, shortTitle: "Screens" },
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

  return "We couldn't finish that stream screen request. Please try again.";
}

function createScreenDraft(
  preset: StreamScreenPreset,
  useDefaults = true,
  sourcePreset?: StreamScreenKind,
): ScreenDraft {
  return {
    id: `studio-screen-${preset.id}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    kind: preset.id,
    title: useDefaults ? preset.defaultTitle : "",
    subtitle: useDefaults ? preset.defaultSubtitle : "",
    sourcePreset,
  };
}

function buildDefaultScreens(): ScreenDraft[] {
  return PLATFORM.screenPresets.map((preset) =>
    createScreenDraft(preset, true, preset.id),
  );
}

function FunnelProgress({ currentStep }: { currentStep: FunnelStep }) {
  return (
    <ol
      className="grid grid-cols-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-sm"
      aria-label="Stream screens creation progress"
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
  selectedTemplate: StreamScreenTemplate | null;
  onGameChange: (game: string | null) => void;
  onTemplateSelect: (template: StreamScreenTemplate) => void;
  onNext: () => void;
}) {
  const availableGames = useMemo(
    () =>
      Array.from(
        new Set(
          STREAM_SCREEN_TEMPLATES.filter(
            (template) => template.platform === "twitch",
          ).flatMap((template) => template.categories.games),
        ),
      ),
    [],
  );
  const templates = useMemo(
    () =>
      STREAM_SCREEN_TEMPLATES.filter(
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
        title="Choose the screen style"
        description="Pick one game-based cinematic direction. The entire 16:9 set will share its environment, lighting, and typography."
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
                <div className="relative aspect-video overflow-hidden bg-slate-800">
                  <img
                    src={template.previewUrl}
                    alt={`${template.name} stream screen style`}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                    16:9
                  </span>
                  {isSelected && (
                    <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-purple-600 text-xs text-white shadow-md">
                      <FaCheck aria-hidden="true" />
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-white">{template.name}</h4>
                      <p className="mt-1 text-xs text-slate-400">
                        {humanize(template.categories.games[0] ?? "gaming")} ·{" "}
                        {humanize(template.categories.styles[0] ?? "custom")}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-cyan-300">
                      {template.credits} cr
                    </span>
                  </div>
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
        nextLabel="Choose screens"
      />
    </div>
  );
}

function ScreenChip({
  preset,
  selected,
  onToggle,
}: {
  preset: StreamScreenPreset;
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
      {preset.label}
    </button>
  );
}

function ScreensStep({
  screens,
  activeScreenId,
  creditsPerScreen,
  onPresetToggle,
  onAddCustom,
  onActivateScreen,
  onUpdateScreen,
  onRemoveScreen,
  onResetDefaults,
  onBack,
  onNext,
}: {
  screens: ScreenDraft[];
  activeScreenId: string | null;
  creditsPerScreen: number;
  onPresetToggle: (preset: StreamScreenPreset) => void;
  onAddCustom: (title: string, kind: StreamScreenKind) => boolean;
  onActivateScreen: (id: string) => void;
  onUpdateScreen: (id: string, patch: Partial<ScreenDraft>) => void;
  onRemoveScreen: (id: string) => void;
  onResetDefaults: () => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [customLabel, setCustomLabel] = useState("");
  const [customKind, setCustomKind] = useState<StreamScreenKind>("starting");
  const [customError, setCustomError] = useState("");
  const activeScreen =
    screens.find((screen) => screen.id === activeScreenId) ??
    screens[0] ??
    null;
  const setCost = screens.length * creditsPerScreen;

  const handleAddCustom = () => {
    const title = customLabel.trim();
    if (!title) {
      setCustomError("Enter a screen title first.");
      return;
    }

    if (!onAddCustom(title, customKind)) {
      setCustomError(
        screens.length >= MAX_SCREENS
          ? `A batch can contain up to ${MAX_SCREENS} screens.`
          : "That custom screen is already in the set.",
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
        title="Build your screen set"
        description="Keep the four core scenes, remove what you do not need, or add a custom title using one of the real supported screen behaviors."
      />

      <div className="mx-auto mt-9 max-w-5xl space-y-8">
        <section className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-400">
                Fixed broadcast canvas
              </p>
              <h4 className="mt-1 font-bold text-white">
                1920×1080 · 16:9 full screen
              </h4>
              <p className="mt-1 text-sm text-slate-400">
                Every scene uses the exact existing Twitch output canvas.
              </p>
            </div>
            <div className="aspect-video w-36 rounded-lg border border-cyan-400/40 bg-gradient-to-br from-purple-600/30 to-cyan-500/20 shadow-inner" />
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-white">Core screen types</h4>
              <p className="mt-1 text-sm text-slate-400">
                The real generator supports these four server-side kinds.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-300">
              <FaCoins aria-hidden="true" />
              {setCost} credits · {screens.length} selected
            </span>
          </div>

          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex flex-wrap gap-2.5">
              {PLATFORM.screenPresets.map((preset) => (
                <ScreenChip
                  key={preset.id}
                  preset={preset}
                  selected={screens.some(
                    (screen) => screen.sourcePreset === preset.id,
                  )}
                  onToggle={() => onPresetToggle(preset)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr),180px,auto]">
            <div>
              <label
                htmlFor="studio-custom-screen"
                className="text-sm font-bold text-white"
              >
                Custom screen title
              </label>
              <input
                id="studio-custom-screen"
                value={customLabel}
                onChange={(event) => {
                  setCustomLabel(
                    event.target.value.slice(0, PLATFORM.maxTitleChars),
                  );
                  setCustomError("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddCustom();
                  }
                }}
                placeholder="e.g. QUEUE OPENS SOON"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <div>
              <label
                htmlFor="studio-custom-screen-kind"
                className="text-sm font-bold text-white"
              >
                Screen behavior
              </label>
              <select
                id="studio-custom-screen-kind"
                value={customKind}
                onChange={(event) =>
                  setCustomKind(event.target.value as StreamScreenKind)
                }
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              >
                {PLATFORM.screenPresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddCustom}
              disabled={screens.length >= MAX_SCREENS}
              className="self-end"
            >
              <FaPlus aria-hidden="true" />
              Add custom
            </Button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Custom wording still uses one of the four valid generation
            behaviors; no unsupported server kind is created.
          </p>
          {customError && (
            <p className="mt-2 text-xs font-medium text-red-300">
              {customError}
            </p>
          )}
        </section>

        {screens.length > 0 && (
          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-white">Selected set</h4>
                <p className="mt-1 text-xs text-slate-500">
                  Select a scene below to edit its title and subtitle.
                </p>
              </div>
              <Button type="button" variant="ghost" onClick={onResetDefaults}>
                Reset core defaults
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {screens.map((screen) => (
                <button
                  key={screen.id}
                  type="button"
                  onClick={() => onActivateScreen(screen.id)}
                  className={clsx(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    activeScreen?.id === screen.id
                      ? "border-cyan-400 bg-cyan-500/10 text-cyan-200"
                      : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-white",
                  )}
                >
                  {screen.title || "Untitled"}
                </button>
              ))}
            </div>

            {activeScreen && (
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-purple-400">
                      Active scene
                    </p>
                    <h5 className="mt-1 font-bold text-white">
                      {PLATFORM.screenPresets.find(
                        (preset) => preset.id === activeScreen.kind,
                      )?.label ?? activeScreen.kind}
                    </h5>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveScreen(activeScreen.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"
                  >
                    <FaTimes aria-hidden="true" />
                    Remove
                  </button>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`screen-title-${activeScreen.id}`}
                      className="text-sm font-semibold text-slate-200"
                    >
                      Screen title
                    </label>
                    <input
                      id={`screen-title-${activeScreen.id}`}
                      value={activeScreen.title}
                      onChange={(event) =>
                        onUpdateScreen(activeScreen.id, {
                          title: event.target.value.slice(
                            0,
                            PLATFORM.maxTitleChars,
                          ),
                        })
                      }
                      placeholder="Required screen headline"
                      className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                    <p className="mt-1 text-right text-[11px] text-slate-600">
                      {activeScreen.title.length}/{PLATFORM.maxTitleChars}
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor={`screen-subtitle-${activeScreen.id}`}
                      className="text-sm font-semibold text-slate-200"
                    >
                      Subtitle{" "}
                      <span className="font-normal text-slate-500">
                        (optional)
                      </span>
                    </label>
                    <input
                      id={`screen-subtitle-${activeScreen.id}`}
                      value={activeScreen.subtitle}
                      onChange={(event) =>
                        onUpdateScreen(activeScreen.id, {
                          subtitle: event.target.value.slice(
                            0,
                            PLATFORM.maxSubtitleChars,
                          ),
                        })
                      }
                      placeholder="Short supporting message"
                      className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    />
                    <p className="mt-1 text-right text-[11px] text-slate-600">
                      {activeScreen.subtitle.length}/{PLATFORM.maxSubtitleChars}
                    </p>
                  </div>
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
          screens.length === 0 ||
          screens.some((screen) => screen.title.trim().length === 0)
        }
        nextLabel="Review screen set"
      />
    </div>
  );
}

function ScreenResults({
  screens,
  results,
  isDownloadingAll,
  onDownload,
  onDownloadAll,
}: {
  screens: ScreenDraft[];
  results: GeneratedScreen[];
  isDownloadingAll: boolean;
  onDownload: (screen: GeneratedScreen) => void;
  onDownloadAll: () => void;
}) {
  return (
    <section
      id="studio-screens-results"
      className="mt-10 border-t border-slate-800 pt-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-400">
            Generation complete
          </p>
          <h4 className="mt-1 text-xl font-bold text-white">
            Your matching stream screen set
          </h4>
          <p className="mt-2 text-sm text-slate-400">
            1920×1080 PNG · 16:9 full-screen canvas
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

      <div className="mt-6 space-y-6">
        {screens.map((screen, index) => {
          const generated = results.find(
            (result) => result.draftId === screen.id,
          );

          if (!generated) {
            return null;
          }

          const preset = PLATFORM.screenPresets.find(
            (candidate) => candidate.id === generated.kind,
          );

          return (
            <article
              key={screen.id}
              className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60 shadow-md"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-900">
                <img
                  src={generated.url}
                  alt={`Generated ${preset?.label ?? screen.kind} stream screen`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 px-4 py-3 sm:px-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                    Screen {index + 1} · {preset?.label ?? screen.kind}
                  </p>
                  <h5 className="font-bold text-white">{screen.title}</h5>
                  {screen.subtitle && (
                    <p className="mt-0.5 text-xs text-slate-500">
                      {screen.subtitle}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      window.open(
                        generated.url,
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                  >
                    <FaExpand aria-hidden="true" />
                    Full size
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => onDownload(generated)}
                  >
                    <FaDownload aria-hidden="true" />
                    Download PNG
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function StudioScreensFunnel({
  requestedContext,
}: {
  requestedContext: ScreensDeepLinkContext | null;
}) {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);
  const [currentStep, setCurrentStep] = useState<FunnelStep>(1);
  const [activeGame, setActiveGame] = useState<string | null>(
    requestedContext?.game ?? null,
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<StreamScreenTemplate | null>(requestedContext?.template ?? null);
  const [screens, setScreens] = useState<ScreenDraft[]>(buildDefaultScreens);
  const [activeScreenId, setActiveScreenId] = useState<string | null>(null);
  const [generatedScreens, setGeneratedScreens] = useState<GeneratedScreen[]>(
    [],
  );
  const [error, setError] = useState("");
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const generateScreens = api.streamScreenFunnel.generateBatch.useMutation();
  const creditsPerScreen = selectedTemplate?.credits ?? 4;
  const setCost = screens.length * creditsPerScreen;

  useEffect(() => {
    if (!requestedContext) {
      return;
    }

    setActiveGame(requestedContext.game);
    setSelectedTemplate(requestedContext.template);
    setGeneratedScreens([]);
  }, [requestedContext]);

  const clearResults = () => {
    setGeneratedScreens([]);
    setError("");
  };

  const handleTemplateSelect = (template: StreamScreenTemplate) => {
    setSelectedTemplate(template);
    clearResults();
  };

  const handlePresetToggle = (preset: StreamScreenPreset) => {
    const existing = screens.find(
      (screen) => screen.sourcePreset === preset.id,
    );

    if (existing) {
      const nextScreens = screens.filter((screen) => screen.id !== existing.id);
      setScreens(nextScreens);
      if (activeScreenId === existing.id) {
        setActiveScreenId(nextScreens[0]?.id ?? null);
      }
      clearResults();
      return;
    }

    if (screens.length >= MAX_SCREENS) {
      setError(`A batch can contain up to ${MAX_SCREENS} screens.`);
      return;
    }

    const screen = createScreenDraft(preset, true, preset.id);
    setScreens([...screens, screen]);
    setActiveScreenId(screen.id);
    clearResults();
  };

  const handleAddCustom = (title: string, kind: StreamScreenKind): boolean => {
    if (
      screens.length >= MAX_SCREENS ||
      screens.some(
        (screen) =>
          screen.title.trim().toLowerCase() === title.trim().toLowerCase(),
      )
    ) {
      return false;
    }

    const preset = PLATFORM.screenPresets.find(
      (candidate) => candidate.id === kind,
    );
    if (!preset) {
      return false;
    }

    const screen = createScreenDraft(preset, false);
    screen.title = title.trim();
    setScreens([...screens, screen]);
    setActiveScreenId(screen.id);
    clearResults();
    return true;
  };

  const handleUpdateScreen = (id: string, patch: Partial<ScreenDraft>) => {
    setScreens((current) =>
      current.map((screen) =>
        screen.id === id ? { ...screen, ...patch } : screen,
      ),
    );
    clearResults();
  };

  const handleRemoveScreen = (id: string) => {
    const nextScreens = screens.filter((screen) => screen.id !== id);
    setScreens(nextScreens);
    if (activeScreenId === id) {
      setActiveScreenId(nextScreens[0]?.id ?? null);
    }
    clearResults();
  };

  const handleResetDefaults = () => {
    const defaultText = new Map(
      PLATFORM.screenPresets.map((preset) => [preset.id, preset]),
    );
    setScreens((current) =>
      current.map((screen) => {
        if (!screen.sourcePreset) {
          return screen;
        }

        const preset = defaultText.get(screen.sourcePreset);
        return preset
          ? {
              ...screen,
              kind: preset.id,
              title: preset.defaultTitle,
              subtitle: preset.defaultSubtitle,
            }
          : screen;
      }),
    );
    clearResults();
  };

  const handleGenerate = async () => {
    setError("");

    if (!isLoggedIn) {
      void signIn("google", {
        callbackUrl:
          typeof window !== "undefined"
            ? window.location.href
            : "/studio?tool=screens",
      });
      return;
    }

    if (!selectedTemplate || screens.length === 0) {
      setError("Choose a template and at least one screen first.");
      return;
    }

    try {
      const result = await generateScreens.mutateAsync({
        platform: "twitch",
        templateId: selectedTemplate.id,
        screens: screens.map((screen) => ({
          draftId: screen.id,
          kind: screen.kind,
          title: screen.title.trim(),
          subtitle: screen.subtitle.trim() || null,
        })),
      });

      setGeneratedScreens(result.items);
      window.setTimeout(() => {
        document
          .getElementById("studio-screens-results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch (generationError) {
      console.error(
        "Studio stream screen set generation failed:",
        generationError,
      );
      setError(getErrorMessage(generationError));
    }
  };

  const downloadScreen = async (screen: GeneratedScreen) => {
    const response = await fetch(screen.url);
    if (!response.ok) {
      throw new Error(`Failed to download ${screen.title}.`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${screen.title.replace(
      /[^a-z0-9_-]/gi,
      "_",
    )}_stream_screen.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  };

  const handleDownload = async (screen: GeneratedScreen) => {
    setError("");
    try {
      await downloadScreen(screen);
    } catch (downloadError) {
      console.error("Studio stream screen download failed:", downloadError);
      setError(getErrorMessage(downloadError));
    }
  };

  const handleDownloadAll = async () => {
    setError("");
    setIsDownloadingAll(true);
    try {
      for (const screen of generatedScreens) {
        await downloadScreen(screen);
      }
    } catch (downloadError) {
      console.error(
        "Studio stream screen batch download failed:",
        downloadError,
      );
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
        description="Confirm the style, scene copy, fixed 16:9 canvas, and final batch credit cost before generating the set."
      />

      <div className="mx-auto mt-10 max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-[360px,minmax(0,1fr)]">
          <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-md">
            <div className="aspect-video overflow-hidden">
              {selectedTemplate && (
                <img
                  src={selectedTemplate.previewUrl}
                  alt={`${selectedTemplate.name} screen style summary`}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="border-t border-slate-800 px-4 py-3">
              <p className="font-bold text-white">
                {selectedTemplate?.name ?? "No style selected"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Visual anchor for the complete screen pack
              </p>
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
                  label: "Screens",
                  value: `${screens.length} selected`,
                },
                {
                  label: "Canvas",
                  value: "1920×1080 · 16:9",
                },
                {
                  label: "Format",
                  value: "Full-screen PNG",
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
                  Set cost
                </dt>
                <dd className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-cyan-300">
                  <FaCoins aria-hidden="true" />
                  {setCost} credits
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              {screens.map((screen) => (
                <span
                  key={screen.id}
                  className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-200"
                >
                  {screen.title}
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
            disabled={generateScreens.isLoading}
          >
            <FaArrowLeft aria-hidden="true" />
            Back
          </Button>
          <Button
            type="button"
            onClick={() => void handleGenerate()}
            isLoading={generateScreens.isLoading}
            className="min-w-[220px]"
          >
            {generatedScreens.length > 0 && !generateScreens.isLoading && (
              <FaRedo aria-hidden="true" />
            )}
            {generateScreens.isLoading
              ? "Generating screen set…"
              : isLoggedIn
                ? generatedScreens.length > 0
                  ? `Generate again for ${setCost} credits`
                  : `Generate for ${setCost} credits`
                : "Sign in to generate"}
          </Button>
        </div>

        {generateScreens.isLoading && generatedScreens.length === 0 && (
          <div className="mt-8 rounded-xl border border-purple-500/30 bg-purple-500/10 p-6 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-purple-500" />
            <p className="mt-4 font-semibold text-white">
              Creating your matching screen set
            </p>
            <p className="mt-1 text-sm text-slate-400">
              The first scene establishes the environment and lighting for every
              screen that follows.
            </p>
          </div>
        )}

        {generatedScreens.length > 0 && (
          <ScreenResults
            screens={screens}
            results={generatedScreens}
            isDownloadingAll={isDownloadingAll}
            onDownload={(screen) => void handleDownload(screen)}
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
          <ScreensStep
            screens={screens}
            activeScreenId={activeScreenId}
            creditsPerScreen={creditsPerScreen}
            onPresetToggle={handlePresetToggle}
            onAddCustom={handleAddCustom}
            onActivateScreen={setActiveScreenId}
            onUpdateScreen={handleUpdateScreen}
            onRemoveScreen={handleRemoveScreen}
            onResetDefaults={handleResetDefaults}
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
