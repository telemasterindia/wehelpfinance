import { DEFAULT_OG_IMAGE, DEFAULT_TWITTER_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import { CityServicePage } from "@/components/CityServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { CITIES } from "@/lib/cityData";

const C = CITIES["charlotte"];
const CANONICAL = "https://www.wehelpfinance.com/debt-settlement/charlotte";

export const metadata: Metadata = {
  title: "Debt Settlement in Charlotte, NC — Free Consultation | WeHelpFinance",
  description:
    "Charlotte is the banking capital of the Southeast. North Carolina prohibits wage garnishment for consumer debt and has a 3-year statute of limitations. Free consultation.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Debt Settlement in Charlotte | WeHelpFinance",
    description:
      "NC prohibits wage garnishment for consumer debt. Charlotte debt settlement options — free consultation.",
    url: CANONICAL,
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Settlement in Charlotte | WeHelpFinance",
    description: "Charlotte debt settlement options. Free consultation.",
    images: [DEFAULT_TWITTER_IMAGE],
  },
};

const FAQS = [
  {
    q: "Can creditors garnish my wages in Charlotte, North Carolina?",
    a: "No — for most consumer debt. North Carolina does not allow wage garnishment for credit cards, medical bills, or personal loans. This puts North Carolina alongside Texas and Pennsylvania as one of the few states with this strong consumer protection. Exceptions apply to tax debt, student loans, and child support.",
  },
  {
    q: "What is the statute of limitations on credit card debt in North Carolina?",
    a: "North Carolina has a 3-year statute of limitations on credit card debt — one of the shortest in the country, alongside New York. After 3 years from the date of last payment or default, creditors cannot successfully sue. Charlotte residents with older collection accounts should verify dates carefully before making any payment or acknowledgment.",
  },
  {
    q: "Why is Charlotte such a significant debt settlement market?",
    a: "Charlotte is home to Bank of America headquarters and is a major Wells Fargo operations center, making residents unusually familiar with financial products and credit. This financial literacy means Charlotte consumers tend to understand and seriously evaluate debt settlement options more readily than many other markets. At the same time, rapid housing cost growth has created debt stress across income levels.",
  },
  {
    q: "Is there military base screening needed for Charlotte area debt settlement?",
    a: "Yes. Fort Liberty (formerly Fort Bragg) is located approximately 75 miles from Charlotte in Fayetteville, NC. While not in the immediate Charlotte metro, the broader area has military-connected residents. Active duty service members are protected under the SCRA — always screen for active duty status before enrolling any consumer in a debt settlement program.",
  },
  {
    q: "How does North Carolina license debt settlement companies?",
    a: "North Carolina requires licensing under the NC Debt Settlement Act. One-party consent applies for call recording. Always verify that any company you work with holds a current North Carolina debt settlement license before enrolling accounts.",
  },
  {
    q: "What areas in the Charlotte metro have the highest debt settlement demand?",
    a: "Based on demographic and debt settlement data, the highest demand areas in the Charlotte metro are South Charlotte and East Charlotte working-class communities, Gastonia and Kannapolis in Gaston County, Concord and Kannapolis in Cabarrus County, and Rock Hill across the South Carolina border (which requires South Carolina licensing). Huntersville and Mooresville in Lake Norman area also show significant volume.",
  },
];

export default function CharlottePage() {
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
                name: "Debt Settlement",
                path: "https://www.wehelpfinance.com/debt-settlement",
              },
              { name: "Charlotte", path: CANONICAL },
            ]),
          ),
        }}
      />
      <CityServicePage
        city={C}
        faqs={FAQS}
        stateSOL={3}
        stateWageNote="North Carolina does NOT allow wage garnishment for consumer debt — credit cards, medical bills, and personal loans cannot result in paycheck garnishment. This is one of the strongest consumer protections in the country, alongside Texas and Pennsylvania. Exceptions apply to tax debt, student loans, and child support."
        stateHomesteadNote="North Carolina's homestead exemption is $35,000 for individuals or $60,000 for married couples aged 65+ who own the home as tenants by the entirety. This provides moderate protection for Charlotte homeowners compared to states like Texas and Florida."
      />
    </>
  );
}
