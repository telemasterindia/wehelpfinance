"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Lock, Phone } from "lucide-react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type Category = "debt-relief" | "personal-loan" | "tax-relief";

export type LeadData = {
  category?: Category;
  debtAmount?: string;
  loanAmount?: string;
  taxDebt?: string;
  creditScore?: string;
  employment?: string;
  irsNotice?: string;
  state?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  notes?: string;
  inCollections?: string;
  utm?: Record<string, string>;
};

function stripPhone(raw: string): string {
  return raw.replace(/\D/g, "");
}

function validatePhone(raw: string): string | null {
  const digits = stripPhone(raw);
  if (digits.length !== 10) return "Please enter a valid 10-digit phone number.";
  if (/^(\d)\1{9}$/.test(digits)) return "Please enter a valid phone number.";
  if (digits === "1234567890" || digits === "0123456789") return "Please enter a valid phone number.";
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(digits)) return "Please enter a valid U.S. phone number.";
  return null;
}

function validateEmail(raw: string): string | null {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!raw.trim() || !re.test(raw.trim())) return "Please enter a valid email address.";
  return null;
}

const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

const CAT_LABEL: Record<Category, string> = {
  "debt-relief": "Debt Relief",
  "personal-loan": "Personal Loan",
  "tax-relief": "Tax Relief",
};

const W3F_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "19b473ef-4a3d-4d3e-807d-82ed6bb3be99";
const W3F_URL = "https://api.web3forms.com/submit";
const NOTES_MAX = 500;

function getUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"].forEach((k) => {
    const v = p.get(k);
    if (v) out[k] = v;
  });
  try {
    const stored = sessionStorage.getItem("whf_utm");
    if (stored) Object.assign(out, JSON.parse(stored) as Record<string, string>);
  } catch {
    // Ignore unavailable storage or malformed campaign data.
  }
  return out;
}

function getLandingPage(): string {
  if (typeof window === "undefined") return "";
  try {
    return sessionStorage.getItem("whf_landing") ?? window.location.href;
  } catch {
    // Fall back to the current URL when session storage is blocked.
  }
  return window.location.href;
}

function track(event: string, params?: Record<string, string | undefined>) {
  try {
    window.gtag?.("event", event, { event_category: "Lead Form", ...params });
  } catch {
    // Analytics errors should never block the form.
  }
}

async function sendPartialLead(data: LeadData): Promise<void> {
  try {
    sessionStorage.setItem("whf:lead:partial", JSON.stringify(data));
  } catch {
    // Keep submitting even when local storage is unavailable.
  }
  const utm = data.utm ?? {};
  try {
    await fetch(W3F_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: W3F_KEY,
        subject: `⚡ Partial Lead — Phone Captured (${CAT_LABEL[data.category ?? "debt-relief"]})`,
        from_name: "WeHelpFinance Partial Lead",
        phone: data.phone ?? "",
        category: CAT_LABEL[data.category ?? "debt-relief"] ?? "",
        state: data.state ?? "",
        page_url: getLandingPage(),
        timestamp: new Date().toISOString(),
        utm_source: utm.utm_source ?? "",
        utm_medium: utm.utm_medium ?? "",
        utm_campaign: utm.utm_campaign ?? "",
        gclid: utm.gclid ?? "",
        fbclid: utm.fbclid ?? "",
        botcheck: "",
      }),
    });
  } catch {
    // Partial capture is best-effort.
  }
}

async function sendFinalLead(data: LeadData): Promise<{ ok: boolean; error?: string }> {
  try {
    sessionStorage.setItem("whf:lead:final", JSON.stringify(data));
  } catch {
    // Keep the final submission path available in privacy-restricted browsers.
  }
  const utm = data.utm ?? {};
  let qualifier = "";
  if (data.category === "debt-relief") qualifier = data.debtAmount ?? "";
  if (data.category === "personal-loan") qualifier = data.loanAmount ?? "";
  if (data.category === "tax-relief") qualifier = data.taxDebt ?? "";
  try {
    const res = await fetch(W3F_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: W3F_KEY,
        subject: `🎯 New ${CAT_LABEL[data.category ?? "debt-relief"]} Lead — ${data.state ?? ""} — ${qualifier}`,
        from_name: "WeHelpFinance Lead",
        first_name: data.firstName ?? "",
        last_name: data.lastName ?? "",
        phone: data.phone ?? "",
        email: data.email ?? "",
        category: CAT_LABEL[data.category ?? "debt-relief"] ?? "",
        qualifier,
        debt_amount: data.debtAmount ?? "",
        loan_amount: data.loanAmount ?? "",
        tax_debt: data.taxDebt ?? "",
        credit_score: data.creditScore ?? "",
        employment: data.employment ?? "",
        irs_notice: data.irsNotice ?? "",
        state: data.state ?? "",
        in_collections: data.inCollections ?? "",
        notes: data.notes ?? "",
        utm_source: utm.utm_source ?? "",
        utm_medium: utm.utm_medium ?? "",
        utm_campaign: utm.utm_campaign ?? "",
        utm_term: utm.utm_term ?? "",
        utm_content: utm.utm_content ?? "",
        gclid: utm.gclid ?? "",
        fbclid: utm.fbclid ?? "",
        landing_page: getLandingPage(),
        timestamp: new Date().toISOString(),
        botcheck: "",
      }),
    });
    const json = await res.json() as { success: boolean; message?: string };
    if (!res.ok || !json.success) return { ok: false, error: json.message ?? "Submission failed" };
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error — please try again." };
  }
}

export function LeadForm({ defaultCategory }: { defaultCategory?: Category }) {
  const [step, setStep] = useState(defaultCategory ? 2 : 1);
  const [data, setData] = useState<LeadData>({ category: defaultCategory, utm: {} });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const partialSentRef = useRef(false);

  useEffect(() => {
    const utm = getUtm();
    setData((d) => ({ ...d, utm }));
    try {
      if (!sessionStorage.getItem("whf_landing")) {
        sessionStorage.setItem("whf_landing", window.location.href);
      }
      if (Object.keys(utm).length) {
        sessionStorage.setItem("whf_utm", JSON.stringify(utm));
      }
    } catch {
      // Ignore unavailable storage.
    }
    track("form_start");
  }, []);

  const update = (patch: Partial<LeadData>) => setData((d) => ({ ...d, ...patch }));

  function pickCategory(c: Category) {
    update({ category: c });
    setStep(2);
    track("step_1_complete", { event_label: c });
  }

  function next2() {
    setStep(3);
    track("step_2_complete", { event_label: data.category });
  }

  async function onPhoneBlur() {
    const err = validatePhone(data.phone ?? "");
    setPhoneError(err);
    if (!err && !partialSentRef.current) {
      partialSentRef.current = true;
      track("phone_entered", { event_label: data.category });
      await sendPartialLead({ ...data });
    }
  }

  function onEmailBlur() {
    if (data.email) {
      setEmailError(validateEmail(data.email));
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitted || submitting) return;

    const pErr = validatePhone(data.phone ?? "");
    const eErr = validateEmail(data.email ?? "");
    setPhoneError(pErr);
    setEmailError(eErr);
    if (pErr || eErr) return;

    setSubmitError(null);
    setSubmitting(true);
    const result = await sendFinalLead({ ...data });
    if (!result.ok) {
      setSubmitting(false);
      setSubmitError(result.error ?? "Something went wrong. Please try again or call us.");
      return;
    }
    setSubmitted(true);
    track("lead_submitted", { event_label: data.category });
    window.location.href = "/thank-you";
  }

  return (
    <div className="surface-card">
      <ProgressBar step={step} />

      {step === 1 && (
        <div>
          <h3 className="text-xl">What do you need help with?</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick the area where you'd like support. It's free, confidential, and no obligation.
          </p>
          <div className="mt-5 grid gap-3">
            {(["debt-relief", "personal-loan", "tax-relief"] as Category[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => pickCategory(c)}
                className="flex min-h-14 items-center justify-between rounded-2xl border border-border bg-background px-5 text-left text-base font-medium transition hover:border-primary hover:bg-primary-soft/40"
              >
                {CAT_LABEL[c]}
                <ArrowRight className="h-5 w-5 text-primary" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && data.category && (
        <form onSubmit={(e) => { e.preventDefault(); next2(); }} className="space-y-4">
          <StepHeader title={`A few quick details (${CAT_LABEL[data.category]})`} onBack={() => setStep(1)} />

          {data.category === "debt-relief" && (
            <>
              <Field label="Total unsecured debt">
                <Select
                  value={data.debtAmount}
                  onChange={(v) => update({ debtAmount: v })}
                  options={["Under $7,500", "$7,500 – $10,000", "$10,000 – $25,000", "$25,000 – $50,000", "$50,000 – $100,000", "$100,000+"]}
                />
                {data.debtAmount === "Under $7,500" && (
                  <p className="mt-2 rounded-lg bg-primary-soft/60 p-3 text-xs text-foreground">
                    Debt settlement programs typically require $7,500 or more. You may be a better fit for a{" "}
                    <Link href="/personal-loans" className="font-semibold text-primary underline">Personal Loan</Link>.
                  </p>
                )}
              </Field>
              <Field label="Employment status">
                <Select
                  value={data.employment}
                  onChange={(v) => update({ employment: v })}
                  options={["Employed full-time", "Employed part-time", "Self-employed", "Unemployed", "Retired"]}
                />
              </Field>
            </>
          )}

          {data.category === "personal-loan" && (
            <>
              <Field label="Loan amount needed">
                <Select
                  value={data.loanAmount}
                  onChange={(v) => update({ loanAmount: v })}
                  options={["Under $5,000", "$5,000 – $15,000", "$15,000 – $35,000", "$35,000 – $50,000", "$50,000+"]}
                />
              </Field>
              <Field label="Credit score range">
                <Select
                  value={data.creditScore}
                  onChange={(v) => update({ creditScore: v })}
                  options={["Excellent (720+)", "Good (660–719)", "Fair (600–659)", "Poor (below 600)", "Not sure"]}
                />
              </Field>
            </>
          )}

          {data.category === "tax-relief" && (
            <>
              <Field label="Estimated tax debt">
                <Select
                  value={data.taxDebt}
                  onChange={(v) => update({ taxDebt: v })}
                  options={["Under $10,000", "$10,000 – $25,000", "$25,000 – $50,000", "$50,000 – $100,000", "$100,000+"]}
                />
              </Field>
              <Field label="Have you received an IRS notice?">
                <Select value={data.irsNotice} onChange={(v) => update({ irsNotice: v })} options={["Yes", "No", "Not sure"]} />
              </Field>
              <Field label="Current employment status">
                <Select
                  value={data.employment}
                  onChange={(v) => update({ employment: v })}
                  options={["Employed full-time", "Employed part-time", "Self-employed", "1099", "Unemployed", "Retired"]}
                />
              </Field>
            </>
          )}

          <Field label="State">
            <Select value={data.state} onChange={(v) => update({ state: v })} options={STATES} />
          </Field>

          <button type="submit" className="btn-cta w-full">
            Continue <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <StepHeader title="Where should our specialist reach you?" onBack={() => setStep(2)} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name">
              <Input value={data.firstName} onChange={(v) => update({ firstName: v })} autoComplete="given-name" required />
            </Field>
            <Field label="Last name">
              <Input value={data.lastName} onChange={(v) => update({ lastName: v })} autoComplete="family-name" required />
            </Field>
          </div>

          <Field label="Email" error={emailError}>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={data.email ?? ""}
              onChange={(e) => { update({ email: e.target.value }); setEmailError(null); }}
              onBlur={onEmailBlur}
              className={`h-12 w-full rounded-xl border bg-background px-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                emailError ? "border-destructive focus:border-destructive" : "border-input focus:border-primary"
              }`}
            />
          </Field>

          <Field label="Phone number" hint="A specialist will call you — usually within 1 business day." error={phoneError}>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" aria-hidden="true" />
              <input
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                placeholder="(555) 123-4567"
                value={data.phone ?? ""}
                onChange={(e) => { update({ phone: e.target.value }); setPhoneError(null); }}
                onBlur={onPhoneBlur}
                className={`h-14 w-full rounded-2xl border-2 bg-background pl-12 pr-4 text-lg font-semibold tracking-wide focus:outline-none ${
                  phoneError ? "border-destructive focus:border-destructive" : "border-primary/40 focus:border-primary"
                }`}
              />
            </div>
          </Field>

          <Field label="Are any of your accounts currently in collections?">
            <div className="flex gap-3">
              {["Yes", "No", "Not Sure"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => update({ inCollections: opt })}
                  className={`flex-1 rounded-xl border py-3 text-sm font-medium transition ${
                    data.inCollections === opt
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border bg-background text-foreground hover:border-primary/50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Tell us more about your situation (optional)">
            <textarea
              maxLength={NOTES_MAX}
              rows={3}
              placeholder="E.g. I have 3 credit cards maxed out and a medical bill in collections..."
              value={data.notes ?? ""}
              onChange={(e) => update({ notes: e.target.value })}
              className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <span className="mt-1 block text-right text-xs text-muted-foreground">
              {(data.notes ?? "").length}/{NOTES_MAX}
            </span>
          </Field>

          <input type="text" name="botcheck" defaultValue="" style={{ display: "none" }} tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <input type="hidden" name="utm_source" value={data.utm?.utm_source ?? ""} readOnly />
          <input type="hidden" name="utm_medium" value={data.utm?.utm_medium ?? ""} readOnly />
          <input type="hidden" name="utm_campaign" value={data.utm?.utm_campaign ?? ""} readOnly />
          <input type="hidden" name="utm_term" value={data.utm?.utm_term ?? ""} readOnly />
          <input type="hidden" name="utm_content" value={data.utm?.utm_content ?? ""} readOnly />
          <input type="hidden" name="gclid" value={data.utm?.gclid ?? ""} readOnly />
          <input type="hidden" name="fbclid" value={data.utm?.fbclid ?? ""} readOnly />

          {submitError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {submitError}{" "}
              <a href="tel:+17183604806" className="font-semibold underline">
                Call (718) 360-4806
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || submitted}
            className="btn-cta w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Submitting...
              </span>
            ) : (
              <>Get My Free Consultation <ArrowRight className="h-4 w-4" aria-hidden="true" /></>
            )}
          </button>

          <p className="text-xs leading-relaxed text-muted-foreground">
            By submitting this form, you agree to be contacted by WeHelpFinance and its specialist
            partners by phone, text, or email regarding your inquiry. Message and data rates may
            apply. You may opt out at any time. View our{" "}
            <Link href="/privacy" className="text-primary underline">Privacy Policy</Link>.
          </p>

          <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            Your information is kept private and confidential.
          </p>
        </form>
      )}
    </div>
  );
}

function StepHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <h3 className="text-xl">{title}</h3>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
      </button>
    </div>
  );
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-5 flex items-center gap-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`}
        />
      ))}
      <span className="ml-2 text-xs font-medium text-muted-foreground">Step {step} of 3</span>
    </div>
  );
}

function Field({
  label,
  children,
  hint,
  error,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  error?: string | null;
}) {
  return (
    <div className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint && !error && (
        <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>
      )}
      {error && (
        <span className="mt-1 block text-xs font-medium text-destructive" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

function Input({
  value,
  onChange,
  type = "text",
  required,
  autoComplete,
}: {
  value?: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <input
      type={type}
      required={required}
      autoComplete={autoComplete}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value?: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      required
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 w-full rounded-xl border border-input bg-background px-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
    >
      <option value="" disabled>Select...</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
