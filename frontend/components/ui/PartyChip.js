'use client';

import React from 'react';

/**
 * CivicLens PartyChip — the small party-letter pill.
 *
 * Per design system: party-coded reds/blues are PILL-ONLY,
 * never CTA fills, never backgrounds. Use this component
 * everywhere a party affiliation is displayed inline.
 *
 * Variants:
 *   - 'solid'  (default): solid party color, white text. Compact pill.
 *   - 'soft'            : soft-tint background, party-text. Body-friendly.
 *
 * Sizes:
 *   - 'xs' : tiny adjacent-to-name chip (used in PostCard headers)
 *   - 'sm' : default
 *   - 'md' : larger, used in profile headers
 *
 * party prop accepts letter codes ('D' / 'R' / 'I') OR full names
 * ('Democrat' / 'Republican' / 'Independent'). Unknown values render
 * a neutral chip.
 */
const PARTY_KEY = {
  D: 'D', d: 'D', democrat: 'D', democratic: 'D',
  R: 'R', r: 'R', republican: 'R', gop: 'R',
  I: 'I', i: 'I', independent: 'I', ind: 'I',
};

const PARTY_COLORS = {
  D: { solid: 'var(--cl-democrat)', soft: 'var(--cl-democrat-soft)' },
  R: { solid: 'var(--cl-republican)', soft: 'var(--cl-republican-soft)' },
  I: { solid: 'var(--cl-independent)', soft: 'var(--cl-independent-soft)' },
};

const PARTY_LABEL = {
  D: 'D',
  R: 'R',
  I: 'I',
};

export default function PartyChip({
  party,
  variant = 'solid',
  size = 'sm',
  label,
  className = '',
  style = {},
  ...rest
}) {
  const key = PARTY_KEY[String(party).trim()] || null;
  const colors = key ? PARTY_COLORS[key] : null;
  const text = label ?? (key ? PARTY_LABEL[key] : '?');

  const sizeStyle = {
    xs: { height: 16, padding: '0 5px', fontSize: 10, minWidth: 16 },
    sm: { height: 18, padding: '0 6px', fontSize: 11, minWidth: 18 },
    md: { height: 22, padding: '0 8px', fontSize: 12, minWidth: 22 },
  }[size];

  let visual;
  if (!colors) {
    visual = {
      background: 'var(--cl-bg-soft)',
      color: 'var(--cl-text-light)',
      border: '1px solid var(--cl-border)',
    };
  } else if (variant === 'soft') {
    visual = {
      background: colors.soft,
      color: colors.solid,
      border: `1px solid ${colors.solid}`,
    };
  } else {
    visual = {
      background: colors.solid,
      color: 'var(--cl-text-on-dark)',
      border: `1px solid ${colors.solid}`,
    };
  }

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--cl-radius-pill)',
    fontFamily: 'var(--cl-font-sans)',
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: 0,
    flexShrink: 0,
    ...sizeStyle,
    ...visual,
    ...style,
  };

  return (
    <span
      className={className}
      style={baseStyle}
      role="img"
      aria-label={key ? `${PARTY_LABEL[key] === 'D' ? 'Democrat' : PARTY_LABEL[key] === 'R' ? 'Republican' : 'Independent'}` : 'Party unknown'}
      {...rest}
    >
      {text}
    </span>
  );
}
