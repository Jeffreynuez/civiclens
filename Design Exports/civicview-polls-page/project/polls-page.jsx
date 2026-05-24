/* GrassrootsFeed — the unified /polls + /posts page.

   Tabs:
     - 'polls' (default) — POLLS_SEED + standalone delete X
     - 'posts'           — POSTS_SEED, sorted by engagement
   Filter pipeline:
     - Branch chips (multi-select; "All" deactivates the rest)
     - States chip (single state, via StateDropdown)
     - AI tone chips + free-form query

   The page handles ALL the state permutations the canvas needs to render,
   so individual artboards just pass props. See the `prefill` prop for
   forcing a specific demo state (multi-active, comment-open, delete-X, etc).
*/

const BRANCH_FILTERS_POLLS = [
  { id: 'all',        label: 'All polls',  icon: 'AllPolls',   tier: 'normal' },
  { id: 'states',     label: 'States',     icon: 'States',     tier: 'normal', hasDropdown: true },
  { id: 'congress',   label: 'Congress',   icon: 'Congress',   tier: 'normal' },
  { id: 'executive',  label: 'Executive',  icon: 'Executive',  tier: 'normal' },
  { id: 'judicial',   label: 'Judicial',   icon: 'Judicial',   tier: 'normal' },
  { id: 'standalone', label: 'Standalone', icon: 'Standalone', tier: 'standalone' },
  { id: 'candidate',  label: 'From candidates', icon: 'FromCandidates', tier: 'normal', disabled: true },
];
const BRANCH_FILTERS_POSTS = [
  { id: 'all',        label: 'All posts',  icon: 'AllPolls',   tier: 'normal' },
  { id: 'states',     label: 'States',     icon: 'States',     tier: 'normal', hasDropdown: true },
  { id: 'congress',   label: 'Congress',   icon: 'Congress',   tier: 'normal' },
  { id: 'executive',  label: 'Executive',  icon: 'Executive',  tier: 'normal' },
  { id: 'judicial',   label: 'Judicial',   icon: 'Judicial',   tier: 'normal' },
  { id: 'candidate',  label: 'From candidates', icon: 'FromCandidates', tier: 'normal', disabled: true },
];

function Hero({ variant, tab }) {
  const polls = {
    eyebrow: 'Civic polls · grassroots feed',
    title: 'Polls',
    sub: 'Every active poll on CivicView — what reps are asking constituents, what citizens are asking each other and the officials who serve them, and standalone polls on civic topics that don\u2019t belong to any single page.',
    stats: [
      { num: '128', label: 'Live polls' },
      { num: '1.2M', label: 'Votes this week' },
      { num: '47', label: 'States' },
    ],
  };
  const posts = {
    eyebrow: 'Verified updates · grassroots feed',
    title: 'Posts',
    sub: 'Every post from verified reps and candidates — what they\u2019re saying, what they\u2019re passing, what they\u2019re running on. One feed across every page, sorted by what citizens are engaging with most.',
    stats: [
      { num: '4,820', label: 'Total posts' },
      { num: '312', label: 'Posts this week' },
      { num: '186', label: 'Reps + candidates active' },
    ],
  };
  const h = tab === 'posts' ? posts : polls;

  return (
    <section className={`polls-hero ${variant === 'light' ? 'is-light' : ''}`}>
      <div className="polls-wrap">
        <div className="polls-hero__inner">
          <div>
            <div className="polls-hero__eyebrow">{h.eyebrow}</div>
            <h1 className="polls-hero__title">{h.title}</h1>
            <p className="polls-hero__sub">{h.sub}</p>
          </div>
          <div className="polls-hero__stats">
            {h.stats.map((s, i) => (
              <div key={i} className="polls-hero__stat">
                <span className="polls-hero__stat-num cl-num">{s.num}</span>
                <span className="polls-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BranchChip({ filter, active, count, onClick, style, selectedState }) {
  const G = window.PollsGlyph;
  const Icon = G[filter.icon];
  const tierClass = filter.tier === 'standalone' ? 'polls-chip--standalone' : '';
  const disabledClass = filter.disabled ? 'is-disabled' : '';
  const label = filter.id === 'states' && selectedState
    ? <span>States <span className="polls-chip__state-suffix cl-num">· {selectedState}</span></span>
    : filter.label;
  return (
    <button
      type="button"
      className={`polls-chip ${tierClass} ${active ? 'is-active' : ''} ${disabledClass}`}
      onClick={filter.disabled ? undefined : onClick}
      aria-pressed={active}
      aria-disabled={filter.disabled || undefined}
      title={filter.disabled ? 'Available when candidates launch' : undefined}>
      {style === 'icons' && Icon && (
        <span className="polls-chip__glyph"><Icon size={15} /></span>
      )}
      {typeof label === 'string' ? <span>{label}</span> : label}
      {filter.hasDropdown && <G.Chevron size={10} color="currentColor" dir="down" />}
      {filter.disabled
        ? <span className="polls-chip__soon">Soon</span>
        : <span className="polls-chip__count cl-num">{count}</span>}
    </button>
  );
}

function AIFilterRow({ activeTags, onToggleTag, query, setQuery, onApply }) {
  const G = window.PollsGlyph;
  return (
    <div className="polls-airow">
      <div className="polls-airow__inner">
        <span className="polls-airow__label"><G.Sparkle size={13} /> AI tone filters</span>
        <div className="polls-airow__chips">
          {window.AI_FILTER_TAGS.map(t => (
            <button
              key={t.id}
              type="button"
              className={`polls-aichip ${activeTags.includes(t.id) ? 'is-active' : ''}`}
              onClick={() => onToggleTag(t.id)}
              aria-pressed={activeTags.includes(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <label className="polls-airow__field">
          <span className="polls-airow__sparkle"><G.Sparkle size={14} /></span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter polls… (e.g. 'about taxes' or 'from @Fred')"
            onKeyDown={(e) => { if (e.key === 'Enter') onApply(); }}
          />
          <button
            type="button"
            className="polls-airow__apply"
            onClick={onApply}
            disabled={!query.trim() && activeTags.length === 0}>
            Apply
          </button>
        </label>
      </div>
    </div>
  );
}

function ActiveFilterBanner({ query, shown, total, onClear }) {
  const G = window.PollsGlyph;
  return (
    <div className="polls-active-banner" role="status">
      <span className="polls-active-banner__sparkle"><G.Sparkle size={14} /></span>
      <span className="polls-active-banner__text">
        AI-filtered for: <strong>&ldquo;{query}&rdquo;</strong>{' '}
        <span className="polls-active-banner__count">— showing {shown} of {total}</span>
      </span>
      <button type="button" className="polls-active-banner__clear" onClick={onClear}>
        Clear <G.Close size={11} />
      </button>
    </div>
  );
}

function FullEmpty({ tab, onClearFilters, signedIn, canPost }) {
  const G = window.PollsGlyph;
  const what = tab === 'posts' ? 'posts' : 'polls';
  return (
    <div className="polls-empty">
      <div className="polls-empty__glyph"><G.Megaphone size={28} /></div>
      <div className="polls-empty__title">No {what} match those filters yet.</div>
      <div className="polls-empty__body">
        Try clearing your filter set
        {tab === 'polls' ? ' — or start a poll yourself. The feed is grassroots: what citizens ask here is what other citizens see next.' : '. Posts come from verified reps and candidates only.'}
      </div>
      <div className="polls-empty__actions">
        <button className="polls-empty__btn polls-empty__btn--ghost" onClick={onClearFilters}>
          Clear filters
        </button>
        {tab === 'polls' && signedIn && (
          <button className="polls-empty__btn polls-empty__btn--primary">
            <G.Plus size={13} color="white" /> Start a poll
          </button>
        )}
        {tab === 'posts' && canPost && (
          <button className="polls-empty__btn polls-empty__btn--primary">
            <G.Plus size={13} color="white" /> Start a post
          </button>
        )}
      </div>
    </div>
  );
}

function InlineEmpty({ tab, query, tags, onClear, signedIn, canPost }) {
  const G = window.PollsGlyph;
  const filterStr = query?.trim() || (tags && tags.length ? tags.map(t => `#${t}`).join(' + ') : '');
  return (
    <div className="polls-empty polls-empty--inline">
      <div className="polls-empty__glyph"><G.Sparkle size={20} /></div>
      <div className="polls-empty__body-wrap">
        <div className="polls-empty__title">Nothing matches your AI filter yet.</div>
        <div className="polls-empty__filter">
          Filtered for <strong>&ldquo;{filterStr}&rdquo;</strong> — no {tab === 'posts' ? 'posts' : 'polls'} in the current
          feed match. Try a different angle, or clear the filter.
        </div>
      </div>
      <div className="polls-empty__actions">
        <button className="polls-empty__btn polls-empty__btn--ghost" onClick={onClear}>
          Clear filter
        </button>
        {tab === 'polls' && signedIn && (
          <button className="polls-empty__btn polls-empty__btn--primary">
            <G.Plus size={13} color="white" /> Start a poll matching this
          </button>
        )}
      </div>
    </div>
  );
}

function PollSkeleton() {
  return (
    <div className="poll-skel" aria-hidden="true">
      <div className="skel-row">
        <div className="skel-bar" style={{ width: 42, height: 16 }} />
        <div className="skel-bar" style={{ width: 80, height: 14 }} />
        <div className="skel-bar" style={{ width: 44, height: 12, marginLeft: 'auto' }} />
      </div>
      <div className="skel-row">
        <div className="skel-bar skel-circle" style={{ width: 44, height: 44 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div className="skel-bar" style={{ width: '60%', height: 14 }} />
          <div className="skel-bar" style={{ width: '40%', height: 11 }} />
        </div>
      </div>
      <div className="skel-bar" style={{ width: '92%', height: 14 }} />
      <div className="skel-bar" style={{ width: '78%', height: 14 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 4 }}>
        <div className="skel-opt" style={{ ['--w']: '74%' }} />
        <div className="skel-opt" style={{ ['--w']: '50%' }} />
        <div className="skel-opt" style={{ ['--w']: '28%' }} />
      </div>
      <div className="skel-row" style={{ paddingTop: 10, borderTop: '1px solid var(--cl-divider)' }}>
        <div className="skel-bar" style={{ width: 56, height: 26, borderRadius: 999 }} />
        <div className="skel-bar" style={{ width: 56, height: 26, borderRadius: 999 }} />
        <div className="skel-bar" style={{ width: 120, height: 26, borderRadius: 999, marginLeft: 'auto' }} />
      </div>
    </div>
  );
}

function BottomStartCTA({ tab, signedIn, canPost }) {
  const G = window.PollsGlyph;
  const isPosts = tab === 'posts';
  if (isPosts && !canPost) return null; // Posts CTA only when allowed
  const muted = isPosts ? !canPost : !signedIn;
  return (
    <div className="polls-bottom-cta">
      <div className="polls-bottom-cta__text">
        <span className="polls-bottom-cta__title">Don&rsquo;t see your question?</span>
        <span className="polls-bottom-cta__sub">
          {isPosts
            ? 'Post an update — your followers see it on their next visit, and it lands in this feed too.'
            : 'Start a poll — verified citizens can ask the rest of CivicView directly from this page.'}
        </span>
      </div>
      <button className={`polls-start-btn ${muted ? 'is-muted' : ''}`} type="button">
        {muted ? <G.Lock size={13} /> : <G.Plus size={14} color="white" />}
        {isPosts
          ? (canPost ? 'Start a post' : 'Sign in as rep to post')
          : (signedIn ? 'Start a poll' : 'Sign in to start a poll')}
      </button>
    </div>
  );
}

function GrassrootsFeed({
  tab = 'polls',                  // 'polls' | 'posts'
  state = 'loaded',               // 'loaded' | 'filtered' | 'empty' | 'empty-ai' | 'loading'
  signedIn = true,
  canPost = false,                // signed-in rep or candidate
  hero = 'dark',
  prefill = {},                   // { branches, selectedState, statesOpen, openCommentId, deleteModalFor }
  onTabChange,
}) {
  const G = window.PollsGlyph;
  const [internalTab, setInternalTab] = React.useState(tab);
  const activeTab = onTabChange ? tab : internalTab;
  const setTab = (t) => { onTabChange ? onTabChange(t) : setInternalTab(t); };

  const [branches, setBranches] = React.useState(prefill.branches || ['all']);
  const [selectedState, setSelectedState] = React.useState(prefill.selectedState || null);
  const [statesOpen, setStatesOpen] = React.useState(!!prefill.statesOpen);
  const [aiTags, setAiTags] = React.useState(state === 'filtered' || state === 'empty-ai' ? ['critical'] : []);
  const [query, setQuery] = React.useState(
    state === 'filtered' ? 'about taxes' :
    state === 'empty-ai' ? 'about Mars colonization' : ''
  );
  const [applied, setApplied] = React.useState(state === 'filtered' || state === 'empty-ai');
  const [openCommentId, setOpenCommentId] = React.useState(prefill.openCommentId || null);
  const [deleteModalFor, setDeleteModalFor] = React.useState(prefill.deleteModalFor || null);

  // Re-sync when prefill or state changes
  React.useEffect(() => { setBranches(prefill.branches || ['all']); }, [JSON.stringify(prefill.branches)]);
  React.useEffect(() => { setSelectedState(prefill.selectedState || null); }, [prefill.selectedState]);
  React.useEffect(() => { setStatesOpen(!!prefill.statesOpen); }, [prefill.statesOpen]);
  React.useEffect(() => { setOpenCommentId(prefill.openCommentId || null); }, [prefill.openCommentId]);
  React.useEffect(() => { setDeleteModalFor(prefill.deleteModalFor || null); }, [prefill.deleteModalFor]);

  const allCards = activeTab === 'posts' ? window.POSTS_SEED : window.POLLS_SEED;

  // Branch counts (always against full set)
  const counts = React.useMemo(() => {
    const filters = activeTab === 'posts' ? BRANCH_FILTERS_POSTS : BRANCH_FILTERS_POLLS;
    const c = { all: allCards.length };
    filters.forEach(f => {
      if (f.id === 'all') return;
      if (f.id === 'states') {
        c[f.id] = selectedState ? allCards.filter(p => p.state === selectedState).length : allCards.length;
      } else if (f.id === 'candidate') {
        c[f.id] = allCards.filter(p => p.kind === 'candidate').length;
      } else {
        c[f.id] = allCards.filter(p => p.branch === f.id).length;
      }
    });
    return c;
  }, [allCards, selectedState, activeTab]);

  const filterList = activeTab === 'posts' ? BRANCH_FILTERS_POSTS : BRANCH_FILTERS_POLLS;

  // Filter pipeline
  const filtered = React.useMemo(() => {
    if (state === 'empty') return [];
    if (state === 'empty-ai') return [];
    let list = allCards;
    if (!branches.includes('all') && branches.length > 0) {
      list = list.filter(p => {
        return branches.some(b => {
          if (b === 'standalone') return p.kind === 'standalone';
          return p.branch === b;
        });
      });
    }
    if (selectedState) {
      list = list.filter(p => p.state === selectedState);
    }
    if (applied && aiTags.length > 0) {
      list = list.filter(p => p.aiTags && p.aiTags.some(t => aiTags.includes(t)));
    }
    return list;
  }, [allCards, branches, selectedState, aiTags, applied, state]);

  const toggleBranch = (id) => {
    if (id === 'all') { setBranches(['all']); return; }
    setBranches(prev => {
      const next = prev.filter(b => b !== 'all');
      if (next.includes(id)) {
        const after = next.filter(b => b !== id);
        return after.length === 0 ? ['all'] : after;
      }
      return [...next, id];
    });
  };
  const toggleStatesDropdown = () => setStatesOpen(v => !v);
  const pickState = (abbr) => {
    setSelectedState(abbr);
    if (abbr) toggleBranch('states');
  };

  const toggleAiTag = (id) =>
    setAiTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  const applyAI = () => setApplied(true);
  const clearAI = () => { setAiTags([]); setQuery(''); setApplied(false); };
  const clearAll = () => { clearAI(); setBranches(['all']); setSelectedState(null); };

  const aiActive = applied && (query.trim() || aiTags.length > 0);
  const showBanner = aiActive && filtered.length > 0;
  const isFullEmpty = state === 'empty' || (filtered.length === 0 && !aiActive && state !== 'loading');
  const isInlineEmpty = state === 'empty-ai' || (filtered.length === 0 && aiActive && state !== 'loading');

  const isAuthorOf = (card) => card.author && card.author.isMe;

  return (
    <div className="polls-page">
      <window.PollsNavbar signedIn={signedIn} identityCount={2} />

      <Hero variant={hero} tab={activeTab} />

      {/* TabStrip — between hero and chip row */}
      <div className="tabstrip-wrap">
        <div className="polls-wrap">
          <window.TabStrip active={activeTab} onChange={setTab} />
        </div>
      </div>

      {/* Everything below the tabs slide-fades on tab switch.
          Hero is intentionally OUTSIDE — its copy + stats swap in place,
          but the navy block itself never slides. */}
      <window.TabContent tabKey={activeTab}>

      <div className="polls-filters">
        <div className="polls-wrap">
          <div className="polls-filters__inner">
            <div className="polls-kindrow">
              <div className="polls-kindrow__chips">
                {filterList.map(f => (
                  <div key={f.id} className="polls-chip-wrap">
                    <BranchChip
                      filter={f}
                      active={branches.includes(f.id) || (f.id === 'states' && !!selectedState)}
                      count={counts[f.id]}
                      onClick={f.id === 'states' ? toggleStatesDropdown : () => toggleBranch(f.id)}
                      style="icons"
                      selectedState={f.id === 'states' ? selectedState : null}
                    />
                    {f.id === 'states' && statesOpen && (
                      <window.StateDropdown
                        selected={selectedState}
                        onSelect={pickState}
                        onClose={() => setStatesOpen(false)}
                        initialScroll={prefill.statesScrollOffset || 0}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="polls-kindrow__cta">
                {activeTab === 'polls' && (
                  signedIn ? (
                    <button className="polls-start-btn"><G.Plus size={14} color="white" /> Start a poll</button>
                  ) : (
                    <button className="polls-start-btn is-muted"><G.Lock size={13} /> Sign in to start a poll</button>
                  )
                )}
                {activeTab === 'posts' && canPost && (
                  <button className="polls-start-btn"><G.Plus size={14} color="white" /> Start a post</button>
                )}
              </div>
            </div>

            <AIFilterRow
              activeTags={aiTags}
              onToggleTag={toggleAiTag}
              query={query}
              setQuery={setQuery}
              onApply={applyAI}
            />
          </div>
        </div>
      </div>

      <div className="polls-wrap">
        {showBanner && (
          <ActiveFilterBanner
            query={query || aiTags.map(t => `#${t}`).join(' + ')}
            shown={filtered.length}
            total={allCards.length}
            onClear={clearAI}
          />
        )}

        <div className="polls-grid">
          {state === 'loading' && Array.from({ length: 6 }).map((_, i) => <PollSkeleton key={i} />)}

          {state !== 'loading' && isFullEmpty && (
            <FullEmpty tab={activeTab} onClearFilters={clearAll} signedIn={signedIn} canPost={canPost} />
          )}

          {state !== 'loading' && isInlineEmpty && !isFullEmpty && (
            <InlineEmpty
              tab={activeTab}
              query={query}
              tags={aiTags}
              onClear={clearAI}
              signedIn={signedIn}
              canPost={canPost}
            />
          )}

          {state !== 'loading' && !isFullEmpty && !isInlineEmpty && filtered.map(card => (
            <window.FeedCard
              key={card.id}
              card={card}
              kind={activeTab === 'posts' ? 'post' : 'poll'}
              isAuthor={isAuthorOf(card)}
              isCommentsOpen={openCommentId === card.id}
              onToggleComments={() => setOpenCommentId(prev => prev === card.id ? null : card.id)}
              onDelete={() => setDeleteModalFor(card.id)}
            />
          ))}
        </div>

        {state !== 'loading' && !isFullEmpty && (
          <BottomStartCTA tab={activeTab} signedIn={signedIn} canPost={canPost} />
        )}
      </div>

      </window.TabContent>

      {/* Mobile sticky FAB */}
      {activeTab === 'polls' && (
        signedIn ? (
          <button className="polls-fab"><G.Plus size={14} color="white" /> Start a poll</button>
        ) : (
          <button className="polls-fab is-muted"><G.Lock size={13} /> Sign in to start</button>
        )
      )}
      {activeTab === 'posts' && canPost && (
        <button className="polls-fab"><G.Plus size={14} color="white" /> Start a post</button>
      )}

      {/* Delete-confirmation modal */}
      {deleteModalFor && (
        <DeleteConfirmModal
          onConfirm={() => setDeleteModalFor(null)}
          onCancel={() => setDeleteModalFor(null)}
        />
      )}
    </div>
  );
}

function DeleteConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="cv-modal-bg" role="dialog" aria-modal="true">
      <div className="cv-modal">
        <h2>Close this poll?</h2>
        <p className="cv-modal__body">
          It moves to the archived section of your dashboard and frees your standalone-poll
          slot so you can post another. Votes already cast are preserved in the archive.
        </p>
        <div className="cv-modal__actions">
          <button className="cv-modal__btn cv-modal__btn--ghost" onClick={onCancel}>Keep open</button>
          <button className="cv-modal__btn cv-modal__btn--danger" onClick={onConfirm}>Close poll</button>
        </div>
      </div>
    </div>
  );
}

window.GrassrootsFeed = GrassrootsFeed;
/* Back-compat alias so existing artboards keep working while we migrate. */
window.PollsPage = GrassrootsFeed;
