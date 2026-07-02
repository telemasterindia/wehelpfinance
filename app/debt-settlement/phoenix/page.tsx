import { DEFAULT_OG_IMAGE, DEFAULT_TWITTER_IMAGE } from "@/lib/seo"; // ─── PHOENIX ──────────────────────────────────────────────────────────────────
import type { Metadata } from "next";
import { CityServicePage } from "@/components/CityServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { CITIES } from "@/lib/cityData";

export const metadata: Metadata = {
  title: "Debt Settlement in Phoenix, AZ — Free Consultation | WeHelpFinance",
  description:
    "Phoenix carries some of the highest credit card debt levels in the Southwest. Arizona does not observe daylight saving time. Explore debt settlement options — free consultation.",
  alternates: {
    canonical: "https://www.wehelpfinance.com/debt-settlement/phoenix",
  },
  openGraph: {
    title: "Debt Settlement in Phoenix | WeHelpFinance",
    description:
      "Phoenix debt settlement options for Arizona residents. Free consultation.",
    url: "https://www.wehelpfinance.com/debt-settlement/phoenix",
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Settlement in Phoenix | WeHelpFinance",
    description: "Phoenix debt settlement. Free consultation.",
    images: [DEFAULT_TWITTER_IMAGE],
  },
};

const PHOENIX_FAQS = [
  {
    q: "What is the statute of limitations on credit card debt in Arizona?",
    a: "Arizona has a 6-year statute of limitations on written contracts, including credit cards. After 6 years from the date of last payment or default, creditors cannot successfully sue. Arizona's longer window gives creditors more time, making early resolution advantageous.",
  },
  {
    q: "Does Arizona protect my home from creditors?",
    a: "Yes. Arizona has one of the strongest homestead exemptions in the country at $400,000 for a primary residence. Combined with Arizona's generally favorable regulatory environment, Phoenix homeowners have meaningful protection from creditor claims even after a judgment.",
  },
  {
    q: "Why do Phoenix residents carry higher than average credit card debt?",
    a: "Phoenix is a migration-driven market — many residents relocated from California, Illinois, and the Midwest, bringing debt from higher cost-of-living origin markets. Phoenix has also experienced its own sharp housing cost inflation, adding new debt stress on top of debt that arrived with migrants. The result is average confirmed debt in Phoenix campaigns that runs higher than the state average.",
  },
  {
    q: "Is Arizona a good state for debt settlement negotiations?",
    a: "Yes. Arizona's one-party consent for call recording and its generally favorable regulatory environment make Arizona one of the simpler states to operate debt settlement programs in. Arizona's $400,000 homestead exemption also means homeowners have strong asset protection, which affects creditor leverage in negotiations.",
  },
  {
    q: "Are there military base considerations for Phoenix debt settlement?",
    a: "Yes. The Phoenix metro area has significant military presence — Luke Air Force Base in Glendale and various training installations. Active duty service members are protected under the Servicemembers Civil Relief Act (SCRA), which limits creditors' ability to take certain actions against active duty military. Spouses and dependents of active duty service members should verify SCRA eligibility before enrolling in any debt settlement program.",
  },
  {
    q: "How does the real estate market cycle affect debt settlement in Phoenix?",
    a: "Phoenix's economy is significantly tied to real estate and construction. During real estate downturns — as occurred in 2007–2012 and more recently — construction workers, real estate agents, and related service providers face sharp income disruptions. These cycles consistently produce high demand for debt settlement services in the Phoenix market.",
  },
];

export default function PhoenixPage() {
  const C = CITIES["phoenix"];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(PHOENIX_FAQS)),
        }}
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
              {
                name: "Phoenix",
                path: "https://www.wehelpfinance.com/debt-settlement/phoenix",
              },
            ]),
          ),
        }}
      />
      <CityServicePage
        city={C}
        faqs={PHOENIX_FAQS}
        stateSOL={6}
        stateWageNote="Arizona limits wage garnishment to 25% of disposable earnings or the amount exceeding 30 times the federal minimum wage, whichever is less — consistent with federal limits. Arizona does not observe daylight saving time, which is important for understanding calling window timing from out-of-state."
        stateHomesteadNote="Arizona has one of the strongest homestead exemptions in the country at $400,000 for a primary residence. This provides substantial protection for Phoenix-area homeowners facing creditor judgments."
      />
    </>
  );
}
