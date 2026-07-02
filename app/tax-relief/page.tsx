import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
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
  TAX_RELIEF_RELATED,
} from "@/components/RelatedResources";
import { TrustBox } from "@/components/TrustBox";
import { TrustSignals } from "@/components/TrustSignals";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/schema";

const CANONICAL = "https://www.wehelpfinance.com/tax-relief";

export const metadata: Metadata = {
  title: "Tax Relief - IRS Back Tax Help & Resolution Options | WeHelpFinance",
  description:
    "A complete guide to IRS tax relief in 2026: Offer in Compromise, installment agreements, Currently Not Collectible status, and penalty abatement compared. Free specialist consultation.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Tax Relief | WeHelpFinance",
    description:
      "Compare IRS resolution options: Offer in Compromise, installment agreements, and more. Free, no-obligation specialist consultation.",
    url: CANONICAL,
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
};

const FAQS = [
  {
    q: "What is tax relief?",
    a: "Tax relief refers to IRS-recognized programs that reduce, restructure, or delay what you owe in back taxes.",
  },
  {
    q: "What is an Offer in Compromise?",
    a: "An Offer in Compromise lets you settle tax debt for less than the full amount if the IRS agrees you cannot reasonably pay the full balance.",
  },
  {
    q: "How long does IRS tax debt resolution take?",
    a: "Installment agreements can often be set up within weeks. Offers in Compromise often take 6 to 12 months for review.",
  },
  {
    q: "Does the IRS forgive tax debt?",
    a: "The IRS may reduce debt through an accepted Offer in Compromise, but approval is based on documented ability to pay.",
  },
  {
    q: "Will tax relief stop wage garnishment or a bank levy?",
    a: "Recognized IRS resolutions can often stop or prevent levy action once approved or formally set up.",
  },
  {
    q: "Do I need a tax attorney?",
    a: "Standard IRS resolution may be handled by qualified tax specialists. Complex legal or criminal issues should be reviewed by a tax attorney.",
  },
];

export default function TaxReliefPage() {
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
              { name: "Tax Relief", path: "/tax-relief" },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            serviceJsonLd({
              name: "Tax Relief Matching Service",
              description:
                "Free service connecting consumers with vetted tax relief specialists for IRS back tax resolution.",
              path: "/tax-relief",
              serviceType: "Tax Relief",
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
              <span data-current="true">Tax Relief</span>
            </nav>
            <h1 className="mt-4">Tax Relief - IRS Back Tax Help</h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Owing back taxes to the IRS is stressful, but there are recognized
              resolution paths from payment plans to settling for less than you
              owe.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                "Compare Offer in Compromise, installment agreements, and CNC status",
                "Free, confidential consultation - no obligation",
                "Vetted specialists experienced with IRS resolution",
                "Understand options before garnishment or levy action escalates",
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
          </div>
          <div id="get-help" className="lg:sticky lg:top-24">
            <LeadForm defaultCategory="tax-relief" />
          </div>
        </div>
      </section>

      <section className="container-page max-w-5xl py-8">
        <TrustSignals variant="compact" />
      </section>

      <section className="container-page max-w-4xl py-8">
        <Content>
          <h2>What "Tax Relief" Actually Covers</h2>
          <p>
            Tax relief is a set of IRS-recognized paths for resolving back taxes
            you cannot pay in full immediately. Common options include Offer in
            Compromise, Installment Agreement, Currently Not Collectible status,
            and penalty abatement.
          </p>
          <KeyTakeaway>
            <strong>In short:</strong> if you can pay over time but not all at
            once, an installment agreement is usually fastest. If you cannot pay
            even over time, an Offer in Compromise or CNC status may apply, but
            both require documentation.
          </KeyTakeaway>
          <h2>Comparing Your Options</h2>
        </Content>
        <ComparisonTable
          title="Offer in Compromise vs. Installment Agreement vs. CNC Status"
          columns={[
            "Offer in Compromise",
            "Installment Agreement",
            "Currently Not Collectible",
          ]}
          rows={[
            {
              label: "What it does",
              values: [
                "Settles for less than owed",
                "Monthly payment plan",
                "Pauses collection temporarily",
              ],
            },
            {
              label: "Approval timeline",
              values: [
                "6-12 months",
                "Often weeks",
                "Can be faster with clear hardship",
              ],
            },
            {
              label: "Reduces total owed?",
              values: ["Yes, if accepted", "No", "No"],
            },
            {
              label: "Requires disclosure",
              values: [
                "Extensive",
                "Basic to moderate",
                "Extensive hardship documentation",
              ],
            },
            {
              label: "Best for",
              values: [
                "Cannot pay full amount",
                "Can pay over time",
                "Severe hardship",
              ],
            },
            {
              label: "Stops levy/garnishment?",
              values: [
                "Often once accepted",
                "Often once set up",
                "Often while active",
              ],
            },
          ]}
        />
        <Content>
          <h2>How the Resolution Process Works, Step by Step</h2>
        </Content>
        <ProcessTimeline
          steps={[
            {
              label: "Free consultation & case review",
              timeframe: "Day 1",
              description:
                "A specialist reviews total tax debt, tax years, income, and assets.",
            },
            {
              label: "Determine eligibility",
              timeframe: "Week 1-2",
              description:
                "Your collection potential is estimated to identify viable IRS paths.",
            },
            {
              label: "Prepare and file",
              timeframe: "Weeks 2-6",
              description:
                "Required IRS forms and financial documentation are prepared.",
            },
            {
              label: "IRS review",
              timeframe: "Weeks to months",
              description:
                "Installment agreements can move quickly; Offers in Compromise require formal review.",
            },
            {
              label: "Resolution",
              timeframe: "Varies",
              description:
                "Once approved, you begin payments or pay the accepted reduced amount.",
            },
          ]}
        />
        <Content>
          <h2>Advantages and Trade-offs</h2>
        </Content>
        <ProsCons
          pros={[
            "Formal IRS-recognized programs",
            "Can stop or prevent levies once approved",
            "Accepted OIC can reduce total amount owed",
            "Installment agreements can be fast for simple cases",
          ]}
          cons={[
            "OIC approval is not guaranteed",
            "Interest and penalties may continue",
            "Detailed financial disclosure is required",
            "OIC review can take months",
          ]}
        />
        <Content>
          <h2>Who Should Consider Tax Relief - and Who Should Not</h2>
        </Content>
        <WhoShouldUse
          shouldUse={[
            "You owe back taxes you cannot pay now",
            "You are facing or anticipating IRS collection",
            "Your finances may support hardship eligibility",
            "Collection actions are escalating",
          ]}
          shouldAvoid={[
            "You can pay in full or through a simple short-term plan",
            "You have many unfiled returns needing compliance first",
            "You face potential criminal exposure",
            "The debt is modest and recent enough to resolve directly",
          ]}
        />
        <Content>
          <h2>Qualification Criteria</h2>
        </Content>
        <QualificationCriteria
          items={[
            {
              label: "Required tax returns must be filed",
              detail:
                "The IRS generally requires filing compliance before formal relief.",
            },
            {
              label: "Collection potential supports the request",
              detail:
                "OIC offers are evaluated against IRS ability-to-pay calculations.",
            },
            {
              label: "No open bankruptcy proceeding",
              detail: "Tax resolution in bankruptcy follows separate rules.",
            },
            {
              label: "Documented hardship",
              detail:
                "CNC status and OIC relief require income, bank, asset, and expense documentation.",
            },
          ]}
        />
        <Content>
          <h2>Common Mistakes to Avoid</h2>
        </Content>
        <CommonMistakes
          items={[
            {
              mistake: "Ignoring IRS notices until levy action begins",
              reality: "Responding earlier preserves more options.",
            },
            {
              mistake: "Assuming OIC approval is automatic",
              reality: "The IRS uses its own collection potential formula.",
            },
            {
              mistake: "Not filing required tax returns first",
              reality: "Unfiled returns usually block formal resolution.",
            },
            {
              mistake: "Paying large upfront fees for vague promises",
              reality:
                "Legitimate tax resolution starts with eligibility review.",
            },
          ]}
        />
        <Content>
          <h2>Your Rights as a Taxpayer</h2>
          <p>
            The IRS{" "}
            <a
              href="https://www.irs.gov/taxpayer-bill-of-rights"
              target="_blank"
              rel="noopener noreferrer"
            >
              Taxpayer Bill of Rights
            </a>{" "}
            protects taxpayers throughout the process. You can also review
            official details on{" "}
            <a
              href="https://www.irs.gov/payments/offer-in-compromise"
              target="_blank"
              rel="noopener noreferrer"
            >
              Offers in Compromise at IRS.gov
            </a>
            .
          </p>
        </Content>
        <NextSteps
          steps={[
            {
              label:
                "Read about debt relief options if you also have consumer debt",
              href: "/debt-relief",
            },
            {
              label: "Compare personal loan options for non-tax debt",
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
      <RelatedResources groups={TAX_RELIEF_RELATED} />
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
