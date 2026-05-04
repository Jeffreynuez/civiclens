/* Navbar — navy chrome.
   Updated per review v2:
   - Logo is the lens-with-flag-corner mark (navy + white + muted #8A2929 handle)
   - Search is a rectangular field (8px radius) with `/` keyboard hint
   - Committees + My tracked are real secondary buttons with leading glyphs
   - Subscribe sits as the leftmost CTA (yellow); Citizen pill on the right
   - Citizen state shows a "Maria H. · FL-19" identity chip + Sign out companion
     and a count badge on My tracked / unread badge on the bell
   Cluster order, left → right (after search):
     Committees → My tracked → Bell → Subscribe → Citizen identity
*/

/* ---- Phosphor Duotone glyphs (24 viewBox, scaled down via width/height) ---- */
const Glyph = {
  // Lens-with-flag mark (CivicLens)
  Logo: ({ size = 26 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      {/* Flag canton (top-left) */}
      <rect x="2" y="2" width="11" height="7.5" rx="1" fill="#FFFFFF" opacity="0.95" />
      {/* Stripes */}
      <rect x="13" y="2"   width="17" height="1.5" fill="#FFFFFF" opacity="0.8" />
      <rect x="13" y="5"   width="17" height="1.5" fill="#FFFFFF" opacity="0.8" />
      <rect x="13" y="8"   width="17" height="1.5" fill="#FFFFFF" opacity="0.8" />
      {/* Stars in canton (3 mini dots) */}
      <circle cx="5"  cy="5.7" r="0.7" fill="#1B263B" />
      <circle cx="8"  cy="5.7" r="0.7" fill="#1B263B" />
      <circle cx="11" cy="5.7" r="0.7" fill="#1B263B" />
      {/* Lens body */}
      <circle cx="14" cy="19" r="9" fill="none" stroke="#FFFFFF" strokeWidth="2.2" />
      <circle cx="14" cy="19" r="5.5" fill="#FFFFFF" opacity="0.18" />
      {/* Lens handle, muted burgundy */}
      <line x1="21" y1="25.5" x2="27" y2="30" stroke="#8A2929" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  ),
  Search: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <circle cx="11" cy="11" r="7" fill="rgba(255,255,255,0.18)" />
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M16.5 16.5 L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Committees: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      {/* Three figures, duotone */}
      <circle cx="6"  cy="9"  r="2.4" fill="rgba(255,255,255,0.28)" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="9"  r="2.4" fill="rgba(255,255,255,0.28)" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="7"  r="2.6" fill="rgba(255,255,255,0.28)" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2 19c0-2.5 2-4.5 4.5-4.5S11 16.5 11 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M13 19c0-2.5 2-4.5 4.5-4.5S22 16.5 22 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M7 18c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="rgba(255,255,255,0.28)" />
    </svg>
  ),
  Bookmark: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M6 4h12v17l-6-4-6 4z" fill="rgba(255,255,255,0.28)" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  Bell: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 8 2.5 8H3.5S6 15 6 9Z" fill="rgba(255,255,255,0.22)" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Pin: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z" fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="9" r="2.4" fill="currentColor" />
    </svg>
  ),
};

function Navbar({ persona, onLogin, unreadCount = 0, trackedCount = 0 }) {
  const isCitizen = persona === 'citizen';
  const isOwner   = persona === 'owner';

  // Identity zone copy
  const identityName = isCitizen ? 'Maria H.' : isOwner ? 'Rep · Donalds' : null;
  const identityScope = isCitizen ? 'FL-19' : isOwner ? 'FL-19 · OWNER' : null;

  return (
    <header className="cl-nav">
      <div className="cl-nav__logo">
        <Glyph.Logo size={26} />
        <span>CivicLens</span>
      </div>

      <label className="cl-nav__search" aria-label="Search">
        <Glyph.Search size={16} />
        <input placeholder="Search reps, bills, committees…" />
        <kbd className="cl-nav__kbd" aria-hidden="true">/</kbd>
      </label>

      <button className="cl-nav__btn">
        <Glyph.Committees size={14} />
        <span>Committees</span>
      </button>

      <button className="cl-nav__btn">
        <Glyph.Bookmark size={14} />
        <span>My tracked</span>
        {trackedCount > 0 && <span className="cl-nav__count">{trackedCount}</span>}
      </button>

      <button className="cl-nav__bell" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}>
        <Glyph.Bell size={16} />
        {unreadCount > 0 && <span className="cl-nav__dot">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      <button className="cl-nav__pill cl-nav__pill--subscribe">Subscribe</button>

      {identityName ? (
        <div className="cl-nav__identity">
          <span className="cl-nav__identity-name">{identityName}</span>
          {identityScope && (
            <span className="cl-nav__identity-scope">
              <Glyph.Pin size={11} /> {identityScope}
            </span>
          )}
          <button className="cl-nav__signout" onClick={onLogin}>Sign out</button>
        </div>
      ) : (
        <button className="cl-nav__pill cl-nav__pill--login" onClick={onLogin}>Citizen login</button>
      )}
    </header>
  );
}

window.Navbar = Navbar;
