/* Sign In modal */

function SignInModal({ initialState = 'idle', onClose, onSwitch }) {
  const [email, setEmail] = React.useState('rep@civiclens.demo');
  const [password, setPassword] = React.useState('***REDACTED-DURING-PUBLIC-FLIP-AUDIT***');
  const [showPwd, setShowPwd] = React.useState(false);
  const [state, setState] = React.useState(initialState); // idle | loading | error
  const [emailErr, setEmailErr] = React.useState(initialState === 'error' ? '' : '');
  const [pwdErr, setPwdErr] = React.useState(initialState === 'error' ? "Email or password didn't match. Try again or reset it." : '');

  React.useEffect(() => { setState(initialState); }, [initialState]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setState('loading');
    setTimeout(() => setState('idle'), 1800);
  };

  const isLoading = state === 'loading';
  const isError = state === 'error';

  return (
    <div className="modal" role="dialog" aria-labelledby="signin-title">
      <button className="modal__close" onClick={onClose} aria-label="Close"><Icon.Close/></button>

      <div className="modal__brand">
        <BrandMark/>
        <div className="modal__brand-word">CivicLens</div>
      </div>

      <div className="modal__head">
        <h2 className="modal__title" id="signin-title">Welcome back</h2>
        <p className="modal__sub">Sign in to track reps, comment, and vote in polls.</p>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label className="field__lbl">Email</label>
          <div className={`field__row${isError ? ' field__row--error' : ''}`}>
            <span className="field__icon"><Icon.Mail/></span>
            <input className="field__input" type="email" autoComplete="email" disabled={isLoading}
              value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"/>
          </div>
        </div>

        <div className="field">
          <label className="field__lbl">Password</label>
          <div className={`field__row${isError ? ' field__row--error' : ''}`}>
            <span className="field__icon"><Icon.Lock/></span>
            <input className="field__input" type={showPwd ? 'text' : 'password'} autoComplete="current-password" disabled={isLoading}
              value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••"/>
            <div className="field__suffix">
              <button type="button" className="field__toggle" disabled={isLoading} onClick={() => setShowPwd(s => !s)}>
                {showPwd ? <Icon.EyeOff/> : <Icon.Eye/>}
                {showPwd ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {isError ? (
            <div className="field__msg field__msg--err">
              <Icon.Alert/> {pwdErr || "Email or password didn't match. Try again or reset it."}
            </div>
          ) : null}
          <div className="field__row-end">
            <button type="button" className="field__link">Forgot password?</button>
          </div>
        </div>

        <button type="submit" className="cta" disabled={isLoading}>
          {isLoading ? <><span className="spinner"/> Signing in…</> : 'Sign in'}
        </button>

        <div className="secondary-action">
          New here? <button type="button" onClick={() => onSwitch('create')}>Create an account</button>
        </div>

        <div className="demo-hint">
          Demo: <code>rep@civiclens.demo</code> / <code>***REDACTED-DURING-PUBLIC-FLIP-AUDIT***</code>
        </div>
      </form>

      <div className="modal__esc"><span className="modal__kbd">esc</span> to close</div>
    </div>
  );
}

window.SignInModal = SignInModal;
