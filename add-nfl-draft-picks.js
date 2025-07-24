// Add NFL First Overall Draft Picks to all teams
const fs = require('fs');

// NFL First Overall Draft Picks by team (using exact data.js names)
const nflDraftPicks = {
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
    // Teams with 0 first overall picks
    "Baltimore Ravens": 0,
    "Denver Broncos": 0,
    "Seattle Seahawks": 0
};

// Load current data.js
const window = {};
eval(fs.readFileSync('data.js', 'utf8'));
const gameData = window.GAME_DATA;

console.log('🏈 Adding NFL First Overall Draft Picks data...');
console.log('📊 Updating all 32 NFL teams');

let updatedCount = 0;
Object.values(gameData.categories.sports.items).forEach(team => {
    if (team.league === 'NFL' && nflDraftPicks.hasOwnProperty(team.name)) {
        team.first_overall_picks = nflDraftPicks[team.name];
        updatedCount++;
        console.log(`✅ ${team.name}: ${nflDraftPicks[team.name]} first overall picks`);
    }
});

// Add the new challenge to sports prompts
const prompts = gameData.categories.sports.prompts;
const newChallenge = {
    "challenge": "first_overall_picks",
    "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Most First Overall Draft Picks?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>NFL Draft History</div><div style='font-size: 0.85em; color: #666'>(Number of #1 overall picks since 1936)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
};

// Add to prompts if not already present
const existingIndex = prompts.findIndex(p => p.challenge === 'first_overall_picks');
if (existingIndex === -1) {
    prompts.push(newChallenge);
    console.log('\n✅ Added "First Overall Draft Picks" challenge to sports prompts');
} else {
    prompts[existingIndex] = newChallenge;
    console.log('\n✅ Updated existing "First Overall Draft Picks" challenge');
}

console.log(`\n✅ Updated ${updatedCount} NFL teams with draft pick data`);

// Write updated data.js
const newContent = `/**
 * Outrank Game Data - v4.4 NFL Draft Picks Added
 * Updated: ${new Date().toISOString()}
 * Added NFL First Overall Draft Picks challenge for all 32 teams
 * Data includes franchise history (Baltimore/Indianapolis Colts, etc.)
 * All 124 teams across 4 leagues with complete data
 * Countries: 40, Movies: 40, Sports: 124, Companies: 40
 * Total Categories: 4, Sports Challenges: 19 (added draft picks)
 */

window.GAME_DATA = ${JSON.stringify(gameData, null, 4)};

// Console output for verification
console.log('✅ Outrank v4.4 NFL Draft Picks - Game data loaded with 4 categories');
console.log('🌍 Countries:', Object.keys(window.GAME_DATA.categories.countries.items).length, 'countries with', window.GAME_DATA.categories.countries.prompts.length, 'challenges');
console.log('🎬 Movies:', Object.keys(window.GAME_DATA.categories.movies.items).length, 'movies with', window.GAME_DATA.categories.movies.prompts.length, 'challenges');
console.log('🏢 Companies:', Object.keys(window.GAME_DATA.categories.companies.items).length, 'companies with', window.GAME_DATA.categories.companies.prompts.length, 'challenges');
console.log('🏈 Sports:', Object.keys(window.GAME_DATA.categories.sports.items).length, 'teams with', window.GAME_DATA.categories.sports.prompts.length, 'challenges (19 total, added draft picks)');
console.log('📊 Total items:', Object.keys(window.GAME_DATA.categories.countries.items).length + Object.keys(window.GAME_DATA.categories.movies.items).length + Object.keys(window.GAME_DATA.categories.companies.items).length + Object.keys(window.GAME_DATA.categories.sports.items).length);
console.log('🎯 Total challenges:', window.GAME_DATA.categories.countries.prompts.length + window.GAME_DATA.categories.movies.prompts.length + window.GAME_DATA.categories.companies.prompts.length + window.GAME_DATA.categories.sports.prompts.length);`;

fs.writeFileSync('data.js', newContent);

// Show draft pick rankings
console.log('\n🏆 NFL FIRST OVERALL DRAFT PICKS LEADERS:');
console.log('==========================================');

console.log('\n💰 MOST FIRST OVERALL PICKS:');
const nflTeams = Object.entries(nflDraftPicks)
    .sort((a, b) => b[1] - a[1]);

nflTeams.slice(0, 10).forEach((entry, i) => {
    const [team, picks] = entry;
    console.log(`${i+1}. ${team}: ${picks} picks`);
});

console.log('\n🏆 TEAMS WITH ZERO FIRST OVERALL PICKS:');
nflTeams.filter(([team, picks]) => picks === 0).forEach(([team, picks]) => {
    console.log(`   ${team}: ${picks} picks`);
});

console.log('\n📊 DRAFT PICK DISTRIBUTION:');
const distribution = {};
nflTeams.forEach(([team, picks]) => {
    if (!distribution[picks]) distribution[picks] = 0;
    distribution[picks]++;
});

Object.keys(distribution).sort((a, b) => b - a).forEach(picks => {
    console.log(`${picks} picks: ${distribution[picks]} teams`);
});

console.log(`\n📊 Total NFL teams updated: ${updatedCount}/32`);
console.log('📈 New challenge added: "Most First Overall Draft Picks?"');

// Verify the new file
try {
    const testWindow = {};
    eval(fs.readFileSync('data.js', 'utf8'));
    console.log('\n✅ Syntax validation passed!');
    console.log(`✅ Total sports challenges: ${testWindow.GAME_DATA.categories.sports.prompts.length}`);
} catch (error) {
    console.error('\n❌ Syntax error in generated file:', error.message);
}