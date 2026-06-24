import Link from "next/link";
import { LeadForm, type Category } from "@/components/LeadForm";
import { FAQ, type FAQItem } from "@/components/FAQ";
import { CheckCircle2, ArrowRight, MapPin, User } from "lucide-react";
import { STATE_INTERNAL_LINKS } from "@/lib/stateData";
import type { ReactNode } from "react";

type RelatedLink = { href: string; label: string };

export type StateServicePageProps = {
  stateName: string;
  stateAbbr: string;
  vertical: "debt-relief" | "personal-loans" | "tax-relief";
  category: Category;
  title: ReactNode;
  eyebrow: string;
  lede: string;
  bullets: string[];
  content: ReactNode;
  faqs: FAQItem[];
  relatedStatePages: RelatedLink[];
  author: string;
};

const VERTICAL_LABEL: Record<string, string> = {
  "debt-relief": "Debt Relief",
  "personal-loans": "Personal Loans",
  "tax-relief": "Tax Relief",
};

export function StateServicePage({
  stateName, stateAbbr, vertical, category,
  title, eyebrow, lede, bullets, content,
  faqs, relatedStatePages, author,
}: StateServicePageProps) {
  return (
    <article className="pb-24">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-soft/40 to-background">
        <div className="container-page max-w-6xl py-10 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-12">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {eyebrow} — {stateName}
              </span>
              <h1 className="mt-4">{title}</h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">{lede}</p>
              <ul className="mt-7 space-y-3">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-[15px]">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <a href="#get-help" className="btn-cta mt-8 inline-flex">
                Get Free Help in {stateName} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              {/* Author / E-E-A-T */}
              <div className="mt-10 flex items-start gap-4 rounded-2xl border border-border bg-card p-5" itemScope itemType="https://schema.org/Organization">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                  <User className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground" itemProp="name">{author}</p>
                  <p className="text-xs text-muted-foreground">WeHelpFinance • {stateName} Financial Resource</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Content researched and written for {stateName} residents. We review state-specific consumer protection laws, debt collection rules, and lending regulations for accuracy.
                  </p>
                </div>
              </div>
            </div>
            {/* Lead form */}
            <div id="get-help" className="lg:sticky lg:top-24">
              <LeadForm defaultCategory={category} />
            </div>
          </div>
        </div>
      </section>

      {/* Article content */}
      <section className="container-page max-w-4xl py-12">
        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
          {content}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page max-w-4xl pb-12">
        <h2 className="mb-6">Frequently Asked Questions — {VERTICAL_LABEL[vertical]} in {stateName}</h2>
        <FAQ items={faqs} />
      </section>

      {/* Internal links */}
      <section className="container-page max-w-4xl pb-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Our services</h3>
            <ul className="space-y-2">
              {STATE_INTERNAL_LINKS.services.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                    <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Know your rights</h3>
            <ul className="space-y-2">
              {STATE_INTERNAL_LINKS.consumerRights.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                    <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Compare options</h3>
            <ul className="space-y-2">
              {STATE_INTERNAL_LINKS.comparisons.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                    <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Other states */}
      {relatedStatePages.length > 0 && (
        <section className="container-page max-w-4xl pb-12">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {VERTICAL_LABEL[vertical]} in other states
          </h3>
          <div className="flex flex-wrap gap-2">
            {relatedStatePages.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary">
                {l.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="container-page max-w-4xl pb-8">
        <div className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
          <h2 className="text-primary-foreground">Ready to explore your options in {stateName}?</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
            A free, confidential consultation with a vetted specialist can show you exactly what is available for {stateName} residents in your situation — no obligation.
          </p>
          <a href="#get-help" className="btn-gold mt-7 inline-flex">
            Get Free Help Now <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </article>
  );
}
