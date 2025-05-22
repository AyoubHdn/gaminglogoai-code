// src/pages/collection.tsx (for GamingLogoAI)
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { api } from "~/utils/api"; // Ensure this uses GamingLogoAI's API endpoint if different
import { useSession } from "next-auth/react"; // To check if user is logged in
import Link from "next/link"; // For a CTA if no icons
import { env } from "~/env.mjs"; // To get S3 bucket name if needed, or construct URL server-side

const CollectionPage: NextPage = () => {
  const { data: session, status } = useSession();
  // The tRPC query should ideally be user-specific.
  // If your `getIcons` query is already protected and fetches for the logged-in user, this is good.
  // If the Icon model has a `brand` field, ensure your query filters for "gaminglogoai" brand icons.
  const iconsQuery = api.icons.getIcons.useQuery(undefined, {
    enabled: status === "authenticated", // Only run query if authenticated
  });
  const s3BucketName = env.NEXT_PUBLIC_S3_BUCKET_NAME_GAMING;
  const awsRegion = env.NEXT_PUBLIC_AWS_REGION_GAMING || "us-east-1";

  const [popupImage, setPopupImage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null); // Track download state per image

  const s3BucketUrl = `https://${s3BucketName}.s3.${awsRegion}.amazonaws.com`;

  const openPopup = (iconId: string) => {
    setPopupImage(`${s3BucketUrl}/${iconId}`);
  };

  const closePopup = () => {
    setPopupImage(null);
  };

  const handleDownload = async (iconId: string, prompt?: string | null) => {
    setIsDownloading(iconId);
    try {
      const imageUrl = `${s3BucketUrl}/${iconId}`;
      const response = await fetch(imageUrl, { mode: "cors" }); // S3 needs CORS configured for this
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} for ${imageUrl}`);
      }

      const blob = await response.blob();
      const imageBitmap = await createImageBitmap(blob);
      const canvas = document.createElement("canvas");
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Fill with white background before drawing WebP if it might have transparency
        // and you want a non-transparent PNG. Otherwise, skip this for transparent PNGs.
        // ctx.fillStyle = '#FFFFFF';
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imageBitmap, 0, 0);
      }

      const pngBlob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((blob) => resolve(blob), "image/png", 1.0) // Quality 1.0 for PNG
      );

      if (pngBlob) {
        const blobUrl = window.URL.createObjectURL(pngBlob);
        const link = document.createElement("a");
        link.href = blobUrl;
        // Create a more descriptive filename from the prompt if available
        const safePrompt = prompt ? prompt.replace(/[^a-z0-9_]+/gi, '_').substring(0, 50) : "gaming-logo";
        link.download = `${safePrompt}_gaminglogoai.png`;
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } else {
        console.error("Failed to create PNG blob for download.");
        alert("Sorry, there was an issue preparing your download.");
      }
    } catch (error) {
      console.error("Error downloading the image:", error);
      alert("Could not download the image. Please check your connection or S3 CORS settings.");
    } finally {
      setIsDownloading(null);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-slate-900">
        <p className="text-xl text-slate-700 dark:text-slate-300">Loading your collection...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-slate-900 px-4 text-center">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Access Your Logos</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Please sign in to view your generated gaming logos.
        </p>
        <Link href="/api/auth/signin" className="px-6 py-3 font-semibold rounded-lg transition-all duration-300 ease-in-out
                        bg-purple-600 hover:bg-purple-700 text-white
                        dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-slate-900">
            Sign In
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Gaming Logos | Your Collection - Gaming Logo AI</title>
        <meta
          name="description"
          content="Access and manage all your AI-generated gaming logos. View, download, and organize your unique designs created with Gaming Logo AI."
        />
        <meta name="keywords" content="my gaming logos, logo collection, generated logos, ai esports logo, saved designs, gaming branding" />
        <link rel="canonical" href="https://www.gaminglogoai.com/collection" /> {/* Replace with actual domain */}
        <link rel="icon" href="/favicon-gaming.ico" />
      </Head>
      {/* Dark mode: bg-slate-900, Light mode: bg-gray-100 */}
      <main className="flex min-h-screen mt-16 sm:mt-24 flex-col container mx-auto gap-8 px-4 sm:px-8 py-8 bg-gray-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">My Gaming Logo Collection</h1>

        {iconsQuery.isLoading && <p className="text-center text-lg">Loading your masterpieces...</p>}
        {iconsQuery.isError && <p className="text-center text-lg text-red-500">Could not load your logos. Please try again.</p>}

        {iconsQuery.data && iconsQuery.data.length === 0 && (
          <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <p className="text-xl text-slate-700 dark:text-slate-300 mb-4">Your gallery is empty!</p>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Time to design some epic gaming logos.</p>
            <Link href="/gaming-logo-maker" className="px-6 py-3 font-semibold rounded-lg transition-all duration-300 ease-in-out
                            bg-purple-600 hover:bg-purple-700 text-white
                            dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-slate-900">
                Create Your First Logo
            </Link>
          </div>
        )}

        {iconsQuery.data && iconsQuery.data.length > 0 && (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {iconsQuery.data.map((icon) => (
              <li key={icon.id} className="relative group bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden aspect-square">
                <Image
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  width={512} // Keep for aspect ratio hint, actual display controlled by CSS
                  height={512}
                  alt={icon.prompt ?? `AI generated gaming logo ${icon.id}`}
                  src={`${s3BucketUrl}/${icon.id}`}
                  priority={false} // Set to true for first few images if you want them to load faster
                />
                {/* Overlay for buttons, appears on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <button
                    onClick={() => openPopup(icon.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300
                               bg-slate-700 text-white p-3 rounded-full hover:bg-purple-600 dark:hover:bg-cyan-500 focus:outline-none shadow-lg"
                    title="View Fullscreen"
                    aria-label="View Fullscreen"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V4a1 1 0 00-1-1H4zm10 0a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V4a1 1 0 00-1-1h-4zM4 11a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1H4zm10 0a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1h-4z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      void handleDownload(icon.id, icon.prompt);
                    }}
                    disabled={isDownloading === icon.id}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300
                               bg-slate-700 text-white p-3 rounded-full hover:bg-purple-600 dark:hover:bg-cyan-500 focus:outline-none shadow-lg
                               ${isDownloading === icon.id ? 'cursor-not-allowed animate-pulse' : ''}`}
                    title="Download Logo"
                    aria-label="Download Logo"
                  >
                    {isDownloading === icon.id ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {popupImage && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
            <div className="relative bg-white dark:bg-slate-800 p-2 rounded-lg shadow-2xl">
              <button
                onClick={closePopup}
                className="absolute -top-4 -right-4 bg-purple-600 dark:bg-cyan-500 text-white rounded-full p-2 hover:opacity-80 focus:outline-none z-10 shadow-md"
                title="Close Fullscreen"
                aria-label="Close Fullscreen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <Image // Using Next/Image for optimized loading in popup too
                src={popupImage}
                alt="Fullscreen gaming logo view"
                width={1024} // Set a reasonable max width for popup
                height={1024}// Set a reasonable max height for popup
                style={{ objectFit: 'contain', maxWidth: '90vw', maxHeight: '90vh' }}
                className="rounded-md"
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default CollectionPage;