// src/components/shared/FinancialConsultationModal.tsx
//
// FinancialConsultationModal — the ONE reusable post-report
// conversion modal for the whole platform (ADDITION 2). Every
// calculator, planner, wizard, letter builder, and report reaches
// this same component through ToolReportActions, so there is no
// duplicated modal implementation now or for future tools.
//
// Positioning (ADDITION 4): this is a FREE FINANCIAL CONSULTATION that
// helps visitors understand their personalized report, options, and
// next steps. It is never presented as legal / attorney / tax /
// investment advice, and it carries the standardized IMPORTANT notice
// (ADDITION 5) verbatim.
//
// Lead handling (ADDITION 1) is delegated to the shared
// submitConsultationLead(), which reuses the site's existing
// Web3Forms endpoint and field conventions — no duplicate lead path.
// Auto-captured metadata (ADDITION 3) is attached there and never
// shown to the user.
//
// Accessibility: role="dialog" aria-modal, labelled + described, full
// focus trap (Tab/Shift+Tab cycle, ESC to close, click-outside),
// focus returns to the trigger, mobile bottom-sheet, motion-safe only.

"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { X, Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ORGANIZATION } from "@/lib/organizationConfig";
import { trackToolEvent } from "@/lib/calculators/track";
import {
  submitConsultationLead,
  validateConsultation,
  markConsultationSubmitted,
  type ConsultationMeta,
} from "@/lib/leads/consultationLead";

const PHONE_DISPLAY = "(718) 360-4806";
const PHONE_HREF = `tel:${ORGANIZATION.contactPoint.telephone}`;

const BENEFITS = [
  "Understand what your personalized report means for you",
  "Review the financial options that may fit your situation",
  "Get clear, no-pressure answers to your questions",
  "Learn which solutions may best fit your financial goals",
] as const;

export const CONSULTATION_IMPORTANT_NOTICE =
  "The information provided during your consultation is intended for general educational and informational purposes. It should not be considered legal, tax, accounting, investment or financial advice. Individual circumstances vary, and laws, regulations, lender guidelines and financial programs may change over time.";

export function FinancialConsultationModal({
  open,
  onClose,
  meta,
  returnFocus,
  /** optional short context line (e.g. "Your letter is ready") — never
   *  changes the standardized consultation framing */
  intro,
}: {
  open: boolean;
  onClose: () => void;
  meta: ConsultationMeta;
  returnFocus?: React.RefObject<HTMLElement | null>;
  intro?: string;
}) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFocusRef = useRef<HTMLButtonElement | null>(null);

  // Focus management + trap + ESC.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const restoreTarget = returnFocus?.current ?? previouslyFocused;
    firstFocusRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close("dismiss");
        return;
      }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      restoreTarget?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  function markStarted() {
    if (started) return;
    setStarted(true);
    trackToolEvent("lead_form_started", { tool: meta.toolName, source: "financial_consultation_modal" });
  }

  function close(reason: "dismiss" | "submitted" | "cta") {
    if (reason === "dismiss") {
      trackToolEvent("report_action_modal_dismissed", {
        tool: meta.toolName,
        source: "financial_consultation_modal",
      });
    }
    onClose();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting || submitted) return;
    const err = validateConsultation({ fullName, phone, email });
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setSubmitting(true);
    const res = await submitConsultationLead({ fullName, phone, email }, meta);
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error ?? "Something went wrong — please try again, or call us directly.");
      return;
    }
    markConsultationSubmitted();
    setSubmitted(true);
    trackToolEvent("report_action_modal_accepted", { tool: meta.toolName, source: "financial_consultation_modal" });
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-foreground/50 p-0 motion-safe:animate-in sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close("dismiss");
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fc-title"
        aria-describedby="fc-desc"
        className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-y-auto rounded-t-3xl bg-card p-6 shadow-xl motion-safe:transition-transform sm:rounded-3xl sm:p-7"
      >
        <button
          ref={firstFocusRef}
          type="button"
          onClick={() => close("dismiss")}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-border bg-background text-muted-foreground transition hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {!submitted ? (
          <>
            {intro && (
              <p className="pr-8 text-xs font-semibold uppercase tracking-wider text-primary">{intro}</p>
            )}
            <p className="pr-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Need help understanding your results?
            </p>
            <h2 id="fc-title" className="mt-1 pr-8 font-display text-2xl text-foreground">
              Schedule your free financial consultation
            </h2>
            <p id="fc-desc" className="mt-2 text-sm text-muted-foreground">
              A WeHelpFinance specialist can walk you through your personalized report, the
              financial options that may fit your situation, and possible next steps. Free,
              confidential, and no obligation.
            </p>

            <ul className="mt-4 space-y-2">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm text-foreground/90">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>

            <form onSubmit={onSubmit} className="mt-5 space-y-3">
              <div>
                <label htmlFor="fc-name" className="text-sm font-medium text-foreground">Full name</label>
                <input
                  id="fc-name"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onFocus={markStarted}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Your name"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="fc-phone" className="text-sm font-medium text-foreground">Phone</label>
                  <input
                    id="fc-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onFocus={markStarted}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="(555) 201-4432"
                  />
                </div>
                <div>
                  <label htmlFor="fc-email" className="text-sm font-medium text-foreground">Email</label>
                  <input
                    id="fc-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onFocus={markStarted}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {error && (
                <p role="alert" className="text-sm text-destructive">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-cta flex w-full items-center justify-center gap-2 !min-h-[48px] text-sm disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Request My Free Consultation"}
                {!submitting && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
              </button>
            </form>

            {/* Secondary + tertiary actions */}
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <a
                href={PHONE_HREF}
                onClick={() => trackToolEvent("phone_clicked", { tool: meta.toolName, source: "financial_consultation_modal" })}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full border border-primary bg-background px-4 text-sm font-semibold text-primary transition hover:bg-primary-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call {PHONE_DISPLAY}
              </a>
              <Link
                href="/financial-tools"
                onClick={() => { trackToolEvent("cta_clicked", { tool: meta.toolName, source: "financial_consultation_modal", target: "/financial-tools" }); close("cta"); }}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full border border-border bg-background px-4 text-sm font-semibold text-foreground transition hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Continue Exploring Tools
              </Link>
            </div>

            {/* ADDITION 5 — standardized important notice (verbatim) */}
            <div className="mt-5 rounded-2xl border border-border bg-muted/40 p-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Important</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {CONSULTATION_IMPORTANT_NOTICE}
              </p>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              We use the details you provide only to contact you about your consultation. We
              never sell your information. By requesting a consultation you agree to be
              contacted by phone or email.
            </p>
          </>
        ) : (
          <div className="py-4 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/15">
              <CheckCircle2 className="h-7 w-7 text-success" aria-hidden="true" />
            </span>
            <h2 id="fc-title" className="mt-4 font-display text-2xl text-foreground">Thank you — you&rsquo;re all set</h2>
            <p id="fc-desc" className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              A WeHelpFinance specialist will reach out shortly to walk through your report
              and options. Prefer to talk now? Call {PHONE_DISPLAY}.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <a
                href={PHONE_HREF}
                onClick={() => trackToolEvent("phone_clicked", { tool: meta.toolName, source: "financial_consultation_modal" })}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-primary bg-background px-5 text-sm font-semibold text-primary transition hover:bg-primary-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call {PHONE_DISPLAY}
              </a>
              <button
                type="button"
                onClick={() => close("submitted")}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Done
              </button>
            </div>
            <div className="mt-5 rounded-2xl border border-border bg-muted/40 p-3.5 text-left">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Important</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{CONSULTATION_IMPORTANT_NOTICE}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
