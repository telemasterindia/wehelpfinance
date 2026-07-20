// src/components/tools/ConsumerRightsWizard.tsx
//
// Consumer Rights & Debt Options Wizard — Sprint 10 client component.
// Two phases: adaptive wizard (DecisionStepper) → educational results.
// Reuses the shared report system, analytics conventions (existing
// event names only — wizard start = calculator_viewed, completion =
// calculation_completed with bands/labels, tool clicks = cta_clicked),
// and every shared primitive. No dollars, scores, or PII in analytics.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  WIZARD_STEPS,
  visibleSteps,
  stepAnswered,
  calculateGuidance,
  DOCUMENT_CATALOG,
  type WizardAnswers,
  type GuidanceResult,
} from "@/lib/wizards/consumerRightsWizard";
import { trackToolEvent } from "@/lib/calculators/track";
import { DecisionStepper } from "@/components/tools/DecisionStepper";
import { NoticeBox, SoftCTA } from "@/components/tools/ResultBlocks";
import { StatCard } from "@/components/tools/ToolCharts";
import { ToolReportActions } from "@/components/tools/ToolReportActions";
import { reportDateLabel, type ToolReportData } from "@/lib/calculators/report";
import Link from "next/link";
import { FileText, Pencil, CheckCircle2 } from "lucide-react";

export function ConsumerRightsWizard() {
  const [answers, setAnswers] = useState<WizardAnswers>({});
  const [phase, setPhase] = useState<"wizard" | "results">("wizard");
  const resultsHeadingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    // Wizard Started
    trackToolEvent("calculator_viewed", { tool: "consumer_rights" });
  }, []);

  const steps = useMemo(() => visibleSteps(answers), [answers]);

  const result: GuidanceResult | null = useMemo(() => {
    if (phase !== "results") return null;
    const out = calculateGuidance(answers);
    return out.ok ? out : null;
  }, [phase, answers]);

  // Wizard Completed / Recommendations Viewed — bands and labels only.
  useEffect(() => {
    if (!result) return;
    trackToolEvent("calculation_completed", {
      tool: "consumer_rights",
      debt_type: answers.debtType ?? "",
      status: answers.status ?? "",
      dti_band: result.dtiBand.key,
      credit_band: answers.creditBand ?? "",
      goal: answers.goal ?? "",
    });
    resultsHeadingRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  function onChange(id: string, value: string) {
    setAnswers((a) => ({ ...a, [id]: value }));
  }
  function onStepShown(id: string) {
    trackToolEvent("tool_option_changed", { tool: "consumer_rights", option: `step_${id}` });
  }
  function onToolClick(href: string) {
    // Suggested Tool Clicked
    trackToolEvent("cta_clicked", { tool: "consumer_rights", source: "wizard_results", target: href });
  }

  const reportData: ToolReportData | null = useMemo(() => {
    if (!result) return null;
    const r = result;
    return {
      toolSlug: "consumer_rights",
      title: "Consumer Rights & Debt Options Summary",
      generatedLabel: reportDateLabel(),
      snapshot: [
        { label: "State", value: r.stateName },
        { label: "Debt focus", value: r.debtTypeLabel },
        { label: "Status", value: r.statusLabel },
        { label: "Estimated DTI", value: `${r.dti.toFixed(1)}%`, hint: r.dtiBand.label },
        { label: "Goal", value: r.goalLabel },
      ],
      results: [
        ...r.situation.map((s2, i) => ({ label: i === 0 ? "Your situation" : " ", value: s2 })),
      ],
      comparison: {
        caption: "Educational rights overview (general information, not legal advice)",
        columns: ["What it generally means"],
        rows: r.rights.map((x) => ({ label: x.title, cells: [x.detail] })),
        note: "Consumer-protection specifics vary by state; a licensed attorney or your state legal-aid program can address your specific case.",
      },
      options: r.options.map((o) => ({ name: o.title, why: o.detail })),
      nextSteps: [
        ...r.nextSteps,
        "Suggested tools: " + r.tools.map((t) => t.name).join(" · "),
        "Documents worth preparing (coming to WeHelpFinance): " + r.documents.map((d) => d.name).join(" · "),
      ],
      assumptions: r.assumptions,
      methodology: [
        "This wizard provides general consumer education keyed to your answers — it does not provide legal advice, predict outcomes, or determine eligibility for any program.",
        "DTI is estimated from your income range midpoint using the same rounding and bands as the WeHelpFinance DTI Calculator.",
        "Recommendations use the same shared gating rules as the WeHelpFinance calculators (settlement program floor, ~640+ refinance credit zone, lender DTI bands).",
      ],
      extraNote:
        "Action checklist: " + r.checklist.map((c, i) => `${i + 1}) ${c}`).join("  "),
    };
  }, [result]);

  return (
    <div className="mx-auto max-w-3xl">
      {phase === "wizard" && (
        <>
          <DecisionStepper
            steps={steps}
            answers={answers}
            onChange={onChange}
            onStepShown={onStepShown}
            onComplete={() => setPhase("results")}
            completeLabel="See my educational guidance"
            isAnswered={stepAnswered}
          />
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Educational guidance only — never legal advice, never a promise of any outcome.
          </p>
        </>
      )}

      {phase === "results" && result && (
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-3">
            <h3
              ref={resultsHeadingRef}
              tabIndex={-1}
              className="font-display text-2xl text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-lg"
            >
              Your educational guidance
            </h3>
            <button
              type="button"
              onClick={() => setPhase("wizard")}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              Edit answers
            </button>
          </div>

          <NoticeBox tone="neutral">
            General consumer education based on your answers — not legal advice, not a
            substitute for a licensed attorney in {result.stateName}, and never a promise of
            any outcome or qualification.
          </NoticeBox>

          {/* Situation */}
          <div className="rounded-3xl border border-border bg-card p-5">
            <h4 className="font-display text-lg text-foreground">Your current situation</h4>
            <ul className="mt-3 space-y-2">
              {result.situation.map((s2) => (
                <li key={s2} className="flex items-start gap-2 text-sm text-foreground/90">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  {s2}
                </li>
              ))}
            </ul>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <StatCard label="Estimated DTI" value={`${result.dti.toFixed(1)}%`} sub={result.dtiBand.label} />
              <StatCard label="Monthly debt payments" value={`$${result.monthlyDebt.toLocaleString()}`} sub="as entered" />
            </div>
          </div>

          {/* Rights */}
          <div className="rounded-3xl border border-border bg-card p-5">
            <h4 className="font-display text-lg text-foreground">Consumer rights overview</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              General education on widely applicable federal protections — state specifics
              vary, and only a licensed attorney can advise on your case.
            </p>
            <ul className="mt-4 space-y-4">
              {result.rights.map((x) => (
                <li key={x.title}>
                  <p className="font-semibold text-foreground">{x.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{x.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Guidance */}
          <div className="rounded-3xl border border-border bg-card p-5">
            <h4 className="font-display text-lg text-foreground">Educational guidance</h4>
            <ul className="mt-4 space-y-4">
              {result.guidance.map((x) => (
                <li key={x.title}>
                  <p className="font-semibold text-foreground">{x.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{x.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Options */}
          <div className="rounded-3xl border border-border bg-card p-5">
            <h4 className="font-display text-lg text-foreground">Financial options worth exploring</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Ranked for your answers — every path has trade-offs, and provider or lender
              review decides real outcomes.
            </p>
            <ol className="mt-4 space-y-4">
              {result.options.map((o, idx) => (
                <li key={o.title} className="rounded-2xl border border-border bg-background p-4">
                  <p className="font-semibold text-foreground">{idx + 1}. {o.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{o.detail}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Suggested tools */}
          <div className="rounded-3xl border border-primary/30 bg-primary-soft/20 p-5">
            <h4 className="font-display text-lg text-foreground">Suggested WeHelpFinance tools</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Free, private, no sign-up — each one continues where this wizard leaves off.
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {result.tools.map((t) => (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    onClick={() => onToolClick(t.href)}
                    className="block h-full rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/50 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <p className="font-semibold text-primary">{t.name} →</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t.why}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Relevant documents */}
          <div className="rounded-3xl border border-border bg-card p-5">
            <h4 className="font-display text-lg text-foreground">Documents worth preparing</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Letter builders for these are coming to WeHelpFinance — for now, know which
              ones fit your situation and why.
            </p>
            <ul className="mt-4 space-y-3">
              {result.documents.map((d) => (
                <li key={d.name} className="flex items-start gap-3 text-sm">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>
                    <span className="font-semibold text-foreground">{d.name}</span>
                    <span className="ml-1.5 rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Coming soon</span>
                    <span className="mt-0.5 block text-muted-foreground">{d.why}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Next steps + checklist */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-5">
              <h4 className="font-display text-lg text-foreground">Recommended next steps</h4>
              <ol className="mt-3 space-y-2.5">
                {result.nextSteps.map((s2, idx) => (
                  <li key={s2} className="flex gap-2.5 text-sm text-foreground/90">
                    <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft font-display text-xs text-primary">{idx + 1}</span>
                    {s2}
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-3xl border border-border bg-card p-5">
              <h4 className="font-display text-lg text-foreground">Action checklist</h4>
              <ul className="mt-3 space-y-2.5">
                {result.checklist.map((c) => (
                  <li key={c} className="flex items-start gap-2.5 text-sm text-foreground/90">
                    <span aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 rounded border border-border bg-background" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {reportData && <ToolReportActions data={reportData} />}

          <SoftCTA
            heading="Want to talk through your situation with a person?"
            body="Walk through your options, the education above, and what fits your goals with a specialist — free and confidential."
            tool="consumer_rights"
            source="consumer_rights_wizard"
          />
        </div>
      )}

      {/* Document Center — full catalog, reusable dashed-card pattern */}
      <section aria-labelledby="doc-center-heading" className="mt-10">
        <h3 id="doc-center-heading" className="font-display text-xl text-foreground">
          Document Center
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Guided letter builders coming to WeHelpFinance — each will pair a plain-English
          explainer with a ready-to-customize educational template.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOCUMENT_CATALOG.map((d) => (
            <div key={d.name} className="rounded-3xl border border-dashed border-border bg-card/60 p-5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-muted">
                <FileText className="h-4.5 w-4.5 text-muted-foreground" aria-hidden="true" />
              </span>
              <p className="mt-2.5 font-display text-sm font-semibold text-foreground">{d.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{d.blurb}</p>
              <span className="mt-2.5 inline-flex rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Coming soon
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

