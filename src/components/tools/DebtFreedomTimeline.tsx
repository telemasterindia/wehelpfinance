// src/components/tools/DebtFreedomTimeline.tsx
//
// Reusable Debt Freedom Timeline — Sprint 9. Pure SVG milestone rail
// (Today → 25% → 50% → 75% → Debt free) with month + date labels,
// design tokens via Tailwind classes, motion-safe transitions only.
// role="img" with a full-sentence aria-label; shapes aria-hidden.

"use client";

import type { Milestone } from "@/lib/calculators/debtFreedomPlanner";

const W = 640;
const H = 96;
const PAD = 28;

export function DebtFreedomTimeline({
  milestones,
  ariaLabel,
}: {
  milestones: Milestone[];
  ariaLabel: string;
}) {
  const n = milestones.length;
  const x = (idx: number) => PAD + (idx / (n - 1)) * (W - PAD * 2);
  const railY = 40;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel} className="w-full">
      <g aria-hidden="true">
        {/* Rail */}
        <line x1={PAD} x2={W - PAD} y1={railY} y2={railY} className="stroke-muted" strokeWidth="6" strokeLinecap="round" />
        <line
          x1={PAD}
          x2={W - PAD}
          y1={railY}
          y2={railY}
          className="stroke-primary/50 motion-safe:transition-all motion-safe:duration-700"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="4 7"
        />
        {milestones.map((m, idx) => {
          const cx = x(idx);
          const isEnd = idx === n - 1;
          const isStart = idx === 0;
          return (
            <g key={m.label}>
              <circle
                cx={cx}
                cy={railY}
                r={isEnd ? 9 : 7}
                className={
                  isEnd
                    ? "fill-success"
                    : isStart
                      ? "fill-foreground"
                      : "fill-primary"
                }
              />
              {isEnd && (
                <path
                  d={`M ${cx - 3.4} ${railY} l 2.4 2.6 l 4.4 -5`}
                  className="stroke-background"
                  strokeWidth="1.8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              <text x={cx} y={railY - 14} textAnchor="middle" className="fill-foreground" fontSize="10.5" fontWeight={700}>
                {m.label}
              </text>
              <text x={cx} y={railY + 22} textAnchor="middle" className="fill-muted-foreground" fontSize="9">
                {m.monthLabel}
              </text>
              <text x={cx} y={railY + 34} textAnchor="middle" className="fill-muted-foreground" fontSize="8.5">
                {m.dateLabel}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

