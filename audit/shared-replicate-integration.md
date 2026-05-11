# Shared layer audit: Replicate integration

## Client shape

- There is no single shared Replicate client. Each AI-related route constructs its own client:
  - Gaming logo: [generate.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/generate.ts:25>).
  - PFP: [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:31>).
  - Enhancement: [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:43>).
  - Emote generator: [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:53>).
- All of them rely on the same `REPLICATE_API_TOKEN` env var in [env.mjs](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/env.mjs:24>) and [env.mjs](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/env.mjs:66>).

## Model configuration

- Model names are hardcoded in route code, not centralized:
  - Gaming logo:
    - `black-forest-labs/flux-schnell` in [generate.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/generate.ts:56>).
    - `black-forest-labs/flux-dev` in [generate.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/generate.ts:68>).
  - PFP:
    - `black-forest-labs/flux-kontext-pro` in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:68>).
    - `black-forest-labs/flux-kontext-max` in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:72>).
  - Enhancement route model map:
    - `black-forest-labs/flux-kontext-pro`, `black-forest-labs/flux-kontext-max`, and `google/nano-banana-pro` in [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:45>).
  - Emotes:
    - `openai/gpt-image-1.5` in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:198>) and [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:316>).

## Request patterns

- Gaming logo sends text-only prompts with `aspect_ratio`, `megapixels`, and `num_outputs` in [generate.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/generate.ts:57>).
- PFP sends `input_image`, `aspect_ratio: "1:1"`, and `output_format: "png"` in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:57>).
- Enhancement sends either `image_input` or `input_image` plus `aspect_ratio: "match_input_image"` in [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:62>).
- Emotes send `input_images`, `background: "transparent"`, and `aspect_ratio: "1:1"` in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:199>) and [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:317>).

## Retry / timeout policy

- No explicit retry policy was found in any Replicate call path. Calls go straight to `replicate.run(...)` in [generate.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/generate.ts:92>), [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:83>), [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:80>), and [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:198>).
- No explicit timeout or abort policy was found around those calls.

## Output handling

- Output-shape handling is inconsistent by route:
  - Gaming logo assumes arrays of URL strings and then fetches each URL in [generate.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/generate.ts:92>).
  - PFP has the most defensive output parser, supporting Node streams, Web streams, buffers, URLs, object URLs, and arrays in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:94>).
  - Enhancement duplicates a similar multi-shape parser in [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:98>).
  - Emotes assume array output and then fetch/encode the first URL in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:211>) and [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:343>).

## Verdict

- Replicate integration works today but is fragmented. Before adding more platforms, it would be valuable to centralize model registration, retries/timeouts, and output-shape normalization so every new platform does not re-implement the same plumbing.
