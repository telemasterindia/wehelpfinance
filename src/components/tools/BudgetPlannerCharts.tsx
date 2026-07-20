// src/components/tools/BudgetPlannerCharts.tsx
//
// Reusable SVG charts for the Budget Planner — Sprint 8. Pure SVG,
// no chart libraries, design-token colours via Tailwind classes,
// motion-safe transitions only.
//
// Accessibility: each chart is role="img" with a full-sentence
// aria-label; the visible HTML legend carries the detailed values,
// so screen-reader users get everything the sighted user gets.

"use client";

import type { SpendingSlice, RuleRow } from "@/lib/calculators/budgetPlanner";
import { fmtUSD } from "@/lib/calculators/debtPayoff";

// Shared token palette for slices (order-stable, grayscale-distinct).
const SLICE_CLASSES = [
  "stroke-primary",
  "stroke-destructive/70",
  "stroke-gold",
  "stroke-success",
  "stroke-primary/50",
  "stroke-gold/60",
  "stroke-success/60",
  "stroke-muted-foreground/40",
];
const DOT_CLASSES = [
  "bg-primary",
  "bg-destructive/70",
  "bg-gold",
  "bg-success",
  "bg-primary/50",
  "bg-gold/60",
  "bg-success/60",
  "bg-muted-foreground/40",
];

// ─── SpendingDonut ───────────────────────────────────────────────────────────

const R = 42;
const CIRC = 2 * Math.PI * R;

export function SpendingDonut({
  slices,
  ariaLabel,
}: {
  slices: SpendingSlice[];
  ariaLabel: string;
}) {
  const visible = slices.filter((s) => s.pct > 0);
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
      <svg viewBox="0 0 120 120" role="img" aria-label={ariaLabel} className="w-full max-w-[200px] shrink-0">
        <g aria-hidden="true" transform="rotate(-90 60 60)">
          <circle cx="60" cy="60" r={R} className="stroke-muted" strokeWidth="18" fill="none" />
          {visible.map((s) => {
            const idx = slices.findIndex((x) => x.key === s.key);
            const len = (s.pct / 100) * CIRC;
            const el = (
              <circle
                key={s.key}
                cx="60"
                cy="60"
                r={R}
                className={`${SLICE_CLASSES[idx % SLICE_CLASSES.length]} motion-safe:transition-all motion-safe:duration-500`}
                strokeWidth="18"
                fill="none"
                strokeDasharray={`${len.toFixed(2)} ${(CIRC - len).toFixed(2)}`}
                strokeDashoffset={(-offset).toFixed(2)}
              />
            );
            offset += len;
            return el;
          })}
        </g>
      </svg>
      <ul className="w-full space-y-1.5">
        {slices.map((s, idx) => (
          <li key={s.key} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${DOT_CLASSES[idx % DOT_CLASSES.length]}`} />
              <span className="truncate text-foreground">{s.label}</span>
            </span>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {s.pct.toFixed(1)}% · {fmtUSD(s.amount)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── RuleBars (50/30/20) ─────────────────────────────────────────────────────

const BAR_W = 300;
const ROW_H = 34;

const RULE_FILL: Record<RuleRow["key"], string> = {
  needs: "fill-primary",
  wants: "fill-gold",
  savings: "fill-success",
};

export function RuleBars({
  rows,
  ariaLabel,
}: {
  rows: RuleRow[];
  ariaLabel: string;
}) {
  const maxPct = Math.max(60, ...rows.map((r) => r.actualPct)) * 1.1;
  const x = (pct: number) => (Math.min(pct, maxPct) / maxPct) * BAR_W;
  const H = rows.length * ROW_H;

  return (
    <div>
      <svg
        viewBox={`0 0 ${BAR_W + 8} ${H}`}
        role="img"
        aria-label={ariaLabel}
        className="w-full"
      >
        <g aria-hidden="true">
          {rows.map((r, i) => {
            const y = i * ROW_H + 6;
            return (
              <g key={r.key}>
                <rect x="0" y={y} width={BAR_W} height="14" rx="7" className="fill-muted" />
                <rect
                  x="0"
                  y={y}
                  width={Math.max(4, x(r.actualPct))}
                  height="14"
                  rx="7"
                  className={`${RULE_FILL[r.key]} motion-safe:transition-all motion-safe:duration-500`}
                />
                {/* Guideline tick */}
                <line
                  x1={x(r.guidelinePct)}
                  x2={x(r.guidelinePct)}
                  y1={y - 4}
                  y2={y + 18}
                  className="stroke-foreground"
                  strokeWidth="2"
                  strokeDasharray="3 2"
                />
              </g>
            );
          })}
        </g>
      </svg>
      <ul className="mt-2 space-y-2">
        {rows.map((r) => (
          <li key={r.key} className="text-sm">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-medium text-foreground">{r.label}</span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {r.actualPct.toFixed(1)}% <span aria-hidden="true">·</span> guideline {r.guidelinePct}%
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{r.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

