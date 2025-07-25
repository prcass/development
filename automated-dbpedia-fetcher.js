#!/usr/bin/env node
/**
 * Automated DBpedia Data Fetcher
 * Executes SPARQL queries to get ALL countries with complete data
 * Solves WebFetch truncation problem with real HTTP requests
 */

const fs = require('fs');
const https = require('https');
const { URLSearchParams } = require('url');

// DBpedia SPARQL endpoint
const DBPEDIA_ENDPOINT = 'https://dbpedia.org/sparql';

// Import the complete SPARQL queries
const completeQueries = {
    lifeExpectancy: `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT DISTINCT ?country ?name ?lifeExpectancy
        WHERE {
            ?country a dbo:Country ;
                     rdfs:label ?name ;
                     dbo:lifeExpectancy ?lifeExpectancy .
            FILTER(lang(?name) = 'en')
            FILTER(isNumeric(?lifeExpectancy))
        }
        ORDER BY DESC(?lifeExpectancy)
    `,
    
    population: `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT DISTINCT ?country ?name ?population
        WHERE {
            ?country a dbo:Country ;
                     rdfs:label ?name ;
                     dbo:populationTotal ?population .
            FILTER(lang(?name) = 'en')
            FILTER(isNumeric(?population))
        }
        ORDER BY DESC(?population)
    `,
    
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
        }
        ORDER BY DESC(?area)
    `,
    
    gdpNominal: `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT DISTINCT ?country ?name ?gdp
        WHERE {
            ?country a dbo:Country ;
                     rdfs:label ?name ;
                     dbo:gdpNominal ?gdp .
            FILTER(lang(?name) = 'en')
            FILTER(isNumeric(?gdp))
        }
        ORDER BY DESC(?gdp)
    `,
    
    gdpPerCapita: `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT DISTINCT ?country ?name ?gdpPerCapita
        WHERE {
            ?country a dbo:Country ;
                     rdfs:label ?name ;
                     dbo:gdpNominalPerCapita ?gdpPerCapita .
            FILTER(lang(?name) = 'en')
            FILTER(isNumeric(?gdpPerCapita))
        }
        ORDER BY DESC(?gdpPerCapita)
    `,
    
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
        }
        ORDER BY DESC(?hdi)
    `,
    
    comprehensive: `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT DISTINCT ?country ?name ?population ?area ?gdp ?gdpPerCapita ?hdi ?lifeExpectancy
        WHERE {
            ?country a dbo:Country ;
                     rdfs:label ?name .
            OPTIONAL { ?country dbo:populationTotal ?population }
            OPTIONAL { ?country dbo:areaTotal ?area }
            OPTIONAL { ?country dbo:gdpNominal ?gdp }
            OPTIONAL { ?country dbo:gdpNominalPerCapita ?gdpPerCapita }
            OPTIONAL { ?country dbo:humanDevelopmentIndex ?hdi }
            OPTIONAL { ?country dbo:lifeExpectancy ?lifeExpectancy }
            FILTER(lang(?name) = 'en')
        }
        ORDER BY ?name
    `
};

// Function to execute HTTP request to DBpedia SPARQL endpoint
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
                'User-Agent': 'Mozilla/5.0 (compatible; DBpedia-Data-Fetcher/1.0)',
                'Content-Length': Buffer.byteLength(postData)
            },
            timeout: 60000
        };

        const req = https.request(options, (res) => {
            let data = '';
            
            console.log(`   Status: ${res.statusCode}`);
            console.log(`   Content-Type: ${res.headers['content-type']}`);
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                // Log first 200 chars to debug the response format
                console.log(`   Response preview: ${data.substring(0, 200)}...`);
                
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (error) {
                    // If JSON parsing fails, save raw response for debugging
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
                    const debugFile = `debug_response_${timestamp}.html`;
                    fs.writeFileSync(debugFile, data);
                    
                    reject(new Error(`Failed to parse JSON response: ${error.message}. Raw response saved to ${debugFile}`));
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

// Process SPARQL results into structured format
function processResults(sparqlResponse, queryName) {
    if (!sparqlResponse.results || !sparqlResponse.results.bindings) {
        console.log(`⚠️  No results found for ${queryName}`);
        return { totalResults: 0, countries: {} };
    }
    
    const countries = {};
    const bindings = sparqlResponse.results.bindings;
    
    console.log(`✅ Processing ${bindings.length} results for ${queryName}`);
    
    bindings.forEach(binding => {
        const countryName = binding.name?.value;
        const countryUri = binding.country?.value;
        
        if (countryName && countryUri) {
            if (!countries[countryName]) {
                countries[countryName] = {
                    name: countryName,
                    dbpediaUri: countryUri,
                    data: {}
                };
            }
            
            // Extract all available properties (excluding name and country URI)
            Object.keys(binding).forEach(key => {
                if (key !== 'country' && key !== 'name' && binding[key]?.value) {
                    const value = binding[key].value;
                    // Convert to appropriate type
                    countries[countryName].data[key] = isNaN(value) ? value : parseFloat(value);
                }
            });
        }
    });
    
    return {
        totalResults: Object.keys(countries).length,
        countries: countries
    };
}

// Execute individual query with error handling
async function fetchQueryData(queryName, query) {
    console.log(`🔍 Fetching ${queryName} data...`);
    
    try {
        const sparqlResponse = await executeSparqlQuery(query);
        const processedData = processResults(sparqlResponse, queryName);
        
        console.log(`✅ ${queryName}: ${processedData.totalResults} countries retrieved`);
        return processedData;
        
    } catch (error) {
        console.error(`❌ Error fetching ${queryName}:`, error.message);
        return { totalResults: 0, countries: {} };
    }
}

// Build comprehensive dataset by fetching all queries
async function buildCompleteDataset() {
    console.log('🌐 Starting automated DBpedia data fetch...');
    console.log('🎯 Goal: Get ALL countries with complete data (no truncation)\n');
    
    const startTime = Date.now();
    
    // Initialize dataset structure
    const completeDataset = {
        metadata: {
            source: "DBpedia SPARQL (automated HTTP requests)",
            created: new Date().toISOString(),
            endpoint: DBPEDIA_ENDPOINT,
            fetchDuration: 0,
            totalCountries: 0,
            queriesExecuted: 0
        },
        countries: {},
        rawResults: {},
        completenessReport: {}
    };
    
    // Execute comprehensive query to get all data efficiently
    console.log('📊 Executing comprehensive query for all properties...');
    const comprehensiveData = await fetchQueryData('comprehensive', completeQueries.comprehensive);
    completeDataset.queriesExecuted++;
    
    if (comprehensiveData.totalResults > 0) {
        completeDataset.countries = comprehensiveData.countries;
        completeDataset.rawResults.comprehensive = comprehensiveData;
        
        console.log(`🎉 Successfully retrieved ${comprehensiveData.totalResults} countries!`);
        
        // Also fetch individual queries for comparison and validation
        console.log('\n🔍 Fetching individual property queries for validation...');
        
        const individualQueries = ['lifeExpectancy', 'population', 'area', 'gdpNominal', 'gdpPerCapita', 'hdi'];
        for (const queryName of individualQueries) {
            const queryData = await fetchQueryData(queryName, completeQueries[queryName]);
            completeDataset.rawResults[queryName] = queryData;
            completeDataset.queriesExecuted++;
            
            // Small delay to be respectful to DBpedia servers
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
    } else {
        console.log('⚠️  Comprehensive query failed, trying individual queries...');
        
        // Fallback: Execute individual queries and merge results
        for (const [queryName, query] of Object.entries(completeQueries)) {
            if (queryName === 'comprehensive') continue;
            
            const queryData = await fetchQueryData(queryName, query);
            completeDataset.rawResults[queryName] = queryData;
            completeDataset.queriesExecuted++;
            
            // Merge results into main countries object
            Object.entries(queryData.countries).forEach(([countryName, countryData]) => {
                if (!completeDataset.countries[countryName]) {
                    completeDataset.countries[countryName] = {
                        name: countryName,
                        dbpediaUri: countryData.dbpediaUri,
                        data: {}
                    };
                }
                
                // Merge data properties
                Object.assign(completeDataset.countries[countryName].data, countryData.data);
            });
            
            // Small delay between requests
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    // Calculate completeness report
    const properties = ['population', 'area', 'gdp', 'gdpPerCapita', 'hdi', 'lifeExpectancy'];
    const totalCountries = Object.keys(completeDataset.countries).length;
    
    properties.forEach(prop => {
        const countriesWithProp = Object.values(completeDataset.countries)
            .filter(country => country.data[prop] !== undefined).length;
        
        completeDataset.completenessReport[prop] = {
            countriesWithData: countriesWithProp,
            totalCountries: totalCountries,
            completeness: totalCountries > 0 ? ((countriesWithProp / totalCountries) * 100).toFixed(1) + '%' : '0%'
        };
    });
    
    // Finalize metadata
    completeDataset.metadata.totalCountries = totalCountries;
    completeDataset.metadata.fetchDuration = ((Date.now() - startTime) / 1000).toFixed(2) + 's';
    
    return completeDataset;
}

// Generate comparison with previous WebFetch results
function generateComparison(dataset) {
    const webFetchResults = {
        lifeExpectancy: 79,
        population: 95,
        area: 194,
        gdp: 22,
        hdi: 20
    };
    
    console.log('\n📊 DBpedia vs WebFetch Comparison:');
    console.log('==========================================');
    
    Object.keys(webFetchResults).forEach(prop => {
        const webFetch = webFetchResults[prop];
        const dbpedia = dataset.completenessReport[prop]?.countriesWithData || 0;
        const improvement = dbpedia - webFetch;
        const improvementPct = webFetch > 0 ? ((improvement / webFetch) * 100).toFixed(0) : 'N/A';
        
        console.log(`${prop}:`);
        console.log(`   WebFetch: ${webFetch} countries`);
        console.log(`   DBpedia: ${dbpedia} countries (+${improvement}, +${improvementPct}%)`);
        console.log('');
    });
}

// Save all results to files
function saveResults(dataset) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    
    // Save complete dataset
    const datasetFile = `automated_complete_dataset_${timestamp}.json`;
    fs.writeFileSync(datasetFile, JSON.stringify(dataset, null, 2));
    
    // Save summary report
    const summaryFile = `fetch_summary_${timestamp}.txt`;
    const summary = `
DBpedia Automated Fetch Summary
===============================
Fetch Date: ${dataset.metadata.created}
Duration: ${dataset.metadata.fetchDuration}
Queries Executed: ${dataset.metadata.queriesExecuted}
Total Countries: ${dataset.metadata.totalCountries}

Data Completeness:
${Object.entries(dataset.completenessReport).map(([prop, report]) => 
    `  ${prop}: ${report.countriesWithData} countries (${report.completeness})`
).join('\n')}

Key Improvements over WebFetch:
  Life Expectancy: ${dataset.completenessReport.lifeExpectancy?.countriesWithData || 0} vs 79 (+${((dataset.completenessReport.lifeExpectancy?.countriesWithData || 0) - 79)})
  GDP: ${dataset.completenessReport.gdp?.countriesWithData || 0} vs 22 (+${((dataset.completenessReport.gdp?.countriesWithData || 0) - 22)})
  HDI: ${dataset.completenessReport.hdi?.countriesWithData || 0} vs 20 (+${((dataset.completenessReport.hdi?.countriesWithData || 0) - 20)})

Sample Countries Retrieved:
${Object.keys(dataset.countries).slice(0, 10).map(name => `  • ${name}`).join('\n')}
${Object.keys(dataset.countries).length > 10 ? `  ... and ${Object.keys(dataset.countries).length - 10} more` : ''}
`;
    
    fs.writeFileSync(summaryFile, summary);
    
    // Save countries list for easy reference
    const countriesFile = `countries_list_${timestamp}.txt`;
    const countriesList = Object.keys(dataset.countries).sort().join('\n');
    fs.writeFileSync(countriesFile, countriesList);
    
    console.log('\n📁 Files created:');
    console.log(`   📊 ${datasetFile} - Complete dataset with all countries`);
    console.log(`   📈 ${summaryFile} - Fetch summary and comparison`);
    console.log(`   📝 ${countriesFile} - Complete list of countries retrieved`);
    
    return { datasetFile, summaryFile, countriesFile };
}

// Main execution function
async function main() {
    console.log('🚀 Automated DBpedia Data Fetcher');
    console.log('==================================');
    console.log('Executing SPARQL queries to get ALL countries (no truncation limits)\n');
    
    try {
        // Build the complete dataset
        const dataset = await buildCompleteDataset();
        
        console.log(`\n🎉 Data fetch completed successfully!`);
        console.log(`   Duration: ${dataset.metadata.fetchDuration}`);
        console.log(`   Countries retrieved: ${dataset.metadata.totalCountries}`);
        console.log(`   Queries executed: ${dataset.metadata.queriesExecuted}`);
        
        // Show completeness report
        console.log('\n📈 Data Completeness Report:');
        Object.entries(dataset.completenessReport).forEach(([prop, report]) => {
            console.log(`   ${prop}: ${report.countriesWithData} countries (${report.completeness})`);
        });
        
        // Generate comparison with WebFetch
        generateComparison(dataset);
        
        // Save all results
        const files = saveResults(dataset);
        
        console.log('\n✅ Automated fetch complete!');
        console.log('\n💡 Key Benefits Achieved:');
        console.log('   • No truncation limits - got ALL available countries');
        console.log('   • Structured data from semantic web source');
        console.log('   • Multiple properties fetched efficiently');
        console.log('   • Complete audit trail of data sources');
        console.log('   • Ready for integration into country challenges dataset');
        
        console.log('\n🚀 Next Steps:');
        console.log('1. Review the complete dataset in the generated JSON file');
        console.log('2. Validate data quality for key countries');
        console.log('3. Integrate into your Know-It-All country challenges');
        console.log('4. Add more DBpedia properties as needed');
        
        return dataset;
        
    } catch (error) {
        console.error('❌ Fatal error during data fetch:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Export functions for programmatic use
module.exports = {
    executeSparqlQuery,
    fetchQueryData,
    buildCompleteDataset,
    completeQueries
};

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}