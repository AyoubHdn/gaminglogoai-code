# /pfp/games/ Gallery-Hybrid — Early Read — 2026-09-18

**Question:** Cluster-level clicks/impr/CTR/engagement this cycle vs last, with **apex-legends-pfp-maker (control) vs the ~34 gallery pages** broken out. Did the gallery pages gain clicks while Apex stayed flat?

**Deployment fact (decisive for interpretation):** the broad gallery-hybrid ("hybrid pfp content" commit) shipped **2026-09-02**. The 08-18 commit was only the 2-page pilot (gears-of-war, rainbow-six). So:
- **This GSC window (08-21→09-15):** gallery live for only **~13 of 26 days** (09-02→09-15).
- **Prior window (08-03→08-28):** gallery live **0 days** (broad); pilot pages live for the last ~10 days.
- Google recrawl/rerank lag means even those 13 days are only *partially* reflected. **This is an early, partial-exposure read, not a clean before/after.**

---

## Cluster-level — GSC (page dimension) & GA4

| Metric | Prior (0d gallery) | This (~13d gallery) | Δ |
|---|---|---|---|
| **GSC cluster clicks** | 108 | **98** | **−9%** |
| GSC cluster impressions | 2,826 | 2,613 | −8% |
| GSC cluster CTR | 3.82% | 3.75% | ~flat |
| GSC cluster impr-wtd position | 9.7 | **7.4** | 🔺 improved 2.3 |
| **GA4 cluster sessions** | 133 | **115** | **−14%** |
| GA4 cluster engagement | 66.2% | **64.3%** | **−1.9pp** |
| GA4 cluster bounce | 33.8% | 35.7% | +1.9pp |

**Cluster read: clicks, sessions and engagement all dipped slightly; only average position improved.** The dip is within normal cycle noise and is dominated by one page (roblox impressions halved, 609→278). Crucially, **engagement — the gallery's whole thesis (lift browse-intent stickiness) — did NOT improve; it fell ~2pp.**

---

## Apex (control) vs Gallery — the control is uninformative

| Segment | Prior clicks | This clicks | Prior GA4 sess / eng | This GA4 sess / eng |
|---|---|---|---|---|
| **Apex (control)** | **0** | **0** | 1 / 100% | 1 / 100% |
| **Gallery (rest)** | 108 | 98 | 132 / 65.9% | 114 / 64.0% |

**Apex is below GSC's reporting floor (0 clicks, 0 impressions) in both cycles and has 1 GA4 session** — it is effectively invisible. "Apex stayed flat" is trivially true but **useless as a control: it cannot go lower than ~zero, so it can't detect whether the gallery moved anything.** A page with no traffic is not a valid A/B control against pages with traffic. The better reference is the cluster's own position trend (improved) and the site trend (up).

---

## Per-page — where the movement actually is (mixed, not a clean lift)

| Page | Prior clk/impr/pos | This clk/impr/pos | Clicks Δ | Note |
|---|---|---|---|---|
| **call-of-duty** | 27 / 432 / p6 | **39 / 668 / p6** | **+12** ✅ | Biggest gainer — but COD surged org-wide (logo too); not cleanly gallery-attributable |
| **rainbow-six** [pilot] | 16 / 478 / p8 | **21 / 435 / p8** | **+5** ✅ | Pilot page, fully exposed — modest gain |
| roblox | 16 / 609 / p14 | 12 / 278 / **p9** | −4 | Impressions halved (drives most of the cluster dip); position improved 5 spots |
| fortnite | 24 / 705 / p12 | 14 / 675 / **p10** | −10 | Clicks down, position up — impression/CTR noise |
| **gears-of-war** [pilot] | 25 / 602 / p6 | **12 / 541 / p5** | **−13** ❌ | Pilot page, fully exposed — clicks fell though position *improved* p6→p5 |

**The two fully-exposed PILOT pages split:** rainbow-six +5, gears-of-war −13. Both held or improved position, so gears' click drop is not a ranking loss — it's CTR/impression variance. There is **no consistent gallery signature** across the pilot pair.

---

## Answer

**No — the gallery pages did not gain clicks while Apex stayed flat. There is no detectable gallery lift yet, and Apex is not a usable control.**

1. **The measurable gallery cluster dipped, not gained** — clicks −9%, sessions −14%, engagement −1.9pp. The one metric that improved (position, 9.7→7.4) tracks broader momentum (COD), not a gallery-specific pattern.
2. **Apex "flat" is meaningless** — it's invisible (0 GSC clicks, 1 GA4 session) in both cycles; you can't measure a lift against a page with no traffic.
3. **Engagement is the thesis-relevant metric and it went the wrong way** (66.2→64.3%) — but on small n and half-window exposure.
4. **This is far too early.** Broad gallery live only since 09-02 (half the window); Google rerank lag; the two fully-exposed pilot pages themselves split. **A clean verdict needs the next full cycle** (a 30-day window entirely after 09-02).

**Recommendation:** don't judge the gallery on this cycle. Re-run this exact split next cycle (~2026-10-12), when the window is fully post-deployment, using **the cluster's position/engagement trend vs the site** as the reference — not Apex, which is too small to serve as a control. If cluster **engagement** hasn't risen above ~66% with a full window of exposure, the browse-first thesis is not converting and should be reconsidered. Also worth isolating: **roblox's impression halving** (609→278) is doing most of the visible damage and deserves its own look next cycle.

---

## Limitations
- GSC page-dim only surfaces pages above its reporting floor: only **~6-8 of the ~34 gallery pages** are individually measurable; the rest have negligible traffic (the same near-invisibility seen in the styles/themes analysis). Cluster totals here reflect the measurable pages.
- Windows overlap ~8 days; deltas are directional.
- Gallery exposure is ~half this window; effects are lagged and incomplete.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Built by agricidaniel — Join the AI Marketing Hub community
🆓 Free  → https://www.skool.com/ai-marketing-hub
⚡ Pro   → https://www.skool.com/ai-marketing-hub-pro
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
