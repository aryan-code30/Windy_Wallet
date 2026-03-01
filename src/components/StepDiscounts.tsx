"use client";
import { useState } from "react";
import { Card, CardLabel, Eyebrow, PageTitle, Grad, Subtitle, Field, Input, CheckCard, Notice, BtnRow, Btn } from "./ui";
import type { FormState, DiscountType } from "@/types";

const DISCOUNTS: {
  id: DiscountType; emoji: string; label: string; sub: string;
  pct: number; programs: string;
}[] = [
  {
    id: "veteran", emoji: "🎖", label: "Veteran / Active Military",
    sub: "Active duty, honorably discharged, or military family",
    pct: 10,
    programs: "Mint Mobile military discount, T-Mobile military plan ($35/line), Verizon military pricing",
  },
  {
    id: "disability", emoji: "♿", label: "Disability",
    sub: "ADA-recognized disability, SSI, or SSDI recipient",
    pct: 12,
    programs: "CTA Reduced Fare ($50/mo), Comcast Internet Essentials, AT&T Access, reduced insurance rates",
  },
  {
    id: "senior", emoji: "🧓", label: "Senior (Age 65+)",
    sub: "Age 65 or older",
    pct: 12,
    programs: "CTA Reduced Fare ($50/mo), Metra 50% discount, Consumer Cellular AARP 5% off, Medicare health plans",
  },
  {
    id: "frontline", emoji: "🏥", label: "Frontline Worker",
    sub: "Healthcare, fire, police, CTA/Metra employee, or first responder",
    pct: 8,
    programs: "T-Mobile First Responder plan ($35/line), Verizon first responder discount, Comcast workforce rate",
  },
  {
    id: "lowincome", emoji: "🏠", label: "Income-Qualified",
    sub: "Enrolled in SNAP, Medicaid, WIC, Lifeline, or similar program",
    pct: 15,
    programs: "Comcast Internet Essentials ($9.95/mo), AT&T Access ($10/mo), ACA health subsidies, Lifeline phone program",
  },
  {
    id: "child", emoji: "👶", label: "Children Under 12 in Household",
    sub: "Qualifies for family plan discounts and school connectivity programs",
    pct: 4,
    programs: "Multi-line family discounts, Comcast Internet Essentials (K-12 students), school connectivity programs",
  },
  {
    id: "none", emoji: "🚫", label: "None of the Above",
    sub: "I don't qualify for any of the listed discount groups",
    pct: 0,
    programs: "",
  },
];

export default function StepDiscounts({ form, patch, onBack, onSubmit }: {
  form: FormState;
  patch: <K extends keyof FormState>(key: K, val: FormState[K]) => void;
  onBack: () => void; onSubmit: () => void;
}) {
  const [err, setErr] = useState("");
  const [expanded, setExpanded] = useState<DiscountType | null>(null);

  const toggle = (id: DiscountType) => {
    if (id === "none") {
      // Selecting "none" clears all other selections
      const next = form.discounts.includes("none") ? [] : ["none" as DiscountType];
      patch("discounts", next);
    } else {
      // Selecting any real discount clears "none"
      const without = form.discounts.filter(d => d !== "none");
      const next = without.includes(id) ? without.filter(d => d !== id) : [...without, id];
      patch("discounts", next);
    }
  };

  const submit = () => {
    if (!form.attested) { setErr("Please complete the attestation below to continue."); return; }
    setErr(""); onSubmit();
  };

  // Estimate combined discount — exclude "none"
  const totalDiscPct = DISCOUNTS
    .filter(d => d.id !== "none" && form.discounts.includes(d.id))
    .reduce((s, d) => s + d.pct + (d.id === "child" ? (form.childCount - 1) * d.pct : 0), 0);
  const cappedPct = Math.min(totalDiscPct, 40);

  return (
    <div className="animate-fade-up">
      <Eyebrow>Step 3 of 4 — Discounts</Eyebrow>
      <PageTitle>Do you qualify for <Grad>discounts?</Grad></PageTitle>
      <Subtitle>
        These are real programs from carriers, CTA, and insurers — not made up. Select one that applies. Skipping this step is fine.
      </Subtitle>

      {/* Live discount preview */}
      {form.discounts.filter(d => d !== "none").length > 0 && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4 mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-emerald-800">
              {form.discounts.filter(d => d !== "none").length} discount{form.discounts.filter(d => d !== "none").length > 1 ? "s" : ""} selected
            </p>
            <p className="text-xs text-emerald-600 mt-0.5">
              Up to {cappedPct}% additional savings applied to eligible plans
            </p>
          </div>
          <div className="font-display text-3xl font-extrabold text-emerald-600">-{cappedPct}%</div>
        </div>
      )}

      <Card>
        <CardLabel icon="🎫">Eligible Groups</CardLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {DISCOUNTS.map(d => (
            <div key={d.id}>
              <CheckCard
                checked={form.discounts.includes(d.id)}
                onClick={() => {
                  toggle(d.id);
                  setExpanded(form.discounts.includes(d.id) ? null : d.id);
                }}
                emoji={d.emoji} label={d.label} sub={d.sub}
                badge={`~${d.pct}% off eligible plans`}
              />
              {/* Expanded program details */}
              {form.discounts.includes(d.id) && d.id !== "none" && (
                <div className="mt-1.5 ml-1 bg-blue-50 border border-blue-100 rounded-xl px-3.5 py-3">
                  <p className="text-[11px] font-bold text-primary uppercase tracking-wide mb-1">Applicable programs</p>
                  <p className="text-xs text-blue-700 leading-relaxed">{d.programs}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Child count */}
        {form.discounts.includes("child") && (
          <div className="mt-5 pt-5 border-t border-gray-100">
            <Field label="Number of children under 12">
              <Input type="number" min="1" max="8"
                value={form.childCount}
                onChange={e => patch("childCount", parseInt(e.target.value) || 1)}
                className="max-w-[110px]"
              />
            </Field>
          </div>
        )}
      </Card>

      {/* Self-attestation */}
      <Card>
        <CardLabel icon="✅">Confirm & Attest</CardLabel>
        <button
          type="button"
          onClick={() => { patch("attested", !form.attested); setErr(""); }}
          className={`w-full flex items-start gap-3.5 p-5 rounded-xl border-2 text-left transition-all
            ${form.attested
              ? "bg-accent/5 border-accent"
              : "bg-gray-50 border-gray-200 hover:border-gray-300"}`}
        >
          <div className={`w-5 h-5 rounded-md flex-shrink-0 mt-0.5 flex items-center justify-center text-[11px] font-bold transition-all
            ${form.attested ? "bg-accent text-white border-accent" : "border-2 border-gray-300 text-transparent"}`}>
            ✓
          </div>
          <div>
            <p className="text-[13.5px] font-semibold text-gray-900 mb-1">
              I confirm the information I provided is accurate.
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              I understand that eligibility for discount programs is self-attested. WindyWallet shows available options based on what you tell us — final eligibility is verified by each provider.
              All pricing is sourced from publicly available provider websites as of January 2026.
            </p>
          </div>
        </button>
      </Card>

      {err && <Notice type="error" icon="⚠️">{err}</Notice>}

      <BtnRow>
        <Btn variant="secondary" onClick={onBack}>← Back</Btn>
        <Btn variant="accent" onClick={submit}>🔍 Analyze My Bills →</Btn>
      </BtnRow>
    </div>
  );
}
