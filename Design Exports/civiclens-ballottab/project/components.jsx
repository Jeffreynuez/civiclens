/* BallotTab — Side panel components.
   All five screens render inside a 420px-wide bt-panel mock. */

const { useState } = React;

/* ---------- Atoms ---------- */

function PartyChip({ party }) {
  const cls = party === 'D' ? 'cl-pchip cl-pchip--d'
            : party === 'R' ? 'cl-pchip cl-pchip--r'
            : 'cl-pchip cl-pchip--i';
  return <span className={cls}>{party}</span>;
}

function TrackElectionButton({ tracked, onToggle, label = 'Track' }) {
  return (
    <button
      className={`bt-track ${tracked ? 'active' : ''}`}
      onClick={onToggle}
      aria-pressed={tracked}
    >
      {tracked
        ? <IconBookmarkFill size={12} color="#8a6100" />
        : <IconBookmark size={13} color="currentColor" fillColor="#1b263b" fillOpacity={0.20} />
      }
      {tracked ? 'Tracked' : label}
    </button>
  );
}

function FollowButton({ following, onToggle }) {
  return (
    <button
      className={`bt-follow ${following ? 'active' : ''}`}
      onClick={onToggle}
      aria-pressed={following}
    >
      {following ? <IconCheckSm size={11} color="white" /> : <IconPlus size={10} color="currentColor" />}
      {following ? 'Following' : 'Follow'}
    </button>
  );
}

/* ---------- Panel chrome (faux SidePanel host) ---------- */

function PanelShell({ activeTab = 'Ballot', children }) {
  const tabs = ['Federal', 'State', 'Local', 'Ballot'];
  return (
    <div className="bt-panel">
      <div className="bt-panel__chrome">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.5)' }} />
          Side panel · Maria H. · FL-19
        </span>
      </div>
      <div className="bt-tabs">
        {tabs.map(t => (
          <button key={t} className={`bt-tabs__btn ${t === activeTab ? 'active' : ''}`}>
            {t}
            {t === 'Ballot' ? <span className="dot" /> : null}
          </button>
        ))}
      </div>
      <div className="bt-body">{children}</div>
    </div>
  );
}

/* ---------- Voter status banner ---------- */

function VoterBanner({ variant = 'verified', voter }) {
  if (variant === 'warning') {
    return (
      <div className="bt-voter bt-voter--warning">
        <div className="bt-voter__icon"><IconWarning size={18} color="#8a6100" fillColor="#ffba08" fillOpacity={0.5} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="bt-voter__title">We couldn't confirm your registration</div>
          <div className="bt-voter__sub">Address in Naples, FL · last checked May 1, 2026</div>
        </div>
      </div>
    );
  }
  if (variant === 'visitor') {
    return (
      <div className="bt-voter bt-voter--warning">
        <div className="bt-voter__icon"><IconCircleSlash size={16} color="#8a6100" /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="bt-voter__title">You're not verified to vote in FL-19</div>
          <div className="bt-voter__sub">Your verified district is CA-12</div>
        </div>
      </div>
    );
  }
  return (
    <div className="bt-voter">
      <div className="bt-voter__icon"><IconCheckCircle size={20} color="#1e8048" fillColor="#27ae60" fillOpacity={0.32} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="bt-voter__title">You're registered to vote in {voter.district}</div>
        <div className="bt-voter__sub">Last verified {voter.lastVerified} · {voter.city}</div>
      </div>
      <button className="bt-voter__link">View registration →</button>
    </div>
  );
}

/* ---------- Election card ---------- */

function ElectionCard({ election, onView }) {
  const [tracked, setTracked] = useState(election.tracked);
  if (election.lowEmphasis) {
    return (
      <div className="bt-elec bt-elec--low">
        <div className="bt-elec__top">
          <span className="bt-elec__eye bt-elec__eye--neutral">{election.kind} · <span className="cl-num">{election.daysOut} DAYS</span></span>
          <TrackElectionButton tracked={tracked} onToggle={() => setTracked(t => !t)} />
        </div>
        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--cl-text)' }}>{election.title}</div>
        <div style={{ fontSize: 'var(--cl-text-xs)', color: 'var(--cl-text-light)' }}>{election.date} · Local · 1</div>
        <button className="bt-link" onClick={onView}>View your ballot →</button>
      </div>
    );
  }

  const featured = !!election.featured;
  return (
    <div className={`bt-elec ${featured ? 'bt-elec--featured' : ''}`}>
      <div className="bt-elec__top">
        <span className={`bt-elec__eye ${featured ? '' : 'bt-elec__eye--neutral'}`}>
          {election.kind} · <span className="cl-num">{election.daysOut} DAYS</span>
        </span>
        <TrackElectionButton tracked={tracked} onToggle={() => setTracked(t => !t)} />
      </div>
      <h3 className="bt-elec__title">{election.title}</h3>
      <div className="bt-elec__date cl-num">{election.date}</div>
      <div className="bt-elec__breakdown">
        {Object.entries(election.breakdown).map(([k, v]) => (
          <span key={k}>{k} <b>{v}</b></span>
        ))}
      </div>
      <div className="bt-elec__actions">
        <button className="bt-view" onClick={onView}>
          View your ballot <IconChevronRight size={12} color="white" />
        </button>
      </div>
    </div>
  );
}

/* ---------- Polling place card ---------- */

function PollingPlace({ place, compact = false }) {
  return (
    <div className="bt-poll">
      <div className="bt-poll__hdr">
        <div className="bt-poll__icon"><IconMapPin size={18} color="#1e8048" fillColor="#2d6a4f" fillOpacity={0.28} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="bt-poll__title">Where you vote</div>
          <div className="bt-poll__addr">{place.name}</div>
          <div className="bt-poll__addr-line">{place.address}</div>
        </div>
      </div>
      <dl className="bt-poll__rows">
        <div className="bt-poll__row"><dt>Election day</dt><dd>{place.electionDay}</dd></div>
        <div className="bt-poll__row"><dt>Early voting</dt><dd>{place.earlyVoting}</dd></div>
        <div className="bt-poll__row"><dt>Drop box</dt><dd>{place.dropBox}</dd></div>
      </dl>
      <div className="bt-poll__links">
        <button className="bt-link">Get directions →</button>
        <button className="bt-link" style={{ color: 'var(--cl-text-light)' }}>Find a different location →</button>
      </div>
    </div>
  );
}

/* ---------- Race row (in detail) ---------- */

function RaceRow({ race }) {
  return (
    <div className="bt-race">
      <div className="bt-race__top">
        <div className="bt-race__title">{race.title}</div>
        {race.leaning === 'yes' ? (
          <span className="bt-race__leaning">
            <IconThumbsUp size={9} color="#1e8048" /> Leaning Yes
          </span>
        ) : null}
        <IconChevronRight size={14} color="var(--cl-text-muted)" />
      </div>
      <div className="bt-race__sub">{race.sub}</div>
    </div>
  );
}

function RaceGroup({ group, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`bt-group ${open ? '' : 'collapsed'}`}>
      <button className="bt-group__hdr" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className="bt-group__title">{group.label}</span>
        <span className="bt-group__count cl-num">{group.races.length}</span>
        <span className="bt-group__chev"><IconChevronDown size={14} /></span>
      </button>
      <div className="bt-group__body">
        {group.races.map(r => <RaceRow key={r.id} race={r} />)}
      </div>
    </div>
  );
}

/* ---------- Candidate row (Screen 3) ---------- */

function CandidateRow({ candidate, state = 'default' }) {
  const [following, setFollowing] = useState(false);
  const cls = state === 'hover' ? 'bt-cand bt-cand--hover'
            : state === 'comparing' ? 'bt-cand bt-cand--comparing'
            : 'bt-cand';
  return (
    <div className={cls}>
      <div className={`bt-cand__avatar bt-cand__avatar--${candidate.party.toLowerCase()}`}>{candidate.initials}</div>
      <div className="bt-cand__main">
        <div className="bt-cand__nameRow">
          <span className="bt-cand__name">{candidate.name}</span>
          <PartyChip party={candidate.party} />
        </div>
        <div className="bt-cand__role">{candidate.hometown} · {candidate.role}</div>
        <div className="bt-cand__summary">{candidate.summary}</div>
        <div className="bt-cand__actions">
          <button className="bt-cand__action">View profile →</button>
          {state === 'comparing'
            ? <button className="bt-cand__action bt-cand__action--check"><IconCheckSm size={11} color="#1e8048" /> Comparing</button>
            : <button className="bt-cand__action bt-cand__action--muted">Compare</button>
          }
          <span style={{ flex: 1 }} />
          <FollowButton following={following} onToggle={() => setFollowing(f => !f)} />
        </div>
      </div>
      <span className="bt-cand__badge">On ballot</span>
    </div>
  );
}

/* ---------- Measure card (Screen 4) ---------- */

function MeasureCard({ measure, state = 'default' }) {
  const [leaning, setLeaning] = useState(state === 'yes' ? 'yes' : state === 'no' ? 'no' : null);

  const yesActive = leaning === 'yes';
  const noActive = leaning === 'no';

  return (
    <div className="bt-measure">
      <div>
        <div className="cl-eyebrow" style={{ marginBottom: 4 }}>{measure.eyebrow}</div>
        <h3 className="bt-measure__title">{measure.title}</h3>
      </div>

      {leaning ? (
        <span className={`bt-measure__leaning ${leaning === 'no' ? 'bt-measure__leaning--no' : ''}`}>
          {leaning === 'yes'
            ? <><IconThumbsUp size={10} color="currentColor" /> Leaning Yes · private to you</>
            : <><IconThumbsDown size={10} color="currentColor" /> Leaning No · private to you</>
          }
        </span>
      ) : null}

      <div className="bt-measure__summary">{measure.summary}</div>

      <div className="bt-measure__sides">
        <button
          className={`bt-measure__side ${yesActive ? 'bt-measure__side--yes-active' : ''}`}
          onClick={() => setLeaning(yesActive ? null : 'yes')}
        >
          <span className="bt-measure__sideLabel">
            {yesActive ? '✓ Yes · your lean' : 'Yes'}
          </span>
          <span className="bt-measure__sideStance">{measure.yes.stance}</span>
          <span className="bt-measure__sideArg">{measure.yes.argument}</span>
          <span className="bt-measure__endorsers">Endorsers: {measure.yes.endorsers}</span>
        </button>
        <button
          className={`bt-measure__side ${noActive ? 'bt-measure__side--no-active' : ''}`}
          onClick={() => setLeaning(noActive ? null : 'no')}
        >
          <span className="bt-measure__sideLabel">
            {noActive ? '✓ No · your lean' : 'No'}
          </span>
          <span className="bt-measure__sideStance">{measure.no.stance}</span>
          <span className="bt-measure__sideArg">{measure.no.argument}</span>
          <span className="bt-measure__endorsers">Endorsers: {measure.no.endorsers}</span>
        </button>
      </div>

      <div className="bt-measure__footer">
        <button className="bt-link">Read full text →</button>
        <span className="bt-measure__threshold cl-num">{measure.threshold}</span>
      </div>
      <div className="bt-measure__privacy">
        <IconLock size={11} color="currentColor" />
        Your preference is private and only stored on your device.
      </div>
    </div>
  );
}

Object.assign(window, {
  PanelShell, VoterBanner, ElectionCard, PollingPlace,
  RaceRow, RaceGroup, CandidateRow, MeasureCard,
  TrackElectionButton, FollowButton, PartyChip,
});
