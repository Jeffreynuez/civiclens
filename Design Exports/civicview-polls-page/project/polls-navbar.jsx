/* PollsNavbar — production-matching navbar for CivicView.

   Layout (from production screenshot):
     [Logo glyph] [CivicView]                 ...
                     [Signed in (2) ▾]   ← identity picker pill
                     [✨ Help build this]   ← green pill, sparkle
                     [Subscribe]            ← yellow primary
                     [My Tracked (4)]
                     [🔔 with dot]
                     [☰]

   Compact mode (≤1023px container) hides the inner cluster — kept by CSS
   container queries on .polls-page.
*/

const NavGlyph = {
  // CivicView wordmark glyph — lens + flag corner
  Lens: ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="2" y="2" width="11" height="7.5" rx="1" fill="#FFFFFF" opacity="0.95" />
      <rect x="13" y="2"   width="17" height="1.5" fill="#FFFFFF" opacity="0.8" />
      <rect x="13" y="5"   width="17" height="1.5" fill="#FFFFFF" opacity="0.8" />
      <rect x="13" y="8"   width="17" height="1.5" fill="#FFFFFF" opacity="0.8" />
      <circle cx="5"  cy="5.7" r="0.7" fill="#1B263B" />
      <circle cx="8"  cy="5.7" r="0.7" fill="#1B263B" />
      <circle cx="11" cy="5.7" r="0.7" fill="#1B263B" />
      <circle cx="14" cy="19" r="9" fill="none" stroke="#FFFFFF" strokeWidth="2.2" />
      <circle cx="14" cy="19" r="5.5" fill="#FFFFFF" opacity="0.18" />
      <line x1="21" y1="25.5" x2="27" y2="30" stroke="#8A2929" strokeWidth="2.6" strokeLinecap="round" />
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
      <path d="M12 3 L13.8 9.6 L20.4 11.4 L13.8 13.2 L12 19.8 L10.2 13.2 L3.6 11.4 L10.2 9.6 Z"
            fill={color} opacity="0.28" stroke={color} strokeWidth="1.6" strokeLinejoin="miter" />
      <path d="M19 4 L19.6 6 L21.6 6.6 L19.6 7.2 L19 9.2 L18.4 7.2 L16.4 6.6 L18.4 6 Z" fill={color} />
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
  Chev: ({ size = 10, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9 L12 15 L18 9" stroke={color} strokeWidth="2.2" strokeLinecap="butt" strokeLinejoin="miter" fill="none" />
    </svg>
  ),
};

function PollsNavbar({ signedIn = true, identityCount = 1, identityName = 'Maria H.', trackedCount = 4, unread = true }) {
  return (
    <header className="cv-nav2">
      <div className="cv-nav2__brand">
        <NavGlyph.Lens size={22} />
        <span className="cv-nav2__wordmark">CivicView</span>
      </div>

      <div className="cv-nav2__cluster">
        {signedIn ? (
          <button className="cv-nav2__id">
            <NavGlyph.Person size={14} color="rgba(255,255,255,0.78)" />
            <span>Signed in</span>
            <span className="cv-nav2__id-count cl-num">{identityCount}</span>
            <NavGlyph.Chev size={10} color="rgba(255,255,255,0.7)" />
          </button>
        ) : (
          <>
            <button className="cv-nav2__ghost">Log in</button>
            <button className="cv-nav2__signup">Sign up</button>
          </>
        )}

        <button className="cv-nav2__helpbuild">
          <NavGlyph.Spark size={13} color="white" />
          <span>Help build this</span>
        </button>

        <button className="cv-nav2__primary">Subscribe</button>

        <button className="cv-nav2__ghost">
          <NavGlyph.Bookmark size={13} color="rgba(255,255,255,0.92)" />
          <span>My Tracked</span>
          {trackedCount > 0 && (
            <span className="cv-nav2__pillcount cl-num">{trackedCount}</span>
          )}
        </button>

        <button className="cv-nav2__icon" aria-label="Notifications">
          <NavGlyph.Bell size={16} color="white" />
          {unread && <span className="cv-nav2__dot" aria-hidden="true" />}
        </button>

        <button className="cv-nav2__icon" aria-label="Menu">
          <NavGlyph.Hamburger size={16} color="white" />
        </button>
      </div>
    </header>
  );
}

window.PollsNavbar = PollsNavbar;
window.NavGlyph = NavGlyph;
