# CivicLens UI Kit — Web

A high-fidelity, click-thru recreation of the densest surface in CivicLens: the **PageView** (rep page) for owner and citizen perspectives, with the navy navbar, sticky scope filter, post composer, post + poll cards, comment thread, and a Dashboard mode.

Open `index.html` to interact:
- **Toggle perspectives** at top-right: anonymous → citizen → page owner. The composer, scope filter, and engagement gates change accordingly.
- **Owner view** unlocks the Feed ↔ Dashboard toggle and the OwnerScopeFilter (Country / State / District / City).
- **Citizen view** unlocks like/dislike/comment/vote actions; everything is "Unverified."
- **Anonymous view** shows the page read-only and routes engagement attempts to the citizen-login modal stub.

This is a **cosmetic recreation** — components are simple JSX with seeded data. State is local; no backend round-trip.

## Components
| File | Purpose |
|------|---------|
| `Navbar.jsx` | Navy chrome with logo, search, Committees, My tracked, bell, Subscribe, Citizen login |
| `PageHeader.jsx` | Rep avatar + name + role + claim status + perspective toggle |
| `OwnerControls.jsx` | Owner-only Feed/Dashboard toggle |
| `ScopeFilter.jsx` | Both Owner and Viewer scope chip rails |
| `PostComposer.jsx` | Body, poll builder (with timer + presentation modes), scope picker, image strip |
| `PostCard.jsx` | Header + body + image gallery + poll + reactions + comment thread |
| `PollCard.jsx` | All three modes — full / hidden / reveal_after_close |
| `CommentList.jsx` | Comment rows with up/down + Unverified badge |
| `Dashboard.jsx` | Constituent-engagement rollup — summary cards, top posts, top commenters, reactions |
| `Modal.jsx` | Generic modal shell + the citizen-login stub |

## Known cosmetic shortcuts
- Avatar bytes are placeholder initials; no real headshots.
- Map view, ballot tab, compare view are **not** in this kit — the priority order from the design handoff puts PageView first.
- Mobile layouts are out of scope (matches the codebase).
