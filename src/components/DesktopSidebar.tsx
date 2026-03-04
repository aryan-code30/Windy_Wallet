"use client";
import type { AnalyzeResponse, FormState } from "@/types";

const STEP_LABELS = [
  { icon: "📍", label: "Location",   sub: "ZIP + Budget" },
  { icon: "📋", label: "Categories", sub: "What to analyze" },
  { icon: "🧾", label: "Bills",      sub: "Current costs" },
  { icon: "🏷️", label: "Discounts",  sub: "Eligible groups" },
  { icon: "📊", label: "Results",    sub: "Savings breakdown" },
];

interface Props {
  step: number;
  form: FormState;
  result: AnalyzeResponse | null;
  onStepClick: (n: number) => void;
}

export default function DesktopSidebar({ step, form, result, onStepClick }: Props) {
  const totalSavings  = result?.totalMonthlySavings ?? 0;
  const annualSavings = result?.totalAnnualSavings  ?? 0;
  const optimized     = result?.results.filter(r => !r.alreadyOptimal).length ?? 0;
  const total         = result?.results.length ?? 0;
  const budget        = parseFloat(form.budget.total) || 0;

  return (
    <aside className="w-64 flex-shrink-0 sticky top-[65px] self-start h-[calc(100vh-65px)] overflow-y-auto flex flex-col gap-4 py-6 pl-4 pr-2">

      {/* ── Step navigator ── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <p className="text-[9.5px] font-bold uppercase tracking-widest text-gray-400">Progress</p>
        </div>
        <div className="px-2 pb-3 space-y-0.5">
          {STEP_LABELS.map((s, i) => {
            const done    = i < step;
            const current = i === step;
            const locked  = i > step && !(i === 4 && result);
            return (
              <button
                key={i}
                onClick={() => !locked && onStepClick(i)}
                disabled={locked}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150
                  ${current ? "bg-blue-50 border border-blue-200" : ""}
                  ${done ? "hover:bg-gray-50 cursor-pointer" : ""}
                  ${locked ? "opacity-30 cursor-not-allowed" : ""}
                `}
              >
                {/* Status dot */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 transition-all
                  ${done    ? "bg-emerald-100 text-emerald-600" : ""}
                  ${current ? "shadow-sm text-base"             : ""}
                  ${locked  ? "bg-gray-50"                      : ""}
                `}
                  style={current ? { background: "linear-gradient(135deg,#2563EB,#7C3AED)" } : undefined}
                >
                  {done ? "✓" : s.icon}
                </div>
                <div className="min-w-0">
                  <p className={`text-[12px] font-bold leading-none truncate
                    ${current ? "text-primary" : done ? "text-gray-700" : "text-gray-400"}`}>
                    {s.label}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{s.sub}</p>
                </div>
                {done && (
                  <span className="ml-auto text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full flex-shrink-0">
                    Done
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Live savings panel ── */}
      {result && (
        <div className="rounded-2xl overflow-hidden shadow-sm"
          style={{ background: "linear-gradient(135deg,#1E40AF,#6D28D9)" }}>
          <div className="px-4 py-4">
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/50 mb-1">Monthly Savings</p>
            <p className="font-display text-[32px] font-black text-white leading-none">
              ${totalSavings.toFixed(2)}
            </p>
            <p className="text-white/60 text-[11px] mt-1">${annualSavings.toFixed(0)}/yr</p>
            <div className="mt-3 h-px bg-white/10" />
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-[11px]">Plans optimized</span>
                <span className="text-white font-bold text-[12px]">{optimized}/{total}</span>
              </div>
              {budget > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-[11px]">Budget recovered</span>
                  <span className="text-white font-bold text-[12px]">
                    {((totalSavings / budget) * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Form snapshot ── */}
      {(form.zip || form.categories.length > 0) && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-4 py-4 space-y-2">
          <p className="text-[9.5px] font-bold uppercase tracking-widest text-gray-400 mb-3">Your Info</p>
          {form.zip && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-400">ZIP</span>
              <span className="text-[12px] font-bold text-gray-700 font-mono">{form.zip}</span>
            </div>
          )}
          {form.categories.length > 0 && (
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] text-gray-400 flex-shrink-0">Analyzing</span>
              <div className="flex flex-wrap gap-1 justify-end">
                {form.categories.map(c => (
                  <span key={c} className="text-[9px] font-bold bg-blue-50 text-primary px-1.5 py-0.5 rounded-full capitalize">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
          {form.discounts.length > 0 && form.discounts[0] !== "none" && (
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] text-gray-400 flex-shrink-0">Discounts</span>
              <div className="flex flex-wrap gap-1 justify-end">
                {form.discounts.filter(d => d !== "none").map(d => (
                  <span key={d} className="text-[9px] font-bold bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded-full capitalize">
                    🏷 {d}
                  </span>
                ))}
              </div>
            </div>
          )}
          {parseFloat(form.budget.total) > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-400">Budget</span>
              <span className="text-[12px] font-bold text-gray-700">${parseFloat(form.budget.total).toLocaleString()}/mo</span>
            </div>
          )}
        </div>
      )}

      {/* ── Quick tips ── */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-4">
        <p className="text-[9.5px] font-bold uppercase tracking-widest text-amber-600 mb-2">💡 Loop Tip</p>
        <p className="text-[11px] text-amber-800 leading-relaxed">
          {step === 0 && "Enter your exact ZIP — pricing varies across the 10 Loop ZIPs."}
          {step === 1 && "Select all categories you pay for. More categories = more savings found."}
          {step === 2 && "Use the ⚡ Auto-fill button to demo realistic Loop resident bills instantly."}
          {step === 3 && "Stack multiple discounts for up to 40% off eligible plans."}
          {step === 4 && "Share your Loop Life Score with the 📤 button on your score card."}
        </p>
      </div>

      {/* ── Chicago fun fact ── */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4">
        <p className="text-[9.5px] font-bold uppercase tracking-widest text-gray-400 mb-2">🏙️ Did you know?</p>
        <p className="text-[11px] text-gray-500 leading-relaxed">
          The Chicago Loop covers just 1.8 square miles — yet 500,000+ people commute through it daily. WindyWallet is the only optimizer built specifically for this ZIP range.
        </p>
      </div>

    </aside>
  );
}
