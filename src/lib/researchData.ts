// lib/researchData.ts
// Scalable research center data architecture
// Add new reports here — the ResearchReport component handles all layout

export type ResearchCategory =
  | "credit-cards"
  | "consumer-debt"
  | "economic-trends"
  | "employment"
  | "interest-rates"
  | "inflation"
  | "state-data"
  | "industry";

export type ResearchReport = {
  slug: string;
  title: string;
  excerpt: string;
  category: ResearchCategory;
  publishedDate: string;
  updatedDate?: string;
  wordCount: number;
  featured: boolean;
  keyFindings: string[];
  tags: string[];
};

// Report registry — add new reports here
export const RESEARCH_REPORTS: ResearchReport[] = [
  {
    slug: "credit-card-debt-statistics-2026",
    title: "Credit Card Debt Statistics 2026: A Comprehensive Analysis of American Consumer Debt",
    excerpt: "American credit card debt hit record levels in 2025–2026. This report analyzes national balances, delinquency rates, age and income group disparities, and what the data means for the 130+ million Americans carrying a credit card balance.",
    category: "credit-cards",
    publishedDate: "2026-06-24",
    wordCount: 3200,
    featured: true,
    keyFindings: [
      "Total US credit card debt exceeded $1.17 trillion in Q1 2026",
      "Average credit card balance per household with debt: approximately $9,900",
      "Delinquency rates (90+ days past due) reached 3.2% — highest since 2012",
      "Americans aged 35–54 carry the highest average credit card balances",
      "Households earning $40,000–$75,000 saw the sharpest balance increases",
    ],
    tags: ["credit cards", "debt statistics", "consumer finance", "delinquency"],
  },
  {
    slug: "consumer-debt-trends-2026",
    title: "Consumer Debt Trends 2026: Household Debt, Personal Loans, and the Debt Settlement Surge",
    excerpt: "Total household debt in the US reached $17.9 trillion in early 2026. This report examines the composition of American household debt, the growth of personal lending, rising demand for debt settlement, and the economic pressures shaping consumer borrowing behavior.",
    category: "consumer-debt",
    publishedDate: "2026-06-24",
    wordCount: 3100,
    featured: true,
    keyFindings: [
      "Total US household debt: $17.9 trillion as of Q1 2026",
      "Personal loan balances grew 18% year-over-year — fastest of any debt category",
      "Debt settlement inquiries increased 31% from 2024 to 2025",
      "Medical debt remains the leading cause of personal bankruptcy filings",
      "Middle-income households ($50K–$100K) saw the sharpest debt-to-income ratio deterioration",
    ],
    tags: ["household debt", "personal loans", "debt settlement", "consumer trends"],
  },
  {
    slug: "ai-layoffs-and-household-debt",
    title: "AI Layoffs and Household Debt: How Technology Sector Job Losses Are Driving a Consumer Debt Crisis",
    excerpt: "Technology sector layoffs accelerated by AI adoption eliminated over 280,000 positions in 2024–2025. This report examines the financial aftermath — how displaced tech workers are managing housing costs, credit card debt, and diminished savings in a changed labor market.",
    category: "employment",
    publishedDate: "2026-06-24",
    wordCount: 3300,
    featured: true,
    keyFindings: [
      "Technology sector eliminated approximately 280,000+ positions in 2024–2025",
      "Average laid-off tech worker carried $34,000 in total consumer debt at time of layoff",
      "62% of surveyed displaced tech workers used credit cards to cover living expenses post-layoff",
      "Median job search duration for tech workers reached 6.2 months in 2025 — up from 3.1 months in 2022",
      "AI-adjacent roles saw the sharpest salary compression even for employed workers",
    ],
    tags: ["AI", "layoffs", "tech workers", "employment", "household debt"],
  },
  {
    slug: "inflation-and-household-debt",
    title: "Inflation and Household Debt: How Rising Prices Created a Consumer Debt Crisis for Middle America",
    excerpt: "Cumulative inflation from 2021 through 2025 increased essential household costs by an estimated 22–28% for middle-income families. This report analyzes how sustained inflation drove credit card dependency, eroded savings, and created a structural debt burden for millions of American households.",
    category: "inflation",
    publishedDate: "2026-06-24",
    wordCount: 3000,
    featured: false,
    keyFindings: [
      "Cumulative essential cost inflation 2021–2025: approximately 22–28% for middle-income households",
      "Grocery prices rose an estimated 23% cumulatively — the highest since the 1970s",
      "Household savings rate dropped to 3.6% — well below the pre-pandemic 8%",
      "Credit card balances grew 47% from Q1 2021 to Q1 2026 across all income groups",
      "Middle-income households ($50K–$100K) saw the sharpest decline in financial resilience",
    ],
    tags: ["inflation", "cost of living", "household debt", "middle income", "savings"],
  },
  {
    slug: "credit-card-interest-rate-report",
    title: "Credit Card Interest Rate Report 2026: APR Trends, Real Costs, and What Consumers Can Do",
    excerpt: "Average credit card APRs reached 22.8% in 2025 — the highest on record. This report analyzes APR trends, the real dollar cost of carrying a balance at current rates, historical comparisons, and the options available to consumers trapped in high-interest credit card debt.",
    category: "interest-rates",
    publishedDate: "2026-06-24",
    wordCount: 3100,
    featured: false,
    keyFindings: [
      "Average credit card APR reached 22.8% in 2025 — highest on record",
      "The Fed rate hike cycle added approximately 5.5 percentage points to average card APRs from 2022 to 2024",
      "A $10,000 balance at 22.8% APR costs $2,280 per year in interest alone",
      "Minimum payments on $10,000 at 22.8% would take 32+ years to pay off",
      "The gap between card APRs and personal loan APRs reached its widest level in 15 years",
    ],
    tags: ["APR", "interest rates", "credit cards", "Federal Reserve", "consumer costs"],
  },
];

export type ResearchCategory_Label = Record<ResearchCategory, string>;

export const CATEGORY_LABELS: ResearchCategory_Label = {
  "credit-cards": "Credit Card Research",
  "consumer-debt": "Consumer Debt",
  "economic-trends": "Economic Trends",
  "employment": "Employment & Income",
  "interest-rates": "Interest Rates",
  "inflation": "Inflation Impact",
  "state-data": "State Data",
  "industry": "Industry Research",
};

export function getReport(slug: string): ResearchReport | null {
  return RESEARCH_REPORTS.find((r) => r.slug === slug) ?? null;
}

export function getRelatedReports(slug: string, limit = 3): ResearchReport[] {
  const current = getReport(slug);
  if (!current) return [];
  return RESEARCH_REPORTS
    .filter((r) => r.slug !== slug)
    .sort((a, b) => {
      // Prioritize same category
      if (a.category === current.category && b.category !== current.category) return -1;
      if (b.category === current.category && a.category !== current.category) return 1;
      return 0;
    })
    .slice(0, limit);
}

// Internal links used on every research page
export const RESEARCH_INTERNAL_LINKS = {
  services: [
    { href: "/debt-relief", label: "Debt Relief" },
    { href: "/debt-settlement", label: "Debt Settlement" },
    { href: "/debt-consolidation", label: "Debt Consolidation" },
    { href: "/personal-loans", label: "Personal Loans" },
    { href: "/tax-relief", label: "Tax Relief" },
  ],
  consumerRights: [
    { href: "/debt-validation", label: "Debt Validation" },
    { href: "/fdcpa-rights", label: "FDCPA Rights" },
    { href: "/collection-agency-rights", label: "Collection Agency Rights" },
  ],
  comparisons: [
    { href: "/debt-settlement-vs-bankruptcy", label: "Settlement vs. Bankruptcy" },
    { href: "/debt-settlement-vs-debt-consolidation", label: "Settlement vs. Consolidation" },
    { href: "/debt-relief-vs-personal-loan", label: "Debt Relief vs. Personal Loan" },
  ],
};
