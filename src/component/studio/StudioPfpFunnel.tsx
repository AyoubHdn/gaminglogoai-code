import imageCompression from "browser-image-compression";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCamera,
  FaCheck,
  FaCoins,
  FaDownload,
  FaExpand,
  FaFolderOpen,
  FaImage,
  FaRedo,
  FaShareAlt,
  FaTimes,
  FaUpload,
} from "react-icons/fa";

import { Button } from "~/component/Button";
import { SharePopup } from "~/component/SharePopup";
import { StudioWatermarkNotice } from "~/component/studio/StudioWatermarkNotice";
import { faceStylesData } from "~/data/faceStylesData";
import { PFP_MODEL_CREDITS } from "~/lib/generationPricing";
import { buildStudioDownloadFilename } from "~/lib/studioDownload";
import { api } from "~/utils/api";

type FunnelStep = 1 | 2 | 3 | 4;
type FaceAIModel = "flux-kontext-pro" | "flux-kontext-max";
type PfpFraming = "head" | "half-body" | "full-body";

export interface PfpStyleItem {
  name: string;
  src: string;
  basePrompt: string;
}

export interface PfpStyleContext {
  category: string;
  subcategory: string;
  style: PfpStyleItem;
}

interface PfpFunnelState {
  inputText: string;
  selectedStyle: PfpStyleItem | null;
  selectedModel: FaceAIModel | null;
  selectedFraming: PfpFraming;
}

const TEXT_PLACEHOLDER_PATTERN =
  /(''Text''|'Text'|"Text"|`Text`|\[Text\]|\[USER TEXT\])/gi;
const TEXT_DIRECTIVE_PATTERN =
  /\b(text|name|wordmark|lettering|typography|font|title|caption)\b/i;

const STEP_DETAILS: Array<{ step: FunnelStep; shortTitle: string }> = [
  { step: 1, shortTitle: "Style" },
  { step: 2, shortTitle: "Upload" },
  { step: 3, shortTitle: "Options" },
  { step: 4, shortTitle: "Generate" },
];

const ENGINE_OPTIONS: Array<{
  name: string;
  value: FaceAIModel;
  cost: number;
  description: string;
  recommended?: boolean;
}> = [
  {
    name: "Pro Face Engine",
    value: "flux-kontext-pro",
    cost: PFP_MODEL_CREDITS["flux-kontext-pro"],
    description:
      "High-quality face stylization with strong likeness and clean detail.",
  },
  {
    name: "Max Face Engine",
    value: "flux-kontext-max",
    cost: PFP_MODEL_CREDITS["flux-kontext-max"],
    description:
      "Maximum face detail and realism for complex, cinematic styles.",
    recommended: true,
  },
];

const FRAMING_OPTIONS: Array<{
  name: string;
  value: PfpFraming;
  description: string;
  previewImage: string;
  promptInstruction: string;
}> = [
  {
    name: "Head",
    value: "head",
    description: "Best for clear, recognizable profile pictures.",
    previewImage: "/head.webp",
    promptInstruction:
      "Crop in tightly to show ONLY the head and face — zoom close on the face, exclude the torso, vest, and body, tight portrait headshot filling the frame. Recompose to a close headshot even if the original photo shows more of the body",
  },
  {
    name: "Half Body",
    value: "half-body",
    description: "Shows the character's pose from the waist up.",
    previewImage: "/half-body.webp",
    promptInstruction:
      "Half-body composition from the chest up, head and upper torso visible",
  },
  {
    name: "Full Body",
    value: "full-body",
    description: "Fits the character's complete pose into the square.",
    previewImage: "/full-body.webp",
    promptInstruction:
      "Full-length full-body shot showing the ENTIRE character standing from head to feet, including legs and full standing pose. Generate the complete full body even if the original photo only shows the upper body — extend and imagine the full standing character",
  },
];

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function buildFaceLogoPrompt(
  basePrompt: string,
  inputText: string,
  model: FaceAIModel,
  framing: PfpFraming,
): string {
  const trimmedText = inputText.trim();
  const framingOption =
    FRAMING_OPTIONS.find((option) => option.value === framing) ??
    FRAMING_OPTIONS[0]!;
  let stylePrompt: string;
  let textInstruction = "";

  if (trimmedText) {
    stylePrompt = basePrompt.replace(TEXT_PLACEHOLDER_PATTERN, trimmedText);
  } else {
    const sanitizedSegments = basePrompt
      .replace(TEXT_PLACEHOLDER_PATTERN, "")
      .split(/,|—|–|\./)
      .map((segment) => segment.trim().replace(/\s+/g, " "))
      .filter(Boolean)
      .filter((segment) => !TEXT_DIRECTIVE_PATTERN.test(segment));

    stylePrompt =
      sanitizedSegments
        .join(", ")
        .replace(/\s+,/g, ",")
        .replace(/,\s*,+/g, ", ")
        .trim()
        .replace(/[,-]\s*$/, "") || "stylized gaming avatar portrait";
    textInstruction = "No text, letters, wordmark, or typography.";
  }

  const styleDescription = /[.!?]$/.test(stylePrompt.trim())
    ? stylePrompt.trim()
    : `${stylePrompt.trim()}.`;
  const transformationInstruction =
    "FULLY TRANSFORM the person into the selected style. Replace their ENTIRE outfit including the shirt, top, and upper-body clothing — do not keep their original shirt, sweater, or t-shirt. Give them a complete style-appropriate outfit from head to toe: new top, jacket, or armor for the upper body AND new lower-body clothing, all matching the selected style. Every piece of their original clothing must be replaced. Preserve their recognizable identity and key facial features, but render the face and person completely in the selected visual style.";
  const backgroundInstruction =
    "Also completely REPLACE the background — remove the original photo background entirely and generate a new background environment that matches the selected style and its game or theme world (an atmospheric scene, setting, or stylized backdrop fitting the style), with depth, lighting, and effects that complement the character. Do not keep the original photo's background.";
  const qualityInstruction =
    model === "flux-kontext-max"
      ? "Ultra-detailed polished game-art render, cinematic dramatic lighting, strong contrast, sharp professional finish, faithful likeness, and premium avatar quality"
      : "Highly detailed polished game-art render, dramatic lighting, strong contrast, clean professional finish, faithful likeness, and high-quality avatar artwork";

  return [
    styleDescription,
    transformationInstruction,
    backgroundInstruction,
    `${framingOption.promptInstruction}.`,
    textInstruction,
    `${qualityInstruction}.`,
  ]
    .filter(Boolean)
    .join(" ");
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read image file."));
      }
    };
    reader.onerror = () =>
      reject(reader.error ?? new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });
}

function getModelCost(model: FaceAIModel | null): number {
  return ENGINE_OPTIONS.find((option) => option.value === model)?.cost ?? 0;
}

function FunnelProgress({ currentStep }: { currentStep: FunnelStep }) {
  return (
    <ol
      className="grid grid-cols-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-sm"
      aria-label="PFP creation progress"
    >
      {STEP_DETAILS.map((item) => {
        const isCurrent = item.step === currentStep;
        const isComplete = item.step < currentStep;

        return (
          <li
            key={item.step}
            className={clsx(
              "flex min-w-0 items-center gap-2 border-r border-slate-800 px-3 py-3 last:border-r-0 sm:px-5",
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
  nextLabel,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel: string;
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
  uploadedFile,
  previewUrl,
  isCompressing,
  error,
  onFileSelect,
  onBack,
  onNext,
}: {
  uploadedFile: File | null;
  previewUrl: string | null;
  isCompressing: boolean;
  error: string;
  onFileSelect: (file: File) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div>
      <StepHeading
        step={2}
        title="Upload your face photo"
        description="Use a clear, well-lit, front-facing photo. We’ll compress it securely before generation."
      />

      <div className="mx-auto mt-10 max-w-3xl">
        <div
          className={clsx(
            "flex min-h-[360px] flex-col items-center justify-center rounded-xl border-2 border-dashed bg-slate-950/70 p-6 text-center transition sm:p-10",
            isDragging
              ? "border-purple-400 bg-purple-500/10"
              : "border-slate-700 hover:border-purple-500/70",
          )}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <>
              <div className="relative h-48 w-48 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-lg sm:h-56 sm:w-56">
                <Image
                  src={previewUrl}
                  alt="Uploaded face preview"
                  fill
                  sizes="224px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <p className="mt-5 max-w-sm truncate text-sm font-semibold text-slate-200">
                {uploadedFile?.name}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Ready for style selection
              </p>
            </>
          ) : (
            <>
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/10 text-2xl text-purple-300">
                <FaUpload aria-hidden="true" />
              </span>
              <h4 className="mt-5 text-lg font-bold text-white">
                Drop your photo here
              </h4>
              <p className="mt-2 text-sm text-slate-400">
                JPG, PNG or WebP. Images are resized to 1024px and compressed.
              </p>
            </>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              type="button"
              variant={previewUrl ? "secondary" : "primary"}
              onClick={() => fileInputRef.current?.click()}
              disabled={isCompressing}
            >
              <FaImage aria-hidden="true" />
              {previewUrl ? "Choose another photo" : "Choose photo"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => cameraInputRef.current?.click()}
              disabled={isCompressing}
              className="sm:hidden"
            >
              <FaCamera aria-hidden="true" />
              Use camera
            </Button>
          </div>

          {isCompressing && (
            <p className="mt-4 text-sm font-medium text-purple-300">
              Preparing your photo…
            </p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={handleInputChange}
            aria-label="Choose a face photo"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="user"
            className="sr-only"
            onChange={handleInputChange}
            aria-label="Take a face photo"
          />
        </div>

        {error && (
          <p
            className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!uploadedFile || isCompressing}
        nextLabel="Set PFP options"
      />
    </div>
  );
}

function StyleStep({
  activeCategory,
  activeSubcategory,
  selectedStyle,
  onCategoryChange,
  onSubcategoryChange,
  onStyleSelect,
  onBack,
  onNext,
}: {
  activeCategory: string;
  activeSubcategory: string;
  selectedStyle: PfpStyleItem | null;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
  onStyleSelect: (style: PfpStyleItem) => void;
  onBack?: () => void;
  onNext: () => void;
}) {
  const categories = Object.keys(faceStylesData);
  const subcategories = Object.keys(faceStylesData[activeCategory] ?? {});
  const styles =
    faceStylesData[activeCategory]?.[activeSubcategory] ??
    ([] as PfpStyleItem[]);

  return (
    <div>
      <StepHeading
        step={1}
        title="Choose your avatar style"
        description="Browse the existing PFP collection, then pick the transformation you want applied to your photo."
      />

      <div className="mt-8 space-y-5">
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          aria-label="PFP style categories"
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
          aria-label={`${activeCategory} subcategories`}
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
              const isSelected = selectedStyle?.src === style.src;

              return (
                <button
                  key={`${activeCategory}-${activeSubcategory}-${style.name}`}
                  type="button"
                  onClick={() => onStyleSelect(style)}
                  className={clsx(
                    "group min-w-0 overflow-hidden rounded-xl border-2 bg-slate-900 text-left shadow-sm transition duration-200",
                    isSelected
                      ? "border-cyan-400 ring-4 ring-cyan-400/10"
                      : "border-slate-800 hover:-translate-y-0.5 hover:border-purple-500 hover:shadow-lg",
                  )}
                  aria-pressed={isSelected}
                >
                  <span className="relative block aspect-square overflow-hidden">
                    <Image
                      src={style.src}
                      alt={`${style.name} PFP style`}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, 180px"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      unoptimized
                    />
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
                  </span>
                  <span className="block truncate border-t border-slate-800 px-3 py-2.5 text-center text-xs font-semibold text-slate-200">
                    {style.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!selectedStyle}
        nextLabel="Upload your photo"
      />
    </div>
  );
}

function OptionsStep({
  inputText,
  selectedModel,
  selectedFraming,
  onTextChange,
  onModelSelect,
  onFramingSelect,
  onBack,
  onNext,
}: {
  inputText: string;
  selectedModel: FaceAIModel | null;
  selectedFraming: PfpFraming;
  onTextChange: (value: string) => void;
  onModelSelect: (model: FaceAIModel) => void;
  onFramingSelect: (framing: PfpFraming) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      <StepHeading
        step={3}
        title="Personalize your PFP"
        description="Optionally add your name, choose your framing, then select the face engine that matches your preferred quality."
      />

      <div className="mx-auto mt-10 max-w-4xl">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 sm:p-6">
          <label
            htmlFor="studio-pfp-text"
            className="text-sm font-semibold text-slate-200"
          >
            Gamer tag or name{" "}
            <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <input
            id="studio-pfp-text"
            value={inputText}
            onChange={(event) => onTextChange(event.target.value)}
            placeholder="Leave empty for a text-free avatar"
            className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-base text-white shadow-sm outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
          />
          <p className="mt-2 text-xs text-slate-500">
            Empty means the prompt explicitly asks for no text or lettering.
          </p>
        </div>

        <div className="mt-8" aria-labelledby="pfp-framing-heading">
          <h4
            id="pfp-framing-heading"
            className="text-base font-semibold text-white"
          >
            Framing
          </h4>
          <p className="mt-1 text-sm text-slate-400">
            Choose how much of the character shows in your square PFP.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {FRAMING_OPTIONS.map((option) => {
              const isSelected = selectedFraming === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onFramingSelect(option.value)}
                  className={clsx(
                    "flex flex-col overflow-hidden rounded-xl border-2 bg-slate-950 p-3 text-left shadow-sm transition",
                    isSelected
                      ? "border-purple-500 ring-4 ring-purple-500/10"
                      : "border-slate-700 hover:-translate-y-0.5 hover:border-purple-500/70",
                  )}
                  aria-pressed={isSelected}
                >
                  <span className="relative mb-3 block aspect-square w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
                    <Image
                      src={option.previewImage}
                      alt={`${option.name} PFP framing example`}
                      fill
                      sizes="(min-width: 640px) 30vw, 100vw"
                      className="object-contain"
                    />
                  </span>
                  <span className="flex w-full items-center justify-between gap-3">
                    <span className="font-bold text-white">{option.name}</span>
                    <span
                      className={clsx(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                        isSelected
                          ? "border-purple-500 bg-purple-600 text-white"
                          : "border-slate-600 text-transparent",
                      )}
                    >
                      <FaCheck className="text-[9px]" aria-hidden="true" />
                    </span>
                  </span>
                  <span className="mt-2 text-xs leading-5 text-slate-400">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8" aria-labelledby="pfp-engine-heading">
          <h4
            id="pfp-engine-heading"
            className="text-base font-semibold text-white"
          >
            AI engine
          </h4>
          <p className="mt-1 text-sm text-slate-400">
            Choose your balance of generation quality and credit cost. Max is
            recommended for the strongest style detail and likeness.
          </p>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {ENGINE_OPTIONS.map((engine) => {
              const isSelected = selectedModel === engine.value;

              return (
                <button
                  key={engine.value}
                  type="button"
                  onClick={() => onModelSelect(engine.value)}
                  className={clsx(
                    "relative flex min-h-[210px] flex-col rounded-xl border-2 bg-slate-950 p-5 text-left shadow-sm transition",
                    isSelected
                      ? "border-purple-500 ring-4 ring-purple-500/10"
                      : "border-slate-700 hover:-translate-y-0.5 hover:border-purple-500/70 hover:shadow-lg",
                  )}
                  aria-pressed={isSelected}
                >
                  {engine.recommended && (
                    <span className="absolute right-4 top-4 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white">
                      Recommended
                    </span>
                  )}
                  <span className="text-lg font-bold text-white">
                    {engine.name}
                  </span>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
                    {engine.description}
                  </p>
                  <div className="mt-auto flex items-end justify-between gap-3 pt-6">
                    <span
                      className={clsx(
                        "inline-flex items-center gap-2 text-sm font-semibold",
                        isSelected ? "text-purple-300" : "text-slate-500",
                      )}
                    >
                      <span
                        className={clsx(
                          "flex h-5 w-5 items-center justify-center rounded-full border",
                          isSelected
                            ? "border-purple-500 bg-purple-600 text-white"
                            : "border-slate-600",
                        )}
                      >
                        {isSelected && (
                          <FaCheck className="text-[9px]" aria-hidden="true" />
                        )}
                      </span>
                      {isSelected ? "Selected" : "Select engine"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
                      <FaCoins aria-hidden="true" />
                      {engine.cost} credits
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!selectedModel}
        nextLabel="Review and generate"
      />
    </div>
  );
}

function ResultsGrid({
  images,
  pfpName,
  downloadingImage,
  onExpand,
  onDownload,
  onShare,
}: {
  images: Array<{ imageUrl: string }>;
  pfpName: string;
  downloadingImage: string | null;
  onExpand: (imageUrl: string) => void;
  onDownload: (imageUrl: string) => void;
  onShare: (imageUrl: string) => void;
}) {
  return (
    <section
      id="studio-pfp-results"
      className="mt-10 border-t border-slate-800 pt-8"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-400">
            Generation complete
          </p>
          <h4 className="mt-1 text-xl font-bold text-white">Your AI PFP</h4>
        </div>
        <Link
          href="/collection"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-500/50 hover:text-cyan-300"
        >
          <FaFolderOpen aria-hidden="true" />
          Saved to My Designs
        </Link>
      </div>

      <StudioWatermarkNotice />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {images.map(({ imageUrl }, index) => (
          <article
            key={imageUrl}
            className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-md"
          >
            <div className="relative aspect-square">
              <Image
                src={imageUrl}
                alt={`${pfpName || "Gaming"} generated PFP ${index + 1}`}
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 1280px) 45vw, 30vw"
                className="object-cover"
              />
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-slate-800 p-3">
              <span className="text-xs font-semibold text-slate-400">
                Avatar {index + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onExpand(imageUrl)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                  aria-label={`View avatar ${index + 1} full size`}
                >
                  <FaExpand aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onDownload(imageUrl)}
                  disabled={downloadingImage === imageUrl}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
                  aria-label={`Download avatar ${index + 1}`}
                >
                  <FaDownload aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onShare(imageUrl)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                  aria-label={`Share avatar ${index + 1}`}
                >
                  <FaShareAlt aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function StudioPfpFunnel({
  requestedStyleContext,
}: {
  requestedStyleContext: PfpStyleContext | null;
}) {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);
  const firstCategory = Object.keys(faceStylesData)[0] ?? "";
  const initialCategory = requestedStyleContext?.category ?? firstCategory;
  const firstSubcategory =
    Object.keys(faceStylesData[initialCategory] ?? {})[0] ?? "";
  const initialSubcategory =
    requestedStyleContext?.subcategory ?? firstSubcategory;

  const [currentStep, setCurrentStep] = useState<FunnelStep>(1);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeSubcategory, setActiveSubcategory] =
    useState(initialSubcategory);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [state, setState] = useState<PfpFunnelState>({
    inputText: "",
    selectedStyle: requestedStyleContext?.style ?? null,
    selectedModel: "flux-kontext-max",
    selectedFraming: "head",
  });
  const [error, setError] = useState("");
  const [images, setImages] = useState<Array<{ imageUrl: string }>>([]);
  const [popupImage, setPopupImage] = useState<string | null>(null);
  const [shareImage, setShareImage] = useState<string | null>(null);
  const [downloadingImage, setDownloadingImage] = useState<string | null>(null);

  useEffect(() => {
    if (!requestedStyleContext) {
      return;
    }

    setActiveCategory(requestedStyleContext.category);
    setActiveSubcategory(requestedStyleContext.subcategory);
    setState((current) => ({
      ...current,
      selectedStyle: requestedStyleContext.style,
    }));
  }, [requestedStyleContext]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const selectedEngine = useMemo(
    () =>
      ENGINE_OPTIONS.find((option) => option.value === state.selectedModel) ??
      null,
    [state.selectedModel],
  );
  const totalCost = getModelCost(state.selectedModel);

  const generateFaceLogo = api.faceLogo.generateFaceLogo.useMutation({
    onSuccess(data) {
      setImages(data);
      setError("");
      window.setTimeout(() => {
        document
          .getElementById("studio-pfp-results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    },
    onError(mutationError) {
      if (
        mutationError.data?.code === "BAD_REQUEST" &&
        mutationError.message.toLowerCase().includes("enough gaming credits")
      ) {
        setError("INSUFFICIENT_CREDITS");
        return;
      }

      setError(
        mutationError.message ||
          "Failed to generate your PFP. Please try again.",
      );
    },
  });

  const handleFileSelect = async (file: File) => {
    setError("");

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setUploadedFile(null);
      setPreviewUrl(null);
      setError("Invalid file type. Please upload JPG, PNG, or WebP.");
      return;
    }

    setIsCompressing(true);
    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });
      const estimatedBase64SizeMb = (compressedFile.size * 1.33) / 1024 / 1024;

      if (estimatedBase64SizeMb > 5) {
        throw new Error(
          "Image is still too large after compression. Please choose a smaller photo.",
        );
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setUploadedFile(compressedFile);
      setPreviewUrl(URL.createObjectURL(compressedFile));
    } catch (compressionError) {
      setUploadedFile(null);
      setPreviewUrl(null);
      setError(
        compressionError instanceof Error
          ? compressionError.message
          : "Could not process image. Please try another photo.",
      );
    } finally {
      setIsCompressing(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    const nextSubcategory =
      Object.keys(faceStylesData[category] ?? {})[0] ?? "";
    setActiveCategory(category);
    setActiveSubcategory(nextSubcategory);
    setState((current) => ({ ...current, selectedStyle: null }));
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setActiveSubcategory(subcategory);
    setState((current) => ({ ...current, selectedStyle: null }));
  };

  const handleGenerate = async () => {
    setError("");

    if (!isLoggedIn) {
      void signIn("google", {
        callbackUrl:
          typeof window !== "undefined"
            ? window.location.href
            : "/studio?tool=pfp",
      });
      return;
    }

    if (!uploadedFile || !state.selectedStyle || !state.selectedModel) {
      setError("Please complete each step before generating your PFP.");
      return;
    }

    try {
      const inputImageBase64 = await readFileAsDataUrl(uploadedFile);
      const prompt = buildFaceLogoPrompt(
        state.selectedStyle.basePrompt,
        state.inputText,
        state.selectedModel,
        state.selectedFraming,
      );

      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
          event: "generate_gaming_pfp",
          gaming_pfp_style: state.selectedStyle.name,
          gaming_pfp_category: activeCategory,
          gaming_pfp_subcategory: activeSubcategory,
          gaming_pfp_model: state.selectedModel,
          gaming_pfp_framing: state.selectedFraming,
          gaming_pfp_has_text: Boolean(state.inputText.trim()),
        });
      }

      setImages([]);
      generateFaceLogo.mutate({
        prompt,
        inputImageBase64,
        model: state.selectedModel,
        aspectRatio: "1:1",
      });
    } catch (fileError) {
      setError(
        fileError instanceof Error
          ? fileError.message
          : "Failed to read image file.",
      );
    }
  };

  const handleDownload = async (imageUrl: string) => {
    setDownloadingImage(imageUrl);
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = buildStudioDownloadFilename({
        text: state.inputText || session?.user?.name,
        toolType: "gaming-pfp",
      });
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (downloadError) {
      console.error("Error downloading the image:", downloadError);
      window.alert("Could not download image. Please try again.");
    } finally {
      setDownloadingImage(null);
    }
  };

  const renderGenerateStep = () => (
    <div>
      <StepHeading
        step={4}
        title="Review and generate"
        description="Confirm your photo, style, options, and credit cost before creating your avatar."
      />

      <div className="mx-auto mt-10 max-w-4xl">
        <div className="grid gap-6 lg:grid-cols-[220px,minmax(0,1fr)]">
          <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-md">
            {previewUrl && (
              <Image
                src={previewUrl}
                alt="Uploaded photo summary"
                fill
                sizes="220px"
                className="object-cover"
                unoptimized
              />
            )}
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            {[
              {
                label: "Style",
                value: state.selectedStyle?.name ?? "Not selected",
              },
              {
                label: "Category",
                value: `${activeCategory} / ${activeSubcategory}`,
              },
              {
                label: "Text",
                value: state.inputText.trim() || "No text",
              },
              {
                label: "Engine",
                value: selectedEngine?.name ?? "Not selected",
              },
              {
                label: "Framing",
                value:
                  FRAMING_OPTIONS.find(
                    (option) => option.value === state.selectedFraming,
                  )?.name ?? "Head",
              },
              { label: "Output size", value: "Square · 1:1" },
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
                {totalCost} credits
              </dd>
            </div>
          </dl>
        </div>

        {error && (
          <div
            className={clsx(
              "mt-6 rounded-lg border px-4 py-3 text-sm",
              error === "INSUFFICIENT_CREDITS"
                ? "border-amber-500/40 bg-amber-500/10 text-amber-200"
                : "border-red-500/40 bg-red-500/10 text-red-200",
            )}
            role="alert"
          >
            {error === "INSUFFICIENT_CREDITS" ? (
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
            disabled={generateFaceLogo.isLoading}
          >
            <FaArrowLeft aria-hidden="true" />
            Back
          </Button>

          <div className="flex flex-wrap items-center justify-end gap-3">
            {images.length > 0 && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => void handleGenerate()}
                disabled={generateFaceLogo.isLoading}
              >
                <FaRedo aria-hidden="true" />
                Generate again
              </Button>
            )}
            <Button
              type="button"
              onClick={() => void handleGenerate()}
              isLoading={generateFaceLogo.isLoading}
              className="min-w-[190px]"
            >
              {generateFaceLogo.isLoading
                ? "Generating..."
                : isLoggedIn
                  ? `Generate for ${totalCost} credits`
                  : "Sign in to generate"}
            </Button>
          </div>
        </div>

        {generateFaceLogo.isLoading && (
          <div className="mt-8 rounded-xl border border-purple-500/30 bg-purple-500/10 p-6 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-purple-500" />
            <p className="mt-4 font-semibold text-white">
              Transforming your photo
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {selectedEngine?.name ?? "Your engine"} is applying the{" "}
              {state.selectedStyle?.name ?? "selected"} style.
            </p>
          </div>
        )}

        {images.length > 0 && (
          <ResultsGrid
            images={images}
            pfpName={state.inputText.trim()}
            downloadingImage={downloadingImage}
            onExpand={setPopupImage}
            onDownload={(imageUrl) => void handleDownload(imageUrl)}
            onShare={setShareImage}
          />
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="mx-auto max-w-6xl">
        <FunnelProgress currentStep={currentStep} />
        <section className="mt-5 rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-md sm:p-8 lg:p-10">
          {currentStep === 1 ? (
            <StyleStep
              activeCategory={activeCategory}
              activeSubcategory={activeSubcategory}
              selectedStyle={state.selectedStyle}
              onCategoryChange={handleCategoryChange}
              onSubcategoryChange={handleSubcategoryChange}
              onStyleSelect={(selectedStyle) => {
                setState((current) => ({ ...current, selectedStyle }));
                setError("");
              }}
              onNext={() => setCurrentStep(2)}
            />
          ) : currentStep === 2 ? (
            <UploadStep
              uploadedFile={uploadedFile}
              previewUrl={previewUrl}
              isCompressing={isCompressing}
              error={error}
              onFileSelect={(file) => void handleFileSelect(file)}
              onBack={() => setCurrentStep(1)}
              onNext={() => {
                setError("");
                setCurrentStep(3);
              }}
            />
          ) : currentStep === 3 ? (
            <OptionsStep
              inputText={state.inputText}
              selectedModel={state.selectedModel}
              selectedFraming={state.selectedFraming}
              onTextChange={(inputText) =>
                setState((current) => ({ ...current, inputText }))
              }
              onModelSelect={(selectedModel) =>
                setState((current) => ({ ...current, selectedModel }))
              }
              onFramingSelect={(selectedFraming) =>
                setState((current) => ({ ...current, selectedFraming }))
              }
              onBack={() => setCurrentStep(2)}
              onNext={() => setCurrentStep(4)}
            />
          ) : (
            renderGenerateStep()
          )}
        </section>
      </div>

      {popupImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setPopupImage(null)}
        >
          <div
            className="relative h-[min(84vh,900px)] w-[min(84vw,900px)] overflow-hidden rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPopupImage(null)}
              className="absolute right-4 top-4 z-10 rounded-lg bg-slate-950/80 p-2 text-white transition hover:bg-slate-800"
              aria-label="Close full-size PFP"
            >
              <FaTimes aria-hidden="true" />
            </button>
            <Image
              src={popupImage}
              alt="Full-size generated gaming PFP"
              fill
              sizes="84vw"
              className="object-contain p-2"
            />
          </div>
        </div>
      )}

      {shareImage && (
        <SharePopup
          imageUrl={shareImage}
          imageAlt={`Gaming PFP${state.inputText.trim() ? ` for ${state.inputText.trim()}` : ""}`}
          defaultText="Check out this gaming PFP I made with GamingLogoAI!"
          siteUrl="https://gaminglogoai.com"
          generatorUrl="/studio?tool=pfp"
          onClose={() => setShareImage(null)}
        />
      )}
    </>
  );
}
