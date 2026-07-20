// src/components/tools/DebtFreedomPlanner.tsx
//
// Debt Freedom Planner — Sprint 9 flagship client component.
// Six-strategy comparison on shared engines, goal-driven pick,
// milestone timeline, What-If simulator (pure re-runs), insights,
// cross-tool options, 6-month plan, shared report. Bands only in
// analytics — never dollars.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  calculateFreedomPlan,
  validateFreedomInputs,
  GOAL_OPTIONS,
  DIFFICULTY_LABELS,
  CREDIT_BAND_OPTIONS,
  DELINQUENCY_OPTIONS,
  type FreedomInputs,
  type FreedomOutput,
  type FinancialGoal,
  type StrategyRow,
  type CreditBand,
  type DelinquencyStage,
} from "@/lib/calculators/debtFreedomPlanner";
import { fmtUSD, fmtMonths, parseMoney, parseRate } from "@/lib/calculators/debtPayoff";
import { US_STATES } from "@/lib/calculators/usStates";
import { trackToolEvent } from "@/lib/calculators/track";
import { ToolField } from "@/components/tools/ToolField";
import { ToolSelect } from "@/components/tools/ToolSelect";
import { StatCard } from "@/components/tools/ToolCharts";
import { CostBars } from "@/components/tools/ComparisonCharts";
import { CompareTable, type CompareColumn, type CompareRow } from "@/components/tools/CompareTable";
import { NoticeBox, SoftCTA } from "@/components/tools/ResultBlocks";
import { DebtFreedomTimeline } from "@/components/tools/DebtFreedomTimeline";
import { ToolReportActions } from "@/components/tools/ToolReportActions";
import { reportDateLabel, type ToolReportData } from "@/lib/calculators/report";

const CREDIT_ORDER: CreditBand[] = ["poor", "fair", "good", "excellent"];
const STATE_OPTIONS = US_STATES.map((s) => ({ value: s.code, label: s.name }));

const cell = (v: string | number | null, fmt?: (n: number) => string) =>
  v === null ? "—" : typeof v === "number" && fmt ? fmt(v) : String(v);

export function DebtFreedomPlanner() {
  // ── Inputs ──
  const [debtStr, setDebtStr] = useState("22,000");
  const [creditBand, setCreditBand] = useState<CreditBand>("good");
  const [incomeStr, setIncomeStr] = useState("5,800");
  const [expensesStr, setExpensesStr] = useState("3,100");
  const [paymentsStr, setPaymentsStr] = useState("560");
  const [extraStr, setExtraStr] = useState("200");
  const [aprStr, setAprStr] = useState("22.9");
  const [accountsStr, setAccountsStr] = useState("4");
  const [delinquency, setDelinquency] = useState<DelinquencyStage>("current");
  const [homeowner, setHomeowner] = useState<"yes" | "no">("no");
  const [stateCode, setStateCode] = useState("TX");
  const [goal, setGoal] = useState<FinancialGoal>("fastest");
  // ── What-If ──
  const [wiExtraStr, setWiExtraStr] = useState("");
  const [wiExpCutStr, setWiExpCutStr] = useState("");
  const [wiIncomeStr, setWiIncomeStr] = useState("");
  const [wiDebtCutStr, setWiDebtCutStr] = useState("");
  const [wiRefiStr, setWiRefiStr] = useState("");
  const [wiCreditBump, setWiCreditBump] = useState(false);

  useEffect(() => {
    trackToolEvent("calculator_viewed", { tool: "debt_freedom" });
  }, []);

  const inputs: FreedomInputs = useMemo(
    () => ({
      totalDebt: parseMoney(debtStr),
      creditBand,
      monthlyIncome: parseMoney(incomeStr),
      livingExpenses: parseMoney(expensesStr),
      currentPayments: parseMoney(paymentsStr),
      extraPayment: parseMoney(extraStr),
      avgApr: parseRate(aprStr) / 100,
      accounts: Math.round(parseMoney(accountsStr) || 0),
      delinquency,
      homeowner: homeowner === "yes",
      state: stateCode,
      goal,
    }),
    [debtStr, creditBand, incomeStr, expensesStr, paymentsStr, extraStr, aprStr, accountsStr, delinquency, homeowner, stateCode, goal]
  );

  const output: FreedomOutput = useMemo(() => calculateFreedomPlan(inputs), [inputs]);
  const invalidReason = validateFreedomInputs(inputs);
  const result = output.ok ? output : null;

  const whatIfActive =
    wiExtraStr.trim() !== "" || wiExpCutStr.trim() !== "" || wiIncomeStr.trim() !== "" ||
    wiDebtCutStr.trim() !== "" || wiRefiStr.trim() !== "" || wiCreditBump;

  const simResult = useMemo(() => {
    if (!result || !whatIfActive) return null;
    const bumpIdx = Math.min(CREDIT_ORDER.indexOf(inputs.creditBand) + 1, CREDIT_ORDER.length - 1);
    const sim: FreedomInputs = {
      ...inputs,
      totalDebt: Math.max(1, inputs.totalDebt - parseMoney(wiDebtCutStr)),
      monthlyIncome: inputs.monthlyIncome + parseMoney(wiIncomeStr),
      extraPayment:
        inputs.extraPayment + parseMoney(wiExtraStr) + parseMoney(wiExpCutStr) +
        (inputs.homeowner ? parseMoney(wiRefiStr) : 0),
      creditBand: wiCreditBump ? CREDIT_ORDER[bumpIdx] : inputs.creditBand,
    };
    const out = calculateFreedomPlan(sim);
    return out.ok ? out : null;
  }, [result, whatIfActive, inputs, wiExtraStr, wiExpCutStr, wiIncomeStr, wiDebtCutStr, wiRefiStr, wiCreditBump]);

  // ── Analytics (bands only) ──
  const completeTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!result) return;
    if (completeTimer.current) window.clearTimeout(completeTimer.current);
    completeTimer.current = window.setTimeout(() => {
      trackToolEvent("calculation_completed", {
        tool: "debt_freedom",
        goal,
        recommended: result.recommendedKey,
        dti_band: result.dtiCurrentBand.key,
        credit_band: creditBand,
        delinquency,
      });
    }, 1200);
    return () => {
      if (completeTimer.current) window.clearTimeout(completeTimer.current);
    };
  }, [result, goal, creditBand, delinquency]);

  function onOptionChange(name: string, apply: () => void) {
    apply();
    trackToolEvent("tool_option_changed", { tool: "debt_freedom", option: name });
  }
  function onWhatIf(lever: string) {
    trackToolEvent("tool_option_changed", { tool: "debt_freedom", option: `whatif_${lever}` });
  }

  const recommended: StrategyRow | null = useMemo(
    () => (result ? result.strategies.find((s) => s.key === result.recommendedKey) ?? null : null),
    [result]
  );
  const simRecommended: StrategyRow | null = useMemo(
    () => (simResult ? simResult.strategies.find((s) => s.key === simResult.recommendedKey) ?? null : null),
    [simResult]
  );

  // ── Compare table ──
  const compareColumns: CompareColumn[] = useMemo(() => {
    if (!result) return [];
    return result.strategies.map((s) => ({
      key: s.key,
      label: s.name,
      badge: s.key === result.recommendedKey ? "Best for your goal" : undefined,
      highlight: s.key === result.recommendedKey,
    }));
  }, [result]);

  const compareRows: CompareRow[] = useMemo(() => {
    if (!result) return [];
    const S = result.strategies;
    const row = (label: string, pick: (s: StrategyRow) => string) => ({
      label,
      values: S.map((s) => (s.available ? pick(s) : s.availabilityNote ?? "—")),
    });
    return [
      row("Monthly payment", (s) => cell(s.monthly, (n) => `${fmtUSD(n)}/mo`)),
      row("Debt-free date", (s) => (s.months !== null ? `${s.debtFreeLabel} (${fmtMonths(s.months)})` : "—")),
      row("Total interest / program cost above principal", (s) =>
        s.key === "settlement" ? "Priced as program cost →" : cell(s.totalInterest, fmtUSD)
      ),
      row("Estimated total paid", (s) => cell(s.totalPaid, fmtUSD)),
      row("Savings vs. minimums", (s) =>
        s.savingsVsMinimum === null ? "—" : s.savingsVsMinimum >= 0 ? fmtUSD(s.savingsVsMinimum) : `−${fmtUSD(Math.abs(s.savingsVsMinimum))}`
      ),
      row("Cash-flow impact", (s) => s.cashFlowNote),
      row("DTI during plan", (s) => (s.dtiDuring !== null ? `${s.dtiDuring.toFixed(1)}% — ${s.dtiNote}` : s.dtiNote)),
      row("Credit impact", (s) => s.creditNote),
      row("Difficulty", (s) => DIFFICULTY_LABELS[s.difficulty]),
      row("Typically best for", (s) => s.bestFor),
    ];
  }, [result]);

  // ── Report ──
  const reportData: ToolReportData | null = useMemo(() => {
    if (!result || !recommended) return null;
    const r = result;
    return {
      toolSlug: "debt_freedom",
      title: "Debt Freedom Plan Report",
      generatedLabel: reportDateLabel(),
      snapshot: [
        { label: "Total unsecured debt", value: fmtUSD(inputs.totalDebt) },
        { label: "Average APR", value: `${(inputs.avgApr * 100).toFixed(1)}%` },
        { label: "Accounts", value: String(inputs.accounts) },
        { label: "Current payments + extra", value: `${fmtUSD(inputs.currentPayments)} + ${fmtUSD(inputs.extraPayment)}/mo` },
        { label: "Goal", value: GOAL_OPTIONS.find((g) => g.value === goal)?.label ?? goal },
        { label: "Current DTI", value: `${r.dtiCurrent.toFixed(1)}%`, hint: r.dtiCurrentBand.label },
      ],
      results: [
        { label: "Best for your goal", value: recommended.name, hint: r.recommendedWhy },
        { label: "Debt-free", value: recommended.debtFreeLabel ?? "—", hint: recommended.months !== null ? fmtMonths(recommended.months) : undefined },
        { label: "Monthly payment", value: recommended.monthly !== null ? `${fmtUSD(recommended.monthly)}/mo` : "—" },
        { label: "Estimated total paid", value: recommended.totalPaid !== null ? fmtUSD(recommended.totalPaid) : "—" },
        {
          label: "Savings vs. minimum payments",
          value:
            recommended.savingsVsMinimum === null
              ? "—"
              : recommended.savingsVsMinimum >= 0
                ? fmtUSD(recommended.savingsVsMinimum)
                : `−${fmtUSD(Math.abs(recommended.savingsVsMinimum))}`,
        },
        ...r.milestones.slice(1).map((m) => ({ label: `Milestone — ${m.label}`, value: m.monthLabel, hint: m.dateLabel })),
      ],
      comparison: {
        caption: "Six-strategy comparison for the numbers entered",
        columns: r.strategies.map((s) => s.name),
        rows: [
          { label: "Monthly", cells: r.strategies.map((s) => (s.available ? cell(s.monthly, (n) => `${fmtUSD(n)}/mo`) : "See note")) },
          { label: "Months", cells: r.strategies.map((s) => (s.months !== null ? fmtMonths(s.months) : "—")) },
          { label: "Total paid", cells: r.strategies.map((s) => cell(s.totalPaid, fmtUSD)) },
          { label: "Savings vs. minimums", cells: r.strategies.map((s) => (s.savingsVsMinimum === null ? "—" : s.savingsVsMinimum >= 0 ? fmtUSD(s.savingsVsMinimum) : `−${fmtUSD(Math.abs(s.savingsVsMinimum))}`)) },
          { label: "Availability", cells: r.strategies.map((s) => (s.available ? "Modeled" : s.availabilityNote ?? "—")) },
        ],
        note: "Full per-strategy cash-flow, DTI, credit, and difficulty notes appear on the results screen.",
      },
      options: r.options.map((o) => ({ name: o.name, why: o.why })),
      nextSteps: r.actionPlan.map((s) => `Month ${s.month}: ${s.title} — ${s.detail}`),
      assumptions: r.assumptions,
      methodology: [
        "Snowball, avalanche, and minimum-only rows run the WeHelpFinance Debt Payoff engine on a disclosed synthesized account split of your totals.",
        "Settlement reuses the Debt Settlement engine; consolidation uses the Personal Loan engine's band-typical APR at the shortest standard term fitting your budget.",
        "The Hybrid strategy clears the two smallest accounts first (momentum), then switches to highest-APR-first (math) — one documented simulator, capped at 50 years.",
        "DTI uses the same rounding and bands as the WeHelpFinance DTI Calculator. Educational estimates only.",
      ],
    };
  }, [result, recommended, inputs, goal]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* ── Inputs ── */}
      <div className="print:hidden">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-xl text-foreground">Your debt picture — and your goal</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything updates live — nothing is saved or sent anywhere.
          </p>

          <div className="mt-5 space-y-4">
            <ToolSelect id="df-goal" label="What matters most to you?" value={goal}
              onChange={(e) => onOptionChange("goal", () => setGoal(e.target.value as FinancialGoal))}
              options={GOAL_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} />
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolField id="df-debt" label="Total unsecured debt" value={debtStr}
                onChange={(e) => setDebtStr(e.target.value)} prefix="$" size="lg" placeholder="22,000" />
              <ToolField id="df-apr" label="Average interest rate" value={aprStr}
                onChange={(e) => setAprStr(e.target.value)} suffix="%" size="lg" placeholder="22.9" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolField id="df-payments" label="Current monthly debt payments" value={paymentsStr}
                onChange={(e) => setPaymentsStr(e.target.value)} prefix="$" placeholder="560" />
              <ToolField id="df-extra" label="Available extra per month" value={extraStr}
                onChange={(e) => setExtraStr(e.target.value)} prefix="$" placeholder="200" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolField id="df-income" label="Gross monthly income" value={incomeStr}
                onChange={(e) => setIncomeStr(e.target.value)} prefix="$" placeholder="5,800" />
              <ToolField id="df-expenses" label="Monthly living expenses" value={expensesStr}
                onChange={(e) => setExpensesStr(e.target.value)} prefix="$" placeholder="3,100" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolField id="df-accounts" label="Number of accounts" value={accountsStr}
                onChange={(e) => setAccountsStr(e.target.value)} inputMode="numeric" placeholder="4" />
              <ToolSelect id="df-credit" label="Credit score range" value={creditBand}
                onChange={(e) => onOptionChange("credit_band", () => setCreditBand(e.target.value as CreditBand))}
                options={CREDIT_BAND_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolSelect id="df-delinquency" label="Days behind on payments" value={delinquency}
                onChange={(e) => onOptionChange("delinquency", () => setDelinquency(e.target.value as DelinquencyStage))}
                options={DELINQUENCY_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} />
              <ToolSelect id="df-homeowner" label="Do you own a home?" value={homeowner}
                onChange={(e) => onOptionChange("homeowner", () => setHomeowner(e.target.value as "yes" | "no"))}
                options={[{ value: "no", label: "No" }, { value: "yes", label: "Yes" }]} />
            </div>
            <ToolSelect id="df-state" label="State" value={stateCode}
              onChange={(e) => onOptionChange("state", () => setStateCode(e.target.value))}
              options={STATE_OPTIONS} />
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="space-y-5">
        <div aria-live="polite" className="sr-only">
          {result && recommended
            ? `Best strategy for your goal: ${recommended.name}. ${recommended.months !== null ? `Debt free in ${fmtMonths(recommended.months)}.` : ""}${simResult && simRecommended?.months != null ? ` Simulated: debt free in ${fmtMonths(simRecommended.months)}.` : ""}`
            : invalidReason ?? ""}
        </div>

        {!result && (
          <NoticeBox tone="neutral">
            {invalidReason ?? "Enter your numbers on the left — the comparison updates live."}
          </NoticeBox>
        )}

        {result && recommended && (
          <>
            {/* Recommended hero */}
            <div className="rounded-3xl border border-primary/40 bg-primary-soft/20 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Best for your goal · {GOAL_OPTIONS.find((g) => g.value === goal)?.label}
              </p>
              <h3 className="mt-1 font-display text-2xl text-foreground">{recommended.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{result.recommendedWhy}</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <StatCard label="Debt-free" value={recommended.debtFreeLabel ?? "—"}
                  sub={recommended.months !== null ? fmtMonths(recommended.months) : undefined} tone="primary" />
                <StatCard label="Monthly payment"
                  value={recommended.monthly !== null ? `${fmtUSD(recommended.monthly)}/mo` : "—"}
                  sub={recommended.cashFlowNote} />
                <StatCard label="Estimated total paid"
                  value={recommended.totalPaid !== null ? fmtUSD(recommended.totalPaid) : "—"} />
                <StatCard label="Savings vs. minimums"
                  value={recommended.savingsVsMinimum === null ? "—" : recommended.savingsVsMinimum >= 0 ? fmtUSD(recommended.savingsVsMinimum) : `−${fmtUSD(Math.abs(recommended.savingsVsMinimum))}`}
                  tone={recommended.savingsVsMinimum !== null && recommended.savingsVsMinimum > 0 ? "success" : "default"} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Educational estimates — no outcome or approval is promised; lender and provider
              review decides real results.
            </p>

            {/* Timeline */}
            <div className="rounded-3xl border border-border bg-card p-5">
              <h3 className="font-display text-lg text-foreground">Your debt-freedom timeline</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Estimated milestones on the {recommended.name} path.
              </p>
              <div className="mt-3">
                <DebtFreedomTimeline
                  milestones={result.milestones}
                  ariaLabel={`Debt freedom timeline: ${result.milestones.map((m) => `${m.label} at ${m.monthLabel}`).join(", ")}.`}
                />
              </div>
            </div>

            {/* Six-strategy comparison */}
            <CompareTable
              caption="Six repayment strategies, priced for your numbers"
              columns={compareColumns}
              rows={compareRows}
            />

            {/* Cost bars */}
            <div className="rounded-3xl border border-border bg-card p-5">
              <h3 className="font-display text-lg text-foreground">Estimated total paid, side by side</h3>
              <div className="mt-4">
                <CostBars
                  ariaLabel="Estimated total paid per strategy"
                  items={result.strategies
                    .filter((s) => s.available && s.totalPaid !== null)
                    .map((s) => ({
                      label: s.name,
                      value: s.totalPaid as number,
                      tone: s.key === result.recommendedKey ? "primary" : s.key === "minimum" ? "muted" : "success",
                      note: fmtUSD(s.totalPaid as number),
                    }))}
                />
              </div>
            </div>

            {/* What-If */}
            <div className="rounded-3xl border border-primary/30 bg-primary-soft/20 p-5">
              <h3 className="font-display text-lg text-foreground">What if…?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try improvements — every strategy re-prices instantly, all on this page.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <ToolField id="wi-extra" label="Increase extra payment by" value={wiExtraStr}
                  onChange={(e) => { setWiExtraStr(e.target.value); onWhatIf("extra"); }} prefix="$" placeholder="150" />
                <ToolField id="wi-expcut" label="Reduce expenses by (→ extra)" value={wiExpCutStr}
                  onChange={(e) => { setWiExpCutStr(e.target.value); onWhatIf("expenses"); }} prefix="$" placeholder="120" />
                <ToolField id="wi-income" label="Increase monthly income by" value={wiIncomeStr}
                  onChange={(e) => { setWiIncomeStr(e.target.value); onWhatIf("income"); }} prefix="$" placeholder="400" />
                <ToolField id="wi-debtcut" label="Reduce debt via settlement by" value={wiDebtCutStr}
                  onChange={(e) => { setWiDebtCutStr(e.target.value); onWhatIf("settlement"); }} prefix="$" placeholder="6,000" />
                {homeowner === "yes" && (
                  <ToolField id="wi-refi" label="Refinance frees per month (→ extra)" value={wiRefiStr}
                    onChange={(e) => { setWiRefiStr(e.target.value); onWhatIf("refinance"); }} prefix="$" placeholder="180" />
                )}
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" checked={wiCreditBump}
                  onChange={(e) => { setWiCreditBump(e.target.checked); onWhatIf("credit"); }}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                Improve credit by one range
              </label>

              {simResult && simRecommended && (
                <div className="mt-4 rounded-2xl border border-border bg-card p-4 text-sm text-foreground">
                  <p className="font-semibold">Simulated best path: {simRecommended.name}</p>
                  <p className="mt-1 text-muted-foreground">
                    Debt-free {recommended.months !== null ? fmtMonths(recommended.months) : "—"} →{" "}
                    <span className="font-semibold text-foreground">
                      {simRecommended.months !== null ? fmtMonths(simRecommended.months) : "—"}
                    </span>
                    {recommended.months !== null && simRecommended.months !== null && (
                      <span className={simRecommended.months <= recommended.months ? "font-semibold text-success" : "font-semibold text-destructive"}>
                        {" "}({simRecommended.months <= recommended.months ? "−" : "+"}
                        {fmtMonths(Math.abs(recommended.months - simRecommended.months))})
                      </span>
                    )}
                    {" · "}Total paid{" "}
                    {recommended.totalPaid !== null ? fmtUSD(recommended.totalPaid) : "—"} →{" "}
                    {simRecommended.totalPaid !== null ? fmtUSD(simRecommended.totalPaid) : "—"}
                  </p>
                </div>
              )}
            </div>

            {/* Smart insights */}
            <div className="rounded-3xl border border-border bg-card p-5">
              <h3 className="font-display text-lg text-foreground">Which strategy wins what</h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {result.insights.map((x) => (
                  <li key={x.title} className="rounded-2xl border border-border bg-background p-3 text-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{x.title}</p>
                    <p className="mt-0.5 font-semibold text-foreground">{x.strategyName}</p>
                    <p className="mt-0.5 text-muted-foreground">{x.why}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action plan */}
            <div className="rounded-3xl border border-border bg-card p-5">
              <h3 className="font-display text-lg text-foreground">Your 6-month roadmap</h3>
              <ol className="mt-4 space-y-4">
                {result.actionPlan.map((step) => (
                  <li key={step.title} className="flex gap-3">
                    <span aria-hidden="true" className="flex h-7 w-14 shrink-0 items-center justify-center rounded-full bg-primary-soft font-display text-xs text-primary">
                      Mo {step.month}
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
                    <p className="font-semibold text-foreground">{idx + 1}. {o.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{o.why}</p>
                  </li>
                ))}
              </ol>
            </div>

            <NoticeBox tone="neutral">
              Educational planner only — not financial advice and not a promise of any
              outcome. Strategy availability notes explain when a path isn&rsquo;t priced for
              your numbers; nothing here is a rejection.
            </NoticeBox>

            {reportData && <ToolReportActions data={reportData} />}

            <SoftCTA
              heading="Want to talk through the strategy comparison?"
              body="Walk the six paths, the trade-offs, and your roadmap with a specialist — free and confidential."
              tool="debt_freedom"
              source="debt_freedom_planner"
            />
          </>
        )}
      </div>
    </div>
  );
}

