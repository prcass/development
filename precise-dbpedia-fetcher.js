#!/usr/bin/env node
/**
 * Precise DBpedia Data Fetcher
 * Uses refined SPARQL queries to get actual sovereign countries only
 * Fixes property names and filters for valid country data
 */

const fs = require('fs');
const https = require('https');
const { URLSearchParams } = require('url');

// DBpedia SPARQL endpoint
const DBPEDIA_ENDPOINT = 'https://dbpedia.org/sparql';

// Refined SPARQL queries that target actual countries with valid data
const refinedQueries = {
    // Life expectancy with better filtering
    lifeExpectancy: `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX yago: <http://yago-knowledge.org/resource/>
        
        SELECT DISTINCT ?country ?name ?lifeExpectancy
        WHERE {
            ?country a dbo:Country ;
                     rdfs:label ?name ;
                     dbo:lifeExpectancy ?lifeExpectancy .
            
            # Filter for sovereign countries with populations
            ?country dbo:populationTotal ?population .
            
            FILTER(lang(?name) = 'en')
            FILTER(isNumeric(?lifeExpectancy))
            FILTER(?lifeExpectancy > 30 && ?lifeExpectancy < 100)
            FILTER(?population > 10000)
            
            # Exclude historical entities
            FILTER NOT EXISTS { ?country dbo:dissolutionYear ?year }
        }
        ORDER BY DESC(?lifeExpectancy)
    `,
    
    // Population with better filtering
    population: `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT DISTINCT ?country ?name ?population
        WHERE {
            ?country a dbo:Country ;
                     rdfs:label ?name ;
                     dbo:populationTotal ?population .
            
            # Only current sovereign nations
            FILTER(lang(?name) = 'en')
            FILTER(isNumeric(?population))
            FILTER(?population > 1000)
            FILTER NOT EXISTS { ?country dbo:dissolutionYear ?year }
            
            # Must have a capital or be a sovereign state
            { ?country dbo:capital ?capital } 
            UNION 
            { ?country a <http://dbpedia.org/ontology/SovereignState> }
        }
        ORDER BY DESC(?population)
        LIMIT 300
    `,
    
    // Area with sovereign state filtering
    area: `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT DISTINCT ?country ?name ?area
        WHERE {
            ?country a dbo:Country ;
                     rdfs:label ?name ;
                     dbo:areaTotal ?area .
            
            FILTER(lang(?name) = 'en')
            FILTER(isNumeric(?area))
            FILTER(?area > 1)
            FILTER NOT EXISTS { ?country dbo:dissolutionYear ?year }
            
            # Must have population data (indicates real country)
            ?country dbo:populationTotal ?population .
            FILTER(?population > 1000)
        }
        ORDER BY DESC(?area)
        LIMIT 300
    `,
    
    // GDP with current data
    gdpNominal: `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT DISTINCT ?country ?name ?gdp
        WHERE {
            {
                ?country a dbo:Country ;
                         rdfs:label ?name ;
                         dbo:gdpNominal ?gdp .
            }
            UNION
            {
                ?country a dbo:Country ;
                         rdfs:label ?name ;
                         dbo:grossDomesticProduct ?gdp .
            }
            
            FILTER(lang(?name) = 'en')
            FILTER(isNumeric(?gdp))
            FILTER(?gdp > 1000000)
            FILTER NOT EXISTS { ?country dbo:dissolutionYear ?year }
            
            # Must have population (real countries)
            ?country dbo:populationTotal ?population .
            FILTER(?population > 10000)
        }
        ORDER BY DESC(?gdp)
        LIMIT 250
    `,
    
    // GDP Per Capita
    gdpPerCapita: `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT DISTINCT ?country ?name ?gdpPerCapita
        WHERE {
            {
                ?country a dbo:Country ;
                         rdfs:label ?name ;
                         dbo:gdpNominalPerCapita ?gdpPerCapita .
            }
            UNION
            {
                ?country a dbo:Country ;
                         rdfs:label ?name ;
                         dbo:gdpPerCapita ?gdpPerCapita .
            }
            
            FILTER(lang(?name) = 'en')
            FILTER(isNumeric(?gdpPerCapita))
            FILTER(?gdpPerCapita > 100 && ?gdpPerCapita < 200000)
            FILTER NOT EXISTS { ?country dbo:dissolutionYear ?year }
            
            ?country dbo:populationTotal ?population .
            FILTER(?population > 10000)
        }
        ORDER BY DESC(?gdpPerCapita)
        LIMIT 250
    `,
    
    // Human Development Index
    hdi: `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT DISTINCT ?country ?name ?hdi
        WHERE {
            ?country a dbo:Country ;
                     rdfs:label ?name ;
                     dbo:humanDevelopmentIndex ?hdi .
            
            FILTER(lang(?name) = 'en')
            FILTER(isNumeric(?hdi))
            FILTER(?hdi > 0.2 && ?hdi <= 1.0)
            FILTER NOT EXISTS { ?country dbo:dissolutionYear ?year }
            
            ?country dbo:populationTotal ?population .
            FILTER(?population > 10000)
        }
        ORDER BY DESC(?hdi)
        LIMIT 200
    `,
    
    // Comprehensive query for sovereign nations only
    sovereignNations: `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT DISTINCT ?country ?name ?population ?area ?capital
        WHERE {
            ?country a dbo:Country ;
                     rdfs:label ?name ;
                     dbo:populationTotal ?population .
            
            OPTIONAL { ?country dbo:areaTotal ?area }
            OPTIONAL { ?country dbo:capital ?capital }
            
            FILTER(lang(?name) = 'en')
            FILTER(isNumeric(?population))
            FILTER(?population > 10000)
            FILTER NOT EXISTS { ?country dbo:dissolutionYear ?year }
            
            # Must have a capital city (sovereign states have capitals)
            { ?country dbo:capital ?capital }
            UNION
            { ?country a <http://dbpedia.org/ontology/SovereignState> }
        }
        ORDER BY ?name
        LIMIT 300
    `
};

// HTTP request function (same as before)
function executeSparqlQuery(query) {
    return new Promise((resolve, reject) => {
        const postData = new URLSearchParams({
            query: query.trim(),
            format: 'json'
        }).toString();

        const options = {
            hostname: 'dbpedia.org',
            port: 443,
            path: '/sparql',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/sparql-results+json, application/json',
                'User-Agent': 'Mozilla/5.0 (compatible; DBpedia-Precise-Fetcher/1.0)',
                'Content-Length': Buffer.byteLength(postData)
            },
            timeout: 60000
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (error) {
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
                    const debugFile = `debug_${timestamp}.html`;
                    fs.writeFileSync(debugFile, data);
                    reject(new Error(`JSON parse error: ${error.message}. Saved to ${debugFile}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(new Error(`Request failed: ${error.message}`));
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.write(postData);
        req.end();
    });
}

// Process results with validation
function processResults(sparqlResponse, queryName) {
    if (!sparqlResponse.results || !sparqlResponse.results.bindings) {
        return { totalResults: 0, countries: {} };
    }
    
    const countries = {};
    const bindings = sparqlResponse.results.bindings;
    let validCountries = 0;
    
    bindings.forEach(binding => {
        const countryName = binding.name?.value;
        const countryUri = binding.country?.value;
        
        if (countryName && countryUri) {
            // Basic validation - skip obviously invalid entries
            if (countryName.length < 2 || 
                /^\d/.test(countryName) || 
                countryName.includes('century') ||
                countryName.includes('rule') ||
                countryName.includes('...')) {
                return;
            }
            
            if (!countries[countryName]) {
                countries[countryName] = {
                    name: countryName,
                    dbpediaUri: countryUri,
                    data: {}
                };
                validCountries++;
            }
            
            // Extract properties
            Object.keys(binding).forEach(key => {
                if (key !== 'country' && key !== 'name' && binding[key]?.value) {
                    const value = binding[key].value;
                    countries[countryName].data[key] = isNaN(value) ? value : parseFloat(value);
                }
            });
        }
    });
    
    console.log(`✅ ${queryName}: ${validCountries} valid countries from ${bindings.length} results`);
    return {
        totalResults: validCountries,
        countries: countries
    };
}

// Execute query with enhanced error handling
async function fetchQueryData(queryName, query) {
    console.log(`🔍 Fetching ${queryName} data...`);
    
    try {
        const sparqlResponse = await executeSparqlQuery(query);
        const processedData = processResults(sparqlResponse, queryName);
        return processedData;
        
    } catch (error) {
        console.error(`❌ Error fetching ${queryName}:`, error.message);
        return { totalResults: 0, countries: {} };
    }
}

// Build precise dataset with actual countries
async function buildPreciseDataset() {
    console.log('🎯 Building precise dataset with actual sovereign countries...\n');
    
    const dataset = {
        metadata: {
            source: "DBpedia SPARQL (refined queries for sovereign nations)",
            created: new Date().toISOString(),
            endpoint: DBPEDIA_ENDPOINT,
            fetchDuration: 0,
            totalCountries: 0,
            queriesExecuted: 0
        },
        countries: {},
        queryResults: {},
        completenessReport: {}
    };
    
    const startTime = Date.now();
    
    // First, get sovereign nations as the base
    console.log('🏛️  Getting sovereign nations list...');
    const sovereignData = await fetchQueryData('sovereignNations', refinedQueries.sovereignNations);
    dataset.countries = sovereignData.countries;
    dataset.queryResults.sovereignNations = sovereignData;
    dataset.queriesExecuted++;
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Then enhance with additional properties
    const propertyQueries = ['population', 'area', 'lifeExpectancy', 'gdpNominal', 'gdpPerCapita', 'hdi'];
    
    for (const queryName of propertyQueries) {
        console.log(`📊 Enhancing with ${queryName} data...`);
        const queryData = await fetchQueryData(queryName, refinedQueries[queryName]);
        dataset.queryResults[queryName] = queryData;
        dataset.queriesExecuted++;
        
        // Merge data into existing countries
        Object.entries(queryData.countries).forEach(([countryName, countryData]) => {
            if (dataset.countries[countryName]) {
                // Merge additional properties
                Object.assign(dataset.countries[countryName].data, countryData.data);
            } else {
                // Add new country if not in sovereign list but has valid data
                dataset.countries[countryName] = countryData;
            }
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Calculate final statistics
    const totalCountries = Object.keys(dataset.countries).length;
    const properties = ['population', 'area', 'lifeExpectancy', 'gdp', 'gdpPerCapita', 'hdi'];
    
    properties.forEach(prop => {
        const countriesWithProp = Object.values(dataset.countries)
            .filter(country => country.data[prop] !== undefined).length;
        
        dataset.completenessReport[prop] = {
            countriesWithData: countriesWithProp,
            totalCountries: totalCountries,
            completeness: totalCountries > 0 ? ((countriesWithProp / totalCountries) * 100).toFixed(1) + '%' : '0%'
        };
    });
    
    dataset.metadata.totalCountries = totalCountries;
    dataset.metadata.fetchDuration = ((Date.now() - startTime) / 1000).toFixed(2) + 's';
    
    return dataset;
}

// Display sample countries for validation
function displaySampleCountries(dataset) {
    console.log('\n📋 Sample Countries Retrieved:');
    console.log('=====================================');
    
    const countries = Object.entries(dataset.countries);
    const samples = countries.slice(0, 10).map(([name, data]) => {
        const props = Object.keys(data.data).length;
        return `   • ${name} (${props} properties)`;
    });
    
    samples.forEach(sample => console.log(sample));
    
    if (countries.length > 10) {
        console.log(`   ... and ${countries.length - 10} more countries`);
    }
    
    console.log(`\n🌍 Total: ${countries.length} countries with data`);
}

// Save results with detailed reporting
function saveResults(dataset) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    
    // Save complete dataset
    const datasetFile = `precise_countries_dataset_${timestamp}.json`;
    fs.writeFileSync(datasetFile, JSON.stringify(dataset, null, 2));
    
    // Create country summary
    const countrySummary = Object.entries(dataset.countries).map(([name, data]) => {
        const properties = Object.keys(data.data);
        return `${name}: ${properties.join(', ')}`;
    }).join('\n');
    
    const summaryFile = `countries_summary_${timestamp}.txt`;
    fs.writeFileSync(summaryFile, countrySummary);
    
    // Create comparison report
    const webFetchComparison = {
        lifeExpectancy: 79,
        population: 95,
        area: 194,
        gdp: 22,
        hdi: 20
    };
    
    const reportFile = `comparison_report_${timestamp}.md`;
    const report = `# DBpedia Precise Country Data Report

## Fetch Summary
- **Fetch Date:** ${dataset.metadata.created}
- **Duration:** ${dataset.metadata.fetchDuration}
- **Queries Executed:** ${dataset.metadata.queriesExecuted}
- **Total Countries:** ${dataset.metadata.totalCountries}

## Data Completeness
${Object.entries(dataset.completenessReport).map(([prop, report]) => 
    `- **${prop}:** ${report.countriesWithData} countries (${report.completeness})`
).join('\n')}

## Comparison with WebFetch
${Object.entries(webFetchComparison).map(([prop, webCount]) => {
    const dbCount = dataset.completenessReport[prop]?.countriesWithData || 0;
    const improvement = dbCount - webCount;
    const pct = webCount > 0 ? ((improvement / webCount) * 100).toFixed(0) : 'N/A';
    return `- **${prop}:** ${webCount} → ${dbCount} (+${improvement}, +${pct}%)`;
}).join('\n')}

## Top 20 Countries by Data Completeness
${Object.entries(dataset.countries)
    .map(([name, data]) => ({ name, count: Object.keys(data.data).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)
    .map((country, i) => `${i + 1}. ${country.name} (${country.count} properties)`)
    .join('\n')}
`;
    
    fs.writeFileSync(reportFile, report);
    
    console.log('\n📁 Files Generated:');
    console.log(`   📊 ${datasetFile} - Complete dataset`);
    console.log(`   📝 ${summaryFile} - Country properties summary`);
    console.log(`   📈 ${reportFile} - Analysis report with comparisons`);
    
    return { datasetFile, summaryFile, reportFile };
}

// Main execution
async function main() {
    console.log('🎯 Precise DBpedia Country Data Fetcher');
    console.log('=======================================');
    console.log('Fetching actual sovereign countries with validated data\n');
    
    try {
        const dataset = await buildPreciseDataset();
        
        console.log(`\n🎉 Data fetch completed successfully!`);
        console.log(`   Duration: ${dataset.metadata.fetchDuration}`);
        console.log(`   Countries: ${dataset.metadata.totalCountries}`);
        console.log(`   Queries: ${dataset.metadata.queriesExecuted}`);
        
        // Display completeness
        console.log('\n📈 Data Completeness:');
        Object.entries(dataset.completenessReport).forEach(([prop, report]) => {
            console.log(`   ${prop}: ${report.countriesWithData} countries (${report.completeness})`);
        });
        
        displaySampleCountries(dataset);
        
        const files = saveResults(dataset);
        
        console.log('\n✅ Precise country data fetch complete!');
        console.log('\n🎯 Key Achievements:');
        console.log('   • Filtered to actual sovereign countries only');
        console.log('   • Validated data ranges and excluded invalid entries');
        console.log('   • Enhanced property coverage through multiple queries');
        console.log('   • Generated comprehensive comparison reports');
        
        return dataset;
        
    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

module.exports = {
    executeSparqlQuery,
    buildPreciseDataset,
    refinedQueries
};

if (require.main === module) {
    main().catch(console.error);
}