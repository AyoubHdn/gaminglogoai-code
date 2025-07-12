// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://gaminglogoai.com', // ** YOUR GAMINGLOGOAI.COM PRODUCTION DOMAIN **
  generateRobotsTxt: true, 
  // This will generate a robots.txt including:
  // User-agent: *
  // Allow: /
  // Sitemap: https://gaminglogoai.com/sitemap.xml

  // Optional: Exclude any pages you don't want in the sitemap
  // exclude: ['/admin/*', '/api/*'], // Exclude API routes, admin sections

  // Optional: Default change frequency and priority
  // changefreq: 'weekly',
  // priority: 0.7,
};