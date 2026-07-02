import { DEFAULT_OG_IMAGE, DEFAULT_TWITTER_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import { StateServicePage } from "@/components/StateServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { STATES } from "@/lib/stateData";

const S = STATES.texas;
const CANONICAL = "https://www.wehelpfinance.com/tax-relief/texas";

export const metadata: Metadata = {
  title: "Tax Relief in Texas — IRS Debt Help for TX Residents | WeHelpFinance",
  description:
    "Texas has no state income tax — but IRS federal tax debt is a significant issue for the state's large self-employed and 1099 workforce. Explore tax relief options for Texas residents.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Tax Relief in Texas | WeHelpFinance",
    description:
      "Texas has no state income tax but IRS debt is common for self-employed and 1099 workers. Free tax relief consultation.",
    url: CANONICAL,
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tax Relief in Texas | WeHelpFinance",
    description:
      "IRS tax relief options for Texas residents. Free consultation.",
    images: [DEFAULT_TWITTER_IMAGE],
  },
};

const FAQS = [
  {
    q: "Does Texas have a state income tax?",
    a: "No. Texas has no state income tax. Texas residents only owe federal income tax to the IRS. However, Texas does have a franchise tax for businesses, and property taxes are among the highest in the country. IRS federal tax debt remains a significant issue for many Texans despite the absence of state income tax.",
  },
  {
    q: "What IRS programs are available for Texas residents with tax debt?",
    a: "Texas residents have access to the full range of federal IRS relief programs: Offer in Compromise (settling for less than owed), Installment Agreements (monthly payment plans), Currently Not Collectible status (temporary halt of collection for hardship cases), penalty abatement, and Innocent Spouse Relief. The IRS Fresh Start program has expanded eligibility for several of these programs.",
  },
  {
    q: "Why do so many self-employed Texans have IRS debt?",
    a: "Texas's large self-employed workforce — in oil field services, construction, trucking, and agriculture — faces self-employment tax of 15.3% on net earnings plus regular income tax. Without payroll withholding, quarterly estimated payments must be made proactively. Many first-year self-employed Texans miss or underestimate these payments and accumulate IRS debt before they realize the full scope of their tax obligations.",
  },
  {
    q: "Can the IRS garnish wages in Texas?",
    a: "Yes. Unlike state-level consumer creditors, the IRS has federal authority to issue wage levies even in states like Texas that prohibit wage garnishment for consumer debt. Texas's wage garnishment prohibition does not apply to IRS enforcement. However, the IRS typically follows an extended notice process before levying wages, giving taxpayers time to seek relief.",
  },
  {
    q: "What is an IRS Offer in Compromise for Texas residents?",
    a: "An Offer in Compromise (OIC) allows qualifying taxpayers to settle their federal tax debt for less than the full amount owed. Eligibility is based on your ability to pay, income, expenses, and asset equity. Not every taxpayer qualifies — the IRS evaluates each case individually. A tax relief specialist can assess your qualification before you invest time in the formal application process.",
  },
  {
    q: "How do I deal with IRS notices I have received in Texas?",
    a: "Do not ignore IRS notices. Each notice has a specific response deadline, and missing it can result in additional penalties and enforcement actions. Read the notice carefully, note the deadline, and contact a tax relief specialist promptly. The type of notice determines the urgency and the appropriate response.",
  },
];

const RELATED = [
  { href: "/tax-relief/florida", label: "Florida" },
  { href: "/tax-relief/california", label: "California" },
  { href: "/tax-relief/new-york", label: "New York" },
  { href: "/tax-relief/pennsylvania", label: "Pennsylvania" },
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
              { name: "Texas", path: CANONICAL },
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
            Tax Relief in <span className="italic text-primary">Texas</span>
          </>
        }
        lede="Texas has no state income tax — but IRS federal tax debt is a significant and growing problem for the state's enormous self-employed and 1099 workforce in energy, construction, trucking, and agriculture. If you have received an IRS notice, have unfiled returns, or owe back taxes, federal tax relief programs are available to qualifying Texas residents."
        bullets={[
          "No state income tax — only federal IRS obligations for most Texas residents",
          "IRS Offer in Compromise — potentially settle for less than you owe",
          "IRS payment plans tailored to your income and expenses",
          "Wage levy and bank levy release for qualifying hardship cases",
          "Free, confidential consultation — no obligation to enroll",
        ]}
        faqs={FAQS}
        relatedStatePages={RELATED}
        content={
          <>
            <h2>IRS Tax Debt in Texas: The Self-Employment Factor</h2>
            <p>
              Texas's no-income-tax status is a genuine financial benefit — but
              it creates a blind spot. Many Texas residents, particularly those
              transitioning to self-employment for the first time, underestimate
              or entirely overlook their federal tax obligations. Without a
              state return to complete, the habit of annual tax compliance that
              state tax requirements build in other states is absent for many
              Texans.
            </p>
            <p>{S.taxRelief.commonIssue}</p>
            <p>{S.taxRelief.selfEmployedContext}</p>
            <p>
              The IRS has field offices in {S.taxRelief.irsOfficeCities} to
              serve Texas residents. These offices handle walk-in taxpayer
              assistance, though appointment requirements have increased in
              recent years.
            </p>
            <h2>Texas Property Taxes and IRS Obligations</h2>
            <p>{S.taxRelief.propertyTaxNote}</p>
            <p>
              Property tax debt in Texas is a separate matter from IRS federal
              tax debt and is handled through county taxing authorities and, for
              delinquent property taxes, specialized property tax lenders. IRS
              relief programs do not address Texas property tax delinquency.
            </p>
            <h2>Texas Business Tax Issues</h2>
            <p>{S.taxRelief.localTaxContext}</p>
            <p>
              Business owners in Texas facing IRS issues need to be aware of
              these simultaneous state obligations. Resolving IRS debt does not
              resolve Texas Comptroller obligations, and vice versa.
            </p>
            <h2>IRS Relief Programs Available to Texas Residents</h2>
            <p>
              <strong>Offer in Compromise (OIC):</strong> Allows qualifying
              taxpayers to settle federal tax debt for less than the full
              amount. Eligibility depends on income, expenses, assets, and
              ability to pay. The IRS evaluates each case under strict
              guidelines. Not every taxpayer qualifies, but those who do can
              achieve significant resolution at a fraction of the total debt.
            </p>
            <p>
              <strong>Installment Agreements:</strong> Monthly payment plans
              structured around what you can realistically afford. The IRS Fresh
              Start program has expanded eligibility for streamlined installment
              agreements for balances up to $50,000. Larger balances require
              more documentation.
            </p>
            <p>
              <strong>Currently Not Collectible (CNC) Status:</strong> For
              taxpayers experiencing genuine financial hardship, the IRS can
              temporarily halt all collection activity. Interest continues to
              accrue, but levies and garnishments are paused until your
              financial situation improves.
            </p>
            <p>
              <strong>Penalty Abatement:</strong> First-time penalty abatement
              is available to taxpayers with a clean compliance history.
              Reasonable cause abatement may apply to circumstances beyond your
              control. Penalties can be a substantial portion of total IRS debt
              — removing them can significantly reduce the balance.
            </p>
            <h2>When to Get Help</h2>
            <p>
              If you have received an IRS notice, the most important thing you
              can do is respond before the deadline stated on the notice. A tax
              relief specialist who represents clients before the IRS can often
              intervene before enforcement actions — wage levies, bank levies,
              liens — escalate. A free consultation is the fastest way to
              understand your options and the timeline for addressing your
              specific IRS situation.
            </p>
          </>
        }
      />
    </>
  );
}
