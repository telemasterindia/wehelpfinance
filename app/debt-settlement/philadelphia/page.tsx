import { DEFAULT_OG_IMAGE, DEFAULT_TWITTER_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import { CityServicePage } from "@/components/CityServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { CITIES } from "@/lib/cityData";

const C = CITIES["philadelphia"];
const CANONICAL = "https://www.wehelpfinance.com/debt-settlement/philadelphia";

export const metadata: Metadata = {
  title:
    "Debt Settlement in Philadelphia, PA — Free Consultation | WeHelpFinance",
  description:
    "Pennsylvania prohibits wage garnishment for consumer debt. Philadelphia has one of the highest rates of debt in collections of any major US city. Free, confidential consultation.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Debt Settlement in Philadelphia | WeHelpFinance",
    description:
      "Pennsylvania prohibits wage garnishment for consumer debt. Philadelphia debt settlement — free consultation.",
    url: CANONICAL,
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Settlement in Philadelphia | WeHelpFinance",
    description: "Philadelphia debt settlement options. Free consultation.",
    images: [DEFAULT_TWITTER_IMAGE],
  },
};

const FAQS = [
  {
    q: "Can creditors garnish my wages in Philadelphia, Pennsylvania?",
    a: "No — for most consumer debt. Pennsylvania prohibits wage garnishment for credit cards, medical bills, and personal loans. This puts Pennsylvania alongside Texas as one of the few states with this strong debtor protection. Exceptions apply to tax debt, student loans, and child support.",
  },
  {
    q: "What is the statute of limitations on credit card debt in Pennsylvania?",
    a: "Pennsylvania has a 4-year statute of limitations on credit card debt. After 4 years from the date of last payment or default, creditors cannot successfully sue. As in all states, making any payment or written acknowledgment on an old debt can restart this clock.",
  },
  {
    q: "How does Philadelphia's wage tax affect debt settlement eligibility?",
    a: "Philadelphia's wage tax (3.75% for city residents) reduces net take-home pay compared to surrounding suburbs. This affects the affordability assessment — how much monthly income is available for debt settlement program deposits after essential expenses. A specialist will account for this when evaluating your program options.",
  },
  {
    q: "Are there debt settlement options for Delaware County and Montgomery County residents?",
    a: "Yes. The Philadelphia metro area is served comprehensively, including Delaware County (Upper Darby, Chester, Norristown), Montgomery County (Lansdowne, Phoenixville), Bucks County, and Chester County. Collar county residents often carry higher average debt balances than Philadelphia city residents and have strong access to settlement programs.",
  },
  {
    q: "What is Pennsylvania's debt settlement regulatory environment?",
    a: "Pennsylvania requires all-party consent for call recording — both parties must consent before a recording begins. Pennsylvania has specific licensing requirements for debt settlement companies. Always verify that any company you work with is properly licensed in Pennsylvania.",
  },
  {
    q: "Does Pennsylvania's low homestead exemption affect debt settlement?",
    a: "Pennsylvania's $300 homestead exemption is one of the lowest in the country, meaning homeowners have minimal home equity protection from creditor judgments. However, the prohibition on wage garnishment for consumer debt provides significant practical income protection that partially offsets the limited homestead protection. For Philadelphia homeowners, understanding both protections is important before engaging with creditors.",
  },
];

export default function PhiladelphiaPage() {
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
              { name: "Philadelphia", path: CANONICAL },
            ]),
          ),
        }}
      />
      <CityServicePage
        city={C}
        faqs={FAQS}
        stateSOL={4}
        stateWageNote="Pennsylvania prohibits wage garnishment for most consumer debt — credit cards, medical bills, and personal loans cannot result in paycheck garnishment. This is one of the strongest consumer protections available, alongside Texas. Exceptions apply to tax debt, child support, and student loans."
        stateHomesteadNote="Pennsylvania's homestead exemption is only $300 — one of the lowest in the country. Philadelphia homeowners have limited home equity protection from creditor judgments. The wage garnishment prohibition provides the primary practical income protection for Pennsylvania consumers."
      />
    </>
  );
}
