"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";

// Note: metadata export must be in a server component
// Move this to a layout or use generateMetadata pattern if needed
// For now keeping it here as a reference

const METADATA = {
  title: "Contact WeHelpFinance — Get in Touch | WeHelpFinance",
  description: "Contact WeHelpFinance by phone, email, or message. Reach our team at (718) 360-4806 or fill out our contact form. We respond within one business day.",
};

const W3F_KEY = "19b473ef-4a3d-4d3e-807d-82ed6bb3be99";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: W3F_KEY,
          subject: `Contact Form — WeHelpFinance — ${form.name}`,
          from_name: "WeHelpFinance Contact",
          ...form,
          botcheck: "",
        }),
      });
      const json = await res.json() as { success: boolean };
      setStatus(json.success ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-soft/40 to-background">
        <div className="container-page max-w-4xl py-14 lg:py-20">
          <h1>Get in touch</h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            We respond to all messages within one business day. For faster service, call us directly
            at <a href="tel:+17183604806" className="text-primary font-medium">(718) 360-4806</a>.
          </p>
        </div>
      </section>

      <div className="container-page max-w-5xl py-12 pb-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:items-start">

          {/* Contact form */}
          <div>
            <h2 className="text-2xl mb-6">Send us a message</h2>

            {status === "success" ? (
              <div className="rounded-2xl border border-success/30 bg-success/10 p-8 text-center">
                <p className="font-display text-xl font-semibold text-foreground">Message received.</p>
                <p className="mt-2 text-muted-foreground">We'll get back to you within one business day.</p>
                <Link href="/" className="btn-cta mt-6 inline-flex">Back to home</Link>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1.5">Your name *</label>
                    <input
                      id="name" type="text" required autoComplete="name"
                      value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                      className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1.5">Phone number</label>
                    <input
                      id="phone" type="tel" autoComplete="tel"
                      value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email address *</label>
                  <input
                    id="email" type="email" required autoComplete="email"
                    value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                    className="h-12 w-full rounded-xl border border-input bg-background px-4 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1.5">Message *</label>
                  <textarea
                    id="message" required rows={5}
                    placeholder="Tell us what you're dealing with and how we can help..."
                    value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>
                <input type="text" name="botcheck" defaultValue="" style={{ display: "none" }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
                {status === "error" && (
                  <p className="text-sm text-destructive">Something went wrong. Please try again or call us at (718) 360-4806.</p>
                )}
                <button type="submit" disabled={status === "submitting"} className="btn-cta disabled:opacity-60">
                  {status === "submitting" ? "Sending…" : <>Send message <ArrowRight className="h-4 w-4" /></>}
                </button>
                <p className="text-xs text-muted-foreground">
                  We respond within one business day. Your information is kept private and never sold.
                </p>
              </form>
            )}
          </div>

          {/* Contact details */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <h3 className="text-lg font-semibold">Contact information</h3>
              <div className="flex items-start gap-3 text-sm">
                <Phone className="h-5 w-5 shrink-0 text-primary mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-foreground">Phone</p>
                  <a href="tel:+17183604806" className="text-muted-foreground hover:text-primary">(718) 360-4806</a>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Mail className="h-5 w-5 shrink-0 text-primary mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <a href="mailto:help@wehelpfinance.com" className="text-muted-foreground hover:text-primary">help@wehelpfinance.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 shrink-0 text-primary mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-foreground">Mailing address</p>
                  <address className="text-muted-foreground not-italic">
                    539 W. Commerce St #4251<br />
                    Dallas, TX 75208
                  </address>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Clock className="h-5 w-5 shrink-0 text-primary mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-foreground">Response time</p>
                  <p className="text-muted-foreground">Within one business day</p>
                  <p className="text-muted-foreground text-xs mt-0.5">Mon–Fri, 9am–6pm CT</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
              <p className="font-display font-semibold text-lg">Need help now?</p>
              <p className="mt-2 text-sm text-primary-foreground/85">
                If you're dealing with debt, tax problems, or a loan need, our specialist matching
                service is free and available right now.
              </p>
              <Link href="/get-help" className="btn-gold mt-5 inline-flex">
                Get free help <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
