// Screens.jsx — the five MapView screens, each rendered inside a 1000x680
// canvas frame. Wrapped by DesignCanvas in index.html.

const { useState: uS, useEffect: uE, useRef: uR, useMemo: uM } = React;

const CANVAS_W = 1000;
const CANVAS_H = 680;

// Florida sample data (used in screens 2 / 3 / popovers)
const FL_DISTRICTS_SEED = [
  { id: 'D19', code: 'FL-19', label: '19', population: '843K',
    rep: { name: 'Byron Donalds', initials: 'BD', party: 'r', tenure: 'Since 2021' },
    candidates: [
      { name: 'Byron Donalds', initials: 'BD', party: 'r' },
      { name: 'Cyndi Spray', initials: 'CS', party: 'd' },
      { name: 'Gerardo Ortiz', initials: 'GO', party: 'i' },
    ],
  },
];

// ─── SCREEN 1: National view ─────────────────────────────────
function ScreenNational() {
  const [hover, setHover] = uS(null); // {fips, name, abbr...}
  const [showParty, setShowParty] = uS(false);
  const [zoom, setZoom] = uS(100);

  return (
    <div className="mv-canvas" style={{ width: CANVAS_W, height: CANVAS_H }}>
      <BaseMap
        width={CANVAS_W} height={CANVAS_H}
        showParty={showParty}
        hoverFips={hover?.fips}
        onStateHover={(fips, f) => {
          if (!fips) { setHover(null); return; }
          const meta = STATE_META[fips] || { name: f.properties?.name || '', abbr: '' };
          setHover({ fips, ...meta });
        }}
      />
      <LegendPill>
        <span className="mv-legend__strong">United States</span>
        <span className="mv-legend__sep">·</span>
        <span className="mv-legend__num cl-num">{zoom}%</span>
        <span className="mv-legend__sep">·</span>
        <span>click a state to focus</span>
      </LegendPill>
      <PartyToggle on={showParty} onChange={setShowParty} />
      <ZoomDock percent={zoom} onChange={setZoom} onReset={() => setZoom(100)} />
    </div>
  );
}

// ─── SCREEN 2: State focused (Florida) ───────────────────────
function ScreenStateFocused() {
  const FL_FIPS = '12';
  const [hoverFips, setHoverFips] = uS(null);
  const [hoverDist, setHoverDist] = uS(null);
  const [zoom, setZoom] = uS(320);
  const [districts, setDistricts] = uS([]);

  // Build fake district overlay once topo is loaded
  const topo = useUsMap();
  uE(() => {
    if (!topo) return;
    const states = topojson.feature(topo, topo.objects.states).features;
    const fl = states.find(f => f.id === FL_FIPS);
    if (!fl) return;
    const proj = d3.geoAlbersUsa().fitSize([CANVAS_W, CANVAS_H], { type: 'FeatureCollection', features: states });
    const path = d3.geoPath(proj);
    const cells = buildFakeDistricts(fl, path, 28, proj);
    // clip cells to FL by computing svg-side; we'll use clipPath in render
    setDistricts(cells);
  }, [topo]);

  return (
    <div className="mv-canvas" style={{ width: CANVAS_W, height: CANVAS_H }}>
      <BaseMap
        width={CANVAS_W} height={CANVAS_H}
        fipsBox={FL_FIPS}
        showDistricts
        fakeDistricts={districts}
        hoverFips={hoverFips}
        hoverDistrictId={hoverDist}
        onStateHover={setHoverFips}
        onDistrictHover={setHoverDist}
      />

      <BackPill label="United States" />
      <ZoomDock percent={zoom} onChange={setZoom} onReset={() => setZoom(100)} />
    </div>
  );
}

function FlClipPath() { return null; /* unused — BaseMap handles clipping internally */ }

// ─── SCREEN 3: District focused (FL-19) ──────────────────────
function ScreenDistrictFocused() {
  const FL_FIPS = '12';
  const SELECTED = 'D19';
  const [zoom] = uS(380);
  const [districts, setDistricts] = uS([]);
  const [selDistrictGeom, setSelDistrictGeom] = uS(null);

  const topo = useUsMap();
  uE(() => {
    if (!topo) return;
    const states = topojson.feature(topo, topo.objects.states).features;
    const fl = states.find(f => f.id === FL_FIPS);
    if (!fl) return;
    const proj = d3.geoAlbersUsa().fitSize([CANVAS_W, CANVAS_H], { type: 'FeatureCollection', features: states });
    const path = d3.geoPath(proj);
    const cells = buildFakeDistricts(fl, path, 28, proj);
    // Pick the southernmost / lower-peninsula cell to stand in for FL-19
    // (Lee/Collier county area). Highest cy wins; tie-break with cx so we
    // don't drift to the southeast (Miami) tip.
    const sel = cells.reduce((best, c) => {
      const score = c.cy - c.cx * 0.15;
      return (!best || score > best.score) ? { cell: c, score } : best;
    }, null);
    setDistricts(cells);
    if (sel) {
      // The rejection-sampler already assigned some cell id "D19" — swap
      // identities so OUR chosen SW-peninsula cell becomes D19 and the
      // original D19 inherits the chosen cell's old label. This avoids
      // duplicate React keys (two cells named D19) AND the double-highlight
      // that comes from rendering two selected districts.
      const oldD19 = cells.find(c => c.id === 'D19' && c !== sel.cell);
      if (oldD19) {
        oldD19.id = sel.cell.id;
        oldD19.label = sel.cell.label;
      }
      sel.cell.id = 'D19';
      sel.cell.label = '19';
      setSelDistrictGeom(sel.cell);
    }
  }, [topo]);

  // Card position — to the upper-right of the selected district, with
  // a connector. Card lives in screen-space (post-transform), so we need
  // to project the cell's center through the BaseMap zoom transform.
  const cardPos = uM(() => {
    if (!selDistrictGeom || !topo) return null;
    const states = topojson.feature(topo, topo.objects.states).features;
    const fl = states.find(f => f.id === FL_FIPS);
    if (!fl) return null;
    const proj = d3.geoAlbersUsa().fitSize([CANVAS_W, CANVAS_H], { type: 'FeatureCollection', features: states });
    const path = d3.geoPath(proj);
    const [[x0,y0],[x1,y1]] = path.bounds(fl);
    const dx = x1 - x0, dy = y1 - y0;
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const scale = Math.min(CANVAS_W / dx, CANVAS_H / dy) * 0.72;
    const tx = CANVAS_W / 2 - scale * cx;
    const ty = CANVAS_H / 2 - scale * cy;
    // selected cell center in screen-space
    const sx = selDistrictGeom.cx * scale + tx;
    const sy = selDistrictGeom.cy * scale + ty;
    // card to upper-right
    const cardX = Math.min(CANVAS_W - 300, sx + 110);
    const cardY = Math.max(80, sy - 240);
    return { sx, sy, cardX, cardY };
  }, [selDistrictGeom, topo]);

  return (
    <div className="mv-canvas" style={{ width: CANVAS_W, height: CANVAS_H }}>
      <BaseMap
        width={CANVAS_W} height={CANVAS_H}
        fipsBox={FL_FIPS}
        showDistricts
        fakeDistricts={districts}
        selectedDistrictId={selDistrictGeom ? selDistrictGeom.id : null}
      />

      {/* Connector line from card to selected district (svg overlay) */}
      {cardPos && (
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} width={CANVAS_W} height={CANVAS_H}>
          <line
            x1={cardPos.sx} y1={cardPos.sy}
            x2={cardPos.cardX + 20} y2={cardPos.cardY + 20}
            className="mv-connector"
          />
        </svg>
      )}

      {cardPos && (
        <DistrictInfoCard
          x={cardPos.cardX} y={cardPos.cardY}
          district={FL_DISTRICTS_SEED[0]}
        />
      )}

      <BackPill label="Florida" />
      <ZoomDock percent={zoom} onChange={() => {}} />
    </div>
  );
}

// ─── SCREEN 4: Hover popover variants ────────────────────────
function ScreenPopovers() {
  // Two popovers shown statically. Left: state hover (national view).
  // Right: district hover (state view, FL-context).
  const FL_FIPS = '12';
  const [districts, setDistricts] = uS([]);
  const [splitW] = uS(CANVAS_W / 2);
  const topo = useUsMap();

  // For the left half (national w/ TX hovered), we need the projected center
  // of TX. We render two BaseMaps side-by-side via overflow clipping.

  uE(() => {
    if (!topo) return;
    const states = topojson.feature(topo, topo.objects.states).features;
    const fl = states.find(f => f.id === FL_FIPS);
    if (!fl) return;
    const proj = d3.geoAlbersUsa().fitSize([splitW, CANVAS_H], { type: 'FeatureCollection', features: states });
    const path = d3.geoPath(proj);
    setDistricts(buildFakeDistricts(fl, path, 28, proj));
  }, [topo, splitW]);

  return (
    <div className="mv-canvas" style={{ width: CANVAS_W, height: CANVAS_H, display: 'flex' }}>
      {/* LEFT: national, FL hovered */}
      <div style={{ position: 'relative', flex: 1, borderRight: '1px solid var(--cl-divider)' }}>
        <BaseMap width={splitW} height={CANVAS_H} hoverFips="12" />
        <LegendPill>
          <span className="mv-legend__strong">United States</span>
          <span className="mv-legend__sep">·</span>
          <span className="mv-legend__num cl-num">100%</span>
        </LegendPill>
        <div style={{ position: 'absolute', top: 16, right: 16, fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--cl-text-muted)' }}>
          A · State hover
        </div>
        {/* hover dot at FL center, popover above */}
        <ProjectedAnchor fips="12" projW={splitW} projH={CANVAS_H}>
          {(pt) => (
            <>
              <div className="mv-hover-dot" style={{ left: pt.x, top: pt.y }} />
              <StatePopover
                x={pt.x} y={pt.y - 4}
                state={STATE_META['12']}
                side="above"
              />
            </>
          )}
        </ProjectedAnchor>
      </div>

      {/* RIGHT: state-focused FL, district hovered */}
      <div style={{ position: 'relative', flex: 1 }}>
        <BaseMap
          width={splitW} height={CANVAS_H}
          fipsBox={FL_FIPS}
          showDistricts
          fakeDistricts={districts}
          hoverDistrictId="D19"
        />
        <BackPill label="Florida" />
        <div style={{ position: 'absolute', top: 16, right: 16, fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--cl-text-muted)' }}>
          B · District hover
        </div>
        <FocusedDistrictAnchor districts={districts} fips={FL_FIPS} projW={splitW} projH={CANVAS_H} districtId="D19">
          {(pt) => (
            <>
              <div className="mv-hover-dot" style={{ left: pt.x, top: pt.y }} />
              <DistrictPopover
                x={pt.x} y={pt.y - 4}
                side="above"
                district={{
                  code: 'FL-19',
                  rep: { name: 'Byron Donalds', initials: 'BD', party: 'r' },
                }}
              />
            </>
          )}
        </FocusedDistrictAnchor>
      </div>
    </div>
  );
}

// helpers that compute projected coords for a state's center
function ProjectedAnchor({ fips, projW, projH, children }) {
  const topo = useUsMap();
  if (!topo) return null;
  const states = topojson.feature(topo, topo.objects.states).features;
  const f = states.find(s => s.id === fips);
  if (!f) return null;
  const proj = d3.geoAlbersUsa().fitSize([projW, projH], { type: 'FeatureCollection', features: states });
  const path = d3.geoPath(proj);
  const c = path.centroid(f);
  return children({ x: c[0], y: c[1] });
}

function FocusedDistrictAnchor({ districts, fips, projW, projH, districtId, children }) {
  const topo = useUsMap();
  if (!topo || !districts.length) return null;
  const states = topojson.feature(topo, topo.objects.states).features;
  const fl = states.find(s => s.id === fips);
  if (!fl) return null;
  const proj = d3.geoAlbersUsa().fitSize([projW, projH], { type: 'FeatureCollection', features: states });
  const path = d3.geoPath(proj);
  const [[x0,y0],[x1,y1]] = path.bounds(fl);
  const dx = x1 - x0, dy = y1 - y0;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const scale = Math.min(projW / dx, projH / dy) * 0.72;
  const tx = projW / 2 - scale * cx;
  const ty = projH / 2 - scale * cy;
  const cell = districts.find(c => c.id === districtId) || districts[Math.floor(districts.length / 2)];
  if (!cell) return null;
  return children({ x: cell.cx * scale + tx, y: cell.cy * scale + ty });
}

// ─── SCREEN 5: Markers + status states ───────────────────────
function ScreenMarkers() {
  return (
    <div className="mv-canvas" style={{ width: CANVAS_W, height: CANVAS_H, background: 'var(--cl-bg)', overflowY: 'auto' }}>
      <div style={{ padding: '24px 24px 8px' }}>
        <div className="cl-eyebrow" style={{ marginBottom: 4 }}>Marker vocabulary</div>
        <div style={{ fontSize: 'var(--cl-text-sm)', color: 'var(--cl-text-light)' }}>
          Used for events, offices, and polling places when a layer is enabled.
        </div>
      </div>
      <div className="mv-spec-grid">
        <div className="mv-spec">
          <Marker kind="office" />
          <div className="mv-spec__name">A · Office</div>
          <div className="mv-spec__desc">Phosphor building duotone</div>
        </div>
        <div className="mv-spec">
          <Marker kind="event" />
          <div className="mv-spec__name">B · Event</div>
          <div className="mv-spec__desc">Phosphor calendar duotone</div>
        </div>
        <div className="mv-spec">
          <Marker kind="polling" />
          <div className="mv-spec__name">C · Polling place</div>
          <div className="mv-spec__desc">Phosphor map-pin duotone</div>
        </div>
        <div className="mv-spec">
          <Marker kind="cluster" count={12} />
          <div className="mv-spec__name">D · Cluster</div>
          <div className="mv-spec__desc">.cl-num count, navy fill</div>
        </div>
        <div className="mv-spec">
          <Marker kind="event" selected />
          <div className="mv-spec__name">E · Selected</div>
          <div className="mv-spec__desc">Larger w/ ring + elevation</div>
        </div>
      </div>

      <div style={{ padding: '0 24px 8px' }}>
        <div className="cl-eyebrow" style={{ marginBottom: 4 }}>Map-level states</div>
      </div>

      <div className="mv-status-grid">
        <div className="mv-status-tile">
          <span className="mv-status-tile__label">Loading</span>
          <LoadingState />
        </div>
        <div className="mv-status-tile">
          <span className="mv-status-tile__label">Error</span>
          <ErrorState />
        </div>
        <div className="mv-status-tile">
          <span className="mv-status-tile__label">Empty (no data for scope)</span>
          {/* Render a dimmed FL with the floating "no data" card */}
          <EmptyMiniMap />
        </div>
      </div>
    </div>
  );
}

function EmptyMiniMap() {
  // Mini tile is 300x230; BaseMap re-fits its projection from its width/height
  // props, so passing matching dimensions keeps FL's outline inside the tile.
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <BaseMap width={300} height={230} fipsBox="12" showDistricts={false} />
      <div style={{ position: 'absolute', top: 36, left: 12, right: 12, background: 'white', border: '1px solid var(--cl-border)', borderRadius: 10, padding: 10, boxShadow: '0 6px 18px rgba(0,0,0,0.10)', fontFamily: 'var(--cl-font-sans)' }}>
        <div style={{ fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.06em', color: 'var(--cl-text-muted)', textTransform: 'uppercase' }}>FL-19 · No data</div>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--cl-text)', marginTop: 4 }}>Nothing on the ballot here yet</div>
        <div style={{ fontSize: '0.7rem', color: 'var(--cl-text-light)', marginTop: 3, lineHeight: 1.4 }}>
          We don't have current rep or 2026 candidate data for this district.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ScreenNational, ScreenStateFocused, ScreenDistrictFocused,
  ScreenPopovers, ScreenMarkers, CANVAS_W, CANVAS_H,
});
