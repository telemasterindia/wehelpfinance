// src/components/tools/CompareTable.tsx
//
// Reusable comparison matrix — Sprint 4 platform addition. Generic
// column/row model so future tools (Loan Comparison, Budget vs.
// Actual, plan tiers) reuse it unchanged. Zero dependencies.
//
// Accessibility: a real <table> with scoped headers, a caption, and
// a sticky first column inside a horizontally scrollable region
// (keyboard-scrollable via tabIndex, labeled). Highlighted column is
// conveyed by a printed badge, never color alone.

"use client";

import type { ReactNode } from "react";

export interface CompareColumn {
  key: string;
  label: string;
  /** printed badge above the column label, e.g. "Best fit" */
  badge?: string;
  highlight?: boolean;
}

export interface CompareRow {
  label: string;
  /** one cell per column, same order as columns */
  values: ReactNode[];
}

export function CompareTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: CompareColumn[];
  rows: CompareRow[];
}) {
  return (
    <div
      className="overflow-x-auto rounded-2xl border border-border"
      tabIndex={0}
      role="region"
      aria-label={caption}
    >
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="bg-muted/60">
            <th
              scope="col"
              className="sticky left-0 z-10 bg-muted/60 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur"
            >
              Compare
            </th>
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={`px-4 py-3 text-left align-bottom ${
                  c.highlight ? "bg-primary-soft/50" : ""
                }`}
              >
                {c.badge && (
                  <span className="mb-1 inline-block rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    {c.badge}
                  </span>
                )}
                <span className="block font-display text-sm font-semibold text-foreground">
                  {c.label}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={r.label} className={ri % 2 ? "bg-muted/20" : "bg-card"}>
              <th
                scope="row"
                className={`sticky left-0 z-10 px-4 py-3 text-left text-xs font-semibold text-foreground backdrop-blur ${
                  ri % 2 ? "bg-muted/20" : "bg-card"
                }`}
              >
                {r.label}
              </th>
              {r.values.map((v, ci) => (
                <td
                  key={ci}
                  className={`px-4 py-3 align-top text-foreground/90 ${
                    columns[ci]?.highlight ? "bg-primary-soft/25" : ""
                  }`}
                >
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
