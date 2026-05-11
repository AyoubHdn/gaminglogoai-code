import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "~/component/Button";
import { useFunnel } from "~/component/thumbnailFunnel/FunnelContext";
import { THUMBNAIL_PLATFORMS } from "~/data/thumbnailPlatforms";
import { THUMBNAIL_TEMPLATES } from "~/data/thumbnailTemplates";
import { getTemplateById } from "~/lib/templateBrowser";
import { api } from "~/utils/api";

const REFINEMENT_PROMPT_LIMIT = 500;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "We couldn't finish that thumbnail request. Please try again.";
}

export function Step3Result() {
  const {
    selectedPlatform,
    selectedTemplateId,
    referenceSource,
    referenceUrl,
    title,
    subtitle,
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
  const generateThumbnail = api.thumbnailFunnel.generate.useMutation();
  const refineThumbnail = api.thumbnailFunnel.refine.useMutation();

  const selectedTemplate = useMemo(
    () => getTemplateById(THUMBNAIL_TEMPLATES, selectedTemplateId ?? ""),
    [selectedTemplateId]
  );
  const canvas = selectedPlatform ? THUMBNAIL_PLATFORMS.youtube.surface.canvas : null;
  const imageWidth = canvas?.width ?? 0;
  const imageHeight = canvas?.height ?? 0;
  const selectedTemplateKey = selectedTemplate?.id ?? "";
  const selectedPlatformKey = selectedPlatform === "youtube" ? "youtube" : null;

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
    if (!selectedPlatformKey || !selectedTemplateKey || !imageWidth || !imageHeight) {
      return;
    }

    hasTriggeredGenerationRef.current = true;
    const requestId = requestCounterRef.current + 1;
    requestCounterRef.current = requestId;

    setIsGenerating(true);
    setErrorToast("");

    try {
      const result = await generateThumbnail.mutateAsync({
        platform: selectedPlatformKey,
        templateId: selectedTemplateKey,
        referenceImageUrl: referenceSource === "none" ? null : referenceUrl,
        title: title.trim(),
        subtitle: subtitle.trim() || null,
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

      console.error("Thumbnail funnel generation failed:", error);
      setErrorToast(getErrorMessage(error));
    } finally {
      if (requestCounterRef.current === requestId) {
        setIsGenerating(false);
      }
    }
  }, [
    generateThumbnail,
    imageHeight,
    imageWidth,
    originalIconId,
    originalImageUrl,
    referenceSource,
    referenceUrl,
    selectedPlatformKey,
    selectedTemplateKey,
    sessionCreditsSpent,
    setCurrentIconId,
    setCurrentImageUrl,
    setIsGenerating,
    setOriginalIconId,
    setOriginalImageUrl,
    setRefinementHistory,
    setSessionCreditsSpent,
    subtitle,
    title,
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
      const result = await refineThumbnail.mutateAsync({
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

      console.error("Thumbnail funnel refinement failed:", error);
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
    refineThumbnail,
    selectedPlatformKey,
    sessionCreditsSpent,
    setCurrentIconId,
    setCurrentImageUrl,
    setIsGenerating,
    setRefinementHistory,
    setSessionCreditsSpent,
  ]);

  useEffect(() => {
    if (!selectedPlatformKey || !selectedTemplateKey || !imageWidth || !imageHeight) {
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
    currentImageUrl,
    imageHeight,
    imageWidth,
    isGenerating,
    runGeneration,
    selectedPlatformKey,
    selectedTemplateKey,
  ]);

  const handleDownload = async () => {
    if (!currentImageUrl || !imageWidth || !imageHeight) {
      return;
    }

    try {
      const response = await fetch(currentImageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch generated thumbnail.");
      }

      const blob = await response.blob();
      const imageBitmap = await createImageBitmap(blob);
      const canvasElement = document.createElement("canvas");
      canvasElement.width = imageWidth;
      canvasElement.height = imageHeight;

      const context = canvasElement.getContext("2d");
      if (!context) {
        throw new Error("Canvas context is not available.");
      }

      context.drawImage(imageBitmap, 0, 0, canvasElement.width, canvasElement.height);

      const pngBlob = await new Promise<Blob | null>((resolve) =>
        canvasElement.toBlob(resolve, "image/png")
      );

      if (!pngBlob) {
        throw new Error("Could not create a PNG blob.");
      }

      const blobUrl = window.URL.createObjectURL(pngBlob);
      const link = document.createElement("a");
      const safeName = (title.trim() || "thumbnail").replace(/[^a-z0-9_\-]/gi, "_");

      link.href = blobUrl;
      link.download = `${safeName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      clearPersistedState();
    } catch (error) {
      console.error("Thumbnail funnel download failed:", error);
      setErrorToast(getErrorMessage(error));
    }
  };

  if (!selectedPlatformKey || !selectedTemplate || !imageWidth || !imageHeight) {
    return null;
  }

  const isRefineDisabled =
    !currentImageUrl ||
    !currentIconId ||
    refinementPrompt.trim().length === 0 ||
    isGenerating ||
    refineThumbnail.isLoading;

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
          Your Thumbnail Result
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review the generated output, then download, regenerate, or refine it.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr),320px]">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div
            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950"
            style={{ aspectRatio: `${imageWidth} / ${imageHeight}` }}
          >
            {currentImageUrl ? (
              <img
                src={currentImageUrl}
                alt={`Generated thumbnail preview for ${title || "your title"}`}
                className="h-full w-full object-cover"
              />
            ) : null}

            {isGenerating ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/55 backdrop-blur-sm">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-purple-600 dark:border-slate-700 dark:border-t-cyan-400" />
                  <p className="mt-4 text-sm font-medium text-white">
                    {refineThumbnail.isLoading
                      ? "Refining your thumbnail..."
                      : "Generating your thumbnail..."}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setShowRegenerateConfirm(true)}
              disabled={isGenerating || generateThumbnail.isLoading}
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
              onClick={startOver}
              disabled={isGenerating}
            >
              Start over
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Refine this thumbnail
                </h3>
                <p className="mt-1 text-sm font-medium text-purple-600 dark:text-cyan-400">
                  Refining costs 6 credits
                </p>
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Credits used in this session: {sessionCreditsSpent}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                value={refinementPrompt}
                onChange={(event) => {
                  if (event.target.value.length <= REFINEMENT_PROMPT_LIMIT) {
                    setRefinementPrompt(event.target.value);
                  }
                }}
                placeholder="e.g. make the subject larger, add more glow, increase title contrast"
                className="min-h-[48px] flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20"
              />
              <Button
                onClick={() => void runRefinement()}
                disabled={isRefineDisabled}
                isLoading={refineThumbnail.isLoading}
              >
                Refine
              </Button>
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
              <dd className="mt-1 text-slate-900 dark:text-white">YouTube</dd>
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
                Reference source
              </dt>
              <dd className="mt-1 text-slate-900 dark:text-white">
                {referenceSource === "upload"
                  ? "Uploaded image"
                  : referenceSource === "designs"
                    ? "Saved design"
                    : "No reference image"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500 dark:text-slate-400">
                Title
              </dt>
              <dd className="mt-1 text-slate-900 dark:text-white">
                {title || "Not provided"}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500 dark:text-slate-400">
                Subtitle
              </dt>
              <dd className="mt-1 text-slate-900 dark:text-white">
                {subtitle || "No subtitle"}
              </dd>
            </div>
          </dl>
        </aside>
      </div>

      {showRegenerateConfirm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Regenerate this thumbnail?
            </h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Regenerating will cost another 10 credits and create a fresh thumbnail output.
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
