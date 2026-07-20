"use client";

import { Printer } from "lucide-react";
import type { ToolReportData } from "@/lib/calculators/report";

function Items({ items }: { items: ToolReportData["results"] }) {
  return (
    <dl className="report-grid">
      {items.map((item) => (
        <div key={item.label} className="report-item">
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
          {item.hint && <small>{item.hint}</small>}
        </div>
      ))}
    </dl>
  );
}

export function ToolReportActions({ data }: { data: ToolReportData }) {
  return (
    <>
      <div className="print:hidden rounded-3xl border border-border bg-card p-5">
        <h3 className="font-display text-lg text-foreground">Save your results</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Open your browser&rsquo;s print dialog, then choose &ldquo;Save as PDF&rdquo; to keep a copy.
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Printer className="h-4 w-4" aria-hidden="true" /> Print / Save as PDF
        </button>
      </div>

      <article className="tool-print-report hidden print:block" aria-label={data.title}>
        <header>
          <p className="report-brand">WeHelpFinance</p>
          <h1>{data.title}</h1>
          <p>Generated {data.generatedLabel}</p>
          <p>(718) 360-4806 · help@wehelpfinance.com · www.wehelpfinance.com</p>
        </header>
        <h2>Your entries</h2>
        <Items items={data.snapshot} />
        <h2>Estimated results</h2>
        <Items items={data.results} />
        {data.comparison && (
          <section>
            <h2>{data.comparison.caption}</h2>
            <table>
              <thead><tr><th>Measure</th>{data.comparison.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
              <tbody>{data.comparison.rows.map((row) => <tr key={row.label}><th>{row.label}</th>{row.cells.map((cell, index) => <td key={`${row.label}-${index}`}>{cell}</td>)}</tr>)}</tbody>
            </table>
            {data.comparison.note && <p>{data.comparison.note}</p>}
          </section>
        )}
        <h2>Options to explore</h2>
        <ul>{data.options.map((option) => <li key={option.name}><strong>{option.name}:</strong> {option.why}</li>)}</ul>
        <h2>Next steps</h2>
        <ol>{data.nextSteps.map((step) => <li key={step}>{step}</li>)}</ol>
        <h2>Methodology and assumptions</h2>
        <ul>{[...data.methodology, ...data.assumptions].map((item) => <li key={item}>{item}</li>)}</ul>
        <footer>
          <strong>Important disclaimer:</strong> Educational estimates only. This report is not financial advice, a loan offer, a rate quote, or an approval. Actual pricing, PMI, and eligibility are determined by lender underwriting.
        </footer>
      </article>

      <style jsx global>{`
        @media print {
          @page { margin: 0.55in; }
          body *:not(:has(.tool-print-report)):not(.tool-print-report):not(.tool-print-report *) { display: none !important; }
          body *:has(.tool-print-report) { display: block !important; position: static !important; width: auto !important; max-width: none !important; min-height: 0 !important; margin: 0 !important; padding: 0 !important; }
          .tool-print-report { display: block !important; position: static !important; color: #17231f; font: 10pt/1.35 Arial, sans-serif; }
          .tool-print-report header { border-bottom: 3px solid #0b6b50; margin-bottom: 18px; padding-bottom: 12px; }
          .tool-print-report .report-brand { color: #0b6b50; font-size: 18pt; font-weight: 800; }
          .tool-print-report h1 { font-size: 20pt; margin: 4px 0; }
          .tool-print-report h2 { color: #0b6b50; font-size: 13pt; margin: 18px 0 7px; break-after: avoid; }
          .tool-print-report .report-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 14px; }
          .tool-print-report .report-item { border: 1px solid #d7dfdc; padding: 7px; break-inside: avoid; }
          .tool-print-report dt { color: #53615c; font-size: 8pt; }
          .tool-print-report dd { font-size: 11pt; font-weight: 700; margin: 1px 0; }
          .tool-print-report small { color: #53615c; }
          .tool-print-report table { border-collapse: collapse; width: 100%; }
          .tool-print-report th, .tool-print-report td { border: 1px solid #cbd5d1; padding: 6px; text-align: left; }
          .tool-print-report li { margin-bottom: 4px; }
          .tool-print-report footer { border-top: 2px solid #0b6b50; margin-top: 20px; padding-top: 10px; }
          .tool-print-report header, .tool-print-report footer { break-inside: avoid; }
        }
      `}</style>
    </>
  );
}
