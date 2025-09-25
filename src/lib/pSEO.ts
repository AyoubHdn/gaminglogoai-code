// src/lib/pSEO.ts
import { gamerStylesData } from "src/data/gamerStylesData";
import { faceStylesData } from 'src/data/faceStylesData';
import { createSlug } from "src/lib/utils";

// Define a common, strict type for all our style items
interface StyleItem {
    name: string;
    src: string;
    basePrompt: string;
}

// The shape of a single related item link
export interface RelatedItem {
  name: string;
  slug: string;
  exampleImage: string;
  tool: 'logo' | 'pfp';
  categoryPath: string;
  description: string;
}

// Configuration for all our pSEO categories
const categories = [
  // LOGO MAKER
  { parentKey: "Game Titles", categoryPath: "games", slugSuffix: "-logo-maker", descriptionPrefix: "Logos inspired by", tool: "logo", source: gamerStylesData },
  { parentKey: "Game Genres", categoryPath: "genres", slugSuffix: "-logo-design", descriptionPrefix: "Explore", tool: "logo", source: gamerStylesData },
  { parentKey: "Art", categoryPath: "styles", slugSuffix: "-logo-design", descriptionPrefix: "Create logos in the", tool: "logo", source: gamerStylesData },
  { parentKey: "Themes & Motifs", categoryPath: "themes", slugSuffix: "-gaming-logo", descriptionPrefix: "Design logos with a", tool: "logo", source: gamerStylesData },
  { parentKey: "Colors", categoryPath: "colors", slugSuffix: "-gaming-logo", descriptionPrefix: "Browse our collection of", tool: "logo", source: gamerStylesData },
  { parentKey: "Holidays & Seasonal", categoryPath: "holidays", slugSuffix: "-gaming-logo", descriptionPrefix: "Get festive with", tool: "logo", source: gamerStylesData },
  { parentKey: "Real‐World / Cultural", categoryPath: "cultural", slugSuffix: "-esports-logo", descriptionPrefix: "Represent with", tool: "logo", source: gamerStylesData },
  // PFP MAKER (using individual items)
  { parentKey: "Game Title", categoryPath: "games", slugSuffix: "-pfp-maker", descriptionPrefix: "PFPs inspired by", tool: "pfp", source: faceStylesData },
  { parentKey: "Art Style", categoryPath: "styles", slugSuffix: "-avatar-maker", descriptionPrefix: "Avatars in the", tool: "pfp", source: faceStylesData },
  { parentKey: "Theme & Motif", categoryPath: "themes", slugSuffix: "-avatar-maker", descriptionPrefix: "Avatars with a", tool: "pfp", source: faceStylesData },
  { parentKey: "Seasonal & Cultural", categoryPath: "seasonal", slugSuffix: "-pfp-maker", descriptionPrefix: "PFPs for", tool: "pfp", source: faceStylesData },
] as const;

// A type-safe helper for handling image paths
const getImagePath = (src: string | undefined, tool: 'logo' | 'pfp'): string => {
  if (!src) return "/images/placeholder-style.png"; // Provide a fallback
  return tool === 'logo' ? src.replace('.webp', 'e.webp') : src;
};

// --- NEW MASTER FUNCTION ---
// This function creates a flat list of every single individual pSEO page we can build.
let allPseoItems: RelatedItem[] | null = null;

function getAllPseoItems(): RelatedItem[] {
  // Use a simple cache so we don't recalculate this huge array every time
  if (allPseoItems) {
    return allPseoItems;
  }

  const items: RelatedItem[] = [];

  for (const category of categories) {
    const dataSet = category.source[category.parentKey];
    if (!dataSet) continue;

    // We loop through the sub-categories (e.g., "Shooters", "Cartoon & Toon")
    for (const subCategoryName in dataSet) {
      // Check if the property is its own to avoid prototype chain issues
      if (Object.prototype.hasOwnProperty.call(dataSet, subCategoryName)) {
        const subCategoryItems = dataSet[subCategoryName] as unknown as StyleItem[];
        
        if (Array.isArray(subCategoryItems)) {
          for (const item of subCategoryItems) {
            // Ensure the item has a name, which is crucial for our new logic
            if (item && item.name) {
              items.push({
                name: item.name,
                slug: createSlug(item.name, category.slugSuffix),
                exampleImage: getImagePath(item.src, category.tool),
                tool: category.tool,
                categoryPath: category.categoryPath,
                description: `${category.descriptionPrefix} ${item.name}.`
              });
            }
          }
        }
      }
    }
  }
  allPseoItems = items;
  return allPseoItems;
}

/**
 * Fetches a static, deterministic list of related pSEO pages.
 * @param options - The tool and name of the page to exclude.
 * @param count - The total number of related items to return.
 * @returns An array of RelatedItem objects.
 */
export function getStaticRelatedItems(
  options: { tool: 'logo' | 'pfp'; excludeName: string },
  count = 6
): RelatedItem[] {
  const allItems = getAllPseoItems();

  // Find the index of the current page in our master list
  const currentIndex = allItems.findIndex(
    item => item.tool === options.tool && item.name === options.excludeName
  );

  if (currentIndex === -1) {
    // If the current item isn't found, return the first few items as a safe fallback
    return allItems.slice(0, count);
  }
  
  // Create a new array that excludes the current item
  const filteredItems = allItems.filter((_, index) => index !== currentIndex);

  // Create a "rotated" array that starts from the item AFTER the current one.
  // This makes the related items feel relevant but is 100% deterministic.
  const rotatedItems = [
    ...filteredItems.slice(currentIndex),
    ...filteredItems.slice(0, currentIndex)
  ];

  return rotatedItems.slice(0, count);
}

/**
 * Finds other items from the same sub-category to use as showcase examples.
 * @param sourceData - The data object to search (e.g., faceStylesData).
 * @param parentKey - The main category key (e.g., "Game Title").
 * @param excludeName - The name of the item to exclude from the results (e.g., "Fortnite").
 * @param count - The number of items to return.
 * @returns An array of style items.
 */
export function getShowcaseItems(
  sourceData: Record<string, Record<string, StyleItem[]>>,
  parentKey: string,
  excludeName: string,
  count = 3
): StyleItem[] {
  const showcaseItems: StyleItem[] = [];
  const parentCategory = sourceData[parentKey];
  if (!parentCategory) return [];

  // Find which sub-category the excluded item belongs to
  let targetSubCategory = "";
  for (const subCategory in parentCategory) {
     if (Object.prototype.hasOwnProperty.call(parentCategory, subCategory)) {
        const items = parentCategory[subCategory];
        if (Array.isArray(items) && items.some(item => item.name === excludeName)) {
            targetSubCategory = subCategory;
            break;
        }
     }
  }

  if (!targetSubCategory) return [];

  // Now, collect other items from that sub-category
  const itemsInSubCategory = parentCategory[targetSubCategory];
  if (Array.isArray(itemsInSubCategory)) {
    for (const item of itemsInSubCategory) {
        if (item && item.name !== excludeName) {
            showcaseItems.push(item);
        }
    }
  }

  return showcaseItems.slice(0, count);
}