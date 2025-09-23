/* eslint-disable @typescript-eslint/require-await */
// src/pages/logos/themes/[slug].tsx
import { type NextPage, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import PseoLogoPageTemplate, { PseoLogoPageTemplateProps } from "src/component/pSEO/PseoLogoPageTemplate";
import { gamerStylesData } from "src/data/gamerStylesData";
import { createSlug } from "src/lib/utils";
import { getStaticRelatedItems, RelatedItem } from "src/lib/pSEO";

// Simple, serializable props from the server
interface ThemeLogoPageServerProps {
  theme: string;
  images: { src: string; basePrompt: string }[];
  slug: string;
relatedItems: RelatedItem[];
}

const ThemeLogoPage: NextPage<ThemeLogoPageServerProps> = ({ theme, images, slug, relatedItems }) => {
  const router = useRouter();

  const handleCtaClick = () => {
    // Note: The query param is '?theme='
    void router.push(`/gaming-logo-maker#${encodeURIComponent(theme)}`);
  };

  // Construct the full props for the template here (client-side)
  const templateProps: PseoLogoPageTemplateProps = {
    pageTitle: `${theme} Gaming Logos - Create ${theme}-Themed Logos with AI`,
    metaDescription: `Generate powerful ${theme}-themed gaming logos. From epic Fantasy dragons to scary Horror mascots, our AI brings your creative vision to life.`,
    keywords: `${theme} gaming logo, ${theme} logo maker, ${theme} themed logo, fantasy logo, horror logo`,
    canonicalUrl: `https://gaminglogoai.com/logos/themes/${slug}`,
    h1: <><span className="text-cyan-400">{theme}</span> Themed Gaming Logos</>,
    heroImageSrc: images[0]?.src || "/styles/default-theme-icon.webp",
    introParagraph: <>Summon the perfect mascot for your brand with our <strong>{theme}</strong> themed logo generator. Ideal for clans and streamers looking for a powerful identity.</>,
    ctaText: `Create a ${theme} Logo`,
    handleCtaClick: handleCtaClick,
    showcaseTitle: <>Epic <span className="text-purple-600 dark:text-cyan-400">{theme}</span> Logo Concepts</>,
    imageShowcaseGrid: images.slice(0, 8).map(img => ({ src: img.src, alt: `${theme} themed gaming logo example` })),
    relatedItems: relatedItems,
    faqTitle: <>Your <span className="text-purple-600 dark:text-cyan-400">{theme} Logo</span> Questions</>,
    finalCtaTitle: <>Ready to Forge Your <span className="text-purple-600 dark:text-cyan-400">{theme} Logo</span>?</>,
    faqItems: [
      { q: `What kind of ${theme} logos can I make?`, a: `Our AI can generate a wide range of ${theme}-themed concepts, including fierce mascots, intricate symbols, and atmospheric emblems that perfectly match the theme.` },
      { q: `How do I get the best ${theme}-themed results?`, a: `While our pre-made styles are powerful, you can also add keywords like "aggressive," "mystical," or "dark" to your text prompt in the generator to further guide the AI.` },
    ],
  };

  return <PseoLogoPageTemplate {...templateProps} />;
};
export default ThemeLogoPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const themes = gamerStylesData["Themes & Motifs"] || {};
  const paths = Object.keys(themes).map((theme) => ({
    params: { slug: createSlug(theme, '-gaming-logo') },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<ThemeLogoPageServerProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const themesData = gamerStylesData["Themes & Motifs"] || {};
  const matchedTheme = Object.keys(themesData).find(
    (key) => createSlug(key, '-gaming-logo') === slug
  );

  if (!matchedTheme) return { notFound: true };

  const toHighQuality = (src: string) => src.replace('.webp', 'e.webp');
  const images = themesData[matchedTheme]?.map(img => ({ ...img, src: toHighQuality(img.src) })) || [];

    const relatedItems = getStaticRelatedItems({
      excludeCategory: "Themes & Motifs",
      excludeName: matchedTheme,
    });

  return {
    props: {
      theme: matchedTheme,
      images: images,
      relatedItems: relatedItems,
      slug: slug,
    },
  };
};