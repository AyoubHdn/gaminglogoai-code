// src/pages/gaming-logo-maker.tsx
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image"; // Using Image directly from next/image
import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react";
import { Button } from "~/component/Button";
import { FormGroup } from "~/component/FormGroup";
import { api } from "~/utils/api";
import { Input } from "~/component/Input";
import { gamerStylesData } from "~/data/gamerStylesData"; // Ensure this path and data structure are correct
import { useSession, signIn } from "next-auth/react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Link from "next/link";
import clsx from "clsx";
// Assuming Plan enum is relevant if gamingPlan on User model uses it.
// If gamingPlan is just a string, you might not need this import here.
// import { Plan } from "@prisma/client"; 

// Type definitions
type AIModel = "flux-schnell" | "flux-dev";
type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3";

// Define the expected structure for items in gamerStylesData more precisely
interface StyleItem {
  src: string;
  basePrompt: string;
}
interface GamerStyleSubCategory {
  [subcategoryName: string]: StyleItem[];
}
interface GamerStyleCategory {
  [categoryName: string]: GamerStyleSubCategory;
}


const GameLogoPage: NextPage = () => {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  const [form, setForm] = useState({
    name: "",
    basePrompt: "",
    numberofImages: "1",
  });
  const [error, setError] = useState<string>("");
  const [imagesUrl, setImagesUrl] = useState<{ imageUrl: string }[]>([]);
  const [selectedStyleImageSrc, setSelectedStyleImageSrc] = useState<string | null>(null);
  const [popupImage, setPopupImage] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<string>("");
  const [activeSubTab, setActiveSubTab] = useState<string>("");

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const subcategoryScrollRef = useRef<HTMLDivElement>(null);
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

  const typedGamerStylesData = gamerStylesData as GamerStyleCategory; // Cast to our defined type

  const handleStyleSelect = useCallback((basePrompt: string, src: string) => {
  setSelectedStyleImageSrc(src);
  setForm((prev) => ({ ...prev, basePrompt }));
  setError("");
}, []); // Dependencies: only if setSelectedStyleImageSrc or setForm setters change, which they don't

// Initialize activeTab to the first category
useEffect(() => {
  const categoryKeys = Object.keys(typedGamerStylesData); // Use the typed version
  if (categoryKeys.length > 0 && categoryKeys[0]) {
    setActiveTab(categoryKeys[0]);
  }
}, []); // typedGamerStylesData is stable, so no need to add it here if it's a static import

// Update activeSubTab when activeTab changes
useEffect(() => {
  if (!activeTab) { // If activeTab is empty string (initial state or reset)
    setActiveSubTab("");
    setSelectedStyleImageSrc(null);
    setForm(prev => ({ ...prev, basePrompt: "" }));
    return;
  }

  // Check if the activeTab key actually exists and has data
  const subcategoriesForActiveTab = typedGamerStylesData[activeTab];

  if (!subcategoriesForActiveTab || typeof subcategoriesForActiveTab !== 'object') {
    // This case means activeTab was a string, but not a valid key in typedGamerStylesData,
    // or the data for that key is not an object (which would be a data structure error).
    setActiveSubTab("");
    setSelectedStyleImageSrc(null);
    setForm(prev => ({ ...prev, basePrompt: "" }));
    return;
  }

  // At this point, subcategoriesForActiveTab IS an object (GamerStyleSubCategory).
  const subKeys = Object.keys(subcategoriesForActiveTab); // This is now safe.

  if (subKeys.length > 0 && subKeys[0]) {
    setActiveSubTab(subKeys[0]);
    // The next useEffect will handle selecting the first style of this new subTab.
  } else {
    // No subcategories found for this activeTab
    setActiveSubTab("");
    setSelectedStyleImageSrc(null);
    setForm(prev => ({ ...prev, basePrompt: "" }));
  }
}, [activeTab]); // Runs when activeTab changes

// Update selected style when activeSubTab (or activeTab leading to new subTab) changes
useEffect(() => {
  if (!activeTab || !activeSubTab) {
    setSelectedStyleImageSrc(null);
    setForm(prev => ({ ...prev, basePrompt: "" }));
    return;
  }

  const categoryData = typedGamerStylesData[activeTab];
  if (!categoryData || typeof categoryData !== 'object') {
    setSelectedStyleImageSrc(null); setForm(prev => ({ ...prev, basePrompt: "" })); return;
  }

  const stylesInCurrentSubTab = categoryData[activeSubTab];
  if (!stylesInCurrentSubTab || !Array.isArray(stylesInCurrentSubTab)) {
    setSelectedStyleImageSrc(null); setForm(prev => ({ ...prev, basePrompt: "" })); return;
  }

  if (stylesInCurrentSubTab.length > 0 && stylesInCurrentSubTab[0]) {
    const firstStyle = stylesInCurrentSubTab[0];
    // Ensure firstStyle and its properties exist before calling handleStyleSelect
    if (firstStyle && typeof firstStyle.src === 'string' && typeof firstStyle.basePrompt === 'string') {
      handleStyleSelect(firstStyle.basePrompt, firstStyle.src);
    } else {
      // First style item is malformed
      setSelectedStyleImageSrc(null); setForm(prev => ({ ...prev, basePrompt: "" }));
    }
  } else {
    // No styles in current subcategory
    setSelectedStyleImageSrc(null);
    setForm(prev => ({ ...prev, basePrompt: "" }));
  }
}, [activeTab, activeSubTab, handleStyleSelect]);   // Runs when activeTab or activeSubTab changes

  // Scroll handling effects
  useLayoutEffect(() => {
    handleCategoryScroll();
    handleSubCategoryScroll();
  }, [activeTab, activeSubTab, typedGamerStylesData]);

  const handleScroll = (ref: React.RefObject<HTMLDivElement>, setLeft: React.Dispatch<React.SetStateAction<boolean>>, setRight: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!ref.current) return; const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    setLeft(scrollLeft > 5); setRight(scrollLeft + clientWidth < scrollWidth - 5);
  };
  const handleCategoryScroll = () => handleScroll(categoryScrollRef, setShowLeftCategoryArrow, setShowRightCategoryArrow);
  const scrollCategories = (direction: "left" | "right") => categoryScrollRef.current?.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
  const handleSubCategoryScroll = () => handleScroll(subcategoryScrollRef, setShowLeftSubCategoryArrow, setShowRightSubCategoryArrow);
  const scrollSubCategories = (direction: "left" | "right") => subcategoryScrollRef.current?.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });

  const { mutate: triggerGenerateIcon, isLoading: isGenerating } = api.generate.generateIcon.useMutation({
    onSuccess(data) { setImagesUrl(data); setError(""); document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth", block: "start" }); },
    onError(error) {
      console.error("Generation Error (Full TRPCClientError object):", error);
      if (error.data?.code === 'BAD_REQUEST' && error.message.toLowerCase().includes("enough gaming credits")) { setError("INSUFFICIENT_CREDITS"); }
      else { setError(error.message || "An unexpected error occurred. Please try again."); }
    },
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(""); setImagesUrl([]);
    if (!isLoggedIn) { void signIn("google"); return; }
    if (!form.name.trim()) { setError("Please enter your Gamer Tag or Team Name."); return; }
    if (!form.basePrompt) { setError("Please select a logo style."); return; }

    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "generate_gaming_logo", gaming_logo_name: form.name, gaming_logo_category: activeTab,
        gaming_logo_subcategory: activeSubTab, gaming_logo_style_image: selectedStyleImageSrc || "none",
        gaming_logo_aspect_ratio: selectedAspectRatio, gaming_logo_model: selectedModel,
        gaming_logo_num_images: parseInt(form.numberofImages, 10),
      });
    }
    let finalPrompt = form.basePrompt;
    finalPrompt = finalPrompt.replace(/('Text'|"Text"|`Text`|\[Text\])/gi, form.name.trim());
    finalPrompt += ", gaming logo, esports emblem, vector, vibrant, dynamic, clean background, official game art"; // Added more keywords
    triggerGenerateIcon({
      prompt: finalPrompt, numberOfImages: parseInt(form.numberofImages, 10),
      aspectRatio: selectedAspectRatio, model: selectedModel,
    });
  };

  const handleDownload = async (imageUrl: string, promptText?: string) => {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const blob = await response.blob(); const imageBitmap = await createImageBitmap(blob);
        const canvas = document.createElement("canvas"); canvas.width = imageBitmap.width; canvas.height = imageBitmap.height;
        const context = canvas.getContext("2d");
        if (context) {
            context.drawImage(imageBitmap, 0, 0);
            const pngBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
            if (pngBlob) {
            const blobUrl = window.URL.createObjectURL(pngBlob); const link = document.createElement("a");
            link.href = blobUrl;
            const safeName = (form.name.trim() || promptText?.replace(/[^a-z0-9_]+/gi, '_').substring(0,30) || "gaming-logo").replace(/[^a-z0-9_]+/gi, '_');
            link.download = `${safeName}_${selectedModel}_${selectedAspectRatio.replace(":", "x")}.png`;
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            } else { console.error("Failed to create PNG blob for download.");}
        }
    } catch (dlError) { console.error("Error downloading the image:", dlError); alert("Could not download image. Please try again."); }
  };

  const openPopup = (imageUrl: string) => setPopupImage(imageUrl);
  const closePopup = () => setPopupImage(null);

  return (
    <>
      <Head>
        <title>AI Gaming Logo Maker - Create Epic Esports & Streamer Logos | GamingLogoAI</title>
        <meta name="description" content="Design unique, professional gaming logos in minutes with GamingLogoAI's AI-powered generator. Perfect for esports teams, Twitch streamers, YouTube channels, and gamer profiles. Try it free!" />
        <meta name="keywords" content="ai gaming logo generator, esports logo maker, streamer logo, youtube gaming logo, custom gaming logo, game team logo, free gaming logo trial, ai game art" />
        <link rel="canonical" href="https://www.gaminglogoai.com/gaming-logo-maker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto max-w-screen-lg mb-24 flex flex-col px-4 sm:px-8 py-8 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900">
        <header className="text-center mb-10">
            <Image src="/gaminglogo-ai-banner.png" alt="Gaming Logo AI Banner - Create stunning gaming logos with AI" width={800} height={200} className="mx-auto mb-4 rounded-lg shadow-lg" priority />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-3">
                AI Gaming Logo Generator
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                Craft legendary logos for your team, stream, or gamer profile. Our AI makes it fast, easy, and totally epic. No design skills needed!
            </p>
        </header>

        <div className="mb-12 p-6 border border-purple-500/30 dark:border-cyan-500/30 rounded-xl bg-slate-50 dark:bg-slate-800/70 text-sm leading-relaxed shadow-lg backdrop-blur-sm">
          <h2 className="text-2xl font-semibold mb-3 text-purple-700 dark:text-cyan-400">How to Forge Your Logo:</h2>
          <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
            <li><strong className="text-slate-800 dark:text-slate-100">Enter Your Gamer Tag/Team Name:</strong> This text will be featured in your logo.</li>
            <li><strong className="text-slate-800 dark:text-slate-100">Pick Your Signature Style:</strong> Browse categories like <em className="text-purple-600 dark:text-cyan-300">Mascots, Abstract, Minimalist, Retro</em>, etc.</li>
            <li><strong className="text-slate-800 dark:text-slate-100">Choose AI Engine Power:</strong> Standard for speed, Balanced for quality, Max Detail for top-tier results.</li>
            <li><strong className="text-slate-800 dark:text-slate-100">Select Aspect Ratio:</strong> Square (1:1) for profiles, Landscape (16:9) for banners, etc.</li>
            <li><strong className="text-slate-800 dark:text-slate-100">Number of Designs:</strong> Generate multiple variations to find the perfect one.</li>
          </ol>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            <strong className="font-semibold">Quick Tip:</strong> Shorter names or acronyms often create more impactful gaming logos!
          </p>
        </div>

        <form className="flex flex-col gap-10" onSubmit={handleFormSubmit}>
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-white flex items-center">
              <span className="bg-purple-600 dark:bg-cyan-500 text-white dark:text-slate-900 rounded-full h-7 w-7 text-sm flex items-center justify-center mr-3">1</span>
              Your Gamer Tag / Team Name
            </h2>
            <FormGroup className="mb-0">
              <Input required value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., ShadowBlade, Pixel Prowlers, YourStreamName"
                className="w-full p-3 text-base border-2 border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-purple-500 dark:focus:ring-cyan-500 focus:border-transparent shadow-sm"
                aria-label="Gamer Tag or Team Name"
              />
            </FormGroup>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-white flex items-center">
                <span className="bg-purple-600 dark:bg-cyan-500 text-white dark:text-slate-900 rounded-full h-7 w-7 text-sm flex items-center justify-center mr-3">2</span>
                Choose Your Logo Style
            </h2>
            {/* Category Scroller */}
            <div className="relative mb-4 flex items-center">
              {showLeftCategoryArrow && ( <button type="button" onClick={() => scrollCategories("left")} className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 shadow-md border border-slate-300 dark:border-slate-600" aria-label="Scroll Categories Left"><AiOutlineLeft size={18} /></button> )}
              <div ref={categoryScrollRef} onScroll={handleCategoryScroll} className="flex overflow-x-auto whitespace-nowrap no-scrollbar space-x-2 sm:space-x-3 py-2 flex-1 mx-3">
                {Object.keys(typedGamerStylesData).map((catKey) => ( <button key={catKey} type="button" onClick={() => setActiveTab(catKey)} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm shadow-sm hover:shadow-md ${activeTab === catKey ? "bg-purple-600 dark:bg-cyan-500 text-white dark:text-slate-900 scale-105" : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600"}`}>{catKey}</button>))}
              </div>
              {showRightCategoryArrow && ( <button type="button" onClick={() => scrollCategories("right")} className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 shadow-md border border-slate-300 dark:border-slate-600" aria-label="Scroll Categories Right"><AiOutlineRight size={18} /></button> )}
            </div>
            {/* Subcategory Scroller */}
            {activeTab && typedGamerStylesData[activeTab] && Object.keys(typedGamerStylesData[activeTab]!).length > 0 && (
                <div className="relative mb-6 flex items-center">
                {showLeftSubCategoryArrow && ( <button type="button" onClick={() => scrollSubCategories("left")} className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-300 dark:border-slate-600" aria-label="Scroll Subcategories Left"><AiOutlineLeft size={16} /></button> )}
                <div ref={subcategoryScrollRef} onScroll={handleSubCategoryScroll} className="flex overflow-x-auto whitespace-nowrap no-scrollbar space-x-2 sm:space-x-3 py-2 flex-1 mx-3">
                    {Object.keys(typedGamerStylesData[activeTab]!).map((subKey) => ( <button key={subKey} type="button" onClick={() => setActiveSubTab(subKey)} className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm hover:shadow ${activeSubTab === subKey ? "bg-purple-500 dark:bg-cyan-400 text-white dark:text-slate-900 scale-105" : "bg-white dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-500"}`}>{subKey}</button>))}
                </div>
                {showRightSubCategoryArrow && ( <button type="button" onClick={() => scrollSubCategories("right")} className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-300 dark:border-slate-600" aria-label="Scroll Subcategories Right"><AiOutlineRight size={16} /></button> )}
                </div>
            )}
            {/* Style Thumbnails */}
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
              {(typedGamerStylesData[activeTab]?.[activeSubTab] ?? []).map((item, idx) => {
                if (!item || !item.src || !item.basePrompt) {
                  console.warn("Style item invalid or missing src/basePrompt:", { item, activeTab, activeSubTab, idx });
                  return <div key={`error-style-${idx}`} className="aspect-square bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-700 dark:text-red-300 rounded-lg text-xs p-2">Style Data Error</div>;
                }
                // Assuming item.src might have .webp, and display uses e.webp
                const displayImagePath = item.src.endsWith("e.webp") ? item.src : item.src.replace(/\.webp$/, "e.webp");
                return (
                  <div key={`${activeTab}-${activeSubTab}-${item.src}-${idx}`}
                    className={clsx(`relative rounded-xl shadow-md hover:shadow-xl dark:bg-slate-700/50 transition-all duration-300 cursor-pointer aspect-square overflow-hidden group border-2`,
                                selectedStyleImageSrc === item.src ? "border-purple-500 dark:border-cyan-500 scale-105" : "border-transparent hover:border-purple-300 dark:hover:border-cyan-300")}
                    onClick={() => handleStyleSelect(item.basePrompt, item.src)}
                    title={`Select style: ${item.basePrompt.substring(0, 50)}...`} >
                    <img src={displayImagePath} alt={`Style preview for: ${item.basePrompt.substring(0, 40)}...`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Fallback logic for images: try original src, then placeholder
                        if (target.src.includes("e.webp") && !target.src.endsWith(item.src) && item.src) {
                            target.src = item.src; // Try original if 'e.webp' fails
                        } else if (!target.src.endsWith("/images/placeholder-style.png")) {
                            target.src = "/images/placeholder-style.png"; // Final fallback
                        }
                      }} />
                    <button type="button" onClick={(e) => { e.stopPropagation(); openPopup(displayImagePath); }}
                      className="absolute top-1.5 right-1.5 z-10 p-1.5 rounded-full bg-black/30 hover:bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none"
                      title="View Fullscreen" aria-label="View Fullscreen">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-3m-3 0H3m7.5 0V3m0 7.5v4.5m4.5-4.5h3m-3 0V3m0 7.5v4.5" /></svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 3: AI Engine (using descriptive card) */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-white flex items-center">
                <span className="bg-purple-600 dark:bg-cyan-500 text-white dark:text-slate-900 rounded-full h-7 w-7 text-sm flex items-center justify-center mr-3">3</span>
                Choose AI Engine
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Different engines offer unique looks and detail levels. Previews show a hint based on your selected style.</p>
            <FormGroup className="mb-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Changed to sm:grid-cols-2 */}
                {[
                  {
                    name: "Speedy Engine",
                    value: "flux-schnell" as AIModel, // Stays as flux-schnell
                    cost: 1, // Adjust cost if different
                    desc: "Fast results, great for text-to-logo, less style image influence.",
                    getPreviewImage: (baseSrc: string | null) => baseSrc, // Shows selected style directly
                  },
                  {
                    name: "Context Pro Engine", // Renamed from Balanced/Optimized
                    value: "flux-kontext-pro" as AIModel, // UPDATED to your new model
                    cost: 4, // Adjust cost if different for kontext-pro
                    desc: "Uses style image for higher fidelity and context. Recommended.",
                    recommended: true,
                    // Uses the 'e' suffixed image, assuming you have previews for it
                    getPreviewImage: (baseSrc: string | null) => baseSrc ? baseSrc.replace(/(\.[^.]+)$/, "e$1") : null,
                  },
                ].map((model) => {
                  const previewImageSrc = model.getPreviewImage(selectedStyleImageSrc) || "/images/placeholder-logo.png";
                  return (
                    <button
                      key={model.value}
                      type="button"
                      onClick={() => setSelectedModel(model.value)}
                      className={clsx(`flex flex-col items-stretch justify-between border-2 rounded-xl p-4 transition-all duration-200 h-full text-left text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800/70 group shadow-sm hover:shadow-lg`,
                        selectedModel === model.value ? "border-purple-500 dark:border-cyan-500 ring-2 ring-purple-500 dark:ring-cyan-400 scale-105 shadow-xl" : "border-slate-300 dark:border-slate-700 hover:border-purple-400 dark:hover:border-cyan-400"
                      )}
                    >
                      <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600">
                        <Image
                          src={previewImageSrc}
                          alt={`${model.name} preview`}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder-logo.png"; }}
                        />
                        {model.recommended && ( <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-0.5 text-xs rounded-full font-medium shadow">Recommended</span> )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-lg">{model.name}</span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-2 grow min-h-[2.5em]">{model.desc}</p>
                        <span className="text-sm font-medium text-purple-700 dark:text-cyan-400 self-start mt-auto pt-1">
                          Cost: {model.cost} Credit{model.cost > 1 ? 's' : ''}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </FormGroup>
          </section>

          {/* Section 4: Aspect Ratio */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-white flex items-center">
                <span className="bg-purple-600 dark:bg-cyan-500 text-white dark:text-slate-900 rounded-full h-7 w-7 text-sm flex items-center justify-center mr-3">4</span>
                Select Image Shape & Size
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Choose the aspect ratio that best fits where you&apos;ll use your logo.</p>
            <FormGroup className="mb-0">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {aspectRatios.map((ratio) => (
                    <button key={ratio.value} type="button" onClick={() => setSelectedAspectRatio(ratio.value)}
                      className={clsx(`relative flex flex-col items-center justify-start border-2 rounded-xl p-3 pt-4 transition-all duration-200 group text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800/70 h-32 sm:h-36 shadow-sm hover:shadow-lg`,
                                      selectedAspectRatio === ratio.value ? "border-purple-500 dark:border-cyan-500 ring-2 ring-purple-500 dark:ring-cyan-400 scale-105 shadow-xl" : "border-slate-300 dark:border-slate-700 hover:border-purple-400 dark:hover:border-cyan-400"
                                  )} title={`Select aspect ratio: ${ratio.label} (${ratio.description})`}>
                      <div className="w-full h-[50px] sm:h-[60px] flex items-center justify-center mb-1 sm:mb-2">
                        <div className={clsx("bg-slate-300 dark:bg-slate-600 rounded-md shadow-inner group-hover:bg-slate-400 dark:group-hover:bg-slate-500 transition-colors border border-slate-400 dark:border-slate-500", ratio.tailwindClass)}
                          style={ ratio.value === "16:9" ? { width: '80%', height: 'auto' } : { height: '80%', width: 'auto' } }></div>
                      </div>
                      <div className="text-center mt-auto">
                        <span className="block text-xs sm:text-sm font-semibold">{ratio.label}</span>
                        <span className="block text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">{ratio.description}</span>
                      </div>
                    </button>
                  ))}
              </div>
            </FormGroup>
          </section>

          {/* Section 5: Number of Variations */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-white flex items-center">
                <span className="bg-purple-600 dark:bg-cyan-500 text-white dark:text-slate-900 rounded-full h-7 w-7 text-sm flex items-center justify-center mr-3">5</span>
                Number of Variations
            </h2>
            <FormGroup className="mb-0">
              <label htmlFor="numberofImages" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Logos to Generate (Max {4})</label>
              <Input required id="numberofImages" type="number" min={1}
                max={4}
                value={form.numberofImages}
                onChange={(e) => {
                    const num = parseInt(e.target.value, 10); const maxVal = 4;
                    if (num > maxVal) { setForm((prev) => ({ ...prev, numberofImages: maxVal.toString() })); }
                    else if (num < 1 && e.target.value !== "") { setForm((prev) => ({ ...prev, numberofImages: "1" })); }
                    else { setForm((prev) => ({ ...prev, numberofImages: e.target.value })); }
                }}
                placeholder={"1-4"}
                className="w-full p-3 text-base border-2 border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-purple-500 dark:focus:ring-cyan-500 focus:border-transparent shadow-sm"
              />
            </FormGroup>
          </section>

          {/* Error Display */}
          {error && (
            <div className={`my-6 p-4 border-l-4 rounded-md shadow-md ${error === "INSUFFICIENT_CREDITS" ? "bg-yellow-50 border-yellow-500 dark:bg-yellow-900/30 dark:border-yellow-600" : "bg-red-50 border-red-500 dark:bg-red-900/30 dark:border-red-600"}`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {error === "INSUFFICIENT_CREDITS" ? ( <svg className="h-5 w-5 text-yellow-500 dark:text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.332-.211 3.001-1.742 3.001H4.42c-1.531 0-2.493-1.669-1.743-3.001l5.58-9.92zM10 10.5a1 1 0 011-1h.01a1 1 0 110 2H11a1 1 0 01-1-1zm.01-4.502a1 1 0 00-.998 1.116l.244 2.684a1 1 0 001.99-.182l-.244-2.684a1 1 0 00-.992-.934z" clipRule="evenodd" /></svg>
                  ) : ( <svg className="h-5 w-5 text-red-500 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.707-4.293a1 1 0 001.414 0L12 12.414l1.293 1.293a1 1 0 001.414-1.414L13.414 11l1.293-1.293a1 1 0 00-1.414-1.414L12 9.586 10.707 8.293a1 1 0 00-1.414 1.414L10.586 11l-1.293 1.293a1 1 0 000 1.414z" clipRule="evenodd" /></svg> )}
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${error === "INSUFFICIENT_CREDITS" ? "text-yellow-800 dark:text-yellow-300" : "text-red-800 dark:text-red-300"}`}>
                    {error === "INSUFFICIENT_CREDITS" ? "Not Enough Credits" : "Generation Failed"}
                  </h3>
                  <div className={`mt-2 text-sm ${error === "INSUFFICIENT_CREDITS" ? "text-yellow-700 dark:text-yellow-200" : "text-red-700 dark:text-red-200"}`}>
                    <p>{error === "INSUFFICIENT_CREDITS" ? "You don't have enough gaming credits to perform this action." : error}</p>
                    {error === "INSUFFICIENT_CREDITS" && ( <p className="mt-1"><Link id="gamelogo-not-enough-credits-alert-btn" href="/buy-credits" className="font-medium underline text-yellow-700 hover:text-yellow-600 dark:text-yellow-200 dark:hover:text-yellow-100">Please purchase more credits to continue.</Link></p> )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6">
            <Button type="submit" isLoading={isGenerating} disabled={isGenerating || !form.basePrompt.trim() || !form.name.trim()}
              className={`w-full text-lg font-semibold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isLoggedIn ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-600 dark:hover:to-blue-600 dark:text-slate-900 focus:ring-purple-500 dark:focus:ring-cyan-400' : 'bg-slate-500 text-slate-100 cursor-not-allowed' } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isLoggedIn ? (isGenerating ? "Generating Your Logos..." : "Forge My Logos!") : "Sign In to Generate"}
            </Button>
            {!isLoggedIn && <p className="text-center text-xs mt-2 text-slate-500 dark:text-slate-400">Sign in to save your creations and access more features!</p>}
          </div>
        </form>

        {/* Generated Images Section (using Image from next/image) */}
        {imagesUrl.length > 0 && (
          <section id="results-section" className="mt-12">
            <h2 className="text-3xl font-semibold mb-6 text-center text-slate-900 dark:text-white">Your Generated Gaming Logos!</h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {imagesUrl.map(({ imageUrl }, index) => (
                <div key={index} className="relative group rounded-xl shadow-lg hover:shadow-2xl dark:bg-slate-800/70 transition-all duration-300 aspect-square overflow-hidden border-2 border-transparent hover:border-purple-500 dark:hover:border-cyan-500">
                  <Image src={imageUrl} alt={`Generated gaming logo ${index + 1} for ${form.name}`} fill style={{ objectFit: "cover" }} className="transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" priority={index < 4} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-3 space-y-2">
                    <div className="flex gap-2">
                        <button type="button" onClick={() => openPopup(imageUrl)} className="p-2.5 rounded-full bg-slate-100/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 shadow-md transition-colors" title="View Fullscreen" aria-label="View Fullscreen">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V4a1 1 0 00-1-1H4zm10 0a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V4a1 1 0 00-1-1h-4zM4 11a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1H4zm10 0a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1h-4z" clipRule="evenodd" /></svg>
                        </button>
                        <button type="button" onClick={() => void handleDownload(imageUrl, form.basePrompt)} className="p-2.5 rounded-full bg-slate-100/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 shadow-md transition-colors" title="Download Logo" aria-label="Download Logo">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Popup Modal (using Image from next/image) */}
        {popupImage && (
          <div className="fixed inset-0 z-[100] bg-black bg-opacity-80 flex items-center justify-center p-4 backdrop-blur-sm" onClick={closePopup}>
            <div className="relative bg-slate-100 dark:bg-slate-800 p-2 rounded-lg shadow-2xl max-w-3xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={closePopup} className="absolute -top-4 -right-4 z-[110] bg-purple-600 dark:bg-cyan-500 text-white rounded-full p-1.5 hover:opacity-80 focus:outline-none shadow-md" title="Close Fullscreen" aria-label="Close Fullscreen">
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