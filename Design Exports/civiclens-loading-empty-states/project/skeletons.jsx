/* Section 1 — Loading patterns. Skeletons + inline spinner. */

function CardSkeleton({ withThumb = false }) {
  return (
    <div className="skel-card" aria-busy="true" aria-label="Loading post">
      <div className="skel-card__hdr">
        <div className="skel skel--circle" style={{ width: 40, height: 40 }} />
        <div className="skel-card__hdr-text">
          <div className="skel" style={{ width: '60%', height: 12 }} />
          <div className="skel" style={{ width: '40%', height: 10 }} />
        </div>
      </div>
      <div className="skel-card__body">
        <div className="skel" style={{ width: '100%', height: 11 }} />
        <div className="skel" style={{ width: '95%',  height: 11 }} />
        <div className="skel" style={{ width: '70%',  height: 11 }} />
      </div>
      {withThumb && <div className="skel-card__thumb" />}
      <div className="skel-card__footer">
        <div className="skel skel--rect" style={{ width: 64, height: 22 }} />
        <div className="skel skel--rect" style={{ width: 64, height: 22 }} />
        <div className="skel skel--rect" style={{ width: 96, height: 22, marginLeft: 'auto' }} />
      </div>
    </div>
  );
}

function AbbreviatedSkeleton() {
  // shorter version used in lists — no thumb, only 2 body lines
  return (
    <div className="skel-card">
      <div className="skel-card__hdr">
        <div className="skel skel--circle" style={{ width: 36, height: 36 }} />
        <div className="skel-card__hdr-text">
          <div className="skel" style={{ width: '55%', height: 11 }} />
          <div className="skel" style={{ width: '35%', height: 9 }} />
        </div>
      </div>
      <div className="skel-card__body">
        <div className="skel" style={{ width: '100%', height: 10 }} />
        <div className="skel" style={{ width: '80%',  height: 10 }} />
      </div>
    </div>
  );
}

function ListSkeleton() {
  const opacities = [1, 0.9, 0.8, 0.7];
  return (
    <div className="skel-list" aria-busy="true" aria-label="Loading list">
      {opacities.map((o, i) => (
        <div key={i} style={{ opacity: o }}>
          <AbbreviatedSkeleton />
        </div>
      ))}
    </div>
  );
}

/* Inline spinner — three usages */
function InlineSpinnerDemo() {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    // loop the demo so it's always visible on the canvas
    const id = setInterval(() => setLoading(l => !l), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div>
        <div className="ab__caption">Inside a button — replaces label, disabled</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className={loading ? 'cl-btn cl-btn--loading' : 'cl-btn cl-btn--primary'}
            disabled={loading}
            onClick={() => setLoading(true)}
          >
            {loading
              ? <><span className="cl-spinner cl-spinner--on-accent" /> Publishing…</>
              : 'Publish post'}
          </button>
          <button
            className={loading ? 'cl-btn cl-btn--loading' : 'cl-btn cl-btn--primary'}
            disabled={loading}
          >
            {loading
              ? <><span className="cl-spinner cl-spinner--on-accent" /> Tracking…</>
              : 'Track rep'}
          </button>
          <button className="cl-btn cl-btn--secondary" disabled>
            <span className="cl-spinner" /> Following…
          </button>
        </div>
        <p className="ab__sub">
          Label is replaced — never appended. Disabled state prevents double-submit.
          Border tint shifts to <code>rgba(255,255,255,0.32)</code> when on the green fill;
          neutral track on white surfaces.
        </p>
      </div>

      <div>
        <div className="ab__caption">Standalone — small async refreshes</div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--cl-text-sm)', color: 'var(--cl-text-light)' }}>
            <span className="cl-spinner" /> Refreshing feed…
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--cl-text-sm)', color: 'var(--cl-text-light)' }}>
            <span className="cl-spinner" /> Tallying votes
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--cl-text-xs)', color: 'var(--cl-text-muted)' }}>
            <span className="cl-spinner cl-spinner--mini" /> auto-saving
          </span>
        </div>
      </div>
    </div>
  );
}

window.CardSkeleton = CardSkeleton;
window.ListSkeleton = ListSkeleton;
window.InlineSpinnerDemo = InlineSpinnerDemo;
