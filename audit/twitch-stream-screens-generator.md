# `/twitch-stream-screens-generator` audit

## A. File locations

- Page component: [src/pages/twitch-stream-screens-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-stream-screens-generator.tsx:1>).
- Main API route: `api.twitchStreamScreen.generate` from [twitch-stream-screens-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-stream-screens-generator.tsx:61>), implemented in [src/server/api/routers/twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:45>) and registered at [src/server/api/root.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/root.ts:32>).
- Optional enhancement route: [src/server/api/routers/enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:133>) used from [twitch-stream-screens-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-stream-screens-generator.tsx:80>).
- Helper and data files:
  - Screen style config: [src/data/twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:60>).

## B. Platform assumptions

- Output dimensions are defined in style config as `canvasWidth: 1920` and `canvasHeight: 1080` across all current styles in [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:76>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:123>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:170>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:217>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:264>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:312>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:360>), and [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:408>).
- Those dimensions are pulled from config in [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:62>).
- The word "Twitch" does not appear in a main generation prompt because the main route does not call Replicate.
- The word "Twitch" appears throughout the UI and metadata in [twitch-stream-screens-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-stream-screens-generator.tsx:166>), [twitch-stream-screens-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-stream-screens-generator.tsx:186>), and [twitch-stream-screens-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-stream-screens-generator.tsx:211>).
- The word "Twitch" appears in stored metadata via `StreamScreen:${styleId}:${title}` only indirectly; the prefix is generic `StreamScreen` in [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:157>), but the route and page names are Twitch-specific.
- Post-processing assumes 16:9 full-HD stream-screen output. Backgrounds are forced to `W/H` in [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:85>), and Puppeteer renders the same `W/H` in [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:149>).
- Platform-specific assets are baked in under `/twitch/screens/...` in [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:62>).

## C. Inputs the tool currently accepts

- Form fields:
  - `styleId` from style selection in [twitch-stream-screens-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-stream-screens-generator.tsx:30>).
  - `title` required in [twitch-stream-screens-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-stream-screens-generator.tsx:34>) and validated in [twitch-stream-screens-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-stream-screens-generator.tsx:111>).
  - `subtitle` optional in [twitch-stream-screens-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-stream-screens-generator.tsx:35>) and length-limited client-side in [twitch-stream-screens-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-stream-screens-generator.tsx:121>).
- File uploads: none.
- Style/preset selectors:
  - Templates: `Blue Tech Glitch`, `Cyberpunk Neon Frame`, `Futuristic Neon`, `Futuristic Stream`, `Minimal Snowfall`, `Neon Retro`, `Pastel Play`, `Pink Storm` from [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:60>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:107>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:154>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:201>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:248>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:296>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:344>), and [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:392>).
  - Quick text presets: `Starting Soon`, `Be Right Back`, `Offline`, and `Ending` are UI-only convenience buttons in [twitch-stream-screens-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-stream-screens-generator.tsx:227>), [twitch-stream-screens-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-stream-screens-generator.tsx:237>), [twitch-stream-screens-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-stream-screens-generator.tsx:247>), and [twitch-stream-screens-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-stream-screens-generator.tsx:257>).
  - Optional enhancement preset is always `Polished Text` in [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:70>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:117>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:164>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:211>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:258>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:306>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:354>), and [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:402>).
- Text overlay inputs: `title` and optional `subtitle` are rendered into SVG text in [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:111>) and [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:125>).

## D. Generation pipeline

- Main model: none. The route is a deterministic renderer in [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:74>) and [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:139>).
- Optional enhancement model: `google/nano-banana-pro` through the shared enhancement route in [twitch-stream-screens-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-stream-screens-generator.tsx:436>) and [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:48>).
- Real prompt example:
  - Main route: none.
  - Enhancement route takes the style's `Polished Text` prompt from [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:70>).
- Aspect ratio / dimension parameter:
  - Main route uses exact `1920x1080` config via `W/H` in [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:62>).
  - Enhancement route uses `aspect_ratio: "match_input_image"` in [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:67>).
- Post-processing:
  - Background resize in [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:85>).
  - SVG text render in [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:106>).
  - Screenshot to PNG in [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:151>).
- Credits are charged before generation in [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:65>).
- Credit refund on failure: none found after credit decrement ([twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:65>)).

## E. Output

- Final dimensions: `1920x1080` in config and UI result sizing at [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:76>) and [twitch-stream-screens-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-stream-screens-generator.tsx:368>).
- File format: PNG in [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:166>).
- Storage: final output stored under flat `icon.id` in [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:155>) and [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:164>).
- URL returned to the user:
  - `https://${BUCKET}.s3.${env.NEXT_PUBLIC_AWS_REGION_GAMING}.amazonaws.com/${icon.id}` in [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:170>).

## F. Cross-tool sharing

- Shared code used:
  - Shared enhancement route: [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:133>).
  - Shared `Icon` model: [schema.prisma](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/prisma/schema.prisma:71>).
- Duplicated logic that should be shared:
  - Same render pipeline family as banners and panels in [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:74>), [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:81>), and [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:103>).

## G. Platform-extension readiness verdict

- Can I add a new platform by just adding a new dimension preset, without touching the prompt? No - this is not prompt-driven, but it is still Twitch-specific template/render code with no platform layer ([twitch-stream-screens-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-stream-screens-generator.tsx:211>), [twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:62>)).
- Does the prompt need to change per platform? No in the main flow. Enhancement prompts may need platform-aware wording if kept.
- Does the UI need a platform selector, or is platform inferred from the URL? Platform is currently inferred from the URL and copy. A selector would only make sense after styles and product semantics are generalized ([twitch-stream-screens-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-stream-screens-generator.tsx:166>)).
- Are there platform-specific visual conventions the AI does not know about that need injection? Yes - YouTube Live screens may want different text hierarchies or safe zones, and none of that is modeled today ([twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:103>)).

## H. Known issues

- Every current style is tagged `screenType: "starting"`, so the data model cannot actually distinguish starting/BRB/offline/ending; the page only changes the text preset ([twitchStreamScreenStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchStreamScreenStyles.ts:61>), [twitch-stream-screens-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-stream-screens-generator.tsx:227>)).
- Server-side title/subtitle max-length validation is missing; the client enforces the limits but the route accepts plain strings ([twitch-stream-screens-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-stream-screens-generator.tsx:55>), [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:48>)).
- The render section does not use a `try/finally`, so a Puppeteer failure before `browser.close()` can leak the browser instance ([twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:139>), [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:152>)).
- No refund path exists if rendering or upload fails after credits are decremented ([twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:65>), [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:162>)).
