import type { Metadata } from "next";
import { StateServicePage } from "@/components/StateServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { STATES } from "@/lib/stateData";

const S = STATES["new-york"];
const CANONICAL = "https://www.wehelpfinance.com/debt-relief/new-york";

export const metadata: Metadata = {
  title: "Debt Relief in New York — Free Consultation for NY Residents | WeHelpFinance",
  description: "New York City residents carry some of the highest average credit card balances in the US. New York's 3-year statute of limitations is shorter than most states. Explore debt relief options for NY residents.",
  alternates: { canonical: CANONICAL },
  openGraph: { title: "Debt Relief in New York | WeHelpFinance", description: "New York has a 3-year statute of limitations on credit card debt — shorter than most states. Explore your debt relief options.", url: CANONICAL, type: "website" },
  twitter: { card: "summary_large_image", title: "Debt Relief in New York | WeHelpFinance", description: "Debt relief options for New York residents. Free, confidential consultation." },
};

const FAQS = [
  { q: "What is New York's statute of limitations on credit card debt?", a: "New York has a 3-year statute of limitations on credit card debt — one of the shortest in the country. After 3 years from the date of last payment or default, creditors cannot successfully sue you to collect the debt. This is a meaningful protection for New Yorkers with older delinquent accounts." },
  { q: "Can creditors garnish my wages in New York?", a: "Yes, but with stronger protections than the federal standard. New York limits garnishment to 10% of gross wages or 25% of disposable earnings above 30 times the federal minimum wage, whichever is less. This is more protective than the federal 25% rule, particularly for lower-wage workers." },
  { q: "How much is New York's homestead exemption?", a: "New York's homestead exemption ranges from $75,000 to $150,000 depending on the county. Higher exemptions apply in New York City and surrounding high-cost counties. This is lower than Texas and Florida's unlimited exemptions but provides meaningful protection in lower-cost regions." },
  { q: "Why is credit card debt so high in New York City?", a: "New York City's extraordinary cost of living — average one-bedroom rent in Manhattan above $4,000/month, high transportation costs, and elevated prices for everyday goods — creates a structural gap between income and expenses for most middle-income residents. Credit cards fill this gap, and the balance grows with each month that expenses exceed income." },
  { q: "Is debt settlement available in New York?", a: "Yes. Debt settlement is legal and available to New York residents. New York has specific consumer protection requirements for debt settlement companies operating in the state. Always verify licensing before working with any debt settlement provider." },
  { q: "Does New York have any special debt collection protections?", a: "Yes. New York supplements the federal FDCPA with state-level debt collection protections. New York's shorter 3-year statute of limitations is itself a significant protection. New York also has strong legal aid and consumer protection infrastructure in New York City for residents who need legal assistance with debt collection issues." },
];

const RELATED = [
  { href: "/debt-relief/texas", label: "Texas" },
  { href: "/debt-relief/florida", label: "Florida" },
  { href: "/debt-relief/california", label: "California" },
  { href: "/debt-relief/pennsylvania", label: "Pennsylvania" },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: "Home", path: "https://www.wehelpfinance.com/" },
        { name: "Debt Relief", path: "https://www.wehelpfinance.com/debt-relief" },
        { name: "New York", path: CANONICAL },
      ])) }} />
      <StateServicePage
        stateName={S.name} stateAbbr={S.abbreviation} vertical="debt-relief" category="debt-relief"
        eyebrow="Debt Relief" author="WeHelpFinance Research Team"
        title={<>Debt Relief in <span className="italic text-primary">New York</span></>}
        lede="New York City residents carry some of the highest average credit card balances in the country — a direct consequence of a cost of living that consumes most of even above-average incomes. New York also has a 3-year statute of limitations on credit card debt, one of the shortest in the country — an important protection many residents do not know about."
        bullets={[
          "3-year statute of limitations on credit card debt — shorter than most states",
          "Wage garnishment capped at 10% of gross wages — more protective than federal standard",
          "Homestead exemption up to $150,000 in high-cost counties",
          "Programs for $7,500+ in credit card, medical, or personal loan debt",
          "Free, confidential consultation — no obligation",
        ]}
        faqs={FAQS}
        relatedStatePages={RELATED}
        content={<>
          <h2>Debt in New York: A Cost-of-Living Crisis</h2>
          <p>New York City's debt problem is structural. When average rent for a one-bedroom apartment in Manhattan exceeds $4,000 per month — and the city's median household income is approximately $75,000 — even dual-income households find themselves with little financial cushion after housing, transportation, and basic expenses.</p>
          <p>{S.debtRelief.delinquencyContext}</p>
          <p>Average credit card debt for New York State residents is approximately {S.debtRelief.avgCreditCardDebt}, with city residents carrying significantly more. This is not primarily a story of lifestyle overspending — it is a story of housing costs consuming income that used to be available for savings and debt payoff.</p>

          <h2>New York Consumer Protections</h2>
          <h3>3-Year Statute of Limitations — A Critical Advantage</h3>
          <p>New York's {S.debtRelief.statuteOfLimitationsCC}-year statute of limitations on credit card debt is one of the most significant consumer protections in the state — and one of the least known. Many New Yorkers dealing with collection calls on accounts that are 3+ years past the last payment date have already passed the legal window for a successful lawsuit.</p>
          <p>{S.debtRelief.uniqueProtection}</p>
          <p>Before making any payment on a collection account, New Yorkers should verify the date of last payment or default. Making any payment — even a small one — or acknowledging the debt in writing can restart the statute of limitations clock under New York law, potentially giving collectors new legal standing.</p>

          <h3>Wage Garnishment Protections</h3>
          <p>{S.debtRelief.wageGarnishmentNote}</p>

          <h3>Homestead Exemption</h3>
          <p>{S.debtRelief.homesteadExemption}</p>

          <h2>Debt Relief Options for New York Residents</h2>
          <p><strong>Debt settlement</strong> is available to New Yorkers in genuine financial hardship with $7,500 or more in unsecured debt. New York regulates debt settlement companies and requires specific disclosures. Settlement typically resolves accounts for 40–60 cents on the dollar over 24–48 months. For New Yorkers with older accounts approaching or past the 3-year statute of limitations, the timing of settlement negotiations has particular strategic significance.</p>
          <p><strong>Debt consolidation</strong> via personal loan is an option for New Yorkers with fair to good credit. New York's 16% civil usury cap limits options from some lenders, but major banks, credit unions, and federally chartered lenders offer competitive products. Municipal Credit Union (NYC-based) and Bethpage Federal Credit Union are among New York's larger credit unions with competitive personal loan rates.</p>
          <p><strong>Debt management plans</strong> through nonprofit credit counseling are available to New Yorkers at any credit score and are often the best path for those who cannot access a personal loan at a rate below their current card APRs due to New York's 16% cap.</p>

          <h2>Upstate New York's Different Challenge</h2>
          <p>{S.debtRelief.localContext}</p>
          <p>For New York residents in any part of the state, a free consultation with a vetted specialist provides the clearest path to understanding what debt relief options are genuinely available and appropriate for your specific situation.</p>
        </>}
      />
    </>
  );
}

