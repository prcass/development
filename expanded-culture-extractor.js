#!/usr/bin/env node
/**
 * Expanded Culture Categories Extractor
 * Focused extraction for comprehensive culture and heritage data
 */

const { parseWikipediaPage, makeHttpsRequest, normalizeCountryName, isValidCountry } = require('./enhanced-wikipedia-parser-v2');
const fs = require('fs');

// Expanded Culture Categories with alternative URLs and comprehensive coverage
const EXPANDED_CULTURE_RANKINGS = {
    // Heritage & Cultural Sites
    worldHeritageSites: { url: 'https://en.wikipedia.org/wiki/World_Heritage_Sites_by_country', category: 'Culture' },
    unescoSites: { url: 'https://en.wikipedia.org/wiki/List_of_World_Heritage_Sites_by_country', category: 'Culture' },
    culturalHeritage: { url: 'https://en.wikipedia.org/wiki/Lists_of_World_Heritage_Sites', category: 'Culture' },
    
    // Awards & Recognition
    academyAwards: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_number_of_Academy_Awards_for_Best_International_Feature_Film', category: 'Culture' },
    nobelPrizes: { url: 'https://en.wikipedia.org/wiki/List_of_Nobel_laureates_by_country', category: 'Culture' },
    cannesAwards: { url: 'https://en.wikipedia.org/wiki/Palme_d%27Or', category: 'Culture' },
    eurovisionWins: { url: 'https://en.wikipedia.org/wiki/List_of_Eurovision_Song_Contest_winners', category: 'Culture' },
    
    // Publishing & Literature
    booksPublished: { url: 'https://en.wikipedia.org/wiki/Books_published_per_country_per_year', category: 'Culture' },
    booksPerCapita: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_book_production', category: 'Culture' },
    literatureNobelPrizes: { url: 'https://en.wikipedia.org/wiki/List_of_Nobel_Prize_in_Literature_winners', category: 'Culture' },
    libraries: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_number_of_public_libraries', category: 'Culture' },
    
    // Cultural Indices & Soft Power
    softPowerIndex: { url: 'https://en.wikipedia.org/wiki/Soft_power', category: 'Culture' },
    culturalInfluence: { url: 'https://en.wikipedia.org/wiki/Cultural_diplomacy', category: 'Culture' },
    brandIndex: { url: 'https://en.wikipedia.org/wiki/Nation_branding', category: 'Culture' },
    globalCulture: { url: 'https://en.wikipedia.org/wiki/Global_culture', category: 'Culture' },
    
    // Language & Communication
    languageDiversity: { url: 'https://en.wikipedia.org/wiki/Linguistic_diversity', category: 'Culture' },
    officialLanguages: { url: 'https://en.wikipedia.org/wiki/List_of_official_languages_by_country_and_territory', category: 'Culture' },
    englishProficiency: { url: 'https://en.wikipedia.org/wiki/EF_English_Proficiency_Index', category: 'Culture' },
    multilingualCountries: { url: 'https://en.wikipedia.org/wiki/Multilingualism', category: 'Culture' },
    
    // Travel & Tourism
    passportPower: { url: 'https://en.wikipedia.org/wiki/Henley_Passport_Index', category: 'Culture' },
    visaFreedom: { url: 'https://en.wikipedia.org/wiki/Visa_requirements_for_travel', category: 'Culture' },
    touristArrivals: { url: 'https://en.wikipedia.org/wiki/World_Tourism_rankings', category: 'Culture' },
    culturalTourism: { url: 'https://en.wikipedia.org/wiki/Cultural_tourism', category: 'Culture' },
    
    // Arts & Entertainment
    musicExports: { url: 'https://en.wikipedia.org/wiki/Music_industry', category: 'Culture' },
    filmProduction: { url: 'https://en.wikipedia.org/wiki/Film_industry', category: 'Culture' },
    artMarket: { url: 'https://en.wikipedia.org/wiki/Art_market', category: 'Culture' },
    museums: { url: 'https://en.wikipedia.org/wiki/List_of_museums_by_country', category: 'Culture' },
    
    // Cultural Values & Behavior
    powerDistance: { url: 'https://en.wikipedia.org/wiki/Power_distance', category: 'Culture' },
    culturalDimensions: { url: 'https://en.wikipedia.org/wiki/Hofstede%27s_cultural_dimensions_theory', category: 'Culture' },
    collectivism: { url: 'https://en.wikipedia.org/wiki/Collectivism', category: 'Culture' },
    individualismIndex: { url: 'https://en.wikipedia.org/wiki/Individualism', category: 'Culture' },
    
    // Digital & Modern Culture
    internetCulture: { url: 'https://en.wikipedia.org/wiki/Internet_culture', category: 'Culture' },
    socialMediaUsage: { url: 'https://en.wikipedia.org/wiki/Social_media_by_country', category: 'Culture' },
    digitalCulture: { url: 'https://en.wikipedia.org/wiki/Digital_culture', category: 'Culture' },
    
    // Religious & Traditional Culture
    religiousDiversity: { url: 'https://en.wikipedia.org/wiki/Religious_diversity', category: 'Culture' },
    culturalPractices: { url: 'https://en.wikipedia.org/wiki/Culture_by_country', category: 'Culture' },
    traditionalFestivals: { url: 'https://en.wikipedia.org/wiki/List_of_festivals_by_country', category: 'Culture' }
};

// Enhanced parsing specifically for culture pages
const CULTURE_PARSING_STRATEGIES = {
    // Strategy for heritage sites and counts
    heritageCount: {
        tableRegex: /<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>(.*?)<\/table>/gis,
        rowRegex: /<tr[^>]*>(.*?)<\/tr>/gis,
        cellRegex: /<t[dh][^>]*>(.*?)<\/t[dh]>/gis,
        skipRows: 1,
        countColumns: true,
        lookForNumbers: /(\d+)\s*(?:sites?|awards?|prizes?|works?)/i
    },
    
    // Strategy for award lists with countries
    awardsList: {
        itemRegex: /<li[^>]*>(.*?)<\/li>/gis,
        countryPattern: /([A-Z][a-z\s\-\.]+)[\s\-:]*(?:won|received|has)?\s*([0-9,\.]+)/gi,
        yearPattern: /(\d{4})/g,
        numbered: false
    },
    
    // Strategy for ranking tables with scores/indices
    culturalIndex: {
        tableRegex: /<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>(.*?)<\/table>/gis,
        rowRegex: /<tr[^>]*>(.*?)<\/tr>/gis,
        cellRegex: /<t[dh][^>]*>(.*?)<\/t[dh]>/gis,
        skipRows: 1,
        scoreColumns: true,
        lookForScores: /([0-9]+\.?[0-9]*)\s*(?:points?|score|index|rank)/i
    },
    
    // Strategy for language and communication data
    languageData: {
        tableRegex: /<table[^>]*>(.*?)<\/table>/gis,
        rowRegex: /<tr[^>]*>(.*?)<\/tr>/gis,
        cellRegex: /<t[dh][^>]*>(.*?)<\/t[dh]>/gis,
        skipRows: 1,
        findLanguages: true,
        languagePattern: /(\d+)\s*(?:languages?|official|spoken)/i
    },
    
    // Strategy for cultural lists and comprehensive data
    comprehensiveList: {
        itemRegex: /<li[^>]*>.*?<a[^>]*title="([^"]*)"[^>]*>([^<]+)<\/a>.*?<\/li>/gi,
        tableRegex: /<table[^>]*>(.*?)<\/table>/gis,
        rowRegex: /<tr[^>]*>(.*?)<\/tr>/gis,
        cellRegex: /<t[dh][^>]*>(.*?)<\/t[dh]>/gis,
        extractAll: true
    }
};

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

function extractCulturalNumber(text, strategy) {
    if (!text) return null;
    
    const cleaned = text.replace(/,/g, '').replace(/\$|€|£/g, '');
    
    // Try strategy-specific patterns first
    if (strategy.lookForNumbers) {
        const match = cleaned.match(strategy.lookForNumbers);
        if (match) return parseFloat(match[1]);
    }
    
    if (strategy.lookForScores) {
        const match = cleaned.match(strategy.lookForScores);
        if (match) return parseFloat(match[1]);
    }
    
    if (strategy.languagePattern) {
        const match = cleaned.match(strategy.languagePattern);
        if (match) return parseFloat(match[1]);
    }
    
    // General number extraction patterns for culture data
    const patterns = [
        /(\d+)\s*(?:sites?|awards?|prizes?|nobel|oscar|cannes)/i,  // Heritage/Awards
        /(\d+)\s*(?:books?|titles?|publications?)/i,               // Publishing
        /(\d+\.?\d*)\s*(?:score|index|rank|rating)/i,              // Indices
        /(\d+)\s*(?:languages?|dialects?)/i,                       // Languages
        /(\d+)\s*(?:museums?|galleries?|theaters?)/i,              // Cultural institutions
        /rank\s*(\d+)/i,                                           // Rankings
        /(\d+)(?:st|nd|rd|th)\s*(?:place|position)/i,             // Positions
        /(\d+\.?\d*)\s*(?:million|thousand|billion)?/i             // General numbers
    ];
    
    for (const pattern of patterns) {
        const match = cleaned.match(pattern);
        if (match) {
            let value = parseFloat(match[1]);
            // Handle multipliers
            if (text.toLowerCase().includes('billion')) value *= 1000000000;
            else if (text.toLowerCase().includes('million')) value *= 1000000;
            else if (text.toLowerCase().includes('thousand')) value *= 1000;
            return value;
        }
    }
    
    // Fallback to any number
    const numMatch = cleaned.match(/(\d+\.?\d*)/);
    return numMatch ? parseFloat(numMatch[1]) : null;
}

function parseCulturalPage(html, category) {
    console.log(`   🎨 Using cultural-specific parsing for ${category}...`);
    
    let bestResults = {};
    let bestCount = 0;
    let bestStrategy = '';
    
    // Try culture-specific strategies first
    for (const [strategyName, strategy] of Object.entries(CULTURE_PARSING_STRATEGIES)) {
        const results = parseWithCulturalStrategy(html, strategy, category);
        const count = Object.keys(results).length;
        
        console.log(`   🔍 Cultural strategy "${strategyName}": ${count} countries`);
        
        if (count > bestCount) {
            bestResults = results;
            bestCount = count;
            bestStrategy = strategyName;
        }
    }
    
    // Fall back to general parsing if cultural parsing fails
    if (bestCount === 0) {
        console.log(`   🔄 Falling back to general parsing...`);
        bestResults = parseWikipediaPage(html);
        bestCount = Object.keys(bestResults).length;
        bestStrategy = 'general';
    }
    
    console.log(`   ✅ Best cultural strategy: "${bestStrategy}" with ${bestCount} countries`);
    return bestResults;
}

function parseWithCulturalStrategy(html, strategy, category) {
    const results = {};
    
    if (strategy.tableRegex) {
        // Table-based parsing for cultural data
        const tables = html.match(strategy.tableRegex);
        if (!tables) return results;
        
        // Find the best table with most cultural data
        let bestTable = null;
        let bestTableCount = 0;
        
        tables.forEach(table => {
            const tempResults = parseCulturalTable(table, strategy, category);
            if (Object.keys(tempResults).length > bestTableCount) {
                bestTable = table;
                bestTableCount = Object.keys(tempResults).length;
            }
        });
        
        if (bestTable) {
            Object.assign(results, parseCulturalTable(bestTable, strategy, category));
        }
    }
    
    if (strategy.itemRegex) {
        // List-based parsing for cultural awards/sites
        const items = html.match(strategy.itemRegex);
        if (!items) return results;
        
        items.forEach(item => {
            if (strategy.extractAll) {
                // Extract country from link titles and content
                const linkMatch = item.match(/<a[^>]*title="([^"]*)"[^>]*>([^<]+)<\/a>/);
                if (linkMatch) {
                    const countryName = normalizeCountryName(linkMatch[1] || linkMatch[2]);
                    if (countryName && isValidCountry(countryName)) {
                        // Try to find a number in the item
                        const value = extractCulturalNumber(item, strategy) || 1; // Default to 1 if no number found
                        if (!results[countryName] || value > results[countryName]) {
                            results[countryName] = value;
                        }
                    }
                }
            } else {
                // Use pattern matching
                const matches = item.matchAll(strategy.countryPattern || /([A-Z][a-z\s\-\.]+)[\s\-:]*([0-9,\.]+)/g);
                for (const match of matches) {
                    const countryName = normalizeCountryName(match[1]);
                    const value = extractCulturalNumber(match[2], strategy);
                    
                    if (countryName && value !== null && isValidCountry(countryName)) {
                        if (!results[countryName] || value > results[countryName]) {
                            results[countryName] = value;
                        }
                    }
                }
            }
        });
    }
    
    // Also try to extract from paragraphs for comprehensive coverage
    if (strategy.extractAll) {
        const paragraphs = html.match(/<p[^>]*>(.*?)<\/p>/gis);
        if (paragraphs) {
            paragraphs.forEach(para => {
                const countryMatches = para.matchAll(/\b([A-Z][a-z\s\-\.]+)\b/g);
                for (const match of countryMatches) {
                    const countryName = normalizeCountryName(match[1]);
                    if (countryName && isValidCountry(countryName) && !results[countryName]) {
                        // Look for numbers near the country name
                        const context = para.substring(Math.max(0, match.index - 50), match.index + 100);
                        const value = extractCulturalNumber(context, strategy) || 1;
                        results[countryName] = value;
                    }
                }
            });
        }
    }
    
    return results;
}

function parseCulturalTable(table, strategy, category) {
    const results = {};
    const rows = table.match(new RegExp(strategy.rowRegex.source, 'gi'));
    
    if (!rows) return results;
    
    // Skip header rows
    const dataRows = rows.slice(strategy.skipRows || 1);
    
    dataRows.forEach(row => {
        const cells = [];
        let match;
        const cellRegex = new RegExp(strategy.cellRegex.source, 'gi');
        
        while ((match = cellRegex.exec(row)) !== null) {
            cells.push(cleanText(match[1]));
        }
        
        if (cells.length >= 2) {
            // Try different column combinations for cultural data
            for (let countryCol = 0; countryCol < Math.min(3, cells.length); countryCol++) {
                const countryName = normalizeCountryName(cells[countryCol]);
                
                if (countryName && isValidCountry(countryName)) {
                    // Look for the best value in remaining columns
                    let bestValue = null;
                    
                    for (let valueCol = countryCol + 1; valueCol < cells.length; valueCol++) {
                        const value = extractCulturalNumber(cells[valueCol], strategy);
                        if (value !== null && (bestValue === null || value > bestValue)) {
                            bestValue = value;
                        }
                    }
                    
                    if (bestValue !== null) {
                        results[countryName] = bestValue;
                        break; // Found data for this row
                    }
                }
            }
        }
    });
    
    return results;
}

async function extractSingleCulturalRanking(rankingKey, rankingConfig) {
    console.log(`\n🎨 Processing Cultural Category: ${rankingKey}`);
    console.log(`   URL: ${rankingConfig.url}`);
    
    try {
        const html = await makeHttpsRequest(rankingConfig.url);
        console.log(`   📥 Downloaded HTML (${Math.round(html.length / 1024)}KB)`);
        
        // Use cultural-specific parsing
        const rankingData = parseCulturalPage(html, rankingKey);
        
        if (Object.keys(rankingData).length === 0) {
            console.log(`   ❌ No data extracted for ${rankingKey}`);
            return null;
        }
        
        console.log(`   📊 Countries found: ${Object.keys(rankingData).length}`);
        const topCountries = Object.entries(rankingData)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([country]) => country);
        console.log(`   🎯 Top countries: ${topCountries.join(', ')}`);
        
        return {
            category: rankingConfig.category,
            data: rankingData,
            url: rankingConfig.url,
            extractedCount: Object.keys(rankingData).length
        };
        
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        return null;
    }
}

async function processExpandedCultureCategories() {
    console.log('🎨📚 Expanded Culture Categories Extractor');
    console.log('==========================================\n');
    
    const startTime = Date.now();
    const allRankings = Object.keys(EXPANDED_CULTURE_RANKINGS);
    const batchSize = 3; // Small batches for comprehensive parsing
    
    console.log(`📋 Total cultural categories to process: ${allRankings.length}`);
    console.log(`⚙️  Processing in batches of ${batchSize} with delays\n`);
    
    const results = {};
    const failed = [];
    const countriesDataset = {};
    
    // Process in batches
    for (let i = 0; i < allRankings.length; i += batchSize) {
        const batch = allRankings.slice(i, i + batchSize);
        console.log(`\n📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allRankings.length/batchSize)}: ${batch.join(', ')}`);
        
        // Process batch sequentially for reliability
        for (const rankingKey of batch) {
            const result = await extractSingleCulturalRanking(rankingKey, EXPANDED_CULTURE_RANKINGS[rankingKey]);
            
            if (result) {
                results[rankingKey] = result;
                
                // Add to countries dataset
                Object.entries(result.data).forEach(([country, value]) => {
                    if (!countriesDataset[country]) {
                        countriesDataset[country] = {};
                    }
                    countriesDataset[country][rankingKey] = value;
                    countriesDataset[country][`${rankingKey}_raw`] = value;
                });
            } else {
                failed.push(rankingKey);
            }
            
            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // Longer delay between batches
        if (i + batchSize < allRankings.length) {
            console.log('   ⏳ Waiting 5 seconds before next batch...');
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Generate summary
    console.log('\n' + '='.repeat(60));
    console.log('🎨📚 EXPANDED CULTURE EXTRACTION COMPLETE');
    console.log('='.repeat(60));
    
    const successful = allRankings.length - failed.length;
    const successRate = ((successful / allRankings.length) * 100).toFixed(1);
    
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`✅ Successful: ${successful}/${allRankings.length} (${successRate}%)`);
    console.log(`❌ Failed: ${failed.length}`);
    console.log(`🌍 Total countries: ${Object.keys(countriesDataset).length}`);
    
    if (failed.length > 0) {
        console.log(`\n❌ Failed categories: ${failed.join(', ')}`);
    }
    
    // Save complete dataset
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const datasetFile = `expanded_culture_data_${timestamp}.json`;
    
    fs.writeFileSync(datasetFile, JSON.stringify(countriesDataset, null, 2));
    console.log(`\n💾 Complete dataset saved: ${datasetFile}`);
    
    // Generate detailed report
    const reportFile = `expanded_culture_report_${timestamp}.md`;
    generateCultureReport(results, failed, duration, successful, allRankings.length, reportFile);
    
    console.log(`📄 Detailed report saved: ${reportFile}`);
    console.log('\n🎉 Expanded culture extraction complete!');
    
    return {
        results,
        failed,
        countriesDataset,
        datasetFile,
        reportFile,
        stats: { successful, total: allRankings.length, successRate, duration }
    };
}

function generateCultureReport(results, failed, duration, successful, total, filename) {
    let report = `# Expanded Culture Rankings Dataset\n\n`;
    report += `## Summary\n`;
    report += `- **Created:** ${new Date().toISOString()}\n`;
    report += `- **Duration:** ${duration}s\n`;
    report += `- **Categories Processed:** ${total}\n`;
    report += `- **Successful Categories:** ${successful}\n`;
    report += `- **Failed Categories:** ${failed.length}\n`;
    report += `- **Success Rate:** ${((successful / total) * 100).toFixed(1)}%\n\n`;
    
    report += `## Cultural Categories Extracted\n`;
    
    // Group by cultural themes
    const themes = {
        'Heritage & Sites': ['worldHeritageSites', 'unescoSites', 'culturalHeritage'],
        'Awards & Recognition': ['academyAwards', 'nobelPrizes', 'cannesAwards', 'eurovisionWins'],
        'Publishing & Literature': ['booksPublished', 'booksPerCapita', 'literatureNobelPrizes', 'libraries'],
        'Cultural Influence': ['softPowerIndex', 'culturalInfluence', 'brandIndex', 'globalCulture'],
        'Language & Communication': ['languageDiversity', 'officialLanguages', 'englishProficiency', 'multilingualCountries'],
        'Travel & Tourism': ['passportPower', 'visaFreedom', 'touristArrivals', 'culturalTourism'],
        'Arts & Entertainment': ['musicExports', 'filmProduction', 'artMarket', 'museums'],
        'Cultural Values': ['powerDistance', 'culturalDimensions', 'collectivism', 'individualismIndex'],
        'Digital Culture': ['internetCulture', 'socialMediaUsage', 'digitalCulture'],
        'Traditional Culture': ['religiousDiversity', 'culturalPractices', 'traditionalFestivals']
    };
    
    Object.entries(themes).forEach(([theme, categories]) => {
        const themeResults = categories.filter(cat => results[cat]);
        if (themeResults.length > 0) {
            const avgCoverage = themeResults.reduce((sum, cat) => sum + results[cat].extractedCount, 0) / themeResults.length;
            const coveragePercent = ((avgCoverage / 195) * 100).toFixed(1);
            
            report += `### ${theme} (${themeResults.length} rankings, ${coveragePercent}% avg coverage)\n`;
            themeResults.forEach(cat => {
                const result = results[cat];
                const coverage = ((result.extractedCount / 195) * 100).toFixed(1);
                report += `- **${cat}:** ${result.extractedCount} countries (${coverage}%)\n`;
            });
            report += '\n';
        }
    });
    
    if (failed.length > 0) {
        report += `## Failed Categories\n`;
        failed.forEach(category => {
            report += `- **${category}**: Failed to extract data\n`;
        });
        report += '\n';
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    report += `## Integration File\n`;
    report += `Use \`expanded_culture_data_${timestamp}.json\` for Know-It-All integration.\n\n`;
    report += `This dataset contains ${successful} different cultural ranking categories with comprehensive country coverage.\n\n`;
    
    // Add detailed top countries for each successful category
    report += `## Detailed Rankings by Category\n`;
    Object.entries(results).forEach(([key, result]) => {
        const topCountries = Object.entries(result.data)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([country, value]) => `${country} (${value})`)
            .join(', ');
        report += `### ${key}\n`;
        report += `**Coverage:** ${result.extractedCount} countries\n`;
        report += `**Top 10:** ${topCountries}\n\n`;
    });
    
    fs.writeFileSync(filename, report);
}

// Main execution
if (require.main === module) {
    processExpandedCultureCategories().catch(console.error);
}

module.exports = { processExpandedCultureCategories, extractSingleCulturalRanking };