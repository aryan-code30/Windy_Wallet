"use client";
import { useState, useEffect, useRef } from "react";
import { Card, CardLabel, Grid2, Field, Input, Notice, BtnRow, Btn } from "./ui";
import { LOOP_ZIPS } from "@/lib/plans";
import type { FormState } from "@/types";

const ALL_ZIPS = ["60601","60602","60603","60604","60605","60606","60607","60611","60616","60661"];

const DEMO_FILL: Partial<FormState> = {
  zip: "60601",
  address: "233 S Wacker Dr (Willis Tower)",
  budget: { total: "3200", utilities: "180", personal: "600", other: "300" },
};

/** Animates a number from 0 → target */
function useCountUp(target: number, duration = 1600) {
  const [val, setVal] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return val;
}

export default function StepWelcome({ form, patch, onNext }: {
  form: FormState;
  patch: <K extends keyof FormState>(key: K, val: FormState[K]) => void;
  onNext: () => void;
}) {
  const [err, setErr] = useState("");
  const counter = useCountUp(2840);

  const zipStatus = form.zip.length === 5
    ? LOOP_ZIPS.has(form.zip) ? "ok" : "bad"
    : null;

  const fillDemo = () => {
    (Object.keys(DEMO_FILL) as (keyof FormState)[]).forEach(k => {
      patch(k, DEMO_FILL[k] as FormState[typeof k]);
    });
    setErr("");
  };

  const next = () => {
    if (!LOOP_ZIPS.has(form.zip)) { setErr("Please enter a valid Chicago Loop ZIP code."); return; }
    setErr(""); onNext();
  };

  return (
    <div className="animate-fade-up">

      {/* ── Dark hero banner ───────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden mb-6"
        style={{ background: "linear-gradient(135deg,#0F172A 0%,#1E1B4B 60%,#0F172A 100%)" }}>

        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle,#2563EB,transparent)" }} />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle,#7C3AED,transparent)" }} />
        </div>

        {/* Skyline silhouette at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10 pointer-events-none"
          style={{
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 80' preserveAspectRatio='none'%3E%3Cpath d='M0,80 L0,55 L40,55 L40,28 L60,28 L60,40 L80,40 L80,14 L100,14 L100,40 L120,40 L120,35 L140,35 L140,50 L160,50 L160,20 L180,20 L180,50 L200,50 L200,28 L220,28 L220,50 L240,50 L240,35 L260,35 L260,7 L280,7 L280,35 L300,35 L300,42 L320,42 L320,30 L340,30 L340,42 L360,42 L360,55 L400,55 L400,35 L420,35 L420,55 L440,55 L440,42 L460,42 L460,55 L500,55 L500,28 L520,28 L520,55 L540,55 L540,42 L560,42 L560,55 L600,55 L600,35 L620,35 L620,55 L640,55 L640,38 L660,38 L660,55 L680,55 L680,30 L700,30 L700,55 L720,55 L720,42 L740,42 L740,55 L760,55 L760,35 L780,35 L780,50 L800,50 L800,55 L840,55 L840,38 L860,38 L860,55 L880,55 L880,28 L900,28 L900,55 L920,55 L920,45 L940,45 L940,55 L960,55 L960,35 L980,35 L980,55 L1000,55 L1000,42 L1020,42 L1020,55 L1060,55 L1060,30 L1080,30 L1080,55 L1100,55 L1100,42 L1120,42 L1120,55 L1160,55 L1160,48 L1200,48 L1200,80 Z' fill='white'/%3E%3C/svg%3E") bottom/cover no-repeat`,
          }}
        />

        <div className="relative z-10 px-8 py-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-[11px] font-bold text-blue-200 tracking-wider uppercase mb-5">
            🏙 Chicago Loop Only · 10 ZIP Codes
          </div>

          {/* Headline */}
          <h1 className="font-display font-black text-white leading-[1.05] tracking-tight mb-3"
            style={{ fontSize: "clamp(32px,5vw,52px)" }}>
            Stop Overpaying<br />
            <span style={{
              background: "linear-gradient(90deg,#60A5FA,#A78BFA,#34D399)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              on Loop Life.
            </span>
          </h1>

          <p className="text-blue-200/70 text-[14px] leading-relaxed mb-6 max-w-xs mx-auto">
            Real Chicago pricing. Honest comparisons.<br />Built for the Loop. Built for you.
          </p>

          {/* Animated counter */}
          <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-8 py-4 mb-6">
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-blue-300/60 mb-1">
              Loop residents save avg / year
            </p>
            <p className="font-display font-black text-white leading-none" style={{ fontSize: "clamp(36px,6vw,52px)" }}>
              ${counter.toLocaleString()}
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-5">
            {["📱 Mobile","📡 Internet","🚇 Transit","🛡 Insurance","🏷 Discounts","🏙 Loop Tools"].map(t => (
              <span key={t}
                className="bg-white/10 border border-white/15 rounded-full px-3 py-1 text-[11px] font-semibold text-white/75">
                {t}
              </span>
            ))}
          </div>

          {/* Demo fill button */}
          <button
            type="button"
            onClick={fillDemo}
            className="inline-flex items-center gap-2 bg-white/15 border border-white/25 hover:bg-white/25 transition-all rounded-full px-5 py-2 text-[12px] font-bold text-white"
          >
            ⚡ Auto-fill Demo Data
          </button>

          <p className="text-white/25 text-[10px] mt-4">Free · No login · Takes 2 minutes</p>
        </div>
      </div>

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          ["~$280", "Avg monthly savings", "text-blue-600"],
          ["10",    "Loop ZIP codes",       "text-violet-600"],
          ["Mar 2026", "Data verified",     "text-emerald-600"],
        ].map(([v, l, cls]) => (
          <div key={l} className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
            <div className={`font-display text-2xl font-extrabold tracking-tight ${cls} mb-1`}>{v}</div>
            <div className="text-xs text-gray-400 font-medium leading-tight">{l}</div>
          </div>
        ))}
      </div>

      {/* ZIP verification */}
      <Card>
        <CardLabel icon="📍">Verify Your Chicago Loop Location</CardLabel>
        <Grid2>
          <Field label="ZIP Code">
            <Input
              type="text" maxLength={5} placeholder="e.g. 60601"
              value={form.zip}
              onChange={e => { patch("zip", e.target.value); setErr(""); }}
            />
            {zipStatus === "ok" && (
              <p className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                <span>✓</span> Valid Loop ZIP — you're covered
              </p>
            )}
            {zipStatus === "bad" && (
              <p className="text-xs text-red-500 font-semibold mt-1.5">
                ✗ {form.zip} is outside the Loop. WindyWallet is Loop-only.
              </p>
            )}
            <div className="flex flex-wrap gap-1 mt-2">
              {ALL_ZIPS.map(z => (
                <button
                  key={z}
                  type="button"
                  onClick={() => { patch("zip", z); setErr(""); }}
                  className={`text-[10.5px] font-mono font-semibold px-2 py-0.5 rounded transition-colors
                    ${form.zip === z ? "bg-primary text-white" : "bg-gray-100 text-gray-400 hover:bg-blue-50 hover:text-primary"}`}
                >
                  {z}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Building / Address" hint="Optional — helps verify provider availability">
            <Input type="text" placeholder="e.g. 233 S Wacker Dr"
              value={form.address}
              onChange={e => patch("address", e.target.value)}
            />
          </Field>
        </Grid2>
      </Card>

      {/* Month / Year */}
      <Card>
        <CardLabel icon="📅">Analysis Period</CardLabel>
        <p className="text-xs text-gray-400 mb-4 -mt-3 leading-relaxed">
          Choose the month and year this analysis should be saved under for your history.
        </p>
        <Grid2>
          <Field label="Month">
            <select
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              value={form.month}
              onChange={e => patch("month", Number(e.target.value))}
            >
              {["January","February","March","April","May","June","July","August","September","October","November","December"].map((name, i) => (
                <option key={i + 1} value={i + 1}>{name}</option>
              ))}
            </select>
          </Field>
          <Field label="Year">
            <select
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              value={form.year}
              onChange={e => patch("year", Number(e.target.value))}
            >
              {[2024, 2025, 2026, 2027].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </Field>
        </Grid2>
      </Card>

      {/* Budget */}
      <Card>
        <CardLabel icon="💰">Monthly Budget Overview</CardLabel>
        <p className="text-xs text-gray-400 mb-4 -mt-3 leading-relaxed">
          Optional — used to calculate what % of your budget you could recover. All fields are for context only.
        </p>
        <Grid2>
          {([
            ["total",     "Total Monthly Budget",  "3,500"],
            ["utilities", "Utility Bills (total)",  "300"],
            ["personal",  "Personal Expenses",      "800"],
            ["other",     "Other Expenses",         "400"],
          ] as const).map(([k, label, ph]) => (
            <Field key={k} label={label}>
              <Input dollar type="number" placeholder={ph} min="0"
                value={form.budget[k]}
                onChange={e => patch("budget", { ...form.budget, [k]: e.target.value })}
              />
            </Field>
          ))}
        </Grid2>
      </Card>

      {err && <Notice type="error" icon="⚠️">{err}</Notice>}

      <BtnRow center>
        <Btn variant="primary" onClick={next}>Get Started →</Btn>
      </BtnRow>
    </div>
  );
}
