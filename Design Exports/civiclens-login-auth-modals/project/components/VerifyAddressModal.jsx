/* Verify Address modal */

const ADDRESS_SUGGESTIONS = [
  { main: '742 9th Ave S', sub: 'Naples, FL 34102', district: 'FL-19', city: 'Naples, FL' },
  { main: '748 9th St N', sub: 'Naples, FL 34102', district: 'FL-19', city: 'Naples, FL' },
  { main: '740 9th Ave N', sub: 'Naples, FL 34103', district: 'FL-19', city: 'Naples, FL' },
  { main: '7400 9th Ave', sub: 'Cape Coral, FL 33904', district: 'FL-19', city: 'Cape Coral, FL' },
];

function VerifyAddressModal({ initialState = 'typing', onClose, onSkip, onDone }) {
  const [query, setQuery] = React.useState(initialState === 'idle' ? '' : '742 9th');
  const [selected, setSelected] = React.useState(null); // address obj
  const [state, setState] = React.useState(initialState); // idle | typing | error | loading | success
  const [open, setOpen] = React.useState(initialState === 'typing');

  React.useEffect(() => {
    setState(initialState);
    if (initialState === 'success') setSelected(ADDRESS_SUGGESTIONS[0]);
    if (initialState === 'idle') { setQuery(''); setOpen(false); setSelected(null); }
    if (initialState === 'typing') { setQuery('742 9th'); setOpen(true); setSelected(null); }
    if (initialState === 'error') { setQuery('123 Made Up Lane'); setOpen(false); setSelected(null); }
    if (initialState === 'loading') { setSelected(ADDRESS_SUGGESTIONS[0]); setQuery('742 9th Ave S'); setOpen(false); }
  }, [initialState]);

  const liveDistrict = selected || (query.trim().length >= 3 && state !== 'error'
    ? ADDRESS_SUGGESTIONS[0]
    : null);

  const handleQuery = (v) => {
    setQuery(v);
    setSelected(null);
    setOpen(v.length >= 2);
    setState(v.length === 0 ? 'idle' : 'typing');
  };

  const pickAddress = (addr) => {
    setQuery(addr.main + ', ' + addr.sub);
    setSelected(addr);
    setOpen(false);
    setState('typing');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected) return;
    setState('loading');
    setTimeout(() => setState('success'), 1400);
    setTimeout(() => onDone && onDone(), 2400);
  };

  const isLoading = state === 'loading';
  const isError = state === 'error';
  const isSuccess = state === 'success';

  if (isSuccess) {
    return (
      <div className="modal" role="dialog" aria-labelledby="verify-title">
        <button className="modal__close" onClick={onClose} aria-label="Close"><Icon.Close/></button>
        <div className="modal__brand">
          <BrandMark/>
          <div className="modal__brand-word">CivicLens</div>
        </div>
        <div className="verify-success">
          <div className="verify-success__icon"><Icon.CheckBig/></div>
          <div className="verify-success__title">You're verified for FL-19</div>
          <div className="verify-success__sub">
            Naples, FL · 742 9th Ave S<br/>
            Taking you to your district feed…
          </div>
        </div>
        <div className="modal__esc"><span className="modal__kbd">esc</span> to close</div>
      </div>
    );
  }

  return (
    <div className="modal" role="dialog" aria-labelledby="verify-title">
      <button className="modal__close" onClick={onClose} aria-label="Close"><Icon.Close/></button>

      <div className="modal__brand">
        <BrandMark/>
        <div className="modal__brand-word">CivicLens</div>
      </div>

      <div className="modal__head">
        <h2 className="modal__title" id="verify-title">Where do you vote?</h2>
        <p className="modal__sub">We use your address to verify you for your district. We don't share it. A verification badge appears once we confirm.</p>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label className="field__lbl">Home address</label>
          <div className="autocomplete">
            <div className={`field__row${isError ? ' field__row--error' : ''}${selected ? ' field__row--success' : ''}`}>
              <span className="field__icon"><Icon.MapPin/></span>
              <input className="field__input" value={query}
                onChange={e => handleQuery(e.target.value)}
                onFocus={() => query.length >= 2 && !selected && setOpen(true)}
                placeholder="123 Main St, Naples, FL"/>
              {selected ? (
                <span className="field__check"><Icon.Check/></span>
              ) : null}
            </div>
            {open && !selected ? (
              <div className="autocomplete__list">
                {ADDRESS_SUGGESTIONS.map((a, i) => (
                  <div key={i} className={`autocomplete__row${i === 0 ? ' active' : ''}`} onClick={() => pickAddress(a)}>
                    <Icon.MapPin/>
                    <div className="autocomplete__col">
                      <div className="autocomplete__main">{a.main}</div>
                      <div className="autocomplete__sub">{a.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          {isError ? (
            <div className="field__msg field__msg--err">
              <Icon.Alert/> We couldn't find that address. Check the street and zip.
            </div>
          ) : liveDistrict ? (
            <div style={{display:'flex',alignItems:'center',gap:8,marginTop:2}}>
              <span className="field__msg field__msg--ok"><Icon.Check/> Verified for:</span>
              <span className="district-chip">
                <span className="district-chip__code">{liveDistrict.district}</span>
                {liveDistrict.city}
              </span>
            </div>
          ) : (
            <div className="field__msg">Start typing — we'll suggest matches.</div>
          )}
        </div>

        <div className="privacy">
          <span className="privacy__icon"><Icon.Shield/></span>
          <div><strong>Your address is never shown publicly.</strong> Only your district (e.g. FL-19) appears next to your comments and votes.</div>
        </div>

        <button type="submit" className="cta" disabled={isLoading || !selected}>
          {isLoading ? <><span className="spinner"/> Verifying…</> : 'Verify and continue'}
        </button>

        <div className="skip">
          <button type="button" onClick={onSkip}>I'll add this later</button>
        </div>
      </form>

      <div className="modal__esc"><span className="modal__kbd">esc</span> to close</div>
    </div>
  );
}

window.VerifyAddressModal = VerifyAddressModal;
