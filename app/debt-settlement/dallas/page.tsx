// ─── DALLAS ───────────────────────────────────────────────────────────────────
import type { Metadata } from "next";
import { CityServicePage } from "@/components/CityServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { CITIES } from "@/lib/cityData";

const TX_WAGE = "Texas completely prohibits wage garnishment for consumer debt — credit cards, medical bills, and personal loans cannot result in paycheck garnishment. Creditors who win judgments can levy bank accounts but cannot touch your paycheck.";
const TX_HOME = "Texas has an unlimited homestead exemption — your primary residence is fully protected from most creditor claims regardless of its value. Combined with the no-wage-garnishment protection, Texas gives debtors significantly more protection than most states.";

export function generateDallasMetadata(): Metadata {
  return {
    title: "Debt Settlement in Dallas, TX — Free Consultation | WeHelpFinance",
    description: "Dallas-Fort Worth is one of the fastest-growing metro areas in the US. Explore debt settlement options for DFW residents — Texas's no wage garnishment protection applies. Free consultation.",
    alternates: { canonical: "https://www.wehelpfinance.com/debt-settlement/dallas" },
    openGraph: { title: "Debt Settlement in Dallas | WeHelpFinance", description: "Texas prohibits wage garnishment. Explore DFW debt settlement options — free consultation.", url: "https://www.wehelpfinance.com/debt-settlement/dallas", type: "website" },
    twitter: { card: "summary_large_image", title: "Debt Settlement in Dallas | WeHelpFinance", description: "Debt settlement for Dallas-Fort Worth residents. Free consultation." },
  };
}

const DALLAS_FAQS = [
  { q: "Does Texas's no wage garnishment rule apply to Dallas residents?", a: "Yes. Texas's prohibition on wage garnishment for consumer debt applies statewide including all Dallas-Fort Worth residents. Even after a creditor obtains a court judgment against you, they cannot garnish your paycheck for credit card debt, medical bills, or personal loans." },
  { q: "How has DFW's rapid growth affected debt levels?", a: "Dallas-Fort Worth has been one of the fastest-growing metros in the country for over a decade. Population growth has consistently outpaced housing supply, driving rent and home prices significantly higher. For service, logistics, and retail workers in the DFW economy, wages have not kept pace with rising costs, creating persistent debt accumulation." },
  { q: "Is debt settlement available for Fort Worth residents as well?", a: "Yes. The Dallas-Fort Worth metroplex is served as a single market. Fort Worth residents have access to the same debt settlement specialists and Texas consumer protections as Dallas residents. The service covers all of Tarrant County, Collin County, Denton County, and surrounding areas." },
  { q: "What types of debt can be settled in Dallas?", a: "Unsecured debts — credit cards, personal loans, medical bills, utility arrears, and some private student loans — are the primary candidates for settlement. Secured debts like mortgages and car loans are not included in debt settlement programs. Federal student loans are not eligible." },
  { q: "How long does debt settlement take in Dallas?", a: "Most programs run 24–48 months depending on the total enrolled debt and the monthly deposit amount. During this time you make regular deposits into a savings account, and your specialist negotiates with creditors as the account builds sufficient funds." },
  { q: "What credit score do I need for debt settlement in Dallas?", a: "There is no minimum credit score requirement for debt settlement. Settlement is typically most appropriate for borrowers whose credit has already been damaged by missed payments or who are approaching delinquency. If your credit is still in good shape (660+), a personal loan for consolidation may be preferable." },
];

export default function DallasPage() {
  const C = CITIES["dallas"];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(DALLAS_FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: "Home", path: "https://www.wehelpfinance.com/" },
        { name: "Debt Settlement", path: "https://www.wehelpfinance.com/debt-settlement" },
        { name: "Dallas", path: "https://www.wehelpfinance.com/debt-settlement/dallas" },
      ])) }} />
      <CityServicePage city={C} faqs={DALLAS_FAQS} stateSOL={4} stateWageNote={TX_WAGE} stateHomesteadNote={TX_HOME} />
    </>
  );
}
