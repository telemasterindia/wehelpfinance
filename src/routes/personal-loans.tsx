import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/ServicePage";
import { faqJsonLd, breadcrumbJsonLd, type FAQItem } from "@/components/FAQ";

const FAQS: FAQItem[] = [
  { q: "What can I use a personal loan for?", a: "Personal loans are commonly used for debt consolidation, unexpected expenses, home improvements, or major purchases. Uses vary by lender." },
  { q: "Does WeHelpFinance issue loans?", a: "No. WeHelpFinance is not a lender. We connect you with independent lending partners who review your request and may extend an offer." },
  { q: "What credit score do I need?", a: "Lender requirements vary. Many partners work with a wide range of credit profiles, from excellent to fair credit." },
  { q: "Will checking my options affect my credit?", a: "Submitting an inquiry through WeHelpFinance is free. Whether a hard credit check is performed depends on the lender you ultimately work with." },
  { q: "How fast can I get funded?", a: "Once approved, many personal loans fund within 1–5 business days, though timing depends on the lender and your bank." },
];

export const Route = createFileRoute("/personal-loans")({
  head: () => ({
    meta: [
      { title: "Personal Loans — Compare Options | WeHelpFinance" },
      { name: "description", content: "Compare personal loan options and debt consolidation opportunities with trusted lending partners. Free, no-obligation matching." },
      { property: "og:title", content: "Personal Loans | WeHelpFinance" },
      { property: "og:description", content: "Compare personal loan options with trusted partners. Free and confidential." },
      { property: "og:url", content: "https://wehelpfinance.com/personal-loans" },
    ],
    links: [{ rel: "canonical", href: "https://wehelpfinance.com/personal-loans" }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(faqJsonLd(FAQS)) },
      { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd([
        { name: "Home", path: "/" }, { name: "Personal Loans", path: "/personal-loans" },
      ])) },
    ],
  }),
  component: () => (
    <ServicePage
      eyebrow="Personal Loans"
      title={<>Personal loans, <span className="italic text-primary">simplified.</span></>}
      lede="Consolidate high-interest debt or cover a major expense with a single fixed monthly payment. We'll match your request to lending partners who fit your profile."
      bullets={[
        "Loan amounts typically from $1,000 to $50,000",
        "Fixed monthly payments and clear terms",
        "Options for a range of credit profiles",
        "Free to check — you choose if you proceed",
      ]}
      faqs={FAQS}
      category="personal-loan"
    />
  ),
});
