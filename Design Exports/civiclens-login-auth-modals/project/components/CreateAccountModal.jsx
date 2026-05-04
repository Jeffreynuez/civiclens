/* Create Account modal */

function CreateAccountModal({ initialState = 'idle', initialRole = null, onClose, onSwitch, onContinue }) {
  const [role, setRole] = React.useState(initialRole); // null | 'citizen' | 'rep'
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPwd, setShowPwd] = React.useState(false);
  const [city, setCity] = React.useState('');
  const [office, setOffice] = React.useState('');
  const [state, setState] = React.useState(initialState);

  React.useEffect(() => { setState(initialState); setRole(initialRole); }, [initialState, initialRole]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setState('loading');
    setTimeout(() => {
      setState('idle');
      if (role === 'citizen') onContinue && onContinue('verify');
    }, 1500);
  };

  const isLoading = state === 'loading';
  const isError = state === 'error';

  return (
    <div className="modal modal--wide" role="dialog" aria-labelledby="create-title">
      <button className="modal__close" onClick={onClose} aria-label="Close"><Icon.Close/></button>

      <div className="modal__brand">
        <BrandMark/>
        <div className="modal__brand-word">CivicLens</div>
      </div>

      <div className="modal__head">
        <h2 className="modal__title" id="create-title">Join CivicLens</h2>
        <p className="modal__sub">Track your reps and have your voice heard locally.</p>
      </div>

      <div className="choices" role="radiogroup" aria-label="Account type">
        <button type="button" role="radio" aria-checked={role === 'citizen'}
          className={`choice${role === 'citizen' ? ' selected' : ''}`}
          onClick={() => setRole('citizen')}>
          <span className="choice__radio"></span>
          <span className="choice__icon"><Icon.User/></span>
          <span className="choice__title">I'm a citizen</span>
          <span className="choice__sub">Verify with your address to get scoped to your district.</span>
        </button>
        <button type="button" role="radio" aria-checked={role === 'rep'}
          className={`choice${role === 'rep' ? ' selected' : ''}`}
          onClick={() => setRole('rep')}>
          <span className="choice__radio"></span>
          <span className="choice__icon"><Icon.Briefcase/></span>
          <span className="choice__title">I'm a representative</span>
          <span className="choice__sub">Claim your account if you hold public office.</span>
        </button>
      </div>

      {role ? (
        <form className="form" onSubmit={handleSubmit} style={{animation: 'chipIn 240ms var(--cl-ease-standard)'}}>
          <div className="section-divider"/>
          <div className="field">
            <label className="field__lbl">{role === 'rep' ? 'Full name (as on ballot)' : 'Full name'}</label>
            <div className="field__row">
              <span className="field__icon"><Icon.User width="18" height="18"/></span>
              <input className="field__input" value={name} onChange={e => setName(e.target.value)}
                placeholder={role === 'rep' ? 'Your name as it appears on the ballot' : 'Your name'}/>
            </div>
          </div>

          <div className="field">
            <label className="field__lbl">Email</label>
            <div className={`field__row${isError ? ' field__row--error' : ''}`}>
              <span className="field__icon"><Icon.Mail/></span>
              <input className="field__input" type="email" value={email}
                onChange={e => setEmail(e.target.value)} placeholder="you@example.com"/>
            </div>
            {isError ? (
              <div className="field__msg field__msg--err">
                <Icon.Alert/> An account with this email already exists. Sign in instead?
              </div>
            ) : null}
          </div>

          <div className="field">
            <label className="field__lbl">Password</label>
            <div className="field__row">
              <span className="field__icon"><Icon.Lock/></span>
              <input className="field__input" type={showPwd ? 'text' : 'password'}
                value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 12 characters"/>
              <div className="field__suffix">
                <button type="button" className="field__toggle" onClick={() => setShowPwd(s => !s)}>
                  {showPwd ? <Icon.EyeOff/> : <Icon.Eye/>}
                </button>
              </div>
            </div>
            <div className="field__msg">Use 12+ characters with a mix of letters and numbers.</div>
          </div>

          {role === 'citizen' ? (
            <div className="field">
              <label className="field__lbl">City or zip code</label>
              <div className="field__row">
                <span className="field__icon"><Icon.MapPin/></span>
                <input className="field__input" value={city} onChange={e => setCity(e.target.value)}
                  placeholder="Naples, FL or 34102"/>
              </div>
              <div className="field__msg">We'll ask for your full address next to verify you for your district. You can skip and add it later.</div>
            </div>
          ) : (
            <div className="row2">
              <div className="field">
                <label className="field__lbl">Office held</label>
                <div className="field__row">
                  <span className="field__icon"><Icon.Briefcase width="18" height="18"/></span>
                  <input className="field__input" value={office} onChange={e => setOffice(e.target.value)}
                    placeholder="State senator, district 28"/>
                </div>
              </div>
              <div className="field">
                <label className="field__lbl">Verification email</label>
                <div className="field__row">
                  <span className="field__icon"><Icon.Mail/></span>
                  <input className="field__input" placeholder="name@official.gov"/>
                </div>
                <div className="field__msg">
                  Must be from your official government email.{' '}
                  <button type="button" className="field__link" style={{fontSize:'0.72rem'}}>Don't have one?</button>
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="cta" disabled={isLoading}>
            {isLoading ? <><span className="spinner"/> Creating account…</> : 'Create account'}
          </button>
        </form>
      ) : (
        <div style={{padding:'4px 0',fontSize:'0.82rem',color:'var(--cl-text-muted)',textAlign:'center'}}>
          Pick the option that fits — you can switch later.
        </div>
      )}

      <div className="secondary-action">
        Already have an account? <button type="button" onClick={() => onSwitch('signin')}>Sign in</button>
      </div>

      <div className="modal__esc"><span className="modal__kbd">esc</span> to close</div>
    </div>
  );
}

window.CreateAccountModal = CreateAccountModal;
