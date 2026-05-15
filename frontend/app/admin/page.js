'use client';

// CivicView — Copyright (c) 2026 Jeffrey Nuez. All rights reserved.
// Proprietary and confidential. See LICENSE at the repository root.

/**
 * /admin — moderation queue.
 *
 * Gated server-side by ADMIN_EMAILS env var. Three render modes:
 *   - probing                 → spinner card
 *   - 401 / 403               → access-required card
 *   - 200                     → the queue surface (header + KPIs + sub-nav
 *                               + filter row + table / mobile cards)
 *
 * Per-row actions:
 *   View      — opens the hosting rep page in a new tab
 *   Dismiss   — resolves the report; target stays visible
 *   Hide      — opens the Hide modal; on confirm, soft-deletes the target
 *               and resolves the report
 *   Unhide    — restores the target (only when target is currently hidden);
 *               does NOT auto-resolve outstanding reports so the admin can
 *               still review them
 *   Suspend   — opens the Suspend modal; on confirm, suspends the author
 *               with an optional cascade-hide of every piece of content
 *               they have visible right now
 *
 * Forward-compatible filter chips (kind, reporter, auto-flagged-only,
 * search) live on this page in stub state today — they don't yet hit
 * the backend. The "Stub" badge marks them so reviewers can tell
 * visual from live. Wired counts (Open / Hidden / Resolved) come from
 * the loaded report list.
 *
 * Class names match the Claude Design export under
 * /Design Exports/civicview-admin-moderation-page/. Styles live in
 * ./admin.css.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  adminWhoami,
  adminListReports,
  adminDismissReport,
  adminHideTarget,
  adminUnhideTarget,
  adminSuspendUser,
  adminListAppeals,
  adminListSuspendedUsers,
} from '@/lib/pagesApi';
import './admin.css';

// Human-friendly type labels and icon classes — keep in sync with the
// backend ReportKind literal.
const TYPE_META = {
  post:         { label: 'Rep post',        iconClass: 'post',        Icon: TypePostIcon },
  post_comment: { label: 'Comment on post', iconClass: 'comment',     Icon: TypeCommentIcon },
  poll:         { label: 'Citizen poll',    iconClass: 'poll',        Icon: TypePollIcon },
  poll_comment: { label: 'Comment on poll', iconClass: 'pollcomment', Icon: TypePollCommentIcon },
};

// Reason → pill-tone mapping. Matches the design's --pill--harass /
// --misinfo / --spam / --offtopic variants. Anything else falls
// through to the neutral default tone.
const REASON_PILL_KEY = {
  harassment: 'harass',
  hate: 'harass',
  misinformation: 'misinfo',
  spam: 'spam',
  off_topic: 'offtopic',
  off_topic_or_low_quality: 'offtopic',
};

function reasonPillKey(reason) {
  if (!reason) return 'default';
  return REASON_PILL_KEY[reason] || 'default';
}

function formatReason(reason) {
  if (!reason) return 'Unspecified';
  return reason.charAt(0).toUpperCase() + reason.slice(1).replace(/_/g, ' ');
}

function relTime(iso) {
  if (!iso) return '';
  const then = new Date(iso);
  const secs = Math.floor((Date.now() - then.getTime()) / 1000);
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function absTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  // "Today HH:MM AM" if same day, else short date
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (sameDay) return `Today ${time}`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + time;
}

function reportStatus(r) {
  if (r.acted_at) return 'resolved';
  if (r.target_hidden) return 'hidden';
  return 'open';
}

function isUserMobile() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 640px)').matches;
}

export default function AdminPage() {
  const [authState, setAuthState] = useState('probing'); // 'probing' | 'allowed' | 'denied' | 'unauthed'
  const [me, setMe] = useState(null);
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [error, setError] = useState(null);
  const [includeResolved, setIncludeResolved] = useState(false);

  // Forward-compatible filter UI — these are visual-only today. The
  // backend doesn't yet filter on kind / reporter / auto-flag, so the
  // chips just live in local state with a STUB badge.
  const [kindChip, setKindChip] = useState('all');
  const [reporterChip, setReporterChip] = useState('any');
  const [autoOnly, setAutoOnly] = useState(false);

  // Sub-nav badge counts — pulled when the queue mounts so the
  // Appeals + Suspended pills aren't lying about whether anything's
  // waiting for the admin elsewhere.
  const [appealsCount, setAppealsCount] = useState(null);
  const [suspendedCount, setSuspendedCount] = useState(null);

  // Modal state — replaces the prior window.confirm chains.
  const [hideModal, setHideModal] = useState(null);    // ReportRow | null
  const [suspendModal, setSuspendModal] = useState(null); // ReportRow | null
  const [busyId, setBusyId] = useState(null);

  // Mobile collapse — table → card list. Recomputes on resize.
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  // Probe admin auth on first mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, status, error: err } = await adminWhoami();
      if (cancelled) return;
      if (status === 200 && data) {
        setMe(data);
        setAuthState('allowed');
      } else if (status === 403) {
        setAuthState('denied');
        setError(err || 'Admin access required.');
      } else if (status === 401) {
        setAuthState('unauthed');
      } else {
        setAuthState('denied');
        setError(err || 'Could not reach admin API.');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const loadReports = useCallback(async () => {
    setLoadingReports(true);
    setError(null);
    const { data, error: err } = await adminListReports({ includeActed: includeResolved });
    setLoadingReports(false);
    if (err || !data) {
      setError(err || 'Could not load reports.');
      return;
    }
    setReports(data.items || []);
  }, [includeResolved]);

  useEffect(() => {
    if (authState === 'allowed') loadReports();
  }, [authState, loadReports]);

  // Sub-nav badge counts — fire and forget; null until resolved.
  useEffect(() => {
    if (authState !== 'allowed') return;
    let cancelled = false;
    (async () => {
      const [appeals, suspended] = await Promise.all([
        adminListAppeals?.({ status: 'open' }) ?? { data: null },
        adminListSuspendedUsers?.() ?? { data: null },
      ]);
      if (cancelled) return;
      if (appeals?.data?.items) setAppealsCount(appeals.data.items.length);
      if (suspended?.data?.items) setSuspendedCount(suspended.data.items.length);
    })();
    return () => { cancelled = true; };
  }, [authState]);

  // KPI strip — driven from the loaded list. "Resolved this week"
  // counts reports with acted_at within the last 7 days.
  const kpis = useMemo(() => {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 3600 * 1000;
    let open = 0, hidden = 0, resolvedWeek = 0;
    for (const r of reports) {
      const status = reportStatus(r);
      if (status === 'open') open += 1;
      else if (status === 'hidden') hidden += 1;
      if (r.acted_at && new Date(r.acted_at).getTime() >= weekAgo) resolvedWeek += 1;
    }
    return { open, hidden, resolvedWeek };
  }, [reports]);

  // Forward-compatible client-side filter pipeline. The chips are
  // STUBs against the backend, but they DO filter the loaded list
  // client-side so the controls feel responsive. The "Stub" badge
  // signals "this filters what you see now, but the queue isn't
  // server-side searchable yet."
  const filteredReports = useMemo(() => {
    let list = reports;
    if (kindChip !== 'all') list = list.filter((r) => r.kind === kindChip);
    if (reporterChip !== 'any') list = list.filter((r) => r.reporter_kind === reporterChip);
    if (autoOnly) list = list.filter((r) => r.auto_flagged);
    return list;
  }, [reports, kindChip, reporterChip, autoOnly]);

  // Action handlers — Dismiss / Unhide stay one-click. Hide and
  // Suspend route through real modals.
  const runAction = async (key, fn) => {
    if (busyId) return;
    setBusyId(key);
    const { error: err } = await fn();
    setBusyId(null);
    if (err) {
      setError(err);
      return;
    }
    await loadReports();
  };

  const handleHideConfirm = async () => {
    if (!hideModal) return;
    const r = hideModal;
    const key = `hide-${r.kind}-${r.id}`;
    setHideModal(null);
    await runAction(key, () => adminHideTarget(r.kind, r.id));
  };

  const handleSuspendConfirm = async ({ reason, alsoHide }) => {
    if (!suspendModal) return;
    const r = suspendModal;
    const key = `suspend-${r.target_author_kind}-${r.target_author_id}`;
    setSuspendModal(null);
    await runAction(key, () =>
      adminSuspendUser(r.target_author_kind, r.target_author_id, {
        reason: (reason || '').trim() || null,
        cascadeHide: !!alsoHide,
      }),
    );
  };

  // Access states — wrap each in the same shell so the layout band
  // stays consistent when the admin's logged in vs. probing.
  if (authState === 'probing') {
    return (
      <div className="ad-root">
        <div className="ad-access-wrap">
          <div className="ad-access">
            <div className="ad-access__art"><div className="ad-spinner" /></div>
            <h2 className="ad-access__title">Checking admin access…</h2>
            <p className="ad-access__body">
              Verifying your account against the ADMIN_EMAILS allowlist.
              This usually takes less than a second.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (authState === 'unauthed') {
    return (
      <div className="ad-root">
        <div className="ad-access-wrap">
          <div className="ad-access">
            <div className="ad-access__art">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="9" r="4" stroke="#1b263b" strokeWidth="1.8" fill="#e6f3ec" />
                <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#1b263b" strokeWidth="1.8" strokeLinecap="round" fill="#e6f3ec" />
              </svg>
            </div>
            <h2 className="ad-access__title">Sign in required</h2>
            <p className="ad-access__body">
              The moderation queue is restricted to accounts on the{' '}
              <strong>ADMIN_EMAILS</strong> allowlist. Sign in with your admin
              account to continue. Citizens and reps shouldn&rsquo;t see this
              page in normal use.
            </p>
            <a className="ad-access__cta" href="/">Go to CivicView home</a>
            <a className="ad-access__link" href="/">← Back to CivicView home</a>
          </div>
        </div>
      </div>
    );
  }

  if (authState === 'denied') {
    return (
      <div className="ad-root">
        <div className="ad-access-wrap">
          <div className="ad-access">
            <div className="ad-access__art">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3 4 6v6c0 4.5 3.4 8.2 8 9 4.6-.8 8-4.5 8-9V6l-8-3Z" fill="#fde8e8" stroke="#b13b3b" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M9 9l6 6M15 9l-6 6" stroke="#b13b3b" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="ad-access__title">Admin access required</h2>
            <p className="ad-access__body">
              {me?.email && (
                <>You&rsquo;re signed in as <span className="ad-access__email">{me.email}</span>, which</>
              )}
              {!me?.email && <>Your account</>}
              {' '}isn&rsquo;t on the moderator allowlist. The{' '}
              <strong>ADMIN_EMAILS</strong> env var on the server controls who
              sees this page. If you should have access, ask the deploy owner
              to add your email and redeploy.
            </p>
            <a className="ad-access__link" href="/">← Back to CivicView home</a>
          </div>
        </div>
      </div>
    );
  }

  // ── Allowed state — the actual moderation queue. ───────────────
  return (
    <div className="ad-root">
      <main className="ad-main">
        <div className="ad-pagehead">
          <div className="ad-pagehead__top">
            <div className="ad-pagehead__crumb">Admin · Moderation</div>
            <h1 className="ad-pagehead__title">Moderation queue</h1>
            <div className="ad-pagehead__subline">
              Signed in as{' '}
              <span className="ad-pagehead__subline-mono">{me?.email}</span>
              {' · '}{me?.kind === 'citizen' ? 'citizen' : 'rep'} account on ADMIN_EMAILS allowlist
            </div>
          </div>

          <div className="ad-subnav-row">
            <nav className="ad-subnav" aria-label="Admin sections">
              <a className="ad-subnav__item ad-subnav__item--active" href="/admin">Queue</a>
              <a className="ad-subnav__item" href="/admin/appeals">
                Appeals
                {appealsCount > 0 && <span className="ad-subnav__badge">{appealsCount}</span>}
              </a>
              <a className="ad-subnav__item" href="/admin/users">
                Suspended users
                {suspendedCount > 0 && <span className="ad-subnav__badge">{suspendedCount}</span>}
              </a>
            </nav>
            <a className="ad-subnav__home" href="/">
              <span aria-hidden="true">←</span> CivicView home
            </a>
          </div>

          <div className="ad-kpis">
            <KpiTile label="Open reports" value={kpis.open} dotClass="" />
            <KpiTile label="Hidden content" value={kpis.hidden} dotClass="hidden" />
            <KpiTile label="Resolved this week" value={kpis.resolvedWeek} dotClass="resolved" />
          </div>
        </div>

        <FilterRow
          includeResolved={includeResolved}
          onIncludeResolved={setIncludeResolved}
          kindChip={kindChip}
          onKindChip={setKindChip}
          reporterChip={reporterChip}
          onReporterChip={setReporterChip}
          autoOnly={autoOnly}
          onAutoOnly={setAutoOnly}
          onRefresh={loadReports}
          loading={loadingReports}
        />

        {error && (
          <div className="ad-banner" role="alert">
            <div className="ad-banner__icon">!</div>
            <div className="ad-banner__body">
              <div className="ad-banner__title">Couldn&rsquo;t complete that action</div>
              <div className="ad-banner__detail">{error}</div>
            </div>
            <button className="ad-banner__close" onClick={() => setError(null)} aria-label="Dismiss">×</button>
          </div>
        )}

        {!loadingReports && filteredReports.length === 0 ? (
          includeResolved
            ? <EmptyAll />
            : <EmptyOpen />
        ) : mobile ? (
          <CardList
            rows={filteredReports}
            busyId={busyId}
            onView={openHostingPage}
            onDismiss={(r) => runAction(`dismiss-${r.kind}-${r.id}`, () => adminDismissReport(r.kind, r.id))}
            onHide={(r) => setHideModal(r)}
            onUnhide={(r) => runAction(`unhide-${r.kind}-${r.id}`, () => adminUnhideTarget(r.kind, r.target_id))}
            onSuspend={(r) => setSuspendModal(r)}
          />
        ) : (
          <QueueTable
            rows={filteredReports}
            busyId={busyId}
            onView={openHostingPage}
            onDismiss={(r) => runAction(`dismiss-${r.kind}-${r.id}`, () => adminDismissReport(r.kind, r.id))}
            onHide={(r) => setHideModal(r)}
            onUnhide={(r) => runAction(`unhide-${r.kind}-${r.id}`, () => adminUnhideTarget(r.kind, r.target_id))}
            onSuspend={(r) => setSuspendModal(r)}
          />
        )}
      </main>

      {hideModal && (
        <HideModal
          row={hideModal}
          onCancel={() => setHideModal(null)}
          onConfirm={handleHideConfirm}
        />
      )}
      {suspendModal && (
        <SuspendModal
          row={suspendModal}
          onCancel={() => setSuspendModal(null)}
          onConfirm={handleSuspendConfirm}
        />
      )}
    </div>
  );
}

// Open hosting rep page in a new tab. Reports against standalone
// citizen polls don't have a context_official_id; the View button
// is just hidden in that case.
function openHostingPage(r) {
  if (!r.context_official_id) return;
  const url = `/?page=${encodeURIComponent(r.context_official_id)}`;
  if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer');
}

// ─────────────────────────────────────────────────────────────────────
// KPI TILE
// ─────────────────────────────────────────────────────────────────────
function KpiTile({ label, value, dotClass }) {
  return (
    <div className={`ad-kpi ${dotClass ? `ad-kpi--${dotClass}` : ''}`}>
      <div className="ad-kpi__label"><span className="ad-kpi__dot" />{label}</div>
      <div className="ad-kpi__num cl-num">{value}</div>
      <div className="ad-kpi__delta ad-kpi__delta--flat">&mdash;</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// FILTER ROW
// Include-resolved is wired; the rest are STUB chips that filter the
// loaded list client-side. The Stub badge marks them so reviewers
// know visual-vs-live.
// ─────────────────────────────────────────────────────────────────────
function FilterRow({
  includeResolved, onIncludeResolved,
  kindChip, onKindChip,
  reporterChip, onReporterChip,
  autoOnly, onAutoOnly,
  onRefresh, loading,
}) {
  const kinds = [
    { id: 'all',          label: 'All' },
    { id: 'post',         label: 'Rep post' },
    { id: 'post_comment', label: 'Comment' },
    { id: 'poll',         label: 'Poll' },
    { id: 'poll_comment', label: 'Poll comment' },
  ];
  const reporters = [
    { id: 'any',     label: 'Any' },
    { id: 'citizen', label: 'Citizen' },
    { id: 'rep',     label: 'Rep' },
  ];

  return (
    <div className="ad-filters">
      <label className="ad-toggle">
        <input
          type="checkbox"
          checked={includeResolved}
          onChange={(e) => onIncludeResolved(e.target.checked)}
        />
        <span className="ad-toggle__track" />
        Include resolved
      </label>

      <div className="ad-filters__divider" />

      <span className="ad-filters__label">Kind</span>
      <div className="ad-filters__chips">
        {kinds.map((k) => (
          <button
            key={k.id}
            className={`ad-chip ${kindChip === k.id ? 'ad-chip--active' : ''}`}
            onClick={() => onKindChip(k.id)}
            type="button"
          >
            {k.label}
          </button>
        ))}
      </div>

      <div className="ad-filters__divider" />

      <span className="ad-filters__label">Reporter</span>
      <div className="ad-filters__chips">
        {reporters.map((r) => (
          <button
            key={r.id}
            className={`ad-chip ${reporterChip === r.id ? 'ad-chip--active' : ''}`}
            onClick={() => onReporterChip(r.id)}
            type="button"
          >
            {r.label}
          </button>
        ))}
      </div>

      <label className="ad-toggle">
        <input
          type="checkbox"
          checked={autoOnly}
          onChange={(e) => onAutoOnly(e.target.checked)}
        />
        <span className="ad-toggle__track" />
        Auto-flagged only
      </label>

      <div style={{ flex: 1 }} />

      <div className="ad-search">
        <SearchIcon size={14} />
        <input placeholder="Search reports…" disabled />
        <span
          className="ad-search__stub"
          title="Backend doesn't index reports yet — shipping with v2"
        >
          Stub
        </span>
      </div>

      <button className="ad-iconbtn" type="button" onClick={onRefresh} disabled={loading}>
        <RefreshIcon size={14} />
        <span>{loading ? 'Refreshing…' : 'Refresh'}</span>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// QUEUE TABLE (desktop / tablet)
// ─────────────────────────────────────────────────────────────────────
function QueueTable({ rows, busyId, onView, onDismiss, onHide, onUnhide, onSuspend }) {
  const open = rows.filter((r) => reportStatus(r) === 'open').length;
  const hidden = rows.filter((r) => reportStatus(r) === 'hidden').length;

  return (
    <div className="ad-tablewrap">
      <div className="ad-tablewrap__count">
        <span>
          Showing <strong>{rows.length}</strong> {rows.length === 1 ? 'report' : 'reports'}
          {' · '}<strong>{open}</strong> open
          {' · '}<strong>{hidden}</strong> hidden
        </span>
        <span className="ad-tablewrap__count-actions">
          <button type="button" className="ad-linkbtn" disabled>
            Sort: Newest first ↓ <span className="ad-stub" style={{ marginLeft: 4 }}>Stub</span>
          </button>
          <button type="button" className="ad-linkbtn" disabled>
            Density: Compact <span className="ad-stub" style={{ marginLeft: 4 }}>Stub</span>
          </button>
        </span>
      </div>
      <div className="ad-tablewrap__scroll">
        <table className="ad-table">
          <thead>
            <tr>
              <th style={{ width: 160 }}>Type</th>
              <th>Content preview</th>
              <th style={{ width: 170 }}>Reason</th>
              <th style={{ width: 130 }}>Reporter</th>
              <th style={{ width: 90 }}>When</th>
              <th style={{ width: 100 }}>Status</th>
              <th style={{ width: 290 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const status = reportStatus(r);
              const meta = TYPE_META[r.kind] || { label: r.kind, iconClass: '', Icon: TypeCommentIcon };
              return (
                <tr key={`${r.kind}-${r.id}`} className={status === 'hidden' ? 'is-hidden' : status === 'resolved' ? 'is-resolved' : ''}>
                  <td>
                    <div className="ad-cell-type">
                      <div className="ad-cell-type__main">
                        <span className={`ad-cell-type__icon ad-cell-type__icon--${meta.iconClass}`}>
                          <meta.Icon size={14} />
                        </span>
                        {meta.label}
                      </div>
                      <span className="ad-cell-type__id">id={r.target_id}</span>
                    </div>
                  </td>
                  <td>
                    <div className="ad-cell-preview" title={r.target_preview || ''}>
                      {r.target_preview || <em style={{ color: 'var(--cl-text-muted)' }}>(empty)</em>}
                    </div>
                  </td>
                  <td>
                    <div className="ad-cell-reason">
                      <span className={`ad-cell-reason__pill ad-cell-reason__pill--${reasonPillKey(r.reason)}`}>
                        {formatReason(r.reason)}
                      </span>
                      {r.detail && <div className="ad-cell-reason-text">&ldquo;{r.detail}&rdquo;</div>}
                    </div>
                  </td>
                  <td>
                    <div className="ad-cell-reporter">
                      <span className="ad-cell-reporter__name">{r.reporter_name || '—'}</span>
                      <span className={`ad-cell-reporter__kind ad-cell-reporter__kind--${r.reporter_kind || 'citizen'}`}>
                        {r.reporter_kind === 'rep' ? 'Rep' : 'Citizen'}
                      </span>
                      {r.auto_flagged && <span className="ad-cell-reporter__autoflag">Auto-flag</span>}
                    </div>
                  </td>
                  <td>
                    <div className="ad-cell-when">
                      <span className="ad-cell-when__rel">{relTime(r.created_at)}</span>
                      <span>{absTime(r.created_at)}</span>
                    </div>
                  </td>
                  <td>
                    <StatusPill status={status} />
                  </td>
                  <td>
                    <RowActions
                      r={r}
                      busyId={busyId}
                      onView={() => onView(r)}
                      onDismiss={() => onDismiss(r)}
                      onHide={() => onHide(r)}
                      onUnhide={() => onUnhide(r)}
                      onSuspend={() => onSuspend(r)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// MOBILE CARD LIST
// ─────────────────────────────────────────────────────────────────────
function CardList({ rows, busyId, onView, onDismiss, onHide, onUnhide, onSuspend }) {
  return (
    <div className="ad-cardlist">
      {rows.map((r) => {
        const status = reportStatus(r);
        const meta = TYPE_META[r.kind] || { label: r.kind, iconClass: '', Icon: TypeCommentIcon };
        return (
          <div key={`${r.kind}-${r.id}`} className={`ad-card ${status === 'hidden' ? 'is-hidden' : status === 'resolved' ? 'is-resolved' : ''}`}>
            <div className="ad-card__hdr">
              <div className="ad-card__type">
                <span className={`ad-cell-type__icon ad-cell-type__icon--${meta.iconClass}`}>
                  <meta.Icon size={14} />
                </span>
                <div className="ad-card__type-text">
                  <div className="ad-card__type-main">{meta.label}</div>
                  <div className="ad-card__type-id">id={r.target_id}</div>
                </div>
              </div>
              <StatusPill status={status} />
            </div>
            <div className="ad-card__preview">{r.target_preview || '(empty)'}</div>
            <div className="ad-card__meta">
              <div>
                <span className="ad-card__metalabel">Reason</span>
                <span
                  className={`ad-cell-reason__pill ad-cell-reason__pill--${reasonPillKey(r.reason)}`}
                  style={{ alignSelf: 'flex-start' }}
                >
                  {formatReason(r.reason)}
                </span>
                {r.detail && (
                  <div style={{ fontSize: 'var(--cl-text-xs)', color: 'var(--cl-text-light)', lineHeight: 1.35, marginTop: 4 }}>
                    &ldquo;{r.detail}&rdquo;
                  </div>
                )}
              </div>
              <div>
                <span className="ad-card__metalabel">Reporter · When</span>
                <div style={{ fontSize: 'var(--cl-text-sm)', fontWeight: 600 }}>{r.reporter_name || '—'}</div>
                <div style={{ fontSize: 'var(--cl-text-xs)', color: 'var(--cl-text-light)' }}>
                  {r.reporter_kind === 'rep' ? 'Rep' : 'Citizen'} · {relTime(r.created_at)}
                </div>
                {r.auto_flagged && (
                  <div className="ad-cell-reporter__autoflag" style={{ marginTop: 3 }}>Auto-flag</div>
                )}
              </div>
            </div>
            <div className="ad-card__actions">
              <RowActions
                r={r}
                busyId={busyId}
                onView={() => onView(r)}
                onDismiss={() => onDismiss(r)}
                onHide={() => onHide(r)}
                onUnhide={() => onUnhide(r)}
                onSuspend={() => onSuspend(r)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// PER-ROW ACTIONS (shared between table + cards)
// ─────────────────────────────────────────────────────────────────────
function RowActions({ r, busyId, onView, onDismiss, onHide, onUnhide, onSuspend }) {
  const status = reportStatus(r);
  const isResolved = status === 'resolved';
  const isHidden = status === 'hidden';
  const dismissBusy = busyId === `dismiss-${r.kind}-${r.id}`;
  const hideBusy = busyId === `hide-${r.kind}-${r.id}`;
  const unhideBusy = busyId === `unhide-${r.kind}-${r.id}`;
  const suspendBusy = busyId === `suspend-${r.target_author_kind}-${r.target_author_id}`;
  const authorIsRep = r.target_author_kind === 'rep';

  return (
    <div className="ad-actions">
      {r.context_official_id && (
        <button
          type="button"
          className="ad-actbtn"
          onClick={onView}
          title="Open hosting page in new tab"
          aria-label="View hosting page"
        >
          <ExternalIcon size={11} />
        </button>
      )}
      {!isResolved && (
        <>
          <span className="ad-act-sep" />
          <button type="button" className="ad-actbtn" onClick={onDismiss} disabled={dismissBusy}>
            <DismissIcon size={12} />
            <span>Dismiss</span>
          </button>
          {isHidden ? (
            <button type="button" className="ad-actbtn" onClick={onUnhide} disabled={unhideBusy}>
              <UnhideIcon size={12} />
              <span>Unhide</span>
            </button>
          ) : (
            <button type="button" className="ad-actbtn ad-actbtn--danger" onClick={onHide} disabled={hideBusy}>
              <HideIcon size={12} />
              <span>Hide</span>
            </button>
          )}
          {r.target_author_id && r.target_author_kind && (
            <button
              type="button"
              className="ad-actbtn ad-actbtn--danger-solid"
              onClick={onSuspend}
              disabled={suspendBusy}
              title={`Suspend ${authorIsRep ? 'rep' : 'citizen'} ${r.target_author_name || ''}`}
            >
              <SuspendIcon size={12} />
              <span>Suspend</span>
            </button>
          )}
        </>
      )}
      {isResolved && (
        <span style={{ fontSize: '0.7rem', color: 'var(--cl-text-muted)', fontStyle: 'italic', marginLeft: 6 }}>
          Resolved {relTime(r.acted_at)}
        </span>
      )}
    </div>
  );
}

function StatusPill({ status }) {
  const label = status === 'hidden' ? 'Hidden' : status === 'resolved' ? 'Resolved' : 'Open';
  return (
    <span className={`ad-status ad-status--${status}`}>
      <span className="ad-status__dot" />
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────
// EMPTY STATES
// ─────────────────────────────────────────────────────────────────────
function EmptyOpen() {
  return (
    <div className="ad-empty">
      <svg className="ad-empty__art" viewBox="0 0 180 96" aria-hidden="true">
        <rect x="46" y="22" width="84" height="58" rx="8" fill="#ffffff" stroke="#dee2e6" strokeWidth="1.5" />
        <rect x="38" y="14" width="84" height="58" rx="8" fill="#ffffff" stroke="#dee2e6" strokeWidth="1.5" />
        <path d="M52 30h62M52 38h54M52 46h44M52 54h32" stroke="#dee2e6" strokeWidth="2" strokeLinecap="round" />
        <circle cx="135" cy="62" r="22" fill="#e6f3ec" stroke="#27ae60" strokeWidth="2" />
        <path d="M125 62 l7 7 l13 -14" stroke="#1e8048" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="135" y="42" fontSize="6" fontWeight="800" textAnchor="middle" fill="#1e8048" letterSpacing="0.5">CLEARED</text>
      </svg>
      <h2 className="ad-empty__title">No open reports right now.</h2>
      <p className="ad-empty__body">
        The queue is clear. New reports from citizens, reps, or auto-detection will surface
        here automatically. Toggle <em>&ldquo;Include resolved&rdquo;</em> above to review the
        last week of decisions.
      </p>
    </div>
  );
}

function EmptyAll() {
  return (
    <div className="ad-empty">
      <svg className="ad-empty__art" viewBox="0 0 180 96" aria-hidden="true">
        <rect x="48" y="22" width="84" height="58" rx="8" fill="#ffffff" stroke="#dee2e6" strokeWidth="1.5" />
        <path d="M62 38h56M62 48h42M62 58h28" stroke="#dee2e6" strokeWidth="2" strokeLinecap="round" />
        <circle cx="90" cy="51" r="44" fill="none" stroke="#dee2e6" strokeWidth="1.5" strokeDasharray="3 5" />
      </svg>
      <h2 className="ad-empty__title">No reports in the system yet.</h2>
      <p className="ad-empty__body">
        Nothing&rsquo;s been flagged since CivicView launched. When a citizen or rep files
        a report, or auto-detection flags content, it&rsquo;ll appear here for triage.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// HIDE MODAL
// ─────────────────────────────────────────────────────────────────────
function HideModal({ row, onCancel, onConfirm }) {
  const meta = TYPE_META[row.kind] || { label: row.kind };
  return (
    <div className="ad-modal-bg" onClick={onCancel}>
      <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ad-modal__hdr">
          <div className="ad-modal__eyebrow">Destructive action</div>
          <h2 className="ad-modal__title">Hide this {meta.label.toLowerCase()}?</h2>
        </div>
        <div className="ad-modal__body">
          <div>
            The content will be hidden from public view immediately. The author can see it&rsquo;s
            been moderated, and a hide event is logged against report <strong>#{row.id}</strong>.
          </div>
          <div className="ad-modal__contentblock">
            <div className="ad-modal__contentmeta">
              <span>{meta.label}</span>
              <span>·</span>
              <span style={{ fontFamily: 'var(--cl-font-mono)', textTransform: 'none', letterSpacing: 0 }}>
                id={row.target_id}
              </span>
              <span>·</span>
              <span>Reported for: {formatReason(row.reason)}</span>
            </div>
            <div className="ad-modal__contentbody">&ldquo;{row.target_preview || '(empty)'}&rdquo;</div>
            {row.target_author_name && (
              <div className="ad-modal__contentauthor">
                — {row.target_author_name}{row.target_author_kind ? ` (${row.target_author_kind})` : ''}
              </div>
            )}
          </div>
        </div>
        <div className="ad-modal__footer">
          <button type="button" className="ad-btn ad-btn--ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className="ad-btn ad-btn--danger" onClick={onConfirm} autoFocus>
            Hide content
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// SUSPEND MODAL
// ─────────────────────────────────────────────────────────────────────
function SuspendModal({ row, onCancel, onConfirm }) {
  const [reason, setReason] = useState(row?.detail || formatReason(row?.reason) || '');
  const [alsoHide, setAlsoHide] = useState(false);
  const authorKind = row.target_author_kind === 'rep' ? 'rep' : 'citizen';

  return (
    <div className="ad-modal-bg" onClick={onCancel}>
      <div className="ad-modal ad-modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="ad-modal__hdr">
          <div className="ad-modal__eyebrow">Destructive action</div>
          <h2 className="ad-modal__title">Suspend {row.target_author_name || 'this user'}?</h2>
        </div>
        <div className="ad-modal__body">
          <div>
            The {authorKind} account will be unable to post, comment, or vote. They&rsquo;ll see
            a &ldquo;Suspended&rdquo; banner on next visit. Suspension is reversible from the{' '}
            <strong>Suspended users</strong> tab.
          </div>

          <div className="ad-modal__row">
            <span className="ad-modal__label">Reason on record (visible to other admins)</span>
            <textarea
              className="ad-modal__textarea"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why are you suspending this account?"
            />
          </div>

          <div className="ad-modal__hr" />

          <div className="ad-modal__checkrow">
            <button
              type="button"
              className={`ad-modal__check ${alsoHide ? 'checked' : ''}`}
              onClick={() => setAlsoHide((v) => !v)}
              aria-pressed={alsoHide}
              aria-label={`Also hide all of ${row.target_author_name || 'this user'}'s existing content`}
            />
            <div className="ad-modal__checktext">
              <strong>Also hide all of {row.target_author_name || 'this user'}&rsquo;s existing content</strong>
              <div style={{ marginTop: 2 }}>
                Hides every post and comment on the account in addition to the suspension.
                Default off — usually we leave history visible.
              </div>
            </div>
          </div>
        </div>
        <div className="ad-modal__footer">
          <button type="button" className="ad-btn ad-btn--ghost" onClick={onCancel}>Cancel</button>
          <button
            type="button"
            className="ad-btn ad-btn--danger"
            onClick={() => onConfirm({ reason, alsoHide })}
          >
            Suspend {authorKind}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// GLYPHS — lifted from /Design Exports/civicview-admin-moderation-page/
// project/admin/admin-glyphs.jsx. Inlined here so the page is
// self-contained.
// ─────────────────────────────────────────────────────────────────────
function TypePostIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" fill="rgba(45,106,79,0.18)" />
      <path d="M7 9h10M7 13h10M7 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function TypeCommentIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M4 5h16v11H9l-4 4V5Z" fill="rgba(69,123,157,0.22)" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 10h8M8 13h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function TypePollIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <rect x="3" y="5" width="18" height="3.5" rx="1.5" fill="rgba(255,186,8,0.45)" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="10.5" width="13" height="3.5" rx="1.5" fill="rgba(255,186,8,0.3)" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="16" width="8" height="3.5" rx="1.5" fill="rgba(255,186,8,0.2)" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function TypePollCommentIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <rect x="3" y="3" width="9" height="3" rx="1.5" fill="rgba(108,62,193,0.3)" stroke="currentColor" strokeWidth="1.4" />
      <rect x="3" y="7.5" width="6" height="3" rx="1.5" fill="rgba(108,62,193,0.18)" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 14h11v6h-7l-4 3v-9Z" fill="rgba(108,62,193,0.18)" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function RefreshIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M20 12a8 8 0 1 1-2.3-5.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M20 4v4h-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
function SearchIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function ExternalIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M14 4h6v6M20 4l-8 8M11 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
function HideIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M3 12s3.5-6 9-6c2 0 3.7.7 5.1 1.7M21 12s-3.5 6-9 6c-2 0-3.7-.7-5.1-1.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" fill="none" />
    </svg>
  );
}
function UnhideIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" fill="rgba(45,106,79,0.18)" />
    </svg>
  );
}
function DismissIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SuspendIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <path d="M5.5 5.5l13 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
