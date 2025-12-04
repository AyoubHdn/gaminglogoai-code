export interface StyleRules {
  canvasWidth: number;
  canvasHeight: number;
  fonts: Record<string, { family: string; file: string }>;
  elements: Record<
    string,
    {
      x: number;
      y: number;
      fontSize: number;
      color: string;
      fontFamily: string;
      textAnchor?: "start" | "middle" | "end";
      maxWidth?: number;
      content?: string;       // OPTIONAL
      fontWeight?: string;    // OPTIONAL
      letterSpacing?: number; // OPTIONAL
    }
  >;
  photo?: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

export interface TwitchBannerStyle {
  id: string;
  name: string;
  previewSrc: string;
  backgroundSrc: string;
  styleRules: StyleRules;
  creditCost: number;
  supportsPhoto: boolean;
  category: string;
  maxChannelChars: number;
  maxTaglineChars: number;
}

export const TWITCH_BANNER_STYLES: TwitchBannerStyle[] = [
{
  id: "cyberpunkNeon",
  name: "Cyberpunk Neon Frame",
  previewSrc: "/twitch/banner/cyberpunk-prv.png",
  backgroundSrc: "/twitch/banner/cyberpunk_bg.webp",
  creditCost: 2,
  supportsPhoto: true,
  category: "With Logo",
  maxChannelChars: 11,
  maxTaglineChars: 24,
  
  styleRules: {
    canvasWidth: 1200,
    canvasHeight: 480,
    photo: {
      x: 725,
      y: 73,
      width: 330,
      height: 330
    },
    fonts: {
      headline: { family: "Orbitron", file: "Orbitron-Regular.ttf" },
      body: { family: "ARIAL", file: "ARIAL.TTF" }
    },
    elements: {
      channelName: {
        x: 75,
        y: 245,
        fontSize: 65,
        fontWeight: "800",
        color: "#00ffff",
        fontFamily: "headline",
        textAnchor: "start",
        letterSpacing: 2
      },
      tagline: {
        x: 120,
        y: 295,
        fontSize: 34,
        fontWeight: "bold",
        color: "#fff",
        fontFamily: "body",
        textAnchor: "start"
      }
    }
  }
},
];
