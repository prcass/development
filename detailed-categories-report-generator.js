#!/usr/bin/env node
/**
 * Detailed Categories Report Generator
 * Creates comprehensive report showing all categories and their country rankings
 */

const fs = require('fs');

// Load the complete dataset
function loadCompleteDataset() {
    const files = fs.readdirSync('.').filter(f => f.startsWith('complete_countries_data_') && f.endsWith('.json'));
    
    if (files.length === 0) {
        throw new Error('No complete countries data file found. Run the complete extractor first.');
    }
    
    const latestFile = files.sort().reverse()[0];
    console.log(`📂 Loading dataset: ${latestFile}`);
    
    const data = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
    return { data, filename: latestFile };
}

// Analyze all categories and create detailed rankings
function analyzeAllCategories(countriesData) {
    console.log('🔍 Analyzing all categories and rankings...\n');
    
    // Get all unique categories (excluding _raw and _rank variants)
    const allCategories = new Set();
    Object.values(countriesData).forEach(country => {
        Object.keys(country).forEach(key => {
            if (!key.includes('_raw') && !key.includes('_rank')) {
                allCategories.add(key);
            }
        });
    });
    
    console.log(`📊 Found ${allCategories.size} unique ranking categories`);
    
    // Group categories by domain
    const categoryGroups = {
        Agriculture: [],
        Economy: [],
        Education: [],
        Environment: [],
        Geography: [],
        Health: [],
        Industry: [],
        Military: [],
        Society: [],
        Technology: [],
        Transport: [],
        Exports: []
    };
    
    // Categorize each ranking
    Array.from(allCategories).forEach(category => {
        if (category.includes('Production') || category.includes('forest') || category.includes('irrigated') || 
            category.includes('meat') || category.includes('milk') || category.includes('beer') || category.includes('coffee')) {
            categoryGroups.Agriculture.push(category);
        } else if (category.includes('gdp') || category.includes('debt') || category.includes('wage') || 
                   category.includes('wealth') || category.includes('corruption') || category.includes('economic') || 
                   category.includes('gini') || category.includes('business') || category.includes('freedom')) {
            categoryGroups.Economy.push(category);
        } else if (category.includes('education') || category.includes('literacy') || category.includes('tertiary') || 
                   category.includes('secondary')) {
            categoryGroups.Education.push(category);
        } else if (category.includes('pollution') || category.includes('co2') || category.includes('ecological') || 
                   category.includes('freshwater') || category.includes('disaster')) {
            categoryGroups.Environment.push(category);
        } else if (category.includes('area') || category.includes('population')) {
            categoryGroups.Geography.push(category);
        } else if (category.includes('life') || category.includes('infant') || category.includes('health') || 
                   category.includes('hospital') || category.includes('cancer') || category.includes('obesity') || 
                   category.includes('suicide') || category.includes('alcohol') || category.includes('cigarette')) {
            categoryGroups.Health.push(category);
        } else if (category.includes('electricity') || category.includes('oil') || category.includes('gas') || 
                   category.includes('gold') || category.includes('steel')) {
            categoryGroups.Industry.push(category);
        } else if (category.includes('military')) {
            categoryGroups.Military.push(category);
        } else if (category.includes('hdi') || category.includes('gender') || category.includes('homicide') || 
                   category.includes('incarceration')) {
            categoryGroups.Society.push(category);
        } else if (category.includes('internet') || category.includes('broadband')) {
            categoryGroups.Technology.push(category);
        } else if (category.includes('rail') || category.includes('vehicle') || category.includes('traffic')) {
            categoryGroups.Transport.push(category);
        } else if (category.includes('export') || category.includes('Export')) {
            categoryGroups.Exports.push(category);
        } else {
            // Uncategorized - try to guess or put in most likely category
            if (category.includes('consumption')) {
                categoryGroups.Agriculture.push(category);
            } else {
                categoryGroups.Society.push(category);
            }
        }
    });
    
    return categoryGroups;
}

// Get top countries for each ranking
function getTopCountriesForRanking(countriesData, category, limit = 10) {
    const countriesWithData = [];
    
    Object.entries(countriesData).forEach(([countryName, countryData]) => {
        if (countryData[category] !== undefined) {
            countriesWithData.push({
                country: countryName,
                value: countryData[category],
                rawValue: countryData[`${category}_raw`] || countryData[category]
            });
        }
    });
    
    // Sort by value (descending for most rankings)
    countriesWithData.sort((a, b) => {
        // Special handling for some categories that should be ascending
        if (category.includes('mortality') || category.includes('suicide') || category.includes('homicide') || 
            category.includes('pollution') || category.includes('co2') || category.includes('traffic')) {
            return a.value - b.value; // Ascending (lower is better)
        }
        return b.value - a.value; // Descending (higher is better)
    });
    
    return {
        totalCountries: countriesWithData.length,
        topCountries: countriesWithData.slice(0, limit),
        coverage: `${countriesWithData.length}/195 countries (${((countriesWithData.length / 195) * 100).toFixed(1)}%)`
    };
}

// Generate comprehensive report
function generateComprehensiveReport(categoryGroups, countriesData) {
    console.log('📝 Generating comprehensive categories report...\n');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const reportFile = `comprehensive_categories_report_${timestamp}.md`;
    
    let report = `# Comprehensive Country Rankings Categories Report

Generated: ${new Date().toISOString()}

## Summary
This report shows all ${Object.values(categoryGroups).flat().length} ranking categories extracted from Wikipedia, organized by domain, with top-performing countries for each ranking.

---

`;

    // Process each category group
    Object.entries(categoryGroups).forEach(([groupName, categories]) => {
        if (categories.length === 0) return;
        
        report += `## ${groupName} Rankings (${categories.length} categories)\n\n`;
        
        categories.sort().forEach(category => {
            const rankingData = getTopCountriesForRanking(countriesData, category);
            
            // Format category name for display
            const displayName = category
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .replace(/\b\w/g, str => str.toUpperCase());
            
            report += `### ${displayName}\n`;
            report += `**Coverage:** ${rankingData.coverage}\n\n`;
            
            if (rankingData.topCountries.length > 0) {
                report += `**Top 10 Countries:**\n`;
                rankingData.topCountries.forEach((country, index) => {
                    report += `${index + 1}. **${country.country}**: ${country.rawValue}\n`;
                });
                report += '\n';
            } else {
                report += `*No data available*\n\n`;
            }
            
            report += '---\n\n';
        });
    });
    
    // Add summary statistics
    report += `## Dataset Statistics\n\n`;
    
    const totalCategories = Object.values(categoryGroups).flat().length;
    const categoriesWithData = Object.values(categoryGroups).flat().filter(cat => {
        const data = getTopCountriesForRanking(countriesData, cat);
        return data.totalCountries > 0;
    }).length;
    
    report += `- **Total Categories:** ${totalCategories}\n`;
    report += `- **Categories with Data:** ${categoriesWithData}\n`;
    report += `- **Success Rate:** ${((categoriesWithData / totalCategories) * 100).toFixed(1)}%\n\n`;
    
    // Category breakdown
    report += `### Categories by Domain\n\n`;
    Object.entries(categoryGroups).forEach(([groupName, categories]) => {
        if (categories.length > 0) {
            const withData = categories.filter(cat => {
                const data = getTopCountriesForRanking(countriesData, cat);
                return data.totalCountries > 0;
            }).length;
            report += `- **${groupName}:** ${withData}/${categories.length} categories with data\n`;
        }
    });
    
    report += `\n---\n\n`;
    report += `*This report shows every ranking category available in the dataset, organized by domain with top-performing countries for each metric.*\n`;
    
    fs.writeFileSync(reportFile, report);
    
    return reportFile;
}

// Generate summary table
function generateSummaryTable(categoryGroups, countriesData) {
    console.log('📊 Generating summary table...\n');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const tableFile = `categories_summary_table_${timestamp}.md`;
    
    let table = `# Country Rankings Categories Summary Table

| Domain | Category | Countries with Data | Coverage | Top Country | Top Value |
|--------|----------|-------------------|----------|-------------|-----------|
`;

    Object.entries(categoryGroups).forEach(([groupName, categories]) => {
        categories.sort().forEach(category => {
            const rankingData = getTopCountriesForRanking(countriesData, category, 1);
            
            const displayName = category
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase());
            
            const topCountry = rankingData.topCountries.length > 0 ? rankingData.topCountries[0] : null;
            
            table += `| ${groupName} | ${displayName} | ${rankingData.totalCountries} | ${((rankingData.totalCountries / 195) * 100).toFixed(1)}% | ${topCountry ? topCountry.country : 'N/A'} | ${topCountry ? topCountry.rawValue : 'N/A'} |\n`;
        });
    });
    
    fs.writeFileSync(tableFile, table);
    
    return tableFile;
}

// Display console summary
function displayConsoleSummary(categoryGroups, countriesData) {
    console.log('📋 COMPREHENSIVE CATEGORIES SUMMARY');
    console.log('===================================\n');
    
    Object.entries(categoryGroups).forEach(([groupName, categories]) => {
        if (categories.length === 0) return;
        
        console.log(`📊 ${groupName} (${categories.length} categories):`);
        
        categories.sort().forEach(category => {
            const rankingData = getTopCountriesForRanking(countriesData, category, 3);
            const displayName = category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            
            if (rankingData.totalCountries > 0) {
                const topCountry = rankingData.topCountries[0];
                console.log(`   ✅ ${displayName}: ${rankingData.totalCountries} countries (Top: ${topCountry.country})`);
            } else {
                console.log(`   ❌ ${displayName}: No data available`);
            }
        });
        console.log('');
    });
    
    const totalCategories = Object.values(categoryGroups).flat().length;
    const categoriesWithData = Object.values(categoryGroups).flat().filter(cat => {
        const data = getTopCountriesForRanking(countriesData, cat);
        return data.totalCountries > 0;
    }).length;
    
    console.log(`📈 TOTAL: ${categoriesWithData}/${totalCategories} categories with data (${((categoriesWithData / totalCategories) * 100).toFixed(1)}% success rate)`);
}

// Main execution
async function main() {
    console.log('📊 Detailed Categories Report Generator');
    console.log('======================================\n');
    
    try {
        // Load the complete dataset
        const { data: countriesData, filename } = loadCompleteDataset();
        
        // Analyze all categories
        const categoryGroups = analyzeAllCategories(countriesData);
        
        // Display console summary
        displayConsoleSummary(categoryGroups, countriesData);
        
        // Generate detailed report
        const reportFile = generateComprehensiveReport(categoryGroups, countriesData);
        
        // Generate summary table
        const tableFile = generateSummaryTable(categoryGroups, countriesData);
        
        console.log('\n📁 Reports Generated:');
        console.log(`   📖 ${reportFile} - Detailed report with top countries for each category`);
        console.log(`   📊 ${tableFile} - Summary table with all categories`);
        
        console.log('\n✅ Categories report generation complete!');
        console.log('\n🎯 What the Reports Show:');
        console.log('   • Every ranking category organized by domain');
        console.log('   • Top 10 countries for each ranking');
        console.log('   • Coverage statistics for each category');
        console.log('   • Complete summary table for quick reference');
        
        return { reportFile, tableFile };
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}