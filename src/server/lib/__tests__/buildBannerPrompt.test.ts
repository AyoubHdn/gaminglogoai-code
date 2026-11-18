import assert from "node:assert/strict";

import { type BannerTemplate } from "../../../data/bannerTemplates";
import { buildBannerPrompt } from "../buildBannerPrompt.js";

const template: BannerTemplate = {
  id: "fortnite-neon-rush",
  name: "Fortnite Neon Rush",
  platform: "twitch",
  thumbnailUrl: "https://example.com/fortnite-neon-rush.png",
  categories: {
    games: ["fortnite"],
    colors: ["blue", "purple"],
    styles: ["cartoon"],
    themes: [],
  },
  promptPreset: {
    basePrompt: "Epic Fortnite-themed Twitch banner",
    styleDescriptors:
      "vibrant neon aesthetic, electric purple and cyan lighting, fast-paced action energy, modern esports polish",
    compositionHints:
      "wide horizontal composition, strong focal center, layered motion streaks, premium streamer branding atmosphere",
  },
  credits: 10,
};

const tests: Array<{ name: string; run: () => void }> = [
  {
    name: "prompt with all optional fields",
    run: () => {
      const prompt = buildBannerPrompt({
        template,
        channelName: "RushZone",
        tagline: "Clutch every night",
        socialHandles: [
          {
            platform: "twitch",
            handle: "@rushzone",
          },
        ],
        hasLogo: true,
      });

      assert.ok(prompt.includes("Create a premium Twitch banner."));
      assert.ok(prompt.includes("Epic Fortnite-themed Twitch banner."));
      assert.ok(
        prompt.includes(
          "Match the selected template closely with fortnite game influence, cartoon art style, and blue and purple color palette."
        )
      );
      assert.ok(
        prompt.includes(
          "Use the attached logo, emblem, avatar, or photo as a visual reference."
        )
      );
      assert.ok(
        prompt.includes(
          "Do not paste, frame, crop, box, or place the exact uploaded image anywhere in the banner."
        )
      );
      assert.ok(
        prompt.includes(
          "If the reference includes a person, face, or character, redesign that subject so they look dressed, armored, posed, and lit like they belong naturally inside the selected game world and theme style."
        )
      );
      assert.ok(
        prompt.includes(
          'Place the channel name "RushZone" as the dominant headline on the right side'
        )
      );
      assert.ok(
        prompt.includes(
          "Use bold stylized gaming typography with energetic shapes, modern streamer personality, and playful high-impact readability."
        )
      );
      assert.ok(
        prompt.includes(
          'Place the tagline "Clutch every night" directly beneath the channel name in smaller secondary text.'
        )
      );
      assert.ok(
        prompt.includes(
          'Include Twitch icon with handle "@rushzone".'
        )
      );
      assert.ok(
        prompt.includes(
          "Do not misspell, mutate, paraphrase, or invent any letters, words, handles, or social media logos."
        )
      );
    },
  },
  {
    name: "prompt with no tagline",
    run: () => {
      const prompt = buildBannerPrompt({
        template,
        channelName: "RushZone",
        tagline: null,
        socialHandles: [
          {
            platform: "youtube",
            handle: "@rushzone",
          },
        ],
        hasLogo: true,
      });

      assert.ok(prompt.includes("Do not add a tagline."));
      assert.ok(
        prompt.includes(
          'Include YouTube icon with handle "@rushzone".'
        )
      );
      assert.ok(
        prompt.includes(
          "Do not create an inset portrait, sticker, thumbnail, badge, card, or corner overlay from the reference image."
        )
      );
    },
  },
  {
    name: "prompt with no logo",
    run: () => {
      const prompt = buildBannerPrompt({
        template,
        channelName: "RushZone",
        tagline: "Clutch every night",
        socialHandles: [
          {
            platform: "twitch",
            handle: "@rushzone",
          },
        ],
        hasLogo: false,
      });

      assert.ok(!prompt.includes("Reserve a clean placement zone"));
      assert.ok(prompt.includes("Do not add a separate logo mark."));
      assert.ok(
        prompt.includes(
          'Place the tagline "Clutch every night" directly beneath the channel name in smaller secondary text.'
        )
      );
    },
  },
  {
    name: "logo reference is integrated rather than pasted as a card",
    run: () => {
      const prompt = buildBannerPrompt({
        template,
        channelName: "ProGamer",
        tagline: "Live every night at 9 PM",
        socialHandles: [],
        hasLogo: true,
      });

      assert.ok(
        prompt.includes(
          "If you echo the subject or logo inspiration, reinterpret it as fully integrated native artwork blended into the banner composition rather than a separate rectangular image."
        )
      );
      assert.ok(
        prompt.includes(
          "Adapt clothing, gear, mood, and styling cues to match the chosen game and art direction while preserving the subject's core identity."
        )
      );
      assert.ok(
        !prompt.includes("Reserve a clean placement zone for it on the left side")
      );
    },
  },
  {
    name: "tactical templates request tactical typography",
    run: () => {
      const prompt = buildBannerPrompt({
        template: {
          ...template,
          categories: {
            games: ["call-of-duty"],
            colors: ["black", "blue"],
            styles: ["monogram"],
            themes: [],
          },
          promptPreset: {
            ...template.promptPreset,
            basePrompt: "Night-ops Call of Duty-style Twitch banner",
          },
        },
        channelName: "ProGamer",
        tagline: "Live every night at 9 PM",
        socialHandles: [],
        hasLogo: true,
      });

      assert.ok(
        prompt.includes(
          "Use bold tactical esports typography with sharp, disciplined letterforms and a premium military-competitive feel."
        )
      );
    },
  },
  {
    name: "prompt with social handles included",
    run: () => {
      const prompt = buildBannerPrompt({
        template,
        channelName: "RushZone",
        tagline: null,
        socialHandles: [
          {
            platform: "discord",
            handle: "RushZone",
          },
          {
            platform: "x",
            handle: "@rushzone",
          },
        ],
        hasLogo: false,
      });

      assert.ok(
        prompt.includes(
          'Include Discord icon with handle "RushZone" and X icon with handle "@rushzone".'
        )
      );
    },
  },
  {
    name: "prompt with no socials",
    run: () => {
      const prompt = buildBannerPrompt({
        template,
        channelName: "RushZone",
        tagline: "Clutch every night",
        socialHandles: [],
        hasLogo: false,
      });

      assert.ok(!prompt.includes("@rushzone"));
      assert.ok(prompt.includes('Place the channel name "RushZone"'));
      assert.ok(prompt.includes("Do not add social media icons or social handle text."));
    },
  },
  {
    name: "channel name escaping handles quotes",
    run: () => {
      const prompt = buildBannerPrompt({
        template,
        channelName: 'The "Real" Rush',
        tagline: null,
        socialHandles: [],
        hasLogo: false,
      });

      assert.ok(
        prompt.includes(
          'Place the channel name "The \\"Real\\" Rush" as the dominant headline on the right side'
        )
      );
    },
  },
  {
    name: "platform-aware wording avoids twitch hardcode",
    run: () => {
      const prompt = buildBannerPrompt({
        template: {
          ...template,
          platform: "youtube",
        },
        channelName: "RushZone",
        tagline: null,
        socialHandles: [],
        hasLogo: false,
      });

      assert.ok(prompt.includes("Create a premium YouTube banner."));
      assert.ok(prompt.includes("Final result should feel platform-ready for YouTube"));
      assert.ok(!prompt.includes("professional Twitch banner"));
    },
  },
  {
    name: "template categories can drive darker color prompts",
    run: () => {
      const prompt = buildBannerPrompt({
        template: {
          ...template,
          categories: {
            games: ["fortnite"],
            colors: ["black"],
            styles: ["cartoon"],
            themes: [],
          },
        },
        channelName: "RushZone",
        tagline: null,
        socialHandles: [],
        hasLogo: false,
      });

      assert.ok(
        prompt.includes(
          "Match the selected template closely with fortnite game influence, cartoon art style, and black color palette."
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

console.log(`Passed ${passed}/${tests.length} buildBannerPrompt tests`);
