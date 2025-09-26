/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
// src/pages/logo/games/[slug].tsx
import { type NextPage, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import PseoLogoPageTemplate, { PseoLogoPageTemplateProps } from "src/component/pSEO/PseoLogoPageTemplate";
import { gamerStylesData } from "src/data/gamerStylesData";
import { createSlug } from "src/lib/utils";
import { getStaticRelatedItems, RelatedItem } from "src/lib/pSEO";

// Simple, serializable props from the server
interface GameTitleLogoPageServerProps {
  gameTitle: string;
  images: { src: string; basePrompt: string }[];
  slug: string;
  relatedItems: RelatedItem[];
}

const GameTitleLogoPage: NextPage<GameTitleLogoPageServerProps> = ({ gameTitle, images, slug, relatedItems }) => {
  const router = useRouter();

  const handleCtaClick = () => {
    // Note: The query param is '?game='
    void router.push(`/gaming-logo-maker#${encodeURIComponent(gameTitle)}`);
  };

  // Construct the full props for the template here (client-side)
  const templateProps: PseoLogoPageTemplateProps = {
    pageTitle: `${gameTitle} Logo Maker - Create Custom Gaming Logos | GamingLogoAI`,
    metaDescription: `Design unique ${gameTitle} logos for your clan, team, or stream instantly with our AI logo generator. Get inspired by custom ${gameTitle} logo ideas.`,
    keywords: `${gameTitle} logo maker, gaming logo ${gameTitle}, esports logo ${gameTitle}, custom ${gameTitle} logo`,
    canonicalUrl: `https://gaminglogoai.com/logo/games/${slug}`,
    h1: <><span className="text-cyan-400">{gameTitle}</span> Logo Maker</>,
    heroImageSrc: images[0]?.src || "/styles/default-gaming-icon.webp",
    introParagraph: <>Forge a unique identity inspired by <strong>{gameTitle}</strong> with our AI-powered logo creator. Perfect for crafting a memorable <strong>clan logo</strong>.</>,
    ctaText: `Design Your ${gameTitle} Logo Now`,
    handleCtaClick: handleCtaClick,
    showcaseTitle: <>Inspiring <span className="text-purple-600 dark:text-cyan-400">{gameTitle}</span> Logo Ideas</>,
    imageShowcaseGrid: images.slice(0, 8).map(img => ({ src: img.src, alt: `${gameTitle} gaming logo example` })),
    relatedItems: relatedItems,
    faqTitle: <>Your <span className="text-purple-600 dark:text-cyan-400">{gameTitle} Logo</span> Questions</>,
    finalCtaTitle: <>Ready to Create Your Custom <span className="text-purple-600 dark:text-cyan-400">{gameTitle} Logo</span>?</>,
    faqItems: [
      { q: `Can I create a logo that matches the ${gameTitle} art style?`, a: `Yes! Our AI has been trained on the key visual elements of ${gameTitle}, allowing you to generate logos that feel authentic to the game's universe.` },
      { q: `Is this a good ${gameTitle} clan logo maker?`, a: `Perfect for it. You can generate a high-quality emblem for your clan in minutes, ready to be used on Discord, social media, and in-game.` },
    ],
  };

  return <PseoLogoPageTemplate {...templateProps} />;
};
export default GameTitleLogoPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const gameTitles = gamerStylesData["Game Titles"] || {};
  const paths = Object.keys(gameTitles).map((game) => ({
    params: { slug: createSlug(game, '-logo-maker') },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<GameTitleLogoPageServerProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const gameTitlesData = gamerStylesData["Game Titles"] || {};
  const matchedGameTitle = Object.keys(gameTitlesData).find(
    (key) => createSlug(key, '-logo-maker') === slug
  );

  if (!matchedGameTitle) return { notFound: true };

  const toHighQuality = (src: string) => src.replace('.webp', 'e.webp');
  const images = gameTitlesData[matchedGameTitle]?.map(img => ({ ...img, src: toHighQuality(img.src) })) || [];

  const relatedItems = getStaticRelatedItems({
    tool: 'logo',
    excludeName: matchedGameTitle,
  });

  return {
    props: {
      gameTitle: matchedGameTitle,
      images: images,
      slug: slug,
      relatedItems: relatedItems,
    },
  };
};