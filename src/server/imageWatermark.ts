import { readFile } from "node:fs/promises";
import path from "node:path";

import type { PrismaClient } from "@prisma/client";
import sharp from "sharp";

const WATERMARK_WIDTH_RATIO = 0.28;
const WATERMARK_MARGIN_RATIO = 0.02;
const MIN_WATERMARK_WIDTH = 72;
const CREATOR = "GamingLogoAI";
const COPYRIGHT = "Created with GamingLogoAI.com";

let watermarkAssetPromise: Promise<Buffer> | null = null;

function loadWatermarkAsset(): Promise<Buffer> {
  watermarkAssetPromise ??= readFile(
    path.join(process.cwd(), "public", "watermark.png"),
  );

  return watermarkAssetPromise;
}

export function shouldWatermarkPurchaseStatus(
  hasPurchasedCredits: boolean | null | undefined,
): boolean {
  return hasPurchasedCredits !== true;
}

export async function shouldWatermarkUser(
  prisma: PrismaClient,
  userId: string,
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { hasPurchasedCredits: true },
  });

  return shouldWatermarkPurchaseStatus(user?.hasPurchasedCredits);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildXmpMetadata(description: string): string {
  return `<?xpacket begin="" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description
      rdf:about=""
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:xmp="http://ns.adobe.com/xap/1.0/"
      xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/">
      <dc:creator><rdf:Seq><rdf:li>${CREATOR}</rdf:li></rdf:Seq></dc:creator>
      <dc:description><rdf:Alt><rdf:li xml:lang="x-default">${escapeXml(description)}</rdf:li></rdf:Alt></dc:description>
      <dc:rights><rdf:Alt><rdf:li xml:lang="x-default">${COPYRIGHT}</rdf:li></rdf:Alt></dc:rights>
      <xmp:CreatorTool>${CREATOR}</xmp:CreatorTool>
      <xmpRights:Marked>True</xmpRights:Marked>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
}

export async function finalizeGeneratedImage(
  sourceBuffer: Buffer,
  {
    shouldWatermark,
    toolType,
  }: {
    shouldWatermark: boolean;
    toolType: string;
  },
): Promise<Buffer> {
  const metadata = await sharp(sourceBuffer).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error("Cannot finalize an image without valid dimensions.");
  }

  let finalizedPixels = sourceBuffer;

  if (shouldWatermark) {
    const watermarkWidth = Math.min(
      metadata.width,
      Math.max(
        MIN_WATERMARK_WIDTH,
        Math.round(metadata.width * WATERMARK_WIDTH_RATIO),
      ),
    );
    const margin = Math.max(
      8,
      Math.round(
        Math.min(metadata.width, metadata.height) * WATERMARK_MARGIN_RATIO,
      ),
    );
    const watermark = await sharp(await loadWatermarkAsset())
      .resize({ width: watermarkWidth })
      .png()
      .toBuffer();
    const watermarkMetadata = await sharp(watermark).metadata();
    const renderedWatermarkWidth = watermarkMetadata.width ?? watermarkWidth;
    const renderedWatermarkHeight = watermarkMetadata.height ?? 0;

    finalizedPixels = await sharp(sourceBuffer)
      .composite([
        {
          input: watermark,
          left: Math.max(0, metadata.width - renderedWatermarkWidth - margin),
          top: Math.max(0, metadata.height - renderedWatermarkHeight - margin),
        },
      ])
      .png()
      .toBuffer();
  }

  const description = `${toolType} created with GamingLogoAI.com`;

  return sharp(finalizedPixels)
    .png()
    .withExif({
      IFD0: {
        Artist: CREATOR,
        Copyright: COPYRIGHT,
        Software: CREATOR,
        ImageDescription: description,
      },
    })
    .withXmp(buildXmpMetadata(description))
    .toBuffer();
}
