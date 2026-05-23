/* CivicView /polls — Phosphor-duotone-style glyphs.
   24x24 viewBox, 2px stroke, sharp caps, navy stroke + 28% accent fill.
   Active states are filled white in the kind chips. */

const PollsGlyph = {
  // --- Kind-row glyphs ---
  AllPolls: ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4"  width="18" height="3.2" rx="1" fill={color} opacity="0.28" />
      <rect x="3" y="10.4" width="18" height="3.2" rx="1" fill={color} opacity="0.28" />
      <rect x="3" y="16.8" width="18" height="3.2" rx="1" fill={color} opacity="0.28" />
      <rect x="3" y="4"  width="18" height="3.2" rx="1" stroke={color} strokeWidth="1.6" />
      <rect x="3" y="10.4" width="18" height="3.2" rx="1" stroke={color} strokeWidth="1.6" />
      <rect x="3" y="16.8" width="18" height="3.2" rx="1" stroke={color} strokeWidth="1.6" />
    </svg>
  ),
  FromReps: ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* podium / lectern shape — represents official voice */}
      <path d="M5 9 L19 9 L18 4 L6 4 Z" fill={color} opacity="0.28" stroke={color} strokeWidth="1.6" strokeLinejoin="miter" />
      <rect x="9" y="9" width="6" height="11" stroke={color} strokeWidth="1.6" fill={color} fillOpacity="0.18" />
      <path d="M4 20 L20 20" stroke={color} strokeWidth="1.8" strokeLinecap="butt" />
    </svg>
  ),
  FromCitizens: ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* three figures — citizens */}
      <circle cx="6"  cy="9"  r="2.2" fill={color} opacity="0.28" />
      <circle cx="18" cy="9"  r="2.2" fill={color} opacity="0.28" />
      <circle cx="12" cy="7"  r="2.4" fill={color} opacity="0.28" />
      <circle cx="6"  cy="9"  r="2.2" stroke={color} strokeWidth="1.6" />
      <circle cx="18" cy="9"  r="2.2" stroke={color} strokeWidth="1.6" />
      <circle cx="12" cy="7"  r="2.4" stroke={color} strokeWidth="1.6" />
      <path d="M2 19c0-2.4 1.8-4 4-4s4 1.6 4 4" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="butt" />
      <path d="M14 19c0-2.4 1.8-4 4-4s4 1.6 4 4" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="butt" />
      <path d="M7 19c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke={color} strokeWidth="1.6" fill={color} fillOpacity="0.2" strokeLinecap="butt" />
    </svg>
  ),
  Standalone: ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* speech-with-tail chat glyph */}
      <path d="M4 5 H20 V16 H10 L6 20 V16 H4 Z" fill={color} opacity="0.28" stroke={color} strokeWidth="1.6" strokeLinejoin="miter" />
      <circle cx="8.5"  cy="10.5" r="1" fill={color} />
      <circle cx="12"   cy="10.5" r="1" fill={color} />
      <circle cx="15.5" cy="10.5" r="1" fill={color} />
    </svg>
  ),

  // --- New: branch-filter glyphs ---
  Bill: ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* document with horizontal lines */}
      <path d="M6 3 H15 L19 7 V21 H6 Z" fill={color} opacity="0.28" stroke={color} strokeWidth="1.6" strokeLinejoin="miter" />
      <path d="M15 3 V7 H19" stroke={color} strokeWidth="1.6" fill="none" strokeLinejoin="miter" />
      <path d="M9 11 H16 M9 14 H16 M9 17 H13" stroke={color} strokeWidth="1.4" strokeLinecap="butt" />
    </svg>
  ),
  Committee: ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* round-table — circle + 4 chair dots */}
      <circle cx="12" cy="12" r="5" fill={color} opacity="0.28" stroke={color} strokeWidth="1.6" />
      <circle cx="12" cy="4" r="1.6" fill={color} />
      <circle cx="12" cy="20" r="1.6" fill={color} />
      <circle cx="4" cy="12" r="1.6" fill={color} />
      <circle cx="20" cy="12" r="1.6" fill={color} />
    </svg>
  ),
  Executive: ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* simplified White House: pediment over columns */}
      <path d="M3 9 L12 4 L21 9 Z" fill={color} opacity="0.28" stroke={color} strokeWidth="1.6" strokeLinejoin="miter" />
      <rect x="4" y="9" width="16" height="2" fill={color} opacity="0.4" />
      <rect x="6"  y="11" width="2" height="8" fill={color} opacity="0.28" stroke={color} strokeWidth="1.4" />
      <rect x="11" y="11" width="2" height="8" fill={color} opacity="0.28" stroke={color} strokeWidth="1.4" />
      <rect x="16" y="11" width="2" height="8" fill={color} opacity="0.28" stroke={color} strokeWidth="1.4" />
      <path d="M3 20 H21" stroke={color} strokeWidth="1.6" strokeLinecap="butt" />
    </svg>
  ),
  Judicial: ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* scales of justice */}
      <path d="M12 4 V20" stroke={color} strokeWidth="1.6" strokeLinecap="butt" />
      <path d="M5 8 H19" stroke={color} strokeWidth="1.6" strokeLinecap="butt" />
      <path d="M5 8 L3 13 H7 Z" fill={color} opacity="0.28" stroke={color} strokeWidth="1.4" strokeLinejoin="miter" />
      <path d="M19 8 L17 13 H21 Z" fill={color} opacity="0.28" stroke={color} strokeWidth="1.4" strokeLinejoin="miter" />
      <path d="M8 20 H16" stroke={color} strokeWidth="1.6" strokeLinecap="butt" />
    </svg>
  ),
  FromCandidates: ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* single figure with star (candidate / aspirational) */}
      <circle cx="9" cy="8" r="2.8" fill={color} opacity="0.28" stroke={color} strokeWidth="1.6" />
      <path d="M3 20c0-3 2.7-5.4 6-5.4s6 2.4 6 5.4" stroke={color} strokeWidth="1.6" fill={color} fillOpacity="0.22" strokeLinecap="butt" />
      {/* star top right */}
      <path d="M18 5 L19 8 L22 8.5 L19.5 10.5 L20.5 13.5 L18 12 L15.5 13.5 L16.5 10.5 L14 8.5 L17 8 Z" fill={color} opacity="0.85" />
    </svg>
  ),

  // --- Misc ---
  Plus: ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4 L12 20 M4 12 L20 12" stroke={color} strokeWidth="2.2" strokeLinecap="butt" />
    </svg>
  ),
  Sparkle: ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 L13.8 9.6 L20.4 11.4 L13.8 13.2 L12 19.8 L10.2 13.2 L3.6 11.4 L10.2 9.6 Z"
            fill={color} opacity="0.28" stroke={color} strokeWidth="1.6" strokeLinejoin="miter" />
      <path d="M19 4 L19.6 6 L21.6 6.6 L19.6 7.2 L19 9.2 L18.4 7.2 L16.4 6.6 L18.4 6 Z"
            fill={color} />
    </svg>
  ),
  Close: ({ size = 12, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 5 L19 19 M19 5 L5 19" stroke={color} strokeWidth="2.2" strokeLinecap="butt" />
    </svg>
  ),
  Chat: ({ size = 12, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5 H20 V16 H10 L6 20 V16 H4 Z" stroke={color} strokeWidth="1.8" fill={color} fillOpacity="0.22" strokeLinejoin="miter" />
    </svg>
  ),
  Vote: ({ size = 12, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10 L4 20 L20 20 L20 10" stroke={color} strokeWidth="1.8" fill={color} fillOpacity="0.22" strokeLinejoin="miter" strokeLinecap="butt" />
      <path d="M8 10 L8 6 L16 6 L16 10" stroke={color} strokeWidth="1.8" fill="none" />
      <path d="M9 14 L11.5 16.5 L16 12" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="butt" />
    </svg>
  ),
  Arrow: ({ size = 12, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12 L19 12 M13 6 L19 12 L13 18" stroke={color} strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter" fill="none" />
    </svg>
  ),
  Lock: ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="1" fill={color} opacity="0.28" stroke={color} strokeWidth="1.6" />
      <path d="M8 11 V8 a4 4 0 0 1 8 0 V11" stroke={color} strokeWidth="1.6" fill="none" />
    </svg>
  ),
  Megaphone: ({ size = 24, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 9 L3 15 L8 15 L18 20 L18 4 Z" fill={color} opacity="0.28" stroke={color} strokeWidth="1.8" strokeLinejoin="miter" />
      <path d="M21 9 L21 15" stroke={color} strokeWidth="1.8" strokeLinecap="butt" />
      <path d="M8 15 L9 21 L12 21 L11 15" stroke={color} strokeWidth="1.8" fill={color} fillOpacity="0.28" />
    </svg>
  ),

  // --- Card-level affordances ---
  ThumbUp: ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 11 H7 V20 H3 Z" fill={color} opacity="0.28" stroke={color} strokeWidth="1.6" strokeLinejoin="miter" />
      <path d="M7 11 L11 4 C12 3 13.5 3.5 13.5 5 V9 H19 C20 9 20.7 9.7 20.5 10.7 L18.6 18.7 C18.4 19.5 17.7 20 17 20 H7 Z"
            fill={color} opacity="0.22" stroke={color} strokeWidth="1.6" strokeLinejoin="miter" />
    </svg>
  ),
  ThumbDown: ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 4 H7 V13 H3 Z" fill={color} opacity="0.28" stroke={color} strokeWidth="1.6" strokeLinejoin="miter" />
      <path d="M7 13 L11 20 C12 21 13.5 20.5 13.5 19 V15 H19 C20 15 20.7 14.3 20.5 13.3 L18.6 5.3 C18.4 4.5 17.7 4 17 4 H7 Z"
            fill={color} opacity="0.22" stroke={color} strokeWidth="1.6" strokeLinejoin="miter" />
    </svg>
  ),
  CloseX: ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6 L18 18 M18 6 L6 18" stroke={color} strokeWidth="2.2" strokeLinecap="butt" />
    </svg>
  ),
  Chevron: ({ size = 12, color = 'currentColor', dir = 'down' }) => {
    const rot = { down: 0, up: 180, left: 90, right: -90 }[dir] || 0;
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: `rotate(${rot}deg)` }}>
        <path d="M5 9 L12 16 L19 9" stroke={color} strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter" fill="none" />
      </svg>
    );
  },
  PollAttached: ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="1.5" fill={color} opacity="0.22" stroke={color} strokeWidth="1.6" />
      <rect x="6" y="9.5" width="9" height="2" fill={color} opacity="0.6" />
      <rect x="6" y="12.5" width="13" height="2" fill={color} opacity="0.6" />
    </svg>
  ),
  PostAttached: ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="1.5" fill={color} opacity="0.22" stroke={color} strokeWidth="1.6" />
      <path d="M7 9 H17 M7 12 H17 M7 15 H13" stroke={color} strokeWidth="1.4" strokeLinecap="butt" />
    </svg>
  ),
};

window.PollsGlyph = PollsGlyph;
