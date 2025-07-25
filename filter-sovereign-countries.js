#!/usr/bin/env node
/**
 * Filter Sovereign Countries
 * Removes territories, dependencies, and regions to keep only sovereign nations
 */

const fs = require('fs');

// List of territories, dependencies, and regions to exclude
const NON_SOVEREIGN_ENTITIES = [
    // French territories
    'French Polynesia', 'Réunion', 'Martinique', 'Guadeloupe', 'French Guiana', 'Mayotte', 'New Caledonia',
    
    // British territories and dependencies
    'Bermuda', 'Cayman Islands', 'British Virgin Islands', 'Turks and Caicos Islands', 'Anguilla',
    'Montserrat', 'Falkland Islands', 'Gibraltar', 'Saint Helena', 'Ascension and Tristan da Cunha',
    
    // Crown Dependencies
    'Guernsey', 'Jersey', 'Isle of Man',
    
    // Special Administrative Regions
    'Hong Kong', 'Macau',
    
    // US territories
    'Puerto Rico', 'U.S. Virgin Islands', 'United States Virgin Islands', 'Guam', 'American Samoa',
    'Northern Mariana Islands',
    
    // Danish territories
    'Faroe Islands', 'Greenland',
    
    // Dutch territories
    'Aruba', 'Curaçao', 'Sint Maarten',
    
    // Other territories and dependencies
    'Cook Islands', 'Niue', 'Tokelau', 'Norfolk Island', 'Christmas Island', 'Cocos Islands',
    'Svalbard and Jan Mayen', 'Åland Islands',
    
    // Disputed or unrecognized territories
    'Western Sahara', 'Kosovo', 'Taiwan', 'Palestine',
    
    // Historical or regional entries
    'World', 'European Union', 'Euro area', 'OECD', 'East Asia & Pacific', 'Europe & Central Asia',
    'Latin America & Caribbean', 'Middle East & North Africa', 'North America', 'South Asia',
    'Sub-Saharan Africa'
];

// Load the enhanced dataset
function loadEnhancedDataset() {
    const files = fs.readdirSync('.').filter(f => f.startsWith('enhanced_countries_data_') && f.endsWith('.json'));
    
    if (files.length === 0) {
        throw new Error('No enhanced countries data file found. Run the enhanced parser first.');
    }
    
    // Get the most recent file
    const latestFile = files.sort().reverse()[0];
    console.log(`📂 Loading dataset: ${latestFile}`);
    
    const data = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
    return { data, filename: latestFile };
}

// Filter to sovereign countries only
function filterSovereignCountries(data) {
    console.log(`🔍 Filtering ${Object.keys(data).length} entities...`);
    
    const sovereignCountries = {};
    let excludedCount = 0;
    const excludedEntities = [];
    
    Object.entries(data).forEach(([name, countryData]) => {
        // Check if this entity should be excluded
        const isNonSovereign = NON_SOVEREIGN_ENTITIES.some(excluded => {
            return name === excluded || 
                   name.includes(excluded) || 
                   excluded.includes(name);
        });
        
        if (isNonSovereign) {
            excludedCount++;
            excludedEntities.push(name);
        } else {
            sovereignCountries[name] = countryData;
        }
    });
    
    console.log(`✅ Filtered to ${Object.keys(sovereignCountries).length} sovereign countries`);
    console.log(`🚫 Excluded ${excludedCount} territories/dependencies`);
    
    return { sovereignCountries, excludedEntities };
}

// Analyze the filtering results
function analyzeResults(original, filtered, excluded) {
    console.log('\n📊 Filtering Analysis:');
    console.log(`Original entities: ${Object.keys(original).length}`);
    console.log(`Sovereign countries: ${Object.keys(filtered).length}`);
    console.log(`Excluded entities: ${excluded.length}`);
    
    // Show data completeness for sovereign countries
    const dataTypes = ['lifeExpectancy', 'gdpNominal', 'population', 'hdi'];
    console.log('\n📈 Data Coverage (Sovereign Countries Only):');
    
    dataTypes.forEach(dataType => {
        const countriesWithData = Object.values(filtered)
            .filter(country => country[dataType] !== undefined).length;
        const percentage = ((countriesWithData / Object.keys(filtered).length) * 100).toFixed(1);
        console.log(`   ${dataType}: ${countriesWithData}/${Object.keys(filtered).length} countries (${percentage}%)`);
    });
    
    // Show sample of excluded entities
    console.log('\n🚫 Sample Excluded Entities:');
    excluded.slice(0, 15).forEach((entity, i) => {
        console.log(`   ${i + 1}. ${entity}`);
    });
    if (excluded.length > 15) {
        console.log(`   ... and ${excluded.length - 15} more`);
    }
    
    // Show top countries by data completeness
    console.log('\n🌍 Top Sovereign Countries by Data Completeness:');
    const countryCompleteness = Object.entries(filtered).map(([name, data]) => ({
        name,
        dataPoints: dataTypes.filter(type => data[type] !== undefined).length
    })).sort((a, b) => b.dataPoints - a.dataPoints);
    
    countryCompleteness.slice(0, 20).forEach((country, i) => {
        console.log(`   ${i + 1}. ${country.name}: ${country.dataPoints}/4 data points`);
    });
}

// Save filtered results
function saveFilteredResults(sovereignCountries, originalFilename) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    
    // Save sovereign countries dataset
    const sovereignFile = `sovereign_countries_${timestamp}.json`;
    fs.writeFileSync(sovereignFile, JSON.stringify(sovereignCountries, null, 2));
    
    // Create summary report
    const reportFile = `sovereign_countries_report_${timestamp}.md`;
    const totalCountries = Object.keys(sovereignCountries).length;
    
    const report = `# Sovereign Countries Dataset

## Summary
- **Source:** Filtered from ${originalFilename}
- **Created:** ${new Date().toISOString()}
- **Total Sovereign Countries:** ${totalCountries}
- **Filtering Method:** Excluded territories, dependencies, and special regions

## Data Coverage
${['lifeExpectancy', 'gdpNominal', 'population', 'hdi'].map(type => {
    const count = Object.values(sovereignCountries).filter(c => c[type] !== undefined).length;
    const pct = ((count / totalCountries) * 100).toFixed(1);
    return `- **${type}:** ${count}/${totalCountries} countries (${pct}%)`;
}).join('\n')}

## Countries with Complete Data (All 4 Rankings)
${Object.entries(sovereignCountries)
    .filter(([_, data]) => ['lifeExpectancy', 'gdpNominal', 'population', 'hdi'].every(type => data[type] !== undefined))
    .map(([name, _]) => `- ${name}`)
    .join('\n')}

## Integration Ready
This dataset contains only sovereign countries and is ready for integration into your Know-It-All challenges.

**Recommended Usage:** ${sovereignFile}
`;
    
    fs.writeFileSync(reportFile, report);
    
    console.log('\n📁 Filtered Files Generated:');
    console.log(`   🌍 ${sovereignFile} - Sovereign countries only`);
    console.log(`   📈 ${reportFile} - Analysis report`);
    
    return { sovereignFile, reportFile };
}

// Main execution
async function main() {
    console.log('🔍 Sovereign Countries Filter');
    console.log('============================');
    console.log('Filtering dataset to sovereign countries only\n');
    
    try {
        // Load the enhanced dataset
        const { data, filename } = loadEnhancedDataset();
        
        // Filter to sovereign countries
        const { sovereignCountries, excludedEntities } = filterSovereignCountries(data);
        
        // Analyze results
        analyzeResults(data, sovereignCountries, excludedEntities);
        
        // Save filtered results
        const files = saveFilteredResults(sovereignCountries, filename);
        
        console.log('\n✅ Filtering complete!');
        console.log('\n🎯 Key Results:');
        console.log(`   • Reduced from ${Object.keys(data).length} to ${Object.keys(sovereignCountries).length} entities`);
        console.log('   • Excluded territories, dependencies, and special regions');
        console.log('   • Kept only sovereign countries');
        console.log('   • Dataset now represents realistic country count');
        
        console.log('\n🚀 Next Steps:');
        console.log(`   • Use ${files.sovereignFile} for your Know-It-All integration`);
        console.log('   • This represents the actual countries of the world');
        console.log('   • Much more realistic for country ranking games');
        
        return sovereignCountries;
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    filterSovereignCountries,
    NON_SOVEREIGN_ENTITIES
};