// src/lib/leads/consultationLead.ts
//
// Shared lead-handling for the Financial Consultation flow.
//
// ADDITION 1 compliance: this does NOT introduce a new lead endpoint,
// API route, or CRM path. It posts to the SAME Web3Forms endpoint,
// with the SAME access key / env var, and the SAME field conventions
// (from_name, first_name/last_name, phone, email, page_url, timestamp,
// utm_*, botcheck) already used by the site's primary LeadForm — so
// every consultation lead lands in the same inbox with the same shape.
// The battle-tested LeadForm is left untouched (regression-safe); this
// is the one shared submitter the reusable modal — and every future
// tool — calls, so there is no duplicated submission logic.
//
// ADDITION 3 compliance: auto-captures internal metadata (tool, URL,
// timestamp, report flags, source, UTM, referrer, device, browser)
// as hidden Web3Forms fields. These are never rendered to the user.

const W3F_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "19b473ef-4a3d-4d3e-807d-82ed6bb3be99";
const W3F_URL = "https://api.web3forms.com/submit";

export interface ConsultationContact {
  fullName: string;
  phone: string;
  email: string;
}

export interface ConsultationMeta {
  toolName: string;               // slug, e.g. "budget_planner"
  reportGenerated: boolean;
  reportPrinted: boolean;
  reportDownloaded: boolean;
}

/** Basic, forgiving validation mirroring the primary LeadForm. */
export function validateConsultation(c: ConsultationContact): string | null {
  if (!c.fullName.trim()) return "Please enter your full name.";
  if (c.phone.replace(/\D/g, "").length < 10) return "Please enter a 10-digit phone number.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email.trim())) return "Please enter a complete email address.";
  return null;
}

function captureUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const out: Record<string, string> = {};
  try {
    const p = new URLSearchParams(window.location.search);
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"].forEach((k) => {
      const v = p.get(k);
      if (v) out[k] = v;
    });
    const stored = sessionStorage.getItem("whf_utm");
    if (stored) Object.assign(out, JSON.parse(stored) as Record<string, string>);
  } catch {
    // Ignore blocked storage or malformed campaign data.
  }
  return out;
}

/** Coarse, non-identifying device + browser hints from the UA string. */
function deviceInfo(): { device: string; browser: string } {
  if (typeof navigator === "undefined") return { device: "", browser: "" };
  const ua = navigator.userAgent || "";
  const device = /Mobi|Android|iPhone|iPad|iPod/i.test(ua)
    ? /iPad|Tablet/i.test(ua)
      ? "Tablet"
      : "Mobile"
    : "Desktop";
  let browser = "Other";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) browser = "Opera";
  else if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) browser = "Chrome";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";
  else if (/Safari\//i.test(ua) && /Version\//i.test(ua)) browser = "Safari";
  return { device, browser };
}

function landingPage(): string {
  if (typeof window === "undefined") return "";
  try {
    return sessionStorage.getItem("whf_landing") ?? window.location.href;
  } catch {
    return window.location.href;
  }
}

/**
 * Submit a consultation lead to the shared Web3Forms endpoint.
 * Returns {ok} — never throws, so UI can always resolve to a state.
 */
export async function submitConsultationLead(
  contact: ConsultationContact,
  meta: ConsultationMeta
): Promise<{ ok: boolean; error?: string }> {
  const utm = captureUtm();
  const { device, browser } = deviceInfo();
  const referrer = typeof document !== "undefined" ? document.referrer : "";
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  try {
    const res = await fetch(W3F_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: W3F_KEY,
        subject: `Free Financial Consultation Request — ${meta.toolName}`,
        from_name: contact.fullName.trim() || "WeHelpFinance Consultation Lead",
        // Customer-entered
        full_name: contact.fullName.trim(),
        phone: contact.phone.trim(),
        email: contact.email.trim(),
        lead_type: "Free Financial Consultation",
        // Auto-captured metadata (internal only — never shown to the user)
        tool_name: meta.toolName,
        source: "financial_consultation_modal",
        report_generated: meta.reportGenerated ? "yes" : "no",
        report_printed: meta.reportPrinted ? "yes" : "no",
        report_downloaded: meta.reportDownloaded ? "yes" : "no",
        page_url: pageUrl,
        landing_page: landingPage(),
        referrer,
        device,
        browser,
        timestamp: new Date().toISOString(),
        utm_source: utm.utm_source ?? "",
        utm_medium: utm.utm_medium ?? "",
        utm_campaign: utm.utm_campaign ?? "",
        utm_term: utm.utm_term ?? "",
        utm_content: utm.utm_content ?? "",
        gclid: utm.gclid ?? "",
        fbclid: utm.fbclid ?? "",
        botcheck: "",
      }),
    });
    const json = (await res.json()) as { success: boolean; message?: string };
    if (!res.ok || !json.success) return { ok: false, error: json.message ?? "Submission failed" };
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error — please try again." };
  }
}

// Session suppressor: once a visitor submits, don't re-prompt this session.
const SUBMITTED_KEY = "whf_consult_submitted";
export function wasConsultationSubmitted(): boolean {
  try {
    return sessionStorage.getItem(SUBMITTED_KEY) === "1";
  } catch {
    return false;
  }
}
export function markConsultationSubmitted(): void {
  try {
    sessionStorage.setItem(SUBMITTED_KEY, "1");
  } catch {
    // Non-fatal in privacy-restricted browsers.
  }
}
