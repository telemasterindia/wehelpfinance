import type { Metadata } from "next";
import { StateServicePage } from "@/components/StateServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { STATES } from "@/lib/stateData";

const S = STATES.california;
const CANONICAL = "https://www.wehelpfinance.com/debt-relief/california";

export const metadata: Metadata = {
  title: "Debt Relief in California — Free Consultation for CA Residents | WeHelpFinance",
  description: "California's expanded homestead exemption and Rosenthal Act protections are among the strongest in the US. Explore debt relief options for California residents — free, confidential consultation.",
  alternates: { canonical: CANONICAL },
  openGraph: { title: "Debt Relief in California | WeHelpFinance", description: "California expanded its homestead exemption to $300K–$600K in 2021. Explore your debt relief options — free consultation.", url: CANONICAL, type: "website" },
  twitter: { card: "summary_large_image", title: "Debt Relief in California | WeHelpFinance", description: "Debt relief options for California residents. Free consultation." },
};

const FAQS = [
  { q: "Can creditors garnish my wages in California?", a: "Yes, but with meaningful limits. California caps wage garnishment at 25% of disposable earnings or the amount by which disposable earnings exceed 40 times the state minimum wage, whichever is less. Given California's high minimum wage ($16–20+/hour depending on employer), the 40x calculation often protects lower-wage workers more than the 25% rule." },
  { q: "What is California's statute of limitations on credit card debt?", a: "California has a 4-year statute of limitations on credit card debt, running from the date of last payment or default. After 4 years, creditors cannot obtain a court judgment. Making any payment or acknowledgment in writing can restart this clock." },
  { q: "What is the California Rosenthal Act?", a: "The California Rosenthal Fair Debt Collection Practices Act extends FDCPA-like protections to original creditors — meaning your original credit card company must follow fair collection practices, not just third-party collectors. This is broader protection than the federal FDCPA provides in most states." },
  { q: "How much is California's homestead exemption?", a: "California expanded its homestead exemption in 2021 to $300,000–$600,000 depending on your county's median home price. This is one of the strongest homestead protections in the country and applies automatically to your primary residence." },
  { q: "Is debt settlement available in California?", a: "Yes. Debt settlement is legal and widely available in California. California does have specific regulations for debt settlement companies operating in the state, including fee disclosure requirements and licensing obligations. Always verify that a debt settlement company is properly licensed in California." },
  { q: "Can tech layoffs qualify me for debt settlement in California?", a: "Job loss is one of the most common qualifying circumstances for debt settlement. If a layoff or income reduction has made your minimum payments genuinely unmanageable, you may be a good candidate for a settlement program. The amount of unsecured debt ($7,500+ is typically required), your remaining income, and the age of your accounts are all factors a specialist will assess." },
];

const RELATED = [
  { href: "/debt-relief/texas", label: "Texas" },
  { href: "/debt-relief/florida", label: "Florida" },
  { href: "/debt-relief/new-york", label: "New York" },
  { href: "/debt-relief/pennsylvania", label: "Pennsylvania" },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: "Home", path: "https://www.wehelpfinance.com/" },
        { name: "Debt Relief", path: "https://www.wehelpfinance.com/debt-relief" },
        { name: "California", path: CANONICAL },
      ])) }} />
      <StateServicePage
        stateName={S.name} stateAbbr={S.abbreviation} vertical="debt-relief" category="debt-relief"
        eyebrow="Debt Relief" author="WeHelpFinance Research Team"
        title={<>Debt Relief in <span className="italic text-primary">California</span></>}
        lede="California has the highest cost of living of any large US state — and an average credit card debt above $7,200 to show for it. The tech sector's mass layoffs of 2022–2025 pushed thousands of formerly high-income Californians into genuine financial hardship. California also has stronger consumer protections than most people realize."
        bullets={[
          "Homestead exemption of $300,000–$600,000 depending on county — expanded in 2021",
          "Rosenthal Act extends debt collection protections beyond the federal FDCPA",
          "Wage garnishment limited by California's high minimum wage calculation",
          "4-year statute of limitations on credit card debt",
          "Free, confidential consultation — no obligation",
        ]}
        faqs={FAQS}
        relatedStatePages={RELATED}
        content={<>
          <h2>California's Debt Crisis</h2>
          <p>California's cost-of-living crisis has been building for decades and reached an acute stage in the early 2020s. The Bay Area, Los Angeles, and San Diego have housing costs that consume 40–60% of median household income for renters — leaving almost no financial buffer for unexpected expenses, income disruptions, or the kinds of cost increases that hit everyone between 2021 and 2025.</p>
          <p>{S.debtRelief.delinquencyContext}</p>
          <p>Average credit card debt for California residents is approximately {S.debtRelief.avgCreditCardDebt} — above the national average and reflecting the structural pressure that high costs place on household finances across income levels.</p>

          <h2>California Consumer Protections</h2>
          <h3>Expanded Homestead Exemption</h3>
          <p>{S.debtRelief.homesteadExemption}</p>
          <p>This expansion — from a previous maximum of $75,000 — represents a significant improvement in protections for California homeowners facing debt collection. The amount of protection scales with local housing costs, recognizing that a flat dollar amount would be inadequate in high-cost counties.</p>

          <h3>The Rosenthal Fair Debt Collection Practices Act</h3>
          <p>{S.debtRelief.uniqueProtection}</p>
          <p>In practice, this means that if your original credit card issuer — not just a third-party collector — uses abusive, deceptive, or harassing collection tactics, you may have a cause of action under California state law. This is a broader protection than most states provide.</p>

          <h3>Wage Garnishment Limits</h3>
          <p>{S.debtRelief.wageGarnishmentNote}</p>
          <p>For California's large low-wage workforce in service, hospitality, and agriculture, the 40x minimum wage calculation often provides more protection than the 25% federal rule. Workers earning near minimum wage may have all or most of their disposable earnings protected from garnishment.</p>

          <h2>Debt Relief Options for California Residents</h2>
          <p><strong>Debt settlement</strong> is a common tool for Californians in genuine financial hardship — particularly those affected by tech sector layoffs, real estate market corrections, or the income volatility of gig and contract work. Settlement typically resolves accounts for 40–60 cents on the dollar over 24–48 months. California has specific regulations for debt settlement companies, including licensing requirements — verify that any company you work with is properly licensed in California.</p>
          <p><strong>Debt consolidation</strong> via personal loan is appropriate for Californians with fair to good credit. California has a 36% APR cap on loans of $2,500–$10,000 — a meaningful consumer protection. Golden 1 Credit Union, SchoolsFirst Federal Credit Union, and Star One Credit Union are among California's largest credit unions with competitive personal loan rates.</p>
          <p><strong>Debt management plans</strong> are available to Californians at any credit score through nonprofit credit counseling agencies. These programs negotiate reduced interest rates and create 3–5 year structured repayment plans — appropriate when the goal is full repayment at better terms.</p>

          <h2>The Bay Area and Los Angeles Contexts</h2>
          <p>{S.debtRelief.localContext}</p>
          <p>For California residents in any region, a free consultation with a vetted debt specialist is the clearest way to understand what options are genuinely available for your specific situation — income level, amount of debt, credit profile, and the nature of the hardship that created the debt.</p>
        </>}
      />
    </>
  );
}

