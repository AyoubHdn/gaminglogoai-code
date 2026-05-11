import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "~/component/Button";
import { useFunnel } from "~/component/bannerFunnel/FunnelContext";
import { BANNER_TEMPLATES } from "~/data/bannerTemplates";
import { PLATFORMS } from "~/data/platforms";
import {
  getBannerSocialPlatformLabel,
  getFilledBannerSocialHandles,
} from "~/lib/bannerSocials";
import { getTemplateById } from "~/lib/templateBrowser";
import { api } from "~/utils/api";

const REFINEMENT_PROMPT_LIMIT = 500;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "We couldn't finish that banner request. Please try again.";
}

export function Step3Result() {
  const {
    selectedPlatform,
    selectedTemplateId,
    logoSource,
    logoUrl,
    channelName,
    tagline,
    socialHandles,
    originalImageUrl,
    originalIconId,
    currentImageUrl,
    currentIconId,
    sessionCreditsSpent,
    refinementHistory,
    isGenerating,
    setCurrentStep,
    setOriginalImageUrl,
    setOriginalIconId,
    setCurrentImageUrl,
    setCurrentIconId,
    setSessionCreditsSpent,
    setRefinementHistory,
    setIsGenerating,
    startOver,
    clearPersistedState,
  } = useFunnel();
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  const [errorToast, setErrorToast] = useState("");
  const [refinementPrompt, setRefinementPrompt] = useState("");
  const requestCounterRef = useRef(0);
  const hasTriggeredGenerationRef = useRef(false);
  const generateBanner = api.bannerFunnel.generate.useMutation();
  const refineBanner = api.bannerFunnel.refine.useMutation();

  const selectedTemplate = useMemo(
    () => getTemplateById(BANNER_TEMPLATES, selectedTemplateId ?? ""),
    [selectedTemplateId]
  );
  const filledSocialHandles = useMemo(
    () => getFilledBannerSocialHandles(socialHandles),
    [socialHandles]
  );
  const bannerCanvas = selectedPlatform
    ? PLATFORMS[selectedPlatform].surfaces.banner?.canvas
    : null;
  const bannerWidth = bannerCanvas?.width ?? 0;
  const bannerHeight = bannerCanvas?.height ?? 0;
  const selectedTemplateKey = selectedTemplate?.id ?? "";
  const selectedPlatformKey = selectedPlatform;

  useEffect(() => {
    if (!errorToast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setErrorToast("");
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [errorToast]);

  const runGeneration = useCallback(async () => {
    if (
      !selectedPlatformKey ||
      !selectedTemplateKey ||
      !bannerWidth ||
      !bannerHeight
    ) {
      return;
    }

    hasTriggeredGenerationRef.current = true;

    const requestId = requestCounterRef.current + 1;
    requestCounterRef.current = requestId;

    setIsGenerating(true);
    setErrorToast("");

    try {
      const result = await generateBanner.mutateAsync({
        platform: selectedPlatformKey,
        templateId: selectedTemplateKey,
        logoUrl: logoSource === "none" ? null : logoUrl,
        channelName: channelName.trim(),
        tagline: tagline.trim() || null,
        socialHandles: filledSocialHandles,
      });

      if (requestCounterRef.current !== requestId) {
        return;
      }

      if (!originalImageUrl || !originalIconId) {
        setOriginalImageUrl(result.url);
        setOriginalIconId(result.iconId);
      }

      setCurrentImageUrl(result.url);
      setCurrentIconId(result.iconId);
      setRefinementHistory([]);
      setSessionCreditsSpent(sessionCreditsSpent + result.creditsCharged);
    } catch (error) {
      if (requestCounterRef.current !== requestId) {
        return;
      }

      console.error("Banner funnel generation failed:", error);
      setErrorToast(getErrorMessage(error));
    } finally {
      if (requestCounterRef.current === requestId) {
        setIsGenerating(false);
      }
    }
  }, [
    bannerHeight,
    bannerWidth,
    channelName,
    generateBanner,
    logoSource,
    logoUrl,
    originalIconId,
    originalImageUrl,
    selectedPlatformKey,
    selectedTemplateKey,
    setCurrentIconId,
    setCurrentImageUrl,
    setIsGenerating,
    setOriginalIconId,
    setOriginalImageUrl,
    setRefinementHistory,
    setSessionCreditsSpent,
    sessionCreditsSpent,
    filledSocialHandles,
    tagline,
  ]);

  const runRefinement = useCallback(async () => {
    const prompt = refinementPrompt.trim();

    if (!selectedPlatformKey || !currentIconId || !currentImageUrl || !prompt) {
      setErrorToast("Add one refinement request before continuing.");
      return;
    }

    const requestId = requestCounterRef.current + 1;
    requestCounterRef.current = requestId;

    setIsGenerating(true);
    setErrorToast("");

    try {
      const result = await refineBanner.mutateAsync({
        platform: selectedPlatformKey,
        iconId: currentIconId,
        refinementPrompt: prompt,
      });

      if (requestCounterRef.current !== requestId) {
        return;
      }

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
        ].slice(0, 5)
      );
      setRefinementPrompt("");
    } catch (error) {
      if (requestCounterRef.current !== requestId) {
        return;
      }

      console.error("Banner funnel refinement failed:", error);
      setErrorToast(getErrorMessage(error));
    } finally {
      if (requestCounterRef.current === requestId) {
        setIsGenerating(false);
      }
    }
  }, [
    currentIconId,
    currentImageUrl,
    refinementHistory,
    refinementPrompt,
    refineBanner,
    selectedPlatformKey,
    setCurrentIconId,
    setCurrentImageUrl,
    setIsGenerating,
    setRefinementHistory,
    setSessionCreditsSpent,
    sessionCreditsSpent,
  ]);

  useEffect(() => {
    if (
      !selectedPlatformKey ||
      !selectedTemplateKey ||
      !bannerWidth ||
      !bannerHeight
    ) {
      return;
    }

    if (hasTriggeredGenerationRef.current) {
      return;
    }

    if (!currentImageUrl && !isGenerating) {
      hasTriggeredGenerationRef.current = true;
      void runGeneration();
    }
  }, [
    bannerHeight,
    bannerWidth,
    channelName,
    currentImageUrl,
    isGenerating,
    logoSource,
    logoUrl,
    selectedPlatformKey,
    selectedTemplateKey,
    socialHandles,
    tagline,
  ]);

  const handleDownload = async () => {
    if (!currentImageUrl || !bannerWidth || !bannerHeight) {
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
        throw new Error("Canvas context is not available.");
      }

      context.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);

      const pngBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      if (!pngBlob) {
        throw new Error("Could not create a PNG blob.");
      }

      const blobUrl = window.URL.createObjectURL(pngBlob);
      const link = document.createElement("a");
      const safeName = (channelName.trim() || "banner").replace(
        /[^a-z0-9_\-]/gi,
        "_"
      );

      link.href = blobUrl;
      link.download = `${safeName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      clearPersistedState();
    } catch (error) {
      console.error("Banner funnel download failed:", error);
      setErrorToast(getErrorMessage(error));
    }
  };

  const handleResetToOriginal = () => {
    if (!originalImageUrl || !originalIconId) {
      return;
    }

    setCurrentImageUrl(originalImageUrl);
    setCurrentIconId(originalIconId);
  };

  const handleStartOver = () => {
    hasTriggeredGenerationRef.current = false;
    startOver();
  };

  if (!selectedPlatformKey || !selectedTemplate || !bannerWidth || !bannerHeight) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900/70">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          We need platform and template selections before generating
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Go back and choose a platform, then pick a banner template.
        </p>
        <Button
          className="mt-5"
          onClick={() => setCurrentStep(selectedPlatformKey ? "step1" : "step0")}
        >
          {selectedPlatformKey ? "Back to templates" : "Back to platform selection"}
        </Button>
      </section>
    );
  }

  const isRefineDisabled =
    !currentImageUrl ||
    !currentIconId ||
    refinementPrompt.trim().length === 0 ||
    isGenerating ||
    refineBanner.isLoading;

  return (
    <section className="space-y-6">
      {errorToast ? (
        <div className="fixed right-4 top-4 z-[90] max-w-sm rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-lg dark:border-red-700 dark:bg-red-950/80 dark:text-red-100">
          {errorToast}
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-medium text-purple-600 dark:text-cyan-400">
          Step 4 of 4
        </p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Your Banner Result
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review the generated output, then download, regenerate, or refine it.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr),320px]">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div
            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950"
            style={{ aspectRatio: `${bannerWidth} / ${bannerHeight}` }}
          >
            {currentImageUrl ? (
              <img
                src={currentImageUrl}
                alt={`Generated banner preview for ${channelName || "your channel"}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Your banner preview will appear here once generation succeeds.
              </div>
            )}

            {isGenerating ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/55 backdrop-blur-sm">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-purple-600 dark:border-slate-700 dark:border-t-cyan-400" />
                  <p className="mt-4 text-sm font-medium text-white">
                    {refineBanner.isLoading
                      ? "Refining your banner..."
                      : "Generating your banner..."}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setShowRegenerateConfirm(true)}
              disabled={isGenerating || generateBanner.isLoading}
            >
              Regenerate
            </Button>
            <Button
              variant="secondary"
              onClick={() => void handleDownload()}
              disabled={!currentImageUrl || isGenerating}
            >
              Download PNG
            </Button>
            <Button
              variant="ghost"
              onClick={handleStartOver}
              disabled={isGenerating}
            >
              Start over
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Refine this banner
                </h3>
                <p className="mt-1 text-sm font-medium text-purple-600 dark:text-cyan-400">
                  Refining costs 6 credits
                </p>
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Credits used in this session: {sessionCreditsSpent}
              </p>
            </div>

            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              AI refinement may subtly change other elements of the image. For
              best results, describe one change at a time.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                value={refinementPrompt}
                onChange={(event) => {
                  if (event.target.value.length <= REFINEMENT_PROMPT_LIMIT) {
                    setRefinementPrompt(event.target.value);
                  }
                }}
                placeholder="e.g. change the background to dark blue, make the text larger, add a glowing effect"
                className="min-h-[48px] flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20"
              />
              <Button
                onClick={() => void runRefinement()}
                disabled={isRefineDisabled}
                isLoading={refineBanner.isLoading}
              >
                Refine
              </Button>
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {refinementPrompt.length}/{REFINEMENT_PROMPT_LIMIT}
              </p>
              <button
                type="button"
                onClick={handleResetToOriginal}
                disabled={
                  !originalImageUrl ||
                  !originalIconId ||
                  currentImageUrl === originalImageUrl ||
                  isGenerating
                }
                className="text-sm font-medium text-purple-600 hover:text-purple-700 disabled:cursor-not-allowed disabled:text-slate-400 dark:text-cyan-400 dark:hover:text-cyan-300 dark:disabled:text-slate-600"
              >
                Reset to original
              </button>
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Generation Summary
          </h3>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="font-medium text-slate-500 dark:text-slate-400">
                Platform
              </dt>
              <dd className="mt-1 text-slate-900 dark:text-white">
                {selectedPlatform ? PLATFORMS[selectedPlatform].displayName : "Unknown"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500 dark:text-slate-400">
                Template
              </dt>
              <dd className="mt-1 text-slate-900 dark:text-white">
                {selectedTemplate.name}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500 dark:text-slate-400">
                Logo source
              </dt>
              <dd className="mt-1 text-slate-900 dark:text-white">
                {logoSource === "upload"
                  ? "Uploaded logo"
                  : logoSource === "designs"
                    ? "Saved design"
                    : "No logo, just text"}
              </dd>
              {logoSource !== "none" && logoUrl && (
                <img
                  src={logoUrl}
                  alt="Selected logo source"
                  className="mt-3 h-16 w-16 rounded-lg object-cover"
                />
              )}
            </div>
            <div>
              <dt className="font-medium text-slate-500 dark:text-slate-400">
                Channel name
              </dt>
              <dd className="mt-1 text-slate-900 dark:text-white">
                {channelName || "Not provided"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500 dark:text-slate-400">
                Tagline
              </dt>
              <dd className="mt-1 text-slate-900 dark:text-white">
                {tagline || "No tagline"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500 dark:text-slate-400">
                Social media
              </dt>
              <dd className="mt-1 text-slate-900 dark:text-white">
                {filledSocialHandles.length > 0 ? (
                  <div className="space-y-1">
                    {filledSocialHandles.map((item) => (
                      <div key={`${item.platform}-${item.handle}`}>
                        {getBannerSocialPlatformLabel(item.platform)}: {item.handle}
                      </div>
                    ))}
                  </div>
                ) : (
                  "No social media"
                )}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500 dark:text-slate-400">
                Current version
              </dt>
              <dd className="mt-1 text-slate-900 dark:text-white">
                {refinementHistory.length > 0
                  ? `Refined ${refinementHistory.length} time${
                      refinementHistory.length === 1 ? "" : "s"
                    }`
                  : "Original generation"}
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      {showRegenerateConfirm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Regenerate this banner?
            </h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Regenerating will cost another 10 credits and create a fresh banner
              output.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowRegenerateConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowRegenerateConfirm(false);
                  hasTriggeredGenerationRef.current = false;
                  void runGeneration();
                }}
                isLoading={isGenerating || generateBanner.isLoading}
              >
                Confirm regenerate
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
