import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  FaBolt,
  FaChevronRight,
  FaImages,
  FaMagic,
  FaPaintBrush,
  FaQuestionCircle,
  FaYoutube,
} from "react-icons/fa";

const YouTubeThumbnailLandingPage: NextPage = () => {
  const router = useRouter();

  const handleStart = () => {
    void router.push("/thumbnail-maker");
  };

  const features = [
    {
      title: "Guided 4-Step Funnel",
      description:
        "Choose YouTube, pick a template, personalize your content, and generate the thumbnail in one flow.",
      icon: <FaMagic className="h-10 w-10" />,
    },
    {
      title: "YouTube-Ready Size",
      description:
        "Every thumbnail is built around the standard 1280 x 720 YouTube canvas for clean uploads.",
      icon: <FaImages className="h-10 w-10" />,
    },
    {
      title: "Game-Based Templates",
      description:
        "Start from creator-ready presets inspired by games like Call of Duty, Fortnite, Minecraft, Apex, Cyberpunk, and Roblox.",
      icon: <FaPaintBrush className="h-10 w-10" />,
    },
    {
      title: "Title and Image Personalization",
      description:
        "Add your headline and reference image in the personalize step so the final thumbnail matches your video idea.",
      icon: <FaYoutube className="h-10 w-10" />,
    },
    {
      title: "Generate and Refine",
      description:
        "Create a variation, refine the result, and keep pushing for a stronger click-through look.",
      icon: <FaBolt className="h-10 w-10" />,
    },
    {
      title: "Download Ready",
      description:
        "Preview and download the final thumbnail once you land on the result step.",
      icon: <FaChevronRight className="h-10 w-10" />,
    },
  ];

  const workflowSteps = [
    {
      step: "1. Platform",
      detail: "Start with YouTube so the builder uses thumbnail-specific sizing and behavior.",
    },
    {
      step: "2. Template",
      detail: "Pick the visual direction that best fits your game, video energy, and audience.",
    },
    {
      step: "3. Personalize",
      detail: "Add your title and image reference so the thumbnail feels tied to your actual upload.",
    },
    {
      step: "4. Result",
      detail: "Generate, refine, and download the final thumbnail once you are happy with the direction.",
    },
  ];

  const exampleThumbnails = [
    { src: "/youtube/thumbnail/fortnite-prv.webp", caption: "Fortnite Hype" },
    { src: "/youtube/thumbnail/cod-prv.webp", caption: "COD Night Ops" },
    { src: "/youtube/thumbnail/roblox-prv.webp", caption: "Roblox Chaos" },
    { src: "/youtube/thumbnail/minecraft-prv.webp", caption: "Minecraft Build Rush" },
  ];

  const faq = [
    {
      q: "What is this thumbnail maker for?",
      a: "It is built for YouTube gaming thumbnails and helps you create high-impact cover images using a guided AI workflow.",
    },
    {
      q: "What size does the tool use?",
      a: "The thumbnail generator uses a 1280 x 720 canvas so the result fits standard YouTube thumbnail requirements.",
    },
    {
      q: "Can I upload my own image?",
      a: "Yes. The personalize step supports a reference image so the thumbnail can match your subject, face, or in-game moment.",
    },
    {
      q: "Can I change the title text?",
      a: "Yes. You can enter your own thumbnail headline during personalization before generating the result.",
    },
    {
      q: "Can I regenerate the same setup?",
      a: "Yes. Once you reach the result step, you can generate a new variation from the same template and personalization choices.",
    },
  ];

  return (
    <>
      <Head>
        <title>YouTube Thumbnail Maker - AI Gaming Thumbnails | GamingLogoAI</title>
        <meta
          name="description"
          content="Create AI-generated YouTube gaming thumbnails. Choose a template, add your title and reference image, and generate a click-ready thumbnail in one guided flow."
        />
        <link rel="canonical" href="https://gaminglogoai.com/youtube-thumbnail-maker" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gaminglogoai.com/youtube-thumbnail-maker" />
        <meta property="og:title" content="YouTube Thumbnail Maker - AI Gaming Thumbnails" />
        <meta property="og:description" content="Create AI-generated YouTube gaming thumbnails. Choose a template, add your title and reference image, and generate a click-ready thumbnail in one guided flow." />
        <meta property="og:image" content="https://gaminglogoai.com/og-image-gaminglogoai.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="GamingLogoAI" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="YouTube Thumbnail Maker - AI Gaming Thumbnails" />
        <meta name="twitter:description" content="Create AI-generated YouTube gaming thumbnails. Choose a template, add your title and reference image, and generate a click-ready thumbnail in one guided flow." />
        <meta name="twitter:image" content="https://gaminglogoai.com/og-image-gaminglogoai.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "YouTube Thumbnail Maker",
              description:
                "Create AI-generated YouTube gaming thumbnails. Choose a template, add your title and reference image, and generate a click-ready thumbnail in one guided flow.",
              url: "https://gaminglogoai.com/youtube-thumbnail-maker",
              applicationCategory: "DesignApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                description: "Free to start with 1 credit on signup. Credit packs available.",
              },
              publisher: {
                "@type": "Organization",
                name: "GamingLogoAI",
                url: "https://gaminglogoai.com",
              },
            }),
          }}
        />
      </Head>

      <main className="bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-200">
        <section className="relative overflow-hidden py-20 text-center text-white md:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/80 via-slate-950/90 to-black" />

          <div className="relative z-20 mx-auto max-w-3xl px-4">
            <h1 className="mb-6 text-4xl font-extrabold md:text-6xl">
              AI <span className="text-red-400">YouTube Thumbnail Maker</span>
            </h1>
            <p className="mb-10 text-lg text-slate-200 md:text-xl">
              Create gaming thumbnails with a guided flow: choose YouTube, pick a
              template, personalize your title and image, then generate a
              click-ready result.
            </p>

            <button
              onClick={handleStart}
              className="rounded-lg bg-gradient-to-r from-red-500 to-orange-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105"
            >
              Start Creating Thumbnails <FaChevronRight className="ml-2 inline" />
            </button>
          </div>
        </section>

        <section className="bg-white py-16 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              Why Creators Use Our <span className="text-red-500">Thumbnail Maker</span>
            </h2>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-lg dark:border-slate-700/50 dark:bg-slate-800/60"
                >
                  <div className="mr-5 text-red-500">{feature.icon}</div>
                  <div>
                    <p className="mb-1 text-lg font-semibold">{feature.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-20 dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              How The Thumbnail Flow Works
            </h2>

            <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-4">
              {workflowSteps.map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/60"
                >
                  <p className="mb-2 text-lg font-semibold text-red-500">
                    {item.step}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              Thumbnail Style Examples
            </h2>

            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
              {exampleThumbnails.map((example) => (
                <div
                  key={example.caption}
                  className="rounded-lg bg-white p-2 shadow-lg dark:bg-slate-800"
                >
                  <Image
                    src={example.src}
                    alt={example.caption}
                    width={640}
                    height={360}
                    className="rounded"
                    unoptimized
                  />
                  <p className="mt-2 text-center text-sm font-medium">
                    {example.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 dark:bg-slate-900">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="mb-8 text-center text-3xl font-bold">
              <FaQuestionCircle className="mr-2 inline text-red-500" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {faq.map((item, index) => (
                <details
                  key={item.q}
                  className="cursor-pointer rounded-lg border bg-slate-50 p-4 dark:bg-slate-800"
                  open={index === 0}
                >
                  <summary className="text-lg font-semibold">{item.q}</summary>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-tr from-red-900 via-slate-950 to-black py-20 text-center text-white">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Ready to Make Better <span className="text-red-400">YouTube Thumbnails?</span>
          </h2>
          <button
            onClick={handleStart}
            className="rounded-lg bg-gradient-to-r from-red-500 to-orange-500 px-10 py-4 text-xl font-bold text-white shadow-xl transition-all hover:scale-105"
          >
            Open Thumbnail Maker
          </button>
        </section>
      </main>
    </>
  );
};

export default YouTubeThumbnailLandingPage;
