// Show Complete City Championship Rankings
const fs = require('fs');

// Load current data.js
const window = {};
eval(fs.readFileSync('data.js', 'utf8'));
const gameData = window.GAME_DATA;

console.log('🏆 COMPLETE CITY CHAMPIONSHIP RANKINGS');
console.log('=====================================');

// Get all unique city totals from teams
const cityTotals = {};
const cityTeams = {};

Object.values(gameData.categories.sports.items).forEach(team => {
    const cityTotal = team.city_championship_total;
    
    // Find city name by looking at which teams share this total
    let cityKey = `City with ${cityTotal} championships`;
    
    if (!cityTotals[cityTotal]) {
        cityTotals[cityTotal] = [];
        cityTeams[cityTotal] = [];
    }
    
    // Group teams by their city total
    const teamInfo = `${team.name} (${team.league})`;
    if (!cityTeams[cityTotal].some(info => info.includes(team.name))) {
        cityTeams[cityTotal].push(teamInfo);
    }
});

// Create proper city rankings by analyzing team groupings
const properCityRankings = {
    53: "New York",
    39: "Boston", 
    34: "Los Angeles",
    29: "San Francisco Bay Area",
    27: "Chicago",
    23: "Montreal",
    22: "Detroit",
    16: "Pittsburgh/Toronto", // Both have 16
    15: "Milwaukee",
    12: "Philadelphia/St. Louis", // Both have 12
    11: "Cleveland",
    9: "Miami",
    8: "Washington D.C./Dallas", // Both have 8
    7: "Denver/Kansas City", // Both have 7
    5: "Multiple cities", // Several cities have 5
    4: "Multiple cities", // Several cities have 4
    3: "Multiple cities", // Several cities have 3
    2: "Multiple cities", // Several cities have 2
    1: "Multiple cities", // Several cities have 1
    0: "Multiple cities"  // Several cities have 0
};

// Sort by championship total
const sortedTotals = Object.keys(cityTotals)
    .map(total => parseInt(total))
    .sort((a, b) => b - a);

console.log('\n📊 COMPLETE RANKINGS:');
console.log('(Teams from same metropolitan area share the same total)\n');

let currentRank = 1;
sortedTotals.forEach((total, index) => {
    const teamsWithThisTotal = cityTeams[total];
    const uniqueCities = new Set();
    
    // Try to identify city names from team names
    teamsWithThisTotal.forEach(teamInfo => {
        if (teamInfo.includes('New York') || teamInfo.includes('New Jersey')) uniqueCities.add('New York Metro');
        else if (teamInfo.includes('Los Angeles') || teamInfo.includes('Anaheim')) uniqueCities.add('Los Angeles Metro');
        else if (teamInfo.includes('Boston') || teamInfo.includes('New England')) uniqueCities.add('Boston');
        else if (teamInfo.includes('Chicago')) uniqueCities.add('Chicago');
        else if (teamInfo.includes('Philadelphia')) uniqueCities.add('Philadelphia');
        else if (teamInfo.includes('San Francisco') || teamInfo.includes('Golden State') || teamInfo.includes('Oakland') || teamInfo.includes('San Jose')) uniqueCities.add('San Francisco Bay Area');
        else if (teamInfo.includes('Detroit')) uniqueCities.add('Detroit');
        else if (teamInfo.includes('Pittsburgh')) uniqueCities.add('Pittsburgh');
        else if (teamInfo.includes('Montreal')) uniqueCities.add('Montreal');
        else if (teamInfo.includes('Toronto')) uniqueCities.add('Toronto');
        else if (teamInfo.includes('Green Bay') || teamInfo.includes('Milwaukee')) uniqueCities.add('Milwaukee/Green Bay');
        else if (teamInfo.includes('Miami') || teamInfo.includes('Florida Panthers')) uniqueCities.add('Miami');
        else if (teamInfo.includes('Washington')) uniqueCities.add('Washington D.C.');
        else if (teamInfo.includes('Dallas') || teamInfo.includes('Texas Rangers')) uniqueCities.add('Dallas');
        else if (teamInfo.includes('Cleveland')) uniqueCities.add('Cleveland');
        else if (teamInfo.includes('Denver') || teamInfo.includes('Colorado')) uniqueCities.add('Denver');
        else if (teamInfo.includes('Kansas City')) uniqueCities.add('Kansas City');
        else if (teamInfo.includes('St. Louis')) uniqueCities.add('St. Louis');
        else if (teamInfo.includes('Atlanta')) uniqueCities.add('Atlanta');
        else if (teamInfo.includes('Tampa Bay')) uniqueCities.add('Tampa Bay');
        else if (teamInfo.includes('Houston')) uniqueCities.add('Houston');
        else if (teamInfo.includes('Seattle') || teamInfo.includes('Oklahoma City Thunder')) uniqueCities.add('Seattle');
        else if (teamInfo.includes('Buffalo')) uniqueCities.add('Buffalo');
        else if (teamInfo.includes('Minneapolis') || teamInfo.includes('Minnesota')) uniqueCities.add('Minneapolis');
        else if (teamInfo.includes('Phoenix') || teamInfo.includes('Arizona')) uniqueCities.add('Phoenix');
        // Add more as needed...
    });
    
    const cityList = Array.from(uniqueCities);
    
    if (cityList.length === 1) {
        console.log(`${currentRank}. ${cityList[0]}: ${total} championships`);
        console.log(`   Teams: ${teamsWithThisTotal.join(', ')}\n`);
    } else if (cityList.length > 1) {
        cityList.forEach(city => {
            console.log(`${currentRank}. ${city}: ${total} championships`);
        });
        console.log(`   All teams: ${teamsWithThisTotal.join(', ')}\n`);
    } else {
        console.log(`${currentRank}. Various cities: ${total} championships`);
        console.log(`   Teams: ${teamsWithThisTotal.slice(0, 5).join(', ')}${teamsWithThisTotal.length > 5 ? ' ...' : ''}\n`);
    }
    
    // Update rank for next group
    currentRank += Math.max(cityList.length, 1);
});

console.log(`\n📊 SUMMARY:`);
console.log(`Total unique championship totals: ${sortedTotals.length}`);
console.log(`Range: ${Math.max(...sortedTotals)} championships (highest) to ${Math.min(...sortedTotals)} championships (lowest)`);

// Count actual number of metropolitan areas
const uniqueMetroAreas = new Set();
Object.values(gameData.categories.sports.items).forEach(team => {
    const teamName = team.name;
    if (teamName.includes('New York') || teamName.includes('New Jersey')) uniqueMetroAreas.add('New York');
    else if (teamName.includes('Los Angeles') || teamName.includes('Anaheim')) uniqueMetroAreas.add('Los Angeles');
    else if (teamName.includes('Chicago')) uniqueMetroAreas.add('Chicago');
    else if (teamName.includes('Philadelphia')) uniqueMetroAreas.add('Philadelphia');
    else if (teamName.includes('Boston') || teamName.includes('New England')) uniqueMetroAreas.add('Boston');
    else if (teamName.includes('Detroit')) uniqueMetroAreas.add('Detroit');
    else if (teamName.includes('Miami') || teamName.includes('Florida Panthers')) uniqueMetroAreas.add('Miami');
    else if (teamName.includes('Washington')) uniqueMetroAreas.add('Washington D.C.');
    else if (teamName.includes('Dallas') || teamName.includes('Texas Rangers')) uniqueMetroAreas.add('Dallas');
    else if (teamName.includes('Pittsburgh')) uniqueMetroAreas.add('Pittsburgh');
    else if (teamName.includes('Montreal')) uniqueMetroAreas.add('Montreal');
    else if (teamName.includes('Toronto')) uniqueMetroAreas.add('Toronto');
    else if (teamName.includes('Green Bay') || teamName.includes('Milwaukee')) uniqueMetroAreas.add('Milwaukee');
    else if (teamName.includes('Cleveland')) uniqueMetroAreas.add('Cleveland');
    else if (teamName.includes('Denver') || teamName.includes('Colorado')) uniqueMetroAreas.add('Denver');
    else if (teamName.includes('San Francisco') || teamName.includes('Golden State') || teamName.includes('Oakland') || teamName.includes('San Jose')) uniqueMetroAreas.add('San Francisco Bay Area');
    else if (teamName.includes('St. Louis')) uniqueMetroAreas.add('St. Louis');
    else if (teamName.includes('Kansas City')) uniqueMetroAreas.add('Kansas City');
    else if (teamName.includes('Atlanta')) uniqueMetroAreas.add('Atlanta');
    else if (teamName.includes('Tampa Bay')) uniqueMetroAreas.add('Tampa Bay');
    else if (teamName.includes('Houston')) uniqueMetroAreas.add('Houston');
    else if (teamName.includes('Buffalo')) uniqueMetroAreas.add('Buffalo');
    else if (teamName.includes('Seattle') || teamName.includes('Oklahoma City Thunder')) uniqueMetroAreas.add('Seattle');
    else if (teamName.includes('Minneapolis') || teamName.includes('Minnesota')) uniqueMetroAreas.add('Minneapolis');
    else if (teamName.includes('Phoenix') || teamName.includes('Arizona')) uniqueMetroAreas.add('Phoenix');
    else if (teamName.includes('Carolina')) uniqueMetroAreas.add('Carolina');
    else if (teamName.includes('Nashville') || teamName.includes('Tennessee Titans')) uniqueMetroAreas.add('Nashville');
    else if (teamName.includes('Cincinnati')) uniqueMetroAreas.add('Cincinnati');
    else if (teamName.includes('Baltimore')) uniqueMetroAreas.add('Baltimore');
    else if (teamName.includes('New Orleans')) uniqueMetroAreas.add('New Orleans');
    else if (teamName.includes('Las Vegas') || teamName.includes('Vegas')) uniqueMetroAreas.add('Las Vegas');
    // Single team cities
    else uniqueMetroAreas.add(teamName.split(' ').pop() + ' (single team)');
});

console.log(`\nEstimated number of metropolitan areas represented: ${uniqueMetroAreas.size}`);
console.log(`\nNote: This challenge shows how teams from the same metro area`);
console.log(`combine their championships for a city-wide total.`);