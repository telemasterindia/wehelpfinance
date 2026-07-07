// src/components/tools/ComparisonCharts.tsx
//
// Settlement-specific visualizations — Sprint 2. Extends the shared
// zero-dependency chart architecture (semantic HTML bars, same
// pattern as DebtTimeline in ToolCharts.tsx) without modifying the
// already-deployed Sprint 1 components. No chart library.

"use client";

import { fmtUSD } from "@/lib/calculators/debtPayoff";

// ─── Horizontal cost-comparison bars ─────────────────────────────────────────
// Compares dollar figures against a shared scale (the largest value).

export interface CostBarItem {
  label: string;
  value: number;
  tone?: "primary" | "muted" | "success" | "destructive";
  note?: string;
}

const TONE_CLASS: Record<NonNullable<CostBarItem["tone"]>, string> = {
  primary: "bg-primary",
  muted: "bg-muted-foreground/50",
  success: "bg-success",
  destructive: "bg-destructive/80",
};

export function CostBars({
  items,
  ariaLabel,
}: {
  items: CostBarItem[];
  ariaLabel: string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-4" aria-label={ariaLabel}>
      {items.map((item) => {
        const pct = Math.max(3, Math.round((item.value / max) * 100));
        const tone = TONE_CLASS[item.tone ?? "primary"];
        return (
          <li key={item.label} className="text-sm">
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <span className="font-medium text-foreground">{item.label}</span>
              <span className="whitespace-nowrap font-semibold text-foreground">
                {fmtUSD(item.value)}
              </span>
            </div>
            <div
              className="h-3 w-full overflow-hidden rounded-full bg-muted"
              role="img"
              aria-label={`${item.label}: ${fmtUSD(item.value)}`}
            >
              <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
            </div>
            {item.note && (
              <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// ─── Where-every-dollar-goes stacked bar ─────────────────────────────────────
// One bar representing the original debt, split into: settlement paid
// to creditors, program fees, and net savings.

export function SavingsBreakdown({
  totalDebt,
  settlementAmount,
  programFees,
  netSavings,
}: {
  totalDebt: number;
  settlementAmount: number;
  programFees: number;
  netSavings: number;
}) {
  if (totalDebt <= 0) return null;
  const pct = (n: number) => Math.max(0, Math.min(100, (n / totalDebt) * 100));
  const pSettle = pct(settlementAmount);
  const pFees = pct(programFees);
  const pSave = Math.max(0, 100 - pSettle - pFees);

  const desc = `Of your ${fmtUSD(totalDebt)} debt: ${fmtUSD(settlementAmount)} estimated to creditors, ${fmtUSD(programFees)} in program fees, ${fmtUSD(netSavings)} kept as savings.`;

  return (
    <figure>
      <div
        className="flex h-5 w-full overflow-hidden rounded-full border border-border"
        role="img"
        aria-label={`Where every dollar of your debt goes. ${desc}`}
      >
        <div className="h-full bg-primary" style={{ width: `${pSettle}%` }} />
        <div className="h-full bg-gold" style={{ width: `${pFees}%` }} />
        <div className="h-full bg-success" style={{ width: `${pSave}%` }} />
      </div>
      <figcaption className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-sm bg-primary" />
          To creditors ({fmtUSD(settlementAmount)})
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-sm bg-gold" />
          Program fees ({fmtUSD(programFees)})
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-sm bg-success" />
          Your savings ({fmtUSD(netSavings)})
        </span>
      </figcaption>
    </figure>
  );
}
