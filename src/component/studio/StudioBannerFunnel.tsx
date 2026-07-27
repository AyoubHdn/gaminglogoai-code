import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaCloudUploadAlt,
  FaCoins,
  FaDownload,
  FaRedo,
  FaTwitch,
} from "react-icons/fa";

import { Button } from "~/component/Button";
import { useFunnel } from "~/component/bannerFunnel/FunnelContext";
import { BANNER_TEMPLATES, type BannerTemplate } from "~/data/bannerTemplates";
import { PLATFORMS, type PlatformId } from "~/data/platforms";
import { filterTemplates, getAvailableFilters } from "~/lib/templateBrowser";
import { api } from "~/utils/api";
import { type BannerDeepLinkContext } from "./StudioBannerWorkspace";

type StudioBannerStep = "step0" | "step1" | "step2" | "step3";

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
const CHANNEL_NAME_LIMIT = 30;
const TAGLINE_LIMIT = 60;
const REFINEMENT_PROMPT_LIMIT = 500;

const STEP_DETAILS: Array<{
  step: StudioBannerStep;
  number: number;
  shortTitle: string;
}> = [
  { step: "step0", number: 1, shortTitle: "Platform" },
  { step: "step1", number: 2, shortTitle: "Template" },
  { step: "step2", number: 3, shortTitle: "Personalize" },
  { step: "step3", number: 4, shortTitle: "Generate" },
];

const PLATFORM_PRESENTATION: Record<
  PlatformId,
  { initials: string; accentClass: string; description: string }
> = {
  twitch: {
    initials: "Tw",
    accentClass: "bg-purple-600 text-white",
    description: "Twitch channel banner",
  },
  youtube: {
    initials: "YT",
    accentClass: "bg-red-600 text-white",
    description: "YouTube channel art",
  },
  kick: {
    initials: "K",
    accentClass: "bg-emerald-500 text-slate-950",
    description: "Kick channel banner",
  },
  discord: {
    initials: "D",
    accentClass: "bg-indigo-500 text-white",
    description: "Discord server banner",
  },
  tiktok: {
    initials: "TT",
    accentClass: "bg-slate-800 text-white",
    description: "TikTok channel art",
  },
};

function formatGameLabel(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "We couldn't finish that banner request. Please try again.";
}

function FunnelProgress({ currentStep }: { currentStep: StudioBannerStep }) {
  const currentIndex = STEP_DETAILS.findIndex(
    (item) => item.step === currentStep,
  );

  return (
    <ol
      className="grid grid-cols-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-sm"
      aria-label="Banner creation progress"
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
        Step {step} of 4
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
  const { selectedPlatform, setSelectedPlatform } = useFunnel();
  const [pendingPlatform, setPendingPlatform] = useState<PlatformId>(
    selectedPlatform ?? "twitch",
  );
  const platforms = Object.values(PLATFORMS).filter(
    (platform) => platform.surfaces.banner,
  );

  return (
    <div>
      <StepHeading
        step={1}
        title="Choose your platform"
        description="Twitch is ready now. The other platform canvases are visible so this workspace can expand without changing the flow."
      />

      <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {platforms.map((platform) => {
          const surface = platform.surfaces.banner;
          if (!surface) {
            return null;
          }

          const presentation = PLATFORM_PRESENTATION[platform.id];
          const isSelected = pendingPlatform === platform.id;

          return (
            <button
              key={platform.id}
              type="button"
              disabled={!platform.enabled}
              onClick={() => setPendingPlatform(platform.id)}
              className={clsx(
                "relative min-h-[170px] rounded-xl border-2 bg-slate-950 p-5 text-left shadow-sm transition",
                platform.enabled
                  ? "hover:-translate-y-0.5 hover:border-purple-500/70 hover:shadow-lg"
                  : "cursor-not-allowed border-slate-800 opacity-55",
                isSelected &&
                  platform.enabled &&
                  "border-purple-500 ring-4 ring-purple-500/10",
              )}
              aria-pressed={isSelected}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={clsx(
                    "flex h-11 w-11 items-center justify-center rounded-xl text-sm font-extrabold",
                    presentation.accentClass,
                  )}
                >
                  {platform.id === "twitch" ? (
                    <FaTwitch aria-hidden="true" />
                  ) : (
                    presentation.initials
                  )}
                </span>
                <span
                  className={clsx(
                    "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                    platform.enabled
                      ? "bg-cyan-500/10 text-cyan-300"
                      : "bg-slate-800 text-slate-500",
                  )}
                >
                  {platform.enabled ? "Available" : "Coming soon"}
                </span>
              </div>
              <h4 className="mt-5 text-lg font-bold text-white">
                {platform.displayName}
              </h4>
              <p className="mt-1 text-sm text-slate-400">
                {presentation.description}
              </p>
              <p className="mt-3 text-xs font-semibold text-slate-500">
                {surface.canvas.width} × {surface.canvas.height}px
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-10 flex justify-center">
        <Button
          type="button"
          onClick={() => {
            if (selectedPlatform !== pendingPlatform) {
              setSelectedPlatform(pendingPlatform);
              return;
            }
            onNext();
          }}
          className="min-w-40"
        >
          Browse templates
          <FaArrowRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  isSelected,
  onSelect,
}: {
  template: BannerTemplate;
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
      <div className="relative aspect-[5/2] overflow-hidden bg-gradient-to-br from-purple-700 via-indigo-700 to-slate-900">
        {!hasImageError ? (
          <Image
            src={template.thumbnailUrl}
            alt={`${template.name} Twitch banner template`}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 330px"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            onError={() => setHasImageError(true)}
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center px-5 text-center text-sm font-bold text-white">
            {template.name}
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
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="truncate text-sm font-bold text-white">
              {template.name}
            </h4>
            <p className="mt-1 truncate text-xs text-slate-500">
              {template.categories.games.map(formatGameLabel).join(", ")}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-1 text-[10px] font-bold text-cyan-300">
            <FaCoins aria-hidden="true" />
            {template.credits}
          </span>
        </div>
      </div>
    </button>
  );
}

function TemplateStep({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const {
    selectedTemplateId,
    setSelectedTemplateId,
    templateFilters,
    setTemplateFilters,
    resetResultState,
  } = useFunnel();
  const platformTemplates = useMemo(
    () => BANNER_TEMPLATES.filter((template) => template.platform === "twitch"),
    [],
  );
  const gameOptions = useMemo(
    () =>
      Array.from(getAvailableFilters(platformTemplates).games).sort((a, b) =>
        formatGameLabel(a).localeCompare(formatGameLabel(b)),
      ),
    [platformTemplates],
  );
  const filteredTemplates = useMemo(
    () => filterTemplates(platformTemplates, templateFilters),
    [platformTemplates, templateFilters],
  );
  const activeGame = templateFilters.games?.[0] ?? null;

  const selectGame = (game: string | null) => {
    setTemplateFilters(game ? { games: [game] } : {});
    if (
      selectedTemplateId &&
      !platformTemplates
        .filter((template) => !game || template.categories.games.includes(game))
        .some((template) => template.id === selectedTemplateId)
    ) {
      setSelectedTemplateId(null);
    }
  };

  return (
    <div>
      <StepHeading
        step={2}
        title="Choose a banner template"
        description="Browse the existing Twitch presets by game, then choose one clear visual direction."
      />

      <div className="mt-8 space-y-5">
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          aria-label="Banner game filters"
        >
          <button
            type="button"
            onClick={() => selectGame(null)}
            className={clsx(
              "shrink-0 rounded-lg border px-4 py-2 text-sm font-semibold transition",
              !activeGame
                ? "border-purple-500 bg-purple-600 text-white"
                : "border-slate-700 bg-slate-950 text-slate-300 hover:border-purple-500/60 hover:text-white",
            )}
          >
            All games
          </button>
          {gameOptions.map((game) => (
            <button
              key={game}
              type="button"
              onClick={() => selectGame(game)}
              className={clsx(
                "shrink-0 rounded-lg border px-4 py-2 text-sm font-semibold transition",
                activeGame === game
                  ? "border-purple-500 bg-purple-600 text-white"
                  : "border-slate-700 bg-slate-950 text-slate-300 hover:border-purple-500/60 hover:text-white",
              )}
            >
              {formatGameLabel(game)}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-white">
                {activeGame ? formatGameLabel(activeGame) : "Twitch templates"}
              </h4>
              <p className="text-xs text-slate-500">
                {filteredTemplates.length} template
                {filteredTemplates.length === 1 ? "" : "s"}
              </p>
            </div>
            {selectedTemplateId && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                <FaCheck aria-hidden="true" />
                Template selected
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selectedTemplateId === template.id}
                onSelect={() => {
                  setSelectedTemplateId(template.id);
                  resetResultState();
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!selectedTemplateId}
        nextLabel="Personalize banner"
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
  const {
    logoSource,
    logoUrl,
    channelName,
    tagline,
    setLogoSource,
    setLogoUrl,
    setChannelName,
    setTagline,
    resetResultState,
  } = useFunnel();
  const usesUpload = logoSource === "upload";
  const canContinue =
    Boolean(channelName.trim()) &&
    (!usesUpload || Boolean(logoUrl)) &&
    !isUploading;

  return (
    <div>
      <StepHeading
        step={3}
        title="Personalize your banner"
        description="Add the channel text that matters. A logo is optional, so the screen stays focused and easy to scan."
      />

      <div className="mx-auto mt-10 grid max-w-4xl gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-200">
              Channel name
            </span>
            <input
              value={channelName}
              onChange={(event) => {
                if (event.target.value.length <= CHANNEL_NAME_LIMIT) {
                  setChannelName(event.target.value);
                  resetResultState();
                }
              }}
              placeholder="e.g. ShadowBlade"
              autoFocus
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-base font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
            />
            <span className="mt-1.5 block text-right text-xs text-slate-500">
              {channelName.length}/{CHANNEL_NAME_LIMIT}
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-200">
              Tagline{" "}
              <span className="font-normal text-slate-500">(optional)</span>
            </span>
            <input
              value={tagline}
              onChange={(event) => {
                if (event.target.value.length <= TAGLINE_LIMIT) {
                  setTagline(event.target.value);
                  resetResultState();
                }
              }}
              placeholder="e.g. Live every night"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
            />
            <span className="mt-1.5 block text-right text-xs text-slate-500">
              {tagline.length}/{TAGLINE_LIMIT}
            </span>
          </label>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-200">
            Logo reference{" "}
            <span className="font-normal text-slate-500">(optional)</span>
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setLogoSource("none");
                setLogoUrl(null);
                resetResultState();
              }}
              className={clsx(
                "rounded-xl border-2 bg-slate-950 p-4 text-left transition",
                !usesUpload
                  ? "border-purple-500 ring-4 ring-purple-500/10"
                  : "border-slate-700 hover:border-purple-500/60",
              )}
            >
              <span className="text-sm font-bold text-white">Text only</span>
              <span className="mt-1 block text-xs leading-5 text-slate-500">
                Let the template and channel name lead.
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setLogoSource("upload");
                setLogoUrl(null);
                resetResultState();
              }}
              className={clsx(
                "rounded-xl border-2 bg-slate-950 p-4 text-left transition",
                usesUpload
                  ? "border-purple-500 ring-4 ring-purple-500/10"
                  : "border-slate-700 hover:border-purple-500/60",
              )}
            >
              <span className="text-sm font-bold text-white">Upload logo</span>
              <span className="mt-1 block text-xs leading-5 text-slate-500">
                Guide the AI with your existing identity.
              </span>
            </button>
          </div>

          {usesUpload && (
            <div className="mt-3 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-4">
              {status !== "authenticated" ? (
                <div className="py-3 text-center">
                  <p className="text-sm text-slate-400">
                    Sign in to upload a logo securely.
                  </p>
                  <Button
                    type="button"
                    className="mt-3"
                    onClick={() =>
                      void signIn("google", {
                        callbackUrl:
                          typeof window !== "undefined"
                            ? window.location.href
                            : "/studio?tool=banner",
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
                      {logoUrl ? "Replace logo" : "Choose PNG or JPG"}
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

              {(localPreviewUrl || logoUrl) && (
                <div className="mt-3 flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900 p-3">
                  <img
                    src={localPreviewUrl ?? logoUrl ?? ""}
                    alt="Uploaded logo preview"
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {isUploading
                        ? "Uploading logo…"
                        : logoUrl
                          ? "Logo ready"
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

export function StudioBannerFunnel({
  requestedContext,
}: {
  requestedContext: BannerDeepLinkContext | null;
}) {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);
  const {
    currentStep,
    hasHydrated,
    selectedTemplateId,
    logoSource,
    logoUrl,
    channelName,
    tagline,
    originalImageUrl,
    originalIconId,
    currentImageUrl,
    currentIconId,
    isGenerating,
    sessionCreditsSpent,
    refinementHistory,
    setCurrentStep,
    setSelectedPlatform,
    setSelectedTemplateId,
    setLogoSource,
    setLogoUrl,
    setOriginalImageUrl,
    setOriginalIconId,
    setCurrentImageUrl,
    setCurrentIconId,
    setIsGenerating,
    setSessionCreditsSpent,
    setRefinementHistory,
    setTemplateFilters,
    resetResultState,
    startOver,
  } = useFunnel();
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [error, setError] = useState("");
  const [refinementPrompt, setRefinementPrompt] = useState("");
  const appliedDeepLinkRef = useRef<string | null>(null);

  const createUploadUrl = api.s3.createUploadUrl.useMutation();
  const generateBanner = api.bannerFunnel.generate.useMutation();
  const refineBanner = api.bannerFunnel.refine.useMutation();

  const selectedTemplate = useMemo(
    () =>
      BANNER_TEMPLATES.find((template) => template.id === selectedTemplateId) ??
      null,
    [selectedTemplateId],
  );
  const bannerCanvas = PLATFORMS.twitch.surfaces.banner?.canvas;
  const bannerWidth = bannerCanvas?.width ?? 1200;
  const bannerHeight = bannerCanvas?.height ?? 480;
  const generationCost = selectedTemplate?.credits ?? 10;

  useEffect(() => {
    if (!hasHydrated || !requestedContext) {
      return;
    }

    const deepLinkKey = `${requestedContext.game}:${requestedContext.template.id}`;
    if (appliedDeepLinkRef.current === deepLinkKey) {
      return;
    }

    appliedDeepLinkRef.current = deepLinkKey;
    setSelectedPlatform("twitch");
    setTemplateFilters({ games: [requestedContext.game] });
    setSelectedTemplateId(requestedContext.template.id);
    setCurrentStep("step1");
  }, [
    hasHydrated,
    requestedContext,
    setCurrentStep,
    setSelectedPlatform,
    setSelectedTemplateId,
    setTemplateFilters,
  ]);

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const handleUploadChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      return;
    }

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setUploadError("Please upload a PNG or JPG logo file.");
      setLogoUrl(null);
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      setUploadError("Logo files must be 5 MB or smaller.");
      setLogoUrl(null);
      return;
    }

    setUploadError("");
    setLogoSource("upload");
    resetResultState();

    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    setLocalPreviewUrl(URL.createObjectURL(file));

    try {
      const presigned = await createUploadUrl.mutateAsync({
        filename: file.name,
        filetype: file.type,
      });
      const formData = new FormData();
      Object.entries(presigned.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("file", file);

      const response = await fetch(presigned.url, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Upload request failed.");
      }

      setLogoUrl(presigned.publicUrl);
    } catch (uploadFailure) {
      console.error("Studio banner logo upload failed:", uploadFailure);
      setLogoUrl(null);
      setUploadError("We couldn't upload that logo. Please try again.");
    }
  };

  const runGeneration = async () => {
    setError("");
    if (!isLoggedIn) {
      void signIn("google", {
        callbackUrl:
          typeof window !== "undefined"
            ? window.location.href
            : "/studio?tool=banner",
      });
      return;
    }

    if (!selectedTemplate || !channelName.trim()) {
      setError("Please complete each step before generating your banner.");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateBanner.mutateAsync({
        platform: "twitch",
        templateId: selectedTemplate.id,
        logoUrl: logoSource === "upload" ? logoUrl : null,
        channelName: channelName.trim(),
        tagline: tagline.trim() || null,
        socialHandles: [],
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
          .getElementById("studio-banner-result")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch (generationError) {
      console.error("Studio banner generation failed:", generationError);
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
      const result = await refineBanner.mutateAsync({
        platform: "twitch",
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
      console.error("Studio banner refinement failed:", refinementError);
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
        throw new Error("Failed to fetch generated banner.");
      }

      const blob = await response.blob();
      const imageBitmap = await createImageBitmap(blob);
      const canvas = document.createElement("canvas");
      canvas.width = bannerWidth;
      canvas.height = bannerHeight;
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Canvas context is unavailable.");
      }

      context.drawImage(imageBitmap, 0, 0, bannerWidth, bannerHeight);
      const pngBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!pngBlob) {
        throw new Error("Could not prepare the PNG.");
      }

      const blobUrl = window.URL.createObjectURL(pngBlob);
      const link = document.createElement("a");
      const safeName =
        channelName.trim().replace(/[^a-z0-9_-]+/gi, "_") || "twitch-banner";
      link.href = blobUrl;
      link.download = `${safeName}_twitch_banner.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (downloadError) {
      console.error("Studio banner download failed:", downloadError);
      setError(getErrorMessage(downloadError));
    }
  };

  const renderGenerateStep = () => (
    <div>
      <StepHeading
        step={4}
        title="Review and generate"
        description="Confirm the essentials and credit cost, then create your 1200 × 480 Twitch banner."
      />

      <div className="mx-auto mt-10 max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-[300px,minmax(0,1fr)]">
          <div className="space-y-3">
            <div className="relative aspect-[5/2] overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-md">
              {selectedTemplate && (
                <Image
                  src={selectedTemplate.thumbnailUrl}
                  alt={`${selectedTemplate.name} summary preview`}
                  fill
                  sizes="300px"
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
            {logoSource === "upload" && logoUrl && (
              <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                <img
                  src={logoUrl}
                  alt="Logo reference"
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <span className="text-xs font-semibold text-slate-300">
                  Logo reference included
                </span>
              </div>
            )}
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Platform", value: "Twitch" },
              {
                label: "Template",
                value: selectedTemplate?.name ?? "Not selected",
              },
              { label: "Channel name", value: channelName.trim() },
              { label: "Tagline", value: tagline.trim() || "No tagline" },
              {
                label: "Logo",
                value:
                  logoSource === "upload" && logoUrl
                    ? "Uploaded logo"
                    : "Text only",
              },
              { label: "Output", value: "1200 × 480 PNG" },
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
          <div className="flex flex-wrap items-center justify-end gap-3">
            <Button
              type="button"
              onClick={() => void runGeneration()}
              isLoading={isGenerating && !refineBanner.isLoading}
              disabled={refineBanner.isLoading}
              className="min-w-[190px]"
            >
              {currentImageUrl && !isGenerating && (
                <FaRedo aria-hidden="true" />
              )}
              {isGenerating && !refineBanner.isLoading
                ? "Generating…"
                : isLoggedIn
                  ? currentImageUrl
                    ? `Generate again for ${generationCost} credits`
                    : `Generate for ${generationCost} credits`
                  : "Sign in to generate"}
            </Button>
          </div>
        </div>

        {isGenerating && !refineBanner.isLoading && !currentImageUrl && (
          <div className="mt-8 rounded-xl border border-purple-500/30 bg-purple-500/10 p-6 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-purple-500" />
            <p className="mt-4 font-semibold text-white">
              Building your Twitch banner
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Applying your template, channel text, and visual reference.
            </p>
          </div>
        )}

        {currentImageUrl && (
          <section
            id="studio-banner-result"
            className="mt-10 border-t border-slate-800 pt-8"
          >
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-400">
                  Generation complete
                </p>
                <h4 className="mt-1 text-xl font-bold text-white">
                  Your Twitch banner
                </h4>
              </div>
              <Link
                href="/collection"
                className="text-xs font-semibold text-cyan-300 hover:text-cyan-200"
              >
                Saved to My Designs
              </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-md">
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: `${bannerWidth} / ${bannerHeight}` }}
              >
                <img
                  src={currentImageUrl}
                  alt={`Generated Twitch banner for ${channelName}`}
                  className="h-full w-full object-cover"
                />
                {isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-purple-500" />
                      <p className="mt-3 text-sm font-semibold text-white">
                        {refineBanner.isLoading
                          ? "Refining your banner…"
                          : "Generating a new banner…"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 p-4">
                <p className="text-xs text-slate-500">
                  {bannerWidth} × {bannerHeight}px · PNG · {sessionCreditsSpent}{" "}
                  credits used this session
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
                  <h5 className="font-bold text-white">Refine this banner</h5>
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
                  placeholder="e.g. make the channel name larger and change the glow to blue"
                  className="min-h-[46px] flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                />
                <Button
                  type="button"
                  onClick={() => void runRefinement()}
                  isLoading={refineBanner.isLoading}
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
          Restoring your banner workspace…
        </p>
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <FunnelProgress currentStep={currentStep} />
      <section className="mt-5 rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-md sm:p-8 lg:p-10">
        {currentStep === "step0" ? (
          <PlatformStep onNext={() => setCurrentStep("step1")} />
        ) : currentStep === "step1" ? (
          <TemplateStep
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
