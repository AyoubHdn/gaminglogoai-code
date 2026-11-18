# GSC Report — gaminglogoai.com — Cycle 2026-09-18

**Property:** `sc-domain:gaminglogoai.com` · **Window:** 2026-08-21 → 2026-09-15 (26 days)
**Prior cycle:** `../2026-08-31-cycle/gsc-report.md` (08-03→08-28). Windows overlap ~8 days → deltas directional.
**Raw:** `gsc_queries.json` (query dim, 973 rows) · `gsc_pages.json` (page dim, 43 rows) · `gsc_query_page.json` (query×page, 1,211 rows) · `gsc_country.json`

---

## ⚠️ Methodology correction (important — restates the site's real size)

**Prior cycles reported the query-dimension summed total as "site clicks." That undercounts by ~4×** because GSC drops anonymized (rare/long-tail) queries from the query dimension. The **page dimension does not anonymize**, so its sum is the true organic total:

| Basis | Clicks | Impressions | CTR | Impr-wtd pos |
|---|---|---|---|---|
| **Page dim (TRUE site total)** | **869** | **27,617** | **3.15%** | **16.9** |
| Query dim (visible queries only) | 217 | 12,443 | 1.74% | 20.0 |

**The page-dim total (869 clicks) reconciles with GA4** (~976 organic sessions last cycle) — the two finally line up. The old query-dim figure (198 last cycle) never did. **Going forward the page-dim sum is the headline site total; query-dim stays for query-level analysis only.** On the consistent query-dim basis, this cycle vs last: **clicks 198 → 217 (+9.6%), impressions 13,939 → 12,443 (−10.7%), CTR 1.42% → 1.74%, position 24.0 → 20.0** — clicks and efficiency up, raw impressions down slightly, average position improved 4 spots.

---

## Headline

**The site is ~4× larger in real clicks than prior reports implied (869/26d, matching GA4). Two big movements this cycle: (1) the enriched `/youtube-thumbnail-maker` page broke through — 244 impr / 10 clicks / p9.9, up from ~15 impr / 0 clicks / p30-39 — the FIX 2 enrichment converted; (2) the `/gaming-logo-maker` watch trigger is now TRIPPED for a 2nd consecutive cycle — the dedicated page sits at p60 on its head term while the homepage takes it at p19, so consolidation should be reopened. PFP "ai pfp / pfp generator" thesis holds a 4th cycle. FR + DE "gaming logo" demand grew to 2,700+ combined impressions with near-zero clicks.**

---

## Watch items — resolutions

### ✅ RESOLVED (positive) — `/youtube-thumbnail-maker` broke through after enrichment
| Cycle | Impr | Clicks | Blended pos |
|---|---|---|---|
| 2026-08-18 | 7 | 0 | p30-39 |
| 2026-08-31 | 15 | 0 | p30-39 |
| **2026-09-18** | **244** | **10** | **p9.9** |

The page went from invisible-and-pre-click to **page-1 blended with its first 10 clicks**. Most of the 244 impressions come from anonymized long-tail (only 25 impr are visible in query×page: "thumbnail maker for gaming videos" p21.6, "gaming thumbnail maker" p26.8, "youtube gaming thumbnail maker" p8.5) — but the page-dim total (authoritative) is unambiguous: **244 impr, 10 clicks, p9.9.** This is the clearest evidence yet that the FIX 2 content enrichment worked; the effect was gradual (per the minecraft inflection finding) and has now landed. `/thumbnail-maker` remains 0 rows — the canonical consolidation still holds. **Close this watch as a win.**

### 🔴 TRIGGER TRIPPED (2nd cycle) — `/gaming-logo-maker` buried; reopen consolidation
Decomposing **"gaming logo maker"** (618 impr, blended p21.5) by page:

| Page | Position | Impr | Clicks |
|---|---|---|---|
| **Homepage `/`** | **p19.3** | 585 | 2 |
| **`/gaming-logo-maker`** (dedicated tool) | **p60.3** | 125 | 0 |
| `/logo/games/minecraft-logo-maker` | p8.5 | 2 | 0 |

Page-aggregate for `/gaming-logo-maker`: **p54 → p51.5** (marginal), but on the actual head term it **worsened p59.5 → p60.3**. My stated revisit trigger was *"if still ≥~p45 next pull, the leave-it-alone call is void and consolidation should be reconsidered."* It is now **≥p45 for the second consecutive cycle** — trigger tripped. The homepage has decisively won the head term; the dedicated page is not recovering. The page still earns **10 total clicks** on long-tail (so it isn't dead), but it will not win "gaming logo maker" while the homepage outranks it 40 positions. **Recommendation: reopen the consolidation decision — pick which URL should own the head term and formalize it (Codex/product).** URL Inspection last cycle already confirmed this is a real ranking loss, not technical (self-canonical, Google not overriding).

### 🌍 GROWING — FR + DE "gaming logo" i18n demand
| Country | Clicks | Impr | CTR | Pos | vs last cycle |
|---|---|---|---|---|---|
| **DEU** | 27 | **2,155** | 1.25% | p23.6 | 🔺 grew notably |
| **FRA** | 10 | **543** | 1.84% | p26.2 | 🔺 grew |

**Combined 2,700+ impressions, all p18-48, essentially zero clicks.** The queries are unambiguous localized create-intent:
- **DE:** `gaming logo creator` (155 impr, p18.7), `gaming logo erstellen` (126, p31.9), `gaming logo maker kostenlos` (86, p31.7), `gaming logo maker` (79, p16.0), `gaming logo erstellen kostenlos` (64), `free gaming logo maker` (63).
- **FR:** `creer un logo gaming` (57, p47.9), `créateur de logo gaming` (57, p48.5), `logo maker gaming` (57, p24.7), `créer logo gaming` (51, p43.7), `logo gaming gratuit` (20).

The English page ranks p16-48 in these markets on English+localized queries but converts ~nothing because there's no localized landing content. **This is a real, scaled, untapped market (DE especially) — localized `gaming-logo-maker` pages / hreflang is the lever (Codex backlog).**

---

## PFP thesis — CONFIRMED 4th consecutive cycle

The broad "ai pfp" terms win; the "gaming" PFP term stays dead. With the title untouched:

| Query | Position | Clicks | CTR |
|---|---|---|---|
| `pfp generator` | p12.2 | **10** | 5.68% |
| `ai pfp maker` | p8.9 | 7 | 2.56% |
| `ai pfp` | p8.4 | 3 | 1.36% |
| `ai pfp generator` | p9.6 | 2 | 1.53% |
| `ai gaming profile picture generator` | **p23.2** | 1 | **0.25%** (395 impr) |

`pfp generator` is now the PFP page's best converter (10 clicks, 5.68% CTR). The gaming-specific head query drew **395 impressions and 1 click** — the highest-volume proof yet that "gaming" is the wrong PFP target. **Decision to hold the title stays closed.**

---

## Head-term landscape — the "gaming logo maker" cluster is the biggest 0-click pathology

Top queries by **impressions** (visibility the site isn't converting):

| Query | Impr | Clicks | CTR | Pos |
|---|---|---|---|---|
| gaming logo maker | 618 | 2 | 0.32% | p21.5 |
| gaming logo | 514 | 0 | 0.00% | p29.1 |
| ai gaming profile picture generator | 395 | 1 | 0.25% | p23.2 |
| gaming logo creator | 240 | 0 | 0.00% | p26.5 |
| logo maker gaming | 227 | 0 | 0.00% | p21.8 |
| gaming logo maker free | 224 | 1 | 0.45% | p28.5 |

**The "gaming logo maker / gaming logo / gaming logo creator" family = ~1,800 impressions at p21-29 with ~3 total clicks.** This is where the biggest raw-impression volume sits, and the site ranks just off page 2 — never quite breaking in. It's the same story as the `/gaming-logo-maker` watch: the site has the demand and the near-miss position, but the head term is split between homepage (p19-29) and a buried dedicated page (p60), so neither ranks well enough to convert. Winning this cluster (via consolidation + authority to one strong URL) is the single largest logo-side opportunity.

## Top queries by clicks (what actually converts)

| Query | Clicks | Impr | CTR | Pos |
|---|---|---|---|---|
| gaming logo ai | 19 | 71 | 26.76% | p4.4 |
| gaminglogoai (brand) | 19 | 34 | 55.88% | p1.0 |
| pfp generator | 10 | 176 | 5.68% | p12.2 |
| ai gaming logo | 8 | 71 | 11.27% | p4.8 |
| minecraft smp logo maker | 8 | 98 | 8.16% | p8.6 |
| ai pfp maker | 7 | 273 | 2.56% | p8.9 |
| minecraft logo maker | 7 | 94 | 7.45% | p16.0 |
| roblox logo generator | 5 | 176 | 2.84% | p7.4 |
| kawaii pfp maker | 4 | 29 | 13.79% | p5.2 |

`gaming logo ai` (p4.4, 26.76% CTR) remains the #1 non-brand click driver — where the site ranks top-5 it converts extremely well. The pattern is consistent: **the site converts strongly at p1-8 and bleeds impressions at p20-30.** The whole logo opportunity is moving the "gaming logo maker/creator" family from p21-29 into the top 8 where the site already proves it converts.

---

## Status & next
- ✅ **True site total restated: 869 clicks / 27,617 impr / 26 days** (page-dim), reconciling with GA4. Query-dim basis up +9.6% clicks, position 24→20.
- ✅ **`/youtube-thumbnail-maker` watch CLOSED as a win** — enrichment converted (0→10 clicks, p30s→p9.9).
- 🔴 **`/gaming-logo-maker` trigger tripped 2nd cycle** (p60 head term vs homepage p19) → reopen consolidation decision (Codex/product).
- ✅ **PFP thesis holds 4th cycle** — broad "ai pfp / pfp generator" win; "gaming pfp" term drew 395 impr / 1 click.
- 🌍 **FR+DE demand grew to 2,700+ impr, ~0 clicks** — localized gaming-logo pages / hreflang (backlog).
- 🎯 **Biggest raw opportunity:** the "gaming logo maker/creator/free" family (~1,800 impr at p21-29) — win it by consolidating to one strong URL.
- Next in cycle: GA4, GA4-pages, drift compare, then combined SUMMARY.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Built by agricidaniel — Join the AI Marketing Hub community
🆓 Free  → https://www.skool.com/ai-marketing-hub
⚡ Pro   → https://www.skool.com/ai-marketing-hub-pro
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
