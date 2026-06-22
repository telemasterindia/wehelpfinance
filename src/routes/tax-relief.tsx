import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/ServicePage";
import { faqJsonLd, breadcrumbJsonLd, type FAQItem } from "@/components/FAQ";

const FAQS: FAQItem[] = [
  { q: "What is tax relief?", a: "Tax relief includes IRS programs and negotiated agreements — like Installment Agreements, Offer in Compromise, Currently Not Collectible status, and penalty abatement — that help taxpayers resolve back taxes." },
  { q: "Who qualifies for tax relief?", a: "Eligibility depends on your specific tax debt, financial situation, and IRS standing. A specialist can review your case and explain which programs you may qualify for." },
  { q: "I received an IRS notice — what should I do?", a: "Don't ignore it. Reach out for a free consultation so a specialist can review the notice and help you understand your next steps." },
  { q: "Is WeHelpFinance a tax firm?", a: "No. We connect you with independent tax resolution specialists who handle the work directly with the IRS or state agencies." },
];

export const Route = createFileRoute("/tax-relief")({
  head: () => ({
    meta: [
      { title: "Tax Relief — IRS & Back Tax Help | WeHelpFinance" },
      { name: "description", content: "Get help with IRS debt, back taxes, and tax resolution options. Connect with vetted tax specialists for a free, confidential consultation." },
      { property: "og:title", content: "Tax Relief Help | WeHelpFinance" },
      { property: "og:description", content: "Owe back taxes? Explore IRS resolution options with trusted specialists." },
      { property: "og:url", content: "https://wehelpfinance.com/tax-relief" },
    ],
    links: [{ rel: "canonical", href: "https://wehelpfinance.com/tax-relief" }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(faqJsonLd(FAQS)) },
      { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd([
        { name: "Home", path: "/" }, { name: "Tax Relief", path: "/tax-relief" },
      ])) },
    ],
  }),
  component: () => (
    <ServicePage
      eyebrow="Tax Relief"
      title={<>Owe the IRS? <span className="italic text-primary">You have options.</span></>}
      lede="Back taxes and IRS notices are stressful — but they're solvable. A specialist can walk you through the resolution programs you may qualify for."
      bullets={[
        "Help with IRS and state tax debt",
        "Installment Agreements & Offer in Compromise",
        "Penalty abatement & wage garnishment relief",
        "Free, confidential review of your situation",
      ]}
      faqs={FAQS}
      category="tax-relief"
    />
  ),
});
