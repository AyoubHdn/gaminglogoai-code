import clsx from "clsx";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "~/component/Button";
import { FormGroup } from "~/component/FormGroup";
import { Input } from "~/component/Input";
import { useFunnel } from "~/component/bannerFunnel/FunnelContext";
import { BANNER_TEMPLATES } from "~/data/bannerTemplates";
import { getTemplateById } from "~/lib/templateBrowser";
import { S3_BASE } from "~/utils/s3Paths";
import { api } from "~/utils/api";
const CHANNEL_NAME_LIMIT = 30;
const TAGLINE_LIMIT = 60;
const SOCIAL_HANDLES_LIMIT = 80;
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
function getDesignImageUrl(icon) {
    var _a;
    return `${S3_BASE}/${(_a = icon.imageKey) !== null && _a !== void 0 ? _a : icon.id}`;
}
function getPromptLabel(prompt) {
    if (!prompt) {
        return "Untitled design";
    }
    return prompt.length > 48 ? `${prompt.slice(0, 48)}...` : prompt;
}
function isLogoCandidate(icon) {
    var _a;
    const prompt = (_a = icon.prompt) !== null && _a !== void 0 ? _a : "";
    const excludedPrefixes = [
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
    const { selectedTemplateId, logoSource, logoUrl, channelName, tagline, socialHandles, setCurrentStep, setLogoSource, setLogoUrl, setChannelName, setTagline, setSocialHandles, resetResultState, } = useFunnel();
    const selectedTemplate = useMemo(() => getTemplateById(BANNER_TEMPLATES, selectedTemplateId !== null && selectedTemplateId !== void 0 ? selectedTemplateId : ""), [selectedTemplateId]);
    const [uploadError, setUploadError] = useState("");
    const [localPreviewUrl, setLocalPreviewUrl] = useState(null);
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
    const handleSourceChange = (source) => {
        setUploadError("");
        setLogoSource(source);
        resetResultState();
        if (source === "none") {
            setLogoUrl(null);
            return;
        }
        setLogoUrl(null);
    };
    const handleUploadChange = async (event) => {
        var _a, _b;
        const file = (_b = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null;
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
        }
        catch (error) {
            console.error("Banner funnel upload failed:", error);
            setUploadError("We couldn't upload that logo. Please try again.");
            setLogoUrl(null);
        }
    };
    const handleSelectDesign = (icon) => {
        const nextLogoUrl = getDesignImageUrl(icon);
        setLogoUrl(nextLogoUrl);
        setUploadError("");
    };
    const isLogoSelectionReady = logoSource === "none" || (logoSource !== null && Boolean(logoUrl));
    const canContinue = channelName.trim().length > 0 &&
        isLogoSelectionReady &&
        !createUploadUrl.isLoading;
    const availableDesigns = useMemo(() => { var _a; return ((_a = iconsQuery.data) !== null && _a !== void 0 ? _a : []).filter(isLogoCandidate); }, [iconsQuery.data]);
    if (!selectedTemplate) {
        return (<section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900/70">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Pick a template first
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Step 2 needs a selected template before you can personalize the banner.
        </p>
        <Button className="mt-5" onClick={() => setCurrentStep("step1")}>
          Back to templates
        </Button>
      </section>);
    }
    return (<section className="space-y-6">
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
            Choose how the banner should handle your logo area.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
                value: "upload",
                title: "Upload my logo",
                description: "Use a PNG or JPG logo file from your device.",
            },
            {
                value: "designs",
                title: "Choose from my designs",
                description: "Pick from your previously generated GamingLogoAI designs.",
            },
            {
                value: "none",
                title: "No logo, just text",
                description: "Skip the logo area and make the banner text-first.",
            },
        ].map((option) => {
            var _a;
            const isSelected = logoSource === option.value;
            return (<label key={option.value} className={clsx("block cursor-pointer rounded-2xl border p-4 transition-colors", isSelected
                    ? "border-purple-500 bg-purple-50/60 dark:border-cyan-400 dark:bg-cyan-500/10"
                    : "border-slate-200 hover:border-purple-300 dark:border-slate-800 dark:hover:border-cyan-400")}>
                <div className="flex items-start gap-3">
                  <input type="radio" name="logo-source" checked={isSelected} onChange={() => handleSourceChange(option.value)} className="mt-1 h-4 w-4"/>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {option.title}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {option.description}
                    </p>
                  </div>
                </div>

                {option.value === "upload" && isSelected && (<div className="mt-4 rounded-xl border border-dashed border-slate-300 p-4 dark:border-slate-700">
                    {!isAuthenticated ? (<div className="space-y-3">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Sign in first to upload a logo into your Twitch banner funnel.
                        </p>
                        <Button onClick={() => void handleProtectedSourceSignIn()}>
                          Sign In to Upload
                        </Button>
                      </div>) : (<>
                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl bg-slate-50 px-4 py-6 text-center hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {logoUrl ? "Replace logo upload" : "Upload logo (PNG or JPG)"}
                          </span>
                          <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Max 5MB
                          </span>
                          <input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(event) => {
                            void handleUploadChange(event);
                        }}/>
                        </label>
                        {uploadError && (<p className="mt-3 text-sm text-red-600 dark:text-red-400">
                            {uploadError}
                          </p>)}
                        {(localPreviewUrl || logoUrl) && (<div className="mt-4 flex items-center gap-4 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                            <img src={(_a = localPreviewUrl !== null && localPreviewUrl !== void 0 ? localPreviewUrl : logoUrl) !== null && _a !== void 0 ? _a : ""} alt="Uploaded logo preview" className="h-20 w-20 rounded-lg object-cover"/>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {createUploadUrl.isLoading
                                ? "Uploading logo..."
                                : "Logo ready for this banner"}
                              </p>
                              {logoUrl && (<p className="text-xs text-slate-500 dark:text-slate-400">
                                  Saved to your Twitch upload path.
                                </p>)}
                            </div>
                          </div>)}
                      </>)}
                  </div>)}

                {option.value === "designs" && isSelected && (<div className="mt-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                    {!isAuthenticated ? (<div className="space-y-3">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Sign in to browse your saved GamingLogoAI designs.
                        </p>
                        <Button onClick={() => void handleProtectedSourceSignIn()}>
                          Sign In to Browse Designs
                        </Button>
                      </div>) : iconsQuery.isLoading ? (<p className="text-sm text-slate-500 dark:text-slate-400">
                        Loading your saved designs...
                      </p>) : iconsQuery.isError ? (<p className="text-sm text-red-600 dark:text-red-400">
                        We couldn't load your saved designs right now.
                      </p>) : availableDesigns.length === 0 ? (<div className="space-y-3">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          You don't have any saved designs yet.
                        </p>
                        <Button variant="secondary" onClick={() => void router.push("/gaming-logo-maker")}>
                          Create a Logo First
                        </Button>
                      </div>) : (<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {availableDesigns.slice(0, 12).map((icon) => {
                            var _a;
                            const designUrl = getDesignImageUrl(icon);
                            const isActive = logoUrl === designUrl;
                            return (<button key={icon.id} type="button" onClick={() => handleSelectDesign(icon)} className={clsx("overflow-hidden rounded-xl border bg-slate-50 text-left transition-colors dark:bg-slate-950", isActive
                                    ? "border-purple-500 ring-2 ring-purple-500/20 dark:border-cyan-400 dark:ring-cyan-400/20"
                                    : "border-slate-200 hover:border-purple-300 dark:border-slate-800 dark:hover:border-cyan-400")}>
                              <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                                <img src={designUrl} alt={(_a = icon.prompt) !== null && _a !== void 0 ? _a : "Saved design preview"} className="h-full w-full object-cover" loading="lazy"/>
                              </div>
                              <div className="p-2">
                                <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                                  {getPromptLabel(icon.prompt)}
                                </p>
                              </div>
                            </button>);
                        })}
                      </div>)}
                  </div>)}

                {option.value === "none" && isSelected && (<div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300">
                    The funnel will keep the selected template and skip logo placement.
                  </div>)}
              </label>);
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
            <Input value={channelName} onChange={(event) => {
            const value = event.target.value;
            if (value.length <= CHANNEL_NAME_LIMIT) {
                setChannelName(value);
            }
        }} placeholder="e.g. ProGamer"/>
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
            <Input value={tagline} onChange={(event) => {
            const value = event.target.value;
            if (value.length <= TAGLINE_LIMIT) {
                setTagline(value);
            }
        }} placeholder="e.g. Live every night 9PM UTC"/>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {tagline.length}/{TAGLINE_LIMIT}
            </div>
          </FormGroup>

          <FormGroup>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
              Social handles
            </label>
            <Input value={socialHandles} onChange={(event) => {
            const value = event.target.value;
            if (value.length <= SOCIAL_HANDLES_LIMIT) {
                setSocialHandles(value);
            }
        }} placeholder="e.g. @prostreamer • youtube.com/@prostreamer"/>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {socialHandles.length}/{SOCIAL_HANDLES_LIMIT}
            </div>
          </FormGroup>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="secondary" onClick={() => setCurrentStep("step1")}>
          Back
        </Button>
        <Button onClick={() => {
            if (!canContinue) {
                return;
            }
            resetResultState();
            setCurrentStep("step3");
        }} disabled={!canContinue} isLoading={createUploadUrl.isLoading}>
          Continue
        </Button>
      </div>
    </section>);
}
