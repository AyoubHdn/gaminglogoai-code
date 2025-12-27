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
    id: "clean-minimal",
    name: "Clean Minimal",
    previewSrc: "/twitch/panels/clean_minimal_prv.png",
    backgroundSrc: "/twitch/panels/clean_minimal_bg.png",
    creditCost: 1,
    category: "Minimal",
    maxTitleChars: 16,

    aiEnhancements: [
      {
        id: "polished-ui",
        name: "Polished UI",
        prompt:
          "Enhance this Twitch panel with ultra clean UI design, sharp typography, subtle shadows, professional streamer branding, minimalist aesthetic",
      },
    ],

    styleRules: {
      canvasWidth: 320,
      canvasHeight: 100,
      fonts: {
        title: { family: "Inter", file: "Inter-Bold.ttf" },
      },
      elements: {
        title: {
          x: 160,
          y: 52,
          fontSize: 28,
          color: "#111827",
          fontFamily: "title",
          textAnchor: "middle",
          fontWeight: "700",
          letterSpacing: 0.5,
        },
      },
    },
  },

  {
    id: "neon-glow",
    name: "Neon Glow",
    previewSrc: "/twitch/panels/neon_glow_prv.webp",
    backgroundSrc: "/twitch/panels/neon_glow_bg.webp",
    creditCost: 1,
    category: "Neon",
    maxTitleChars: 14,

    aiEnhancements: [
      {
        id: "cyber-neon",
        name: "Cyber Neon",
        prompt:
          "Enhance this Twitch panel with neon glow, cyberpunk lighting, vibrant highlights, esports streamer branding, high contrast UI",
      },
    ],

    styleRules: {
      canvasWidth: 320,
      canvasHeight: 100,
      fonts: {
        title: { family: "Orbitron", file: "Orbitron-Bold.ttf" },
      },
      elements: {
        title: {
          x: 160,
          y: 54,
          fontSize: 26,
          color: "#00FFFF",
          fontFamily: "title",
          textAnchor: "middle",
          letterSpacing: 1.5,
        },
      },
    },
  },

  {
    id: "dark-tech",
    name: "Dark Tech",
    previewSrc: "/twitch/panels/dark_tech_prv.webp",
    backgroundSrc: "/twitch/panels/dark_tech_bg.webp",
    creditCost: 1,
    category: "Dark",
    maxTitleChars: 15,

    aiEnhancements: [
      {
        id: "high-contrast",
        name: "High Contrast",
        prompt:
          "Enhance this Twitch panel with dark UI, high contrast typography, subtle tech patterns, modern streamer branding",
      },
    ],

    styleRules: {
      canvasWidth: 320,
      canvasHeight: 100,
      fonts: {
        title: { family: "Rajdhani", file: "Rajdhani-Bold.ttf" },
      },
      elements: {
        title: {
          x: 160,
          y: 52,
          fontSize: 27,
          color: "#FFFFFF",
          fontFamily: "title",
          textAnchor: "middle",
          letterSpacing: 1,
        },
      },
    },
  },

  {
    id: "soft-gradient",
    name: "Soft Gradient",
    previewSrc: "/twitch/panels/soft_gradient_prv.webp",
    backgroundSrc: "/twitch/panels/soft_gradient_bg.webp",
    creditCost: 1,
    category: "Gradient",
    maxTitleChars: 18,

    aiEnhancements: [
      {
        id: "smooth-colors",
        name: "Smooth Colors",
        prompt:
          "Enhance this Twitch panel with smooth gradient blending, soft lighting, modern UI, elegant streamer branding",
      },
    ],

    styleRules: {
      canvasWidth: 320,
      canvasHeight: 100,
      fonts: {
        title: { family: "Poppins", file: "Poppins-SemiBold.ttf" },
      },
      elements: {
        title: {
          x: 160,
          y: 50,
          fontSize: 24,
          color: "#FFFFFF",
          fontFamily: "title",
          textAnchor: "middle",
          letterSpacing: 0.8,
        },
      },
    },
  },
];
