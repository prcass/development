// Find all cities with exactly 1 championship
const fs = require('fs');

// Load current data.js
const window = {};
eval(fs.readFileSync('data.js', 'utf8'));
const gameData = window.GAME_DATA;

console.log('🏆 CITIES WITH EXACTLY 1 CHAMPIONSHIP');
console.log('=====================================\n');

// Group teams by their city championship total
const teamsByTotal = {};
Object.values(gameData.categories.sports.items).forEach(team => {
    const total = team.city_championship_total;
    if (!teamsByTotal[total]) {
        teamsByTotal[total] = [];
    }
    teamsByTotal[total].push(team);
});

// Focus on cities with 1 championship
const citiesWithOne = teamsByTotal[1] || [];

// Group these teams by actual city/metro area
const cityGroups = {};
citiesWithOne.forEach(team => {
    let city;
    
    // Identify city from team name
    if (team.name.includes('Portland')) city = 'Portland';
    else if (team.name.includes('Sacramento')) city = 'Sacramento';
    else if (team.name.includes('Calgary')) city = 'Calgary';
    else if (team.name.includes('Anaheim')) city = 'Anaheim';
    else if (team.name.includes('New Orleans')) city = 'New Orleans';
    else if (team.name.includes('Carolina')) city = 'Carolina';
    else if (team.name === 'Tennessee Titans') city = 'Nashville';
    else if (team.name === 'Nashville Predators') city = 'Nashville';
    else if (team.name.includes('San Antonio')) city = 'San Antonio';
    else if (team.name.includes('Ottawa')) city = 'Ottawa';
    else if (team.name.includes('Las Vegas') || team.name.includes('Vegas')) city = 'Las Vegas';
    else if (team.name.includes('Indianapolis')) city = 'Indianapolis';
    else if (team.name.includes('Carolina') && team.league === 'NHL') city = 'Carolina';
    else {
        city = team.name; // Single team city
    }
    
    if (!cityGroups[city]) {
        cityGroups[city] = [];
    }
    cityGroups[city].push(team);
});

// Count unique cities
const uniqueCities = Object.keys(cityGroups);
console.log(`📊 Total cities with exactly 1 championship: ${uniqueCities.length}\n`);

// Show each city and its team(s)
console.log('🏙️ BREAKDOWN BY CITY:\n');

let singleTeamCities = 0;
let multiTeamCities = 0;

uniqueCities.sort().forEach(city => {
    const teams = cityGroups[city];
    console.log(`${city}:`);
    
    teams.forEach(team => {
        console.log(`  - ${team.name} (${team.league}): ${team.championship_count} championships`);
    });
    
    if (teams.length === 1) {
        singleTeamCities++;
        console.log(`  → Single-team city\n`);
    } else {
        multiTeamCities++;
        console.log(`  → Multi-team city (${teams.length} teams total)\n`);
    }
});

console.log('\n📊 SUMMARY:');
console.log(`- ${uniqueCities.length} total cities with exactly 1 championship`);
console.log(`- ${singleTeamCities} are single-team cities`);
console.log(`- ${multiTeamCities} are multi-team cities where only one team has won`);

// Double-check by showing all teams with city_championship_total = 1
console.log('\n🔍 VERIFICATION - All teams with city total of 1:');
citiesWithOne.forEach(team => {
    console.log(`${team.name} (${team.league}) - Championships: ${team.championship_count}`);
});