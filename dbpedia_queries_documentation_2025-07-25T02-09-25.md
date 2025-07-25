# DBpedia SPARQL Queries for Country Data

## Overview
DBpedia provides structured data extracted from Wikipedia in RDF format, queryable via SPARQL.

## Endpoint
`https://dbpedia.org/sparql`

## Available Queries

### population
**Description**: Get all countries with population, area, and GDP data

```sparql
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
```

**Query URL**: `https://dbpedia.org/sparql?query=%0A++++++++PREFIX+dbo%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%...`


### economic
**Description**: Economic indicators including GDP, Gini coefficient, HDI

```sparql
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
```

**Query URL**: `https://dbpedia.org/sparql?query=%0A++++++++PREFIX+dbo%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%...`


### geographic
**Description**: Geographic data including area, coordinates, capital cities

```sparql
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
```

**Query URL**: `https://dbpedia.org/sparql?query=%0A++++++++PREFIX+dbo%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%...`


### political
**Description**: Government type, current leaders, legislature information

```sparql
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
```

**Query URL**: `https://dbpedia.org/sparql?query=%0A++++++++PREFIX+dbo%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%...`


### development
**Description**: Development indicators like HDI, life expectancy, literacy

```sparql
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
```

**Query URL**: `https://dbpedia.org/sparql?query=%0A++++++++PREFIX+dbo%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%...`


### allCountries
**Description**: Complete list of all sovereign countries

```sparql
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
```

**Query URL**: `https://dbpedia.org/sparql?query=%0A++++++++PREFIX+dbo%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%...`


## Implementation

1. Use HTTP POST to send SPARQL queries
2. Set format=json for JSON responses
3. Parse results from data.results.bindings
4. Handle optional fields gracefully

## Example Usage

```javascript

// Example: How to fetch data from DBpedia using SPARQL

async function fetchCountryData(sparqlQuery) {
    const endpoint = 'https://dbpedia.org/sparql';
    
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
console.log(`Found ${populationData.length} countries with population data`);

```

## Benefits
- Complete data for ALL countries (not limited to top N)
- Structured, consistent format
- Multiple properties in single query
- Linked data relationships
- Real-time data from Wikipedia
