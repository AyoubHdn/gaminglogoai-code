/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Button } from "~/component/Button";
import { Input } from "~/component/Input";
import { api } from "~/utils/api";
import { useSession, signIn } from "next-auth/react";
import clsx from "clsx";
import imageCompression from "browser-image-compression";

/* ------------------------------------------------------------------ */
/* STYLES (SMALL SCALE TEST) */
/* ------------------------------------------------------------------ */

const EMOTE_STYLES = [
  {
    id: "cartoon",
    name: "Cartoon",
    preview: "/emote-styles/cartoon.webp",
    basePrompt:
      "cute cartoon character face, bold outlines, expressive eyes, esports style",
  },
  {
    id: "chibi",
    name: "Chibi",
    preview: "/emote-styles/chibi.webp",
    basePrompt:
      "chibi character face, big head, kawaii proportions, clean lines",
  },
  {
    id: "mascot",
    name: "Mascot",
    preview: "/emote-styles/mascot.webp",
    basePrompt:
      "esports mascot character face, strong shape language, logo-ready",
  },
  {
    id: "anime",
    name: "Anime",
    preview: "/emote-styles/anime.webp",
    basePrompt:
      "anime-style character face, clean line art, vibrant colors",
  },
];

/* ------------------------------------------------------------------ */

const EmoteGeneratorPage: NextPage = () => {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [baseImageUrl, setBaseImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateBaseImage = api.emoteBase.generateBaseImage.useMutation({
    onSuccess(data) {
      setBaseImageUrl(data.baseImageUrl);
      setError(null);
    },
    onError(err) {
      setError(err.message);
    },
  });

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

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
        setError("Only PNG, JPG, or WEBP images are allowed.");
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

    const style = EMOTE_STYLES.find((s) => s.id === selectedStyle);
    if (!style) return;

    const base64Image = await fileToBase64(uploadedFile);

    const finalPrompt = `
Create a Twitch emote base image from the provided image.
${style.basePrompt}.
Character description: ${description || "gaming character"}.
Neutral expression.
Centered face.
Transparent background.
Optimized for small emote sizes.
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

  /* ------------------------------------------------------------------ */

  return (
    <>
      <Head>
        <title>AI Emote Generator | GamingLogoAI</title>
      </Head>

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold mb-2">
            AI Emote Generator
          </h1>
          <p className="text-slate-600">
            Step 2: Create your base emote image
          </p>
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
                Click to upload (PNG, JPG, WEBP)
              </span>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => handleUpload(e.target.files?.[0])}
            />
          </label>
        </section>

        {/* Description */}
        <section className="mb-8">
          <Input
            placeholder="Optional description (e.g. happy gamer with headset)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </section>

        {/* Styles */}
        <section className="mb-10">
          <h2 className="font-semibold mb-3">Choose style</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {EMOTE_STYLES.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => setSelectedStyle(style.id)}
                className={clsx(
                  "rounded-xl border-2 overflow-hidden transition",
                  selectedStyle === style.id
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
                <div className="p-2 text-sm text-center">
                  {style.name}
                </div>
              </button>
            ))}
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
          Generate Base Image
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

            <Button className="mt-6">
              Continue to Emotes →
            </Button>
          </section>
        )}
      </main>
    </>
  );
};

export default EmoteGeneratorPage;
