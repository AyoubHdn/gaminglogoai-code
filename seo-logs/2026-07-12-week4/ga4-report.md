# GA4 Organic Report — gaminglogoai.com — 2026-06-14 → 2026-07-11

⚠️ **Config note:** `~/.config/claude-seo/google-api.json` default now points to **namedesignai.com** (`default_property: sc-domain:namedesignai.com`, `ga4_property_id: properties/471548702`). This report was pulled with an **explicit `--property 490347534`** (gaminglogoai). Any bare `/seo google ga4` will report the wrong site until the config default is switched back.

Property: `490347534` · Report: organic traffic

## Totals

| Metric | Value |
|--------|-------|
| Sessions | 730 |
| Users | 707 |
| Pageviews | 1,877 |
| Avg sessions/day | 26.1 |
| Engagement rate | ~73% |

**Trend is up:** first 7 days averaged 20.1 sessions/day → last 7 days 30.7/day (+53%). Consistent with the GSC WoW growth.

## Top Organic Landing Pages

| Sessions | Eng % | Bounce % | Page |
|----------|-------|----------|------|
| 255 | 77.6 | 22.4 | / |
| 95 | 84.2 | 15.8 | /logo/games/minecraft-logo-maker |
| 57 | 71.9 | 28.1 | /gaming-logo-maker |
| 44 | 70.5 | 29.5 | **/free-fire-logos** (winner, ~invisible in GSC) |
| 44 | 59.1 | 40.9 | /pfp/games/fortnite-pfp-maker |
| 35 | 80.0 | 20.0 | /pfp/games/call-of-duty-pfp-maker |
| 32 | 87.5 | 12.5 | /ai-profile-picture-maker |
| 32 | 71.9 | 28.1 | /logo/games/call-of-duty-logo-maker |
| 17 | 82.4 | 17.6 | /pfp/games/gears-of-war-pfp-maker |
| 12 | 33.3 | 66.7 | /pfp/games/rainbow-six-siege-pfp-maker ← worst engagement |

## Cross-reference with GSC

- **`/gaming-logo-maker`**: GA4 engagement is actually **fine** (71.9% eng, 28.1% bounce). Its problem is purely GSC **CTR** (0.36% on 1,096 impr) — people don't click the SERP result, but those who land engage OK. → Fix the title/meta, not the page content.
- **`/free-fire-logos`**: 44 organic sessions in GA4, ~absent from GSC top pages. Traffic likely arriving from non-Google organic or long-tail. Worth a GSC indexation/coverage check + internal links.
- **`/logo/games/minecraft-logo-maker`**: strong in both — 95 GA4 sessions, 84.2% engagement, 36 GSC clicks. Your best programmatic page.
- **`/pfp/games/rainbow-six-siege-pfp-maker`**: 66.7% bounce on 12 sessions — thin/mismatched content candidate (low volume, monitor).

## Actions

1. 🔴 Fix `/gaming-logo-maker` title/meta (CTR issue, not engagement).
2. 🟡 Investigate `/free-fire-logos` — indexation + internal linking to capture the demand GA4 shows.
3. 🟢 Expand the Minecraft logo cluster (best engagement + clicks).
4. 🟢 Switch the claude-seo config default back to gaminglogoai, or always pass `--property 490347534`.
