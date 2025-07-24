// Parse NHL First Overall Draft Picks Data
const fs = require('fs');

// NHL Teams First Overall Draft Picks Data (using data from trades/awards table)
const nhlDraftPicksData = {
    // Teams with picks (including trades)
    "Buffalo Sabres": {
        picks: 4,
        lastPick: 2021,
        notes: "4 picks awarded/made"
    },
    "Colorado Avalanche": {
        picks: 4,
        lastPick: 2013,
        notes: "Formerly Quebec Nordiques"
    },
    "Edmonton Oilers": {
        picks: 4,
        lastPick: 2015,
        notes: "4 picks awarded 2010-2015, 3 consecutive (2010,2011,2012)"
    },
    "Montreal Canadiens": {
        picks: 6,  // 4 awarded + 2 acquired
        lastPick: 2022,
        notes: "4 awarded + acquired from Devils/Rockies (1980) + Golden Seals (1971)"
    },
    "Florida Panthers": {
        picks: 2,  // 5 awarded - 3 traded away
        lastPick: 2014,
        notes: "5 awarded but traded 3 away (2002 to Blue Jackets, 2003 to Penguins, 1998 to Lightning)"
    },
    "New Jersey Devils": {
        picks: 3,  // 5 awarded - 2 traded away
        lastPick: 2019,
        notes: "Formerly Kansas City Scouts/Colorado Rockies, traded 2 picks away"
    },
    "New York Islanders": {
        picks: 5,
        lastPick: 2025,
        notes: "5 picks"
    },
    "Ottawa Senators": {
        picks: 3,
        lastPick: 1996,
        notes: "3 picks"
    },
    "Pittsburgh Penguins": {
        picks: 3,  // 3 awarded + 1 acquired - 1 traded
        lastPick: 2005,
        notes: "Acquired from Panthers (2003), traded to Stars/North Stars (1983)"
    },
    "Tampa Bay Lightning": {
        picks: 3,  // 4 awarded - 1 traded
        lastPick: 2008,
        notes: "4 awarded, traded 1 to Jets/Thrashers (1999)"
    },
    "Washington Capitals": {
        picks: 3,  // 4 awarded - 1 traded
        lastPick: 2004,
        notes: "4 awarded, traded 1 to Flyers (1975)"
    },
    "Detroit Red Wings": {
        picks: 3,
        lastPick: 1986,
        notes: "3 picks"
    },
    "Dallas Stars": {
        picks: 3,  // 2 awarded + 1 acquired
        lastPick: 1988,
        notes: "Formerly Minnesota North Stars, acquired from Penguins (1983)"
    },
    "Toronto Maple Leafs": {
        picks: 2,
        lastPick: 2016,
        notes: "2 picks"
    },
    "Chicago Blackhawks": {
        picks: 2,
        lastPick: 2023,
        notes: "2 picks"
    },
    "Boston Bruins": {
        picks: 3,  // 2 awarded + 1 acquired
        lastPick: 1997,
        notes: "2 awarded + acquired from Devils/Rockies (1982)"
    },
    "New York Rangers": {
        picks: 2,
        lastPick: 2020,
        notes: "Held #1 pick in 2020 despite playoffs due to COVID-19 format change"
    },
    "Arizona Coyotes": {
        picks: 1,
        lastPick: 1981,
        notes: "Formerly Winnipeg Jets, team inactive"
    },
    "Los Angeles Kings": {
        picks: 1,
        lastPick: 1967,
        notes: "1 pick"
    },
    "San Jose Sharks": {
        picks: 1,
        lastPick: 2024,
        notes: "1 pick"
    },
    "St. Louis Blues": {
        picks: 1,
        lastPick: 2006,
        notes: "1 pick"
    },
    "Winnipeg Jets": {
        picks: 2,  // 1 awarded + 1 acquired
        lastPick: 2001,
        notes: "Formerly Atlanta Thrashers, acquired from Lightning (1999)"
    },
    "Columbus Blue Jackets": {
        picks: 1,  // 0 awarded + 1 acquired
        lastPick: 2002,
        notes: "0 awarded, acquired from Panthers (2002)"
    },
    "Philadelphia Flyers": {
        picks: 1,  // 0 awarded + 1 acquired
        lastPick: 1975,
        notes: "0 awarded, acquired from Capitals (1975)"
    },
    
    // Teams with 0 first overall picks
    "Anaheim Ducks": {
        picks: 0,
        lastPick: null,
        notes: "No first overall picks"
    },
    "Calgary Flames": {
        picks: 0,
        lastPick: null,
        notes: "Formerly Atlanta Flames, no first overall picks"
    },
    "Carolina Hurricanes": {
        picks: 0,
        lastPick: null,
        notes: "No first overall picks"
    },
    "Minnesota Wild": {
        picks: 0,
        lastPick: null,
        notes: "No first overall picks"
    },
    "Nashville Predators": {
        picks: 0,
        lastPick: null,
        notes: "No first overall picks"
    },
    "Seattle Kraken": {
        picks: 0,
        lastPick: null,
        notes: "No first overall picks"
    },
    "Utah Hockey Club": {  // Updated name from Utah Mammoth
        picks: 0,
        lastPick: null,
        notes: "No first overall picks"
    },
    "Vancouver Canucks": {
        picks: 0,
        lastPick: null,
        notes: "No first overall picks"
    },
    "Vegas Golden Knights": {
        picks: 0,
        lastPick: null,
        notes: "No first overall picks"
    }
};

console.log('🏒 NHL First Overall Draft Picks Analysis');
console.log('=========================================');

// Create metrics for integration
const nhlDraftMetrics = {};
Object.keys(nhlDraftPicksData).forEach(teamName => {
    const data = nhlDraftPicksData[teamName];
    nhlDraftMetrics[teamName] = {
        nhl_first_overall_picks: data.picks
    };
});

console.log('\n📊 MOST FIRST OVERALL PICKS (NHL):');
const sortedTeams = Object.entries(nhlDraftPicksData)
    .sort((a, b) => b[1].picks - a[1].picks);

sortedTeams.slice(0, 10).forEach((entry, i) => {
    const [team, data] = entry;
    const lastPick = data.lastPick ? ` (last: ${data.lastPick})` : '';
    console.log(`${i+1}. ${team}: ${data.picks} picks${lastPick}`);
});

console.log('\n🏆 TEAMS WITH 0 FIRST OVERALL PICKS (NHL):');
sortedTeams.filter(([team, data]) => data.picks === 0).forEach(([team, data]) => {
    console.log(`   ${team}`);
});

console.log('\n📈 NHL DRAFT PICK DISTRIBUTION:');
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
    if (data.lastPick && data.lastPick >= 2020) {
        console.log(`   ${team}: ${data.lastPick}`);
    }
});

console.log('\n📋 SPECIAL CASES:');
console.log('   🔄 Trades: Panthers (5 awarded, 2 kept), Devils (5 awarded, 3 kept)');
console.log('   🏒 Franchise moves: Coyotes (ex-Jets), Stars (ex-North Stars), etc.');
console.log('   😷 COVID-19: Rangers got #1 pick in 2020 despite making playoffs');

// Show teams that need to be matched to data.js names
console.log('\n⚠️ TEAM NAME MAPPING NEEDED:');
console.log('Data uses these names, need to match to data.js team names:');
Object.keys(nhlDraftPicksData).forEach(team => {
    console.log(`   "${team}"`);
});

// Save metrics for integration
fs.writeFileSync('nhl-draft-picks-metrics.json', JSON.stringify(nhlDraftMetrics, null, 2));
console.log('\n✅ NHL draft picks metrics saved to nhl-draft-picks-metrics.json');
console.log('📝 Next step: Update NHL teams in data.js with nhl_first_overall_picks field');
console.log('📊 Challenge: "Most First Overall Draft Picks (NHL)?" - rank highest to lowest');