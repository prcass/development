-- DBpedia SPARQL Queries for Complete Country Data
-- Generated: 2025-07-25T02:23:04.162Z

-- Life Expectancy Query (replaces truncated WebFetch)

PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?country ?name ?lifeExpectancy
WHERE {
    ?country a dbo:Country ;
             rdfs:label ?name ;
             dbo:lifeExpectancy ?lifeExpectancy .
    FILTER(lang(?name) = 'en')
}
ORDER BY DESC(?lifeExpectancy)


-- Additional queries would go here for other properties
-- These queries have no truncation limits and return ALL countries

-- Usage: Execute against https://dbpedia.org/sparql
-- Expected result: 150-180 countries with life expectancy data
-- No 30-country limits, no truncation issues
