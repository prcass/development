// Script to clear sports items from data.js
const fs = require('fs');

// Read the file
let content = fs.readFileSync('data.js', 'utf8');

// Find the sports section and replace items with empty object
// This regex finds the sports items section and replaces it with an empty items object
content = content.replace(
    /("sports":\s*\{[^}]*"prompts":\s*\[[^\]]*\],\s*"items":\s*\{)[^}]*(\}[^}]*\})/s,
    '$1$2'
);

// Actually, let's be more specific - find from "items": { after sports prompts to the closing }
// before "companies"
const sportsStart = content.indexOf('"sports":');
const companiesStart = content.indexOf('"companies":', sportsStart);

if (sportsStart !== -1 && companiesStart !== -1) {
    // Find the "items": { within the sports section
    const itemsStart = content.indexOf('"items": {', sportsStart);
    if (itemsStart !== -1 && itemsStart < companiesStart) {
        // Find the closing } for items (it's the } right before },\n        "companies")
        const beforeCompanies = content.lastIndexOf('}', companiesStart - 10);
        if (beforeCompanies !== -1) {
            // Replace everything between "items": { and the closing }
            const newContent = 
                content.substring(0, itemsStart + '"items": {'.length) +
                '\n            }' +
                content.substring(beforeCompanies);
            
            fs.writeFileSync('data.js', newContent, 'utf8');
            console.log('Sports items cleared successfully!');
        }
    }
}