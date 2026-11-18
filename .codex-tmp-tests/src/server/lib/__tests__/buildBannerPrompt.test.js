import assert from "node:assert/strict";
import { buildBannerPrompt } from "../buildBannerPrompt.js";
const template = {
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
        styleDescriptors: "vibrant neon aesthetic, electric purple and cyan lighting, fast-paced action energy, modern esports polish",
        compositionHints: "wide horizontal composition, strong focal center, layered motion streaks, premium streamer branding atmosphere",
    },
    credits: 3,
};
const tests = [
    {
        name: "prompt with all optional fields",
        run: () => {
            const prompt = buildBannerPrompt({
                template,
                channelName: "RushZone",
                tagline: "Clutch every night",
                socialHandles: "@rushzone",
                hasLogo: true,
            });
            assert.equal(prompt, 'Epic Fortnite-themed Twitch banner, vibrant neon aesthetic, electric purple and cyan lighting, fast-paced action energy, modern esports polish, with the channel name "RushZone" prominently displayed in bold legible sans-serif typography, with tagline "Clutch every night" in smaller secondary text, with social handles "@rushzone" displayed in small text near the bottom-right corner, with empty space reserved in the upper-left corner for a logo overlay, wide horizontal composition, strong focal center, layered motion streaks, premium streamer branding atmosphere, professional Twitch banner, sharp text rendering, high-quality typography');
        },
    },
    {
        name: "prompt with no tagline",
        run: () => {
            const prompt = buildBannerPrompt({
                template,
                channelName: "RushZone",
                tagline: null,
                socialHandles: "@rushzone",
                hasLogo: true,
            });
            assert.ok(!prompt.includes("with tagline"));
            assert.ok(prompt.includes('with social handles "@rushzone" displayed in small text near the bottom-right corner'));
            assert.ok(prompt.includes('with empty space reserved in the upper-left corner for a logo overlay'));
        },
    },
    {
        name: "prompt with no logo",
        run: () => {
            const prompt = buildBannerPrompt({
                template,
                channelName: "RushZone",
                tagline: "Clutch every night",
                socialHandles: "@rushzone",
                hasLogo: false,
            });
            assert.ok(!prompt.includes("empty space reserved in the upper-left corner for a logo overlay"));
            assert.ok(prompt.includes('with tagline "Clutch every night"'));
        },
    },
    {
        name: "prompt with social handles included",
        run: () => {
            const prompt = buildBannerPrompt({
                template,
                channelName: "RushZone",
                tagline: null,
                socialHandles: "@rushzone",
                hasLogo: false,
            });
            assert.ok(prompt.includes('with social handles "@rushzone" displayed in small text near the bottom-right corner'));
        },
    },
    {
        name: "prompt with no socials",
        run: () => {
            const prompt = buildBannerPrompt({
                template,
                channelName: "RushZone",
                tagline: "Clutch every night",
                socialHandles: null,
                hasLogo: false,
            });
            assert.ok(!prompt.includes("@rushzone"));
            assert.ok(prompt.includes('with the channel name "RushZone"'));
            assert.ok(!prompt.includes("bottom-right corner"));
        },
    },
    {
        name: "channel name escaping handles quotes",
        run: () => {
            const prompt = buildBannerPrompt({
                template,
                channelName: 'The "Real" Rush',
                tagline: null,
                socialHandles: null,
                hasLogo: false,
            });
            assert.ok(prompt.includes('with the channel name "The \\"Real\\" Rush"'));
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
