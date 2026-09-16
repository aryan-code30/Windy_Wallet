# 🌬 WindyWallet

WindyWallet is a Chicago Loop-focused bill optimization app built with Next.js that helps residents quickly understand where they’re overpaying on everyday services.

It analyzes your mobile, internet, transit, and insurance costs, compares them against better-value plan options for Loop ZIP codes, applies eligible discount programs, and shows clear monthly + annual savings with practical budgeting tools.

## Highlights

- 5-step flow: ZIP → Categories → Bills → Discounts → Results
- Analyzes mobile, internet, transit, and insurance bills
- Chicago Loop ZIP validation (`60601–60607`, `60611`, `60616`, `60661`)
- Discount-aware recommendations (senior, veteran, disability, income-qualified, etc.)
- Budget impact + savings breakdown
- Built-in tools: history chart, transit planner, grocery map, seasonal planner, bill tracker, events calendar

## Quick Start

Requires **Node.js 20.9+**.

```bash
git clone https://github.com/aryan-code30/Windy_Wallet.git
cd Windy_Wallet
npm install
npm run db:push
npm run dev
```

Open `http://localhost:3000`

### Updating an existing copy

After pulling new changes, reinstall packages and sync the database schema:

```bash
git pull
npm install
npm run db:push
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run db:push
npm run db:studio
```

## Stack

- Next.js 16 + React 19 + TypeScript + Tailwind CSS
- Prisma + SQLite
- Zod + Recharts

## API

- `POST /api/analyze` — analyze bills and return savings recommendations
- `GET /api/submissions` — fetch saved analyses
- `POST /api/submissions` — save an analysis snapshot
- `DELETE /api/submissions?id=...` — delete one submission
- `DELETE /api/submissions?year=YYYY&month=M` — delete submissions for a month

Saved analyses are tied to each browser through an anonymous `ww_owner` cookie — visitors can only see and delete their own submissions.

## Notes

- Savings are estimates and may vary by provider and plan updates.
- Pricing last verified September 2026. Plan and fare data lives in `src/lib/plans.ts`.
- Discount eligibility is self-attested and verified by providers.
- Data is stored locally in SQLite (great for local/demo usage).

Built for the DePaul Loop Life hackathon.
