import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { LOOP_ZIPS } from "@/lib/plans";
import { calcDiscountMultiplier, analyzeMobile, analyzeInternet, analyzeTransit, analyzeInsurance } from "@/lib/engine";

const schema = z.object({
  zip: z.string().length(5),
  categories: z.array(z.enum(["mobile","internet","transit","insurance"])),
  bills: z.object({
    mobile:    z.object({ provider:z.string().default(""), cost:z.number().min(0), data:z.string().default("unlimited"), lines:z.number().min(1).default(1), hotspot:z.boolean().default(false), intl:z.boolean().default(false) }).optional(),
    internet:  z.object({ provider:z.string().default(""), cost:z.number().min(0), speed:z.number().min(0).default(100), datacap:z.enum(["yes","no"]).default("no") }).optional(),
    transit:   z.object({ mode:z.string().default("cta-monthly"), cost:z.number().min(0), freq:z.number().min(0).default(10), commute:z.enum(["loop-only","suburb-loop","mixed"]).default("loop-only") }).optional(),
    insurance: z.object({
      policies: z.array(z.object({
        insType:    z.enum(["renters","auto","health"]),
        cost:       z.number().min(0),
        deductible: z.number().default(500),
        coverage:   z.enum(["basic","standard","premium"]).default("standard"),
      })).default([]),
    }).optional(),
  }),
  discounts: z.array(z.enum(["veteran","disability","senior","frontline","lowincome","child","none"])).default([]),
  childCount: z.number().default(1),
  budget: z.object({ total: z.string().optional() }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const p = schema.safeParse(body);
    if (!p.success) return NextResponse.json({ error: "Invalid input", details: p.error.flatten() }, { status: 400 });

    const { zip, categories, bills, discounts, childCount, budget } = p.data;

    if (!LOOP_ZIPS.has(zip)) {
      return NextResponse.json({ error: `ZIP ${zip} is outside the Chicago Loop. WindyWallet only covers the 10 Loop ZIP codes.` }, { status: 400 });
    }

    const discMult = calcDiscountMultiplier(discounts, childCount);
    const results  = [];

    if (categories.includes("mobile")    && bills?.mobile)    results.push(analyzeMobile(bills.mobile as any, discMult, discounts));
    if (categories.includes("internet")  && bills?.internet)  results.push(analyzeInternet(bills.internet as any, discMult, discounts));
    if (categories.includes("transit")   && bills?.transit)   results.push(analyzeTransit(bills.transit as any, discounts));
    if (categories.includes("insurance") && bills?.insurance) {
      const { policies } = bills.insurance;
      if (policies.length > 0) {
        // Analyze each policy individually and combine into one ComparisonResult
        const perPolicy = policies.map(pol => analyzeInsurance(pol as any, discMult, discounts));
        const totalCurrent = perPolicy.reduce((s, r) => s + r.currentCost, 0);
        const totalAlt     = perPolicy.reduce((s, r) => s + (r.altCost ?? r.currentCost), 0);
        const totalSaving  = perPolicy.reduce((s, r) => s + r.saving, 0);
        const labels       = perPolicy.map(r => r.label).join(" + ");
        const anyOptimal   = perPolicy.every(r => r.alreadyOptimal);
        // Build a merged result
        results.push({
          ...perPolicy[0],
          label: labels,
          currentCost: Math.round(totalCurrent * 100) / 100,
          altCost:     Math.round(totalAlt     * 100) / 100,
          saving:      Math.round(totalSaving  * 100) / 100,
          annualSaving: Math.round(totalSaving * 12 * 100) / 100,
          alreadyOptimal: anyOptimal,
          currentFeatures: perPolicy.flatMap(r => r.currentFeatures ?? []),
          altFeatures:     perPolicy.flatMap(r => r.altFeatures     ?? []),
          optimalReason:   anyOptimal ? perPolicy.map(r => r.optimalReason).filter(Boolean).join(" | ") : undefined,
          note: perPolicy.map(r => r.note).filter(Boolean).join(" ") || undefined,
        });
      }
    }

    const totalMonthlySavings = Math.round(results.reduce((s, r) => s + r.saving, 0) * 100) / 100;
    const totalAnnualSavings  = Math.round(totalMonthlySavings * 12 * 100) / 100;
    const budgetTotal         = parseFloat(budget?.total || "0");
    const budgetImpactPct     = budgetTotal > 0 ? Math.round((totalMonthlySavings / budgetTotal) * 100 * 10) / 10 : undefined;

    return NextResponse.json({
      success: true, zip,
      discountMultiplier: Math.round(discMult * 100 * 10) / 10,
      totalMonthlySavings, totalAnnualSavings, budgetImpactPct,
      results,
      generatedAt: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Analysis failed. Please try again." }, { status: 500 });
  }
}
