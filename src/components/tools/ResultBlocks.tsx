// src/components/tools/ResultBlocks.tsx
//
// Shared result-panel primitives — platform improvement shipped with
// Sprint 3 (standards §1.4 extend-don't-modify; spec recommendation
// R4, rule-of-three satisfied). Sprint 1–2 components are NOT
// refactored; these exist so Sprint 3+ never re-implements them.
//
//   HeroStat  — the headline card at the top of every results panel.
//   NoticeBox — amber / red / neutral inline notices.
//   SoftCTA   — the platform CTA pair (Call now + Get free help)
//               with analytics built in, per CRO standards §12.

"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Phone, ArrowRight, AlertTriangle, Info } from "lucide-react";
import { trackToolEvent } from "@/lib/calculators/track";

// ─── HeroStat ─────────────────────────────────────────────────────────────────

export function HeroStat({
  eyebrow,
  value,
  sub,
  tone = "primary",
}: {
  eyebrow: string;
  value: string;
  sub?: string;
  tone?: "primary" | "success" | "destructive";
}) {
  const frame =
    tone === "success"
      ? "border-success/30 bg-success/10"
      : tone === "destructive"
        ? "border-destructive/30 bg-destructive/10"
        : "border-primary/25 bg-primary-soft/30";
  const eyebrowColor =
    tone === "success"
      ? "text-success"
      : tone === "destructive"
        ? "text-destructive"
        : "text-primary";

  return (
    <div className={`rounded-3xl border p-5 ${frame}`}>
      <p className={`text-xs font-semibold uppercase tracking-wider ${eyebrowColor}`}>
        {eyebrow}
      </p>
      <p className="mt-1 font-display text-3xl font-semibold text-foreground">{value}</p>
      {sub && <p className="mt-0.5 text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}

// ─── NoticeBox ────────────────────────────────────────────────────────────────

export function NoticeBox({
  tone = "amber",
  role,
  children,
}: {
  tone?: "amber" | "red" | "neutral";
  /** pass "alert" for blocking-error semantics; omit for advisory notes */
  role?: "alert";
  children: ReactNode;
}) {
  const frame =
    tone === "red"
      ? "border-destructive/40 bg-destructive/10"
      : tone === "neutral"
        ? "border-border bg-card"
        : "border-gold/40 bg-gold/10";
  const iconColor = tone === "red" ? "text-destructive" : tone === "neutral" ? "text-primary" : "text-gold";
  const IconCmp = tone === "neutral" ? Info : AlertTriangle;

  return (
    <p
      role={role}
      className={`flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-sm text-foreground ${frame}`}
    >
      <IconCmp className={`mt-0.5 h-4 w-4 shrink-0 ${iconColor}`} aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

// ─── SoftCTA ──────────────────────────────────────────────────────────────────

export function SoftCTA({
  heading,
  body,
  tool,
  source,
  phoneHref = "tel:+17183604806",
  helpHref = "/get-help",
  helpLabel = "Get free help",
}: {
  heading: string;
  body: string;
  /** analytics tool slug, e.g. "dti" */
  tool: string;
  /** lead_form_started source, e.g. "dti_calculator" */
  source: string;
  phoneHref?: string;
  helpHref?: string;
  helpLabel?: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <p className="font-display text-lg text-foreground">{heading}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
        <a
          href={phoneHref}
          onClick={() => trackToolEvent("phone_clicked", { tool })}
          className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-full border border-primary bg-background px-5 text-sm font-semibold text-primary transition hover:bg-primary-soft focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call now
        </a>
        <Link
          href={helpHref}
          onClick={() => {
            trackToolEvent("cta_clicked", { tool, cta: "get_free_help" });
            trackToolEvent("lead_form_started", { source });
          }}
          className="btn-cta flex-1 !min-h-[48px] text-sm"
        >
          {helpLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
