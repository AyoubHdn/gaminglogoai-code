/* eslint-disable @typescript-eslint/require-await */
// src/pages/pfp/themes/[slug].tsx
import { type NextPage, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import PseoPfpPageTemplate, { PseoPfpPageTemplateProps } from "~/component/pSEO/PseoPfpPageTemplate";
import { faceStylesData } from "~/data/faceStylesData";
import { createSlug } from "~/lib/utils";
import { getStaticRelatedItems, RelatedItem, getShowcaseItems } from "~/lib/pSEO";

interface PfpStyleItem { name: string; src: string; basePrompt: string; }
interface PfpThemePageServerProps {
  themeName: string;
  styleItem: PfpStyleItem;
  slug: string;
  relatedItems: RelatedItem[];
  otherShowcaseItems: PfpStyleItem[];
}

const PfpThemePage: NextPage<PfpThemePageServerProps> = ({ themeName, styleItem, slug, relatedItems, otherShowcaseItems }) => {
  const router = useRouter();
  const handleCtaClick = () => { void router.push(`/pfp-maker#${encodeURIComponent(themeName)}`); };

  const templateProps: PseoPfpPageTemplateProps = {
    pageTitle: `${themeName} Avatar Maker - AI Themed Custom Profile Pictures`,
    metaDescription: `Generate a custom Avatar with a ${themeName} theme using our avatar maker. Turn your photo into a unique profile picture for fantasy, sci-fi, horror, and more.`,
    keywords: `${themeName} avatar maker, custom ${themeName} avatar, ${themeName} profile picture, fantasy avatar`,
    canonicalUrl: `https://gaminglogoai.com/pfp/themes/${slug}`,
    h1: <>AI <span className="text-cyan-400">{themeName}</span> Avatar Generator</>,
    heroBeforeImageSrc: "/handsome-man.webp",
    heroAfterImageSrc: styleItem.src,
    introParagraph: <>Unleash your imagination and transform your photo into a stunning custom profile picture with a <strong>{themeName}</strong> theme.</>,
    ctaText: "Create My Themed Avatar",
    handleCtaClick,
    showcaseTitle: <>Examples of <span className="text-purple-600 dark-text-cyan-400">{themeName}</span> Avatars</>,
    imageShowcaseGrid: [ { src: styleItem.src, alt: `AI generated Avatar with a ${themeName} theme` }, ...otherShowcaseItems.map(item => ({ src: item.src, alt: `AI generated Avatar with a ${item.name} theme` })) ],
    howItWorksTitle: <>Create Your <span className="text-purple-600 dark-text-cyan-400">Themed Avatar</span></>,
    faqTitle: <>Your <span className="text-purple-600 dark-text-cyan-400">Themed Avatar</span> Questions</>,
    faqItems: [ { q: `What kind of ${themeName} themes can I choose?`, a: `Our AI can generate avatars in a variety of themes, including high fantasy, cyberpunk sci-fi, dark horror, and heroic warriors.` }, ],
    finalCtaTitle: <>Ready to Redefine Your Identity?</>,
    finalCtaParagraph: <>Craft a unique Avatar that perfectly captures your favorite theme and create your custom profile picture now!</>,
    relatedItems,
  };

  return <PseoPfpPageTemplate {...templateProps} />;
};
export default PfpThemePage;

// --- CORRECTED SERVER-SIDE LOGIC ---
const getAllThemeStyles = (): PfpStyleItem[] => {
    const themeData = faceStylesData["Theme & Motif"] || {};
    return Object.values(themeData).flat();
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allStyles = getAllThemeStyles();
  const paths = allStyles.map((item) => ({
    params: { slug: createSlug(item.name, '-avatar-maker') },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PfpThemePageServerProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const allStyles = getAllThemeStyles();
  const matchedStyleItem = allStyles.find((item) => createSlug(item.name, '-avatar-maker') === slug);

  if (!matchedStyleItem) return { notFound: true };
  
  const themeName = matchedStyleItem.name;
  const otherShowcaseItems = getShowcaseItems(faceStylesData, "Theme & Motif", themeName, 3);
  const relatedItems = getStaticRelatedItems({ tool: 'pfp', excludeName: themeName });

  return { props: { themeName, styleItem: matchedStyleItem, slug, relatedItems, otherShowcaseItems } };
};