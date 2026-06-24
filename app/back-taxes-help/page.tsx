import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import type { FAQItem } from "@/components/FAQ";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Back Taxes Help — Resolve Unfiled & Unpaid Tax Debt | WeHelpFinance",
  description: "Owe back taxes to the IRS? Whether you have unfiled returns or unpaid balances, a vetted tax specialist can help you resolve your situation. Free consultation.",
  alternates: { canonical: "https://www.wehelpfinance.com/back-taxes-help" },
  openGraph: {
    title: "Back Taxes Help — Resolve Unfiled & Unpaid Tax Debt | WeHelpFinance",
    description: "Get help resolving back taxes, unfiled returns, and IRS debt. Free consultation with vetted tax relief specialists.",
    url: "https://www.wehelpfinance.com/back-taxes-help",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Back Taxes Help — Resolve Unfiled & Unpaid Tax Debt | WeHelpFinance",
    description: "Owe back taxes? Get expert help resolving IRS debt. Free, confidential consultation.",
  },
};

const FAQS: FAQItem[] = [
  {
    q: "What are back taxes?",
    a: "Back taxes are taxes owed to the IRS from prior years that were not fully paid when due. This can result from unfiled tax returns, underpayment of estimated taxes, errors on filed returns, or an IRS audit that determined additional tax was owed.",
  },
  {
    q: "What happens if I have unfiled tax returns?",
    a: "The IRS can file a Substitute for Return (SFR) on your behalf using income information it receives from employers and financial institutions. An IRS-filed return typically results in a higher tax bill since deductions and credits are not applied. Filing your own return — even late — is almost always better.",
  },
  {
    q: "How far back can the IRS collect back taxes?",
    a: "The IRS generally has 10 years from the date of assessment to collect tax debt. However, the clock can be paused under certain circumstances, such as bankruptcy, pending Offer in Compromise, or living outside the US. Unfiled returns have no statute of limitations.",
  },
  {
    q: "What penalties does the IRS charge on back taxes?",
    a: "The IRS charges two main penalties: the Failure to File penalty (5% per month, up to 25%) and the Failure to Pay penalty (0.5% per month, up to 25%). Interest also accrues on unpaid balances. Penalties can be removed or reduced through abatement if you have reasonable cause or qualify for first-time abatement.",
  },
  {
    q: "Can I negotiate my back tax debt with the IRS?",
    a: "Yes. The IRS offers several resolution options including Offer in Compromise (settle for less), Installment Agreements (monthly payment plans), Currently Not Collectible status (temporary halt of collections), and penalty abatement. A tax specialist can determine which option fits your situation.",
  },
  {
    q: "I am self-employed and owe back taxes — what are my options?",
    a: "Self-employed taxpayers and 1099 contractors frequently face back tax issues from underpaid estimated taxes. Your options are the same as other taxpayers — payment plans, Offer in Compromise, and penalty abatement — but a specialist familiar with self-employment tax situations can help navigate the process more effectively.",
  },
  {
    q: "What if I owe back taxes and cannot afford to pay?",
    a: "The IRS has programs specifically for taxpayers who cannot pay their full balance. Currently Not Collectible (CNC) status temporarily halts collection activity for those with genuine financial hardship. An Offer in Compromise may allow you to settle for an amount based on what you can realistically afford.",
  },
  {
    q: "Is WeHelpFinance a tax agency?",
    a: "No. WeHelpFinance is a free matching service. We connect you with vetted, independent tax relief specialists — including enrolled agents and tax resolution firms — who can represent you before the IRS. We do not provide tax advice or representation directly.",
  },
];

const BREADCRUMBS = [
  { name: "Home", path: "https://www.wehelpfinance.com/" },
  { name: "Tax Relief", path: "https://www.wehelpfinance.com/tax-relief" },
  { name: "Back Taxes Help", path: "https://www.wehelpfinance.com/back-taxes-help" },
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
        eyebrow="Back Taxes Help"
        title={<>Back taxes don't disappear — <span className="italic text-primary">but they can be resolved.</span></>}
        lede="Whether you have one year of unfiled returns or several years of mounting IRS debt, waiting makes the situation worse. Penalties and interest compound daily, and the IRS has significant collection power. The good news: the IRS also has more resolution programs than most people know about — and a vetted specialist can help you access them."
        bullets={[
          "Help with unfiled returns from prior years",
          "IRS payment plans structured around what you can afford",
          "Penalty and interest reduction through abatement",
          "Offer in Compromise for qualifying taxpayers",
          "Self-employed and 1099 contractor specialists available",
          "Free, confidential consultation — no obligation",
        ]}
        faqs={FAQS}
        category="tax-relief"
        author={{ name: "Amit Chadha", org: "Telemaster India", years: 21 }}
        relatedLinks={[
          { href: "/irs-debt-relief", label: "IRS Debt Relief Options" },
          { href: "/tax-relief", label: "Tax Relief Overview" },
        ]}
      />
    </>
  );
}

