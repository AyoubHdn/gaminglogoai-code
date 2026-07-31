import assert from "node:assert/strict";
import test from "node:test";

import { shouldWatermarkPurchaseStatus } from "../imageWatermark";

test("a brand-new non-purchaser is watermarked", () => {
  assert.equal(shouldWatermarkPurchaseStatus(false), true);
});

test("a purchaser with remaining credits receives a clean image", () => {
  assert.equal(shouldWatermarkPurchaseStatus(true), false);
});

test("purchase status stays clean independently of remaining credits", () => {
  const hasPurchasedCredits = true;
  const remainingCredits = 0;

  assert.equal(remainingCredits, 0);
  assert.equal(shouldWatermarkPurchaseStatus(hasPurchasedCredits), false);
});

test("missing legacy purchase status defaults safely to watermarked", () => {
  assert.equal(shouldWatermarkPurchaseStatus(undefined), true);
  assert.equal(shouldWatermarkPurchaseStatus(null), true);
});
