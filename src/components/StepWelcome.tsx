"use client";
import { useState } from "react";
import { Card, CardLabel, Eyebrow, PageTitle, Grad, Subtitle, Grid2, Field, Input, Notice, BtnRow, Btn } from "./ui";
import { LOOP_ZIPS } from "@/lib/plans";
import type { FormState } from "@/types";

const ALL_ZIPS = ["60601","60602","60603","60604","60605","60606","60607","60611","60616","60661"];

export default function StepWelcome({ form, patch, onNext }: {
  form: FormState;
  patch: <K extends keyof FormState>(key: K, val: FormState[K]) => void;
  onNext: () => void;
}) {
  const [err, setErr] = useState("");

  const zipStatus = form.zip.length === 5
    ? LOOP_ZIPS.has(form.zip) ? "ok" : "bad"
    : null;

  const next = () => {
    if (!LOOP_ZIPS.has(form.zip)) { setErr("Please enter a valid Chicago Loop ZIP code."); return; }
    setErr(""); onNext();
  };

  return (
    <div className="animate-fade-up">
      {/* Hero banner */}
      <div className="rounded-2xl p-10 mb-6 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#EFF6FF 0%,#F5F3FF 100%)" }}>
        <div className="absolute right-0 top-0 text-[110px] opacity-[0.06] pointer-events-none select-none leading-none">🌬</div>
        <div className="relative z-10">
          <Eyebrow>🏙 Chicago Loop Only — 10 ZIP Codes</Eyebrow>
          <PageTitle>
            Stop Overpaying<br />on <Grad>Your Bills</Grad>
          </PageTitle>
          <p className="text-[15px] text-gray-500 max-w-sm mx-auto mb-6 leading-relaxed">
            Real Chicago pricing. Honest comparisons. Built by a Loop resident who was tired of overpaying.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["📱 Mobile","📡 Internet","🚇 Transit","🛡 Insurance"].map(t => (
              <span key={t} className="bg-white/80 rounded-full px-4 py-1.5 text-xs font-semibold text-gray-600 shadow-sm">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          ["~$280", "Avg annual savings", "text-primary"],
          ["10",    "Loop ZIP codes",      "text-accent"],
          ["Jan 2026", "Data verified",   "text-emerald-600"],
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
