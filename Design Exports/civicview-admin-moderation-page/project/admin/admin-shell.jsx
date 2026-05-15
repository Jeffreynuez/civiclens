// Admin shell: Navbar, PageHeaderBand, KPIStrip, FilterRow, SubNav, ErrorBanner.

function AdNavbar({ variant = 'desktop' }) {
  const isMobile = variant === 'mobile';
  return (
    <header className="ad-nav">
      {/* Left: US flag + wordmark */}
      <div className="ad-nav__logo">
        <AdGlyph.Logo size={28} />
        <span>CivicView</span>
      </div>

      <div className="ad-nav__spacer" />

      {/* Right cluster — order matches live /polls navbar:
          identity → Sign out → Subscribe → Polls → My Tracked → bell → hamburger */}
      <div className="ad-nav__identity">
        <span className="ad-nav__identity-badge">
          <AdGlyph.Person size={13} /> CivicView Admin
        </span>
      </div>
      {!isMobile && <button className="ad-nav__signout-text">Sign out</button>}

      {!isMobile && (
        <>
          <button className="ad-nav__pill ad-nav__pill--subscribe">Subscribe</button>
          <button className="ad-nav__btn">
            <AdGlyph.Polls size={14} />
            <span>Polls</span>
          </button>
          <button className="ad-nav__btn">
            <AdGlyph.Bookmark size={13} />
            <span>My Tracked</span>
            <span className="ad-nav__count">7</span>
          </button>
          <button className="ad-nav__bell" aria-label="Notifications, 3 unread">
            <AdGlyph.Bell size={16} />
            <span className="ad-nav__dot">3</span>
          </button>
        </>
      )}

      <button className="ad-nav__hamburger" aria-label="Menu">
        <AdGlyph.Menu size={16} />
      </button>
    </header>
  );
}

function AdSubNav({ active = 'queue', variant = 'desktop' }) {
  const items = [
    { id: 'queue', label: 'Queue' },
    { id: 'appeals', label: 'Appeals', badge: 3 },
    { id: 'suspended', label: 'Suspended users', badge: 2 },
  ];
  const isMobile = variant === 'mobile';

  return (
    <div className={`ad-subnav-row ${isMobile ? 'ad-subnav-row--mobile' : ''}`}>
      <nav className={`ad-subnav ${isMobile ? 'ad-subnav--scroll' : ''}`} aria-label="Admin sections">
        {items.map((it) => (
          <button
            key={it.id}
            className={`ad-subnav__item ${active === it.id ? 'ad-subnav__item--active' : ''}`}
          >
            {it.label}
            {it.badge ? <span className="ad-subnav__badge">{it.badge}</span> : null}
          </button>
        ))}
      </nav>
      <a className="ad-subnav__home" href="#">
        <span aria-hidden="true">←</span> CivicView home
      </a>
    </div>
  );
}

function AdPageHead({ kpis, variant = 'desktop' }) {
  const isMobile = variant === 'mobile';
  return (
    <div className="ad-pagehead">
      <div className="ad-pagehead__top">
        <div className="ad-pagehead__crumb">Admin · Moderation</div>
        <h1 className="ad-pagehead__title">Moderation queue</h1>
        <div className="ad-pagehead__subline">
          Signed in as <span className="ad-pagehead__subline-mono">jeff@example.com</span> · citizen account on ADMIN_EMAILS allowlist
        </div>
      </div>

      <AdSubNav active="queue" variant={variant} />

      <div className={`ad-kpis ${isMobile ? 'ad-kpis--mobile' : ''}`}>
        <div className={`ad-kpi ${isMobile ? 'ad-kpi--mobile' : ''}`}>
          <div className="ad-kpi__label"><span className="ad-kpi__dot"></span>Open reports</div>
          <div className="ad-kpi__num">{kpis.open}</div>
          <div className="ad-kpi__delta ad-kpi__delta--up">▲ 3 from yesterday</div>
        </div>
        <div className={`ad-kpi ad-kpi--hidden ${isMobile ? 'ad-kpi--mobile' : ''}`}>
          <div className="ad-kpi__label"><span className="ad-kpi__dot"></span>Hidden content</div>
          <div className="ad-kpi__num">{kpis.hidden}</div>
          <div className="ad-kpi__delta ad-kpi__delta--flat">— no change this week</div>
        </div>
        <div className={`ad-kpi ad-kpi--resolved ${isMobile ? 'ad-kpi--mobile' : ''}`}>
          <div className="ad-kpi__label"><span className="ad-kpi__dot"></span>Resolved this week</div>
          <div className="ad-kpi__num">{kpis.resolvedWeek}</div>
          <div className="ad-kpi__delta ad-kpi__delta--flat">12% fewer than last week</div>
        </div>
      </div>
    </div>
  );
}

function AdFilters({ includeResolved, onIncludeResolved, kind, onKind, reporterKind, onReporterKind, autoOnly, onAutoOnly, variant = 'desktop' }) {
  const kinds = [
    { id: 'all', label: 'All', count: 8 },
    { id: 'post', label: 'Rep post', count: 2 },
    { id: 'comment', label: 'Comment', count: 3 },
    { id: 'poll', label: 'Poll', count: 1 },
    { id: 'pollcomment', label: 'Poll comment', count: 2 },
  ];
  const reporters = [
    { id: 'any', label: 'Any' },
    { id: 'citizen', label: 'Citizen' },
    { id: 'rep', label: 'Rep' },
  ];
  const isMobile = variant === 'mobile';

  return (
    <div className="ad-filters">
      <label className="ad-toggle">
        <input
          type="checkbox"
          checked={includeResolved}
          onChange={(e) => onIncludeResolved(e.target.checked)}
        />
        <span className="ad-toggle__track" />
        Include resolved
      </label>

      <div className="ad-filters__divider" />

      {!isMobile && <span className="ad-filters__label">Kind</span>}
      <div className="ad-filters__chips">
        {kinds.map((k) => (
          <button
            key={k.id}
            className={`ad-chip ${kind === k.id ? 'ad-chip--active' : ''}`}
            onClick={() => onKind(k.id)}
          >
            {k.label}
            <span className="ad-chip__count">{k.count}</span>
          </button>
        ))}
      </div>

      {!isMobile && (
        <>
          <div className="ad-filters__divider" />
          <span className="ad-filters__label">Reporter</span>
          <div className="ad-filters__chips">
            {reporters.map((r) => (
              <button
                key={r.id}
                className={`ad-chip ${reporterKind === r.id ? 'ad-chip--active' : ''}`}
                onClick={() => onReporterKind(r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </>
      )}

      <label className="ad-toggle">
        <input
          type="checkbox"
          checked={autoOnly}
          onChange={(e) => onAutoOnly(e.target.checked)}
        />
        <span className="ad-toggle__track" />
        Auto-flagged only
      </label>

      <div style={{ flex: 1 }} />

      <div className="ad-search">
        <AdGlyph.Search size={14} />
        <input placeholder="Search reports…" />
        <span className="ad-search__stub" title="Backend doesn't index reports yet — shipping with v2">Stub</span>
      </div>

      <button className="ad-iconbtn" title="Refresh queue">
        <AdGlyph.Refresh size={14} />
        {!isMobile && <span>Refresh</span>}
      </button>
    </div>
  );
}

function AdErrorBanner({ title, detail, onClose }) {
  return (
    <div className="ad-banner" role="alert">
      <div className="ad-banner__icon">!</div>
      <div className="ad-banner__body">
        <div className="ad-banner__title">{title}</div>
        {detail && <div className="ad-banner__detail">{detail}</div>}
      </div>
      <button className="ad-banner__close" onClick={onClose} aria-label="Dismiss">×</button>
    </div>
  );
}

Object.assign(window, { AdNavbar, AdSubNav, AdPageHead, AdFilters, AdErrorBanner });
