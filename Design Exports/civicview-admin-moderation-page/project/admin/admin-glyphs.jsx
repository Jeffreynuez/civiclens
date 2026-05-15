// Admin glyphs — small Phosphor-duotone-style SVGs.
// Stroke 2, navy stroke + 28% accent underlayer in resting state.
// All accept { size } prop; viewbox 24x24.

const AdGlyph = {
  // Left logo: US flag circle (matches the live /polls navbar — replaces the
  // lens-with-flag mark used elsewhere in CivicLens).
  Logo: ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <clipPath id="ad-logo-clip"><circle cx="16" cy="16" r="14" /></clipPath>
      </defs>
      <circle cx="16" cy="16" r="14" fill="#B22234" />
      <g clipPath="url(#ad-logo-clip)">
        {/* Stripes */}
        <rect x="0" y="6"  width="32" height="2" fill="#FFFFFF" />
        <rect x="0" y="10" width="32" height="2" fill="#FFFFFF" />
        <rect x="0" y="14" width="32" height="2" fill="#FFFFFF" />
        <rect x="0" y="18" width="32" height="2" fill="#FFFFFF" />
        <rect x="0" y="22" width="32" height="2" fill="#FFFFFF" />
        <rect x="0" y="26" width="32" height="2" fill="#FFFFFF" />
        {/* Canton */}
        <rect x="2" y="2" width="14" height="11" fill="#3C3B6E" />
        {/* Stars */}
        <g fill="#FFFFFF">
          <circle cx="5"  cy="5"  r="0.7" />
          <circle cx="8"  cy="5"  r="0.7" />
          <circle cx="11" cy="5"  r="0.7" />
          <circle cx="14" cy="5"  r="0.7" />
          <circle cx="6.5"  cy="7.5" r="0.7" />
          <circle cx="9.5"  cy="7.5" r="0.7" />
          <circle cx="12.5" cy="7.5" r="0.7" />
          <circle cx="5"  cy="10" r="0.7" />
          <circle cx="8"  cy="10" r="0.7" />
          <circle cx="11" cy="10" r="0.7" />
          <circle cx="14" cy="10" r="0.7" />
        </g>
      </g>
      <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="0.6" />
    </svg>
  ),
  // Person silhouette — for "CivicView Admin" identity pill
  Person: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" fill="rgba(255,255,255,0.28)" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="rgba(255,255,255,0.28)" />
    </svg>
  ),
  // Polls sparkline (matches /polls navbar)
  Polls: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M3 14l4-5 4 4 4-7 4 5 2-1" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="9" r="1.4" fill="currentColor" />
      <circle cx="15" cy="6" r="1.4" fill="currentColor" />
    </svg>
  ),
  Bell: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 8 2.5 8H3.5S6 15 6 9Z" fill="rgba(255,255,255,0.22)" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Bookmark: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M6 4h12v17l-6-4-6 4z" fill="rgba(255,255,255,0.28)" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  Chart: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <rect x="3" y="13" width="4" height="8" rx="1" fill="rgba(255,255,255,0.28)" stroke="currentColor" strokeWidth="1.8" />
      <rect x="10" y="8" width="4" height="13" rx="1" fill="rgba(255,255,255,0.28)" stroke="currentColor" strokeWidth="1.8" />
      <rect x="17" y="3" width="4" height="18" rx="1" fill="rgba(255,255,255,0.28)" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  Menu: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Shield: ({ size = 11 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M12 3 4 6v6c0 4.5 3.4 8.2 8 9 4.6-.8 8-4.5 8-9V6l-8-3Z" fill="currentColor" opacity="0.35" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8.5 12.5 11 15l4.5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  // Content type glyphs (used in Type cell)
  TypePost: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" fill="rgba(45,106,79,0.18)" />
      <path d="M7 9h10M7 13h10M7 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  TypeComment: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M4 5h16v11H9l-4 4V5Z" fill="rgba(69,123,157,0.22)" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 10h8M8 13h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  TypePoll: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <rect x="3" y="5" width="18" height="3.5" rx="1.5" fill="rgba(255,186,8,0.45)" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="10.5" width="13" height="3.5" rx="1.5" fill="rgba(255,186,8,0.3)" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="16" width="8" height="3.5" rx="1.5" fill="rgba(255,186,8,0.2)" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  TypePollComment: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <rect x="3" y="3" width="9" height="3" rx="1.5" fill="rgba(108,62,193,0.3)" stroke="currentColor" strokeWidth="1.4" />
      <rect x="3" y="7.5" width="6" height="3" rx="1.5" fill="rgba(108,62,193,0.18)" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 14h11v6h-7l-4 3v-9Z" fill="rgba(108,62,193,0.18)" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),

  // Action / toolbar
  Refresh: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M20 12a8 8 0 1 1-2.3-5.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M20 4v4h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
  Search: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  External: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M14 4h6v6M20 4l-8 8M11 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
  Hide: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M3 12s3.5-6 9-6c2 0 3.7.7 5.1 1.7M21 12s-3.5 6-9 6c-2 0-3.7-.7-5.1-1.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" fill="none" />
    </svg>
  ),
  Unhide: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" fill="rgba(45,106,79,0.18)" />
    </svg>
  ),
  Dismiss: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Suspend: ({ size = 13 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <path d="M5.5 5.5l13 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  // Decorative for empty state
  Sparkle: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

window.AdGlyph = AdGlyph;
