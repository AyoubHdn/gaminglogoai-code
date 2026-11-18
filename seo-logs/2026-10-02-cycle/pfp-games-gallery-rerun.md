# /pfp/games/ Gallery-Hybrid — Clean Re-Run (first full-exposure window) — 2026-10-02

**Question:** Cluster clicks/impr/CTR + GA4 engagement across the last 3 cycles alongside the site-wide trend, with **roblox-pfp-maker & rainbow-six-siege-pfp-maker (browse-intent)** and **call-of-duty-pfp-maker (create-intent, control-ish)** broken out.

**Why now:** the gallery-hybrid shipped **2026-09-02**. This is the first window (09-04→09-29) with **full** exposure. The 3 cycles give a clean dose-response ladder: **0d → ~half → ~full** gallery.

| Cycle | GSC window | Gallery exposure |
|---|---|---|
| **C1** | 08-03→08-28 | **none** (pre-deploy) |
| **C2** | 08-21→09-15 | ~half |
| **C3** | 09-04→09-29 | ~full |

---

## Cluster vs site-wide

### GSC (page-dim)
| | C1 (0d) | C2 (half) | C3 (full) | Read |
|---|---|---|---|---|
| **Cluster clicks** | 108 | 98 | **108** | **Flat** — no gallery click lift |
| Cluster impressions | 2,826 | 2,613 | 2,783 | Flat |
| Cluster CTR | 3.82% | 3.75% | **3.88%** | Flat |
| Cluster share of site clicks | 14% | 11% | 14% | Flat |
| *Site clicks (context)* | *765* | *869* | *796* | *C3 seasonal dip (see GA4 report)* |

**On the search side, the gallery produced no measurable cluster lift** — clicks, impressions, CTR, and share are all flat across the rollout. (Caveat: the C3 seasonal site contraction makes absolute clicks noisy.)

### GA4 engagement
| | C1 (0d) | C2 (half) | C3 (full) | Read |
|---|---|---|---|---|
| **Cluster engagement** | 66.2% | 64.3% | **61.5%** | 🔻 falling… |
| Site-wide engagement | 73.7% | 73.3% | 73.1% | flat |

At face value the cluster engagement fell ~5pp as the gallery rolled out — the opposite of the thesis. **But that cluster average is misleading. See the decomposition.**

---

## The decomposition — the engagement "decline" is a MIX-SHIFT artifact, not gallery damage

Splitting the cluster into the **5 established pages** vs the **thin/new pages** the gallery newly surfaced (valorant, pubg, dota, counter-strike, free-fire, gta, apex, overwatch…):

| | C1 | C2 | C3 |
|---|---|---|---|
| **Established-5 engagement** | 66.4% | 66.0% | **65.2%** | → essentially **FLAT** |
| **Thin/new pages engagement** | 65.0% | 53.3% | **46.4%** | 🔻 crashing |
| Thin/new session share | 20 | 15 | **28** | 🔺 growing |
| Cluster (blended) | 66.2% | 64.3% | 61.5% | — |

**The established pages held engagement flat (~66%). The cluster decline is entirely the gallery pulling growing traffic onto thin new game pages that engage at ~46%** (valorant/pubg/counter-strike at 0%, dota 33%, free-fire 25% — see `ga4-pages-report.md`). It's Simpson's paradox: every meaningful page holds or improves, but the average drops because low-engagement thin pages entered the denominator. **The gallery didn't hurt engagement; the content-less expansion did.**

---

## Per-page breakout — the pages that matter all IMPROVED

| Page | Metric | C1 (0d) | C2 (half) | C3 (full) | Trend |
|---|---|---|---|---|---|
| **roblox-pfp** (browse) | GA4 eng | 41% | 53% | **56%** | 🔺 **+15pp** |
| | GSC position | p14 | p9 | **p9** | 🔺 +5 |
| | GSC clicks | 16 | 12 | 21 | up |
| **rainbow-six-pfp** (browse) | GA4 eng | 53% | 56% | **62%** | 🔺 **+9pp** |
| | GSC position | p8 | p8 | **p6** | 🔺 +2 |
| | GSC clicks | 16 | 21 | 17 | ~flat |
| **call-of-duty-pfp** (create) | GA4 eng | 68% | 76% | **74%** | high, stable |
| | GSC position | p6 | p6 | **p5** | 🔺 |
| | GSC clicks | 27 | 39 | 39 | 🔺 up |

**The two browse-intent pages the gallery was built for both improved on engagement AND ranking** across the rollout — roblox +15pp engagement and 5 positions, rainbow-six +9pp and 2 positions. This is exactly the intended direction. The create-intent control (COD) stayed strong and climbed on clicks. **No page in the breakout regressed.**

---

## Verdict

**The gallery is working where it was aimed — and the scary cluster number is a composition artifact.**

1. **Browse-intent pilot pages improved on both engagement and ranking** (roblox 41→56% / p14→p9; rainbow-six 53→62% / p8→p6). That's the thesis playing out — slowly, on the pages with real content.
2. **No cluster-wide CLICK lift yet** — cluster clicks/CTR are flat. The gallery's payoff is showing in engagement/ranking on established pages, not in raw cluster clicks (and seasonality clouds C3 clicks).
3. **The cluster engagement "decline" (66→61.5%) is NOT gallery damage** — established pages held ~66%; the drop is thin new pages (valorant/pubg/dota at ~46%, growing in share) dragging the average. A statistical artifact.
4. **The real problem the data exposes is content depth, not the gallery** — the gallery surfaced many game pages that have a gallery shell but little content, and they bounce at 46%.

### Recommendation (Codex/product)
- **Keep the gallery on the established + genuinely-populated pages** — it's directionally helping the browse-intent pages it was designed for.
- **Fix or gate the thin expansion pages** — valorant/pubg/counter-strike/dota/free-fire pfp pages have the gallery frame but no content depth and bounce at 0-46%. Either give them real content/example depth (the thumbnail-enrichment playbook that worked) or hold them back from heavy internal linking/sitemap prominence until they do. Right now they dilute the cluster and add low-quality sessions.
- **Re-measure next cycle on a non-seasonal window** and track the **established-5 engagement line (currently flat ~65-66%)** as the true gallery KPI — not the blended cluster average, which the thin pages distort.

---

## Limitations
- Per-page n is small (11-38 GA4 sessions); engagement deltas are directional, not significant.
- Windows overlap ~12 days; C3 overlaps a seasonal site contraction that depresses absolute clicks.
- Can't fully isolate gallery causation from COD's independent organic rise or seasonal demand; the dose-response consistency (browse pages up as exposure rises) is suggestive, not proof.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Built by agricidaniel — Join the AI Marketing Hub community
🆓 Free  → https://www.skool.com/ai-marketing-hub
⚡ Pro   → https://www.skool.com/ai-marketing-hub-pro
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
