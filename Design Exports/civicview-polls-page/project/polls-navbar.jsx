/* PollsNavbar — production-matching navbar for CivicView.

   Structure (desktop ≥1024px):
     [US flag glyph] [CivicView]      ...     [identity pill] [Sign out]
                                              [Subscribe] [Polls] [My Tracked]
                                              [Bell] [Hamburger]

   Below 1024px: keep flag + wordmark + Subscribe (smaller) + Bell + Hamburger.
   Collapse Polls / My Tracked / identity / Sign out into the hamburger drawer.

   Logged-out state: identity + Sign out → "Log in" + "Sign up".
*/

const NavGlyph = {
  Flag: ({ size = 18 }) => (
    <svg width={size} height={size * 0.72} viewBox="0 0 25 18" aria-hidden="true">
      {/* canton */}
      <rect x="0" y="0" width="11" height="9.5" fill="#1B263B" />
      {/* star dots in canton */}
      <circle cx="2.3" cy="2.4" r="0.55" fill="white" />
      <circle cx="5.3" cy="2.4" r="0.55" fill="white" />
      <circle cx="8.3" cy="2.4" r="0.55" fill="white" />
      <circle cx="3.8" cy="4.4" r="0.55" fill="white" />
      <circle cx="6.8" cy="4.4" r="0.55" fill="white" />
      <circle cx="2.3" cy="6.4" r="0.55" fill="white" />
      <circle cx="5.3" cy="6.4" r="0.55" fill="white" />
      <circle cx="8.3" cy="6.4" r="0.55" fill="white" />
      {/* stripes — right of canton */}
      <rect x="11" y="0"    width="14" height="1.4" fill="#D63031" />
      <rect x="11" y="2.8"  width="14" height="1.4" fill="#D63031" />
      <rect x="11" y="5.6"  width="14" height="1.4" fill="#D63031" />
      <rect x="11" y="8.4"  width="14" height="1.4" fill="#D63031" />
      {/* stripes — full width below canton */}
      <rect x="0" y="9.5"  width="25" height="1.4" fill="#D63031" />
      <rect x="0" y="12.3" width="25" height="1.4" fill="#D63031" />
      <rect x="0" y="15.1" width="25" height="1.4" fill="#D63031" />
    </svg>
  ),
  Person: ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.4" fill={color} opacity="0.28" stroke={color} strokeWidth="1.7" />
      <path d="M4.5 20c0-3.8 3.4-6.8 7.5-6.8s7.5 3 7.5 6.8" stroke={color} strokeWidth="1.7" fill={color} fillOpacity="0.22" strokeLinecap="butt" />
    </svg>
  ),
  Spark: ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 14 L9 11 L11 6 L13 11 L18 14 L13 17 L11 22 L9 17 Z"
            fill={color} opacity="0.28" stroke={color} strokeWidth="1.7" strokeLinejoin="miter" />
      <circle cx="19" cy="5" r="1.4" fill={color} />
    </svg>
  ),
  Bookmark: ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 4h12v17l-6-4-6 4z" fill={color} opacity="0.28" stroke={color} strokeWidth="1.7" strokeLinejoin="miter" />
    </svg>
  ),
  Bell: ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 8 2.5 8H3.5S6 15 6 9Z" fill={color} opacity="0.22" stroke={color} strokeWidth="1.7" strokeLinejoin="miter" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" stroke={color} strokeWidth="1.7" strokeLinecap="butt" />
    </svg>
  ),
  Hamburger: ({ size = 18, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7 L20 7 M4 12 L20 12 M4 17 L20 17" stroke={color} strokeWidth="2" strokeLinecap="butt" />
    </svg>
  ),
};

function PollsNavbar({ signedIn = true, isAdmin = false, identityName = 'Maria H.', identityScope = 'FL-19' }) {
  // All elements always render; CSS container queries on .polls-page
  // hide the collapsed cluster (identity / Sign out / Polls / My Tracked)
  // below 1024px to match production. The hamburger drawer carries
  // those items at compact widths.
  return (
    <header className="cv-nav2">
      <div className="cv-nav2__brand">
        <NavGlyph.Flag size={20} />
        <span className="cv-nav2__wordmark">CivicView</span>
      </div>

      <div className="cv-nav2__cluster">
        {signedIn ? (
          <>
            <span className="cv-nav2__id">
              <NavGlyph.Person size={14} color="rgba(255,255,255,0.78)" />
              <span>{isAdmin ? 'CivicView Admin' : `${identityName} · ${identityScope}`}</span>
            </span>
            <button className="cv-nav2__ghost">Sign out</button>
          </>
        ) : (
          <>
            <button className="cv-nav2__ghost">Log in</button>
            <button className="cv-nav2__signup">Sign up</button>
          </>
        )}

        <button className="cv-nav2__primary">Subscribe</button>

        <button className="cv-nav2__ghost cv-nav2__ghost--current" aria-current="page">
          <NavGlyph.Spark size={14} color="rgba(255,255,255,0.92)" />
          <span>Polls</span>
        </button>
        <button className="cv-nav2__ghost">
          <NavGlyph.Bookmark size={14} color="rgba(255,255,255,0.92)" />
          <span>My Tracked</span>
        </button>

        <button className="cv-nav2__icon" aria-label="Notifications">
          <NavGlyph.Bell size={16} color="white" />
          <span className="cv-nav2__dot" aria-hidden="true" />
        </button>

        <button className="cv-nav2__icon" aria-label="Menu">
          <NavGlyph.Hamburger size={16} color="white" />
        </button>
      </div>
    </header>
  );
}

window.PollsNavbar = PollsNavbar;
