'use client';

import React, { useEffect, useRef } from 'react';

/**
 * CivicLens ModalShell — the canonical centered card on a dimmed
 * backdrop. Used by every modal in the app (auth, claim-page,
 * waitlist, committees, my-tracked, etc.).
 *
 * Per design system:
 *   - z-index 1500
 *   - backdrop rgba(0,0,0,0.4) for form modals (default),
 *     rgba(0,0,0,0.85) for the lightbox variant
 *   - card max-width 440px (default; auth modals), can override
 *     via `width` prop. Some modals (committees) use 560px.
 *   - card border-radius var(--cl-radius-2xl) for the card outer
 *   - "esc to close" hint at the bottom (small muted text)
 *
 * Props:
 *   - open       : boolean, if false renders nothing
 *   - onClose    : called on backdrop click + ESC
 *   - width      : max-width of the card (default 440)
 *   - variant    : 'form' (default, dim 0.4) | 'lightbox' (dim 0.85)
 *   - showCloseX : boolean, default true. Renders top-right (×).
 *   - showEscHint: boolean, default true. Renders bottom "esc to close".
 *   - lockScroll : boolean, default true. Locks body scroll while open.
 *   - children   : modal contents.
 *
 * The shell does NOT render the brand mark / heading / body — that's
 * each modal's responsibility. ModalShell is just the chrome.
 */

const VARIANT_BACKDROP = {
  form: 'rgba(0,0,0,0.4)',
  lightbox: 'rgba(0,0,0,0.85)',
};

export default function ModalShell({
  open,
  onClose,
  width = 440,
  variant = 'form',
  showCloseX = true,
  showEscHint = true,
  lockScroll = true,
  className = '',
  cardStyle = {},
  children,
}) {
  const cardRef = useRef(null);

  // ESC key handler.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Body-scroll lock.
  useEffect(() => {
    if (!open || !lockScroll) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, lockScroll]);

  if (!open) return null;

  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onBackdropClick}
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1500,
        background: VARIANT_BACKDROP[variant] || VARIANT_BACKDROP.form,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        overflowY: 'auto',
      }}
    >
      <div
        ref={cardRef}
        style={{
          position: 'relative',
          background: 'var(--cl-card)',
          borderRadius: 'var(--cl-radius-2xl)',
          boxShadow: 'var(--cl-shadow-modal)',
          width: '100%',
          maxWidth: width,
          padding: '24px 24px 16px',
          ...cardStyle,
        }}
      >
        {showCloseX && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 28,
              height: 28,
              border: 'none',
              background: 'transparent',
              borderRadius: 'var(--cl-radius-pill)',
              color: 'var(--cl-text-light)',
              fontSize: 18,
              lineHeight: 1,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        )}

        {children}

        {showEscHint && onClose && (
          <div
            style={{
              marginTop: 16,
              textAlign: 'center',
              fontSize: 'var(--cl-text-2xs)',
              color: 'var(--cl-text-muted)',
              letterSpacing: 'var(--cl-tracking-wide)',
              textTransform: 'uppercase',
            }}
          >
            <kbd
              style={{
                display: 'inline-block',
                padding: '1px 6px',
                marginRight: 6,
                background: 'var(--cl-bg-soft)',
                border: '1px solid var(--cl-border)',
                borderRadius: 'var(--cl-radius-xs)',
                fontFamily: 'var(--cl-font-mono)',
                fontSize: 'var(--cl-text-2xs)',
                color: 'var(--cl-text-light)',
                textTransform: 'lowercase',
                letterSpacing: 0,
              }}
            >
              esc
            </kbd>
            to close
          </div>
        )}
      </div>
    </div>
  );
}
