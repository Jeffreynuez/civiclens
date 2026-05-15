/* PollCard — the workhorse card on /polls.

   Visual variants by `kind`:
     - rep        → navy-tinted chip + dark rep avatar
     - citizen    → accent-tinted chip + accent avatar + "UNVERIFIED" badge
     - standalone → warning-tinted chip + neutral avatar

   Up to 8 option rows render with horizontal bars. If the poll has
   more options than `maxOpts` (default 4 for grid density), we collapse
   the tail into "+N more — open page".

   Vote interactions are no-ops in the prototype; the bars + percentages
   are read directly from seed data so the design reviews from realistic
   numbers rather than zero-state.
*/

function PollCard({ poll, maxOpts = 4, onDeepLink }) {
  const G = window.PollsGlyph;
  const visibleOpts = poll.options.slice(0, maxOpts);
  const overflow = poll.options.length - visibleOpts.length;

  const kindLabel = {
    rep: 'Rep',
    citizen: 'Citizen',
    standalone: 'Standalone',
  }[poll.kind];

  const formatCount = (n) =>
    n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k' : String(n);

  return (
    <article className="poll-card">
      <div className="poll-card__chips">
        <span className={`poll-kind poll-kind--${poll.kind}`}>{kindLabel}</span>
        <span className="poll-source">{poll.source.code}</span>
        <span className="poll-card__time">{poll.time}</span>
      </div>

      <div className="poll-card__author">
        <div className={`poll-card__avatar poll-card__avatar--${poll.author.avatarTone}`}>
          {poll.author.initials}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="poll-card__name">
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {poll.author.name}
            </span>
            {!poll.author.verified && (
              <span className="poll-card__unverified" title="This author hasn't been identity-verified yet">
                Unverified
              </span>
            )}
          </div>
          <div className="poll-card__role">{poll.author.role}</div>
        </div>
      </div>

      <div className="poll-card__q">{poll.question}</div>

      <div className="poll-card__opts">
        {visibleOpts.map((o) => (
          <button
            key={o.id}
            className={`poll-opt ${o.mine ? 'is-mine is-voted' : ''} ${o.leading ? 'is-leading' : ''}`}
            type="button">
            <span className="poll-opt__fill" style={{ width: `${o.pct}%` }} />
            <span className="poll-opt__label">{o.label}</span>
            <span className="poll-opt__pct">{o.pct}%</span>
            <span className="poll-opt__votes cl-num">{formatCount(o.votes)}</span>
          </button>
        ))}
        {overflow > 0 && (
          <div className="poll-card__overflow">+{overflow} more option{overflow === 1 ? '' : 's'} — open page to vote</div>
        )}
      </div>

      <div className="poll-card__footer">
        <span className="poll-card__counts">
          <G.Vote size={12} />
          <span><strong className="cl-num">{formatCount(poll.totalVotes)}</strong> votes</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <G.Chat size={12} />
          <span><strong className="cl-num">{formatCount(poll.comments)}</strong> comments</span>
        </span>
        {poll.kind !== 'standalone' ? (
          <button className="poll-card__deeplink" type="button" onClick={() => onDeepLink && onDeepLink(poll)}>
            Open page <G.Arrow size={12} />
          </button>
        ) : (
          <button className="poll-card__deeplink" type="button" onClick={() => onDeepLink && onDeepLink(poll)}>
            Open poll <G.Arrow size={12} />
          </button>
        )}
      </div>
    </article>
  );
}

window.PollCard = PollCard;
