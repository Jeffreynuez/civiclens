/* PollsPage — the /polls feed.

   Props (all optional):
     hero:       'dark' | 'light'                                  (default: 'dark')
     state:      'loaded' | 'filtered' | 'empty' | 'empty-ai' | 'loading'  (default: 'loaded')
     signedIn:   bool                                              (default: true)
     initialBranch: 'all'|'bill'|'committee'|'executive'|'judicial'|'standalone'  (default: 'all')
     chipStyle:   'icons' | 'text'                                 (default: 'icons')
     showNavbar: bool                                              (default: true)
     navbarViewport: 'desktop' | 'tablet' | 'mobile'              (default: 'desktop')
*/

const BRANCH_FILTERS = [
  { id: 'all',        label: 'All polls',  icon: 'AllPolls',   tier: 'normal' },
  { id: 'bill',       label: 'Bill',       icon: 'Bill',       tier: 'normal' },
  { id: 'committee',  label: 'Committee',  icon: 'Committee',  tier: 'normal' },
  { id: 'executive',  label: 'Executive',  icon: 'Executive',  tier: 'normal' },
  { id: 'judicial',   label: 'Judicial',   icon: 'Judicial',   tier: 'normal' },
  { id: 'standalone', label: 'Standalone', icon: 'Standalone', tier: 'standalone' },
  // disabled — coming soon
  { id: 'candidate',  label: 'From candidates', icon: 'FromCandidates', tier: 'normal', disabled: true },
];

function PollsHero({ variant }) {
  return (
    <section className={`polls-hero ${variant === 'light' ? 'is-light' : ''}`} aria-label="Polls hero">
      <div className="polls-wrap">
        <div className="polls-hero__inner">
          <div>
            <div className="polls-hero__eyebrow">Civic polls · grassroots feed</div>
            <h1 className="polls-hero__title">Polls</h1>
            <p className="polls-hero__sub">
              Every active poll on CivicView — what reps are asking constituents, what
              citizens are asking each other and the officials who serve them, and
              standalone polls on civic topics that don&rsquo;t belong to any single page.
            </p>
          </div>
          <div className="polls-hero__stats">
            <div className="polls-hero__stat">
              <span className="polls-hero__stat-num cl-num">128</span>
              <span className="polls-hero__stat-label">Live polls</span>
            </div>
            <div className="polls-hero__stat">
              <span className="polls-hero__stat-num cl-num">1.2M</span>
              <span className="polls-hero__stat-label">Votes this week</span>
            </div>
            <div className="polls-hero__stat">
              <span className="polls-hero__stat-num cl-num">47</span>
              <span className="polls-hero__stat-label">States</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BranchChip({ filter, active, count, onClick, style }) {
  const G = window.PollsGlyph;
  const Icon = G[filter.icon];
  const tierClass = filter.tier === 'standalone' ? 'polls-chip--standalone' : '';
  const disabledClass = filter.disabled ? 'is-disabled' : '';
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
      <span>{filter.label}</span>
      {filter.disabled
        ? <span className="polls-chip__soon">Soon</span>
        : <span className="polls-chip__count cl-num">{count}</span>}
    </button>
  );
}

function AIFilterRow({ activeTags, onToggleTag, query, setQuery, onApply, onClear, hasActive }) {
  const G = window.PollsGlyph;
  return (
    <div className="polls-airow" role="group" aria-label="AI-powered filters">
      <div className="polls-airow__inner">
        <span className="polls-airow__label">
          <G.Sparkle size={13} /> AI tone filters
        </span>
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
            placeholder="Filter polls… (e.g. ‘about taxes’ or ‘from @Fred’)"
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

/* (a) Full empty — used when the kind/branch filter alone returns zero. */
function FullEmpty({ onClearFilters, onStartPoll, signedIn }) {
  const G = window.PollsGlyph;
  return (
    <div className="polls-empty">
      <div className="polls-empty__glyph"><G.Megaphone size={28} /></div>
      <div className="polls-empty__title">No polls match those filters yet.</div>
      <div className="polls-empty__body">
        Try clearing your filter set — or start a poll yourself. The feed is grassroots:
        what citizens ask here is what other citizens see next.
      </div>
      <div className="polls-empty__actions">
        <button className="polls-empty__btn polls-empty__btn--ghost" onClick={onClearFilters}>
          Clear filters
        </button>
        {signedIn ? (
          <button className="polls-empty__btn polls-empty__btn--primary" onClick={onStartPoll}>
            <G.Plus size={13} color="white" /> Start a poll
          </button>
        ) : (
          <button className="polls-empty__btn polls-empty__btn--ghost">
            <G.Lock size={12} /> Sign in to start a poll
          </button>
        )}
      </div>
    </div>
  );
}

/* (b) In-grid compact empty — used when AI filter returned zero results.
   The far more common production case. Echoes the filter back; pairs with
   "Clear filter" and "Start a poll matching this". */
function InlineEmpty({ query, tags, onClear, onStartMatching, signedIn }) {
  const G = window.PollsGlyph;
  const filterStr = query?.trim() || (tags && tags.length ? tags.map(t => `#${t}`).join(' + ') : '');
  return (
    <div className="polls-empty polls-empty--inline">
      <div className="polls-empty__glyph"><G.Sparkle size={20} /></div>
      <div className="polls-empty__body-wrap">
        <div className="polls-empty__title">Nothing matches your AI filter yet.</div>
        <div className="polls-empty__filter">
          Filtered for <strong>&ldquo;{filterStr}&rdquo;</strong> — no polls in the current
          feed match. Try a different angle, clear the filter, or start one yourself.
        </div>
      </div>
      <div className="polls-empty__actions">
        <button className="polls-empty__btn polls-empty__btn--ghost" onClick={onClear}>
          Clear filter
        </button>
        {signedIn ? (
          <button className="polls-empty__btn polls-empty__btn--primary" onClick={onStartMatching}>
            <G.Plus size={13} color="white" /> Start a poll matching this
          </button>
        ) : (
          <button className="polls-empty__btn polls-empty__btn--ghost">
            <G.Lock size={12} /> Sign in to start one
          </button>
        )}
      </div>
    </div>
  );
}

function PollSkeleton({ optCount = 3 }) {
  const widths = [78, 56, 42, 34, 28];
  return (
    <div className="poll-skel" aria-hidden="true">
      <div className="skel-row">
        <div className="skel-bar" style={{ width: 38, height: 16 }} />
        <div className="skel-bar" style={{ width: 68, height: 14 }} />
        <div className="skel-bar" style={{ width: 44, height: 12, marginLeft: 'auto' }} />
      </div>
      <div className="skel-row">
        <div className="skel-bar skel-circle" style={{ width: 36, height: 36 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div className="skel-bar" style={{ width: '60%', height: 12 }} />
          <div className="skel-bar" style={{ width: '40%', height: 10 }} />
        </div>
      </div>
      <div className="skel-bar" style={{ width: '92%', height: 14 }} />
      <div className="skel-bar" style={{ width: '74%', height: 14 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 2 }}>
        {Array.from({ length: optCount }).map((_, i) => (
          <div key={i} className="skel-opt" style={{ ['--w']: `${widths[i]}%` }} />
        ))}
      </div>
      <div className="skel-row" style={{ paddingTop: 10, borderTop: '1px solid var(--cl-divider)' }}>
        <div className="skel-bar" style={{ width: 110, height: 11 }} />
        <div className="skel-bar" style={{ width: 70, height: 11, marginLeft: 'auto' }} />
      </div>
    </div>
  );
}

function BottomStartCTA({ signedIn }) {
  const G = window.PollsGlyph;
  return (
    <div className="polls-bottom-cta">
      <div className="polls-bottom-cta__text">
        <span className="polls-bottom-cta__title">Don&rsquo;t see your question?</span>
        <span className="polls-bottom-cta__sub">
          Start a poll — verified citizens can ask the rest of CivicView directly from this page.
        </span>
      </div>
      {signedIn ? (
        <button className="polls-start-btn" type="button">
          <G.Plus size={14} color="white" />
          Start a poll
        </button>
      ) : (
        <button className="polls-start-btn is-muted" type="button">
          <G.Lock size={13} />
          Sign in to start a poll
        </button>
      )}
    </div>
  );
}

function PollsPage({
  hero = 'dark',
  state = 'loaded',
  signedIn = true,
  initialBranch = 'all',
  chipStyle = 'icons',
  showNavbar = true,
  navbarViewport = 'desktop',
}) {
  const G = window.PollsGlyph;
  const [branch, setBranch] = React.useState(initialBranch);
  const [aiTags, setAiTags] = React.useState(state === 'filtered' || state === 'empty-ai' ? ['critical'] : []);
  const [query, setQuery] = React.useState(
    state === 'filtered' ? 'about taxes' :
    state === 'empty-ai' ? 'about Mars colonization' :
    ''
  );
  const [applied, setApplied] = React.useState(state === 'filtered' || state === 'empty-ai');

  React.useEffect(() => {
    if (state === 'filtered') { setApplied(true); setQuery('about taxes'); setAiTags(['critical']); }
    else if (state === 'empty-ai') { setApplied(true); setQuery('about Mars colonization'); setAiTags(['funny']); }
    else if (state === 'empty') { setApplied(false); setQuery(''); setAiTags([]); setBranch('judicial'); }
    else { setApplied(false); setQuery(''); setAiTags([]); }
  }, [state]);

  const polls = window.POLLS_SEED;

  // Branch counts
  const branchCounts = React.useMemo(() => ({
    all:        polls.length,
    bill:       polls.filter(p => p.branch === 'bill').length,
    committee:  polls.filter(p => p.branch === 'committee').length,
    executive:  polls.filter(p => p.branch === 'executive').length,
    judicial:   polls.filter(p => p.branch === 'judicial').length,
    standalone: polls.filter(p => p.branch === 'standalone').length,
    candidate:  0,
  }), [polls]);

  // Filter pipeline
  const branchFiltered = React.useMemo(() => {
    if (branch === 'all') return polls;
    return polls.filter(p => p.branch === branch);
  }, [polls, branch]);

  const filtered = React.useMemo(() => {
    if (state === 'empty-ai') return [];          // force in-grid AI empty
    if (state === 'empty')    return [];          // force full empty
    let list = branchFiltered;
    if (applied && (aiTags.length > 0 || query.trim())) {
      list = list.filter(p => p.aiTags && p.aiTags.some(t => aiTags.includes(t)));
      // free-form query is mocked: we don't actually search, just keep list as-is.
    }
    return list;
  }, [branchFiltered, aiTags, applied, state, query]);

  const toggleTag = (tag) =>
    setAiTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const applyAI = () => setApplied(true);
  const clearAI = () => { setAiTags([]); setQuery(''); setApplied(false); };
  const clearAll = () => { clearAI(); setBranch('all'); };

  const aiActive = applied && (query.trim() || aiTags.length > 0);
  const showBanner = aiActive && filtered.length > 0;

  // Decide which empty state to show.
  // If branch filter alone produced no results AND no AI filter → full empty
  // If AI filter produced no results → in-grid empty (compact)
  const isFullEmpty   = state === 'empty'   || (filtered.length === 0 && !aiActive && state !== 'loading');
  const isInlineEmpty = state === 'empty-ai' || (filtered.length === 0 && aiActive && state !== 'loading');

  return (
    <div className="polls-page">
      {showNavbar && (
        <window.PollsNavbar
          signedIn={signedIn}
          viewport={navbarViewport}
        />
      )}

      <PollsHero variant={hero} />

      <div className="polls-filters">
        <div className="polls-wrap">
          <div className="polls-filters__inner">
            <div className="polls-kindrow">
              <div className="polls-kindrow__chips">
                {BRANCH_FILTERS.map(f => (
                  <BranchChip
                    key={f.id}
                    filter={f}
                    active={branch === f.id}
                    count={branchCounts[f.id]}
                    onClick={() => setBranch(f.id)}
                    style={chipStyle}
                  />
                ))}
              </div>
              <div className="polls-kindrow__cta">
                {signedIn ? (
                  <button className="polls-start-btn" type="button">
                    <G.Plus size={14} color="white" />
                    Start a poll
                  </button>
                ) : (
                  <button className="polls-start-btn is-muted" type="button">
                    <G.Lock size={13} />
                    Sign in to start a poll
                  </button>
                )}
              </div>
            </div>

            <AIFilterRow
              activeTags={aiTags}
              onToggleTag={toggleTag}
              query={query}
              setQuery={setQuery}
              onApply={applyAI}
              onClear={clearAI}
              hasActive={showBanner}
            />
          </div>
        </div>
      </div>

      <div className="polls-wrap">
        {showBanner && (
          <ActiveFilterBanner
            query={query || aiTags.map(t => `#${t}`).join(' + ')}
            shown={filtered.length}
            total={polls.length}
            onClear={clearAI}
          />
        )}

        <div className="polls-grid">
          {state === 'loading' && (
            <>
              <PollSkeleton optCount={3} />
              <PollSkeleton optCount={4} />
              <PollSkeleton optCount={3} />
              <PollSkeleton optCount={2} />
              <PollSkeleton optCount={4} />
              <PollSkeleton optCount={3} />
            </>
          )}

          {state !== 'loading' && isFullEmpty && (
            <FullEmpty
              onClearFilters={clearAll}
              signedIn={signedIn}
              onStartPoll={() => {}}
            />
          )}

          {state !== 'loading' && isInlineEmpty && !isFullEmpty && (
            <InlineEmpty
              query={query}
              tags={aiTags}
              onClear={clearAI}
              onStartMatching={() => {}}
              signedIn={signedIn}
            />
          )}

          {state !== 'loading' && !isFullEmpty && !isInlineEmpty && filtered.map(p => (
            <PollCard key={p.id} poll={p} />
          ))}
        </div>

        {state !== 'loading' && !isFullEmpty && (
          <BottomStartCTA signedIn={signedIn} />
        )}
      </div>

      {/* Mobile-only sticky FAB. CSS shows it only at ≤600px. */}
      {signedIn ? (
        <button className="polls-fab" type="button">
          <G.Plus size={14} color="white" />
          Start a poll
        </button>
      ) : (
        <button className="polls-fab is-muted" type="button">
          <G.Lock size={13} />
          Sign in to start
        </button>
      )}
    </div>
  );
}

window.PollsPage = PollsPage;
