---
name: civiclens-design
description: Use this skill to generate well-branded interfaces and assets for CivicLens, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation

- **`README.md`** — product context, content fundamentals, visual foundations, iconography. Start here.
- **`colors_and_type.css`** — every design token (colors, type, spacing, radii, shadow, motion). Import directly or copy values.
- **`assets/`** — logo, wordmark, Lucide icon notes.
- **`preview/`** — small specimen cards demonstrating each token / component.
- **`ui_kits/web/`** — click-thru recreation of the rep-page (PageView) surface; modular JSX components you can lift.
- **`_source/frontend/`** — read-only mirror of the codebase. Cross-reference here whenever the live tokens, copy, or component shape matters.

## Load-bearing demo behavior — preserve

These are intentional honesty / anti-brigading mechanisms from the design handoff (section 7). Don't accidentally remove them when restyling:

1. **"Unverified" badge** on every citizen-authored thing.
2. **Owner vs viewer scope filters** are different on purpose. Owner filter affects polls + reactions + comments. Viewer filter affects polls only.
3. **`reveal_after_close` polls** show no counts to non-owners until the close timestamp.
4. **The "Demo preview — these accounts are self-attested" yellow notice** in the citizen-login modal stays.
5. **Two distinct cookies** (`cl_session`, `cl_citizen`) — keep the auth UI showing both can be active at once.

## Voice & content

- "You" for the reader; first-person plural only for system-honesty notices.
- Sentence case for buttons, labels, CTAs. ALL-CAPS only for tiny eyebrow labels.
- Numbers always concrete with `font-variant-numeric: tabular-nums`.
- Emoji are scope/reaction markers, never decorative; never lead with one.

## Visual at a glance

- Anchors: navy `#1b263b` (chrome) + deep green `#2d6a4f` (CTAs/links).
- Party reds/blues are pill-only. Never a CTA fill.
- Backgrounds are `#f8f9fa` page / `#ffffff` cards. No gradients, no patterns.
- Cards: white, `1px solid #dee2e6`, `12px` radius, `14px` padding, no resting shadow.
- Hover lightens; focus uses `0 0 0 3px rgba(45,106,79,0.18)`.
- Motion is restrained: `150ms` hover, `220ms` state, `cubic-bezier(0.2, 0, 0, 1)` ease.
- Iconography: line, 24×24, 2px stroke. Lucide is the proposed library.

## Working pattern

1. **Read `README.md`** for context and the priority order.
2. **Import tokens** by linking `colors_and_type.css` (or copying the relevant `:root` block).
3. **Lift components** from `ui_kits/web/`. They're small and dependency-light — tweak in place.
4. **Refer to `_source/`** for live behavior (engagement gates, scope filtering, modal copy).
5. **When you hit a gap** the codebase doesn't cover (mobile, dark mode, marketing pages), say so and ask before inventing.

## Substitutions to flag if asked

- **`Source Serif 4`** is proposed for editorial moments; codebase is system-stack only today.
- **`JetBrains Mono`** is proposed for monospaced numerics; codebase has no mono today.
- **Lucide** is the proposed icon library; codebase uses hand-rolled inline SVG.

If the user wants to revert any of these, drop the imports from `colors_and_type.css` and the icon note from `assets/lucide.md`.
