/* App — modal switcher + tweaks */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "modal": "signin",
  "state": "idle",
  "showBackdrop": true,
  "createRole": "citizen"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [activeModal, setActiveModal] = React.useState(tweaks.modal);
  const [activeState, setActiveState] = React.useState(tweaks.state);

  React.useEffect(() => { setActiveModal(tweaks.modal); }, [tweaks.modal]);
  React.useEffect(() => { setActiveState(tweaks.state); }, [tweaks.state]);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') {/* keep modal up — demo */} };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const switchModal = (m) => { setActiveModal(m); setTweak('modal', m); setActiveState('idle'); setTweak('state', 'idle'); };

  const stateOptionsFor = (m) => {
    if (m === 'verify') return ['idle', 'typing', 'error', 'loading', 'success'];
    return ['idle', 'loading', 'error'];
  };

  return (
    <>
      {tweaks.showBackdrop ? <BlurredBackdrop/> : <div className="bg-stage"/>}

      <div className="overlay">
        {activeModal === 'signin' ? (
          <SignInModal
            initialState={activeState}
            onClose={() => {}}
            onSwitch={switchModal}
          />
        ) : null}
        {activeModal === 'create' ? (
          <CreateAccountModal
            initialState={activeState}
            initialRole={tweaks.createRole}
            onClose={() => {}}
            onSwitch={switchModal}
            onContinue={(next) => switchModal(next)}
          />
        ) : null}
        {activeModal === 'verify' ? (
          <VerifyAddressModal
            initialState={activeState}
            onClose={() => {}}
            onSkip={() => {}}
            onDone={() => {}}
          />
        ) : null}
      </div>

      {/* Modal switcher tab — for quick navigation between the 3 modals */}
      <div className="modal-switcher" role="tablist">
        <button className={activeModal === 'signin' ? 'active' : ''} onClick={() => switchModal('signin')}>1 · Sign in</button>
        <button className={activeModal === 'create' ? 'active' : ''} onClick={() => switchModal('create')}>2 · Create account</button>
        <button className={activeModal === 'verify' ? 'active' : ''} onClick={() => switchModal('verify')}>3 · Verify address</button>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Modal">
          <TweakRadio label="Which modal" value={activeModal}
            options={[
              { value: 'signin', label: 'Sign in' },
              { value: 'create', label: 'Create' },
              { value: 'verify', label: 'Verify' },
            ]}
            onChange={(v) => switchModal(v)}/>
        </TweakSection>
        <TweakSection title="State">
          <TweakSelect label="CTA / form state" value={activeState}
            options={stateOptionsFor(activeModal).map(s => ({ value: s, label: s }))}
            onChange={(v) => { setActiveState(v); setTweak('state', v); }}/>
        </TweakSection>
        {activeModal === 'create' ? (
          <TweakSection title="Create — role">
            <TweakRadio label="Pre-selected role" value={tweaks.createRole || 'citizen'}
              options={[
                { value: 'citizen', label: 'Citizen' },
                { value: 'rep', label: 'Rep' },
              ]}
              onChange={(v) => setTweak('createRole', v)}/>
          </TweakSection>
        ) : null}
        <TweakSection title="Backdrop">
          <TweakToggle label="Show blurred PageView" value={tweaks.showBackdrop}
            onChange={(v) => setTweak('showBackdrop', v)}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
