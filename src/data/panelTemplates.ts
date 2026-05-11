import { type PanelPlatformId } from "./panelPlatforms";

export interface PanelTemplate {
  id: string;
  platform: PanelPlatformId;
  name: string;
  previewUrl: string;
  credits: number;
  categories: {
    games: string[];
    styles: string[];
    themes: string[];
    colors: string[];
  };
  promptPreset: {
    basePrompt: string;
    styleDescriptors: string;
    compositionHints: string;
  };
}

export const PANEL_TEMPLATES: PanelTemplate[] = [
  {
    id: "twitch-cod-night-ops",
    platform: "twitch",
    name: "Night Ops",
    previewUrl: "/twitch/panels/night_ops_prv.webp",
    credits: 1,
    categories: {
      games: ["call-of-duty"],
      styles: ["monogram"],
      themes: ["tactical"],
      colors: ["black", "blue"],
    },
    promptPreset: {
      basePrompt: "Create a premium Twitch panel with a tactical military-esports identity",
      styleDescriptors:
        "stealth mood, disciplined contrast, cinematic operator energy, and serious competitive branding",
      compositionHints:
        "clean icon block, sharp title treatment, structured supporting text, and controlled premium negative space",
    },
  },
  {
    id: "twitch-fortnite-hype",
    platform: "twitch",
    name: "Fortnite Hype",
    previewUrl: "/twitch/panels/fortnite_hype_prv.webp",
    credits: 1,
    categories: {
      games: ["fortnite"],
      styles: ["cartoon"],
      themes: ["electric"],
      colors: ["blue", "pink"],
    },
    promptPreset: {
      basePrompt: "Create a premium Twitch panel with a bold creator-first battle-royale energy",
      styleDescriptors:
        "playful action styling, glossy impact, bright contrast, and streamer-friendly game polish",
      compositionHints:
        "big readable headline, lively icon treatment, energetic framing accents, and simple high-impact layout",
    },
  },
  {
    id: "twitch-minecraft-build",
    platform: "twitch",
    name: "Block Builder",
    previewUrl: "/twitch/panels/minecraft_build_prv.webp",
    credits: 1,
    categories: {
      games: ["minecraft"],
      styles: ["8-bit"],
      themes: ["builder"],
      colors: ["green", "black"],
    },
    promptPreset: {
      basePrompt: "Create a premium Twitch panel with a clean blocky sandbox-game identity",
      styleDescriptors:
        "pixel-inspired structure, playful building energy, readable contrast, and polished creator presentation",
      compositionHints:
        "clear frame edges, compact icon, headline centered for quick readability, and simple modular spacing",
    },
  },
  {
    id: "twitch-apex-squad",
    platform: "twitch",
    name: "Apex Squad",
    previewUrl: "/twitch/panels/apex_squad_prv.webp",
    credits: 1,
    categories: {
      games: ["apex-legends"],
      styles: ["esports"],
      themes: ["squad"],
      colors: ["red", "black"],
    },
    promptPreset: {
      basePrompt: "Create a premium Twitch panel with a competitive hero-shooter squad identity",
      styleDescriptors:
        "fast-paced esports presence, sharp contrast, modern arena energy, and premium team-style branding",
      compositionHints:
        "dominant title area, graphic icon anchor, controlled supporting text, and clean tournament-ready polish",
    },
  },
  {
    id: "twitch-cyberpunk-breakdown",
    platform: "twitch",
    name: "Cyberpunk Breakdown",
    previewUrl: "/twitch/panels/cyberpunk_breakdown_prv.webp",
    credits: 1,
    categories: {
      games: ["cyberpunk-2077"],
      styles: ["futuristic"],
      themes: ["neon-city"],
      colors: ["purple", "blue"],
    },
    promptPreset: {
      basePrompt: "Create a premium Twitch panel with high-end cyberpunk interface branding",
      styleDescriptors:
        "neon technology, slick dystopian polish, UI layering, and sharp cinematic sci-fi atmosphere",
      compositionHints:
        "framed interface layout, strong icon silhouette, crisp title hierarchy, and glowing edge accents",
    },
  },
  {
    id: "twitch-valorant-strike",
    platform: "twitch",
    name: "Valorant Strike",
    previewUrl: "/twitch/panels/valorant_strike_prv.webp",
    credits: 1,
    categories: {
      games: ["valorant"],
      styles: ["competitive"],
      themes: ["agents"],
      colors: ["red", "white"],
    },
    promptPreset: {
      basePrompt: "Create a premium Twitch panel with disciplined tactical-hero branding",
      styleDescriptors:
        "clean competitive precision, bold title contrast, premium shooter style, and polished agent-era energy",
      compositionHints:
        "angular frame language, headline clarity, minimal clutter, and strong icon emphasis",
    },
  },
  {
    id: "twitch-roblox-chaos",
    platform: "twitch",
    name: "Roblox Chaos",
    previewUrl: "/twitch/panels/roblox_chaos_prv.webp",
    credits: 1,
    categories: {
      games: ["roblox"],
      styles: ["cartoon"],
      themes: ["playful"],
      colors: ["pink", "orange"],
    },
    promptPreset: {
      basePrompt: "Create a premium Twitch panel with colorful playful sandbox-platform energy",
      styleDescriptors:
        "friendly shapes, creator-friendly polish, cheerful contrast, and bright game-inspired presentation",
      compositionHints:
        "simplified icon block, easy-to-read title, upbeat frame accents, and clean content spacing",
    },
  },
  {
    id: "twitch-league-arcane",
    platform: "twitch",
    name: "Arcane Champion",
    previewUrl: "/twitch/panels/arcane_champion_prv.webp",
    credits: 1,
    categories: {
      games: ["league-of-legends"],
      styles: ["fantasy"],
      themes: ["champion"],
      colors: ["blue", "gold"],
    },
    promptPreset: {
      basePrompt: "Create a premium Twitch panel with heroic fantasy-esports branding",
      styleDescriptors:
        "elevated dramatic styling, champion-level prestige, rich lighting, and elegant competitive presence",
      compositionHints:
        "ornamental frame energy, strong icon medallion, premium title hierarchy, and readable fantasy details",
    },
  },
];
