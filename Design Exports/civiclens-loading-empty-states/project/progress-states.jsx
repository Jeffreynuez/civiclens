/* Section 4 — Progress states (image upload + vote-in-flight) */

function UploadRing({ pct, size = 76, stroke = 5 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke="rgba(255,255,255,0.25)" strokeWidth={stroke} fill="none"
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke="#40916c" strokeWidth={stroke} fill="none"
        strokeDasharray={c} strokeDashoffset={off}
        strokeLinecap="butt"
        style={{
          transformOrigin: '50% 50%',
          transform: 'rotate(-90deg)',
          transition: 'stroke-dashoffset 220ms cubic-bezier(0.2, 0, 0, 1)',
        }}
      />
      <text
        x="50%" y="50%"
        textAnchor="middle" dominantBaseline="central"
        fill="#fff" fontSize="15" fontWeight="700"
        fontFamily="var(--cl-font-sans)"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {pct}%
      </text>
    </svg>
  );
}

function ImageUploadProgress() {
  // Three static frames progressing low-to-high, plus a label of which image in the batch.
  const frames = [
    { pct: 25, idx: 1, total: 5 },
    { pct: 60, idx: 3, total: 5 },
    { pct: 95, idx: 5, total: 5 },
  ];

  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'flex-end', justifyContent: 'center', flexWrap: 'wrap' }}>
      {frames.map((f, i) => (
        <div key={i} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="cl-upload" style={{ width: 150, height: 150 }}>
            <div className="cl-upload__overlay">
              <UploadRing pct={f.pct} size={64} stroke={4.5} />
            </div>
          </div>
          <span className="cl-upload__caption">
            Uploading image {f.idx} of {f.total}…
          </span>
        </div>
      ))}
    </div>
  );
}

/* Vote-in-flight pill — three-state animation */
function VoteInFlight() {
  // states: idle → inflight → voted → (replay) idle
  const [state, setState] = React.useState('idle');

  const trigger = React.useCallback(() => {
    setState('inflight');
    setTimeout(() => setState('voted'), 600);
  }, []);

  // auto-loop the demo so the canvas always has motion
  React.useEffect(() => {
    if (state === 'voted') {
      const id = setTimeout(() => setState('idle'), 1600);
      return () => clearTimeout(id);
    }
    if (state === 'idle') {
      const id = setTimeout(() => trigger(), 1200);
      return () => clearTimeout(id);
    }
  }, [state, trigger]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        {state === 'idle' && (
          <button className="cl-vote-pill cl-vote-pill--idle" onClick={trigger}>
            Vote — Yes
          </button>
        )}
        {state === 'inflight' && (
          <button className="cl-vote-pill cl-vote-pill--inflight" disabled>
            <span className="cl-spinner cl-spinner--mini" /> Recording your vote…
          </button>
        )}
        {state === 'voted' && (
          <button className="cl-vote-pill cl-vote-pill--voted" disabled>
            <window.Icon.Check size={14} /> Voted
          </button>
        )}
        <span style={{ fontSize: 'var(--cl-text-xs)', color: 'var(--cl-text-muted)' }}>
          {state === 'idle' && '— idle'}
          {state === 'inflight' && '— ~600ms inflight'}
          {state === 'voted' && '— confirmed'}
        </span>
      </div>
      <p className="annot" style={{ maxWidth: 360, margin: 0 }}>
        <strong>Three frames in 600ms.</strong> The pill itself stays exactly the same
        width across all three states so the page doesn’t jump — only the label,
        glyph, and color tween.
      </p>
    </div>
  );
}

window.ImageUploadProgress = ImageUploadProgress;
window.VoteInFlight = VoteInFlight;
