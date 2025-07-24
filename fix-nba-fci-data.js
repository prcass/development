// Fix NBA FCI data - remove calculated values since we don't have complete Team Marketing Report data
const fs = require('fs');

// Load current data.js
const window = {};
eval(fs.readFileSync('data.js', 'utf8'));
const gameData = window.GAME_DATA;

console.log('🔧 Fixing NBA Fan Cost Index data...');
console.log('❌ Removing calculated FCI for NBA teams (incomplete data vs official methodology)');

let nbaFixedCount = 0;
Object.values(gameData.categories.sports.items).forEach(team => {
    if (team.league === 'NBA') {
        // Keep the data we have, but remove the calculated FCI
        team.fan_cost_index = 0; // Set to 0 to indicate missing/incomplete data
        nbaFixedCount++;
    }
});

console.log(`✅ Fixed ${nbaFixedCount} NBA teams - removed calculated FCI values`);

// Write updated data.js
const newContent = `/**
 * Outrank Game Data - v4.1 Fixed NBA FCI Data
 * Updated: ${new Date().toISOString()}
 * NFL, NHL, MLB have complete Team Marketing Report 2023 data with official FCI
 * NBA has partial fan cost data (tickets, beer, hot dogs, parking) but NO FCI
 * Missing NBA data: soft drinks, game programs, caps (required for official FCI)
 * Countries: 40, Movies: 40, Sports: 124, Companies: 40
 * Total Categories: 4, Sports Challenges: 18 (4 fan cost challenges with mixed completeness)
 */

window.GAME_DATA = ${JSON.stringify(gameData, null, 4)};

// Console output for verification
console.log('✅ Outrank v4.1 Fixed NBA FCI Data - Game data loaded with 4 categories');
console.log('🌍 Countries:', Object.keys(window.GAME_DATA.categories.countries.items).length, 'countries with', window.GAME_DATA.categories.countries.prompts.length, 'challenges');
console.log('🎬 Movies:', Object.keys(window.GAME_DATA.categories.movies.items).length, 'movies with', window.GAME_DATA.categories.movies.prompts.length, 'challenges');
console.log('🏢 Companies:', Object.keys(window.GAME_DATA.categories.companies.items).length, 'companies with', window.GAME_DATA.categories.companies.prompts.length, 'challenges');
console.log('🏈 Sports:', Object.keys(window.GAME_DATA.categories.sports.items).length, 'teams with', window.GAME_DATA.categories.sports.prompts.length, 'challenges (18 total, mixed completeness)');
console.log('📊 Total items:', Object.keys(window.GAME_DATA.categories.countries.items).length + Object.keys(window.GAME_DATA.categories.movies.items).length + Object.keys(window.GAME_DATA.categories.companies.items).length + Object.keys(window.GAME_DATA.categories.sports.items).length);
console.log('🎯 Total challenges:', window.GAME_DATA.categories.countries.prompts.length + window.GAME_DATA.categories.movies.prompts.length + window.GAME_DATA.categories.companies.prompts.length + window.GAME_DATA.categories.sports.prompts.length);`;

fs.writeFileSync('data.js', newContent);

// Show corrected status
console.log('\n📊 CORRECTED FAN COST DATA STATUS:');
console.log('==================================');
console.log('✅ COMPLETE (Team Marketing Report 2023):');
console.log('   🏈 NFL: 32 teams - Full FCI data');
console.log('   🏒 NHL: 32 teams - Full FCI data'); 
console.log('   ⚾ MLB: 30 teams - Full FCI data');
console.log('');
console.log('⚠️  PARTIAL (Mixed Sources):');
console.log('   🏀 NBA: 30 teams - Tickets✅ Beer✅ Hot Dogs✅ Parking✅');
console.log('   🏀 NBA Missing: Soft drinks❌ Programs❌ Caps❌ = No Official FCI');
console.log('');
console.log('🏆 OFFICIAL FCI CHAMPIONS (94 teams):');
console.log('💰 Most Expensive: Las Vegas Raiders (NFL) - $801.20 FCI');
console.log('💚 Most Affordable: Arizona Diamondbacks (MLB) - $170.09 FCI');
console.log('');
console.log('🏀 NBA TICKET PRICE LEADERS (separate ranking):');
console.log('💰 Most Expensive: Golden State Warriors - $215.00/game');
console.log('💚 Most Affordable: Oklahoma City Thunder - $35.00/game');

// Verify the new file
try {
    const testWindow = {};
    eval(fs.readFileSync('data.js', 'utf8'));
    console.log('\n✅ Syntax validation passed!');
} catch (error) {
    console.error('\n❌ Syntax error in generated file:', error.message);
}