/* eslint-disable @typescript-eslint/require-await */
// src/pages/pfp/styles/[slug].tsx
import { type NextPage, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import PseoPfpPageTemplate, { PseoPfpPageTemplateProps } from "~/component/pSEO/PseoPfpPageTemplate";
import { faceStylesData } from "~/data/faceStylesData";
import { createSlug } from "~/lib/utils";
import { getStaticRelatedItems, RelatedItem, getShowcaseItems } from "~/lib/pSEO";

interface PfpStyleItem { name: string; src: string; basePrompt: string; }
interface PfpStylePageServerProps {
  styleName: string;
  styleItem: PfpStyleItem;
  slug: string;
  relatedItems: RelatedItem[];
  otherShowcaseItems: PfpStyleItem[];
}

const PfpStylePage: NextPage<PfpStylePageServerProps> = ({ styleName, styleItem, slug, relatedItems, otherShowcaseItems }) => {
  const router = useRouter();
  const handleCtaClick = () => { void router.push(`/pfp-maker#${encodeURIComponent(styleName)}`); };

  const templateProps: PseoPfpPageTemplateProps = {
    pageTitle: `${styleName} Avatar Maker - AI Avatar & Profile Picture Generator`,
    metaDescription: `Create a custom ${styleName} Avatar from your photo with our AI pfp generator. Transform your face into a unique profile picture for Discord, YouTube, or Twitch.`,
    keywords: `${styleName} avatar maker, custom ${styleName} avatar, ${styleName} profile picture, ai avatar generator`,
    canonicalUrl: `https://gaminglogoai.com/pfp/styles/${slug}`,
    h1: <>AI <span className="text-cyan-400">{styleName}</span> Avatar Maker</>,
    heroBeforeImageSrc: "/handsome-man.webp",
    heroAfterImageSrc: styleItem.src,
    introParagraph: <>Turn your photo into a stunning {styleName}-style avatar! Create a unique custom profile picture that truly represents you.</>,
    ctaText: "Create My Avatar Now",
    handleCtaClick,
    showcaseTitle: <>From Your Photo to <span className="text-purple-600 dark-text-cyan-400">{styleName} Art</span></>,
    imageShowcaseGrid: [ { src: styleItem.src, alt: `AI generated Avatar in the ${styleName} style` }, ...otherShowcaseItems.map(item => ({ src: item.src, alt: `AI generated Avatar in the ${item.name} style` })) ],
    howItWorksTitle: <>Create Your <span className="text-purple-600 dark-text-cyan-400">Custom Avatar</span> in 3 Steps</>,
    faqTitle: <>Your <span className="text-purple-600 dark-text-cyan-400">{styleName} Avatar</span> Questions</>,
    faqItems: [ { q: `How does the AI create a ${styleName} profile picture?`, a: `Our AI analyzes your facial features and re-interprets them in the ${styleName} aesthetic, maintaining your likeness while transforming the art style into a custom avatar.` }, ],
    finalCtaTitle: <>Ready to See Yourself as Art?</>,
    finalCtaParagraph: <>Create a custom {styleName} Avatar that stands out from the crowd. Get started with your free credit!</>,
    relatedItems,
  };

  return <PseoPfpPageTemplate {...templateProps} />;
};
export default PfpStylePage;

// --- CORRECTED SERVER-SIDE LOGIC ---
const getAllArtStyles = (): PfpStyleItem[] => {
    const artStyleData = faceStylesData["Art Style"] || {};
    return Object.values(artStyleData).flat();
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allStyles = getAllArtStyles();
  const paths = allStyles.map((item) => ({
    params: { slug: createSlug(item.name, '-avatar-maker') },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PfpStylePageServerProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const allStyles = getAllArtStyles();
  const matchedStyleItem = allStyles.find((item) => createSlug(item.name, '-avatar-maker') === slug);

  if (!matchedStyleItem) return { notFound: true };
  
  const styleName = matchedStyleItem.name;
  const otherShowcaseItems = getShowcaseItems(faceStylesData, "Art Style", styleName, 3);
  const relatedItems = getStaticRelatedItems({ tool: 'pfp', excludeName: styleName });

  return { props: { styleName, styleItem: matchedStyleItem, slug, relatedItems, otherShowcaseItems } };
};