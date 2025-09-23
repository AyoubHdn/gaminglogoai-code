// src/lib/pSEO.ts
import { gamerStylesData } from "src/data/gamerStylesData";
import { createSlug } from "src/lib/utils";

// Define the shape of a single related item
export interface RelatedItem {
  name: string;
  slug: string;
  exampleImage: string;
  categoryPath: 'games' | 'genres' | 'styles' | 'themes' | 'colors' | 'holidays' | 'cultural';
  description: string;
}

// Define our categories and their specific properties
const categories = [
  { parentKey: "Game Titles", categoryPath: "games", slugSuffix: "-logo-maker", descriptionPrefix: "Logos inspired by" },
  { parentKey: "Game Genres", categoryPath: "genres", slugSuffix: "-logo-design", descriptionPrefix: "Explore" },
  { parentKey: "Art", categoryPath: "styles", slugSuffix: "-logo-design", descriptionPrefix: "Create logos in the" },
  { parentKey: "Themes & Motifs", categoryPath: "themes", slugSuffix: "-gaming-logo", descriptionPrefix: "Design logos with a" },
  { parentKey: "Colors", categoryPath: "colors", slugSuffix: "-gaming-logo", descriptionPrefix: "Browse our collection of" },
  { parentKey: "Holidays & Seasonal", categoryPath: "holidays", slugSuffix: "-gaming-logo", descriptionPrefix: "Get festive with" },
  { parentKey: "Real‐World / Cultural", categoryPath: "cultural", slugSuffix: "-esports-logo", descriptionPrefix: "Represent with" },
] as const; // `as const` provides stronger type safety

const toHighQuality = (src: string | undefined): string => {
  if (!src) return "";
  return src.replace('.webp', 'e.webp');
};

function getHead<T>(arr: T[], n: number): T[] {
  return arr.slice(0, n);
}

/**
 * Fetches a static, deterministic list of related pSEO pages.
 * @param options - The category and name of the page to exclude.
 * @param count - The total number of related items to return.
 * @returns An array of RelatedItem objects.
 */
export function getStaticRelatedItems(
  options: { excludeCategory: string; excludeName: string },
  count = 6
): RelatedItem[] {
  const staticItems: RelatedItem[] = [];

  // 1. Prioritize items from the SAME category
  const sameCategory = categories.find(c => c.parentKey === options.excludeCategory);
  if (sameCategory) {
    const dataSet = gamerStylesData[sameCategory.parentKey];
    if (dataSet) {
      for (const name in dataSet) {
        if (name !== options.excludeName) {
          const images = dataSet[name];
          if (images && images.length > 0) {
            staticItems.push({
              name: name,
              slug: createSlug(name, sameCategory.slugSuffix),
              exampleImage: toHighQuality(images[0]?.src) || "",
              categoryPath: sameCategory.categoryPath,
              description: `${sameCategory.descriptionPrefix} ${name}.`
            });
          }
        }
      }
    }
  }

  // 2. Fill the rest with items from OTHER categories
  for (const category of categories) {
    // Stop if we have enough items
    if (staticItems.length >= count) break;
    // Skip the category we've already processed
    if (category.parentKey === options.excludeCategory) continue;
    
    const dataSet = gamerStylesData[category.parentKey];
    if (dataSet) {
        const topItemName = Object.keys(dataSet)[0]; // Just take the first one for consistency
        if(topItemName){
            const images = dataSet[topItemName];
            if(images && images.length > 0) {
                 staticItems.push({
                    name: topItemName,
                    slug: createSlug(topItemName, category.slugSuffix),
                    exampleImage: toHighQuality(images[0]?.src) || "",
                    categoryPath: category.categoryPath,
                    description: `${category.descriptionPrefix} ${topItemName}.`
                });
            }
        }
    }
  }

  // Return the specified number of items. This list will be the same every time.
  return getHead(staticItems, count);
}