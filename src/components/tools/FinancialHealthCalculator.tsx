// src/components/tools/FinancialHealthCalculator.tsx
//
// Financial Health Score — Sprint 7 flagship client component.
// Inputs left, live results right. Reuses every shared primitive;
// adds the FinancialHealthGauge and a What-If simulator (pure-engine
// re-runs, so simulation is instant and nothing leaves the page).
// Analytics: grades/bands only — never scores or dollars.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  calculateFinancialHealth,
  validateHealthInputs,
  GRADE_LABELS,
  GRADE_PHRASING,
  CREDIT_BAND_OPTIONS,
  DELINQUENCY_OPTIONS,
  EMPLOYMENT_OPTIONS,
  type HealthInputs,
  type HealthOutput,
  type CreditBand,
  type DelinquencyStage,
  type EmploymentStatus,
} from "@/lib/calculators/financialHealth";
import { fmtUSD, parseMoney } from "@/lib/calculators/debtPayoff";
import { US_STATES } from "@/lib/calculators/usStates";
import { trackToolEvent } from "@/lib/calculators/track";
import { ToolField } from "@/components/tools/ToolField";
import { ToolSelect } from "@/components/tools/ToolSelect";
import { StatCard } from "@/components/tools/ToolCharts";
import { NoticeBox, SoftCTA } from "@/components/tools/ResultBlocks";
import { FinancialHealthGauge } from "@/components/tools/FinancialHealthGauge";
import { ToolReportActions } from "@/components/tools/ToolReportActions";
import { reportDateLabel, type ToolReportData } from "@/lib/calculators/report";

const STATE_OPTIONS = US_STATES.map((s) => ({ value: s.code, label: s.name }));

const CREDIT_ORDER: CreditBand[] = ["poor", "fair", "good", "excellent"];

export function FinancialHealthCalculator() {
  // ── Inputs (platform string-state pattern) ──
  const [incomeStr, setIncomeStr] = useState("");
  const [expensesStr, setExpensesStr] = useState("");
  const [debtPaymentsStr, setDebtPaymentsStr] = useState("");
  const [unsecuredStr, setUnsecuredStr] = useState("");
  const [creditBand, setCreditBand] = useState<CreditBand>("good");
  const [savingsStr, setSavingsStr] = useState("");
  const [employment, setEmployment] = useState<EmploymentStatus>("employed");
  const [homeowner, setHomeowner] = useState<"yes" | "no">("no");
  const [mortgageStr, setMortgageStr] = useState("");
  const [retirementStr, setRetirementStr] = useState("");
  const [dependentsStr, setDependentsStr] = useState("");
  const [delinquency, setDelinquency] = useState<DelinquencyStage>("current");
  const [stateCode, setStateCode] = useState("TX");

  // ── What-If levers ──
  const [wiIncomeStr, setWiIncomeStr] = useState("");
  const [wiDebtPayStr, setWiDebtPayStr] = useState("");
  const [wiSavingsStr, setWiSavingsStr] = useState("");
  const [wiPayoffBalStr, setWiPayoffBalStr] = useState("");
  const [wiPayoffPmtStr, setWiPayoffPmtStr] = useState("");
  const [wiCreditBump, setWiCreditBump] = useState(false);

  useEffect(() => {
    trackToolEvent("calculator_viewed", { tool: "financial_health" });
  }, []);

  const inputs: HealthInputs = useMemo(
    () => ({
      monthlyIncome: parseMoney(incomeStr),
      livingExpenses: parseMoney(expensesStr),
      monthlyDebtPayments: parseMoney(debtPaymentsStr),
      totalUnsecuredDebt: parseMoney(unsecuredStr),
      creditBand,
      emergencySavings: parseMoney(savingsStr),
      employment,
      homeowner: homeowner === "yes",
      mortgagePayment: homeowner === "yes" ? parseMoney(mortgageStr) : 0,
      retirementSavings: retirementStr.trim() === "" ? null : parseMoney(retirementStr),
      dependents: dependentsStr.trim() === "" ? null : Math.round(parseMoney(dependentsStr)),
      delinquency,
      state: stateCode,
    }),
    [
      incomeStr, expensesStr, debtPaymentsStr, unsecuredStr, creditBand, savingsStr,
      employment, homeowner, mortgageStr, retirementStr, dependentsStr, delinquency, stateCode,
    ]
  );

  const output: HealthOutput = useMemo(() => calculateFinancialHealth(inputs), [inputs]);
  const invalidReason = validateHealthInputs(inputs);
  const result = output.ok ? output : null;

  // ── What-If simulation: same pure engine, adjusted inputs ──
  const whatIfActive =
    wiIncomeStr.trim() !== "" ||
    wiDebtPayStr.trim() !== "" ||
    wiSavingsStr.trim() !== "" ||
    wiPayoffBalStr.trim() !== "" ||
    wiPayoffPmtStr.trim() !== "" ||
    wiCreditBump;

  const simResult = useMemo(() => {
    if (!result || !whatIfActive) return null;
    const bumpIdx = Math.min(CREDIT_ORDER.indexOf(inputs.creditBand) + 1, CREDIT_ORDER.length - 1);
    const sim: HealthInputs = {
      ...inputs,
      monthlyIncome: inputs.monthlyIncome + parseMoney(wiIncomeStr),
      monthlyDebtPayments: Math.max(
        0,
        inputs.monthlyDebtPayments - parseMoney(wiDebtPayStr) - parseMoney(wiPayoffPmtStr)
      ),
      totalUnsecuredDebt: Math.max(0, inputs.totalUnsecuredDebt - parseMoney(wiPayoffBalStr)),
      emergencySavings: inputs.emergencySavings + parseMoney(wiSavingsStr),
      creditBand: wiCreditBump ? CREDIT_ORDER[bumpIdx] : inputs.creditBand,
    };
    const out = calculateFinancialHealth(sim);
    return out.ok ? out : null;
  }, [result, whatIfActive, inputs, wiIncomeStr, wiDebtPayStr, wiSavingsStr, wiPayoffBalStr, wiPayoffPmtStr, wiCreditBump]);

  // ── Debounced completion (grades/bands only) ──
  const completeTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!result) return;
    if (completeTimer.current) window.clearTimeout(completeTimer.current);
    const efBand = result.emergencyMonths >= 6 ? "6_plus" : result.emergencyMonths >= 3 ? "3_6" : result.emergencyMonths >= 1 ? "1_3" : "under_1";
    completeTimer.current = window.setTimeout(() => {
      trackToolEvent("calculation_completed", {
        tool: "financial_health",
        grade: result.grade,
        dti_band: result.dtiBand.key,
        ef_band: efBand,
        credit_band: creditBand,
        delinquency,
      });
    }, 1200);
    return () => {
      if (completeTimer.current) window.clearTimeout(completeTimer.current);
    };
  }, [result, creditBand, delinquency]);

  function onOptionChange(name: string, apply: () => void) {
    apply();
    trackToolEvent("tool_option_changed", { tool: "financial_health", option: name });
  }
  function onWhatIf(lever: string) {
    trackToolEvent("tool_option_changed", { tool: "financial_health", option: `whatif_${lever}` });
  }

  // ── Report data ──
  const reportData: ToolReportData | null = useMemo(() => {
    if (!result) return null;
    const r = result;
    return {
      toolSlug: "financial_health",
      title: "Financial Health Score Report",
      generatedLabel: reportDateLabel(),
      snapshot: [
        { label: "Gross monthly income", value: fmtUSD(inputs.monthlyIncome) },
        { label: "Living expenses", value: fmtUSD(inputs.livingExpenses) },
        { label: "Monthly debt payments", value: fmtUSD(inputs.monthlyDebtPayments + inputs.mortgagePayment) },
        { label: "Total unsecured debt", value: fmtUSD(inputs.totalUnsecuredDebt) },
        { label: "Emergency savings", value: fmtUSD(inputs.emergencySavings) },
        {
          label: "Credit range",
          value: CREDIT_BAND_OPTIONS.find((c) => c.value === creditBand)?.label ?? creditBand,
        },
      ],
      results: [
        {
          label: "Financial Health Score",
          value: `${r.score}/100`,
          hint: `${GRADE_LABELS[r.grade]} — educational wellness score, not a credit score`,
        },
        { label: "Cash Flow Health", value: `${r.cashFlowHealth}/100`, hint: `${r.savingsRatePct.toFixed(1)}% monthly margin` },
        { label: "Debt Health", value: `${r.debtHealth}/100`, hint: `DTI ${r.dtiDisplayed.toFixed(1)}% (${r.dtiBand.label})` },
        { label: "Emergency Fund Health", value: `${r.emergencyFundHealth}/100`, hint: `${r.emergencyMonths.toFixed(1)} months of outflow` },
        { label: "Credit Health", value: `${r.creditHealth}/100` },
        { label: "Mortgage Readiness", value: `${r.mortgageReadiness}/100`, hint: "credit + DTI + history composite" },
        { label: "Borrowing Readiness", value: `${r.borrowingReadiness}/100` },
        { label: "Top strength", value: r.strengths[0]?.title ?? "—" },
        { label: "Top opportunity", value: r.opportunities[0]?.title ?? "—" },
      ],
      options: r.options.map((o) => ({ name: o.name, why: o.why })),
      nextSteps: r.actionPlan.map((s, idx) => `Step ${idx + 1}: ${s.title} — ${s.detail}`),
      assumptions: r.assumptions,
      methodology: [
        "Score = weighted sum of eight categories (cash flow 18, emergency savings 16, DTI 16, debt burden 14, payment history 14, credit 12, housing 5, employment 5).",
        "DTI uses the same rounding and bands as the WeHelpFinance DTI Calculator; the settlement floor and refinance credit rule are the same constants used across the platform.",
        "Grades: 85+ Excellent, 70–84 Very Good, 55–69 Good, 40–54 Fair, below 40 Needs Improvement.",
        "This is an educational wellness score — it is not a credit score and is not used by any lender.",
      ],
    };
  }, [result, inputs, creditBand]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* ── Inputs ── */}
      <div className="print:hidden">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-xl text-foreground">Your financial picture</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything updates live — nothing is saved or sent anywhere.
          </p>

          <div className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolField id="fh-income" label="Gross monthly income" value={incomeStr}
                onChange={(e) => setIncomeStr(e.target.value)} prefix="$" size="lg" placeholder="5,800" />
              <ToolField id="fh-expenses" label="Monthly living expenses" value={expensesStr}
                onChange={(e) => setExpensesStr(e.target.value)} prefix="$" size="lg" placeholder="2,900" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolField id="fh-debt-payments" label="Monthly debt payments (not mortgage)" value={debtPaymentsStr}
                onChange={(e) => setDebtPaymentsStr(e.target.value)} prefix="$" placeholder="720" />
              <ToolField id="fh-unsecured" label="Total unsecured debt" value={unsecuredStr}
                onChange={(e) => setUnsecuredStr(e.target.value)} prefix="$" placeholder="14,000" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolField id="fh-savings" label="Emergency savings" value={savingsStr}
                onChange={(e) => setSavingsStr(e.target.value)} prefix="$" placeholder="2,500" />
              <ToolSelect id="fh-credit" label="Credit score range" value={creditBand}
                onChange={(e) => onOptionChange("credit_band", () => setCreditBand(e.target.value as CreditBand))}
                options={CREDIT_BAND_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolSelect id="fh-employment" label="Employment status" value={employment}
                onChange={(e) => onOptionChange("employment", () => setEmployment(e.target.value as EmploymentStatus))}
                options={EMPLOYMENT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} />
              <ToolSelect id="fh-delinquency" label="Days behind on payments" value={delinquency}
                onChange={(e) => onOptionChange("delinquency", () => setDelinquency(e.target.value as DelinquencyStage))}
                options={DELINQUENCY_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolSelect id="fh-homeowner" label="Do you own a home?" value={homeowner}
                onChange={(e) => onOptionChange("homeowner", () => setHomeowner(e.target.value as "yes" | "no"))}
                options={[{ value: "no", label: "No" }, { value: "yes", label: "Yes" }]} />
              {homeowner === "yes" ? (
                <ToolField id="fh-mortgage" label="Monthly mortgage payment" value={mortgageStr}
                  onChange={(e) => setMortgageStr(e.target.value)} prefix="$" placeholder="1,650" />
              ) : (
                <ToolSelect id="fh-state" label="State" value={stateCode}
                  onChange={(e) => onOptionChange("state", () => setStateCode(e.target.value))}
                  options={STATE_OPTIONS} />
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolField id="fh-retirement" label="Retirement savings (optional)" value={retirementStr}
                onChange={(e) => setRetirementStr(e.target.value)} prefix="$" placeholder="—" />
              <ToolField id="fh-dependents" label="Dependents (optional)" value={dependentsStr}
                onChange={(e) => setDependentsStr(e.target.value)} placeholder="—" inputMode="numeric" />
            </div>
            {homeowner === "yes" && (
              <ToolSelect id="fh-state-2" label="State" value={stateCode}
                onChange={(e) => onOptionChange("state", () => setStateCode(e.target.value))}
                options={STATE_OPTIONS} />
            )}
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="space-y-5">
        <div aria-live="polite" className="sr-only">
          {result
            ? `Financial Health Score ${result.score} out of 100, grade ${GRADE_LABELS[result.grade]}.${simResult ? ` Simulated score ${simResult.score}.` : ""}`
            : invalidReason ?? ""}
        </div>

        {!result && (
          <NoticeBox tone="neutral">
            {invalidReason ?? "Enter your numbers on the left — your score updates live."}
          </NoticeBox>
        )}

        {result && (
          <>
            {/* Gauge hero */}
            <div className="rounded-3xl border border-border bg-card p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your Financial Health Score
              </p>
              <div className="mx-auto mt-2 flex justify-center">
                <FinancialHealthGauge
                  score={result.score}
                  gradeLabel={GRADE_LABELS[result.grade]}
                  ariaLabel={`Financial Health Score ${result.score} out of 100 — ${GRADE_LABELS[result.grade]}`}
                />
              </div>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                {GRADE_PHRASING[result.grade]}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                An educational wellness score from WeHelpFinance —{" "}
                <span className="font-medium text-foreground">not a credit score</span>, not
                used by lenders, no connection to FICO or VantageScore.
              </p>
            </div>

            {/* Sub-scores */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatCard label="Cash Flow Health" value={`${result.cashFlowHealth}`} sub={`${result.savingsRatePct.toFixed(1)}% margin`} tone={result.cashFlowHealth >= 70 ? "success" : "default"} />
              <StatCard label="Debt Health" value={`${result.debtHealth}`} sub={`DTI ${result.dtiDisplayed.toFixed(1)}%`} tone={result.debtHealth >= 70 ? "success" : "default"} />
              <StatCard label="Emergency Fund" value={`${result.emergencyFundHealth}`} sub={`${result.emergencyMonths.toFixed(1)} months`} tone={result.emergencyFundHealth >= 70 ? "success" : "default"} />
              <StatCard label="Credit Health" value={`${result.creditHealth}`} sub="range-based" />
              <StatCard label="Mortgage Readiness" value={`${result.mortgageReadiness}`} sub="credit + DTI + history" />
              <StatCard label="Borrowing Readiness" value={`${result.borrowingReadiness}`} sub="loan-access view" />
            </div>
            <p className="text-xs text-muted-foreground">
              Educational estimates — sub-scores are 0–100 views of the same entries, not
              lender decisions.
            </p>

            {/* Category breakdown */}
            <div className="rounded-3xl border border-border bg-card p-5">
              <h3 className="font-display text-lg text-foreground">How your score is built</h3>
              <ul className="mt-3 space-y-3">
                {result.categories.map((c) => (
                  <li key={c.key}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="font-medium text-foreground">{c.label}</span>
                      <span className="shrink-0 text-muted-foreground">
                        {c.points}/{c.max} pts
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
                      <div
                        className={`h-full rounded-full ${c.pct >= 70 ? "bg-success" : c.pct >= 40 ? "bg-gold" : "bg-destructive/70"} motion-safe:transition-all motion-safe:duration-500`}
                        style={{ width: `${c.pct}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{c.detail}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strengths & opportunities */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-card p-5">
                <h3 className="font-display text-lg text-foreground">Top strengths</h3>
                <ol className="mt-3 space-y-3">
                  {result.strengths.map((s2) => (
                    <li key={s2.title} className="text-sm">
                      <p className="font-medium text-success">{s2.title}</p>
                      <p className="mt-0.5 text-muted-foreground">{s2.detail}</p>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-3xl border border-border bg-card p-5">
                <h3 className="font-display text-lg text-foreground">Top opportunities</h3>
                <ol className="mt-3 space-y-3">
                  {result.opportunities.map((o) => (
                    <li key={o.title} className="text-sm">
                      <p className="font-medium text-foreground">{o.title}</p>
                      <p className="mt-0.5 text-muted-foreground">{o.detail}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* What-If simulator */}
            <div className="rounded-3xl border border-primary/30 bg-primary-soft/20 p-5">
              <h3 className="font-display text-lg text-foreground">What if…?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try improvements and watch the score respond instantly — simulations run
                entirely on this page.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <ToolField id="wi-income" label="Increase monthly income by" value={wiIncomeStr}
                  onChange={(e) => { setWiIncomeStr(e.target.value); onWhatIf("income"); }} prefix="$" placeholder="500" />
                <ToolField id="wi-debtpay" label="Reduce monthly debt payments by" value={wiDebtPayStr}
                  onChange={(e) => { setWiDebtPayStr(e.target.value); onWhatIf("debt_payments"); }} prefix="$" placeholder="200" />
                <ToolField id="wi-savings" label="Add to emergency savings" value={wiSavingsStr}
                  onChange={(e) => { setWiSavingsStr(e.target.value); onWhatIf("savings"); }} prefix="$" placeholder="2,000" />
                <div className="grid grid-cols-2 gap-3">
                  <ToolField id="wi-payoff-bal" label="Pay off a card: balance" value={wiPayoffBalStr}
                    onChange={(e) => { setWiPayoffBalStr(e.target.value); onWhatIf("payoff"); }} prefix="$" placeholder="3,200" />
                  <ToolField id="wi-payoff-pmt" label="…its payment" value={wiPayoffPmtStr}
                    onChange={(e) => { setWiPayoffPmtStr(e.target.value); onWhatIf("payoff"); }} prefix="$" placeholder="95" />
                </div>
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={wiCreditBump}
                  onChange={(e) => { setWiCreditBump(e.target.checked); onWhatIf("credit"); }}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                />
                Improve credit by one range
              </label>

              {simResult && (
                <div className="mt-4 flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:justify-center sm:gap-6">
                  <FinancialHealthGauge
                    compact
                    score={simResult.score}
                    gradeLabel={GRADE_LABELS[simResult.grade]}
                    ariaLabel={`Simulated Financial Health Score ${simResult.score} out of 100 — ${GRADE_LABELS[simResult.grade]}`}
                  />
                  <p className="text-sm text-foreground">
                    Simulated score:{" "}
                    <span className="font-display text-xl">{simResult.score}</span>{" "}
                    <span
                      className={
                        simResult.score >= result.score ? "font-semibold text-success" : "font-semibold text-destructive"
                      }
                    >
                      ({simResult.score >= result.score ? "+" : ""}
                      {simResult.score - result.score})
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      vs. {result.score} today · {GRADE_LABELS[simResult.grade]}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Action plan */}
            <div className="rounded-3xl border border-border bg-card p-5">
              <h3 className="font-display text-lg text-foreground">Your action plan</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Built from your specific opportunity areas, in the order that compounds.
              </p>
              <ol className="mt-4 space-y-4">
                {result.actionPlan.map((step, idx) => (
                  <li key={step.title} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft font-display text-sm text-primary"
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">{step.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Options */}
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

            <NoticeBox tone="neutral">
              Educational wellness score only — not a credit score, not financial advice, and
              not used by any lender. Actual product eligibility and pricing are set by each
              lender&rsquo;s or provider&rsquo;s own review.
            </NoticeBox>

            {reportData && <ToolReportActions data={reportData} />}

            <SoftCTA
              heading="Want a human read on your numbers?"
              body="Talk through your score, the action plan, and the options behind it with a specialist — free and confidential."
              tool="financial_health"
              source="financial_health_calculator"
            />
          </>
        )}
      </div>
    </div>
  );
}
