import { DEFAULT_OG_IMAGE, DEFAULT_TWITTER_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import { CityServicePage } from "@/components/CityServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { CITIES } from "@/lib/cityData";

const C = CITIES["los-angeles"];
const CANONICAL = `https://www.wehelpfinance.com/debt-settlement/${C.slug}`;

export const metadata: Metadata = {
  title: `Debt Settlement in Los Angeles, CA — Free Consultation | WeHelpFinance`,
  description: `Los Angeles residents carry $9,200–$11,400 in average credit card debt. Explore debt settlement options for LA residents — free, confidential consultation with vetted specialists.`,
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: `Debt Settlement in Los Angeles | WeHelpFinance`,
    description: `Explore debt settlement for LA residents. Settle credit card debt for 40–60% of the balance. Free consultation.`,
    url: CANONICAL,
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `Debt Settlement in Los Angeles | WeHelpFinance`,
    description: `Debt settlement options for Los Angeles residents. Free consultation.`,
    images: [DEFAULT_TWITTER_IMAGE],
  },
};

const FAQS = [
  {
    q: "What is the statute of limitations on credit card debt in California?",
    a: "California has a 4-year statute of limitations on credit card debt. After 4 years from the date of last payment or default, creditors cannot successfully sue you to collect the debt. Never make a payment on an old account without first verifying where you stand on the statute of limitations — a payment can restart the clock.",
  },
  {
    q: "Do debt collectors in Los Angeles have to follow special rules?",
    a: "Yes. California's Rosenthal Fair Debt Collection Practices Act extends FDCPA-like protections to original creditors — meaning even your original credit card company must follow fair collection practices, not just third-party collectors. This is broader protection than most other states provide.",
  },
  {
    q: "How much does debt settlement cost in Los Angeles?",
    a: "Settlement companies typically charge 15–25% of enrolled debt as their fee, collected after each successful settlement. On $25,000 in enrolled debt, fees might run $3,750–$6,250. The total you pay — settlements plus fees — is typically 55–80% of the original balance, saving 20–45% compared to paying in full.",
  },
  {
    q: "Can I do debt settlement in Los Angeles if I still have my job?",
    a: "Yes. Being employed does not disqualify you from debt settlement. What matters is whether your income can support the monthly program deposits while covering essential living expenses. Many Los Angeles residents in debt settlement programs remain employed — the issue is that their income, while stable, is insufficient to both cover LA's high cost of living and service their debt obligations at the same time.",
  },
  {
    q: "Is debt settlement licensed in California?",
    a: "Yes. California requires DFPI (Department of Financial Protection and Innovation) licensing for debt settlement companies operating in the state. Always verify that any company you work with is properly licensed in California before enrolling.",
  },
  {
    q: "What neighborhoods in Los Angeles have the highest debt stress?",
    a: "Based on demographic data and debt settlement industry research, the highest concentrations of debt settlement candidates in the LA area are in South Los Angeles, East Los Angeles, the Inland Empire (Fontana, Rialto, Ontario, Riverside), and working-class communities in the San Fernando Valley. However, debt stress exists across income levels in a market where even median-wage earners struggle with housing costs.",
  },
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
                name: "Debt Settlement",
                path: "https://www.wehelpfinance.com/debt-settlement",
              },
              { name: "Los Angeles", path: CANONICAL },
            ]),
          ),
        }}
      />
      <CityServicePage
        city={C}
        faqs={FAQS}
        stateSOL={4}
        stateWageNote="California limits wage garnishment to 25% of disposable earnings or the amount by which disposable earnings exceed 40 times the state minimum wage per week, whichever is less. California's high minimum wage provides stronger protection for lower-wage workers than the federal standard."
        stateHomesteadNote="California significantly expanded its homestead exemption in 2021 to $300,000–$600,000 depending on county median home prices — one of the most protective in the country. Los Angeles County's high home values mean most LA homeowners qualify for the maximum $600,000 exemption."
      />
    </>
  );
}
