// src/components/tools/DtiMeter.tsx
//
// DTI visuals — Sprint 3. Two reusable primitives following the
// platform chart contract (semantic HTML/CSS, zero dependencies,
// role="img" with sentence-form labels, printed values, no
// animation, token colors only):
//
//   DtiMeter            — banded 0→60%+ track with a position marker.
//                         Reusable by any future ratio/score tool
//                         (Financial Health Score, utilization, etc.)
//                         via the generic zones prop.
//   IncomeAllocationBar — 3-segment stacked bar (housing / other
//                         debt / remaining income), same pattern as
//                         SavingsBreakdown without modifying it.

"use client";

export interface MeterZone {
  /** inclusive upper bound of the zone, in the meter's unit */
  max: number;
  label: string;
  tone: "success" | "gold" | "destructive";
}

const ZONE_BG: Record<MeterZone["tone"], string> = {
  success: "bg-success",
  gold: "bg-gold",
  destructive: "bg-destructive/80",
};

export function DtiMeter({
  value,
  displayValue,
  zones,
  cap = 60,
  bandLabel,
  ariaContext = "Debt-to-income ratio",
}: {
  /** raw value used for marker position (clamped to cap) */
  value: number;
  /** exact text to print, e.g. "47.3%" or "112.0%" */
  displayValue: string;
  zones: MeterZone[];
  cap?: number;
  bandLabel: string;
  ariaContext?: string;
}) {
  const clamped = Math.max(0, Math.min(value, cap));
  const markerPct = (clamped / cap) * 100;
  const pinned = value > cap;

  const desc = `${ariaContext}: ${displayValue}, in the ${bandLabel} range${
    pinned ? `, beyond the ${cap}% scale shown` : ""
  }.`;

  let prev = 0;

  return (
    <figure className="w-full">
      <div className="relative pt-7 pb-1" role="img" aria-label={desc}>
        {/* Marker + printed value */}
        <div
          aria-hidden="true"
          className="absolute top-0 -translate-x-1/2 text-center"
          style={{ left: `${markerPct}%` }}
        >
          <span className="whitespace-nowrap rounded-full bg-foreground px-2 py-0.5 text-[11px] font-bold text-background">
            {displayValue}
          </span>
          <div className="mx-auto h-2 w-0.5 bg-foreground" />
        </div>

        {/* Banded track */}
        <div className="flex h-4 w-full overflow-hidden rounded-full border border-border">
          {zones.map((z) => {
            const upper = Math.min(z.max, cap);
            const width = ((upper - prev) / cap) * 100;
            prev = upper;
            if (width <= 0) return null;
            return (
              <div
                key={z.label}
                className={`h-full ${ZONE_BG[z.tone]}`}
                style={{ width: `${width}%` }}
              />
            );
          })}
        </div>

        {/* Scale ticks */}
        <div aria-hidden="true" className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>0%</span>
          <span>{Math.round(cap / 2)}%</span>
          <span>{cap}%{pinned ? "+" : ""}</span>
        </div>
      </div>

      <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        {zones.map((z, idx) => {
          const lower = idx === 0 ? 0 : zones[idx - 1].max;
          const upperLabel = z.max === Infinity || z.max >= cap ? `${cap}%+` : `${z.max}%`;
          return (
            <span key={z.label} className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className={`inline-block h-2.5 w-2.5 rounded-sm ${ZONE_BG[z.tone]}`} />
              {z.label} ({idx === 0 ? "≤" : `${lower + 0.1}–`}{idx === 0 ? `${z.max}%` : upperLabel})
            </span>
          );
        })}
      </figcaption>
    </figure>
  );
}

// ─── Income allocation stacked bar ────────────────────────────────────────────

export function IncomeAllocationBar({
  housingPct,
  otherPct,
  remainingPct,
}: {
  housingPct: number;
  otherPct: number;
  remainingPct: number;
}) {
  const desc = `Of your gross monthly income: ${housingPct}% goes to housing, ${otherPct}% to other debt payments, leaving ${remainingPct}% for everything else.`;

  return (
    <figure>
      <div
        className="flex h-5 w-full overflow-hidden rounded-full border border-border"
        role="img"
        aria-label={`Income allocation. ${desc}`}
      >
        <div className="h-full bg-primary" style={{ width: `${housingPct}%` }} />
        <div className="h-full bg-gold" style={{ width: `${otherPct}%` }} />
        <div className="h-full bg-success" style={{ width: `${remainingPct}%` }} />
      </div>
      <figcaption className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-sm bg-primary" />
          Housing ({housingPct}%)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-sm bg-gold" />
          Other debt ({otherPct}%)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-sm bg-success" />
          Everything else ({remainingPct}%)
        </span>
      </figcaption>
    </figure>
  );
}
