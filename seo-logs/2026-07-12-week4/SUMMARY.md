# SEO Log — gaminglogoai.com — Week of 2026-07-12

Google-data analysis run: drift compare, GSC, GA4, GA4 landing pages, PageSpeed (×2).

---

## TL;DR

- **The drift-flagged LCP "regression" (1.4s → 3.7s) is a FALSE ALARM** — lab/Lighthouse mobile noise, not a real-user issue. Field CrUX LCP p75 = **2,172ms (Good, 77.8% good)** and unchanged across runs.
- **Real perf issues:** (1) oversized above-fold image `emotes-boy.webp` (453 KB) driving lab mobile LCP; (2) TTFB field p75 = **1,316ms (needs-improvement, 21.7% poor tail)**.
- **Top problem page:** `/gaming-logo-maker` — ranks ~62nd for "gaming logo maker" (446 impr), worst engagement (65.6% bounce).
- **Hidden winner:** `/free-fire-logos` — strong in GA4, ~invisible in GSC.
- **Opportunity clusters:** Twitch graphics pages (6 pages, ~10 sessions, untapped); logo pages outperform PFP pages.

---

## 1. Drift Compare

- Flagged an LCP regression: baseline 1.4s → current 3.7s (lab).
- **Verdict: lab variance, not real regression.** Proven by (a) stable CrUX field data and (b) two PSI runs producing different lab LCP (6.1s then 5.2s) on unchanged content.
- **Action:** re-baseline drift AFTER the image fix so it stops flagging on lab noise.

## 2. Google Search Console (sc-domain:gaminglogoai.com)

Site totals recomputed directly from 928 rows (script `totals` field double-counts query×page):

| Metric | Value |
|--------|-------|
| Clicks | 114 |
| Impressions | 11,146 |
| CTR | 1.02% |
| Avg position | 26.1 |

- **`/gaming-logo-maker`** is the #1 problem page: ranks 62nd for "gaming logo maker" (446 impr), worst engagement.
- Quick-win candidates: keywords sitting at position 4–10 (see gsc detail).

## 3. GA4 (property 490347534, organic)

- **`/free-fire-logos`** is a hidden winner — strong organic sessions in GA4 but nearly invisible in GSC. Worth a dedicated GSC/content push.
- **Logo pages outperform PFP pages** on engagement.
- **Twitch cluster** (6 pages, ~10 sessions total) is untapped — candidate for a content/internal-linking hub.

## 4. PageSpeed / CrUX (2 runs, demonstrates lab variance)

| Metric | Run #1 | Run #2 | Field (CrUX p75) |
|--------|--------|--------|------------------|
| Mobile Perf | 75 | 80 | — |
| Mobile LCP (lab) | 6.1s | 5.2s | — |
| Desktop Perf | 85 | 100 | — |
| **Field LCP** | — | — | **2,172ms ✅ Good** |
| Field FCP | — | — | 2,102ms 🟡 |
| **Field TTFB** | — | — | **1,316ms 🟡 (21.7% poor)** |
| Field CLS | — | — | 0 ✅ |

Lab numbers swing ~1s / ±15 points between identical runs; every field metric is byte-identical. Real users are fine.

---

## Action Queue (priority order)

1. 🔴 **Resize `emotes-boy.webp`** (453 KB → <60 KB) + `fortnite-prv.webp` (219 KB), `logo.webp` (33 KB). #1 perf fix, kills the lab LCP flag.
2. 🟡 **Investigate TTFB tail** — 21.7% of real users see poor TTFB despite 3ms lab server response. Check CDN/cache-hit ratio on homepage HTML.
3. 🟡 **Fix `/gaming-logo-maker`** — worst page: ranks 62nd, 65.6% bounce. Deep-dive via `/seo page`.
4. 🟢 **Promote `/free-fire-logos`** — GA4 winner invisible in GSC; add internal links + verify indexation.
5. 🟢 **Build Twitch cluster hub** — 6 underlinked pages; plan via `/seo cluster`.
6. 🟢 **Re-baseline drift** after image fix.
7. 🟢 Render-blocking CSS (320ms), unused JS (~1s), legacy JS polyfills (13 KB).

---

## Notes / Gotchas

- **OAuth "Testing" mode = 7-day refresh-token expiry.** GSC/GA4 auth broke because the refresh token expired; fixed by re-running `python scripts/google_auth.py --auth` (interactive browser flow). Expect this weekly unless the OAuth app is moved to "Production" publishing status.
- GA4 uses the **OAuth user account**, not the service account (`ga4_report.py:51`). The "service account email" error message is misleading — the real fix was granting the OAuth account Viewer access to property 490347534.
