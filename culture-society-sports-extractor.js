#!/usr/bin/env node
/**
 * Culture, Society & Sports Rankings Extractor
 * Specialized extractor for complex Wikipedia pages with non-standard formats
 */

const { parseWikipediaPage, makeHttpsRequest, normalizeCountryName, isValidCountry } = require('./enhanced-wikipedia-parser-v2');
const fs = require('fs');

// Culture & Society Categories
const CULTURE_SOCIETY_RANKINGS = {
    // Culture Categories
    academyAwards: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_number_of_Academy_Awards_for_Best_International_Feature_Film', category: 'Culture' },
    worldHeritageSites: { url: 'https://en.wikipedia.org/wiki/List_of_World_Heritage_Sites_by_country', category: 'Culture' },
    booksPublished: { url: 'https://en.wikipedia.org/wiki/Books_published_per_country_per_year', category: 'Culture' },
    powerDistance: { url: 'https://en.wikipedia.org/wiki/Power_distance', category: 'Culture' },
    linguisticDiversity: { url: 'https://en.wikipedia.org/wiki/Linguistic_diversity_index', category: 'Culture' },
    softPower: { url: 'https://en.wikipedia.org/wiki/Soft_Power_30', category: 'Culture' },
    countryBrand: { url: 'https://en.wikipedia.org/wiki/Country_Brand_Index', category: 'Culture' },
    passportIndex: { url: 'https://en.wikipedia.org/wiki/Henley_Passport_Index', category: 'Culture' },

    // General Society Indices  
    goodCountry: { url: 'https://en.wikipedia.org/wiki/Good_Country_Index', category: 'Society' },
    whereToBeborn: { url: 'https://en.wikipedia.org/wiki/Where-to-be-born_Index', category: 'Society' },
    socialProgress: { url: 'https://en.wikipedia.org/wiki/Social_Progress_Index', category: 'Society' },
    prosperityIndex: { url: 'https://en.wikipedia.org/wiki/Legatum_Prosperity_Index', category: 'Society' },
    retirementIndex: { url: 'https://en.wikipedia.org/wiki/Global_Retirement_Index', category: 'Society' },
    givingIndex: { url: 'https://en.wikipedia.org/wiki/World_Giving_Index', category: 'Society' },
    organizedCrime: { url: 'https://en.wikipedia.org/wiki/Global_Organized_Crime_Index', category: 'Society' },
    slaveryIndex: { url: 'https://en.wikipedia.org/wiki/Global_Slavery_Index', category: 'Society' },
    
    // Demographics & Social Issues
    populationTotal: { url: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population', category: 'Society' },
    homelessPopulation: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_homeless_population', category: 'Society' },
    incarcerationRate: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_incarceration_rate', category: 'Society' },
    ethnicDiversity: { url: 'https://en.wikipedia.org/wiki/List_of_countries_ranked_by_ethnic_and_cultural_diversity_level', category: 'Society' },
    urbanization: { url: 'https://en.wikipedia.org/wiki/Urbanization_by_country', category: 'Society' },
    minimumIncome: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_guaranteed_minimum_income', category: 'Society' },
    tertiaryEducationSpending: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_public_spending_in_tertiary_education', category: 'Society' },

    // Gender & Development
    genderDevelopment: { url: 'https://en.wikipedia.org/wiki/Gender_Development_Index', category: 'Society' },
    genderEmpowerment: { url: 'https://en.wikipedia.org/wiki/Gender_Empowerment_Measure', category: 'Society' },
    genderInequality: { url: 'https://en.wikipedia.org/wiki/Gender_Inequality_Index', category: 'Society' },
    
    // Quality of Life
    dashboardSustainability: { url: 'https://en.wikipedia.org/wiki/Dashboard_of_Sustainability', category: 'Society' }
};

// Olympic & Sports Categories
const OLYMPIC_SPORTS_RANKINGS = {
    // Olympic Medal Rankings
    olympicMedals: { url: 'https://en.wikipedia.org/wiki/All-time_Olympic_Games_medal_table', category: 'Olympics' },
    olympicMedalsSummer: { url: 'https://en.wikipedia.org/wiki/All-time_Summer_Olympic_Games_medal_table', category: 'Olympics' },
    olympicMedalsWinter: { url: 'https://en.wikipedia.org/wiki/All-time_Winter_Olympic_Games_medal_table', category: 'Olympics' },
    paralympicMedals: { url: 'https://en.wikipedia.org/wiki/All-time_Paralympic_Games_medal_table', category: 'Olympics' },

    // Individual Sports Rankings
    archery: { url: 'https://en.wikipedia.org/wiki/World_Archery_Rankings', category: 'Sports' },
    athletics: { url: 'https://en.wikipedia.org/wiki/World_Athletics_Rankings', category: 'Sports' },
    badminton: { url: 'https://en.wikipedia.org/wiki/BWF_World_Rankings', category: 'Sports' },
    badmintonJunior: { url: 'https://en.wikipedia.org/wiki/BWF_Junior_World_Rankings', category: 'Sports' },
    beachSoccer: { url: 'https://en.wikipedia.org/wiki/Beach_Soccer_World_Rankings', category: 'Sports' },
    baseball: { url: 'https://en.wikipedia.org/wiki/World_Baseball_Softball_Confederation_rankings', category: 'Sports' },
    basketballMen: { url: 'https://en.wikipedia.org/wiki/FIBA_Men%27s_World_Ranking', category: 'Sports' },
    basketballWomen: { url: 'https://en.wikipedia.org/wiki/FIBA_Women%27s_World_Ranking', category: 'Sports' },
    boxing: { url: 'https://en.wikipedia.org/wiki/List_of_current_world_boxing_champions', category: 'Sports' },
    chess: { url: 'https://en.wikipedia.org/wiki/FIDE_world_rankings', category: 'Sports' },
    cricket: { url: 'https://en.wikipedia.org/wiki/ICC_Men%27s_Test_Team_Rankings', category: 'Sports' },
    cricketODI: { url: 'https://en.wikipedia.org/wiki/ICC_Men%27s_ODI_Team_Rankings', category: 'Sports' },
    cricketT20: { url: 'https://en.wikipedia.org/wiki/ICC_Men%27s_T20I_Team_Rankings', category: 'Sports' },
    curling: { url: 'https://en.wikipedia.org/wiki/World_Curling_Rankings', category: 'Sports' },
    cyclingRoad: { url: 'https://en.wikipedia.org/wiki/UCI_World_Tour_rankings', category: 'Sports' },
    darts: { url: 'https://en.wikipedia.org/wiki/PDC_Order_of_Merit', category: 'Sports' },
    figureSkating: { url: 'https://en.wikipedia.org/wiki/ISU_World_Standings', category: 'Sports' },
    floorball: { url: 'https://en.wikipedia.org/wiki/IFF_World_Ranking', category: 'Sports' },
    footballMen: { url: 'https://en.wikipedia.org/wiki/FIFA_Men%27s_World_Ranking', category: 'Sports' },
    footballWomen: { url: 'https://en.wikipedia.org/wiki/FIFA_Women%27s_World_Ranking', category: 'Sports' },
    footballElo: { url: 'https://en.wikipedia.org/wiki/World_Football_Elo_Ratings', category: 'Sports' },
    golfMen: { url: 'https://en.wikipedia.org/wiki/Official_World_Golf_Ranking', category: 'Sports' },
    golfWomen: { url: 'https://en.wikipedia.org/wiki/Women%27s_World_Golf_Rankings', category: 'Sports' },
    golfAmateur: { url: 'https://en.wikipedia.org/wiki/World_Amateur_Golf_Ranking', category: 'Sports' },
    fieldHockey: { url: 'https://en.wikipedia.org/wiki/FIH_World_Rankings', category: 'Sports' },
    iceHockey: { url: 'https://en.wikipedia.org/wiki/IIHF_World_Ranking', category: 'Sports' },
    korfball: { url: 'https://en.wikipedia.org/wiki/IKF_World_Ranking', category: 'Sports' },
    muayThai: { url: 'https://en.wikipedia.org/wiki/IFMA_World_Rankings', category: 'Sports' },
    netball: { url: 'https://en.wikipedia.org/wiki/INF_World_Rankings', category: 'Sports' },
    rollerHockey: { url: 'https://en.wikipedia.org/wiki/World_Skate_Roller_Hockey_World_Ranking', category: 'Sports' },
    rugbyLeagueMen: { url: 'https://en.wikipedia.org/wiki/IRL_Men%27s_World_Rankings', category: 'Sports' },
    rugbyLeagueWomen: { url: 'https://en.wikipedia.org/wiki/IRL_Women%27s_World_Rankings', category: 'Sports' },
    rugbyLeagueWheelchair: { url: 'https://en.wikipedia.org/wiki/RLIF_Wheelchair_World_Rankings', category: 'Sports' },
    rugbyUnion: { url: 'https://en.wikipedia.org/wiki/World_Rugby_Rankings', category: 'Sports' },
    snooker: { url: 'https://en.wikipedia.org/wiki/Snooker_world_rankings', category: 'Sports' },
    squashMen: { url: 'https://en.wikipedia.org/wiki/PSA_World_Rankings', category: 'Sports' },
    squashWomen: { url: 'https://en.wikipedia.org/wiki/PSA_Women%27s_World_Rankings', category: 'Sports' },
    tableTennis: { url: 'https://en.wikipedia.org/wiki/Table_tennis_world_rankings', category: 'Sports' },
    tennisMen: { url: 'https://en.wikipedia.org/wiki/ATP_Rankings', category: 'Sports' },
    tennisWomen: { url: 'https://en.wikipedia.org/wiki/WTA_Rankings', category: 'Sports' },
    tennisTeam: { url: 'https://en.wikipedia.org/wiki/ITF_World_Tennis_Rankings', category: 'Sports' },
    volleyballBeach: { url: 'https://en.wikipedia.org/wiki/FIVB_Beach_Volleyball_World_Rankings', category: 'Sports' },
    waterPolo: { url: 'https://en.wikipedia.org/wiki/FINA_Water_Polo_World_Rankings', category: 'Sports' }
};

// Combine all categories
const ALL_CATEGORIES = {
    ...CULTURE_SOCIETY_RANKINGS,
    ...OLYMPIC_SPORTS_RANKINGS
};

// Enhanced parsing strategies for complex pages
const SPECIALIZED_PARSING_STRATEGIES = {
    // Strategy for medal tables
    medalTable: {
        tableRegex: /<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>(.*?)<\/table>/gis,
        rowRegex: /<tr[^>]*>(.*?)<\/tr>/gis,
        cellRegex: /<t[dh][^>]*>(.*?)<\/t[dh]>/gis,
        skipRows: 1,
        medalColumns: true // Look for gold/silver/bronze or total columns
    },
    
    // Strategy for ranking lists
    rankingList: {
        itemRegex: /<li[^>]*>(.*?)<\/li>/gis,
        countryPattern: /(\d+)[\.\)]\s*([A-Z][a-z\s\-\.]+)[\s\-:]*([0-9,\.]+)/g,
        numbered: true
    },
    
    // Strategy for index pages with scores
    indexTable: {
        tableRegex: /<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>(.*?)<\/table>/gis,
        rowRegex: /<tr[^>]*>(.*?)<\/tr>/gis,
        cellRegex: /<t[dh][^>]*>(.*?)<\/t[dh]>/gis,
        skipRows: 1,
        scoreColumns: true // Look for numerical scores
    },
    
    // Strategy for complex multi-table pages
    multiTable: {
        tableRegex: /<table[^>]*>(.*?)<\/table>/gis,
        rowRegex: /<tr[^>]*>(.*?)<\/tr>/gis,
        cellRegex: /<t[dh][^>]*>(.*?)<\/t[dh]>/gis,
        skipRows: 1,
        findBestTable: true
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

function extractNumber(text) {
    if (!text) return null;
    
    // Handle different number formats
    const cleaned = text.replace(/,/g, '').replace(/\$|€|£/g, '');
    
    // Try to extract various number patterns
    const patterns = [
        /([0-9]+\.?[0-9]*)/,           // Simple numbers
        /(\d+)\s*medals?/i,            // Medal counts
        /(\d+)\s*points?/i,            // Point scores
        /(\d+)\s*sites?/i,             // Heritage sites
        /(\d+)\s*awards?/i,            // Awards count
        /rank\s*(\d+)/i,               // Rank position
        /(\d+)(?:st|nd|rd|th)/i        // Ordinal numbers
    ];
    
    for (const pattern of patterns) {
        const match = cleaned.match(pattern);
        if (match) {
            return parseFloat(match[1]);
        }
    }
    
    return null;
}

function parseSpecializedPage(html, category) {
    console.log(`   🎯 Using specialized parsing for ${category}...`);
    
    let bestResults = {};
    let bestCount = 0;
    let bestStrategy = '';
    
    // Try specialized strategies first
    for (const [strategyName, strategy] of Object.entries(SPECIALIZED_PARSING_STRATEGIES)) {
        const results = parseWithSpecializedStrategy(html, strategy, category);
        const count = Object.keys(results).length;
        
        console.log(`   🔍 Specialized strategy "${strategyName}": ${count} countries`);
        
        if (count > bestCount) {
            bestResults = results;
            bestCount = count;
            bestStrategy = strategyName;
        }
    }
    
    // Fall back to general parsing if specialized parsing fails
    if (bestCount === 0) {
        console.log(`   🔄 Falling back to general parsing...`);
        bestResults = parseWikipediaPage(html);
        bestCount = Object.keys(bestResults).length;
        bestStrategy = 'general';
    }
    
    console.log(`   ✅ Best specialized strategy: "${bestStrategy}" with ${bestCount} countries`);
    return bestResults;
}

function parseWithSpecializedStrategy(html, strategy, category) {
    const results = {};
    
    if (strategy.tableRegex) {
        // Table-based parsing with specialized logic
        const tables = html.match(strategy.tableRegex);
        if (!tables) return results;
        
        let bestTable = null;
        let bestCount = 0;
        
        // If findBestTable is true, evaluate all tables
        if (strategy.findBestTable) {
            tables.forEach(table => {
                const tempResults = parseTableForStrategy(table, strategy, category);
                if (Object.keys(tempResults).length > bestCount) {
                    bestTable = table;
                    bestCount = Object.keys(tempResults).length;
                }
            });
            
            if (bestTable) {
                return parseTableForStrategy(bestTable, strategy, category);
            }
        } else {
            // Use first/largest table
            const table = tables.length > 1 ? 
                tables.reduce((largest, current) => current.length > largest.length ? current : largest) :
                tables[0];
            return parseTableForStrategy(table, strategy, category);
        }
        
    } else if (strategy.itemRegex) {
        // List-based parsing
        const items = html.match(strategy.itemRegex);
        if (!items) return results;
        
        items.forEach(item => {
            if (strategy.numbered) {
                // Handle numbered lists like "1. Country Name: Score"
                const matches = item.matchAll(strategy.countryPattern);
                for (const match of matches) {
                    const rank = parseInt(match[1]);
                    const countryName = normalizeCountryName(match[2]);
                    const value = extractNumber(match[3]) || rank; // Use rank if no score
                    
                    if (countryName && isValidCountry(countryName)) {
                        results[countryName] = value;
                    }
                }
            } else {
                // General list parsing
                const countryMatch = item.match(/([A-Z][a-z\s\-\.]+)/);
                const valueMatch = item.match(/([0-9,\.]+)/);
                
                if (countryMatch && valueMatch) {
                    const countryName = normalizeCountryName(countryMatch[1]);
                    const value = extractNumber(valueMatch[1]);
                    
                    if (countryName && value !== null && isValidCountry(countryName)) {
                        results[countryName] = value;
                    }
                }
            }
        });
    }
    
    return results;
}

function parseTableForStrategy(table, strategy, category) {
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
            // Try different parsing strategies based on category type
            if (strategy.medalColumns) {
                // Look for medal tables (country, gold, silver, bronze, total)
                const countryName = normalizeCountryName(cells[0] || cells[1]);
                
                // Find total medals or gold medals
                let value = null;
                for (let i = 1; i < cells.length; i++) {
                    const cellValue = extractNumber(cells[i]);
                    if (cellValue && cellValue > (value || 0)) {
                        value = cellValue;
                    }
                }
                
                if (countryName && value !== null && isValidCountry(countryName)) {
                    results[countryName] = value;
                }
                
            } else if (strategy.scoreColumns) {
                // Look for index/score tables
                for (let countryCol = 0; countryCol < Math.min(3, cells.length); countryCol++) {
                    for (let valueCol = countryCol + 1; valueCol < cells.length; valueCol++) {
                        const countryName = normalizeCountryName(cells[countryCol]);
                        const value = extractNumber(cells[valueCol]);
                        
                        if (countryName && value !== null && isValidCountry(countryName)) {
                            if (!results[countryName] || value > (results[countryName] || 0)) {
                                results[countryName] = value;
                            }
                            break;
                        }
                    }
                    if (results[normalizeCountryName(cells[countryCol])]) break;
                }
                
            } else {
                // Default table parsing
                for (let countryCol = 0; countryCol < Math.min(3, cells.length); countryCol++) {
                    for (let valueCol = countryCol + 1; valueCol < cells.length; valueCol++) {
                        const countryName = normalizeCountryName(cells[countryCol]);
                        const value = extractNumber(cells[valueCol]);
                        
                        if (countryName && value !== null && isValidCountry(countryName)) {
                            if (!results[countryName] || value > (results[countryName] || 0)) {
                                results[countryName] = value;
                            }
                            break;
                        }
                    }
                    if (results[normalizeCountryName(cells[countryCol])]) break;
                }
            }
        }
    });
    
    return results;
}

async function extractSingleRanking(rankingKey, rankingConfig) {
    console.log(`\n🔍 Processing: ${rankingKey}`);
    console.log(`   URL: ${rankingConfig.url}`);
    
    try {
        const html = await makeHttpsRequest(rankingConfig.url);
        console.log(`   📥 Downloaded HTML (${Math.round(html.length / 1024)}KB)`);
        
        // Use specialized parsing for sports/culture categories
        const rankingData = parseSpecializedPage(html, rankingKey);
        
        if (Object.keys(rankingData).length === 0) {
            console.log(`   ❌ No data extracted for ${rankingKey}`);
            return null;
        }
        
        console.log(`   📊 Countries found: ${Object.keys(rankingData).length}`);
        const topCountries = Object.entries(rankingData)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
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

async function processAllCategories() {
    console.log('🎨🏆 Culture, Society & Sports Rankings Extractor');
    console.log('==================================================\n');
    
    const startTime = Date.now();
    const allRankings = Object.keys(ALL_CATEGORIES);
    const batchSize = 2; // Even smaller batches for complex pages
    
    console.log(`📋 Total categories to process: ${allRankings.length}`);
    console.log(`   Culture/Society: ${Object.keys(CULTURE_SOCIETY_RANKINGS).length}`);
    console.log(`   Olympic/Sports: ${Object.keys(OLYMPIC_SPORTS_RANKINGS).length}`);
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
            const result = await extractSingleRanking(rankingKey, ALL_CATEGORIES[rankingKey]);
            
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
            console.log('   ⏳ Waiting 8 seconds before next batch...');
            await new Promise(resolve => setTimeout(resolve, 8000));
        }
    }
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    // Generate summary
    console.log('\n' + '='.repeat(70));
    console.log('🎨🏆 CULTURE, SOCIETY & SPORTS EXTRACTION COMPLETE');
    console.log('='.repeat(70));
    
    const successful = allRankings.length - failed.length;
    const successRate = ((successful / allRankings.length) * 100).toFixed(1);
    
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`✅ Successful: ${successful}/${allRankings.length} (${successRate}%)`);
    console.log(`❌ Failed: ${failed.length}`);
    console.log(`🌍 Total countries: ${Object.keys(countriesDataset).length}`);
    
    // Show category breakdown
    const byCategory = {};
    Object.entries(results).forEach(([key, result]) => {
        if (!byCategory[result.category]) {
            byCategory[result.category] = [];
        }
        byCategory[result.category].push(key);
    });
    
    console.log('\n📊 Categories extracted:');
    Object.entries(byCategory).forEach(([category, rankings]) => {
        console.log(`   ${category}: ${rankings.length} rankings`);
    });
    
    if (failed.length > 0) {
        console.log(`\n❌ Failed categories: ${failed.join(', ')}`);
    }
    
    // Save complete dataset
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const datasetFile = `culture_society_sports_data_${timestamp}.json`;
    
    fs.writeFileSync(datasetFile, JSON.stringify(countriesDataset, null, 2));
    console.log(`\n💾 Complete dataset saved: ${datasetFile}`);
    
    // Generate detailed report
    const reportFile = `culture_society_sports_report_${timestamp}.md`;
    generateDetailedReport(results, failed, duration, successful, allRankings.length, reportFile, byCategory);
    
    console.log(`📄 Detailed report saved: ${reportFile}`);
    console.log('\n🎉 Culture, Society & Sports extraction complete!');
    
    return {
        results,
        failed,
        countriesDataset,
        datasetFile,
        reportFile,
        stats: { successful, total: allRankings.length, successRate, duration }
    };
}

function generateDetailedReport(results, failed, duration, successful, total, filename, byCategory) {
    let report = `# Culture, Society & Sports Rankings Dataset\n\n`;
    report += `## Summary\n`;
    report += `- **Created:** ${new Date().toISOString()}\n`;
    report += `- **Duration:** ${duration}s\n`;
    report += `- **Categories Processed:** ${total}\n`;
    report += `- **Successful Categories:** ${successful}\n`;
    report += `- **Failed Categories:** ${failed.length}\n`;
    report += `- **Success Rate:** ${((successful / total) * 100).toFixed(1)}%\n\n`;
    
    report += `## Categories Extracted by Domain\n`;
    Object.entries(byCategory).forEach(([category, rankings]) => {
        const categoryResults = rankings.map(key => results[key]);
        const avgCoverage = categoryResults.reduce((sum, result) => sum + result.extractedCount, 0) / categoryResults.length;
        const coveragePercent = ((avgCoverage / 195) * 100).toFixed(1);
        
        report += `### ${category} (${rankings.length} rankings, ${coveragePercent}% avg coverage)\n`;
        rankings.forEach(key => {
            const result = results[key];
            const coverage = ((result.extractedCount / 195) * 100).toFixed(1);
            report += `- **${key}:** ${result.extractedCount} countries (${coverage}%)\n`;
        });
        report += '\n';
    });
    
    if (failed.length > 0) {
        report += `## Failed Rankings\n`;
        failed.forEach(category => {
            report += `- **${category}** (${ALL_CATEGORIES[category].category}): Failed to extract data\n`;
        });
        report += '\n';
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    report += `## Integration File\n`;
    report += `Use \`culture_society_sports_data_${timestamp}.json\` for Know-It-All integration.\n\n`;
    report += `This dataset contains ${successful} different culture, society and sports ranking categories.\n\n`;
    
    // Add sample top countries for each category
    report += `## Top Countries by Domain\n`;
    Object.entries(byCategory).forEach(([category, rankings]) => {
        report += `### ${category}\n`;
        rankings.slice(0, 5).forEach(key => {
            const result = results[key];
            const topCountries = Object.entries(result.data)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([country, value]) => `${country} (${value})`)
                .join(', ');
            report += `- **${key}:** ${topCountries}\n`;
        });
        report += '\n';
    });
    
    fs.writeFileSync(filename, report);
}

// Main execution
if (require.main === module) {
    processAllCategories().catch(console.error);
}

module.exports = { processAllCategories, extractSingleRanking };