/* CivicLens Constituent Dashboard — interactive prototype */

const { useState, useMemo } = React;

/* ============ Phosphor-style duotone glyphs (24 viewBox) ============ */
const Icon = {
  Search: ({ s = 16 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" fill="currentColor" opacity="0.22"/>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
      <path d="M16.5 16.5 L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Bell: ({ s = 16 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 8 2.5 8H3.5S6 15 6 9Z"
            fill="currentColor" opacity="0.22" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="miter"/>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="butt"/>
    </svg>
  ),
  Committees: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="6" cy="9" r="2.4" fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="18" cy="9" r="2.4" fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="12" cy="7" r="2.6" fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M2 19c0-2.5 2-4.5 4.5-4.5S11 16.5 11 19" stroke="currentColor" strokeWidth="1.6" fill="none"/>
      <path d="M13 19c0-2.5 2-4.5 4.5-4.5S22 16.5 22 19" stroke="currentColor" strokeWidth="1.6" fill="none"/>
      <path d="M7 18c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.6" fill="currentColor" fillOpacity="0.28"/>
    </svg>
  ),
  Bookmark: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M6 4h12v17l-6-4-6 4z" fill="currentColor" opacity="0.28"
            stroke="currentColor" strokeWidth="1.8" strokeLinejoin="miter"/>
    </svg>
  ),
  Pin: ({ s = 12 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z"
            fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="12" cy="9" r="2.4" fill="currentColor"/>
    </svg>
  ),
  Verified: ({ s = 12 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 2.5l2.5 2 3.2-.4 1.4 2.9 2.9 1.4-.4 3.2 2 2.5-2 2.5.4 3.2-2.9 1.4-1.4 2.9-3.2-.4-2.5 2-2.5-2-3.2.4-1.4-2.9-2.9-1.4.4-3.2-2-2.5 2-2.5-.4-3.2 2.9-1.4L6.3 4.1l3.2.4z"
            fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="miter"/>
      <path d="M8 12.3 L11 15.2 L16 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter" fill="none"/>
    </svg>
  ),
  Bookmark2: ({ s = 14, filled = false }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M6 4h12v17l-6-4-6 4z"
            fill={filled ? 'currentColor' : 'currentColor'}
            opacity={filled ? 1 : 0.22}
            stroke="currentColor" strokeWidth="1.8" strokeLinejoin="miter"/>
    </svg>
  ),
  Vote: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="18" height="14" rx="1.5"
            fill="currentColor" opacity="0.22" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M7 12 l3 3 l5-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="butt" strokeLinejoin="miter" fill="none"/>
      <path d="M3 6 L7 3 H17 L21 6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="miter" fill="none"/>
    </svg>
  ),
  TownHall: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M3 11 L12 4 L21 11" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="miter" fill="currentColor" fillOpacity="0.22"/>
      <rect x="5" y="11" width="14" height="9" stroke="currentColor" strokeWidth="1.8" fill="currentColor" fillOpacity="0.22"/>
      <line x1="9" y1="13" x2="9" y2="20" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="15" y1="13" x2="15" y2="20" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="3" y1="20" x2="21" y2="20" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  ),
  Poll: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="13" width="4" height="8" fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="10" y="8" width="4" height="13" fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="17" y="3" width="4" height="18" fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
  Ballot: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="17" rx="1.5"
            fill="currentColor" opacity="0.22" stroke="currentColor" strokeWidth="1.8"/>
      <line x1="7" y1="9" x2="17" y2="9" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="7" y1="13" x2="17" y2="13" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="7" y1="17" x2="13" y2="17" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
  Chat: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-4 3v-3H6a2 2 0 0 1-2-2z"
            fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="miter"/>
    </svg>
  ),
  Megaphone: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M3 10 v4 l5 1 v-6 z" fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="miter"/>
      <path d="M8 9 L19 4 V20 L8 15 z" fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="miter"/>
      <path d="M10 16 v3 a1 1 0 0 0 1 1 h2 a1 1 0 0 0 1 -1 v-1.7" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="butt"/>
    </svg>
  ),
  ArrowRight: ({ s = 16 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M5 12 H19 M13 6 L19 12 L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter"/>
    </svg>
  ),
  Compare: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="8" height="14" rx="1" fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="13" y="3" width="8" height="17" rx="1" fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
  MapPin: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z"
            fill="currentColor" opacity="0.22" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="12" cy="9" r="2.4" fill="currentColor"/>
    </svg>
  ),
  Settings: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M12 3 v3 M12 18 v3 M3 12 h3 M18 12 h3 M5.5 5.5 l2 2 M16.5 16.5 l2 2 M5.5 18.5 l2 -2 M16.5 7.5 l2 -2"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="butt"/>
    </svg>
  ),
  Plus: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 5 V19 M5 12 H19" stroke="currentColor" strokeWidth="2" strokeLinecap="butt"/>
    </svg>
  ),
  Check: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M5 12.5 L10 17 L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="butt" strokeLinejoin="miter"/>
    </svg>
  ),
  ChevRight: ({ s = 14 }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M9 6 L15 12 L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter"/>
    </svg>
  ),
};

/* ============ Brand mark (mini) ============ */
const Logo = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
    <rect x="2" y="2" width="11" height="7.5" rx="1" fill="#FFFFFF" opacity="0.95"/>
    <rect x="13" y="2" width="17" height="1.5" fill="#FFFFFF" opacity="0.8"/>
    <rect x="13" y="5" width="17" height="1.5" fill="#FFFFFF" opacity="0.8"/>
    <rect x="13" y="8" width="17" height="1.5" fill="#FFFFFF" opacity="0.8"/>
    <circle cx="5" cy="5.7" r="0.7" fill="#1B263B"/>
    <circle cx="8" cy="5.7" r="0.7" fill="#1B263B"/>
    <circle cx="11" cy="5.7" r="0.7" fill="#1B263B"/>
    <circle cx="14" cy="19" r="9" fill="none" stroke="#FFFFFF" strokeWidth="2.2"/>
    <circle cx="14" cy="19" r="5.5" fill="#FFFFFF" opacity="0.18"/>
    <line x1="21" y1="25.5" x2="27" y2="30" stroke="#8A2929" strokeWidth="2.6" strokeLinecap="butt"/>
  </svg>
);

/* ============ Seed data ============ */
const CITIZEN = {
  firstName: 'Maria',
  lastInitial: 'H.',
  fullName: 'Maria Hendricks',
  district: 'FL-19',
  state: 'Florida',
  city: 'Naples',
  initials: 'MH',
};

const REPS = [
  { id: 'r1', name: 'Rick Scott',     title: 'U.S. Senator',     scope: 'Florida',    party: 'r', initials: 'RS', last: '2h ago',  active: true,  following: true  },
  { id: 'r2', name: 'Ashley Moody',   title: 'U.S. Senator',     scope: 'Florida',    party: 'r', initials: 'AM', last: '1d ago',  active: true,  following: true  },
  { id: 'r3', name: 'Byron Donalds',  title: 'U.S. House',       scope: 'FL-19',      party: 'r', initials: 'BD', last: '34m ago', active: true,  following: true  },
  { id: 'r4', name: 'Ron DeSantis',   title: 'Governor',         scope: 'Florida',    party: 'r', initials: 'RD', last: '5d ago',  active: false, following: false },
  { id: 'r5', name: 'Anna Eskamani',  title: 'State House',      scope: 'FL HD-42',   party: 'd', initials: 'AE', last: '3h ago',  active: true,  following: true  },
];

const UPCOMING = [
  {
    id: 'u1', kind: 'vote',
    eyebrow: 'House vote',
    title: 'H.R. 4382 — Coastal Resilience & Flood Insurance Act',
    date: { mo: 'May', day: '02' },
    meta: ['Rep. Donalds is a cosponsor', '142 cosponsors'],
    countdown: 'in 6 days',
    urgent: false,
  },
  {
    id: 'u2', kind: 'townhall',
    eyebrow: 'Town hall',
    title: 'Rep. Donalds — Hurricane prep & SBA recovery',
    date: { mo: 'Apr', day: '29' },
    meta: ['North Collier Reg. Park', '6:30 PM ET'],
    countdown: 'in 3 days',
    urgent: false,
  },
  {
    id: 'u3', kind: 'poll',
    eyebrow: 'Poll closing',
    title: '"Should FL-19 fund a second causeway evacuation route?"',
    date: { mo: 'Apr', day: '27' },
    meta: ['1,247 votes so far', 'District-only scope'],
    countdown: 'closes in 14h',
    urgent: true,
  },
  {
    id: 'u4', kind: 'ballot',
    eyebrow: 'On your ballot',
    title: 'Florida Governor 2026 — primary',
    date: { mo: 'Aug', day: '18' },
    meta: ['4 candidates declared', 'Compare side-by-side'],
    countdown: 'Aug 18, 2026 · 4 months out',
    urgent: false,
  },
];

const ACTIVITY = [
  {
    id: 'a1', kind: 'post',
    eyebrowFrom: 'Sen. Rick Scott',
    eyebrowKind: 'NEW POST',
    excerpt: 'Voted YES on cloture for H.R. 4382 this morning. Florida\u2019s coast can\u2019t wait another insurance cycle. Floor remarks attached.',
    time: '34m ago',
    thumb: 'g1',
  },
  {
    id: 'a2', kind: 'reply',
    eyebrowFrom: 'Reply on your comment',
    eyebrowKind: '',
    excerpt: '"You\u2019re right that the FEMA buyout list hasn\u2019t been updated since 2019 — staff is following up with Region IV today." — Rep. Donalds',
    time: '2h ago',
    thumb: null,
  },
  {
    id: 'a3', kind: 'poll',
    eyebrowFrom: 'You voted',
    eyebrowKind: 'POLL',
    excerpt: '"Should FL-19 fund a second causeway evacuation route?" — You picked YES. Results hidden until close (14h).',
    time: '5h ago',
    thumb: null,
  },
  {
    id: 'a4', kind: 'post',
    eyebrowFrom: 'Rep. Lauren Melo',
    eyebrowKind: 'NEW POST',
    excerpt: 'Filed HB-1144 to streamline state-level Citizens Insurance claims after a federally-declared disaster. Full text in committee Tuesday.',
    time: '8h ago',
    thumb: 'g2',
  },
  {
    id: 'a5', kind: 'post',
    eyebrowFrom: 'Sen. Ashley Moody',
    eyebrowKind: 'NEW POST',
    excerpt: 'Joined a bipartisan letter to the Army Corps requesting an updated Lake Okeechobee discharge schedule ahead of hurricane season.',
    time: '1d ago',
    thumb: 'g3',
  },
];

/* ============ Procedural thumb (gradient SVG, no photos) ============ */
function Thumb({ seed }) {
  if (!seed) return <div className="feed-item__thumb empty"/>;
  const map = {
    g1: ['#1b3a5e', '#457b9d'], // dem-leaning institutional
    g2: ['#3a5a3a', '#7eb685'], // accent green
    g3: ['#4a3a5e', '#8a6e9e'], // independent-ish
  };
  const [a, b] = map[seed] || ['#888', '#bbb'];
  return (
    <div className="feed-item__thumb">
      <svg viewBox="0 0 64 64" className="thumb-art" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`g-${seed}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={a}/>
            <stop offset="100%" stopColor={b}/>
          </linearGradient>
        </defs>
        <rect width="64" height="64" fill={`url(#g-${seed})`}/>
        <circle cx="44" cy="22" r="9" fill="white" opacity="0.18"/>
        <path d="M0 50 L20 38 L34 46 L50 32 L64 42 V64 H0 Z" fill="white" opacity="0.16"/>
      </svg>
    </div>
  );
}

/* ============ Section components ============ */

function Navbar() {
  return (
    <header className="cl-nav">
      <div className="cl-nav__logo"><Logo size={26}/><span>CivicLens</span></div>
      <label className="cl-nav__search">
        <Icon.Search s={16}/>
        <input placeholder="Search reps, bills, committees…"/>
        <kbd className="cl-nav__kbd">/</kbd>
      </label>
      <button className="cl-nav__btn"><Icon.Committees s={14}/> Committees</button>
      <button className="cl-nav__btn"><Icon.Bookmark s={14}/> My tracked <span className="cl-nav__count">5</span></button>
      <button className="cl-nav__bell" aria-label="Notifications">
        <Icon.Bell s={16}/>
        <span className="cl-nav__dot">3</span>
      </button>
      <div className="cl-nav__identity">
        <span className="cl-nav__identity-name">{CITIZEN.firstName} {CITIZEN.lastInitial}</span>
        <span className="cl-nav__identity-scope"><Icon.Pin s={11}/> {CITIZEN.district}</span>
      </div>
    </header>
  );
}

function Welcome({ greeting }) {
  return (
    <section className="welcome">
      <div className="welcome__avatar">{CITIZEN.initials}</div>
      <div className="welcome__info">
        <h1 className="welcome__greeting">
          Good {greeting}, <span className="first">{CITIZEN.firstName}</span>.
        </h1>
        <div className="welcome__strip">
          <span style={{ fontWeight: 600, color: 'var(--cl-text)' }}>{CITIZEN.fullName}</span>
          <span className="sep">·</span>
          <span>{CITIZEN.district} · {CITIZEN.city}, FL</span>
          <span className="welcome__verified" title="Verified — citizen registered in this district">
            <Icon.Verified s={12}/> Verified citizen
          </span>
        </div>
      </div>
      <div className="welcome__date">
        <span style={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800, fontSize: '0.62rem' }}>Today</span>
        <span className="day">Sun, Apr 26</span>
      </div>
    </section>
  );
}

function RepCard({ rep, onToggleFollow }) {
  return (
    <div className="rep-card">
      <div className="rep-card__top">
        <div className={`rep-card__avatar ${rep.party}`}>{rep.initials}</div>
        <div className="rep-card__info">
          <div className="rep-card__name">{rep.name}</div>
          <div className="rep-card__title">
            <span className={`pchip pchip--mini pchip--${rep.party}`}>{rep.party.toUpperCase()}</span>
            <span>{rep.title}</span>
            <span className="sep">·</span>
            <span>{rep.scope}</span>
          </div>
        </div>
      </div>
      <div className="rep-card__bottom">
        <div className="rep-card__active" style={{ border: 'none', padding: 0, flex: 1 }}>
          <span className={`pulse ${rep.active ? '' : 'idle'}`}/>
          <span>{rep.active ? `Active · ${rep.last}` : `Last active ${rep.last}`}</span>
        </div>
        <button
          className={`follow-toggle ${rep.following ? 'active' : ''}`}
          onClick={() => onToggleFollow(rep.id)}
          aria-pressed={rep.following}
        >
          {rep.following ? <Icon.Check s={12}/> : <Icon.Plus s={12}/>}
          {rep.following ? 'Following' : 'Follow'}
        </button>
      </div>
    </div>
  );
}

function Representatives({ reps, onToggleFollow }) {
  return (
    <section>
      <div className="sec-head">
        <span className="sec-head__title">My Representatives</span>
        <a href="#" className="sec-head__link">Manage tracked reps →</a>
      </div>
      <div className="reps-grid">
        {reps.map(r => <RepCard key={r.id} rep={r} onToggleFollow={onToggleFollow}/>)}
      </div>
    </section>
  );
}

function UpcomingCard({ item }) {
  const iconMap = {
    vote: <Icon.Vote s={14}/>,
    townhall: <Icon.TownHall s={14}/>,
    poll: <Icon.Poll s={14}/>,
    ballot: <Icon.Ballot s={14}/>,
  };
  return (
    <div className="upcoming-card">
      <div className="up-date">
        <div className="up-date__mo">{item.date.mo}</div>
        <div className="up-date__day cl-num">{item.date.day}</div>
      </div>
      <div className="up-info">
        <div className={`up-info__eyebrow ${item.kind}`}>
          {iconMap[item.kind]}
          <span>{item.eyebrow}</span>
        </div>
        <div className="up-info__title">{item.title}</div>
        <div className="up-info__meta">
          <span className={`countdown ${item.urgent ? 'urgent' : ''}`}>{item.countdown}</span>
          {item.meta.map((m, i) => <span key={i}>· {m}</span>)}
        </div>
      </div>
      <a href="#" className="up-cta">View <Icon.ChevRight s={12}/></a>
    </div>
  );
}

function Upcoming({ items, empty }) {
  return (
    <section>
      <div className="sec-head">
        <span className="sec-head__title">Upcoming in your district</span>
        <a href="#" className="sec-head__link">See district calendar →</a>
      </div>
      {empty || items.length === 0 ? (
        <div className="empty-state">
          <svg className="empty__art" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="32" fill="#e6f3ec" stroke="#b8dcc6" strokeWidth="1.5"/>
            <rect x="22" y="28" width="36" height="32" rx="3" fill="white" stroke="#2d6a4f" strokeWidth="1.6"/>
            <line x1="22" y1="36" x2="58" y2="36" stroke="#2d6a4f" strokeWidth="1.6"/>
            <line x1="30" y1="24" x2="30" y2="32" stroke="#2d6a4f" strokeWidth="1.8" strokeLinecap="butt"/>
            <line x1="50" y1="24" x2="50" y2="32" stroke="#2d6a4f" strokeWidth="1.8" strokeLinecap="butt"/>
            <circle cx="32" cy="46" r="2" fill="#40916c"/>
            <circle cx="40" cy="46" r="2" fill="#40916c" opacity="0.5"/>
            <circle cx="48" cy="46" r="2" fill="#40916c" opacity="0.3"/>
          </svg>
          <div className="empty__title">Nothing scheduled in {CITIZEN.district} yet</div>
          <div className="empty__copy">We'll surface votes, town halls, and poll closings here as your tracked reps post them.</div>
        </div>
      ) : (
        <div className="upcoming-stack">
          {items.map(it => <UpcomingCard key={it.id} item={it}/>)}
        </div>
      )}
    </section>
  );
}

function FeedItem({ item }) {
  const iconMap = {
    post:  <Icon.Megaphone s={16}/>,
    reply: <Icon.Chat s={16}/>,
    poll:  <Icon.Vote s={16}/>,
  };
  return (
    <a href="#" className="feed-item">
      <div className={`feed-item__icon ${item.kind}`}>{iconMap[item.kind]}</div>
      <div className="feed-item__body">
        <div className="feed-item__eyebrow">
          <span className="strong">{item.eyebrowFrom}</span>
          {item.eyebrowKind && <span> · {item.eyebrowKind}</span>}
        </div>
        <div className="feed-item__excerpt">{item.excerpt}</div>
        <div className="feed-item__time">{item.time}</div>
      </div>
      <Thumb seed={item.thumb}/>
      <div className="feed-arrow"><Icon.ArrowRight s={16}/></div>
    </a>
  );
}

function ActivityFeed({ items, empty }) {
  return (
    <section>
      <div className="sec-head">
        <span className="sec-head__title">Recent activity</span>
        <span style={{ fontSize: 'var(--cl-text-xs)', color: 'var(--cl-text-muted)' }}>Reverse-chronological · last 7 days</span>
      </div>
      {empty || items.length === 0 ? (
        <div className="empty-state">
          <svg className="empty__art" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="32" fill="#f1f3f5" stroke="#dee2e6" strokeWidth="1.5"/>
            <path d="M28 32 H52 V46 L42 46 L36 52 V46 H28 Z" fill="white" stroke="#1b263b" strokeWidth="1.6" strokeLinejoin="miter"/>
            <line x1="32" y1="38" x2="48" y2="38" stroke="#1b263b" strokeWidth="1.4"/>
            <line x1="32" y1="42" x2="44" y2="42" stroke="#1b263b" strokeWidth="1.4"/>
          </svg>
          <div className="empty__title">No recent activity yet</div>
          <div className="empty__copy">When your tracked reps post, when polls you voted on close, or when someone replies to your comments — it'll show up here.</div>
        </div>
      ) : (
        <React.Fragment>
          <div className="feed-stack">
            {items.map(it => <FeedItem key={it.id} item={it}/>)}
          </div>
          <div className="feed-foot">
            <a href="#">See all activity →</a>
          </div>
        </React.Fragment>
      )}
    </section>
  );
}

function BallotSnapshot() {
  return (
    <div className="rail-card ballot-card">
      <div className="rail-card__head">
        <span className="rail-card__title">Your ballot</span>
        <Icon.Ballot s={14}/>
      </div>
      <div className="countdown-big">
        <span className="days cl-num">114</span>
        <span className="days-label">days until<br/>your next election</span>
      </div>
      <div className="election-name">Florida primary</div>
      <div className="election-date">Tuesday, August 18, 2026</div>
      <div className="race-line">
        <span className="label">Federal races</span>
        <span className="num cl-num">3</span>
      </div>
      <div className="race-line">
        <span className="label">State races</span>
        <span className="num cl-num">5</span>
      </div>
      <div className="race-line">
        <span className="label">Local races</span>
        <span className="num cl-num">4</span>
      </div>
      <div className="race-line">
        <span className="label">Ballot measures</span>
        <span className="num cl-num">2</span>
      </div>
      <a href="#" className="cta-block" style={{ marginTop: 14 }}>
        View your ballot <Icon.ArrowRight s={14}/>
      </a>
    </div>
  );
}

function EngagementSummary() {
  return (
    <div className="rail-card">
      <div className="rail-card__head">
        <span className="rail-card__title">Your activity · April</span>
      </div>
      <div className="engage-grid">
        <div className="engage-stat">
          <div className="engage-stat__num cl-num">12</div>
          <div className="engage-stat__label">Polls cast</div>
        </div>
        <div className="engage-stat">
          <div className="engage-stat__num cl-num">4</div>
          <div className="engage-stat__label">Comments left</div>
        </div>
        <div className="engage-stat">
          <div className="engage-stat__num cl-num">5</div>
          <div className="engage-stat__label">Reps tracked</div>
        </div>
        <div className="engage-stat">
          <div className="engage-stat__num cl-num">28</div>
          <div className="engage-stat__label">Reactions</div>
        </div>
      </div>
      <div className="engage-foot">
        That's more civic engagement than 78% of {CITIZEN.district} this month.
      </div>
    </div>
  );
}

function QuickLinks() {
  const links = [
    { icon: <Icon.Compare s={14}/>,  label: 'Compare candidates' },
    { icon: <Icon.MapPin s={14}/>,   label: 'Find your polling place' },
    { icon: <Icon.Settings s={14}/>, label: 'Account settings' },
  ];
  return (
    <div className="rail-card">
      <div className="rail-card__head">
        <span className="rail-card__title">Quick links</span>
      </div>
      <div className="quick-links">
        {links.map((l, i) => (
          <a key={i} href="#" className="quick-link">
            <span className="quick-link__icon">{l.icon}</span>
            <span className="quick-link__txt">{l.label}</span>
            <span className="ql-arrow"><Icon.ChevRight s={14}/></span>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ============ Tweaks ============ */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "showUpcoming": true,
  "showActivity": true,
  "greeting": "afternoon",
  "denseReps": false
}/*EDITMODE-END*/;

function TweaksPanel({ open, tweaks, setTweak, onClose }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', right: 20, bottom: 20, width: 280, zIndex: 2000,
      background: 'white', border: '1px solid var(--cl-border)',
      borderRadius: 12, boxShadow: 'var(--cl-shadow-pop)', padding: 16,
      fontFamily: 'var(--cl-font-sans)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <strong style={{ fontSize: '0.85rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Tweaks</strong>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: 18, color: '#6c757d' }}>×</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.82rem' }}>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Greeting</div>
          <div style={{ display: 'flex', gap: 4, background: '#f1f3f5', padding: 3, borderRadius: 999 }}>
            {['morning','afternoon','evening'].map(g => (
              <button key={g}
                onClick={() => setTweak('greeting', g)}
                style={{
                  flex: 1, padding: '6px 8px', borderRadius: 999, border: 'none',
                  background: tweaks.greeting === g ? 'white' : 'transparent',
                  fontSize: '0.72rem', fontWeight: 600,
                  boxShadow: tweaks.greeting === g ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  textTransform: 'capitalize',
                }}>{g}</button>
            ))}
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <span>Show upcoming section</span>
          <input type="checkbox" checked={tweaks.showUpcoming}
                 onChange={e => setTweak('showUpcoming', e.target.checked)}/>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <span>Show activity feed</span>
          <input type="checkbox" checked={tweaks.showActivity}
                 onChange={e => setTweak('showActivity', e.target.checked)}/>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <span>Empty state for activity</span>
          <input type="checkbox" checked={tweaks.activityEmpty || false}
                 onChange={e => setTweak('activityEmpty', e.target.checked)}/>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <span>Empty state for upcoming</span>
          <input type="checkbox" checked={tweaks.upcomingEmpty || false}
                 onChange={e => setTweak('upcomingEmpty', e.target.checked)}/>
        </label>
      </div>
    </div>
  );
}

/* ============ App ============ */
function App() {
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [reps, setReps] = useState(REPS);

  React.useEffect(() => {
    const onMsg = (e) => {
      if (!e.data || !e.data.type) return;
      if (e.data.type === '__activate_edit_mode')   setTweaksOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const setTweak = (k, v) => {
    const next = typeof k === 'object' ? { ...tweaks, ...k } : { ...tweaks, [k]: v };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: typeof k === 'object' ? k : { [k]: v } }, '*');
  };

  const toggleFollow = (id) => {
    setReps(rs => rs.map(r => r.id === id ? { ...r, following: !r.following } : r));
  };

  const closeTweaks = () => {
    setTweaksOpen(false);
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  };

  return (
    <React.Fragment>
      <Navbar/>
      <main className="dash-shell" data-screen-label="Constituent Dashboard">
        <Welcome greeting={tweaks.greeting}/>
        <div className="dash-grid">
          <div className="col-main">
            <Representatives reps={reps} onToggleFollow={toggleFollow}/>
            {tweaks.showUpcoming && <Upcoming items={UPCOMING} empty={tweaks.upcomingEmpty}/>}
            {tweaks.showActivity && <ActivityFeed items={ACTIVITY} empty={tweaks.activityEmpty}/>}
          </div>
          <div className="col-rail">
            <BallotSnapshot/>
            <EngagementSummary/>
            <QuickLinks/>
          </div>
        </div>
      </main>
      <TweaksPanel open={tweaksOpen} tweaks={tweaks} setTweak={setTweak} onClose={closeTweaks}/>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
