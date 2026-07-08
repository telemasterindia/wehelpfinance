import type { Metadata } from "next";
import { CityServicePage } from "@/components/CityServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { CITIES } from "@/lib/cityData";

const C = CITIES["san-diego"];
const CANONICAL = "https://www.wehelpfinance.com/debt-settlement/san-diego";

export const metadata: Metadata = {
  title: "Debt Settlement in San Diego, CA - Free Consultation | WeHelpFinance",
  description:
    "San Diego's high cost of living drives unsecured debt even among employed households. See how California's wage garnishment cap and expanded homestead exemption apply - free, confidential consultation.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Debt Settlement in San Diego | WeHelpFinance",
    description:
      "California caps wage garnishment and offers an expanded homestead exemption. See how debt settlement works for San Diego residents - free consultation.",
    url: CANONICAL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Settlement in San Diego | WeHelpFinance",
    description:
      "Debt settlement for San Diego residents. California's wage garnishment cap and homestead protections explained. Free consultation.",
  },
};

const FAQS = [
  {
    q: "How much of my paycheck can creditors garnish in San Diego?",
    a: "California limits wage garnishment to the lesser of 25% of your disposable earnings, or the amount by which your disposable earnings exceed 40 times the state minimum wage per week. This applies uniformly across California, including San Diego. California's relatively high minimum wage means this cap offers stronger practical protection for lower-wage workers than the federal standard used in many other states.",
  },
  {
    q: "Does San Diego's high home value affect the homestead exemption?",
    a: "Yes, favorably. California's homestead exemption ranges from $300,000 to $600,000 depending on county median home sale prices, following a 2021 law change. San Diego County's high home values mean most San Diego homeowners qualify at or near the maximum $600,000 protection tier, shielding significant home equity from most unsecured creditor judgments.",
  },
  {
    q: "How does military service near San Diego affect debt settlement?",
    a: "San Diego is home to a large concentration of Navy and Marine Corps personnel connected to Naval Base San Diego and Camp Pendleton. Active-duty service members are covered by the Servicemembers Civil Relief Act (SCRA), which caps interest rates on pre-service debt at 6% and provides protection from certain default judgments during deployment. Military families should confirm any debt settlement company has direct SCRA experience.",
  },
  {
    q: "What is the statute of limitations on credit card debt in California?",
    a: "California has a 4-year statute of limitations on written contracts, which covers most credit card agreements. After 4 years from the date of default, a creditor generally cannot successfully sue in California court to collect, though attempts to collect informally may continue. A payment on an old debt can restart this clock, so verifying your last payment date is an important first step before engaging with a collector.",
  },
  {
    q: "Is debt settlement realistic in a high cost-of-living city like San Diego?",
    a: "Yes, though monthly settlement deposits need to be sized against San Diego's higher cost of living from the start. A qualified specialist will factor in local housing and expense levels when structuring a program, rather than applying a national average, to avoid a program that isn't sustainable for a San Diego household's actual budget.",
  },
];

export default function SanDiegoPage() {
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
              { name: "San Diego", path: CANONICAL },
            ]),
          ),
        }}
      />
      <CityServicePage
        city={C}
        faqs={FAQS}
        stateSOL={4}
        stateWageNote="California limits wage garnishment to 25% of disposable earnings or the amount by which disposable earnings exceed 40 times the state minimum wage per week, whichever is less. California's high minimum wage provides stronger protection for lower-wage workers than the federal standard."
        stateHomesteadNote="California's homestead exemption ranges from $300,000 to $600,000 depending on county median home prices, following a 2021 expansion. San Diego County's high home values mean most San Diego homeowners qualify at or near the maximum $600,000 exemption."
      />
    </>
  );
}
