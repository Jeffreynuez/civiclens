// Queue table (desktop / tablet) + mobile card list.

function AdTypeIcon({ type }) {
  const cls = {
    post: 'ad-cell-type__icon ad-cell-type__icon--post',
    comment: 'ad-cell-type__icon ad-cell-type__icon--comment',
    poll: 'ad-cell-type__icon ad-cell-type__icon--poll',
    pollcomment: 'ad-cell-type__icon ad-cell-type__icon--pollcomment',
  }[type] || 'ad-cell-type__icon';
  const Glyph = {
    post: AdGlyph.TypePost,
    comment: AdGlyph.TypeComment,
    poll: AdGlyph.TypePoll,
    pollcomment: AdGlyph.TypePollComment,
  }[type] || AdGlyph.TypeComment;
  return (
    <span className={cls}>
      <Glyph size={14} />
    </span>
  );
}

function AdStatusPill({ status }) {
  const label = { open: 'Open', hidden: 'Hidden', resolved: 'Resolved' }[status] || status;
  return (
    <span className={`ad-status ad-status--${status}`}>
      <span className="ad-status__dot" />
      {label}
    </span>
  );
}

function AdRowActions({ row, onHide, onUnhide, onDismiss, onSuspend, onView, compact = false }) {
  const isHidden = row.status === 'hidden';
  const isResolved = row.status === 'resolved';
  const authorIsRep = row.authorRole === 'rep';
  return (
    <div className="ad-actions">
      <button className="ad-actbtn" onClick={onView} title="Open hosting page in new tab" aria-label="View hosting page">
        <AdGlyph.External size={11} />
      </button>
      {!isResolved && (
        <>
          <span className="ad-act-sep" />
          <button className="ad-actbtn" onClick={onDismiss}>
            <AdGlyph.Dismiss size={12} />
            <span>Dismiss</span>
          </button>
          {isHidden ? (
            <button className="ad-actbtn" onClick={onUnhide}>
              <AdGlyph.Unhide size={12} />
              <span>Unhide</span>
            </button>
          ) : (
            <button className="ad-actbtn ad-actbtn--danger" onClick={onHide}>
              <AdGlyph.Hide size={12} />
              <span>Hide</span>
            </button>
          )}
          <button
            className="ad-actbtn ad-actbtn--danger-solid"
            onClick={onSuspend}
            title={`Suspend ${authorIsRep ? 'rep' : 'citizen'} ${row.author}`}
          >
            <AdGlyph.Suspend size={12} />
            <span>Suspend</span>
          </button>
        </>
      )}
      {isResolved && (
        <span style={{ fontSize: '0.7rem', color: 'var(--cl-text-muted)', fontStyle: 'italic', marginLeft: 6 }}>
          {row.resolution}
        </span>
      )}
    </div>
  );
}

function AdQueueTable({ rows, onAction, compact = false }) {
  return (
    <div className="ad-tablewrap">
      <div className="ad-tablewrap__count">
        <span>
          Showing <strong>{rows.length}</strong> {rows.length === 1 ? 'report' : 'reports'} ·{' '}
          <strong>{rows.filter((r) => r.status === 'open').length}</strong> open ·{' '}
          <strong>{rows.filter((r) => r.status === 'hidden').length}</strong> hidden
        </span>
        <span className="ad-tablewrap__count-actions">
          <button className="ad-linkbtn">Sort: Newest first ↓ <span className="ad-stub" style={{ marginLeft: 4 }}>Stub</span></button>
          <button className="ad-linkbtn">Density: Compact <span className="ad-stub" style={{ marginLeft: 4 }}>Stub</span></button>
        </span>
      </div>
      <div className="ad-tablewrap__scroll">
        <table className="ad-table" style={{ minWidth: compact ? 1000 : undefined }}>
        <thead>
          <tr>
            <th style={{ width: 160 }}>Type</th>
            <th>Content preview</th>
            <th style={{ width: 170 }}>Reason</th>
            {!compact && <th style={{ width: 130 }}>Reporter</th>}
            <th style={{ width: 90 }}>When</th>
            <th style={{ width: 100 }}>Status</th>
            <th style={{ width: compact ? 200 : 290 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className={r.status === 'hidden' ? 'is-hidden' : r.status === 'resolved' ? 'is-resolved' : ''}>
              <td>
                <div className="ad-cell-type">
                  <div className="ad-cell-type__main">
                    <AdTypeIcon type={r.type} />
                    {r.typeLabel}
                  </div>
                  <span className="ad-cell-type__id">id={r.targetId}</span>
                </div>
              </td>
              <td>
                <div className="ad-cell-preview" title={r.preview}>{r.preview}</div>
              </td>
              <td>
                <div className="ad-cell-reason">
                  <span className={`ad-cell-reason__pill ad-cell-reason__pill--${r.reasonKey}`}>{r.reason}</span>
                  {r.reasonDetail && <div className="ad-cell-reason-text">"{r.reasonDetail}"</div>}
                </div>
              </td>
              {!compact && (
                <td>
                  <div className="ad-cell-reporter">
                    <span className="ad-cell-reporter__name">{r.reporter}</span>
                    <span className={`ad-cell-reporter__kind ad-cell-reporter__kind--${r.reporterKind}`}>
                      {r.reporterKind === 'rep' ? 'Rep' : r.reporterKind === 'system' ? 'System' : 'Citizen'}
                    </span>
                    {r.autoFlag && <span className="ad-cell-reporter__autoflag">Auto-flag</span>}
                  </div>
                </td>
              )}
              <td>
                <div className="ad-cell-when">
                  <span className="ad-cell-when__rel">{r.when}</span>
                  <span>{r.whenAbs}</span>
                </div>
              </td>
              <td>
                <AdStatusPill status={r.status} />
              </td>
              <td>
                <AdRowActions
                  row={r}
                  compact={compact}
                  onView={() => onAction('view', r)}
                  onDismiss={() => onAction('dismiss', r)}
                  onHide={() => onAction('hide', r)}
                  onUnhide={() => onAction('unhide', r)}
                  onSuspend={() => onAction('suspend', r)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

function AdQueueCardList({ rows, onAction }) {
  return (
    <div className="ad-cardlist">
      {rows.map((r) => (
        <div key={r.id} className={`ad-card ${r.status === 'hidden' ? 'is-hidden' : r.status === 'resolved' ? 'is-resolved' : ''}`}>
          <div className="ad-card__hdr">
            <div className="ad-card__type">
              <AdTypeIcon type={r.type} />
              <div className="ad-card__type-text">
                <div className="ad-card__type-main">{r.typeLabel}</div>
                <div className="ad-card__type-id">id={r.targetId}</div>
              </div>
            </div>
            <AdStatusPill status={r.status} />
          </div>
          <div className="ad-card__preview">{r.preview}</div>
          <div className="ad-card__meta">
            <div>
              <span className="ad-card__metalabel">Reason</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span className={`ad-cell-reason__pill ad-cell-reason__pill--${r.reasonKey}`} style={{ alignSelf: 'flex-start' }}>
                  {r.reason}
                </span>
                {r.reasonDetail && (
                  <div style={{ fontSize: 'var(--cl-text-xs)', color: 'var(--cl-text-light)', lineHeight: 1.35 }}>
                    "{r.reasonDetail}"
                  </div>
                )}
              </div>
            </div>
            <div>
              <span className="ad-card__metalabel">Reporter · When</span>
              <div style={{ fontSize: 'var(--cl-text-sm)', fontWeight: 600 }}>{r.reporter}</div>
              <div style={{ fontSize: 'var(--cl-text-xs)', color: 'var(--cl-text-light)' }}>
                {r.reporterKind === 'rep' ? 'Rep' : r.reporterKind === 'system' ? 'System' : 'Citizen'} · {r.when}
              </div>
              {r.autoFlag && (
                <div className="ad-cell-reporter__autoflag" style={{ marginTop: 3 }}>Auto-flag</div>
              )}
            </div>
          </div>
          <div className="ad-card__actions">
            <AdRowActions
              row={r}
              compact
              onView={() => onAction('view', r)}
              onDismiss={() => onAction('dismiss', r)}
              onHide={() => onAction('hide', r)}
              onUnhide={() => onAction('unhide', r)}
              onSuspend={() => onAction('suspend', r)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { AdTypeIcon, AdStatusPill, AdRowActions, AdQueueTable, AdQueueCardList });
