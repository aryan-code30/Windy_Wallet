# 🌬 WindyWallet v3
### Chicago Loop Bill Optimizer — Theme: Loop Life

> A full-stack Next.js app that analyzes your monthly bills, finds real savings, applies Chicago-specific discount programs, and gives you a suite of Loop Life tools — all in one multi-step wizard.

**Live repo:** [github.com/aryan-code30/Windy_Wallet](https://github.com/aryan-code30/Windy_Wallet)

---

## �� Table of Contents

1. [What It Does](#what-it-does)
2. [Feature List](#feature-list)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Quick Start](#quick-start)
6. [User Journey](#user-journey-5-steps)
7. [Loop Life Tools](#loop-life-tools)
8. [API Reference](#api-reference)
9. [Database Schema](#database-schema)
10. [Discount Programs](#discount-programs)
11. [Chicago Loop Coverage](#chicago-loop-coverage)
12. [Deployment](#deployment)
13. [Disclaimer](#disclaimer)

---

## What It Does

WindyWallet is built around the **"Loop Life" theme** — a tool for people who live and work in the Chicago Loop. It:

1. Takes your real monthly bills (mobile, internet, transit, insurance)
2. Compares them against the best available plans for Loop ZIP codes
3. Applies real government/carrier discount programs you qualify for
4. Shows you exactly how much you can save — monthly and annually
5. Gives you a full Chicago Loop toolkit: savings ideas, transit planner, grocery map, seasonal tips, and a bill tracker

---

## Feature List

### 🧾 Bill Analysis Engine
- Multi-step wizard: ZIP → Categories → Bills → Discounts → Results
- Validates Chicago Loop ZIP codes (`60601–60607`, `60611`, `60616`, `60661`)
- Compares mobile, internet, transit, and insurance bills against real plan data
- Calculates monthly + annual savings per category
- Shows *why* each recommendation saves money (saving reasons with impact levels: high/medium/low)
- Supports up to 3 simultaneous insurance policies (renters, auto, health)

### 🏷️ Discount Programs (7 groups)
- 🎖️ Veteran / Active Military (~10% off eligible plans)
- ♿ Disability / SSI / SSDI (~12% off)
- 🧓 Senior (Age 65+) (~12% off + CTA Reduced Fare)
- 🏥 Frontline Worker (~8% off)
- 🏠 Income-Qualified / SNAP / Medicaid (~15% off)
- 👶 Children Under 12 in Household (~4% per child)
- 🚫 None of the Above (mutually exclusive with all others)

### 📊 Monthly Budget Panel
- Enter total budget + individual expense categories (utilities, personal, other)
- Stacked color bar showing proportional spend breakdown
- Side-by-side before/after bills comparison with WindyWallet savings inline
- "Left over" amount prominently displayed in header
- Before vs. after total spend comparison at the bottom

### 📅 Monthly History
- Tracks every analysis submission in SQLite
- Groups submissions by month/year
- Numbered submission cards (#1, #2…) per month
- Per-entry delete with confirmation, plus whole-month delete
- Shows savings, categories analyzed, and discounts applied per submission

### 🏙️ Loop Life Tools (5 tabbed tools)

| Tab | Tool | Description |
|-----|------|-------------|
| 📊 History | Savings Chart | Bar chart of all tracked months, best month in green, hover tooltips |
| 🚇 Transit | Transit Planner | Filter by commute type, compare all transit options with cost bar chart |
| 🛒 Grocery | Grocery Map | 6 nearest Loop stores sorted by price, expandable cards, savings tips |
| 🌦️ Seasonal | Seasonal Budget Planner | Season-specific Chicago budget tips, current season auto-highlighted |
| 🔔 Bills | Bill Due Date Tracker | Add/remove bills with due dates, urgency highlighting, localStorage persistence |

### 💡 Savings Ideas (35+ curated Loop spots)
- Restaurants, cafes, attractions, and walking destinations
- Category filter (All / Cafes / Restaurants / Attractions / Walking)
- Dynamic price tiers based on your calculated savings:
  - Under $50 saved → budget spots
  - Under $100 → mid-range
  - Under $150 → experience tier
  - Under $200 → premium
- Google Maps links, menu/website links, and 2–3 signature items per spot
- Show more / show fewer toggle

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js App Router | 14.0.4 | Full-stack React + API routes |
| Language | TypeScript | 5.3.3 | Type safety across entire codebase |
| Styling | Tailwind CSS | 3.4.0 | Utility-first CSS |
| Database | SQLite via Prisma | 5.7.1 | Local submission storage |
| Validation | Zod | 3.22.4 | Runtime API input validation |
| Charts | Recharts | 3.7.0 | Savings history bar chart |
| Runtime | Node.js | ≥18 | Server runtime |

---

## Project Structure

```
windywallet-v3/
├── prisma/
│   ├── schema.prisma              ← Submission model definition
│   └── windywallet.db             ← SQLite database (gitignored)
├── src/
│   ├── app/
│   │   ├── page.tsx               ← Root page — 5-step wizard orchestrator
│   │   ├── layout.tsx             ← HTML shell, fonts, metadata
│   │   ├── globals.css            ← Tailwind directives + custom animations
│   │   └── api/
│   │       ├── analyze/
│   │       │   └── route.ts       ← POST /api/analyze — bill analysis engine
│   │       └── submissions/
│   │           └── route.ts       ← GET / POST / DELETE /api/submissions
│   ├── components/
│   │   ├── ui.tsx                 ← Shared UI: Card, Btn, Input, Skeleton, Notice…
│   │   ├── Header.tsx             ← Progress bar + "Analysis Complete" badge
│   │   ├── StepWelcome.tsx        ← Step 1: ZIP code + monthly budget breakdown
│   │   ├── StepCategories.tsx     ← Step 2: Bill category selection
│   │   ├── StepBills.tsx          ← Step 3: Detailed bill forms (mobile/internet/transit/insurance)
│   │   ├── StepDiscounts.tsx      ← Step 4: Discount group selection + attestation
│   │   ├── StepResults.tsx        ← Step 5: Results, budget panel, savings ideas, Loop Life Tools
│   │   ├── MonthlyHistory.tsx     ← Submission history with per-entry delete
│   │   ├── SavingsChart.tsx       ← 📊 History tab — bar chart of monthly savings
│   │   ├── TransitPlanner.tsx     ← 🚇 Transit tab — CTA/Metra/Divvy/walk comparison
│   │   ├── GroceryMap.tsx         ← 🛒 Grocery tab — Loop grocery store guide
│   │   ├── SeasonalPlanner.tsx    ← 🌦️ Seasonal tab — Chicago season budget tips
│   │   └── BillTracker.tsx        ← 🔔 Bills tab — due date tracker (localStorage)
│   ├── lib/
│   │   ├── plans.ts               ← Loop ZIP set + carrier/transit/insurance plan data
│   │   ├── engine.ts              ← Analysis logic: discount multiplier, per-category analyzers
│   │   └── prisma.ts              ← Prisma client singleton
│   └── types/
│       └── index.ts               ← All TypeScript interfaces and union types
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── postcss.config.js
```

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/aryan-code30/Windy_Wallet.git
cd Windy_Wallet

# 2. Install dependencies
npm install

# 3. Set up the database
npm run db:push

# 4. Start dev server
npm run dev
# → http://localhost:3000
```

### All Available Commands

```bash
npm run dev          # Start development server (Next.js + hot reload)
npm run build        # Generate Prisma client + production build
npm run start        # Start production server
npm run db:push      # Push schema to SQLite (creates windywallet.db)
npm run db:studio    # Open Prisma Studio at http://localhost:5555
```

---

## User Journey (5 Steps)

```
Step 1 — Welcome
  ├── Enter Chicago Loop ZIP code (validated against 10 Loop ZIPs)
  ├── Enter monthly budget total
  └── Breakdown: utilities, personal spending, other

Step 2 — Categories
  └── Pick which bills to analyze: Mobile / Internet / Transit / Insurance

Step 3 — Bills
  ├── Mobile: provider, cost, data plan, lines, hotspot, international
  ├── Internet: provider, cost, speed, data cap
  ├── Transit: mode, cost, frequency, commute type
  └── Insurance: up to 3 policies (renters/auto/health), cost, deductible, coverage level

Step 4 — Discounts
  ├── Select eligible group(s) — see Discount Programs section
  ├── "None of the Above" clears all other selections
  └── Self-attestation checkbox required before submitting

Step 5 — Results
  ├── Monthly + annual savings hero panel
  ├── Budget waterfall panel (before vs. after)
  ├── Per-category comparison cards with saving reasons
  ├── Discounts applied notice
  ├── Chicago Loop savings ideas (35+ spots, filterable)
  ├── Monthly history tracker with delete
  └── Loop Life Tools (5 tabs: Chart, Transit, Grocery, Seasonal, Tracker)
```

---

## Loop Life Tools

### 📊 Savings History Chart
- Pulls all past submissions from `/api/submissions`
- Bar chart sorted oldest → newest
- Best month highlighted green, others indigo
- Hover tooltips: exact savings + month/year
- Stat pills: Avg/month · Best month · Total months tracked
- Only rendered when ≥ 2 submissions exist

### 🚇 Transit Planner
- Filter by commute type: **Loop Only** / **Suburb → Loop** / **Mixed**
- Recommended options per commute type with costs, tips, and external links
- Monthly cost comparison bar chart:

| Option | Monthly Cost |
|--------|-------------|
| �� Walk | $0 |
| 🚲 Divvy Annual (÷12) | ~$10 |
| �� CTA Ventra Monthly | $105 |
| 🚆 Metra Monthly | $178 |
| 🚗 Rideshare (avg) | $360 |
| 🚘 Drive + Park | $420 |

### 🛒 Grocery Map
- 6 stores near the Loop sorted by estimated monthly cost:
  - Aldi ($150–$250) → Trader Joe's → Target → Jewel-Osco → Mariano's → Whole Foods ($400–$600)
- Sort by price or A–Z
- Expandable cards: address, vibe, top picks, Maps link
- 6 Chicago-specific grocery saving tips

### 🌦️ Seasonal Budget Planner
- 4 season cards with Chicago-specific tips
- Current season auto-highlighted with "Now" badge
- Topics: heating costs (winter), Divvy savings (spring), A/C + free festivals (summer), pre-winter bill audit (fall)
- Budget note per season

### 🔔 Bill Due Date Tracker
- Add bills: name, amount, due day (1–31), category, autopay toggle
- Persisted in `localStorage` — no login, survives page refresh
- Sorted by days until next due date
- Urgency color coding: 🔴 ≤2 days · 🟠 ≤5 days · ⚪ later
- Running monthly total
- Alert when bills are due within 5 days

---

## API Reference

### `POST /api/analyze`

Analyzes bills and returns savings recommendations.

**Request body:**
```json
{
  "zip": "60601",
  "categories": ["mobile", "internet", "transit", "insurance"],
  "bills": {
    "mobile":    { "provider": "AT&T",    "cost": 95,  "data": "unlimited", "lines": 1, "hotspot": true,  "intl": false },
    "internet":  { "provider": "Comcast", "cost": 80,  "speed": 300, "datacap": "no" },
    "transit":   { "mode": "rideshare",   "cost": 220, "freq": 10, "commute": "loop-only" },
    "insurance": {
      "policies": [
        { "insType": "renters", "cost": 25,  "deductible": 500,  "coverage": "standard" },
        { "insType": "auto",    "cost": 120, "deductible": 1000, "coverage": "standard" }
      ]
    }
  },
  "discounts": ["senior"],
  "childCount": 1,
  "budget": { "total": "3000", "utilities": "150", "personal": "500", "other": "200" }
}
```

**Response:**
```json
{
  "success": true,
  "zip": "60601",
  "totalMonthlySavings": 52.50,
  "totalAnnualSavings": 630.00,
  "budgetImpactPct": 1.75,
  "discountMultiplier": 12,
  "generatedAt": "March 2026",
  "results": [
    {
      "category": "mobile",
      "label": "Mobile",
      "currentProvider": "AT&T",
      "currentCost": 95,
      "altProvider": "Mint Mobile",
      "altCost": 45,
      "saving": 50,
      "annualSaving": 600,
      "alreadyOptimal": false,
      "discountApplied": true,
      "savingReasons": [
        { "factor": "Same unlimited data at half the price", "impact": "high" }
      ]
    }
  ]
}
```

---

### `POST /api/submissions`

Saves an analysis result to SQLite.

```json
{
  "zip": "60601",
  "categories": ["mobile", "transit"],
  "discounts": ["senior"],
  "totalSavings": 52.50,
  "annualSavings": 630.00,
  "optimizedCount": 2,
  "month": 3,
  "year": 2026,
  "billsSnapshot": { "mobile": { "provider": "AT&T", "cost": 95 } }
}
```

---

### `GET /api/submissions`

Returns all stored submissions.

```json
{
  "rows": [
    {
      "id": "clxyz...",
      "zip": "60601",
      "categories": "[\"mobile\",\"transit\"]",
      "discounts": "[\"senior\"]",
      "totalSavings": 52.50,
      "annualSavings": 630.00,
      "optimizedCount": 2,
      "month": 3,
      "year": 2026,
      "createdAt": "2026-03-04T14:22:00Z"
    }
  ]
}
```

---

### `DELETE /api/submissions?id=clxyz`
Deletes a single submission by ID.

### `DELETE /api/submissions?year=2026&month=3`
Deletes all submissions for a given month and year.

---

## Database Schema

```prisma
model Submission {
  id             String   @id @default(cuid())
  zip            String
  categories     String         // JSON array e.g. ["mobile","transit"]
  discounts      String         // JSON array e.g. ["senior"]
  totalSavings   Float    @default(0)
  annualSavings  Float    @default(0)
  optimizedCount Int      @default(0)
  month          Int      @default(1)      // 1–12
  year           Int      @default(2026)
  billsSnapshot  String   @default("{}")   // Full bills object as JSON
  createdAt      DateTime @default(now())
}
```

**Database file:** `prisma/windywallet.db` (SQLite, gitignored)

---

## Discount Programs

| Group | Qualifier | Discount | Real Programs |
|-------|-----------|----------|---------------|
| 🎖️ Veteran / Military | Active duty, honorably discharged, military family | ~10% | Mint Mobile military, T-Mobile military $35/line |
| ♿ Disability | ADA-recognized, SSI, or SSDI recipient | ~12% | CTA Reduced Fare ($50/mo), AT&T Access, Comcast Internet Essentials |
| 🧓 Senior (65+) | Age 65 or older | ~12% | CTA Reduced Fare, Metra 50% off, AARP Consumer Cellular 5% |
| 🏥 Frontline Worker | Healthcare, fire, police, CTA/Metra employee, first responder | ~8% | T-Mobile First Responder $35/line, Verizon first responder discount |
| 🏠 Income-Qualified | SNAP, Medicaid, WIC, Lifeline, or similar | ~15% | Comcast Internet Essentials $9.95/mo, AT&T Access $10/mo, ACA subsidies, Lifeline |
| 👶 Children Under 12 | Children in household | ~4% per child | Multi-line family plans, Comcast Internet Essentials (K-12) |
| 🚫 None of the Above | Does not qualify | 0% | — |

- Multiple discounts stack (except "None of the Above")
- Combined discount capped at **40%**
- Eligibility is self-attested; final verification is by each provider

---

## Chicago Loop Coverage

**Valid ZIP Codes:**

```
60601  60602  60603  60604  60605
60606  60607  60611  60616  60661
```

Submitting any other ZIP returns HTTP 400: *"ZIP is outside the Chicago Loop."*

---

## Deployment

### Vercel (Recommended for demo)

```bash
npm i -g vercel
npx vercel
```

> ⚠️ **SQLite does not persist on serverless platforms.** For production, switch to PostgreSQL:
> 1. In `prisma/schema.prisma`, change `provider = "sqlite"` → `"postgresql"`
> 2. Set `DATABASE_URL` in Vercel environment variables
> 3. Run `npm run db:push`

### Self-Hosted / VPS

```bash
npm run build
npm run start
# Runs on port 3000
```

---

## Disclaimer

WindyWallet provides estimates based on publicly available pricing as of **March 2026**. Actual savings may vary. Always verify current pricing and terms directly with service providers before making any changes.

This application is **not affiliated** with any carrier, CTA, Metra, Ventra, Divvy, ComEd, Nicor, or any other service provider mentioned.

Discount eligibility is **self-attested** by the user — final eligibility is verified by each provider.

User data is stored **locally in SQLite**. No personal information is transmitted to external services.

---

*Built for the DePaul Loop Life hackathon — identifying a need within the Chicago Loop and building a solution for it.*
