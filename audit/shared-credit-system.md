# Shared layer audit: credit system

## Locations

- Credits live on `User.gamingCredits` in [prisma/schema.prisma](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/prisma/schema.prisma:62>).
- There is no single credit-configuration file for these six tools. Charges are hardcoded per route or embedded in style configs:
  - Gaming logos: [generate.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/generate.ts:121>).
  - PFP: [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:154>).
  - Twitch banner: [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:63>) plus style data in [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:53>).
  - Twitch panel: [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:72>) plus style data in [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:46>).
  - Twitch stream screen: [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:66>) plus style data in [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:64>).
  - Emotes: [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:147>) and [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:273>).
  - AI enhancement: [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:141>).

## Exact charges today

- `/gaming-logo-maker`
  - `flux-schnell`: 1 credit per image in [generate.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/generate.ts:122>).
  - `flux-dev`: 2 credits per image in [generate.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/generate.ts:123>).
- `/pfp-maker`
  - `flux-kontext-pro`: 4 credits in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:155>).
  - `flux-kontext-max`: 6 credits in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:156>).
- `/twitch-banner-generator`
  - All current styles are 1 credit each in [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:53>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:115>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:177>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:238>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:301>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:355>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:409>), and [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:464>).
- `/twitch-panels-generator`
  - All current styles are 1 credit each in [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:46>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:84>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:123>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:162>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:201>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:240>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:279>), and [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:318>).
- `/twitch-stream-screens-generator`
  - All current styles are 1 credit each in [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:64>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:111>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:158>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:205>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:252>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:300>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:348>), and [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:396>).
- `/emote-generator`
  - Base image: 3 credits in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:147>).
  - Each generated emote: 3 credits in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:273>).
- Optional AI enhancement for banner/panel/screen:
  - 3 credits in [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:141>).

## Charge timing

- All audited generators charge credits before generation:
  - Gaming logos: [generate.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/generate.ts:138>).
  - PFP: [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:165>).
  - Banner: [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:64>).
  - Panel: [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:73>).
  - Stream screen: [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:65>).
  - Emote base: [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:160>).
  - Emote pack: [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:287>).
  - Enhancement: [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:143>).

## Refund behavior

- No refund logic was found in any audited route after downstream Replicate/render/S3 failures. Each route decrements credits and then throws on later failure without compensating DB updates, as seen in [generate.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/generate.ts:180>), [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:185>), [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:205>), [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:157>), [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:139>), [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:197>), and [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:187>).

## Verdict

- Current credit accounting is easy to read per route but hard to evolve safely across platforms because there is no shared cost table, no transaction wrapper around "charge + generate + upload", and no refund path on downstream failure.
