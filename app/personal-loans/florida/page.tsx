// Florida Personal Loans
import type { Metadata } from "next";
import { StateServicePage } from "@/components/StateServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { STATES } from "@/lib/stateData";

const SF = STATES.florida;
const CANONICAL_FL = "https://www.wehelpfinance.com/personal-loans/florida";

export const metadata: Metadata = {
  title: "Personal Loans in Florida — Options for FL Residents | WeHelpFinance",
  description: "Florida's 18% civil usury cap and strong credit union market make it a good state for personal loan borrowers. Learn how to find the right loan — free consultation.",
  alternates: { canonical: CANONICAL_FL },
  openGraph: { title: "Personal Loans in Florida | WeHelpFinance", description: "Florida personal loan guide for debt consolidation and financial needs. Free consultation.", url: CANONICAL_FL, type: "website" },
  twitter: { card: "summary_large_image", title: "Personal Loans in Florida | WeHelpFinance", description: "Personal loan options for Florida residents. Free consultation." },
};

const FAQS_FL = [
  { q: "What is Florida's interest rate cap on personal loans?", a: "Florida's civil usury limit is 18% per year for most consumer loans. However, federally chartered banks and their affiliates can operate above this cap through federal preemption. Most major banks and online lenders operate at their home state rates rather than Florida's cap." },
  { q: "Can I get a personal loan in Florida for debt consolidation?", a: "Yes. Florida has a competitive personal lending market with strong credit union options — Suncoast Credit Union, Space Coast Credit Union, and Achieva are among the larger Florida credit unions. Personal loans for debt consolidation are widely available across a range of credit profiles." },
  { q: "Are payday loans regulated in Florida?", a: "Florida has more payday loan regulations than most states — loans are capped at $500, terms must be at least 7 days, and a statewide database prevents multiple simultaneous loans. However, even regulated payday loans are expensive. Traditional personal loans from banks and credit unions are strongly preferable." },
  { q: "I have seasonal income in Florida — can I get a personal loan?", a: "Yes, but lenders will want to see documentation of your income pattern. Bank statements showing seasonal income history are often requested. Some lenders are more flexible than others with non-traditional income patterns. Credit unions with local knowledge may be more accommodating than national online lenders." },
  { q: "What credit score do I need for a personal loan in Florida?", a: "Most mainstream lenders require 600–640 minimum, with competitive rates available at 660–680+. Credit unions sometimes have slightly more flexible requirements for members. The better your credit, the lower your rate and the more you can borrow." },
  { q: "Is a personal loan or debt relief better for Florida residents?", a: "It depends on your situation. If you can afford to repay the full balance at a lower interest rate, a personal loan for consolidation is usually better for your credit. If your income genuinely cannot support full repayment, debt relief programs may resolve the debt for less than you owe. A free consultation can help you assess which fits your situation." },
];

const RELATED_FL = [
  { href: "/personal-loans/texas", label: "Texas" },
  { href: "/personal-loans/california", label: "California" },
  { href: "/personal-loans/new-york", label: "New York" },
  { href: "/personal-loans/pennsylvania", label: "Pennsylvania" },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS_FL)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: "Home", path: "https://www.wehelpfinance.com/" },
        { name: "Personal Loans", path: "https://www.wehelpfinance.com/personal-loans" },
        { name: "Florida", path: CANONICAL_FL },
      ])) }} />
      <StateServicePage
        stateName={SF.name} stateAbbr={SF.abbreviation} vertical="personal-loans" category="personal-loan"
        eyebrow="Personal Loans" author="WeHelpFinance Financial Education Team"
        title={<>Personal Loans in <span className="italic text-primary">Florida</span></>}
        lede="Florida has a large and competitive personal lending market with strong credit union options across Miami, Tampa, Orlando, and Jacksonville. Florida's 18% civil usury cap provides some consumer protection, though most major lenders operate under federal preemption. Seasonal income patterns require particular attention to loan payment structuring."
        bullets={[
          "Competitive personal loan market with strong credit union presence statewide",
          "18% civil usury cap provides baseline consumer protection",
          "More regulated payday lending than most states",
          "Available across credit profiles — good, fair, and poor credit options",
          "Free, no-obligation consultation to explore your options",
        ]}
        faqs={FAQS_FL}
        relatedStatePages={RELATED_FL}
        content={<>
          <h2>Florida's Personal Loan Market</h2>
          <p>Florida's personal lending market reflects the state's economic diversity — a large retiree population with fixed income needs, a seasonal hospitality workforce with variable income, and rapidly growing tech and healthcare sectors with more stable earnings. Average household income in Florida is approximately {SF.personalLoans.avgHouseholdIncome}.</p>
          <p>{SF.personalLoans.lendingContext}</p>
          <p>{SF.personalLoans.localEconomy}</p>
          <h2>Personal Loans for Debt Consolidation in Florida</h2>
          <p>For Florida residents carrying multiple high-interest credit card balances, a personal loan for debt consolidation can provide meaningful financial relief — particularly when the loan rate is 5+ percentage points below the weighted average of current card APRs. {SF.personalLoans.usuryCap}</p>
          <p>Florida credit unions worth considering for personal loan rates include Suncoast Credit Union (Tampa Bay), Space Coast Credit Union (Central and South Florida), Achieva Credit Union (Tampa area), and Grow Financial Federal Credit Union (Tampa Bay). Membership eligibility varies by credit union — many have geographic eligibility that covers their primary service area.</p>
          <h2>Seasonal Income and Personal Loan Qualification</h2>
          <p>{SF.personalLoans.keyConsideration}</p>
          <p>Florida residents with seasonal income should document their income pattern carefully when applying. 12–24 months of bank statements showing the seasonal cycle, along with any offer letters or employment contracts for the upcoming season, help lenders understand your true annual income. A debt-to-income calculation based only on off-season income may misrepresent your actual capacity to repay.</p>
          <h2>When a Personal Loan Is Not the Right Fit</h2>
          <p>For Florida residents whose income genuinely cannot support full repayment of their debt — particularly those in seasonal industries where off-season income creates payment gaps — a personal loan for consolidation may not solve the underlying problem. Debt management plans and debt settlement programs address different aspects of the debt situation and may be more appropriate. A free consultation helps clarify which path fits your specific Florida circumstances.</p>
        </>}
      />
    </>
  );
}

