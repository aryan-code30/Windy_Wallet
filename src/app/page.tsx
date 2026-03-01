"use client";
import { useState } from "react";
import Header from "@/components/Header";
import StepWelcome from "@/components/StepWelcome";
import StepCategories from "@/components/StepCategories";
import StepBills from "@/components/StepBills";
import StepDiscounts from "@/components/StepDiscounts";
import StepResults from "@/components/StepResults";
import type { FormState, AnalyzeResponse } from "@/types";

const now = new Date();
const INITIAL: FormState = {
  zip: "", address: "",
  budget: { total: "", utilities: "", personal: "", other: "" },
  categories: [],
  bills: {
    mobile:    { provider: "", cost: 0, data: "unlimited", lines: 1, hotspot: false, intl: false },
    internet:  { provider: "", cost: 0, speed: 200, datacap: "no" },
    transit:   { mode: "", cost: 0, freq: 10, commute: "loop-only" },
    insurance: { insType: "", cost: 0, deductible: 500, coverage: "standard" },
  },
  discounts: [], childCount: 1, attested: false,
  month: now.getMonth() + 1,
  year:  now.getFullYear(),
};

export default function Page() {
  const [step, setStep]       = useState(0);
  const [form, setForm]       = useState<FormState>(INITIAL);
  const [result, setResult]   = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiErr, setApiErr]   = useState("");

  const goTo = (n: number) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const patch = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm(p => ({ ...p, [key]: val }));

  const patchBill = <C extends keyof FormState["bills"]>(
    cat: C, field: keyof FormState["bills"][C], val: unknown
  ) =>
    setForm(p => ({
      ...p,
      bills: { ...p.bills, [cat]: { ...p.bills[cat], [field]: val } },
    }));

  const handleAnalyze = async () => {
    setLoading(true); setApiErr(""); goTo(4);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zip: form.zip,
          categories: form.categories,
          bills: form.bills,
          discounts: form.discounts,
          childCount: form.childCount,
          budget: form.budget,
        }),
      });
      const contentType = res.headers.get("content-type") ?? "";
      const data = contentType.includes("application/json") ? await res.json() : null;
      if (!res.ok) {
        const fallback = data?.error ?? `Analysis failed (${res.status})`;
        throw new Error(fallback);
      }
      if (!data) throw new Error("Analysis failed: server returned an unexpected response.");
      setResult(data as AnalyzeResponse);
      // persist to DB silently
      fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zip: form.zip,
          categories: form.categories,
          discounts: form.discounts,
          totalSavings: data.totalMonthlySavings,
          annualSavings: data.totalAnnualSavings,
          optimizedCount: data.results?.filter((r: any) => !r.alreadyOptimal).length ?? 0,
          month: form.month,
          year:  form.year,
          billsSnapshot: form.bills,
        }),
      }).catch(() => {});
    } catch (e: any) {
      setApiErr(e.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setForm(INITIAL); setResult(null); setApiErr(""); goTo(0); };

  const pages = [
    <StepWelcome    key={0} form={form} patch={patch} onNext={() => goTo(1)} />,
    <StepCategories key={1} form={form} patch={patch} onBack={() => goTo(0)} onNext={() => goTo(2)} />,
    <StepBills      key={2} form={form} patchBill={patchBill} onBack={() => goTo(1)} onNext={() => goTo(3)} />,
    <StepDiscounts  key={3} form={form} patch={patch} onBack={() => goTo(2)} onSubmit={handleAnalyze} />,
    <StepResults    key={4} result={result} loading={loading} error={apiErr} form={form} onBack={() => goTo(2)} onReset={reset} />,
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header step={step} totalSteps={5} />
      <main className="max-w-3xl mx-auto px-5 py-10 pb-24">
        {pages[step]}
      </main>
    </div>
  );
}
