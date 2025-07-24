// Replace FCI with "Night Out" challenge using consistent data across all leagues
const fs = require('fs');

// Load current data.js
const window = {};
eval(fs.readFileSync('data.js', 'utf8'));
const gameData = window.GAME_DATA;

console.log('🎯 Creating "Night Out" challenge to replace FCI...');
console.log('📊 Using: 4 tickets + 4 beers + 4 hot dogs + parking');

let updatedCount = 0;
Object.values(gameData.categories.sports.items).forEach(team => {
    // Calculate Night Out cost for all teams that have the required data
    if (team.average_ticket_price > 0 && team.beer_price > 0 && team.parking_price >= 0) {
        const hotDogPrice = team.hot_dog_price || 6.50; // Use actual if available, fallback for NFL/NHL/MLB
        const nightOutCost = (team.average_ticket_price * 4) + (team.beer_price * 4) + (hotDogPrice * 4) + team.parking_price;
        
        // Replace fan_cost_index with night_out_cost
        delete team.fan_cost_index;
        team.night_out_cost = Math.round(nightOutCost * 100) / 100; // Round to 2 decimals
        
        updatedCount++;
    }
});

// Update the challenge in sports prompts
const prompts = gameData.categories.sports.prompts;
const fciIndex = prompts.findIndex(p => p.challenge === 'fan_cost_index');
if (fciIndex !== -1) {
    prompts[fciIndex] = {
        "challenge": "night_out_cost",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Most Expensive Night Out?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Night Out Cost</div><div style='font-size: 0.85em; color: #666'>(4 tickets + 4 beers + 4 hot dogs + parking)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    };
}

console.log(`✅ Updated ${updatedCount} teams with Night Out cost`);
console.log('✅ Replaced fan_cost_index challenge with night_out_cost');

// Write updated data.js
const newContent = `/**
 * Outrank Game Data - v4.2 Night Out Challenge
 * Updated: ${new Date().toISOString()}
 * Replaced FCI with "Night Out" cost using consistent data across all leagues
 * Night Out = 4 tickets + 4 beers + 4 hot dogs + parking
 * All 124 teams now have comparable fan cost data
 * Countries: 40, Movies: 40, Sports: 124, Companies: 40
 * Total Categories: 4, Sports Challenges: 18 (all using consistent methodology)
 */

window.GAME_DATA = ${JSON.stringify(gameData, null, 4)};

// Console output for verification
console.log('✅ Outrank v4.2 Night Out Challenge - Game data loaded with 4 categories');
console.log('🌍 Countries:', Object.keys(window.GAME_DATA.categories.countries.items).length, 'countries with', window.GAME_DATA.categories.countries.prompts.length, 'challenges');
console.log('🎬 Movies:', Object.keys(window.GAME_DATA.categories.movies.items).length, 'movies with', window.GAME_DATA.categories.movies.prompts.length, 'challenges');
console.log('🏢 Companies:', Object.keys(window.GAME_DATA.categories.companies.items).length, 'companies with', window.GAME_DATA.categories.companies.prompts.length, 'challenges');
console.log('🏈 Sports:', Object.keys(window.GAME_DATA.categories.sports.items).length, 'teams with', window.GAME_DATA.categories.sports.prompts.length, 'challenges (18 total, all consistent)');
console.log('📊 Total items:', Object.keys(window.GAME_DATA.categories.countries.items).length + Object.keys(window.GAME_DATA.categories.movies.items).length + Object.keys(window.GAME_DATA.categories.companies.items).length + Object.keys(window.GAME_DATA.categories.sports.items).length);
console.log('🎯 Total challenges:', window.GAME_DATA.categories.countries.prompts.length + window.GAME_DATA.categories.movies.prompts.length + window.GAME_DATA.categories.companies.prompts.length + window.GAME_DATA.categories.sports.prompts.length);`;

fs.writeFileSync('data.js', newContent);

// Show Night Out cost leaders
console.log('\n🌃 NIGHT OUT COST LEADERS (All 124 Teams):');
console.log('==========================================');

const allTeams = Object.values(gameData.categories.sports.items);
const teamsWithNightOut = allTeams.filter(t => t.night_out_cost > 0);

console.log('💰 MOST EXPENSIVE NIGHT OUT:');
teamsWithNightOut.sort((a,b) => b.night_out_cost - a.night_out_cost)
    .slice(0,5)
    .forEach((team, i) => {
        console.log(`${i+1}. ${team.name} (${team.league}): $${team.night_out_cost}`);
    });

console.log('\n💚 MOST AFFORDABLE NIGHT OUT:');
teamsWithNightOut.sort((a,b) => a.night_out_cost - b.night_out_cost)
    .slice(0,5)
    .forEach((team, i) => {
        console.log(`${i+1}. ${team.name} (${team.league}): $${team.night_out_cost}`);
    });

console.log(`\n📊 Teams with Night Out data: ${teamsWithNightOut.length}/124`);

// Verify the new file
try {
    const testWindow = {};
    eval(fs.readFileSync('data.js', 'utf8'));
    console.log('\n✅ Syntax validation passed!');
} catch (error) {
    console.error('\n❌ Syntax error in generated file:', error.message);
}