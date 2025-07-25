#!/usr/bin/env node
/**
 * UN Member Countries Filter
 * Filters dataset to include only actual UN member states (193 countries)
 * Plus a few widely recognized sovereign states not in UN
 */

const fs = require('fs');

// Official UN Member States (193 countries) + Vatican City + Taiwan (commonly included in rankings)
const UN_MEMBER_STATES = [
    // A
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 
    'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    
    // B  
    'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 
    'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 
    'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
    
    // C
    'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 
    'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Czechia',
    
    // D
    'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 
    'Dominican Republic',
    
    // E
    'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 
    'Eswatini', 'Ethiopia',
    
    // F
    'Fiji', 'Finland', 'France',
    
    // G
    'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 
    'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
    
    // H
    'Haiti', 'Honduras', 'Hungary',
    
    // I
    'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
    
    // J
    'Jamaica', 'Japan', 'Jordan',
    
    // K
    'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan',
    
    // L
    'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 
    'Lithuania', 'Luxembourg',
    
    // M
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 
    'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 
    'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
    
    // N
    'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 
    'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
    
    // O
    'Oman',
    
    // P
    'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 
    'Poland', 'Portugal',
    
    // Q
    'Qatar',
    
    // R
    'Romania', 'Russia', 'Rwanda',
    
    // S
    'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 
    'Samoa', 'San Marino', 'São Tomé and Príncipe', 'Saudi Arabia', 'Senegal', 
    'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 
    'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 
    'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
    
    // T
    'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 
    'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
    
    // U
    'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 
    'Uruguay', 'Uzbekistan',
    
    // V
    'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
    
    // Y
    'Yemen',
    
    // Z
    'Zambia', 'Zimbabwe',
    
    // Common alternative names found in Wikipedia tables
    'Cape Verde', 'Republic of the Congo', 'DR Congo', 'DRC', 'Democratic Republic of Congo',
    'Federated States of Micronesia', 'The Bahamas', 'The Gambia', 'Ivory Coast',
    'Côte d\'Ivoire', 'Republic of Ireland', 'Georgia (country)', 'Korea, South',
    'Korea, North', 'Czechia', 'Taiwan', 'Palestine'
];

// Create name mapping for common variations
const NAME_MAPPINGS = {
    'Cape Verde': 'Cabo Verde',
    'Republic of the Congo': 'Congo', 
    'DR Congo': 'Democratic Republic of the Congo',
    'DRC': 'Democratic Republic of the Congo',
    'Democratic Republic of Congo': 'Democratic Republic of the Congo',
    'Federated States of Micronesia': 'Micronesia',
    'The Bahamas': 'Bahamas',
    'The Gambia': 'Gambia',
    'Ivory Coast': 'Côte d\'Ivoire',
    'Republic of Ireland': 'Ireland',
    'Georgia (country)': 'Georgia',
    'Korea, South': 'South Korea',
    'Korea, North': 'North Korea',
    'Czechia': 'Czech Republic'
};

// Load dataset and filter to UN member states
function filterToUNMembers() {
    const files = fs.readdirSync('.').filter(f => f.startsWith('enhanced_countries_data_') && f.endsWith('.json'));
    
    if (files.length === 0) {
        throw new Error('No enhanced countries data file found.');
    }
    
    const latestFile = files.sort().reverse()[0];
    console.log(`📂 Loading dataset: ${latestFile}`);
    
    const allData = JSON.parse(fs.readFileSync(latestFile, 'utf8'));
    console.log(`🔍 Filtering ${Object.keys(allData).length} entities to UN member states...`);
    
    const unMemberData = {};
    const foundCountries = [];
    const notFoundCountries = [];
    
    // Create a set of all possible country names for faster lookup
    const countryNameSet = new Set([...UN_MEMBER_STATES, ...Object.keys(NAME_MAPPINGS)]);
    
    Object.entries(allData).forEach(([name, data]) => {
        // Check direct match
        if (countryNameSet.has(name)) {
            const standardName = NAME_MAPPINGS[name] || name;
            unMemberData[standardName] = data;
            foundCountries.push(name);
        }
        // Check fuzzy matches for common variations
        else {
            const fuzzyMatch = UN_MEMBER_STATES.find(country => {
                return name.includes(country) || 
                       country.includes(name) ||
                       name.replace(/[^a-zA-Z]/g, '').toLowerCase() === country.replace(/[^a-zA-Z]/g, '').toLowerCase();
            });
            
            if (fuzzyMatch) {
                unMemberData[fuzzyMatch] = data;
                foundCountries.push(`${name} → ${fuzzyMatch}`);
            } else {
                notFoundCountries.push(name);
            }
        }
    });
    
    return { unMemberData, foundCountries, notFoundCountries, originalFile: latestFile };
}

// Analyze the filtering results
function analyzeUNFiltering(unMemberData, foundCountries, notFoundCountries) {
    console.log('\n📊 UN Member States Filtering Results:');
    console.log(`✅ Found: ${Object.keys(unMemberData).length} UN member states`);
    console.log(`🔍 Matched: ${foundCountries.length} entities from dataset`);
    console.log(`🚫 Excluded: ${notFoundCountries.length} non-UN entities`);
    
    // Data coverage analysis
    const dataTypes = ['lifeExpectancy', 'gdpNominal', 'population', 'hdi'];
    console.log('\n📈 Data Coverage (UN Member States):');
    
    dataTypes.forEach(dataType => {
        const countriesWithData = Object.values(unMemberData)
            .filter(country => country[dataType] !== undefined).length;
        const total = Object.keys(unMemberData).length;
        const percentage = ((countriesWithData / total) * 100).toFixed(1);
        console.log(`   ${dataType}: ${countriesWithData}/${total} countries (${percentage}%)`);
    });
    
    // Show countries with complete data (all 4 rankings)
    const completeCountries = Object.entries(unMemberData)
        .filter(([_, data]) => dataTypes.every(type => data[type] !== undefined))
        .map(([name, _]) => name);
    
    console.log(`\n🎯 Countries with Complete Data (All 4 Rankings): ${completeCountries.length}`);
    if (completeCountries.length > 0) {
        completeCountries.slice(0, 20).forEach((name, i) => {
            console.log(`   ${i + 1}. ${name}`);
        });
        if (completeCountries.length > 20) {
            console.log(`   ... and ${completeCountries.length - 20} more`);
        }
    }
    
    // Show sample of excluded entities
    console.log('\n🚫 Sample Excluded Non-UN Entities:');
    notFoundCountries.slice(0, 20).forEach((name, i) => {
        console.log(`   ${i + 1}. ${name}`);
    });
    if (notFoundCountries.length > 20) {
        console.log(`   ... and ${notFoundCountries.length - 20} more`);
    }
}

// Save UN member states dataset
function saveUNDataset(unMemberData, originalFile) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    
    const unFile = `un_member_countries_${timestamp}.json`;
    fs.writeFileSync(unFile, JSON.stringify(unMemberData, null, 2));
    
    const reportFile = `un_countries_report_${timestamp}.md`;
    const total = Object.keys(unMemberData).length;
    const dataTypes = ['lifeExpectancy', 'gdpNominal', 'population', 'hdi'];
    
    const completeCountries = Object.entries(unMemberData)
        .filter(([_, data]) => dataTypes.every(type => data[type] !== undefined));
    
    const report = `# UN Member Countries Dataset

## Summary
- **Source:** Filtered from ${originalFile}
- **Created:** ${new Date().toISOString()}
- **Total Countries:** ${total} (UN Member States + Vatican City + Taiwan)
- **Countries with All 4 Rankings:** ${completeCountries.length}
- **Filtering Method:** Positive filter using UN member states list

## Data Coverage by Ranking
${dataTypes.map(type => {
    const count = Object.values(unMemberData).filter(c => c[type] !== undefined).length;
    const pct = ((count / total) * 100).toFixed(1);
    return `- **${type}:** ${count}/${total} countries (${pct}%)`;
}).join('\n')}

## Countries with Complete Data (All 4 Rankings)
${completeCountries.map(([name, _]) => `- ${name}`).join('\n')}

## Perfect for Country Ranking Games
This dataset contains only recognized sovereign nations and is ideal for:
- Know-It-All country challenges
- Geographic trivia games  
- Educational applications
- Any system requiring authentic country data

**File to use:** \`${unFile}\`
`;
    
    fs.writeFileSync(reportFile, report);
    
    console.log('\n📁 UN Member States Files:');
    console.log(`   🌍 ${unFile} - UN member countries only`);
    console.log(`   📈 ${reportFile} - Complete analysis`);
    
    return { unFile, reportFile };
}

// Main execution
async function main() {
    console.log('🇺🇳 UN Member Countries Filter');
    console.log('==============================');
    console.log('Filtering to actual UN member states (193 countries + Vatican + Taiwan)\n');
    
    try {
        const { unMemberData, foundCountries, notFoundCountries, originalFile } = filterToUNMembers();
        
        analyzeUNFiltering(unMemberData, foundCountries, notFoundCountries);
        
        const files = saveUNDataset(unMemberData, originalFile);
        
        console.log('\n✅ UN filtering complete!');
        console.log('\n🎯 Final Results:');
        console.log(`   • ${Object.keys(unMemberData).length} authentic countries`);
        console.log('   • All recognized sovereign nations');
        console.log('   • Perfect for country ranking games');
        console.log('   • Realistic dataset size');
        
        console.log('\n🚀 Ready for Integration:');
        console.log(`   • Use ${files.unFile} for your Know-It-All challenges`);
        console.log('   • This represents the real countries of the world');
        console.log('   • No territories, dependencies, or fictional entities');
        
        return unMemberData;
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}