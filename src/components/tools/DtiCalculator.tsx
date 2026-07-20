// src/components/tools/DtiCalculator.tsx
//
// Debt-to-Income Calculator — Sprint 3. Client component on the
// shared Financial Tools platform. Two modes (Current / Mortgage-
// qualification), live computation, banded meter, lender threshold
// table, gap analysis with directional rounding, what-if scenarios,
// and the platform soft CTA. Reuses ToolField, ToolSelect, StatCard,
// CostBars, ResultBlocks, DtiMeter, shared parsers and analytics.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Landmark,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import {
  computeDti,
  DTI_BANDS,
  METER_CAP,
  whatIfRemovePayment,
  whatIfAddIncome,
  whatIfProposedPayment,
  HOUSING_STATUS_OPTIONS,
  INCOME_PERIOD_OPTIONS,
} from "@/lib/calculators/dti";
import type {
  DtiInputs,
  DtiMode,
  DtiResult,
  HousingStatus,
  IncomePeriod,
  ThresholdStatus,
} from "@/lib/calculators/dti";
import { fmtUSD, parseMoney } from "@/lib/calculators/debtPayoff";
import { trackToolEvent } from "@/lib/calculators/track";
import { ToolReportActions } from "@/components/tools/ToolReportActions";
import { reportDateLabel } from "@/lib/calculators/report";
import { ToolField } from "@/components/tools/ToolField";
import { ToolSelect } from "@/components/tools/ToolSelect";
import { StatCard } from "@/components/tools/ToolCharts";
import { CostBars } from "@/components/tools/ComparisonCharts";
import { DtiMeter, IncomeAllocationBar } from "@/components/tools/DtiMeter";
import type { MeterZone } from "@/components/tools/DtiMeter";
import { HeroStat, NoticeBox, SoftCTA } from "@/components/tools/ResultBlocks";

const METER_ZONES: MeterZone[] = DTI_BANDS.map((b) => ({
  max: b.max === Infinity ? METER_CAP : b.max,
  label: b.label,
  tone: b.tone,
}));

const STATUS_META: Record<
  ThresholdStatus,
  { label: string; cls: string; Icon: typeof CheckCircle2 }
> = {
  pass: { label: "Within guideline", cls: "text-success", Icon: CheckCircle2 },
  borderline: {
    label: "Compensating factors needed",
    cls: "text-gold",
    Icon: AlertTriangle,
  },
  above: { label: "Above ceiling", cls: "text-destructive", Icon: XCircle },
};

export function DtiCalculator() {
  // ── Mode & income ──
  const [mode, setMode] = useState<DtiMode>("current");
  const [income, setIncome] = useState("");
  const [period, setPeriod] = useState<IncomePeriod>("monthly");
  const [coIncome, setCoIncome] = useState("");
  // ── Housing ──
  const [housingStatus, setHousingStatus] = useState<HousingStatus | "">("");
  const [currentHousing, setCurrentHousing] = useState("");
  const [proposedHousing, setProposedHousing] = useState("");
  // ── Debts ──
  const [auto, setAuto] = useState("");
  const [student, setStudent] = useState("");
  const [cards, setCards] = useState("");
  const [personal, setPersonal] = useState("");
  const [support, setSupport] = useState("");
  const [other, setOther] = useState("");
  // ── What-if ──
  const [wifRemove, setWifRemove] = useState("");
  const [wifIncome, setWifIncome] = useState("");
  const [wifProposed, setWifProposed] = useState("");

  const completedHash = useRef("");

  useEffect(() => {
    trackToolEvent("calculator_viewed", { tool: "dti" });
  }, []);

  function switchMode(next: DtiMode) {
    if (next === mode) return;
    setMode(next);
    trackToolEvent("mode_switched", { tool: "dti", mode: next });
  }
  function onModeKeyDown(e: React.KeyboardEvent) {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      switchMode(mode === "current" ? "mortgage" : "current");
    }
  }
  function switchPeriod(next: IncomePeriod) {
    if (next === period) return;
    setPeriod(next);
    trackToolEvent("tool_option_changed", {
      tool: "dti",
      option: "income_period",
      value: next,
    });
  }
  function onPeriodKeyDown(e: React.KeyboardEvent) {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      switchPeriod(period === "monthly" ? "annual" : "monthly");
    }
  }

  const inputs: DtiInputs = useMemo(
    () => ({
      mode,
      grossIncome: parseMoney(income),
      incomePeriod: period,
      coBorrowerIncome: parseMoney(coIncome),
      housingStatus: (housingStatus || "rent") as HousingStatus,
      currentHousing: parseMoney(currentHousing),
      proposedHousing: parseMoney(proposedHousing),
      debts: {
        auto: parseMoney(auto),
        student: parseMoney(student),
        cards: parseMoney(cards),
        personal: parseMoney(personal),
        support: parseMoney(support),
        other: parseMoney(other),
      },
    }),
    [
      mode,
      income,
      period,
      coIncome,
      housingStatus,
      currentHousing,
      proposedHousing,
      auto,
      student,
      cards,
      personal,
      support,
      other,
    ],
  );

  const readyToCompute =
    parseMoney(income) + parseMoney(coIncome) > 0 &&
    (mode === "mortgage"
      ? parseMoney(proposedHousing) > 0
      : housingStatus !== "");

  const output = useMemo(
    () => (readyToCompute ? computeDti(inputs) : null),
    [readyToCompute, inputs],
  );
  const result: DtiResult | null = output && output.ok ? output : null;
  const blockingReason = output && !output.ok ? output.reason : null;

  // calculation_completed — debounced, ratios only (privacy standard §15).
  useEffect(() => {
    if (!result) return;
    const hash = `${result.mode}|${result.backEnd}|${result.frontEnd}|${result.gmi > 0 ? 1 : 0}|${parseMoney(coIncome) > 0 ? 1 : 0}`;
    if (hash === completedHash.current) return;
    const t = setTimeout(() => {
      completedHash.current = hash;
      trackToolEvent("calculation_completed", {
        tool: "dti",
        mode: result.mode,
        dti_back: result.backEnd,
        band: result.band.key,
        has_coborrower: parseMoney(coIncome) > 0,
      });
    }, 900);
    return () => clearTimeout(t);
  }, [result, coIncome]);

  // What-if computations (instant, pure).
  const wifRemoveRes =
    result && parseMoney(wifRemove) > 0
      ? whatIfRemovePayment(result, parseMoney(wifRemove))
      : null;
  const wifIncomeRes =
    result && parseMoney(wifIncome) > 0
      ? whatIfAddIncome(result, parseMoney(wifIncome))
      : null;
  const wifProposedRes =
    result && mode === "mortgage" && parseMoney(wifProposed) > 0
      ? whatIfProposedPayment(result, parseMoney(wifProposed))
      : null;

  const housingLabel =
    housingStatus === "own-mortgage" || housingStatus === "own-clear"
      ? "Monthly mortgage payment (PITI + HOA)"
      : "Monthly rent";

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
      {/* ══════════════ LEFT — Inputs ══════════════ */}
      <div>
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
          {/* Mode toggle */}
          <p
            id="dti-mode-label"
            className="mb-2 text-sm font-medium text-foreground"
          >
            What do you want to check?
          </p>
          <div
            role="radiogroup"
            aria-labelledby="dti-mode-label"
            onKeyDown={onModeKeyDown}
            className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-background p-1.5"
          >
            <button
              type="button"
              role="radio"
              aria-checked={mode === "current"}
              tabIndex={mode === "current" ? 0 : -1}
              onClick={() => switchMode("current")}
              className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                mode === "current"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <TrendingDown className="h-4 w-4" aria-hidden="true" /> My
                current DTI
              </span>
              <span className="text-[11px] font-normal opacity-80">
                Where you stand today
              </span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={mode === "mortgage"}
              tabIndex={mode === "mortgage" ? 0 : -1}
              onClick={() => switchMode("mortgage")}
              className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                mode === "mortgage"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <Landmark className="h-4 w-4" aria-hidden="true" /> Mortgage /
                refinance
              </span>
              <span className="text-[11px] font-normal opacity-80">
                As a lender computes it
              </span>
            </button>
          </div>

          {/* Income */}
          <div className="mt-6 border-t border-border pt-5">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h2 className="!m-0 font-display text-lg text-foreground">
                Income
              </h2>
              <div
                role="radiogroup"
                aria-label="Income period"
                onKeyDown={onPeriodKeyDown}
                className="flex gap-1 rounded-full border border-border bg-background p-1"
              >
                {INCOME_PERIOD_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={period === o.value}
                    tabIndex={period === o.value ? 0 : -1}
                    onClick={() => switchPeriod(o.value)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                      period === o.value
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolField
                id="dti-income"
                label={`Gross income (${period === "annual" ? "annual" : "monthly"}, pre-tax)`}
                prefix="$"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder={period === "annual" ? "78,000" : "6,500"}
                size="lg"
              />
              <ToolField
                id="dti-co-income"
                label="Co-borrower gross income (optional)"
                prefix="$"
                value={coIncome}
                onChange={(e) => setCoIncome(e.target.value)}
                placeholder={period === "annual" ? "38,400" : "3,200"}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Before taxes and deductions — include all stable income sources.
              The period toggle applies to both fields.
            </p>
          </div>

          {/* Housing */}
          <div className="mt-6 border-t border-border pt-5">
            <h2 className="!m-0 mb-3 font-display text-lg text-foreground">
              Housing
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolSelect
                id="dti-housing-status"
                label="Housing status"
                value={housingStatus}
                onChange={(e) =>
                  setHousingStatus(e.target.value as HousingStatus)
                }
                options={HOUSING_STATUS_OPTIONS}
                placeholder="Select housing status"
              />
              {housingStatus !== "none" && housingStatus !== "" && (
                <div className={mode === "mortgage" ? "opacity-70" : ""}>
                  <ToolField
                    id="dti-current-housing"
                    label={housingLabel}
                    prefix="$"
                    value={currentHousing}
                    onChange={(e) => setCurrentHousing(e.target.value)}
                    placeholder="1,650"
                  />
                  {mode === "mortgage" && (
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Excluded from this check — this payment goes away at
                      closing.
                    </p>
                  )}
                </div>
              )}
              {mode === "mortgage" && (
                <ToolField
                  id="dti-proposed"
                  label="Proposed monthly payment (PITI + HOA)"
                  prefix="$"
                  value={proposedHousing}
                  onChange={(e) => setProposedHousing(e.target.value)}
                  placeholder="2,100"
                  size="lg"
                />
              )}
            </div>
            {housingStatus === "own-mortgage" ||
            housingStatus === "own-clear" ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Include principal, interest, property taxes, insurance, and HOA.
              </p>
            ) : null}
          </div>

          {/* Debts */}
          <div className="mt-6 border-t border-border pt-5">
            <h2 className="!m-0 mb-3 font-display text-lg text-foreground">
              Monthly debt payments
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolField
                id="dti-auto"
                label="Auto loans / leases"
                prefix="$"
                value={auto}
                onChange={(e) => setAuto(e.target.value)}
                placeholder="420"
              />
              <div>
                <ToolField
                  id="dti-student"
                  label="Student loans"
                  prefix="$"
                  value={student}
                  onChange={(e) => setStudent(e.target.value)}
                  placeholder="180"
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Enter what a lender would count — deferred loans are often
                  counted at 0.5–1% of balance.
                </p>
              </div>
              <div>
                <ToolField
                  id="dti-cards"
                  label="Credit card minimums (all cards)"
                  prefix="$"
                  value={cards}
                  onChange={(e) => setCards(e.target.value)}
                  placeholder="240"
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Minimums only — not what you actually pay.
                </p>
              </div>
              <ToolField
                id="dti-personal"
                label="Personal / installment loans"
                prefix="$"
                value={personal}
                onChange={(e) => setPersonal(e.target.value)}
                placeholder="300"
              />
              <ToolField
                id="dti-support"
                label="Child support / alimony you pay"
                prefix="$"
                value={support}
                onChange={(e) => setSupport(e.target.value)}
                placeholder="0"
              />
              <div>
                <ToolField
                  id="dti-other"
                  label="Other monthly debt payments"
                  prefix="$"
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                  placeholder="0"
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Other mortgages, IRS payment plans, etc.
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Don't include utilities, groceries, insurance, phone, or streaming
              — lenders don't count them in DTI.
            </p>
          </div>

          {blockingReason && (
            <div className="mt-4">
              <NoticeBox tone="amber">{blockingReason}</NoticeBox>
            </div>
          )}
        </div>

        {/* Charts + what-if — left column, below inputs (platform layout) */}
        {result && (
          <div className="mt-6 space-y-6">
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
              <h3 className="!mt-0 font-display text-lg text-foreground">
                Your monthly debt vs. lender ceilings
              </h3>
              <p className="mb-4 mt-1 text-sm text-muted-foreground">
                The same thresholds, translated into dollars per month.
              </p>
              <CostBars
                ariaLabel="Your total monthly debt compared with the maximum allowed at common DTI thresholds"
                items={[
                  {
                    label: "Your total monthly debt",
                    value: result.totalMonthlyDebt,
                    tone: "primary",
                  },
                  ...result.gaps.map((g) => ({
                    label: `Max at ${g.target}% DTI`,
                    value: g.maxTotalDebt,
                    tone: "muted" as const,
                    note:
                      g.headroom !== null
                        ? `${fmtUSD(g.headroom)}/mo headroom`
                        : `reduce by ${fmtUSD(g.reductionNeeded ?? 0)}/mo to reach`,
                  })),
                ]}
              />
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
              <h3 className="!mt-0 font-display text-lg text-foreground">
                Where your income goes
              </h3>
              <p className="mb-4 mt-1 text-sm text-muted-foreground">
                Gross monthly income of {fmtUSD(result.gmi)}, split by
                obligation.
              </p>
              <IncomeAllocationBar
                housingPct={result.allocation.housingPct}
                otherPct={result.allocation.otherPct}
                remainingPct={result.allocation.remainingPct}
              />
            </div>

            {/* What-if analysis */}
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
              <h3 className="!mt-0 font-display text-lg text-foreground">
                What-if scenarios
              </h3>
              <p className="mb-4 mt-1 text-sm text-muted-foreground">
                Test a change — results update instantly.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <ToolField
                    id="dti-wif-remove"
                    label="Pay off a debt with this monthly payment"
                    prefix="$"
                    value={wifRemove}
                    onChange={(e) => setWifRemove(e.target.value)}
                    placeholder="240"
                  />
                  {wifRemoveRes && (
                    <p className="mt-2 text-sm text-foreground">
                      New DTI:{" "}
                      <strong>{wifRemoveRes.backEnd.toFixed(1)}%</strong> (
                      {wifRemoveRes.band.label})
                      <span className="text-success">
                        {" "}
                        · {wifRemoveRes.delta.toFixed(1)} pts
                      </span>
                    </p>
                  )}
                </div>
                <div>
                  <ToolField
                    id="dti-wif-income"
                    label="Add gross monthly income"
                    prefix="$"
                    value={wifIncome}
                    onChange={(e) => setWifIncome(e.target.value)}
                    placeholder="500"
                  />
                  {wifIncomeRes && (
                    <p className="mt-2 text-sm text-foreground">
                      New DTI:{" "}
                      <strong>{wifIncomeRes.backEnd.toFixed(1)}%</strong> (
                      {wifIncomeRes.band.label})
                      <span className="text-success">
                        {" "}
                        · {wifIncomeRes.delta.toFixed(1)} pts
                      </span>
                    </p>
                  )}
                </div>
                {mode === "mortgage" && (
                  <div className="sm:col-span-2">
                    <div className="max-w-xs">
                      <ToolField
                        id="dti-wif-proposed"
                        label="Try a different proposed payment"
                        prefix="$"
                        value={wifProposed}
                        onChange={(e) => setWifProposed(e.target.value)}
                        placeholder="1,900"
                      />
                    </div>
                    {wifProposedRes && (
                      <p className="mt-2 text-sm text-foreground">
                        New DTI:{" "}
                        <strong>{wifProposedRes.backEnd.toFixed(1)}%</strong> (
                        {wifProposedRes.band.label})
                        <span
                          className={
                            wifProposedRes.delta <= 0
                              ? "text-success"
                              : "text-destructive"
                          }
                        >
                          {" "}
                          · {wifProposedRes.delta > 0 ? "+" : ""}
                          {wifProposedRes.delta.toFixed(1)} pts
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════ RIGHT — Results (sticky desktop) ══════════════ */}
      <div className="lg:sticky lg:top-24">
        <div aria-live="polite" className="sr-only">
          {result
            ? `Your back-end debt-to-income ratio is ${result.backEnd.toFixed(1)} percent — ${result.band.label}.`
            : "Enter your income and monthly debts to see your DTI."}
        </div>

        {!result ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center">
            <Sparkles
              className="mx-auto h-8 w-8 text-primary/50"
              aria-hidden="true"
            />
            <p className="mt-3 font-display text-lg text-foreground">
              Your DTI appears here
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Enter your income and monthly debts — results update live. Nothing
              is saved or submitted.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <HeroStat
              eyebrow={`Back-end DTI · ${result.band.label}`}
              value={`${result.backEnd.toFixed(1)}%`}
              sub={result.band.meaning}
              tone={
                result.band.tone === "gold"
                  ? "primary"
                  : result.band.tone === "destructive"
                    ? "destructive"
                    : "success"
              }
            />

            <div className="rounded-2xl border border-border bg-card p-4">
              <DtiMeter
                value={result.backEnd}
                displayValue={`${result.backEnd.toFixed(1)}%`}
                zones={METER_ZONES}
                cap={METER_CAP}
                bandLabel={result.band.label}
                ariaContext="Back-end debt-to-income ratio"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {result.frontEndAvailable && (
                <StatCard
                  label="Front-end (housing) DTI"
                  value={`${result.frontEnd.toFixed(1)}%`}
                  sub={
                    result.mode === "mortgage"
                      ? "proposed payment ÷ income"
                      : "housing ÷ income"
                  }
                />
              )}
              <StatCard
                label="Total monthly debt"
                value={fmtUSD(result.totalMonthlyDebt)}
                sub="counted by lenders"
              />
            </div>

            {result.readiness && (
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Mortgage readiness
                </p>
                <p className="mt-1.5 font-display text-base font-semibold text-foreground">
                  {result.readiness.label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {result.readiness.summary}
                </p>
              </div>
            )}

            {/* Qualification snapshot */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                How lenders read {result.backEnd.toFixed(1)}%
              </p>
              <ul className="mt-3 space-y-3">
                {result.thresholds.map((t) => {
                  const meta = STATUS_META[t.status];
                  const Icon = meta.Icon;
                  return (
                    <li key={t.key} className="text-sm">
                      <div className="flex items-start gap-2">
                        <Icon
                          className={`mt-0.5 h-4 w-4 shrink-0 ${meta.cls}`}
                          aria-hidden="true"
                        />
                        <div>
                          <p className="font-medium text-foreground">
                            {t.label}
                            <span
                              className={`ml-2 text-xs font-semibold ${meta.cls}`}
                            >
                              {meta.label}
                            </span>
                          </p>
                          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                            {t.note}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                DTI is one factor — credit history, assets, and documentation
                carry the rest of any application.
              </p>
            </div>

            {/* Gap analysis */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                What it takes
              </p>
              <ul className="mt-2.5 space-y-2 text-sm text-muted-foreground">
                {result.gaps.map((g) =>
                  g.headroom !== null ? (
                    <li key={g.target}>
                      <strong className="text-foreground">
                        At {g.target}%:
                      </strong>{" "}
                      you have{" "}
                      <strong className="text-success">
                        {fmtUSD(g.headroom)}/mo
                      </strong>{" "}
                      of headroom.
                    </li>
                  ) : (
                    <li key={g.target}>
                      <strong className="text-foreground">
                        To reach {g.target}%:
                      </strong>{" "}
                      reduce monthly debt by{" "}
                      <strong className="text-foreground">
                        {fmtUSD(g.reductionNeeded ?? 0)}
                      </strong>{" "}
                      — or add {fmtUSD(g.extraIncomeNeeded ?? 0)} gross monthly
                      income.
                    </li>
                  ),
                )}
              </ul>
            </div>

            {result.warnings.map((w) => (
              <NoticeBox key={w.message} tone="amber">
                {w.message}
              </NoticeBox>
            ))}

            {/* Recommendation */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                What fits your number
              </p>
              <p className="mt-1.5 font-display text-base font-semibold text-foreground">
                {result.recommendation.label}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {result.recommendation.note}
              </p>
              {result.recommendation.key !== "healthy" && (
                <Link
                  href={result.recommendation.href}
                  onClick={() =>
                    trackToolEvent("cta_clicked", {
                      tool: "dti",
                      cta: result.recommendation.key,
                    })
                  }
                  className="mt-2 inline-block text-sm font-semibold text-primary underline-offset-2 hover:underline"
                >
                  See how →
                </Link>
              )}
            </div>

            <ToolReportActions
              data={{
                toolSlug: "dti",
                title: "Debt-to-Income (DTI) Report",
                generatedLabel: reportDateLabel(),
                snapshot: [
                  {
                    label: "Gross monthly income",
                    value: `$${Math.round(result.gmi).toLocaleString()}`,
                  },
                  {
                    label: "Mode",
                    value:
                      result.mode === "mortgage"
                        ? "Mortgage / refinance check"
                        : "Current DTI",
                  },
                ],
                results: [
                  {
                    label: "Back-end DTI",
                    value: `${result.backEnd.toFixed(1)}%`,
                    hint: result.band.label,
                  },
                  ...(result.frontEndAvailable
                    ? [
                        {
                          label: "Front-end DTI",
                          value: `${result.frontEnd.toFixed(1)}%`,
                        },
                      ]
                    : []),
                ],
                methodology: [
                  "DTI = monthly debt obligations ÷ gross monthly income, using contractual debts only — the same math lenders use.",
                ],
              }}
            />

            <SoftCTA
              heading="Need help reviewing these numbers?"
              body="Speak with a mortgage or debt specialist — free consultation, no obligation, confidential."
              tool="dti"
              source="dti_calculator"
            />

            <details className="rounded-2xl border border-border bg-card p-4 text-sm">
              <summary className="cursor-pointer font-medium text-foreground">
                How this is calculated
              </summary>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted-foreground">
                <li>
                  Back-end DTI = all monthly debt payments (including housing) ÷
                  gross monthly income.
                </li>
                <li>Front-end DTI = housing payment ÷ gross monthly income.</li>
                {result.mode === "mortgage" && (
                  <li>
                    Mortgage mode uses your proposed payment and excludes
                    current rent/mortgage — exactly how a lender underwrites the
                    new loan.
                  </li>
                )}
                <li>
                  Reductions you need are rounded up; headroom is rounded down —
                  we never overstate approval odds.
                </li>
                <li>
                  Thresholds are educational references (agency guidelines and
                  common practice), not approval promises.
                </li>
              </ul>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
