export function computeGenerationDimensions(targetWidth, targetHeight, minShortSide = 1024) {
    if (!Number.isFinite(targetWidth) ||
        !Number.isFinite(targetHeight) ||
        targetWidth <= 0 ||
        targetHeight <= 0) {
        throw new Error("Target dimensions must be positive finite numbers.");
    }
    if (!Number.isFinite(minShortSide) || minShortSide <= 0) {
        throw new Error("minShortSide must be a positive finite number.");
    }
    const shortSide = Math.min(targetWidth, targetHeight);
    if (shortSide >= minShortSide) {
        return {
            width: targetWidth,
            height: targetHeight,
        };
    }
    const scale = minShortSide / shortSide;
    return {
        width: Math.ceil(targetWidth * scale),
        height: Math.ceil(targetHeight * scale),
    };
}
