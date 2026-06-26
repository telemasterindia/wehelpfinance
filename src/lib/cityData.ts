// lib/cityData.ts
// City-level debt settlement data from COSTAR report analysis
// Add new cities here to scale

export type CityData = {
  slug: string;
  city: string;
  state: string;
  stateAbbr: string;
  metroArea: string;
  metroPop: string;
  avgDebtLow: number;
  avgDebtHigh: number;
  tier: 1 | 2;
  debtContext: string;
  localChallenges: string;
  economyNote: string;
  settlementNote: string;
  neighborhoods: string[];
  nearbyAreas: string[];
  statePageSlug: string;
};

export const CITIES: Record<string, CityData> = {

  "los-angeles": {
    slug: "los-angeles",
    city: "Los Angeles",
    state: "California",
    stateAbbr: "CA",
    metroArea: "Los Angeles-Long Beach-Anaheim",
    metroPop: "13.2 million",
    avgDebtLow: 9200,
    avgDebtHigh: 11400,
    tier: 1,
    debtContext: "Los Angeles is the single largest debt settlement market in the United States. LA County alone produces more viable debt settlement consumers than most entire states, driven by extraordinarily high housing costs that consume 50–60% of median household income for renters, forcing middle-income households to use credit cards to cover everyday expenses.",
    localChallenges: "The entertainment industry's boom-bust employment cycles, the gig economy's dominant role in LA's workforce, and the Inland Empire's working-class suburban sprawl create a diverse but consistently high-volume debt stress population. Many LA residents carry balances not from overspending but from using credit cards to bridge the gap between stagnant wages and one of the highest costs of living in the country.",
    economyNote: "Los Angeles's economy is driven by entertainment, technology, international trade, healthcare, and a massive service sector. Income inequality is extreme — the entertainment industry produces very high earners alongside a much larger population earning service-sector wages in an extraordinarily expensive city.",
    settlementNote: "California requires DFPI licensing for debt settlement buyers and all-party consent for call recording. The Rosenthal Fair Debt Collection Practices Act provides additional consumer protections beyond the federal FDCPA — original creditors must also follow fair collection practices in California.",
    neighborhoods: ["South Los Angeles", "East Los Angeles", "San Fernando Valley", "Inland Empire", "Long Beach", "Compton", "Inglewood", "Pomona", "Ontario", "Riverside"],
    nearbyAreas: ["Long Beach", "Pasadena", "Glendale", "Burbank", "Santa Ana", "Anaheim"],
    statePageSlug: "california",
  },

  "houston": {
    slug: "houston",
    city: "Houston",
    state: "Texas",
    stateAbbr: "TX",
    metroArea: "Houston-The Woodlands-Sugar Land",
    metroPop: "7.3 million",
    avgDebtLow: 8800,
    avgDebtHigh: 10600,
    tier: 1,
    debtContext: "Houston's energy-driven economy creates a distinctive debt cycle unlike any other major US city. When oil prices collapse — as they did in 2014–2016 and again in 2020 — thousands of energy workers, contractors, and their supplier ecosystem face sudden income disruption while carrying credit card debt accumulated during high-income periods. The recovery cycle that follows leaves many workers behind, particularly those in service roles supporting the energy industry.",
    localChallenges: "Houston has one of the most diverse demographic profiles of any US city, with large Hispanic, African American, and Asian American communities, each with distinct debt stress patterns. The Houston metro's massive geographic footprint — spanning Harris County and surrounding counties — creates a range of income profiles from inner-city working-class households to high-income suburban communities in The Woodlands and Sugar Land.",
    economyNote: "Houston's economy is anchored by energy, healthcare (the Texas Medical Center is the largest medical complex in the world), petrochemicals, logistics, and manufacturing. The energy industry's cyclical nature is the primary driver of debt stress events for Houston-area households.",
    settlementNote: "Texas is one of the most consumer-protective states for debt collection — wage garnishment for consumer debt is prohibited entirely, and the homestead exemption is unlimited. However, creditors can still levy bank accounts. Texas operates under one-party consent for call recording.",
    neighborhoods: ["East Houston", "Pasadena", "Baytown", "Stafford", "Missouri City", "Pearland", "Katy", "Spring", "The Woodlands", "Humble"],
    nearbyAreas: ["Pasadena", "Pearland", "Sugar Land", "The Woodlands", "Katy", "Baytown"],
    statePageSlug: "texas",
  },

  "new-york-city": {
    slug: "new-york-city",
    city: "New York City",
    state: "New York",
    stateAbbr: "NY",
    metroArea: "New York-Newark-Jersey City",
    metroPop: "8.3 million (city); 20+ million (metro)",
    avgDebtLow: 10400,
    avgDebtHigh: 13800,
    tier: 1,
    debtContext: "New York City produces the highest average confirmed debt per consumer of any US market. Outer borough residents — Bronx, Brooklyn, Queens, and Staten Island — routinely enroll in programs with $26,000–$38,000 in unsecured debt, significantly above national averages. Average rent for a one-bedroom apartment in Manhattan exceeds $4,000/month, creating structural debt accumulation for middle-income households even with above-average salaries.",
    localChallenges: "New York City presents two distinct debt profiles. The Manhattan paradox: very high incomes but extraordinarily high costs leave even six-figure earners with little financial cushion. The outer borough reality: residents earning $45,000–$75,000 face housing costs that consume 50–60% of income, making credit card dependency almost structural for working families. The city's enormous freelance and gig economy workforce faces combined federal, state, and city tax obligations that frequently exceed 40% of net earnings.",
    economyNote: "New York City's economy is driven by financial services, media, technology, healthcare, and the largest service sector of any US city. The income inequality is extreme — Wall Street compensation at the top of the market coexists with a massive service economy workforce struggling with some of the highest living costs in the world.",
    settlementNote: "New York has a 3-year statute of limitations on credit card debt — shorter than most states. The DSRA (Debt Settlement Services Act) requires debt settlement buyers to be specifically licensed in New York. All-party consent required for call recording. New York City adds a layer of city income tax on top of federal and state obligations.",
    neighborhoods: ["Bronx", "Brooklyn", "Queens", "Staten Island", "Washington Heights", "East New York", "Jamaica", "Flatbush", "Flushing", "South Bronx"],
    nearbyAreas: ["Yonkers", "Newark", "Jersey City", "Long Island City", "Hempstead", "White Plains"],
    statePageSlug: "new-york",
  },

  "dallas": {
    slug: "dallas",
    city: "Dallas",
    state: "Texas",
    stateAbbr: "TX",
    metroArea: "Dallas-Fort Worth-Arlington",
    metroPop: "7.8 million",
    avgDebtLow: 8800,
    avgDebtHigh: 10600,
    tier: 1,
    debtContext: "The Dallas-Fort Worth metroplex is one of the fastest-growing major metro areas in the United States, with population growth consistently outpacing wage growth in many sectors. The result is a rapidly expanding middle-income population carrying credit card debt not from lifestyle overspending but from the gap between rising housing costs and wages that have not kept pace. DFW's suburban sprawl creates long commutes and high transportation costs that add to the financial pressure on working families.",
    localChallenges: "DFW's economic diversity — logistics and warehousing (major employers include Amazon, FedEx, UPS), financial services (American Airlines, AT&T, Toyota headquarters), healthcare, and retail — creates a wide range of income levels and debt profiles. The working-class communities of South Dallas, Oak Cliff, and the eastern suburbs carry debt at higher rates relative to income than the more affluent northern suburbs of Plano, Frisco, and Allen.",
    economyNote: "Dallas-Fort Worth has one of the most diversified economies of any US major metro, anchored by technology, financial services, healthcare, logistics, and manufacturing. The region has attracted headquarters relocations from California and the Northeast, bringing high-income workers but also increasing housing costs for existing residents.",
    settlementNote: "Texas's consumer protections — no wage garnishment for consumer debt, unlimited homestead exemption — are significant advantages for Dallas-area consumers navigating debt collection. One-party consent simplifies compliance. The 4-year statute of limitations on credit card debt provides time protection for older accounts.",
    neighborhoods: ["South Dallas", "Oak Cliff", "Garland", "Mesquite", "Irving", "Grand Prairie", "Duncanville", "Lancaster", "Cedar Hill", "Balch Springs"],
    nearbyAreas: ["Fort Worth", "Arlington", "Plano", "Garland", "Irving", "Mesquite"],
    statePageSlug: "texas",
  },

  "chicago": {
    slug: "chicago",
    city: "Chicago",
    state: "Illinois",
    stateAbbr: "IL",
    metroArea: "Chicago-Naperville-Elgin",
    metroPop: "2.7 million (city); 9.5 million (metro)",
    avgDebtLow: 8200,
    avgDebtHigh: 10000,
    tier: 1,
    debtContext: "Chicago is one of the most economically stratified major US cities — multiple distinct consumer populations at different debt stress levels exist within a 30-mile radius. The South Side and West Side working-class communities carry high debt loads relative to income; the collar county suburbs (DuPage, Lake, Kane, Will, McHenry) produce high-volume, mid-to-high average debt consumers; and downtown Chicago's financial district creates a population of high earners who nonetheless carry significant credit card balances.",
    localChallenges: "Chicago's post-industrial economy has left significant employment gaps in communities that once relied on manufacturing. The city's high property taxes — among the highest in the Midwest — add financial pressure on homeowners. Illinois has some of the highest combined federal and state tax burdens for middle-income earners, reducing take-home pay relative to comparable income levels in other states.",
    economyNote: "Chicago's economy is anchored by financial services, manufacturing, logistics (O'Hare is one of the world's busiest airports), healthcare, and education. The city is a major hub for commodity trading and has a significant technology sector. Income inequality between the Loop's financial district and South and West Side communities is among the most extreme of any US city.",
    settlementNote: "Illinois requires licensing under the Illinois Debt Settlement Consumer Protection Act. All-party consent required for call recording. Illinois has a 5-year statute of limitations on credit card debt. Chicago's high property tax environment and elevated overall cost of living contribute to debt accumulation for middle-income households.",
    neighborhoods: ["South Side", "West Side", "Pilsen", "Logan Square", "Humboldt Park", "Austin", "Englewood", "Roseland", "Aurora", "Joliet"],
    nearbyAreas: ["Aurora", "Joliet", "Naperville", "Elgin", "Waukegan", "Cicero"],
    statePageSlug: "illinois",
  },

  "atlanta": {
    slug: "atlanta",
    city: "Atlanta",
    state: "Georgia",
    stateAbbr: "GA",
    metroArea: "Atlanta-Sandy Springs-Alpharetta",
    metroPop: "6.2 million",
    avgDebtLow: 8000,
    avgDebtHigh: 9800,
    tier: 1,
    debtContext: "Atlanta is the fastest-growing major Southern metro and one of the top 10 debt settlement markets in the country. The region's rapid population growth — driven by corporate relocations, a growing technology sector, and migration from higher-cost-of-living markets — has pushed housing costs significantly higher while wages for service, retail, and logistics workers have not kept pace. Gwinnett County has significant immigrant and first-generation American populations with high credit card utilization.",
    localChallenges: "Atlanta's traffic and sprawl create high transportation costs for workers who must commute long distances to reach employment centers. The city's large film and television production industry creates a significant population of creative and gig workers with variable income. The rapid gentrification of in-town neighborhoods has displaced lower-income residents to more distant suburbs, increasing commuting costs.",
    economyNote: "Atlanta's economy is driven by logistics and distribution (Hartsfield-Jackson is the world's busiest airport), financial services, technology, film production, healthcare, and corporate headquarters (Coca-Cola, Home Depot, Delta Air Lines, UPS). The region has attracted significant corporate relocations, creating high-income employment while also generating service economy demand.",
    settlementNote: "Georgia operates under one-party consent — the simplest recording compliance of any major debt settlement market. Georgia's debt settlement regulatory environment is favorable compared to California or New York. The 6-year statute of limitations on written contracts (including credit cards) is longer than many states.",
    neighborhoods: ["Fulton County", "DeKalb County", "Gwinnett County", "Clayton County", "Cobb County", "Stone Mountain", "Decatur", "Jonesboro", "Smyrna", "Marietta"],
    nearbyAreas: ["Marietta", "Sandy Springs", "Roswell", "Alpharetta", "Smyrna", "Decatur"],
    statePageSlug: "georgia",
  },

  "phoenix": {
    slug: "phoenix",
    city: "Phoenix",
    state: "Arizona",
    stateAbbr: "AZ",
    metroArea: "Phoenix-Mesa-Chandler",
    metroPop: "5.1 million",
    avgDebtLow: 8200,
    avgDebtHigh: 10400,
    tier: 1,
    debtContext: "Phoenix is a migration-driven market — large numbers of California, Illinois, and Midwest transplants carry debt from higher cost-of-living origin states. Average confirmed debt in Phoenix campaigns tends to run higher than the state average for this reason. The Phoenix metro has also experienced its own rapid housing cost inflation, with home prices and rents increasing significantly from 2020 through 2025, creating new debt stress among longer-term Arizona residents.",
    localChallenges: "Phoenix's economy is heavily tied to real estate and construction, which creates cyclical debt stress events when the housing market corrects. The extreme summer heat increases utility costs significantly — Phoenix residents pay some of the highest summer electricity bills in the country, adding to household financial pressure. Military presence (Luke Air Force Base, various training installations) requires SCRA screening for active duty service members.",
    economyNote: "Phoenix's economy is driven by semiconductor manufacturing (Intel, TSMC), financial services, real estate, healthcare, and tourism. The semiconductor industry expansion has created high-wage employment but has also accelerated housing cost inflation. The tourism and hospitality sector provides significant lower-wage employment with income volatility.",
    settlementNote: "Arizona operates under one-party consent and has a favorable regulatory environment for debt settlement. Arizona does NOT observe daylight saving time — the state stays on MST year-round, which is important for calling window calculations. The 6-year statute of limitations on credit card debt provides meaningful time protection.",
    neighborhoods: ["South Phoenix", "West Phoenix", "Mesa", "Chandler", "Gilbert", "Glendale", "Peoria", "Avondale", "Goodyear", "Surprise"],
    nearbyAreas: ["Mesa", "Chandler", "Gilbert", "Glendale", "Scottsdale", "Tempe"],
    statePageSlug: "arizona",
  },

  "philadelphia": {
    slug: "philadelphia",
    city: "Philadelphia",
    state: "Pennsylvania",
    stateAbbr: "PA",
    metroArea: "Philadelphia-Camden-Wilmington",
    metroPop: "1.6 million (city); 6.2 million (metro)",
    avgDebtLow: 7800,
    avgDebtHigh: 9600,
    tier: 1,
    debtContext: "Philadelphia has one of the highest poverty rates of any major US city, and one of the highest rates of debt in collections. The city's large healthcare and education workforce — anchored by major hospital systems and universities — provides stable but often below-market wages for support staff, creating persistent debt accumulation. The collar counties of Delaware, Montgomery, Bucks, and Chester Counties produce higher-income suburban consumers with larger average debt balances.",
    localChallenges: "Philadelphia's wage tax — one of the highest municipal wage taxes in the country at 3.75% for city residents — reduces take-home pay compared to surrounding suburbs. The city's wage stagnation, particularly in its large healthcare support and retail sectors, has not kept pace with rising housing and transportation costs. Northeast Philadelphia and South Philadelphia have high concentrations of working-class households with significant credit card debt.",
    economyNote: "Philadelphia's economy is anchored by healthcare (Jefferson, Penn Medicine, Temple Health, Children's Hospital), education (University of Pennsylvania, Temple, Drexel), financial services, logistics, and manufacturing. The city has strong institutions but faces persistent challenges with wage stagnation and poverty in many neighborhoods.",
    settlementNote: "Pennsylvania prohibits wage garnishment for most consumer debt — a significant protection alongside Texas. Pennsylvania DOR has a flat 3.07% state income tax rate. All-party consent required for call recording. The 4-year statute of limitations on credit card debt provides time protection for older accounts.",
    neighborhoods: ["Northeast Philadelphia", "South Philadelphia", "West Philadelphia", "Kensington", "Germantown", "Upper Darby", "Chester", "Norristown", "Levittown", "Camden NJ"],
    nearbyAreas: ["Upper Darby", "Chester", "Norristown", "Camden", "Wilmington", "Trenton"],
    statePageSlug: "pennsylvania",
  },

  "charlotte": {
    slug: "charlotte",
    city: "Charlotte",
    state: "North Carolina",
    stateAbbr: "NC",
    metroArea: "Charlotte-Concord-Gastonia",
    metroPop: "2.7 million",
    avgDebtLow: 7600,
    avgDebtHigh: 9200,
    tier: 1,
    debtContext: "Charlotte is the banking capital of the Southeast — home to Bank of America headquarters and a major Wells Fargo operations center — which creates an interesting paradox. Charlotte residents are highly familiar with financial products and credit, which means debt settlement is a more readily understood concept. The city's rapid growth has driven housing costs significantly higher while wages for the large service and logistics workforce have not kept pace.",
    localChallenges: "Charlotte's rapid population growth has created significant traffic congestion and longer commute times, increasing transportation costs. The city's large financial services sector creates a population of high-income earners, but the much larger service economy workforce earns significantly less while facing the same rising housing costs. The Research Triangle (Raleigh-Durham) draws tech talent away from Charlotte, leaving a more service-economy-oriented workforce.",
    economyNote: "Charlotte's economy is anchored by financial services (Bank of America, Wells Fargo, Truist), logistics, healthcare, and manufacturing. The city has significant Fortune 500 presence and has attracted corporate relocations. The financial services sector creates high-income employment, while the logistics and service sectors provide much more modest wages.",
    settlementNote: "North Carolina requires licensing under the NC Debt Settlement Act. One-party consent simplifies recording compliance. The 3-year statute of limitations on credit card debt is shorter than most states. Military presence at Fort Liberty (formerly Fort Bragg) requires SCRA screening for active duty service members in the broader metro area.",
    neighborhoods: ["South Charlotte", "East Charlotte", "North Charlotte", "Gastonia", "Concord", "Kannapolis", "Rock Hill SC", "Matthews", "Huntersville", "Mooresville"],
    nearbyAreas: ["Concord", "Gastonia", "Kannapolis", "Matthews", "Huntersville", "Rock Hill"],
    statePageSlug: "north-carolina",
  },

  "columbus": {
    slug: "columbus",
    city: "Columbus",
    state: "Ohio",
    stateAbbr: "OH",
    metroArea: "Columbus-Marion-Zanesville",
    metroPop: "2.1 million",
    avgDebtLow: 7400,
    avgDebtHigh: 9200,
    tier: 1,
    debtContext: "Columbus is the most stable and consistent debt settlement market in Ohio — unlike Cleveland and Akron, which experience sharper boom-bust cycles tied to manufacturing, Columbus's more diversified economy (state government, Ohio State University, financial services, retail) creates steadier year-round lead volume. The city has grown significantly over the past decade while housing costs have risen faster than wages for many residents.",
    localChallenges: "Columbus has a significant student loan burden given the presence of Ohio State University, though student debt is not settleable. The city's large retail and service sector workforce earns below-average wages relative to housing costs. The surrounding rural counties — while growing — have lower incomes and less employment diversity, creating debt stress from a different economic profile than the urban core.",
    economyNote: "Columbus's economy is anchored by state government, Ohio State University, financial services (Nationwide, JPMorgan Chase operations), retail and logistics (Victoria's Secret, Abercrombie & Fitch, Big Lots headquarters), and healthcare. The city has attracted data center investment from major technology companies. Its diversified economy creates more employment stability than Ohio's other major cities.",
    settlementNote: "Ohio requires licensing under the Ohio Debt Settlement Act. One-party consent for call recording. The 6-year statute of limitations on written contracts (credit cards) is among the longer timelines, providing time protection. Ohio's manufacturing economy creates cyclical debt stress that drives settlement demand across the state.",
    neighborhoods: ["South Columbus", "East Columbus", "Westerville", "Hilliard", "Dublin", "Reynoldsburg", "Grove City", "Gahanna", "Lancaster", "Newark"],
    nearbyAreas: ["Westerville", "Dublin", "Hilliard", "Grove City", "Gahanna", "Reynoldsburg"],
    statePageSlug: "ohio",
  },
};

// Illinois, Georgia, Arizona, North Carolina, Ohio stateData needed
// These states don't have full stateData.ts entries yet
// Adding minimal data needed for city pages
export const ADDITIONAL_STATE_INFO: Record<string, {
  statuteOfLimitationsCC: number;
  wageGarnishmentNote: string;
  homesteadNote: string;
}> = {
  illinois: {
    statuteOfLimitationsCC: 5,
    wageGarnishmentNote: "Illinois allows wage garnishment at 15% of gross wages or the amount by which disposable earnings exceed 45 times the federal minimum wage per week, whichever is less.",
    homesteadNote: "Illinois homestead exemption is $15,000 per individual or $30,000 for a married couple.",
  },
  georgia: {
    statuteOfLimitationsCC: 6,
    wageGarnishmentNote: "Georgia allows wage garnishment at 25% of disposable earnings or the amount exceeding 30 times federal minimum wage, whichever is less.",
    homesteadNote: "Georgia homestead exemption is $21,500 for individuals, $43,000 for married couples filing jointly in bankruptcy.",
  },
  arizona: {
    statuteOfLimitationsCC: 6,
    wageGarnishmentNote: "Arizona limits wage garnishment to 25% of disposable earnings or the amount exceeding 30 times the federal minimum wage, whichever is less.",
    homesteadNote: "Arizona homestead exemption is $400,000 for primary residence.",
  },
  "north-carolina": {
    statuteOfLimitationsCC: 3,
    wageGarnishmentNote: "North Carolina does NOT allow wage garnishment for consumer debt (credit cards, medical bills, personal loans) — one of only a few states with this protection. Exceptions apply to tax debt, student loans, and child support.",
    homesteadNote: "North Carolina homestead exemption is $35,000 or $60,000 for those 65+ years old who are married.",
  },
  ohio: {
    statuteOfLimitationsCC: 6,
    wageGarnishmentNote: "Ohio limits wage garnishment to 25% of disposable earnings or the amount exceeding 30 times the federal minimum wage per week, whichever is less.",
    homesteadNote: "Ohio homestead exemption is $136,925 for primary residence.",
  },
  pennsylvania: {
    statuteOfLimitationsCC: 4,
    wageGarnishmentNote: "Pennsylvania prohibits wage garnishment for most consumer debt — one of only a few states with this protection alongside Texas and North Carolina.",
    homesteadNote: "Pennsylvania homestead exemption is $300 — one of the lowest in the country.",
  },
};

export function getCityData(slug: string): CityData | null {
  return CITIES[slug] ?? null;
}

export const ALL_CITY_SLUGS = Object.keys(CITIES);

// For internal cross-linking on city pages
export const OTHER_CITIES = (currentSlug: string) =>
  Object.values(CITIES)
    .filter((c) => c.slug !== currentSlug)
    .map((c) => ({ href: `/debt-settlement/${c.slug}`, label: `${c.city}, ${c.stateAbbr}` }));
