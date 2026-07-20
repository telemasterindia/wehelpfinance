// src/components/tools/BudgetPlanner.tsx
//
// Budget Planner — Sprint 8 client component. Inputs left (grouped
// fieldsets), live results right. Reuses FinancialHealthGauge for the
// Budget Health Score, DtiMeter, all shared primitives, and the
// shared report system. What-If runs the same pure engine on adjusted
// inputs — instant, on-page only. Analytics: grades/bands only.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  calculateBudget,
  validateBudgetInputs,
  BUDGET_GRADE_LABELS,
  BUDGET_GRADE_PHRASING,
  CREDIT_BAND_OPTIONS,
  type BudgetInputs,
  type BudgetOutput,
  type CreditBand,
} from "@/lib/calculators/budgetPlanner";
import { DTI_BANDS, METER_CAP } from "@/lib/calculators/dti";
import { fmtUSD, fmtMonths, parseMoney } from "@/lib/calculators/debtPayoff";
import { US_STATES } from "@/lib/calculators/usStates";
import { trackToolEvent } from "@/lib/calculators/track";
import { ToolField } from "@/components/tools/ToolField";
import { ToolSelect } from "@/components/tools/ToolSelect";
import { StatCard } from "@/components/tools/ToolCharts";
import { NoticeBox, SoftCTA } from "@/components/tools/ResultBlocks";
import { DtiMeter, type MeterZone } from "@/components/tools/DtiMeter";
import { FinancialHealthGauge } from "@/components/tools/FinancialHealthGauge";
import { SpendingDonut, RuleBars } from "@/components/tools/BudgetPlannerCharts";
import { ToolReportActions } from "@/components/tools/ToolReportActions";
import { reportDateLabel, type ToolReportData } from "@/lib/calculators/report";
import { ChevronDown } from "lucide-react";

const METER_ZONES: MeterZone[] = DTI_BANDS.map((b) => ({
  max: b.max === Infinity ? METER_CAP : b.max,
  label: b.label,
  tone: b.tone,
}));

const STATE_OPTIONS = US_STATES.map((s) => ({ value: s.code, label: s.name }));

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-border p-4">
      <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </legend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export function BudgetPlanner() {
  // ── Income ──
  const [grossStr, setGrossStr] = useState("5,800");
  const [otherIncStr, setOtherIncStr] = useState("");
  // ── Essentials ──
  const [housingStr, setHousingStr] = useState("1,600");
  const [utilitiesStr, setUtilitiesStr] = useState("240");
  const [insuranceStr, setInsuranceStr] = useState("180");
  const [transportStr, setTransportStr] = useState("320");
  const [fuelStr, setFuelStr] = useState("140");
  const [foodStr, setFoodStr] = useState("650");
  const [medicalStr, setMedicalStr] = useState("90");
  // ── Family ──
  const [childcareStr, setChildcareStr] = useState("");
  const [educationStr, setEducationStr] = useState("");
  // ── Lifestyle ──
  const [phoneStr, setPhoneStr] = useState("120");
  const [subsStr, setSubsStr] = useState("65");
  const [entStr, setEntStr] = useState("180");
  const [shopStr, setShopStr] = useState("220");
  // ── Money ──
  const [taxesStr, setTaxesStr] = useState("");
  const [savingsStr, setSavingsStr] = useState("250");
  const [retireStr, setRetireStr] = useState("200");
  const [debtStr, setDebtStr] = useState("480");
  const [otherExpStr, setOtherExpStr] = useState("");
  // ── Optional context ──
  const [showOptional, setShowOptional] = useState(false);
  const [efStr, setEfStr] = useState("");
  const [creditBand, setCreditBand] = useState<CreditBand>("good");
  const [homeowner, setHomeowner] = useState<"yes" | "no">("no");
  const [stateCode, setStateCode] = useState("TX");
  // ── What-If ──
  const [wiEntPct, setWiEntPct] = useState(false);      // reduce entertainment 50%
  const [wiCancelSubs, setWiCancelSubs] = useState(false);
  const [wiSaveStr, setWiSaveStr] = useState("");
  const [wiDebtExtraStr, setWiDebtExtraStr] = useState("");
  const [wiIncomeStr, setWiIncomeStr] = useState("");
  const [wiTransportStr, setWiTransportStr] = useState("");

  useEffect(() => {
    trackToolEvent("calculator_viewed", { tool: "budget_planner" });
  }, []);

  const inputs: BudgetInputs = useMemo(
    () => ({
      grossIncome: parseMoney(grossStr),
      otherIncome: parseMoney(otherIncStr),
      housing: parseMoney(housingStr),
      utilities: parseMoney(utilitiesStr),
      insurance: parseMoney(insuranceStr),
      transportation: parseMoney(transportStr),
      fuel: parseMoney(fuelStr),
      food: parseMoney(foodStr),
      medical: parseMoney(medicalStr),
      childcare: parseMoney(childcareStr),
      education: parseMoney(educationStr),
      phoneInternet: parseMoney(phoneStr),
      subscriptions: parseMoney(subsStr),
      entertainment: parseMoney(entStr),
      shopping: parseMoney(shopStr),
      taxes: parseMoney(taxesStr),
      savingsContribution: parseMoney(savingsStr),
      retirementContribution: parseMoney(retireStr),
      minDebtPayments: parseMoney(debtStr),
      otherExpenses: parseMoney(otherExpStr),
      emergencyFund: parseMoney(efStr),
      creditBand,
      homeowner: homeowner === "yes",
      state: stateCode,
    }),
    [
      grossStr, otherIncStr, housingStr, utilitiesStr, insuranceStr, transportStr, fuelStr,
      foodStr, medicalStr, childcareStr, educationStr, phoneStr, subsStr, entStr, shopStr,
      taxesStr, savingsStr, retireStr, debtStr, otherExpStr, efStr, creditBand, homeowner, stateCode,
    ]
  );

  const output: BudgetOutput = useMemo(() => calculateBudget(inputs), [inputs]);
  const invalidReason = validateBudgetInputs(inputs);
  const result = output.ok ? output : null;

  // ── What-If simulation (same pure engine) ──
  const whatIfActive =
    wiEntPct || wiCancelSubs ||
    wiSaveStr.trim() !== "" || wiDebtExtraStr.trim() !== "" ||
    wiIncomeStr.trim() !== "" || wiTransportStr.trim() !== "";

  const simResult = useMemo(() => {
    if (!result || !whatIfActive) return null;
    const sim: BudgetInputs = {
      ...inputs,
      grossIncome: inputs.grossIncome + parseMoney(wiIncomeStr),
      entertainment: wiEntPct ? Math.round(inputs.entertainment * 0.5) : inputs.entertainment,
      subscriptions: wiCancelSubs ? 0 : inputs.subscriptions,
      savingsContribution: inputs.savingsContribution + parseMoney(wiSaveStr),
      minDebtPayments: inputs.minDebtPayments + parseMoney(wiDebtExtraStr),
      transportation: Math.max(0, inputs.transportation - parseMoney(wiTransportStr)),
    };
    const out = calculateBudget(sim);
    return out.ok ? out : null;
  }, [result, whatIfActive, inputs, wiIncomeStr, wiEntPct, wiCancelSubs, wiSaveStr, wiDebtExtraStr, wiTransportStr]);

  // ── Debounced completion (grades/bands only) ──
  const completeTimer = useRef<number | null>(null);
  useEffect(() => {
    if (!result) return;
    if (completeTimer.current) window.clearTimeout(completeTimer.current);
    const cfBand = result.netCashFlow < 0 ? "negative" : result.netCashFlow < result.totalIncome * 0.05 ? "tight" : "healthy";
    const svBand = result.savingsRatePct >= 20 ? "20_plus" : result.savingsRatePct >= 10 ? "10_20" : result.savingsRatePct > 0 ? "under_10" : "zero";
    completeTimer.current = window.setTimeout(() => {
      trackToolEvent("calculation_completed", {
        tool: "budget_planner",
        budget_grade: result.grade,
        dti_band: result.dtiBand.key,
        cf_band: cfBand,
        savings_band: svBand,
      });
    }, 1200);
    return () => {
      if (completeTimer.current) window.clearTimeout(completeTimer.current);
    };
  }, [result]);

  function onOptionChange(name: string, apply: () => void) {
    apply();
    trackToolEvent("tool_option_changed", { tool: "budget_planner", option: name });
  }
  function onWhatIf(lever: string) {
    trackToolEvent("tool_option_changed", { tool: "budget_planner", option: `whatif_${lever}` });
  }

  // ── Report data (pre-formatted strings only) ──
  const reportData: ToolReportData | null = useMemo(() => {
    if (!result) return null;
    const r = result;
    return {
      toolSlug: "budget_planner",
      title: "Household Budget Report",
      generatedLabel: reportDateLabel(),
      snapshot: [
        { label: "Total monthly income", value: fmtUSD(r.totalIncome) },
        { label: "Total monthly outflow", value: fmtUSD(r.totalOutflow) },
        { label: "Net cash flow", value: r.netCashFlow >= 0 ? fmtUSD(r.netCashFlow) : `−${fmtUSD(Math.abs(r.netCashFlow))}` },
        { label: "Savings rate", value: `${r.savingsRatePct.toFixed(1)}%` },
        { label: "Debt payment ratio", value: `${r.debtPaymentRatioPct.toFixed(1)}%` },
        { label: "Estimated DTI", value: `${r.dtiDisplayed.toFixed(1)}%`, hint: r.dtiBand.label },
      ],
      results: [
        {
          label: "Budget Health Score",
          value: `${r.score}/100`,
          hint: `${BUDGET_GRADE_LABELS[r.grade]} — educational score, not a credit score`,
        },
        ...r.factors.map((f) => ({
          label: f.label,
          value: `${f.points}/${f.max} pts`,
          hint: f.detail,
        })),
        ...(r.emergencyMonths !== null
          ? [{ label: "Emergency cushion", value: `${r.emergencyMonths.toFixed(1)} months` }]
          : []),
        ...(r.monthsSaved !== null && r.monthsSaved > 0
          ? [{
              label: "Debt-freedom acceleration",
              value: `~${fmtMonths(r.monthsSaved)} sooner`,
              hint: `redirecting ${fmtUSD(r.availableExtra)}/mo surplus (baseline assumptions)`,
            }]
          : []),
      ],
      comparison: {
        caption: "Spending breakdown (share of total monthly outflow)",
        columns: ["Amount", "Share"],
        rows: r.slices.map((s) => ({
          label: s.label,
          cells: [fmtUSD(s.amount), `${s.pct.toFixed(1)}%`],
        })),
        note: "50/30/20 view — Needs " + r.ruleRows[0].actualPct.toFixed(1) + "% (guideline 50%), Wants " + r.ruleRows[1].actualPct.toFixed(1) + "% (30%), Savings " + r.ruleRows[2].actualPct.toFixed(1) + "% (20%).",
      },
      options: r.options.map((o) => ({ name: o.name, why: o.why })),
      nextSteps: r.actionPlan.map((s) => `Month ${s.month}: ${s.title} — ${s.detail}`),
      assumptions: r.assumptions,
      methodology: [
        "Budget Health Score = cash-flow margin 30 + savings rate 25 + DTI 25 + essentials share 20 (weights and anchors disclosed in the assumptions).",
        "DTI uses the same rounding and bands as the WeHelpFinance DTI Calculator.",
        "Debt-freedom estimates use the platform's disclosed 22% revolving baseline and 3% minimum-payment convention — your real balances and APRs will differ.",
        "This is an educational budgeting score — it is not a credit score and is not used by any lender.",
      ],
    };
  }, [result]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* ── Inputs ── */}
      <div className="print:hidden">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-xl text-foreground">Your monthly money map</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything updates live — nothing is saved or sent anywhere. Leave any line at
            blank or 0 if it doesn&rsquo;t apply.
          </p>

          <div className="mt-5 space-y-4">
            <Group title="Income">
              <ToolField id="bp-gross" label="Gross monthly income" value={grossStr}
                onChange={(e) => setGrossStr(e.target.value)} prefix="$" size="lg" placeholder="5,800" />
              <ToolField id="bp-other-inc" label="Other monthly income" value={otherIncStr}
                onChange={(e) => setOtherIncStr(e.target.value)} prefix="$" placeholder="0" />
            </Group>

            <Group title="Essentials">
              <ToolField id="bp-housing" label="Housing (rent or mortgage)" value={housingStr}
                onChange={(e) => setHousingStr(e.target.value)} prefix="$" placeholder="1,600" />
              <ToolField id="bp-utilities" label="Utilities" value={utilitiesStr}
                onChange={(e) => setUtilitiesStr(e.target.value)} prefix="$" placeholder="240" />
              <ToolField id="bp-insurance" label="Insurance" value={insuranceStr}
                onChange={(e) => setInsuranceStr(e.target.value)} prefix="$" placeholder="180" />
              <ToolField id="bp-transport" label="Transportation" value={transportStr}
                onChange={(e) => setTransportStr(e.target.value)} prefix="$" placeholder="320" />
              <ToolField id="bp-fuel" label="Fuel" value={fuelStr}
                onChange={(e) => setFuelStr(e.target.value)} prefix="$" placeholder="140" />
              <ToolField id="bp-food" label="Food" value={foodStr}
                onChange={(e) => setFoodStr(e.target.value)} prefix="$" placeholder="650" />
              <ToolField id="bp-medical" label="Medical" value={medicalStr}
                onChange={(e) => setMedicalStr(e.target.value)} prefix="$" placeholder="90" />
              <ToolField id="bp-phone" label="Phone / Internet" value={phoneStr}
                onChange={(e) => setPhoneStr(e.target.value)} prefix="$" placeholder="120" />
            </Group>

            <Group title="Family (if any)">
              <ToolField id="bp-childcare" label="Childcare" value={childcareStr}
                onChange={(e) => setChildcareStr(e.target.value)} prefix="$" placeholder="0" />
              <ToolField id="bp-education" label="Education" value={educationStr}
                onChange={(e) => setEducationStr(e.target.value)} prefix="$" placeholder="0" />
            </Group>

            <Group title="Lifestyle">
              <ToolField id="bp-subs" label="Subscriptions" value={subsStr}
                onChange={(e) => setSubsStr(e.target.value)} prefix="$" placeholder="65" />
              <ToolField id="bp-ent" label="Entertainment" value={entStr}
                onChange={(e) => setEntStr(e.target.value)} prefix="$" placeholder="180" />
              <ToolField id="bp-shop" label="Shopping" value={shopStr}
                onChange={(e) => setShopStr(e.target.value)} prefix="$" placeholder="220" />
              <ToolField id="bp-other-exp" label="Other monthly expenses" value={otherExpStr}
                onChange={(e) => setOtherExpStr(e.target.value)} prefix="$" placeholder="0" />
            </Group>

            <Group title="Savings & debt">
              <ToolField id="bp-savings" label="Savings contribution" value={savingsStr}
                onChange={(e) => setSavingsStr(e.target.value)} prefix="$" placeholder="250" />
              <ToolField id="bp-retire" label="Retirement contribution" value={retireStr}
                onChange={(e) => setRetireStr(e.target.value)} prefix="$" placeholder="200" />
              <ToolField id="bp-debt" label="Minimum debt payments" value={debtStr}
                onChange={(e) => setDebtStr(e.target.value)} prefix="$" placeholder="480" />
              <ToolField id="bp-taxes" label="Taxes (optional)" value={taxesStr}
                onChange={(e) => setTaxesStr(e.target.value)} prefix="$" placeholder="0" />
            </Group>

            <div className="rounded-2xl border border-border bg-background">
              <button
                type="button"
                onClick={() => setShowOptional((s) => !s)}
                aria-expanded={showOptional}
                aria-controls="bp-optional"
                className="flex w-full items-center justify-between gap-2 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                Add context (optional — sharpens insights, never the score)
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform motion-reduce:transition-none ${showOptional ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {showOptional && (
                <div id="bp-optional" className="grid gap-4 border-t border-border p-4 sm:grid-cols-2">
                  <ToolField id="bp-ef" label="Emergency fund balance" value={efStr}
                    onChange={(e) => setEfStr(e.target.value)} prefix="$" placeholder="2,500" />
                  <ToolSelect id="bp-credit" label="Credit score range" value={creditBand}
                    onChange={(e) => onOptionChange("credit_band", () => setCreditBand(e.target.value as CreditBand))}
                    options={CREDIT_BAND_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} />
                  <ToolSelect id="bp-homeowner" label="Do you own a home?" value={homeowner}
                    onChange={(e) => onOptionChange("homeowner", () => setHomeowner(e.target.value as "yes" | "no"))}
                    options={[{ value: "no", label: "No" }, { value: "yes", label: "Yes" }]} />
                  <ToolSelect id="bp-state" label="State" value={stateCode}
                    onChange={(e) => onOptionChange("state", () => setStateCode(e.target.value))}
                    options={STATE_OPTIONS} />
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
            ? `Budget Health Score ${result.score} out of 100, ${BUDGET_GRADE_LABELS[result.grade]}. Net cash flow ${fmtUSD(result.netCashFlow)} per month.${simResult ? ` Simulated score ${simResult.score}.` : ""}`
            : invalidReason ?? ""}
        </div>

        {!result && (
          <NoticeBox tone="neutral">
            {invalidReason ?? "Enter your numbers on the left — the budget updates live."}
          </NoticeBox>
        )}

        {result && (
          <>
            {/* Score hero — reuses the platform gauge */}
            <div className="rounded-3xl border border-border bg-card p-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Budget Health Score
              </p>
              <div className="mx-auto mt-2 flex justify-center">
                <FinancialHealthGauge
                  score={result.score}
                  gradeLabel={BUDGET_GRADE_LABELS[result.grade]}
                  ariaLabel={`Budget Health Score ${result.score} out of 100 — ${BUDGET_GRADE_LABELS[result.grade]}`}
                />
              </div>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                {BUDGET_GRADE_PHRASING[result.grade]}
              </p>
            </div>

            {/* Headline stats */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Total income" value={fmtUSD(result.totalIncome)} sub="per month" />
              <StatCard label="Total outflow" value={fmtUSD(result.totalOutflow)} sub="every line item" />
              <StatCard
                label="Net cash flow"
                value={result.netCashFlow >= 0 ? fmtUSD(result.netCashFlow) : `−${fmtUSD(Math.abs(result.netCashFlow))}`}
                sub="unallocated margin"
                tone={result.netCashFlow > 0 ? "success" : "default"}
              />
              <StatCard
                label="Savings rate"
                value={`${result.savingsRatePct.toFixed(1)}%`}
                sub="guideline: 20%"
                tone={result.savingsRatePct >= 20 ? "success" : "default"}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Educational estimates — this is a budgeting score, not a credit score, and no
              lender sees or uses it.
            </p>

            {/* Score factors */}
            <div className="rounded-3xl border border-border bg-card p-5">
              <h3 className="font-display text-lg text-foreground">Why this score</h3>
              <ul className="mt-3 space-y-3">
                {result.factors.map((f) => (
                  <li key={f.label}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="font-medium text-foreground">{f.label}</span>
                      <span className="shrink-0 text-muted-foreground">{f.points}/{f.max} pts</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted" aria-hidden="true">
                      <div
                        className={`h-full rounded-full ${f.points / f.max >= 0.7 ? "bg-success" : f.points / f.max >= 0.4 ? "bg-gold" : "bg-destructive/70"} motion-safe:transition-all motion-safe:duration-500`}
                        style={{ width: `${(f.points / f.max) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{f.detail}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Spending breakdown */}
            <div className="rounded-3xl border border-border bg-card p-5">
              <h3 className="font-display text-lg text-foreground">Where the money goes</h3>
              <div className="mt-4">
                <SpendingDonut
                  slices={result.slices}
                  ariaLabel={`Spending breakdown of ${fmtUSD(result.totalOutflow)} monthly outflow across eight categories; largest is ${result.slices.slice().sort((a, b) => b.pct - a.pct)[0].label}.`}
                />
              </div>
            </div>

            {/* 50/30/20 */}
            <div className="rounded-3xl border border-border bg-card p-5">
              <h3 className="font-display text-lg text-foreground">Your budget vs. the 50/30/20 guideline</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                A comparison, not a verdict — the guideline is a teaching tool, and real
                budgets differ for real reasons. Dashed marks show the guideline.
              </p>
              <div className="mt-4">
                <RuleBars
                  rows={result.ruleRows}
                  ariaLabel={`50/30/20 comparison: needs ${result.ruleRows[0].actualPct.toFixed(1)} percent versus 50, wants ${result.ruleRows[1].actualPct.toFixed(1)} versus 30, savings ${result.ruleRows[2].actualPct.toFixed(1)} versus 20.`}
                />
              </div>
            </div>

            {/* DTI */}
            <div className="rounded-3xl border border-border bg-card p-5">
              <h3 className="font-display text-lg text-foreground">Estimated DTI</h3>
              <div className="mt-4">
                <DtiMeter
                  value={result.dtiDisplayed}
                  displayValue={`${result.dtiDisplayed.toFixed(1)}%`}
                  zones={METER_ZONES}
                  cap={METER_CAP}
                  bandLabel={result.dtiBand.label}
                  ariaContext="Estimated debt-to-income ratio from this budget"
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Debt payment ratio {result.debtPaymentRatioPct.toFixed(1)}% of income
                {result.emergencyMonths !== null
                  ? ` · emergency cushion ${result.emergencyMonths.toFixed(1)} months`
                  : ""}.
              </p>
            </div>

            {/* Debt freedom acceleration */}
            {result.monthsSaved !== null && result.monthsSaved > 0 && (
              <NoticeBox tone="neutral">
                Redirecting your {fmtUSD(result.availableExtra)}/mo surplus to debt could move
                estimated payoff from {fmtMonths(result.baselineMonths!)} to{" "}
                {fmtMonths(result.acceleratedMonths!)} — about{" "}
                <span className="font-semibold">{fmtMonths(result.monthsSaved)} sooner</span> and{" "}
                {fmtUSD(result.interestSaved!)} less interest at the baseline assumptions.
              </NoticeBox>
            )}

            {/* What-If simulator */}
            <div className="rounded-3xl border border-primary/30 bg-primary-soft/20 p-5">
              <h3 className="font-display text-lg text-foreground">What if…?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try changes and watch cash flow, score, and DTI respond instantly — all on
                this page.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={wiEntPct}
                    onChange={(e) => { setWiEntPct(e.target.checked); onWhatIf("entertainment"); }}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                  Cut entertainment in half
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={wiCancelSubs}
                    onChange={(e) => { setWiCancelSubs(e.target.checked); onWhatIf("subscriptions"); }}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                  Cancel all subscriptions
                </label>
                <ToolField id="wi-save" label="Add to monthly savings" value={wiSaveStr}
                  onChange={(e) => { setWiSaveStr(e.target.value); onWhatIf("savings"); }} prefix="$" placeholder="150" />
                <ToolField id="wi-debt" label="Extra toward debt payments" value={wiDebtExtraStr}
                  onChange={(e) => { setWiDebtExtraStr(e.target.value); onWhatIf("debt"); }} prefix="$" placeholder="200" />
                <ToolField id="wi-income" label="Increase monthly income by" value={wiIncomeStr}
                  onChange={(e) => { setWiIncomeStr(e.target.value); onWhatIf("income"); }} prefix="$" placeholder="400" />
                <ToolField id="wi-transport" label="Reduce transportation by" value={wiTransportStr}
                  onChange={(e) => { setWiTransportStr(e.target.value); onWhatIf("transportation"); }} prefix="$" placeholder="100" />
              </div>

              {simResult && (
                <div className="mt-4 rounded-2xl border border-border bg-card p-4">
                  <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
                    <FinancialHealthGauge
                      compact
                      score={simResult.score}
                      gradeLabel={BUDGET_GRADE_LABELS[simResult.grade]}
                      ariaLabel={`Simulated Budget Health Score ${simResult.score} out of 100 — ${BUDGET_GRADE_LABELS[simResult.grade]}`}
                    />
                    <div className="text-sm text-foreground">
                      <p>
                        Score {result.score} →{" "}
                        <span className="font-display text-xl">{simResult.score}</span>{" "}
                        <span className={simResult.score >= result.score ? "font-semibold text-success" : "font-semibold text-destructive"}>
                          ({simResult.score >= result.score ? "+" : ""}{simResult.score - result.score})
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Cash flow {fmtUSD(result.netCashFlow)} → {fmtUSD(simResult.netCashFlow)} · DTI{" "}
                        {result.dtiDisplayed.toFixed(1)}% → {simResult.dtiDisplayed.toFixed(1)}%
                        {simResult.monthsSaved !== null && simResult.monthsSaved > 0
                          ? ` · debt-free ~${fmtMonths(simResult.monthsSaved)} sooner`
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Smart insights */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-card p-5">
                <h3 className="font-display text-lg text-foreground">Top spending categories</h3>
                <ol className="mt-3 space-y-3">
                  {result.insights.topSpending.map((x) => (
                    <li key={x.title} className="text-sm">
                      <p className="font-medium text-foreground">{x.title}</p>
                      <p className="mt-0.5 text-muted-foreground">{x.detail}</p>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-3xl border border-border bg-card p-5">
                <h3 className="font-display text-lg text-foreground">Cash-flow opportunities</h3>
                <ul className="mt-3 space-y-3">
                  {result.insights.cashFlow.map((x) => (
                    <li key={x.title} className="text-sm">
                      <p className="font-medium text-foreground">{x.title}</p>
                      <p className="mt-0.5 text-muted-foreground">{x.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-border bg-card p-5">
                <h3 className="font-display text-lg text-foreground">Savings opportunities</h3>
                <ul className="mt-3 space-y-3">
                  {result.insights.savings.map((x) => (
                    <li key={x.title} className="text-sm">
                      <p className="font-medium text-foreground">{x.title}</p>
                      <p className="mt-0.5 text-muted-foreground">{x.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-border bg-card p-5">
                <h3 className="font-display text-lg text-foreground">Debt & emergency fund</h3>
                <ul className="mt-3 space-y-3">
                  {[...result.insights.debt, ...result.insights.emergency].map((x) => (
                    <li key={x.title} className="text-sm">
                      <p className="font-medium text-foreground">{x.title}</p>
                      <p className="mt-0.5 text-muted-foreground">{x.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Monthly action plan */}
            <div className="rounded-3xl border border-border bg-card p-5">
              <h3 className="font-display text-lg text-foreground">Your monthly action plan</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                One focus per month, in the order that compounds.
              </p>
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
              Educational budgeting tool only — not financial advice, not a credit score, and
              not used by any lender. Product eligibility and pricing are set by each
              lender&rsquo;s or provider&rsquo;s own review.
            </NoticeBox>

            {reportData && <ToolReportActions data={reportData} />}

            <SoftCTA
              heading="Want a human look at your budget?"
              body="Talk through the plan, the debt lines, and the options behind them with a specialist — free and confidential."
              tool="budget_planner"
              source="budget_planner_calculator"
            />
          </>
        )}
      </div>
    </div>
  );
}

