import type { Metadata } from "next";
import { StateServicePage } from "@/components/StateServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { STATES } from "@/lib/stateData";

const S = STATES.florida;
const CANONICAL = "https://www.wehelpfinance.com/tax-relief/florida";

export const metadata: Metadata = {
  title: "Tax Relief in Florida — IRS Debt Help for FL Residents | WeHelpFinance",
  description: "Florida has no state income tax, but IRS federal tax debt is common among self-employed workers in construction, real estate, and tourism. Explore tax relief options for Florida residents.",
  alternates: { canonical: CANONICAL },
  openGraph: { title: "Tax Relief in Florida | WeHelpFinance", description: "IRS tax debt is common among Florida's self-employed workforce. Free tax relief consultation for FL residents.", url: CANONICAL, type: "website" },
  twitter: { card: "summary_large_image", title: "Tax Relief in Florida | WeHelpFinance", description: "IRS tax relief options for Florida residents. Free consultation." },
};

const FAQS = [
  { q: "Does Florida have a state income tax?", a: "No. Florida has no state income tax. Florida residents only owe federal income tax to the IRS. Florida does have a corporate income tax (5.5% for C-corps), sales tax, and property taxes. Most individual residents deal only with federal IRS obligations, not a state income tax agency." },
  { q: "Why do so many Florida self-employed workers have IRS problems?", a: "Florida's large self-employed workforce — in construction, real estate, tourism services, and small business — faces self-employment tax obligations without the payroll withholding that keeps W-2 employees current. Many first-year and early self-employed Floridians underestimate quarterly estimated tax payments and accumulate IRS debt before realizing the full scope of their federal obligations." },
  { q: "Can the IRS garnish wages in Florida despite the head-of-household exemption?", a: "Yes. The IRS has federal authority to issue wage levies that supersede Florida's state-level wage garnishment protections. Florida's head-of-household exemption does not apply to IRS tax levies. The IRS typically follows an extended notice process before levying, giving taxpayers time to seek resolution through installment agreements or other programs." },
  { q: "What IRS relief programs are available to Florida residents?", a: "Florida residents have access to all federal IRS relief programs: Offer in Compromise, Installment Agreements, Currently Not Collectible status, penalty and interest abatement, and Innocent Spouse Relief. A tax relief specialist can assess which programs you qualify for based on your income, assets, and tax debt." },
  { q: "How does the Florida real estate cycle affect IRS tax debt?", a: "Florida's real estate market cycles create tax timing problems. During boom periods, real estate professionals and contractors earn high incomes without withholding. When the market corrects, income drops — but tax debt from prior high-earning years remains. Many Florida real estate and construction professionals end up with substantial IRS obligations from years when they earned well but did not set aside enough for taxes." },
  { q: "What should I do if I have both IRS debt and Florida sales tax issues?", a: "These are separate agencies requiring separate resolution. The IRS handles federal income and payroll tax; the Florida Department of Revenue handles sales tax compliance. A tax relief specialist can help coordinate resolution of both obligations, as the payment priorities and resolution processes differ between the two agencies." },
];

const RELATED = [
  { href: "/tax-relief/texas", label: "Texas" },
  { href: "/tax-relief/california", label: "California" },
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
        { name: "Florida", path: CANONICAL },
      ])) }} />
      <StateServicePage
        stateName={S.name} stateAbbr={S.abbreviation} vertical="tax-relief" category="tax-relief"
        eyebrow="Tax Relief" author="WeHelpFinance Research Team"
        title={<>Tax Relief in <span className="italic text-primary">Florida</span></>}
        lede="Florida has no state income tax — but IRS federal tax debt is a persistent problem for the state's enormous self-employed workforce in construction, real estate, tourism services, and small business. Florida's real estate cycles and seasonal income patterns create recurring tax timing problems that can compound into significant IRS obligations."
        bullets={[
          "No state income tax — only federal IRS obligations for most Florida residents",
          "IRS Offer in Compromise — potentially settle for less than the full balance",
          "Installment Agreements structured around your actual income",
          "Help with unfiled returns from prior years",
          "Free, confidential consultation — no obligation to enroll",
        ]}
        faqs={FAQS}
        relatedStatePages={RELATED}
        content={<>
          <h2>IRS Tax Debt in Florida: The Self-Employment Pattern</h2>
          <p>Florida's economy creates a tax problem that plays out in a predictable pattern. A contractor, real estate agent, or hospitality business owner earns substantial income during a good year or a peak season. Without payroll withholding automatically setting aside tax obligations, those funds often get spent. When the tax bill arrives — or when the IRS eventually notices unfiled returns — the debt can be years in the making and far larger than the taxpayer anticipated.</p>
          <p>{S.taxRelief.commonIssue}</p>
          <p>{S.taxRelief.selfEmployedContext}</p>
          <p>The IRS has offices in {S.taxRelief.irsOfficeCities} serving Florida residents. For taxpayers dealing with active collection — notices, levies, liens — the fastest path to resolution involves working with a qualified tax relief specialist who can represent you before the IRS directly.</p>

          <h2>Florida's Real Estate Cycle and IRS Debt</h2>
          <p>Florida's real estate market has experienced dramatic cycles — the 2004–2007 boom, the 2008–2012 collapse, the 2012–2022 recovery, and subsequent corrections. Each of these cycles has generated IRS debt for a specific population: real estate professionals and construction contractors who earned high incomes during boom periods without adequate tax planning, then faced income drops that made it impossible to pay prior-year tax obligations.</p>
          <p>The pattern is particularly damaging because the IRS assesses tax based on the year income was earned — not the year you are able to pay. A real estate agent who earned $200,000 in 2021 but only $70,000 in 2022 owes taxes based on the 2021 income, even if that income is long gone. Penalties and interest on unpaid 2021 taxes accumulate through 2022 and beyond, compounding the problem.</p>

          <h2>Florida Sales Tax and IRS: Dual-Agency Issues</h2>
          <p>{S.taxRelief.localTaxContext}</p>
          <p>Florida business owners facing IRS problems often discover simultaneously that Florida Department of Revenue sales tax compliance has also lapsed. These are separate problems requiring separate solutions — IRS Installment Agreements do not cover Florida sales tax, and Florida DOR payment plans do not address federal obligations.</p>

          <h2>IRS Relief Programs for Florida Residents</h2>
          <p><strong>Offer in Compromise:</strong> For qualifying Florida taxpayers, the OIC program allows settling federal tax debt for less than the full amount. The IRS evaluates income, expenses, assets, and reasonable collection potential. Florida's homestead exemption affects the asset calculation — your primary residence's full market value is included in the IRS's asset analysis even though creditors cannot force its sale.</p>
          <p><strong>Installment Agreements:</strong> Monthly payment plans allow Florida taxpayers to resolve IRS debt over time. Streamlined plans are available for balances up to $50,000. Larger balances require a Collection Information Statement (Form 433-A) that documents income, expenses, and assets in detail.</p>
          <p><strong>Currently Not Collectible:</strong> For Florida taxpayers in genuine financial hardship — including seasonal workers during off-season periods — CNC status temporarily halts all IRS collection activity. Interest continues to accrue, but levies, garnishments, and active collection stop until your financial situation improves.</p>
          <p>A free consultation with a vetted tax relief specialist is the fastest way to understand which programs you qualify for and what realistic resolution looks like for your specific Florida situation.</p>
        </>}
      />
    </>
  );
}

