import { GetServerSideProps } from 'next';
import { gamerStylesData } from '~/data/gamerStylesData'; // Adjust path if needed
import { faceStylesData } from '~/data/faceStylesData';   // <-- NEW IMPORT
import { createSlug } from '~/lib/utils'; // Adjust path if needed

// This function generates the XML content for your sitemap.
const generateSiteMap = (pages: string[]) => {
  const baseUrl = 'https://gaminglogoai.com';

  const getPriority = (page: string) => {
    if (page === '/') return '1.0';
    if (page.startsWith('/blog/')) return '0.7';
    if (page === '/blog') return '0.6';
    if (['/buy-credits', '/collection'].includes(page)) return '0.7';
    
    // UPDATED: Give all pSEO pages a solid priority
    if (page.startsWith('/logos/') || page.startsWith('/pfp/')) return '0.6'; 
    
    if (['/privacy-policy', '/terms-of-service', '/refund-policy'].includes(page)) return '0.3';
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
    '/', '/collection', '/buy-credits',
    '/gaming-logo', '/ai-pfp-maker', '/logo-styles',
    '/gaming-logo-maker', '/pfp-maker',
    '/blog', '/blog/how-to-create-an-epic-mascot-logo-with-ai-step-by-step',
    '/blog/how-to-create-a-clan-logo', '/blog/top-10-minecraft-logo-ideas',
    '/privacy-policy', '/terms-of-service', '/refund-policy',
  ];

  // --- DYNAMICALLY GENERATE LOGO pSEO PAGES ---
  const logoPseoPages: string[] = [];
  const logoPseoCategories = [
    // This is the old logic for sub-category pages for logos.
    // If you refactor logos to use individual items, this will need to change.
    // For now, it works as is.
    { parentKey: "Game Titles", categoryPath: "games", slugSuffix: "-logo-maker" },
    { parentKey: "Game Genres", categoryPath: "genres", slugSuffix: "-logo-design" },
    { parentKey: "Art", categoryPath: "styles", slugSuffix: "-logo-design" },
    { parentKey: "Themes & Motifs", categoryPath: "themes", slugSuffix: "-gaming-logo" },
    { parentKey: "Colors", categoryPath: "colors", slugSuffix: "-gaming-logo" },
    { parentKey: "Holidays & Seasonal", categoryPath: "holidays", slugSuffix: "-gaming-logo" },
    { parentKey: "Real‐World / Cultural", categoryPath: "cultural", slugSuffix: "-esports-logo" },
  ] as const;

  logoPseoCategories.forEach(category => {
    const dataSet = gamerStylesData[category.parentKey];
    if (dataSet) {
      Object.keys(dataSet).forEach(subCategoryName => {
        const slug = createSlug(subCategoryName, category.slugSuffix);
        const pageUrl = `/logos/${category.categoryPath}/${slug}`;
        logoPseoPages.push(pageUrl);
      });
    }
  });
  
  // --- DYNAMICALLY GENERATE PFP pSEO PAGES ---
  const pfpPseoPages: string[] = [];
  const pfpPseoCategories = [
      { parentKey: "Game Title", categoryPath: "games", slugSuffix: "-pfp-maker" },
      { parentKey: "Art Style", categoryPath: "styles", slugSuffix: "-avatar-maker" },
      { parentKey: "Theme & Motif", categoryPath: "themes", slugSuffix: "-avatar-maker" },
      { parentKey: "Seasonal & Cultural", categoryPath: "seasonal", slugSuffix: "-pfp-maker" },
  ] as const;

  pfpPseoCategories.forEach(category => {
      const dataSet = faceStylesData[category.parentKey as keyof typeof faceStylesData];
      if(dataSet) {
          // Flatten all individual style items into one array
          const allItems = Object.values(dataSet).flat();
          allItems.forEach(item => {
              if (item && item.name) {
                  const slug = createSlug(item.name, category.slugSuffix);
                  const pageUrl = `/pfp/${category.categoryPath}/${slug}`;
                  pfpPseoPages.push(pageUrl);
              }
          });
      }
  });
  
  // Combine static and all dynamic pages
  const allPages = [...staticPages, ...logoPseoPages, ...pfpPseoPages];

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

// Default export to prevent errors.
// eslint-disable-next-line @typescript-eslint/no-empty-function
const Sitemap = () => {};
export default Sitemap;