export type Category = "mobile" | "internet" | "transit" | "insurance";
export type DiscountType = "veteran"|"disability"|"senior"|"frontline"|"lowincome"|"child"|"none";
export type CoverageLevel = "basic"|"standard"|"premium";
export type DatacapOption = "yes"|"no";
export type CommuteType = "loop-only"|"suburb-loop"|"mixed";
export type InsType = "renters"|"auto"|"health";

export interface MobileBill {
  provider: string; cost: number; data: string;
  lines: number; hotspot: boolean; intl: boolean;
}
export interface InternetBill {
  provider: string; cost: number; speed: number; datacap: DatacapOption;
}
export interface TransitBill {
  mode: string; cost: number; freq: number; commute: CommuteType;
}
// One insurance policy entry
export interface InsurancePolicy {
  insType: InsType;
  cost: number;
  deductible: number;
  coverage: CoverageLevel;
}
// The bills.insurance field is now an array of up to 3 policies
export interface InsuranceBill {
  policies: InsurancePolicy[];
}
export interface Bills {
  mobile: MobileBill; internet: InternetBill;
  transit: TransitBill; insurance: InsuranceBill;
}

export interface AnalyzeRequest {
  zip: string; categories: Category[]; bills: Bills;
  discounts: DiscountType[]; childCount: number;
}

export interface SavingReason {
  factor: string;   // e.g. "Same unlimited data"
  impact: "high"|"medium"|"low";
}

export interface ComparisonResult {
  category: Category;
  label: string;
  currentProvider: string;
  currentCost: number;
  currentFeatures?: string[];
  altProvider?: string;
  altCost?: number;
  altFeatures?: string[];
  savingReasons?: SavingReason[];   // WHY this plan is better
  saving: number;
  annualSaving: number;
  discountApplied: boolean;
  discountPct?: number;
  alreadyOptimal: boolean;
  optimalReason?: string;           // WHY it's already optimal
  message?: string;
  note?: string;
  warning?: string;                 // caveats the user must know
  dataFreshness: string;            // "Updated Jan 2025"
}

export interface AnalyzeResponse {
  success: boolean;
  zip: string;
  discountMultiplier: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  budgetImpactPct?: number;
  results: ComparisonResult[];
  generatedAt: string;
}

export interface FormState {
  zip: string; address: string;
  budget: { total: string; utilities: string; personal: string; other: string };
  categories: Category[];
  bills: Bills;
  discounts: DiscountType[];
  childCount: number;
  attested: boolean;
  month: number;   // 1-12
  year: number;    // e.g. 2026
}

export interface MonthlyRecord {
  id: string;
  zip: string;
  month: number;
  year: number;
  categories: string[];
  discounts: string[];
  totalSavings: number;
  annualSavings: number;
  optimizedCount: number;
  billsSnapshot: Record<string, any>;
  createdAt: string;
}

export type EventCostType = "free" | "low-cost";
export type EventCategory = "music" | "fitness" | "market" | "museum" | "community";

export interface ChicagoEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  costType: EventCostType;
  costLabel: string;
  neighborhood: string;
  location: string;
  startAt: string; // ISO datetime
  endAt?: string;  // ISO datetime
  link: string;
}
