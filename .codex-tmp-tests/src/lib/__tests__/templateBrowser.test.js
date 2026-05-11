import assert from "node:assert/strict";
import { filterTemplates, getAvailableFilters, getTemplateById, } from "../templateBrowser";
const templates = [
    {
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
            styleDescriptors: "vibrant neon aesthetic",
            compositionHints: "wide horizontal composition",
        },
        credits: 3,
    },
    {
        id: "minecraft-pixel-realms",
        name: "Minecraft Pixel Realms",
        platform: "twitch",
        thumbnailUrl: "https://example.com/minecraft-pixel-realms.png",
        categories: {
            games: ["minecraft"],
            colors: ["green"],
            styles: ["8-bit"],
            themes: ["fantasy"],
        },
        promptPreset: {
            basePrompt: "Minecraft-themed Twitch banner",
            styleDescriptors: "blocky pixel-inspired design",
            compositionHints: "open central horizon",
        },
        credits: 3,
    },
    {
        id: "counter-strike-urban-surge",
        name: "Counter-Strike Urban Surge",
        platform: "twitch",
        thumbnailUrl: "https://example.com/counter-strike-urban-surge.png",
        categories: {
            games: ["counter-strike"],
            colors: ["pink", "black"],
            styles: ["emblem"],
            themes: [],
        },
        promptPreset: {
            basePrompt: "Counter-Strike-inspired Twitch banner",
            styleDescriptors: "urban tactical shooter tension",
            compositionHints: "balanced open text space",
        },
        credits: 3,
    },
];
const tests = [
    {
        name: "empty filters return all templates",
        run: () => {
            assert.deepEqual(filterTemplates(templates, {}), templates);
        },
    },
    {
        name: "single filter dimension narrows correctly",
        run: () => {
            const result = filterTemplates(templates, { styles: ["8-bit"] });
            assert.deepEqual(result.map((template) => template.id), ["minecraft-pixel-realms"]);
        },
    },
    {
        name: "multiple dimensions intersect correctly",
        run: () => {
            const result = filterTemplates(templates, {
                colors: ["pink", "purple"],
                styles: ["emblem"],
            });
            assert.deepEqual(result.map((template) => template.id), ["counter-strike-urban-surge"]);
        },
    },
    {
        name: "available filters return the full category union",
        run: () => {
            const result = getAvailableFilters(templates);
            assert.deepEqual([...result.games], ["fortnite", "minecraft", "counter-strike"]);
            assert.deepEqual([...result.colors], ["blue", "purple", "green", "pink", "black"]);
            assert.deepEqual([...result.styles], ["cartoon", "8-bit", "emblem"]);
            assert.deepEqual([...result.themes], ["fantasy"]);
        },
    },
    {
        name: "missing id returns undefined",
        run: () => {
            assert.equal(getTemplateById(templates, "missing-template"), undefined);
        },
    },
];
let passed = 0;
for (const test of tests) {
    test.run();
    passed += 1;
    console.log(`PASS ${test.name}`);
}
console.log(`Passed ${passed}/${tests.length} templateBrowser tests`);
