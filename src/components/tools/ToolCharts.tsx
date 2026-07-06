// src/components/tools/ToolCharts.tsx
//
// Zero-dependency, accessible chart primitives for Financial Tools.
// Pure inline SVG + semantic HTML — no chart library, nothing added
// to the bundle. Responsive via viewBox, print-friendly by nature,
// screen-reader friendly via role="img" + descriptions + an sr-only
// data table. No animation, so prefers-reduced-motion is respected
// by default.

"use client";

import { fmtUSD, fmtMonths } from "@/lib/calculators/debtPayoff";
import type { DebtResult, Strategy } from "@/lib/calculators/debtPayoff";

// ─── Summary stat card ────────────────────────────────────────────────────────

export function StatCard({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "success" | "primary";
}) {
  const valueColor =
    tone === "success"
      ? "text-success"
      : tone === "primary"
        ? "text-primary"
        : "text-foreground";
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className={`mt-1 font-display text-2xl font-semibold ${valueColor}`}>
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

// ─── Balance-over-time line chart ────────────────────────────────────────────

function toPoints(
  series: number[],
  maxY: number,
  maxX: number,
  w: number,
  h: number,
  padL: number,
  padT: number
): string {
  if (series.length < 2 || maxY <= 0 || maxX <= 0) return "";
  // Downsample long series so the path stays light.
  const step = Math.max(1, Math.ceil(series.length / 140));
  const pts: string[] = [];
  for (let i = 0; i < series.length; i += step) {
    const x = padL + (i / maxX) * w;
    const y = padT + h - (series[i] / maxY) * h;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  // Always include the final point (zero balance).
  const lastI = series.length - 1;
  const lx = padL + (lastI / maxX) * w;
  const ly = padT + h - (series[lastI] / maxY) * h;
  pts.push(`${lx.toFixed(1)},${ly.toFixed(1)}`);
  return pts.join(" ");
}

export function BalanceChart({
  snowball,
  avalanche,
  selected,
}: {
  snowball: number[];
  avalanche: number[];
  selected: Strategy;
}) {
  const VB_W = 600;
  const VB_H = 240;
  const padL = 8;
  const padR = 8;
  const padT = 10;
  const padB = 26;
  const w = VB_W - padL - padR;
  const h = VB_H - padT - padB;

  const maxY = Math.max(snowball[0] ?? 0, avalanche[0] ?? 0);
  const maxX = Math.max(snowball.length - 1, avalanche.length - 1, 1);

  const snowPts = toPoints(snowball, maxY, maxX, w, h, padL, padT);
  const avaPts = toPoints(avalanche, maxY, maxX, w, h, padL, padT);

  const selectedPts = selected === "snowball" ? snowPts : avaPts;
  const otherPts = selected === "snowball" ? avaPts : snowPts;
  const otherLabel = selected === "snowball" ? "Avalanche" : "Snowball";
  const selectedLabel = selected === "snowball" ? "Snowball" : "Avalanche";

  const yearTicks: number[] = [];
  for (let m = 12; m < maxX; m += 12) yearTicks.push(m);

  const desc = `Total balance starts at ${fmtUSD(maxY)} and reaches zero after ${fmtMonths(
    (selected === "snowball" ? snowball.length : avalanche.length) - 1
  )} with the ${selectedLabel} method.`;

  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-label={`Balance reduction over time. ${desc}`}
        className="h-auto w-full"
      >
        <desc>{desc}</desc>
        {/* Gridlines at 25 / 50 / 75% */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={padL}
            x2={VB_W - padR}
            y1={padT + h - f * h}
            y2={padT + h - f * h}
            stroke="var(--color-border)"
            strokeWidth="1"
          />
        ))}
        {/* Baseline */}
        <line
          x1={padL}
          x2={VB_W - padR}
          y1={padT + h}
          y2={padT + h}
          stroke="var(--color-border)"
          strokeWidth="1.5"
        />
        {/* Year ticks */}
        {yearTicks.map((m) => {
          const x = padL + (m / maxX) * w;
          return (
            <g key={m}>
              <line
                x1={x}
                x2={x}
                y1={padT + h}
                y2={padT + h + 4}
                stroke="var(--color-border)"
                strokeWidth="1"
              />
              <text
                x={x}
                y={VB_H - 8}
                textAnchor="middle"
                fontSize="10"
                fill="var(--color-muted-foreground)"
              >
                {`Yr ${m / 12}`}
              </text>
            </g>
          );
        })}
        {/* Non-selected strategy: dashed, muted */}
        {otherPts && (
          <polyline
            points={otherPts}
            fill="none"
            stroke="var(--color-muted-foreground)"
            strokeWidth="2"
            strokeDasharray="5 5"
            strokeLinejoin="round"
            opacity="0.55"
          />
        )}
        {/* Selected strategy: solid primary */}
        {selectedPts && (
          <polyline
            points={selectedPts}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        {/* Max label */}
        <text x={padL + 2} y={padT + 12} fontSize="10" fill="var(--color-muted-foreground)">
          {fmtUSD(maxY)}
        </text>
      </svg>
      <figcaption className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-0.5 w-5 rounded bg-primary" />
          {selectedLabel} (selected)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="inline-block h-0.5 w-5 rounded border-t-2 border-dashed border-muted-foreground/60"
          />
          {otherLabel}
        </span>
      </figcaption>
    </figure>
  );
}

// ─── Debt elimination timeline (semantic HTML bars) ──────────────────────────

export function DebtTimeline({
  debts,
  totalMonths,
}: {
  debts: DebtResult[];
  totalMonths: number;
}) {
  if (debts.length === 0 || totalMonths <= 0) return null;
  return (
    <ol className="space-y-3" aria-label="Debt elimination order and timing">
      {debts.map((d, i) => {
        const pct = Math.max(4, Math.round((d.payoffMonth / totalMonths) * 100));
        return (
          <li key={d.id} className="text-sm">
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <span className="font-medium text-foreground">
                <span className="mr-1.5 inline-grid h-5 w-5 place-items-center rounded-full bg-primary-soft text-[11px] font-bold text-primary">
                  {i + 1}
                </span>
                {d.name}
              </span>
              <span className="whitespace-nowrap text-xs text-muted-foreground">
                paid off in {fmtMonths(d.payoffMonth)}
              </span>
            </div>
            <div
              className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
              role="img"
              aria-label={`${d.name}: paid off after ${fmtMonths(d.payoffMonth)} of ${fmtMonths(totalMonths)} total`}
            >
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
