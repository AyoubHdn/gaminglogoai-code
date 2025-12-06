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
  creditCost: 1,
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
{
  id: "futuristicStream",
  name: "Futuristic Stream",
  previewSrc: "/twitch/banner/futuristic_stream_prv.png",
  backgroundSrc: "/twitch/banner/futuristic_stream_bg.webp",
  creditCost: 1,
  supportsPhoto: true,
  category: "With Logo",
  maxChannelChars: 12,
  maxTaglineChars: 28,
  
  styleRules: {
    canvasWidth: 1200,
    canvasHeight: 480,
    photo: {
      x: 170,
      y: 125,
      width: 230,
      height: 230
    },
    fonts: {
      headline: { family: "Orbitron", file: "Orbitron-Regular.ttf" },
      body: { family: "ARIAL", file: "ARIAL.TTF" }
    },
    elements: {
      channelName: {
        x: 480,
        y: 245,
        fontSize: 75,
        fontWeight: "900",
        color: "#FFFFFF",
        fontFamily: "headline",
        textAnchor: "start",
        letterSpacing: 2
      },
      tagline: {
        x: 485,
        y: 300,
        fontSize: 45,
        fontWeight: "400",
        color: "#FFFFFF",
        fontFamily: "body",
        textAnchor: "start"
      }
    }
  }
},
{
  id: "neonRetro",
  name: "Neon Retro",
  previewSrc: "/twitch/banner/neon_retro_prv.png",
  backgroundSrc: "/twitch/banner/neon_retro_bg.webp",
  creditCost: 1,
  supportsPhoto: true,
  category: "With Logo",
  maxChannelChars: 22,
  maxTaglineChars: 31,
  
  styleRules: {
    canvasWidth: 1200,
    canvasHeight: 480,
    photo: {
      x: 485,
      y: 65,
      width: 230,
      height: 230
    },
    fonts: {
      headline: { family: "Orbitron", file: "Orbitron-Regular.ttf" },
      body: { family: "ARIAL", file: "ARIAL.TTF" }
    },
    elements: {
      channelName: {
        x: 600,
        y: 380,
        fontSize: 68,
        fontWeight: "900",
        color: "#FFFFFF",
        fontFamily: "headline",
        textAnchor: "middle",
        letterSpacing: 2
      },
      tagline: {
        x: 600,
        y: 430,
        fontSize: 45,
        fontWeight: "bold",
        color: "#00ffff",
        fontFamily: "body",
        textAnchor: "middle"
      }
    }
  }
},
{
  id: "futuristicNeon",
  name: "Futuristic Neon",
  previewSrc: "/twitch/banner/futuristic_neon_prv.png",
  backgroundSrc: "/twitch/banner/futuristic_neon_bg.webp",
  creditCost: 1,
  supportsPhoto: true,
  category: "With Logo",
  maxChannelChars: 13,
  maxTaglineChars: 33,
  
  styleRules: {
    canvasWidth: 1200,
    canvasHeight: 480,
    photo: {
      x: 110,
      y: 95,
      width: 290,
      height: 290
    },
    fonts: {
      headline: { family: "Orbitron", file: "Orbitron-Regular.ttf" },
      body: { family: "ARIAL", file: "ARIAL.TTF" }
    },
    elements: {
      channelName: {
        x: 490,
        y: 250,
        fontSize: 75,
        fontWeight: "bold",
        color: "#FFFFFF",
        fontFamily: "headline",
        textAnchor: "start",
        letterSpacing: 3
      },
      tagline: {
        x: 490,
        y: 290,
        fontSize: 34,
        fontWeight: "400",
        color: "#e0c2ff",
        fontFamily: "body",
        textAnchor: "start",
        letterSpacing: 2
      }
    }
  }
},
// no logo designs
{
  id: "pastelPlay",
  name: "Pastel Play",
  previewSrc: "/twitch/banner/pastel_play_prv.png",
  backgroundSrc: "/twitch/banner/pastel_play_bg.webp",
  creditCost: 1,
  supportsPhoto: false,
  category: "Without Logo",
  maxChannelChars: 13,
  maxTaglineChars: 28,
  
  styleRules: {
    canvasWidth: 1200,
    canvasHeight: 480,
    fonts: {
      headline: { family: "Arial Rounded MT Bold", file: "arialroundedmtbold.ttf" },
      body: { family: "Arial Rounded MT Bold", file: "arialroundedmtbold.ttf" }
    },
    elements: {
      channelName: {
        x: 600,
        y: 230,
        fontSize: 95,
        fontWeight: "bold",
        color: "#9E8DBB",
        fontFamily: "headline",
        textAnchor: "middle",
        letterSpacing: 2
      },
      tagline: {
        x: 600,
        y: 308,
        fontSize: 30,
        fontWeight: "normal",
        color: "#FFE8F0",
        fontFamily: "body",
        textAnchor: "middle"
      }
    }
  }
},
{
  id: "blueTechGlitch",
  name: "Blue Tech Glitch",
  previewSrc: "/twitch/banner/blue_tech_glitch_prv.png",
  backgroundSrc: "/twitch/banner/blue_tech_glitch_bg.webp",
  creditCost: 1,
  supportsPhoto: false,
  category: "Without Logo",
  maxChannelChars: 16,
  maxTaglineChars: 41,
  
  styleRules: {
    canvasWidth: 1200,
    canvasHeight: 480,
    fonts: {
      headline: { family: "Orbitron", file: "Orbitron-Regular.ttf" },
      body: { family: "Arial", file: "ARIAL.TTF" }
    },
    elements: {
      channelName: {
        x: 600,
        y: 240,
        fontSize: 90,
        fontWeight: "900",
        color: "#FFFFFF",
        fontFamily: "headline",
        textAnchor: "middle",
        letterSpacing: 2
      },
      tagline: {
        x: 600,
        y: 300,
        fontSize: 32,
        fontWeight: "bold",
        color: "#00ccff",
        fontFamily: "body",
        textAnchor: "middle"
      }
    }
  }
},
{
  id: "minimalSnowfall",
  name: "Minimal Snowfall",
  previewSrc: "/twitch/banner/minimal_snowfall_prv.png",
  backgroundSrc: "/twitch/banner/minimal_snowfall_bg.webp",
  creditCost: 1,
  supportsPhoto: false,
  category: "Without Logo",
  maxChannelChars: 13,
  maxTaglineChars: 67,
  
  styleRules: {
    canvasWidth: 1200,
    canvasHeight: 480,
    fonts: {
      headline: { family: "Arial Rounded MT Bold", file: "arialroundedmtbold.ttf" },
      body: { family: "Arial", file: "ARIAL.TTF" }
    },
    elements: {
      channelName: {
        x: 600,
        y: 270,
        fontSize: 130,
        fontWeight: "900",
        color: "#f0f0f0",
        fontFamily: "headline",
        textAnchor: "middle",
        letterSpacing: 2
      },
      tagline: {
        x: 600,
        y: 325,
        fontSize: 28,
        fontWeight: "bold",
        color: "#f0f0f0",
        fontFamily: "body",
        textAnchor: "middle",
        letterSpacing: 1.5
      }
    }
  }
},
{
  id: "pinkStorm",
  name: "Pink Storm",
  previewSrc: "/twitch/banner/pink_storm_prv.png",
  backgroundSrc: "/twitch/banner/pink_storm_bg.webp",
  creditCost: 1,
  supportsPhoto: false,
  category: "Without Logo",
  maxChannelChars: 10,
  maxTaglineChars: 60,
  
  styleRules: {
    canvasWidth: 1200,
    canvasHeight: 480,
    fonts: {
      headline: { family: "Arial Black", file: "arialblack.ttf" },
      body: { family: "Arial Black", file: "arialblack.ttf" }
    },
    elements: {
      channelName: {
        x: 600,
        y: 300,
        fontSize: 180,
        fontWeight: "900",
        color: "#000000",
        fontFamily: "headline",
        textAnchor: "middle",
        letterSpacing: 2
      },
      tagline: {
        x: 600,
        y: 380,
        fontSize: 28,
        fontWeight: "bold",
        color: "#FFFFFF",
        fontFamily: "body",
        textAnchor: "middle",
        letterSpacing: 1
      }
    }
  }
},
];
