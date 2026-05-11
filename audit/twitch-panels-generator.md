# `/twitch-panels-generator` audit

## A. File locations

- Page component: [src/pages/twitch-panels-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-panels-generator.tsx:24>).
- Main API route: `api.twitchPanel.generate` from [twitch-panels-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-panels-generator.tsx:58>), implemented in [src/server/api/routers/twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:51>) and registered at [src/server/api/root.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/root.ts:31>).
- Optional enhancement route: [src/server/api/routers/enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:133>) used from [twitch-panels-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-panels-generator.tsx:74>).
- Helper and data files:
  - Panel style config: [src/data/twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:43>).

## B. Platform assumptions

- Output dimensions are defined in the style config as `canvasWidth: 640` and `canvasHeight: 200` for every current style in [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:60>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:98>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:137>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:176>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:215>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:254>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:293>), and [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:332>).
- Those values are pulled from config, not route literals, in [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:68>).
- The word "Twitch" does not appear in the main-generation prompt because there is no Replicate prompt in the main route.
- The word "Twitch" is all over the UI/metadata: title/meta/hero/share copy in [twitch-panels-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-panels-generator.tsx:170>), [twitch-panels-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-panels-generator.tsx:219>), and [twitch-panels-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-panels-generator.tsx:397>).
- The word "Twitch" appears in file naming and metadata:
  - Download filename `twitch-panel-*` in [twitch-panels-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-panels-generator.tsx:117>).
  - Stored `Icon.prompt` prefix `TwitchPanel:` in [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:183>).
- Post-processing assumes a fixed thin-panel aspect ratio. Backgrounds are resized with `fit: "cover"` in [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:103>), and SVG/Puppeteer are forced to `W/H` in [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:131>) and [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:168>).
- Platform-specific assets are baked in under `/twitch/panels/...` in [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:44>).

## C. Inputs the tool currently accepts

- Form fields:
  - `styleId` from panel style selection in [twitch-panels-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-panels-generator.tsx:32>).
  - `title` string, required in [twitch-panels-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-panels-generator.tsx:35>) and validated in [twitch-panels-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-panels-generator.tsx:144>).
- File uploads: none.
- Style/preset selectors:
  - Templates: `Blue Digital Flow`, `Cyberpunk Neon Frame`, `Futuristic Neon`, `Futuristic Stream`, `Minimal Snowfall`, `Neon Retro`, `Pastel Play`, `Pink Storm` from [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:43>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:81>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:120>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:159>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:198>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:237>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:276>), and [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:315>).
  - Optional AI enhancement preset is always `Polished Text` across styles in [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:53>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:91>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:130>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:169>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:208>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:247>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:286>), and [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:325>).
- Text overlay inputs: `title` is rendered into the SVG in [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:139>).

## D. Generation pipeline

- Main model: none. The main route is deterministic `sharp` + SVG + Puppeteer and does not call Replicate in [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:87>) and [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:157>).
- Optional enhancement model: `google/nano-banana-pro` via the shared enhancement route in [twitch-panels-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-panels-generator.tsx:380>) and [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:48>).
- Real prompt example:
  - Main route: none.
  - Enhancement route receives the style's `Polished Text` prompt from [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:53>).
- Aspect ratio / dimension parameter:
  - Main route uses exact `W/H` from style config in [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:68>).
  - Enhancement route uses `aspect_ratio: "match_input_image"` in [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:67>).
- Post-processing:
  - Background resize in [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:103>).
  - SVG text render in [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:129>).
  - Screenshot to PNG in [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:171>).
- Credits are charged before generation in [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:72>).
- Credit refund on failure: none found after credit deduction in [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:73>).

## E. Output

- Final dimensions: actual output is `640x200` in config and result preview at [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:60>) and [twitch-panels-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-panels-generator.tsx:310>).
- File format: PNG in [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:193>).
- Storage: final image is stored under flat `icon.id` in [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:181>) and [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:191>).
- URL returned to the user:
  - `https://${BUCKET}.s3.${env.NEXT_PUBLIC_AWS_REGION_GAMING}.amazonaws.com/${icon.id}` in [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:199>).

## F. Cross-tool sharing

- Shared code used:
  - Shared enhancement route: [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:133>).
  - Shared `Icon` persistence model: [schema.prisma](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/prisma/schema.prisma:71>).
- Duplicated logic that should be shared:
  - Nearly identical compositing/render pipeline with the banner and stream-screen routes in [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:87>), [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:81>), and [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:85>).

## G. Platform-extension readiness verdict

- Can I add a new platform by just adding a new dimension preset, without touching the prompt? No - there is no main prompt, but the whole product is a Twitch-specific panel concept and uses Twitch-only templates/assets ([twitch-panels-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-panels-generator.tsx:222>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:44>)).
- Does the prompt need to change per platform? No for the main generation path. Yes only if you keep optional AI enhancement.
- Does the UI need a platform selector, or is platform inferred from the URL? Right now platform is inferred from the URL and copy; a platform selector would only make sense after redefining what a non-Twitch "panel" is ([twitch-panels-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-panels-generator.tsx:175>)).
- Are there platform-specific visual conventions the AI does not know about that need injection? Yes - YouTube does not have a direct panel surface, so the missing convention is actually missing product definition.

## H. Known issues

- The page markets the output as "perfect 320x100 size", but the actual generated dimensions are `640x200`, which looks like an undocumented 2x export strategy ([twitch-panels-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-panels-generator.tsx:173>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:60>)).
- Server-side max-length validation is missing; the client enforces `maxChars`, but the server accepts any `title` string ([twitch-panels-generator.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/twitch-panels-generator.tsx:149>), [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:54>)).
- `Blue Digital Flow` and `Cyberpunk Neon Frame` point at the same preview/background assets, which may be an accidental duplicate template pair ([twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:44>), [twitchPanelStyles.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/twitchPanelStyles.ts:82>)).
- No refund path exists if render or upload fails after credits are charged ([twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:72>), [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:188>)).
