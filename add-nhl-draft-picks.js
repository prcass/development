// Add NHL First Overall Draft Picks to all teams
const fs = require('fs');

// NHL First Overall Draft Picks by team (using exact data.js names, including trades)
const nhlDraftPicks = {
    "Montreal Canadiens": 6,     // 4 awarded + 2 acquired (Devils/Rockies 1980 + Golden Seals 1971)
    "New York Islanders": 5,
    "Buffalo Sabres": 4,
    "Colorado Avalanche": 4,     // Formerly Quebec Nordiques
    "Edmonton Oilers": 4,        // 4 picks 2010-2015, 3 consecutive
    "Boston Bruins": 3,          // 2 awarded + 1 acquired (Devils/Rockies 1982)
    "New Jersey Devils": 3,      // 5 awarded - 2 traded (Formerly KC Scouts/Colorado Rockies)
    "Ottawa Senators": 3,
    "Pittsburgh Penguins": 3,    // 3 awarded + 1 acquired (Panthers 2003) - 1 traded (Stars 1983)
    "Tampa Bay Lightning": 3,    // 4 awarded - 1 traded (Jets/Thrashers 1999)
    "Washington Capitals": 3,    // 4 awarded - 1 traded (Flyers 1975)
    "Detroit Red Wings": 3,
    "Dallas Stars": 3,           // 2 awarded + 1 acquired (Penguins 1983), formerly Minnesota North Stars
    "Toronto Maple Leafs": 2,
    "Chicago Blackhawks": 2,
    "New York Rangers": 2,       // Including 2020 pick despite playoffs (COVID-19)
    "Florida Panthers": 2,       // 5 awarded - 3 traded (Blue Jackets 2002, Penguins 2003, Lightning 1998)
    "Winnipeg Jets": 2,          // 1 awarded + 1 acquired (Lightning 1999), formerly Atlanta Thrashers
    "Arizona Coyotes": 1,        // Formerly Winnipeg Jets (team inactive)
    "Los Angeles Kings": 1,
    "San Jose Sharks": 1,
    "St. Louis Blues": 1,
    "Columbus Blue Jackets": 1,  // 0 awarded + 1 acquired (Panthers 2002)
    "Philadelphia Flyers": 1,    // 0 awarded + 1 acquired (Capitals 1975)
    
    // Teams with 0 first overall picks
    "Anaheim Ducks": 0,
    "Calgary Flames": 0,         // Formerly Atlanta Flames
    "Carolina Hurricanes": 0,
    "Minnesota Wild": 0,
    "Nashville Predators": 0,
    "Seattle Kraken": 0,
    "Utah Hockey Club": 0,
    "Vancouver Canucks": 0,
    "Vegas Golden Knights": 0
};

// Load current data.js
const window = {};
eval(fs.readFileSync('data.js', 'utf8'));
const gameData = window.GAME_DATA;

console.log('🏒 Adding NHL First Overall Draft Picks data...');
console.log('📊 Updating all 32 NHL teams (includes trades and franchise moves)');

let updatedCount = 0;
Object.values(gameData.categories.sports.items).forEach(team => {
    if (team.league === 'NHL' && nhlDraftPicks.hasOwnProperty(team.name)) {
        team.nhl_first_overall_picks = nhlDraftPicks[team.name];
        updatedCount++;
        console.log(`✅ ${team.name}: ${nhlDraftPicks[team.name]} first overall picks`);
    }
});

// Add the new challenge to sports prompts
const prompts = gameData.categories.sports.prompts;
const newChallenge = {
    "challenge": "nhl_first_overall_picks",
    "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Most First Overall Picks (NHL)?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>NHL Draft History</div><div style='font-size: 0.85em; color: #666'>(Includes trades & franchise moves)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
};

// Add to prompts if not already present
const existingIndex = prompts.findIndex(p => p.challenge === 'nhl_first_overall_picks');
if (existingIndex === -1) {
    prompts.push(newChallenge);
    console.log('\n✅ Added "NHL First Overall Draft Picks" challenge to sports prompts');
} else {
    prompts[existingIndex] = newChallenge;
    console.log('\n✅ Updated existing "NHL First Overall Draft Picks" challenge');
}

console.log(`\n✅ Updated ${updatedCount} NHL teams with draft pick data`);

// Write updated data.js
const newContent = `/**
 * Outrank Game Data - v4.5 NHL Draft Picks Added
 * Updated: ${new Date().toISOString()}
 * Added NHL First Overall Draft Picks challenge for all 32 teams
 * Includes trades, acquisitions, and franchise history
 * Both NFL and NHL draft pick challenges now available
 * All 124 teams across 4 leagues with complete data
 * Countries: 40, Movies: 40, Sports: 124, Companies: 40
 * Total Categories: 4, Sports Challenges: 20 (added NHL draft picks)
 */

window.GAME_DATA = ${JSON.stringify(gameData, null, 4)};

// Console output for verification
console.log('✅ Outrank v4.5 NHL Draft Picks - Game data loaded with 4 categories');
console.log('🌍 Countries:', Object.keys(window.GAME_DATA.categories.countries.items).length, 'countries with', window.GAME_DATA.categories.countries.prompts.length, 'challenges');
console.log('🎬 Movies:', Object.keys(window.GAME_DATA.categories.movies.items).length, 'movies with', window.GAME_DATA.categories.movies.prompts.length, 'challenges');
console.log('🏢 Companies:', Object.keys(window.GAME_DATA.categories.companies.items).length, 'companies with', window.GAME_DATA.categories.companies.prompts.length, 'challenges');
console.log('🏈 Sports:', Object.keys(window.GAME_DATA.categories.sports.items).length, 'teams with', window.GAME_DATA.categories.sports.prompts.length, 'challenges (20 total, NFL + NHL draft picks)');
console.log('📊 Total items:', Object.keys(window.GAME_DATA.categories.countries.items).length + Object.keys(window.GAME_DATA.categories.movies.items).length + Object.keys(window.GAME_DATA.categories.companies.items).length + Object.keys(window.GAME_DATA.categories.sports.items).length);
console.log('🎯 Total challenges:', window.GAME_DATA.categories.countries.prompts.length + window.GAME_DATA.categories.movies.prompts.length + window.GAME_DATA.categories.companies.prompts.length + window.GAME_DATA.categories.sports.prompts.length);`;

fs.writeFileSync('data.js', newContent);

// Show draft pick rankings
console.log('\n🏆 NHL FIRST OVERALL DRAFT PICKS LEADERS:');
console.log('==========================================');

console.log('\n💰 MOST FIRST OVERALL PICKS (NHL):');
const nhlTeams = Object.entries(nhlDraftPicks)
    .sort((a, b) => b[1] - a[1]);

nhlTeams.slice(0, 10).forEach((entry, i) => {
    const [team, picks] = entry;
    console.log(`${i+1}. ${team}: ${picks} picks`);
});

console.log('\n🏆 TEAMS WITH ZERO FIRST OVERALL PICKS (NHL):');
nhlTeams.filter(([team, picks]) => picks === 0).forEach(([team, picks]) => {
    console.log(`   ${team}: ${picks} picks`);
});

console.log('\n📊 NHL DRAFT PICK DISTRIBUTION:');
const distribution = {};
nhlTeams.forEach(([team, picks]) => {
    if (!distribution[picks]) distribution[picks] = 0;
    distribution[picks]++;
});

Object.keys(distribution).sort((a, b) => b - a).forEach(picks => {
    console.log(`${picks} picks: ${distribution[picks]} teams`);
});

console.log('\n🔄 TRADE HIGHLIGHTS:');
console.log('   📈 Acquired extra picks: Canadiens (+2), Bruins (+1), Penguins (+1), etc.');
console.log('   📉 Traded picks away: Panthers (-3), Devils (-2), Lightning (-1), etc.');
console.log('   🏒 Franchise moves: Coyotes (ex-Jets), Stars (ex-North Stars)');

console.log(`\n📊 Total NHL teams updated: ${updatedCount}/32`);
console.log('📈 New challenge added: "Most First Overall Draft Picks (NHL)?"');
console.log('🏈🏒 Both NFL and NHL draft challenges now available!');

// Verify the new file
try {
    const testWindow = {};
    eval(fs.readFileSync('data.js', 'utf8'));
    console.log('\n✅ Syntax validation passed!');
    console.log(`✅ Total sports challenges: ${testWindow.GAME_DATA.categories.sports.prompts.length}`);
} catch (error) {
    console.error('\n❌ Syntax error in generated file:', error.message);
}