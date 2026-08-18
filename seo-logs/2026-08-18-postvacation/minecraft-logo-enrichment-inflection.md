# Enrichment Inflection Test — /logo/games/minecraft-logo-maker — 2026-08-18

**Question:** Did impressions/clicks/position inflect *at* the enrichment date (2026-06-14), or was the page already climbing before it?
**Method:** GSC per-day, filtered to this page only, 8 weeks before vs 8 weeks after 06-14, plus week-by-week trajectory. Data: `gsc_minecraft_span.json` (112/112 days have data).

---

## Answer: it was ALREADY climbing before the enrichment. No clean step-change at 06-14.

### 8-week aggregate (looks like a big lift…)

| Window | Clicks | Impr | CTR | wPos |
|---|---|---|---|---|
| **Before** 04-19→06-13 | 122 | 5,136 | 2.38% | 10.6 |
| **After** 06-14→08-08 | 287 | 8,393 | 3.42% | 9.3 |
| Δ | **+135%** | **+63%** | +1.04pp | +1.3 |

…but the aggregate is **misleading**, because the "before" window is dragged down by a deep **May trough**. The week-by-week trajectory shows the recovery started ~2 weeks *before* the enrichment.

### Week-by-week (the real story)

| Week start | Clicks | Impr | CTR | wPos | vs enrichment |
|---|---|---|---|---|---|
| 04-20 | 20 | 909 | 2.2% | 9.0 | before (early spike) |
| 04-27 | 10 | 639 | 1.6% | 11.0 | before |
| 05-04 | 13 | 478 | 2.7% | **13.2** | before — trough |
| 05-11 | 8 | 468 | 1.7% | 12.0 | before — **trough bottom** |
| 05-18 | 8 | 422 | 1.9% | 11.6 | before — trough |
| 05-25 | 14 | 552 | 2.5% | 10.7 | before — **recovery starts** |
| 06-01 | 18 | 755 | 2.4% | 10.4 | before — climbing |
| **06-08** | **31** | **958** | **3.2%** | **9.3** | **before — already at post-enrichment level** |
| — enrichment 06-14 — | | | | | |
| 06-15 | 24 | 990 | 2.4% | 9.1 | after |
| 06-22 | 31 | 991 | 3.1% | 8.5 | after |
| 06-29 | 30 | 972 | 3.1% | 8.8 | after |
| 07-06 | 39 | 1,167 | 3.3% | 9.5 | after |
| 07-13 | 51 | 1,044 | **4.9%** | 8.7 | after — peak |
| 07-20 | 35 | 1,029 | 3.4% | 8.2 | after |
| 07-27 | 38 | 1,191 | 3.2% | 11.3 | after |
| 08-03 | 37 | 868 | 4.3% | 9.6 | after |

**The tell:** the week of **06-08 — still before enrichment — already hit 31 clicks / 958 impr / p9.3**, indistinguishable from the post-enrichment plateau. The climb out of the May trough is a smooth monotonic ramp (05-18 bottom → 05-25 → 06-01 → 06-08) that crosses the 06-14 line **seamlessly**. There is no discontinuity at the enrichment date.

---

## Nuanced read: what the enrichment plausibly DID vs DIDN'T do

- **DIDN'T cause the position/impressions inflection.** Rank recovered from p12–13 (mid-May) to p9.3 *before* 06-14; impressions rebuilt from the ~450/wk trough to ~950/wk *before* 06-14. This looks like a **recovery from a May dip** (algorithmic or seasonal), independent of the content change.
- **PLAUSIBLY helped CTR and sustained the plateau.** CTR ran 2.38% in the before-window vs 3.42% after, and the highest-CTR weeks (07-13 at 4.9%, 08-03 at 4.3%) are all post-enrichment. Richer content improving snippet relevance/CTR is the most enrichment-consistent signal here — but it's *supporting*, not a step-change, and the position was already improving underneath it.

## Confounders / caveats
- **"Enrichment date = 06-14" is an assumption** (matches drift baseline #3's capture date). If the content actually shipped a week earlier, part of the "pre-enrichment" 06-01→06-08 ramp could be enrichment — but that would still mean the effect is gradual, not a clean 06-14 step.
- **The May trough → June recovery could be site-wide** (algo update / seasonality), not page-specific. A site-level trend check would isolate that; not run here.
- Weekly buckets are ISO-week; 06-14 falls mid-week, so the 06-08 and 06-15 rows straddle the exact date.

## Verdict
**Pre-existing climb, not an enrichment-triggered inflection.** The page was recovering from a May trough and had already returned to its post-enrichment click/impression/position level the week *before* 06-14. The enrichment coincided with the top of that ramp and most plausibly contributed to the **CTR** gains and to **holding** the higher plateau — but it did not create the inflection. Treat any "enrichment lifted this page +135%" claim as **overstated**: the honest attribution is "the page recovered on its own; enrichment likely helped CTR and durability."
