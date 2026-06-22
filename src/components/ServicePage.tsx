import Link from "next/link";
import { SiteLayout } from "@/components/SiteLayout";
import { LeadForm } from "@/components/LeadForm";
import { FAQ, type FAQItem } from "@/components/FAQ";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

export type Category = "debt-relief" | "personal-loan" | "tax-relief";

export function ServicePage({
  eyebrow, title, lede, bullets, faqs, category, children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  bullets: string[];
  faqs: FAQItem[];
  category: Category;
  children?: ReactNode;
}) {
  return (
    <SiteLayout>
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary-soft/40 to-background" />
        <div className="container-page pt-10 pb-6">
          <nav className="text-sm text-muted-foreground">
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
          </div>

          <div id="get-help" className="lg:sticky lg:top-24">
            <LeadForm defaultCategory={category} />
          </div>
        </div>
      </section>

      <FAQ items={faqs} />
    </SiteLayout>
  );
}
