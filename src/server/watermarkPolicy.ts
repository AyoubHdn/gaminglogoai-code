/** Purchase status is the sole watermark exemption; credits do not imply a purchase. */
export function shouldWatermarkPurchaseStatus(
  hasPurchasedCredits: boolean | null | undefined,
): boolean {
  return hasPurchasedCredits !== true;
}
