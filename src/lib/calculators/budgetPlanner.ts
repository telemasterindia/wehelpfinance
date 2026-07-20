// src/lib/calculators/budgetPlanner.ts
//
// Budget Planner engine — Sprint 8.
//
// Platform reuse (no duplicated logic):
//   • DTI rounding + bands ........ round1/bandFor (Sprint 3)
//   • payoff simulation ........... payoffAtApr (Sprint 5) at the platform's
//                                   disclosed 22% revolving baseline
//   • credit bands + refi rule .... CREDIT_BAND_OPTIONS + REFI_CREDIT_BANDS
//   • settlement floor ............ SETTLEMENT_MIN_DEBT (Sprint 4)
//   • rounding/format ............. round1/round2/fmtUSD/fmtMonths (S1/S3)
//
// ─── Budget Health model (documented, not arbitrary) ─────────────────────────
// Four weighted factors / 100 pts, mirroring the Financial Health Score
// philosophy (disclosed weights anchored to standard guidance):
//   Cash-flow margin 30 — unallocated income after every line item; the
//     50/30/20 convention's spirit: a plan that ends at exactly $0 has no
//     shock absorber.
//   Savings rate 25 — committed savings + retirement vs. gross income;
//     20% is the guideline's full-marks anchor.
//   DTI 25 — the platform's shared lender bands; debt payments are the
//     budget line with the most leverage per dollar removed.
//   Essentials share 20 — "needs" ≤50% of income is the guideline line;
//     above ~70% a budget has almost no discretionary room to work with.
// Grades: 80+ Excellent · 60–79 Healthy · 40–59 Needs Attention ·
// <40 Critical. Optional inputs (emergency fund, credit range, homeowner,
// state) never change the score — they enrich insights only.

import { round1, bandFor, type DtiBand } from "@/lib/calculators/dti";
import { round2, fmtUSD, fmtMonths } from "@/lib/calculators/debtPayoff";
import {
  CREDIT_BAND_OPTIONS,
  SETTLEMENT_MIN_DEBT,
  type CreditBand,
} from "@/lib/calculators/debtSolutions";
import { REFI_CREDIT_BANDS, payoffAtApr } from "@/lib/calculators/personalLoan";

export { CREDIT_BAND_OPTIONS, REFI_CREDIT_BANDS, SETTLEMENT_MIN_DEBT };
export type { CreditBand };

// Platform baseline for revolving debt when no APR is known (disclosed —
// same convention the Settlement and Personal Loan tools use).
export const BASELINE_APR = 0.22;
// Standard card-minimum convention used to ESTIMATE a balance from minimum
// payments when no balance is entered (disclosed): minimums ≈ 3% of balance.
export const MIN_PAYMENT_PCT = 0.03;

// ─── Inputs ──────────────────────────────────────────────────────────────────

export interface BudgetInputs {
  grossIncome: number;
  otherIncome: number;
  housing: number;
  utilities: number;
  insurance: number;
  transportation: number;
  fuel: number;
  food: number;
  medical: number;
  childcare: number;
  education: number;
  phoneInternet: number;
  subscriptions: number;
  entertainment: number;
  shopping: number;
  taxes: number;                 // optional → 0
  savingsContribution: number;
  retirementContribution: number;
  minDebtPayments: number;
  otherExpenses: number;
  // Optional context — never affects the score
  emergencyFund: number;
  creditBand: CreditBand;
  homeowner: boolean;
  state: string;
}

// ─── Budget grade ────────────────────────────────────────────────────────────

export type BudgetGrade = "excellent" | "healthy" | "needs-attention" | "critical";

export const BUDGET_GRADE_LABELS: Record<BudgetGrade, string> = {
  excellent: "Excellent",
  healthy: "Healthy",
  "needs-attention": "Needs Attention",
  critical: "Critical",
};

export const BUDGET_GRADE_PHRASING: Record<BudgetGrade, string> = {
  excellent:
    "This budget has real margin, a working savings rate, and debt in proportion — the plan is doing its job.",
  healthy:
    "The fundamentals of this budget work — one or two lines tightened would move it into excellent territory.",
  "needs-attention":
    "This budget functions, but it's running close to the edge in more than one place — the specific lines to work are listed below.",
  critical:
    "This budget is under real strain right now. That's a starting point, not a verdict — the plan below is ordered for exactly this situation.",
};

export function budgetGradeFor(score: number): BudgetGrade {
  if (score >= 80) return "excellent";
  if (score >= 60) return "healthy";
  if (score >= 40) return "needs-attention";
  return "critical";
}

export interface BudgetFactor {
  label: string;
  points: number;
  max: number;
  detail: string;
}

// ─── Spending breakdown ──────────────────────────────────────────────────────

export type SliceKey =
  | "housing"
  | "debt"
  | "transportation"
  | "food"
  | "utilities"
  | "discretionary"
  | "savings"
  | "other";

export interface SpendingSlice {
  key: SliceKey;
  label: string;
  amount: number;
  pct: number; // of total outflow, 1-dp
}

// ─── 50/30/20 ────────────────────────────────────────────────────────────────

export interface RuleRow {
  key: "needs" | "wants" | "savings";
  label: string;
  guidelinePct: number;
  actualPct: number;   // of total income, 1-dp
  amount: number;
  note: string;        // non-judgmental difference explanation
}

// ─── Insights / plan / options ───────────────────────────────────────────────

export interface BudgetInsight {
  title: string;
  detail: string;
}

export interface MonthStep {
  month: number;
  title: string;
  detail: string;
}

export type BudgetOptionKey =
  | "continue"
  | "budget"
  | "payoff"
  | "financial-health"
  | "personal-loan"
  | "mortgage-refinance"
  | "debt-settlement";

export interface BudgetRankedOption {
  key: BudgetOptionKey;
  name: string;
  why: string;
}

// ─── Result ──────────────────────────────────────────────────────────────────

export interface BudgetResult {
  ok: true;

  totalIncome: number;
  totalOutflow: number;         // every line item incl. savings + debt
  totalExpenses: number;        // outflow excl. savings/retirement (true spending)
  netCashFlow: number;          // income − outflow (unallocated)
  savingsRatePct: number;       // (savings+retirement)/income, 1-dp
  debtPaymentRatioPct: number;  // minDebt/income, 1-dp
  dtiDisplayed: number;         // shared engine convention, 1-dp
  dtiBand: DtiBand;
  emergencyMonths: number | null; // null when EF not entered

  score: number;                // 0–100
  grade: BudgetGrade;
  factors: BudgetFactor[];

  slices: SpendingSlice[];      // 8 slices of totalOutflow
  ruleRows: RuleRow[];          // 50/30/20 comparison

  availableExtra: number;       // max(0, netCashFlow)
  estDebtBalance: number | null;
  baselineMonths: number | null;
  acceleratedMonths: number | null;
  monthsSaved: number | null;
  interestSaved: number | null;

  insights: {
    topSpending: BudgetInsight[];
    cashFlow: BudgetInsight[];
    savings: BudgetInsight[];
    debt: BudgetInsight[];
    emergency: BudgetInsight[];
  };

  actionPlan: MonthStep[];      // Month 1..N (3–5)
  options: BudgetRankedOption[];

  assumptions: string[];
}

export interface BudgetError {
  ok: false;
  reason: string;
}

export type BudgetOutput = BudgetResult | BudgetError;

// ─── Validation ──────────────────────────────────────────────────────────────

export function validateBudgetInputs(i: BudgetInputs): string | null {
  if (!(i.grossIncome > 0)) return "Enter your gross monthly income.";
  const fields: [string, number][] = [
    ["Other income", i.otherIncome], ["Housing", i.housing], ["Utilities", i.utilities],
    ["Insurance", i.insurance], ["Transportation", i.transportation], ["Fuel", i.fuel],
    ["Food", i.food], ["Medical", i.medical], ["Childcare", i.childcare],
    ["Education", i.education], ["Phone/Internet", i.phoneInternet],
    ["Subscriptions", i.subscriptions], ["Entertainment", i.entertainment],
    ["Shopping", i.shopping], ["Taxes", i.taxes], ["Savings", i.savingsContribution],
    ["Retirement", i.retirementContribution], ["Debt payments", i.minDebtPayments],
    ["Other expenses", i.otherExpenses], ["Emergency fund", i.emergencyFund],
  ];
  for (const [name, v] of fields) if (v < 0) return `${name} can't be negative.`;
  const income = i.grossIncome + i.otherIncome;
  const outflow = totalOutflowOf(i);
  if (outflow > income * 4)
    return "Outflows look too high relative to income — double-check the numbers.";
  return null;
}

function totalOutflowOf(i: BudgetInputs): number {
  return (
    i.housing + i.utilities + i.insurance + i.transportation + i.fuel + i.food +
    i.medical + i.childcare + i.education + i.phoneInternet + i.subscriptions +
    i.entertainment + i.shopping + i.taxes + i.savingsContribution +
    i.retirementContribution + i.minDebtPayments + i.otherExpenses
  );
}

// ─── Main calculation ────────────────────────────────────────────────────────

export function calculateBudget(i: BudgetInputs): BudgetOutput {
  const invalid = validateBudgetInputs(i);
  if (invalid) return { ok: false, reason: invalid };

  const assumptions: string[] = [
    "Budget Health weights (of 100): cash-flow margin 30, savings rate 25, DTI 25, essentials share 20 — anchored to the 50/30/20 guideline, the platform's shared lender DTI bands, and the Financial Health Score philosophy. Grades: 80+ Excellent, 60–79 Healthy, 40–59 Needs Attention, below 40 Critical.",
    "Optional entries (emergency fund, credit range, homeowner, state) never change the Budget Health Score — they add context to insights only.",
  ];

  const totalIncome = round2(i.grossIncome + i.otherIncome);
  const totalOutflow = round2(totalOutflowOf(i));
  const committedSavings = i.savingsContribution + i.retirementContribution;
  const totalExpenses = round2(totalOutflow - committedSavings);
  const netCashFlow = round2(totalIncome - totalOutflow);
  const savingsRatePct = round1((committedSavings / totalIncome) * 100);
  const debtPaymentRatioPct = round1((i.minDebtPayments / totalIncome) * 100);

  // DTI — shared engine convention (Sprint 7 pattern): non-mortgage debt
  // payments plus the mortgage payment for homeowners; renters' housing
  // stays in expenses and out of DTI.
  const dtiDisplayed = round1(
    ((i.minDebtPayments + (i.homeowner ? i.housing : 0)) / i.grossIncome) * 100
  );
  const dtiBand = bandFor(dtiDisplayed);
  assumptions.push(
    i.homeowner
      ? "DTI counts debt payments plus the mortgage (housing) payment against gross income — the same convention as the WeHelpFinance DTI Calculator."
      : "DTI counts debt payments against gross income; rent stays in living expenses per the platform convention — the same bands as the WeHelpFinance DTI Calculator."
  );

  // Emergency months — essentials pause savings in a crisis, so the divisor
  // excludes committed savings (disclosed).
  const essentialOutflow = totalExpenses;
  const emergencyMonths =
    i.emergencyFund > 0 && essentialOutflow > 0
      ? round1(i.emergencyFund / essentialOutflow)
      : i.emergencyFund > 0
        ? null
        : null;
  if (i.emergencyFund > 0)
    assumptions.push(
      "Emergency-fund months divide savings by monthly outflow excluding savings contributions — in a crisis, contributions pause but bills don't."
    );

  // ── Budget Health Score ──
  const marginPct = round1((netCashFlow / totalIncome) * 100);
  let cfPts: number;
  if (marginPct >= 15) cfPts = 30;
  else if (marginPct >= 8) cfPts = 24;
  else if (marginPct >= 3) cfPts = 16;
  else if (marginPct > 0) cfPts = 10;
  else if (marginPct === 0) cfPts = 6;
  else cfPts = 0;

  let svPts: number;
  if (savingsRatePct >= 20) svPts = 25;
  else if (savingsRatePct >= 15) svPts = 20;
  else if (savingsRatePct >= 10) svPts = 14;
  else if (savingsRatePct >= 5) svPts = 8;
  else if (savingsRatePct > 0) svPts = 4;
  else svPts = 0;

  const dtiPtsMap: Record<string, number> = { excellent: 25, good: 19, acceptable: 12, high: 6, severe: 0 };
  const dtiPts = dtiPtsMap[dtiBand.key] ?? 0;

  // Needs (50/30/20 partition) — computed once, reused for the rule rows.
  const needsAmt =
    i.housing + i.utilities + i.insurance + i.transportation + i.fuel + i.food +
    i.medical + i.childcare + i.education + i.phoneInternet + i.taxes + i.minDebtPayments;
  const wantsAmt = i.subscriptions + i.entertainment + i.shopping + i.otherExpenses;
  const needsPct = round1((needsAmt / totalIncome) * 100);
  const wantsPct = round1((wantsAmt / totalIncome) * 100);

  let essPts: number;
  if (needsPct <= 50) essPts = 20;
  else if (needsPct <= 60) essPts = 14;
  else if (needsPct <= 70) essPts = 8;
  else essPts = 3;

  const factors: BudgetFactor[] = [
    {
      label: "Cash-flow margin", points: cfPts, max: 30,
      detail: netCashFlow >= 0
        ? `${fmtUSD(netCashFlow)}/mo (${marginPct.toFixed(1)}% of income) is unallocated after every line — the budget's shock absorber.`
        : `The plan allocates ${fmtUSD(Math.abs(netCashFlow))}/mo more than comes in — a negative margin is the first line to fix, because it converts every surprise into debt.`,
    },
    {
      label: "Savings rate", points: svPts, max: 25,
      detail: `${savingsRatePct.toFixed(1)}% of income goes to savings and retirement — the 50/30/20 guideline's full-marks anchor is 20%.`,
    },
    {
      label: "Debt-to-income", points: dtiPts, max: 25,
      detail: `Debt payments take ${dtiDisplayed.toFixed(1)}% of gross income — the "${dtiBand.label}" band on the same scale lenders use.`,
    },
    {
      label: "Essentials share", points: essPts, max: 20,
      detail: `Needs take ${needsPct.toFixed(1)}% of income — the guideline line is 50%, and above ~70% a budget has little room left to maneuver.`,
    },
  ];
  const score = Math.round(cfPts + svPts + dtiPts + essPts);
  const grade = budgetGradeFor(score);

  // ── Spending breakdown (8 slices of total outflow) ──
  const rawSlices: [SliceKey, string, number][] = [
    ["housing", "Housing", i.housing],
    ["debt", "Debt payments", i.minDebtPayments],
    ["transportation", "Transportation", i.transportation + i.fuel],
    ["food", "Food", i.food],
    ["utilities", "Utilities & connectivity", i.utilities + i.phoneInternet],
    ["discretionary", "Discretionary", i.subscriptions + i.entertainment + i.shopping],
    ["savings", "Savings & retirement", committedSavings],
    ["other", "Other", i.insurance + i.medical + i.childcare + i.education + i.taxes + i.otherExpenses],
  ];
  const slices: SpendingSlice[] = rawSlices.map(([key, label, amount]) => ({
    key, label,
    amount: round2(amount),
    pct: totalOutflow > 0 ? round1((amount / totalOutflow) * 100) : 0,
  }));

  // ── 50/30/20 rows (savings bucket includes unallocated surplus — money
  //    not spent is money available to save, disclosed) ──
  const savingsBucket = committedSavings + Math.max(0, netCashFlow);
  const savingsBucketPct = round1((savingsBucket / totalIncome) * 100);
  assumptions.push(
    "In the 50/30/20 comparison, unallocated surplus counts toward the savings bucket — dollars not spent are dollars available to save. Minimum debt payments count as needs; extra debt paydown would count as savings under the classic rule."
  );
  const ruleRows: RuleRow[] = [
    {
      key: "needs", label: "Needs", guidelinePct: 50, actualPct: needsPct, amount: round2(needsAmt),
      note:
        needsPct <= 50
          ? "Inside the guideline — essentials are leaving room for everything else."
          : `${(needsPct - 50).toFixed(1)} points above the 50% guideline — common in high-cost areas; the levers here are the big fixed lines (housing, transport, debt payments), not the small ones.`,
    },
    {
      key: "wants", label: "Wants", guidelinePct: 30, actualPct: wantsPct, amount: round2(wantsAmt),
      note:
        wantsPct <= 30
          ? "Inside the guideline — discretionary spending is proportionate."
          : `${(wantsPct - 30).toFixed(1)} points above the 30% guideline — the most flexible dollars in the budget, and the fastest ones to redirect when a goal needs funding.`,
    },
    {
      key: "savings", label: "Savings", guidelinePct: 20, actualPct: savingsBucketPct, amount: round2(savingsBucket),
      note:
        savingsBucketPct >= 20
          ? "At or above the 20% guideline — the future is getting funded."
          : `${(20 - savingsBucketPct).toFixed(1)} points below the 20% guideline — every dollar trimmed from the rows above lands here.`,
    },
  ];

  // ── Debt-freedom acceleration (platform baseline reuse) ──
  const availableExtra = round2(Math.max(0, netCashFlow));
  let estDebtBalance: number | null = null;
  let baselineMonths: number | null = null;
  let acceleratedMonths: number | null = null;
  let monthsSaved: number | null = null;
  let interestSaved: number | null = null;
  if (i.minDebtPayments > 0) {
    estDebtBalance = round2(i.minDebtPayments / MIN_PAYMENT_PCT);
    const base = payoffAtApr(estDebtBalance, BASELINE_APR, i.minDebtPayments);
    if (base.payable) {
      baselineMonths = base.months;
      if (availableExtra > 0) {
        const acc = payoffAtApr(estDebtBalance, BASELINE_APR, i.minDebtPayments + availableExtra);
        if (acc.payable) {
          acceleratedMonths = acc.months;
          monthsSaved = baselineMonths - acceleratedMonths;
          interestSaved = round2(base.totalPaid - acc.totalPaid);
        }
      }
    }
    assumptions.push(
      `Debt-freedom estimate assumes the balance behind ${fmtUSD(i.minDebtPayments)}/mo of minimums is about ${fmtUSD(estDebtBalance)} (the standard ${Math.round(MIN_PAYMENT_PCT * 100)}% minimum-payment convention) at the platform's disclosed ${Math.round(BASELINE_APR * 100)}% revolving baseline. Your actual balances and APRs will differ — the Debt Payoff Calculator uses your real numbers.`
    );
  }

  // ── Insights ──
  const spendSlices = slices.filter((s) => s.key !== "savings").sort((a, b) => b.amount - a.amount);
  const topSpending: BudgetInsight[] = spendSlices.slice(0, 3).map((s) => ({
    title: `${s.label} — ${fmtUSD(s.amount)}/mo (${s.pct.toFixed(1)}% of outflow)`,
    detail:
      s.key === "housing"
        ? "The biggest line in most budgets — hard to move monthly, decisive at natural decision points (lease renewal, refinance, relocation)."
        : s.key === "debt"
          ? "Every dollar removed here returns twice: cash flow now, and DTI for every future application."
          : s.key === "discretionary"
            ? "The most flexible dollars on the page — nothing here is contractual, so this is where redirections start."
            : "Worth a quick audit — recurring lines drift upward quietly, and a single call or plan change often trims them.",
  }));

  const discretionary = slices.find((s) => s.key === "discretionary")!;
  const cashFlow: BudgetInsight[] = [];
  if (netCashFlow < 0)
    cashFlow.push({
      title: `Close the ${fmtUSD(Math.abs(netCashFlow))}/mo gap`,
      detail: "Outflows exceed income — start with the discretionary rows and subscriptions, then the largest fixed line that has a decision point coming.",
    });
  if (i.subscriptions > 0)
    cashFlow.push({
      title: `Subscriptions audit — ${fmtUSD(i.subscriptions)}/mo on the line`,
      detail: "The classic quiet leak: cancel the unused ones and this money lands in cash flow the same month, no lifestyle change required.",
    });
  if (discretionary.amount > totalIncome * 0.15)
    cashFlow.push({
      title: `Discretionary runs ${round1((discretionary.amount / totalIncome) * 100).toFixed(1)}% of income`,
      detail: "Not a verdict — just the most movable block. Trimming a fifth of it funds an emergency-savings habit without touching essentials.",
    });
  if (cashFlow.length === 0)
    cashFlow.push({
      title: "Cash flow is doing its job",
      detail: `${fmtUSD(netCashFlow)}/mo of margin — the question shifts from "where's the leak" to "where should the surplus work."`,
    });

  const savingsIns: BudgetInsight[] = [];
  if (savingsRatePct < 20)
    savingsIns.push({
      title: `Savings rate ${savingsRatePct.toFixed(1)}% vs. the 20% guideline`,
      detail: "Automate the transfer on payday — a rate you don't have to re-decide monthly is the one that survives.",
    });
  else
    savingsIns.push({
      title: `Savings rate ${savingsRatePct.toFixed(1)}% — at or above the guideline`,
      detail: "The habit is built; the remaining question is allocation between the emergency cushion and long-term accounts.",
    });
  if (availableExtra > 0 && savingsRatePct < 20)
    savingsIns.push({
      title: `${fmtUSD(availableExtra)}/mo of surplus is unassigned`,
      detail: "Money without a named job drifts — assigning even half of it to savings raises the rate without cutting anything.",
    });

  const debtIns: BudgetInsight[] = [];
  if (i.minDebtPayments > 0 && monthsSaved !== null && monthsSaved > 0)
    debtIns.push({
      title: `Redirecting the surplus could save ~${fmtMonths(monthsSaved)}`,
      detail: `Adding ${fmtUSD(availableExtra)}/mo to minimums moves estimated payoff from ${fmtMonths(baselineMonths!)} to ${fmtMonths(acceleratedMonths!)} and saves about ${fmtUSD(interestSaved!)} in interest at the baseline assumptions — run your real balances in the Debt Payoff Calculator.`,
    });
  else if (i.minDebtPayments > 0)
    debtIns.push({
      title: "Minimum payments alone repay slowly",
      detail: "At revolving rates, minimums mostly service interest — any fixed extra amount, however small, changes the trajectory. The Debt Payoff Calculator shows it month by month.",
    });
  else
    debtIns.push({
      title: "No monthly debt payments entered",
      detail: "A debt-free budget's advantage is optionality — the dollars other budgets send to creditors are yours to assign.",
    });

  const emergencyIns: BudgetInsight[] = [];
  if (i.emergencyFund > 0 && emergencyMonths !== null)
    emergencyIns.push({
      title: `Cushion covers ${emergencyMonths.toFixed(1)} month${emergencyMonths === 1 ? "" : "s"}`,
      detail:
        emergencyMonths >= 3
          ? "Inside the 3–6-month guideline — surprises stay inconveniences instead of becoming balances."
          : `The 3-month guideline for this budget is about ${fmtUSD(round2(essentialOutflow * 3))} — automatic transfers close that gap faster than waiting for a windfall.`,
    });
  else
    emergencyIns.push({
      title: "First target: one month of expenses",
      detail: `About ${fmtUSD(round2(essentialOutflow))} converts emergencies from debt-events into inconveniences — the single highest-leverage savings milestone.`,
    });

  // ── Monthly action plan (3–5 rule-ordered months) ──
  const actionPlan: MonthStep[] = [];
  const biggestWant =
    i.subscriptions >= i.entertainment && i.subscriptions >= i.shopping
      ? "subscriptions"
      : i.entertainment >= i.shopping
        ? "entertainment"
        : "shopping";
  if (netCashFlow < 0)
    actionPlan.push({
      month: 1, title: "Close the monthly gap",
      detail: `Trim ${biggestWant} and the discretionary rows until income covers every line — a balanced month 1 funds everything after it.`,
    });
  else if (wantsAmt > 0 && (savingsRatePct < 20 || i.minDebtPayments > 0))
    actionPlan.push({
      month: 1, title: `Trim the ${biggestWant} line`,
      detail: "Pick the least-missed 20% and redirect it on purpose — the point isn't austerity, it's giving those dollars a better job.",
    });
  if ((emergencyMonths ?? 0) < 1)
    actionPlan.push({
      month: actionPlan.length + 1, title: "Build the first month of cushion",
      detail: `Automate a payday transfer toward ${fmtUSD(round2(essentialOutflow))} — one month of reserve is the difference between a surprise bill and a new balance.`,
    });
  if (i.minDebtPayments > 0 && availableExtra > 0)
    actionPlan.push({
      month: actionPlan.length + 1, title: "Redirect surplus to debt",
      detail: `A fixed ${fmtUSD(availableExtra)}/mo above minimums${monthsSaved ? ` cuts an estimated ${fmtMonths(monthsSaved)} off the payoff` : " changes the payoff trajectory"} — set it as an automatic payment so it survives busy months.`,
    });
  if (dtiDisplayed > 36)
    actionPlan.push({
      month: actionPlan.length + 1, title: "Bring DTI toward the 36% line",
      detail: "Eliminating one whole payment moves DTI faster than shrinking every balance — the DTI Calculator shows exactly how many monthly dollars must go.",
    });
  if (i.homeowner && REFI_CREDIT_BANDS.has(i.creditBand) && i.housing > 0 && actionPlan.length < 5)
    actionPlan.push({
      month: actionPlan.length + 1, title: "Review refinance opportunities",
      detail: "As a homeowner in the typical refinance credit zone, run the Mortgage Refinance Calculator — a payment reduction there lands in cash flow and DTI simultaneously.",
    });
  if (actionPlan.length < 3)
    actionPlan.push({
      month: actionPlan.length + 1, title: "Raise the savings rate a notch",
      detail: "Move the automatic transfer up by 2–3% of income — small enough not to feel, large enough to compound.",
    });
  if (actionPlan.length < 3)
    actionPlan.push({
      month: actionPlan.length + 1, title: "Run a full financial check-up",
      detail: "With the budget balanced, the Financial Health Score shows how the whole position — cushion, debt, credit, history — fits together.",
    });
  const plan = actionPlan.slice(0, 5).map((s, idx) => ({ ...s, month: idx + 1 }));

  // ── Options (shared pattern + shared constants) ──
  const options = rankBudgetOptions(i, {
    score, grade, netCashFlow, dtiDisplayed, savingsRatePct,
    estDebtBalance, availableExtra,
  });

  return {
    ok: true,
    totalIncome, totalOutflow, totalExpenses, netCashFlow,
    savingsRatePct, debtPaymentRatioPct, dtiDisplayed, dtiBand,
    emergencyMonths: i.emergencyFund > 0 ? emergencyMonths : null,
    score, grade, factors,
    slices, ruleRows,
    availableExtra, estDebtBalance, baselineMonths, acceleratedMonths, monthsSaved, interestSaved,
    insights: { topSpending, cashFlow, savings: savingsIns, debt: debtIns, emergency: emergencyIns },
    actionPlan: plan,
    options,
    assumptions,
  };
}

// ─── Option ranking ──────────────────────────────────────────────────────────

function rankBudgetOptions(
  i: BudgetInputs,
  ctx: {
    score: number;
    grade: BudgetGrade;
    netCashFlow: number;
    dtiDisplayed: number;
    savingsRatePct: number;
    estDebtBalance: number | null;
    availableExtra: number;
  }
): BudgetRankedOption[] {
  const list: { opt: BudgetRankedOption; score: number }[] = [];
  const creditEligible = REFI_CREDIT_BANDS.has(i.creditBand);

  if (ctx.score >= 80 && ctx.netCashFlow > 0) {
    list.push({
      opt: {
        key: "continue",
        name: "Continue your current strategy",
        why: "The budget is balanced, saving, and proportioned — the highest-value move may be consistency plus pointing the surplus at the next milestone.",
      },
      score: 60,
    });
  }

  if (ctx.score < 80) {
    list.push({
      opt: {
        key: "budget",
        name: "Budget improvements (the rows above)",
        why: "The factor breakdown shows exactly which lines hold points back — working the shortest bar first compounds into every other option on this list.",
      },
      score: 55,
    });
  }

  if (i.minDebtPayments > 0) {
    list.push({
      opt: {
        key: "payoff",
        name: "Debt Payoff Calculator (your real balances)",
        why: `This planner estimates debt freedom from your minimums; the Payoff Calculator uses your actual balances and APRs to build the month-by-month plan${ctx.availableExtra > 0 ? ` for the ${fmtUSD(ctx.availableExtra)}/mo you have available` : ""}.`,
      },
      score: 48,
    });
  }

  list.push({
    opt: {
      key: "financial-health",
      name: "Financial Health Score check-up",
      why: "The budget is the monthly view; the Financial Health Score adds the balance-sheet view — cushion, debt load, credit, and history in one 0–100 picture with its own action plan.",
    },
    score: 30,
  });

  if (creditEligible && ctx.dtiDisplayed > 36 && ctx.dtiDisplayed <= 50 && i.minDebtPayments > 0) {
    list.push({
      opt: {
        key: "personal-loan",
        name: "Personal loan (consolidate unsecured debt)",
        why: "Your credit range sits where consolidation commonly prices well — replacing several payments with one fixed payment can lower DTI and free monthly dollars. The Personal Loan Calculator shows the payment and DTI effect first.",
      },
      score: 42 + (ctx.dtiDisplayed > 43 ? 6 : 0),
    });
  }

  if (i.homeowner && creditEligible && i.housing > 0) {
    list.push({
      opt: {
        key: "mortgage-refinance",
        name: "Mortgage refinance review",
        why:
          ctx.dtiDisplayed > 43
            ? "You own a home and your credit range is in the typical refinance zone, but lenders weigh BOTH credit and DTI — reducing monthly debt obligations first may increase future refinance opportunities. The Refinance Calculator shows both sides of that math."
            : "You own a home and your credit range is in the typical refinance zone — a housing-payment reduction is the single largest cash-flow lever most budgets have. The Refinance Calculator includes break-even and lifetime cost.",
      },
      score: 40 + (ctx.dtiDisplayed > 43 ? 6 : 0),
    });
  }

  if (
    ctx.estDebtBalance !== null &&
    ctx.estDebtBalance >= SETTLEMENT_MIN_DEBT &&
    (ctx.dtiDisplayed > 50 || ctx.netCashFlow < 0)
  ) {
    list.push({
      opt: {
        key: "debt-settlement",
        name: "Debt settlement (eligible unsecured debt)",
        why: "Could fit when full repayment isn't realistic within the budget — providers negotiate eligible unsecured balances down for less than owed, removing whole payments from the plan. It typically requires accounts to be delinquent, affects credit significantly while underway, and fees are collectible only after each account settles.",
      },
      score: 44,
    });
  }

  const seen = new Set<BudgetOptionKey>();
  return list
    .sort((a, b) => b.score - a.score)
    .filter((x) => (seen.has(x.opt.key) ? false : (seen.add(x.opt.key), true)))
    .map((x) => x.opt);
}

