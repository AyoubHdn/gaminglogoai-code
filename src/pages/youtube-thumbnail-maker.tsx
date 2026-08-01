import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  FaBolt,
  FaChevronRight,
  FaImages,
  FaLightbulb,
  FaMagic,
  FaMobileAlt,
  FaPaintBrush,
  FaQuestionCircle,
  FaVideo,
  FaYoutube,
} from "react-icons/fa";
import { StudioPromo } from "~/component/StudioPromo";

const YouTubeThumbnailLandingPage: NextPage = () => {
  const router = useRouter();

  const handleStart = () => {
    void router.push("/studio?tool=thumbnail");
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
      step: "1. Pick a format",
      detail:
        "Start from one of 25 proven gaming thumbnail formats — Epic Victory, Boss Battle, Tier List, Reaction Face, Money / Number Hook and more — so the layout already matches your video's angle.",
    },
    {
      step: "2. Pick your game",
      detail:
        "Choose your game so the art direction, characters, and mood fit titles like Fortnite, Call of Duty, Minecraft, Roblox, Apex, and Cyberpunk.",
    },
    {
      step: "3. Add your title & image",
      detail:
        "Type your headline and drop in a reference image during the personalize step so the thumbnail is tied to your actual upload, face, or in-game moment.",
    },
    {
      step: "4. Generate & download",
      detail:
        "Generate a 1280 x 720 result, refine the variation until the click-through look is right, then download it ready to upload.",
    },
  ];

  const exampleThumbnails = [
    { src: "/youtube/thumbnail/fortnite-prv.webp", caption: "Fortnite Hype" },
    { src: "/youtube/thumbnail/cod-prv.webp", caption: "COD Night Ops" },
    { src: "/youtube/thumbnail/roblox-prv.webp", caption: "Roblox Chaos" },
    { src: "/youtube/thumbnail/minecraft-prv.webp", caption: "Minecraft Build Rush" },
  ];

  // The 25 real thumbnail formats the generator ships with, grouped by the job
  // the thumbnail needs to do. Names mirror src/data/thumbnailFormats.ts.
  const formatCategories = [
    {
      title: "Win & Progression",
      blurb: "Show off results, clutch plays, and glow-ups.",
      formats: ["Epic Victory", "Rank Progression", "Before & After", "Stats Proof"],
    },
    {
      title: "Challenge & High Stakes",
      blurb: "Tension that makes the click feel urgent.",
      formats: [
        "Impossible Challenge",
        "Challenge Countdown",
        "Boss Battle",
        "Warning / Broken",
      ],
    },
    {
      title: "Reaction & Comedy",
      blurb: "Big expressions and funny moments.",
      formats: ["Reaction Face", "Rage Moment", "Funny Fail"],
    },
    {
      title: "Comparison & Ranking",
      blurb: "Head-to-heads and ranked lists.",
      formats: ["VS Battle", "Tier List", "Top 10 Grid"],
    },
    {
      title: "Reveal & Curiosity",
      blurb: "Tease something viewers have to see.",
      formats: [
        "Secret Discovery",
        "Item Reveal",
        "New Update",
        "Big Arrow Reveal",
        "Highlight Circle",
        "Question Hook",
      ],
    },
    {
      title: "Number Hooks & Showcase",
      blurb: "Lead with a big number or a clean showcase.",
      formats: [
        "Money / Number Hook",
        "Best Loadout",
        "Cinematic Story",
        "Squad Lineup",
        "Stream Highlights",
      ],
    },
  ];

  const whereToUse = [
    {
      title: "YouTube gaming videos",
      detail:
        "The main event — a bold 1280 x 720 cover that stands out in the subscriptions feed and search results.",
      icon: <FaYoutube className="h-8 w-8" />,
    },
    {
      title: "Shorts & vertical clips",
      detail:
        "Reuse the same art direction and headline so your long-form and Shorts feel like one channel.",
      icon: <FaMobileAlt className="h-8 w-8" />,
    },
    {
      title: "Stream highlights & VODs",
      detail:
        "Turn your best live moments into highlight covers for Twitch VOD exports and YouTube uploads.",
      icon: <FaVideo className="h-8 w-8" />,
    },
    {
      title: "Community & social posts",
      detail:
        "Post the thumbnail to the Community tab, Discord, or X to tease a video before it goes live.",
      icon: <FaImages className="h-8 w-8" />,
    },
  ];

  const thumbnailTips = [
    {
      title: "Lead with one focal point",
      detail:
        "One character, item, or reaction should own the frame. Competing subjects make a thumbnail read as clutter at feed size.",
    },
    {
      title: "Use high-contrast color",
      detail:
        "Bright subjects against dark or complementary backgrounds pop on both light and dark YouTube themes.",
    },
    {
      title: "Show a face or clear subject",
      detail:
        "Expressive faces and recognizable characters earn clicks — reaction and squad formats lean into this on purpose.",
    },
    {
      title: "Keep text short and huge",
      detail:
        "Three to four punchy words, sized to stay readable on a phone. Let the format's big-text layout do the work.",
    },
    {
      title: "Design for the small preview",
      detail:
        "Most viewers see your thumbnail at postage-stamp size. If it still reads when tiny, it works everywhere.",
    },
    {
      title: "Match the real moment",
      detail:
        "The thumbnail should promise what the video delivers. Add a reference image so the cover reflects your actual gameplay.",
    },
  ];

  const faq = [
    {
      q: "What is this thumbnail maker for?",
      a: "It is built for YouTube gaming thumbnails and helps you create high-impact cover images using a guided AI workflow — pick a format, pick your game, personalize, and generate.",
    },
    {
      q: "Is the gaming thumbnail maker free?",
      a: "You can start for free with a signup credit, then top up with affordable credit packs when you want to generate and download more thumbnails. There is no subscription required to try it.",
    },
    {
      q: "What games does it work with?",
      a: "The formats are tuned for popular gaming titles like Fortnite, Call of Duty, Minecraft, Roblox, Apex Legends, and Cyberpunk, and the prompts adapt to the game you choose so the art direction fits.",
    },
    {
      q: "How many thumbnail formats are there?",
      a: "There are 25 gaming thumbnail formats covering victory, challenge, reaction, comparison, reveal, and number-hook styles — from Epic Victory and Boss Battle to Tier List, VS Battle, and Money / Number Hook.",
    },
    {
      q: "What size does the tool use?",
      a: "The thumbnail generator uses a 1280 x 720 canvas so the result fits standard YouTube thumbnail requirements and the 16:9 aspect ratio.",
    },
    {
      q: "Can I upload my own image?",
      a: "Yes. The personalize step supports a reference image so the thumbnail can match your subject, face, or in-game moment.",
    },
    {
      q: "Can I change the title text?",
      a: "Yes. You can enter your own thumbnail headline during personalization before generating the result, and update it between variations.",
    },
    {
      q: "Do I need design skills?",
      a: "No. Each format sets the composition, mood, and text placement for you, so you get a click-ready gaming thumbnail without opening a design tool or hiring a designer.",
    },
    {
      q: "Can I regenerate the same setup?",
      a: "Yes. Once you reach the result step, you can generate a new variation from the same template and personalization choices until the look is right.",
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

        <StudioPromo
          toolName="YouTube Thumbnail Maker"
          href="/studio?tool=thumbnail"
        />

        <section className="bg-white py-16 dark:bg-slate-900">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Your thumbnail is the single biggest factor in whether someone
              clicks your gaming video. Before anyone reads your title or watches
              a second of footage, they judge the cover image — and on a crowded
              YouTube gaming feed you have a fraction of a second to win that
              click. This AI gaming thumbnail maker helps you produce
              scroll-stopping, high-contrast thumbnails without opening Photoshop
              or hiring a designer.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Pick a proven format, choose your game, add your headline and a
              reference image, and the generator builds a 1280 x 720 thumbnail
              tuned for click-through. It is built specifically for gaming
              creators, so every template understands the look of victories, boss
              fights, rage moments, tier lists, and update videos.
            </p>
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
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              How to Make a Gaming Thumbnail in 4 Steps
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-center text-slate-600 dark:text-slate-300">
              The whole flow takes a couple of minutes — no design experience
              needed.
            </p>

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
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              Popular Gaming Thumbnail Formats
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-center text-slate-600 dark:text-slate-300">
              The maker ships with 25 ready-to-use gaming thumbnail formats,
              grouped by the job you need the thumbnail to do. Each one sets the
              composition, mood, and text placement, so you can focus on your
              video instead of the design.
            </p>

            <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
              {formatCategories.map((cat) => (
                <div
                  key={cat.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/60"
                >
                  <h3 className="mb-1 text-xl font-semibold text-red-500">
                    {cat.title}
                  </h3>
                  <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                    {cat.blurb}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {cat.formats.map((format) => (
                      <li
                        key={format}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700/60 dark:text-slate-200"
                      >
                        {format}
                      </li>
                    ))}
                  </ul>
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

        <section className="bg-slate-50 py-20 dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              Where to Use Your Gaming Thumbnails
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-center text-slate-600 dark:text-slate-300">
              One thumbnail can carry across every place your audience finds you.
            </p>

            <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {whereToUse.map((use) => (
                <div
                  key={use.title}
                  className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700/50 dark:bg-slate-800/60"
                >
                  <div className="mb-3 flex justify-center text-red-500">
                    {use.icon}
                  </div>
                  <p className="mb-1 font-semibold">{use.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {use.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
              <FaLightbulb className="mr-2 inline text-red-500" />
              Tips for Click-Worthy Gaming Thumbnails
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-center text-slate-600 dark:text-slate-300">
              A few habits that separate thumbnails that get scrolled past from
              the ones that get clicked.
            </p>

            <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {thumbnailTips.map((tip) => (
                <div
                  key={tip.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/60"
                >
                  <p className="mb-1 text-lg font-semibold">{tip.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {tip.detail}
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
