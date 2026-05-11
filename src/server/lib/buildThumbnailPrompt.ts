import { type BannerTemplate } from "../../data/bannerTemplates";
import { THUMBNAIL_PLATFORMS } from "../../data/thumbnailPlatforms";

export interface BuildThumbnailPromptInput {
  template: BannerTemplate;
  title: string;
  subtitle: string | null;
  hasReferenceImage: boolean;
}

function escapeQuotedText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function humanizeTaxonomyValue(value: string): string {
  return value.replace(/[-_]+/g, " ").trim();
}

function formatList(values: string[]): string {
  if (values.length === 0) {
    return "";
  }

  if (values.length === 1) {
    return values[0]!;
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }

  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

function buildTemplateDirection(template: BannerTemplate): string | null {
  const parts: string[] = [];

  if (template.categories.games.length > 0) {
    parts.push(
      `${formatList(template.categories.games.map(humanizeTaxonomyValue))} game influence`
    );
  }

  if (template.categories.styles.length > 0) {
    parts.push(
      `${formatList(template.categories.styles.map(humanizeTaxonomyValue))} art style`
    );
  }

  if (template.categories.themes.length > 0) {
    parts.push(
      `${formatList(template.categories.themes.map(humanizeTaxonomyValue))} theme`
    );
  }

  if (template.categories.colors.length > 0) {
    parts.push(
      `${formatList(template.categories.colors.map(humanizeTaxonomyValue))} color palette`
    );
  }

  return parts.length > 0 ? formatList(parts) : null;
}

function buildTypographyDirection(template: BannerTemplate): string {
  const combinedContext = [
    ...template.categories.games,
    ...template.categories.styles,
    ...template.categories.themes,
  ]
    .join(" ")
    .toLowerCase();

  if (
    combinedContext.includes("call-of-duty") ||
    combinedContext.includes("counter-strike") ||
    combinedContext.includes("apex")
  ) {
    return "Use bold tactical gaming typography with aggressive, sharp letterforms and strong thumbnail readability.";
  }

  if (combinedContext.includes("minecraft") || combinedContext.includes("8-bit")) {
    return "Use bold blocky arcade-inspired typography with strong contrast and easy thumbnail readability.";
  }

  if (combinedContext.includes("fortnite") || combinedContext.includes("cartoon")) {
    return "Use bold stylized creator-first typography with playful energy, strong contrast, and oversized readability.";
  }

  if (
    combinedContext.includes("space") ||
    combinedContext.includes("cyberpunk")
  ) {
    return "Use sleek futuristic thumbnail typography with sharp sci-fi styling and premium high-contrast readability.";
  }

  return "Use typography that feels native to the selected game and theme while staying oversized, bold, and instantly readable in a thumbnail.";
}

export function buildThumbnailPrompt(input: BuildThumbnailPromptInput): string {
  const platformName =
    THUMBNAIL_PLATFORMS.youtube.displayName ?? input.template.platform;
  const safeTitle = escapeQuotedText(input.title.trim());
  const safeSubtitle = input.subtitle?.trim()
    ? escapeQuotedText(input.subtitle.trim())
    : null;
  const templateDirection = buildTemplateDirection(input.template);
  const typographyDirection = buildTypographyDirection(input.template);

  return [
    `Create a premium ${platformName} gaming thumbnail.`,
    `${input.template.promptPreset.basePrompt}.`,
    `Art direction: ${input.template.promptPreset.styleDescriptors}.`,
    templateDirection
      ? `Match the selected template closely with ${templateDirection}.`
      : null,
    input.hasReferenceImage
      ? "Use the attached image only as a visual reference for identity, pose, silhouette, and color direction. Do not paste, frame, crop, box, or place the exact uploaded image anywhere in the thumbnail. If the reference includes a person or face, redesign that subject so they look dressed, posed, lit, and styled like they belong naturally inside the selected game world."
      : "Do not add a pasted source image. Let the thumbnail artwork carry the energy of the selected game and style.",
    'Build a high-click-through thumbnail composition with one dominant focal subject and one dominant text block.',
    `Place the main title "${safeTitle}" in large bold highly legible thumbnail typography.`,
    typographyDirection,
    safeSubtitle
      ? `Place the subtitle "${safeSubtitle}" as smaller supporting text near the main title.`
      : "Do not add subtitle text.",
    "Render the title and subtitle exactly as provided. Do not misspell, paraphrase, mutate, or invent any words or letters.",
    "Keep the composition clean, dramatic, high-contrast, and optimized for small-screen readability and strong click appeal.",
    `Composition guidance: ${input.template.promptPreset.compositionHints}.`,
    `Final result should feel platform-ready for ${platformName}, with production-quality typography, no watermark, and no signature.`,
  ]
    .filter(Boolean)
    .join(" ");
}
