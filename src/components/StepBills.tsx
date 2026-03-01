"use client";
import { useState } from "react";
import { Card, CardLabel, Eyebrow, PageTitle, Grad, Subtitle, Grid2, Field, Input, Select, Toggle, Notice, BtnRow, Btn } from "./ui";
import type { FormState } from "@/types";

export default function StepBills({ form, patchBill, onBack, onNext }: {
  form: FormState;
  patchBill: <C extends keyof FormState["bills"]>(cat: C, field: keyof FormState["bills"][C], val: unknown) => void;
  onBack: () => void; onNext: () => void;
}) {
  const [err, setErr] = useState("");
  const cats = form.categories;
  const b = form.bills;

  const num = (v: string) => v === "" ? 0 : parseFloat(v);

  const next = () => {
    const missing = cats.filter(c => !b[c]?.cost || b[c].cost <= 0);
    if (missing.length) { setErr(`Please enter your monthly cost for: ${missing.join(", ")}`); return; }
    setErr(""); onNext();
  };

  return (
    <div className="animate-fade-up">
      <Eyebrow>Step 2 of 4 — Your Bills</Eyebrow>
      <PageTitle>Current <Grad>bill details</Grad></PageTitle>
      <Subtitle>Enter exactly what you pay today. The more accurate this is, the more precise your savings estimate will be.</Subtitle>

      {/* ── MOBILE ─────────────────────────────────────── */}
      {cats.includes("mobile") && (
        <Card>
          <CardLabel icon="📱">Mobile / Telephone</CardLabel>
          <Grid2>
            <Field label="Current Carrier">
              <Select value={b.mobile.provider} onChange={e => patchBill("mobile","provider",e.target.value)}>
                <option value="">Select your carrier</option>
                {["AT&T","Verizon","T-Mobile","Sprint (now T-Mobile)","US Cellular","Boost Mobile",
                  "Cricket Wireless","Metro by T-Mobile","Google Fi","Consumer Cellular","Other"].map(p => (
                  <option key={p}>{p}</option>
                ))}
              </Select>
            </Field>
            <Field label="Monthly Bill" hint="Total after taxes and fees">
              <Input dollar type="number" placeholder="85" min="0" step="0.01"
                value={b.mobile.cost || ""}
                onChange={e => patchBill("mobile","cost", num(e.target.value))} />
            </Field>
            <Field label="Data Plan">
              <Select value={b.mobile.data} onChange={e => patchBill("mobile","data",e.target.value)}>
                <option value="unlimited">Unlimited data</option>
                <option value="50">50 GB / month</option>
                <option value="30">30 GB / month</option>
                <option value="15">15 GB / month</option>
                <option value="10">10 GB / month</option>
                <option value="5">5 GB / month</option>
                <option value="3">3 GB / month</option>
                <option value="1">1 GB / month</option>
              </Select>
            </Field>
            <Field label="Lines on Account" hint="Include all lines you pay for">
              <Input type="number" placeholder="1" min="1" max="10"
                value={b.mobile.lines || ""}
                onChange={e => patchBill("mobile","lines", parseInt(e.target.value) || 1)} />
            </Field>
          </Grid2>
          <div className="mt-4 space-y-0">
            <Toggle checked={b.mobile.hotspot} onChange={v => patchBill("mobile","hotspot",v)}
              label="Hotspot / Tethering" sub="Your plan includes mobile hotspot" />
            <Toggle checked={b.mobile.intl} onChange={v => patchBill("mobile","intl",v)}
              label="International Calling or Roaming" sub="You regularly use international features" />
          </div>
        </Card>
      )}

      {/* ── INTERNET ───────────────────────────────────── */}
      {cats.includes("internet") && (
        <Card>
          <CardLabel icon="📡">WiFi / Internet</CardLabel>
          <Grid2>
            <Field label="Current Provider">
              <Select value={b.internet.provider} onChange={e => patchBill("internet","provider",e.target.value)}>
                <option value="">Select your ISP</option>
                {["Comcast Xfinity","AT&T Internet","RCN Chicago","WOW! Internet",
                  "Starry Internet","T-Mobile Home Internet","Other"].map(p => (
                  <option key={p}>{p}</option>
                ))}
              </Select>
            </Field>
            <Field label="Monthly Bill" hint="Include equipment rental if any">
              <Input dollar type="number" placeholder="75" min="0" step="0.01"
                value={b.internet.cost || ""}
                onChange={e => patchBill("internet","cost", num(e.target.value))} />
            </Field>
            <Field label="Download Speed">
              <Select value={b.internet.speed || ""}
                onChange={e => patchBill("internet","speed", parseInt(e.target.value))}>
                <option value="">Select your speed</option>
                {[["1200","1.2 Gbps (Gigabit+)"],["1000","1 Gbps (Gigabit)"],
                  ["500","500 Mbps"],["400","400 Mbps"],["300","300 Mbps"],
                  ["200","200 Mbps"],["100","100 Mbps"],["50","50 Mbps"],["25","25 Mbps"]
                ].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </Select>
            </Field>
            <Field label="Data Cap">
              <Select value={b.internet.datacap}
                onChange={e => patchBill("internet","datacap", e.target.value as "yes"|"no")}>
                <option value="no">No data cap (unlimited)</option>
                <option value="yes">Has monthly data cap</option>
              </Select>
            </Field>
          </Grid2>
        </Card>
      )}

      {/* ── TRANSIT ────────────────────────────────────── */}
      {cats.includes("transit") && (
        <Card>
          <CardLabel icon="🚇">Transit</CardLabel>
          <Notice type="info" icon="💡">
            Be honest here — this is where most Loop residents are surprised. Include everything: passes, rideshares, parking.
          </Notice>
          <Grid2>
            <Field label="Primary Transit Method">
              <Select value={b.transit.mode} onChange={e => patchBill("transit","mode",e.target.value)}>
                <option value="">Select your main method</option>
                <optgroup label="CTA (L + Bus)">
                  <option value="cta-monthly">CTA 30-Day Unlimited Pass ($105)</option>
                  <option value="cta-reduced">CTA Reduced Fare 30-Day Pass ($50)</option>
                  <option value="cta-perride">CTA Pay-Per-Ride via Ventra</option>
                </optgroup>
                <optgroup label="Metra (Commuter Rail)">
                  <option value="metra-monthly-a">Metra Monthly Pass – Zone A ($106)</option>
                  <option value="metra-monthly-b">Metra Monthly Pass – Zone B ($142)</option>
                  <option value="metra-monthly-c">Metra Monthly Pass – Zone C ($164)</option>
                  <option value="metra-10ride">Metra 10-Ride Tickets</option>
                </optgroup>
                <optgroup label="Other">
                  <option value="rideshare">Rideshare (Uber / Lyft)</option>
                  <option value="car">Personal Car (parking + gas)</option>
                  <option value="divvy">Divvy Bike Share</option>
                </optgroup>
              </Select>
            </Field>
            <Field label="Monthly Transit Spend" hint="All transit costs combined (passes + Uber + parking)">
              <Input dollar type="number" placeholder="105" min="0" step="0.01"
                value={b.transit.cost || ""}
                onChange={e => patchBill("transit","cost", num(e.target.value))} />
            </Field>
            <Field label="Trips per Week" hint="Count each direction separately (commute to work = 1 trip)">
              <Input type="number" placeholder="10" min="1" max="60"
                value={b.transit.freq || ""}
                onChange={e => patchBill("transit","freq", parseInt(e.target.value) || 0)} />
            </Field>
            <Field label="Commute Type">
              <Select value={b.transit.commute}
                onChange={e => patchBill("transit","commute", e.target.value as any)}>
                <option value="loop-only">Within the Loop / Chicago only</option>
                <option value="suburb-loop">Suburb → Loop (daily commute)</option>
                <option value="mixed">Mixed — Loop + outer neighborhoods</option>
              </Select>
            </Field>
          </Grid2>
        </Card>
      )}

      {/* ── INSURANCE ──────────────────────────────────── */}
      {cats.includes("insurance") && (
        <Card>
          <CardLabel icon="🛡️">Insurance</CardLabel>
          <Grid2>
            <Field label="Insurance Type">
              <Select value={b.insurance.insType}
                onChange={e => patchBill("insurance","insType", e.target.value as any)}>
                <option value="">Select type</option>
                <option value="renters">Renters Insurance</option>
                <option value="auto">Auto Insurance</option>
                <option value="health">Health Insurance (individual ACA)</option>
              </Select>
            </Field>
            <Field label="Monthly Premium" hint="What you pay per month, not the annual">
              <Input dollar type="number" placeholder="45" min="0" step="0.01"
                value={b.insurance.cost || ""}
                onChange={e => patchBill("insurance","cost", num(e.target.value))} />
            </Field>
            <Field label="Deductible">
              <Select value={b.insurance.deductible}
                onChange={e => patchBill("insurance","deductible", parseInt(e.target.value))}>
                {[["0","$0 (no deductible)"],["500","$500"],["1000","$1,000"],
                  ["1500","$1,500"],["2500","$2,500"],["5000","$5,000"]].map(([v,l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </Select>
            </Field>
            <Field label="Coverage Level">
              <Select value={b.insurance.coverage}
                onChange={e => patchBill("insurance","coverage", e.target.value as any)}>
                <option value="basic">Basic — minimum required</option>
                <option value="standard">Standard — balanced coverage</option>
                <option value="premium">Premium — comprehensive</option>
              </Select>
            </Field>
          </Grid2>
          {b.insurance.insType === "auto" && (
            <Notice type="info" icon="🚗" className="mt-4">
              Loop residents typically drive far fewer miles than average. Usage-based insurance (Root, Progressive Snapshot) often saves Loop drivers 20–35% vs standard policies.
            </Notice>
          )}
          {b.insurance.insType === "health" && (
            <Notice type="warning" icon="⚠️" className="mt-4">
              Health plan rates shown are benchmark rates for a ~35-year-old with no ACA subsidy. If your household income is under $58,000 (single) or $79,000 (couple), you likely qualify for lower rates at healthcare.gov.
            </Notice>
          )}
        </Card>
      )}

      {err && <Notice type="error" icon="⚠️">{err}</Notice>}

      <BtnRow>
        <Btn variant="secondary" onClick={onBack}>← Back</Btn>
        <Btn variant="primary" onClick={next}>Continue →</Btn>
      </BtnRow>
    </div>
  );
}
