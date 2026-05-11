# Shared layer audit: image storage

## Bucket configuration

- The gaming image bucket and region come from `NEXT_PUBLIC_S3_BUCKET_NAME_GAMING` and `NEXT_PUBLIC_AWS_REGION_GAMING` in [env.mjs](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/env.mjs:49>) and [env.mjs](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/env.mjs:50>).
- Shared asset URLs are built off the same bucket base in [s3Paths.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/utils/s3Paths.ts:4>).

## Naming and path structure

- Final generated outputs are mostly stored flat at the root of the bucket under `icon.id`:
  - Gaming logo: [generate.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/generate.ts:203>).
  - PFP: [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:223>).
  - Twitch banner: [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:241>).
  - Twitch panel: [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:191>).
  - Twitch stream screen: [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:164>).
  - AI enhancement: [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:198>).
- User uploads and intermediates are more structured:
  - Face-photo upload: `user-uploads/faces/{userId}/{uuid}.{ext}` in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:195>).
  - Banner upload: `user-uploads/twitch/{userId}/{uuid}.{ext}` in [s3.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/s3.ts:34>).
  - Emote input/base/final paths in [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:192>), [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:232>), and [emoteGenerator.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/emoteGenerator.ts:347>).

## URL patterns returned to users

- Most routes return direct public S3 URLs of the form `https://{bucket}.s3.{region}.amazonaws.com/{key}` in [faceLogo.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/faceLogo.ts:228>), [twitchBanner.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchBanner.ts:249>), [twitchPanel.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchPanel.ts:199>), [twitchStreamScreen.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/twitchStreamScreen.ts:170>), and [enhancement.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/enhancement.ts:202>).
- Gaming-logo output is the outlier because it hardcodes `us-east-1` instead of reading the env region in [generate.ts](<C:/Users/ULTRAPC/Documents/GitHub/SaaS/gaminglogoai-code/src/server/api/routers/generate.ts:222>).

## Organization verdict

- Images are not organized consistently by tool or platform. Final assets are mostly flat, while uploads/intermediates sometimes encode tool/platform in the path.
- If you add more platforms, this mixed strategy will make cleanup, analytics, lifecycle rules, and debugging harder because platform identity is often only stored in `Icon.prompt`, not the S3 key.
