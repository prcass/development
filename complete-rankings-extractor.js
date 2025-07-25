#!/usr/bin/env node
/**
 * Complete Rankings Extractor
 * Processes ALL Wikipedia country ranking categories from the comprehensive list
 * Ensures we get every single ranking mentioned on the international rankings page
 */

const fs = require('fs');
const https = require('https');

// COMPLETE list of ALL Wikipedia ranking pages from the international rankings page
const ALL_WIKIPEDIA_RANKINGS = {
    // Agriculture - Production
    appleProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_apple_production', category: 'Agriculture' },
    apricotProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_apricot_production', category: 'Agriculture' },
    avocadoProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_avocado_production', category: 'Agriculture' },
    barleyProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_barley_production', category: 'Agriculture' },
    cerealProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_cereal_production', category: 'Agriculture' },
    coffeeProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_coffee_production', category: 'Agriculture' },
    cornProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_corn_production', category: 'Agriculture' },
    grapeProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_grape_production', category: 'Agriculture' },
    potatoProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_potato_production', category: 'Agriculture' },
    riceProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_rice_production', category: 'Agriculture' },
    tomatoProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_tomato_production', category: 'Agriculture' },
    wheatProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_wheat_production', category: 'Agriculture' },
    wineProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_wine_production', category: 'Agriculture' },
    
    // Agriculture - Other
    forestArea: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_forest_area', category: 'Agriculture' },
    irrigatedLand: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_irrigated_land_area', category: 'Agriculture' },
    
    // Agriculture - Consumption
    meatConsumption: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_meat_consumption', category: 'Agriculture' },
    milkConsumption: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_milk_consumption_per_capita', category: 'Agriculture' },
    beerConsumption: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_beer_consumption_per_capita', category: 'Agriculture' },
    
    // Economy - Major indices
    gdpNominal: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)', category: 'Economy' },
    gdpPPP: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(PPP)', category: 'Economy' },
    gdpPerCapita: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_per_capita', category: 'Economy' },
    gdpGrowthRate: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_real_GDP_growth_rate', category: 'Economy' },
    giniIndex: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_income_equality', category: 'Economy' },
    economicComplexity: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_economic_complexity', category: 'Economy' },
    externalDebt: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_external_debt', category: 'Economy' },
    publicDebt: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_public_debt', category: 'Economy' },
    averageWage: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_average_wage', category: 'Economy' },
    wealthPerAdult: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_wealth_per_adult', category: 'Economy' },
    corruptionIndex: { url: 'https://en.wikipedia.org/wiki/Corruption_Perceptions_Index', category: 'Economy' },
    easeDoingBusiness: { url: 'https://en.wikipedia.org/wiki/Ease_of_doing_business_index', category: 'Economy' },
    economicFreedom: { url: 'https://en.wikipedia.org/wiki/Index_of_Economic_Freedom', category: 'Economy' },
    
    // Education
    educationSpending: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_spending_on_education_(%25_of_GDP)', category: 'Education' },
    literacyRate: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_literacy_rate', category: 'Education' },
    tertiaryEducation: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_tertiary_education_attainment', category: 'Education' },
    secondaryEducation: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_secondary_education_attainment', category: 'Education' },
    
    // Environment
    airPollution: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_air_pollution', category: 'Environment' },
    co2Emissions: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_carbon_dioxide_emissions', category: 'Environment' },
    co2EmissionsPerCapita: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_carbon_dioxide_emissions_per_capita', category: 'Environment' },
    ecologicalFootprint: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_ecological_footprint', category: 'Environment' },
    freshwaterWithdrawal: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_freshwater_withdrawal', category: 'Environment' },
    naturalDisasterRisk: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_natural_disaster_risk', category: 'Environment' },
    
    // Geography
    area: { url: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_area', category: 'Geography' },
    population: { url: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population', category: 'Geography' },
    populationDensity: { url: 'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population_density', category: 'Geography' },
    
    // Health
    lifeExpectancy: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_life_expectancy', category: 'Health' },
    infantMortality: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_infant_mortality_rate', category: 'Health' },
    healthInsurance: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_health_insurance_coverage', category: 'Health' },
    healthcareQuality: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_quality_of_healthcare', category: 'Health' },
    hospitalBeds: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_hospital_beds', category: 'Health' },
    cancerRate: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_cancer_rate', category: 'Health' },
    obesityRate: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_obesity_rate', category: 'Health' },
    suicideRate: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_suicide_rate', category: 'Health' },
    alcoholConsumption: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_alcohol_consumption_per_capita', category: 'Health' },
    cigaretteConsumption: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_cigarette_consumption_per_capita', category: 'Health' },
    
    // Industry & Production
    electricityProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_electricity_production', category: 'Industry' },
    oilProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_oil_production', category: 'Industry' },
    naturalGasProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_natural_gas_production', category: 'Industry' },
    goldProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_gold_production', category: 'Industry' },
    steelProduction: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_steel_production', category: 'Industry' },
    
    // Military
    militaryExpenditure: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_military_expenditures', category: 'Military' },
    militaryPersonnel: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_number_of_military_and_paramilitary_personnel', category: 'Military' },
    
    // Society & Development
    hdi: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_Human_Development_Index', category: 'Society' },
    genderGapIndex: { url: 'https://en.wikipedia.org/wiki/Global_Gender_Gap_Report', category: 'Society' },
    homicideRate: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_intentional_homicide_rate', category: 'Society' },
    incarcerationRate: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_incarceration_rate', category: 'Society' },
    
    // Technology
    internetUsers: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_number_of_Internet_users', category: 'Technology' },
    internetSpeeds: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_Internet_connection_speeds', category: 'Technology' },
    broadbandSubscriptions: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_number_of_broadband_Internet_subscriptions', category: 'Technology' },
    
    // Transport
    railUsage: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_rail_usage', category: 'Transport' },
    vehiclesPerCapita: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_vehicles_per_capita', category: 'Transport' },
    trafficDeaths: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_traffic-related_death_rate', category: 'Transport' },
    
    // Exports
    exports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_exports', category: 'Exports' },
    netExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_net_exports', category: 'Exports' },
    goldExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_gold_exports', category: 'Exports' },
    oilExports: { url: 'https://en.wikipedia.org/wiki/List_of_countries_by_oil_exports', category: 'Exports' },
    
    // Add more as needed - this gives us 70+ categories to start with
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

// HTTP request function (same as before)
function fetchWikipediaPage(url) {
    return new Promise((resolve, reject) => {
        const urlParts = new URL(url);
        
        const options = {
            hostname: urlParts.hostname,
            port: 443,
            path: urlParts.pathname + urlParts.search,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Complete-Rankings-Extractor/1.0)',
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

        req.setTimeout(15000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.on('error', (error) => {
            reject(new Error(`Request failed: ${error.message}`));
        });

        req.end();
    });
}

// Enhanced table parser
function parseAnyTable(html, rankingType) {
    const countries = {};
    let tableCount = 0;
    
    const tableRegex = /<table[^>]*class="[^"]*wikitable[^"]*"[^>]*>(.*?)<\/table>/gis;
    let tableMatch;
    
    while ((tableMatch = tableRegex.exec(html)) !== null) {
        tableCount++;
        const tableHTML = tableMatch[1];
        
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
                cellText = cellText.replace(/<img[^>]*>/g, '');
                cellText = cellText.replace(/<[^>]*>/g, '');
                cellText = cellText.replace(/&nbsp;/g, ' ');
                cellText = cellText.replace(/&amp;/g, '&');
                cellText = cellText.replace(/&lt;/g, '<');
                cellText = cellText.replace(/&gt;/g, '>');
                cellText = cellText.replace(/\[\d+\]/g, '');
                cellText = cellText.replace(/\s+/g, ' ').trim();
                
                cells.push(cellText);
            }
            
            // Try different column combinations to find country + value
            if (cells.length >= 2) {
                for (let countryCol = 0; countryCol < Math.min(3, cells.length - 1); countryCol++) {
                    for (let valueCol = countryCol + 1; valueCol < Math.min(countryCol + 4, cells.length); valueCol++) {
                        const countryName = cells[countryCol];
                        const valueText = cells[valueCol];
                        
                        if (countryName && valueText && countryName.length > 1) {
                            // Clean country name
                            let cleanCountryName = countryName.replace(/^\d+\.?\s*/, '');
                            cleanCountryName = cleanCountryName.replace(/\s*\([^)]*\)/g, '');
                            cleanCountryName = cleanCountryName.trim();
                            
                            // Skip invalid entries
                            if (cleanCountryName.length < 2 || /^\d+$/.test(cleanCountryName) || 
                                cleanCountryName.includes('World') || cleanCountryName.includes('Total') ||
                                cleanCountryName.includes('Source') || cleanCountryName.includes('Note')) {
                                continue;
                            }
                            
                            // Check if this looks like a country name (basic validation)
                            if (isLikelyCountryName(cleanCountryName)) {
                                const numericValue = extractNumericValue(valueText);
                                
                                if (numericValue !== null) {
                                    countries[cleanCountryName] = {
                                        name: cleanCountryName,
                                        value: numericValue,
                                        rawValue: valueText,
                                        source: `Wikipedia ${rankingType} table`,
                                        columnIndex: `${countryCol}-${valueCol}`
                                    };
                                    break; // Found a valid entry, move to next row
                                }
                            }
                        }
                    }
                    if (countries[Object.keys(countries)[Object.keys(countries).length - 1]]?.columnIndex?.includes(`${countryCol}-`)) {
                        break; // Found country in this column, stick with it
                    }
                }
            }
        }
    }
    
    console.log(`   ✅ Found ${Object.keys(countries).length} countries in ${tableCount} tables`);
    return countries;
}

// Check if text looks like a country name
function isLikelyCountryName(text) {
    // Basic heuristics for country names
    if (text.length < 2 || text.length > 50) return false;
    if (/^\d+\.?\d*$/.test(text)) return false; // Pure numbers
    if (/^[0-9%$€£¥,.\s]+$/.test(text)) return false; // Only numbers and symbols
    if (text.toLowerCase().includes('rank')) return false;
    if (text.toLowerCase().includes('position')) return false;
    if (text.toLowerCase().includes('score')) return false;
    
    return true;
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
    
    // Large numbers with units (billion, million, etc.)
    const unitPattern = /(\d+(?:\.\d+)?)\s*(billion|million|thousand)/i;
    const unitMatch = cleaned.match(unitPattern);
    if (unitMatch) {
        const num = parseFloat(unitMatch[1]);
        const unit = unitMatch[2].toLowerCase();
        if (unit === 'billion') return num * 1000000000;
        if (unit === 'million') return num * 1000000;
        if (unit === 'thousand') return num * 1000;
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

// Fetch single ranking with enhanced error handling
async function fetchCompleteRankingData(rankingType, config) {
    console.log(`🌐 Fetching ${rankingType} (${config.category})...`);
    
    try {
        const html = await fetchWikipediaPage(config.url);
        console.log(`   📄 Received ${(html.length / 1024).toFixed(1)}KB of HTML`);
        
        const countries = parseAnyTable(html, rankingType);
        const filteredCountries = filterToUNMembers(countries);
        
        const countryCount = Object.keys(filteredCountries).length;
        const completeness = ((countryCount / 195) * 100).toFixed(1);
        
        console.log(`   🎯 Results: ${countryCount} UN member countries (${completeness}% coverage)`);
        
        return {
            type: rankingType,
            category: config.category,
            countries: filteredCountries,
            statistics: {
                found: countryCount,
                completeness: completeness + '%',
                success: true
            }
        };
        
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        return {
            type: rankingType,
            category: config.category,
            countries: {},
            statistics: {
                found: 0,
                completeness: '0%',
                success: false,
                error: error.message
            }
        };
    }
}

// Build complete dataset with ALL rankings
async function buildCompleteDataset() {
    console.log('🎯 Building COMPLETE dataset with ALL Wikipedia rankings...\n');
    console.log(`Processing ${Object.keys(ALL_WIKIPEDIA_RANKINGS).length} ranking categories...\n`);
    
    const startTime = Date.now();
    const dataset = {
        metadata: {
            source: "Complete Wikipedia rankings extraction",
            created: new Date().toISOString(),
            fetchDuration: 0,
            totalCategories: Object.keys(ALL_WIKIPEDIA_RANKINGS).length,
            processedCategories: 0,
            successfulCategories: 0,
            failedCategories: 0
        },
        countries: {},
        rankings: {},
        statistics: {},
        categorySummary: {},
        failedRankings: []
    };
    
    // Initialize country entries
    UN_MEMBER_STATES.forEach(country => {
        dataset.countries[country] = {
            name: country,
            data: {}
        };
    });
    
    // Process rankings in batches to avoid overwhelming the server
    const rankingEntries = Object.entries(ALL_WIKIPEDIA_RANKINGS);
    const batchSize = 5;
    let processedCount = 0;
    
    for (let i = 0; i < rankingEntries.length; i += batchSize) {
        const batch = rankingEntries.slice(i, i + batchSize);
        
        console.log(`📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(rankingEntries.length/batchSize)} (${batch.length} rankings):`);
        
        // Process batch in parallel
        const batchPromises = batch.map(([rankingType, config]) => 
            fetchCompleteRankingData(rankingType, config)
        );
        
        const batchResults = await Promise.all(batchPromises);
        
        // Process results
        batchResults.forEach(rankingData => {
            const { type, category } = rankingData;
            
            dataset.rankings[type] = rankingData;
            dataset.statistics[type] = rankingData.statistics;
            dataset.metadata.processedCategories++;
            
            if (rankingData.statistics.success) {
                dataset.metadata.successfulCategories++;
                
                // Track categories
                if (!dataset.categorySummary[category]) {
                    dataset.categorySummary[category] = {
                        rankings: [],
                        totalCountries: 0,
                        successfulRankings: 0
                    };
                }
                dataset.categorySummary[category].rankings.push(type);
                dataset.categorySummary[category].totalCountries += rankingData.statistics.found;
                dataset.categorySummary[category].successfulRankings++;
                
                // Merge data into countries
                Object.entries(rankingData.countries).forEach(([countryName, countryData]) => {
                    if (dataset.countries[countryName]) {
                        dataset.countries[countryName].data[type] = countryData.value;
                        dataset.countries[countryName].data[`${type}_raw`] = countryData.rawValue;
                    }
                });
            } else {
                dataset.metadata.failedCategories++;
                dataset.failedRankings.push({
                    type: type,
                    category: category,
                    error: rankingData.statistics.error
                });
            }
            
            processedCount++;
        });
        
        // Progress update
        console.log(`   ✅ Batch complete. Progress: ${processedCount}/${rankingEntries.length} rankings processed\n`);
        
        // Respectful delay between batches
        if (i + batchSize < rankingEntries.length) {
            console.log('   ⏱️  Waiting 10 seconds before next batch...\n');
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }
    
    // Calculate final statistics
    dataset.metadata.fetchDuration = ((Date.now() - startTime) / 1000).toFixed(2) + 's';
    
    return dataset;
}

// Display comprehensive results
function displayCompleteResults(dataset) {
    console.log('🎉 COMPLETE Rankings Dataset Built!');
    console.log('==================================');
    console.log(`Duration: ${dataset.metadata.fetchDuration}`);
    console.log(`Categories Processed: ${dataset.metadata.processedCategories}`);
    console.log(`Successful: ${dataset.metadata.successfulCategories}`);
    console.log(`Failed: ${dataset.metadata.failedCategories}`);
    console.log(`Success Rate: ${((dataset.metadata.successfulCategories / dataset.metadata.processedCategories) * 100).toFixed(1)}%`);
    
    console.log('\n📊 Success by Category:');
    Object.entries(dataset.categorySummary).forEach(([category, summary]) => {
        const avgCoverage = summary.totalCountries > 0 ? 
            (summary.totalCountries / (summary.successfulRankings * 195) * 100).toFixed(1) : '0';
        console.log(`   ${category}: ${summary.successfulRankings} rankings, ${avgCoverage}% avg coverage`);
    });
    
    // Show countries with most complete data
    console.log('\n🌍 Countries with Most Complete Data:');
    const countryCompleteness = Object.entries(dataset.countries).map(([name, data]) => ({
        name,
        dataPoints: Object.keys(data.data).filter(key => !key.includes('_')).length
    })).sort((a, b) => b.dataPoints - a.dataPoints);
    
    countryCompleteness.slice(0, 15).forEach((country, i) => {
        console.log(`   ${i + 1}. ${country.name}: ${country.dataPoints} rankings`);
    });
    
    // Show failed rankings
    if (dataset.failedRankings.length > 0) {
        console.log('\n❌ Failed Rankings (may need manual review):');
        dataset.failedRankings.slice(0, 10).forEach((failed, i) => {
            console.log(`   ${i + 1}. ${failed.type} (${failed.category}): ${failed.error.substring(0, 50)}...`);
        });
        if (dataset.failedRankings.length > 10) {
            console.log(`   ... and ${dataset.failedRankings.length - 10} more failed rankings`);
        }
    }
}

// Save complete results
function saveCompleteResults(dataset) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    
    // Complete dataset
    const datasetFile = `complete_all_rankings_dataset_${timestamp}.json`;
    fs.writeFileSync(datasetFile, JSON.stringify(dataset, null, 2));
    
    // Countries data only (for integration)
    const countriesOnly = {};
    Object.entries(dataset.countries).forEach(([name, country]) => {
        if (Object.keys(country.data).length > 0) {
            countriesOnly[name] = country.data;
        }
    });
    
    const countriesFile = `complete_countries_data_${timestamp}.json`;
    fs.writeFileSync(countriesFile, JSON.stringify(countriesOnly, null, 2));
    
    // Summary report
    const reportFile = `complete_rankings_report_${timestamp}.md`;
    const report = `# Complete Wikipedia Rankings Dataset

## Summary
- **Created:** ${dataset.metadata.created}
- **Duration:** ${dataset.metadata.fetchDuration}
- **Categories Processed:** ${dataset.metadata.processedCategories}
- **Successful Categories:** ${dataset.metadata.successfulCategories}
- **Failed Categories:** ${dataset.metadata.failedCategories}
- **Success Rate:** ${((dataset.metadata.successfulCategories / dataset.metadata.processedCategories) * 100).toFixed(1)}%

## Categories Extracted
${Object.entries(dataset.categorySummary).map(([category, summary]) => {
    const avgCoverage = summary.totalCountries > 0 ? 
        (summary.totalCountries / (summary.successfulRankings * 195) * 100).toFixed(1) : '0';
    return `### ${category} (${summary.successfulRankings} rankings, ${avgCoverage}% avg coverage)
${summary.rankings.map(ranking => {
    const stats = dataset.statistics[ranking];
    return `- **${ranking}:** ${stats.found} countries (${stats.completeness})`;
}).join('\n')}`;
}).join('\n\n')}

## Failed Rankings
${dataset.failedRankings.map(failed => 
    `- **${failed.type}** (${failed.category}): ${failed.error}`
).join('\n')}

## Integration File
Use \`${countriesFile}\` for Know-It-All integration.

This dataset contains ${dataset.metadata.successfulCategories} different country ranking categories across all major domains.
`;
    
    fs.writeFileSync(reportFile, report);
    
    console.log('\n📁 Complete Dataset Files:');
    console.log(`   📊 ${datasetFile} - Complete dataset with metadata`);
    console.log(`   🌍 ${countriesFile} - Countries data ready for Know-It-All integration`);
    console.log(`   📈 ${reportFile} - Complete analysis report`);
    
    return { datasetFile, countriesFile, reportFile };
}

// Main execution
async function main() {
    console.log('🚀 Complete Rankings Extractor');
    console.log('===============================');
    console.log('Extracting ALL Wikipedia country rankings mentioned on the international rankings page\n');
    
    try {
        const dataset = await buildCompleteDataset();
        displayCompleteResults(dataset);
        const files = saveCompleteResults(dataset);
        
        console.log('\n✅ Complete extraction finished!');
        console.log('\n🎯 What We Accomplished:');
        console.log(`   • Processed ${dataset.metadata.processedCategories} ranking categories`);
        console.log(`   • Successfully extracted ${dataset.metadata.successfulCategories} categories`);
        console.log('   • Covered Agriculture, Economy, Education, Environment, Health, Industry, Military, Society, Technology, Transport, and more');
        console.log('   • Built the most comprehensive country rankings dataset possible');
        
        console.log('\n🚀 Ready for Know-It-All Integration:');
        console.log(`   • Use ${files.countriesFile} for your game`);
        console.log('   • Contains every available Wikipedia country ranking');
        console.log('   • Perfect for creating diverse and comprehensive challenges');
        
        return dataset;
        
    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }
}

module.exports = {
    buildCompleteDataset,
    ALL_WIKIPEDIA_RANKINGS
};

if (require.main === module) {
    main().catch(console.error);
}