import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ArrowLeft, Phone, Lock } from "lucide-react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

type Category = "debt-relief" | "personal-loan" | "tax-relief";

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
  utm?: Record<string, string>;
};

const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

// Architecture hooks — wired so partial leads / CRM can drop in later.
function getUtm(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid"].forEach((k) => {
    const v = p.get(k); if (v) out[k] = v;
  });
  return out;
}

async function savePartialLead(data: LeadData) {
  // Placeholder for partial lead capture (e.g. after phone entered). Wire to CRM later.
  if (typeof window !== "undefined") {
    try { sessionStorage.setItem("whf:lead:partial", JSON.stringify(data)); } catch {}
  }
}

async function submitLead(data: LeadData) {
  // Placeholder for final submission. Wire to CRM/edge endpoint later.
  if (typeof window !== "undefined") {
    try { sessionStorage.setItem("whf:lead:final", JSON.stringify(data)); } catch {}
  }
}

const CAT_LABEL: Record<Category, string> = {
  "debt-relief": "Debt Relief",
  "personal-loan": "Personal Loan",
  "tax-relief": "Tax Relief",
};

export function LeadForm({ defaultCategory }: { defaultCategory?: Category }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(defaultCategory ? 2 : 1);
  const [data, setData] = useState<LeadData>({ category: defaultCategory, utm: getUtm() });
  const [submitting, setSubmitting] = useState(false);

  // Hydrate UTM from sessionStorage (whf_utm) if present
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = sessionStorage.getItem("whf_utm");
      if (stored) {
        const utm = { ...(JSON.parse(stored) as Record<string, string>), ...(data.utm || {}) };
        setData((d) => ({ ...d, utm }));
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (patch: Partial<LeadData>) => setData((d) => ({ ...d, ...patch }));

  function pickCategory(c: Category) {
    update({ category: c });
    setStep(2);
  }

  function next2() {
    savePartialLead(data);
    setStep(3);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await submitLead(data);
    try {
      window.gtag?.("event", "generate_lead", {
        event_category: "Lead Form",
        event_label: data.category,
      });
    } catch {}
    navigate({ to: "/thank-you" });
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
            {(["debt-relief","personal-loan","tax-relief"] as Category[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => pickCategory(c)}
                className="flex min-h-14 items-center justify-between rounded-2xl border border-border bg-background px-5 text-left text-base font-medium transition hover:border-primary hover:bg-primary-soft/40"
              >
                {CAT_LABEL[c]}
                <ArrowRight className="h-5 w-5 text-primary" />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && data.category && (
        <form
          onSubmit={(e) => { e.preventDefault(); next2(); }}
          className="space-y-4"
        >
          <StepHeader title={`A few quick details (${CAT_LABEL[data.category]})`} onBack={() => setStep(1)} />

          {data.category === "debt-relief" && (
            <>
              <Field label="Total unsecured debt">
                <Select value={data.debtAmount} onChange={(v) => update({ debtAmount: v })}
                  options={["Under $7,500","$7,500 – $10,000","$10,000 – $25,000","$25,000 – $50,000","$50,000 – $100,000","$100,000+"]} />
                {data.debtAmount === "Under $7,500" && (
                  <p className="mt-2 rounded-lg bg-primary-soft/60 p-3 text-xs text-foreground">
                    Debt settlement programs typically require $7,500 or more. You may be a better
                    fit for a{" "}
                    <Link to="/personal-loans" className="font-semibold text-primary underline">
                      Personal Loan
                    </Link>
                    .
                  </p>
                )}
              </Field>
              <Field label="Employment status">
                <Select value={data.employment} onChange={(v) => update({ employment: v })}
                  options={["Employed full-time","Employed part-time","Self-employed","Unemployed","Retired"]} />
              </Field>
            </>
          )}

          {data.category === "personal-loan" && (
            <>
              <Field label="Loan amount needed">
                <Select value={data.loanAmount} onChange={(v) => update({ loanAmount: v })}
                  options={["Under $5,000","$5,000 – $15,000","$15,000 – $35,000","$35,000 – $50,000","$50,000+"]} />
              </Field>
              <Field label="Credit score range">
                <Select value={data.creditScore} onChange={(v) => update({ creditScore: v })}
                  options={["Excellent (720+)","Good (660–719)","Fair (600–659)","Poor (below 600)","Not sure"]} />
              </Field>
            </>
          )}

          {data.category === "tax-relief" && (
            <>
              <Field label="Estimated tax debt">
                <Select value={data.taxDebt} onChange={(v) => update({ taxDebt: v })}
                  options={["Under $10,000","$10,000 – $25,000","$25,000 – $50,000","$50,000 – $100,000","$100,000+"]} />
              </Field>
              <Field label="Have you received an IRS notice?">
                <Select value={data.irsNotice} onChange={(v) => update({ irsNotice: v })}
                  options={["Yes","No","Not sure"]} />
              </Field>
              <Field label="Current employment status">
                <Select value={data.employment} onChange={(v) => update({ employment: v })}
                  options={["Employed full-time","Employed part-time","Self-employed","1099","Unemployed","Retired"]} />
              </Field>
            </>
          )}

          <Field label="State">
            <Select value={data.state} onChange={(v) => update({ state: v })} options={STATES} />
          </Field>

          <button type="submit" className="btn-cta w-full">
            Continue <ArrowRight className="h-4 w-4" />
          </button>

        </form>
      )}

      {step === 3 && (

        <form onSubmit={onSubmit} className="space-y-4">
          <StepHeader title="Where should our specialist reach you?" onBack={() => setStep(2)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name">
              <Input value={data.firstName} onChange={(v) => update({ firstName: v })} required />
            </Field>
            <Field label="Last name">
              <Input value={data.lastName} onChange={(v) => update({ lastName: v })} required />
            </Field>
          </div>
          <Field label="Email">
            <Input type="email" value={data.email} onChange={(v) => update({ email: v })} required />
          </Field>
          <Field label="Phone number" hint="Used by your specialist to call you back.">
            <div className="relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
              <input
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                placeholder="(555) 123-4567"
                value={data.phone ?? ""}
                onChange={(e) => update({ phone: e.target.value })}
                onBlur={() => savePartialLead({ ...data })}
                className="h-14 w-full rounded-2xl border-2 border-primary/40 bg-background pl-12 pr-4 text-lg font-semibold tracking-wide focus:border-primary focus:outline-none"
              />
            </div>
          </Field>

          {/* Hidden UTM fields for downstream form processing */}
          <input type="hidden" name="utm_source" value={data.utm?.utm_source ?? ""} readOnly />
          <input type="hidden" name="utm_medium" value={data.utm?.utm_medium ?? ""} readOnly />
          <input type="hidden" name="utm_campaign" value={data.utm?.utm_campaign ?? ""} readOnly />
          <input type="hidden" name="utm_term" value={data.utm?.utm_term ?? ""} readOnly />
          <input type="hidden" name="utm_content" value={data.utm?.utm_content ?? ""} readOnly />

          <button type="submit" disabled={submitting} className="btn-cta w-full">
            {submitting ? "Submitting…" : "Get My Free Consultation"}
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-xs leading-relaxed text-muted-foreground">
            By submitting this form, you agree to be contacted by WeHelpFinance and its specialist
            partners by phone, text, or email regarding your inquiry. Message and data rates may
            apply. You may opt out at any time. View our{" "}
            <Link to="/privacy" className="text-primary underline">Privacy Policy</Link>.
          </p>

          <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
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
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
    </div>
  );
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-5 flex items-center gap-2">
      {[1,2,3].map((i) => (
        <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />
      ))}
      <span className="ml-2 text-xs font-medium text-muted-foreground">Step {step} of 3</span>
    </div>
  );
}

function Field({ label, children, hint }: { label: string; children: ReactNodeLike; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

type ReactNodeLike = React.ReactNode;

function Input({ value, onChange, type = "text", required }: {
  value?: string; onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <input
      type={type}
      required={required}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
    />
  );
}

function Select({ value, onChange, options }: {
  value?: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <select
      required
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 w-full rounded-xl border border-input bg-background px-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
    >
      <option value="" disabled>Select…</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

import type * as React from "react";
