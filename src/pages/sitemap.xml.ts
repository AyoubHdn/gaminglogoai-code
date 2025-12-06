/* eslint-disable @typescript-eslint/require-await */
import { GetServerSideProps } from "next";

const generateSitemapIndex = () => {
  const baseUrl = "https://gaminglogoai.com";

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <sitemap>
    <loc>${baseUrl}/sitemap-static.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>

  <sitemap>
    <loc>${baseUrl}/sitemap-logo.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>

  <sitemap>
    <loc>${baseUrl}/sitemap-pfp.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>

  <sitemap>
    <loc>${baseUrl}/sitemap-tools.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>

</sitemapindex>`;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const xml = generateSitemapIndex();

  res.setHeader("Content-Type", "text/xml");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function SitemapIndex() {
  return null;
}
