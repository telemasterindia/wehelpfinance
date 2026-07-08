import { DEFAULT_OG_IMAGE, DEFAULT_TWITTER_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { DebtSettlementCalculator } from "@/components/DebtSettlementCalculator";
import { FAQ, type FAQItem } from "@/components/FAQ";
import { LeadForm } from "@/components/LeadForm";
import { TrustSignals } from "@/components/TrustSignals";
import { CITIES } from "@/lib/cityData";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/schema";
import { ArrowRight, Calculator, CheckCircle2, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Debt Settlement — Resolve Credit Card Debt for Less | WeHelpFinance",
  description:
    "Debt settlement lets you resolve credit card debt for 40–60% of what you owe. Use our free calculator to estimate your savings, then get a free specialist consultation.",
  alternates: { canonical: "https://www.wehelpfinance.com/debt-settlement" },
  openGraph: {
    title:
      "Debt Settlement — Resolve Credit Card Debt for Less | WeHelpFinance",
    description:
      "Settle credit card debt for less than you owe. Free calculator plus free specialist consultation.",
    url: "https://www.wehelpfinance.com/debt-settlement",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Settlement | WeHelpFinance",
    description:
      "Estimate your debt settlement savings and speak with a vetted specialist for free.",
    images: [DEFAULT_TWITTER_IMAGE],
  },
};

const FAQS: FAQItem[] = [
  {
    q: "What is debt settlement?",
    a: "Debt settlement is a negotiation process where a specialist works with your creditors to accept a lump-sum payment that is less than your full balance, often 40–60% of what you owe. The remaining balance is forgiven.",
  },
  {
    q: "Who qualifies for debt settlement?",
    a: "Debt settlement is most appropriate for people with $10,000 or more in unsecured debt, such as credit cards, personal loans, and medical bills, who are experiencing genuine financial hardship and cannot realistically pay the full balance.",
  },
  {
    q: "How long does debt settlement take?",
    a: "Most programs run 24–48 months depending on the total enrolled debt and monthly deposit amount. During this time, you make deposits into a dedicated account and your specialist negotiates with creditors as funds build.",
  },
  {
    q: "Does debt settlement hurt my credit?",
    a: "Debt settlement can damage your credit because accounts typically become delinquent during the program. For people in genuine hardship, this trade-off may be worth the relief of resolving unmanageable balances.",
  },
  {
    q: "What is the difference between debt settlement and debt consolidation?",
    a: "Debt consolidation combines your debts into one payment and you still repay the full balance. Debt settlement reduces the total amount you owe through negotiation.",
  },
  {
    q: "Will I owe taxes on settled debt?",
    a: "The IRS may treat forgiven debt as taxable income and the creditor may issue a 1099-C form. If you are insolvent at the time of settlement, an exclusion may apply. A tax professional can help you understand your specific situation.",
  },
  {
    q: "Is WeHelpFinance a debt settlement company?",
    a: "No. WeHelpFinance is a free matching service. We connect consumers with vetted, independent debt settlement specialists. We do not charge fees or provide settlement services directly.",
  },
];

const CITY_LINKS = Object.values(CITIES)
  .map((city) => ({
    href: `/debt-settlement/${city.slug}`,
    label: `${city.city}, ${city.stateAbbr}`,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const RELATED_LINKS = [
  {
    href: "/debt-settlement-vs-bankruptcy",
    label: "Settlement vs. Bankruptcy",
  },
  {
    href: "/debt-settlement-vs-debt-consolidation",
    label: "Settlement vs. Consolidation",
  },
  {
    href: "/debt-relief-vs-personal-loan",
    label: "Debt Relief vs. Personal Loan",
  },
  { href: "/debt-settlement-calculator", label: "Debt Settlement Calculator" },
  { href: "/fdcpa-rights", label: "Your FDCPA Rights" },
  { href: "/debt-validation", label: "Debt Validation" },
];

const BREADCRUMBS = [
  { name: "Home", path: "https://www.wehelpfinance.com/" },
  {
    name: "Debt Settlement",
    path: "https://www.wehelpfinance.com/debt-settlement",
  },
];

export default function DebtSettlementPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(BREADCRUMBS)),
        }}
      />

      <section className="bg-gradient-to-b from-primary-soft/40 to-background">
        <div className="container-page max-w-5xl py-12 lg:py-16">
          <nav className="breadcrumb-nav" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span data-current="true">Debt Settlement</span>
          </nav>

          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Debt Settlement
            </span>
            <h1 className="mt-4">Resolve Your Debt for Less Than You Owe</h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              Debt settlement lets you negotiate with creditors to accept a
              lump-sum payment, often 40–60% of your balance. Use the free
              calculator below to estimate your savings, then speak with a
              specialist about your actual accounts.
            </p>
            <ul className="mt-6 space-y-2">
              {[
                "Settle credit card, medical, and personal loan debt",
                "Most programs resolve in 24–48 months",
                "Free, confidential consultation with no obligation",
                "Specialists negotiate directly with your creditors",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-success"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#calculator" className="btn-cta inline-flex">
                Estimate My Savings{" "}
                <Calculator className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#cities"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-primary bg-background px-5 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft"
              >
                Find Your City <MapPin className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page max-w-5xl py-6">
        <TrustSignals variant="compact" />
      </section>

      <section className="container-page max-w-5xl py-8" id="calculator">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
            <Calculator className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-xl font-display font-semibold">
              Free Debt Settlement Calculator
            </h2>
            <p className="text-sm text-muted-foreground">
              See your estimated savings in about two minutes.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-10">
          <DebtSettlementCalculator />
        </div>
      </section>

      <section className="container-page max-w-5xl py-8" id="get-help">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
          <div>
            <h2>Ready to Talk to a Specialist?</h2>
            <p className="mt-3 text-muted-foreground">
              The calculator gives you estimates. A specialist gives you real
              numbers based on your creditors, account ages, balances, and
              current hardship. The consultation is free and carries no
              obligation.
            </p>

            <div className="mt-8 space-y-6">
              {[
                {
                  step: "1",
                  title: "Free consultation",
                  body: "A specialist reviews your accounts, income, and situation to assess what options are realistically available.",
                },
                {
                  step: "2",
                  title: "Enroll your accounts",
                  body: "Qualifying unsecured debts are enrolled, including credit cards, personal loans, and medical bills. Secured debts are not included.",
                },
                {
                  step: "3",
                  title: "Build your settlement fund",
                  body: "You make monthly deposits into a dedicated savings account instead of juggling minimum payments.",
                },
                {
                  step: "4",
                  title: "Negotiate and resolve",
                  body: "Your specialist negotiates with each creditor. Settled accounts are resolved for less than the original balance.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {item.step}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <LeadForm defaultCategory="debt-relief" />
          </div>
        </div>
      </section>

      <FAQ title="Debt settlement FAQs" items={FAQS} />

      <section id="cities" className="container-page max-w-4xl scroll-mt-24 pb-12">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Debt settlement by city
        </h2>
        <div className="flex flex-wrap gap-2">
          {CITY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page max-w-4xl pb-16">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Compare your options
        </h3>
        <div className="flex flex-wrap gap-2">
          {RELATED_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page max-w-4xl pb-24">
        <div className="rounded-3xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
          <h2 className="text-primary-foreground">
            Ready to explore your options?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
            A free, confidential consultation can show you what settlement may
            look like for your actual creditors.
          </p>
          <a href="#get-help" className="btn-gold mt-7 inline-flex">
            Get Free Help Now{" "}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </>
  );
}
