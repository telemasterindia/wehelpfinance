import type { Metadata } from "next";
import { StateServicePage } from "@/components/StateServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { STATES } from "@/lib/stateData";

const S = STATES["new-york"];
const CANONICAL = "https://www.wehelpfinance.com/tax-relief/new-york";

export const metadata: Metadata = {
  title: "Tax Relief in New York — IRS & NYS DTF Debt Help for NY Residents | WeHelpFinance",
  description: "New York City residents face three layers of income tax — federal IRS, New York State DTF, and NYC city tax. Explore tax relief options for New York residents.",
  alternates: { canonical: CANONICAL },
  openGraph: { title: "Tax Relief in New York | WeHelpFinance", description: "NY residents can face IRS, NY State DTF, and NYC city tax debt simultaneously. Free tax relief consultation.", url: CANONICAL, type: "website" },
  twitter: { card: "summary_large_image", title: "Tax Relief in New York | WeHelpFinance", description: "IRS and NYS tax relief for New York residents. Free consultation." },
};

const FAQS = [
  { q: "How many tax agencies can collect from New York City residents?", a: "New York City residents can face three layers of income tax collection simultaneously: the IRS (federal), the New York State Department of Taxation and Finance (state, up to 10.9%), and the New York City Department of Finance (city, up to 3.876%). Each is a separate agency with independent collection authority. Resolving one does not resolve the others." },
  { q: "What is the New York State Department of Taxation and Finance (DTF)?", a: "The DTF is the New York State agency responsible for collecting state income taxes, corporate taxes, and other state tax obligations. The DTF has aggressive collection tools including wage garnishments, bank account levies, and tax warrants (which function as court judgments and can affect your ability to sell property or refinance). DTF resolutions are separate from IRS resolutions." },
  { q: "Does New York State have its own Offer in Compromise program?", a: "Yes. New York State DTF has an offer-in-compromise program for state tax liabilities. Like the IRS OIC, it requires demonstration of inability to pay the full amount. New York's DTF OIC program is considered fairly restrictive — they evaluate income, expenses, and assets carefully. An IRS OIC does not affect your DTF liability." },
  { q: "Can the DTF garnish my wages in New York?", a: "Yes. The New York DTF can garnish wages for unpaid state tax debt. This is separate from — and in addition to — any IRS wage levy for federal tax debt. Unlike general consumer creditors, tax agencies (both IRS and DTF) are not subject to the consumer wage garnishment limits that apply to ordinary creditors." },
  { q: "Why do New York freelancers often have tax debt?", a: "New York City's large creative and freelance workforce — in media, fashion, art, design, and technology — faces combined federal, state, and city tax obligations that can total 40–50% of net self-employment earnings. Many freelancers in their early years significantly underestimate this combined burden and fail to make adequate quarterly estimated payments to all three taxing agencies." },
  { q: "What should I do if I have received notices from both the IRS and DTF?", a: "Seek help from a specialist familiar with both federal and New York State resolution programs. The notices have different deadlines and require different responses. Missing either deadline can result in escalating enforcement. A coordinated approach to both simultaneously prevents one agency's enforcement from complicating the other's resolution." },
];

const RELATED = [
  { href: "/tax-relief/texas", label: "Texas" },
  { href: "/tax-relief/florida", label: "Florida" },
  { href: "/tax-relief/california", label: "California" },
  { href: "/tax-relief/pennsylvania", label: "Pennsylvania" },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: "Home", path: "https://www.wehelpfinance.com/" },
        { name: "Tax Relief", path: "https://www.wehelpfinance.com/tax-relief" },
        { name: "New York", path: CANONICAL },
      ])) }} />
      <StateServicePage
        stateName={S.name} stateAbbr={S.abbreviation} vertical="tax-relief" category="tax-relief"
        eyebrow="Tax Relief" author="WeHelpFinance Research Team"
        title={<>Tax Relief in <span className="italic text-primary">New York</span></>}
        lede="New York City residents face the most complex tax collection environment of any US jurisdiction: federal IRS, New York State DTF, and New York City income tax can all collect simultaneously and independently. Understanding how these three agencies interact — and how to resolve debt with each — is essential for New Yorkers facing tax problems."
        bullets={[
          "Three potential taxing agencies for NYC residents — IRS, NY State DTF, NYC",
          "DTF has its own Offer in Compromise program separate from the IRS",
          "NYS income tax up to 10.9% + NYC city tax up to 3.876%",
          "Help with unfiled federal and state returns",
          "Free, confidential consultation — no obligation",
        ]}
        faqs={FAQS}
        relatedStatePages={RELATED}
        content={<>
          <h2>New York's Multi-Layer Tax Problem</h2>
          <p>New York City residents face a tax complexity that exists nowhere else in the country at this scale. {S.taxRelief.stateTaxRate}. Each layer is administered by a separate agency with independent collection authority, separate resolution programs, and separate timelines.</p>
          <p>A New York City resident with $50,000 in combined tax debt may owe $30,000 to the IRS, $15,000 to the New York State DTF, and $5,000 to New York City. Resolving any one of these does not affect the other two. Three separate payment plans, three sets of notices, three potential enforcement actions — the administrative burden alone can be overwhelming without professional assistance.</p>

          <h2>The New York State DTF: Collection Powers and Programs</h2>
          <p>The New York State Department of Taxation and Finance (DTF) is one of the most aggressive state tax collection agencies in the country. Its enforcement tools include:</p>
          <ul>
            <li>Wage garnishments for unpaid state tax debt</li>
            <li>Bank account levies — the DTF can seize bank account funds without a court order</li>
            <li>Tax warrants — these are recorded in the county clerk's office and function as judgments, affecting your ability to sell property, refinance a mortgage, or obtain credit</li>
            <li>Driver's license suspension for certain delinquent taxpayers</li>
            <li>Referral to the New York State Attorney General's office for significant cases</li>
          </ul>
          <p>{S.taxRelief.localTaxContext}</p>

          <h2>DTF Resolution Programs</h2>
          <p>New York State has its own resolution programs separate from IRS programs:</p>
          <p><strong>DTF Offer in Compromise:</strong> New York's OIC program allows qualifying taxpayers to settle state tax debt for less than the full amount. The DTF evaluates income, expenses, and assets under their own guidelines — which are separate from the IRS OIC evaluation. The DTF is considered fairly rigorous in their OIC evaluation.</p>
          <p><strong>DTF Installment Agreement:</strong> Monthly payment plans for state tax debt. The DTF typically requires resolution within a specific timeframe and may require financial disclosure similar to the IRS. Penalties and interest continue to accrue during the payment plan period.</p>
          <p><strong>DTF Penalty Abatement:</strong> New York offers penalty reduction for reasonable cause and first-time situations. Given New York's significant penalty rates, abatement requests are worth pursuing where there are grounds to do so.</p>

          <h2>The Freelance and Creative Economy Tax Problem</h2>
          <p>{S.taxRelief.selfEmployedContext}</p>
          <p>For New York City's enormous freelance workforce, the combined tax burden can be particularly surprising. A freelance designer earning $80,000 in net self-employment income faces: federal income tax (~22%), federal self-employment tax (15.3% on net earnings), New York State income tax (~6.5%), and New York City income tax (~3.5%). Total effective rate: approximately 47% on that income. First-year freelancers in New York City are frequently shocked by this combined obligation and fall behind almost immediately.</p>

          <h2>IRS Relief for New York Residents</h2>
          <p>New York residents have access to all IRS relief programs — Offer in Compromise, Installment Agreements, Currently Not Collectible status, penalty abatement, and Innocent Spouse Relief. IRS offices serving New York are in {S.taxRelief.irsOfficeCities}.</p>
          <p>A free consultation with a tax relief specialist familiar with both federal and New York State resolution is the most efficient starting point for understanding the full scope of your situation and the realistic resolution options available.</p>
        </>}
      />
    </>
  );
}

