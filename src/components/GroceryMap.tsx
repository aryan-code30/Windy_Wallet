"use client";
import { useState } from "react";

const STORES = [
  {
    name: "Trader Joe's (South Loop)",
    emoji: "🌺",
    address: "1147 S Wabash Ave",
    map: "https://maps.google.com/?q=Trader+Joe%27s+South+Loop+Chicago",
    vibe: "Affordable & organic",
    monthly_est: "$250–$380",
    color: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
    picks: ["Mandarin chicken", "Everything but the Bagel seasoning", "Frozen burritos"],
  },
  {
    name: "Mariano's (Roosevelt)",
    emoji: "🏪",
    address: "1 E Roosevelt Rd",
    map: "https://maps.google.com/?q=Mariano%27s+Roosevelt+Chicago",
    vibe: "Full service, good sales",
    monthly_est: "$300–$450",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    picks: ["Weekly sale proteins", "Fresh deli", "Prepared meals"],
  },
  {
    name: "Jewel-Osco (Michigan Ave)",
    emoji: "💎",
    address: "1224 S Wabash Ave",
    map: "https://maps.google.com/?q=Jewel-Osco+Michigan+Ave+Chicago",
    vibe: "Everyday staples",
    monthly_est: "$280–$420",
    color: "bg-purple-50 border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    picks: ["Club card deals", "Private label savings", "Weekly BOGO"],
  },
  {
    name: "Aldi (South Loop)",
    emoji: "🟨",
    address: "2550 S State St",
    map: "https://maps.google.com/?q=Aldi+South+Loop+Chicago",
    vibe: "Cheapest per basket",
    monthly_est: "$150–$250",
    color: "bg-yellow-50 border-yellow-200",
    badge: "bg-yellow-100 text-yellow-700",
    picks: ["Private label staples", "Weekly ALDI Finds", "Fresh produce"],
  },
  {
    name: "Whole Foods (River North)",
    emoji: "🌿",
    address: "30 W Huron St",
    map: "https://maps.google.com/?q=Whole+Foods+River+North+Chicago",
    vibe: "Premium organic",
    monthly_est: "$400–$600",
    color: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-700",
    picks: ["365 private label", "Hot bar (lunch deal)", "Prime member 10% off"],
  },
  {
    name: "Target (State St)",
    emoji: "🎯",
    address: "1 S State St",
    map: "https://maps.google.com/?q=Target+State+Street+Chicago",
    vibe: "Grocery + everything",
    monthly_est: "$200–$350",
    color: "bg-rose-50 border-rose-200",
    badge: "bg-rose-100 text-rose-700",
    picks: ["Good & Gather private label", "Circle app deals", "Free same-day delivery"],
  },
];

const TIPS = [
  { icon: "📦", tip: "Buy pantry staples at Aldi — save 30–50% vs. Jewel on the same items." },
  { icon: "📱", tip: "Use the Jewel Osco app for digital coupons — stacks with Club Card prices." },
  { icon: "🚲", tip: "Trader Joe's South Loop is a 10-min Divvy ride from most Loop apartments." },
  { icon: "🍖", tip: "Mariano's marks down meat after 7pm — same quality, up to 40% off." },
  { icon: "🛒", tip: "Target Circle app gives 1% back on everything + weekly 5–10% category deals." },
  { icon: "🌿", tip: "Whole Foods 365 brand is often cheaper than Jewel name-brand equivalents." },
];

type SortBy = "price" | "distance" | "name";

export default function GroceryMap() {
  const [sort, setSort] = useState<SortBy>("price");
  const [expanded, setExpanded] = useState<string | null>(null);

  const sorted = [...STORES].sort((a, b) => {
    if (sort === "price") {
      const getMin = (s: typeof STORES[0]) => parseInt(s.monthly_est.replace("$","").split("–")[0]);
      return getMin(a) - getMin(b);
    }
    if (sort === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-bold text-gray-900 text-base">🛒 Grocery & Essentials</h3>
          <p className="text-xs text-gray-400">Nearest stores to the Chicago Loop</p>
        </div>
        <div className="flex gap-1.5">
          {(["price","name"] as SortBy[]).map(s => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                sort === s ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {s === "price" ? "💰 Cheapest" : "🔤 A–Z"}
            </button>
          ))}
        </div>
      </div>

      {/* Store cards */}
      <div className="space-y-2">
        {sorted.map(s => (
          <div key={s.name} className={`border rounded-2xl overflow-hidden ${s.color}`}>
            <button
              className="w-full px-4 py-3 flex items-center gap-3 text-left"
              onClick={() => setExpanded(expanded === s.name ? null : s.name)}
            >
              <span className="text-2xl">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800">{s.name}</p>
                <p className="text-xs text-gray-500">{s.address}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-bold text-gray-700">{s.monthly_est}</p>
                <p className="text-[10px] text-gray-400">/mo est.</p>
              </div>
              <span className="text-gray-400 text-sm ml-1">{expanded === s.name ? "▲" : "▼"}</span>
            </button>

            {expanded === s.name && (
              <div className="px-4 pb-4 space-y-3 border-t border-black/5">
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>{s.vibe}</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Top picks</p>
                  <div className="space-y-1">
                    {s.picks.map(p => (
                      <div key={p} className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
                <a
                  href={s.map}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-50 transition-colors"
                >
                  📍 Open in Maps
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Money tips */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">💡 Loop Grocery Tips</p>
        {TIPS.map(t => (
          <div key={t.tip} className="flex gap-2 text-xs text-gray-600">
            <span className="flex-shrink-0">{t.icon}</span>
            <span>{t.tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
