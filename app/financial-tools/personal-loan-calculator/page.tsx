import type { Metadata } from "next";
import Link from "next/link";
import { PersonalLoanCalculator } from "@/components/tools/PersonalLoanCalculator";
import { TrustSignals } from "@/components/TrustSignals";
import { TrustBox } from "@/components/TrustBox";
import { FAQ } from "@/components/FAQ";
import { RelatedResources } from "@/components/RelatedResources";
import type { ResourceGroup } from "@/components/RelatedResources";
import {
  KeyTakeaway,
  CommonMistakes,
  NextSteps,
} from "@/components/ContentAuthorityBlocks";
import { faqJsonLd, breadcrumbJsonLd, howToJsonLd } from "@/lib/schema";
import { CheckCircle2 } from "lucide-react";
import { DEFAULT_OG_IMAGE } from "@/lib/organizationConfig";

const CANONICAL =
  "https://www.wehelpfinance.com/financial-tools/personal-loan-calculator";

export const metadata: Metadata = {
  title:
    "Personal Loan Calculator — Payment, APR Range & Eligibility Estimate | WeHelpFinance",
  description:
    "Free personal loan calculator. Estimate your monthly payment, realistic APR range by credit score, DTI before and after the loan, and whether a loan beats settlement or refinancing. No sign-up.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title:
      "Free Personal Loan Eligibility & Payment Calculator | WeHelpFinance",
    description:
      "See a realistic APR range for your credit profile, your payment, and your DTI after the loan — plus how a loan compares with settlement or refinancing. Free, private, no sign-up.",
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
    title: "Personal Loan Calculator | WeHelpFinance",
    description:
      "Payment, APR range, and eligibility estimate for your credit profile — in 2 minutes, no sign-up.",
    images: [DEFAULT_OG_IMAGE],
  },
};

const FAQS = [
  {
    q: "What credit score do I need for a personal loan?",
    a: "There's no universal cutoff — each lender sets its own floor, and many advertise minimums around 580–640 while pricing heavily by score. In practice: 720+ profiles see the widest access and the lowest advertised rates; 660–719 is mainstream-approvable at mid-range pricing; 600–659 narrows to fewer lenders at meaningfully higher APRs; below 600, unsecured options thin out and secured or co-signed structures become more realistic. Score is also only one input — DTI, income stability, and recent payment history move decisions just as hard.",
  },
  {
    q: "What's a realistic APR on a personal loan right now?",
    a: 'Advertised ranges run roughly from around 7–8% for the strongest profiles to about 36% at most mainstream lenders (36% is a common self-imposed ceiling tied to state usury norms). The single-digit teaser rates in ads typically require excellent credit, low DTI, and often autopay from a checking account. This calculator shows a band-appropriate range rather than one number, because the honest answer to "what rate will I get" is always a range until a lender underwrites you.',
  },
  {
    q: "Does taking a personal loan hurt my credit score?",
    a: "Briefly and modestly, then often the reverse. The application adds a hard inquiry (small, temporary dip) and the new account lowers your average account age. But if you're consolidating credit cards, your revolving utilization can drop sharply — frequently a larger positive than the inquiry's negative — and on-time installment payments build history. The pattern many consolidators see is a small dip for one or two cycles, then improvement, provided the freed-up cards aren't re-spent.",
  },
  {
    q: "Is a personal loan better than debt settlement?",
    a: "They solve different problems. A consolidation loan repays 100% of what you owe at a lower, fixed rate — it needs approval, works best with fair-or-better credit, and leaves credit intact or improved. Settlement targets paying less than the full balance on debt that's already unmanageable — no approval needed, but it typically requires accounts to go delinquent, damages credit significantly while underway, and settled amounts can be taxable. Broadly: if you can qualify for a loan whose payment you can afford, the loan is usually the cleaner path; settlement is for when qualifying or affording full repayment isn't realistic.",
  },
  {
    q: "Why does my debt-to-income ratio matter for a loan?",
    a: "Because it's the lender's affordability math. DTI is your monthly debt payments divided by gross monthly income, and a new loan payment lands in the numerator. Many personal-loan underwriters get selective above roughly 40% and few stretch past 50%. The twist with consolidation: if the loan replaces existing payments rather than adding one, your DTI can stay flat or improve — which is why this calculator computes DTI both ways depending on your stated purpose.",
  },
  {
    q: "Can I get a personal loan while unemployed or behind on payments?",
    a: "It's substantially harder, because lenders verify repayment ability and recent payment behavior. Without employment income, some lenders consider documented benefits, retirement, or a co-signer's income. Recent delinquency (60+ days) is one of the heaviest negatives in underwriting. Neither situation makes it impossible — but in both, comparing non-loan paths (hardship programs, debt management plans, settlement for eligible unsecured debt) alongside loan offers usually gives a truer picture of the workable options.",
  },
];

const HOWTO_STEPS = [
  {
    name: "Describe the loan",
    text: "Enter the amount you're considering, what it's for, and the term you'd want — 24 to 84 months.",
  },
  {
    name: "Describe your finances",
    text: "Gross monthly income, existing monthly debt payments, credit score range, employment, homeowner status, and whether current debts are being paid on time.",
  },
  {
    name: "Read your estimate",
    text: "See a realistic APR range for your credit band, the payment at a typical rate, total interest, and your DTI before and after the loan.",
  },
  {
    name: "Compare the paths",
    text: "Review the side-by-side against continuing current payments (and settlement where relevant), then the ranked options worth exploring — with the reasoning for each.",
  },
];

const RELATED: ResourceGroup[] = [
  {
    heading: "More Tools",
    links: [
      { href: "/financial-tools/dti-calculator", label: "DTI Calculator" },
      {
        href: "/financial-tools/debt-solutions-comparison",
        label: "Debt Solutions Comparison",
      },
      {
        href: "/debt-settlement-calculator",
        label: "Debt Settlement Calculator",
      },
      { href: "/financial-tools", label: "All Financial Tools" },
    ],
  },
  {
    heading: "Related Services",
    links: [
      { href: "/personal-loans", label: "Personal Loans" },
      { href: "/debt-consolidation", label: "Debt Consolidation" },
      { href: "/debt-relief", label: "Debt Relief" },
    ],
  },
  {
    heading: "Learn More",
    links: [
      {
        href: "/debt-settlement-vs-debt-consolidation",
        label: "Settlement vs. Consolidation",
      },
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
              {
                name: "Financial Tools",
                path: "https://www.wehelpfinance.com/financial-tools",
              },
              { name: "Personal Loan Calculator", path: CANONICAL },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            howToJsonLd({
              name: "How to estimate a personal loan payment and eligibility",
              description:
                "Use the free WeHelpFinance Personal Loan Calculator to see a realistic APR range for your credit profile, your monthly payment, and your DTI after the loan.",
              steps: HOWTO_STEPS,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Personal Loan Eligibility & Payment Calculator",
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
          <nav
            className="mb-6 text-sm text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/financial-tools" className="hover:text-primary">
              Financial Tools
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Personal Loan Calculator</span>
          </nav>

          <span className="inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            Free Tool · No Sign-Up
          </span>
          <h1 className="mt-4">
            Personal Loan Eligibility &amp; Payment Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            A realistic APR range for your credit profile — not a teaser rate —
            plus your payment, total interest, and your DTI before and after the
            loan. Then an honest comparison against the other ways to handle the
            same dollars.
          </p>

          <ul className="mt-6 grid gap-2.5 sm:grid-cols-3">
            {[
              "APR ranges by credit band",
              "DTI before & after the loan",
              "Nothing saved or submitted",
            ].map((b) => (
              <li
                key={b}
                className="flex items-center gap-2 text-sm text-foreground/90"
              >
                <CheckCircle2
                  className="h-4 w-4 shrink-0 text-success"
                  aria-hidden="true"
                />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Calculator ── */}
      <section
        className="container-page py-10"
        aria-label="Personal loan calculator"
      >
        <PersonalLoanCalculator />
      </section>

      <section className="container-page max-w-5xl pb-4">
        <TrustSignals variant="compact" />
      </section>

      {/* ── Educational content ── */}
      <section className="container-page max-w-4xl py-10">
        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
          <h2>How personal loan pricing actually works</h2>
          <p>
            A personal loan is an unsecured installment loan: fixed amount,
            fixed rate, fixed payment, fixed end date. Because there&rsquo;s no
            collateral, the rate <em>is</em> the lender&rsquo;s risk model —
            which is why quoted APRs run from single digits for the strongest
            profiles to the mid-30s at the other end. Three inputs do most of
            the pricing work: your <strong>credit band</strong> (the headline),
            your <strong>debt-to-income ratio</strong> (the affordability math),
            and <strong>recent payment history</strong> (the behavior signal).
            This calculator estimates a range for your band instead of a single
            number, because until a lender underwrites your actual file, a range
            is the only honest answer.
          </p>

          <h2>The DTI twist most loan calculators skip</h2>
          <p>
            Every new loan payment lands in the numerator of your debt-to-income
            ratio — so a loan for a purchase <em>raises</em> your DTI. But a{" "}
            <strong>consolidation</strong> loan replaces existing payments, so
            your DTI can hold flat or improve even though you&rsquo;ve
            technically added an account. That distinction decides whether the
            loan helps or hurts your next application (especially a mortgage),
            which is why this tool computes your after-loan DTI differently
            depending on the purpose you select — the same way an underwriter
            reasons about it.
          </p>

          <h2>When a loan beats settlement — and when it doesn&rsquo;t</h2>
          <p>
            A consolidation loan repays <strong>100 cents on the dollar</strong>{" "}
            at a better rate: it needs approval and works when the payment fits
            your budget, and it protects (often improves) your credit.
            Settlement pays <strong>less than you owe</strong> on debt
            that&rsquo;s already unmanageable: no approval needed, but accounts
            typically must fall delinquent first, credit takes significant
            damage while it runs, and forgiven amounts can be taxable. The
            honest decision rule: if you can qualify for a loan whose payment
            you can sustain, the loan is usually the cleaner path. If qualifying
            or sustaining full repayment isn&rsquo;t realistic, that&rsquo;s the
            situation settlement exists for — and the comparison panel above
            shows both, priced with the same engine our settlement calculator
            uses.
          </p>

          <h2>The homeowner angle</h2>
          <p>
            If you own a home with equity, a cash-out refinance or home-equity
            option can price well below unsecured rates — secured debt is
            cheaper debt. The catch is the one mortgage lenders will apply to
            you: they weigh <strong>both</strong> credit and DTI, so strong
            credit with a stretched DTI often needs the monthly-obligation side
            fixed first. That&rsquo;s the specific situation where consolidating
            or resolving unsecured debt <em>before</em> the refinance
            application changes the outcome — and why the recommendation panel
            raises it only when your entries actually fit that pattern.
          </p>
        </div>

        <KeyTakeaway>
          <strong>The monthly payment is not the price — the total is.</strong>{" "}
          A longer term buys a smaller payment and a bigger interest bill; a
          shorter term does the reverse. Decide with both numbers on the table,
          and always compare the loan against the paths that don&rsquo;t require
          borrowing at all.
        </KeyTakeaway>

        <CommonMistakes
          items={[
            {
              mistake:
                "Shopping the monthly payment instead of the APR and total",
              reality:
                "Stretching $15,000 from 36 to 84 months can cut the payment nearly in half while multiplying the interest cost. The payment is cash flow; the APR and total repayment are the price.",
            },
            {
              mistake: "Assuming the advertised rate is your rate",
              reality:
                "Advertised APRs are the best-profile floor. Most approved borrowers price above it — prequalify with several lenders (soft pull) and compare real offers, not ads.",
            },
            {
              mistake:
                "Consolidating cards, then re-spending the cleared limits",
              reality:
                "The loan moves the debt; it doesn't remove the habit that built it. Running the cards back up leaves you with the loan AND the balances — the one outcome worse than either alone.",
            },
            {
              mistake: "Ignoring origination fees",
              reality:
                "Many lenders deduct 1–10% from the disbursed amount up front. A $15,000 loan at a 5% fee delivers $14,250 — if you need the full amount, you must borrow more, and the APR you compare must include the fee.",
            },
          ]}
        />

        <div className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-foreground/90 prose-p:leading-relaxed">
          <h2>Authoritative references</h2>
          <p>
            The CFPB&rsquo;s plain-English explainer,{" "}
            <a
              href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-personal-installment-loan-en-2114/"
              target="_blank"
              rel="noopener noreferrer"
            >
              &ldquo;What is a personal installment loan?&rdquo;
            </a>
            , covers how these loans are structured and what to check before
            signing. For market-level rates, the Federal Reserve&rsquo;s{" "}
            <a
              href="https://www.federalreserve.gov/releases/g19/current/"
              target="_blank"
              rel="noopener noreferrer"
            >
              G.19 Consumer Credit release
            </a>{" "}
            publishes the average rate on 24-month personal loans each quarter —
            a useful sanity check against any quote. And because this page
            compares loans with settlement, the FTC&rsquo;s{" "}
            <a
              href="https://www.ftc.gov/business-guidance/resources/complying-telemarketing-sales-rule"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telemarketing Sales Rule guidance
            </a>{" "}
            documents the advance-fee ban our settlement math assumes:
            settlement fees are collectible only after a debt actually settles.
          </p>
        </div>

        <NextSteps
          steps={[
            {
              label: "Check your DTI the way lenders compute it",
              href: "/financial-tools/dti-calculator",
            },
            {
              label: "Compare all five debt-relief paths side by side",
              href: "/financial-tools/debt-solutions-comparison",
            },
            {
              label: "Talk it through with a free specialist",
              href: "/get-help",
            },
          ]}
        />
      </section>

      {/* ── FAQ (visible + in schema) ── */}
      <FAQ items={FAQS} title="Personal loan questions, answered" />

      <RelatedResources groups={RELATED} />
      <TrustBox />
    </>
  );
}
