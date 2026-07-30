import clsx from "clsx";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { type IconType } from "react-icons";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCar,
  FaCheck,
  FaCloudUploadAlt,
  FaCoins,
  FaCrosshairs,
  FaCrown,
  FaDownload,
  FaDragon,
  FaFire,
  FaGamepad,
  FaGhost,
  FaHatWizard,
  FaHorse,
  FaBolt,
  FaParachuteBox,
  FaRedo,
  FaRing,
  FaRobot,
  FaShieldAlt,
  FaYoutube,
} from "react-icons/fa";
import {
  SiActivision,
  SiEa,
  SiEpicgames,
  SiMinecraft,
  SiRoblox,
  SiValorant,
} from "react-icons/si";

import { Button } from "~/component/Button";
import { StudioWatermarkNotice } from "~/component/studio/StudioWatermarkNotice";
import { useFunnel } from "~/component/thumbnailFunnel/FunnelContext";
import {
  THUMBNAIL_FORMATS,
  type ThumbnailFormat,
} from "~/data/thumbnailFormats";
import { THUMBNAIL_GAMES } from "~/data/thumbnailGames";
import { THUMBNAIL_PLATFORMS } from "~/data/thumbnailPlatforms";
import { THUMBNAIL_GENERATION_CREDITS } from "~/data/thumbnailTemplates";
import { getReferenceAwareGenerationCredits } from "~/lib/generationPricing";
import { buildStudioDownloadFilename } from "~/lib/studioDownload";
import { S3_BASE } from "~/utils/s3Paths";
import { api, type RouterOutputs } from "~/utils/api";
import { type ThumbnailDeepLinkContext } from "./StudioThumbnailWorkspace";

type StudioThumbnailStep = "step0" | "step1" | "step2" | "step3";
type StudioThumbnailStage = "platform" | StudioThumbnailStep;
type UserIcon = RouterOutputs["icons"]["getIcons"][number];

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_REFERENCE_DIMENSION = 1024;
const TITLE_LIMIT = 70;
const SUBTITLE_LIMIT = 50;
const REFINEMENT_PROMPT_LIMIT = 500;

const GAME_ICONS: Record<string, IconType> = {
  generic: FaGamepad,
  fortnite: SiEpicgames,
  minecraft: SiMinecraft,
  "call-of-duty": SiActivision,
  "free-fire": FaFire,
  valorant: SiValorant,
  "apex-legends": SiEa,
  roblox: SiRoblox,
  gta: FaCar,
  "elden-ring": FaRing,
  "legend-of-zelda": FaHatWizard,
  "counter-strike-2": FaCrosshairs,
  "five-nights-at-freddys": FaGhost,
  "league-of-legends": FaCrown,
  "mortal-kombat": FaDragon,
  "overwatch-2": FaShieldAlt,
  "red-dead-redemption-2": FaHorse,
  pokemon: FaBolt,
  "cyberpunk-2077": FaRobot,
  pubg: FaParachuteBox,
};

const STEP_DETAILS: Array<{
  step: StudioThumbnailStage;
  number: number;
  shortTitle: string;
}> = [
  { step: "platform", number: 1, shortTitle: "Platform" },
  { step: "step0", number: 2, shortTitle: "Format" },
  { step: "step1", number: 3, shortTitle: "Game" },
  { step: "step2", number: 4, shortTitle: "Personalize" },
  { step: "step3", number: 5, shortTitle: "Generate" },
];

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "We couldn't finish that thumbnail request. Please try again.";
}

function getDesignImageUrl(icon: UserIcon): string {
  return `${S3_BASE}/${icon.imageKey ?? icon.id}`;
}

function getPromptLabel(prompt: string | null | undefined): string {
  if (!prompt) {
    return "Untitled design";
  }

  return prompt.length > 42 ? `${prompt.slice(0, 42)}…` : prompt;
}

function isReferenceCandidate(icon: UserIcon): boolean {
  const prompt = icon.prompt ?? "";
  const excludedPrefixes = [
    "Banner:",
    "Thumbnail:",
    "TwitchBanner:",
    "TwitchPanel:",
    "StreamScreen:",
    "AI Enhance:",
    "Emote:",
    "EmoteBase:",
    "NanoFace:",
  ];

  return !excludedPrefixes.some((prefix) => prompt.startsWith(prefix));
}

function FunnelProgress({
  currentStep,
}: {
  currentStep: StudioThumbnailStage;
}) {
  const currentIndex = STEP_DETAILS.findIndex(
    (item) => item.step === currentStep,
  );

  return (
    <ol
      className="grid grid-cols-5 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-sm"
      aria-label="Thumbnail creation progress"
    >
      {STEP_DETAILS.map((item, index) => {
        const isCurrent = item.step === currentStep;
        const isComplete = index < currentIndex;

        return (
          <li
            key={item.step}
            className={clsx(
              "relative flex min-w-0 items-center gap-2 border-r border-slate-800 px-2.5 py-3 last:border-r-0 sm:px-4",
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
              {isComplete ? <FaCheck aria-hidden="true" /> : item.number}
            </span>
            <span
              className={clsx(
                "hidden truncate text-xs font-semibold sm:block",
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
  step: number;
  title: string;
  description: string;
}) {
  return (
    <header className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-400">
        Step {step} of 5
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

function PlatformStep({ onNext }: { onNext: () => void }) {
  const platform = THUMBNAIL_PLATFORMS.youtube;

  return (
    <div>
      <StepHeading
        step={1}
        title="Choose your platform"
        description="Start with YouTube's standard 16:9 thumbnail canvas, then choose the content format and game."
      />

      <div className="mx-auto mt-10 max-w-md">
        <div className="w-full rounded-xl border-2 border-purple-500 bg-slate-950 p-5 text-left shadow-lg ring-4 ring-purple-500/10">
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-xl text-white">
              <FaYoutube aria-hidden="true" />
            </span>
            <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-cyan-300">
              Available
            </span>
          </div>
          <h4 className="mt-5 text-lg font-bold text-white">
            {platform.displayName}
          </h4>
          <p className="mt-1 text-sm text-slate-400">Gaming video thumbnails</p>
          <p className="mt-3 text-xs font-semibold text-slate-500">
            {platform.surface.canvas.width} × {platform.surface.canvas.height}px
            · 16:9
          </p>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Button type="button" onClick={onNext} className="min-w-40">
          Choose a format
          <FaArrowRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

function FormatCard({
  format,
  isSelected,
  onSelect,
}: {
  format: ThumbnailFormat;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={clsx(
        "group min-w-0 overflow-hidden rounded-xl border-2 bg-slate-950 text-left shadow-sm transition duration-200",
        isSelected
          ? "border-cyan-400 ring-4 ring-cyan-400/10"
          : "border-slate-800 hover:-translate-y-0.5 hover:border-purple-500 hover:shadow-lg",
      )}
      aria-pressed={isSelected}
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-700 to-slate-900">
        {!hasImageError ? (
          <Image
            src={format.previewImage}
            alt={`${format.name} thumbnail format preview`}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 330px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            onError={() => setHasImageError(true)}
            unoptimized
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-5 text-center">
            <span className="text-sm font-bold text-white">{format.name}</span>
            <span className="mt-1 text-[11px] font-medium text-purple-200">
              Preview coming soon
            </span>
          </div>
        )}
        <span
          className={clsx(
            "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border text-xs shadow-md transition",
            isSelected
              ? "border-cyan-300 bg-cyan-500 text-slate-950"
              : "border-white/20 bg-slate-950/70 text-transparent group-hover:text-white",
          )}
        >
          <FaCheck aria-hidden="true" />
        </span>
      </div>
      <div className="p-3.5">
        <h4 className="text-sm font-bold text-white">{format.name}</h4>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {format.description}
        </p>
      </div>
    </button>
  );
}

function FormatStep({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const { selectedFormatId, setSelectedFormatId, resetResultState } =
    useFunnel();

  return (
    <div>
      <StepHeading
        step={2}
        title="Choose your content format"
        description="Pick the composition and story that best matches your video. You will choose the game next."
      />

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {THUMBNAIL_FORMATS.map((format) => (
          <FormatCard
            key={format.id}
            format={format}
            isSelected={selectedFormatId === format.id}
            onSelect={() => {
              setSelectedFormatId(format.id);
              resetResultState();
            }}
          />
        ))}
      </div>

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!selectedFormatId}
        nextLabel="Choose a game"
      />
    </div>
  );
}

function GameStep({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const { selectedGameId, setSelectedGameId, resetResultState } = useFunnel();

  return (
    <div>
      <StepHeading
        step={3}
        title="Choose your game"
        description="Add a recognizable game world, or choose generic for a flexible gaming look without a specific franchise."
      />

      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {THUMBNAIL_GAMES.map((game) => {
          const isSelected = selectedGameId === game.id;
          const GameIcon = GAME_ICONS[game.id] ?? FaGamepad;

          return (
            <button
              key={game.id}
              type="button"
              onClick={() => {
                setSelectedGameId(game.id);
                resetResultState();
              }}
              className={clsx(
                "flex min-h-36 flex-col items-center justify-center rounded-xl border-2 bg-slate-950 p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-purple-500/70",
                isSelected
                  ? "border-cyan-400 ring-4 ring-cyan-400/10"
                  : "border-slate-800",
              )}
              aria-pressed={isSelected}
            >
              <span
                className={clsx(
                  "flex h-16 w-16 items-center justify-center rounded-2xl text-3xl transition",
                  isSelected
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-slate-800 text-slate-300",
                )}
              >
                <GameIcon aria-hidden="true" />
              </span>
              <span className="mt-3 text-sm font-bold leading-5 text-white">
                {game.name}
              </span>
            </button>
          );
        })}
      </div>

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!selectedGameId}
        nextLabel="Personalize thumbnail"
      />
    </div>
  );
}

function PersonalizeStep({
  localPreviewUrl,
  uploadError,
  isUploading,
  onUploadChange,
  onBack,
  onNext,
}: {
  localPreviewUrl: string | null;
  uploadError: string;
  isUploading: boolean;
  onUploadChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const {
    referenceSource,
    referenceUrl,
    title,
    subtitle,
    setReferenceSource,
    setReferenceUrl,
    setTitle,
    setSubtitle,
    resetResultState,
  } = useFunnel();
  const iconsQuery = api.icons.getIcons.useQuery(undefined, {
    enabled: isAuthenticated && referenceSource === "designs",
  });
  const availableDesigns = useMemo(
    () => (iconsQuery.data ?? []).filter(isReferenceCandidate),
    [iconsQuery.data],
  );
  const effectiveSource = referenceSource ?? "none";
  const isReferenceReady =
    effectiveSource === "none" ||
    ((effectiveSource === "upload" || effectiveSource === "designs") &&
      Boolean(referenceUrl));
  const canContinue = Boolean(title.trim()) && isReferenceReady && !isUploading;

  const selectSource = (source: "upload" | "designs" | "none") => {
    setReferenceSource(source);
    setReferenceUrl(null);
    resetResultState();
  };

  return (
    <div>
      <StepHeading
        step={4}
        title="Personalize your thumbnail"
        description="Add a concise headline and optional subtitle, then choose whether the AI should use an image reference."
      />

      <div className="mx-auto mt-10 max-w-5xl space-y-8">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-200">
              Thumbnail title
            </span>
            <input
              value={title}
              onChange={(event) => {
                if (event.target.value.length <= TITLE_LIMIT) {
                  setTitle(event.target.value);
                  resetResultState();
                }
              }}
              placeholder="e.g. I Tried the Hardest Loadout"
              autoFocus
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-base font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
            />
            <span className="mt-1.5 block text-right text-xs text-slate-500">
              {title.length}/{TITLE_LIMIT}
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-200">
              Subtitle{" "}
              <span className="font-normal text-slate-500">(optional)</span>
            </span>
            <input
              value={subtitle}
              onChange={(event) => {
                if (event.target.value.length <= SUBTITLE_LIMIT) {
                  setSubtitle(event.target.value);
                  resetResultState();
                }
              }}
              placeholder="e.g. Best sniper setup in Season 4"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
            />
            <span className="mt-1.5 block text-right text-xs text-slate-500">
              {subtitle.length}/{SUBTITLE_LIMIT}
            </span>
          </label>
        </div>

        <div>
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-slate-200">
              Image reference{" "}
              <span className="font-normal text-slate-500">(optional)</span>
            </h4>
            <p className="mt-1 text-xs text-slate-500">
              Use a face, game capture, saved design, or let the selected format
              and game lead.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                value: "none" as const,
                title: "No reference",
                description: "Generate from the format, game, and text.",
              },
              {
                value: "upload" as const,
                title: "Upload image",
                description: "Use a PNG or JPG from this device.",
              },
              {
                value: "designs" as const,
                title: "My Designs",
                description: "Use an existing GamingLogoAI image.",
              },
            ].map((option) => {
              const isSelected = effectiveSource === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => selectSource(option.value)}
                  className={clsx(
                    "rounded-xl border-2 bg-slate-950 p-4 text-left transition",
                    isSelected
                      ? "border-purple-500 ring-4 ring-purple-500/10"
                      : "border-slate-700 hover:border-purple-500/60",
                  )}
                  aria-pressed={isSelected}
                >
                  <span className="text-sm font-bold text-white">
                    {option.title}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>

          {effectiveSource === "upload" && (
            <div className="mt-3 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-4">
              {!isAuthenticated ? (
                <div className="py-3 text-center">
                  <p className="text-sm text-slate-400">
                    Sign in to upload a reference image securely.
                  </p>
                  <Button
                    type="button"
                    className="mt-3"
                    onClick={() =>
                      void signIn("google", {
                        callbackUrl:
                          typeof window !== "undefined"
                            ? window.location.href
                            : "/studio?tool=thumbnail",
                      })
                    }
                  >
                    Sign in to upload
                  </Button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center gap-4 rounded-lg px-2 py-3 transition hover:bg-slate-900">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-xl text-purple-300">
                    <FaCloudUploadAlt aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-200">
                      {referenceUrl
                        ? "Replace reference image"
                        : "Choose PNG or JPG"}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      Maximum file size 5 MB
                    </span>
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    className="sr-only"
                    onChange={onUploadChange}
                  />
                </label>
              )}

              {(localPreviewUrl || referenceUrl) && (
                <div className="mt-3 flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 p-3">
                  <img
                    src={localPreviewUrl ?? referenceUrl ?? ""}
                    alt="Uploaded thumbnail reference"
                    className="h-20 w-32 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {isUploading
                        ? "Uploading image…"
                        : referenceUrl
                          ? "Reference ready"
                          : "Preparing upload…"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Used as an AI visual reference.
                    </p>
                  </div>
                </div>
              )}

              {uploadError && (
                <p className="mt-3 text-sm text-red-300" role="alert">
                  {uploadError}
                </p>
              )}
            </div>
          )}

          {effectiveSource === "designs" && (
            <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              {!isAuthenticated ? (
                <div className="py-3 text-center">
                  <p className="text-sm text-slate-400">
                    Sign in to browse your saved designs.
                  </p>
                  <Button
                    type="button"
                    className="mt-3"
                    onClick={() =>
                      void signIn("google", {
                        callbackUrl:
                          typeof window !== "undefined"
                            ? window.location.href
                            : "/studio?tool=thumbnail",
                      })
                    }
                  >
                    Sign in to browse
                  </Button>
                </div>
              ) : iconsQuery.isLoading ? (
                <p className="py-6 text-center text-sm text-slate-400">
                  Loading your designs…
                </p>
              ) : availableDesigns.length === 0 ? (
                <div className="py-5 text-center">
                  <p className="text-sm text-slate-400">
                    No eligible saved designs yet.
                  </p>
                  <Link
                    href="/studio?tool=logo"
                    className="mt-3 inline-flex text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                  >
                    Create a logo first
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {availableDesigns.slice(0, 12).map((icon) => {
                    const designUrl = getDesignImageUrl(icon);
                    const isSelected = referenceUrl === designUrl;

                    return (
                      <button
                        key={icon.id}
                        type="button"
                        onClick={() => {
                          setReferenceUrl(designUrl);
                          resetResultState();
                        }}
                        className={clsx(
                          "overflow-hidden rounded-lg border-2 bg-slate-900 text-left transition",
                          isSelected
                            ? "border-cyan-400 ring-4 ring-cyan-400/10"
                            : "border-slate-800 hover:border-purple-500",
                        )}
                      >
                        <div className="relative aspect-video">
                          <img
                            src={designUrl}
                            alt={icon.prompt ?? "Saved design"}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <p className="truncate p-2 text-[11px] font-medium text-slate-400">
                          {getPromptLabel(icon.prompt)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!canContinue}
        nextLabel="Review choices"
      />
    </div>
  );
}

export function StudioThumbnailFunnel({
  requestedContext,
}: {
  requestedContext: ThumbnailDeepLinkContext | null;
}) {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);
  const {
    currentStep,
    hasHydrated,
    selectedPlatform,
    selectedFormatId,
    selectedGameId,
    referenceSource,
    referenceUrl,
    title,
    subtitle,
    originalImageUrl,
    originalIconId,
    currentImageUrl,
    currentIconId,
    isGenerating,
    sessionCreditsSpent,
    refinementHistory,
    setCurrentStep,
    setSelectedPlatform,
    setSelectedGameId,
    setReferenceSource,
    setReferenceUrl,
    setOriginalImageUrl,
    setOriginalIconId,
    setCurrentImageUrl,
    setCurrentIconId,
    setIsGenerating,
    setSessionCreditsSpent,
    setRefinementHistory,
    resetResultState,
    startOver,
  } = useFunnel();
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [error, setError] = useState("");
  const [refinementPrompt, setRefinementPrompt] = useState("");
  const [hasSummaryPreviewError, setHasSummaryPreviewError] = useState(false);
  const appliedDeepLinkRef = useRef<string | null>(null);

  const createUploadUrl = api.s3.createUploadUrl.useMutation();
  const generateThumbnail = api.thumbnailFunnel.generate.useMutation();
  const refineThumbnail = api.thumbnailFunnel.refine.useMutation();

  const selectedFormat = useMemo(
    () =>
      THUMBNAIL_FORMATS.find((format) => format.id === selectedFormatId) ??
      null,
    [selectedFormatId],
  );
  const selectedGame = useMemo(
    () => THUMBNAIL_GAMES.find((game) => game.id === selectedGameId) ?? null,
    [selectedGameId],
  );
  const canvas = THUMBNAIL_PLATFORMS.youtube.surface.canvas;
  const imageWidth = canvas.width;
  const imageHeight = canvas.height;
  const generationCost = getReferenceAwareGenerationCredits(
    THUMBNAIL_GENERATION_CREDITS,
    referenceSource !== "none" && Boolean(referenceUrl),
  );

  useEffect(() => {
    if (!hasHydrated || !requestedContext) {
      return;
    }

    const deepLinkKey = requestedContext.game.id;
    if (appliedDeepLinkRef.current === deepLinkKey) {
      return;
    }

    appliedDeepLinkRef.current = deepLinkKey;
    setSelectedGameId(requestedContext.game.id);
  }, [hasHydrated, requestedContext, setSelectedGameId]);

  useEffect(() => {
    if (hasHydrated && !selectedFormat && currentStep !== "step0") {
      setCurrentStep("step0");
    }
  }, [currentStep, hasHydrated, selectedFormat, setCurrentStep]);

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  useEffect(() => {
    setHasSummaryPreviewError(false);
  }, [selectedFormatId]);

  const handleUploadChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      return;
    }

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setUploadError("Please upload a PNG or JPG reference image.");
      setReferenceUrl(null);
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      setUploadError("Reference images must be 5 MB or smaller.");
      setReferenceUrl(null);
      return;
    }

    setUploadError("");
    setReferenceSource("upload");
    resetResultState();

    try {
      const resizedFile = await imageCompression(file, {
        maxWidthOrHeight: MAX_REFERENCE_DIMENSION,
        useWebWorker: true,
        fileType: file.type,
      });

      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
      setLocalPreviewUrl(URL.createObjectURL(resizedFile));

      const presigned = await createUploadUrl.mutateAsync({
        filename: resizedFile.name,
        filetype: resizedFile.type,
      });
      const formData = new FormData();
      Object.entries(presigned.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("file", resizedFile);

      const response = await fetch(presigned.url, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Upload request failed.");
      }

      setReferenceUrl(presigned.publicUrl);
    } catch (uploadFailure) {
      console.error("Studio thumbnail upload failed:", uploadFailure);
      setReferenceUrl(null);
      setUploadError(
        "We couldn't upload that reference image. Please try again.",
      );
    }
  };

  const runGeneration = async () => {
    setError("");
    if (!isLoggedIn) {
      void signIn("google", {
        callbackUrl:
          typeof window !== "undefined"
            ? window.location.href
            : "/studio?tool=thumbnail",
      });
      return;
    }

    if (!selectedFormat || !selectedGame || !title.trim()) {
      setError("Please complete each step before generating your thumbnail.");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateThumbnail.mutateAsync({
        platform: "youtube",
        formatId: selectedFormat.id,
        gameId: selectedGame.id,
        referenceImageUrl:
          referenceSource === "none" || !referenceUrl ? null : referenceUrl,
        title: title.trim(),
        subtitle: subtitle.trim() || null,
      });

      if (!originalImageUrl || !originalIconId) {
        setOriginalImageUrl(result.url);
        setOriginalIconId(result.iconId);
      }
      setCurrentImageUrl(result.url);
      setCurrentIconId(result.iconId);
      setRefinementHistory([]);
      setSessionCreditsSpent(sessionCreditsSpent + result.creditsCharged);
      window.setTimeout(() => {
        document
          .getElementById("studio-thumbnail-result")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch (generationError) {
      console.error("Studio thumbnail generation failed:", generationError);
      setError(getErrorMessage(generationError));
    } finally {
      setIsGenerating(false);
    }
  };

  const runRefinement = async () => {
    const prompt = refinementPrompt.trim();
    if (!currentIconId || !prompt) {
      setError("Add one refinement request before continuing.");
      return;
    }

    setError("");
    setIsGenerating(true);
    try {
      const result = await refineThumbnail.mutateAsync({
        platform: "youtube",
        iconId: currentIconId,
        refinementPrompt: prompt,
      });
      setCurrentImageUrl(result.url);
      setCurrentIconId(result.iconId);
      setSessionCreditsSpent(sessionCreditsSpent + result.creditsCharged);
      setRefinementHistory(
        [
          {
            url: result.url,
            prompt,
            timestamp: new Date().toISOString(),
          },
          ...refinementHistory,
        ].slice(0, 5),
      );
      setRefinementPrompt("");
    } catch (refinementError) {
      console.error("Studio thumbnail refinement failed:", refinementError);
      setError(getErrorMessage(refinementError));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!currentImageUrl) {
      return;
    }

    try {
      const response = await fetch(currentImageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch generated thumbnail.");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = buildStudioDownloadFilename({
        text: title || session?.user?.name,
        toolType: "youtube-thumbnail",
      });
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (downloadError) {
      console.error("Studio thumbnail download failed:", downloadError);
      setError(getErrorMessage(downloadError));
    }
  };

  const renderGenerateStep = () => (
    <div>
      <StepHeading
        step={5}
        title="Review and generate"
        description="Confirm the essentials and credit cost, then create your exact 1280 × 720 YouTube thumbnail."
      />

      <div className="mx-auto mt-10 max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-[320px,minmax(0,1fr)]">
          <div className="space-y-3">
            <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-md">
              {selectedFormat && !hasSummaryPreviewError ? (
                <Image
                  src={selectedFormat.previewImage}
                  alt={`${selectedFormat.name} format summary preview`}
                  fill
                  sizes="320px"
                  className="object-cover"
                  onError={() => setHasSummaryPreviewError(true)}
                  unoptimized
                />
              ) : selectedFormat ? (
                <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-700 to-slate-900 px-5 text-center">
                  <span className="font-bold text-white">
                    {selectedFormat.name}
                  </span>
                  <span className="mt-1 text-xs text-purple-200">
                    Preview coming soon
                  </span>
                </div>
              ) : null}
            </div>
            {referenceSource !== "none" && referenceUrl && (
              <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                <img
                  src={referenceUrl}
                  alt="Selected thumbnail reference"
                  className="h-14 w-20 rounded-lg object-cover"
                />
                <span className="text-xs font-semibold text-slate-300">
                  Image reference included
                </span>
              </div>
            )}
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Platform", value: "YouTube" },
              {
                label: "Format",
                value: selectedFormat?.name ?? "Not selected",
              },
              {
                label: "Game",
                value: selectedGame?.name ?? "Not selected",
              },
              { label: "Title", value: title.trim() },
              { label: "Subtitle", value: subtitle.trim() || "No subtitle" },
              {
                label: "Reference",
                value:
                  referenceSource === "upload" && referenceUrl
                    ? "Uploaded image"
                    : referenceSource === "designs" && referenceUrl
                      ? "Saved design"
                      : "No reference",
              },
              { label: "Output", value: "1280 × 720 PNG · 16:9" },
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
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-cyan-400">
                Credit cost
              </dt>
              <dd className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-cyan-300">
                <FaCoins aria-hidden="true" />
                {generationCost} credits
              </dd>
            </div>
          </dl>
        </div>

        {error && (
          <div
            className="mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            role="alert"
          >
            {error.toLowerCase().includes("enough gaming credits") ? (
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
            onClick={() => setCurrentStep("step2")}
            disabled={isGenerating}
          >
            <FaArrowLeft aria-hidden="true" />
            Back
          </Button>
          <Button
            type="button"
            onClick={() => void runGeneration()}
            isLoading={isGenerating && !refineThumbnail.isLoading}
            disabled={refineThumbnail.isLoading}
            className="min-w-[200px]"
          >
            {currentImageUrl && !isGenerating && <FaRedo aria-hidden="true" />}
            {isGenerating && !refineThumbnail.isLoading
              ? "Generating…"
              : isLoggedIn
                ? currentImageUrl
                  ? `Generate again for ${generationCost} credits`
                  : `Generate for ${generationCost} credits`
                : "Sign in to generate"}
          </Button>
        </div>

        {isGenerating && !refineThumbnail.isLoading && !currentImageUrl && (
          <div className="mt-8 rounded-xl border border-purple-500/30 bg-purple-500/10 p-6 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-purple-500" />
            <p className="mt-4 font-semibold text-white">
              Building your YouTube thumbnail
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Applying the format, game theme, headline, and image reference.
            </p>
          </div>
        )}

        {currentImageUrl && (
          <section
            id="studio-thumbnail-result"
            className="mt-10 border-t border-slate-800 pt-8"
          >
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-400">
                  Generation complete
                </p>
                <h4 className="mt-1 text-xl font-bold text-white">
                  Your YouTube thumbnail
                </h4>
              </div>
              <Link
                href="/collection"
                className="text-xs font-semibold text-cyan-300 hover:text-cyan-200"
              >
                Saved to My Designs
              </Link>
            </div>

            <StudioWatermarkNotice />

            <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-md">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={currentImageUrl}
                  alt={`Generated YouTube thumbnail for ${title}`}
                  className="h-full w-full object-cover"
                />
                {isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-purple-500" />
                      <p className="mt-3 text-sm font-semibold text-white">
                        {refineThumbnail.isLoading
                          ? "Refining your thumbnail…"
                          : "Generating a new thumbnail…"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 p-4">
                <p className="text-xs text-slate-500">
                  {imageWidth} × {imageHeight}px · 16:9 PNG ·{" "}
                  {sessionCreditsSpent} credits used this session
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => void handleDownload()}
                  disabled={isGenerating}
                >
                  <FaDownload aria-hidden="true" />
                  Download PNG
                </Button>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h5 className="font-bold text-white">
                    Refine this thumbnail
                  </h5>
                  <p className="mt-1 text-sm text-slate-400">
                    Ask for one focused visual or text change at a time.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
                  <FaCoins aria-hidden="true" />6 credits
                </span>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  value={refinementPrompt}
                  onChange={(event) => {
                    if (event.target.value.length <= REFINEMENT_PROMPT_LIMIT) {
                      setRefinementPrompt(event.target.value);
                    }
                  }}
                  placeholder="e.g. make the face larger and increase title contrast"
                  className="min-h-[46px] flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                />
                <Button
                  type="button"
                  onClick={() => void runRefinement()}
                  isLoading={refineThumbnail.isLoading}
                  disabled={
                    !refinementPrompt.trim() || isGenerating || !currentIconId
                  }
                >
                  Refine
                </Button>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  {refinementPrompt.length}/{REFINEMENT_PROMPT_LIMIT}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (originalImageUrl && originalIconId) {
                      setCurrentImageUrl(originalImageUrl);
                      setCurrentIconId(originalIconId);
                    }
                  }}
                  disabled={
                    !originalImageUrl ||
                    !originalIconId ||
                    currentImageUrl === originalImageUrl ||
                    isGenerating
                  }
                  className="text-xs font-semibold text-purple-300 transition hover:text-purple-200 disabled:cursor-not-allowed disabled:text-slate-600"
                >
                  Reset to original
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  startOver();
                  setLocalPreviewUrl(null);
                  setUploadError("");
                  setError("");
                  setRefinementPrompt("");
                }}
                disabled={isGenerating}
              >
                Start over
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );

  if (!hasHydrated) {
    return (
      <section className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center shadow-md">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-purple-500" />
        <p className="mt-4 text-sm text-slate-400">
          Restoring your thumbnail workspace…
        </p>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <FunnelProgress
        currentStep={selectedPlatform === "youtube" ? currentStep : "platform"}
      />
      <section className="mt-5 rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-md sm:p-8 lg:p-10">
        {selectedPlatform !== "youtube" ? (
          <PlatformStep
            onNext={() => {
              const deepLinkedGameId = selectedGameId;
              setSelectedPlatform("youtube");
              if (deepLinkedGameId) {
                setSelectedGameId(deepLinkedGameId);
              }
              setCurrentStep("step0");
            }}
          />
        ) : currentStep === "step0" ? (
          <FormatStep
            onBack={() => setSelectedPlatform(null)}
            onNext={() => setCurrentStep("step1")}
          />
        ) : currentStep === "step1" ? (
          <GameStep
            onBack={() => setCurrentStep("step0")}
            onNext={() => setCurrentStep("step2")}
          />
        ) : currentStep === "step2" ? (
          <PersonalizeStep
            localPreviewUrl={localPreviewUrl}
            uploadError={uploadError}
            isUploading={createUploadUrl.isLoading}
            onUploadChange={(event) => void handleUploadChange(event)}
            onBack={() => setCurrentStep("step1")}
            onNext={() => {
              resetResultState();
              setCurrentStep("step3");
            }}
          />
        ) : (
          renderGenerateStep()
        )}
      </section>
    </div>
  );
}
