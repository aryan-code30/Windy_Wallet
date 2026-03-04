"use client";
import { useState } from "react";

type CommuteType = "loop-only" | "suburb-loop" | "mixed";

const ROUTES = [
  {
    id: "cta-monthly",
    name: "CTA Monthly Ventra Pass",
    emoji: "🚇",
    cost: 105,
    period: "month",
    best_for: ["loop-only", "mixed"] as CommuteType[],
    description: "Unlimited rides on all CTA trains & buses for 30 days.",
    link: "https://www.ventrachicago.com/products/30-day-pass/",
    tips: ["Buy online to avoid station markup", "Auto-reload saves $5/yr", "Works on both L and bus"],
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    id: "metra-monthly",
    name: "Metra Monthly Pass",
    emoji: "🚆",
    cost: 178,
    period: "month",
    best_for: ["suburb-loop"] as CommuteType[],
    description: "Unlimited rides on your Metra zone. Best if commuting from suburbs daily.",
    link: "https://metrarail.com/tickets-and-fares/monthly-passes",
    tips: ["Metra/CTA combo pass saves ~$30/mo vs. buying separately", "10-ride ticket cheaper if <15 trips/mo", "Senior half-price with Ventra RTA Reduced Fare"],
    color: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "divvy-annual",
    name: "Divvy Annual Bike Pass",
    emoji: "🚲",
    cost: 119,
    period: "year",
    best_for: ["loop-only", "mixed"] as CommuteType[],
    description: "Unlimited 45-min classic bike rides. Perfect for Loop neighborhood trips.",
    link: "https://divvybikes.com/pricing",
    tips: ["$9.92/mo amortized — cheaper than 2 Uber rides", "300+ stations in Loop/Near North", "Combine with CTA for suburb commuters"],
    color: "bg-pink-50 border-pink-200",
    badge: "bg-pink-100 text-pink-700",
  },
  {
    id: "divvy-ebike",
    name: "Divvy E-Bike Day Pass",
    emoji: "⚡",
    cost: 1,
    period: "unlock + $0.17/min",
    best_for: ["loop-only"] as CommuteType[],
    description: "Electric bike — great for hot or rainy days when you still don't want a cab.",
    link: "https://divvybikes.com/pricing",
    tips: ["Use annual pass for free classic, pay $0.17/min extra for e-bike", "Fastest Loop-to-RiverNorth option", "Weather-resilient commute"],
    color: "bg-yellow-50 border-yellow-200",
    badge: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "walk",
    name: "Walk the Loop",
    emoji: "🚶",
    cost: 0,
    period: "always free",
    best_for: ["loop-only"] as CommuteType[],
    description: "Most Loop destinations are within a 15-min walk. Best in spring/fall.",
    link: "https://maps.google.com/?q=Chicago+Loop",
    tips: ["Save $105/mo if you can walk your full commute", "Chicago Riverwalk + lakeshore paths are scenic routes", "CTA single ride $2.50 for bad weather days"],
    color: "bg-gray-50 border-gray-200",
    badge: "bg-gray-100 text-gray-600",
  },
  {
    id: "lyft-pass",
    name: "Lyft Pink All Access",
    emoji: "🚗",
    cost: 199,
    period: "year ($16.59/mo)",
    best_for: ["mixed"] as CommuteType[],
    description: "15% off rides + free priority pickup. Worth it if you ride 8+ times/mo.",
    link: "https://www.lyft.com/pink",
    tips: ["Break-even at ~8 rides/mo vs. standard Lyft", "Combine with Ventra for hybrid commute", "Cancel anytime — no commitment"],
    color: "bg-rose-50 border-rose-200",
    badge: "bg-rose-100 text-rose-700",
  },
];

const COMPARE: { label: string; trips: number; mode: string; cost: number }[] = [
  { label: "Walk (Loop only)",         trips: 20, mode: "🚶 Walk",              cost: 0   },
  { label: "CTA Monthly Pass",         trips: 40, mode: "🚇 CTA Ventra",        cost: 105 },
  { label: "Divvy Annual (÷12)",       trips: 30, mode: "🚲 Divvy",             cost: 10  },
  { label: "Metra Monthly",            trips: 40, mode: "🚆 Metra",             cost: 178 },
  { label: "Uber/Lyft (avg $18/ride)", trips: 20, mode: "🚗 Rideshare",         cost: 360 },
  { label: "Parking + Gas",            trips: 20, mode: "🚘 Drive",             cost: 420 },
];

export default function TransitPlanner() {
  const [commute, setCommute] = useState<CommuteType>("loop-only");
  const [freq, setFreq]       = useState(20);

  const filtered = ROUTES.filter(r => r.best_for.includes(commute));
  const maxCost  = Math.max(...COMPARE.map(c => c.cost), 1);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-bold text-gray-900 text-base">🚇 Transit Planner</h3>
        <p className="text-xs text-gray-400">Find the cheapest way to get around the Loop</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {([
          { val: "loop-only",   label: "🏙️ Loop Only"   },
          { val: "suburb-loop", label: "🚆 Suburb → Loop" },
          { val: "mixed",       label: "🔀 Mixed"         },
        ] as { val: CommuteType; label: string }[]).map(opt => (
          <button
            key={opt.val}
            onClick={() => setCommute(opt.val)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
              commute === opt.val
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Recommended options */}
      <div className="space-y-2">
        {filtered.map(r => (
          <div key={r.id} className={`border rounded-2xl p-4 space-y-3 ${r.color}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{r.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-sm font-bold text-gray-800">{r.name}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.badge}`}>
                    ${r.cost}/{r.period}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{r.description}</p>
              </div>
            </div>
            <div className="space-y-1">
              {r.tips.map(t => (
                <div key={t} className="flex gap-1.5 text-xs text-gray-600">
                  <span className="text-gray-400 flex-shrink-0">•</span>
                  {t}
                </div>
              ))}
            </div>
            <a
              href={r.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:underline"
            >
              🔗 Learn more →
            </a>
          </div>
        ))}
      </div>

      {/* Cost comparison bar chart */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
        <p className="text-xs font-bold text-gray-700">💸 Monthly Cost Comparison</p>
        {COMPARE.map(c => (
          <div key={c.label} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">{c.mode}</span>
              <span className={`text-xs font-bold ${c.cost === 0 ? "text-emerald-600" : c.cost <= 105 ? "text-indigo-600" : "text-red-500"}`}>
                {c.cost === 0 ? "Free" : `$${c.cost}/mo`}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${c.cost === 0 ? "bg-emerald-400" : c.cost <= 105 ? "bg-indigo-400" : "bg-red-300"}`}
                style={{ width: `${Math.max((c.cost / maxCost) * 100, 2)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
