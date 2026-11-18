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
  FaPaintBrush,
  FaQuestionCircle,
  FaVideo,
  FaYoutube,
} from "react-icons/fa";
import {
  THUMBNAIL_FORMATS,
  type ThumbnailFormatId,
} from "~/data/thumbnailFormats";
import { THUMBNAIL_GAMES } from "~/data/thumbnailGames";

const FORMAT_CATEGORY_DEFINITIONS = [
  {
    title: "Win & Progression",
    blurb: "Show results, clutch plays, upgrades, and measurable progress.",
    formatIds: [
      "epic-victory",
      "rank-progression",
      "before-after",
      "stats-proof",
    ],
  },
  {
    title: "Challenge & High Stakes",
    blurb:
      "Build urgency around difficult attempts, timers, and major encounters.",
    formatIds: [
      "impossible-challenge",
      "challenge-countdown",
      "boss-battle",
      "warning-broken",
    ],
  },
  {
    title: "Reaction & Comedy",
    blurb:
      "Lead with expressive faces, frustration, or an unexpected funny moment.",
    formatIds: ["reaction-face", "rage-moment", "funny-fail"],
  },
  {
    title: "Comparison & Ranking",
    blurb: "Compare opponents, rank choices, or organize a countdown clearly.",
    formatIds: ["vs-battle", "tier-list", "top-10-grid"],
  },
  {
    title: "Reveal & Curiosity",
    blurb:
      "Direct attention toward secrets, updates, items, and unanswered questions.",
    formatIds: [
      "secret-discovery",
      "item-reveal",
      "new-update",
      "big-arrow-reveal",
      "highlight-circle",
      "question-hook",
    ],
  },
  {
    title: "Number Hooks & Showcase",
    blurb: "Showcase a big number, loadout, team, story, or stream highlight.",
    formatIds: [
      "money-number-hook",
      "best-loadout",
      "cinematic-story",
      "squad-lineup",
      "stream-highlights",
    ],
  },
] as const satisfies readonly {
  title: string;
  blurb: string;
  formatIds: readonly ThumbnailFormatId[];
}[];

function getThumbnailFormat(formatId: ThumbnailFormatId) {
  const format = THUMBNAIL_FORMATS.find(
    (candidate) => candidate.id === formatId,
  );

  if (!format) {
    throw new Error(`Unknown thumbnail format: ${formatId}`);
  }

  return format;
}

const FORMAT_CATEGORIES = FORMAT_CATEGORY_DEFINITIONS.map((category) => ({
  title: category.title,
  blurb: category.blurb,
  formats: category.formatIds.map(getThumbnailFormat),
}));

const EXAMPLE_FORMATS = (
  ["epic-victory", "boss-battle", "reaction-face", "tier-list"] as const
).map(getThumbnailFormat);

const SPECIFIC_GAME_NAMES = THUMBNAIL_GAMES.filter(
  (game) => game.id !== "generic",
).map((game) => game.name);

const YouTubeThumbnailLandingPage: NextPage = () => {
  const router = useRouter();

  const handleStart = () => {
    void router.push("/studio?tool=thumbnail");
  };

  const features = [
    {
      title: "Guided 5-Step Studio Flow",
      description:
        "Choose YouTube, select a content format and game, personalize the thumbnail, then review and generate.",
      icon: <FaMagic className="h-10 w-10" />,
    },
    {
      title: "YouTube-Ready PNG",
      description:
        "Every finished thumbnail is delivered as a standard 1280 x 720, 16:9 PNG ready for a YouTube upload.",
      icon: <FaImages className="h-10 w-10" />,
    },
    {
      title: "25 Gaming Content Formats",
      description:
        "Choose the composition that fits your video, from Epic Victory and Boss Battle to Tier List and Funny Fail.",
      icon: <FaPaintBrush className="h-10 w-10" />,
    },
    {
      title: "Game or Generic Direction",
      description:
        "Select one of 19 supported games, or choose the generic option when your video is not tied to a specific title.",
      icon: <FaYoutube className="h-10 w-10" />,
    },
    {
      title: "Flexible Personalization",
      description:
        "Enter a required title, add an optional subtitle, and use no reference, an uploaded image, or one of My Designs.",
      icon: <FaBolt className="h-10 w-10" />,
    },
    {
      title: "Generate, Refine, and Download",
      description:
        "Review your choices, generate the thumbnail, optionally refine it, create another variation, or download the PNG.",
      icon: <FaChevronRight className="h-10 w-10" />,
    },
  ];

  const workflowSteps = [
    {
      step: "1. Choose your platform",
      detail:
        "Select YouTube, the platform currently available in the thumbnail Studio. This sets the project to a 1280 x 720, 16:9 thumbnail canvas.",
    },
    {
      step: "2. Choose your content format",
      detail:
        "Pick one of the 25 real gaming formats. The selected format controls the main composition, visual hierarchy, and story of the thumbnail.",
    },
    {
      step: "3. Choose your game",
      detail:
        "Choose one of 19 supported games to guide the world, characters, and mood, or select No specific game / generic for an original gaming look.",
    },
    {
      step: "4. Personalize your thumbnail",
      detail:
        "Enter a thumbnail title, add an optional subtitle, and decide whether to generate without a reference, upload a PNG or JPG, or use an eligible saved design.",
    },
    {
      step: "5. Review and generate",
      detail:
        "Confirm the platform, format, game, text, reference choice, output, and credit cost. Generate the PNG, then optionally regenerate, refine, download, or start over.",
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
      title: "Tutorials, challenges & rankings",
      detail:
        "Use the 16:9 PNG for guides, challenge runs, updates, comparisons, and ranked-list videos on YouTube.",
      icon: <FaPaintBrush className="h-8 w-8" />,
    },
    {
      title: "Stream highlights & VOD uploads",
      detail:
        "Turn your best live moments into landscape covers when you publish stream highlights or VOD recordings to YouTube.",
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
        "The thumbnail should promise what the video delivers. When useful, add an optional reference image or saved design to guide the subject and visual direction.",
    },
  ];

  const faq = [
    {
      q: "What is this thumbnail maker for?",
      a: "It is built for YouTube gaming thumbnails and follows the same five-step Studio flow every time: choose YouTube, choose a content format, choose a game, personalize the thumbnail, then review and generate.",
    },
    {
      q: "Is the gaming thumbnail maker free?",
      a: "You can start for free with a signup credit, then top up with affordable credit packs when you want to generate and download more thumbnails. There is no subscription required to try it.",
    },
    {
      q: "What games does it work with?",
      a: `The game selector currently includes ${SPECIFIC_GAME_NAMES.join(", ")}. You can also choose No specific game / generic for a thumbnail without a named franchise.`,
    },
    {
      q: "How many thumbnail formats are there?",
      a: "There are 25 gaming thumbnail formats covering victory, challenge, reaction, comparison, reveal, and number-hook styles — from Epic Victory and Boss Battle to Tier List, VS Battle, and Money / Number Hook.",
    },
    {
      q: "What size does the tool use?",
      a: "The thumbnail generator delivers a 1280 x 720 PNG in the standard 16:9 YouTube thumbnail aspect ratio.",
    },
    {
      q: "Can I upload my own image?",
      a: "Yes. The optional reference choices are No reference, Upload image, or My Designs. Device uploads accept PNG or JPG files up to 5 MB and are used as AI visual guidance rather than pasted directly into the result.",
    },
    {
      q: "Can I change the title text?",
      a: "Yes. The title is required and can contain up to 70 characters. You can also add an optional subtitle of up to 50 characters, then return to Personalize before generating another variation if you want to change either field.",
    },
    {
      q: "Do I need design skills?",
      a: "No. Each format sets the composition, mood, and text placement for you, so you get a click-ready gaming thumbnail without opening a design tool or hiring a designer.",
    },
    {
      q: "Can I regenerate the same setup?",
      a: "Yes. After generating in Step 5, you can create another variation from the same format, game, title, subtitle, and reference choice. You can also submit an optional refinement request or reset to the original result.",
    },
  ];

  return (
    <>
      <Head>
        <title>
          YouTube Thumbnail Maker - AI Gaming Thumbnails | GamingLogoAI
        </title>
        <meta
          name="description"
          content="Create AI-generated YouTube gaming thumbnails in five guided steps. Choose a format and game, personalize the text and optional reference, then download a 1280 x 720 PNG."
        />
        <link
          rel="canonical"
          href="https://gaminglogoai.com/youtube-thumbnail-maker"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://gaminglogoai.com/youtube-thumbnail-maker"
        />
        <meta
          property="og:title"
          content="YouTube Thumbnail Maker - AI Gaming Thumbnails"
        />
        <meta
          property="og:description"
          content="Create AI-generated YouTube gaming thumbnails in five guided steps. Choose a format and game, personalize the text and optional reference, then download a 1280 x 720 PNG."
        />
        <meta
          property="og:image"
          content="https://gaminglogoai.com/og-image-gaminglogoai.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="GamingLogoAI" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="YouTube Thumbnail Maker - AI Gaming Thumbnails"
        />
        <meta
          name="twitter:description"
          content="Create AI-generated YouTube gaming thumbnails in five guided steps. Choose a format and game, personalize the text and optional reference, then download a 1280 x 720 PNG."
        />
        <meta
          name="twitter:image"
          content="https://gaminglogoai.com/og-image-gaminglogoai.png"
        />
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
                description:
                  "Free to start with 1 credit on signup. Credit packs available.",
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
              Create gaming thumbnails with the real five-step Studio flow:
              choose YouTube, select a content format and game, personalize your
              text and optional reference, then review and generate.
            </p>

            <button
              onClick={handleStart}
              className="rounded-lg bg-gradient-to-r from-red-500 to-orange-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105"
            >
              Start Creating Thumbnails{" "}
              <FaChevronRight className="ml-2 inline" />
            </button>
          </div>
        </section>

        <section className="bg-white py-16 dark:bg-slate-900">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Your thumbnail is the single biggest factor in whether someone
              clicks your gaming video. Before anyone reads your title or
              watches a second of footage, they judge the cover image — and on a
              crowded YouTube gaming feed you have a fraction of a second to win
              that click. This AI gaming thumbnail maker helps you produce
              scroll-stopping, high-contrast thumbnails without opening
              Photoshop or hiring a designer.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Pick a proven content format, choose your game, enter a required
              headline and optional subtitle, then decide whether you want no
              reference, a PNG or JPG upload, or one of your eligible saved
              designs. The generator delivers a 1280 x 720 PNG tuned for
              click-through, with the selected format shaping victories, boss
              fights, rage moments, tier lists, update videos, and more.
            </p>
          </div>
        </section>

        <section className="bg-white py-16 dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
              Why Creators Use Our{" "}
              <span className="text-red-500">Thumbnail Maker</span>
            </h2>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-lg dark:border-slate-700/50 dark:bg-slate-800/60"
                >
                  <div className="mr-5 text-red-500">{feature.icon}</div>
                  <div>
                    <p className="mb-1 text-lg font-semibold">
                      {feature.title}
                    </p>
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
              How to Make a Gaming Thumbnail in 5 Steps
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-center text-slate-600 dark:text-slate-300">
              These are the same five steps you will see after opening the
              Studio thumbnail tool — no hidden setup and no separate legacy
              builder.
            </p>

            <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
              Choose YouTube, Then Choose Your Game
            </h2>
            <p className="mx-auto mb-8 max-w-3xl text-center text-slate-600 dark:text-slate-300">
              YouTube is currently the only platform available in this Studio
              tool. In Step 3, choose a recognizable game identity or select No
              specific game / generic when the video needs a flexible original
              gaming look. The selected game supplies the world and visual
              direction while your chosen content format controls the layout and
              story.
            </p>
            <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-2">
              {THUMBNAIL_GAMES.map((game) => (
                <li
                  key={game.id}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {game.name}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-slate-50 py-20 dark:bg-slate-950">
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
              {FORMAT_CATEGORIES.map((cat) => (
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
                  <ul className="space-y-2">
                    {cat.formats.map((format) => (
                      <li
                        key={format.id}
                        className="rounded-lg bg-white px-3 py-2 text-sm text-slate-700 dark:bg-slate-700/60 dark:text-slate-200"
                      >
                        <span className="font-semibold">{format.name}</span>
                        <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-300">
                          {format.description}
                        </span>
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
              Real Content Format Preview Examples
            </h2>

            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
              {EXAMPLE_FORMATS.map((format) => (
                <div
                  key={format.id}
                  className="rounded-lg bg-white p-2 shadow-lg dark:bg-slate-800"
                >
                  <Image
                    src={format.previewImage}
                    alt={`${format.name} gaming thumbnail format preview`}
                    width={640}
                    height={360}
                    className="rounded"
                    unoptimized
                  />
                  <p className="mt-2 text-center text-sm font-medium">
                    {format.name}
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
              One thumbnail can carry across every place your audience finds
              you.
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
            Ready to Make Better{" "}
            <span className="text-red-400">YouTube Thumbnails?</span>
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
