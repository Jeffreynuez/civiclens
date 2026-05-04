/* CivicLens UI kit — seed data, single source of truth for the click-thru. */

const SEED = {
  rep: {
    id: 'rep_donalds',
    name: 'Byron Donalds',
    role: 'U.S. House — FL-19 · Naples',
    party: 'R',
    initials: 'BD',
    claimed: true,
    followers: 12480,
  },
  citizens: {
    me: { id: 'c_maria', name: 'Maria Hernández', initials: 'MH', district: 'FL-19', city: 'Naples' },
    pool: [
      { id: 'c_carl', name: 'Carl Whitfield', initials: 'CW', district: 'FL-19', city: 'Naples' },
      { id: 'c_lena', name: 'Lena Park', initials: 'LP', district: 'FL-21', city: 'Boca Raton' },
      { id: 'c_dave', name: 'Dave Tran', initials: 'DT', district: 'FL-19', city: 'Naples' },
      { id: 'c_sam',  name: 'Samantha Cole', initials: 'SC', district: 'FL-25', city: 'Hialeah' },
    ],
  },
  posts: [
    {
      id: 'p1',
      author: 'rep',
      timeAgo: '12m ago',
      body: "Town hall tonight at Naples Pier — flood-mitigation funding for FL-19. The county put out three options last week and I want to know which you'd back before we sit down with the Army Corps next month. Poll closes at 9.",
      images: 1,
      poll: {
        question: 'Which funding source would you support first?',
        options: [
          { id: 'o1', label: 'Federal grant + matching county dollars', votes: 412, mine: false },
          { id: 'o2', label: 'County millage increase (1.2 mills)', votes: 318, mine: false },
          { id: 'o3', label: 'Stormwater utility fee on parcel size', votes: 197, mine: false },
          { id: 'o4', label: 'I need more information', votes: 88,  mine: false },
        ],
        scope: 'district',
        mode: 'full',
        closesIn: '2h 15m',
        totalVotes: 1015,
      },
      reactions: { up: 247, down: 12, mine: null },
      comments: [
        { id: 'cm1', author: { name: 'Carl Whitfield', initials: 'CW', verified: false, district: 'FL-19' }, body: "Federal grant first — county is already stretched. The corps has matching dollars on the table.", timeAgo: '8m', up: 18, down: 1 },
        { id: 'cm2', author: { name: 'Lena Park', initials: 'LP', verified: false, district: 'FL-21' }, body: "Stormwater utility fee scales with impact, which seems fairer than millage to me.", timeAgo: '4m', up: 6, down: 2 },
      ],
    },
    {
      id: 'p2',
      author: 'rep',
      timeAgo: '2h ago',
      body: "Filed an amendment this morning to clarify SBA loan eligibility for hurricane-affected small businesses in our district. Two pages. Plain English. We owe folks faster turnaround.",
      images: 2,
      poll: null,
      reactions: { up: 184, down: 7, mine: null },
      comments: [
        { id: 'cm3', author: { name: 'Dave Tran', initials: 'DT', verified: false, district: 'FL-19' }, body: "Restaurant in Bonita went under waiting on paperwork after Ian. Thank you.", timeAgo: '1h', up: 22, down: 0 },
      ],
    },
    {
      id: 'p3',
      author: 'rep',
      timeAgo: 'yesterday',
      body: "Quick survey — and I'll show results after the close so the room doesn't tilt the answers. Should the next FL-19 town hall focus on insurance reform or infrastructure?",
      images: 0,
      poll: {
        question: 'Pick the next town-hall topic.',
        options: [
          { id: 'q1', label: 'Property-insurance reform', votes: 0, mine: false },
          { id: 'q2', label: 'Infrastructure & flood mitigation', votes: 0, mine: false },
          { id: 'q3', label: 'Both — back-to-back nights', votes: 0, mine: false },
        ],
        scope: 'district',
        mode: 'reveal_after_close',
        closesIn: 'Closes Mar 14, 6:00 PM',
        totalVotes: 612,
      },
      reactions: { up: 91, down: 5, mine: null },
      comments: [],
    },
  ],
  events: [
    { id: 'e1', date: 'TUE · MAR 11', title: 'Town hall — Naples Pier', where: '7:00 PM · 25 12th Ave S' },
    { id: 'e2', date: 'THU · MAR 13', title: 'SBA roundtable',          where: '10:00 AM · Bonita Springs Chamber' },
    { id: 'e3', date: 'SAT · MAR 15', title: 'District office hours',    where: '9:00 AM · 3299 Tamiami Trail E' },
  ],
  dashboard: {
    summary: [
      { eye: 'Posts (7d)', num: '12', delta: '+3 vs prev wk', dir: 'up' },
      { eye: 'Reactions',  num: '1,247', delta: '+312', dir: 'up' },
      { eye: 'Comments',   num: '186', delta: '−14', dir: 'down' },
      { eye: 'Engaged citizens', num: '42', sub: '/ 60 in scope', delta: '70% activation', dir: 'up' },
    ],
    topPosts: [
      { id: 'p1', body: 'Town hall tonight at Naples Pier — flood mitigation funding…', engagement: 1547 },
      { id: 'p2', body: 'Filed an amendment this morning to clarify SBA loan…', engagement: 393 },
      { id: 'p3', body: 'Quick survey — pick the next town-hall topic.', engagement: 268 },
    ],
    topCommenters: [
      { name: 'Carl Whitfield', district: 'FL-19', initials: 'CW', count: 14 },
      { name: 'Dave Tran',      district: 'FL-19', initials: 'DT', count: 11 },
      { name: 'Lena Park',      district: 'FL-21', initials: 'LP', count: 9 },
      { name: 'Samantha Cole',  district: 'FL-25', initials: 'SC', count: 7 },
    ],
    reactions: { up: 1102, down: 145, ratio: 88 },
  },
};

window.SEED = SEED;
