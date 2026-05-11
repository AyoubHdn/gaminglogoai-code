import { type BannerTemplate } from "../data/bannerTemplates";

export interface TemplateFilters {
  games?: string[];
  colors?: string[];
  styles?: string[];
  themes?: string[];
}

export interface AvailableTemplateFilters {
  games: Set<string>;
  colors: Set<string>;
  styles: Set<string>;
  themes: Set<string>;
}

type FilterDimension = keyof TemplateFilters;

export function filterTemplates(
  templates: BannerTemplate[],
  filters: TemplateFilters
): BannerTemplate[] {
  const activeDimensions = (Object.keys(filters) as FilterDimension[]).filter(
    (dimension) => (filters[dimension]?.length ?? 0) > 0
  );

  if (activeDimensions.length === 0) {
    return templates;
  }

  return templates.filter((template) =>
    activeDimensions.every((dimension) => {
      const values = filters[dimension];

      if (!values || values.length === 0) {
        return true;
      }

      return values.some((value) => template.categories[dimension].includes(value));
    })
  );
}

export function getAvailableFilters(
  templates: BannerTemplate[]
): AvailableTemplateFilters {
  const availableFilters: AvailableTemplateFilters = {
    games: new Set<string>(),
    colors: new Set<string>(),
    styles: new Set<string>(),
    themes: new Set<string>(),
  };

  for (const template of templates) {
    for (const value of template.categories.games) {
      availableFilters.games.add(value);
    }

    for (const value of template.categories.colors) {
      availableFilters.colors.add(value);
    }

    for (const value of template.categories.styles) {
      availableFilters.styles.add(value);
    }

    for (const value of template.categories.themes) {
      availableFilters.themes.add(value);
    }
  }

  return availableFilters;
}

export function getTemplateById(
  templates: BannerTemplate[],
  id: string
): BannerTemplate | undefined {
  return templates.find((template) => template.id === id);
}
