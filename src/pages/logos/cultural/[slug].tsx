/* eslint-disable @typescript-eslint/require-await */
// src/pages/logos/cultural/[slug].tsx
import { type NextPage, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import PseoLogoPageTemplate, { PseoLogoPageTemplateProps } from "src/component/pSEO/PseoLogoPageTemplate";
import { gamerStylesData } from "src/data/gamerStylesData";
import { createSlug } from "src/lib/utils";
import { getStaticRelatedItems, RelatedItem } from "src/lib/pSEO";

// Simple, serializable props from the server
interface CulturalLogoPageServerProps {
  culture: string;
  images: { src: string; basePrompt: string }[];
  slug: string;
    relatedItems: RelatedItem[];
}

const CulturalLogoPage: NextPage<CulturalLogoPageServerProps> = ({ culture, images, slug, relatedItems }) => {
  const router = useRouter();

  const handleCtaClick = () => {
    void router.push(`/gaming-logo-maker#${encodeURIComponent(culture)}`);
  };

  const templateProps: PseoLogoPageTemplateProps = {
    pageTitle: `${culture} Esports Logos - AI-Generated Team & Clan Logos`,
    metaDescription: `Design a professional ${culture}-inspired esports logo with our AI generator. Perfect for national teams, cultural clans, and patriotic gamers.`,
    keywords: `${culture} esports logo, ${culture} gaming logo, patriotic logo, national team logo`,
    canonicalUrl: `https://gaminglogoai.com/logos/cultural/${slug}`,
    h1: <><span className="text-cyan-400">{culture}</span> Inspired Esports Logos</>,
    heroImageSrc: (images && images.length > 0 ? images[0]?.src ?? "/styles/default-cultural-icon.webp" : "/styles/default-cultural-icon.webp"),
    introParagraph: <>Represent with pride! Create a powerful esports logo inspired by <strong>{culture}</strong> themes. Perfect for national teams and community groups.</>,
    ctaText: `Design a ${culture} Esports Logo`,
    handleCtaClick: handleCtaClick,
    showcaseTitle: <>Powerful <span className="text-purple-600 dark:text-cyan-400">{culture}</span> Logo Designs</>,
    imageShowcaseGrid: images?.slice(0, 8).map(img => ({ src: img.src, alt: `${culture} inspired esports logo example` })) || [],
    relatedItems: relatedItems,
    faqTitle: <>Your <span className="text-purple-600 dark:text-cyan-400">{culture} Logo</span> Questions</>,
    finalCtaTitle: <>Create Your <span className="text-purple-600 dark:text-cyan-400">{culture} Logo</span> Now!</>,
    faqItems: [
      { q: `Can I create a logo for my national esports team?`, a: `Yes, this is the perfect tool for it. You can generate logos that incorporate national colors, symbols, and cultural motifs.` },
      { q: `How do I include my country's flag colors?`, a: `In the logo generator tool, you can add color names like "red, white, and blue" to your text prompt to guide the AI towards a specific color palette.` },
    ],
  };

  return <PseoLogoPageTemplate {...templateProps} />;
};
export default CulturalLogoPage;

export const getStaticPaths: GetStaticPaths = async () => {
  // FIXED: Using the exact key string from your data file. Note the special hyphen.
  // I recommend changing this in your data file to a standard hyphen `-` for consistency.
  const cultural = gamerStylesData["Real‐World / Cultural"] || {};
  const paths = Object.keys(cultural).map((item) => ({
    params: { slug: createSlug(item, '-esports-logo') },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<CulturalLogoPageServerProps> = async ({ params }) => {
  const slug = params?.slug as string;
  // FIXED: Using the exact key string from your data file.
  const culturalData = gamerStylesData["Real‐World / Cultural"] || {};
  const matchedCulture = Object.keys(culturalData).find(
    (key) => createSlug(key, '-esports-logo') === slug
  );

  if (!matchedCulture) {
    // This will now correctly trigger a 404 if a slug is invalid.
    return { notFound: true };
  }

  const toHighQuality = (src: string) => src.replace('.webp', 'e.webp');
  // This line is now safe because we know matchedCulture exists and culturalData is the correct object.
  const images = culturalData[matchedCulture]?.map(img => ({ ...img, src: toHighQuality(img.src) })) || [];

  const relatedItems = getStaticRelatedItems({
    excludeCategory: "Real‐World / Cultural",
    excludeName: matchedCulture,
  });

  return {
    props: {
      culture: matchedCulture,
      images: images,
      slug: slug,
      relatedItems: relatedItems,
    },
  };
};