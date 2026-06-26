import type { Metadata } from "next";
import { CityServicePage } from "@/components/CityServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { CITIES } from "@/lib/cityData";

const C = CITIES["atlanta"];
const CANONICAL = "https://www.wehelpfinance.com/debt-settlement/atlanta";

export const metadata: Metadata = {
  title: "Debt Settlement in Atlanta, GA — Free Consultation | WeHelpFinance",
  description: "Atlanta is the fastest-growing major Southern metro and a top-10 debt settlement market. Georgia has one-party consent and a 6-year statute of limitations. Free consultation.",
  alternates: { canonical: CANONICAL },
  openGraph: { title: "Debt Settlement in Atlanta | WeHelpFinance", description: "Debt settlement for Atlanta and metro Georgia residents. One-party consent, favorable regulations. Free consultation.", url: CANONICAL, type: "website" },
  twitter: { card: "summary_large_image", title: "Debt Settlement in Atlanta | WeHelpFinance", description: "Atlanta debt settlement options. Free consultation." },
};

const FAQS = [
  { q: "What is the statute of limitations on credit card debt in Georgia?", a: "Georgia has a 6-year statute of limitations on written contracts, which courts have generally applied to credit card agreements. After 6 years from the date of last payment or default, creditors cannot successfully sue you. Georgia's longer statute gives creditors more time to collect — making early resolution more important than in states with shorter windows." },
  { q: "Can creditors garnish my wages in Atlanta?", a: "Yes. Georgia allows wage garnishment at 25% of disposable earnings or the amount exceeding 30 times the federal minimum wage per week, whichever is less — consistent with federal limits. Georgia does not have additional wage garnishment protections beyond the federal standard." },
  { q: "Why is Atlanta such a large debt settlement market?", a: "Atlanta combines rapid population growth, rising housing costs, and a large service and logistics economy with relatively moderate wages for non-professional workers. The city's growth has been a double-edged sword — economic opportunity has attracted millions of new residents, but housing and transportation costs have risen faster than wages for many of those workers, creating persistent debt accumulation." },
  { q: "Are there specific debt settlement requirements in Georgia?", a: "Georgia's regulatory environment for debt settlement is considered favorable compared to highly regulated states like California and New York. One-party consent simplifies compliance. Georgia does have licensing requirements for debt settlement companies — verify that any company you work with holds a current Georgia license." },
  { q: "Does Atlanta's film and TV industry create special debt situations?", a: "Atlanta's large and growing film and television production industry creates a significant population of creative and gig workers with variable income. Income variability is a common trigger for debt settlement suitability — when income drops between projects, credit cards fill the gap. Settlement programs designed around variable income are available for workers in this sector." },
  { q: "What are the best debt settlement options for Gwinnett County residents?", a: "Gwinnett County residents have access to the same debt settlement programs as all Atlanta metro residents. Gwinnett's large immigrant and first-generation American population has above-average credit card utilization, and debt settlement programs are accessible regardless of immigration status for those with qualifying debt and income." },
];

export default function AtlantaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: "Home", path: "https://www.wehelpfinance.com/" },
        { name: "Debt Settlement", path: "https://www.wehelpfinance.com/debt-settlement" },
        { name: "Atlanta", path: CANONICAL },
      ])) }} />
      <CityServicePage
        city={C} faqs={FAQS} stateSOL={6}
        stateWageNote="Georgia allows wage garnishment at 25% of disposable earnings or the amount exceeding 30 times the federal minimum wage per week, whichever is less — consistent with federal limits. Georgia does not provide additional wage garnishment protections beyond the federal standard."
        stateHomesteadNote="Georgia's homestead exemption is $21,500 for individuals or $43,000 for married couples filing jointly in bankruptcy. For judgment creditors outside bankruptcy, the homestead exemption provides some protection for Georgia homeowners."
      />
    </>
  );
}
