# 🌬 WindyWallet v3
### Chicago Loop Bill Optimizer — Built for Real People, Not Demo Portfolios

> Built as if you live at 233 S Wacker Dr and are tired of overpaying.

---

## What Changed in v3

### Logic & Accuracy
- **Mobile**: Only recommends plans that meet ALL your requirements (hotspot, intl, data, lines). Explains WHY the recommended plan works — network, coverage, caveats.
- **Internet**: Compares TRUE cost (monthly + equipment fee). Won't recommend anything below 60% of your current speed. Prefers plans with adequate upload speed for WFH.
- **Transit**: Real CTA break-even math ($105 pass ÷ $2.25/ride = 46.7 rides/month threshold). Suburb-to-Loop commuters get Metra logic. Rideshare users get the hard truth.
- **Insurance**: Never downgrades your coverage tier. Auto insurance surfaces usage-based options — Loop drivers average far fewer miles than the national average.
- **Discounts**: Based on real programs (Mint Military, T-Mobile First Responder, CTA Reduced Fare, Comcast Internet Essentials, ACA APTC credits). Shows which specific programs each discount unlocks.

### UX Improvements
- **Progress bar** in the header — real % completion, not just dots
- **Skeleton loading screens** — results page shows exact layout while analyzing
- **"Why this saves you money"** — every recommendation now explains the reasoning with impact levels (high/medium/low)
- **"Already optimal" explanations** — tells you exactly WHY your current plan is competitive, not just a generic message
- **Discount preview** — shows combined discount % live as you select eligible groups
- **Print + Copy Summary** buttons on results
- **Warnings** — e.g. "Xfinity promotional rate expires after 12 months — set a reminder"
- **Clickable ZIP shortcuts** on welcome screen
- Data freshness timestamp on every result card

### Data Quality
- Every plan has `notes[]` — multiple honest observations, not marketing copy
- `bestFor` field — who this plan is actually right for
- `caveats` — what the plan doesn't tell you upfront
- Transit data includes real CTA/Metra 2024 fare tables with break-even calculations
- Health insurance notes explicitly flag ACA subsidy eligibility

---

## Stack

| Layer       | Tech                        |
|-------------|-----------------------------|
| Framework   | Next.js 14 (App Router)     |
| Language    | TypeScript (strict mode)    |
| Styling     | Tailwind CSS v3             |
| Validation  | Zod (API input schemas)     |
| Database    | SQLite via Prisma ORM       |

**One project. No separate backend process. No Docker. No MongoDB setup.**

---

## Quick Start

```bash
# 1. Install
npm install

# 2. Create the database (one-time — creates prisma/windywallet.db)
npm run db:push

# 3. Run
npm run dev
# → http://localhost:3000
```

### Optional: Browse the database
```bash
npm run db:studio
# → http://localhost:5555
```

---

## Project Structure

```
windywallet-v3/
├── prisma/
│   └── schema.prisma              ← SQLite schema (Submission model)
├── src/
│   ├── app/
│   │   ├── page.tsx               ← Wizard controller (4-step state machine)
│   │   ├── layout.tsx             ← Root layout + Google Fonts
│   │   ├── globals.css            ← Tailwind directives + custom keyframes
│   │   └── api/
│   │       ├── analyze/route.ts   ← POST /api/analyze (Zod-validated)
│   │       └── submissions/route.ts ← POST/GET /api/submissions
│   ├── lib/
│   │   ├── plans.ts               ← All curated plan data (typed, annotated)
│   │   ├── engine.ts              ← Recommendation engine (pure TypeScript)
│   │   └── prisma.ts              ← Prisma client singleton
│   ├── types/
│   │   └── index.ts               ← Shared TypeScript interfaces
│   └── components/
│       ├── Header.tsx             ← Sticky header with real progress bar
│       ├── ui.tsx                 ← All shared UI primitives
│       ├── StepWelcome.tsx        ← ZIP + budget entry
│       ├── StepCategories.tsx     ← Bill category selection
│       ├── StepBills.tsx          ← Detailed bill inputs
│       ├── StepDiscounts.tsx      ← Eligibility + attestation
│       └── StepResults.tsx        ← Results with skeleton loader + print
```

---

## API

### `POST /api/analyze`

```json
{
  "zip": "60601",
  "categories": ["mobile", "transit"],
  "bills": {
    "mobile": { "provider": "AT&T", "cost": 95, "data": "unlimited", "lines": 1, "hotspot": true, "intl": false },
    "transit": { "mode": "rideshare", "cost": 220, "freq": 10, "commute": "loop-only" }
  },
  "discounts": ["senior"],
  "childCount": 0,
  "budget": { "total": "4000" }
}
```

**Response includes:**
- `totalMonthlySavings`, `totalAnnualSavings`
- `budgetImpactPct` — what % of monthly budget is recovered
- `discountMultiplier` — combined % discount applied
- Per-result: `saving`, `annualSaving`, `savingReasons[]`, `optimalReason`, `warning`, `dataFreshness`

---

## Deploy

```bash
# Vercel (recommended)
npx vercel

# For production: switch Prisma to PostgreSQL
# Update prisma/schema.prisma datasource provider to "postgresql"
# Set DATABASE_URL env var to your Postgres connection string
```

---

## Valid Chicago Loop ZIP Codes
`60601` `60602` `60603` `60604` `60605` `60606` `60607` `60611` `60616` `60661`

---

## Disclaimer
WindyWallet shows estimates based on publicly available pricing as of January 2026.
Always verify pricing directly with providers before switching.
Not affiliated with any carrier, CTA, Metra, or insurer.
