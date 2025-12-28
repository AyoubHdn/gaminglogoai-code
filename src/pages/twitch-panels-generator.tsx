/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import { TWITCH_PANEL_STYLES } from "~/data/twitchPanelStyles";

const TwitchPanelsGeneratorPage: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  /* ------------------------------------------------------------------ */
  /* State */
  /* ------------------------------------------------------------------ */
  const [selectedStyleId, setSelectedStyleId] = useState<string>(
    TWITCH_PANEL_STYLES[0]?.id ?? ""
  );
  const [title, setTitle] = useState("");
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
  const style = TWITCH_PANEL_STYLES.find((s) => s.id === selectedStyleId);
  const aiEnhancements = style?.aiEnhancements ?? [];
  const maxChars = style?.maxTitleChars ?? 20;

  /* ------------------------------------------------------------------ */
  /* TRPC */
  /* ------------------------------------------------------------------ */
  const generatePanel = api.twitchPanel.generate.useMutation({
    onSuccess(data) {
      setGeneratedUrl(data?.[0]?.imageUrl ?? null);
      setIsGenerating(false);
      setError("");
      setTimeout(
        () => document.getElementById("result")?.scrollIntoView({ behavior: "smooth" }),
        120
      );
    },
    onError(err) {
      setError(err.message ?? "Generation failed");
      setIsGenerating(false);
    },
  });

  const enhancePanel = api.enhancement.enhanceImage.useMutation({
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
      setSelectedAiId(aiEnhancements[0]?.id ?? null);
    }
  }, [generatedUrl, aiEnhancements, selectedAiId]);

  useEffect(() => {
    if (enhancedUrl) {
      setTimeout(() => {
        document
          .getElementById("result")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
    }
  }, [enhancedUrl]);

  /* ------------------------------------------------------------------ */
  /* Handlers */
  /* ------------------------------------------------------------------ */

  const handleDownload = async (url: string) => {
  setIsDownloading(true);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Download failed");

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `twitch-panel-${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    setError("Could not download image");
  } finally {
    setIsDownloading(false);
  }
};


  const handleGenerate = async () => {
    setError("");

    if (!isLoggedIn) {
      void signIn(undefined, { callbackUrl: router.asPath });
      return;
    }

    if (!style) {
      setError("Select a panel style");
      return;
    }

    if (!title.trim()) {
      setError("Panel text is required");
      return;
    }

    if (title.length > maxChars) {
      setError(`Maximum ${maxChars} characters`);
      return;
    }

    setIsGenerating(true);
    setGeneratedUrl(null);
    setEnhancedUrl(null);

    generatePanel.mutate({
      styleId: selectedStyleId,
      title: title.trim(),
    });
  };

  /* ------------------------------------------------------------------ */
  /* Render */
  /* ------------------------------------------------------------------ */
  return (
    <>
      <Head>
        <title>AI Twitch Panels Generator | GamingLogoAI</title>
        <meta
          name="description"
          content="Create clean, neon, dark, and gradient Twitch panels instantly. Text-only panels, perfect 320×100 size."
        />
        <link rel="canonical" href="https://gaminglogoai.com/twitch-panels-generator" />
      </Head>

      <main className="container mx-auto max-w-screen-lg px-4 sm:px-8 py-10">
        {/* HERO */}
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold">
            AI Twitch Panels Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
            Create professional Twitch panels like <strong>About</strong>,{" "}
            <strong>Donate</strong>, <strong>Rules</strong>, and more — instantly.
          </p>
        </header>

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

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {TWITCH_PANEL_STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedStyleId(s.id)}
                  className={clsx(
                    "rounded-lg overflow-hidden border-2 transition",
                    selectedStyleId === s.id
                      ? "border-purple-600 shadow-lg"
                      : "border-transparent"
                  )}
                >
                  <div className="relative w-full aspect-[16/5] bg-gray-100">
                    <Image
                      src={s.previewSrc}
                      alt={s.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-2 text-sm font-medium bg-white dark:bg-slate-800">
                    {s.name}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* TEXT */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Panel Text</h2>

            <FormGroup>
              <label className="block mb-2 font-medium">Panel Title *</label>
              <Input
                value={title}
                onChange={(e) =>
                  e.target.value.length <= maxChars &&
                  setTitle(e.target.value)
                }
                placeholder="e.g. ABOUT ME"
                required
              />
              <div className="text-xs text-gray-400 mt-1">
                {title.length}/{maxChars} characters
              </div>
            </FormGroup>
          </section>

          {error && (
            <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          <Button isLoading={isGenerating} className="px-6 py-3">
            {isGenerating ? "Generating..." : "Generate Panel"}
          </Button>
        </form>

        {/* RESULT */}
        {(generatedUrl || enhancedUrl) && (
          <section id="result" className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Your Panel</h2>

            <div className="rounded-lg border overflow-hidden shadow-lg max-w-sm">
              <Image
                src={enhancedUrl || generatedUrl || ""}
                alt="Generated Twitch panel"
                width={640}
                height={200}
                unoptimized
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-4 flex flex-wrap gap-3 items-center">
              <Button
                onClick={() =>
                  handleDownload(enhancedUrl || generatedUrl || "")
                }
                disabled={isDownloading}
              >
                {isDownloading ? "Downloading..." : "Download PNG"}
              </Button>

              <Button
                onClick={() =>
                  window.open(enhancedUrl || generatedUrl || "", "_blank")
                }
                variant="secondary"
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
          <section className="mt-8 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <h3 className="text-xl font-semibold mb-2">Enhance with AI</h3>
            <p className="text-sm text-gray-500 mb-3">
              ✨ AI Enhancement · <strong>5 Credits</strong>
            </p>

            <div className="flex gap-3 mb-4">
              {aiEnhancements.map((ai) => (
                <button
                  key={ai.id}
                  onClick={() => setSelectedAiId(ai.id)}
                  className={clsx(
                    "px-4 py-2 rounded-lg border text-sm",
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
              isLoading={enhancePanel.isPending}
              onClick={() => {
                const ai = aiEnhancements.find((a) => a.id === selectedAiId);
                if (!ai || !generatedUrl) return;

                enhancePanel.mutate({
                  prompt: ai.prompt,
                  model: "nano-banana-pro",
                  referenceImageUrl: generatedUrl,
                });
              }}
            >
              Apply AI Enhancement
            </Button>
          </section>
        )}

        {/* SHARE */}
        {shareFor && (
          <SharePopup
            imageUrl={shareFor}
            imageAlt="Twitch panel"
            defaultText="I created this Twitch panel with GamingLogoAI!"
            siteUrl="https://gaminglogoai.com"
            generatorUrl="/twitch-panels-generator"
            onClose={() => setShareFor(null)}
          />
        )}
      </main>
    </>
  );
};

export default TwitchPanelsGeneratorPage;
