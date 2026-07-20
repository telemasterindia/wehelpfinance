import type { Metadata } from "next";
import Link from "next/link";
import { DebtFreedomPlanner } from "@/components/tools/DebtFreedomPlanner";
import { TrustSignals } from "@/components/TrustSignals";
import { TrustBox } from "@/components/TrustBox";
import { FAQ } from "@/components/FAQ";
import { RelatedResources } from "@/components/RelatedResources";
import type { ResourceGroup } from "@/components/RelatedResources";
import { KeyTakeaway, CommonMistakes, NextSteps } from "@/components/ContentAuthorityBlocks";
import { faqJsonLd, breadcrumbJsonLd, howToJsonLd } from "@/lib/schema";
import { CheckCircle2 } from "lucide-react";
import { DEFAULT_OG_IMAGE } from "@/lib/organizationConfig";

const CANONICAL = "https://www.wehelpfinance.com/financial-tools/debt-freedom-planner";

export const metadata: Metadata = {
  title: "Debt Freedom Planner — Compare 6 Payoff Strategies Side by Side | WeHelpFinance",
  description:
    "Free debt freedom planner. Compare minimum payments, snowball, avalanche, consolidation, settlement, and a hybrid strategy — with debt-free dates, total costs, DTI and credit impact, a milestone timeline, and a what-if simulator. No sign-up.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Free Debt Freedom Planner — 6 Strategies Compared | WeHelpFinance",
    description:
      "Every major debt payoff strategy priced for your numbers — dates, totals, DTI, credit impact, and an honest recommendation for YOUR goal. Free, private, no sign-up.",
    url: CANONICAL,
    type: "website",
    images: [
      { url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "WeHelpFinance — Financial Help Made Human" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Freedom Planner | WeHelpFinance",
    description:
      "Six payoff strategies, one honest comparison — dates, costs, DTI and credit impact for your numbers. Free, 3 minutes.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const FAQS = [
  {
    q: "Snowball or avalanche — which debt payoff method is actually better?",
    a: "Mathematically, avalanche (highest APR first) always wins or ties — it minimizes total interest by definition. Behaviorally, snowball (smallest balance first) wins for many people, because early account payoffs are the fuel that keeps a multi-year plan alive, and research on debt repayment consistently finds completion matters more than optimization. The honest answer: the difference is often smaller than people expect — this planner prices both for your numbers so you can see the actual gap — and the hybrid strategy captures most of both benefits.",
  },
  {
    q: "What is the hybrid debt payoff strategy?",
    a: "It sequences the two approaches instead of choosing: clear your two smallest accounts first snowball-style (fast wins, fewer bills, immediate DTI steps), then switch to avalanche order (highest APR first) for everything remaining. You get the psychological launch that keeps plans alive and most of the math that makes avalanche cheapest. This planner simulates it month by month on your numbers with documented assumptions — it's typically within a few percent of avalanche's cost while starting like snowball.",
  },
  {
    q: "Is debt consolidation or debt settlement better for me?",
    a: "They serve different situations. Consolidation repays 100% of what you owe through a new fixed-rate loan — it needs approval, works best with fair-or-better credit, and protects or improves credit. Settlement pays less than the full balance on debt that full repayment realistically can't clear — no approval needed, but accounts typically must be delinquent, credit takes significant damage during the program, and forgiven amounts can be taxable. This planner prices both against simply paying the debt down, because seeing all three totals side by side usually makes the answer obvious for your specific numbers.",
  },
  {
    q: "How does this planner compare strategies without my exact account details?",
    a: "You enter totals — balance, average APR, account count, current payments — and the planner synthesizes a realistic account portfolio from them (a disclosed geometric balance split with an APR spread, minimums scaled to match your real payment exactly). That's enough for the strategies to differ the way they do in real life. When you're ready for precision, the Debt Payoff Calculator takes your exact per-account balances and rates and builds the month-by-month schedule — this planner tells you which strategy; that one executes it.",
  },
  {
    q: "Will paying off debt faster help me qualify for a mortgage?",
    a: "Usually yes, through two doors at once. Every account you clear removes a whole payment from your debt-to-income ratio — the affordability number mortgage underwriters cap around 45–50% — and the unbroken on-time history strengthens the credit side they weigh equally. That's why the 'Qualify for a mortgage' goal in this planner favors paths that lower monthly obligations while protecting payment history, and why settlement (which requires delinquency) rarely wins that goal even when it wins on cost.",
  },
  {
    q: "What if I can't afford more than my minimum payments?",
    a: "Then the comparison itself is the insight: the minimum-payments row shows exactly what the current path costs in time and interest, which is the honest baseline every alternative gets measured against. From there, three doors: the Budget Planner finds extra dollars most budgets are leaking; consolidation can lower the required monthly payment if your credit supports it; and when the numbers show full repayment isn't realistic, the settlement row prices that path transparently — including its credit trade-offs — instead of pretending it doesn't exist.",
  },
];

const HOWTO_STEPS = [
  { name: "Pick your goal", text: "Fastest payoff, maximum interest savings, lowest payment, better credit or DTI, mortgage qualification, or less stress — the recommendation adapts to what you optimize for." },
  { name: "Enter your debt picture", text: "Total unsecured debt, average APR, number of accounts, current payments, available extra, income, expenses, credit range, and payment status." },
  { name: "Compare all six strategies", text: "Minimum payments, snowball, avalanche, consolidation, settlement, and the hybrid — each priced with monthly payment, debt-free date, total cost, savings, DTI, credit impact, and difficulty." },
  { name: "Follow the roadmap — and simulate it", text: "A milestone timeline, a 6-month action plan, and a what-if simulator that re-prices every strategy instantly as you test improvements." },
];

const RELATED: ResourceGroup[] = [
  {
    heading: "More Tools",
    links: [
      { href: "/financial-tools/debt-payoff-calculator", label: "Debt Payoff Calculator" },
      { href: "/financial-tools/debt-solutions-comparison", label: "Debt Solutions Comparison" },
      { href: "/debt-settlement-calculator", label: "Debt Settlement Calculator" },
      { href: "/financial-tools/personal-loan-calculator", label: "Personal Loan Calculator" },
      { href: "/financial-tools/budget-planner", label: "Budget Planner" },
      { href: "/financial-tools", label: "All Financial Tools" },
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
      { href: "/debt-relief-guide", label: "Complete Debt Relief Guide" },
      { href: "/debt-settlement-vs-debt-consolidation", label: "Settlement vs. Consolidation" },
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
              { name: "Debt Freedom Planner", path: CANONICAL },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            howToJsonLd({
              name: "How to compare debt payoff strategies",
              description:
                "Use the free WeHelpFinance Debt Freedom Planner to compare minimum payments, snowball, avalanche, consolidation, settlement, and a hybrid strategy for your numbers.",
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
            name: "Debt Freedom Planner",
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
            <span className="text-foreground">Debt Freedom Planner</span>
          </nav>

          <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Free Tool · No Sign-Up
          </span>
          <h1 className="mt-4">Debt Freedom Planner</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Every major payoff strategy — minimums, snowball, avalanche, consolidation,
            settlement, and a hybrid — priced side by side for your numbers, with debt-free
            dates, honest totals, DTI and credit impact, a milestone timeline, and a
            recommendation tuned to <em>your</em> goal, not ours.
          </p>

          <ul className="mt-6 grid gap-2.5 sm:grid-cols-3">
            {["6 strategies, one honest table", "Goal-based recommendation", "Nothing saved or submitted"].map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-foreground/90">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Calculator ── */}
      <section className="container-page py-10" aria-label="Debt freedom planner">
        <DebtFreedomPlanner />
      </section>

      <section className="container-page max-w-5xl pb-4">
        <TrustSignals variant="compact" />
      </section>

      {/* ── Educational content ── */}
      <section className="container-page max-w-4xl py-10">
        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
          <h2>The strategy matters less than the comparison</h2>
          <p>
            Most debt advice picks a champion — snowball for motivation, avalanche for math,
            consolidation for simplicity — and argues for it. But the strategies aren&rsquo;t
            rivals; they&rsquo;re <strong>tools priced differently for different
            situations</strong>, and the only honest way to choose is to see all of them
            costed for <em>your</em> balance, rates, and budget at once. That&rsquo;s what
            the table above does: same inputs, same math conventions, six outcomes. The
            recommendation adapts to the goal you pick — fastest, cheapest, gentlest on
            credit, best for a mortgage — because &ldquo;best strategy&rdquo; is meaningless
            until you say best <em>at what</em>.
          </p>

          <h2>Why the minimum-payments row is the most important one</h2>
          <p>
            It&rsquo;s the row nobody chooses on purpose and millions live in by default. At
            typical revolving rates, minimums are engineered so most of the payment services
            interest — which is why the baseline row often shows a decade-plus timeline and a
            total near double the balance. Every other strategy&rsquo;s &ldquo;savings&rdquo;
            figure is measured against it, because that&rsquo;s the honest counterfactual:
            not doing nothing, but doing what the statements suggest. If the baseline number
            shocks you, that shock is the point — it&rsquo;s the price of the default.
          </p>

          <h2>The hybrid idea: start like a human, finish like a spreadsheet</h2>
          <p>
            Debt payoff research keeps landing on the same finding: <strong>plans fail from
            abandonment, not arithmetic</strong>. Snowball&rsquo;s early wins protect against
            abandonment; avalanche&rsquo;s ordering protects against interest. The hybrid
            sequences them — two quick account payoffs first (fewer bills within months, a
            visible DTI step, the habit installed), then highest-APR-first for the long
            middle. On most portfolios it lands within a few percent of avalanche&rsquo;s
            total cost while starting with snowball&rsquo;s momentum, which is why it wins
            the &ldquo;reduce stress&rdquo; and &ldquo;best overall&rdquo; picks so often.
          </p>

          <h2>When the honest answer is a harder conversation</h2>
          <p>
            Sometimes the table says what nobody wants it to: at these numbers, full
            repayment doesn&rsquo;t realistically clear the debt. That&rsquo;s the situation
            settlement exists for — paying less than the full balance on eligible unsecured
            accounts — and this planner prices it with the same transparency as everything
            else: the deposits, the program length, the fee rules (collectible only after
            each account settles, per the FTC&rsquo;s advance-fee ban), the credit damage
            while it runs, and the possible tax on forgiven amounts. Not as a
            recommendation, and never as a rejection of the alternatives — as a priced row in
            an honest table, which is what a real decision needs.
          </p>
        </div>

        <KeyTakeaway>
          <strong>Choose the strategy you&rsquo;ll finish, then automate it.</strong> The
          gap between snowball and avalanche is usually smaller than the gap between any plan
          and an abandoned one. Pick your goal, take the recommendation or override it with
          open eyes, set the payment as automatic — and let the milestone timeline, not
          willpower, carry the middle months.
        </KeyTakeaway>

        <CommonMistakes
          items={[
            {
              mistake: "Optimizing the strategy instead of the extra payment",
              reality:
                "Switching from snowball to avalanche might save hundreds; adding $150/mo of extra payment routinely saves thousands and years. The what-if simulator shows both levers — pull the bigger one first.",
            },
            {
              mistake: "Consolidating, then re-spending the cleared cards",
              reality:
                "The loan moves the debt; the habit rebuilds it. Running balances back up leaves you with the loan AND the cards — the one outcome worse than either alone. Consolidation is a strategy only when paired with a spending plan.",
            },
            {
              mistake: "Treating settlement as a discount instead of a trade",
              reality:
                "Settlement trades credit damage, required delinquency, and possible taxes on forgiven amounts for principal reduction. Sometimes that trade is genuinely right — but only the version of you that has seen all six rows priced can know that.",
            },
            {
              mistake: "Abandoning the plan after one bad month",
              reality:
                "A missed extra payment costs a few weeks on the timeline; quitting costs the timeline. Build the plan with a small cushion first (the roadmap's month 1–2 for a reason), and let automation carry the months motivation doesn't.",
            },
          ]}
        />

        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
          <h2>Authoritative references</h2>
          <p>
            The CFPB&rsquo;s{" "}
            <a href="https://www.consumerfinance.gov/ask-cfpb/what-are-some-tips-for-paying-down-debt-en-1913/" target="_blank" rel="noopener noreferrer">
              guidance on paying down debt
            </a>{" "}
            covers the snowball and avalanche approaches this planner prices. The FTC&rsquo;s{" "}
            <a href="https://consumer.ftc.gov/articles/how-get-out-debt" target="_blank" rel="noopener noreferrer">
              How to Get Out of Debt
            </a>{" "}
            explains the consumer protections around settlement — including the advance-fee
            rule our settlement math assumes. And for the ratio half the goals here optimize,
            the CFPB&rsquo;s{" "}
            <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-debt-to-income-ratio-en-1791/" target="_blank" rel="noopener noreferrer">
              debt-to-income explainer
            </a>{" "}
            covers the DTI every strategy row reports.
          </p>
        </div>

        <NextSteps
          steps={[
            { label: "Execute the winner with exact balances", href: "/financial-tools/debt-payoff-calculator" },
            { label: "Find the extra payment in your budget", href: "/financial-tools/budget-planner" },
            { label: "Talk the comparison through with a free specialist", href: "/get-help" },
          ]}
        />
      </section>

      {/* ── FAQ (visible + in schema) ── */}
      <FAQ items={FAQS} title="Debt payoff strategy questions, answered" />

      <RelatedResources groups={RELATED} />
      <TrustBox />
    </>
  );
}

