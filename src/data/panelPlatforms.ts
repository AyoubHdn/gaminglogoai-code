export type PanelPlatformId = "twitch";
export type PanelShapeId =
  | "wide-3-1"
  | "landscape-4-3"
  | "square-1-1"
  | "portrait-3-4";

export interface PanelShapeOption {
  id: PanelShapeId;
  label: string;
  aspectRatioLabel: string;
  width: number;
  height: number;
  fluxAspectRatio: "21:9" | "4:3" | "1:1" | "3:4";
  description: string;
  recommended?: boolean;
}

export interface PanelSuggestion {
  title: string;
  content: string;
}

export interface PanelPlatformConfig {
  id: PanelPlatformId;
  displayName: string;
  enabled: boolean;
  storagePrefix: string;
  description: string;
  popularPanelSuggestions: PanelSuggestion[];
  shapes: Record<PanelShapeId, PanelShapeOption>;
}

export const PANEL_PLATFORMS: Record<PanelPlatformId, PanelPlatformConfig> = {
  twitch: {
    id: "twitch",
    displayName: "Twitch",
    enabled: true,
    storagePrefix: "twitch/panels",
    description:
      "Twitch is the main supported platform because creators commonly use panels below the stream for channel information and links.",
    popularPanelSuggestions: [
      {
        title: "About Me",
        content: "Short creator intro, stream vibe, and what viewers can expect here.",
      },
      {
        title: "Schedule",
        content: "Mon Wed Fri 8 PM EST\nWeekend bonus streams when live.",
      },
      {
        title: "Rules",
        content: "Be respectful. No spam. No hate speech. Keep chat fun for everyone.",
      },
      {
        title: "Donate",
        content: "Tips help improve the stream setup and support future content.",
      },
      {
        title: "Discord",
        content: "Join the community for updates, clips, events, and off-stream chat.",
      },
      {
        title: "PC Specs",
        content: "Share your CPU, GPU, RAM, and gear in a clean quick-read layout.",
      },
      {
        title: "FAQ",
        content: "Answer your most common questions in one easy-to-read branded panel.",
      },
      {
        title: "Socials",
        content: "Place your main channels so viewers can find you everywhere you post.",
      },
    ],
    shapes: {
      "wide-3-1": {
        id: "wide-3-1",
        label: "Wide Frame",
        aspectRatioLabel: "3:1",
        width: 1440,
        height: 480,
        fluxAspectRatio: "21:9",
        description:
          "The most-used Twitch panel frame shape for classic horizontal info panels.",
        recommended: true,
      },
      "landscape-4-3": {
        id: "landscape-4-3",
        label: "Landscape Frame",
        aspectRatioLabel: "4:3",
        width: 1152,
        height: 864,
        fluxAspectRatio: "4:3",
        description:
          "A roomier landscape frame shape for panels that need more content space.",
      },
      "square-1-1": {
        id: "square-1-1",
        label: "Square Frame",
        aspectRatioLabel: "1:1",
        width: 1024,
        height: 1024,
        fluxAspectRatio: "1:1",
        description:
          "A balanced square frame shape for badge-style or icon-led panels.",
      },
      "portrait-3-4": {
        id: "portrait-3-4",
        label: "Portrait Frame",
        aspectRatioLabel: "3:4",
        width: 864,
        height: 1152,
        fluxAspectRatio: "3:4",
        description:
          "A tall portrait frame shape for stacked layouts and denser information blocks.",
      },
    },
  },
};
