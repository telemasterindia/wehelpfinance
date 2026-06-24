import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Consumer Rights — Debt Collection & FDCPA Guides | WeHelpFinance",
  description:
    "Learn your rights around debt validation, debt collection agencies, and the FDCPA. Free educational guides from WeHelpFinance.",
  alternates: { canonical: "https://www.wehelpfinance.com/consumer-rights" },
  openGraph: {
    title: "Consumer Rights — Debt Collection & FDCPA Guides | WeHelpFinance",
    description:
      "Understand debt validation, FDCPA rights, collection agency limits, and how to respond when collectors contact you.",
    url: "https://www.wehelpfinance.com/consumer-rights",
    type: "website",
  },
};

const GUIDES = [
  {
    href: "/debt-validation",
    title: "Debt Validation",
    description:
      "Learn how to demand proof that a debt is real, accurate, and legally collectible before you pay.",
  },
  {
    href: "/debt-validation-letter",
    title: "Debt Validation Letter",
    description:
      "Use a complete guide and letter template to request debt validation from a collector.",
  },
  {
    href: "/fdcpa-rights",
    title: "FDCPA Rights",
    description:
      "Understand what debt collectors can and cannot do under federal debt collection law.",
  },
  {
    href: "/collection-agency-rights",
    title: "Collection Agency Rights",
    description:
      "Know the limits of collection agency authority and what options you have when contacted.",
  },
];

export default function Page() {
  return (
    <>
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary-soft/40 to-background" />
        <div className="container-page py-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Consumer Rights
            </span>
            <h1 className="mt-4">Know your rights before you pay a collector.</h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Debt collectors have rules to follow, and you have protections. These guides explain
              debt validation, FDCPA rights, and how to respond when a collection agency contacts you.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {GUIDES.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="group rounded-3xl border border-border bg-card p-6 transition hover:border-primary hover:shadow-sm"
              >
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="text-xl group-hover:text-primary">{guide.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {guide.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Read the guide <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

