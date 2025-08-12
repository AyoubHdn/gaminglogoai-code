// src/pages/face-logo-generator.tsx
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, ChangeEvent } from "react";
import { Button } from "~/component/Button";
import { FormGroup } from "~/component/FormGroup";
import { api } from "~/utils/api";
import { Input } from "~/component/Input";
import { faceStylesData } from "~/data/faceStylesData"; // YOU NEED TO CREATE THIS FILE
import { useSession, signIn } from "next-auth/react";
import { AiOutlineLeft, AiOutlineRight, AiOutlineCloudUpload, AiOutlineUserSwitch } from "react-icons/ai";
import Link from "next/link";
import clsx from "clsx";
import imageCompression from 'browser-image-compression';
import { SharePopup } from "~/component/SharePopup"
import router from "next/router";
import { FaShareAlt } from "react-icons/fa";

// Type definitions for Face Styles
interface FaceStyleItem {
  src: string;
  basePrompt: string;
}
interface FaceStyleSubCategory {
  [subcategoryName: string]: FaceStyleItem[];
}
interface FaceStyleCategory {
  [categoryName: string]: FaceStyleSubCategory;
}

type FaceAIModel = "flux-kontext-pro" | "flux-kontext-max";
type FaceAspectRatio = "1:1"; // Fixed for face logos

const typedFaceStylesData: FaceStyleCategory = faceStylesData as FaceStyleCategory;

const FaceLogoGeneratorPage: NextPage = () => {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  const [inputText, setInputText] = useState<string>("");
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  const [activeStyleTab, setActiveStyleTab] = useState<string>("");
  const [activeStyleSubTab, setActiveStyleSubTab] = useState<string>("");
  const [selectedStyleBasePrompt, setSelectedStyleBasePrompt] = useState<string>("");
  const [selectedStyleImagePreview, setSelectedStyleImagePreview] = useState<string | null>(null);

  const [showSharePopupFor, setShowSharePopupFor] = useState<string | null>(null);
  const [currentPromptForShare, setCurrentPromptForShare] = useState<string>("");

  const [selectedModel, setSelectedModel] = useState<FaceAIModel>("flux-kontext-pro");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<FaceAspectRatio>("1:1");
  const [error, setError] = useState<string>("");
  const [imagesUrl, setImagesUrl] = useState<{ imageUrl: string }[]>([]);
  const [popupImage, setPopupImage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const styleCategoryScrollRef = useRef<HTMLDivElement>(null);
  const styleSubCategoryScrollRef = useRef<HTMLDivElement>(null);

  const [showLeftStyleCategoryArrow, setShowLeftStyleCategoryArrow] = useState<boolean>(false);
  const [showRightStyleCategoryArrow, setShowRightStyleCategoryArrow] = useState<boolean>(false);
  const [showLeftStyleSubCategoryArrow, setShowLeftStyleSubCategoryArrow] = useState<boolean>(false);
  const [showRightStyleSubCategoryArrow, setShowRightStyleSubCategoryArrow] = useState<boolean>(false);

  const modelOptions: { name: string; value: FaceAIModel; cost: number; desc: string; recommended?: boolean }[] = [
    { name: "Pro Face Engine", value: "flux-kontext-pro", cost: 6, desc: "High-quality face stylization with good detail.", recommended: true },
    { name: "Max Face Engine", value: "flux-kontext-max", cost: 12, desc: "Ultimate detail & realism for face features, best for complex styles." },
  ];

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => { // 2. Make it async
  const file = event.target.files?.[0];
  if (file) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Invalid file type. Please upload JPG, PNG, or WebP."); // Corrected message
      setUploadedImageFile(null); setUploadedImagePreview(null);
      return;
    }

    console.log(`Original file size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);

    // Image Compression Options
    const options = {
      maxSizeMB: 1,          // Target compressed size (e.g., 1MB) - Replicate might still upscale
      maxWidthOrHeight: 1024, // Resize to this dimension while maintaining aspect ratio
      useWebWorker: true,       // Use web workers for performance
      // initialQuality: 0.7   // Optional: for JPG/WebP if you want to control initial quality before maxSizeMB kicks in
    };

    try {
      console.log("Compressing image...");
      const compressedFile = await imageCompression(file, options); // 3. Await compression
      console.log(`Compressed file size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

      // Even after compression, if you have a server limit set by Next.js body parser (e.g. 5MB),
      // ensure the *base64 version* of compressedFile won't exceed it.
      // Base64 is roughly 1.33 * binary size. So 3MB binary -> 4MB base64.
      // A 5MB server limit means your compressed binary should be around < 3.7MB.
      // The check below is against the SERVER's limit for the *base64 encoded payload*
      // (assuming other JSON data is small). This check is a bit rough as it's on binary size.
      const estimatedBase64SizeMB = (compressedFile.size * 1.33) / 1024 / 1024;
      const serverLimitMB = 5; // Example if your server limit is 5MB for the *whole* request
      
      if (estimatedBase64SizeMB > serverLimitMB) {
         setError(`Image is still too large after compression (approx. ${estimatedBase64SizeMB.toFixed(2)}MB base64). Server limit is ${serverLimitMB}MB.`);
         setUploadedImageFile(null); setUploadedImagePreview(null);
         return;
      }
      if (compressedFile.size > 5 * 1024 * 1024 && serverLimitMB < 7) { // A simpler check on binary if you allow say, 5MB binary uploads.
         // This check is now a bit redundant if the above estimatedBase64Size check is robust
         // setError("Image file is too large for server processing even after compression (max 5MB binary).");
         // return;
      }


      setUploadedImageFile(compressedFile); // Store the COMPRESSED file
      setUploadedImagePreview(URL.createObjectURL(compressedFile)); // Preview the COMPRESSED file
      setError("");
    } catch (compressionError) {
      console.error("Error during image compression:", compressionError);
      setError("Could not process image. Please try another one or a smaller image.");
      setUploadedImageFile(null); setUploadedImagePreview(null);
    }
  }
};

const handleOpenSharePopup = (imageUrl: string, promptOrName?: string | null) => {
  setCurrentPromptForShare(promptOrName || "my awesome gaming logo"); // Set a default if no prompt/name
  setShowSharePopupFor(imageUrl);
};

  const handleScroll = (
    ref: React.RefObject<HTMLDivElement>,
    setLeft: React.Dispatch<React.SetStateAction<boolean>>,
    setRight: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!ref.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    setLeft(scrollLeft > 5); // Show arrow if scrolled more than 5px
    setRight(scrollLeft + clientWidth < scrollWidth - 5); // Show arrow if not at the end
  };

  const handleFaceStyleSelect = useCallback((basePrompt: string, stylePreviewSrc: string) => {
    setSelectedStyleBasePrompt(basePrompt);
    setSelectedStyleImagePreview(stylePreviewSrc);
    setError("");
  }, []);

  useEffect(() => {
    const categoryKeys = Object.keys(typedFaceStylesData);
    if (categoryKeys.length > 0 && categoryKeys[0]) setActiveStyleTab(categoryKeys[0]);
  }, []);

  useEffect(() => {
    if (!activeStyleTab || !typedFaceStylesData.hasOwnProperty(activeStyleTab)) {
      setActiveStyleSubTab(""); setSelectedStyleBasePrompt(""); setSelectedStyleImagePreview(null); return;
    }
    const subcategories = typedFaceStylesData[activeStyleTab];
    if (subcategories && typeof subcategories === 'object') {
      const subKeys = Object.keys(subcategories);
      if (subKeys.length > 0 && subKeys[0]) setActiveStyleSubTab(subKeys[0]);
      else { setActiveStyleSubTab(""); setSelectedStyleBasePrompt(""); setSelectedStyleImagePreview(null); }
    } else { setActiveStyleSubTab(""); setSelectedStyleBasePrompt(""); setSelectedStyleImagePreview(null); }
  }, [activeStyleTab]);

  useEffect(() => {
    if (!activeStyleTab || !activeStyleSubTab) { setSelectedStyleBasePrompt(""); setSelectedStyleImagePreview(null); return; }
    const categoryData = typedFaceStylesData[activeStyleTab];
    if (!categoryData || !categoryData[activeStyleSubTab]) { setSelectedStyleBasePrompt(""); setSelectedStyleImagePreview(null); return; }
    const stylesArray = categoryData[activeStyleSubTab];
    if (stylesArray && stylesArray.length > 0 && stylesArray[0]) {
      const firstStyle = stylesArray[0];
      if (firstStyle?.src && firstStyle.basePrompt) handleFaceStyleSelect(firstStyle.basePrompt, firstStyle.src);
      else { setSelectedStyleBasePrompt(""); setSelectedStyleImagePreview(null); }
    } else { setSelectedStyleBasePrompt(""); setSelectedStyleImagePreview(null); }
  }, [activeStyleTab, activeStyleSubTab, handleFaceStyleSelect]);
  
  useLayoutEffect(() => {
    const handleScroll = (ref: React.RefObject<HTMLDivElement>, setLeft: React.Dispatch<React.SetStateAction<boolean>>, setRight: React.Dispatch<React.SetStateAction<boolean>>) => {
        if (!ref.current) return; const { scrollLeft, scrollWidth, clientWidth } = ref.current;
        setLeft(scrollLeft > 5); setRight(scrollLeft + clientWidth < scrollWidth - 5);
    };
    handleScroll(styleCategoryScrollRef, setShowLeftStyleCategoryArrow, setShowRightStyleCategoryArrow);
    handleScroll(styleSubCategoryScrollRef, setShowLeftStyleSubCategoryArrow, setShowRightStyleSubCategoryArrow);
  }, [activeStyleTab, activeStyleSubTab]);

  const scrollStyleCategories = (direction: "left" | "right") => styleCategoryScrollRef.current?.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
  const scrollStyleSubCategories = (direction: "left" | "right") => styleSubCategoryScrollRef.current?.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });

    const { mutate: triggerGenerateFaceLogo, isLoading: isGenerating } = api.faceLogo.generateFaceLogo.useMutation({
    onSuccess(data) {
      console.log("CLIENT: onSuccess called", data); // LOG A
      setImagesUrl(data);
      setError("");
      document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    onError(error) {
      console.error("CLIENT: onError called. Full Error:", error); // LOG B
      console.error("CLIENT: onError - error.message:", error.message);
      console.error("CLIENT: onError - error.data?.code:", error.data?.code);

      if (error.data?.code === 'BAD_REQUEST' && error.message.toLowerCase().includes("enough gaming credits")) {
        console.log("CLIENT: onError - Setting INSUFFICIENT_CREDITS");
        setError("INSUFFICIENT_CREDITS");
      } else {
        console.log("CLIENT: onError - Setting generic error message:", error.message);
        setError(error.message || "Failed to generate your face logo. Please try again.");
      }
    },
    onSettled(data, error) { // LOG C
        console.log("CLIENT: onSettled called.");
        console.log("CLIENT: onSettled - data:", data);
        console.log("CLIENT: onSettled - error:", error);
        // isGenerating should be false here automatically
        console.log("CLIENT: onSettled - isGenerating state after call:", isGeneratingRef.current); // Use a ref to see the latest state
    }
  });

  // To see the actual value of isGenerating in onSettled (because state updates might not reflect immediately)
  const isGeneratingRef = useRef(isGenerating);
  useEffect(() => {
    isGeneratingRef.current = isGenerating;
  }, [isGenerating]);

  // eslint-disable-next-line @typescript-eslint/require-await
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(""); setImagesUrl([]);
    console.log("CLIENT: handleFormSubmit initiated."); // LOG 1
    if (!isLoggedIn) { void signIn("google"); return; }
    if (!uploadedImageFile) { setError("Please upload a photo of your face."); return; }
    if (!selectedStyleBasePrompt) { setError("Please select an artistic style for your face logo."); return;}
    
    console.log("CLIENT: All initial checks passed. Setting up FileReader."); // LOG 2

    const reader = new FileReader();
    reader.readAsDataURL(uploadedImageFile); // This is asynchronous

    reader.onloadend = () => { // This callback executes when readAsDataURL is complete
      console.log("CLIENT: FileReader onloadend."); // LOG 3
      const base64Image = reader.result as string;
      let finalPrompt = selectedStyleBasePrompt.replace(/('Text'|"Text"|`Text`|\[Text\])/gi, inputText.trim() || " ");
      if(selectedModel === "flux-kontext-max") finalPrompt += `, ultra detailed face, cinematic lighting, sharp focus on face, masterpiece`;
      else finalPrompt += `, detailed face, good lighting, professional logo`;

      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({ /* ... */ });
      }
      
      console.log("CLIENT: About to call triggerGenerateFaceLogo with prompt:", finalPrompt.substring(0,100) + "...", "model:", selectedModel); // LOG 4
      triggerGenerateFaceLogo({ // This is api.faceLogo.generateFaceLogo.mutate effectively
        prompt: finalPrompt, inputImageBase64: base64Image,
        model: selectedModel, aspectRatio: selectedAspectRatio,
      });
      console.log("CLIENT: triggerGenerateFaceLogo call initiated."); // LOG 5
    };

    reader.onerror = () => { // This callback executes if readAsDataURL fails
      console.error("CLIENT: FileReader onerror."); // LOG 6
      setError("Failed to read image file."); 
      console.error("Error reading image file:", reader.error); 
    };
  };

  const handleDownload = async (imageUrl: string) => {
    setIsDownloading(imageUrl);
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
            const safeName = (inputText.trim() || "face-logo").replace(/[^a-z0-9_]+/gi, '_');
            link.download = `${safeName}_${selectedModel}_gaminglogoai.png`;
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            } else { console.error("Failed to create PNG blob for download."); alert("Sorry, could not prepare download.");}
        }
    } catch (dlError) { console.error("Error downloading the image:", dlError); alert("Could not download image. Please try again."); }
    finally { setIsDownloading(null); }
  };

  const openPopup = (imageUrl: string) => setPopupImage(imageUrl);
  const closePopup = () => setPopupImage(null);

  return (
    <>
      <Head>
        <title>AI Face Logo Generator - Photo to Gaming Logo | GamingLogoAI</title>
        <meta name="description" content="Turn your photo into an epic AI-generated gaming logo! Upload your face, add text, select an art style, and create a unique avatar or team logo with GamingLogoAI." />
        <meta name="keywords" content="ai face logo, photo to logo, image to image generator, gaming avatar maker, custom streamer avatar, ai portrait logo, flux kontext pro, flux kontext max" />
        <link rel="canonical" href="https://gaminglogoai.com/face-logo-generator" /> {/* ** REPLACE with actual domain ** */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto max-w-screen-lg mb-24 flex flex-col px-4 sm:px-8 py-8 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900">
        <header className="text-center mb-10">
          <Image src="/face-logo-image.webp" alt="Gaming Logo AI Banner - Create stunning gaming logos with AI" width={800} height={200} className="mx-auto mb-4 rounded-lg shadow-lg" priority unoptimized={true}/>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-3">
            AI Face Logo Generator
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Transform your photo into a unique gaming logo or avatar. Upload your face, add your gamer tag, pick a style, and let our AI create something legendary!
          </p>
        </header>

        <div className="mb-12 p-6 border border-purple-500/30 dark:border-cyan-500/30 rounded-xl bg-slate-50 dark:bg-slate-800/70 text-sm leading-relaxed shadow-lg backdrop-blur-sm">
          <h2 className="text-2xl font-semibold mb-3 text-purple-700 dark:text-cyan-400">Get Started:</h2>
          <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
            <li><strong className="text-slate-800 dark:text-slate-100">Upload Your Best Face Photo:</strong> Clear, well-lit, front-facing photos yield the best results.</li>
            <li><strong className="text-slate-800 dark:text-slate-100">Add Your Gamer Tag (Optional):</strong> This text will be artfully integrated.</li>
            <li><strong className="text-slate-800 dark:text-slate-100">Pick an Art Style:</strong> Choose a theme to transform your photo (e.g., Cartoon, Anime, Vector).</li>
            <li><strong className="text-slate-800 dark:text-slate-100">Select Quality Engine:</strong> &quot;Pro&quot; for great quality, &quot;Max&quot; for ultimate detail.</li>
            <li><strong className="text-slate-800 dark:text-slate-100">Generate!</strong> Watch your face become a unique gaming logo.</li>
          </ol>
        </div>

        <form className="flex flex-col gap-10" onSubmit={(e) => { void handleFormSubmit(e); }}>
          {/* 1. Image Upload */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-white flex items-center">
              <span className="bg-purple-600 dark:bg-cyan-500 text-white dark:text-slate-900 rounded-full h-7 w-7 text-sm flex items-center justify-center mr-3">1</span>
              Upload Your Face Photo
            </h2>
            <FormGroup> {/* Removed mb-0, form has gap-10 */}
              <label htmlFor="face-image-upload" className={clsx( "mt-1 flex justify-center items-center w-full h-52 sm:h-64 px-6 pt-5 pb-6 border-2 rounded-xl cursor-pointer transition-colors", "border-dashed border-slate-400 dark:border-slate-600", "hover:border-purple-500 dark:hover:border-cyan-500", "bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800" )}>
                <div className="space-y-1 text-center">
                  {uploadedImagePreview ? ( <Image src={uploadedImagePreview} alt="Your uploaded photo preview" width={128} height={128} className="mx-auto h-32 w-32 sm:h-40 sm:w-40 rounded-lg object-cover shadow-md" /> ) : ( <AiOutlineCloudUpload className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" /> )}
                  <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                    <span className="relative rounded-md font-medium text-purple-600 dark:text-cyan-400 hover:text-purple-700 dark:hover:text-cyan-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500 dark:focus-within:ring-cyan-500">
                      <span>{uploadedImageFile ? "Change photo" : "Upload a file"}</span>
<input
  id="face-image-upload"
  name="face-image-upload"
  type="file"
  className="sr-only"
  ref={fileInputRef}
  onChange={(event) => { // Inline arrow function
    void handleImageUpload(event); // handleImageUpload is your async function
  }}
  accept="image/png, image/jpeg, image/webp"
/>                    </span>
                    {!uploadedImageFile && <p className="pl-1">or drag and drop</p>}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500">PNG, JPG, WEBP up to 5MB.</p>
                </div>
              </label>
              {uploadedImageFile && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Selected: {uploadedImageFile.name}</p>}
            </FormGroup>
          </section>

          {/* 2. Text Input */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-white flex items-center">
              <span className="bg-purple-600 dark:bg-cyan-500 text-white dark:text-slate-900 rounded-full h-7 w-7 text-sm flex items-center justify-center mr-3">2</span>
              Add Text to Your Logo (Optional)
            </h2>
            <FormGroup className="mb-0">
              <Input value={inputText} onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g., Your Gamer Tag"
                className="w-full p-3 text-base border-2 border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-purple-500 dark:focus:ring-cyan-500 focus:border-transparent shadow-sm"
                aria-label="Text to include in the logo" />
            </FormGroup>
          </section>

          {/* 3. CHOOSE YOUR ART STYLE */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-white flex items-center">
                <span className="bg-purple-600 dark:bg-cyan-500 text-white dark:text-slate-900 rounded-full h-7 w-7 text-sm flex items-center justify-center mr-3">3</span>
                Pick an Art Style
            </h2>
            <div className="relative mb-4 flex items-center">
              {showLeftStyleCategoryArrow && ( <button type="button" onClick={() => scrollStyleCategories("left")} className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 shadow-md border border-slate-300 dark:border-slate-600" aria-label="Scroll Style Categories Left"><AiOutlineLeft size={18} /></button> )}
              <div ref={styleCategoryScrollRef} onScroll={() => handleScroll(styleCategoryScrollRef, setShowLeftStyleCategoryArrow, setShowRightStyleCategoryArrow)} className="flex overflow-x-auto whitespace-nowrap no-scrollbar space-x-2 sm:space-x-3 py-2 flex-1 mx-3">
                {Object.keys(typedFaceStylesData).map((catKey) => ( <button key={catKey} type="button" onClick={() => setActiveStyleTab(catKey)} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 text-sm shadow-sm hover:shadow-md ${activeStyleTab === catKey ? "bg-purple-600 dark:bg-cyan-500 text-white dark:text-slate-900 scale-105" : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600"}`}>{catKey}</button>))}
              </div>
              {showRightStyleCategoryArrow && ( <button type="button" onClick={() => scrollStyleCategories("right")} className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 shadow-md border border-slate-300 dark:border-slate-600" aria-label="Scroll Style Categories Right"><AiOutlineRight size={18} /></button> )}
            </div>
            {activeStyleTab && typedFaceStylesData[activeStyleTab] && Object.keys(typedFaceStylesData[activeStyleTab]!).length > 0 && (
                <div className="relative mb-6 flex items-center">
                {showLeftStyleSubCategoryArrow && ( <button type="button" onClick={() => scrollStyleSubCategories("left")} className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-300 dark:border-slate-600" aria-label="Scroll Style Subcategories Left"><AiOutlineLeft size={16} /></button> )}
                <div ref={styleSubCategoryScrollRef} onScroll={() => handleScroll(styleSubCategoryScrollRef, setShowLeftStyleSubCategoryArrow, setShowRightStyleSubCategoryArrow)} className="flex overflow-x-auto whitespace-nowrap no-scrollbar space-x-2 sm:space-x-3 py-2 flex-1 mx-3">
                    {Object.keys(typedFaceStylesData[activeStyleTab]!).map((subKey) => ( <button key={subKey} type="button" onClick={() => setActiveStyleSubTab(subKey)} className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm hover:shadow ${activeStyleSubTab === subKey ? "bg-purple-500 dark:bg-cyan-400 text-white dark:text-slate-900 scale-105" : "bg-white dark:bg-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-500"}`}>{subKey}</button>))}
                </div>
                {showRightStyleSubCategoryArrow && ( <button type="button" onClick={() => scrollStyleSubCategories("right")} className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-300 dark:border-slate-600" aria-label="Scroll Style Subcategories Right"><AiOutlineRight size={16} /></button> )}
                </div>
            )}
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
              {(typedFaceStylesData[activeStyleTab]?.[activeStyleSubTab] ?? []).map((item, idx) => {
                if (!item || !item.src || !item.basePrompt) { return <div key={`error-style-${idx}`} className="aspect-square bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-700 dark:text-red-300 rounded-lg text-xs p-2">Style Data Error</div>;}
                const displayImagePath = item.src;
                return (
                  <div key={`${activeStyleTab}-${activeStyleSubTab}-${item.src}-${idx}`}
                    className={clsx(`relative rounded-xl shadow-md hover:shadow-xl dark:bg-slate-700/50 transition-all duration-300 cursor-pointer aspect-square overflow-hidden group border-2`,
                                selectedStyleImagePreview === item.src ? "border-purple-500 dark:border-cyan-500 scale-105" : "border-transparent hover:border-purple-300 dark:hover:border-cyan-300")}
                    onClick={() => handleFaceStyleSelect(item.basePrompt, item.src)}
                    title={`Select style: ${(item.basePrompt || "Face art style").substring(0, 50)}...`} >
                    <Image src={displayImagePath} alt={`Art style preview: ${(item.basePrompt || "Face art style").substring(0, 40)}...`}
                      fill style={{ objectFit: "cover" }} className="transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder-style.png"; }} />
                  </div> );
              })}
            </div>
          </section>

          {/* 4. AI Engine / Quality */}
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-white flex items-center">
                <span className="bg-purple-600 dark:bg-cyan-500 text-white dark:text-slate-900 rounded-full h-7 w-7 text-sm flex items-center justify-center mr-3">4</span>
                Choose Quality Engine
            </h2>
            <FormGroup className="mb-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {modelOptions.map((model) => (
                  <button key={model.value} type="button" onClick={() => setSelectedModel(model.value)}
                    className={clsx(`flex flex-col items-start justify-between border-2 rounded-xl p-4 transition-all duration-200 min-h-[100px] sm:min-h-[120px] h-full text-left text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800/70 group shadow-sm hover:shadow-lg`,
                      selectedModel === model.value ? "border-purple-500 dark:border-cyan-500 ring-2 ring-purple-500 dark:ring-cyan-400 scale-105 shadow-xl" : "border-slate-300 dark:border-slate-700 hover:border-purple-400 dark:hover:border-cyan-400" )}>
                    <div className="w-full">
                      <span className="font-semibold text-lg block">{model.name}</span>
                      {model.recommended && ( <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-medium shadow inline-block my-1">Recommended</span> )}
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-2 grow min-h-[2em]">{model.desc}</p>
                    </div>
                    <span className="text-sm font-medium text-purple-700 dark:text-cyan-400 self-start mt-auto pt-1">
                      Cost: {model.cost} Credit{model.cost > 1 ? 's' : ''}
                    </span>
                  </button>
                ))}
              </div>
            </FormGroup>
          </section>
          
          {/* Aspect Ratio is fixed to 1:1 for this generator, so no selection UI here */}

          {/* Error Display */}
          {error && (
            <div className={`my-6 p-4 border-l-4 rounded-md shadow-md ${error === "INSUFFICIENT_CREDITS" ? "bg-yellow-50 border-yellow-500 dark:bg-yellow-900/30 dark:border-yellow-600" : "bg-red-50 border-red-500 dark:bg-red-900/30 dark:border-red-600"}`}>
              <div className="flex"> <div className="flex-shrink-0"> {error === "INSUFFICIENT_CREDITS" ? ( <svg className="h-5 w-5 text-yellow-500 dark:text-yellow-400" /* ...warning icon... */ ></svg> ) : ( <svg className="h-5 w-5 text-red-500 dark:text-red-400" /* ...error icon... */ ></svg> )} </div>
                <div className="ml-3"> <h3 className={`text-sm font-medium ${error === "INSUFFICIENT_CREDITS" ? "text-yellow-800 dark:text-yellow-300" : "text-red-800 dark:text-red-300"}`}>{error === "INSUFFICIENT_CREDITS" ? "Not Enough Credits" : "Generation Failed"}</h3>
                  <div className={`mt-2 text-sm ${error === "INSUFFICIENT_CREDITS" ? "text-yellow-700 dark:text-yellow-200" : "text-red-700 dark:text-red-200"}`}>
                    <p>{error === "INSUFFICIENT_CREDITS" ? "You don't have enough gaming credits to perform this action." : error}</p>
                    {error === "INSUFFICIENT_CREDITS" && ( <p className="mt-1"><Link id="facelogo-not-enough-credits-alert-btn" href="/buy-credits" className="font-medium underline text-yellow-700 hover:text-yellow-600 dark:text-yellow-200 dark:hover:text-yellow-100">Please purchase more credits to continue.</Link></p> )}
                  </div></div></div></div>
          )}

          {/* Submit Button */}
          <div className="mt-6">
            <Button type="submit" isLoading={isGenerating} disabled={isGenerating || !uploadedImageFile || !selectedStyleBasePrompt}
              className={`w-full text-lg font-semibold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isLoggedIn ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white dark:from-cyan-500 dark:to-blue-500 dark:hover:from-cyan-600 dark:hover:to-blue-600 dark:text-slate-900 focus:ring-purple-500 dark:focus:ring-cyan-400' : 'bg-slate-500 text-slate-100 cursor-not-allowed' } disabled:opacity-70 disabled:cursor-not-allowed`}>
              {isLoggedIn ? (isGenerating ? "Transforming Your Face..." : "Generate My Face Logo!") : "Sign In to Generate"}
            </Button>
            {!isLoggedIn && <p className="text-center text-xs mt-2 text-slate-500 dark:text-slate-400">Sign in to create your unique face logo!</p>}
          </div>
        </form>

        {/* Generated Images Section */}
        {imagesUrl.length > 0 && (
          <section id="results-section" className="mt-12">
            <h2 className="text-3xl font-semibold mb-6 text-center text-slate-900 dark:text-white">Your AI Face Logos!</h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {imagesUrl.map(({ imageUrl }, index) => (
                <div key={imageUrl} className="relative group rounded-xl shadow-lg hover:shadow-2xl dark:bg-slate-800/70 transition-all duration-300 aspect-square overflow-hidden border-2 border-transparent hover:border-purple-500 dark:hover:border-cyan-500">
                  <Image src={imageUrl} alt={`Generated face logo ${index + 1} ${inputText ? 'for ' + inputText : ''}`} fill style={{ objectFit: "cover" }} className="transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" priority={index < 2} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-3 space-y-2">
                    <div className="flex gap-2">
                        <button type="button" onClick={() => openPopup(imageUrl)} className="p-2.5 rounded-full bg-slate-100/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 shadow-md transition-colors" title="View Fullscreen" aria-label="View Fullscreen">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V4a1 1 0 00-1-1H4zm10 0a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V4a1 1 0 00-1-1h-4zM4 11a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1H4zm10 0a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1h-4z" clipRule="evenodd" /></svg>
                        </button>
                        <button type="button" onClick={() => void handleDownload(imageUrl)} className="p-2.5 rounded-full bg-slate-100/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 shadow-md transition-colors" title="Download Logo" aria-label="Download Logo" disabled={isDownloading === imageUrl}>
                           {isDownloading === imageUrl ? <div className="w-5 h-5 border-2 border-t-transparent border-current rounded-full animate-spin"></div> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>}
                        </button>
                        <button
                        type="button"
                        onClick={() => handleOpenSharePopup(imageUrl, "this awesome logo")} // Use icon.imageUrl and icon.prompt
                        className="p-2 sm:p-2.5 rounded-full bg-slate-100/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 shadow-md transition-colors disabled:opacity-50"
                        title="Share Logo"
                        aria-label="Share Logo"
                      >
                        <FaShareAlt className="h-4 w-4 sm:h-5 sm:w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Popup Modal */}
        {popupImage && (
          <div className="fixed inset-0 z-[100] bg-black bg-opacity-80 flex items-center justify-center p-4 backdrop-blur-sm" onClick={closePopup}>
            <div className="relative bg-slate-100 dark:bg-slate-800 p-2 rounded-lg shadow-2xl max-w-3xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={closePopup} className="absolute -top-4 -right-4 z-[110] bg-purple-600 dark:bg-cyan-500 text-white rounded-full p-1.5 hover:opacity-80 focus:outline-none shadow-md" title="Close Fullscreen" aria-label="Close Fullscreen">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <Image src={popupImage} alt="Fullscreen generated gaming face logo" width={1024} height={1024} style={{ objectFit: 'contain', width: 'auto', height: 'auto', maxHeight: '85vh', maxWidth: 'calc(100vw - 4rem)' }} className="rounded-md" unoptimized={true}/>
            </div>
          </div>
        )}
        {showSharePopupFor && router.isReady && ( // Add router.isReady if generatorUrl depends on it
        <SharePopup
                imageUrl={showSharePopupFor}
                imageAlt={`Shareable gaming logo ${currentPromptForShare ? 'for ' + currentPromptForShare : ''}`}
                defaultText={`Check out this logo I made ${currentPromptForShare ? `for "${currentPromptForShare.substring(0,50)}..."` : ''} with GamingLogoAI!`}
                siteUrl="https://gaminglogoai.com" // ** REPLACE **
                // For collection, the original generator might not be easily known,
                // so link to the main gaming logo maker or homepage.
                generatorUrl={"/gaming-logo-maker"} 
                onClose={() => setShowSharePopupFor(null)}
            />
        )}
      </main>
    </>
  );
};

export default FaceLogoGeneratorPage;