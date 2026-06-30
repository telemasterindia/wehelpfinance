import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import type { ReactNode } from "react";

export function KeyTakeaway({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-2xl border-l-4 border-primary bg-primary-soft/30 p-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Key Takeaway</p>
      <div className="text-sm leading-relaxed text-foreground">{children}</div>
    </div>
  );
}

export type ComparisonRow = { label: string; values: string[] };

export function ComparisonTable({
  title,
  columns,
  rows,
}: {
  title?: string;
  columns: string[];
  rows: ComparisonRow[];
}) {
  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-border">
      {title && (
        <div className="border-b border-border bg-muted/40 px-5 py-3">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-primary/5">
              <th className="px-4 py-3 text-left font-semibold text-foreground">Criteria</th>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 text-left font-semibold text-foreground">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.label} className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-background" : "bg-muted/10"}`}>
                <td className="px-4 py-3 font-medium text-foreground">{row.label}</td>
                {row.values.map((value) => (
                  <td key={`${row.label}-${value}`} className="px-4 py-3 text-muted-foreground">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="my-8 grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-success">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Advantages
        </h3>
        <ul className="space-y-2">
          {pros.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-destructive">
          <XCircle className="h-4 w-4" aria-hidden="true" /> Trade-offs
        </h3>
        <ul className="space-y-2">
          {cons.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function WhoShouldUse({
  shouldUse,
  shouldAvoid,
}: {
  shouldUse: string[];
  shouldAvoid: string[];
}) {
  return (
    <div className="my-8 grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border-2 border-primary/30 bg-primary-soft/20 p-5">
        <h3 className="mb-3 text-sm font-semibold text-primary">Who Should Consider This</h3>
        <ul className="space-y-2">
          {shouldUse.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-foreground/90">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-800">
          <AlertTriangle className="h-4 w-4" aria-hidden="true" /> Who Should Look Elsewhere
        </h3>
        <ul className="space-y-2">
          {shouldAvoid.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-amber-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function QualificationCriteria({
  title = "Qualification Criteria",
  items,
}: {
  title?: string;
  items: { label: string; detail: string }[];
}) {
  return (
    <div className="my-8 rounded-2xl border border-border bg-card p-6">
      <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProcessTimeline({
  steps,
}: {
  steps: { label: string; timeframe: string; description: string }[];
}) {
  return (
    <div className="my-8">
      <div className="relative">
        <div className="absolute bottom-2 left-4 top-2 w-0.5 bg-border" aria-hidden="true" />
        <div className="space-y-6">
          {steps.map((step, i) => (
            <div key={step.label} className="relative pl-12">
              <span className="absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </span>
              <div className="flex flex-wrap items-baseline gap-2">
                <h4 className="text-sm font-semibold text-foreground">{step.label}</h4>
                <span className="text-xs font-medium text-primary">{step.timeframe}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CommonMistakes({
  title = "Common Mistakes to Avoid",
  items,
}: {
  title?: string;
  items: { mistake: string; reality: string }[];
}) {
  return (
    <div className="my-8 space-y-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {items.map((item) => (
        <div key={item.mistake} className="rounded-xl border border-border bg-card p-4">
          <p className="flex items-start gap-2 text-sm font-medium text-destructive">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {item.mistake}
          </p>
          <p className="mt-2 pl-6 text-sm text-muted-foreground">{item.reality}</p>
        </div>
      ))}
    </div>
  );
}

export function NextSteps({ steps }: { steps: { label: string; href: string }[] }) {
  return (
    <div className="my-8 rounded-2xl border border-border bg-muted/20 p-6">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Next Steps</h3>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <Link
            key={step.href}
            href={step.href}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {i + 1}
            </span>
            {step.label}
            <ArrowRight className="ml-auto h-4 w-4" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </div>
  );
}
