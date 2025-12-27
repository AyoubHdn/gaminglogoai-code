// src/data/twitchPanelStyles.ts

export interface PanelStyleRules {
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
  };
}

export interface TwitchPanelStyle {
  id: string;
  name: string;
  previewSrc: string;
  backgroundSrc: string;
  creditCost: number;
  category: "Minimal" | "Neon" | "Dark" | "Gradient";
  maxTitleChars: number;
  aiEnhancements?: Array<{
    id: string;
    name: string;
    prompt: string;
  }>;
  styleRules: PanelStyleRules;
}

/**
 * Twitch panel standard size: 320 × 100
 */
export const TWITCH_PANEL_STYLES: TwitchPanelStyle[] = [
  {
    id: "blue-digital-flow",
    name: "Blue Digital Flow",
    previewSrc: "/twitch/panels/cyberpunk-prv.png",
    backgroundSrc: "/twitch/panels/cyberpunk-bg.png",
    creditCost: 1,
    category: "Minimal",
    maxTitleChars: 9,

    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Enhance the text only by smoothing gradients, strengthening glow, improving clarity, and refining light diffusion, without modifying the flowing digital background.",
      },
    ],

    styleRules: {
      canvasWidth: 640,
      canvasHeight: 200,
      fonts: {
        title: { family: "Arial Black", file: "arial_black.ttf" },
      },
      elements: {
        title: {
          x: 320,
          y: 100,
          fontSize: 80,
          color: "#FFFFFF",
          fontFamily: "title",
          textAnchor: "middle",
          fontWeight: "900",
          letterSpacing: 2,
        },
      },
    },
  },
  {
    id: "blue-tech-geometry",
    name: "Blue Tech Geometry",
    previewSrc: "/twitch/panels/blue_tech_glitch_prv.png",
    backgroundSrc: "/twitch/panels/blue_tech_glitch_bg.png",
    creditCost: 1,
    category: "Minimal",
    maxTitleChars: 9,

    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Enhance the text only with crisp edges, stronger glow, improved contrast, and clean futuristic lighting while preserving the geometric tech background exactly as it is.",
      },
    ],

    styleRules: {
      canvasWidth: 640,
      canvasHeight: 200,
      fonts: {
        title: { family: "Arial Black", file: "arial_black.ttf" },
      },
      elements: {
        title: {
          x: 320,
          y: 100,
          fontSize: 80,
          color: "#FFFFFF",
          fontFamily: "title",
          textAnchor: "middle",
          fontWeight: "900",
          letterSpacing: 2,
        },
      },
    },
  },

    {
    id: "futuristic-neon",
    name: "Futuristic Neon",
    previewSrc: "/twitch/panels/futuristic_neon_prv.png",
    backgroundSrc: "/twitch/panels/futuristic_neon_bg.png",
    creditCost: 1,
    category: "Minimal",
    maxTitleChars: 9,

    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Enhance the text only with sharper outlines, subtle inner glow, improved brightness balance, and futuristic UI polish while leaving the HUD-style background untouched.",
      },
    ],

    styleRules: {
      canvasWidth: 640,
      canvasHeight: 200,
      fonts: {
        title: { family: "Arial Black", file: "arial_black.ttf" },
      },
      elements: {
        title: {
          x: 320,
          y: 100,
          fontSize: 80,
          color: "#FFFFFF",
          fontFamily: "title",
          textAnchor: "middle",
          fontWeight: "900",
          letterSpacing: 2,
        },
      },
    },
  },

  {
    id: "futuristic-stream",
    name: "Futuristic Stream",
    previewSrc: "/twitch/panels/futuristic_stream_prv.png",
    backgroundSrc: "/twitch/panels/futuristic_stream_bg.png",
    creditCost: 1,
    category: "Minimal",
    maxTitleChars: 9,

    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Enhance the text only by increasing sharpness, glow intensity, and contrast with a cyber-tech finish, keeping the red hexagonal background exactly the same.",
      },
    ],

    styleRules: {
      canvasWidth: 640,
      canvasHeight: 200,
      fonts: {
        title: { family: "Orbitron", file: "Orbitron-Regular.ttf" },
      },
      elements: {
        title: {
          x: 320,
          y: 100,
          fontSize: 80,
          color: "#ffcccc",
          fontFamily: "title",
          textAnchor: "middle",
          fontWeight: "900",
          letterSpacing: 2,
        },
      },
    },
  },

    {
    id: "minimal-snowfall",
    name: "Minimal Snowfall",
    previewSrc: "/twitch/panels/minimal_snowfall_prv.png",
    backgroundSrc: "/twitch/panels/minimal_snowfall_bg.png",
    creditCost: 1,
    category: "Minimal",
    maxTitleChars: 9,

    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Enhance the text only by improving edge definition, depth, and contrast, preserving the bold classic look while keeping the snowy background unchanged.",
      },
    ],

    styleRules: {
      canvasWidth: 640,
      canvasHeight: 200,
      fonts: {
        title: { family: "Arial Rounded MT Bold", file: "arialroundedmtbold.ttf" },
      },
      elements: {
        title: {
          x: 320,
          y: 100,
          fontSize: 80,
          color: "#f0f0f0",
          fontFamily: "title",
          textAnchor: "middle",
          fontWeight: "900",
          letterSpacing: 2,
        },
      },
    },
  },

    {
    id: "neon-retro",
    name: "Neon Retro",
    previewSrc: "/twitch/panels/neon_retro_prv.png",
    backgroundSrc: "/twitch/panels/neon_retro_bg.png",
    creditCost: 1,
    category: "Minimal",
    maxTitleChars: 9,

    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Enhance the text only with stronger neon glow, subtle RGB separation, cleaner outlines, and retro lighting polish while keeping the synthwave grid background intact.",
      },
    ],

    styleRules: {
      canvasWidth: 640,
      canvasHeight: 200,
      fonts: {
        title: { family: "Arial Black", file: "arial_black.ttf" },
      },
      elements: {
        title: {
          x: 320,
          y: 100,
          fontSize: 80,
          color: "#ffffff",
          fontFamily: "title",
          textAnchor: "middle",
          fontWeight: "900",
          letterSpacing: 2,
        },
      },
    },
  },

      {
    id: "pastel-play",
    name: "Pastel Play",
    previewSrc: "/twitch/panels/pastel_play_prv.png",
    backgroundSrc: "/twitch/panels/pastel_play_bg.png",
    creditCost: 1,
    category: "Minimal",
    maxTitleChars: 9,

    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Enhance the text only by smoothing shapes, improving color consistency, increasing readability, and refining softness while leaving the pastel background untouched.",
      },
    ],

    styleRules: {
      canvasWidth: 640,
      canvasHeight: 200,
      fonts: {
        title: { family: "Arial Rounded MT Bold", file: "arialroundedmtbold.ttf" },
      },
      elements: {
        title: {
          x: 320,
          y: 100,
          fontSize: 80,
          color: "#9E8DBB",
          fontFamily: "title",
          textAnchor: "middle",
          fontWeight: "900",
          letterSpacing: 2,
        },
      },
    },
  },

        {
    id: "pink-storm",
    name: "Pink Storm",
    previewSrc: "/twitch/panels/pink_storm_prv.png",
    backgroundSrc: "/twitch/panels/pink_storm_bg.png",
    creditCost: 1,
    category: "Minimal",
    maxTitleChars: 9,

    aiEnhancements: [
      {
        id: "polished-text",
        name: "Polished Text",
        prompt:
          "Enhance the text only by intensifying neon glow, sharpening edges, increasing contrast, and adding energetic light bloom to the lettering while keeping the stormy background exactly unchanged.",
      },
    ],

    styleRules: {
      canvasWidth: 640,
      canvasHeight: 200,
      fonts: {
        title: { family: "Impact", file: "impact.ttf" },
      },
      elements: {
        title: {
          x: 320,
          y: 100,
          fontSize: 80,
          color: "#000000",
          fontFamily: "title",
          textAnchor: "middle",
          fontWeight: "900",
          letterSpacing: 2,
        },
      },
    },
  },
];
