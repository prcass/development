#!/usr/bin/env node
/**
 * Complete Wikipedia Rankings Extractor
 * Extracts ALL ranking categories from the comprehensive Wikipedia list
 */

const https = require('https');
const fs = require('fs');

// Complete list of ALL Wikipedia ranking categories
const ALL_WIKIPEDIA_RANKINGS = {
    // Agriculture - Production (27 categories)
    appleProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_apple_production', category: 'Agriculture' },
    apricotProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_apricot_production', category: 'Agriculture' },
    articholeProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_artichoke_production', category: 'Agriculture' },
    avocadoProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_avocado_production', category: 'Agriculture' },
    barleyProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_barley_production', category: 'Agriculture' },
    cerealProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_cereal_production', category: 'Agriculture' },
    cherryProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_cherry_production', category: 'Agriculture' },
    coconutProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_coconut_production', category: 'Agriculture' },
    coffeeProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_coffee_production', category: 'Agriculture' },
    cornProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_corn_production', category: 'Agriculture' },
    cucumberProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_cucumber_production', category: 'Agriculture' },
    eggplantProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_eggplant_production', category: 'Agriculture' },
    fruitProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_fruit_production', category: 'Agriculture' },
    garlicProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_garlic_production', category: 'Agriculture' },
    grapeProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_grape_production', category: 'Agriculture' },
    papayaProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_papaya_production', category: 'Agriculture' },
    pearProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_pear_production', category: 'Agriculture' },
    pineappleProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_pineapple_production', category: 'Agriculture' },
    plumProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_plum_production', category: 'Agriculture' },
    potatoProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_potato_production', category: 'Agriculture' },
    riceProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_rice_production', category: 'Agriculture' },
    soybeanProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_soybean_production', category: 'Agriculture' },
    tomatoProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_tomato_production', category: 'Agriculture' },
    vegetableProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_vegetable_production', category: 'Agriculture' },
    wheatProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_wheat_production', category: 'Agriculture' },
    wineProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_wine_production', category: 'Agriculture' },
    forestArea: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_forest_area', category: 'Agriculture' },
    irrigatedLand: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_irrigated_land_area', category: 'Agriculture' },

    // Agriculture - Consumption (9 categories)
    meatConsumption: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_meat_consumption', category: 'Agriculture' },
    seafoodConsumption: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_seafood_consumption', category: 'Agriculture' },
    milkConsumption: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_milk_consumption', category: 'Agriculture' },
    beerConsumption: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_beer_consumption_per_capita', category: 'Agriculture' },
    electricityConsumption: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_electricity_consumption', category: 'Agriculture' },
    oilConsumption: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_oil_consumption', category: 'Agriculture' },
    naturalGasConsumption: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_natural_gas_consumption', category: 'Agriculture' },
    cannabisConsumption: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_cannabis_use', category: 'Agriculture' },
    cocaineConsumption: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_cocaine_usage', category: 'Agriculture' },

    // Culture (4 categories)
    academyAwards: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_number_of_Academy_Awards_for_Best_International_Feature_Film', category: 'Culture' },
    worldHeritageSites: { url: 'https://en.wikipedia.org/wiki/List_of_World_Heritage_Sites_by_country', category: 'Culture' },
    booksPublished: { url: 'https://en.wikipedia.org/wiki/Books_published_per_country_per_year', category: 'Culture' },
    powerDistance: { url: 'https://en.wikipedia.org/wiki/Power_distance', category: 'Culture' },

    // Economy - Indices (8 categories)
    globalCompetitiveness: { url: 'https://en.wikipedia.org/wiki/Global_Competitiveness_Report', category: 'Economy' },
    financialDevelopment: { url: 'https://en.wikipedia.org/wiki/Financial_Development_Index', category: 'Economy' },
    worldCompetitiveness: { url: 'https://en.wikipedia.org/wiki/World_Competitiveness_Yearbook', category: 'Economy' },
    giniIndex: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_income_equality', category: 'Economy' },
    bloombergInnovation: { url: 'https://en.wikipedia.org/wiki/Bloomberg_Innovation_Index', category: 'Economy' },
    globalInnovation: { url: 'https://en.wikipedia.org/wiki/Global_Innovation_Index', category: 'Economy' },
    economicFreedom: { url: 'https://en.wikipedia.org/wiki/Index_of_Economic_Freedom', category: 'Economy' },
    easeDoingBusiness: { url: 'https://en.wikipedia.org/wiki/Ease_of_doing_business_index', category: 'Economy' },
    corruptionIndex: { url: 'https://en.wikipedia.org/wiki/Corruption_Perceptions_Index', category: 'Economy' },

    // Economy - Lists (15 categories)
    economicComplexity: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_economic_complexity', category: 'Economy' },
    externalDebt: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_external_debt', category: 'Economy' },
    unemployment: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_unemployment_rate', category: 'Economy' },
    investmentPosition: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_net_international_investment_position_per_capita', category: 'Economy' },
    averageWage: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_average_wage', category: 'Economy' },
    minimumWage: { url: 'https://en.wikipedia.org/wiki/List_of_minimum_wages_by_country', category: 'Economy' },
    publicDebt: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_public_debt', category: 'Economy' },
    wealthPerAdult: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_wealth_per_adult', category: 'Economy' },
    creditRating: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_credit_rating', category: 'Economy' },
    governmentBudget: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_government_budget', category: 'Economy' },

    // Economy - GDP (10 categories)
    gniPPP: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GNI_(PPP)_per_capita', category: 'Economy' },
    gniNominal: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GNI_(nominal,_Atlas_method)_per_capita', category: 'Economy' },
    gdpSectorComposition: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_sector_composition', category: 'Economy' },
    gdpNominal: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)', category: 'Economy' },
    gdpNominalPerCapita: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)_per_capita', category: 'Economy' },
    gdpPPPPerCapita: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(PPP)_per_capita', category: 'Economy' },
    gdpPPP: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(PPP)', category: 'Economy' },
    gdpGrowthRate: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_real_GDP_growth_rate', category: 'Economy' },
    taxRevenue: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_tax_revenue_to_GDP_ratio', category: 'Economy' },
    historicalGDP: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_largest_historical_GDP', category: 'Economy' },

    // Education (12 categories)
    educationSpending: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_spending_on_education_(%25_of_GDP)', category: 'Education' },
    tertiaryEducation: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_tertiary_education_attainment', category: 'Education' },
    socialMobility: { url: 'https://en.wikipedia.org/wiki/Global_Social_Mobility_Index', category: 'Education' },
    educationIndex: { url: 'https://en.wikipedia.org/wiki/Education_Index', category: 'Education' },
    timss: { url: 'https://en.wikipedia.org/wiki/Trends_in_International_Mathematics_and_Science_Study', category: 'Education' },
    pisa: { url: 'https://en.wikipedia.org/wiki/Programme_for_International_Student_Assessment', category: 'Education' },
    pirls: { url: 'https://en.wikipedia.org/wiki/Progress_in_International_Reading_Literacy_Study', category: 'Education' },
    literacyRate: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_literacy_rate', category: 'Education' },
    intellectualProperty: { url: 'https://en.wikipedia.org/wiki/World_Intellectual_Property_Indicators', category: 'Education' },
    secondaryEducation: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_secondary_education_attainment', category: 'Education' },
    englishProficiency: { url: 'https://en.wikipedia.org/wiki/EF_English_Proficiency_Index', category: 'Education' },
    nobelLaureates: { url: 'https://en.wikipedia.org/wiki/List_of_Nobel_laureates_by_country', category: 'Education' },

    // Environment (12 categories)
    airPollution: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_air_pollution', category: 'Environment' },
    naturalDisasterRisk: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_natural_disaster_risk', category: 'Environment' },
    climatePerformance: { url: 'https://en.wikipedia.org/wiki/Climate_Change_Performance_Index', category: 'Environment' },
    environmentalPerformance: { url: 'https://en.wikipedia.org/wiki/Environmental_Performance_Index', category: 'Environment' },
    environmentalSustainability: { url: 'https://en.wikipedia.org/wiki/Environmental_Sustainability_Index', category: 'Environment' },
    environmentalVulnerability: { url: 'https://en.wikipedia.org/wiki/Environmental_Vulnerability_Index', category: 'Environment' },
    happyPlanet: { url: 'https://en.wikipedia.org/wiki/Happy_Planet_Index', category: 'Environment' },
    ecologicalFootprint: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_ecological_footprint', category: 'Environment' },
    sustainableSociety: { url: 'https://en.wikipedia.org/wiki/Sustainable_Society_Index', category: 'Environment' },
    global100: { url: 'https://en.wikipedia.org/wiki/Global_100', category: 'Environment' },
    freshwaterWithdrawal: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_freshwater_withdrawal', category: 'Environment' },
    co2EmissionsPerCapita: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_carbon_dioxide_emissions_per_capita', category: 'Environment' },
    co2Emissions: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_carbon_dioxide_emissions', category: 'Environment' },

    // Exports (20 categories)
    netExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_net_exports', category: 'Exports' },
    exportsPerCapita: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_exports_per_capita', category: 'Exports' },
    aluminiumExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_aluminium_exports', category: 'Exports' },
    merchandiseExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_merchandise_exports', category: 'Exports' },
    serviceExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_service_exports_and_imports', category: 'Exports' },
    naturalGasExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_natural_gas_exports', category: 'Exports' },
    netOilExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_net_oil_exports', category: 'Exports' },
    oilExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_oil_exports', category: 'Exports' },
    petroleumExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_refined_petroleum_exports', category: 'Exports' },
    goldExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_gold_exports', category: 'Exports' },
    copperExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_copper_exports', category: 'Exports' },
    ironOreExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_iron_ore_exports', category: 'Exports' },
    diamondExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_diamond_exports', category: 'Exports' },
    electricityExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_electricity_exports', category: 'Exports' },
    truckExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_truck_exports', category: 'Exports' },
    shipExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_ship_exports', category: 'Exports' },
    aircraftExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_aircraft_and_spacecraft_exports', category: 'Exports' },
    computerExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_computer_exports', category: 'Exports' },
    pharmaceuticalExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_pharmaceutical_exports', category: 'Exports' },
    maizeExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_maize_exports', category: 'Exports' },

    // General (5 categories)
    goodCountry: { url: 'https://en.wikipedia.org/wiki/Good_Country_Index', category: 'General' },
    linguisticDiversity: { url: 'https://en.wikipedia.org/wiki/Linguistic_diversity_index', category: 'General' },
    softPower: { url: 'https://en.wikipedia.org/wiki/Soft_Power_30', category: 'General' },
    countryBrand: { url: 'https://en.wikipedia.org/wiki/Country_Brand_Index', category: 'General' },
    passportIndex: { url: 'https://en.wikipedia.org/wiki/Henley_Passport_Index', category: 'General' },

    // Geography (2 categories)
    area: { url: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_area', category: 'Geography' },
    population: { url: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population', category: 'Geography' },
    populationDensity: { url: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population_density', category: 'Geography' },

    // Health (15 categories)
    healthInsurance: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_health_insurance_coverage', category: 'Health' },
    healthcareQuality: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_quality_of_healthcare', category: 'Health' },
    healthExpenditure: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_health_expenditure_covered_by_government', category: 'Health' },
    hospitalBeds: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_hospital_beds', category: 'Health' },
    cancerRate: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_cancer_rate', category: 'Health' },
    nonCommunicableDiseaseRisk: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_risk_of_death_from_non_communicable_disease', category: 'Health' },
    hungerIndex: { url: 'https://en.wikipedia.org/wiki/Global_Hunger_Index', category: 'Health' },
    lifeExpectancy: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_life_expectancy', category: 'Health' },
    infantMortality: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_infant_mortality_rate', category: 'Health' },
    averageHeight: { url: 'https://en.wikipedia.org/wiki/List_of_average_human_height_worldwide', category: 'Health' },
    bodyMassIndex: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_body_mass_index', category: 'Health' },
    obesityRate: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_obesity_rate', category: 'Health' },
    hivPrevalence: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_HIV/AIDS_adult_prevalence_rate', category: 'Health' },
    tobaccoConsumption: { url: 'https://en.wikipedia.org/wiki/Prevalence_of_tobacco_consumption', category: 'Health' },
    cigaretteConsumption: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_cigarette_consumption_per_capita', category: 'Health' },
    alcoholConsumption: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_alcohol_consumption_per_capita', category: 'Health' },
    suicideRate: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_suicide_rate', category: 'Health' },

    // Industry (25 categories)
    electricityProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_electricity_production', category: 'Industry' },
    renewableElectricity: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_electricity_production_from_renewable_sources', category: 'Industry' },
    uraniumProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_uranium_production', category: 'Industry' },
    platinumProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_platinum_production', category: 'Industry' },
    goldProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_gold_production', category: 'Industry' },
    silverProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_silver_production', category: 'Industry' },
    nickelProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_nickel_production', category: 'Industry' },
    copperProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_copper_production', category: 'Industry' },
    steelProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_steel_production', category: 'Industry' },
    aluminiumProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_aluminium_production', category: 'Industry' },
    lithiumProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_lithium_production', category: 'Industry' },
    palladiumProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_palladium_production', category: 'Industry' },
    manganeseProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_manganese_production', category: 'Industry' },
    magnesiumProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_magnesium_production', category: 'Industry' },
    tinProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_tin_production', category: 'Industry' },
    zincProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_zinc_production', category: 'Industry' },
    saltProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_salt_production', category: 'Industry' },
    siliconProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_silicon_production', category: 'Industry' },
    oilProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_oil_production', category: 'Industry' },
    naturalGasProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_natural_gas_production', category: 'Industry' },
    coalProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_coal_production', category: 'Industry' },
    bauxiteProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_bauxite_production', category: 'Industry' },
    cementProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_cement_production', category: 'Industry' },

    // Military (5 categories)
    aircraftCarriers: { url: 'https://en.wikipedia.org/wiki/List_of_aircraft_carriers_by_country', category: 'Military' },
    firearmsHolding: { url: 'https://en.wikipedia.org/wiki/Estimated_number_of_civilian_guns_per_capita_by_country', category: 'Military' },
    militaryExpenditure: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_military_expenditures', category: 'Military' },
    militaryExpenditurePerCapita: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_military_expenditures_per_capita', category: 'Military' },
    militaryPersonnel: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_number_of_military_and_paramilitary_personnel', category: 'Military' },

    // Politics (12 categories)
    eGovernment: { url: 'https://en.wikipedia.org/wiki/UN_e-Government_Survey', category: 'Politics' },
    democracyIndex: { url: 'https://en.wikipedia.org/wiki/Democracy_Index', category: 'Politics' },
    freedomIndex: { url: 'https://en.wikipedia.org/wiki/Freedom_in_the_World', category: 'Politics' },
    pressFreedom: { url: 'https://en.wikipedia.org/wiki/Press_Freedom_Index', category: 'Politics' },
    ruleOfLaw: { url: 'https://en.wikipedia.org/wiki/World_Justice_Project_Rule_of_Law_Index', category: 'Politics' },
    globalTerrorism: { url: 'https://en.wikipedia.org/wiki/Global_Terrorism_Index', category: 'Politics' },
    governance: { url: 'https://en.wikipedia.org/wiki/Worldwide_Governance_Indicators', category: 'Politics' },
    fragileStates: { url: 'https://en.wikipedia.org/wiki/Fragile_States_Index', category: 'Politics' },
    presidentialism: { url: 'https://en.wikipedia.org/wiki/Presidentialism_index', category: 'Politics' },
    directVote: { url: 'https://en.wikipedia.org/wiki/Citizen-initiated_component_of_direct_popular_vote_index', category: 'Politics' },
    polityData: { url: 'https://en.wikipedia.org/wiki/Polity_data_series', category: 'Politics' },
    democracyRanking: { url: 'https://en.wikipedia.org/wiki/Democracy_Ranking', category: 'Politics' },

    // Reserves (6 categories)
    coalReserves: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_coal_reserves', category: 'Reserves' },
    naturalGasReserves: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_natural_gas_proven_reserves', category: 'Reserves' },
    oilReserves: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_proven_oil_reserves', category: 'Reserves' },
    thoriumReserves: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_thorium_reserves', category: 'Reserves' },
    uraniumReserves: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_uranium_reserves', category: 'Reserves' },
    foreignExchangeReserves: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_foreign-exchange_reserves', category: 'Reserves' },

    // Society (20 categories)
    populationTotal: { url: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population', category: 'Society' },
    gunOwnership: { url: 'https://en.wikipedia.org/wiki/Estimated_number_of_civilian_guns_per_capita_by_country', category: 'Society' },
    homelessPopulation: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_homeless_population', category: 'Society' },
    incarcerationRate: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_incarceration_rate', category: 'Society' },
    homicideRate: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_intentional_homicide_rate', category: 'Society' },
    ethnicDiversity: { url: 'https://en.wikipedia.org/wiki/List_of_countries_ranked_by_ethnic_and_cultural_diversity_level', category: 'Society' },
    whereToBeborn: { url: 'https://en.wikipedia.org/wiki/Where-to-be-born_Index', category: 'Society' },
    genderDevelopment: { url: 'https://en.wikipedia.org/wiki/Gender_Development_Index', category: 'Society' },
    genderGap: { url: 'https://en.wikipedia.org/wiki/Global_Gender_Gap_Report', category: 'Society' },
    organizedCrime: { url: 'https://en.wikipedia.org/wiki/Global_Organized_Crime_Index', category: 'Society' },
    retirementIndex: { url: 'https://en.wikipedia.org/wiki/Global_Retirement_Index', category: 'Society' },
    prosperityIndex: { url: 'https://en.wikipedia.org/wiki/Legatum_Prosperity_Index', category: 'Society' },
    socialProgress: { url: 'https://en.wikipedia.org/wiki/Social_Progress_Index', category: 'Society' },
    urbanization: { url: 'https://en.wikipedia.org/wiki/Urbanization_by_country', category: 'Society' },
    hdi: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_Human_Development_Index', category: 'Society' },
    slaveryIndex: { url: 'https://en.wikipedia.org/wiki/Global_Slavery_Index', category: 'Society' },
    givingIndex: { url: 'https://en.wikipedia.org/wiki/World_Giving_Index', category: 'Society' },
    happinessReport: { url: 'https://en.wikipedia.org/wiki/World_Happiness_Report', category: 'Society' },

    // Technology (8 categories)
    ictDevelopment: { url: 'https://en.wikipedia.org/wiki/ICT_Development_Index', category: 'Technology' },
    internetSpeeds: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_Internet_connection_speeds', category: 'Technology' },
    ltePenetration: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_4G_LTE_penetration', category: 'Technology' },
    mobileBanking: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_mobile_banking_usage', category: 'Technology' },
    smartphonePenetration: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_smartphone_penetration', category: 'Technology' },
    stemCellResearch: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_stem_cell_research_trials', category: 'Technology' },
    broadbandSubscriptions: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_number_of_broadband_Internet_subscriptions', category: 'Technology' },
    internetHosts: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_number_of_Internet_hosts', category: 'Technology' },
    internetUsers: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_number_of_Internet_users', category: 'Technology' },
    spaceCompetitiveness: { url: 'https://en.wikipedia.org/wiki/Space_Competitiveness_Index', category: 'Technology' },

    // Transport (5 categories)
    logisticsPerformance: { url: 'https://en.wikipedia.org/wiki/Logistics_Performance_Index', category: 'Transport' },
    railUsage: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_rail_usage', category: 'Transport' },
    railNetwork: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_rail_transport_network_size', category: 'Transport' },
    trafficDeaths: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_traffic-related_death_rate', category: 'Transport' },
    vehiclesPerCapita: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_vehicles_per_capita', category: 'Transport' },
    waterways: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_waterways_length', category: 'Transport' }
};

// UN Member States for filtering
const UN_MEMBER_STATES = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
    'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Costa Rica', 'Croatia',
    'Cuba', 'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador',
    'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
    'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
    'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
    'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
    'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
    'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
    'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman',
    'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar',
    'Republic of the Congo', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Saudi Arabia',
    'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
    'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Tajikistan',
    'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda',
    'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
    'Yemen', 'Zambia', 'Zimbabwe', 'Taiwan', 'Palestine'
];

// Enhanced table parsing configuration
const TABLE_CONFIGS = {
    // Default configuration
    default: {
        rowStart: /<tr[^>]*>/i,
        cellPattern: /<t[dh][^>]*>(.*?)<\/t[dh]>/gi,
        dataColumns: { country: 0, value: 1 },
        skipRows: 1,
        valueProcessing: 'numeric'
    },
    
    // Specific configurations for different page types
    lifeExpectancy: {
        rowStart: /<tr[^>]*>/i,
        cellPattern: /<t[dh][^>]*>(.*?)<\/t[dh]>/gi,
        dataColumns: { country: 0, value: 1 },
        skipRows: 1,
        valueProcessing: 'lifeExpectancy'
    },
    
    gdp: {
        rowStart: /<tr[^>]*>/i,
        cellPattern: /<t[dh][^>]*>(.*?)<\/t[dh]>/gi,
        dataColumns: { country: 0, value: 1 },
        skipRows: 1,
        valueProcessing: 'economic'
    },
    
    production: {
        rowStart: /<tr[^>]*>/i,
        cellPattern: /<t[dh][^>]*>(.*?)<\/t[dh]>/gi,
        dataColumns: { country: 0, value: 1 },
        skipRows: 1,
        valueProcessing: 'production'
    }
};

// Utility functions
function cleanCountryName(name) {
    if (!name) return '';
    
    return name
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\[[^\]]*\]/g, '') // Remove references [1], [2], etc.
        .replace(/\([^)]*\)/g, '') // Remove parenthetical content
        .replace(/†/g, '') // Remove dagger symbols
        .replace(/\*/g, '') // Remove asterisks
        .replace(/—.*$/, '') // Remove everything after em dash
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim();
}

function cleanValue(value, processingType = 'numeric') {
    if (!value) return null;
    
    // Remove HTML tags and references
    value = value
        .replace(/<[^>]*>/g, '')
        .replace(/\[[^\]]*\]/g, '')
        .replace(/†/g, '')
        .replace(/\*/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim();
    
    if (!value || value === '—' || value === 'N/A' || value === 'No data') {
        return null;
    }
    
    // Different processing based on type
    switch (processingType) {
        case 'lifeExpectancy':
            // Extract first number for life expectancy
            const lifeExpMatch = value.match(/(\d+\.?\d*)/);
            return lifeExpMatch ? parseFloat(lifeExpMatch[1]) : null;
            
        case 'economic':
            // Handle economic values (GDP, etc.)
            const economicMatch = value.match(/([0-9,]+\.?[0-9]*)/);
            if (economicMatch) {
                return parseFloat(economicMatch[1].replace(/,/g, ''));
            }
            return null;
            
        case 'production':
            // Handle production values
            const prodMatch = value.match(/([0-9,]+\.?[0-9]*)/);
            if (prodMatch) {
                return parseFloat(prodMatch[1].replace(/,/g, ''));
            }
            return null;
            
        default:
            // Numeric processing
            const numMatch = value.match(/([0-9,]+\.?[0-9]*)/);
            if (numMatch) {
                return parseFloat(numMatch[1].replace(/,/g, ''));
            }
            return value; // Return as string if not numeric
    }
}

function isValidCountry(countryName) {
    const cleaned = cleanCountryName(countryName);
    
    // Check against UN member states
    const isUNMember = UN_MEMBER_STATES.some(country => 
        country.toLowerCase() === cleaned.toLowerCase() ||
        cleaned.toLowerCase().includes(country.toLowerCase()) ||
        country.toLowerCase().includes(cleaned.toLowerCase())
    );
    
    // Also allow some common variations
    const commonVariations = {
        'United States': ['USA', 'US', 'America'],
        'United Kingdom': ['UK', 'Britain'],
        'Russia': ['Russian Federation'],
        'South Korea': ['Republic of Korea'],
        'North Korea': ['Democratic People\'s Republic of Korea'],
        'Iran': ['Islamic Republic of Iran'],
        'Venezuela': ['Bolivarian Republic of Venezuela'],
        'Syria': ['Syrian Arab Republic'],
        'Tanzania': ['United Republic of Tanzania']
    };
    
    for (const [standard, variations] of Object.entries(commonVariations)) {
        if (variations.some(v => cleaned.toLowerCase().includes(v.toLowerCase()))) {
            return true;
        }
    }
    
    return isUNMember;
}

function makeHttpsRequest(url) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, { 
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; DataExtractor/1.0)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            },
            timeout: 30000
        }, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                // Handle redirect
                const redirectUrl = response.headers.location;
                console.log(`   → Redirecting to: ${redirectUrl}`);
                return makeHttpsRequest(redirectUrl).then(resolve).catch(reject);
            }
            
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                return;
            }
            
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => resolve(data));
        });
        
        request.on('timeout', () => {
            request.destroy();
            reject(new Error('Request timeout'));
        });
        
        request.on('error', reject);
    });
}

function parseHTMLTables(html, pageConfig) {
    const tableRegex = /<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>(.*?)<\/table>/gis;
    const tables = html.match(tableRegex);
    
    if (!tables || tables.length === 0) {
        console.log('   ⚠️  No wikitable found');
        return {};
    }
    
    const countriesData = {};
    let totalRows = 0;
    
    tables.forEach((table, tableIndex) => {
        const rowRegex = pageConfig.rowStart;
        const rows = table.match(new RegExp(rowRegex.source, 'gi'));
        
        if (!rows) return;
        
        // Skip header rows
        const dataRows = rows.slice(pageConfig.skipRows || 1);
        
        dataRows.forEach(row => {
            const cells = [];
            let match;
            const cellRegex = new RegExp(pageConfig.cellPattern.source, 'gi');
            
            while ((match = cellRegex.exec(row)) !== null) {
                cells.push(match[1]);
            }
            
            if (cells.length >= 2) {
                const countryName = cleanCountryName(cells[pageConfig.dataColumns.country]);
                const value = cleanValue(cells[pageConfig.dataColumns.value], pageConfig.valueProcessing);
                
                if (countryName && value !== null && isValidCountry(countryName)) {
                    countriesData[countryName] = value;
                    totalRows++;
                }
            }
        });
    });
    
    console.log(`   ✅ Extracted ${totalRows} countries`);
    return countriesData;
}

async function extractSingleRanking(rankingKey, rankingConfig) {
    console.log(`\n🔍 Processing: ${rankingKey}`);
    console.log(`   URL: ${rankingConfig.url}`);
    
    try {
        const html = await makeHttpsRequest(rankingConfig.url);
        console.log(`   📥 Downloaded HTML (${Math.round(html.length / 1024)}KB)`);
        
        // Determine configuration based on ranking type
        let pageConfig = TABLE_CONFIGS.default;
        
        if (rankingKey.includes('life') || rankingKey.includes('Life')) {
            pageConfig = TABLE_CONFIGS.lifeExpectancy;
        } else if (rankingKey.includes('gdp') || rankingKey.includes('GDP') || rankingKey.includes('economic')) {
            pageConfig = TABLE_CONFIGS.gdp;
        } else if (rankingKey.includes('Production') || rankingKey.includes('production')) {
            pageConfig = TABLE_CONFIGS.production;
        }
        
        const rankingData = parseHTMLTables(html, pageConfig);
        
        if (Object.keys(rankingData).length === 0) {
            console.log(`   ❌ No data extracted for ${rankingKey}`);
            return null;
        }
        
        console.log(`   📊 Countries found: ${Object.keys(rankingData).length}`);
        console.log(`   🎯 Top countries: ${Object.keys(rankingData).slice(0, 3).join(', ')}`);
        
        return {
            category: rankingConfig.category,
            data: rankingData,
            url: rankingConfig.url,
            extractedCount: Object.keys(rankingData).length
        };
        
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        return null;
    }
}

async function processAllRankings() {
    console.log('🚀 Complete Wikipedia Rankings Extractor');
    console.log('=========================================\n');
    
    const startTime = Date.now();
    const allRankings = Object.keys(ALL_WIKIPEDIA_RANKINGS);
    const batchSize = 5; // Process 5 at a time to avoid overwhelming Wikipedia
    
    console.log(`📋 Total categories to process: ${allRankings.length}`);
    console.log(`⚙️  Processing in batches of ${batchSize} with delays\n`);
    
    const results = {};
    const failed = [];
    const countriesDataset = {};
    
    // Process in batches
    for (let i = 0; i < allRankings.length; i += batchSize) {
        const batch = allRankings.slice(i, i + batchSize);
        console.log(`\n📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allRankings.length/batchSize)}: ${batch.join(', ')}`);
        
        // Process batch in parallel
        const batchPromises = batch.map(async (rankingKey) => {
            const result = await extractSingleRanking(rankingKey, ALL_WIKIPEDIA_RANKINGS[rankingKey]);
            return { rankingKey, result };
        });
        
        const batchResults = await Promise.all(batchPromises);
        
        // Process results
        batchResults.forEach(({ rankingKey, result }) => {
            if (result) {
                results[rankingKey] = result;
                
                // Add to countries dataset
                Object.entries(result.data).forEach(([country, value]) => {
                    if (!countriesDataset[country]) {
                        countriesDataset[country] = {};
                    }
                    countriesDataset[country][rankingKey] = value;
                    countriesDataset[country][`${rankingKey}_raw`] = value; // Keep raw value
                });
            } else {
                failed.push(rankingKey);
            }
        });
        
        // Delay between batches to be respectful to Wikipedia
        if (i + batchSize < allRankings.length) {
            console.log('   ⏳ Waiting 3 seconds before next batch...');
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Generate summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 EXTRACTION COMPLETE');
    console.log('='.repeat(50));
    
    const successful = allRankings.length - failed.length;
    const successRate = ((successful / allRankings.length) * 100).toFixed(1);
    
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`✅ Successful: ${successful}/${allRankings.length} (${successRate}%)`);
    console.log(`❌ Failed: ${failed.length}`);
    console.log(`🌍 Total countries: ${Object.keys(countriesDataset).length}`);
    
    if (failed.length > 0) {
        console.log(`\n❌ Failed categories: ${failed.join(', ')}`);
    }
    
    // Save complete dataset
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const datasetFile = `complete_countries_data_${timestamp}.json`;
    
    fs.writeFileSync(datasetFile, JSON.stringify(countriesDataset, null, 2));
    console.log(`\n💾 Complete dataset saved: ${datasetFile}`);
    
    // Generate detailed report
    const reportFile = `complete_rankings_report_${timestamp}.md`;
    generateDetailedReport(results, failed, duration, successful, allRankings.length, reportFile);
    
    console.log(`📄 Detailed report saved: ${reportFile}`);
    console.log('\n🎉 All done! Use the JSON file for Know-It-All integration.');
    
    return {
        results,
        failed,
        countriesDataset,
        datasetFile,
        reportFile,
        stats: { successful, total: allRankings.length, successRate, duration }
    };
}

function generateDetailedReport(results, failed, duration, successful, total, filename) {
    let report = `# Complete Wikipedia Rankings Dataset\n\n`;
    report += `## Summary\n`;
    report += `- **Created:** ${new Date().toISOString()}\n`;
    report += `- **Duration:** ${duration}s\n`;
    report += `- **Categories Processed:** ${total}\n`;
    report += `- **Successful Categories:** ${successful}\n`;
    report += `- **Failed Categories:** ${failed.length}\n`;
    report += `- **Success Rate:** ${((successful / total) * 100).toFixed(1)}%\n\n`;
    
    // Group by category
    const byCategory = {};
    Object.entries(results).forEach(([key, result]) => {
        if (!byCategory[result.category]) {
            byCategory[result.category] = [];
        }
        byCategory[result.category].push({ key, result });
    });
    
    report += `## Categories Extracted\n`;
    Object.entries(byCategory).forEach(([category, items]) => {
        const avgCoverage = items.reduce((sum, item) => sum + item.result.extractedCount, 0) / items.length;
        const coveragePercent = ((avgCoverage / 195) * 100).toFixed(1);
        
        report += `### ${category} (${items.length} rankings, ${coveragePercent}% avg coverage)\n`;
        items.forEach(({ key, result }) => {
            const coverage = ((result.extractedCount / 195) * 100).toFixed(1);
            report += `- **${key}:** ${result.extractedCount} countries (${coverage}%)\n`;
        });
        report += '\n';
    });
    
    if (failed.length > 0) {
        report += `## Failed Rankings\n`;
        failed.forEach(category => {
            report += `- **${category}** (${ALL_WIKIPEDIA_RANKINGS[category].category}): Failed to extract data\n`;
        });
        report += '\n';
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    report += `## Integration File\n`;
    report += `Use \`complete_countries_data_${timestamp}.json\` for Know-It-All integration.\n\n`;
    report += `This dataset contains ${successful} different country ranking categories across all major domains.\n`;
    
    fs.writeFileSync(filename, report);
}

// Main execution
if (require.main === module) {
    processAllRankings().catch(console.error);
}

module.exports = { processAllRankings, extractSingleRanking };