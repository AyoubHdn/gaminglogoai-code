import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaCoins,
  FaDownload,
  FaExpand,
  FaRedo,
  FaShareAlt,
  FaTimes,
} from "react-icons/fa";

import { Button } from "~/component/Button";
import { SharePopup } from "~/component/SharePopup";
import { gamerStylesData } from "~/data/gamerStylesData";
import { api } from "~/utils/api";

type FunnelStep = 1 | 2 | 3 | 4 | 5;
type AIModel = "flux-schnell" | "flux-dev";
type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3";

interface StyleItem {
  src: string;
  basePrompt: string;
}

interface LogoFunnelState {
  name: string;
  basePrompt: string;
  selectedStyleImageSrc: string | null;
  selectedModel: AIModel | null;
  selectedAspectRatio: AspectRatio;
  numberOfImages: number;
}

const STEP_DETAILS: Array<{
  step: FunnelStep;
  shortTitle: string;
}> = [
  { step: 1, shortTitle: "Name" },
  { step: 2, shortTitle: "Style" },
  { step: 3, shortTitle: "Engine" },
  { step: 4, shortTitle: "Size" },
  { step: 5, shortTitle: "Generate" },
];

const ENGINE_OPTIONS: Array<{
  name: string;
  value: AIModel;
  cost: number;
  description: string;
  recommended?: boolean;
}> = [
  {
    name: "Speedy Engine",
    value: "flux-schnell",
    cost: 1,
    description:
      "Fast concepts with crisp shapes and strong gaming-logo typography.",
  },
  {
    name: "Context Pro Engine",
    value: "flux-dev",
    cost: 2,
    description:
      "More detail and stronger visual fidelity to your selected style.",
    recommended: true,
  },
];

const ASPECT_RATIO_OPTIONS: Array<{
  value: AspectRatio;
  label: string;
  description: string;
  previewClassName: string;
}> = [
  {
    value: "1:1",
    label: "Square",
    description: "Profiles and avatars",
    previewClassName: "h-14 w-14",
  },
  {
    value: "16:9",
    label: "Landscape",
    description: "Banners and video",
    previewClassName: "h-12 w-24 max-w-full",
  },
  {
    value: "9:16",
    label: "Portrait",
    description: "Mobile and stories",
    previewClassName: "h-16 w-9",
  },
  {
    value: "4:3",
    label: "Classic",
    description: "General purpose",
    previewClassName: "h-14 w-[74px] max-w-full",
  },
];

function getDisplayImagePath(src: string): string {
  return src.endsWith("e.webp") ? src : src.replace(/\.webp$/, "e.webp");
}

function getEnginePreview(
  selectedStyleImageSrc: string,
  model: AIModel,
): string {
  if (model === "flux-dev") {
    return getDisplayImagePath(selectedStyleImageSrc);
  }

  return selectedStyleImageSrc;
}

function getModelCost(model: AIModel | null): number {
  return ENGINE_OPTIONS.find((option) => option.value === model)?.cost ?? 0;
}

function FunnelProgress({ currentStep }: { currentStep: FunnelStep }) {
  return (
    <ol
      className="grid grid-cols-5 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-sm"
      aria-label="Logo creation progress"
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

function NameStep({
  name,
  onNameChange,
  onNext,
}: {
  name: string;
  onNameChange: (name: string) => void;
  onNext: () => void;
}) {
  return (
    <form
      className="mx-auto flex min-h-[480px] max-w-2xl flex-col justify-center"
      onSubmit={(event) => {
        event.preventDefault();
        if (name.trim()) {
          onNext();
        }
      }}
    >
      <StepHeading
        step={1}
        title="Your Gamer Tag / Team Name"
        description="Start with the name you want the AI to build into your gaming logo."
      />

      <div className="mx-auto mt-10 w-full max-w-xl">
        <label
          htmlFor="studio-logo-name"
          className="mb-3 block text-sm font-semibold text-slate-200"
        >
          Name to feature
        </label>
        <input
          id="studio-logo-name"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="e.g. ShadowBlade or Pixel Prowlers"
          maxLength={60}
          autoFocus
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-5 py-4 text-center text-xl font-semibold text-white shadow-sm outline-none transition placeholder:text-slate-600 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
        />
        <p className="mt-3 text-center text-xs text-slate-500">
          Short names and acronyms usually produce the strongest marks.
        </p>
      </div>

      <div className="mt-10 flex justify-center">
        <Button type="submit" disabled={!name.trim()} className="min-w-36">
          Choose a style
          <FaArrowRight aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}

function StyleStep({
  activeCategory,
  activeSubcategory,
  selectedStyleImageSrc,
  onCategoryChange,
  onSubcategoryChange,
  onStyleSelect,
  onBack,
  onNext,
}: {
  activeCategory: string;
  activeSubcategory: string;
  selectedStyleImageSrc: string | null;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
  onStyleSelect: (style: StyleItem) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const categories = Object.keys(gamerStylesData);
  const subcategories = Object.keys(gamerStylesData[activeCategory] ?? {});
  const styles =
    gamerStylesData[activeCategory]?.[activeSubcategory] ?? ([] as StyleItem[]);

  return (
    <div>
      <StepHeading
        step={2}
        title="Choose your logo style"
        description="Browse by category, narrow the collection, then select the visual direction for your logo."
      />

      <div className="mt-8 space-y-5">
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          aria-label="Style categories"
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
            {selectedStyleImageSrc && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                <FaCheck aria-hidden="true" />
                Style selected
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {styles.map((style, index) => {
              const isSelected = selectedStyleImageSrc === style.src;

              return (
                <button
                  key={`${style.src}-${index}`}
                  type="button"
                  onClick={() => onStyleSelect(style)}
                  className={clsx(
                    "group relative aspect-square min-w-0 overflow-hidden rounded-xl border-2 bg-slate-900 text-left shadow-sm transition duration-200",
                    isSelected
                      ? "border-cyan-400 ring-4 ring-cyan-400/10"
                      : "border-slate-800 hover:-translate-y-0.5 hover:border-purple-500 hover:shadow-lg",
                  )}
                  aria-label={`Select ${activeSubcategory} style ${index + 1}`}
                  aria-pressed={isSelected}
                >
                  <Image
                    src={getDisplayImagePath(style.src)}
                    alt={`${activeSubcategory} gaming logo style ${index + 1}`}
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
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!selectedStyleImageSrc}
        nextLabel="Choose an engine"
      />
    </div>
  );
}

function EngineStep({
  selectedStyleImageSrc,
  selectedModel,
  onModelSelect,
  onBack,
  onNext,
}: {
  selectedStyleImageSrc: string;
  selectedModel: AIModel | null;
  onModelSelect: (model: AIModel) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      <StepHeading
        step={3}
        title="Choose your AI engine"
        description="Pick faster exploration or extra detail. Both engines use the style you selected."
      />

      <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
        {ENGINE_OPTIONS.map((engine) => {
          const isSelected = selectedModel === engine.value;

          return (
            <button
              key={engine.value}
              type="button"
              onClick={() => onModelSelect(engine.value)}
              className={clsx(
                "relative flex min-h-[350px] flex-col rounded-xl border-2 bg-slate-950 p-5 text-left shadow-sm transition duration-200",
                isSelected
                  ? "border-purple-500 ring-4 ring-purple-500/10"
                  : "border-slate-700 hover:-translate-y-0.5 hover:border-purple-500/70 hover:shadow-lg",
              )}
              aria-pressed={isSelected}
            >
              {engine.recommended && (
                <span className="absolute right-4 top-4 z-10 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-md">
                  Recommended
                </span>
              )}

              <div className="relative mx-auto h-40 w-full max-w-sm overflow-hidden rounded-lg border border-slate-700 bg-slate-800 lg:h-[180px]">
                <Image
                  src={getEnginePreview(selectedStyleImageSrc, engine.value)}
                  alt={`${engine.name} preview`}
                  fill
                  sizes="(max-width: 768px) 80vw, 380px"
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="mt-5 flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-lg font-bold text-white">
                    {engine.name}
                  </h4>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
                    <FaCoins aria-hidden="true" />
                    {engine.cost} credit{engine.cost === 1 ? "" : "s"}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {engine.description}
                </p>
                <span
                  className={clsx(
                    "mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold",
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
              </div>
            </button>
          );
        })}
      </div>

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!selectedModel}
        nextLabel="Set logo size"
      />
    </div>
  );
}

function SizeStep({
  selectedAspectRatio,
  numberOfImages,
  onAspectRatioSelect,
  onNumberOfImagesChange,
  onBack,
  onNext,
}: {
  selectedAspectRatio: AspectRatio;
  numberOfImages: number;
  onAspectRatioSelect: (ratio: AspectRatio) => void;
  onNumberOfImagesChange: (count: number) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      <StepHeading
        step={4}
        title="Choose size and variations"
        description="Select where your logo will be used, then choose how many concepts to generate."
      />

      <div className="mx-auto mt-10 max-w-5xl">
        <h4 className="text-sm font-semibold text-slate-200">Aspect ratio</h4>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          {ASPECT_RATIO_OPTIONS.map((ratio) => {
            const isSelected = selectedAspectRatio === ratio.value;

            return (
              <button
                key={ratio.value}
                type="button"
                onClick={() => onAspectRatioSelect(ratio.value)}
                className={clsx(
                  "flex min-w-0 flex-col items-center rounded-xl border-2 bg-slate-950 p-4 text-center transition",
                  isSelected
                    ? "border-purple-500 ring-4 ring-purple-500/10"
                    : "border-slate-700 hover:border-purple-500/70",
                )}
                aria-pressed={isSelected}
              >
                <span className="flex h-20 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-900 px-3">
                  <span
                    className={clsx(
                      "block rounded-md border-2 transition",
                      ratio.previewClassName,
                      isSelected
                        ? "border-purple-400 bg-purple-500/20"
                        : "border-slate-600 bg-slate-800",
                    )}
                  />
                </span>
                <span className="mt-3 text-base font-bold text-white">
                  {ratio.value}
                </span>
                <span className="mt-0.5 text-xs font-medium text-slate-300">
                  {ratio.label}
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  {ratio.description}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-950/60 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-white">Number of variations</h4>
              <p className="mt-1 text-sm text-slate-400">
                Generate between one and four logo concepts.
              </p>
            </div>
            <div
              className="grid grid-cols-4 gap-2"
              aria-label="Number of logo variations"
            >
              {[1, 2, 3, 4].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => onNumberOfImagesChange(count)}
                  className={clsx(
                    "h-10 w-10 rounded-lg border text-sm font-bold transition",
                    numberOfImages === count
                      ? "border-purple-500 bg-purple-600 text-white"
                      : "border-slate-700 bg-slate-900 text-slate-300 hover:border-purple-500/60",
                  )}
                  aria-pressed={numberOfImages === count}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        nextLabel="Review choices"
      />
    </div>
  );
}

function ChoiceSummary({
  state,
  activeCategory,
  activeSubcategory,
}: {
  state: LogoFunnelState;
  activeCategory: string;
  activeSubcategory: string;
}) {
  const model = ENGINE_OPTIONS.find(
    (option) => option.value === state.selectedModel,
  );
  const totalCost = getModelCost(state.selectedModel) * state.numberOfImages;

  const summaryItems = [
    { label: "Name", value: state.name.trim() },
    {
      label: "Style",
      value: `${activeCategory} / ${activeSubcategory}`,
    },
    { label: "Engine", value: model?.name ?? "Not selected" },
    { label: "Size", value: state.selectedAspectRatio },
    {
      label: "Variations",
      value: `${state.numberOfImages} logo${state.numberOfImages === 1 ? "" : "s"}`,
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[220px,minmax(0,1fr)]">
      <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-md">
        {state.selectedStyleImageSrc && (
          <Image
            src={getDisplayImagePath(state.selectedStyleImageSrc)}
            alt="Selected gaming logo style"
            fill
            sizes="220px"
            className="object-cover"
            unoptimized
          />
        )}
      </div>

      <div>
        <dl className="grid gap-3 sm:grid-cols-2">
          {summaryItems.map((item) => (
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
              Total credit cost
            </dt>
            <dd className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-cyan-300">
              <FaCoins aria-hidden="true" />
              {totalCost} credit{totalCost === 1 ? "" : "s"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function ResultsGrid({
  images,
  logoName,
  onExpand,
  onDownload,
  onShare,
}: {
  images: Array<{ imageUrl: string }>;
  logoName: string;
  onExpand: (imageUrl: string) => void;
  onDownload: (imageUrl: string) => void;
  onShare: (imageUrl: string) => void;
}) {
  return (
    <section
      id="studio-logo-results"
      className="mt-10 border-t border-slate-800 pt-8"
    >
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-400">
          Generation complete
        </p>
        <h4 className="mt-1 text-xl font-bold text-white">
          Your generated gaming logos
        </h4>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {images.map(({ imageUrl }, index) => (
          <article
            key={imageUrl}
            className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-md"
          >
            <div className="relative aspect-square">
              <Image
                src={imageUrl}
                alt={`${logoName} generated gaming logo ${index + 1}`}
                fill
                sizes="(max-width: 640px) 90vw, (max-width: 1280px) 45vw, 30vw"
                className="object-cover"
              />
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-slate-800 p-3">
              <span className="text-xs font-semibold text-slate-400">
                Concept {index + 1}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onExpand(imageUrl)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                  aria-label={`View concept ${index + 1} full size`}
                >
                  <FaExpand aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onDownload(imageUrl)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                  aria-label={`Download concept ${index + 1}`}
                >
                  <FaDownload aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onShare(imageUrl)}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                  aria-label={`Share concept ${index + 1}`}
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

export function StudioLogoFunnel({
  requestedGame,
}: {
  requestedGame: string | null;
}) {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session);
  const firstCategory = Object.keys(gamerStylesData)[0] ?? "";
  const initialCategory = requestedGame ? "Game Titles" : firstCategory;
  const firstSubcategory =
    Object.keys(gamerStylesData[initialCategory] ?? {})[0] ?? "";
  const initialSubcategory = requestedGame ?? firstSubcategory;

  const [currentStep, setCurrentStep] = useState<FunnelStep>(1);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeSubcategory, setActiveSubcategory] =
    useState(initialSubcategory);
  const [state, setState] = useState<LogoFunnelState>({
    name: "",
    basePrompt: "",
    selectedStyleImageSrc: null,
    selectedModel: null,
    selectedAspectRatio: "1:1",
    numberOfImages: 1,
  });
  const [error, setError] = useState("");
  const [images, setImages] = useState<Array<{ imageUrl: string }>>([]);
  const [popupImage, setPopupImage] = useState<string | null>(null);
  const [shareImage, setShareImage] = useState<string | null>(null);

  const totalCost = getModelCost(state.selectedModel) * state.numberOfImages;

  const generateIcon = api.generate.generateIcon.useMutation({
    onSuccess(data) {
      setImages(data);
      setError("");
      window.setTimeout(() => {
        document
          .getElementById("studio-logo-results")
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
          "An unexpected error occurred. Please try again.",
      );
    },
  });

  const selectedEngine = useMemo(
    () =>
      ENGINE_OPTIONS.find((option) => option.value === state.selectedModel) ??
      null,
    [state.selectedModel],
  );

  const handleCategoryChange = (category: string) => {
    const nextSubcategory =
      Object.keys(gamerStylesData[category] ?? {})[0] ?? "";

    setActiveCategory(category);
    setActiveSubcategory(nextSubcategory);
    setState((current) => ({
      ...current,
      basePrompt: "",
      selectedStyleImageSrc: null,
    }));
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setActiveSubcategory(subcategory);
    setState((current) => ({
      ...current,
      basePrompt: "",
      selectedStyleImageSrc: null,
    }));
  };

  const handleStyleSelect = (style: StyleItem) => {
    setState((current) => ({
      ...current,
      basePrompt: style.basePrompt,
      selectedStyleImageSrc: style.src,
    }));
    setError("");
  };

  const handleGenerate = () => {
    setError("");

    if (!isLoggedIn) {
      void signIn("google", {
        callbackUrl:
          typeof window !== "undefined" ? window.location.href : "/studio",
      });
      return;
    }

    if (!state.name.trim() || !state.basePrompt || !state.selectedModel) {
      setError("Please complete each step before generating your logo.");
      return;
    }

    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "generate_gaming_logo",
        gaming_logo_name: state.name.trim(),
        gaming_logo_category: activeCategory,
        gaming_logo_subcategory: activeSubcategory,
        gaming_logo_style_image: state.selectedStyleImageSrc ?? "none",
        gaming_logo_aspect_ratio: state.selectedAspectRatio,
        gaming_logo_model: state.selectedModel,
        gaming_logo_num_images: state.numberOfImages,
      });
    }

    const finalPrompt = `${state.basePrompt.replace(
      /(''Text''|'Text'|"Text"|`Text`|\[Text\]|\[USER TEXT\])/gi,
      state.name.trim(),
    )}, gaming logo, esports emblem, vector, vibrant, dynamic, clean background, official game art`;

    setImages([]);
    generateIcon.mutate({
      prompt: finalPrompt,
      numberOfImages: state.numberOfImages,
      aspectRatio: state.selectedAspectRatio,
      model: state.selectedModel,
    });
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const imageBitmap = await createImageBitmap(blob);
      const canvas = document.createElement("canvas");
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;

      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Canvas is unavailable");
      }

      context.drawImage(imageBitmap, 0, 0);
      const pngBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );

      if (!pngBlob) {
        throw new Error("Failed to create PNG");
      }

      const blobUrl = window.URL.createObjectURL(pngBlob);
      const link = document.createElement("a");
      const safeName =
        state.name.trim().replace(/[^a-z0-9_]+/gi, "_") || "gaming-logo";

      link.href = blobUrl;
      link.download = `${safeName}_${state.selectedModel ?? "logo"}_${state.selectedAspectRatio.replace(":", "x")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (downloadError) {
      console.error("Error downloading the image:", downloadError);
      window.alert("Could not download image. Please try again.");
    }
  };

  const renderCurrentStep = () => {
    if (currentStep === 1) {
      return (
        <NameStep
          name={state.name}
          onNameChange={(name) => setState((current) => ({ ...current, name }))}
          onNext={() => setCurrentStep(2)}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <StyleStep
          activeCategory={activeCategory}
          activeSubcategory={activeSubcategory}
          selectedStyleImageSrc={state.selectedStyleImageSrc}
          onCategoryChange={handleCategoryChange}
          onSubcategoryChange={handleSubcategoryChange}
          onStyleSelect={handleStyleSelect}
          onBack={() => setCurrentStep(1)}
          onNext={() => setCurrentStep(3)}
        />
      );
    }

    if (currentStep === 3 && state.selectedStyleImageSrc) {
      return (
        <EngineStep
          selectedStyleImageSrc={state.selectedStyleImageSrc}
          selectedModel={state.selectedModel}
          onModelSelect={(selectedModel) =>
            setState((current) => ({ ...current, selectedModel }))
          }
          onBack={() => setCurrentStep(2)}
          onNext={() => setCurrentStep(4)}
        />
      );
    }

    if (currentStep === 4) {
      return (
        <SizeStep
          selectedAspectRatio={state.selectedAspectRatio}
          numberOfImages={state.numberOfImages}
          onAspectRatioSelect={(selectedAspectRatio) =>
            setState((current) => ({ ...current, selectedAspectRatio }))
          }
          onNumberOfImagesChange={(numberOfImages) =>
            setState((current) => ({ ...current, numberOfImages }))
          }
          onBack={() => setCurrentStep(3)}
          onNext={() => setCurrentStep(5)}
        />
      );
    }

    return (
      <div>
        <StepHeading
          step={5}
          title="Review and generate"
          description="Confirm your choices and credit cost. Your generated logos will appear here when they are ready."
        />

        <div className="mx-auto mt-10 max-w-4xl">
          <ChoiceSummary
            state={state}
            activeCategory={activeCategory}
            activeSubcategory={activeSubcategory}
          />

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
              onClick={() => setCurrentStep(4)}
              disabled={generateIcon.isLoading}
            >
              <FaArrowLeft aria-hidden="true" />
              Back
            </Button>

            <div className="flex flex-wrap items-center justify-end gap-3">
              {images.length > 0 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleGenerate}
                  disabled={generateIcon.isLoading}
                >
                  <FaRedo aria-hidden="true" />
                  Generate again
                </Button>
              )}
              <Button
                type="button"
                onClick={handleGenerate}
                isLoading={generateIcon.isLoading}
                className="min-w-[190px]"
              >
                {generateIcon.isLoading
                  ? "Generating..."
                  : isLoggedIn
                    ? `Generate for ${totalCost} credit${totalCost === 1 ? "" : "s"}`
                    : "Sign in to generate"}
              </Button>
            </div>
          </div>

          {generateIcon.isLoading && (
            <div className="mt-8 rounded-xl border border-purple-500/30 bg-purple-500/10 p-6 text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-purple-500" />
              <p className="mt-4 font-semibold text-white">
                Forging your logo concepts
              </p>
              <p className="mt-1 text-sm text-slate-400">
                The AI is applying {selectedEngine?.name ?? "your engine"} to
                your selected style.
              </p>
            </div>
          )}

          {images.length > 0 && (
            <ResultsGrid
              images={images}
              logoName={state.name.trim()}
              onExpand={setPopupImage}
              onDownload={(imageUrl) => void handleDownload(imageUrl)}
              onShare={setShareImage}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mx-auto max-w-6xl">
        <FunnelProgress currentStep={currentStep} />
        <section className="mt-5 rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-md sm:p-8 lg:p-10">
          {renderCurrentStep()}
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
              aria-label="Close full-size logo"
            >
              <FaTimes aria-hidden="true" />
            </button>
            <Image
              src={popupImage}
              alt={`Full-size generated logo for ${state.name.trim()}`}
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
          imageAlt={`Gaming logo generated for ${state.name.trim()}`}
          defaultText={`Check out this logo I made for "${state.name.trim()}" with GamingLogoAI!`}
          siteUrl="https://gaminglogoai.com"
          generatorUrl="/studio?tool=logo"
          onClose={() => setShareImage(null)}
        />
      )}
    </>
  );
}
