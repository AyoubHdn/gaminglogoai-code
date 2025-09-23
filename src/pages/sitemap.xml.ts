import { GetServerSideProps } from 'next';
import { gamerStylesData } from '~/data/gamerStylesData'; // Adjust path if needed
import { createSlug } from '~/lib/utils'; // Adjust path if needed

// This function generates the XML content for your sitemap.
const generateSiteMap = (pages: string[]) => {
  const baseUrl = 'https://gaminglogoai.com'; // Your website's base URL

  // Define priorities for specific page types
  const getPriority = (page: string) => {
    if (page === '/') return '1.0';
    if (page.startsWith('/blog/')) return '0.7';
    if (page === '/blog') return '0.6';
    if (['/buy-credits', '/collection'].includes(page)) return '0.7';
    // NEW: Give pSEO pages a solid priority
    if (page.startsWith('/logos/')) return '0.6'; 
    // Legal pages
    if (['/privacy-policy', '/terms-of-service', '/refund-policy'].includes(page)) return '0.3';
    // Default priority for main landing pages & tools
    return '0.8'; 
  };
  
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${pages
       .map((page) => {
         return `
       <url>
           <loc>${`${baseUrl}${page}`}</loc>
           <lastmod>${new Date().toISOString()}</lastmod>
           <priority>${getPriority(page)}</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
};

// This is the server-side function that Next.js will run.
// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // --- List all your STATIC pages here ---
  const staticPages = [
    // Core Pages
    '/',
    '/collection',
    '/buy-credits',

    // Main Landing Pages & Tools
    '/gaming-logo',
    '/ai-pfp-maker',
    '/logo-styles',
    '/gaming-logo-maker',
    '/pfp-maker',

    // Blog Pages
    '/blog',
    '/blog/how-to-create-an-epic-mascot-logo-with-ai-step-by-step',
    '/blog/how-to-create-a-clan-logo',
    '/blog/top-10-minecraft-logo-ideas',

    // Legal Pages
    '/privacy-policy',
    '/terms-of-service',
    '/refund-policy',
  ];

  // --- DYNAMICALLY GENERATE pSEO PAGES ---
  const pSEOPages: string[] = [];
  
  // This array defines how to build URLs for each pSEO category
  // It MUST match the structure in your `pSEO.ts` helper and page files
  const pSEOCategories = [
    { parentKey: "Game Titles", categoryPath: "games", slugSuffix: "-logo-maker" },
    { parentKey: "Game Genres", categoryPath: "genres", slugSuffix: "-logo-design" },
    { parentKey: "Art", categoryPath: "styles", slugSuffix: "-logo-design" },
    { parentKey: "Themes & Motifs", categoryPath: "themes", slugSuffix: "-gaming-logo" },
    { parentKey: "Colors", categoryPath: "colors", slugSuffix: "-gaming-logo" },
    { parentKey: "Holidays & Seasonal", categoryPath: "holidays", slugSuffix: "-gaming-logo" },
    { parentKey: "Real‐World / Cultural", categoryPath: "cultural", slugSuffix: "-esports-logo" },
  ] as const;

  pSEOCategories.forEach(category => {
    const dataSet = gamerStylesData[category.parentKey];
    if (dataSet) {
      Object.keys(dataSet).forEach(subCategoryName => {
        const slug = createSlug(subCategoryName, category.slugSuffix);
        const pageUrl = `/logos/${category.categoryPath}/${slug}`;
        pSEOPages.push(pageUrl);
      });
    }
  });
  
  // Combine static and dynamic pages
  const allPages = [...staticPages, ...pSEOPages];

  // Generate the sitemap XML
  const sitemap = generateSiteMap(allPages);

  // Send the XML to the browser
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

// Default export to prevent errors. This component itself does nothing.
// eslint-disable-next-line @typescript-eslint/no-empty-function
const Sitemap = () => {};
export default Sitemap;