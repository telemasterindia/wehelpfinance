import Link from "next/link";
import { SiteLayout } from "@/components/SiteLayout";
import { LeadForm, type Category } from "@/components/LeadForm";
import { FAQ, type FAQItem } from "@/components/FAQ";
import { ArrowRight, CheckCircle2, User } from "lucide-react";
import type { ReactNode } from "react";

export type { Category };

type Author = {
  name: string;
  org: string;
  years: number;
};

type RelatedLink = {
  href: string;
  label: string;
};

export function ServicePage({
  eyebrow,
  title,
  lede,
  bullets,
  faqs,
  category,
  children,
  author,
  relatedLinks,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  bullets: string[];
  faqs: FAQItem[];
  category: Category;
  children?: ReactNode;
  author?: Author;
  relatedLinks?: RelatedLink[];
}) {
  return (
    <SiteLayout>
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary-soft/40 to-background" />
        <div className="container-page pt-10 pb-6">
          <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{eyebrow}</span>
          </nav>
        </div>
        <div className="container-page grid gap-10 pb-16 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-12">
          <div>
            <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              {eyebrow}
            </span>
            <h1 className="mt-4">{title}</h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">{lede}</p>

            <ul className="mt-7 space-y-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[15px]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {children}

            <a href="#get-help" className="btn-cta mt-8 inline-flex">
              See if I qualify <ArrowRight className="h-4 w-4" />
            </a>

            {author && (
              <div
                className="mt-10 flex items-start gap-4 rounded-2xl border border-border bg-card p-5"
                itemScope
                itemType="https://schema.org/Person"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                  <User className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground" itemProp="name">
                    {author.name}
                  </p>
                  <p className="text-xs text-muted-foreground" itemProp="jobTitle">
                    Founder,{" "}
                    <span itemProp="worksFor" itemScope itemType="https://schema.org/Organization">
                      <span itemProp="name">{author.org}</span>
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {author.years}+ years in US financial services lead generation. Connecting Americans with
                    vetted debt relief and financial recovery specialists since 2005.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div id="get-help" className="lg:sticky lg:top-24">
            <LeadForm defaultCategory={category} />
          </div>
        </div>
      </section>

      <FAQ items={faqs} />

      {relatedLinks && relatedLinks.length > 0 && (
        <section className="container-page pb-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl">Related resources</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 text-sm font-medium text-foreground transition hover:border-primary hover:bg-primary-soft/30"
                >
                  {link.label}
                  <ArrowRight className="h-4 w-4 text-primary transition group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-page pb-24">
        <div className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
          <h2 className="text-primary-foreground">Ready to explore your options?</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
            A free, confidential conversation with a specialist can show you exactly what's possible
            for your situation — no obligation, no pressure.
          </p>
          <a href="#get-help" className="btn-gold mt-7 inline-flex">
            Get Free Help Now <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}
