"use client";
import { useState, useEffect } from "react";

interface Bill {
  id: string;
  name: string;
  dueDay: number; // day of month 1-31
  amount: number;
  category: "mobile" | "internet" | "transit" | "insurance" | "utilities" | "other";
  autopay: boolean;
}

const CATEGORY_META: Record<Bill["category"], { emoji: string; color: string }> = {
  mobile:    { emoji: "📱", color: "bg-blue-100 text-blue-700"    },
  internet:  { emoji: "📡", color: "bg-violet-100 text-violet-700"},
  transit:   { emoji: "🚇", color: "bg-emerald-100 text-emerald-700"},
  insurance: { emoji: "🛡️", color: "bg-purple-100 text-purple-700"},
  utilities: { emoji: "⚡", color: "bg-yellow-100 text-yellow-700"},
  other:     { emoji: "📦", color: "bg-gray-100 text-gray-600"    },
};

const STORAGE_KEY = "ww_bill_tracker";

function loadBills(): Bill[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); }
  catch { return []; }
}
function saveBills(bills: Bill[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
}

function daysUntil(day: number): number {
  const now   = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), day);
  if (thisMonth <= now) {
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, day);
    return Math.ceil((nextMonth.getTime() - now.getTime()) / 86400000);
  }
  return Math.ceil((thisMonth.getTime() - now.getTime()) / 86400000);
}

const EMPTY: Omit<Bill, "id"> = {
  name: "", dueDay: 1, amount: 0, category: "other", autopay: false,
};

export default function BillTracker() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft]   = useState<Omit<Bill,"id">>(EMPTY);
  const [err, setErr]       = useState("");

  useEffect(() => { setBills(loadBills()); }, []);

  const save = (next: Bill[]) => { setBills(next); saveBills(next); };

  const add = () => {
    if (!draft.name.trim()) { setErr("Enter a bill name."); return; }
    if (draft.amount <= 0)  { setErr("Enter a valid amount."); return; }
    const next = [...bills, { ...draft, id: crypto.randomUUID() }];
    save(next); setDraft(EMPTY); setAdding(false); setErr("");
  };

  const remove = (id: string) => save(bills.filter(b => b.id !== id));

  const sorted = [...bills].sort((a, b) => daysUntil(a.dueDay) - daysUntil(b.dueDay));
  const totalMonthly = bills.reduce((s, b) => s + b.amount, 0);
  const dueSoon = bills.filter(b => daysUntil(b.dueDay) <= 5).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-900 text-base">🔔 Bill Due Date Tracker</h3>
          <p className="text-xs text-gray-400">
            ${totalMonthly.toFixed(2)}/mo tracked
            {dueSoon > 0 && <span className="ml-2 text-orange-500 font-semibold">· {dueSoon} due within 5 days!</span>}
          </p>
        </div>
        <button
          onClick={() => { setAdding(true); setErr(""); }}
          className="text-xs bg-indigo-600 text-white font-semibold px-3 py-1.5 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          + Add Bill
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 space-y-3">
          <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide">New Bill</p>
          <div className="grid grid-cols-2 gap-2">
            <input
              className="col-span-2 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
              placeholder="Bill name (e.g. T-Mobile)"
              value={draft.name}
              onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
            />
            <input
              type="number" min="0" step="0.01"
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
              placeholder="Amount $"
              value={draft.amount || ""}
              onChange={e => setDraft(d => ({ ...d, amount: parseFloat(e.target.value) || 0 }))}
            />
            <input
              type="number" min="1" max="31"
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
              placeholder="Due day (1–31)"
              value={draft.dueDay}
              onChange={e => setDraft(d => ({ ...d, dueDay: parseInt(e.target.value) || 1 }))}
            />
            <select
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
              value={draft.category}
              onChange={e => setDraft(d => ({ ...d, category: e.target.value as Bill["category"] }))}
            >
              {(Object.keys(CATEGORY_META) as Bill["category"][]).map(c => (
                <option key={c} value={c}>{CATEGORY_META[c].emoji} {c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.autopay}
                onChange={e => setDraft(d => ({ ...d, autopay: e.target.checked }))}
                className="rounded"
              />
              Autopay
            </label>
          </div>
          {err && <p className="text-xs text-red-500">{err}</p>}
          <div className="flex gap-2">
            <button onClick={add} className="flex-1 bg-indigo-600 text-white text-sm font-semibold py-2 rounded-xl hover:bg-indigo-700 transition-colors">
              Save Bill
            </button>
            <button onClick={() => { setAdding(false); setErr(""); }} className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Bill list */}
      {sorted.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-3xl mb-2">🗓️</p>
          <p className="text-xs">No bills tracked yet. Add your first bill above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map(b => {
            const days = daysUntil(b.dueDay);
            const urgency = days <= 2 ? "bg-red-50 border-red-200" : days <= 5 ? "bg-orange-50 border-orange-200" : "bg-white border-gray-100";
            const meta = CATEGORY_META[b.category];
            return (
              <div key={b.id} className={`flex items-center gap-3 border rounded-xl px-4 py-3 ${urgency}`}>
                <span className="text-xl">{meta.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800 truncate">{b.name}</p>
                    {b.autopay && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full">AUTO</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">Due day {b.dueDay} · {days === 0 ? "Due today!" : `${days}d away`}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">${b.amount.toFixed(2)}</p>
                  <p className="text-[10px] text-gray-400">/mo</p>
                </div>
                <button
                  onClick={() => remove(b.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none ml-1"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            );
          })}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-xs font-bold text-gray-600">Total tracked</span>
            <span className="text-sm font-extrabold text-indigo-700">${totalMonthly.toFixed(2)}/mo</span>
          </div>
        </div>
      )}
    </div>
  );
}
