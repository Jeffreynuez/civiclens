/* PostComposer — owner-only. Body, poll builder, scope, timer, presentation, image strip.
   Layout follows the Phase-1.5 reference: write-a-post block stacked over a separate
   poll block; close-time is a radio group with three modes. */

const SCOPE_OPTS = [
  { id: 'country',  label: 'Country' },
  { id: 'state',    label: 'State' },
  { id: 'district', label: 'District' },
];
const SCOPE_HINT = {
  country:  'Anyone in the U.S. — broadest reach.',
  state:    'Citizens in your state — viewers see state counts first.',
  district: 'Citizens in your district — viewers will see these counts first.',
};
const PRESENTATIONS = [
  { id: 'full',                label: 'Full view',         hint: 'Bars + percentages visible to everyone' },
  { id: 'hidden',              label: 'Hidden',            hint: 'No counts shown — owner-only insight' },
  { id: 'reveal_after_close',  label: 'Reveal after close', hint: 'Citizens vote blind; counts unveil at close' },
];

function FieldEyebrow({ children }) {
  return <div className="cl-eyebrow" style={{ marginBottom: 8 }}>{children}</div>;
}

function PostComposer({ onPublish }) {
  const [body, setBody] = React.useState('');
  const [pollOpen, setPollOpen] = React.useState(false);
  const [pollQ, setPollQ] = React.useState('');
  const [opts, setOpts] = React.useState(['', '']);
  const [scope, setScope] = React.useState('district');
  const [closeMode, setCloseMode] = React.useState('none');     // 'none' | 'after' | 'on'
  const [afterN, setAfterN] = React.useState(24);
  const [afterUnit, setAfterUnit] = React.useState('hours');     // 'minutes' | 'hours'
  const [onDate, setOnDate] = React.useState('');
  const [pres, setPres] = React.useState('full');
  const [images, setImages] = React.useState([]);

  const setOpt = (i, v) => setOpts(arr => arr.map((x, idx) => idx === i ? v : x));
  const addOpt = () => opts.length < 6 && setOpts([...opts, '']);
  const rmOpt  = i => opts.length > 2 && setOpts(opts.filter((_, idx) => idx !== i));

  const addImage = () => images.length < 5 && setImages([...images, { id: Date.now() + Math.random(), seed: Math.floor(Math.random() * 1000) }]);
  const rmImage = id => setImages(images.filter(x => x.id !== id));

  const filledOpts = opts.filter(o => o.trim().length > 0);
  const canPublish = body.trim().length > 0 && (!pollOpen || (pollQ.trim().length > 0 && filledOpts.length >= 2));

  const closeLabel = () => {
    if (closeMode === 'none') return 'Open indefinitely';
    if (closeMode === 'after') return `${afterN} ${afterUnit}`;
    if (closeMode === 'on' && onDate) {
      const d = new Date(onDate);
      return `Closes ${d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`;
    }
    return 'Open indefinitely';
  };

  const clear = () => {
    setBody(''); setPollOpen(false); setPollQ(''); setOpts(['', '']);
    setImages([]); setCloseMode('none'); setAfterN(24); setAfterUnit('hours'); setOnDate('');
    setScope('district'); setPres('full');
  };

  const publish = () => {
    if (!canPublish) return;
    onPublish({
      body,
      images: images.length,
      poll: pollOpen ? {
        question: pollQ,
        options: filledOpts.map((label, i) => ({ id: `n${i}`, label, votes: 0, mine: false })),
        scope, mode: pres,
        closesIn: closeLabel(),
        totalVotes: 0,
      } : null,
    });
    clear();
  };

  return (
    <section className="cl-composer cl-composer--v2" aria-label="New post">
      {/* ─── Write a post ─────────────────────────────────── */}
      <div>
        <FieldEyebrow>Write a post</FieldEyebrow>
        <textarea
          placeholder="Share an update with your constituents…"
          value={body}
          onChange={e => setBody(e.target.value)}
          maxLength={5000}
        />
        <div className="cl-composer__meta">
          <span className="cl-composer__count cl-num">{body.length}/5000</span>
          <span className="cl-spacer" />
          <button className="cl-composer__link" onClick={addImage} disabled={images.length >= 5}>+ Add images{images.length ? ` (${images.length}/5)` : ''}</button>
          <button className="cl-composer__link" onClick={() => setPollOpen(o => !o)}>
            {pollOpen ? '× Remove poll' : '+ Add poll'}
          </button>
        </div>
        {images.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {images.map(img => (
              <div key={img.id} style={{ position: 'relative', width: 72, height: 72, borderRadius: 8, background: `hsl(${img.seed % 360}, 40%, 88%)`, border: '1px solid var(--cl-border)' }}>
                <button onClick={() => rmImage(img.id)} aria-label="Remove image"
                  style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: 999, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', fontSize: 11, cursor: 'pointer', lineHeight: 1 }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Poll block (separate card) ─────────────────────────────────── */}
      {pollOpen && (
        <div className="cl-poll-builder">
          <input
            className="cl-poll-builder__q"
            placeholder="Poll question (e.g. How should we vote on H.R. 9999?)"
            value={pollQ}
            onChange={e => setPollQ(e.target.value)}
          />
          <div className="cl-poll-builder__opts">
            {opts.map((v, i) => (
              <div key={i} style={{ display: 'flex', gap: 6 }}>
                <input
                  className="cl-poll-builder__opt"
                  value={v} onChange={e => setOpt(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                />
                {opts.length > 2 && (
                  <button className="cl-composer__link cl-composer__link--ghost" onClick={() => rmOpt(i)} aria-label="Remove option">remove</button>
                )}
              </div>
            ))}
          </div>
          {opts.length < 6 && (
            <button className="cl-composer__link" style={{ alignSelf: 'flex-start' }} onClick={addOpt}>+ Add option</button>
          )}

          <div className="cl-poll-builder__hr" />

          {/* DEFAULT VISIBILITY */}
          <FieldEyebrow>Default visibility</FieldEyebrow>
          <div className="cl-scope__rail">
            {SCOPE_OPTS.map(s => (
              <button key={s.id} className={`cl-chip ${scope === s.id ? 'active' : ''}`} onClick={() => setScope(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
          <div className="cl-poll-builder__hint">{SCOPE_HINT[scope]}</div>

          <div className="cl-poll-builder__hr" />

          {/* WHEN DOES THIS POLL CLOSE? */}
          <FieldEyebrow>When does this poll close?</FieldEyebrow>
          <div className="cl-radiogroup">
            <label className="cl-radio">
              <input type="radio" name="closeMode" checked={closeMode === 'none'} onChange={() => setCloseMode('none')} />
              <span>No close time — stays open indefinitely</span>
            </label>
            <label className="cl-radio">
              <input type="radio" name="closeMode" checked={closeMode === 'after'} onChange={() => setCloseMode('after')} />
              <span>After</span>
              <input
                type="number" min={1} max={999}
                className="cl-radio__num"
                value={afterN}
                onChange={e => { setAfterN(Number(e.target.value) || 1); setCloseMode('after'); }}
              />
              <select
                className="cl-radio__sel"
                value={afterUnit}
                onChange={e => { setAfterUnit(e.target.value); setCloseMode('after'); }}>
                <option value="minutes">minutes</option>
                <option value="hours">hours</option>
                <option value="days">days</option>
              </select>
            </label>
            <label className="cl-radio">
              <input type="radio" name="closeMode" checked={closeMode === 'on'} onChange={() => setCloseMode('on')} />
              <span>On</span>
              <input
                type="datetime-local"
                className="cl-radio__date"
                value={onDate}
                onChange={e => { setOnDate(e.target.value); setCloseMode('on'); }}
                placeholder="mm/dd/yyyy --:-- --"
              />
            </label>
          </div>

          <div className="cl-poll-builder__hr" />

          {/* HOW SHOULD RESULTS BE SHOWN? */}
          <FieldEyebrow>How should results be shown?</FieldEyebrow>
          <div className="cl-scope__rail">
            {PRESENTATIONS.map(p => (
              <button key={p.id} className={`cl-chip ${pres === p.id ? 'active' : ''}`} onClick={() => setPres(p.id)}>
                {p.label}
              </button>
            ))}
          </div>
          <div className="cl-poll-builder__hint">{PRESENTATIONS.find(p => p.id === pres).hint}</div>
        </div>
      )}

      {/* ─── Footer actions ─────────────────────────────────── */}
      <div className="cl-composer__footer">
        <span style={{ fontSize: 'var(--cl-text-xs)', color: 'var(--cl-text-muted)' }}>JPEG · PNG · WebP · 5 MB max each</span>
        <span className="cl-spacer" />
        <button className="cl-btn cl-btn--ghost" onClick={clear} disabled={!body && !pollOpen && images.length === 0}>Clear</button>
        <button className="cl-btn cl-btn--primary" onClick={publish} disabled={!canPublish}>Publish</button>
      </div>
    </section>
  );
}

window.PostComposer = PostComposer;
