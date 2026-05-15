/* HelpBuildPage — the main "Help build CivicView" page.
   Props:
     - variant: 'desktop' | 'tablet' | 'mobile'
     - crowdfundLive: bool  — controls primary CTA + progress meter state
     - openSections: Set<'shipped'|'progress'|'money'|'roadmap'>
     - showAnnotations: bool — optional interaction-state pins
*/
const { useState, useMemo } = React;
const Icon  = window.Icon;
const CVLogo = window.CVLogo;
const D     = window.HB_DATA;

const fmt$ = (n) => '$' + n.toLocaleString('en-US');

/* ---- Top navbar ---- */
function HBNavbar({ variant }) {
  const mobile = variant === 'mobile';
  return (
    <header className="hb-nav">
      <div className="hb-nav__logo">
        <CVLogo size={mobile ? 24 : 28} />
        <span>CivicView</span>
      </div>

      <div className="hb-nav__cluster">
        <span className="hb-nav__identity">
          <Icon.Pin size={11} />
          <span>{mobile ? 'Maria H.' : 'CivicView Admin'}</span>
        </span>
        <button className="hb-nav__signout">Sign out</button>
        <button className="hb-nav__subscribe">
          <Icon.Mail size={14} />
          <span>Subscribe</span>
        </button>
        <button className="hb-nav__btn hb-nav__btn--hide-md">
          <Icon.Polls size={14} />
          <span>Polls</span>
        </button>
        <button className="hb-nav__btn hb-nav__btn--hide-md">
          <Icon.Bookmark size={14} />
          <span>My Tracked</span>
        </button>
        <button className="hb-nav__icon" aria-label="Notifications">
          <Icon.Bell size={18}/>
          <span className="hb-nav__dot" />
        </button>
        <button className="hb-nav__icon" aria-label="Menu"><Icon.Menu size={18}/></button>
      </div>
    </header>
  );
}

/* ---- Page top bar ---- */
function HBTopbar() {
  return (
    <div className="hb-topbar">
      <button className="hb-topbar__back">
        <Icon.ArrowLeft size={14}/>
        <span>Back</span>
      </button>
      <div className="hb-topbar__title">Help build CivicView</div>
      <div className="hb-topbar__spacer"></div>
    </div>
  );
}

/* ---- Hero ---- */
function HBHero({ crowdfundLive }) {
  return (
    <section className="hb-hero">
      {/* huge faint watermark */}
      <svg className="hb-hero__watermark" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="0.8"/>
        <path d="M50 4 V96 M4 50 H96" stroke="white" strokeWidth="0.4"/>
        <circle cx="50" cy="50" r="32" fill="none" stroke="white" strokeWidth="0.4"/>
        <circle cx="50" cy="50" r="16" fill="none" stroke="white" strokeWidth="0.4"/>
        <text x="50" y="56" textAnchor="middle" fontSize="11" fontWeight="800" fill="white" fontFamily="Geist">
          CIVIC&middot;TECH
        </text>
      </svg>

      <div className="hb-hero__inner">
        <div className="hb-hero__eyebrow">Grassroots Civic Tech</div>
        <h1 className="hb-hero__headline">
          Every civic app stops at <em>"here's your rep."</em><br/>
          We're making politicians actually accessible.
        </h1>
        <p className="hb-hero__body">
          CivicView gives every U.S. citizen a direct line to their representatives &mdash;
          track their votes, see their posts, ask them questions in polls, push back in comments,
          all scoped to the district they actually represent. Below is a transparent breakdown
          of what's built, what's in progress, and what specific dollar amounts unlock the rest.
          {' '}<strong>No equity, no ads, no investor carve-outs</strong> &mdash; just citizens funding citizen infrastructure.
        </p>

        <div className="hb-hero__cta-row">
          {crowdfundLive ? (
            <a href="#" className="hb-cta hb-cta--primary">
              <Icon.Heart size={16}/>
              <span>Back the crowdfund</span>
            </a>
          ) : (
            <span className="hb-cta hb-cta--pending" aria-disabled="true">
              Crowdfund launching soon
            </span>
          )}
          <a href="#money" className="hb-cta hb-cta--ghost">See where the money goes &rarr;</a>
        </div>

        <div className="hb-hero__assurance">
          <span>One-time + year-1 recurring</span>
          <span className="hb-hero__dot"></span>
          <span>Every line cited</span>
          <span className="hb-hero__dot"></span>
          <span>Operated by one person, for now</span>
        </div>
      </div>
    </section>
  );
}

/* ---- Progress meter strip ---- */
function HBProgress({ crowdfundLive }) {
  const goal = D.goal;
  const raised = crowdfundLive ? D.raised : 0;
  const pct = crowdfundLive ? Math.round((raised / goal) * 100) : 0;
  return (
    <section className={`hb-progress ${crowdfundLive ? '' : 'hb-progress--prelaunch hb-progress--noborder'}`}>
      <div className="hb-progress__main">
        <div className="hb-progress__nums">
          {crowdfundLive ? (
            <>
              <span className="hb-progress__raised">{fmt$(raised)}</span>
              <span className="hb-progress__goal">raised of <strong>{fmt$(goal)}</strong> to fully unlock CivicView</span>
            </>
          ) : (
            <>
              <span className="hb-progress__raised hb-progress__raised--muted">{fmt$(goal)}</span>
              <span className="hb-progress__goal">to fully unlock CivicView &mdash; <strong>one-time costs + first year of recurring</strong></span>
            </>
          )}
        </div>
        <div className="hb-progress__subline">
          {crowdfundLive
            ? <>Covers ID.me setup, federal trademark, DMCA agent, and 12 months of ProPublica, OpenStates, Google Civic, hosting, and domain. Surplus rolls into year&nbsp;2.</>
            : <>Bar fills in once the campaign opens. The total below is itemized, sourced, and broken into <em>"fund this line"</em>&nbsp;buttons.</>
          }
        </div>
        <div className="hb-progress__bar">
          {crowdfundLive && (
            <>
              <span className="hb-progress__pct" style={{ left: `${Math.min(Math.max(pct, 6), 94)}%` }}>{pct}%</span>
              <div className="hb-progress__fill" style={{ width: `${pct}%` }}></div>
            </>
          )}
        </div>
      </div>

      <div className="hb-progress__tiles">
        <div className="hb-tile">
          <span className="hb-tile__eye">Backers</span>
          {crowdfundLive
            ? <span className="hb-tile__num">{D.backers}</span>
            : <span className="hb-tile__num hb-tile__num--sm" style={{color: 'var(--cl-text-muted)'}}>&mdash;</span>
          }
          <span className="hb-tile__sub">
            {crowdfundLive ? 'across the first 8 days' : 'opens with the campaign'}
          </span>
        </div>
        <div className="hb-tile">
          <span className="hb-tile__eye">Days remaining</span>
          {crowdfundLive
            ? <span className="hb-tile__num">{D.daysLeft}</span>
            : <span className="hb-tile__num hb-tile__num--sm" style={{color: 'var(--cl-text-muted)'}}>Pre&nbsp;launch</span>
          }
          <span className="hb-tile__sub">
            {crowdfundLive ? 'until Jun 7, 2026' : 'launch tba — subscribe to be notified'}
          </span>
        </div>
        <div className="hb-tile">
          <span className="hb-tile__eye">Largest unlock pending</span>
          <span className="hb-tile__num hb-tile__num--sm">{D.largestPending}</span>
          <span className="hb-tile__sub">{D.largestPendingSub}</span>
        </div>
      </div>
    </section>
  );
}

/* ---- Section shell ---- */
function HBSection({ id, eyebrow, title, count, sub, isOpen, onToggle, modifier = '', children }) {
  return (
    <section id={id} className={`hb-section ${modifier} ${isOpen ? 'is-open' : ''}`}>
      <button className="hb-section__head" onClick={onToggle} aria-expanded={isOpen}>
        <div className="hb-section__head-text">
          <div className="hb-section__eyebrow">{eyebrow}</div>
          <div className="hb-section__title-row">
            <h2 className="hb-section__title">{title}</h2>
            <span className="hb-section__count">{count}</span>
          </div>
          {sub && <p className="hb-section__sub">{sub}</p>}
        </div>
        <span className="hb-section__chev"><Icon.Chevron size={18}/></span>
      </button>
      <div className="hb-section__body">{children}</div>
    </section>
  );
}

/* ---- Shipped / In-progress checklists ---- */
function HBChecklist({ items, kind }) {
  return (
    <ul className="hb-checklist" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {items.map(([title, detail], i) => (
        <li key={i} className={`hb-check hb-check--${kind}`}>
          <span className="hb-check__icon">
            {kind === 'shipped' ? <Icon.Check size={12}/> : <Icon.Gear size={12}/>}
          </span>
          <div className="hb-check__body">
            <strong>{title}</strong>
            <div className="hb-check__detail">{detail}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ---- Money cluster ---- */
function HBMoneyCluster({ title, sub, items, total, crowdfundLive }) {
  return (
    <div className="hb-money-cluster">
      <div className="hb-money-cluster__head">
        <div className="hb-money-cluster__title">
          {title}
          {sub && <span className="hb-money-cluster__title-sub">&middot; {sub}</span>}
        </div>
        <div className="hb-money-cluster__total">{total}</div>
      </div>
      {items.map((item, i) => (
        <article key={i} className="hb-money">
          <div className="hb-money__title">{item.title}</div>
          <div className="hb-money__cost">
            {item.cost}{' '}
            <span className="hb-money__cost-prefix">{item.costSuffix}</span>
          </div>
          <p className="hb-money__body">{item.body}</p>
          <div className="hb-money__footer">
            <div className="hb-money__source">
              <span className="hb-money__source-label">Source:</span>{item.source}
            </div>
            {crowdfundLive ? (
              <a href="#" className="hb-money__fund">
                <Icon.Heart size={12}/>
                <span>Fund this line</span>
              </a>
            ) : (
              <span className="hb-money__fund hb-money__fund--pending" title="We'll route your donation here once the crowdfund opens">
                Fund this line at launch
              </span>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

/* ---- Roadmap ---- */
function HBRoadmap() {
  return (
    <div className="hb-roadmap">
      {D.roadmap.map((feat, i) => {
        const IconComp = Icon[feat.icon];
        return (
          <article key={i} className="hb-feature">
            <span className="hb-feature__tag">{feat.tag}</span>
            <div className="hb-feature__head">
              <span className="hb-feature__icon"><IconComp size={18}/></span>
              <div className="hb-feature__title">{feat.title}</div>
            </div>
            <p className="hb-feature__body">{feat.body}</p>
          </article>
        );
      })}
    </div>
  );
}

/* ---- Footer CTA ---- */
function HBFooter({ crowdfundLive }) {
  return (
    <div className="hb-footer">
      {crowdfundLive ? (
        <a href="#" className="hb-cta hb-cta--primary">
          <Icon.Heart size={16}/>
          <span>Back the crowdfund</span>
        </a>
      ) : (
        <span className="hb-cta hb-cta--pending hb-cta--pending-light">Crowdfund launching soon</span>
      )}
      <p className="hb-footer__caption">
        Questions or feedback? Use the Feedback tab in the navbar &mdash; we read every submission and either turn it into a fix, an update, or a new entry on the future-features list.
      </p>
    </div>
  );
}

/* ---- Sticky mobile CTA ---- */
function HBStickyCTA({ crowdfundLive }) {
  return (
    <div className="hb-sticky-cta">
      <div className="hb-sticky-cta__inner">
        {crowdfundLive ? (
          <a href="#" className="hb-cta hb-cta--primary">
            <Icon.Heart size={14}/>
            <span>Back the crowdfund</span>
          </a>
        ) : (
          <span className="hb-cta hb-cta--pending hb-cta--pending-light">Crowdfund launching soon</span>
        )}
      </div>
    </div>
  );
}

/* ---- Main page ---- */
function HelpBuildPage({
  variant = 'desktop',
  crowdfundLive = false,
  openSections = new Set(['money']),
  noNavbar = false,
}) {
  const [open, setOpen] = useState(openSections);
  const toggle = (k) => setOpen(prev => {
    const next = new Set(prev);
    if (next.has(k)) next.delete(k); else next.add(k);
    return next;
  });

  const cls = `hb-page ${variant === 'mobile' ? 'hb-mobile' : variant === 'tablet' ? 'hb-tablet' : ''}`;

  // total cost helpers
  const onetimeTotal = '$3,456 total one-time';
  const recurringTotal = '~$11,800 / first year';

  return (
    <div className={cls}>
      {!noNavbar && <HBNavbar variant={variant} />}
      <HBTopbar />

      <main className="hb-main">
        <HBHero crowdfundLive={crowdfundLive} />
        <HBProgress crowdfundLive={crowdfundLive} />

        <HBSection
          id="shipped"
          eyebrow="What's shipped"
          title="Already built"
          count={D.shipped.length}
          isOpen={open.has('shipped')}
          onToggle={() => toggle('shipped')}
          sub={open.has('shipped') ? null : 'Every feature already in production. The volume itself is the trust signal — expand to read the list.'}
        >
          <HBChecklist items={D.shipped} kind="shipped" />
        </HBSection>

        <HBSection
          id="progress"
          eyebrow="What's next"
          title="In progress"
          count={D.inProgress.length}
          isOpen={open.has('progress')}
          onToggle={() => toggle('progress')}
        >
          <HBChecklist items={D.inProgress} kind="progress" />
        </HBSection>

        <HBSection
          id="money"
          modifier="hb-section--money"
          eyebrow="Where the money goes"
          title="Blocked on funding"
          count={D.fundingOnetime.length + D.fundingRecurring.length}
          isOpen={open.has('money')}
          onToggle={() => toggle('money')}
          sub="Every line below is an exact cost with a citation. Backers can verify the numbers themselves; we'd rather over-disclose than handwave."
        >
          <div className="hb-money-intro">
            <Icon.Info size={16}/>
            <div>
              <strong>How to read this.</strong> Each row is one thing we can't ship without funding,
              paired with the actual contract or pricing page. Grouped into one-time costs (paid once)
              and recurring (paid every month or year, on top).
            </div>
          </div>
          <HBMoneyCluster
            title="One-time costs"
            sub="paid once, then done"
            items={D.fundingOnetime}
            total={onetimeTotal}
            crowdfundLive={crowdfundLive}
          />
          <HBMoneyCluster
            title="Recurring costs"
            sub="ongoing infra + data licenses"
            items={D.fundingRecurring}
            total={recurringTotal}
            crowdfundLive={crowdfundLive}
          />
        </HBSection>

        <HBSection
          id="roadmap"
          eyebrow="On the roadmap"
          title="Future product features"
          count={D.roadmap.length}
          isOpen={open.has('roadmap')}
          onToggle={() => toggle('roadmap')}
          sub={open.has('roadmap') ? 'Aspirational — no costs yet. These get a "Fund this" treatment only after we scope the infra.' : null}
        >
          <HBRoadmap />
        </HBSection>

        <HBFooter crowdfundLive={crowdfundLive} />
      </main>

      {variant === 'mobile' && <HBStickyCTA crowdfundLive={crowdfundLive} />}
    </div>
  );
}

window.HelpBuildPage = HelpBuildPage;
window.HBHero = HBHero;
window.HBProgress = HBProgress;
window.HBNavbar = HBNavbar;
window.HBTopbar = HBTopbar;
