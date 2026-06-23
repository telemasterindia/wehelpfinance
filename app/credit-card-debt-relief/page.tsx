import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import type { FAQItem } from "@/components/FAQ";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Credit Card Debt Relief — Stop the Interest Cycle | WeHelpFinance",
  description: "Trapped paying minimum payments that never reduce your balance? Explore credit card debt relief options with a vetted specialist. Free consultation, no obligation.",
  alternates: { canonical: "https://wehelpfinance.com/credit-card-debt-relief" },
  openGraph: {
    title: "Credit Card Debt Relief — Stop the Interest Cycle | WeHelpFinance",
    description: "Explore options to break free from credit card debt. Connect with a vetted specialist for a free, no-obligation consultation.",
    url: "https://wehelpfinance.com/credit-card-debt-relief",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Credit Card Debt Relief — Stop the Interest Cycle | WeHelpFinance",
    description: "Break free from credit card minimum payments. Free consultation with vetted specialists.",
  },
};

const FAQS: FAQItem[] = [
  {
    q: "Why do minimum payments feel like they never reduce my balance?",
    a: "With credit card APRs averaging 20–24% in 2026, most of your minimum payment goes toward interest, not the principal. On a $10,000 balance at 22% APR, paying the minimum could take over 30 years to pay off and cost you more than $15,000 in interest alone.",
  },
  {
    q: "What are my options for credit card debt relief?",
    a: "The main options are: debt settlement (negotiating to pay less than you owe), debt consolidation (combining balances into one lower-rate payment), a debt management plan through a nonprofit credit counselor, or a balance transfer to a 0% APR card if your credit qualifies. A specialist can help you find the right fit.",
  },
  {
    q: "Can I get credit card debt forgiven?",
    a: "Credit card companies do not forgive debt as a standard practice, but they do negotiate settlements — especially on accounts that are significantly past due. Through debt settlement, many clients resolve balances for 40–60 cents on the dollar.",
  },
  {
    q: "What happens if I stop paying my credit cards?",
    a: "If you stop making payments, your account will eventually go delinquent and be charged off. The creditor may sell the debt to a collection agency or sue you for the balance. However, accounts in this stage are also more likely to settle for reduced amounts. It is important to understand your options before stopping payments.",
  },
  {
    q: "How does credit card APR affect my debt?",
    a: "APR (Annual Percentage Rate) is the annual cost of carrying a balance. At 24% APR, a $10,000 balance accrues approximately $200 in interest per month. If your minimum payment is $250, only $50 goes toward the principal — making it nearly impossible to get ahead without a structured plan.",
  },
  {
    q: "Will credit card debt relief affect my credit score?",
    a: "The impact depends on which option you choose. A debt management plan may have minimal credit impact if you make consistent payments. Debt settlement can lower your score temporarily but may be better than long-term delinquency. A specialist will walk you through the trade-offs.",
  },
  {
    q: "How much credit card debt do I need to qualify for relief programs?",
    a: "Most debt settlement and debt management programs require a minimum of $7,500 in unsecured debt to be cost-effective. If you owe less than that, a personal loan for consolidation may be a better fit.",
  },
  {
    q: "Is WeHelpFinance a credit card company or bank?",
    a: "No. WeHelpFinance is a free matching service that connects consumers with vetted debt relief specialists, credit counselors, and lending partners. We are not a lender, bank, or credit card issuer.",
  },
];

const BREADCRUMBS = [
  { name: "Home", path: "https://wehelpfinance.com/" },
  { name: "Debt Relief", path: "https://wehelpfinance.com/debt-relief" },
  { name: "Credit Card Debt Relief", path: "https://wehelpfinance.com/credit-card-debt-relief" },
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
        eyebrow="Credit Card Debt Relief"
        title={<>Break free from the <span className="italic text-primary">minimum payment trap.</span></>}
        lede="When 20%+ interest rates mean most of your payment goes to the bank instead of reducing your balance, you are not making progress — you are treading water. Credit card debt relief programs are designed to break this cycle and give you a real path to becoming debt-free."
        bullets={[
          "Programs for $7,500 or more in credit card debt",
          "Stop the interest cycle — reduce what you actually owe",
          "One monthly payment instead of juggling multiple cards",
          "Specialists with experience negotiating with major credit card issuers",
          "Free, confidential consultation — no obligation to enroll",
        ]}
        faqs={FAQS}
        category="debt-relief"
        author={{ name: "Amit Chadha", org: "Telemaster India", years: 21 }}
        relatedLinks={[
          { href: "/debt-settlement", label: "How Debt Settlement Works" },
          { href: "/debt-consolidation", label: "Debt Consolidation Options" },
          { href: "/debt-relief", label: "Debt Relief Overview" },
        ]}
      />
    </>
  );
}
