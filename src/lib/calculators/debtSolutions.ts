// src/lib/calculators/debtSolutions.ts
//
// Debt Solutions Comparison engine — Sprint 4. Pure TypeScript.
// Composes the shipped Sprint 2 settlement engine and shared
// utilities to compare five paths side by side: minimum payments,
// debt settlement, consolidation loan, debt management plan (DMP),
// and bankruptcy (educational only — never computed as a
// recommendation). Zero duplicated math: baseline + settlement come
// from debtSettlement.ts; formatting from debtPayoff.ts.
//
// Every option carries eligibility with an honest reason, pros/cons,
// credit + mortgage impact labels, and difficulty/risk — so the UI
// compares transparently instead of selling.

import { round2 } from "@/lib/calculators/debtPayoff";
import {
  calculateSettlement, defaultSettlementPct, DEFAULT_FEE_PCT,
  minimumPaymentBaseline,
} from "@/lib/calculators/debtSettlement";
import type { DelinquencyStage } from "@/lib/calculators/debtSettlement";
export { DELINQUENCY_OPTIONS } from "@/lib/calculators/debtSettlement";
export type { DelinquencyStage } from "@/lib/calculators/debtSettlement";

// ─── Input types ──────────────────────────────────────────────────────────────

export type CreditBand = "excellent" | "good" | "fair" | "poor";
export type PaymentAbility = "comfortable" | "struggling" | "cannot";
export type UserGoal =
  | "lower-payment"
  | "debt-free-fast"
  | "avoid-bankruptcy"
  | "mortgage-eligibility";

export interface SolutionsInputs {
  totalDebt: number;
  monthlyIncome: number;          // gross, $/mo
  currentMonthlyPayments: number; // what they pay toward this debt today
  creditBand: CreditBand;
  delinquency: DelinquencyStage;
  creditors: number;
  paymentAbility: PaymentAbility;
  desiredMonthlyPayment: number;  // 0 = no preference
  goal: UserGoal;
}

// ─── Assumption constants (exported for the UI disclosure) ───────────────────

/** 2026 typical unsecured personal-loan APRs by credit band. */
export const LOAN_APR_BY_BAND: Record<CreditBand, number> = {
  excellent: 0.099,
  good: 0.139,
  fair: 0.199,
  poor: 0.279,
};

export const LOAN_TERM_MIN = 24;
export const LOAN_TERM_MAX = 84;
export const LOAN_TERM_DEFAULT = 60;

/** DMP: creditors typically reduce blended APR to ~8%; monthly admin fee. */
export const DMP_APR = 0.08;
export const DMP_MONTHS = 48;      // typical 36–60; midpoint used
export const DMP_MONTHLY_FEE = 35; // typical $25–$50

export const SETTLEMENT_MIN_DEBT = 7500;

// ─── Option result shapes ─────────────────────────────────────────────────────

export type OptionKey = "minimum" | "settlement" | "consolidation" | "dmp" | "bankruptcy";
export type ImpactLevel = "none" | "low" | "moderate" | "high" | "severe";
export type MortgageImpact = "neutral" | "helps-over-time" | "delays" | "blocks-temporarily";
export type Difficulty = "low" | "moderate" | "high";

export interface OptionNumbers {
  monthly: number | null;     // null = varies / not applicable
  months: number | null;
  totalPaid: number | null;
  savingsVsMinimum: number | null; // vs minimum-payment path (if both known)
}

export interface OptionResult extends OptionNumbers {
  key: OptionKey;
  name: string;
  eligible: boolean;
  eligibilityNote: string | null; // why not / caveat, honest
  creditImpact: ImpactLevel;
  creditNote: string;
  mortgageImpact: MortgageImpact;
  mortgageNote: string;
  difficulty: Difficulty;
  riskLevel: ImpactLevel;
  pros: string[];
  cons: string[];
  extraNote?: string;             // e.g. settlement tax note
}

export interface BestForLabels {
  lowerPayment: OptionKey | null;
  credit: OptionKey | null;
  speed: OptionKey | null;
  mortgage: OptionKey | null;
  hardship: OptionKey | null;
}

export interface SolutionsResult {
  ok: true;
  paymentRatio: number;           // currentMonthlyPayments / income, 1-dp %
  options: OptionResult[];        // minimum, settlement, consolidation, dmp, bankruptcy
  bestFor: BestForLabels;
  recommendation: {
    key: Exclude<OptionKey, "bankruptcy">;
    name: string;
    reason: string;
    href: string;
  };
  warnings: string[];
  assumptions: string[];
}

export interface SolutionsError {
  ok: false;
  reason: string;
}

export type SolutionsOutput = SolutionsResult | SolutionsError;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Standard amortized payment: P·r / (1 − (1+r)^−n). */
export function amortizedPayment(principal: number, annualRate: number, months: number): number {
  const r = annualRate / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

/** Smallest term (within bounds) whose payment ≤ desired; else null. */
function termForDesiredPayment(
  principal: number,
  annualRate: number,
  desired: number
): number | null {
  if (desired <= 0) return null;
  for (let n = LOAN_TERM_MIN; n <= LOAN_TERM_MAX; n += 12) {
    if (amortizedPayment(principal, annualRate, n) <= desired) return n;
  }
  return null;
}

const OPTION_NAMES: Record<OptionKey, string> = {
  minimum: "Continue minimum payments",
  settlement: "Debt settlement",
  consolidation: "Consolidation loan",
  dmp: "Debt management plan (DMP)",
  bankruptcy: "Bankruptcy (educational)",
};

const OPTION_HREFS: Record<Exclude<OptionKey, "bankruptcy" | "minimum">, string> = {
  settlement: "/debt-settlement",
  consolidation: "/debt-consolidation",
  dmp: "/debt-relief",
};

// ─── Core computation ─────────────────────────────────────────────────────────

export function compareSolutions(i: SolutionsInputs): SolutionsOutput {
  if (!(i.totalDebt >= 1000)) {
    return { ok: false, reason: "Enter your total unsecured debt (at least $1,000) to compare options." };
  }
  if (!(i.monthlyIncome > 0)) {
    return { ok: false, reason: "Enter your gross monthly income — the comparison depends on it." };
  }

  const paymentRatio = Math.round(((i.currentMonthlyPayments / i.monthlyIncome) * 100) * 10) / 10;
  const warnings: string[] = [];

  // ── 1) Minimum payments (baseline from the shipped Sprint 2 engine) ──
  const baseline = minimumPaymentBaseline(i.totalDebt, i.currentMonthlyPayments);
  const minimum: OptionResult = {
    key: "minimum",
    name: OPTION_NAMES.minimum,
    eligible: baseline.payable,
    eligibilityNote: baseline.payable ? null : baseline.reason ?? "Payments don't outpace interest.",
    monthly: i.currentMonthlyPayments > 0 ? round2(i.currentMonthlyPayments) : null,
    months: baseline.payable ? baseline.months : null,
    totalPaid: baseline.payable ? baseline.totalPaid : null,
    savingsVsMinimum: baseline.payable ? 0 : null,
    creditImpact: "none",
    creditNote: "No new damage if every payment stays on time — but high balances keep utilization high.",
    mortgageImpact: "neutral",
    mortgageNote: "Preserves payment history, but the monthly payments keep your DTI where it is.",
    difficulty: "low",
    riskLevel: baseline.payable ? "moderate" : "high",
    pros: [
      "No credit damage while payments stay on time",
      "Nothing to enroll in, no fees",
      "Full control — stop or accelerate any time",
    ],
    cons: [
      "Slowest and most expensive path in interest",
      "One emergency can restart the whole cycle",
      baseline.payable ? "Years of payments before balances meaningfully drop" : "At the current payment, balances never reach zero",
    ],
  };
  if (!baseline.payable) {
    warnings.push(
      "At your current payment, minimum payments never pay this debt off — the balance grows faster than the payment. That's the strongest signal a structured option is worth comparing."
    );
  }

  // ── 2) Debt settlement (shipped Sprint 2 engine, typical assumptions) ──
  const settlementCalc = calculateSettlement({
    totalDebt: i.totalDebt,
    creditors: Math.max(1, i.creditors),
    state: "",
    monthlyIncome: i.monthlyIncome,
    currentMonthlyPayments: i.currentMonthlyPayments,
    delinquency: i.delinquency,
    employment: "employed",
    settlementPct: defaultSettlementPct(i.delinquency),
    feePct: DEFAULT_FEE_PCT,
    targetMonthlyPayment: i.desiredMonthlyPayment,
  });

  let settlement: OptionResult;
  if (settlementCalc.ok) {
    const belowMin = i.totalDebt < SETTLEMENT_MIN_DEBT;
    const currentAccounts = i.delinquency === "current";
    settlement = {
      key: "settlement",
      name: OPTION_NAMES.settlement,
      eligible: !belowMin,
      eligibilityNote: belowMin
        ? `Below ~$${SETTLEMENT_MIN_DEBT.toLocaleString("en-US")} in debt, program fees consume most of the benefit — a DMP is usually more cost-effective at this size.`
        : currentAccounts
          ? "Your accounts are current — settlement would require falling behind first, which is where most of its credit damage comes from."
          : null,
      monthly: settlementCalc.monthlyDeposit,
      months: settlementCalc.months,
      totalPaid: settlementCalc.totalCost,
      savingsVsMinimum: baseline.payable ? round2(baseline.totalPaid - settlementCalc.totalCost) : null,
      creditImpact: currentAccounts ? "high" : "moderate",
      creditNote: settlementCalc.creditImpactNote,
      mortgageImpact: "blocks-temporarily",
      mortgageNote:
        "Settled accounts hurt near-term mortgage files, but deleting whole payments is the fastest DTI lever — many lenders consider applications 12–24 months after completion.",
      difficulty: "moderate",
      riskLevel: "high",
      pros: [
        "Typically resolves debt for significantly less than the balance",
        "One monthly deposit instead of juggling creditors",
        "Usually done in 24–48 months",
      ],
      cons: [
        "Significant credit damage, especially from current accounts",
        "Forgiven debt of $600+ may be taxable (Form 1099-C)",
        "Creditors can still pursue collection during the program",
      ],
      extraNote: settlementCalc.taxNote,
    };
  } else {
    settlement = {
      key: "settlement",
      name: OPTION_NAMES.settlement,
      eligible: false,
      eligibilityNote: settlementCalc.reason,
      monthly: null, months: null, totalPaid: null, savingsVsMinimum: null,
      creditImpact: "high",
      creditNote: "Settled accounts are reported for up to 7 years.",
      mortgageImpact: "blocks-temporarily",
      mortgageNote: "Near-term mortgage files are affected; DTI improves once payments are deleted.",
      difficulty: "moderate",
      riskLevel: "high",
      pros: [], cons: [],
    };
  }

  // ── 3) Consolidation loan ──
  const apr = LOAN_APR_BY_BAND[i.creditBand];
  const behind60 = i.delinquency === "60-120" || i.delinquency === "120-180" || i.delinquency === "180+";
  const loanEligible = i.creditBand !== "poor" && !behind60;
  const term =
    termForDesiredPayment(i.totalDebt, apr, i.desiredMonthlyPayment) ?? LOAN_TERM_DEFAULT;
  const loanPayment = round2(amortizedPayment(i.totalDebt, apr, term));
  const loanTotal = round2(loanPayment * term);
  const consolidation: OptionResult = {
    key: "consolidation",
    name: OPTION_NAMES.consolidation,
    eligible: loanEligible,
    eligibilityNote: loanEligible
      ? null
      : behind60
        ? "Lenders typically require accounts to be current — 60+ days of delinquency usually means a decline until history recovers."
        : "Below-600 credit usually prices consolidation loans near 28% APR or declines them — at that rate the loan rarely beats the cards.",
    monthly: loanPayment,
    months: term,
    totalPaid: loanTotal,
    savingsVsMinimum: baseline.payable ? round2(baseline.totalPaid - loanTotal) : null,
    creditImpact: "low",
    creditNote:
      "A hard inquiry and a new account short-term; paying off revolving balances usually improves utilization and scores within months.",
    mortgageImpact: "helps-over-time",
    mortgageNote:
      "One fixed installment payment usually lowers DTI versus scattered card minimums — the cleanest pre-mortgage move when you qualify.",
    difficulty: "low",
    riskLevel: "low",
    pros: [
      "Protects credit — often improves it via utilization",
      "One fixed payment with a real end date",
      "No tax consequences, no settlement negotiations",
    ],
    cons: [
      "Requires qualifying credit and current accounts",
      "Doesn't reduce what you owe — restructures it",
      "Freed-up cards can silently refill without discipline",
    ],
  };

  // ── 4) Debt management plan ──
  const dmpEligible = i.paymentAbility !== "cannot";
  const dmpBase = amortizedPayment(i.totalDebt, DMP_APR, DMP_MONTHS);
  const dmpPayment = round2(dmpBase + DMP_MONTHLY_FEE);
  const dmpTotal = round2(dmpPayment * DMP_MONTHS);
  const dmp: OptionResult = {
    key: "dmp",
    name: OPTION_NAMES.dmp,
    eligible: dmpEligible,
    eligibilityNote: dmpEligible
      ? null
      : "A DMP still repays the full balance monthly — it needs steady income. When payments truly aren't possible, settlement or legal advice fits better.",
    monthly: dmpPayment,
    months: DMP_MONTHS,
    totalPaid: dmpTotal,
    savingsVsMinimum: baseline.payable ? round2(baseline.totalPaid - dmpTotal) : null,
    creditImpact: "low",
    creditNote:
      "Enrolled accounts are typically closed (a mild, temporary dip); consistent on-time DMP payments then rebuild history.",
    mortgageImpact: "neutral",
    mortgageNote:
      "Full-balance repayment with reduced interest — lenders generally view completed DMPs far more favorably than settlements.",
    difficulty: "moderate",
    riskLevel: "low",
    pros: [
      "Creditors typically cut interest to ~8% inside a nonprofit plan",
      "Full balance repaid — no tax consequences",
      "Gentlest structured option on credit",
    ],
    cons: [
      "Enrolled cards are closed for the duration",
      "3–5 years of fixed payments with little flexibility",
      "Doesn't reduce principal — only interest and chaos",
    ],
  };

  // ── 5) Bankruptcy — educational only, never recommended ──
  const bankruptcy: OptionResult = {
    key: "bankruptcy",
    name: OPTION_NAMES.bankruptcy,
    eligible: true,
    eligibilityNote:
      "Included for education only. Whether bankruptcy fits is a legal determination — speak with a bankruptcy attorney, not a calculator.",
    monthly: null, months: null, totalPaid: null, savingsVsMinimum: null,
    creditImpact: "severe",
    creditNote:
      "Chapter 7 stays on credit reports up to 10 years; Chapter 13 up to 7. Rebuilding starts immediately after, but the mark is the longest of any option.",
    mortgageImpact: "blocks-temporarily",
    mortgageNote:
      "Mainstream mortgage programs impose waiting periods after discharge (commonly 2–4 years depending on program and chapter).",
    difficulty: "high",
    riskLevel: "severe",
    pros: [
      "Court-ordered fresh start with legal protection from collectors",
      "Chapter 7 can discharge unsecured debt in months",
      "Chapter 13 protects assets via a 3–5 year repayment plan",
    ],
    cons: [
      "Longest-lasting credit record of any option",
      "Public court record; attorney and filing costs",
      "Means testing and asset rules decide the chapter — not preference",
    ],
  };

  const options = [minimum, settlement, consolidation, dmp, bankruptcy];

  // ── Best-for labels (never bankruptcy) ──
  const candidates = options.filter(
    (o): o is OptionResult => o.key !== "bankruptcy" && o.eligible && o.monthly !== null
  );
  const byLowestMonthly = [...candidates].sort((a, b) => (a.monthly ?? 1e12) - (b.monthly ?? 1e12));
  const byFewestMonths = [...candidates].sort((a, b) => (a.months ?? 1e12) - (b.months ?? 1e12));

  const bestFor: BestForLabels = {
    lowerPayment: byLowestMonthly[0]?.key ?? null,
    credit: consolidation.eligible ? "consolidation" : dmp.eligible ? "dmp" : "minimum",
    speed: byFewestMonths[0]?.key ?? null,
    mortgage: consolidation.eligible ? "consolidation" : dmp.eligible ? "dmp" : null,
    hardship: settlement.eligible ? "settlement" : dmp.eligible ? "dmp" : null,
  };

  // ── Recommendation (goal-first, honest, never bankruptcy) ──
  let recKey: Exclude<OptionKey, "bankruptcy"> = "dmp";
  let reason = "";

  const severeStress = i.paymentAbility === "cannot" || paymentRatio >= 50 || !baseline.payable;

  switch (i.goal) {
    case "lower-payment": {
      recKey = (bestFor.lowerPayment ?? "dmp") as Exclude<OptionKey, "bankruptcy">;
      const winner = options.find((o) => o.key === recKey);
      reason = `Among the options you'd likely qualify for, ${winner?.name.toLowerCase()} produces the lowest monthly payment in this comparison${
        winner?.monthly && i.currentMonthlyPayments > 0
          ? ` — versus the ${fmtMoney(i.currentMonthlyPayments)} you're paying now`
          : ""
      }.`;
      break;
    }
    case "debt-free-fast": {
      recKey = (bestFor.speed ?? "dmp") as Exclude<OptionKey, "bankruptcy">;
      const winner = options.find((o) => o.key === recKey);
      reason = `${winner?.name} reaches zero fastest among the paths you'd likely qualify for — speed always trades against something, so weigh its credit column before deciding.`;
      break;
    }
    case "mortgage-eligibility": {
      if (consolidation.eligible) {
        recKey = "consolidation";
        reason =
          "For a mortgage file, consolidation is the cleanest lever you likely qualify for: one fixed payment usually lowers DTI while protecting — often improving — your credit.";
      } else if (severeStress && settlement.eligible) {
        recKey = "settlement";
        reason =
          "With qualifying blocked and payments unsustainable, deleting whole payments via settlement is the fastest DTI lever — with the honest trade-off that near-term credit takes the hit first.";
      } else {
        recKey = "dmp";
        reason =
          "With a consolidation loan out of reach right now, a DMP lowers interest and steadies your file — the mortgage conversation gets easier after 12–24 months of clean plan history.";
      }
      break;
    }
    case "avoid-bankruptcy": {
      if (settlement.eligible && severeStress) {
        recKey = "settlement";
        reason =
          "When payments genuinely can't continue, settlement is the structured alternative built for exactly this — resolving debts for less without a court filing.";
      } else if (dmp.eligible) {
        recKey = "dmp";
        reason =
          "A nonprofit DMP restructures interest and payments without touching the courts — for most people asking this question, it's the first alternative worth exhausting.";
      } else {
        recKey = "settlement";
        reason =
          "With a DMP's steady-payment requirement out of reach, settlement remains the primary structured alternative to a filing.";
      }
      break;
    }
  }

  // Guardrail: never recommend an ineligible option.
  const recOption = options.find((o) => o.key === recKey);
  if (recOption && !recOption.eligible) {
    const fallback = candidates[0];
    if (fallback) {
      recKey = fallback.key as Exclude<OptionKey, "bankruptcy">;
      reason = `${recOption.name} doesn't fit your inputs (${recOption.eligibilityNote ?? "not eligible"}), so among remaining paths, ${fallback.name.toLowerCase()} fits your goal best.`;
    }
  }

  const recommendation = {
    key: recKey,
    name: OPTION_NAMES[recKey],
    reason,
    href: recKey === "minimum" ? "/financial-tools/debt-payoff-calculator" : OPTION_HREFS[recKey as keyof typeof OPTION_HREFS],
  };

  if (paymentRatio >= 50) {
    warnings.push(
      `Your debt payments are ${paymentRatio}% of gross income — hardship territory by any lender's math. Comparing structured options now, before accounts slip further, preserves the most choices.`
    );
  }

  const assumptions = [
    "Minimum-payment path assumes a blended 22% APR on revolving balances (2026 average).",
    `Settlement assumes ${Math.round(defaultSettlementPct(i.delinquency) * 100)}% of balance (typical for your delinquency status) plus a ${Math.round(DEFAULT_FEE_PCT * 100)}% program fee — fees collectible only after each debt settles (FTC rule).`,
    `Consolidation assumes a ${(apr * 100).toFixed(1)}% APR for your credit range over ${term} months.`,
    `DMP assumes creditors reduce interest to ~${Math.round(DMP_APR * 100)}% over ${DMP_MONTHS} months, plus a $${DMP_MONTHLY_FEE}/month administration fee.`,
    "Bankruptcy is presented for education only — chapter fit is a legal determination.",
    "All figures are planning estimates, not offers or quotes.",
  ];

  return { ok: true, paymentRatio, options, bestFor, recommendation, warnings, assumptions };
}

function fmtMoney(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

// ─── UI option lists ──────────────────────────────────────────────────────────

export const CREDIT_BAND_OPTIONS: { value: CreditBand; label: string }[] = [
  { value: "excellent", label: "Excellent (720+)" },
  { value: "good", label: "Good (660–719)" },
  { value: "fair", label: "Fair (600–659)" },
  { value: "poor", label: "Below 600" },
];

export const PAYMENT_ABILITY_OPTIONS: { value: PaymentAbility; label: string }[] = [
  { value: "comfortable", label: "I can make my payments comfortably" },
  { value: "struggling", label: "I'm struggling but keeping up" },
  { value: "cannot", label: "I can't keep up anymore" },
];

export const GOAL_OPTIONS: { value: UserGoal; label: string }[] = [
  { value: "lower-payment", label: "Reduce my monthly payments" },
  { value: "debt-free-fast", label: "Become debt-free faster" },
  { value: "avoid-bankruptcy", label: "Avoid bankruptcy" },
  { value: "mortgage-eligibility", label: "Improve mortgage eligibility" },
];
