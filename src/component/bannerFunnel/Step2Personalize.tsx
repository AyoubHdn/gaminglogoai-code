import clsx from "clsx";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { type IconType } from "react-icons";
import { FaDiscord, FaInstagram, FaTwitch, FaYoutube } from "react-icons/fa";
import { FaTiktok, FaXTwitter } from "react-icons/fa6";

import { Button } from "~/component/Button";
import { FormGroup } from "~/component/FormGroup";
import { Input } from "~/component/Input";
import { useFunnel } from "~/component/bannerFunnel/FunnelContext";
import { BANNER_TEMPLATES } from "~/data/bannerTemplates";
import {
  BANNER_SOCIAL_PLATFORM_IDS,
  type BannerSocialPlatformId,
  getBannerSocialPlatformLabel,
  getFilledBannerSocialHandles,
} from "~/lib/bannerSocials";
import { getTemplateById } from "~/lib/templateBrowser";
import { S3_BASE } from "~/utils/s3Paths";
import { api, type RouterOutputs } from "~/utils/api";

type UserIcon = RouterOutputs["icons"]["getIcons"][number];

const CHANNEL_NAME_LIMIT = 30;
const TAGLINE_LIMIT = 60;
const SOCIAL_HANDLE_VALUE_LIMIT = 32;
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

const SOCIAL_PLATFORM_ICONS: Record<BannerSocialPlatformId, IconType> = {
  youtube: FaYoutube,
  twitch: FaTwitch,
  discord: FaDiscord,
  tiktok: FaTiktok,
  x: FaXTwitter,
  instagram: FaInstagram,
};

function getDesignImageUrl(icon: UserIcon): string {
  return `${S3_BASE}/${icon.imageKey ?? icon.id}`;
}

function getPromptLabel(prompt: string | null | undefined): string {
  if (!prompt) {
    return "Untitled design";
  }

  return prompt.length > 48 ? `${prompt.slice(0, 48)}...` : prompt;
}

function isLogoCandidate(icon: UserIcon): boolean {
  const prompt = icon.prompt ?? "";
  const excludedPrefixes = [
    "Banner:",
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
    logoSource,
    logoUrl,
    channelName,
    tagline,
    socialHandles,
    setCurrentStep,
    setLogoSource,
    setLogoUrl,
    setChannelName,
    setTagline,
    setSocialHandles,
    resetResultState,
  } = useFunnel();

  const selectedTemplate = useMemo(
    () => getTemplateById(BANNER_TEMPLATES, selectedTemplateId ?? ""),
    [selectedTemplateId]
  );

  const [uploadError, setUploadError] = useState("");
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  const createUploadUrl = api.s3.createUploadUrl.useMutation();
  const iconsQuery = api.icons.getIcons.useQuery(undefined, {
    enabled: isAuthenticated && logoSource === "designs",
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
    setLogoSource(source);
    resetResultState();

    if (source === "none") {
      setLogoUrl(null);
      return;
    }

    setLogoUrl(null);
  };

  const handleUploadChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setLogoUrl(null);
      setLocalPreviewUrl(null);
      return;
    }

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setUploadError("Please upload a PNG or JPG logo file.");
      setLogoUrl(null);
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      setUploadError("Logo files must be 5MB or smaller.");
      setLogoUrl(null);
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

      setLogoUrl(presigned.publicUrl);
    } catch (error) {
      console.error("Banner funnel upload failed:", error);
      setUploadError("We couldn't upload that logo. Please try again.");
      setLogoUrl(null);
    }
  };

  const handleSelectDesign = (icon: UserIcon) => {
    const nextLogoUrl = getDesignImageUrl(icon);
    setLogoUrl(nextLogoUrl);
    setUploadError("");
  };

  const isLogoSelectionReady =
    logoSource === "none" || (logoSource !== null && Boolean(logoUrl));
  const canContinue =
    channelName.trim().length > 0 &&
    isLogoSelectionReady &&
    !createUploadUrl.isLoading;

  const availableDesigns = useMemo(
    () => (iconsQuery.data ?? []).filter(isLogoCandidate),
    [iconsQuery.data]
  );
  const filledSocialHandles = useMemo(
    () => getFilledBannerSocialHandles(socialHandles),
    [socialHandles]
  );
  const availableSocialPlatforms = useMemo(
    () =>
      BANNER_SOCIAL_PLATFORM_IDS.filter(
        (platform) => !socialHandles.some((item) => item.platform === platform)
      ),
    [socialHandles]
  );

  const handleAddSocial = () => {
    const nextPlatform = availableSocialPlatforms[0];

    if (!nextPlatform) {
      return;
    }

    setSocialHandles([
      ...socialHandles,
      {
        platform: nextPlatform,
        handle: "",
      },
    ]);
    resetResultState();
  };

  const handleSocialPlatformChange = (
    index: number,
    nextPlatform: BannerSocialPlatformId
  ) => {
    setSocialHandles(
      socialHandles.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              platform: nextPlatform,
            }
          : item
      )
    );
    resetResultState();
  };

  const handleSocialHandleChange = (index: number, nextHandle: string) => {
    if (nextHandle.length > SOCIAL_HANDLE_VALUE_LIMIT) {
      return;
    }

    setSocialHandles(
      socialHandles.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              handle: nextHandle,
            }
          : item
      )
    );
    resetResultState();
  };

  const handleRemoveSocial = (index: number) => {
    setSocialHandles(socialHandles.filter((_, itemIndex) => itemIndex !== index));
    resetResultState();
  };

  if (!selectedTemplate) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900/70">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Pick a template first
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Step 2 needs a selected template before you can personalize the banner.
        </p>
        <Button
          className="mt-5"
          onClick={() => setCurrentStep("step1")}
        >
          Back to templates
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-medium text-purple-600 dark:text-cyan-400">
          Step 3 of 4
        </p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Personalize Your Banner
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Template selected: <span className="font-semibold">{selectedTemplate.name}</span>
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            A. Logo source
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Choose whether the banner should use a logo or image reference.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              value: "upload" as const,
              title: "Upload my logo",
              description: "Use a PNG or JPG logo file from your device.",
            },
            {
              value: "designs" as const,
              title: "Choose from my designs",
              description: "Pick from your previously generated GamingLogoAI designs.",
            },
            {
              value: "none" as const,
              title: "No logo, just text",
              description: "Skip logo reference and make the banner text-first.",
            },
          ].map((option) => {
            const isSelected = logoSource === option.value;

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
                    name="logo-source"
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
                          Sign in first to upload a logo into your banner workflow.
                        </p>
                        <Button onClick={() => void handleProtectedSourceSignIn()}>
                          Sign In to Upload
                        </Button>
                      </div>
                    ) : (
                      <>
                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl bg-slate-50 px-4 py-6 text-center hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {logoUrl ? "Replace logo upload" : "Upload logo (PNG or JPG)"}
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
                        {(localPreviewUrl || logoUrl) && (
                          <div className="mt-4 flex items-center gap-4 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                            <img
                              src={localPreviewUrl ?? logoUrl ?? ""}
                              alt="Uploaded logo preview"
                              className="h-20 w-20 rounded-lg object-cover"
                            />
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {createUploadUrl.isLoading
                                  ? "Uploading logo..."
                                  : "Logo ready for this banner"}
                              </p>
                              {logoUrl && (
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Saved to your upload path.
                                </p>
                              )}
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
                    ) : iconsQuery.isLoading ? (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Loading your saved designs...
                      </p>
                    ) : iconsQuery.isError ? (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        We couldn't load your saved designs right now.
                      </p>
                    ) : availableDesigns.length === 0 ? (
                      <div className="space-y-3">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          You don't have any saved designs yet.
                        </p>
                        <Button
                          variant="secondary"
                          onClick={() => void router.push("/gaming-logo-maker")}
                        >
                          Create a Logo First
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {availableDesigns.slice(0, 12).map((icon) => {
                          const designUrl = getDesignImageUrl(icon);
                          const isActive = logoUrl === designUrl;

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
                    The funnel will keep the selected template and skip logo reference.
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
            Add the text the final banner should display.
          </p>
        </div>

        <div className="grid gap-5">
          <FormGroup>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Channel name *
            </label>
            <Input
              value={channelName}
              onChange={(event) => {
                const value = event.target.value;
                if (value.length <= CHANNEL_NAME_LIMIT) {
                  setChannelName(value);
                }
              }}
              placeholder="e.g. ProGamer"
            />
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {channelName.length}/{CHANNEL_NAME_LIMIT}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tip: AI text rendering has improved significantly with our new
              model. If your channel name doesn&apos;t render perfectly on the
              first try, you can refine it on the next step.
            </p>
          </FormGroup>

          <FormGroup>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Tagline
            </label>
            <Input
              value={tagline}
              onChange={(event) => {
                const value = event.target.value;
                if (value.length <= TAGLINE_LIMIT) {
                  setTagline(value);
                }
              }}
              placeholder="e.g. Live every night 9PM UTC"
            />
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {tagline.length}/{TAGLINE_LIMIT}
            </div>
          </FormGroup>

          <FormGroup>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Social media
            </label>
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Add popular social media rows with the platform icon and your
                  channel name or handle next to it.
                </p>
                <Button
                  variant="secondary"
                  onClick={handleAddSocial}
                  disabled={availableSocialPlatforms.length === 0}
                >
                  Add
                </Button>
              </div>

              {socialHandles.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-5 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  No social media added yet. Use Add to place icon-and-handle
                  rows on the banner.
                </div>
              ) : (
                <div className="space-y-3">
                  {socialHandles.map((socialItem, index) => {
                    const SocialIcon = SOCIAL_PLATFORM_ICONS[socialItem.platform];

                    return (
                      <div
                        key={`${socialItem.platform}-${index}`}
                        className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
                      >
                        <div className="grid gap-3 sm:grid-cols-[56px,minmax(0,180px),minmax(0,1fr),auto] sm:items-start">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xl text-slate-700 dark:bg-slate-800 dark:text-slate-100">
                            <SocialIcon />
                          </div>

                          <label className="block">
                            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                              Platform
                            </span>
                            <select
                              value={socialItem.platform}
                              onChange={(event) =>
                                handleSocialPlatformChange(
                                  index,
                                  event.target.value as BannerSocialPlatformId
                                )
                              }
                              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-cyan-400 dark:focus:ring-cyan-400/20"
                            >
                              {BANNER_SOCIAL_PLATFORM_IDS.map((platform) => {
                                const isUsedElsewhere = socialHandles.some(
                                  (item, itemIndex) =>
                                    itemIndex !== index &&
                                    item.platform === platform
                                );

                                return (
                                  <option
                                    key={platform}
                                    value={platform}
                                    disabled={isUsedElsewhere}
                                  >
                                    {getBannerSocialPlatformLabel(platform)}
                                  </option>
                                );
                              })}
                            </select>
                          </label>

                          <label className="block">
                            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                              Channel / handle
                            </span>
                            <Input
                              value={socialItem.handle}
                              onChange={(event) =>
                                handleSocialHandleChange(index, event.target.value)
                              }
                              placeholder={`e.g. @${channelName.trim() || "yourname"}`}
                            />
                            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {socialItem.handle.length}/{SOCIAL_HANDLE_VALUE_LIMIT}
                            </div>
                          </label>

                          <div className="sm:pt-6">
                            <button
                              type="button"
                              onClick={() => handleRemoveSocial(index)}
                              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="text-xs text-slate-500 dark:text-slate-400">
                {filledSocialHandles.length} social item
                {filledSocialHandles.length === 1 ? "" : "s"} ready for the
                banner.
              </div>
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
