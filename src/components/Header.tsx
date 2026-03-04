"use client";

const STEP_LABELS = ["Location", "Categories", "Bills", "Discounts", "Results"];
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const now = new Date();
const CURRENT_LABEL = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;

export default function Header({ step, totalSteps }: { step: number; totalSteps: number }) {
  const pct = Math.round((step / (totalSteps - 1)) * 100);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/70">
      <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
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

        {/* Step label */}
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
