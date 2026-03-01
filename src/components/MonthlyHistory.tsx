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
  const [history, setHistory]       = useState<GroupedMonth[]>([]);
  const [loading, setLoading]       = useState(true);
  const [expanded, setExpanded]     = useState<string | null>(null);
  // tracks which id / "month-YYYY-M" is currently being deleted
  const [deleting, setDeleting]     = useState<string | null>(null);
  // confirm state: id or "month-YYYY-M"
  const [confirmKey, setConfirmKey] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/submissions")
      .then(r => r.json())
      .then(d => setHistory(d.grouped ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // Delete a single entry by id
  const deleteEntry = async (id: string) => {
    setDeleting(id);
    await fetch(`/api/submissions?id=${id}`, { method: "DELETE" }).catch(() => {});
    setDeleting(null);
    setConfirmKey(null);
    load();
  };

  // Delete all entries for a whole month
  const deleteMonth = async (year: number, month: number) => {
    const key = `month-${year}-${month}`;
    setDeleting(key);
    await fetch(`/api/submissions?year=${year}&month=${month}`, { method: "DELETE" }).catch(() => {});
    setDeleting(null);
    setConfirmKey(null);
    setExpanded(null);
    load();
  };

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
          const key        = `${group.year}-${group.month}`;
          const monthKey   = `month-${group.year}-${group.month}`;
          const isOpen     = expanded === key;
          const isDeleting = deleting === monthKey;
          const isConfirm  = confirmKey === monthKey;

          return (
            <div key={key} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              {/* ── Month header row ── */}
              <div className="flex items-center">
                <button
                  className="flex-1 flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                  onClick={() => setExpanded(isOpen ? null : key)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-base">📅</div>
                    <div>
                      <div className="font-semibold text-sm text-gray-800">{group.label}</div>
                      <div className="text-xs text-gray-400">{group.entries.length} submission{group.entries.length > 1 ? "s" : ""}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mr-2">
                    <div className="text-right">
                      <div className="font-bold text-base text-emerald-600">${group.bestSavings.toFixed(0)}<span className="text-xs font-medium text-gray-400">/mo</span></div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wide">best savings</div>
                    </div>
                    <span className={`text-gray-300 text-sm transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
                  </div>
                </button>

                {/* Delete whole month button */}
                <div className="px-3 border-l border-gray-100 flex items-center">
                  {isConfirm ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">Delete all?</span>
                      <button
                        onClick={() => deleteMonth(group.year, group.month)}
                        disabled={!!isDeleting}
                        className="text-[11px] font-bold text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isDeleting ? "…" : "Yes"}
                      </button>
                      <button
                        onClick={() => setConfirmKey(null)}
                        className="text-[11px] font-semibold text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg transition-colors"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmKey(monthKey)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                      title="Delete entire month"
                    >
                      🗑
                    </button>
                  )}
                </div>
              </div>

              {/* ── Expanded entries ── */}
              {isOpen && (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  {group.entries.map((entry, idx) => {
                    const isDeletingEntry = deleting === entry.id;
                    const isConfirmEntry  = confirmKey === entry.id;
                    return (
                      <div key={entry.id} className={`px-5 py-4 transition-colors ${isConfirmEntry ? "bg-red-50" : "hover:bg-gray-50"}`}>

                        {/* ── Row header: number + date + DELETE ── */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            {/* Submission number badge */}
                            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-[11px] font-extrabold text-blue-600">#{idx + 1}</span>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-700">Submission #{idx + 1}</p>
                              <p className="text-[10px] text-gray-400">
                                {new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>

                          {/* Delete controls */}
                          {isConfirmEntry ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-red-500 font-semibold">Delete this?</span>
                              <button
                                onClick={() => deleteEntry(entry.id)}
                                disabled={isDeletingEntry}
                                className="text-[11px] font-bold text-white bg-red-500 hover:bg-red-600 active:bg-red-700 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                              >
                                {isDeletingEntry ? "Deleting…" : "Yes, delete"}
                              </button>
                              <button
                                onClick={() => setConfirmKey(null)}
                                className="text-[11px] font-semibold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmKey(entry.id)}
                              disabled={!!deleting}
                              className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-100 hover:border-red-100 px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-40"
                            >
                              <span>🗑</span> Delete
                            </button>
                          )}
                        </div>

                        {/* ── Category pills ── */}
                        <div className="flex gap-1.5 flex-wrap mb-3">
                          {entry.categories.map((cat: string) => (
                            <span key={cat} className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                              {CATEGORY_ICONS[cat] ?? "•"} {cat}
                            </span>
                          ))}
                        </div>

                        {/* ── Stats row ── */}
                        <div className="grid grid-cols-3 gap-2">
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
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
