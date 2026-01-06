// src/data/twitchStreamScreenStyles.ts

export type StreamScreenType =
  | "starting"
  | "brb"
  | "offline"
  | "ending";

export interface StreamScreenStyleRules {
  canvasWidth: number;
  canvasHeight: number;
  fonts: Record<string, { family: string; file: string }>;
  elements: {
    title: {
      x: number;
      y: number;
      fontSize: number;
      color: string;
      fontFamily: string;
      textAnchor?: "start" | "middle" | "end";
      fontWeight?: string;
      letterSpacing?: number;
    };
    subtitle?: {
      x: number;
      y: number;
      fontSize: number;
      color: string;
      fontFamily: string;
      textAnchor?: "start" | "middle" | "end";
      fontWeight?: string;
      letterSpacing?: number;
    };
  };
}

export interface TwitchStreamScreenStyle {
  id: string;
  name: string;
  screenType: StreamScreenType;
  previewSrc: string;
  backgroundSrc: string;
  creditCost: number;
  maxTitleChars: number;
  maxSubtitleChars: number;
  aiEnhancements?: {
    id: string;
    name: string;
    prompt: string;
  }[];
  styleRules: StreamScreenStyleRules;
}

/**
 * 1920 × 1080 Streaming Screens
 */
export const TWITCH_STREAM_SCREEN_STYLES: TwitchStreamScreenStyle[] = [
  {
    id: "blue-tech-glitch",
    name: "Blue Tech Glitch",
    screenType: "starting",
    previewSrc: "/twitch/screens/blue_tech_glitch_prv.webp",
    backgroundSrc: "/twitch/screens/blue_tech_glitch_bg.webp",
    creditCost: 1,
    maxTitleChars: 18,
    maxSubtitleChars: 46,
    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Bold futuristic sans-serif typography in pure white, with a subtle digital glitch effect (horizontal distortion cuts and broken segments), sharp edges, strong contrast, centered layout, modern cyber-tech style, clean and readable, suitable for gaming or streaming branding, without changing the background",
      },
    ],
    styleRules: {
      canvasWidth: 1920,
      canvasHeight: 1080,
      fonts: {
        title: { family: "Orbitron", file: "Orbitron-Bold.ttf" },
        subtitle: { family: "Montserrat", file: "Montserrat-Regular.ttf" },
      },
      elements: {
        title: {
          x: 960,
          y: 580,
          fontSize: 170,
          color: "#FFFFFF",
          fontFamily: "title",
          textAnchor: "middle",
          letterSpacing: 3,
        },
        subtitle: {
          x: 960,
          y: 660,
          fontSize: 60,
          color: "#FFFFFF",
          fontFamily: "subtitle",
          textAnchor: "middle",
          fontWeight: "400",
          letterSpacing: 10,
        },
      },
    },
  },
  {
    id: "cyberpunk-neon-frame",
    name: "Cyberpunk Neon Frame",
    screenType: "starting",
    previewSrc: "/twitch/screens/cyberpunk-prv.webp",
    backgroundSrc: "/twitch/screens/cyberpunk-bg.webp",
    creditCost: 1,
    maxTitleChars: 18,
    maxSubtitleChars: 46,
    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Bold modern sans-serif typography with a soft neon glow, smooth rounded edges, gradient fill transitioning from cyan to purple/pink, high luminosity, subtle outer glow, clean futuristic cyberpunk style, centered and highly readable, suitable for gaming and streaming branding, without altering the background",
      },
    ],
    styleRules: {
      canvasWidth: 1920,
      canvasHeight: 1080,
      fonts: {
        title: { family: "Arial", file: "ARIAL.ttf" },
        subtitle: { family: "Arial", file: "ARIAL.ttf" },
      },
      elements: {
        title: {
          x: 960,
          y: 580,
          fontSize: 170,
          color: "#FFFFFF",
          fontFamily: "title",
          textAnchor: "middle",
          letterSpacing: 3,
        },
        subtitle: {
          x: 960,
          y: 660,
          fontSize: 60,
          color: "#FFFFFF",
          fontFamily: "subtitle",
          textAnchor: "middle",
          fontWeight: "400",
          letterSpacing: 10,
        },
      },
    },
  },
    {
    id: "futuristic-neon",
    name: "Futuristic Neon",
    screenType: "starting",
    previewSrc: "/twitch/screens/futuristic_neon_prv.webp",
    backgroundSrc: "/twitch/screens/futuristic_neon_bg.webp",
    creditCost: 1,
    maxTitleChars: 18,
    maxSubtitleChars: 46,
    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Clean futuristic sans-serif typography with rounded corners, soft neon glow in purple/magenta tones, smooth uniform stroke weight, subtle inner glow, high readability, minimal cyber-tech aesthetic, centered layout suitable for gaming and streaming titles, without modifying the background",
      },
    ],
    styleRules: {
      canvasWidth: 1920,
      canvasHeight: 1080,
      fonts: {
        title: { family: "Orbitron", file: "Orbitron-Bold.ttf" },
        subtitle: { family: "Orbitron", file: "Orbitron-Regular.ttf" },
      },
      elements: {
        title: {
          x: 960,
          y: 580,
          fontSize: 160,
          color: "#FFFFFF",
          fontFamily: "title",
          textAnchor: "middle",
          letterSpacing: 5,
        },
        subtitle: {
          x: 960,
          y: 660,
          fontSize: 70,
          color: "#FFFFFF",
          fontFamily: "subtitle",
          textAnchor: "middle",
          fontWeight: "400",
          letterSpacing: 3,
        },
      },
    },
  },
  {
    id: "futuristic_stream",
    name: "Futuristic Stream",
    screenType: "starting",
    previewSrc: "/twitch/screens/futuristic_stream_prv.webp",
    backgroundSrc: "/twitch/screens/futuristic_stream_bg.webp",
    creditCost: 1,
    maxTitleChars: 18,
    maxSubtitleChars: 46,
    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Bold futuristic sans-serif typography with sharp geometric edges, solid red color, subtle neon glow and soft outer bloom, high contrast, clean stroke weight, centered layout, aggressive cyber-tech and esports style suitable for gaming and streaming titles. without changing the background",
      },
    ],
    styleRules: {
      canvasWidth: 1920,
      canvasHeight: 1080,
      fonts: {
        title: { family: "Orbitron", file: "Orbitron-Bold.ttf" },
        subtitle: { family: "Orbitron", file: "Orbitron-Regular.ttf" },
      },
      elements: {
        title: {
          x: 960,
          y: 580,
          fontSize: 160,
          color: "#ffcccc",
          fontFamily: "title",
          textAnchor: "middle",
          letterSpacing: 5,
        },
        subtitle: {
          x: 960,
          y: 660,
          fontSize: 70,
          color: "#ffcccc",
          fontFamily: "subtitle",
          textAnchor: "middle",
          fontWeight: "400",
          letterSpacing: 3,
        },
      },
    },
  },
  {
    id: "minimal-snowfall",
    name: "Minimal Snowfall",
    screenType: "starting",
    previewSrc: "/twitch/screens/minimal_snowfall_prv.webp",
    backgroundSrc: "/twitch/screens/minimal_snowfall_bg.webp",
    creditCost: 1,
    maxTitleChars: 18,
    maxSubtitleChars: 46,
    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Bold rounded sans-serif typography with a vintage poster feel, off-white/cream fill, subtle paper grain texture, soft red offset drop shadow creating a mild 3D effect, smooth edges, high readability, friendly retro-modern style suitable for titles and subtitles. without changing the background",
      },
    ],
    styleRules: {
      canvasWidth: 1920,
      canvasHeight: 1080,
      fonts: {
        title: { family: "Arial Rounded MT Bold", file: "arialroundedmtbold.ttf" },
        subtitle: { family: "Arial Rounded MT Bold", file: "arialroundedmtbold.ttf" },
      },
      elements: {
        title: {
          x: 960,
          y: 580,
          fontSize: 200,
          color: "#f0f0f0",
          fontFamily: "title",
          textAnchor: "middle",
          letterSpacing: 2,
          fontWeight: "900",
        },
        subtitle: {
          x: 960,
          y: 660,
          fontSize: 80,
          color: "#f0f0f0",
          fontFamily: "subtitle",
          textAnchor: "middle",
          fontWeight: "400",
          letterSpacing: 2,
        },
      },
    },
  },
    {
    id: "neon-retro",
    name: "Neon Retro",
    screenType: "starting",
    previewSrc: "/twitch/screens/neon_retro_prv.webp",
    backgroundSrc: "/twitch/screens/neon_retro_bg.webp",
    creditCost: 1,
    maxTitleChars: 18,
    maxSubtitleChars: 46,
    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Bold futuristic sans-serif typography with a neon gradient fill (cyan to magenta), strong outer glow, subtle horizontal glitch accents, smooth rounded geometry, luminous edges, high contrast, classic synthwave / retro-futuristic style suitable for gaming and streaming titles. without changing the background",
      },
    ],
    styleRules: {
      canvasWidth: 1920,
      canvasHeight: 1080,
      fonts: {
        title: { family: "Arial Black", file: "arial_black.ttf" },
        subtitle: { family: "Arial", file: "ARIAL.ttf" },
      },
      elements: {
        title: {
          x: 960,
          y: 580,
          fontSize: 180,
          color: "#ffffff",
          fontFamily: "title",
          textAnchor: "middle",
          letterSpacing: 4,
          fontWeight: "900",
        },
        subtitle: {
          x: 960,
          y: 660,
          fontSize: 70,
          color: "#00ffff",
          fontFamily: "subtitle",
          textAnchor: "middle",
          fontWeight: "bold",
          letterSpacing: 2,
        },
      },
    },
  },
  {
    id: "pastel-play",
    name: "Pastel Play",
    screenType: "starting",
    previewSrc: "/twitch/screens/pastel_play_prv.webp",
    backgroundSrc: "/twitch/screens/pastel_play_bg.webp",
    creditCost: 1,
    maxTitleChars: 18,
    maxSubtitleChars: 46,
    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Soft rounded sans-serif typography with thick friendly letterforms, flat pastel purple color, smooth curves, no shadow or glow, high legibility, playful and minimal modern style suitable for cute, lifestyle, or casual content. without altering the background",
      },
    ],
    styleRules: {
      canvasWidth: 1920,
      canvasHeight: 1080,
      fonts: {
        title: { family: "Arial Rounded MT Bold", file: "arialroundedmtbold.ttf" },
        subtitle: { family: "Arial Rounded MT Bold", file: "arialroundedmtbold.ttf" },
      },
      elements: {
        title: {
          x: 960,
          y: 580,
          fontSize: 200,
          color: "#7a6aa3",
          fontFamily: "title",
          textAnchor: "middle",
          letterSpacing: 0,
          fontWeight: "bold",
        },
        subtitle: {
          x: 960,
          y: 660,
          fontSize: 80,
          color: "#7a6aa3",
          fontFamily: "subtitle",
          textAnchor: "middle",
          fontWeight: "bold",
          letterSpacing: 1,
        },
      },
    },
  },
    {
    id: "pink-storm",
    name: "Pink Storm",
    screenType: "starting",
    previewSrc: "/twitch/screens/pink_storm_prv.webp",
    backgroundSrc: "/twitch/screens/pink_storm_bg.webp",
    creditCost: 1,
    maxTitleChars: 18,
    maxSubtitleChars: 46,
    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Bold heavy sans-serif typography with solid black fill, thick neon pink outline, strong outer glow, high contrast edges, clean letterforms, dramatic luminous effect, centered layout, powerful cyber / gaming title style. without changing the background",
      },
    ],
    styleRules: {
      canvasWidth: 1920,
      canvasHeight: 1080,
      fonts: {
        title: { family: "Impact", file: "impact.ttf" },
        subtitle: { family: "Arial Black", file: "arial_black.ttf" },
      },
      elements: {
        title: {
          x: 960,
          y: 580,
          fontSize: 250,
          color: "#000000",
          fontFamily: "title",
          textAnchor: "middle",
          letterSpacing: 2,
          fontWeight: "900",
        },
        subtitle: {
          x: 960,
          y: 670,
          fontSize: 100,
          color: "#000000",
          fontFamily: "subtitle",
          textAnchor: "middle",
          fontWeight: "bold",
          letterSpacing: 1,
        },
      },
    },
  },
];
