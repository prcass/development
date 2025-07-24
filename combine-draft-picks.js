// Combine NFL and NHL First Overall Draft Picks into unified challenge
const fs = require('fs');

// Combined First Overall Draft Picks by team (both NFL and NHL)
const combinedDraftPicks = {
    // NFL Teams (from previous data)
    "Indianapolis Colts": 7,
    "Los Angeles Rams": 7,
    "Tampa Bay Buccaneers": 5,
    "Cleveland Browns": 5,
    "Arizona Cardinals": 5,
    "Detroit Lions": 4,
    "Atlanta Falcons": 4,
    "Buffalo Bills": 4,
    "Cincinnati Bengals": 4,
    "New England Patriots": 4,
    "Philadelphia Eagles": 3,
    "Chicago Bears": 3,
    "Pittsburgh Steelers": 3,
    "San Francisco 49ers": 3,
    "Dallas Cowboys": 3,
    "Houston Texans": 3,
    "Tennessee Titans": 3,
    "Washington Commanders": 2,
    "New York Giants": 2,
    "Green Bay Packers": 2,
    "Minnesota Vikings": 2,
    "Carolina Panthers": 2,
    "Jacksonville Jaguars": 2,
    "New Orleans Saints": 1,
    "New York Jets": 1,
    "Los Angeles Chargers": 1,
    "Las Vegas Raiders": 1,
    "Miami Dolphins": 1,
    "Kansas City Chiefs": 1,
    "Baltimore Ravens": 0,
    "Denver Broncos": 0,
    "Seattle Seahawks": 0,
    
    // NHL Teams (including trades and franchise moves)
    "Montreal Canadiens": 6,
    "New York Islanders": 5,
    "Buffalo Sabres": 4,
    "Colorado Avalanche": 4,
    "Edmonton Oilers": 4,
    "Boston Bruins": 3,
    "New Jersey Devils": 3,
    "Ottawa Senators": 3,
    "Pittsburgh Penguins": 3,
    "Tampa Bay Lightning": 3,
    "Washington Capitals": 3,
    "Detroit Red Wings": 3,
    "Dallas Stars": 3,
    "Toronto Maple Leafs": 2,
    "Chicago Blackhawks": 2,
    "New York Rangers": 2,
    "Florida Panthers": 2,
    "Winnipeg Jets": 2,
    "Arizona Coyotes": 1,
    "Los Angeles Kings": 1,
    "San Jose Sharks": 1,
    "St. Louis Blues": 1,
    "Columbus Blue Jackets": 1,
    "Philadelphia Flyers": 1,
    "Anaheim Ducks": 0,
    "Calgary Flames": 0,
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

console.log('🏈🏒 Combining NFL and NHL First Overall Draft Picks...');
console.log('📊 Creating unified challenge for all 124 sports teams');

let updatedCount = 0;
Object.values(gameData.categories.sports.items).forEach(team => {
    if (combinedDraftPicks.hasOwnProperty(team.name)) {
        // Remove old separate fields if they exist
        delete team.first_overall_picks;
        delete team.nhl_first_overall_picks;
        
        // Add unified field
        team.draft_picks_first_overall = combinedDraftPicks[team.name];
        updatedCount++;
        
        const league = team.league;
        console.log(`✅ ${team.name} (${league}): ${combinedDraftPicks[team.name]} first overall picks`);
    }
});

// Update the challenge in sports prompts - replace both NFL and NHL specific ones
const prompts = gameData.categories.sports.prompts;

// Remove old challenges
const nflIndex = prompts.findIndex(p => p.challenge === 'first_overall_picks');
const nhlIndex = prompts.findIndex(p => p.challenge === 'nhl_first_overall_picks');

if (nflIndex !== -1) {
    prompts.splice(nflIndex, 1);
    console.log('🗑️ Removed old NFL-specific draft picks challenge');
}
if (nhlIndex !== -1) {
    prompts.splice(nhlIndex, 1);
    console.log('🗑️ Removed old NHL-specific draft picks challenge');
}

// Add unified challenge
const unifiedChallenge = {
    "challenge": "draft_picks_first_overall",
    "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Most First Overall Draft Picks?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>NFL & NHL Draft History</div><div style='font-size: 0.85em; color: #666'>(Includes trades & franchise moves)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
};

prompts.push(unifiedChallenge);
console.log('✅ Added unified "First Overall Draft Picks" challenge');

console.log(`\n✅ Updated ${updatedCount} teams with unified draft pick data`);

// Write updated data.js
const newContent = `/**
 * Outrank Game Data - v4.5 Unified Draft Picks Challenge
 * Updated: ${new Date().toISOString()}
 * Combined NFL and NHL First Overall Draft Picks into single challenge
 * Works across both leagues with unified field: draft_picks_first_overall
 * Includes trades, acquisitions, and franchise history for both leagues
 * All 124 teams across 4 leagues with complete data
 * Countries: 40, Movies: 40, Sports: 124, Companies: 40
 * Total Categories: 4, Sports Challenges: 19 (unified draft picks)
 */

window.GAME_DATA = ${JSON.stringify(gameData, null, 4)};

// Console output for verification
console.log('✅ Outrank v4.5 Unified Draft Picks - Game data loaded with 4 categories');
console.log('🌍 Countries:', Object.keys(window.GAME_DATA.categories.countries.items).length, 'countries with', window.GAME_DATA.categories.countries.prompts.length, 'challenges');
console.log('🎬 Movies:', Object.keys(window.GAME_DATA.categories.movies.items).length, 'movies with', window.GAME_DATA.categories.movies.prompts.length, 'challenges');
console.log('🏢 Companies:', Object.keys(window.GAME_DATA.categories.companies.items).length, 'companies with', window.GAME_DATA.categories.companies.prompts.length, 'challenges');
console.log('🏈 Sports:', Object.keys(window.GAME_DATA.categories.sports.items).length, 'teams with', window.GAME_DATA.categories.sports.prompts.length, 'challenges (19 total, unified draft picks)');
console.log('📊 Total items:', Object.keys(window.GAME_DATA.categories.countries.items).length + Object.keys(window.GAME_DATA.categories.movies.items).length + Object.keys(window.GAME_DATA.categories.companies.items).length + Object.keys(window.GAME_DATA.categories.sports.items).length);
console.log('🎯 Total challenges:', window.GAME_DATA.categories.countries.prompts.length + window.GAME_DATA.categories.movies.prompts.length + window.GAME_DATA.categories.companies.prompts.length + window.GAME_DATA.categories.sports.prompts.length);`;

fs.writeFileSync('data.js', newContent);

// Show combined rankings
console.log('\n🏆 UNIFIED FIRST OVERALL DRAFT PICKS LEADERS:');
console.log('=============================================');

console.log('\n💰 MOST FIRST OVERALL PICKS (ALL LEAGUES):');
const allTeams = Object.entries(combinedDraftPicks)
    .sort((a, b) => b[1] - a[1]);

allTeams.slice(0, 15).forEach((entry, i) => {
    const [team, picks] = entry;
    // Find league for each team
    const teamObj = Object.values(gameData.categories.sports.items).find(t => t.name === team);
    const league = teamObj ? teamObj.league : '?';
    console.log(`${i+1}. ${team} (${league}): ${picks} picks`);
});

console.log('\n🏆 TEAMS WITH ZERO FIRST OVERALL PICKS:');
const zeroPickTeams = allTeams.filter(([team, picks]) => picks === 0);
console.log(`📊 ${zeroPickTeams.length} teams have never had a first overall pick:`);
zeroPickTeams.forEach(([team, picks]) => {
    const teamObj = Object.values(gameData.categories.sports.items).find(t => t.name === team);
    const league = teamObj ? teamObj.league : '?';
    console.log(`   ${team} (${league})`);
});

console.log('\n📊 CROSS-LEAGUE DRAFT PICK DISTRIBUTION:');
const distribution = {};
allTeams.forEach(([team, picks]) => {
    if (!distribution[picks]) distribution[picks] = 0;
    distribution[picks]++;
});

Object.keys(distribution).sort((a, b) => b - a).forEach(picks => {
    console.log(`${picks} picks: ${distribution[picks]} teams`);
});

console.log('\n🏒 NHL LEADERS:');
allTeams.filter(([team]) => {
    const teamObj = Object.values(gameData.categories.sports.items).find(t => t.name === team);
    return teamObj && teamObj.league === 'NHL';
}).slice(0, 5).forEach(([team, picks], i) => {
    console.log(`${i+1}. ${team}: ${picks} picks`);
});

console.log('\n🏈 NFL LEADERS:');
allTeams.filter(([team]) => {
    const teamObj = Object.values(gameData.categories.sports.items).find(t => t.name === team);
    return teamObj && teamObj.league === 'NFL';
}).slice(0, 5).forEach(([team, picks], i) => {
    console.log(`${i+1}. ${team}: ${picks} picks`);
});

console.log(`\n📊 Total teams updated: ${updatedCount}/124`);
console.log('📈 Unified challenge: "Most First Overall Draft Picks?" (NFL & NHL combined)');
console.log('🎯 Single challenge works across both leagues!');

// Verify the new file
try {
    const testWindow = {};
    eval(fs.readFileSync('data.js', 'utf8'));
    console.log('\n✅ Syntax validation passed!');
    console.log(`✅ Total sports challenges: ${testWindow.GAME_DATA.categories.sports.prompts.length}`);
} catch (error) {
    console.error('\n❌ Syntax error in generated file:', error.message);
}