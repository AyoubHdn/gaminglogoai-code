# Weekly SEO Summary — gaminglogoai.com — Week of 2026-07-19

Data cycle for the week. Companion files in this folder: `gsc-report.md`, `ga4-report.md`, `ga4-pages-report.md`, `drift-report.md` (+ raw JSON). Prior cycle: `../2026-07-12-week4/`.

**Context:** This is the **first measurement week after** last cycle's on-page fixes (2026-07-12): landing-page titles/H1/schema, the `/pfp-maker` identity fix, and the PFP-lead template edits to `/pfp/styles|seasonal|themes`. Google had only ~4 days inside the GSC window to reflect them, so treat rankings as *early leading indicators*.

---

## Headline

**Organic traffic up +12.5% WoW; on-page fixes are working (idle landings now ranking); homepage stable with zero regressions. The two highest-ROI moves are now confirmed by all four data sources.**

---

## The four pulls at a glance

| Source | Result | One-line read |
|---|---|---|
| **GSC** (28d, 06-21→07-16) | Clicks 130 (−3), impr 12,086 (−128), pos 24.8 (flat) | Site flat; **page-level redistribution** — edited landings moved 0→ranking |
| **GA4 organic** (28d, 06-21→07-18) | Sessions **821 (+91, +12.5%)**, 72% engagement | Real growth GSC clicks don't capture (multi-engine + returning) |
| **GA4 pages** (long-tail) | Create-intent 74–90% eng · browse-intent 20–42% eng | Template excellent; losses are intent-match, not technical |
| **Drift** (homepage vs baseline #7) | 0 critical, 0 warning, perf 96→97 | No regressions; homepage untouched & stable |

---

## What moved (our 2026-07-12 fixes, early signals)

| Page | Signal | Verdict |
|---|---|---|
| `/gaming-logo` (landing) | impr **0 → 17**, now ranking (p47) | ✅ Was fully idle — title/H1/breadcrumb woke it up |
| `/twitch-banner-maker` (landing) | impr **0 → 29** | ✅ FAQ+title got it crawled & ranking |
| `/pfp-maker` (tool) | pos **53 → 44** (+9) | ✅ Identity fix pulling it out of logo/PFP confusion |
| `/twitch-banner-generator` (tool) | impr **101 → 67** | ✅ Losing share to its landing — desired cluster direction |
| `/ai-profile-picture-maker` | impr 582→**827**, clicks 8→**14**, pos 13.4→**11.7** | ✅ Best mover; not heavily edited — momentum |
| `/pfp/styles/kawaii-avatar-maker` | first click (0→1), pos 9.3→8.4 | 🟡 Too new to judge PFP-lead title (4 days) |
| `/pfp/games/gears-of-war-pfp-maker` | impr 296→241, clicks flat | ⚪ Deliberately not retitled (browse intent) |

**Through-line:** every landing we touched went from *idle* to *ranking*, and both cannibalization pairs (gaming-logo, twitch-banner) are shifting impressions toward the intended page. Positions still deep (p44–52) — 4-day-old changes on low-authority pages need 2–3 more weeks.

---

## Key findings

1. **Biggest untapped term: `gaming logo maker` — 601 impressions at p29, 3 clicks.** Stuck on page 3 *because* home / `/gaming-logo` / `/gaming-logo-maker` split the signal. This is the concrete business case for the **signal step**.
2. **`/ai-profile-picture-maker` is the standout page** — triple-confirmed: GSC climbing (p11.7, +245 impr), GA4 **89.5% engagement / 10.5% bounce** (best real landing), idle high-impression queries ("ai pfp" 145 impr, "ai pfp maker" 110 impr).
3. **SXO browse-vs-create mismatch is recurring, now visible in behavior.** `rainbow-six-siege-pfp-maker` (42% eng) and `resident-evil-pfp-maker` (20% eng, new this week) — searchers want to *download* a PFP, find a *maker*, bounce. Not a title fix.
4. **kawaii flag:** ranks well (p8.4) but 25% engagement — possible deeper intent gap (Picrew-style creator expected). Sample too small (4 sess); watch, don't act.
5. **Homepage −364 impr in GSC** — position steady, likely query reshuffle not regression (drift confirms homepage clean). No action.

---

## Priorities (unchanged, now heavily evidenced)

| # | Move | Why | Effort |
|---|---|---|---|
| **1** ✅ | **Push `/ai-profile-picture-maker`** — CTR-focused on-page rewrite | Highest ROI: climbing + best engagement + 255 idle page-1 impressions | Low |
| **2** ⛔ | ~~**Gaming-logo signal step**~~ — **DEFERRED 2026-07-23**, see below | Premise invalidated by per-page GSC data | — |
| 3 (backlog) | **SXO example-gallery** for browse-intent `/pfp/games/*` (rainbow-six, resident-evil, gears) | Serve "show me a PFP" intent; behavior-data-confirmed | Medium |
| 4 (watch) | kawaii intent gap; homepage impression dip | Insufficient signal to act | — |

### Priority #1 — DONE (2026-07-19, on-page; deploy pending on user's side)
Deep-dive: `page-audits.md`. Diagnosis was **CTR, not ranking** (page 1 p8–11 at only 1.7% CTR). Applied on-page to `src/pages/ai-profile-picture-maker.tsx` — 6 changes, build clean, **no canonical/URL/sitemap/redirect/noindex touched**:
1. **Title** → `AI PFP Maker — Free Gaming Profile Picture Generator | GamingLogoAI`
2. **Meta** → leads with "Free AI PFP maker…"
3. **H1** → `The Ultimate AI PFP Maker`
4. **BreadcrumbList** JSON-LD added (Home → AI PFP Maker)
5. **FAQ #3** swapped off the logo tangent → Discord/Twitch/YouTube sizing question (pure PFP framing)
6. **og:title + twitter:title + SoftwareApplication `name`/`description`** all synced to "AI PFP Maker"

Rationale: the whole site already links to this page as **"AI PFP Maker"** (Header/Footer/breadcrumb anchors) while the page titled itself "Profile Picture Maker" — title now matches both the top query *and* the inbound anchor text, plus a "Free" CTR hook.
**Target:** CTR 1.7% → ~4–5% on ~827 page-1 impressions (≈33–41 clicks vs 14) with no ranking change required.
**Next check:** re-pull GSC in 1–2 weeks (after deploy) and compare CTR for this page's query cluster.

### Priority #2 — DEFERRED (2026-07-23, not shipped)
Full write-up: `../2026-07-23-week/gaming-logo-consolidation-DEFERRED.md`. Built on branch `seo/gaming-logo-consolidation`, then **abandoned and the branch deleted** — nothing merged.

The 2026-07-23 GSC pull split the head term **per page** for the first time and invalidated the premise. This summary's "601 impr at p29" was an aggregate that hid the real structure:

| Page | Impr | Position |
|---|---|---|
| `/` (home) | 451 | **21.5** |
| `/gaming-logo-maker` (tool) | 202 | 38.3 → **+13.9 in 4 days, untouched** |
| `/gaming-logo` (landing) | **1** | 76 |

`/gaming-logo` is **not** the cannibalization party — it holds 1 impression. The split is **home vs. tool**, and the tool is climbing hard on its own. Canonicalising a rising page to a dormant one would have destroyed momentum for nothing. **Cluster left alone this cycle.** Revisit only if the tool stalls (trigger conditions in the deferred doc).

---

## Status
- **Weekly data cycle:** ✅ complete (GSC + GA4 + GA4-pages + drift all pulled, reported, saved).
- **Baseline #7:** still valid — no new baseline needed.
- **Nothing committed to git** this cycle (data/reports only).
- **Deferred (not executed):** the signal-step consolidation from week4 Part 4 remains the main open work item — and this week's GSC data (601-impr term at p29) is the strongest case yet for doing it.
