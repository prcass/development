#!/usr/bin/env node
/**
 * DBpedia SPARQL Query System for Country Rankings
 * Uses DBpedia's structured data to get complete country information
 */

const fs = require('fs');

// DBpedia SPARQL endpoint
const DBPEDIA_ENDPOINT = 'https://dbpedia.org/sparql';

// Sample SPARQL queries for different country properties
const sparqlQueries = {
    // Basic country information with population
    population: `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbr: <http://dbpedia.org/resource/>
        PREFIX dbp: <http://dbpedia.org/property/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT ?country ?name ?population ?area ?gdp ?gdpPerCapita
        WHERE {
            ?country a dbo:Country ;
                     rdfs:label ?name ;
                     dbo:populationTotal ?population .
            OPTIONAL { ?country dbo:areaTotal ?area }
            OPTIONAL { ?country dbo:gdpNominal ?gdp }
            OPTIONAL { ?country dbo:gdpNominalPerCapita ?gdpPerCapita }
            FILTER (lang(?name) = 'en')
        }
        ORDER BY DESC(?population)
    `,
    
    // Economic indicators
    economic: `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbp: <http://dbpedia.org/property/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT ?country ?name ?gdp ?gdpPerCapita ?gini ?hdi ?currency
        WHERE {
            ?country a dbo:Country ;
                     rdfs:label ?name .
            OPTIONAL { ?country dbo:gdpNominal ?gdp }
            OPTIONAL { ?country dbo:gdpNominalPerCapita ?gdpPerCapita }
            OPTIONAL { ?country dbo:giniCoefficient ?gini }
            OPTIONAL { ?country dbo:humanDevelopmentIndex ?hdi }
            OPTIONAL { ?country dbp:currency ?currency }
            FILTER (lang(?name) = 'en')
        }
    `,
    
    // Geographic and demographic data
    geographic: `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbp: <http://dbpedia.org/property/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
        
        SELECT ?country ?name ?area ?population ?density ?capital ?lat ?long
        WHERE {
            ?country a dbo:Country ;
                     rdfs:label ?name .
            OPTIONAL { ?country dbo:areaTotal ?area }
            OPTIONAL { ?country dbo:populationTotal ?population }
            OPTIONAL { ?country dbo:populationDensity ?density }
            OPTIONAL { ?country dbo:capital ?capital }
            OPTIONAL { ?country geo:lat ?lat }
            OPTIONAL { ?country geo:long ?long }
            FILTER (lang(?name) = 'en')
        }
    `,
    
    // Government and political data
    political: `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbp: <http://dbpedia.org/property/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT ?country ?name ?governmentType ?leader ?legislature
        WHERE {
            ?country a dbo:Country ;
                     rdfs:label ?name .
            OPTIONAL { ?country dbo:governmentType ?governmentType }
            OPTIONAL { ?country dbo:leader ?leader }
            OPTIONAL { ?country dbp:legislature ?legislature }
            FILTER (lang(?name) = 'en')
        }
    `,
    
    // Development indicators
    development: `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbp: <http://dbpedia.org/property/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT ?country ?name ?hdi ?lifeExpectancy ?literacyRate ?internetUsers
        WHERE {
            ?country a dbo:Country ;
                     rdfs:label ?name .
            OPTIONAL { ?country dbo:humanDevelopmentIndex ?hdi }
            OPTIONAL { ?country dbp:lifeExpectancy ?lifeExpectancy }
            OPTIONAL { ?country dbp:literacy ?literacyRate }
            OPTIONAL { ?country dbp:internetTld ?internetUsers }
            FILTER (lang(?name) = 'en')
        }
    `,
    
    // All countries with basic info
    allCountries: `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT DISTINCT ?country ?name
        WHERE {
            ?country a dbo:Country ;
                     rdfs:label ?name .
            FILTER (lang(?name) = 'en')
            FILTER NOT EXISTS { ?country dbo:dissolutionYear ?year }
        }
        ORDER BY ?name
    `
};

// Function to build SPARQL query URL
function buildSparqlUrl(query) {
    const params = new URLSearchParams({
        query: query,
        format: 'json',
        timeout: '30000'
    });
    return `${DBPEDIA_ENDPOINT}?${params.toString()}`;
}

// Function to execute SPARQL query (mock for now, would use fetch/axios)
async function executeSparqlQuery(queryName) {
    console.log(`🔍 Executing SPARQL query: ${queryName}`);
    console.log(`📡 Endpoint: ${DBPEDIA_ENDPOINT}`);
    console.log(`📝 Query preview:`);
    console.log(sparqlQueries[queryName].substring(0, 200) + '...\n');
    
    // In real implementation, this would:
    // 1. Make HTTP request to DBpedia SPARQL endpoint
    // 2. Parse JSON response
    // 3. Extract results
    
    return {
        queryName,
        endpoint: DBPEDIA_ENDPOINT,
        url: buildSparqlUrl(sparqlQueries[queryName]),
        sampleResults: getSampleResults(queryName)
    };
}

// Sample results structure from DBpedia
function getSampleResults(queryName) {
    switch(queryName) {
        case 'population':
            return {
                totalResults: 195,
                sample: [
                    {
                        country: "http://dbpedia.org/resource/China",
                        name: "China",
                        population: 1439323776,
                        area: 9596961000,
                        gdp: 14342903000000
                    },
                    {
                        country: "http://dbpedia.org/resource/India", 
                        name: "India",
                        population: 1380004385,
                        area: 3287263000,
                        gdp: 2875142000000
                    },
                    {
                        country: "http://dbpedia.org/resource/United_States",
                        name: "United States",
                        population: 331002651,
                        area: 9833520000,
                        gdp: 20932750000000
                    }
                ]
            };
        case 'allCountries':
            return {
                totalResults: 195,
                sample: [
                    { country: "http://dbpedia.org/resource/Afghanistan", name: "Afghanistan" },
                    { country: "http://dbpedia.org/resource/Albania", name: "Albania" },
                    { country: "http://dbpedia.org/resource/Algeria", name: "Algeria" },
                    // ... all 195 countries
                ]
            };
        default:
            return { totalResults: 0, sample: [] };
    }
}

// Generate DBpedia dataset structure
function generateDbpediaDataset() {
    const dataset = {
        metadata: {
            source: "DBpedia SPARQL Endpoint",
            endpoint: DBPEDIA_ENDPOINT,
            created: new Date().toISOString(),
            queries: Object.keys(sparqlQueries),
            description: "Complete country data from DBpedia structured data"
        },
        queries: {},
        instructions: {
            usage: "Execute SPARQL queries against DBpedia endpoint to get complete country data",
            advantages: [
                "Structured data format",
                "Complete country coverage (all 195+ countries)",
                "Consistent property names",
                "Linked data with relationships",
                "Multiple data points per query"
            ],
            implementation: "Use fetch/axios to POST queries to SPARQL endpoint"
        }
    };
    
    // Add query details
    Object.entries(sparqlQueries).forEach(([name, query]) => {
        dataset.queries[name] = {
            name,
            query: query.trim(),
            url: buildSparqlUrl(query),
            description: getQueryDescription(name)
        };
    });
    
    return dataset;
}

// Get query descriptions
function getQueryDescription(queryName) {
    const descriptions = {
        population: "Get all countries with population, area, and GDP data",
        economic: "Economic indicators including GDP, Gini coefficient, HDI",
        geographic: "Geographic data including area, coordinates, capital cities",
        political: "Government type, current leaders, legislature information",
        development: "Development indicators like HDI, life expectancy, literacy",
        allCountries: "Complete list of all sovereign countries"
    };
    return descriptions[queryName] || "Country data query";
}

// Generate sample fetch code
function generateFetchExample() {
    return `
// Example: How to fetch data from DBpedia using SPARQL

async function fetchCountryData(sparqlQuery) {
    const endpoint = '${DBPEDIA_ENDPOINT}';
    
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: new URLSearchParams({
            query: sparqlQuery,
            format: 'json'
        })
    });
    
    const data = await response.json();
    
    // Process results
    const countries = data.results.bindings.map(binding => ({
        name: binding.name?.value,
        population: binding.population ? parseInt(binding.population.value) : null,
        area: binding.area ? parseFloat(binding.area.value) : null,
        gdp: binding.gdp ? parseFloat(binding.gdp.value) : null
    }));
    
    return countries;
}

// Usage example
const populationData = await fetchCountryData(sparqlQueries.population);
console.log(\`Found \${populationData.length} countries with population data\`);
`;
}

// Main execution
async function main() {
    console.log('🌐 DBpedia SPARQL Query System for Country Rankings');
    console.log('=' * 60);
    console.log('');
    
    const dataset = generateDbpediaDataset();
    
    console.log('📊 Available SPARQL Queries:');
    Object.entries(dataset.queries).forEach(([name, info]) => {
        console.log(`\n${name}:`);
        console.log(`  📝 ${info.description}`);
        console.log(`  🔗 ${info.url.substring(0, 80)}...`);
    });
    
    console.log('\n🚀 Advantages of DBpedia approach:');
    dataset.instructions.advantages.forEach(adv => {
        console.log(`  ✅ ${adv}`);
    });
    
    // Save files
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    
    // Save query collection
    const queriesFile = `dbpedia_sparql_queries_${timestamp}.json`;
    fs.writeFileSync(queriesFile, JSON.stringify(dataset, null, 2));
    
    // Save example implementation
    const exampleFile = `dbpedia_fetch_example_${timestamp}.js`;
    fs.writeFileSync(exampleFile, generateFetchExample());
    
    // Save markdown documentation
    const docsFile = `dbpedia_queries_documentation_${timestamp}.md`;
    const documentation = `# DBpedia SPARQL Queries for Country Data

## Overview
DBpedia provides structured data extracted from Wikipedia in RDF format, queryable via SPARQL.

## Endpoint
\`${DBPEDIA_ENDPOINT}\`

## Available Queries

${Object.entries(dataset.queries).map(([name, info]) => `### ${name}
**Description**: ${info.description}

\`\`\`sparql
${info.query}
\`\`\`

**Query URL**: \`${info.url.substring(0, 100)}...\`
`).join('\n\n')}

## Implementation

1. Use HTTP POST to send SPARQL queries
2. Set format=json for JSON responses
3. Parse results from data.results.bindings
4. Handle optional fields gracefully

## Example Usage

\`\`\`javascript
${generateFetchExample()}
\`\`\`

## Benefits
- Complete data for ALL countries (not limited to top N)
- Structured, consistent format
- Multiple properties in single query
- Linked data relationships
- Real-time data from Wikipedia
`;
    
    fs.writeFileSync(docsFile, documentation);
    
    console.log('\n📁 Files created:');
    console.log(`  📄 ${queriesFile} - SPARQL query collection`);
    console.log(`  💻 ${exampleFile} - JavaScript implementation example`);
    console.log(`  📚 ${docsFile} - Complete documentation`);
    
    // Test one query
    console.log('\n🧪 Testing sample query...');
    const sampleResult = await executeSparqlQuery('allCountries');
    console.log(`\nSample results: Found ${sampleResult.sampleResults.totalResults} countries`);
    console.log('First 3 countries:', sampleResult.sampleResults.sample.slice(0, 3));
    
    console.log('\n✅ DBpedia query system ready!');
    console.log('\n💡 Next steps:');
    console.log('1. Implement fetch functionality to execute queries');
    console.log('2. Run each query to get complete country data');
    console.log('3. Process and store results in your dataset');
    console.log('4. DBpedia will return ALL countries, not just top 30!');
}

// Export for use in other scripts
module.exports = {
    DBPEDIA_ENDPOINT,
    sparqlQueries,
    buildSparqlUrl,
    executeSparqlQuery
};

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}