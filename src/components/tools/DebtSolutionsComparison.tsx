// src/components/tools/DebtSolutionsComparison.tsx
//
// Debt Solutions Comparison — Sprint 4 flagship decision-support
// tool. Client component on the shared platform. Compares five
// paths transparently (minimum payments, settlement, consolidation,
// DMP, bankruptcy-educational) with an honest, goal-based
// recommendation that never pushes one solution and never
// recommends bankruptcy. Reuses ToolField, ToolSelect, StatCard,
// CostBars, CompareTable, ResultBlocks, shared engine + analytics.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Sparkles, Scale, CheckCircle2, XCircle, Landmark } from "lucide-react";
import {
  compareSolutions,
  CREDIT_BAND_OPTIONS,
  PAYMENT_ABILITY_OPTIONS,
  GOAL_OPTIONS,
  DELINQUENCY_OPTIONS,
} from "@/lib/calculators/debtSolutions";
import type {
  SolutionsInputs,
  SolutionsResult,
  OptionResult,
  OptionKey,
  CreditBand,
  PaymentAbility,
  UserGoal,
  DelinquencyStage,
  ImpactLevel,
  MortgageImpact,
} from "@/lib/calculators/debtSolutions";
import {
  fmtUSD,
  fmtMonths,
  payoffDateLabel,
  parseMoney,
} from "@/lib/calculators/debtPayoff";
import { trackToolEvent } from "@/lib/calculators/track";
import { ToolReportActions } from "@/components/tools/ToolReportActions";
import { reportDateLabel } from "@/lib/calculators/report";
import { ToolField } from "@/components/tools/ToolField";
import { ToolSelect } from "@/components/tools/ToolSelect";
import { StatCard } from "@/components/tools/ToolCharts";
import { CostBars } from "@/components/tools/ComparisonCharts";
import { CompareTable } from "@/components/tools/CompareTable";
import type {
  CompareColumn,
  CompareRow,
} from "@/components/tools/CompareTable";
import { HeroStat, NoticeBox, SoftCTA } from "@/components/tools/ResultBlocks";

const IMPACT_LABEL: Record<ImpactLevel, string> = {
  none: "None",
  low: "Low",
  moderate: "Moderate",
  high: "High",
  severe: "Severe",
};

const MORTGAGE_LABEL: Record<MortgageImpact, string> = {
  neutral: "Neutral",
  "helps-over-time": "Helps over time",
  delays: "Delays",
  "blocks-temporarily": "Blocks temporarily",
};

const BEST_FOR_LABELS: {
  key: keyof SolutionsResult["bestFor"];
  label: string;
}[] = [
  { key: "lowerPayment", label: "Lowest monthly payment" },
  { key: "credit", label: "Protecting credit" },
  { key: "speed", label: "Debt-free fastest" },
  { key: "mortgage", label: "Mortgage qualification" },
  { key: "hardship", label: "Severe hardship" },
];

function cellMoney(n: number | null): string {
  return n === null ? "—" : fmtUSD(n);
}
function cellMonths(n: number | null): string {
  return n === null ? "—" : `${fmtMonths(n)} (~${payoffDateLabel(n)})`;
}

export function DebtSolutionsComparison() {
  const [debt, setDebt] = useState("");
  const [income, setIncome] = useState("");
  const [currentPayments, setCurrentPayments] = useState("");
  const [desiredPayment, setDesiredPayment] = useState("");
  const [creditors, setCreditors] = useState("");
  const [creditBand, setCreditBand] = useState<CreditBand | "">("");
  const [delinquency, setDelinquency] = useState<DelinquencyStage | "">("");
  const [ability, setAbility] = useState<PaymentAbility | "">("");
  const [goal, setGoal] = useState<UserGoal | "">("");
  const completedHash = useRef("");

  useEffect(() => {
    trackToolEvent("calculator_viewed", { tool: "debt_solutions" });
  }, []);

  function changeGoal(v: UserGoal) {
    setGoal(v);
    trackToolEvent("tool_option_changed", {
      tool: "debt_solutions",
      option: "goal",
      value: v,
    });
  }

  const inputs: SolutionsInputs | null = useMemo(() => {
    if (!creditBand || !delinquency || !ability || !goal) return null;
    const totalDebt = parseMoney(debt);
    const monthlyIncome = parseMoney(income);
    if (totalDebt <= 0 || monthlyIncome <= 0) return null;
    return {
      totalDebt,
      monthlyIncome,
      currentMonthlyPayments: parseMoney(currentPayments),
      creditBand,
      delinquency,
      creditors: Math.max(1, Math.floor(parseMoney(creditors)) || 1),
      paymentAbility: ability,
      desiredMonthlyPayment: parseMoney(desiredPayment),
      goal,
    };
  }, [
    debt,
    income,
    currentPayments,
    desiredPayment,
    creditors,
    creditBand,
    delinquency,
    ability,
    goal,
  ]);

  const output = useMemo(
    () => (inputs ? compareSolutions(inputs) : null),
    [inputs],
  );
  const result: SolutionsResult | null = output && output.ok ? output : null;
  const blockingReason = output && !output.ok ? output.reason : null;

  useEffect(() => {
    if (!result || !inputs) return;
    const eligibleCount = result.options.filter(
      (o) => o.key !== "bankruptcy" && o.eligible,
    ).length;
    const hash = `${inputs.goal}|${result.recommendation.key}|${result.paymentRatio}|${eligibleCount}`;
    if (hash === completedHash.current) return;
    const t = setTimeout(() => {
      completedHash.current = hash;
      trackToolEvent("calculation_completed", {
        tool: "debt_solutions",
        goal: inputs.goal,
        recommendation: result.recommendation.key,
        payment_ratio: result.paymentRatio,
        eligible_count: eligibleCount,
      });
    }, 900);
    return () => clearTimeout(t);
  }, [result, inputs]);

  const opt = (key: OptionKey): OptionResult =>
    (result as SolutionsResult).options.find(
      (o) => o.key === key,
    ) as OptionResult;

  const columns: CompareColumn[] = result
    ? result.options.map((o) => ({
        key: o.key,
        label: o.name,
        badge: o.key === result.recommendation.key ? "Best fit" : undefined,
        highlight: o.key === result.recommendation.key,
      }))
    : [];

  const rows: CompareRow[] = result
    ? [
        {
          label: "Monthly payment",
          values: result.options.map((o) =>
            o.key === "bankruptcy" ? "Varies by chapter" : cellMoney(o.monthly),
          ),
        },
        {
          label: "Time to debt freedom",
          values: result.options.map((o) =>
            o.key === "bankruptcy"
              ? "Ch 7: months · Ch 13: 3–5 yrs"
              : cellMonths(o.months),
          ),
        },
        {
          label: "Estimated total paid",
          values: result.options.map((o) => cellMoney(o.totalPaid)),
        },
        {
          label: "Savings vs. minimums",
          values: result.options.map((o) =>
            o.savingsVsMinimum === null ? (
              "—"
            ) : o.savingsVsMinimum === 0 ? (
              "Baseline"
            ) : (
              <span
                key={o.key}
                className={
                  o.savingsVsMinimum > 0
                    ? "font-semibold text-success"
                    : "text-destructive"
                }
              >
                {o.savingsVsMinimum > 0
                  ? fmtUSD(o.savingsVsMinimum)
                  : `−${fmtUSD(Math.abs(o.savingsVsMinimum))}`}
              </span>
            ),
          ),
        },
        {
          label: "Credit impact",
          values: result.options.map((o) => IMPACT_LABEL[o.creditImpact]),
        },
        {
          label: "Mortgage impact",
          values: result.options.map((o) => MORTGAGE_LABEL[o.mortgageImpact]),
        },
        {
          label: "Difficulty",
          values: result.options.map(
            (o) => o.difficulty[0].toUpperCase() + o.difficulty.slice(1),
          ),
        },
        {
          label: "Risk level",
          values: result.options.map((o) => IMPACT_LABEL[o.riskLevel]),
        },
        {
          label: "Fits your inputs?",
          values: result.options.map((o) =>
            o.key === "bankruptcy" ? (
              <span key={o.key} className="text-xs text-muted-foreground">
                Education only
              </span>
            ) : o.eligible ? (
              <span
                key={o.key}
                className="inline-flex items-center gap-1 text-success"
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Yes
              </span>
            ) : (
              <span
                key={o.key}
                className="inline-flex items-start gap-1 text-destructive"
              >
                <XCircle
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                <span className="text-xs text-muted-foreground">
                  {o.eligibilityNote}
                </span>
              </span>
            ),
          ),
        },
      ]
    : [];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
      {/* ══════════════ LEFT — Inputs + comparison ══════════════ */}
      <div>
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
          <h2 className="!m-0 font-display text-xl text-foreground">
            Your situation
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything runs in your browser — nothing is saved or submitted.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <ToolField
              id="dsc-debt"
              label="Total unsecured debt"
              prefix="$"
              value={debt}
              onChange={(e) => setDebt(e.target.value)}
              placeholder="24,000"
              size="lg"
            />
            <ToolField
              id="dsc-income"
              label="Gross monthly income"
              prefix="$"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="5,200"
              size="lg"
            />
            <ToolField
              id="dsc-current"
              label="Current monthly debt payments"
              prefix="$"
              value={currentPayments}
              onChange={(e) => setCurrentPayments(e.target.value)}
              placeholder="640"
            />
            <ToolField
              id="dsc-desired"
              label="Desired monthly payment (optional)"
              prefix="$"
              value={desiredPayment}
              onChange={(e) => setDesiredPayment(e.target.value)}
              placeholder="450"
            />
            <ToolField
              id="dsc-creditors"
              label="Number of creditors"
              value={creditors}
              onChange={(e) => setCreditors(e.target.value)}
              placeholder="4"
              inputMode="numeric"
            />
            <ToolSelect
              id="dsc-credit"
              label="Credit score range"
              value={creditBand}
              onChange={(e) => setCreditBand(e.target.value as CreditBand)}
              options={CREDIT_BAND_OPTIONS}
              placeholder="Select range"
            />
            <ToolSelect
              id="dsc-delinquency"
              label="How far behind are you?"
              value={delinquency}
              onChange={(e) =>
                setDelinquency(e.target.value as DelinquencyStage)
              }
              options={DELINQUENCY_OPTIONS}
              placeholder="Select status"
            />
            <ToolSelect
              id="dsc-ability"
              label="Ability to make payments"
              value={ability}
              onChange={(e) => setAbility(e.target.value as PaymentAbility)}
              options={PAYMENT_ABILITY_OPTIONS}
              placeholder="Select one"
            />
            <div className="sm:col-span-2">
              <ToolSelect
                id="dsc-goal"
                label="What matters most to you right now?"
                value={goal}
                onChange={(e) => changeGoal(e.target.value as UserGoal)}
                options={GOAL_OPTIONS}
                placeholder="Select your goal"
              />
            </div>
          </div>

          {blockingReason && (
            <div className="mt-4">
              <NoticeBox tone="amber">{blockingReason}</NoticeBox>
            </div>
          )}
        </div>

        {result && (
          <div className="mt-6 space-y-6">
            {/* Comparison table */}
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
              <h3 className="!mt-0 font-display text-lg text-foreground">
                Five paths, side by side
              </h3>
              <p className="mb-4 mt-1 text-sm text-muted-foreground">
                Same debt, same income — every trade-off in one honest table.
                Scroll sideways on mobile.
              </p>
              <CompareTable
                caption="Comparison of debt solutions across payment, timeline, cost, credit and mortgage impact"
                columns={columns}
                rows={rows}
              />
            </div>

            {/* Total-paid bars */}
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
              <h3 className="!mt-0 font-display text-lg text-foreground">
                Estimated total paid, compared
              </h3>
              <p className="mb-4 mt-1 text-sm text-muted-foreground">
                What each path costs from today until zero (bankruptcy excluded
                — costs are legal, not scheduled).
              </p>
              <CostBars
                ariaLabel="Total amount paid under each debt solution"
                items={result.options
                  .filter((o) => o.totalPaid !== null)
                  .map((o) => ({
                    label: o.name,
                    value: o.totalPaid as number,
                    tone:
                      o.key === result.recommendation.key
                        ? ("primary" as const)
                        : o.key === "minimum"
                          ? ("destructive" as const)
                          : ("muted" as const),
                    note:
                      o.months !== null
                        ? `over ${fmtMonths(o.months)}`
                        : undefined,
                  }))}
              />
            </div>

            {/* Per-option details */}
            <div className="grid gap-4 md:grid-cols-2">
              {result.options
                .filter((o) => o.key !== "bankruptcy")
                .map((o) => (
                  <details
                    key={o.key}
                    className="rounded-2xl border border-border bg-card p-4 text-sm"
                  >
                    <summary className="cursor-pointer font-display text-base font-semibold text-foreground">
                      {o.name} — details
                    </summary>
                    <div className="mt-3 space-y-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-success">
                          Pros
                        </p>
                        <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                          {o.pros.map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-destructive">
                          Cons
                        </p>
                        <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                          {o.cons.map((c) => (
                            <li key={c}>{c}</li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        <strong className="text-foreground">Credit:</strong>{" "}
                        {o.creditNote}
                      </p>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        <strong className="text-foreground">Mortgage:</strong>{" "}
                        {o.mortgageNote}
                      </p>
                      {o.extraNote && (
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          <strong className="text-foreground">Taxes:</strong>{" "}
                          {o.extraNote}
                        </p>
                      )}
                    </div>
                  </details>
                ))}
            </div>

            {/* Bankruptcy — educational only */}
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-muted">
                  <Landmark
                    className="h-5 w-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <h3 className="!m-0 font-display text-lg text-foreground">
                    About bankruptcy (education only — never our recommendation)
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">Chapter 7</strong> is
                    liquidation: qualifying (means-tested) filers can discharge
                    most unsecured debt in roughly 3–6 months; non-exempt assets
                    can be sold, and the filing stays on credit reports for up
                    to 10 years.{" "}
                    <strong className="text-foreground">Chapter 13</strong> is a
                    court-supervised 3–5 year repayment plan that protects
                    assets and catches up secured debts; it remains on reports
                    for up to 7 years.
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Typical situations where attorneys see it fit: lawsuits or
                    garnishments already in motion, debts far beyond any
                    realistic repayment, or protecting a home while curing
                    arrears. Whether it fits <em>you</em> is a legal
                    determination —{" "}
                    <strong className="text-foreground">
                      talk to a bankruptcy attorney, not a calculator.
                    </strong>{" "}
                    Every structured option above exists precisely so most
                    people never need this page of the story.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════ RIGHT — Verdict (sticky desktop) ══════════════ */}
      <div className="lg:sticky lg:top-24">
        <div aria-live="polite" className="sr-only">
          {result
            ? `Best fit for your goal: ${result.recommendation.name}. ${result.recommendation.reason}`
            : "Enter your situation to compare debt solutions."}
        </div>

        {!result ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center">
            <Sparkles
              className="mx-auto h-8 w-8 text-primary/50"
              aria-hidden="true"
            />
            <p className="mt-3 font-display text-lg text-foreground">
              Your comparison appears here
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Fill in your debt, income, credit range, status, and goal — all
              five paths compare live.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <HeroStat
              eyebrow="Best fit for your goal"
              value={result.recommendation.name}
              sub={GOAL_OPTIONS.find((g) => g.value === inputs?.goal)?.label}
            />

            <div className="rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
              {result.recommendation.reason}
              <Link
                href={result.recommendation.href}
                onClick={() =>
                  trackToolEvent("cta_clicked", {
                    tool: "debt_solutions",
                    cta: `learn_${result.recommendation.key}`,
                  })
                }
                className="mt-2 block font-semibold text-primary underline-offset-2 hover:underline"
              >
                Learn how it works →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Debt payments vs. income"
                value={`${result.paymentRatio.toFixed(1)}%`}
                sub="of gross monthly income"
                tone={result.paymentRatio >= 50 ? "default" : "primary"}
              />
              <StatCard
                label="Paths that fit you"
                value={`${result.options.filter((o) => o.key !== "bankruptcy" && o.eligible).length} of 4`}
                sub="based on your inputs"
              />
            </div>

            {/* Best-for chips */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Best option by priority
              </p>
              <ul className="mt-2.5 space-y-2 text-sm">
                {BEST_FOR_LABELS.map(({ key, label }) => {
                  const k = result.bestFor[key];
                  if (!k) return null;
                  const o = opt(k);
                  return (
                    <li
                      key={key}
                      className="flex items-baseline justify-between gap-3"
                    >
                      <span className="text-muted-foreground">{label}</span>
                      <span className="whitespace-nowrap font-semibold text-foreground">
                        {o.name.replace(" (educational)", "")}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {result.warnings.map((w) => (
              <NoticeBox key={w} tone="amber">
                {w}
              </NoticeBox>
            ))}

            <ToolReportActions
              data={{
                toolSlug: "debt_solutions",
                title: "Debt Solutions Comparison Report",
                generatedLabel: reportDateLabel(),
                snapshot: [
                  {
                    label: "Total unsecured debt",
                    value: fmtUSD(inputs!.totalDebt),
                  },
                  {
                    label: "Gross monthly income",
                    value: fmtUSD(inputs!.monthlyIncome),
                  },
                  {
                    label: "Current monthly debt payments",
                    value: fmtUSD(inputs!.currentMonthlyPayments),
                  },
                ],
                results: [
                  {
                    label: "Best fit for your goal",
                    value: result.recommendation.name,
                  },
                ],
                options: result.options
                  .filter((o) => o.eligible)
                  .map((o) => ({
                    name: o.name,
                    why:
                      o.monthly !== null &&
                      o.months !== null &&
                      o.totalPaid !== null
                        ? `${fmtUSD(o.monthly)}/mo · ${fmtMonths(o.months)} · ${fmtUSD(o.totalPaid)} total. ${o.creditNote}`
                        : o.creditNote,
                  })),
                assumptions: result.assumptions,
                methodology: [
                  "All five paths are priced with the shared WeHelpFinance engines and the disclosed assumptions above.",
                ],
              }}
            />

            <SoftCTA
              heading="Need help reviewing your options?"
              body="Speak with a debt specialist — free, confidential, no obligation."
              tool="debt_solutions"
              source="debt_solutions_comparison"
            />

            <details className="rounded-2xl border border-border bg-card p-4 text-sm">
              <summary className="cursor-pointer font-medium text-foreground">
                How this comparison is calculated
              </summary>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
                {result.assumptions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </details>

            <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <Scale
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              This tool compares — it doesn't sell. Every path above has a
              situation where it's the right answer and a situation where it's
              the wrong one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
