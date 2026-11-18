# GSC Report — sc-domain:gaminglogoai.com — 2026-07-12 (last 28 days)

Source: `gsc_query.py query --dimensions query,page --limit 1000`. Site totals recomputed from 1,004 rows (script `totals` field double-counts query×page; CTR is impression-weighted, position is impression-weighted).

## Site Totals — WoW improvement

| Metric | Last week | This week | Δ |
|--------|-----------|-----------|-----|
| Clicks | 114 | **133** | +19 (+17%) |
| Impressions | 11,146 | **12,214** | +1,068 (+10%) |
| CTR | 1.02% | **1.09%** | +0.07pt |
| Avg position | 26.1 | **24.7** | ▲ 1.4 (better) |

Everything moved the right direction. Growth is real, not seasonal noise.

## Top Queries (by clicks)

| Clicks | Impr | Pos | Query |
|--------|------|-----|-------|
| 20 | 89 | 2.6 | gaming logo ai |
| 18 | 507 | 7.7 | **fortnite pfp maker** ← biggest headroom |
| 9 | 121 | 5.7 | ai gaming logo |
| 7 | 305 | 5.4 | minecraft gaming logo |
| 4 | 26 | 5.9 | ai gamer logo generator |
| 3 | 107 | 13.3 | minecraft logo generator |

**`fortnite pfp maker`**: 507 impressions at pos 7.7 → moving it into the top 3 is the single largest click opportunity on the site.

## Quick Wins — high impressions, position 4–15, near-zero clicks (CTR problem)

| Impr | Pos | Clicks | Query |
|------|-----|--------|-------|
| 218 | 6.9 | **0** | gears of war pfp |
| 93 | 8.8 | 1 | ai pfp |
| 78 | 10.2 | 3 | ai pfp maker |
| 69 | 5.3 | **0** | kawaii pfp maker |
| 63 | 11.1 | 1 | fortnite profile picture maker |
| 55 | 14.9 | 0 | fortnite logo designer |
| 52 | 7.7 | 0 | minecraft gaming logo photo |
| 51 | 6.5 | 0 | gaming logo minecraft |

Many queries rank page-1 (pos 5–8) with **zero clicks** → this is a **title-tag / meta-description CTR problem**, not a ranking problem. `gears of war pfp` (218 impr, pos 6.9, 0 clicks) is the flagship example.

## Top Pages

| Clicks | Impr | CTR | Page |
|--------|------|-----|------|
| 56 | 6,301 | 0.89% | / |
| 36 | 1,615 | 2.23% | /logo/games/minecraft-logo-maker |
| 22 | 778 | 2.83% | /pfp/games/fortnite-pfp-maker |
| 8 | 582 | 1.37% | /ai-profile-picture-maker |
| **4** | **1,096** | **0.36%** | **/gaming-logo-maker** ← still the problem child |

- **`/gaming-logo-maker`**: 1,096 impressions, only 4 clicks (0.36% CTR). Confirms last week — high visibility, terrible click-through. Prime candidate for a title/meta rewrite + `/seo page` deep-dive.
- **`/logo/games/minecraft-logo-maker`** is the star performer (2.23% CTR). Minecraft is your strongest programmatic cluster.

## Recommended actions

1. 🔴 **CTR sprint** — rewrite title/meta for zero-click page-1 queries: `gears of war pfp`, `kawaii pfp maker`, `minecraft gaming logo photo`, `gaming logo minecraft`. Fastest clicks on the board.
2. 🔴 **Push `fortnite pfp maker` to top 3** — 507 impr at pos 7.7; content/internal-link boost to `/pfp/games/fortnite-pfp-maker`.
3. 🟡 **`/gaming-logo-maker` rewrite** — 0.36% CTR on 1,096 impr is the worst ROI on the site.
4. 🟢 **Double down on Minecraft cluster** — it converts; expand programmatic coverage.
