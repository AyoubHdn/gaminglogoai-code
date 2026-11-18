# `/twitch-banner-generator` audit

## A. File locations

- Page component: [src/pages/twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:5>).
- Main API route: `api.twitchBanner.generate` from [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:86>), implemented in [src/server/api/routers/twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:42>) and registered at [src/server/api/root.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/root.ts:29>).
- Supporting API routes:
  - Upload helper `api.s3.createUploadUrl` from [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:85>), implemented in [src/server/api/routers/s3.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/s3.ts:23>).
  - Optional enhancement `api.enhancement.enhanceImage` from [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:75>), implemented in [src/server/api/routers/enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:133>).
- Helper and data files:
  - Banner template config: [src/data/twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:50>).
- Shared config the flow reads:
  - S3 env vars in [env.mjs](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/env.mjs:49>) and [env.mjs](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/env.mjs:50>).

## B. Platform assumptions

- Output dimensions are defined per style in `TWITCH_BANNER_STYLES`, with `canvasWidth: 1200` and `canvasHeight: 480` repeated across all styles in [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:75>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:137>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:198>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:259>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:321>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:375>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:429>), and [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:484>).
- Those are config-file values, not inline route literals, because the route reads `style.styleRules.canvasWidth/canvasHeight` in [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:59>).
- "Twitch" in the prompt sent to Replicate:
  - None in the main generation route, because the main pipeline is a deterministic compositor and never calls Replicate.
  - Present in optional enhancement prompts such as `Enhance this Twitch banner...` in [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:64>) and [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:126>).
- "Twitch" in UI copy is everywhere: title/meta/hero/canonical in [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:244>), [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:265>), and [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:290>).
- "Twitch" in validation messages: no literal "Twitch" string in validation; messages are generic in [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:169>).
- "Twitch" in filenames and metadata:
  - Browser download default is `twitch_banner` in [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:222>).
  - Stored `Icon.prompt` is `TwitchBanner:${styleId}:${channelName}` in [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:233>).
- Post-processing assumes a fixed banner aspect ratio. Backgrounds are resized to exact `W x H` with `fit: "cover"` in [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:83>), uploaded user photos are also resized to a fixed slot with `fit: "cover"` in [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:102>), and the browser screenshot viewport is forced to `W/H` in [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:218>).
- Platform-specific assets are baked in:
  - Preview and background assets live under `/twitch/banner/...` in [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:51>).
  - Hero image is `/twitch/twitch-banner-bg.webp` in [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:289>).
  - Uploads are stored under `user-uploads/twitch/...` in [s3.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/s3.ts:34>).

## C. Inputs the tool currently accepts

- Form fields:
  - `styleId` from template selection in [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:28>).
  - `channelName` required in [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:29>) and validated in [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:169>).
  - `tagline` optional in [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:30>).
- File uploads:
  - Optional photo upload in [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:405>).
  - Accepted MIME types: PNG/JPEG/WEBP in [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:152>) and [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:420>).
  - Max size is 10MB through the presigned-upload conditions in [s3.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/s3.ts:42>) and the UI text in [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:430>).
- Style/preset selectors:
  - Category toggle: `With Logo` vs `Without Logo` in [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:47>) and [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:313>).
  - Template options: `Cyberpunk Neon Frame`, `Futuristic Stream`, `Neon Retro`, `Futuristic Neon`, `Pastel Play`, `Blue Tech Glitch`, `Minimal Snowfall`, `Pink Storm` from [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:50>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:112>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:174>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:235>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:298>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:352>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:406>), and [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:461>).
  - Optional AI enhancement presets: `Cinematic Glow`, `Cyberpunk Style`, `Enhanced Red Tech Glow`, `Retro Neon Boost`, `Logo Focus Enhancement`, `Pastel Soft Polish`, `Cyber Depth Boost`, `Ultra Clean Clarity`, `Epic Energy Boost` from [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:62>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:68>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:124>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:186>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:247>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:309>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:363>), [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:417>), and [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:472>).
- Text overlay inputs: `channelName` and optional `tagline` are injected into SVG text layers in [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:171>) and [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:186>).

## D. Generation pipeline

- Main model: none. The main route does not call Replicate; it composes a PNG with `sharp` + SVG + Puppeteer in [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:83>) and [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:206>).
- Optional enhancement model:
  - Page always sends `model: "nano-banana-pro"` in [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:564>).
  - Model map resolves that to `google/nano-banana-pro` in [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:48>).
- Real prompt example:
  - Main route: no Replicate prompt.
  - Optional AI example: `Enhance this Twitch banner with cinematic neon lighting, high contrast, sharp typography...` from [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:64>).
- Aspect ratio / dimension parameter:
  - Main route uses exact pixel dimensions from style config via `W/H` in [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:59>).
  - Enhancement route uses `aspect_ratio: "match_input_image"` in [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:67>).
- Post-processing:
  - Background resize to exact canvas in [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:83>).
  - Optional user-photo placement into template window in [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:92>).
  - Final SVG render to PNG through Puppeteer in [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:161>) and [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:221>).
- Credits are charged before generation in [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:62>). Optional enhancement credits are charged before enhancement in [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:143>).
- Credit refund on failure: none found in either route after credit decrement ([twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:64>), [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:144>)).

## E. Output

- Final dimensions: `1200x480` per current styles in [twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:75>), also reflected in the result component size at [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:489>).
- File format: PNG in [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:243>).
- Storage:
  - Uploaded photo: `user-uploads/twitch/{userId}/{uuid}.{ext}` in [s3.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/s3.ts:34>).
  - Final banner: flat `icon.id` object key in [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:231>).
- URL returned to the user:
  - `https://${BUCKET}.s3.${env.NEXT_PUBLIC_AWS_REGION_GAMING}.amazonaws.com/${icon.id}` in [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:249>).

## F. Cross-tool sharing

- Shared code used:
  - Shared enhancement route: [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:133>).
  - Shared upload route: [s3.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/s3.ts:23>).
  - Same `Icon` model and S3/upload pattern used by other generators in [schema.prisma](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/prisma/schema.prisma:71>).
- Duplicated logic that should be shared:
  - The background load + resize + SVG text + Puppeteer render + S3 upload pattern is nearly identical to the panel and stream-screen routes in [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:70>), [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:87>), and [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:74>).

## G. Platform-extension readiness verdict

- Can I add a new platform by just adding a new dimension preset, without touching the prompt? No - you would need new template backgrounds, text placements, probably new upload naming, and new enhancement prompts ([twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:51>), [s3.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/s3.ts:34>)).
- Does the prompt need to change per platform? Yes for the enhancement flow, because the AI enhancement prompt literally says "Twitch banner" ([twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:64>)).
- Does the UI need a platform selector, or is platform inferred from the URL? The current page infers Twitch from the URL and hardcoded copy; a platform selector would only make sense after the style system becomes multi-platform ([twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:244>)).
- Are there platform-specific visual conventions the AI does not know about that need injection? Yes - YouTube banner safe areas and profile-overlay-safe layouts are not modeled; the tool only knows fixed `1200x480` Twitch-style templates ([twitchBannerStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchBannerStyles.ts:75>)).

## H. Known issues

- Server-side length validation is missing. The client enforces `channelLimit` and `taglineLimit` in [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:58>) and [twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:194>), but the server input schema only accepts bare strings in [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:45>).
- The upload field is named `logoUrl` even though the UI clearly describes it as a user photo, which makes the API contract misleading ([twitch-banner-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-banner-generator.tsx:405>), [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:49>)).
- Uploads for this tool are stored in a Twitch-only folder even though the same upload mechanism would be needed for future non-Twitch banners ([s3.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/s3.ts:34>)).
- No refund path exists if rendering or S3 upload fails after credits were already decremented ([twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:64>), [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:238>)).
