import type { Metadata } from "next";
import { CityServicePage } from "@/components/CityServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { CITIES } from "@/lib/cityData";

const C = CITIES["indianapolis"];
const CANONICAL = "https://www.wehelpfinance.com/debt-settlement/indianapolis";

export const metadata: Metadata = {
  title: "Debt Settlement in Indianapolis, IN - Free Consultation | WeHelpFinance",
  description:
    "Indiana offers weaker structural debtor protections than many states. See what that means for Indianapolis residents considering debt settlement - free, confidential consultation.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Debt Settlement in Indianapolis | WeHelpFinance",
    description:
      "Understand Indiana's wage garnishment and homestead rules before choosing a debt relief path. Free consultation for Indianapolis residents.",
    url: CANONICAL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Settlement in Indianapolis | WeHelpFinance",
    description:
      "Debt settlement for Indianapolis residents. Indiana's wage garnishment and homestead rules explained. Free consultation.",
  },
};

const FAQS = [
  {
    q: "How much of my paycheck can creditors garnish in Indianapolis?",
    a: "Indiana follows the standard federal wage garnishment formula: creditors can take the lesser of 25% of your disposable earnings, or the amount by which your weekly disposable earnings exceed 30 times the federal minimum wage. Unlike Texas, Florida, or Pennsylvania, Indiana does not offer any special exemption beyond this federal standard.",
  },
  {
    q: "Is Indiana's homestead exemption strong enough to protect my home in Indianapolis?",
    a: "Indiana's homestead exemption is modest compared to many other states - well below the protections available in Texas, Florida, Colorado, or Massachusetts. This means Indianapolis homeowners have comparatively less equity shielded from a creditor who obtains a court judgment, which makes resolving debt before a lawsuit reaches that stage more important here than in more consumer-protective states.",
  },
  {
    q: "What is the statute of limitations on credit card debt in Indianapolis?",
    a: "Indiana has a 6-year statute of limitations on written contracts and accounts, which covers most credit card and medical debt. After 6 years from the date of last payment or default, a creditor generally cannot successfully sue to collect in Indiana court. Making even a small payment can restart this clock, so verifying the last payment date is an important first step before responding to a collector.",
  },
  {
    q: "How does Indianapolis's logistics-heavy job market affect debt settlement eligibility?",
    a: "Indianapolis's large warehouse, distribution, and logistics workforce often comes with variable hours, seasonal fluctuations, and limited benefits - a pattern that shows up in medical and credit card debt for households navigating gaps in employer-sponsored coverage. This doesn't affect eligibility for debt settlement, which is based on total unsecured debt and demonstrated hardship rather than employment type.",
  },
  {
    q: "How much unsecured debt qualifies for a settlement program in Indianapolis?",
    a: "Most reputable debt settlement programs require at least $7,500-$10,000 in unsecured debt (credit cards, medical bills, personal loans) to make program fees worthwhile relative to potential savings. Given Indiana's weaker debtor protections, Indianapolis residents below that threshold may find direct negotiation or a debt management plan more cost-effective.",
  },
];

export default function IndianapolisPage() {
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
              { name: "Indianapolis", path: CANONICAL },
            ]),
          ),
        }}
      />
      <CityServicePage
        city={C}
        faqs={FAQS}
        stateSOL={6}
        stateWageNote="Indiana follows the standard federal wage garnishment cap: creditors can take the lesser of 25% of disposable earnings, or the amount by which weekly disposable earnings exceed 30 times the federal minimum wage. Indiana does not offer any special state-level enhancement beyond this federal floor."
        stateHomesteadNote="Indiana's homestead exemption is modest by national standards - among the lowest of any state covered in this guide. Indianapolis homeowners have comparatively limited equity protection if a creditor obtains a judgment, making early resolution of unsecured debt more consequential here than in states with stronger homestead laws."
      />
    </>
  );
}
