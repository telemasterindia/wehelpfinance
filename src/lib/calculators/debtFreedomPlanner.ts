// src/lib/calculators/debtFreedomPlanner.ts
//
// Debt Freedom Planner engine — Sprint 9 flagship strategy comparator.
//
// Platform reuse (≥95% — no duplicated engines):
//   • Snowball / Avalanche / Minimum-only .. simulatePayoff + minimumOnlyBaseline
//                                            from the Sprint 1 Debt Payoff engine
//   • Settlement ........................... calculateSettlement (Sprint 2)
//   • Consolidation loan ................... amortizedPayment + APR_RANGE_BY_BAND
//                                            + TERM_OPTIONS (Sprints 4/5)
//   • DTI .................................. round1/bandFor (Sprint 3)
//   • Business-rule constants .............. REFI_CREDIT_BANDS, SETTLEMENT_MIN_DEBT
//   • Formatting ........................... round2/fmtUSD/fmtMonths/payoffDateLabel
//
// The only NEW math here is (a) the sanctioned Hybrid Strategy simulator
// (explicitly requested as "one reusable Hybrid Strategy engine") and
// (b) the documented account-synthesis that turns aggregate inputs into
// a realistic multi-account portfolio so snowball/avalanche/hybrid can
// meaningfully differ. Everything else calls existing engines.
//
// ─── Account synthesis (documented) ──────────────────────────────────────────
// Users enter ONE total balance, ONE average APR, and an account count.
// Real strategy differences come from spread, so we synthesize accounts:
//   • Balances: geometric split (ratio 1.6, largest-first) normalized to
//     the entered total — mirrors the common "one big card + tail" shape.
//   • APRs: linear spread of ±6 points around the entered average, larger
//     balances assigned the higher rates (the pattern that makes avalanche
//     mathematically win and snowball psychologically win).
//   • Minimums: proportional to balance, scaled so their SUM equals the
//     user's entered current monthly payments (their real number is
//     respected exactly).
// This synthesis is disclosed in `assumptions`; the Debt Payoff Calculator
// remains the tool for exact per-account inputs, and every strategy row
// links users there conceptually.

import {
  simulatePayoff,
  minimumOnlyBaseline,
  round2,
  fmtUSD,
  fmtMonths,
  payoffDateLabel,
  type DebtInput,
  type PayoffPlan,
} from "@/lib/calculators/debtPayoff";
import {
  calculateSettlement,
  defaultSettlementPct,
  DEFAULT_FEE_PCT,
  DELINQUENCY_OPTIONS,
  type DelinquencyStage,
} from "@/lib/calculators/debtSettlement";
import { round1, bandFor, type DtiBand } from "@/lib/calculators/dti";
import {
  amortizedPayment,
  CREDIT_BAND_OPTIONS,
  SETTLEMENT_MIN_DEBT,
  type CreditBand,
} from "@/lib/calculators/debtSolutions";
import { APR_RANGE_BY_BAND, TERM_OPTIONS, REFI_CREDIT_BANDS } from "@/lib/calculators/personalLoan";

export { CREDIT_BAND_OPTIONS, DELINQUENCY_OPTIONS, REFI_CREDIT_BANDS, SETTLEMENT_MIN_DEBT };
export type { CreditBand, DelinquencyStage };

// ─── Inputs ──────────────────────────────────────────────────────────────────

export type FinancialGoal =
  | "lowest-payment"
  | "fastest"
  | "max-interest-savings"
  | "improve-credit"
  | "improve-dti"
  | "qualify-mortgage"
  | "reduce-stress";

export const GOAL_OPTIONS: { value: FinancialGoal; label: string }[] = [
  { value: "fastest", label: "Become debt-free fastest" },
  { value: "max-interest-savings", label: "Save maximum interest" },
  { value: "lowest-payment", label: "Lowest monthly payment" },
  { value: "improve-credit", label: "Improve my credit" },
  { value: "improve-dti", label: "Improve my DTI" },
  { value: "qualify-mortgage", label: "Qualify for a mortgage" },
  { value: "reduce-stress", label: "Reduce financial stress" },
];

export interface FreedomInputs {
  totalDebt: number;
  creditBand: CreditBand;
  monthlyIncome: number;
  livingExpenses: number;
  currentPayments: number;     // current monthly debt payments (the minimums)
  extraPayment: number;        // available extra per month
  avgApr: number;              // fraction, e.g. 0.229
  accounts: number;            // number of accounts, 1–15
  delinquency: DelinquencyStage;
  homeowner: boolean;
  state: string;
  goal: FinancialGoal;
}

// ─── Strategy model ──────────────────────────────────────────────────────────

export type StrategyKey =
  | "minimum"
  | "snowball"
  | "avalanche"
  | "consolidation"
  | "settlement"
  | "hybrid";

export type Difficulty = "easy" | "moderate" | "advanced";

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Easy",
  moderate: "Moderate",
  advanced: "Advanced",
};

export interface StrategyRow {
  key: StrategyKey;
  name: string;
  available: boolean;
  availabilityNote: string | null; // why it isn't priced, when !available
  monthly: number | null;
  months: number | null;
  debtFreeLabel: string | null;
  totalInterest: number | null;   // settlement: program cost above principal repaid is negative-ish — use totalCostDelta
  totalPaid: number | null;
  savingsVsMinimum: number | null; // minimumTotal − totalPaid (null when minimum unpayable)
  cashFlowNote: string;
  dtiDuring: number | null;        // payments during plan / income
  dtiNote: string;
  creditNote: string;
  difficulty: Difficulty;
  bestFor: string;
  /** normalized balance curve for the timeline, index 0 = 100% */
  curve: number[] | null;
}

export interface StrategyInsight {
  title: string;
  strategyKey: StrategyKey;
  strategyName: string;
  why: string;
}

export type FreedomOptionKey =
  | "debt-settlement"
  | "personal-loan"
  | "mortgage-refinance"
  | "budget"
  | "financial-health"
  | "continue";

export interface FreedomRankedOption {
  key: FreedomOptionKey;
  name: string;
  why: string;
}

export interface MonthStep {
  month: number;
  title: string;
  detail: string;
}

export interface Milestone {
  label: string;      // "Today" | "25%" | "50%" | "75%" | "Debt free"
  monthLabel: string; // "Month 0" / "Month 14"
  dateLabel: string;  // payoffDateLabel
}

// ─── Result ──────────────────────────────────────────────────────────────────

export interface FreedomResult {
  ok: true;
  strategies: StrategyRow[];           // all 6, fixed order
  recommendedKey: StrategyKey;         // per the selected goal (available only)
  recommendedWhy: string;
  milestones: Milestone[];             // from the recommended strategy's curve
  insights: StrategyInsight[];         // 6 titled insights
  options: FreedomRankedOption[];
  actionPlan: MonthStep[];
  dtiCurrent: number;
  dtiCurrentBand: DtiBand;
  minimumTotal: number | null;
  assumptions: string[];
}

export interface FreedomError {
  ok: false;
  reason: string;
}

export type FreedomOutput = FreedomResult | FreedomError;

// ─── Validation ──────────────────────────────────────────────────────────────

export function validateFreedomInputs(i: FreedomInputs): string | null {
  if (!(i.totalDebt > 0)) return "Enter your total unsecured debt.";
  if (i.totalDebt > 500000) return "Balances above $500,000 are outside this planner's range.";
  if (!(i.monthlyIncome > 0)) return "Enter your gross monthly income.";
  if (i.livingExpenses < 0) return "Living expenses can't be negative.";
  if (!(i.currentPayments > 0)) return "Enter your current monthly debt payments.";
  if (i.extraPayment < 0) return "Extra payment can't be negative.";
  if (i.avgApr <= 0 || i.avgApr > 0.45) return "Average APR looks out of range — enter it as a percent, e.g. 22.9.";
  if (i.accounts < 1 || i.accounts > 15) return "Number of accounts should be between 1 and 15.";
  if (i.currentPayments + i.extraPayment > i.monthlyIncome)
    return "Debt payments can't exceed income — double-check the numbers.";
  if (i.livingExpenses + i.currentPayments > i.monthlyIncome * 3)
    return "Outflows look too high relative to income — double-check the numbers.";
  return null;
}

// ─── Account synthesis (documented above) ────────────────────────────────────

export function synthesizeAccounts(
  totalDebt: number,
  avgApr: number,
  accounts: number,
  currentPayments: number
): DebtInput[] {
  const n = Math.max(1, Math.min(15, Math.round(accounts)));
  const ratio = 1.6;
  const weights: number[] = [];
  for (let k = 0; k < n; k++) weights.push(Math.pow(ratio, n - 1 - k)); // largest first
  const wSum = weights.reduce((a, b) => a + b, 0);
  const balances = weights.map((w) => round2((w / wSum) * totalDebt));

  // APR spread ±6 points, larger balances higher (percent units for DebtInput).
  const avgPct = avgApr * 100;
  const spread = n === 1 ? 0 : 6;
  // Deterministic spread: largest balance gets +6 pts → smallest −6, clamped.
  const aprs: number[] = new Array(n).fill(avgPct);
  for (let k = 0; k < n; k++) {
    const t = n === 1 ? 0 : k / (n - 1);
    aprs[k] = round2(Math.min(45, Math.max(1, avgPct + spread * (1 - 2 * t))));
  }

  // Minimums proportional to balance, scaled to sum EXACTLY to currentPayments.
  const rawMins = balances.map((b) => Math.max(25, b * 0.03));
  const rawSum = rawMins.reduce((a, b) => a + b, 0);
  const mins = rawMins.map((m) => round2((m / rawSum) * currentPayments));

  return balances.map((balance, k) => ({
    id: `synth-${k}`,
    name: `Account ${k + 1}`,
    balance,
    apr: aprs[k],
    minPayment: mins[k],
  }));
}

// ─── Hybrid Strategy engine (sanctioned new simulator) ───────────────────────
//
// Behavioral-then-mathematical: snowball order until the two smallest
// accounts are cleared (quick wins build the habit), then avalanche order
// for the remainder (math finishes the job). Same month-loop mechanics as
// the platform simulator; capped at 600 months.

export interface HybridPlan {
  payable: boolean;
  months: number;
  totalInterest: number;
  totalPaid: number;
  balanceByMonth: number[];
}

export function simulateHybrid(inputs: DebtInput[], extraMonthly: number): HybridPlan {
  type Acct = { balance: number; apr: number; min: number };
  const accts: Acct[] = inputs.map((d) => ({ balance: d.balance, apr: d.apr / 100, min: d.minPayment }));
  const startTotal = accts.reduce((s, a) => s + a.balance, 0);
  const quickWinTargets = Math.min(2, Math.max(0, accts.length - 1));
  let cleared = 0;

  const balanceByMonth: number[] = [round2(startTotal)];
  let months = 0;
  let totalPaid = 0;
  let totalInterest = 0;

  while (accts.some((a) => a.balance > 0.01) && months < 600) {
    months += 1;
    // interest accrual
    for (const a of accts) {
      if (a.balance <= 0) continue;
      const int = (a.balance * a.apr) / 12;
      a.balance += int;
      totalInterest += int;
    }
    // target selection: snowball phase → smallest balance; avalanche phase → highest APR
    const open = accts.filter((a) => a.balance > 0.01);
    const target =
      cleared < quickWinTargets
        ? open.reduce((m, a) => (a.balance < m.balance ? a : m), open[0])
        : open.reduce((m, a) => (a.apr > m.apr ? a : m), open[0]);
    // pay minimums on all open, extra to target
    let budget = accts.reduce((s, a) => s + (a.balance > 0.01 ? a.min : 0), 0) + extraMonthly;
    // guard: if budget can't cover this month's interest overall, unpayable
    const monthInterest = open.reduce((s, a) => s + (a.balance * a.apr) / 12, 0);
    if (budget <= monthInterest && startTotal > 1) {
      return { payable: false, months: 0, totalInterest: 0, totalPaid: 0, balanceByMonth: [] };
    }
    for (const a of open) {
      if (a === target) continue;
      const pay = Math.min(a.min, a.balance);
      a.balance -= pay;
      budget -= pay;
      totalPaid += pay;
    }
    const payT = Math.min(budget, target.balance);
    target.balance -= payT;
    totalPaid += payT;
    // rollover: any leftover budget hits next targets in-phase order
    let leftover = budget - payT;
    while (leftover > 0.01) {
      const still = accts.filter((a) => a.balance > 0.01);
      if (still.length === 0) break;
      const next =
        cleared < quickWinTargets
          ? still.reduce((m, a) => (a.balance < m.balance ? a : m), still[0])
          : still.reduce((m, a) => (a.apr > m.apr ? a : m), still[0]);
      const p = Math.min(leftover, next.balance);
      next.balance -= p;
      totalPaid += p;
      leftover -= p;
    }
    cleared = accts.filter((a) => a.balance <= 0.01).length;
    balanceByMonth.push(round2(accts.reduce((s, a) => s + Math.max(0, a.balance), 0)));
  }
  const done = accts.every((a) => a.balance <= 0.01);
  return done
    ? { payable: true, months, totalInterest: round2(totalInterest), totalPaid: round2(totalPaid), balanceByMonth }
    : { payable: false, months: 0, totalInterest: 0, totalPaid: 0, balanceByMonth: [] };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function curveOf(balanceByMonth: number[]): number[] {
  const start = balanceByMonth[0] || 1;
  return balanceByMonth.map((b) => Math.max(0, Math.min(1, b / start)));
}

function linearCurve(months: number): number[] {
  const out: number[] = [];
  for (let m = 0; m <= months; m++) out.push(1 - m / months);
  return out;
}

export function milestonesFromCurve(curve: number[]): Milestone[] {
  const find = (frac: number) => {
    for (let m = 0; m < curve.length; m++) if (curve[m] <= frac + 1e-9) return m;
    return curve.length - 1;
  };
  const last = curve.length - 1;
  const pts: [string, number][] = [
    ["Today", 0],
    ["25% paid", find(0.75)],
    ["50% paid", find(0.5)],
    ["75% paid", find(0.25)],
    ["Debt free", last],
  ];
  return pts.map(([label, m]) => ({
    label,
    monthLabel: m === 0 ? "Today" : `Month ${m}`,
    dateLabel: m === 0 ? "—" : payoffDateLabel(m),
  }));
}

// ─── Main calculation ────────────────────────────────────────────────────────

export function calculateFreedomPlan(i: FreedomInputs): FreedomOutput {
  const invalid = validateFreedomInputs(i);
  if (invalid) return { ok: false, reason: invalid };

  const assumptions: string[] = [
    `Strategy math synthesizes ${Math.round(i.accounts)} accounts from your totals (geometric balance split, ±6-point APR spread around your ${(i.avgApr * 100).toFixed(1)}% average, minimums scaled to your ${fmtUSD(i.currentPayments)}/mo exactly) so snowball, avalanche, and hybrid can differ realistically — the Debt Payoff Calculator accepts your exact per-account numbers.`,
    "Settlement figures reuse the WeHelpFinance Debt Settlement engine and its disclosed assumptions (settlement % of today's balance; fees collectible only after each account settles per the FTC advance-fee rule).",
    "Consolidation figures use the credit-band typical APR from the Personal Loan engine at the shortest standard term whose payment fits your current-plus-extra budget.",
    "DTI uses gross income with the same rounding and bands as the WeHelpFinance DTI Calculator; 'DTI during plan' compares each strategy's monthly outlay against income.",
    "Educational estimates only — no outcome, approval, or savings figure is a promise; lender and provider review decides real results.",
  ];

  const budget = i.currentPayments + i.extraPayment;
  const debts = synthesizeAccounts(i.totalDebt, i.avgApr, i.accounts, i.currentPayments);
  const dtiCurrent = round1((i.currentPayments / i.monthlyIncome) * 100);
  const dtiCurrentBand = bandFor(dtiCurrent);
  const dtiAt = (monthly: number) => round1((monthly / i.monthlyIncome) * 100);

  // ── Minimum-only (Sprint 1 engine) ──
  const baseline = minimumOnlyBaseline(debts);
  const minimumTotal = baseline.payable ? round2(baseline.totalPaid) : null;

  // ── Snowball / Avalanche (Sprint 1 engine) ──
  const snow = simulatePayoff(debts, i.extraPayment, "snowball");
  const aval = simulatePayoff(debts, i.extraPayment, "avalanche");

  // ── Hybrid (this file's sanctioned engine) ──
  const hyb = simulateHybrid(debts, i.extraPayment);

  // ── Consolidation (Sprints 4/5 reuse) ──
  const aprTyp = APR_RANGE_BY_BAND[i.creditBand].typ;
  let consolidation: { payment: number; months: number; totalPaid: number; totalInterest: number } | null = null;
  for (const t of TERM_OPTIONS) {
    const p = round2(amortizedPayment(i.totalDebt, aprTyp, t.value));
    if (p <= budget || t.value === TERM_OPTIONS[TERM_OPTIONS.length - 1].value) {
      consolidation = {
        payment: p,
        months: t.value,
        totalPaid: round2(p * t.value),
        totalInterest: round2(p * t.value - i.totalDebt),
      };
      if (p <= budget) break;
    }
  }
  const consolidationFits = consolidation !== null && consolidation.payment <= budget;
  const consolidationCreditOk = i.creditBand === "excellent" || i.creditBand === "good" || i.creditBand === "fair";

  // ── Settlement (Sprint 2 engine) ──
  const settlementEligible = i.totalDebt >= SETTLEMENT_MIN_DEBT;
  const settle = settlementEligible
    ? calculateSettlement({
        totalDebt: i.totalDebt,
        creditors: Math.round(i.accounts),
        state: i.state,
        monthlyIncome: i.monthlyIncome,
        currentMonthlyPayments: i.currentPayments,
        delinquency: i.delinquency,
        employment: "employed",
        settlementPct: defaultSettlementPct(i.delinquency),
        feePct: DEFAULT_FEE_PCT,
        targetMonthlyPayment: 0,
      })
    : null;

  const savings = (totalPaid: number | null) =>
    minimumTotal !== null && totalPaid !== null ? round2(minimumTotal - totalPaid) : null;

  // ── Rows ──
  const strategies: StrategyRow[] = [
    {
      key: "minimum",
      name: "Minimum payments",
      available: baseline.payable,
      availabilityNote: baseline.payable ? null : "At these minimums the balance doesn't decline — interest outruns the payment.",
      monthly: i.currentPayments,
      months: baseline.payable ? baseline.months : null,
      debtFreeLabel: baseline.payable ? payoffDateLabel(baseline.months) : null,
      totalInterest: baseline.payable ? round2(baseline.totalInterest) : null,
      totalPaid: minimumTotal,
      savingsVsMinimum: baseline.payable ? 0 : null,
      cashFlowNote: "No change — the baseline everything else is measured against.",
      dtiDuring: dtiAt(i.currentPayments),
      dtiNote: "Unchanged until the final payoff.",
      creditNote: "Neutral while every payment stays on time; utilization falls very slowly.",
      difficulty: "easy",
      bestFor: "A reference point — rarely the plan itself, always the yardstick.",
      curve: baseline.payable ? linearCurve(baseline.months) : null,
    },
    {
      key: "snowball",
      name: "Snowball (smallest first)",
      available: snow.payable,
      availabilityNote: snow.payable ? null : "The budget doesn't cover interest at these numbers.",
      monthly: budget,
      months: snow.payable ? snow.months : null,
      debtFreeLabel: snow.payable ? payoffDateLabel(snow.months) : null,
      totalInterest: snow.payable ? snow.totalInterest : null,
      totalPaid: snow.payable ? snow.totalPaid : null,
      savingsVsMinimum: savings(snow.payable ? snow.totalPaid : null),
      cashFlowNote: i.extraPayment > 0 ? `${fmtUSD(i.extraPayment)}/mo tighter than today until debt-free.` : "Same outlay as today.",
      dtiDuring: dtiAt(budget),
      dtiNote: "Each cleared account removes a payment — DTI steps down account by account.",
      creditNote: "Protective: on-time history plus early account payoffs; utilization improves steadily.",
      difficulty: "easy",
      bestFor: "Momentum — quick early wins keep the plan alive when motivation is the constraint.",
      curve: snow.payable ? curveOf((snow as PayoffPlan).balanceByMonth) : null,
    },
    {
      key: "avalanche",
      name: "Avalanche (highest APR first)",
      available: aval.payable,
      availabilityNote: aval.payable ? null : "The budget doesn't cover interest at these numbers.",
      monthly: budget,
      months: aval.payable ? aval.months : null,
      debtFreeLabel: aval.payable ? payoffDateLabel(aval.months) : null,
      totalInterest: aval.payable ? aval.totalInterest : null,
      totalPaid: aval.payable ? aval.totalPaid : null,
      savingsVsMinimum: savings(aval.payable ? aval.totalPaid : null),
      cashFlowNote: i.extraPayment > 0 ? `${fmtUSD(i.extraPayment)}/mo tighter than today until debt-free.` : "Same outlay as today.",
      dtiDuring: dtiAt(budget),
      dtiNote: "DTI steps down as accounts clear — the big-balance wins come later but land harder.",
      creditNote: "Protective: identical payment history benefit; high-APR balances fall fastest.",
      difficulty: "moderate",
      bestFor: "Pure math — the least total interest when you can stay motivated without early wins.",
      curve: aval.payable ? curveOf((aval as PayoffPlan).balanceByMonth) : null,
    },
    {
      key: "consolidation",
      name: "Personal-loan consolidation",
      available: consolidationFits && consolidationCreditOk,
      availabilityNote: !consolidationCreditOk
        ? "Below-600 credit ranges rarely price consolidation loans below card rates — improving credit or exploring other paths first usually works better."
        : !consolidationFits
          ? `Even the longest standard term prices above your ${fmtUSD(budget)}/mo budget at the typical rate for your band.`
          : null,
      monthly: consolidation ? consolidation.payment : null,
      months: consolidation ? consolidation.months : null,
      debtFreeLabel: consolidation ? payoffDateLabel(consolidation.months) : null,
      totalInterest: consolidation ? consolidation.totalInterest : null,
      totalPaid: consolidation ? consolidation.totalPaid : null,
      savingsVsMinimum: savings(consolidation ? consolidation.totalPaid : null),
      cashFlowNote: consolidation
        ? consolidation.payment < i.currentPayments
          ? `${fmtUSD(round2(i.currentPayments - consolidation.payment))}/mo lighter than today.`
          : `${fmtUSD(round2(consolidation.payment - i.currentPayments))}/mo tighter than today.`
        : "—",
      dtiDuring: consolidation ? dtiAt(consolidation.payment) : null,
      dtiNote: "One fixed payment replaces many — DTI often improves immediately, then again at payoff.",
      creditNote: "Hard inquiry at application; utilization can drop sharply if cards are paid and left open.",
      difficulty: "moderate",
      bestFor: "Fair-or-better credit turning many payments into one predictable one at a lower rate.",
      curve: consolidation ? linearCurve(consolidation.months) : null,
    },
    {
      key: "settlement",
      name: "Debt settlement",
      available: settlementEligible && settle !== null && settle.ok,
      availabilityNote: !settlementEligible
        ? `Settlement programs generally start around ${fmtUSD(SETTLEMENT_MIN_DEBT)} of enrolled unsecured debt.`
        : settle && !settle.ok
          ? settle.reason
          : null,
      monthly: settle && settle.ok ? settle.monthlyDeposit : null,
      months: settle && settle.ok ? settle.months : null,
      debtFreeLabel: settle && settle.ok ? payoffDateLabel(settle.months) : null,
      totalInterest: null, // settlement's cost model isn't interest — shown via totalPaid
      totalPaid: settle && settle.ok ? settle.totalCost : null,
      savingsVsMinimum: savings(settle && settle.ok ? settle.totalCost : null),
      cashFlowNote:
        settle && settle.ok
          ? settle.monthlyDeposit < i.currentPayments
            ? `${fmtUSD(round2(i.currentPayments - settle.monthlyDeposit))}/mo lighter than today during the program.`
            : `${fmtUSD(round2(settle.monthlyDeposit - i.currentPayments))}/mo tighter than today during the program.`
          : "—",
      dtiDuring: settle && settle.ok ? dtiAt(settle.monthlyDeposit) : null,
      dtiNote: "Whole payments disappear as accounts settle — the largest per-dollar DTI moves available.",
      creditNote: "Significant impact while accounts are delinquent and settling; rebuilding follows completion. Forgiven amounts can be taxable.",
      difficulty: "advanced",
      bestFor: "Debt that full repayment can't realistically clear — trades credit damage for principal reduction.",
      curve: settle && settle.ok ? linearCurve(settle.months) : null,
    },
    {
      key: "hybrid",
      name: "Hybrid (snowball → avalanche)",
      available: hyb.payable,
      availabilityNote: hyb.payable ? null : "The budget doesn't cover interest at these numbers.",
      monthly: budget,
      months: hyb.payable ? hyb.months : null,
      debtFreeLabel: hyb.payable ? payoffDateLabel(hyb.months) : null,
      totalInterest: hyb.payable ? hyb.totalInterest : null,
      totalPaid: hyb.payable ? hyb.totalPaid : null,
      savingsVsMinimum: savings(hyb.payable ? hyb.totalPaid : null),
      cashFlowNote: i.extraPayment > 0 ? `${fmtUSD(i.extraPayment)}/mo tighter than today until debt-free.` : "Same outlay as today.",
      dtiDuring: dtiAt(budget),
      dtiNote: "Front-loads two quick account payoffs (fast DTI steps), then lets the math finish.",
      creditNote:
        i.delinquency === "current" || i.delinquency === "30-60"
          ? "Protective: early payoffs plus on-time history; the behavioral start guards the streak."
          : "Protective once payments are current — with serious delinquency, comparing the settlement row honestly belongs in this plan too.",
      difficulty: "moderate",
      bestFor: "Most people — the motivation of snowball's start with most of avalanche's savings.",
      curve: hyb.payable ? curveOf(hyb.balanceByMonth) : null,
    },
  ];

  // ── Goal → recommendation ──
  const avail = strategies.filter((s) => s.available && s.months !== null);
  const by = <K extends keyof StrategyRow>(k: K, min = true) =>
    [...avail].sort((a, b) =>
      min ? (a[k] as number) - (b[k] as number) : (b[k] as number) - (a[k] as number)
    )[0];

  const fastest = by("months");
  const cheapest = [...avail].sort((a, b) => (a.totalPaid ?? 1e15) - (b.totalPaid ?? 1e15))[0];
  const lowestMonthly = [...avail].sort((a, b) => (a.monthly ?? 1e15) - (b.monthly ?? 1e15))[0];
  const creditSafe = avail.filter((s) => s.key !== "settlement");
  const creditPick = creditSafe.length
    ? [...creditSafe].sort((a, b) => (a.months ?? 1e15) - (b.months ?? 1e15))[0]
    : fastest;
  const mortgagePick =
    creditSafe.find((s) => s.key === "consolidation") ??
    (creditSafe.length ? [...creditSafe].sort((a, b) => (a.dtiDuring ?? 999) - (b.dtiDuring ?? 999))[0] : fastest);
  const hybridRow = strategies.find((s) => s.key === "hybrid")!;
  const balanced = hybridRow.available ? hybridRow : cheapest ?? fastest;

  const goalPick: Record<FinancialGoal, { row: StrategyRow | undefined; why: string }> = {
    fastest: { row: fastest, why: "Shortest estimated time to zero among the strategies your numbers support." },
    "max-interest-savings": { row: cheapest, why: "Lowest estimated total paid — the least of your money leaving overall." },
    "lowest-payment": { row: lowestMonthly, why: "Smallest monthly outlay — maximum breathing room now, traded for time." },
    "improve-credit": { row: creditPick, why: "Fastest path among the strategies that build on-time history without delinquency." },
    "improve-dti": {
      row: [...avail].sort((a, b) => (a.dtiDuring ?? 999) - (b.dtiDuring ?? 999))[0],
      why: "Lowest monthly obligation relative to income while the plan runs — the DTI lenders will see.",
    },
    "qualify-mortgage": {
      row: mortgagePick,
      why: "Mortgage underwriting weighs BOTH credit and DTI — this path lowers the payment side while protecting the history side.",
    },
    "reduce-stress": { row: balanced, why: "The steadiest balance of early wins, low cost, and one clear system to follow." },
  };
  const picked = goalPick[i.goal];
  const recommended = picked.row ?? balanced ?? strategies[0];

  // ── Milestones from recommended curve ──
  const milestones = recommended.curve
    ? milestonesFromCurve(recommended.curve)
    : milestonesFromCurve(linearCurve(recommended.months ?? 1));

  // ── Insights (6, each explained) ──
  const insight = (title: string, row: StrategyRow | undefined, why: string): StrategyInsight | null =>
    row ? { title, strategyKey: row.key, strategyName: row.name, why } : null;
  const insights = [
    insight("Fastest to debt-free", fastest, fastest ? `${fmtMonths(fastest.months!)} — ${fastest.bestFor}` : ""),
    insight("Lowest total cost", cheapest, cheapest ? `${fmtUSD(cheapest.totalPaid!)} all-in — every other path pays more in total.` : ""),
    insight("Lowest monthly payment", lowestMonthly, lowestMonthly ? `${fmtUSD(lowestMonthly.monthly!)}/mo — the most cash-flow relief while active.` : ""),
    insight("Highest credit protection", creditPick, "Builds unbroken on-time history with no required delinquency — the pattern credit models reward most."),
    insight("Best mortgage readiness", mortgagePick, "Lenders weigh BOTH credit and DTI — this path improves the payment-to-income side without sacrificing the history side."),
    insight("Best overall balance", balanced, balanced.key === "hybrid" ? "Two quick wins for momentum, then highest-APR-first for the math — the compromise most people actually finish." : "The strongest all-around trade of speed, cost, and sustainability your numbers support."),
  ].filter((x): x is StrategyInsight => x !== null);

  // ── Cross-tool options (shared pattern + constants) ──
  const options = rankFreedomOptions(i, { dtiCurrent, settlementAvailable: strategies[4].available, consolidationAvailable: strategies[3].available, extra: i.extraPayment });

  // ── Action plan (Month 1–6 rule-ordered) ──
  const actionPlan = buildFreedomPlan(i, { dtiCurrent, recommended, settlementAvailable: strategies[4].available });

  return {
    ok: true,
    strategies,
    recommendedKey: recommended.key,
    recommendedWhy: picked.why,
    milestones,
    insights,
    options,
    actionPlan,
    dtiCurrent,
    dtiCurrentBand,
    minimumTotal,
    assumptions,
  };
}

// ─── Options ─────────────────────────────────────────────────────────────────

function rankFreedomOptions(
  i: FreedomInputs,
  ctx: { dtiCurrent: number; settlementAvailable: boolean; consolidationAvailable: boolean; extra: number }
): FreedomRankedOption[] {
  const list: { opt: FreedomRankedOption; score: number }[] = [];
  const creditEligible = REFI_CREDIT_BANDS.has(i.creditBand);

  if (ctx.extra > 0 && ctx.dtiCurrent <= 36 && i.delinquency === "current") {
    list.push({
      opt: { key: "continue", name: "Continue your current strategy",
        why: "Payments are current, DTI is healthy, and there's real extra going in — the comparison above mostly confirms the path; consistency is the remaining lever." },
      score: 55,
    });
  }
  if (ctx.consolidationAvailable) {
    list.push({
      opt: { key: "personal-loan", name: "Personal loan (price real consolidation offers)",
        why: "The consolidation row uses your band's typical rate — the Personal Loan Calculator shows the full APR range, the DTI effect, and the qualification factors before you talk to any lender." },
      score: 46,
    });
  }
  if (ctx.settlementAvailable && (i.delinquency !== "current" || ctx.dtiCurrent > 50)) {
    list.push({
      opt: { key: "debt-settlement", name: "Debt settlement (model it precisely)",
        why: "Your situation fits where settlement is genuinely considered — the Settlement Calculator models deposits, program length, fees under the FTC advance-fee rule, and the trade-offs in full." },
      score: 48,
    });
  }
  if (i.homeowner && creditEligible) {
    list.push({
      opt: { key: "mortgage-refinance", name: "Mortgage refinance review",
        why: ctx.dtiCurrent > 43
          ? "You own a home in the typical refinance credit zone, but lenders weigh BOTH credit and DTI — clearing unsecured payments first may increase future refinance opportunities. The Refinance Calculator shows both sides."
          : "You own a home in the typical refinance credit zone — freed mortgage dollars accelerate any strategy above. The Refinance Calculator includes break-even and lifetime cost." },
      score: 40 + (ctx.dtiCurrent > 43 ? 6 : 0),
    });
  }
  if (ctx.extra === 0) {
    list.push({
      opt: { key: "budget", name: "Budget Planner (find the extra payment)",
        why: "Every strategy above accelerates with even a small fixed extra — the Budget Planner maps where those dollars are hiding and scores the plan that frees them." },
      score: 50,
    });
  }
  list.push({
    opt: { key: "financial-health", name: "Financial Health Score check-up",
      why: "This planner optimizes the debt lane; the Financial Health Score shows how the chosen strategy moves the whole picture — cushion, DTI, credit, and history together." },
    score: 28,
  });

  const seen = new Set<FreedomOptionKey>();
  return list
    .sort((a, b) => b.score - a.score)
    .filter((x) => (seen.has(x.opt.key) ? false : (seen.add(x.opt.key), true)))
    .map((x) => x.opt);
}

// ─── Action plan ─────────────────────────────────────────────────────────────

function buildFreedomPlan(
  i: FreedomInputs,
  ctx: { dtiCurrent: number; recommended: StrategyRow; settlementAvailable: boolean }
): MonthStep[] {
  const steps: MonthStep[] = [];
  if (i.delinquency !== "current")
    steps.push({ month: 1, title: "Get payments current", detail: "Hardship or catch-up arrangements first — every strategy above works better from current, and payment history recovers faster than any balance." });
  const margin = i.monthlyIncome - i.livingExpenses - i.currentPayments;
  if (margin < i.monthlyIncome * 0.05)
    steps.push({ month: steps.length + 1, title: "Build a small cushion", detail: "Even a few hundred dollars of reserve keeps one surprise bill from undoing the plan — automate a small payday transfer before accelerating debt." });
  steps.push({
    month: steps.length + 1,
    title: `Start the ${ctx.recommended.name} plan`,
    detail: `Set the ${ctx.recommended.monthly !== null ? fmtUSD(ctx.recommended.monthly) + "/mo" : "planned"} payment as automatic — the strategy only works as a system, not a monthly decision.`,
  });
  if (i.extraPayment === 0)
    steps.push({ month: steps.length + 1, title: "Find a fixed extra payment", detail: "Run the Budget Planner — a fixed extra amount, however small, is what separates every accelerated row above from the minimum-payments baseline." });
  if (ctx.dtiCurrent > 36)
    steps.push({ month: steps.length + 1, title: "Track DTI toward 36%", detail: "Each cleared account removes a whole payment from the ratio — recheck the DTI Calculator after every payoff milestone." });
  if (i.homeowner && REFI_CREDIT_BANDS.has(i.creditBand) && steps.length < 6)
    steps.push({ month: steps.length + 1, title: "Review refinancing", detail: "Freed mortgage dollars accelerate the plan — the Refinance Calculator's break-even math shows whether now or later." });
  if (ctx.settlementAvailable && i.delinquency !== "current" && steps.length < 6)
    steps.push({ month: steps.length + 1, title: "Compare settlement honestly", detail: "With serious delinquency, model the Settlement Calculator alongside the plan — knowing both paths beats guessing." });
  if (steps.length < 6)
    steps.push({ month: steps.length + 1, title: "Recheck your Financial Health Score", detail: "A quarter in, rescore the whole picture — visible progress on the gauge is the fuel that finishes plans." });
  return steps.slice(0, 6).map((s, idx) => ({ ...s, month: idx + 1 }));
}

