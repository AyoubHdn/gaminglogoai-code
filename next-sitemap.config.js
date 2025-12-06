// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://gaminglogoai.com',
  generateRobotsTxt: true, 
  sitemapSize: 5000,

  additionalSitemaps: [
    "https://gaminglogoai.com/sitemap-static.xml",
    "https://gaminglogoai.com/sitemap-logo.xml",
    "https://gaminglogoai.com/sitemap-pfp.xml",
    "https://gaminglogoai.com/sitemap-tools.xml",
  ],
};