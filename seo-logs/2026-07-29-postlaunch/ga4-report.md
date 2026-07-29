# GA4 Organic Pull — gaminglogoai.com — 2026-07-29

**Property:** `490347534` (gaminglogoai — passed explicitly; config default points at the wrong site, namedesignai). **Window:** 2026-07-01 → 07-28 (28d). Report: organic traffic.

---

## Site organic totals

| Metric | 07-19 wk | **07-29 (now)** | Δ |
|---|---|---|---|
| Sessions | 821 | **840** | +19 (+2.3%) |
| Users | — | 820 | — |
| Pageviews | — | 2,182 | — |
| Engagement rate | 72% | **74.9%** | +2.9pt ✅ |
| Bounce rate | — | **25.1%** | — |

Organic essentially flat WoW after last cycle's +12.5% jump — it **held the gain** rather than giving it back, and engagement improved. Note GA4 (840) captures more than GSC clicks (137): multi-engine + returning/direct-after-discovery traffic.

---

## The #1 read GA4 adds: the page is NOT the problem — the SERP is

`/ai-profile-picture-maker` behavior:

| Sessions | Pageviews | Pv/session | Bounce | Engagement |
|---|---|---|---|---|
| **71** | 208 | **2.9** | **12.7%** | **87.3%** |

This is the **best-engaging real landing on the site** — lowest bounce (12.7%), highest engagement (87.3%), nearly 3 pages per session. **The people who click are extremely satisfied.**

Cross-referenced with today's GSC report — where this page shows **1.84% CTR** and two head queries convert at ~0.3% — the conclusion sharpens:

> **The CTR problem is entirely SERP-side (snippet / SERP features / ranking position), NOT a landing-experience problem.** Once users arrive they behave better than anywhere else on the site. A blind title re-tweak targets the wrong layer. This is the strongest evidence yet for **SXO the SERP first, don't touch the page copy.**

---

## Tool pages are healthy — reinforces "leave the gaming-logo cluster alone"

| Page | Sessions | Bounce | Engagement |
|---|---|---|---|
| `/gaming-logo-maker` (tool) | **84** | 21.4% | 78.6% |
| `/pfp-maker` (tool) | 37 | 40.5% | 59.5% |

`/gaming-logo-maker` is the **3rd-most-visited organic landing** (84 sessions) and engages well (78.6%). It's rising in GSC (p31.7) *and* pulling healthy behavior — no reason to canonical/consolidate it. Decision holds.

`/pfp-maker` is the weakest tool (40.5% bounce, 59.5% eng) — consistent with its deep GSC position (p36); not urgent.

---

## Browse-vs-create SXO mismatch — now confirmed behaviorally (again)

| Page | Sessions | Bounce | Engagement | Read |
|---|---|---|---|---|
| `/pfp/games/rainbow-six-siege-pfp-maker` | 15 | **60.0%** | **40.0%** | worst — download-intent bouncing off a maker |
| `/pfp/games/fortnite-pfp-maker` | 36 | 41.7% | 58.3% | same pattern, softer |
| `/logo/games/minecraft-logo-maker` | 135 | **15.6%** | **84.4%** | create-intent — thrives |
| `/pfp/games/call-of-duty-pfp-maker` | 41 | 17.1% | 82.9% | create-intent — thrives |

The split is intent, not quality: **logo/create pages engage 80%+; the browse-intent siege PFP page bounces 60%.** Same conclusion as prior cycles — rainbow-six is the sharpest example-gallery/SXO candidate. Backlogged, not acted.

---

## Top organic landings (28d)

| Sessions | Bounce | Eng | Page |
|---|---|---|---|
| 214 | 19.6% | 80.4% | `/` |
| 135 | 15.6% | 84.4% | `/logo/games/minecraft-logo-maker` |
| 84 | 21.4% | 78.6% | `/gaming-logo-maker` |
| 71 | 12.7% | 87.3% | `/ai-profile-picture-maker` |
| 55 | 27.3% | 72.7% | `/logo/games/call-of-duty-logo-maker` |
| 41 | 17.1% | 82.9% | `/pfp/games/call-of-duty-pfp-maker` |
| 37 | 35.1% | 64.9% | `/free-fire-logos` |
| 37 | 40.5% | 59.5% | `/pfp-maker` |

Note: `/free-fire-logos` (the non-redirected legacy landing flagged in the deferred doc) pulls 37 real organic sessions — it's a live traffic page, so its only open issue is the stale internal CTA, not the page itself.

---

## Status
- GA4 organic pulled with correct property, saved (`ga4_organic.json`, `ga4_pages.json` — the top-pages report returned empty; organic report's `top_pages` used instead).
- **Key addition to the #1 verdict: the landing experience is the site's best (12.7% bounce / 87.3% eng). The CTR gap is a SERP problem, not a page problem — SXO before any further on-page change.**
- Site organic held its +12.5% gain (840 vs 821), engagement up to 74.9%.
- Nothing committed (data/reports only).
