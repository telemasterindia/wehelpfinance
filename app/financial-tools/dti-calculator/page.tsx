import type { Metadata } from "next";
import Link from "next/link";
import { DtiCalculator } from "@/components/tools/DtiCalculator";
import { TrustSignals } from "@/components/TrustSignals";
import { TrustBox } from "@/components/TrustBox";
import { FAQ } from "@/components/FAQ";
import { RelatedResources } from "@/components/RelatedResources";
import type { ResourceGroup } from "@/components/RelatedResources";
import { KeyTakeaway, CommonMistakes, NextSteps } from "@/components/ContentAuthorityBlocks";
import { faqJsonLd, breadcrumbJsonLd, howToJsonLd } from "@/lib/schema";
import { CheckCircle2 } from "lucide-react";

const CANONICAL = "https://www.wehelpfinance.com/financial-tools/dti-calculator";

export const metadata: Metadata = {
  title: "Debt-to-Income (DTI) Calculator — Mortgage & Loan Check | WeHelpFinance",
  description:
    "Free DTI calculator. Get your front-end and back-end debt-to-income ratio, see how lenders judge it (FHA, VA, conventional), and exactly how much debt to pay off to qualify. No sign-up.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Free Debt-to-Income (DTI) Calculator | WeHelpFinance",
    description:
      "Check your DTI the way lenders do — with dollar-level guidance on what it takes to qualify. Free, private, no sign-up.",
    url: CANONICAL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DTI Calculator | WeHelpFinance",
    description: "Your debt-to-income ratio, banded and benchmarked — in 2 minutes, no sign-up.",
  },
};

const FAQS = [
  {
    q: "What is a good debt-to-income ratio?",
    a: "Under 36% is the classic healthy benchmark (the \"36\" in the 28/36 rule), and under 20% is excellent. Between 36% and 43% you're in workable-but-stretched territory — approvals get more selective and pricing worsens. Above 43%, mainstream options narrow quickly, and at 50%+ debt payments are consuming half of gross income, which is hardship-level.",
  },
  {
    q: "What's the difference between front-end and back-end DTI?",
    a: "Front-end (the housing ratio) is your housing payment alone divided by gross monthly income. Back-end (the total debt ratio) adds every other monthly debt obligation — auto, student, card minimums, support payments — on top of housing. When anyone says \"your DTI,\" they almost always mean back-end. Lenders that use both typically want front-end under 28–31% and back-end under 36–45% depending on the program.",
  },
  {
    q: "What DTI do I need for a mortgage or refinance?",
    a: "Conventional loans (Fannie Mae/Freddie Mac) typically cap at 45%, stretching to 50% with strong compensating factors through automated underwriting. FHA benchmarks are 31/43, extendable to 46.9/56.9 with TOTAL Scorecard approval. VA uses 41% as a guideline, not a cap — residual income is the controlling test. Use this calculator's Mortgage mode: it swaps your current rent for the proposed payment, exactly how a lender computes it.",
  },
  {
    q: "Do utilities and insurance count in DTI?",
    a: "No. DTI counts contractual debt obligations only: housing payment, auto loans and leases, student loans, credit card minimums, personal loans, and support payments. Utilities, groceries, phone, streaming, non-escrowed insurance, income taxes, and 401(k) contributions are excluded — even though they're real expenses. That's why a \"fine\" DTI can still feel like a tight budget.",
  },
  {
    q: "How can I lower my DTI the fastest?",
    a: "Eliminate an entire monthly payment — that's the lever. Paying a card's balance down by half barely moves DTI because the minimum payment shrinks slowly, but paying one debt to zero deletes its whole payment from the numerator. Settlement and consolidation both work by this mechanism: fewer or smaller required monthly payments. Adding documentable gross income moves the denominator, but income takes longer to change than debt.",
  },
  {
    q: "Is DTI the same as credit utilization?",
    a: "No — they measure different things in different systems. DTI compares monthly payments to income and drives loan qualification; it's not in your credit score at all. Credit utilization compares card balances to card limits and is a major credit-score factor. You can have great utilization and terrible DTI, or the reverse. Lenders look at both, through different lenses.",
  },
];

const HOWTO_STEPS = [
  { name: "Choose your check", text: "Pick 'My current DTI' for where you stand today, or 'Mortgage / refinance' to compute it the way a lender underwrites a new loan — proposed payment in, current rent out." },
  { name: "Enter your income", text: "Gross (pre-tax) income, monthly or annual — the toggle handles the conversion. Add a co-borrower's income if you'll apply together." },
  { name: "Add housing and debts", text: "Your housing payment plus monthly debt obligations: auto, student loans, card minimums, personal loans, support payments. Skip utilities and groceries — lenders do." },
  { name: "Read your bands and gaps", text: "See your front-end and back-end ratios, how each lending program reads them, and the exact dollar reduction (or income increase) needed to reach 36%, 43%, or 45%." },
];

const RELATED: ResourceGroup[] = [
  {
    heading: "More Tools",
    links: [
      { href: "/financial-tools/debt-payoff-calculator", label: "Debt Payoff Calculator" },
      { href: "/debt-settlement-calculator", label: "Debt Settlement Calculator" },
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
              { name: "DTI Calculator", path: CANONICAL },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            howToJsonLd({
              name: "How to check your debt-to-income ratio",
              description:
                "Use the free WeHelpFinance DTI Calculator to compute your front-end and back-end ratios and see exactly what it takes to qualify.",
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
            name: "Debt-to-Income (DTI) Calculator",
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
            <span className="text-foreground">DTI Calculator</span>
          </nav>

          <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Free Tool · No Sign-Up
          </span>
          <h1 className="mt-4">Debt-to-Income (DTI) Calculator</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Get your front-end and back-end ratios, see how every major lending program reads
            them, and the exact dollars of monthly debt to eliminate — computed the way lenders
            actually compute it.
          </p>

          <ul className="mt-6 grid gap-2.5 sm:grid-cols-3">
            {[
              "Lender-accurate mortgage mode",
              "Live what-if scenarios",
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
      <section className="container-page py-10" aria-label="Debt-to-income calculator">
        <DtiCalculator />
      </section>

      <section className="container-page max-w-5xl pb-4">
        <TrustSignals variant="compact" />
      </section>

      {/* ── Educational content ── */}
      <section className="container-page max-w-4xl py-10">
        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
          <h2>What is a debt-to-income ratio?</h2>
          <p>
            DTI is your monthly debt payments divided by your <strong>gross</strong> (pre-tax)
            monthly income. It comes in two flavors: <strong>front-end</strong> counts housing
            alone; <strong>back-end</strong> counts housing plus every other contractual debt —
            auto, student loans, card minimums, personal loans, support payments. What it
            deliberately ignores: utilities, groceries, phone, insurance, taxes. DTI isn't a
            budget — it's a lender's capacity gauge, and it only counts obligations a lender
            can see on paper.
          </p>

          <h2>Why lenders use it</h2>
          <p>
            Credit scores measure <em>willingness</em> to repay — your history of doing it. DTI
            measures <em>capacity</em> — whether the math of your income can absorb another
            payment. Both gates must open. The famous 43% line comes from the CFPB's original
            Qualified Mortgage rule; the 2021 rule replaced that hard cap with a price-based
            test, but 43% survives as the reference line underwriters still reach for. It's a
            benchmark, not a law.
          </p>

          <h2>What DTI do lenders actually require?</h2>
          <p>
            The classic <strong>28/36 rule</strong> is the healthy planning target. Conventional
            programs (Fannie Mae, Freddie Mac) typically ceiling at <strong>45%</strong>,
            stretching to 50% only with automated-underwriting strengths. <strong>FHA</strong>{" "}
            benchmarks 31/43 and can extend to 46.9/56.9 with TOTAL Scorecard approval — the
            most DTI-tolerant mainstream path. <strong>VA</strong> treats 41% as a guideline and
            decides on residual income instead. The calculator's qualification snapshot applies
            all of these to your exact number.
          </p>

          <h2>How to lower your DTI — in dollars, not advice-speak</h2>
          <p>
            Only two things move the ratio: the payments (numerator) or the income
            (denominator). The counterintuitive truth: <strong>paying a balance down barely
            moves DTI</strong> — minimum payments shrink slowly — but paying one debt to{" "}
            <strong>zero deletes its entire payment</strong> from the math. That's why
            eliminating one $240 card payment can outdo throwing thousands at a big balance.
            Consolidation lowers payments by restructuring; <Link href="/debt-settlement">settlement</Link>{" "}
            deletes payments by resolving debts for less. The gap analysis above tells you the
            exact monthly-dollar target either path must hit.
          </p>

          <h2>When high DTI is the symptom, not the problem</h2>
          <p>
            A 45%+ ratio usually isn't a discipline failure — it's the arithmetic of modern
            prices. And it creates a trap: the consolidation loan that would fix your DTI gets
            denied <em>because of</em> your DTI. If you've hit that wall — especially a{" "}
            <strong>refinance denied for too much debt</strong> — the fastest exit is usually
            eliminating whole payments, not shuffling them. That's a conversation worth having
            with a specialist before your next application, not after another denial.
          </p>
        </div>

        <KeyTakeaway>
          <strong>Lenders don't feel your budget — they divide two numbers.</strong> Change
          either number and the answer changes. The fastest lever is usually deleting a monthly
          payment entirely, not shrinking a balance — and the gap analysis above tells you
          exactly how many monthly dollars have to go.
        </KeyTakeaway>

        <CommonMistakes
          items={[
            {
              mistake: "Using take-home pay instead of gross income",
              reality: "DTI is always computed on pre-tax income. Using net pay inflates your ratio by 20–30% and makes you look worse than any lender would score you.",
            },
            {
              mistake: "Counting utilities, insurance, and subscriptions as debt",
              reality: "Lenders count contractual debt obligations only. Adding living expenses produces a scary — and wrong — number.",
            },
            {
              mistake: "Entering what you actually pay on cards instead of the minimums",
              reality: "Underwriting uses the minimum payment on your statement. If you pay $400 on a card with a $140 minimum, DTI counts $140.",
            },
            {
              mistake: "Treating 43% as a legal cutoff",
              reality: "The old QM cap was replaced in 2021 by a price-based test. 43% remains a common reference line — programs approve above it every day with the right file.",
            },
          ]}
        />

        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
          <h2>Authoritative references</h2>
          <p>
            The CFPB's plain-English explainer,{" "}
            <a
              href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/"
              target="_blank"
              rel="noopener noreferrer"
            >
              "What is a debt-to-income ratio?"
            </a>
            , covers what counts and why it matters. For the 43% history and what replaced it,
            see the CFPB's{" "}
            <a
              href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-qualified-mortgage-en-1789/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Qualified Mortgage explainer
            </a>
            . And for VA's residual-income approach — the reason 41% is a guideline, not a cap —
            the{" "}
            <a
              href="https://www.benefits.va.gov/warms/pam26_7.asp"
              target="_blank"
              rel="noopener noreferrer"
            >
              VA Lenders Handbook (M26-7)
            </a>{" "}
            is the source underwriters use.
          </p>
        </div>

        <NextSteps
          steps={[
            { label: "Build the payoff plan that deletes a payment", href: "/financial-tools/debt-payoff-calculator" },
            { label: "See what settlement could eliminate", href: "/debt-settlement-calculator" },
            { label: "Talk it through with a free specialist", href: "/get-help" },
          ]}
        />
      </section>

      {/* ── FAQ (visible + in schema) ── */}
      <FAQ items={FAQS} title="DTI questions, answered" />

      <RelatedResources groups={RELATED} />
      <TrustBox />
    </>
  );
}
