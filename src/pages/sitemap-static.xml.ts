/* eslint-disable @typescript-eslint/require-await */
import { GetServerSideProps } from "next";

const staticPages = [
  "/", 
  "/collection", "/buy-credits",
  "/ai-profile-picture-maker",  
  "/gaming-logo",               
  "/twitch-banner-maker",
  "/twitch-panels-maker",    
  "/privacy-policy", "/terms-of-service", "/refund-policy",
  "/blog", "/blog/how-to-create-a-clan-logo",
  "/blog/how-to-create-an-epic-mascot-logo-with-ai-step-by-step",
  "/blog/top-10-minecraft-logo-ideas",
];

const priorityMap: Record<string, string> = {
  "/": "1.0",
  "/ai-profile-picture-maker": "1.0",
  "/gaming-logo": "1.0",
  "/twitch-banner-maker": "1.0", // when landing page ready
  "/collection": "0.7",
  "/buy-credits": "0.7",
  "/blog": "0.6",
};

const getPriority = (url: string): string =>
  priorityMap[url] ?? (url.startsWith("/blog/") ? "0.6" : "0.5");

const generateXml = (urls: string[]) => `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>https://gaminglogoai.com${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>${getPriority(url)}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "text/xml");
  res.write(generateXml(staticPages));
  res.end();

  return { props: {} };
};

export default function Sitemap() { return null; }
