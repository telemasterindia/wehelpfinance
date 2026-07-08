import type { Metadata } from "next";
import { CityServicePage } from "@/components/CityServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { CITIES } from "@/lib/cityData";

const C = CITIES["san-jose"];
const CANONICAL = "https://www.wehelpfinance.com/debt-settlement/san-jose";

export const metadata: Metadata = {
  title: "Debt Settlement in San Jose, CA - Free Consultation | WeHelpFinance",
  description:
    "Silicon Valley's cost of living drives unsecured debt even among employed households. See how California's consumer protections apply to San Jose residents - free, confidential consultation.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Debt Settlement in San Jose | WeHelpFinance",
    description:
      "California caps wage garnishment and offers an expanded homestead exemption. See how debt settlement works for San Jose residents - free consultation.",
    url: CANONICAL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Settlement in San Jose | WeHelpFinance",
    description:
      "Debt settlement for San Jose residents. California's wage garnishment cap and homestead protections explained. Free consultation.",
  },
};

const FAQS = [
  {
    q: "Why do San Jose households carry high debt despite Silicon Valley's high salaries?",
    a: "San Jose's tech salaries are concentrated in a relatively narrow slice of the workforce. Administrative, retail, hospitality, healthcare support, and gig-economy workers - a large share of the metro's actual employment - earn wages that lag far behind San Jose's cost of living, which is among the highest of any US metro. This gap is the primary driver of unsecured debt for non-tech San Jose households, not discretionary overspending.",
  },
  {
    q: "How much of my paycheck can creditors garnish in San Jose?",
    a: "California caps wage garnishment at the lesser of 25% of disposable earnings, or the amount by which disposable earnings exceed 40 times the state minimum wage per week. This is a statewide protection and applies fully in San Jose and Santa Clara County.",
  },
  {
    q: "Does San Jose's homestead exemption match San Diego and Los Angeles?",
    a: "Yes - California's 2021-expanded homestead exemption of $300,000 to $600,000, based on county median home sale prices, applies statewide. Given Santa Clara County's home values are consistently among the highest in California, most San Jose homeowners qualify for the maximum $600,000 protection tier.",
  },
  {
    q: "What is the statute of limitations on credit card debt in San Jose?",
    a: "California's 4-year statute of limitations on written contracts applies to most credit card debt in San Jose. After 4 years from the date of default, a creditor generally cannot successfully sue to collect in California court. Making a payment on an old account can restart this clock, so confirming the last payment date is an important step before responding to a collector.",
  },
  {
    q: "Is debt settlement a realistic option for tech workers who've had a layoff or pay cut?",
    a: "Yes. San Jose's tech sector has seen significant layoff cycles, and a sudden income drop after carrying high fixed costs (mortgage or rent sized to a prior salary) is one of the most common paths into unsecured debt hardship here. Debt settlement is designed for exactly this kind of temporary but real hardship, and a specialist can assess whether settlement, consolidation, or another option fits a household's current, post-layoff budget.",
  },
];

export default function SanJosePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "https://www.wehelpfinance.com/" },
              { name: "Debt Settlement", path: "https://www.wehelpfinance.com/debt-settlement" },
              { name: "San Jose", path: CANONICAL },
            ]),
          ),
        }}
      />
      <CityServicePage
        city={C}
        faqs={FAQS}
        stateSOL={4}
        stateWageNote="California limits wage garnishment to 25% of disposable earnings or the amount by which disposable earnings exceed 40 times the state minimum wage per week, whichever is less. California's high minimum wage provides stronger protection for lower-wage workers than the federal standard."
        stateHomesteadNote="California's homestead exemption ranges from $300,000 to $600,000 depending on county median home prices, following a 2021 expansion. Santa Clara County's high home values mean most San Jose homeowners qualify at or near the maximum $600,000 exemption."
      />
    </>
  );
}
