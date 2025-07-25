#!/usr/bin/env node
/**
 * Complete Country Data Collector
 * Aggregates data from all Wikipedia ranking sources
 * Goal: Create the most comprehensive country dataset possible
 */

const fs = require('fs');

// Comprehensive country dataset structure
const completeDataset = {
    metadata: {
        created: new Date().toISOString(),
        description: "Complete country rankings dataset from Wikipedia",
        totalCountries: 0,
        totalRankings: 0,
        dataSources: []
    },
    countries: {},
    rankings: {}
};

// Population data (from WebFetch results - 95+ countries)
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
};

// Area data (from WebFetch results - 184+ countries)
const areaData = {
    "Russia": 17098246,
    "Canada": 9984670,
    "China": 9596960,
    "United States": 9525067,
    "Brazil": 8510346,
    "Australia": 7741220,
    "India": 3287263,
    "Argentina": 2780400,
    "Kazakhstan": 2724910,
    "Algeria": 2381741,
    "Democratic Republic of the Congo": 2344858,
    "Saudi Arabia": 2149690,
    "Mexico": 1964375,
    "Indonesia": 1904569,
    "Sudan": 1861484,
    "Libya": 1759540,
    "Iran": 1648195,
    "Mongolia": 1564110,
    "Peru": 1285216,
    "Chad": 1284000,
    "Niger": 1267000,
    "Angola": 1246700,
    "Mali": 1240192,
    "South Africa": 1221037,
    "Colombia": 1141748,
    "Ethiopia": 1104300,
    "Bolivia": 1098581,
    "Mauritania": 1030700,
    "Egypt": 1001450,
    "Tanzania": 947303,
    "Nigeria": 923768,
    "Venezuela": 912050,
    "Namibia": 825615,
    "Mozambique": 801590,
    "Pakistan": 796095,
    "Turkey": 783562,
    "Chile": 756096,
    "Zambia": 752612,
    "Myanmar": 676578,
    "Afghanistan": 652230,
    "Somalia": 637657,
    "Central African Republic": 622984,
    "South Sudan": 619745,
    "Ukraine": 603500,
    "Madagascar": 587041,
    "Botswana": 582000,
    "Kenya": 580367,
    "France": 551695,
    "Yemen": 527968,
    "Thailand": 513120,
    "Spain": 505990,
    "Turkmenistan": 488100,
    "Cameroon": 475442,
    "Papua New Guinea": 462840,
    "Sweden": 450295,
    "Uzbekistan": 447400,
    "Morocco": 446550,
    "Iraq": 435244,
    "Paraguay": 406752,
    "Zimbabwe": 390757,
    "Norway": 385207,
    "Japan": 377930,
    "Germany": 357114,
    "Republic of the Congo": 342000,
    "Finland": 338424,
    "Vietnam": 331212,
    "Malaysia": 330803,
    "Ivory Coast": 322463,
    "Poland": 312679,
    "Oman": 309500,
    "Italy": 301336,
    "Philippines": 300000,
    "Ecuador": 283561,
    "Burkina Faso": 274222,
    "New Zealand": 268838,
    "Gabon": 267668,
    "Guinea": 245857,
    "United Kingdom": 242495,
    "Uganda": 241550,
    "Ghana": 238533,
    "Romania": 238391,
    "Laos": 236800,
    "Guyana": 214969,
    "Belarus": 207600,
    "Kyrgyzstan": 199951,
    "Senegal": 196722,
    "Syria": 185180,
    "Cambodia": 181035,
    "Uruguay": 176215,
    "Suriname": 163820,
    "Tunisia": 163610,
    "Bangladesh": 148460,
    "Nepal": 147181,
    "Tajikistan": 143100,
    "Greece": 131957,
    "Nicaragua": 130373,
    "North Korea": 120538,
    "Malawi": 118484,
    "Eritrea": 117600,
    "Benin": 112622,
    "Honduras": 112492,
    "Liberia": 111369,
    "Bulgaria": 110879,
    "Cuba": 109884,
    "Guatemala": 108889,
    "Iceland": 103000,
    "South Korea": 100210,
    "Hungary": 93028,
    "Portugal": 92090,
    "Jordan": 89342,
    "Azerbaijan": 86600,
    "Austria": 83879,
    "United Arab Emirates": 83600,
    "Czech Republic": 78867,
    "Panama": 75417,
    "Sierra Leone": 71740,
    "Ireland": 70273,
    "Georgia": 69700,
    "Sri Lanka": 65610,
    "Lithuania": 65300,
    "Latvia": 64559,
    "Togo": 56785,
    "Croatia": 56594,
    "Bosnia and Herzegovina": 51197,
    "Costa Rica": 51100,
    "Slovakia": 49035,
    "Dominican Republic": 48671,
    "Estonia": 45228,
    "Denmark": 43094,
    "Netherlands": 41850,
    "Switzerland": 41285,
    "Bhutan": 38394,
    "Taiwan": 36193,
    "Guinea-Bissau": 36125,
    "Moldova": 33846,
    "Belgium": 30528,
    "Lesotho": 30355,
    "Armenia": 29743,
    "Solomon Islands": 28896,
    "Albania": 28748,
    "Equatorial Guinea": 28051,
    "Burundi": 27830,
    "Haiti": 27750,
    "Rwanda": 26338,
    "Djibouti": 23200,
    "Belize": 22966,
    "Israel": 22072,
    "El Salvador": 21041,
    "Slovenia": 20273,
    "Fiji": 18274,
    "Kuwait": 17818,
    "Eswatini": 17364,
    "East Timor": 14874,
    "Bahamas": 13943,
    "Montenegro": 13812,
    "Vanuatu": 12189,
    "Qatar": 11586,
    "Gambia": 11295,
    "Jamaica": 10991,
    "Kosovo": 10887,
    "Lebanon": 10452,
    "Cyprus": 9251,
    "Brunei": 5765,
    "Trinidad and Tobago": 5130,
    "Cape Verde": 4033,
    "Samoa": 2831,
    "Luxembourg": 2586,
    "Comoros": 2235,
    "Mauritius": 2040,
    "São Tomé and Príncipe": 964,
    "Kiribati": 811,
    "Bahrain": 765,
    "Dominica": 751,
    "Tonga": 747,
    "Singapore": 719,
    "Micronesia": 702,
    "Palau": 459,
    "Andorra": 468,
    "Seychelles": 452,
    "Antigua and Barbuda": 442,
    "Barbados": 430,
    "Saint Vincent and the Grenadines": 389,
    "Malta": 316,
    "Maldives": 298,
    "Saint Kitts and Nevis": 261,
    "Niue": 260,
    "Cook Islands": 236,
    "Marshall Islands": 181,
    "Liechtenstein": 160,
    "San Marino": 61,
    "Tuvalu": 26,
    "Nauru": 21,
    "Monaco": 2,
    "Vatican City": 0.17
};

// HDI data (from WebFetch results - 74+ very high HDI countries shown)
const hdiData = {
    "Iceland": 0.972,
    "Norway": 0.970,
    "Switzerland": 0.970,
    "Denmark": 0.962,
    "Germany": 0.959,
    "Sweden": 0.959,
    "Australia": 0.958,
    "Netherlands": 0.955,
    "Hong Kong": 0.955,
    "Belgium": 0.951,
    "Ireland": 0.949,
    "Finland": 0.948,
    "Singapore": 0.946,
    "United Kingdom": 0.946,
    "United Arab Emirates": 0.940,
    "Canada": 0.939,
    "Liechtenstein": 0.938,
    "New Zealand": 0.938,
    "United States": 0.938,
    "South Korea": 0.937
    // Note: This would include all 74+ very high HDI countries in complete implementation
};

// Life expectancy data (from WebFetch results)
const lifeExpectancyData = {
    "Hong Kong": 85.51,
    "Japan": 84.71,
    "South Korea": 84.33,
    "French Polynesia": 84.07,
    "Andorra": 84.04,
    "Switzerland": 83.95,
    "Australia": 83.92,
    "Singapore": 83.74,
    "Italy": 83.72,
    "Spain": 83.67
    // Note: This would include all countries in complete implementation
};

// GDP data (from previous fetch)
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
    // Note: This would include all countries with GDP data
};

// Function to initialize country in dataset
function initializeCountry(countryName) {
    if (!completeDataset.countries[countryName]) {
        completeDataset.countries[countryName] = {
            name: countryName,
            data: {}
        };
    }
}

// Function to add ranking definition
function addRanking(rankingId, config) {
    completeDataset.rankings[rankingId] = {
        id: rankingId,
        name: config.name,
        description: config.description,
        unit: config.unit,
        source: config.source,
        direction: config.direction,
        totalCountries: 0
    };
    
    completeDataset.metadata.dataSources.push({
        ranking: rankingId,
        source: config.source
    });
}

// Function to add data for a country
function addCountryData(countryName, rankingId, value) {
    initializeCountry(countryName);
    completeDataset.countries[countryName].data[rankingId] = value;
    
    if (completeDataset.rankings[rankingId]) {
        completeDataset.rankings[rankingId].totalCountries++;
    }
}

// Build the complete dataset
function buildCompleteDataset() {
    console.log('🔨 Building complete dataset...');
    
    // Add ranking definitions
    addRanking('population', {
        name: 'Population',
        description: 'Total population (2024 estimates)',
        unit: 'people',
        source: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population',
        direction: 'desc'
    });
    
    addRanking('area', {
        name: 'Total Area',
        description: 'Total land and water area',
        unit: 'km²',
        source: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_area',
        direction: 'desc'
    });
    
    addRanking('gdp_nominal', {
        name: 'GDP (Nominal)',
        description: 'Gross Domestic Product at current prices',
        unit: 'million USD',
        source: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)',
        direction: 'desc'
    });
    
    addRanking('hdi', {
        name: 'Human Development Index',
        description: 'Composite index of life expectancy, education, and per capita income',
        unit: 'index (0-1)',
        source: 'https://en.wikipedia.org/wiki/List_of_countries_by_Human_Development_Index',
        direction: 'desc'
    });
    
    addRanking('life_expectancy', {
        name: 'Life Expectancy',
        description: 'Average life expectancy at birth',
        unit: 'years',
        source: 'https://en.wikipedia.org/wiki/List_of_countries_by_life_expectancy',
        direction: 'desc'
    });
    
    // Add population data
    Object.entries(populationData).forEach(([country, population]) => {
        addCountryData(country, 'population', population);
    });
    
    // Add area data  
    Object.entries(areaData).forEach(([country, area]) => {
        addCountryData(country, 'area', area);
    });
    
    // Add GDP data
    Object.entries(gdpData).forEach(([country, gdp]) => {
        addCountryData(country, 'gdp_nominal', gdp);
    });
    
    // Add HDI data
    Object.entries(hdiData).forEach(([country, hdi]) => {
        addCountryData(country, 'hdi', hdi);
    });
    
    // Add life expectancy data
    Object.entries(lifeExpectancyData).forEach(([country, lifeExp]) => {
        addCountryData(country, 'life_expectancy', lifeExp);
    });
    
    // Update metadata
    completeDataset.metadata.totalCountries = Object.keys(completeDataset.countries).length;
    completeDataset.metadata.totalRankings = Object.keys(completeDataset.rankings).length;
}

// Generate comprehensive analysis
function generateAnalysis() {
    const analysis = {
        datasetSummary: {
            totalCountries: completeDataset.metadata.totalCountries,
            totalRankings: completeDataset.metadata.totalRankings,
            dataCoverage: {}
        },
        topChallenges: [],
        dataGaps: {},
        recommendations: []
    };
    
    // Analyze data coverage
    Object.entries(completeDataset.rankings).forEach(([rankingId, ranking]) => {
        const coverage = (ranking.totalCountries / analysis.datasetSummary.totalCountries * 100).toFixed(1);
        analysis.datasetSummary.dataCoverage[ranking.name] = {
            countries: ranking.totalCountries,
            coverage: coverage + '%',
            quality: ranking.totalCountries >= 150 ? 'Excellent' : 
                     ranking.totalCountries >= 100 ? 'Good' : 
                     ranking.totalCountries >= 50 ? 'Fair' : 'Poor'
        };
        
        if (ranking.totalCountries >= 50) {
            analysis.topChallenges.push({
                id: rankingId,
                name: ranking.name,
                countries: ranking.totalCountries,
                coverage: coverage + '%',
                quality: analysis.datasetSummary.dataCoverage[ranking.name].quality
            });
        }
    });
    
    // Find data gaps
    Object.keys(completeDataset.rankings).forEach(rankingId => {
        const countriesWithoutData = Object.keys(completeDataset.countries).filter(country => 
            !completeDataset.countries[country].data[rankingId]
        );
        analysis.dataGaps[rankingId] = countriesWithoutData;
    });
    
    // Generate recommendations
    analysis.recommendations = [
        `Dataset contains ${analysis.datasetSummary.totalCountries} countries across ${analysis.datasetSummary.totalRankings} rankings`,
        `Best ranking candidates: ${analysis.topChallenges.filter(c => c.quality === 'Excellent').length} excellent, ${analysis.topChallenges.filter(c => c.quality === 'Good').length} good`,
        "Area data has best coverage (184+ countries)",
        "Population data covers 95+ countries", 
        "HDI and life expectancy need more complete data",
        "Ready for game challenge selection and implementation"
    ];
    
    return analysis;
}

// Main execution
function main() {
    console.log('🌍 Complete Country Data Collector');
    console.log('=' * 60);
    
    buildCompleteDataset();
    const analysis = generateAnalysis();
    
    console.log('\n📊 Dataset Overview:');
    console.log(`   Total countries: ${analysis.datasetSummary.totalCountries}`);
    console.log(`   Total rankings: ${analysis.datasetSummary.totalRankings}`);
    
    console.log('\n📈 Data Coverage by Ranking:');
    Object.entries(analysis.datasetSummary.dataCoverage).forEach(([name, data]) => {
        console.log(`   ${name}: ${data.countries} countries (${data.coverage}) - ${data.quality}`);
    });
    
    console.log('\n🎯 Top Potential Game Challenges:');
    analysis.topChallenges.slice(0, 10).forEach((challenge, i) => {
        console.log(`   ${i + 1}. ${challenge.name} - ${challenge.countries} countries (${challenge.quality})`);
    });
    
    // Save files
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    
    const completeDatasetFile = `complete_country_dataset_${timestamp}.json`;
    fs.writeFileSync(completeDatasetFile, JSON.stringify(completeDataset, null, 2));
    
    const analysisFile = `dataset_analysis_${timestamp}.json`;
    fs.writeFileSync(analysisFile, JSON.stringify(analysis, null, 2));
    
    // Generate comprehensive CSV
    const csvFile = `complete_country_rankings_${timestamp}.csv`;
    const csvContent = generateCompleteCSV();
    fs.writeFileSync(csvFile, csvContent);
    
    console.log('\n📁 Files created:');
    console.log(`   📊 ${completeDatasetFile} - Complete dataset (JSON)`);
    console.log(`   📋 ${analysisFile} - Analysis report`);
    console.log(`   📑 ${csvFile} - Complete CSV`);
    
    console.log('\n✅ Complete dataset ready!');
    console.log('\n💡 Recommendations:');
    analysis.recommendations.forEach(rec => console.log(`   • ${rec}`));
}

// Generate complete CSV
function generateCompleteCSV() {
    const headers = ['Country', ...Object.keys(completeDataset.rankings)];
    const rows = [headers.join(',')];
    
    Object.entries(completeDataset.countries).forEach(([countryName, countryData]) => {
        const row = [countryName];
        Object.keys(completeDataset.rankings).forEach(rankingId => {
            row.push(countryData.data[rankingId] || '');
        });
        rows.push(row.join(','));
    });
    
    return rows.join('\n');
}

// Export
module.exports = {
    completeDataset,
    buildCompleteDataset,
    generateAnalysis
};

if (require.main === module) {
    main();
}