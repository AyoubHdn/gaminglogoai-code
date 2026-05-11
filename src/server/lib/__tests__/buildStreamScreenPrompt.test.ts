import assert from "node:assert/strict";

import { type StreamScreenPlatformConfig } from "../../../data/streamScreenPlatforms";
import { type StreamScreenTemplate } from "../../../data/streamScreenTemplates";
import { buildStreamScreenPrompt } from "../buildStreamScreenPrompt.js";

const platform: StreamScreenPlatformConfig = {
  id: "twitch",
  displayName: "Twitch",
  enabled: true,
  storagePrefix: "twitch/stream-screens",
  description: "Twitch full-screen stream scenes.",
  canvas: {
    width: 1920,
    height: 1080,
    aspectRatioLabel: "16:9",
  },
  maxTitleChars: 40,
  maxSubtitleChars: 90,
  screenPresets: [
    {
      id: "starting",
      label: "Starting Soon",
      description: "Warm up the room before you go live.",
      defaultTitle: "STARTING SOON",
      defaultSubtitle: "Grab a drink, we'll be live shortly",
    },
    {
      id: "brb",
      label: "Be Right Back",
      description: "Keep the stream branded while you step away.",
      defaultTitle: "BE RIGHT BACK",
      defaultSubtitle: "Don't go anywhere",
    },
    {
      id: "offline",
      label: "Offline",
      description: "Keep your channel polished when the stream is down.",
      defaultTitle: "STREAM OFFLINE",
      defaultSubtitle: "Thanks for watching",
    },
    {
      id: "ending",
      label: "Ending",
      description: "Close the stream with a strong final scene.",
      defaultTitle: "STREAM ENDED",
      defaultSubtitle: "See you next time",
    },
  ],
};

const template: StreamScreenTemplate = {
  id: "twitch-fortnite-hype",
  platform: "twitch",
  name: "Fortnite Hype",
  previewUrl: "/twitch/screens/pink_storm_prv.webp",
  credits: 1,
  categories: {
    games: ["fortnite"],
    styles: ["cartoon"],
    themes: ["electric"],
    colors: ["blue", "pink"],
  },
  promptPreset: {
    basePrompt:
      "Create a premium Twitch stream screen with bold creator-first battle-royale energy",
    styleDescriptors:
      "playful action styling, glossy impact, bright contrast, and streamer-friendly game polish",
    compositionHints:
      "big readable title zone, lively atmosphere, energetic framing accents, and simple high-impact fullscreen balance",
  },
};

const tests: Array<{ name: string; run: () => void }> = [
  {
    name: "prompt with subtitle and no style reference",
    run: () => {
      const prompt = buildStreamScreenPrompt({
        platform,
        template,
        screenPreset: platform.screenPresets[0]!,
        title: "STARTING SOON",
        subtitle: "Grab a drink, we'll be live shortly",
        useStyleReference: false,
      });

      assert.ok(prompt.includes("Create a premium Twitch stream screen graphic."));
      assert.ok(
        prompt.includes(
          "Create a premium Twitch stream screen with bold creator-first battle-royale energy."
        )
      );
      assert.ok(
        prompt.includes(
          "Match the selected template closely with fortnite game influence, cartoon art style, electric theme, and blue and pink color palette."
        )
      );
      assert.ok(prompt.includes("Target canvas: 1920x1080 (16:9) fullscreen stream scene."));
      assert.ok(
        prompt.includes(
          "Treat this as a Starting Soon screen. Build anticipation, calm confidence, and a polished pre-show atmosphere without making it feel abandoned or empty."
        )
      );
      assert.ok(
        prompt.includes(
          'Place the title "STARTING SOON" as the dominant readable headline.'
        )
      );
      assert.ok(
        prompt.includes(
          `Place the subtitle "Grab a drink, we'll be live shortly" directly beneath or near the title as smaller supporting text.`
        )
      );
      assert.ok(
        prompt.includes(
          "Establish a strong signature style for the whole screen set with consistent environment language, lighting, typography treatment, and premium broadcast polish that can carry across all matching scenes."
        )
      );
    },
  },
  {
    name: "prompt with style reference guidance",
    run: () => {
      const prompt = buildStreamScreenPrompt({
        platform,
        template,
        screenPreset: platform.screenPresets[1]!,
        title: "BE RIGHT BACK",
        subtitle: "Don't go anywhere",
        useStyleReference: true,
      });

      assert.ok(
        prompt.includes(
          "Use the attached reference as a strict style guide for the screen set."
        )
      );
      assert.ok(
        prompt.includes(
          "Do not copy the previous screen's wording. Replace it with this screen's own text exactly."
        )
      );
      assert.ok(
        prompt.includes(
          "Treat this as a Be Right Back screen. Make the temporary break clear, reassuring, and professional rather than dramatic or final."
        )
      );
    },
  },
  {
    name: "prompt with no subtitle",
    run: () => {
      const prompt = buildStreamScreenPrompt({
        platform,
        template,
        screenPreset: platform.screenPresets[2]!,
        title: "STREAM OFFLINE",
        subtitle: null,
        useStyleReference: false,
      });

      assert.ok(prompt.includes("Do not add extra subtitle copy beyond the title unless needed for visual balance."));
      assert.ok(
        prompt.includes(
          "Treat this as an Offline screen. Give it a finished after-hours mood that still feels branded and intentional instead of generic shutdown art."
        )
      );
    },
  },
  {
    name: "title escaping handles quotes",
    run: () => {
      const prompt = buildStreamScreenPrompt({
        platform,
        template,
        screenPreset: platform.screenPresets[3]!,
        title: 'STREAM "ENDED"',
        subtitle: "See you next time",
        useStyleReference: false,
      });

      assert.ok(
        prompt.includes(
          'Place the title "STREAM \\"ENDED\\"" as the dominant readable headline.'
        )
      );
    },
  },
];

let passed = 0;

for (const test of tests) {
  test.run();
  passed += 1;
  console.log(`PASS ${test.name}`);
}

console.log(`Passed ${passed}/${tests.length} buildStreamScreenPrompt tests`);
