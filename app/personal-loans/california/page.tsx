import type { Metadata } from "next";
import { StateServicePage } from "@/components/StateServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { STATES } from "@/lib/stateData";

const S = STATES.california;
const CANONICAL = "https://wehelpfinance.com/personal-loans/california";

export const metadata: Metadata = {
  title: "Personal Loans in California — Options for CA Residents | WeHelpFinance",
  description: "California caps personal loan rates at 36% APR for loans $2,500–$10,000 — one of the strongest consumer protections in the US. Explore personal loan options for California residents.",
  alternates: { canonical: CANONICAL },
  openGraph: { title: "Personal Loans in California | WeHelpFinance", description: "California's 36% APR cap on $2,500–$10,000 loans protects borrowers. Explore your personal loan options — free consultation.", url: CANONICAL, type: "website" },
  twitter: { card: "summary_large_image", title: "Personal Loans in California | WeHelpFinance", description: "Personal loan options for California residents. Free consultation." },
};

const FAQS = [
  { q: "What is California's interest rate cap on personal loans?", a: "California caps interest rates on consumer loans of $2,500–$10,000 at 36% APR — one of the strongest protections in the country for this loan range. For loans above $10,000, rates are generally unregulated by the state. California requires clear APR disclosure on all consumer loan products." },
  { q: "Can I use a personal loan to consolidate credit card debt in California?", a: "Yes — and California's 36% APR cap means borrowers accessing loans in the $2,500–$10,000 range have meaningful rate protection. For larger consolidation amounts, comparing credit union rates against online lenders is important since the cap does not apply above $10,000." },
  { q: "What credit score do I need for a personal loan in California?", a: "Most mainstream lenders require 600–640 minimum credit, with competitive rates at 660–680+. California credit unions like Golden 1, SchoolsFirst, and Star One sometimes have membership-based flexibility for borrowers in their eligibility criteria." },
  { q: "Are payday loans regulated in California?", a: "California limits payday loans to $300 maximum with a 15% fee cap. Despite these caps, effective APRs for two-week payday loans are approximately 460%. California prohibits rollovers. Traditional personal loans from banks or credit unions are strongly preferable to payday products." },
  { q: "I was laid off from a tech job — can I get a personal loan?", a: "Employment verification is a standard part of personal loan applications. If you are currently unemployed, most traditional lenders will not approve a personal loan. Some lenders consider unemployment benefits or severance as income temporarily. If a recent layoff has created debt problems, speaking with a debt relief specialist about options available during unemployment may be more appropriate." },
  { q: "Is a personal loan or debt settlement better for California residents?", a: "Depends entirely on your situation. If you can afford full repayment at a lower rate, a personal loan for consolidation protects your credit and costs less in fees. If your income has dropped — such as from a tech layoff — and you cannot realistically repay the full balance, debt settlement may resolve the debt for less than you owe. A free specialist consultation helps determine which path fits." },
];

const RELATED = [
  { href: "/personal-loans/texas", label: "Texas" },
  { href: "/personal-loans/florida", label: "Florida" },
  { href: "/personal-loans/new-york", label: "New York" },
  { href: "/personal-loans/pennsylvania", label: "Pennsylvania" },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: "Home", path: "https://wehelpfinance.com/" },
        { name: "Personal Loans", path: "https://wehelpfinance.com/personal-loans" },
        { name: "California", path: CANONICAL },
      ])) }} />
      <StateServicePage
        stateName={S.name} stateAbbr={S.abbreviation} vertical="personal-loans" category="personal-loan"
        eyebrow="Personal Loans" author="WeHelpFinance Research Team"
        title={<>Personal Loans in <span className="italic text-primary">California</span></>}
        lede="California has the most competitive personal lending market of any US state — and since 2020, one of the strongest rate protections for borrowers seeking loans between $2,500 and $10,000. Understanding the 36% APR cap and how it works helps California residents access fair-priced loans and avoid predatory alternatives."
        bullets={[
          "36% APR cap on consumer loans $2,500–$10,000 — meaningful protection for this range",
          "Most competitive credit union market in the country",
          "Strong disclosure requirements on all consumer loan products",
          "Options for debt consolidation across credit profiles",
          "Free, no-obligation consultation to explore your options",
        ]}
        faqs={FAQS}
        relatedStatePages={RELATED}
        content={<>
          <h2>California's Personal Loan Market</h2>
          <p>California's personal lending market is the largest and most competitive of any US state. Average household income in California is approximately {S.personalLoans.avgHouseholdIncome}, though this average masks extreme variation — from Silicon Valley six-figure earners to agricultural workers in the Central Valley earning significantly less.</p>
          <p>{S.personalLoans.lendingContext}</p>
          <p>{S.personalLoans.localEconomy}</p>
          <h2>California's 36% APR Cap: What It Means for You</h2>
          <p>{S.personalLoans.usuryCap}</p>
          <p>This cap — enacted through AB 539 in 2020 — was specifically designed to address the "middle market" of personal loans that previously had no rate protection. Before this law, lenders could charge rates of 90–200% on loans in this range while technically staying legal. The 36% cap brought California in line with the strongest consumer-protective states.</p>
          <p>One important caveat: the cap applies to loans of $2,500–$10,000. For larger consolidation amounts, the cap does not apply. Some lenders structure loan offers above $10,000 to avoid the cap — review the loan structure carefully when comparing options for larger amounts.</p>
          <h2>California Credit Unions for Personal Loans</h2>
          <p>California has an extensive credit union ecosystem with some of the best personal loan rates available to qualifying members. Notable options include Golden 1 Credit Union (Sacramento and statewide), SchoolsFirst Federal Credit Union (Southern California education workers), Star One Credit Union (Silicon Valley tech workers), San Diego County Credit Union, and First Tech Federal Credit Union (technology sector workers).</p>
          <p>Membership eligibility varies. Many California credit unions have expanded beyond their original employee or geographic base and may be more accessible than their names suggest.</p>
          <h2>Tech Sector Layoffs and Personal Loan Options</h2>
          <p>The Bay Area tech layoff cycle has created a specific financial challenge for California: formerly high-income workers with significant credit card debt, reduced or eliminated income, and difficulty qualifying for new loans. For these borrowers, traditional personal loan consolidation may not be available during the income gap.</p>
          <p>{S.personalLoans.keyConsideration}</p>
          <p>If a recent income reduction has made personal loan qualification difficult while credit card debt has become unmanageable, a debt relief specialist consultation can help identify what options are available during and after the income disruption.</p>
        </>}
      />
    </>
  );
}
