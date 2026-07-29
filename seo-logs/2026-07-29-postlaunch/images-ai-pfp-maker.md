# Image SEO Audit — /ai-profile-picture-maker — 2026-07-29

Follow-up to SXO action #2 ("earn a visual result in the image-heavy PFP SERP"). Audited the live page's image markup, OG tags, file sizes, and schema.

---

## Overall: image hygiene is GOOD, with one real broken-asset bug.

| Check | Result |
|---|---|
| Alt text | ✅ Excellent — descriptive + relevant ("Example of a photo transformed into a cartoon PFP", "AI generated PFP for Cybr_Grl") |
| Format | ✅ All WebP (S3 style examples ~38 KB each — well optimized) |
| Lazy loading | ✅ Correct (`loading="lazy"` on below-fold; `fetchpriority="high"` on hero) |
| Responsive srcset | ✅ On Next.js showcase avatars (1x/2x) |
| CLS | ✅ 0 in drift; images have dimensions or fill containers |
| OG image | ✅ Present, 1200×630, 271 KB PNG, `summary_large_image` |

---

## 🔴 Bug: hero background image is a 404 (old, pre-existing)

`src/pages/ai-profile-picture-maker.tsx:232` renders:
```jsx
<Image src="/images/pfp-hero-bg.webp" ... priority unoptimized={true} />
```
- **`https://gaminglogoai.com/images/pfp-hero-bg.webp` → 404 Not Found** (returns a 19 KB HTML error page).
- The file **was never committed to the repo** (`git log --all` for `*pfp-hero-bg.webp` is empty). The reference was added 2025-06-26 ("restuct pages"). So this has been 404ing for **~13 months**, not a recent break.
- `public/images/` has `home-hero-bg.webp` (69 KB) but no `pfp-hero-bg.webp` — the asset was intended at the same path and simply never added.

**Impact: LOW–MEDIUM, and NOT the drift LCP cause.** Because it predates the 07-12 baseline (which had good LCP 2.3s), this 404 is *not* what spiked LCP to 6.8s on 07-29 — don't pin the CWV regression on it. But it's still worth fixing:
- It's marked `priority` → the browser issues a wasted high-priority fetch that resolves to a 404.
- The hero renders with no background (it's a faint `opacity-25` overlay, so degraded but not catastrophic visually).
- A 404 on every page load is crawl/log noise and reads as broken to anyone inspecting.

**Fix (trivial, batch it — not urgent):** either add a real `pfp-hero-bg.webp` asset, repoint to the existing `/images/home-hero-bg.webp`, or remove the hero `<Image>`. Since it's `unoptimized` + `priority`, dropping it if unwanted also removes a needless priority fetch.

---

## Refinement to the SXO "earn a visual result" action — important

The SXO report suggested a "strong crawlable OG image." Correcting that so the fix targets the right thing:

- **The OG image does NOT drive Google organic SERP thumbnails or the image pack.** OG/twitter:image only controls **social share cards** (Facebook/X/LinkedIn). It's fine as-is (though generic site-wide, not PFP-specific — only relevant if you care about social sharing of this URL).
- **Google's SERP thumbnail / image-pack eligibility comes from the on-page content `<img>` elements** — and those are already in good shape here: WebP, descriptive alt, relevant PFP examples. So the "visual result" lever is **partly already satisfied.**

Incremental levers that actually move image-pack eligibility (all optional, low priority):
1. **Add `ImageObject` schema** nominating a primary representative PFP example. The page has SoftwareApplication/FAQPage/BreadcrumbList/Organization but **no ImageObject** — Google has no explicit image to feature.
2. **Cross-domain hosting:** the style examples load from `gaminglogoai-images.s3.us-east-1.amazonaws.com`. Google can index them, but in Google Images attribution leans to the hosting domain (S3), slightly diluting the page's image authority. Not worth re-hosting for; just noted.
3. Ensure the gallery images aren't blocked in robots and have descriptive filenames (currently `f4.webp`, `f22.webp` — opaque; real-word filenames like `cartoon-gaming-pfp-example.webp` would help image search marginally).

---

## Verdict
- **One concrete fix:** the 404 hero background (`pfp-hero-bg.webp`) — old bug, low-medium priority, batch it. Not the LCP-spike cause.
- **Image hygiene otherwise solid** — alt/format/lazy/responsive all good.
- **SXO's "visual result" goal is mostly already met** by the content images; the OG image is the wrong lever for Google SERP. Optional upside: ImageObject schema + descriptive filenames.
- No emergency here; the CTR problem remains rank + SERP-position driven, per the SXO report.
