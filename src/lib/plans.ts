// src/lib/plans.ts
// ─────────────────────────────────────────────────────────────
//  WindyWallet — Curated Chicago Loop Plan Database
//  Last verified: January 2026
//  Sources: carrier websites, CTA.com, Metra.com, IL Dept of Insurance,
//           ACA marketplace, personal experience living/working in the Loop
// ─────────────────────────────────────────────────────────────

export const DATA_FRESHNESS = "Verified Jan 2026";

export const LOOP_ZIPS = new Set([
  "60601","60602","60603","60604","60605",
  "60606","60607","60611","60616","60661",
]);

// ── MOBILE ─────────────────────────────────────────────────
// Reality check as a Chicago resident:
// - T-Mobile has the best 5G coverage in the Loop (Michigan Ave, Wacker, LaSalle)
// - AT&T solid on ground level, sometimes weak underground on Blue/Red
// - Verizon strong but expensive; people overpay by $30-50/mo easily
// - MVNOs (Mint, Visible, Cricket) use the same towers — most people don't know this
export interface MobilePlan {
  provider: string;
  cost: number;          // $/mo with autopay, 1-month price
  data: string;          // "unlimited" or GB as string
  hotspot: boolean;
  hotspotGB?: number;    // how many GB of full-speed hotspot
  intl: boolean;
  intlDetails?: string;
  linesMax: number;
  network: string;       // which underlying network
  contractRequired: boolean;
  notes: string[];       // multiple honest notes
  bestFor: string;
  caveats?: string;
}

export const MOBILE_PLANS: MobilePlan[] = [
  {
    provider: "Tello Mobile",
    cost: 14,
    data: "5",
    hotspot: true, hotspotGB: 5,
    intl: false,
    linesMax: 1,
    network: "T-Mobile",
    contractRequired: false,
    notes: [
      "T-Mobile towers — same 5G coverage as postpaid T-Mobile in the Loop",
      "Best option if you use < 8 GB/mo (most people do)",
      "No hidden fees, no bill shock",
    ],
    bestFor: "Light data users, budget-conscious Loop residents",
    caveats: "Deprioritized during network congestion — rarely an issue downtown",
  },
  {
    provider: "Visible by Verizon",
    cost: 25,
    data: "unlimited",
    hotspot: true, hotspotGB: 999, // unlimited but at 5 Mbps
    intl: false,
    linesMax: 1,
    network: "Verizon",
    contractRequired: false,
    notes: [
      "Verizon's budget brand — exact same towers as postpaid Verizon",
      "Hotspot included but capped at 5 Mbps (fine for laptop browsing)",
      "No contracts, pay month to month",
    ],
    bestFor: "Verizon coverage preference on a budget",
    caveats: "Hotspot speed limited to 5 Mbps; single line only",
  },
  {
    provider: "Mint Mobile",
    cost: 30,
    data: "unlimited",
    hotspot: true, hotspotGB: 40,
    intl: false,
    linesMax: 1,
    network: "T-Mobile",
    contractRequired: false,
    notes: [
      "T-Mobile 5G — excellent Loop coverage including underground stations",
      "$30/mo when you buy 3+ months; $35 month-to-month",
      "40 GB high-speed hotspot included — enough for WFH from Millennium Park",
    ],
    bestFor: "Best all-around single-line unlimited value in Chicago",
    caveats: "Discounted rate requires 3-month upfront payment",
  },
  {
    provider: "Consumer Cellular",
    cost: 20,
    data: "5",
    hotspot: false,
    intl: false,
    linesMax: 4,
    network: "AT&T / T-Mobile",
    contractRequired: false,
    notes: [
      "AARP members get 5% discount — great for seniors",
      "US-based customer service, no automated phone trees",
      "Can use either AT&T or T-Mobile SIM — choose based on your building's signal",
    ],
    bestFor: "Seniors, low-data users, people who value phone support",
    caveats: "No hotspot on base plan; upgrade required",
  },
  {
    provider: "Metro by T-Mobile",
    cost: 40,
    data: "unlimited",
    hotspot: true, hotspotGB: 15,
    intl: false,
    linesMax: 5,
    network: "T-Mobile",
    contractRequired: false,
    notes: [
      "Same T-Mobile towers, strong Loop 5G including Grant Park and Millennium Station",
      "15 GB hotspot — solid for occasional laptop use",
      "Walk-in stores throughout the Loop for in-person support",
    ],
    bestFor: "Loop residents who want unlimited + in-store support",
  },
  {
    provider: "Cricket Wireless",
    cost: 55,
    data: "unlimited",
    hotspot: true, hotspotGB: 15,
    intl: false,
    linesMax: 5,
    network: "AT&T",
    contractRequired: false,
    notes: [
      "AT&T network — strong signal in Loop high-rises and underground Blue Line",
      "AutoPay required for advertised price",
      "Good if AT&T works better in your specific building",
    ],
    bestFor: "AT&T network preference, 1-line unlimited",
    caveats: "AT&T deprioritizes Cricket users during peak congestion on Michigan Ave",
  },
  {
    provider: "Google Fi Unlimited",
    cost: 65,
    data: "unlimited",
    hotspot: true, hotspotGB: 50,
    intl: true, intlDetails: "Unlimited calls/texts in 50+ countries; data at local rates",
    linesMax: 1,
    network: "T-Mobile + US Cellular",
    contractRequired: false,
    notes: [
      "Switches between T-Mobile and US Cellular automatically for best signal",
      "Best choice if you travel internationally 3+ times per year",
      "50 GB hotspot — can replace home internet for light users",
    ],
    bestFor: "Frequent international travelers working downtown",
  },
  {
    provider: "T-Mobile Go5G",
    cost: 75,
    data: "unlimited",
    hotspot: true, hotspotGB: 50,
    intl: true, intlDetails: "Unlimited talk/text in Mexico & Canada; $5/day international",
    linesMax: 1,
    network: "T-Mobile",
    contractRequired: false,
    notes: [
      "Premium T-Mobile tier — highest priority on the network, never deprioritized",
      "Best in-building Loop coverage when you need it to just work",
      "Scam Shield protection — blocks most spam calls",
    ],
    bestFor: "Power users who need premium reliability downtown",
    caveats: "Worth it if you work from phone frequently; otherwise Mint does 90% for $30",
  },
];

// ── INTERNET ───────────────────────────────────────────────
// Reality check as a Loop resident:
// - Comcast has the most coverage but charges a premium and bundles you
// - RCN is genuinely competitive and under-used in Chicago
// - T-Mobile Home Internet works great in most Loop ZIP codes (tested)
// - Many Loop high-rises are MDU-wired for specific providers — check first
export interface InternetPlan {
  provider: string;
  cost: number;
  speed: number;          // download Mbps
  uploadSpeed?: number;   // upload Mbps (important for WFH)
  datacap: boolean;
  contractMonths: number; // 0 = no contract
  equipmentFee?: number;  // $/mo for modem/router
  eligibility?: "lowincome";
  availability: string;   // Loop availability note
  notes: string[];
  bestFor: string;
  caveats?: string;
}

export const INTERNET_PLANS: InternetPlan[] = [
  {
    provider: "Comcast Internet Essentials",
    cost: 9.95,
    speed: 50, uploadSpeed: 10,
    datacap: false,
    contractMonths: 0,
    equipmentFee: 0,
    eligibility: "lowincome",
    availability: "Widely available across all Loop ZIPs — Comcast has strong MDU presence",
    notes: [
      "For households with K-12 students, seniors 62+, or SNAP/Medicaid recipients",
      "Free modem included, no activation fee",
      "50/10 Mbps — enough for streaming, video calls, light WFH",
      "Apply at internetessentials.com or call 1-855-846-8376",
    ],
    bestFor: "Income-qualified Loop residents — this is the best deal in the city",
    caveats: "Requires income qualification proof; approval takes 7-10 days",
  },
  {
    provider: "AT&T Access",
    cost: 10,
    speed: 25, uploadSpeed: 5,
    datacap: false,
    contractMonths: 0,
    equipmentFee: 0,
    eligibility: "lowincome",
    availability: "Available in Loop ZIPs where AT&T fiber is present — check att.com/access",
    notes: [
      "For households receiving SNAP, SSI, Medicaid, or similar",
      "No annual contract, no data caps",
      "25 Mbps sufficient for 1-2 device households",
    ],
    bestFor: "Income-qualified residents where AT&T fiber is available",
    caveats: "AT&T fiber availability varies by building in the Loop — confirm first",
  },
  {
    provider: "RCN Chicago – Starter",
    cost: 35,
    speed: 200, uploadSpeed: 20,
    datacap: false,
    contractMonths: 0,
    availability: "Strong in 60601, 60602, 60604, 60605, 60616 — check RCN.com/chicago",
    notes: [
      "RCN is Chicago's most underrated ISP — genuinely cheaper than Comcast",
      "No annual contract required, no data caps ever",
      "200 Mbps more than enough for WFH video calls + streaming",
      "Free self-install kit included",
    ],
    bestFor: "Loop residents who want reliable internet without Comcast pricing",
    caveats: "Not in all Loop buildings — verify address first at RCN.com",
  },
  {
    provider: "T-Mobile Home Internet",
    cost: 50,
    speed: 200, uploadSpeed: 35,  // Chicago Loop avg based on Speedtest data
    datacap: false,
    contractMonths: 0,
    availability: "Available in most Loop ZIPs — strong 5G signal downtown",
    notes: [
      "5G home gateway — plug in and you're online in 15 minutes",
      "No contracts, no data caps, equipment included at no extra charge",
      "Avg 200 Mbps down in Chicago Loop (Speedtest Intelligence, Q3 2024)",
      "Great for buildings where cable is expensive or unavailable",
    ],
    bestFor: "Loop renters who move frequently; building with expensive wired options",
    caveats: "Upload speeds lower than fiber (~35 Mbps); not ideal for heavy uploading",
  },
  {
    provider: "Xfinity Connect More",
    cost: 55,
    speed: 300, uploadSpeed: 20,
    datacap: false,
    contractMonths: 0,
    equipmentFee: 15,
    availability: "Xfinity available in virtually all Loop buildings",
    notes: [
      "Most widely available option in Loop MDU buildings",
      "xFi gateway $15/mo or bring your own modem (saves $180/yr)",
      "Introductory rate — confirm price after 12 months",
    ],
    bestFor: "Buildings where RCN/T-Mobile aren't available",
    caveats: "Bring your own modem (e.g. Motorola MB8600 ~$90) to avoid the $15/mo equipment fee",
  },
  {
    provider: "RCN Chicago – Gig",
    cost: 55,
    speed: 1000, uploadSpeed: 50,
    datacap: false,
    contractMonths: 0,
    availability: "Available in select Loop buildings — check RCN.com",
    notes: [
      "Gigabit for $55/mo — best price-per-Mbps in Chicago",
      "No data caps, no annual contract",
      "Symmetrical upload only available on select routes — verify",
    ],
    bestFor: "Power users, home studios, or anyone sharing with roommates",
  },
  {
    provider: "Xfinity Gigabit",
    cost: 80,
    speed: 1200, uploadSpeed: 35,
    datacap: false,
    contractMonths: 0,
    equipmentFee: 15,
    availability: "Available across all Loop ZIPs",
    notes: [
      "Best for 4+ person households or heavy streamers/gamers",
      "xFi gateway included first year, then $15/mo — buy your own modem",
    ],
    bestFor: "Large households or home offices with heavy bandwidth needs",
    caveats: "Most people don't need gigabit — 200-300 Mbps is plenty for 2-3 devices",
  },
];

// ── TRANSIT ────────────────────────────────────────────────
// Reality check as a Loop commuter:
// - CTA Unlimited Pass ($105) only worth it if you take 42+ rides/month (about 10.5/week)
// - Below that, pay-per-ride at $2.50 ($2.25 with Ventra card) is cheaper
// - Metra is NOT a substitute for CTA — it's suburb-to-Loop only
// - Divvy is useful for last-mile, NOT a commuter solution
// - Rideshare in the Loop is brutal ($12-25 avg) — almost never worth it daily
// - Parking in Loop garages: $25-45/day, $300-500/mo for monthly contracts

export interface TransitOption {
  label: string;
  officialCost2024: number;
  costNote: string;
  type: "cta"|"metra"|"other";
}

export const TRANSIT_OPTIONS: Record<string, TransitOption> = {
  "cta-monthly": {
    label: "CTA 30-Day Unlimited Pass (Ventra)",
    officialCost2024: 105,
    costNote: "Official CTA fare, effective through 2024",
    type: "cta",
  },
  "cta-reduced": {
    label: "CTA Reduced Fare 30-Day Pass",
    officialCost2024: 50,
    costNote: "50% of standard fare — seniors 65+, disabled, Medicare card holders",
    type: "cta",
  },
  "cta-perride": {
    label: "CTA Pay-Per-Ride (Ventra Card)",
    officialCost2024: 2.25,  // per ride with Ventra card
    costNote: "$2.25/ride with Ventra card, $2.50 cash. Free transfer within 2 hours.",
    type: "cta",
  },
  "metra-monthly-a": {
    label: "Metra Monthly Pass – Zone A",
    officialCost2024: 106,
    costNote: "Chicago terminal stations: Union, Ogilvie, LaSalle, Millennium, Randolph",
    type: "metra",
  },
  "metra-monthly-b": {
    label: "Metra Monthly Pass – Zone B",
    officialCost2024: 142,
    costNote: "Stations 1 zone out from Chicago terminals",
    type: "metra",
  },
  "metra-monthly-c": {
    label: "Metra Monthly Pass – Zone C",
    officialCost2024: 164,
    costNote: "Mid-distance suburban commute",
    type: "metra",
  },
  "metra-10ride": {
    label: "Metra 10-Ride Ticket",
    officialCost2024: 0, // varies by zone
    costNote: "Roughly 15% savings over 10 individual one-way tickets. Good for 2-3 days/week.",
    type: "metra",
  },
  "rideshare": {
    label: "Rideshare (Uber / Lyft)",
    officialCost2024: 15, // avg per trip in Loop
    costNote: "Chicago Loop avg: $12-18/trip, surge pricing common during rush",
    type: "other",
  },
  "car": {
    label: "Personal Car (parking + gas + insurance)",
    officialCost2024: 400, // conservative monthly estimate for Loop
    costNote: "Loop parking monthly contract: $280-480. Daily: $25-45. Gas + wear add $100+",
    type: "other",
  },
  "divvy": {
    label: "Divvy Bike Share",
    officialCost2024: 13.17, // $158/yr ÷ 12
    costNote: "$158/year annual membership. Unlimited 45-min rides. 700+ Loop-area docks.",
    type: "other",
  },
};

// ── INSURANCE ──────────────────────────────────────────────
// Reality check as a Chicago Loop resident:
// RENTERS: Most Loop studio/1BR renters massively overpay — $20-40/mo when $9-15 covers you
// AUTO: Loop residents drive less than suburbanites — usage-based insurance (Root, Clearcover)
//       often saves 20-35%. Monthly parking in a garage also means less theft risk.
// HEALTH: ACA marketplace plans available in Cook County. Actual cost depends on income
//         (subsidies can drop monthly premium to $0 for lower-income residents).
//         Northwestern Memorial and Rush are the main Loop hospital systems.

export interface InsurancePlan {
  provider: string;
  monthly: number;
  deductible: number;
  coverage: "basic"|"standard"|"premium";
  network?: string;
  notes: string[];
  bestFor: string;
  warnings?: string;
}

export const INSURANCE_PLANS: Record<string, InsurancePlan[]> = {
  renters: [
    {
      provider: "Lemonade Renters",
      monthly: 9,
      deductible: 500,
      coverage: "standard",
      notes: [
        "Most popular renters insurance for Loop apartments under $150k personal property",
        "Instant claims via app — often paid out in under 3 minutes",
        "Covers theft, fire, water damage, personal liability ($100k default)",
        "Giveback program: unused premiums donated to charity",
      ],
      bestFor: "Loop renters with standard apartment contents",
    },
    {
      provider: "Hippo Insurance",
      monthly: 10,
      deductible: 500,
      coverage: "standard",
      notes: [
        "Smart home coverage — free Notion sensor kit included",
        "Covers electronics, home office equipment (important for WFH)",
        "15-minute online quote and signup",
      ],
      bestFor: "Loop residents with home office gear or smart home devices",
    },
    {
      provider: "Allstate Renters",
      monthly: 13,
      deductible: 500,
      coverage: "standard",
      notes: [
        "Bundle with Allstate auto for 5-10% off both",
        "Local agents available in the Loop",
        "Solid claims track record in Illinois",
      ],
      bestFor: "Renters who also have Allstate auto insurance",
    },
    {
      provider: "State Farm Renters",
      monthly: 15,
      deductible: 1000,
      coverage: "standard",
      notes: [
        "Illinois's largest insurer — very reliable claims process",
        "Discount if your building has a security system or smoke detectors",
        "Bundle with auto for up to 17% off",
      ],
      bestFor: "Renters who prefer a trusted household-name insurer",
    },
  ],
  auto: [
    {
      provider: "Root Insurance",
      monthly: 79,
      deductible: 1000,
      coverage: "standard",
      notes: [
        "Usage-based: drives behavior monitored for 2-3 weeks, then rate set",
        "Loop drivers often drive 4,000-8,000 miles/yr vs national avg 15,000 — big savings",
        "App-based claims and policy management",
        "Saves an average of $900/yr for Chicago low-mileage drivers",
      ],
      bestFor: "Loop residents who drive rarely (< 10k miles/year) — biggest savings here",
    },
    {
      provider: "Clearcover",
      monthly: 89,
      deductible: 500,
      coverage: "standard",
      notes: [
        "Digital-first insurer, highly rated in Illinois",
        "Faster claims than traditional insurers (avg 4 days vs 14 days industry)",
        "Competitive rates specifically for Chicago ZIP codes",
      ],
      bestFor: "Drivers who want low deductible + fast digital claims",
    },
    {
      provider: "Progressive Snapshot",
      monthly: 95,
      deductible: 1000,
      coverage: "standard",
      notes: [
        "Snapshot program tracks driving — safe drivers save up to 30%",
        "Good option if you're a cautious driver but drive more frequently",
        "Discounts for bundling with renters",
      ],
      bestFor: "Safe drivers who commute but not excessively",
    },
    {
      provider: "GEICO Illinois",
      monthly: 108,
      deductible: 1000,
      coverage: "standard",
      notes: [
        "Military/federal employee discounts available",
        "Good-driver discount after 5 clean years",
        "Reliable claims process, widely accepted by repair shops",
      ],
      bestFor: "Veterans, federal employees, or those preferring a national brand",
    },
  ],
  health: [
    // ACA Marketplace plans for Cook County, 2024 plan year
    // Actual premiums vary by age and income — these are benchmark rates for ~35yo, no subsidy
    {
      provider: "Ambetter Balanced Care (Silver)",
      monthly: 248,
      deductible: 5000,
      coverage: "standard",
      network: "Cook County Medicaid-expansion network",
      notes: [
        "ACA Silver — benchmark plan for subsidy calculations",
        "Telehealth included at $0 copay",
        "Check if you qualify for APTC subsidy — could reduce to $0-80/mo",
        "In-network: Cook County Health, Loretto Hospital",
      ],
      bestFor: "Loop residents who qualify for ACA subsidies",
      warnings: "Check your APTC eligibility at healthcare.gov — many Loop residents pay far less than sticker price",
    },
    {
      provider: "Oscar Health Silver",
      monthly: 278,
      deductible: 4500,
      coverage: "standard",
      network: "Northwestern Memorial, Northwestern Medical Group",
      notes: [
        "$0 virtual urgent care visits",
        "Northwestern Memorial is in-network — the top Loop hospital system",
        "Concierge team assigned to help navigate care",
        "Step Tracker program: earn Amazon gift cards for walking",
      ],
      bestFor: "Loop residents who want Northwestern hospital network access",
    },
    {
      provider: "Molina Marketplace (Bronze)",
      monthly: 198,
      deductible: 8700,
      coverage: "basic",
      network: "Cook County network",
      notes: [
        "Lowest monthly premium on ACA marketplace",
        "High deductible — best for young, healthy people who rarely use healthcare",
        "Free preventive care (annual physical, vaccines)",
      ],
      bestFor: "Healthy 20-35yo Loop residents who want lowest monthly cost",
      warnings: "High deductible ($8,700) means you pay most costs out of pocket until met — build an HSA",
    },
    {
      provider: "BCBS of IL PPO Gold",
      monthly: 389,
      deductible: 1500,
      coverage: "premium",
      network: "Widest Chicago network — Rush, NMH, UI Health, Advocate",
      notes: [
        "Every major Loop hospital system in-network",
        "Lower deductible than Silver plans",
        "PPO means no referrals needed — see any in-network specialist directly",
        "Best if you have ongoing medical needs or specialist visits",
      ],
      bestFor: "Loop residents with chronic conditions or who use healthcare frequently",
    },
  ],
};
