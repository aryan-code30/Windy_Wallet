"use client";
import { useViewMode } from "./ViewModeContext";

const STEP_LABELS = ["Location", "Categories", "Bills", "Discounts", "Results"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const now = new Date();
const CURRENT_LABEL = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;

export default function Header({ step, totalSteps }: { step: number; totalSteps: number }) {
  const pct = Math.round((step / (totalSteps - 1)) * 100);
  const { mode, setMode } = useViewMode();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/70">
      <div className="max-w-screen-xl mx-auto px-5 h-16 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-md"
            style={{ background: "linear-gradient(135deg,#2563EB,#7C3AED)" }}>
            🌬
          </div>
          <div>
            <div className="font-display text-[18px] font-bold leading-none tracking-tight">
              Windy
              <span style={{ background:"linear-gradient(90deg,#2563EB,#7C3AED)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                Wallet
              </span>
            </div>
            <div className="text-[9px] text-gray-400 tracking-widest mt-0.5 uppercase">Chicago Loop · {CURRENT_LABEL}</div>
          </div>
        </div>

        {/* ── Step label (center) ── */}
        <div className="flex-1 flex justify-center">
          {step < totalSteps - 1 && (
            <div className="text-xs font-semibold text-gray-400">
              Step <span className="text-gray-700">{step + 1}</span> of {totalSteps - 1} —{" "}
              <span className="text-primary">{STEP_LABELS[step]}</span>
            </div>
          )}
          {step === totalSteps - 1 && (
            <div className="text-xs font-semibold text-emerald-600">✓ Analysis Complete</div>
          )}
        </div>

        {/* ── View mode toggle ── */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-gray-400">View</span>
          <div className="flex items-center bg-gray-100 rounded-full p-0.5 gap-0.5">
            <button
              onClick={() => setMode("mobile")}
              title="Mobile layout"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 ${
                mode === "mobile"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              <span className="hidden sm:inline">Mobile</span>
            </button>
            <button
              onClick={() => setMode("desktop")}
              title="Desktop layout"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 ${
                mode === "desktop"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <svg width="13" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span className="hidden sm:inline">Desktop</span>
            </button>
          </div>
        </div>

      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg,#2563EB,#7C3AED)",
          }}
        />
      </div>
    </header>
  );
}
