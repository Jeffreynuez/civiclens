/* Reusable bits: icons, brand mark, blurred backdrop */

const Icon = {
  Close: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter" {...p}>
      <line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>
    </svg>
  ),
  Mail: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="1"/><polyline points="3 7 12 13 21 7"/>
    </svg>
  ),
  Lock: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter" {...p}>
      <rect x="4" y="11" width="16" height="10" rx="1"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>
    </svg>
  ),
  Eye: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter" {...p}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeOff: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter" {...p}>
      <path d="M3 3l18 18"/><path d="M10.6 6.1A10 10 0 0 1 12 6c6.5 0 10 6 10 6a18 18 0 0 1-3.3 4.1"/><path d="M6.6 6.6C3.6 8.6 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>
    </svg>
  ),
  User: (p) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter" {...p}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Briefcase: (p) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter" {...p}>
      <rect x="3" y="7" width="18" height="13" rx="1"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="3" y1="13" x2="21" y2="13"/>
    </svg>
  ),
  MapPin: (p) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter" {...p}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Shield: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter" {...p}>
      <path d="M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z"/><polyline points="9 12 11.5 14.5 16 10"/>
    </svg>
  ),
  Check: (p) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="butt" strokeLinejoin="miter" {...p}>
      <polyline points="4 12 10 18 20 6"/>
    </svg>
  ),
  CheckBig: (p) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="butt" strokeLinejoin="miter" {...p}>
      <polyline points="4 12 10 18 20 6"/>
    </svg>
  ),
  Alert: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="butt" strokeLinejoin="miter" {...p}>
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12" y2="16.01"/>
    </svg>
  ),
};

function BrandMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 64 64" aria-label="CivicLens">
      <defs>
        <clipPath id="lens-clip"><circle cx="26" cy="26" r="20.75"/></clipPath>
      </defs>
      <g clipPath="url(#lens-clip)">
        <rect x="5" y="5" width="42" height="42" fill="#ffffff"/>
        <rect x="5" y="11.7" width="42" height="2.86" fill="#8a2929"/>
        <rect x="5" y="17.43" width="42" height="2.86" fill="#8a2929"/>
        <rect x="5" y="23.14" width="42" height="2.86" fill="#8a2929"/>
        <rect x="5" y="28.86" width="42" height="2.86" fill="#8a2929"/>
        <rect x="5" y="34.57" width="42" height="2.86" fill="#8a2929"/>
        <rect x="5" y="40.29" width="42" height="2.86" fill="#8a2929"/>
        <rect x="5" y="5" width="20" height="20" fill="#1a1a2e"/>
        {[[9,9],[13.8,9],[18.6,9],[9,13.8],[13.8,13.8],[18.6,13.8],[9,18.6],[13.8,18.6],[18.6,18.6]].map(([x,y],i)=>(
          <polygon key={i} fill="#ffffff" transform={`translate(${x+1.2},${y+1.2}) scale(1.2)`}
            points="0,-1 0.2245,-0.309 0.951,-0.309 0.363,0.118 0.588,0.809 0,0.382 -0.588,0.809 -0.363,0.118 -0.951,-0.309 -0.2245,-0.309"/>
        ))}
      </g>
      <circle cx="26" cy="26" r="20.75" fill="none" stroke="#1a1a2e" strokeWidth="2.5"/>
      <rect x="42" y="44" width="14" height="4.6" rx="1.4" transform="rotate(45 42 44)" fill="#1a1a2e"/>
    </svg>
  );
}

function BlurredBackdrop() {
  return (
    <div className="bg-stage" aria-hidden="true">
      <div className="bg-blur">
        <div className="bg-nav">
          <div className="bg-nav__brand"><BrandMark/> CivicLens</div>
          <div className="bg-nav__search"></div>
          <div style={{flex:1}}></div>
          <button className="bg-nav__btn">Committees</button>
          <button className="bg-nav__btn">My tracked · 4</button>
          <button className="bg-nav__pill">Subscribe</button>
          <button className="bg-nav__login">Sign in</button>
        </div>
        <div className="bg-page">
          <div>
            <div className="bg-card">
              <div className="bg-hero">
                <div className="bg-avatar">BD</div>
                <div style={{flex:1}}>
                  <div className="bg-name">Byron Donalds</div>
                  <div className="bg-role">U.S. Representative · FL-19 · <span style={{color:'var(--cl-accent)',fontWeight:800}}>✓ Claimed</span></div>
                  <div style={{marginTop:8,fontSize:'0.78rem',color:'var(--cl-text-light)'}}>
                    <strong style={{color:'var(--cl-text)'}}>4,212</strong> following
                  </div>
                </div>
              </div>
              <div className="bg-chips">
                <span className="bg-chip">★ Country</span>
                <span className="bg-chip active">⬢ District</span>
                <span className="bg-chip">▤ State</span>
                <span className="bg-chip">⌂ City</span>
              </div>
            </div>
            <div className="bg-post">
              <div className="bg-post__hdr">
                <div className="bg-post__av">BD</div>
                <div>
                  <div className="bg-post__name">Byron Donalds</div>
                  <div className="bg-post__meta">U.S. Rep · FL-19 · 12m ago</div>
                </div>
              </div>
              <div className="bg-post__body">
                Posting from Naples — town hall on flood-mitigation funding tonight at 7. Bring questions about the Army Corps timeline and where the matching funds are coming from.
              </div>
              <div className="bg-post__rx">
                <span className="bg-rxbtn">👍 482</span>
                <span className="bg-rxbtn">👎 31</span>
                <span className="bg-rxbtn">💬 64</span>
              </div>
            </div>
            <div className="bg-post">
              <div className="bg-post__hdr">
                <div className="bg-post__av">BD</div>
                <div>
                  <div className="bg-post__name">Byron Donalds</div>
                  <div className="bg-post__meta">U.S. Rep · FL-19 · 2h ago</div>
                </div>
              </div>
              <div className="bg-post__body">
                Voted YEA on H.R. 4136. The full roll call is up on clerk.house.gov; happy to walk through the line items in tomorrow's office hours.
              </div>
            </div>
          </div>
          <div className="bg-side">
            <div>
              <div className="bg-side__h3">Upcoming events</div>
              <div className="bg-event">
                <div className="bg-event__date">APR 28 · 7:00 PM</div>
                <div style={{fontWeight:700,fontSize:'0.82rem',marginTop:4}}>Town hall: Flood mitigation</div>
                <div style={{fontSize:'0.75rem',color:'var(--cl-text-light)',marginTop:4}}>Naples Community Center</div>
              </div>
            </div>
            <div>
              <div className="bg-side__h3">Open polls</div>
              <div className="bg-event">
                <div style={{fontSize:'0.82rem',fontWeight:700}}>Should the district match Army Corps funding?</div>
                <div style={{fontSize:'0.72rem',color:'var(--cl-text-light)',marginTop:6}}>Closes in 2h 15m · 1,247 votes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Icon, BrandMark, BlurredBackdrop });
