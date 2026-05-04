/* Seed data for BallotTab — Maria Hendricks · FL-19 · Naples FL */

const SEED = {
  voter: {
    name: 'Maria Hendricks',
    district: 'FL-19',
    city: 'Naples, FL',
    party: 'Democrat',
    verified: true,
    lastVerified: 'May 1, 2026',
  },
  elections: [
    {
      id: 'naples-special-2026-jun',
      kind: 'MUNICIPAL',
      daysOut: 32,
      title: 'Naples City Council Special',
      date: 'Tuesday, June 4, 2026',
      breakdown: { Federal: 0, State: 0, Local: 1, Measures: 0 },
      tracked: false,
      lowEmphasis: true,
    },
    {
      id: 'fl-primary-2026',
      kind: 'PRIMARY',
      daysOut: 114,
      title: 'Florida Primary',
      date: 'Tuesday, August 18, 2026',
      sub: '114 days · Closed primary',
      breakdown: { Federal: 3, State: 5, Local: 4, Measures: 2 },
      tracked: true,
      featured: true,
    },
    {
      id: 'fl-general-2026',
      kind: 'GENERAL',
      daysOut: 184,
      title: 'Florida General Election',
      date: 'Tuesday, November 3, 2026',
      breakdown: { Federal: 4, State: 8, Local: 12, Measures: 6 },
      tracked: false,
    },
  ],
  pollingPlace: {
    name: 'North Collier Regional Park',
    address: '15000 Livingston Rd, Naples, FL 34109',
    electionDay: 'Aug 18 · 7am – 7pm ET',
    earlyVoting: 'Aug 8 – Aug 17 · Mon–Sat 9am – 6pm',
    dropBox: 'Same address · 24/7 from Jul 25',
  },
  raceGroups: [
    {
      id: 'federal',
      label: 'Federal Races',
      races: [
        { id: 'us-pres', title: 'U.S. President', sub: 'Democratic primary · Choose 1' },
        { id: 'us-senate', title: 'U.S. Senate', sub: 'Democratic primary · Choose 1' },
        { id: 'us-house', title: 'U.S. House · FL-19', sub: 'Democratic primary · Choose 1' },
      ],
    },
    {
      id: 'state',
      label: 'State Races',
      races: [
        { id: 'gov', title: 'Governor of Florida', sub: 'Democratic primary · Choose 1' },
        { id: 'state-sen', title: 'State Senate · District 27', sub: 'Democratic primary · Choose 1' },
        { id: 'state-house', title: 'State House · District 80', sub: 'Democratic primary · Choose 1' },
        { id: 'ag', title: 'Attorney General', sub: 'Democratic primary · Choose 1' },
        { id: 'cfo', title: 'Chief Financial Officer', sub: 'Democratic primary · Choose 1' },
      ],
    },
    {
      id: 'local',
      label: 'Local Races',
      races: [
        { id: 'commish', title: 'Collier County Commissioner · D4', sub: 'Choose 1' },
        { id: 'sheriff', title: 'Collier County Sheriff', sub: 'Choose 1' },
        { id: 'appraiser', title: 'Collier County Property Appraiser', sub: 'Choose 1' },
        { id: 'naples-3', title: 'Naples City Council · Seat 3', sub: 'Choose 1' },
      ],
    },
    {
      id: 'measures',
      label: 'Ballot Measures',
      races: [
        { id: 'amend-4', title: 'Amendment 4 · Marijuana legalization', sub: 'Statewide · 60% to pass · Yes / No', isMeasure: true, leaning: 'yes' },
        { id: 'amend-5', title: 'Amendment 5 · Property tax exemption', sub: 'Statewide · 60% to pass · Yes / No', isMeasure: true },
      ],
    },
  ],
  candidates: [
    {
      id: 'rivera',
      name: 'Carmen Rivera',
      party: 'D',
      hometown: 'Naples, FL',
      role: 'State Sen.',
      summary: 'Focuses on coastal infrastructure resilience and small-business support across Southwest Florida.',
      initials: 'CR',
      onBallot: true,
    },
    {
      id: 'okafor',
      name: 'Daniel Okafor',
      party: 'D',
      hometown: 'Fort Myers, FL',
      role: 'Civil rights attorney',
      summary: 'Background in housing law; campaigning on hurricane-recovery housing and worker protections.',
      initials: 'DO',
      onBallot: true,
    },
    {
      id: 'patel',
      name: 'Anjali Patel',
      party: 'D',
      hometown: 'Bonita Springs, FL',
      role: 'School board member',
      summary: 'Education-first platform; vocational training partnerships and broadband access in rural Collier.',
      initials: 'AP',
      onBallot: true,
    },
  ],
  measure: {
    eyebrow: 'AMENDMENT 4 · STATEWIDE',
    title: 'Right to recreational marijuana use',
    summary: 'Allows adults 21 and older to possess, purchase, and use marijuana products. Authorizes existing licensed entities to acquire, cultivate, distribute, sell, and dispense such products.',
    yes: {
      stance: 'Supports legalization.',
      argument: 'Frames it as personal liberty and a tax-revenue opportunity for state programs. Backers cite reduced enforcement costs and regulated supply.',
      endorsers: 'ACLU of Florida, Florida NORML, Florida Cannabis Action Network, Smart & Safe Florida',
    },
    no: {
      stance: 'Opposes legalization.',
      argument: 'Cites concerns about workplace impairment, youth access, and impaired driving. Backers urge a federal-first approach and stricter regulation.',
      endorsers: 'Florida Chamber of Commerce, Florida Sheriffs Association, Save Our Society from Drugs',
    },
    threshold: 'Requires 60% to pass · Florida constitutional amendment',
  },
};

window.SEED = SEED;
