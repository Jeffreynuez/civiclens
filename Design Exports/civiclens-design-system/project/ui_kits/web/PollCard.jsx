/* PollCard — three modes: full / hidden / reveal_after_close. */

const SCOPE_DISPLAY = {
  country: { emoji: '🇺🇸', label: 'Country' },
  state:    { emoji: '📍', label: 'State' },
  district: { emoji: '🎯', label: 'FL-19' },
  city:     { emoji: '🏙', label: 'City' },
};

function PollCard({ poll, persona, onVote }) {
  const totalShown = poll.options.reduce((s, o) => s + o.votes, 0) || poll.totalVotes || 0;
  const hasVoted = poll.options.some(o => o.mine);
  const isOwner = persona === 'owner';
  const isCitizen = persona === 'citizen';
  const scope = SCOPE_DISPLAY[poll.scope] || SCOPE_DISPLAY.country;

  // reveal-after-close — non-owners see hidden bars + counts
  const concealed = poll.mode === 'reveal_after_close' && !isOwner;

  return (
    <div className="cl-poll">
      <div className="cl-poll__q">{poll.question}</div>
      <div className="cl-poll__meta">
        <span>🗳 <strong className="cl-num" style={{ color: 'var(--cl-text)', fontWeight: 700 }}>{(concealed ? '—' : poll.totalVotes.toLocaleString())}</strong> votes</span>
        <span>·</span>
        <span>{poll.closesIn.startsWith('Closes') ? poll.closesIn : `Closes in ${poll.closesIn}`}</span>
        <span>·</span>
        <span className="cl-poll__scope">{scope.emoji} {scope.label}</span>
        {poll.mode === 'reveal_after_close' && (
          <span className="cl-vchip" style={{ marginLeft: 'auto' }}>RESULTS HIDDEN</span>
        )}
      </div>

      {concealed ? (
        <div className="cl-poll__hidden">
          Results are hidden until the poll closes — this is intentional, to keep votes from tilting the room.
          {isCitizen && !hasVoted && (
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
              {poll.options.map(o => (
                <button key={o.id} className="cl-poll__bar" style={{ paddingBlock: 10 }} onClick={() => onVote && onVote(o.id)}>
                  <span className="cl-poll__label">{o.label}</span>
                </button>
              ))}
            </div>
          )}
          {isCitizen && hasVoted && (
            <div style={{ marginTop: 8, fontWeight: 700, color: 'var(--cl-accent)' }}>✓ Your vote is in. Come back at close.</div>
          )}
        </div>
      ) : (
        <div className="cl-poll__opts">
          {poll.options.map(o => {
            const pct = totalShown > 0 ? Math.round((o.votes / totalShown) * 100) : 0;
            return (
              <button
                key={o.id}
                className={`cl-poll__bar ${o.mine ? 'your' : ''} ${(!isCitizen || hasVoted) ? 'disabled' : ''}`}
                onClick={() => isCitizen && !hasVoted && onVote && onVote(o.id)}>
                <span className="cl-poll__fill" style={{ width: `${pct}%` }} />
                <span className="cl-poll__label">{o.label}</span>
                <span className="cl-poll__pct">{pct}%</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

window.PollCard = PollCard;
