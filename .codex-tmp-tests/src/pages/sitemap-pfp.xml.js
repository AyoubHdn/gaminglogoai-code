import { faceStylesData } from "~/data/faceStylesData";
import { createSlug } from "~/lib/utils";
// Helper: build XML
const generateSiteMap = (pages) => {
    const baseUrl = "https://gaminglogoai.com";
    return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages
        .map((page) => `
      <url>
        <loc>${baseUrl}${page}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <priority>0.6</priority>
      </url>
    `)
        .join("")}
  </urlset>
  `;
};
// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async ({ res }) => {
    const pfpPages = [];
    // Categories for PFP generator
    const pfpCategories = [
        { parentKey: "Game Title", categoryPath: "games", slugSuffix: "-pfp-maker" },
        { parentKey: "Art Style", categoryPath: "styles", slugSuffix: "-avatar-maker" },
        { parentKey: "Theme & Motif", categoryPath: "themes", slugSuffix: "-avatar-maker" },
        { parentKey: "Seasonal & Cultural", categoryPath: "seasonal", slugSuffix: "-pfp-maker" },
    ];
    // Build pages
    pfpCategories.forEach((category) => {
        const dataSet = faceStylesData[category.parentKey];
        if (dataSet) {
            const allItems = Object.values(dataSet).flat();
            allItems.forEach((item) => {
                if (!(item === null || item === void 0 ? void 0 : item.name))
                    return;
                const slug = createSlug(item.name, category.slugSuffix);
                pfpPages.push(`/pfp/${category.categoryPath}/${slug}`);
            });
        }
    });
    const sitemap = generateSiteMap(pfpPages);
    // Output XML
    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();
    return { props: {} };
};
// default empty component
const SitemapPfp = () => null;
export default SitemapPfp;
