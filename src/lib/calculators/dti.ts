// src/lib/calculators/dti.ts
//
// Debt-to-Income (DTI) engine — Sprint 3 of the Financial Tools
// platform. Pure TypeScript, no React, no DOM. Implements the
// approved Sprint 3 specification: two modes (Current / Mortgage-
// qualification), front-end + back-end ratios, lender threshold
// table (28/36, Fannie/Freddie, FHA, VA, QM context, personal-loan
// practice), risk bands judged on the DISPLAYED one-decimal value,
// gap analysis with directional rounding (needed → up, headroom →
// down), mortgage-readiness summary, and what-if support.
//
// Platform rounding contract (docs/CALCULATOR_PLATFORM_STANDARDS.md §7):
//   amounts the user NEEDS round UP; HEADROOM rounds DOWN.
//   Never overstate approvals; never understate required reductions.

// ─── Input types ──────────────────────────────────────────────────────────────

export type DtiMode = "current" | "mortgage";
export type IncomePeriod = "monthly" | "annual";
export type HousingStatus = "rent" | "own-mortgage" | "own-clear" | "none";

export interface DtiDebts {
  auto: number;      // auto loans / leases, $/mo
  student: number;   // student loans, $/mo (as a lender would count)
  cards: number;     // credit card MINIMUMS combined, $/mo
  personal: number;  // personal / installment loans, $/mo
  support: number;   // child support / alimony PAID, $/mo
  other: number;     // other contractual debt, $/mo
}

export interface DtiInputs {
  mode: DtiMode;
  grossIncome: number;        // in the unit given by incomePeriod
  incomePeriod: IncomePeriod;
  coBorrowerIncome: number;   // same period as grossIncome; 0 if none
  housingStatus: HousingStatus;
  currentHousing: number;     // rent or full PITI+HOA, $/mo
  proposedHousing: number;    // Mode B proposed PITI+HOA, $/mo
  debts: DtiDebts;
}

// ─── Bands (labels per Sprint 3 order; boundaries per approved spec) ─────────

export type DtiBandKey = "excellent" | "good" | "acceptable" | "high" | "severe";

export interface DtiBand {
  key: DtiBandKey;
  label: string;
  /** inclusive upper bound of the band, on the 1-decimal displayed value */
  max: number;
  tone: "success" | "gold" | "destructive";
  meaning: string;
}

export const DTI_BANDS: DtiBand[] = [
  { key: "excellent", label: "Excellent", max: 20.0, tone: "success",
    meaning: "Minimal debt load — lenders see substantial capacity." },
  { key: "good", label: "Good", max: 36.0, tone: "success",
    meaning: "Inside the classic 36% rule — a healthy, financeable position." },
  { key: "acceptable", label: "Acceptable", max: 43.0, tone: "gold",
    meaning: "Above ideal and at the widely used 43% reference line — approvals get selective." },
  { key: "high", label: "High Risk", max: 49.9, tone: "destructive",
    meaning: "Most mainstream approvals are at risk, and consolidation loans get hard to price." },
  { key: "severe", label: "Severe Risk", max: Infinity, tone: "destructive",
    meaning: "Debt payments consume half of gross income or more — hardship-level territory." },
];

/** Round to one decimal (display precision). Banding uses THIS value. */
export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function bandFor(displayedBackEnd: number): DtiBand {
  for (const b of DTI_BANDS) {
    if (displayedBackEnd <= b.max) return b;
  }
  return DTI_BANDS[DTI_BANDS.length - 1];
}

// ─── Lender threshold table (educational reference constants) ────────────────

export interface LenderThreshold {
  key: string;
  label: string;
  front: number | null;   // front-end limit, null = no front-end test
  back: number;           // standard back-end benchmark
  stretchBack: number | null; // ceiling with AUS/compensating factors
  note: string;
}

export const LENDER_THRESHOLDS: LenderThreshold[] = [
  {
    key: "rule2836",
    label: "28/36 rule (classic guideline)",
    front: 28, back: 36, stretchBack: null,
    note: "The decades-old planning benchmark — the healthiest target, not a program limit.",
  },
  {
    key: "conventional",
    label: "Conventional (Fannie Mae / Freddie Mac)",
    front: null, back: 45, stretchBack: 50,
    note: "45% is the typical ceiling; automated underwriting (DU / LPA) can approve up to 50% with strong compensating factors.",
  },
  {
    key: "fha",
    label: "FHA",
    front: 31, back: 43, stretchBack: 56.9,
    note: "Manual benchmarks are 31/43; with TOTAL Scorecard approval and compensating factors, ceilings extend to 46.9/56.9 — the most DTI-tolerant mainstream program.",
  },
  {
    key: "va",
    label: "VA",
    front: null, back: 41, stretchBack: null,
    note: "41% is a guideline, not a cap — VA approval hinges on residual income; higher DTI is routinely approved when residual income exceeds the regional table by 20%+.",
  },
  {
    key: "personal",
    label: "Personal loans (typical lender practice)",
    front: null, back: 40, stretchBack: 50,
    note: "Best pricing usually lands below ~36%; many lenders cut off between 40% and 50%. A practice range, not a rule.",
  },
];

export type ThresholdStatus = "pass" | "borderline" | "above";

export interface ThresholdRow extends LenderThreshold {
  status: ThresholdStatus;
}

function thresholdStatus(
  t: LenderThreshold,
  front: number | null,
  back: number
): ThresholdStatus {
  const frontOk = t.front === null || front === null || front <= t.front;
  if (back <= t.back && frontOk) return "pass";
  const ceiling = t.stretchBack ?? t.back;
  if (back <= ceiling) return "borderline";
  return "above";
}

// ─── Gap analysis (directional rounding) ──────────────────────────────────────

export interface GapTarget {
  target: number;            // e.g. 36, 43, 45
  maxTotalDebt: number;      // GMI × T/100, floored (never overstate capacity)
  headroom: number | null;   // ≥0 dollars available, floored; null if over
  reductionNeeded: number | null; // >0 dollars to cut, ceiled; null if under
  extraIncomeNeeded: number | null; // gross $/mo to add instead, ceiled
}

export const GAP_TARGETS_CURRENT = [36, 43] as const;
export const GAP_TARGETS_MORTGAGE = [36, 43, 45] as const;

function gapFor(target: number, gmi: number, totalDebt: number): GapTarget {
  const maxTotalDebt = Math.floor((gmi * target) / 100);
  const roomRaw = (gmi * target) / 100 - totalDebt;
  if (roomRaw >= 0) {
    return {
      target,
      maxTotalDebt,
      headroom: Math.floor(roomRaw),
      reductionNeeded: null,
      extraIncomeNeeded: null,
    };
  }
  const incomeNeeded = (totalDebt * 100) / target;
  return {
    target,
    maxTotalDebt,
    headroom: null,
    reductionNeeded: Math.ceil(-roomRaw),
    extraIncomeNeeded: Math.ceil(Math.max(0, incomeNeeded - gmi)),
  };
}

// ─── Mortgage readiness (Mode B) ──────────────────────────────────────────────

export type MortgageReadiness =
  | "ready-conventional"
  | "possible-with-factors"
  | "fha-aus-path"
  | "not-yet";

export interface ReadinessResult {
  key: MortgageReadiness;
  label: string;
  summary: string;
}

function mortgageReadiness(back: number, reduceTo45: number | null): ReadinessResult {
  if (back <= 45) {
    return {
      key: "ready-conventional",
      label: "Within conventional guidelines",
      summary:
        "Your back-end DTI is at or under the 45% conventional ceiling. DTI is unlikely to be the blocker — credit, assets, and documentation carry the rest of the file.",
    };
  }
  if (back <= 50) {
    return {
      key: "possible-with-factors",
      label: "Possible with compensating factors",
      summary:
        "Between 45% and 50%, conventional approval depends on automated-underwriting strengths (reserves, credit depth, down payment). FHA's expanded ceilings are also in reach.",
    };
  }
  if (back <= 56.9) {
    return {
      key: "fha-aus-path",
      label: "FHA-with-AUS territory",
      summary:
        "Above 50%, conventional is effectively off the table; FHA with TOTAL Scorecard approval (up to 56.9% back-end) is the remaining mainstream path — and it is selective.",
    };
  }
  return {
    key: "not-yet",
    label: "Not yet — DTI is the blocker",
    summary:
      reduceTo45 !== null
        ? `At this ratio, DTI itself blocks mainstream approval. The fastest path: eliminate about $${reduceTo45.toLocaleString("en-US")} of monthly debt payments to reach the 45% conventional line.`
        : "At this ratio, DTI itself blocks mainstream approval. Eliminating monthly debt payments is the fastest lever.",
  };
}

// ─── Recommendation engine ────────────────────────────────────────────────────

export type DtiRecommendation = "debt-relief" | "compare-options" | "payoff-plan" | "healthy";

export interface RecommendationResult {
  key: DtiRecommendation;
  label: string;
  note: string;
  href: string;
}

function recommend(bandKey: DtiBandKey, mode: DtiMode, back: number): RecommendationResult {
  if (bandKey === "severe") {
    return {
      key: "debt-relief",
      label: "Talk through debt relief options",
      note:
        "At 50%+ DTI, payoff strategies alone rarely move the number fast enough. Settlement or a structured relief plan can eliminate whole monthly payments — which is exactly what this ratio needs.",
      href: "/debt-relief",
    };
  }
  if (bandKey === "high") {
    return {
      key: "compare-options",
      label: "Compare settlement vs. consolidation",
      note:
        mode === "mortgage"
          ? "This is the DTI pattern that blocks refinances. Deleting a payment via settlement moves DTI faster than shrinking balances — see the honest comparison before deciding."
          : "In the 43–50% range, the right move depends on whether your accounts are current. Compare consolidation and settlement side by side before applying anywhere.",
      href: "/debt-settlement-vs-debt-consolidation",
    };
  }
  if (bandKey === "acceptable") {
    return {
      key: "payoff-plan",
      label: "Accelerate with a payoff plan",
      note:
        "You're above the ideal 36% line but well inside workable territory. A focused Snowball/Avalanche plan — even $50/month extra — pulls this ratio down steadily.",
      href: "/financial-tools/debt-payoff-calculator",
    };
  }
  return {
    key: "healthy",
    label: "Your ratio is in good shape",
    note:
      "No action needed on DTI. Lenders will still weigh credit history, assets, and documentation — but capacity isn't your problem.",
    href: "/financial-tools",
  };
}

// ─── Results ──────────────────────────────────────────────────────────────────

export interface DtiWarning {
  message: string;
}

export interface DtiResult {
  ok: true;
  mode: DtiMode;
  gmi: number;                    // gross monthly income used
  housingUsed: number;            // H_used per mode
  otherDebtSum: number;
  totalMonthlyDebt: number;       // housingUsed + otherDebtSum
  frontEnd: number;               // displayed value (1 dp)
  backEnd: number;                // displayed value (1 dp)
  frontEndAvailable: boolean;     // false when housingUsed = 0 in Mode A
  band: DtiBand;
  thresholds: ThresholdRow[];
  gaps: GapTarget[];
  readiness: ReadinessResult | null; // Mode B only
  recommendation: RecommendationResult;
  allocation: { housingPct: number; otherPct: number; remainingPct: number };
  warnings: DtiWarning[];
  overCap: boolean;               // backEnd > meter cap (display "60%+" pin)
}

export interface DtiEmpty {
  ok: false;
  reason: string;
}

export type DtiOutput = DtiResult | DtiEmpty;

export const METER_CAP = 60;

// ─── Core computation ─────────────────────────────────────────────────────────

export function toMonthly(amount: number, period: IncomePeriod): number {
  return period === "annual" ? amount / 12 : amount;
}

export function computeDti(i: DtiInputs): DtiOutput {
  const gmi = toMonthly(i.grossIncome, i.incomePeriod) + toMonthly(i.coBorrowerIncome, i.incomePeriod);
  if (!(gmi > 0)) {
    return { ok: false, reason: "Enter your gross income — pre-tax, before deductions." };
  }
  if (i.mode === "mortgage" && !(i.proposedHousing > 0)) {
    return { ok: false, reason: "Enter the proposed monthly payment to check qualification." };
  }
  if (i.mode === "current" && i.housingStatus !== "none" && !(i.currentHousing >= 0)) {
    return { ok: false, reason: "Enter your monthly housing payment." };
  }

  const housingUsed =
    i.mode === "mortgage"
      ? i.proposedHousing
      : i.housingStatus === "none"
        ? 0
        : i.currentHousing;

  const d = i.debts;
  const otherDebtSum = d.auto + d.student + d.cards + d.personal + d.support + d.other;
  const totalMonthlyDebt = housingUsed + otherDebtSum;

  const frontRaw = (housingUsed / gmi) * 100;
  const backRaw = (totalMonthlyDebt / gmi) * 100;
  const frontEnd = round1(frontRaw);
  const backEnd = round1(backRaw);
  const band = bandFor(backEnd);

  const frontForStatus = housingUsed > 0 || i.mode === "mortgage" ? frontEnd : null;
  const thresholds: ThresholdRow[] = LENDER_THRESHOLDS.map((t) => ({
    ...t,
    status: thresholdStatus(t, frontForStatus, backEnd),
  }));

  const targets = i.mode === "mortgage" ? GAP_TARGETS_MORTGAGE : GAP_TARGETS_CURRENT;
  const gaps = targets.map((t) => gapFor(t, gmi, totalMonthlyDebt));

  const gap45 = gaps.find((g) => g.target === 45) ?? null;
  const readiness =
    i.mode === "mortgage"
      ? mortgageReadiness(backEnd, gap45 ? gap45.reductionNeeded : null)
      : null;

  const recommendation = recommend(band.key, i.mode, backEnd);

  // Income allocation — one-decimal shares; remaining is the residual so
  // the three segments sum to exactly 100.0 (spec §3 rounding contract).
  const housingPct = round1((housingUsed / gmi) * 100);
  const otherPct = round1((otherDebtSum / gmi) * 100);
  const remainingPct = Math.max(0, round1(100 - housingPct - otherPct));

  // Soft warnings (never block computation).
  const warnings: DtiWarning[] = [];
  if (gmi > 1_000_000) {
    warnings.push({ message: "That income is over $1,000,000/month — double-check the Monthly/Annual toggle." });
  }
  const debtValues = [d.auto, d.student, d.cards, d.personal, d.support, d.other, housingUsed];
  if (debtValues.some((v) => v > gmi * 10)) {
    warnings.push({ message: "One of your payments is more than 10× your monthly income — double-check for a typo." });
  }
  if (totalMonthlyDebt === 0) {
    warnings.push({ message: "A 0% DTI is excellent capacity — lenders will still verify income, credit, and history." });
  }
  if (i.mode === "current" && i.housingStatus === "none") {
    warnings.push({ message: "No housing cost included — your front-end ratio reads 0% by definition." });
  }

  return {
    ok: true,
    mode: i.mode,
    gmi,
    housingUsed,
    otherDebtSum,
    totalMonthlyDebt,
    frontEnd,
    backEnd,
    frontEndAvailable: housingUsed > 0 || i.mode === "mortgage",
    band,
    thresholds,
    gaps,
    readiness,
    recommendation,
    allocation: { housingPct, otherPct, remainingPct },
    warnings,
    overCap: backEnd > METER_CAP,
  };
}

// ─── What-if analysis ─────────────────────────────────────────────────────────
// Pure helpers the UI calls with hypothetical deltas; instant by design.

export interface WhatIfResult {
  backEnd: number;
  band: DtiBand;
  delta: number; // percentage-point change vs. base (negative = improvement)
}

/** What if a monthly debt payment of `monthlyPayment` disappeared entirely? */
export function whatIfRemovePayment(base: DtiResult, monthlyPayment: number): WhatIfResult {
  const newTotal = Math.max(0, base.totalMonthlyDebt - monthlyPayment);
  const backEnd = round1((newTotal / base.gmi) * 100);
  return { backEnd, band: bandFor(backEnd), delta: round1(backEnd - base.backEnd) };
}

/** What if gross monthly income increased by `extraMonthlyIncome`? */
export function whatIfAddIncome(base: DtiResult, extraMonthlyIncome: number): WhatIfResult {
  const gmi = base.gmi + Math.max(0, extraMonthlyIncome);
  const backEnd = round1((base.totalMonthlyDebt / gmi) * 100);
  return { backEnd, band: bandFor(backEnd), delta: round1(backEnd - base.backEnd) };
}

/** Mode B: what if the proposed housing payment were `newProposed` instead? */
export function whatIfProposedPayment(base: DtiResult, newProposed: number): WhatIfResult {
  const newTotal = base.otherDebtSum + Math.max(0, newProposed);
  const backEnd = round1((newTotal / base.gmi) * 100);
  return { backEnd, band: bandFor(backEnd), delta: round1(backEnd - base.backEnd) };
}

// ─── UI option lists (co-located with the engine, platform pattern) ──────────

export const HOUSING_STATUS_OPTIONS: { value: HousingStatus; label: string }[] = [
  { value: "rent", label: "I rent" },
  { value: "own-mortgage", label: "I own with a mortgage" },
  { value: "own-clear", label: "I own free and clear" },
  { value: "none", label: "No housing cost (living with family)" },
];

export const INCOME_PERIOD_OPTIONS: { value: IncomePeriod; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "annual", label: "Annual" },
];
