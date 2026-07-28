export const LOGO_MODEL_CREDITS = {
  "flux-schnell": 1,
  "flux-dev": 2,
} as const;

export const PFP_MODEL_CREDITS = {
  "flux-kontext-pro": 4,
  "flux-kontext-max": 6,
} as const;

export const EMOTE_BASE_CREDITS = 3;
export const EMOTE_EXPRESSION_CREDITS = 3;
export const REFERENCE_IMAGE_CREDIT_SURCHARGE = 1;
export const BANNER_THUMBNAIL_REFINEMENT_CREDITS = 6;

export function getReferenceAwareGenerationCredits(
  textOnlyCredits: number,
  hasReferenceImage: boolean,
): number {
  return (
    textOnlyCredits +
    (hasReferenceImage ? REFERENCE_IMAGE_CREDIT_SURCHARGE : 0)
  );
}
