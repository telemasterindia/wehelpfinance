import { DEFAULT_OG_IMAGE, DEFAULT_TWITTER_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import type { FAQItem } from "@/components/FAQ";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Debt Consolidation — One Payment, Lower Stress | WeHelpFinance",
  description:
    "Combine multiple debts into one manageable monthly payment. Explore debt consolidation options with a vetted specialist — free consultation, no obligation.",
  alternates: { canonical: "https://www.wehelpfinance.com/debt-consolidation" },
  openGraph: {
    title: "Debt Consolidation — One Payment, Lower Stress | WeHelpFinance",
    description:
      "Combine multiple debts into one manageable monthly payment. Free consultation with a vetted specialist.",
    url: "https://www.wehelpfinance.com/debt-consolidation",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Consolidation — One Payment, Lower Stress | WeHelpFinance",
    description:
      "Combine multiple debts into one monthly payment. Free, no-obligation consultation.",
    images: [DEFAULT_TWITTER_IMAGE],
  },
};

const FAQS: FAQItem[] = [
  {
    q: "What is debt consolidation?",
    a: "Debt consolidation combines multiple debts — such as credit cards, medical bills, and personal loans — into a single monthly payment. This simplifies repayment and can reduce the interest rate you're paying overall.",
  },
  {
    q: "What are the main types of debt consolidation?",
    a: "The two most common methods are a debt consolidation loan (a personal loan used to pay off multiple debts) and a debt management plan (a structured repayment program arranged through a credit counseling agency). A specialist can help you determine which is right for your situation.",
  },
  {
    q: "Will debt consolidation hurt my credit?",
    a: "Applying for a consolidation loan may cause a temporary dip in your credit score due to a hard inquiry. However, consistently making on-time payments on the consolidated account can help improve your credit over time.",
  },
  {
    q: "How is debt consolidation different from debt settlement?",
    a: "Debt consolidation means you pay the full amount owed, usually at a lower interest rate or through a structured plan. Debt settlement involves negotiating with creditors to accept less than the full balance. Settlement is typically for people in more severe financial hardship.",
  },
  {
    q: "What credit score do I need to consolidate debt?",
    a: "Requirements vary by lender and program type. Some consolidation loans require good credit (660+), while debt management plans through credit counseling agencies typically do not have strict credit score requirements. A specialist can match you with the right option for your credit profile.",
  },
  {
    q: "How long does debt consolidation take?",
    a: "A debt management plan typically takes 3–5 years. A consolidation loan term depends on the loan terms you qualify for, usually 2–7 years. Either way, you'll have a clear end date — unlike minimum payments that can take decades.",
  },
  {
    q: "Does debt consolidation cover all types of debt?",
    a: "Debt consolidation works best for unsecured debts — credit cards, medical bills, personal loans, and utility bills. It does not apply to secured debts like mortgages or auto loans.",
  },
  {
    q: "Is WeHelpFinance a debt consolidation company?",
    a: "No. WeHelpFinance is a free matching service that connects you with vetted debt consolidation specialists and lenders. We do not provide loans or credit counseling directly.",
  },
];

const BREADCRUMBS = [
  { name: "Home", path: "https://www.wehelpfinance.com/" },
  { name: "Debt Relief", path: "https://www.wehelpfinance.com/debt-relief" },
  {
    name: "Debt Consolidation",
    path: "https://www.wehelpfinance.com/debt-consolidation",
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
          __html: JSON.stringify(breadcrumbJsonLd(BREADCRUMBS)),
        }}
      />
      <ServicePage
        eyebrow="Debt Consolidation"
        title={
          <>
            Stop juggling payments —{" "}
            <span className="italic text-primary">combine them into one.</span>
          </>
        }
        lede="Managing five credit card minimum payments, a medical bill, and a personal loan at the same time is exhausting and expensive. Debt consolidation brings everything into a single monthly payment — often at a lower interest rate — so you can see a clear path forward."
        bullets={[
          "Replace multiple monthly payments with one simple payment",
          "Potentially lower your overall interest rate",
          "Structured plan with a clear payoff date",
          "Options for all credit profiles — good, fair, and poor credit",
          "Free consultation — no upfront fees to explore your options",
        ]}
        faqs={FAQS}
        category="debt-relief"
        author={{ name: "Amit Chadha", org: "Telemaster India", years: 21 }}
        relatedLinks={[
          {
            href: "/personal-loans",
            label: "Personal Loans for Consolidation",
          },
          { href: "/debt-relief", label: "Debt Relief Overview" },
          { href: "/debt-settlement", label: "Debt Settlement" },
        ]}
      />
    </>
  );
}
