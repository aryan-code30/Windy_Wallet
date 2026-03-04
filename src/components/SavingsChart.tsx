"use client";
import { useEffect, useState } from "react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

interface Row {
  id: string;
  month: number;
  year: number;
  totalSavings: number;
  annualSavings: number;
  optimizedCount: number;
  categories: string[];
}

export default function SavingsChart() {
  const [rows, setRows]     = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/submissions")
      .then(r => r.json())
      .then(d => {
        const parsed: Row[] = (d.rows ?? []).map((r: any) => ({
          ...r,
          categories: (() => { try { return JSON.parse(r.categories ?? "[]"); } catch { return []; } })(),
        }));
        // sort oldest → newest
        parsed.sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);
        setRows(parsed);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-40 mb-4" />
      <div className="h-32 bg-gray-50 rounded-xl" />
    </div>
  );
  if (rows.length < 2) return null;

  const max     = Math.max(...rows.map(r => r.totalSavings), 1);
  const avg     = rows.reduce((s, r) => s + r.totalSavings, 0) / rows.length;
  const best    = rows.reduce((a, b) => a.totalSavings > b.totalSavings ? a : b);
  const total12 = rows.slice(-12).reduce((s, r) => s + r.totalSavings, 0);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-gray-900 text-base">📊 Savings Over Time</h3>
          <p className="text-xs text-gray-400 mt-0.5">{rows.length} months tracked</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">Last 12 mo total</p>
          <p className="text-lg font-extrabold text-indigo-600">${total12.toFixed(2)}</p>
        </div>
      </div>

      {/* Stat pills */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Avg/mo",  val: `$${avg.toFixed(0)}`,        color: "bg-indigo-50 text-indigo-700" },
          { label: "Best mo", val: `$${best.totalSavings.toFixed(0)}`, color: "bg-emerald-50 text-emerald-700" },
          { label: "Months",  val: rows.length,                 color: "bg-gray-50 text-gray-600"    },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl px-3 py-2 text-center`}>
            <p className="text-base font-extrabold">{s.val}</p>
            <p className="text-[10px] font-semibold opacity-70 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-1.5 h-28">
        {rows.map(r => {
          const pct   = Math.max((r.totalSavings / max) * 100, 3);
          const isBest = r.id === best.id;
          return (
            <div key={r.id} className="flex-1 flex flex-col items-center gap-1 group relative">
              {/* tooltip */}
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[9px] rounded px-1.5 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                ${r.totalSavings.toFixed(2)}<br/>{MONTHS[r.month-1]} {r.year}
              </div>
              <div className="w-full flex flex-col justify-end" style={{ height: "88px" }}>
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ${isBest ? "bg-emerald-500" : "bg-indigo-400"}`}
                  style={{ height: `${pct}%` }}
                />
              </div>
              <p className="text-[8px] text-gray-400 text-center leading-tight">
                {MONTHS[r.month-1]}<br/>{String(r.year).slice(2)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Avg line note */}
      <p className="text-[10px] text-gray-400 text-center">
        🟢 Best month &nbsp;|&nbsp; 🟣 Other months &nbsp;|&nbsp; Hover bars for details
      </p>
    </div>
  );
}
