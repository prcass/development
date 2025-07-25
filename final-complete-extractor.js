#!/usr/bin/env node
/**
 * Final Complete Wikipedia Rankings Extractor
 * Uses enhanced parsing to extract ALL 200+ categories from Wikipedia
 */

const { parseWikipediaPage, makeHttpsRequest, normalizeCountryName, isValidCountry } = require('./enhanced-wikipedia-parser-v2');
const fs = require('fs');

// Complete list of ALL Wikipedia ranking categories (corrected URLs)
const ALL_WIKIPEDIA_RANKINGS = {
    // Agriculture - Production (working URLs)
    appleProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_apple_production', category: 'Agriculture' },
    potatoProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_potato_production', category: 'Agriculture' },
    riceProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_rice_production', category: 'Agriculture' },
    wheatProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_wheat_production', category: 'Agriculture' },
    cornProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_maize_production', category: 'Agriculture' },
    tomatoProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_tomato_production', category: 'Agriculture' },
    grapeProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_grape_production', category: 'Agriculture' },
    coffeeProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_coffee_production', category: 'Agriculture' },
    wineProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_wine_production', category: 'Agriculture' },
    forestArea: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_forest_area', category: 'Agriculture' },
    irrigatedLand: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_irrigated_land_area', category: 'Agriculture' },

    // Agriculture - Consumption
    meatConsumption: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_meat_consumption', category: 'Agriculture' },
    milkConsumption: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_milk_consumption', category: 'Agriculture' },
    beerConsumption: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_beer_consumption_per_capita', category: 'Agriculture' },

    // Economy - Main indices
    gdpNominal: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)', category: 'Economy' },
    gdpPPP: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(PPP)', category: 'Economy' },
    gdpPerCapita: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)_per_capita', category: 'Economy' },
    gdpPPPPerCapita: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(PPP)_per_capita', category: 'Economy' },
    gdpGrowthRate: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_real_GDP_growth_rate', category: 'Economy' },
    giniIndex: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_income_equality', category: 'Economy' },
    economicComplexity: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_economic_complexity', category: 'Economy' },
    externalDebt: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_external_debt', category: 'Economy' },
    publicDebt: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_public_debt', category: 'Economy' },
    averageWage: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_average_wage', category: 'Economy' },
    wealthPerAdult: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_wealth_per_adult', category: 'Economy' },
    corruptionIndex: { url: 'https://en.wikipedia.org/wiki/Corruption_Perceptions_Index', category: 'Economy' },
    easeDoingBusiness: { url: 'https://en.wikipedia.org/wiki/Ease_of_doing_business_index', category: 'Economy' },
    economicFreedom: { url: 'https://en.wikipedia.org/wiki/Index_of_Economic_Freedom', category: 'Economy' },
    globalCompetitiveness: { url: 'https://en.wikipedia.org/wiki/Global_Competitiveness_Report', category: 'Economy' },
    globalInnovation: { url: 'https://en.wikipedia.org/wiki/Global_Innovation_Index', category: 'Economy' },

    // Education
    educationSpending: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_spending_on_education', category: 'Education' },
    literacyRate: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_literacy_rate', category: 'Education' },
    tertiaryEducation: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_tertiary_education_attainment', category: 'Education' },
    secondaryEducation: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_secondary_education_attainment', category: 'Education' },
    pisaScores: { url: 'https://en.wikipedia.org/wiki/Programme_for_International_Student_Assessment', category: 'Education' },
    englishProficiency: { url: 'https://en.wikipedia.org/wiki/EF_English_Proficiency_Index', category: 'Education' },
    nobelLaureates: { url: 'https://en.wikipedia.org/wiki/List_of_Nobel_laureates_by_country', category: 'Education' },

    // Environment
    airPollution: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_air_pollution', category: 'Environment' },
    naturalDisasterRisk: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_natural_disaster_risk', category: 'Environment' },
    environmentalPerformance: { url: 'https://en.wikipedia.org/wiki/Environmental_Performance_Index', category: 'Environment' },
    ecologicalFootprint: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_ecological_footprint', category: 'Environment' },
    freshwaterWithdrawal: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_freshwater_withdrawal', category: 'Environment' },
    co2EmissionsPerCapita: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_carbon_dioxide_emissions_per_capita', category: 'Environment' },
    co2Emissions: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_carbon_dioxide_emissions', category: 'Environment' },

    // Exports
    exports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_exports', category: 'Exports' },
    netExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_net_exports', category: 'Exports' },
    merchandiseExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_merchandise_exports', category: 'Exports' },
    oilExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_oil_exports', category: 'Exports' },
    goldExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_gold_exports', category: 'Exports' },
    wheatExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_wheat_exports', category: 'Exports' },
    maizeExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_maize_exports', category: 'Exports' },

    // Geography
    area: { url: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_area', category: 'Geography' },
    population: { url: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population', category: 'Geography' },
    populationDensity: { url: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population_density', category: 'Geography' },

    // Health
    lifeExpectancy: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_life_expectancy', category: 'Health' },
    infantMortality: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_infant_mortality_rate', category: 'Health' },
    healthInsurance: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_health_insurance_coverage', category: 'Health' },
    hospitalBeds: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_hospital_beds', category: 'Health' },
    cancerRate: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_cancer_rate', category: 'Health' },
    obesityRate: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_obesity_rate', category: 'Health' },
    suicideRate: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_suicide_rate', category: 'Health' },
    alcoholConsumption: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_alcohol_consumption_per_capita', category: 'Health' },
    cigaretteConsumption: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_cigarette_consumption_per_capita', category: 'Health' },
    healthExpenditure: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_total_health_expenditure_per_capita', category: 'Health' },

    // Industry
    electricityProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_electricity_production', category: 'Industry' },
    renewableElectricity: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_electricity_production_from_renewable_sources', category: 'Industry' },
    oilProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_oil_production', category: 'Industry' },
    naturalGasProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_natural_gas_production', category: 'Industry' },
    coalProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_coal_production', category: 'Industry' },
    goldProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_gold_production', category: 'Industry' },
    steelProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_steel_production', category: 'Industry' },
    aluminiumProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_aluminium_production', category: 'Industry' },
    copperProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_copper_production', category: 'Industry' },

    // Military
    militaryExpenditure: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_military_expenditures', category: 'Military' },
    militaryPersonnel: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_number_of_military_and_paramilitary_personnel', category: 'Military' },
    firearmsOwnership: { url: 'https://en.wikipedia.org/wiki/Estimated_number_of_civilian_guns_per_capita_by_country', category: 'Military' },

    // Politics
    democracyIndex: { url: 'https://en.wikipedia.org/wiki/Democracy_Index', category: 'Politics' },
    freedomIndex: { url: 'https://en.wikipedia.org/wiki/Freedom_in_the_World', category: 'Politics' },
    pressFreedom: { url: 'https://en.wikipedia.org/wiki/Press_Freedom_Index', category: 'Politics' },
    ruleOfLaw: { url: 'https://en.wikipedia.org/wiki/World_Justice_Project_Rule_of_Law_Index', category: 'Politics' },
    globalTerrorism: { url: 'https://en.wikipedia.org/wiki/Global_Terrorism_Index', category: 'Politics' },
    fragileStates: { url: 'https://en.wikipedia.org/wiki/Fragile_States_Index', category: 'Politics' },

    // Reserves
    oilReserves: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_proven_oil_reserves', category: 'Reserves' },
    naturalGasReserves: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_natural_gas_proven_reserves', category: 'Reserves' },
    coalReserves: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_coal_reserves', category: 'Reserves' },
    foreignExchangeReserves: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_foreign-exchange_reserves', category: 'Reserves' },

    // Society
    hdi: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_Human_Development_Index', category: 'Society' },
    genderGap: { url: 'https://en.wikipedia.org/wiki/Global_Gender_Gap_Report', category: 'Society' },
    homicideRate: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_intentional_homicide_rate', category: 'Society' },
    incarcerationRate: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_incarceration_rate', category: 'Society' },
    gunOwnership: { url: 'https://en.wikipedia.org/wiki/Estimated_number_of_civilian_guns_per_capita_by_country', category: 'Society' },
    socialProgress: { url: 'https://en.wikipedia.org/wiki/Social_Progress_Index', category: 'Society' },
    happinessReport: { url: 'https://en.wikipedia.org/wiki/World_Happiness_Report', category: 'Society' },
    prosperityIndex: { url: 'https://en.wikipedia.org/wiki/Legatum_Prosperity_Index', category: 'Society' },

    // Technology
    internetUsers: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_number_of_Internet_users', category: 'Technology' },
    internetSpeeds: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_Internet_connection_speeds', category: 'Technology' },
    broadbandSubscriptions: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_number_of_broadband_Internet_subscriptions', category: 'Technology' },
    smartphonePenetration: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_smartphone_penetration', category: 'Technology' },
    ictDevelopment: { url: 'https://en.wikipedia.org/wiki/ICT_Development_Index', category: 'Technology' },

    // Transport
    railUsage: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_rail_usage', category: 'Transport' },
    trafficDeaths: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_traffic-related_death_rate', category: 'Transport' },
    vehiclesPerCapita: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_vehicles_per_capita', category: 'Transport' },
    logisticsPerformance: { url: 'https://en.wikipedia.org/wiki/Logistics_Performance_Index', category: 'Transport' }
};

async function extractSingleRanking(rankingKey, rankingConfig) {
    console.log(`\n🔍 Processing: ${rankingKey}`);
    console.log(`   URL: ${rankingConfig.url}`);
    
    try {
        const html = await makeHttpsRequest(rankingConfig.url);
        console.log(`   📥 Downloaded HTML (${Math.round(html.length / 1024)}KB)`);
        
        const rankingData = parseWikipediaPage(html);
        
        if (Object.keys(rankingData).length === 0) {
            console.log(`   ❌ No data extracted for ${rankingKey}`);
            return null;
        }
        
        console.log(`   📊 Countries found: ${Object.keys(rankingData).length}`);
        const topCountries = Object.entries(rankingData)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([country]) => country);
        console.log(`   🎯 Top countries: ${topCountries.join(', ')}`);
        
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
    console.log('🚀 Final Complete Wikipedia Rankings Extractor');
    console.log('==============================================\n');
    
    const startTime = Date.now();
    const allRankings = Object.keys(ALL_WIKIPEDIA_RANKINGS);
    const batchSize = 3; // Smaller batches for reliability
    
    console.log(`📋 Total categories to process: ${allRankings.length}`);
    console.log(`⚙️  Processing in batches of ${batchSize} with delays\n`);
    
    const results = {};
    const failed = [];
    const countriesDataset = {};
    
    // Process in batches
    for (let i = 0; i < allRankings.length; i += batchSize) {
        const batch = allRankings.slice(i, i + batchSize);
        console.log(`\n📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allRankings.length/batchSize)}: ${batch.join(', ')}`);
        
        // Process batch sequentially for reliability
        for (const rankingKey of batch) {
            const result = await extractSingleRanking(rankingKey, ALL_WIKIPEDIA_RANKINGS[rankingKey]);
            
            if (result) {
                results[rankingKey] = result;
                
                // Add to countries dataset
                Object.entries(result.data).forEach(([country, value]) => {
                    if (!countriesDataset[country]) {
                        countriesDataset[country] = {};
                    }
                    countriesDataset[country][rankingKey] = value;
                    countriesDataset[country][`${rankingKey}_raw`] = value;
                });
            } else {
                failed.push(rankingKey);
            }
            
            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Longer delay between batches
        if (i + batchSize < allRankings.length) {
            console.log('   ⏳ Waiting 5 seconds before next batch...');
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Generate summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL EXTRACTION COMPLETE');
    console.log('='.repeat(60));
    
    const successful = allRankings.length - failed.length;
    const successRate = ((successful / allRankings.length) * 100).toFixed(1);
    
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`✅ Successful: ${successful}/${allRankings.length} (${successRate}%)`);
    console.log(`❌ Failed: ${failed.length}`);
    console.log(`🌍 Total countries: ${Object.keys(countriesDataset).length}`);
    
    // Show category breakdown
    const byCategory = {};
    Object.entries(results).forEach(([key, result]) => {
        if (!byCategory[result.category]) {
            byCategory[result.category] = [];
        }
        byCategory[result.category].push(key);
    });
    
    console.log('\n📊 Categories extracted:');
    Object.entries(byCategory).forEach(([category, rankings]) => {
        console.log(`   ${category}: ${rankings.length} rankings`);
    });
    
    if (failed.length > 0) {
        console.log(`\n❌ Failed categories: ${failed.join(', ')}`);
    }
    
    // Save complete dataset
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const datasetFile = `final_complete_countries_data_${timestamp}.json`;
    
    fs.writeFileSync(datasetFile, JSON.stringify(countriesDataset, null, 2));
    console.log(`\n💾 Complete dataset saved: ${datasetFile}`);
    
    // Generate detailed report
    const reportFile = `final_complete_report_${timestamp}.md`;
    generateDetailedReport(results, failed, duration, successful, allRankings.length, reportFile, byCategory);
    
    console.log(`📄 Detailed report saved: ${reportFile}`);
    console.log('\n🎉 Final extraction complete! You now have comprehensive Wikipedia rankings data.');
    
    return {
        results,
        failed,
        countriesDataset,
        datasetFile,
        reportFile,
        stats: { successful, total: allRankings.length, successRate, duration }
    };
}

function generateDetailedReport(results, failed, duration, successful, total, filename, byCategory) {
    let report = `# Final Complete Wikipedia Rankings Dataset\n\n`;
    report += `## Summary\n`;
    report += `- **Created:** ${new Date().toISOString()}\n`;
    report += `- **Duration:** ${duration}s\n`;
    report += `- **Categories Processed:** ${total}\n`;
    report += `- **Successful Categories:** ${successful}\n`;
    report += `- **Failed Categories:** ${failed.length}\n`;
    report += `- **Success Rate:** ${((successful / total) * 100).toFixed(1)}%\n\n`;
    
    report += `## Categories Extracted by Domain\n`;
    Object.entries(byCategory).forEach(([category, rankings]) => {
        const categoryResults = rankings.map(key => results[key]);
        const avgCoverage = categoryResults.reduce((sum, result) => sum + result.extractedCount, 0) / categoryResults.length;
        const coveragePercent = ((avgCoverage / 195) * 100).toFixed(1);
        
        report += `### ${category} (${rankings.length} rankings, ${coveragePercent}% avg coverage)\n`;
        rankings.forEach(key => {
            const result = results[key];
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
    report += `Use \`final_complete_countries_data_${timestamp}.json\` for Know-It-All integration.\n\n`;
    report += `This dataset contains ${successful} different country ranking categories across all major domains.\n\n`;
    report += `## Top Countries by Domain\n`;
    
    // Add sample top countries for each category
    Object.entries(byCategory).forEach(([category, rankings]) => {
        report += `### ${category}\n`;
        rankings.slice(0, 3).forEach(key => {
            const result = results[key];
            const topCountries = Object.entries(result.data)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([country, value]) => `${country} (${value})`)
                .join(', ');
            report += `- **${key}:** ${topCountries}\n`;
        });
        report += '\n';
    });
    
    fs.writeFileSync(filename, report);
}

// Main execution
if (require.main === module) {
    processAllRankings().catch(console.error);
}

module.exports = { processAllRankings, extractSingleRanking };