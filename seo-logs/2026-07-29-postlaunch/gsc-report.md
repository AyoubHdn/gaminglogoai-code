# GSC Post-Launch Pull — gaminglogoai.com — 2026-07-29

**Purpose:** First measurable read on the **Priority #1 CTR fix** (`/ai-profile-picture-maker`, deployed **2026-07-19 14:44**). This is the check the last two cycles couldn't make.

- **Window:** 2026-07-01 → 2026-07-26 (28d, GSC API).
- **Post-deploy days inside window:** ~7 (07-20 → 07-26). Enough for an early CTR read, not a settled one.
- **Caveat — not clean WoW:** overlaps 20/28 days with the prior window (06-25→07-20). Treat deltas as directional.
- Totals below are **recomputed by summing rows** (the script's `totals` field double-counts across query×page). Position is **impression-weighted**.

---

## Site totals (recomputed)

| Metric | 07-16 wk | 07-23 wk | **07-29 (now)** | Δ vs prior |
|---|---|---|---|---|
| Clicks | 130 | 145 | **137** | −8 |
| Impressions | 12,086 | 12,226 | **11,969** | −257 |
| CTR | 1.08% | 1.19% | **1.14%** | −0.05pt |
| Position | 24.8 | 24.3 | **23.4** | +0.9 ✅ |

Site roughly flat with a small click dip; average position keeps creeping up. Nothing here is a regression — it's window roll plus query reshuffle.

---

## VERDICT — Priority #1 CTR fix: **did NOT move CTR. Clicks grew anyway, from ranking + impressions.**

`/ai-profile-picture-maker`, three cycles:

| | 07-16 wk | 07-23 wk (pre-fix*) | **07-29 (7d post-fix)** |
|---|---|---|---|
| Impressions | 827 | 989 | **1,302** (+313) |
| Clicks | 14 | 19 | **24** (+5) |
| Position | 11.7 | 10.5 | **9.8** (onto p1) |
| **CTR** | 1.69% | **1.92%** | **1.84%** ⬇ |

\* The 07-23 window had only ~1 post-deploy day, so its 1.92% is effectively the **pre-fix baseline**. Seven post-deploy days later CTR is **1.84% — flat-to-down.** The "Free" hook did not lift click-rate.

**The clicks did grow (19→24, +26%) — but the mechanism was position (10.5→9.8, now solidly page 1) and impressions (+313), not the CTR play the fix was.** On its own stated target (CTR 1.7% → 4–5%), the fix failed.

### Why CTR isn't lifting — the query breakdown

Page-1 queries on this page (≥30 impr):

| Impr | Clk | CTR | Pos | Query |
|---|---|---|---|---|
| **330** | 1 | **0.30%** | 8.2 | **ai gaming profile picture generator** |
| **258** | 1 | **0.39%** | 8.1 | ai pfp |
| 169 | 3 | 1.78% | 8.7 | ai pfp maker |
| 125 | 4 | 3.20% | 8.6 | pfp generator |
| 84 | 2 | 2.38% | 9.1 | ai pfp generator |
| 61 | 3 | 4.92% | 9.0 | pfp maker ai |

Two queries hold **45% of the page's impressions** (588 of 1,302) and convert at **~0.3%** — they're the anchor dragging the average down:

1. **"ai gaming profile picture generator" — 330 impr, p8.2, 0.30% CTR.** This is now the page's single biggest query (was 286 impr last cycle, still ~1 click). It **spells out** "profile picture generator" and includes "gaming" — yet the fix retitled the page to **lead with the abbreviation "AI PFP Maker."** The abbreviation-vs-spelled-out mismatch we flagged before is now working *against* the page's #1 query.
2. **"ai pfp" — 258 impr, p8.1, 0.39% CTR.** Broad head term at the bottom of page 1; likely an image-pack / AI-Overview SERP where positions 1–3 take the clicks. A title tweak won't fix a SERP-feature problem.

The narrower long-tail ("pfp maker ai" 4.92%, "pfp generator" 3.20%) clicks fine — so the page *can* convert. The ceiling is the two broad/mismatched head terms.

### Recommendation (do NOT act this cycle — flagging only)
A second blind title change is the wrong move. Before touching anything: **run an SXO / SERP-feature look** at "ai gaming profile picture generator" and "ai pfp" to see what's eating the clicks (AI Overview? image pack? brand stack?). The mismatch angle (title leads with "PFP" while the top query spells it out) is the one concrete, testable hypothesis worth holding for next cycle.

---

## Gaming-logo cluster — deferred call **VINDICATED**, tool still climbing

"gaming logo maker" head term, per page:

| Page | 07-23 pos | **07-29 pos** | Δ | Note |
|---|---|---|---|---|
| `/` (home) | 21.5 | **21.5** | flat | holding |
| `/gaming-logo-maker` (tool) | 38.3 | **31.7** | **+6.6** ↑ | still rising, untouched |
| `/gaming-logo` (landing) | 76 | **76** | — | still 1 impr — not in the fight |

The tool has now climbed **38.3 → 31.7** on top of the prior **+13.9** — two consecutive pulls of unassisted improvement. The **revisit trigger** (tool flat/worse than ~p38 for two pulls) is **NOT met.** Abandoning the consolidation was correct; the tool is fixing its own position.

Cross-query, tool vs home trade places (tool already *ahead* on "gaming logo creator": p25.7 vs p27.8). No single owner — confirms **leave the cluster alone**. Gap home↔tool narrowed from ~17 to ~10; if it converges toward p20, the eventual move is **home-vs-tool title differentiation, never `/gaming-logo`.**

---

## Other signals (no action)

- **`/logo/games/minecraft-logo-maker` is the real click engine** — 1,513 impr, 33 clicks, **2.18% CTR, p11.4** ("minecraft gaming logo" p5.0, 1.99%). Game-logo pSEO pages out-earn the head-term tools.
- **`/pfp/games/rainbow-six-siege-pfp-maker`** — 241 impr, **p6.5, 0 clicks** (grew from 217). Still the sharpest browse-vs-create SXO candidate — searchers want to *download* a siege PFP, hit a *maker*, bounce. Backlogged, unchanged.
- **`/gaming-logo-maker` CTR 0.34%** (1,487 impr, 5 clk, p39.3) — consistent with a page-3 tool; not a concern while it's climbing.

---

## Status
- Data cycle: GSC pulled, recomputed, saved (`gsc_raw.json`, this report).
- **Priority #1 verdict: CTR fix did not lift CTR; page grew on ranking/impressions instead. Do not re-tweak blindly — SXO the two head queries first.**
- **Priority #2: consolidation stays deferred — tool still self-resolving (p31.7).**
- Nothing committed to git this cycle (data/reports only).
- Next check: re-pull ~2026-08-12+ for a cleaner (less-overlapping) post-fix window.
