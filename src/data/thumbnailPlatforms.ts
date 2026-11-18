import { type PlatformId } from "./platforms";

export interface ThumbnailSurfaceConfig {
  canvas: {
    width: number;
    height: number;
  };
  storagePrefix: string;
}

export interface ThumbnailPlatformConfig {
  id: PlatformId;
  displayName: string;
  enabled: boolean;
  surface: ThumbnailSurfaceConfig;
}

export const THUMBNAIL_PLATFORMS: Record<
  "youtube",
  ThumbnailPlatformConfig
> = {
  youtube: {
    id: "youtube",
    displayName: "YouTube",
    enabled: true,
    surface: {
      canvas: { width: 1280, height: 720 },
      storagePrefix: "youtube/thumbnails",
    },
  },
};
