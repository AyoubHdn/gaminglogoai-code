import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";

import { b64Image } from "~/data/b64Image";
import { finalizeGeneratedImage } from "../imageWatermark";

const source = Buffer.from(b64Image, "base64");

test("Node executor renders valid clean and watermarked PNGs with Sharp", async () => {
  const clean = await finalizeGeneratedImage(source, {
    shouldWatermark: false,
    toolType: "Gaming logo",
  });
  const watermarked = await finalizeGeneratedImage(source, {
    shouldWatermark: true,
    toolType: "Gaming logo",
  });

  const [sourcePixels, cleanPixels, cleanMetadata, watermarkedMetadata] =
    await Promise.all([
      sharp(source).ensureAlpha().raw().toBuffer(),
      sharp(clean).ensureAlpha().raw().toBuffer(),
      sharp(clean).metadata(),
      sharp(watermarked).metadata(),
    ]);

  assert.equal(cleanMetadata.format, "png");
  assert.equal(watermarkedMetadata.format, "png");
  assert.deepEqual(cleanPixels, sourcePixels);
  assert.notDeepEqual(
    await sharp(watermarked).ensureAlpha().raw().toBuffer(),
    sourcePixels,
  );
});


