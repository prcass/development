// Add City Championship Total Challenge - Combined wins across all teams in metro area
const fs = require('fs');

// Load current data.js
const window = {};
eval(fs.readFileSync('data.js', 'utf8'));
const gameData = window.GAME_DATA;

console.log('🏙️ Adding City Championship Total Challenge...');
console.log('📊 Combining championship counts for all teams in each metropolitan area');

// Metropolitan area mapping - group teams by city/metro area
const cityTeamMapping = {
    // New York Metro (multiple teams across leagues)
    "New York": [
        "New York Giants", "New York Jets", // NFL
        "New York Rangers", "New York Islanders", "New Jersey Devils", // NHL (Devils play in NY metro)
        "New York Knicks", "Brooklyn Nets", // NBA
        "New York Yankees", "New York Mets" // MLB
    ],
    
    // Los Angeles Metro
    "Los Angeles": [
        "Los Angeles Rams", "Los Angeles Chargers", // NFL
        "Los Angeles Kings", "Anaheim Ducks", // NHL
        "Los Angeles Lakers", "Los Angeles Clippers", // NBA
        "Los Angeles Dodgers", "Los Angeles Angels" // MLB
    ],
    
    // Chicago
    "Chicago": [
        "Chicago Bears", // NFL
        "Chicago Blackhawks", // NHL
        "Chicago Bulls", // NBA
        "Chicago Cubs", "Chicago White Sox" // MLB
    ],
    
    // Philadelphia
    "Philadelphia": [
        "Philadelphia Eagles", // NFL
        "Philadelphia Flyers", // NHL
        "Philadelphia 76ers", // NBA
        "Philadelphia Phillies" // MLB
    ],
    
    // Boston
    "Boston": [
        "New England Patriots", // NFL (Boston metro)
        "Boston Bruins", // NHL
        "Boston Celtics", // NBA
        "Boston Red Sox" // MLB
    ],
    
    // San Francisco Bay Area
    "San Francisco Bay Area": [
        "San Francisco 49ers", // NFL
        "San Jose Sharks", // NHL
        "Golden State Warriors", // NBA
        "San Francisco Giants", "Oakland Athletics" // MLB
    ],
    
    // Washington D.C.
    "Washington D.C.": [
        "Washington Commanders", // NFL
        "Washington Capitals", // NHL
        "Washington Wizards", // NBA
        "Washington Nationals" // MLB
    ],
    
    // Detroit
    "Detroit": [
        "Detroit Lions", // NFL
        "Detroit Red Wings", // NHL
        "Detroit Pistons", // NBA
        "Detroit Tigers" // MLB
    ],
    
    // Miami
    "Miami": [
        "Miami Dolphins", // NFL
        "Florida Panthers", // NHL
        "Miami Heat", // NBA
        "Miami Marlins" // MLB
    ],
    
    // Dallas-Fort Worth
    "Dallas": [
        "Dallas Cowboys", // NFL
        "Dallas Stars", // NHL
        "Dallas Mavericks", // NBA
        "Texas Rangers" // MLB
    ],
    
    // Minneapolis-St. Paul
    "Minneapolis": [
        "Minnesota Vikings", // NFL
        "Minnesota Wild", // NHL
        "Minnesota Timberwolves", // NBA
        "Minnesota Twins" // MLB
    ],
    
    // Atlanta
    "Atlanta": [
        "Atlanta Falcons", // NFL
        "Atlanta Hawks", // NBA
        "Atlanta Braves" // MLB
    ],
    
    // Phoenix
    "Phoenix": [
        "Arizona Cardinals", // NFL
        "Arizona Coyotes", // NHL
        "Phoenix Suns", // NBA
        "Arizona Diamondbacks" // MLB
    ],
    
    // Denver
    "Denver": [
        "Denver Broncos", // NFL
        "Colorado Avalanche", // NHL
        "Denver Nuggets", // NBA
        "Colorado Rockies" // MLB
    ],
    
    // Pittsburgh
    "Pittsburgh": [
        "Pittsburgh Steelers", // NFL
        "Pittsburgh Penguins", // NHL
        "Pittsburgh Pirates" // MLB
    ],
    
    // Cleveland
    "Cleveland": [
        "Cleveland Browns", // NFL
        "Cleveland Cavaliers", // NBA
        "Cleveland Guardians" // MLB
    ],
    
    // Milwaukee
    "Milwaukee": [
        "Green Bay Packers", // NFL (Wisconsin)
        "Milwaukee Bucks", // NBA
        "Milwaukee Brewers" // MLB
    ],
    
    // Houston
    "Houston": [
        "Houston Texans", // NFL
        "Houston Rockets", // NBA
        "Houston Astros" // MLB
    ],
    
    // Toronto
    "Toronto": [
        "Toronto Maple Leafs", // NHL
        "Toronto Raptors", // NBA
        "Toronto Blue Jays" // MLB
    ],
    
    // Tampa Bay
    "Tampa Bay": [
        "Tampa Bay Buccaneers", // NFL
        "Tampa Bay Lightning", // NHL
        "Tampa Bay Rays" // MLB
    ],
    
    // St. Louis
    "St. Louis": [
        "St. Louis Blues", // NHL
        "St. Louis Cardinals" // MLB
    ],
    
    // Seattle
    "Seattle": [
        "Seattle Seahawks", // NFL
        "Seattle Kraken", // NHL
        "Oklahoma City Thunder", // NBA (formerly Seattle SuperSonics)
        "Seattle Mariners" // MLB
    ],
    
    // Cities with 2 teams
    "Buffalo": ["Buffalo Bills", "Buffalo Sabres"],
    "Carolina": ["Carolina Panthers", "Carolina Hurricanes"],
    "Nashville": ["Tennessee Titans", "Nashville Predators"],
    "Indianapolis": ["Indianapolis Colts"],
    "Kansas City": ["Kansas City Chiefs", "Kansas City Royals"],
    "Cincinnati": ["Cincinnati Bengals", "Cincinnati Reds"],
    "Baltimore": ["Baltimore Ravens", "Baltimore Orioles"],
    "New Orleans": ["New Orleans Saints", "New Orleans Pelicans"],
    "Portland": ["Portland Trail Blazers"],
    "Orlando": ["Orlando Magic"],
    "Charlotte": ["Charlotte Hornets"],
    "San Antonio": ["San Antonio Spurs"],
    "Memphis": ["Memphis Grizzlies"],
    "Utah": ["Utah Jazz", "Utah Hockey Club"],
    "Las Vegas": ["Las Vegas Raiders", "Vegas Golden Knights"],
    "Jacksonville": ["Jacksonville Jaguars"],
    "Columbus": ["Columbus Blue Jackets"],
    "Ottawa": ["Ottawa Senators"],
    "Calgary": ["Calgary Flames"],
    "Edmonton": ["Edmonton Oilers"],
    "Vancouver": ["Vancouver Canucks"],
    "Winnipeg": ["Winnipeg Jets"],
    "Montreal": ["Montreal Canadiens"],
    "Sacramento": ["Sacramento Kings"],
    "San Diego": ["San Diego Padres"],
    "Anaheim": ["Anaheim Ducks"] // Separate from LA for this analysis
};

// Calculate city championship totals
const cityChampionshipTotals = {};
const cityTeamCounts = {};

Object.entries(cityTeamMapping).forEach(([city, teamNames]) => {
    let totalChampionships = 0;
    let validTeamCount = 0;
    
    teamNames.forEach(teamName => {
        const team = Object.values(gameData.categories.sports.items).find(t => t.name === teamName);
        if (team) {
            totalChampionships += team.championship_count || 0;
            validTeamCount++;
        } else {
            console.log(`⚠️ Team not found: ${teamName}`);
        }
    });
    
    cityChampionshipTotals[city] = totalChampionships;
    cityTeamCounts[city] = validTeamCount;
    
    console.log(`🏙️ ${city}: ${totalChampionships} total championships (${validTeamCount} teams)`);
});

// Now add city_championship_total field to each team
let updatedCount = 0;
Object.values(gameData.categories.sports.items).forEach(team => {
    // Find which city this team belongs to
    let teamCity = null;
    Object.entries(cityTeamMapping).forEach(([city, teamNames]) => {
        if (teamNames.includes(team.name)) {
            teamCity = city;
        }
    });
    
    if (teamCity) {
        team.city_championship_total = cityChampionshipTotals[teamCity];
        updatedCount++;
    } else {
        // Single team cities - just use their own championship count
        team.city_championship_total = team.championship_count || 0;
        console.log(`⚠️ Single team city: ${team.name}`);
        updatedCount++;
    }
});

// Add the new challenge to sports prompts
const prompts = gameData.categories.sports.prompts;
const cityChampionshipChallenge = {
    "challenge": "city_championship_total",
    "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Most Successful Sports City?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Total Championships by Metro Area</div><div style='font-size: 0.85em; color: #666'>(All teams in city combined)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
};

prompts.push(cityChampionshipChallenge);
console.log('\n✅ Added "Most Successful Sports City" challenge to sports prompts');

console.log(`\n✅ Updated ${updatedCount} teams with city championship totals`);

// Write updated data.js
const newContent = `/**
 * Outrank Game Data - v5.1 City Championship Totals Added
 * Updated: ${new Date().toISOString()}
 * Added City Championship Total challenge - combined wins by metropolitan area
 * Teams from same metro area share the same city total
 * Shows which cities are most successful across all sports
 * All 124 teams across 4 leagues with complete data
 * Countries: 40, Movies: 40, Sports: 124, Companies: 40
 * Total Categories: 4, Sports Challenges: 21 (added city totals)
 */

window.GAME_DATA = ${JSON.stringify(gameData, null, 4)};

// Console output for verification
console.log('✅ Outrank v5.1 City Championships - Game data loaded with 4 categories');
console.log('🌍 Countries:', Object.keys(window.GAME_DATA.categories.countries.items).length, 'countries with', window.GAME_DATA.categories.countries.prompts.length, 'challenges');
console.log('🎬 Movies:', Object.keys(window.GAME_DATA.categories.movies.items).length, 'movies with', window.GAME_DATA.categories.movies.prompts.length, 'challenges');
console.log('🏢 Companies:', Object.keys(window.GAME_DATA.categories.companies.items).length, 'companies with', window.GAME_DATA.categories.companies.prompts.length, 'challenges');
console.log('🏈 Sports:', Object.keys(window.GAME_DATA.categories.sports.items).length, 'teams with', window.GAME_DATA.categories.sports.prompts.length, 'challenges (21 total, added city totals)');
console.log('📊 Total items:', Object.keys(window.GAME_DATA.categories.countries.items).length + Object.keys(window.GAME_DATA.categories.movies.items).length + Object.keys(window.GAME_DATA.categories.companies.items).length + Object.keys(window.GAME_DATA.categories.sports.items).length);
console.log('🎯 Total challenges:', window.GAME_DATA.categories.countries.prompts.length + window.GAME_DATA.categories.movies.prompts.length + window.GAME_DATA.categories.companies.prompts.length + window.GAME_DATA.categories.sports.prompts.length);`;

fs.writeFileSync('data.js', newContent);

// Show city championship rankings
console.log('\n🏆 MOST SUCCESSFUL SPORTS CITIES:');
console.log('==================================');

console.log('\n🏙️ TOP CHAMPIONSHIP CITIES:');
const cityRankings = Object.entries(cityChampionshipTotals)
    .sort((a, b) => b[1] - a[1]);

cityRankings.slice(0, 20).forEach(([city, total], i) => {
    const teamCount = cityTeamCounts[city];
    const teamsInCity = cityTeamMapping[city];
    console.log(`${i+1}. ${city}: ${total} total championships (${teamCount} teams)`);
    
    // Show which teams contribute
    if (teamsInCity && teamsInCity.length <= 4) {
        teamsInCity.forEach(teamName => {
            const team = Object.values(gameData.categories.sports.items).find(t => t.name === teamName);
            if (team) {
                console.log(`     ${team.name} (${team.league}): ${team.championship_count} championships`);
            }
        });
    }
    console.log();
});

console.log('\n📊 CITIES BY TEAM COUNT:');
const citiesByTeamCount = {};
Object.entries(cityTeamCounts).forEach(([city, count]) => {
    if (!citiesByTeamCount[count]) citiesByTeamCount[count] = [];
    citiesByTeamCount[count].push({city, championships: cityChampionshipTotals[city]});
});

Object.keys(citiesByTeamCount).sort((a, b) => b - a).forEach(teamCount => {
    const cities = citiesByTeamCount[teamCount].sort((a, b) => b.championships - a.championships);
    console.log(`\n${teamCount} Teams:`);
    cities.slice(0, 5).forEach(({city, championships}) => {
        console.log(`   ${city}: ${championships} championships`);
    });
});

console.log('\n🏅 CHAMPIONSHIP EFFICIENCY (Championships per team):');
const efficiency = cityRankings
    .filter(([city]) => cityTeamCounts[city] >= 2)
    .map(([city, championships]) => ({
        city,
        championships,
        teams: cityTeamCounts[city],
        efficiency: championships / cityTeamCounts[city]
    }))
    .sort((a, b) => b.efficiency - a.efficiency);

efficiency.slice(0, 10).forEach(({city, championships, teams, efficiency}, i) => {
    console.log(`${i+1}. ${city}: ${efficiency.toFixed(1)} championships per team (${championships}/${teams})`);
});

console.log(`\n📊 Total teams updated: ${updatedCount}/124`);
console.log('📈 New challenge added: "Most Successful Sports City?"');
console.log('🎯 21 total sports challenges now available!');

// Verify the new file
try {
    const testWindow = {};
    eval(fs.readFileSync('data.js', 'utf8'));
    console.log('\n✅ Syntax validation passed!');
    console.log(`✅ Total sports challenges: ${testWindow.GAME_DATA.categories.sports.prompts.length}`);
} catch (error) {
    console.error('\n❌ Syntax error in generated file:', error.message);
}