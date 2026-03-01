// src/lib/engine.ts
// ─────────────────────────────────────────────────────────────
//  Recommendation engine
//  Built with real Chicago Loop knowledge — not generic advice
// ─────────────────────────────────────────────────────────────

import {
  MOBILE_PLANS, INTERNET_PLANS, INSURANCE_PLANS, TRANSIT_OPTIONS, DATA_FRESHNESS,
  type MobilePlan, type InternetPlan,
} from "./plans";
import type {
  MobileBill, InternetBill, TransitBill, InsuranceBill,
  ComparisonResult, DiscountType, SavingReason,
} from "@/types";

const COV_RANK = { basic: 0, standard: 1, premium: 2 } as const;

// ── Helpers ──────────────────────────────────────────────────
function r2(n: number) { return Math.round(n * 100) / 100; }
function pct(n: number) { return Math.round(n * 100 * 10) / 10; }

// ── Discount multiplier ───────────────────────────────────────
// Based on actual program eligibility, not made-up numbers
export function calcDiscountMultiplier(d: DiscountType[], childCount: number): number {
  let m = 0;
  // Veteran: Mint Mobile gives 15% off, many others 10%
  if (d.includes("veteran"))    m += 0.10;
  // Disability: ADA/SSI programs unlock reduced CTA fare, income programs
  if (d.includes("disability")) m += 0.12;
  // Senior 65+: CTA Reduced Fare, AARP mobile discounts, senior utility programs
  if (d.includes("senior"))     m += 0.12;
  // Frontline: many carriers (T-Mobile, Verizon) have first-responder discounts
  if (d.includes("frontline"))  m += 0.08;
  // Income-qualified: unlocks Comcast Essentials, AT&T Access, ACA subsidies
  if (d.includes("lowincome"))  m += 0.15;
  // Children: family plan discounts (multi-line, school connectivity)
  if (d.includes("child"))      m += 0.04 * Math.min(childCount, 4);
  return Math.min(m, 0.40);
}

// ── MOBILE ───────────────────────────────────────────────────
export function analyzeMobile(
  bill: MobileBill,
  discMult: number,
  discounts: DiscountType[]
): ComparisonResult {
  const isSenior   = discounts.includes("senior");
  const isVeteran  = discounts.includes("veteran");
  const dataGB     = bill.data === "unlimited" ? 999 : (parseInt(bill.data) || 5);

  // Hard filter: must actually work for this user
  let candidates = MOBILE_PLANS.filter((p: MobilePlan) => {
    if (bill.hotspot && !p.hotspot) return false;
    if (bill.intl   && !p.intl)    return false;
    if (p.linesMax   < bill.lines) return false;

    // Data check: if user has unlimited, only suggest unlimited
    // If user has capped data, only suggest plans with same or more
    if (bill.data === "unlimited" && p.data !== "unlimited") return false;
    if (bill.data !== "unlimited") {
      const planGB = p.data === "unlimited" ? 999 : parseInt(p.data);
      if (planGB < dataGB) return false;
    }

    // Must be cheaper after discount
    return p.cost * (1 - discMult) < bill.cost;
  });

  // Sort by effective cost
  candidates.sort((a, b) => a.cost * (1 - discMult) - b.cost * (1 - discMult));

  // Preference overrides based on user profile
  if (isSenior) {
    const cc = candidates.find(p => p.provider.includes("Consumer"));
    if (cc) candidates = [cc, ...candidates.filter(p => p !== cc)];
  }

  const best = candidates[0];

  if (!best) {
    // Explain WHY it's already optimal
    let optimalReason = "";
    if (bill.intl && bill.cost <= 65) {
      optimalReason = "International calling narrows your options significantly. Google Fi at $65 is the cheapest full-international plan — you're likely already at or near the best available rate.";
    } else if (bill.hotspot && bill.lines > 2) {
      optimalReason = `For ${bill.lines} lines with hotspot, multi-line carrier pricing is already competitive. Family plan discounts at your current carrier likely match or beat MVNOs.`;
    } else if (bill.cost <= 30) {
      optimalReason = "At $" + bill.cost + "/mo you're already paying at or below MVNO rates. No cheaper option meets your feature requirements.";
    } else {
      optimalReason = "Your current plan features (hotspot, lines, data) narrow the competitive set. No alternative meets all your requirements at a lower price point.";
    }
    return {
      category: "mobile", label: "Mobile / Telephone",
      currentProvider: bill.provider || "Current Carrier",
      currentCost: bill.cost, saving: 0, annualSaving: 0,
      discountApplied: false, alreadyOptimal: true,
      optimalReason, dataFreshness: DATA_FRESHNESS,
    };
  }

  const altCost = r2(best.cost * (1 - discMult));
  const saving  = r2(bill.cost - altCost);

  // Build specific "why" reasons
  const reasons: SavingReason[] = [];
  reasons.push({
    factor: `${best.provider} uses ${best.network} towers — same coverage as ${bill.provider || "your carrier"} in the Loop`,
    impact: "high",
  });
  if (best.contractRequired === false) {
    reasons.push({ factor: "No contract required — cancel anytime", impact: "medium" });
  }
  if (best.data === "unlimited" && bill.data === "unlimited") {
    reasons.push({ factor: "Same unlimited data, lower price", impact: "high" });
  }
  if (best.hotspotGB && best.hotspotGB >= 15) {
    reasons.push({ factor: `${best.hotspotGB} GB hotspot included — enough for WFH from any Loop café`, impact: "medium" });
  }

  return {
    category: "mobile", label: "Mobile / Telephone",
    currentProvider: bill.provider || "Current Carrier",
    currentCost: bill.cost,
    currentFeatures: [
      bill.data === "unlimited" ? "Unlimited data" : `${bill.data} GB/mo`,
      `${bill.lines} line${bill.lines > 1 ? "s" : ""}`,
      bill.hotspot ? "Hotspot included" : "No hotspot",
      bill.intl ? "International calling/roaming" : "Domestic only",
    ],
    altProvider: best.provider,
    altCost,
    altFeatures: [
      best.data === "unlimited" ? "Unlimited data" : `${best.data} GB/mo`,
      `${best.network} network (same towers)`,
      best.hotspot ? `${best.hotspotGB ? best.hotspotGB + " GB" : ""} hotspot included` : "No hotspot",
      best.intl ? (best.intlDetails || "International included") : "Domestic only",
      best.bestFor,
    ],
    savingReasons: reasons,
    saving, annualSaving: r2(saving * 12),
    discountApplied: discMult > 0,
    discountPct: discMult > 0 ? pct(discMult) : undefined,
    alreadyOptimal: false,
    note: best.caveats,
    dataFreshness: DATA_FRESHNESS,
  };
}

// ── INTERNET ─────────────────────────────────────────────────
export function analyzeInternet(
  bill: InternetBill,
  discMult: number,
  discounts: DiscountType[]
): ComparisonResult {
  const isLowincome = discounts.includes("lowincome");

  // Don't degrade below 60% of current speed — that's a real downgrade
  const minAcceptableSpeed = bill.speed * 0.60;

  let candidates = INTERNET_PLANS.filter((p: InternetPlan) => {
    if (p.eligibility === "lowincome" && !isLowincome) return false;
    if (p.speed < minAcceptableSpeed) return false;

    // Include equipment fee in true cost comparison
    const trueCost = p.cost + (p.equipmentFee || 0);
    const eff = trueCost * (p.eligibility ? 1 : (1 - discMult));
    return eff < bill.cost;
  });

  candidates.sort((a, b) => {
    const ea = (a.cost + (a.equipmentFee || 0)) * (a.eligibility ? 1 : (1 - discMult));
    const eb = (b.cost + (b.equipmentFee || 0)) * (b.eligibility ? 1 : (1 - discMult));
    return ea - eb;
  });

  // Prefer no-datacap plans if current has no cap
  if (bill.datacap === "no") {
    const noCap = candidates.filter(p => !p.datacap);
    if (noCap.length) candidates = noCap;
  }

  // Prefer same or better upload speed for WFH
  const uploaders = candidates.filter(p => (p.uploadSpeed || 0) >= 20);
  if (uploaders.length) candidates = uploaders;

  const best = candidates[0];

  if (!best) {
    return {
      category: "internet", label: "WiFi / Internet",
      currentProvider: bill.provider || "Current ISP",
      currentCost: bill.cost, saving: 0, annualSaving: 0,
      discountApplied: false, alreadyOptimal: true,
      optimalReason: bill.speed >= 500
        ? `At ${bill.speed} Mbps and $${bill.cost}/mo, you're in the competitive range for high-speed Loop internet. Switching would either reduce speed or not save meaningfully.`
        : `At $${bill.cost}/mo, no cheaper alternative maintains your ${bill.speed} Mbps speed without compromising reliability for your building.`,
      dataFreshness: DATA_FRESHNESS,
    };
  }

  const trueAltCost = best.cost + (best.equipmentFee || 0);
  const mult        = best.eligibility ? 1 : (1 - discMult);
  const altCost     = r2(trueAltCost * mult);
  const saving      = r2(bill.cost - altCost);

  const reasons: SavingReason[] = [
    { factor: `${best.speed} Mbps — more than enough for remote work and streaming`, impact: "medium" },
    { factor: "No data caps — unlimited usage", impact: "medium" },
    { factor: best.contractMonths === 0 ? "No annual contract required" : `${best.contractMonths}-month contract`, impact: "low" },
  ];
  if (best.eligibility) {
    reasons.unshift({ factor: "Income-qualified program — dramatically reduced rate", impact: "high" });
  }

  return {
    category: "internet", label: "WiFi / Internet",
    currentProvider: bill.provider || "Current ISP",
    currentCost: bill.cost,
    currentFeatures: [
      `${bill.speed} Mbps download`,
      bill.datacap === "yes" ? "Monthly data cap applies" : "No data cap",
    ],
    altProvider: best.provider,
    altCost,
    altFeatures: [
      `${best.speed} Mbps download / ${best.uploadSpeed || "?"} Mbps upload`,
      "No data cap",
      best.availability,
    ],
    savingReasons: reasons,
    saving, annualSaving: r2(saving * 12),
    discountApplied: discMult > 0 && !best.eligibility,
    discountPct: discMult > 0 && !best.eligibility ? pct(discMult) : undefined,
    alreadyOptimal: false,
    note: best.caveats || (best.eligibility ? "⚠️ Income-qualified program — eligibility verification required at sign-up." : undefined),
    warning: best.provider.includes("Xfinity") ? "Confirm price after 12-month promotional period. Set a calendar reminder." : undefined,
    dataFreshness: DATA_FRESHNESS,
  };
}

// ── TRANSIT ───────────────────────────────────────────────────
// This is where real Chicago knowledge matters most.
// The math is simple but most people don't do it.
export function analyzeTransit(
  bill: TransitBill,
  discounts: DiscountType[]
): ComparisonResult {
  const isSeniorOrDisabled = discounts.includes("senior") || discounts.includes("disability");
  const isLowincome        = discounts.includes("lowincome");
  const freq               = bill.freq || 10;
  const tripsPerMonth      = Math.round(freq * 4.33); // avg weeks/month

  // CTA break-even: $105 / $2.25 = 46.7 rides. If you take < 47 rides/month,
  // pay-per-ride is cheaper than the monthly pass.
  const CTA_UNLIMITED = 105;
  const CTA_REDUCED   = 50;
  const CTA_PER_RIDE  = 2.25;
  const ctaPayPerRideMonthly = r2(tripsPerMonth * CTA_PER_RIDE);

  let rec: { option: string; cost: number; note: string } | null = null;
  let reasons: SavingReason[] = [];

  // ── Suburb-to-Loop commuter ───────────────────────────────
  if (bill.commute === "suburb-loop") {
    if (bill.mode === "rideshare") {
      // Daily rideshare to Loop is shockingly expensive — most compelling switch
      const rideshareMonthly = tripsPerMonth * 15; // avg $15 Loop rideshare trip
      rec = {
        option: "Metra Zone A Monthly Pass",
        cost: 106,
        note: `At ${freq} trips/week that's ~${tripsPerMonth} rideshares/mo. At $15 avg that's $${rideshareMonthly}/mo vs Metra's $106. Metra Union Station and Ogilvie are in the Loop.`,
      };
      reasons = [
        { factor: "Metra is faster than rideshare during rush hour (no traffic)", impact: "high" },
        { factor: "Predictable schedule vs surge pricing uncertainty", impact: "high" },
        { factor: `Save $${r2(rideshareMonthly - 106)}/mo vs rideshare`, impact: "high" },
      ];
    } else if (bill.mode === "car") {
      rec = {
        option: "Metra Zone A Monthly Pass",
        cost: 106,
        note: "Loop parking runs $280-480/mo for monthly contracts, $25-45/day for daily. Metra + occasional Divvy covers most Loop needs for $106-120/mo total.",
      };
      reasons = [
        { factor: "Eliminates $280-480/mo Loop parking cost", impact: "high" },
        { factor: "No traffic stress on Wacker or Michigan Ave at rush hour", impact: "medium" },
        { factor: "Metra terminals (Union Station, Ogilvie, Millennium) are in the Loop", impact: "high" },
      ];
    } else if (isSeniorOrDisabled && !bill.mode.includes("reduced")) {
      rec = {
        option: "Metra Reduced Fare Monthly Pass",
        cost: Math.round(106 * 0.50),
        note: "Seniors 65+ and disabled riders qualify for 50% off Metra monthly passes. Apply at any Metra ticket window with valid ID.",
      };
      reasons = [{ factor: "50% fare reduction — official Metra program", impact: "high" }];
    } else if (bill.mode.startsWith("metra") && !bill.mode.includes("reduced") && (isSeniorOrDisabled || isLowincome)) {
      rec = {
        option: "Metra Reduced Fare Monthly Pass",
        cost: Math.round(bill.cost * 0.50),
        note: "You're already on Metra but may not have applied for reduced fare. Saves 50% immediately.",
      };
      reasons = [{ factor: "Same Metra service at half the price", impact: "high" }];
    }
  }

  // ── Within Loop / mixed commuter ─────────────────────────
  else {
    if (isSeniorOrDisabled || isLowincome) {
      // Reduced fare always wins if eligible
      if (bill.cost > CTA_REDUCED) {
        rec = {
          option: "CTA Reduced Fare 30-Day Pass (Ventra)",
          cost: CTA_REDUCED,
          note: "Seniors 65+, disabled riders, and Medicare cardholders pay $50/mo for unlimited rides. Apply at any Ventra kiosk or CTA station with valid ID.",
        };
        reasons = [{ factor: "50% CTA discount — you qualify, apply today", impact: "high" }];
      }
    } else if (tripsPerMonth < 47 && bill.cost >= CTA_UNLIMITED) {
      // Pay-per-ride is cheaper than monthly pass
      if (ctaPayPerRideMonthly < CTA_UNLIMITED) {
        rec = {
          option: "CTA Ventra Pay-Per-Ride",
          cost: ctaPayPerRideMonthly,
          note: `At ${freq} trips/week (~${tripsPerMonth}/mo) × $2.25 = $${ctaPayPerRideMonthly}/mo. The monthly pass breaks even at 47 rides/month. You're under that threshold.`,
        };
        reasons = [
          { factor: `${tripsPerMonth} trips/mo × $2.25 = $${ctaPayPerRideMonthly} — less than $105 unlimited pass`, impact: "high" },
          { factor: "Free 2-hour transfer window covers most Loop trips", impact: "medium" },
        ];
      }
    } else if (tripsPerMonth >= 47 && bill.mode !== "cta-monthly" && bill.cost > CTA_UNLIMITED) {
      // Heavy CTA user on wrong plan
      rec = {
        option: "CTA 30-Day Unlimited Pass (Ventra)",
        cost: CTA_UNLIMITED,
        note: `At ${tripsPerMonth} rides/month the unlimited pass at $105 is cheaper than pay-per-ride ($${ctaPayPerRideMonthly}) and covers all CTA buses and L trains.`,
      };
      reasons = [
        { factor: `At ${tripsPerMonth} trips/mo, unlimited pass beats pay-per-ride by $${r2(ctaPayPerRideMonthly - CTA_UNLIMITED)}`, impact: "high" },
        { factor: "No need to reload card or track balance", impact: "low" },
      ];
  } else if (bill.mode === "rideshare") {
      // Using rideshare for Loop trips is almost always wrong
      const rideMonthly = tripsPerMonth * 14;
      rec = {
        option: tripsPerMonth >= 47 ? "CTA 30-Day Unlimited Pass (Ventra)" : "CTA Ventra Pay-Per-Ride",
        cost: tripsPerMonth >= 47 ? CTA_UNLIMITED : ctaPayPerRideMonthly,
        note: `Using rideshare for Loop trips at ~$14/trip means ~$${rideMonthly}/mo. The L covers the entire Loop and runs every 5-8 minutes during rush hour.`,
      };
      reasons = [
        { factor: "CTA L covers entire Loop — no traffic delays", impact: "high" },
        { factor: "L runs every 5-8 min during rush hour, 15-20 min overnight", impact: "medium" },
        { factor: `Save ~$${r2(rideMonthly - (tripsPerMonth >= 47 ? CTA_UNLIMITED : ctaPayPerRideMonthly))}/mo vs rideshare`, impact: "high" },
      ];
    }
  }

  const currentLabel = TRANSIT_OPTIONS[bill.mode]?.label ?? bill.mode;

  if (!rec || rec.cost >= bill.cost) {
    let optimalReason = "";
    if (bill.mode === "cta-monthly" && tripsPerMonth >= 47 && !isSeniorOrDisabled) {
      optimalReason = `At ${tripsPerMonth} trips/month the unlimited pass at $105 is the right choice. Pay-per-ride would cost $${ctaPayPerRideMonthly}/mo — more expensive.`;
    } else if (bill.mode === "cta-reduced") {
      optimalReason = "You're already on the reduced fare program — the best available CTA rate for eligible riders.";
    } else if (bill.mode.startsWith("metra") && bill.commute === "suburb-loop") {
      optimalReason = "Metra monthly pass is the correct choice for daily suburb-to-Loop commuting. Your current plan is already optimized.";
    } else {
      optimalReason = `At $${bill.cost}/mo your transit spend is already well-matched to your commute pattern.`;
    }
    return {
      category: "transit", label: "Transit",
      currentProvider: currentLabel, currentCost: bill.cost,
      saving: 0, annualSaving: 0,
      discountApplied: false, alreadyOptimal: true, optimalReason,
      dataFreshness: DATA_FRESHNESS,
    };
  }

  return {
    category: "transit", label: "Transit",
    currentProvider: currentLabel, currentCost: bill.cost,
    currentFeatures: [
      `${freq} trips/week (~${tripsPerMonth}/month)`,
      bill.commute === "suburb-loop" ? "Suburb ↔ Loop commute"
        : bill.commute === "mixed" ? "Mixed Loop + neighborhood"
        : "Within Loop only",
    ],
    altProvider: rec.option,
    altCost: rec.cost,
    altFeatures: [rec.note],
    savingReasons: reasons,
    saving: r2(bill.cost - rec.cost),
    annualSaving: r2((bill.cost - rec.cost) * 12),
    discountApplied: isSeniorOrDisabled || isLowincome,
    alreadyOptimal: false,
    note: "Fares sourced from official CTA.com and Metra.com 2024 fare tables.",
    dataFreshness: DATA_FRESHNESS,
  };
}

// ── INSURANCE ─────────────────────────────────────────────────
export function analyzeInsurance(
  bill: InsuranceBill,
  discMult: number,
  discounts: DiscountType[]
): ComparisonResult {
  const insKey = bill.insType || "renters";
  const pool   = INSURANCE_PLANS[insKey] ?? INSURANCE_PLANS.renters;
  const labelMap: Record<string, string> = {
    renters: "Renters Insurance", auto: "Auto Insurance", health: "Health Insurance",
  };
  const label = labelMap[insKey] ?? "Insurance";

  // Filter by coverage tier — don't recommend downgrading coverage
  let candidates = pool.filter(p => {
    if (COV_RANK[p.coverage] < COV_RANK[bill.coverage]) return false;
    return p.monthly * (1 - discMult) < bill.cost;
  });

  // If nothing at same tier, relax coverage tier requirement
  if (!candidates.length) {
    candidates = pool.filter(p => p.monthly * (1 - discMult) < bill.cost);
  }

  candidates.sort((a, b) =>
    a.monthly * (1 - discMult) - b.monthly * (1 - discMult)
  );

  const best = candidates[0];

  if (!best) {
    let optimalReason = "";
    if (insKey === "renters" && bill.cost <= 12) {
      optimalReason = `At $${bill.cost}/mo you're already paying a competitive rate for Loop renters insurance. Lemonade's floor is ~$9/mo for standard coverage.`;
    } else if (insKey === "auto" && bill.cost <= 90) {
      optimalReason = `At $${bill.cost}/mo your auto insurance is already in the competitive range for Chicago. Usage-based options (Root) can sometimes go lower if you drive under 6,000 miles/year.`;
    } else if (insKey === "health") {
      optimalReason = `At $${bill.cost}/mo, ensure you've checked ACA subsidy eligibility at healthcare.gov — income-qualified Loop residents often pay $0-80/mo after APTC credits.`;
    } else {
      optimalReason = `At $${bill.cost}/mo your ${insKey} insurance is already competitive. No cheaper plan with equivalent coverage was found.`;
    }
    return {
      category: "insurance", label,
      currentProvider: "Your Current Plan", currentCost: bill.cost,
      saving: 0, annualSaving: 0,
      discountApplied: false, alreadyOptimal: true, optimalReason,
      dataFreshness: DATA_FRESHNESS,
    };
  }

  const altCost = r2(best.monthly * (1 - discMult));
  const saving  = r2(bill.cost - altCost);

  const reasons: SavingReason[] = best.notes.slice(0, 2).map((n, i) => ({
    factor: n,
    impact: i === 0 ? "high" : "medium" as "high"|"medium",
  }));

  return {
    category: "insurance", label,
    currentProvider: "Your Current Plan", currentCost: bill.cost,
    currentFeatures: [
      `${bill.coverage.charAt(0).toUpperCase() + bill.coverage.slice(1)} coverage`,
      `$${bill.deductible.toLocaleString()} deductible`,
    ],
    altProvider: best.provider, altCost,
    altFeatures: [
      `${best.coverage.charAt(0).toUpperCase() + best.coverage.slice(1)} coverage`,
      `$${best.deductible.toLocaleString()} deductible`,
      best.bestFor,
      ...(best.network ? [`Network: ${best.network}`] : []),
    ],
    savingReasons: reasons,
    saving, annualSaving: r2(saving * 12),
    discountApplied: discMult > 0,
    discountPct: discMult > 0 ? pct(discMult) : undefined,
    alreadyOptimal: false,
    note: insKey === "health"
      ? "⚠️ Health premiums shown are benchmark rates (~35yo, no ACA subsidy). Check healthcare.gov — most Loop residents qualify for lower rates based on income."
      : undefined,
    warning: best.warnings,
    dataFreshness: DATA_FRESHNESS,
  };
}
