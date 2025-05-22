// src/pages/gaming-logo-maker.tsx (or your equivalent path for GamingLogoAI)
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image"; // Using Next/Image where appropriate
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Button } from "~/component/Button";     // Path to your Button component
import { FormGroup } from "~/component/FormGroup"; // Path to your FormGroup component
import { api } from "~/utils/api";               // Path to your tRPC API
import { Input } from "~/component/Input";       // Path to your Input component
import { gamerStylesData } from "~/data/gamerStylesData"; // Ensure this data is tailored for gaming
import { useSession, signIn } from "next-auth/react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Link from "next/link";
import clsx from "clsx";

// Type definitions (can remain as is)
type AIModel = "flux-schnell" | "flux-dev" | "ideogram-ai/ideogram-v2-turbo";
type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3";
// Removed ColorMode, selectedBgColor, selectedTextColor, allowCustomColors, etc.
// as they weren't used in the provided code's form submission or generation logic.
// If you re-introduce color customization for logos, these states would be needed.

const GameLogoPage: NextPage = () => {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  const [form, setForm] = useState({
    name: "", // User's desired text for the logo
    basePrompt: "", // From selected style
    numberofImages: "1",
  });
  const [error, setError] = useState<string>("");
  const [imagesUrl, setImagesUrl] = useState<{ imageUrl: string }[]>([]); // Expecting full URLs from API
  const [selectedStyleImageSrc, setSelectedStyleImageSrc] = useState<string | null>(null); // For visual feedback
  const [popupImage, setPopupImage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<string>("");
  const [activeSubTab, setActiveSubTab] = useState<string>("");

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const subcategoryScrollRef = useRef<HTMLDivElement>(null);
  // ... (scrolling state hooks remain the same)
  const [showLeftCategoryArrow, setShowLeftCategoryArrow] = useState<boolean>(false);
  const [showRightCategoryArrow, setShowRightCategoryArrow] = useState<boolean>(false);
  const [showLeftSubCategoryArrow, setShowLeftSubCategoryArrow] = useState<boolean>(false);
  const [showRightSubCategoryArrow, setShowRightSubCategoryArrow] = useState<boolean>(false);


  const [selectedModel, setSelectedModel] = useState<AIModel>("flux-schnell");
  const aspectRatios: { label: string; value: AspectRatio; tailwindClass: string; description: string; }[] = [
    { label: "1:1", value: "1:1", tailwindClass: "aspect-square", description: "Profile Pics, Avatars" },
    { label: "16:9", value: "16:9", tailwindClass: "aspect-video", description: "Banners, Overlays" }, 
    { label: "9:16", value: "9:16", tailwindClass: "aspect-[9/16]", description: "Mobile, Stories" }, 
    { label: "4:3", value: "4:3", tailwindClass: "aspect-[4/3]", description: "Classic, General" }, 
  ];
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>("1:1");

  // Initialize category & subcategory (same logic)
  useEffect(() => {
    const categoryKeys = Object.keys(gamerStylesData);
    if (categoryKeys.length > 0 && categoryKeys[0]) {
      setActiveTab(categoryKeys[0]);
    }
  }, []);

  useEffect(() => {
    if (!activeTab || !gamerStylesData[activeTab]) return;
    const subKeys = Object.keys(gamerStylesData[activeTab]);
    if (subKeys.length > 0 && subKeys[0]) {
      setActiveSubTab(subKeys[0]);
      // Auto-select the first style in the new subcategory
      const firstStyle = gamerStylesData[activeTab]?.[subKeys[0]]?.[0];
      if (firstStyle) {
        handleStyleSelect(firstStyle.basePrompt, firstStyle.src);
      }
    } else {
      setActiveSubTab("");
      setSelectedStyleImageSrc(null);
      setForm(prev => ({...prev, basePrompt: ""}));
    }
  }, [activeTab]);

  useEffect(() => {
    if (!activeTab || !activeSubTab || !gamerStylesData[activeTab]?.[activeSubTab]) return;
    const firstStyle = gamerStylesData[activeTab]?.[activeSubTab]?.[0];
    if (firstStyle) {
        handleStyleSelect(firstStyle.basePrompt, firstStyle.src);
    } else {
        setSelectedStyleImageSrc(null);
        setForm(prev => ({...prev, basePrompt: ""}));
    }
  }, [activeSubTab]);


  // Scroll handling (same logic)
  useLayoutEffect(() => {
    handleCategoryScroll();
    handleSubCategoryScroll();
  }, [activeTab, activeSubTab, gamerStylesData]); // Add dependencies

  const handleScroll = (ref: React.RefObject<HTMLDivElement>, setLeft: React.Dispatch<React.SetStateAction<boolean>>, setRight: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!ref.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    setLeft(scrollLeft > 5); // Add small buffer
    setRight(scrollLeft + clientWidth < scrollWidth - 5); // Add small buffer
  };

  const handleCategoryScroll = () => handleScroll(categoryScrollRef, setShowLeftCategoryArrow, setShowRightCategoryArrow);
  const scrollCategories = (direction: "left" | "right") => {
    categoryScrollRef.current?.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
  };

  const handleSubCategoryScroll = () => handleScroll(subcategoryScrollRef, setShowLeftSubCategoryArrow, setShowRightSubCategoryArrow);
  const scrollSubCategories = (direction: "left" | "right") => {
    subcategoryScrollRef.current?.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
  };

  const { mutate: triggerGenerateIcon, isLoading: isGenerating } = api.generate.generateIcon.useMutation({
    onSuccess(data) {
      setImagesUrl(data); // Assuming data is { imageUrl: string }[]
      setError(""); // Clear previous errors
      // Scroll to results
      document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    onError(error) {
      //console.error("Generation Error:", error);
      setError(error.message || "Failed to generate logo. Please try again.");
    },
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setImagesUrl([]); // Clear previous images

    if (!isLoggedIn) {
      void signIn("google"); // Or your preferred provider
      return;
    }
    if (!form.name.trim()) {
      setError("Please enter your Gamer Tag or Team Name.");
      return;
    }
    if (!form.basePrompt) {
      setError("Please select a logo style.");
      return;
    }

    // DataLayer push (ensure window.dataLayer is declared in global.ts)
    if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
        event: "generate_gaming_logo",
        gaming_logo_name: form.name,
        gaming_logo_category: activeTab,
        gaming_logo_subcategory: activeSubTab,
        gaming_logo_style_image: selectedStyleImageSrc || "none",
        gaming_logo_aspect_ratio: selectedAspectRatio,
        gaming_logo_model: selectedModel,
        gaming_logo_num_images: parseInt(form.numberofImages, 10),
        });
    }


    let finalPrompt = form.basePrompt;
    // Replace placeholder 'Text', "Text", `Text`, [Text] with form.name
    finalPrompt = finalPrompt.replace(/('Text'|"Text"|`Text`|\[Text\])/gi, form.name.trim());
    // Add common gaming logo keywords
    finalPrompt += ", gaming logo, esports emblem, vector, vibrant, dynamic, clean background";

    triggerGenerateIcon({
      prompt: finalPrompt,
      numberOfImages: parseInt(form.numberofImages, 10),
      aspectRatio: selectedAspectRatio,
      model: selectedModel,
    });
  };

  const handleStyleSelect = (basePrompt: string, src: string) => {
    setSelectedStyleImageSrc(src); // For visual feedback which image is selected
    setForm((prev) => ({ ...prev, basePrompt }));
    setError("");
  };

  const handleDownload = async (imageUrl: string, promptText: string) => {
    // ... (Download logic remains the same as in CollectionPage, use a shared util if possible)
    // For brevity, assuming it's similar, remember to use a good filename
    try {
        const response = await fetch(imageUrl); // imageUrl should be the full S3 URL
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const blob = await response.blob();
        const imageBitmap = await createImageBitmap(blob);
        const canvas = document.createElement("canvas");
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        const context = canvas.getContext("2d");
        if (context) {
            context.drawImage(imageBitmap, 0, 0);
            const pngBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
            if (pngBlob) {
            const blobUrl = window.URL.createObjectURL(pngBlob);
            const link = document.createElement("a");
            link.href = blobUrl;
            const safeName = form.name.trim().replace(/[^a-z0-9_]+/gi, '_').substring(0,30) || "gaming-logo";
            link.download = `${safeName}_${selectedModel}_${selectedAspectRatio.replace(":", "x")}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            } else { console.error("Failed to create PNG blob for download.");}
        }
    } catch (error) {
        console.error("Error downloading the image:", error);
        alert("Could not download image. Please try again.");
    }
  };

  const openPopup = (imageUrl: string) => setPopupImage(imageUrl);
  const closePopup = () => setPopupImage(null);

  // Update number of images if Ideogram is selected
  useEffect(() => {
    if (selectedModel === "ideogram-ai/ideogram-v2-turbo") {
      setForm(prev => ({ ...prev, numberofImages: "1" }));
    }
  }, [selectedModel]);


  return (
    <>
      <Head>
        <title>AI Gaming Logo Generator - Create Epic Esports & Streamer Logos | GamingLogoAI</title>
        <meta
          name="description"
          content="Design unique, professional gaming logos in minutes with GamingLogoAI's AI-powered generator. Perfect for esports teams, Twitch streamers, YouTube channels, and gamer profiles. Try it free!"
        />
        <meta name="keywords" content="ai gaming logo generator, esports logo maker, streamer logo, youtube gaming logo, custom gaming logo, game team logo, free gaming logo trial" />
        <link rel="canonical" href="https://www.gaminglogoai.com/gaming-logo-maker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Main background: dark slate, text: light slate/white */}
      <main className="container mx-auto mb-24 flex flex-col px-4 sm:px-8 py-8 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900">
        <header className="text-center mb-10">
            <Image src="/gaminglogo-ai-banner.png" alt="Gaming Logo AI Banner" width={800} height={200} className="mx-auto mb-4 rounded-lg shadow-lg" /> {/* Replace with actual banner */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-3">
                AI Gaming Logo Generator
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                Craft legendary logos for your team, stream, or gamer profile. Our AI makes it fast, easy, and totally epic. No design skills needed!
            </p>
        </header>

        {/* Instructions Block */}
        <div className="mb-12 p-6 border border-purple-500/50 dark:border-cyan-500/50 rounded-xl bg-slate-50 dark:bg-slate-800 text-sm leading-relaxed shadow-lg">
          <h2 className="text-2xl font-semibold mb-3 text-purple-700 dark:text-cyan-400">How to Forge Your Logo:</h2>
          <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
            <li><strong className="text-slate-800 dark:text-slate-100">Enter Your Gamer Tag/Team Name:</strong> This text will be featured in your logo.</li>
            <li><strong className="text-slate-800 dark:text-slate-100">Pick Your Signature Style:</strong> Browse categories like <em className="text-purple-600 dark:text-cyan-300">Mascots, Abstract, Minimalist, Retro</em>, etc.</li>
            <li><strong className="text-slate-800 dark:text-slate-100">Choose AI Model Power:</strong> Standard for speed, Optimized for quality, Ultimate for top-tier detail.</li>
            <li><strong className="text-slate-800 dark:text-slate-100">Select Aspect Ratio:</strong> Square (1:1) for profiles, Landscape (16:9) for banners, etc.</li>
            <li><strong className="text-slate-800 dark:text-slate-100">Number of Designs:</strong> Generate multiple variations to find the perfect one.</li>
          </ol>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            <strong className="font-semibold">Quick Tip:</strong> Shorter names or acronyms often work great for impactful gaming logos!
          </p>
        </div>

        {/* Main Form */}
        <form className="flex flex-col gap-8" onSubmit={handleFormSubmit}>
          {/* Section 1: Name Input */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-white">1. Your Gamer Tag / Team Name</h2>
            <FormGroup className="mb-0"> {/* Removed bottom margin if gap-8 on form handles it */}
              <Input
                required
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., ShadowBlade, Pixel Prowlers, YourStreamName"
                className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 focus:ring-2 focus:ring-purple-500 dark:focus:ring-cyan-500 focus:border-transparent"
              />
            </FormGroup>
          </section>

          {/* Section 2: Style Selection */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-white">2. Choose Your Logo Style</h2>
            {/* Category Scroller */}
            <div className="relative mb-4 flex items-center">
              {showLeftCategoryArrow && (
                <button type="button" onClick={() => scrollCategories("left")} className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 shadow-md" aria-label="Scroll Categories Left"><AiOutlineLeft size={20} /></button>
              )}
              <div ref={categoryScrollRef} onScroll={handleCategoryScroll} className="flex overflow-x-auto whitespace-nowrap no-scrollbar space-x-2 py-2 flex-1">
                {Object.keys(gamerStylesData ?? {}).map((catKey) => (
                  <button key={catKey} type="button" onClick={() => setActiveTab(catKey)}
                    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200
                                ${activeTab === catKey ? "bg-purple-600 dark:bg-cyan-500 text-white dark:text-slate-900 shadow-lg" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"}`}>
                    {catKey}
                  </button>
                ))}
              </div>
              {showRightCategoryArrow && (
                <button type="button" onClick={() => scrollCategories("right")} className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 shadow-md" aria-label="Scroll Categories Right"><AiOutlineRight size={20} /></button>
              )}
            </div>
            {/* Subcategory Scroller */}
            {activeTab && gamerStylesData[activeTab] && Object.keys(gamerStylesData[activeTab]).length > 0 && (
                <div className="relative mb-6 flex items-center">
                {showLeftSubCategoryArrow && (
                    <button type="button" onClick={() => scrollSubCategories("left")} className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 shadow-md" aria-label="Scroll Subcategories Left"><AiOutlineLeft size={18} /></button>
                )}
                <div ref={subcategoryScrollRef} onScroll={handleSubCategoryScroll} className="flex overflow-x-auto whitespace-nowrap no-scrollbar space-x-2 py-2 flex-1">
                    {Object.keys(gamerStylesData[activeTab] ?? {}).map((subKey) => (
                    <button key={subKey} type="button" onClick={() => setActiveSubTab(subKey)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200
                                    ${activeSubTab === subKey ? "bg-purple-500 dark:bg-cyan-400 text-white dark:text-slate-900 shadow-md" : "bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-500"}`}>
                        {subKey}
                    </button>
                    ))}
                </div>
                {showRightSubCategoryArrow && (
                    <button type="button" onClick={() => scrollSubCategories("right")} className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 shadow-md" aria-label="Scroll Subcategories Right"><AiOutlineRight size={18} /></button>
                )}
                </div>
            )}
            {/* Style Thumbnails */}
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {(gamerStylesData[activeTab]?.[activeSubTab] ?? []).map((item, idx) => {
                const styleImagePath = item.src; // Assuming item.src is the direct path to the image
                return (
                  <div
                    key={idx}
                    className={`relative rounded-lg shadow-md hover:shadow-xl dark:bg-slate-800 transition-all duration-300 cursor-pointer aspect-square overflow-hidden
                                ${selectedStyleImageSrc === item.src ? "ring-4 ring-purple-500 dark:ring-cyan-500" : "ring-1 ring-transparent hover:ring-purple-300 dark:hover:ring-cyan-300"}`}
                    onClick={() => handleStyleSelect(item.basePrompt, item.src)}
                    title={`Select style: ${item.basePrompt.substring(0,50)}...`}
                  >
                    <Image
                      src={styleImagePath} // Use Next/Image
                      alt={`Style: ${item.basePrompt.substring(0,30)}...`}
                      layout="fill" // Fill the container
                      objectFit="cover" // Cover the area
                      className="transition-transform duration-300 hover:scale-105"
                    />
                    <button type="button" onClick={(e) => { e.stopPropagation(); openPopup(styleImagePath); }}
                      className="absolute top-1 right-1 z-10 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors"
                      title="View Fullscreen" aria-label="View Fullscreen">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 10V3m0 7H3m7 0h7m0-7v7" /></svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 3: Select AI Model (WITH PREVIEWS) */}
          <section>
            <h2 className="text-2xl font-semibold mb-1 text-slate-900 dark:text-white">3. Choose AI Engine</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Different engines offer unique looks and detail levels. Previews show a hint based on your selected style.
            </p>
            <FormGroup className="mb-0"> {/* FormGroup might not be needed if grid has its own gap */}
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
                {[
                  {
                    name: "Speedy Engine",
                    value: "flux-schnell" as AIModel,
                    cost: 1,
                    desc: "Fast results, great for quick ideas and variations.",
                    // Generates preview path: uses selectedStyleImageSrc directly
                    getPreviewImage: (baseSrc: string | null) => baseSrc,
                  },
                  {
                    name: "Balanced Engine",
                    value: "flux-dev" as AIModel,
                    cost: 4,
                    desc: "Excellent quality and detail, our recommended choice.",
                    recommended: true,
                    // Generates preview path: e.g., image.webp -> imagee.webp
                    getPreviewImage: (baseSrc: string | null) => baseSrc ? baseSrc.replace(/(\.[^.]+)$/, "e$1") : null,
                  },
                  {
                    name: "Max Detail Engine",
                    value: "ideogram-ai/ideogram-v2-turbo" as AIModel,
                    cost: 8,
                    desc: "Top-tier fidelity for truly unique, intricate designs.",
                    // Generates preview path: e.g., image.webp -> imageea.webp
                    getPreviewImage: (baseSrc: string | null) => baseSrc ? baseSrc.replace(/(\.[^.]+)$/, "ea$1") : null,
                  },
                ].map((model) => {
                  const previewImageSrc = model.getPreviewImage(selectedStyleImageSrc) || "/images/placeholder-logo.png"; // Fallback image

                  return (
                    <button
                      key={model.value}
                      type="button"
                      onClick={() => setSelectedModel(model.value)}
                      className={`relative flex flex-col items-stretch justify-between border rounded-lg p-4 transition-all duration-200 h-full
                                  text-left text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 group
                                  ${selectedModel === model.value
                                    ? "border-purple-500 dark:border-cyan-500 ring-2 ring-purple-500 dark:ring-cyan-400 shadow-xl"
                                    : "border-slate-300 dark:border-slate-700 hover:border-purple-400 dark:hover:border-cyan-400 hover:shadow-md"
                                  }`}
                    >
                      {/* Image Preview Area */}
                      <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-md bg-slate-200 dark:bg-slate-700">
                        <Image
                          src={previewImageSrc}
                          alt={`${model.name} preview based on selected style`}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            // If specific preview (e.g., imagee.webp) fails, fallback to placeholder
                            (e.target as HTMLImageElement).src = "/images/placeholder-logo.png";
                          }}
                        />
                        {model.recommended && (
                          <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-0.5 text-xs rounded-full font-medium shadow">
                            Recommended
                          </span>
                        )}
                      </div>
                      {/* Text Content Area */}
                      <div className="flex flex-col">
                        <span className="font-semibold text-lg">{model.name}</span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-2 grow">{model.desc}</p>
                        <span className="text-sm font-medium text-purple-700 dark:text-cyan-400 self-start">
                          Cost: {model.cost} Credit{model.cost > 1 ? 's' : ''}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </FormGroup>
          </section>

          {/* Section 4: Select Image Aspect Ratio */}
           <section>
            <h2 className="text-2xl font-semibold mb-1 text-slate-900 dark:text-white">4. Select Image Shape & Size</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Choose the aspect ratio that best fits where you&apos;ll use your logo.
            </p>
            <FormGroup className="mb-0">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {aspectRatios.map((ratio) => {
                  return (
                    <button
                      key={ratio.value}
                      type="button"
                      onClick={() => setSelectedAspectRatio(ratio.value)}
                      className={clsx(
                        `relative flex flex-col items-center justify-start border rounded-lg p-3 pt-4 transition-all duration-200 group`,
                        `text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800`,
                        `h-36 sm:h-40`, // Fixed height for the cards
                        selectedAspectRatio === ratio.value
                          ? "border-purple-500 dark:border-cyan-500 ring-2 ring-purple-500 dark:ring-cyan-400 shadow-xl"
                          : "border-slate-300 dark:border-slate-700 hover:border-purple-400 dark:hover:border-cyan-400 hover:shadow-md"
                      )}
                      title={`Select aspect ratio: ${ratio.label} (${ratio.description})`}
                    >
                      {/* Container for the visual shape, with a fixed height */}
                      <div className="w-full h-[60px] sm:h-[70px] flex items-center justify-center mb-2">
                        {/* The visual shape itself */}
                        <div
                          className={clsx(
                            "bg-slate-300 dark:bg-slate-600 rounded-sm shadow-inner group-hover:bg-slate-400 dark:group-hover:bg-slate-500 transition-colors",
                            ratio.tailwindClass // Applies aspect-square, aspect-video, etc.
                          )}
                          style={
                            // This is your updated logic:
                            // If it's 16:9 (landscape), set width to 50% of parent, height auto.
                            // Otherwise (for 1:1, 9:16, 4:3), set height to 100% of parent, width auto.
                            ratio.value === "16:9"
                              ? { width: '50%', height: 'auto' }
                              : { height: '100%', width: 'auto' }
                          }
                        >
                          {/* No text inside the shape for cleaner visuals */}
                        </div>
                      </div>

                      {/* Text Label Below */}
                      <div className="text-center mt-auto"> {/* mt-auto pushes this to the bottom */}
                        <span className="block text-sm font-semibold">{ratio.label}</span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400">{ratio.description}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </FormGroup>
          </section>

          {/* Section 5: Number of Images */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-white">5. Number of Variations</h2>
            <FormGroup className="mb-0">
              <label htmlFor="numberofImages" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Logos to Generate (Max {selectedModel === "ideogram-ai/ideogram-v2-turbo" ? 1 : 4})
              </label>
              <Input
                required
                id="numberofImages"
                type="number"
                min={1}
                max={selectedModel === "ideogram-ai/ideogram-v2-turbo" ? 1 : 4} // Max 4 for better UX with costs
                value={form.numberofImages}
                onChange={(e) => {
                    const num = parseInt(e.target.value, 10);
                    const maxVal = selectedModel === "ideogram-ai/ideogram-v2-turbo" ? 1 : 4;
                    if (num > maxVal) {
                        setForm((prev) => ({ ...prev, numberofImages: maxVal.toString() }));
                    } else {
                        setForm((prev) => ({ ...prev, numberofImages: e.target.value }));
                    }
                }}
                disabled={selectedModel === "ideogram-ai/ideogram-v2-turbo"}
                placeholder={selectedModel === "ideogram-ai/ideogram-v2-turbo" ? "1 (Fixed for Ultimate)" : "1-4"}
                className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 focus:ring-2 focus:ring-purple-500 dark:focus:ring-cyan-500 focus:border-transparent"
              />
            </FormGroup>
          </section>

          {/* Error Display */}
          {error && (
            <div className="my-4 p-4 border-l-4 border-red-600 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md shadow">
              <p className="font-semibold">Oops! Something went wrong.</p>
              <p>{error}
                {error.toLowerCase().includes("enough credits") && (
                  <Link id="gamelogo-not-enough-credits-alert-btn" href="/buy-credits" className="underline font-bold ml-2 text-purple-600 dark:text-cyan-400 hover:text-purple-700 dark:hover:text-cyan-500">
                    Buy More Credits?
                  </Link>
                )}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6">
            <Button type="submit" isLoading={isGenerating} disabled={isGenerating || !form.basePrompt.trim() || !form.name.trim()}
              className={`w-full text-lg font-semibold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2
                          ${isLoggedIn ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-600 dark:hover:to-blue-600 dark:text-slate-900 focus:ring-purple-500 dark:focus:ring-cyan-400' 
                                      : 'bg-slate-500 text-slate-100 cursor-not-allowed' }
                          disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isLoggedIn ? (isGenerating ? "Generating Your Logos..." : "Forge My Logos!") : "Sign In to Generate"}
            </Button>
            {!isLoggedIn && <p className="text-center text-xs mt-2 text-slate-500 dark:text-slate-400">Sign in to save your creations and access more features!</p>}
          </div>
        </form>

        {/* Generated Images Section */}
        {imagesUrl.length > 0 && (
          <section id="results-section" className="mt-12">
            <h2 className="text-3xl font-semibold mb-6 text-center text-slate-900 dark:text-white">Your Generated Gaming Logos!</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imagesUrl.map(({ imageUrl }, index) => (
                <div key={index} className="relative group rounded-lg shadow-lg hover:shadow-2xl dark:bg-slate-800 transition-all duration-300 aspect-square overflow-hidden">
                  <Image src={imageUrl} alt={`Generated gaming logo ${index + 1} for ${form.name}`} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-3 space-y-2">
                    <div className="flex gap-2">
                        <button type="button" onClick={() => openPopup(imageUrl)}
                            className="p-2.5 rounded-full bg-slate-100/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 shadow-md transition-colors"
                            title="View Fullscreen" aria-label="View Fullscreen">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V4a1 1 0 00-1-1H4zm10 0a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V4a1 1 0 00-1-1h-4zM4 11a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1H4zm10 0a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1h-4z" clipRule="evenodd" /></svg>
                        </button>
                        <button type="button" onClick={() => void handleDownload(imageUrl, form.basePrompt)}
                            className="p-2.5 rounded-full bg-slate-100/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 shadow-md transition-colors"
                            title="Download Logo" aria-label="Download Logo">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Popup Modal (same as CollectionPage) */}
        {popupImage && (
          <div className="fixed inset-0 z-[100] bg-black bg-opacity-80 flex items-center justify-center p-4 backdrop-blur-sm" onClick={closePopup}>
            <div className="relative bg-slate-100 dark:bg-slate-800 p-2 rounded-lg shadow-2xl max-w-3xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={closePopup}
                className="absolute -top-4 -right-4 z-[110] bg-purple-600 dark:bg-cyan-500 text-white rounded-full p-1.5 hover:opacity-80 focus:outline-none shadow-md"
                title="Close Fullscreen" aria-label="Close Fullscreen">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <Image src={popupImage} alt="Fullscreen generated gaming logo" width={1024} height={1024} style={{ objectFit: 'contain', width: 'auto', height: 'auto', maxHeight: '85vh', maxWidth: 'calc(100vw - 4rem)' }} className="rounded-md"/>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default GameLogoPage;