import { DEFAULT_OG_IMAGE, DEFAULT_TWITTER_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import { StateServicePage } from "@/components/StateServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { STATES } from "@/lib/stateData";

const S = STATES.pennsylvania;
const CANONICAL = "https://www.wehelpfinance.com/tax-relief/pennsylvania";

export const metadata: Metadata = {
  title:
    "Tax Relief in Pennsylvania — IRS & PA DOR Debt Help for PA Residents | WeHelpFinance",
  description:
    "Pennsylvania residents face IRS federal debt, PA Department of Revenue state tax, and local earned income tax — one of the most complex local tax systems in the US. Explore tax relief options.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Tax Relief in Pennsylvania | WeHelpFinance",
    description:
      "PA's complex multi-layer tax system — IRS, PA DOR, and local EIT — requires specialized knowledge to navigate. Free tax relief consultation.",
    url: CANONICAL,
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tax Relief in Pennsylvania | WeHelpFinance",
    description:
      "IRS and PA state tax relief for Pennsylvania residents. Free consultation.",
    images: [DEFAULT_TWITTER_IMAGE],
  },
};

const FAQS = [
  {
    q: "What taxes do Pennsylvania residents owe?",
    a: "Pennsylvania residents owe federal income tax to the IRS, Pennsylvania state income tax (3.07% flat rate) to the PA Department of Revenue, and local earned income tax to their municipality or school district. Pennsylvania's local tax system is one of the most complex in the country, with hundreds of separate taxing jurisdictions.",
  },
  {
    q: "Does Pennsylvania have a state income tax?",
    a: "Yes. Pennsylvania has a flat state income tax rate of 3.07% — one of the lowest flat rates in the country. The PA Department of Revenue collects this tax and has its own collection tools independent of the IRS.",
  },
  {
    q: "What is Pennsylvania's local earned income tax?",
    a: "Pennsylvania is unique in having an extensive local earned income tax (EIT) system. Hundreds of municipalities and school districts levy their own income taxes, typically 1–3% of earnings. Philadelphia's wage tax for residents is among the highest at 3.75%. Self-employed individuals must file with and pay their local tax bureau separately from state and federal obligations.",
  },
  {
    q: "What IRS relief programs are available for Pennsylvania residents?",
    a: "Pennsylvania residents have access to all federal IRS programs: Offer in Compromise, Installment Agreements, Currently Not Collectible status, penalty abatement, and Innocent Spouse Relief. The IRS has offices in Philadelphia and Pittsburgh serving Pennsylvania taxpayers.",
  },
  {
    q: "Does Pennsylvania have its own tax relief programs?",
    a: "Yes. The Pennsylvania Department of Revenue has installment agreement programs for state income tax debt. PA DOR also has compromise provisions for specific circumstances, though the program is more limited than the IRS OIC. Philadelphia residents with city wage tax debt must resolve that separately with the Philadelphia Department of Revenue.",
  },
  {
    q: "Why do self-employed Pennsylvanians often have tax problems?",
    a: "Pennsylvania's multi-layer tax system — federal, state, and local — requires self-employed individuals to make quarterly estimated payments to multiple taxing authorities simultaneously. Many self-employed Pennsylvanians manage federal and state payments but miss local EIT quarterly obligations, creating local tax debt that accumulates with penalties and interest.",
  },
];

const RELATED = [
  { href: "/tax-relief/texas", label: "Texas" },
  { href: "/tax-relief/florida", label: "Florida" },
  { href: "/tax-relief/california", label: "California" },
  { href: "/tax-relief/new-york", label: "New York" },
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
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "https://www.wehelpfinance.com/" },
              {
                name: "Tax Relief",
                path: "https://www.wehelpfinance.com/tax-relief",
              },
              { name: "Pennsylvania", path: CANONICAL },
            ]),
          ),
        }}
      />
      <StateServicePage
        stateName={S.name}
        stateAbbr={S.abbreviation}
        vertical="tax-relief"
        category="tax-relief"
        eyebrow="Tax Relief"
        author="WeHelpFinance Research Team"
        title={
          <>
            Tax Relief in{" "}
            <span className="italic text-primary">Pennsylvania</span>
          </>
        }
        lede="Pennsylvania residents face one of the most complex multi-layer tax environments in the country — federal IRS, Pennsylvania Department of Revenue state tax (3.07% flat rate), and a local earned income tax system administered by hundreds of separate jurisdictions. Understanding and resolving obligations at all levels requires a coordinated approach."
        bullets={[
          "Three tax layers for most PA residents — IRS federal, PA DOR state, local EIT",
          "3.07% flat state income tax rate — one of the lowest in the country",
          "Philadelphia wage tax at 3.75% for city residents — among the highest municipal rates",
          "IRS Offer in Compromise and payment plan options for qualifying residents",
          "Free, confidential consultation — no obligation",
        ]}
        faqs={FAQS}
        relatedStatePages={RELATED}
        content={
          <>
            <h2>Pennsylvania's Unique Tax Complexity</h2>
            <p>
              Pennsylvania has one of the most complex local tax systems of any
              US state. Unlike most states where residents file with the IRS and
              their state revenue department, Pennsylvania residents must also
              navigate a dense network of local earned income taxes administered
              by municipal and school district taxing jurisdictions — often
              through local tax bureaus that operate independently of both the
              state and federal government.
            </p>
            <p>{S.taxRelief.localTaxContext}</p>
            <p>
              For self-employed Pennsylvanians, this means quarterly estimated
              payments to potentially three separate levels of government: the
              IRS (federal), the Pennsylvania Department of Revenue (state), and
              a local tax bureau (municipal/school district). Missing
              obligations at any level creates debt that accrues separately and
              requires separate resolution.
            </p>

            <h2>Pennsylvania Department of Revenue</h2>
            <p>
              Pennsylvania's state income tax rate of {S.taxRelief.stateTaxRate}{" "}
              is among the lowest flat rates in the country — a genuine
              advantage for Pennsylvania residents compared to California (up to
              13.3%) or New York (up to 10.9%). However, the low rate does not
              mean the PA DOR's collection is less aggressive. The{" "}
              {S.taxRelief.stateAgency} has its own lien and levy authority for
              unpaid state income tax.
            </p>
            <p>
              PA DOR offers installment agreements for residents who cannot pay
              their state income tax in full. The terms and availability differ
              from IRS installment agreements — separate negotiation with the PA
              DOR is required alongside any IRS resolution.
            </p>

            <h2>Philadelphia's Special Tax Situation</h2>
            <p>
              Philadelphia residents face an additional layer of tax complexity.
              Philadelphia imposes a wage tax on all income earned by city
              residents — currently 3.75% for residents. For self-employed
              Philadelphians, this adds a significant municipal obligation on
              top of federal and state taxes. Philadelphia also has its own
              Department of Revenue with collection tools separate from both the
              IRS and PA DOR.
            </p>
            <p>
              Self-employed workers in Philadelphia face combined effective tax
              rates on net earnings that can approach 45%+ when all layers are
              accounted for: federal income tax, self-employment tax,
              Pennsylvania state income tax, and Philadelphia wage tax.
              First-year self-employed Philadelphians often accumulate
              obligations at all four levels before realizing the full scope of
              their annual tax burden.
            </p>

            <h2>IRS Relief Programs for Pennsylvania Residents</h2>
            <p>{S.taxRelief.selfEmployedContext}</p>
            <p>
              Pennsylvania residents have access to all IRS relief programs. The
              IRS has offices in {S.taxRelief.irsOfficeCities} to serve
              Pennsylvania taxpayers.
            </p>
            <p>
              <strong>Offer in Compromise:</strong> For qualifying Pennsylvania
              residents, the IRS OIC program allows settling federal tax debt
              for less than the full amount. Eligibility is based on income,
              expenses, and assets. Pennsylvania's low homestead exemption
              ($300) means home equity is fully counted in the IRS's asset
              calculation.
            </p>
            <p>
              <strong>Installment Agreements:</strong> Monthly payment plans
              structured around your actual income and necessary expenses.
              Streamlined agreements are available for balances up to $50,000.
              Larger balances require detailed financial disclosure.
            </p>
            <p>
              <strong>Currently Not Collectible:</strong> For Pennsylvania
              residents in genuine financial hardship, CNC status temporarily
              halts IRS collection while interest continues to accrue.
            </p>

            <h2>Coordinating Multi-Level Resolution</h2>
            <p>
              The most effective approach for Pennsylvania residents with tax
              debt at multiple levels is coordinated resolution — addressing
              federal, state, and local obligations in a sequenced manner that
              accounts for each agency's priorities and collection timelines. A
              tax relief specialist familiar with Pennsylvania's multi-level
              system can help develop a strategy that addresses all layers
              without allowing one agency's enforcement to complicate another's
              resolution.
            </p>
            <p>
              A free consultation is the right starting point — understanding
              the full scope of your Pennsylvania tax situation before taking
              action that could affect your options at any level.
            </p>
          </>
        }
      />
    </>
  );
}
