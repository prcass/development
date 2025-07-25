#!/usr/bin/env node
/**
 * Integrate Wikipedia Rankings into Outrank Game Data
 * Adds new country properties and challenges from scraped Wikipedia data
 */

const fs = require('fs');

console.log('🌍 Wikipedia Rankings Integration Tool');
console.log('=' * 50);

// Load Wikipedia data
let wikipediaData;
try {
    wikipediaData = JSON.parse(fs.readFileSync('wikipedia_rankings_game_format_2025-07-25T02-01-18.json', 'utf8'));
    console.log('✅ Loaded Wikipedia rankings data');
} catch (error) {
    console.error('❌ Could not load Wikipedia data:', error.message);
    process.exit(1);
}

// Create mapping between Wikipedia country names and existing game codes
const countryNameToCode = {
    'United States': 'USA',
    'China': 'CHN', 
    'Germany': '001', // Existing in game
    'India': 'IND',
    'Japan': 'JPN',
    'United Kingdom': 'GBR',
    'France': 'FRA',
    'Italy': 'ITA',
    'Canada': 'CAN',
    'Brazil': 'BRA',
    'Russia': 'RUS',
    'Spain': 'ESP',
    'South Korea': 'KOR',
    'Australia': 'AUS',
    'Mexico': 'MEX',
    'Turkey': 'TUR',
    'Indonesia': 'IDN',
    'Netherlands': 'NLD',
    'Saudi Arabia': 'SAU',
    'Poland': 'POL',
    'Switzerland': 'CHE',
    'Belgium': 'BEL',
    'Sweden': 'SWE',
    'Ireland': 'IRL',
    'Israel': 'ISR',
    'Norway': 'NOR',
    'Austria': 'AUT',
    'Denmark': 'DNK',
    'Thailand': 'THA',
    'Egypt': 'EGY',
    'South Africa': 'ZAF',
    'Nigeria': 'NGA',
    'Pakistan': 'PAK',
    'Bangladesh': 'BGD',
    'Vietnam': 'VNM',
    'Philippines': 'PHL',
    'Iran': 'IRN',
    'Singapore': 'SGP',
    'Malaysia': 'MYS',
    'New Zealand': 'NZL',
    'UAE': 'ARE',
    'Hong Kong': 'HKG'
};

// Generate integration data
const integrationData = {
    newCountriesData: {},
    newChallenges: [],
    summary: {
        countriesProcessed: 0,
        newProperties: 0,
        challengesCreated: 0
    }
};

// Process Wikipedia countries data
Object.entries(wikipediaData.countries.items).forEach(([countryName, countryData]) => {
    const gameCode = countryNameToCode[countryName];
    if (!gameCode) {
        console.log(`⚠️  No mapping found for: ${countryName}`);
        return;
    }
    
    const newCountryData = { name: countryName, code: gameCode };
    
    // Add all the Wikipedia properties
    Object.entries(countryData).forEach(([key, value]) => {
        if (key !== 'name' && key !== 'code') {
            newCountryData[key] = value;
            integrationData.summary.newProperties++;
        }
    });
    
    integrationData.newCountriesData[gameCode] = newCountryData;
    integrationData.summary.countriesProcessed++;
});

// Create new challenges
const challengeDefinitions = [
    {
        property: 'gdp_nominal',
        name: 'GDP Nominal (Wikipedia)',
        direction: 'desc',
        unit: 'Million USD'
    },
    {
        property: 'population', 
        name: 'Population (Wikipedia)',
        direction: 'desc',
        unit: 'Millions'
    },
    {
        property: 'life_expectancy',
        name: 'Life Expectancy (Wikipedia)',
        direction: 'desc', 
        unit: 'Years'
    },
    {
        property: 'co2_emissions',
        name: 'CO2 Emissions (Wikipedia)',
        direction: 'desc',
        unit: 'Million Tons'
    },
    {
        property: 'human_development_index',
        name: 'Human Development Index (Wikipedia)', 
        direction: 'desc',
        unit: 'Index (0-1)'
    }
];

challengeDefinitions.forEach((def, index) => {
    const challengeNum = (35 + index).toString().padStart(3, '0'); // Start after existing challenges
    
    const challenge = {
        challenge: def.property,
        label: `<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>${def.name}</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>${def.unit}</div><div style='font-size: 0.85em; color: #666'>(Wikipedia 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank ${def.direction === 'desc' ? 'highest to lowest' : 'lowest to highest'}</div></div>`
    };
    
    integrationData.newChallenges.push(challenge);
    integrationData.summary.challengesCreated++;
});

console.log('📊 Integration Summary:');
console.log(`   Countries processed: ${integrationData.summary.countriesProcessed}`);
console.log(`   New properties added: ${integrationData.summary.newProperties}`);
console.log(`   New challenges created: ${integrationData.summary.challengesCreated}`);

// Generate integration code
const integrationCode = `
/**
 * Wikipedia Rankings Integration - Generated ${new Date().toISOString()}
 * 
 * INSTRUCTIONS:
 * 1. Add the country data updates below to your existing countries section
 * 2. Add the new challenges to your countries prompts array
 * 3. Update any challenge numbering as needed
 */

// =================
// COUNTRY DATA UPDATES
// =================
// Add these properties to existing countries in your data.js:

${Object.entries(integrationData.newCountriesData).map(([code, data]) => {
    const properties = Object.entries(data)
        .filter(([key]) => !['name', 'code'].includes(key))
        .map(([key, value]) => `            "${key}": ${JSON.stringify(value)}`)
        .join(',\\n');
    
    return `// ${data.name} (${code})
"${code}": {
    "name": "${data.name}",
    "code": "${code}",
${properties}
}`;
}).join(',\\n\\n')}

// =================
// NEW CHALLENGES
// =================
// Add these to your countries.prompts array:

${integrationData.newChallenges.map((challenge, index) => `{
    "challenge": "${challenge.challenge}",
    "label": "${challenge.label.replace(/"/g, '\\"')}"
}`).join(',\\n\\n')}

// =================
// SAMPLE INTEGRATION CODE
// =================
// Use this template to add to your data.js:

/*
// In your countries section, add these properties to existing countries:
"USA": {
    // ... existing properties ...
    "gdp_nominal": ${integrationData.newCountriesData.USA?.gdp_nominal || 'N/A'},
    "population": ${integrationData.newCountriesData.USA?.population || 'N/A'},
    "life_expectancy": ${integrationData.newCountriesData.USA?.life_expectancy || 'N/A'}
},

// In your countries.prompts array, add:
{
    "challenge": "gdp_nominal",
    "label": "Challenge: GDP (Nominal) - Rank highest to lowest"
}
*/

// =================
// VERIFICATION
// =================
// After integration, verify these countries have the new data:
${Object.keys(integrationData.newCountriesData).slice(0, 10).map(code => `// ${code}: ${integrationData.newCountriesData[code].name}`).join('\\n')}
`;

// Save integration files
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);

const integrationFile = `wikipedia_integration_${timestamp}.js`;
fs.writeFileSync(integrationFile, integrationCode);

const dataFile = `wikipedia_integration_data_${timestamp}.json`;
fs.writeFileSync(dataFile, JSON.stringify(integrationData, null, 2));

console.log(`\\n📁 Files created:`);
console.log(`   - ${integrationFile} (Integration code)`);
console.log(`   - ${dataFile} (Structured data)`);

console.log(`\\n✅ Integration ready!`);
console.log(`\\n🚀 Next steps:`);
console.log(`1. Review ${integrationFile} for the integration code`);
console.log(`2. Manually add the country properties to your data.js`);
console.log(`3. Add the new challenges to the prompts array`);
console.log(`4. Test the new challenges in your game`);

// Show sample data
console.log(`\\n📋 Sample Wikipedia data added:`);
const sampleCountry = Object.entries(integrationData.newCountriesData)[0];
if (sampleCountry) {
    console.log(`\\n${sampleCountry[1].name} (${sampleCountry[0]}):`);
    Object.entries(sampleCountry[1]).forEach(([key, value]) => {
        if (!['name', 'code'].includes(key)) {
            console.log(`  ${key}: ${value}`);
        }
    });
}