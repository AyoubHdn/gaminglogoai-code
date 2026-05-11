import { type StreamScreenPlatformId } from "./streamScreenPlatforms";

export interface StreamScreenTemplate {
  id: string;
  platform: StreamScreenPlatformId;
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

export const STREAM_SCREEN_TEMPLATES: StreamScreenTemplate[] = [
  {
    id: "twitch-cod-night-ops",
    platform: "twitch",
    name: "Night Ops",
    previewUrl: "/twitch/screens/night_ops_prv.webp",
    credits: 4,
    categories: {
      games: ["call-of-duty"],
      styles: ["monogram"],
      themes: ["tactical"],
      colors: ["black", "blue"],
    },
    promptPreset: {
      basePrompt:
        "Create a premium Twitch stream screen with a tactical military-esports identity",
      styleDescriptors:
        "stealth mood, disciplined contrast, cinematic operator energy, and serious competitive branding",
      compositionHints:
        "full-screen scene depth, sharp headline hierarchy, restrained HUD accents, and premium negative space",
    },
  },
  {
    id: "twitch-fortnite-hype",
    platform: "twitch",
    name: "Fortnite Hype",
    previewUrl: "/twitch/screens/fortnite_hype_prv.webp",
    credits: 4,
    categories: {
      games: ["fortnite"],
      styles: ["cartoon"],
      themes: ["electric"],
      colors: ["blue", "pink"],
    },
    promptPreset: {
      basePrompt:
        "Create a premium Twitch stream screen with bold creator-first battle-royale energy",
      styleDescriptors:
        "playful action styling, glossy impact, bright contrast, and streamer-friendly game polish",
      compositionHints:
        "big readable title zone, lively atmosphere, energetic framing accents, and simple high-impact fullscreen balance",
    },
  },
  {
    id: "twitch-minecraft-build",
    platform: "twitch",
    name: "Block Builder",
    previewUrl: "/twitch/screens/minecraft_build_prv.webp",
    credits: 4,
    categories: {
      games: ["minecraft"],
      styles: ["8-bit"],
      themes: ["builder"],
      colors: ["green", "black"],
    },
    promptPreset: {
      basePrompt:
        "Create a premium Twitch stream screen with a clean blocky sandbox-game identity",
      styleDescriptors:
        "pixel-inspired structure, playful building energy, readable contrast, and polished creator presentation",
      compositionHints:
        "clear environment silhouette, centered message space, modular layout rhythm, and strong readability from a distance",
    },
  },
  {
    id: "twitch-apex-squad",
    platform: "twitch",
    name: "Apex Squad",
    previewUrl: "/twitch/screens/apex_squad_prv.webp",
    credits: 4,
    categories: {
      games: ["apex-legends"],
      styles: ["esports"],
      themes: ["squad"],
      colors: ["red", "black"],
    },
    promptPreset: {
      basePrompt:
        "Create a premium Twitch stream screen with a competitive hero-shooter squad identity",
      styleDescriptors:
        "fast-paced esports presence, sharp contrast, modern arena energy, and premium team-style branding",
      compositionHints:
        "dominant title area, wide cinematic depth, tournament-ready atmosphere, and deliberate UI framing",
    },
  },
  {
    id: "twitch-cyberpunk-breakdown",
    platform: "twitch",
    name: "Cyberpunk Breakdown",
    previewUrl: "/twitch/screens/cyberpunk_breakdown_prv.webp",
    credits: 4,
    categories: {
      games: ["cyberpunk-2077"],
      styles: ["futuristic"],
      themes: ["neon-city"],
      colors: ["purple", "blue"],
    },
    promptPreset: {
      basePrompt:
        "Create a premium Twitch stream screen with high-end cyberpunk interface branding",
      styleDescriptors:
        "neon technology, slick dystopian polish, UI layering, and sharp cinematic sci-fi atmosphere",
      compositionHints:
        "framed interface layout, glowing edge accents, cinematic skyline depth, and crisp type hierarchy",
    },
  },
  {
    id: "twitch-valorant-strike",
    platform: "twitch",
    name: "Valorant Strike",
    previewUrl: "/twitch/screens/valorant_strike_prv.webp",
    credits: 4,
    categories: {
      games: ["valorant"],
      styles: ["competitive"],
      themes: ["agents"],
      colors: ["red", "white"],
    },
    promptPreset: {
      basePrompt:
        "Create a premium Twitch stream screen with disciplined tactical-hero branding",
      styleDescriptors:
        "clean competitive precision, bold title contrast, premium shooter style, and polished agent-era energy",
      compositionHints:
        "angular fullscreen framing, clear headline block, minimal clutter, and strong command-center atmosphere",
    },
  },
  {
    id: "twitch-roblox-chaos",
    platform: "twitch",
    name: "Roblox Chaos",
    previewUrl: "/twitch/screens/roblox_chaos_prv.webp",
    credits: 4,
    categories: {
      games: ["roblox"],
      styles: ["cartoon"],
      themes: ["playful"],
      colors: ["pink", "orange"],
    },
    promptPreset: {
      basePrompt:
        "Create a premium Twitch stream screen with colorful playful sandbox-platform energy",
      styleDescriptors:
        "friendly shapes, creator-friendly polish, cheerful contrast, and bright game-inspired presentation",
      compositionHints:
        "soft fullscreen depth, playful supporting accents, easy-to-read title space, and upbeat environment styling",
    },
  },
  {
    id: "twitch-league-arcane",
    platform: "twitch",
    name: "Arcane Champion",
    previewUrl: "/twitch/screens/arcane_champion_prv.webp",
    credits: 4,
    categories: {
      games: ["league-of-legends"],
      styles: ["fantasy"],
      themes: ["champion"],
      colors: ["blue", "gold"],
    },
    promptPreset: {
      basePrompt:
        "Create a premium Twitch stream screen with heroic fantasy-esports branding",
      styleDescriptors:
        "elevated dramatic styling, champion-level prestige, rich lighting, and elegant competitive presence",
      compositionHints:
        "ornamental scene energy, cinematic background depth, premium title hierarchy, and readable fantasy detailing",
    },
  },
];
