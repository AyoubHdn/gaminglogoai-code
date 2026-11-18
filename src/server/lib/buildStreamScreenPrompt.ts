import {
  type StreamScreenPlatformConfig,
  type StreamScreenPreset,
} from "../../data/streamScreenPlatforms";
import { type StreamScreenTemplate } from "../../data/streamScreenTemplates";

export interface BuildStreamScreenPromptInput {
  platform: StreamScreenPlatformConfig;
  template: StreamScreenTemplate;
  screenPreset: StreamScreenPreset;
  title: string;
  subtitle: string | null;
  useStyleReference: boolean;
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

function buildTemplateDirection(template: StreamScreenTemplate): string | null {
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

function buildScreenSpecificDirection(screenPreset: StreamScreenPreset): string {
  switch (screenPreset.id) {
    case "starting":
      return "Treat this as a Starting Soon screen. Build anticipation, calm confidence, and a polished pre-show atmosphere without making it feel abandoned or empty.";
    case "brb":
      return "Treat this as a Be Right Back screen. Make the temporary break clear, reassuring, and professional rather than dramatic or final.";
    case "offline":
      return "Treat this as an Offline screen. Give it a finished after-hours mood that still feels branded and intentional instead of generic shutdown art.";
    case "ending":
      return "Treat this as an Ending screen. Make it feel like a warm stream wrap-up with a clear sense of closure and creator presence.";
    default:
      return "Treat this as a polished livestream scene graphic with strong readability and a clear creator-brand atmosphere.";
  }
}

export function buildStreamScreenPrompt(
  input: BuildStreamScreenPromptInput
): string {
  const safeTitle = escapeQuotedText(input.title.trim());
  const safeSubtitle = input.subtitle?.trim()
    ? escapeQuotedText(input.subtitle.trim())
    : null;
  const templateDirection = buildTemplateDirection(input.template);

  return [
    `Create a premium ${input.platform.displayName} stream screen graphic.`,
    `${input.template.promptPreset.basePrompt}.`,
    `Art direction: ${input.template.promptPreset.styleDescriptors}.`,
    templateDirection
      ? `Match the selected template closely with ${templateDirection}.`
      : null,
    `Target canvas: ${input.platform.canvas.width}x${input.platform.canvas.height} (${input.platform.canvas.aspectRatioLabel}) fullscreen stream scene.`,
    buildScreenSpecificDirection(input.screenPreset),
    "Design this as a polished full-scene broadcast graphic rather than a panel, poster, badge, flyer, thumbnail, or webcam frame.",
    input.useStyleReference
      ? "Use the attached reference as a strict style guide for the screen set. Match its environment language, lighting treatment, atmosphere, color balance, texture polish, typography feel, and overall visual system so this screen clearly belongs to the same pack. Do not copy the previous screen's wording. Replace it with this screen's own text exactly."
      : "Establish a strong signature style for the whole screen set with consistent environment language, lighting, typography treatment, and premium broadcast polish that can carry across all matching scenes.",
    `Place the title "${safeTitle}" as the dominant readable headline.`,
    safeSubtitle
      ? `Place the subtitle "${safeSubtitle}" directly beneath or near the title as smaller supporting text. Preserve the exact wording if line breaks are needed.`
      : "Do not add extra subtitle copy beyond the title unless needed for visual balance.",
    "Keep the text large, crisp, high-contrast, and easy to read from a livestream viewing distance.",
    "Do not misspell, mutate, paraphrase, truncate, or invent any words.",
    "Do not add sponsor logos, watermark text, fake UI widgets, webcam frames, chat windows, subscription prompts, or platform logos unless the supplied text explicitly asks for them.",
    `Composition guidance: ${input.template.promptPreset.compositionHints}.`,
    `Final result should feel platform-ready for ${input.platform.displayName}, with premium full-screen composition, intentional negative space for the message, no watermark, and no signature.`,
  ]
    .filter(Boolean)
    .join(" ");
}
