import type { Metadata } from "next";
import Link from "next/link";
import { MortgageRefinanceCalculator } from "@/components/tools/MortgageRefinanceCalculator";
import { TrustSignals } from "@/components/TrustSignals";
import { TrustBox } from "@/components/TrustBox";
import { FAQ } from "@/components/FAQ";
import { RelatedResources } from "@/components/RelatedResources";
import type { ResourceGroup } from "@/components/RelatedResources";
import { KeyTakeaway, CommonMistakes, NextSteps } from "@/components/ContentAuthorityBlocks";
import { faqJsonLd, breadcrumbJsonLd, howToJsonLd } from "@/lib/schema";
import { CheckCircle2 } from "lucide-react";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

const CANONICAL =
  "https://www.wehelpfinance.com/financial-tools/mortgage-refinance-calculator";

export const metadata: Metadata = {
  title:
    "Mortgage Refinance Calculator — Savings, Break-Even & DTI Impact | WeHelpFinance",
  description:
    "Free mortgage refinance calculator. See your new payment, monthly and lifetime savings, break-even on closing costs, LTV, and your DTI before and after — the numbers lenders actually weigh. No sign-up.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Free Mortgage Refinance Savings Calculator | WeHelpFinance",
    description:
      "New payment, break-even month, lifetime cost, and DTI impact — the honest refinance math, including when staying put wins. Free, private, no sign-up.",
    url: CANONICAL,
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE.url,
        width: 1200,
        height: 630,
        alt: "WeHelpFinance — Financial Help Made Human",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mortgage Refinance Calculator | WeHelpFinance",
    description:
      "Savings, break-even, LTV, and DTI impact — the refinance math lenders actually use, in 2 minutes.",
    images: [DEFAULT_OG_IMAGE.url],
  },
};

const FAQS = [
  {
    q: "When is refinancing my mortgage actually worth it?",
    a: "Forget the old \"refinance when rates drop 1%\" rule — the real test is break-even. Divide your closing costs by your monthly savings: that's how many months until the refinance has paid for itself. If you'll keep the home comfortably past that month, the savings are real; if you might sell or refinance again before it, you're paying fees for nothing. Then check the lifetime number too, because a lower payment on a restarted 30-year clock can still cost more in total than finishing your current loan.",
  },
  {
    q: "How much are refinance closing costs?",
    a: "Typically about 2–5% of the loan amount — appraisal, title, origination, and recording fees — so roughly $6,000–$15,000 on a $300,000 balance. \"No-closing-cost\" refinances don't eliminate these costs; they move them into a higher rate or add them to your balance, which usually costs more over time. Always compare the official Loan Estimates line by line, and note that lender credits and discount points can shift the same loan's price in either direction.",
  },
  {
    q: "Does refinancing hurt my credit score?",
    a: "Briefly and modestly. The application adds a hard inquiry, and the new loan resets that account's age — together usually a small dip for a few months. Rate-shopping is protected: multiple mortgage inquiries within a short window (typically 14–45 days depending on the scoring model) count as one. On-time payments on the new loan rebuild the history quickly. The bigger credit consideration is usually the other direction: your score helps set the rate you're offered.",
  },
  {
    q: "Should I refinance into a 15-year or another 30-year loan?",
    a: "It's a cash-flow vs. total-cost trade. A 15-year loan carries a lower rate and slashes lifetime interest, but the payment is substantially higher. A new 30-year loan minimizes the payment but restarts the amortization clock — and if you're several years into your current loan, that reset can erase the rate savings entirely. A middle path many overlook: take the 30-year for flexibility and voluntarily pay the 15-year amount; you keep the escape hatch without signing up for the bigger obligation.",
  },
  {
    q: "What credit score and DTI do I need to refinance?",
    a: "Conventional refinances generally look for scores around 620+ (best pricing typically starts near 740) and back-end DTI under roughly 45–50% depending on the program and compensating factors; FHA can stretch further on both. Lenders weigh credit, DTI, and equity (LTV) together — a strong score doesn't offset a stretched DTI. That's why this calculator shows your DTI before and after: if debt payments are the blocker, reducing them first often does more for approval odds than anything else.",
  },
  {
    q: "What is LTV and why does 80% matter?",
    a: "Loan-to-value is your mortgage balance divided by your home's value — the lender's measure of your equity cushion. The 80% line matters because at or below it, conventional loans typically require no private mortgage insurance and pricing improves; between 80–97%, PMI and pricing adjustments apply and programs narrow. If home values in your area have risen since you bought, your LTV may be better than you think — sometimes enough to drop PMI, which is a savings source refinance calculators that skip LTV never show you.",
  },
];

const HOWTO_STEPS = [
  {
    name: "Enter your current loan",
    text: "Balance, rate, monthly principal & interest, and the years remaining — plus your estimated home value.",
  },
  {
    name: "Enter the refinance you're weighing",
    text: "The new rate you're seeing quoted, the term you'd choose, and estimated closing costs (typically 2–5% of the balance).",
  },
  {
    name: "Add the numbers lenders check",
    text: "Gross monthly income, other monthly debt payments, and your credit range — this powers the DTI and readiness view.",
  },
  {
    name: "Read the honest math",
    text: "New payment, monthly and lifetime savings, break-even month, LTV, DTI before and after — and the ranked options worth exploring, including when staying put wins.",
  },
];

const RELATED: ResourceGroup[] = [
  {
    heading: "More Tools",
    links: [
      { href: "/financial-tools/dti-calculator", label: "DTI Calculator" },
      { href: "/personal-loans", label: "Personal Loans" },
      { href: "/financial-tools/debt-solutions-comparison", label: "Debt Solutions Comparison" },
      { href: "/financial-tools", label: "All Financial Tools" },
    ],
  },
  {
    heading: "Related Services",
    links: [
      { href: "/debt-consolidation", label: "Debt Consolidation" },
      { href: "/debt-relief", label: "Debt Relief" },
      { href: "/personal-loans", label: "Personal Loans" },
    ],
  },
  {
    heading: "Learn More",
    links: [
      { href: "/debt-settlement-vs-debt-consolidation", label: "Settlement vs. Consolidation" },
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
              { name: "Financial Tools", path: "https://www.wehelpfinance.com/financial-tools" },
              { name: "Mortgage Refinance Calculator", path: CANONICAL },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            howToJsonLd({
              name: "How to estimate mortgage refinance savings",
              description:
                "Use the free WeHelpFinance Mortgage Refinance Calculator to see your new payment, break-even month, lifetime savings, LTV, and DTI impact.",
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
            name: "Mortgage Refinance Savings Calculator",
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
            <Link href="/financial-tools" className="hover:text-primary">Financial Tools</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Mortgage Refinance Calculator</span>
          </nav>

          <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Free Tool · No Sign-Up
          </span>
          <h1 className="mt-4">Mortgage Refinance Savings Calculator</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            The honest refinance math: your new payment, the break-even month on closing
            costs, the true lifetime cost — and your DTI before and after, because lenders
            weigh your whole picture, not just the rate.
          </p>

          <ul className="mt-6 grid gap-2.5 sm:grid-cols-3">
            {[
              "Break-even & lifetime cost",
              "DTI and LTV, lender-style",
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
      <section className="container-page py-10" aria-label="Mortgage refinance calculator">
        <MortgageRefinanceCalculator />
      </section>

      <section className="container-page max-w-5xl pb-4">
        <TrustSignals variant="compact" />
      </section>

      {/* ── Educational content ── */}
      <section className="container-page max-w-4xl py-10">
        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
          <h2>Break-even: the only refinance rule that matters</h2>
          <p>
            Every refinance is a purchase — you&rsquo;re buying a lower rate, and closing costs
            are the price. <strong>Break-even</strong> is when the purchase pays for itself:
            closing costs divided by monthly savings. Save $210/month on $6,300 of costs and
            you break even at month 30 — keep the home past that and every month is profit;
            sell or refinance again before it and you paid fees for nothing. That&rsquo;s why
            the honest question isn&rsquo;t &ldquo;did rates drop enough?&rdquo; but
            &ldquo;will I still be in this loan when it starts paying me back?&rdquo;
          </p>

          <h2>The term-reset trap</h2>
          <p>
            Here&rsquo;s the math most refinance ads skip: if you&rsquo;re six years into a
            30-year loan and refinance into a fresh 30, you&rsquo;ve turned 24 remaining
            years into 30 — and those six years of interest you already paid don&rsquo;t come
            back. The payment drops, the <em>total</em> often rises. This calculator shows the
            lifetime figure next to the monthly one for exactly this reason, and it will tell
            you plainly when a lower payment costs more. The workaround if cash flow allows:
            refinance into the shorter term, or take the long term and voluntarily pay the
            shorter-term amount.
          </p>

          <h2>Why your DTI decides more than the rate does</h2>
          <p>
            Mortgage underwriting weighs <strong>both</strong> credit and debt-to-income —
            a strong score with a stretched DTI still hits program ceilings (commonly around
            45–50% back-end). The refinance itself moves your DTI only as much as the payment
            changes; the bigger lever is usually the <em>other</em> debt payments in the
            numerator. That&rsquo;s the quiet connection between refinancing and debt relief:
            consolidating or resolving unsecured balances first can drop your DTI enough to
            unlock the refinance — and the better pricing — that was out of reach. The options
            panel above surfaces those paths only when your numbers actually fit them.
          </p>

          <h2>Equity, LTV, and the 80% line</h2>
          <p>
            Loan-to-value is your balance divided by your home&rsquo;s value, and 80% is the
            line where conventional loans typically shed PMI and pricing improves. If values
            in your area have climbed since you bought, your LTV may have improved without
            you doing anything — occasionally enough that a refinance (or even just a PMI
            removal request on your current loan) captures savings this tool&rsquo;s
            payment math alone won&rsquo;t show. Above 97%, and especially above 100%,
            standard refinancing narrows sharply until equity recovers — a waiting game, not
            a dead end.
          </p>
        </div>

        <KeyTakeaway>
          <strong>A lower payment is not the same as a cheaper loan.</strong> Judge every
          refinance on three numbers together: the monthly savings, the break-even month, and
          the lifetime cost including closing costs. When all three agree, the decision is
          easy — and when they disagree, this calculator tells you which one is lying to you.
        </KeyTakeaway>

        <CommonMistakes
          items={[
            {
              mistake: "Comparing payments across different remaining terms",
              reality:
                "A new 30-year payment will almost always beat your 24-years-left payment — that's the clock, not the rate. Compare lifetime totals, or compare against the same payoff date.",
            },
            {
              mistake: "Treating \"no-closing-cost\" as free",
              reality:
                "The costs are moved into the rate or the balance, not removed. Over a full term, the lender-credit version usually costs more — it only wins if you'll exit the loan early.",
            },
            {
              mistake: "Entering the full escrow payment as your P&I",
              reality:
                "Taxes and insurance continue whether you refinance or not. Including them inflates your \"savings\" with money the refinance doesn't touch — this tool warns you when the payment looks escrow-inflated.",
            },
            {
              mistake: "Serial refinancing every time rates dip",
              reality:
                "Each refinance restarts the clock and adds closing costs. Two 'good' refinances back-to-back can cost more than one patient one — check whether you broke even on the last set of fees before paying the next.",
            },
          ]}
        />

        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
          <h2>Authoritative references</h2>
          <p>
            The CFPB&rsquo;s{" "}
            <a
              href="https://www.consumerfinance.gov/owning-a-home/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Owning a Home
            </a>{" "}
            resource center explains Loan Estimates and how to comparison-shop lenders line by
            line. For where rates actually are this week, Freddie Mac&rsquo;s{" "}
            <a
              href="https://www.freddiemac.com/pmms"
              target="_blank"
              rel="noopener noreferrer"
            >
              Primary Mortgage Market Survey
            </a>{" "}
            is the industry benchmark. And because DTI is half the approval story, the
            CFPB&rsquo;s{" "}
            <a
              href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/"
              target="_blank"
              rel="noopener noreferrer"
            >
              debt-to-income explainer
            </a>{" "}
            covers what counts in the ratio lenders apply to your file.
          </p>
        </div>

        <NextSteps
          steps={[
            { label: "Check your full DTI the way lenders compute it", href: "/financial-tools/dti-calculator" },
            { label: "See if consolidating debt would move your DTI", href: "/financial-tools/personal-loan-calculator" },
            { label: "Talk it through with a free specialist", href: "/get-help" },
          ]}
        />
      </section>

      {/* ── FAQ (visible + in schema) ── */}
      <FAQ items={FAQS} title="Refinance questions, answered" />

      <RelatedResources groups={RELATED} />
      <TrustBox />
    </>
  );
}
