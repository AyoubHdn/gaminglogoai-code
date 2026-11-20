const OUTPUT_PREFIX_PATTERN = /^(?:[A-Za-z0-9][A-Za-z0-9._-]*\/)+$/;
const OUTPUT_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

/** Deployment configuration only; never request input. */
export function validateGenerationOutputPrefix(value: unknown): string {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value !== "string" || !OUTPUT_PREFIX_PATTERN.test(value))
    throw new Error("GENERATION_OUTPUT_PREFIX_INVALID");
  return value;
}

export function configuredGenerationOutputPrefix(value: unknown): string {
  return validateGenerationOutputPrefix(value);
}

export function generationObjectKey(prefix: string, outputId: string): string {
  const safePrefix = validateGenerationOutputPrefix(prefix);
  if (!OUTPUT_ID_PATTERN.test(outputId) || outputId.includes(".."))
    throw new Error("GENERATION_OUTPUT_ID_INVALID");
  return `${safePrefix}${outputId}`;
}

export function generationImageKey(prefix: string, outputId: string): string | null {
  const safePrefix = validateGenerationOutputPrefix(prefix);
  return safePrefix ? generationObjectKey(safePrefix, outputId) : null;
}
