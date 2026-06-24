// lib/stateData.ts — WeHelpFinance state page data architecture
// Add new states here to scale to all 50 states

export type StateDebtRelief = {
  avgCreditCardDebt: string;
  delinquencyContext: string;
  statuteOfLimitationsCC: number;
  wageGarnishmentAllowed: boolean;
  wageGarnishmentNote: string;
  homesteadExemption: string;
  uniqueProtection: string;
  localContext: string;
  keyChallenge: string;
};

export type StatePersonalLoans = {
  usuryCap: string;
  paydayNote: string;
  avgHouseholdIncome: string;
  lendingContext: string;
  localEconomy: string;
  keyConsideration: string;
};

export type StateTaxRelief = {
  hasStateTax: boolean;
  stateTaxRate: string;
  stateAgency: string;
  stateAgencyUrl: string;
  propertyTaxNote: string;
  irsOfficeCities: string;
  commonIssue: string;
  selfEmployedContext: string;
  localTaxContext: string;
};

export type StateData = {
  name: string;
  abbreviation: string;
  slug: string;
  largestCity: string;
  debtRelief: StateDebtRelief;
  personalLoans: StatePersonalLoans;
  taxRelief: StateTaxRelief;
};

export const STATES: Record<string, StateData> = {

  texas: {
    name: "Texas", abbreviation: "TX", slug: "texas", largestCity: "Houston",
    debtRelief: {
      avgCreditCardDebt: "$6,800",
      delinquencyContext: "Houston and Dallas consistently rank among US cities with the highest rates of accounts in collections. Rapid population growth has outpaced wage growth in many sectors, and the energy industry's boom-bust cycles create income volatility that pushes households into credit card dependency during downturns.",
      statuteOfLimitationsCC: 4,
      wageGarnishmentAllowed: false,
      wageGarnishmentNote: "Texas prohibits wage garnishment for consumer debt entirely — one of only a handful of states with this protection. Creditors who win judgments cannot garnish your paycheck for credit card debt, medical bills, or personal loans.",
      homesteadExemption: "Texas offers an unlimited homestead exemption — your primary residence is fully protected from most creditor claims, regardless of its value. This is one of the strongest home protections in the country.",
      uniqueProtection: "The combination of no wage garnishment and unlimited homestead exemption makes Texas exceptionally protective for consumers facing debt collection. Creditors who win judgments have significantly fewer enforcement tools than in most other states.",
      localContext: "Austin's tech-driven cost-of-living surge has pushed middle-income residents into credit card dependency, while Houston's energy sector creates income volatility tied to oil prices. Dallas–Fort Worth's rapid growth has widened the gap between wages and housing costs for service-sector workers.",
      keyChallenge: "Despite strong asset protections, Texas has no state income tax assistance programs and limited state-level debt relief resources. The burden falls entirely on private-market solutions.",
    },
    personalLoans: {
      usuryCap: "Texas has a complex lending rate structure. Most traditional personal loans from licensed lenders are competitive. However, Texas is known for very weak regulation of payday and auto-title lenders, which operate as Credit Access Businesses at extremely high effective APRs.",
      paydayNote: "Texas is one of the least regulated payday lending states in the country. Payday and title loans in Texas can carry effective APRs above 600%. If you need a personal loan in Texas, avoid these products entirely and use banks, credit unions, or reputable online lenders.",
      avgHouseholdIncome: "$67,000",
      lendingContext: "Texas has a large and competitive personal lending market across Dallas, Houston, Austin, and San Antonio. Credit unions are particularly strong in Texas — TEFCU, Randolph-Brooks, and Amplify are among the larger credit unions offering competitive personal loan rates.",
      localEconomy: "Texas's economy is one of the largest in the US, driven by energy, technology, healthcare, and logistics. Income varies significantly by region — energy workers in West Texas can earn well above average, while service workers in tourist and hospitality roles often earn below average despite rising costs.",
      keyConsideration: "Texas residents seeking a personal loan for debt consolidation should compare credit union rates first before using online lenders. The Dallas, Houston, and Austin markets have strong credit union options that often beat bank and online lender rates for members.",
    },
    taxRelief: {
      hasStateTax: false,
      stateTaxRate: "No state income tax",
      stateAgency: "Texas Comptroller of Public Accounts",
      stateAgencyUrl: "https://comptroller.texas.gov",
      propertyTaxNote: "Texas has no state income tax but has property tax rates among the highest in the country — typically 1.5–2.5% of assessed value annually. Property tax debt is handled separately and is not part of IRS relief programs.",
      irsOfficeCities: "Austin, Houston, Dallas, San Antonio",
      commonIssue: "Texas's large self-employed and 1099 workforce — in energy services, construction, trucking, and agriculture — creates significant IRS issues. Many Texas workers underestimate quarterly estimated tax obligations and accumulate federal tax debt over multiple years without state withholding to keep them on track.",
      selfEmployedContext: "Texas has an enormous self-employed population across oil field services, construction, independent trucking, and agriculture. These workers face the full weight of self-employment tax — 15.3% on net earnings — often without the quarterly payment discipline that comes from W-2 withholding.",
      localTaxContext: "Texas businesses also face state franchise tax obligations separate from federal tax. Small business owners dealing with IRS problems often discover simultaneous Texas Comptroller compliance issues. IRS relief programs do not address state franchise tax, requiring separate resolution.",
    },
  },

  florida: {
    name: "Florida", abbreviation: "FL", slug: "florida", largestCity: "Jacksonville",
    debtRelief: {
      avgCreditCardDebt: "$6,400",
      delinquencyContext: "Florida consistently ranks in the top 10 states for personal bankruptcy filings and has one of the highest credit card delinquency rates in the country. Tourism-dependent employment creates seasonal income gaps; the large retiree population faces fixed-income pressure; and rapidly rising housing costs have pushed working families into credit card dependency.",
      statuteOfLimitationsCC: 5,
      wageGarnishmentAllowed: true,
      wageGarnishmentNote: "Florida allows wage garnishment, but with a significant protection: if you are the head of household — the primary financial support for a family member — your wages may be fully exempt from garnishment. This exemption must be claimed in writing within 20 days of being served. For individuals without dependents, the federal 25% limit applies.",
      homesteadExemption: "Florida's homestead exemption is one of the strongest in the country — your primary residence is fully protected from most creditor claims regardless of value, similar to Texas. This is a major protection for Florida homeowners facing debt collection.",
      uniqueProtection: "The combination of the unlimited homestead exemption and the head-of-household wage protection provides meaningful insulation for Florida families. Understanding both protections before engaging with debt collectors or evaluating bankruptcy is essential for Florida residents.",
      localContext: "South Florida's (Miami–Fort Lauderdale–West Palm Beach) cost of living rivals New York for many consumer categories, while wages for service and healthcare workers often lag behind. Central Florida's theme park and hospitality economy creates structured seasonal income patterns that make annual budgeting difficult.",
      keyChallenge: "Florida's large seasonal workforce faces a fundamental debt accumulation cycle: credit cards fill the income gap during slow months, and the annual reset rarely allows the balance to be fully paid before the next slow season begins.",
    },
    personalLoans: {
      usuryCap: "Florida's civil usury cap is 18% for most consumer loans. However, federally chartered banks operating in Florida are not subject to this cap. Most major online lenders and banks operate under federal preemption, which allows rates above the Florida cap.",
      paydayNote: "Florida limits payday loans to $500 and requires a 24-hour cooling-off period between loans, with a statewide database preventing multiple simultaneous loans. These protections are more robust than most states, but payday loans remain expensive. Traditional personal loans are strongly preferable.",
      avgHouseholdIncome: "$61,000",
      lendingContext: "Florida has a large personal lending market with strong credit union presence — Suncoast Credit Union, Space Coast Credit Union, and Achieva Credit Union among others. The state's large retiree population creates significant demand for personal lending products across all credit profiles.",
      localEconomy: "Florida's economy is anchored by tourism, healthcare, real estate, and a growing technology sector. Seasonal income patterns are common in tourist-dependent regions. Retirement communities create a distinct demand for personal loans among fixed-income borrowers.",
      keyConsideration: "Florida residents with seasonal income should pay close attention to loan payment schedules. A fixed monthly payment that is comfortable during peak income months may be difficult during slow season. Lenders that allow temporary payment deferrals or offer income-sensitive payment options are worth prioritizing.",
    },
    taxRelief: {
      hasStateTax: false,
      stateTaxRate: "No state income tax",
      stateAgency: "Florida Department of Revenue",
      stateAgencyUrl: "https://floridarevenue.com",
      propertyTaxNote: "Florida has no state income tax but has property tax rates that vary by county. Florida's Save Our Homes amendment caps annual assessed value increases at 3% for primary residences of long-term homeowners, providing cost stability.",
      irsOfficeCities: "Jacksonville, Tampa, Orlando, Miami, Fort Lauderdale",
      commonIssue: "Florida's large self-employed population in construction, real estate, tourism services, and small business creates significant IRS issues. The real estate cycle particularly affects Florida — during boom periods, self-employed contractors and real estate professionals earn large incomes without withholding; during busts, prior years' tax obligations become unmanageable.",
      selfEmployedContext: "Florida has an enormous self-employed workforce in construction, landscaping, tourism services, and real estate. These workers frequently face IRS issues from underestimated quarterly payments and unfiled returns during income downturns — problems that can compound over multiple years before they become unmanageable.",
      localTaxContext: "Florida businesses pay corporate income tax (5.5% for C-corps) and sales tax. Small business owners facing federal IRS issues often simultaneously face Florida Department of Revenue issues for sales tax non-compliance, requiring resolution on two separate fronts.",
    },
  },

  california: {
    name: "California", abbreviation: "CA", slug: "california", largestCity: "Los Angeles",
    debtRelief: {
      avgCreditCardDebt: "$7,200",
      delinquencyContext: "California's cost of living is among the highest in the country. Bay Area, Los Angeles, and San Diego housing costs consume 40–60% of median household income for renters, leaving almost no financial buffer. Tech sector layoffs in 2022–2025 pushed formerly high-income workers into significant debt accumulation as income dropped while lifestyle costs remained elevated.",
      statuteOfLimitationsCC: 4,
      wageGarnishmentAllowed: true,
      wageGarnishmentNote: "California limits wage garnishment to 25% of disposable earnings or the amount by which disposable earnings exceed 40 times the state minimum wage, whichever is less. With California's minimum wage among the highest in the country ($16–20+ per hour depending on employer size), the 40x calculation provides meaningful protection for lower-wage workers.",
      homesteadExemption: "California significantly expanded its homestead exemption in 2021. The automatic homestead exemption is now $300,000–$600,000 depending on the county's median home price — one of the most protective in the country for homeowners outside of Texas and Florida.",
      uniqueProtection: "California's Rosenthal Fair Debt Collection Practices Act extends FDCPA-like protections to original creditors — meaning that even your original credit card company (not just third-party collectors) must follow fair collection practices. This is broader protection than the federal FDCPA provides in most states.",
      localContext: "The Bay Area's tech layoff cycle has created a specific debt pattern: high earners who built lifestyles on RSU compensation lost income abruptly, often while locked into expensive housing leases. Southern California's entertainment and service economy creates income variability that fuels credit card dependency.",
      keyChallenge: "California's extraordinarily high housing costs make even six-figure earners financially vulnerable. After housing, taxes, and basic expenses, many California middle-income households have little margin for unexpected expenses — making credit cards the gap-filler that leads to debt accumulation.",
    },
    personalLoans: {
      usuryCap: "California in 2020 capped interest rates on consumer loans of $2,500–$10,000 at 36% APR — a meaningful protection. For loans above $10,000, rates are generally market-determined. California's consumer protection laws require clear APR disclosure on all consumer loan products.",
      paydayNote: "California limits payday loans to $300 maximum with a 15% fee cap, creating effective APRs around 460% for two-week loans. Despite these caps, payday lending remains expensive. California prohibits rollovers. Traditional personal loans from mainstream lenders are strongly preferable.",
      avgHouseholdIncome: "$84,000",
      lendingContext: "California has the most competitive personal lending market of any state. Major banks, credit unions (Golden 1, SchoolsFirst, Star One), and a large ecosystem of fintech lenders all compete aggressively. The 36% rate cap on $2,500–$10,000 loans is a meaningful consumer protection, though some lenders structure loans above $10,000 to avoid it.",
      localEconomy: "California's economy is the largest of any US state and the fifth largest in the world. Technology, entertainment, agriculture, and trade drive the economy. Income inequality is extreme — the state has both the highest concentration of billionaires and a poverty rate above the national average.",
      keyConsideration: "California's 36% rate cap on loans $2,500–$10,000 protects many borrowers, but loans above $10,000 carry no rate cap. For California residents consolidating larger amounts, comparing credit union rates (often competitive even for larger loans) against online lenders is important.",
    },
    taxRelief: {
      hasStateTax: true,
      stateTaxRate: "1–13.3% (highest top marginal rate in the country)",
      stateAgency: "California Franchise Tax Board (FTB)",
      stateAgencyUrl: "https://ftb.ca.gov",
      propertyTaxNote: "California's Proposition 13 limits property tax increases to 2% per year for established homeowners, creating significant tax disparities between long-term and recent buyers. New buyers face much higher property tax bills based on current purchase price.",
      irsOfficeCities: "Los Angeles, San Francisco, San Diego, Sacramento, Fresno",
      commonIssue: "California taxpayers face a dual-agency problem: IRS federal debt and California FTB state debt accumulate simultaneously and require separate resolution. The FTB has aggressive collection powers including bank levies, wage garnishments, and tax liens. Its offer-in-compromise program is separate from the IRS OIC program.",
      selfEmployedContext: "California's enormous freelance and gig economy — entertainment, technology, agriculture, construction — creates significant self-employment tax complexity. California's 13.3% top state rate means high earners face combined federal and state marginal rates above 50% in some cases, leading to significant tax debt when income spikes are not accompanied by proportional estimated payments.",
      localTaxContext: "Tech employees who received large RSU grants during peak valuations often find themselves with substantial California FTB bills when those grants vest during high-valuation years — particularly painful when stock prices subsequently declined. California taxes RSU income at the time of vesting regardless of subsequent stock performance.",
    },
  },

  "new-york": {
    name: "New York", abbreviation: "NY", slug: "new-york", largestCity: "New York City",
    debtRelief: {
      avgCreditCardDebt: "$8,100",
      delinquencyContext: "New York City residents carry an average credit card balance approaching $9,000 — significantly above the national average. New York City's extraordinary cost of living — where average rent for a one-bedroom apartment in Manhattan exceeds $4,000/month — makes credit card dependency almost structural for middle-income earners, even those with above-average salaries.",
      statuteOfLimitationsCC: 3,
      wageGarnishmentAllowed: true,
      wageGarnishmentNote: "New York limits wage garnishment to 10% of gross wages or 25% of disposable earnings above 30 times the federal minimum wage, whichever is less. This is more protective than the federal standard. New York also requires courts to consider the debtor's financial situation before issuing garnishment orders.",
      homesteadExemption: "New York's homestead exemption ranges from $75,000 to $150,000 depending on county — with higher exemptions in New York City and surrounding high-cost counties. This is modest by some standards but reflects the state legislature's recognition of the high cost of homeownership in the state.",
      uniqueProtection: "New York has some of the strongest debt collection consumer protections supplementing the federal FDCPA. Critically, New York has a 3-year statute of limitations on credit card debt — shorter than most states — which provides meaningful time protection for New Yorkers with older delinquent accounts.",
      localContext: "Upstate New York presents a very different financial picture from New York City. Buffalo, Rochester, and Syracuse face post-industrial economic challenges with lower average incomes and persistent unemployment in former manufacturing communities. Debt profiles in upstate cities often reflect job loss and medical debt rather than the cost-of-living-driven debt common in the city.",
      keyChallenge: "New York City's housing market is the defining challenge — 50%+ of income going to rent leaves almost no margin for savings or debt repayment. Even dual-income households earning $200,000+ in Manhattan often carry credit card balances because monthly expenses after rent and taxes leave little discretionary income.",
    },
    personalLoans: {
      usuryCap: "New York has a 16% civil usury cap for consumer loans, making it one of the most rate-restrictive states in the country. Many online lenders that charge above 16% do not operate in New York due to this cap. Federally chartered banks can preempt the state cap, so major banks and their affiliates can offer loans above 16%.",
      paydayNote: "New York effectively prohibits payday loans — the 16% civil usury cap makes traditional payday lending economically unviable. This protects New York residents from the worst of the payday loan debt trap but can limit access to small emergency loans for those with poor credit.",
      avgHouseholdIncome: "$75,000",
      lendingContext: "New York's 16% usury cap limits options for fair-credit and poor-credit borrowers, as many online lenders offering higher-rate products to subprime borrowers do not operate in New York. Credit unions and community banks fill some of this gap. For New York residents with poor credit, a nonprofit debt management plan is often more accessible than a personal loan.",
      localEconomy: "New York's economy is dominated by financial services, healthcare, real estate, education, and media. Income inequality is extreme — Wall Street compensation at the top creates substantial tax revenue, while the large service economy workforce struggles with some of the highest living costs in the country.",
      keyConsideration: "New York residents who cannot access a personal loan at a rate below their credit card APRs should consider a nonprofit debt management plan before exploring high-rate loan options. The 16% usury cap means the DMP route may deliver better financial outcomes than a personal loan for borrowers with fair or poor credit.",
    },
    taxRelief: {
      hasStateTax: true,
      stateTaxRate: "4–10.9% state; plus New York City residents pay an additional 3.078–3.876% city income tax",
      stateAgency: "New York State Department of Taxation and Finance (DTF)",
      stateAgencyUrl: "https://www.tax.ny.gov",
      propertyTaxNote: "New York has some of the highest property tax rates in the country, particularly in Nassau and Westchester counties. New York City's property tax system is complex and controversial, with significant disparities between property classes that have been the subject of ongoing reform discussions.",
      irsOfficeCities: "New York City (Manhattan), Brooklyn, Albany, Buffalo",
      commonIssue: "New York taxpayers face combined federal IRS and New York DTF obligations that can accumulate simultaneously. The DTF has aggressive collection tools including wage garnishment, bank levies, and tax warrants that function as judgments. New York City residents face a third layer — city income tax — that adds to the complexity.",
      selfEmployedContext: "New York has a large freelance and self-employed workforce in creative industries (media, fashion, art, entertainment), financial services, and technology. These workers face combined federal, state, and city self-employment tax obligations that can total 40–50% of net earnings — a shock to those transitioning from W-2 employment.",
      localTaxContext: "New York's financial services industry creates complex tax situations for high earners. Carried interest, deferred compensation, and partnership distributions create multi-year tax planning complexity that, when mismanaged, results in large unexpected bills. New York's aggressive audit posture for high-income filers adds further risk.",
    },
  },

  pennsylvania: {
    name: "Pennsylvania", abbreviation: "PA", slug: "pennsylvania", largestCity: "Philadelphia",
    debtRelief: {
      avgCreditCardDebt: "$6,100",
      delinquencyContext: "Pennsylvania presents two distinct debt profiles. Philadelphia — with one of the highest poverty rates of any major US city — has very high rates of debt in collections, driven by wage stagnation in a high-cost urban environment. The state's extensive rural and small-city populations face limited employment diversity and post-industrial income gaps. Both contexts create credit card debt pressure through different mechanisms.",
      statuteOfLimitationsCC: 4,
      wageGarnishmentAllowed: false,
      wageGarnishmentNote: "Pennsylvania prohibits wage garnishment for most consumer debt — one of only a handful of states with this protection, alongside Texas. Exceptions apply to child support, alimony, student loans, and tax debt, but credit card debt, medical bills, and personal loans cannot result in wage garnishment in Pennsylvania.",
      homesteadExemption: "Pennsylvania's homestead exemption is only $300 — one of the lowest in the country. However, the prohibition on wage garnishment for consumer debt provides significant practical protection that partially offsets the limited homestead exemption.",
      uniqueProtection: "Pennsylvania's wage garnishment prohibition for consumer debt is its defining consumer protection advantage. Like Texas residents, Pennsylvanians whose paychecks are protected can face debt collections with somewhat more financial stability — creditors who win judgments have fewer immediate enforcement tools against income.",
      localContext: "Philadelphia's financial stress is among the most severe of any major US city. The city has one of the highest poverty rates, highest rates of debt in collections, and highest rates of uninsured residents of any large American city. Pittsburgh's post-industrial transition has left persistent income gaps in surrounding communities.",
      keyChallenge: "Pennsylvania's economy has been transitioning from steel, coal, and manufacturing for decades. Wage growth has lagged in many regions, and communities dependent on declining industries face persistent financial stress that outpaces the available private-market debt relief solutions.",
    },
    personalLoans: {
      usuryCap: "Pennsylvania's interest rate regulations for consumer loans are moderate. Licensed lenders operate under the Consumer Discount Company Act and Loan Interest and Protection Law. Most traditional personal loans from reputable lenders fall within permissible ranges.",
      paydayNote: "Pennsylvania effectively prohibits traditional payday loans through its interest rate caps. Unlicensed internet payday lenders operating in Pennsylvania may be violating state law. Pennsylvania residents are protected from in-state payday lenders but should be cautious about online lenders claiming to operate outside state jurisdiction.",
      avgHouseholdIncome: "$64,000",
      lendingContext: "Pennsylvania has a traditional banking and credit union culture, particularly strong in community banking. Philadelphia has access to the full range of national lenders. The state's stable employment base and moderate income levels create a borrower profile that most mainstream lenders serve competitively.",
      localEconomy: "Pennsylvania's economy is anchored by healthcare, education, financial services, manufacturing, and agriculture. Pittsburgh has developed a technology and robotics sector. Philadelphia's economy is healthcare and education dominated. Income inequality between Philadelphia and rural Pennsylvania is significant.",
      keyConsideration: "Philadelphia residents considering personal loans for debt consolidation should be aware of the city's high cost of living relative to wages — often the root cause of the debt being consolidated. A realistic budget assessment of whether the consolidated payment is sustainable on local wages is essential before taking on a new loan.",
    },
    taxRelief: {
      hasStateTax: true,
      stateTaxRate: "3.07% flat rate (among the lowest flat state income tax rates in the country)",
      stateAgency: "Pennsylvania Department of Revenue",
      stateAgencyUrl: "https://www.revenue.pa.gov",
      propertyTaxNote: "Pennsylvania property taxes vary significantly by county and school district. Philadelphia's property tax system has faced long-standing equity concerns. Pennsylvania also has a Property Tax/Rent Rebate Program for seniors and those with disabilities.",
      irsOfficeCities: "Philadelphia, Pittsburgh",
      commonIssue: "Pennsylvania taxpayers face both IRS federal tax debt and Pennsylvania Department of Revenue state obligations. Philadelphia residents add a third layer — the city wage tax (one of the highest municipal wage taxes in the country at 3.75% for residents). Self-employed Philadelphians face federal, state, and city tax obligations simultaneously.",
      selfEmployedContext: "Pennsylvania has a large self-employed workforce in construction, healthcare (traveling nurses and therapists), professional services, and agriculture. Pennsylvania's unique local earned income tax system — administered by hundreds of local tax bureaus — adds complexity for self-employed residents who must track multiple jurisdictions.",
      localTaxContext: "Pennsylvania's local earned income tax system is one of the most complex in the country. Hundreds of municipalities levy their own earned income taxes, and self-employed individuals must make quarterly estimated payments to federal, state, and local jurisdictions separately — often without guidance from the payroll systems that handle this automatically for W-2 employees.",
    },
  },
};

// Internal links used on every state page
export const STATE_INTERNAL_LINKS = {
  services: [
    { href: "/debt-relief", label: "Debt Relief" },
    { href: "/debt-settlement", label: "Debt Settlement" },
    { href: "/debt-consolidation", label: "Debt Consolidation" },
    { href: "/personal-loans", label: "Personal Loans" },
    { href: "/tax-relief", label: "Tax Relief" },
  ],
  consumerRights: [
    { href: "/debt-validation", label: "Debt Validation" },
    { href: "/debt-validation-letter", label: "Debt Validation Letter" },
    { href: "/fdcpa-rights", label: "Your FDCPA Rights" },
    { href: "/collection-agency-rights", label: "Collection Agency Rights" },
  ],
  comparisons: [
    { href: "/debt-settlement-vs-bankruptcy", label: "Debt Settlement vs. Bankruptcy" },
    { href: "/debt-settlement-vs-debt-consolidation", label: "Settlement vs. Consolidation" },
    { href: "/debt-relief-vs-personal-loan", label: "Debt Relief vs. Personal Loan" },
  ],
};

export function getStateData(slug: string): StateData | null {
  return STATES[slug] ?? null;
}
