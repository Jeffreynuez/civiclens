/* Phosphor-style duotone icons for the Help-build page.
   Stroke 2px, sharp caps, 24×24 viewbox unless noted. */

const Icon = {
  Check: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5 L10 17 L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  ),
  Gear: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.35"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 2v3 M12 19v3 M2 12h3 M19 12h3 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2"
            stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
    </svg>
  ),
  Chevron: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9 L12 15 L18 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" strokeLinejoin="miter" fill="none"/>
    </svg>
  ),
  ArrowLeft: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 6 L8 12 L14 18 M8 12 H20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" strokeLinejoin="miter" fill="none"/>
    </svg>
  ),
  Heart: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21 L4 13 a4.5 4.5 0 0 1 7-5.5 4.5 4.5 0 0 1 7 0 4.5 4.5 0 0 1 0 5.5 Z"
            fill="currentColor" opacity="0.32"/>
      <path d="M12 21 L4 13 a4.5 4.5 0 0 1 7-5.5 4.5 4.5 0 0 1 7 0 4.5 4.5 0 0 1 0 5.5 Z"
            stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>
    </svg>
  ),
  Sparkle: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 L13.6 9.6 L20 11.2 L13.6 12.8 L12 19.4 L10.4 12.8 L4 11.2 L10.4 9.6 Z"
            fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="miter"/>
      <path d="M19 4 L19.5 6 L21.5 6.5 L19.5 7 L19 9 L18.5 7 L16.5 6.5 L18.5 6 Z"
            fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
    </svg>
  ),
  Info: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.18"/>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M12 11v6 M12 7.5v0.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square"/>
    </svg>
  ),
  Bell: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 8 2.5 8H3.5S6 15 6 9Z"
            fill="currentColor" opacity="0.22" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Menu: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16 M4 12h16 M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
    </svg>
  ),
  Polls: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 17 L8 11 L13 14 L21 5" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" fill="none"/>
      <path d="M15 5 H21 V11" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" fill="none"/>
    </svg>
  ),
  Bookmark: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 4h12v17l-6-4-6 4z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  ),
  Mail: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="1.5" fill="currentColor" opacity="0.2"/>
      <rect x="3" y="5" width="18" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M3 7 L12 13 L21 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter" fill="none"/>
    </svg>
  ),
  Video: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="6" width="14" height="12" rx="2" fill="currentColor" opacity="0.28"/>
      <rect x="2.5" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M16.5 10 L21 7 V17 L16.5 14 Z" fill="currentColor" opacity="0.7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="miter"/>
    </svg>
  ),
  Live: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" fill="currentColor"/>
      <path d="M7 7 a7 7 0 0 0 0 10 M17 7 a7 7 0 0 1 0 10 M4 4 a11 11 0 0 0 0 16 M20 4 a11 11 0 0 1 0 16"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  Debate: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 5h10v8H7l-4 3z" fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="miter"/>
      <path d="M21 9h-6v8h4l2 2z" fill="currentColor" opacity="0.45" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="miter"/>
    </svg>
  ),
  Nickname: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M4 21 c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" fill="currentColor" fillOpacity="0.18"/>
    </svg>
  ),
  Receipt: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 3 v18 l2-1.5 2 1.5 2-1.5 2 1.5 2-1.5 2 1.5 2-1.5 v-18 Z"
            fill="currentColor" opacity="0.22" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="miter"/>
      <path d="M8 8h8 M8 12h8 M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square"/>
    </svg>
  ),
  Pin: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z" fill="currentColor" opacity="0.32" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="12" cy="9" r="2.4" fill="currentColor"/>
    </svg>
  ),
};

// CivicView logo: round US-flag-style mark (matches user's current implementation)
const CVLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
    <defs>
      <clipPath id="cv-clip"><circle cx="16" cy="16" r="14"/></clipPath>
    </defs>
    <circle cx="16" cy="16" r="14" fill="#FFFFFF"/>
    <g clipPath="url(#cv-clip)">
      {/* stripes */}
      <rect x="2"  y="2"  width="28" height="2" fill="#8A2929"/>
      <rect x="2"  y="6"  width="28" height="2" fill="#8A2929"/>
      <rect x="2"  y="10" width="28" height="2" fill="#8A2929"/>
      <rect x="2"  y="14" width="28" height="2" fill="#8A2929"/>
      <rect x="2"  y="18" width="28" height="2" fill="#8A2929"/>
      <rect x="2"  y="22" width="28" height="2" fill="#8A2929"/>
      <rect x="2"  y="26" width="28" height="2" fill="#8A2929"/>
      {/* canton */}
      <rect x="2" y="2" width="13" height="12" fill="#1B263B"/>
      {/* stars */}
      <circle cx="5" cy="5"  r="0.7" fill="#FFFFFF"/>
      <circle cx="8" cy="5"  r="0.7" fill="#FFFFFF"/>
      <circle cx="11" cy="5" r="0.7" fill="#FFFFFF"/>
      <circle cx="6.5" cy="8" r="0.7" fill="#FFFFFF"/>
      <circle cx="9.5" cy="8" r="0.7" fill="#FFFFFF"/>
      <circle cx="5" cy="11"  r="0.7" fill="#FFFFFF"/>
      <circle cx="8" cy="11"  r="0.7" fill="#FFFFFF"/>
      <circle cx="11" cy="11" r="0.7" fill="#FFFFFF"/>
    </g>
    <circle cx="16" cy="16" r="14" fill="none" stroke="#1B263B" strokeWidth="1.5"/>
  </svg>
);

window.Icon = Icon;
window.CVLogo = CVLogo;
