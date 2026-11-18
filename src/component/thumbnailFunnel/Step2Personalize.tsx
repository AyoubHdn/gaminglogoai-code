import clsx from "clsx";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";

import { Button } from "~/component/Button";
import { FormGroup } from "~/component/FormGroup";
import { Input } from "~/component/Input";
import { useFunnel } from "~/component/thumbnailFunnel/FunnelContext";
import { THUMBNAIL_TEMPLATES } from "~/data/thumbnailTemplates";
import { getTemplateById } from "~/lib/templateBrowser";
import { S3_BASE } from "~/utils/s3Paths";
import { api, type RouterOutputs } from "~/utils/api";

type UserIcon = RouterOutputs["icons"]["getIcons"][number];

const TITLE_LIMIT = 70;
const SUBTITLE_LIMIT = 50;
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

function getDesignImageUrl(icon: UserIcon): string {
  return `${S3_BASE}/${icon.imageKey ?? icon.id}`;
}

function getPromptLabel(prompt: string | null | undefined): string {
  if (!prompt) {
    return "Untitled design";
  }

  return prompt.length > 48 ? `${prompt.slice(0, 48)}...` : prompt;
}

function isReferenceCandidate(icon: UserIcon): boolean {
  const prompt = icon.prompt ?? "";
  const excludedPrefixes = [
    "Banner:",
    "Thumbnail:",
    "TwitchBanner:",
    "TwitchPanel:",
    "StreamScreen:",
    "AI Enhance:",
    "Emote:",
    "EmoteBase:",
    "NanoFace:",
  ];

  return !excludedPrefixes.some((prefix) => prompt.startsWith(prefix));
}

export function Step2Personalize() {
  const router = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const {
    selectedTemplateId,
    referenceSource,
    referenceUrl,
    title,
    subtitle,
    setCurrentStep,
    setReferenceSource,
    setReferenceUrl,
    setTitle,
    setSubtitle,
    resetResultState,
  } = useFunnel();

  const selectedTemplate = useMemo(
    () => getTemplateById(THUMBNAIL_TEMPLATES, selectedTemplateId ?? ""),
    [selectedTemplateId]
  );

  const [uploadError, setUploadError] = useState("");
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  const createUploadUrl = api.s3.createUploadUrl.useMutation();
  const iconsQuery = api.icons.getIcons.useQuery(undefined, {
    enabled: isAuthenticated && referenceSource === "designs",
  });

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const handleProtectedSourceSignIn = async () => {
    await signIn(undefined, {
      callbackUrl: router.asPath,
    });
  };

  const handleSourceChange = (source: "upload" | "designs" | "none") => {
    setUploadError("");
    setReferenceSource(source);
    resetResultState();

    if (source === "none") {
      setReferenceUrl(null);
      return;
    }

    setReferenceUrl(null);
  };

  const handleUploadChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setReferenceUrl(null);
      setLocalPreviewUrl(null);
      return;
    }

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setUploadError("Please upload a PNG or JPG reference file.");
      setReferenceUrl(null);
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      setUploadError("Reference files must be 5MB or smaller.");
      setReferenceUrl(null);
      return;
    }

    setUploadError("");

    const previewUrl = URL.createObjectURL(file);
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    setLocalPreviewUrl(previewUrl);

    try {
      const presigned = await createUploadUrl.mutateAsync({
        filename: file.name,
        filetype: file.type,
      });

      const formData = new FormData();
      Object.entries(presigned.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("file", file);

      const uploadResponse = await fetch(presigned.url, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload request failed.");
      }

      setReferenceUrl(presigned.publicUrl);
    } catch (error) {
      console.error("Thumbnail funnel upload failed:", error);
      setUploadError("We couldn't upload that reference image. Please try again.");
      setReferenceUrl(null);
    }
  };

  const handleSelectDesign = (icon: UserIcon) => {
    setReferenceUrl(getDesignImageUrl(icon));
    setUploadError("");
  };

  const isReferenceReady =
    referenceSource === "none" ||
    (referenceSource !== null && Boolean(referenceUrl));
  const canContinue =
    title.trim().length > 0 && isReferenceReady && !createUploadUrl.isLoading;

  const availableDesigns = useMemo(
    () => (iconsQuery.data ?? []).filter(isReferenceCandidate),
    [iconsQuery.data]
  );

  if (!selectedTemplate) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-medium text-purple-600 dark:text-cyan-400">
          Step 3 of 4
        </p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Personalize Your Thumbnail
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Template selected: <span className="font-semibold">{selectedTemplate.name}</span>
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            A. Reference image
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Choose whether the thumbnail should use an uploaded image or design reference.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              value: "upload" as const,
              title: "Upload my image",
              description: "Use a PNG or JPG photo or artwork as a style reference.",
            },
            {
              value: "designs" as const,
              title: "Choose from my designs",
              description: "Pick from your saved GamingLogoAI images.",
            },
            {
              value: "none" as const,
              title: "No reference image",
              description: "Generate the thumbnail from template and text only.",
            },
          ].map((option) => {
            const isSelected = referenceSource === option.value;

            return (
              <label
                key={option.value}
                className={clsx(
                  "block cursor-pointer rounded-2xl border p-4 transition-colors",
                  isSelected
                    ? "border-purple-500 bg-purple-50/60 dark:border-cyan-400 dark:bg-cyan-500/10"
                    : "border-slate-200 hover:border-purple-300 dark:border-slate-800 dark:hover:border-cyan-400"
                )}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="reference-source"
                    checked={isSelected}
                    onChange={() => handleSourceChange(option.value)}
                    className="mt-1 h-4 w-4"
                  />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {option.title}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {option.description}
                    </p>
                  </div>
                </div>

                {option.value === "upload" && isSelected && (
                  <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 dark:border-slate-700">
                    {!isAuthenticated ? (
                      <div className="space-y-3">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Sign in first to upload a reference image into your thumbnail workflow.
                        </p>
                        <Button onClick={() => void handleProtectedSourceSignIn()}>
                          Sign In to Upload
                        </Button>
                      </div>
                    ) : (
                      <>
                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl bg-slate-50 px-4 py-6 text-center hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {referenceUrl ? "Replace image upload" : "Upload image (PNG or JPG)"}
                          </span>
                          <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Max 5MB
                          </span>
                          <input
                            type="file"
                            accept="image/png,image/jpeg"
                            className="sr-only"
                            onChange={(event) => {
                              void handleUploadChange(event);
                            }}
                          />
                        </label>
                        {uploadError && (
                          <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                            {uploadError}
                          </p>
                        )}
                        {(localPreviewUrl || referenceUrl) && (
                          <div className="mt-4 flex items-center gap-4 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                            <img
                              src={localPreviewUrl ?? referenceUrl ?? ""}
                              alt="Uploaded thumbnail reference preview"
                              className="h-20 w-20 rounded-lg object-cover"
                            />
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {createUploadUrl.isLoading
                                  ? "Uploading image..."
                                  : "Reference ready for this thumbnail"}
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {option.value === "designs" && isSelected && (
                  <div className="mt-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                    {!isAuthenticated ? (
                      <div className="space-y-3">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Sign in to browse your saved GamingLogoAI designs.
                        </p>
                        <Button onClick={() => void handleProtectedSourceSignIn()}>
                          Sign In to Browse Designs
                        </Button>
                      </div>
                    ) : availableDesigns.length === 0 ? (
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        You don't have any saved designs yet.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {availableDesigns.slice(0, 12).map((icon) => {
                          const designUrl = getDesignImageUrl(icon);
                          const isActive = referenceUrl === designUrl;

                          return (
                            <button
                              key={icon.id}
                              type="button"
                              onClick={() => handleSelectDesign(icon)}
                              className={clsx(
                                "overflow-hidden rounded-xl border bg-slate-50 text-left transition-colors dark:bg-slate-950",
                                isActive
                                  ? "border-purple-500 ring-2 ring-purple-500/20 dark:border-cyan-400 dark:ring-cyan-400/20"
                                  : "border-slate-200 hover:border-purple-300 dark:border-slate-800 dark:hover:border-cyan-400"
                              )}
                            >
                              <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                                <img
                                  src={designUrl}
                                  alt={icon.prompt ?? "Saved design preview"}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                              <div className="p-2">
                                <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                                  {getPromptLabel(icon.prompt)}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {option.value === "none" && isSelected && (
                  <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">
                    The funnel will keep the selected template and skip image reference.
                  </div>
                )}
              </label>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            B. Text content
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Add the text the thumbnail should display.
          </p>
        </div>

        <div className="grid gap-5">
          <FormGroup>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Title *
            </label>
            <Input
              value={title}
              onChange={(event) => {
                if (event.target.value.length <= TITLE_LIMIT) {
                  setTitle(event.target.value);
                }
              }}
              placeholder="e.g. I Tried the Hardest Loadout"
            />
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {title.length}/{TITLE_LIMIT}
            </div>
          </FormGroup>

          <FormGroup>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Subtitle
            </label>
            <Input
              value={subtitle}
              onChange={(event) => {
                if (event.target.value.length <= SUBTITLE_LIMIT) {
                  setSubtitle(event.target.value);
                }
              }}
              placeholder="e.g. Best sniper setup in Season 4"
            />
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {subtitle.length}/{SUBTITLE_LIMIT}
            </div>
          </FormGroup>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="secondary"
          onClick={() => setCurrentStep("step1")}
        >
          Back
        </Button>
        <Button
          onClick={() => {
            if (!canContinue) {
              return;
            }

            resetResultState();
            setCurrentStep("step3");
          }}
          disabled={!canContinue}
          isLoading={createUploadUrl.isLoading}
        >
          Continue
        </Button>
      </div>
    </section>
  );
}
