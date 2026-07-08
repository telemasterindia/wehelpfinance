import type { Metadata } from "next";
import { CityServicePage } from "@/components/CityServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { CITIES } from "@/lib/cityData";

const C = CITIES["fort-worth"];
const CANONICAL = "https://www.wehelpfinance.com/debt-settlement/fort-worth";

export const metadata: Metadata = {
  title: "Debt Settlement in Fort Worth, TX - Free Consultation | WeHelpFinance",
  description:
    "Fort Worth's manufacturing and aviation workforce benefits from Texas's no-wage-garnishment and unlimited homestead protections. Explore debt settlement options - free, confidential consultation.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Debt Settlement in Fort Worth | WeHelpFinance",
    description:
      "Texas prohibits wage garnishment for consumer debt. See how debt settlement works for Fort Worth residents - free consultation.",
    url: CANONICAL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Settlement in Fort Worth | WeHelpFinance",
    description:
      "Debt settlement for Fort Worth residents. Texas's strongest-in-the-nation consumer protections. Free consultation.",
  },
};

const FAQS = [
  {
    q: "Is Fort Worth's debt situation different from Dallas, even though they share a metro?",
    a: "Yes. Fort Worth's economy leans more heavily on manufacturing, aviation, and shift-based hourly work than Dallas's white-collar corporate and financial-services base. Fort Worth households are more likely to carry debt tied to variable hourly income and gaps in employer-sponsored benefits, even though both cities share the same overall DFW cost-of-living pressures.",
  },
  {
    q: "Does Texas allow wage garnishment for credit card debt in Fort Worth?",
    a: "No. Texas prohibits wage garnishment for consumer debt statewide, including in Fort Worth and Tarrant County. Creditors who win a court judgment can still pursue bank account levies, but your paycheck itself is protected - a meaningful protection for Fort Worth's larger share of hourly and shift-based workers.",
  },
  {
    q: "How do rising Tarrant County property taxes affect debt settlement decisions?",
    a: "Property tax increases across Tarrant County have added pressure even for Fort Worth homeowners with paid-off or low-balance mortgages, sometimes pushing households into credit card debt to cover routine expenses. A debt settlement specialist should account for a household's current property tax burden when assessing whether a settlement program is sustainable.",
  },
  {
    q: "What is the statute of limitations on credit card debt in Fort Worth?",
    a: "Texas has a 4-year statute of limitations on written contracts, which covers most credit card debt. After 4 years from the date of last payment or default, a creditor generally cannot successfully sue to collect in Texas court. Making any payment on an old debt can restart this clock, so Fort Worth residents with older accounts should verify the last payment date before contacting a collector.",
  },
  {
    q: "Does military and aviation employment near Fort Worth affect debt relief options?",
    a: "Fort Worth's large aviation and aerospace manufacturing workforce, including Lockheed Martin's F-35 production facility, means many residents have stable but hourly or shift-differential-based pay. This can make income verification for debt relief programs slightly different than for salaried workers, but does not change eligibility for debt settlement, which is based on total unsecured debt and hardship, not job type.",
  },
];

export default function FortWorthPage() {
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
              { name: "Fort Worth", path: CANONICAL },
            ]),
          ),
        }}
      />
      <CityServicePage
        city={C}
        faqs={FAQS}
        stateSOL={4}
        stateWageNote="Texas prohibits wage garnishment entirely for consumer debt - credit cards, medical bills, and personal loans cannot result in paycheck garnishment. This protection is especially significant for Fort Worth's larger share of hourly and shift-based manufacturing and aviation workers. Exceptions apply to tax debt, child support, and federal student loans."
        stateHomesteadNote="Texas offers an unlimited homestead exemption - your primary residence is generally protected from forced sale to satisfy unsecured creditor judgments regardless of its value. This applies fully to Fort Worth and Tarrant County homeowners."
      />
    </>
  );
}
