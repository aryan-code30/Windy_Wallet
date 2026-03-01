"use client";
import { useState } from "react";
import { Eyebrow, PageTitle, Grad, Subtitle, Notice, BtnRow, Btn } from "./ui";
import type { FormState, Category } from "@/types";

const CATS: { id: Category; emoji: string; name: string; desc: string; avg: string }[] = [
  { id:"mobile",    emoji:"📱", name:"Mobile / Telephone", desc:"Phone plans, data, hotspot & international", avg:"Avg Loop overpay: $35/mo" },
  { id:"internet",  emoji:"📡", name:"WiFi / Internet",    desc:"Broadband, fiber, cable & fixed wireless",   avg:"Avg Loop overpay: $22/mo" },
  { id:"transit",   emoji:"🚇", name:"Transit",            desc:"CTA Ventra, Metra & commuter passes",        avg:"Avg Loop overpay: $42/mo" },
  { id:"insurance", emoji:"🛡️", name:"Insurance",          desc:"Renters, auto & health plans",              avg:"Avg Loop overpay: $28/mo" },
];

export default function StepCategories({ form, patch, onBack, onNext }: {
  form: FormState;
  patch: <K extends keyof FormState>(key: K, val: FormState[K]) => void;
  onBack: () => void; onNext: () => void;
}) {
  const [err, setErr] = useState(false);

  const toggle = (id: Category) => {
    const next = form.categories.includes(id)
      ? form.categories.filter(c => c !== id)
      : [...form.categories, id];
    patch("categories", next);
    if (next.length) setErr(false);
  };

  const next = () => { if (!form.categories.length) { setErr(true); return; } onNext(); };

  return (
    <div className="animate-fade-up">
      <Eyebrow>Step 1 of 4 — Categories</Eyebrow>
      <PageTitle>What should we <Grad>optimize?</Grad></PageTitle>
      <Subtitle>Pick the bills you want analyzed. Each one gets a real before/after comparison with Chicago-specific alternatives.</Subtitle>

      <div className="grid grid-cols-2 gap-3.5 mb-6">
        {CATS.map(c => {
          const on = form.categories.includes(c.id);
          return (
            <button
              key={c.id} type="button"
              onClick={() => toggle(c.id)}
              className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200 group
                ${on ? "bg-blue-50 border-primary shadow-sm" : "bg-gray-50 border-transparent hover:border-gray-200"}`}
            >
              {/* Checkmark */}
              <div className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold transition-all
                ${on ? "bg-primary text-white scale-100" : "bg-gray-200 text-transparent scale-75"}`}>
                ✓
              </div>

              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 bg-white transition-shadow
                ${on ? "shadow-md" : "shadow-sm"}`}>
                {c.emoji}
              </div>
              <p className="text-sm font-bold text-gray-900 mb-1">{c.name}</p>
              <p className="text-xs text-gray-400 leading-snug mb-2">{c.desc}</p>
              <p className={`text-[10.5px] font-semibold ${on ? "text-primary" : "text-gray-400"}`}>{c.avg}</p>
            </button>
          );
        })}
      </div>

      {err && <Notice type="warning" icon="⚠️">Please select at least one category to continue.</Notice>}

      <BtnRow>
        <Btn variant="secondary" onClick={onBack}>← Back</Btn>
        <Btn variant="primary" onClick={next}>Continue →</Btn>
      </BtnRow>
    </div>
  );
}
