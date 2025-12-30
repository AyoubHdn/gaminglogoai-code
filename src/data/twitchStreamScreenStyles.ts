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
        id: "cinematic",
        name: "Cinematic Glow",
        prompt:
          "Enhance this streaming screen with cinematic lighting, glowing neon effects, professional esports broadcast look, sharp typography",
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
];
