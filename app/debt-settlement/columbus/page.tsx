import { DEFAULT_OG_IMAGE, DEFAULT_TWITTER_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import { CityServicePage } from "@/components/CityServicePage";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { CITIES } from "@/lib/cityData";

const C = CITIES["columbus"];
const CANONICAL = "https://www.wehelpfinance.com/debt-settlement/columbus";

export const metadata: Metadata = {
  title: "Debt Settlement in Columbus, OH — Free Consultation | WeHelpFinance",
  description:
    "Columbus is Ohio's most stable debt settlement market with consistent year-round volume. Ohio has a 6-year statute of limitations on credit card debt. Free consultation.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Debt Settlement in Columbus | WeHelpFinance",
    description:
      "Columbus Ohio debt settlement options. Ohio's most consistent debt market. Free consultation.",
    url: CANONICAL,
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Settlement in Columbus | WeHelpFinance",
    description: "Columbus debt settlement options. Free consultation.",
    images: [DEFAULT_TWITTER_IMAGE],
  },
};

const FAQS = [
  {
    q: "What is the statute of limitations on credit card debt in Ohio?",
    a: "Ohio has a 6-year statute of limitations on written contracts, which includes credit card agreements. After 6 years from the date of last payment or default, creditors cannot successfully sue. Ohio's longer statute gives creditors more time, making proactive resolution advantageous for Columbus residents with older delinquent accounts.",
  },
  {
    q: "Can creditors garnish my wages in Columbus, Ohio?",
    a: "Yes. Ohio allows wage garnishment at 25% of disposable earnings or the amount exceeding 30 times the federal minimum wage per week, whichever is less — consistent with federal limits. Ohio does not have additional wage garnishment protections beyond the federal standard.",
  },
  {
    q: "Why is Columbus Ohio's most stable debt settlement market?",
    a: "Columbus's diversified economy — state government, Ohio State University, financial services, retail, and healthcare — creates more employment stability than Cleveland or Akron, which are more exposed to manufacturing cycles. This stability produces consistent year-round debt settlement demand rather than the boom-bust patterns seen in Ohio's more manufacturing-dependent cities.",
  },
  {
    q: "Does Ohio require licensing for debt settlement companies?",
    a: "Yes. Ohio requires licensing under the Ohio Debt Settlement Act. One-party consent applies for call recording. Always verify that any company you work with holds a current Ohio license before enrolling your accounts.",
  },
  {
    q: "How does Ohio State University affect Columbus's debt profile?",
    a: "Ohio State's large student population creates significant student loan debt in Columbus — but student loans are generally not eligible for private debt settlement programs. However, OSU alumni and former students who have accumulated credit card debt after graduation are well-represented in the Columbus debt settlement market, often carrying balances from their student and early career years.",
  },
  {
    q: "What types of debt can be settled in Columbus?",
    a: "Unsecured debts are the primary candidates: credit cards, personal loans, medical bills, utility arrears, and some private student loans. Secured debts (mortgages, car loans) and federal student loans are not eligible. Columbus's large healthcare sector means medical debt is a significant component of many residents' unsecured debt load and often settles favorably.",
  },
];

export default function ColumbusPage() {
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
              { name: "Columbus", path: CANONICAL },
            ]),
          ),
        }}
      />
      <CityServicePage
        city={C}
        faqs={FAQS}
        stateSOL={6}
        stateWageNote="Ohio allows wage garnishment at 25% of disposable earnings or the amount exceeding 30 times the federal minimum wage per week, whichever is less — consistent with federal limits. Ohio does not have additional wage garnishment protections beyond the federal standard."
        stateHomesteadNote="Ohio's homestead exemption is $136,925 for a primary residence. This provides moderate protection for Columbus homeowners facing creditor judgments — better than Pennsylvania's $300 but less comprehensive than Texas's unlimited exemption."
      />
    </>
  );
}
