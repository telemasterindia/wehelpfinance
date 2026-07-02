import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, CheckCircle2 } from "lucide-react";
import {
  CommonMistakes,
  ComparisonTable,
  KeyTakeaway,
  NextSteps,
  ProcessTimeline,
  ProsCons,
  QualificationCriteria,
  WhoShouldUse,
} from "@/components/ContentAuthorityBlocks";
import { LeadForm } from "@/components/LeadForm";
import {
  RelatedResources,
  DEBT_RELIEF_RELATED,
} from "@/components/RelatedResources";
import { TrustBox } from "@/components/TrustBox";
import { TrustSignals } from "@/components/TrustSignals";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/schema";

const CANONICAL = "https://www.wehelpfinance.com/debt-relief";

export const metadata: Metadata = {
  title: "Debt Relief Help - Compare Your Real Options | WeHelpFinance",
  description:
    "A complete guide to debt relief options in 2026: debt settlement, debt consolidation, and debt management plans compared. Qualification criteria, real timelines, and a free specialist consultation.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Debt Relief Help | WeHelpFinance",
    description:
      "Compare debt settlement, consolidation, and management plans. Free, no-obligation specialist consultation.",
    url: CANONICAL,
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
};

const FAQS = [
  {
    q: "What is debt relief?",
    a: "Debt relief is an umbrella term for strategies that reduce what you owe or make it more manageable, including debt settlement, debt consolidation, and nonprofit debt management plans.",
  },
  {
    q: "How does debt settlement work?",
    a: "A specialist negotiates with creditors to accept less than the full balance. You typically deposit funds into a dedicated account until each settlement can be funded.",
  },
  {
    q: "Will debt relief hurt my credit score?",
    a: "Debt settlement and management plans can affect credit differently. Settlement usually has the largest short-term impact because accounts often become delinquent before resolution.",
  },
  {
    q: "How much debt do I need to qualify?",
    a: "Most debt settlement programs are most practical for consumers with at least $7,500 to $10,000 in unsecured debt because fees can outweigh savings on smaller balances.",
  },
  {
    q: "What is the difference between debt relief and bankruptcy?",
    a: "Debt relief options are negotiated outside court. Bankruptcy is a federal legal process that may discharge or restructure debt but has a longer-lasting credit and public-record impact.",
  },
  {
    q: "Is debt relief the same as a debt consolidation loan?",
    a: "No. Consolidation combines debts into a new loan. Settlement negotiates existing balances down and is usually used when payments are already unaffordable.",
  },
];

export default function DebtReliefPage() {
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
              { name: "Home", path: "/" },
              { name: "Debt Relief", path: "/debt-relief" },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceJsonLd({
              name: "Debt Relief Matching Service",
              description:
                "Free service connecting consumers with vetted debt relief specialists for debt settlement, consolidation, and management plan options.",
              path: "/debt-relief",
              serviceType: "Debt Relief",
            }),
          ),
        }}
      />

      <section className="bg-gradient-to-b from-primary-soft/40 to-background">
        <div className="container-page grid gap-10 pb-16 pt-12 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-12">
          <div>
            <nav className="breadcrumb-nav" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span data-current="true">Debt Relief</span>
            </nav>
            <h1 className="mt-4">
              Debt Relief Help - Compare Your Real Options
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              If credit cards, medical bills, or personal loans feel like they
              are stacking faster than you can pay them down, you have options
              and a specialist can help you find the right one.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                "Compare debt settlement, consolidation, and management plans",
                "Free, confidential consultation - no obligation",
                "Vetted specialists matched to your specific situation",
                "No upfront fees to speak with a specialist",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px]">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-success"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/debt-settlement-calculator"
              className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-full border border-primary bg-background px-5 text-sm font-semibold text-primary transition hover:bg-primary-soft"
            >
              <Calculator className="h-4 w-4" aria-hidden="true" />
              See what you could save with our calculator
            </Link>
          </div>
          <div id="get-help" className="lg:sticky lg:top-24">
            <LeadForm defaultCategory="debt-relief" />
          </div>
        </div>
      </section>

      <section className="container-page max-w-5xl py-8">
        <TrustSignals variant="compact" />
      </section>

      <section className="container-page max-w-4xl py-8">
        <Content>
          <h2>What "Debt Relief" Actually Means</h2>
          <p>
            Debt relief is not one product. It is a category of strategies for
            reducing or restructuring debt you are struggling to repay. The
            three most common paths are debt settlement, debt consolidation, and
            nonprofit debt management plans.
          </p>
          <KeyTakeaway>
            <strong>In short:</strong> if your accounts are current and your
            credit is reasonably good, consolidation usually makes more sense.
            If you are already behind and cannot qualify for a low-rate loan,
            settlement or a management plan may be more realistic.
          </KeyTakeaway>
          <h2>Comparing Your Options</h2>
          <p>
            Each debt relief path trades speed, cost, and credit impact
            differently.
          </p>
        </Content>
        <ComparisonTable
          title="Debt Settlement vs. Consolidation vs. Management Plan"
          columns={["Debt Settlement", "Debt Consolidation", "Management Plan"]}
          rows={[
            {
              label: "What it does",
              values: [
                "Negotiates to pay less than owed",
                "New loan pays off old debts",
                "Nonprofit negotiates lower rates",
              ],
            },
            {
              label: "Credit score needed",
              values: [
                "None - works with poor credit",
                "Typically 600+",
                "None - works with poor credit",
              ],
            },
            {
              label: "Typical timeline",
              values: ["24-48 months", "2-7 years", "3-5 years"],
            },
            {
              label: "Credit impact",
              values: [
                "Significant, temporary",
                "Minimal if payments stay current",
                "Moderate",
              ],
            },
            {
              label: "Best for",
              values: [
                "Genuine hardship",
                "Good credit and lower-rate access",
                "Pay full balance at lower rate",
              ],
            },
            {
              label: "Typical cost",
              values: [
                "15-25% of enrolled debt",
                "Interest over loan term",
                "Small monthly fee",
              ],
            },
          ]}
        />
        <Content>
          <h2>How Debt Settlement Works, Step by Step</h2>
          <p>
            Debt settlement is the option many consumers ask about first, so the
            process matters.
          </p>
        </Content>
        <ProcessTimeline
          steps={[
            {
              label: "Free consultation",
              timeframe: "Day 1",
              description:
                "A specialist reviews your total debt, income, and delinquency status.",
            },
            {
              label: "Enrollment",
              timeframe: "Week 1",
              description:
                "Qualifying unsecured debts such as credit cards, personal loans, and medical bills are enrolled.",
            },
            {
              label: "Building the settlement fund",
              timeframe: "Months 1-12+",
              description:
                "You deposit funds into a dedicated account. Under the FTC Telemarketing Sales Rule, settlement companies cannot charge fees until they settle an account.",
            },
            {
              label: "Negotiation",
              timeframe: "Varies",
              description:
                "As funds accumulate, the specialist negotiates with each creditor individually.",
            },
            {
              label: "Resolution",
              timeframe: "24-48 months",
              description:
                "Once enrolled accounts are settled and paid, the program concludes.",
            },
          ]}
        />
        <Content>
          <p>
            Under the{" "}
            <a
              href="https://www.ftc.gov/business-guidance/resources/complying-telemarketing-sales-rule"
              target="_blank"
              rel="noopener noreferrer"
            >
              FTC Telemarketing Sales Rule
            </a>
            , debt settlement companies are prohibited from collecting fees
            before they actually settle a debt.
          </p>
          <h2>Advantages and Trade-offs</h2>
        </Content>
        <ProsCons
          pros={[
            "Can reduce total debt owed",
            "No minimum credit score required to start",
            "Faster resolution than minimum payments",
            "One specialist negotiates across enrolled accounts",
          ]}
          cons={[
            "Credit impact during the program",
            "Accounts typically become delinquent before settlement",
            "Forgiven debt may be taxable in some cases",
            "Not all creditors agree to settle",
          ]}
        />
        <Content>
          <h2>Who Should Consider Debt Relief - and Who Should Not</h2>
        </Content>
        <WhoShouldUse
          shouldUse={[
            "You have $7,500+ in unsecured debt",
            "You are experiencing genuine financial hardship",
            "You are already behind or likely to fall behind",
            "Minimum payments would take years to clear",
          ]}
          shouldAvoid={[
            "Your accounts are current and credit score is 660+",
            "Your unsecured debt is under $7,500",
            "Your primary debt is federal student loans",
            "Debt is so severe that bankruptcy advice may be needed",
          ]}
        />
        <Content>
          <h2>Qualification Criteria</h2>
        </Content>
        <QualificationCriteria
          items={[
            {
              label: "Unsecured debt of $7,500 or more",
              detail:
                "Below this threshold, program fees can outweigh savings.",
            },
            {
              label: "Genuine financial hardship",
              detail:
                "Specialists assess whether minimum payments are realistically affordable.",
            },
            {
              label: "Primarily unsecured debt types",
              detail:
                "Credit cards, personal loans, and medical bills may qualify.",
            },
            {
              label: "Ability to make program deposits",
              detail:
                "Monthly deposits are assessed during the free consultation.",
            },
          ]}
        />
        <Content>
          <h2>Common Mistakes to Avoid</h2>
        </Content>
        <CommonMistakes
          items={[
            {
              mistake: "Paying upfront before any account is settled",
              reality:
                "Legitimate companies collect fees only after successfully settling an account.",
            },
            {
              mistake:
                "Making partial payments on old debts without checking limitations",
              reality:
                "A small payment can restart some state limitation periods.",
            },
            {
              mistake: "Assuming settlement and credit counseling are the same",
              reality:
                "Credit counseling pays the full balance at lower rates; settlement reduces the balance.",
            },
            {
              mistake: "Ignoring how settlement reports to credit bureaus",
              reality:
                "Settled accounts can remain on credit reports for up to seven years.",
            },
          ]}
        />
        <Content>
          <h2>Your Rights During the Process</h2>
          <p>
            Federal law protects consumers during debt collection. The{" "}
            <a
              href="https://www.consumerfinance.gov/consumer-tools/debt-collection/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Consumer Financial Protection Bureau
            </a>{" "}
            provides free resources for understanding your rights under the
            FDCPA.
          </p>
        </Content>
        <NextSteps
          steps={[
            {
              label: "Estimate savings with the Debt Settlement Calculator",
              href: "/debt-settlement-calculator",
            },
            {
              label: "Compare debt relief vs. personal loan options",
              href: "/personal-loans",
            },
            {
              label: "Speak with a free, no-obligation specialist",
              href: "#get-help",
            },
          ]}
        />
      </section>

      <FaqBlock />
      <RelatedResources groups={DEBT_RELIEF_RELATED} />
      <TrustBox />
    </>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4 text-foreground/90 [&_a]:text-primary [&_a]:underline [&_h2]:mt-8 [&_p]:leading-relaxed">
      {children}
    </div>
  );
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
              <ArrowRight
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90"
                aria-hidden="true"
              />
            </summary>
            <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
