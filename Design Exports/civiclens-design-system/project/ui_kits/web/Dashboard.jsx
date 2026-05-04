/* Dashboard — owner-only constituent rollup. */

function Dashboard({ onJumpToPost }) {
  const d = SEED.dashboard;
  return (
    <div className="cl-dash" aria-label="Constituent dashboard">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <h1 className="cl-h1" style={{ margin: 0 }}>Constituent dashboard</h1>
        <div style={{ fontSize: 'var(--cl-text-xs)', color: 'var(--cl-text-light)' }}>Engagement rollup across every post on your page · Last 7 days</div>
      </div>

      <div className="cl-stats">
        {d.summary.map(s => (
          <div key={s.eye} className="cl-stat">
            <div className="cl-stat__eye">{s.eye}</div>
            <div className="cl-stat__num">{s.num}{s.sub && <span style={{ fontSize: '0.78rem', color: 'var(--cl-text-muted)', fontWeight: 500, marginLeft: 4 }}>{s.sub}</span>}</div>
            <div className={`cl-stat__delta ${s.dir === 'down' ? 'neg' : ''}`}>{s.delta}</div>
          </div>
        ))}
      </div>

      <div className="cl-dash__split">
        <div className="cl-dash__list">
          <h3>Top posts by engagement</h3>
          {d.topPosts.map(p => (
            <button key={p.id} className="cl-dash__row"
              onClick={() => onJumpToPost(p.id)}
              style={{ background: 'transparent', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer' }}>
              <span style={{ flex: 1, color: 'var(--cl-text)', fontSize: 'var(--cl-text-sm)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.body}</span>
              <span className="num">{p.engagement.toLocaleString()}</span>
            </button>
          ))}
        </div>
        <div className="cl-dash__list">
          <h3>Top commenters</h3>
          {d.topCommenters.map(c => (
            <div key={c.name} className="cl-dash__row">
              <div className="cl-avatar cl-avatar--sm">{c.initials}</div>
              <div style={{ flex: 1, fontSize: 'var(--cl-text-sm)' }}>
                <div style={{ fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: 'var(--cl-text-xs)', color: 'var(--cl-text-light)' }}>{c.district}</div>
              </div>
              <span className="num">{c.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="cl-dash__list">
        <h3>Reactions breakdown</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 4 }}>
          <div style={{ flex: 1, height: 12, background: 'var(--cl-bg-soft)', borderRadius: 999, overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${d.reactions.ratio}%`, background: 'var(--cl-up)' }} />
            <div style={{ flex: 1, background: 'var(--cl-down)' }} />
          </div>
          <div style={{ display: 'flex', gap: 14, fontSize: 'var(--cl-text-sm)' }}>
            <span style={{ color: 'var(--cl-up)', fontWeight: 700 }}>▲ <span className="cl-num">{d.reactions.up.toLocaleString()}</span></span>
            <span style={{ color: 'var(--cl-down)', fontWeight: 700 }}>▼ <span className="cl-num">{d.reactions.down.toLocaleString()}</span></span>
            <span style={{ color: 'var(--cl-text-light)' }}>{d.reactions.ratio}% positive</span>
          </div>
        </div>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;
