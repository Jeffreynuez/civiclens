/* Person card components for the National Officials Panel.
   Three sizes: regular, small (compact, for cabinet/whips), hero (large).
   All use Phosphor Duotone iconography from icons.jsx. */

const PartyChip = ({ p }) => {
  const label = p === 'r' ? 'R' : p === 'd' ? 'D' : 'I';
  return <span className={`party-chip ${p}`}>{label}</span>;
};

const ClaimBadge = ({ claimed }) => (
  <span className="pc__claim" style={{ color: claimed ? 'var(--cl-accent)' : 'var(--cl-text-muted)' }}>
    {claimed ? <Ico.Check size={11} /> : (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="7"/></svg>
    )}
    {claimed ? 'Claimed' : 'Unclaimed'}
  </span>
);

function PersonCard({ p, hero, sm, showStats = true, onLockedAction }) {
  const cls = ['pc', hero && 'pc--hero', sm && 'pc--sm'].filter(Boolean).join(' ');
  const handleTrack = () => onLockedAction && onLockedAction('Verify your address to track');

  return (
    <div className={cls}>
      <div className="pc__top">
        <div className={`pc__av ${p.party}`}>{p.initials}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          {hero && <div className="pc__title-eyebrow">{p.role}</div>}
          <div className="pc__name-row">
            <span className="pc__name">{p.name}</span>
            {!sm && p.claimed !== undefined && <ClaimBadge claimed={p.claimed} />}
          </div>
          <div className="pc__role">
            <PartyChip p={p.party} />
            {!hero && <span>{p.role}</span>}
            {p.state && <><span className="sep">·</span><span>{p.state}</span></>}
            {p.since && <><span className="sep">·</span><span>since {p.since}</span></>}
          </div>
        </div>
      </div>
      {!sm && showStats && p.followers && (
        <div className="pc__bottom">
          <span className="pc__stat"><Ico.Users size={12} /> <strong>{p.followers}</strong> followers</span>
          <span className="pc__stat" style={{ marginLeft: 12 }}><Ico.Chat size={12} /> last post {p.lastPost}</span>
          <button className="pc__btn pc__btn--locked" onClick={handleTrack} aria-label="Verify your address to track this official">
            <Ico.Lock size={11} /> Verify to track
          </button>
        </div>
      )}
    </div>
  );
}

window.PersonCard = PersonCard;
window.PartyChip = PartyChip;
