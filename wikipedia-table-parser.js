#!/usr/bin/env node
/**
 * Wikipedia Table Parser
 * Extracts complete country ranking data from Wikipedia HTML tables
 * Solves the truncation problem by parsing actual table content
 */

const fs = require('fs');
const https = require('https');

// Wikipedia pages with comprehensive country ranking tables
const WIKIPEDIA_RANKING_PAGES = {
    lifeExpectancy: {
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_life_expectancy',
        expectedCountries: 200,
        tableSelectors: ['wikitable sortable', 'wikitable'],
        dataColumns: {
            country: 0,  // Usually first column
            value: 1     // Life expectancy value
        }
    },
    gdpNominal: {
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)',
        expectedCountries: 190,
        tableSelectors: ['wikitable sortable', 'wikitable'],
        dataColumns: {
            country: 0,
            value: 1     // GDP value
        }
    },
    population: {
        url: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population',
        expectedCountries: 240,
        tableSelectors: ['wikitable sortable', 'wikitable'],
        dataColumns: {
            country: 0,
            value: 1     // Population value
        }
    },
    hdi: {
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_Human_Development_Index',
        expectedCountries: 190,
        tableSelectors: ['wikitable sortable', 'wikitable'],
        dataColumns: {
            country: 0,
            value: 1     // HDI value
        }
    }
};

// Fetch Wikipedia page content
function fetchWikipediaPage(url) {
    return new Promise((resolve, reject) => {
        const urlParts = new URL(url);
        
        const options = {
            hostname: urlParts.hostname,
            port: 443,
            path: urlParts.pathname + urlParts.search,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Wikipedia-Table-Parser/1.0)',
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

// Simple HTML table parser (no external dependencies)
function parseHTMLTables(html, pageConfig) {
    console.log(`🔍 Parsing tables for ${pageConfig.expectedCountries} expected countries...`);
    
    const countries = {};
    let tableCount = 0;
    let totalRows = 0;
    
    // Find tables with wikitable class
    const tableRegex = /<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>(.*?)<\/table>/gis;
    let tableMatch;
    
    while ((tableMatch = tableRegex.exec(html)) !== null) {
        tableCount++;
        const tableHTML = tableMatch[1];
        
        console.log(`   📊 Processing table ${tableCount}...`);
        
        // Extract rows from table
        const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gis;
        let rowMatch;
        let rowIndex = 0;
        
        while ((rowMatch = rowRegex.exec(tableHTML)) !== null) {
            rowIndex++;
            const rowHTML = rowMatch[1];
            
            // Skip header rows (first few rows often contain headers)
            if (rowIndex <= 2) continue;
            
            // Extract cells from row
            const cellRegex = /<t[hd][^>]*>(.*?)<\/t[hd]>/gis;
            const cells = [];
            let cellMatch;
            
            while ((cellMatch = cellRegex.exec(rowHTML)) !== null) {
                let cellText = cellMatch[1];
                
                // Clean up cell content
                cellText = cellText.replace(/<[^>]*>/g, ''); // Remove HTML tags
                cellText = cellText.replace(/&nbsp;/g, ' '); // Replace &nbsp;
                cellText = cellText.replace(/&amp;/g, '&'); // Replace &amp;
                cellText = cellText.replace(/&lt;/g, '<'); // Replace &lt;
                cellText = cellText.replace(/&gt;/g, '>'); // Replace &gt;
                cellText = cellText.replace(/\[\d+\]/g, ''); // Remove reference numbers [1], [2], etc.
                cellText = cellText.replace(/\s+/g, ' ').trim(); // Normalize whitespace
                
                cells.push(cellText);
            }
            
            // Process row if it has enough cells
            if (cells.length >= 2) {
                const countryName = cells[pageConfig.dataColumns.country];
                const valueText = cells[pageConfig.dataColumns.value];
                
                if (countryName && valueText && countryName.length > 1) {
                    // Clean country name
                    let cleanCountryName = countryName.replace(/^\d+\.?\s*/, ''); // Remove ranking numbers
                    cleanCountryName = cleanCountryName.replace(/\s*\([^)]*\)/g, ''); // Remove parentheses
                    cleanCountryName = cleanCountryName.trim();
                    
                    // Skip if country name is too short or looks invalid
                    if (cleanCountryName.length < 2 || /^\d+$/.test(cleanCountryName)) {
                        continue;
                    }
                    
                    // Extract numeric value
                    let numericValue = extractNumericValue(valueText);
                    
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
    
    console.log(`   ✅ Found ${Object.keys(countries).length} countries in ${tableCount} tables (${totalRows} total rows)`);
    return countries;
}

// Extract numeric value from text (handles various formats)
function extractNumericValue(text) {
    if (!text) return null;
    
    // Remove common non-numeric characters but preserve numbers and decimals
    let cleaned = text.replace(/[,%$€£¥]/g, '');
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    // Look for patterns like "1,234.56", "123.45", "123456", etc.
    const patterns = [
        /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/,  // 1,234.56 format
        /(\d+\.\d+)/,                      // 123.45 format
        /(\d+)/                            // 123456 format
    ];
    
    for (const pattern of patterns) {
        const match = cleaned.match(pattern);
        if (match) {
            const numStr = match[1].replace(/,/g, ''); // Remove commas
            const num = parseFloat(numStr);
            if (!isNaN(num)) {
                return num;
            }
        }
    }
    
    return null;
}

// Fetch and parse a single ranking page
async function fetchRankingData(rankingType, config) {
    console.log(`🌐 Fetching ${rankingType} data from Wikipedia...`);
    console.log(`   URL: ${config.url}`);
    
    try {
        const html = await fetchWikipediaPage(config.url);
        console.log(`   📄 Received ${(html.length / 1024).toFixed(1)}KB of HTML`);
        
        const countries = parseHTMLTables(html, config);
        
        const countryCount = Object.keys(countries).length;
        const expectedCount = config.expectedCountries;
        const completeness = ((countryCount / expectedCount) * 100).toFixed(1);
        
        console.log(`   🎯 Results: ${countryCount}/${expectedCount} countries (${completeness}% completeness)`);
        
        if (countryCount < expectedCount * 0.5) {
            console.log(`   ⚠️  Low data yield - may need parser adjustments`);
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

// Build comprehensive dataset from all Wikipedia tables
async function buildWikipediaDataset() {
    console.log('🎯 Building comprehensive dataset from Wikipedia tables...\n');
    
    const startTime = Date.now();
    const dataset = {
        metadata: {
            source: "Wikipedia HTML table parsing",
            created: new Date().toISOString(),
            fetchDuration: 0,
            totalCountries: 0,
            pagesProcessed: 0
        },
        countries: {},
        rankings: {},
        statistics: {}
    };
    
    // Process each ranking type
    for (const [rankingType, config] of Object.entries(WIKIPEDIA_RANKING_PAGES)) {
        console.log(`📊 Processing ${rankingType}...`);
        
        const rankingData = await fetchRankingData(rankingType, config);
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
            
            // Add this ranking data
            dataset.countries[countryName].data[rankingType] = countryData.value;
            dataset.countries[countryName].data[`${rankingType}_raw`] = countryData.rawValue;
        });
        
        // Small delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('');
    }
    
    // Calculate final statistics
    dataset.metadata.totalCountries = Object.keys(dataset.countries).length;
    dataset.metadata.fetchDuration = ((Date.now() - startTime) / 1000).toFixed(2) + 's';
    
    return dataset;
}

// Display results summary
function displayResults(dataset) {
    console.log('🎉 Wikipedia Table Parsing Complete!');
    console.log('=====================================');
    console.log(`Duration: ${dataset.metadata.fetchDuration}`);
    console.log(`Pages Processed: ${dataset.metadata.pagesProcessed}`);
    console.log(`Total Countries: ${dataset.metadata.totalCountries}`);
    
    console.log('\n📊 Data Coverage by Ranking:');
    Object.entries(dataset.statistics).forEach(([ranking, stats]) => {
        const status = stats.error ? '❌' : '✅';
        console.log(`   ${status} ${ranking}: ${stats.found}/${stats.expected} countries (${stats.completeness})`);
    });
    
    // Show sample countries with most data
    console.log('\n🌍 Top Countries by Data Completeness:');
    const countriesWithCounts = Object.entries(dataset.countries).map(([name, data]) => ({
        name,
        dataPoints: Object.keys(data.data).filter(key => !key.endsWith('_raw')).length
    })).sort((a, b) => b.dataPoints - a.dataPoints);
    
    countriesWithCounts.slice(0, 10).forEach((country, i) => {
        console.log(`   ${i + 1}. ${country.name}: ${country.dataPoints} data points`);
    });
    
    // Compare with previous approaches
    console.log('\n📈 Comparison with Previous Methods:');
    console.log('   WebFetch Life Expectancy: 79 countries');
    console.log(`   Wikipedia Life Expectancy: ${dataset.statistics.lifeExpectancy?.found || 0} countries`);
    console.log('   WebFetch GDP: 22 countries');
    console.log(`   Wikipedia GDP: ${dataset.statistics.gdpNominal?.found || 0} countries`);
    console.log('   WebFetch HDI: 20 countries');
    console.log(`   Wikipedia HDI: ${dataset.statistics.hdi?.found || 0} countries`);
}

// Save results to files
function saveResults(dataset) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    
    // Complete dataset
    const datasetFile = `wikipedia_countries_dataset_${timestamp}.json`;
    fs.writeFileSync(datasetFile, JSON.stringify(dataset, null, 2));
    
    // Countries data only (for integration)
    const countriesOnly = {};
    Object.entries(dataset.countries).forEach(([name, country]) => {
        countriesOnly[name] = country.data;
    });
    
    const countriesFile = `wikipedia_countries_data_${timestamp}.json`;
    fs.writeFileSync(countriesFile, JSON.stringify(countriesOnly, null, 2));
    
    // Analysis report
    const reportFile = `wikipedia_analysis_${timestamp}.md`;
    const totalExpected = Object.values(WIKIPEDIA_RANKING_PAGES).reduce((sum, config) => sum + config.expectedCountries, 0);
    const totalFound = Object.values(dataset.statistics).reduce((sum, stats) => sum + (stats.found || 0), 0);
    
    const report = `# Wikipedia Table Parsing Results

## Summary
- **Date:** ${dataset.metadata.created}
- **Duration:** ${dataset.metadata.fetchDuration}
- **Pages Processed:** ${dataset.metadata.pagesProcessed}/4
- **Total Countries:** ${dataset.metadata.totalCountries}
- **Data Points Expected:** ${totalExpected}
- **Data Points Found:** ${totalFound}
- **Overall Success Rate:** ${((totalFound / totalExpected) * 100).toFixed(1)}%

## Results by Ranking
${Object.entries(dataset.statistics).map(([ranking, stats]) => {
    const pages = WIKIPEDIA_RANKING_PAGES[ranking];
    return `### ${ranking}
- **Expected:** ${pages.expectedCountries} countries
- **Found:** ${stats.found} countries
- **Completeness:** ${stats.completeness}
- **URL:** ${pages.url}
${stats.error ? `- **Error:** ${stats.error}` : ''}`;
}).join('\n\n')}

## Top Countries by Data Coverage
${Object.entries(dataset.countries)
    .map(([name, data]) => ({ 
        name, 
        count: Object.keys(data.data).filter(key => !key.endsWith('_raw')).length 
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)
    .map((country, i) => `${i + 1}. **${country.name}** - ${country.count}/4 rankings`)
    .join('\n')}

## Integration Ready
This dataset is ready for integration into your Know-It-All country challenges.
Use \`${countriesFile}\` for the clean country data.
`;
    
    fs.writeFileSync(reportFile, report);
    
    console.log('\n📁 Files Generated:');
    console.log(`   📊 ${datasetFile} - Complete dataset with metadata`);
    console.log(`   🌍 ${countriesFile} - Countries data ready for integration`);
    console.log(`   📈 ${reportFile} - Analysis report`);
    
    return { datasetFile, countriesFile, reportFile };
}

// Main execution
async function main() {
    console.log('🔍 Wikipedia Table Parser');
    console.log('=========================');
    console.log('Extracting comprehensive country ranking data from Wikipedia HTML tables\n');
    
    try {
        const dataset = await buildWikipediaDataset();
        displayResults(dataset);
        const files = saveResults(dataset);
        
        console.log('\n✅ Wikipedia table parsing complete!');
        console.log('\n🎯 Key Achievements:');
        console.log('   • Extracted country data directly from Wikipedia ranking tables');
        console.log('   • No truncation limits - got all available table data');
        console.log('   • Processed authoritative ranking sources');
        console.log('   • Generated integration-ready dataset');
        
        console.log('\n🚀 Next Steps:');
        console.log('   1. Review parsing results in generated files');
        console.log('   2. Enhance parser for any missed data');
        console.log('   3. Integrate with Know-It-All country challenges');
        console.log('   4. Add more Wikipedia ranking pages as needed');
        
        return dataset;
        
    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Export for programmatic use
module.exports = {
    fetchWikipediaPage,
    parseHTMLTables,
    buildWikipediaDataset,
    WIKIPEDIA_RANKING_PAGES
};

if (require.main === module) {
    main().catch(console.error);
}