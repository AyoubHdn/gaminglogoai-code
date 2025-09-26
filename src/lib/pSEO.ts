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
  { parentKey: "Game Titles", categoryPath: "games", slugSuffix: "-logo-maker", descriptionPrefix: "Logos inspired by", tool: "logo", source: gamerStylesData, structure: 'keys' },
  { parentKey: "Game Genres", categoryPath: "genres", slugSuffix: "-logo-design", descriptionPrefix: "Explore", tool: "logo", source: gamerStylesData, structure: 'keys' },
  { parentKey: "Art", categoryPath: "styles", slugSuffix: "-logo-design", descriptionPrefix: "Create logos in the", tool: "logo", source: gamerStylesData, structure: 'keys' },
  { parentKey: "Themes & Motifs", categoryPath: "themes", slugSuffix: "-gaming-logo", descriptionPrefix: "Design logos with a", tool: "logo", source: gamerStylesData, structure: 'keys' },
  { parentKey: "Colors", categoryPath: "colors", slugSuffix: "-gaming-logo", descriptionPrefix: "Browse our collection of", tool: "logo", source: gamerStylesData, structure: 'keys' },
  { parentKey: "Holidays & Seasonal", categoryPath: "holidays", slugSuffix: "-gaming-logo", descriptionPrefix: "Get festive with", tool: "logo", source: gamerStylesData, structure: 'keys' },
  { parentKey: "Real‐World / Cultural", categoryPath: "cultural", slugSuffix: "-esports-logo", descriptionPrefix: "Represent with", tool: "logo", source: gamerStylesData, structure: 'keys' },
  // PFP MAKER
  { parentKey: "Game Title", categoryPath: "games", slugSuffix: "-pfp-maker", descriptionPrefix: "PFPs inspired by", tool: "pfp", source: faceStylesData, structure: 'items' },
  { parentKey: "Art Style", categoryPath: "styles", slugSuffix: "-avatar-maker", descriptionPrefix: "PFPs in the", tool: "pfp", source: faceStylesData, structure: 'items' },
  { parentKey: "Theme & Motif", categoryPath: "themes", slugSuffix: "-avatar-maker", descriptionPrefix: "PFPs with a", tool: "pfp", source: faceStylesData, structure: 'items' },
  { parentKey: "Seasonal & Cultural", categoryPath: "seasonal", slugSuffix: "-pfp-maker", descriptionPrefix: "PFPs for", tool: "pfp", source: faceStylesData, structure: 'items' },
] as const;

const getImagePath = (src: string | undefined, tool: 'logo' | 'pfp'): string => {
  if (!src) return "/images/placeholder-style.png";
  return tool === 'logo' ? src.replace('.webp', 'e.webp') : src;
};

// --- NEW MASTER FUNCTION ---
// This function creates a flat list of every single individual pSEO page we can build.
let allPseoItems: RelatedItem[] | null = null;

function getAllPseoItems(): RelatedItem[] {
  if (allPseoItems) return allPseoItems;

  const items: RelatedItem[] = [];

  for (const category of categories) {
    const dataSet = category.source[category.parentKey as keyof typeof category.source];
    if (!dataSet) continue;

    if (category.structure === 'keys') {
      // Logic for gamerStylesData where the name is the key
      for (const itemName in dataSet) {
        if (Object.prototype.hasOwnProperty.call(dataSet, itemName)) {
          const itemArray = dataSet[itemName] as unknown as { src: string }[];
          if (Array.isArray(itemArray) && itemArray.length > 0 && itemArray[0]) {
            items.push({
              name: itemName,
              slug: createSlug(itemName, category.slugSuffix),
              exampleImage: getImagePath(itemArray[0].src, category.tool),
              tool: category.tool,
              categoryPath: category.categoryPath,
              description: `${category.descriptionPrefix} ${itemName}.`
            });
          }
        }
      }
    } else { // structure === 'items'
      // Logic for faceStylesData where the name is a property inside an item
      for (const subCategoryName in dataSet) {
        if (Object.prototype.hasOwnProperty.call(dataSet, subCategoryName)) {
          const subCategoryItems = dataSet[subCategoryName] as unknown as StyleItem[];
          if (Array.isArray(subCategoryItems)) {
            for (const item of subCategoryItems) {
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

  const currentIndex = allItems.findIndex(
    item => item.tool === options.tool && item.name.toLowerCase() === options.excludeName.toLowerCase()
  );

  if (currentIndex === -1) {
    console.warn(`Could not find item with name "${options.excludeName}" and tool "${options.tool}" in master list.`);
    // Fallback: get any 6 items
    return allItems.slice(0, count);
  }

  // Separate items by tool type
  const sameToolItems = allItems.filter(item => item.tool === options.tool);
  const otherToolItems = allItems.filter(item => item.tool !== options.tool);

  // Find the index of the current item within its own tool type
  const currentToolIndex = sameToolItems.findIndex(item => item.name.toLowerCase() === options.excludeName.toLowerCase());
  
  // Filter out the current item
  const filteredSameToolItems = sameToolItems.filter((_, index) => index !== currentToolIndex);

  // Rotate the array of same-tool items to get deterministic variety
  const rotatedSameToolItems = [
    ...filteredSameToolItems.slice(currentToolIndex),
    ...filteredSameToolItems.slice(0, currentToolIndex)
  ];
  
  // Start building the final list, prioritizing items of the same tool
  const finalRelatedItems = [...rotatedSameToolItems];

  // If we still don't have enough items, fill the rest with items from the other tool
  if (finalRelatedItems.length < count) {
    const needed = count - finalRelatedItems.length;
    finalRelatedItems.push(...otherToolItems.slice(0, needed));
  }

  return finalRelatedItems.slice(0, count);
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