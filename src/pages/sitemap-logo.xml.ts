/* eslint-disable @typescript-eslint/require-await */
import { GetServerSideProps } from "next";
import { gamerStylesData } from "~/data/gamerStylesData";
import { createSlug } from "~/lib/utils";

const logoCategories = [
  { parent: "Game Titles", path: "games", suffix: "-logo-maker" },
  { parent: "Game Genres", path: "genres", suffix: "-logo-design" },
  { parent: "Art", path: "styles", suffix: "-logo-design" },
  { parent: "Themes & Motifs", path: "themes", suffix: "-gaming-logo" },
  { parent: "Colors", path: "colors", suffix: "-gaming-logo" },
  { parent: "Holidays & Seasonal", path: "holidays", suffix: "-gaming-logo" },
  { parent: "Real‐World / Cultural", path: "cultural", suffix: "-esports-logo" },
];

const generateXml = (urls: string[]) => `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>https://gaminglogoai.com${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.7</priority>
  </url>`
  )
  .join("")}
</urlset>`;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const urls: string[] = [];

  logoCategories.forEach((category) => {
    const items = gamerStylesData[category.parent];
    if (!items) return;

    Object.keys(items).forEach((name) => {
      const slug = createSlug(name, category.suffix);
      urls.push(`/logo/${category.path}/${slug}`);
    });
  });

  res.setHeader("Content-Type", "text/xml");
  res.write(generateXml(urls));
  res.end();

  return { props: {} };
};

export default function SitemapLogo() { return null; }
