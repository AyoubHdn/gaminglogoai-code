import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "~/component/Button";
import { SharePopup } from "~/component/SharePopup";
import { useFunnel } from "~/component/streamScreenFunnel/FunnelContext";
import { STREAM_SCREEN_PLATFORMS } from "~/data/streamScreenPlatforms";
import { STREAM_SCREEN_TEMPLATES } from "~/data/streamScreenTemplates";
import { api } from "~/utils/api";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "We couldn't finish that stream screen request. Please try again.";
}

export function Step3Result() {
  const {
    selectedPlatform,
    selectedTemplateId,
    screenItems,
    generatedScreens,
    isGenerating,
    sessionCreditsSpent,
    setGeneratedScreens,
    setIsGenerating,
    setSessionCreditsSpent,
    startOver,
  } = useFunnel();
  const [errorToast, setErrorToast] = useState("");
  const [shareScreenUrl, setShareScreenUrl] = useState<string | null>(null);
  const [shareScreenLabel, setShareScreenLabel] = useState<string>("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const requestCounterRef = useRef(0);
  const hasTriggeredGenerationRef = useRef(false);
  const generateScreens = api.streamScreenFunnel.generateBatch.useMutation();

  const selectedTemplate = useMemo(
    () =>
      STREAM_SCREEN_TEMPLATES.find(
        (template) => template.id === (selectedTemplateId ?? "")
      ),
    [selectedTemplateId]
  );
  const platform = selectedPlatform ? STREAM_SCREEN_PLATFORMS[selectedPlatform] : null;
  const totalSetCredits = selectedTemplate ? screenItems.length * selectedTemplate.credits : 0;

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
    if (!selectedPlatform || !selectedTemplate || screenItems.length === 0) {
      return;
    }

    hasTriggeredGenerationRef.current = true;
    const requestId = requestCounterRef.current + 1;
    requestCounterRef.current = requestId;

    setIsGenerating(true);
    setErrorToast("");

    try {
      const result = await generateScreens.mutateAsync({
        platform: selectedPlatform,
        templateId: selectedTemplate.id,
        screens: screenItems.map((item) => ({
          draftId: item.id,
          kind: item.kind,
          title: item.title.trim(),
          subtitle: item.subtitle.trim() || null,
        })),
      });

      if (requestCounterRef.current !== requestId) {
        return;
      }

      setGeneratedScreens(result.items);
      setSessionCreditsSpent(sessionCreditsSpent + result.totalCreditsCharged);
    } catch (error) {
      if (requestCounterRef.current !== requestId) {
        return;
      }

      console.error("Stream screen funnel batch generation failed:", error);
      setErrorToast(getErrorMessage(error));
    } finally {
      if (requestCounterRef.current === requestId) {
        setIsGenerating(false);
      }
    }
  }, [
    generateScreens,
    screenItems,
    selectedPlatform,
    selectedTemplate,
    sessionCreditsSpent,
    setGeneratedScreens,
    setIsGenerating,
    setSessionCreditsSpent,
  ]);

  useEffect(() => {
    if (!selectedPlatform || !selectedTemplate || screenItems.length === 0) {
      return;
    }

    if (hasTriggeredGenerationRef.current) {
      return;
    }

    if (generatedScreens.length === 0 && !isGenerating) {
      hasTriggeredGenerationRef.current = true;
      void runGeneration();
    }
  }, [
    generatedScreens.length,
    isGenerating,
    runGeneration,
    screenItems.length,
    selectedPlatform,
    selectedTemplate,
  ]);

  const handleDownload = async (
    fileName: string,
    imageUrl: string,
    draftId: string
  ) => {
    try {
      setDownloadingId(draftId);

      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch generated stream screen.");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = `${fileName.replace(/[^a-z0-9_\-]/gi, "_")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Stream screen funnel download failed:", error);
      setErrorToast(getErrorMessage(error));
    } finally {
      setDownloadingId(null);
    }
  };

  if (!selectedTemplate || !platform) {
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
          Your Stream Screen Set
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Review all generated stream screens and download the ones you want.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Set Summary
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {platform.displayName} · {selectedTemplate.name} ·{" "}
              {platform.canvas.width}x{platform.canvas.height}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Credits used in this session: {sessionCreditsSpent}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {selectedTemplate.credits} credits per screen · Full set regenerate cost:{" "}
              {totalSetCredits}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            onClick={() => {
              hasTriggeredGenerationRef.current = false;
              setGeneratedScreens([]);
              void runGeneration();
            }}
            disabled={isGenerating || generateScreens.isPending}
          >
            Regenerate Full Set
          </Button>
          <Button variant="ghost" onClick={startOver} disabled={isGenerating}>
            Start over
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {screenItems.map((draft) => {
          const generated = generatedScreens.find((item) => item.draftId === draft.id);
          const preset = platform.screenPresets.find((item) => item.id === draft.kind);

          return (
            <section
              key={draft.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {preset?.label ?? draft.kind}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {draft.title}
                  </p>
                </div>
              </div>

              <div
                className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950"
                style={{
                  aspectRatio: `${platform.canvas.width} / ${platform.canvas.height}`,
                }}
              >
                {generated?.url ? (
                  <img
                    src={generated.url}
                    alt={`Generated ${preset?.label ?? draft.kind} preview`}
                    className="h-full w-full object-cover"
                  />
                ) : null}

                {isGenerating && !generated?.url ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/55 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-purple-600 dark:border-slate-700 dark:border-t-cyan-400" />
                      <p className="mt-4 text-sm font-medium text-white">
                        Generating this screen...
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-4 space-y-3">
                <p className="whitespace-pre-line text-sm text-slate-600 dark:text-slate-300">
                  {draft.subtitle.trim() || "No subtitle"}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      generated?.url
                        ? void handleDownload(
                            draft.title || preset?.label || "stream-screen",
                            generated.url,
                            draft.id
                          )
                        : undefined
                    }
                    disabled={!generated?.url || isGenerating || downloadingId === draft.id}
                  >
                    Download PNG
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      generated?.url ? window.open(generated.url, "_blank") : undefined
                    }
                    disabled={!generated?.url || isGenerating}
                  >
                    Open Full Size
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShareScreenUrl(generated?.url ?? null);
                      setShareScreenLabel(preset?.label ?? draft.kind);
                    }}
                    disabled={!generated?.url || isGenerating}
                  >
                    Share
                  </Button>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {shareScreenUrl ? (
        <SharePopup
          imageUrl={shareScreenUrl}
          imageAlt={`${shareScreenLabel} stream screen`}
          defaultText={`I created this ${shareScreenLabel} screen with GamingLogoAI!`}
          siteUrl="https://gaminglogoai.com"
          generatorUrl="/twitch-stream-screens-generator"
          onClose={() => {
            setShareScreenUrl(null);
            setShareScreenLabel("");
          }}
        />
      ) : null}
    </section>
  );
}
