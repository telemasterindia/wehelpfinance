import type { Metadata } from "next";
import { CityServicePage } from "@/components/CityServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { CITIES } from "@/lib/cityData";

const C = CITIES["denver"];
const CANONICAL = "https://www.wehelpfinance.com/debt-settlement/denver";

export const metadata: Metadata = {
  title: "Debt Settlement in Denver, CO - Free Consultation | WeHelpFinance",
  description:
    "Denver's rapid growth has driven housing costs and credit card debt higher. See how Colorado's expanded homestead exemption and wage garnishment cap apply - free, confidential consultation.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Debt Settlement in Denver | WeHelpFinance",
    description:
      "Colorado's 2022 homestead exemption expansion gives Denver homeowners stronger protection. See how debt settlement works - free consultation.",
    url: CANONICAL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Settlement in Denver | WeHelpFinance",
    description:
      "Debt settlement for Denver residents. Colorado's expanded homestead exemption and wage garnishment cap explained. Free consultation.",
  },
};

const FAQS = [
  {
    q: "How much home equity is protected for Denver homeowners?",
    a: "Colorado's homestead exemption was expanded significantly in 2022 - from $75,000 to $250,000 for most homeowners, and from $105,000 to $350,000 for homeowners who are 60 or older or disabled. Given how much Denver home values have risen, this expansion provides meaningfully more protection than Denver homeowners had before the law changed.",
  },
  {
    q: "How much of my paycheck can creditors garnish in Denver?",
    a: "Colorado limits wage garnishment below the plain federal 25% standard, using a formula tied to the state's minimum wage, which is higher than the federal minimum wage. A judgment is required before any consumer debt garnishment can begin - Colorado law expressly prohibits garnishing wages for a consumer credit transaction without a court judgment.",
  },
  {
    q: "Why has Denver's debt profile changed over the past decade?",
    a: "Denver's population grew quickly as the metro attracted young professionals and remote workers, pushing home prices and rents up sharply. While the pace of increase has moderated, many households - especially those who bought homes or signed leases near the peak - are still carrying housing costs that strain monthly budgets, which shows up in elevated credit card balances relative to the national average.",
  },
  {
    q: "What is the statute of limitations on credit card debt in Denver?",
    a: "Colorado has a 6-year statute of limitations on debts related to credit cards, medical bills, auto loans, and most other written contracts. After 6 years from the date of default, a creditor generally cannot successfully sue to collect in Colorado court, though in some circumstances a 3-year period may apply. A judgment itself can be renewed for an additional 6 or 20 years.",
  },
  {
    q: "Does Denver's outdoor recreation and hospitality economy affect debt settlement eligibility?",
    a: "Denver's tourism and outdoor-recreation-adjacent industries employ a large share of the metro's workforce at wages that often lag the region's cost of living. This does not affect eligibility for debt settlement, which is based on total unsecured debt and demonstrated hardship rather than industry or job type.",
  },
];

export default function DenverPage() {
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
              { name: "Denver", path: CANONICAL },
            ]),
          ),
        }}
      />
      <CityServicePage
        city={C}
        faqs={FAQS}
        stateSOL={6}
        stateWageNote="Colorado limits wage garnishment below the plain federal 25% standard, using a formula tied to the state's higher minimum wage. Colorado law also expressly prohibits garnishing wages for a consumer credit transaction unless a court has entered a judgment against you."
        stateHomesteadNote="Colorado's 2022 homestead exemption expansion raised protection from $75,000 to $250,000 for most homeowners, and from $105,000 to $350,000 for those 60 or older or disabled - a substantial increase given how much Denver home values have risen over the past several years."
      />
    </>
  );
}
