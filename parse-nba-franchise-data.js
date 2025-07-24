// Parse NBA franchise data for name changes and miles moved
const fs = require('fs');

// NBA Franchise History from provided data
const nbaFranchiseData = {
    "Atlanta Hawks": {
        nameChanges: [
            { name: "Tri-Cities Blackhawks", years: "1949-1950", location: "Tri-Cities" },
            { name: "Milwaukee Hawks", years: "1951-1954", location: "Milwaukee" },
            { name: "St. Louis Hawks", years: "1955-1967", location: "St. Louis" },
            { name: "Atlanta Hawks", years: "1968-2024", location: "Atlanta" }
        ],
        relocations: [
            { from: "Tri-Cities", to: "Milwaukee", year: 1951, miles: 300 },
            { from: "Milwaukee", to: "St. Louis", year: 1955, miles: 350 },
            { from: "St. Louis", to: "Atlanta", year: 1968, miles: 550 }
        ]
    },
    "Boston Celtics": {
        nameChanges: [
            { name: "Boston Celtics", years: "1946-2024", location: "Boston" }
        ],
        relocations: [] // Never moved
    },
    "Brooklyn Nets": {
        nameChanges: [
            { name: "New York Nets", years: "1976", location: "New York" },
            { name: "New Jersey Nets", years: "1977-2011", location: "New Jersey" },
            { name: "Brooklyn Nets", years: "2012-2024", location: "Brooklyn" }
        ],
        relocations: [
            { from: "New York", to: "New Jersey", year: 1977, miles: 15 },
            { from: "New Jersey", to: "Brooklyn", year: 2012, miles: 15 }
        ]
    },
    "Charlotte Hornets": {
        nameChanges: [
            { name: "Charlotte Hornets", years: "1988-2002", location: "Charlotte" }, // Original franchise moved to New Orleans
            { name: "Charlotte Bobcats", years: "2004-2013", location: "Charlotte" }, // Expansion team
            { name: "Charlotte Hornets", years: "2014-2024", location: "Charlotte" } // Name change back
        ],
        relocations: [] // Never moved cities (complex history but stayed in Charlotte)
    },
    "Chicago Bulls": {
        nameChanges: [
            { name: "Chicago Bulls", years: "1966-2024", location: "Chicago" }
        ],
        relocations: [] // Never moved
    },
    "Cleveland Cavaliers": {
        nameChanges: [
            { name: "Cleveland Cavaliers", years: "1970-2024", location: "Cleveland" }
        ],
        relocations: [] // Never moved
    },
    "Dallas Mavericks": {
        nameChanges: [
            { name: "Dallas Mavericks", years: "1980-2024", location: "Dallas" }
        ],
        relocations: [] // Never moved
    },
    "Denver Nuggets": {
        nameChanges: [
            { name: "Denver Nuggets", years: "1976-2024", location: "Denver" }
        ],
        relocations: [] // Never moved (started in ABA 1967, joined NBA 1976)
    },
    "Detroit Pistons": {
        nameChanges: [
            { name: "Ft. Wayne Zollner Pistons", years: "1948-1956", location: "Fort Wayne" },
            { name: "Detroit Pistons", years: "1957-2024", location: "Detroit" }
        ],
        relocations: [
            { from: "Fort Wayne", to: "Detroit", year: 1957, miles: 180 }
        ]
    },
    "Golden State Warriors": {
        nameChanges: [
            { name: "Philadelphia Warriors", years: "1946-1961", location: "Philadelphia" },
            { name: "San Francisco Warriors", years: "1962-1970", location: "San Francisco" },
            { name: "Golden State Warriors", years: "1971-2024", location: "Golden State" }
        ],
        relocations: [
            { from: "Philadelphia", to: "San Francisco", year: 1962, miles: 2900 },
            { from: "San Francisco", to: "Golden State", year: 1971, miles: 50 } // Same area, different name
        ]
    },
    "Houston Rockets": {
        nameChanges: [
            { name: "San Diego Rockets", years: "1967-1970", location: "San Diego" },
            { name: "Houston Rockets", years: "1971-2024", location: "Houston" }
        ],
        relocations: [
            { from: "San Diego", to: "Houston", year: 1971, miles: 1200 }
        ]
    },
    "Indiana Pacers": {
        nameChanges: [
            { name: "Indiana Pacers", years: "1976-2024", location: "Indiana" }
        ],
        relocations: [] // Never moved (started in ABA 1967, joined NBA 1976)
    },
    "Los Angeles Clippers": {
        nameChanges: [
            { name: "Buffalo Braves", years: "1970-1977", location: "Buffalo" },
            { name: "San Diego Clippers", years: "1978-1983", location: "San Diego" },
            { name: "Los Angeles Clippers", years: "1984-2024", location: "Los Angeles" }
        ],
        relocations: [
            { from: "Buffalo", to: "San Diego", year: 1978, miles: 2400 },
            { from: "San Diego", to: "Los Angeles", year: 1984, miles: 120 }
        ]
    },
    "Los Angeles Lakers": {
        nameChanges: [
            { name: "Minneapolis Lakers", years: "1948-1959", location: "Minneapolis" },
            { name: "Los Angeles Lakers", years: "1960-2024", location: "Los Angeles" }
        ],
        relocations: [
            { from: "Minneapolis", to: "Los Angeles", year: 1960, miles: 2000 }
        ]
    },
    "Memphis Grizzlies": {
        nameChanges: [
            { name: "Vancouver Grizzlies", years: "1995-2000", location: "Vancouver" },
            { name: "Memphis Grizzlies", years: "2001-2024", location: "Memphis" }
        ],
        relocations: [
            { from: "Vancouver", to: "Memphis", year: 2001, miles: 2200 }
        ]
    },
    "Miami Heat": {
        nameChanges: [
            { name: "Miami Heat", years: "1988-2024", location: "Miami" }
        ],
        relocations: [] // Never moved
    },
    "Milwaukee Bucks": {
        nameChanges: [
            { name: "Milwaukee Bucks", years: "1968-2024", location: "Milwaukee" }
        ],
        relocations: [] // Never moved
    },
    "Minnesota Timberwolves": {
        nameChanges: [
            { name: "Minnesota Timberwolves", years: "1989-2024", location: "Minnesota" }
        ],
        relocations: [] // Never moved
    },
    "New Orleans Pelicans": {
        nameChanges: [
            { name: "New Orleans Hornets", years: "2002-2012", location: "New Orleans" }, // Original Charlotte franchise moved here
            { name: "New Orleans/Oklahoma City Hornets", years: "2005-2006", location: "New Orleans/OKC" }, // Hurricane Katrina
            { name: "New Orleans Pelicans", years: "2013-2024", location: "New Orleans" }
        ],
        relocations: [
            { from: "Charlotte", to: "New Orleans", year: 2002, miles: 650 }, // Original Hornets franchise
            { from: "New Orleans", to: "Oklahoma City", year: 2005, miles: 350 }, // Temporary due to hurricane
            { from: "Oklahoma City", to: "New Orleans", year: 2007, miles: 350 } // Return after hurricane
        ]
    },
    "New York Knicks": {
        nameChanges: [
            { name: "New York Knicks", years: "1946-2024", location: "New York" }
        ],
        relocations: [] // Never moved
    },
    "Oklahoma City Thunder": {
        nameChanges: [
            { name: "Seattle SuperSonics", years: "1967-2007", location: "Seattle" },
            { name: "Oklahoma City Thunder", years: "2008-2024", location: "Oklahoma City" }
        ],
        relocations: [
            { from: "Seattle", to: "Oklahoma City", year: 2008, miles: 1200 }
        ]
    },
    "Orlando Magic": {
        nameChanges: [
            { name: "Orlando Magic", years: "1989-2024", location: "Orlando" }
        ],
        relocations: [] // Never moved
    },
    "Philadelphia 76ers": {
        nameChanges: [
            { name: "Syracuse Nationals", years: "1949-1962", location: "Syracuse" },
            { name: "Philadelphia 76ers", years: "1963-2024", location: "Philadelphia" }
        ],
        relocations: [
            { from: "Syracuse", to: "Philadelphia", year: 1963, miles: 250 }
        ]
    },
    "Phoenix Suns": {
        nameChanges: [
            { name: "Phoenix Suns", years: "1968-2024", location: "Phoenix" }
        ],
        relocations: [] // Never moved
    },
    "Portland Trail Blazers": {
        nameChanges: [
            { name: "Portland Trail Blazers", years: "1970-2024", location: "Portland" }
        ],
        relocations: [] // Never moved
    },
    "Sacramento Kings": {
        nameChanges: [
            { name: "Rochester Royals", years: "1948-1956", location: "Rochester" },
            { name: "Cincinnati Royals", years: "1957-1971", location: "Cincinnati" },
            { name: "Kansas City-Omaha Kings", years: "1972-1974", location: "Kansas City" },
            { name: "Kansas City Kings", years: "1975-1984", location: "Kansas City" },
            { name: "Sacramento Kings", years: "1985-2024", location: "Sacramento" }
        ],
        relocations: [
            { from: "Rochester", to: "Cincinnati", year: 1957, miles: 500 },
            { from: "Cincinnati", to: "Kansas City", year: 1972, miles: 550 },
            { from: "Kansas City", to: "Sacramento", year: 1985, miles: 1500 }
        ]
    },
    "San Antonio Spurs": {
        nameChanges: [
            { name: "San Antonio Spurs", years: "1976-2024", location: "San Antonio" }
        ],
        relocations: [] // Never moved (started in ABA as Dallas Chaparrals, moved to SA before NBA merger)
    },
    "Toronto Raptors": {
        nameChanges: [
            { name: "Toronto Raptors", years: "1995-2024", location: "Toronto" }
        ],
        relocations: [] // Never moved
    },
    "Utah Jazz": {
        nameChanges: [
            { name: "New Orleans Jazz", years: "1974-1978", location: "New Orleans" },
            { name: "Utah Jazz", years: "1979-2024", location: "Utah" }
        ],
        relocations: [
            { from: "New Orleans", to: "Utah", year: 1979, miles: 1200 }
        ]
    },
    "Washington Wizards": {
        nameChanges: [
            { name: "Chicago Packers", years: "1961", location: "Chicago" },
            { name: "Chicago Zephyrs", years: "1962", location: "Chicago" },
            { name: "Baltimore Bullets", years: "1963-1972", location: "Baltimore" },
            { name: "Capital Bullets", years: "1973", location: "Washington" },
            { name: "Washington Bullets", years: "1974-1996", location: "Washington" },
            { name: "Washington Wizards", years: "1997-2024", location: "Washington" }
        ],
        relocations: [
            { from: "Chicago", to: "Baltimore", year: 1963, miles: 700 },
            { from: "Baltimore", to: "Washington", year: 1973, miles: 40 }
        ]
    }
};

// Calculate franchise metrics
function calculateNBAFranchiseMetrics() {
    const results = {};
    
    Object.keys(nbaFranchiseData).forEach(teamName => {
        const franchise = nbaFranchiseData[teamName];
        
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

console.log('🏀 NBA Franchise History Analysis');
console.log('==================================');
console.log('');

const nbaFranchiseMetrics = calculateNBAFranchiseMetrics();

console.log('📊 Summary Statistics:');
console.log(`Teams with name changes: ${Object.values(nbaFranchiseMetrics).filter(f => f.franchise_name_changes > 0).length}`);
console.log(`Teams with relocations: ${Object.values(nbaFranchiseMetrics).filter(f => f.franchise_miles_moved > 0).length}`);
console.log(`Most name changes: ${Math.max(...Object.values(nbaFranchiseMetrics).map(f => f.franchise_name_changes))}`);
console.log(`Most miles moved: ${Math.max(...Object.values(nbaFranchiseMetrics).map(f => f.franchise_miles_moved))}`);

// Save results for integration
fs.writeFileSync('nba-franchise-metrics.json', JSON.stringify(nbaFranchiseMetrics, null, 2));
console.log('');
console.log('✅ NBA franchise metrics saved to nba-franchise-metrics.json');