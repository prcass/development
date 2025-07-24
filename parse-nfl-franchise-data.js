// Parse NFL franchise data for name changes and miles moved
const fs = require('fs');

// NFL Franchise History from provided data
const nflFranchiseData = {
    "Arizona Cardinals": {
        nameChanges: [
            { name: "Chicago Cardinals", years: "1920-1943", location: "Chicago" },
            { name: "Chi/Pit Cards/Steelers", years: "1944", location: "Chicago/Pittsburgh" },
            { name: "Chicago Cardinals", years: "1945-1959", location: "Chicago" },
            { name: "St. Louis Cardinals", years: "1960-1987", location: "St. Louis" },
            { name: "Phoenix Cardinals", years: "1988-1993", location: "Phoenix" },
            { name: "Arizona Cardinals", years: "1994-2025", location: "Arizona" }
        ],
        relocations: [
            { from: "Chicago", to: "St. Louis", year: 1960, miles: 300 },
            { from: "St. Louis", to: "Phoenix", year: 1988, miles: 1200 },
            { from: "Phoenix", to: "Arizona", year: 1994, miles: 0 } // Same city, name change only
        ]
    },
    "Chicago Bears": {
        nameChanges: [
            { name: "Decatur Staleys", years: "1920", location: "Decatur" },
            { name: "Chicago Staleys", years: "1921", location: "Chicago" },
            { name: "Chicago Bears", years: "1922-2025", location: "Chicago" }
        ],
        relocations: [
            { from: "Decatur", to: "Chicago", year: 1921, miles: 180 }
        ]
    },
    "Cleveland Browns": {
        nameChanges: [
            { name: "Cleveland Browns", years: "1946-2025", location: "Cleveland" }
        ],
        relocations: [] // Never moved
    },
    "Detroit Lions": {
        nameChanges: [
            { name: "Portsmouth Spartans", years: "1930-1933", location: "Portsmouth" },
            { name: "Detroit Lions", years: "1934-2025", location: "Detroit" }
        ],
        relocations: [
            { from: "Portsmouth", to: "Detroit", year: 1934, miles: 60 }
        ]
    },
    "Green Bay Packers": {
        nameChanges: [
            { name: "Green Bay Packers", years: "1921-2025", location: "Green Bay" }
        ],
        relocations: [] // Never moved
    },
    "Indianapolis Colts": {
        nameChanges: [
            { name: "Baltimore Colts", years: "1953-1983", location: "Baltimore" },
            { name: "Indianapolis Colts", years: "1984-2025", location: "Indianapolis" }
        ],
        relocations: [
            { from: "Baltimore", to: "Indianapolis", year: 1984, miles: 650 }
        ]
    },
    "Kansas City Chiefs": {
        nameChanges: [
            { name: "Dallas Texans", years: "1960-1962", location: "Dallas" },
            { name: "Kansas City Chiefs", years: "1963-2025", location: "Kansas City" }
        ],
        relocations: [
            { from: "Dallas", to: "Kansas City", year: 1963, miles: 500 }
        ]
    },
    "Las Vegas Raiders": {
        nameChanges: [
            { name: "Oakland Raiders", years: "1960-1981", location: "Oakland" },
            { name: "Los Angeles Raiders", years: "1982-1994", location: "Los Angeles" },
            { name: "Oakland Raiders", years: "1995-2019", location: "Oakland" },
            { name: "Las Vegas Raiders", years: "2020-2025", location: "Las Vegas" }
        ],
        relocations: [
            { from: "Oakland", to: "Los Angeles", year: 1982, miles: 400 },
            { from: "Los Angeles", to: "Oakland", year: 1995, miles: 400 },
            { from: "Oakland", to: "Las Vegas", year: 2020, miles: 570 }
        ]
    },
    "Los Angeles Chargers": {
        nameChanges: [
            { name: "Los Angeles Chargers", years: "1960", location: "Los Angeles" },
            { name: "San Diego Chargers", years: "1961-2016", location: "San Diego" },
            { name: "Los Angeles Chargers", years: "2017-2025", location: "Los Angeles" }
        ],
        relocations: [
            { from: "Los Angeles", to: "San Diego", year: 1961, miles: 120 },
            { from: "San Diego", to: "Los Angeles", year: 2017, miles: 120 }
        ]
    },
    "Los Angeles Rams": {
        nameChanges: [
            { name: "Cleveland Rams", years: "1937-1945", location: "Cleveland" },
            { name: "Los Angeles Rams", years: "1946-1994", location: "Los Angeles" },
            { name: "St. Louis Rams", years: "1995-2015", location: "St. Louis" },
            { name: "Los Angeles Rams", years: "2016-2025", location: "Los Angeles" }
        ],
        relocations: [
            { from: "Cleveland", to: "Los Angeles", year: 1946, miles: 2400 },
            { from: "Los Angeles", to: "St. Louis", year: 1995, miles: 1800 },
            { from: "St. Louis", to: "Los Angeles", year: 2016, miles: 1800 }
        ]
    },
    "New England Patriots": {
        nameChanges: [
            { name: "Boston Patriots", years: "1960-1970", location: "Boston" },
            { name: "New England Patriots", years: "1971-2025", location: "New England" }
        ],
        relocations: [] // Same metro area
    },
    "New York Jets": {
        nameChanges: [
            { name: "New York Titans", years: "1960-1962", location: "New York" },
            { name: "New York Jets", years: "1963-2025", location: "New York" }
        ],
        relocations: [] // Never moved cities
    },
    "Philadelphia Eagles": {
        nameChanges: [
            { name: "Philadelphia Eagles", years: "1933-1942", location: "Philadelphia" },
            { name: "Phi/Pit Eagles/Steelers", years: "1943", location: "Philadelphia/Pittsburgh" },
            { name: "Philadelphia Eagles", years: "1944-2025", location: "Philadelphia" }
        ],
        relocations: [] // Never permanently moved
    },
    "Pittsburgh Steelers": {
        nameChanges: [
            { name: "Pittsburgh Pirates", years: "1933-1939", location: "Pittsburgh" },
            { name: "Pittsburgh Steelers", years: "1940-1942", location: "Pittsburgh" },
            { name: "Phi/Pit Eagles/Steelers", years: "1943", location: "Philadelphia/Pittsburgh" },
            { name: "Chi/Pit Cards/Steelers", years: "1944", location: "Chicago/Pittsburgh" },
            { name: "Pittsburgh Steelers", years: "1945-2025", location: "Pittsburgh" }
        ],
        relocations: [] // Never permanently moved
    },
    "Tennessee Titans": {
        nameChanges: [
            { name: "Houston Oilers", years: "1960-1996", location: "Houston" },
            { name: "Tennessee Oilers", years: "1997-1998", location: "Tennessee" },
            { name: "Tennessee Titans", years: "1999-2025", location: "Tennessee" }
        ],
        relocations: [
            { from: "Houston", to: "Tennessee", year: 1997, miles: 350 }
        ]
    },
    "Washington Commanders": {
        nameChanges: [
            { name: "Boston Braves", years: "1932", location: "Boston" },
            { name: "Boston Redskins", years: "1933-1936", location: "Boston" },
            { name: "Washington Redskins", years: "1937-2019", location: "Washington" },
            { name: "Washington Football Team", years: "2020-2021", location: "Washington" },
            { name: "Washington Commanders", years: "2022-2025", location: "Washington" }
        ],
        relocations: [
            { from: "Boston", to: "Washington", year: 1937, miles: 440 }
        ]
    }
};

// Calculate franchise metrics
function calculateFranchiseMetrics() {
    const results = {};
    
    Object.keys(nflFranchiseData).forEach(teamName => {
        const franchise = nflFranchiseData[teamName];
        
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

// Add teams that never moved or changed names (set to 0)
const stableNFLTeams = [
    "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills", "Carolina Panthers",
    "Cincinnati Bengals", "Dallas Cowboys", "Denver Broncos", "Houston Texans",
    "Jacksonville Jaguars", "Miami Dolphins", "Minnesota Vikings", 
    "New Orleans Saints", "New York Giants", "San Francisco 49ers",
    "Seattle Seahawks", "Tampa Bay Buccaneers"
];

console.log('🏈 NFL Franchise History Analysis');
console.log('=====================================');
console.log('');

const franchiseMetrics = calculateFranchiseMetrics();

// Add stable teams with 0 values
stableNFLTeams.forEach(teamName => {
    franchiseMetrics[teamName] = {
        franchise_name_changes: 0,
        franchise_miles_moved: 0
    };
    console.log(`${teamName}: 0 name changes, 0 miles moved (stable franchise)`);
});

console.log('');
console.log('📊 Summary Statistics:');
console.log(`Teams with name changes: ${Object.values(franchiseMetrics).filter(f => f.franchise_name_changes > 0).length}`);
console.log(`Teams with relocations: ${Object.values(franchiseMetrics).filter(f => f.franchise_miles_moved > 0).length}`);
console.log(`Most name changes: ${Math.max(...Object.values(franchiseMetrics).map(f => f.franchise_name_changes))}`);
console.log(`Most miles moved: ${Math.max(...Object.values(franchiseMetrics).map(f => f.franchise_miles_moved))}`);

// Save results for integration
fs.writeFileSync('nfl-franchise-metrics.json', JSON.stringify(franchiseMetrics, null, 2));
console.log('');
console.log('✅ NFL franchise metrics saved to nfl-franchise-metrics.json');