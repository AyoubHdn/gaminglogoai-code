/* eslint-disable @typescript-eslint/require-await */
import { GetServerSideProps } from "next";

const toolPages = [
  "/gaming-logo-maker",
  "/pfp-maker",
  "/twitch-banner-generator",
  "/twitch-panels-generator",
];

const generateXml = (urls: string[]) => `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>https://gaminglogoai.com${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.8</priority>
  </url>`
  )
  .join("")}
</urlset>`;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const xml = generateXml(toolPages);

  res.setHeader("Content-Type", "text/xml");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function SitemapTools() { return null; }
