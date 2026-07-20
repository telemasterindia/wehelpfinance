// src/lib/calculators/report.ts
//
// Shared report-data contract for the WeHelpFinance branded report
// system (Sprint 5 platform addition). Every calculator builds ONE
// ToolReportData object from results it is already displaying and
// hands it to <ToolReportActions>. Nothing here fetches, stores, or
// transmits anything — reports are rendered entirely client-side
// from values the user has already seen on screen.
//
// Design rules (platform standard):
//   • All values arrive PRE-FORMATTED as strings. The report layer
//     never does math and never sees raw numbers, which also makes
//     it impossible for the report system to leak un-rounded data.
//   • Every section is optional except title + snapshot + results,
//     so small tools (DTI) and large tools (Solutions Comparison)
//     share one contract.
//   • `toolSlug` is used ONLY for anonymous analytics event params
//     (e.g. { tool: "personal_loan" }) — never joined with values.

export interface ToolReportMetricDatum {
  label: string;
  /** pre-formatted display value, e.g. "$412.36" or "38.5%" */
  value: string;
  /** small print under the value, e.g. "at 14.9% typical APR" */
  hint?: string;
}

export interface ToolReportOptionDatum {
  name: string;
  /** one-paragraph educational "why this may be worth exploring" */
  why: string;
}

export interface ToolReportComparison {
  caption: string;
  /** first column is the row label; these are the value columns */
  columns: string[];
  rows: { label: string; cells: string[] }[];
  note?: string;
}

export interface ToolReportData {
  /** analytics slug, e.g. "personal_loan" — bands/slugs only, never values */
  toolSlug: string;
  /** report headline, e.g. "Personal Loan Estimate Report" */
  title: string;
  /** pre-formatted generation date label */
  generatedLabel: string;
  /** what the user entered (financial snapshot) */
  snapshot: ToolReportMetricDatum[];
  /** headline results */
  results: ToolReportMetricDatum[];
  /** documented assumptions behind the estimate */
  assumptions?: string[];
  /** side-by-side comparison, if the tool has one */
  comparison?: ToolReportComparison;
  /** ranked options worth exploring + why each appears */
  options?: ToolReportOptionDatum[];
  /** suggested next steps */
  nextSteps?: string[];
  /** how the numbers were calculated, in plain English */
  methodology?: string[];
  /** optional extra educational note rendered before the disclaimer */
  extraNote?: string;
}

/** "July 9, 2026" — locale-stable label for the report header. */
export function reportDateLabel(now: Date = new Date()): string {
  return now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Standard disclaimer line printed on every report page footer. */
export const REPORT_DISCLAIMER =
  "Educational estimate — not a loan offer, approval, or financial advice.";
