// src/components/tools/DebtSettlementCalculator.tsx
//
// Debt Settlement Calculator — Sprint 2, rebuilt on the shared
// Financial Tools architecture. Replaces the legacy standalone
// component behind the SAME URL (/debt-settlement-calculator) —
// URL and SEO equity preserved, implementation modernized.
// Reuses: ToolField, ToolSelect, StatCard, ComparisonCharts,
// shared engine utilities, shared analytics helper.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Phone, ArrowRight, AlertTriangle, Sparkles, Info } from "lucide-react";
import {
  calculateSettlement,
  defaultSettlementPct,
  fmtPct,
  DELINQUENCY_OPTIONS,
  EMPLOYMENT_OPTIONS,
  SETTLEMENT_RANGE_BY_STAGE,
} from "@/lib/calculators/debtSettlement";
import type {
  DelinquencyStage,
  EmploymentStatus,
  SettlementInputs,
} from "@/lib/calculators/debtSettlement";
import {
  fmtUSD,
  fmtMonths,
  payoffDateLabel,
  parseMoney,
  parseRate,
} from "@/lib/calculators/debtPayoff";
import { trackToolEvent } from "@/lib/calculators/track";
import { ToolReportActions } from "@/components/tools/ToolReportActions";
import { reportDateLabel } from "@/lib/calculators/report";
import { ToolField } from "@/components/tools/ToolField";
import { ToolSelect } from "@/components/tools/ToolSelect";
import { StatCard } from "@/components/tools/ToolCharts";
import {
  CostBars,
  SavingsBreakdown,
} from "@/components/tools/ComparisonCharts";
import { US_STATES } from "@/lib/calculators/usStates";

export function DebtSettlementCalculator() {
  // ── Raw input state (strings for controlled inputs) ──
  const [debt, setDebt] = useState("");
  const [creditors, setCreditors] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [income, setIncome] = useState("");
  const [currentPayments, setCurrentPayments] = useState("");
  const [delinquency, setDelinquency] = useState<DelinquencyStage | "">("");
  const [employment, setEmployment] = useState<EmploymentStatus | "">("");
  const [settlePct, setSettlePct] = useState(""); // percent as typed, e.g. "48"
  const [feePct, setFeePct] = useState("");
  const [targetPayment, setTargetPayment] = useState("");
  const settleOverridden = useRef(false);
  const completedHash = useRef("");

  useEffect(() => {
    trackToolEvent("calculator_viewed", { tool: "debt_settlement" });
  }, []);

  // Auto-fill a typical settlement % for the chosen delinquency stage,
  // unless the user has manually edited the field.
  useEffect(() => {
    if (delinquency && !settleOverridden.current) {
      setSettlePct(String(Math.round(defaultSettlementPct(delinquency) * 100)));
    }
  }, [delinquency]);

  // ── Parse + compute ──
  const inputs: SettlementInputs | null = useMemo(() => {
    if (!delinquency) return null;
    const totalDebt = parseMoney(debt);
    const nCreditors = Math.floor(parseMoney(creditors));
    if (totalDebt <= 0 || nCreditors < 1) return null;
    return {
      totalDebt,
      creditors: nCreditors,
      state: stateCode,
      monthlyIncome: parseMoney(income),
      currentMonthlyPayments: parseMoney(currentPayments),
      delinquency,
      employment: (employment || "employed") as EmploymentStatus,
      settlementPct: parseRate(settlePct) / 100,
      feePct: parseRate(feePct) / 100,
      targetMonthlyPayment: parseMoney(targetPayment),
    };
  }, [
    debt,
    creditors,
    stateCode,
    income,
    currentPayments,
    delinquency,
    employment,
    settlePct,
    feePct,
    targetPayment,
  ]);

  const output = useMemo(
    () => (inputs ? calculateSettlement(inputs) : null),
    [inputs],
  );
  const result = output && output.ok ? output : null;
  const inputError = output && !output.ok ? output.reason : null;

  // calculation_completed — debounced, once per distinct valid input set.
  useEffect(() => {
    if (!result || !inputs) return;
    const hash = `${inputs.totalDebt}|${inputs.creditors}|${inputs.delinquency}|${inputs.settlementPct}|${inputs.feePct}|${inputs.targetMonthlyPayment}|${inputs.currentMonthlyPayments}`;
    if (hash === completedHash.current) return;
    const t = setTimeout(() => {
      completedHash.current = hash;
      trackToolEvent("calculation_completed", {
        tool: "debt_settlement",
        months: result.months,
        recommendation: result.recommendation,
      });
    }, 900);
    return () => clearTimeout(t);
  }, [result, inputs]);

  const stageRange = delinquency
    ? SETTLEMENT_RANGE_BY_STAGE[delinquency]
    : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
      {/* ══════════════ LEFT — Inputs ══════════════ */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
        <h2 className="!m-0 font-display text-xl text-foreground">
          Your situation
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything runs in your browser — nothing is saved or submitted.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <ToolField
            id="ds-debt"
            label="Total unsecured debt"
            prefix="$"
            value={debt}
            onChange={(e) => setDebt(e.target.value)}
            placeholder="24,000"
            size="lg"
          />
          <ToolField
            id="ds-creditors"
            label="Number of creditors"
            value={creditors}
            onChange={(e) => setCreditors(e.target.value)}
            placeholder="4"
            inputMode="numeric"
            size="lg"
          />
          <ToolSelect
            id="ds-delinquency"
            label="How far behind are you?"
            value={delinquency}
            onChange={(e) => setDelinquency(e.target.value as DelinquencyStage)}
            options={DELINQUENCY_OPTIONS}
            placeholder="Select status"
          />
          <ToolSelect
            id="ds-employment"
            label="Employment status"
            value={employment}
            onChange={(e) => setEmployment(e.target.value as EmploymentStatus)}
            options={EMPLOYMENT_OPTIONS}
            placeholder="Select status"
          />
          <ToolSelect
            id="ds-state"
            label="State"
            value={stateCode}
            onChange={(e) => setStateCode(e.target.value)}
            options={US_STATES.map((s) => ({ value: s.code, label: s.name }))}
            placeholder="Select state"
          />
          <ToolField
            id="ds-income"
            label="Monthly household income"
            prefix="$"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="4,500"
          />
          <ToolField
            id="ds-current"
            label="Current monthly debt payments"
            prefix="$"
            value={currentPayments}
            onChange={(e) => setCurrentPayments(e.target.value)}
            placeholder="620"
          />
          <ToolField
            id="ds-target"
            label="Target program payment (optional)"
            prefix="$"
            value={targetPayment}
            onChange={(e) => setTargetPayment(e.target.value)}
            placeholder="450"
          />
        </div>

        {/* Advanced assumptions */}
        <div className="mt-6 rounded-2xl border border-border bg-background p-4">
          <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Info className="h-4 w-4 text-primary" aria-hidden="true" />
            Estimate assumptions (adjustable)
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <ToolField
                id="ds-settle-pct"
                label="Estimated settlement percentage"
                suffix="%"
                value={settlePct}
                onChange={(e) => {
                  settleOverridden.current = true;
                  setSettlePct(e.target.value);
                }}
                placeholder="48"
              />
              {stageRange && (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Typical for your status: {fmtPct(stageRange.low)}–
                  {fmtPct(stageRange.high)} of balance.
                </p>
              )}
            </div>
            <div>
              <ToolField
                id="ds-fee-pct"
                label="Estimated program fee"
                suffix="%"
                value={feePct}
                onChange={(e) => setFeePct(e.target.value)}
                placeholder="22"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Industry range 15–25% of enrolled debt — charged only after each
                debt settles (FTC rule).
              </p>
            </div>
          </div>
        </div>

        {inputError && (
          <p
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-xl border border-gold/40 bg-gold/10 px-3.5 py-2.5 text-sm text-foreground"
          >
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-gold"
              aria-hidden="true"
            />
            {inputError}
          </p>
        )}

        {/* Charts — inside left column, below inputs */}
        {result && (
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-display text-lg text-foreground">
                Settlement vs. keep paying minimums
              </h3>
              <p className="mb-4 mt-1 text-sm text-muted-foreground">
                Total cost of each path from today.
              </p>
              <CostBars
                ariaLabel="Cost comparison between debt settlement and continuing minimum payments"
                items={[
                  {
                    label: "Your current debt",
                    value: inputs!.totalDebt,
                    tone: "muted",
                  },
                  {
                    label: `Settlement path (${fmtMonths(result.months)})`,
                    value: result.totalCost,
                    tone: "primary",
                    note: `${fmtUSD(result.settlementAmount)} to creditors + ${fmtUSD(result.programFees)} fees`,
                  },
                  result.baseline.payable
                    ? {
                        label: `Keep paying ${fmtUSD(inputs!.currentMonthlyPayments)}/mo (${fmtMonths(result.baseline.months)})`,
                        value: result.baseline.totalPaid,
                        tone: "destructive" as const,
                        note: `${fmtUSD(result.baseline.totalInterest)} of that is interest`,
                      }
                    : {
                        label: "Keep paying current amount",
                        value: inputs!.totalDebt,
                        tone: "destructive" as const,
                        note: result.baseline.reason ?? "Baseline unavailable",
                      },
                ]}
              />
            </div>
            <div>
              <h3 className="font-display text-lg text-foreground">
                Where every dollar goes
              </h3>
              <p className="mb-4 mt-1 text-sm text-muted-foreground">
                Your {fmtUSD(inputs!.totalDebt)} debt, split across the
                settlement path.
              </p>
              <SavingsBreakdown
                totalDebt={inputs!.totalDebt}
                settlementAmount={result.settlementAmount}
                programFees={result.programFees}
                netSavings={result.netSavings}
              />
            </div>
          </div>
        )}
      </div>

      {/* ══════════════ RIGHT — Results (sticky desktop) ══════════════ */}
      <div className="lg:sticky lg:top-24">
        <div aria-live="polite" className="sr-only">
          {result
            ? `Estimated settlement ${fmtUSD(result.settlementAmount)}, total cost ${fmtUSD(result.totalCost)}, net savings ${fmtUSD(result.netSavings)}, over ${fmtMonths(result.months)}.`
            : "Enter your debt details to see your settlement estimate."}
        </div>

        {!result ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center">
            <Sparkles
              className="mx-auto h-8 w-8 text-primary/50"
              aria-hidden="true"
            />
            <p className="mt-3 font-display text-lg text-foreground">
              Your estimate appears here
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Fill in your total debt, number of creditors, and how far behind
              you are — results update live.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-3xl border border-primary/25 bg-primary-soft/30 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Estimated net savings
              </p>
              <p className="mt-1 font-display text-3xl font-semibold text-foreground">
                {fmtUSD(result.netSavings)}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {fmtPct(result.netSavingsPct)} of your debt, after all fees
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Settlement amount"
                value={fmtUSD(result.settlementAmount)}
                sub={`≈ ${fmtUSD(result.perCreditorSettlement)} per creditor`}
              />
              <StatCard
                label="Program fees"
                value={fmtUSD(result.programFees)}
                sub="paid only as debts settle"
              />
              <StatCard label="Total cost" value={fmtUSD(result.totalCost)} />
              <StatCard
                label="Monthly deposit"
                value={fmtUSD(result.monthlyDeposit)}
                tone="primary"
              />
              <StatCard
                label="Program length"
                value={fmtMonths(result.months)}
              />
              <StatCard
                label="Est. completion"
                value={payoffDateLabel(result.months)}
              />
            </div>

            {result.monthlyPaymentAdjusted && (
              <p className="rounded-xl border border-gold/40 bg-gold/10 px-3.5 py-2.5 text-sm text-foreground">
                Your target payment was below the minimum for a 60-month
                program, so we've used {fmtUSD(result.minViableMonthly)}/month —
                the lowest deposit that completes within the typical maximum
                program length.
              </p>
            )}

            {result.vsBaselineSavings !== null &&
              result.vsBaselineSavings > 0 && (
                <StatCard
                  label="Saved vs. minimum payments"
                  value={fmtUSD(result.vsBaselineSavings)}
                  sub={`and debt-free ${fmtMonths(Math.max(0, result.baseline.months - result.months))} sooner`}
                  tone="success"
                />
              )}
            {!result.baseline.payable && result.baseline.reason && (
              <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-foreground">
                {result.baseline.reason}
              </p>
            )}

            {/* Recommendation */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                What fits your numbers
              </p>
              <p className="mt-1.5 font-display text-base font-semibold text-foreground">
                {result.recommendationLabel}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {result.recommendationNote}
              </p>
            </div>

            {/* Educational: credit + tax */}
            <div className="space-y-2.5 rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Good to know (educational)
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Credit impact:</strong>{" "}
                {result.creditImpactNote}
              </p>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Taxes:</strong>{" "}
                {result.taxNote}
              </p>
            </div>

            {/* ── Soft CTA — value first, never blocking ── */}
            <div className="rounded-3xl border border-border bg-card p-5">
              <p className="font-display text-lg text-foreground">
                Need help understanding your options?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Speak with a debt specialist — free consultation, no obligation,
                confidential.
              </p>
              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                <a
                  href="tel:+17183604806"
                  onClick={() =>
                    trackToolEvent("phone_clicked", { tool: "debt_settlement" })
                  }
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full border border-primary bg-background px-5 text-sm font-semibold text-primary transition hover:bg-primary-soft focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call now
                </a>
                <Link
                  href="/get-help"
                  onClick={() => {
                    trackToolEvent("cta_clicked", {
                      tool: "debt_settlement",
                      cta: "get_free_help",
                    });
                    trackToolEvent("lead_form_started", {
                      source: "debt_settlement_calculator",
                    });
                  }}
                  className="btn-cta flex-1 !min-h-[48px] text-sm"
                >
                  Get free help
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <ToolReportActions
              data={{
                toolSlug: "debt_settlement",
                title: "Debt Settlement Estimate Report",
                generatedLabel: reportDateLabel(),
                snapshot: [
                  {
                    label: "Total enrolled debt",
                    value: fmtUSD(inputs!.totalDebt),
                  },
                  {
                    label: "Gross monthly income",
                    value: fmtUSD(inputs!.monthlyIncome),
                  },
                  {
                    label: "Current monthly payments",
                    value: fmtUSD(inputs!.currentMonthlyPayments),
                  },
                ],
                results: [
                  {
                    label: "Estimated settlement to creditors",
                    value: fmtUSD(result.settlementAmount),
                  },
                  { label: "Program fees", value: fmtUSD(result.programFees) },
                  {
                    label: "Estimated total cost",
                    value: fmtUSD(result.totalCost),
                  },
                  {
                    label: "Monthly deposit",
                    value: `${fmtUSD(result.monthlyDeposit)}/mo`,
                  },
                  { label: "Program length", value: fmtMonths(result.months) },
                  {
                    label: "Estimated net savings",
                    value: fmtUSD(result.netSavings),
                  },
                ],
                assumptions: result.assumptions,
                methodology: [
                  "Settlement percentage is applied to today's balance; fees follow the FTC advance-fee rule (collectible only after each account settles).",
                ],
              }}
            />

            {/* Assumptions */}
            <details className="rounded-2xl border border-border bg-card p-4 text-sm">
              <summary className="cursor-pointer font-medium text-foreground">
                How this estimate is calculated
              </summary>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
                {result.assumptions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
