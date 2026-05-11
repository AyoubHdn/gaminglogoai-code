import { type PanelPlatformConfig, type PanelShapeOption } from "../../data/panelPlatforms";
import { type PanelTemplate } from "../../data/panelTemplates";

export interface BuildPanelPromptInput {
  platform: PanelPlatformConfig;
  template: PanelTemplate;
  shape: PanelShapeOption;
  title: string;
  content: string | null;
  includeIcon: boolean;
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

function buildTemplateDirection(template: PanelTemplate): string | null {
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

function buildFrameShapeDirection(shape: PanelShapeOption): string {
  switch (shape.id) {
    case "wide-3-1":
      return "Use a wide horizontal frame shape with a clean icon or emblem zone on the left, a strong headline block on the right, and concise supporting details beneath.";
    case "landscape-4-3":
      return "Use a landscape frame shape with a balanced icon-and-title hierarchy, keeping the outer frame and inner spacing intentional for a roomier info panel.";
    case "square-1-1":
      return "Use a square frame shape with a stacked composition, a centered icon or emblem zone, and a bold easy-to-read title structure.";
    case "portrait-3-4":
      return "Use a portrait frame shape with vertical content flow, a top icon zone, a dominant title area, and readable lower content blocks.";
    default:
      return "Use a polished panel frame shape with strong visual hierarchy and clean spacing.";
  }
}

type PanelKind =
  | "about"
  | "schedule"
  | "rules"
  | "donate"
  | "discord"
  | "specs"
  | "faq"
  | "socials"
  | "generic";

function detectPanelKind(title: string): PanelKind {
  const normalized = title.toLowerCase();

  if (normalized.includes("about")) {
    return "about";
  }

  if (normalized.includes("schedule")) {
    return "schedule";
  }

  if (normalized.includes("rule")) {
    return "rules";
  }

  if (normalized.includes("donate") || normalized.includes("tip")) {
    return "donate";
  }

  if (normalized.includes("discord")) {
    return "discord";
  }

  if (normalized.includes("spec")) {
    return "specs";
  }

  if (normalized.includes("faq") || normalized.includes("question")) {
    return "faq";
  }

  if (normalized.includes("social")) {
    return "socials";
  }

  return "generic";
}

function getAutomaticIconDirection(kind: PanelKind): string {
  switch (kind) {
    case "about":
      return "a clean symbolic profile badge or identity emblem";
    case "schedule":
      return "a clean symbolic calendar or time icon";
    case "rules":
      return "a clean symbolic shield or checklist icon";
    case "donate":
      return "a clean symbolic support, coin, or heart icon";
    case "discord":
      return "a clean symbolic chat or community icon";
    case "specs":
      return "a clean symbolic hardware or tech icon";
    case "faq":
      return "a clean symbolic question or info icon";
    case "socials":
      return "a clean symbolic network or social hub icon";
    default:
      return "a clean symbolic icon that matches the panel purpose";
  }
}

function buildPanelSpecificDirection(kind: PanelKind): string {
  switch (kind) {
    case "about":
      return "Treat this as a creator identity panel. Prioritize a welcoming intro layout with strong headline readability and a polished personal-brand feel. Avoid generating a mascot wordmark, unrelated game badge text, or a full character portrait as the icon.";
    case "schedule":
      return "Treat this as an information-first schedule panel. Prioritize exact readability of days and times, clear line separation, and a clean timetable layout over decorative clutter.";
    case "rules":
      return "Treat this as a moderation and community standards panel. Prioritize clarity, order, and trust with clean rule-list readability and controlled visual energy.";
    case "donate":
      return "Treat this as a support and call-to-action panel. Prioritize gratitude, clarity, and premium support branding without turning it into a storefront or ad banner.";
    case "discord":
      return "Treat this as a community join panel. Prioritize connection, readability, and a clear invitation to join rather than a noisy promotional composition.";
    case "specs":
      return "Treat this as a tech and gear panel. Prioritize organized information blocks and crisp hardware-oriented styling.";
    case "faq":
      return "Treat this as a quick-help panel. Prioritize simple question-and-answer readability and a helpful informative tone.";
    case "socials":
      return "Treat this as a discoverability panel. Prioritize clean branded spacing and multi-channel identity without overcrowding the layout.";
    default:
      return "Treat this as a polished information panel. Prioritize clean hierarchy, strong readability, and a professional streamer-brand layout.";
  }
}

export function buildPanelPrompt(input: BuildPanelPromptInput): string {
  const safeTitle = escapeQuotedText(input.title.trim());
  const safeContent = input.content?.trim()
    ? escapeQuotedText(input.content.trim())
    : null;
  const templateDirection = buildTemplateDirection(input.template);
  const panelKind = detectPanelKind(input.title);
  const iconDirection = getAutomaticIconDirection(panelKind);

  return [
    `Create a premium ${input.platform.displayName} panel graphic.`,
    `${input.template.promptPreset.basePrompt}.`,
    `Art direction: ${input.template.promptPreset.styleDescriptors}.`,
    templateDirection
      ? `Match the selected template closely with ${templateDirection}.`
      : null,
    `Target frame shape: ${input.shape.aspectRatioLabel}. ${
      input.shape.recommended
        ? "This is the most commonly used Twitch panel frame shape, so make it especially polished and stream-ready."
        : "Design the composition to feel naturally built for this frame shape rather than stretched from a generic layout."
    }`,
    buildFrameShapeDirection(input.shape),
    buildPanelSpecificDirection(panelKind),
    input.useStyleReference
      ? input.includeIcon
        ? "Use the attached reference as a crisp batch style guide. Match its frame construction, spacing rhythm, border treatment, lighting, texture polish, color balance, and overall design language so this panel clearly belongs to the same set. The attached reference also shows the target icon silhouette for this panel, so keep that symbol clean, recognizable, and integrated. Do not copy the previous panel's title or body text. Replace them with this panel's own text exactly, and keep the new typography sharp rather than soft or blurry."
        : "Use the attached reference as a crisp batch style guide. Match its frame construction, spacing rhythm, border treatment, lighting, texture polish, color balance, and overall design language so this panel clearly belongs to the same set. Do not copy the previous panel's title, icon, or body text. Replace them with this panel's own text exactly, and keep the new typography sharp rather than soft or blurry."
      : "Establish a strong signature style for this panel set with a consistent frame, polished rendering, bold typography, and clear visual hierarchy that can carry across multiple matching panels.",
    input.includeIcon
      ? `Integrate ${iconDirection} as a native part of the panel design. Keep it symbolic, simple, readable, and rendered in the selected game, art, and theme direction. Do not turn it into a mascot character, hero portrait, wordmark logo, sticker, app screenshot, or unrelated badge with extra text.`
      : "Do not include a large icon, mascot, badge, portrait, or decorative logo. Let the typography, framing, and content carry the panel instead.",
    `Place the panel title "${safeTitle}" as the dominant readable headline.`,
    safeContent
      ? `Include the content "${safeContent}" as clean supporting panel text. If line breaks are needed, preserve the exact wording while arranging it into a compact readable layout.`
      : "Do not add extra body copy beyond the title unless needed for visual balance.",
    "Render the title, supporting content, and icon meaning exactly as provided. Do not misspell, paraphrase, mutate, truncate, or invent any words or symbols.",
    "Keep all typography clean, bold, premium, and high-contrast. The panel should feel polished, modern, and professionally branded rather than generic.",
    `Composition guidance: ${input.template.promptPreset.compositionHints}.`,
    `Final result should feel platform-ready for ${input.platform.displayName}, with crisp text rendering, clean iconography, a deliberate frame design, no watermark, and no signature.`,
  ]
    .filter(Boolean)
    .join(" ");
}
