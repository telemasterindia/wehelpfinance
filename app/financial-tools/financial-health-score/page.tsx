import type { Metadata } from "next";
import Link from "next/link";
import { FinancialHealthCalculator } from "@/components/tools/FinancialHealthCalculator";
import { TrustSignals } from "@/components/TrustSignals";
import { TrustBox } from "@/components/TrustBox";
import { FAQ } from "@/components/FAQ";
import { RelatedResources } from "@/components/RelatedResources";
import type { ResourceGroup } from "@/components/RelatedResources";
import { KeyTakeaway, CommonMistakes, NextSteps } from "@/components/ContentAuthorityBlocks";
import { faqJsonLd, breadcrumbJsonLd, howToJsonLd } from "@/lib/schema";
import { CheckCircle2 } from "lucide-react";
import { DEFAULT_OG_IMAGE } from "@/lib/organizationConfig";

const CANONICAL =
  "https://www.wehelpfinance.com/financial-tools/financial-health-score";

export const metadata: Metadata = {
  title:
    "Financial Health Score — Free 0–100 Financial Wellness Check | WeHelpFinance",
  description:
    "Get your free Financial Health Score: one 0–100 wellness score built from cash flow, DTI, debt burden, emergency savings, credit, and payment history — with a personalized action plan and what-if simulator. Not a credit score. No sign-up.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Free Financial Health Score | WeHelpFinance",
    description:
      "One honest 0–100 score for your whole financial picture — with the exact levers that move it, a personalized action plan, and an instant what-if simulator. Free, private, no sign-up.",
    url: CANONICAL,
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "WeHelpFinance — Financial Help Made Human",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Financial Health Score | WeHelpFinance",
    description:
      "Your whole financial picture in one 0–100 score — plus the action plan that moves it. Free, 2 minutes, not a credit score.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const FAQS = [
  {
    q: "Is this Financial Health Score the same as my credit score?",
    a: "No — and the difference matters. A credit score (FICO, VantageScore) measures one thing: how you handle borrowed money, for the benefit of lenders. This Financial Health Score is an educational wellness measure of your whole position — cash flow, emergency cushion, debt load, DTI, credit range, payment history, housing, and employment. You can have excellent credit and a fragile financial position (high income, no savings, heavy payments), or modest credit and real resilience. No lender sees or uses this score; it exists to show you where your own leverage is.",
  },
  {
    q: "How is the 0–100 score calculated?",
    a: "Eight weighted categories, and the weights are disclosed rather than mysterious: cash flow 18, emergency savings 16, debt-to-income 16, debt burden 14, payment history 14, credit profile 12, housing stability 5, employment stability 5. The anchors are established benchmarks — the 50/30/20 budgeting margin, the 3–6-month emergency-fund guideline, the same DTI bands lenders use, and Federal Reserve research on what actually separates resilient households. Optional entries like retirement savings and dependents never change the score, so leaving them blank can't hurt you.",
  },
  {
    q: "What's a good Financial Health Score?",
    a: "85+ grades Excellent, 70–84 Very Good, 55–69 Good, 40–54 Fair, and below 40 Needs Improvement. But the grade matters less than the breakdown: two people with the same 62 can have completely different situations — one needs an emergency fund, the other needs a DTI fix. That's why the tool shows all eight category bars and points the action plan at your specific lowest ones rather than giving generic advice.",
  },
  {
    q: "Why does payment history weigh so much if this isn't a credit score?",
    a: "Because it's the single most predictive behavior in consumer finance, full stop — credit models weight it heaviest for the same reason. Being current keeps every option open: hardship programs, consolidation, refinancing, even settlement negotiations go better from a known starting point. It's also the fastest category to recover: the score rewards getting current immediately, while balances and savings take months to move.",
  },
  {
    q: "How much emergency savings should I actually have?",
    a: "The standard guideline is 3–6 months of your total monthly outflow — expenses plus all debt payments. This tool scores 6+ months at full marks and 3–6 as strong, but the most important jump is the first one: from zero to one month. Federal Reserve survey data consistently shows that households who can't absorb a modest surprise expense end up converting emergencies into new debt — which then drags the cash-flow, DTI, and debt-burden categories too. If you support dependents, lean toward the 6-month end.",
  },
  {
    q: "Can I improve my score without earning more money?",
    a: "Usually, yes — and the What-If simulator on this page proves it with your own numbers. The three levers that move the score without a raise: eliminate a whole monthly payment (moves cash flow AND DTI simultaneously), automate even small transfers to the emergency fund (the 0→1 month jump is the biggest single gain available to most people), and get any late accounts current (payment history is 14 of the 100 points and recovers fast). Try each lever in the simulator and watch which one moves your number most.",
  },
];

const HOWTO_STEPS = [
  {
    name: "Enter your monthly numbers",
    text: "Gross income, living expenses, debt payments, and — if you own — your mortgage payment.",
  },
  {
    name: "Add balances and context",
    text: "Total unsecured debt, emergency savings, credit range, employment, and whether any payments are behind.",
  },
  {
    name: "Read your score and breakdown",
    text: "One 0–100 score, a letter grade, all eight category bars with plain-English reasons, and six sub-scores from cash flow to borrowing readiness.",
  },
  {
    name: "Work the plan — and simulate it",
    text: "Follow your personalized action plan, then use What-If mode to preview exactly how each move — more savings, one less payment, a credit bump — changes your score.",
  },
];

const RELATED: ResourceGroup[] = [
  {
    heading: "More Tools",
    links: [
      { href: "/financial-tools/dti-calculator", label: "DTI Calculator" },
      { href: "/financial-tools/debt-solutions-comparison", label: "Debt Solutions Comparison" },
      { href: "/financial-tools/personal-loan-calculator", label: "Personal Loan Calculator" },
      { href: "/financial-tools/mortgage-refinance-calculator", label: "Mortgage Refinance Calculator" },
      { href: "/financial-tools", label: "All Financial Tools" },
    ],
  },
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
      { href: "/debt-relief-guide", label: "Complete Debt Relief Guide" },
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
              { name: "Financial Health Score", path: CANONICAL },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            howToJsonLd({
              name: "How to check your Financial Health Score",
              description:
                "Use the free WeHelpFinance Financial Health Score to see your 0–100 wellness score, category breakdown, personalized action plan, and what-if simulations.",
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
            name: "Financial Health Score",
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
            <span className="text-foreground">Financial Health Score</span>
          </nav>

          <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Flagship Tool · Free · No Sign-Up
          </span>
          <h1 className="mt-4">Your Financial Health Score</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            One honest 0–100 score for your whole financial picture — cash flow, cushion,
            debt, credit, and history — with disclosed weights, a personalized action plan,
            and a what-if simulator that shows exactly which lever moves your number most.
            It&rsquo;s a wellness score, not a credit score.
          </p>

          <ul className="mt-6 grid gap-2.5 sm:grid-cols-3">
            {[
              "Disclosed weights, no mystery math",
              "Action plan + what-if simulator",
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
      <section className="container-page py-10" aria-label="Financial Health Score calculator">
        <FinancialHealthCalculator />
      </section>

      <section className="container-page max-w-5xl pb-4">
        <TrustSignals variant="compact" />
      </section>

      {/* ── Educational content ── */}
      <section className="container-page max-w-4xl py-10">
        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
          <h2>What this score measures — and what it deliberately doesn&rsquo;t</h2>
          <p>
            A credit score answers one narrow question for lenders: how reliably do you repay
            borrowed money? This score answers a broader one for <em>you</em>: how much
            margin, cushion, and flexibility does your whole position have? Eight categories
            feed it, with disclosed weights — cash flow (18), emergency savings (16),
            debt-to-income (16), debt burden (14), payment history (14), credit profile (12),
            housing (5), and employment (5). Nearly half the score sits on debt-related
            factors because debt is where most financial stress concentrates, and because
            those are the categories the rest of this site&rsquo;s tools can actually help
            you move.
          </p>

          <h2>Why cash flow outweighs everything else</h2>
          <p>
            Every improvement on this page is <strong>funded by monthly margin</strong> — the
            gap between what comes in and what goes out. That&rsquo;s why cash flow carries
            the single largest weight, anchored to the 50/30/20 convention that treats a 20%
            margin as healthy. A household earning $12,000 a month that spends $12,100 is
            more fragile than one earning $4,000 and keeping $600 — income impresses, margin
            protects. If your cash-flow bar is short, notice how the action plan puts it
            first: not because it&rsquo;s easy, but because every later step draws on it.
          </p>

          <h2>The emergency fund is a debt-prevention tool</h2>
          <p>
            The Federal Reserve&rsquo;s household surveys keep finding the same dividing
            line: families who can absorb a modest surprise expense in cash, and families for
            whom that same surprise becomes a balance. The 3–6-month guideline is the
            destination, but the <strong>first month is the transformative one</strong> — it
            converts emergencies from debt-events into inconveniences. That&rsquo;s why the
            scoring gives real credit for the zero-to-one jump, and why the What-If simulator
            usually shows a bigger score gain from the first $2,000 of savings than from the
            last.
          </p>

          <h2>Payment history: the heaviest habit, the fastest recovery</h2>
          <p>
            Being current on every payment is the strongest single signal in this score —
            the same reason credit models weight it heaviest. But here&rsquo;s the
            encouraging asymmetry: while balances take months to shrink and savings take
            months to grow, payment status can change with one phone call and one arrangement.
            If any account is behind, the action plan will put &ldquo;get current&rdquo; at
            step one — through a hardship plan if needed — because no other move returns as
            many points, or reopens as many doors, as quickly.
          </p>
        </div>

        <KeyTakeaway>
          <strong>The score is a map, not a verdict.</strong> Two people with identical
          scores can need opposite moves — that&rsquo;s why the breakdown, the action plan,
          and the simulator matter more than the number itself. Find your shortest bar, test
          the fix in What-If mode, and let the compounding order do the work: current
          payments → positive margin → first month of cushion → DTI under the line.
        </KeyTakeaway>

        <CommonMistakes
          items={[
            {
              mistake: "Treating this like a credit score",
              reality:
                "No lender sees or uses this number. It measures resilience, not repayment behavior — you can score 90 here with thin credit, or 45 with an 800 FICO and no cushion. Use each score for what it actually measures.",
            },
            {
              mistake: "Chasing the credit category first",
              reality:
                "Credit is weighted below the behaviors that produce it — on purpose. Utilization falls and history builds as a side effect of fixing cash flow and payments; working the inputs moves both scores at once.",
            },
            {
              mistake: "Counting retirement accounts as the emergency fund",
              reality:
                "Early withdrawals typically cost penalties plus taxes, and the money stops compounding. This tool deliberately excludes retirement balances from the emergency-months math — a cushion you can't touch cheaply isn't a cushion.",
            },
            {
              mistake: "Trying to fix all eight categories at once",
              reality:
                "The plan is ordered for a reason: current payments unlock options, margin funds savings, savings prevent new debt, and lower DTI unlocks refinancing and consolidation. Sequential beats scattered — the simulator lets you preview the sequence before living it.",
            },
          ]}
        />

        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
          <h2>Authoritative references</h2>
          <p>
            The CFPB&rsquo;s{" "}
            <a
              href="https://www.consumerfinance.gov/data-research/research-reports/financial-well-being-scale/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Financial Well-Being Scale
            </a>{" "}
            is the research foundation for measuring financial health as more than a credit
            number. The Federal Reserve&rsquo;s annual{" "}
            <a
              href="https://www.federalreserve.gov/consumerscommunities/shed.htm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Survey of Household Economics and Decisionmaking (SHED)
            </a>{" "}
            documents the emergency-liquidity dividing line this score&rsquo;s savings
            category is built on. And for the debt side, the CFPB&rsquo;s{" "}
            <a
              href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/"
              target="_blank"
              rel="noopener noreferrer"
            >
              debt-to-income explainer
            </a>{" "}
            covers the same DTI ratio this tool computes with the same bands lenders apply.
          </p>
        </div>

        <NextSteps
          steps={[
            { label: "Drill into your DTI, the biggest debt lever", href: "/financial-tools/dti-calculator" },
            { label: "Compare every debt-relief path with one engine", href: "/financial-tools/debt-solutions-comparison" },
            { label: "Talk through your plan with a free specialist", href: "/get-help" },
          ]}
        />
      </section>

      {/* ── FAQ (visible + in schema) ── */}
      <FAQ items={FAQS} title="Financial Health Score questions, answered" />

      <RelatedResources groups={RELATED} />
      <TrustBox />
    </>
  );
}

