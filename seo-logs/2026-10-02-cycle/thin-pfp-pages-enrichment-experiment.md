# Thin /pfp/games/ Pages — Enrichment Experiment Design — 2026-10-02

**Goal:** enrich thin pages, hold matched pages as controls, to test whether the thumbnail-enrichment playbook lifts content-less gallery pages into indexing/impressions.

**Data:** GA4 top-pages (09-04→10-01) + GSC page-dim & query×page, **last 30 days (2026-09-02→10-01)**.

---

## 🔒 LOCKED EXPERIMENT ARMS (as implemented 2026-10-02)

| Arm | Pages | pseoContent status |
|---|---|---|
| **ENRICH** | **dota**, **valorant**, **free-fire** | ✅ enriched entries added (uncommitted, for Codex) |
| **CONTROL** | **counter-strike**, **pubg** | ⛔ NO content added — held as-is |

- Enrich entries add only `heroIntro`/`articleSections`/`faqs`/`relatedLinks`/`suppressFaqSchema` — no metaTitle/metaDescription, no FAQPage JSON-LD, no template/canonical changes.
- **No enrich-arm entry links to a control page** (verified: free-fire's original PUBG relatedLink was swapped to Fortnite precisely to avoid passing equity to a control; dota & valorant link to non-control pages only).
- Controls still need the **discovery fixes** (counter-strike sitemap bug; indexed-hub internal links) to become crawlable — those are *not* content enrichment and don't contaminate the content test; they're the baseline that lets the control pages be measurable at all.
- **This supersedes the pre-inspection "Recommended split" table further below**, which was written before URL Inspection revealed the pages were unindexed.

---

## All thin /pfp/games/ pages that get traffic (<50% engagement + the low-session tail)

| Page | GA4 sessions | GA4 eng | GSC impr | GSC clicks | GSC position | Notes |
|---|---|---|---|---|---|---|
| **dota** | 6 | 33.3% | **122** | 8 | **p5.0** | ⭐ Only thin page that already RANKS (p5) — has demand, poor conversion |
| **free-fire** | 4 | 25.0% | ≈0 | 0 | — | Below GSC floor |
| **counter-strike** | 2 | 0% | ≈0 | 0 | — | Huge game demand, zero visibility |
| **cod** (`/cod-pfp-maker`) | 2 | 0% | ≈0 | 0 | — | ⚠️ **DUPLICATE of `call-of-duty-pfp-maker`** — see below |
| **pubg** | 1 | 0% | ≈0 | 0 | — | Huge game demand, zero visibility |
| **valorant** | 1 | 0% | ≈0 | 0 | — | Huge game demand, zero visibility |

(For reference, the *established* pages sit far above: call-of-duty 38s/73.7%/p5.3, roblox 25s/56%/p8.8, rainbow-six 21s/62%/p6.2, gears 20s/65%/p5.1, fortnite 11s/64%/p9.0.)

---

## ⚠️ Finding first: `cod-pfp-maker` is a duplicate — consolidate, don't enrich

`/pfp/games/cod-pfp-maker` (2s/0%) and `/pfp/games/call-of-duty-pfp-maker` (38s/73.7%) target the **same game**. This is a slug duplication, not an enrichment candidate — enriching it would deepen cannibalization. **Recommend Codex canonical/redirect `cod-pfp-maker` → `call-of-duty-pfp-maker`** (same pattern as the gaming-logo-maker fix). Excluding it leaves **exactly 5 clean thin pages** for the 3/2 split.

---

## 🛑 UPDATE (URL Inspection, 2026-10-02) — these pages aren't indexed; discovery must be fixed BEFORE enrichment

URL-inspecting the four candidates changes the premise. **None has ever been crawled** (`last_crawl_time: null`, no canonical):

| Page | Coverage | In sitemap? | Internal links (Google-found) | Blocker |
|---|---|---|---|---|
| **counter-strike** | URL unknown to Google | ❌ **NO** | 0 | **Orphaned** — no sitemap entry, no links; Google can't find it |
| **pubg** | URL unknown to Google | ✅ | 0 | Sitemap-only; not yet crawled; no reinforcing links |
| **valorant** | Discovered – not indexed | ✅ | 3 (gears-of-war, rainbow-six, fortnite) | Crawled-eligible but declined — thin content + weak links |
| **free-fire** | Discovered – not indexed | ✅ | 2 | Same |

**Why links are sparse:** internal linking is a rotating 6-item "related games" window (`getStaticRelatedItems`), so inbound links depend on list position — and these newly-added games are only pointed to by *other thin/unindexed pfp pages*. **No links from indexed hubs** (homepage, minecraft-logo, a games index); equity from an unindexed page ≈ 0.

**Implication — sequence discovery before content:**
- **valorant & free-fire** are already *discovered* → enrichment is a valid lever (Google saw them, declined; better content can earn indexing). **Keep as the enrichment test.**
- **counter-strike & pubg** are *unknown/never-crawled* → enriching them does nothing until Google can reach them. **Fix discovery first:** (1) add counter-strike to the sitemap — it's the only one of the 34+ games missing (a bug); (2) add internal links to all four from **indexed** pages.

**Revised experiment:** enrich **valorant + free-fire + dota** (all discovered/indexed-eligible, enrichment can act); hold **counter-strike + pubg** as controls — but their first fix is *discovery*, not content, so they also serve as the "does discovery alone (sitemap+links) get them indexed?" control. Measure: do the enriched pages get *indexed and earn impressions* faster than the discovery-only controls?

---

## ⚠️ Power caveat — read this before trusting any single-page result

Five of the six pages have **≈0 GSC impressions and 1-4 GA4 sessions**. At that volume:
- **GA4 engagement is NOT a usable outcome metric** — a 1-session page reading "0%" or "100%" is literally one visitor. Matching controls on engagement is meaningless here.
- **The right matching variable and outcome metric is GSC impressions / clicks / position** — that's the leading indicator enrichment actually moves (thumbnail went 0→244 impr; minecraft similar). Enrichment's first job on a floor-bound page is to *earn impressions and rank*, which precedes any engagement read by weeks.
- Treat this as a **directional lift test on GSC visibility**, not a powered engagement A/B. Engagement becomes readable only after sessions accumulate (next 1-2 cycles).

---

## Recommended split (matched on traffic tier + intrinsic game demand)

The 5 pages fall into two natural tiers. I split each tier across arms so controls are comparable to enriched:

| Arm | Page | Why |
|---|---|---|
| **ENRICH** | **dota** | Tier-1 (6s, **122 impr, p5**). Already ranks but 33% eng + thin — the highest-confidence win (exact thumbnail setup: demand + rank, needs content to convert). |
| **ENRICH** | **counter-strike** | Tier-2 (huge search demand, ~0 visibility). Tests "can enrichment lift a high-demand zero-visibility page into the index." |
| **ENRICH** | **valorant** | Tier-2 (huge demand, ~0 visibility). Second shot at the same hypothesis across a comparable page. |
| **CONTROL** | **free-fire** | Tier-1 match for dota (4s — the 2nd-highest-traffic thin page). Held unenriched to net out seasonal/site trend against dota. |
| **CONTROL** | **pubg** | Tier-2 match for counter-strike/valorant (1s, ~0 visibility, same shooter-demand profile). The clean control for the zero-visibility hypothesis. |

**Why this is matched:** the two highest-traffic thin pages are split one-per-arm (**dota enrich ↔ free-fire control**); the three near-identical "high-demand, zero-visibility shooter" pages are split 2 enrich (counter-strike, valorant) ↔ 1 control (**pubg**). Enriched and control arms therefore have comparable baselines at each tier, not an all-the-traffic-in-one-arm imbalance.

### How to read it next cycle(s)
1. **Primary:** Δ GSC impressions + clicks + position, **enriched arm vs control arm** (the control delta absorbs seasonality/site trend — important given this cycle's −7.6% seasonal dip).
2. **Secondary (lagging):** GA4 engagement once enriched pages clear ~10 sessions.
3. **Success bar:** enriched pages earn materially more GSC impressions/rank than controls within 4-8 weeks (recrawl + rerank lag). dota is the fastest tell — it already ranks p5, so enrichment should show as impression/click growth quickly.

### Scope note for Codex
Apply the **thumbnail-enrichment playbook** (real example depth, format/use-case sections, FAQ-as-content — **no FAQPage schema**, keep title/H1) to dota, counter-strike, valorant. Leave free-fire and pubg exactly as-is for the duration. And consolidate `cod-pfp-maker` → `call-of-duty-pfp-maker` separately (not part of the experiment).

---

## Limitations
- Near-zero baselines → this is a directional visibility test, not a powered A/B; don't over-read any single page.
- Windows for GA4 (28d) and GSC (30d) differ slightly; both ~"last 30 days."
- Intrinsic game demand (valorant/counter-strike/pubg are all top-tier titles) is assumed comparable; if Codex has keyword-volume data, confirm the tier-2 pages are demand-matched before finalizing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Built by agricidaniel — Join the AI Marketing Hub community
🆓 Free  → https://www.skool.com/ai-marketing-hub
⚡ Pro   → https://www.skool.com/ai-marketing-hub-pro
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
