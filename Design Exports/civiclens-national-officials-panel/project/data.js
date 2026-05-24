/* Reference data for the National Officials Panel.
   Real names ONLY for: President, VP, Speaker, House Maj/Min Leader,
   Senate Maj/Min Leader. Whips and the activity feed use fictional names.
   Per user constraint #4 + #6. */

const ADDR_PLACEHOLDER = '742 9th Ave S, Naples, FL';
const ADDR_HELPER = 'Address used to match your district. Never shared, never sold.';

const DATA = {
  // Hero metrics — computed counts to keep balance honest
  metrics: [
    { num: '535', label: 'Members of Congress' },
    { num: '50', label: 'States covered' },
    { num: '12.4k', label: 'Verified citizens' },
  ],

  executive: {
    top: [
      { name: 'Donald J. Trump', role: 'President of the United States', party: 'r', initials: 'DT', claimed: true, since: 'Jan 2025', followers: '24.1M', lastPost: '3h ago' },
      { name: 'JD Vance',        role: 'Vice President of the United States', party: 'r', initials: 'JV', claimed: true, since: 'Jan 2025', followers: '4.8M',  lastPost: '6h ago' },
    ],
    cabinet: [
      { name: 'Marco Rubio',     role: 'State',         party: 'r', initials: 'MR' },
      { name: 'Scott Bessent',   role: 'Treasury',      party: 'r', initials: 'SB' },
      { name: 'Pete Hegseth',    role: 'Defense',       party: 'r', initials: 'PH' },
      { name: 'Pam Bondi',       role: 'Justice',       party: 'r', initials: 'PB' },
      { name: 'Kristi Noem',     role: 'Homeland Sec.', party: 'r', initials: 'KN' },
      { name: 'Howard Lutnick',  role: 'Commerce',      party: 'r', initials: 'HL' },
      { name: 'Robert F. Kennedy Jr.', role: 'HHS',     party: 'r', initials: 'RK' },
      { name: 'Linda McMahon',   role: 'Education',     party: 'r', initials: 'LM' },
    ],
  },

  senate: {
    primary: [
      { name: 'John Thune',     role: 'Senate Majority Leader', state: 'SD', party: 'r', initials: 'JT', claimed: true,  followers: '892k', lastPost: '4h ago' },
      { name: 'Chuck Schumer',  role: 'Senate Minority Leader', state: 'NY', party: 'd', initials: 'CS', claimed: true,  followers: '3.2M', lastPost: '2h ago' },
      { name: 'Chuck Grassley', role: 'President pro tempore',  state: 'IA', party: 'r', initials: 'CG', claimed: true,  followers: '512k', lastPost: '1d ago' },
    ],
    whips: [
      { name: 'Wendell Marsh',  role: 'Majority Whip',          state: 'WY', party: 'r', initials: 'WM', followers: '184k', lastPost: '8h ago' },
      { name: 'Patricia Linn',  role: 'Minority Whip',          state: 'IL', party: 'd', initials: 'PL', followers: '241k', lastPost: '5h ago' },
      { name: 'Calvin Durrant', role: 'Asst. Majority Leader',  state: 'OK', party: 'r', initials: 'CD', followers: '142k', lastPost: '12h ago' },
      { name: 'Renata Olvera',  role: 'Asst. Minority Leader',  state: 'NM', party: 'd', initials: 'RO', followers: '198k', lastPost: '3h ago' },
    ],
  },

  house: {
    primary: [
      { name: 'Mike Johnson',   role: 'Speaker of the House',   state: 'LA-4',  party: 'r', initials: 'MJ', claimed: true, followers: '1.4M', lastPost: '5h ago' },
      { name: 'Steve Scalise',  role: 'House Majority Leader',  state: 'LA-1',  party: 'r', initials: 'SS', claimed: true, followers: '684k', lastPost: '7h ago' },
      { name: 'Hakeem Jeffries',role: 'House Minority Leader',  state: 'NY-8',  party: 'd', initials: 'HJ', claimed: true, followers: '1.1M', lastPost: '2h ago' },
    ],
    whips: [
      { name: 'Tomas Reyna',    role: 'Majority Whip',          state: 'TX-22', party: 'r', initials: 'TR', followers: '128k', lastPost: '9h ago' },
      { name: 'Devon Carlisle', role: 'Minority Whip',          state: 'CA-12', party: 'd', initials: 'DC', followers: '156k', lastPost: '4h ago' },
      { name: 'Eleanor Vance',  role: 'Majority Caucus Chair',  state: 'OH-15', party: 'r', initials: 'EV', followers: '94k',  lastPost: '11h ago' },
      { name: 'Marcus Whitfield',role:'Minority Caucus Chair',  state: 'GA-5',  party: 'd', initials: 'MW', followers: '116k', lastPost: '6h ago' },
    ],
  },

  // Activity feed — strict alternating D/R, fictional names per constraint #4 + #6
  feed: [
    { kind: 'full',    party: 'd', name: 'Marisol Estévez', role: 'Sen. Estévez · D-WA', initials: 'ME', timeAgo: '14m', body: 'Just finished oversight hearing on rural broadband subsidies. Three-year audit shows 41% of disbursed funds never reached households. Filed amendment requiring quarterly milestone reporting before next tranche. Full statement on the page.', up: 1842, down: 312, comments: 184 },
    { kind: 'full',    party: 'r', name: 'Chase Holloway',  role: 'Rep. Holloway · R-TN-7', initials: 'CH', timeAgo: '32m', body: 'Heard from over 200 small-business owners at the district roundtable today. Top concern by a wide margin: input cost volatility, particularly steel and lumber. Bringing those numbers back to Ways & Means this week.', up: 967, down: 188, comments: 92 },
    { kind: 'condensed', party: 'd', name: 'Aamir Desai',     role: 'Rep. Desai · D-NJ-3',  initials: 'AD', timeAgo: '1h',  body: 'Transit bill markup is moving Thursday. The amendment to preserve direct grants for legacy systems made it through committee 8–5. Long road ahead, but a real win for cities like Newark.', up: 612, down: 84, comments: 38 },
    { kind: 'condensed', party: 'r', name: 'Brett Aldridge',  role: 'Sen. Aldridge · R-MO',  initials: 'BA', timeAgo: '2h',  body: 'Visited the Springfield VA medical center this morning. The facility has cut average wait times for primary care from 23 days to 9 since the staffing reforms passed. Replicable model.', up: 1104, down: 92, comments: 71 },
    { kind: 'condensed', party: 'd', name: 'Lila Brennan',    role: 'Sen. Brennan · D-MN',   initials: 'LB', timeAgo: '4h',  body: 'Mental-health parity enforcement letter signed by 19 colleagues went out to Treasury this morning. Insurers are still gating outpatient psych care behind prior authorization in 14 states.', up: 778, down: 121, comments: 54 },
    { kind: 'condensed', party: 'r', name: 'Garrett Pell',    role: 'Rep. Pell · R-IA-2',    initials: 'GP', timeAgo: '6h',  body: 'Crop insurance reauth markup tomorrow. Pushing for the basis-risk pilot from the 2023 Farm Bill conference language to finally get standing authority. Iowa has waited long enough.', up: 489, down: 52, comments: 28 },
    { kind: 'condensed', party: 'd', name: 'Niamh O\u2019Connor', role: 'Rep. O\u2019Connor · D-MA-7', initials: 'NO', timeAgo: '8h', body: 'Boston Housing Authority just confirmed 1,400 new units coming online in Q3. Federal voucher coverage on 62% of them. Three years of work.', up: 853, down: 67, comments: 49 },
    { kind: 'condensed', party: 'r', name: 'Hollis Marchetti', role: 'Sen. Marchetti · R-OH', initials: 'HM', timeAgo: '11h', body: 'Steel-tariff exemption rule from Commerce drops Friday. Worked with steelworkers and downstream manufacturers in Lorain to get this language right. Both sides at the same table for once.', up: 921, down: 144, comments: 88 },
  ],

  // 50 states + DC. seats = total Congress (House+Senate) for that state.
  states: [
    {a:'AL',n:'Alabama',h:7,s:2,sens:[{nm:'[Sen. Alabama-1]',p:'r'},{nm:'[Sen. Alabama-2]',p:'r'}]},
    {a:'AK',n:'Alaska',h:1,s:2,sens:[{nm:'[Sen. Alaska-1]',p:'r'},{nm:'[Sen. Alaska-2]',p:'r'}]},
    {a:'AZ',n:'Arizona',h:9,s:2,sens:[{nm:'[Sen. Arizona-1]',p:'d'},{nm:'[Sen. Arizona-2]',p:'i'}]},
    {a:'AR',n:'Arkansas',h:4,s:2,sens:[{nm:'[Sen. Arkansas-1]',p:'r'},{nm:'[Sen. Arkansas-2]',p:'r'}]},
    {a:'CA',n:'California',h:52,s:2,sens:[{nm:'[Sen. California-1]',p:'d'},{nm:'[Sen. California-2]',p:'d'}]},
    {a:'CO',n:'Colorado',h:8,s:2,sens:[{nm:'[Sen. Colorado-1]',p:'d'},{nm:'[Sen. Colorado-2]',p:'d'}]},
    {a:'CT',n:'Connecticut',h:5,s:2,sens:[{nm:'[Sen. Connecticut-1]',p:'d'},{nm:'[Sen. Connecticut-2]',p:'d'}]},
    {a:'DE',n:'Delaware',h:1,s:2,sens:[{nm:'[Sen. Delaware-1]',p:'d'},{nm:'[Sen. Delaware-2]',p:'d'}]},
    {a:'FL',n:'Florida',h:28,s:2,sens:[{nm:'[Sen. Florida-1]',p:'r'},{nm:'[Sen. Florida-2]',p:'r'}]},
    {a:'GA',n:'Georgia',h:14,s:2,sens:[{nm:'[Sen. Georgia-1]',p:'d'},{nm:'[Sen. Georgia-2]',p:'d'}]},
    {a:'HI',n:'Hawaii',h:2,s:2,sens:[{nm:'[Sen. Hawaii-1]',p:'d'},{nm:'[Sen. Hawaii-2]',p:'d'}]},
    {a:'ID',n:'Idaho',h:2,s:2,sens:[{nm:'[Sen. Idaho-1]',p:'r'},{nm:'[Sen. Idaho-2]',p:'r'}]},
    {a:'IL',n:'Illinois',h:17,s:2,sens:[{nm:'[Sen. Illinois-1]',p:'d'},{nm:'[Sen. Illinois-2]',p:'d'}]},
    {a:'IN',n:'Indiana',h:9,s:2,sens:[{nm:'[Sen. Indiana-1]',p:'r'},{nm:'[Sen. Indiana-2]',p:'r'}]},
    {a:'IA',n:'Iowa',h:4,s:2,sens:[{nm:'[Sen. Iowa-1]',p:'r'},{nm:'[Sen. Iowa-2]',p:'r'}]},
    {a:'KS',n:'Kansas',h:4,s:2,sens:[{nm:'[Sen. Kansas-1]',p:'r'},{nm:'[Sen. Kansas-2]',p:'r'}]},
    {a:'KY',n:'Kentucky',h:6,s:2,sens:[{nm:'[Sen. Kentucky-1]',p:'r'},{nm:'[Sen. Kentucky-2]',p:'r'}]},
    {a:'LA',n:'Louisiana',h:6,s:2,sens:[{nm:'[Sen. Louisiana-1]',p:'r'},{nm:'[Sen. Louisiana-2]',p:'r'}]},
    {a:'ME',n:'Maine',h:2,s:2,sens:[{nm:'[Sen. Maine-1]',p:'r'},{nm:'[Sen. Maine-2]',p:'i'}]},
    {a:'MD',n:'Maryland',h:8,s:2,sens:[{nm:'[Sen. Maryland-1]',p:'d'},{nm:'[Sen. Maryland-2]',p:'d'}]},
    {a:'MA',n:'Massachusetts',h:9,s:2,sens:[{nm:'[Sen. Massachusetts-1]',p:'d'},{nm:'[Sen. Massachusetts-2]',p:'d'}]},
    {a:'MI',n:'Michigan',h:13,s:2,sens:[{nm:'[Sen. Michigan-1]',p:'d'},{nm:'[Sen. Michigan-2]',p:'d'}]},
    {a:'MN',n:'Minnesota',h:8,s:2,sens:[{nm:'[Sen. Minnesota-1]',p:'d'},{nm:'[Sen. Minnesota-2]',p:'d'}]},
    {a:'MS',n:'Mississippi',h:4,s:2,sens:[{nm:'[Sen. Mississippi-1]',p:'r'},{nm:'[Sen. Mississippi-2]',p:'r'}]},
    {a:'MO',n:'Missouri',h:8,s:2,sens:[{nm:'[Sen. Missouri-1]',p:'r'},{nm:'[Sen. Missouri-2]',p:'r'}]},
    {a:'MT',n:'Montana',h:2,s:2,sens:[{nm:'[Sen. Montana-1]',p:'r'},{nm:'[Sen. Montana-2]',p:'r'}]},
    {a:'NE',n:'Nebraska',h:3,s:2,sens:[{nm:'[Sen. Nebraska-1]',p:'r'},{nm:'[Sen. Nebraska-2]',p:'r'}]},
    {a:'NV',n:'Nevada',h:4,s:2,sens:[{nm:'[Sen. Nevada-1]',p:'d'},{nm:'[Sen. Nevada-2]',p:'d'}]},
    {a:'NH',n:'New Hampshire',h:2,s:2,sens:[{nm:'[Sen. New Hampshire-1]',p:'d'},{nm:'[Sen. New Hampshire-2]',p:'d'}]},
    {a:'NJ',n:'New Jersey',h:12,s:2,sens:[{nm:'[Sen. New Jersey-1]',p:'d'},{nm:'[Sen. New Jersey-2]',p:'d'}]},
    {a:'NM',n:'New Mexico',h:3,s:2,sens:[{nm:'[Sen. New Mexico-1]',p:'d'},{nm:'[Sen. New Mexico-2]',p:'d'}]},
    {a:'NY',n:'New York',h:26,s:2,sens:[{nm:'Chuck Schumer',p:'d'},{nm:'[Sen. New York-2]',p:'d'}]},
    {a:'NC',n:'North Carolina',h:14,s:2,sens:[{nm:'[Sen. North Carolina-1]',p:'r'},{nm:'[Sen. North Carolina-2]',p:'r'}]},
    {a:'ND',n:'North Dakota',h:1,s:2,sens:[{nm:'[Sen. North Dakota-1]',p:'r'},{nm:'[Sen. North Dakota-2]',p:'r'}]},
    {a:'OH',n:'Ohio',h:15,s:2,sens:[{nm:'[Sen. Ohio-1]',p:'r'},{nm:'[Sen. Ohio-2]',p:'r'}]},
    {a:'OK',n:'Oklahoma',h:5,s:2,sens:[{nm:'[Sen. Oklahoma-1]',p:'r'},{nm:'[Sen. Oklahoma-2]',p:'r'}]},
    {a:'OR',n:'Oregon',h:6,s:2,sens:[{nm:'[Sen. Oregon-1]',p:'d'},{nm:'[Sen. Oregon-2]',p:'d'}]},
    {a:'PA',n:'Pennsylvania',h:17,s:2,sens:[{nm:'[Sen. Pennsylvania-1]',p:'d'},{nm:'[Sen. Pennsylvania-2]',p:'r'}]},
    {a:'RI',n:'Rhode Island',h:2,s:2,sens:[{nm:'[Sen. Rhode Island-1]',p:'d'},{nm:'[Sen. Rhode Island-2]',p:'d'}]},
    {a:'SC',n:'South Carolina',h:7,s:2,sens:[{nm:'[Sen. South Carolina-1]',p:'r'},{nm:'[Sen. South Carolina-2]',p:'r'}]},
    {a:'SD',n:'South Dakota',h:1,s:2,sens:[{nm:'John Thune',p:'r'},{nm:'[Sen. South Dakota-2]',p:'r'}]},
    {a:'TN',n:'Tennessee',h:9,s:2,sens:[{nm:'[Sen. Tennessee-1]',p:'r'},{nm:'[Sen. Tennessee-2]',p:'r'}]},
    {a:'TX',n:'Texas',h:38,s:2,sens:[{nm:'[Sen. Texas-1]',p:'r'},{nm:'[Sen. Texas-2]',p:'r'}]},
    {a:'UT',n:'Utah',h:4,s:2,sens:[{nm:'[Sen. Utah-1]',p:'r'},{nm:'[Sen. Utah-2]',p:'r'}]},
    {a:'VT',n:'Vermont',h:1,s:2,sens:[{nm:'[Sen. Vermont-1]',p:'d'},{nm:'[Sen. Vermont-2]',p:'i'}]},
    {a:'VA',n:'Virginia',h:11,s:2,sens:[{nm:'[Sen. Virginia-1]',p:'d'},{nm:'[Sen. Virginia-2]',p:'d'}]},
    {a:'WA',n:'Washington',h:10,s:2,sens:[{nm:'[Sen. Washington-1]',p:'d'},{nm:'[Sen. Washington-2]',p:'d'}]},
    {a:'WV',n:'West Virginia',h:2,s:2,sens:[{nm:'[Sen. West Virginia-1]',p:'r'},{nm:'[Sen. West Virginia-2]',p:'r'}]},
    {a:'WI',n:'Wisconsin',h:8,s:2,sens:[{nm:'[Sen. Wisconsin-1]',p:'d'},{nm:'[Sen. Wisconsin-2]',p:'r'}]},
    {a:'WY',n:'Wyoming',h:1,s:2,sens:[{nm:'[Sen. Wyoming-1]',p:'r'},{nm:'[Sen. Wyoming-2]',p:'r'}]},
  ],
};

window.DATA = DATA;
window.ADDR_PLACEHOLDER = ADDR_PLACEHOLDER;
window.ADDR_HELPER = ADDR_HELPER;
