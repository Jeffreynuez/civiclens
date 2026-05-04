/* Phosphor-style duotone icons for BallotTab. 24x24 viewbox, 2px stroke,
   navy stroke + 28% accent fill. Inline SVGs as React components. */

const Icon = ({ children, size = 18, color = 'currentColor', fillColor, fillOpacity = 0.28, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke={color} strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter"
       style={{ flexShrink: 0 }} {...rest}>
    {typeof children === 'function' ? children({ fillColor: fillColor || color, fillOpacity }) : children}
  </svg>
);

const IconCheckCircle = (p) => (
  <Icon {...p}>
    {({ fillColor, fillOpacity }) => (
      <>
        <circle cx="12" cy="12" r="9" fill={fillColor} fillOpacity={fillOpacity} />
        <path d="M8 12.5 L11 15.5 L16.5 9.5" />
        <circle cx="12" cy="12" r="9" />
      </>
    )}
  </Icon>
);

const IconWarning = (p) => (
  <Icon {...p}>
    {({ fillColor, fillOpacity }) => (
      <>
        <path d="M12 3 L21.5 19.5 H2.5 Z" fill={fillColor} fillOpacity={fillOpacity} />
        <path d="M12 3 L21.5 19.5 H2.5 Z" />
        <path d="M12 9 V14" />
        <circle cx="12" cy="17" r="0.6" fill={fillColor} stroke="none" />
      </>
    )}
  </Icon>
);

const IconShield = (p) => (
  <Icon {...p}>
    {({ fillColor, fillOpacity }) => (
      <>
        <path d="M12 3 L20 6 V12 C20 17 16 20 12 21 C8 20 4 17 4 12 V6 Z" fill={fillColor} fillOpacity={fillOpacity} />
        <path d="M12 3 L20 6 V12 C20 17 16 20 12 21 C8 20 4 17 4 12 V6 Z" />
        <path d="M9 12 L11 14 L15 10" />
      </>
    )}
  </Icon>
);

const IconMapPin = (p) => (
  <Icon {...p}>
    {({ fillColor, fillOpacity }) => (
      <>
        <path d="M12 2 C7.5 2 4 5.5 4 10 C4 16 12 22 12 22 C12 22 20 16 20 10 C20 5.5 16.5 2 12 2 Z" fill={fillColor} fillOpacity={fillOpacity} />
        <path d="M12 2 C7.5 2 4 5.5 4 10 C4 16 12 22 12 22 C12 22 20 16 20 10 C20 5.5 16.5 2 12 2 Z" />
        <circle cx="12" cy="10" r="3" fill="white" />
      </>
    )}
  </Icon>
);

const IconCalendar = (p) => (
  <Icon {...p}>
    {({ fillColor, fillOpacity }) => (
      <>
        <rect x="3" y="5" width="18" height="16" fill={fillColor} fillOpacity={fillOpacity} />
        <rect x="3" y="5" width="18" height="16" />
        <path d="M3 10 H21" />
        <path d="M8 3 V7" />
        <path d="M16 3 V7" />
        <path d="M8 14 L11 17 L16 12" />
      </>
    )}
  </Icon>
);

const IconBookmark = (p) => (
  <Icon {...p}>
    {({ fillColor, fillOpacity }) => (
      <>
        <path d="M6 3 H18 V21 L12 17 L6 21 Z" fill={fillColor} fillOpacity={fillOpacity} />
        <path d="M6 3 H18 V21 L12 17 L6 21 Z" />
      </>
    )}
  </Icon>
);

const IconBookmarkFill = ({ size = 14, color = '#8a6100' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2" strokeLinejoin="miter" style={{flexShrink:0}}>
    <path d="M6 3 H18 V21 L12 17 L6 21 Z" />
  </svg>
);

const IconChevronRight = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="butt" style={{flexShrink:0}}>
    <path d="M9 6 L15 12 L9 18" />
  </svg>
);

const IconChevronLeft = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="butt" style={{flexShrink:0}}>
    <path d="M15 6 L9 12 L15 18" />
  </svg>
);

const IconChevronDown = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="butt" style={{flexShrink:0}}>
    <path d="M6 9 L12 15 L18 9" />
  </svg>
);

const IconDownload = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="butt" style={{flexShrink:0}}>
    <path d="M12 4 V15" />
    <path d="M7 11 L12 16 L17 11" />
    <path d="M4 19 H20" />
  </svg>
);

const IconLock = ({ size = 11, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="butt" style={{flexShrink:0}}>
    <rect x="5" y="11" width="14" height="10" />
    <path d="M8 11 V7 C8 4.5 10 3 12 3 C14 3 16 4.5 16 7 V11" />
  </svg>
);

const IconThumbsUp = ({ size = 12, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="miter" style={{flexShrink:0}}>
    <path d="M7 11 V20 H4 V11 Z" />
    <path d="M7 11 L11 3 C13 3 14 4 13.6 6 L13 9 H19 C20 9 21 10 20.6 11.5 L18.5 18.5 C18.2 19.5 17.4 20 16.4 20 H7" />
  </svg>
);

const IconThumbsDown = ({ size = 12, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="miter" style={{flexShrink:0}}>
    <path d="M7 13 V4 H4 V13 Z" />
    <path d="M7 13 L11 21 C13 21 14 20 13.6 18 L13 15 H19 C20 15 21 14 20.6 12.5 L18.5 5.5 C18.2 4.5 17.4 4 16.4 4 H7" />
  </svg>
);

const IconCheckSm = ({ size = 12, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="butt" style={{flexShrink:0}}>
    <path d="M5 12 L10 17 L19 7" />
  </svg>
);

const IconPlus = ({ size = 11, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="butt" style={{flexShrink:0}}>
    <path d="M12 5 V19 M5 12 H19" />
  </svg>
);

const IconCircleSlash = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="butt" style={{flexShrink:0}}>
    <circle cx="12" cy="12" r="9" />
    <path d="M5.5 18.5 L18.5 5.5" />
  </svg>
);

Object.assign(window, {
  IconCheckCircle, IconWarning, IconShield, IconMapPin, IconCalendar,
  IconBookmark, IconBookmarkFill, IconChevronRight, IconChevronLeft, IconChevronDown,
  IconDownload, IconLock, IconThumbsUp, IconThumbsDown, IconCheckSm, IconPlus,
  IconCircleSlash,
});
