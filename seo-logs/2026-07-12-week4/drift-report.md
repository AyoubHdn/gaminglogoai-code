# Drift Compare — gaminglogoai.com — 2026-07-12

Baseline: `id=3`, captured 2026-06-14T18:00Z · Comparison: 2026-07-12T11:29Z
17 rules evaluated → **2 triggered (0 critical, 1 warning, 1 info)**.

## Triggered

### 🟡 WARNING — `cwv_regressed` (lab, Lighthouse)
| Metric | Baseline | Now | Δ |
|--------|----------|-----|-----|
| LCP | 1,357ms | 2,263ms | +67% |
| TBT | 68ms | 128ms | +90% |
| FCP | 905ms | 905ms | 0 |
| CLS | 0 | 0 | 0 |
| TTI | 5,251ms | 4,688ms | −11% (better) |

**Verdict: recurring lab noise, not a real regression.** Same false-positive pattern as prior weeks. This week's lab LCP (2,263ms) actually landed close to the CrUX **field** p75 (2,172ms, GOOD) — versus the 3.7s–6.1s swings seen in other runs. The field data is stable and Good; real users are unaffected. The drift monitor re-flags because it compares a single throttled lab run against a single baseline lab run, and lab LCP on this image-heavy homepage is inherently variable.

### ℹ️ INFO — `content_hash_changed`
HTML body hash differs from baseline (`141064f9…` → `c4ecfb88…`). **Expected** — the homepage has been edited since 2026-06-14. No action; informational only.

## Untriggered (all healthy ✅)

No critical regressions. Confirmed unchanged:
- **Schema**: 2 blocks present (not removed)
- **Canonical**: `https://gaminglogoai.com/` intact (not changed/removed)
- **noindex**: not added
- **Title / H1**: unchanged

## Recommendation

1. 🟢 **Re-baseline after the image fix.** Resize the oversized above-fold images (`emotes-boy.webp` 453 KB et al.), then `/seo drift baseline` to reset. This stops the weekly lab-LCP false positive.
2. 🟢 Treat `cwv_regressed` warnings as low-priority until field CrUX (LCP p75) actually crosses 2,500ms. It has not.
