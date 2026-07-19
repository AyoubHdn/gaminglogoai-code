# GA4 Organic Report — gaminglogoai.com — Week of 2026-07-19

Source: GA4 Data API, **property 490347534** (gaminglogoai — verified, *not* the namedesignai config default 471548702). Report: organic_traffic. Window: **2026-06-21 → 2026-07-18** (28 days).

---

## Totals — organic up ~13% WoW

| Metric | Prev (07-12 report) | Now | Δ |
|---|---|---|---|
| Sessions | 730 | **821** | **+91 (+12.5%)** |
| Users | 707 | **799** | +92 |
| Pageviews | 1,877 | **2,109** | +232 |
| Avg daily sessions | 26.1 | **29.3** | +3.2 |

Engagement healthy: avg engagement rate **72.2%**, bounce **27.8%**, avg session duration **126s**.

> Note the divergence from GSC: GSC clicks flat (130) while GA4 organic sessions climbed +91. GSC "organic clicks" (Google Search only, 28-day trailing) and GA4 "organic sessions" (all search engines + session model) measure different things — the GA4 rise reflects returning/multi-engine organic traffic the GSC click count doesn't capture.

---

## Top organic landing pages

| Sessions | PV | Bounce | Engagement | Landing page |
|---|---|---|---|---|
| 226 | 676 | 22.6% | 77.4% | `/` |
| 131 | 350 | 18.3% | 81.7% | `/logo/games/minecraft-logo-maker` ⭐ |
| 67 | 137 | 23.9% | 76.1% | `/gaming-logo-maker` (tool) |
| 57 | 133 | 26.3% | 73.7% | `/logo/games/call-of-duty-logo-maker` |
| 52 | 101 | 40.4% | 59.6% | `/pfp/games/fortnite-pfp-maker` |
| 41 | 133 | 12.2% | **87.8%** | `/pfp/games/call-of-duty-pfp-maker` ⭐ |
| 40 | 95 | 35.0% | 65.0% | `/free-fire-logos` (orphan landing) |
| 38 | 114 | 10.5% | **89.5%** | `/ai-profile-picture-maker` ⭐ |
| 31 | 55 | 38.7% | 61.3% | `/pfp-maker` (tool) |
| 19 | 29 | **57.9%** | 42.1% | `/pfp/games/rainbow-six-siege-pfp-maker` ⚠️ |
| 18 | 73 | 16.7% | 83.3% | `/pfp/games/gears-of-war-pfp-maker` |

---

## Read

1. **`/ai-profile-picture-maker`: 89.5% engagement, 10.5% bounce** — the best-engaging real landing on the site, and GSC shows it climbing (p11.7, +245 impr). Traffic that lands here converts to engagement. **Every argument points to prioritizing this page.**
2. **`/pfp/games/call-of-duty-pfp-maker`: 87.8% engagement, 12.2% bounce** — programmatic page performing like a hand-tuned one. The pSEO template is doing its job where intent = create.
3. **`rainbow-six-siege-pfp-maker`: 57.9% bounce / 42% engagement** — the outlier, and it lines up exactly with the GSC "siege pfp" browse-intent query (52 impr, 0 clicks, p5.7). This is the **SXO browse-vs-create mismatch made visible in behavior data**: people arrive wanting to *download* a siege PFP, find a photo→avatar maker, and bounce. Same pattern as gears-of-war (though gears engages better at 83%).
4. **`/free-fire-logos` (orphaned hand-built landing) pulling 40 sessions** — still driving real traffic despite being out of the sitemap/nav. Reinforces the deferred consolidation question: don't 301 it away blindly; it's earning.
5. **`/pfp-maker` tool: 38.7% bounce** — middling. The identity fix is helping search position (GSC p53→44) but the tool page itself still under-engages vs the landing.

---

## Next actions (unchanged priority from GSC)

- **#1: Push `/ai-profile-picture-maker`** — best engagement + climbing rankings + idle high-impression queries. Single highest-ROI move.
- **#2: The signal step** for the gaming-logo cluster (601-impr head term stuck at p29).
- **Watch:** rainbow-six / gears browse-intent bounce — candidate for an example-gallery/SXO treatment, not a title fix.
