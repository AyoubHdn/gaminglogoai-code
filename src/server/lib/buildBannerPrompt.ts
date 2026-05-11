import { type BannerTemplate } from "../../data/bannerTemplates";
import { PLATFORMS } from "../../data/platforms";
import {
  getBannerSocialPlatformLabel,
  getFilledBannerSocialHandles,
  type BannerSocialHandle,
} from "../../lib/bannerSocials";

/**
 * Builds the banner prompt from a taxonomy preset plus user text.
 *
 * We keep the phrasing `channel name "X"` because text-to-image models render
 * typography more reliably when the desired display text is named explicitly
 * instead of being buried inside a broader art-direction paragraph.
 *
 * We explicitly ask for `sharp text rendering` because text legibility is the
 * most fragile part of banner generation, and this direct instruction helps
 * steer the generation model toward cleaner typography before any kontext refinement.
 */

export interface BuildBannerPromptInput {
  template: BannerTemplate;
  channelName: string;
  tagline: string | null;
  socialHandles: BannerSocialHandle[];
  hasLogo: boolean;
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
  const directionParts: string[] = [];
  const games = template.categories.games.map(humanizeTaxonomyValue);
  const styles = template.categories.styles.map(humanizeTaxonomyValue);
  const themes = template.categories.themes.map(humanizeTaxonomyValue);
  const colors = template.categories.colors.map(humanizeTaxonomyValue);

  if (games.length > 0) {
    directionParts.push(`${formatList(games)} game influence`);
  }

  if (styles.length > 0) {
    directionParts.push(`${formatList(styles)} art style`);
  }

  if (themes.length > 0) {
    directionParts.push(`${formatList(themes)} theme`);
  }

  if (colors.length > 0) {
    directionParts.push(`${formatList(colors)} color palette`);
  }

  return directionParts.length > 0 ? formatList(directionParts) : null;
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
    return "Use bold tactical esports typography with sharp, disciplined letterforms and a premium military-competitive feel.";
  }

  if (combinedContext.includes("fortnite") || combinedContext.includes("cartoon")) {
    return "Use bold stylized gaming typography with energetic shapes, modern streamer personality, and playful high-impact readability.";
  }

  if (combinedContext.includes("minecraft") || combinedContext.includes("8-bit")) {
    return "Use blocky arcade-inspired typography that echoes retro game aesthetics while staying crisp and easy to read.";
  }

  if (combinedContext.includes("fantasy") || combinedContext.includes("league")) {
    return "Use heroic fantasy-inspired typography with elevated dramatic styling while keeping the words clean and readable.";
  }

  if (
    combinedContext.includes("space") ||
    combinedContext.includes("cyberpunk") ||
    combinedContext.includes("futuristic")
  ) {
    return "Use sleek futuristic typography with sharp sci-fi styling, premium contrast, and strong readability.";
  }

  return "Use typography styling that feels native to the selected game, theme, and art direction while staying bold, premium, and highly legible.";
}

export function buildBannerPrompt(input: BuildBannerPromptInput): string {
  const platformName =
    PLATFORMS[input.template.platform]?.displayName ?? input.template.platform;
  const safeChannelName = escapeQuotedText(input.channelName.trim());
  const safeTagline = input.tagline?.trim()
    ? escapeQuotedText(input.tagline.trim())
    : null;
  const socialHandles = getFilledBannerSocialHandles(input.socialHandles).map(
    (item) => ({
      platformLabel: getBannerSocialPlatformLabel(item.platform),
      handle: escapeQuotedText(item.handle),
    })
  );
  const templateDirection = buildTemplateDirection(input.template);
  const typographyDirection = buildTypographyDirection(input.template);

  return [
    `Create a premium ${platformName} banner.`,
    `${input.template.promptPreset.basePrompt}.`,
    `Art direction: ${input.template.promptPreset.styleDescriptors}.`,
    templateDirection
      ? `Match the selected template closely with ${templateDirection}.`
      : null,
    input.hasLogo
      ? "Use the attached logo, emblem, avatar, or photo only as a visual reference for style, identity, silhouette, and color direction. Do not paste, frame, crop, box, or place the exact uploaded image anywhere in the banner. Do not create an inset portrait, sticker, thumbnail, badge, card, or corner overlay from the reference image. If the reference includes a person, face, or character, redesign that subject so they look dressed, armored, posed, and lit like they belong naturally inside the selected game world and theme style. Adapt clothing, gear, mood, and styling cues to match the chosen game and art direction while preserving the subject's core identity. If you echo the subject or logo inspiration, reinterpret it as fully integrated native artwork blended into the banner composition rather than a separate rectangular image."
      : "Do not add a separate logo mark. Keep the banner text-first and let the background art carry the energy of the design.",
    `Build a clear left-to-right composition. Place the channel name "${safeChannelName}" as the dominant headline on the right side in large bold legible sans-serif typography.`,
    typographyDirection,
    safeTagline
      ? `Place the tagline "${safeTagline}" directly beneath the channel name in smaller secondary text.`
      : "Do not add a tagline.",
    socialHandles.length > 0
      ? `Place a compact social media list below the tagline or near the lower-right. Use recognizable platform icons followed by clean readable handle text. Include ${formatList(
          socialHandles.map(
            (item) =>
              `${item.platformLabel} icon with handle "${item.handle}"`
          )
        )}.`
      : "Do not add social media icons or social handle text.",
    'Render the channel name, tagline, social handles, and platform icons exactly and accurately. Do not misspell, mutate, paraphrase, or invent any letters, words, handles, or social media logos.',
    "Keep all text and iconography clean, premium, aligned, and production-quality. Prefer fewer, larger, clearer elements over crowded small details.",
    "Keep the right-side text area clean, high-contrast, and free from distracting clutter so the typography stays readable at a glance.",
    "The background should clearly reflect the selected game, style, theme, and color direction rather than looking like a generic gaming banner.",
    `Composition guidance: ${input.template.promptPreset.compositionHints}.`,
    `Final result should feel platform-ready for ${platformName}, with crisp text rendering, premium typography, no watermark, and no signature.`,
  ]
    .filter(Boolean)
    .join(" ");
}
