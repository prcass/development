#!/usr/bin/env node
/**
 * Enhanced Wikipedia Parser V2
 * Fixed table parsing for all Wikipedia ranking page types
 */

const https = require('https');
const fs = require('fs');

// Comprehensive table parsing configuration
const PARSING_STRATEGIES = {
    // Strategy 1: Standard wikitable with sortable
    wikitable: {
        tableRegex: /<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>(.*?)<\/table>/gis,
        rowRegex: /<tr[^>]*>(.*?)<\/tr>/gis,
        cellRegex: /<t[dh][^>]*>(.*?)<\/t[dh]>/gis,
        skipRows: 1
    },
    
    // Strategy 2: Any table with country data
    anyTable: {
        tableRegex: /<table[^>]*>(.*?)<\/table>/gis,
        rowRegex: /<tr[^>]*>(.*?)<\/tr>/gis,
        cellRegex: /<t[dh][^>]*>(.*?)<\/t[dh]>/gis,
        skipRows: 1
    },
    
    // Strategy 3: List format parsing
    listFormat: {
        itemRegex: /<li[^>]*>(.*?)<\/li>/gis,
        countryPattern: /([A-Z][a-z\s\-\.]+)[\s\-:]+([0-9,\.]+)/g
    }
};

// Common country name variations and mappings
const COUNTRY_MAPPINGS = {
    'United States': ['USA', 'US', 'America', 'United States of America'],
    'United Kingdom': ['UK', 'Britain', 'Great Britain'],
    'Russia': ['Russian Federation'],
    'South Korea': ['Republic of Korea', 'Korea, South'],
    'North Korea': ['Democratic People\'s Republic of Korea', 'Korea, North'],
    'Iran': ['Islamic Republic of Iran'],
    'Venezuela': ['Bolivarian Republic of Venezuela'],
    'Syria': ['Syrian Arab Republic'],
    'Tanzania': ['United Republic of Tanzania'],
    'Czech Republic': ['Czechia'],
    'Myanmar': ['Burma'],
    'East Timor': ['Timor-Leste'],
    'Ivory Coast': ['Côte d\'Ivoire'],
    'Democratic Republic of the Congo': ['Congo, Democratic Republic', 'DRC'],
    'Republic of the Congo': ['Congo, Republic'],
    'Eswatini': ['Swaziland']
};

// UN Member States
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

function cleanText(text) {
    if (!text) return '';
    
    return text
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\[[^\]]*\]/g, '') // Remove references
        .replace(/\([^)]*\)/g, '') // Remove parentheses content
        .replace(/†/g, '')
        .replace(/\*/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/—.*$/, '') // Remove everything after em dash
        .trim();
}

function normalizeCountryName(name) {
    const cleaned = cleanText(name);
    
    // Check direct match first
    if (UN_MEMBER_STATES.includes(cleaned)) {
        return cleaned;
    }
    
    // Check mappings
    for (const [standard, variations] of Object.entries(COUNTRY_MAPPINGS)) {
        if (variations.some(v => cleaned.toLowerCase().includes(v.toLowerCase()))) {
            return standard;
        }
    }
    
    // Check if it's a variation of a UN member state
    for (const country of UN_MEMBER_STATES) {
        if (cleaned.toLowerCase().includes(country.toLowerCase()) || 
            country.toLowerCase().includes(cleaned.toLowerCase())) {
            return country;
        }
    }
    
    return cleaned;
}

function isValidCountry(countryName) {
    const normalized = normalizeCountryName(countryName);
    return UN_MEMBER_STATES.includes(normalized);
}

function extractNumber(text) {
    if (!text) return null;
    
    // Remove commas and extract first number
    const match = text.replace(/,/g, '').match(/([0-9]+\.?[0-9]*)/);
    return match ? parseFloat(match[1]) : null;
}

function parseWithStrategy(html, strategy) {
    const results = {};
    
    if (strategy.tableRegex) {
        // Table-based parsing
        const tables = html.match(strategy.tableRegex);
        if (!tables) return results;
        
        tables.forEach(table => {
            const rows = table.match(strategy.rowRegex);
            if (!rows) return;
            
            // Skip header rows
            const dataRows = rows.slice(strategy.skipRows);
            
            dataRows.forEach(row => {
                const cells = [];
                let match;
                const cellRegex = new RegExp(strategy.cellRegex.source, 'g');
                
                while ((match = cellRegex.exec(row)) !== null) {
                    cells.push(cleanText(match[1]));
                }
                
                if (cells.length >= 2) {
                    // Try different column combinations
                    for (let countryCol = 0; countryCol < Math.min(3, cells.length); countryCol++) {
                        for (let valueCol = countryCol + 1; valueCol < cells.length; valueCol++) {
                            const countryName = normalizeCountryName(cells[countryCol]);
                            const value = extractNumber(cells[valueCol]);
                            
                            if (countryName && value !== null && isValidCountry(countryName)) {
                                if (!results[countryName] || value > (results[countryName] || 0)) {
                                    results[countryName] = value;
                                }
                                break; // Found valid data for this row
                            }
                        }
                        if (results[normalizeCountryName(cells[countryCol])]) break;
                    }
                }
            });
        });
    } else if (strategy.itemRegex) {
        // List-based parsing
        const items = html.match(strategy.itemRegex);
        if (!items) return results;
        
        items.forEach(item => {
            const matches = item.matchAll(strategy.countryPattern);
            for (const match of matches) {
                const countryName = normalizeCountryName(match[1]);
                const value = extractNumber(match[2]);
                
                if (countryName && value !== null && isValidCountry(countryName)) {
                    results[countryName] = value;
                }
            }
        });
    }
    
    return results;
}

function parseWikipediaPage(html) {
    console.log(`   📊 Trying multiple parsing strategies...`);
    
    let bestResults = {};
    let bestCount = 0;
    let bestStrategy = '';
    
    // Try all parsing strategies
    for (const [strategyName, strategy] of Object.entries(PARSING_STRATEGIES)) {
        const results = parseWithStrategy(html, strategy);
        const count = Object.keys(results).length;
        
        console.log(`   🔍 Strategy "${strategyName}": ${count} countries`);
        
        if (count > bestCount) {
            bestResults = results;
            bestCount = count;
            bestStrategy = strategyName;
        }
    }
    
    console.log(`   ✅ Best strategy: "${bestStrategy}" with ${bestCount} countries`);
    
    if (bestCount > 0) {
        const topCountries = Object.keys(bestResults).slice(0, 3);
        console.log(`   🎯 Top countries: ${topCountries.join(', ')}`);
    }
    
    return bestResults;
}

function makeHttpsRequest(url) {
    return new Promise((resolve, reject) => {
        const request = https.get(url, { 
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; WikipediaDataExtractor/2.0)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Connection': 'keep-alive'
            },
            timeout: 30000
        }, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
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

// Test with a few key categories
const TEST_CATEGORIES = {
    lifeExpectancy: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_life_expectancy', category: 'Health' },
    gdpNominal: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)', category: 'Economy' },
    population: { url: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population', category: 'Geography' },
    potatoProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_potato_production', category: 'Agriculture' },
    militaryExpenditure: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_military_expenditures', category: 'Military' }
};

async function testParser() {
    console.log('🧪 Testing Enhanced Wikipedia Parser V2');
    console.log('=====================================\n');
    
    for (const [key, config] of Object.entries(TEST_CATEGORIES)) {
        console.log(`\n🔍 Testing: ${key}`);
        console.log(`   URL: ${config.url}`);
        
        try {
            const html = await makeHttpsRequest(config.url);
            console.log(`   📥 Downloaded: ${Math.round(html.length / 1024)}KB`);
            
            const results = parseWikipediaPage(html);
            
            if (Object.keys(results).length > 0) {
                console.log(`   ✅ SUCCESS: Extracted ${Object.keys(results).length} countries`);
                
                // Show top 5 results
                const entries = Object.entries(results).slice(0, 5);
                entries.forEach(([country, value]) => {
                    console.log(`      ${country}: ${value}`);
                });
            } else {
                console.log(`   ❌ FAILED: No data extracted`);
            }
            
        } catch (error) {
            console.log(`   ❌ ERROR: ${error.message}`);
        }
    }
}

if (require.main === module) {
    testParser().catch(console.error);
}

module.exports = { parseWikipediaPage, makeHttpsRequest, normalizeCountryName, isValidCountry };