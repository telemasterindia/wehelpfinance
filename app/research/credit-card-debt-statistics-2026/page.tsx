import type { Metadata } from "next";
import { ResearchReport } from "@/components/ResearchReport";
import { faqJsonLd, breadcrumbJsonLd, articleJsonLd } from "@/lib/schema";
import { RESEARCH_REPORTS } from "@/lib/researchData";

const META = RESEARCH_REPORTS.find((r) => r.slug === "credit-card-debt-statistics-2026")!;
const CANONICAL = `https://wehelpfinance.com/research/${META.slug}`;

export const metadata: Metadata = {
  title: `${META.title} | WeHelpFinance Research`,
  description: META.excerpt,
  alternates: { canonical: CANONICAL },
  openGraph: { title: META.title, description: META.excerpt, url: CANONICAL, type: "article" },
  twitter: { card: "summary_large_image", title: META.title, description: META.excerpt },
};

const FAQS = [
  { q: "How much credit card debt do Americans have in 2026?", a: "Total US credit card debt exceeded $1.17 trillion in Q1 2026, according to Federal Reserve consumer credit data. This represents the highest level of credit card debt ever recorded and reflects persistent borrowing driven by high costs of living, elevated interest rates, and reduced household savings buffers." },
  { q: "What is the average credit card balance per household?", a: "Among households that carry a credit card balance (roughly 46% of all US households with credit cards), the average balance is approximately $9,900. When calculated across all households with at least one credit card, the average is approximately $6,500. These figures vary significantly by age, income, and geographic region." },
  { q: "What percentage of Americans are delinquent on credit card payments?", a: "The 90-day-plus serious delinquency rate for credit cards reached approximately 3.2% in 2025–2026, the highest level since 2012. This represents approximately 12–14 million accounts in serious delinquency at any given point." },
  { q: "Which age group has the most credit card debt?", a: "Americans aged 35–54 carry the highest average credit card balances, reflecting peak earning years coinciding with peak household expenses (mortgages, children, education costs). However, the fastest-growing delinquency rate is among borrowers under 35, who entered adulthood during a high-inflation, high-interest-rate environment with fewer savings buffers." },
  { q: "Has credit card debt been rising or falling?", a: "Credit card debt has risen sharply since 2021. After a temporary decline during 2020–2021 when pandemic stimulus and reduced consumer spending allowed many households to pay down balances, debt resumed growing in 2022 and accelerated through 2025–2026 as inflation outpaced income growth and interest rates on existing balances increased." },
  { q: "What can I do if my credit card debt is unmanageable?", a: "If your credit card debt has become genuinely unmanageable — meaning minimum payments are consuming an unsustainable share of your income or you cannot make progress on the principal — several options are available. These include debt consolidation at a lower interest rate, a nonprofit debt management plan, or debt settlement for cases of genuine financial hardship. A free consultation with a vetted specialist can help you assess which option fits your situation." },
];

const SOURCES = [
  { name: "Federal Reserve G.19 Consumer Credit Report, Q1 2026", url: "https://www.federalreserve.gov/releases/g19/" },
  { name: "Federal Reserve Bank of New York Center for Microeconomic Data, Household Debt and Credit Report Q1 2026", url: "https://www.newyorkfed.org/microeconomics/hhdc" },
  { name: "Consumer Financial Protection Bureau Consumer Credit Trends", url: "https://www.consumerfinance.gov/data-research/consumer-credit-trends/" },
  { name: "Experian 2025 Consumer Credit Review", url: "https://www.experian.com/blogs/ask-experian/research/consumer-credit-review/" },
  { name: "Federal Reserve Board Survey of Consumer Finances", url: "https://www.federalreserve.gov/econres/scfindex.htm" },
  { name: "Bureau of Labor Statistics Consumer Expenditure Survey", url: "https://www.bls.gov/cex/" },
];

const RELATED_POSTS = [
  { href: "/blog/minimum-payment-trap", title: "The Minimum Payment Trap: Why Your Balance Never Goes Down" },
  { href: "/blog/credit-card-apr-all-time-high", title: "Credit Card APR Is at an All-Time High — Here's What To Do" },
  { href: "/blog/what-happens-if-i-stop-paying-my-credit-cards", title: "What Happens If I Stop Paying My Credit Cards?" },
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
          <p>American credit card debt reached record levels in 2025–2026, with total balances exceeding $1.17 trillion — a figure that would have seemed extraordinary just five years ago. This report synthesizes available Federal Reserve data, credit bureau research, and consumer finance surveys to provide a comprehensive picture of who is carrying credit card debt in America, how much they owe, how delinquency rates are trending, and what the data suggests about the financial resilience of US households entering the second half of the 2020s.</p>
        }
        content={<>
          <h2 id="national-overview">National Credit Card Debt: The $1.17 Trillion Reality</h2>
          <p>Federal Reserve consumer credit data through Q1 2026 shows revolving credit — primarily credit card balances — at or near $1.17 trillion outstanding. This figure represents a dramatic acceleration from pre-pandemic levels: in Q4 2019, total revolving credit was approximately $1.1 trillion. A temporary paydown occurred during 2020–2021 as pandemic stimulus and reduced consumer spending allowed millions of households to reduce balances. That paydown reversed sharply in 2022 and has continued.</p>
          <p>The Federal Reserve Bank of New York's Center for Microeconomic Data tracks credit card balances alongside other household debt and provides regional and demographic granularity not available in the aggregate G.19 data. Their Q1 2026 report shows credit card balances as the fastest-growing component of non-mortgage household debt, with originations remaining elevated despite higher interest rates — indicating that consumer demand for credit access has not been materially dampened by the cost of borrowing.</p>

          <h2 id="average-balances">Average Balances: What the Numbers Actually Mean</h2>
          <p>Averages in consumer debt data require careful interpretation. The commonly cited "average American credit card debt" figure conflates two very different populations: households that pay their balance in full each month (roughly 54% of credit card users, who carry zero interest-bearing debt) and households that carry a revolving balance (approximately 46%). These populations have very different financial profiles and should not be analyzed together.</p>
          <p>Among balance-carrying households, the average balance is approximately $9,900 — meaningfully above the $6,500 figure that includes those with zero balances. This distinction matters because the $9,900 average reflects the population that is actually experiencing the financial burden of credit card debt, while the $6,500 figure understates the situation for those households.</p>
          <p>Geographic variation is significant. Federal Reserve Bank of New York data shows that New York City residents and San Francisco Bay Area residents carry substantially higher average balances than the national figures suggest. Conversely, rural Midwestern households tend to carry lower balances but face proportionally greater financial stress given lower average incomes.</p>

          <h2 id="delinquency-trends">Delinquency Trends: A Rising Tide of Missed Payments</h2>
          <p>The 90-day-plus serious delinquency rate — the metric most closely watched as a leading indicator of financial distress — reached approximately 3.2% in 2025–2026. This is the highest reading since 2012, when the post-financial-crisis recovery was still working through the debt overhang of the 2008–2009 recession.</p>
          <p>What makes the current delinquency increase notable is its context: it is occurring against a background of still-low official unemployment (approximately 4.1% as of mid-2026), not the severe labor market disruption of 2008–2009. This suggests that the primary driver of current delinquency is not job loss but rather the combination of high carrying costs (22%+ APRs), reduced savings buffers, and the persistent gap between income growth and essential cost increases from 2021 through 2025.</p>
          <p>Transition rates — the percentage of accounts moving from current status to delinquency — provide an earlier signal than delinquency stock. These rates began rising in 2023 and have remained elevated, suggesting that new delinquencies are being added faster than older ones are being resolved through payment, settlement, or charge-off.</p>

          <h2 id="age-group-analysis">Age Group Analysis: Who Carries the Most Debt</h2>
          <p>Federal Reserve Survey of Consumer Finances data and credit bureau research consistently show that Americans aged 35–54 carry the highest average credit card balances. This reflects the convergence of peak earning years with peak household expenses: mortgage payments, children's expenses, education costs, and the accumulated debt of establishing and maintaining a household over multiple decades.</p>
          <p>However, the most concerning delinquency trends are concentrated in younger borrowers. Americans under 35 — who entered their peak borrowing years during the high-inflation, high-interest-rate environment of 2022–2025 — show faster-rising delinquency rates than any other age cohort. This generation has fewer savings buffers than prior generations at the same life stage, having had less time to accumulate assets before cost-of-living pressures accelerated.</p>
          <p>Older Americans (55+) show lower average balances but carry a different risk profile: retirement timing constraints, fixed income considerations, and higher healthcare costs create debt vulnerability that is less visible in balance statistics than in delinquency and charge-off data for this cohort.</p>

          <h2 id="income-analysis">Income Group Analysis: The Middle Gets Squeezed</h2>
          <p>The sharpest increase in credit card balances and delinquency rates from 2021 through 2026 has been concentrated in middle-income households — those earning roughly $40,000–$75,000 annually. This group is above the threshold for most public assistance programs but below the income levels that provide meaningful savings buffers against sustained cost-of-living pressure.</p>
          <p>High-income households (above $100,000) have seen balance increases but from a position of greater financial resilience. Low-income households (below $40,000) have high delinquency rates but often lack access to sufficient credit limits to accumulate large absolute balance amounts.</p>
          <p>The middle-income group has the financial profile most likely to use credit cards as a genuine gap-filling mechanism — enough creditworthiness to accumulate meaningful balances, not enough income cushion to absorb sustained cost increases without borrowing. Bureau of Labor Statistics Consumer Expenditure Survey data shows this income bracket spending an increasing share of income on housing, food, and transportation — the three categories that experienced the sharpest sustained price increases from 2021 forward.</p>

          <h2 id="impact-and-outlook">Impact and What It Means for Consumers</h2>
          <p>The $1.17 trillion in outstanding revolving credit is not merely a macroeconomic statistic. At a 22%+ average APR, Americans are collectively paying approximately $258 billion per year in credit card interest — money that flows from household budgets to card issuers rather than to savings, consumption, or investment.</p>
          <p>For individual households, the arithmetic of high-APR revolving debt is particularly damaging. A household carrying $15,000 at 22% APR is paying approximately $275 per month in interest alone. If their minimum payment is $300, only $25 per month goes toward the principal balance. At that rate, full repayment would take decades.</p>
          <p>The policy and consumer implications are significant. Rising delinquency rates signal that an increasing portion of the US population has reached the limit of their debt-servicing capacity. This argues for — and creates demand for — debt relief mechanisms: consolidation at lower rates, structured repayment through debt management plans, and settlement for the portion of households in genuine hardship.</p>
        </>}
      />
    </>
  );
}

