/* eslint-disable @typescript-eslint/require-await */
// src/pages/logo/colors/[slug].tsx
import { type NextPage, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import PseoLogoPageTemplate, { PseoLogoPageTemplateProps } from "src/component/pSEO/PseoLogoPageTemplate";
import { gamerStylesData } from "src/data/gamerStylesData";
import { createSlug } from "src/lib/utils";
import { getStaticRelatedItems, RelatedItem } from "src/lib/pSEO";

// Simple, serializable props from the server
interface ColorLogoPageServerProps {
  color: string;
  images: { src: string; basePrompt: string }[];
  slug: string;
    relatedItems: RelatedItem[];
}

const ColorLogoPage: NextPage<ColorLogoPageServerProps> = ({ color, images, slug, relatedItems }) => {
  const router = useRouter();

  const handleCtaClick = () => {
    // Note: The query param is '?color='
    void router.push(`/gaming-logo-maker#${encodeURIComponent(color)}`);
  };

  // Construct the full props for the template here (client-side)
  const templateProps: PseoLogoPageTemplateProps = {
    pageTitle: `${color} Gaming Logos - Design ${color}-Colored Logos with AI`,
    metaDescription: `Create powerful ${color} gaming logos with our AI generator. Design logos featuring your favorite colors to build a strong brand identity for your team or stream.`,
    keywords: `${color} gaming logo, ${color} logo design, ${color} esports logo, colored logo maker`,
    canonicalUrl: `https://gaminglogoai.com/logo/colors/${slug}`,
    h1: <>Vibrant <span className="text-cyan-400">{color}</span> Gaming Logos</>,
    heroImageSrc: images[0]?.src || "/styles/default-color-icon.webp",
    introParagraph: <>Make your brand pop with a custom <strong>{color}</strong> logo. Color is key to a memorable identity, and our AI makes it easy to generate stunning designs.</>,
    ctaText: `Design a ${color} Logo`,
    handleCtaClick: handleCtaClick,
    showcaseTitle: <>Striking <span className="text-purple-600 dark:text-cyan-400">{color}</span> Logo Designs</>,
    imageShowcaseGrid: images.slice(0, 8).map(img => ({ src: img.src, alt: `${color} colored gaming logo example` })),
    relatedItems: relatedItems,
    faqTitle: <>Your <span className="text-purple-600 dark:text-cyan-400">{color} Logo</span> Questions</>,
    finalCtaTitle: <>Ready to Design a <span className="text-purple-600 dark:text-cyan-400">{color} Logo</span>?</>,
    faqItems: [
      { q: `Why should I choose a ${color} logo?`, a: `The color ${color} often represents specific emotions in branding. Using it can help convey your team's personality, whether it's aggressive, calm, or energetic.` },
      { q: `Can I combine ${color} with other colors in the generator?`, a: `Yes! While these styles feature ${color} prominently, you can add other color names to your text prompt in the logo maker to create unique combinations.` },
    ],
  };

  return <PseoLogoPageTemplate {...templateProps} />;
};
export default ColorLogoPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const colors = gamerStylesData["Colors"] || {};
  const paths = Object.keys(colors).map((color) => ({
    params: { slug: createSlug(color, '-gaming-logo') },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<ColorLogoPageServerProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const colorsData = gamerStylesData["Colors"] || {};
  const matchedColor = Object.keys(colorsData).find(
    (key) => createSlug(key, '-gaming-logo') === slug
  );

  if (!matchedColor) return { notFound: true };

  const toHighQuality = (src: string) => src.replace('.webp', 'e.webp');
  const images = colorsData[matchedColor]?.map(img => ({ ...img, src: toHighQuality(img.src) })) || [];

    const relatedItems = getStaticRelatedItems({
      tool: 'logo',
      excludeName: matchedColor,
    });
  return {
    props: {
      color: matchedColor,
      images: images,
      slug: slug,
      relatedItems: relatedItems,
    },
  };
};