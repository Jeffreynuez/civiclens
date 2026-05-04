/* Modal — backdrop + centered card. Used by the citizen-login stub. */

function Modal({ open, onClose, children, title, notice }) {
  if (!open) return null;
  return (
    <div className="cl-modal-bg" onClick={onClose}>
      <div className="cl-modal" onClick={e => e.stopPropagation()}>
        {title && <h2>{title}</h2>}
        {notice && <div className="cl-modal__notice">{notice}</div>}
        {children}
      </div>
    </div>
  );
}

function CitizenLoginModal({ open, onClose, onSignIn }) {
  return (
    <Modal open={open} onClose={onClose} title="Sign in to engage"
      notice="Demo preview — these accounts are self-attested. Production will add USPS / id.me-style verification.">
      <div style={{ fontSize: 'var(--cl-text-sm)', color: 'var(--cl-text-light)', marginBottom: 4 }}>
        Sign in as a citizen to like, comment on posts, and vote in polls.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input className="cl-input" placeholder="Email" defaultValue="maria.hernandez@civiclens-voters.com"
          style={{ padding: '10px 12px', border: '1px solid var(--cl-border)', borderRadius: 8, fontSize: '0.92rem', outline: 'none' }} />
        <input className="cl-input" placeholder="Password" type="password" defaultValue="CivicLensVoter!2026"
          style={{ padding: '10px 12px', border: '1px solid var(--cl-border)', borderRadius: 8, fontSize: '0.92rem', outline: 'none' }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button className="cl-btn cl-btn--primary" style={{ flex: 1 }} onClick={onSignIn}>Sign in</button>
          <button className="cl-btn cl-btn--ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
      <div style={{ fontSize: 'var(--cl-text-xs)', color: 'var(--cl-text-muted)', textAlign: 'center', marginTop: 4 }}>
        Shared demo password: <code style={{ fontFamily: 'var(--cl-font-mono)' }}>CivicLensVoter!2026</code>
      </div>
    </Modal>
  );
}

window.Modal = Modal;
window.CitizenLoginModal = CitizenLoginModal;
