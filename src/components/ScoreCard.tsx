"use client";
import { useState } from "react";
import type { AnalyzeResponse, FormState, DiscountType } from "@/types";

const DISC_LABELS: Record<DiscountType, string> = {
  veteran:"Veteran", disability:"Disability", senior:"Senior",
  frontline:"Frontline Worker", lowincome:"Income-Qualified", child:"Family", none:"No Discount",
};

function getGrade(savingPct: number, optimizedPct: number): {
  grade: string; label: string; color: string; bg: string; tip: string;
} {
  const score = savingPct * 0.6 + optimizedPct * 0.4;
  if (score >= 35) return { grade:"A+", label:"Elite Saver", color:"text-emerald-600", bg:"bg-emerald-50 border-emerald-200", tip:"You're unlocking maximum savings. Outstanding." };
  if (score >= 25) return { grade:"A",  label:"Great Saver", color:"text-emerald-500", bg:"bg-emerald-50 border-emerald-200", tip:"Well above average Loop saver. Keep it up!" };
  if (score >= 15) return { grade:"B",  label:"Good Shape",  color:"text-blue-600",    bg:"bg-blue-50 border-blue-200",     tip:"Solid savings. A few tweaks away from excellent." };
  if (score >= 8)  return { grade:"C",  label:"Room to Grow",color:"text-amber-600",   bg:"bg-amber-50 border-amber-200",   tip:"Moderate savings found. Consider bundling services." };
  if (score >= 3)  return { grade:"D",  label:"Just Starting",color:"text-orange-600", bg:"bg-orange-50 border-orange-200", tip:"Small wins here — explore discount programs." };
  return               { grade:"F",  label:"Overpaying",  color:"text-red-600",     bg:"bg-red-50 border-red-200",       tip:"Your current plans are far from optimal for the Loop." };
}

interface Props {
  result: AnalyzeResponse;
  form: FormState;
}

export default function ScoreCard({ result, form }: Props) {
  const [copied, setCopied] = useState(false);

  const { totalMonthlySavings, totalAnnualSavings, results, discountMultiplier, generatedAt } = result;
  const optimized = results.filter(r => !r.alreadyOptimal).length;
  const budget = parseFloat(form.budget.total) || 0;
  const savingPct = budget > 0 ? (totalMonthlySavings / budget) * 100 : (totalMonthlySavings / 300) * 100;
  const optimizedPct = results.length > 0 ? (optimized / results.length) * 100 : 0;
  const { grade, label, color, bg, tip } = getGrade(savingPct, optimizedPct);

  const discLabels = form.discounts
    .filter(d => d !== "none")
    .map(d => DISC_LABELS[d])
    .filter(Boolean);

  // Bar segments
  const segments = [
    { label: "Plans optimized", val: optimizedPct, color: "bg-emerald-400" },
    { label: "Budget recovered", val: Math.min(savingPct * 2, 100), color: "bg-blue-400" },
    { label: "Discount applied", val: discountMultiplier > 0 ? Math.min(discountMultiplier * 2.5, 100) : 0, color: "bg-violet-400" },
  ];

  const copyShare = async () => {
    const txt = [
      `🌬 WindyWallet Loop Life Score: ${grade} — ${label}`,
      `📍 ZIP ${result.zip} · ${generatedAt}`,
      `💰 Monthly Savings: $${totalMonthlySavings.toFixed(2)}`,
      `📅 Annual Savings: $${totalAnnualSavings.toFixed(0)}`,
      `✅ ${optimized} of ${results.length} plans optimized`,
      discLabels.length ? `🏷 Discounts: ${discLabels.join(", ")}` : "",
      "",
      "Analyze your Loop bills free at: windywallet.app",
    ].filter(Boolean).join("\n");
    try {
      await navigator.clipboard.writeText(txt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className={`rounded-2xl border-2 ${bg} p-6 mb-6`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Loop Life Score</p>
          <div className="flex items-baseline gap-3">
            <span className={`font-display text-[64px] font-black leading-none ${color}`}>{grade}</span>
            <div>
              <p className={`text-base font-black ${color}`}>{label}</p>
              <p className="text-xs text-gray-500 mt-0.5 max-w-[200px] leading-snug">{tip}</p>
            </div>
          </div>
        </div>

        {/* Share button */}
        <button
          onClick={copyShare}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-[12px] font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
        >
          {copied ? "✅ Copied!" : "📤 Share"}
        </button>
      </div>

      {/* Score bars */}
      <div className="space-y-3 mb-5">
        {segments.map(s => (
          <div key={s.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-gray-500">{s.label}</span>
              <span className="text-[11px] font-bold text-gray-700">{s.val.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${s.color} rounded-full transition-all duration-1000`}
                style={{ width: `${s.val}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { v: `$${totalMonthlySavings.toFixed(2)}`, l: "Monthly savings", c: "text-emerald-600" },
          { v: `$${totalAnnualSavings.toFixed(0)}`,  l: "Annual savings",  c: "text-blue-600"    },
          { v: `${optimized}/${results.length}`,     l: "Plans optimized", c: "text-violet-600"  },
        ].map(s => (
          <div key={s.l} className="bg-white/70 rounded-xl p-3 text-center border border-white">
            <p className={`font-display text-[18px] font-black leading-none ${s.c} mb-0.5`}>{s.v}</p>
            <p className="text-[10px] text-gray-400 font-medium">{s.l}</p>
          </div>
        ))}
      </div>

      {discLabels.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {discLabels.map(d => (
            <span key={d} className="bg-violet-100 text-violet-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-violet-200">
              🏷 {d}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
