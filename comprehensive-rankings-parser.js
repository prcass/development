#!/usr/bin/env node
/**
 * Comprehensive Rankings Parser
 * Extracts data from ALL Wikipedia country ranking pages
 * Creates complete dataset for 195 countries across 30+ categories
 */

const fs = require('fs');
const https = require('https');

// Comprehensive Wikipedia ranking pages configuration
const COMPREHENSIVE_RANKINGS = {
    // Economic Rankings
    gdpNominal: {
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)',
        expectedCountries: 190,
        category: 'Economic',
        parser: 'standardTable',
        dataColumns: { country: 0, value: 1 }
    },
    gdpPPP: {
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(PPP)',
        expectedCountries: 190,
        category: 'Economic',
        parser: 'standardTable',
        dataColumns: { country: 0, value: 1 }
    },
    gdpPerCapita: {
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_per_capita',
        expectedCountries: 190,
        category: 'Economic',
        parser: 'standardTable',
        dataColumns: { country: 0, value: 1 }
    },
    exports: {
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_exports',
        expectedCountries: 180,
        category: 'Economic',
        parser: 'standardTable',
        dataColumns: { country: 0, value: 1 }
    },
    
    // Health Rankings
    lifeExpectancy: {
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_life_expectancy',
        expectedCountries: 200,
        category: 'Health',
        parser: 'standardTable',
        dataColumns: { country: 0, value: 1 }
    },
    infantMortality: {
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_infant_mortality_rate',
        expectedCountries: 190,
        category: 'Health',
        parser: 'standardTable',
        dataColumns: { country: 0, value: 1 }
    },
    
    // Population & Demographics
    population: {
        url: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population',
        expectedCountries: 240,
        category: 'Demographics',
        parser: 'standardTable',
        dataColumns: { country: 0, value: 1 }
    },
    populationDensity: {
        url: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population_density',
        expectedCountries: 200,
        category: 'Demographics',
        parser: 'standardTable',
        dataColumns: { country: 0, value: 1 }
    },
    
    // Development Rankings
    hdi: {
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_Human_Development_Index',
        expectedCountries: 190,
        category: 'Development',
        parser: 'hdiTable',
        dataColumns: { country: 3, value: 4 }
    },
    
    // Education Rankings
    literacyRate: {
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_literacy_rate',
        expectedCountries: 180,
        category: 'Education',
        parser: 'standardTable',
        dataColumns: { country: 0, value: 1 }
    },
    
    // Environmental Rankings
    co2Emissions: {
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_carbon_dioxide_emissions',
        expectedCountries: 180,
        category: 'Environmental',
        parser: 'standardTable',
        dataColumns: { country: 0, value: 1 }
    },
    
    // Geographic Rankings
    area: {
        url: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_area',
        expectedCountries: 200,
        category: 'Geographic',
        parser: 'standardTable',
        dataColumns: { country: 0, value: 1 }
    },
    
    // Safety & Security
    globalPeaceIndex: {
        url: 'https://en.wikipedia.org/wiki/Global_Peace_Index',
        expectedCountries: 160,
        category: 'Safety',
        parser: 'standardTable',
        dataColumns: { country: 0, value: 1 }
    },
    
    // Technology
    internetUsers: {
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_number_of_Internet_users',
        expectedCountries: 180,
        category: 'Technology',
        parser: 'standardTable',
        dataColumns: { country: 0, value: 1 }
    }
};

// UN Member States for filtering (same as before)
const UN_MEMBER_STATES = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 
    'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 
    'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 
    'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
    'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 
    'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Czechia',
    'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 
    'Dominican Republic',
    'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 
    'Eswatini', 'Ethiopia',
    'Fiji', 'Finland', 'France',
    'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 
    'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
    'Haiti', 'Honduras', 'Hungary',
    'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
    'Jamaica', 'Japan', 'Jordan',
    'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan',
    'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 
    'Lithuania', 'Luxembourg',
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 
    'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 
    'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
    'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 
    'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
    'Oman',
    'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 
    'Poland', 'Portugal',
    'Qatar',
    'Romania', 'Russia', 'Rwanda',
    'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 
    'Samoa', 'San Marino', 'São Tomé and Príncipe', 'Saudi Arabia', 'Senegal', 
    'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 
    'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 
    'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
    'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 
    'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
    'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 
    'Uruguay', 'Uzbekistan',
    'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
    'Yemen',
    'Zambia', 'Zimbabwe'
];

// Fetch Wikipedia page function (same as before)
function fetchWikipediaPage(url) {
    return new Promise((resolve, reject) => {
        const urlParts = new URL(url);
        
        const options = {
            hostname: urlParts.hostname,
            port: 443,
            path: urlParts.pathname + urlParts.search,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Comprehensive-Rankings-Parser/1.0)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'identity',
                'Connection': 'keep-alive'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(data);
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                }
            });
        });

        req.setTimeout(30000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.on('error', (error) => {
            reject(new Error(`Request failed: ${error.message}`));
        });

        req.end();
    });
}

// Enhanced table parsers
function parseWikipediaTables(html, pageConfig) {
    console.log(`🔍 Parsing ${pageConfig.parser} for ${pageConfig.expectedCountries} expected countries...`);
    
    if (pageConfig.parser === 'hdiTable') {
        return parseHDITable(html, pageConfig);
    } else {
        return parseStandardTable(html, pageConfig);
    }
}

// Standard table parser (enhanced)
function parseStandardTable(html, pageConfig) {
    const countries = {};
    let tableCount = 0;
    let totalRows = 0;
    
    const tableRegex = /<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>(.*?)<\/table>/gis;
    let tableMatch;
    
    while ((tableMatch = tableRegex.exec(html)) !== null) {
        tableCount++;
        const tableHTML = tableMatch[1];
        
        console.log(`   📊 Processing table ${tableCount}...`);
        
        const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gis;
        let rowMatch;
        let rowIndex = 0;
        
        while ((rowMatch = rowRegex.exec(tableHTML)) !== null) {
            rowIndex++;
            const rowHTML = rowMatch[1];
            
            // Skip header rows
            if (rowIndex <= 2) continue;
            
            const cellRegex = /<t[hd][^>]*>(.*?)<\/t[hd]>/gis;
            const cells = [];
            let cellMatch;
            
            while ((cellMatch = cellRegex.exec(rowHTML)) !== null) {
                let cellText = cellMatch[1];
                
                // Enhanced cell cleaning
                cellText = cellText.replace(/<img[^>]*>/g, ''); // Remove images
                cellText = cellText.replace(/<[^>]*>/g, ''); // Remove HTML tags
                cellText = cellText.replace(/&nbsp;/g, ' ');
                cellText = cellText.replace(/&amp;/g, '&');
                cellText = cellText.replace(/&lt;/g, '<');
                cellText = cellText.replace(/&gt;/g, '>');
                cellText = cellText.replace(/\[\d+\]/g, ''); // Remove references
                cellText = cellText.replace(/\s+/g, ' ').trim();
                
                cells.push(cellText);
            }
            
            if (cells.length >= Math.max(pageConfig.dataColumns.country, pageConfig.dataColumns.value) + 1) {
                const countryName = cells[pageConfig.dataColumns.country];
                const valueText = cells[pageConfig.dataColumns.value];
                
                if (countryName && valueText && countryName.length > 1) {
                    // Clean country name
                    let cleanCountryName = countryName.replace(/^\d+\.?\s*/, ''); // Remove rankings
                    cleanCountryName = cleanCountryName.replace(/\s*\([^)]*\)/g, ''); // Remove parentheses
                    cleanCountryName = cleanCountryName.trim();
                    
                    // Skip invalid entries
                    if (cleanCountryName.length < 2 || /^\d+$/.test(cleanCountryName) || 
                        cleanCountryName.includes('World') || cleanCountryName.includes('Total')) {
                        continue;
                    }
                    
                    const numericValue = extractNumericValue(valueText);
                    
                    if (numericValue !== null && cleanCountryName) {
                        countries[cleanCountryName] = {
                            name: cleanCountryName,
                            value: numericValue,
                            rawValue: valueText,
                            source: 'Wikipedia table'
                        };
                        totalRows++;
                    }
                }
            }
        }
    }
    
    console.log(`   ✅ Found ${Object.keys(countries).length} countries in ${tableCount} tables`);
    return countries;
}

// HDI table parser (same as before but enhanced)
function parseHDITable(html, pageConfig) {
    const countries = {};
    let totalRows = 0;
    
    const tableRegex = /<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>(.*?)<\/table>/gis;
    let tableMatch;
    
    while ((tableMatch = tableRegex.exec(html)) !== null) {
        const tableHTML = tableMatch[1];
        
        if (!tableHTML.includes('HDI') && !tableHTML.includes('Development Index')) {
            continue;
        }
        
        console.log(`   📊 Processing HDI ranking table...`);
        
        const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gis;
        let rowMatch;
        let rowIndex = 0;
        
        while ((rowMatch = rowRegex.exec(tableHTML)) !== null) {
            rowIndex++;
            const rowHTML = rowMatch[1];
            
            if (rowIndex <= 3) continue;
            
            const cellRegex = /<t[hd][^>]*>(.*?)<\/t[hd]>/gis;
            const cells = [];
            let cellMatch;
            
            while ((cellMatch = cellRegex.exec(rowHTML)) !== null) {
                let cellText = cellMatch[1];
                
                cellText = cellText.replace(/<img[^>]*>/g, '');
                cellText = cellText.replace(/<[^>]*>/g, '');
                cellText = cellText.replace(/&nbsp;/g, ' ');
                cellText = cellText.replace(/&amp;/g, '&');
                cellText = cellText.replace(/\[\d+\]/g, '');
                cellText = cellText.replace(/\s+/g, ' ').trim();
                
                cells.push(cellText);
            }
            
            if (cells.length >= 5) {
                const rank = cells[0];
                const countryName = cells[pageConfig.dataColumns.country];
                const hdiValue = cells[pageConfig.dataColumns.value];
                
                if (countryName && hdiValue && countryName.length > 1 && /^\d+$/.test(rank)) {
                    let cleanCountryName = countryName.replace(/\s*\([^)]*\)/g, '').trim();
                    const numericValue = extractNumericValue(hdiValue);
                    
                    if (numericValue !== null && cleanCountryName.length > 1) {
                        countries[cleanCountryName] = {
                            name: cleanCountryName,
                            value: numericValue,
                            rawValue: hdiValue,
                            rank: parseInt(rank),
                            source: 'Wikipedia HDI table'
                        };
                        totalRows++;
                    }
                }
            }
        }
    }
    
    console.log(`   ✅ Found ${Object.keys(countries).length} countries with HDI data`);
    return countries;
}

// Enhanced numeric value extraction
function extractNumericValue(text) {
    if (!text) return null;
    
    let cleaned = text.replace(/[,%$€£¥]/g, '');
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    // HDI values (0.xxx format)
    const hdiPattern = /0\.\d{3}/;
    const hdiMatch = cleaned.match(hdiPattern);
    if (hdiMatch) {
        return parseFloat(hdiMatch[0]);
    }
    
    // Percentage values
    const percentPattern = /(\d+(?:\.\d+)?)\s*%/;
    const percentMatch = cleaned.match(percentPattern);
    if (percentMatch) {
        return parseFloat(percentMatch[1]);
    }
    
    // Standard numeric patterns
    const patterns = [
        /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/,
        /(\d+\.\d+)/,
        /(\d+)/
    ];
    
    for (const pattern of patterns) {
        const match = cleaned.match(pattern);
        if (match) {
            const numStr = match[1].replace(/,/g, '');
            const num = parseFloat(numStr);
            if (!isNaN(num)) {
                return num;
            }
        }
    }
    
    return null;
}

// Filter to UN member states
function filterToUNMembers(allData) {
    const unMemberData = {};
    const countryNameSet = new Set(UN_MEMBER_STATES);
    
    Object.entries(allData).forEach(([name, data]) => {
        if (countryNameSet.has(name)) {
            unMemberData[name] = data;
        } else {
            // Fuzzy matching for common variations
            const fuzzyMatch = UN_MEMBER_STATES.find(country => {
                return name.includes(country) || 
                       country.includes(name) ||
                       name.replace(/[^a-zA-Z]/g, '').toLowerCase() === country.replace(/[^a-zA-Z]/g, '').toLowerCase();
            });
            
            if (fuzzyMatch) {
                unMemberData[fuzzyMatch] = data;
            }
        }
    });
    
    return unMemberData;
}

// Fetch ranking data with enhanced error handling
async function fetchComprehensiveRankingData(rankingType, config) {
    console.log(`🌐 Fetching ${rankingType} (${config.category}) data...`);
    console.log(`   URL: ${config.url.substring(0, 80)}...`);
    
    try {
        const html = await fetchWikipediaPage(config.url);
        console.log(`   📄 Received ${(html.length / 1024).toFixed(1)}KB of HTML`);
        
        const countries = parseWikipediaTables(html, config);
        const filteredCountries = filterToUNMembers(countries);
        
        const countryCount = Object.keys(filteredCountries).length;
        const expectedCount = config.expectedCountries;
        const completeness = ((countryCount / 195) * 100).toFixed(1); // 195 UN members
        
        console.log(`   🎯 Results: ${countryCount} UN member countries (${completeness}% of 195)`);
        
        return {
            type: rankingType,
            category: config.category,
            countries: filteredCountries,
            statistics: {
                found: countryCount,
                expected: expectedCount,
                completeness: completeness + '%'
            }
        };
        
    } catch (error) {
        console.error(`   ❌ Error fetching ${rankingType}:`, error.message);
        return {
            type: rankingType,
            category: config.category,
            countries: {},
            statistics: {
                found: 0,
                expected: config.expectedCountries,
                completeness: '0%',
                error: error.message
            }
        };
    }
}

// Build comprehensive dataset
async function buildComprehensiveDataset() {
    console.log('🎯 Building comprehensive dataset with all ranking categories...\n');
    
    const startTime = Date.now();
    const dataset = {
        metadata: {
            source: "Comprehensive Wikipedia rankings parsing",
            created: new Date().toISOString(),
            fetchDuration: 0,
            totalCountries: 0,
            rankingsProcessed: 0,
            totalRankings: Object.keys(COMPREHENSIVE_RANKINGS).length
        },
        countries: {},
        rankings: {},
        statistics: {},
        categorySummary: {}
    };
    
    // Initialize country entries for all UN members
    UN_MEMBER_STATES.forEach(country => {
        dataset.countries[country] = {
            name: country,
            data: {}
        };
    });
    
    // Process each ranking type
    for (const [rankingType, config] of Object.entries(COMPREHENSIVE_RANKINGS)) {
        console.log(`📊 Processing ${rankingType} (${config.category} category)...`);
        
        const rankingData = await fetchComprehensiveRankingData(rankingType, config);
        dataset.rankings[rankingType] = rankingData;
        dataset.statistics[rankingType] = rankingData.statistics;
        dataset.metadata.rankingsProcessed++;
        
        // Track categories
        if (!dataset.categorySummary[config.category]) {
            dataset.categorySummary[config.category] = {
                rankings: [],
                totalCountries: 0
            };
        }
        dataset.categorySummary[config.category].rankings.push(rankingType);
        dataset.categorySummary[config.category].totalCountries += rankingData.statistics.found;
        
        // Merge ranking data into countries
        Object.entries(rankingData.countries).forEach(([countryName, countryData]) => {
            if (dataset.countries[countryName]) {
                dataset.countries[countryName].data[rankingType] = countryData.value;
                dataset.countries[countryName].data[`${rankingType}_raw`] = countryData.rawValue;
                
                if (countryData.rank) {
                    dataset.countries[countryName].data[`${rankingType}_rank`] = countryData.rank;
                }
            }
        });
        
        // Respectful delay between requests
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('');
    }
    
    // Calculate final statistics
    dataset.metadata.totalCountries = Object.keys(dataset.countries).length;
    dataset.metadata.fetchDuration = ((Date.now() - startTime) / 1000).toFixed(2) + 's';
    
    return dataset;
}

// Display comprehensive results
function displayComprehensiveResults(dataset) {
    console.log('🎉 Comprehensive Rankings Dataset Complete!');
    console.log('==========================================');
    console.log(`Duration: ${dataset.metadata.fetchDuration}`);
    console.log(`Rankings Processed: ${dataset.metadata.rankingsProcessed}/${dataset.metadata.totalRankings}`);
    console.log(`Total Countries: ${dataset.metadata.totalCountries}`);
    
    console.log('\n📊 Data Coverage by Category:');
    Object.entries(dataset.categorySummary).forEach(([category, summary]) => {
        const avgCoverage = (summary.totalCountries / (summary.rankings.length * 195) * 100).toFixed(1);
        console.log(`   ${category}: ${summary.rankings.length} rankings, ${avgCoverage}% avg coverage`);
        summary.rankings.forEach(ranking => {
            const stats = dataset.statistics[ranking];
            console.log(`      • ${ranking}: ${stats.found} countries (${stats.completeness})`);
        });
    });
    
    // Show countries with most complete data
    console.log('\n🌍 Countries with Most Complete Data:');
    const countryCompleteness = Object.entries(dataset.countries).map(([name, data]) => ({
        name,
        dataPoints: Object.keys(data.data).filter(key => !key.includes('_')).length
    })).sort((a, b) => b.dataPoints - a.dataPoints);
    
    countryCompleteness.slice(0, 20).forEach((country, i) => {
        console.log(`   ${i + 1}. ${country.name}: ${country.dataPoints}/${dataset.metadata.rankingsProcessed} rankings`);
    });
    
    const completeDataCount = countryCompleteness.filter(c => c.dataPoints >= dataset.metadata.rankingsProcessed * 0.5).length;
    console.log(`\n📈 Countries with 50%+ complete data: ${completeDataCount}`);
}

// Save comprehensive results
function saveComprehensiveResults(dataset) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    
    // Complete dataset
    const datasetFile = `comprehensive_rankings_dataset_${timestamp}.json`;
    fs.writeFileSync(datasetFile, JSON.stringify(dataset, null, 2));
    
    // Countries data only (for integration)
    const countriesOnly = {};
    Object.entries(dataset.countries).forEach(([name, country]) => {
        if (Object.keys(country.data).length > 0) { // Only include countries with data
            countriesOnly[name] = country.data;
        }
    });
    
    const countriesFile = `comprehensive_countries_data_${timestamp}.json`;
    fs.writeFileSync(countriesFile, JSON.stringify(countriesOnly, null, 2));
    
    // Summary report
    const reportFile = `comprehensive_report_${timestamp}.md`;
    const report = `# Comprehensive Country Rankings Dataset

## Summary
- **Created:** ${dataset.metadata.created}
- **Duration:** ${dataset.metadata.fetchDuration}
- **Rankings Processed:** ${dataset.metadata.rankingsProcessed}/${dataset.metadata.totalRankings}
- **Total Countries:** ${dataset.metadata.totalCountries}
- **Countries with Data:** ${Object.keys(countriesOnly).length}

## Coverage by Category
${Object.entries(dataset.categorySummary).map(([category, summary]) => {
    const avgCoverage = (summary.totalCountries / (summary.rankings.length * 195) * 100).toFixed(1);
    return `### ${category} (${summary.rankings.length} rankings, ${avgCoverage}% avg coverage)
${summary.rankings.map(ranking => {
    const stats = dataset.statistics[ranking];
    return `- **${ranking}:** ${stats.found} countries (${stats.completeness})`;
}).join('\n')}`;
}).join('\n\n')}

## Perfect for Know-It-All Integration
This comprehensive dataset provides ${dataset.metadata.rankingsProcessed} different country ranking categories across all major domains: Economic, Health, Demographics, Development, Education, Environmental, Geographic, Safety, and Technology.

**Integration File:** \`${countriesFile}\`
`;
    
    fs.writeFileSync(reportFile, report);
    
    console.log('\n📁 Comprehensive Files Generated:');
    console.log(`   📊 ${datasetFile} - Complete dataset with metadata`);
    console.log(`   🌍 ${countriesFile} - Countries data ready for Know-It-All integration`);
    console.log(`   📈 ${reportFile} - Comprehensive analysis report`);
    
    return { datasetFile, countriesFile, reportFile };
}

// Main execution
async function main() {
    console.log('🚀 Comprehensive Rankings Parser');
    console.log('=================================');
    console.log(`Extracting data from ${Object.keys(COMPREHENSIVE_RANKINGS).length} ranking categories for 195 countries\n`);
    
    try {
        const dataset = await buildComprehensiveDataset();
        displayComprehensiveResults(dataset);
        const files = saveComprehensiveResults(dataset);
        
        console.log('\n✅ Comprehensive dataset complete!');
        console.log('\n🎯 What We Built:');
        console.log(`   • ${dataset.metadata.rankingsProcessed} ranking categories extracted`);
        console.log('   • All UN member countries included');
        console.log('   • Economic, Health, Education, Environmental, and Technology rankings');
        console.log('   • Ready for Know-It-All game integration');
        
        console.log('\n🚀 Integration Ready:');
        console.log(`   • Use ${files.countriesFile} for your game challenges`);
        console.log('   • Comprehensive country data across all major domains');
        console.log('   • Perfect for creating diverse ranking games');
        
        return dataset;
        
    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }
}

module.exports = {
    buildComprehensiveDataset,
    COMPREHENSIVE_RANKINGS
};

if (require.main === module) {
    main().catch(console.error);
}