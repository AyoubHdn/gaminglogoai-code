import { useRouter } from "next/router";
import PseoLogoPageTemplate from "src/component/pSEO/PseoLogoPageTemplate";
import { gamerStylesData } from "src/data/gamerStylesData";
import { createSlug } from "src/lib/utils";
import { getStaticRelatedItems } from "src/lib/pSEO";
const ColorLogoPage = ({ color, images, slug, relatedItems }) => {
    var _a;
    const router = useRouter();
    const handleCtaClick = () => {
        // Note: The query param is '?color='
        void router.push(`/gaming-logo-maker#${encodeURIComponent(color)}`);
    };
    // Construct the full props for the template here (client-side)
    const templateProps = {
        pageTitle: `${color} Gaming Logos - Design ${color}-Colored Logos with AI`,
        metaDescription: `Create powerful ${color} gaming logos with our AI generator. Design logos featuring your favorite colors to build a strong brand identity for your team or stream.`,
        keywords: `${color} gaming logo, ${color} logo design, ${color} esports logo, colored logo maker`,
        canonicalUrl: `https://gaminglogoai.com/logo/colors/${slug}`,
        h1: <>Vibrant <span className="text-cyan-400">{color}</span> Gaming Logos</>,
        heroImageSrc: ((_a = images[0]) === null || _a === void 0 ? void 0 : _a.src) || "/styles/default-color-icon.webp",
        introParagraph: <>Make your brand pop with a custom <strong>{color}</strong> logo. Color is key to a memorable identity, and our AI makes it easy to generate stunning designs.</>,
        ctaText: `Design a ${color} Logo`,
        handleCtaClick: handleCtaClick,
        showcaseTitle: <>Striking <span className="text-purple-600 dark:text-cyan-400">{color}</span> Logo Designs</>,
        imageShowcaseGrid: images.slice(0, 8).map(img => ({ src: img.src, alt: `${color} gaming logo design example` })),
        relatedItems: relatedItems,
        faqTitle: <>Your <span className="text-purple-600 dark:text-cyan-400">{color} Logo</span> Questions</>,
        finalCtaTitle: <>Ready to Design a <span className="text-purple-600 dark:text-cyan-400">{color} Logo</span>?</>,
        faqItems: [
            { q: `Why should I choose a ${color} logo?`, a: `The color ${color} often represents specific emotions in branding. Using it can help convey your team's personality, whether it's aggressive, calm, or energetic.` },
            { q: `Can I combine ${color} with other colors in the generator?`, a: `Yes! While these styles feature ${color} prominently, you can add other color names to your text prompt in the logo maker to create unique combinations.` },
        ],
    };
    return <PseoLogoPageTemplate {...templateProps}/>;
};
export default ColorLogoPage;
export const getStaticPaths = async () => {
    const colors = gamerStylesData["Colors"] || {};
    const paths = Object.keys(colors).map((color) => ({
        params: { slug: createSlug(color, '-gaming-logo') },
    }));
    return { paths, fallback: false };
};
export const getStaticProps = async ({ params }) => {
    var _a;
    const slug = params === null || params === void 0 ? void 0 : params.slug;
    const colorsData = gamerStylesData["Colors"] || {};
    const matchedColor = Object.keys(colorsData).find((key) => createSlug(key, '-gaming-logo') === slug);
    if (!matchedColor)
        return { notFound: true };
    const toHighQuality = (src) => src.replace('.webp', 'e.webp');
    const images = ((_a = colorsData[matchedColor]) === null || _a === void 0 ? void 0 : _a.map(img => (Object.assign(Object.assign({}, img), { src: toHighQuality(img.src) })))) || [];
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
