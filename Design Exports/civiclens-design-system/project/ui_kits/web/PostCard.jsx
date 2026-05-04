/* PostCard — header + body + image gallery + poll + reactions + comments.
   Updated per review: arrow reactions (▲/▼) replaced with Phosphor Duotone
   thumbs-up / thumbs-down glyphs. UP token = #1877F2 (blue), DOWN token =
   #8C2929 (burgundy) — disagreement, NOT destruction. Comment + vote
   emoji also swapped for proper duotone chat / ballot glyphs. */

const RxGlyph = {
  ThumbsUp: ({ size = 14, active }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M3 11h3.5v9H3z" fill={active ? '#1877F2' : 'currentColor'} opacity={active ? 1 : 0.28}
            stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6.5 11 L10 4.5 a2 2 0 0 1 3.5 1.4 V10 h5.4 a2 2 0 0 1 2 2.4 l-1.4 6.6 a2 2 0 0 1-2 1.6 H6.5 z"
            fill={active ? '#1877F2' : 'currentColor'} opacity={active ? 0.28 : 0}
            stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  ThumbsDown: ({ size = 14, active }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M3 4h3.5v9H3z" fill={active ? '#8C2929' : 'currentColor'} opacity={active ? 1 : 0.28}
            stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6.5 13 L10 19.5 a2 2 0 0 0 3.5-1.4 V14 h5.4 a2 2 0 0 0 2-2.4 l-1.4-6.6 a2 2 0 0 0-2-1.6 H6.5 z"
            fill={active ? '#8C2929' : 'currentColor'} opacity={active ? 0.28 : 0}
            stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  Chat: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-4 3v-3H6a2 2 0 0 1-2-2z"
            fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  Ballot: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      <rect x="3" y="6" width="18" height="14" rx="2"
            fill="currentColor" opacity="0.28" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 11 l3 3 l5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M3 6 L7 3 H17 L21 6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
    </svg>
  ),
};

function PostImageGallery({ count }) {
  if (!count) return null;
  const variant = count === 1 ? 1 : count === 2 ? 2 : count === 3 ? 3 : 4;
  // procedural pleasant gradients so we don't ship demo photos
  const tile = i => ({
    background: `linear-gradient(${135 + i * 30}deg, hsl(${(i * 47 + 200) % 360}, 32%, 78%), hsl(${(i * 47 + 220) % 360}, 38%, 64%))`,
  });
  return (
    <div className={`cl-gallery cl-gallery--${variant}`}>
      {Array.from({ length: Math.min(count, 4) }).map((_, i) => (
        <div key={i} className="cl-gallery__img" style={tile(i)} />
      ))}
    </div>
  );
}

function CommentRow({ c, persona, onReact, onDelete, isOwnerPage, citizenId }) {
  const canDelete = isOwnerPage || (persona === 'citizen' && citizenId === c.author.id);
  return (
    <div className="cl-comment">
      <div className="cl-avatar cl-avatar--sm">{c.author.initials}</div>
      <div style={{ flex: 1 }}>
        <div className="cl-comment__row">
          <span className="cl-comment__name">{c.author.name}</span>
          <span className="cl-vchip">UNVERIFIED</span>
          <span className="cl-comment__meta">· {c.author.district} · {c.timeAgo}</span>
          {canDelete && (
            <button className="cl-btn cl-btn--ghost cl-btn--small" style={{ marginLeft: 'auto', padding: '2px 8px' }} onClick={() => onDelete && onDelete(c.id)}>Delete</button>
          )}
        </div>
        <div className="cl-comment__body">{c.body}</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          <button className={`cl-rxbtn up ${c.myReaction === 'up' ? 'active' : ''}`} onClick={() => onReact(c.id, 'up')}><RxGlyph.ThumbsUp size={12} active={c.myReaction === 'up'} /> {c.up}</button>
          <button className={`cl-rxbtn down ${c.myReaction === 'down' ? 'active' : ''}`} onClick={() => onReact(c.id, 'down')}><RxGlyph.ThumbsDown size={12} active={c.myReaction === 'down'} /> {c.down}</button>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, persona, citizenId, onReact, onComment, onCommentReact, onDeleteComment, onVote, onCitizenLoginRequired, highlight }) {
  const [draft, setDraft] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const requireCitizen = (fn) => () => {
    if (persona === 'anonymous') { onCitizenLoginRequired(); return; }
    fn();
  };

  const submitComment = () => {
    if (!draft.trim()) return;
    onComment(post.id, draft.trim());
    setDraft('');
  };

  return (
    <article id={`post-${post.id}`} className={`cl-card ${highlight ? 'highlight' : ''}`}>
      <div className="cl-post__hdr">
        <div className="cl-avatar cl-avatar--rep">{SEED.rep.initials}</div>
        <div>
          <div className="cl-post__name">{SEED.rep.name} <span className="cl-pchip cl-pchip--r" style={{ marginLeft: 4 }}>R</span></div>
          <div className="cl-post__meta">{SEED.rep.role} · {post.timeAgo}</div>
        </div>
        <span className="cl-spacer" />
        {persona === 'owner' && (
          <button className="cl-btn cl-btn--ghost cl-btn--small">⋯</button>
        )}
      </div>

      <div className="cl-post__body">{post.body}</div>

      <PostImageGallery count={post.images} />

      {post.poll && (
        <PollCard poll={post.poll} persona={persona} onVote={(optId) => {
          if (persona === 'anonymous') { onCitizenLoginRequired(); return; }
          onVote(post.id, optId);
        }} />
      )}

      <div className="cl-reactions">
        <button
          className={`cl-rxbtn up ${post.reactions.mine === 'up' ? 'active' : ''}`}
          onClick={requireCitizen(() => onReact(post.id, 'up'))}><RxGlyph.ThumbsUp size={14} active={post.reactions.mine === 'up'} /> <span className="cl-num">{post.reactions.up}</span></button>
        <button
          className={`cl-rxbtn down ${post.reactions.mine === 'down' ? 'active' : ''}`}
          onClick={requireCitizen(() => onReact(post.id, 'down'))}><RxGlyph.ThumbsDown size={14} active={post.reactions.mine === 'down'} /> <span className="cl-num">{post.reactions.down}</span></button>
        <button className="cl-comment-pill" onClick={() => setOpen(o => !o)}><RxGlyph.Chat size={14} /> <span className="cl-num">{post.comments.length}</span> {post.comments.length === 1 ? 'comment' : 'comments'}</button>
        {post.poll && <span className="cl-comment-pill" style={{ marginLeft: 'auto' }}><RxGlyph.Ballot size={14} /> <span className="cl-num">{post.poll.totalVotes.toLocaleString()}</span> votes</span>}
      </div>

      {open && (
        <div className="cl-comments">
          {persona !== 'owner' && (
            <div className="cl-cmt-form cl-cmt-form--top">
              <input
                placeholder={persona === 'anonymous' ? 'Sign in as a citizen to comment…' : 'Write a comment…'}
                value={draft}
                onFocus={() => persona === 'anonymous' && onCitizenLoginRequired()}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submitComment()}
                disabled={persona === 'anonymous'}
              />
              <button className="cl-btn cl-btn--primary cl-btn--small" onClick={submitComment} disabled={!draft.trim() || persona === 'anonymous'}>Post</button>
            </div>
          )}

          {post.comments.length === 0 ? (
            <div style={{ fontSize: 'var(--cl-text-sm)', color: 'var(--cl-text-light)', textAlign: 'center', padding: '14px 0' }}>
              No comments yet{persona !== 'owner' ? ' — be the first' : ''}.
            </div>
          ) : post.comments.map(c => (
            <CommentRow
              key={c.id} c={c} persona={persona} citizenId={citizenId}
              isOwnerPage={persona === 'owner'}
              onReact={(cid, kind) => {
                if (persona === 'anonymous') { onCitizenLoginRequired(); return; }
                onCommentReact(post.id, cid, kind);
              }}
              onDelete={(cid) => onDeleteComment(post.id, cid)}
            />
          ))}
        </div>
      )}
    </article>
  );
}

window.PostCard = PostCard;
