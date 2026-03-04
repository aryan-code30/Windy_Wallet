"use client";

const SEASONS = [
  {
    name: "Winter",
    months: "Dec – Feb",
    emoji: "❄️",
    color: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    tips: [
      { icon: "🔥", label: "Heating spike", note: "Avg Chicago gas bill jumps to $120–$180/mo. Consider ComEd Budget Billing to flatten costs." },
      { icon: "🧥", label: "Layer up", note: "Set thermostat to 68°F when home, 60°F when away — saves ~$30/mo on heating." },
      { icon: "🚇", label: "Skip Uber", note: "CTA runs 24/7. A monthly Ventra pass ($105) beats 10+ Uber rides in winter." },
      { icon: "🏛️", label: "Free warmth", note: "Chicago Cultural Center, Harold Washington Library — free heated spaces all day." },
    ],
    budget_note: "Budget +$60–$80 for higher heating & holiday spending",
  },
  {
    name: "Spring",
    months: "Mar – May",
    emoji: "🌸",
    color: "bg-pink-50 border-pink-200",
    badge: "bg-pink-100 text-pink-700",
    tips: [
      { icon: "🚲", label: "Divvy Bike pass", note: "Annual Divvy pass is $119. If you ride 3x/week, you save vs. CTA + rideshare combo." },
      { icon: "🌳", label: "Free outdoors", note: "Riverwalk, Millennium Park, Maggie Daley — all free. Best outdoor months in the Loop." },
      { icon: "⚡", label: "Utility dip", note: "Spring is your cheapest utility season. Bank the savings toward summer A/C costs." },
      { icon: "🍜", label: "Lunch deals", note: "Many Loop restaurants do spring lunch specials — check Yelp/Google for weekday deals." },
    ],
    budget_note: "Utilities at annual low — best time to save aggressively",
  },
  {
    name: "Summer",
    months: "Jun – Aug",
    emoji: "☀️",
    color: "bg-yellow-50 border-yellow-200",
    badge: "bg-yellow-100 text-yellow-700",
    tips: [
      { icon: "❄️", label: "A/C cost", note: "ComEd bills spike $50–$100/mo in summer. Set A/C to 76°F+ when away." },
      { icon: "🎆", label: "Free festivals", note: "Chicago Blues Fest, Taste of Chicago, Jazz Fest — all free entry on the lakefront." },
      { icon: "🚢", label: "Navy Pier", note: "Free to enter. Fireworks Wednesdays & Saturdays at no cost." },
      { icon: "🏖️", label: "Free beaches", note: "12 Chicago lakefront beaches — free parking at 5am to avoid $30+ lots." },
    ],
    budget_note: "Budget +$50–$100 for A/C and outdoor social spending",
  },
  {
    name: "Fall",
    months: "Sep – Nov",
    emoji: "🍂",
    color: "bg-orange-50 border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    tips: [
      { icon: "🎭", label: "Free museum days", note: "Chicago museums offer free/discounted days in fall. Art Institute: IL residents free select days." },
      { icon: "🌁", label: "Architecture tours", note: "Chicago Architecture Center river tours are $20–$55. Fall foliage makes it even better." },
      { icon: "⚡", label: "Pre-winter audit", note: "Call ComEd/Nicor for a free energy audit before heating season — can save $200+/yr." },
      { icon: "📱", label: "Switch season", note: "Carriers run aggressive fall promotions (Sept–Nov). Best time to switch mobile plans." },
    ],
    budget_note: "Pre-winter is best time to audit & negotiate all your bills",
  },
];

export default function SeasonalPlanner() {
  const currentMonth = new Date().getMonth(); // 0-indexed
  const currentSeason = currentMonth <= 1 || currentMonth === 11 ? 0
    : currentMonth <= 4 ? 1
    : currentMonth <= 7 ? 2
    : 3;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-bold text-gray-900 text-base">🌦️ Seasonal Budget Planner</h3>
        <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
          Chicago Loop
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SEASONS.map((s, i) => (
          <div
            key={s.name}
            className={`rounded-2xl border p-4 space-y-3 ${s.color} ${i === currentSeason ? "ring-2 ring-indigo-400" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{s.emoji}</span>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{s.name}</p>
                  <p className="text-[11px] text-gray-500">{s.months}</p>
                </div>
              </div>
              {i === currentSeason && (
                <span className="text-[9px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full uppercase">
                  Now
                </span>
              )}
            </div>

            <div className="space-y-2">
              {s.tips.map(t => (
                <div key={t.label} className="flex gap-2">
                  <span className="text-base flex-shrink-0 mt-0.5">{t.icon}</span>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-700">{t.label}</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed">{t.note}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={`${s.badge} rounded-xl px-3 py-2 text-[10px] font-semibold leading-snug`}>
              💡 {s.budget_note}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
