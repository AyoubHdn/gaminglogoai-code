/* eslint-disable @typescript-eslint/require-await */
// src/pages/pfp/games/[slug].tsx
import { type NextPage, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import PseoPfpPageTemplate, { PseoPfpPageTemplateProps } from "~/component/pSEO/PseoPfpPageTemplate";
import { faceStylesData } from "~/data/faceStylesData";
import { createSlug } from "~/lib/utils";
import { getStaticRelatedItems, RelatedItem, getShowcaseItems } from "~/lib/pSEO";

// Define the shape of our style items, which now must include a name
interface PfpStyleItem {
    name: string;
    src: string;
    basePrompt: string;
}

// Data from the server for a single game page
interface PfpGamePageServerProps {
  gameTitle: string;
  styleItem: PfpStyleItem;
  slug: string;
  relatedItems: RelatedItem[];
  otherShowcaseItems: PfpStyleItem[];
}

const PfpGamePage: NextPage<PfpGamePageServerProps> = ({ gameTitle, styleItem, slug, relatedItems, otherShowcaseItems }) => {
  const router = useRouter();
  const handleCtaClick = () => { void router.push(`/pfp-maker#${encodeURIComponent(gameTitle)}`); };

  const templateProps: PseoPfpPageTemplateProps = {
    pageTitle: `${gameTitle} PFP Maker - Free AI Custom Profile Pictures | GamingLogoAI`,
    metaDescription: `Create a custom ${gameTitle} PFP from your photo with our free AI generator! Turn your face into a unique ${gameTitle}-style avatar for Discord, YouTube, or Twitch.`,
    keywords: `${gameTitle} pfp maker, custom ${gameTitle} pfp, ${gameTitle} profile picture, free ${gameTitle} pfp, ${gameTitle} avatar`,
    canonicalUrl: `https://gaminglogoai.com/pfp/games/${slug}`,
    h1: <>AI <span className="text-cyan-400">{gameTitle} PFP</span> Maker</>,
    heroBeforeImageSrc: "/handsome-man.webp",
    heroAfterImageSrc: styleItem.src,
    introParagraph: <>Turn your photo into a legendary {gameTitle}-style avatar! Create a custom profile picture for Discord, YouTube, Twitch, and more in seconds.</>,
    ctaText: "Make Your PFP Now (1 Free Credit)",
    handleCtaClick,
    showcaseTitle: <>From Selfie to <span className="text-purple-600 dark:text-cyan-400">{gameTitle} Legend</span></>,
    imageShowcaseGrid: [
      { src: styleItem.src, alt: `AI generated custom PFP in the style of ${styleItem.name}` },
      ...otherShowcaseItems.map(item => ({
        src: item.src,
        alt: `AI generated custom PFP in the style of ${item.name}`,
      }))
    ],
    howItWorksTitle: <>Create Your <span className="text-purple-600 dark:text-cyan-400">Custom {gameTitle} PFP</span></>,
    faqTitle: <>Your <span className="text-purple-600 dark:text-cyan-400">{gameTitle} PFP</span> Questions</>,
    faqItems: [
        { q: `Is this a free ${gameTitle} PFP maker?`, a: "Yes, you can get started for free! Every new user gets 1 free credit to generate and download their first custom profile picture." },
        { q: `How do I make my own ${gameTitle} PFP?`, a: `It's easy! Just upload a photo of yourself, choose a style inspired by ${gameTitle}, and our AI PFP creator will do the rest.` },
    ],
    finalCtaTitle: <>Ready to Level Up Your Profile?</>,
    finalCtaParagraph: <>Stop using default icons. Create a custom {gameTitle} PFP that shows off your personality.</>,
    relatedItems,
  };

  return <PseoPfpPageTemplate {...templateProps} />;
};
export default PfpGamePage;


// --- SERVER-SIDE DATA FETCHING (DERIVED DIRECTLY FROM faceStylesData) ---

// Helper to get a flat list of all individual game title styles
const getAllGameTitleStyles = (): PfpStyleItem[] => {
    const gameTitleData = faceStylesData["Game Title"] || {};
    return Object.values(gameTitleData).flat();
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allGameStyles = getAllGameTitleStyles();

  const paths = allGameStyles.map((item) => ({
    params: { slug: createSlug(item.name, '-pfp-maker') },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PfpGamePageServerProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const allGameStyles = getAllGameTitleStyles();
  
  // Find the specific style item that matches the slug
  const matchedStyleItem = allGameStyles.find(
    (item) => createSlug(item.name, '-pfp-maker') === slug
  );

  if (!matchedStyleItem) {
    return { notFound: true };
  }
  
  const gameTitle = matchedStyleItem.name;

  const otherShowcaseItems = getShowcaseItems(faceStylesData, "Game Title", gameTitle, 3);
  const relatedItems = getStaticRelatedItems({ tool: 'pfp', excludeName: gameTitle });

  return {
    props: {
      gameTitle: gameTitle,
      styleItem: matchedStyleItem,
      slug: slug,
      relatedItems: relatedItems,
      otherShowcaseItems: otherShowcaseItems,
    },
  };
};