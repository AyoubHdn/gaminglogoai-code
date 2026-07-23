# GSC Report — gaminglogoai.com — pulled 2026-07-23

Source: GSC Search Analytics API, `sc-domain:gaminglogoai.com`, 28d, `query,page`, 1,101 rows.
Window **2026-06-25 → 2026-07-20**. Previous pull: `../2026-07-19-week/gsc-report.md` (window 06-21 → 07-16).

> **Two caveats that govern every number below.**
> 1. **The windows overlap 22 of 28 days.** This is a 4-day roll, not a clean week-over-week. Deltas = (07-17…07-20 in) − (06-21…06-24 out). Treat them as directional.
> 2. **The Priority #1 fix deployed 2026-07-19 14:44** (commit `1c0ab9b`). This window ends **07-20** — roughly **one day** of post-deploy data, and Google had not re-crawled/re-rendered the new title across the query cluster yet. **Nothing here measures the CTR fix.** Site-level metrics recomputed by summing rows (the script's `totals.position` is unusable).

---

## Site totals

| Metric | 06-21→07-16 | 06-25→07-20 | Δ |
|---|---|---|---|
| Clicks | 130 | **145** | **+15 (+11.5%)** |
| Impressions | 12,086 | 12,226 | +140 |
| CTR | 1.08% | **1.19%** | +0.11pp |
| Avg position (impr-weighted) | 24.8 | **24.3** | +0.5 ↑ |

First click increase of the engagement — but with a 4-day roll and one post-deploy day, this is **pre-existing momentum**, not the fix.

---

## Page level (top rows by impressions)

| Page | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|
| `/` | 55 (+7) | 5,784 (−153) | 0.95% (+0.14) | 27.8 (−0.2) |
| `/logo/games/minecraft-logo-maker` | 37 (+4) | 1,517 (+20) | 2.44% (+0.23) | 12.2 (**+0.3**) |
| `/gaming-logo-maker` | 5 (+0) | 1,469 (**+189**) | 0.34% | 44.8 (**+6.8**) |
| `/ai-profile-picture-maker` | **19 (+5)** | **989 (+162)** | 1.92% (+0.23) | **10.5 (+1.2)** |
| `/pfp/games/fortnite-pfp-maker` | 19 (−2) | 701 (−62) | 2.71% | 9.9 (−0.4) |
| `/logo/games/fortnite-logo-maker` | **0** | 422 (−59) | **0.00%** | 18.0 |
| `/pfp/games/gears-of-war-pfp-maker` | 2 | 224 (−17) | 0.89% | 6.2 (+0.3) |
| `/pfp/games/rainbow-six-siege-pfp-maker` | **0** | 217 (+26) | **0.00%** | **6.3 (+0.8)** |
| `/twitch-emote-maker` | 1 (**+1**) | 171 (+5) | 0.58% | 21.6 |
| `/pfp/styles/kawaii-avatar-maker` | 1 | 133 (−17) | 0.75% | 8.3 |
| `/pfp-maker` | 0 | 107 (+3) | 0.00% | 42.5 (+2.2) |
| `/twitch-banner-maker` | 0 | 51 (**+22**) | 0.00% | 44.8 (+0.5) |
| `/gaming-logo` | 0 | 28 (**+11**) | 0.00% | 48.4 (−0.8) |

---

## 1. `/ai-profile-picture-maker` — still climbing, fix not yet measurable

| | Prev | Now | Δ |
|---|---|---|---|
| Clicks | 14 | **19** | +5 (+36%) |
| Impressions | 827 | **989** | +162 |
| CTR | 1.69% | **1.92%** | +0.23pp |
| Position | 11.7 | **10.5** | +1.2 ↑ |

Query cluster:

| Query | Clicks | Impr | Position |
|---|---|---|---|
| ai gaming profile picture generator | 1 | 286 (+38) | **10.0 (+1.7)** |
| ai pfp | 1 | 182 (+37) | 8.1 (+0.4) |
| ai pfp maker | **4** (was 3) | 125 (+15) | 8.7 (+0.3) |
| ai pfp generator | **2** (was 1) | 73 (+19) | 9.7 (+0.4) |
| pfp generator | 2 | 73 (+10) | 8.4 (flat) |
| pfp maker ai | 2 | 50 (+10) | 9.3 (flat) |
| ai generated pfp | 0 | 20 (+7) | 7.2 (+0.6) |
| gaming profile picture maker | 0 | 13 (+2) | 12.8 (**+3.0**) |

**The "pfp" abbreviation now carries 643 of 989 impressions (65%, was 63%) and 17 of the 19 clicks (89%).** The premise behind the title rewrite is reinforced, not weakened — demand is overwhelmingly on the abbreviation, and that's where the clicks already come from.

**But CTR is still 1.92% at p10.5.** That is the number the fix targets, and it is essentially unchanged because Google had ~1 day. **Verdict deferred.** Re-pull on/after **2026-08-02** for a window with 10+ clean post-deploy days.

The one query to watch: **"ai gaming profile picture generator"** — 286 impressions, now exactly **p10.0**, and **1 click**. It's the biggest single query on the page and sits on the page-1/page-2 boundary. The new title keeps "Gaming Profile Picture Generator" in it, so this is the query where the rewrite should show up first.

---

## 2. Priority #2 just got more interesting — `/gaming-logo-maker` is climbing on its own

This is the notable finding of the pull.

| Query on `/gaming-logo-maker` | Impr | Position | Δ pos |
|---|---|---|---|
| gaming logo maker | 202 (+59) | 38.3 | **+13.9** ↑↑ |
| gaming logo creator | 190 (+53) | 31.9 | **+13.8** ↑↑ |
| logo maker gaming | 140 (+0) | 39.4 | +5.4 ↑ |
| gaming logo maker free | 90 (+11) | 53.0 | +6.3 ↑ |
| game logo creator | 82 (+3) | 42.6 | +3.5 ↑ |

Whole page: **impressions +189, position 51.6 → 44.8 (+6.8)**. Every head query on it moved up, several by 13–14 positions.

**The head term "gaming logo maker" is still split, and now we can see the split precisely:**

| Page | Clicks | Impr | Position |
|---|---|---|---|
| `/` (home) | **3** | 451 | **21.5** |
| `/gaming-logo-maker` | 2 | 202 | 38.3 |
| `/gaming-logo` | 0 | 1 | 76 |
| **combined** | **5** | **654** | — |

This **refines** last cycle's read. Previously logged as "601 impr at p29" in aggregate. Split out: **home is the stronger ranker (p21.5) and the dedicated page is the faster climber (+13.9 in four days)**. Consolidation direction is no longer obvious from ranking alone — home has the authority, `/gaming-logo-maker` has the topical match and momentum. Worth resolving before executing #2, not during.

`/gaming-logo` (the landing edited last cycle) is at 28 impr / p48.4 and is **not** competing on the head term (1 impression). It's picking up clan-logo long tail instead. It is not the cannibalization problem.

---

## 3. Zero-click pages at good positions — the SXO pattern hardens

| Page | Impr | Position | Clicks |
|---|---|---|---|
| `/pfp/games/rainbow-six-siege-pfp-maker` | 217 | **6.3** | **0** |
| `/logo/games/fortnite-logo-maker` | 422 | 18.0 | **0** |
| `/pfp/games/gears-of-war-pfp-maker` | 224 | 6.2 | 2 |

Rainbow-six is the sharpest case on the site: **217 impressions at position 6 and zero clicks**, position *improving* (+0.8). Position 6 should return ~6–8% CTR. This is the same page GA4 flagged at 42% engagement. Ranking is not the problem and never was — searchers see the result, recognise it as a *maker* rather than a *gallery*, and don't click. It's now confirmed in impression data as well as behavior data, which strengthens the backlogged **example-gallery / SXO treatment**.

`/logo/games/fortnite-logo-maker` at 422 impressions / p18 / 0 clicks is a separate, cheaper opportunity — p18 is page 2, so low CTR is expected, but 422 impressions with a literal zero is worth a snippet look.

---

## 4. Last cycle's edits — continuing to wake up

| Page | Then | Now | Read |
|---|---|---|---|
| `/twitch-banner-maker` | 29 impr | **51 (+22)** | ✅ Still compounding |
| `/gaming-logo` | 17 impr | **28 (+11)** | ✅ Still compounding |
| `/pfp-maker` | p44.7 | **p42.5 (+2.2)** | ✅ Identity fix holding |
| `/twitch-emote-maker` | 0 clicks | **1 click** | ✅ First conversion |
| `/pfp/styles/kawaii-avatar-maker` | p8.4, 150 impr | p8.3, 133 impr | ⚪ Flat; still 1 click. GA4's 25% engagement remains the better explanation |

---

## What this pull changes

1. **Nothing about #1's verdict** — too early by design. Re-pull **2026-08-02+**.
2. **#2 needs a decision it didn't need before:** consolidate *toward home* (p21.5, has the authority) or *toward `/gaming-logo-maker`* (p38.3 but +13.9 in four days, and topically exact). The page is improving without intervention, which is an argument for waiting one more cycle before redirecting anything.
3. **The SXO backlog item earned a promotion candidate:** rainbow-six at 217 impr / p6 / 0 clicks is the single largest position-vs-clicks gap on the site.
