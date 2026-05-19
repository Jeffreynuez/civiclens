'use client';

// CivicView — Copyright (c) 2026 Jeffrey Nuez. All rights reserved.
// Proprietary and confidential. See LICENSE at the repository root.

/**
 * AccountSecurityView — full-page overlay surfacing the
 * TwoFactorSection (and any future account-security controls).
 *
 * Mirrors the FeedbackView / HelpBuildThisView pattern: opens as a
 * fixed-position overlay with the compact navbar at the top and a
 * left-aligned "← Back" button. Mounts from the navbar hamburger
 * menu via the `onOpenAccountSecurity` handler on app/page.js.
 *
 * Currently hosts only the 2FA section. Future tabs might include
 * email + display name changes, signed-in-devices list, etc. — for
 * now a single section is enough.
 *
 * Props:
 *   onClose()                 — collapse the overlay
 *   compactNavbarProps        — slim Navbar chrome forwarded through
 *                               so identity pills + sign-in stay
 *                               reachable behind this view
 */

import { useEffect } from 'react';
import Navbar from './Navbar';
import TwoFactorSection from './TwoFactorSection';

export default function AccountSecurityView({ onClose, compactNavbarProps = {} }) {
  // Same scroll-lock pattern as FeedbackView / HelpBuildThisView.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div
      role="dialog"
      aria-label="Account security"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 1200,
        background: 'var(--cl-bg)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div style={{ flex: '0 0 auto' }}>
        <Navbar compact {...compactNavbarProps} onHome={onClose} />
      </div>

      {/* Back row — matches the FeedbackView header for visual parity. */}
      <div
        style={{
          flex: '0 0 auto',
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 18px',
          background: 'white',
          borderBottom: '1px solid var(--cl-border)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 10px', borderRadius: 8,
            border: '1px solid var(--cl-border)', background: 'white',
            color: 'var(--cl-text)', fontSize: '0.85rem', cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
        <div style={{ fontSize: '0.85rem', color: 'var(--cl-text-light)' }}>
          Account · Security
        </div>
      </div>

      {/* Body — scrollable region holding the section card. Padded
          like the help-build overlay so the card has breathing room
          on every viewport, capped at ~720px for readability on
          desktop. */}
      <div
        style={{
          flex: '1 1 auto',
          overflowY: 'auto',
          padding: '24px 16px 64px',
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <TwoFactorSection onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
