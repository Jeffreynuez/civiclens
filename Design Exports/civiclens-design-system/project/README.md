# CivicLens — Design System

CivicLens is a Next.js 14 + FastAPI web app that gives US citizens a clearer path to understanding and connecting with their elected representatives at federal, state, and local levels. Florida has full coverage; federal-level data covers all 50 states.

There are three audiences in the product:

| Role                 | What they do                                                                  |
|----------------------|--------------------------------------------------------------------------------|
| **Citizen**          | Browses reps, follows officials, comments on rep posts, likes/dislikes posts + comments, votes in polls. |
| **Rep / candidate**  | Claims their own page, posts updates, attaches polls (with timer + visibility modes), uploads images, sees an engagement dashboard scoped to their constituents. |
| **Anonymous viewer** | Read-only — sees the map, profile pages, posts, comments, and aggregate poll results. |

The product surface is one Next.js app split across:

- A US **MapView** + sidebar that lets you pick state and drill into Congress, Statewide, Local, and Ballot tabs.
- **NationalOfficialsPanel** as the landing experience.
- **PageView** — the densest screen — a rep's social-style page with feed, composer, polls, comments, dashboard, and upcoming events.
- A small set of **modals** for login, claim-page, committees browser, "My tracked," and waitlist.

## Sources

- **Source repo** (private), `main` branch — see `_source/frontend/_handoff/DESIGN_HANDOFF.md` for the working agreement.
- **Design handoff** at `_source/frontend/_handoff/DESIGN_HANDOFF.md` (also `DESIGN_HANDOFF.md` in the repo root) — canonical brief, including section 7's load-bearing demo decisions and section 8's priority order.
- **Live tokens** in `_source/frontend/app/globals.css`
- **Component inventory** at `_source/frontend/components/*` (39 files, almost all inline-styled)

> Light mode only. Mobile responsiveness is acknowledged as a separate later pass — most layouts assume desktop.

## Index

| File / folder                | What's in it                                                                              |
|------------------------------|-------------------------------------------------------------------------------------------|
| `colors_and_type.css`        | All design tokens (color, type, spacing, radii, shadow, motion) and semantic type classes |
| `assets/`                    | Logo, brand glyphs, party color swatches                                                  |
| `preview/`                   | Cards rendered in the Design System tab                                                   |
| `ui_kits/web/`               | UI kit recreating the CivicLens web app (PageView, PostCard, Dashboard, Navbar, modals)   |
| `_source/frontend/`          | Imported reference code from the repo (read-only mirror)                                  |
| `SKILL.md`                   | Agent-facing brief, cross-compatible with Claude Code Skills                              |

## Content fundamentals

CivicLens copy is **plain-spoken, civic-neutral, and operationally honest**. It treats the reader as a competent adult interacting with their government, not a "user" being onboarded. Specifics observed in the codebase:

- **Voice & person.** The product addresses the reader as "you" ("Sign in as a citizen to like, comment, and vote in polls"). Reps see "your page," "your view," "your first one above." First-person plural is reserved for *system-level* honesty notices ("we don't verify identity yet"). Never marketing "we."
- **Tone.** Quiet, factual, slightly bureaucratic — more "USPS web form" than "fintech onboarding." Examples lifted from source: "This page isn't claimed yet." / "Closed - Mar 14, 6:00 PM" / "Results hidden until close." / "Engagement rollup across every post on your page."
- **Casing.** Sentence case for buttons, labels, and CTAs ("Citizen login," "Claim this page," "Show results"). ALL-CAPS is reserved for tiny eyebrow labels (`.cl-eyebrow` class) — "CONSTITUENT DASHBOARD," "MOST LIKED," "UNVERIFIED" badge — never for buttons or body.
- **Honesty in UI.** Every citizen-authored thing carries an **"Unverified"** chip. Every reveal-after-close poll explicitly says "Results hidden until the poll closes." Every empty state says what's actually missing ("Byron Donalds hasn't posted anything yet."). Never euphemistic.
- **Numbers and time.** Always concrete. "12m ago," "Closes in 2h 15m," "1,247 votes," "12 of 60 reporting." Tabular nums (`font-variant-numeric: tabular-nums`) on every count.
- **Vocabulary.** "Rep," "candidate," "citizen," "constituent," "page," "post," "poll," "scope," "ballot," "follow," "track" — these are the canonical product nouns. "Subscribe" is reserved for the citizen-waitlist (notify-me) flow, not for following a rep.
- **What we don't say.** No exclamation points except in error/celebration states (and even there, sparingly). No emoji-led headers. No "smart" portmanteaus. No "Welcome back, friend!"

## Visual foundations

CivicLens reads as **civic, calm, slightly serious — a trustable government-adjacent tool, not a social network**. Below is the system pulled from the live code, with the few additions this design pass introduces flagged as `[ADDED]`.

### Color

- **Two anchor brand hues**: navy `#1a1a2e` (chrome, density, masthead) and deep green `#2d6a4f` (CTAs, links, active state). The navy carries the institutional weight; the green is what the citizen interacts with.
- **Party-coded reds and blues** (`#e63946` GOP, `#457b9d` Dem, `#6c3ec1` Independent) appear as small pills only — **never as backgrounds, never on CTAs**. Soft-tint variants (`#fde8e8`, `#e3f0f7`, `#f0eaff`) back the pills. Preserving party neutrality in chrome is intentional.
- **Reaction tokens** are deliberately distinct from party hues so a "liked" comment doesn't read as a "Democratic" comment. UP REACT is `#1877F2` (blue); DOWN REACT is **burgundy `#8C2929`** — moved away from the earlier `#C33333` so disagreement reads visually distinct from `#D63031` Danger / Delete. Each ships as a soft trio (soft bg / paired text / paired border).
- **Warning yellow** `#FFBA08` is the Subscribe CTA + tracked-count badge + Unverified chip family.
- **Backgrounds** are mostly `#f8f9fa` (page) and `#ffffff` (cards). No gradients, no images, no patterns. The map is the only visually-busy surface.

### Type

- **`[TBD]`** No font family has been selected yet. Today the codebase ships a single system stack (`-apple-system, …`); a display + mono pairing is open for selection. This README will be updated once a family is locked in.
- Scale: 0.68 / 0.75 / 0.82 / 0.92 / 1.05 / 1.25 / 1.5 / 2 / 2.5 rem. The `0.68rem` micro-text is real and load-bearing on chips; we keep it.
- **ALL-CAPS** with `letter-spacing: 0.04–0.06em` is the eyebrow treatment ("CONSTITUENT DASHBOARD"). Never for buttons.
- Body line-height `1.55`. Headings `1.25–1.4`. Numerals are tabular wherever counts appear.

### Spacing & layout

- **`[ADDED]`** 4px base scale: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48. Existing inline values (`6/8/10/12/14/18`) snap to this scale on the next pass.
- Page max-width is `980px` for the rep page. Sidebar is `300px` fixed. Modals are typically `420–560px` wide.
- Sticky elements: scope-filter rail uses `position: sticky; top: 0` with a subtle drop shadow on scroll. Page top bar is non-sticky (the page itself is the overlay).

### Backgrounds, imagery, illustration

- No hand-drawn illustrations, no full-bleed photography, no repeating patterns, no textures. **Plain white surfaces and a light gray page** are the rule.
- The MapView is the only "imagery" — a pale `#f1f3f5` ocean and party-tinted state fills.
- Avatar fallbacks are initials on a colored circle (party-tinted when applicable, neutral gray otherwise) — never a generated illustration.

### Animation

- **None today.** Codebase has zero transitions, zero enter/exit animation, zero page transitions. There is a single `civiclens-pulse` keyframe used for return-to-list highlighting. **`[ADDED]`** modest defaults: `150ms` for hover, `220ms` for state change, `cubic-bezier(0.2, 0, 0, 1)` standard ease. Nothing flashy — fades and small position shifts only.

### Hover & press

- Hover **lightens** instead of darkens: most buttons swap from solid to a slightly lighter variant or pull in a `var(--cl-bg)` or `rgba(255,255,255,0.18)` tint. Borders shift from `--cl-border` to `--cl-accent` on focus.
- Press states are not currently differentiated from hover (no scale-down). **`[ADDED]`** light `transform: translateY(1px)` + `box-shadow` removal on primary CTAs only.

### Borders, radii, shadows

- **Borders** are `1px solid var(--cl-border)` (`#dee2e6`) by default. Very few elements skip a border.
- **Radii**: `8px` for buttons + inputs, `10–12px` for cards, `14px` for the page-hero card, `999px` for chips and reaction pills.
- **Shadows** are sparse: `0 2px 6px rgba(0,0,0,0.04)` for sticky bars, `0 12px 36px rgba(0,0,0,0.18)` for dropdowns, `0 20px 60px rgba(0,0,0,0.28)` for modals. No inner shadows. No diffuse blooms.

### Transparency & blur

- Used **only** on the navbar search input (`background: rgba(255,255,255,0.10)` + `backdrop-filter: blur(10px)`) so the search reads as embedded in the masthead. **Don't extend glass to other surfaces** — the rest of the product is solid.

### Cards

A canonical CivicLens card:

```
background: white;
border: 1px solid #dee2e6;
border-radius: 12px;
padding: 14px;        /* posts */ or 18px /* hero */
```

No shadow on resting cards; shadow only on overlays.

### Imagery / photo color vibe

Rep avatars come from official sources — daylight portraits, neutral background. We don't tint, mask, or grain them. Post images (max 5 per post, 5MB each, JPEG/PNG/WebP) are shown unfiltered.

### Layout rules / fixed elements

- Navbar is fixed-height `56px`, navy chrome, full-width.
- PageView is a fixed overlay `position: fixed; inset: 0; z-index: 1200`, NOT a routed page.
- Modals are `z-index: 1500`, centered, backdrop `rgba(0,0,0,0.85)` for the lightbox / `rgba(0,0,0,0.4)` for form modals.

## Brand mark

The CivicLens logo is a **magnifying lens with a flag-corner inside** — a circular lens with its handle dropping toward the lower-right, and a US flag canton tucked into the upper-left of the lens with alternating stripes filling the rest of the circle. The mark is rendered in three colors only:

- Navy `#1a1a2e` — lens ring, handle, canton background, even stripes
- White `#ffffff` — odd stripes, star constellation inside the canton
- Muted red `#8A2929` — accent stripe pair (drawn in the same red family as the DOWN REACT token, not the GOP party red)

The **clock-circle / 12:08 hands** mark from earlier drafts is retired — references in any older mockups should be updated. The locked source is `assets/civiclens-glyph-color.svg` (mono and reverse variants in the same folder).

## Iconography

The icon system is **Phosphor Duotone**, hand-inlined as `<svg>` (no icon font, no runtime CDN dependency).

Specs:

- **Viewbox** 24×24
- **Stroke** 2px (occasionally 2.4 or 2.5 for small icons against the navy navbar so the outline reads at 14–16px)
- **Linecaps** sharp / `butt`, miter joins — round caps are explicitly not used; the icon family stays angular to match the civic-document feel
- **Resting fill** navy `#1a1a2e` stroke + accent fill at **28% opacity** as the duotone underlayer
- **Active state** fully-filled accent (no underlayer; the whole glyph fills the action color — accent green for primary, blue for UP REACT, burgundy for DOWN REACT, etc.)

**Lucide is the fallback** when Phosphor's duotone variant doesn't ship a glyph for a given concept. We don't mix the two within one component — pick one and finish that surface.

Other icon notes:

- **Scope chips** use custom navy glyphs (no emoji): a five-star constellation for **Country**, the iconography set's flag for **State**, a sharp seven-sided polygon outline for **District**, and the buildings glyph for **City**. Active scope flips white-on-accent-green; resting is navy stroke + duotone fill. Glyphs are never the only signal — every chip is paired with text.
- **Reactions** use Phosphor thumbs-up and thumbs-down (Facebook-style "like / dislike" semantics, not Reddit-style up/down vote). Up active is solid `#1877F2` blue; down active is solid `#8C2929` burgundy. The earlier `▲ / ▼` arrow shorthand has been retired.
- **Comment glyph** is the Phosphor chat (speech-with-tail) — distinct from the rectangular speech-bubble used for tooltip chrome.
- **Unicode characters** (• ○ × ✓) are still used in lightweight chrome (claimed/unclaimed dot, lightbox close, "your vote" check). Keep using these in low-fidelity contexts; reach for SVG when scaling matters.
- **Logos**: a single CivicLens glyph — the new lens-with-flag mark — at `assets/civiclens-glyph-color.svg`, with mono and reverse companions for dark surfaces.

## Caveats

- **Fonts not yet selected** — the type section is intentionally TBD. Until a family is locked in, the codebase ships its system stack and components don't depend on any imported web font.
- **No mobile UI**: matches the codebase status. Components designed at desktop widths only.
- **No live API**: UI kit screens use seeded data inline; no backend round-trip.

## How to iterate

The Design System tab shows every registered card. Open any of them to drill in. The `ui_kits/web/index.html` is the click-thru prototype recreating the densest surface (PageView). Tell me which token, component, or screen you'd like a different direction on and I'll branch a variant.
