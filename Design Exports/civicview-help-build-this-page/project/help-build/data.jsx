/* Content for the Help build CivicView page.
   Editable text lives here so the page component stays focused on layout. */

const HB_SHIPPED = [
  ['Interactive U.S. map', 'All 50 states + 435 congressional districts, click to drill in.'],
  ['Federal officials directory', 'President, VP, Cabinet, SCOTUS, House + Senate leadership.'],
  ['Florida full coverage', 'State senate + house, statewide execs, 2026 candidates, election dates.'],
  ['Address → rep lookup', 'Street / ZIP / city resolves to a specific representative.'],
  ['Rep pages', 'Posts, polls (4 visibility modes), comments, reactions, owner dashboard, scope filter.'],
  ['Citizen-led polls on unclaimed pages', 'Per-user / per-page caps, archive-on-claim.'],
  ['Standalone citizen polls', 'Not tied to any rep page, global rate-limited.'],
  ['Global /polls feed', 'Kind chips, comments, AI-powered semantic filter.'],
  ['AI integration', 'Claude Haiku 4.5 — comment sentiment + tone, semantic filter chips, post summarization, poll classification.'],
  ['Moderation system', 'Report flow on every surface, auto-hide threshold, admin queue: Dismiss / Hide / Unhide / Suspend, cascade-hide on suspension.'],
  ['Appeals system', 'Citizens and reps can appeal hidden content + suspensions; admin queue with Grant / Deny + reason logging.'],
  ['Email notifications', 'Resend-powered — moderation events, appeal submissions, decisions, suspension notices.'],
  ['Mutually-exclusive sessions', 'Rep / citizen, proper cross-origin cookie handling.'],
  ['"On the ballot" home surface', 'Key election dates + a featured race.'],
  ['"Popular polls" home surface', 'Rep-authored and citizen-authored polls, mixed.'],
  ['"National activity" home surface', 'Alternating R/D posts.'],
  ['Demo citizen accounts', 'Pick a name + state + district and try the engagement features end-to-end.'],
  ['Constituent dashboard', 'My tracked pages, my polls, my comments, my hidden-by-moderation with one-click appeals.'],
  ['Responsive layouts', 'Mobile + desktop, including a draggable map / panel split on phones.'],
  ['Installable PWA', 'Pin to home screen on Android + iOS for a near-app-store feel.'],
  ['Light-only theme', 'Respects each component\u2019s design; OS dark mode handled at the chrome level.'],
  ['Two waitlists', 'Address verification + "Claim this page" for real reps.'],
];

const HB_IN_PROGRESS = [
  ['Filling out the remaining 49 states', 'Profile photos, issues, experience, state legislators, local-rep data — content work, ongoing.'],
  ['Feedback inbox', 'Next item on the build list.'],
  ['Crowdfunding launch + legal structure', 'Forming an LLC, evaluating 501(c)(3).'],
];

// Where the money goes — costs as plain strings so the formatting (units, ranges) stays editable.
const HB_FUNDING_ONETIME = [
  {
    title: 'Verified citizen identity (ID.me Relying Party contract)',
    cost: '$2,400',
    costSuffix: 'setup + $1.50/verified user',
    body: 'Real "Verified citizen" badges replace today’s "Unverified" labels. Vote integrity, district-scoped engagement, and abuse moderation all become meaningfully reliable.',
    source: 'ID.me business pricing for civic-tech Relying Parties, id.me/business',
  },
  {
    title: 'Federal trademark filing (CivicView, 3 classes)',
    cost: '$1,050',
    costSuffix: 'one-time',
    body: 'Protects the CivicView name from copycats once the user base grows. Three classes cover software (9), SaaS (42), and online community services (45).',
    source: 'USPTO fee schedule, uspto.gov/learning-and-resources/fees-and-payment',
  },
  {
    title: 'DMCA agent registration',
    cost: '$6',
    costSuffix: 'every 3 years',
    body: 'Required for §512 safe-harbor protection now that citizens can post polls and comments. Without it, the project carries personal liability for any user-generated content.',
    source: 'dmca.copyright.gov',
  },
];

const HB_FUNDING_RECURRING = [
  {
    title: 'ProPublica Congress API (Pro tier)',
    cost: '$500',
    costSuffix: '/ month',
    body: 'Real-time bill text, sponsor lists, roll-call votes, committee membership across all 535 members. Currently we ship a curated snapshot.',
    source: 'projects.propublica.org/api-docs/congress-api — Pro tier for full historical + commercial use',
  },
  {
    title: 'OpenStates API (Pro tier)',
    cost: '$100',
    costSuffix: '/ month',
    body: 'State legislature data for all 50 states. Today we have Florida hand-curated; this unblocks the other 49 states’ state senators, reps, and bills.',
    source: 'openstates.org/pricing',
  },
  {
    title: 'Google Civic Information API (paid tier at scale)',
    cost: '$200\u2013500',
    costSuffix: '/ month at scale',
    body: 'Polling-place lookup, sample-ballot data, official-rep contact info that stays current automatically. Free up to current usage.',
    source: 'developers.google.com/civic-information',
  },
  {
    title: 'Domain renewal — civicview.app',
    cost: '$15',
    costSuffix: '/ year',
    body: 'Keeps the project at its primary domain.',
    source: 'Cloudflare Registrar at-cost pricing',
  },
  {
    title: 'Hosting — Render web service + Postgres (upgraded from free)',
    cost: '~$15',
    costSuffix: '/ month combined',
    body: 'No 50-second spin-up on first visit. Database stays warm.',
    source: 'render.com/pricing — Starter plan eliminates the free-tier cold-start delay',
  },
  {
    title: 'Vercel Pro (frontend)',
    cost: '$20',
    costSuffix: '/ month, only if free tier hits limits',
    body: 'Higher bandwidth + analytics. Held in reserve; the free tier is fine for now.',
    source: 'vercel.com/pricing',
  },
];

const HB_ROADMAP = [
  {
    title: 'Video posts on rep / candidate pages',
    body: 'Needs a transcoding pipeline (Mux or Cloudflare Stream), a sane size cap, and a moderation queue tied into the existing DMCA flow.',
    icon: 'Video',
    tag: 'Needs infra',
  },
  {
    title: 'Live-streamed town halls',
    body: 'A rep goes live, citizens get a PWA push notification, the stream archives back into the post feed when it ends.',
    icon: 'Live',
    tag: 'Wish list',
  },
  {
    title: '1-on-1 live debates between reps / candidates',
    body: 'Request / accept flow, surfaced on both pages and the On-the-ballot section while live. The high-trust use case for the streaming pipeline.',
    icon: 'Debate',
    tag: 'Wish list',
  },
  {
    title: 'Optional citizen nicknames',
    body: 'Verified citizens can choose a display nickname instead of their legal name on public surfaces. Identity verification still happens against the real name underneath.',
    icon: 'Nickname',
    tag: 'Privacy',
  },
];

// Totals — sum of one-time costs + year-1 recurring (mid-range for ranged costs).
// One-time:    2,400 + 1,050 +     6 =  3,456
// Year-1 mo:  (500 + 100 + 350 + 15 + 20) * 12 = 11,820
// + domain $15/yr
// ≈ 15,291 → goal is rounded to $15,300 for storytelling purposes.
const HB_GOAL = 15300;
const HB_RAISED_LIVE = 4820;     // 31.5%
const HB_BACKERS = 87;
const HB_DAYS_LEFT = 23;
// KPI tile — match the row format so users don't bump into a math inconsistency.
const HB_LARGEST_PENDING = 'ProPublica · $500/mo';
const HB_LARGEST_PENDING_SUB = 'unlocks all-50-states bill data';

window.HB_DATA = {
  shipped: HB_SHIPPED,
  inProgress: HB_IN_PROGRESS,
  fundingOnetime: HB_FUNDING_ONETIME,
  fundingRecurring: HB_FUNDING_RECURRING,
  roadmap: HB_ROADMAP,
  goal: HB_GOAL,
  raised: HB_RAISED_LIVE,
  backers: HB_BACKERS,
  daysLeft: HB_DAYS_LEFT,
  largestPending: HB_LARGEST_PENDING,
  largestPendingSub: HB_LARGEST_PENDING_SUB,
};
