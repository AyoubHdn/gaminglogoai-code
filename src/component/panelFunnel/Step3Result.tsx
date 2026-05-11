import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "~/component/Button";
import { useFunnel } from "~/component/panelFunnel/FunnelContext";
import { PANEL_PLATFORMS } from "~/data/panelPlatforms";
import { PANEL_TEMPLATES } from "~/data/panelTemplates";
import { getPanelBatchCredits } from "~/lib/panelPricing";
import { api } from "~/utils/api";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "We couldn't finish that panel request. Please try again.";
}

export function Step3Result() {
  const {
    selectedPlatform,
    selectedTemplateId,
    shapeId,
    panelItems,
    generatedPanels,
    isGenerating,
    sessionCreditsSpent,
    setGeneratedPanels,
    setIsGenerating,
    setSessionCreditsSpent,
    startOver,
  } = useFunnel();
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  const [errorToast, setErrorToast] = useState("");
  const requestCounterRef = useRef(0);
  const hasTriggeredGenerationRef = useRef(false);
  const generatePanels = api.panelFunnel.generateBatch.useMutation();

  const selectedTemplate = useMemo(
    () => PANEL_TEMPLATES.find((template) => template.id === (selectedTemplateId ?? "")),
    [selectedTemplateId]
  );
  const platform = selectedPlatform ? PANEL_PLATFORMS[selectedPlatform] : null;
  const shape = platform ? platform.shapes[shapeId] : null;
  const readyPanelItems = useMemo(
    () => panelItems.filter((item) => item.title.trim().length > 0),
    [panelItems]
  );
  const regenerateCredits = useMemo(
    () => getPanelBatchCredits(readyPanelItems.length),
    [readyPanelItems.length]
  );

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
    if (!selectedPlatform || !selectedTemplate || !shape || readyPanelItems.length === 0) {
      return;
    }

    hasTriggeredGenerationRef.current = true;
    const requestId = requestCounterRef.current + 1;
    requestCounterRef.current = requestId;

    setIsGenerating(true);
    setErrorToast("");

    try {
      const result = await generatePanels.mutateAsync({
        platform: selectedPlatform,
        templateId: selectedTemplate.id,
        shapeId: shape.id,
        panels: readyPanelItems.map((item) => ({
          draftId: item.id,
          title: item.title.trim(),
          includeIcon: item.includeIcon,
          content: item.content.trim() || null,
        })),
      });

      if (requestCounterRef.current !== requestId) {
        return;
      }

      setGeneratedPanels(result.items);
      setSessionCreditsSpent(sessionCreditsSpent + result.totalCreditsCharged);
    } catch (error) {
      if (requestCounterRef.current !== requestId) {
        return;
      }

      console.error("Panel funnel batch generation failed:", error);
      setErrorToast(getErrorMessage(error));
    } finally {
      if (requestCounterRef.current === requestId) {
        setIsGenerating(false);
      }
    }
  }, [
    generatePanels,
    readyPanelItems,
    selectedPlatform,
    selectedTemplate,
    sessionCreditsSpent,
    setGeneratedPanels,
    setIsGenerating,
    setSessionCreditsSpent,
    shape,
  ]);

  useEffect(() => {
    if (!selectedPlatform || !selectedTemplate || !shape || readyPanelItems.length === 0) {
      return;
    }

    if (hasTriggeredGenerationRef.current) {
      return;
    }

    if (generatedPanels.length === 0 && !isGenerating) {
      hasTriggeredGenerationRef.current = true;
      void runGeneration();
    }
  }, [
    generatedPanels.length,
    isGenerating,
    readyPanelItems.length,
    runGeneration,
    selectedPlatform,
    selectedTemplate,
    shape,
  ]);

  const handleDownload = async (fileName: string, imageUrl: string) => {
    if (!shape) {
      return;
    }

    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch generated panel.");
      }

      const blob = await response.blob();
      const imageBitmap = await createImageBitmap(blob);
      const canvasElement = document.createElement("canvas");
      canvasElement.width = shape.width;
      canvasElement.height = shape.height;

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

      link.href = blobUrl;
      link.download = `${fileName.replace(/[^a-z0-9_\-]/gi, "_")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Panel funnel download failed:", error);
      setErrorToast(getErrorMessage(error));
    }
  };

  if (!selectedTemplate || !platform || !shape) {
    return null;
  }

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
          Your Panel Set
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review all generated panels and download the ones you want.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Batch Summary
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {platform.displayName} · {selectedTemplate.name} · {shape.label} ({shape.aspectRatioLabel})
            </p>
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Credits used in this session: {sessionCreditsSpent}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            onClick={() => setShowRegenerateConfirm(true)}
            disabled={isGenerating || generatePanels.isLoading}
          >
            Regenerate All
          </Button>
          <Button
            variant="ghost"
            onClick={startOver}
            disabled={isGenerating}
          >
            Start over
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {readyPanelItems.map((draft) => {
          const generated = generatedPanels.find((item) => item.draftId === draft.id);

          return (
            <section
              key={draft.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {draft.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {draft.includeIcon ? "Icon included" : "Text-only panel"}
                  </p>
                </div>
              </div>

              <div
                className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950"
                style={{ aspectRatio: `${shape.width} / ${shape.height}` }}
              >
                {generated?.url ? (
                  <img
                    src={generated.url}
                    alt={`Generated panel preview for ${draft.title}`}
                    className="h-full w-full object-cover"
                  />
                ) : null}

                {isGenerating && !generated?.url ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/55 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-purple-600 dark:border-slate-700 dark:border-t-cyan-400" />
                      <p className="mt-4 text-sm font-medium text-white">
                        Generating this panel...
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-4 space-y-3">
                <p className="whitespace-pre-line text-sm text-slate-600 dark:text-slate-300">
                  {draft.content.trim() || "No extra content"}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      generated?.url
                        ? void handleDownload(draft.title || "panel", generated.url)
                        : undefined
                    }
                    disabled={!generated?.url || isGenerating}
                  >
                    Download PNG
                  </Button>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {showRegenerateConfirm ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Regenerate the full panel set?
            </h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Regenerating will cost another {regenerateCredits} credit
              {regenerateCredits === 1 ? "" : "s"} and create a fresh batch of panel outputs.
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
                  setGeneratedPanels([]);
                  void runGeneration();
                }}
              >
                Confirm regenerate
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
