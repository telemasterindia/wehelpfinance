// src/components/tools/ToolReport.tsx
//
// Shared branded report layout (Sprint 5 platform addition) used by
// every Financial Tool. Renders a print-only document via a React
// portal attached directly to <body>, so `@media print` can hide the
// entire application with one selector and show only the report —
// no edits to SiteLayout, pages, or global styles are needed.
//
// Print strategy (dependency-free, per platform standards):
//   • Screen: the portal root is display:none — zero visual/layout
//     impact, zero CLS, zero hydration cost beyond the static markup.
//   • Print: `body > *:not([data-tool-report])` is hidden and the
//     report becomes the only flow content. Works identically for
//     the Print button and the browser's own Save-as-PDF path, on
//     desktop and mobile, with no PDF library.
//   • A position:fixed footer repeats WeHelpFinance branding + the
//     educational disclaimer on every printed page (supported by all
//     evergreen browsers). CSS page counters in margin boxes are not
//     reliably supported by browsers, so page numbers are omitted —
//     the spec allows this ("where technically practical").
//   • Grayscale-safe: black text on white, one teal accent used only
//     for rules/headings, no large ink-heavy backgrounds.
//
// All content is passed pre-formatted via the ToolReportData
// contract (src/lib/calculators/report.ts). This component never
// computes, stores, or transmits anything.

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type {
  ToolReportData,
  ToolReportMetricDatum,
  ToolReportOptionDatum,
} from "@/lib/calculators/report";
import { REPORT_DISCLAIMER } from "@/lib/calculators/report";
import { ORGANIZATION, SITE_URL } from "@/lib/organizationConfig";

// ─── Print stylesheet (deliverable 3 — shared report print styles) ────────────
//
// Kept in one template literal so the whole print system ships as a
// single component with no global-CSS coupling. Class prefix `twr-`
// (Tool WeHelpFinance Report) avoids collisions with Tailwind.

const PRINT_STYLES = `
[data-tool-report] { display: none; }

@media print {
  @page { margin: 14mm 14mm 24mm; }

  body > *:not([data-tool-report]) { display: none !important; }

  [data-tool-report] {
    display: block !important;
    color: #111827;
    background: #ffffff;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 11pt;
    line-height: 1.5;
  }

  [data-tool-report] .twr-sans {
    font-family: Helvetica, Arial, sans-serif;
  }

  [data-tool-report] .twr-header {
    border-bottom: 3px solid #1f6e69;
    padding-bottom: 10pt;
    margin-bottom: 14pt;
  }
  [data-tool-report] .twr-brand {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 16pt;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: #1f6e69;
  }
  [data-tool-report] .twr-brand-sub {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 9pt;
    color: #374151;
    margin-top: 2pt;
  }
  [data-tool-report] .twr-title {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 15pt;
    font-weight: 700;
    color: #111827;
    margin: 10pt 0 2pt;
  }
  [data-tool-report] .twr-date {
    font-size: 9.5pt;
    color: #4b5563;
  }

  [data-tool-report] .twr-section {
    break-inside: avoid;
    margin: 0 0 12pt;
  }
  [data-tool-report] .twr-section-title {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 10pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #1f6e69;
    border-bottom: 1px solid #d1d5db;
    padding-bottom: 3pt;
    margin-bottom: 6pt;
    break-after: avoid;
  }

  [data-tool-report] .twr-metrics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6pt 16pt;
    margin: 0;
  }
  [data-tool-report] .twr-metric { break-inside: avoid; }
  [data-tool-report] .twr-metric dt {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 8.5pt;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #4b5563;
  }
  [data-tool-report] .twr-metric dd {
    margin: 1pt 0 0;
    font-size: 12pt;
    font-weight: 700;
    color: #111827;
  }
  [data-tool-report] .twr-metric .twr-hint {
    display: block;
    font-size: 8.5pt;
    font-weight: 400;
    color: #6b7280;
    margin-top: 1pt;
  }

  [data-tool-report] table.twr-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9.5pt;
  }
  [data-tool-report] table.twr-table caption {
    text-align: left;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 8.5pt;
    color: #4b5563;
    margin-bottom: 4pt;
  }
  [data-tool-report] table.twr-table th,
  [data-tool-report] table.twr-table td {
    border: 1px solid #d1d5db;
    padding: 4pt 6pt;
    text-align: left;
    vertical-align: top;
  }
  [data-tool-report] table.twr-table th {
    font-family: Helvetica, Arial, sans-serif;
    font-weight: 700;
    background: #f3f4f6;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  [data-tool-report] table.twr-table tr { break-inside: avoid; }

  [data-tool-report] ul.twr-list,
  [data-tool-report] ol.twr-list {
    margin: 0;
    padding-left: 14pt;
  }
  [data-tool-report] ul.twr-list li,
  [data-tool-report] ol.twr-list li {
    margin-bottom: 3pt;
    break-inside: avoid;
  }

  [data-tool-report] .twr-option { break-inside: avoid; margin-bottom: 7pt; }
  [data-tool-report] .twr-option-name {
    font-family: Helvetica, Arial, sans-serif;
    font-weight: 700;
    font-size: 10.5pt;
  }
  [data-tool-report] .twr-option-why {
    margin: 1pt 0 0;
    font-size: 10pt;
    color: #1f2937;
  }

  [data-tool-report] .twr-note {
    border: 1px solid #d1d5db;
    border-left: 3px solid #1f6e69;
    padding: 6pt 8pt;
    font-size: 9.5pt;
    color: #1f2937;
    break-inside: avoid;
  }

  [data-tool-report] .twr-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #d1d5db;
    padding-top: 4pt;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 8pt;
    color: #4b5563;
    background: #ffffff;
  }
  [data-tool-report] .twr-footer .twr-footer-brand {
    font-weight: 700;
    color: #1f6e69;
  }
  /* Reserve space so flow content never collides with the fixed footer. */
  [data-tool-report] .twr-footer-spacer { height: 34pt; }
}
`;

// ─── Building blocks ──────────────────────────────────────────────────────────

export function ToolReportHeader({
  title,
  generatedLabel,
}: {
  title: string;
  generatedLabel: string;
}) {
  const phone = ORGANIZATION.contactPoint.telephone.replace("+1-", "");
  return (
    <header className="twr-header">
      <p className="twr-brand">{ORGANIZATION.name}</p>
      <p className="twr-brand-sub">
        wehelpfinance.com &nbsp;•&nbsp; {phone} &nbsp;•&nbsp;{" "}
        {ORGANIZATION.contactPoint.email}
      </p>
      <h1 className="twr-title">{title}</h1>
      <p className="twr-date">Generated {generatedLabel}</p>
    </header>
  );
}

export function ToolReportSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="twr-section">
      <h2 className="twr-section-title">{title}</h2>
      {children}
    </section>
  );
}

export function ToolReportMetrics({
  items,
}: {
  items: ToolReportMetricDatum[];
}) {
  return (
    <dl className="twr-metrics">
      {items.map((m) => (
        <div className="twr-metric" key={m.label}>
          <dt>{m.label}</dt>
          <dd>
            {m.value}
            {m.hint ? <span className="twr-hint">{m.hint}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function ToolReportOptions({
  items,
}: {
  items: ToolReportOptionDatum[];
}) {
  return (
    <div>
      {items.map((o, idx) => (
        <div className="twr-option" key={o.name}>
          <p className="twr-option-name">
            {idx + 1}. {o.name}
          </p>
          <p className="twr-option-why">{o.why}</p>
        </div>
      ))}
    </div>
  );
}

export function ToolReportFooter() {
  const phone = ORGANIZATION.contactPoint.telephone.replace("+1-", "");
  return (
    <>
      <div className="twr-footer-spacer" aria-hidden="true" />
      <footer className="twr-footer">
        <span className="twr-footer-brand">{ORGANIZATION.name}</span>
        {" — "}
        {SITE_URL.replace("https://", "")} • {phone} •{" "}
        {ORGANIZATION.contactPoint.email}
        <br />
        {REPORT_DISCLAIMER}
      </footer>
    </>
  );
}

// ─── Layout (portal) ──────────────────────────────────────────────────────────

export function ToolReportLayout({
  data,
  children,
}: {
  data: ToolReportData;
  /** optional print-safe visual summary (e.g. CostBars markup) */
  children?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div data-tool-report="" aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />

      <ToolReportHeader
        title={data.title}
        generatedLabel={data.generatedLabel}
      />

      <ToolReportSection title="Your financial snapshot">
        <ToolReportMetrics items={data.snapshot} />
      </ToolReportSection>

      <ToolReportSection title="Key results">
        <ToolReportMetrics items={data.results} />
      </ToolReportSection>

      {children ? (
        <ToolReportSection title="Visual summary">{children}</ToolReportSection>
      ) : null}

      {data.comparison ? (
        <ToolReportSection title="Side-by-side comparison">
          <table className="twr-table">
            <caption>{data.comparison.caption}</caption>
            <thead>
              <tr>
                <th scope="col">Compare</th>
                {data.comparison.columns.map((c) => (
                  <th scope="col" key={c}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.comparison.rows.map((r) => (
                <tr key={r.label}>
                  <th scope="row">{r.label}</th>
                  {r.cells.map((cell, i) => (
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {data.comparison.note ? (
            <p
              style={{ fontSize: "8.5pt", color: "#6b7280", marginTop: "4pt" }}
            >
              {data.comparison.note}
            </p>
          ) : null}
        </ToolReportSection>
      ) : null}

      {data.options && data.options.length > 0 ? (
        <ToolReportSection title="Options worth exploring">
          <ToolReportOptions items={data.options} />
        </ToolReportSection>
      ) : null}

      {data.nextSteps && data.nextSteps.length > 0 ? (
        <ToolReportSection title="Suggested next steps">
          <ol className="twr-list">
            {data.nextSteps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </ToolReportSection>
      ) : null}

      {data.assumptions && data.assumptions.length > 0 ? (
        <ToolReportSection title="Assumptions used in this estimate">
          <ul className="twr-list">
            {data.assumptions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </ToolReportSection>
      ) : null}

      {data.methodology && data.methodology.length > 0 ? (
        <ToolReportSection title="How these numbers were calculated">
          <ul className="twr-list">
            {data.methodology.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </ToolReportSection>
      ) : null}

      {data.extraNote ? <p className="twr-note">{data.extraNote}</p> : null}

      <ToolReportSection title="Important disclaimer">
        <p style={{ fontSize: "9.5pt" }}>
          This report is an educational estimate generated from the information
          you entered. It is not a loan offer, a loan approval, a guarantee of
          savings, or financial, legal, or tax advice. Actual rates, terms,
          fees, and eligibility depend on individual lender or provider
          underwriting and can differ significantly from these estimates.
          {ORGANIZATION.name} is not a lender, bank, law firm, credit repair
          organization, or tax advisory firm — we connect consumers with
          independent financial service providers.
        </p>
      </ToolReportSection>

      <ToolReportFooter />
    </div>,
    document.body,
  );
}
