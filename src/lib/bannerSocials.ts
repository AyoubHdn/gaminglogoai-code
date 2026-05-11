export const BANNER_SOCIAL_PLATFORM_IDS = [
  "youtube",
  "twitch",
  "discord",
  "tiktok",
  "x",
  "instagram",
] as const;

export type BannerSocialPlatformId =
  (typeof BANNER_SOCIAL_PLATFORM_IDS)[number];

export interface BannerSocialHandle {
  platform: BannerSocialPlatformId;
  handle: string;
}

const PLATFORM_LABELS: Record<BannerSocialPlatformId, string> = {
  youtube: "YouTube",
  twitch: "Twitch",
  discord: "Discord",
  tiktok: "TikTok",
  x: "X",
  instagram: "Instagram",
};

export function isBannerSocialPlatformId(
  value: unknown
): value is BannerSocialPlatformId {
  return (
    typeof value === "string" &&
    BANNER_SOCIAL_PLATFORM_IDS.includes(value as BannerSocialPlatformId)
  );
}

export function getBannerSocialPlatformLabel(
  platform: BannerSocialPlatformId
): string {
  return PLATFORM_LABELS[platform];
}

export function normalizeBannerSocialHandles(
  rawValue: unknown
): BannerSocialHandle[] {
  if (!Array.isArray(rawValue)) {
    return [];
  }

  return rawValue
    .filter(
      (
        item
      ): item is {
        platform: unknown;
        handle: unknown;
      } =>
        Boolean(
          item &&
            typeof item === "object" &&
            "platform" in item &&
            "handle" in item
        )
    )
    .map((item) => ({
      platform: isBannerSocialPlatformId(item.platform)
        ? item.platform
        : null,
      handle: typeof item.handle === "string" ? item.handle : "",
    }))
    .filter(
      (item): item is BannerSocialHandle => item.platform !== null
    )
    .slice(0, BANNER_SOCIAL_PLATFORM_IDS.length);
}

export function getFilledBannerSocialHandles(
  handles: BannerSocialHandle[]
): BannerSocialHandle[] {
  return handles
    .map((item) => ({
      ...item,
      handle: item.handle.trim(),
    }))
    .filter((item) => item.handle.length > 0);
}
