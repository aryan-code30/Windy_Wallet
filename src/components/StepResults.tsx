"use client";
import { useState } from "react";
import { Eyebrow, PageTitle, Grad, Notice, Skeleton, BtnRow, Btn } from "./ui";
import MonthlyHistory from "./MonthlyHistory";
import type { AnalyzeResponse, ComparisonResult, FormState, DiscountType } from "@/types";

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ── Skeleton loading state ────────────────────────────
function ResultsSkeleton() {
  return (
    <div className="animate-fade-up">
      {/* Hero skeleton */}
      <div className="rounded-2xl p-10 mb-6" style={{ background: "linear-gradient(135deg,#EFF6FF,#F5F3FF)" }}>
        <Skeleton h="h-4" w="w-32" rounded="rounded-full" />
        <div className="mt-3 mb-2"><Skeleton h="h-16" w="w-48" rounded="rounded-xl" /></div>
        <Skeleton h="h-4" w="w-56" rounded="rounded-lg" />
        <div className="flex gap-2 mt-5">
          {[1,2,3].map(i => <Skeleton key={i} h="h-7" w="w-28" rounded="rounded-full" />)}
        </div>
      </div>
      {/* Summary skeleton */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[1,2,3].map(i => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <Skeleton h="h-7" w="w-20" rounded="rounded-lg" />
            <Skeleton h="h-3" w="w-24" rounded="rounded" className="mt-2" />
          </div>
        ))}
      </div>
      {/* Card skeletons */}
      {[1,2].map(i => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl shadow-card mb-4 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Skeleton h="h-8" w="w-8" rounded="rounded-lg" />
              <Skeleton h="h-4" w="w-32" rounded="rounded" />
            </div>
            <Skeleton h="h-6" w="w-24" rounded="rounded-full" />
          </div>
          <div className="px-6 py-5 grid grid-cols-[1fr_36px_1fr] gap-4">
            {[0,1].map(j => (
              <div key={j} className={j === 1 ? "flex items-center justify-center pt-8" : ""}>
                {j === 1
                  ? <Skeleton h="h-7" w="w-7" rounded="rounded-full" />
                  : <>
                    <Skeleton h="h-3" w="w-20" rounded="rounded" />
                    <Skeleton h="h-5" w="w-28" rounded="rounded-lg" className="mt-2" />
                    <Skeleton h="h-7" w="w-16" rounded="rounded-lg" className="mt-2" />
                    <Skeleton h="h-3" w="w-full" rounded="rounded" className="mt-3" />
                    <Skeleton h="h-3" w="w-4/5" rounded="rounded" className="mt-1.5" />
                  </>
                }
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="text-center text-sm text-gray-400 mt-4 flex items-center justify-center gap-2">
        <span className="inline-block w-4 h-4 rounded-full border-2 border-gray-300 border-t-primary animate-spin-slow" />
        Comparing against Loop-area plans and applying discounts…
      </p>
    </div>
  );
}

// ── Impact badge ──────────────────────────────────────
function ImpactBadge({ impact }: { impact: "high"|"medium"|"low" }) {
  const s = {
    high:   "bg-emerald-100 text-emerald-700",
    medium: "bg-blue-50 text-blue-600",
    low:    "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${s[impact]}`}>
      {impact}
    </span>
  );
}

// ── Individual comparison card ────────────────────────
const EMOJI: Record<string, string> = { mobile:"📱", internet:"📡", transit:"🚇", insurance:"🛡️" };
const ICON_BG: Record<string, string> = {
  mobile:"bg-blue-50", internet:"bg-violet-50", transit:"bg-emerald-50", insurance:"bg-purple-50",
};
type SavingsCategory = "all" | "cafes" | "restaurants" | "attractions" | "walking";

const SAVINGS_IDEAS = {
  under50: [
    {
      label: "Chicago Riverwalk stroll",
      note: "Free",
      map: "https://maps.google.com/?q=Chicago+Riverwalk",
      category: "walking" as const,
    },
    {
      label: "Millennium Park + Cloud Gate",
      note: "Free",
      map: "https://maps.google.com/?q=Millennium+Park+Chicago",
      category: "walking" as const,
    },
    {
      label: "The Loop Art Walk",
      note: "Free",
      map: "https://maps.google.com/?q=The+Loop+Chicago+public+art",
      category: "walking" as const,
    },
    {
      label: "Art Institute (IL resident discount days)",
      note: "$0–$25",
      map: "https://maps.google.com/?q=Art+Institute+of+Chicago",
      menu: "https://www.artic.edu/visit",
      category: "attractions" as const,
    },
    {
      label: "Chicago Cultural Center",
      note: "Free",
      map: "https://maps.google.com/?q=Chicago+Cultural+Center",
      menu: "https://www.chicago.gov/city/en/depts/dca/supp_info/chicago_culturalcenter.html",
      category: "attractions" as const,
    },
    {
      label: "Harold Washington Library Center",
      note: "Free",
      map: "https://maps.google.com/?q=Harold+Washington+Library+Center",
      category: "attractions" as const,
    },
    {
      label: "Cafecito — Cuban coffee + sandwich",
      note: "$12–$18",
      map: "https://maps.google.com/?q=Cafecito+Chicago+Loop",
      menu: "https://www.cafecitochicago.com/",
      items: ["Cortadito", "Café con leche", "Lechón sandwich"],
      category: "cafes" as const,
    },
    {
      label: "Dollop Coffee Co.",
      note: "$6–$12",
      map: "https://maps.google.com/?q=Dollop+Coffee+Chicago+Loop",
      menu: "https://dollopcoffee.com/",
      items: ["Cold brew", "Breakfast sandwich", "Oat milk latte"],
      category: "cafes" as const,
    },
    {
      label: "Fontano’s Subs (Loop)",
      note: "$10–$16",
      map: "https://maps.google.com/?q=Fontanos+Subs+Chicago+Loop",
      menu: "https://www.fontanosubs.com/",
      items: ["Italian sub", "Hot giardiniera", "Pasta salad"],
      category: "restaurants" as const,
    },
    {
      label: "Intelligentsia Coffee",
      note: "$6–$12",
      map: "https://maps.google.com/?q=Intelligentsia+Chicago+Loop",
      menu: "https://www.intelligentsia.com/pages/cafe-locations",
      items: ["Draft latte", "Seasonal latte", "Pour‑over"],
      category: "cafes" as const,
    },
    {
      label: "Oasis Cafe (cheap eats)",
      note: "$8–$15",
      map: "https://maps.google.com/?q=Oasis+Cafe+Chicago+Loop",
      menu: "https://www.oasiscafechicago.com/",
      items: ["Chicken shawarma", "Falafel wrap", "Lentil soup"],
      category: "restaurants" as const,
    },
    {
      label: "Revival Food Hall",
      note: "$15–$25",
      map: "https://maps.google.com/?q=Revival+Food+Hall",
      menu: "https://revivalfoodhall.com/",
      items: ["Tacos", "Noodle bowls", "Chicken sandwich"],
      category: "restaurants" as const,
    },
    {
      label: "Roti Mediterranean",
      note: "$11–$16",
      map: "https://maps.google.com/?q=Roti+Chicago+Loop",
      menu: "https://roti.com/menu/",
      items: ["Chicken kabob plate", "Steak roti", "Hummus"],
      category: "restaurants" as const,
    },
    {
      label: "Mr. Submarine (Loop)",
      note: "$10–$16",
      map: "https://maps.google.com/?q=Mr+Submarine+Chicago+Loop",
      menu: "https://www.mrsubmarine.com/",
      items: ["Italian sub", "Cheesesteak", "Fries"],
      category: "restaurants" as const,
    },
    {
      label: "Luke’s Italian Beef (Loop)",
      note: "$12–$18",
      map: "https://maps.google.com/?q=Luke%27s+Italian+Beef+Chicago+Loop",
      menu: "https://www.lukesitalianbeef.com/",
      items: ["Italian beef", "Combo beef + sausage", "Fries"],
      category: "restaurants" as const,
    },
    {
      label: "Naansense (Wacker)",
      note: "$12–$18",
      map: "https://maps.google.com/?q=Naansense+Chicago+Loop",
      menu: "https://naansense.com/",
      items: ["Naan bowl", "Naan wrap", "Masala fries"],
      category: "restaurants" as const,
    },
    {
      label: "Lou Malnati’s (personal pie)",
      note: "$18–$25",
      map: "https://maps.google.com/?q=Lou+Malnatis+Chicago+Loop",
      menu: "https://www.loumalnatis.com/chicago-loop",
      items: ["Personal deep‑dish", "Buttercrust slice", "House salad"],
      category: "restaurants" as const,
    },
    {
      label: "Beatrix Market (Loop)",
      note: "$12–$20",
      map: "https://maps.google.com/?q=Beatrix+Market+Chicago+Loop",
      menu: "https://www.beatrixrestaurants.com/market/",
      items: ["Chicken salad", "Seasonal bowls", "Fresh juices"],
      category: "restaurants" as const,
    },
  ],
  under100: [
    {
      label: "The Gage — Loop gastropub",
      note: "$35–$60",
      map: "https://maps.google.com/?q=The+Gage+Chicago",
      menu: "https://thegagechicago.com/",
      items: ["Bison burger", "Fish & chips", "Seasonal cocktail"],
      category: "restaurants" as const,
    },
    {
      label: "The Dearborn — American brasserie",
      note: "$30–$60",
      map: "https://maps.google.com/?q=The+Dearborn+Chicago",
      menu: "https://thedearborntavern.com/",
      items: ["Dearborn burger", "Short rib pappardelle", "Old fashioned"],
      category: "restaurants" as const,
    },
    {
      label: "Chicago Architecture Center (exhibit)",
      note: "$20–$40",
      map: "https://maps.google.com/?q=Chicago+Architecture+Center",
      menu: "https://www.architecture.org/visit/",
      items: ["Chicago: City of Architecture", "Skyscraper Gallery", "Model exhibit"],
      category: "attractions" as const,
    },
    {
      label: "Skydeck Chicago (Willis Tower)",
      note: "$35–$50",
      map: "https://maps.google.com/?q=Skydeck+Chicago",
      menu: "https://www.theskydeck.com/",
      items: ["The Ledge", "Sunset view"],
      category: "attractions" as const,
    },
    {
      label: "The Berghoff (historic German)",
      note: "$35–$70",
      map: "https://maps.google.com/?q=The+Berghoff+Restaurant+Chicago",
      menu: "https://www.berghoff.com/",
      items: ["Wiener schnitzel", "Reuben sandwich", "Apple strudel"],
      category: "restaurants" as const,
    },
    {
      label: "River cruise (classic tour)",
      note: "$45–$90",
      map: "https://maps.google.com/?q=Chicago+Architecture+River+Cruise",
      menu: "https://www.architecture.org/tours/",
      items: ["90‑minute architecture tour", "Evening skyline cruise"],
      category: "attractions" as const,
    },
    {
      label: "Cindy’s Rooftop (lounge bite)",
      note: "$40–$90",
      map: "https://maps.google.com/?q=Cindy%27s+Chicago",
      menu: "https://www.cindysrooftop.com/",
      items: ["Truffle fries", "Seasonal salad", "Signature cocktail"],
      category: "restaurants" as const,
    },
    {
      label: "Magnolia Bakery (treat stop)",
      note: "$8–$20",
      map: "https://maps.google.com/?q=Magnolia+Bakery+Chicago+Loop",
      menu: "https://www.magnoliabakery.com/",
      items: ["Banana pudding", "Cupcakes"],
      category: "cafes" as const,
    },
  ],
  under150: [
    {
      label: "Chicago Symphony Center (CSO ticket)",
      note: "$60–$140",
      map: "https://maps.google.com/?q=Chicago+Symphony+Center",
      menu: "https://cso.org/",
      items: ["Evening concert", "Classical masterworks"],
      category: "attractions" as const,
    },
    {
      label: "Theatre in the Loop (Broadway in Chicago)",
      note: "$60–$150",
      map: "https://maps.google.com/?q=Broadway+in+Chicago",
      menu: "https://www.broadwayinchicago.com/",
      items: ["Touring musical", "Playhouse show"],
      category: "attractions" as const,
    },
    {
      label: "Alinea Group — Roister (tasting plates)",
      note: "$80–$150",
      map: "https://maps.google.com/?q=Roister+Chicago",
      menu: "https://www.roisterrestaurant.com/",
      items: ["Seasonal plates", "Chef's picks"],
      category: "restaurants" as const,
    },
  ],
  under200: [
    {
      label: "Lyric Opera of Chicago",
      note: "$90–$180",
      map: "https://maps.google.com/?q=Lyric+Opera+of+Chicago",
      menu: "https://lyricopera.org/",
      items: ["Mainstage performance", "Opera night"],
      category: "attractions" as const,
    },
    {
      label: "Gibsons Italia (Loop riverfront)",
      note: "$120–$200",
      map: "https://maps.google.com/?q=Gibsons+Italia+Chicago",
      menu: "https://www.gibsonsitalia.com/",
      items: ["Steakhouse classics", "Seafood tower", "House pasta"],
      category: "restaurants" as const,
    },
    {
      label: "Chicago Architecture River Cruise (premium)",
      note: "$90–$180",
      map: "https://maps.google.com/?q=Chicago+Architecture+River+Cruise",
      menu: "https://www.architecture.org/tours/",
      items: ["Premium seating", "Sunset cruise"],
      category: "attractions" as const,
    },
  ],
  seasonal: [
    { season: "Spring", idea: "Riverwalk patios + Millennium Park blooms" },
    { season: "Summer", idea: "Millennium Park concerts + outdoor festivals" },
    { season: "Fall", idea: "Architecture cruise season + skyline walks" },
    { season: "Winter", idea: "Millennium Park Ice Skating Rink + holiday lights" },
  ],
};

function CompCard({ r, idx }: { r: ComparisonResult; idx: number }) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden mb-4 animate-slide-up"
      style={{ animationDelay: `${idx * 80}ms` }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50/80 border-b border-gray-100">
        <div className="flex items-center gap-2.5 text-[14px] font-bold text-gray-900">
          <div className={`w-8 h-8 ${ICON_BG[r.category]} rounded-lg flex items-center justify-center text-[17px]`}>
            {EMOJI[r.category]}
          </div>
          {r.label}
        </div>
        <div className="flex items-center gap-2">
          {r.alreadyOptimal
            ? <span className="bg-blue-50 text-primary rounded-full px-3 py-1 text-[11px] font-bold">Already Optimal ✓</span>
            : (
              <>
                <span className="bg-emerald-50 text-emerald-700 rounded-full px-3 py-1 text-[11px] font-bold">
                  Save ${r.saving.toFixed(2)}/mo
                </span>
                <span className="bg-gray-100 text-gray-500 rounded-full px-2.5 py-1 text-[10px] font-semibold">
                  ${r.annualSaving.toFixed(0)}/yr
                </span>
              </>
            )
          }
        </div>
      </div>

      {/* ── Already optimal ── */}
      {r.alreadyOptimal ? (
        <div className="px-6 py-5">
          <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-4">
            <span className="text-xl flex-shrink-0">✅</span>
            <div>
              <p className="text-sm font-semibold text-emerald-800 mb-1">You're already on the best available plan</p>
              <p className="text-xs text-emerald-700 leading-relaxed">{r.optimalReason || r.message}</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* ── Comparison body ── */}
          <div className="px-6 py-5 grid grid-cols-[1fr_32px_1fr] gap-3 items-start">
            {/* Current plan */}
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-widest text-gray-300 mb-2">Your Current Plan</p>
              <p className="text-sm font-bold text-gray-900 mb-0.5 truncate">{r.currentProvider}</p>
              <p className="font-display text-[26px] font-extrabold tracking-tight text-gray-400 mb-2.5 leading-none">
                ${r.currentCost.toFixed(2)}
                <span className="text-xs font-medium text-gray-300 ml-1">/mo</span>
              </p>
              {r.currentFeatures?.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-400 mb-1 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-200 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center pt-10">
              <div className="w-7 h-7 rounded-full bg-blue-50 text-primary flex items-center justify-center text-xs font-bold">→</div>
            </div>

            {/* Recommended */}
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-widest text-emerald-500 mb-2">Recommended</p>
              <p className="text-sm font-bold text-gray-900 mb-0.5 truncate">{r.altProvider}</p>
              <p className="font-display text-[26px] font-extrabold tracking-tight text-emerald-600 mb-2.5 leading-none">
                ${r.altCost!.toFixed(2)}
                <span className="text-xs font-medium text-gray-400 ml-1">/mo</span>
              </p>
              {r.altFeatures?.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500 mb-1 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  {f}
                </div>
              ))}
              {r.discountApplied && (
                <div className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 rounded-full px-2.5 py-1 text-[10.5px] font-semibold mt-2">
                  🏷 {r.discountPct}% discount applied
                </div>
              )}
            </div>
          </div>

          {/* ── Why this is better ── */}
          {r.savingReasons && r.savingReasons.length > 0 && (
            <div className="mx-6 mb-4 bg-gray-50 rounded-xl px-4 py-3.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">Why this saves you money</p>
              <div className="space-y-2">
                {r.savingReasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ImpactBadge impact={reason.impact} />
                    <p className="text-xs text-gray-600 leading-snug flex-1">{reason.factor}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Warning (important caveats) ── */}
      {r.warning && (
        <div className="mx-6 mb-4 flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-3">
          <span className="text-amber-500 text-sm flex-shrink-0">⚠️</span>
          <p className="text-xs text-amber-800 leading-snug font-medium">{r.warning}</p>
        </div>
      )}

      {/* ── Footnote ── */}
      <div className="px-6 py-2.5 border-t border-gray-100 flex items-center justify-between">
        {r.note
          ? <p className="text-[11px] text-gray-400 flex items-center gap-1.5"><span>ℹ️</span>{r.note}</p>
          : <div />
        }
        <p className="text-[10px] text-gray-300 font-medium flex-shrink-0">{r.dataFreshness}</p>
      </div>
    </div>
  );
}

// ── Main Results page ─────────────────────────────────
const DISC_LABELS: Record<DiscountType, string> = {
  veteran:"Veteran", disability:"Disability", senior:"Senior",
  frontline:"Frontline Worker", lowincome:"Income-Qualified", child:"Family",
};

interface Props {
  result: AnalyzeResponse | null;
  loading: boolean;
  error: string;
  form: FormState;
  onBack: () => void;
  onReset: () => void;
}

export default function StepResults({ result, loading, error, form, onBack, onReset }: Props) {
  const [showMoreIdeas, setShowMoreIdeas] = useState(false);
  const [ideaCategory, setIdeaCategory] = useState<SavingsCategory>("all");
  if (loading) return <ResultsSkeleton />;

  if (error) {
    return (
      <div className="animate-fade-up">
        <Notice type="error" icon="❌">
          <strong>Analysis failed:</strong> {error}
        </Notice>
        <Notice type="info" icon="💡">
          Make sure your ZIP code is a valid Chicago Loop ZIP (60601–60607, 60611, 60616, 60661) and all cost fields are filled in.
        </Notice>
        <BtnRow>
          <Btn variant="secondary" onClick={onBack}>← Adjust Your Bills</Btn>
        </BtnRow>
      </div>
    );
  }

  if (!result) return null;

  const { totalMonthlySavings, totalAnnualSavings, discountMultiplier, budgetImpactPct, results, generatedAt } = result;
  const optimized = results.filter(r => !r.alreadyOptimal).length;
  const discLabels = form.discounts.map(d => DISC_LABELS[d]).filter(Boolean);

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Copy summary to clipboard
  const handleCopy = async () => {
    const lines = [
      `WindyWallet Analysis — ${generatedAt}`,
      `ZIP: ${result.zip}`,
      "",
      `Monthly Savings: $${totalMonthlySavings.toFixed(2)}`,
      `Annual Savings: $${totalAnnualSavings.toFixed(0)}`,
      "",
      ...results.map(r =>
        r.alreadyOptimal
          ? `${r.label}: Already optimized ✓`
          : `${r.label}: $${r.currentCost.toFixed(2)}/mo → ${r.altProvider} at $${r.altCost?.toFixed(2)}/mo (save $${r.saving.toFixed(2)}/mo)`
      ),
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
    } catch {}
  };

  return (
    <div className="animate-fade-up">
      <Eyebrow>Step 4 of 4 — Your Results</Eyebrow>
      <PageTitle>Your savings <Grad>breakdown</Grad></PageTitle>
      <p className="text-xs font-semibold text-blue-500 bg-blue-50 inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4">
        📅 Saved for {MONTH_NAMES[(form.month ?? 1) - 1]} {form.year ?? new Date().getFullYear()}
      </p>

      {/* ── Hero + Budget side-by-side ── */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_300px] gap-4 mb-6">

        {/* Savings hero */}
        <div className="rounded-2xl p-8 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#2563EB 0%,#7C3AED 100%)" }}>
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10 bg-white pointer-events-none" />
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Estimated Monthly Savings</p>
            <p className="font-display leading-none font-extrabold tracking-tight mb-1 animate-fade-up"
              style={{ fontSize: "clamp(44px,7vw,64px)" }}>
              ${totalMonthlySavings.toFixed(2)}
            </p>
            <p className="text-sm opacity-70 mb-4">
              ${totalAnnualSavings.toFixed(0)}/yr
              {budgetImpactPct ? ` · ${budgetImpactPct}% of budget recovered` : ""}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {results.filter(r => r.saving > 0).map(r => (
                <div key={r.category}
                  className="bg-white/20 border border-white/25 backdrop-blur rounded-full px-3 py-1 text-[11px] font-semibold">
                  {EMOJI[r.category]} {r.label}: ${r.saving.toFixed(2)}/mo
                </div>
              ))}
              {optimized === 0 && (
                <div className="bg-white/20 border border-white/25 backdrop-blur rounded-full px-3 py-1 text-[11px] font-semibold">
                  ✓ All plans already optimal
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Budget breakdown panel */}
        {(() => {
          const total     = parseFloat(form.budget.total)     || 0;
          const utilities = parseFloat(form.budget.utilities) || 0;
          const personal  = parseFloat(form.budget.personal)  || 0;
          const other     = parseFloat(form.budget.other)     || 0;
          const billsTotal = results.reduce((sum, r) => sum + r.currentCost, 0);
          const afterSavings = billsTotal - totalMonthlySavings;
          const hasBudget = total > 0 || utilities > 0 || personal > 0 || other > 0;
          return (
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col">
              {/* Header */}
              <div className="px-5 pt-5 pb-3 border-b border-gray-50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Monthly Budget</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Your expense totals at a glance</p>
              </div>

              {/* Rows */}
              <div className="flex-1 px-5 py-3 space-y-2.5">
                {hasBudget ? (
                  <>
                    {[
                      { icon: "💼", label: "Total Budget",     val: total,     cls: "text-gray-800" },
                      { icon: "⚡", label: "Utility Bills",    val: utilities,  cls: "text-blue-600" },
                      { icon: "🛍", label: "Personal",         val: personal,   cls: "text-violet-600" },
                      { icon: "📦", label: "Other",            val: other,      cls: "text-gray-500" },
                    ].map(({ icon, label, val, cls }) => val > 0 && (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{icon}</span>
                          <span className="text-xs text-gray-500 font-medium">{label}</span>
                        </div>
                        <span className={`text-sm font-bold ${cls}`}>${val.toLocaleString()}</span>
                      </div>
                    ))}

                    {/* Divider */}
                    <div className="border-t border-dashed border-gray-100 pt-2.5 mt-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">📋</span>
                          <span className="text-xs text-gray-500 font-medium">Current Bills Total</span>
                        </div>
                        <span className="text-sm font-bold text-gray-700">${billsTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">✅</span>
                          <span className="text-xs text-gray-500 font-medium">After Savings</span>
                        </div>
                        <span className="text-sm font-bold text-emerald-600">${afterSavings.toFixed(2)}</span>
                      </div>
                      {total > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">📊</span>
                            <span className="text-xs text-gray-500 font-medium">Bills % of Budget</span>
                          </div>
                          <span className="text-sm font-bold text-amber-600">
                            {((billsTotal / total) * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-6 text-center">
                    <span className="text-3xl mb-2">💰</span>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      No budget entered.<br />Go back to Step 1 to add your monthly expenses.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer savings pill */}
              <div className="px-5 pb-5 pt-2">
                <div className="bg-emerald-50 rounded-xl px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">You save</span>
                  <span className="text-base font-extrabold text-emerald-600">${totalMonthlySavings.toFixed(2)}<span className="text-xs font-semibold text-emerald-400">/mo</span></span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          ["$" + totalMonthlySavings.toFixed(2), "Monthly Savings", "text-primary"],
          ["$" + totalAnnualSavings.toFixed(0),  "Annual Savings",  "text-emerald-600"],
          [optimized + " / " + results.length,   "Plans Optimized", "text-violet-600"],
        ].map(([v, l, cls]) => (
          <div key={l} className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
            <p className={`font-display text-[22px] font-extrabold tracking-tight ${cls} mb-0.5`}>{v}</p>
            <p className="text-[11px] text-gray-400 font-medium leading-tight">{l}</p>
          </div>
        ))}
      </div>

      {/* ── Discounts applied notice ── */}
      {discountMultiplier > 0 && discLabels.length > 0 && (
        <Notice type="success" icon="🏷️">
          <strong>{discLabels.join(", ")}</strong> discount{discLabels.length > 1 ? "s" : ""} applied —
          {" "}{discountMultiplier}% additional reduction on eligible plans.
        </Notice>
      )}


      {/* ── Data freshness ── */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        All pricing sourced from public provider websites · {generatedAt}
        <span className="mx-1">·</span>
        <a href="https://www.cta.com/fares" target="_blank" rel="noopener noreferrer"
          className="text-primary underline underline-offset-2">CTA fares</a>
        <span className="mx-1">·</span>
        <a href="https://metra.com/fares" target="_blank" rel="noopener noreferrer"
          className="text-primary underline underline-offset-2">Metra fares</a>
      </div>

      {/* ── Comparison cards ── */}
      {results.map((r, i) => <CompCard key={r.category} r={r} idx={i} />)}

      {/* ── Savings ideas ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mt-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">Savings ideas in the Loop</p>
        <p className="text-sm text-gray-600 mb-4">
          Quick ideas with typical price ranges, plus links for directions and menus.
        </p>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <label className="text-[11px] font-semibold text-gray-500">Filter:</label>
          <select
            value={ideaCategory}
            onChange={(e) => setIdeaCategory(e.target.value as SavingsCategory)}
            className="h-9 rounded-full border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600"
          >
            <option value="all">All</option>
            <option value="cafes">Cafes</option>
            <option value="restaurants">Restaurants</option>
            <option value="attractions">Attractions</option>
            <option value="walking">Walking spots</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(() => {
            const base = totalMonthlySavings >= 200
              ? [...SAVINGS_IDEAS.under50, ...SAVINGS_IDEAS.under100, ...SAVINGS_IDEAS.under150, ...SAVINGS_IDEAS.under200]
              : totalMonthlySavings >= 150
              ? [...SAVINGS_IDEAS.under50, ...SAVINGS_IDEAS.under100, ...SAVINGS_IDEAS.under150]
              : totalMonthlySavings >= 100
              ? [...SAVINGS_IDEAS.under50, ...SAVINGS_IDEAS.under100]
              : SAVINGS_IDEAS.under50;
            const filtered = ideaCategory === "all"
              ? base
              : base.filter(item => item.category === ideaCategory);
            const visible = showMoreIdeas ? filtered : filtered.slice(0, 6);
            return visible.map(item => (
            <div key={item.label} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[12px] font-semibold text-gray-800">{item.label}</p>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {item.note}
                </span>
              </div>
              {item.items && (
                <p className="text-[11px] text-gray-500 mt-1">
                  Recommended: {item.items.join(" · ")}
                </p>
              )}
              <div className="mt-2 flex items-center gap-3 text-[11px]">
                <a
                  href={item.map}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2"
                >
                  Map
                </a>
                {item.menu && (
                  <a
                    href={item.menu}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2"
                  >
                    Menu
                  </a>
                )}
              </div>
            </div>
            ));
          })()}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-[12px] font-semibold text-blue-900 mb-2">Seasonal picks</p>
            <ul className="text-xs text-blue-700 space-y-1.5">
              {SAVINGS_IDEAS.seasonal.map(item => (
                <li key={item.season} className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                  <span><strong>{item.season}:</strong> {item.idea}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="text-[11px] text-gray-400 mt-3">
          Showing {totalMonthlySavings >= 200 ? "under $200" : totalMonthlySavings >= 150 ? "under $150" : totalMonthlySavings >= 100 ? "under $100" : "under $50"} ideas based on your monthly savings.
        </p>
        {((totalMonthlySavings >= 200
          ? SAVINGS_IDEAS.under50.length + SAVINGS_IDEAS.under100.length + SAVINGS_IDEAS.under150.length + SAVINGS_IDEAS.under200.length
          : totalMonthlySavings >= 150
          ? SAVINGS_IDEAS.under50.length + SAVINGS_IDEAS.under100.length + SAVINGS_IDEAS.under150.length
          : totalMonthlySavings >= 100
          ? SAVINGS_IDEAS.under50.length + SAVINGS_IDEAS.under100.length
          : SAVINGS_IDEAS.under50.length) > 6) && (
          <div className="mt-3">
            <Btn
              variant="secondary"
              onClick={() => setShowMoreIdeas(v => !v)}
            >
              {showMoreIdeas ? "Show fewer ideas" : "Show more ideas"}
            </Btn>
          </div>
        )}
      </div>

      {/* ── Monthly History ── */}
      <MonthlyHistory />

      {/* ── Action bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Btn variant="secondary" onClick={handlePrint}>🖨️ Print</Btn>
          <Btn variant="secondary" onClick={handleCopy}>📋 Copy Summary</Btn>
        </div>
        <div className="flex items-center gap-2">
          <Btn variant="secondary" onClick={onBack}>← Adjust Bills</Btn>
          <Btn variant="primary" onClick={onReset}>🌬 New Analysis</Btn>
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <p className="text-[11px] text-gray-300 leading-relaxed mt-6 text-center max-w-lg mx-auto">
        WindyWallet provides estimates based on publicly available pricing. Actual savings may vary.
        Always verify pricing directly with providers before switching. Not affiliated with any carrier, CTA, or insurer.
      </p>
    </div>
  );
}
