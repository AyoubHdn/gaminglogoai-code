# Page Audits & Cannibalization Map — gaminglogoai.com — 2026-07-12

Read-only analysis (GSC last-28-days + source of truth). Companion to `gsc-report.md`, `ga4-report.md`, `drift-report.md`.

---

## Part 1 — Cannibalization Map (current state)

### Page types

**TOOL pages** (interactive generator UI): `/gaming-logo-maker`, `/pfp-maker`, `/twitch-banner-generator`, `/twitch-panels-generator`, `/twitch-stream-screens-generator`, `/emote-generator`, `/thumbnail-maker`.

**LANDING pages** (marketing + CTA → tool): `/`, `/gaming-logo`, `/ai-profile-picture-maker`, `/twitch-banner-maker`, `/twitch-panels-maker`, `/twitch-stream-screens-maker`, `/twitch-emote-maker`, `/youtube-thumbnail-maker`, `/twitch-graphics`.

**Hand-built GAME landings** (not in any sitemap, not in nav): `/fortnite-logos`, `/minecraft-logos`, `/free-fire-logos`, `/fortnite-pfp-maker`, `/minecraft-pfp-maker`.

**Programmatic landings** (in sitemap-logo/pfp): `/logo/games/{game}-logo-maker`, `/pfp/games/{game}-pfp-maker`, plus `/logo/{genres,styles,themes,colors,holidays,cultural}` and `/pfp/{styles,themes,seasonal}`.

### Cannibalization pairs

| Keyword intent | Landing | Tool | Both indexable | Verdict |
|---|---|---|---|---|
| gaming logo maker | `/gaming-logo` + `/` (home) | `/gaming-logo-maker` | yes | **3-way cannibalization** |
| pfp / profile picture maker | `/ai-profile-picture-maker` | `/pfp-maker` | yes | landing wins (healthy) |
| twitch banner maker | `/twitch-banner-maker` | `/twitch-banner-generator` | yes | tool wins on signals |
| twitch panels maker | `/twitch-panels-maker` | `/twitch-panels-generator` | yes | risk |
| twitch stream screens | `/twitch-stream-screens-maker` | `/twitch-stream-screens-generator` | yes | risk |
| twitch emote maker | `/twitch-emote-maker` | `/emote-generator` | yes | partial |
| youtube / thumbnail maker | `/youtube-thumbnail-maker` | `/thumbnail-maker` | yes | risk |
| fortnite logo maker | `/fortnite-logos` (orphan) | `/logo/games/fortnite-logo-maker` | yes | duplicate landings |
| minecraft logo maker | `/minecraft-logos` (orphan) | `/logo/games/minecraft-logo-maker` | yes | duplicate landings |
| free fire logo maker | `/free-fire-logos` (orphan) | `/logo/games/free-fire-logo-maker` | yes | duplicate landings |
| fortnite pfp maker | `/fortnite-pfp-maker` (orphan) | `/pfp/games/fortnite-pfp-maker` | yes | duplicate landings |
| minecraft pfp maker | `/minecraft-pfp-maker` (orphan) | `/pfp/games/minecraft-pfp-maker` | yes | duplicate landings |

### Structural signal issues
- `/twitch-banner-generator` listed in **both** sitemap-tools and sitemap-static.
- `/twitch-banner-funnel` (a 302 redirect → `/twitch-banner-generator`) is listed in sitemap-static.
- Header links to **landings**; Footer "generators" links to **tools**; Footer "niches" links to **programmatic** pages.
- The 5 hand-built game landings are orphaned (no sitemap, no nav) but still indexable and self-canonical.

---

## Part 2 — Deep-Dives (GSC last 28 days)

### `/gaming-logo` (landing) — score ~62, effective value ≈ 0
- **0 clicks, 0 impressions.** Ranks for nothing despite sitemap priority 1.0 + header link.
- Home (56 clicks, p27) and tool (4 clicks, p55) split "gaming logo maker"; this page is crowded out. 117 queries show home+tool both ranking.
- Title/H1 target "**generator**"; volume is on "**maker**".
- 🔴 Literal `**markdown**` asterisks render on hero copy (lines 127, 147).
- FAQPage schema present; BreadcrumbList missing.
- Mislabeled link: "Browse Gaming Logo Styles" → `/gaming-logo-maker` (should be `/logo-styles`).

### `/gaming-logo-maker` (tool) — score ~65
- 4 clicks, 1,096 impr, **CTR 0.36%, avg pos 54.7.** Ranks p44–64 for every head term; zero top-20 queries.
- Title/H1 correctly target "gaming logo maker" ✅.
- 🔴 Thin crawlable content (mostly form UI); H2s are functional labels; no FAQ.
- 🔴 Internal-link dead-end (only conditional `/buy-credits`).
- SoftwareApplication schema valid; no BreadcrumbList.

### `/ai-profile-picture-maker` (landing) — score ~76 (the model)
- **8 clicks, 582 impr, avg pos 13.4** — best PFP performer. "ai pfp" p8.8, "ai pfp maker" p10.2 (quick-win range).
- Rich content + correct keyword + `SoftwareApplication` **and** `FAQPage` schema.
- 🔴 Literal `**gaming PFP maker**` asterisks (line 230).
- 🟡 No brand token in title.

### `/pfp-maker` (tool) — score ~57
- 0 clicks, 79 impr, p53. **Identity crisis:** title/meta/keywords/body say "logo," H1 + schema name say "PFP." Ranks for BOTH logo and PFP terms, wins neither.
- Thin content + dead-end (same as gaming-logo-maker).

### `/twitch-banner-maker` (landing) — score ~68, effective value ≈ 0
- **0 impressions.** Google ranks the tool instead (signals: double sitemap + funnel redirect + footer link).
- Title/H1 have exact keyword ✅; meta is process-focused (no hook); FAQ content exists but no FAQPage schema.

### `/twitch-banner-generator` (tool) — score ~43 (lowest), yet the ranking URL
- 0 clicks, 101 impr, p56.6. Ranks purely on internal signals.
- 🔴 Title/H1 = "Banner Maker" — **no "Twitch"**. 🔴 **No schema at all.** 🔴 Thinnest page: SPA funnel, hydration-gated, near-empty server HTML.

### Whole Twitch cluster
~426 impressions, 2 clicks total. Demand exists (100–160 impr/page) but every page ranks p45–80. Untapped.

---

## Part 3 — The Pattern

| Cluster | Page Google ranks | Its on-page quality | Better page idle (0 impr) |
|---|---|---|---|
| Gaming logo | tool (p55) | thin, right kw | `/gaming-logo` landing |
| PFP | **landing (p13)** ✅ | rich, right kw | — (healthy) |
| Twitch banner | tool (p56) | worst on-site (no schema/"Twitch", SPA) | `/twitch-banner-maker` landing |

**Through-line:** internal signals (sitemap + redirects + footer links) decide which URL Google ranks, more than on-page quality. Twice that handed ranking to a weaker page while a better page got 0 impressions. The one healthy cluster (PFP) is where signal-winner = quality-winner.

**Fix direction (later signal step):** per cluster, align sitemap + funnel + footer to the single best page, then canonicalize/redirect the redundant one. On-page fixes (this session) bring each page's title/H1/meta/schema up to the PFP standard first.

---

## Part 4 — Consolidation direction per cluster (proposed, not yet executed)

- **Gaming logo:** make `/gaming-logo` (rich landing) the ranking URL — retarget to "maker", de-optimize home for exact term, canonicalize/redirect tool exposure. (Signal step.)
- **PFP:** keep `/ai-profile-picture-maker` as winner; fix `/pfp-maker` identity so it stops shadowing; push landing p13→page 1.
- **Twitch banner:** promote `/twitch-banner-maker` landing; repoint funnel redirect + sitemap + footer to it; noindex/canonical the SPA tool.
- **Game pages:** consolidate hand-built `/fortnite-logos` etc. into the programmatic equivalents (301 or canonical). (Signal step.)

---

## Part 5 — Programmatic-page deep-dives (added 2026-07-12)

### `/pfp/games/gears-of-war-pfp-maker` — score ~81 (highest analyzed)
GSC: **2 clicks, 296 impr, CTR 0.68%, avg pos 6.9** — ranks page 1 but ~zero clicks.

| Query | Impr | Pos | Clicks |
|---|---|---|---|
| gears of war pfp | 218 | 6.9 | 0 |
| gears of war profile picture | 43 | 6.6 | 2 |
| gears pfp | 15 | 5.2 | 0 |

- **Diagnosis: search-intent mismatch (SXO), not a ranking or on-page problem.** "gears of war pfp" is a *browse/download-an-image* query; the page offers a *photo→avatar maker*. The only converting query ("…profile picture", 2 clicks) is the create-intent one.
- **On-page = gold standard:** `WebApplication` + `BreadcrumbList` + `FAQPage` schema, proper H1→H2→H3, rich internal linking (cross-promo + related items). This template is the blueprint for fixing the hand-built tool/landing pages.
- **Weakness:** no enriched `pseoContent` entry → template fallback (2 generic FAQ, no `articleSections`). Programmatic-thin for a 296-impr page.
- **Actions:** treat as SXO (add a ready-made example gallery to serve browse intent, or focus create-intent variants); enrich high-impression slugs with article content; **do NOT retitle** (0-click is intent, not title). *(Left untouched this session, deliberately.)*

### `/pfp/styles/kawaii-avatar-maker` — score ~71
GSC: **0 clicks, 158 impr, CTR 0.00%, avg pos 9.3**.

| Query | Impr | Pos |
|---|---|---|
| kawaii pfp maker | 69 | 5.3 |
| kawaii avatar maker | 54 | 14.0 |
| avatar maker - kawaii karakter | 28 | 8.6 |

- **Root cause: keyword-variant mismatch (template-wide).** Page ranks **p5.3 for "kawaii pfp maker"** but only **p14 for "kawaii avatar maker"** — yet title/H1/keywords/slug all said "**Avatar** Maker." Snippet didn't match the higher-demand "pfp maker" query → 0 clicks at position 5.
- Same class as `/gaming-logo`'s "generator" vs "maker."
- Also: template fallback (1 FAQ only); possible deeper intent gap ("kawaii pfp maker" may expect a Picrew-style character creator); CSS typo `dark-text-cyan-400`.

**Fix applied 2026-07-12 (on-page, template-level):** `pfp/styles/[slug].tsx`, `pfp/seasonal/[slug].tsx`, `pfp/themes/[slug].tsx` — title/H1/keywords now **lead with "PFP Maker"** (kept avatar/profile-picture terms; meta contains both PFP + avatar); fixed `dark-text-cyan-400` → `dark:text-cyan-400` (3× per file). No slug/canonical/URL/sitemap/redirect changes; `pseoContent` overrides still win. Build clean.

### Cross-page pattern (updated)
Programmatic pages rank **fine** (p5–9, page 1). Their losses are **(a) title/keyword-variant mismatches** (fixed for `/pfp/styles|seasonal|themes` this session) and **(b) browse-vs-create intent** (`/pfp/games/*` — SXO, not a title fix). Neither is a technical-SEO defect.
