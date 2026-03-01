"use client";
import { useEffect, useState } from "react";
import type { MonthlyRecord } from "@/types";

interface GroupedMonth {
  year: number;
  month: number;
  label: string;
  bestSavings: number;
  entries: MonthlyRecord[];
}

const CATEGORY_ICONS: Record<string, string> = {
  mobile: "📱", internet: "📡", transit: "🚇", insurance: "🛡",
};

export default function MonthlyHistory() {
  const [history, setHistory] = useState<GroupedMonth[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/submissions")
      .then(r => r.json())
      .then(d => { setHistory(d.grouped ?? []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="mt-8">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Monthly History</p>
      <div className="space-y-2">
        {[1,2,3].map(i => (
          <div key={i} className="bg-gray-50 rounded-2xl h-14 animate-pulse" />
        ))}
      </div>
    </div>
  );

  if (history.length === 0) return (
    <div className="mt-8 bg-gray-50 rounded-2xl p-6 text-center">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">Monthly History</p>
      <p className="text-sm text-gray-400 mt-2">No history yet. Run your first analysis to start tracking!</p>
    </div>
  );

  return (
    <div className="mt-8">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Monthly History</p>
      <div className="space-y-2">
        {history.map((group) => {
          const key = `${group.year}-${group.month}`;
          const isOpen = expanded === key;
          const best = group.entries.reduce((a, b) => b.totalSavings > a.totalSavings ? b : a, group.entries[0]);
          return (
            <div key={key} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              {/* Month row */}
              <button
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(isOpen ? null : key)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-base">📅</div>
                  <div className="text-left">
                    <div className="font-semibold text-sm text-gray-800">{group.label}</div>
                    <div className="text-xs text-gray-400">{group.entries.length} submission{group.entries.length > 1 ? "s" : ""}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bold text-base text-emerald-600">${group.bestSavings.toFixed(0)}<span className="text-xs font-medium text-gray-400">/mo</span></div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide">best savings</div>
                  </div>
                  <span className={`text-gray-300 text-sm transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
                </div>
              </button>

              {/* Expanded entries */}
              {isOpen && (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  {group.entries.map((entry) => (
                    <div key={entry.id} className="px-5 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1.5">
                          {entry.categories.map((cat: string) => (
                            <span key={cat} className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                              {CATEGORY_ICONS[cat] ?? "•"} {cat}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="bg-emerald-50 rounded-xl p-2.5 text-center">
                          <div className="text-base font-bold text-emerald-600">${entry.totalSavings.toFixed(0)}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">monthly</div>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-2.5 text-center">
                          <div className="text-base font-bold text-blue-600">${entry.annualSavings.toFixed(0)}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">annual</div>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-2.5 text-center">
                          <div className="text-base font-bold text-purple-600">{entry.optimizedCount}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">optimized</div>
                        </div>
                      </div>
                      {entry.discounts.length > 0 && (
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          {entry.discounts.map((d: string) => (
                            <span key={d} className="bg-amber-50 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              {d}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
