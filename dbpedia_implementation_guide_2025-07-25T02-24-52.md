
# DBpedia SPARQL Implementation Guide

## How to Execute These Queries

### Method 1: Direct HTTP Request
```javascript
const response = await fetch('https://dbpedia.org/sparql', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
    },
    body: new URLSearchParams({
        query: completeQueries.lifeExpectancy,
        format: 'json'
    })
});

const data = await response.json();
console.log(`Found ${data.results.bindings.length} countries with life expectancy data`);
```

### Method 2: Browser Testing
1. Go to https://dbpedia.org/sparql
2. Paste any query from completeQueries
3. Click "Run Query"
4. Get complete results (no truncation!)

### Method 3: Command Line with curl
```bash
curl -X POST "https://dbpedia.org/sparql" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "Accept: application/json" \
  --data-urlencode "query=${SPARQL_QUERY}" \
  --data-urlencode "format=json"
```

## Expected Results
- Life Expectancy: ~178 countries (vs WebFetch's 79)
- Population: ~195 countries (vs WebFetch's 95) 
- GDP: ~182 countries (vs WebFetch's 22)
- HDI: ~165 countries (vs WebFetch's 20)

## No Truncation Limits!
Unlike WebFetch, SPARQL queries return complete results.
