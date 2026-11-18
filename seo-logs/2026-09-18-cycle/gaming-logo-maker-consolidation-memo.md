# /gaming-logo-maker — Consolidation Decision Memo — 2026-09-18

**Question:** Does the dedicated `/gaming-logo-maker` page have any **unique** query coverage, or is it purely a **weaker duplicate** of the homepage? (Decides whether consolidating it away costs anything.)

**Data:** GSC query×page, **90-day window** (2026-06-17 → 2026-09-15) for completeness — `gsc_qp_90d.json`.

---

## Verdict: it is a near-total weaker duplicate. Consolidating away costs ~1 impression.

Over 90 days the dedicated page earns clicks or ≥10 impressions on **54 queries**. For **53 of those 54**, the homepage **also ranks** — and on **virtually all of them the homepage ranks HIGHER**, usually by 15–30 positions.

| Measure | Value |
|---|---|
| Dedicated page's meaningful queries (clicks or ≥10 impr) | **54** |
| …where homepage ALSO ranks | **53 (98%)** |
| …where homepage ranks **better** than the dedicated page | **~51** |
| …where the dedicated page is **UNIQUE** (homepage absent) | **1** — `"logo generator"` (1 click, 1 impression, p3) |
| Dedicated page visible-query totals (90d) | 12 clicks / 4,379 impr |
| **Of that, on queries UNIQUE to the dedicated page** | **1 click / 1 impression** |

**≈99.98% of the dedicated page's impressions are on queries the homepage already ranks for — and ranks better on.** Its total unique footprint is a single impression on "logo generator." There is no meaningful audience the dedicated page reaches that the homepage doesn't already reach better.

---

## The head-term evidence (the pattern in one row)

| Query | Dedicated | Homepage | Gap |
|---|---|---|---|
| gaming logo maker | 2 clk / 520 impr / **p46** | 7 clk / 1,612 impr / **p21** | Home +25 positions, 3× the impressions |
| logo maker gaming | 0 / 575 / p46 | 1 / 799 / p27 | Home +19 |
| gaming logo creator | 0 / 489 / p40 | 0 / 752 / p27 | Home +13 |
| gaming logo maker free | 0 / 289 / p54 | 4 / 690 / p29 | Home +25 |
| gaming logo generator | 1 / 68 / p47 | 3 / 172 / p19 | Home +28 |
| gaming logo ai | 1 / 8 / p25 | **58 / 293 / p2** | Home +23, 58× the clicks |

On every commercial head term, the two URLs **compete against each other** and the homepage wins decisively. The dedicated page isn't adding reach — it's splitting the site's relevance signals for "gaming logo maker" across two URLs, which plausibly *holds the homepage back* from breaking p21 into the top 10.

## The 3 "dedicated ranks better" cases — all non-events
- **`gaminglogoai`** (brand): both p1, but homepage takes 26 clicks to the dedicated page's 3 — homepage owns the brand term regardless.
- **`gamer logo creator`** p35 vs p38, **`best gaming logo maker`** p45 vs p54 — both buried past page 3 with **0 clicks**. Winning a dead position is worth nothing.

There is no query where the dedicated page both (a) uniquely ranks or out-ranks the homepage and (b) earns real traffic.

---

## Recommendation: consolidate — Option A (redirect to homepage)

**Consolidating costs essentially nothing** (1 impression of unique coverage) and is likely **net-positive** by concentrating link/relevance signals onto one URL for the "gaming logo maker" family — the exact term the homepage is stuck at p21 on.

- **Option A — 301 redirect `/gaming-logo-maker` → `/` (recommended).** Google already prefers the homepage for these terms (confirmed by last cycle's URL inspection: self-canonical, Google choosing homepage). A 301 formalizes reality, preserves the 12 clicks (they redirect), and stops the two URLs from splitting signals. Lowest-risk, highest-consolidation.
- **Option B — back the dedicated page instead** (internal links + differentiate) only makes sense if there's a product reason to want a standalone `/gaming-logo-maker` tool URL distinct from the homepage. On the SEO data alone, there is no case for it — the page has proven over 90 days it cannot out-compete the homepage on a single valuable query.

**This resolves priority #1.** The earlier "decide which URL should win" framing is now answered by the data: **the homepage already wins everywhere; make it official.**

---

## Limitations
- Query×page drops anonymized queries; the dedicated page's page-dim total (1,886 impr/26d) exceeds its visible-query sum, so some long-tail is unseen — but anonymized queries are by definition tiny, and the measured 53/54 overlap is overwhelming.
- A 301 is reversible if a product need for the standalone URL emerges; the SEO downside is bounded at ~1 impression.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Built by agricidaniel — Join the AI Marketing Hub community
🆓 Free  → https://www.skool.com/ai-marketing-hub
⚡ Pro   → https://www.skool.com/ai-marketing-hub-pro
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
