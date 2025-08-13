// src/pages/collection.tsx (for GamingLogoAI)
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { api } from "~/utils/api"; // Ensure this uses GamingLogoAI's API endpoint if different
import { useSession } from "next-auth/react"; // To check if user is logged in
import Link from "next/link"; // For a CTA if no icons
import { env } from "~/env.mjs"; // To get S3 bucket name if needed, or construct URL server-side
import { SharePopup } from "~/component/SharePopup";
import router, { useRouter } from "next/router";
import { FaShareAlt } from "react-icons/fa";

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

  const [showSharePopupFor, setShowSharePopupFor] = useState<string | null>(
    null
  );
  const [currentPromptForShare, setCurrentPromptForShare] =
    useState<string>("");
  const router = useRouter();

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
        throw new Error(
          `HTTP error! status: ${response.status} for ${imageUrl}`
        );
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

      const pngBlob = await new Promise<Blob | null>(
        (resolve) => canvas.toBlob((blob) => resolve(blob), "image/png", 1.0) // Quality 1.0 for PNG
      );

      if (pngBlob) {
        const blobUrl = window.URL.createObjectURL(pngBlob);
        const link = document.createElement("a");
        link.href = blobUrl;
        // Create a more descriptive filename from the prompt if available
        const safePrompt = prompt
          ? prompt.replace(/[^a-z0-9_]+/gi, "_").substring(0, 50)
          : "gaming-logo";
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
      alert(
        "Could not download the image. Please check your connection or S3 CORS settings."
      );
    } finally {
      setIsDownloading(null);
    }
  };

  const handleOpenSharePopup = (
    fullImageUrlToShare: string,
    promptText?: string | null
  ) => {
    console.log("CollectionPage: handleOpenSharePopup called with:", {
      fullImageUrlToShare,
      promptText,
    });
    // router.isReady check removed for now, assuming generatorUrl in SharePopup for collection page can be static
    setCurrentPromptForShare(promptText || "my awesome gaming logo");
    setShowSharePopupFor(fullImageUrlToShare); // This now receives the full URL
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-slate-900">
        <p className="text-xl text-slate-700 dark:text-slate-300">
          Loading your collection...
        </p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 text-center dark:bg-slate-900">
        <h1 className="mb-4 text-3xl font-bold text-slate-800 dark:text-white">
          Access Your Logos
        </h1>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          Please sign in to view your generated gaming logos.
        </p>
        <Link
          href="/api/auth/signin"
          className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-all
                        duration-300 ease-in-out hover:bg-purple-700
                        dark:bg-cyan-500 dark:text-slate-900 dark:hover:bg-cyan-600"
        >
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
        <meta
          name="keywords"
          content="my gaming logos, logo collection, generated logos, ai esports logo, saved designs, gaming branding"
        />
        <link rel="canonical" href="https://gaminglogoai.com/collection" />{" "}
        {/* Replace with actual domain */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Dark mode: bg-slate-900, Light mode: bg-gray-100 */}
      <main className="container mx-auto mt-16 flex min-h-screen flex-col gap-8 bg-gray-100 px-4 py-8 text-slate-800 sm:mt-24 sm:px-8 dark:bg-slate-900 dark:text-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
          My Gaming Logo Collection
        </h1>

        {iconsQuery.isLoading && (
          <p className="text-center text-lg">Loading your masterpieces...</p>
        )}
        {iconsQuery.isError && (
          <p className="text-center text-lg text-red-500">
            Could not load your logos. Please try again.
          </p>
        )}

        {iconsQuery.data && iconsQuery.data.length === 0 && (
          <div className="rounded-lg bg-white py-10 text-center shadow-md dark:bg-slate-800">
            <p className="mb-4 text-xl text-slate-700 dark:text-slate-300">
              Your gallery is empty!
            </p>
            <p className="mb-6 text-slate-600 dark:text-slate-400">
              Time to design some epic gaming logos.
            </p>
            <Link
              href="/gaming-logo-maker"
              className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-all
                            duration-300 ease-in-out hover:bg-purple-700
                            dark:bg-cyan-500 dark:text-slate-900 dark:hover:bg-cyan-600"
            >
              Create Your First Logo
            </Link>
          </div>
        )}

        {iconsQuery.data && iconsQuery.data.length > 0 && (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {iconsQuery.data.map((icon) => {
              const fullIconS3Url = `${s3BucketUrl}/${icon.id}`;
              return (
                <li
                  key={icon.id}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-white shadow-md dark:bg-slate-800"
                >
                  <Image
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    width={512} // Keep for aspect ratio hint, actual display controlled by CSS
                    height={512}
                    alt={icon.prompt ?? `AI generated gaming logo ${icon.id}`}
                    src={fullIconS3Url}
                    priority={false} // Set to true for first few images if you want them to load faster
                  />
                  {/* Overlay for buttons, appears on hover */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black bg-opacity-0 transition-opacity duration-300 group-hover:bg-opacity-50">
                    <button
                      onClick={() => openPopup(icon.id)}
                      className="rounded-full bg-slate-700 p-3 text-white
                               opacity-0 shadow-lg transition-opacity duration-300 hover:bg-purple-600 focus:outline-none group-hover:opacity-100 dark:hover:bg-cyan-500"
                      title="View Fullscreen"
                      aria-label="View Fullscreen"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V4a1 1 0 00-1-1H4zm10 0a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V4a1 1 0 00-1-1h-4zM4 11a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1H4zm10 0a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1h-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        void handleDownload(icon.id, icon.prompt);
                      }}
                      disabled={isDownloading === icon.id}
                      className={`rounded-full bg-slate-700 p-3 text-white
                               opacity-0 shadow-lg transition-opacity duration-300 hover:bg-purple-600 focus:outline-none group-hover:opacity-100 dark:hover:bg-cyan-500
                               ${
                                 isDownloading === icon.id
                                   ? "animate-pulse cursor-not-allowed"
                                   : ""
                               }`}
                      title="Download Logo"
                      aria-label="Download Logo"
                    >
                      {isDownloading === icon.id ? (
                        <svg
                          className="h-5 w-5 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                    <button
                      type="button"
                      // In GameLogoPage/FaceLogoGeneratorPage, use form.name or a relevant prompt piece:
                      onClick={() =>
                        handleOpenSharePopup(fullIconS3Url, icon.prompt)
                      }
                      // In CollectionPage, use icon.prompt:
                      // onClick={() => handleOpenSharePopup(icon.imageUrl, icon.prompt)}
                      className={`rounded-full bg-slate-700 p-3 text-white
                    opacity-0 shadow-lg transition-opacity duration-300 hover:bg-purple-600 focus:outline-none group-hover:opacity-100 dark:hover:bg-cyan-500
                    ${
                      isDownloading === icon.id
                        ? "animate-pulse cursor-not-allowed"
                        : ""
                    }`}
                      aria-label="Share Logo"
                    >
                      <FaShareAlt className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {popupImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
            <div className="relative rounded-lg bg-white p-2 shadow-2xl dark:bg-slate-800">
              <button
                onClick={closePopup}
                className="absolute -right-4 -top-4 z-10 rounded-full bg-purple-600 p-2 text-white shadow-md hover:opacity-80 focus:outline-none dark:bg-cyan-500"
                title="Close Fullscreen"
                aria-label="Close Fullscreen"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <Image // Using Next/Image for optimized loading in popup too
                src={popupImage}
                alt="Fullscreen gaming logo view"
                width={1024} // Set a reasonable max width for popup
                height={1024} // Set a reasonable max height for popup
                style={{
                  objectFit: "contain",
                  maxWidth: "90vw",
                  maxHeight: "90vh",
                }}
                className="rounded-md"
              />
            </div>
          </div>
        )}
        {showSharePopupFor && (
          <SharePopup
            imageUrl={showSharePopupFor}
            imageAlt={`Shareable gaming logo ${
              currentPromptForShare ? "for " + currentPromptForShare : ""
            }`}
            defaultText={`Check out this logo I made ${
              currentPromptForShare
                ? `for "${currentPromptForShare.substring(0, 50)}..."`
                : ""
            } with GamingLogoAI!`}
            siteUrl="https://gaminglogoai.com" // ** REPLACE **
            // For collection page, linking to the main generator is a good default
            generatorUrl={"/gaming-logo-maker"}
            onClose={() => setShowSharePopupFor(null)}
          />
        )}
      </main>
    </>
  );
};

export default CollectionPage;
