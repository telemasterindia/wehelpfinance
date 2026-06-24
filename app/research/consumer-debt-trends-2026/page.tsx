import type { Metadata } from "next";
import { ResearchReport } from "@/components/ResearchReport";
import { faqJsonLd, breadcrumbJsonLd, articleJsonLd } from "@/lib/schema";
import { RESEARCH_REPORTS } from "@/lib/researchData";

const META = RESEARCH_REPORTS.find((r) => r.slug === "consumer-debt-trends-2026")!;
const CANONICAL = `https://wehelpfinance.com/research/${META.slug}`;

export const metadata: Metadata = {
  title: `${META.title} | WeHelpFinance Research`,
  description: META.excerpt,
  alternates: { canonical: CANONICAL },
  openGraph: { title: META.title, description: META.excerpt, url: CANONICAL, type: "article" },
  twitter: { card: "summary_large_image", title: META.title, description: META.excerpt },
};

const FAQS = [
  { q: "What is the total US household debt in 2026?", a: "Total US household debt reached approximately $17.9 trillion in early 2026, according to Federal Reserve Bank of New York data. This includes mortgage debt (the largest component), auto loans, student loans, credit card debt, and personal loans. Non-mortgage consumer debt — the category most relevant to debt relief — accounts for approximately $5.1 trillion of the total." },
  { q: "Which type of debt is growing fastest in 2026?", a: "Personal loan balances showed the fastest year-over-year growth rate in 2025–2026, increasing approximately 18% compared to the prior year. This growth reflects both demand for debt consolidation and the expansion of fintech lending platforms that have made personal loans more accessible to a broader range of credit profiles." },
  { q: "Is demand for debt settlement increasing?", a: "Yes. Consumer inquiries for debt settlement services increased approximately 31% from 2024 to 2025, based on industry data from settlement company trade associations. This aligns with the increase in credit card delinquencies and reflects growing awareness that minimum payments are insufficient for many households to make meaningful progress on their debt." },
  { q: "What is causing household debt to rise in 2026?", a: "Multiple factors are driving household debt growth: persistent inflation from 2021–2025 eroded real purchasing power; interest rate increases made existing variable-rate debt more expensive; reduced pandemic-era savings buffers eliminated the financial cushion that had allowed some households to avoid debt; and stagnant wage growth in key sectors failed to keep pace with essential cost increases." },
  { q: "How does US consumer debt compare historically?", a: "Total household debt at $17.9 trillion is significantly higher in nominal terms than any prior period. However, as a percentage of GDP, the picture is more nuanced — debt service ratios (the share of income required to service debt) are elevated but not at 2008-level crisis territory. The key concern is the composition: rising share in high-interest consumer debt (credit cards, personal loans) relative to lower-cost mortgage debt." },
  { q: "What options are available for consumers struggling with household debt?", a: "For unsecured debt (credit cards, personal loans, medical bills), options include debt consolidation at a lower interest rate, nonprofit debt management plans, and debt settlement for genuine hardship cases. For mortgage-related stress, forbearance, modification, and refinancing options depend on loan type and servicer. A free consultation can help identify which options are appropriate for a specific debt composition and financial situation." },
];

const SOURCES = [
  { name: "Federal Reserve Bank of New York Household Debt and Credit Report Q1 2026", url: "https://www.newyorkfed.org/microeconomics/hhdc" },
  { name: "Federal Reserve G.19 Consumer Credit Statistical Release", url: "https://www.federalreserve.gov/releases/g19/" },
  { name: "CFPB Consumer Reporting Complaint Database 2025", url: "https://www.consumerfinance.gov/data-research/consumer-complaints/" },
  { name: "American Fair Credit Council Industry Data 2025" },
  { name: "TransUnion Industry Insights Report Q4 2025" },
  { name: "Federal Reserve Survey of Consumer Finances 2025 Preliminary Data", url: "https://www.federalreserve.gov/econres/scfindex.htm" },
];

const RELATED_POSTS = [
  { href: "/blog/inflation-debt-crisis-middle-america", title: "How Inflation Created a Debt Crisis for Middle America" },
  { href: "/blog/minimum-payment-trap", title: "The Minimum Payment Trap: Why Your Balance Never Goes Down" },
  { href: "/blog/government-credit-card-forgiveness-real-or-myth", title: "Government Credit Card Forgiveness: Real or Myth?" },
];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd({ title: META.title, excerpt: META.excerpt, published: META.publishedDate, slug: META.slug, path: `/research/${META.slug}`, author: "WeHelpFinance Research Team" })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: "Home", path: "https://wehelpfinance.com/" },
        { name: "Research Center", path: "https://wehelpfinance.com/research" },
        { name: META.title, path: CANONICAL },
      ])) }} />
      <ResearchReport
        meta={META}
        keyFindings={META.keyFindings}
        faqs={FAQS}
        sources={SOURCES}
        relatedBlogPosts={RELATED_POSTS}
        executiveSummary={
          <p>Total US household debt reached $17.9 trillion in early 2026, with the composition of that debt shifting in ways that carry significant implications for consumer financial health. This report examines the trajectory of household debt across all major categories, with particular focus on the fastest-growing and highest-stress segments: credit card debt, personal loans, and the rising demand for structured debt relief. The analysis draws on Federal Reserve Bank of New York microeconomic data, industry reporting, and consumer finance survey research to identify the trends most likely to shape consumer financial behavior through the remainder of 2026 and into 2027.</p>
        }
        content={<>
          <h2 id="total-household-debt">Total Household Debt: $17.9 Trillion and Rising</h2>
          <p>The Federal Reserve Bank of New York's Center for Microeconomic Data tracks total US household debt across all major categories on a quarterly basis. Their Q1 2026 report places total outstanding household debt at approximately $17.9 trillion — the highest level ever recorded in nominal terms.</p>
          <p>The composition of this debt matters as much as the total. Mortgage debt remains the largest component at approximately $12.5 trillion, and its servicing burden has been mitigated for existing homeowners who locked in low rates before 2022. The more financially stressful categories are consumer debts that carry variable or market-rate interest: credit cards ($1.17 trillion), auto loans ($1.63 trillion), student loans ($1.72 trillion), and personal loans (approximately $0.5 trillion).</p>
          <p>It is the consumer debt segment — particularly credit cards and personal loans — that has seen the sharpest increase in delinquency and the most acute financial stress for households. While mortgage delinquency remains low by historical standards, credit card delinquency is at its highest level since 2012.</p>

          <h2 id="personal-loan-growth">Personal Loan Growth: The Fastest Expanding Debt Category</h2>
          <p>Personal loan balances grew approximately 18% year-over-year in 2025 — the fastest growth rate of any major consumer debt category. This growth reflects two distinct forces operating simultaneously.</p>
          <p>The first is consolidation demand. As credit card rates reached 22%+ and households accumulated high-rate revolving balances, the personal loan became the primary vehicle for consumers seeking to convert variable-rate, high-APR credit card debt into fixed-rate, potentially lower-rate installment debt. The spread between average personal loan rates (approximately 12–14% for good-credit borrowers) and credit card rates (22%+) has been wide enough to drive significant refinancing activity.</p>
          <p>The second is the expansion of fintech lending. Online personal loan originators — which use alternative underwriting data and automated decisioning — have materially broadened access to personal loans for borrowers with fair and even poor credit profiles. This expansion has democratized access but has also extended credit to borrowers whose credit risk may be underpriced by alternative underwriting models, introducing potential systemic risk as economic conditions stress.</p>
          <p>Fintech-originated personal loan delinquency rates have risen faster than bank-originated rates, suggesting that the expansion of credit access to lower-credit-quality borrowers has introduced quality risk that will become more visible as economic conditions tighten.</p>

          <h2 id="debt-settlement-trends">Debt Settlement Trends: Rising Demand as Delinquency Increases</h2>
          <p>Consumer inquiries for debt settlement services — tracked through American Fair Credit Council member data and independent market research — increased approximately 31% from 2024 to 2025. This is the largest single-year increase since 2009–2010, when post-financial-crisis unemployment drove similar demand.</p>
          <p>The current increase differs from the 2009–2010 surge in a key respect: today's demand is not primarily driven by mass unemployment. Unemployment in 2025–2026 remained in the 4–4.5% range — elevated from the post-pandemic lows but not crisis-level. Instead, the driver of settlement demand is the combination of very high carrying costs (22%+ APR on accumulated balances) and reduced income buffers that have made minimum payments genuinely unsustainable for a growing portion of credit card holders.</p>
          <p>Settlement enrollment typically requires accounts to be delinquent or approaching delinquency — which is consistent with the simultaneous rise in credit card delinquency rates to 3.2%+ serious delinquency. As accounts charge off and move to collections, the population eligible and motivated to pursue settlement grows proportionally.</p>

          <h2 id="economic-pressures">The Economic Pressures Shaping Borrowing Behavior</h2>
          <p>Understanding the debt trend data requires understanding the economic pressures that have shaped consumer borrowing behavior since 2021. Three factors stand out as particularly significant.</p>
          <p><strong>Sustained inflation:</strong> Cumulative price increases from 2021 through 2025 in essential categories — food, housing, energy, healthcare, insurance — ranged from 18–30% depending on category and region. For middle-income households spending the majority of their income on these categories, the purchasing power erosion was substantial and persistent.</p>
          <p><strong>Interest rate normalization:</strong> The Federal Reserve's rapid rate increases from 2022 through 2024 dramatically increased the cost of carrying variable-rate debt. Credit card APRs tracked the federal funds rate closely and quickly, while wage growth responded more slowly. The result was a growing interest burden on existing balances concurrent with the income squeeze from inflation.</p>
          <p><strong>Savings buffer depletion:</strong> The personal savings rate in the US dropped to approximately 3.6% by 2025, well below the pre-pandemic average of around 8%. The savings accumulated during 2020–2021 — when reduced consumption and stimulus payments allowed many households to build financial buffers — were drawn down over 2022–2024 to cover the gap between income and inflated essential costs. With savings buffers depleted, the next income shock hits households with no cushion.</p>

          <h2 id="consumer-borrowing-behavior">Consumer Borrowing Behavior: What Survey Data Shows</h2>
          <p>Federal Reserve Survey of Consumer Finances data and supplementary survey research provide insight into the behavioral dimension of debt accumulation — why people are borrowing and how they perceive their situation.</p>
          <p>Among households that increased credit card balances in 2024–2025, surveys consistently identify three primary reasons: (1) paying for essential expenses including food, utilities, and housing (cited by approximately 58% of balance-increasing households); (2) unexpected medical expenses or car repairs (approximately 31%); and (3) replacing income lost during a job transition (approximately 22%). Discretionary spending — vacations, entertainment, luxury goods — accounts for a relatively small share of new balance accumulation, contradicting a persistent narrative about overspending as the primary driver of consumer debt.</p>
          <p>This behavioral data has implications for debt relief suitability. Households that accumulated debt primarily covering essential costs during a period of elevated prices or income disruption have debt that is, in a meaningful sense, structural — it represents a past gap between income and necessary expenses that will not close on its own without either income growth, cost reduction, or debt relief. Minimum payment strategies that address only the interest component of the balance do nothing to close this gap.</p>

          <h2 id="middle-income-squeeze">The Middle-Income Household: Most Affected, Least Assisted</h2>
          <p>The most consequential trend in the consumer debt data is the deterioration in debt-to-income ratios for middle-income households — those earning approximately $50,000–$100,000 annually. This income band has seen the sharpest ratio deterioration because it sits at the intersection of several unfavorable dynamics.</p>
          <p>These households earn too much to qualify for most public assistance programs, so the safety net provides limited relief during income disruptions. They have established credit histories and credit limits sufficient to accumulate meaningful debt balances. Their wages have grown in nominal terms but lagged inflation in real terms. And their essential expense share of income — already high before 2021 — became even higher as costs rose faster than pay.</p>
          <p>The result is a population of millions of households that appear financially stable by conventional metrics (employed, with credit, making minimum payments) but are in fact in a slow deterioration — balances growing, savings absent, and debt servicing consuming an increasing share of take-home pay. This is the population most likely to seek structured debt relief as the arithmetic becomes unmistakable.</p>
        </>}
      />
    </>
  );
}

