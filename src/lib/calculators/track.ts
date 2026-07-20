// src/lib/calculators/track.ts
//
// Tiny GA4 event helper shared by every Financial Tools module.
// GA4 is loaded globally by <Analytics /> (src/components/Analytics.tsx),
// which defines window.gtag. This helper is safe on the server, safe
// before gtag loads, and never throws.

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
  }
}

export type ToolEvent =
  | "calculator_viewed"
  | "calculation_completed"
  | "strategy_switched"
  | "mode_switched"
  | "tool_option_changed"
  | "cta_clicked"
  | "phone_clicked"
  | "lead_form_started"
  | "report_download_clicked"
  | "report_print_clicked"
  | "report_action_modal_viewed"
  | "report_action_modal_accepted"
  | "report_action_modal_dismissed";

export function trackToolEvent(
  event: ToolEvent,
  params: Record<string, string | number | boolean> = {},
): void {
  try {
    if (typeof window === "undefined" || typeof window.gtag !== "function")
      return;
    window.gtag("event", event, {
      event_category: "financial_tools",
      ...params,
    });
  } catch {
    // Analytics must never break the tool.
  }
}
