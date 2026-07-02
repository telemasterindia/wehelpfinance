import { DEFAULT_OG_IMAGE, DEFAULT_TWITTER_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import { CityServicePage } from "@/components/CityServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { CITIES } from "@/lib/cityData";

const C = CITIES["new-york-city"];
const CANONICAL = `https://www.wehelpfinance.com/debt-settlement/new-york-city`;

export const metadata: Metadata = {
  title: `Debt Settlement in New York City, NY — Free Consultation | WeHelpFinance`,
  description: `NYC residents carry $10,400–$13,800 in average credit card debt — the highest of any major US city. New York has a 3-year statute of limitations on credit card debt. Free consultation.`,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: `Debt Settlement in New York City | WeHelpFinance`,
    description: `NYC has the highest average credit card debt of any US city. Explore debt settlement options — free consultation.`,
    url: CANONICAL,
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `Debt Settlement in New York City | WeHelpFinance`,
    description: `Debt settlement for NYC residents. Free consultation.`,
    images: [DEFAULT_TWITTER_IMAGE],
  },
};

const FAQS = [
  {
    q: "What is the statute of limitations on credit card debt in New York?",
    a: "New York has a 3-year statute of limitations on credit card debt — one of the shortest in the country. After 3 years from the date of last payment or default, creditors cannot successfully sue you. This is a significant protection for New Yorkers dealing with older collection accounts. Never make any payment on a debt without first verifying where you stand on the statute of limitations.",
  },
  {
    q: "Why do NYC residents carry so much more credit card debt than other cities?",
    a: "New York City's extraordinary cost of living creates structural debt accumulation for middle-income households. Average rent for a one-bedroom apartment in Manhattan exceeds $4,000/month, and costs outside Manhattan remain significantly above national averages. Even households earning $80,000–$100,000 often have little financial cushion after housing, transportation, and basic expenses.",
  },
  {
    q: "Does New York have special debt settlement licensing requirements?",
    a: "Yes. New York's DSRA (Debt Settlement Services Act) requires debt settlement companies to be specifically licensed in New York. Always verify that any company you work with holds a current New York debt settlement license before enrolling your accounts.",
  },
  {
    q: "Can creditors garnish my wages in New York City?",
    a: "New York allows wage garnishment but with stronger limits than the federal standard. New York caps garnishment at 10% of gross wages or 25% of disposable earnings above 30 times the federal minimum wage, whichever is less. This is more protective than federal law, particularly for lower-wage workers.",
  },
  {
    q: "Is debt settlement available for outer borough NYC residents?",
    a: "Yes — and outer borough residents (Bronx, Brooklyn, Queens, Staten Island) are the highest-volume debt settlement market in New York State. The combination of high living costs, moderate-income employment, and very high housing expenses creates debt profiles that make settlement an appropriate tool for many Bronx, Brooklyn, and Queens residents with $10,000+ in unsecured debt.",
  },
  {
    q: "What about New York City's city income tax and debt settlement?",
    a: "New York City residents pay city income tax in addition to federal and state taxes. This does not affect debt settlement eligibility or process, but it does affect affordability — NYC residents' net take-home pay is lower than comparable earners elsewhere due to the city tax. This can affect the monthly deposit amount available for a settlement program.",
  },
];

export default function NYCPage() {
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
              { name: "New York City", path: CANONICAL },
            ]),
          ),
        }}
      />
      <CityServicePage
        city={C}
        faqs={FAQS}
        stateSOL={3}
        stateWageNote="New York limits wage garnishment to 10% of gross wages or 25% of disposable earnings above 30 times the federal minimum wage per week, whichever is less — more protective than the federal standard. This provides meaningful income protection for New York City's large lower- and middle-wage workforce."
        stateHomesteadNote="New York's homestead exemption ranges from $75,000 to $150,000 depending on county. New York City and surrounding high-cost counties (Nassau, Westchester) have the higher $150,000 exemption. This is modest compared to Texas or Florida but provides some protection for homeowners."
      />
    </>
  );
}
