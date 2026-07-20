// src/components/tools/PersonalLoanCalculator.tsx
//
// Personal Loan Eligibility & Payment Calculator — Sprint 5.
// Client component: inputs left, live results right. Reuses the
// shared platform primitives (ToolField/ToolSelect, StatCard,
// HeroStat/NoticeBox/SoftCTA, DtiMeter, CompareTable, CostBars) and
// is the first consumer of the shared branded report system
// (ToolReportActions).
//
// Analytics: bands and slugs only — never raw dollars (platform
// privacy standard).

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  calculatePersonalLoan,
  validateLoanInputs,
  APR_RANGE_BY_BAND,
  QUALIFICATION_LABELS,
  QUALIFICATION_PHRASING,
  AFFORDABILITY_LABELS,
  TERM_OPTIONS,
  PURPOSE_OPTIONS,
  CREDIT_BAND_OPTIONS,
  DELINQUENCY_OPTIONS,
  EMPLOYMENT_OPTIONS,
  type PersonalLoanInputs,
  type PersonalLoanOutput,
  type CreditBand,
  type DelinquencyStage,
  type EmploymentStatus,
  type LoanPurpose,
  type QualificationBand,
} from "@/lib/calculators/personalLoan";
import { DTI_BANDS, METER_CAP } from "@/lib/calculators/dti";
import {
  fmtUSD,
  fmtMonths,
  parseMoney,
  parseRate,
} from "@/lib/calculators/debtPayoff";
import { US_STATES } from "@/lib/calculators/usStates";
import { trackToolEvent } from "@/lib/calculators/track";
import { ToolField } from "@/components/tools/ToolField";
import { ToolSelect } from "@/components/tools/ToolSelect";
import { StatCard } from "@/components/tools/ToolCharts";
import { CostBars } from "@/components/tools/ComparisonCharts";
import {
  CompareTable,
  type CompareColumn,
  type CompareRow,
} from "@/components/tools/CompareTable";
import { DtiMeter, type MeterZone } from "@/components/tools/DtiMeter";
import { HeroStat, NoticeBox, SoftCTA } from "@/components/tools/ResultBlocks";
import { ToolReportActions } from "@/components/tools/ToolReportActions";
import { reportDateLabel, type ToolReportData } from "@/lib/calculators/report";
import { ChevronDown } from "lucide-react";

const METER_ZONES: MeterZone[] = DTI_BANDS.map((b) => ({
  max: b.max === Infinity ? METER_CAP : b.max,
  label: b.label,
  tone: b.tone,
}));

const HERO_TONE: Record<
  QualificationBand,
  "primary" | "success" | "destructive"
> = {
  excellent: "success",
  "very-good": "success",
  possible: "primary",
  difficult: "primary",
  unlikely: "destructive",
};

const STATE_OPTIONS = US_STATES.map((s) => ({ value: s.code, label: s.name }));

export function PersonalLoanCalculator() {
  // ── Raw input state (strings for text fields, per platform pattern) ──
  const [amountStr, setAmountStr] = useState("15,000");
  const [incomeStr, setIncomeStr] = useState("5,500");
  const [debtPaymentsStr, setDebtPaymentsStr] = useState("850");
  const [creditBand, setCreditBand] = useState<CreditBand>("good");
  const [employment, setEmployment] = useState<EmploymentStatus>("employed");
  const [purpose, setPurpose] = useState<LoanPurpose>("debt-consolidation");
  const [termMonths, setTermMonths] = useState(60);
  const [stateCode, setStateCode] = useState("TX");
  const [homeowner, setHomeowner] = useState<"yes" | "no">("no");
  const [delinquency, setDelinquency] = useState<DelinquencyStage>("current");
  const [showOptional, setShowOptional] = useState(false);
  const [currentAprStr, setCurrentAprStr] = useState("");
  const [currentPaymentStr, setCurrentPaymentStr] = useState("");

  // ── View tracking ──
  useEffect(() => {
    trackToolEvent("calculator_viewed", { tool: "personal_loan" });
  }, []);

  // ── Parse + compute ──
  const inputs: PersonalLoanInputs = useMemo(() => {
    const apr = parseRate(currentAprStr);
    const pay = parseMoney(currentPaymentStr);
    return {
      amount: parseMoney(amountStr),
      creditBand,
      monthlyIncome: parseMoney(incomeStr),
      monthlyDebtPayments: parseMoney(debtPaymentsStr),
      employment,
      purpose,
      termMonths,
      state: stateCode,
      homeowner: homeowner === "yes",
      delinquency,
      currentApr: currentAprStr.trim() === "" ? null : apr / 100,
      currentPayment: currentPaymentStr.trim() === "" ? null : pay,
    };
  }, [
    amountStr,
    incomeStr,
    debtPaymentsStr,
    creditBand,
    employment,
    purpose,
    termMonths,
    stateCode,
    homeowner,
    delinquency,
    currentAprStr,
    currentPaymentStr,
  ]);

  const output: PersonalLoanOutput = useMemo(
    () => calculatePersonalLoan(inputs),
    [inputs],
  );
  const invalidReason = validateLoanInputs(inputs);
  const result = output.ok ? output : null;

  // ── Debounced completion event (bands only, never dollars) ──
  const completeTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!result) return;
    if (completeTimer.current) window.clearTimeout(completeTimer.current);
    completeTimer.current = window.setTimeout(() => {
      trackToolEvent("calculation_completed", {
        tool: "personal_loan",
        qualification: result.qualification,
        dti_band: result.dtiWithLoanBand.key,
        term: termMonths,
        purpose,
        credit_band: creditBand,
      });
    }, 1200);
    return () => {
      if (completeTimer.current) window.clearTimeout(completeTimer.current);
    };
  }, [result, termMonths, purpose, creditBand]);

  function onOptionChange(name: string, apply: () => void) {
    apply();
    trackToolEvent("tool_option_changed", {
      tool: "personal_loan",
      option: name,
    });
  }

  // ── Report data (pre-formatted strings only) ──
  const reportData: ToolReportData | null = useMemo(() => {
    if (!result) return null;
    const r = result;
    const bandLabel =
      CREDIT_BAND_OPTIONS.find((c) => c.value === creditBand)?.label ??
      creditBand;
    return {
      toolSlug: "personal_loan",
      title: "Personal Loan Estimate Report",
      generatedLabel: reportDateLabel(),
      snapshot: [
        { label: "Requested amount", value: fmtUSD(inputs.amount) },
        { label: "Credit range", value: bandLabel },
        { label: "Gross monthly income", value: fmtUSD(inputs.monthlyIncome) },
        {
          label: "Existing monthly debt payments",
          value: fmtUSD(inputs.monthlyDebtPayments),
        },
        { label: "Loan term", value: fmtMonths(termMonths) },
        {
          label: "Purpose",
          value:
            PURPOSE_OPTIONS.find((p) => p.value === purpose)?.label ?? purpose,
        },
      ],
      results: [
        {
          label: "Estimated qualification",
          value: QUALIFICATION_LABELS[r.qualification],
          hint: "Educational band — lenders vary",
        },
        {
          label: "Estimated APR range",
          value: `${(r.aprRange.min * 100).toFixed(1)}% – ${(r.aprRange.max * 100).toFixed(1)}%`,
          hint: `payment math uses ${(r.aprRange.typ * 100).toFixed(1)}% typical`,
        },
        {
          label: "Estimated monthly payment",
          value: fmtUSD(r.paymentTyp),
          hint: `range ${fmtUSD(r.paymentMin)}–${fmtUSD(r.paymentMax)}`,
        },
        {
          label: "Total interest (typical rate)",
          value: fmtUSD(r.totalInterest),
        },
        { label: "Total repayment", value: fmtUSD(r.totalRepaid) },
        { label: "Estimated payoff", value: r.payoffLabel },
        {
          label: "DTI today",
          value: `${r.dtiCurrent.toFixed(1)}%`,
          hint: r.dtiCurrentBand.label,
        },
        {
          label: "DTI after this loan",
          value: `${r.dtiWithLoan.toFixed(1)}%`,
          hint: r.dtiWithLoanBand.label,
        },
      ],
      comparison: {
        caption: "Estimated totals for the amount entered",
        columns: r.comparison.settlementIncluded
          ? ["Continue current payments", "Personal loan", "Debt settlement"]
          : ["Continue current payments", "Personal loan"],
        rows: [
          {
            label: "Monthly payment",
            cells: cells(r, (c) => c.monthly),
          },
          {
            label: "Estimated total cost",
            cells: cells(r, (c) => c.totalCost),
          },
          {
            label: "Credit impact",
            cells: cells(r, (c) => c.creditImpact),
          },
          {
            label: "DTI impact",
            cells: cells(r, (c) => c.dtiImpact),
          },
          {
            label: "Typical approval path",
            cells: cells(r, (c) => c.approval),
          },
        ],
        note: r.comparison.note,
      },
      options: r.options.map((o) => ({ name: o.name, why: o.why })),
      nextSteps: [
        "Compare prequalified offers from at least three lenders — prequalification uses a soft credit check and doesn't affect your score.",
        "Check the APR, origination fee, and total repayment — not just the monthly payment.",
        "If consolidating, keep paid-off accounts open where sensible so your credit utilization improves.",
        "Revisit your DTI with our DTI Calculator after any change to income or payments.",
      ],
      assumptions: r.assumptions,
      methodology: [
        "Monthly payment uses standard amortization at the band's typical APR; the displayed range uses the band's low and high APRs.",
        "DTI uses gross monthly income and follows the same rounding and bands as the WeHelpFinance DTI Calculator.",
        "The settlement column (when shown) reuses the WeHelpFinance Debt Settlement Calculator engine and its disclosed assumptions.",
        "Qualification banding is a transparent point system over credit range, post-loan DTI, employment, payment history, and amount vs. income — factors are listed on the results screen.",
      ],
    };
  }, [result, inputs, creditBand, purpose, termMonths]);

  // ── Comparison table props ──
  const compareColumns: CompareColumn[] = useMemo(() => {
    if (!result) return [];
    const cols: CompareColumn[] = [
      { key: "continue", label: "Continue current payments" },
      {
        key: "loan",
        label: "Personal loan",
        badge: "This estimate",
        highlight: true,
      },
    ];
    if (result.comparison.settlementIncluded)
      cols.push({ key: "settlement", label: "Debt settlement" });
    return cols;
  }, [result]);

  const compareRows: CompareRow[] = useMemo(() => {
    if (!result) return [];
    const r = result;
    return [
      { label: "Monthly payment", values: cells(r, (c) => c.monthly) },
      { label: "Estimated total cost", values: cells(r, (c) => c.totalCost) },
      { label: "Credit impact", values: cells(r, (c) => c.creditImpact) },
      { label: "DTI impact", values: cells(r, (c) => c.dtiImpact) },
      { label: "Typical approval path", values: cells(r, (c) => c.approval) },
    ];
  }, [result]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* ── Inputs ── */}
      <div className="print:hidden">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-xl text-foreground">
            Your loan scenario
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything updates live — nothing is saved or sent anywhere.
          </p>

          <div className="mt-5 space-y-4">
            <ToolField
              id="pl-amount"
              label="Loan amount you're considering"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              prefix="$"
              size="lg"
              placeholder="15,000"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolField
                id="pl-income"
                label="Gross monthly income"
                value={incomeStr}
                onChange={(e) => setIncomeStr(e.target.value)}
                prefix="$"
                placeholder="5,500"
              />
              <ToolField
                id="pl-debt-payments"
                label="Existing monthly debt payments"
                value={debtPaymentsStr}
                onChange={(e) => setDebtPaymentsStr(e.target.value)}
                prefix="$"
                placeholder="850"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolSelect
                id="pl-credit"
                label="Credit score range"
                value={creditBand}
                onChange={(e) =>
                  onOptionChange("credit_band", () =>
                    setCreditBand(e.target.value as CreditBand),
                  )
                }
                options={CREDIT_BAND_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.label,
                }))}
              />
              <ToolSelect
                id="pl-term"
                label="Desired loan term"
                value={String(termMonths)}
                onChange={(e) =>
                  onOptionChange("term", () =>
                    setTermMonths(Number(e.target.value)),
                  )
                }
                options={TERM_OPTIONS.map((o) => ({
                  value: String(o.value),
                  label: o.label,
                }))}
              />
            </div>
            <ToolSelect
              id="pl-purpose"
              label="What's the loan for?"
              value={purpose}
              onChange={(e) =>
                onOptionChange("purpose", () =>
                  setPurpose(e.target.value as LoanPurpose),
                )
              }
              options={PURPOSE_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolSelect
                id="pl-employment"
                label="Employment status"
                value={employment}
                onChange={(e) =>
                  onOptionChange("employment", () =>
                    setEmployment(e.target.value as EmploymentStatus),
                  )
                }
                options={EMPLOYMENT_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.label,
                }))}
              />
              <ToolSelect
                id="pl-delinquency"
                label="Payment status on current debts"
                value={delinquency}
                onChange={(e) =>
                  onOptionChange("delinquency", () =>
                    setDelinquency(e.target.value as DelinquencyStage),
                  )
                }
                options={DELINQUENCY_OPTIONS.map((o) => ({
                  value: o.value,
                  label: o.label,
                }))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolSelect
                id="pl-homeowner"
                label="Do you own a home?"
                value={homeowner}
                onChange={(e) =>
                  onOptionChange("homeowner", () =>
                    setHomeowner(e.target.value as "yes" | "no"),
                  )
                }
                options={[
                  { value: "no", label: "No" },
                  { value: "yes", label: "Yes" },
                ]}
              />
              <ToolSelect
                id="pl-state"
                label="State"
                value={stateCode}
                onChange={(e) =>
                  onOptionChange("state", () => setStateCode(e.target.value))
                }
                options={STATE_OPTIONS}
              />
            </div>

            <div className="rounded-2xl border border-border bg-background">
              <button
                type="button"
                onClick={() => setShowOptional((s) => !s)}
                aria-expanded={showOptional}
                aria-controls="pl-optional"
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-2xl"
              >
                Add your current debt details (optional)
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform motion-reduce:transition-none ${showOptional ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {showOptional && (
                <div
                  id="pl-optional"
                  className="grid gap-4 border-t border-border p-4 sm:grid-cols-2"
                >
                  <ToolField
                    id="pl-current-apr"
                    label="Current APR on that debt"
                    value={currentAprStr}
                    onChange={(e) => setCurrentAprStr(e.target.value)}
                    suffix="%"
                    placeholder="24.9"
                  />
                  <ToolField
                    id="pl-current-payment"
                    label="Current monthly payment on it"
                    value={currentPaymentStr}
                    onChange={(e) => setCurrentPaymentStr(e.target.value)}
                    prefix="$"
                    placeholder="450"
                  />
                  <p className="text-xs text-muted-foreground sm:col-span-2">
                    Sharpens the &ldquo;continue current payments&rdquo;
                    comparison and the after-loan DTI when you&rsquo;re
                    consolidating.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="space-y-5">
        <div aria-live="polite" className="sr-only">
          {result
            ? `Estimated qualification ${QUALIFICATION_LABELS[result.qualification]}. Estimated payment ${fmtUSD(result.paymentTyp)} per month.`
            : (invalidReason ?? "")}
        </div>

        {!result && (
          <NoticeBox tone="neutral">
            {invalidReason ??
              "Enter your loan scenario on the left — results update live."}
          </NoticeBox>
        )}

        {result && (
          <>
            <HeroStat
              eyebrow="Estimated qualification"
              value={QUALIFICATION_LABELS[result.qualification]}
              sub={QUALIFICATION_PHRASING[result.qualification]}
              tone={HERO_TONE[result.qualification]}
            />

            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Estimated APR range"
                value={`${(result.aprRange.min * 100).toFixed(1)}–${(result.aprRange.max * 100).toFixed(1)}%`}
                sub={`payments shown at ${(result.aprRange.typ * 100).toFixed(1)}% typical`}
              />
              <StatCard
                label="Estimated monthly payment"
                value={fmtUSD(result.paymentTyp)}
                sub={`${fmtUSD(result.paymentMin)}–${fmtUSD(result.paymentMax)} across the range`}
                tone="primary"
              />
              <StatCard
                label="Total interest"
                value={fmtUSD(result.totalInterest)}
                sub="at the typical rate"
              />
              <StatCard
                label="Total repayment"
                value={fmtUSD(result.totalRepaid)}
                sub={`paid off ${result.payoffLabel}`}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Educational estimates — actual APRs, payments, and approval are
              set by each lender&rsquo;s underwriting, never by this tool.
            </p>

            {result.paymentDelta !== null && (
              <NoticeBox tone={result.paymentDelta <= 0 ? "neutral" : "amber"}>
                {result.paymentDelta <= 0
                  ? `The estimated loan payment is ${fmtUSD(Math.abs(result.paymentDelta))} lower per month than the current payment you entered.`
                  : `The estimated loan payment is ${fmtUSD(result.paymentDelta)} higher per month than the current payment you entered — a shorter payoff usually costs more monthly.`}
              </NoticeBox>
            )}

            {/* DTI before/after */}
            <div className="rounded-3xl border border-border bg-card p-5">
              <h3 className="font-display text-lg text-foreground">
                Your DTI, before and after
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {result.dtiReplacesExisting
                  ? "Assumes the loan replaces the payment on the debt you're consolidating."
                  : "A new loan adds its payment on top of existing obligations."}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <StatCard
                  label="DTI today"
                  value={`${result.dtiCurrent.toFixed(1)}%`}
                  sub={result.dtiCurrentBand.label}
                />
                <StatCard
                  label="DTI after this loan"
                  value={`${result.dtiWithLoan.toFixed(1)}%`}
                  sub={result.dtiWithLoanBand.label}
                  tone={
                    result.dtiWithLoan <= result.dtiCurrent
                      ? "success"
                      : "default"
                  }
                />
              </div>
              <div className="mt-4">
                <DtiMeter
                  value={result.dtiWithLoan}
                  displayValue={`${result.dtiWithLoan.toFixed(1)}%`}
                  zones={METER_ZONES}
                  cap={METER_CAP}
                  bandLabel={result.dtiWithLoanBand.label}
                  ariaContext="Estimated debt-to-income ratio after the loan"
                />
              </div>
            </div>

            {/* Qualification factors */}
            <div className="rounded-3xl border border-border bg-card p-5">
              <h3 className="font-display text-lg text-foreground">
                What shaped this estimate
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                {result.factors.map((f) => (
                  <li
                    key={f.label}
                    className="flex items-start justify-between gap-3"
                  >
                    <span className="text-muted-foreground">{f.label}</span>
                    <span
                      className={`shrink-0 font-semibold ${f.effect >= 0 ? "text-success" : "text-destructive"}`}
                    >
                      {f.effect > 0 ? `+${f.effect}` : f.effect}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Affordability check: the estimated payment is{" "}
                {result.paymentShareOfIncome.toFixed(1)}% of gross income —{" "}
                {AFFORDABILITY_LABELS[result.affordability].toLowerCase()}.
              </p>
            </div>

            {/* Options worth exploring */}
            <div className="rounded-3xl border border-border bg-card p-5">
              <h3 className="font-display text-lg text-foreground">
                Options worth exploring
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Ranked for the information entered — every path has trade-offs,
                and lender or provider review decides the real outcome.
              </p>
              <ol className="mt-4 space-y-4">
                {result.options.map((o, idx) => (
                  <li
                    key={o.key}
                    className="rounded-2xl border border-border bg-background p-4"
                  >
                    <p className="font-semibold text-foreground">
                      {idx + 1}. {o.name}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {o.why}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Comparison */}
            <CompareTable
              caption="Estimated comparison for the amount entered"
              columns={compareColumns}
              rows={compareRows}
            />
            <p className="text-xs text-muted-foreground">
              {result.comparison.note}
            </p>

            {result.comparison.totals.length >= 2 && (
              <div className="rounded-3xl border border-border bg-card p-5">
                <h3 className="font-display text-lg text-foreground">
                  Estimated total cost, side by side
                </h3>
                <div className="mt-4">
                  <CostBars
                    ariaLabel="Estimated total cost comparison"
                    items={result.comparison.totals.map((t, i2) => ({
                      label: t.label,
                      value: t.value,
                      tone:
                        i2 === 1 ? "primary" : i2 === 0 ? "muted" : "success",
                      note: fmtUSD(t.value),
                    }))}
                  />
                </div>
              </div>
            )}

            <NoticeBox tone="neutral">
              Educational estimates only — not a loan offer or approval. Rates,
              fees, and eligibility are set by each lender&rsquo;s underwriting
              and can differ from these ranges.
            </NoticeBox>

            {reportData && <ToolReportActions data={reportData} />}

            <SoftCTA
              heading="Need help reviewing your financing options?"
              body="Talk through personal loans, consolidation, settlement, or refinancing with a specialist — free and confidential."
              tool="personal_loan"
              source="personal_loan_calculator"
            />
          </>
        )}
      </div>
    </div>
  );
}

// ─── Local helper ────────────────────────────────────────────────────────────

import type {
  PersonalLoanResult,
  ComparisonCell,
} from "@/lib/calculators/personalLoan";

function cells(
  r: PersonalLoanResult,
  pick: (c: ComparisonCell) => string,
): string[] {
  const out = [pick(r.comparison.continueCell), pick(r.comparison.loanCell)];
  if (r.comparison.settlementCell) out.push(pick(r.comparison.settlementCell));
  return out;
}
