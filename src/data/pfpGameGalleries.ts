const APEX_CONTROL_SLUG = "apex-legends-pfp-maker";

const GALLERY_KEY_ALIASES: Record<string, string> = {
  "cod-pfp-maker": "call-of-duty",
  "rainbow-six-operator-pfp-maker": "rainbow-six-siege",
  "roblox-avatar-pfp-maker": "roblox",
};

const LEGACY_FILE_STEMS: Record<string, string> = {
  "gears-of-war": "gears",
  "rainbow-six-siege": "rainbow-six",
};

const EXAMPLE_DESCRIPTIONS = [
  "original character portrait with game-specific outfit and lighting",
  "original avatar with game-inspired gear and environment",
  "original gaming profile picture with a distinct themed character",
] as const;

export interface PfpGameGalleryImage {
  src: string;
  alt: string;
}

export function isPfpGalleryControl(slug: string): boolean {
  return slug === APEX_CONTROL_SLUG;
}

export function getPfpGameGalleryImages(
  slug: string,
  gameTitle: string,
): PfpGameGalleryImage[] {
  if (isPfpGalleryControl(slug)) {
    return [];
  }

  const routeKey = slug.replace(/-pfp-maker$/, "");
  const galleryKey = GALLERY_KEY_ALIASES[slug] ?? routeKey;
  const fileStem = LEGACY_FILE_STEMS[galleryKey] ?? galleryKey;

  return EXAMPLE_DESCRIPTIONS.map((description, index) => ({
    src: `/images/pseo/pfp/${galleryKey}/${fileStem}-pfp-${index + 2}.webp`,
    alt: `${gameTitle} style gaming PFP example - ${description}`,
  }));
}
