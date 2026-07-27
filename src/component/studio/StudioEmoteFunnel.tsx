import clsx from "clsx";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ChangeEvent,
} from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaCloudUploadAlt,
  FaCoins,
  FaDownload,
  FaRedo,
} from "react-icons/fa";

import { Button } from "~/component/Button";
import {
  emoteBaseStyles,
  type EmoteBaseStyleItem,
} from "~/data/emoteBaseStyles";
import { emotes, type EmoteKey } from "~/data/emotes";
import { api } from "~/utils/api";

type FunnelStep = 1 | 2 | 3 | 4;

const BASE_COST = 3;
const EMOTE_COST = 3;
const TWITCH_PREVIEW_SIZES = [112, 56, 28] as const;
const TEXT_COLORS = [
  "#ffffff",
  "#000000",
  "#ff3b3b",
  "#ff9800",
  "#ffd600",
  "#4caf50",
  "#00e5ff",
  "#2196f3",
  "#9c27b0",
  "#ff2fd4",
] as const;

const STEP_DETAILS: Array<{
  step: FunnelStep;
  shortTitle: string;
}> = [
  { step: 1, shortTitle: "Upload" },
  { step: 2, shortTitle: "Base Style" },
  { step: 3, shortTitle: "Expressions" },
  { step: 4, shortTitle: "Generate" },
];

const CHECKERBOARD_STYLE: CSSProperties = {
  backgroundColor: "#f8fafc",
  backgroundImage:
    "linear-gradient(45deg, #cbd5e1 25%, transparent 25%), linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5e1 75%), linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)",
  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
  backgroundSize: "16px 16px",
};

const firstCategory = Object.keys(emoteBaseStyles)[0] ?? "";
const firstSubcategory =
  Object.keys(emoteBaseStyles[firstCategory] ?? {})[0] ?? "";
const firstStyle =
  emoteBaseStyles[firstCategory]?.[firstSubcategory]?.[0] ?? null;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "We couldn't finish that emote request. Please try again.";
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function buildBasePrompt(style: EmoteBaseStyleItem): string {
  return `
Create a Twitch emote base image from the provided image.
${style.basePrompt}.
Neutral expression.
Centered face.
Optimized for small emote sizes.
No transparent or semi-transparent areas inside the face.
`.trim();
}

function FunnelProgress({ currentStep }: { currentStep: FunnelStep }) {
  return (
    <ol
      className="grid grid-cols-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-sm"
      aria-label="Emote creation progress"
    >
      {STEP_DETAILS.map((item) => {
        const isCurrent = item.step === currentStep;
        const isComplete = item.step < currentStep;

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
              {isComplete ? <FaCheck aria-hidden="true" /> : item.step}
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
  step: FunnelStep;
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

function UploadStep({
  previewUrl,
  isCompressing,
  onFileChange,
  onNext,
}: {
  previewUrl: string | null;
  isCompressing: boolean;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[500px] max-w-3xl flex-col justify-center">
      <StepHeading
        step={1}
        title="Upload your face or avatar"
        description="Choose a clear PNG or JPG. The existing emote flow uses this image to keep your base character recognizable."
      />

      <label
        className={clsx(
          "mx-auto mt-10 flex w-full max-w-xl cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-slate-950/60 p-6 text-center transition sm:p-8",
          previewUrl
            ? "border-purple-500"
            : "border-slate-700 hover:border-purple-500/70",
        )}
      >
        {previewUrl ? (
          <>
            <div className="relative h-56 w-56 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-md">
              <Image
                src={previewUrl}
                alt="Uploaded face or avatar"
                fill
                sizes="224px"
                className="object-cover"
                unoptimized
              />
            </div>
            <span className="mt-5 text-sm font-semibold text-white">
              Choose a different image
            </span>
          </>
        ) : (
          <>
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/10 text-2xl text-purple-300">
              <FaCloudUploadAlt aria-hidden="true" />
            </span>
            <span className="mt-4 text-base font-semibold text-white">
              Drop in a face photo or avatar
            </span>
            <span className="mt-1 text-sm text-slate-500">
              PNG or JPG · compressed securely before generation
            </span>
          </>
        )}
        <input
          type="file"
          accept="image/png,image/jpeg"
          className="sr-only"
          onChange={onFileChange}
        />
      </label>

      <div className="mt-8 flex justify-center">
        <Button
          type="button"
          onClick={onNext}
          disabled={!previewUrl || isCompressing}
          isLoading={isCompressing}
          className="min-w-40"
        >
          Choose base style
          <FaArrowRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

function StyleStep({
  activeCategory,
  activeSubcategory,
  selectedStyle,
  baseImageUrl,
  isGenerating,
  onCategoryChange,
  onSubcategoryChange,
  onStyleSelect,
  onGenerateBase,
  onDownloadBase,
  onBack,
  onNext,
}: {
  activeCategory: string;
  activeSubcategory: string;
  selectedStyle: EmoteBaseStyleItem | null;
  baseImageUrl: string | null;
  isGenerating: boolean;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
  onStyleSelect: (style: EmoteBaseStyleItem) => void;
  onGenerateBase: () => void;
  onDownloadBase: () => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const categories = Object.keys(emoteBaseStyles);
  const subcategories = Object.keys(emoteBaseStyles[activeCategory] ?? {});
  const styles =
    emoteBaseStyles[activeCategory]?.[activeSubcategory] ??
    ([] as EmoteBaseStyleItem[]);

  return (
    <div>
      <StepHeading
        step={2}
        title="Choose and generate your base"
        description="Pick the real art direction used by the existing emote tool, then create one neutral character for the whole expression set."
      />

      <div className="mt-8 space-y-5">
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          aria-label="Emote style categories"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={clsx(
                "shrink-0 rounded-lg border px-4 py-2 text-sm font-semibold transition",
                activeCategory === category
                  ? "border-purple-500 bg-purple-600 text-white"
                  : "border-slate-700 bg-slate-950 text-slate-300 hover:border-purple-500/60 hover:text-white",
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div
          className="flex gap-2 overflow-x-auto pb-1"
          aria-label={`${activeCategory} style groups`}
        >
          {subcategories.map((subcategory) => (
            <button
              key={subcategory}
              type="button"
              onClick={() => onSubcategoryChange(subcategory)}
              className={clsx(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                activeSubcategory === subcategory
                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                  : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-slate-200",
              )}
            >
              {subcategory}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-white">{activeSubcategory}</h4>
              <p className="text-xs text-slate-500">
                {styles.length} style{styles.length === 1 ? "" : "s"}
              </p>
            </div>
            {selectedStyle && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                <FaCheck aria-hidden="true" />
                {selectedStyle.name}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {styles.map((style) => {
              const isSelected = selectedStyle?.id === style.id;

              return (
                <button
                  key={`${activeCategory}-${activeSubcategory}-${style.id}`}
                  type="button"
                  onClick={() => onStyleSelect(style)}
                  className={clsx(
                    "group overflow-hidden rounded-xl border-2 bg-slate-900 text-left shadow-sm transition",
                    isSelected
                      ? "border-cyan-400 ring-4 ring-cyan-400/10"
                      : "border-slate-800 hover:-translate-y-0.5 hover:border-purple-500",
                  )}
                  aria-pressed={isSelected}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={style.preview}
                      alt={`${style.name} emote base style`}
                      fill
                      sizes="(max-width: 640px) 45vw, 180px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t border-slate-800 p-2.5">
                    <span className="truncate text-xs font-semibold text-slate-200">
                      {style.name}
                    </span>
                    {isSelected && (
                      <FaCheck
                        className="shrink-0 text-cyan-400"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-slate-800 bg-slate-950/60 p-5">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-slate-700"
              style={baseImageUrl ? CHECKERBOARD_STYLE : undefined}
            >
              {baseImageUrl ? (
                <img
                  src={baseImageUrl}
                  alt="Generated transparent base emote"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-3 text-center text-xs text-slate-600">
                  Base preview
                </div>
              )}
            </div>
            <div>
              <h4 className="font-bold text-white">
                {baseImageUrl ? "Base emote ready" : "Generate your base emote"}
              </h4>
              <p className="mt-1 max-w-sm text-sm leading-6 text-slate-400">
                This creates the consistent character used by every selected
                expression.
              </p>
              <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                <FaCoins aria-hidden="true" />
                {BASE_COST} credits
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
            {baseImageUrl && (
              <Button
                type="button"
                variant="secondary"
                onClick={onDownloadBase}
                disabled={isGenerating}
              >
                <FaDownload aria-hidden="true" />
                Base PNG
              </Button>
            )}
            <Button
              type="button"
              onClick={onGenerateBase}
              isLoading={isGenerating}
              className="min-w-[176px]"
            >
              {baseImageUrl && !isGenerating && <FaRedo aria-hidden="true" />}
              {baseImageUrl ? "Generate base again" : "Generate base"}
            </Button>
          </div>
        </div>
      </div>

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!baseImageUrl || isGenerating}
        nextLabel="Choose expressions"
      />
    </div>
  );
}

function ExpressionsStep({
  selectedEmotes,
  withText,
  textColor,
  onToggleEmote,
  onWithTextChange,
  onTextColorChange,
  onBack,
  onNext,
}: {
  selectedEmotes: EmoteKey[];
  withText: boolean;
  textColor: string | null;
  onToggleEmote: (emote: EmoteKey) => void;
  onWithTextChange: (value: boolean) => void;
  onTextColorChange: (value: string | null) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const setCost = selectedEmotes.length * EMOTE_COST;

  return (
    <div>
      <StepHeading
        step={3}
        title="Choose your expressions"
        description="Build the pack you actually need. Select or remove any expression, then choose whether its label should appear."
      />

      <div className="mx-auto mt-10 max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-white">Expression set</h4>
            <p className="mt-1 text-sm text-slate-400">
              {emotes.length} existing expressions · {selectedEmotes.length}{" "}
              selected
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-300">
            <FaCoins aria-hidden="true" />
            {setCost} credits
          </span>
        </div>

        <div className="mt-4 max-h-[360px] overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex flex-wrap gap-2.5">
            {emotes.map((emote) => {
              const isSelected = selectedEmotes.includes(emote.key);

              return (
                <button
                  key={emote.key}
                  type="button"
                  onClick={() => onToggleEmote(emote.key)}
                  className={clsx(
                    "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition",
                    isSelected
                      ? "border-purple-500 bg-purple-600 text-white shadow-sm"
                      : "border-slate-700 bg-slate-900 text-slate-300 hover:border-purple-500/70 hover:text-white",
                  )}
                  aria-pressed={isSelected}
                >
                  <span
                    className={clsx(
                      "flex h-4 w-4 items-center justify-center rounded-full border text-[8px]",
                      isSelected
                        ? "border-white/70 bg-white/15"
                        : "border-slate-600",
                    )}
                  >
                    {isSelected && <FaCheck aria-hidden="true" />}
                  </span>
                  {emote.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950/60 p-5">
          <h4 className="font-bold text-white">Expression text</h4>
          <p className="mt-1 text-sm text-slate-400">
            Match the current tool’s labeled or clean no-text output.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              {
                value: true,
                title: "Include expression text",
                description: "Add labels such as GG, LOL, or HYPE.",
              },
              {
                value: false,
                title: "No text",
                description: "Keep the character and expression clean.",
              },
            ].map((option) => (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => onWithTextChange(option.value)}
                className={clsx(
                  "rounded-xl border-2 bg-slate-900 p-4 text-left transition",
                  withText === option.value
                    ? "border-purple-500 ring-4 ring-purple-500/10"
                    : "border-slate-700 hover:border-purple-500/60",
                )}
                aria-pressed={withText === option.value}
              >
                <span className="text-sm font-bold text-white">
                  {option.title}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  {option.description}
                </span>
              </button>
            ))}
          </div>

          {withText && (
            <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3">
              <p className="text-sm font-semibold text-slate-200">
                Text color{" "}
                <span className="font-normal text-slate-500">(optional)</span>
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Position remains top-right. Auto lets the AI match the style.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onTextColorChange(null)}
                  className={clsx(
                    "h-9 rounded-full border px-3 text-xs font-bold transition",
                    textColor === null
                      ? "border-purple-400 bg-purple-500/20 text-purple-200"
                      : "border-slate-700 text-slate-400 hover:border-slate-600",
                  )}
                >
                  Auto
                </button>
                {TEXT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onTextColorChange(color)}
                    className={clsx(
                      "h-9 w-9 rounded-full border-2 transition hover:scale-105",
                      textColor === color
                        ? "scale-110 border-purple-400 ring-2 ring-purple-500/30"
                        : "border-slate-600",
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Use ${color} text`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        nextDisabled={selectedEmotes.length === 0}
        nextLabel="Review emote set"
      />
    </div>
  );
}

function EmoteResults({
  results,
  onDownload,
}: {
  results: Array<{ emote: string; imageUrl: string }>;
  onDownload: (imageUrl: string, emote: string) => void;
}) {
  return (
    <section
      id="studio-emote-results"
      className="mt-10 border-t border-slate-800 pt-8"
    >
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-400">
          Generation complete
        </p>
        <h4 className="mt-1 text-xl font-bold text-white">
          Your transparent Twitch emotes
        </h4>
        <p className="mt-2 text-sm text-slate-400">
          Checkerboards reveal the preserved transparent PNG background.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {results.map(({ emote, imageUrl }) => (
          <article
            key={`${emote}-${imageUrl}`}
            className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-md"
          >
            <div
              className="flex aspect-square items-center justify-center p-5"
              style={CHECKERBOARD_STYLE}
            >
              <img
                src={imageUrl}
                alt={`${emote} transparent Twitch emote`}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="border-t border-slate-800 p-4">
              <div className="flex items-center justify-between gap-3">
                <h5 className="text-lg font-bold text-white">{emote}</h5>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => onDownload(imageUrl, emote)}
                >
                  <FaDownload aria-hidden="true" />
                  PNG
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {TWITCH_PREVIEW_SIZES.map((size) => (
                  <div key={size} className="text-center">
                    <div
                      className="mx-auto flex h-[120px] items-center justify-center overflow-hidden rounded-lg border border-slate-700"
                      style={CHECKERBOARD_STYLE}
                    >
                      <img
                        src={imageUrl}
                        alt={`${emote} at ${size} pixels`}
                        width={size}
                        height={size}
                        className="object-contain"
                      />
                    </div>
                    <p className="mt-1.5 text-[10px] font-bold text-slate-500">
                      {size}×{size}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function StudioEmoteFunnel() {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);
  const [currentStep, setCurrentStep] = useState<FunnelStep>(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [activeCategory, setActiveCategory] = useState(firstCategory);
  const [activeSubcategory, setActiveSubcategory] = useState(firstSubcategory);
  const [selectedStyle, setSelectedStyle] = useState<EmoteBaseStyleItem | null>(
    firstStyle,
  );
  const [baseImageUrl, setBaseImageUrl] = useState<string | null>(null);
  const [selectedEmotes, setSelectedEmotes] = useState<EmoteKey[]>([]);
  const [withText, setWithText] = useState(true);
  const [textColor, setTextColor] = useState<string | null>(null);
  const [generatedEmotes, setGeneratedEmotes] = useState<
    Array<{ emote: string; imageUrl: string }>
  >([]);
  const [error, setError] = useState("");

  const generateBaseImage = api.emoteBase.generateBaseImage.useMutation();
  const generateEmotes = api.emoteBase.generateEmotes.useMutation();
  const finalSetCost = selectedEmotes.length * EMOTE_COST;

  const selectedEmoteLabels = useMemo(
    () =>
      emotes
        .filter((emote) => selectedEmotes.includes(emote.key))
        .map((emote) => emote.label),
    [selectedEmotes],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetGeneratedState = () => {
    setBaseImageUrl(null);
    setGeneratedEmotes([]);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      return;
    }

    setError("");
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setError("Only PNG or JPG images are supported.");
      return;
    }

    setIsCompressing(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setUploadedFile(compressed);
      setPreviewUrl(URL.createObjectURL(compressed));
      resetGeneratedState();
      setSelectedEmotes([]);
    } catch (compressionError) {
      console.error("Studio emote image compression failed:", compressionError);
      setUploadedFile(null);
      setPreviewUrl(null);
      setError("Failed to process that image. Please try another one.");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    const subcategory = Object.keys(emoteBaseStyles[category] ?? {})[0] ?? "";
    const style = emoteBaseStyles[category]?.[subcategory]?.[0] ?? null;
    setActiveCategory(category);
    setActiveSubcategory(subcategory);
    setSelectedStyle(style);
    resetGeneratedState();
  };

  const handleSubcategoryChange = (subcategory: string) => {
    const style = emoteBaseStyles[activeCategory]?.[subcategory]?.[0] ?? null;
    setActiveSubcategory(subcategory);
    setSelectedStyle(style);
    resetGeneratedState();
  };

  const handleStyleSelect = (style: EmoteBaseStyleItem) => {
    setSelectedStyle(style);
    resetGeneratedState();
  };

  const handleGenerateBase = async () => {
    setError("");
    if (!isLoggedIn) {
      void signIn("google", {
        callbackUrl:
          typeof window !== "undefined"
            ? window.location.href
            : "/studio?tool=emote",
      });
      return;
    }

    if (!uploadedFile || !selectedStyle) {
      setError("Upload an image and choose a base style first.");
      return;
    }

    try {
      const inputImageBase64 = await fileToDataUrl(uploadedFile);
      if (inputImageBase64.length > 5_000_000) {
        setError("Image is still too large after compression.");
        return;
      }

      const result = await generateBaseImage.mutateAsync({
        prompt: buildBasePrompt(selectedStyle),
        platform: "twitch",
        inputImageBase64,
      });
      setBaseImageUrl(result.baseImageUrl);
      setGeneratedEmotes([]);
    } catch (generationError) {
      console.error("Studio emote base generation failed:", generationError);
      setError(getErrorMessage(generationError));
    }
  };

  const handleToggleEmote = (emote: EmoteKey) => {
    setSelectedEmotes((current) =>
      current.includes(emote)
        ? current.filter((item) => item !== emote)
        : [...current, emote],
    );
    setGeneratedEmotes([]);
  };

  const handleGenerateEmotes = async () => {
    setError("");
    if (!isLoggedIn) {
      void signIn("google", {
        callbackUrl:
          typeof window !== "undefined"
            ? window.location.href
            : "/studio?tool=emote",
      });
      return;
    }

    if (!baseImageUrl || selectedEmotes.length === 0) {
      setError("Generate a base and select at least one expression first.");
      return;
    }

    try {
      const results = await generateEmotes.mutateAsync({
        baseImageUrl,
        emotes: selectedEmotes,
        withText,
        textPosition: "top-right",
        textColor: withText ? (textColor ?? undefined) : undefined,
      });
      setGeneratedEmotes(results);
      window.setTimeout(() => {
        document
          .getElementById("studio-emote-results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch (generationError) {
      console.error("Studio emote set generation failed:", generationError);
      setError(getErrorMessage(generationError));
    }
  };

  const handleDownload = async (imageUrl: string, emote: string) => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch the generated emote.");
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${emote.toLowerCase()}_twitch_emote.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (downloadError) {
      console.error("Studio emote download failed:", downloadError);
      setError(getErrorMessage(downloadError));
    }
  };

  const renderGenerateStep = () => (
    <div>
      <StepHeading
        step={4}
        title="Review and generate"
        description="Confirm the expression set and final credit cost. Each output remains a square transparent PNG."
      />

      <div className="mx-auto mt-10 max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-[240px,minmax(0,1fr)]">
          <div
            className="relative mx-auto aspect-square w-full max-w-[240px] overflow-hidden rounded-xl border border-slate-700 shadow-md"
            style={CHECKERBOARD_STYLE}
          >
            {baseImageUrl && (
              <img
                src={baseImageUrl}
                alt="Transparent base emote summary"
                className="h-full w-full object-contain"
              />
            )}
          </div>

          <div>
            <dl className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  label: "Base style",
                  value: selectedStyle?.name ?? "Not selected",
                },
                {
                  label: "Expressions",
                  value: `${selectedEmotes.length} selected`,
                },
                {
                  label: "Text",
                  value: withText ? "Top-right labels" : "No text",
                },
                {
                  label: "Format",
                  value: "Transparent square PNG",
                },
                {
                  label: "Twitch previews",
                  value: "112 / 56 / 28 px",
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
              <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-cyan-400">
                  Final set cost
                </dt>
                <dd className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-cyan-300">
                  <FaCoins aria-hidden="true" />
                  {finalSetCost} credits
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap gap-2">
              {selectedEmoteLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-200"
                >
                  {label}
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
            {error.toLowerCase().includes("not enough gaming credits") ? (
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
            onClick={() => setCurrentStep(3)}
            disabled={generateEmotes.isLoading}
          >
            <FaArrowLeft aria-hidden="true" />
            Back
          </Button>
          <Button
            type="button"
            onClick={() => void handleGenerateEmotes()}
            isLoading={generateEmotes.isLoading}
            className="min-w-[210px]"
          >
            {generatedEmotes.length > 0 && !generateEmotes.isLoading && (
              <FaRedo aria-hidden="true" />
            )}
            {generateEmotes.isLoading
              ? "Generating emotes…"
              : isLoggedIn
                ? generatedEmotes.length > 0
                  ? `Generate again for ${finalSetCost} credits`
                  : `Generate for ${finalSetCost} credits`
                : "Sign in to generate"}
          </Button>
        </div>

        {generateEmotes.isLoading && generatedEmotes.length === 0 && (
          <div className="mt-8 rounded-xl border border-purple-500/30 bg-purple-500/10 p-6 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-purple-500" />
            <p className="mt-4 font-semibold text-white">
              Creating your emote set
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Keeping the same character while applying each expression.
            </p>
          </div>
        )}

        {generatedEmotes.length > 0 && (
          <EmoteResults
            results={generatedEmotes}
            onDownload={(imageUrl, emote) =>
              void handleDownload(imageUrl, emote)
            }
          />
        )}
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    if (currentStep === 1) {
      return (
        <UploadStep
          previewUrl={previewUrl}
          isCompressing={isCompressing}
          onFileChange={(event) => void handleFileChange(event)}
          onNext={() => setCurrentStep(2)}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <StyleStep
          activeCategory={activeCategory}
          activeSubcategory={activeSubcategory}
          selectedStyle={selectedStyle}
          baseImageUrl={baseImageUrl}
          isGenerating={generateBaseImage.isLoading}
          onCategoryChange={handleCategoryChange}
          onSubcategoryChange={handleSubcategoryChange}
          onStyleSelect={handleStyleSelect}
          onGenerateBase={() => void handleGenerateBase()}
          onDownloadBase={() => {
            if (baseImageUrl) {
              void handleDownload(baseImageUrl, "emote-base");
            }
          }}
          onBack={() => setCurrentStep(1)}
          onNext={() => setCurrentStep(3)}
        />
      );
    }

    if (currentStep === 3) {
      return (
        <ExpressionsStep
          selectedEmotes={selectedEmotes}
          withText={withText}
          textColor={textColor}
          onToggleEmote={handleToggleEmote}
          onWithTextChange={(value) => {
            setWithText(value);
            setGeneratedEmotes([]);
          }}
          onTextColorChange={(value) => {
            setTextColor(value);
            setGeneratedEmotes([]);
          }}
          onBack={() => setCurrentStep(2)}
          onNext={() => setCurrentStep(4)}
        />
      );
    }

    return renderGenerateStep();
  };

  return (
    <div className="mx-auto max-w-6xl">
      <FunnelProgress currentStep={currentStep} />
      <section className="mt-5 rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-md sm:p-8 lg:p-10">
        {error && currentStep !== 4 && (
          <div
            className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            role="alert"
          >
            {error}
          </div>
        )}
        {renderCurrentStep()}
      </section>
    </div>
  );
}
