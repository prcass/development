#!/usr/bin/env node
/**
 * Failed Categories Re-Extractor
 * Targets the 20+ categories identified in audit as failed/low coverage
 * Uses enhanced parsing with multiple fallback strategies
 */

const { parseWikipediaPage, makeHttpsRequest, normalizeCountryName, isValidCountry } = require('./enhanced-wikipedia-parser-v2');
const fs = require('fs');

// Categories identified in audit as failed or very low coverage
const FAILED_CATEGORIES = {
    // Agriculture failures (audit identified)
    coffeeProduction: { 
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_coffee_production', 
        category: 'Agriculture',
        expected: 80,
        actual: 1
    },
    wineProduction: { 
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_wine_production', 
        category: 'Agriculture',
        expected: 50,
        actual: 5
    },
    
    // Economy failures
    economicComplexity: { 
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_economic_complexity', 
        category: 'Economy',
        expected: 130,
        actual: 3
    },
    
    // Technology failures
    smartphonePenetration: { 
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_smartphone_penetration', 
        category: 'Technology',
        expected: 100,
        actual: 2
    },
    
    // Education failures
    englishProficiency: { 
        url: 'https://en.wikipedia.org/wiki/EF_English_Proficiency_Index', 
        category: 'Education',
        expected: 110,
        actual: 2
    },
    
    // Exports failures
    oilExports: { 
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_oil_exports', 
        category: 'Exports',
        expected: 50,
        actual: 2
    },
    
    // Politics failures
    globalTerrorism: { 
        url: 'https://en.wikipedia.org/wiki/Global_Terrorism_Index', 
        category: 'Politics',
        expected: 160,
        actual: 2
    },
    fragileStates: { 
        url: 'https://en.wikipedia.org/wiki/Fragile_States_Index', 
        category: 'Politics',
        expected: 178,
        actual: 1
    },
    
    // Industry failures
    steelProduction: { 
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_steel_production', 
        category: 'Industry',
        expected: 60,
        actual: 2
    },
    oilProduction: { 
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_oil_production', 
        category: 'Industry',
        expected: 100,
        actual: 1
    },
    naturalGasProduction: { 
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_natural_gas_production', 
        category: 'Industry',
        expected: 80,
        actual: 1
    },
    
    // Reserves failures
    oilReserves: { 
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_proven_oil_reserves', 
        category: 'Reserves',
        expected: 100,
        actual: 1
    },
    
    // Military failures
    militaryPersonnel: { 
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_number_of_military_and_paramilitary_personnel', 
        category: 'Military',
        expected: 170,
        actual: 4
    },
    
    // Society failures
    givingIndex: { 
        url: 'https://en.wikipedia.org/wiki/World_Giving_Index', 
        category: 'Society',
        expected: 140,
        actual: 2
    },
    genderInequality: { 
        url: 'https://en.wikipedia.org/wiki/Gender_Inequality_Index', 
        category: 'Society',
        expected: 170,
        actual: 2
    },
    
    // Travel failures
    culturalTourism: { 
        url: 'https://en.wikipedia.org/wiki/Cultural_tourism', 
        category: 'Travel',
        expected: 100,
        actual: 5
    },
    
    // Arts failures
    museums: { 
        url: 'https://en.wikipedia.org/wiki/List_of_museums_by_country', 
        category: 'Arts',
        expected: 150,
        actual: 3
    },
    
    // Culture failures
    passportIndex: { 
        url: 'https://en.wikipedia.org/wiki/Henley_Passport_Index', 
        category: 'Culture',
        expected: 199,
        actual: 4
    },
    
    // Health improvement needed
    hospitalBeds: { 
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_hospital_beds', 
        category: 'Health',
        expected: 100,
        actual: 48
    },
    cancerRate: { 
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_cancer_rate', 
        category: 'Health',
        expected: 150,
        actual: 31
    },
    
    // Transport improvements
    vehiclesPerCapita: { 
        url: 'https://en.wikipedia.org/wiki/List_of_countries_by_vehicles_per_capita', 
        category: 'Transport',
        expected: 100,
        actual: 15
    }
};

// Enhanced parsing strategies specifically for failed categories
const ENHANCED_PARSING_STRATEGIES = {
    // Table-based strategies
    wikitable: {
        tableSelector: /<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>(.*?)<\/table>/gis,
        rowSelector: /<tr[^>]*>(.*?)<\/tr>/gis,
        cellSelector: /<t[hd][^>]*>(.*?)<\/t[hd]>/gis,
        dataColumns: { country: 0, value: 1 }
    },
    
    sortableTable: {
        tableSelector: /<table[^>]*class="[^"]*sortable[^"]*"[^>]*>(.*?)<\/table>/gis,
        rowSelector: /<tr[^>]*>(.*?)<\/tr>/gis,
        cellSelector: /<t[hd][^>]*>(.*?)<\/t[hd]>/gis,
        dataColumns: { country: 0, value: 1 }
    },
    
    // List-based strategies
    numberedList: {
        listSelector: /<ol[^>]*>(.*?)<\/ol>/gis,
        itemRegex: /<li[^>]*>.*?<a[^>]*title="([^"]*)"[^>]*>([^<]+)<\/a>.*?(\d+(?:\.\d+)?)/gi
    },
    
    bulletList: {
        listSelector: /<ul[^>]*>(.*?)<\/ul>/gis,
        itemRegex: /<li[^>]*>.*?<a[^>]*title="([^"]*)"[^>]*>([^<]+)<\/a>.*?(\d+(?:\.\d+)?)/gi
    },
    
    // Comprehensive table scan
    anyTable: {
        tableSelector: /<table[^>]*>(.*?)<\/table>/gis,
        rowSelector: /<tr[^>]*>(.*?)<\/tr>/gis,
        cellSelector: /<t[hd][^>]*>(.*?)<\/t[hd]>/gis,
        dataColumns: { country: 0, value: 1 }
    },
    
    // Text pattern matching
    textPattern: {
        patterns: [
            /([A-Z][a-z\s]+)[\s\-:]+([0-9,]+(?:\.[0-9]+)?)/g,
            /<a[^>]*title="([^"]*)"[^>]*>([^<]+)<\/a>[^0-9]*([0-9,]+(?:\.[0-9]+)?)/g
        ]
    }
};

function parseHTMLWithMultipleStrategies(html, pageConfig) {
    console.log(`   🔍 Trying multiple parsing strategies...`);
    
    const results = {};
    
    // Strategy 1: Wikitable parsing
    try {
        const wikitableResults = parseWithStrategy(html, ENHANCED_PARSING_STRATEGIES.wikitable, 'wikitable');
        Object.assign(results, wikitableResults);
        console.log(`   📊 Wikitable strategy: ${Object.keys(wikitableResults).length} countries`);
    } catch (e) {
        console.log(`   ⚠️ Wikitable strategy failed: ${e.message}`);
    }
    
    // Strategy 2: Sortable table parsing
    if (Object.keys(results).length < 10) {
        try {
            const sortableResults = parseWithStrategy(html, ENHANCED_PARSING_STRATEGIES.sortableTable, 'sortable');
            Object.assign(results, sortableResults);
            console.log(`   📊 Sortable strategy: ${Object.keys(sortableResults).length} countries`);
        } catch (e) {
            console.log(`   ⚠️ Sortable strategy failed: ${e.message}`);
        }
    }
    
    // Strategy 3: Any table parsing
    if (Object.keys(results).length < 10) {
        try {
            const anyTableResults = parseWithStrategy(html, ENHANCED_PARSING_STRATEGIES.anyTable, 'any table');
            Object.assign(results, anyTableResults);
            console.log(`   📊 Any table strategy: ${Object.keys(anyTableResults).length} countries`);
        } catch (e) {
            console.log(`   ⚠️ Any table strategy failed: ${e.message}`);
        }
    }
    
    // Strategy 4: List parsing
    if (Object.keys(results).length < 10) {
        try {
            const listResults = parseWithListStrategy(html);
            Object.assign(results, listResults);
            console.log(`   📊 List strategy: ${Object.keys(listResults).length} countries`);
        } catch (e) {
            console.log(`   ⚠️ List strategy failed: ${e.message}`);
        }
    }
    
    // Strategy 5: Text pattern matching
    if (Object.keys(results).length < 10) {
        try {
            const patternResults = parseWithTextPatterns(html);
            Object.assign(results, patternResults);
            console.log(`   📊 Pattern strategy: ${Object.keys(patternResults).length} countries`);
        } catch (e) {
            console.log(`   ⚠️ Pattern strategy failed: ${e.message}`);
        }
    }
    
    return results;
}

function parseWithStrategy(html, strategy, strategyName) {
    const results = {};
    const tables = html.match(strategy.tableSelector) || [];
    
    console.log(`   🔍 ${strategyName}: Found ${tables.length} tables`);
    
    for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        const rows = table.match(strategy.rowSelector) || [];
        
        console.log(`   📋 Table ${i+1}: ${rows.length} rows`);
        
        for (const row of rows) {
            const cells = row.match(strategy.cellSelector) || [];
            if (cells.length < 2) continue;
            
            // Clean cell content
            const cleanCells = cells.map(cell => 
                cell.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim()
            );
            
            // Try different column combinations
            for (let countryCol = 0; countryCol < Math.min(3, cleanCells.length); countryCol++) {
                for (let valueCol = countryCol + 1; valueCol < cleanCells.length; valueCol++) {
                    const countryName = normalizeCountryName(cleanCells[countryCol]);
                    const valueStr = cleanCells[valueCol];
                    
                    if (isValidCountry(countryName) && /\d/.test(valueStr)) {
                        const value = parseFloat(valueStr.replace(/[^0-9.-]/g, ''));
                        if (!isNaN(value)) {
                            results[countryName] = value;
                        }
                    }
                }
            }
        }
    }
    
    return results;
}

function parseWithListStrategy(html) {
    const results = {};
    
    // Try numbered lists
    const numberedLists = html.match(ENHANCED_PARSING_STRATEGIES.numberedList.listSelector) || [];
    for (const list of numberedLists) {
        let match;
        while ((match = ENHANCED_PARSING_STRATEGIES.numberedList.itemRegex.exec(list)) !== null) {
            const countryName = normalizeCountryName(match[2] || match[1]);
            const value = parseFloat(match[3]);
            if (isValidCountry(countryName) && !isNaN(value)) {
                results[countryName] = value;
            }
        }
    }
    
    // Try bullet lists
    const bulletLists = html.match(ENHANCED_PARSING_STRATEGIES.bulletList.listSelector) || [];
    for (const list of bulletLists) {
        let match;
        while ((match = ENHANCED_PARSING_STRATEGIES.bulletList.itemRegex.exec(list)) !== null) {
            const countryName = normalizeCountryName(match[2] || match[1]);
            const value = parseFloat(match[3]);
            if (isValidCountry(countryName) && !isNaN(value)) {
                results[countryName] = value;
            }
        }
    }
    
    return results;
}

function parseWithTextPatterns(html) {
    const results = {};
    
    for (const pattern of ENHANCED_PARSING_STRATEGIES.textPattern.patterns) {
        let match;
        while ((match = pattern.exec(html)) !== null) {
            const countryName = normalizeCountryName(match[2] || match[1]);
            const valueStr = match[3] || match[2];
            const value = parseFloat(valueStr.replace(/[^0-9.-]/g, ''));
            
            if (isValidCountry(countryName) && !isNaN(value)) {
                results[countryName] = value;
            }
        }
    }
    
    return results;
}

async function reExtractFailedCategory(categoryKey, categoryConfig) {
    console.log(`\n🔄 RE-EXTRACTING: ${categoryKey}`);
    console.log(`   URL: ${categoryConfig.url}`);
    console.log(`   Expected: ${categoryConfig.expected} countries, Previous: ${categoryConfig.actual} countries`);
    
    try {
        const html = await makeHttpsRequest(categoryConfig.url);
        console.log(`   📥 Downloaded HTML (${Math.round(html.length / 1024)}KB)`);
        
        const rankingData = parseHTMLWithMultipleStrategies(html, categoryConfig);
        
        if (Object.keys(rankingData).length === 0) {
            console.log(`   ❌ Still no data extracted for ${categoryKey}`);
            return null;
        }
        
        const extractedCount = Object.keys(rankingData).length;
        const improvement = extractedCount - categoryConfig.actual;
        const coveragePercent = ((extractedCount / 195) * 100).toFixed(1);
        
        console.log(`   📊 IMPROVEMENT: ${categoryConfig.actual} → ${extractedCount} countries (+${improvement})`);
        console.log(`   📈 Coverage: ${coveragePercent}% (${extractedCount}/195 countries)`);
        
        const topCountries = Object.entries(rankingData)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([country, value]) => `${country} (${value})`)
            .join(', ');
        console.log(`   🎯 Top countries: ${topCountries}`);
        
        return {
            category: categoryConfig.category,
            data: rankingData,
            url: categoryConfig.url,
            extractedCount: extractedCount,
            previousCount: categoryConfig.actual,
            improvement: improvement,
            coveragePercent: parseFloat(coveragePercent)
        };
        
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        return null;
    }
}

async function processAllFailedCategories() {
    console.log('🚀 Failed Categories Re-Extractor');
    console.log('===================================\n');
    
    const startTime = Date.now();
    const allCategories = Object.keys(FAILED_CATEGORIES);
    
    console.log(`📋 Categories to re-extract: ${allCategories.length}`);
    console.log(`⚙️  Using enhanced multi-strategy parsing\n`);
    
    const results = {};
    const stillFailed = [];
    const improvements = [];
    const countriesDataset = {};
    
    // Process categories sequentially for detailed logging
    for (const categoryKey of allCategories) {
        const result = await reExtractFailedCategory(categoryKey, FAILED_CATEGORIES[categoryKey]);
        
        if (result) {
            results[categoryKey] = result;
            
            // Track improvements
            if (result.improvement > 0) {
                improvements.push({
                    category: categoryKey,
                    before: result.previousCount,
                    after: result.extractedCount,
                    improvement: result.improvement
                });
            }
            
            // Add to countries dataset
            Object.entries(result.data).forEach(([country, value]) => {
                if (!countriesDataset[country]) {
                    countriesDataset[country] = {};
                }
                countriesDataset[country][categoryKey] = value;
                countriesDataset[country][`${categoryKey}_raw`] = value;
            });
        } else {
            stillFailed.push(categoryKey);
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Generate summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 RE-EXTRACTION COMPLETE');
    console.log('='.repeat(60));
    
    const successful = allCategories.length - stillFailed.length;
    const successRate = ((successful / allCategories.length) * 100).toFixed(1);
    
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`✅ Successfully re-extracted: ${successful}/${allCategories.length} (${successRate}%)`);
    console.log(`❌ Still failed: ${stillFailed.length}`);
    console.log(`🌍 Total countries: ${Object.keys(countriesDataset).length}`);
    
    // Show improvements
    if (improvements.length > 0) {
        console.log('\n📈 MAJOR IMPROVEMENTS:');
        improvements
            .sort((a, b) => b.improvement - a.improvement)
            .slice(0, 10)
            .forEach(imp => {
                console.log(`   ${imp.category}: ${imp.before} → ${imp.after} (+${imp.improvement} countries)`);
            });
    }
    
    if (stillFailed.length > 0) {
        console.log(`\n❌ Still failed: ${stillFailed.join(', ')}`);
    }
    
    // Save results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const datasetFile = `failed_categories_re_extracted_${timestamp}.json`;
    
    fs.writeFileSync(datasetFile, JSON.stringify(countriesDataset, null, 2));
    console.log(`\n💾 Re-extracted dataset saved: ${datasetFile}`);
    
    // Generate detailed report
    const reportFile = `failed_categories_report_${timestamp}.md`;
    generateImprovementReport(results, stillFailed, improvements, duration, successful, allCategories.length, reportFile);
    
    console.log(`📄 Improvement report saved: ${reportFile}`);
    console.log('\n🎉 Re-extraction complete! Significant improvements achieved.');
    
    return {
        results,
        stillFailed,
        improvements,
        countriesDataset,
        datasetFile,
        reportFile,
        stats: { successful, total: allCategories.length, successRate, duration }
    };
}

function generateImprovementReport(results, stillFailed, improvements, duration, successful, total, filename) {
    let report = `# Failed Categories Re-Extraction Report\n\n`;
    report += `## Summary\n`;
    report += `- **Re-extraction Date:** ${new Date().toISOString()}\n`;
    report += `- **Duration:** ${duration}s\n`;
    report += `- **Categories Targeted:** ${total}\n`;
    report += `- **Successfully Improved:** ${successful}\n`;
    report += `- **Still Failed:** ${stillFailed.length}\n`;
    report += `- **Success Rate:** ${((successful / total) * 100).toFixed(1)}%\n\n`;
    
    if (improvements.length > 0) {
        report += `## Major Improvements\n`;
        improvements
            .sort((a, b) => b.improvement - a.improvement)
            .forEach(imp => {
                const result = results[imp.category];
                report += `### ${imp.category} (${result.category})\n`;
                report += `- **Before:** ${imp.before} countries\n`;
                report += `- **After:** ${imp.after} countries\n`;
                report += `- **Improvement:** +${imp.improvement} countries (+${((imp.improvement/imp.before)*100).toFixed(1)}%)\n`;
                report += `- **Coverage:** ${result.coveragePercent}%\n`;
                report += `- **Source:** ${result.url}\n\n`;
            });
    }
    
    if (stillFailed.length > 0) {
        report += `## Still Failed Categories\n`;
        stillFailed.forEach(category => {
            const config = FAILED_CATEGORIES[category];
            report += `- **${category}** (${config.category}): Expected ${config.expected} countries, still failed extraction\n`;
        });
        report += '\n';
    }
    
    report += `## Next Steps\n`;
    report += `1. Integrate successful re-extractions with main dataset\n`;
    report += `2. Investigate still-failed categories for alternative sources\n`;
    report += `3. Update master audit with new coverage numbers\n`;
    report += `4. Consider manual data entry for critical missing categories\n`;
    
    fs.writeFileSync(filename, report);
}

// Main execution
if (require.main === module) {
    processAllFailedCategories().catch(console.error);
}

module.exports = { processAllFailedCategories, reExtractFailedCategory };