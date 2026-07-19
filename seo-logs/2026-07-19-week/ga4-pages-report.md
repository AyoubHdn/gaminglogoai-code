# GA4 Pages Report (long-tail) — gaminglogoai.com — Week of 2026-07-19

Source: GA4 Data API, property **490347534**, report `top-pages` (50 rows). Window **2026-06-21 → 2026-07-18**.
Top rows duplicate `ga4-report.md`; this file focuses on the **long tail + engagement outliers** the 50-row depth reveals.

---

## Engagement-quality map (sorted by what it tells us)

**High engagement (template + intent working):**
| Eng | Sess | Page |
|---|---|---|
| 89.5% | 38 | `/ai-profile-picture-maker` ⭐ |
| 87.8% | 41 | `/pfp/games/call-of-duty-pfp-maker` ⭐ |
| 83.3% | 18 | `/pfp/games/gears-of-war-pfp-maker` |
| 81.8% | 11 | `/logo/games/fortnite-logo-maker` |
| 81.7% | 131 | `/logo/games/minecraft-logo-maker` |

**Low engagement (SXO browse-intent bounce — the pattern):**
| Eng | Sess | Page | Note |
|---|---|---|---|
| **20.0%** | 5 | `/pfp/games/resident-evil-pfp-maker` | NEW to the list — same browse-intent bounce |
| **25.0%** | 4 | `/pfp/styles/kawaii-avatar-maker` | Low engagement despite good rank (GSC p8) |
| **42.1%** | 19 | `/pfp/games/rainbow-six-siege-pfp-maker` | "siege pfp" browse intent |
| 57.1% | 7 | `/pfp/games/free-fire-pfp-maker` | |
| 59.6% | 52 | `/pfp/games/fortnite-pfp-maker` | High volume, mediocre engagement |

**Middling:**
- `/pfp/games/gta-pfp-maker` 60% (5 sess) · `/pfp-maker` tool 61.3% (31 sess)
- `(not set)` 5 sessions, 0 pv — GA4 path-capture gap, ignore.

---

## What the long tail adds

1. **`resident-evil-pfp-maker` (20% eng)** joins rainbow-six (42%) as a second confirmed browse-intent bounce page. The SXO pattern is **not a one-off** — it's a recurring failure mode across `/pfp/games/*` for franchises where searchers want to *download an existing PFP*, not run a photo→avatar maker.
2. **kawaii at 25% engagement** is the one to watch: it ranks *well* (GSC p8.4) but the few visitors who arrive bounce. This is a stronger signal than the ranking alone that "kawaii pfp maker" searchers may expect a **Picrew-style character creator**, not a face-transform tool — a deeper intent gap than the title-variant fix addresses. Flag, don't act yet (sample = 4 sessions, too small).
3. **The winners cluster cleanly:** create-intent pages (`ai-profile-picture-maker`, `call-of-duty-pfp-maker`, the logo makers) all sit 74–90% engagement. The template is excellent; the losses are **100% intent-match, 0% technical.**

---

## Takeaway (reinforces, doesn't change, the plan)

- The engagement split is a clean **create-intent = high / browse-intent = low** line.
- Priority stays: **push `/ai-profile-picture-maker`** (89.5% eng + climbing) and run the **gaming-logo signal step**.
- New backlog candidate: an **SXO / example-gallery treatment** for the browse-intent `/pfp/games/*` franchises (rainbow-six, resident-evil, gears) — serve the "show me a PFP" intent alongside the maker. Not urgent; behavior-data-confirmed.
