import type { Metadata } from "next";
import { CityServicePage } from "@/components/CityServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { CITIES } from "@/lib/cityData";

const C = CITIES["washington"];
const CANONICAL = "https://www.wehelpfinance.com/debt-settlement/washington";

export const metadata: Metadata = {
  title: "Debt Settlement in Washington, D.C. - Free Consultation | WeHelpFinance",
  description:
    "Washington, D.C. has one of the shortest statutes of limitations on consumer debt in the country and an unlimited homestead exemption. See how D.C.'s unique legal system applies - free, confidential consultation.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Debt Settlement in Washington, D.C. | WeHelpFinance",
    description:
      "D.C.'s 3-year statute of limitations on consumer debt is one of the shortest in the country. See how debt settlement works for D.C. residents.",
    url: CANONICAL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Settlement in Washington, D.C. | WeHelpFinance",
    description:
      "Debt settlement for D.C. residents. A 3-year statute of limitations and unlimited homestead exemption explained. Free consultation.",
  },
};

const FAQS = [
  {
    q: "Is Washington, D.C. governed by state debt collection law?",
    a: "No. The District of Columbia is a federal district, not a state, so it has its own D.C. Code provisions rather than a state statute. For consumer debt, this actually works in residents' favor: D.C. has one of the shortest statutes of limitations in the country and consumer-protective rules on how collectors can restart that clock.",
  },
  {
    q: "What is the statute of limitations on credit card debt in Washington, D.C.?",
    a: "D.C. Code section 28-3814(o) sets a 3-year statute of limitations on consumer debt collection actions, regardless of whether the claim is framed as a contract, account stated, or open account. This is shorter than most states. Importantly, D.C. law also specifies that once the limitations period has expired, a later payment or acknowledgment cannot revive a creditor's right to sue on that debt - a stronger protection than many states offer.",
  },
  {
    q: "How does a government shutdown affect debt settlement decisions for D.C. residents?",
    a: "A large share of D.C.'s workforce is employed directly by the federal government or by contractors and organizations whose funding depends on federal budgets. Shutdowns and funding gaps have repeatedly caused real, if temporary, income disruptions across the District, and that kind of disruption is a common and legitimate reason households fall behind on credit card debt. A specialist can factor in whether a household's hardship was event-driven (a shutdown or furlough) versus an ongoing structural issue when recommending a resolution path.",
  },
  {
    q: "Does D.C. offer wage garnishment protections beyond the federal standard?",
    a: "D.C. generally follows the federal formula (the lesser of 25% of disposable earnings, or the amount above 30 times the federal minimum wage), but it also allows a debtor to file a motion claiming undue financial hardship, which a D.C. Superior Court judge can use to reduce the garnishment amount further - a protection not available in every state.",
  },
  {
    q: "How strong is D.C.'s homestead exemption for homeowners?",
    a: "D.C. Code section 15-501(a)(14) exempts a primary residence - including a co-op interest used as a residence - from creditor claims with no dollar cap based on the property's value, similar in structure to Texas and Florida's unlimited homestead exemptions. Given D.C.'s high home values, this is a significant practical protection for homeowners.",
  },
];

export default function WashingtonPage() {
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
              { name: "Washington, D.C.", path: CANONICAL },
            ]),
          ),
        }}
      />
      <CityServicePage
        city={C}
        faqs={FAQS}
        stateSOL={3}
        stateWageNote="D.C. generally follows the federal wage garnishment formula - the lesser of 25% of disposable earnings, or the amount above 30 times the federal minimum wage. D.C. Code also allows a debtor to file a motion claiming undue financial hardship, giving a Superior Court judge the ability to reduce the garnishment amount further, a protection not available in every state."
        stateHomesteadNote="D.C. Code section 15-501(a)(14) exempts a primary residence, including a qualifying co-op interest, from creditor claims with no dollar cap on the property's value - an unlimited homestead exemption similar in structure to Texas and Florida, and a significant protection given D.C.'s high home values."
      />
    </>
  );
}
