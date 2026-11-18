export type StreamScreenPlatformId = "twitch";
export type StreamScreenKind =
  | "starting"
  | "brb"
  | "offline"
  | "ending";

export interface StreamScreenCanvas {
  width: number;
  height: number;
  aspectRatioLabel: string;
}

export interface StreamScreenPreset {
  id: StreamScreenKind;
  label: string;
  description: string;
  defaultTitle: string;
  defaultSubtitle: string;
}

export interface StreamScreenPlatformConfig {
  id: StreamScreenPlatformId;
  displayName: string;
  enabled: boolean;
  storagePrefix: string;
  description: string;
  canvas: StreamScreenCanvas;
  maxTitleChars: number;
  maxSubtitleChars: number;
  screenPresets: StreamScreenPreset[];
}

export const STREAM_SCREEN_PLATFORMS: Record<
  StreamScreenPlatformId,
  StreamScreenPlatformConfig
> = {
  twitch: {
    id: "twitch",
    displayName: "Twitch",
    enabled: true,
    storagePrefix: "twitch/stream-screens",
    description:
      "Twitch stream scenes use full-screen 16:9 overlays for moments like Starting Soon, BRB, Offline, and Ending.",
    canvas: {
      width: 1920,
      height: 1080,
      aspectRatioLabel: "16:9",
    },
    maxTitleChars: 40,
    maxSubtitleChars: 90,
    screenPresets: [
      {
        id: "starting",
        label: "Starting Soon",
        description: "Warm up the room before you go live.",
        defaultTitle: "STARTING SOON",
        defaultSubtitle: "Grab a drink, we'll be live shortly",
      },
      {
        id: "brb",
        label: "Be Right Back",
        description: "Keep the stream branded while you step away.",
        defaultTitle: "BE RIGHT BACK",
        defaultSubtitle: "Don't go anywhere",
      },
      {
        id: "offline",
        label: "Offline",
        description: "Keep your channel polished when the stream is down.",
        defaultTitle: "STREAM OFFLINE",
        defaultSubtitle: "Thanks for watching",
      },
      {
        id: "ending",
        label: "Ending",
        description: "Close the stream with a strong final scene.",
        defaultTitle: "STREAM ENDED",
        defaultSubtitle: "See you next time",
      },
    ],
  },
};
