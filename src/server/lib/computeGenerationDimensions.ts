export interface GenerationDimensions {
  width: number;
  height: number;
}

export function computeGenerationDimensions(
  targetWidth: number,
  targetHeight: number,
  minShortSide = 1024,
  maxLongSide = Number.POSITIVE_INFINITY,
  multipleOf = 1
): GenerationDimensions {
  if (
    !Number.isFinite(targetWidth) ||
    !Number.isFinite(targetHeight) ||
    targetWidth <= 0 ||
    targetHeight <= 0
  ) {
    throw new Error("Target dimensions must be positive finite numbers.");
  }

  if (!Number.isFinite(minShortSide) || minShortSide <= 0) {
    throw new Error("minShortSide must be a positive finite number.");
  }

  if (!Number.isFinite(maxLongSide) || maxLongSide <= 0) {
    throw new Error("maxLongSide must be a positive finite number.");
  }

  if (!Number.isFinite(multipleOf) || multipleOf <= 0) {
    throw new Error("multipleOf must be a positive finite number.");
  }

  const shortSide = Math.min(targetWidth, targetHeight);
  const longSide = Math.max(targetWidth, targetHeight);

  let scale = 1;

  if (shortSide < minShortSide) {
    scale = minShortSide / shortSide;
  }

  if (longSide * scale > maxLongSide) {
    scale = maxLongSide / longSide;
  }

  const snappedWidth = Math.max(
    multipleOf,
    Math.round((targetWidth * scale) / multipleOf) * multipleOf
  );
  const snappedHeight = Math.max(
    multipleOf,
    Math.round((targetHeight * scale) / multipleOf) * multipleOf
  );

  return {
    width: snappedWidth,
    height: snappedHeight,
  };
}
