/* Activity feed + State browser + Verify CTA + Footer */

/* ─── Activity feed ─────────────────────────────────────────────── */
function FeedSection({ onLockedAction }) {
  const [filter, setFilter] = React.useState('all');
  const items = DATA.feed.filter(f => filter === 'all' || f.party === filter);
  const balance = countParties(DATA.feed);

  return (
    <section className="section" data-screen-label="feed">
      <SectionHead
        eyebrow="Past 24 hours"
        title="National Activity"
        sub={`Alternates ${balance.r}R · ${balance.d}D for balanced scan`}
        balance={balance}
      />
      <div className="feed__filters" role="tablist" aria-label="Filter by party">
        <button className={`feed__filter ${filter==='all'?'active':''}`}  onClick={()=>setFilter('all')}>All</button>
        <button className={`feed__filter ${filter==='d'?'active':''}`}    onClick={()=>setFilter('d')}>Democrats</button>
        <button className={`feed__filter ${filter==='r'?'active':''}`}    onClick={()=>setFilter('r')}>Republicans</button>
      </div>
      <div className="feed">
        {items.map((p, i) => p.kind === 'full'
          ? <FullPost key={i} p={p} onLockedAction={onLockedAction} />
          : <CondensedRow key={i} p={p} onLockedAction={onLockedAction} />
        )}
      </div>
    </section>
  );
}

function FullPost({ p, onLockedAction }) {
  const lock = (label) => () => onLockedAction(label);
  return (
    <article className="post">
      <div className="post__hdr">
        <div className={`feed-row__av ${p.party}`} style={{width:46,height:46,fontSize:'0.92rem'}}>{p.initials}</div>
        <div style={{ flex: 1 }}>
          <div className="post__name">
            {p.name} <PartyChip p={p.party} />
          </div>
          <div className="post__meta">{p.role} · {p.timeAgo}</div>
        </div>
      </div>
      <div className="post__body">{p.body}</div>
      <div className="post__rx">
        <button className="rxbtn up" onClick={lock('Sign in to react')}><Ico.ThumbsUp size={13} /> <span className="num cl-num">{p.up.toLocaleString()}</span></button>
        <button className="rxbtn down" onClick={lock('Sign in to react')}><Ico.ThumbsDown size={13} /> <span className="num cl-num">{p.down.toLocaleString()}</span></button>
        <button className="rxbtn" onClick={lock('Sign in to comment')}><Ico.Chat size={13} /> <span className="num cl-num">{p.comments}</span> comments</button>
        <span className="locked-hint"><Ico.Lock size={11} /> Sign in to participate</span>
      </div>
    </article>
  );
}

function CondensedRow({ p, onLockedAction }) {
  return (
    <div className="feed-row">
      <div className={`feed-row__av ${p.party}`}>{p.initials}</div>
      <div className="feed-row__main">
        <div className="feed-row__hdr">
          <span className="feed-row__name">{p.name}</span>
          <PartyChip p={p.party} />
          <span className="feed-row__role">· {p.role}</span>
          <span className="feed-row__time">{p.timeAgo}</span>
        </div>
        <div className="feed-row__body">{p.body}</div>
        <div className="feed-row__rx">
          <span><Ico.ThumbsUp size={11} /> <span className="num cl-num">{p.up.toLocaleString()}</span></span>
          <span><Ico.ThumbsDown size={11} /> <span className="num cl-num">{p.down}</span></span>
          <span><Ico.Chat size={11} /> <span className="num cl-num">{p.comments}</span></span>
        </div>
      </div>
    </div>
  );
}

/* ─── State browser ─────────────────────────────────────────────── */
function StateBrowserSection() {
  const [hovered, setHovered] = React.useState(null);
  const [popPos, setPopPos] = React.useState({ x: 0, y: 0 });

  const handleEnter = (st, e) => {
    setHovered(st);
    const rect = e.currentTarget.getBoundingClientRect();
    const wrapRect = e.currentTarget.ownerSVGElement.parentElement.getBoundingClientRect();
    setPopPos({
      x: Math.min(rect.left - wrapRect.left + rect.width / 2 + 10, wrapRect.width - 290),
      y: rect.top - wrapRect.top + rect.height / 2 - 50,
    });
  };

  return (
    <section className="section" data-screen-label="states">
      <SectionHead
        eyebrow="All 50 states · plus territories"
        title="Browse by state"
        sub="Hover a state for its senators · click to open the delegation"
      />
      <div className="statebrowser">
        <div className="statemap">
          <USMap onStateEnter={handleEnter} onStateLeave={()=>setHovered(null)} hovered={hovered?.a} />
          {hovered && (
            <div className="state-pop show" style={{ left: popPos.x, top: popPos.y }}>
              <div className="state-pop__name">{hovered.n}</div>
              <div className="state-pop__row">
                <span className="role">Senate</span>
                <span className="nm">{hovered.sens[0].nm}</span>
                <PartyChip p={hovered.sens[0].p} />
              </div>
              <div className="state-pop__row">
                <span className="role">Senate</span>
                <span className="nm">{hovered.sens[1].nm}</span>
                <PartyChip p={hovered.sens[1].p} />
              </div>
              <div className="state-pop__row">
                <span className="role">House</span>
                <span className="nm">{hovered.h} representative{hovered.h>1?'s':''}</span>
              </div>
              <span className="state-pop__cta">Open delegation →</span>
            </div>
          )}
        </div>
        <StateGrid />
      </div>
    </section>
  );
}

function StateGrid() {
  const [q, setQ] = React.useState('');
  const list = DATA.states.filter(s =>
    !q || s.n.toLowerCase().includes(q.toLowerCase()) || s.a.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div className="stategrid">
      <div className="stategrid__hdr">
        <Ico.Filter size={12} />
        <input
          placeholder="Filter states…"
          value={q}
          onChange={e=>setQ(e.target.value)}
          style={{ flex:1, border:'1px solid var(--cl-border)', borderRadius:6, padding:'6px 10px', fontSize:'0.78rem', outline:'none' }}
          aria-label="Filter states"
        />
      </div>
      <div className="stategrid__list">
        {list.map(s => (
          <div className="stategrid__item" key={s.a}>
            <span className="abbr">{s.a}</span>
            <span className="name">{s.n}</span>
            <span className="seats cl-num">{s.h+s.s} seats</span>
          </div>
        ))}
        {list.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign:'center', padding: 16, fontSize: '0.8rem', color: 'var(--cl-text-muted)' }}>
            No matches
          </div>
        )}
      </div>
    </div>
  );
}

/* Simplified US map. Each state is one rect/path positioned on a coarse grid
   that approximates the country. Trades geographic accuracy for legibility. */
function USMap({ onStateEnter, onStateLeave, hovered }) {
  // grid: [col, row, abbr, w?, h?]
  // Approximated US "tile map" layout (popular scheme used by news orgs).
  const tiles = [
    // r0
    ['AK',0,0],['ME',10,0],
    // r1
    ['VT',9,1],['NH',10,1],
    // r2
    ['WA',1,2],['ID',2,2],['MT',3,2],['ND',4,2],['MN',5,2],['IL',6,2],['WI',7,2],['MI',8,2],['NY',9,2],['MA',10,2],
    // r3
    ['OR',1,3],['NV',2,3],['WY',3,3],['SD',4,3],['IA',5,3],['IN',6,3],['OH',7,3],['PA',8,3],['NJ',9,3],['CT',10,3],['RI',11,3],
    // r4
    ['CA',1,4],['UT',2,4],['CO',3,4],['NE',4,4],['MO',5,4],['KY',6,4],['WV',7,4],['VA',8,4],['MD',9,4],['DE',10,4],
    // r5
    ['AZ',2,5],['NM',3,5],['KS',4,5],['AR',5,5],['TN',6,5],['NC',7,5],['SC',8,5],['DC',9,5],
    // r6
    ['HI',0,6],['OK',4,6],['LA',5,6],['MS',6,6],['AL',7,6],['GA',8,6],
    // r7
    ['TX',4,7],['FL',8,7],
  ];
  const W = 44, H = 38, GAP = 4;
  const cols = 12, rows = 8;
  const byA = Object.fromEntries(DATA.states.map(s => [s.a, s]));
  return (
    <svg viewBox={`0 0 ${cols*(W+GAP)} ${rows*(H+GAP) + 24}`} role="img" aria-label="United States map">
      {tiles.map(([a, c, r]) => {
        const st = byA[a];
        if (!st && a !== 'DC') return null;
        const x = c*(W+GAP);
        const y = r*(H+GAP);
        const fillCls = `st ${hovered===a?'active':''}`;
        return (
          <g key={a}>
            <rect
              className={fillCls}
              x={x} y={y} width={W} height={H} rx="4"
              onMouseEnter={(e)=>st && onStateEnter(st, e)}
              onMouseLeave={onStateLeave}
            />
            <text className="st-label" x={x+W/2} y={y+H/2+3}>{a}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Verify CTA ─────────────────────────────────────────────────── */
function VerifyStrip({ onSubmit }) {
  const [val, setVal] = React.useState('');
  return (
    <section className="section" style={{ paddingTop: 24 }} data-screen-label="verify-cta">
      <div className="verify-strip">
        <div>
          <h2>Make this your own.</h2>
          <p>
            Verify your home address to surface your senators, your representative, your committees,
            and to track and respond to what they say. CivicLens never shares or sells your address.
          </p>
        </div>
        <div>
          <form className="verify-strip__form" onSubmit={e=>{e.preventDefault();onSubmit(val);}}>
            <Ico.MapPin size={18} />
            <input
              placeholder={ADDR_PLACEHOLDER}
              value={val} onChange={e=>setVal(e.target.value)}
              aria-label="Home address"
            />
            <button type="submit">Verify <Ico.ArrowRight size={13} /></button>
          </form>
          <div style={{ marginTop: 10, fontSize: '0.74rem', color: 'rgba(255,255,255,0.78)', display:'flex', alignItems:'center', gap:6 }}>
            <Ico.Shield size={12} /> {ADDR_HELPER}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="footer">
      <div className="page">
        <div className="footer__grid">
          <div>
            <div className="footer__brand-name">
              <span style={{ display:'inline-flex', padding:6, background:'var(--cl-primary)', borderRadius:8, marginRight:2 }}>
                <Ico.Logo size={20} />
              </span>
              CivicLens
            </div>
            <p className="footer__disclaimer">
              CivicLens does not endorse any candidate, party, or position. We surface what
              officials say and do — and let citizens respond in their own districts.
            </p>
          </div>
          <div className="footer__col">
            <h4>Browse</h4>
            <a href="#executive">Executive branch</a>
            <a href="#senate">Senate</a>
            <a href="#house">House</a>
            <a href="#states">Browse by state</a>
          </div>
          <div className="footer__col">
            <h4>Get started</h4>
            <a href="#verify">Verify your address</a>
            <a href="#">How CivicLens works</a>
            <a href="#">Newsletter (weekly digest)</a>
            <a href="#">Claim your office</a>
          </div>
          <div className="footer__col">
            <h4>About</h4>
            <a href="#">Methodology</a>
            <a href="#">Editorial standards</a>
            <a href="#">Privacy</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© 2026 CivicLens</span>
          <span>·</span>
          <span>Data sourced from official chamber records, FEC filings, and verified office staff.</span>
        </div>
      </div>
    </footer>
  );
}

window.FeedSection = FeedSection;
window.StateBrowserSection = StateBrowserSection;
window.VerifyStrip = VerifyStrip;
window.Footer = Footer;
