import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Debt Relief Help — Explore Your Options | WeHelpFinance",
  description: "Struggling with credit card or unsecured debt? Connect with vetted debt relief specialists for a free, no-obligation consultation.",
  alternates: { canonical: "/debt-relief" },
  openGraph: { title: "Debt Relief Help — Explore Your Options | WeHelpFinance", description: "Struggling with credit card or unsecured debt? Connect with vetted debt relief specialists for a free, no-obligation consultation.", url: "/debt-relief", type: "website" },
};

import { ServicePage } from "@/components/ServicePage";
import type { FAQItem } from "@/components/FAQ";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";

const FAQS: FAQItem[] = [
  { q: "What is debt relief?", a: "Debt relief is an umbrella term for programs that help reduce, restructure, or pay off unsecured debt — including debt settlement, consolidation, and management plans." },
  { q: "How does debt settlement work?", a: "A specialist negotiates with your creditors to accept less than what's owed. You typically deposit funds into a dedicated account until a settlement can be funded." },
  { q: "Will a debt relief program hurt my credit?", a: "Some programs may impact your credit during the process. A specialist will walk you through the trade-offs of each option so you can make an informed choice." },
  { q: "How long does debt relief take?", a: "Most programs range from 24 to 48 months, depending on the type of program, your balances, and your monthly contribution." },
  { q: "Is WeHelpFinance a debt relief company?", a: "No. We're a free matching service. We connect you with vetted, independent debt relief specialists who provide the actual services." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
<ServicePage
      eyebrow="Debt Relief"
      title={<>A clearer path out of <span className="italic text-primary">unsecured debt.</span></>}
      lede="If credit cards, medical bills, or personal loans feel like they're stacking faster than you can pay them down, you have options — and a specialist can help you find the right one."
      bullets={[
        "Programs designed for $5,000+ in unsecured debt",
        "One monthly deposit instead of juggling minimums",
        "Specialists negotiate directly with creditors on your behalf",
        "Free consultation — no upfront fees to learn your options",
      ]}
      faqs={FAQS}
      category="debt-relief"
    />
    </>
  );
}
