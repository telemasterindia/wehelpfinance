import { DEFAULT_OG_IMAGE, DEFAULT_TWITTER_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import { CityServicePage } from "@/components/CityServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { CITIES } from "@/lib/cityData";

const C = CITIES["chicago"];
const CANONICAL = "https://www.wehelpfinance.com/debt-settlement/chicago";

export const metadata: Metadata = {
  title: "Debt Settlement in Chicago, IL — Free Consultation | WeHelpFinance",
  description:
    "Chicago residents face some of the highest combined tax burdens in the country. Explore debt settlement options for Chicago and Cook County residents — free, confidential consultation.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Debt Settlement in Chicago | WeHelpFinance",
    description:
      "Debt settlement for Chicago and Cook County residents. Free consultation.",
    url: CANONICAL,
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Settlement in Chicago | WeHelpFinance",
    description: "Chicago debt settlement options. Free consultation.",
    images: [DEFAULT_TWITTER_IMAGE],
  },
};

const FAQS = [
  {
    q: "What is the statute of limitations on credit card debt in Illinois?",
    a: "Illinois has a 5-year statute of limitations on credit card debt from the date of last payment or default. After 5 years, creditors cannot obtain a court judgment. Making any payment or acknowledgment on an old account can restart this clock, so verify the date before contacting any collector.",
  },
  {
    q: "Can creditors garnish my wages in Chicago?",
    a: "Yes. Illinois allows wage garnishment at 15% of gross wages or the amount by which disposable earnings exceed 45 times the federal minimum wage per week, whichever is less. Unlike Texas, Illinois does not prohibit wage garnishment for consumer debt. This is one reason many Chicago residents in financial hardship prioritize resolving debts before creditors obtain judgments.",
  },
  {
    q: "Is debt settlement licensed in Illinois?",
    a: "Yes. Illinois requires licensing under the Illinois Debt Settlement Consumer Protection Act. All-party consent is required for call recording, meaning both parties must consent before a call is recorded. Always verify that any company you work with holds a current Illinois debt settlement license.",
  },
  {
    q: "What areas in the Chicago metro have the highest debt stress?",
    a: "The South Side and West Side of Chicago, the south suburbs (Harvey, Dolton, Calumet City, Matteson), and working-class communities in the collar counties (Aurora, Joliet, Elgin, Waukegan) have the highest concentrations of debt settlement candidates in the metro. However, debt stress exists across the metro — even in more affluent north suburbs among households carrying high balances relative to their mortgage and living expenses.",
  },
  {
    q: "Does Chicago's high property tax affect debt settlement?",
    a: "Property taxes affect the overall financial pressure on Chicago-area homeowners — higher property taxes mean less monthly discretionary income available for debt repayment. This is a factor in the affordability assessment when evaluating whether a debt settlement program deposit is sustainable for a particular household.",
  },
  {
    q: "Can I include medical debt in a Chicago debt settlement program?",
    a: "Yes. Medical debt is unsecured and is eligible for inclusion in debt settlement programs. Chicago's large healthcare sector means medical debt is a significant component of many residents' total unsecured debt load. Medical accounts often settle at favorable percentages — sometimes 30–50 cents on the dollar — because hospitals and medical providers are often more motivated to resolve accounts than credit card issuers.",
  },
];

export default function ChicagoPage() {
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
              { name: "Chicago", path: CANONICAL },
            ]),
          ),
        }}
      />
      <CityServicePage
        city={C}
        faqs={FAQS}
        stateSOL={5}
        stateWageNote="Illinois allows wage garnishment at 15% of gross wages or the amount by which disposable earnings exceed 45 times the federal minimum wage per week, whichever is less. Unlike Texas and Pennsylvania, Illinois does not prohibit wage garnishment for consumer debt."
        stateHomesteadNote="Illinois homestead exemption is $15,000 per individual or $30,000 for a married couple. This is modest compared to Texas and Florida but provides some protection for Chicago-area homeowners facing creditor judgments."
      />
    </>
  );
}
