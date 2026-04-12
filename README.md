# 🌬 WindyWallet

Chicago Loop bill optimizer built with Next.js.

Enter your monthly bills, apply eligible discounts, and get clear monthly + annual savings recommendations.

## Highlights

- 5-step flow: ZIP → Categories → Bills → Discounts → Results
- Analyzes mobile, internet, transit, and insurance bills
- Chicago Loop ZIP validation (`60601–60607`, `60611`, `60616`, `60661`)
- Discount-aware recommendations (senior, veteran, disability, income-qualified, etc.)
- Budget impact + savings breakdown
- Built-in tools: history chart, transit planner, grocery map, seasonal planner, bill tracker

## Quick Start

```bash
git clone https://github.com/aryan-code30/Windy_Wallet.git
cd Windy_Wallet
npm install
npm run db:push
npm run dev
```

Open `http://localhost:3000`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run db:push
npm run db:studio
```

## Stack

- Next.js + TypeScript + Tailwind CSS
- Prisma + SQLite
- Zod + Recharts

## API

- `POST /api/analyze` — analyze bills and return savings recommendations
- `GET /api/submissions` — fetch saved analyses
- `POST /api/submissions` — save an analysis snapshot
- `DELETE /api/submissions?id=...` — delete one submission
- `DELETE /api/submissions?year=YYYY&month=M` — delete submissions for a month

## Notes

- Savings are estimates and may vary by provider and plan updates.
- Discount eligibility is self-attested and verified by providers.
- Data is stored locally in SQLite (great for local/demo usage).

Built for the DePaul Loop Life hackathon.
