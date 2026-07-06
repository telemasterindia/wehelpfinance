// src/components/tools/DebtPayoffCalculator.tsx
//
// Debt Payoff Calculator — the first module of the Financial Tools Hub.
// Client component: live calculation (no reload), unlimited debts,
// Snowball vs Avalanche comparison, accessible SVG charts, sticky
// results on desktop, cards on mobile, GA4 events, and a soft post-
// results CTA. All visual language reuses existing site tokens.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Plus, Trash2, Phone, ArrowRight, AlertTriangle,
  Snowflake, TrendingDown, Sparkles,
} from "lucide-react";
import {
  compareStrategies, debtWarnings, isValidDebt,
  fmtUSD, fmtMonths, payoffDateLabel,
  parseMoney, parseRate, newDebtId,
} from "@/lib/calculators/debtPayoff";
import type { DebtInput, Strategy, PayoffPlan } from "@/lib/calculators/debtPayoff";
import { trackToolEvent } from "@/lib/calculators/track";
import { ToolField } from "@/components/tools/ToolField";
import { StatCard, BalanceChart, DebtTimeline } from "@/components/tools/ToolCharts";

// ─── Row state (raw strings for controlled inputs) ───────────────────────────

interface DebtRow {
  id: string;
  name: string;
  balance: string;
  apr: string;
  minPayment: string;
}

function emptyRow(): DebtRow {
  return { id: newDebtId(), name: "", balance: "", apr: "", minPayment: "" };
}

const INITIAL_ROW: DebtRow = {
  id: "debt-initial",
  name: "",
  balance: "",
  apr: "",
  minPayment: "",
};

const EXAMPLE_ROWS: Omit<DebtRow, "id">[] = [
  { name: "Visa card", balance: "6,400", apr: "24.9", minPayment: "160" },
  { name: "Medical bill", balance: "1,850", apr: "6.5", minPayment: "60" },
  { name: "Personal loan", balance: "9,200", apr: "11.5", minPayment: "240" },
];

function rowToInput(r: DebtRow): DebtInput {
  return {
    id: r.id,
    name: r.name.trim() || "Debt",
    balance: parseMoney(r.balance),
    apr: parseRate(r.apr),
    minPayment: parseMoney(r.minPayment),
  };
}

function formatOnBlur(raw: string): string {
  const n = parseMoney(raw);
  return n > 0 ? n.toLocaleString("en-US") : raw.trim();
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DebtPayoffCalculator() {
  const [rows, setRows] = useState<DebtRow[]>([INITIAL_ROW]);
  const [extra, setExtra] = useState("");
  const [strategy, setStrategy] = useState<Strategy>("avalanche");
  const completedHash = useRef<string>("");

  // Viewed event — once per mount.
  useEffect(() => {
    trackToolEvent("calculator_viewed", { tool: "debt_payoff" });
  }, []);

  const inputs = useMemo(() => rows.map(rowToInput), [rows]);
  const validInputs = useMemo(() => inputs.filter(isValidDebt), [inputs]);
  const extraMonthly = parseMoney(extra);

  const comparison = useMemo(
    () => (validInputs.length > 0 ? compareStrategies(validInputs, extraMonthly) : null),
    [validInputs, extraMonthly]
  );

  const warnings = useMemo(() => debtWarnings(validInputs), [validInputs]);

  const plan: PayoffPlan | null =
    comparison && comparison[strategy].payable
      ? (comparison[strategy] as PayoffPlan)
      : null;

  // calculation_completed — debounced, once per distinct valid input set.
  useEffect(() => {
    if (!plan || !comparison) return;
    const hash = `${validInputs.map((d) => `${d.balance}|${d.apr}|${d.minPayment}`).join(";")}#${extraMonthly}`;
    if (hash === completedHash.current) return;
    const t = setTimeout(() => {
      completedHash.current = hash;
      trackToolEvent("calculation_completed", {
        tool: "debt_payoff",
        debts: validInputs.length,
        months: plan.months,
        strategy,
      });
    }, 900);
    return () => clearTimeout(t);
  }, [plan, comparison, validInputs, extraMonthly, strategy]);

  // ── Row handlers ──
  function updateRow(id: string, patch: Partial<DebtRow>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function addRow() {
    setRows((rs) => [...rs, emptyRow()]);
  }
  function removeRow(id: string) {
    setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : rs.map(() => emptyRow())));
  }
  function loadExample() {
    setRows(EXAMPLE_ROWS.map((r) => ({ ...r, id: newDebtId() })));
    setExtra("150");
  }

  function switchStrategy(next: Strategy) {
    if (next === strategy) return;
    setStrategy(next);
    trackToolEvent("strategy_switched", { tool: "debt_payoff", strategy: next });
  }

  // Keyboard support for the strategy radiogroup.
  function onStrategyKeyDown(e: React.KeyboardEvent) {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      switchStrategy(strategy === "snowball" ? "avalanche" : "snowball");
    }
  }

  // Per-row inline errors: only for rows the user has started filling.
  function rowError(r: DebtRow): { balance?: string; apr?: string; minPayment?: string } {
    const touched = r.balance || r.apr || r.minPayment || r.name;
    if (!touched) return {};
    const errs: { balance?: string; apr?: string; minPayment?: string } = {};
    if (r.balance && parseMoney(r.balance) <= 0) errs.balance = "Enter a balance above $0.";
    if (r.apr && (parseRate(r.apr) < 0 || r.apr.trim() === ".")) errs.apr = "Enter a valid rate.";
    if (r.minPayment && parseMoney(r.minPayment) <= 0) errs.minPayment = "Enter a payment above $0.";
    return errs;
  }

  const baseline = comparison?.baseline ?? null;
  const interestSaved =
    plan && baseline?.payable ? Math.max(0, baseline.totalInterest - plan.totalInterest) : null;
  const monthsSaved =
    plan && baseline?.payable ? Math.max(0, baseline.months - plan.months) : null;

  const snowPlan = comparison?.snowball.payable ? (comparison.snowball as PayoffPlan) : null;
  const avaPlan = comparison?.avalanche.payable ? (comparison.avalanche as PayoffPlan) : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
      {/* ══════════════════ LEFT — Inputs ══════════════════ */}
      <div>
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="!m-0 font-display text-xl text-foreground">Your debts</h2>
            <button
              type="button"
              onClick={loadExample}
              className="text-sm font-medium text-primary underline-offset-2 hover:underline"
            >
              Load an example
            </button>
          </div>

          <div className="space-y-5">
            {rows.map((r, i) => {
              const errs = rowError(r);
              return (
                <fieldset
                  key={r.id}
                  className="rounded-2xl border border-border bg-background p-4"
                >
                  <legend className="sr-only">Debt {i + 1}</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <ToolField
                      id={`${r.id}-name`}
                      label={`Debt ${i + 1} name`}
                      value={r.name}
                      onChange={(e) => updateRow(r.id, { name: e.target.value })}
                      placeholder="e.g. Visa card"
                      inputMode="text"
                    />
                    <ToolField
                      id={`${r.id}-balance`}
                      label="Current balance"
                      prefix="$"
                      value={r.balance}
                      onChange={(e) => updateRow(r.id, { balance: e.target.value })}
                      placeholder="6,400"
                      error={errs.balance}
                    />
                    <ToolField
                      id={`${r.id}-apr`}
                      label="Interest rate (APR)"
                      suffix="%"
                      value={r.apr}
                      onChange={(e) => updateRow(r.id, { apr: e.target.value })}
                      placeholder="24.9"
                      error={errs.apr}
                    />
                    <ToolField
                      id={`${r.id}-min`}
                      label="Minimum monthly payment"
                      prefix="$"
                      value={r.minPayment}
                      onChange={(e) => updateRow(r.id, { minPayment: e.target.value })}
                      placeholder="160"
                      error={errs.minPayment}
                    />
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeRow(r.id)}
                      aria-label={`Remove debt ${i + 1}${r.name ? ` (${r.name})` : ""}`}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus:outline-none focus:ring-2 focus:ring-destructive/30"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      Remove
                    </button>
                  </div>
                </fieldset>
              );
            })}
          </div>

          <button
            type="button"
            onClick={addRow}
            className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-primary bg-background px-5 text-sm font-semibold text-primary transition hover:bg-primary-soft focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add another debt
          </button>

          <div className="mt-6 border-t border-border pt-5">
            <div className="max-w-xs">
              <ToolField
                id="extra-payment"
                label="Extra payment per month (optional)"
                prefix="$"
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
                placeholder="150"
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Any amount above your combined minimums. Even $50 extra can cut years off your payoff.
            </p>
          </div>

          {/* Strategy toggle */}
          <div className="mt-6 border-t border-border pt-5">
            <p id="strategy-label" className="mb-2 text-sm font-medium text-foreground">
              Payoff strategy
            </p>
            <div
              role="radiogroup"
              aria-labelledby="strategy-label"
              onKeyDown={onStrategyKeyDown}
              className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-background p-1.5"
            >
              <button
                type="button"
                role="radio"
                aria-checked={strategy === "avalanche"}
                tabIndex={strategy === "avalanche" ? 0 : -1}
                onClick={() => switchStrategy("avalanche")}
                className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                  strategy === "avalanche"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <TrendingDown className="h-4 w-4" aria-hidden="true" /> Avalanche
                </span>
                <span className="text-[11px] font-normal opacity-80">Highest rate first</span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={strategy === "snowball"}
                tabIndex={strategy === "snowball" ? 0 : -1}
                onClick={() => switchStrategy("snowball")}
                className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                  strategy === "snowball"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Snowflake className="h-4 w-4" aria-hidden="true" /> Snowball
                </span>
                <span className="text-[11px] font-normal opacity-80">Smallest balance first</span>
              </button>
            </div>
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="mt-5 space-y-2">
              {warnings.map((w) => (
                <p
                  key={w.id}
                  className="flex items-start gap-2 rounded-xl border border-gold/40 bg-gold/10 px-3.5 py-2.5 text-sm text-foreground"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                  <span>{w.message}</span>
                </p>
              ))}
            </div>
          )}

          {comparison && !comparison[strategy].payable && validInputs.length > 0 && (
            <p role="alert" className="mt-5 rounded-xl border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
              {(comparison[strategy] as { reason: string }).reason}
            </p>
          )}
        </div>

        {/* Charts — render only once there's a plan */}
        {plan && snowPlan && avaPlan && (
          <div className="mt-6 space-y-6">
            <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
              <h3 className="!mt-0 font-display text-lg text-foreground">Balance reduction over time</h3>
              <p className="mb-4 mt-1 text-sm text-muted-foreground">
                Both strategies compared — the solid line is your selected method.
              </p>
              <BalanceChart
                snowball={snowPlan.balanceByMonth}
                avalanche={avaPlan.balanceByMonth}
                selected={strategy}
              />
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
              <h3 className="!mt-0 font-display text-lg text-foreground">Debt elimination timeline</h3>
              <p className="mb-4 mt-1 text-sm text-muted-foreground">
                The order your debts disappear with the {strategy === "snowball" ? "Snowball" : "Avalanche"} method.
              </p>
              <DebtTimeline debts={plan.debts} totalMonths={plan.months} />
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════ RIGHT — Results (sticky on desktop) ══════════════════ */}
      <div className="lg:sticky lg:top-24">
        {/* Screen-reader live summary */}
        <div aria-live="polite" className="sr-only">
          {plan
            ? `Debt-free in ${fmtMonths(plan.months)}, around ${payoffDateLabel(plan.months)}. Total interest ${fmtUSD(plan.totalInterest)}.`
            : "Enter your debts to see your payoff plan."}
        </div>

        {!plan ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-primary/50" aria-hidden="true" />
            <p className="mt-3 font-display text-lg text-foreground">Your plan appears here</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Add at least one debt with a balance, APR, and minimum payment — results update live as you type.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-3xl border border-primary/25 bg-primary-soft/30 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Debt-free date
              </p>
              <p className="mt-1 font-display text-3xl font-semibold text-foreground">
                {payoffDateLabel(plan.months)}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {fmtMonths(plan.months)} from today · paying {fmtUSD(plan.monthlyBudget)}/month
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Total interest" value={fmtUSD(plan.totalInterest)} />
              <StatCard label="Total repayment" value={fmtUSD(plan.totalPaid)} />
              {interestSaved !== null && (
                <StatCard
                  label="Interest saved"
                  value={fmtUSD(interestSaved)}
                  sub="vs. minimum payments only"
                  tone="success"
                />
              )}
              {monthsSaved !== null && (
                <StatCard
                  label="Time saved"
                  value={fmtMonths(monthsSaved)}
                  sub="vs. minimum payments only"
                  tone="success"
                />
              )}
            </div>

            {baseline && !baseline.payable && (
              <p className="rounded-xl border border-gold/40 bg-gold/10 px-3.5 py-2.5 text-sm text-foreground">
                {baseline.reason} That's exactly why a payoff plan matters — with rollover payments, your plan above still gets you debt-free.
              </p>
            )}

            {/* Strategy comparison strip */}
            {snowPlan && avaPlan && comparison && (
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Snowball vs. Avalanche
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div className={`rounded-xl border p-3 ${strategy === "avalanche" ? "border-primary/40 bg-primary-soft/25" : "border-border"}`}>
                    <p className="font-semibold text-foreground">Avalanche</p>
                    <p className="mt-1 text-muted-foreground">{fmtUSD(avaPlan.totalInterest)} interest</p>
                    <p className="text-muted-foreground">{fmtMonths(avaPlan.months)}</p>
                  </div>
                  <div className={`rounded-xl border p-3 ${strategy === "snowball" ? "border-primary/40 bg-primary-soft/25" : "border-border"}`}>
                    <p className="font-semibold text-foreground">Snowball</p>
                    <p className="mt-1 text-muted-foreground">{fmtUSD(snowPlan.totalInterest)} interest</p>
                    <p className="text-muted-foreground">{fmtMonths(snowPlan.months)}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {comparison.strategyInterestDelta > 0 ? (
                    <>
                      <strong className="text-foreground">
                        {comparison.cheaper === "avalanche" ? "Avalanche" : "Snowball"} costs {fmtUSD(comparison.strategyInterestDelta)} less
                      </strong>{" "}
                      in interest. Snowball's early wins keep many people motivated — the best strategy is the one you'll stick with.
                    </>
                  ) : (
                    <>Both strategies cost the same here — pick the one that keeps you motivated.</>
                  )}
                </p>
              </div>
            )}

            {/* ── Soft CRO block — value first, never blocking ── */}
            <div className="rounded-3xl border border-border bg-card p-5">
              <p className="font-display text-lg text-foreground">
                Need professional help reducing your debt?
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                If these payments aren't realistic for your budget, a specialist can walk you through
                settlement and consolidation options — free and confidential.
              </p>
              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                <a
                  href="tel:+17183604806"
                  onClick={() => trackToolEvent("phone_clicked", { tool: "debt_payoff" })}
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full border border-primary bg-background px-5 text-sm font-semibold text-primary transition hover:bg-primary-soft focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call now
                </a>
                <Link
                  href="/get-help"
                  onClick={() => {
                    trackToolEvent("cta_clicked", { tool: "debt_payoff", cta: "get_free_help" });
                    trackToolEvent("lead_form_started", { source: "debt_payoff_calculator" });
                  }}
                  className="btn-cta flex-1 !min-h-[48px] text-sm"
                >
                  Get free help
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
