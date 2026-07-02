import { DEFAULT_OG_IMAGE, DEFAULT_TWITTER_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import { StateServicePage } from "@/components/StateServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { STATES } from "@/lib/stateData";

const S = STATES.florida;
const CANONICAL = "https://www.wehelpfinance.com/debt-relief/florida";

export const metadata: Metadata = {
  title:
    "Debt Relief in Florida — Free Consultation for FL Residents | WeHelpFinance",
  description:
    "Florida has some of the highest credit card delinquency rates in the US — and powerful consumer protections including an unlimited homestead exemption. Explore debt relief options for Florida residents.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Debt Relief in Florida | WeHelpFinance",
    description:
      "Florida's unlimited homestead exemption and head-of-household wage protection are critical to understand before addressing debt. Free consultation.",
    url: CANONICAL,
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Relief in Florida | WeHelpFinance",
    description:
      "Explore debt relief options for Florida residents. Free, confidential consultation.",
    images: [DEFAULT_TWITTER_IMAGE],
  },
};

const FAQS = [
  {
    q: "Can creditors garnish my wages in Florida?",
    a: "Florida allows wage garnishment, but with a critical exception: if you are the head of household — the primary financial support for a family member — your wages may be fully exempt. This exemption must be claimed in writing within 20 days of being served. For individuals without dependents, the federal 25% of disposable income limit applies.",
  },
  {
    q: "How long do creditors have to sue me in Florida?",
    a: "Florida has a 5-year statute of limitations on credit card debt and written contracts. After 5 years from your last payment or default date, creditors cannot successfully sue you to collect the debt.",
  },
  {
    q: "Does Florida protect my home from creditors?",
    a: "Yes. Florida has one of the most powerful homestead exemptions in the country — your primary residence is fully protected from most creditor claims regardless of value, similar to Texas. Even a creditor with a judgment cannot force the sale of your Florida homestead.",
  },
  {
    q: "Why does Florida have high credit card delinquency?",
    a: "Florida's tourism-dependent economy creates seasonal income patterns for many workers — strong during peak months, reduced during off-season. The large retiree population faces fixed-income pressure. And rapidly rising housing costs have squeezed working households. These factors combine to create above-average delinquency rates.",
  },
  {
    q: "Can I settle debt if I am a seasonal worker in Florida?",
    a: "Yes. Debt settlement programs work for seasonal workers — the monthly deposit into the settlement savings account can be adjusted to seasonal income. A specialist can help structure a program that accounts for income variability.",
  },
  {
    q: "What happens to my credit score after debt settlement in Florida?",
    a: "The credit impact is the same in all states. Accounts become delinquent during the settlement program, damaging your score. Settled accounts remain on your report as 'settled for less than full amount' for 7 years from the original delinquency date.",
  },
];

const RELATED = [
  { href: "/debt-relief/texas", label: "Texas" },
  { href: "/debt-relief/california", label: "California" },
  { href: "/debt-relief/new-york", label: "New York" },
  { href: "/debt-relief/pennsylvania", label: "Pennsylvania" },
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
                name: "Debt Relief",
                path: "https://www.wehelpfinance.com/debt-relief",
              },
              { name: "Florida", path: CANONICAL },
            ]),
          ),
        }}
      />
      <StateServicePage
        stateName={S.name}
        stateAbbr={S.abbreviation}
        vertical="debt-relief"
        category="debt-relief"
        eyebrow="Debt Relief"
        author="WeHelpFinance Financial Education Team"
        title={
          <>
            Debt Relief in <span className="italic text-primary">Florida</span>
          </>
        }
        lede="Florida consistently ranks among the states with the highest rates of credit card delinquency — driven by seasonal employment, a large retiree population on fixed incomes, and rapidly rising housing costs. Florida also provides powerful protections that every resident should understand before dealing with debt collectors."
        bullets={[
          "Unlimited homestead exemption — your primary residence is fully protected from creditor claims",
          "Head-of-household wage garnishment exemption for qualifying Florida residents",
          "5-year statute of limitations on credit card debt",
          "Programs for $7,500+ in unsecured debt",
          "Free, confidential consultation — no obligation",
        ]}
        faqs={FAQS}
        relatedStatePages={RELATED}
        content={
          <>
            <h2>Florida's Debt Reality</h2>
            <p>
              Florida consistently ranks in the top 10 states for personal
              bankruptcy filings and carries one of the highest rates of credit
              card delinquency in the country. Average credit card debt for
              Florida residents is approximately{" "}
              {S.debtRelief.avgCreditCardDebt}. Understanding why is essential
              for understanding what to do about it.
            </p>
            <p>{S.debtRelief.delinquencyContext}</p>
            <p>{S.debtRelief.localContext}</p>

            <h2>Florida Consumer Protections for Debt</h2>
            <h3>Head-of-Household Wage Exemption</h3>
            <p>{S.debtRelief.wageGarnishmentNote}</p>
            <p>
              This protection is underused because many Florida residents do not
              know to claim it. If you are served with a writ of garnishment and
              you are the head of your household, you have 20 days to file a
              written claim of exemption with the court. If properly claimed and
              you qualify, your wages are fully protected — even after a
              creditor has obtained a judgment. Missing that 20-day window can
              forfeit this right.
            </p>

            <h3>Unlimited Homestead Exemption</h3>
            <p>{S.debtRelief.homesteadExemption}</p>
            <p>
              For Florida homeowners, this means that credit card judgments,
              medical bill judgments, and personal loan judgments — regardless
              of size — generally cannot lead to forced sale of your primary
              residence. This is among the most powerful homeowner protections
              in the country.
            </p>

            <h3>5-Year Statute of Limitations</h3>
            <p>
              Florida gives creditors {S.debtRelief.statuteOfLimitationsCC}{" "}
              years from the date of last payment or default to file suit on
              credit card debt. For Floridians dealing with older accounts,
              checking the date of last activity before making any payment is
              important — a payment can restart the clock.
            </p>

            <h2>Debt Relief Options for Florida Residents</h2>
            <p>
              <strong>Debt settlement</strong> is appropriate for Florida
              residents with $7,500+ in unsecured debt who are in genuine
              financial hardship — particularly those in seasonal employment
              whose income cannot sustain minimum payments during slow periods.
              Settlement programs typically run 24–48 months and resolve
              accounts for 40–60 cents on the dollar.
            </p>
            <p>
              <strong>Debt consolidation</strong> via personal loan is a strong
              option for Floridians with fair to good credit. Miami, Tampa,
              Orlando, and Jacksonville all have competitive lending markets.
              Suncoast Credit Union, Space Coast Credit Union, and Achieva
              Credit Union are among Florida's larger credit unions with
              competitive personal loan rates.
            </p>
            <p>
              <strong>Debt management plans</strong> are appropriate for Florida
              residents who want to pay the full balance at better terms over
              3–5 years, particularly those in seasonal industries who benefit
              from the structured, accountable nature of a
              nonprofit-administered program.
            </p>

            <h2>South Florida's Unique Challenges</h2>
            <p>
              The Miami–Fort Lauderdale–West Palm Beach metro has cost of living
              pressures that rival New York City for many consumer categories —
              particularly housing and insurance — while wages for service,
              healthcare support, and hospitality workers often trail
              significantly behind. This gap is a primary driver of credit card
              dependency in South Florida's working-class and middle-income
              communities.
            </p>
            <p>
              For Floridians across all regions, the right approach to debt
              resolution depends on specific circumstances. A free consultation
              with a vetted specialist provides a clear picture of what options
              are genuinely available for your situation.
            </p>
          </>
        }
      />
    </>
  );
}
