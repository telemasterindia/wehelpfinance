// src/components/tools/ToolReportActions.tsx
//
// One-line report integration for every calculator (Sprint 5
// platform addition). A calculator builds a ToolReportData object
// from results it already displays and renders:
//
//   <ToolReportActions data={reportData} />
//
// This single component provides:
//   • "Download Report" + "Print Report" buttons (visible only when
//     the parent renders them — i.e. after valid results exist)
//   • the print-only branded report document (ToolReportLayout)
//   • the post-action conversion modal, shown only AFTER the print /
//     save dialog closes, at most once per session
//
// Download vs Print: both use the browser's native print pipeline —
// "Download" surfaces the OS "Save as PDF" destination, which is the
// dependency-free path the spec prefers. The button hint tells the
// user exactly what to pick. The two buttons emit distinct analytics
// events so we can see which mental model users reach for.
//
// Modal timing: we set an "initiated" flag, call window.print()
// (blocking in most browsers), and open the modal on `afterprint` —
// with a window-focus fallback for browsers that fire it unreliably
// (older iOS Safari). The modal therefore appears only after the
// requested action has begun/completed and never blocks it.

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Download, Printer } from "lucide-react";
import type { ToolReportData } from "@/lib/calculators/report";
import { trackToolEvent } from "@/lib/calculators/track";
import { ToolReportLayout } from "@/components/tools/ToolReport";
import {
  PostReportModal,
  wasReportModalDismissed,
} from "@/components/tools/PostReportModal";

export function ToolReportActions({
  data,
  children,
}: {
  data: ToolReportData;
  /** optional print-safe visual summary forwarded into the report */
  children?: ReactNode;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const initiatedRef = useRef(false);
  // The button that started the last report action — focus returns
  // here after the post-action modal closes (WCAG AA focus order).
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function maybeShowModal() {
      if (!initiatedRef.current) return;
      initiatedRef.current = false;
      if (wasReportModalDismissed()) return;
      trackToolEvent("report_action_modal_viewed", { tool: data.toolSlug });
      setModalOpen(true);
    }
    window.addEventListener("afterprint", maybeShowModal);
    window.addEventListener("focus", maybeShowModal);
    return () => {
      window.removeEventListener("afterprint", maybeShowModal);
      window.removeEventListener("focus", maybeShowModal);
    };
  }, [data.toolSlug]);

  function runReportAction(
    kind: "download" | "print",
    trigger: HTMLElement | null,
  ) {
    triggerRef.current = trigger;
    trackToolEvent(
      kind === "download" ? "report_download_clicked" : "report_print_clicked",
      { tool: data.toolSlug },
    );
    initiatedRef.current = true;
    // Let the click's paint settle so the dialog opens over a stable
    // frame (also avoids double-firing focus fallback on some mobiles).
    window.setTimeout(() => window.print(), 30);
  }

  return (
    <div className="print:hidden">
      <div className="rounded-3xl border border-border bg-card p-5">
        <p className="font-display text-lg text-foreground">
          Save these results
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Get a clean, branded summary of your inputs, results, and the options
          worth exploring — nothing is uploaded or stored.
        </p>
        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={(e) => runReportAction("download", e.currentTarget)}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full border border-primary bg-background px-5 text-sm font-semibold text-primary transition hover:bg-primary-soft focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download Report
          </button>
          <button
            type="button"
            onClick={(e) => runReportAction("print", e.currentTarget)}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            Print Report
          </button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Downloading opens your device&apos;s print dialog — set the printer /
          destination to{" "}
          <span className="font-medium text-foreground">
            &ldquo;Save as PDF&rdquo;
          </span>{" "}
          and save. Works the same on desktop and mobile. (We evaluated
          direct-PDF libraries; all would add 100&nbsp;KB+ of JavaScript to
          every calculator, so the platform keeps the dependency-free native
          path.)
        </p>
      </div>

      <ToolReportLayout data={data}>{children}</ToolReportLayout>

      <PostReportModal
        open={modalOpen}
        tool={data.toolSlug}
        onClose={() => setModalOpen(false)}
        returnFocus={triggerRef}
      />
    </div>
  );
}
