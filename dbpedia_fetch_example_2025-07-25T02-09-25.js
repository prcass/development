
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
