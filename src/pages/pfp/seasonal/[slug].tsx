/* eslint-disable @typescript-eslint/require-await */
// src/pages/pfp/seasonal/[slug].tsx
import { type NextPage, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import PseoPfpPageTemplate, { PseoPfpPageTemplateProps } from "~/component/pSEO/PseoPfpPageTemplate";
import { faceStylesData } from "~/data/faceStylesData";
import { createSlug } from "~/lib/utils";
import { getStaticRelatedItems, RelatedItem, getShowcaseItems } from "~/lib/pSEO";

interface PfpStyleItem { name: string; src: string; basePrompt: string; }
interface PfpSeasonalPageServerProps {
  seasonalName: string;
  styleItem: PfpStyleItem;
  slug: string;
  relatedItems: RelatedItem[];
  otherShowcaseItems: PfpStyleItem[];
}

const PfpSeasonalPage: NextPage<PfpSeasonalPageServerProps> = ({ seasonalName, styleItem, slug, relatedItems, otherShowcaseItems }) => {
  const router = useRouter();
  const handleCtaClick = () => { void router.push(`/pfp-maker#${encodeURIComponent(seasonalName)}`); };

  const templateProps: PseoPfpPageTemplateProps = {
    pageTitle: `${seasonalName} PFP Maker - AI Custom Avatars for Events`,
    metaDescription: `Get festive with a custom ${seasonalName} PFP! Use our AI avatar generator to create unique profile pictures for holidays and cultural events.`,
    keywords: `${seasonalName} pfp maker, custom ${seasonalName} pfp, holiday avatar maker`,
    canonicalUrl: `https://gaminglogoai.com/pfp/seasonal/${slug}`,
    h1: <>AI <span className="text-cyan-400">{seasonalName}</span> PFP Generator</>,
    heroBeforeImageSrc: "/handsome-man.webp",
    heroAfterImageSrc: styleItem.src,
    introParagraph: <>Celebrate in style by transforming your photo into a unique avatar perfect for any <strong>{seasonalName}</strong> event.</>,
    ctaText: "Create My Event PFP",
    handleCtaClick,
    showcaseTitle: <>Festive <span className="text-purple-600 dark-text-cyan-400">{seasonalName}</span> PFP Examples</>,
    imageShowcaseGrid: [ { src: styleItem.src, alt: `AI generated PFP for ${seasonalName}` }, ...otherShowcaseItems.map(item => ({ src: item.src, alt: `AI generated PFP for ${item.name}` })) ],
    howItWorksTitle: <>Create Your <span className="text-purple-600 dark-text-cyan-400">Seasonal Avatar</span></>,
    faqTitle: <>Your <span className="text-purple-600 dark-text-cyan-400">Seasonal PFP</span> Questions</>,
    faqItems: [ { q: `Can I make a PFP for a specific holiday?`, a: `Yes! Our tool includes styles for Halloween, Christmas, Valentine's Day, and more. It's the perfect way to get your profile ready for any event.` }, ],
    finalCtaTitle: <>Ready to Get Festive?</>,
    finalCtaParagraph: <>Create a custom PFP that celebrates your favorite holidays and events. Start now!</>,
    relatedItems,
  };

  return <PseoPfpPageTemplate {...templateProps} />;
};
export default PfpSeasonalPage;

// --- CORRECTED SERVER-SIDE LOGIC ---
const getAllSeasonalStyles = (): PfpStyleItem[] => {
    const seasonalData = faceStylesData["Seasonal & Cultural"] || {};
    return Object.values(seasonalData).flat();
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allStyles = getAllSeasonalStyles();
  const paths = allStyles.map((item) => ({
    params: { slug: createSlug(item.name, '-pfp-maker') },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PfpSeasonalPageServerProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const allStyles = getAllSeasonalStyles();
  const matchedStyleItem = allStyles.find((item) => createSlug(item.name, '-pfp-maker') === slug);

  if (!matchedStyleItem) return { notFound: true };
  
  const seasonalName = matchedStyleItem.name;
  const otherShowcaseItems = getShowcaseItems(faceStylesData, "Seasonal & Cultural", seasonalName, 3);
  const relatedItems = getStaticRelatedItems({ tool: 'pfp', excludeName: seasonalName });

  return { props: { seasonalName, styleItem: matchedStyleItem, slug, relatedItems, otherShowcaseItems } };
};