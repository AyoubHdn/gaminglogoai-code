const staticPages = [
    "/",
    "/collection", "/buy-credits", "/logo-styles",
    "/ai-profile-picture-maker",
    "/gaming-logo",
    "/twitch-banner-maker",
    "/banner-maker",
    "/twitch-banner-funnel",
    "/twitch-panels-maker",
    "/twitch-stream-screens-maker",
    "/twitch-emote-maker",
    "/twitch-graphics",
    "/privacy-policy", "/terms-of-service", "/refund-policy",
    "/blog", "/blog/how-to-create-a-clan-logo",
    "/blog/how-to-create-an-epic-mascot-logo-with-ai-step-by-step",
    "/blog/top-10-minecraft-logo-ideas",
];
const priorityMap = {
    "/": "1.0",
    "/ai-profile-picture-maker": "1.0",
    "/gaming-logo": "1.0",
    "/twitch-banner-maker": "1.0",
    "/twitch-panels-maker": "1.0",
    "/twitch-stream-screens-maker": "1.0",
    "/twitch-emote-maker": "1.0",
    "/twitch-graphics": "0.9",
    "/logo-styles": "0.8",
    "/collection": "0.7",
    "/buy-credits": "0.7",
    "/blog": "0.6",
    "/privacy-policy": "0.5",
    "/terms-of-service": "0.5",
    "/refund-policy": "0.5",
};
const getPriority = (url) => { var _a; return (_a = priorityMap[url]) !== null && _a !== void 0 ? _a : (url.startsWith("/blog/") ? "0.6" : "0.5"); };
const generateXml = (urls) => `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
    .map((url) => `
  <url>
    <loc>https://gaminglogoai.com${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>${getPriority(url)}</priority>
  </url>`)
    .join("")}
</urlset>`;
export const getServerSideProps = async ({ res }) => {
    res.setHeader("Content-Type", "text/xml");
    res.write(generateXml(staticPages));
    res.end();
    return { props: {} };
};
export default function Sitemap() { return null; }
