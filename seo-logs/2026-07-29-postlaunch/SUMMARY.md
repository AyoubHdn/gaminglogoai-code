# Weekly SEO Summary — gaminglogoai.com — Post-Launch Cycle 2026-07-29

Companion files in this folder: `gsc-report.md`, `ga4-report.md`, `drift-report.md`, `sxo-ai-pfp-maker.md`, `images-ai-pfp-maker.md` (+ raw JSON). Prior cycle: `../2026-07-23-week/`.

**Context:** First cycle with **measurable post-deploy data** on the Priority #1 CTR fix (`/ai-profile-picture-maker`, deployed 2026-07-19). Window has ~7 clean post-deploy days — enough for an early verdict.

---

## Headline

**The #1 CTR fix did not lift CTR — but the page isn't broken. It's the best-engaging landing on the site (12.7% bounce / 87.3% eng), correctly typed, and page 1. Its click ceiling is a SERP problem: position 8 in an image-heavy SERP, on a snippet aimed at the wrong query. The winnable term is *gaming* PFP, not broad "ai pfp." No blind re-tweak — one measured title test next cycle, two bug fixes now.**

---

## The five pulls at a glance

| Source | Result | One-line read |
|---|---|---|
| **GSC** (28d, 07-01→07-26) | Site 137 clk / 11,969 impr / 1.14% CTR / pos 23.4 | Flat w/ roll; position creeping up |
| **GA4 organic** (28d, 07-01→07-28) | Sessions **840** (held +12.5% gain), 74.9% eng | Growth held; best page = `/ai-profile-picture-maker` |
| **Drift** (homepage vs baseline #7) | 0 critical, 2 warning (perf), 1 info | No SEO regression; LCP lab spike needs field confirm |
| **SXO** (`/ai-profile-picture-maker`) | Page-type ALIGNED; Gap 69/100 | CTR gap = rank + snippet, not page or type |
| **Images** (same page) | Hygiene good; 1 broken hero (404) | Old bug; OG≠SERP thumbnail; content imgs already good |

---

## Priority #1 verdict — CTR fix did NOT move CTR; clicks grew on ranking instead

`/ai-profile-picture-maker`, three cycles:

| | pre-fix (07-23) | **now (7d post)** |
|---|---|---|
| Impressions | 989 | **1,302** |
| Clicks | 19 | **24** |
| Position | 10.5 | **9.8** |
| **CTR** | **1.92%** | **1.84%** ⬇ |

Clicks +26%, but from position + impressions, **not** click-rate. On its stated target (CTR → 4–5%) the fix failed. **SXO + GA4 explain why and reframe it:**

- **GA4:** the page is the **best-engaging landing on the site** (12.7% bounce / 87.3% eng). People who click are maximally satisfied → the problem is **SERP-side, not the page.**
- **SXO:** two head queries are two *different* problems:
  - **"ai gaming profile picture generator" (330 impr, p8.2, 0.30%) — WINNABLE.** Page-type aligned (all competitors are makers), intent matched (gaming). Held back only by **position 8** in an **image-heavy SERP** where our result is a text-only link.
  - **"ai pfp" (258 impr, p8.1, 0.39%) — STRUCTURAL width mismatch.** Broad query, general-PFP SERP; we're gaming-niche. Low CTR is expected — not our users.
- **The miss:** the fix leaned the title into **"AI PFP Maker"** (the broad term we can't win) instead of **gaming** (the term we can). That's the correction to test — but **not this cycle** (last edit only 10 days measured; don't stack changes).

---

## Priority #2 — gaming-logo cluster: still DEFERRED, decision vindicated

The tool kept climbing untouched: "gaming logo maker" tool position **38.3 → 31.7** (after +13.9 the prior cycle). Two consecutive pulls of unassisted improvement; revisit trigger (flat/worse than ~p38) **not met**. GA4 confirms health: `/gaming-logo-maker` is the **3rd-most-visited landing** (84 sessions, 78.6% eng). **Leave it alone.** Full rationale: `../2026-07-23-week/gaming-logo-consolidation-DEFERRED.md`.

---

## Priority Stack

| # | Move | Status | Why |
|---|---|---|---|
| **1** | **Test a gaming-led title** on `/ai-profile-picture-maker` (e.g. lead with "Gaming PFP Maker") | ⏳ **HOLD ~1 cycle** | Last edit only 10 days measured; the winnable term is gaming, not broad "ai pfp" — but don't stack changes |
| **2** | **Fix the 404 hero** (`pfp-hero-bg.webp`) | ✅ **DOING NOW** | Bug, not experiment. ~13-month-old broken asset + wasted priority fetch |
| **3** | **Confirm the LCP spike** via CrUX/PageSpeed field data | ⏳ **NEXT** | Drift lab LCP 2.3s→6.8s is one noisy run; verify before any perf work |
| **4** | **Free-fire stale CTA** (`/gaming-logo-maker` → studio) | ✅ **ALREADY FIXED** on this branch by the studio migration; comment tidied | Bug. Live on prod until this branch ships |
| **5** | Gaming-logo consolidation | ⛔ **DEFERRED** | Tool self-resolving (p31.7) |
| **6** | Rainbow-six PFP example-gallery (browse-vs-create) | 📋 **BACKLOG** | 241 impr/p6.5/0 clicks (GSC) + 60% bounce (GA4) — sharpest SXO candidate |

---

## Standalone findings (from this cycle's audits)

1. **404 hero background** — `ai-profile-picture-maker.tsx:232` → `/images/pfp-hero-bg.webp` never committed (~13mo 404). **Fixing now** (repoint to existing `/images/home-hero-bg.webp`). NOT the LCP-spike cause (predates baseline).
2. **OG image ≠ Google SERP thumbnail** — corrects the SXO "visual result" action. OG drives social cards only; the page's *content* images (good alt, WebP, relevant) are what feed the image pack, and they're already fine. Optional upside: add `ImageObject` schema + descriptive S3 filenames (`f4.webp` → `cartoon-gaming-pfp-example.webp`).
3. **Deploy gap** — production (main) still runs the pre-studio code: stale free-fire CTA + no `/studio`. The `phase-9-emote-polish` branch (this one) fixes the free-fire CTA but is 9 commits / +11k lines unmerged. Bug fixes made here reach prod only when this branch ships.

---

## Status
- Post-launch data cycle: ✅ complete (GSC + GA4 + drift + SXO + images).
- **#1 verdict: CTR fix ineffective as a CTR play; page healthy; SERP-position + snippet-target are the real levers. Gaming-led title = the one measured test, held to next cycle.**
- **#2: consolidation stays deferred; tool self-resolving.**
- Baseline #7 still valid (no SEO regression).
- Two bug fixes applied this cycle (hero 404 + free-fire comment); see build confirmation.
- Next check: re-pull GSC ~2026-08-12+ (cleaner post-fix window) + CrUX field data for the LCP question.
