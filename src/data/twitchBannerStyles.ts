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
  styleRules: {
    canvasWidth: 1200,
    canvasHeight: 480,
    photo: {
      x: 830,
      y: 60,
      width: 270,
      height: 270
    },
    fonts: {
      headline: { family: "Anton", file: "Anton-Regular.ttf" },
      body: { family: "Anton", file: "Anton-Regular.ttf" }
    },
    elements: {
      channelName: {
        x: 350,
        y: 220,
        fontSize: 120,
        color: "#0ff",
        fontFamily: "headline",
        textAnchor: "start",
        letterSpacing: 2
      },
      tagline: {
        x: 350,
        y: 290,
        fontSize: 32,
        color: "#fff",
        fontFamily: "body",
        textAnchor: "start"
      }
    }
  }
},
  {
    id: "blueModern",
    name: "Blue Modern Gamer",
    previewSrc: "/twitch/banner/blue_modern-prv.png",
    backgroundSrc: "/twitch/banner/blue_modern.webp",
    creditCost: 2,
    supportsPhoto: false,
    category: "Without Logo",
    styleRules: {
      canvasWidth: 1200,
      canvasHeight: 480,

      fonts: {
        headline: { family: "Anton", file: "Anton-Regular.ttf" },
        body: { family: "Anton", file: "Anton-Regular.ttf" }
      },

      elements: {
        channelName: {
          x: 360,
          y: 200,
          fontSize: 140,
          color: "#FFFFFF",
          fontFamily: "headline",
          textAnchor: "start"
        },
        tagline: {
          x: 360,
          y: 280,
          fontSize: 36,
          color: "#FFFFFF",
          fontFamily: "body",
          textAnchor: "start"
        }
      },

      photo: {
        x: 750,
        y: 30,
        width: 360,
        height: 420
      }
    }
  },

];
