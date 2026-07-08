import type { Metadata } from "next";
import { CityServicePage } from "@/components/CityServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { CITIES } from "@/lib/cityData";

const C = CITIES["boston"];
const CANONICAL = "https://www.wehelpfinance.com/debt-settlement/boston";

export const metadata: Metadata = {
  title: "Debt Settlement in Boston, MA - Free Consultation | WeHelpFinance",
  description:
    "Boston combines a high cost of living with heavy student loan burdens. See how Massachusetts's 85%-protected wage garnishment rule and $500,000 homestead exemption apply - free, confidential consultation.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Debt Settlement in Boston | WeHelpFinance",
    description:
      "Massachusetts protects 85% of your paycheck from garnishment. See how debt settlement works for Boston residents - free consultation.",
    url: CANONICAL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Settlement in Boston | WeHelpFinance",
    description:
      "Debt settlement for Boston residents. Massachusetts's strong wage garnishment and homestead protections explained. Free consultation.",
  },
};

const FAQS = [
  {
    q: "How does student loan debt interact with credit card debt settlement in Boston?",
    a: "Federal and most private student loans cannot be included in a credit card debt settlement program - they are handled through separate federal repayment, forgiveness, or refinancing programs. However, Boston's dense concentration of colleges and universities means many residents carry both student debt and credit card debt simultaneously, and a specialist can help sequence which to address first based on a household's full financial picture.",
  },
  {
    q: "How much of my paycheck can creditors garnish in Boston?",
    a: "Massachusetts protects 85% of a resident's disposable earnings from garnishment - only income above roughly $750 a week can be touched, and even then only 15% of the amount above that threshold. This is one of the strongest wage protections of any state and applies statewide, including Boston and Suffolk County.",
  },
  {
    q: "Is Boston's homestead exemption enough given the area's home values?",
    a: "Massachusetts's homestead exemption is $500,000 for most homeowners, rising to $1 million for those 62 or older or disabled. Given Greater Boston's high home values, this exemption provides substantial - though not unlimited - protection, and homeowners with equity above the exemption amount should understand their specific exposure before deciding on a debt relief strategy.",
  },
  {
    q: "What is the statute of limitations on credit card debt in Boston?",
    a: "Massachusetts has a 6-year statute of limitations on consumer debt, covering both written and oral contracts including credit cards. After 6 years from the date of last payment or default, a creditor generally cannot successfully sue to collect in Massachusetts court. If a creditor does obtain a judgment, however, that judgment remains enforceable for 20 years.",
  },
  {
    q: "How much unsecured debt qualifies for a settlement program in Boston?",
    a: "Most reputable debt settlement programs require at least $7,500-$10,000 in unsecured debt (credit cards, medical bills, personal loans - not student loans) to make program fees worthwhile relative to potential savings. Given Boston's high cost of living, a specialist should size any settlement program's monthly deposit against a household's actual Boston-area budget rather than a national average.",
  },
];

export default function BostonPage() {
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
              { name: "Boston", path: CANONICAL },
            ]),
          ),
        }}
      />
      <CityServicePage
        city={C}
        faqs={FAQS}
        stateSOL={6}
        stateWageNote="Massachusetts protects 85% of a resident's disposable earnings from garnishment - only income above approximately $750 a week can be garnished, and even then only 15% of the amount above that threshold. This is one of the strongest wage garnishment protections in the country."
        stateHomesteadNote="Massachusetts's homestead exemption is $500,000 for most homeowners, rising to $1 million for those 62 or older or disabled. Given Greater Boston's high home values, homeowners with substantial equity should understand where their specific protection falls relative to this cap."
      />
    </>
  );
}
