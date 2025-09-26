// src/pages/logo-styles.tsx
import { type NextPage, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { FaGamepad, FaPalette, FaShapes, FaUserCircle, FaPenFancy, FaChevronRight } from "react-icons/fa";
import { Button } from "~/component/Button";
import { gamerStylesData } from "~/data/gamerStylesData";
import { faceStylesData } from "~/data/faceStylesData";
import { createSlug } from "~/lib/utils";

// --- CLIENT-SIDE ICON MAPPING ---
// This object will live on the client to turn strings into components
const iconMap: { [key: string]: React.ReactElement } = {
  gamepad: <FaGamepad className="h-8 w-8 text-purple-600 dark:text-cyan-400" />,
  palette: <FaPalette className="h-8 w-8 text-purple-600 dark:text-cyan-400" />,
  shapes: <FaShapes className="h-8 w-8 text-purple-600 dark:text-cyan-400" />,
  user: <FaUserCircle className="h-8 w-8 text-purple-600 dark:text-cyan-400" />,
  // Add any other icons you use here
};

// --- TYPE DEFINITIONS (NOW WITH SERIALIZABLE DATA) ---
interface RelevantTool {
  name: string;
  url: string;
  iconName: keyof typeof iconMap; // Pass icon by name
  variant?: "primary" | "secondary" | "accent" | "ghost";
}

interface StyleItemPreview {
  name: string;
  targetUrl: string;
}

// The shape of the data passed from getStaticProps
interface SerializableStyleCategory {
  name: string;
  iconName: keyof typeof iconMap; // Pass icon by name
  description: string;
  subItemsPreview: StyleItemPreview[];
  relevantTools: RelevantTool[];
}

// --- PAGE COMPONENT ---
const LogoStylesHubPage: NextPage<{ styleCategories: SerializableStyleCategory[] }> = ({ styleCategories }) => {
  return (
    <>
      <Head>
        <title>Browse All Gaming Logo & PFP Styles | GamingLogoAI</title>
        <meta name="description" content="Explore a vast collection of AI gaming logo styles and PFP categories on GamingLogoAI. Find inspiration by game title, art style, theme, and more to create your perfect design." />
        <meta name="keywords" content="gaming logo styles, pfp styles, esports logo themes, game logo ideas, browse ai logos, text logo styles, photo avatar styles" />
        <link rel="canonical" href="https://gaminglogoai.com/logo-styles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              Discover Your Perfect Style
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Dive into our diverse categories to find inspiration for your unique AI-generated gaming logo or PFP avatar.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {styleCategories.map((category) => (
                <div key={category.name} className="flex flex-col p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 transition-shadow duration-300 hover:shadow-2xl">
                  <div className="flex items-center mb-4">
                    <span className="mr-4 p-2 bg-purple-100 dark:bg-cyan-500/20 rounded-lg">
                      {iconMap[category.iconName]} {/* CONVERT STRING TO ICON HERE */}
                    </span>
                    <h2 className="text-xl lg:text-2xl font-semibold text-slate-800 dark:text-white">{category.name}</h2>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 grow min-h-[60px]">{category.description}</p>
                  
                  {category.subItemsPreview.length > 0 && (
                    <div className="mb-4 border-t border-slate-200 dark:border-slate-700 pt-4 space-y-1.5">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Popular examples:</p>
                      {category.subItemsPreview.slice(0, 3).map((item) => (
                        <Link key={item.name} href={item.targetUrl} legacyBehavior={false}>
                          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-cyan-400 hover:underline py-0.5 cursor-pointer">
                            <FaChevronRight className="mr-1.5 h-2.5 w-2.5 flex-shrink-0" /> {item.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                    {category.relevantTools.map((tool) => (
                      <Button key={tool.name} onClick={() => window.location.href = tool.url} variant={tool.variant || "primary"} size="sm" fullWidth className="text-xs sm:text-sm">
                        {iconMap[tool.iconName]} {/* CONVERT STRING TO ICON HERE */}
                        <span className="ml-1.5">{tool.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default LogoStylesHubPage;

// --- SERVER-SIDE DATA GENERATION (NOW SERIALIZABLE) ---
// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticProps: GetStaticProps<{ styleCategories: SerializableStyleCategory[] }> = async () => {
  const styleCategories: SerializableStyleCategory[] = [];

  const logoCategoriesConfig = [
    { parentKey: "Game Titles", categoryPath: "games", slugSuffix: "-logo-maker", name: "Logos by Game Title", iconName: "gamepad", description: "Find logo styles inspired by your favorite games." },
    { parentKey: "Art", categoryPath: "styles", slugSuffix: "-logo-design", name: "Logos by Art Style", iconName: "palette", description: "Explore diverse artistic approaches, from cartoons to emblems." },
    { parentKey: "Themes & Motifs", categoryPath: "themes", slugSuffix: "-gaming-logo", name: "Logos by Theme", iconName: "shapes", description: "Discover logos based on fantasy, sci-fi, horror, and more." },
  ] as const;

  for (const config of logoCategoriesConfig) {
    const dataSet = gamerStylesData[config.parentKey as keyof typeof gamerStylesData];
    if (dataSet) {
      const subItemsPreview = Object.keys(dataSet).slice(0, 3).map(subCategoryName => ({
        name: subCategoryName,
        targetUrl: `/logo/${config.categoryPath}/${createSlug(subCategoryName, config.slugSuffix)}`,
      }));

      styleCategories.push({
        ...config,
        subItemsPreview,
        relevantTools: [{ name: "Open Text Logo Maker", url: "/gaming-logo-maker", iconName: "pen", variant: "primary" }], // Added iconName
      });
    }
  }

  const pfpCategoriesConfig = [
    { parentKey: "Game Title", categoryPath: "games", slugSuffix: "-pfp-maker", name: "PFPs by Game", iconName: "gamepad", description: "Transform your photo into an avatar inspired by popular games." },
    { parentKey: "Art Style", categoryPath: "styles", slugSuffix: "-avatar-maker", name: "PFPs by Art Style", iconName: "palette", description: "See yourself in styles like Anime, Cartoon, Pixel Art, and more." },
    { parentKey: "Theme & Motif", categoryPath: "themes", slugSuffix: "-avatar-maker", name: "PFPs by Theme", iconName: "shapes", description: "Become a fantasy hero, a sci-fi explorer, or a horror character." },
  ] as const;

  for (const config of pfpCategoriesConfig) {
    const dataSet = faceStylesData[config.parentKey as keyof typeof faceStylesData];
    if (dataSet) {
      const allItems = Object.values(dataSet).flat();
      const subItemsPreview = allItems.slice(0, 3).map(item => ({
        name: item.name,
        targetUrl: `/pfp/${config.categoryPath}/${createSlug(item.name, config.slugSuffix)}`,
      }));

      styleCategories.push({
        ...config,
        subItemsPreview,
        relevantTools: [{ name: "Open PFP Maker", url: "/pfp-maker", iconName: "user", variant: "accent" }], // Added iconName
      });
    }
  }

  return {
    props: {
      styleCategories,
    },
  };
};