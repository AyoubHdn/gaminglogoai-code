import { useRouter } from "next/router";
import PseoLogoPageTemplate from "src/component/pSEO/PseoLogoPageTemplate";
import { gamerStylesData } from "src/data/gamerStylesData";
import { createSlug } from "src/lib/utils";
import { getStaticRelatedItems } from "src/lib/pSEO";
const ThemeLogoPage = ({ theme, images, slug, relatedItems }) => {
    var _a;
    const router = useRouter();
    const handleCtaClick = () => {
        // Note: The query param is '?theme='
        void router.push(`/gaming-logo-maker#${encodeURIComponent(theme)}`);
    };
    // Construct the full props for the template here (client-side)
    const templateProps = {
        pageTitle: `${theme} Gaming Logos - Create ${theme}-Themed Logos with AI`,
        metaDescription: `Generate powerful ${theme}-themed gaming logos. From epic Fantasy dragons to scary Horror mascots, our AI brings your creative vision to life.`,
        keywords: `${theme} gaming logo, ${theme} logo maker, ${theme} themed logo, fantasy logo, horror logo`,
        canonicalUrl: `https://gaminglogoai.com/logo/themes/${slug}`,
        h1: <><span className="text-cyan-400">{theme}</span> Themed Gaming Logos</>,
        heroImageSrc: ((_a = images[0]) === null || _a === void 0 ? void 0 : _a.src) || "/styles/default-theme-icon.webp",
        introParagraph: <>Summon the perfect mascot for your brand with our <strong>{theme}</strong> themed logo generator. Ideal for clans and streamers looking for a powerful identity.</>,
        ctaText: `Create a ${theme} Logo`,
        handleCtaClick: handleCtaClick,
        showcaseTitle: <>Epic <span className="text-purple-600 dark:text-cyan-400">{theme}</span> Logo Concepts</>,
        imageShowcaseGrid: images.slice(0, 8).map(img => ({ src: img.src, alt: `${theme}-themed gaming logo design example` })),
        relatedItems: relatedItems,
        faqTitle: <>Your <span className="text-purple-600 dark:text-cyan-400">{theme} Logo</span> Questions</>,
        finalCtaTitle: <>Ready to Forge Your <span className="text-purple-600 dark:text-cyan-400">{theme} Logo</span>?</>,
        faqItems: [
            { q: `What kind of ${theme} logos can I make?`, a: `Our AI can generate a wide range of ${theme}-themed concepts, including fierce mascots, intricate symbols, and atmospheric emblems that perfectly match the theme.` },
            { q: `How do I get the best ${theme}-themed results?`, a: `While our pre-made styles are powerful, you can also add keywords like "aggressive," "mystical," or "dark" to your text prompt in the generator to further guide the AI.` },
        ],
    };
    return <PseoLogoPageTemplate {...templateProps}/>;
};
export default ThemeLogoPage;
export const getStaticPaths = async () => {
    const themes = gamerStylesData["Themes & Motifs"] || {};
    const paths = Object.keys(themes).map((theme) => ({
        params: { slug: createSlug(theme, '-gaming-logo') },
    }));
    return { paths, fallback: false };
};
export const getStaticProps = async ({ params }) => {
    var _a;
    const slug = params === null || params === void 0 ? void 0 : params.slug;
    const themesData = gamerStylesData["Themes & Motifs"] || {};
    const matchedTheme = Object.keys(themesData).find((key) => createSlug(key, '-gaming-logo') === slug);
    if (!matchedTheme)
        return { notFound: true };
    const toHighQuality = (src) => src.replace('.webp', 'e.webp');
    const images = ((_a = themesData[matchedTheme]) === null || _a === void 0 ? void 0 : _a.map(img => (Object.assign(Object.assign({}, img), { src: toHighQuality(img.src) })))) || [];
    const relatedItems = getStaticRelatedItems({
        tool: 'logo',
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
