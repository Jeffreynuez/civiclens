# CivicView

A civic-engagement web and mobile app that helps citizens find and follow
their federal, state, and local representatives — bills, votes, town halls,
and what they say in their district.

## Repository layout

- `frontend/` — Next.js 14 (App Router) + React 18 + Tailwind. The user-
  facing web and PWA app.
- `backend/` — FastAPI + SQLAlchemy + SQLite. Address lookup, civic-data
  aggregation, social/Pages feature, citizen + rep auth.
- `Design Exports/` — Reference design-system snapshots (not part of the
  running app).

## Quick start

- [`SETUP_GUIDE.md`](./SETUP_GUIDE.md) — local dev: run the frontend and
  backend locally, test on a real phone via Wi-Fi or Tailscale.
- [`DEPLOY.md`](./DEPLOY.md) — production deploy: Vercel + Render +
  Cloudflare DNS, end-to-end walkthrough for putting the app on
  `civicview.app`.

## License

CivicView is **proprietary software**. All source code, designs, content,
and assets are © 2026 Jeffrey Nuez. All rights reserved.

No part of this repository may be copied, modified, distributed, or
otherwise used without the express written permission of the copyright
holder. See [`LICENSE`](./LICENSE) for full terms.

For licensing inquiries: jeffreynuez1@gmail.com

## Roadmap / future IP work

Tracked in this list rather than as code TODOs:

- **Trademark filing for CivicView** — three classes (9, 42, 45) at
  ~$350/class via the USPTO TEAS Standard path. Deferred until the
  budget allows, since "social media for politicians" doesn't have
  a pre-approved ID Manual entry and writing our own adds $200/class.
- **Copyright registration with the US Copyright Office** — $45–85
  via the eCO portal. Deposit is the first 25 + last 25 pages of
  source code. Worth doing once the codebase stabilizes after the
  next round of features.
- **DMCA agent registration** — $6 every 3 years at
  [dmca.copyright.gov](https://dmca.copyright.gov). Needed for §512
  safe-harbor protection once the rep-Pages comment threads have
  real user traffic. Without a registered agent, we can be held
  liable for whatever users post; with one, we're shielded as long
  as we act on takedown notices. Also need a clear takedown contact
  posted on the site.
- **Open-source carve-outs** — if any subset of CivicView ever ships
  as an open-source library (e.g. the design-system tokens or the
  district-geometry helpers), spin those into a separate repo with
  an OSS license rather than trying to dual-license the monorepo.

## Future product features

Product ideas captured for a future release — not in scope for the
current build, but worth keeping the threads visible:

- **Video posts on rep / candidate Pages** — let verified reps and
  candidates attach video to their posts, not just text + images.
  Needs a transcoding pipeline (probably Mux or Cloudflare Stream),
  a size cap, and a moderation queue tied into the existing
  takedown / DMCA flow.
- **Live-streamed town halls** — first-class "Live" affordance on a
  rep / candidate Page: they go live, citizens get a push
  notification (using the PWA notification stack already in place),
  and the stream archives back into their post feed afterward.
  Pairs naturally with the Pages comment thread for live Q&A.
- **1-on-1 live debates between reps / candidates** — a request /
  accept flow where one official can challenge another to a live
  scheduled debate, surfaced on both their Pages and on the On-the-
  ballot home-page section while live. Same streaming + archival
  infrastructure as town halls; the new piece is the invitation /
  scheduling state machine.
- **Citizen-authored polls on unclaimed rep Pages** — once a rep's
  Page has been auto-generated but not yet claimed by the official,
  let *Subscribed* citizens (paid tier) post polls that show up
  in the Page feed. Gives the community a way to surface what they
  care about and creates an incentive for the rep to claim the
  Page. Needs anti-brigading rate limits and a clear "unclaimed"
  visual treatment so polls aren't mistaken for the rep's own.
- **Optional citizen nicknames** — a verified citizen should be
  able to choose a display nickname instead of their legal name on
  any public surface (poll authorship, comment threads, the future
  citizen-led-poll feature). Identity verification still happens
  against the real name + address (so vote integrity, district
  scoping, and abuse moderation aren't weakened), but what the rest
  of the community *sees* is the user's choice. Profile gets a
  "Display name" field with a one-time uniqueness check; existing
  references update on save. Pairs with a small "verified citizen"
  pill so a nickname doesn't read as anonymous — it reads as
  "verified, just doesn't want to publish their legal name."
