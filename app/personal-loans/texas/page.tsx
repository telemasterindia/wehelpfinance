import { DEFAULT_OG_IMAGE, DEFAULT_TWITTER_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import { StateServicePage } from "@/components/StateServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { STATES } from "@/lib/stateData";

const S = STATES.texas;
const CANONICAL = "https://www.wehelpfinance.com/personal-loans/texas";

export const metadata: Metadata = {
  title:
    "Personal Loans in Texas — Find the Right Loan for TX Residents | WeHelpFinance",
  description:
    "Texas has a large and competitive personal loan market — but also some of the most predatory payday lenders in the country. Learn how to access the right loan for your situation. Free consultation.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Personal Loans in Texas | WeHelpFinance",
    description:
      "Texas personal loan guide — credit unions, banks, debt consolidation loans, and what to avoid. Free consultation.",
    url: CANONICAL,
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Loans in Texas | WeHelpFinance",
    description:
      "Personal loan options for Texas residents. Free consultation.",
    images: [DEFAULT_TWITTER_IMAGE],
  },
};

const FAQS = [
  {
    q: "What is the best way to get a personal loan in Texas?",
    a: "For most Texas residents, credit unions offer the most competitive personal loan rates. Major Texas credit unions — Randolph-Brooks Federal Credit Union, UFCU, Amplify, and others — often beat bank and online lender rates for members. Online lenders are a competitive alternative. Avoid payday and title lenders, which can carry effective APRs above 600% in Texas.",
  },
  {
    q: "Can I get a personal loan in Texas with bad credit?",
    a: "Yes, though your options and rates vary. Credit unions sometimes offer credit-builder loans or smaller personal loans for members with poor credit. Online lenders specializing in fair-to-bad credit also operate in Texas. Rates will be higher than for good-credit borrowers. If your goal is debt consolidation, verify that the personal loan rate is meaningfully lower than your current credit card APRs.",
  },
  {
    q: "Are payday loans legal in Texas?",
    a: "Yes, and Texas has some of the weakest payday loan regulations in the country. Payday and auto-title lenders operate as Credit Access Businesses at extremely high effective APRs — often above 400–600%. These products should be avoided for debt consolidation purposes. Traditional personal loans from banks, credit unions, or reputable online lenders are the appropriate alternative.",
  },
  {
    q: "How much can I borrow with a personal loan in Texas?",
    a: "Personal loan amounts from mainstream lenders typically range from $1,000 to $100,000, depending on your creditworthiness, income, and debt-to-income ratio. For debt consolidation, most borrowers seek loans in the $5,000–$30,000 range.",
  },
  {
    q: "Will a personal loan hurt my credit score in Texas?",
    a: "Applying causes a hard inquiry that may temporarily lower your score by a few points. If approved and you use the funds to pay off credit card balances, your credit utilization decreases — which typically improves your score. Consistent on-time loan payments further improve credit over time.",
  },
  {
    q: "Can I use a personal loan to consolidate debt in Texas?",
    a: "Yes. Using a personal loan to pay off multiple high-interest credit cards is one of the most effective debt consolidation strategies for Texans with fair to good credit. The key is that the personal loan rate must be meaningfully lower than your current credit card APRs to produce real savings.",
  },
];

const RELATED = [
  { href: "/personal-loans/florida", label: "Florida" },
  { href: "/personal-loans/california", label: "California" },
  { href: "/personal-loans/new-york", label: "New York" },
  { href: "/personal-loans/pennsylvania", label: "Pennsylvania" },
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
                name: "Personal Loans",
                path: "https://www.wehelpfinance.com/personal-loans",
              },
              { name: "Texas", path: CANONICAL },
            ]),
          ),
        }}
      />
      <StateServicePage
        stateName={S.name}
        stateAbbr={S.abbreviation}
        vertical="personal-loans"
        category="personal-loan"
        eyebrow="Personal Loans"
        author="WeHelpFinance Financial Education Team"
        title={
          <>
            Personal Loans in <span className="italic text-primary">Texas</span>
          </>
        }
        lede="Texas has a large and competitive personal lending market across Dallas, Houston, Austin, and San Antonio — but also some of the most predatory payday and title loan products in the country. Knowing where to look for legitimate personal loans and what to avoid can make a significant difference in your borrowing cost."
        bullets={[
          "Competitive personal loan market with strong credit union options statewide",
          "No state income tax — lenders focus on employment income and debt-to-income",
          "Avoid payday and auto-title lenders operating at 400–600%+ effective APRs",
          "Debt consolidation loans available for multiple credit profiles",
          "Free, no-obligation consultation to explore your options",
        ]}
        faqs={FAQS}
        relatedStatePages={RELATED}
        content={
          <>
            <h2>Texas Personal Loan Market Overview</h2>
            <p>
              Texas has one of the largest and most active personal lending
              markets in the country, reflecting both the state's large
              population and its diverse economy. Average household income in
              Texas is approximately {S.personalLoans.avgHouseholdIncome}, with
              significant variation between tech and energy industry workers
              (earning well above average) and service and hospitality workers
              (often below average in high-cost markets like Austin).
            </p>
            <p>{S.personalLoans.localEconomy}</p>
            <p>{S.personalLoans.lendingContext}</p>

            <h2>Personal Loans for Debt Consolidation in Texas</h2>
            <p>
              The most common use of personal loans in Texas — and the context
              in which they make the most financial sense — is consolidating
              high-interest credit card debt. The math is straightforward: if
              you carry $15,000 across three credit cards at an average 22% APR
              and can consolidate into a personal loan at 12%, you save
              approximately $1,500 per year in interest while also gaining a
              fixed payoff date.
            </p>
            <p>
              Texas credit unions deserve particular attention for this purpose.
              Credit unions are member-owned and typically offer lower rates
              than banks or online lenders for members with qualifying profiles.
              Major Texas credit unions include:
            </p>
            <ul>
              <li>
                Randolph-Brooks Federal Credit Union (San Antonio, Austin)
              </li>
              <li>University Federal Credit Union (Austin)</li>
              <li>Amplify Credit Union (Austin)</li>
              <li>Houston Federal Credit Union (Houston metro)</li>
              <li>
                Southwest Airlines Federal Credit Union (Dallas–Fort Worth)
              </li>
            </ul>
            <p>
              If you are not currently a credit union member, many Texas credit
              unions have broad membership eligibility based on geography or
              employer — worth checking before defaulting to a bank or online
              lender.
            </p>

            <h2>What to Avoid: Texas's Payday Lending Problem</h2>
            <p>{S.personalLoans.usuryCap}</p>
            <p>{S.personalLoans.paydayNote}</p>
            <p>
              Texas's Credit Access Business framework allows payday and
              auto-title lenders to charge fees structured as "arrangement fees"
              rather than interest, effectively circumventing state usury
              limits. A $500 payday loan in Texas can cost $125 in fees for a
              two-week loan — an APR of approximately 650%. Borrowers who cannot
              repay in full roll the loan over, compounding fees rapidly.
            </p>
            <p>
              For debt consolidation purposes, these products make the situation
              significantly worse, not better. If you need a personal loan and
              your credit is poor, a credit-builder loan from a credit union or
              a secured personal loan is a better path than a payday or title
              product.
            </p>

            <h2>When a Personal Loan Is Not the Right Tool</h2>
            <p>{S.personalLoans.keyConsideration}</p>
            <p>
              If you cannot qualify for a personal loan at a rate meaningfully
              below your credit card APRs, or if your income genuinely cannot
              support the consolidated monthly payment, a personal loan for debt
              consolidation will not solve the underlying problem. In that
              situation, a debt management plan or debt settlement program may
              be more appropriate options to explore.
            </p>
            <p>
              A free consultation with a specialist can help you assess which
              approach — personal loan, debt management plan, or debt relief
              program — is the right fit for your Texas situation.
            </p>
          </>
        }
      />
    </>
  );
}
