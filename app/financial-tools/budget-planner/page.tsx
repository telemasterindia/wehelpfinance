import type { Metadata } from "next";
import Link from "next/link";
import { BudgetPlanner } from "@/components/tools/BudgetPlanner";
import { TrustSignals } from "@/components/TrustSignals";
import { TrustBox } from "@/components/TrustBox";
import { FAQ } from "@/components/FAQ";
import { RelatedResources } from "@/components/RelatedResources";
import type { ResourceGroup } from "@/components/RelatedResources";
import { KeyTakeaway, CommonMistakes, NextSteps } from "@/components/ContentAuthorityBlocks";
import { faqJsonLd, breadcrumbJsonLd, howToJsonLd } from "@/lib/schema";
import { CheckCircle2 } from "lucide-react";
import { DEFAULT_OG_IMAGE } from "@/lib/organizationConfig";

const CANONICAL = "https://www.wehelpfinance.com/financial-tools/budget-planner";

export const metadata: Metadata = {
  title: "Budget Planner — Free Household Budget Calculator with 50/30/20 & DTI | WeHelpFinance",
  description:
    "Free interactive budget planner. Map every dollar, see your Budget Health Score, compare against the 50/30/20 guideline, check your DTI, and simulate improvements instantly — with a monthly action plan. No sign-up.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Free Household Budget Planner | WeHelpFinance",
    description:
      "Where your money goes, what's actually left, and how much faster you could be debt-free — with a Budget Health Score, 50/30/20 comparison, and instant what-if simulator. Free, private, no sign-up.",
    url: CANONICAL,
    type: "website",
    images: [
      { url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "WeHelpFinance — Financial Help Made Human" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Budget Planner | WeHelpFinance",
    description:
      "Map every dollar, get a Budget Health Score, and simulate improvements instantly — free, 3 minutes, nothing saved.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const FAQS = [
  {
    q: "How do I make a monthly budget that actually sticks?",
    a: "Three habits beat every template. First, budget from real numbers — pull last month's statements rather than guessing, because most people underestimate discretionary spending by 20–30%. Second, give every dollar a named job, including the leftover: unassigned money drifts. Third, automate the decisions — savings transfers on payday, fixed extra debt payments — so the plan survives busy months. This planner handles the math and the score; the automation is what makes it durable.",
  },
  {
    q: "What is the 50/30/20 rule and do I have to follow it?",
    a: "It's a teaching guideline, not a law: roughly 50% of income to needs (housing, utilities, food, insurance, minimum debt payments), 30% to wants, and 20% to savings and extra debt paydown. Real budgets differ for real reasons — high-cost cities push needs past 50%, and heavy debt loads temporarily eat the savings share. This planner shows where you differ from the guideline and why, without treating the difference as a failure; the value is in seeing which bucket to work on, not in hitting the numbers exactly.",
  },
  {
    q: "What's a good savings rate?",
    a: "The 20% guideline is the classic anchor (that's savings plus retirement plus extra debt paydown combined), but the honest answer is developmental: any automated rate beats a sporadic higher one, the jump from 0% to 5% matters more than the jump from 15% to 20%, and the rate should climb with every raise before lifestyle absorbs it. If 20% feels impossible right now, the planner's what-if mode shows exactly which expense lines could fund the first 5%.",
  },
  {
    q: "How is the Budget Health Score calculated?",
    a: "Four disclosed factors totaling 100 points: cash-flow margin (30) — what's genuinely unallocated after every line; savings rate (25) against the 20% guideline; debt-to-income (25) using the same bands lenders use; and essentials share (20) against the 50% needs line. Grades: 80+ Excellent, 60–79 Healthy, 40–59 Needs Attention, below 40 Critical. It's an educational score — not a credit score, and no lender sees it. The factor bars under your score show exactly where points went missing.",
  },
  {
    q: "How much faster could I pay off debt with my budget surplus?",
    a: "Often dramatically faster than intuition suggests, because at revolving rates minimum payments mostly service interest. This planner estimates it two ways: it infers a balance from your minimum payments (the standard 3% convention), then simulates payoff at the platform's disclosed 22% baseline with and without your surplus redirected. A budget with $300/mo of genuine surplus routinely cuts years — not months — off the estimated payoff. For the real month-by-month plan with your actual balances and APRs, the Debt Payoff Calculator picks up where this estimate leaves off.",
  },
  {
    q: "Should I save or pay off debt first?",
    a: "Both, in a specific order: first build a small emergency cushion — roughly one month of expenses — because without it, the next surprise becomes new debt and undoes the payoff progress. Then direct the surplus at debt, keeping savings contributions minimal until high-rate balances are gone (a 22% card outconsumes any savings account). Once the debt is cleared, the freed payments flood back into savings at full speed. The planner's action plan sequences this automatically from your numbers.",
  },
];

const HOWTO_STEPS = [
  { name: "Map your income and spending", text: "Enter gross and other income, then every expense line — essentials, family, lifestyle, savings, and minimum debt payments. Blank or 0 for anything that doesn't apply." },
  { name: "Read your Budget Health Score", text: "One 0–100 score with four disclosed factors — cash-flow margin, savings rate, DTI, and essentials share — plus a donut of where every dollar goes." },
  { name: "Compare against 50/30/20", text: "See your needs, wants, and savings shares against the educational guideline, with an explanation of every difference — no judgment, just the levers." },
  { name: "Simulate and act", text: "Use What-If mode to preview cuts, extra savings, or income changes instantly, then follow the monthly action plan built from your specific numbers." },
];

const RELATED: ResourceGroup[] = [
  {
    heading: "More Tools",
    links: [
      { href: "/financial-tools/financial-health-score", label: "Financial Health Score" },
      { href: "/financial-tools/debt-payoff-calculator", label: "Debt Payoff Calculator" },
      { href: "/financial-tools/dti-calculator", label: "DTI Calculator" },
      { href: "/financial-tools/debt-solutions-comparison", label: "Debt Solutions Comparison" },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "https://www.wehelpfinance.com/" },
              { name: "Financial Tools", path: "https://www.wehelpfinance.com/financial-tools" },
              { name: "Budget Planner", path: CANONICAL },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            howToJsonLd({
              name: "How to build a monthly household budget",
              description:
                "Use the free WeHelpFinance Budget Planner to map every dollar, get a Budget Health Score, compare against 50/30/20, and simulate improvements instantly.",
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
            name: "Household Budget Planner",
            url: CANONICAL,
            applicationCategory: "FinanceApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            provider: { "@type": "Organization", name: "WeHelpFinance", url: "https://www.wehelpfinance.com" },
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
            <span className="text-foreground">Budget Planner</span>
          </nav>

          <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Free Tool · No Sign-Up
          </span>
          <h1 className="mt-4">Household Budget Planner</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Not a spreadsheet — a coach. Map every dollar, get a Budget Health Score with
            disclosed factors, see yourself against the 50/30/20 guideline without judgment,
            and simulate any improvement instantly — including how much sooner you could be
            debt-free.
          </p>

          <ul className="mt-6 grid gap-2.5 sm:grid-cols-3">
            {["Budget Health Score + factors", "50/30/20 & DTI, side by side", "Nothing saved or submitted"].map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-foreground/90">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Calculator ── */}
      <section className="container-page py-10" aria-label="Budget planner">
        <BudgetPlanner />
      </section>

      <section className="container-page max-w-5xl pb-4">
        <TrustSignals variant="compact" />
      </section>

      {/* ── Educational content ── */}
      <section className="container-page max-w-4xl py-10">
        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
          <h2>A budget is a cash-flow instrument, not a restriction</h2>
          <p>
            The word &ldquo;budget&rdquo; carries austerity baggage it doesn&rsquo;t deserve.
            Functionally, a budget is just <strong>visibility plus intention</strong>: seeing
            where the money actually goes, then giving every dollar a named job — including
            the fun ones. The planner above scores exactly that: not how little you spend, but
            whether the plan has margin (cash flow), funds the future (savings rate), keeps
            obligations proportionate (DTI), and leaves room to maneuver (essentials share).
            A budget with a generous entertainment line and a positive margin outscores a
            joyless one that ends at zero.
          </p>

          <h2>Why the surplus line is the most important number on the page</h2>
          <p>
            Net cash flow — what&rsquo;s left after <em>every</em> line item — is the
            budget&rsquo;s shock absorber and its engine. It absorbs the surprise bill that
            would otherwise become a balance, and it funds every improvement the other tools
            on this site can model: the emergency cushion, the extra debt payment, the DTI
            reduction that unlocks refinancing. That&rsquo;s why it carries the heaviest
            weight in the score, and why the what-if simulator makes it the first number to
            watch: most levers you pull move cash flow before they move anything else.
          </p>

          <h2>Minimum payments are a treadmill; the surplus is the exit</h2>
          <p>
            At typical revolving rates, minimum payments are engineered to mostly service
            interest — the balance barely moves. The transformation happens when a{" "}
            <strong>fixed extra amount</strong> rides on top: because the minimum-only
            timeline is so long, even a modest surplus redirected at debt routinely cuts the
            payoff by years, not months. The planner estimates that acceleration from your
            numbers using the platform&rsquo;s disclosed baseline assumptions — and when
            you&rsquo;re ready for the real month-by-month plan with your actual balances and
            rates, the Debt Payoff Calculator continues where the estimate leaves off.
          </p>

          <h2>Reading your 50/30/20 gaps honestly</h2>
          <p>
            When needs run past 50%, the culprit is almost never lattes — it&rsquo;s the big
            fixed lines: housing, transportation, and debt payments. Those move at decision
            points (lease renewals, refinances, consolidations), not through daily willpower,
            which is why guilt is the wrong response and scheduling is the right one. Wants
            above 30% are the opposite: nothing there is contractual, so they&rsquo;re the
            fastest dollars to redirect when a goal needs funding. And a savings share below
            20% usually isn&rsquo;t a discipline problem — it&rsquo;s the arithmetic
            consequence of the first two buckets, which is exactly the order the monthly
            action plan works them in.
          </p>
        </div>

        <KeyTakeaway>
          <strong>Every dollar needs a named job — especially the leftover ones.</strong>{" "}
          Unassigned surplus drifts into spending; assigned surplus builds cushions and
          erases debt. The score, the simulator, and the monthly plan all point at the same
          discipline: decide on payday, automate the decision, and let the order compound —
          margin first, one month of cushion, then the debt.
        </KeyTakeaway>

        <CommonMistakes
          items={[
            {
              mistake: "Budgeting from memory instead of statements",
              reality:
                "Most people underestimate discretionary spending by 20–30%. One month of real statement data makes the plan honest — and usually reveals a subscription or two nobody remembers ordering.",
            },
            {
              mistake: "Building a budget that ends at exactly $0",
              reality:
                "A plan with no margin breaks on first contact with reality — the surprise co-pay, the car repair. The score rewards unallocated cushion on purpose: slack isn't waste, it's the shock absorber.",
            },
            {
              mistake: "Counting retirement contributions as spendable savings",
              reality:
                "Retirement money is committed, not liquid — early withdrawal costs penalties and taxes. The emergency cushion needs its own liquid account, which is why this planner tracks them as separate lines.",
            },
            {
              mistake: "Treating the 50/30/20 guideline as a pass/fail test",
              reality:
                "It's a compass, not a report card. High-cost regions blow past 50% needs through no fault of the household; heavy debt seasons legitimately borrow from the savings share. The useful question is which bucket to work next — not whether you match a national rule of thumb.",
            },
          ]}
        />

        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
          <h2>Authoritative references</h2>
          <p>
            The CFPB&rsquo;s{" "}
            <a href="https://www.consumerfinance.gov/consumer-tools/budgeting/" target="_blank" rel="noopener noreferrer">
              budgeting resource center
            </a>{" "}
            offers worksheets and guidance that pair well with this planner&rsquo;s live
            math. The Federal Reserve&rsquo;s{" "}
            <a href="https://www.federalreserve.gov/consumerscommunities/shed.htm" target="_blank" rel="noopener noreferrer">
              Survey of Household Economics and Decisionmaking (SHED)
            </a>{" "}
            documents why the emergency-cushion milestone matters so much to household
            resilience. And for the debt side of the score, the CFPB&rsquo;s{" "}
            <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/" target="_blank" rel="noopener noreferrer">
              debt-to-income explainer
            </a>{" "}
            covers the same DTI ratio this planner computes with the same bands lenders
            apply.
          </p>
        </div>

        <NextSteps
          steps={[
            { label: "Turn the surplus into a payoff plan", href: "/financial-tools/debt-payoff-calculator" },
            { label: "See your full financial picture in one score", href: "/financial-tools/financial-health-score" },
            { label: "Talk through the plan with a free specialist", href: "/get-help" },
          ]}
        />
      </section>

      {/* ── FAQ (visible + in schema) ── */}
      <FAQ items={FAQS} title="Budgeting questions, answered" />

      <RelatedResources groups={RELATED} />
      <TrustBox />
    </>
  );
}

