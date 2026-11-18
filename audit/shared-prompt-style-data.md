# Shared layer audit: prompt and style data

## Style preset locations

- Gaming-logo styles live in [src/data/gamerStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/gamerStylesData.ts:3>).
- PFP styles live in [src/data/faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:2>).
- Emote base styles live in [src/data/emoteBaseStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emoteBaseStyles.ts:14>).
- Emote reaction/expression definitions live in [src/data/emotes.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emotes.ts:20>).
- Twitch banner templates live in [src/data/twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:50>).
- Twitch panel templates live in [src/data/twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:43>).
- Twitch stream-screen templates live in [src/data/twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:60>).

## Shared vs per-tool

- Gaming-logo and PFP have separate style datasets; they are not shared even when they cover similar themes like cartoon/anime/vector in [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:8>) and [gamerStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/gamerStylesData.ts:1047>).
- Emote base styles partially overlap with PFP styles but are maintained in a separate file, again duplicating cartoon/anime/chibi/pixel/vector concepts in [emoteBaseStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emoteBaseStyles.ts:17>) and [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:8>).
- Banner/panel/screen styles are fully separate per tool and fully Twitch-branded in [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:51>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:44>), and [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:62>).

## pSEO / theme / cultural data

- Gaming-logo pSEO pages are driven from `gamerStylesData` categories in [pSEO.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/lib/pSEO.ts:26>) through [pSEO.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/lib/pSEO.ts:32>).
- PFP pSEO pages are driven from `faceStylesData` categories in [pSEO.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/lib/pSEO.ts:34>) through [pSEO.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/lib/pSEO.ts:37>).
- `pSEO.ts` also hardcodes different slug/category semantics per tool and swaps logo preview images from `.webp` to `e.webp` for logo examples in [pSEO.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/lib/pSEO.ts:40>).
- The gaming-logo data already contains theme/color/holiday/cultural categories in [gamerStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/gamerStylesData.ts:1323>), [gamerStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/gamerStylesData.ts:1708>), [gamerStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/gamerStylesData.ts:2113>), and [gamerStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/gamerStylesData.ts:2518>).
- The PFP data already contains game/theme/seasonal-cultural groupings in [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:69>), [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:114>), and [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:147>).

## Biggest prompt/style-data observations

- There is no unified "style vocabulary" shared across logo, PFP, and emote flows, even where the same concepts are repeated.
- The Twitch graphic tools do not use prompt vocabularies at all for their main generation path; they use hand-authored layout configs instead.
- The emote style data is the most platform-coupled because even its preview asset paths are Twitch-prefixed in [emoteBaseStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emoteBaseStyles.ts:17>).
