import { TWITCH_BANNER_STYLES } from "./twitchBannerStyles";
const PREVIEW_BY_STYLE_ID = Object.fromEntries(TWITCH_BANNER_STYLES.map((style) => [style.id, style.previewSrc]));
// TODO: Replace these placeholder previews with funnel-specific banner example
// thumbnails. For package 4 we intentionally reuse the old banner style previews
// only as visual hints for the browser grid.
function placeholderPreview(styleId) {
    const preview = PREVIEW_BY_STYLE_ID[styleId];
    if (!preview) {
        throw new Error(`Missing placeholder preview for Twitch banner style "${styleId}"`);
    }
    return preview;
}
const TWITCH_BANNER_TEMPLATE_SEEDS = [
    {
        id: "fortnite-neon-rush",
        name: "Fortnite Neon Rush",
        thumbnailUrl: placeholderPreview("cyberpunkNeon"),
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
    },
    {
        id: "fortnite-retro-drop",
        name: "Fortnite Retro Drop",
        thumbnailUrl: placeholderPreview("neonRetro"),
        categories: {
            games: ["fortnite"],
            colors: ["pink", "orange"],
            styles: ["8-bit"],
            themes: [],
        },
        promptPreset: {
            basePrompt: "Retro Fortnite-inspired Twitch banner",
            styleDescriptors: "pixel-art influenced look, arcade retro energy, bright pink and orange palette, playful competitive vibe",
            compositionHints: "wide horizontal composition, readable central title zone, energetic background layers, nostalgic streamer branding",
        },
        credits: 3,
    },
    {
        id: "minecraft-pixel-realms",
        name: "Minecraft Pixel Realms",
        thumbnailUrl: placeholderPreview("minimalSnowfall"),
        categories: {
            games: ["minecraft"],
            colors: ["green", "blue"],
            styles: ["8-bit"],
            themes: ["fantasy"],
        },
        promptPreset: {
            basePrompt: "Minecraft-themed Twitch banner",
            styleDescriptors: "blocky pixel-inspired design, lush green and sky-blue palette, crafted worldbuilding atmosphere, clean gaming presentation",
            compositionHints: "wide horizontal composition, open central horizon, layered block terrain depth, polished streamer channel branding",
        },
        credits: 3,
    },
    {
        id: "minecraft-cartoon-crafters",
        name: "Minecraft Cartoon Crafters",
        thumbnailUrl: placeholderPreview("pastelPlay"),
        categories: {
            games: ["minecraft"],
            colors: ["green", "purple"],
            styles: ["cartoon"],
            themes: ["fantasy"],
        },
        promptPreset: {
            basePrompt: "Cartoon Minecraft-inspired Twitch banner",
            styleDescriptors: "friendly stylized world, bright crafted textures, playful fantasy mood, colorful creator-first presentation",
            compositionHints: "wide horizontal composition, cheerful scene layering, prominent title area, streamer-ready channel art layout",
        },
        credits: 3,
    },
    {
        id: "apex-neon-squad",
        name: "Apex Neon Squad",
        thumbnailUrl: placeholderPreview("futuristicNeon"),
        categories: {
            games: ["apex-legends"],
            colors: ["purple", "pink"],
            styles: ["emblem"],
            themes: ["space"],
        },
        promptPreset: {
            basePrompt: "Apex Legends-inspired Twitch banner",
            styleDescriptors: "futuristic neon styling, high-speed hero shooter energy, vivid magenta and violet accents, premium esports finish",
            compositionHints: "wide horizontal composition, tactical depth, cinematic competitive mood, bold streamer identity framing",
        },
        credits: 3,
    },
    {
        id: "apex-minimal-strike",
        name: "Apex Minimal Strike",
        thumbnailUrl: placeholderPreview("blueTechGlitch"),
        categories: {
            games: ["apex-legends"],
            colors: ["black", "blue"],
            styles: ["monogram"],
            themes: ["space"],
        },
        promptPreset: {
            basePrompt: "Minimal Apex Legends-inspired Twitch banner",
            styleDescriptors: "clean futuristic surfaces, restrained blue highlights, sleek competitive atmosphere, modern premium streamer look",
            compositionHints: "wide horizontal composition, uncluttered typography area, subtle high-tech depth, elegant broadcast-ready branding",
        },
        credits: 3,
    },
    {
        id: "call-of-duty-tactical-front",
        name: "Call of Duty Tactical Front",
        thumbnailUrl: placeholderPreview("futuristicStream"),
        categories: {
            games: ["call-of-duty"],
            colors: ["black", "green"],
            styles: ["emblem"],
            themes: [],
        },
        promptPreset: {
            basePrompt: "Call of Duty-inspired Twitch banner",
            styleDescriptors: "tactical military atmosphere, realistic grit, dark matte surfaces, muted green highlights, serious competitive tone",
            compositionHints: "wide horizontal composition, disciplined layout, modern streamer branding, strong title legibility over cinematic action backdrop",
        },
        credits: 3,
    },
    {
        id: "call-of-duty-night-ops",
        name: "Call of Duty Night Ops",
        thumbnailUrl: placeholderPreview("blueTechGlitch"),
        categories: {
            games: ["call-of-duty"],
            colors: ["black", "blue"],
            styles: ["monogram"],
            themes: [],
        },
        promptPreset: {
            basePrompt: "Night-ops Call of Duty-style Twitch banner",
            styleDescriptors: "stealth tactical mood, cool blue contrast, realistic shooter detail, premium military esports presentation",
            compositionHints: "wide horizontal composition, high-contrast title placement, cinematic battlefield depth, professional channel branding layout",
        },
        credits: 3,
    },
    {
        id: "counter-strike-urban-surge",
        name: "Counter-Strike Urban Surge",
        thumbnailUrl: placeholderPreview("futuristicStream"),
        categories: {
            games: ["counter-strike"],
            colors: ["black", "orange"],
            styles: ["emblem"],
            themes: [],
        },
        promptPreset: {
            basePrompt: "Counter-Strike-inspired Twitch banner",
            styleDescriptors: "urban tactical shooter tension, rugged details, subtle orange sparks, competitive esports precision",
            compositionHints: "wide horizontal composition, balanced open text space, tournament-ready branding, dynamic but controlled action framing",
        },
        credits: 3,
    },
    {
        id: "cyberpunk-neon-grid",
        name: "Cyberpunk Neon Grid",
        thumbnailUrl: placeholderPreview("cyberpunkNeon"),
        categories: {
            games: ["cyberpunk-2077"],
            colors: ["pink", "purple"],
            styles: ["monogram"],
            themes: ["space"],
        },
        promptPreset: {
            basePrompt: "Cyberpunk 2077-inspired Twitch banner",
            styleDescriptors: "glowing dystopian city aesthetic, holographic neon lighting, magenta and violet energy, futuristic outlaw vibe",
            compositionHints: "wide horizontal composition, sharp central hero space, high-end streamer branding, cinematic sci-fi atmosphere",
        },
        credits: 3,
    },
    {
        id: "free-fire-ember-storm",
        name: "Free Fire Ember Storm",
        thumbnailUrl: placeholderPreview("pinkStorm"),
        categories: {
            games: ["free-fire"],
            colors: ["orange", "green"],
            styles: ["emblem"],
            themes: [],
        },
        promptPreset: {
            basePrompt: "Free Fire-themed Twitch banner",
            styleDescriptors: "high-heat battle royale energy, glowing ember accents, tropical danger atmosphere, polished esports intensity",
            compositionHints: "wide horizontal composition, explosive background motion, clear title hierarchy, premium streamer banner layout",
        },
        credits: 3,
    },
    {
        id: "free-fire-cyber-alok",
        name: "Free Fire Cyber Alok",
        thumbnailUrl: placeholderPreview("futuristicNeon"),
        categories: {
            games: ["free-fire"],
            colors: ["blue", "purple"],
            styles: ["monogram"],
            themes: ["space"],
        },
        promptPreset: {
            basePrompt: "Futuristic Free Fire-inspired Twitch banner",
            styleDescriptors: "club-like neon energy, cyber concert atmosphere, glowing blue and violet lights, modern streamer esports polish",
            compositionHints: "wide horizontal composition, centered branding emphasis, dynamic layered light effects, strong readable headline space",
        },
        credits: 3,
    },
    // No exact Valorant game slug exists in gamerStylesData.ts, so this preset is
    // intentionally mapped through style/color taxonomy only.
    {
        id: "valorant-tactical-glow",
        name: "Valorant Tactical Glow",
        thumbnailUrl: placeholderPreview("futuristicStream"),
        categories: {
            games: [],
            colors: ["black", "purple"],
            styles: ["emblem"],
            themes: [],
        },
        promptPreset: {
            basePrompt: "Valorant-inspired Twitch banner",
            styleDescriptors: "precise tactical hero shooter atmosphere, sleek modern geometry, sharp competitive contrast, premium esports styling",
            compositionHints: "wide horizontal composition, disciplined title zone, strategic visual balance, polished professional streamer branding",
        },
        credits: 3,
    },
    // No exact League of Legends game slug exists in gamerStylesData.ts, so the
    // taxonomy leans on the closest fantasy/emblem slugs instead.
    {
        id: "league-arcane-clash",
        name: "League Arcane Clash",
        thumbnailUrl: placeholderPreview("futuristicNeon"),
        categories: {
            games: [],
            colors: ["blue", "purple"],
            styles: ["emblem"],
            themes: ["fantasy"],
        },
        promptPreset: {
            basePrompt: "League of Legends-inspired Twitch banner",
            styleDescriptors: "arcane fantasy battleground energy, luminous magical accents, elevated esports grandeur, heroic teamfight atmosphere",
            compositionHints: "wide horizontal composition, epic central branding zone, layered mystical depth, streamer-ready competitive showcase",
        },
        credits: 3,
    },
    // No exact GTA game slug exists in gamerStylesData.ts, so this preset keeps the
    // theme generic in taxonomy while the prompt carries the franchise vibe.
    {
        id: "gta-neon-heist",
        name: "GTA Neon Heist",
        thumbnailUrl: placeholderPreview("neonRetro"),
        categories: {
            games: [],
            colors: ["pink", "purple"],
            styles: ["monogram"],
            themes: [],
        },
        promptPreset: {
            basePrompt: "Grand Theft Auto-inspired Twitch banner",
            styleDescriptors: "stylized urban heist energy, glossy nightlife color palette, cinematic crime-drama tone, premium modern streamer branding",
            compositionHints: "wide horizontal composition, bold central wordmark area, city-lit depth, polished broadcast banner framing",
        },
        credits: 3,
    },
    // No exact Roblox game slug exists in gamerStylesData.ts, so this preset is
    // categorized through the closest cartoon/color taxonomy only.
    {
        id: "roblox-cartoon-party",
        name: "Roblox Cartoon Party",
        thumbnailUrl: placeholderPreview("pastelPlay"),
        categories: {
            games: [],
            colors: ["blue", "pink"],
            styles: ["cartoon"],
            themes: [],
        },
        promptPreset: {
            basePrompt: "Roblox-inspired Twitch banner",
            styleDescriptors: "playful cartoon worldbuilding, bright creator-friendly energy, clean toy-like shapes, upbeat streamer personality",
            compositionHints: "wide horizontal composition, open readable headline zone, cheerful layered environment, polished family-friendly channel branding",
        },
        credits: 3,
    },
];
export const BANNER_TEMPLATES = TWITCH_BANNER_TEMPLATE_SEEDS.map((template) => (Object.assign(Object.assign({}, template), { platform: "twitch" })));
