/* eslint-disable @typescript-eslint/require-await */
// src/pages/logo/holidays/[slug].tsx
import { type NextPage, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import PseoLogoPageTemplate, { PseoLogoPageTemplateProps } from "src/component/pSEO/PseoLogoPageTemplate";
import { gamerStylesData } from "src/data/gamerStylesData";
import { createSlug } from "src/lib/utils";
import { getStaticRelatedItems, RelatedItem } from "src/lib/pSEO";

// Simple, serializable props from the server
interface HolidayLogoPageServerProps {
  holiday: string;
  images: { src: string; basePrompt: string }[];
  slug: string;
    relatedItems: RelatedItem[];
}

const HolidayLogoPage: NextPage<HolidayLogoPageServerProps> = ({ holiday, images, slug, relatedItems }) => {
  const router = useRouter();

  const handleCtaClick = () => {
    // Use the 'theme' param as it's a good fit for seasonal events
    void router.push(`/gaming-logo-maker#${encodeURIComponent(holiday)}`);
  };

  // Construct the full props for the template here (client-side)
  const templateProps: PseoLogoPageTemplateProps = {
    pageTitle: `${holiday} Gaming Logos - Create Seasonal & Holiday Logos`,
    metaDescription: `Celebrate with a custom ${holiday} gaming logo! Perfect for seasonal events, holiday streams, and festive team branding. Create yours instantly with AI.`,
    keywords: `${holiday} gaming logo, ${holiday} logo, seasonal logo maker, halloween logo, christmas logo`,
    canonicalUrl: `https://gaminglogoai.com/logo/holidays/${slug}`,
    h1: <><span className="text-cyan-400">{holiday}</span> Themed Gaming Logos</>,
    heroImageSrc: images[0]?.src || "/styles/default-holiday-icon.webp",
    introParagraph: <>Get in the spirit with a custom <strong>{holiday}</strong> logo! Perfect for special events, tournament branding, or just having fun with your stream&lsquo;s identity.</>,
    ctaText: `Create a ${holiday} Logo`,
    handleCtaClick: handleCtaClick,
    showcaseTitle: <>Festive <span className="text-purple-600 dark:text-cyan-400">{holiday}</span> Logo Ideas</>,
    imageShowcaseGrid: images.slice(0, 8).map(img => ({ src: img.src, alt: `${holiday} themed gaming logo example` })),
    relatedItems: relatedItems,
    faqTitle: <>Your <span className="text-purple-600 dark:text-cyan-400">{holiday} Logo</span> Questions</>,
    finalCtaTitle: <>Design Your <span className="text-purple-600 dark:text-cyan-400">{holiday} Logo</span> Today!</>,
    faqItems: [
      { q: `When should I use a ${holiday} logo?`, a: `A ${holiday} logo is fantastic for limited-time events, special streams during the season, or for teams that have a festive theme year-round.` },
      { q: `Can I use these for a tournament?`, a: `Yes! A seasonal logo is a great way to brand a holiday-themed gaming tournament or community event, making it more memorable for participants.` },
    ],
  };

  return <PseoLogoPageTemplate {...templateProps} />;
};
export default HolidayLogoPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const holidays = gamerStylesData["Holidays & Seasonal"] || {};
  const paths = Object.keys(holidays).map((holiday) => ({
    params: { slug: createSlug(holiday, '-gaming-logo') },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<HolidayLogoPageServerProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const holidaysData = gamerStylesData["Holidays & Seasonal"] || {};
  const matchedHoliday = Object.keys(holidaysData).find(
    (key) => createSlug(key, '-gaming-logo') === slug
  );

  if (!matchedHoliday) return { notFound: true };

  const toHighQuality = (src: string) => src.replace('.webp', 'e.webp');
  const images = holidaysData[matchedHoliday]?.map(img => ({ ...img, src: toHighQuality(img.src) })) || [];

  const relatedItems = getStaticRelatedItems({
    tool: 'logo',
    excludeName: matchedHoliday,
  });

  return {
    props: {
      holiday: matchedHoliday,
      images: images,
      slug: slug,
      relatedItems: relatedItems,
    },
  };
};