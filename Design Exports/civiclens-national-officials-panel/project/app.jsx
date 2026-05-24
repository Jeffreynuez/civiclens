/* App shell — Navbar + Tweaks + glue.
   Wires light interactions: address modal, locked-action tooltip. */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroVariant": "lens",
  "density": "normal",
  "accent": "green"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [modal, setModal] = React.useState(null);
  const [tip, setTip] = React.useState(null);

  // accent hook
  React.useEffect(() => {
    const root = document.documentElement;
    if (tweaks.accent === 'navy')   { root.style.setProperty('--cl-accent', '#1b4fa3'); root.style.setProperty('--cl-accent-light', '#2e6dc4'); root.style.setProperty('--cl-accent-soft', '#e6eef8'); }
    else if (tweaks.accent === 'burgundy') { root.style.setProperty('--cl-accent', '#8c2929'); root.style.setProperty('--cl-accent-light', '#a83d3d'); root.style.setProperty('--cl-accent-soft', '#f5e3e3'); }
    else { root.style.removeProperty('--cl-accent'); root.style.removeProperty('--cl-accent-light'); root.style.removeProperty('--cl-accent-soft'); }
  }, [tweaks.accent]);

  const handleAddrSubmit = (val) => {
    setModal({ kind: 'verify', value: val });
  };
  const handleLocked = (label) => {
    setTip({ label, ts: Date.now() });
    setTimeout(() => setTip(t => (t && Date.now() - t.ts >= 1900) ? null : t), 2000);
  };

  // hover-following tooltip
  React.useEffect(() => {
    if (!tip) return;
    const onMove = (e) => {
      const el = document.getElementById('floating-tip');
      if (!el) return;
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY - 36}px`;
    };
    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, [tip]);

  return (
    <div data-density={tweaks.density}>
      <header className="cl-nav">
        <div className="cl-nav__logo">
          <Ico.Logo size={26} />
          <span>CivicLens</span>
        </div>
        <label className="cl-nav__search" aria-label="Search">
          <Ico.Search size={14} />
          <input placeholder="Search reps, bills, committees…" />
          <kbd className="cl-nav__kbd" aria-hidden="true">/</kbd>
        </label>
        <button className="cl-nav__btn cl-nav__verify" onClick={()=>setModal({kind:'verify'})}>
          <Ico.MapPin size={14} /> Verify your address
        </button>
        <button className="cl-nav__btn"><Ico.Users size={13} /> Committees</button>
        <button className="cl-nav__pill cl-nav__pill--login" onClick={()=>setModal({kind:'verify'})}>Citizen login</button>
      </header>

      <main className="page">
        <Hero variant={tweaks.heroVariant} onAddrSubmit={handleAddrSubmit} />
        <ExecutiveSection />
        <SenateSection onLockedAction={handleLocked} />
        <HouseSection onLockedAction={handleLocked} />
        <FeedSection onLockedAction={handleLocked} />
        <StateBrowserSection />
        <VerifyStrip onSubmit={handleAddrSubmit} />
      </main>
      <Footer />

      {modal && <VerifyModal initial={modal.value} onClose={()=>setModal(null)} />}
      {tip && (
        <div id="floating-tip" className="tip show">
          <Ico.Lock size={11} /> {tip.label}
        </div>
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection title="Hero">
          <TweakRadio
            label="Hero visual"
            value={tweaks.heroVariant}
            onChange={(v)=>setTweak('heroVariant', v)}
            options={[
              { label: 'Lens', value: 'lens' },
              { label: 'Dome', value: 'dome' },
              { label: 'Pattern', value: 'pattern' },
            ]}
          />
        </TweakSection>
        <TweakSection title="Layout">
          <TweakRadio
            label="Density"
            value={tweaks.density}
            onChange={(v)=>setTweak('density', v)}
            options={[
              { label: 'Normal',  value: 'normal' },
              { label: 'Compact', value: 'compact' },
            ]}
          />
        </TweakSection>
        <TweakSection title="Accent">
          <TweakRadio
            label="Color"
            value={tweaks.accent}
            onChange={(v)=>setTweak('accent', v)}
            options={[
              { label: 'Green',    value: 'green' },
              { label: 'Navy',     value: 'navy' },
              { label: 'Burgundy', value: 'burgundy' },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

function VerifyModal({ initial, onClose }) {
  const [val, setVal] = React.useState(initial || '');
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()} role="dialog" aria-labelledby="vm-title">
        <h3 id="vm-title">Verify your address</h3>
        <p>
          We use your address to find your representative and senators — and to
          let you respond in your district. Your address is encrypted and never
          shared.
        </p>
        <form className="modal__form" onSubmit={e=>{e.preventDefault();onClose();}}>
          <Ico.MapPin size={18} />
          <input
            placeholder={ADDR_PLACEHOLDER}
            value={val} onChange={e=>setVal(e.target.value)}
            autoFocus
          />
          <button type="submit">Continue</button>
        </form>
        <button className="modal__close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
