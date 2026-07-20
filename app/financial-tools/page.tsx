import type { Metadata } from "next";
import Link from "next/link";
import { TrustBox } from "@/components/TrustBox";
import { FAQ } from "@/components/FAQ";
import { RelatedResources } from "@/components/RelatedResources";
import type { ResourceGroup } from "@/components/RelatedResources";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import {
  Calculator,
  PiggyBank,
  Scale,
  Wallet,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  LockKeyhole,
  Home,
} from "lucide-react";

const CANONICAL = "https://www.wehelpfinance.com/financial-tools";

export const metadata: Metadata = {
  title: "Free Financial Tools & Calculators | WeHelpFinance",
  description:
    "Free, no-sign-up financial calculators from WeHelpFinance: debt payoff planner, debt settlement estimator, DTI calculator, and debt solutions comparison calculator.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Free Financial Tools & Calculators | WeHelpFinance",
    description:
      "Plan your debt payoff, estimate settlement savings, and understand your options — free tools, no email required.",
    url: CANONICAL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Financial Tools | WeHelpFinance",
    description:
      "Debt payoff planner, settlement estimator, and more — free, no sign-up.",
  },
};

const FAQS = [
  {
    q: "Are these calculators really free?",
    a: "Yes — every tool on this page is completely free, with no sign-up, no email capture, and no credit check. They run entirely in your browser; nothing you type is saved or submitted anywhere.",
  },
  {
    q: "How are the calculations verified?",
    a: "Each tool's methodology is documented on its page and built from standard financial math — monthly compounding at APR/12, industry-average settlement ranges from AFCC data, and the same payoff mechanics taught by nonprofit credit counselors. Content is reviewed under our editorial policy before publishing.",
  },
  {
    q: "Will these tools tell me which debt option is right for me?",
    a: "They'll show you the honest math — payoff timelines, interest costs, and realistic settlement ranges. What they can't see is your full situation: income stability, hardship, credit goals. That's why every tool pairs its results with a free, no-obligation specialist consultation for people who want a human read on their options.",
  },
  {
    q: "What tools are coming next?",
    a: "A simple budget planner is planned next. Every calculator follows the same standard: free, private, and no sign-up.",
  },
];

const RELATED: ResourceGroup[] = [
  {
    heading: "Related Services",
    links: [
      { href: "/debt-relief", label: "Debt Relief" },
      { href: "/debt-consolidation", label: "Debt Consolidation" },
      { href: "/personal-loans", label: "Personal Loans" },
    ],
  },
  {
    heading: "Learn More",
    links: [
      { href: "/blog", label: "Financial Education Blog" },
      { href: "/research", label: "Research Reports" },
      { href: "/editorial-policy", label: "Our Editorial Standards" },
    ],
  },
];

const LIVE_TOOLS = [
  {
    href: "/financial-tools/mortgage-refinance-calculator",
    name: "Mortgage Refinance Calculator",
    description:
      "Compare your current mortgage with a refinance — monthly savings, lifetime cost, break-even, LTV, and DTI in one honest view.",
    icon: Home,
    badge: "New",
    featured: true,
  },
  {
    href: "/financial-tools/personal-loan-calculator",
    name: "Personal Loan Calculator",
    description:
      "Estimate a realistic APR range, monthly payment, total interest, and DTI before and after the loan — then compare other paths.",
    icon: Wallet,
    badge: "New",
    featured: true,
  },
  {
    href: "/financial-tools/debt-solutions-comparison",
    name: "Debt Solutions Comparison Calculator",
    description:
      "Minimum payments vs. settlement vs. consolidation vs. DMP — every path's payment, timeline, cost, and credit impact in one honest table.",
    icon: Scale,
    badge: "Flagship",
    featured: true,
  },
  {
    href: "/financial-tools/debt-payoff-calculator",
    name: "Debt Payoff Calculator",
    description:
      "Enter unlimited debts and compare the Snowball and Avalanche methods side by side — debt-free date, total interest, and live charts.",
    icon: Calculator,
    badge: "Free",
    featured: true,
  },
  {
    href: "/financial-tools/dti-calculator",
    name: "Debt-to-Income (DTI) Calculator",
    description:
      "Front-end and back-end DTI computed the way lenders do — with qualification bands and the exact dollars of debt to eliminate.",
    icon: Scale,
    badge: "New",
    featured: false,
  },
  {
    href: "/debt-settlement-calculator",
    name: "Debt Settlement Calculator",
    description:
      "Estimate what your debt could realistically settle for, program costs, and your savings versus minimum payments.",
    icon: Scale,
    badge: "Popular",
    featured: false,
  },
];

const COMING_SOON = [
  {
    name: "Budget Planner",
    description:
      "A simple income vs. expenses planner that shows what's realistically available for debt payments.",
    icon: PiggyBank,
  },
];

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "https://www.wehelpfinance.com/" },
              { name: "Financial Tools", path: CANONICAL },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Free Financial Tools & Calculators",
            url: CANONICAL,
            description:
              "Free financial calculators from WeHelpFinance: debt payoff planning, settlement savings estimation, and more.",
            mainEntity: {
              "@type": "ItemList",
              itemListElement: LIVE_TOOLS.map((t, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: t.name,
                url: `https://www.wehelpfinance.com${t.href}`,
              })),
            },
          }),
        }}
      />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-primary-soft/40 to-background">
        <div className="container-page max-w-4xl py-14 lg:py-20">
          <nav
            className="mb-6 text-sm text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Financial Tools</span>
          </nav>

          <h1>Free Financial Tools &amp; Calculators</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Plan your payoff, estimate settlement savings, and see the honest
            math behind your options — free, private, and with no sign-up.
            Numbers first, decisions second.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground/90">
            <span className="inline-flex items-center gap-1.5">
              <LockKeyhole
                className="h-4 w-4 text-primary"
                aria-hidden="true"
              />{" "}
              Nothing saved or submitted
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck
                className="h-4 w-4 text-primary"
                aria-hidden="true"
              />{" "}
              No email required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />{" "}
              Methodology on every tool
            </span>
          </div>
        </div>
      </section>

      {/* ── Live tools ── */}
      <section
        className="container-page py-12"
        aria-labelledby="live-tools-heading"
      >
        <h2
          id="live-tools-heading"
          className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Available now
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {LIVE_TOOLS.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`group flex flex-col rounded-3xl border bg-card p-6 transition hover:border-primary hover:shadow-md lg:p-8 ${
                  t.featured
                    ? "border-primary/40 bg-primary-soft/20"
                    : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </span>
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    {t.badge}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-foreground group-hover:text-primary">
                  {t.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {t.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Open calculator
                  <ArrowRight
                    className="h-4 w-4 transition group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Coming soon ── */}
      <section
        className="container-page pb-12"
        aria-labelledby="coming-soon-heading"
      >
        <h2
          id="coming-soon-heading"
          className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Coming soon
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {COMING_SOON.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.name}
                className="rounded-3xl border border-dashed border-border bg-card/60 p-6"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted">
                  <Icon
                    className="h-5 w-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                </span>
                <h3 className="mt-3 font-display text-base font-semibold text-foreground">
                  {t.name}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {t.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Why these tools exist ── */}
      <section className="container-page max-w-4xl pb-12">
        <div className="rounded-3xl border border-border bg-card p-6 lg:p-8">
          <h2 className="!mt-0 font-display text-xl text-foreground">
            Why we build these tools
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            Most debt decisions get made under stress, without clear numbers.
            These calculators exist to fix that: see your real payoff timeline,
            your real interest cost, and the real difference between strategies
            — before you talk to anyone. Every tool documents its assumptions,
            uses standard financial math, and is reviewed under our{" "}
            <Link
              href="/editorial-policy"
              className="text-primary underline-offset-2 hover:underline"
            >
              editorial standards
            </Link>
            . And when the numbers say your situation needs more than a
            strategy, a free specialist consultation is one click away — never a
            requirement.
          </p>
        </div>
      </section>

      <FAQ items={FAQS} title="About these tools" />

      <RelatedResources groups={RELATED} />
      <TrustBox />
    </>
  );
}
