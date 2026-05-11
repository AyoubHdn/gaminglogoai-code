import assert from "node:assert/strict";

import { computeGenerationDimensions } from "../computeGenerationDimensions.js";

const tests: Array<{ name: string; run: () => void }> = [
  {
    name: "scales 1200x480 to 2560x1024 for a 5:2 banner ratio",
    run: () => {
      const dimensions = computeGenerationDimensions(1200, 480);

      assert.deepEqual(dimensions, { width: 2560, height: 1024 });
    },
  },
  {
    name: "passes through dimensions when short side already meets minimum",
    run: () => {
      const dimensions = computeGenerationDimensions(2560, 1440);

      assert.deepEqual(dimensions, { width: 2560, height: 1440 });
    },
  },
  {
    name: "scales 16:9 dimensions proportionally when needed",
    run: () => {
      const dimensions = computeGenerationDimensions(960, 540);

      assert.equal(dimensions.height, 1024);
      assert.equal(dimensions.width, 1821);
    },
  },
  {
    name: "scales square dimensions to minimum short side",
    run: () => {
      const dimensions = computeGenerationDimensions(800, 800);

      assert.deepEqual(dimensions, { width: 1024, height: 1024 });
    },
  },
  {
    name: "throws on non-positive target dimensions",
    run: () => {
      assert.throws(() => computeGenerationDimensions(0, 480));
      assert.throws(() => computeGenerationDimensions(1200, -1));
    },
  },
];

let passed = 0;

for (const test of tests) {
  test.run();
  passed += 1;
  console.log(`PASS ${test.name}`);
}

console.log(`Passed ${passed}/${tests.length} computeGenerationDimensions tests`);
