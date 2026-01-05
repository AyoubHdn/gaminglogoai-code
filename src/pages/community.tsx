// src/pages/community.tsx
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react"; 
import { api } from "~/utils/api";
import Link from "next/link"; 
import { env } from "~/env.mjs";

const CommunityPage: NextPage = () => {

  const iconsQuery = api.icons.getCommunityIcons.useQuery();

  const [popupImage, setPopupImage] = useState<string | null>(null); 

  const s3BucketUrl = `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_GAMING}.s3.${env.NEXT_PUBLIC_AWS_REGION_GAMING}.amazonaws.com`;

  const openPopup = (icon: { id: string; imageKey?: string | null }) => {
    setPopupImage(getS3ImageUrl(icon));
  };

  const closePopup = () => {
    setPopupImage(null);
  };

    const getS3ImageUrl = (icon: { id: string; imageKey?: string | null }) => {
    return `${s3BucketUrl}/${icon.imageKey ?? icon.id}`;
  };

  return (
    <>
      <Head>
        <title>Gaming Logo Community Gallery | Inspiration - Gaming Logo AI</title>
        <meta
          name="description"
          content="Explore a gallery of AI-generated gaming logos created by the Gaming Logo AI community. Get inspired for your next team emblem, streamer avatar, or game icon."
        />
        <meta name="keywords" content="gaming logo gallery, community logos, ai game art, esports logo ideas, logo inspiration, user generated logos" />
        <link rel="canonical" href="https://gaminglogoai.com/community" /> {/* Replace with actual domain */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Dark mode: bg-slate-900, Light mode: bg-gray-100 */}
      <main className="flex min-h-screen mt-16 sm:mt-24 flex-col container mx-auto gap-8 px-4 sm:px-8 py-8 bg-gray-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                Community Showcase: Epic Gaming Logos
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
                Check out the latest AI-generated gaming logos from our awesome community!
            </p>
        </div>

        {iconsQuery.isLoading && (
            <div className="flex justify-center items-center py-10">
                <svg className="animate-spin h-10 w-10 text-purple-600 dark:text-cyan-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="ml-3 text-xl">Loading Community Creations...</p>
            </div>
        )}
        {iconsQuery.isError && <p className="text-center text-lg text-red-500 dark:text-red-400">Could not load community gallery. Please try refreshing.</p>}

        {iconsQuery.data && iconsQuery.data.length === 0 && (
          <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <p className="text-xl text-slate-700 dark:text-slate-300 mb-4">The gallery is a bit quiet...</p>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Be the first to showcase your epic gaming logo designs!</p>
            <Link href="/gaming-logo-maker" className="px-6 py-3 font-semibold rounded-lg transition-all duration-300 ease-in-out
                            bg-purple-600 hover:bg-purple-700 text-white
                            dark:bg-cyan-500 dark:hover:bg-cyan-600 dark:text-slate-900">
              <a >
                Create a Gaming Logo
              </a>
            </Link>
          </div>
        )}

        {iconsQuery.data && iconsQuery.data.length > 0 && (
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {iconsQuery.data.map((icon) => (
                <li key={getS3ImageUrl(icon)} className="relative group bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden aspect-square cursor-pointer"
                    onClick={() => openPopup(icon)}
                    title={`View logo: ${icon.prompt || 'Community Gaming Logo'}`}
                    >
                <Image
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    width={512}
                    height={512}
                    alt={icon.prompt ?? `Community gaming logo ${getS3ImageUrl(icon)}`}
                    src={getS3ImageUrl(icon)}
                    priority={false}
                />
                 <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs truncate" title={icon.prompt ?? ''}>
                        {icon.prompt ?? 'Awesome Gaming Logo'}
                    </p>
                </div>
                </li>
            ))}
            </ul>
        )}
        {popupImage && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4" onClick={closePopup}>
            <div className="relative bg-white dark:bg-slate-800 p-1 rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={closePopup}
                className="absolute -top-3 -right-3 bg-purple-600 dark:bg-cyan-500 text-white rounded-full p-1.5 hover:opacity-80 focus:outline-none z-10 shadow-md"
                title="Close Fullscreen"
                aria-label="Close Fullscreen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <Image
                src={popupImage}
                alt="Fullscreen community gaming logo"
                width={800}
                height={800}
                style={{ objectFit: 'contain', maxWidth: '90vw', maxHeight: '90vh' }}
                className="rounded"
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default CommunityPage;