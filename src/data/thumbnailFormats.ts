export interface ThumbnailFormat {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  promptTemplate: string;
}

export const THUMBNAIL_FORMATS = [
  {
    id: "epic-victory",
    name: "Epic Victory",
    description: "Wins, clutch moments and tournaments",
    previewImage: "/youtube/thumbnail/templates/epic-victory.webp",
    promptTemplate:
      "A triumphant {game} victory thumbnail. Confident hero character in a celebratory pose, dramatic golden lighting, explosive energetic background, large bold text '{text}' with a winning glow. High contrast, intense excitement.",
  },
  {
    id: "impossible-challenge",
    name: "Impossible Challenge",
    description: "High-stakes attempts against overwhelming odds",
    previewImage: "/youtube/thumbnail/templates/impossible-challenge.webp",
    promptTemplate:
      "A {game} challenge thumbnail with a determined character facing overwhelming odds. Tense dramatic mood, constraint-focused composition, bold text '{text}' that emphasizes difficulty, warning-colored accents.",
  },
  {
    id: "before-after",
    name: "Before & After",
    description: "Transformations, upgrades and dramatic changes",
    previewImage: "/youtube/thumbnail/templates/before-after.webp",
    promptTemplate:
      "A split before-and-after {game} thumbnail, left side showing the 'before' and right side the 'after' transformation, clear dividing line, bold text '{text}', contrasting dull-vs-vibrant color treatment.",
  },
  {
    id: "rank-progression",
    name: "Rank Progression",
    description: "Rank climbs, road-to-glory and improvement",
    previewImage: "/youtube/thumbnail/templates/rank-progression.webp",
    promptTemplate:
      "A {game} rank climb thumbnail showing progression from low to high rank, ascending arrow or ladder motif, rank badge imagery, bold text '{text}', gradient from dull bronze tones to bright prestigious gold/glow.",
  },
  {
    id: "secret-discovery",
    name: "Secret Discovery",
    description: "Hidden locations, easter eggs and discoveries",
    previewImage: "/youtube/thumbnail/templates/secret-discovery.webp",
    promptTemplate:
      "A mysterious {game} secret-reveal thumbnail, a hidden area or object glowing with intrigue, shadowy edges with a bright focal reveal, wide-eyed curious mood, bold text '{text}', spotlight effect.",
  },
  {
    id: "new-update",
    name: "New Update",
    description: "Updates, new seasons and fresh content",
    previewImage: "/youtube/thumbnail/templates/new-update.webp",
    promptTemplate:
      "A fresh {game} update thumbnail announcing new content, shiny 'NEW' energy, vibrant modern colors, showcase of new items/map, bold text '{text}', exciting launch-announcement feel.",
  },
  {
    id: "best-loadout",
    name: "Best Loadout",
    description: "Meta builds, weapons and winning setups",
    previewImage: "/youtube/thumbnail/templates/best-loadout.webp",
    promptTemplate:
      "A {game} loadout/setup thumbnail displaying weapons, gear or build items arranged cleanly, tactical HUD-style layout, bold text '{text}', authoritative 'meta' presentation, sharp product-showcase lighting.",
  },
  {
    id: "item-reveal",
    name: "Item Reveal",
    description: "Rare skins, weapons, loot and unlocks",
    previewImage: "/youtube/thumbnail/templates/item-reveal.webp",
    promptTemplate:
      "A {game} item reveal thumbnail spotlighting a rare skin/weapon/loot, dramatic spotlight on the item, sparkle and glow effects, bold text '{text}', premium showcase mood, dark background with bright item focus.",
  },
  {
    id: "boss-battle",
    name: "Boss Battle",
    description: "Massive enemies and cinematic confrontations",
    previewImage: "/youtube/thumbnail/templates/boss-battle.webp",
    promptTemplate:
      "An epic {game} boss battle thumbnail, a massive intimidating enemy facing a hero, dramatic confrontation composition, ominous lighting, bold text '{text}', high-stakes cinematic tension.",
  },
  {
    id: "reaction-face",
    name: "Reaction Face",
    description: "Expressive face-cam reactions and big moments",
    previewImage: "/youtube/thumbnail/templates/reaction-face.webp",
    promptTemplate:
      "A {game} reaction thumbnail with a large expressive creator face reacting to gameplay, gameplay scene behind, exaggerated emotion, bold text '{text}', classic YouTube face-cam layout with strong expression.",
  },
  {
    id: "rage-moment",
    name: "Rage Moment",
    description: "Tilt, frustration and comedic anger",
    previewImage: "/youtube/thumbnail/templates/rage-moment.webp",
    promptTemplate:
      "A frustrated {game} rage thumbnail, an angry/tilted expression, chaotic broken-controller energy, red frustration accents, bold text '{text}', comedic-anger mood, intense reaction composition.",
  },
  {
    id: "funny-fail",
    name: "Funny Fail",
    description: "Unexpected blunders and hilarious accidents",
    previewImage: "/youtube/thumbnail/templates/funny-fail.webp",
    promptTemplate:
      "A comedic {game} fail thumbnail, an unexpected accident or blunder mid-action, humorous exaggerated moment, playful bright colors, bold text '{text}', lighthearted comedy energy.",
  },
  {
    id: "vs-battle",
    name: "VS Battle",
    description: "Head-to-head players, items or strategies",
    previewImage: "/youtube/thumbnail/templates/vs-battle.webp",
    promptTemplate:
      "A {game} versus thumbnail, two subjects (players or items) facing off with a bold 'VS' in the center, split composition, competitive tension, bold text '{text}', dramatic head-to-head lighting.",
  },
  {
    id: "squad-lineup",
    name: "Squad Lineup",
    description: "Teams, crews and powerful group poses",
    previewImage: "/youtube/thumbnail/templates/squad-lineup.webp",
    promptTemplate:
      "A {game} squad thumbnail, a team of characters lined up together in a powerful group pose, unified team energy, dynamic ensemble composition, bold text '{text}', cohesive squad color scheme.",
  },
  {
    id: "highlight-circle",
    name: "Highlight Circle",
    description: "Draw attention to one crucial hidden detail",
    previewImage: "/youtube/thumbnail/templates/highlight-circle.webp",
    promptTemplate:
      "A {game} thumbnail with a small important subject circled with a bright attention-drawing ring, rest of scene slightly muted to emphasize the circled detail, bold text '{text}', spotlight-on-detail composition.",
  },
  {
    id: "big-arrow-reveal",
    name: "Big Arrow Reveal",
    description: "Point viewers toward a surprising discovery",
    previewImage: "/youtube/thumbnail/templates/big-arrow-reveal.webp",
    promptTemplate:
      "A {game} thumbnail with a large bold arrow pointing at a key object, enemy or location, high-visibility arrow (red or yellow), attention-directing composition, bold text '{text}', discovery energy.",
  },
  {
    id: "stats-proof",
    name: "Stats Proof",
    description: "Records, scores and data-backed achievements",
    previewImage: "/youtube/thumbnail/templates/stats-proof.webp",
    promptTemplate:
      "A {game} stats/proof thumbnail displaying impressive numbers, scores or records prominently, data-showcase layout with big figures, bold text '{text}', credible achievement presentation, clean high-contrast.",
  },
  {
    id: "cinematic-story",
    name: "Cinematic Story",
    description: "Atmospheric stories with movie-poster drama",
    previewImage: "/youtube/thumbnail/templates/cinematic-story.webp",
    promptTemplate:
      "A cinematic {game} thumbnail with dramatic film-like composition, moody atmospheric lighting, story-driven emotional tone, letterbox cinematic feel, bold text '{text}', movie-poster quality.",
  },
  {
    id: "tier-list",
    name: "Tier List",
    description: "Rank characters, items and strategies by tier",
    previewImage: "/youtube/thumbnail/templates/tier-list.webp",
    promptTemplate:
      "A {game} tier list thumbnail with an S/A/B/C ranking layout, tier rows with items placed by rank, clean grid structure, bold text '{text}', authoritative ranking presentation, colorful tier bands.",
  },
  {
    id: "stream-highlights",
    name: "Stream Highlights",
    description: "Best live moments and highlight reels",
    previewImage: "/youtube/thumbnail/templates/stream-highlights.webp",
    promptTemplate:
      "A {game} stream highlights thumbnail capturing the best live moments, energetic broadcast feel, webcam-and-gameplay layout, live-streaming energy, bold text '{text}', highlight-reel excitement.",
  },
  {
    id: "money-number-hook",
    name: "Money / Number Hook",
    description: "Lead with a huge number, prize or milestone",
    previewImage: "/youtube/thumbnail/templates/money-number-hook.webp",
    promptTemplate:
      "A {game} thumbnail dominated by a giant bold number or money figure (like a huge dollar amount or day count), massive eye-catching typography as the focal point, bold text '{text}', high-stakes MrBeast-style number hook, explosive background.",
  },
  {
    id: "challenge-countdown",
    name: "Challenge Countdown",
    description: "Timed challenges, endurance and urgent stakes",
    previewImage: "/youtube/thumbnail/templates/challenge-countdown.webp",
    promptTemplate:
      "A {game} endurance/timer challenge thumbnail, a prominent countdown or time element (like '24 HOURS'), tense urgency, clock/timer motif, bold text '{text}', survival-challenge intensity.",
  },
  {
    id: "question-hook",
    name: "Question Hook",
    description: "Create curiosity with an irresistible question",
    previewImage: "/youtube/thumbnail/templates/question-hook.webp",
    promptTemplate:
      "A {game} curiosity thumbnail posing an intriguing question, a puzzled or intrigued expression, question-mark energy, mysterious inviting mood, bold text '{text}', curiosity-gap composition that makes viewers want the answer.",
  },
  {
    id: "warning-broken",
    name: "Warning / Broken",
    description: "Urgent warnings, bans and broken mechanics",
    previewImage: "/youtube/thumbnail/templates/warning-broken.webp",
    promptTemplate:
      "A {game} warning/danger thumbnail with urgent alarming energy, red warning accents, 'broken' or 'banned' shock factor, caution-tape or alert motifs, bold text '{text}', high-urgency don't-miss-this mood.",
  },
  {
    id: "top-10-grid",
    name: "Top 10 Grid",
    description: "Numbered rankings and listicle countdowns",
    previewImage: "/youtube/thumbnail/templates/top-10-grid.webp",
    promptTemplate:
      "A {game} top-10 thumbnail with a numbered ranking grid or countdown layout, multiple items arranged with rank numbers, organized showcase composition, bold text '{text}', listicle-style clear structure.",
  },
] as const satisfies readonly ThumbnailFormat[];

export type ThumbnailFormatId = (typeof THUMBNAIL_FORMATS)[number]["id"];

export function getThumbnailFormat(
  formatId: string,
): ThumbnailFormat | undefined {
  return THUMBNAIL_FORMATS.find((format) => format.id === formatId);
}
