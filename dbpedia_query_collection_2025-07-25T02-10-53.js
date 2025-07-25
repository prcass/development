// DBpedia Query Collection for Country Rankings
// Generated: 2025-07-25T02:10:53.842Z

const DBPEDIA_ENDPOINT = 'https://dbpedia.org/sparql';

// Discovered properties with complete country data
const countryProperties = [
  {
    "id": "populationtotal",
    "name": "Populationtotal",
    "property": "http://dbpedia.org/ontology/populationTotal",
    "category": "demographic"
  },
  {
    "id": "areatotal",
    "name": "Areatotal",
    "property": "http://dbpedia.org/ontology/areaTotal",
    "category": "geographic"
  },
  {
    "id": "gdpnominalpercapita",
    "name": "Gdpnominalpercapita",
    "property": "http://dbpedia.org/ontology/gdpNominalPerCapita",
    "category": "economic"
  },
  {
    "id": "humandevelopmentindex",
    "name": "Humandevelopmentindex",
    "property": "http://dbpedia.org/ontology/humanDevelopmentIndex",
    "category": "other"
  },
  {
    "id": "gdpppppercapita",
    "name": "Gdpppppercapita",
    "property": "http://dbpedia.org/property/gdpPppPerCapita",
    "category": "economic"
  },
  {
    "id": "literacyrate",
    "name": "Literacyrate",
    "property": "http://dbpedia.org/property/literacyRate",
    "category": "social"
  },
  {
    "id": "pressfreedomindex",
    "name": "Pressfreedomindex",
    "property": "http://dbpedia.org/property/pressFreedomIndex",
    "category": "social"
  },
  {
    "id": "populationtotal",
    "name": "Total  Population",
    "property": "http://dbpedia.org/ontology/populationTotal",
    "category": "demographic"
  },
  {
    "id": "areatotal",
    "name": "Total  Area",
    "property": "http://dbpedia.org/ontology/areaTotal",
    "category": "geographic"
  }
];

// SPARQL query to get all countries with a specific property
function getPropertyQuery(propertyUri) {
    return `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        
        SELECT ?country ?name ?value
        WHERE {
            ?country a dbo:Country ;
                     rdfs:label ?name ;
                     <${propertyUri}> ?value .
            FILTER(lang(?name) = 'en')
        }
        ORDER BY DESC(?value)
    `;
}

// Get ALL countries for ALL properties
async function getAllCountryData() {
    const allData = {};
    
    for (const prop of countryProperties) {
        console.log(`Fetching ${prop.name}...`);
        const query = getPropertyQuery(prop.property);
        // Execute SPARQL query here
        // allData[prop.id] = results;
    }
    
    return allData;
}

module.exports = { countryProperties, getPropertyQuery, getAllCountryData };
