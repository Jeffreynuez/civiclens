/* BallotTab — five screens, each rendered inside a PanelShell. */

const { useState: useStateScr } = React;

/* ===== Screen 1: Default Ballot tab — elections overview ===== */
function Screen1Default() {
  return (
    <PanelShell>
      <VoterBanner voter={SEED.voter} />

      <div className="bt-section-hdr">
        <span className="bt-section-hdr__eye">Upcoming elections</span>
        <span className="bt-section-hdr__count cl-num">· 3 ahead</span>
      </div>

      {/* Re-ordered: featured (next-major) first, then earlier-but-low-emphasis municipal,
          then general. Maria came here for the primary — surface it. */}
      <ElectionCard election={SEED.elections[1]} />
      <ElectionCard election={SEED.elections[0]} />
      <ElectionCard election={SEED.elections[2]} />

      <button className="bt-link" style={{ alignSelf: 'flex-start', marginTop: 4 }}>See past elections →</button>
    </PanelShell>
  );
}

/* ===== Screen 2: Election detail — Florida Primary ===== */
function Screen2Detail() {
  return (
    <PanelShell>
      <button className="bt-detail-back">
        <IconChevronLeft size={12} color="currentColor" /> Upcoming elections
      </button>

      <div className="bt-detail-hdr">
        <div className="bt-detail-hdr__top">
          <div style={{ minWidth: 0 }}>
            <div className="cl-eyebrow" style={{ color: 'var(--cl-accent)', marginBottom: 4 }}>
              PRIMARY · 114 DAYS
            </div>
            <h2 className="bt-detail-hdr__title">Florida Primary</h2>
            <div className="bt-detail-hdr__sub cl-num">Tuesday, August 18, 2026 · Closed primary</div>
            <div className="bt-detail-hdr__count cl-num">114 days · 6 hours · 23 minutes</div>
          </div>
          <TrackElectionButton tracked={true} onToggle={() => {}} />
        </div>

        <div className="bt-pillrow">
          <span className="bt-pill">Federal <b>3</b></span>
          <span className="bt-pill">State <b>5</b></span>
          <span className="bt-pill">Local <b>4</b></span>
          <span className="bt-pill">Measures <b>2</b></span>
        </div>

        <div className="bt-detail-hdr__actions">
          <button className="bt-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <IconDownload size={12} color="currentColor" /> Sample ballot
          </button>
        </div>
      </div>

      <div className="bt-closed">
        <IconShield size={16} color="#457b9d" fillColor="#457b9d" fillOpacity={0.22} />
        <div>
          <b>Florida is a closed primary</b> — you'll see Democratic races based on your party registration.
          To switch parties, update your voter registration.
        </div>
      </div>

      {/* Polling place pinned ABOVE the race list — this is the #1 reason users open the tab.
          (Per the design principle: easier to scroll past races than to scroll past polling info.) */}
      <PollingPlace place={SEED.pollingPlace} />

      {SEED.raceGroups.map(g => <RaceGroup key={g.id} group={g} />)}
    </PanelShell>
  );
}

/* ===== Screen 3: Race detail — U.S. House FL-19 with candidate states ===== */
function Screen3Race() {
  return (
    <PanelShell>
      <button className="bt-detail-back">
        <IconChevronLeft size={12} color="currentColor" /> Florida Primary
      </button>

      <div className="bt-race-detail">
        <div className="bt-race-detail__hdr">
          <div className="cl-eyebrow" style={{ color: 'var(--cl-democrat)' }}>
            FEDERAL · DEMOCRATIC PRIMARY
          </div>
          <h3 className="bt-race-detail__title">U.S. House · FL-19</h3>
          <div className="bt-race-detail__sub">Choose 1 · 3 candidates</div>
        </div>
        <div className="bt-race-detail__compare">
          <span>Researching this race?</span>
          <button className="bt-link">Add all to compare →</button>
        </div>
      </div>

      <CandidateRow candidate={SEED.candidates[0]} state="default" />
      <CandidateRow candidate={SEED.candidates[1]} state="hover" />
      <CandidateRow candidate={SEED.candidates[2]} state="comparing" />

      <div className="cl-eyebrow" style={{ marginTop: 4, paddingLeft: 2 }}>
        Row states · default · hover · in compare tray
      </div>
    </PanelShell>
  );
}

/* ===== Screen 4: Measure component states ===== */
function Screen4Measure() {
  return (
    <PanelShell>
      <div className="cl-eyebrow" style={{ paddingLeft: 2 }}>A · default (no leaning · neutral)</div>
      <MeasureCard measure={SEED.measure} state="default" key="default" />

      <div className="cl-eyebrow" style={{ paddingLeft: 2, marginTop: 4 }}>B · leaning Yes</div>
      <MeasureCard measure={SEED.measure} state="yes" key="yes" />

      <div className="cl-eyebrow" style={{ paddingLeft: 2, marginTop: 4 }}>C · leaning No</div>
      <MeasureCard measure={SEED.measure} state="no" key="no" />
    </PanelShell>
  );
}

/* ===== Screen 5: States — loading / empty / not-registered / out-of-state ===== */

function SkeletonElectionCard() {
  return (
    <div className="bt-skel-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="bt-skel" style={{ width: 120, height: 10 }} />
        <div className="bt-skel" style={{ width: 64, height: 22, borderRadius: 999 }} />
      </div>
      <div className="bt-skel" style={{ width: '70%', height: 18 }} />
      <div className="bt-skel" style={{ width: '55%', height: 12 }} />
      <div className="bt-skel" style={{ width: '100%', height: 1, background: 'var(--cl-divider)' }} />
      <div className="bt-skel" style={{ width: '90%', height: 10 }} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
        <div className="bt-skel" style={{ width: 110, height: 28, borderRadius: 8 }} />
      </div>
    </div>
  );
}

function Screen5aLoading() {
  return (
    <PanelShell>
      <div className="bt-skel-card" style={{ flexDirection: 'row', alignItems: 'center' }}>
        <div className="bt-skel" style={{ width: 32, height: 32, borderRadius: 999 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, marginLeft: 12 }}>
          <div className="bt-skel" style={{ width: '60%', height: 12 }} />
          <div className="bt-skel" style={{ width: '40%', height: 10 }} />
        </div>
      </div>
      <div className="bt-skel" style={{ width: 140, height: 10, marginLeft: 2 }} />
      <SkeletonElectionCard />
      <SkeletonElectionCard />
      <SkeletonElectionCard />
    </PanelShell>
  );
}

function Screen5bEmpty() {
  return (
    <PanelShell>
      <VoterBanner voter={SEED.voter} />
      <div className="bt-empty">
        <div className="bt-empty__icon">
          <IconCalendar size={28} color="#1e8048" fillColor="#2d6a4f" fillOpacity={0.28} />
        </div>
        <h3 className="bt-empty__title">No elections in your district right now</h3>
        <p className="bt-empty__body">
          Florida's next election is the 2026 primary on Aug 18. We'll surface candidates here once they're declared.
        </p>
        <button className="bt-link">See national calendar →</button>
      </div>
    </PanelShell>
  );
}

function Screen5cNotRegistered() {
  return (
    <PanelShell>
      <div className="bt-voter bt-voter--warning" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 12 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div className="bt-voter__icon"><IconWarning size={18} color="#8a6100" fillColor="#ffba08" fillOpacity={0.5} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="bt-voter__title">We couldn't confirm your registration</div>
            <div className="bt-voter__sub" style={{ lineHeight: 1.45, marginTop: 4 }}>
              Your address (Naples, FL) doesn't match active voter rolls. This may be normal if you recently moved or registered.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className="bt-view" style={{ marginLeft: 0, justifyContent: 'center' }}>
            Check registration status (FL state portal)
          </button>
          <button className="bt-view bt-view--ghost" style={{ marginLeft: 0, justifyContent: 'center' }}>
            Update my address →
          </button>
        </div>
      </div>
    </PanelShell>
  );
}

function Screen5dVisitor() {
  return (
    <PanelShell>
      <VoterBanner variant="visitor" />
      <div className="bt-empty" style={{ alignItems: 'flex-start', textAlign: 'left', padding: 16 }}>
        <h3 className="bt-empty__title">This is FL-19's ballot</h3>
        <p className="bt-empty__body" style={{ textAlign: 'left' }}>
          Your verified district is <b>CA-12</b>. You can browse FL-19 to research, but you can't vote here.
        </p>
        <div style={{ display: 'flex', gap: 8, alignSelf: 'stretch', marginTop: 6 }}>
          <button className="bt-view" style={{ marginLeft: 0, flex: 1, justifyContent: 'center' }}>
            View your ballot (CA-12) →
          </button>
        </div>
        <div className="cl-eyebrow" style={{ marginTop: 8 }}>Browsing FL-19</div>
      </div>
      <div style={{ opacity: 0.55, pointerEvents: 'none' }}>
        <div className="bt-section-hdr">
          <span className="bt-section-hdr__eye">FL-19 upcoming · read only</span>
        </div>
        <div style={{ marginTop: 10 }}>
          <ElectionCard election={SEED.elections[1]} />
        </div>
      </div>
    </PanelShell>
  );
}

Object.assign(window, {
  Screen1Default, Screen2Detail, Screen3Race, Screen4Measure,
  Screen5aLoading, Screen5bEmpty, Screen5cNotRegistered, Screen5dVisitor,
});
