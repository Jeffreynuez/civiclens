// CivicView — Copyright (c) 2026 Jeffrey De La Nuez. All rights reserved.
// Proprietary and confidential. See LICENSE at the repository root.

/*
 * FeedCard — shared card shell used on the redesigned /polls + /posts
 * pages. This PR (#2) only wires the POLL variant; the POST variant
 * lands in PR #3 along with the /posts route. The shared shell is
 * here so both PRs touch the same file rather than duplicating the
 * top-row + author-row + action-row layout.
 *
 * Visual weight matches the rep-page card (the reference for the
 * redesign). Per-card mandatory pieces:
 *
 *   • Top row:    kind chip → page tag → timestamp → [close X if
 *                 standalone-poll + viewer is the author]
 *   • Author row: avatar + name + "Unverified" pill + role
 *   • Body:       poll question + clickable option rows + closes-in
 *                 (poll variant), or post body + Expand (post variant)
 *   • Footer:     like / dislike / Comments(N) — clicking the
 *                 comments pill fires onToggleComments so the parent
 *                 can manage the singleton-accordion behavior.
 *   • Accordion:  CommentsThread mounts beneath the card when
 *                 isCommentsOpen is true (lazy — parent unmounts when
 *                 the user opens a different card's thread).
 *
 * Props:
 *   card             — feed item from /api/feed/polls (or /posts)
 *   kind             — 'poll'                (PR #3 adds 'post')
 *   isCommentsOpen   — bool                  parent owns the singleton
 *   onToggleComments — () => void
 *   onMutated        — () => void            tell parent to refetch
 *   signedIn         — bool
 *   onLoginRequired  — () => void
 *   citizenViewer    — citizen | null        used for Delete affordance
 */

import { useState } from 'react';
import { voteOnCitizenPoll, closeCitizenPoll } from '../../lib/pagesApi';
import CommentsThread from './CommentsThread';

export default function FeedCard({
  card,
  kind = 'poll',
  isCommentsOpen,
  onToggleComments,
  onMutated,
  signedIn = false,
  onLoginRequired,
  citizenViewer = null,
}) {
  // Standalone-poll author-only close X (top-right). The viewer is
  // the author when their citizen id matches the poll's
  // viewer.is_author flag the backend set.
  const isStandalone = card.kind === 'standalone';
  const viewer = card.viewer || { voter_choice_id: null, is_author: false };
  const showCloseX = kind === 'poll' && isStandalone && viewer.is_author;

  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [confirmingClose, setConfirmingClose] = useState(false);
  // Post-body collapse — long bodies (>400 chars) show an Expand pill
  // and stay collapsed by default. Same pattern the rep page uses.
  const [expanded, setExpanded] = useState(false);

  // ── handlers ────────────────────────────────────────────────────
  const handleVote = async (optionId) => {
    if (busy) return;
    if (!signedIn) { onLoginRequired?.(); return; }
    // Vote is wired through /api/citizen-polls today (the only
    // endpoint that accepts /polls-feed votes). Rep + candidate
    // polls deep-link to their page where the page-side voting UI
    // handles the cast.
    if (card.kind === 'rep' || card.kind === 'candidate') {
      // Open the parent page so the existing vote UI takes over —
      // matches the brief's "deep-links to parent page for
      // rep/candidate cards" guidance.
      if (card.official_id) {
        window.location.href = `/?page=${encodeURIComponent(card.official_id)}`;
      }
      return;
    }
    setBusy(true);
    setErrorMsg(null);
    const { error: err } = await voteOnCitizenPoll(card.id, optionId);
    setBusy(false);
    if (err) {
      setErrorMsg(typeof err === 'string' ? err : 'Could not record vote.');
      return;
    }
    onMutated?.();
  };

  const handleConfirmClose = async () => {
    if (busy) return;
    setBusy(true);
    setErrorMsg(null);
    const { error: err } = await closeCitizenPoll(card.id);
    setBusy(false);
    setConfirmingClose(false);
    if (err) {
      setErrorMsg(typeof err === 'string' ? err : 'Could not close poll.');
      return;
    }
    onMutated?.();
  };

  // ── label / chrome helpers ──────────────────────────────────────
  const kindLabel = ({
    rep: 'REP',
    citizen: 'CITIZEN',
    standalone: 'STANDALONE',
    candidate: 'CANDIDATE',
  })[card.kind] || card.kind.toUpperCase();

  const pageTag = card.page_tag || (isStandalone ? 'Standalone' : '');
  const author = card.author || 'Citizen';
  const initials = (author
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('') || '?').toUpperCase();
  const avatarTone = card.kind === 'rep' ? 'rep'
    : card.kind === 'candidate' ? 'candidate'
    : isStandalone ? 'standalone'
    : 'citizen';

  // ── render ──────────────────────────────────────────────────────
  return (
    <article className={`feed-card feed-card--${kind} ${isCommentsOpen ? 'is-thread-open' : ''}`}>
      <header className="feed-card__top">
        <span className={`feed-card__kind feed-card__kind--${card.kind}`}>{kindLabel}</span>
        {pageTag && <span className="feed-card__page-tag">{pageTag}</span>}
        <span className="feed-card__time">{relTime(card.created_at)}</span>
        {showCloseX && (
          <button
            type="button"
            className="feed-card__close"
            aria-label="Close this poll"
            onClick={() => setConfirmingClose(true)}
            disabled={busy}
            title="Close this poll"
          >
            ×
          </button>
        )}
      </header>

      {/* Cross-feed badge — poll item flagged as part of a post.
          parent_post_id is set by the backend (PR #1) for rep polls
          whose parent post lives in the rep's page. The badge tells
          the user this poll was authored as part of a longer post. */}
      {card.parent_post_id && (
        <a
          className="feed-card__crosslink"
          href={card.official_id ? `/?page=${encodeURIComponent(card.official_id)}` : '#'}
        >
          <span className="feed-card__crosslink-dot" aria-hidden="true">●</span>
          <span>From a post</span>
          <span className="feed-card__crosslink-arrow">→ Open page</span>
        </a>
      )}

      <div className="feed-card__author">
        <div className={`feed-card__avatar feed-card__avatar--${avatarTone}`}>
          {initials}
        </div>
        <div className="feed-card__author-text">
          <div className="feed-card__name">
            <span>{author}</span>
            {/* Citizen + candidate polls flag unverified authors.
                Rep polls don't show the pill (reps are verified by
                claim). The backend doesn't surface a per-item
                verified flag yet; we infer from card.kind. */}
            {(card.kind === 'citizen' || isStandalone) && (
              <span
                className="feed-card__unverified"
                title="Citizen hasn't been identity-verified yet"
              >
                Unverified
              </span>
            )}
          </div>
          {card.role && <div className="feed-card__role">{card.role}</div>}
        </div>
      </div>

      {/* Poll body */}
      {kind === 'poll' && (
        <div className="feed-card__body">
          <div className="poll-block">
            <div className="poll-block__q">{card.question}</div>
            <div className="poll-block__opts">
              {(card.options || []).map((o) => {
                const mine = viewer.voter_choice_id === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    className={`poll-opt2 ${mine ? 'is-mine' : ''}`}
                    onClick={() => handleVote(o.id)}
                    disabled={busy}
                  >
                    <span className="poll-opt2__fill" style={{ width: `${o.percent || 0}%` }} />
                    <span className="poll-opt2__label">
                      <strong>{o.label}</strong>
                      {mine && <span className="poll-opt2__your-vote">✓ your vote</span>}
                    </span>
                    <span className="poll-opt2__pct">{o.percent || 0}% · {formatCount(o.count || 0)}</span>
                  </button>
                );
              })}
            </div>
            <div className="poll-block__total">
              <span>{formatCount(card.votes || 0)}</span> votes
            </div>
          </div>
          {errorMsg && <div className="feed-card__error">{errorMsg}</div>}
          {confirmingClose && (
            <div className="feed-card__confirm">
              <p>
                Close this poll? It moves to the archived section of
                your dashboard and frees your standalone-poll slot
                so you can post another.
              </p>
              <div className="feed-card__confirm-row">
                <button
                  type="button"
                  className="feed-card__confirm-cancel"
                  onClick={() => setConfirmingClose(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="feed-card__confirm-go"
                  onClick={handleConfirmClose}
                  disabled={busy}
                >
                  {busy ? 'Closing…' : 'Close poll'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Post body — kind='post' on the /posts feed. Long bodies
          collapse to a preview with an Expand affordance; attached
          polls render an inline "+ poll attached" badge that
          deep-links to the page where the poll can be voted. */}
      {kind === 'post' && (
        <div className="feed-card__body">
          <div className={`feed-card__post-body ${expanded ? 'is-expanded' : ''}`}>
            {card.body}
          </div>
          {card.body && card.body.length > 400 && !expanded && (
            <button
              type="button"
              className="feed-card__expand"
              onClick={() => setExpanded(true)}
            >
              Expand
            </button>
          )}
          {card.has_attached_poll && (
            <a
              className="feed-card__crosslink feed-card__crosslink--inline"
              href={card.official_id ? `/?page=${encodeURIComponent(card.official_id)}` : '#'}
            >
              <span className="feed-card__crosslink-dot" aria-hidden="true">●</span>
              <span>+ poll attached</span>
              <span className="feed-card__crosslink-arrow">→ Open page</span>
            </a>
          )}
        </div>
      )}

      <div className="feed-card__actions">
        <button
          type="button"
          className={`feed-act feed-act--like ${(card.likes || 0) > 0 ? 'is-active' : ''}`}
          aria-label="Like"
        >
          ▲ <span>{formatCount(card.likes || 0)}</span>
        </button>
        <button
          type="button"
          className={`feed-act feed-act--dislike ${(card.dislikes || 0) > 0 ? 'is-active' : ''}`}
          aria-label="Dislike"
        >
          ▼ <span>{formatCount(card.dislikes || 0)}</span>
        </button>
        <button
          type="button"
          className={`feed-act feed-act--comments ${isCommentsOpen ? 'is-active' : ''}`}
          onClick={onToggleComments}
          aria-expanded={isCommentsOpen}
        >
          💬 Comments (<span>{formatCount(card.comments || 0)}</span>)
        </button>
      </div>

      {isCommentsOpen && (
        <div className="feed-card__thread">
          <CommentsThread
            // Three cases:
            //   • post card               → comments live on the post directly
            //   • poll card w/ parent post → comments live on the parent post
            //   • citizen-/standalone-poll → comments live on the poll
            mode={kind === 'post' || card.parent_post_id ? 'post' : 'poll'}
            postId={
              kind === 'post'
                ? card.id
                : card.parent_post_id || undefined
            }
            pollId={
              kind === 'post' || card.parent_post_id ? undefined : card.id
            }
            signedIn={signedIn}
            onLoginRequired={onLoginRequired}
            onMutated={onMutated}
          />
        </div>
      )}
    </article>
  );
}

// Tiny inline formatters — kept local so this file has zero shared-
// helper dependencies beyond the API + thread imports.
function relTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diffSec < 60) return 'just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 7 * 86400) return `${Math.floor(diffSec / 86400)}d ago`;
  return d.toLocaleDateString();
}

function formatCount(n) {
  const v = Number(n) || 0;
  if (v >= 1000) {
    return (v / 1000).toFixed(v >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k';
  }
  return String(v);
}
