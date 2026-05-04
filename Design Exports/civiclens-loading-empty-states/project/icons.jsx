/* Phosphor Duotone icons — hand-inlined for CivicLens.
   Underlayer fill at 28% opacity (or 30% per brief override for empty states).
   Stroke 2px, sharp linecaps, miter joins. */

const Icon = {
  ChatCircleDots: ({ size = 64, color = '#2d6a4f', opacity = 0.30 }) => (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none" aria-hidden="true">
      <path
        d="M128 24a104 104 0 0 0-91.4 153.6l-12 36A8 8 0 0 0 36 224l36-12A104 104 0 1 0 128 24Z"
        fill={color} opacity={opacity}
      />
      <path
        d="M128 24a104 104 0 0 0-91.4 153.6l-12 36A8 8 0 0 0 36 224l36-12A104 104 0 1 0 128 24Z"
        stroke={color} strokeWidth="12" strokeLinejoin="miter"
      />
      <circle cx="84"  cy="128" r="10" fill={color} />
      <circle cx="128" cy="128" r="10" fill={color} />
      <circle cx="172" cy="128" r="10" fill={color} />
    </svg>
  ),

  Newspaper: ({ size = 64, color = '#2d6a4f', opacity = 0.30 }) => (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none" aria-hidden="true">
      <path
        d="M24 64h184v136a16 16 0 0 1-16 16H40a16 16 0 0 1-16-16Z"
        fill={color} opacity={opacity}
      />
      <path
        d="M24 64h184v136a16 16 0 0 1-16 16H40a16 16 0 0 1-16-16Z"
        stroke={color} strokeWidth="12" strokeLinejoin="miter"
      />
      <path d="M232 88v112a16 16 0 0 1-16 16" stroke={color} strokeWidth="12" />
      <path d="M64 96h104M64 128h104M64 160h64" stroke={color} strokeWidth="12" strokeLinecap="butt" />
    </svg>
  ),

  ChatText: ({ size = 64, color = '#2d6a4f', opacity = 0.30 }) => (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none" aria-hidden="true">
      <path
        d="M40 32h176a8 8 0 0 1 8 8v144a8 8 0 0 1-8 8h-78l-42 32v-32H40a8 8 0 0 1-8-8V40a8 8 0 0 1 8-8Z"
        fill={color} opacity={opacity}
      />
      <path
        d="M40 32h176a8 8 0 0 1 8 8v144a8 8 0 0 1-8 8h-78l-42 32v-32H40a8 8 0 0 1-8-8V40a8 8 0 0 1 8-8Z"
        stroke={color} strokeWidth="12" strokeLinejoin="miter"
      />
      <path d="M72 96h112M72 132h80" stroke={color} strokeWidth="12" strokeLinecap="butt" />
    </svg>
  ),

  MagnifyingGlass: ({ size = 64, color = '#2d6a4f', opacity = 0.30 }) => (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none" aria-hidden="true">
      <circle cx="112" cy="112" r="80" fill={color} opacity={opacity} />
      <circle cx="112" cy="112" r="80" stroke={color} strokeWidth="12" />
      <path d="m168.6 168.6 53.4 53.4" stroke={color} strokeWidth="14" strokeLinecap="butt" />
    </svg>
  ),

  BookmarkSimple: ({ size = 64, color = '#2d6a4f', opacity = 0.30 }) => (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none" aria-hidden="true">
      <path
        d="M192 224 128 184 64 224V40a8 8 0 0 1 8-8h112a8 8 0 0 1 8 8Z"
        fill={color} opacity={opacity}
      />
      <path
        d="M192 224 128 184 64 224V40a8 8 0 0 1 8-8h112a8 8 0 0 1 8 8Z"
        stroke={color} strokeWidth="12" strokeLinejoin="miter"
      />
    </svg>
  ),

  CalendarCheck: ({ size = 64, color = '#2d6a4f', opacity = 0.30 }) => (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none" aria-hidden="true">
      <path
        d="M40 48h176a8 8 0 0 1 8 8v152a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8V56a8 8 0 0 1 8-8Z"
        fill={color} opacity={opacity}
      />
      <path
        d="M40 48h176a8 8 0 0 1 8 8v152a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8V56a8 8 0 0 1 8-8Z"
        stroke={color} strokeWidth="12" strokeLinejoin="miter"
      />
      <path d="M32 88h192" stroke={color} strokeWidth="12" />
      <path d="M80 24v32M176 24v32" stroke={color} strokeWidth="12" strokeLinecap="butt" />
      <path d="m88 152 24 24 56-56" stroke={color} strokeWidth="14" strokeLinecap="butt" strokeLinejoin="miter" fill="none" />
    </svg>
  ),

  WarningCircle: ({ size = 64, color = '#8c2929', opacity = 0.28 }) => (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none" aria-hidden="true">
      <circle cx="128" cy="128" r="96" fill={color} opacity={opacity} />
      <circle cx="128" cy="128" r="96" stroke={color} strokeWidth="12" />
      <path d="M128 80v56" stroke={color} strokeWidth="14" strokeLinecap="butt" />
      <circle cx="128" cy="172" r="9" fill={color} />
    </svg>
  ),

  // small inline arrow for "Track more reps →" CTA hint, not a duotone
  ArrowRight: ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter" />
    </svg>
  ),

  // 16px inline check used by vote-pill voted state
  Check: ({ size = 14, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 12 5 5L20 7" stroke={color} strokeWidth="2.6" strokeLinecap="butt" strokeLinejoin="miter" />
    </svg>
  ),
};

window.Icon = Icon;
