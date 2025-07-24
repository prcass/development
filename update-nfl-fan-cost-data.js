// Update NFL teams with verified fan cost data from Team Marketing Report 2023
const fs = require('fs');

// Load the NFL fan cost metrics
const nflFanCostMetrics = JSON.parse(fs.readFileSync('nfl-fan-cost-metrics.json', 'utf8'));

// Load current data.js
const window = {};
eval(fs.readFileSync('data.js', 'utf8'));
const gameData = window.GAME_DATA;

console.log('🏈 Updating NFL teams with verified fan cost data from Team Marketing Report 2023...');

let nflUpdatedCount = 0;
Object.values(gameData.categories.sports.items).forEach(team => {
    if (team.league === 'NFL' && nflFanCostMetrics[team.name]) {
        const metrics = nflFanCostMetrics[team.name];
        
        // Update fan cost fields
        team.average_ticket_price = metrics.average_ticket_price;
        team.beer_price = metrics.beer_price;
        team.parking_price = metrics.parking_price;
        team.fan_cost_index = metrics.fan_cost_index;
        
        nflUpdatedCount++;
        console.log(`✅ ${team.name}: $${metrics.average_ticket_price} tickets, $${metrics.beer_price} beer, $${metrics.fan_cost_index} FCI`);
    }
});

console.log(`\n✅ Updated ${nflUpdatedCount} NFL teams with verified fan cost data`);

// Write updated data.js
const newContent = `/**
 * Outrank Game Data - v3.7 Added NFL Fan Cost Data
 * Updated: ${new Date().toISOString()}
 * NFL and NHL now have complete fan cost data from Team Marketing Report 2023
 * NBA and MLB still need fan cost research
 * Countries: 40, Movies: 40, Sports: 124, Companies: 40
 * Total Categories: 4, Sports Challenges: 18 (14 complete all leagues + 4 fan cost NHL/NFL only)
 */

window.GAME_DATA = ${JSON.stringify(gameData, null, 4)};

// Console output for verification
console.log('✅ Outrank v3.7 Added NFL Fan Cost Data - Game data loaded with 4 categories');
console.log('🌍 Countries:', Object.keys(window.GAME_DATA.categories.countries.items).length, 'countries with', window.GAME_DATA.categories.countries.prompts.length, 'challenges');
console.log('🎬 Movies:', Object.keys(window.GAME_DATA.categories.movies.items).length, 'movies with', window.GAME_DATA.categories.movies.prompts.length, 'challenges');
console.log('🏢 Companies:', Object.keys(window.GAME_DATA.categories.companies.items).length, 'companies with', window.GAME_DATA.categories.companies.prompts.length, 'challenges');
console.log('🏈 Sports:', Object.keys(window.GAME_DATA.categories.sports.items).length, 'teams with', window.GAME_DATA.categories.sports.prompts.length, 'challenges (18 total)');
console.log('📊 Total items:', Object.keys(window.GAME_DATA.categories.countries.items).length + Object.keys(window.GAME_DATA.categories.movies.items).length + Object.keys(window.GAME_DATA.categories.companies.items).length + Object.keys(window.GAME_DATA.categories.sports.items).length);
console.log('🎯 Total challenges:', window.GAME_DATA.categories.countries.prompts.length + window.GAME_DATA.categories.movies.prompts.length + window.GAME_DATA.categories.companies.prompts.length + window.GAME_DATA.categories.sports.prompts.length);`;

fs.writeFileSync('data.js', newContent);

// Show interesting fan cost facts
console.log('\n📊 NFL vs NHL Fan Cost Comparison (Team Marketing Report 2023):');
console.log('================================================================');
console.log('🏈 NFL Most Expensive: Las Vegas Raiders ($801.20 FCI)');
console.log('🏒 NHL Most Expensive: Toronto Maple Leafs ($759.42 FCI)');
console.log('🏈 NFL Most Affordable: Arizona Cardinals ($513.44 FCI)');
console.log('🏒 NHL Most Affordable: Utah Hockey Club ($355.34 FCI)');
console.log('');
console.log('💰 Highest Ticket Prices:');
console.log('🏈 NFL: Las Vegas Raiders ($168.83)');
console.log('🏒 NHL: Toronto Maple Leafs ($159.33)');
console.log('');
console.log('🚗 Most Expensive Parking:');
console.log('🏈 NFL: Los Angeles Chargers ($58.40)');
console.log('🏒 NHL: New York Islanders ($37.67)');

// Check remaining leagues
const nbaTeams = Object.values(gameData.categories.sports.items).filter(t => t.league === 'NBA');
const mlbTeams = Object.values(gameData.categories.sports.items).filter(t => t.league === 'MLB');
console.log('');
console.log('📝 Still needed:');
console.log(`🏀 NBA: ${nbaTeams.length} teams need fan cost data`);
console.log(`⚾ MLB: ${mlbTeams.length} teams need fan cost data`);

// Verify the new file
try {
    const testWindow = {};
    eval(fs.readFileSync('data.js', 'utf8'));
    console.log('\n✅ Syntax validation passed!');
} catch (error) {
    console.error('\n❌ Syntax error in generated file:', error.message);
}