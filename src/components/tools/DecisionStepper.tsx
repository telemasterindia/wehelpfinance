// src/components/tools/DecisionStepper.tsx
//
// DecisionStepper — Sprint 10 reusable platform component.
// A generic, adaptive multi-step wizard: one question per screen,
// visibility-driven flow (steps appear/disappear based on earlier
// answers), progress indication, and full keyboard/screen-reader
// support. Built to power future guided tools, not just the Consumer
// Rights Wizard.
//
// Contract:
//   • steps: WizardStep[] — engine-defined; `visible(answers)` makes
//     the flow adaptive without the component knowing any domain logic.
//   • answers: Record<string,string> lifted to the parent (single
//     source of truth; parent can persist, edit, or replay).
//   • onChange(id, value), onStepShown(id), onComplete().
//
// Accessibility: choice steps render a real radiogroup (fieldset +
// radio inputs, arrow-key native), the step heading receives focus on
// navigation (tabIndex={-1}), progress is announced via aria-live,
// focus rings are visible, and all motion is motion-safe only.

"use client";

import { useEffect, useRef, useState } from "react";
import type { WizardStep } from "@/lib/wizards/consumerRightsWizard";
import { ToolField } from "@/components/tools/ToolField";
import { ToolSelect } from "@/components/tools/ToolSelect";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

export interface DecisionStepperProps {
  steps: WizardStep[];                       // already-visible steps for current answers
  answers: Record<string, string>;
  onChange: (id: string, value: string) => void;
  onStepShown?: (id: string) => void;
  onComplete: () => void;
  completeLabel?: string;
  isAnswered: (step: WizardStep, answers: Record<string, string>) => boolean;
}

export function DecisionStepper({
  steps,
  answers,
  onChange,
  onStepShown,
  onComplete,
  completeLabel = "See my guidance",
  isAnswered,
}: DecisionStepperProps) {
  const [index, setIndex] = useState(0);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const clamped = Math.min(index, steps.length - 1);
  const step = steps[clamped];
  const answered = step ? isAnswered(step, answers) : false;
  const isLast = clamped === steps.length - 1;

  // Adaptive flows can shrink the visible list; keep index in range.
  useEffect(() => {
    if (index > steps.length - 1) setIndex(steps.length - 1);
  }, [steps.length, index]);

  // Move focus to the question heading on step change (screen-reader +
  // keyboard users land in the right place).
  useEffect(() => {
    headingRef.current?.focus();
    if (step) onStepShown?.(step.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clamped, step?.id]);

  if (!step) return null;

  function next() {
    if (!answered) return;
    if (isLast) onComplete();
    else setIndex((i) => Math.min(i + 1, steps.length - 1));
  }
  function back() {
    setIndex((i) => Math.max(0, i - 1));
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      {/* Progress */}
      <div aria-live="polite" className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Question {clamped + 1} of {steps.length}
        </p>
        <p className="text-xs text-muted-foreground">Nothing is saved or sent anywhere.</p>
      </div>
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-valuenow={clamped + 1}
        aria-label={`Wizard progress: question ${clamped + 1} of ${steps.length}`}
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary motion-safe:transition-all motion-safe:duration-300"
          style={{ width: `${((clamped + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="mt-6 font-display text-xl text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-lg"
      >
        {step.title}
      </h3>
      {step.help && <p className="mt-1 text-sm text-muted-foreground">{step.help}</p>}

      <div className="mt-5">
        {step.kind === "choice" && step.options && (
          <fieldset>
            <legend className="sr-only">{step.title}</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {step.options.map((o) => {
                const checked = answers[step.id] === o.value;
                return (
                  <label
                    key={o.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 text-sm transition-colors motion-reduce:transition-none focus-within:ring-2 focus-within:ring-primary/40 ${
                      checked
                        ? "border-primary bg-primary-soft/40 text-foreground"
                        : "border-border bg-background text-foreground hover:border-primary/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`step-${step.id}`}
                      value={o.value}
                      checked={checked}
                      onChange={() => onChange(step.id, o.value)}
                      className="mt-0.5 h-4 w-4 shrink-0 border-border text-primary focus:ring-primary/30"
                    />
                    <span>
                      <span className="font-medium">{o.label}</span>
                      {o.hint && <span className="mt-0.5 block text-xs text-muted-foreground">{o.hint}</span>}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {step.kind === "select" && step.options && (
          <div className="max-w-sm">
            <ToolSelect
              id={`step-${step.id}`}
              label="Your answer"
              value={answers[step.id] ?? ""}
              onChange={(e) => onChange(step.id, e.target.value)}
              options={[{ value: "", label: "Choose…" }, ...step.options]}
            />
          </div>
        )}

        {step.kind === "money" && (
          <div className="max-w-sm">
            <ToolField
              id={`step-${step.id}`}
              label="Your answer"
              value={answers[step.id] ?? ""}
              onChange={(e) => onChange(step.id, e.target.value)}
              prefix={step.prefix}
              placeholder={step.placeholder}
              size="lg"
            />
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={back}
          disabled={clamped === 0}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>
        <button
          type="button"
          onClick={next}
          disabled={!answered}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          {isLast ? (
            <>
              {completeLabel}
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            </>
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

