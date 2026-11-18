# Drift Compare — gaminglogoai.com homepage — 2026-07-29

**Baseline:** #7, captured 2026-07-12T16:28Z. **Compared:** 2026-07-29T13:41Z (17-day gap). Raw: `drift.txt`.

**Result: 0 critical · 2 warning · 1 info.** No SEO-critical regression. The two warnings are both performance (one Lighthouse lab run) and need field-data confirmation before they mean anything.

---

## SEO fundamentals — all clean ✅

Every element drift guards is **unchanged** from baseline:

| Element | Baseline → Now | Status |
|---|---|---|
| Status code | 200 → 200 | ✅ |
| Canonical | `https://gaminglogoai.com/` → same | ✅ |
| Title | "Free AI Gaming Logo Maker — Logos, PFPs & Twitch Graphics" → same | ✅ |
| H1 | "The UltimateAI Gaming Logo Generator" → same (100%) | ✅ |
| Meta description | unchanged | ✅ |
| Schema (2 blocks, hash) | unchanged | ✅ |
| OG tags (5) | unchanged | ✅ |
| noindex | none → none | ✅ |
| H2 structure | 10 → 10 | ✅ |

This confirms the standing constraint held: **the homepage title/H1/schema were never touched.** No deploy has regressed the SEO-critical layer. (H1 "UltimateAI" missing-space is a pre-existing render artifact, not new.)

---

## Warning 1 — CWV / performance regression (needs confirmation, do NOT act yet)

| Metric | Baseline (07-12) | Now (07-29) | Δ |
|---|---|---|---|
| LCP | 2,296 ms | **6,781 ms** | +195% ⚠ |
| Perf score | 96 | **73** | −23 |
| FCP | 915 ms | 1,243 ms | +36% |
| Speed Index | 2,003 ms | 4,549 ms | +127% |
| TBT | 162 ms | 81 ms | −50% ✅ (improved) |
| CLS | 0 | 0 | ✅ |

**Caveat before anyone panics:** this is a **single Lighthouse lab run**, which is noisy — a cold server start, a slow CDN fetch, or a heavy hero/showcase image on that one run can spike LCP without any real-user impact. TBT actually *improved* and CLS is still 0, which is not the profile of a broad code regression.

The **INFO: content hash changed** (HTML body differs, but title/H1/meta/schema/H2 all identical) points at **dynamic homepage content** (rotating community showcase / gallery images) or a deploy since 07-12 — a plausible source of a heavier LCP element on this particular run.

**Action: confirm with field data before touching anything.** Run `/seo google pagespeed https://gaminglogoai.com` (or a CrUX field pull) to see whether real users experience the LCP regression. If CrUX field LCP is still green/good, the lab spike is noise. If field LCP degraded too, then investigate the homepage hero/showcase image weight. **Not a code change this cycle — a verification step.**

---

## Warning 2 — Perf score −23
Same root as Warning 1 (Lighthouse composite, dominated by the LCP/Speed-Index spike). No independent signal. Resolves with the field-data check above.

---

## Status
- Drift compared to baseline #7; saved `drift.txt`, this report.
- **No SEO regression — homepage SEO layer identical to baseline. Baseline #7 still valid, no re-baseline needed.**
- **One open verification:** the LCP lab spike (2.3s → 6.8s). Confirm via PageSpeed field data before treating as real. If confirmed, check homepage hero/showcase image weight.
- Nothing committed (data/reports only).
