import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import type { FAQItem } from "@/components/FAQ";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "IRS Debt Relief — Stop Collections & Resolve Tax Debt | WeHelpFinance",
  description: "Received an IRS notice or facing wage garnishment? Explore IRS debt relief options including Offer in Compromise, payment plans, and penalty abatement. Free consultation.",
  alternates: { canonical: "https://wehelpfinance.com/irs-debt-relief" },
  openGraph: {
    title: "IRS Debt Relief — Stop Collections & Resolve Tax Debt | WeHelpFinance",
    description: "Resolve IRS tax debt with a vetted specialist. Offer in Compromise, payment plans, levy release and more. Free, confidential consultation.",
    url: "https://wehelpfinance.com/irs-debt-relief",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IRS Debt Relief — Stop Collections & Resolve Tax Debt | WeHelpFinance",
    description: "Resolve IRS tax debt. Free consultation with vetted tax relief specialists.",
  },
};

const FAQS: FAQItem[] = [
  {
    q: "What is IRS debt relief?",
    a: "IRS debt relief refers to a range of programs and strategies that help taxpayers resolve outstanding federal tax debt. Options include Offer in Compromise (settling for less than owed), Installment Agreements (monthly payment plans), Currently Not Collectible status, penalty abatement, and Innocent Spouse Relief.",
  },
  {
    q: "What is an Offer in Compromise?",
    a: "An Offer in Compromise (OIC) is an IRS program that allows qualifying taxpayers to settle their tax debt for less than the full amount owed. Qualification is based on your income, expenses, assets, and ability to pay. Not everyone qualifies, but a specialist can evaluate your eligibility.",
  },
  {
    q: "Can the IRS garnish my wages?",
    a: "Yes. The IRS can issue a wage levy that requires your employer to withhold a portion of your paycheck until your tax debt is paid. Unlike creditor garnishments, the IRS does not need a court order. A tax relief specialist can often get a levy released quickly once a resolution plan is in place.",
  },
  {
    q: "What should I do if I receive an IRS notice?",
    a: "Do not ignore it. IRS notices have strict response deadlines, and missing them can result in additional penalties and enforcement actions including levies and liens. Read the notice carefully, note the response deadline, and contact a tax professional promptly.",
  },
  {
    q: "What is an IRS payment plan?",
    a: "An IRS Installment Agreement allows you to pay your tax debt over time in monthly payments. Short-term plans (up to 180 days) and long-term plans (up to 72 months) are available. The IRS Fresh Start program has expanded access to installment agreements for many taxpayers.",
  },
  {
    q: "Can the IRS take my house or bank account?",
    a: "The IRS can place a lien on your property and, in serious cases, levy your bank account or seize assets. However, these actions typically follow a long notice process. A tax relief specialist can intervene before enforcement actions escalate.",
  },
  {
    q: "What is penalty abatement?",
    a: "Penalty abatement is a request to have IRS penalties removed or reduced. First-time penalty abatement is available to taxpayers with a clean compliance history. Reasonable cause abatement may be granted if you can demonstrate circumstances outside your control caused the failure to file or pay.",
  },
  {
    q: "Is WeHelpFinance a tax firm or IRS-licensed agency?",
    a: "No. WeHelpFinance is a free matching service. We connect you with vetted, independent tax relief specialists including enrolled agents, CPAs, and tax resolution firms. We do not provide tax advice or representation directly.",
  },
];

const BREADCRUMBS = [
  { name: "Home", path: "https://wehelpfinance.com/" },
  { name: "Tax Relief", path: "https://wehelpfinance.com/tax-relief" },
  { name: "IRS Debt Relief", path: "https://wehelpfinance.com/irs-debt-relief" },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(BREADCRUMBS)) }}
      />
      <ServicePage
        eyebrow="IRS Debt Relief"
        title={<>The IRS has options — <span className="italic text-primary">a specialist can find yours.</span></>}
        lede="An IRS notice, wage garnishment, or bank levy can feel overwhelming. But the IRS offers more resolution programs than most people realize — including settling for less than you owe, structured payment plans, and penalty removal. A vetted tax relief specialist can identify which program you qualify for and represent you directly with the IRS."
        bullets={[
          "Offer in Compromise — potentially settle for less than you owe",
          "IRS payment plans — affordable monthly arrangements",
          "Wage garnishment and levy release",
          "Penalty abatement — remove or reduce IRS penalties",
          "Currently Not Collectible status for qualifying taxpayers",
          "Free, confidential consultation — no obligation",
        ]}
        faqs={FAQS}
        category="tax-relief"
        author={{ name: "Amit Chadha", org: "Telemaster India", years: 21 }}
        relatedLinks={[
          { href: "/tax-relief", label: "Tax Relief Overview" },
          { href: "/back-taxes-help", label: "Back Taxes Help" },
        ]}
      />
    </>
  );
}
