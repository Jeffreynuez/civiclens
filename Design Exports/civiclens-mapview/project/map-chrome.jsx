// MapChrome.jsx — non-map chrome: legend, back pill, party toggle, zoom dock,
// hover popover, district info card, marker, status overlays.

const { useState: useStateMC } = React;

function LegendPill({ children }) {
  return <div className="mv-pill mv-legend">{children}</div>;
}

function BackPill({ label, onClick }) {
  return (
    <button className="mv-pill mv-back" onClick={onClick}>
      <Icon.ArrowLeft size={14} />
      <span>{label}</span>
    </button>
  );
}

function PartyToggle({ on, onChange }) {
  return (
    <button
      className={'mv-pill mv-toggle' + (on ? ' is-on' : '')}
      onClick={() => onChange && onChange(!on)}
    >
      <span>Show party makeup</span>
      <span className="mv-toggle__sw" />
    </button>
  );
}

function ZoomDock({ percent = 100, min = 50, max = 600, onChange, onReset }) {
  // Map percent → vertical position. Higher percent = higher thumb.
  const trackHeight = 92;
  const norm = (Math.max(min, Math.min(max, percent)) - min) / (max - min);
  const fillPct = norm * 100;

  return (
    <div className="mv-pill mv-zoom">
      <button className="mv-zoom__btn" onClick={() => onChange && onChange(Math.min(max, percent + 25))} aria-label="Zoom in">
        <Icon.Plus />
      </button>
      <div className="mv-zoom__pct cl-num">{percent}%</div>
      <div className="mv-zoom__slider">
        <div className="mv-zoom__track-fill" style={{ height: fillPct + '%' }} />
        <div className="mv-zoom__thumb" style={{ bottom: fillPct + '%' }} />
      </div>
      <button className="mv-zoom__btn" onClick={() => onChange && onChange(Math.max(min, percent - 25))} aria-label="Zoom out">
        <Icon.Minus />
      </button>
      <div className="mv-zoom__divider" />
      <button className="mv-zoom__reset" onClick={onReset}>Reset</button>
    </div>
  );
}

// ─── Hover popovers ──────────────────────────────────────────
function StatePopover({ x, y, side = 'above', state }) {
  const style = { left: x, top: y, transform: side === 'above' ? 'translate(-50%, calc(-100% - 14px))' : 'translate(-50%, 14px)' };
  return (
    <div className="mv-pop" style={{ ...style, width: 240 }}>
      <span className={'mv-pop__caret ' + (side === 'above' ? 'above' : 'below')}
            style={{ left: '50%', marginLeft: -5 }} />
      <div className="mv-pop__hdr">
        <span className="mv-pop__name">{state.name}</span>
        <span className="mv-pop__code cl-num">{state.abbr}</span>
        <span className="mv-pop__flag">{state.flag || ''}</span>
      </div>
      <div className="mv-pop__seats cl-num">
        <strong style={{ color: 'var(--cl-text)' }}>{state.house}</strong> House seats · <strong style={{ color: 'var(--cl-text)' }}>{state.sen}</strong> senators
      </div>
      {state.sens && state.sens.map((s, i) => (
        <div key={i} className="mv-pop__row">
          <span className="mv-pop__role">Sen</span>
          <span className="mv-pop__person">{s.name}</span>
          <span className={'mv-pchip mv-pchip--' + s.party}>{s.party.toUpperCase()}</span>
        </div>
      ))}
      {state.gov && (
        <div className="mv-pop__row">
          <span className="mv-pop__role">Gov</span>
          <span className="mv-pop__person">{state.gov.name}</span>
          <span className={'mv-pchip mv-pchip--' + state.gov.party}>{state.gov.party.toUpperCase()}</span>
        </div>
      )}
      <div className="mv-pop__cta">
        <span>Click to focus</span>
        <Icon.ChevronRight />
      </div>
    </div>
  );
}

function DistrictPopover({ x, y, side = 'above', district }) {
  const style = { left: x, top: y, transform: side === 'above' ? 'translate(-50%, calc(-100% - 14px))' : 'translate(-50%, 14px)' };
  return (
    <div className="mv-pop" style={{ ...style, width: 200 }}>
      <span className={'mv-pop__caret ' + (side === 'above' ? 'above' : 'below')}
            style={{ left: '50%', marginLeft: -5 }} />
      <div className="mv-pop__hdr">
        <span className="mv-pop__name cl-num">{district.code}</span>
      </div>
      <div className="mv-pop__row" style={{ paddingTop: 0 }}>
        <span className="mv-avatar">{district.rep.initials}</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <span style={{ fontSize: 'var(--cl-text-xs)', fontWeight: 700, color: 'var(--cl-text)' }}>{district.rep.name}</span>
          <span className={'mv-pchip mv-pchip--' + district.rep.party} style={{ alignSelf: 'flex-start' }}>{district.rep.party.toUpperCase()}</span>
        </div>
      </div>
      <div className="mv-pop__cta">
        <span>Click to focus</span>
        <Icon.ChevronRight />
      </div>
    </div>
  );
}

// ─── District info card (Screen 3) ───────────────────────────
function DistrictInfoCard({ x, y, district }) {
  return (
    <div className="mv-dcard" style={{ left: x, top: y }}>
      <div className="mv-dcard__hdr">
        <div className="mv-dcard__code cl-num">{district.code}</div>
        <div className="mv-dcard__pop cl-num">~{district.population} pop.</div>
      </div>
      <div className="mv-dcard__rep">
        <span className="mv-avatar mv-avatar--lg">{district.rep.initials}</span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="mv-dcard__repname">{district.rep.name}</div>
          <div className="mv-dcard__repmeta">
            <span className={'mv-pchip mv-pchip--' + district.rep.party}>{district.rep.party.toUpperCase()}</span>
            <span>·</span>
            <span>{district.rep.tenure}</span>
          </div>
        </div>
        <a className="mv-dcard__profile" href="#">View profile <Icon.ChevronRight /></a>
      </div>
      <div className="mv-dcard__eyebrow">2026 candidates · on ballot</div>
      <div className="mv-dcard__candidates">
        {district.candidates.map((c, i) => (
          <div key={i} className="mv-dcand">
            <span className="mv-avatar" style={{ width: 18, height: 18, fontSize: '0.55rem' }}>{c.initials}</span>
            <span className="mv-dcand__name">{c.name}</span>
            <span className={'mv-pchip mv-pchip--' + c.party}>{c.party.toUpperCase()}</span>
            <span className="mv-dcand__badge">On ballot</span>
          </div>
        ))}
      </div>
      <a className="mv-dcard__feed" href="#">View district feed →</a>
    </div>
  );
}

// ─── Markers ─────────────────────────────────────────────────
function Marker({ kind, count, selected, style }) {
  let cls = 'mv-marker';
  if (selected) cls += ' mv-marker--selected';
  if (kind === 'cluster') cls += ' mv-marker--cluster';
  return (
    <div className={cls} style={style}>
      {kind === 'office' && <Icon.Building />}
      {kind === 'event' && <Icon.Calendar />}
      {kind === 'polling' && <Icon.MapPin />}
      {kind === 'cluster' && <span className="cl-num">{count}</span>}
    </div>
  );
}

// ─── Status overlays ─────────────────────────────────────────
// US silhouette pulled from us-atlas TopoJSON (real outline, not a hand path).
function UsSilhouette({ width = 480, height = 240, fill = '#e9ecef', stroke = null }) {
  const topo = useUsMap();
  if (!topo) return <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} />;
  const nation = topojson.feature(topo, topo.objects.nation);
  const proj = d3.geoAlbersUsa().fitSize([width - 16, height - 16], nation);
  const path = d3.geoPath(proj);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <g transform="translate(8, 8)">
        <path d={path(nation)} fill={fill} stroke={stroke || 'none'} strokeWidth={stroke ? 1 : 0} />
      </g>
    </svg>
  );
}

function LoadingState({ caption = 'Loading map…' }) {
  return (
    <div className="mv-status">
      <div className="mv-shimmer" style={{ borderRadius: 8 }}>
        <UsSilhouette width={460} height={230} fill="#e9ecef" />
      </div>
      <div className="mv-status__caption">{caption}</div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="mv-status">
      <div style={{ position: 'relative' }}>
        <UsSilhouette width={460} height={230} fill="#dee2e6" stroke="#ced4da" />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 52, height: 52, borderRadius: 999, background: 'white', border: '2px solid var(--cl-warning-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cl-warning-deep)' }}>
          <Icon.WarningCircle />
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div className="mv-status__title">Couldn't load the map</div>
        <div className="mv-status__copy" style={{ marginTop: 4 }}>Check your connection and try again.</div>
      </div>
      <button style={{ background: 'var(--cl-accent)', color: 'white', padding: '8px 18px', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '0.82rem', fontFamily: 'var(--cl-font-sans)', cursor: 'pointer' }}>Retry</button>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 5 }}>
      <div style={{ background: 'white', border: '1px solid var(--cl-border)', borderRadius: 12, padding: 14, width: 280, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontFamily: 'var(--cl-font-sans)' }}>
        <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.06em', color: 'var(--cl-text-muted)', textTransform: 'uppercase' }}>FL-19 · No data</div>
        <div style={{ fontSize: 'var(--cl-text-sm)', fontWeight: 700, color: 'var(--cl-text)', marginTop: 6 }}>Nothing on the ballot here yet</div>
        <div style={{ fontSize: 'var(--cl-text-xs)', color: 'var(--cl-text-light)', marginTop: 4, lineHeight: 1.45 }}>
          We don't have current rep or 2026 candidate data for this district. Try another district, or check back closer to the filing deadline.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  LegendPill, BackPill, PartyToggle, ZoomDock,
  StatePopover, DistrictPopover, DistrictInfoCard,
  Marker, LoadingState, ErrorState, EmptyState,
});
