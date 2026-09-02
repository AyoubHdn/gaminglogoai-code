# GSC Report — gaminglogoai.com — Cycle 2026-08-31

**Property:** `sc-domain:gaminglogoai.com`
**Window:** 2026-08-03 → 2026-08-28 (28 days) · 1,270 query×page rows
**Prior cycle:** `../2026-08-18-postvacation/` (window 07-21 → 08-15)

> **Methodology (unchanged):** `totals` field is broken (`position: 0`, double-counts). Site + page totals are **recomputed by summing rows**; position is **impression-weighted** `Σ(pos·impr)/Σ(impr)`. `PYTHONIOENCODING=utf-8` required.
> **Window caveat:** overlaps the prior cycle by ~13 days (08-03→08-15). Deltas are directional.

---

## Site totals — clicks accelerating

| Metric | Prior (07-21→08-15) | **Now (08-03→08-28)** | Δ |
|---|---|---|---|
| Clicks | 150 | **198** | **+48 (+32%)** |
| Impressions | 12,340 | **13,939** | +1,599 (+13%) |
| CTR | 1.22% | **1.42%** | +0.20pp |
| Avg position (wtd) | 23.3 | **24.0** | −0.7 (slightly deeper) |

Clicks up 32% on 13% more impressions → **CTR improving meaningfully** (1.22→1.42%). Average position dipped slightly (mix shift — more deep-ranked international logo impressions, see below). Strong click growth cycle.

---

## Headline #1 — PFP page: the "ai pfp" thesis is now firmly confirmed ✅

`/ai-profile-picture-maker`: **2,412 impr / 45 clk / 1.87% CTR / p9.4** (prior: 2,359 / 34 / 1.44% / p9.3). **Clicks +32%, CTR recovered 1.44→1.87%** — title still untouched.

The head-query picture from last cycle held and strengthened:

| Query | 2 cycles ago | Prior | **Now** | Read |
|---|---|---|---|---|
| `ai pfp maker` | — | p7.9, 4clk, 1.07% | **p7.6, 9clk, 2.21%** | 🔺🔺 now the page's top click query |
| `ai pfp` | p8.1, 0.39% | p8.4, 7clk, 1.45% | **p8.2, 8clk, 1.99%** | 🔺 held p8, CTR climbing |
| `pfp generator` | p8.6, 6clk | — | **p9.0, 9clk, 2.97%** | 🔺 strong, broad convert |
| `ai gaming profile picture generator` | p8.2, 0.30% | p18.6, **0clk** | **p20.6, 1clk, 0.21%** | 🔻 stayed off page 1 |

**The inversion is now a stable pattern across three cycles, not a blip.** The broad "ai pfp / ai pfp maker / pfp generator" terms hold p7–9 and produce the clicks; the "gaming"-specific head query has settled at p20 and produces ~nothing. **The gaming-led title test stays SHELVED** — retargeting toward "gaming" would trade away the terms actually working. Current title is correctly aligned. (This is the third consecutive cycle confirming it — recommend closing it as a decision, not an open item.)

---

## Headline #2 — gaming-logo: dedicated page REGRESSED; homepage is cannibalizing the head term ⚠️ (revisit trigger now closer)

This needs a sharper look than "still deferred." Decomposing `gaming logo maker` (612 impr, p28.8 blended) by page:

| Page ranking for "gaming logo maker" | Impr | Position | Clicks |
|---|---|---|---|
| **`/` (homepage)** | 476 | **p19.9** | 3 |
| **`/gaming-logo-maker`** (the dedicated tool) | 129 | **p59.5** | 0 |
| `/gaming-logo` | 7 | p70.4 | 0 |

- **The dedicated `/gaming-logo-maker` page fell hard: page-agg p44.1 (prior) → p54.0 (now); on the head term specifically it sits p59.5.** Meanwhile the **homepage** is what Google surfaces for "gaming logo maker" (p19.9) — the two are competing, and Google prefers the homepage but only at a mediocre p20.
- **This partially trips the consolidation revisit trigger.** The trigger was "dedicated page flat/worse than ~p38 for two consecutive cycles while home holds." The page is now **worse than p38 (p54), and this is the first clearly *negative* cycle** after three positive ones. It's **one cycle**, not two — so not yet a confirmed reversal — but the direction flipped. **Flag: watch next cycle. If `/gaming-logo-maker` is still ≥~p45 next pull, the "leave it alone / self-resolving" call is void and consolidation should be reconsidered.**
- **The tool is still healthy where it competes:** `gaming logo ai` **p2.8, 17 clk, 19.5% CTR** (site's #1 click query again), `ai gaming logo` p7.5, 11 clk, 12.4%. The AI-modifier and specific-game logo terms are excellent; only the **generic heads** ("gaming logo maker/creator/free", incl. French/German variants) are deep and clickless.

---

## Headline #3 — gears-of-war PFP: SXO diagnosis reconfirmed, still 0-clicking at page 1

The page I ran SXO on last cycle behaves exactly as diagnosed:

| Query | Prior | **Now** |
|---|---|---|
| `gears of war pfp` | p6.6, 166 impr, 0clk | **p6.3, 203 impr, 2clk, 0.99%** |
| `gears of war profile picture` | p6.4, 52 impr, 0clk | **p6.0, 51 impr, 0clk** |
| `gears pfp` | p4.2, 17 impr | **p4.7, 21 impr, 0clk** |

Page total: **301 impr / 2 clk / 0.66% CTR / p6.4.** Still page 1 across the whole cluster, still barely clicking — the **browse-vs-create mismatch** (SERP wants grab-and-go galleries; page is an upload-a-selfie tool) persists. The 2 clicks are the first ever — marginal. **The gallery-hybrid template fix (for Codex) remains the lever.** No SEO change will move this; it's a page-format problem.

---

## Headline #4 — thumbnail page: indexed, ranking, still pre-click

`/youtube-thumbnail-maker`: **15 impr / 0 clk / p29.8** (prior 7 impr). Doubling impressions on-intent (`gaming thumbnail maker` p39, `thumbnail battle game` p8.8, `youtube gaming thumbnail maker` p31.5), still too deep on the head terms to click. `/thumbnail-maker` remains **0 rows** — cannibalization fix still holding. The content-enrichment effect is **still not clearly measurable** (positions p30–39 on heads); this page needs more time / position gains. Re-read next cycle. Note: per the minecraft inflection analysis last cycle, don't expect a content-enrichment *step-change* here either — gains are likely gradual if they come.

---

## Top click drivers (site-wide)

| Query | Clicks | Impr | Position | CTR |
|---|---|---|---|---|
| `gaming logo ai` | 17 | 87 | p2.8 | 19.5% |
| `gaminglogoai` (brand) | 14 | 157 | p2.1 | 8.9% |
| `ai gaming logo` | 11 | 89 | p7.5 | 12.4% |
| `ai pfp maker` | 9 | 408 | p7.6 | 2.21% |
| `pfp generator` | 9 | 303 | p9.0 | 2.97% |
| `ai pfp` | 8 | 403 | p8.2 | 1.99% |
| `minecraft gaming logo` | 8 | 230 | p4.6 | 3.48% |
| `fortnite pfp maker` | 8 | 179 | p8.7 | 4.47% |

**Top landing pages:** `/` (68 clk), `/ai-profile-picture-maker` (45 clk), `/logo/games/minecraft-logo-maker` (39 clk, p11.1, 2.71% — still the workhorse pSEO page).

---

## Biggest opportunities (high impressions, 0–1 clicks)

| Query | Impr | Position | Note |
|---|---|---|---|
| `ai gaming profile picture generator` | 473 | p20.6 | Stuck p20; the "gaming pfp" term we're NOT winning |
| `gaming logo` | 460 | p30.9 | Generic head, deep |
| `logo maker gaming` | 444 | p39.0 | Word-order variant, deep |
| `gaming logo creator` | 303 | p39.0 | Generic synonym |
| `gaming logo maker free` | 290 | p37.1 | Free-modifier, deep |
| **International:** `créateur de logo gaming` (209, p50), `gaming logo erstellen` (186, p31), `creer un logo gaming` (161, p46) | — | — | 🌍 **New: FR/DE logo demand surfacing at scale, all deep — untapped i18n opportunity** |

---

## Status & next
- ✅ Site clicks +32% (198); CTR up to 1.42%. Strong cycle.
- ✅ **PFP "ai pfp" thesis confirmed 3rd cycle** — gaming-led title test should be formally CLOSED (shelved), not carried.
- ⚠️ **NEW: `/gaming-logo-maker` dedicated page regressed to p54** while homepage cannibalizes the head term at p20. First negative cycle after 3 positive — **consolidation revisit trigger half-tripped; decide next cycle if page stays ≥p45.**
- 📋 gears-of-war PFP: SXO diagnosis holds (301 impr, p6.4, 2 clk) — gallery-hybrid template = the fix (Codex).
- 📋 thumbnail page: 7→15 impr, still pre-click at p30-39; re-read next cycle.
- 🌍 **NEW: French/German "gaming logo" demand at scale (550+ impr combined), all p31–50** — untapped international opportunity worth flagging.
- Next: GA4 (property `490347534`), then drift compare.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Built by agricidaniel — Join the AI Marketing Hub community
🆓 Free  → https://www.skool.com/ai-marketing-hub
⚡ Pro   → https://www.skool.com/ai-marketing-hub-pro
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
