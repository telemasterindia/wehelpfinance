// src/components/tools/FinancialHealthGauge.tsx
//
// Reusable 0–100 semicircular gauge — Sprint 7. Pure SVG, no chart
// libraries. Colour bands follow the grade thresholds (0–40
// destructive, 40–70 gold, 70–100 success) using the platform's
// design tokens via Tailwind stroke classes, so the gauge stays in
// sync with any future theme change. The needle animates with a
// motion-safe CSS transition (700ms ease-out) and is static under
// prefers-reduced-motion.
//
// Accessibility: role="img" with a full-sentence aria-label; all
// internal shapes are aria-hidden. Live-region announcements are the
// parent's responsibility (the calculator already provides one).

"use client";

const CX = 100;
const CY = 100;
const R = 78;
const STROKE = 16;

/** Map score 0–100 → angle 180°→0° (left to right across the arc). */
function angleFor(score: number): number {
  const s = Math.max(0, Math.min(100, score));
  return 180 - (s / 100) * 180;
}

function polar(angleDeg: number, radius: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY - radius * Math.sin(rad) };
}

/** SVG arc path between two scores along the gauge radius. */
function arcPath(fromScore: number, toScore: number): string {
  const a1 = angleFor(fromScore);
  const a2 = angleFor(toScore);
  const p1 = polar(a1, R);
  const p2 = polar(a2, R);
  const largeArc = a1 - a2 > 180 ? 1 : 0;
  return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${R} ${R} 0 ${largeArc} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
}

export function FinancialHealthGauge({
  score,
  gradeLabel,
  ariaLabel,
  compact = false,
}: {
  score: number;
  gradeLabel: string;
  ariaLabel: string;
  /** smaller variant for the What-If panel */
  compact?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const needleAngle = angleFor(clamped);
  const tip = polar(needleAngle, R - STROKE / 2 - 4);

  return (
    <svg
      viewBox="0 0 200 116"
      role="img"
      aria-label={ariaLabel}
      className={compact ? "w-full max-w-[220px]" : "w-full max-w-[340px]"}
    >
      <g aria-hidden="true">
        {/* Track */}
        <path
          d={arcPath(0, 100)}
          className="stroke-muted"
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
        />
        {/* Colour bands aligned to grade thresholds */}
        <path d={arcPath(0, 40)} className="stroke-destructive/70" strokeWidth={STROKE} fill="none" strokeLinecap="round" />
        <path d={arcPath(40, 70)} className="stroke-gold" strokeWidth={STROKE} fill="none" />
        <path d={arcPath(70, 100)} className="stroke-success" strokeWidth={STROKE} fill="none" strokeLinecap="round" />

        {/* Needle — rotates around center; CSS transition animates score changes */}
        <g
          style={{ transform: `rotate(${90 - needleAngle}deg)`, transformOrigin: "100px 100px" }}
          className="motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-reduce:transition-none"
        >
          <line
            x1={CX}
            y1={CY}
            x2={CX}
            y2={CY - (R - STROKE / 2 - 4)}
            className="stroke-foreground"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </g>
        <circle cx={CX} cy={CY} r={6} className="fill-foreground" />
        <circle cx={tip.x} cy={tip.y} r={0} fill="none" />

        {/* Scale labels */}
        <text x={CX - R} y={CY + 14} textAnchor="middle" className="fill-muted-foreground" fontSize="9">
          0
        </text>
        <text x={CX + R} y={CY + 14} textAnchor="middle" className="fill-muted-foreground" fontSize="9">
          100
        </text>

        {/* Score + grade */}
        <text
          x={CX}
          y={compact ? CY - 26 : CY - 30}
          textAnchor="middle"
          className="fill-foreground font-display"
          fontSize={compact ? 26 : 32}
          fontWeight={700}
        >
          {clamped}
        </text>
        <text
          x={CX}
          y={compact ? CY - 10 : CY - 12}
          textAnchor="middle"
          className="fill-muted-foreground"
          fontSize={compact ? 9 : 10}
          style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
        >
          {gradeLabel}
        </text>
      </g>
    </svg>
  );
}

