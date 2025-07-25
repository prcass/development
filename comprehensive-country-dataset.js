#!/usr/bin/env node
/**
 * Comprehensive Country Dataset Builder
 * Aggregates ALL countries with multiple ranking properties
 * This is a research dataset, not for direct game integration
 */

const fs = require('fs');

// Initialize comprehensive dataset
const comprehensiveDataset = {
    metadata: {
        created: new Date().toISOString(),
        sources: [
            "Wikipedia population rankings",
            "Wikipedia GDP rankings", 
            "Wikipedia HDI rankings",
            "Wikipedia area rankings",
            "DBpedia structured data"
        ],
        totalCountries: 0,
        totalProperties: 0,
        lastUpdated: new Date().toISOString()
    },
    countries: {},
    rankings: {
        population: {
            name: "Population",
            description: "Total population (2024 estimates)",
            unit: "people",
            source: "https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population",
            direction: "desc",
            totalCountries: 0
        },
        gdp_nominal: {
            name: "GDP (Nominal)",
            description: "Gross Domestic Product at current prices",
            unit: "million USD",
            source: "https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)",
            direction: "desc",
            totalCountries: 0
        },
        gdp_per_capita: {
            name: "GDP per Capita",
            description: "Economic output per person",
            unit: "USD",
            source: "https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)_per_capita",
            direction: "desc",
            totalCountries: 0
        },
        area: {
            name: "Total Area",
            description: "Total land and water area",
            unit: "km²",
            source: "https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_area",
            direction: "desc",
            totalCountries: 0
        },
        hdi: {
            name: "Human Development Index",
            description: "Composite index of life expectancy, education, and per capita income",
            unit: "index (0-1)",
            source: "https://en.wikipedia.org/wiki/List_of_countries_by_Human_Development_Index",
            direction: "desc",
            totalCountries: 0
        }
    }
};

// Population data (partial - would be complete with all 195+ countries)
const populationData = {
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
    "Syria": 25620000,
    "Burkina Faso": 24070553,
    "Taiwan": 23346741,
    "Mali": 22395489,
    "Sri Lanka": 21763170,
    "Malawi": 20734262,
    "Kazakhstan": 20370672,
    "Chile": 20206953,
    "Zambia": 19693423,
    "Somalia": 19655000,
    "Chad": 19340757,
    "Romania": 19064409,
    "Senegal": 18126390,
    "Guatemala": 18079810,
    "Netherlands": 18077662,
    "Cambodia": 17577760,
    "Zimbabwe": 17073087,
    "Ecuador": 16938986,
    "South Sudan": 15786898,
    "Guinea": 14363931,
    "Rwanda": 14104969,
    "Benin": 13224860,
    "Burundi": 12332788,
    "Tunisia": 11972169,
    "Haiti": 11867032,
    "Belgium": 11825551,
    "Papua New Guinea": 11781559,
    "Jordan": 11734000,
    "Bolivia": 11312620,
    "Czech Republic": 10876875,
    "Dominican Republic": 10771504,
    "Portugal": 10749635,
    "United Arab Emirates": 10678556,
    "Sweden": 10591058,
    "Tajikistan": 10499000,
    "Greece": 10400720,
    "Azerbaijan": 10236227,
    "Israel": 10098200,
    "Honduras": 9892632,
    "Cuba": 9748007,
    "Hungary": 9539502,
    "Austria": 9202428,
    "Belarus": 9081361,
    "Cyprus": 966400,
    "Fiji": 900869
    // ... continues for all 195+ countries
};

// GDP data (partial - would include all countries)
const gdpData = {
    "United States": 30507217,
    "China": 19231705,
    "Germany": 4744804,
    "India": 4187017,
    "Japan": 4186431,
    "United Kingdom": 3839180,
    "France": 3211292,
    "Italy": 2422855,
    "Canada": 2225341,
    "Brazil": 2125958,
    "Russia": 2076396,
    "Spain": 1799511,
    "South Korea": 1790322,
    "Australia": 1771681,
    "Mexico": 1692640,
    "Turkey": 1437406,
    "Indonesia": 1429743,
    "Netherlands": 1272011,
    "Saudi Arabia": 1083749,
    "Poland": 979960,
    "Switzerland": 947125,
    "Taiwan": 804889
    // ... continues for all countries with GDP data
};

// Function to add data to comprehensive dataset
function addCountryData(countryName, property, value) {
    // Initialize country if not exists
    if (!comprehensiveDataset.countries[countryName]) {
        comprehensiveDataset.countries[countryName] = {
            name: countryName,
            properties: {}
        };
    }
    
    // Add property value
    comprehensiveDataset.countries[countryName].properties[property] = value;
    
    // Update ranking statistics
    if (comprehensiveDataset.rankings[property]) {
        comprehensiveDataset.rankings[property].totalCountries++;
    }
}

// Build comprehensive dataset
function buildDataset() {
    // Add population data
    Object.entries(populationData).forEach(([country, population]) => {
        addCountryData(country, 'population', population);
    });
    
    // Add GDP data
    Object.entries(gdpData).forEach(([country, gdp]) => {
        addCountryData(country, 'gdp_nominal', gdp);
    });
    
    // Calculate statistics
    comprehensiveDataset.metadata.totalCountries = Object.keys(comprehensiveDataset.countries).length;
    comprehensiveDataset.metadata.totalProperties = Object.keys(comprehensiveDataset.rankings).length;
}

// Generate potential challenges report
function generateChallengesReport() {
    const challenges = [];
    
    Object.entries(comprehensiveDataset.rankings).forEach(([propertyId, ranking]) => {
        if (ranking.totalCountries >= 50) { // Only include if we have data for 50+ countries
            challenges.push({
                id: propertyId,
                name: ranking.name,
                description: ranking.description,
                countriesWithData: ranking.totalCountries,
                unit: ranking.unit,
                direction: ranking.direction,
                source: ranking.source,
                quality: ranking.totalCountries >= 150 ? 'Excellent' : 
                         ranking.totalCountries >= 100 ? 'Good' : 'Fair'
            });
        }
    });
    
    return challenges;
}

// Generate coverage report
function generateCoverageReport() {
    const report = {
        totalCountries: comprehensiveDataset.metadata.totalCountries,
        dataCompleteness: {},
        missingData: {}
    };
    
    // Check data completeness for each property
    Object.keys(comprehensiveDataset.rankings).forEach(property => {
        const countriesWithProperty = Object.values(comprehensiveDataset.countries)
            .filter(country => country.properties[property] !== undefined).length;
        
        report.dataCompleteness[property] = {
            count: countriesWithProperty,
            percentage: ((countriesWithProperty / report.totalCountries) * 100).toFixed(1) + '%'
        };
        
        // Find countries missing this property
        report.missingData[property] = Object.keys(comprehensiveDataset.countries)
            .filter(country => !comprehensiveDataset.countries[country].properties[property]);
    });
    
    return report;
}

// Main execution
function main() {
    console.log('🌍 Building Comprehensive Country Dataset...');
    console.log('=' * 60);
    
    // Build dataset
    buildDataset();
    
    console.log(`📊 Dataset Statistics:`);
    console.log(`   Total countries: ${comprehensiveDataset.metadata.totalCountries}`);
    console.log(`   Total properties: ${comprehensiveDataset.metadata.totalProperties}`);
    console.log('');
    
    console.log('📈 Data Coverage by Property:');
    Object.entries(comprehensiveDataset.rankings).forEach(([property, data]) => {
        console.log(`   ${data.name}: ${data.totalCountries} countries`);
    });
    
    // Generate reports
    const challenges = generateChallengesReport();
    const coverage = generateCoverageReport();
    
    console.log('\n🎯 Potential Game Challenges:');
    challenges.forEach((challenge, i) => {
        console.log(`${i + 1}. ${challenge.name} (${challenge.countriesWithData} countries) - ${challenge.quality} quality`);
    });
    
    // Save files
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    
    // Save complete dataset
    const datasetFile = `comprehensive_country_dataset_${timestamp}.json`;
    fs.writeFileSync(datasetFile, JSON.stringify(comprehensiveDataset, null, 2));
    
    // Save challenges report
    const challengesFile = `country_challenges_report_${timestamp}.json`;
    fs.writeFileSync(challengesFile, JSON.stringify({
        metadata: comprehensiveDataset.metadata,
        challenges: challenges,
        coverage: coverage
    }, null, 2));
    
    // Save CSV for easy viewing
    const csvFile = `country_rankings_${timestamp}.csv`;
    const csvContent = generateCSV();
    fs.writeFileSync(csvFile, csvContent);
    
    console.log('\n📁 Files created:');
    console.log(`   📊 ${datasetFile} - Complete dataset`);
    console.log(`   🎯 ${challengesFile} - Challenges report`);
    console.log(`   📑 ${csvFile} - CSV spreadsheet`);
    
    console.log('\n✅ Dataset building complete!');
    console.log('\n💡 Next steps:');
    console.log('1. Review the challenges report to select best rankings');
    console.log('2. Fill in missing data using additional sources');
    console.log('3. Validate data accuracy for final selection');
}

// Generate CSV output
function generateCSV() {
    const headers = ['Country', ...Object.keys(comprehensiveDataset.rankings)];
    const rows = [headers.join(',')];
    
    Object.entries(comprehensiveDataset.countries).forEach(([countryName, countryData]) => {
        const row = [countryName];
        Object.keys(comprehensiveDataset.rankings).forEach(property => {
            row.push(countryData.properties[property] || '');
        });
        rows.push(row.join(','));
    });
    
    return rows.join('\n');
}

// Export for use
module.exports = {
    comprehensiveDataset,
    addCountryData,
    generateChallengesReport,
    generateCoverageReport
};

// Run if called directly
if (require.main === module) {
    main();
}