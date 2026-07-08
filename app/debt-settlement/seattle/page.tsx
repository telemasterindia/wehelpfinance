import type { Metadata } from "next";
import { CityServicePage } from "@/components/CityServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { CITIES } from "@/lib/cityData";

const C = CITIES["seattle"];
const CANONICAL = "https://www.wehelpfinance.com/debt-settlement/seattle";

export const metadata: Metadata = {
  title: "Debt Settlement in Seattle, WA - Free Consultation | WeHelpFinance",
  description:
    "Seattle's high cost of living drives credit card debt even among employed households. See how Washington's above-average wage garnishment and homestead protections apply - free, confidential consultation.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Debt Settlement in Seattle | WeHelpFinance",
    description:
      "Washington protects more of your paycheck than the federal standard. See how debt settlement works for Seattle residents - free consultation.",
    url: CANONICAL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Settlement in Seattle | WeHelpFinance",
    description:
      "Debt settlement for Seattle residents. Washington's wage garnishment and homestead protections explained. Free consultation.",
  },
};

const FAQS = [
  {
    q: "Why do Seattle households carry high debt despite the tech industry's high salaries?",
    a: "Seattle's tech salaries are concentrated in a relatively narrow slice of the workforce. Retail, hospitality, healthcare support, and other service-sector workers - a large share of the metro's actual employment - face a housing cost burden that consumes most of their take-home pay, leaving credit cards to absorb ordinary living expenses. This wage gap, not discretionary spending, is the primary driver of debt for non-tech Seattle households.",
  },
  {
    q: "How much of my paycheck can creditors garnish in Seattle?",
    a: "Washington protects the greater of 75% of your disposable earnings or 35 times the federal minimum wage from garnishment - a stronger baseline than the plain federal 25% standard used in most states. This applies statewide, including Seattle and King County.",
  },
  {
    q: "How does Seattle's high home value affect the homestead exemption?",
    a: "Favorably. Washington's homestead exemption is the greater of $125,000 or the prior year's county median home sale price. Because King County's median home sale price has been well above $900,000 in recent years, most Seattle homeowners receive protection far above the state's statutory floor.",
  },
  {
    q: "What is the statute of limitations on credit card debt in Seattle?",
    a: "Washington has a 6-year statute of limitations on both written and open-account debt, which covers most credit card debt. After 6 years from the date of last payment or default, a creditor generally cannot successfully sue to collect in Washington court. Making a payment on an old account can restart this clock.",
  },
  {
    q: "Is debt settlement realistic for tech workers affected by layoffs in Seattle?",
    a: "Yes. Seattle's tech sector has experienced significant layoff cycles, and a sudden income drop after committing to Seattle-level housing costs is one of the most common paths into unsecured debt hardship here. Debt settlement is designed for exactly this kind of temporary but real hardship, and a specialist can assess whether settlement, consolidation, or another option fits a household's current, post-layoff budget.",
  },
];

export default function SeattlePage() {
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
              { name: "Seattle", path: CANONICAL },
            ]),
          ),
        }}
      />
      <CityServicePage
        city={C}
        faqs={FAQS}
        stateSOL={6}
        stateWageNote="Washington protects the greater of 75% of disposable earnings or 35 times the federal minimum wage from garnishment - a stronger baseline than the plain federal 25% cap used in most states. This applies statewide, including Seattle and King County."
        stateHomesteadNote="Washington's homestead exemption is the greater of $125,000 or the prior year's county median single-family home sale price. Given King County's high home values, most Seattle homeowners receive protection well above the statutory floor - often close to or above $900,000."
      />
    </>
  );
}
