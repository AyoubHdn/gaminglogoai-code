// src/pages/logo-styles.tsx
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image"; // If using images for categories
import Link from "next/link";
import { FaGamepad, FaPalette, FaShapes, FaTags, FaCalendarAlt, FaGlobe, FaChevronRight, FaUserCircle, FaPenFancy, FaPaintBrush } from "react-icons/fa"; // Example icons
import { Button } from "~/component/Button";


const TEXT_LOGO_TOOL_URL = "/gaming-logo-tool";
const PFP_MAKER_TOOL_URL = "/pfp-tool";

interface RelevantTool {
  name: string; // e.g., "Text Logo Tool", "PFP Maker"
  url: string;  // e.g., TEXT_LOGO_TOOL_URL
  icon?: React.ReactElement; // Optional icon for the button
  variant?: "primary" | "secondary" | "accent" | "ghost"; // For Button component styling
}

interface StyleItemPreview { // For display on this hub page
  name: string;
  // linkSuffix: string; // We'll use this only if the landing page exists
  hasLandingPage: boolean; // New flag
  targetUrl?: string; // Full URL if landing page exists, e.g., /gaming-logos/by-game-title/apex-legends
}

interface StyleCategory {
  name: string;
  icon: React.ReactElement;
  description: string;
  // linkBase for niche landing pages is still useful for constructing viewAllLink
  // linkBase?: string; 
  categoryLandingPageUrl?: string; // URL for the main landing page FOR THIS ENTIRE CATEGORY
  subItemsPreview: StyleItemPreview[]; // Show a few popular ones
  relevantTools: RelevantTool[]; // Array of relevant tools for this category
}

const styleCategories: StyleCategory[] = [
//   {
//     name: "Logos by Game Title",
//     icon: <FaGamepad className="h-8 w-8 text-purple-600 dark:text-cyan-400" />,
//     description: "Find logo styles inspired by your favorite AAA and indie games. Perfect for text-based team names and gamer tags.",
//     categoryLandingPageUrl: "/gaming-logos/by-game-title", // Example: This page would list ALL game title niche pages
//     subItemsPreview: [
//       { name: "Apex Legends", hasLandingPage: false }, // Set to true when /gaming-logos/by-game-title/apex-legends exists
//       { name: "Fortnite", hasLandingPage: false },
//       { name: "Valorant", hasLandingPage: false },
//     ],
//     relevantTools: [
//       { name: "Create Text Logo", url: TEXT_LOGO_TOOL_URL, icon: <FaPenFancy className="mr-1.5"/>, variant: "primary" },
//       { name: "Make PFP from Photo", url: PFP_MAKER_TOOL_URL, icon: <FaUserCircle className="mr-1.5"/>, variant: "secondary" },
//     ]
//   },
//   {
//     name: "Logos by Art Style",
//     icon: <FaPalette className="h-8 w-8 text-purple-600 dark:text-cyan-400" />,
//     description: "Explore diverse artistic approaches from cartoonish to emblems. Great for both text and image-based concepts.",
//     categoryLandingPageUrl: "/gaming-logos/by-art-style",
//     subItemsPreview: [
//       { name: "Cartoon & Cute", hasLandingPage: false }, // Set to true when /gaming-logos/by-art-style/cartoon-cute exists
//       { name: "Pixel & Retro", hasLandingPage: false },
//       { name: "Esports Emblems", hasLandingPage: false },
//     ],
//     relevantTools: [
//       { name: "Design with this Art Style", url: TEXT_LOGO_TOOL_URL, icon: <FaPenFancy className="mr-1.5"/>, variant: "primary" },
//       { name: "Apply Style to Photo", url: PFP_MAKER_TOOL_URL, icon: <FaUserCircle className="mr-1.5"/>, variant: "primary" },
//     ]
//   },
{
    name: "Text-Based Gaming Logos",
    categoryLandingPageUrl: "/gaming-logo", // Your main landing page for text logos
    icon: <FaPaintBrush className="h-10 w-10 text-purple-600 dark:text-cyan-400" />,
    description: "Craft unique logos from text prompts combined with diverse artistic styles, game themes, mascots, and more. Perfect for team names and gamer tags.",
    subItemsPreview: [
      { name: "Fortnite Inspired Logos", hasLandingPage: false, targetUrl: "/gaming-logos/fortnite" }, // Niche landing page
      { name: "Cartoon Style Logos", hasLandingPage: false, targetUrl: "/gaming-logos/cartoon-style" },
      { name: "Esports Emblems", hasLandingPage: false, targetUrl: "/gaming-logos/esports-emblems" },
    ],
    relevantTools: [ 
        {
            name: "Open Text Logo Maker",
            url: "/gaming-logo-maker",
            icon: <FaGamepad className="mr-1.5" />,
            variant: "primary",
        }
    ]
  },
  {
    name: "AI Photo Avatars",
    icon: <FaUserCircle className="h-8 w-8 text-purple-600 dark:text-cyan-400" />,
    description: "Transform your photos into unique AI avatars using various artistic styles. Perfect for your online persona.",
    categoryLandingPageUrl: "/ai-profile-picture-maker", // Example: Hub for all PFP styles/niches
     subItemsPreview: [ // These would be landing pages for specific PFP styles
        { name: "Cartoonify Your Face", hasLandingPage: false, targetUrl: "/pfp-styles/cartoon" },
        { name: "Anime Photo Portraits", hasLandingPage: false, targetUrl: "/pfp-styles/anime" },
        { name: "Cyberpunk Avatars", hasLandingPage: false, targetUrl: "/pfp-styles/cyberpunk" },
    ],
    relevantTools: [
      { name: "Go to PFP Maker", url: "/pfp-maker", icon: <FaUserCircle className="mr-1.5"/>, variant: "accent" },
    ]
  },
  // ... Add other categories
];

const LogoStylesHubPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Browse All Gaming Logo Styles & Categories | GamingLogoAI</title>
        <meta name="description" content="Explore a vast collection of AI gaming logo styles on GamingLogoAI. Find inspiration by game title, art style, theme, and more to create your perfect logo or PFP." />
        <meta name="keywords" content="gaming logo styles, logo categories, pfp styles, esports logo themes, game logo ideas, browse ai logos, text logo styles, photo avatar styles" />
        <link rel="canonical" href="https://www.gaminglogoai.com/logo-styles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <section className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              Discover Your Perfect Gaming Logo Style
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Dive into our diverse categories to find inspiration for your unique AI-generated gaming logo or PFP avatar.
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {styleCategories.map((category) => (
                <div 
                  key={category.name} 
                  className="flex flex-col p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 transition-shadow duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    <span className="mr-4 p-2 bg-purple-100 dark:bg-cyan-500/20 rounded-lg">
                        {category.icon}
                    </span>
                    <h2 className="text-xl lg:text-2xl font-semibold text-slate-800 dark:text-white">{category.name}</h2>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 grow min-h-[60px]">{category.description}</p>
                  
                  {category.subItemsPreview && category.subItemsPreview.length > 0 && (
                    <div className="mb-4 border-t border-slate-200 dark:border-slate-700 pt-4 space-y-1.5">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Popular examples:</p>
                        {category.subItemsPreview.slice(0, 3).map((item) => (
                        item.hasLandingPage && item.targetUrl ? ( // Check if landing page exists
                            <Link key={item.name} href={item.targetUrl} legacyBehavior={false}>
                            <a className="flex items-center text-xs text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-cyan-400 hover:underline py-0.5">
                                <FaChevronRight className="mr-1.5 h-2.5 w-2.5 flex-shrink-0" /> {item.name}
                            </a>
                            </Link>
                        ) : (
                            // If landing page doesn't exist, render as plain text (not a link)
                            <div key={item.name} className="flex items-center text-xs text-slate-500 dark:text-slate-400 py-0.5">
                            <FaChevronRight className="mr-1.5 h-2.5 w-2.5 flex-shrink-0 opacity-50" /> 
                            <span className="opacity-70">{item.name}</span>
                            {/* Optional: Add a small "(Coming Soon)" or similar text */}
                            {/* <span className="ml-1 text-[10px] italic opacity-50">(Coming Soon)</span> */}
                            </div>
                        )
                        ))}
                    </div>
                    )}
                    {category.categoryLandingPageUrl && (
                     <Link href={category.categoryLandingPageUrl} legacyBehavior={false} className="mb-4 text-xs font-semibold text-purple-600 dark:text-cyan-400 hover:text-purple-700 dark:hover:text-cyan-500 transition-colors self-start hover:underline">
                        Explore All {category.name} Styles →
                     </Link>
                  )}

                  {/* --- RENDER RELEVANT TOOL BUTTONS --- */}
                  <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
                    {category.relevantTools.map((tool) => {
                      // Potentially construct dynamic URL if category/style info needs to be passed
                      // For now, using the direct tool.url
                      const toolUrl = tool.url; 
                      // Example for dynamic URL:
                      // const toolUrl = `${tool.url}?category=${encodeURIComponent(category.name)}`;

                      return (
                        <Button
                            key={tool.name}
                            onClick={() => window.location.href = toolUrl} // Simple navigation
                            variant={tool.variant || "primary"}
                            size="sm"
                            fullWidth // Make buttons full width within their column
                            className="text-xs sm:text-sm" // Adjust text size for button
                        >
                            {tool.icon}
                            {tool.name}
                        </Button>
                      );
                    })}
                  </div>
                  {/* --- END OF RELEVANT TOOL BUTTONS --- */}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA to Main Generators */}
        <section className="py-12 md:py-16 bg-slate-100 dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Ready to Create?</h2>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link href="/gaming-logo-maker" legacyBehavior={false} className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg text-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                    Go to Text Logo Maker
                </Link>
                <Link href="/pfp-maker" legacyBehavior={false}  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-slate-900 font-semibold rounded-lg text-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                        Go to AI PFP Maker
                </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default LogoStylesHubPage;