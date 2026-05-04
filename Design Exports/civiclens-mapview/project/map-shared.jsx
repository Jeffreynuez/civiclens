// MapShared.jsx — D3 map renderer + reusable bits.
// Loads the us-atlas TopoJSON once, exposes hooks for state/district paths.

const { useEffect, useRef, useState, useMemo } = React;

// ─── Phosphor duotone icons (inline) ───────────────────────────
const Icon = {
  Plus: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none"><path d="M5 12h14M12 5v14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square"/></svg>
  ),
  Minus: () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none"><path d="M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square"/></svg>
  ),
  ArrowLeft: ({ size = 14 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
      <path d="M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"/>
    </svg>
  ),
  Building: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="rgba(255,255,255,0.28)"/>
      <path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <rect x="3" y="5" width="18" height="16" rx="1" stroke="currentColor" strokeWidth="2" fill="rgba(255,255,255,0.28)"/>
      <path d="M3 10h18" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
    </svg>
  ),
  MapPin: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <path d="M12 2C7.6 2 4 5.6 4 10c0 6 8 12 8 12s8-6 8-12c0-4.4-3.6-8-8-8z" stroke="currentColor" strokeWidth="2" fill="rgba(255,255,255,0.28)" strokeLinejoin="miter"/>
      <circle cx="12" cy="10" r="2.5" fill="currentColor"/>
    </svg>
  ),
  WarningCircle: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="rgba(255,186,8,0.18)"/>
      <path d="M12 7v6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square"/>
      <circle cx="12" cy="17" r="1.2" fill="currentColor"/>
    </svg>
  ),
  ChevronRight: ({ size = 12 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"/>
    </svg>
  ),
};

// ─── US TopoJSON loader (cached) ──────────────────────────────
let _topoPromise = null;
function loadUsTopo() {
  if (!_topoPromise) {
    _topoPromise = fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
      .then(r => r.json());
  }
  return _topoPromise;
}

// FIPS → state metadata for the few we need to seed (popovers, party color)
const STATE_META = {
  '12': { abbr: 'FL', name: 'Florida', house: 28, sen: 2, gov: { name: 'Ron DeSantis', party: 'r' }, sens: [{name:'Ashley Moody',party:'r'},{name:'Rick Scott',party:'r'}], party: 'r' },
  '06': { abbr: 'CA', name: 'California', flag: '🐻', house: 52, sen: 2, gov: { name: 'Gavin Newsom', party: 'd' }, sens: [{name:'Alex Padilla',party:'d'},{name:'Adam Schiff',party:'d'}], party: 'd' },
  '48': { abbr: 'TX', name: 'Texas', house: 38, sen: 2, party: 'r' },
  '36': { abbr: 'NY', name: 'New York', house: 26, sen: 2, party: 'd' },
  '17': { abbr: 'IL', name: 'Illinois', house: 17, sen: 2, party: 'd' },
  '13': { abbr: 'GA', name: 'Georgia', house: 14, sen: 2, party: 'split' },
  '42': { abbr: 'PA', name: 'Pennsylvania', house: 17, sen: 2, party: 'split' },
  '04': { abbr: 'AZ', name: 'Arizona', house: 9, sen: 2, party: 'split' },
  '37': { abbr: 'NC', name: 'North Carolina', house: 14, sen: 2, party: 'r' },
  '39': { abbr: 'OH', name: 'Ohio', house: 15, sen: 2, party: 'r' },
  '26': { abbr: 'MI', name: 'Michigan', house: 13, sen: 2, party: 'd' },
  '53': { abbr: 'WA', name: 'Washington', house: 10, sen: 2, party: 'd' },
  '51': { abbr: 'VA', name: 'Virginia', house: 11, sen: 2, party: 'd' },
  '25': { abbr: 'MA', name: 'Massachusetts', house: 9, sen: 2, party: 'd' },
  '34': { abbr: 'NJ', name: 'New Jersey', house: 12, sen: 2, party: 'd' },
  '08': { abbr: 'CO', name: 'Colorado', house: 8, sen: 2, party: 'd' },
  '47': { abbr: 'TN', name: 'Tennessee', house: 9, sen: 2, party: 'r' },
  '01': { abbr: 'AL', name: 'Alabama', house: 7, sen: 2, party: 'r' },
  '45': { abbr: 'SC', name: 'South Carolina', house: 7, sen: 2, party: 'r' },
  '21': { abbr: 'KY', name: 'Kentucky', house: 6, sen: 2, party: 'r' },
  '24': { abbr: 'MD', name: 'Maryland', house: 8, sen: 2, party: 'd' },
};
function defaultPartyForFips(fips) {
  return STATE_META[fips]?.party || (
    // crude fallback colorings so the toggle reads visually
    ['02','16','19','20','22','27','28','29','31','38','40','46','49','54','55','56'].includes(fips) ? 'r' :
    ['09','11','15','23','33','41','44','50'].includes(fips) ? 'd' :
    ['30','32','35'].includes(fips) ? 'split' :
    'r'
  );
}

// ─── useUsMap ─ shared resource loader ────────────────────────
function useUsMap() {
  const [topo, setTopo] = useState(null);
  useEffect(() => { let live = true; loadUsTopo().then(t => { if (live) setTopo(t); }); return () => { live = false; }; }, []);
  return topo;
}

// ─── BaseMap ─ renders states from topojson ───────────────────
function BaseMap({
  width, height,
  selectedFips = null,
  hoverFips = null,
  showParty = false,
  onlyDistrictsForFips = null, // when set, render only this state and its districts
  fipsBox = null,              // for state-focused zoom: zoom to this state's bbox
  showDistricts = false,
  hoverDistrictId = null,
  selectedDistrictId = null,
  fakeDistricts = null,        // [{id, label, [pathPoints]}] — for state-focused screens
  onStateHover, onStateClick,
  onDistrictHover, onDistrictClick,
  children,                    // overlay layer (markers, popovers anchored to projected coords)
}) {
  const topo = useUsMap();
  const svgRef = useRef(null);

  const { statesGeo, projection, pathGen, transform, scaleK, tx, ty, focusFeature } = useMemo(() => {
    if (!topo) return {};
    const states = topojson.feature(topo, topo.objects.states).features;
    const proj = d3.geoAlbersUsa().fitSize([width, height], { type: 'FeatureCollection', features: states });
    const path = d3.geoPath(proj);
    let tr = null, k = 1, txx = 0, tyy = 0, focus = null;
    if (fipsBox) {
      focus = states.find(f => f.id === fipsBox);
      if (focus) {
        const [[x0,y0],[x1,y1]] = path.bounds(focus);
        const dx = x1 - x0, dy = y1 - y0;
        const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
        k = Math.min(width / dx, height / dy) * 0.72;
        txx = width / 2 - k * cx;
        tyy = height / 2 - k * cy;
        tr = `translate(${txx},${tyy}) scale(${k})`;
      }
    }
    return { statesGeo: states, projection: proj, pathGen: path, transform: tr, scaleK: k, tx: txx, ty: tyy, focusFeature: focus };
  }, [topo, width, height, fipsBox]);

  if (!topo || !statesGeo) {
    return <svg ref={svgRef} className="mv-map-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" />;
  }

  // Unique clipPath id per BaseMap instance — clip the districts group to
  // the focused state's projected outline so cells never spill outside.
  const clipId = focusFeature ? `mv-clip-${focusFeature.id}-${width}x${height}` : null;

  return (
    <svg ref={svgRef} className="mv-map-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      {clipId && (
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <path d={pathGen(focusFeature)} />
          </clipPath>
        </defs>
      )}
      <g transform={transform || undefined}>
        {statesGeo.map(f => {
          const fips = f.id;
          const isSel = selectedFips === fips;
          const isHover = hoverFips === fips;
          const isDimmed = !!fipsBox && fipsBox !== fips;
          const partyClass = showParty && !isDimmed && !isSel
            ? ` party-${defaultPartyForFips(fips)}`
            : '';
          let cls = 'mv-state';
          if (isSel) cls += ' is-selected';
          if (isHover) cls += ' is-hover-target';
          if (isDimmed) cls += ' is-dimmed';
          cls += partyClass;
          return (
            <path
              key={fips}
              d={pathGen(f)}
              className={cls}
              vectorEffect={transform ? 'non-scaling-stroke' : undefined}
              onMouseEnter={onStateHover ? () => onStateHover(fips, f) : undefined}
              onMouseLeave={onStateHover ? () => onStateHover(null, null) : undefined}
              onClick={onStateClick ? () => onStateClick(fips, f) : undefined}
            />
          );
        })}

        {/* Synthesized district overlays for the focused state, clipped to its outline */}
        <g clipPath={clipId ? `url(#${clipId})` : undefined}>
        {showDistricts && fakeDistricts && fakeDistricts.map(d => {
          const isSel = selectedDistrictId === d.id;
          const isHover = hoverDistrictId === d.id;
          let cls = 'mv-district';
          if (isSel) cls += ' is-selected';
          if (isHover) cls += ' is-hover-target';
          return (
            <path
              key={d.id}
              d={d.d}
              className={cls}
              vectorEffect="non-scaling-stroke"
              onMouseEnter={onDistrictHover ? () => onDistrictHover(d.id) : undefined}
              onMouseLeave={onDistrictHover ? () => onDistrictHover(null) : undefined}
              onClick={onDistrictClick ? () => onDistrictClick(d.id) : undefined}
            />
          );
        })}
        </g>

        {/* SVG overlay slot for projection-relative overlays (connectors, etc) */}
        {typeof children === 'function' ? children({ projection, pathGen, transform }) : null}
      </g>

      {/* District labels rendered as a sibling of the scaled <g> so their
          font-size is in true screen-space, not multiplied by scaleK. */}
      {showDistricts && fakeDistricts && transform && (
        <g>
          {fakeDistricts.map(d => (
            d.label && d.cx != null && (
              <text
                key={'l'+d.id}
                x={d.cx * scaleK + tx}
                y={d.cy * scaleK + ty + 3}
                className="mv-district-label"
              >{d.label}</text>
            )
          ))}
        </g>
      )}
    </svg>
  );
}

// ─── Build a bunch of fake "districts" inside a state's path ──
// Generates a Voronoi-ish split of the state bbox into N cells, clipped by
// the state path. Used for FL on screens 2 & 3 — purely visual.
function buildFakeDistricts(stateFeature, pathGen, n = 28, projection = null) {
  if (!stateFeature) return [];
  const [[x0,y0],[x1,y1]] = pathGen.bounds(stateFeature);
  const w = x1 - x0, h = y1 - y0;

  // Test whether a screen-space (projected) point is inside the state.
  // Uses geoContains on the geographic feature when we have an inverse-able
  // projection, otherwise approximates with the bbox.
  const isInside = (px, py) => {
    if (!projection || !projection.invert) return true;
    const lonlat = projection.invert([px, py]);
    if (!lonlat) return false;
    return d3.geoContains(stateFeature, lonlat);
  };

  // Dense rejection-sampled seeding. Florida is a long, thin shape, so a
  // sparse bbox grid can leave the peninsula empty. We oversample (4× target),
  // keep only points inside the state outline, then pick the first n with
  // a min-distance filter so the cells are well-distributed.
  const targetN = n;
  const oversample = targetN * 8;
  const candCols = Math.ceil(Math.sqrt(oversample * w / h));
  const candRows = Math.ceil(oversample / candCols);
  const candidates = [];
  for (let r = 0; r < candRows; r++) {
    for (let c = 0; c < candCols; c++) {
      const k = r * candCols + c + 1;
      const jitter = (s) => (Math.sin(s * 12.9898) * 43758.5453 % 1 + 1) % 1;
      const jx = jitter(k * 1.7) - 0.5;
      const jy = jitter(k * 2.3) - 0.5;
      const px = x0 + (c + 0.5 + jx * 0.7) * w / candCols;
      const py = y0 + (r + 0.5 + jy * 0.7) * h / candRows;
      if (!isInside(px, py)) continue;
      candidates.push([px, py]);
    }
  }
  // Poisson-ish thinning: keep points that are at least minDist away from
  // the ones we've already kept, until we hit targetN (or run out).
  const seeds = [];
  let id = 1;
  // start with a generous min distance, fall back if we can't reach targetN
  for (let attempt = 0; attempt < 4 && seeds.length < targetN; attempt++) {
    seeds.length = 0;
    id = 1;
    const minDist = Math.sqrt((w * h) / targetN) * (0.62 - attempt * 0.12);
    const md2 = minDist * minDist;
    for (let i = 0; i < candidates.length && seeds.length < targetN; i++) {
      const [px, py] = candidates[i];
      let ok = true;
      for (let j = 0; j < seeds.length; j++) {
        const dx = seeds[j][0] - px, dy = seeds[j][1] - py;
        if (dx * dx + dy * dy < md2) { ok = false; break; }
      }
      if (ok) seeds.push([px, py, id++]);
    }
  }
  // Voronoi over a slightly-padded bbox. The cells get clipped by the
  // BaseMap's <clipPath> at render time; this just draws the partition.
  const delaunay = d3.Delaunay.from(seeds.map(s => [s[0], s[1]]));
  const voronoi = delaunay.voronoi([x0 - 20, y0 - 20, x1 + 20, y1 + 20]);
  const cells = [];
  for (let i = 0; i < seeds.length; i++) {
    const poly = voronoi.cellPolygon(i);
    if (!poly) continue;
    const d = 'M' + poly.map(p => p.join(',')).join('L') + 'Z';
    // Only render the label if the seed point is comfortably inside the
    // state outline (the brief: "only render if district is big enough").
    const labelInside = isInside(seeds[i][0], seeds[i][1]);
    cells.push({
      id: 'D' + seeds[i][2],
      label: labelInside ? String(seeds[i][2]) : null,
      d,
      cx: seeds[i][0],
      cy: seeds[i][1],
    });
  }
  return cells;
}

// Make all of the above globally available.
Object.assign(window, {
  Icon,
  STATE_META,
  defaultPartyForFips,
  loadUsTopo,
  useUsMap,
  BaseMap,
  buildFakeDistricts,
});
