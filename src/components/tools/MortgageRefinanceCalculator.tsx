// src/components/tools/MortgageRefinanceCalculator.tsx
//
// Mortgage Refinance Savings Calculator — Sprint 6.
// Mirrors the Sprint 5 component architecture: inputs left, live
// results right, shared primitives throughout, shared report system,
// bands-only analytics.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  calculateRefinance,
  validateRefiInputs,
  NEW_TERM_OPTIONS,
  READINESS_LABELS,
  READINESS_PHRASING,
  CREDIT_BAND_OPTIONS,
  type RefiInputs,
  type RefiOutput,
  type RefiReadiness,
  type CreditBand,
} from "@/lib/calculators/mortgageRefinance";
import { DTI_BANDS, METER_CAP } from "@/lib/calculators/dti";
import { fmtUSD, fmtMonths, parseMoney, parseRate } from "@/lib/calculators/debtPayoff";
import { US_STATES } from "@/lib/calculators/usStates";
import { trackToolEvent } from "@/lib/calculators/track";
import { ToolField } from "@/components/tools/ToolField";
import { ToolSelect } from "@/components/tools/ToolSelect";
import { StatCard } from "@/components/tools/ToolCharts";
import { CostBars } from "@/components/tools/ComparisonCharts";
import { CompareTable, type CompareColumn, type CompareRow } from "@/components/tools/CompareTable";
import { DtiMeter, type MeterZone } from "@/components/tools/DtiMeter";
import { HeroStat, NoticeBox, SoftCTA } from "@/components/tools/ResultBlocks";
import { ToolReportActions } from "@/components/tools/ToolReportActions";
import { reportDateLabel, type ToolReportData } from "@/lib/calculators/report";

const METER_ZONES: MeterZone[] = DTI_BANDS.map((b) => ({
  max: b.max === Infinity ? METER_CAP : b.max,
  label: b.label,
  tone: b.tone,
}));

const HERO_TONE: Record<RefiReadiness, "primary" | "success" | "destructive"> = {
  strong: "success",
  workable: "primary",
  challenged: "primary",
};

const FACTOR_CLASS: Record<"positive" | "neutral" | "negative", string> = {
  positive: "text-success",
  neutral: "text-muted-foreground",
  negative: "text-destructive",
};

const STATE_OPTIONS = US_STATES.map((s) => ({ value: s.code, label: s.name }));

export function MortgageRefinanceCalculator() {
  // ── Inputs (string state for text fields, per platform pattern) ──
  const [balanceStr, setBalanceStr] = useState("");
  const [currentRateStr, setCurrentRateStr] = useState("");
  const [currentPaymentStr, setCurrentPaymentStr] = useState("");
  const [remainingYearsStr, setRemainingYearsStr] = useState("");
  const [homeValueStr, setHomeValueStr] = useState("");
  const [newRateStr, setNewRateStr] = useState("");
  const [newTermMonths, setNewTermMonths] = useState(360);
  const [closingStr, setClosingStr] = useState("");
  const [incomeStr, setIncomeStr] = useState("");
  const [debtPaymentsStr, setDebtPaymentsStr] = useState("");
  const [creditBand, setCreditBand] = useState<CreditBand>("good");
  const [stateCode, setStateCode] = useState("TX");

  useEffect(() => {
    trackToolEvent("calculator_viewed", { tool: "mortgage_refi" });
  }, []);

  const inputs: RefiInputs = useMemo(
    () => ({
      balance: parseMoney(balanceStr),
      currentRate: parseRate(currentRateStr) / 100,
      currentPayment: parseMoney(currentPaymentStr),
      remainingTermMonths: Math.round(parseRate(remainingYearsStr) * 12),
      homeValue: parseMoney(homeValueStr),
      newRate: parseRate(newRateStr) / 100,
      newTermMonths,
      closingCosts: parseMoney(closingStr),
      monthlyIncome: parseMoney(incomeStr),
      monthlyDebtPayments: parseMoney(debtPaymentsStr),
      creditBand,
      state: stateCode,
    }),
    [
      balanceStr, currentRateStr, currentPaymentStr, remainingYearsStr, homeValueStr,
      newRateStr, newTermMonths, closingStr, incomeStr, debtPaymentsStr, creditBand, stateCode,
    ]
  );

  const output: RefiOutput = useMemo(() => calculateRefinance(inputs), [inputs]);
  const invalidReason = validateRefiInputs(inputs);
  const result = output.ok ? output : null;

  // ── Debounced completion event — bands only, never dollars ──
  const completeTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!result) return;
    if (completeTimer.current) window.clearTimeout(completeTimer.current);
    const savingsBand = result.monthlySavings > 0 ? "positive" : result.monthlySavings < 0 ? "negative" : "flat";
    const beBand =
      result.breakEvenMonths === null
        ? "none"
        : result.breakEvenMonths <= 24
          ? "under_24"
          : result.breakEvenMonths <= 60
            ? "24_60"
            : "over_60";
    completeTimer.current = window.setTimeout(() => {
      trackToolEvent("calculation_completed", {
        tool: "mortgage_refi",
        readiness: result.readiness,
        dti_band: result.dtiAfterBand.key,
        ltv_band: result.ltvBand.key,
        savings_band: savingsBand,
        breakeven_band: beBand,
        credit_band: creditBand,
      });
    }, 1200);
    return () => {
      if (completeTimer.current) window.clearTimeout(completeTimer.current);
    };
  }, [result, creditBand]);

  function onOptionChange(name: string, apply: () => void) {
    apply();
    trackToolEvent("tool_option_changed", { tool: "mortgage_refi", option: name });
  }

  // ── Report data (pre-formatted strings only) ──
  const reportData: ToolReportData | null = useMemo(() => {
    if (!result) return null;
    const r = result;
    return {
      toolSlug: "mortgage_refi",
      title: "Mortgage Refinance Savings Report",
      generatedLabel: reportDateLabel(),
      snapshot: [
        { label: "Current balance", value: fmtUSD(inputs.balance) },
        { label: "Current rate / payment", value: `${(inputs.currentRate * 100).toFixed(2)}% · ${fmtUSD(inputs.currentPayment)}/mo` },
        { label: "Remaining term", value: fmtMonths(inputs.remainingTermMonths) },
        { label: "Estimated home value", value: fmtUSD(inputs.homeValue) },
        { label: "New rate / term", value: `${(inputs.newRate * 100).toFixed(2)}% · ${fmtMonths(inputs.newTermMonths)}` },
        { label: "Closing costs", value: fmtUSD(inputs.closingCosts) },
      ],
      results: [
        { label: "Refinance readiness", value: READINESS_LABELS[r.readiness], hint: "Educational band — lenders vary" },
        { label: "Estimated new payment", value: `${fmtUSD(r.newPayment)}/mo` },
        {
          label: "Monthly savings",
          value: r.monthlySavings >= 0 ? fmtUSD(r.monthlySavings) : `−${fmtUSD(Math.abs(r.monthlySavings))}`,
          hint: `${r.annualSavings >= 0 ? fmtUSD(r.annualSavings) : `−${fmtUSD(Math.abs(r.annualSavings))}`}/yr`,
        },
        {
          label: "Lifetime savings vs. staying",
          value: r.lifetimeSavings >= 0 ? fmtUSD(r.lifetimeSavings) : `−${fmtUSD(Math.abs(r.lifetimeSavings))}`,
          hint: "incl. closing costs",
        },
        {
          label: "Break-even on closing costs",
          value:
            r.breakEvenMonths === null
              ? "None at these numbers"
              : r.breakEvenMonths === 0
                ? "Immediate"
                : fmtMonths(r.breakEvenMonths),
        },
        { label: "Loan-to-value (LTV)", value: `${r.ltv.toFixed(1)}%`, hint: r.ltvBand.label },
        { label: "DTI today", value: `${r.dtiCurrent.toFixed(1)}%`, hint: r.dtiCurrentBand.label },
        { label: "DTI after refinance", value: `${r.dtiAfter.toFixed(1)}%`, hint: r.dtiAfterBand.label },
      ],
      comparison: {
        caption: "Current mortgage vs. the refinance entered",
        columns: ["Current mortgage", "Refinanced mortgage"],
        rows: r.comparisonRows.map((row) => ({
          label: row.label,
          cells: [row.cells.current, row.cells.refi],
        })),
        note: "Principal & interest only — property taxes and homeowners insurance continue under either path.",
      },
      options: r.options.map((o) => ({ name: o.name, why: o.why })),
      nextSteps: [
        "Get written Loan Estimates from at least three lenders on the same day — rates move daily, and same-day quotes are the only fair comparison.",
        "Compare the APR and total closing costs, not just the rate — lender credits and points change the real price.",
        "Check the break-even month against how long you realistically plan to keep the home.",
        "If DTI is the constraint, revisit after reducing monthly debt obligations — our DTI Calculator shows exactly how far each payment moves it.",
      ],
      assumptions: r.assumptions,
      methodology: [
        "New payment uses standard amortization at the rate and term entered.",
        "Lifetime comparison totals every remaining current payment against every new payment plus closing costs.",
        "Break-even = closing costs ÷ monthly savings, rounded up to whole months.",
        "DTI and LTV use the same rounding and band conventions as the other WeHelpFinance calculators.",
      ],
    };
  }, [result, inputs]);

  // ── Comparison table props ──
  const compareColumns: CompareColumn[] = useMemo(
    () => [
      { key: "current", label: "Current mortgage" },
      { key: "refi", label: "Refinanced mortgage", badge: "This estimate", highlight: true },
    ],
    []
  );
  const compareRows: CompareRow[] = useMemo(() => {
    if (!result) return [];
    return result.comparisonRows.map((row) => ({
      label: row.label,
      values: [row.cells.current, row.cells.refi],
    }));
  }, [result]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* ── Inputs ── */}
      <div className="print:hidden">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-xl text-foreground">Your mortgage today — and the refinance you&rsquo;re weighing</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything updates live — nothing is saved or sent anywhere.
          </p>

          <div className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolField
                id="mr-balance"
                label="Current mortgage balance"
                value={balanceStr}
                onChange={(e) => setBalanceStr(e.target.value)}
                prefix="$"
                size="lg"
                placeholder="285,000"
              />
              <ToolField
                id="mr-home-value"
                label="Estimated home value"
                value={homeValueStr}
                onChange={(e) => setHomeValueStr(e.target.value)}
                prefix="$"
                size="lg"
                placeholder="390,000"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <ToolField
                id="mr-current-rate"
                label="Current rate"
                value={currentRateStr}
                onChange={(e) => setCurrentRateStr(e.target.value)}
                suffix="%"
                placeholder="7.25"
              />
              <ToolField
                id="mr-current-payment"
                label="Current P&I payment"
                value={currentPaymentStr}
                onChange={(e) => setCurrentPaymentStr(e.target.value)}
                prefix="$"
                placeholder="2,050"
              />
              <ToolField
                id="mr-remaining-years"
                label="Years remaining"
                value={remainingYearsStr}
                onChange={(e) => setRemainingYearsStr(e.target.value)}
                suffix="yrs"
                placeholder="26"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <ToolField
                id="mr-new-rate"
                label="New rate you're seeing"
                value={newRateStr}
                onChange={(e) => setNewRateStr(e.target.value)}
                suffix="%"
                placeholder="6.1"
              />
              <ToolSelect
                id="mr-new-term"
                label="New loan term"
                value={String(newTermMonths)}
                onChange={(e) => onOptionChange("new_term", () => setNewTermMonths(Number(e.target.value)))}
                options={NEW_TERM_OPTIONS.map((o) => ({ value: String(o.value), label: o.label }))}
              />
              <ToolField
                id="mr-closing"
                label="Estimated closing costs"
                value={closingStr}
                onChange={(e) => setClosingStr(e.target.value)}
                prefix="$"
                placeholder="6,500"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolField
                id="mr-income"
                label="Gross monthly income"
                value={incomeStr}
                onChange={(e) => setIncomeStr(e.target.value)}
                prefix="$"
                placeholder="7,200"
              />
              <ToolField
                id="mr-debts"
                label="Other monthly debt payments (not this mortgage)"
                value={debtPaymentsStr}
                onChange={(e) => setDebtPaymentsStr(e.target.value)}
                prefix="$"
                placeholder="650"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolSelect
                id="mr-credit"
                label="Credit score range"
                value={creditBand}
                onChange={(e) => onOptionChange("credit_band", () => setCreditBand(e.target.value as CreditBand))}
                options={CREDIT_BAND_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              />
              <ToolSelect
                id="mr-state"
                label="State"
                value={stateCode}
                onChange={(e) => onOptionChange("state", () => setStateCode(e.target.value))}
                options={STATE_OPTIONS}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="space-y-5">
        <div aria-live="polite" className="sr-only">
          {result
            ? `Refinance readiness ${READINESS_LABELS[result.readiness]}. Estimated new payment ${fmtUSD(result.newPayment)} per month. Monthly savings ${fmtUSD(result.monthlySavings)}.`
            : invalidReason ?? ""}
        </div>

        {!result && (
          <NoticeBox tone="neutral">
            {invalidReason ?? "Enter your mortgage details on the left — results update live."}
          </NoticeBox>
        )}

        {result && (
          <>
            <HeroStat
              eyebrow="Estimated monthly savings"
              value={
                result.monthlySavings >= 0
                  ? `${fmtUSD(result.monthlySavings)}/mo`
                  : `−${fmtUSD(Math.abs(result.monthlySavings))}/mo`
              }
              sub={`New payment ${fmtUSD(result.newPayment)}/mo · Readiness: ${READINESS_LABELS[result.readiness]} — ${READINESS_PHRASING[result.readiness]}`}
              tone={result.monthlySavings > 0 ? HERO_TONE[result.readiness] : "destructive"}
            />

            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Annual savings"
                value={
                  result.annualSavings >= 0
                    ? fmtUSD(result.annualSavings)
                    : `−${fmtUSD(Math.abs(result.annualSavings))}`
                }
                sub="cash-flow change per year"
                tone={result.annualSavings > 0 ? "success" : "default"}
              />
              <StatCard
                label="Lifetime savings"
                value={
                  result.lifetimeSavings >= 0
                    ? fmtUSD(result.lifetimeSavings)
                    : `−${fmtUSD(Math.abs(result.lifetimeSavings))}`
                }
                sub="vs. staying, incl. closing costs"
                tone={result.lifetimeSavings > 0 ? "success" : "default"}
              />
              <StatCard
                label="Break-even"
                value={
                  result.breakEvenMonths === null
                    ? "None"
                    : result.breakEvenMonths === 0
                      ? "Immediate"
                      : fmtMonths(result.breakEvenMonths)
                }
                sub={
                  result.breakEvenMonths === null
                    ? "payment isn't lower at these numbers"
                    : "to recover closing costs"
                }
              />
              <StatCard
                label="Loan-to-value"
                value={`${result.ltv.toFixed(1)}%`}
                sub={result.ltvBand.label}
                tone={result.ltvBand.key === "strong" ? "success" : "default"}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Educational estimates — actual rates, payments, and approval are set by each
              lender&rsquo;s underwriting, never by this tool.
            </p>

            {result.paymentLooksEscrow && (
              <NoticeBox tone="amber">
                Your current payment looks higher than the principal &amp; interest this
                balance, rate, and term would produce — it may include escrow (taxes and
                insurance). Enter the P&amp;I portion only for accurate savings math.
              </NoticeBox>
            )}

            {result.lifetimeSavings < 0 && result.monthlySavings > 0 && (
              <NoticeBox tone="amber">
                The payment drops, but restarting the term means this refinance costs{" "}
                {fmtUSD(Math.abs(result.lifetimeSavings))} more over its life than staying put.
                Lower payment ≠ lower cost — weigh both.
              </NoticeBox>
            )}

            {/* LTV context */}
            <div className="rounded-3xl border border-border bg-card p-5">
              <h3 className="font-display text-lg text-foreground">Your equity position</h3>
              <p className="mt-1 text-sm text-muted-foreground">{result.ltvBand.note}</p>
            </div>

            {/* DTI before/after */}
            <div className="rounded-3xl border border-border bg-card p-5">
              <h3 className="font-display text-lg text-foreground">Your DTI, before and after</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Only the mortgage payment changes — other debts stay constant.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <StatCard
                  label="DTI today"
                  value={`${result.dtiCurrent.toFixed(1)}%`}
                  sub={result.dtiCurrentBand.label}
                />
                <StatCard
                  label="DTI after refinance"
                  value={`${result.dtiAfter.toFixed(1)}%`}
                  sub={result.dtiAfterBand.label}
                  tone={result.dtiAfter < result.dtiCurrent ? "success" : "default"}
                />
              </div>
              <div className="mt-4">
                <DtiMeter
                  value={result.dtiAfter}
                  displayValue={`${result.dtiAfter.toFixed(1)}%`}
                  zones={METER_ZONES}
                  cap={METER_CAP}
                  bandLabel={result.dtiAfterBand.label}
                  ariaContext="Estimated debt-to-income ratio after refinancing"
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Housing share of income: {result.frontEndCurrent.toFixed(1)}% today →{" "}
                {result.frontEndAfter.toFixed(1)}% after · cash-flow change{" "}
                {result.cashFlowPctOfIncome >= 0 ? "+" : "−"}
                {Math.abs(result.cashFlowPctOfIncome).toFixed(1)}% of income.
              </p>
            </div>

            {/* Readiness factors */}
            <div className="rounded-3xl border border-border bg-card p-5">
              <h3 className="font-display text-lg text-foreground">What shaped this estimate</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {result.factors.map((f) => (
                  <li key={f.label} className={`flex items-start gap-2 ${FACTOR_CLASS[f.tone]}`}>
                    <span aria-hidden="true" className="mt-0.5 shrink-0">
                      {f.tone === "positive" ? "▲" : f.tone === "negative" ? "▼" : "•"}
                    </span>
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Options worth exploring */}
            <div className="rounded-3xl border border-border bg-card p-5">
              <h3 className="font-display text-lg text-foreground">Options worth exploring</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Ranked for the information entered — every path has trade-offs, and lender or
                provider review decides the real outcome.
              </p>
              <ol className="mt-4 space-y-4">
                {result.options.map((o, idx) => (
                  <li key={o.key} className="rounded-2xl border border-border bg-background p-4">
                    <p className="font-semibold text-foreground">
                      {idx + 1}. {o.name}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{o.why}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Comparison */}
            <CompareTable
              caption="Current mortgage vs. the refinance entered"
              columns={compareColumns}
              rows={compareRows}
            />

            <div className="rounded-3xl border border-border bg-card p-5">
              <h3 className="font-display text-lg text-foreground">
                Total remaining cost, side by side
              </h3>
              <div className="mt-4">
                <CostBars
                  ariaLabel="Total remaining cost comparison"
                  items={result.totals.map((t, i2) => ({
                    label: t.label,
                    value: t.value,
                    tone: i2 === 1 ? "primary" : "muted",
                    note: fmtUSD(t.value),
                  }))}
                />
              </div>
            </div>

            <NoticeBox tone="neutral">
              Educational estimates only — not a loan offer, rate quote, or approval. Actual
              refinance pricing, PMI, and eligibility are set by each lender&rsquo;s
              underwriting and can differ from these figures.
            </NoticeBox>

            {reportData && <ToolReportActions data={reportData} />}

            <SoftCTA
              heading="Want help thinking through the refinance decision?"
              body="Talk through refinancing, consolidation, or reducing the debt side of your DTI with a specialist — free and confidential."
              tool="mortgage_refi"
              source="mortgage_refi_calculator"
            />
          </>
        )}
      </div>
    </div>
  );
}
