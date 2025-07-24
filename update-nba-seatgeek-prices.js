// Update NBA teams with SeatGeek pricing data (Oct 18, 2024)
const fs = require('fs');

// SeatGeek NBA ticket prices (Oct 18, 2024)
const seatgeekPrices = {
    "New York Knicks": 186.60,
    "Los Angeles Lakers": 144.73,
    "Golden State Warriors": 131.40,
    "Miami Heat": 125.67,
    "Boston Celtics": 124.03,
    "Phoenix Suns": 118.52,
    "Chicago Bulls": 106.59,
    "Los Angeles Clippers": 103.16,
    "Philadelphia 76ers": 100.36,
    "Brooklyn Nets": 99.19,
    "Milwaukee Bucks": 89.55,
    "Dallas Mavericks": 85.55,
    "Denver Nuggets": 83.84,
    "Cleveland Cavaliers": 79.39,
    "Sacramento Kings": 79.10,
    "Atlanta Hawks": 78.98,
    "Minnesota Timberwolves": 78.05,
    "Toronto Raptors": 76.96,
    "Washington Wizards": 76.49,
    "Utah Jazz": 72.92,
    "New Orleans Pelicans": 72.87,
    "Indiana Pacers": 69.61,
    "San Antonio Spurs": 69.45,
    "Orlando Magic": 68.42,
    "Memphis Grizzlies": 65.91,
    "Houston Rockets": 65.73,
    "Charlotte Hornets": 65.41,
    "Oklahoma City Thunder": 65.18,
    "Detroit Pistons": 64.46,
    "Portland Trail Blazers": 63.30
};

// Load current data.js
const window = {};
eval(fs.readFileSync('data.js', 'utf8'));
const gameData = window.GAME_DATA;

console.log('🏀 Updating NBA teams with SeatGeek pricing data (Oct 18, 2024)...');
console.log('📊 Source: SeatGeek average ticket prices');

let updatedCount = 0;
let priceChanges = [];

Object.values(gameData.categories.sports.items).forEach(team => {
    if (team.league === 'NBA' && seatgeekPrices[team.name]) {
        const oldPrice = team.average_ticket_price;
        const newPrice = seatgeekPrices[team.name];
        
        // Update ticket price
        team.average_ticket_price = newPrice;
        
        // Recalculate Night Out cost: 4 tickets + 4 beers + 4 hot dogs + parking
        const hotDogPrice = team.hot_dog_price || 6.50;
        const nightOutCost = (newPrice * 4) + (team.beer_price * 4) + (hotDogPrice * 4) + team.parking_price;
        const oldNightOut = team.night_out_cost;
        team.night_out_cost = Math.round(nightOutCost * 100) / 100;
        
        priceChanges.push({
            team: team.name,
            oldTicket: oldPrice,
            newTicket: newPrice,
            change: newPrice - oldPrice,
            oldNightOut: oldNightOut,
            newNightOut: team.night_out_cost,
            nightOutChange: team.night_out_cost - oldNightOut
        });
        
        updatedCount++;
        console.log(`✅ ${team.name}: $${oldPrice} → $${newPrice} (${newPrice > oldPrice ? '+' : ''}${(newPrice - oldPrice).toFixed(2)})`);
    }
});

console.log(`\n✅ Updated ${updatedCount} NBA teams with SeatGeek pricing`);

// Write updated data.js
const newContent = `/**
 * Outrank Game Data - v4.3 SeatGeek NBA Price Update
 * Updated: ${new Date().toISOString()}
 * NBA ticket prices updated with SeatGeek data (Oct 18, 2024)
 * Night Out costs recalculated for all NBA teams
 * All 124 teams have current fan cost data
 * Countries: 40, Movies: 40, Sports: 124, Companies: 40
 * Total Categories: 4, Sports Challenges: 18 (all using current pricing)
 */

window.GAME_DATA = ${JSON.stringify(gameData, null, 4)};

// Console output for verification
console.log('✅ Outrank v4.3 SeatGeek Update - Game data loaded with 4 categories');
console.log('🌍 Countries:', Object.keys(window.GAME_DATA.categories.countries.items).length, 'countries with', window.GAME_DATA.categories.countries.prompts.length, 'challenges');
console.log('🎬 Movies:', Object.keys(window.GAME_DATA.categories.movies.items).length, 'movies with', window.GAME_DATA.categories.movies.prompts.length, 'challenges');
console.log('🏢 Companies:', Object.keys(window.GAME_DATA.categories.companies.items).length, 'companies with', window.GAME_DATA.categories.companies.prompts.length, 'challenges');
console.log('🏈 Sports:', Object.keys(window.GAME_DATA.categories.sports.items).length, 'teams with', window.GAME_DATA.categories.sports.prompts.length, 'challenges (18 total, current pricing)');
console.log('📊 Total items:', Object.keys(window.GAME_DATA.categories.countries.items).length + Object.keys(window.GAME_DATA.categories.movies.items).length + Object.keys(window.GAME_DATA.categories.companies.items).length + Object.keys(window.GAME_DATA.categories.sports.items).length);
console.log('🎯 Total challenges:', window.GAME_DATA.categories.countries.prompts.length + window.GAME_DATA.categories.movies.prompts.length + window.GAME_DATA.categories.companies.prompts.length + window.GAME_DATA.categories.sports.prompts.length);`;

fs.writeFileSync('data.js', newContent);

// Show biggest price changes
console.log('\n📈 BIGGEST TICKET PRICE INCREASES:');
priceChanges.sort((a,b) => b.change - a.change)
    .slice(0,5)
    .forEach((change, i) => {
        console.log(`${i+1}. ${change.team}: +$${change.change.toFixed(2)} ($${change.oldTicket} → $${change.newTicket})`);
    });

console.log('\n📉 BIGGEST TICKET PRICE DECREASES:');
priceChanges.sort((a,b) => a.change - b.change)
    .slice(0,5)
    .forEach((change, i) => {
        console.log(`${i+1}. ${change.team}: $${change.change.toFixed(2)} ($${change.oldTicket} → $${change.newTicket})`);
    });

console.log('\n🌃 BIGGEST NIGHT OUT COST CHANGES:');
priceChanges.sort((a,b) => Math.abs(b.nightOutChange) - Math.abs(a.nightOutChange))
    .slice(0,5)
    .forEach((change, i) => {
        const sign = change.nightOutChange > 0 ? '+' : '';
        console.log(`${i+1}. ${change.team}: ${sign}$${change.nightOutChange.toFixed(2)} ($${change.oldNightOut} → $${change.newNightOut})`);
    });

// Show new Night Out rankings
console.log('\n🏆 NEW NIGHT OUT COST LEADERS (Top 10):');
const allTeams = Object.values(gameData.categories.sports.items);
const teamsWithNightOut = allTeams.filter(t => t.night_out_cost > 0);

teamsWithNightOut.sort((a,b) => b.night_out_cost - a.night_out_cost)
    .slice(0,10)
    .forEach((team, i) => {
        console.log(`${i+1}. ${team.name} (${team.league}): $${team.night_out_cost}`);
    });

console.log('\n💚 MOST AFFORDABLE NIGHT OUT (Bottom 5):');
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
    console.log('✅ Data source: SeatGeek (Oct 18, 2024) - Most current NBA pricing available');
} catch (error) {
    console.error('\n❌ Syntax error in generated file:', error.message);
}