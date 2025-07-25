#!/usr/bin/env node
/**
 * Add Wikipedia Rankings to Outrank Game
 * Integrates scraped Wikipedia rankings into the existing game data
 */

const fs = require('fs');

// Load the Wikipedia rankings data
const wikipediaData = JSON.parse(fs.readFileSync('wikipedia_rankings_game_format_2025-07-25T02-01-18.json', 'utf8'));

// Read current game data
const gameData = fs.readFileSync('data.js', 'utf8');

// Extract the countries data structure
const countriesStartMatch = gameData.match(/countries:\s*{[\s\S]*?items:\s*{/);
const countriesEndMatch = gameData.match(/},\s*prompts:\s*\[/);

if (!countriesStartMatch || !countriesEndMatch) {
    console.error('❌ Could not find countries section in data.js');
    process.exit(1);
}

// Parse existing countries data
const existingCountriesStr = gameData.substring(
    countriesStartMatch.index + countriesStartMatch[0].length,
    countriesEndMatch.index
);

console.log('🌍 Wikipedia Rankings Integration');
console.log('=' * 40);

// Create backup
const backupFile = `data_backup_before_wikipedia_${new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)}.js`;
fs.writeFileSync(backupFile, gameData);
console.log(`📁 Backup created: ${backupFile}`);

// Country code mappings to match existing game format  
const countryCodeMappings = {
    'United States': 'USA',
    'United Kingdom': 'GBR', 
    'United Arab Emirates': 'UAE',
    'South Korea': 'KOR',
    'South Africa': 'ZAF',
    'Saudi Arabia': 'SAU',
    'New Zealand': 'NZL',
    'Hong Kong': 'HKG',
    'French Polynesia': 'PYF',
    'Democratic Republic of the Congo': 'COD'
};

// Generate new challenges in the correct format
const newChallenges = [
    {
        id: 'gdp_nominal',
        name: 'GDP (Nominal)',
        direction: 'desc',
        formatType: 'currency_millions'
    },
    {
        id: 'population', 
        name: 'Population',
        direction: 'desc',
        formatType: 'millions'
    },
    {
        id: 'life_expectancy',
        name: 'Life Expectancy', 
        direction: 'desc',
        formatType: 'years'
    },
    {
        id: 'co2_emissions',
        name: 'CO2 Emissions',
        direction: 'desc', 
        formatType: 'million_tons'
    },
    {
        id: 'human_development_index',
        name: 'Human Development Index',
        direction: 'desc',
        formatType: 'decimal'
    }
];

// Create integration summary
let integrationSummary = {
    newCountries: 0,
    updatedCountries: 0,
    newChallenges: newChallenges.length,
    totalCountries: Object.keys(wikipediaData.countries.items).length
};

console.log('📊 Integration Summary:');
console.log(`   New countries to add: ${integrationSummary.totalCountries}`);
console.log(`   New challenges: ${integrationSummary.newChallenges}`);

// Generate update instructions
const updateInstructions = `
/**
 * Wikipedia Rankings Integration Instructions
 * Generated: ${new Date().toISOString()}
 * 
 * To integrate this data into your game:
 * 1. Add the country data below to your existing countries.items
 * 2. Add the new challenges to the countries.prompts array
 * 3. Update challenge numbers to continue your existing sequence
 */

// STEP 1: Country Data Updates
// Add these properties to existing countries or add new countries:

${Object.entries(wikipediaData.countries.items).map(([countryName, countryData]) => {
    const code = countryCodeMappings[countryName] || countryData.code;
    const properties = Object.entries(countryData)
        .filter(([key]) => !['name', 'code'].includes(key))
        .map(([key, value]) => `        ${key}: ${JSON.stringify(value)}`)
        .join(',\\n');
    
    return `
// ${countryName} (${code})
"${code}": {
    name: "${countryName}",
    code: "${code}",
${properties}
}`;
}).join(',\\n')}

// STEP 2: Challenge Prompts
// Add these to your countries.prompts array:

${newChallenges.map((challenge, index) => {
    const challengeNum = String(index + 35).padStart(3, '0'); // Start after existing challenges
    
    return `{
    label: \`<div style="text-align: center; padding: 20px;">
        <div style="font-weight: bold; font-size: 18px; color: #2c3e50; margin-bottom: 10px;">
            Challenge ${challengeNum}: ${challenge.name}
        </div>
        <div style="font-size: 14px; color: #7f8c8d; margin-bottom: 15px;">
            Rank countries from HIGHEST to LOWEST
        </div>
        <div style="font-size: 12px; color: #95a5a6;">
            Source: Wikipedia International Rankings
        </div>
    </div>\`,
    challenge: '${challenge.id}',
    direction: '${challenge.direction}'
}`;
}).join(',\\n\\n')}

// STEP 3: Verification
// After integration, verify these countries have the new properties:
${Object.keys(wikipediaData.countries.items).slice(0, 10).map(country => `// - ${country}`).join('\\n')}

`;

// Save integration instructions
const instructionsFile = `wikipedia_integration_instructions_${new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)}.js`;
fs.writeFileSync(instructionsFile, updateInstructions);

console.log(`📋 Integration instructions saved: ${instructionsFile}`);
console.log('\\n✅ Ready for integration!');
console.log('\\n🚀 Next steps:');
console.log('1. Review the integration instructions file');
console.log('2. Manually add the country data to your data.js file');
console.log('3. Add the new challenge prompts');
console.log('4. Test the new challenges in your game');

// Generate a sample of the data for quick review
console.log('\\n📋 Sample of new data:');
const sampleCountries = Object.entries(wikipediaData.countries.items).slice(0, 3);
sampleCountries.forEach(([name, data]) => {
    console.log(`\\n${name}:`);
    Object.entries(data).forEach(([key, value]) => {
        if (key !== 'name' && key !== 'code') {
            console.log(`  ${key}: ${value}`);
        }
    });
});