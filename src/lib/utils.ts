// src/lib/utils.ts

/**
 * Creates a URL-friendly slug from a string.
 * @param name The string to slugify (e.g., "Fortnite", "Action Adventure").
 * @param suffix The string to append (e.g., "-logo-maker", "-logo-design").
 * @returns The generated slug.
 */
export function createSlug(name: string, suffix: string): string {
  return name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/--+/g, '-').replace(/(^-|-$)/g, '') + suffix;
}