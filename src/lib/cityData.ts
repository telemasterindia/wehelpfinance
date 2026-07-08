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

  "san-antonio": {
    slug: "san-antonio",
    city: "San Antonio",
    state: "Texas",
    stateAbbr: "TX",
    metroArea: "San Antonio-New Braunfels",
    metroPop: "2.7 million",
    avgDebtLow: 7900,
    avgDebtHigh: 9600,
    tier: 1,
    debtContext:
      "San Antonio is one of the fastest-growing metros in Texas, anchored by military, healthcare, and tourism employment rather than the higher-wage tech and energy sectors driving Austin, Dallas, and Houston. Household credit card debt sits slightly below the Texas metro average, but so does median household income, which keeps debt-to-income ratios elevated even at lower absolute balances.",
    localChallenges:
      "A large share of San Antonio's workforce is employed in hospitality, healthcare support, retail, and military-adjacent civilian roles - sectors with modest median wages and limited employer-sponsored financial benefits. Active-duty and veteran households tied to Joint Base San Antonio face their own debt pressures, including frequent relocation costs and predatory lending targeted at military ZIP codes near base perimeters. Rising property taxes and insurance costs in Bexar County have also compressed household budgets even where housing itself remains comparatively affordable.",
    economyNote:
      "San Antonio's economy centers on military installations (Joint Base San Antonio, one of the largest employers in South Texas), healthcare systems (Methodist Healthcare, University Health, Baptist Health System), tourism around the River Walk, and a growing cybersecurity and IT services cluster. USAA's headquarters presence has also built a substantial financial-services and insurance workforce.",
    settlementNote:
      "Because Texas prohibits wage garnishment for consumer debt and offers an unlimited homestead exemption, San Antonio residents carry structural protections that some settlement companies fail to explain accurately - creditors have fewer enforcement levers here than in most states, which affects negotiation dynamics.",
    neighborhoods: ["Alamo Heights", "Stone Oak", "Northwest Side", "Southtown", "Far West Side"],
    nearbyAreas: ["New Braunfels", "Schertz", "Converse", "Universal City"],
    statePageSlug: "texas",
  },

  "san-diego": {
    slug: "san-diego",
    city: "San Diego",
    state: "California",
    stateAbbr: "CA",
    metroArea: "San Diego-Chula Vista-Carlsbad",
    metroPop: "3.3 million",
    avgDebtLow: 9500,
    avgDebtHigh: 11800,
    tier: 1,
    debtContext:
      "San Diego combines one of the country's highest costs of living with a large active-duty and veteran population and a biotech and tourism-driven wage base that has not kept pace with housing costs. Credit card balances here run above the California average, and delinquency rates have climbed as San Diego households absorb some of the steepest rent and grocery inflation on the West Coast.",
    localChallenges:
      "San Diego's median home price and rent burden are among the highest in the nation, leaving even dual-income households with little slack for debt servicing. Military and veteran families connected to Naval Base San Diego and Marine Corps Base Camp Pendleton face frequent duty-station moves, PCS-related expenses, and predatory lending near base perimeters. The region's large hospitality, tourism, and service-sector workforce earns wages that lag badly behind local housing costs, a gap that shows up directly in unsecured debt balances.",
    economyNote:
      "San Diego's economy is built on biotech and life sciences (a top-three US cluster), the US Navy and Marine Corps presence, tourism, and a growing telecommunications and defense-tech sector anchored by companies like Qualcomm. UC San Diego and a dense research-hospital network add a large healthcare and academic employment base.",
    settlementNote:
      "California's wage garnishment cap (25% of disposable earnings, or the amount above 40 times the state minimum wage, whichever is less) and its expanded 2021 homestead exemption of $300,000-$600,000 give San Diego homeowners meaningfully stronger protection than residents of most other states - high local home values mean many San Diego homeowners qualify at or near the maximum exemption tier.",
    neighborhoods: ["North Park", "Chula Vista", "Clairemont", "City Heights", "Oceanside"],
    nearbyAreas: ["Chula Vista", "Oceanside", "Escondido", "Carlsbad"],
    statePageSlug: "california",
  },

  "san-jose": {
    slug: "san-jose",
    city: "San Jose",
    state: "California",
    stateAbbr: "CA",
    metroArea: "San Jose-Sunnyvale-Santa Clara",
    metroPop: "2.0 million",
    avgDebtLow: 10200,
    avgDebtHigh: 12600,
    tier: 1,
    debtContext:
      "San Jose sits at the center of Silicon Valley, and its debt profile reflects a stark income divide: high-earning tech employees alongside a large service, retail, and support workforce priced out of the same housing market they work in. Average unsecured debt balances in San Jose run above both the California and national averages, driven less by discretionary spending and more by one of the highest costs of living in the United States.",
    localChallenges:
      "San Jose has the highest median home price of any major US metro, and rents are proportionally severe. Households outside the tech-salary tier - administrative, hospitality, retail, and gig workers supporting Silicon Valley's core industries - routinely spend well over half of income on housing alone, leaving credit cards to absorb routine expenses. Even mid-career professionals in non-tech roles report carrying revolving balances simply to keep pace with the region's cost structure.",
    economyNote:
      "San Jose's economy is defined by its concentration of technology headquarters and engineering employment (Cisco, Adobe, PayPal, Zoom, and thousands of smaller firms), alongside Santa Clara County's semiconductor manufacturing legacy. The wage gap between tech and non-tech employment in the same metro is one of the widest in the country.",
    settlementNote:
      "As in the rest of California, San Jose residents benefit from the state's 25% wage garnishment cap and the 2021-expanded homestead exemption of $300,000-$600,000. Given San Jose's home values are consistently among the highest in the state, most San Jose homeowners qualify for the maximum $600,000 protection tier.",
    neighborhoods: ["Willow Glen", "Almaden Valley", "East San Jose", "Berryessa", "Cambrian Park"],
    nearbyAreas: ["Santa Clara", "Sunnyvale", "Milpitas", "Campbell"],
    statePageSlug: "california",
  },

  "austin": {
    slug: "austin",
    city: "Austin",
    state: "Texas",
    stateAbbr: "TX",
    metroArea: "Austin-Round Rock-Georgetown",
    metroPop: "2.4 million",
    avgDebtLow: 8600,
    avgDebtHigh: 10800,
    tier: 1,
    debtContext:
      "Austin's population and cost of living have both grown faster than almost any other major US metro over the past decade, and household debt has grown right alongside them. Credit card balances in Austin run above the Texas state average, driven less by discretionary spending and more by a housing market that has outpaced wage growth even for well-employed tech and service workers.",
    localChallenges:
      "Austin's home prices and rents rose dramatically as the metro absorbed rapid corporate relocation and population growth, and many long-time residents and service-sector workers have been priced out of neighborhoods they once afforded easily. The gap between Austin's high-profile tech salaries and the wages earned by the hospitality, education, healthcare support, and creative workers who make up much of the actual workforce is one of the widest of any Texas metro, and that gap shows up directly in revolving credit card balances used to cover routine cost-of-living increases.",
    economyNote:
      "Austin's economy centers on technology (Tesla's Gigafactory, Apple's second-largest campus, Oracle, and a dense startup ecosystem), state government as the Texas capital, and the University of Texas system. Live music, film, and event tourism (South by Southwest, ACL) add a large hospitality and gig-economy workforce.",
    settlementNote:
      "Texas's prohibition on wage garnishment for consumer debt and its unlimited homestead exemption apply fully in Austin and Travis County, giving residents stronger structural protection during a settlement negotiation than most other fast-growing metros in the country.",
    neighborhoods: ["East Austin", "South Austin", "Round Rock", "Pflugerville", "Cedar Park"],
    nearbyAreas: ["Round Rock", "Cedar Park", "Georgetown", "Pflugerville"],
    statePageSlug: "texas",
  },

  "jacksonville": {
    slug: "jacksonville",
    city: "Jacksonville",
    state: "Florida",
    stateAbbr: "FL",
    metroArea: "Jacksonville",
    metroPop: "1.7 million",
    avgDebtLow: 8100,
    avgDebtHigh: 10100,
    tier: 1,
    debtContext:
      "Jacksonville's economy is more banking, logistics, and military-driven than the tourism-heavy economies of Orlando or Miami, giving it a steadier but lower-wage-ceiling job base. Household credit card debt tracks close to the Florida state average, with insurance and healthcare costs - both elevated in Florida generally - a frequent contributor to households falling behind.",
    localChallenges:
      "Florida's rapidly rising homeowners' insurance premiums and property insurance costs have squeezed household budgets across the state, and Jacksonville - as the largest city by land area in the continental US - has a large base of homeowners exposed to that cost pressure. The region's sizable active-duty and veteran population connected to Naval Station Mayport and NAS Jacksonville also faces the financial strain of frequent relocation, and Jacksonville's logistics, distribution, and call-center employment base pays wages that often lag the state's rising cost of living.",
    economyNote:
      "Jacksonville is a major banking and financial services hub (Bank of America and Deutsche Bank both maintain large operations centers here), a logistics and port city (one of the largest deep-water ports on the US East Coast), and home to a substantial insurance industry alongside its military presence.",
    settlementNote:
      "Florida's head-of-household wage garnishment exemption - a rare and powerful protection unavailable in most states - can fully shield the wages of a Jacksonville resident who supports a dependent and earns $750 or less per week in net pay, provided the exemption is properly claimed. Florida's homestead exemption also protects a primary residence's value without a dollar cap, subject to acreage limits.",
    neighborhoods: ["Riverside", "San Marco", "Mandarin", "Arlington", "Southside"],
    nearbyAreas: ["Orange Park", "Atlantic Beach", "St. Augustine", "Fernandina Beach"],
    statePageSlug: "florida",
  },

  "fort-worth": {
    slug: "fort-worth",
    city: "Fort Worth",
    state: "Texas",
    stateAbbr: "TX",
    metroArea: "Dallas-Fort Worth-Arlington",
    metroPop: "8.2 million (DFW metro)",
    avgDebtLow: 8300,
    avgDebtHigh: 10200,
    tier: 1,
    debtContext:
      "Fort Worth shares the Dallas-Fort Worth metro's overall economic strength but has a distinctly more blue-collar, manufacturing- and aviation-heavy wage base than Dallas proper. Average credit card debt tracks close to the broader DFW average, but Fort Worth households are more likely to be carrying debt tied to hourly or shift-based income than the finance and corporate-headquarters salaries common on the Dallas side of the metro.",
    localChallenges:
      "Fort Worth's cost of living has risen alongside the rest of DFW even though wage growth in its manufacturing, logistics, and aviation-support sectors has been slower than in Dallas's white-collar corporate sector. Rising property taxes and insurance costs across Tarrant County have added pressure even for homeowners with paid-off or low-balance mortgages, and many Fort Worth households carry medical and credit card debt from gaps in employer-sponsored coverage in hourly-wage industries.",
    economyNote:
      "Fort Worth's economy is anchored by aviation and aerospace manufacturing (Lockheed Martin's F-35 production facility, Bell Textron, and American Airlines' large presence near DFW Airport), along with a historic stockyards and logistics industry, and a growing healthcare and higher-education sector.",
    settlementNote:
      "As part of Texas, Fort Worth residents carry the same no-wage-garnishment and unlimited-homestead protections available statewide - protections that matter in practice for Fort Worth's larger share of hourly and shift-based workers, since garnishment risk to take-home pay is removed entirely for consumer debt.",
    neighborhoods: ["Near Southside", "TCU/West Cliff", "Arlington Heights", "Stockyards", "Eastside"],
    nearbyAreas: ["Arlington", "Grapevine", "North Richland Hills", "Burleson"],
    statePageSlug: "texas",
  },

  "indianapolis": {
    slug: "indianapolis",
    city: "Indianapolis",
    state: "Indiana",
    stateAbbr: "IN",
    metroArea: "Indianapolis-Carmel-Anderson",
    metroPop: "2.1 million",
    avgDebtLow: 7600,
    avgDebtHigh: 9400,
    tier: 1,
    debtContext:
      "Indianapolis carries a lower cost of living than most large Midwest metros, but wages in its dominant logistics and distribution sector are correspondingly modest, and Indiana's relatively weak state-level debtor protections mean households here have less structural cushion than residents of states like Texas or Florida when debt becomes unmanageable.",
    localChallenges:
      "Indianapolis's position as a national logistics and distribution hub has created substantial warehouse and shift-based employment, work that often comes with variable hours and limited benefits. Indiana's homestead exemption is among the lowest in the country, meaning Indianapolis homeowners have comparatively little equity protection if a creditor obtains a judgment, which makes proactive debt resolution - before a lawsuit and judgment stage - especially important here relative to more consumer-protective states.",
    economyNote:
      "Indianapolis's economy is built on logistics and distribution (its central US location and FedEx's second-largest hub make it a national shipping crossroads), pharmaceuticals (Eli Lilly is headquartered here), motorsports (home of the Indianapolis 500), and a large insurance and healthcare-services sector.",
    settlementNote:
      "Indiana follows the standard federal wage garnishment cap of 25% of disposable earnings, with no special state-level enhancement, and its homestead exemption is modest by national standards. This makes negotiating a resolution before a creditor secures a judgment more consequential for Indianapolis homeowners than for residents of states with stronger asset protections.",
    neighborhoods: ["Broad Ripple", "Fountain Square", "Irvington", "Speedway", "Castleton"],
    nearbyAreas: ["Carmel", "Fishers", "Greenwood", "Avon"],
    statePageSlug: "indiana",
  },

  "seattle": {
    slug: "seattle",
    city: "Seattle",
    state: "Washington",
    stateAbbr: "WA",
    metroArea: "Seattle-Tacoma-Bellevue",
    metroPop: "4.0 million",
    avgDebtLow: 9700,
    avgDebtHigh: 12100,
    tier: 1,
    debtContext:
      "Seattle combines a high concentration of high-paying tech employment with one of the highest costs of living in the country, and - as in San Jose - the gap between tech-sector wages and everyone else's wages is a primary driver of credit card debt for non-tech households. Seattle also has no state income tax, which raises take-home pay somewhat but does not offset King County's housing costs.",
    localChallenges:
      "King County's median home price is among the highest in the nation, and rents in Seattle proper have followed a similar trajectory. Retail, hospitality, healthcare support, and other service-sector workers - a large share of the metro's actual employment - routinely face a housing cost burden that consumes the majority of take-home pay, leaving credit cards to absorb ordinary living expenses. Seattle's tech sector has also seen significant layoff cycles in recent years, and a sudden income drop after committing to Seattle-level housing costs is a common path into unsecured debt hardship.",
    economyNote:
      "Seattle's economy is anchored by technology (Amazon's headquarters, Microsoft in nearby Redmond, and a dense concentration of tech employers), aerospace (Boeing's Puget Sound manufacturing operations), and a globally known coffee and retail sector headquartered in the city.",
    settlementNote:
      "Washington protects the greater of 75% of disposable earnings or 35 times the federal minimum wage from garnishment - a stronger baseline than the plain federal standard - and its homestead exemption is the greater of $125,000 or the prior year's county median home sale price, which in King County has meant protection well above $900,000 given local home values.",
    neighborhoods: ["Capitol Hill", "Ballard", "West Seattle", "Rainier Valley", "Northgate"],
    nearbyAreas: ["Bellevue", "Tacoma", "Everett", "Renton"],
    statePageSlug: "washington",
  },

  "denver": {
    slug: "denver",
    city: "Denver",
    state: "Colorado",
    stateAbbr: "CO",
    metroArea: "Denver-Aurora-Lakewood",
    metroPop: "3.0 million",
    avgDebtLow: 8900,
    avgDebtHigh: 11000,
    tier: 1,
    debtContext:
      "Denver's population and housing costs have grown quickly over the past decade as the metro attracted young professionals and remote workers, and household credit card debt has risen in step. Denver's average balances run above the national average, reflecting a cost-of-living increase that has outpaced wage growth for large parts of the workforce, particularly in hospitality, retail, and outdoor-recreation-adjacent industries.",
    localChallenges:
      "Denver's rapid population growth pushed home prices and rents up sharply, and while the pace of increase has moderated, the cumulative effect has left many households - especially those who bought or signed leases near the peak - carrying housing costs that strain monthly budgets. Colorado's cost of living outside the immediate Denver core (health insurance, childcare, and property taxes) has also climbed, adding pressure that shows up in revolving debt for households without significant savings cushions.",
    economyNote:
      "Denver's economy spans aerospace and defense (a significant concentration of aerospace employers along the Front Range), energy, healthcare, and a large outdoor recreation and tourism-adjacent business sector, alongside a growing technology and startup presence drawn by the region's quality of life.",
    settlementNote:
      "Colorado's 2022 homestead exemption expansion - now $250,000, or $350,000 for homeowners 60 or older or disabled - gives Denver homeowners substantially more equity protection than they had before the law changed, a meaningful shift given how much Denver home values have risen. Colorado also caps wage garnishment below the federal standard, tied to the state's minimum wage.",
    neighborhoods: ["Highlands", "Capitol Hill", "Five Points", "Washington Park", "Stapleton/Central Park"],
    nearbyAreas: ["Aurora", "Lakewood", "Arvada", "Westminster"],
    statePageSlug: "colorado",
  },

  "boston": {
    slug: "boston",
    city: "Boston",
    state: "Massachusetts",
    stateAbbr: "MA",
    metroArea: "Boston-Cambridge-Newton",
    metroPop: "4.9 million",
    avgDebtLow: 9400,
    avgDebtHigh: 11700,
    tier: 1,
    debtContext:
      "Boston's household debt profile is shaped by two forces found together in few other US cities: one of the highest costs of living in the country, and one of the highest concentrations of student loan debt, given the region's enormous higher-education presence. Credit card debt often functions as a release valve for households already stretched by rent, healthcare costs, and student loan payments.",
    localChallenges:
      "Greater Boston's housing costs are among the steepest in the nation, and the region's density of colleges and universities means a large share of young professionals carry substantial student debt alongside ordinary living expenses - a combination that frequently pushes credit card balances higher even for well-employed households. Massachusetts's high cost of healthcare and childcare adds further pressure, particularly for single-income households and recent graduates just starting careers in a market where rent alone can consume half of take-home pay.",
    economyNote:
      "Boston's economy centers on healthcare and biotechnology (a globally significant life-sciences cluster centered on Kendall Square and the Longwood Medical Area), higher education (dozens of colleges and universities across the metro), and financial services, including a substantial asset management and mutual fund industry.",
    settlementNote:
      "Massachusetts protects 85% of a resident's disposable earnings from garnishment - only the amount above roughly $750 a week can be garnished, and even then just 15% of the excess - one of the strongest wage protections in the country. Its $500,000 homestead exemption (rising to $1 million for those 62 or older or disabled) also gives Boston homeowners substantial equity protection given the region's high home values.",
    neighborhoods: ["Dorchester", "Jamaica Plain", "Allston", "East Boston", "Roxbury"],
    nearbyAreas: ["Cambridge", "Somerville", "Quincy", "Brookline"],
    statePageSlug: "massachusetts",
  },

  "washington": {
    slug: "washington",
    city: "Washington",
    state: "District of Columbia",
    stateAbbr: "DC",
    metroArea: "Washington-Arlington-Alexandria",
    metroPop: "6.3 million",
    avgDebtLow: 9100,
    avgDebtHigh: 11300,
    tier: 1,
    debtContext:
      "Washington, D.C. combines a high average income with one of the highest costs of living in the country, and its economy is unusually exposed to a debt driver few other cities share: federal government funding lapses. Credit card debt in the District often traces back to a specific income disruption - a furlough, a delayed paycheck during a shutdown, or a federal contract that lost funding - layered on top of already-high fixed housing costs.",
    localChallenges:
      "A significant share of D.C.'s workforce is employed directly by the federal government or by contractors, nonprofits, and associations whose funding depends on federal budgets and contracts. Government shutdowns and continuing-resolution funding gaps have repeatedly put real, if temporary, strain on household cash flow across the District, and even short delays in pay can push a household that was current on its bills into revolving credit card debt used to bridge the gap. D.C.'s housing costs - among the highest of any major US city - leave little margin for these disruptions.",
    economyNote:
      "Washington, D.C.'s economy centers on the federal government (the single largest employer in the metro), a dense ecosystem of government contractors, law firms, lobbying and advocacy organizations, and national nonprofit and association headquarters, alongside a growing technology and biotech sector in the surrounding region.",
    settlementNote:
      "The District of Columbia is not a state, so it does not have a state homestead law or state wage garnishment statute - it has its own D.C. Code provisions, and they diverge from most states in a consumer-favorable way: a notably short 3-year statute of limitations on consumer debt, and a homestead exemption with no dollar cap on a primary residence's value.",
    neighborhoods: ["Capitol Hill", "Petworth", "Anacostia", "Columbia Heights", "Brookland"],
    nearbyAreas: ["Arlington, VA", "Alexandria, VA", "Silver Spring, MD", "Bethesda, MD"],
    statePageSlug: "district-of-columbia",
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
