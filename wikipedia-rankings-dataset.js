#!/usr/bin/env node
/**
 * Wikipedia Rankings Complete Dataset Builder
 * Creates a comprehensive dataset of ALL countries from Wikipedia rankings
 * This is for research/potential challenges, NOT for immediate game integration
 */

const fs = require('fs');

// Initialize the comprehensive dataset structure
const countriesDataset = {
    metadata: {
        created: new Date().toISOString(),
        purpose: "Potential challenge dataset from Wikipedia rankings",
        totalRankings: 0,
        totalCountries: new Set(),
        sources: []
    },
    rankings: {},
    countries: {}
};

// List of Wikipedia ranking pages to scrape
const rankingsToScrape = [
    {
        id: 'gdp_nominal',
        name: 'GDP (Nominal)',
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)',
        description: 'Total economic output in current USD',
        unit: 'Million USD',
        direction: 'desc'
    },
    {
        id: 'gdp_per_capita',
        name: 'GDP per Capita',
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)_per_capita',
        description: 'Economic output per person',
        unit: 'USD',
        direction: 'desc'
    },
    {
        id: 'population',
        name: 'Population',
        url: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population',
        description: 'Total population',
        unit: 'People',
        direction: 'desc'
    },
    {
        id: 'area',
        name: 'Total Area',
        url: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_area',
        description: 'Total land and water area',
        unit: 'Square kilometers',
        direction: 'desc'
    },
    {
        id: 'population_density',
        name: 'Population Density',
        url: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population_density',
        description: 'People per square kilometer',
        unit: 'People/km²',
        direction: 'desc'
    },
    {
        id: 'life_expectancy',
        name: 'Life Expectancy',
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_life_expectancy',
        description: 'Average life expectancy at birth',
        unit: 'Years',
        direction: 'desc'
    },
    {
        id: 'hdi',
        name: 'Human Development Index',
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_Human_Development_Index',
        description: 'Composite index of life expectancy, education, and income',
        unit: 'Index (0-1)',
        direction: 'desc'
    },
    {
        id: 'military_expenditure',
        name: 'Military Expenditure',
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_military_expenditures',
        description: 'Annual military spending',
        unit: 'Million USD',
        direction: 'desc'
    },
    {
        id: 'military_personnel',
        name: 'Military Personnel',
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_number_of_military_and_paramilitary_personnel',
        description: 'Active military personnel',
        unit: 'Personnel',
        direction: 'desc'
    },
    {
        id: 'co2_emissions',
        name: 'CO2 Emissions',
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_carbon_dioxide_emissions',
        description: 'Annual carbon dioxide emissions',
        unit: 'Million tons',
        direction: 'desc'
    },
    {
        id: 'co2_per_capita',
        name: 'CO2 Emissions per Capita',
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_carbon_dioxide_emissions_per_capita',
        description: 'Carbon emissions per person',
        unit: 'Tons per person',
        direction: 'desc'
    },
    {
        id: 'renewable_energy',
        name: 'Renewable Energy Production',
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_renewable_electricity_production',
        description: 'Percentage of electricity from renewable sources',
        unit: 'Percentage',
        direction: 'desc'
    },
    {
        id: 'oil_production',
        name: 'Oil Production',
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_oil_production',
        description: 'Daily oil production',
        unit: 'Barrels per day',
        direction: 'desc'
    },
    {
        id: 'internet_users',
        name: 'Internet Users',
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_number_of_Internet_users',
        description: 'Percentage of population using internet',
        unit: 'Percentage',
        direction: 'desc'
    },
    {
        id: 'mobile_subscriptions',
        name: 'Mobile Phone Subscriptions',
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_number_of_mobile_phones_in_use',
        description: 'Mobile subscriptions per 100 people',
        unit: 'Per 100 people',
        direction: 'desc'
    },
    {
        id: 'tourism_arrivals',
        name: 'International Tourism Arrivals',
        url: 'https://en.wikipedia.org/wiki/World_Tourism_rankings',
        description: 'Annual international tourist arrivals',
        unit: 'Arrivals',
        direction: 'desc'
    },
    {
        id: 'exports',
        name: 'Total Exports',
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_exports',
        description: 'Total value of exports',
        unit: 'Million USD',
        direction: 'desc'
    },
    {
        id: 'imports',
        name: 'Total Imports',
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_imports',
        description: 'Total value of imports',
        unit: 'Million USD',
        direction: 'desc'
    },
    {
        id: 'gold_reserves',
        name: 'Gold Reserves',
        url: 'https://en.wikipedia.org/wiki/Gold_reserve',
        description: 'National gold reserves',
        unit: 'Tonnes',
        direction: 'desc'
    },
    {
        id: 'forest_area',
        name: 'Forest Area',
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_forest_area',
        description: 'Total forest coverage',
        unit: 'Square kilometers',
        direction: 'desc'
    },
    {
        id: 'nobel_laureates',
        name: 'Nobel Prize Laureates',
        url: 'https://en.wikipedia.org/wiki/List_of_Nobel_laureates_by_country',
        description: 'Total Nobel Prize winners',
        unit: 'Laureates',
        direction: 'desc'
    },
    {
        id: 'olympic_medals',
        name: 'Olympic Gold Medals',
        url: 'https://en.wikipedia.org/wiki/All-time_Olympic_Games_medal_table',
        description: 'Total Olympic gold medals',
        unit: 'Gold medals',
        direction: 'desc'
    },
    {
        id: 'fifa_ranking',
        name: 'FIFA World Ranking',
        url: 'https://en.wikipedia.org/wiki/FIFA_World_Rankings',
        description: 'FIFA football ranking',
        unit: 'Ranking points',
        direction: 'desc'
    },
    {
        id: 'corruption_perception',
        name: 'Corruption Perceptions Index',
        url: 'https://en.wikipedia.org/wiki/Corruption_Perceptions_Index',
        description: 'Perceived corruption (higher = less corrupt)',
        unit: 'Score (0-100)',
        direction: 'desc'
    },
    {
        id: 'press_freedom',
        name: 'Press Freedom Index',
        url: 'https://en.wikipedia.org/wiki/Press_Freedom_Index',
        description: 'Press freedom ranking (lower = more free)',
        unit: 'Score',
        direction: 'asc'
    },
    {
        id: 'happiness_index',
        name: 'World Happiness Index',
        url: 'https://en.wikipedia.org/wiki/World_Happiness_Report',
        description: 'National happiness score',
        unit: 'Score',
        direction: 'desc'
    },
    {
        id: 'education_expenditure',
        name: 'Education Expenditure',
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_spending_on_education',
        description: 'Education spending as % of GDP',
        unit: 'Percentage of GDP',
        direction: 'desc'
    },
    {
        id: 'healthcare_expenditure',
        name: 'Healthcare Expenditure',
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_total_health_expenditure_per_capita',
        description: 'Healthcare spending per capita',
        unit: 'USD per capita',
        direction: 'desc'
    },
    {
        id: 'unemployment_rate',
        name: 'Unemployment Rate',
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_unemployment_rate',
        description: 'Percentage of labor force unemployed',
        unit: 'Percentage',
        direction: 'asc'
    },
    {
        id: 'inflation_rate',
        name: 'Inflation Rate',
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_inflation_rate',
        description: 'Annual inflation rate',
        unit: 'Percentage',
        direction: 'asc'
    }
];

// Function to add ranking data
function addRankingData(rankingId, rankingInfo, countryData) {
    // Initialize ranking if not exists
    if (!countriesDataset.rankings[rankingId]) {
        countriesDataset.rankings[rankingId] = {
            ...rankingInfo,
            countries: {},
            totalCountries: 0,
            lastUpdated: new Date().toISOString()
        };
        countriesDataset.metadata.sources.push({
            id: rankingId,
            name: rankingInfo.name,
            url: rankingInfo.url
        });
    }
    
    // Add country data
    Object.entries(countryData).forEach(([country, value]) => {
        // Add to rankings
        countriesDataset.rankings[rankingId].countries[country] = value;
        
        // Add to countries master list
        if (!countriesDataset.countries[country]) {
            countriesDataset.countries[country] = {
                name: country,
                data: {}
            };
        }
        countriesDataset.countries[country].data[rankingId] = value;
        
        // Track unique countries
        countriesDataset.metadata.totalCountries.add(country);
    });
    
    countriesDataset.rankings[rankingId].totalCountries = Object.keys(countryData).length;
    countriesDataset.metadata.totalRankings++;
}

// Sample data structure (would be populated by WebFetch in real implementation)
// This shows the structure for ALL countries, not just top 30
const sampleCompleteData = {
    population: {
        "India": 1417492000,
        "China": 1408280000,
        "United States": 340110988,
        "Indonesia": 284438782,
        "Pakistan": 241499431,
        "Nigeria": 223800000,
        "Brazil": 212583750,
        "Bangladesh": 169828911,
        "Russia": 146028325,
        "Mexico": 130417144,
        "Japan": 123360000,
        "Philippines": 114123600,
        "Democratic Republic of the Congo": 112832000,
        "Ethiopia": 111652998,
        "Egypt": 107271260,
        "Vietnam": 101343800,
        "Iran": 85961000,
        "Turkey": 85664944,
        "Germany": 83577140,
        "France": 68649000,
        "United Kingdom": 68265209,
        "Tanzania": 68153004,
        "Thailand": 65870610,
        "South Africa": 63015904,
        "Italy": 58918231,
        "Kenya": 53330978,
        "Colombia": 52695952,
        "Sudan": 51662000,
        "Myanmar": 51316756,
        "South Korea": 51164582,
        "Uganda": 49924868,
        "Spain": 48059777,
        "Iraq": 44414800,
        "Algeria": 44758398,
        "Argentina": 47327407,
        "Poland": 37840000,
        "Canada": 39858480,
        "Morocco": 38081173,
        "Saudi Arabia": 35844909,
        "Ukraine": 36000000,
        "Angola": 35027343,
        "Uzbekistan": 34915100,
        "Peru": 34234630,
        "Malaysia": 33938221,
        "Afghanistan": 34262840,
        "Venezuela": 33098422,
        "Ghana": 33475870,
        "Yemen": 33696614,
        "Nepal": 30327877,
        "Mozambique": 33089461,
        // ... continues for ALL 195+ countries
    }
};

// Add sample data to dataset
addRankingData('population', rankingsToScrape.find(r => r.id === 'population'), sampleCompleteData.population);

// Generate report
function generateReport() {
    const report = {
        summary: {
            totalRankings: rankingsToScrape.length,
            implementedRankings: countriesDataset.metadata.totalRankings,
            totalUniqueCountries: countriesDataset.metadata.totalCountries.size,
            createdAt: countriesDataset.metadata.created
        },
        rankings: Object.entries(countriesDataset.rankings).map(([id, data]) => ({
            id,
            name: data.name,
            totalCountries: data.totalCountries,
            url: data.url
        })),
        potentialChallenges: rankingsToScrape.map(r => ({
            id: r.id,
            name: r.name,
            description: r.description,
            direction: r.direction === 'desc' ? 'Highest to Lowest' : 'Lowest to Highest',
            status: countriesDataset.rankings[r.id] ? 'Data Available' : 'Pending Scrape'
        }))
    };
    
    return report;
}

// Save dataset files
function saveDataset() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    
    // Save complete dataset
    const datasetFile = `wikipedia_countries_dataset_${timestamp}.json`;
    fs.writeFileSync(datasetFile, JSON.stringify(countriesDataset, null, 2));
    
    // Save report
    const report = generateReport();
    const reportFile = `wikipedia_dataset_report_${timestamp}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    // Save potential challenges list
    const challengesFile = `wikipedia_potential_challenges_${timestamp}.md`;
    const challengesMd = `# Wikipedia Rankings - Potential Game Challenges
Generated: ${new Date().toISOString()}

## Available Rankings (${rankingsToScrape.length} total)

${rankingsToScrape.map((r, i) => `### ${i + 1}. ${r.name}
- **ID**: ${r.id}
- **Description**: ${r.description}
- **Unit**: ${r.unit}
- **Direction**: ${r.direction === 'desc' ? 'Highest to Lowest' : 'Lowest to Highest'}
- **URL**: ${r.url}
- **Status**: ${countriesDataset.rankings[r.id] ? '✅ Data Available' : '⏳ Pending Scrape'}
`).join('\n')}

## Implementation Instructions

To use these rankings:
1. Use WebFetch to scrape each Wikipedia page
2. Extract ALL countries (not just top 30)
3. Add to the dataset using addRankingData()
4. Generate game challenges as needed

## Dataset Statistics
- Total potential rankings: ${rankingsToScrape.length}
- Currently scraped: ${countriesDataset.metadata.totalRankings}
- Unique countries found: ${countriesDataset.metadata.totalCountries.size}
`;
    
    fs.writeFileSync(challengesFile, challengesMd);
    
    console.log('📁 Files created:');
    console.log(`   - ${datasetFile} (Complete dataset)`);
    console.log(`   - ${reportFile} (Summary report)`);
    console.log(`   - ${challengesFile} (Potential challenges list)`);
    
    return { datasetFile, reportFile, challengesFile };
}

// Main execution
console.log('🌍 Wikipedia Countries Dataset Builder');
console.log('=' * 50);
console.log(`📊 ${rankingsToScrape.length} rankings identified for potential challenges`);
console.log(`🎯 Goal: Create comprehensive dataset with ALL countries`);
console.log('');

const report = generateReport();
console.log('📈 Current Status:');
console.log(`   Rankings available: ${report.summary.implementedRankings}/${report.summary.totalRankings}`);
console.log(`   Countries in dataset: ${report.summary.totalUniqueCountries}`);
console.log('');

console.log('🎲 Potential Game Challenges:');
rankingsToScrape.slice(0, 10).forEach((r, i) => {
    console.log(`   ${i + 1}. ${r.name} - ${r.description}`);
});
console.log(`   ... and ${rankingsToScrape.length - 10} more`);

// Save files
console.log('');
const files = saveDataset();

console.log('');
console.log('✅ Dataset framework created!');
console.log('');
console.log('🚀 Next Steps:');
console.log('1. Use WebFetch to scrape each Wikipedia ranking page');
console.log('2. Extract ALL countries from each ranking (not just top 30)');
console.log('3. Run this script to update the dataset');
console.log('4. Review potential challenges and select best ones for game');

module.exports = {
    countriesDataset,
    rankingsToScrape,
    addRankingData,
    generateReport,
    saveDataset
};