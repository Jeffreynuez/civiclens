/* App — assembles the click-thru. Persona switcher drives engagement gates. */

const { useState, useMemo } = React;

function App() {
  const [persona, setPersona] = useState('citizen');     // anonymous | citizen | owner
  const [ownerView, setOwnerView] = useState('feed');     // feed | dashboard
  const [scope, setScope] = useState(null);                // null | country | state | district | city
  const [posts, setPosts] = useState(SEED.posts);
  const [loginOpen, setLoginOpen] = useState(false);
  const [highlightId, setHighlightId] = useState(null);

  const me = SEED.citizens.me;

  const onPersonaChange = (p) => {
    setPersona(p);
    if (p !== 'owner') setOwnerView('feed');
    setScope(null);
  };

  // ── Mutations ───────────────────────────────────────────────
  const reactToPost = (postId, kind) => {
    setPosts(ps => ps.map(p => {
      if (p.id !== postId) return p;
      const cur = p.reactions.mine;
      const next = cur === kind ? null : kind;
      const r = { ...p.reactions, mine: next };
      // adjust counts
      if (cur === 'up') r.up -= 1;
      if (cur === 'down') r.down -= 1;
      if (next === 'up') r.up += 1;
      if (next === 'down') r.down += 1;
      return { ...p, reactions: r };
    }));
  };

  const commentOnPost = (postId, body) => {
    setPosts(ps => ps.map(p => p.id === postId ? {
      ...p,
      comments: [...p.comments, {
        id: `c_${Date.now()}`,
        author: { id: me.id, name: me.name, initials: me.initials, district: me.district, verified: false },
        body, timeAgo: 'just now', up: 0, down: 0, myReaction: null,
      }],
    } : p));
  };

  const reactToComment = (postId, cid, kind) => {
    setPosts(ps => ps.map(p => p.id !== postId ? p : {
      ...p,
      comments: p.comments.map(c => {
        if (c.id !== cid) return c;
        const cur = c.myReaction;
        const next = cur === kind ? null : kind;
        let { up, down } = c;
        if (cur === 'up') up -= 1;
        if (cur === 'down') down -= 1;
        if (next === 'up') up += 1;
        if (next === 'down') down += 1;
        return { ...c, up, down, myReaction: next };
      }),
    }));
  };

  const deleteComment = (postId, cid) => {
    setPosts(ps => ps.map(p => p.id !== postId ? p : {
      ...p,
      comments: p.comments.filter(c => c.id !== cid),
    }));
  };

  const voteOnPoll = (postId, optId) => {
    setPosts(ps => ps.map(p => {
      if (p.id !== postId || !p.poll) return p;
      const opts = p.poll.options.map(o => o.id === optId ? { ...o, votes: o.votes + 1, mine: true } : o);
      return { ...p, poll: { ...p.poll, options: opts, totalVotes: p.poll.totalVotes + 1 } };
    }));
  };

  const publishPost = ({ body, images, poll }) => {
    setPosts(ps => [{
      id: `p_${Date.now()}`,
      author: 'rep', timeAgo: 'just now',
      body, images, poll,
      reactions: { up: 0, down: 0, mine: null },
      comments: [],
    }, ...ps]);
  };

  const jumpToPost = (id) => {
    setOwnerView('feed');
    setHighlightId(id);
    setTimeout(() => {
      const el = document.getElementById(`post-${id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setHighlightId(null), 1400);
    }, 30);
  };

  const requireCitizen = () => setLoginOpen(true);

  // ── Render ───────────────────────────────────────────────────
  return (
    <div data-screen-label="01 PageView">
      <Navbar
        persona={persona}
        onLogin={() => persona === 'anonymous' ? setLoginOpen(true) : null}
        unreadCount={persona === 'citizen' ? 5 : persona === 'owner' ? 12 : 0}
        trackedCount={persona === 'citizen' ? 3 : 0}
      />

      <div className="cl-pageview">
        <PageHeader rep={SEED.rep} persona={persona} onPersonaChange={onPersonaChange}
          ownerView={ownerView} onOwnerView={setOwnerView} />

        {persona === 'owner' && ownerView === 'dashboard' ? (
          <Dashboard onJumpToPost={jumpToPost} />
        ) : (
          <>
            <ScopeFilter persona={persona} scope={scope} onChange={setScope} />

            <div className="cl-grid">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {persona === 'owner' && <PostComposer onPublish={publishPost} />}

                {persona === 'anonymous' && (
                  <div className="cl-card" style={{ background: 'var(--cl-warning-soft)', border: '1px solid var(--cl-warning-border)' }}>
                    <div style={{ fontSize: 'var(--cl-text-sm)', color: 'var(--cl-warning-deep)', lineHeight: 1.55 }}>
                      You're reading anonymously. <button className="cl-btn cl-btn--small" style={{ background: 'transparent', border: 'none', color: 'var(--cl-warning-deep)', textDecoration: 'underline', padding: 0 }} onClick={() => setLoginOpen(true)}>Sign in as a citizen</button> to like, comment, and vote.
                    </div>
                  </div>
                )}

                {posts.map(p => (
                  <PostCard key={p.id} post={p} persona={persona} citizenId={me.id}
                    onReact={reactToPost}
                    onComment={commentOnPost}
                    onCommentReact={reactToComment}
                    onDeleteComment={deleteComment}
                    onVote={voteOnPoll}
                    onCitizenLoginRequired={requireCitizen}
                    highlight={highlightId === p.id}
                  />
                ))}
              </div>

              <aside className="cl-side">
                <h3>Upcoming events</h3>
                {SEED.events.map(e => (
                  <div key={e.id} className="cl-event">
                    <div className="cl-event__date">{e.date}</div>
                    <div className="cl-event__title">{e.title}</div>
                    <div className="cl-event__where">{e.where}</div>
                  </div>
                ))}
                <div style={{ fontSize: 'var(--cl-text-xs)', color: 'var(--cl-text-light)', padding: '4px 2px', lineHeight: 1.5 }}>
                  Events are posted by the office; RSVPs aren't tracked yet.
                </div>
              </aside>
            </div>
          </>
        )}
      </div>

      <CitizenLoginModal open={loginOpen} onClose={() => setLoginOpen(false)}
        onSignIn={() => { setLoginOpen(false); setPersona('citizen'); }} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
