// Parse NFL First Overall Draft Picks Data
const fs = require('fs');

// NFL Teams First Overall Draft Picks Data
const nflDraftPicksData = {
    "Indianapolis Colts": {
        picks: 7,
        years: [1955, 1967, 1983, 1990, 1992, 1998, 2012],
        notes: "3 as Baltimore Colts, 4 as Indianapolis Colts"
    },
    "Los Angeles Rams": {
        picks: 7,
        years: [1938, 1952, 1960, 1963, 1997, 2010, 2016],
        notes: "1 as Cleveland Rams, 2 as St. Louis Rams, 4 as Los Angeles Rams"
    },
    "Tampa Bay Buccaneers": {
        picks: 5,
        years: [1976, 1977, 1986, 1987, 2015],
        notes: "Also had first selection in 1984 NFL supplemental draft"
    },
    "Cleveland Browns": {
        picks: 5,
        years: [1954, 1999, 2000, 2017, 2018],
        notes: ""
    },
    "Arizona Cardinals": {
        picks: 5,
        years: [1939, 1940, 1945, 1958, 2019],
        notes: "4 as Chicago Cardinals"
    },
    "Detroit Lions": {
        picks: 4,
        years: [1943, 1950, 1980, 2009],
        notes: ""
    },
    "Atlanta Falcons": {
        picks: 4,
        years: [1966, 1975, 1988, 2001],
        notes: ""
    },
    "Buffalo Bills": {
        picks: 4,
        years: [1969, 1972, 1979, 1985],
        notes: "Also had first selection in 1961 AFL draft"
    },
    "Cincinnati Bengals": {
        picks: 4,
        years: [1994, 1995, 2003, 2020],
        notes: ""
    },
    "New England Patriots": {
        picks: 4,
        years: [1971, 1982, 1984, 1993],
        notes: "Also had first selection in 1964 AFL draft (as Boston Patriots)"
    },
    "Philadelphia Eagles": {
        picks: 3,
        years: [1936, 1937, 1949],
        notes: ""
    },
    "Chicago Bears": {
        picks: 3,
        years: [1941, 1947, 2024],
        notes: ""
    },
    "Pittsburgh Steelers": {
        picks: 3,
        years: [1942, 1956, 1970],
        notes: ""
    },
    "San Francisco 49ers": {
        picks: 3,
        years: [1953, 1964, 2005],
        notes: ""
    },
    "Dallas Cowboys": {
        picks: 3,
        years: [1974, 1989, 1991],
        notes: ""
    },
    "Houston Texans": {
        picks: 3,
        years: [2002, 2006, 2014],
        notes: ""
    },
    "Tennessee Titans": {
        picks: 3,
        years: [1973, 1978, 2025],
        notes: "2 as Houston Oilers"
    },
    "Washington Commanders": {
        picks: 2,
        years: [1948, 1962],
        notes: "2 as Washington Redskins"
    },
    "New York Giants": {
        picks: 2,
        years: [1951, 1965],
        notes: ""
    },
    "Green Bay Packers": {
        picks: 2,
        years: [1957, 1959],
        notes: ""
    },
    "Minnesota Vikings": {
        picks: 2,
        years: [1961, 1968],
        notes: ""
    },
    "Carolina Panthers": {
        picks: 2,
        years: [2011, 2023],
        notes: ""
    },
    "Jacksonville Jaguars": {
        picks: 2,
        years: [2021, 2022],
        notes: ""
    },
    "New Orleans Saints": {
        picks: 1,
        years: [1981],
        notes: ""
    },
    "New York Jets": {
        picks: 1,
        years: [1996],
        notes: "Also had first selection in 1965 AFL draft"
    },
    "Los Angeles Chargers": {
        picks: 1,
        years: [2004],
        notes: "1 as San Diego Chargers"
    },
    "Las Vegas Raiders": {
        picks: 1,
        years: [2007],
        notes: "1 as Oakland Raiders, also had first selection in 1962 AFL draft"
    },
    "Miami Dolphins": {
        picks: 1,
        years: [2008],
        notes: "Also had first selection in 1966 AFL draft"
    },
    "Kansas City Chiefs": {
        picks: 1,
        years: [2013],
        notes: "Also had first selection in 1963 AFL draft"
    },
    // Teams with 0 first overall picks
    "Baltimore Ravens": {
        picks: 0,
        years: [],
        notes: "Established 1996"
    },
    "Denver Broncos": {
        picks: 0,
        years: [],
        notes: ""
    },
    "Seattle Seahawks": {
        picks: 0,
        years: [],
        notes: ""
    }
};

console.log('🏈 NFL First Overall Draft Picks Analysis');
console.log('=========================================');

// Create metrics for integration
const nflDraftMetrics = {};
Object.keys(nflDraftPicksData).forEach(teamName => {
    const data = nflDraftPicksData[teamName];
    nflDraftMetrics[teamName] = {
        first_overall_picks: data.picks
    };
});

console.log('\n📊 MOST FIRST OVERALL PICKS:');
const sortedTeams = Object.entries(nflDraftPicksData)
    .sort((a, b) => b[1].picks - a[1].picks);

sortedTeams.slice(0, 10).forEach((entry, i) => {
    const [team, data] = entry;
    const yearsStr = data.years.length > 0 ? ` (${data.years.slice(-3).join(', ')}${data.years.length > 3 ? '...' : ''})` : '';
    console.log(`${i+1}. ${team}: ${data.picks} picks${yearsStr}`);
});

console.log('\n🏆 TEAMS WITH 0 FIRST OVERALL PICKS:');
sortedTeams.filter(([team, data]) => data.picks === 0).forEach(([team, data]) => {
    console.log(`   ${team}`);
});

console.log('\n📈 DRAFT PICK DISTRIBUTION:');
const pickCounts = {};
sortedTeams.forEach(([team, data]) => {
    const count = data.picks;
    if (!pickCounts[count]) pickCounts[count] = [];
    pickCounts[count].push(team);
});

Object.keys(pickCounts).sort((a, b) => b - a).forEach(count => {
    console.log(`${count} picks: ${pickCounts[count].length} teams`);
});

console.log('\n🗓️ RECENT FIRST OVERALL PICKS (2020+):');
sortedTeams.forEach(([team, data]) => {
    const recentPicks = data.years.filter(year => year >= 2020);
    if (recentPicks.length > 0) {
        console.log(`   ${team}: ${recentPicks.join(', ')}`);
    }
});

// Show teams that need to be matched to data.js names
console.log('\n⚠️ TEAM NAME MAPPING NEEDED:');
console.log('Data uses these names, need to match to data.js team names:');
Object.keys(nflDraftPicksData).forEach(team => {
    console.log(`   "${team}"`);
});

// Save metrics for integration
fs.writeFileSync('nfl-draft-picks-metrics.json', JSON.stringify(nflDraftMetrics, null, 2));
console.log('\n✅ NFL draft picks metrics saved to nfl-draft-picks-metrics.json');
console.log('📝 Next step: Update NFL teams in data.js with first_overall_picks field');
console.log('📊 Challenge: "Most First Overall Draft Picks?" - rank highest to lowest');