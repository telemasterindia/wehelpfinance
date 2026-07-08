import type { Metadata } from "next";
import { CityServicePage } from "@/components/CityServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { CITIES } from "@/lib/cityData";

const C = CITIES["san-antonio"];
const CANONICAL = "https://www.wehelpfinance.com/debt-settlement/san-antonio";

export const metadata: Metadata = {
  title: "Debt Settlement in San Antonio, TX - Free Consultation | WeHelpFinance",
  description:
    "San Antonio residents benefit from Texas's no-wage-garnishment and unlimited homestead protections. Explore debt settlement options for San Antonio and Bexar County - free, confidential consultation.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Debt Settlement in San Antonio | WeHelpFinance",
    description:
      "Texas prohibits wage garnishment for consumer debt. See how debt settlement works for San Antonio residents - free consultation.",
    url: CANONICAL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Settlement in San Antonio | WeHelpFinance",
    description:
      "Debt settlement for San Antonio residents. Texas's strongest-in-the-nation consumer protections. Free consultation.",
  },
};

const FAQS = [
  {
    q: "Does Texas allow wage garnishment for credit card debt in San Antonio?",
    a: "No. Texas is one of a small number of states that prohibits wage garnishment for consumer debt such as credit cards, medical bills, and personal loans. This applies statewide, including San Antonio and Bexar County. Creditors who win a court judgment can still pursue bank account levies, but your paycheck itself is protected. Exceptions exist for tax debt, child support, and federal student loans.",
  },
  {
    q: "How does military service affect debt settlement for San Antonio residents?",
    a: "Active-duty service members and their families connected to Joint Base San Antonio have additional protections under the Servicemembers Civil Relief Act (SCRA), including interest rate caps on pre-service debt and protection from certain default judgments while deployed. San Antonio's large military population should ask any debt settlement company specifically about SCRA experience before enrolling.",
  },
  {
    q: "What is the statute of limitations on credit card debt in Texas?",
    a: "Texas has a 4-year statute of limitations on written contracts, which covers most credit card debt. After 4 years from the date of last payment or default, a creditor generally cannot successfully sue to collect in Texas court, although they may still attempt to collect informally. Making any payment on an old debt can restart this clock, so San Antonio residents with older accounts should verify the last payment date before contacting a collector.",
  },
  {
    q: "Is San Antonio's homestead exemption different from the rest of Texas?",
    a: "No - Texas's unlimited homestead exemption applies statewide, including San Antonio and all of Bexar County. Your primary residence, regardless of its value, is generally protected from forced sale to satisfy most unsecured creditor judgments. This is one of the strongest homestead protections in the United States.",
  },
  {
    q: "How much unsecured debt qualifies for a settlement program in San Antonio?",
    a: "Most reputable debt settlement programs require at least $7,500-$10,000 in unsecured debt (credit cards, medical bills, personal loans) to make program fees worthwhile relative to potential savings. Below that threshold, alternatives like a debt management plan or direct negotiation are often more cost-effective for San Antonio residents.",
  },
];

export default function SanAntonioPage() {
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
              { name: "San Antonio", path: CANONICAL },
            ]),
          ),
        }}
      />
      <CityServicePage
        city={C}
        faqs={FAQS}
        stateSOL={4}
        stateWageNote="Texas prohibits wage garnishment entirely for consumer debt - credit cards, medical bills, and personal loans cannot result in paycheck garnishment. This is one of the strongest consumer protections in the country. Exceptions apply to tax debt, child support, and federal student loans."
        stateHomesteadNote="Texas offers an unlimited homestead exemption - your primary residence is generally protected from forced sale to satisfy unsecured creditor judgments regardless of its value. Combined with the wage garnishment prohibition, this gives San Antonio homeowners exceptionally strong practical protection."
      />
    </>
  );
}
