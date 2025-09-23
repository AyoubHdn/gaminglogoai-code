/* eslint-disable @typescript-eslint/require-await */
// src/pages/logos/genres/[slug].tsx
import { type NextPage, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router"; // IMPORTANT: Import useRouter
import PseoLogoPageTemplate, { PseoLogoPageTemplateProps } from "src/component/pSEO/PseoLogoPageTemplate";
import { gamerStylesData } from "src/data/gamerStylesData";
import { createSlug } from "src/lib/utils";
import { getStaticRelatedItems, RelatedItem } from "src/lib/pSEO";

// STEP 1: Define a type for the simple, serializable data from getStaticProps
interface GenreLogoPageServerProps {
  genre: string;
  images: { src: string; basePrompt: string }[];
  slug: string;
  relatedItems: RelatedItem[];
}

// STEP 2: The Page component now receives the simple server props
const GenreLogoPage: NextPage<GenreLogoPageServerProps> = ({ genre, images, slug, relatedItems }) => {
  const router = useRouter();

  // The click handler is defined here, on the client-side, using the router.
  const handleCtaClick = () => {
    void router.push(`/gaming-logo-maker#${encodeURIComponent(genre)}`);
  };

  // STEP 3: CONSTRUCT the complex props (with JSX) inside the component
  // This happens on the client-side, so JSX is allowed here.
  const templateProps: PseoLogoPageTemplateProps = {
    pageTitle: `${genre} Gaming Logo Design - AI-Powered Ideas`,
    metaDescription: `Generate unique ${genre} gaming logos for your team. Create stunning logos for MOBA, FPS, RPG, and other game genres instantly with AI.`,
    keywords: `${genre} gaming logo, ${genre} logo design, esports logo`,
    canonicalUrl: `https://gaminglogoai.com/logos/genres/${slug}`,
    // JSX is created here
    h1: <><span className="text-cyan-400">{genre}</span> Gaming Logo Design</>,
    heroImageSrc: images[0]?.src || "/styles/default-gaming-icon.webp",
    // JSX is created here
    introParagraph: <>Create the perfect logo for your <strong>{genre}</strong> team, clan, or stream. Our AI generates professional esports emblems in seconds.</>,
    ctaText: `Design Your ${genre} Logo Now`,
    handleCtaClick: handleCtaClick, // Pass the client-side function
    // JSX is created here
    showcaseTitle: <>Stunning <span className="text-purple-600 dark:text-cyan-400">{genre}</span> Logo Examples</>,
    imageShowcaseGrid: images.slice(0, 8).map(img => ({ src: img.src, alt: `${genre} gaming logo example` })),
    relatedItems: relatedItems,
    // JSX is created here
    faqTitle: <>Your <span className="text-purple-600 dark:text-cyan-400">{genre} Logo</span> Questions</>,
    // JSX is created here
    finalCtaTitle: <>Ready to Create Your Custom <span className="text-purple-600 dark:text-cyan-400">{genre} Logo</span>?</>,
    faqItems: [
        { q: `What makes a good ${genre} logo?`, a: `A great ${genre} logo often reflects the genre's core mechanics, using dynamic shapes for action games or intricate symbols for RPGs.` },
        { q: `Can I use these logos for my ${genre} esports team?`, a: `Absolutely! The high-resolution downloads are perfect for team banners, social media, and jerseys.` },
    ],
  };

  // STEP 4: Pass the fully constructed props to the template
  return <PseoLogoPageTemplate {...templateProps} />;
};
export default GenreLogoPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const gameGenres = gamerStylesData["Game Genres"] || {};
  const paths = Object.keys(gameGenres).map((genre) => ({
    // Use the createSlug helper for consistency
    params: { slug: createSlug(genre, '-logo-design') },
  }));

  return { paths, fallback: false };
};

// STEP 5: getStaticProps now returns ONLY serializable data
export const getStaticProps: GetStaticProps<GenreLogoPageServerProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const gameGenresData = gamerStylesData["Game Genres"] || {};
  const matchedGenre = Object.keys(gameGenresData).find(
    (key) => createSlug(key, '-logo-design') === slug
  );

  if (!matchedGenre) return { notFound: true };

  const toHighQuality = (src: string) => src.replace('.webp', 'e.webp');
  const images = gameGenresData[matchedGenre]?.map(img => ({ ...img, src: toHighQuality(img.src) })) || [];

const relatedItems = getStaticRelatedItems({
    excludeCategory: "Game Genres",
    excludeName: matchedGenre,
  });

  return {
    props: {
      genre: matchedGenre,
      images: images,
      slug: slug,
      relatedItems: relatedItems,
    },
  };
};