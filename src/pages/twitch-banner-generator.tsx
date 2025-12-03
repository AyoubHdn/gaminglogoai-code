/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/pages/twitch-banner-generator.tsx
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "~/component/Button";
import { FormGroup } from "~/component/FormGroup";
import { Input } from "~/component/Input";
import { api } from "~/utils/api";
import { useSession, signIn } from "next-auth/react";
import { TWITCH_BANNER_STYLES, type TwitchBannerStyle } from "~/data/twitchBannerStyles";
import { FiUploadCloud } from "react-icons/fi";
import clsx from "clsx";
import { SharePopup } from "~/component/SharePopup";
import Link from "next/link";
import { useRouter } from "next/router";

const TwitchBannerGeneratorPage: NextPage = () => {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const router = useRouter();

  // Form state
  const [selectedStyleId, setSelectedStyleId] = useState<string>(TWITCH_BANNER_STYLES[0]?.id ?? "");
  const [channelName, setChannelName] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // UI state
  const [error, setError] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedBannerUrl, setGeneratedBannerUrl] = useState<string | null>(null);
  const [showSharePopupFor, setShowSharePopupFor] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [supportsPhoto, setSupportsPhoto] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("With Logo");

  const filteredStyles = TWITCH_BANNER_STYLES.filter(style =>
    selectedCategory === "With Logo"
      ? style.supportsPhoto === true
      : style.supportsPhoto === false
  );

  const selectedStyle = TWITCH_BANNER_STYLES.find(s => s.id === selectedStyleId);

  // TRPC mutations
  const createPresignedUrl = api.s3.createUploadUrl.useMutation();
  const generateBanner = api.twitchBanner.generate.useMutation({
    onSuccess(data) {
      setGeneratedBannerUrl(data?.[0]?.imageUrl ?? null);
      setIsGenerating(false);
      setError("");
      // scroll to result
      setTimeout(() => document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    },
    onError(err) {
      setError(err?.message ?? "Failed to generate banner.");
      setIsGenerating(false);
    }
  });

  useEffect(() => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      setPreviewUrl(url);
      return () => { URL.revokeObjectURL(url); };
    } else {
      setPreviewUrl(null);
    }
  }, [uploadedFile]);

  useEffect(() => {
    // When switching category, auto-select the first style of that category
    const first = filteredStyles[0];
    if (first) {
      setSelectedStyleId(first.id);

      // Clear uploaded photo if new category does not support photos
      if (!first.supportsPhoto) {
        setUploadedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  }, [selectedCategory]);

  useEffect(() => {
    const style = TWITCH_BANNER_STYLES.find(s => s.id === selectedStyleId);
    const canUpload = style?.supportsPhoto === true;
    setSupportsPhoto(canUpload);

    // If the new style does NOT support photo → clear previous upload
    if (!canUpload) {
      setUploadedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [selectedStyleId]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) { setUploadedFile(null); return; }
    if (!["image/jpeg","image/png","image/webp"].includes(f.type)) {
      setError("Invalid file type. Use PNG, JPG or WebP.");
      setUploadedFile(null);
      return;
    }
    setUploadedFile(f);
    setError("");
  };

  const handleGenerate = async () => {
    setError("");
    if (!isLoggedIn) { void signIn(); return; }
    if (!channelName.trim()) { setError("Channel name is required."); return; }
    if (!selectedStyle) { setError("Please select a style."); return; }

    setIsGenerating(true);
    setGeneratedBannerUrl(null);

    let uploadedImagePublicUrl = "";

    if (uploadedFile) {
      try {
        const presigned = await createPresignedUrl.mutateAsync({ filename: uploadedFile.name, filetype: uploadedFile.type });
        const formData = new FormData();
        Object.entries(presigned.fields).forEach(([k, v]) => formData.append(k, v as any));
        formData.append("file", uploadedFile);
        const uploadRes = await fetch(presigned.url, { method: "POST", body: formData });
        if (!uploadRes.ok) throw new Error("Upload failed.");
        uploadedImagePublicUrl = presigned.publicUrl;
      } catch (e) {
        console.error("Upload error:", e);
        setError("Failed to upload image. Try again.");
        setIsGenerating(false);
        return;
      }
    }

    // Call backend generation
    generateBanner.mutate({
      styleId: selectedStyleId,
      channelName: channelName.trim(),
      tagline: tagline.trim(),
      logoUrl: uploadedImagePublicUrl || "",
    });
  };

  const handleDownload = async (url: string) => {
    setIsDownloading(url);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch image");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      const safeName = (channelName.trim() || "twitch_banner").replace(/[^a-z0-9_\-]/gi, "_");
      a.download = `${safeName}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Download error:", e);
      setError("Could not download image.");
    } finally {
      setIsDownloading(null);
    }
  };

  const openShare = (url?: string) => {
    if (!url && generatedBannerUrl) setShowSharePopupFor(generatedBannerUrl);
    else if (url) setShowSharePopupFor(url);
  };

  return (
    <>
      <Head>
        <title>AI Twitch Banner Generator – Streamer Graphics Maker | GamingLogoAI</title>
        <meta name="description" content="Create a professional Twitch banner instantly. Pick a style, add your channel name, upload a photo and generate a polished banner for your channel." />
        <link rel="canonical" href="https://gaminglogoai.com/twitch-banner-generator" />
      </Head>

      <main className="container mx-auto max-w-screen-lg mb-24 flex flex-col px-4 sm:px-8 py-8">
        {/* HERO */}
        <header className="text-center mb-8">
          <Image src="/twitch-banner-header.webp" alt="Twitch Banner Generator Hero" width={1000} height={220} className="mx-auto rounded-lg shadow-lg" unoptimized />
          <h1 className="text-4xl sm:text-5xl font-extrabold mt-6">AI Twitch Banner Generator</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-3xl mx-auto">
            Create a stunning Twitch channel banner in seconds. Choose a style, type your channel name, optionally upload a photo, and generate your banner.
          </p>
        </header>

        {/* Quick steps */}
        <div className="mb-8 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-purple-500/10 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div><strong className="text-purple-700 dark:text-cyan-300">1.</strong> Select a banner template</div>
            <div><strong className="text-purple-700 dark:text-cyan-300">2.</strong> Add channel name & optional photo</div>
            <div><strong className="text-purple-700 dark:text-cyan-300">3.</strong> Generate & download</div>
          </div>
        </div>

        <form className="flex flex-col gap-8" onSubmit={(e) => { e.preventDefault(); void handleGenerate(); }}>

          {/* TEMPLATE SELECTOR */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Choose a Template</h2>

            {/* CATEGORY BUTTONS */}
            <div className="flex gap-3 mb-6">
              {["With Logo", "Without Logo"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={clsx(
                    "px-4 py-2 rounded-lg border text-sm font-medium transition",
                    selectedCategory === cat
                      ? "bg-purple-600 border-purple-600 text-white"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* TEMPLATE GRID — filteredStyles decides what to show */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredStyles.length === 0 && (
                <div className="text-slate-500 col-span-full">
                  No templates available in this category.
                </div>
              )}

              {filteredStyles.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSelectedStyleId(s.id);

                    if (!s.supportsPhoto) {
                      setUploadedFile(null);
                      setPreviewUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }
                  }}

                  className={clsx(
                    "flex flex-col rounded-lg overflow-hidden border-2 transition-transform hover:scale-105 focus:outline-none",
                    selectedStyleId === s.id
                      ? "border-purple-500 shadow-xl"
                      : "border-transparent"
                  )}
                >
                  <div className="relative w-full aspect-[5/2] bg-gray-100">
                    <Image
                      src={s.previewSrc}
                      alt={s.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="block"
                      unoptimized
                    />
                  </div>
                  <div className="p-2 text-center bg-white dark:bg-slate-800">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                      {s.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* inputs */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Customize</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormGroup>
                  <label className="block mb-2 font-medium">Channel Name *</label>
                  <Input value={channelName} onChange={(e) => setChannelName(e.target.value)} placeholder="e.g., ProGamer" required />
                </FormGroup>

                <FormGroup className="mt-4">
                  <label className="block mb-2 font-medium">Tagline (optional)</label>
                  <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="e.g., Live every night 9PM UTC" />
                </FormGroup>
              </div>

              <div>
                {supportsPhoto && (
                <FormGroup>
                  <label className="block mb-2 font-medium">Upload Photo (optional)</label>

                  <label className="mt-1 flex flex-col justify-center items-center h-44 px-4 py-6
                    border-2 border-dashed rounded-lg cursor-pointer text-center
                    hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <div className="text-center">
                      <FiUploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {uploadedFile ? "Change photo" : "Upload a photo (PNG, JPG, WEBP)"}
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="sr-only"
                        onChange={handleFileChange}
                      />

                      <div className="text-xs text-gray-400 mt-1">Max 10MB</div>
                    </div>
                  </label>

                  {previewUrl && (
                    <div className="mt-3 flex items-center gap-3">
                      <Image src={previewUrl} alt="preview" width={120} height={120}
                        className="rounded-md object-cover border" unoptimized />
                      <div>
                        <div className="text-sm">{uploadedFile?.name}</div>
                        <button
                          type="button"
                          className="text-xs mt-2 underline text-slate-600"
                          onClick={() => {
                            setUploadedFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </FormGroup>
              )}
              </div>
            </div>
          </section>

          {error && (
            <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700">
              <div className="flex items-start gap-3">
                <div className="flex-1">{error}</div>
                {error === "You do not have enough credits" && (
                  <Link href="/buy-credits" className="underline font-semibold">Buy Credits</Link>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 items-center">
            <Button isLoading={isGenerating} className="px-6 py-3" onClick={() => void handleGenerate()}>
              {isGenerating ? "Generating banner..." : `Generate Banner`}
            </Button>
            <div className="text-sm text-gray-500">Tip: try different templates to find the best layout for your name.</div>
          </div>
        </form>

        {/* Result */}
        {generatedBannerUrl && (
          <section id="result-section" className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Your Banner</h2>
            <div className="rounded-lg border overflow-hidden shadow-lg">
              <Image src={generatedBannerUrl} alt="Generated Twitch banner" width={1200} height={480} className="w-full h-auto" unoptimized />
              <div className="p-4 flex gap-3 items-center">
                <Button onClick={() => void handleDownload(generatedBannerUrl)} className="px-4 py-2" disabled={!!isDownloading}>
                  {isDownloading ? "Downloading..." : "Download PNG"}
                </Button>
                <Button onClick={() => openShare(generatedBannerUrl)} className="px-4 py-2">
                  Share
                </Button>
                <a href={generatedBannerUrl} target="_blank" rel="noreferrer" className="ml-auto text-sm text-slate-600 underline">Open in new tab</a>
              </div>
            </div>
          </section>
        )}

        {/* Share popup */}
        {showSharePopupFor && router.isReady && (
          <SharePopup
            imageUrl={showSharePopupFor}
            imageAlt={`Twitch banner for ${channelName || "your channel"}`}
            defaultText={`Check out this banner I made for ${channelName || "my channel"} with GamingLogoAI!`}
            siteUrl="https://gaminglogoai.com"
            generatorUrl="/twitch-banner-generator"
            onClose={() => setShowSharePopupFor(null)}
          />
        )}
      </main>
    </>
  );
};

export default TwitchBannerGeneratorPage;
