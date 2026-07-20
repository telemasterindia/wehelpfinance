// src/lib/calculators/mortgageRefinance.ts
//
// Mortgage Refinance Savings engine — Sprint 6.
//
// Platform reuse (no duplicated math):
//   • amortizedPayment ............ debtSolutions (Sprint 4)
//   • DTI rounding + bands ........ round1/bandFor from dti (Sprint 3)
//   • round2/fmt helpers .......... debtPayoff (Sprint 1)
//   • credit bands + refi rule .... CREDIT_BAND_OPTIONS + REFI_CREDIT_BANDS
//                                   from the Sprint 5 engines (single source
//                                   for the "~640+" business rule)
//
// Everything is an EDUCATIONAL ESTIMATE. Readiness bands describe how
// profiles like the entered one typically fare — never approval, never
// denial. Every heuristic is disclosed via `assumptions`.

import { amortizedPayment, CREDIT_BAND_OPTIONS, type CreditBand } from "@/lib/calculators/debtSolutions";
import { round1, bandFor, type DtiBand } from "@/lib/calculators/dti";
import { round2, fmtUSD, fmtMonths } from "@/lib/calculators/debtPayoff";

/** Credit ranges that meet this calculator's disclosed ~640+ heuristic. */
export const REFI_CREDIT_BANDS = new Set<CreditBand>(["excellent", "good"]);

export { CREDIT_BAND_OPTIONS };
export type { CreditBand };

// ─── Inputs ──────────────────────────────────────────────────────────────────

export interface RefiInputs {
  balance: number;             // current mortgage balance
  currentRate: number;         // fraction, e.g. 0.0725
  currentPayment: number;      // current monthly PRINCIPAL + INTEREST
  remainingTermMonths: number; // months left on current loan
  homeValue: number;           // estimated current home value
  newRate: number;             // fraction
  newTermMonths: number;       // 120–360
  closingCosts: number;        // dollars, assumed paid at closing
  monthlyIncome: number;       // gross monthly income
  monthlyDebtPayments: number; // all NON-mortgage monthly debt payments
  creditBand: CreditBand;
  state: string;               // educational context only
}

export const NEW_TERM_OPTIONS: { value: number; label: string }[] = [
  { value: 120, label: "10 years" },
  { value: 180, label: "15 years" },
  { value: 240, label: "20 years" },
  { value: 300, label: "25 years" },
  { value: 360, label: "30 years" },
];

// ─── LTV banding (educational, based on common program lines) ────────────────

export type LtvBandKey = "strong" | "standard" | "high" | "very-high" | "underwater";

export interface LtvBand {
  key: LtvBandKey;
  label: string;
  note: string;
}

export function ltvBandFor(ltv: number): LtvBand {
  if (ltv <= 80)
    return {
      key: "strong",
      label: "80% or below",
      note: "The classic conventional line — typically no PMI and the widest program access.",
    };
  if (ltv <= 90)
    return {
      key: "standard",
      label: "80–90%",
      note: "Commonly workable; conventional refinances in this range usually carry PMI.",
    };
  if (ltv <= 97)
    return {
      key: "high",
      label: "90–97%",
      note: "Program-dependent territory — fewer options, pricing and PMI matter more.",
    };
  if (ltv <= 100)
    return {
      key: "very-high",
      label: "97–100%",
      note: "Above typical conventional limits; specialized programs only.",
    };
  return {
    key: "underwater",
    label: "Above 100%",
    note: "Balance exceeds the estimated value — standard refinancing is generally unavailable until equity recovers.",
  };
}

// ─── Readiness (soft, factor-based — mirrors the Sprint 5 pattern) ───────────

export type RefiReadiness = "strong" | "workable" | "challenged";

export const READINESS_LABELS: Record<RefiReadiness, string> = {
  strong: "Strong",
  workable: "Workable",
  challenged: "Challenged",
};

export const READINESS_PHRASING: Record<RefiReadiness, string> = {
  strong:
    "Entries like these typically line up well with mainstream refinance programs — lender underwriting still decides.",
  workable:
    "Refinancing may be workable with entries like these — expect more variation between lenders and programs.",
  challenged:
    "Entries like these usually need one or two numbers to move first — lenders vary, and improving DTI, credit, or equity can change the picture.",
};

export interface ReadinessFactor {
  label: string;
  tone: "positive" | "neutral" | "negative";
}

// ─── Options (reuses the Sprint 5 recommendation pattern + rule constants) ───

export type RefiOptionKey =
  | "mortgage-refinance"
  | "continue"
  | "personal-loan"
  | "debt-settlement"
  | "dmp";

export interface RefiRankedOption {
  key: RefiOptionKey;
  name: string;
  why: string;
}

// ─── Result ──────────────────────────────────────────────────────────────────

export interface RefiComparisonRowCells {
  current: string;
  refi: string;
}

export interface RefiResult {
  ok: true;

  newPayment: number;
  monthlySavings: number;      // + = refi payment is lower
  annualSavings: number;
  currentRemainingCost: number; // currentPayment × remaining months
  currentRemainingInterest: number;
  refiTotalCost: number;        // newPayment × newTerm + closingCosts
  refiTotalInterest: number;    // newPayment × newTerm − balance
  lifetimeSavings: number;      // currentRemainingCost − refiTotalCost
  breakEvenMonths: number | null; // null when no break-even at these numbers

  ltv: number;                  // displayed, 1-dp
  ltvBand: LtvBand;

  dtiCurrent: number;
  dtiCurrentBand: DtiBand;
  dtiAfter: number;
  dtiAfterBand: DtiBand;

  frontEndCurrent: number;      // current housing share of income, 1-dp
  frontEndAfter: number;
  cashFlowPctOfIncome: number;  // monthlySavings / income, 1-dp

  readiness: RefiReadiness;
  factors: ReadinessFactor[];

  paymentLooksEscrow: boolean;  // entered payment far above computed P&I

  options: RefiRankedOption[];
  comparisonRows: { label: string; cells: RefiComparisonRowCells }[];
  totals: { label: string; value: number }[];
  assumptions: string[];
}

export interface RefiError {
  ok: false;
  reason: string;
}

export type RefiOutput = RefiResult | RefiError;

// ─── Validation ──────────────────────────────────────────────────────────────

export function validateRefiInputs(i: RefiInputs): string | null {
  if (!(i.balance > 0)) return "Enter your current mortgage balance.";
  if (i.balance > 5_000_000) return "Balances above $5M are outside this tool's range.";
  if (!(i.homeValue > 0)) return "Enter your estimated home value.";
  if (i.currentRate <= 0 || i.currentRate > 0.2)
    return "Current rate looks out of range — enter it as a percent, e.g. 7.25.";
  if (i.newRate <= 0 || i.newRate > 0.2)
    return "New rate looks out of range — enter it as a percent, e.g. 6.1.";
  if (!(i.currentPayment > 0)) return "Enter your current monthly principal & interest payment.";
  if (i.remainingTermMonths < 12 || i.remainingTermMonths > 480)
    return "Remaining term should be between 1 and 40 years.";
  if (i.newTermMonths < 120 || i.newTermMonths > 360)
    return "Choose a new loan term between 10 and 30 years.";
  if (i.closingCosts < 0) return "Closing costs can't be negative.";
  if (i.closingCosts > i.balance * 0.15)
    return "Closing costs look too high relative to the balance — double-check the number.";
  if (!(i.monthlyIncome > 0)) return "Enter your gross monthly income.";
  if (i.monthlyDebtPayments < 0) return "Debt payments can't be negative.";
  if (i.monthlyDebtPayments + i.currentPayment >= i.monthlyIncome * 3)
    return "Payments look too high relative to income — double-check the numbers.";
  // Interest-only sanity: entered payment must at least cover current interest.
  if (i.currentPayment <= (i.balance * i.currentRate) / 12)
    return "The current payment entered doesn't cover monthly interest — check the principal & interest amount.";
  return null;
}

// ─── Main calculation ────────────────────────────────────────────────────────

export function calculateRefinance(i: RefiInputs): RefiOutput {
  const invalid = validateRefiInputs(i);
  if (invalid) return { ok: false, reason: invalid };

  const assumptions: string[] = [];

  // — New payment + cost math —
  const newPayment = round2(amortizedPayment(i.balance, i.newRate, i.newTermMonths));
  const monthlySavings = round2(i.currentPayment - newPayment);
  const annualSavings = round2(monthlySavings * 12);

  const currentRemainingCost = round2(i.currentPayment * i.remainingTermMonths);
  const currentRemainingInterest = round2(currentRemainingCost - i.balance);
  const refiPaid = round2(newPayment * i.newTermMonths);
  const refiTotalInterest = round2(refiPaid - i.balance);
  const refiTotalCost = round2(refiPaid + i.closingCosts);
  const lifetimeSavings = round2(currentRemainingCost - refiTotalCost);

  assumptions.push(
    "The refinance replaces the current balance at the new rate and term; closing costs are assumed paid at closing (not rolled into the loan)."
  );
  assumptions.push(
    "Lifetime comparison = every remaining current payment vs. every new payment plus closing costs. Payments are principal & interest only — taxes and insurance continue either way."
  );

  const breakEvenMonths =
    monthlySavings > 0
      ? i.closingCosts > 0
        ? Math.ceil(i.closingCosts / monthlySavings)
        : 0
      : null;

  // — Escrow sniff test (warn, never block) —
  const computedCurrentPI = amortizedPayment(i.balance, i.currentRate, i.remainingTermMonths);
  const paymentLooksEscrow = i.currentPayment > computedCurrentPI * 1.25;
  if (paymentLooksEscrow) {
    assumptions.push(
      `The current payment entered is well above the computed principal & interest (~${fmtUSD(round2(computedCurrentPI))}) for this balance, rate, and term — it may include escrow (taxes/insurance). For accurate interest math, enter P&I only.`
    );
  }

  // — LTV —
  const ltv = round1((i.balance / i.homeValue) * 100);
  const ltvBand = ltvBandFor(ltv);
  assumptions.push("LTV = mortgage balance ÷ estimated home value; program lines shown are common industry conventions, not any specific lender's rules.");

  // — DTI before / after (mortgage payment swapped, other debts constant) —
  const dtiCurrent = round1(((i.monthlyDebtPayments + i.currentPayment) / i.monthlyIncome) * 100);
  const dtiCurrentBand = bandFor(dtiCurrent);
  const dtiAfter = round1(((i.monthlyDebtPayments + newPayment) / i.monthlyIncome) * 100);
  const dtiAfterBand = bandFor(dtiAfter);
  const frontEndCurrent = round1((i.currentPayment / i.monthlyIncome) * 100);
  const frontEndAfter = round1((newPayment / i.monthlyIncome) * 100);
  const cashFlowPctOfIncome = round1((monthlySavings / i.monthlyIncome) * 100);
  assumptions.push(
    "DTI uses gross monthly income with the same rounding and bands as the WeHelpFinance DTI Calculator; the after-refinance figure swaps only the mortgage payment."
  );

  // — Readiness (factor-based, soft) —
  const factors: ReadinessFactor[] = [];
  let score = 0;

  if (REFI_CREDIT_BANDS.has(i.creditBand)) {
    score += 2;
    factors.push({ label: "Credit range within the typical refinance zone (~640+)", tone: "positive" });
  } else {
    score -= 2;
    factors.push({
      label: "Credit range below the typical refinance zone — approval depends on lender underwriting; improving credit widens options",
      tone: "negative",
    });
  }

  if (ltvBand.key === "strong") {
    score += 2;
    factors.push({ label: "LTV at or below 80% — widest program access, typically no PMI", tone: "positive" });
  } else if (ltvBand.key === "standard") {
    score += 1;
    factors.push({ label: "LTV 80–90% — workable, PMI likely on conventional programs", tone: "neutral" });
  } else if (ltvBand.key === "high") {
    factors.push({ label: "LTV 90–97% — program-dependent", tone: "neutral" });
  } else {
    score -= 2;
    factors.push({ label: `LTV ${ltvBand.label.toLowerCase()} — equity is the constraint to watch`, tone: "negative" });
  }

  if (dtiAfter <= 36) {
    score += 2;
    factors.push({ label: `Projected DTI ${dtiAfter.toFixed(1)}% — healthy range`, tone: "positive" });
  } else if (dtiAfter <= 45) {
    factors.push({ label: `Projected DTI ${dtiAfter.toFixed(1)}% — workable-but-selective range`, tone: "neutral" });
  } else {
    score -= 2;
    factors.push({
      label: `Projected DTI ${dtiAfter.toFixed(1)}% — reducing monthly debt obligations may increase future refinance opportunities`,
      tone: "negative",
    });
  }

  if (monthlySavings > 0) {
    score += 1;
    factors.push({ label: `Estimated payment drops ${fmtUSD(monthlySavings)}/mo at the rate entered`, tone: "positive" });
  } else {
    factors.push({
      label: "The new payment isn't lower at these numbers — refinancing here would be about the term or rate structure, not monthly relief",
      tone: "neutral",
    });
  }

  let readiness: RefiReadiness = score >= 4 ? "strong" : score >= 1 ? "workable" : "challenged";
  // Hard equity caps: LTV constraints override point totals — above 100%
  // standard refinancing is generally unavailable, and 97–100% is
  // specialized-program territory at best.
  if (ltvBand.key === "underwater") readiness = "challenged";
  else if (ltvBand.key === "very-high" && readiness === "strong") readiness = "workable";

  // — Options worth exploring (Sprint 5 recommendation pattern + rule constants) —
  const options = rankRefiOptions(i, {
    readiness,
    dtiCurrent,
    dtiAfter,
    monthlySavings,
    breakEvenMonths,
    lifetimeSavings,
    ltvBand,
  });

  // — Comparison rows (Current vs Refinanced) —
  const comparisonRows: { label: string; cells: RefiComparisonRowCells }[] = [
    {
      label: "Monthly payment (P&I)",
      cells: { current: `${fmtUSD(i.currentPayment)}/mo`, refi: `${fmtUSD(newPayment)}/mo` },
    },
    {
      label: "Remaining interest cost",
      cells: {
        current: fmtUSD(currentRemainingInterest),
        refi: `${fmtUSD(refiTotalInterest)} + ${fmtUSD(i.closingCosts)} closing`,
      },
    },
    {
      label: "Total remaining cost",
      cells: {
        current: `${fmtUSD(currentRemainingCost)} over ${fmtMonths(i.remainingTermMonths)}`,
        refi: `${fmtUSD(refiTotalCost)} over ${fmtMonths(i.newTermMonths)}`,
      },
    },
    {
      label: "Monthly cash flow",
      cells: {
        current: "Baseline",
        refi:
          monthlySavings > 0
            ? `${fmtUSD(monthlySavings)}/mo freed up`
            : monthlySavings < 0
              ? `${fmtUSD(Math.abs(monthlySavings))}/mo tighter`
              : "Unchanged",
      },
    },
    {
      label: "Back-end DTI",
      cells: { current: `${dtiCurrent.toFixed(1)}%`, refi: `${dtiAfter.toFixed(1)}%` },
    },
    {
      label: "Break-even on closing costs",
      cells: {
        current: "—",
        refi:
          breakEvenMonths === null
            ? "No break-even (payment isn't lower)"
            : breakEvenMonths === 0
              ? "Immediate (no closing costs entered)"
              : fmtMonths(breakEvenMonths),
      },
    },
  ];

  const totals = [
    { label: "Keep current mortgage", value: currentRemainingCost },
    { label: "Refinance (incl. closing costs)", value: refiTotalCost },
  ];

  return {
    ok: true,
    newPayment,
    monthlySavings,
    annualSavings,
    currentRemainingCost,
    currentRemainingInterest,
    refiTotalCost,
    refiTotalInterest,
    lifetimeSavings,
    breakEvenMonths,
    ltv,
    ltvBand,
    dtiCurrent,
    dtiCurrentBand,
    dtiAfter,
    dtiAfterBand,
    frontEndCurrent,
    frontEndAfter,
    cashFlowPctOfIncome,
    readiness,
    factors,
    paymentLooksEscrow,
    options,
    comparisonRows,
    totals,
    assumptions,
  };
}

// ─── Option ranking ──────────────────────────────────────────────────────────

function rankRefiOptions(
  i: RefiInputs,
  ctx: {
    readiness: RefiReadiness;
    dtiCurrent: number;
    dtiAfter: number;
    monthlySavings: number;
    breakEvenMonths: number | null;
    lifetimeSavings: number;
    ltvBand: LtvBand;
  }
): RefiRankedOption[] {
  const list: { opt: RefiRankedOption; score: number }[] = [];
  const creditEligible = REFI_CREDIT_BANDS.has(i.creditBand);

  // Mortgage Refinance — always listed (the tool's subject).
  {
    let score = 50;
    if (ctx.readiness === "strong") score += 25;
    else if (ctx.readiness === "workable") score += 10;
    else score -= 15;
    if (ctx.monthlySavings > 0 && ctx.breakEvenMonths !== null && ctx.breakEvenMonths <= 36) score += 10;
    if (ctx.lifetimeSavings < 0) score -= 10;

    let why: string;
    if (ctx.dtiAfter > 45) {
      // Business rule: high DTI → improvement path, never rejection.
      why = `${READINESS_PHRASING[ctx.readiness]} Mortgage lenders weigh BOTH credit and DTI — at a projected ${ctx.dtiAfter.toFixed(1)}% DTI, reducing monthly debt obligations first (consolidating, resolving eligible unsecured balances, or a payoff plan) may increase future refinance opportunities.`;
    } else if (!creditEligible) {
      // Business rule: credit below range → underwriting-dependent, encourage improvement.
      why = `${READINESS_PHRASING[ctx.readiness]} Approval depends on each lender's underwriting; improving your credit range may increase the programs and pricing available to you.`;
    } else if (ctx.monthlySavings > 0) {
      why = `${READINESS_PHRASING[ctx.readiness]} At the rate entered, the payment drops ${fmtUSD(ctx.monthlySavings)}/mo${ctx.breakEvenMonths !== null && ctx.breakEvenMonths > 0 ? ` and closing costs break even in about ${fmtMonths(ctx.breakEvenMonths)}` : ""} — compare the lifetime figure too, since a longer term can offset a lower rate.`;
    } else {
      why = `${READINESS_PHRASING[ctx.readiness]} The payment isn't lower at these numbers — a refinance here would be about restructuring the rate or term rather than monthly relief, so weigh the lifetime cost carefully.`;
    }
    list.push({ opt: { key: "mortgage-refinance", name: "Mortgage refinance", why }, score });
  }

  // Continue Current Mortgage — when the math argues for staying put.
  if (
    ctx.monthlySavings <= 0 ||
    (ctx.breakEvenMonths !== null && ctx.breakEvenMonths > 48) ||
    ctx.lifetimeSavings < 0 ||
    ctx.ltvBand.key === "underwater" ||
    ctx.ltvBand.key === "very-high"
  ) {
    let score = 42;
    if (ctx.monthlySavings <= 0 && ctx.lifetimeSavings < 0) score += 20;
    list.push({
      opt: {
        key: "continue",
        name: "Continue the current mortgage",
        why:
          ctx.lifetimeSavings < 0 && ctx.monthlySavings > 0
            ? "The lower payment comes from restarting the clock — over the full term this refinance costs more than staying put. Keeping the current loan preserves the payoff progress you've already made; revisit if rates drop further."
            : "At these numbers the refinance doesn't clearly beat the current loan. Staying the course costs nothing to explore again later — rates, equity, and your DTI can all move in your favor.",
      },
      score,
    });
  }

  // Personal Loan (consolidation) — when non-mortgage debt is the DTI drag.
  if (ctx.dtiCurrent > 36 && i.monthlyDebtPayments >= 300 && creditEligible) {
    list.push({
      opt: {
        key: "personal-loan",
        name: "Personal loan (consolidate non-mortgage debt)",
        why: "A chunk of your DTI comes from non-mortgage payments. A fixed-rate consolidation loan that replaces those payments can lower your DTI — which mortgage lenders weigh alongside credit — potentially strengthening a refinance application later.",
      },
      score: 34 + (ctx.dtiAfter > 45 ? 10 : 0),
    });
  }

  // Debt Settlement — meaningful unsecured burden + stretched DTI.
  if (ctx.dtiAfter > 43 && i.monthlyDebtPayments >= 400) {
    list.push({
      opt: {
        key: "debt-settlement",
        name: "Debt settlement (eligible unsecured debt)",
        why: "Could fit if unsecured balances are the reason DTI stays high — providers negotiate eligible balances down for less than owed, which removes whole payments from your DTI. It typically requires accounts to be delinquent, affects credit significantly while underway, and fees are collectible only after each account settles.",
      },
      score: 30 + (ctx.readiness === "challenged" ? 12 : 0),
    });
  }

  // Debt Management Plan — moderate, structured middle path.
  // DMP floor at 40%: below that the burden rarely justifies a managed plan.
  if (ctx.dtiCurrent > 40 && ctx.dtiCurrent <= 55 && i.monthlyDebtPayments >= 300) {
    list.push({
      opt: {
        key: "dmp",
        name: "Debt management plan",
        why: "A nonprofit credit-counseling agency can often reduce card APRs and combine non-mortgage debts into one payment — no new loan, no approval hurdle — gradually improving the DTI side of a future refinance application.",
      },
      score: 26,
    });
  }

  return list.sort((a, b) => b.score - a.score).map((x) => x.opt);
}
