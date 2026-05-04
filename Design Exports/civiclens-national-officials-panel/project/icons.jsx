/* Phosphor Duotone-style icon set for the National Officials Panel.
   Hand-built; matches the design system's existing iconography (Navbar.jsx).
   24x24 viewBox; sized via `size` prop. */

const Ico = {
  Logo: ({ size = 26 }) => (
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
  Search: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <circle cx="11" cy="11" r="7" fill="rgba(255,255,255,0.18)" />
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M16.5 16.5 L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  MapPin: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13Z" fill="currentColor" opacity="0.22" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.4" fill="currentColor" />
    </svg>
  ),
  Check: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5 L10 17 L19 7" />
    </svg>
  ),
  Bookmark: ({ size = 14, filled }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M6 4h12v17l-6-4-6 4z"
        fill={filled ? 'currentColor' : 'rgba(0,0,0,0.10)'}
        opacity={filled ? 1 : 0.32}
        stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  ),
  ThumbsUp: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M3 11h3.5v9H3z" fill="currentColor" opacity="0.32" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6.5 11 L10 4.5 a2 2 0 0 1 3.5 1.4 V10 h5.4 a2 2 0 0 1 2 2.4 l-1.4 6.6 a2 2 0 0 1-2 1.6 H6.5 z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  ThumbsDown: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M3 4h3.5v9H3z" fill="currentColor" opacity="0.32" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6.5 13 L10 19.5 a2 2 0 0 0 3.5-1.4 V14 h5.4 a2 2 0 0 0 2-2.4 l-1.4-6.6 a2 2 0 0 0-2-1.6 H6.5 z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  Chat: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-4 3v-3H6a2 2 0 0 1-2-2z"
            fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  Lock: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <rect x="5" y="11" width="14" height="9" rx="2" fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 11 V8 a4 4 0 0 1 8 0 V11" stroke="currentColor" strokeWidth="1.6" fill="none" />
    </svg>
  ),
  Building: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <rect x="4" y="9" width="16" height="12" rx="1.5" fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 4h8l1 5H7z" fill="currentColor" opacity="0.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <rect x="8" y="13" width="2" height="3" fill="currentColor" />
      <rect x="14" y="13" width="2" height="3" fill="currentColor" />
      <rect x="11" y="17" width="2" height="4" fill="currentColor" />
    </svg>
  ),
  Gavel: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <rect x="11" y="3" width="9" height="5" rx="1" transform="rotate(45 15 5)" fill="currentColor" opacity="0.32" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="6" y1="14" x2="14" y2="22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="3" y1="20" x2="11" y2="20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
  Users: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <circle cx="9" cy="9" r="3.5" fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="10" r="2.5" fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M15 17c0-2 1.7-3.5 4-3.5s3 1.5 3 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  ),
  Star: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M12 3 L14.6 9.2 L21 9.8 L16 14 L17.5 20.5 L12 17 L6.5 20.5 L8 14 L3 9.8 L9.4 9.2 Z"
            fill="currentColor" opacity="0.32" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  ArrowRight: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12 H19" />
      <path d="M13 6 L19 12 L13 18" />
    </svg>
  ),
  Shield: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M12 3 L20 6 V12 C20 17 16 20.5 12 22 C8 20.5 4 17 4 12 V6 Z"
            fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12.5 L11 14.5 L15.5 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
  Eye: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M2 12 C5 6 8 4 12 4 C16 4 19 6 22 12 C19 18 16 20 12 20 C8 20 5 18 2 12Z"
            fill="currentColor" opacity="0.22" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3.2" fill="currentColor" opacity="0.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  X: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6 L18 18" /><path d="M18 6 L6 18" />
    </svg>
  ),
  Filter: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M3 5h18l-7 9v6l-4-2v-4z" fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
};

window.Ico = Ico;
