import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/ServicePage";
import { faqJsonLd, breadcrumbJsonLd, type FAQItem } from "@/components/FAQ";

const FAQS: FAQItem[] = [
  { q: "What is debt relief?", a: "Debt relief is an umbrella term for programs that help reduce, restructure, or pay off unsecured debt — including debt settlement, consolidation, and management plans." },
  { q: "How does debt settlement work?", a: "A specialist negotiates with your creditors to accept less than what's owed. You typically deposit funds into a dedicated account until a settlement can be funded." },
  { q: "Will a debt relief program hurt my credit?", a: "Some programs may impact your credit during the process. A specialist will walk you through the trade-offs of each option so you can make an informed choice." },
  { q: "How long does debt relief take?", a: "Most programs range from 24 to 48 months, depending on the type of program, your balances, and your monthly contribution." },
  { q: "Is WeHelpFinance a debt relief company?", a: "No. We're a free matching service. We connect you with vetted, independent debt relief specialists who provide the actual services." },
];

export const Route = createFileRoute("/debt-relief")({
  head: () => ({
    meta: [
      { title: "Debt Relief Help — Explore Your Options | WeHelpFinance" },
      { name: "description", content: "Struggling with credit card or unsecured debt? Connect with vetted debt relief specialists for a free, no-obligation consultation. Settlement, consolidation, and more." },
      { property: "og:title", content: "Debt Relief Help | WeHelpFinance" },
      { property: "og:description", content: "Explore debt relief options with trusted specialists. Free, confidential, no obligation." },
      { property: "og:url", content: "https://wehelpfinance.com/debt-relief" },
    ],
    links: [{ rel: "canonical", href: "https://wehelpfinance.com/debt-relief" }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(faqJsonLd(FAQS)) },
      { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd([
        { name: "Home", path: "/" }, { name: "Debt Relief", path: "/debt-relief" },
      ])) },
    ],
  }),
  component: () => (
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
  ),
});
