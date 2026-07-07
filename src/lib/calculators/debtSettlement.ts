// src/lib/calculators/debtSettlement.ts
//
// Debt Settlement calculation engine — Sprint 2 of the Financial
// Tools platform. Pure TypeScript, no React, no DOM. Reuses the
// shared money/format utilities from debtPayoff.ts (no duplication).
//
// Modeling assumptions (documented, conservative, educational):
// - Settlement percentage defaults derive from delinquency stage
//   using AFCC industry-average ranges (same table the legacy
//   calculator used). The user may override with their own estimate.
// - Program fee is charged on ENROLLED DEBT (industry standard),
//   default 22%, adjustable 15–25%. Under the FTC Telemarketing
//   Sales Rule, fees are only collectible AFTER a debt settles —
//   the timeline math here simply totals what the program costs.
// - The minimum-payment baseline simulates the user's CURRENT
//   monthly debt payment against the full balance at a blended
//   22% APR (2026 average revolving rate), capped at 600 months.
// - Settlement % is applied to the CURRENT balance. In reality,
//   balances often grow with late fees before settling; results
//   are therefore an educational estimate, not a quote.
// - Credit-impact and tax notes are educational tiers only.

import { round2 } from "@/lib/calculators/debtPayoff";

// ─── Input types ──────────────────────────────────────────────────────────────

export type DelinquencyStage =
  | "current"
  | "30-60"
  | "60-120"
  | "120-180"
  | "180+";

export type EmploymentStatus =
  | "employed"
  | "self-employed"
  | "unemployed"
  | "retired"
  | "disability";

export interface SettlementInputs {
  totalDebt: number;              // total unsecured debt, dollars
  creditors: number;              // number of creditors/accounts
  state: string;                  // 2-letter code, educational context only
  monthlyIncome: number;          // gross household income / month
  currentMonthlyPayments: number; // what they pay toward debt today
  delinquency: DelinquencyStage;
  employment: EmploymentStatus;
  settlementPct: number;          // 0.30–0.80 (fraction of balance)
  feePct: number;                 // 0.15–0.25 (fraction of enrolled debt)
  targetMonthlyPayment: number;   // desired program deposit / month
}

// ─── Output types ─────────────────────────────────────────────────────────────

export interface BaselineComparison {
  payable: boolean;
  months: number;
  totalInterest: number;
  totalPaid: number;
  reason?: string;
}

export type CreditImpactTier = "high" | "moderate" | "already-impacted";

export type Recommendation =
  | "settlement"
  | "personal-loan"
  | "dmp"
  | "consult";

export interface SettlementResult {
  ok: true;
  // Core money outputs
  settlementAmount: number;       // what creditors are estimated to accept
  programFees: number;            // fee on enrolled debt
  totalCost: number;              // settlement + fees
  grossSavings: number;           // debt - settlementAmount
  netSavings: number;             // debt - totalCost
  netSavingsPct: number;          // netSavings / debt
  // Timeline
  monthlyDeposit: number;         // actual deposit used by the plan
  months: number;                 // program length (12–60 clamp)
  monthlyPaymentAdjusted: boolean;// true if target payment was raised to fit
  minViableMonthly: number;       // deposit needed for 60-month max program
  // Baseline comparison
  baseline: BaselineComparison;
  vsBaselineSavings: number | null; // baseline totalPaid - totalCost (if payable)
  // Educational
  creditImpact: CreditImpactTier;
  creditImpactNote: string;
  forgivenAmount: number;         // debt - settlementAmount (potential 1099-C)
  taxNote: string;
  recommendation: Recommendation;
  recommendationLabel: string;
  recommendationNote: string;
  perCreditorSettlement: number;  // settlementAmount / creditors
  assumptions: string[];
}

export interface SettlementError {
  ok: false;
  reason: string;
}

export type SettlementOutput = SettlementResult | SettlementError;

// ─── Defaults & ranges ────────────────────────────────────────────────────────

export const SETTLEMENT_RANGE_BY_STAGE: Record<
  DelinquencyStage,
  { low: number; high: number; typical: number }
> = {
  current:   { low: 0.50, high: 0.65, typical: 0.58 },
  "30-60":   { low: 0.45, high: 0.58, typical: 0.52 },
  "60-120":  { low: 0.40, high: 0.55, typical: 0.48 },
  "120-180": { low: 0.38, high: 0.50, typical: 0.44 },
  "180+":    { low: 0.35, high: 0.48, typical: 0.42 },
};

export const DEFAULT_FEE_PCT = 0.22;
export const FEE_MIN = 0.15;
export const FEE_MAX = 0.25;
export const SETTLE_MIN = 0.30;
export const SETTLE_MAX = 0.80;
export const PROGRAM_MIN_MONTHS = 12;
export const PROGRAM_MAX_MONTHS = 60;
const BASELINE_APR = 0.22;          // blended 2026 revolving average
const BASELINE_CAP_MONTHS = 600;

export function defaultSettlementPct(stage: DelinquencyStage): number {
  return SETTLEMENT_RANGE_BY_STAGE[stage].typical;
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateInputs(i: SettlementInputs): string | null {
  if (!(i.totalDebt > 0)) return "Enter your total unsecured debt.";
  if (i.totalDebt < 1000) return "Settlement math below $1,000 isn't meaningful — enter your full unsecured balance.";
  if (!(i.creditors >= 1)) return "Enter at least one creditor.";
  if (i.settlementPct < SETTLE_MIN || i.settlementPct > SETTLE_MAX)
    return "Settlement percentage must be between 30% and 80%.";
  if (i.feePct < FEE_MIN || i.feePct > FEE_MAX)
    return "Program fees typically run 15%–25% of enrolled debt.";
  return null;
}

// ─── Baseline: keep paying current payment at blended APR ─────────────────────

export function minimumPaymentBaseline(
  totalDebt: number,
  monthlyPayment: number
): BaselineComparison {
  if (monthlyPayment <= 0) {
    return {
      payable: false,
      months: 0,
      totalInterest: 0,
      totalPaid: 0,
      reason: "No current monthly payment entered — baseline comparison unavailable.",
    };
  }
  const r = BASELINE_APR / 12;
  let bal = totalDebt;
  let interest = 0;
  let m = 0;
  while (bal > 0 && m < BASELINE_CAP_MONTHS) {
    m++;
    const int = bal * r;
    interest += int;
    bal = bal + int - Math.min(monthlyPayment, bal + int);
  }
  if (bal > 0) {
    return {
      payable: false,
      months: 0,
      totalInterest: 0,
      totalPaid: 0,
      reason: `At ${fmtPct(BASELINE_APR)} average APR, ${money(monthlyPayment)}/month never pays off ${money(totalDebt)} — the balance grows faster than the payment.`,
    };
  }
  return {
    payable: true,
    months: m,
    totalInterest: round2(interest),
    totalPaid: round2(totalDebt + interest),
  };
}

// ─── Core calculation ─────────────────────────────────────────────────────────

export function calculateSettlement(i: SettlementInputs): SettlementOutput {
  const invalid = validateInputs(i);
  if (invalid) return { ok: false, reason: invalid };

  const settlementAmount = round2(i.totalDebt * i.settlementPct);
  const programFees = round2(i.totalDebt * i.feePct);
  const totalCost = round2(settlementAmount + programFees);
  const grossSavings = round2(i.totalDebt - settlementAmount);
  const netSavings = round2(i.totalDebt - totalCost);

  // Timeline: fit total cost to the user's target deposit, clamped
  // to a realistic 12–60 month program window.
  const minViableMonthly = Math.ceil(totalCost / PROGRAM_MAX_MONTHS);
  let monthlyDeposit = i.targetMonthlyPayment > 0 ? i.targetMonthlyPayment : minViableMonthly;
  let monthlyPaymentAdjusted = false;
  if (monthlyDeposit < minViableMonthly) {
    monthlyDeposit = minViableMonthly;
    monthlyPaymentAdjusted = true;
  }
  let months = Math.ceil(totalCost / monthlyDeposit);
  if (months < PROGRAM_MIN_MONTHS) {
    months = PROGRAM_MIN_MONTHS;
    monthlyDeposit = Math.ceil(totalCost / months);
  }
  monthlyDeposit = round2(monthlyDeposit);

  const baseline = minimumPaymentBaseline(i.totalDebt, i.currentMonthlyPayments);
  const vsBaselineSavings = baseline.payable
    ? round2(baseline.totalPaid - totalCost)
    : null;

  // Credit impact — educational tiers.
  let creditImpact: CreditImpactTier;
  let creditImpactNote: string;
  if (i.delinquency === "current") {
    creditImpact = "high";
    creditImpactNote =
      "Your accounts are current, so entering settlement means deliberately missing payments before creditors will negotiate — expect a significant score drop (often 100+ points) before recovery begins. Settled accounts are reported as “settled for less than full balance” for up to 7 years.";
  } else if (i.delinquency === "30-60") {
    creditImpact = "moderate";
    creditImpactNote =
      "Your credit is already showing late marks. Settlement adds further damage during the program, but the incremental impact is smaller than starting from a clean report. Settled accounts stay on your report for up to 7 years.";
  } else {
    creditImpact = "already-impacted";
    creditImpactNote =
      "With accounts 60+ days behind, most of the score damage has already happened. Resolving the debt — even as “settled” — starts the clock on recovery, and many people see scores begin improving within 12–24 months of completing settlements.";
  }

  // Tax — educational only.
  const forgivenAmount = grossSavings;
  const taxNote =
    forgivenAmount >= 600
      ? `Creditors typically issue IRS Form 1099-C for forgiven debt of $600 or more. Your estimated forgiven amount is ${money(forgivenAmount)}, which may count as taxable income — unless you were insolvent (total debts exceeded total assets) at the time of settlement. This is educational only; confirm with a tax professional.`
      : "Forgiven debt under $600 typically doesn't trigger a 1099-C, but tax treatment depends on your full situation. Confirm with a tax professional.";

  // Recommendation — mirrors the qualification logic used sitewide.
  let recommendation: Recommendation;
  let recommendationLabel: string;
  let recommendationNote: string;
  const incomeOk = i.monthlyIncome >= 1500 || i.employment === "retired" || i.employment === "disability";

  if (i.delinquency === "current" && i.totalDebt <= 40000 && i.monthlyIncome >= 3000) {
    recommendation = "personal-loan";
    recommendationLabel = "Consider a consolidation loan first";
    recommendationNote =
      "Your accounts are current and your income is steady — you may qualify for a personal loan at a lower rate, which avoids the credit damage of settlement entirely. Run both numbers before deciding.";
  } else if (i.totalDebt < 7500) {
    recommendation = "dmp";
    recommendationLabel = "A debt management plan may fit better";
    recommendationNote =
      "Below roughly $7,500, program fees eat most of settlement's benefit. A nonprofit debt management plan (reduced interest, full balance repaid) is usually more cost-effective at this size.";
  } else if (i.totalDebt >= 7500 && incomeOk) {
    recommendation = "settlement";
    recommendationLabel = "Settlement is a realistic option";
    recommendationNote =
      "Your debt level and payment capacity fit the profile settlement programs are built for. A specialist can confirm which of your specific creditors typically negotiate.";
  } else {
    recommendation = "consult";
    recommendationLabel = "Talk it through with a specialist";
    recommendationNote =
      "Your situation has nuances (income stability, debt mix) that change which option is realistic. A free consultation will clarify it faster than any calculator.";
  }

  const assumptions = [
    `Settlement estimated at ${fmtPct(i.settlementPct)} of current balance (typical for accounts ${stageLabel(i.delinquency)}).`,
    `Program fee estimated at ${fmtPct(i.feePct)} of enrolled debt — collectible only after each debt settles, per the FTC Telemarketing Sales Rule.`,
    `Minimum-payment baseline assumes a blended ${fmtPct(BASELINE_APR)} APR on revolving balances.`,
    "Balances can grow with late fees before settling; treat results as an educational estimate, not a quote.",
  ];

  return {
    ok: true,
    settlementAmount,
    programFees,
    totalCost,
    grossSavings,
    netSavings,
    netSavingsPct: round2(netSavings / i.totalDebt),
    monthlyDeposit,
    months,
    monthlyPaymentAdjusted,
    minViableMonthly,
    baseline,
    vsBaselineSavings,
    creditImpact,
    creditImpactNote,
    forgivenAmount,
    taxNote,
    recommendation,
    recommendationLabel,
    recommendationNote,
    perCreditorSettlement: round2(settlementAmount / Math.max(1, i.creditors)),
    assumptions,
  };
}

// ─── Local formatting helpers (tiny; heavy lifting stays in debtPayoff) ──────

function money(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

export function fmtPct(fraction: number): string {
  const pct = fraction * 100;
  return `${Number.isInteger(pct) ? pct : pct.toFixed(1)}%`;
}

export function stageLabel(stage: DelinquencyStage): string {
  switch (stage) {
    case "current": return "that are current";
    case "30-60": return "30–60 days behind";
    case "60-120": return "60–120 days behind";
    case "120-180": return "120–180 days behind";
    case "180+": return "180+ days behind";
  }
}

export const DELINQUENCY_OPTIONS: { value: DelinquencyStage; label: string }[] = [
  { value: "current", label: "Current — not behind yet" },
  { value: "30-60", label: "30–60 days behind" },
  { value: "60-120", label: "60–120 days behind" },
  { value: "120-180", label: "120–180 days behind" },
  { value: "180+", label: "More than 180 days behind" },
];

export const EMPLOYMENT_OPTIONS: { value: EmploymentStatus; label: string }[] = [
  { value: "employed", label: "Employed" },
  { value: "self-employed", label: "Self-employed" },
  { value: "unemployed", label: "Unemployed" },
  { value: "retired", label: "Retired" },
  { value: "disability", label: "On disability income" },
];
