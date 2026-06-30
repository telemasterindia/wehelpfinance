import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, CheckCircle2 } from "lucide-react";
import { CommonMistakes, ComparisonTable, KeyTakeaway, NextSteps, ProcessTimeline, ProsCons, QualificationCriteria, WhoShouldUse } from "@/components/ContentAuthorityBlocks";
import { LeadForm } from "@/components/LeadForm";
import { RelatedResources, PERSONAL_LOANS_RELATED } from "@/components/RelatedResources";
import { TrustBox } from "@/components/TrustBox";
import { TrustSignals } from "@/components/TrustSignals";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/schema";

const CANONICAL = "https://www.wehelpfinance.com/personal-loans";

export const metadata: Metadata = {
  title: "Personal Loans - Compare Options for Debt Consolidation | WeHelpFinance",
  description:
    "A complete guide to personal loans in 2026: how they compare to debt settlement, what credit score you need, typical APR ranges, and qualification criteria. Free specialist consultation.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Personal Loans | WeHelpFinance",
    description: "Compare personal loans to debt settlement and consolidation. Free, no-obligation specialist consultation.",
    url: CANONICAL,
    type: "website",
  },
};

const FAQS = [
  { q: "What is a personal loan used for debt consolidation?", a: "A debt consolidation personal loan is a fixed-rate, fixed-term loan used to pay off multiple debts, leaving one monthly payment." },
  { q: "What credit score do I need to qualify?", a: "Most lenders look for a credit score of 600 to 640 or higher, while the best rates typically require stronger credit." },
  { q: "How is a personal loan different from debt settlement?", a: "A personal loan repays the full balance plus interest. Debt settlement negotiates existing balances down but typically has a larger credit impact." },
  { q: "How long does approval and funding take?", a: "Pre-qualification can happen within minutes. Once formally approved, many loans fund within 1 to 5 business days." },
  { q: "Will applying hurt my credit score?", a: "Pre-qualification is usually a soft credit pull. A formal application typically uses a hard inquiry and can cause a small temporary dip." },
  { q: "Can I get a personal loan with bad credit?", a: "It is possible, but rates can be high enough that a management plan or debt settlement may be more practical." },
];

export default function PersonalLoansPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Personal Loans", path: "/personal-loans" }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd({ name: "Personal Loan Matching Service", description: "Free service connecting consumers with vetted personal loan specialists for debt consolidation and other financing needs.", path: "/personal-loans", serviceType: "Personal Loans" })) }} />

      <section className="bg-gradient-to-b from-primary-soft/40 to-background">
        <div className="container-page grid gap-10 pb-16 pt-12 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-12">
          <div>
            <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">Personal Loans</span>
            </nav>
            <h1 className="mt-4">Personal Loans - Compare Your Options</h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              A personal loan can consolidate high-interest credit card debt into one fixed monthly payment if your credit qualifies. Compare it against debt settlement before you decide.
            </p>
            <ul className="mt-7 space-y-3">
              {["Compare personal loans against debt settlement and consolidation", "Free, confidential consultation - no obligation", "Vetted specialists matched to your credit profile", "Pre-qualification typically does not affect your credit score"].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/debt-settlement-calculator" className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-full border border-primary bg-background px-5 text-sm font-semibold text-primary transition hover:bg-primary-soft">
              <Calculator className="h-4 w-4" aria-hidden="true" />
              Compare against debt settlement savings
            </Link>
          </div>
          <div id="get-help" className="lg:sticky lg:top-24">
            <LeadForm defaultCategory="personal-loans" />
          </div>
        </div>
      </section>

      <section className="container-page max-w-5xl py-8">
        <TrustSignals variant="compact" />
      </section>

      <section className="container-page max-w-4xl py-8">
        <Content>
          <h2>What a Debt Consolidation Personal Loan Actually Does</h2>
          <p>A personal loan for debt consolidation is a lump-sum loan, usually unsecured, that pays off multiple existing debts. Unlike settlement, it does not reduce what you owe; it restructures how you pay it.</p>
          <KeyTakeaway><strong>In short:</strong> a personal loan works best when your credit qualifies for a meaningfully lower rate than your current cards. If your score has already dropped below roughly 600, settlement or a management plan may be more realistic.</KeyTakeaway>
          <h2>Comparing Your Options</h2>
        </Content>
        <ComparisonTable title="Personal Loan vs. Debt Settlement vs. Balance Transfer" columns={["Personal Loan", "Debt Settlement", "Balance Transfer Card"]} rows={[
          { label: "What it does", values: ["New loan pays off old debts", "Negotiates to pay less than owed", "Moves balances to a low/0% APR card"] },
          { label: "Credit score needed", values: ["Typically 600-640+", "None - works with poor credit", "Typically 670+"] },
          { label: "Repays full balance?", values: ["Yes, plus interest", "No - reduced balance", "Yes, plus interest after intro period"] },
          { label: "Credit impact", values: ["Minimal if current", "Significant, temporary", "Minimal if paid in intro period"] },
          { label: "Typical timeline", values: ["2-7 years", "24-48 months", "12-21 month intro period"] },
          { label: "Best for", values: ["Good credit, fixed payment", "Genuine hardship", "Good credit, fast payoff"] },
        ]} />
        <Content><h2>How the Process Works, Step by Step</h2></Content>
        <ProcessTimeline steps={[
          { label: "Free consultation & pre-qualification", timeframe: "Day 1", description: "A specialist reviews income, debt, and credit profile. Pre-qualification usually uses a soft credit check." },
          { label: "Compare offers", timeframe: "Same day", description: "You review rate, term, and monthly payment options." },
          { label: "Formal application", timeframe: "Day 1-2", description: "A formal application usually involves a hard credit inquiry." },
          { label: "Approval & funding", timeframe: "1-5 business days", description: "Funds are deposited to you or sent directly to creditors." },
          { label: "Repayment", timeframe: "2-7 years", description: "You make one fixed monthly payment for the loan term." },
        ]} />
        <Content><h2>Advantages and Trade-offs</h2></Content>
        <ProsCons pros={["Repays your debt in full", "Fixed monthly payment helps budgeting", "Pre-qualification usually does not affect credit", "Can improve credit utilization over time"]} cons={["Requires decent credit", "You repay 100% plus interest", "Formal application can create a hard inquiry", "High APR can erase the benefit"]} />
        <Content><h2>Who Should Consider a Personal Loan - and Who Should Not</h2></Content>
        <WhoShouldUse shouldUse={["Your credit score is 600 or higher", "Your accounts are current", "You have stable income", "The offered APR is meaningfully lower than your card APRs"]} shouldAvoid={["You are already 60+ days behind", "Your credit score is below 580", "You need the loan only to make minimum payments elsewhere", "The only rates offered are near or above current card APRs"]} />
        <Content><h2>Qualification Criteria</h2></Content>
        <QualificationCriteria items={[
          { label: "Credit score around 600 or higher", detail: "Higher scores access meaningfully lower rates." },
          { label: "Stable, verifiable income", detail: "Lenders verify income to support the new payment." },
          { label: "Reasonable debt-to-income ratio", detail: "Many lenders prefer a DTI under roughly 40-45%." },
          { label: "Current accounts", detail: "Active delinquencies reduce approval odds and increase rates." },
        ]} />
        <Content><h2>Common Mistakes to Avoid</h2></Content>
        <CommonMistakes items={[
          { mistake: "Using paid-off cards again after consolidation", reality: "This can create more debt than before." },
          { mistake: "Comparing only the monthly payment", reality: "Lower payments over longer terms can cost more total interest." },
          { mistake: "Submitting many formal applications", reality: "Use soft-check pre-qualification before hard inquiries." },
          { mistake: "Assuming pre-qualification guarantees approval", reality: "Final approval depends on underwriting and income verification." },
        ]} />
        <Content>
          <h2>Your Rights as a Borrower</h2>
          <p>Lenders are required under the Truth in Lending Act to disclose APR, finance charges, and repayment schedule. The <a href="https://www.consumerfinance.gov/consumer-tools/personal-loans/" target="_blank" rel="noopener noreferrer">CFPB personal loans guide</a> can help you compare offers.</p>
        </Content>
        <NextSteps steps={[{ label: "Compare debt settlement vs. personal loan savings", href: "/debt-settlement-calculator" }, { label: "Read about debt relief if your credit does not qualify", href: "/debt-relief" }, { label: "Speak with a free, no-obligation specialist", href: "#get-help" }]} />
      </section>

      <FaqBlock />
      <RelatedResources groups={PERSONAL_LOANS_RELATED} />
      <TrustBox />
    </>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4 text-foreground/90 [&_a]:text-primary [&_a]:underline [&_h2]:mt-8 [&_p]:leading-relaxed">{children}</div>;
}

function FaqBlock() {
  return (
    <section className="container-page max-w-4xl pb-10">
      <h2 className="mb-6">Frequently Asked Questions</h2>
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
        {FAQS.map((faq) => (
          <details key={faq.q} className="group bg-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-medium text-foreground transition-colors hover:bg-muted/30">
              {faq.q}
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" aria-hidden="true" />
            </summary>
            <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{faq.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
