// Modals + empty states + access states for /admin.

function AdHideModal({ row, onCancel, onConfirm }) {
  if (!row) return null;
  return (
    <div className="ad-modal-bg" onClick={onCancel}>
      <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ad-modal__hdr">
          <div className="ad-modal__eyebrow">Destructive action</div>
          <h2 className="ad-modal__title">Hide this {row.typeLabel.toLowerCase()}?</h2>
        </div>
        <div className="ad-modal__body">
          <div>
            The content will be hidden from public view immediately. The author can see it's been moderated, and a hide event is logged against report <strong>#{row.id}</strong>.
          </div>
          <div className="ad-modal__contentblock">
            <div className="ad-modal__contentmeta">
              <span>{row.typeLabel}</span>
              <span>·</span>
              <span style={{ fontFamily: 'var(--cl-font-mono)', textTransform: 'none', letterSpacing: 0 }}>{row.targetId}</span>
              <span>·</span>
              <span>Reported for: {row.reason}</span>
            </div>
            <div className="ad-modal__contentbody">"{row.preview}"</div>
            <div className="ad-modal__contentauthor">— {row.author} on {row.targetHost}</div>
          </div>
        </div>
        <div className="ad-modal__footer">
          <button className="ad-btn ad-btn--ghost" onClick={onCancel}>Cancel</button>
          <button className="ad-btn ad-btn--danger" onClick={onConfirm} autoFocus>
            Hide content
          </button>
        </div>
      </div>
    </div>
  );
}

function AdSuspendModal({ row, onCancel, onConfirm }) {
  const [reason, setReason] = React.useState(row?.reasonDetail || row?.reason || '');
  const [alsoHide, setAlsoHide] = React.useState(false);
  React.useEffect(() => {
    setReason(row?.reasonDetail || row?.reason || '');
    setAlsoHide(false);
  }, [row?.id]);
  if (!row) return null;
  const authorKind = row.authorRole === 'rep' ? 'rep' : 'citizen';

  return (
    <div className="ad-modal-bg" onClick={onCancel}>
      <div className="ad-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <div className="ad-modal__hdr">
          <div className="ad-modal__eyebrow">Destructive action</div>
          <h2 className="ad-modal__title">Suspend {row.author}?</h2>
        </div>
        <div className="ad-modal__body">
          <div>
            The {authorKind} account will be unable to post, comment, or vote. They'll see a "Suspended" banner on next visit. Suspension is reversible from the <strong>Suspended users</strong> tab.
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
              className={`ad-modal__check ${alsoHide ? 'checked' : ''}`}
              onClick={() => setAlsoHide((v) => !v)}
              aria-pressed={alsoHide}
              aria-label="Also hide all of this user's existing content"
            />
            <div className="ad-modal__checktext">
              <strong>Also hide all of {row.author}'s existing content</strong>
              <div style={{ marginTop: 2 }}>
                Hides every post and comment on the account in addition to the suspension. Default off — usually we leave history visible.
              </div>
            </div>
          </div>
        </div>
        <div className="ad-modal__footer">
          <button className="ad-btn ad-btn--ghost" onClick={onCancel}>Cancel</button>
          <button className="ad-btn ad-btn--danger" onClick={() => onConfirm({ reason, alsoHide })}>
            Suspend {authorKind}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdEmptyOpen() {
  return (
    <div className="ad-empty">
      <svg className="ad-empty__art" viewBox="0 0 180 96" aria-hidden="true">
        {/* Two stacked papers, one stamped 'cleared' */}
        <rect x="46" y="22" width="84" height="58" rx="8" fill="#ffffff" stroke="#dee2e6" strokeWidth="1.5" />
        <rect x="38" y="14" width="84" height="58" rx="8" fill="#ffffff" stroke="#dee2e6" strokeWidth="1.5" />
        <path d="M52 30h62M52 38h54M52 46h44M52 54h32" stroke="#dee2e6" strokeWidth="2" strokeLinecap="round" />
        {/* Green stamp */}
        <circle cx="135" cy="62" r="22" fill="#e6f3ec" stroke="#27ae60" strokeWidth="2" />
        <path d="M125 62 l7 7 l13 -14" stroke="#1e8048" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="135" y="42" fontSize="6" fontWeight="800" textAnchor="middle" fill="#1e8048" letterSpacing="0.5">CLEARED</text>
      </svg>
      <h2 className="ad-empty__title">No open reports right now.</h2>
      <p className="ad-empty__body">
        The queue is clear. New reports from citizens, reps, or auto-detection will surface here automatically.
        Toggle <em>"Include resolved"</em> above to review the last week of decisions.
      </p>
      <div className="ad-empty__hint">
        <AdGlyph.Sparkle size={13} /> Last cleared 14 minutes ago · 47 resolved this week
      </div>
    </div>
  );
}

function AdEmptyAll() {
  return (
    <div className="ad-empty">
      <svg className="ad-empty__art" viewBox="0 0 180 96" aria-hidden="true">
        <rect x="48" y="22" width="84" height="58" rx="8" fill="#ffffff" stroke="#dee2e6" strokeWidth="1.5" />
        <path d="M62 38h56M62 48h42M62 58h28" stroke="#dee2e6" strokeWidth="2" strokeLinecap="round" />
        <circle cx="90" cy="51" r="44" fill="none" stroke="#dee2e6" strokeWidth="1.5" strokeDasharray="3 5" />
      </svg>
      <h2 className="ad-empty__title">No reports in the system yet.</h2>
      <p className="ad-empty__body">
        Nothing's been flagged since CivicView launched. When a citizen or rep files a report, or auto-detection flags content, it'll appear here for triage.
      </p>
    </div>
  );
}

function AdProbing() {
  return (
    <div className="ad-access">
      <div className="ad-access__art"><div className="ad-spinner" /></div>
      <h2 className="ad-access__title">Checking admin access…</h2>
      <p className="ad-access__body">Verifying your account against the ADMIN_EMAILS allowlist. This usually takes less than a second.</p>
    </div>
  );
}

function AdUnauthed() {
  return (
    <div className="ad-access">
      <div className="ad-access__art">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="9" r="4" stroke="#1b263b" strokeWidth="1.8" fill="#e6f3ec" />
          <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#1b263b" strokeWidth="1.8" strokeLinecap="round" fill="#e6f3ec" />
        </svg>
      </div>
      <h2 className="ad-access__title">Sign in required</h2>
      <p className="ad-access__body">
        The moderation queue is restricted to accounts on the <strong>ADMIN_EMAILS</strong> allowlist. Sign in with your admin account to continue. Citizens and reps shouldn't see this page in normal use.
      </p>
      <button className="ad-access__cta">Sign in</button>
      <a className="ad-access__link" href="#">← Back to CivicView home</a>
    </div>
  );
}

function AdDenied({ email = 'maria.h@example.com' }) {
  return (
    <div className="ad-access">
      <div className="ad-access__art">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3 4 6v6c0 4.5 3.4 8.2 8 9 4.6-.8 8-4.5 8-9V6l-8-3Z" fill="#fde8e8" stroke="#b13b3b" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M9 9l6 6M15 9l-6 6" stroke="#b13b3b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="ad-access__title">Admin access required</h2>
      <p className="ad-access__body">
        You're signed in as <span className="ad-access__email">{email}</span>, which isn't on the moderator allowlist. The <strong>ADMIN_EMAILS</strong> env var on the server controls who sees this page. If you should have access, ask the deploy owner to add your email and redeploy.
      </p>
      <a className="ad-access__link" href="#">← Back to CivicView home</a>
    </div>
  );
}

Object.assign(window, { AdHideModal, AdSuspendModal, AdEmptyOpen, AdEmptyAll, AdProbing, AdUnauthed, AdDenied });
