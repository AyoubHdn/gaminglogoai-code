/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";

import { Button } from "~/component/Button";
import { FormGroup } from "~/component/FormGroup";
import { Input } from "~/component/Input";
import { SharePopup } from "~/component/SharePopup";

import { api } from "~/utils/api";
import { TWITCH_STREAM_SCREEN_STYLES } from "~/data/twitchStreamScreenStyles";

const TwitchStreamScreensGeneratorPage: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  /* ------------------------------------------------------------------ */
  /* State */
  /* ------------------------------------------------------------------ */
  const [selectedStyleId, setSelectedStyleId] = useState<string>(
    TWITCH_STREAM_SCREEN_STYLES[0]?.id ?? ""
  );

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [error, setError] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  const [selectedAiId, setSelectedAiId] = useState<string | null>(null);
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);

  const [shareFor, setShareFor] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  /* ------------------------------------------------------------------ */
  /* Derived */
  /* ------------------------------------------------------------------ */
  const style = TWITCH_STREAM_SCREEN_STYLES.find(
    (s) => s.id === selectedStyleId
  );

  const aiEnhancements = style?.aiEnhancements ?? [];
  const maxTitle = style?.maxTitleChars ?? 32;
  const maxSubtitle = style?.maxSubtitleChars ?? 64;

  /* ------------------------------------------------------------------ */
  /* TRPC */
  /* ------------------------------------------------------------------ */
  const generateScreen = api.twitchStreamScreen.generate.useMutation({
    onSuccess(data) {
      setGeneratedUrl(data?.[0]?.imageUrl ?? null);
      setIsGenerating(false);
      setError("");
      setTimeout(
        () =>
          document
            .getElementById("result")
            ?.scrollIntoView({ behavior: "smooth" }),
        120
      );
    },
    onError(err) {
      setError(err.message ?? "Generation failed");
      setIsGenerating(false);
    },
  });

  const enhanceScreen = api.enhancement.enhanceImage.useMutation({
    onSuccess(data) {
      setEnhancedUrl(data?.[0]?.imageUrl ?? null);
    },
    onError(err) {
      setError(err.message ?? "Enhancement failed");
    },
  });

  /* ------------------------------------------------------------------ */
  /* Effects */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (generatedUrl && aiEnhancements.length && !selectedAiId) {
      setSelectedAiId(aiEnhancements[0]?.id ?? "");
    }
  }, [generatedUrl, aiEnhancements, selectedAiId]);

  /* ------------------------------------------------------------------ */
  /* Handlers */
  /* ------------------------------------------------------------------ */
  const handleGenerate = async () => {
    setError("");

    if (!isLoggedIn) {
      void signIn(undefined, { callbackUrl: router.asPath });
      return;
    }

    if (!style) return;

    if (!title.trim()) {
      setError("Main text is required");
      return;
    }

    if (title.length > maxTitle) {
      setError(`Title max ${maxTitle} characters`);
      return;
    }

    if (subtitle.length > maxSubtitle) {
      setError(`Subtitle max ${maxSubtitle} characters`);
      return;
    }

    setIsGenerating(true);
    setGeneratedUrl(null);
    setEnhancedUrl(null);

    generateScreen.mutate({
      styleId: selectedStyleId,
      title: title.trim(),
      subtitle: subtitle.trim(),
    });
  };

  const handleDownload = async (url: string) => {
    setIsDownloading(true);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "stream-screen.png";
      a.click();
      URL.revokeObjectURL(blobUrl);
    } finally {
      setIsDownloading(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Render */
  /* ------------------------------------------------------------------ */
  return (
    <>
      <Head>
        <title>AI Streaming Screens Generator | GamingLogoAI</title>
        <meta
          name="description"
          content="Create professional Starting Soon, BRB, Offline, and Ending stream screens in 1920×1080 using AI."
        />
        <link
          rel="canonical"
          href="https://gaminglogoai.com/twitch-stream-screens-generator"
        />
      </Head>

      <main className="container mx-auto max-w-screen-xl px-4 py-10">
        {/* HERO */}
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold">
            AI Streaming Screens Generator
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Design professional <strong>Starting Soon</strong>,{" "}
            <strong>BRB</strong>, <strong>Offline</strong>, and{" "}
            <strong>Ending</strong> screens in full HD (1920×1080).
          </p>
        </header>

        {/* QUICK TEXT PRESETS */}
        <section className="mb-10 text-center">
          <h2 className="text-lg font-semibold mb-3">
            Quick presets
          </h2>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setTitle("STARTING SOON");
                setSubtitle("Grab a drink, we’ll be live shortly");
              }}
              className="px-4 py-2 rounded-full border text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Starting Soon
            </button>

            <button
              onClick={() => {
                setTitle("BE RIGHT BACK");
                setSubtitle("Don’t go anywhere");
              }}
              className="px-4 py-2 rounded-full border text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Be Right Back
            </button>

            <button
              onClick={() => {
                setTitle("STREAM OFFLINE");
                setSubtitle("Thanks for watching");
              }}
              className="px-4 py-2 rounded-full border text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Offline
            </button>

            <button
              onClick={() => {
                setTitle("STREAM ENDED");
                setSubtitle("See you next time");
              }}
              className="px-4 py-2 rounded-full border text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Ending
            </button>
          </div>
        </section>

        {/* FORM */}
        <form
          className="flex flex-col gap-8"
          onSubmit={(e) => {
            e.preventDefault();
            void handleGenerate();
          }}
        >
          {/* STYLE SELECT */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Choose a Style</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TWITCH_STREAM_SCREEN_STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedStyleId(s.id)}
                  className={clsx(
                    "rounded-lg overflow-hidden border-2",
                    selectedStyleId === s.id
                      ? "border-purple-600 shadow-lg"
                      : "border-transparent"
                  )}
                >
                  <div className="relative aspect-video">
                    <Image
                      src={s.previewSrc}
                      alt={s.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-2 text-sm bg-white dark:bg-slate-800">
                    {s.name}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* TEXT INPUT */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Text</h2>

            <FormGroup>
              <label className="block mb-2 font-medium">Main Text *</label>
              <Input
                value={title}
                onChange={(e) =>
                  e.target.value.length <= maxTitle &&
                  setTitle(e.target.value)
                }
                placeholder="STARTING SOON"
              />
            </FormGroup>

            <FormGroup className="mt-4">
              <label className="block mb-2 font-medium">
                Subtitle (optional)
              </label>
              <Input
                value={subtitle}
                onChange={(e) =>
                  e.target.value.length <= maxSubtitle &&
                  setSubtitle(e.target.value)
                }
                placeholder="We’ll be live shortly"
              />
            </FormGroup>
          </section>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          <Button isLoading={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Screen"}
          </Button>
        </form>

        {/* RESULT */}
        {(generatedUrl || enhancedUrl) && (
          <section id="result" className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Your Screen</h2>

            <div className="rounded-lg border shadow-xl overflow-hidden">
              <Image
                src={enhancedUrl || generatedUrl || ""}
                alt="Generated streaming screen"
                width={1920}
                height={1080}
                unoptimized
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                onClick={() =>
                  handleDownload(enhancedUrl || generatedUrl || "")
                }
                disabled={isDownloading}
              >
                Download PNG
              </Button>

              <Button
                variant="secondary"
                onClick={() =>
                  window.open(enhancedUrl || generatedUrl || "", "_blank")
                }
              >
                Open Full Size
              </Button>

              <Button
                variant="secondary"
                onClick={() =>
                  setShareFor(enhancedUrl || generatedUrl || "")
                }
              >
                Share
              </Button>
            </div>
          </section>
        )}

        {/* AI ENHANCE */}
        {generatedUrl && aiEnhancements.length > 0 && (
          <section className="mt-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h3 className="text-xl font-semibold mb-2">Enhance with AI</h3>
            <p className="text-sm mb-3">
              ✨ AI Enhancement · <strong>5 Credits</strong>
            </p>

            <div className="flex gap-3 mb-4">
              {aiEnhancements.map((ai) => (
                <button
                  key={ai.id}
                  onClick={() => setSelectedAiId(ai.id)}
                  className={clsx(
                    "px-4 py-2 rounded border",
                    selectedAiId === ai.id
                      ? "bg-purple-600 text-white"
                      : "bg-white dark:bg-slate-700"
                  )}
                >
                  {ai.name}
                </button>
              ))}
            </div>

            <Button
              isLoading={enhanceScreen.isPending}
              onClick={() => {
                const ai = aiEnhancements.find((a) => a.id === selectedAiId);
                if (!ai || !generatedUrl) return;

                enhanceScreen.mutate({
                  prompt: ai.prompt,
                  model: "flux-kontext-max",
                  referenceImageUrl: generatedUrl,
                });
              }}
            >
              Apply AI Enhancement
            </Button>
          </section>
        )}

        {shareFor && (
          <SharePopup
            imageUrl={shareFor}
            imageAlt="Streaming screen"
            defaultText="I created this streaming screen with GamingLogoAI!"
            siteUrl="https://gaminglogoai.com"
            generatorUrl="/twitch-stream-screens-generator"
            onClose={() => setShareFor(null)}
          />
        )}
      </main>
    </>
  );
};

export default TwitchStreamScreensGeneratorPage;
