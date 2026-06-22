import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tax Relief — IRS & Back Tax Help | WeHelpFinance",
  description: "Get help with IRS debt, back taxes, and tax resolution options. Connect with vetted tax specialists for a free, confidential consultation.",
  alternates: { canonical: "/tax-relief" },
  openGraph: { title: "Tax Relief — IRS & Back Tax Help | WeHelpFinance", description: "Get help with IRS debt, back taxes, and tax resolution options. Connect with vetted tax specialists for a free, confidential consultation.", url: "/tax-relief", type: "website" },
};

import { ServicePage } from "@/components/ServicePage";
import type { FAQItem } from "@/components/FAQ";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";

const FAQS: FAQItem[] = [
  { q: "What is tax relief?", a: "Tax relief includes IRS programs and negotiated agreements — like Installment Agreements, Offer in Compromise, Currently Not Collectible status, and penalty abatement — that help taxpayers resolve back taxes." },
  { q: "Who qualifies for tax relief?", a: "Eligibility depends on your specific tax debt, financial situation, and IRS standing. A specialist can review your case and explain which programs you may qualify for." },
  { q: "I received an IRS notice — what should I do?", a: "Don't ignore it. Reach out for a free consultation so a specialist can review the notice and help you understand your next steps." },
  { q: "Is WeHelpFinance a tax firm?", a: "No. We connect you with independent tax resolution specialists who handle the work directly with the IRS or state agencies." },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
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
    </>
  );
}
