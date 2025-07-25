#!/usr/bin/env node
/**
 * Enhanced Wikipedia Table Parser
 * Improved parsing for HDI and other complex table structures
 * Gets all countries with complete ranking data
 */

const fs = require('fs');
const https = require('https');

// Enhanced Wikipedia pages configuration
const ENHANCED_RANKING_PAGES = {
    lifeExpectancy: {
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_life_expectancy',
        expectedCountries: 200,
        parser: 'standardTable',
        dataColumns: {
            country: 0,
            value: 1
        }
    },
    gdpNominal: {
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)',
        expectedCountries: 190,
        parser: 'standardTable',
        dataColumns: {
            country: 0,
            value: 1
        }
    },
    population: {
        url: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population',
        expectedCountries: 240,
        parser: 'standardTable',
        dataColumns: {
            country: 0,
            value: 1
        }
    },
    hdi: {
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_Human_Development_Index',
        expectedCountries: 190,
        parser: 'hdiTable',
        dataColumns: {
            country: 3,  // Country name is in 4th column (after rank, change, flag)
            value: 4     // HDI value is in 5th column
        }
    }
};

// Fetch Wikipedia page (same as before)
function fetchWikipediaPage(url) {
    return new Promise((resolve, reject) => {
        const urlParts = new URL(url);
        
        const options = {
            hostname: urlParts.hostname,
            port: 443,
            path: urlParts.pathname + urlParts.search,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Enhanced-Wikipedia-Parser/1.0)',
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

// Enhanced table parser with specialized handlers
function parseWikipediaTables(html, pageConfig) {
    console.log(`🔍 Parsing ${pageConfig.parser} for ${pageConfig.expectedCountries} expected countries...`);
    
    if (pageConfig.parser === 'hdiTable') {
        return parseHDITable(html, pageConfig);
    } else {
        return parseStandardTable(html, pageConfig);
    }
}

// Specialized HDI table parser
function parseHDITable(html, pageConfig) {
    const countries = {};
    let totalRows = 0;
    
    // Find the main HDI ranking table
    const tableRegex = /<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>(.*?)<\/table>/gis;
    let tableMatch;
    
    while ((tableMatch = tableRegex.exec(html)) !== null) {
        const tableHTML = tableMatch[1];
        
        // Look for HDI-specific content to identify the right table
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
            
            // Skip header rows
            if (rowIndex <= 3) continue;
            
            // Extract cells from row
            const cellRegex = /<t[hd][^>]*>(.*?)<\/t[hd]>/gis;
            const cells = [];
            let cellMatch;
            
            while ((cellMatch = cellRegex.exec(rowHTML)) !== null) {
                let cellText = cellMatch[1];
                
                // Enhanced cell cleaning for HDI table
                cellText = cellText.replace(/<img[^>]*>/g, ''); // Remove flag images
                cellText = cellText.replace(/<[^>]*>/g, ''); // Remove all HTML tags
                cellText = cellText.replace(/&nbsp;/g, ' ');
                cellText = cellText.replace(/&amp;/g, '&');
                cellText = cellText.replace(/\[\d+\]/g, ''); // Remove references
                cellText = cellText.replace(/\s+/g, ' ').trim();
                
                cells.push(cellText);
            }
            
            // Process HDI row if it has enough cells
            if (cells.length >= 5) {
                const rank = cells[0];
                const countryName = cells[pageConfig.dataColumns.country];
                const hdiValue = cells[pageConfig.dataColumns.value];
                
                // Validate this looks like a country row
                if (countryName && hdiValue && countryName.length > 1 && /^\d+$/.test(rank)) {
                    // Clean country name
                    let cleanCountryName = countryName.replace(/\s*\([^)]*\)/g, ''); // Remove parentheses
                    cleanCountryName = cleanCountryName.trim();
                    
                    // Extract HDI numeric value
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
    
    console.log(`   ✅ Found ${Object.keys(countries).length} countries with HDI data (${totalRows} rows processed)`);
    return countries;
}

// Standard table parser (for life expectancy, GDP, population)
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
                
                // Clean cell content
                cellText = cellText.replace(/<[^>]*>/g, '');
                cellText = cellText.replace(/&nbsp;/g, ' ');
                cellText = cellText.replace(/&amp;/g, '&');
                cellText = cellText.replace(/\[\d+\]/g, '');
                cellText = cellText.replace(/\s+/g, ' ').trim();
                
                cells.push(cellText);
            }
            
            if (cells.length >= 2) {
                const countryName = cells[pageConfig.dataColumns.country];
                const valueText = cells[pageConfig.dataColumns.value];
                
                if (countryName && valueText && countryName.length > 1) {
                    let cleanCountryName = countryName.replace(/^\d+\.?\s*/, '');
                    cleanCountryName = cleanCountryName.replace(/\s*\([^)]*\)/g, '');
                    cleanCountryName = cleanCountryName.trim();
                    
                    if (cleanCountryName.length < 2 || /^\d+$/.test(cleanCountryName)) {
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

// Enhanced numeric value extraction
function extractNumericValue(text) {
    if (!text) return null;
    
    let cleaned = text.replace(/[,%$€£¥]/g, '');
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    // Special handling for HDI values (0.xxx format)
    const hdiPattern = /0\.\d{3}/;
    const hdiMatch = cleaned.match(hdiPattern);
    if (hdiMatch) {
        return parseFloat(hdiMatch[0]);
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

// Fetch and parse ranking data with enhanced error handling
async function fetchEnhancedRankingData(rankingType, config) {
    console.log(`🌐 Fetching ${rankingType} data from Wikipedia...`);
    console.log(`   URL: ${config.url}`);
    console.log(`   Parser: ${config.parser}`);
    
    try {
        const html = await fetchWikipediaPage(config.url);
        console.log(`   📄 Received ${(html.length / 1024).toFixed(1)}KB of HTML`);
        
        const countries = parseWikipediaTables(html, config);
        
        const countryCount = Object.keys(countries).length;
        const expectedCount = config.expectedCountries;
        const completeness = ((countryCount / expectedCount) * 100).toFixed(1);
        
        console.log(`   🎯 Results: ${countryCount}/${expectedCount} countries (${completeness}% completeness)`);
        
        // Check if we got reasonable results
        if (countryCount < expectedCount * 0.3) {
            console.log(`   ⚠️  Very low data yield - parser may need further adjustments`);
        } else if (countryCount < expectedCount * 0.7) {
            console.log(`   ⚠️  Moderate data yield - some countries may be missing`);
        } else {
            console.log(`   ✅ Good data yield - parser working well`);
        }
        
        return {
            type: rankingType,
            countries: countries,
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
async function buildEnhancedDataset() {
    console.log('🎯 Building enhanced dataset with improved HDI parsing...\n');
    
    const startTime = Date.now();
    const dataset = {
        metadata: {
            source: "Enhanced Wikipedia HTML table parsing",
            created: new Date().toISOString(),
            fetchDuration: 0,
            totalCountries: 0,
            pagesProcessed: 0
        },
        countries: {},
        rankings: {},
        statistics: {}
    };
    
    // Process each ranking type with enhanced parsing
    for (const [rankingType, config] of Object.entries(ENHANCED_RANKING_PAGES)) {
        console.log(`📊 Processing ${rankingType} with ${config.parser}...`);
        
        const rankingData = await fetchEnhancedRankingData(rankingType, config);
        dataset.rankings[rankingType] = rankingData;
        dataset.statistics[rankingType] = rankingData.statistics;
        dataset.metadata.pagesProcessed++;
        
        // Merge countries into main dataset
        Object.entries(rankingData.countries).forEach(([countryName, countryData]) => {
            if (!dataset.countries[countryName]) {
                dataset.countries[countryName] = {
                    name: countryName,
                    data: {}
                };
            }
            
            // Add ranking data
            dataset.countries[countryName].data[rankingType] = countryData.value;
            dataset.countries[countryName].data[`${rankingType}_raw`] = countryData.rawValue;
            
            // Add rank if available (HDI has ranks)
            if (countryData.rank) {
                dataset.countries[countryName].data[`${rankingType}_rank`] = countryData.rank;
            }
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('');
    }
    
    dataset.metadata.totalCountries = Object.keys(dataset.countries).length;
    dataset.metadata.fetchDuration = ((Date.now() - startTime) / 1000).toFixed(2) + 's';
    
    return dataset;
}

// Display enhanced results
function displayEnhancedResults(dataset) {
    console.log('🎉 Enhanced Wikipedia Parsing Complete!');
    console.log('=======================================');
    console.log(`Duration: ${dataset.metadata.fetchDuration}`);
    console.log(`Total Countries: ${dataset.metadata.totalCountries}`);
    
    console.log('\n📊 Enhanced Data Coverage:');
    Object.entries(dataset.statistics).forEach(([ranking, stats]) => {
        const status = stats.error ? '❌' : '✅';
        const improvement = getImprovement(ranking, stats.found);
        console.log(`   ${status} ${ranking}: ${stats.found}/${stats.expected} countries (${stats.completeness})${improvement}`);
    });
    
    // Show sample of best countries
    console.log('\n🌍 Sample Countries with Complete Data:');
    const completeCountries = Object.entries(dataset.countries)
        .filter(([_, data]) => Object.keys(data.data).filter(k => !k.includes('_')).length >= 3)
        .slice(0, 15);
    
    completeCountries.forEach(([name, data], i) => {
        const dataPoints = Object.keys(data.data).filter(k => !k.includes('_')).length;
        console.log(`   ${i + 1}. ${name}: ${dataPoints}/4 rankings`);
    });
    
    console.log(`\n📈 Total Complete Countries: ${completeCountries.length}`);
}

function getImprovement(ranking, found) {
    const baselines = {
        lifeExpectancy: 79,
        gdpNominal: 22,
        population: 95,
        hdi: 20
    };
    
    const baseline = baselines[ranking];
    if (baseline && found > baseline) {
        const improvement = found - baseline;
        const percent = ((improvement / baseline) * 100).toFixed(0);
        return ` (+${improvement}, +${percent}%)`;
    }
    return '';
}

// Save enhanced results
function saveEnhancedResults(dataset) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    
    const datasetFile = `enhanced_wikipedia_dataset_${timestamp}.json`;
    fs.writeFileSync(datasetFile, JSON.stringify(dataset, null, 2));
    
    const countriesOnly = {};
    Object.entries(dataset.countries).forEach(([name, country]) => {
        countriesOnly[name] = country.data;
    });
    
    const countriesFile = `enhanced_countries_data_${timestamp}.json`;
    fs.writeFileSync(countriesFile, JSON.stringify(countriesOnly, null, 2));
    
    console.log('\n📁 Enhanced Files Generated:');
    console.log(`   📊 ${datasetFile} - Complete enhanced dataset`);
    console.log(`   🌍 ${countriesFile} - Countries data ready for integration`);
    
    return { datasetFile, countriesFile };
}

// Main execution
async function main() {
    console.log('🚀 Enhanced Wikipedia Table Parser');
    console.log('==================================');
    console.log('Improved parsing with specialized HDI table handler\n');
    
    try {
        const dataset = await buildEnhancedDataset();
        displayEnhancedResults(dataset);
        const files = saveEnhancedResults(dataset);
        
        console.log('\n✅ Enhanced parsing complete!');
        console.log('\n🎯 Key Improvements:');
        console.log('   • Specialized HDI table parser');
        console.log('   • Better cell content cleaning');
        console.log('   • Enhanced numeric value extraction');
        console.log('   • Comprehensive country ranking dataset');
        
        return dataset;
        
    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }
}

module.exports = {
    buildEnhancedDataset,
    ENHANCED_RANKING_PAGES
};

if (require.main === module) {
    main().catch(console.error);
}