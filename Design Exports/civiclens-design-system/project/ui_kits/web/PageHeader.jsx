/* Page header — rep avatar + name + claim status + perspective switcher. */

function PageHeader({ rep, persona, onPersonaChange, ownerView, onOwnerView }) {
  return (
    <div className="cl-pagehdr">
      <div className="cl-pagehdr__avatar">{rep.initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="cl-pagehdr__name">{rep.name}</div>
        <div className="cl-pagehdr__role">{rep.role} · <span className="cl-pagehdr__claimed">✓ Claimed</span></div>
        <div style={{ marginTop: 8, display: 'flex', gap: 12, alignItems: 'center', fontSize: '0.78rem', color: 'var(--cl-text-light)' }}>
          <span><strong className="cl-num" style={{ color: 'var(--cl-text)' }}>{rep.followers.toLocaleString()}</strong> following</span>
          {persona === 'owner' ? (
            <div className="cl-modeswitch" role="tablist" aria-label="Owner view">
              <button className={ownerView === 'feed' ? 'active' : ''} onClick={() => onOwnerView('feed')}>Feed</button>
              <button className={ownerView === 'dashboard' ? 'active' : ''} onClick={() => onOwnerView('dashboard')}>Dashboard</button>
            </div>
          ) : null}
        </div>
      </div>
      <div className="cl-persona" role="tablist" aria-label="Switch perspective" style={{ whiteSpace: 'nowrap' }}>
        <button style={{ whiteSpace: 'nowrap' }} className={persona === 'anonymous' ? 'active' : ''} onClick={() => onPersonaChange('anonymous')}>Anonymous</button>
        <button style={{ whiteSpace: 'nowrap' }} className={persona === 'citizen' ? 'active' : ''} onClick={() => onPersonaChange('citizen')}>Citizen</button>
        <button style={{ whiteSpace: 'nowrap' }} className={persona === 'owner' ? 'active' : ''} onClick={() => onPersonaChange('owner')}>Page owner</button>
      </div>
    </div>
  );
}

window.PageHeader = PageHeader;
