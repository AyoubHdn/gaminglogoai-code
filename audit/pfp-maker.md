# `/pfp-maker` audit

## A. File locations

- Page component: [src/pages/pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:1>). The file header still calls itself `face-logo-generator.tsx` at [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:1>).
- API route used by the page: `api.faceLogo.generateFaceLogo` from [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:231>), implemented in [src/server/api/routers/faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:142>) and registered at [src/server/api/root.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/root.ts:23>).
- Helper and data files:
  - Style catalog: [src/data/faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:2>).
  - Browser compression library is used from [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:15>).
  - Mautic sync helper import: [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:10>).
- Shared config the flow reads:
  - tRPC body size limit: [trpc.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/trpc.ts:111>).
  - Replicate and S3 env vars: [env.mjs](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/env.mjs:24>), [env.mjs](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/env.mjs:49>), [env.mjs](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/env.mjs:50>).
  - pSEO references to the same style catalog: [pSEO.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/lib/pSEO.ts:34>).

## B. Platform assumptions

- Output dimension is fixed to square. The page defines `type FaceAspectRatio = "1:1"` in [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:34>), stores only `"1:1"` in state at [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:57>), and the API schema only allows `"1:1"` in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:149>).
- The dimension is hardcoded, not pulled from shared config, in [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:552>) and [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:53>).
- The word "Twitch" does not appear in the model prompt. Prompt assembly is based on the chosen face style plus a generic detail suffix in [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:288>).
- The word "Twitch" also does not appear in the UI copy for this page. The page positions itself as gaming logo/avatar UI in [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:391>).
- Validation and filenames are generic. Validation is in [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:271>) and [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:277>); download naming is in [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:325>).
- Post-processing does not assume any platform-specific safe area. The route uploads the model output directly after S3 staging of the input photo and does not crop or resize the final output to a named target size in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:203>) and [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:223>).
- No platform-branded assets are baked in. The style set is art/game/theme/cultural based in [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:6>), [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:69>), [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:114>), and [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:147>).

## C. Inputs the tool currently accepts

- Form fields:
  - `inputText` string, required in [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:43>) and validated in [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:271>).
  - `selectedStyleBasePrompt`, required in [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:50>) and validated in [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:278>).
  - `selectedModel` enum `flux-kontext-pro | flux-kontext-max` in [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:33>).
- File uploads:
  - Required photo upload in [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:277>).
  - Accepted MIME types: PNG/JPEG/WEBP in [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:80>) and [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:429>).
  - Client messaging says "PNG, JPG, WEBP up to 5MB" in [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:433>).
  - Client compression target is `maxSizeMB: 1` and `maxWidthOrHeight: 1024` in [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:88>).
  - Request-size guard is only heuristic on the client; it estimates base64 against a `serverLimitMB = 5` in [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:107>), while the actual shared tRPC body parser is `8mb` in [trpc.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/trpc.ts:114>).
- Style/preset selectors:
  - Top categories: `Art Style`, `Game Title`, `Theme & Motif`, `Seasonal & Cultural` from [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:6>), [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:69>), [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:114>), and [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:147>).
  - Art-style examples include `Cartoon`, `Toony`, `Disney`, `Anime`, `Shonen`, `Shojo`, `Retro`, `Chibi`, `Cute`, `Pixel Art`, `80s`, `Vector`, `Watercolor`, `Sketch`, `Glitch`, `Sticker`, `Wolf`, and `Dragon` from [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:8>), [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:13>), [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:19>), [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:24>), [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:29>), [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:39>), [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:51>), and [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:62>).
  - Model selector options are `Pro Face Engine` and `Max Face Engine` in [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:72>).
- Text overlay input: the user-provided `inputText` is inserted into each style prompt via placeholder replacement in [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:288>).

## D. Generation pipeline

- Replicate model called:
  - `black-forest-labs/flux-kontext-pro` in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:68>).
  - `black-forest-labs/flux-kontext-max` in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:72>).
- Real prompt shape:
  - Example base style: `Cartoon` from [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:8>).
  - The page replaces `Text` with the entered name and appends either `, detailed face, good lighting, professional logo` or `, ultra detailed face, cinematic lighting, sharp focus on face, masterpiece` in [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:288>) and [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:289>).
  - Example final prompt: `Convert the user's photo into a friendly, approachable Western cartoon character logo/avatar... The name 'ShadowBlade' MUST be integrated clearly below the character... , detailed face, good lighting, professional logo` based on [faceStylesData.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/data/faceStylesData.ts:8>) and [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:288>).
- Aspect ratio / dimension parameter sent to Replicate:
  - `aspect_ratio: "1:1"` is sent in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:60>).
  - No pixel width/height is sent.
- Post-processing:
  - User photo is staged to S3 first at `user-uploads/faces/{userId}/{uuid}.{ext}` in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:195>).
  - The route handles multiple possible Replicate output types but does not resize/crop the final square result after generation in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:83>) and [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:215>).
- Credits are charged before generation in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:165>).
- Credit refund on failure: none found after photo upload, Replicate failure, or S3 failure in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:183>).

## E. Output

- Final dimensions: square, but exact pixels are model-defined because only `1:1` is set and no post-generation resize exists ([faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:60>)).
- File format: PNG is requested in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:61>) and uploaded as `image/png` in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:223>).
- Storage:
  - Input upload path: `user-uploads/faces/{userId}/{uuid}.{ext}` in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:195>).
  - Final output path: flat `icon.id` key in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:220>).
- URL returned to the user:
  - `https://${BUCKET_NAME}.s3.${awsRegionToUse}.amazonaws.com/${icon.id}` in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:228>).

## F. Cross-tool sharing

- Shared code used:
  - Shared auth/body-parser layer: [trpc.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/trpc.ts:99>).
  - Shared env config: [env.mjs](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/env.mjs:24>).
  - Shared `Icon` model: [schema.prisma](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/prisma/schema.prisma:71>).
  - Shared pSEO style references: [pSEO.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/lib/pSEO.ts:34>).
- Duplicated logic that should be shared:
  - Replicate client and output-normalization logic overlaps heavily with the enhancement and logo generators in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:31>) and [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:52>).
  - Credit deduction + Mautic sync + `Icon` + S3 upload is duplicated in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:165>) and [generate.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/generate.ts:138>).

## G. Platform-extension readiness verdict

- Can I add a new platform by just adding a new dimension preset, without touching the prompt? No - the route is hardcoded to `1:1` and there is no platform preset abstraction ([faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:149>)).
- Does the prompt need to change per platform? Usually no - most avatar/PFP prompts are generic, but you may want platform-safe wording for Discord/server-icon corner safety or TikTok profile framing ([pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:288>)).
- Does the UI need a platform selector, or is platform inferred from the URL? A platform selector is the better fit, because the current URL is universal and the only built-in assumption is "square" ([pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:388>)).
- Are there platform-specific visual conventions the AI does not know about that need injection? Yes - Discord-style icon corner safety and any platform-specific avatar crops are absent ([faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:57>)).

## H. Known issues

- The Share popup points to `/gaming-logo-maker` instead of `/pfp-maker` in [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:627>).
- The file header still references `face-logo-generator.tsx`, which increases naming confusion for maintenance in [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:1>).
- Client/server upload limits are not aligned cleanly: the page says 5MB, the compressor targets 1MB, the heuristic checks 5MB estimated base64, and the shared tRPC parser is actually 8MB ([pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:88>), [pfp-maker.tsx](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/pages/pfp-maker.tsx:107>), [trpc.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/trpc.ts:114>)).
- No refund path exists if credits are deducted and the later S3 or Replicate steps fail ([faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:165>), [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:185>)).
