import { useRouter } from "next/router";
import PseoLogoPageTemplate from "src/component/pSEO/PseoLogoPageTemplate";
import { gamerStylesData } from "src/data/gamerStylesData";
import { createSlug } from "src/lib/utils";
import { getStaticRelatedItems } from "src/lib/pSEO";
const ArtStyleLogoPage = ({ artStyle, images, slug, relatedItems }) => {
    var _a;
    const router = useRouter();
    const handleCtaClick = () => {
        // Note: The query param is '?style='
        void router.push(`/gaming-logo-maker#${encodeURIComponent(artStyle)}`);
    };
    // Construct the full props for the template here (client-side)
    const templateProps = {
        pageTitle: `${artStyle} Gaming Logo Design - Create ${artStyle}-Style Logos with AI`,
        metaDescription: `Design stunning ${artStyle} gaming logos with our AI generator. Create unique cartoonish, 8-bit, emblem, or kawaii logos for your brand in seconds.`,
        keywords: `${artStyle} logo design, ${artStyle} gaming logo, custom ${artStyle} logo, ai logo maker`,
        canonicalUrl: `https://gaminglogoai.com/logo/styles/${slug}`,
        h1: <>Create an <span className="text-cyan-400">{artStyle}</span> Gaming Logo</>,
        heroImageSrc: ((_a = images[0]) === null || _a === void 0 ? void 0 : _a.src) || "/styles/default-art-icon.webp",
        introParagraph: <>Unleash your creativity and design a professional <strong>{artStyle}</strong> style logo. Our AI makes it easy to capture the perfect aesthetic for your brand.</>,
        ctaText: `Design a ${artStyle} Logo Now`,
        handleCtaClick: handleCtaClick,
        showcaseTitle: <>Incredible <span className="text-purple-600 dark:text-cyan-400">{artStyle}</span> Logo Examples</>,
        imageShowcaseGrid: images.slice(0, 8).map(img => ({ src: img.src, alt: `${artStyle} gaming logo design example` })),
        relatedItems: relatedItems,
        faqTitle: <>Your <span className="text-purple-600 dark:text-cyan-400">{artStyle} Logo</span> Questions</>,
        finalCtaTitle: <>Ready to Design an <span className="text-purple-600 dark:text-cyan-400">{artStyle} Logo</span>?</>,
        faqItems: [
            { q: `What defines the ${artStyle} logo style?`, a: `The ${artStyle} style is characterized by its unique visual language. Whether it's the retro charm of 8-bit or the clean lines of an emblem, our AI captures its essence.` },
            { q: `Is a ${artStyle} logo good for a Twitch stream?`, a: `Definitely. A strong ${artStyle} logo helps you stand out and build a memorable brand. It's perfect for overlays, emotes, and channel branding.` },
        ],
    };
    return <PseoLogoPageTemplate {...templateProps}/>;
};
export default ArtStyleLogoPage;
export const getStaticPaths = async () => {
    const artStyles = gamerStylesData["Art"] || {};
    const paths = Object.keys(artStyles).map((style) => ({
        params: { slug: createSlug(style, '-logo-design') },
    }));
    return { paths, fallback: false };
};
export const getStaticProps = async ({ params }) => {
    var _a;
    const slug = params === null || params === void 0 ? void 0 : params.slug;
    const artStylesData = gamerStylesData["Art"] || {};
    const matchedArtStyle = Object.keys(artStylesData).find((key) => createSlug(key, '-logo-design') === slug);
    if (!matchedArtStyle)
        return { notFound: true };
    const toHighQuality = (src) => src.replace('.webp', 'e.webp');
    const images = ((_a = artStylesData[matchedArtStyle]) === null || _a === void 0 ? void 0 : _a.map(img => (Object.assign(Object.assign({}, img), { src: toHighQuality(img.src) })))) || [];
    const relatedItems = getStaticRelatedItems({
        tool: 'logo',
        excludeName: matchedArtStyle,
    });
    return {
        props: {
            artStyle: matchedArtStyle,
            images: images,
            slug: slug,
            relatedItems: relatedItems,
        },
    };
};
