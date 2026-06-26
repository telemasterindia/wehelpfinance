import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import type { FAQItem } from "@/components/FAQ";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Debt Settlement — Negotiate What You Owe | WeHelpFinance",
  description: "Debt settlement lets you pay less than you owe on unsecured debt. Connect with a vetted specialist for a free consultation and see how much you could save.",
  alternates: { canonical: "https://www.wehelpfinance.com/debt-settlement" },
  openGraph: {
    title: "Debt Settlement — Negotiate What You Owe | WeHelpFinance",
    description: "Debt settlement lets you pay less than you owe on unsecured debt. Connect with a vetted specialist for a free consultation and see how much you could save.",
    url: "https://www.wehelpfinance.com/debt-settlement",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Settlement — Negotiate What You Owe | WeHelpFinance",
    description: "Debt settlement lets you pay less than you owe. Free consultation, no obligation.",
  },
};

const FAQS: FAQItem[] = [
  {
    q: "What is debt settlement?",
    a: "Debt settlement is a process where a specialist negotiates with your creditors to accept a lump-sum payment that is less than your full balance owed. It is typically used for unsecured debts like credit cards, medical bills, and personal loans.",
  },
  {
    q: "How much can I save with debt settlement?",
    a: "Settlement amounts vary by creditor, account age, and your financial situation. Many clients settle for 40–60 cents on the dollar, though results vary. A specialist will give you a realistic estimate based on your specific accounts.",
  },
  {
    q: "How does the debt settlement process work?",
    a: "You make monthly deposits into a dedicated account. Once enough funds accumulate, your specialist negotiates with each creditor. When a creditor agrees to a settlement, funds are used to pay it. The process typically takes 24–48 months.",
  },
  {
    q: "Will debt settlement hurt my credit score?",
    a: "Debt settlement can impact your credit score, as accounts may be reported as 'settled for less than the full amount.' However, many clients find that resolving unmanageable debt allows them to begin rebuilding credit sooner than staying trapped in minimum payments.",
  },
  {
    q: "What debts qualify for settlement?",
    a: "Most unsecured debts qualify — credit cards, medical bills, personal loans, and private student loans. Secured debts like mortgages and auto loans, and federal student loans, typically do not qualify for settlement.",
  },
  {
    q: "Is debt settlement the same as debt consolidation?",
    a: "No. Debt settlement reduces the total amount you owe through negotiation. Debt consolidation combines multiple debts into one payment, usually through a new loan or debt management plan, and you pay the full balance.",
  },
  {
    q: "Will I owe taxes on settled debt?",
    a: "The IRS may consider forgiven debt as taxable income. Your creditor may issue a 1099-C form for the cancelled amount. A tax professional can help you understand your specific situation and whether exceptions apply.",
  },
  {
    q: "Is WeHelpFinance a debt settlement company?",
    a: "No. WeHelpFinance is a free matching service. We connect you with vetted, independent debt settlement specialists. We do not charge fees or provide debt settlement services directly.",
  },
];

const BREADCRUMBS = [
  { name: "Home", path: "https://www.wehelpfinance.com/" },
  { name: "Debt Relief", path: "https://www.wehelpfinance.com/debt-relief" },
  { name: "Debt Settlement", path: "https://www.wehelpfinance.com/debt-settlement" },
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
        eyebrow="Debt Settlement"
        title={<>Pay less than you owe — <span className="italic text-primary">legally and ethically.</span></>}
        lede="When credit card balances, medical bills, or personal loans feel impossible to pay in full, debt settlement may allow you to resolve what you owe for significantly less. A specialist negotiates directly with your creditors on your behalf."
        bullets={[
          "Specialists negotiate directly with your creditors",
          "Many clients settle for 40–60 cents on the dollar",
          "One affordable monthly deposit replaces multiple minimum payments",
          "Programs typically complete in 24–48 months",
          "Free consultation — no upfront fees to explore your options",
        ]}
        faqs={FAQS}
        category="debt-relief"
        author={{ name: "Amit Chadha", org: "Telemaster India", years: 21 }}
        relatedLinks={[
          { href: "/debt-settlement-calculator", label: "Debt Settlement Calculator" },
          { href: "/debt-settlement/los-angeles", label: "Debt Settlement in Los Angeles" },
          { href: "/debt-settlement/houston", label: "Debt Settlement in Houston" },
          { href: "/debt-settlement/new-york-city", label: "Debt Settlement in New York City" },
          { href: "/debt-relief", label: "Debt Relief Overview" },
          { href: "/debt-consolidation", label: "Debt Consolidation" },
          { href: "/credit-card-debt-relief", label: "Credit Card Debt Relief" },
        ]}
      />
    </>
  );
}

