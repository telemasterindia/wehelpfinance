// src/components/tools/PostReportModal.tsx
//
// Post-download / post-print conversion modal (Sprint 5 platform
// addition). Shown by ToolReportActions ONLY AFTER a report action
// has been initiated — never before, never blocking the report.
//
// Behaviour rules (per spec):
//   • Easy to close: X, "Not Now", Escape, and backdrop all dismiss.
//   • Dismissal is remembered for the browsing session (guarded
//     sessionStorage) so the modal never nags twice in one session.
//   • No fear, no countdowns, no fake urgency — benefit copy only.
//   • Accepting routes to the EXISTING /get-help lead flow. No
//     calculator data is attached or transmitted; the trust line
//     says exactly that.
//
// Accessibility: role="dialog" + aria-modal, labelled by its title,
// initial focus moved into the dialog, Escape handled, focus returns
// to the previously-focused element on close, motion-safe animation
// only.

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { trackToolEvent } from "@/lib/calculators/track";

export const REPORT_MODAL_SESSION_KEY = "whf_report_modal_dismissed";

export function wasReportModalDismissed(): boolean {
  try {
    return sessionStorage.getItem(REPORT_MODAL_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function rememberReportModalDismissed(): void {
  try {
    sessionStorage.setItem(REPORT_MODAL_SESSION_KEY, "1");
  } catch {
    // Private-mode storage failures must never break the page.
  }
}

export function PostReportModal({
  open,
  tool,
  onClose,
  returnFocus,
}: {
  open: boolean;
  /** analytics slug only, e.g. "personal_loan" */
  tool: string;
  onClose: () => void;
  /** element to return focus to after closing (the triggering button) */
  returnFocus?: React.RefObject<HTMLElement | null>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  // Focus management + Escape.
  useEffect(() => {
    if (!open) return;
    restoreRef.current = (document.activeElement as HTMLElement) ?? null;
    panelRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        dismiss();
        return;
      }
      if (e.key !== "Tab") return;
      // Focus trap: cycle Tab / Shift+Tab within the dialog (WCAG AA).
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || active === panel) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      // Intentional latest-read: the trigger button lives outside this
      // modal and may change between opens (Download vs Print) — we want
      // whichever button actually started this session's action.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const target = returnFocus?.current ?? restoreRef.current;
      target?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  function dismiss() {
    trackToolEvent("report_action_modal_dismissed", { tool });
    rememberReportModalDismissed();
    onClose();
  }

  function accept() {
    trackToolEvent("report_action_modal_accepted", { tool });
    trackToolEvent("lead_form_started", { source: `${tool}_report_modal` });
    rememberReportModalDismissed();
    onClose();
    // Navigation happens via the <Link> itself.
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center print:hidden"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div
        className="absolute inset-0 bg-foreground/40 motion-safe:animate-in motion-safe:fade-in"
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-report-modal-title"
        tabIndex={-1}
        className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-xl focus:outline-none motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <p
          id="post-report-modal-title"
          className="pr-8 font-display text-lg text-foreground"
        >
          Your report gives you the numbers. A specialist can help you
          understand the options.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Every financial situation has details a calculator cannot fully
          evaluate. If you would like, share your contact information and a
          specialist can review your results, explain the options that may be
          worth exploring, and answer your questions.
        </p>
        <p className="mt-2 text-sm font-medium text-foreground">
          Free, confidential, and no obligation.
        </p>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <Link
            href="/get-help"
            onClick={accept}
            className="btn-cta flex-1 !min-h-[48px] text-sm"
          >
            Review My Options
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            Not Now
          </button>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Your calculator information is not submitted automatically. If you
          choose to continue, you can decide what information you would like to
          share.
        </p>
      </div>
    </div>
  );
}
