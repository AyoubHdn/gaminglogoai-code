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
    creditCost: 2,
    maxTitleChars: 18,
    maxSubtitleChars: 46,
    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Twitch streaming screen background, abstract tech futuristic style, dark blue background, glowing cyan 3D geometric crystal triangles floating in space, cybernetic cables framing the edges, falling digital matrix rain particles, deep depth of field, empty center for text, unreal engine 5 render, 8k",
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
    creditCost: 2,
    maxTitleChars: 18,
    maxSubtitleChars: 46,
    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Twitch streaming screen background, abstract neon polygon wireframe style, glowing electric blue and magenta geometric lines and triangular meshes on the left and right borders, deep dark blue void background in the center, high tech, digital art, 8k resolution, minimalist",
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
    creditCost: 2,
    maxTitleChars: 18,
    maxSubtitleChars: 46,
    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Twitch streaming screen background, sci-fi futuristic HUD interface style, sleek purple and violet gradient background, faint glowing digital circuit lines and tech overlay elements in the corners, clean empty center for text, high tech, digital screen, 8k resolution, smooth",
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
    creditCost: 2,
    maxTitleChars: 18,
    maxSubtitleChars: 46,
    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Twitch streaming screen background, dark red sci-fi technology style, abstract red hexagon patterns and digital circuitry lines in the corners, deep crimson gradient background, empty central space for typography, modern esports aesthetic, 8k resolution, cinematic lighting",
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
    creditCost: 2,
    maxTitleChars: 18,
    maxSubtitleChars: 46,
    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Twitch streaming screen background, playful retro cartoon style, dark night sky background with soft falling snow or stars, slight paper texture, clean empty center for text, cozy atmosphere, minimalist vector art style, 8k resolution,",
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
    creditCost: 2,
    maxTitleChars: 18,
    maxSubtitleChars: 46,
    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Twitch streaming screen background, playful retro cartoon style, dark night sky background with soft falling snow or stars, slight paper texture, clean empty center for text, cozy atmosphere, minimalist vector art style, 8k resolution",
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
    creditCost: 2,
    maxTitleChars: 18,
    maxSubtitleChars: 46,
    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Twitch streaming screen background, pastel aesthetic, soft abstract liquid shapes in lavender and cream and pale pink, gentle gradients, clean empty center for text, minimalist, cozy vibes, lo-fi hip hop style art, 8k resolution, smooth vector look,",
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
    creditCost: 2,
    maxTitleChars: 18,
    maxSubtitleChars: 46,
    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Twitch streaming screen background, dark purple storm theme, realistic lightning bolts striking from the sides, rolling dark violet storm clouds, electric atmosphere, empty center for text, cinematic lighting, 8k resolution, weather photography style",
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
          y: 660,
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
