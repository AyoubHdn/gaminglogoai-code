import {
  GenerationError,
  parseLogoRequest,
  type GenerationDbService,
  type GenerationExecutor,
  type GenerationReservation,
  type LogoRequest,
} from "./contract.ts";

type Dependencies = {
  service: GenerationDbService;
  executor: GenerationExecutor;
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
    const execution = await dependencies.executor.execute({
      ...input,
      shouldWatermark: reservation.shouldWatermark,
      plannedOutputIds: reservation.icons.map((icon) => icon.id),
    });
    if (execution.status === "failed") {
      if (execution.certainty === "ambiguous")
        throw new GenerationError("GENERATION_EXECUTION_AMBIGUOUS");
      throw new GenerationError("GENERATION_EXECUTION_FAILED");
    }
    if (
      execution.outputIds.length !== reservation.icons.length ||
      execution.outputIds.some(
        (id, index) => id !== reservation.icons[index]?.id,
      )
    )
      throw new GenerationError("GENERATION_EXECUTION_AMBIGUOUS");
    if ((await service.completeLogo(input)) !== "completed")
      throw new Error("Generation completion failed");
  } catch (error) {
    // An executor response can be lost after provider/storage work. Do not
    // refund an ambiguous execution; recovery or explicit review owns it.
    if (
      !(error instanceof GenerationError) ||
      error.code === "GENERATION_EXECUTION_FAILED"
    ) {
      await service.refundLogo(input);
    }
    throw error;
  }
  const completed = { ...reservation, state: "completed" as const };
  // Mautic remains best-effort and cannot reverse a completed generation.
  if (dependencies.sync)
    await dependencies.sync(completed).catch(() => undefined);
  return completed;
}

