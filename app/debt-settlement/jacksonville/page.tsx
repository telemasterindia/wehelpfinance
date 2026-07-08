import type { Metadata } from "next";
import { CityServicePage } from "@/components/CityServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { CITIES } from "@/lib/cityData";

const C = CITIES["jacksonville"];
const CANONICAL = "https://www.wehelpfinance.com/debt-settlement/jacksonville";

export const metadata: Metadata = {
  title: "Debt Settlement in Jacksonville, FL - Free Consultation | WeHelpFinance",
  description:
    "Jacksonville residents may qualify for Florida's head-of-household wage garnishment exemption and unlimited-value homestead protection. Free, confidential debt settlement consultation.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Debt Settlement in Jacksonville | WeHelpFinance",
    description:
      "Florida's head-of-household exemption can fully protect wages from garnishment. See how debt settlement works for Jacksonville residents.",
    url: CANONICAL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Settlement in Jacksonville | WeHelpFinance",
    description:
      "Debt settlement for Jacksonville residents. Florida's head-of-household and homestead protections explained. Free consultation.",
  },
};

const FAQS = [
  {
    q: "What is Florida's head-of-household exemption, and can Jacksonville residents use it?",
    a: "Florida law fully exempts wages from garnishment for anyone who provides more than half the financial support for a dependent and earns $750 or less per week in net income - a protection unavailable in most states. This applies statewide, including Jacksonville and Duval County. The exemption is not automatic; it must be formally claimed after a garnishment writ is served, typically within 20 days.",
  },
  {
    q: "How does rising homeowners' insurance in Florida affect debt settlement decisions?",
    a: "Florida's homeowners' insurance premiums have risen sharply in recent years, and that cost pressure is a real contributor to households falling behind on unsecured debt even without any change in income. A debt settlement specialist should factor in a Jacksonville household's current, insurance-inflated budget rather than an outdated cost-of-living assumption when structuring a program.",
  },
  {
    q: "Does Jacksonville's large military population get special debt protections?",
    a: "Active-duty service members connected to Naval Station Mayport and NAS Jacksonville are covered by the Servicemembers Civil Relief Act (SCRA), which caps interest rates on pre-service debt at 6% and provides protection from certain default judgments during deployment. Military families should confirm any debt settlement company has direct SCRA experience before enrolling.",
  },
  {
    q: "What is the statute of limitations on credit card debt in Florida?",
    a: "Florida has a 5-year statute of limitations on written contracts, which covers most credit card agreements. After 5 years from the date of default, a creditor generally cannot successfully sue to collect in Florida court, though a debt buyer that cannot produce a signed cardholder agreement may be limited to the shorter 4-year open-account rule. A payment or written acknowledgment can restart this clock.",
  },
  {
    q: "Is Jacksonville's homestead protection different from South Florida cities?",
    a: "The dollar-value protection is the same statewide - Florida's homestead exemption protects a primary residence's value without a cap, regardless of the home's worth. What varies is the acreage limit: up to one-half acre within Jacksonville's incorporated city limits, or up to 160 acres for property in unincorporated Duval County.",
  },
];

export default function JacksonvillePage() {
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
              { name: "Jacksonville", path: CANONICAL },
            ]),
          ),
        }}
      />
      <CityServicePage
        city={C}
        faqs={FAQS}
        stateSOL={5}
        stateWageNote="Florida follows the federal wage garnishment cap of 25% of disposable earnings, but offers a powerful additional protection: the head-of-household exemption. Anyone who provides more than half the support for a dependent and earns $750 or less per week in net income can claim a full exemption from wage garnishment, with no dollar limit if properly claimed."
        stateHomesteadNote="Florida's homestead exemption protects a primary residence's value with no dollar cap, subject to acreage limits - one-half acre within Jacksonville's city limits, or up to 160 acres in unincorporated Duval County. This is one of the strongest homestead protections in the United States."
      />
    </>
  );
}
