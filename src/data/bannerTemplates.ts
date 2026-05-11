import { type PlatformId } from "./platforms";

export interface BannerTemplateCategories {
  games: string[];
  colors: string[];
  styles: string[];
  themes: string[];
}

export interface BannerTemplatePromptPreset {
  basePrompt: string;
  styleDescriptors: string;
  compositionHints: string;
}

export interface BannerTemplate {
  id: string;
  name: string;
  platform: PlatformId;
  thumbnailUrl: string;
  categories: BannerTemplateCategories;
  promptPreset: BannerTemplatePromptPreset;
  credits: number;
}

type TwitchBannerTemplateSeed = Omit<BannerTemplate, "platform">;

function templatePreview(templateId: string): string {
  return `/twitch/banner/templates/${templateId}.webp`;
}

const TWITCH_BANNER_TEMPLATE_SEEDS: TwitchBannerTemplateSeed[] = [
  {
    id: "fortnite-neon-rush",
    name: "Fortnite Neon Rush",
    thumbnailUrl: templatePreview("fortnite-neon-rush"),
    categories: {
      games: ["fortnite"],
      colors: ["blue", "purple"],
      styles: ["cartoon"],
      themes: [],
    },
    promptPreset: {
      basePrompt: "Epic Fortnite-themed Twitch banner",
      styleDescriptors:
        "vibrant neon aesthetic, electric purple and cyan lighting, fast-paced action energy, modern esports polish",
      compositionHints:
        "wide horizontal composition, strong focal center, layered motion streaks, premium streamer branding atmosphere",
    },
    credits: 10,
  },
  {
    id: "minecraft-pixel-realms",
    name: "Minecraft Pixel Realms",
    thumbnailUrl: templatePreview("minecraft-pixel-realms"),
    categories: {
      games: ["minecraft"],
      colors: ["green", "blue"],
      styles: ["8-bit"],
      themes: ["fantasy"],
    },
    promptPreset: {
      basePrompt: "Minecraft-themed Twitch banner",
      styleDescriptors:
        "blocky pixel-inspired design, lush green and sky-blue palette, crafted worldbuilding atmosphere, clean gaming presentation",
      compositionHints:
        "wide horizontal composition, open central horizon, layered block terrain depth, polished streamer channel branding",
    },
    credits: 10,
  },
  {
    id: "apex-neon-squad",
    name: "Apex Neon Squad",
    thumbnailUrl: templatePreview("apex-neon-squad"),
    categories: {
      games: ["apex-legends"],
      colors: ["purple", "pink"],
      styles: ["emblem"],
      themes: ["space"],
    },
    promptPreset: {
      basePrompt: "Apex Legends-inspired Twitch banner",
      styleDescriptors:
        "futuristic neon styling, high-speed hero shooter energy, vivid magenta and violet accents, premium esports finish",
      compositionHints:
        "wide horizontal composition, tactical depth, cinematic competitive mood, bold streamer identity framing",
    },
    credits: 10,
  },
  {
    id: "call-of-duty-night-ops",
    name: "Call of Duty Night Ops",
    thumbnailUrl: templatePreview("call-of-duty-night-ops"),
    categories: {
      games: ["call-of-duty"],
      colors: ["black", "blue"],
      styles: ["monogram"],
      themes: [],
    },
    promptPreset: {
      basePrompt: "Night-ops Call of Duty-style Twitch banner",
      styleDescriptors:
        "stealth tactical mood, cool blue contrast, realistic shooter detail, premium military esports presentation",
      compositionHints:
        "wide horizontal composition, high-contrast title placement, cinematic battlefield depth, professional channel branding layout",
    },
    credits: 10,
  },
  {
    id: "counter-strike-urban-surge",
    name: "Counter-Strike Urban Surge",
    thumbnailUrl: templatePreview("counter-strike-urban-surge"),
    categories: {
      games: ["counter-strike"],
      colors: ["black", "orange"],
      styles: ["emblem"],
      themes: [],
    },
    promptPreset: {
      basePrompt: "Counter-Strike-inspired Twitch banner",
      styleDescriptors:
        "urban tactical shooter tension, rugged details, subtle orange sparks, competitive esports precision",
      compositionHints:
        "wide horizontal composition, balanced open text space, tournament-ready branding, dynamic but controlled action framing",
    },
    credits: 10,
  },
  {
    id: "cyberpunk-neon-grid",
    name: "Cyberpunk Neon Grid",
    thumbnailUrl: templatePreview("cyberpunk-neon-grid"),
    categories: {
      games: ["cyberpunk-2077"],
      colors: ["pink", "purple"],
      styles: ["monogram"],
      themes: ["space"],
    },
    promptPreset: {
      basePrompt: "Cyberpunk 2077-inspired Twitch banner",
      styleDescriptors:
        "glowing dystopian city aesthetic, holographic neon lighting, magenta and violet energy, futuristic outlaw vibe",
      compositionHints:
        "wide horizontal composition, sharp central hero space, high-end streamer branding, cinematic sci-fi atmosphere",
    },
    credits: 10,
  },
  {
    id: "free-fire-ember-storm",
    name: "Free Fire Ember Storm",
    thumbnailUrl: templatePreview("free-fire-ember-storm"),
    categories: {
      games: ["free-fire"],
      colors: ["orange", "green"],
      styles: ["emblem"],
      themes: [],
    },
    promptPreset: {
      basePrompt: "Free Fire-themed Twitch banner",
      styleDescriptors:
        "high-heat battle royale energy, glowing ember accents, tropical danger atmosphere, polished esports intensity",
      compositionHints:
        "wide horizontal composition, explosive background motion, clear title hierarchy, premium streamer banner layout",
    },
    credits: 10,
  },
  {
    id: "valorant-tactical-glow",
    name: "Valorant Tactical Glow",
    thumbnailUrl: templatePreview("valorant-tactical-glow"),
    categories: {
      games: ["valorant"],
      colors: ["black", "purple"],
      styles: ["emblem"],
      themes: [],
    },
    promptPreset: {
      basePrompt: "Valorant-inspired Twitch banner",
      styleDescriptors:
        "precise tactical hero shooter atmosphere, sleek modern geometry, sharp competitive contrast, premium esports styling",
      compositionHints:
        "wide horizontal composition, disciplined title zone, strategic visual balance, polished professional streamer branding",
    },
    credits: 10,
  },
  {
    id: "league-arcane-clash",
    name: "League Arcane Clash",
    thumbnailUrl: templatePreview("league-arcane-clash"),
    categories: {
      games: ["league-of-legends"],
      colors: ["blue", "purple"],
      styles: ["emblem"],
      themes: ["fantasy"],
    },
    promptPreset: {
      basePrompt: "League of Legends-inspired Twitch banner",
      styleDescriptors:
        "arcane fantasy battleground energy, luminous magical accents, elevated esports grandeur, heroic teamfight atmosphere",
      compositionHints:
        "wide horizontal composition, epic central branding zone, layered mystical depth, streamer-ready competitive showcase",
    },
    credits: 10,
  },
  {
    id: "gta-neon-heist",
    name: "GTA Neon Heist",
    thumbnailUrl: templatePreview("gta-neon-heist"),
    categories: {
      games: ["grand-theft-auto"],
      colors: ["pink", "purple"],
      styles: ["monogram"],
      themes: [],
    },
    promptPreset: {
      basePrompt: "Grand Theft Auto-inspired Twitch banner",
      styleDescriptors:
        "stylized urban heist energy, glossy nightlife color palette, cinematic crime-drama tone, premium modern streamer branding",
      compositionHints:
        "wide horizontal composition, bold central wordmark area, city-lit depth, polished broadcast banner framing",
    },
    credits: 10,
  },
  {
    id: "roblox-cartoon-party",
    name: "Roblox Cartoon Party",
    thumbnailUrl: templatePreview("roblox-cartoon-party"),
    categories: {
      games: ["roblox"],
      colors: ["blue", "pink"],
      styles: ["cartoon"],
      themes: [],
    },
    promptPreset: {
      basePrompt: "Roblox-inspired Twitch banner",
      styleDescriptors:
        "playful cartoon worldbuilding, bright creator-friendly energy, clean toy-like shapes, upbeat streamer personality",
      compositionHints:
        "wide horizontal composition, open readable headline zone, cheerful layered environment, polished family-friendly channel branding",
    },
    credits: 10,
  },
];

export const BANNER_TEMPLATES: BannerTemplate[] = TWITCH_BANNER_TEMPLATE_SEEDS.map(
  (template) => ({
    ...template,
    platform: "twitch",
  })
);
