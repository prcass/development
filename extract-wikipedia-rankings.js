#!/usr/bin/env node
/**
 * Wikipedia Rankings Extractor for Outrank Game
 * Extracts multiple country rankings from Wikipedia pages
 * Uses the WebFetch approach through Claude Code API
 */

// Sample rankings data that can be expanded
const wikipediaRankings = {
    // Economic Rankings
    gdp_nominal: {
        name: "GDP (Nominal)",
        url: "https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)",
        direction: "desc", // Highest to lowest
        source: "IMF 2025",
        data: {
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
            "Taiwan": 804889,
            "Belgium": 684864,
            "Argentina": 683533,
            "Sweden": 620297,
            "Ireland": 598840,
            "Israel": 583361,
            "Singapore": 564774,
            "UAE": 548598,
            "Thailand": 546224
        }
    },
    
    human_development_index: {
        name: "Human Development Index",
        url: "https://en.wikipedia.org/wiki/List_of_countries_by_Human_Development_Index",
        direction: "desc", // Highest to lowest
        source: "UN 2023",
        data: {
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
            "UAE": 0.940,
            "Canada": 0.939,
            "Liechtenstein": 0.938,
            "New Zealand": 0.938,
            "United States": 0.938,
            "South Korea": 0.937,
            "Slovenia": 0.931,
            "Austria": 0.930,
            "Japan": 0.925,
            "Malta": 0.924,
            "Luxembourg": 0.922,
            "France": 0.920,
            "Israel": 0.919,
            "Spain": 0.918,
            "Czechia": 0.915,
            "Italy": 0.915
        }
    },
    
    population: {
        name: "Population (Millions)",
        url: "https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population",
        direction: "desc", // Highest to lowest
        source: "UN 2024",
        data: {
            "India": 1417.5,
            "China": 1408.3,
            "United States": 340.1,
            "Indonesia": 284.4,
            "Pakistan": 241.5,
            "Nigeria": 223.8,
            "Brazil": 212.6,
            "Bangladesh": 169.8,
            "Russia": 146.0,
            "Mexico": 130.4,
            "Japan": 123.4,
            "Philippines": 114.1,
            "Democratic Republic of the Congo": 112.8,
            "Ethiopia": 111.7,
            "Egypt": 107.3,
            "Vietnam": 101.3,
            "Iran": 86.0,
            "Turkey": 85.7,
            "Germany": 83.6,
            "France": 68.6,
            "United Kingdom": 68.3,
            "Tanzania": 68.2,
            "Thailand": 65.9,
            "South Africa": 63.0,
            "Italy": 58.9,
            "Kenya": 53.3,
            "Colombia": 52.7,
            "Sudan": 51.7,
            "Myanmar": 51.3,
            "South Korea": 51.2
        }
    },
    
    life_expectancy: {
        name: "Life Expectancy (Years)",
        url: "https://en.wikipedia.org/wiki/List_of_countries_by_life_expectancy",
        direction: "desc", // Highest to lowest
        source: "UN 2023",
        data: {
            "Hong Kong": 85.51,
            "Japan": 84.71,
            "South Korea": 84.33,
            "French Polynesia": 84.07,
            "Andorra": 84.04,
            "Switzerland": 83.95,
            "Australia": 83.92,
            "Singapore": 83.74,
            "Italy": 83.72,
            "Spain": 83.67,
            "Réunion": 83.55,
            "France": 83.33,
            "Norway": 83.31,
            "Malta": 83.30,
            "Guernsey": 83.27,
            "Sweden": 83.26,
            "Macau": 83.08,
            "UAE": 82.91,
            "Iceland": 82.69,
            "Canada": 82.63,
            "Martinique": 82.56,
            "Israel": 82.41,
            "Ireland": 82.41,
            "Qatar": 82.37,
            "Portugal": 82.36,
            "Bermuda": 82.31,
            "Luxembourg": 82.23,
            "Netherlands": 82.16,
            "Belgium": 82.11,
            "New Zealand": 82.09
        }
    },
    
    co2_emissions: {
        name: "CO2 Emissions (Million Tons)",
        url: "https://en.wikipedia.org/wiki/List_of_countries_by_carbon_dioxide_emissions",
        direction: "desc", // Highest to lowest
        source: "Global Carbon Atlas 2023",
        data: {
            "China": 13259.64,
            "United States": 4682.04,
            "India": 2955.18,
            "Russia": 2069.50,
            "Japan": 944.76,
            "Iran": 778.80,
            "Indonesia": 674.54,
            "Saudi Arabia": 622.91,
            "Germany": 582.95,
            "Canada": 575.01,
            "South Korea": 573.54,
            "Mexico": 487.09,
            "Brazil": 479.50,
            "Turkey": 438.32,
            "South Africa": 397.37,
            "Australia": 373.62,
            "Vietnam": 372.95,
            "Italy": 305.49,
            "United Kingdom": 302.10,
            "Poland": 286.91,
            "Malaysia": 283.32,
            "France": 282.43,
            "Taiwan": 279.85,
            "Thailand": 274.16,
            "Egypt": 249.33,
            "Kazakhstan": 239.87,
            "Spain": 217.26
        }
    }
};

// Additional rankings to fetch (these would need WebFetch calls)
const additionalRankingsToFetch = [
    {
        name: "Population",
        url: "https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population",
        prompt: "Extract the population rankings for countries from the main table. Return country names with their population values for the top 30 countries."
    },
    {
        name: "Life Expectancy",
        url: "https://en.wikipedia.org/wiki/List_of_countries_by_life_expectancy", 
        prompt: "Extract life expectancy data for countries. Return country names with their life expectancy values for the top 30 countries."
    },
    {
        name: "Internet Users",
        url: "https://en.wikipedia.org/wiki/List_of_countries_by_number_of_Internet_users",
        prompt: "Extract internet users data by country. Return country names with their internet user numbers or percentages for the top 30 countries."
    },
    {
        name: "Military Expenditure",
        url: "https://en.wikipedia.org/wiki/List_of_countries_by_military_expenditures",
        prompt: "Extract military spending data by country. Return country names with their military expenditure values for the top 30 countries."
    },
    {
        name: "Carbon Emissions",
        url: "https://en.wikipedia.org/wiki/List_of_countries_by_carbon_dioxide_emissions",
        prompt: "Extract carbon dioxide emissions data by country. Return country names with their CO2 emission values for the top 30 countries."
    },
    {
        name: "Renewable Energy",
        url: "https://en.wikipedia.org/wiki/List_of_countries_by_renewable_electricity_production",
        prompt: "Extract renewable energy production data by country. Return country names with their renewable energy percentages or values for the top 30 countries."
    }
];

function convertToGameFormat() {
    const gameCategories = {
        countries: {
            items: {},
            prompts: []
        }
    };
    
    // Convert existing data to game format
    Object.keys(wikipediaRankings).forEach((key, index) => {
        const ranking = wikipediaRankings[key];
        
        // Add countries to items if not already present
        Object.keys(ranking.data).forEach(country => {
            if (!gameCategories.countries.items[country]) {
                gameCategories.countries.items[country] = {
                    name: country,
                    code: generateCountryCode(country)
                };
            }
            // Add the ranking data as a property
            gameCategories.countries.items[country][key] = ranking.data[country];
        });
        
        // Create a prompt/challenge for this ranking
        const challengeNumber = index + 1;
        const challenge = {
            label: `<div style="text-align: center; padding: 20px;">
                <div style="font-weight: bold; font-size: 18px; color: #2c3e50; margin-bottom: 10px;">
                    Challenge ${challengeNumber.toString().padStart(3, '0')}: ${ranking.name}
                </div>
                <div style="font-size: 14px; color: #7f8c8d; margin-bottom: 15px;">
                    Rank countries from ${ranking.direction === 'desc' ? 'HIGHEST to LOWEST' : 'LOWEST to HIGHEST'}
                </div>
                <div style="font-size: 12px; color: #95a5a6;">
                    Source: ${ranking.source} | ${ranking.url}
                </div>
            </div>`,
            challenge: key,
            direction: ranking.direction
        };
        
        gameCategories.countries.prompts.push(challenge);
    });
    
    return gameCategories;
}

function generateCountryCode(countryName) {
    // Generate 3-letter codes from country names
    const cleanName = countryName.replace(/[^a-zA-Z\s]/g, '').trim();
    const words = cleanName.split(' ');
    
    if (words.length === 1) {
        return words[0].substring(0, 3).toUpperCase();
    } else {
        // Take first letter of each word, up to 3 letters
        return words.map(word => word[0]).join('').substring(0, 3).toUpperCase();
    }
}

function saveToFiles() {
    const fs = require('fs');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    
    // Save raw rankings data
    const rawDataFile = `wikipedia_rankings_raw_${timestamp}.json`;
    fs.writeFileSync(rawDataFile, JSON.stringify(wikipediaRankings, null, 2));
    
    // Save game-formatted data
    const gameData = convertToGameFormat();
    const gameDataFile = `wikipedia_rankings_game_format_${timestamp}.json`;
    fs.writeFileSync(gameDataFile, JSON.stringify(gameData, null, 2));
    
    // Generate integration script
    const integrationScript = `
// Wikipedia Rankings Integration Script
// Generated: ${new Date().toISOString()}

const wikipediaRankings = ${JSON.stringify(gameData, null, 2)};

// Function to integrate with existing game data
function integrateWikipediaRankings() {
    if (typeof window !== 'undefined' && window.GAME_DATA) {
        // Add new countries that don't exist
        Object.keys(wikipediaRankings.countries.items).forEach(countryName => {
            const countryData = wikipediaRankings.countries.items[countryName];
            if (!window.GAME_DATA.categories.countries.items[countryName]) {
                window.GAME_DATA.categories.countries.items[countryName] = countryData;
                console.log('Added new country:', countryName);
            } else {
                // Add new properties to existing countries
                Object.keys(countryData).forEach(prop => {
                    if (prop !== 'name' && prop !== 'code') {
                        window.GAME_DATA.categories.countries.items[countryName][prop] = countryData[prop];
                    }
                });
            }
        });
        
        // Add new challenges/prompts
        wikipediaRankings.countries.prompts.forEach(prompt => {
            window.GAME_DATA.categories.countries.prompts.push(prompt);
        });
        
        console.log(\`✅ Integrated \${Object.keys(wikipediaRankings.countries.items).length} countries and \${wikipediaRankings.countries.prompts.length} challenges\`);
    }
}

// Auto-integrate if in browser environment
if (typeof window !== 'undefined') {
    integrateWikipediaRankings();
}

// Export for Node.js
if (typeof module !== 'undefined') {
    module.exports = { wikipediaRankings, integrateWikipediaRankings };
}
`;
    
    const integrationFile = `integrate_wikipedia_rankings_${timestamp}.js`;
    fs.writeFileSync(integrationFile, integrationScript);
    
    console.log('📁 Files created:');
    console.log(`   - ${rawDataFile} (Raw rankings data)`);
    console.log(`   - ${gameDataFile} (Game-formatted data)`);  
    console.log(`   - ${integrationFile} (Integration script)`);
    
    return { rawDataFile, gameDataFile, integrationFile };
}

// Generate summary report
function generateReport() {
    const totalRankings = Object.keys(wikipediaRankings).length;
    const totalCountries = new Set();
    
    Object.values(wikipediaRankings).forEach(ranking => {
        Object.keys(ranking.data).forEach(country => totalCountries.add(country));
    });
    
    console.log('🌍 Wikipedia Rankings Extraction Report');
    console.log('=' * 50);
    console.log(`📊 Total rankings extracted: ${totalRankings}`);
    console.log(`🏳️ Unique countries found: ${totalCountries.size}`);
    console.log(`📋 Rankings included:`);
    
    Object.values(wikipediaRankings).forEach(ranking => {
        console.log(`   - ${ranking.name} (${Object.keys(ranking.data).length} countries)`);
    });
    
    console.log('\\n🚀 To add more rankings:');
    console.log('1. Use WebFetch to extract data from Wikipedia pages');
    console.log('2. Add the data to the wikipediaRankings object');
    console.log('3. Run this script again to regenerate files');
}

// Main execution
if (require.main === module) {
    console.log('🌍 Wikipedia Rankings Extractor for Outrank Game');
    generateReport();
    
    try {
        const files = saveToFiles();
        console.log('\\n✅ Extraction complete!');
        console.log('📁 Check the generated files for integration with your game.');
    } catch (error) {
        console.error('❌ Error saving files:', error);
    }
}

module.exports = { wikipediaRankings, convertToGameFormat, generateReport };