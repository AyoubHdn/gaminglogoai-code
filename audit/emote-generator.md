# `/emote-generator` audit

## A. File locations

- Page component: [src/pages/emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:32>).
- API route used by the page: `api.emoteBase.generateBaseImage` and `api.emoteBase.generateEmotes` from [emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:99>) and [emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:110>), implemented in [src/server/api/routers/emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:134>) and registered at [src/server/api/root.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/root.ts:33>).
- Helper and data files:
  - Base-style catalog: [src/data/emoteBaseStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emoteBaseStyles.ts:14>).
  - Emote-expression catalog: [src/data/emotes.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emotes.ts:20>).
  - Shared S3 path helper for example images: [src/utils/s3Paths.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/utils/s3Paths.ts:7>), imported in [emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:18>).
- Shared config the flow reads:
  - Replicate and S3 env vars: [env.mjs](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/env.mjs:24>), [env.mjs](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/env.mjs:49>), [env.mjs](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/env.mjs:50>).

## B. Platform assumptions

- Output dimension is defined only as square, not exact pixels. The route sends `aspect_ratio: "1:1"` for both base-image and per-emote generation in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:203>) and [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:321>).
- This is hardcoded, not config-driven.
- The word "Twitch" appears in the prompt sent to Replicate:
  - UI-side base prompt assembly says `Create a Twitch emote base image...` in [emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:176>).
  - Server-side canonical base prompt says `Create a Twitch emote.` in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:107>).
- The word "Twitch" appears in UI copy and assets:
  - SEO copy says "Twitch and Discord" in [emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:225>).
  - Example assets are loaded from `/twitch/emotes/...` in [emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:213>).
- The word "Twitch" appears in validation indirectly through the hardcoded `platform: "twitch"` mutation input in [emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:192>) and [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:142>).
- Post-processing assumes tiny emote use cases. The prompt explicitly says "Optimized for very small sizes (28px-112px)" in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:111>), and text overlays are required to be readable at `28px` in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:123>).
- Platform-specific assets and conventions are baked in:
  - Base-style previews live under `/twitch/emotes/styles/...` in [emoteBaseStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emoteBaseStyles.ts:17>).
  - Expression catalog includes a `Twitch culture` section in [emotes.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emotes.ts:40>).

## C. Inputs the tool currently accepts

- Form fields:
  - Uploaded base image file in [emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:39>).
  - Selected base style in [emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:48>).
  - Selected emote keys array in [emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:44>).
  - `useText` boolean and optional `textColor` in [emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:59>) and [emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:60>).
- File uploads:
  - Accepted MIME types: PNG/JPEG only in [emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:142>) and [emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:318>).
  - Client compression target: `maxSizeMB: 1` and `maxWidthOrHeight: 1024` in [emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:148>).
  - Base64 hard-stop is `5_000_000` characters in [emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:185>).
- Style/preset selectors:
  - Base-style category exposed today: `Art Style` in [emoteBaseStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emoteBaseStyles.ts:15>).
  - Active base-style options include `Cartoon`, `Toony`, `Disney`, `Anime`, `Shonen`, `Shojo`, `Chibi`, `Cute`, `Pixel Art`, `80s`, `Vector`, `Watercolor`, `Sketch`, `Glitch`, `Sticker`, `Wolf`, and `Dragon` from [emoteBaseStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emoteBaseStyles.ts:17>), [emoteBaseStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emoteBaseStyles.ts:22>), [emoteBaseStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emoteBaseStyles.ts:28>), [emoteBaseStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emoteBaseStyles.ts:33>), [emoteBaseStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emoteBaseStyles.ts:38>), [emoteBaseStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emoteBaseStyles.ts:48>), [emoteBaseStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emoteBaseStyles.ts:60>), and [emoteBaseStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emoteBaseStyles.ts:71>).
  - Emote-expression options include `GG`, `LOL`, `RIP`, `WOW`, `HYPE`, `WTF`, `POG`, `PROGGERS`, `THANKS`, `200IQ`, `CLIPTHAT`, `RAID`, `BAN`, `LIT`, plus many others from [emotes.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emotes.ts:22>), [emotes.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emotes.ts:36>), [emotes.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emotes.ts:41>), [emotes.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emotes.ts:60>), [emotes.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emotes.ts:69>), [emotes.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emotes.ts:72>), and [emotes.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emotes.ts:75>).
- Text overlay inputs:
  - There is no free-text entry for the overlay. The overlay text is automatically the selected emote label from [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:307>).
  - The page always sends `textPosition: "top-right"` in [emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:706>).
  - `textColor` is optional and chosen from fixed hex swatches in [emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:595>).

## D. Generation pipeline

- Replicate model called:
  - `openai/gpt-image-1.5` for base image in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:198>).
  - `openai/gpt-image-1.5` again for each derived emote in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:316>).
- Real prompt examples:
  - Base image UI prompt example combines `Create a Twitch emote base image from the provided image.` with the selected style base prompt in [emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:176>) and [emoteBaseStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emoteBaseStyles.ts:17>).
  - Server-side per-emote prompt starts with `Create a Twitch emote...`, adds `Same character and same art style as the base image.`, and adds an expression prompt from the selected emote in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:299>) and [emotes.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emotes.ts:22>).
  - Example derived-emote prompt: `Create a Twitch emote. Face only, centered, transparent background. Bold outlines... Same character and same art style as the base image. Expression: happy victory expression, confident smile.` based on [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:107>) and [emotes.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emotes.ts:22>).
- Aspect ratio / dimension parameter sent to Replicate:
  - `aspect_ratio: "1:1"` in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:203>) and [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:321>).
- Post-processing:
  - Input photo is normalized to max 1024 and converted to PNG in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:61>).
  - Both base and final generations request `background: "transparent"` in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:204>) and [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:322>).
- Credits are charged before base generation in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:160>) and before batch-emote generation in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:287>).
- Credit refund on failure: none found after either decrement ([emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:161>), [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:288>)).

## E. Output

- Final dimensions: square, but exact pixels are model-defined because only `1:1` is specified.
- File format: PNG with transparent background in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:205>) and [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:323>).
- Storage:
  - Normalized input image: `emotes/input/{userId}` in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:192>).
  - Generated base image: `emotes/base/{userId}` in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:232>).
  - Final per-emote output: `emotes/final/{userId}/{emoteKeyLower}` in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:347>).
- URL returned to the user:
  - Base-image return value is `baseImageUrl` from [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:257>).
  - Final-emote return values are `imageUrl` array items in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:358>).

## F. Cross-tool sharing

- Shared code used:
  - Shared S3 path builder for example assets: [s3Paths.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/utils/s3Paths.ts:7>).
  - Shared `Icon` model: [schema.prisma](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/prisma/schema.prisma:71>).
- Duplicated logic that should be shared:
  - Replicate client creation and error handling overlaps with other AI generators in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:53>) and [generate.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/generate.ts:25>).
  - Credit deduction + `Icon` creation + S3 upload pattern is again duplicated here in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:160>) and [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:287>).

## G. Platform-extension readiness verdict

- Can I add a new platform by just adding a new dimension preset, without touching the prompt? No - the route schema and prompts are explicitly Twitch-only ([emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:107>), [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:142>)).
- Does the prompt need to change per platform? Yes - Twitch vocabulary, tiny-size assumptions, and Twitch-culture emotes are baked into the prompt/data ([emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:111>), [emotes.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/emotes.ts:40>)).
- Does the UI need a platform selector, or is platform inferred from the URL? The UI would need a real platform selector or a full tool split, because the current route only accepts Twitch ([emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:192>), [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:142>)).
- Are there platform-specific visual conventions the AI does not know about that need injection? Yes - Discord sticker sizing, transparent margins, and non-Twitch reaction vocab are all absent.

## H. Known issues

- The page SEO claims "Twitch and Discord", but the backend schema literally only accepts `platform: "twitch"` ([emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:225>), [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:142>)).
- `textColor` is accepted as any string on the server, so there is no validation that it is a safe hex color even though the UI only offers swatches ([emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:595>), [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:269>)).
- `textPosition` is fixed to `top-right` in the UI even though the server supports `top-left` too ([emote-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/emote-generator.tsx:706>), [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:268>)).
- No refund path exists if base generation or one of the later per-emote generations fails after credits are already charged ([emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:160>), [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:287>)).
