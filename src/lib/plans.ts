// src/lib/plans.ts
// ─────────────────────────────────────────────────────────────
//  WindyWallet — Curated Chicago Loop Plan Database
//  Last verified: September 2026
//  Sources: carrier websites, transitchicago.com, Metra.com, Divvy, IL Dept of Insurance,
//           KFF / Get Covered Illinois, personal experience living/working in the Loop
// ─────────────────────────────────────────────────────────────

export const DATA_VERIFIED = "Sep 2026";
export const DATA_VERIFIED_LONG = "September 2026";
export const DATA_FRESHNESS = `Verified ${DATA_VERIFIED}`;

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
    hotspot: true, hotspotGB: 20,
    intl: false,
    linesMax: 1,
    network: "T-Mobile",
    contractRequired: false,
    notes: [
      "T-Mobile 5G — excellent Loop coverage including underground stations",
      "$30/mo on a 12-month plan ($35 on 6-month, $40 on 3-month)",
      "New customers: intro promo has been $15/mo for the first term",
      "20 GB hotspot included; 50 GB high-speed data before slowdowns in congestion",
    ],
    bestFor: "Best all-around single-line unlimited value in Chicago",
    caveats: "$30 rate requires paying 12 months upfront",
  },
  {
    provider: "Consumer Cellular",
    cost: 25,
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
    provider: "Metro by T-Mobile Flex Unlimited",
    cost: 50,
    data: "unlimited",
    hotspot: true, hotspotGB: 8,
    intl: false,
    linesMax: 5,
    network: "T-Mobile",
    contractRequired: false,
    notes: [
      "Same T-Mobile towers, strong Loop 5G including Grant Park and Millennium Station",
      "8 GB hotspot — fine for occasional laptop use",
      "$50/mo with AutoPay, locked by Metro's 5-year price guarantee",
      "Walk-in stores throughout the Loop for in-person support",
    ],
    bestFor: "Loop residents who want unlimited + in-store support",
  },
  {
    provider: "Cricket Supreme Unlimited",
    cost: 55,
    data: "unlimited",
    hotspot: true, hotspotGB: 50,
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
    provider: "Google Fi Unlimited Premium",
    cost: 65,
    data: "unlimited",
    hotspot: true, hotspotGB: 50,
    intl: true, intlDetails: "Unlimited calls/texts in 50+ countries; data at local rates",
    linesMax: 1,
    network: "T-Mobile",
    contractRequired: false,
    notes: [
      "Runs on T-Mobile's 5G network — strong across the Loop",
      "Best choice if you travel internationally 3+ times per year",
      "50 GB hotspot — can replace home internet for light users",
    ],
    bestFor: "Frequent international travelers working downtown",
  },
  {
    provider: "T-Mobile Experience More",
    cost: 85,
    data: "unlimited",
    hotspot: true, hotspotGB: 60,
    intl: true, intlDetails: "Unlimited talk/text + 15 GB data in Mexico & Canada; free texting to 210+ countries",
    linesMax: 1,
    network: "T-Mobile",
    contractRequired: false,
    notes: [
      "Premium T-Mobile tier — highest priority on the network, never deprioritized",
      "Best in-building Loop coverage when you need it to just work",
      "Scam Shield protection — blocks most spam calls",
      "5-year price guarantee on the plan price",
    ],
    bestFor: "Power users who need premium reliability downtown",
    caveats: "Taxes & fees are extra. Worth it if you work from your phone; otherwise Mint does 90% for $30",
  },
];

// ── INTERNET ───────────────────────────────────────────────
// Reality check as a Loop resident:
// - Comcast has the most coverage but charges a premium and bundles you
// - Astound (formerly RCN) is genuinely competitive and under-used in Chicago
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
    cost: 14.95,
    speed: 75, uploadSpeed: 10,
    datacap: false,
    contractMonths: 0,
    equipmentFee: 0,
    eligibility: "lowincome",
    availability: "Widely available across all Loop ZIPs — Comcast has strong MDU presence",
    notes: [
      "For households on SNAP, Medicaid, school lunch, housing assistance, etc. (income ≤ 200% FPL)",
      "WiFi equipment included, no activation fee, no credit check",
      "75/10 Mbps — enough for streaming, video calls, light WFH",
      "Lifeline-eligible households can bring it to ~$5.70/mo",
      "Apply at internetessentials.com or call 1-855-846-8376",
    ],
    bestFor: "Income-qualified Loop residents — this is the best deal in the city",
    caveats: "Requires income qualification proof; approval takes 7-10 days",
  },
  {
    provider: "AT&T Access",
    cost: 30,
    speed: 100,
    datacap: false,
    contractMonths: 0,
    equipmentFee: 0,
    eligibility: "lowincome",
    availability: "Available in Loop ZIPs where AT&T fiber is present — check att.com/access",
    notes: [
      "For households receiving SNAP, SSI, Medicaid, or similar",
      "No annual contract, no deposit, no equipment fee",
      "$30/mo for up to 100 Mbps; $10–15/mo where only slower speeds are available",
    ],
    bestFor: "Income-qualified residents where AT&T fiber is available",
    caveats: "AT&T fiber availability varies by building in the Loop — confirm first",
  },
  {
    provider: "Astound (RCN) 300 Mbps",
    cost: 30,
    speed: 300, uploadSpeed: 20,
    datacap: false,
    contractMonths: 0,
    availability: "Strong in 60601, 60602, 60604, 60605, 60616 — check astound.com",
    notes: [
      "Astound (formerly RCN) is Chicago's most underrated ISP — genuinely cheaper than Comcast",
      "No annual contract required, no data caps ever",
      "300 Mbps more than enough for WFH video calls + streaming",
      "Price includes AutoPay discount ($10 off with bank account autopay)",
    ],
    bestFor: "Loop residents who want reliable internet without Comcast pricing",
    caveats: "Not in all Loop buildings — verify address first at astound.com",
  },
  {
    provider: "T-Mobile Home Internet (Rely)",
    cost: 50,
    speed: 354, uploadSpeed: 15,  // "up to" speeds for the Rely plan
    datacap: false,
    contractMonths: 0,
    availability: "Available in most Loop ZIPs — strong 5G signal downtown",
    notes: [
      "5G home gateway — plug in and you're online in 15 minutes",
      "No contracts, no data caps, equipment included at no extra charge",
      "Up to 354 Mbps down; $35/mo if you also have a T-Mobile phone line",
      "Great for buildings where cable is expensive or unavailable",
    ],
    bestFor: "Loop renters who move frequently; building with expensive wired options",
    caveats: "Upload speeds much lower than fiber (~15 Mbps); not ideal for heavy uploading",
  },
  {
    provider: "Xfinity 300 Mbps",
    cost: 45,
    speed: 300, uploadSpeed: 20,
    datacap: false,
    contractMonths: 0,
    equipmentFee: 0,
    availability: "Xfinity available in virtually all Loop buildings",
    notes: [
      "Most widely available option in Loop MDU buildings",
      "WiFi equipment included, unlimited data",
      "5-year price guarantee for new customers",
    ],
    bestFor: "Buildings where Astound/T-Mobile aren't available",
    caveats: "5-year price lock requires AutoPay from a bank account + paperless billing",
  },
  {
    provider: "Astound (RCN) 1 Gig",
    cost: 50,
    speed: 1000, uploadSpeed: 50,
    datacap: false,
    contractMonths: 0,
    availability: "Available in select Loop buildings — check astound.com",
    notes: [
      "Gigabit for $50/mo with AutoPay — best price-per-Mbps in Chicago",
      "No data caps, no annual contract",
      "Symmetrical upload only available on select routes — verify",
    ],
    bestFor: "Power users, home studios, or anyone sharing with roommates",
  },
  {
    provider: "Xfinity 1 Gig",
    cost: 70,
    speed: 1000, uploadSpeed: 35,
    datacap: false,
    contractMonths: 0,
    equipmentFee: 0,
    availability: "Available across all Loop ZIPs",
    notes: [
      "Best for 4+ person households or heavy streamers/gamers",
      "WiFi equipment included; 5-year price guarantee with AutoPay + paperless billing",
    ],
    bestFor: "Large households or home offices with heavy bandwidth needs",
    caveats: "Most people don't need gigabit — 200-300 Mbps is plenty for 2-3 devices",
  },
];

// ── TRANSIT ────────────────────────────────────────────────
// Reality check as a Loop commuter:
// - CTA 30-Day Pass ($75) only worth it if you take 30+ rides/month (about 7/week)
// - Below that, pay-per-ride ($2.50 L, $2.25 bus, free transfers) is cheaper
// - 2026 fare hikes were cancelled after the Oct 2025 state transit funding bill
// - Metra is NOT a substitute for CTA — it's suburb-to-Loop only
// - Divvy is useful for last-mile, NOT a commuter solution
// - Rideshare in the Loop is brutal ($12-25 avg) — almost never worth it daily
// - Parking in Loop garages: $25-45/day, $300-500/mo for monthly contracts

export interface TransitOption {
  label: string;
  officialCost: number;
  costNote: string;
  type: "cta"|"metra"|"other";
}

export const TRANSIT_OPTIONS: Record<string, TransitOption> = {
  "cta-monthly": {
    label: "CTA 30-Day Unlimited Pass (Ventra)",
    officialCost: 75,
    costNote: "Official CTA fare (unchanged for 2026)",
    type: "cta",
  },
  "cta-reduced": {
    label: "CTA Reduced Fare 30-Day Pass",
    officialCost: 35,
    costNote: "Requires a Reduced Fare permit — seniors 65+, riders with disabilities, Medicare card holders",
    type: "cta",
  },
  "cta-perride": {
    label: "CTA Pay-Per-Ride (Ventra Card)",
    officialCost: 2.50,  // L fare; bus is $2.25
    costNote: "$2.50/ride on the L, $2.25 on the bus. Up to 2 free transfers within 2 hours.",
    type: "cta",
  },
  "metra-monthly-a": {
    label: "Metra Monthly Pass – Zones 1–2",
    officialCost: 75,
    costNote: "Chicago + inner-ring stations. Covers systemwide weekend travel.",
    type: "metra",
  },
  "metra-monthly-b": {
    label: "Metra Monthly Pass – Zones 1–3",
    officialCost: 110,
    costNote: "Mid-distance suburban commute",
    type: "metra",
  },
  "metra-monthly-c": {
    label: "Metra Monthly Pass – Zones 1–4",
    officialCost: 135,
    costNote: "Outer suburbs to downtown",
    type: "metra",
  },
  "metra-10ride": {
    label: "Metra Day Pass 5-Pack",  // replaced the 10-Ride Ticket in 2024
    officialCost: 0, // varies by zone ($35.75–$64.25)
    costNote: "5 Day Passes usable within 90 days. Good for 2-3 days/week.",
    type: "metra",
  },
  "rideshare": {
    label: "Rideshare (Uber / Lyft)",
    officialCost: 15, // avg per trip in Loop
    costNote: "Chicago Loop avg: $12-18/trip, surge pricing common during rush",
    type: "other",
  },
  "car": {
    label: "Personal Car (parking + gas + insurance)",
    officialCost: 400, // conservative monthly estimate for Loop
    costNote: "Loop parking monthly contract: $280-480. Daily: $25-45. Gas + wear add $100+",
    type: "other",
  },
  "divvy": {
    label: "Divvy Bike Share",
    officialCost: 11.99, // $143.90/yr ÷ 12
    costNote: "$143.90/year annual membership ($99 for new or lapsed members). Unlimited 45-min classic rides.",
    type: "other",
  },
};

// ── INSURANCE ──────────────────────────────────────────────
// Reality check as a Chicago Loop resident:
// RENTERS: Chicago average is ~$23/mo; $12-17 covers most Loop studio/1BR renters
// AUTO: Loop residents drive less than suburbanites — usage-based insurance (Root, Clearcover)
//       often saves 20-35%. Monthly parking in a garage also means less theft risk.
// HEALTH: ACA marketplace plans via Get Covered Illinois (state-run since the 2026 plan year).
//         Enhanced federal subsidies expired Dec 31, 2025; standard subsidies still apply.
//         Illinois now loads silver premiums, so gold can be cheaper than silver.
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
      monthly: 12,
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
      provider: "Allstate Renters",
      monthly: 16,
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
      monthly: 17,
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
      monthly: 169,
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
    // ACA Marketplace plans, 2026 plan year
    // Estimates based on KFF 2026 Illinois averages for a 40-year-old before subsidies:
    // benchmark silver $646, lowest bronze $389, lowest gold ~83% of benchmark silver.
    // Actual premiums vary by age, county and income.
    {
      provider: "Ambetter Balanced Care (Silver)",
      monthly: 620,
      deductible: 5000,
      coverage: "standard",
      network: "Cook County Medicaid-expansion network",
      notes: [
        "ACA Silver — benchmark plan for subsidy calculations",
        "Telehealth included at $0 copay",
        "Check subsidy eligibility — eligible Illinois enrollees saved ~$688/mo on average in 2026",
        "In-network: Cook County Health, Loretto Hospital",
      ],
      bestFor: "Loop residents who qualify for ACA subsidies",
      warnings: "Check your subsidy eligibility at getcoveredillinois.gov — many Loop residents pay far less than sticker price",
    },
    {
      provider: "Oscar Health Silver",
      monthly: 646,
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
      monthly: 389,
      deductible: 8700,
      coverage: "basic",
      network: "Cook County network",
      notes: [
        "Lowest monthly premium on ACA marketplace",
        "High deductible — best for young, healthy people who rarely use healthcare",
        "Free preventive care (annual physical, vaccines)",
      ],
      bestFor: "Healthy 20-35yo Loop residents who want lowest monthly cost",
      warnings: "High deductible ($8,700) means you pay most costs out of pocket until met. Molina is leaving the Illinois marketplace after 2026 — plan to re-shop at open enrollment.",
    },
    {
      provider: "BCBS of IL PPO Gold",
      monthly: 536,
      deductible: 1500,
      coverage: "premium",
      network: "Widest Chicago network — Rush, NMH, UI Health, Advocate",
      notes: [
        "Every major Loop hospital system in-network",
        "Lower deductible than Silver — and in 2026 Illinois gold often costs less than silver",
        "PPO means no referrals needed — see any in-network specialist directly",
        "Best if you have ongoing medical needs or specialist visits",
      ],
      bestFor: "Loop residents with chronic conditions or who use healthcare frequently",
    },
  ],
};
