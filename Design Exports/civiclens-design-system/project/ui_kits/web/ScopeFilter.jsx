/* Scope filter — Owner & Viewer rails.
   Updated per review: emoji removed; replaced with custom navy glyphs paired
   with text. Glyphs are 14×14 inside the chip; flip to white when chip is
   active (accent-green fill). Glyphs are NEVER the only signal — text labels
   carry the meaning; the glyphs are recognition aids. */

const ScopeGlyphs = {
  // Country — 5-star constellation (calls back to logo's flag canton)
  country: ({ stroke, fill }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      {[
        [5,  6],
        [12, 4],
        [19, 6],
        [8,  14],
        [16, 14],
      ].map(([cx, cy], i) => {
        // tiny 5-point star at each anchor, drawn as a polygon
        const r1 = 2.4, r2 = 1.0;
        const pts = [];
        for (let k = 0; k < 10; k++) {
          const a = (Math.PI / 5) * k - Math.PI / 2;
          const r = k % 2 === 0 ? r1 : r2;
          pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
        }
        return <polygon key={i} points={pts.join(' ')} fill={fill} stroke={stroke} strokeWidth="0.6" strokeLinejoin="round" />;
      })}
      {/* Connecting hint line at the bottom for "constellation" feel */}
      <path d="M5 19 H19" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
    </svg>
  ),
  // State — flag glyph (matches duotone iconography set)
  state: ({ stroke, fill }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M5 3 V22" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <path d="M5 4 C 9 2, 13 6, 17 4 L 17 13 C 13 15, 9 11, 5 13 Z"
            fill={fill} stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  // District — irregular 7-sided polygon outline (redistricted CD boundary), no fill, sharp miter
  district: ({ stroke }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <polygon
        points="5,7 11,3 18,5 21,11 18,18 11,20 4,15"
        fill="none" stroke={stroke} strokeWidth="1.8" strokeLinejoin="miter" strokeMiterlimit="6" />
    </svg>
  ),
  // City — buildings glyph (matches iconography set)
  city: ({ stroke, fill }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3"  y="9"  width="6"  height="12" fill={fill} stroke={stroke} strokeWidth="1.6" />
      <rect x="9"  y="4"  width="7"  height="17" fill={fill} stroke={stroke} strokeWidth="1.6" />
      <rect x="16" y="11" width="5"  height="10" fill={fill} stroke={stroke} strokeWidth="1.6" />
      {/* Windows */}
      <rect x="5"  y="12" width="1.4" height="1.4" fill={stroke} />
      <rect x="5"  y="15" width="1.4" height="1.4" fill={stroke} />
      <rect x="11" y="7"  width="1.4" height="1.4" fill={stroke} />
      <rect x="11" y="11" width="1.4" height="1.4" fill={stroke} />
      <rect x="11" y="15" width="1.4" height="1.4" fill={stroke} />
      <rect x="17.5" y="14" width="1.4" height="1.4" fill={stroke} />
    </svg>
  ),
};

const SCOPES = [
  { id: 'country',  label: 'Country'  },
  { id: 'state',    label: 'State'    },
  { id: 'district', label: 'District' },
  { id: 'city',     label: 'City'     },
];

function ScopeFilter({ persona, scope, onChange }) {
  if (persona === 'anonymous') return null;
  const isOwner = persona === 'owner';
  return (
    <div className="cl-scope">
      <div className="cl-scope__rail">
        <span className="cl-scope__label">{isOwner ? 'Filter engagement' : 'Filter polls'}</span>
        {SCOPES.map(s => {
          const isActive = scope === s.id;
          const G = ScopeGlyphs[s.id];
          // Active: white-on-green. Inactive: navy stroke + 28% accent fill (duotone).
          const stroke = isActive ? '#ffffff' : 'var(--cl-primary)';
          const fill   = isActive ? 'rgba(255,255,255,0.30)' : 'rgba(45,106,79,0.28)';
          return (
            <button
              key={s.id}
              className={`cl-chip ${isActive ? 'active' : ''}`}
              onClick={() => onChange(scope === s.id ? null : s.id)}
              aria-pressed={isActive}
            >
              <G stroke={stroke} fill={fill} />
              {s.label}
            </button>
          );
        })}
        {!isOwner ? (
          <span style={{ fontSize: 'var(--cl-text-xs)', color: 'var(--cl-text-light)', marginLeft: 6 }}>
            Your scope only affects polls — comment + reaction counts stay aggregate.
          </span>
        ) : null}
      </div>
    </div>
  );
}

window.ScopeFilter = ScopeFilter;
