import type { Metadata } from "next";
import Link from "next/link";
import { DebtSettlementCalculator } from "@/components/tools/DebtSettlementCalculator";
import { TrustSignals } from "@/components/TrustSignals";
import { TrustBox } from "@/components/TrustBox";
import { FAQ } from "@/components/FAQ";
import { RelatedResources } from "@/components/RelatedResources";
import type { ResourceGroup } from "@/components/RelatedResources";
import {
  KeyTakeaway, ProsCons, CommonMistakes, NextSteps,
} from "@/components/ContentAuthorityBlocks";
import { faqJsonLd, breadcrumbJsonLd, howToJsonLd } from "@/lib/schema";
import { DEFAULT_OG_IMAGE, DEFAULT_TWITTER_IMAGE } from "@/lib/seo";
import { CheckCircle2 } from "lucide-react";

const CANONICAL = "https://www.wehelpfinance.com/debt-settlement-calculator";

export const metadata: Metadata = {
  title: "Debt Settlement Calculator 2026 — Estimate Your Savings | WeHelpFinance",
  description:
    "Free debt settlement calculator. Enter your debt, creditors, and delinquency status to see a realistic settlement estimate, program cost, monthly deposit, timeline, and savings vs. minimum payments.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Free Debt Settlement Calculator | WeHelpFinance",
    description:
      "See what your debt could realistically settle for — full cost breakdown, timeline, and savings vs. minimum payments. No sign-up required.",
    url: CANONICAL,
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Settlement Calculator | WeHelpFinance",
    description: "Estimate your settlement savings in 2 minutes. Free, private, no sign-up.",
    images: [DEFAULT_TWITTER_IMAGE],
  },
};

const FAQS = [
  {
    q: "How accurate is this debt settlement calculator?",
    a: "It uses industry-average settlement percentages (35–65% of balance, keyed to how far behind your accounts are) and typical program fees (15–25% of enrolled debt) based on American Fair Credit Council data. Every assumption is adjustable and shown under “How this estimate is calculated.” It's a realistic planning range — not a quote. Actual settlements depend on your specific creditors, account ages, and negotiation.",
  },
  {
    q: "What percentage does debt typically settle for?",
    a: "Most unsecured debts settle for 40–60 cents on the dollar. Accounts 60–120 days delinquent often get the best percentages because creditors are motivated to recover something before charge-off. Very old collection accounts sometimes settle for 25–35 cents. Accounts that are still current settle highest — creditors have little reason to discount debt that's being paid on time.",
  },
  {
    q: "How long does a debt settlement program take?",
    a: "Most programs run 24–48 months. You make monthly deposits into a dedicated account you control; as it grows, your specialist negotiates with each creditor one by one. The calculator lets you set a target monthly payment and shows the resulting timeline — or the minimum deposit needed to finish within 60 months.",
  },
  {
    q: "Will debt settlement hurt my credit score?",
    a: "Yes, especially if your accounts are still current — settlement typically requires falling behind before creditors negotiate, and settled accounts are reported as “settled for less than full balance” for up to 7 years. If you're already 60+ days delinquent, most of the damage has happened; resolving the debt starts the recovery clock, and many people see scores improving within 12–24 months of completing settlements.",
  },
  {
    q: "Do I owe taxes on settled debt?",
    a: "Possibly. Creditors generally issue IRS Form 1099-C when they forgive $600 or more, and the forgiven amount may count as taxable income. A major exception: if you were insolvent — your total debts exceeded your total assets — at the time of settlement, some or all of it may be excluded. The IRS covers this in Topic 431 (Canceled Debt). Confirm your situation with a tax professional.",
  },
  {
    q: "What is the minimum debt for settlement to make sense?",
    a: "Roughly $7,500–$10,000 in unsecured debt. Below that, program fees consume most of the savings, and a nonprofit debt management plan or a consolidation loan is usually more cost-effective. The calculator's recommendation logic flags this automatically based on your numbers.",
  },
];

const HOWTO_STEPS = [
  { name: "Enter your debt picture", text: "Total unsecured debt, number of creditors, and how far behind your accounts are — delinquency stage is the biggest driver of settlement percentages." },
  { name: "Add income and payments", text: "Your monthly household income and what you currently pay toward debt power the affordability check and the minimum-payment comparison." },
  { name: "Review the adjustable assumptions", text: "The calculator pre-fills a typical settlement percentage for your delinquency stage and a 22% program fee — adjust either to match quotes you've received." },
  { name: "Compare the two paths", text: "See settlement's total cost, monthly deposit, and completion date next to what continuing minimum payments would cost in time and interest." },
];

const RELATED: ResourceGroup[] = [
  {
    heading: "More Tools",
    links: [
      { href: "/financial-tools/debt-payoff-calculator", label: "Debt Payoff Calculator" },
      { href: "/financial-tools", label: "All Financial Tools" },
    ],
  },
  {
    heading: "Related Services",
    links: [
      { href: "/debt-settlement", label: "Debt Settlement" },
      { href: "/debt-relief", label: "Debt Relief" },
      { href: "/debt-settlement-vs-debt-consolidation", label: "Settlement vs. Consolidation" },
    ],
  },
  {
    heading: "Learn More",
    links: [
      { href: "/blog/is-debt-settlement-a-sin", label: "Is Debt Settlement a Sin?" },
      { href: "/editorial-policy", label: "Our Editorial Standards" },
    ],
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
          __html: JSON.stringify(
            howToJsonLd({
              name: "How to estimate your debt settlement savings",
              description:
                "Use the free WeHelpFinance Debt Settlement Calculator to see a realistic settlement range, program cost, and timeline for your situation.",
              steps: HOWTO_STEPS,
            })
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
            provider: {
              "@type": "Organization",
              name: "WeHelpFinance",
              url: "https://www.wehelpfinance.com",
            },
          }),
        }}
      />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-primary-soft/40 to-background">
        <div className="container-page max-w-4xl py-12 lg:py-16">
          <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/debt-settlement" className="hover:text-primary">Debt Settlement</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Calculator</span>
          </nav>

          <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Free Tool · No Sign-Up
          </span>
          <h1 className="mt-4">Debt Settlement Calculator</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            See what your debt could realistically settle for — with the full cost breakdown,
            monthly deposit, timeline, and an honest comparison against continuing minimum
            payments. Every assumption is visible and adjustable.
          </p>

          <ul className="mt-6 grid gap-2.5 sm:grid-cols-3">
            {[
              "Realistic AFCC-based ranges",
              "Live results as you type",
              "Nothing saved or submitted",
            ].map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-foreground/90">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Calculator ── */}
      <section className="container-page py-10" aria-label="Debt settlement calculator">
        <DebtSettlementCalculator />
      </section>

      <section className="container-page max-w-5xl pb-4">
        <TrustSignals variant="compact" />
      </section>

      {/* ── Educational content ── */}
      <section className="container-page max-w-4xl py-10">
        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
          <h2>What is debt settlement?</h2>
          <p>
            Debt settlement is negotiating with creditors to accept <strong>less than the full
            balance</strong> as payment in full — typically 40–60 cents on the dollar for
            unsecured debts like credit cards, medical bills, and personal loans. Instead of
            paying creditors monthly, you deposit money into a dedicated account you control;
            as it grows, settlements are negotiated one creditor at a time, usually over 24–48
            months. It exists because creditors would rather recover part of a delinquent
            balance than risk collecting nothing after charge-off or bankruptcy.
          </p>

          <h2>Who typically qualifies?</h2>
          <p>
            Settlement fits a specific profile: roughly <strong>$7,500 or more in unsecured
            debt</strong>, genuine financial hardship (job loss, medical event, divorce, income
            drop), accounts that are behind or about to fall behind, and enough steady income to
            fund monthly program deposits. It is <em>not</em> for secured debts — mortgages, auto
            loans — or federal student loans, and it's rarely cost-effective below $7,500 once
            fees are counted.
          </p>
        </div>

        <ProsCons
          pros={[
            "Typically resolves debt for significantly less than the full balance",
            "One affordable monthly deposit instead of juggling multiple creditors",
            "Usually finishes in 24–48 months — far faster than minimum payments",
            "Avoids bankruptcy and its 7–10 year public record",
            "Under the FTC rule, legitimate companies charge fees only AFTER settling each debt",
          ]}
          cons={[
            "Significant credit damage, especially if accounts are current today",
            "Settled accounts stay on your credit report for up to 7 years",
            "Forgiven debt of $600+ may be taxable income (IRS Form 1099-C)",
            "Creditors can continue collection efforts — even lawsuits — during the program",
            "No creditor is legally required to settle; results vary by creditor",
          ]}
        />

        <KeyTakeaway>
          <strong>The honest trade:</strong> settlement exchanges credit damage and some tax
          exposure for a large reduction in what you repay. If your accounts are already 60+
          days behind, most of the credit damage has happened — which is exactly when the math
          tilts toward settling. If your accounts are current and your income is stable, run a
          consolidation loan comparison first.
        </KeyTakeaway>

        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
          <h2>When settlement makes sense — and when it doesn't</h2>
          <p>
            It makes sense when hardship is real, the debt is unsecured and substantial, accounts
            are already delinquent, and you can sustain the monthly deposit. It usually
            <em> doesn't</em> make sense when you can realistically qualify for a{" "}
            <Link href="/personal-loans">consolidation loan</Link> (current accounts, steady
            income, credit still intact), when the debt is under ~$7,500 (a nonprofit debt
            management plan is cheaper), or when protecting your credit score in the near term is
            non-negotiable — say, ahead of a mortgage application.
          </p>

          <h2>Know the rules before you enroll</h2>
          <p>
            Three government resources are worth ten minutes of your time. The{" "}
            <a
              href="https://www.ftc.gov/business-guidance/resources/complying-telemarketing-sales-rule"
              target="_blank"
              rel="noopener noreferrer"
            >
              FTC's Telemarketing Sales Rule
            </a>{" "}
            makes it illegal for debt relief companies to charge fees before they actually settle
            a debt — any company demanding money upfront is your signal to walk away. The{" "}
            <a
              href="https://www.consumerfinance.gov/consumer-tools/debt-collection/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CFPB's debt collection resources
            </a>{" "}
            explain what collectors can and cannot do while you're in a program. And{" "}
            <a
              href="https://www.irs.gov/taxtopics/tc431"
              target="_blank"
              rel="noopener noreferrer"
            >
              IRS Topic 431 — Canceled Debt
            </a>{" "}
            covers when forgiven debt counts as income and how the insolvency exception works.
          </p>
        </div>

        <CommonMistakes
          items={[
            {
              mistake: "Paying large upfront fees before any debt settles",
              reality: "Advance fees for debt settlement are illegal under the FTC's Telemarketing Sales Rule. Legitimate programs collect fees only after each settlement is negotiated and you approve it.",
            },
            {
              mistake: "Enrolling secured debts or federal student loans",
              reality: "Settlement works on unsecured debt. Mortgages and auto loans are backed by collateral creditors can take, and federal student loans have their own separate relief programs.",
            },
            {
              mistake: "Forgetting the tax bill on forgiven debt",
              reality: "A $15,000 reduction can generate a 1099-C and a real tax liability the following April — unless the insolvency exception applies. Plan for it before you settle, not after.",
            },
            {
              mistake: "Choosing settlement when a cheaper option fits",
              reality: "With current accounts and steady income, a consolidation loan often costs less overall and spares your credit. The calculator's recommendation flags this automatically.",
            },
          ]}
        />

        <NextSteps
          steps={[
            { label: "Compare payoff strategies with the Debt Payoff Calculator", href: "/financial-tools/debt-payoff-calculator" },
            { label: "Read settlement vs. consolidation, side by side", href: "/debt-settlement-vs-debt-consolidation" },
            { label: "Speak with a free, no-obligation specialist", href: "/get-help" },
          ]}
        />
      </section>

      {/* ── FAQ (visible + in schema) ── */}
      <FAQ items={FAQS} title="Debt settlement questions, answered" />

      <RelatedResources groups={RELATED} />
      <TrustBox />
    </>
  );
}
