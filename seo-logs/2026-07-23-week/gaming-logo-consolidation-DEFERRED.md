# Gaming-logo cluster consolidation — BUILT, THEN ABANDONED (2026-07-23)

**Status: NOT SHIPPED. Branch `seo/gaming-logo-consolidation` deleted, working tree reverted to `main`.**
Nothing from this document is live. It exists so the work can be replayed if the trigger condition below is met.

---

## What was built

Original plan: make `/gaming-logo` (landing) the owner of "gaming logo maker", and stop `/gaming-logo-maker` (tool) from competing — without touching the homepage, without `noindex`, without redirects.

Three changes were implemented and the build passed clean:

1. **`src/pages/gaming-logo-maker.tsx`** — canonical repointed from self to `https://gaminglogoai.com/gaming-logo`.
2. **`src/component/Footer.tsx`** — the "Generators" column's Gaming Logo entry repointed from `/gaming-logo-maker` → `/gaming-logo`, via a new optional `footerUrl` field so only that one link changed.
3. **`src/pages/sitemap-tools.xml.ts`** — `/gaming-logo-maker` removed from the submitted tool sitemap.

All functional CTAs (landing→tool button, `/success` post-payment redirect, free-credit result card, collection/community empty-state buttons, SharePopup `generatorUrl`, and the seven pSEO `#hash` pre-filter deep-links) were deliberately **kept** pointing at the tool.

## Why it was abandoned

The 2026-07-23 GSC pull (`gsc-report.md`) broke the head term out **per page** for the first time. Previous cycles had only the aggregate ("601 impr at p29"), which hid the real structure:

| Page | Clicks | Impr | Position | 4-day Δ pos |
|---|---|---|---|---|
| `/` (home) | 3 | 451 | **21.5** | −0.5 |
| `/gaming-logo-maker` (tool) | 2 | 202 | 38.3 | **+13.9** ↑↑ |
| `/gaming-logo` (landing) | 0 | **1** | 76 | — |

Three facts kill the plan:

1. **`/gaming-logo` is not in the fight.** It holds **1 impression** on "gaming logo maker". It was never the cannibalization party — the split is **home vs. the tool**. Consolidating toward it would hand the term to a page Google has no signal for.
2. **The tool is rising fast and untouched.** +13.9 positions in four days on the head term ("gaming logo creator" +13.8, "logo maker gaming" +5.4, page-level 51.6 → 44.8, impressions +189) with zero intervention. Canonicalising a page mid-climb discards that momentum for nothing.
3. **Wrong target, wrong direction.** The plan pointed a rising page at a dormant one. Even if consolidation is eventually right, the winner is home (authority, p21.5) or the tool (topical match, momentum) — not the landing.

**Decision: leave the gaming-logo cluster alone this cycle.** The tool is fixing its own position problem; intervention would be net-negative.

---

## Revisit trigger

Reopen this only if **the tool stalls**. Concretely, at the next GSC pull:

- `/gaming-logo-maker` position on "gaming logo maker" **flat or worse than ~p38** for two consecutive pulls, **and**
- home still holding ~p21 on the same term (i.e. the split is real and static, not resolving itself).

If instead the tool keeps climbing toward p20 and converges with home, the cluster is self-resolving and the correct move is **home vs. tool** disambiguation (a title/H1 differentiation on one of them), **not** a canonical to `/gaming-logo`.

If it stalls and consolidation is back on: **the target is home or the tool, and `/gaming-logo` is not a candidate.** Re-derive the winner from that pull's data — do not reuse the plan below as-is.

---

## The exact diff, for replay

Preserved verbatim. Applied against `1c0ab9b`; build was `✓ Compiled successfully`, `/gaming-logo-maker` still prerendered static (`○`, 9.83 kB) and returned 200 with the tool intact.

```diff
--- a/src/pages/gaming-logo-maker.tsx
+++ b/src/pages/gaming-logo-maker.tsx
@@ -297,7 +297,9 @@
-        <link rel="canonical" href="https://gaminglogoai.com/gaming-logo-maker" />
+        {/* Canonicalised to the /gaming-logo landing page to consolidate the "gaming logo maker"
+            cluster. The tool stays fully live and indexable-by-crawl (no noindex, no redirect). */}
+        <link rel="canonical" href="https://gaminglogoai.com/gaming-logo" />
```

```diff
--- a/src/component/Footer.tsx
+++ b/src/component/Footer.tsx
@@ -12,11 +12,17 @@
-  const generators = [
+  const generators: {
+    name: string;
+    landingUrl: string;
+    toolUrl: string;
+    footerUrl?: string; // Overrides toolUrl for this footer link only (SEO consolidation)
+  }[] = [
     {
       name: "Gaming Logo Maker",
       landingUrl: "/gaming-logo", // The main "Text Logo" landing page
       toolUrl: "/gaming-logo-maker",   // The actual generator tool
+      footerUrl: "/gaming-logo",  // Navigational link points at the landing (owns "gaming logo maker")
     },
@@ -125,7 +131,7 @@
-                  <PrimaryLink href={gen.toolUrl} className="text-xs hover:underline">
+                  <PrimaryLink href={gen.footerUrl ?? gen.toolUrl} className="text-xs hover:underline">
```

```diff
--- a/src/pages/sitemap-tools.xml.ts
+++ b/src/pages/sitemap-tools.xml.ts
@@ -2,7 +2,8 @@
 const toolPages = [
-  "/gaming-logo-maker",
+  // "/gaming-logo-maker" removed: canonicalised to /gaming-logo (see sitemap-static, priority 1.0).
+  // A canonicalised URL should not be submitted in a sitemap. Page remains live and returns 200.
   "/pfp-maker",
```

`sitemap-static.xml.ts` needed no change — `/gaming-logo` is already listed at priority `1.0`.

---

## Findings worth keeping regardless

These came out of the link survey and stand on their own, independent of the consolidation decision:

1. **Footer "Generators" column is mislabelled.** The comment reads `links to LANDING pages` but it renders `gen.toolUrl` for all seven entries — `landingUrl` is **dead data**, never rendered. So every footer generator link currently points at a tool, not a landing. That's a live sitewide internal-signal question across *all* clusters (twitch, thumbnail, pfp too), not just gaming-logo. Worth a deliberate decision later.
2. **`src/pages/pfp-maker.tsx:711`** — SharePopup `generatorUrl` points at `/gaming-logo-maker` from inside the PFP tool. Pre-existing bug, already logged in `audit/pfp-maker.md`. Untouched, still open.
3. **Dead CTAs:** `src/pages/fortnite-logos.tsx` and `minecraft-logos.tsx` both contain `router.push("/gaming-logo-maker")`, but both pages are already 301'd away in `next.config.mjs` (→ `/logo/games/*-logo-maker`). Unreachable code. `free-fire-logos.tsx` has the same CTA and is **not** redirected — possible inconsistency.
4. **`/gaming-logo-maker` og:url and SoftwareApplication `url`** are self-referential. Irrelevant now (canonical reverted), but relevant if consolidation ever ships.
