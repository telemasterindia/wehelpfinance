import type { Metadata } from "next";
import Link from "next/link";
import { DebtSolutionsComparison } from "@/components/tools/DebtSolutionsComparison";
import { TrustSignals } from "@/components/TrustSignals";
import { TrustBox } from "@/components/TrustBox";
import { FAQ } from "@/components/FAQ";
import { RelatedResources } from "@/components/RelatedResources";
import type { ResourceGroup } from "@/components/RelatedResources";
import { KeyTakeaway, ComparisonTable, CommonMistakes, NextSteps } from "@/components/ContentAuthorityBlocks";
import { faqJsonLd, breadcrumbJsonLd, howToJsonLd } from "@/lib/schema";
import { CheckCircle2 } from "lucide-react";

const CANONICAL = "https://www.wehelpfinance.com/financial-tools/debt-solutions-comparison";

export const metadata: Metadata = {
  title: "Debt Solutions Comparison Calculator — Settlement vs. Consolidation vs. DMP | WeHelpFinance",
  description:
    "Compare all your debt options side by side: minimum payments, debt settlement, consolidation loans, debt management plans, and bankruptcy basics — with honest numbers for your exact situation. Free, no sign-up.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Compare Every Debt Solution, Side by Side | WeHelpFinance",
    description:
      "One honest table: payment, timeline, total cost, credit and mortgage impact for five debt paths — computed from your numbers.",
    url: CANONICAL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Solutions Comparison | WeHelpFinance",
    description: "Settlement vs. consolidation vs. DMP vs. minimums — your numbers, one table, no sales pitch.",
  },
};

const FAQS = [
  {
    q: "Which debt relief option is best?",
    a: "There is no universal best — only a best fit for a specific situation. Consolidation usually wins when credit is intact and accounts are current; a DMP wins when interest is the problem but the balance is payable; settlement wins when hardship is real and accounts are already behind; staying on minimums wins only when the debt is small and shrinking. This calculator applies those trade-offs to your actual numbers instead of a slogan.",
  },
  {
    q: "How is the recommendation decided?",
    a: "Purely from your inputs and stated goal. The engine computes all four structured paths with documented assumptions, filters out options your credit, delinquency status, or payment ability would realistically disqualify, then ranks the remainder against your goal — lowest payment, fastest payoff, mortgage readiness, or avoiding bankruptcy. Bankruptcy is never recommended; it appears for education only.",
  },
  {
    q: "What's the difference between debt settlement and a debt management plan?",
    a: "A DMP repays 100% of what you owe, but at reduced interest (creditors typically cut rates to around 8% inside nonprofit plans) over 3–5 years — gentle on credit, no tax consequences. Settlement pays less than the full balance — often 40–60% — but requires delinquency, damages credit meaningfully, and forgiven amounts of $600+ can be taxable. One restructures; the other reduces.",
  },
  {
    q: "Will a consolidation loan lower my total cost?",
    a: "Usually yes, if you qualify well. Moving a 22%-APR balance to a 10–14% fixed loan can save thousands and sets a real end date. Two honest caveats: fair-or-worse credit prices the loan high enough that savings shrink or vanish, and the freed-up cards can silently refill — the loan restructures the debt, it doesn't shrink it.",
  },
  {
    q: "When does bankruptcy actually make sense?",
    a: "That's a legal determination this calculator deliberately won't make. Attorneys typically see it fit when lawsuits or garnishments are already in motion, debts are far beyond any realistic repayment, or a home needs protecting while arrears are cured. Chapter 7 discharges qualifying unsecured debt in months (report mark up to 10 years); Chapter 13 is a 3–5 year court plan (up to 7 years). If you're weighing it, a consultation with a bankruptcy attorney is the right next step.",
  },
  {
    q: "Is anything I type saved or sent anywhere?",
    a: "No. The entire comparison runs in your browser — no account, no email, no credit pull, nothing stored or submitted. Analytics receive only anonymous metadata like which goal was selected, never your income or debt amounts.",
  },
];

const HOWTO_STEPS = [
  { name: "Describe your debt", text: "Total unsecured debt, number of creditors, your current monthly payments, and how far behind you are — delinquency status changes which options realistically fit." },
  { name: "Add income and credit range", text: "Gross monthly income and your credit score range power eligibility for consolidation and affordability for every path." },
  { name: "Pick your goal", text: "Lower payments, debt-free fastest, mortgage eligibility, or avoiding bankruptcy — the recommendation ranks options against what you said matters." },
  { name: "Read the table like a skeptic", text: "Every path shows payment, timeline, total cost, credit and mortgage impact, and whether it even fits your inputs — including the trade-offs of the recommended one." },
];

const RELATED: ResourceGroup[] = [
  {
    heading: "More Tools",
    links: [
      { href: "/debt-settlement-calculator", label: "Debt Settlement Calculator" },
      { href: "/financial-tools/dti-calculator", label: "DTI Calculator" },
      { href: "/financial-tools/debt-payoff-calculator", label: "Debt Payoff Calculator" },
    ],
  },
  {
    heading: "Related Services",
    links: [
      { href: "/debt-relief", label: "Debt Relief" },
      { href: "/debt-consolidation", label: "Debt Consolidation" },
      { href: "/debt-settlement", label: "Debt Settlement" },
    ],
  },
  {
    heading: "Learn More",
    links: [
      { href: "/debt-settlement-vs-debt-consolidation", label: "Settlement vs. Consolidation" },
      { href: "/debt-settlement-vs-bankruptcy", label: "Settlement vs. Bankruptcy" },
      { href: "/editorial-policy", label: "Our Editorial Standards" },
    ],
  },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "https://www.wehelpfinance.com/" },
              { name: "Financial Tools", path: "https://www.wehelpfinance.com/financial-tools" },
              { name: "Debt Solutions Comparison", path: CANONICAL },
            ])
          ),
        }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            howToJsonLd({
              name: "How to compare your debt relief options",
              description:
                "Use the free WeHelpFinance Debt Solutions Comparison Calculator to see settlement, consolidation, a DMP, and minimum payments side by side for your exact numbers.",
              steps: HOWTO_STEPS,
            })
          ),
        }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Debt Solutions Comparison Calculator",
            url: CANONICAL,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            provider: { "@type": "Organization", name: "WeHelpFinance", url: "https://www.wehelpfinance.com" },
          }),
        }} />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-primary-soft/40 to-background">
        <div className="container-page max-w-4xl py-12 lg:py-16">
          <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/financial-tools" className="hover:text-primary">Financial Tools</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Debt Solutions Comparison</span>
          </nav>

          <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Free Tool · No Sign-Up
          </span>
          <h1 className="mt-4">Debt Solutions Comparison Calculator</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Minimum payments, settlement, a consolidation loan, a debt management plan — and the
            bankruptcy facts nobody explains calmly. One honest table, computed from your numbers,
            with the trade-offs of every path including the recommended one.
          </p>

          <ul className="mt-6 grid gap-2.5 sm:grid-cols-3">
            {[
              "All five paths, one table",
              "Goal-based, never sales-based",
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
      <section className="container-page py-10" aria-label="Debt solutions comparison calculator">
        <DebtSolutionsComparison />
      </section>

      <section className="container-page max-w-5xl pb-4">
        <TrustSignals variant="compact" />
      </section>

      {/* ── Educational content ── */}
      <section className="container-page max-w-4xl py-10">
        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
          <h2>How to compare debt options honestly</h2>
          <p>
            Every debt solution trades the same four currencies: <strong>monthly payment, time,
            total cost, and credit</strong>. Marketing hides whichever currency its product spends.
            Settlement ads skip the credit column; loan ads skip the eligibility column; "just pay
            minimums" advice skips the decade of interest. A fair comparison puts all four on the
            table at once — which is exactly what the calculator above does with your numbers.
          </p>

          <h2>The four structured paths in one paragraph each</h2>
          <p>
            <strong>Minimum payments</strong> cost nothing to start and nothing in credit — and the
            most of anything in interest and years; at 2026's ~22% average APR, a five-figure
            balance routinely takes a decade-plus. <strong>A consolidation loan</strong> swaps many
            payments for one fixed one at a lower rate; it protects (often improves) credit, but it
            requires qualifying and it restructures debt rather than reducing it.{" "}
            <strong>A debt management plan</strong> keeps the full balance but cuts interest to
            roughly 8% inside a nonprofit plan over 3–5 years — the gentlest structured option on
            credit, with the least flexibility. <strong>Debt settlement</strong> is the only path
            that reduces principal — typically to 40–60% of balances — at the price of real credit
            damage, possible taxes on forgiven amounts, and creditors who may still pursue
            collection mid-program.
          </p>
        </div>

        <KeyTakeaway>
          <strong>The pattern behind every good decision here:</strong> if you can qualify and pay,
          restructure (loan or DMP). If you genuinely can't pay, reduce (settlement). If even
          reduction can't work, that's a legal conversation — with an attorney, not an ad. The
          worst outcomes come from picking a path built for a different situation than yours.
        </KeyTakeaway>

        <ComparisonTable
          title="Chapter 7 vs. Chapter 13 — the education nobody sells"
          columns={["Chapter 7", "Chapter 13"]}
          rows={[
            { label: "What it is", values: ["Liquidation — qualifying unsecured debt discharged", "Court-supervised 3–5 year repayment plan"] },
            { label: "Typical duration", values: ["About 3–6 months to discharge", "3–5 years of plan payments"] },
            { label: "Who it typically fits", values: ["Income below the means test, little non-exempt property", "Steady income, assets to protect, arrears to cure"] },
            { label: "Credit report", values: ["Up to 10 years", "Up to 7 years"] },
            { label: "Long-term impact", values: ["Deep initial drop; rebuilding can begin immediately after discharge", "Similar drop; on-time plan payments build history during the case"] },
          ]}
        />

        <CommonMistakes
          items={[
            {
              mistake: "Choosing settlement while every account is still current",
              reality: "Settlement generally requires delinquency before creditors negotiate — starting from clean accounts means volunteering for the largest possible credit drop. Current + steady income usually points to a loan or DMP first.",
            },
            {
              mistake: "Taking a consolidation loan and keeping the cards active",
              reality: "The loan clears the balances; the habits refill them. A year later, many people carry the loan and new card debt. Freeze or close the cards, or the math resets against you.",
            },
            {
              mistake: "Judging options only by the monthly payment",
              reality: "The lowest payment is often the most expensive path in total. Compare total paid and time-to-zero alongside the payment — the table above shows all three on purpose.",
            },
            {
              mistake: "Treating bankruptcy as either unthinkable or a quick fix",
              reality: "It's neither — it's a legal tool with means tests, asset rules, and the longest credit mark of any option. If it's on your mind, the productive move is one consultation with a bankruptcy attorney, not months of dread.",
            },
          ]}
        />

        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
          <h2>Know the rules that protect you</h2>
          <p>
            Three references are worth ten minutes before choosing anything. The{" "}
            <a href="https://www.ftc.gov/business-guidance/resources/complying-telemarketing-sales-rule"
              target="_blank" rel="noopener noreferrer">FTC's Telemarketing Sales Rule</a>{" "}
            makes advance fees for debt settlement illegal — any company charging before it settles
            is your signal to leave. The{" "}
            <a href="https://www.consumerfinance.gov/consumer-tools/debt-collection/"
              target="_blank" rel="noopener noreferrer">CFPB's debt collection resources</a>{" "}
            explain what collectors can and can't do while you're deciding. And the federal courts'
            own{" "}
            <a href="https://www.uscourts.gov/services-forms/bankruptcy/bankruptcy-basics"
              target="_blank" rel="noopener noreferrer">Bankruptcy Basics</a>{" "}
            is the calm, sales-free explanation of Chapters 7 and 13 that this page's education is
            aligned with.
          </p>
        </div>

        <NextSteps
          steps={[
            { label: "Estimate settlement numbers in detail", href: "/debt-settlement-calculator" },
            { label: "Check what a mortgage lender would see", href: "/financial-tools/dti-calculator" },
            { label: "Talk it through with a free specialist", href: "/get-help" },
          ]}
        />
      </section>

      <FAQ items={FAQS} title="Comparing debt options, answered" />

      <RelatedResources groups={RELATED} />
      <TrustBox />
    </>
  );
}
