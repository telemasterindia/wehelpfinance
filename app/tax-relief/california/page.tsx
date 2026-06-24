import type { Metadata } from "next";
import { StateServicePage } from "@/components/StateServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { STATES } from "@/lib/stateData";

const S = STATES.california;
const CANONICAL = "https://www.wehelpfinance.com/tax-relief/california";

export const metadata: Metadata = {
  title: "Tax Relief in California — IRS & FTB Debt Help for CA Residents | WeHelpFinance",
  description: "California taxpayers face both IRS federal debt and California FTB state tax obligations — each requiring separate resolution. Explore tax relief options for California residents.",
  alternates: { canonical: CANONICAL },
  openGraph: { title: "Tax Relief in California | WeHelpFinance", description: "California's FTB has its own collection powers separate from the IRS. Get help resolving both federal and state tax debt.", url: CANONICAL, type: "website" },
  twitter: { card: "summary_large_image", title: "Tax Relief in California | WeHelpFinance", description: "IRS and FTB tax relief for California residents. Free consultation." },
};

const FAQS = [
  { q: "What is the California Franchise Tax Board (FTB)?", a: "The California Franchise Tax Board is the state agency responsible for collecting California income taxes. Unlike Texas and Florida (which have no state income tax), California taxpayers owe both federal taxes to the IRS and state taxes to the FTB. Both agencies have collection powers and require separate resolution processes." },
  { q: "Can the IRS and FTB both collect from me at the same time?", a: "Yes. The IRS and California FTB are separate agencies with independent collection authority. You can receive simultaneous collection notices, wage garnishments, and bank levies from both the IRS and the FTB. Resolving federal IRS debt does not automatically resolve FTB state debt, and vice versa." },
  { q: "Does the FTB have its own Offer in Compromise program?", a: "Yes. The California FTB has its own offer-in-compromise program, separate from the IRS OIC. FTB OIC eligibility and evaluation criteria differ from the IRS program. A resolution accepted by the IRS does not bind the FTB, and FTB acceptance does not bind the IRS. Both must be resolved separately." },
  { q: "Why do so many tech workers in California have tax problems?", a: "California tech workers often receive significant compensation through RSUs (restricted stock units) that vest at specific dates. RSU income is taxed at vesting — meaning a large stock grant can create a significant tax bill in the year of vesting regardless of what happens to the stock price afterward. Tech workers who did not withhold enough during high-vesting years can end up with substantial IRS and FTB tax debt." },
  { q: "What is California's top income tax rate and why does it matter for tax debt?", a: "California's top marginal income tax rate is 13.3% — the highest of any US state. Combined with the federal top rate of 37%, California's highest earners face marginal rates above 50%. This makes tax planning critical and creates significant tax debt risk for high earners who underestimate their quarterly obligations." },
  { q: "What should I do if I have both IRS and California FTB debt?", a: "Seek help from a specialist who can address both federal and state obligations simultaneously. The IRS and FTB have different resolution programs, timelines, and eligibility requirements. Coordinating resolution of both can prevent situations where one agency's enforcement actions complicate the other's resolution process." },
];

const RELATED = [
  { href: "/tax-relief/texas", label: "Texas" },
  { href: "/tax-relief/florida", label: "Florida" },
  { href: "/tax-relief/new-york", label: "New York" },
  { href: "/tax-relief/pennsylvania", label: "Pennsylvania" },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: "Home", path: "https://www.wehelpfinance.com/" },
        { name: "Tax Relief", path: "https://www.wehelpfinance.com/tax-relief" },
        { name: "California", path: CANONICAL },
      ])) }} />
      <StateServicePage
        stateName={S.name} stateAbbr={S.abbreviation} vertical="tax-relief" category="tax-relief"
        eyebrow="Tax Relief" author="WeHelpFinance Research Team"
        title={<>Tax Relief in <span className="italic text-primary">California</span></>}
        lede="California taxpayers face a unique dual-agency challenge: IRS federal tax debt and California Franchise Tax Board state tax obligations each require separate resolution. With the country's highest top marginal state income tax rate (13.3%), California creates significant tax liability risk — particularly for tech workers with RSU income and self-employed workers in high-income years."
        bullets={[
          "IRS federal relief AND California FTB state relief — both handled separately",
          "FTB has its own Offer in Compromise program distinct from the IRS",
          "Help for tech workers with RSU income tax problems",
          "13.3% top state rate — combined federal + state marginal rates above 50%",
          "Free, confidential consultation — no obligation",
        ]}
        faqs={FAQS}
        relatedStatePages={RELATED}
        content={<>
          <h2>California's Dual Tax Agency Problem</h2>
          <p>California taxpayers face a complexity that residents of Texas and Florida do not: two separate tax agencies with independent collection authority. The IRS collects federal income taxes. The California Franchise Tax Board (FTB) collects state income taxes at rates up to {S.taxRelief.stateTaxRate}. Both can simultaneously issue notices, file liens, levy bank accounts, and garnish wages.</p>
          <p>Resolving IRS debt does not resolve FTB debt. A payment plan with the IRS does not satisfy FTB obligations. An OIC accepted by the IRS does not bind the FTB. Each agency must be addressed separately — which is why California tax debt resolution requires specialists who understand both federal and California state programs.</p>

          <h2>Tech Sector Tax Debt: The RSU Problem</h2>
          <p>{S.taxRelief.commonIssue}</p>
          <p>This is one of the most common tax debt patterns in the Bay Area and Silicon Valley. A software engineer receives a grant of 10,000 RSUs with a four-year vesting schedule. In Year 3, when 2,500 RSUs vest at $50/share, the $125,000 in RSU income triggers a significant combined IRS and FTB tax bill. If the withholding election was inadequate, or if the employer withheld at supplemental rates that did not cover the full tax liability, the engineer ends up owing tens of thousands in taxes — even if the stock subsequently declined to $20/share after vesting.</p>
          <p>The FTB is particularly aggressive about taxing RSU income from California companies, even when the recipient has since moved out of California. California asserts taxation rights over compensation earned while working in the state, regardless of the recipient's subsequent residence.</p>

          <h2>California FTB Relief Programs</h2>
          <p>The California FTB has its own set of resolution programs, parallel to but separate from IRS programs:</p>
          <p><strong>FTB Offer in Compromise:</strong> Allows qualifying California taxpayers to settle state tax debt for less than the full amount. FTB OIC eligibility criteria differ from the IRS — the FTB is generally considered more restrictive in granting OICs than the IRS. The FTB requires demonstration of inability to pay the full liability within the collection statute period.</p>
          <p><strong>FTB Installment Agreement:</strong> Monthly payment plans for California state tax debt. The FTB may require full payment within 5 years. Penalties and interest continue to accrue during the installment period.</p>
          <p><strong>FTB Penalty Abatement:</strong> California offers penalty abatement for reasonable cause and for first-time penalty situations. Given California's high penalty rates, abatement can significantly reduce total liability.</p>

          <h2>IRS Relief Programs for California Residents</h2>
          <p>California residents have access to all standard IRS relief programs — Offer in Compromise, Installment Agreements, Currently Not Collectible status, penalty abatement, and Innocent Spouse Relief. IRS offices serving California are in {S.taxRelief.irsOfficeCities}.</p>
          <p>{S.taxRelief.selfEmployedContext}</p>

          <h2>Coordinating Federal and State Resolution</h2>
          <p>The most effective approach for California taxpayers with both IRS and FTB debt is coordinated resolution — addressing both agencies in a sequenced, strategic manner that accounts for each agency's collection priorities, statute of limitations, and resolution programs. A specialist with experience in both federal and California state tax resolution can develop a coordinated strategy that prevents one agency's enforcement from undermining the other's resolution process.</p>
          <p>A free consultation is the first step — understanding the full scope of your California tax situation, both federal and state, before taking any action that could affect your resolution options.</p>
        </>}
      />
    </>
  );
}

