import type { Metadata } from "next";
import Link from "next/link";
import { DebtPayoffCalculator } from "@/components/tools/DebtPayoffCalculator";
import { TrustSignals } from "@/components/TrustSignals";
import { TrustBox } from "@/components/TrustBox";
import { FAQ } from "@/components/FAQ";
import { RelatedResources } from "@/components/RelatedResources";
import type { ResourceGroup } from "@/components/RelatedResources";
import {
  KeyTakeaway, ComparisonTable, CommonMistakes, NextSteps,
} from "@/components/ContentAuthorityBlocks";
import { faqJsonLd, breadcrumbJsonLd, howToJsonLd } from "@/lib/schema";
import { CheckCircle2 } from "lucide-react";

const CANONICAL = "https://www.wehelpfinance.com/financial-tools/debt-payoff-calculator";

export const metadata: Metadata = {
  title: "Debt Payoff Calculator — Snowball vs. Avalanche Planner | WeHelpFinance",
  description:
    "Free debt payoff calculator. Enter unlimited debts, compare the Snowball and Avalanche methods side by side, and see your debt-free date, total interest, and how much an extra payment saves.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Free Debt Payoff Calculator — Snowball vs. Avalanche | WeHelpFinance",
    description:
      "See your debt-free date and compare payoff strategies with live charts. No sign-up, no personal information required.",
    url: CANONICAL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Payoff Calculator | WeHelpFinance",
    description: "Compare Snowball vs. Avalanche and find your debt-free date in 2 minutes.",
  },
};

const FAQS = [
  {
    q: "What's the difference between the Snowball and Avalanche methods?",
    a: "Both methods keep your total monthly payment constant and direct every extra dollar at one target debt. Snowball targets your smallest balance first — you knock out whole accounts quickly, which builds momentum. Avalanche targets your highest interest rate first — mathematically it always costs the same or less in total interest. When a target debt is paid off, its minimum payment rolls into the next target, which is why both methods accelerate over time.",
  },
  {
    q: "Which payoff method should I choose?",
    a: "If the two methods are within a few hundred dollars of each other in this calculator, choose Snowball — the psychological wins of closing accounts early help most people stay consistent, and consistency matters more than optimization. If Avalanche saves you a significant amount (common when one debt has a much higher APR than the others), the math favors Avalanche. The honest answer: the best method is the one you'll actually stick with for the full payoff period.",
  },
  {
    q: "How accurate is this debt payoff calculator?",
    a: "The calculator compounds interest monthly at each debt's APR divided by 12, holds your total monthly payment constant, and rolls freed-up minimums into the next target debt — the standard way both strategies are taught. Real credit card minimums often shrink as balances fall (which stretches payoff even longer), so treating your current minimum as fixed is a realistic, slightly conservative planning assumption.",
  },
  {
    q: "Should I pay off debt or save money first?",
    a: "A common approach is to first set aside a small emergency buffer (often $500–$1,000) so an unexpected expense doesn't land on a credit card, then direct everything extra at your debts. High-interest debt at 20%+ APR almost always costs more than savings earn, so beyond that starter buffer, extra payments typically do more for your finances than extra savings.",
  },
  {
    q: "What if I can't afford more than my minimum payments?",
    a: "The calculator still shows your payoff timeline with minimums alone — but if that timeline looks impossibly long, or your balances are growing despite payments, that's the signal your situation may need more than a payoff strategy. Options like debt settlement or a debt management plan exist for exactly this scenario. A free consultation with a specialist can clarify what's realistic before things escalate.",
  },
  {
    q: "Does using this calculator affect my credit score?",
    a: "No. The calculator runs entirely in your browser — nothing is submitted, saved, or checked. No sign-up, no email, no credit pull. It's a planning tool, not an application.",
  },
];

const HOWTO_STEPS = [
  { name: "List your debts", text: "Enter each debt's name, current balance, interest rate (APR), and minimum monthly payment. Add as many debts as you have — credit cards, personal loans, medical bills." },
  { name: "Add an extra payment", text: "Enter any amount you can pay above your combined minimums, even $25–$50. This is the single biggest lever in your payoff timeline." },
  { name: "Compare strategies", text: "Toggle between Avalanche (highest rate first) and Snowball (smallest balance first) to see the difference in total interest and payoff time." },
  { name: "Follow your plan", text: "Pay minimums on everything, put all extra money toward the target debt, and when it's paid off, roll its payment into the next target." },
];

const RELATED: ResourceGroup[] = [
  {
    heading: "More Tools",
    links: [
      { href: "/debt-settlement-calculator", label: "Debt Settlement Calculator" },
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
      { href: "/blog/minimum-payment-trap", label: "The Minimum Payment Trap" },
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
              { name: "Debt Payoff Calculator", path: CANONICAL },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            howToJsonLd({
              name: "How to build a debt payoff plan",
              description:
                "Use the free WeHelpFinance Debt Payoff Calculator to compare the Snowball and Avalanche methods and find your debt-free date.",
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
            name: "Debt Payoff Calculator",
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
            <span className="text-foreground">Debt Payoff Calculator</span>
          </nav>

          <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Free Tool · No Sign-Up
          </span>
          <h1 className="mt-4">Debt Payoff Calculator</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Enter your debts, compare the Snowball and Avalanche methods side by side, and see
            exactly when you'll be debt-free — with live charts, no email required.
          </p>

          <ul className="mt-6 grid gap-2.5 sm:grid-cols-3">
            {[
              "Unlimited debts",
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
      <section className="container-page py-10" aria-label="Debt payoff calculator">
        <DebtPayoffCalculator />
      </section>

      <section className="container-page max-w-5xl pb-4">
        <TrustSignals variant="compact" />
      </section>

      {/* ── Educational content ── */}
      <section className="container-page max-w-4xl py-10">
        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
          <h2>What is the Debt Snowball method?</h2>
          <p>
            With the Snowball method, you pay minimums on everything and put every extra dollar
            toward your <strong>smallest balance</strong> first. When that account is gone, its
            entire payment rolls into the next-smallest debt — so your "snowball" grows with every
            account you close. The math isn't always optimal, but the quick wins are real: closing
            a whole account in the first few months is what keeps many people going for the full
            two-to-four-year journey.
          </p>

          <h2>What is the Debt Avalanche method?</h2>
          <p>
            The Avalanche method targets your <strong>highest interest rate</strong> first,
            regardless of balance size. Because expensive debt gets eliminated soonest, Avalanche
            always costs the same or less in total interest than Snowball — sometimes by a little,
            sometimes by thousands when one card carries a 29% penalty APR. The trade-off: if your
            highest-rate debt is also your biggest, it can take a year or more before you feel the
            first "win."
          </p>
        </div>

        <KeyTakeaway>
          <strong>The honest answer to "which is better":</strong> Avalanche wins on math,
          Snowball wins on motivation — and motivation is what actually finishes payoff plans.
          Run both in the calculator above. If the interest difference is small, pick Snowball.
          If Avalanche saves you serious money, let the number motivate you instead.
        </KeyTakeaway>

        <ComparisonTable
          title="Snowball vs. Avalanche at a glance"
          columns={["Debt Snowball", "Debt Avalanche"]}
          rows={[
            { label: "Extra payments target", values: ["Smallest balance first", "Highest APR first"] },
            { label: "Total interest cost", values: ["Same or slightly more", "Always lowest possible"] },
            { label: "First debt eliminated", values: ["Fast — often within months", "Can take longer"] },
            { label: "Best for", values: ["Motivation from quick wins", "Maximum savings, disciplined payers"] },
            { label: "Monthly payment", values: ["Constant (minimums + extra)", "Constant (minimums + extra)"] },
          ]}
        />

        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
          <h2>How to accelerate your payoff</h2>
          <p>
            The single biggest lever is the extra monthly payment — even $50 above your minimums
            shortens most timelines by years, because every extra dollar goes straight to
            principal. Beyond that: apply windfalls (tax refunds, bonuses) directly to your target
            debt; call your card issuers and ask for a rate reduction — long-time customers with
            on-time histories are sometimes granted one; and if your credit is still strong, a{" "}
            <Link href="/debt-consolidation">consolidation loan</Link> at a lower APR can turn the
            same monthly budget into a much faster payoff. The{" "}
            <a
              href="https://consumer.ftc.gov/articles/getting-out-debt"
              target="_blank"
              rel="noopener noreferrer"
            >
              FTC's guide to getting out of debt
            </a>{" "}
            also covers free and low-cost credit counseling options worth knowing about.
          </p>
        </div>

        <CommonMistakes
          items={[
            {
              mistake: "Paying extra across all debts instead of concentrating on one target",
              reality: "Spreading extra money thin means no account closes early and no minimum ever rolls over. Concentration is the entire mechanism that makes both methods work.",
            },
            {
              mistake: "Continuing to use the cards you're paying down",
              reality: "New charges silently undo your extra payments. Pause card use during payoff — or the calculator's timeline will keep moving away from you.",
            },
            {
              mistake: "Draining your emergency buffer to zero for a faster payoff",
              reality: "With no buffer, the next car repair goes straight back on a card at 25% APR. Keep a small cushion so one surprise doesn't restart the cycle.",
            },
            {
              mistake: "Sticking with a plan whose minimums don't even cover interest",
              reality: "If balances grow despite on-time payments, you don't have a strategy problem — you have a structural one. That's when settlement or a debt management plan is worth a serious look. Under the FDCPA, you also have specific rights if accounts reach collections — the CFPB explains them clearly.",
            },
          ]}
        />

        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
          <h2>When a payoff plan isn't enough</h2>
          <p>
            Payoff strategies assume your income can cover minimums plus something extra. If it
            can't — if you're choosing between payments and groceries, or accounts are already
            60+ days behind — the smarter move is usually{" "}
            <Link href="/debt-relief">debt relief</Link>: settlement, consolidation, or a
            nonprofit management plan. Know your rights first: the{" "}
            <a
              href="https://www.consumerfinance.gov/consumer-tools/debt-collection/"
              target="_blank"
              rel="noopener noreferrer"
            >
              CFPB's debt collection resources
            </a>{" "}
            explain what collectors can and cannot do, and the{" "}
            <a
              href="https://www.ftc.gov/business-guidance/resources/complying-telemarketing-sales-rule"
              target="_blank"
              rel="noopener noreferrer"
            >
              FTC's Telemarketing Sales Rule
            </a>{" "}
            prohibits settlement companies from charging fees before they actually settle a debt —
            a useful screen for spotting legitimate help.
          </p>
        </div>

        <NextSteps
          steps={[
            { label: "Estimate settlement savings with the Debt Settlement Calculator", href: "/debt-settlement-calculator" },
            { label: "Compare debt relief vs. a consolidation loan", href: "/debt-settlement-vs-debt-consolidation" },
            { label: "Speak with a free, no-obligation specialist", href: "/get-help" },
          ]}
        />
      </section>

      {/* ── FAQ (visible + already in schema above) ── */}
      <FAQ items={FAQS} title="Debt payoff questions, answered" />

      <RelatedResources groups={RELATED} />
      <TrustBox />
    </>
  );
}
