const DEFAULT_NAME_PART = "creator";
const MAX_NAME_PART_LENGTH = 64;

export function sanitizeDownloadPart(
  value: string | null | undefined,
  fallback = DEFAULT_NAME_PART,
): string {
  const sanitized = (value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_NAME_PART_LENGTH)
    .replace(/-+$/g, "");

  return sanitized || fallback;
}

export function buildStudioDownloadFilename({
  text,
  toolType,
}: {
  text: string | null | undefined;
  toolType: string;
}): string {
  return `gaminglogoai-com_${sanitizeDownloadPart(text)}_${sanitizeDownloadPart(toolType, "generated-image")}.png`;
}
