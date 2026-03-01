# 🌬 WindyWallet
### Chicago Loop Bill Optimizer with Local Savings Ideas

> A Next.js application that analyzes your bills and suggests savings opportunities, plus Chicago Loop-specific money-saving spots.

---

## Key Features

### Bill Analysis Engine
- **Multi-step wizard**: ZIP code → Categories → Bill details → Discounts → Results
- **Real-time validation**: Ensures Chicago Loop ZIP codes (60601-60607, 60611, 60616, 60661)
- **Smart recommendations**: Compares current bills against available plans and calculates potential savings
- **Discount eligibility**: Military, senior, student, and first responder discounts factored into recommendations

### Chicago Loop Savings Ideas
- **Curated local spots**: 20+ restaurants, cafes, and attractions with real pricing and recommendations
- **Category filtering**: Filter by cafes, restaurants, attractions, or walking activities
- **Dynamic price tiers**: Suggestions adapt based on your calculated savings ($50, $100, $150, $200 tiers)
- **Actionable details**: Google Maps links, menu links, and specific item recommendations for each spot

### User Experience
- **Skeleton loading**: Professional loading states that match the final layout
- **Progress tracking**: Real-time progress bar in header
- **Mobile responsive**: Optimized for all device sizes
- **Clean animations**: Smooth transitions and fade-in effects

---

## Tech Stack

| Layer       | Technology                   | Purpose                          |
|-------------|------------------------------|----------------------------------|
| Framework   | Next.js 14 (App Router)     | React framework with API routes  |
| Language    | TypeScript                   | Type safety and better DX       |
| Styling     | Tailwind CSS v3              | Utility-first CSS framework     |
| Database    | SQLite via Prisma ORM       | Local database for submissions  |
| Validation  | Zod                          | Runtime input validation         |

**Single codebase approach**: Frontend and API in one Next.js project, no separate backend needed.

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/aryan-code30/Windy_Wallet.git
cd windywallet

# 2. Install dependencies
npm install

# 3. Initialize database (creates prisma/windywallet.db)
npm run db:push

# 4. Start development server
npm run dev
# → Open http://localhost:3000
```

### Additional Commands

```bash
# Build for production
npm run build

# Run production build
npm run start

# Browse database
npm run db:studio
# → Opens database viewer at http://localhost:5555
```

---

## Project Structure

```
windywallet/
├── .next/                         ← Next.js build output
├── .git/                          ← Git repository data
├── prisma/
│   ├── schema.prisma              ← Database schema (Submission model)
│   └── windywallet.db             ← SQLite database file
├── src/
│   ├── app/
│   │   ├── page.tsx               ← Main wizard component (4-step flow)
│   │   ├── layout.tsx             ← Root layout with fonts and metadata
│   │   ├── globals.css            ← Tailwind directives + animations
│   │   └── api/
│   │       ├── analyze/route.ts   ← POST /api/analyze - main analysis endpoint
│   │       └── submissions/route.ts ← Submission tracking (GET/POST)
│   ├── components/
│   │   ├── Header.tsx             ← Progress bar and navigation
│   │   ├── ui.tsx                 ← Reusable UI components (buttons, skeletons, etc.)
│   │   ├── StepWelcome.tsx        ← ZIP code and budget input
│   │   ├── StepCategories.tsx     ← Bill category selection
│   │   ├── StepBills.tsx          ← Detailed bill information forms
│   │   ├── StepDiscounts.tsx      ← Discount eligibility selection
│   │   └── StepResults.tsx        ← Analysis results + Chicago Loop savings ideas
│   ├── lib/
│   │   ├── plans.ts               ← Plan data and pricing information
│   │   ├── engine.ts              ← Bill analysis and recommendation logic
│   │   └── prisma.ts              ← Prisma client configuration
│   └── types/
│       └── index.ts               ← TypeScript type definitions
├── node_modules/                  ← Dependencies (gitignored)
├── package.json                   ← Project configuration and scripts
├── tailwind.config.ts             ← Tailwind CSS configuration
├── tsconfig.json                  ← TypeScript configuration
├── next.config.js                 ← Next.js configuration
├── postcss.config.js              ← PostCSS configuration
└── .gitignore                     ← Git ignore rules
```

---

## How It Works

### 1. User Journey
1. **Welcome Step**: Enter Chicago Loop ZIP code and monthly budget
2. **Categories Step**: Select which types of bills to analyze (mobile, internet, transit, etc.)
3. **Bills Step**: Provide detailed information about current bills
4. **Discounts Step**: Select applicable discounts (military, senior, student, first responder)
5. **Results Step**: View analysis results and Chicago Loop savings ideas

### 2. Analysis Engine
The app compares your current bills against available plans and calculates potential savings:
- Validates eligibility requirements
- Applies discount multipliers
- Calculates monthly and annual savings
- Provides reasoning for each recommendation

### 3. Savings Ideas Feature
Based on your calculated savings, the app suggests local Chicago Loop spots:
- **Dynamic pricing tiers**: Recommendations scale with your potential savings
- **Category filtering**: Filter by cafes, restaurants, attractions, or walking activities
- **Actionable information**: Direct links to maps, menus, and specific recommendations

---

## API Reference

### `POST /api/analyze`

Analyzes bills and returns savings recommendations.

**Request Body:**
```json
{
  "zip": "60601",
  "categories": ["mobile", "transit"],
  "bills": {
    "mobile": { 
      "provider": "AT&T", 
      "cost": 95, 
      "data": "unlimited", 
      "lines": 1, 
      "hotspot": true, 
      "intl": false 
    },
    "transit": { 
      "mode": "rideshare", 
      "cost": 220, 
      "freq": 10, 
      "commute": "loop-only" 
    }
  },
  "discounts": ["senior"],
  "childCount": 0,
  "budget": { "total": "4000" }
}
```

**Response:**
```json
{
  "totalMonthlySavings": 45,
  "totalAnnualSavings": 540,
  "budgetImpactPct": 1.125,
  "discountMultiplier": 0.9,
  "results": {
    "mobile": {
      "saving": 25,
      "annualSaving": 300,
      "savingReasons": ["Switched to Mint Mobile unlimited"],
      "newCost": 70,
      "dataFreshness": "2024-03-01"
    }
  }
}
```

### `POST /api/submissions`

Saves user submission for analytics.

### `GET /api/submissions`

Retrieves submission history (development use).

---

## Chicago Loop Coverage

**Valid ZIP Codes:** `60601`, `60602`, `60603`, `60604`, `60605`, `60606`, `60607`, `60611`, `60616`, `60661`

**Savings Ideas Include:**
- **Cafes**: Stan's Donuts, Intelligentsia, Blue Bottle Coffee
- **Restaurants**: Girl & the Goat, Alinea, The Purple Pig, Mr. Submarine, Naansense
- **Attractions**: Art Institute, Architecture tours, Millennium Park
- **Walking activities**: Riverwalk, Grant Park, free outdoor events

---

## Development

### Adding New Plans
1. Edit `src/lib/plans.ts`
2. Add plan data with required fields: `name`, `cost`, `features`, `notes`, `bestFor`
3. Update recommendation logic in `src/lib/engine.ts` if needed

### Adding Savings Ideas
1. Edit the `savingsIdeas` array in `src/components/StepResults.tsx`
2. Include: `name`, `description`, `tier`, `map`, `menu` (optional), `recommended`, `category`
3. Choose appropriate category: `cafes`, `restaurants`, `attractions`, `walking`

### Database Schema
The app uses a simple Submission model to track user interactions:
```prisma
model Submission {
  id        Int      @id @default(autoincrement())
  zip       String
  categories String
  createdAt DateTime @default(now())
}
```

---

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
npx vercel

# Follow prompts to link your GitHub repository
```

### Other Platforms
For production deployment on other platforms:
1. **Database**: Consider switching from SQLite to PostgreSQL for production
   - Update `prisma/schema.prisma` provider to `"postgresql"`
   - Set `DATABASE_URL` environment variable
2. **Environment**: Ensure all environment variables are set
3. **Build**: Run `npm run build` to create production build

---

## Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Add appropriate loading states and error handling
- Test on mobile devices
- Update README if adding major features

---

## License & Disclaimer

This project is open source and available under the [MIT License](LICENSE).

**Disclaimer**: WindyWallet provides estimates based on publicly available information as of March 2026. Always verify current pricing and terms directly with service providers before making any changes. This application is not affiliated with any carrier, transit authority, or service provider mentioned.

**Privacy**: User data is stored locally in SQLite for development. No personal information is transmitted to external services beyond what's necessary for the application to function.

---

## Repository

**GitHub**: [aryan-code30/Windy_Wallet](https://github.com/aryan-code30/Windy_Wallet)

Built with ❤️ for Chicago Loop residents and workers.
