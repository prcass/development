// Parse NHL franchise data for name changes and miles moved
const fs = require('fs');

// NHL Franchise History from provided data
const nhlFranchiseData = {
    "Anaheim Ducks": {
        nameChanges: [
            { name: "Mighty Ducks of Anaheim", years: "1993-2006", location: "Anaheim" },
            { name: "Anaheim Ducks", years: "2006-2026", location: "Anaheim" }
        ],
        relocations: [] // Never moved cities, just name change
    },
    "Boston Bruins": {
        nameChanges: [
            { name: "Boston Bruins", years: "1924-2026", location: "Boston" }
        ],
        relocations: [] // Never moved
    },
    "Buffalo Sabres": {
        nameChanges: [
            { name: "Buffalo Sabres", years: "1970-2026", location: "Buffalo" }
        ],
        relocations: [] // Never moved
    },
    "Calgary Flames": {
        nameChanges: [
            { name: "Atlanta Flames", years: "1972-1980", location: "Atlanta" },
            { name: "Calgary Flames", years: "1980-2026", location: "Calgary" }
        ],
        relocations: [
            { from: "Atlanta", to: "Calgary", year: 1980, miles: 2200 }
        ]
    },
    "Carolina Hurricanes": {
        nameChanges: [
            { name: "Hartford Whalers", years: "1979-1997", location: "Hartford" },
            { name: "Carolina Hurricanes", years: "1997-2026", location: "Carolina" }
        ],
        relocations: [
            { from: "Hartford", to: "Carolina", year: 1997, miles: 650 }
        ]
    },
    "Chicago Blackhawks": {
        nameChanges: [
            { name: "Chicago Black Hawks", years: "1926-1986", location: "Chicago" },
            { name: "Chicago Blackhawks", years: "1986-2026", location: "Chicago" }
        ],
        relocations: [] // Never moved cities, just name change (spacing)
    },
    "Colorado Avalanche": {
        nameChanges: [
            { name: "Quebec Nordiques", years: "1979-1995", location: "Quebec" },
            { name: "Colorado Avalanche", years: "1995-2026", location: "Colorado" }
        ],
        relocations: [
            { from: "Quebec", to: "Colorado", year: 1995, miles: 2000 }
        ]
    },
    "Columbus Blue Jackets": {
        nameChanges: [
            { name: "Columbus Blue Jackets", years: "2000-2026", location: "Columbus" }
        ],
        relocations: [] // Expansion team, never moved
    },
    "Dallas Stars": {
        nameChanges: [
            { name: "Minnesota North Stars", years: "1967-1993", location: "Minnesota" },
            { name: "Dallas Stars", years: "1993-2026", location: "Dallas" }
        ],
        relocations: [
            { from: "Minnesota", to: "Dallas", year: 1993, miles: 950 }
        ]
    },
    "Detroit Red Wings": {
        nameChanges: [
            { name: "Detroit Cougars", years: "1926-1930", location: "Detroit" },
            { name: "Detroit Falcons", years: "1930-1932", location: "Detroit" },
            { name: "Detroit Red Wings", years: "1932-2026", location: "Detroit" }
        ],
        relocations: [] // Never moved cities, just name changes
    },
    "Edmonton Oilers": {
        nameChanges: [
            { name: "Edmonton Oilers", years: "1979-2026", location: "Edmonton" }
        ],
        relocations: [] // Never moved (joined from WHA)
    },
    "Florida Panthers": {
        nameChanges: [
            { name: "Florida Panthers", years: "1993-2026", location: "Florida" }
        ],
        relocations: [] // Expansion team, never moved
    },
    "Los Angeles Kings": {
        nameChanges: [
            { name: "Los Angeles Kings", years: "1967-2026", location: "Los Angeles" }
        ],
        relocations: [] // Never moved
    },
    "Minnesota Wild": {
        nameChanges: [
            { name: "Minnesota Wild", years: "2000-2026", location: "Minnesota" }
        ],
        relocations: [] // Expansion team, never moved
    },
    "Montreal Canadiens": {
        nameChanges: [
            { name: "Montreal Canadiens", years: "1917-2026", location: "Montreal" }
        ],
        relocations: [] // Never moved
    },
    "Nashville Predators": {
        nameChanges: [
            { name: "Nashville Predators", years: "1998-2026", location: "Nashville" }
        ],
        relocations: [] // Expansion team, never moved
    },
    "New Jersey Devils": {
        nameChanges: [
            { name: "Kansas City Scouts", years: "1974-1976", location: "Kansas City" },
            { name: "Colorado Rockies", years: "1976-1982", location: "Colorado" },
            { name: "New Jersey Devils", years: "1982-2026", location: "New Jersey" }
        ],
        relocations: [
            { from: "Kansas City", to: "Colorado", year: 1976, miles: 600 },
            { from: "Colorado", to: "New Jersey", year: 1982, miles: 1800 }
        ]
    },
    "New York Islanders": {
        nameChanges: [
            { name: "New York Islanders", years: "1972-2026", location: "New York" }
        ],
        relocations: [] // Never moved
    },
    "New York Rangers": {
        nameChanges: [
            { name: "New York Rangers", years: "1926-2026", location: "New York" }
        ],
        relocations: [] // Never moved
    },
    "Ottawa Senators": {
        nameChanges: [
            { name: "Ottawa Senators", years: "1992-2026", location: "Ottawa" }
        ],
        relocations: [] // Modern expansion team, never moved
    },
    "Philadelphia Flyers": {
        nameChanges: [
            { name: "Philadelphia Flyers", years: "1967-2026", location: "Philadelphia" }
        ],
        relocations: [] // Never moved
    },
    "Pittsburgh Penguins": {
        nameChanges: [
            { name: "Pittsburgh Penguins", years: "1967-2026", location: "Pittsburgh" }
        ],
        relocations: [] // Never moved
    },
    "San Jose Sharks": {
        nameChanges: [
            { name: "San Jose Sharks", years: "1991-2026", location: "San Jose" }
        ],
        relocations: [] // Expansion team, never moved
    },
    "Seattle Kraken": {
        nameChanges: [
            { name: "Seattle Kraken", years: "2021-2026", location: "Seattle" }
        ],
        relocations: [] // Expansion team, never moved
    },
    "St. Louis Blues": {
        nameChanges: [
            { name: "St. Louis Blues", years: "1967-2026", location: "St. Louis" }
        ],
        relocations: [] // Never moved
    },
    "Tampa Bay Lightning": {
        nameChanges: [
            { name: "Tampa Bay Lightning", years: "1992-2026", location: "Tampa Bay" }
        ],
        relocations: [] // Expansion team, never moved
    },
    "Toronto Maple Leafs": {
        nameChanges: [
            { name: "Toronto Arenas", years: "1917-1919", location: "Toronto" },
            { name: "Toronto St. Patricks", years: "1919-1926", location: "Toronto" },
            { name: "Toronto Maple Leafs", years: "1926-2026", location: "Toronto" }
        ],
        relocations: [] // Never moved cities, just name changes
    },
    "Utah Hockey Club": {
        nameChanges: [
            { name: "Winnipeg Jets", years: "1999-2011", location: "Winnipeg" }, // Note: Different from current Jets
            { name: "Atlanta Thrashers", years: "1999-2011", location: "Atlanta" },
            { name: "Winnipeg Jets", years: "2011-2024", location: "Winnipeg" },
            { name: "Utah Hockey Club", years: "2024-2026", location: "Utah" }
        ],
        relocations: [
            { from: "Atlanta", to: "Winnipeg", year: 2011, miles: 1100 },
            { from: "Winnipeg", to: "Utah", year: 2024, miles: 1200 }
        ]
    },
    "Vancouver Canucks": {
        nameChanges: [
            { name: "Vancouver Canucks", years: "1970-2026", location: "Vancouver" }
        ],
        relocations: [] // Never moved
    },
    "Vegas Golden Knights": {
        nameChanges: [
            { name: "Vegas Golden Knights", years: "2017-2026", location: "Vegas" }
        ],
        relocations: [] // Expansion team, never moved
    },
    "Washington Capitals": {
        nameChanges: [
            { name: "Washington Capitals", years: "1974-2026", location: "Washington" }
        ],
        relocations: [] // Never moved
    },
    "Winnipeg Jets": {
        nameChanges: [
            { name: "Atlanta Thrashers", years: "1999-2011", location: "Atlanta" },
            { name: "Winnipeg Jets", years: "2011-2026", location: "Winnipeg" }
        ],
        relocations: [
            { from: "Atlanta", to: "Winnipeg", year: 2011, miles: 1100 }
        ]
    }
};

// Calculate franchise metrics
function calculateNHLFranchiseMetrics() {
    const results = {};
    
    Object.keys(nhlFranchiseData).forEach(teamName => {
        const franchise = nhlFranchiseData[teamName];
        
        // Count name changes (subtract 1 since first name doesn't count as a "change")
        const nameChanges = Math.max(0, franchise.nameChanges.length - 1);
        
        // Calculate total miles moved
        const totalMiles = franchise.relocations.reduce((sum, relocation) => sum + relocation.miles, 0);
        
        results[teamName] = {
            franchise_name_changes: nameChanges,
            franchise_miles_moved: totalMiles
        };
        
        console.log(`${teamName}:`);
        console.log(`  Name changes: ${nameChanges}`);
        console.log(`  Miles moved: ${totalMiles}`);
        console.log(`  History: ${franchise.nameChanges.map(nc => nc.name).join(' → ')}`);
        if (franchise.relocations.length > 0) {
            console.log(`  Relocations: ${franchise.relocations.map(r => `${r.from}→${r.to} (${r.miles}mi)`).join(', ')}`);
        }
        console.log('');
    });
    
    return results;
}

console.log('🏒 NHL Franchise History Analysis');
console.log('==================================');
console.log('');

const nhlFranchiseMetrics = calculateNHLFranchiseMetrics();

console.log('📊 Summary Statistics:');
console.log(`Teams with name changes: ${Object.values(nhlFranchiseMetrics).filter(f => f.franchise_name_changes > 0).length}`);
console.log(`Teams with relocations: ${Object.values(nhlFranchiseMetrics).filter(f => f.franchise_miles_moved > 0).length}`);
console.log(`Most name changes: ${Math.max(...Object.values(nhlFranchiseMetrics).map(f => f.franchise_name_changes))}`);
console.log(`Most miles moved: ${Math.max(...Object.values(nhlFranchiseMetrics).map(f => f.franchise_miles_moved))}`);

// Save results for integration
fs.writeFileSync('nhl-franchise-metrics.json', JSON.stringify(nhlFranchiseMetrics, null, 2));
console.log('');
console.log('✅ NHL franchise metrics saved to nhl-franchise-metrics.json');