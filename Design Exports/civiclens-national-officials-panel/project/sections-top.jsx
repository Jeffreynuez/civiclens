/* Sections — pure presentation. Owns the structure of:
   Hero, Executive, Senate, House, Activity feed, Browse-by-state, Verify CTA, Footer. */

/* ── Hero ─────────────────────────────────────────────── */
function Hero({ variant, onAddrSubmit }) {
  const [val, setVal] = React.useState('');
  return (
    <section className="hero" data-variant={variant} data-screen-label="hero">
      <div>
        <span className="hero__eyebrow"><span className="dot"></span> National Officials · 119th Congress</span>
        <h1>The people in <em>your federal government</em>, in one place.</h1>
        <p className="hero__sub">
          Browse the President, Vice President, Cabinet, Senate, House, and your own state's delegation.
          Verify your address to follow your reps and respond to what they say — in your district.
        </p>
        <div className="hero__addr" onSubmit={e => { e.preventDefault(); onAddrSubmit(val); }} role="search">
          <Ico.MapPin size={18} />
          <input
            placeholder={`Enter your home address — e.g. ${ADDR_PLACEHOLDER}`}
            value={val}
            onChange={e => setVal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onAddrSubmit(val)}
            aria-label="Home address"
          />
          <button onClick={() => onAddrSubmit(val)}>
            Find my reps <Ico.ArrowRight size={14} />
          </button>
        </div>
        <div className="hero__hint">
          <Ico.Shield size={12} /> {ADDR_HELPER}
        </div>
        <div className="hero__metrics">
          {DATA.metrics.map((m, i) => (
            <div className="hero__metric" key={i}>
              <div className="hero__metric-num cl-num">{m.num}</div>
              <div className="hero__metric-lbl">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="hero__vis">
        <HeroVisual variant={variant} />
      </div>
    </section>
  );
}

function HeroVisual({ variant }) {
  if (variant === 'dome') {
    return (
      <svg viewBox="0 0 320 320" style={{ width: '78%', height: '78%' }} aria-hidden="true">
        <defs>
          <linearGradient id="domeg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85"/>
            <stop offset="100%" stopColor="#C9B780" stopOpacity="0.4"/>
          </linearGradient>
        </defs>
        {/* base */}
        <rect x="40" y="240" width="240" height="40" fill="#A88E55" opacity="0.5"/>
        <rect x="60" y="220" width="200" height="22" fill="#9C8245" opacity="0.5"/>
        {/* columns */}
        {[80,110,140,170,200,230].map((x,i)=>(
          <rect key={i} x={x} y="170" width="12" height="50" fill="#FFFFFF" opacity="0.6"/>
        ))}
        <rect x="70" y="158" width="180" height="14" fill="#9C8245" opacity="0.55"/>
        {/* drum */}
        <rect x="100" y="120" width="120" height="40" fill="#FFFFFF" opacity="0.5"/>
        {[110,135,160,185,210].map((x,i)=>(
          <rect key={i} x={x} y="130" width="8" height="22" fill="#9C8245" opacity="0.45"/>
        ))}
        {/* dome */}
        <path d="M 105 120 Q 160 50 215 120 Z" fill="url(#domeg)"/>
        <path d="M 105 120 Q 160 50 215 120 Z" fill="none" stroke="#9C8245" strokeWidth="1" opacity="0.5"/>
        {/* statue/spire */}
        <line x1="160" y1="55" x2="160" y2="32" stroke="#9C8245" strokeWidth="1.6" opacity="0.7"/>
        <circle cx="160" cy="28" r="4" fill="#9C8245" opacity="0.7"/>
      </svg>
    );
  }
  if (variant === 'pattern') {
    return (
      <svg viewBox="0 0 320 320" style={{ width: '100%', height: '100%' }} aria-hidden="true">
        <defs>
          <pattern id="stars" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M12 6 L13 10 L17 10 L13.5 12.5 L15 17 L12 14 L9 17 L10.5 12.5 L7 10 L11 10 Z"
                  fill="rgba(255,255,255,0.18)"/>
          </pattern>
        </defs>
        <rect width="320" height="320" fill="url(#stars)"/>
        {/* corner flag canton */}
        <rect x="20" y="20" width="120" height="80" fill="rgba(255,255,255,0.14)" rx="4"/>
        <g opacity="0.88">
          {[0,1,2,3,4].map(r => [0,1,2,3,4,5].map(c => (
            <path key={`${r}-${c}`} d={`M${36+c*18} ${34+r*14} l1 3 l3 0 l-2.5 2 l1 3 l-2.5-2 l-2.5 2 l1-3 l-2.5-2 l3 0 z`} fill="rgba(255,255,255,0.65)"/>
          )))}
        </g>
        {/* stripes radiating */}
        {[120,140,160,180,200,220,240].map((y,i)=>(
          <rect key={i} x="160" y={y} width="160" height="6" fill={i%2===0?'rgba(230,57,70,0.32)':'rgba(255,255,255,0.16)'}/>
        ))}
        {/* lens */}
        <circle cx="218" cy="218" r="56" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3.5"/>
        <circle cx="218" cy="218" r="40" fill="rgba(255,255,255,0.08)"/>
        <line x1="258" y1="258" x2="296" y2="296" stroke="#8A2929" strokeWidth="6" strokeLinecap="round"/>
      </svg>
    );
  }
  // default: lens
  return (
    <svg viewBox="0 0 320 320" style={{ width: '85%', height: '85%' }} aria-hidden="true">
      <defs>
        <radialGradient id="lensg" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.30"/>
          <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.10"/>
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
        </radialGradient>
      </defs>
      {/* flag canton up top-left */}
      <rect x="40" y="40" width="120" height="78" rx="4" fill="rgba(255,255,255,0.96)"/>
      <rect x="160" y="40"  width="120" height="13" fill="rgba(255,255,255,0.78)"/>
      <rect x="160" y="66"  width="120" height="13" fill="rgba(255,255,255,0.78)"/>
      <rect x="160" y="92"  width="120" height="13" fill="rgba(255,255,255,0.78)"/>
      <rect x="160" y="118" width="120" height="13" fill="rgba(255,255,255,0.62)"/>
      {/* stars in canton */}
      {[0,1,2,3].map(r => [0,1,2,3,4].map(c => (
        <circle key={`${r}-${c}`} cx={56+c*22} cy={56+r*16} r="2.4" fill="#1B263B"/>
      )))}
      {/* lens body */}
      <circle cx="158" cy="200" r="78" fill="url(#lensg)" stroke="#FFFFFF" strokeWidth="4.2"/>
      <circle cx="158" cy="200" r="50" fill="rgba(255,255,255,0.10)"/>
      {/* highlight */}
      <ellipse cx="130" cy="170" rx="22" ry="14" fill="rgba(255,255,255,0.18)" transform="rotate(-30 130 170)"/>
      {/* handle */}
      <line x1="218" y1="260" x2="276" y2="298" stroke="#8A2929" strokeWidth="9" strokeLinecap="round"/>
    </svg>
  );
}

/* ── Section header with party balance counter ─────────── */
function SectionHead({ eyebrow, title, sub, balance }) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <div className="section-head__eyebrow">{eyebrow}</div>}
        <h2 className="section-head__title">{title}</h2>
      </div>
      {balance && (
        <span className="section-head__balance">
          {balance.r > 0 && <><span className="swatch r"></span>R · {balance.r}</>}
          {balance.d > 0 && <><span className="swatch d" style={{marginLeft: balance.r>0?6:0}}></span>D · {balance.d}</>}
          {balance.i > 0 && <><span className="swatch i" style={{marginLeft: 6}}></span>I · {balance.i}</>}
        </span>
      )}
      {sub && <span className="section-head__sub">{sub}</span>}
    </div>
  );
}

/* ── Executive ─────────────────────────────────────────── */
function ExecutiveSection() {
  return (
    <section className="section" data-screen-label="executive">
      <SectionHead
        eyebrow="Article II"
        title="Executive Branch"
        sub="Republican administration · sworn in Jan 20, 2025"
      />
      <div className="tier tier--exec-top">
        <div className="tier__label">President &amp; Vice President</div>
        {DATA.executive.top.map((p, i) => <PersonCard key={i} p={p} hero />)}
      </div>
      <div className="tier tier--exec-cabinet">
        <div className="tier__label">Cabinet</div>
        {DATA.executive.cabinet.map((p, i) => <PersonCard key={i} p={p} sm />)}
      </div>
    </section>
  );
}

/* ── Senate ────────────────────────────────────────────── */
function SenateSection({ onLockedAction }) {
  const all = [...DATA.senate.primary, ...DATA.senate.whips];
  const balance = countParties(all);
  return (
    <section className="section" data-screen-label="senate">
      <SectionHead
        eyebrow="Article I · Section 3"
        title="Senate Leadership"
        sub="100 senators · 53R · 45D · 2I"
        balance={balance}
      />
      <div className="tier tier--3">
        <div className="tier__label">Floor leadership</div>
        {DATA.senate.primary.map((p, i) => <PersonCard key={i} p={p} onLockedAction={onLockedAction} />)}
      </div>
      <div className="tier tier--exec-cabinet">
        <div className="tier__label">Whips &amp; assistant leaders</div>
        {DATA.senate.whips.map((p, i) => <PersonCard key={i} p={p} sm />)}
      </div>
    </section>
  );
}

/* ── House ─────────────────────────────────────────────── */
function HouseSection({ onLockedAction }) {
  const all = [...DATA.house.primary, ...DATA.house.whips];
  const balance = countParties(all);
  return (
    <section className="section" data-screen-label="house">
      <SectionHead
        eyebrow="Article I · Section 2"
        title="House Leadership"
        sub="435 representatives · 220R · 215D"
        balance={balance}
      />
      <div className="tier tier--3">
        <div className="tier__label">Floor leadership</div>
        {DATA.house.primary.map((p, i) => <PersonCard key={i} p={p} onLockedAction={onLockedAction} />)}
      </div>
      <div className="tier tier--exec-cabinet">
        <div className="tier__label">Whips &amp; caucus chairs</div>
        {DATA.house.whips.map((p, i) => <PersonCard key={i} p={p} sm />)}
      </div>
    </section>
  );
}

function countParties(list) {
  return list.reduce((acc, p) => {
    if (p.party === 'r') acc.r++;
    else if (p.party === 'd') acc.d++;
    else if (p.party === 'i') acc.i++;
    return acc;
  }, { r: 0, d: 0, i: 0 });
}

window.Hero = Hero;
window.SectionHead = SectionHead;
window.ExecutiveSection = ExecutiveSection;
window.SenateSection = SenateSection;
window.HouseSection = HouseSection;
window.countParties = countParties;
