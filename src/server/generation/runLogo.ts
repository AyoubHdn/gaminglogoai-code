import {
  GenerationError,
  parseLogoRequest,
  type GenerationDbService,
  type GenerationIcon,
  type GenerationReservation,
  type LogoRequest,
} from "./contract.ts";

type Dependencies = {
  service: GenerationDbService;
  generate(input: LogoRequest): Promise<string[]>;
  upload(
    icon: GenerationIcon,
    base64: string,
    shouldWatermark: boolean,
  ): Promise<void>;
  sync?(reservation: GenerationReservation): Promise<void>;
};
/** Provider/S3 work stays outside SQL transactions. The DB owns the charge and final icon set. */
export async function runLogoGeneration(
  value: LogoRequest,
  dependencies: Dependencies,
) {
  const input = parseLogoRequest(value);
  const { service } = dependencies;
  // An ambiguous reservation response must stop before any provider or refund call.
  const reservation = await service.reserveLogo(input);
  if (!reservation.acquired) {
    if (reservation.state === "completed") return reservation;
    throw new GenerationError(
      reservation.state === "refunded"
        ? "GENERATION_ALREADY_REFUNDED"
        : "GENERATION_IN_PROGRESS",
    );
  }
  try {
    const images = await dependencies.generate(input);
    if (
      images.length !== reservation.icons.length ||
      images.some((image) => typeof image !== "string" || !image)
    )
      throw new Error("Unexpected generated image count");
    // Await every upload before committing icons. A failed upload never creates a saved icon row.
    const uploads = await Promise.allSettled(
      reservation.icons.map(async (icon, index) => {
        const image = images[index];
        if (!image) throw new Error("Generated image is missing");
        await dependencies.upload(icon, image, reservation.shouldWatermark);
      }),
    );
    if (uploads.some((upload) => upload.status === "rejected"))
      throw new Error("Generation image upload failed");
    if ((await service.completeLogo(input)) !== "completed")
      throw new Error("Generation completion failed");
  } catch (error) {
    // A completion response can be lost after commit. The idempotent refund refuses completed requests.
    // If reconciliation/refund itself fails, leave the request for explicit review; never guess its state.
    await service.refundLogo(input);
    throw error;
  }
  const completed = { ...reservation, state: "completed" as const };
  // Mautic remains best-effort and cannot reverse a completed generation.
  if (dependencies.sync)
    await dependencies.sync(completed).catch(() => undefined);
  return completed;
}
