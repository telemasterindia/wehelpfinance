// src/lib/wizards/consumerRightsWizard.ts
//
// Consumer Rights & Debt Options Wizard engine — Sprint 10.
//
// Pure functions only: an adaptive step definition consumed by the
// reusable DecisionStepper, plus a guidance builder that turns answers
// into an EDUCATIONAL summary — situation, general consumer-rights
// education, ranked options, suggested tools, relevant future
// documents, next steps, and an action checklist.
//
// Platform reuse (no duplicated logic):
//   • DTI ................ round1/bandFor (Sprint 3 engine, as required)
//   • credit bands ....... CREDIT_BAND_OPTIONS (Sprint 4)
//   • business rules ..... REFI_CREDIT_BANDS (~640+, Sprint 5.1) and
//                          SETTLEMENT_MIN_DEBT (Sprint 4)
//   • states ............. US_STATES (Sprint 2 module)
//   • formatting ......... fmtUSD/round2 (Sprint 1)
//
// LEGAL POSTURE — enforced in every string:
//   General educational information about widely applicable federal
//   consumer-protection frameworks (FDCPA, FCRA, TCPA awareness) and
//   qualitative notes that state laws differ. NEVER legal advice,
//   NEVER state-specific legal figures, NEVER outcome or qualification
//   promises, NEVER discouragement. Banned-language conventions from
//   the calculator platform apply here too.

import { round1, bandFor, type DtiBand } from "@/lib/calculators/dti";
import { round2, fmtUSD } from "@/lib/calculators/debtPayoff";
import { CREDIT_BAND_OPTIONS, SETTLEMENT_MIN_DEBT, type CreditBand } from "@/lib/calculators/debtSolutions";
import { REFI_CREDIT_BANDS } from "@/lib/calculators/personalLoan";
import { US_STATES } from "@/lib/calculators/usStates";

export { CREDIT_BAND_OPTIONS, REFI_CREDIT_BANDS, SETTLEMENT_MIN_DEBT };
export type { CreditBand };

// ─── Answer model ────────────────────────────────────────────────────────────

export type DebtType =
  | "credit-card"
  | "personal-loan"
  | "medical"
  | "collection"
  | "charge-off"
  | "judgment"
  | "student-loan";

export type DebtStatus = "current" | "30" | "60" | "90" | "collections" | "lawsuit";

export type WizardGoal =
  | "stop-calls"
  | "reduce-payments"
  | "avoid-lawsuit"
  | "improve-credit"
  | "qualify-mortgage"
  | "debt-free"
  | "reduce-stress";

export const DEBT_TYPE_OPTIONS: { value: DebtType; label: string }[] = [
  { value: "credit-card", label: "Credit card debt" },
  { value: "personal-loan", label: "Personal loan" },
  { value: "medical", label: "Medical debt" },
  { value: "collection", label: "Collection account" },
  { value: "charge-off", label: "Charge-off" },
  { value: "judgment", label: "Court judgment" },
  { value: "student-loan", label: "Student loan" },
];

export const STATUS_OPTIONS: { value: DebtStatus; label: string }[] = [
  { value: "current", label: "Current — all payments on time" },
  { value: "30", label: "About 30 days behind" },
  { value: "60", label: "About 60 days behind" },
  { value: "90", label: "90+ days behind" },
  { value: "collections", label: "In collections" },
  { value: "lawsuit", label: "Sued / court papers received" },
];

export const GOAL_OPTIONS: { value: WizardGoal; label: string }[] = [
  { value: "stop-calls", label: "Stop collection calls" },
  { value: "reduce-payments", label: "Reduce my payments" },
  { value: "avoid-lawsuit", label: "Avoid a lawsuit" },
  { value: "improve-credit", label: "Improve my credit" },
  { value: "qualify-mortgage", label: "Qualify for a mortgage" },
  { value: "debt-free", label: "Become debt-free" },
  { value: "reduce-stress", label: "Reduce financial stress" },
];

export const INCOME_RANGE_OPTIONS: { value: string; label: string; midpoint: number }[] = [
  { value: "under-2500", label: "Under $2,500 / month", midpoint: 2000 },
  { value: "2500-4000", label: "$2,500 – $4,000 / month", midpoint: 3250 },
  { value: "4000-6000", label: "$4,000 – $6,000 / month", midpoint: 5000 },
  { value: "6000-8500", label: "$6,000 – $8,500 / month", midpoint: 7250 },
  { value: "8500-plus", label: "Over $8,500 / month", midpoint: 10000 },
];

/** All answers are strings (DecisionStepper contract); engine parses. */
export type WizardAnswers = Record<string, string>;

// ─── Adaptive step definitions (consumed by DecisionStepper) ─────────────────

export interface StepOption {
  value: string;
  label: string;
  hint?: string;
}

export interface WizardStep {
  id: string;
  title: string;
  help?: string;
  kind: "choice" | "select" | "money";
  options?: StepOption[];
  prefix?: string;
  placeholder?: string;
  /** step is shown only when this returns true (adaptive flow) */
  visible?: (a: WizardAnswers) => boolean;
}

const collectionContext = (a: WizardAnswers) =>
  a.status === "collections" ||
  a.status === "lawsuit" ||
  a.debtType === "collection" ||
  a.debtType === "charge-off" ||
  a.debtType === "judgment";

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: "state",
    title: "Which state do you live in?",
    help: "Consumer-protection specifics vary by state — this keeps the education relevant. Nothing you enter is saved or sent anywhere.",
    kind: "select",
    options: US_STATES.map((s) => ({ value: s.code, label: s.name })),
  },
  {
    id: "debtType",
    title: "What kind of debt is on your mind most?",
    help: "Pick the one causing the most pressure — the guidance adapts to it.",
    kind: "choice",
    options: DEBT_TYPE_OPTIONS,
  },
  {
    id: "status",
    title: "Where does that debt stand today?",
    kind: "choice",
    options: STATUS_OPTIONS,
  },
  {
    id: "collectorContact",
    title: "Has a debt collector contacted you about it?",
    help: "Calls, letters, texts, or emails from a collection agency or debt buyer — not the original lender.",
    kind: "choice",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
    visible: collectionContext,
  },
  {
    id: "validationNotice",
    title: "Did you receive a written validation notice?",
    help: "Collectors are generally required to send written details about the debt — amount, creditor, and your dispute rights — shortly after first contact.",
    kind: "choice",
    options: [
      { value: "yes", label: "Yes, I received one" },
      { value: "no", label: "No / not that I know of" },
      { value: "unsure", label: "I'm not sure" },
    ],
    visible: (a) => collectionContext(a) && a.collectorContact === "yes",
  },
  {
    id: "homeowner",
    title: "Do you own a home?",
    kind: "choice",
    options: [
      { value: "no", label: "No" },
      { value: "yes", label: "Yes" },
    ],
  },
  {
    id: "creditBand",
    title: "What's your credit score range?",
    help: "Your best guess is fine — this stays on this page.",
    kind: "choice",
    options: CREDIT_BAND_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
  },
  {
    id: "monthlyDebt",
    title: "About how much do you pay toward debts each month?",
    help: "All minimum payments combined — an estimate is fine.",
    kind: "money",
    prefix: "$",
    placeholder: "560",
  },
  {
    id: "incomeRange",
    title: "Which range fits your gross monthly income?",
    help: "Used only to estimate your debt-to-income ratio on this page.",
    kind: "choice",
    options: INCOME_RANGE_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
  },
  {
    id: "goal",
    title: "What matters most to you right now?",
    kind: "choice",
    options: GOAL_OPTIONS,
  },
];

export function visibleSteps(a: WizardAnswers): WizardStep[] {
  return WIZARD_STEPS.filter((s) => (s.visible ? s.visible(a) : true));
}

export function stepAnswered(step: WizardStep, a: WizardAnswers): boolean {
  const v = (a[step.id] ?? "").trim();
  if (step.kind === "money") {
    const stripped = v.replace(/[^0-9.]/g, "");
    const n = Number(stripped);
    return stripped !== "" && Number.isFinite(n) && n >= 0;
  }
  return v !== "";
}

// ─── Guidance output model ───────────────────────────────────────────────────

export interface GuidanceItem {
  title: string;
  detail: string;
}

export interface ToolSuggestion {
  name: string;
  href: string;
  why: string;
}

export interface DocumentSuggestion {
  name: string;
  why: string;
}

export interface GuidanceResult {
  ok: true;
  stateName: string;
  debtTypeLabel: string;
  statusLabel: string;
  goalLabel: string;
  dti: number;
  dtiBand: DtiBand;
  monthlyDebt: number;
  incomeMidpoint: number;
  situation: string[];             // plain-English summary bullets
  rights: GuidanceItem[];          // educational rights overview
  guidance: GuidanceItem[];        // educational guidance
  options: GuidanceItem[];         // ranked financial options (≥2, why for each)
  tools: ToolSuggestion[];         // ranked tool suggestions (why + href)
  documents: DocumentSuggestion[]; // situation-relevant future documents
  nextSteps: string[];
  checklist: string[];
  assumptions: string[];
}

export interface GuidanceError {
  ok: false;
  reason: string;
}

export type GuidanceOutput = GuidanceResult | GuidanceError;

// ─── Document catalog (Document Center — future tools) ───────────────────────

export const DOCUMENT_CATALOG: { name: string; blurb: string }[] = [
  { name: "Debt Validation Letter", blurb: "Ask a collector for written proof of a debt within the federal dispute window." },
  { name: "Collection Dispute Letter", blurb: "Dispute a debt you don't recognize or believe is inaccurate." },
  { name: "Creditor Hardship Letter", blurb: "Explain a temporary hardship and request modified terms from an original creditor." },
  { name: "Debt Settlement Offer Letter", blurb: "Put a lump-sum or structured settlement offer in writing." },
  { name: "Settlement Confirmation Letter", blurb: "Confirm agreed settlement terms in writing before paying." },
  { name: "Paid-in-Full Confirmation Letter", blurb: "Request written confirmation that a balance is fully resolved." },
  { name: "Goodwill Letter", blurb: "Ask a creditor to remove a late mark after the account is brought current." },
  { name: "Pay-for-Delete Letter", blurb: "Propose payment in exchange for removing a collection tradeline." },
  { name: "Mortgage Hardship Letter", blurb: "Explain hardship to a mortgage servicer when exploring assistance options." },
  { name: "Loan Modification Letter", blurb: "Request a review of modified loan terms with supporting context." },
  { name: "Income Verification Letter", blurb: "Summarize income sources for creditors, servicers, or programs." },
  { name: "Medical Debt Letter", blurb: "Request itemized bills, billing review, or financial-assistance screening." },
  { name: "Late Payment Explanation Letter", blurb: "Provide context for a past late payment to a lender or underwriter." },
];

// ─── Guidance builder ────────────────────────────────────────────────────────

export function calculateGuidance(a: WizardAnswers): GuidanceOutput {
  const missing = visibleSteps(a).find((s) => !stepAnswered(s, a));
  if (missing) return { ok: false, reason: `Answer "${missing.title}" to continue.` };

  const stateName = US_STATES.find((s) => s.code === a.state)?.name ?? a.state;
  const debtType = a.debtType as DebtType;
  const status = a.status as DebtStatus;
  const goal = a.goal as WizardGoal;
  const creditBand = a.creditBand as CreditBand;
  const homeowner = a.homeowner === "yes";
  const collectorContact = a.collectorContact === "yes";
  const validation = a.validationNotice ?? "";

  const monthlyDebt = round2(Number((a.monthlyDebt ?? "0").replace(/[^0-9.]/g, "")) || 0);
  const income = INCOME_RANGE_OPTIONS.find((o) => o.value === a.incomeRange)?.midpoint ?? 5000;
  const dti = round1((monthlyDebt / income) * 100);
  const dtiBand = bandFor(dti);

  const debtTypeLabel = DEBT_TYPE_OPTIONS.find((o) => o.value === debtType)?.label ?? debtType;
  const statusLabel = STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
  const goalLabel = GOAL_OPTIONS.find((o) => o.value === goal)?.label ?? goal;
  const creditLabel = CREDIT_BAND_OPTIONS.find((o) => o.value === creditBand)?.label ?? creditBand;

  const delinquent = status !== "current";
  const seriouslyDelinquent = status === "90" || status === "collections" || status === "lawsuit";
  const inCollections = status === "collections" || status === "lawsuit" || debtType === "collection" || debtType === "charge-off" || debtType === "judgment";

  const assumptions: string[] = [
    "Everything on this page is general consumer education, not legal advice, and not a substitute for a licensed attorney in your state. No outcome, approval, or result is promised.",
    `Your estimated DTI uses the midpoint of the income range you selected (${fmtUSD(income)}/mo) with the same rounding and bands as the WeHelpFinance DTI Calculator — run it with your exact income for a precise figure.`,
    "Consumer-protection specifics — including how long debts are legally collectible and what income or property is protected — differ by state. Where this page mentions state law, it does so qualitatively on purpose.",
  ];

  // ── Situation summary ──
  const situation: string[] = [
    `You're focused on ${debtTypeLabel.toLowerCase()} in ${stateName}, currently: ${statusLabel.toLowerCase()}.`,
    `Estimated debt-to-income: about ${dti.toFixed(1)}% (${dtiBand.label}) based on ${fmtUSD(monthlyDebt)}/mo in payments against the income range you selected.`,
    homeowner
      ? `You own a home — that adds refinance-related options and also means home-related decisions deserve extra care.`
      : `You rent — housing isn't entangled with this debt, which keeps the option set simpler.`,
    `Credit range: ${creditLabel}. Goal: ${goalLabel.toLowerCase()}.`,
    collectorContact
      ? validation === "yes"
        ? "A collector has contacted you and you have a written validation notice — that document is worth keeping."
        : "A collector has contacted you and you don't have (or aren't sure about) a written validation notice — that's a meaningful detail covered below."
      : inCollections
        ? "No collector contact yet — a good moment to get organized before the phone rings."
        : "No collection activity — the earlier the stage, the more options stay open.",
  ];

  // ── Rights education (situation-keyed, always general) ──
  const rights: GuidanceItem[] = [];
  if (inCollections || collectorContact) {
    rights.push({
      title: "Debt collectors are regulated by federal law",
      detail:
        "The federal Fair Debt Collection Practices Act (FDCPA) generally applies to third-party collectors and debt buyers: no harassment or threats, no calls at unreasonable hours (generally before 8 a.m. or after 9 p.m. your time), no lies about who they are or what you owe, and no discussing your debt with most other people.",
    });
    rights.push({
      title: "You can generally request written validation",
      detail:
        "Collectors are generally required to provide written information about the debt — the amount, the creditor's name, and your dispute rights. If you dispute in writing within the federal window (generally 30 days from that notice), collection activity on the disputed debt generally must pause until the collector responds with verification.",
    });
    rights.push({
      title: "You can generally tell a collector how — or whether — to contact you",
      detail:
        "Federal rules generally let you limit contact channels (for example, no workplace calls) and even request that contact stop, in writing. Stopping contact doesn't erase a valid debt — the account and any legal options a collector has still exist — but the phone pressure is something you have real say over.",
    });
  }
  rights.push({
    title: "Credit reporting has rules too",
    detail:
      "Under the federal Fair Credit Reporting Act (FCRA), you can dispute information you believe is inaccurate with the credit bureaus, and furnishers generally must investigate. Most negative items generally age off reports after around seven years — and recent reporting-industry changes have removed many paid medical collections and small medical balances entirely.",
  });
  if (status === "lawsuit" || debtType === "judgment") {
    rights.push({
      title: "Court papers deserve a response — never silence",
      detail:
        "If you're sued over a debt, ignoring it is the one move that reliably makes things worse: missing the response deadline typically leads to a default judgment. Deadlines and procedures vary by state and court. This is exactly the moment general education stops being enough — a consumer attorney or your state's legal-aid program can review your specific papers, and many offer free consultations.",
    });
  }
  if (debtType === "judgment") {
    rights.push({
      title: "Even after a judgment, state law draws lines",
      detail:
        "What a judgment creditor can collect — and what income and property are protected — varies significantly by state. Certain income sources (for example, Social Security benefits) carry strong federal protections, and every state exempts some property. The qualitative point: a judgment changes the situation, but it does not remove all of your protections.",
    });
  }
  if (debtType === "charge-off" || debtType === "collection") {
    rights.push({
      title: "Old debts have time limits — and traps",
      detail:
        "Every state limits how long a creditor can sue over a debt (commonly somewhere in the range of three to ten years, varying by state and debt type). A charge-off doesn't erase what's owed, and time-barred debt can sometimes still be requested — but in some states, a partial payment or written acknowledgment can restart that clock. Before paying anything on an old debt, understanding its age and status in your state matters.",
    });
  }
  if (debtType === "medical") {
    rights.push({
      title: "Medical debt has its own protections",
      detail:
        "Federal rules limit many surprise out-of-network bills, nonprofit hospitals are generally required to maintain financial-assistance policies you can apply to, and you can always request an itemized bill — billing errors are common enough that reviewing one is standard advice, not paranoia.",
    });
  }
  if (debtType === "student-loan") {
    rights.push({
      title: "Federal and private student loans follow different rules",
      detail:
        "Federal loans carry program options private loans don't — income-driven repayment, deferment, forbearance, and specific paths back to good standing after default. Private student loans are closer to ordinary consumer debt. Knowing which kind you hold is the first branch in every student-loan decision.",
    });
  }

  // ── Educational guidance ──
  const guidance: GuidanceItem[] = [];
  if (seriouslyDelinquent) {
    guidance.push({
      title: "Paper beats phone from here on",
      detail:
        "At this stage, keep everything in writing: letters, dates, amounts, names. A simple folder — physical or digital — of every notice and response is the single most useful habit for the months ahead, whatever path you choose.",
    });
  }
  if (delinquent && status !== "lawsuit") {
    guidance.push({
      title: "The earlier the stage, the more doors are open",
      detail:
        "Hardship plans, catch-up arrangements, and interest concessions are most available before an account charges off (typically around 180 days). If any account is 30–90 days behind, a direct conversation with the creditor about hardship options is usually worth having before anything else.",
    });
  }
  guidance.push({
    title: "Your DTI is the number most doors check",
    detail: `At roughly ${dti.toFixed(1)}%, your debt payments sit in the "${dtiBand.label}" band. Lenders weigh this ratio alongside credit for nearly everything — and unlike a credit score, it moves the same month you remove a payment.`,
  });
  if (goal === "improve-credit" || goal === "qualify-mortgage") {
    guidance.push({
      title: "Credit rebuilds from behavior, on a schedule",
      detail:
        "Payment history and utilization drive most of a credit score. Getting and staying current, letting balances fall, and disputing genuine inaccuracies is the whole playbook — no purchased product changes the math. Recent negatives fade in impact well before they fall off entirely.",
    });
  }
  guidance.push({
    title: "Watch for the patterns that mark debt-relief scams",
    detail:
      "Large upfront fees before any service, guarantees of specific results, instructions to stop all communication with creditors, or pressure to decide today — each is a recognized warning sign. Legitimate settlement providers, for example, can generally only collect fees after a debt actually settles.",
  });

  // ── Ranked options (shared recommendation pattern + constants) ──
  const scored: { item: GuidanceItem; score: number }[] = [];
  const creditEligible = REFI_CREDIT_BANDS.has(creditBand);

  if (delinquent) {
    scored.push({
      score: seriouslyDelinquent ? 66 : 58,
      item: {
        title: "Hardship or catch-up arrangement with the creditor",
        detail:
          "Original creditors often have hardship programs — reduced interest, paused payments, structured catch-up — especially before charge-off. It costs nothing to ask, protects payment history fastest, and keeps every later option open.",
      },
    });
  }
  if (monthlyDebt > 0 && seriouslyDelinquent) {
    scored.push({
      score: 60,
      item: {
        title: "Debt settlement (eligible unsecured debt)",
        detail: `Could fit when full repayment isn't realistic — providers negotiate eligible unsecured balances for less than owed. Programs generally start around ${fmtUSD(SETTLEMENT_MIN_DEBT)} of enrolled debt, typically require delinquency, affect credit significantly while underway, and fees are collectible only after each account settles. The Settlement Calculator models deposits, timeline, and cost for your numbers.`,
      },
    });
  }
  if (creditEligible && dti > 36 && dti <= 50 && monthlyDebt > 0 && !seriouslyDelinquent) {
    scored.push({
      score: 55,
      item: {
        title: "Personal-loan consolidation",
        detail:
          "Your credit range sits where consolidation loans commonly price below card rates — one fixed payment replacing several can lower DTI and simplify the month. The Personal Loan Calculator shows the payment, total cost, and DTI effect before any application.",
      },
    });
  }
  if (dti > 40 && dti <= 55 && !seriouslyDelinquent && monthlyDebt > 0) {
    scored.push({
      score: 46,
      item: {
        title: "Debt management plan (nonprofit credit counseling)",
        detail:
          "A nonprofit agency can often reduce card APRs and combine payments into one — no new loan, no approval hurdle — steadily improving DTI and payment history together.",
      },
    });
  }
  if (homeowner && creditEligible) {
    scored.push({
      score: dti > 43 ? 44 : 50,
      item: {
        title: "Mortgage refinance review",
        detail:
          dti > 43
            ? "You own a home in the typical refinance credit zone, but lenders weigh BOTH credit and DTI — reducing monthly debt obligations first may increase future refinance opportunities. The Refinance Calculator shows both sides of that math."
            : "You own a home in the typical refinance credit zone — freed mortgage dollars strengthen every other option here. The Refinance Calculator includes break-even and lifetime-cost math.",
      },
    });
  }
  scored.push({
    score: dti > 43 || goal === "reduce-stress" || goal === "reduce-payments" ? 52 : 38,
    item: {
      title: "A written monthly budget",
      detail:
        "Every path above runs on monthly margin. The Budget Planner maps where the dollars go, scores the plan, and finds the extra payment that accelerates everything else — it's the option that funds the other options.",
    },
  });
  scored.push({
    score: 30,
    item: {
      title: "Structured payoff plan (snowball, avalanche, or hybrid)",
      detail:
        "When repayment is realistic, ordering it deliberately saves real money — the Debt Freedom Planner prices six strategies side by side for your numbers and recommends one for your goal.",
    },
  });
  const options = scored
    .sort((x, y) => y.score - x.score)
    .map((x) => x.item)
    .slice(0, 6);

  // ── Tool suggestions (ranked, why + href) ──
  const T = (name: string, href: string, why: string): ToolSuggestion => ({ name, href, why });
  const toolScored: { t: ToolSuggestion; score: number }[] = [
    { score: 70, t: T("DTI Calculator", "/financial-tools/dti-calculator", "Turn the estimate above into your exact ratio — the number lenders actually apply.") },
    { score: goal === "debt-free" || goal === "reduce-stress" ? 68 : 55, t: T("Debt Freedom Planner", "/financial-tools/debt-freedom-planner", "Six payoff strategies priced side by side with a recommendation for your goal.") },
    { score: seriouslyDelinquent ? 66 : 30, t: T("Debt Settlement Calculator", "/debt-settlement-calculator", "Model settlement deposits, timeline, and total cost transparently for your balance.") },
    { score: goal === "reduce-payments" || dti > 43 ? 62 : 45, t: T("Budget Planner", "/financial-tools/budget-planner", "Find the monthly margin every option runs on — scored, with a what-if simulator.") },
    { score: creditEligible && !seriouslyDelinquent ? 58 : 25, t: T("Personal Loan Calculator", "/financial-tools/personal-loan-calculator", "See consolidation payments, total cost, and the DTI effect before applying anywhere.") },
    { score: homeowner && creditEligible ? 56 : 15, t: T("Mortgage Refinance Calculator", "/financial-tools/mortgage-refinance-calculator", "Break-even, lifetime cost, and DTI impact — including when staying put wins.") },
    { score: 50, t: T("Financial Health Score", "/financial-tools/financial-health-score", "One 0–100 view of the whole picture — cushion, debt, credit, history — with its own plan.") },
    { score: goal === "debt-free" ? 52 : 40, t: T("Debt Payoff Calculator", "/financial-tools/debt-payoff-calculator", "Execute the chosen strategy with your exact balances, month by month.") },
    { score: 35, t: T("Debt Solutions Comparison", "/financial-tools/debt-solutions-comparison", "Five relief paths compared with one engine and one set of assumptions.") },
  ];
  const tools = toolScored.sort((x, y) => y.score - x.score).slice(0, 6).map((x) => x.t);

  // ── Relevant future documents ──
  const documents: DocumentSuggestion[] = [];
  const D = (name: string, why: string) => documents.push({ name, why });
  if (collectorContact && validation !== "yes")
    D("Debt Validation Letter", "You've had collector contact without a validation notice in hand — requesting written validation is the standard first move.");
  if (inCollections) D("Collection Dispute Letter", "If any detail of the debt looks wrong, a written dispute triggers the verification process.");
  if (delinquent && !seriouslyDelinquent) D("Creditor Hardship Letter", "At 30–90 days behind, a written hardship request often unlocks programs a phone call doesn't.");
  if (seriouslyDelinquent && monthlyDebt > 0) {
    D("Debt Settlement Offer Letter", "If you pursue settlement, offers and terms belong in writing before any payment.");
    D("Settlement Confirmation Letter", "Never pay a settlement without the agreed terms confirmed in writing first.");
  }
  if (goal === "improve-credit" || goal === "qualify-mortgage") {
    D("Goodwill Letter", "After bringing an account current, a goodwill request is the polite long-shot for removing a late mark.");
    D("Late Payment Explanation Letter", "Underwriters read context — a clear written explanation helps future applications.");
  }
  if (debtType === "collection" && (goal === "improve-credit" || goal === "qualify-mortgage"))
    D("Pay-for-Delete Letter", "When resolving a collection, some consumers propose payment in exchange for tradeline removal — always in writing.");
  if (homeowner && delinquent) D("Mortgage Hardship Letter", "Homeowners under strain should know servicer assistance exists — the request starts with a hardship letter.");
  if (debtType === "medical") D("Medical Debt Letter", "Itemized-bill requests and financial-assistance screening are standard, and they start in writing.");
  if (documents.length === 0)
    D("Paid-in-Full Confirmation Letter", "Whenever you clear a balance, written confirmation is the receipt your credit file may need later.");

  // ── Next steps + checklist ──
  const nextSteps: string[] = [];
  if (status === "lawsuit")
    nextSteps.push("Read the court papers today and note the response deadline — then contact a consumer attorney or your state legal-aid program about your specific case.");
  if (collectorContact && validation !== "yes")
    nextSteps.push("Request written validation of the debt before making any payment or promise.");
  if (delinquent && !seriouslyDelinquent)
    nextSteps.push("Call the original creditor and ask specifically about hardship or catch-up programs — write down who you spoke with and what was offered.");
  nextSteps.push("Run your exact numbers through the DTI Calculator, then the tool above that matches your goal.");
  nextSteps.push("Start a single folder — paper or digital — for every notice, letter, and statement about this debt.");
  if (nextSteps.length < 5)
    nextSteps.push("Recheck your Financial Health Score in 60–90 days to see the whole picture move.");

  const checklist: string[] = [
    "I know the exact balance, creditor, and status of each debt.",
    "Every notice and letter is saved in one place.",
    collectorContact ? "I have (or have requested) written validation from any collector." : "If a collector ever contacts me, I'll request written validation first.",
    "I've checked my credit reports for accuracy at the free official source.",
    `I know my real DTI (estimated here: ~${dti.toFixed(1)}%).`,
    "I've compared at least two options before committing to any program.",
    "I understand no legitimate provider guarantees results or demands large upfront fees.",
  ];
  if (status === "lawsuit") checklist.unshift("I know my court response deadline and have sought case-specific help.");

  return {
    ok: true,
    stateName,
    debtTypeLabel,
    statusLabel,
    goalLabel,
    dti,
    dtiBand,
    monthlyDebt,
    incomeMidpoint: income,
    situation,
    rights,
    guidance,
    options,
    tools,
    documents,
    nextSteps: nextSteps.slice(0, 6),
    checklist,
    assumptions,
  };
}

