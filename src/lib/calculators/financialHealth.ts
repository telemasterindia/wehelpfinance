// src/lib/calculators/financialHealth.ts
//
// Financial Health Score engine — Sprint 7 flagship.
//
// One 0–100 educational wellness score built from eight weighted
// categories. This is NOT a credit score and is never presented as
// one — it is a WeHelpFinance educational summary of overall
// financial position.
//
// Platform reuse (no duplicated logic):
//   • DTI banding ................ bandFor/round1/DTI_BANDS (Sprint 3)
//   • credit bands ............... CREDIT_BAND_OPTIONS (Sprint 4)
//   • delinquency + employment ... DELINQUENCY/EMPLOYMENT_OPTIONS (Sprint 2)
//   • refi credit rule ........... REFI_CREDIT_BANDS (Sprint 5.1 — the
//                                  single "~640+" business-rule constant)
//   • settlement floor ........... SETTLEMENT_MIN_DEBT (Sprint 4)
//   • rounding/format ............ round1/round2/fmtUSD (Sprints 1/3)
//
// ─── Why these weights (documented, not arbitrary) ───────────────────────────
// Weights sum to 100 and mirror the emphasis of established consumer-
// finance frameworks rather than invented numbers:
//   DTI 16 + Payment History 14 + Debt Burden 14  → 44 pts on debt —
//     consistent with debt factors dominating both lender underwriting
//     and the CFPB's financial well-being research on financial strain.
//   Cash Flow 18 — the 50/30/20 budgeting convention treats a ≥20%
//     margin as the healthy benchmark; cash flow is the engine that
//     funds every other improvement, hence the single largest weight.
//   Emergency Savings 16 — the standard 3–6-month cushion guidance;
//     the Federal Reserve's SHED survey repeatedly finds emergency
//     liquidity to be the sharpest divider of household resilience.
//   Credit Profile 12 — matters for access/pricing, but it is an
//     OUTPUT of the behaviors above, so it is weighted below them.
//   Housing 5 + Employment 5 — stability context: meaningful, but
//     largely reflected already in cash flow and DTI, so kept small
//     to avoid double-counting.
// Optional inputs (retirement savings, dependents) NEVER change the
// 0–100 score — they enrich insights only, so leaving them blank
// cannot penalize anyone.

import { bandFor, round1, type DtiBand } from "@/lib/calculators/dti";
import { round2, fmtUSD } from "@/lib/calculators/debtPayoff";
import {
  CREDIT_BAND_OPTIONS,
  SETTLEMENT_MIN_DEBT,
  type CreditBand,
} from "@/lib/calculators/debtSolutions";
import {
  DELINQUENCY_OPTIONS,
  EMPLOYMENT_OPTIONS,
  type DelinquencyStage,
  type EmploymentStatus,
} from "@/lib/calculators/debtSettlement";
import { REFI_CREDIT_BANDS } from "@/lib/calculators/personalLoan";

export { CREDIT_BAND_OPTIONS, DELINQUENCY_OPTIONS, EMPLOYMENT_OPTIONS, SETTLEMENT_MIN_DEBT, REFI_CREDIT_BANDS };
export type { CreditBand, DelinquencyStage, EmploymentStatus };

// ─── Inputs ──────────────────────────────────────────────────────────────────

export interface HealthInputs {
  monthlyIncome: number;        // gross
  livingExpenses: number;       // essentials excl. debt payments (renters: rent lives here)
  monthlyDebtPayments: number;  // all NON-mortgage debt payments
  totalUnsecuredDebt: number;   // cards, personal loans, medical, etc.
  creditBand: CreditBand;
  emergencySavings: number;     // liquid savings
  employment: EmploymentStatus;
  homeowner: boolean;
  mortgagePayment: number;      // P&I+escrow if homeowner; 0 otherwise
  retirementSavings: number | null; // optional — insights only
  dependents: number | null;        // optional — insights only
  delinquency: DelinquencyStage;    // days behind on payments
  state: string;                    // educational context only
}

// ─── Category model ──────────────────────────────────────────────────────────

export type CategoryKey =
  | "cash-flow"
  | "debt-burden"
  | "dti"
  | "emergency"
  | "credit"
  | "payment-history"
  | "housing"
  | "employment";

export interface CategoryScore {
  key: CategoryKey;
  label: string;
  points: number;   // earned
  max: number;      // weight
  pct: number;      // earned/max ×100, 1-dp
  detail: string;   // plain-English "why", specific to the entries
}

export const CATEGORY_WEIGHTS: Record<CategoryKey, number> = {
  "cash-flow": 18,
  "emergency": 16,
  "dti": 16,
  "debt-burden": 14,
  "payment-history": 14,
  "credit": 12,
  "housing": 5,
  "employment": 5,
};

// ─── Grades ──────────────────────────────────────────────────────────────────

export type HealthGrade = "excellent" | "very-good" | "good" | "fair" | "needs-improvement";

export const GRADE_LABELS: Record<HealthGrade, string> = {
  excellent: "Excellent",
  "very-good": "Very Good",
  good: "Good",
  fair: "Fair",
  "needs-improvement": "Needs Improvement",
};

export const GRADE_PHRASING: Record<HealthGrade, string> = {
  excellent:
    "Your entries show a financial position with real margin — strong cash flow, manageable obligations, and a cushion doing its job.",
  "very-good":
    "Your entries show a fundamentally healthy position with one or two areas that could be tightened further.",
  good:
    "Your entries show a workable position — the fundamentals function, and a couple of focused moves would meaningfully raise the score.",
  fair:
    "Your entries show real pressure in more than one area — the good news is the levers that move this score are specific and listed below.",
  "needs-improvement":
    "Your entries show significant strain right now. That's a starting point, not a verdict — the action plan below is built for exactly this situation.",
};

export function gradeFor(score: number): HealthGrade {
  if (score >= 85) return "excellent";
  if (score >= 70) return "very-good";
  if (score >= 55) return "good";
  if (score >= 40) return "fair";
  return "needs-improvement";
}

// ─── Insights / plan / recommendations ───────────────────────────────────────

export interface HealthInsight {
  title: string;
  detail: string;
}

export interface ActionStep {
  title: string;
  detail: string;
}

export type HealthOptionKey =
  | "continue"
  | "budget"
  | "personal-loan"
  | "mortgage-refinance"
  | "debt-settlement"
  | "dmp";

export interface HealthRankedOption {
  key: HealthOptionKey;
  name: string;
  why: string;
}

// ─── Result ──────────────────────────────────────────────────────────────────

export interface HealthResult {
  ok: true;
  score: number;               // 0–100 integer
  grade: HealthGrade;

  categories: CategoryScore[]; // all 8, in weight order

  // Sub-scores, 0–100 each
  cashFlowHealth: number;
  debtHealth: number;
  creditHealth: number;
  emergencyFundHealth: number;
  mortgageReadiness: number;
  borrowingReadiness: number;

  // Context numbers already shown to the user
  monthlyMargin: number;       // income − expenses − debt − mortgage
  savingsRatePct: number;      // margin/income ×100, 1-dp
  emergencyMonths: number;     // savings ÷ monthly outflow, 1-dp
  dtiDisplayed: number;        // 1-dp
  dtiBand: DtiBand;
  debtToAnnualIncomePct: number; // unsecured ÷ annual income ×100, 1-dp

  strengths: HealthInsight[];      // top 3
  opportunities: HealthInsight[];  // top 3
  actionPlan: ActionStep[];        // 3–5 ordered steps
  options: HealthRankedOption[];   // ≥2, ranked

  assumptions: string[];
}

export interface HealthError {
  ok: false;
  reason: string;
}

export type HealthOutput = HealthResult | HealthError;

// ─── Validation ──────────────────────────────────────────────────────────────

export function validateHealthInputs(i: HealthInputs): string | null {
  if (!(i.monthlyIncome > 0)) return "Enter your gross monthly income.";
  if (i.livingExpenses < 0) return "Living expenses can't be negative.";
  if (i.monthlyDebtPayments < 0) return "Debt payments can't be negative.";
  if (i.totalUnsecuredDebt < 0) return "Unsecured debt can't be negative.";
  if (i.emergencySavings < 0) return "Savings can't be negative.";
  if (i.mortgagePayment < 0) return "Mortgage payment can't be negative.";
  if (i.homeowner === false && i.mortgagePayment > 0)
    return "Mortgage payment applies to homeowners — set homeowner to Yes or clear the payment.";
  if (i.livingExpenses + i.monthlyDebtPayments + i.mortgagePayment > i.monthlyIncome * 4)
    return "Outflows look too high relative to income — double-check the numbers.";
  if (i.retirementSavings !== null && i.retirementSavings < 0) return "Retirement savings can't be negative.";
  if (i.dependents !== null && (i.dependents < 0 || i.dependents > 15)) return "Dependents looks out of range.";
  return null;
}

// ─── Main calculation ────────────────────────────────────────────────────────

export function calculateFinancialHealth(i: HealthInputs): HealthOutput {
  const invalid = validateHealthInputs(i);
  if (invalid) return { ok: false, reason: invalid };

  const assumptions: string[] = [
    "This is an educational financial-wellness score created by WeHelpFinance — it is not a credit score, is not used by lenders, and has no connection to FICO or VantageScore.",
    "Weights (of 100): cash flow 18, emergency savings 16, DTI 16, debt burden 14, payment history 14, credit profile 12, housing 5, employment 5 — anchored to the 50/30/20 budgeting convention, the 3–6-month emergency-fund guideline, standard lender DTI bands, and the Federal Reserve SHED findings on household resilience.",
    "Optional entries (retirement savings, dependents) never change the score — they add context to the insights only.",
    "Renters: housing cost belongs in living expenses; the housing category then scores stability neutrally rather than penalizing renting.",
  ];

  const outflow = i.livingExpenses + i.monthlyDebtPayments + i.mortgagePayment;
  const monthlyMargin = round2(i.monthlyIncome - outflow);
  const savingsRatePct = round1((monthlyMargin / i.monthlyIncome) * 100);

  // ── Category 1: Cash Flow (18) — 50/30/20 anchor ──
  let cashPts: number;
  if (savingsRatePct >= 20) cashPts = 18;
  else if (savingsRatePct >= 10) cashPts = 13;
  else if (savingsRatePct >= 5) cashPts = 9;
  else if (savingsRatePct > 0) cashPts = 5;
  else if (savingsRatePct === 0) cashPts = 3;
  else cashPts = 0;
  const cashDetail =
    monthlyMargin >= 0
      ? `About ${fmtUSD(monthlyMargin)}/mo (${savingsRatePct.toFixed(1)}% of income) is left after expenses and payments — the 50/30/20 benchmark treats 20% as the healthy margin.`
      : `Outflows exceed income by about ${fmtUSD(Math.abs(monthlyMargin))}/mo — a negative margin is the first thing to stabilize, because it drains every other category.`;

  // ── Category 2: Emergency Savings (16) — 3–6 month anchor ──
  const emergencyMonths = outflow > 0 ? round1(i.emergencySavings / outflow) : 0;
  let efPts: number;
  if (emergencyMonths >= 6) efPts = 16;
  else if (emergencyMonths >= 3) efPts = 12;
  else if (emergencyMonths >= 1) efPts = 7;
  else if (emergencyMonths >= 0.5) efPts = 4;
  else if (i.emergencySavings > 0) efPts = 2;
  else efPts = 0;
  const efDetail = `${fmtUSD(i.emergencySavings)} covers about ${emergencyMonths.toFixed(1)} month${emergencyMonths === 1 ? "" : "s"} of your total outflow — the standard guideline is 3–6 months.`;

  // ── Category 3: DTI (16) — shared platform bands ──
  const dtiDisplayed = round1(((i.monthlyDebtPayments + i.mortgagePayment) / i.monthlyIncome) * 100);
  const dtiBand = bandFor(dtiDisplayed);
  const dtiPtsMap: Record<string, number> = { excellent: 16, good: 12, acceptable: 8, high: 4, severe: 0 };
  const dtiPts = dtiPtsMap[dtiBand.key] ?? 0;
  const dtiDetail = `Debt payments take ${dtiDisplayed.toFixed(1)}% of gross income — the "${dtiBand.label}" band on the same scale lenders use.`;

  // ── Category 4: Debt Burden (14) — unsecured vs annual income ──
  const annualIncome = i.monthlyIncome * 12;
  const debtToAnnualIncomePct = round1((i.totalUnsecuredDebt / annualIncome) * 100);
  let burdenPts: number;
  if (debtToAnnualIncomePct <= 5) burdenPts = 14;
  else if (debtToAnnualIncomePct <= 15) burdenPts = 11;
  else if (debtToAnnualIncomePct <= 30) burdenPts = 7;
  else if (debtToAnnualIncomePct <= 50) burdenPts = 4;
  else if (debtToAnnualIncomePct <= 100) burdenPts = 2;
  else burdenPts = 0;
  const burdenDetail = `Unsecured debt equals ${debtToAnnualIncomePct.toFixed(1)}% of a year's gross income${debtToAnnualIncomePct > 30 ? " — above roughly 30%, unsecured balances start driving the whole financial picture" : ""}.`;

  // ── Category 5: Payment History (14) — heaviest behavior signal ──
  const historyMap: Record<DelinquencyStage, number> = {
    current: 14,
    "30-60": 8,
    "60-120": 4,
    "120-180": 2,
    "180+": 0,
  };
  const histPts = historyMap[i.delinquency];
  const histDetail =
    i.delinquency === "current"
      ? "Every payment is current — the single strongest habit in any financial profile."
      : "Payments are behind — recent payment history is the heaviest single signal in both this score and lender reviews, and it's also the most recoverable one.";

  // ── Category 6: Credit Profile (12) ──
  const creditMap: Record<CreditBand, number> = { excellent: 12, good: 9, fair: 5, poor: 2 };
  const creditPts = creditMap[i.creditBand];
  const creditLabel = CREDIT_BAND_OPTIONS.find((c) => c.value === i.creditBand)?.label ?? i.creditBand;
  const creditDetail = `Credit range "${creditLabel}" — credit is weighted below the behaviors that produce it, because improving them improves it.`;

  // ── Category 7: Housing Stability (5) ──
  let housePts: number;
  let houseDetail: string;
  if (i.homeowner) {
    const frontEnd = round1((i.mortgagePayment / i.monthlyIncome) * 100);
    if (i.mortgagePayment === 0) {
      housePts = 5;
      houseDetail = "Home owned without a mortgage payment — maximum housing stability.";
    } else if (frontEnd <= 28) {
      housePts = 5;
      houseDetail = `Housing takes ${frontEnd.toFixed(1)}% of income — inside the classic 28% guideline.`;
    } else if (frontEnd <= 33) {
      housePts = 4;
      houseDetail = `Housing takes ${frontEnd.toFixed(1)}% of income — slightly above the 28% guideline, still workable.`;
    } else {
      housePts = 2;
      houseDetail = `Housing takes ${frontEnd.toFixed(1)}% of income — a heavy share that squeezes every other category.`;
    }
  } else {
    housePts = 3;
    houseDetail = "Renting scores this category neutrally — your housing cost is already reflected in cash flow.";
  }

  // ── Category 8: Employment Stability (5) ──
  const empMap: Record<EmploymentStatus, number> = {
    employed: 5,
    "self-employed": 4,
    retired: 4,
    disability: 3,
    unemployed: 0,
  };
  const empPts = empMap[i.employment];
  const empDetail =
    i.employment === "unemployed"
      ? "No employment income entered — restoring income is the lever that unlocks every other one."
      : "Income source scores as stable for planning purposes.";

  // ── Assemble ──
  const categories: CategoryScore[] = [
    { key: "cash-flow", label: "Cash Flow", points: cashPts, max: 18, pct: round1((cashPts / 18) * 100), detail: cashDetail },
    { key: "emergency", label: "Emergency Savings", points: efPts, max: 16, pct: round1((efPts / 16) * 100), detail: efDetail },
    { key: "dti", label: "Debt-to-Income", points: dtiPts, max: 16, pct: round1((dtiPts / 16) * 100), detail: dtiDetail },
    { key: "debt-burden", label: "Debt Burden", points: burdenPts, max: 14, pct: round1((burdenPts / 14) * 100), detail: burdenDetail },
    { key: "payment-history", label: "Payment History", points: histPts, max: 14, pct: round1((histPts / 14) * 100), detail: histDetail },
    { key: "credit", label: "Credit Profile", points: creditPts, max: 12, pct: round1((creditPts / 12) * 100), detail: creditDetail },
    { key: "housing", label: "Housing Stability", points: housePts, max: 5, pct: round1((housePts / 5) * 100), detail: houseDetail },
    { key: "employment", label: "Employment Stability", points: empPts, max: 5, pct: round1((empPts / 5) * 100), detail: empDetail },
  ];

  const score = Math.round(categories.reduce((s, c) => s + c.points, 0));
  const grade = gradeFor(score);

  // ── Sub-scores (0–100) ──
  const cashFlowHealth = Math.round((cashPts / 18) * 100);
  const emergencyFundHealth = Math.round((efPts / 16) * 100);
  const creditHealth = Math.round((creditPts / 12) * 100);
  const debtHealth = Math.round(((burdenPts + dtiPts + histPts) / (14 + 16 + 14)) * 100);

  // Mortgage readiness — composite of the levers refinance lenders weigh
  // (credit band via the shared ~640+ rule, DTI band, payment history).
  let mortgageReadiness = 20;
  if (REFI_CREDIT_BANDS.has(i.creditBand)) mortgageReadiness += 30;
  else if (i.creditBand === "fair") mortgageReadiness += 12;
  if (dtiBand.key === "excellent") mortgageReadiness += 30;
  else if (dtiBand.key === "good") mortgageReadiness += 24;
  else if (dtiBand.key === "acceptable") mortgageReadiness += 14;
  else if (dtiBand.key === "high") mortgageReadiness += 5;
  if (i.delinquency === "current") mortgageReadiness += 20;
  else if (i.delinquency === "30-60") mortgageReadiness += 8;
  mortgageReadiness = Math.min(100, mortgageReadiness);

  // Borrowing readiness — mirrors the Personal Loan qualification factors.
  let borrowingReadiness = 10;
  borrowingReadiness += { excellent: 40, good: 30, fair: 16, poor: 6 }[i.creditBand];
  if (dtiDisplayed <= 36) borrowingReadiness += 25;
  else if (dtiDisplayed <= 43) borrowingReadiness += 16;
  else if (dtiDisplayed <= 50) borrowingReadiness += 8;
  if (i.delinquency === "current") borrowingReadiness += 15;
  else if (i.delinquency === "30-60") borrowingReadiness += 6;
  if (i.employment !== "unemployed") borrowingReadiness += 10;
  borrowingReadiness = Math.min(100, borrowingReadiness);

  // ── Insights: top 3 strengths + top 3 opportunities ──
  const byPct = [...categories].sort((a, b) => b.pct - a.pct);
  const strengths: HealthInsight[] = byPct.slice(0, 3).map((c) => ({
    title: `${c.label} — ${c.pct >= 100 ? "full marks" : `${c.points}/${c.max} points`}`,
    detail: c.detail,
  }));
  const opportunities: HealthInsight[] = [...byPct]
    .reverse()
    .slice(0, 3)
    .map((c) => ({
      title: `${c.label} — ${c.max - c.points} point${c.max - c.points === 1 ? "" : "s"} available`,
      detail: opportunityDetail(c, i, { emergencyMonths, dtiDisplayed, monthlyMargin }),
    }));

  // Optional-input enrichments (insights only — never the score).
  if (i.dependents !== null && i.dependents >= 1 && emergencyMonths < 3) {
    opportunities[opportunities.length - 1] = opportunities[opportunities.length - 1]; // keep 3
    strengths.length = Math.min(strengths.length, 3);
    assumptions.push(
      `With ${i.dependents} dependent${i.dependents === 1 ? "" : "s"}, the emergency-fund guideline leans toward the 6-month end of the 3–6 range.`
    );
  }
  if (i.retirementSavings !== null && i.retirementSavings > 0) {
    assumptions.push(
      `Retirement savings of ${fmtUSD(i.retirementSavings)} noted as long-term strength context — retirement funds are intentionally excluded from the emergency-fund months because early withdrawal carries penalties and taxes.`
    );
  }

  // ── Action plan (3–5 ordered steps, rule-driven) ──
  const actionPlan = buildActionPlan(i, {
    monthlyMargin,
    emergencyMonths,
    dtiDisplayed,
    dtiBandKey: dtiBand.key,
    debtToAnnualIncomePct,
    score,
  });

  // ── Recommendations (shared pattern + shared rule constants) ──
  const options = rankHealthOptions(i, {
    score,
    grade,
    dtiDisplayed,
    monthlyMargin,
    emergencyMonths,
  });

  return {
    ok: true,
    score,
    grade,
    categories,
    cashFlowHealth,
    debtHealth,
    creditHealth,
    emergencyFundHealth,
    mortgageReadiness,
    borrowingReadiness,
    monthlyMargin,
    savingsRatePct,
    emergencyMonths,
    dtiDisplayed,
    dtiBand,
    debtToAnnualIncomePct,
    strengths,
    opportunities,
    actionPlan,
    options,
    assumptions,
  };
}

// ─── Opportunity phrasing (specific lever per category) ──────────────────────

function opportunityDetail(
  c: CategoryScore,
  i: HealthInputs,
  ctx: { emergencyMonths: number; dtiDisplayed: number; monthlyMargin: number }
): string {
  switch (c.key) {
    case "cash-flow":
      return ctx.monthlyMargin < 0
        ? "Closing the monthly gap comes first — every other improvement is funded by this one. Reducing a debt payment or trimming one recurring expense converts directly into margin."
        : "Each recurring payment you shrink or remove lands straight in this category — the fastest gains usually come from restructuring debt payments rather than cutting groceries.";
    case "emergency":
      return `Even one month of cushion (about ${fmtUSD(round2(Math.max(0, (i.livingExpenses + i.monthlyDebtPayments + i.mortgagePayment))))}) changes how every surprise bill lands — automatic transfers of any size compound faster than waiting for a windfall.`;
    case "dti":
      return "Eliminating a whole monthly payment moves DTI far faster than shrinking balances — that's the mechanism consolidation, settlement, and payoff plans all share.";
    case "debt-burden":
      return "Bringing unsecured balances down relative to income is the slow-and-steady lever — the comparison tools on this site show which repayment path costs least for your numbers.";
    case "payment-history":
      return "Getting current — even via a hardship arrangement — is the highest-value single move available; this category recovers faster than any other once payments resume.";
    case "credit":
      return "Credit follows behavior: lower utilization and an unbroken payment streak lift this range over months, not years — no product purchase required.";
    case "housing":
      return "A housing payment above the guideline squeezes everything else — refinancing (if you own) or a housing-cost review at the next natural decision point is the lever here.";
    case "employment":
      return "Any documented income stream — part-time, benefits, self-employment — restores this category and stabilizes the plan around it.";
  }
}

// ─── Action plan builder ─────────────────────────────────────────────────────

function buildActionPlan(
  i: HealthInputs,
  ctx: {
    monthlyMargin: number;
    emergencyMonths: number;
    dtiDisplayed: number;
    dtiBandKey: string;
    debtToAnnualIncomePct: number;
    score: number;
  }
): ActionStep[] {
  const steps: ActionStep[] = [];

  if (i.delinquency !== "current") {
    steps.push({
      title: "Get payments current",
      detail:
        "Contact creditors about hardship or catch-up arrangements before anything else — payment history is the heaviest weight in this score and in every lender review, and it recovers quickly once payments resume.",
    });
  }
  if (ctx.monthlyMargin < 0) {
    steps.push({
      title: "Close the monthly gap",
      detail:
        "Outflows currently exceed income. List every recurring payment and target the largest debt payment for restructuring — a negative margin drains savings and forces new debt, so this step funds all the others.",
    });
  }
  if (ctx.emergencyMonths < 1) {
    steps.push({
      title: "Build the first month of cushion",
      detail:
        "Automate a transfer — any amount — on payday. One month of expenses in reserve is the difference between a surprise bill and a new debt.",
    });
  }
  if (ctx.dtiDisplayed > 43) {
    steps.push({
      title: "Bring DTI under 43%",
      detail:
        "Eliminate whole payments rather than shrinking balances — use the DTI Calculator to see exactly how many monthly dollars must go, then the comparison tools to pick the cheapest path there.",
    });
  } else if (ctx.dtiDisplayed > 36) {
    steps.push({
      title: "Nudge DTI under 36%",
      detail:
        "You're close to the healthy line — removing one payment (often the smallest debt, snowball-style) typically clears it.",
    });
  }
  if (i.homeowner && REFI_CREDIT_BANDS.has(i.creditBand) && steps.length < 5) {
    steps.push({
      title: "Review refinancing opportunities",
      detail:
        "As a homeowner in the typical refinance credit zone, run the Mortgage Refinance Calculator — payment savings there flow straight into cash flow and DTI.",
    });
  }
  if (
    i.totalUnsecuredDebt >= SETTLEMENT_MIN_DEBT &&
    (i.delinquency !== "current" || ctx.dtiDisplayed > 50) &&
    steps.length < 5
  ) {
    steps.push({
      title: "Compare debt-relief paths for the unsecured balance",
      detail:
        "With this much unsecured debt under strain, compare settlement, consolidation, and a managed plan side by side — the Debt Solutions Comparison prices all of them with the same math.",
    });
  }
  if (steps.length < 3) {
    steps.push({
      title: "Grow the cushion toward 3–6 months",
      detail:
        "With the fundamentals working, direct the monthly margin at the emergency fund until it covers 3–6 months of outflow — that cushion is what makes every future decision unforced.",
    });
  }
  if (steps.length < 3) {
    steps.push({
      title: "Protect the streak",
      detail:
        "Automate every payment and set a quarterly 15-minute review — the positions above stay strong through consistency, and automation removes the one failure mode (a missed due date) that can dent an otherwise excellent profile.",
    });
  }
  if (steps.length < 3) {
    steps.push({
      title: "Put the surplus to work",
      detail:
        "Margin, cushion, and clean payment history are all in place — long-term goals (retirement contributions, extra principal) are the natural next allocation.",
    });
  }
  return steps.slice(0, 5);
}

// ─── Recommendation ranking (shared pattern + shared rule constants) ─────────

function rankHealthOptions(
  i: HealthInputs,
  ctx: {
    score: number;
    grade: HealthGrade;
    dtiDisplayed: number;
    monthlyMargin: number;
    emergencyMonths: number;
  }
): HealthRankedOption[] {
  const list: { opt: HealthRankedOption; score: number }[] = [];
  const creditEligible = REFI_CREDIT_BANDS.has(i.creditBand);

  // Continue Current Strategy — earned, not default.
  if (ctx.score >= 70 && i.delinquency === "current") {
    list.push({
      opt: {
        key: "continue",
        name: "Continue your current strategy",
        why: "The fundamentals are working — steady margin, current payments, and a functioning cushion. The highest-value move may be consistency plus directing surplus at the opportunity areas above.",
      },
      score: 60,
    });
  }

  // Budget practice — foundational whenever cash flow isn't at full marks.
  if (ctx.monthlyMargin < i.monthlyIncome * 0.2) {
    list.push({
      opt: {
        key: "budget",
        name: "Build a written monthly budget",
        why: "Cash flow is the engine of this score, and a simple written plan — income, fixed outflows, and a named job for every remaining dollar — is the tool that finds margin no calculator can see. It costs nothing and feeds every other option here.",
      },
      score: ctx.monthlyMargin < 0 ? 65 : 40,
    });
  }

  // Personal Loan (consolidation) — shared credit rule + DTI window.
  if (creditEligible && ctx.dtiDisplayed > 36 && ctx.dtiDisplayed <= 50 && i.totalUnsecuredDebt > 0) {
    list.push({
      opt: {
        key: "personal-loan",
        name: "Personal loan (consolidate unsecured debt)",
        why: "Your credit range sits where consolidation loans commonly price well — replacing several payments with one fixed payment can lower DTI and simplify the plan. Run the Personal Loan Calculator to see the payment and DTI effect before deciding.",
      },
      score: 45 + (ctx.dtiDisplayed > 43 ? 8 : 0),
    });
  }

  // Mortgage Refinance — homeowner + shared ~640+ rule.
  if (i.homeowner && creditEligible && i.mortgagePayment > 0) {
    list.push({
      opt: {
        key: "mortgage-refinance",
        name: "Mortgage refinance review",
        why:
          ctx.dtiDisplayed > 43
            ? "You own a home and your credit range is in the typical refinance zone, but lenders weigh BOTH credit and DTI — reducing monthly debt obligations first may increase future refinance opportunities. The Refinance Calculator shows both sides of that math."
            : "You own a home and your credit range is in the typical refinance zone — a payment reduction there flows directly into cash flow and DTI. The Refinance Calculator includes the break-even and lifetime-cost math.",
      },
      score: 42 + (ctx.dtiDisplayed > 43 ? 6 : 0),
    });
  }

  // Debt Settlement — shared floor + genuine-strain gate.
  if (
    i.totalUnsecuredDebt >= SETTLEMENT_MIN_DEBT &&
    (i.delinquency !== "current" || ctx.dtiDisplayed > 50 || ctx.monthlyMargin < 0)
  ) {
    list.push({
      opt: {
        key: "debt-settlement",
        name: "Debt settlement (eligible unsecured debt)",
        why: "Could fit when full repayment isn't realistic — providers negotiate eligible unsecured balances down for less than owed, removing whole payments from your DTI. It typically requires accounts to be delinquent, affects credit significantly while underway, and fees are collectible only after each account settles.",
      },
      score: 44 + (i.delinquency !== "current" ? 10 : 0),
    });
  }

  // DMP — structured middle path.
  if (
    ctx.dtiDisplayed > 40 &&
    ctx.dtiDisplayed <= 55 &&
    (i.delinquency === "current" || i.delinquency === "30-60") &&
    i.totalUnsecuredDebt > 0
  ) {
    list.push({
      opt: {
        key: "dmp",
        name: "Debt management plan",
        why: "A nonprofit credit-counseling agency can often reduce card APRs and combine everything into one payment — no new loan, no approval hurdle — steadily improving DTI and payment history together.",
      },
      score: 38,
    });
  }

  // Guarantee ≥2 ranked options — the budget practice is always a valid floor.
  if (list.length < 2) {
    list.push({
      opt: {
        key: "budget",
        name: "Build a written monthly budget",
        why: "Whatever the next move turns out to be, a written monthly plan is the instrument panel for it — and the fastest way to find margin that isn't visible from account balances alone.",
      },
      score: 20,
    });
  }

  // De-dupe (budget can be added twice by the floor rule) and rank.
  const seen = new Set<HealthOptionKey>();
  return list
    .sort((a, b) => b.score - a.score)
    .filter((x) => (seen.has(x.opt.key) ? false : (seen.add(x.opt.key), true)))
    .map((x) => x.opt);
}

