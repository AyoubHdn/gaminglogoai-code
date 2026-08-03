import { type ReactNode } from "react";

export interface PseoFaq {
  question: string;
  answer: string;
}

export interface PseoArticleSection {
  heading: string;       // becomes an H2
  body: string;          // plain paragraphs; support \n\n as paragraph breaks
}

export interface PseoRelatedLink {
  href: string;
  anchor: string;
}

export interface PseoContent {
  metaTitle?: string;
  metaDescription?: string;
  heroIntro?: string;
  ctaText?: string;
  articleSections?: PseoArticleSection[];
  faqs?: PseoFaq[];
  relatedLinks?: PseoRelatedLink[];
  suppressFaqSchema?: boolean;
}

// Keyed by slug exactly as it appears in the URL.
// Logo game slugs and PFP game slugs both live here as separate keys.
// Absent slug = template uses its existing generic fallback. This is intentional.
export const pseoContent: Record<string, PseoContent> = {
  "minecraft-logo-maker": {
    heroIntro: "Create your Minecraft logo in seconds — no design experience needed. Choose from Creeper mascots, diamond-sword warriors, Enderman emblems, grass-block badges, and pixel-art designs, then add your name in blocky Minecraft-style text. Start free with a credit on signup and download a high-resolution PNG ready for your Discord server, YouTube channel, Twitch stream, or SMP team.",
    ctaText: "Create My Minecraft Logo",
    articleSections: [
      {
        heading: "How to Make a Minecraft Logo in 4 Steps",
        body: "Making a Minecraft logo with AI takes under a minute and needs zero design skills.\n\n1. Pick a Minecraft style — choose from Creeper mascots, diamond-sword warriors, Enderman designs, wolf and villager mascots, grass-block emblems, crossed pickaxes, and more.\n\n2. Add your name or team text — type your gamer tag, clan name, or SMP server name. It renders in blocky, pixel-style Minecraft typography.\n\n3. Generate — the AI creates your logo in seconds. Use the standard generation for a quick result, or the higher-quality option for sharper detail and cleaner text.\n\n4. Download — save your logo as a high-resolution PNG, ready to upload anywhere.",
      },
      {
        heading: "Popular Minecraft Logo Styles",
        body: "Every Minecraft player has a different vibe, so the generator offers a range of styles built around the game's iconic look.\n\nCreeper mascots are the most recognizable — glowing green pixel energy and that unmistakable face, perfect for a bold, instantly-Minecraft identity. Diamond-sword warriors feature a blocky armored hero gripping a glowing blade, great for combat-focused channels and PvP clans. Enderman designs use glowing purple eyes and floating blocks for a darker, mysterious feel.\n\nFor team and server branding, the grass-block emblem turns the classic dirt-grass-stone block into a shield shape, and the badge style frames your team name with pixel clouds, sun, and grass for a clean crest. Crossed-pickaxe and sword-in-block logos lean into the mining and crafting side of the game, while wolf and villager mascots give a friendlier, character-driven option. There's also a cave style with glowing ores in the background for a deeper, atmospheric look.",
      },
      {
        heading: "Where to Use Your Minecraft Logo",
        body: "A Minecraft logo works across every platform where you build your gaming presence.\n\nUse it as your Discord server icon to give your community a professional identity, as your YouTube channel logo and video branding for Minecraft Let's Plays and tutorials, or as your Twitch profile picture and stream overlay. SMP and faction servers use these logos for team identity, recruitment posts, and server listings. The high-resolution PNG works equally well as a small avatar or a larger banner element.",
      },
      {
        heading: "Tips for a Great Minecraft Logo",
        body: "A few small choices make a Minecraft logo read clearly and look sharp.\n\nKeep your text short — gamer tags and clan names of one or two words stay readable in blocky pixel fonts, while long names get cramped. Lean into Minecraft's natural palette: the greens of grass and Creepers, the browns of dirt and wood, and the cyan glow of diamond all signal the game instantly. If you'll use the logo as a small Discord or profile icon, pick a mascot style (Creeper, wolf, warrior) over a detailed scene, since bold shapes survive shrinking better than fine detail. Try the higher-quality generation option when text clarity matters most — it renders pixel fonts more cleanly than the standard pass.",
      },
    ],
    faqs: [
      {
        question: "Is the Minecraft logo maker free?",
        answer: "You can start free — new accounts get a free credit on signup, enough to generate a Minecraft logo right away. After that, credit packs are available with no subscription, and credits never expire.",
      },
      {
        question: "How do I make a Minecraft logo?",
        answer: "Pick a Minecraft style (Creeper, diamond sword, Enderman, grass block, and more), type your name or team text, and generate. The AI creates your logo in seconds and you can download it as a high-resolution PNG.",
      },
      {
        question: "What file format is my Minecraft logo?",
        answer: "Your logo downloads as a high-resolution PNG, ready to upload to Discord, YouTube, Twitch, or any server listing. (Transparent backgrounds are available on our emote maker for chat emotes.)",
      },
      {
        question: "Can I use this as a Minecraft server logo or Discord icon?",
        answer: "Yes. The logos work as Discord server icons, SMP and faction team logos, YouTube channel art, and Twitch branding. Mascot styles like the Creeper or warrior work especially well as small profile icons.",
      },
      {
        question: "Do I need design experience?",
        answer: "No. You don't need Photoshop or any design skills — just pick a style, type your text, and the AI handles the rest in seconds.",
      },
      {
        question: "Can I get a matching Minecraft PFP?",
        answer: "Yes. Alongside your logo, you can create a matching Minecraft-style profile picture from your photo using our Minecraft PFP maker for a consistent look across your channels.",
      },
    ],
    relatedLinks: [
      { href: "/blog/top-10-minecraft-logo-ideas", anchor: "Top 10 Minecraft Logo Ideas" },
      { href: "/pfp/games/minecraft-pfp-maker", anchor: "Minecraft PFP Maker" },
      { href: "/buy-credits", anchor: "View credit packs" },
    ],
  },
  "roblox-logo-maker": {
    metaTitle: "Roblox Logo Maker – Create Your Roblox Gaming Logo with AI",
    suppressFaqSchema: true,
    heroIntro: "Design a bold Roblox logo in seconds with our AI Roblox logo maker. Whether you're branding your Roblox game, YouTube channel, group, or gaming profile, our tool turns your ideas into professional Roblox-style logos — blocky avatars, glossy 3D mascots, esports emblems, and more. Just pick a style, add your name, and generate.",
    articleSections: [
      {
        heading: "Make a Roblox Logo That Stands Out",
        body: "Roblox creators, group owners, and streamers need a logo that captures the game's iconic blocky, colorful energy. Our AI Roblox logo maker gives you that instantly — from classic Roblox avatar mascots to fierce esports emblems, each rendered in the glossy plastic 3D style Roblox players recognize. Add your channel or group name and get a polished logo ready for your Roblox profile, YouTube thumbnails, Discord, or team branding.",
      },
      {
        heading: "Roblox Logo Styles for Every Creator",
        body: "Choose from a range of Roblox-inspired styles: blocky avatar hero mascots, the classic Roblox noob character, sword-wielding warrior avatars, cute Adopt Me-style pets, aggressive esports team emblems, Blox Fruits adventure themes, and more. Each style is built to match a different Roblox vibe — whether you run a tycoon game, a PvP group, a roleplay server, or a Roblox YouTube channel, there's a logo style that fits.",
      },
      {
        heading: "How to Create Your Roblox Logo",
        body: "Making your Roblox logo takes three quick steps. First, browse the Roblox logo styles and pick the one that matches your vibe. Second, enter your game, group, or channel name. Third, hit generate — our AI creates your logo in the Roblox 3D style, ready to download and use. No design skills needed, and you can regenerate until it's perfect.",
      },
      {
        heading: "Where to Use Your Roblox Logo",
        body: "Your Roblox logo works everywhere your brand appears: as your Roblox group icon, on YouTube video thumbnails and channel art, on your Twitch or Discord, on team jerseys and merch, and across social media. A strong, consistent Roblox logo helps your game or channel look professional and get recognized by the Roblox community.",
      },
    ],
    faqs: [
      {
        question: "How do I make a Roblox logo?",
        answer: "Pick a Roblox logo style from our AI maker, enter your game or channel name, and generate. Your logo is created in seconds in the blocky Roblox 3D style, ready to download.",
      },
      {
        question: "Is the Roblox logo maker free?",
        answer: "You can start creating for free — generate and preview your Roblox logo, with credits for high-resolution downloads.",
      },
      {
        question: "What Roblox logo styles are available?",
        answer: "Choose from blocky avatar mascots, the classic noob character, warrior avatars, cute pet styles, esports emblems, Blox Fruits themes, and more Roblox-inspired designs.",
      },
      {
        question: "Can I use my Roblox logo for my group or YouTube channel?",
        answer: "Yes — your logo is perfect for Roblox group icons, YouTube channel art and thumbnails, Discord, streaming, and team branding.",
      },
    ],
    relatedLinks: [
      { href: "/pfp/games/roblox-pfp-maker", anchor: "Roblox PFP Maker" },
      { href: "/buy-credits", anchor: "View credit packs" },
    ],
  },
  "roblox-pfp-maker": {
    metaTitle: "Roblox PFP Maker – Turn Your Photo into a Roblox Avatar with AI",
    suppressFaqSchema: true,
    heroIntro: "Turn your photo into a Roblox-style avatar with our AI Roblox PFP maker. Upload a picture and watch our AI transform you into a blocky Roblox character — glossy plastic style, cubic proportions, and vibrant colors — perfect for your Roblox profile, Discord, YouTube, or gaming socials.",
    articleSections: [
      {
        heading: "Become a Roblox Character",
        body: "Ever wanted a profile picture that turns you into a Roblox avatar? Our AI Roblox PFP maker does exactly that. Upload your photo and our AI transforms your face and features into the iconic blocky Roblox style — cubic head, glossy plastic texture, and colorful Roblox-style outfit — while keeping you recognizable. It's the perfect avatar for Roblox players who want their profile to match the game they love.",
      },
      {
        heading: "Roblox Avatar Styles",
        body: "Choose how your Roblox PFP looks — from a classic blocky Roblox avatar to a full-body Roblox character with signature plastic textures and vibrant gaming outfits. Pick your framing (head, half body, or full body) and let the AI render you as a true Roblox character, complete with a matching Roblox-world background.",
      },
      {
        heading: "How to Make Your Roblox PFP",
        body: "Creating your Roblox avatar is simple. Choose the Roblox style, upload a clear photo of yourself, pick your framing, and generate. The AI transforms you into a blocky Roblox character in seconds, ready to download and set as your profile picture on Roblox, Discord, YouTube, or anywhere else.",
      },
      {
        heading: "Where to Use Your Roblox PFP",
        body: "Your Roblox avatar PFP is perfect for your Roblox profile, Discord server, YouTube channel, Twitch, and gaming socials. A custom Roblox-style avatar helps you stand out and shows the community you're a real Roblox creator.",
      },
    ],
    faqs: [
      {
        question: "How do I make a Roblox PFP?",
        answer: "Choose the Roblox style in our AI PFP maker, upload your photo, pick your framing, and generate. Your photo becomes a blocky Roblox avatar in seconds.",
      },
      {
        question: "Will my Roblox PFP look like me?",
        answer: "Yes — the AI keeps your recognizable features and likeness while rendering you in the blocky Roblox character style.",
      },
      {
        question: "Can I make a full-body Roblox avatar?",
        answer: "Yes — choose full-body framing to get a complete standing Roblox character, or head/half-body for a closer avatar.",
      },
      {
        question: "Is the Roblox PFP maker free?",
        answer: "You can create and preview your Roblox avatar for free, with credits for high-resolution downloads.",
      },
    ],
    relatedLinks: [
      { href: "/logo/games/roblox-logo-maker", anchor: "Roblox Logo Maker" },
      { href: "/buy-credits", anchor: "View credit packs" },
    ],
  },
};

export function getPseoContent(slug: string): PseoContent | undefined {
  return pseoContent[slug];
}
