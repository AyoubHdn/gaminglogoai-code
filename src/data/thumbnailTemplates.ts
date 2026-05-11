import { type BannerTemplate } from "./bannerTemplates";

export type ThumbnailTemplate = BannerTemplate;

type ThumbnailTemplateSeed = Omit<ThumbnailTemplate, "platform">;

function templatePreview(templateId: string): string {
  return `/youtube/thumbnail/templates/${templateId}.webp`;
}

const YOUTUBE_THUMBNAIL_TEMPLATE_SEEDS: ThumbnailTemplateSeed[] = [
  {
    id: "youtube-cod-night-ops",
    name: "COD Night Ops",
    thumbnailUrl: templatePreview("youtube-cod-night-ops"),
    categories: {
      games: ["call-of-duty"],
      colors: ["black", "blue"],
      styles: ["monogram"],
      themes: [],
    },
    promptPreset: {
      basePrompt: "High-impact Call of Duty-style YouTube thumbnail",
      styleDescriptors:
        "tactical cinematic action, dark blue contrast, premium shooter energy, dramatic esports presentation",
      compositionHints:
        "thumbnail-first composition, strong subject focus, large readable headline zone, high click-through contrast",
    },
    credits: 10,
  },
  {
    id: "youtube-fortnite-hype",
    name: "Fortnite Hype",
    thumbnailUrl: templatePreview("youtube-fortnite-hype"),
    categories: {
      games: ["fortnite"],
      colors: ["blue", "purple"],
      styles: ["cartoon"],
      themes: [],
    },
    promptPreset: {
      basePrompt: "Vibrant Fortnite-style YouTube thumbnail",
      styleDescriptors:
        "stylized action energy, playful hero pose, glowing highlights, creator-first gaming spectacle",
      compositionHints:
        "thumbnail-first composition, oversized hero subject, bold title placement, dramatic foreground-background separation",
    },
    credits: 10,
  },
  {
    id: "youtube-minecraft-build",
    name: "Minecraft Build Rush",
    thumbnailUrl: templatePreview("youtube-minecraft-build"),
    categories: {
      games: ["minecraft"],
      colors: ["green", "blue"],
      styles: ["8-bit"],
      themes: ["fantasy"],
    },
    promptPreset: {
      basePrompt: "Minecraft-inspired YouTube thumbnail",
      styleDescriptors:
        "blocky crafted world, adventurous build energy, bright readable shapes, polished creator thumbnail styling",
      compositionHints:
        "thumbnail-first composition, clear central hero subject, bold headline block, high-clarity visual storytelling",
    },
    credits: 10,
  },
  {
    id: "youtube-apex-squad",
    name: "Apex Squad Shock",
    thumbnailUrl: templatePreview("youtube-apex-squad"),
    categories: {
      games: ["apex-legends"],
      colors: ["purple", "pink"],
      styles: ["emblem"],
      themes: ["space"],
    },
    promptPreset: {
      basePrompt: "Apex Legends-inspired YouTube thumbnail",
      styleDescriptors:
        "fast hero-shooter momentum, futuristic neon edge, high-pressure squad energy, premium competitive polish",
      compositionHints:
        "thumbnail-first composition, explosive hero framing, clean title area, strong visual depth for click appeal",
    },
    credits: 10,
  },
  {
    id: "youtube-cyberpunk-breakdown",
    name: "Cyberpunk Breakdown",
    thumbnailUrl: templatePreview("youtube-cyberpunk-breakdown"),
    categories: {
      games: ["cyberpunk-2077"],
      colors: ["pink", "purple"],
      styles: ["monogram"],
      themes: ["space"],
    },
    promptPreset: {
      basePrompt: "Cyberpunk-style YouTube thumbnail",
      styleDescriptors:
        "futuristic neon atmosphere, dystopian tech edge, glowing city depth, premium creator thumbnail energy",
      compositionHints:
        "thumbnail-first composition, high-contrast focal subject, oversized title zone, layered cinematic sci-fi depth",
    },
    credits: 10,
  },
  {
    id: "youtube-roblox-chaos",
    name: "Roblox Chaos",
    thumbnailUrl: templatePreview("youtube-roblox-chaos"),
    categories: {
      games: ["roblox"],
      colors: ["blue", "pink"],
      styles: ["cartoon"],
      themes: [],
    },
    promptPreset: {
      basePrompt: "Roblox-inspired YouTube thumbnail",
      styleDescriptors:
        "bright playful creator energy, toy-like proportions, cheerful chaos, family-friendly high-clarity design",
      compositionHints:
        "thumbnail-first composition, big expressive subject, cheerful visual hierarchy, bold easy-to-read title block",
    },
    credits: 10,
  },
];

export const THUMBNAIL_TEMPLATES: ThumbnailTemplate[] =
  YOUTUBE_THUMBNAIL_TEMPLATE_SEEDS.map((template) => ({
    ...template,
    platform: "youtube",
  }));
