import type { Metadata } from "next";
import Link from "next/link";
import { DebtSettlementCalculator } from "@/components/DebtSettlementCalculator";
import { TrustSignals } from "@/components/TrustSignals";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const CANONICAL = "https://www.wehelpfinance.com/debt-settlement-calculator";

export const metadata: Metadata = {
  title: "Debt Settlement Calculator 2026 — Estimate Your Savings | WeHelpFinance",
  description: "Free debt settlement calculator. Enter your total debt, delinquency status, and credit score to see what you could realistically settle for — and how much you'd save vs. minimum payments.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Free Debt Settlement Calculator | WeHelpFinance",
    description: "See how much you could save with debt settlement vs. making minimum payments. Free, no personal information required.",
    url: CANONICAL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Settlement Calculator | WeHelpFinance",
    description: "Estimate your settlement savings in 2 minutes. Free calculator.",
  },
};

const FAQS = [
  {
    q: "How accurate is this debt settlement calculator?",
    a: "The calculator uses industry-average settlement percentages (35–65% of original balance) and typical program fees (15–25% of enrolled debt) based on American Fair Credit Council data. It provides a realistic range — not a guarantee. Actual settlements depend on your specific creditors, account age, and the skill of your settlement specialist.",
  },
  {
    q: "What percentage does debt typically settle for?",
    a: "Most unsecured debts settle for 40–60 cents on the dollar, though the range is 35–65%. Accounts that are 60–120 days delinquent often settle for the best percentages because creditors are motivated to recover something before the account charges off. Very old accounts in collections sometimes settle for 25–35 cents on the dollar.",
  },
  {
    q: "How long does a debt settlement program take?",
    a: "Most programs run 24–48 months depending on the total enrolled debt and how quickly you can build the settlement fund. During this time you make monthly deposits into a dedicated savings account. When the account reaches sufficient balance, your specialist negotiates with each creditor.",
  },
  {
    q: "Will debt settlement hurt my credit score?",
    a: "Yes — accounts typically become delinquent during the settlement program, which damages your credit score. Settled accounts are reported as 'settled for less than full amount' for 7 years. This is a trade-off that many people in genuine financial hardship find acceptable in exchange for resolving unmanageable debt.",
  },
  {
    q: "Do I owe taxes on settled debt?",
    a: "The IRS may treat forgiven debt as taxable income. If you settle $20,000 in debt for $8,000, the $12,000 difference may be reportable as income and the creditor may issue a 1099-C form. An exception applies if you are 'insolvent' at the time of settlement — meaning your total debts exceed your total assets. Consult a tax professional for guidance specific to your situation.",
  },
  {
    q: "What is the minimum debt for settlement to make sense?",
    a: "Most specialists recommend a minimum of $7,500–$10,000 in unsecured debt for settlement to be cost-effective. Below this threshold, program fees can consume most of the savings. For smaller balances, a personal loan for consolidation or a nonprofit debt management plan may be more appropriate.",
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
              { name: "Debt Settlement", path: "https://www.wehelpfinance.com/debt-settlement" },
              { name: "Debt Settlement Calculator", path: CANONICAL },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Debt Settlement Calculator",
            url: CANONICAL,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description: "Free calculator to estimate debt settlement savings vs. minimum payments.",
            publisher: { "@type": "Organization", name: "WeHelpFinance", url: "https://www.wehelpfinance.com" },
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-linear-to-b from-primary-soft/40 to-background">
        <div className="container-page max-w-4xl py-12 lg:py-16">
          <nav className="breadcrumb-nav" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/debt-settlement" className="hover:text-primary">Debt Settlement</Link>
            <span className="mx-2">/</span>
            <span data-current="true">Calculator</span>
          </nav>

          <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Free Tool
          </span>
          <h1 className="mt-4">Debt Settlement Calculator</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            See how much you could realistically save with debt settlement — and how it compares to making minimum payments for the next 30 years. Free, no personal information required.
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {[
              "Takes 2 minutes",
              "No personal data required",
              "Based on industry averages",
              "Includes fee estimates",
            ].map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Calculator */}
      <section className="container-page max-w-4xl py-12">
        <div className="rounded-3xl border border-border bg-card p-6 md:p-10 shadow-sm">
          <DebtSettlementCalculator />
        </div>
      </section>

      {/* Trust signals */}
      <section className="container-page max-w-4xl pb-12">
        <TrustSignals variant="banner" />
      </section>

      {/* How it works */}
      <section className="container-page max-w-4xl pb-12">
        <h2 className="mb-8">How Debt Settlement Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Stop Minimum Payments",
              body: "You stop making minimum payments and instead deposit money into a dedicated savings account each month.",
            },
            {
              step: "2",
              title: "Negotiate with Creditors",
              body: "When your account has accumulated enough funds, a specialist negotiates with each creditor to accept a lump-sum settlement for less than you owe.",
            },
            {
              step: "3",
              title: "Debt Resolved",
              body: "Once the settlement is accepted and paid, the account is resolved. The process typically takes 24–48 months for the full program.",
            },
          ].map((item) => (
            <div key={item.step} className="rounded-2xl border border-border bg-card p-6">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {item.step}
              </span>
              <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>Important trade-off:</strong> During a settlement program, accounts become delinquent and your credit score will be negatively affected. Settlement is most appropriate for people in genuine financial hardship who cannot realistically pay the full balance. If your accounts are current and your credit is in good shape, a{" "}
            <Link href="/personal-loans" className="underline font-medium">personal loan for consolidation</Link> may be a better option.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page max-w-4xl pb-12">
        <h2 className="mb-6">Calculator FAQ</h2>
        <div className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group bg-card">
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 text-sm font-medium text-foreground hover:bg-muted/30 transition-colors list-none">
                {faq.q}
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Internal links */}
      <section className="container-page max-w-4xl pb-16">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Learn more about your options
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/debt-settlement", label: "Debt Settlement" },
            { href: "/debt-consolidation", label: "Debt Consolidation" },
            { href: "/personal-loans", label: "Personal Loans" },
            { href: "/debt-settlement-vs-bankruptcy", label: "Settlement vs. Bankruptcy" },
            { href: "/debt-settlement-vs-debt-consolidation", label: "Settlement vs. Consolidation" },
            { href: "/debt-relief-vs-personal-loan", label: "Debt Relief vs. Personal Loan" },
            { href: "/fdcpa-rights", label: "FDCPA Rights" },
            { href: "/debt-validation", label: "Debt Validation" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
