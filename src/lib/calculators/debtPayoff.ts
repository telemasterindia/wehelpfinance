// src/lib/calculators/debtPayoff.ts
//
// Pure TypeScript calculation engine for the Debt Payoff Calculator.
// No React, no DOM — fully unit-testable and reusable by future tools
// (loan comparison, DTI, budget planner all share the money/format
// helpers exported at the bottom).
//
// Method notes (kept honest, matches how the strategies are taught):
// - The user's total monthly outlay stays CONSTANT: sum of all
//   minimums + optional extra. When a debt is retired, its minimum
//   "rolls over" into the payment pool (the snowball/avalanche core
//   mechanic).
// - Snowball  → extra money targets the SMALLEST STARTING BALANCE first.
// - Avalanche → extra money targets the HIGHEST APR first.
// - Baseline ("minimum payments only") pays each debt independently
//   with its own fixed minimum and NO rollover — the realistic
//   do-nothing scenario used to compute interest/months saved.
// - Interest compounds monthly at APR/12. Simulation caps at 720
//   months (60 years); anything longer is reported as not payable.

export type Strategy = "snowball" | "avalanche";

export interface DebtInput {
  id: string;
  name: string;
  balance: number;      // current balance, dollars
  apr: number;          // annual percentage rate, e.g. 22.9
  minPayment: number;   // fixed monthly minimum, dollars
}

export interface DebtResult {
  id: string;
  name: string;
  startingBalance: number;
  apr: number;
  payoffMonth: number;        // 1-based month index when balance hit 0
  interestPaid: number;
}

export interface PayoffPlan {
  strategy: Strategy;
  months: number;                 // total months to debt-free
  totalInterest: number;
  totalPaid: number;              // principal + interest
  monthlyBudget: number;          // constant monthly outlay
  balanceByMonth: number[];       // index 0 = starting total balance
  debts: DebtResult[];            // sorted by payoff order
  payable: true;
}

export interface UnpayablePlan {
  strategy: Strategy;
  payable: false;
  reason: string;
}

export type PlanResult = PayoffPlan | UnpayablePlan;

export interface BaselineResult {
  payable: boolean;
  months: number;                 // max months across debts (if payable)
  totalInterest: number;
  totalPaid: number;
  reason?: string;
}

export interface Comparison {
  snowball: PlanResult;
  avalanche: PlanResult;
  baseline: BaselineResult;
  /** Interest the cheaper strategy saves vs the other (>= 0). */
  strategyInterestDelta: number;
  /** Which strategy pays less total interest. */
  cheaper: Strategy;
}

const MAX_MONTHS = 720;

// ─── Validation ───────────────────────────────────────────────────────────────

export interface DebtWarning {
  id: string;
  message: string;
}

/**
 * A minimum payment that doesn't cover the first month's interest can
 * still work once earlier debts retire and roll their minimums over —
 * but it's worth warning the user because on its own the balance grows.
 */
export function debtWarnings(debts: DebtInput[]): DebtWarning[] {
  const warnings: DebtWarning[] = [];
  for (const d of debts) {
    const monthlyInterest = (d.balance * d.apr) / 100 / 12;
    if (d.minPayment > 0 && d.minPayment <= monthlyInterest) {
      warnings.push({
        id: d.id,
        message: `The minimum on “${d.name || "this debt"}” (${fmtUSD(d.minPayment)}) doesn't cover its monthly interest (${fmtUSD(monthlyInterest)}). On its own this balance would grow — the payoff plan below only works because other payments roll over to it.`,
      });
    }
  }
  return warnings;
}

export function isValidDebt(d: DebtInput): boolean {
  return d.balance > 0 && d.apr >= 0 && d.apr < 100 && d.minPayment > 0;
}

// ─── Core simulation ──────────────────────────────────────────────────────────

interface SimDebt {
  id: string;
  name: string;
  startingBalance: number;
  balance: number;
  monthlyRate: number;
  apr: number;
  minPayment: number;
  payoffMonth: number;
  interestPaid: number;
}

function priorityOrder(debts: DebtInput[], strategy: Strategy): DebtInput[] {
  const copy = [...debts];
  if (strategy === "snowball") {
    // Smallest starting balance first; tie-break: higher APR first.
    copy.sort((a, b) => a.balance - b.balance || b.apr - a.apr);
  } else {
    // Highest APR first; tie-break: smaller balance first.
    copy.sort((a, b) => b.apr - a.apr || a.balance - b.balance);
  }
  return copy;
}

/**
 * Month-by-month waterfall simulation.
 * Budget = sum(all minimums) + extra, held constant until debt-free.
 * Each month: accrue interest → pay each active debt its minimum
 * (capped at balance) → pour every leftover dollar into the highest-
 * priority active debt, cascading to the next if it's retired mid-month.
 */
export function simulatePayoff(
  inputs: DebtInput[],
  extraMonthly: number,
  strategy: Strategy
): PlanResult {
  const valid = inputs.filter(isValidDebt);
  if (valid.length === 0) {
    return { strategy, payable: false, reason: "Add at least one debt with a balance, APR, and minimum payment." };
  }

  const ordered = priorityOrder(valid, strategy);
  const debts: SimDebt[] = ordered.map((d) => ({
    id: d.id,
    name: d.name || "Debt",
    startingBalance: d.balance,
    balance: d.balance,
    monthlyRate: d.apr / 100 / 12,
    apr: d.apr,
    minPayment: d.minPayment,
    payoffMonth: 0,
    interestPaid: 0,
  }));

  const monthlyBudget =
    debts.reduce((s, d) => s + d.minPayment, 0) + Math.max(0, extraMonthly);

  const startTotal = debts.reduce((s, d) => s + d.balance, 0);
  const balanceByMonth: number[] = [round2(startTotal)];
  let totalInterest = 0;

  for (let month = 1; month <= MAX_MONTHS; month++) {
    // 1) Accrue interest on all active debts.
    for (const d of debts) {
      if (d.balance <= 0) continue;
      const interest = d.balance * d.monthlyRate;
      d.balance += interest;
      d.interestPaid += interest;
      totalInterest += interest;
    }

    // 2) Pay minimums (capped at balance); collect leftover budget.
    let pool = monthlyBudget;
    for (const d of debts) {
      if (d.balance <= 0) continue;
      const pay = Math.min(d.minPayment, d.balance, pool);
      d.balance -= pay;
      pool -= pay;
      if (d.balance <= 0.005) {
        d.balance = 0;
        d.payoffMonth = month;
      }
    }

    // 3) Waterfall the remaining pool into priority targets.
    for (const d of debts) {
      if (pool <= 0) break;
      if (d.balance <= 0) continue;
      const pay = Math.min(pool, d.balance);
      d.balance -= pay;
      pool -= pay;
      if (d.balance <= 0.005) {
        d.balance = 0;
        d.payoffMonth = month;
      }
    }

    const totalBal = debts.reduce((s, d) => s + d.balance, 0);
    balanceByMonth.push(round2(totalBal));

    if (totalBal <= 0) {
      const totalPrincipal = debts.reduce((s, d) => s + d.startingBalance, 0);
      return {
        strategy,
        payable: true,
        months: month,
        totalInterest: round2(totalInterest),
        totalPaid: round2(totalPrincipal + totalInterest),
        monthlyBudget: round2(monthlyBudget),
        balanceByMonth,
        debts: debts
          .map((d) => ({
            id: d.id,
            name: d.name,
            startingBalance: d.startingBalance,
            apr: d.apr,
            payoffMonth: d.payoffMonth,
            interestPaid: round2(d.interestPaid),
          }))
          .sort((a, b) => a.payoffMonth - b.payoffMonth),
      };
    }
  }

  return {
    strategy,
    payable: false,
    reason:
      "With these payments the balances never reach zero within 60 years. Increase the minimums or add an extra monthly payment.",
  };
}

/**
 * Baseline: each debt paid independently with its own fixed minimum,
 * no rollover, no extra. This is the honest "what happens if I change
 * nothing" scenario used for interest-saved / months-saved.
 */
export function minimumOnlyBaseline(inputs: DebtInput[]): BaselineResult {
  const valid = inputs.filter(isValidDebt);
  if (valid.length === 0) {
    return { payable: false, months: 0, totalInterest: 0, totalPaid: 0, reason: "No valid debts." };
  }

  let months = 0;
  let totalInterest = 0;
  let totalPrincipal = 0;

  for (const d of valid) {
    totalPrincipal += d.balance;
    let bal = d.balance;
    const rate = d.apr / 100 / 12;
    let m = 0;
    while (bal > 0 && m < MAX_MONTHS) {
      m++;
      const interest = bal * rate;
      bal += interest;
      totalInterest += interest;
      bal -= Math.min(d.minPayment, bal);
    }
    if (bal > 0) {
      return {
        payable: false,
        months: 0,
        totalInterest: 0,
        totalPaid: 0,
        reason: `Minimum payments alone never pay off “${d.name || "one of your debts"}” — the balance grows faster than the payment.`,
      };
    }
    months = Math.max(months, m);
  }

  return {
    payable: true,
    months,
    totalInterest: round2(totalInterest),
    totalPaid: round2(totalPrincipal + totalInterest),
  };
}

export function compareStrategies(inputs: DebtInput[], extraMonthly: number): Comparison {
  const snowball = simulatePayoff(inputs, extraMonthly, "snowball");
  const avalanche = simulatePayoff(inputs, extraMonthly, "avalanche");
  const baseline = minimumOnlyBaseline(inputs);

  let cheaper: Strategy = "avalanche";
  let delta = 0;
  if (snowball.payable && avalanche.payable) {
    if (snowball.totalInterest < avalanche.totalInterest) {
      cheaper = "snowball";
      delta = avalanche.totalInterest - snowball.totalInterest;
    } else {
      cheaper = "avalanche";
      delta = snowball.totalInterest - avalanche.totalInterest;
    }
  }

  return {
    snowball,
    avalanche,
    baseline,
    cheaper,
    strategyInterestDelta: round2(delta),
  };
}

// ─── Shared formatting / parsing utilities (reused by future tools) ───────────

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function fmtUSD(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

/** 27 → "2 yrs 3 mo"; 1 → "1 mo" */
export function fmtMonths(total: number): string {
  const yrs = Math.floor(total / 12);
  const mo = total % 12;
  if (yrs === 0) return `${mo} mo`;
  if (mo === 0) return `${yrs} yr${yrs > 1 ? "s" : ""}`;
  return `${yrs} yr${yrs > 1 ? "s" : ""} ${mo} mo`;
}

/** Month index from now → "Mar 2029" (client-side only). */
export function payoffDateLabel(monthsFromNow: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + monthsFromNow);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/** Lenient money parser: "$12,500.50" → 12500.5; invalid → 0. */
export function parseMoney(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) && n >= 0 ? round2(n) : 0;
}

/** APR parser clamped to 0–99.9. */
export function parseRate(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const n = parseFloat(cleaned);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(round2(n), 99.9);
}

let idCounter = 0;
export function newDebtId(): string {
  idCounter += 1;
  return `debt-${Date.now().toString(36)}-${idCounter}`;
}
