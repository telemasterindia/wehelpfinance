// src/lib/calculators/personalLoan.ts
//
// Personal Loan Eligibility & Payment engine — Sprint 5.
//
// Composes existing platform engines instead of duplicating math:
//   • amortizedPayment .............. from debtSolutions (Sprint 4)
//   • DTI rounding + bands .......... round1/bandFor from dti (Sprint 3)
//   • settlement comparison ......... calculateSettlement/defaultSettlementPct/
//                                     DEFAULT_FEE_PCT from debtSettlement (Sprint 2)
//   • continue-as-is baseline ....... minimumPaymentBaseline (Sprint 2) or a
//                                     local closed-form payoff when the user
//                                     supplies their actual APR + payment
//   • credit bands + settlement floor CREDIT_BAND_OPTIONS re-exported,
//                                     SETTLEMENT_MIN_DEBT from debtSolutions
//
// Everything is an EDUCATIONAL ESTIMATE. Qualification bands describe how
// profiles like the entered one typically fare in underwriting — they are
// never a promise or a denial. All heuristics are documented inline and
// surfaced to the UI via `assumptions` so the page can disclose them.

import {
  amortizedPayment,
  SETTLEMENT_MIN_DEBT,
  CREDIT_BAND_OPTIONS,
  type CreditBand,
} from "@/lib/calculators/debtSolutions";
import {
  calculateSettlement,
  defaultSettlementPct,
  DEFAULT_FEE_PCT,
  minimumPaymentBaseline,
  DELINQUENCY_OPTIONS,
  EMPLOYMENT_OPTIONS,
  type DelinquencyStage,
  type EmploymentStatus,
} from "@/lib/calculators/debtSettlement";
import { round1, bandFor, type DtiBand } from "@/lib/calculators/dti";
import {
  round2,
  fmtUSD,
  fmtMonths,
  payoffDateLabel,
} from "@/lib/calculators/debtPayoff";

export { CREDIT_BAND_OPTIONS, DELINQUENCY_OPTIONS, EMPLOYMENT_OPTIONS };
export type { CreditBand, DelinquencyStage, EmploymentStatus };

// ─── Input types ──────────────────────────────────────────────────────────────

export type LoanPurpose =
  | "debt-consolidation"
  | "credit-cards"
  | "medical"
  | "home-improvement"
  | "major-purchase"
  | "emergency"
  | "other";

export interface PersonalLoanInputs {
  amount: number; // requested loan amount, dollars
  creditBand: CreditBand;
  monthlyIncome: number; // gross monthly income
  monthlyDebtPayments: number; // ALL existing monthly debt payments
  employment: EmploymentStatus;
  purpose: LoanPurpose;
  termMonths: number; // 24–84
  state: string; // 2-letter code, educational context only
  homeowner: boolean;
  delinquency: DelinquencyStage;
  currentApr: number | null; // optional: APR on the debt being replaced
  currentPayment: number | null; // optional: current payment on that debt
}

// ─── Educational APR ranges by credit band ───────────────────────────────────
//
// Documented educational ranges for unsecured personal loans, anchored to
// published market surveys and the Federal Reserve G.19 average (~12% for
// 24-month personal loans, 2025–2026). "typ" is the midpoint-weighted rate
// used for headline payment math; min/max bound the displayed range. These
// deliberately differ from Sprint 4's single-point LOAN_APR_BY_BAND (that
// engine needs one number per band for comparison rows; this tool's entire
// purpose is showing consumers the RANGE they may see).

export interface AprRange {
  min: number;
  typ: number;
  max: number;
}

export const APR_RANGE_BY_BAND: Record<CreditBand, AprRange> = {
  excellent: { min: 0.079, typ: 0.109, max: 0.139 },
  good: { min: 0.119, typ: 0.149, max: 0.189 },
  fair: { min: 0.179, typ: 0.219, max: 0.279 },
  poor: { min: 0.259, typ: 0.299, max: 0.3599 },
};

export const TERM_OPTIONS: { value: number; label: string }[] = [
  { value: 24, label: "24 months (2 years)" },
  { value: 36, label: "36 months (3 years)" },
  { value: 48, label: "48 months (4 years)" },
  { value: 60, label: "60 months (5 years)" },
  { value: 72, label: "72 months (6 years)" },
  { value: 84, label: "84 months (7 years)" },
];

export const PURPOSE_OPTIONS: { value: LoanPurpose; label: string }[] = [
  { value: "debt-consolidation", label: "Consolidating existing debt" },
  { value: "credit-cards", label: "Paying off credit cards" },
  { value: "medical", label: "Medical bills" },
  { value: "home-improvement", label: "Home improvement" },
  { value: "major-purchase", label: "Major purchase" },
  { value: "emergency", label: "Emergency expense" },
  { value: "other", label: "Something else" },
];

/** Purposes where the loan replaces existing unsecured debt. */
const CONSOLIDATION_PURPOSES: ReadonlySet<LoanPurpose> = new Set([
  "debt-consolidation",
  "credit-cards",
]);

// Assumed minimum payment on the existing debt when the user doesn't
// provide one: 3% of the balance, floored at $25 — the standard card-
// minimum convention, disclosed in `assumptions`.
export const ASSUMED_MIN_PAYMENT_PCT = 0.03;
export const ASSUMED_MIN_PAYMENT_FLOOR = 25;

// Settlement comparison uses a typical 3-account basket when the tool
// has no creditor-count input (disclosed).
export const ASSUMED_CREDITOR_COUNT = 3;

// ─── Qualification banding ───────────────────────────────────────────────────

export type QualificationBand =
  | "excellent"
  | "very-good"
  | "possible"
  | "difficult"
  | "unlikely";

export interface QualificationFactor {
  label: string;
  /** signed contribution, e.g. +1, -2 (0 factors are omitted) */
  effect: number;
}

export const QUALIFICATION_LABELS: Record<QualificationBand, string> = {
  excellent: "Excellent",
  "very-good": "Very good",
  possible: "Possible",
  difficult: "Difficult",
  unlikely: "Unlikely",
};

/** Soft, non-promissory phrasing for each band (language rules). */
export const QUALIFICATION_PHRASING: Record<QualificationBand, string> = {
  excellent:
    "Profiles like this typically see the widest lender access and the most competitive quoted rates.",
  "very-good":
    "Profiles like this are commonly approved by mainstream lenders, usually at mid-range rates.",
  possible:
    "Some lenders work with profiles like this — expect more variation in offers and pricing.",
  difficult:
    "Fewer lenders typically extend offers to profiles like this; those that do usually price at the top of the range.",
  unlikely:
    "Based on the information entered, most mainstream lenders would find this profile hard to approve today — lenders vary, and improving DTI or payment history can change the picture.",
};

// ─── Affordability ───────────────────────────────────────────────────────────

export type Affordability = "comfortable" | "tight" | "strained";

export const AFFORDABILITY_LABELS: Record<Affordability, string> = {
  comfortable: "Comfortable",
  tight: "Tight but workable",
  strained: "Strained",
};

// ─── Option ranking ──────────────────────────────────────────────────────────

export type LoanOptionKey =
  | "personal-loan"
  | "mortgage-refinance"
  | "debt-settlement"
  | "dmp"
  | "continue";

export interface RankedOption {
  key: LoanOptionKey;
  name: string;
  why: string;
}

// ─── Comparison ──────────────────────────────────────────────────────────────

export interface ComparisonCell {
  monthly: string;
  totalCost: string;
  creditImpact: string;
  dtiImpact: string;
  approval: string;
}

export interface LoanComparison {
  settlementIncluded: boolean;
  continueCell: ComparisonCell;
  loanCell: ComparisonCell;
  settlementCell: ComparisonCell | null;
  /** raw totals for CostBars (display only) */
  totals: { label: string; value: number }[];
  note: string;
}

// ─── Result ──────────────────────────────────────────────────────────────────

export interface PersonalLoanResult {
  ok: true;
  aprRange: AprRange;
  paymentTyp: number;
  paymentMin: number;
  paymentMax: number;
  totalInterest: number;
  totalRepaid: number;
  payoffLabel: string;

  dtiCurrent: number; // displayed, 1-dp
  dtiCurrentBand: DtiBand;
  dtiWithLoan: number; // displayed, 1-dp
  dtiWithLoanBand: DtiBand;
  dtiReplacesExisting: boolean; // consolidation math used

  qualification: QualificationBand;
  factors: QualificationFactor[];

  affordability: Affordability;
  paymentShareOfIncome: number; // displayed, 1-dp %

  paymentDelta: number | null; // vs currentPayment when provided (+ = higher)

  options: RankedOption[];
  comparison: LoanComparison;
  assumptions: string[];
}

export interface PersonalLoanError {
  ok: false;
  reason: string;
}

export type PersonalLoanOutput = PersonalLoanResult | PersonalLoanError;

// ─── Validation ──────────────────────────────────────────────────────────────

export function validateLoanInputs(i: PersonalLoanInputs): string | null {
  if (!(i.amount > 0)) return "Enter the loan amount you're considering.";
  if (i.amount < 500) return "Personal loans generally start around $500.";
  if (i.amount > 200000)
    return "Personal loans above $200,000 are rare — enter a smaller amount.";
  if (!(i.monthlyIncome > 0)) return "Enter your gross monthly income.";
  if (i.monthlyDebtPayments < 0) return "Debt payments can't be negative.";
  if (i.monthlyDebtPayments >= i.monthlyIncome * 3)
    return "Monthly debt payments look too high relative to income — double-check the numbers.";
  if (i.termMonths < 24 || i.termMonths > 84)
    return "Choose a loan term between 24 and 84 months.";
  if (i.currentApr !== null && (i.currentApr < 0 || i.currentApr > 1))
    return "Current APR looks out of range.";
  if (i.currentPayment !== null && i.currentPayment < 0)
    return "Current payment can't be negative.";
  return null;
}

// ─── Local util: exact payoff at a known APR + payment ───────────────────────
//
// Used ONLY when the user supplies their actual current APR (the shared
// minimumPaymentBaseline is fixed to the disclosed 22% platform baseline).
// Iterative month loop (capped) for exact totals, matching the platform's
// baseline methodology.

export function payoffAtApr(
  balance: number,
  annualApr: number,
  monthlyPayment: number,
): { payable: boolean; months: number; totalPaid: number } {
  if (monthlyPayment <= 0) return { payable: false, months: 0, totalPaid: 0 };
  const r = annualApr / 12;
  let bal = balance;
  let months = 0;
  let paid = 0;
  while (bal > 0 && months < 600) {
    const interest = bal * r;
    if (monthlyPayment <= interest && bal > 1)
      return { payable: false, months: 0, totalPaid: 0 };
    const pay = Math.min(monthlyPayment, bal + interest);
    bal = bal + interest - pay;
    paid += pay;
    months += 1;
    if (bal < 0.01) bal = 0;
  }
  if (bal > 0) return { payable: false, months: 0, totalPaid: 0 };
  return { payable: true, months, totalPaid: round2(paid) };
}

// ─── Main calculation ────────────────────────────────────────────────────────

export function calculatePersonalLoan(
  i: PersonalLoanInputs,
): PersonalLoanOutput {
  const invalid = validateLoanInputs(i);
  if (invalid) return { ok: false, reason: invalid };

  const assumptions: string[] = [];

  // — Loan payment math (typ headline, min/max range) —
  const aprRange = APR_RANGE_BY_BAND[i.creditBand];
  const paymentTyp = round2(
    amortizedPayment(i.amount, aprRange.typ, i.termMonths),
  );
  const paymentMin = round2(
    amortizedPayment(i.amount, aprRange.min, i.termMonths),
  );
  const paymentMax = round2(
    amortizedPayment(i.amount, aprRange.max, i.termMonths),
  );
  const totalRepaid = round2(paymentTyp * i.termMonths);
  const totalInterest = round2(totalRepaid - i.amount);
  const payoffLabel = payoffDateLabel(i.termMonths);
  assumptions.push(
    `APR range for the "${CREDIT_BAND_OPTIONS.find((c) => c.value === i.creditBand)?.label ?? i.creditBand}" credit band is an educational estimate (${pct(aprRange.min)}–${pct(aprRange.max)}); payment figures use the ${pct(aprRange.typ)} typical rate. Actual pricing is set by each lender.`,
  );

  // — DTI before / after (shared rounding + banding from the DTI engine) —
  const dtiCurrent = round1((i.monthlyDebtPayments / i.monthlyIncome) * 100);
  const dtiCurrentBand = bandFor(dtiCurrent);

  const consolidating = CONSOLIDATION_PURPOSES.has(i.purpose);
  const replacedPayment = consolidating
    ? (i.currentPayment ?? assumedMinPayment(i.amount))
    : 0;
  if (consolidating && i.currentPayment === null) {
    assumptions.push(
      `Existing payment on the debt being consolidated assumed at ${Math.round(ASSUMED_MIN_PAYMENT_PCT * 100)}% of the balance (${fmtUSD(assumedMinPayment(i.amount))}/mo) since none was entered.`,
    );
  }
  const dtiWithLoanRaw =
    ((Math.max(0, i.monthlyDebtPayments - replacedPayment) + paymentTyp) /
      i.monthlyIncome) *
    100;
  const dtiWithLoan = round1(dtiWithLoanRaw);
  const dtiWithLoanBand = bandFor(dtiWithLoan);
  if (consolidating) {
    assumptions.push(
      "After-loan DTI assumes the new loan replaces the payment on the debt being consolidated.",
    );
  } else {
    assumptions.push(
      "After-loan DTI adds the new loan payment on top of existing obligations.",
    );
  }

  // — Qualification band (documented, deterministic scoring) —
  const factors: QualificationFactor[] = [];
  const baseByBand: Record<CreditBand, number> = {
    excellent: 4,
    good: 3,
    fair: 2,
    poor: 1,
  };
  let score = baseByBand[i.creditBand];
  factors.push({
    label: `Credit range: ${CREDIT_BAND_OPTIONS.find((c) => c.value === i.creditBand)?.label ?? i.creditBand}`,
    effect: baseByBand[i.creditBand],
  });

  let dtiEffect = 0;
  if (dtiWithLoan <= 36) dtiEffect = 1;
  else if (dtiWithLoan <= 43) dtiEffect = 0;
  else if (dtiWithLoan <= 50) dtiEffect = -1;
  else dtiEffect = -2;
  if (dtiEffect !== 0)
    factors.push({
      label: `Estimated DTI after the loan: ${dtiWithLoan.toFixed(1)}%`,
      effect: dtiEffect,
    });
  score += dtiEffect;

  if (i.employment === "unemployed") {
    score -= 3;
    factors.push({
      label: "No employment income entered — lenders verify repayment ability",
      effect: -3,
    });
  }

  let delinqEffect = 0;
  if (i.delinquency === "30-60") delinqEffect = -1;
  else if (i.delinquency !== "current") delinqEffect = -2;
  if (delinqEffect !== 0) {
    score += delinqEffect;
    factors.push({
      label: "Recent missed payments on file",
      effect: delinqEffect,
    });
  }

  if (i.amount > i.monthlyIncome * 12) {
    score -= 1;
    factors.push({
      label: "Requested amount exceeds a year of gross income",
      effect: -1,
    });
  }

  let qualification: QualificationBand;
  if (score >= 5) qualification = "excellent";
  else if (score === 4) qualification = "very-good";
  else if (score === 3) qualification = "possible";
  else if (score === 2) qualification = "difficult";
  else qualification = "unlikely";

  // Caps that mirror how underwriting actually treats hard stops —
  // still phrased as bands, never as denials.
  if (
    i.employment === "unemployed" &&
    rankOf(qualification) > rankOf("difficult")
  )
    qualification = "difficult";
  if (
    (i.delinquency === "120-180" || i.delinquency === "180+") &&
    rankOf(qualification) > rankOf("possible")
  )
    qualification = "possible";

  // — Affordability (payment share of gross income; documented heuristic) —
  const shareRaw = (paymentTyp / i.monthlyIncome) * 100;
  const paymentShareOfIncome = round1(shareRaw);
  const affordability: Affordability =
    paymentShareOfIncome <= 10
      ? "comfortable"
      : paymentShareOfIncome <= 18
        ? "tight"
        : "strained";
  assumptions.push(
    "Affordability compares the estimated payment with gross monthly income (≤10% comfortable, ≤18% tight, above that strained) — a simplified screen, not a lender rule.",
  );

  const paymentDelta =
    i.currentPayment !== null ? round2(paymentTyp - i.currentPayment) : null;

  // — Comparison: continue vs loan vs (relevant) settlement —
  const continuePayment = i.currentPayment ?? assumedMinPayment(i.amount);
  let continueMonths = 0;
  let continueTotal = 0;
  let continuePayable = false;
  if (i.currentApr !== null && i.currentPayment !== null) {
    const exact = payoffAtApr(i.amount, i.currentApr, i.currentPayment);
    continuePayable = exact.payable;
    continueMonths = exact.months;
    continueTotal = exact.totalPaid;
    assumptions.push(
      `“Continue current payments” uses the APR you entered (${pct(i.currentApr)}).`,
    );
  } else {
    const base = minimumPaymentBaseline(i.amount, continuePayment);
    continuePayable = base.payable;
    continueMonths = base.months;
    continueTotal = base.totalPaid;
    assumptions.push(
      "“Continue current payments” uses the platform's disclosed 22% APR revolving baseline.",
    );
  }

  const settlementIncluded =
    consolidating || i.purpose === "medical"
      ? i.amount >= SETTLEMENT_MIN_DEBT
      : false;
  let settlementCell: ComparisonCell | null = null;
  let settlementTotal: number | null = null;
  if (settlementIncluded) {
    const s = calculateSettlement({
      totalDebt: i.amount,
      creditors: ASSUMED_CREDITOR_COUNT,
      state: i.state,
      monthlyIncome: i.monthlyIncome,
      currentMonthlyPayments: continuePayment,
      delinquency: i.delinquency,
      employment: i.employment,
      settlementPct: defaultSettlementPct(i.delinquency),
      feePct: DEFAULT_FEE_PCT,
      targetMonthlyPayment: 0,
    });
    if (s.ok) {
      settlementTotal = s.totalCost;
      settlementCell = {
        monthly: `${fmtUSD(s.monthlyDeposit)}/mo`,
        totalCost: fmtUSD(s.totalCost),
        creditImpact:
          "Significant while accounts settle; rebuilding follows completion",
        dtiImpact: "Falls as each enrolled account resolves",
        approval: "No lender approval needed — provider enrollment instead",
      };
      assumptions.push(
        `Settlement comparison assumes ${ASSUMED_CREDITOR_COUNT} enrolled accounts, ${pct(defaultSettlementPct(i.delinquency))} settlement of today's balance, and a ${pct(DEFAULT_FEE_PCT)} program fee collectible only after each account settles (FTC advance-fee rule).`,
      );
    }
  }

  const comparison: LoanComparison = {
    settlementIncluded: settlementCell !== null,
    continueCell: {
      monthly: `${fmtUSD(continuePayment)}/mo`,
      totalCost: continuePayable
        ? `${fmtUSD(continueTotal)} over ${fmtMonths(continueMonths)}`
        : "Balance doesn't decline at this payment",
      creditImpact: "No new impact while every payment stays on time",
      dtiImpact: "Unchanged",
      approval: "No approval involved",
    },
    loanCell: {
      monthly: `${fmtUSD(paymentTyp)}/mo`,
      totalCost: `${fmtUSD(totalRepaid)} over ${fmtMonths(i.termMonths)}`,
      creditImpact:
        "Hard inquiry at application; on-time payments commonly help over time",
      dtiImpact: consolidating
        ? "Often similar or lower if the loan replaces existing payments"
        : "Adds a new monthly obligation to your DTI",
      approval: QUALIFICATION_LABELS[qualification] + " (estimated)",
    },
    settlementCell,
    totals: [
      ...(continuePayable
        ? [{ label: "Continue current path", value: continueTotal }]
        : []),
      { label: "Personal loan (typical rate)", value: totalRepaid },
      ...(settlementTotal !== null
        ? [{ label: "Debt settlement", value: settlementTotal }]
        : []),
    ],
    note: settlementCell
      ? "Settlement applies to unsecured balances and requires falling behind before creditors negotiate — a serious trade-off, not a shortcut."
      : "Settlement isn't shown: it applies to existing unsecured debt of $7,500+ being consolidated or resolved, which doesn't match the entries.",
  };

  // — Ranked options worth exploring (never removes a relevant path) —
  const options = rankOptions(i, {
    qualification,
    dtiCurrent,
    dtiWithLoan,
    consolidating,
    settlementIncluded: settlementCell !== null,
    affordability,
  });

  return {
    ok: true,
    aprRange,
    paymentTyp,
    paymentMin,
    paymentMax,
    totalInterest,
    totalRepaid,
    payoffLabel,
    dtiCurrent,
    dtiCurrentBand,
    dtiWithLoan,
    dtiWithLoanBand,
    dtiReplacesExisting: consolidating,
    qualification,
    factors,
    affordability,
    paymentShareOfIncome,
    paymentDelta,
    options,
    comparison,
    assumptions,
  };
}

// ─── Option ranking ──────────────────────────────────────────────────────────

// ─── Mortgage-refinance business rule ────────────────────────────────────────
//
// Rule: homeowner + credit ≈640 or higher + DTI/affordability logic that
// supports exploration. Credit is captured in bands; the lowest band whose
// entire range clears ~640 is "good" (660–719), so eligibility maps to
// good | excellent. The high-DTI branch is intentionally INCLUDED (with
// "improve DTI first" guidance) — that is the exploration path the rule
// describes, not an exception to it.

export const REFI_CREDIT_BANDS: ReadonlySet<CreditBand> = new Set([
  "excellent",
  "good",
]);

function rankOptions(
  i: PersonalLoanInputs,
  ctx: {
    qualification: QualificationBand;
    dtiCurrent: number;
    dtiWithLoan: number;
    consolidating: boolean;
    settlementIncluded: boolean;
    affordability: Affordability;
  },
): RankedOption[] {
  const refiCreditEligible = REFI_CREDIT_BANDS.has(i.creditBand);
  const list: { opt: RankedOption; score: number }[] = [];

  // Personal Loan — always listed (it's the tool's subject).
  {
    let score = 50;
    if (ctx.qualification === "excellent") score += 30;
    else if (ctx.qualification === "very-good") score += 22;
    else if (ctx.qualification === "possible") score += 10;
    else if (ctx.qualification === "difficult") score -= 10;
    else score -= 25;
    if (ctx.affordability === "strained") score -= 10;
    const why = ctx.consolidating
      ? `${QUALIFICATION_PHRASING[ctx.qualification]} A fixed-rate loan that replaces revolving payments gives one predictable payment and a firm payoff date${ctx.dtiWithLoan <= ctx.dtiCurrent ? ", and your estimated DTI stays flat or improves because it replaces existing payments" : ""}.`
      : `${QUALIFICATION_PHRASING[ctx.qualification]} Keep in mind a new loan adds a payment on top of current obligations — your estimated DTI moves from ${ctx.dtiCurrent.toFixed(1)}% to ${ctx.dtiWithLoan.toFixed(1)}%.`;
    list.push({
      opt: { key: "personal-loan", name: "Personal loan", why },
      score,
    });
  }

  // Mortgage Refinance — homeowner + roughly 640+ credit.
  if (i.homeowner && refiCreditEligible) {
    let score = 40;
    const highDti = ctx.dtiCurrent > 43;
    if (highDti) score += 15; // most relevant exactly when DTI is the blocker
    const why = highDti
      ? "You own a home and your credit range is solid, but mortgage lenders weigh BOTH credit and DTI — at your current DTI, exploring ways to reduce monthly debt obligations first (consolidation, settlement of eligible unsecured balances, or a payoff plan) can make refinancing more practical."
      : "As a homeowner with a solid credit range, a cash-out refinance or home-equity option may price lower than an unsecured loan — worth comparing total costs and closing fees before deciding.";
    list.push({
      opt: { key: "mortgage-refinance", name: "Mortgage refinance", why },
      score,
    });
  }

  // Debt Settlement — relevant unsecured-debt situations only.
  if (
    ctx.settlementIncluded ||
    ctx.dtiWithLoan > 50 ||
    ctx.qualification === "unlikely"
  ) {
    if (
      i.amount >= SETTLEMENT_MIN_DEBT &&
      (ctx.consolidating || i.purpose === "medical")
    ) {
      let score = 30;
      if (ctx.qualification === "difficult" || ctx.qualification === "unlikely")
        score += 25;
      if (ctx.dtiWithLoan > 50) score += 10;
      list.push({
        opt: {
          key: "debt-settlement",
          name: "Debt settlement",
          why: "Could fit if new credit is hard to access right now — providers negotiate eligible unsecured balances down for less than owed. It typically requires accounts to be delinquent, affects credit significantly while underway, and fees are collectible only after each account settles.",
        },
        score,
      });
    }
  }

  // Debt Management Plan — moderate strain, not deeply delinquent.
  if (
    (i.delinquency === "current" || i.delinquency === "30-60") &&
    ctx.dtiCurrent > 36 &&
    ctx.dtiCurrent <= 55 &&
    ctx.consolidating
  ) {
    list.push({
      opt: {
        key: "dmp",
        name: "Debt management plan",
        why: "A nonprofit credit-counseling agency can often reduce card APRs into single digits and combine everything into one payment — no new loan, no approval hurdle, though enrolled cards are typically closed.",
      },
      score: 28 + (ctx.qualification === "difficult" ? 8 : 0),
    });
  }

  // Continue current repayment — genuinely manageable situations.
  if (ctx.dtiCurrent <= 36 && i.delinquency === "current") {
    list.push({
      opt: {
        key: "continue",
        name: "Continue current repayment",
        why: "Your estimated DTI sits in the healthy range and payments are current — staying the course avoids new obligations entirely. May become the strongest option if the extra borrowing isn't essential.",
      },
      score: ctx.affordability === "strained" ? 34 : 20,
    });
  }

  return list.sort((a, b) => b.score - a.score).map((x) => x.opt);
}

// ─── Small helpers ───────────────────────────────────────────────────────────

function assumedMinPayment(balance: number): number {
  return round2(
    Math.max(ASSUMED_MIN_PAYMENT_FLOOR, balance * ASSUMED_MIN_PAYMENT_PCT),
  );
}

function rankOf(q: QualificationBand): number {
  return [
    "unlikely",
    "difficult",
    "possible",
    "very-good",
    "excellent",
  ].indexOf(q);
}

function pct(fraction: number): string {
  const v = fraction * 100;
  return `${Number.isInteger(v) ? v : v.toFixed(v < 10 ? 1 : 1)}%`;
}
