/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Button } from "~/component/Button";
//import { Input } from "~/component/Input";
import { api } from "~/utils/api";
import { useSession, signIn } from "next-auth/react";
import clsx from "clsx";
import imageCompression from "browser-image-compression";
import { emoteBaseStyles } from "~/data/emoteBaseStyles";
import { emotes } from "~/data/emotes";
import type { EmoteBaseStyleItem } from "~/data/emoteBaseStyles";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useEffect, useRef } from "react";
import { s3Style } from "~/utils/s3Paths";

type EmoteKey =
  | "GG" | "LOL" | "RIP" | "WOW" | "HYPE"
  | "HI" | "HEY" | "YO" | "SUP" | "WELCOME"
  | "OMG" | "WTF" | "REALLY" | "YIKES"
  | "POG" | "PROGGERS" | "OOP" | "OOF"
  | "EZ" | "EASY" | "DUB" | "TOP1" | "1HP"
  | "CRACK" | "TOXIC" | "REKT" | "FAIL"
  | "THANKS" | "BYE" | "NOOO" | "YESSS"
  | "LEGEND" | "POWER" | "DEAD" | "200IQ"
  | "GOTEM" | "GOODVIBES" | "CLIPTHAT"
  | "RAID" | "BAN" | "LIT";

const EmoteGeneratorPage: NextPage = () => {
    const { data: session } = useSession();
    const isLoggedIn = !!session;

    const BASE_COST = 3;
    const EMOTE_COST = 3;

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
    //const [description, setDescription] = useState("");
    const [baseImageUrl, setBaseImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedEmotes, setSelectedEmotes] = useState<EmoteKey[]>([]);
    const [generatedEmotes, setGeneratedEmotes] = useState<{ emote: string; imageUrl: string }[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("");
    const [activeSubCategory, setActiveSubCategory] = useState<string>("");
    const [selectedStyle, setSelectedStyle] =
    useState<EmoteBaseStyleItem | null>(null);

    const categoryScrollRef = useRef<HTMLDivElement>(null);
    const subCategoryScrollRef = useRef<HTMLDivElement>(null);

    const [showLeftCat, setShowLeftCat] = useState(false);
    const [showRightCat, setShowRightCat] = useState(false);
    const [showLeftSub, setShowLeftSub] = useState(false);
    const [showRightSub, setShowRightSub] = useState(false);

    const [useText, setUseText] = useState(true);
    const [textColor, setTextColor] = useState<string | undefined>(undefined);

    const totalCost = selectedEmotes.length * EMOTE_COST;

    useEffect(() => {
    const firstCategory = Object.keys(emoteBaseStyles)[0];
    if (!firstCategory) return;

    const categoryStyles = emoteBaseStyles[firstCategory];
    if (!categoryStyles) return;

    const firstSub = Object.keys(categoryStyles)[0];
    if (!firstSub) return;
    const subCategoryItems = categoryStyles[firstSub];
    if (!subCategoryItems) return;
    const firstItem = subCategoryItems[0];
    if (!firstItem) return;

    setActiveCategory(firstCategory);
    setActiveSubCategory(firstSub);
    setSelectedStyle(firstItem);
    }, []);

    const handleScroll = (
    ref: React.RefObject<HTMLDivElement>,
    setLeft: (v: boolean) => void,
    setRight: (v: boolean) => void
    ) => {
    if (!ref.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    setLeft(scrollLeft > 5);
    setRight(scrollLeft + clientWidth < scrollWidth - 5);
    };

    useEffect(() => {
    handleScroll(categoryScrollRef, setShowLeftCat, setShowRightCat);
    handleScroll(subCategoryScrollRef, setShowLeftSub, setShowRightSub);
    }, [activeCategory, activeSubCategory]);

  const generateBaseImage = api.emoteBase.generateBaseImage.useMutation({
    onSuccess(data) {
      setBaseImageUrl(data.baseImageUrl);
      setGeneratedEmotes([]);
      setError(null);
    },
    onError(err) {
      setError(err.message);
    },
  });

  const generateEmotes = api.emoteBase.generateEmotes.useMutation({
    onSuccess(data) {
        setGeneratedEmotes(data);
    },
    onError(err) {
        setError(err.message);
    },
    });

  const emoteScrollRef = useRef<HTMLDivElement | null>(null);

  const scrollEmotes = (dir: "left" | "right") => {
    if (!emoteScrollRef.current) return;
    emoteScrollRef.current.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  /* ------------------ Helpers ------------------ */

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const handleUpload = async (file?: File) => {
    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
        setError("Only PNG or JPG, images are allowed.");
        return;
    }

    try {
        const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        });

        setUploadedFile(compressed);
        setUploadedPreview(URL.createObjectURL(compressed));
        setError(null);
    } catch (err) {
        console.error(err);
        setError("Failed to process image.");
    }
    };

  const handleGenerate = async () => {
    if (!isLoggedIn) {
      void signIn("google");
      return;
    }

    if (!uploadedFile || !selectedStyle) {
    setError("Upload an image and choose a style.");
    return;
    }

    const base64Image = await fileToBase64(uploadedFile);

    const finalPrompt = `
Create a Twitch emote base image from the provided image.
${selectedStyle?.basePrompt}.
Neutral expression.
Centered face.
Optimized for small emote sizes.
No transparent or semi-transparent areas inside the face.
`;

    if (base64Image.length > 5_000_000) {
    setError("Image is still too large after compression.");
    return;
    }

    generateBaseImage.mutate({
      prompt: finalPrompt.trim(),
      platform: "twitch",
      inputImageBase64: base64Image,
    });
  };

  const downloadImage = async (url: string, filename: string) => {
    const res = await fetch(url);
    const blob = await res.blob();

    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
    };

    const getEmoteExampleSrc = (exampleFile: string) => {
      return useText
        ? s3Style(`/twitch/emotes/withtext/${exampleFile}`)
        : s3Style(`/twitch/emotes/notext/${exampleFile}`);
    };

  /* ------------------------------------------------------------------ */

  return (
    <>
      <Head>
        <title>AI Emote Generator | GamingLogoAI</title>
      </Head>

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold mb-3">
          AI Emote Generator
        </h1>

        <p className="text-slate-300 max-w-2xl mx-auto">
          Create custom emotes from your face or avatar.
          Generate a base emote style, then turn it into popular emotes like
          <span className="font-medium text-slate-400"> GG</span>,
          <span className="font-medium text-slate-400"> LOL</span>,
          <span className="font-medium text-slate-400"> POG</span>,
          <span className="font-medium text-slate-400"> WOW</span>, and more.
        </p>

        {/* Subtle step guide */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-slate-300">
          <span className="flex items-center gap-1">
            <span className="font-semibold text-slate-300">1.</span> Upload image
          </span>
          <span className="opacity-40">→</span>
          <span className="flex items-center gap-1">
            <span className="font-semibold text-slate-300">2.</span> Generate base emote
          </span>
          <span className="opacity-40">→</span>
          <span className="flex items-center gap-1">
            <span className="font-semibold text-slate-300">3.</span> Create emotes
          </span>
        </div>
      </header>


        {/* Upload */}
        <section className="mb-8">
          <h2 className="font-semibold mb-3">Upload face or avatar</h2>
          <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:border-purple-400 transition">
            {uploadedPreview ? (
              <Image
                src={uploadedPreview}
                alt="Preview"
                width={160}
                height={160}
                className="rounded-lg object-cover"
              />
            ) : (
              <span className="text-slate-500 text-sm">
                Click to upload (PNG, JPG)
              </span>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/png,image/jpeg"
              onChange={(e) => handleUpload(e.target.files?.[0])}
            />
          </label>
        </section>

        {/* Description */}
       {/* <section className="mb-8">
          <Input
            placeholder="Optional description (e.g. happy gamer with headset)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </section> */}

        {/* Styles */}
        <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">
            Choose base emote style
        </h2>

        {/* ================= CATEGORY TABS ================= */}
        <div className="relative mb-4 flex items-center">
            {showLeftCat && (
            <button
                type="button"
                onClick={() =>
                categoryScrollRef.current?.scrollBy({
                    left: -200,
                    behavior: "smooth",
                })
                }
                className="absolute -left-3 z-10 p-2 rounded-full bg-white shadow border"
            >
                <AiOutlineLeft />
            </button>
            )}

            <div
            ref={categoryScrollRef}
            onScroll={() =>
                handleScroll(categoryScrollRef, setShowLeftCat, setShowRightCat)
            }
            className="flex gap-2 overflow-x-auto no-scrollbar px-6"
            >
            {Object.keys(emoteBaseStyles).map((cat) => (
                <button
                key={cat}
                type="button"
                onClick={() => {
                    const categoryStyles = emoteBaseStyles[cat];
                    if (!categoryStyles) return;
                    const firstSub = Object.keys(categoryStyles)[0];
                    if (!firstSub) return;
                    const firstStyle = categoryStyles[firstSub]?.[0];
                    if (!firstStyle) return;
                    setActiveCategory(cat);
                    setActiveSubCategory(firstSub);
                    setSelectedStyle(firstStyle);
                }}
                className={clsx(
                    "px-4 py-2 rounded-lg font-semibold whitespace-nowrap",
                    activeCategory === cat
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 hover:bg-slate-200"
                )}
                >
                {cat}
                </button>
            ))}
            </div>

            {showRightCat && (
            <button
                type="button"
                onClick={() =>
                categoryScrollRef.current?.scrollBy({
                    left: 200,
                    behavior: "smooth",
                })
                }
                className="absolute -right-3 z-10 p-2 rounded-full bg-white shadow border"
            >
                <AiOutlineRight />
            </button>
            )}
        </div>

        {/* ================= SUBCATEGORY TABS ================= */}
        {activeCategory && (
            <div className="relative mb-6 flex items-center">
            {showLeftSub && (
                <button
                type="button"
                onClick={() =>
                    subCategoryScrollRef.current?.scrollBy({
                    left: -200,
                    behavior: "smooth",
                    })
                }
                className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 shadow-md border border-slate-300 dark:border-slate-600"
                >
                <AiOutlineLeft size={14} />
                </button>
            )}

            <div
                ref={subCategoryScrollRef}
                onScroll={() =>
                handleScroll(subCategoryScrollRef, setShowLeftSub, setShowRightSub)
                }
                className="flex gap-2 overflow-x-auto no-scrollbar px-6"
            >
                {Object.keys(emoteBaseStyles[activeCategory] ?? {}).map((sub) => (
                <button
                    key={sub}
                    type="button"
                    onClick={() => {
                    const firstStyle = emoteBaseStyles[activeCategory]?.[sub]?.[0];
                    if (!firstStyle) return;
                    setActiveSubCategory(sub);
                    setSelectedStyle(firstStyle);
                    }}
                    className={clsx(
                    "px-3 py-1.5 rounded-md text-sm whitespace-nowrap",
                    activeSubCategory === sub
                        ? "bg-purple-500 dark:bg-cyan-400 text-white dark:text-slate-900 scale-105" : "bg-white dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-500"
                    )}
                >
                    {sub}
                </button>
                ))}
            </div>

            {showRightSub && (
                <button
                type="button"
                onClick={() =>
                    subCategoryScrollRef.current?.scrollBy({
                    left: 200,
                    behavior: "smooth",
                    })
                }
                className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-300 dark:border-slate-600"
                >
                <AiOutlineRight size={14} />
                </button>
            )}
            </div>
        )}

        {/* ================= STYLE GRID ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(emoteBaseStyles[activeCategory]?.[activeSubCategory] ?? []).map(
            (style) => (
                <button
                key={style.id}
                type="button"
                onClick={() => setSelectedStyle(style)}
                className={clsx(
                    "rounded-xl border-2 overflow-hidden transition",
                    selectedStyle?.id === style.id
                    ? "border-purple-500 scale-105"
                    : "border-transparent hover:border-purple-300"
                )}
                >
                <div className="relative aspect-square">
                    <Image
                    src={style.preview}
                    alt={style.name}
                    fill
                    className="object-cover"
                    />
                </div>
                <div className="p-2 text-sm font-medium text-center">
                    {style.name}
                </div>
                </button>
            )
            )}
        </div>
        </section>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <Button
          onClick={handleGenerate}
          isLoading={generateBaseImage.isLoading}
          className="w-full py-4 text-lg"
        >
          Generate Base Image ({BASE_COST} credits)
        </Button>

        {/* Result */}
        {baseImageUrl && (
        <section className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">
            Base Image Ready
            </h2>

            <div className="mx-auto relative w-64 h-64 rounded-xl overflow-hidden shadow-lg">
            <Image
                src={baseImageUrl}
                alt="Generated base emote"
                fill
                className="object-cover"
            />
            </div>

            <Button
            className="mt-4"
            onClick={() => {
                if (!baseImageUrl) return;
                void downloadImage(baseImageUrl, "emote-base.png");
            }}
            >
            Download Base Image
            </Button>

        </section>
        )}

      {baseImageUrl && (
        <section className="mt-14 rounded-2xl border dark:bg-slate-900 border-purple-500 bg-slate-50 p-6 shadow-sm ">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
                Choose emotes to generate
            </h2>

            <span className="text-sm text-slate-500">
                {selectedEmotes.length} selected
            </span>
            </div>

            {/* Text Mode Toggle */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="inline-flex rounded-xl border bg-slate-100 p-1">
                <button
                type="button"
                onClick={() => setUseText(true)}
                className={clsx(
                    "px-4 py-2 rounded-lg text-sm font-medium transition",
                    useText
                    ? "bg-white shadow text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                )}
                >
                With Text
                </button>

                <button
                type="button"
                onClick={() => setUseText(false)}
                className={clsx(
                    "px-4 py-2 rounded-lg text-sm font-medium transition",
                    !useText
                    ? "bg-white shadow text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                )}
                >
                No Text
                </button>
            </div>
            </div>

            {/* Text Color Swatches */}
            {useText && (
            <div className="mb-8">
                <label className="block text-sm font-medium mb-3">
                Text color ( Optional )
                </label>

                <div className="flex flex-wrap gap-2">
                {[
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
                ].map((color) => (
                    <button
                    key={color}
                    type="button"
                    onClick={() => setTextColor(color)}
                    className={clsx(
                        "h-9 w-9 rounded-full border-2 transition",
                        textColor === color
                        ? "border-slate-900 scale-110"
                        : "border-slate-300 hover:scale-105"
                    )}
                    style={{ backgroundColor: color }}
                    aria-label={`Select ${color}`}
                    />
                ))}
                </div>
            </div>
            )}

            {/* Emote Selector */}
            <div className="relative -mx-6">
              {/* Left button */}
              <button
                type="button"
                onClick={() => scrollEmotes("left")}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full dark:bg-slate-700 shadow border p-2 hover:bg-slate-100"
              >
                ←
              </button>

              {/* Right button */}
              <button
                type="button"
                onClick={() => scrollEmotes("right")}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full dark:bg-slate-700 shadow border p-2 hover:bg-slate-100"
              >
                →
              </button>

              <div
                ref={emoteScrollRef}
                className="overflow-x-auto no-scrollbar"
              >
                <div className="flex gap-4 px-6 pb-4 ">
                  {emotes.map((emote) => {
                    const active = selectedEmotes.includes(emote.key);

                    return (
                      <button
                        key={emote.key}
                        type="button"
                        onClick={() =>
                          setSelectedEmotes((prev) =>
                            active
                              ? prev.filter((e) => e !== emote.key)
                              : [...prev, emote.key]
                          )
                        }
                        className={clsx(
                          "min-w-[120px] shrink-0 rounded-xl border-2 transition-all dark:bg-slate-500",
                          active
                            ? "border-purple-500 ring-2 ring-purple-200"
                            : "border-slate-200 hover:border-purple-300"
                        )}
                      >
                        <div className="relative aspect-square bg-slate-50 dark:bg-slate-700">
                          <Image
                            src={getEmoteExampleSrc(emote.example)}
                            alt={emote.label}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="p-2 text-sm font-semibold text-center">
                          {emote.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex justify-end">
            <Button
                isLoading={generateEmotes.isLoading}
                disabled={selectedEmotes.length === 0}
                onClick={() => {
                if (!baseImageUrl) {
                    setError("Please generate the base image first.");
                    return;
                }

                generateEmotes.mutate({
                    baseImageUrl,
                    emotes: selectedEmotes,
                    withText: useText,
                    textPosition: "top-right",
                    textColor: textColor ?? undefined,
                });
                }}
            >
                Generate Emotes • {totalCost} credits

            </Button>
            </div>
            {generatedEmotes.length > 0 && (
            <section className="mt-16">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                Your Emotes
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {generatedEmotes.map(({ emote, imageUrl }) => (
                    <div
                    key={emote}
                    className="relative rounded-xl overflow-hidden border shadow-sm"
                    >
                    <Image
                        src={imageUrl}
                        alt={`${emote} emote`}
                        width={256}
                        height={256}
                        className="object-cover"
                    />

                    <div className="absolute bottom-2 right-2">
                        <Button
                        size="sm"
                        onClick={() =>
                            downloadImage(imageUrl, `${emote}.png`)
                        }
                        >
                        Download
                        </Button>
                    </div>
                    </div>
                ))}
                </div>
            </section>
            )}
        </section>
        )}
      </main>
    </>
  );
};

export default EmoteGeneratorPage;
