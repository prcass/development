// Process all 124 teams from NFL, NHL, MLB, NBA with verified data
const fs = require('fs');

// NFL Teams (32 teams) - Extract from your table
const nflTeams = [
    { name: "Arizona Cardinals", league: "NFL", championship_count: 2, all_time_wins: 593, playoff_appearances: 11 },
    { name: "Atlanta Falcons", league: "NFL", championship_count: 0, all_time_wins: 398, playoff_appearances: 14 },
    { name: "Baltimore Ravens", league: "NFL", championship_count: 2, all_time_wins: 268, playoff_appearances: 16 },
    { name: "Buffalo Bills", league: "NFL", championship_count: 2, all_time_wins: 486, playoff_appearances: 24 },
    { name: "Carolina Panthers", league: "NFL", championship_count: 0, all_time_wins: 219, playoff_appearances: 8 },
    { name: "Chicago Bears", league: "NFL", championship_count: 9, all_time_wins: 798, playoff_appearances: 27 },
    { name: "Cincinnati Bengals", league: "NFL", championship_count: 0, all_time_wins: 403, playoff_appearances: 16 },
    { name: "Cleveland Browns", league: "NFL", championship_count: 8, all_time_wins: 562, playoff_appearances: 30 },
    { name: "Dallas Cowboys", league: "NFL", championship_count: 5, all_time_wins: 569, playoff_appearances: 36 },
    { name: "Denver Broncos", league: "NFL", championship_count: 3, all_time_wins: 518, playoff_appearances: 23 },
    { name: "Detroit Lions", league: "NFL", championship_count: 4, all_time_wins: 606, playoff_appearances: 19 },
    { name: "Green Bay Packers", league: "NFL", championship_count: 13, all_time_wins: 810, playoff_appearances: 37 },
    { name: "Houston Texans", league: "NFL", championship_count: 0, all_time_wins: 162, playoff_appearances: 8 },
    { name: "Indianapolis Colts", league: "NFL", championship_count: 4, all_time_wins: 564, playoff_appearances: 29 },
    { name: "Jacksonville Jaguars", league: "NFL", championship_count: 0, all_time_wins: 202, playoff_appearances: 8 },
    { name: "Kansas City Chiefs", league: "NFL", championship_count: 5, all_time_wins: 547, playoff_appearances: 27 },
    { name: "Las Vegas Raiders", league: "NFL", championship_count: 3, all_time_wins: 509, playoff_appearances: 23 },
    { name: "Los Angeles Chargers", league: "NFL", championship_count: 1, all_time_wins: 494, playoff_appearances: 21 },
    { name: "Los Angeles Rams", league: "NFL", championship_count: 4, all_time_wins: 624, playoff_appearances: 33 },
    { name: "Miami Dolphins", league: "NFL", championship_count: 2, all_time_wins: 504, playoff_appearances: 25 },
    { name: "Minnesota Vikings", league: "NFL", championship_count: 0, all_time_wins: 537, playoff_appearances: 32 },
    { name: "New England Patriots", league: "NFL", championship_count: 6, all_time_wins: 545, playoff_appearances: 28 },
    { name: "New Orleans Saints", league: "NFL", championship_count: 1, all_time_wins: 417, playoff_appearances: 14 },
    { name: "New York Giants", league: "NFL", championship_count: 8, all_time_wins: 724, playoff_appearances: 33 },
    { name: "New York Jets", league: "NFL", championship_count: 1, all_time_wins: 433, playoff_appearances: 14 },
    { name: "Philadelphia Eagles", league: "NFL", championship_count: 5, all_time_wins: 638, playoff_appearances: 31 },
    { name: "Pittsburgh Steelers", league: "NFL", championship_count: 6, all_time_wins: 681, playoff_appearances: 35 },
    { name: "San Francisco 49ers", league: "NFL", championship_count: 5, all_time_wins: 630, playoff_appearances: 30 },
    { name: "Seattle Seahawks", league: "NFL", championship_count: 1, all_time_wins: 402, playoff_appearances: 20 },
    { name: "Tampa Bay Buccaneers", league: "NFL", championship_count: 2, all_time_wins: 318, playoff_appearances: 15 },
    { name: "Tennessee Titans", league: "NFL", championship_count: 2, all_time_wins: 479, playoff_appearances: 25 },
    { name: "Washington Commanders", league: "NFL", championship_count: 5, all_time_wins: 641, playoff_appearances: 26 }
];

// NHL Teams (32 teams) - Extract from your table
const nhlTeams = [
    { name: "Anaheim Ducks", league: "NHL", championship_count: 1, all_time_wins: 1106, playoff_appearances: 14 },
    { name: "Boston Bruins", league: "NHL", championship_count: 6, all_time_wins: 3437, playoff_appearances: 77 },
    { name: "Buffalo Sabres", league: "NHL", championship_count: 0, all_time_wins: 1954, playoff_appearances: 29 },
    { name: "Calgary Flames", league: "NHL", championship_count: 1, all_time_wins: 1932, playoff_appearances: 31 },
    { name: "Carolina Hurricanes", league: "NHL", championship_count: 1, all_time_wins: 1566, playoff_appearances: 20 },
    { name: "Chicago Blackhawks", league: "NHL", championship_count: 6, all_time_wins: 2914, playoff_appearances: 63 },
    { name: "Colorado Avalanche", league: "NHL", championship_count: 3, all_time_wins: 1710, playoff_appearances: 30 },
    { name: "Columbus Blue Jackets", league: "NHL", championship_count: 0, all_time_wins: 807, playoff_appearances: 6 },
    { name: "Dallas Stars", league: "NHL", championship_count: 1, all_time_wins: 2037, playoff_appearances: 37 },
    { name: "Detroit Red Wings", league: "NHL", championship_count: 11, all_time_wins: 3136, playoff_appearances: 64 },
    { name: "Edmonton Oilers", league: "NHL", championship_count: 5, all_time_wins: 1665, playoff_appearances: 27 },
    { name: "Florida Panthers", league: "NHL", championship_count: 2, all_time_wins: 1088, playoff_appearances: 11 },
    { name: "Los Angeles Kings", league: "NHL", championship_count: 2, all_time_wins: 1937, playoff_appearances: 34 },
    { name: "Minnesota Wild", league: "NHL", championship_count: 0, all_time_wins: 942, playoff_appearances: 14 },
    { name: "Montreal Canadiens", league: "NHL", championship_count: 23, all_time_wins: 3596, playoff_appearances: 86 },
    { name: "Nashville Predators", league: "NHL", championship_count: 0, all_time_wins: 1016, playoff_appearances: 16 },
    { name: "New Jersey Devils", league: "NHL", championship_count: 3, all_time_wins: 1693, playoff_appearances: 25 },
    { name: "New York Islanders", league: "NHL", championship_count: 4, all_time_wins: 1841, playoff_appearances: 29 },
    { name: "New York Rangers", league: "NHL", championship_count: 4, all_time_wins: 3076, playoff_appearances: 63 },
    { name: "Ottawa Senators", league: "NHL", championship_count: 0, all_time_wins: 1125, playoff_appearances: 17 },
    { name: "Philadelphia Flyers", league: "NHL", championship_count: 2, all_time_wins: 2206, playoff_appearances: 40 },
    { name: "Pittsburgh Penguins", league: "NHL", championship_count: 5, all_time_wins: 2061, playoff_appearances: 37 },
    { name: "San Jose Sharks", league: "NHL", championship_count: 0, all_time_wins: 1163, playoff_appearances: 21 },
    { name: "Seattle Kraken", league: "NHL", championship_count: 0, all_time_wins: 142, playoff_appearances: 1 },
    { name: "St. Louis Blues", league: "NHL", championship_count: 1, all_time_wins: 2102, playoff_appearances: 46 },
    { name: "Tampa Bay Lightning", league: "NHL", championship_count: 3, all_time_wins: 1174, playoff_appearances: 17 },
    { name: "Toronto Maple Leafs", league: "NHL", championship_count: 13, all_time_wins: 3202, playoff_appearances: 74 },
    { name: "Utah Hockey Club", league: "NHL", championship_count: 0, all_time_wins: 38, playoff_appearances: 0 },
    { name: "Vancouver Canucks", league: "NHL", championship_count: 0, all_time_wins: 1815, playoff_appearances: 29 },
    { name: "Vegas Golden Knights", league: "NHL", championship_count: 1, all_time_wins: 362, playoff_appearances: 7 },
    { name: "Washington Capitals", league: "NHL", championship_count: 1, all_time_wins: 1870, playoff_appearances: 34 },
    { name: "Winnipeg Jets", league: "NHL", championship_count: 0, all_time_wins: 917, playoff_appearances: 9 }
];

// MLB Teams (30 teams) - Extract from your table
const mlbTeams = [
    { name: "Arizona Diamondbacks", league: "MLB", championship_count: 1, all_time_wins: 2137, playoff_appearances: 7 },
    { name: "Atlanta Braves", league: "MLB", championship_count: 4, all_time_wins: 11158, playoff_appearances: 30 },
    { name: "Baltimore Orioles", league: "MLB", championship_count: 3, all_time_wins: 9164, playoff_appearances: 16 },
    { name: "Boston Red Sox", league: "MLB", championship_count: 9, all_time_wins: 10009, playoff_appearances: 25 },
    { name: "Chicago Cubs", league: "MLB", championship_count: 3, all_time_wins: 11387, playoff_appearances: 21 },
    { name: "Chicago White Sox", league: "MLB", championship_count: 3, all_time_wins: 9630, playoff_appearances: 11 },
    { name: "Cincinnati Reds", league: "MLB", championship_count: 5, all_time_wins: 10986, playoff_appearances: 16 },
    { name: "Cleveland Guardians", league: "MLB", championship_count: 2, all_time_wins: 9902, playoff_appearances: 17 },
    { name: "Colorado Rockies", league: "MLB", championship_count: 0, all_time_wins: 2346, playoff_appearances: 5 },
    { name: "Detroit Tigers", league: "MLB", championship_count: 4, all_time_wins: 9736, playoff_appearances: 17 },
    { name: "Houston Astros", league: "MLB", championship_count: 2, all_time_wins: 5068, playoff_appearances: 18 },
    { name: "Kansas City Royals", league: "MLB", championship_count: 2, all_time_wins: 4257, playoff_appearances: 10 },
    { name: "Los Angeles Angels", league: "MLB", championship_count: 1, all_time_wins: 5070, playoff_appearances: 10 },
    { name: "Los Angeles Dodgers", league: "MLB", championship_count: 8, all_time_wins: 11491, playoff_appearances: 38 },
    { name: "Miami Marlins", league: "MLB", championship_count: 2, all_time_wins: 2350, playoff_appearances: 4 },
    { name: "Milwaukee Brewers", league: "MLB", championship_count: 0, all_time_wins: 4368, playoff_appearances: 10 },
    { name: "Minnesota Twins", league: "MLB", championship_count: 3, all_time_wins: 9308, playoff_appearances: 18 },
    { name: "New York Mets", league: "MLB", championship_count: 2, all_time_wins: 4874, playoff_appearances: 11 },
    { name: "New York Yankees", league: "MLB", championship_count: 27, all_time_wins: 10834, playoff_appearances: 59 },
    { name: "Oakland Athletics", league: "MLB", championship_count: 9, all_time_wins: 9371, playoff_appearances: 29 },
    { name: "Philadelphia Phillies", league: "MLB", championship_count: 2, all_time_wins: 10265, playoff_appearances: 17 },
    { name: "Pittsburgh Pirates", league: "MLB", championship_count: 5, all_time_wins: 10880, playoff_appearances: 17 },
    { name: "San Diego Padres", league: "MLB", championship_count: 0, all_time_wins: 4182, playoff_appearances: 8 },
    { name: "San Francisco Giants", league: "MLB", championship_count: 8, all_time_wins: 11594, playoff_appearances: 27 },
    { name: "Seattle Mariners", league: "MLB", championship_count: 0, all_time_wins: 3653, playoff_appearances: 5 },
    { name: "St. Louis Cardinals", league: "MLB", championship_count: 11, all_time_wins: 11337, playoff_appearances: 32 },
    { name: "Tampa Bay Rays", league: "MLB", championship_count: 0, all_time_wins: 2144, playoff_appearances: 9 },
    { name: "Texas Rangers", league: "MLB", championship_count: 1, all_time_wins: 4870, playoff_appearances: 9 },
    { name: "Toronto Blue Jays", league: "MLB", championship_count: 2, all_time_wins: 3820, playoff_appearances: 10 },
    { name: "Washington Nationals", league: "MLB", championship_count: 1, all_time_wins: 4306, playoff_appearances: 6 }
];

// NBA Teams (30 teams) - Extract from your table
const nbaTeams = [
    { name: "Atlanta Hawks", league: "NBA", championship_count: 1, all_time_wins: 2967, playoff_appearances: 49 },
    { name: "Boston Celtics", league: "NBA", championship_count: 18, all_time_wins: 3695, playoff_appearances: 62 },
    { name: "Brooklyn Nets", league: "NBA", championship_count: 2, all_time_wins: 2054, playoff_appearances: 31 },
    { name: "Charlotte Hornets", league: "NBA", championship_count: 0, all_time_wins: 1193, playoff_appearances: 10 },
    { name: "Chicago Bulls", league: "NBA", championship_count: 6, all_time_wins: 2422, playoff_appearances: 36 },
    { name: "Cleveland Cavaliers", league: "NBA", championship_count: 1, all_time_wins: 2096, playoff_appearances: 25 },
    { name: "Dallas Mavericks", league: "NBA", championship_count: 1, all_time_wins: 1836, playoff_appearances: 25 },
    { name: "Denver Nuggets", league: "NBA", championship_count: 1, all_time_wins: 2417, playoff_appearances: 40 },
    { name: "Detroit Pistons", league: "NBA", championship_count: 3, all_time_wins: 2871, playoff_appearances: 43 },
    { name: "Golden State Warriors", league: "NBA", championship_count: 7, all_time_wins: 3017, playoff_appearances: 38 },
    { name: "Houston Rockets", league: "NBA", championship_count: 2, all_time_wins: 2421, playoff_appearances: 35 },
    { name: "Indiana Pacers", league: "NBA", championship_count: 3, all_time_wins: 2407, playoff_appearances: 38 },
    { name: "Los Angeles Clippers", league: "NBA", championship_count: 0, all_time_wins: 1893, playoff_appearances: 19 },
    { name: "Los Angeles Lakers", league: "NBA", championship_count: 17, all_time_wins: 3600, playoff_appearances: 65 },
    { name: "Memphis Grizzlies", league: "NBA", championship_count: 0, all_time_wins: 1046, playoff_appearances: 14 },
    { name: "Miami Heat", league: "NBA", championship_count: 3, all_time_wins: 1558, playoff_appearances: 26 },
    { name: "Milwaukee Bucks", league: "NBA", championship_count: 2, all_time_wins: 2437, playoff_appearances: 37 },
    { name: "Minnesota Timberwolves", league: "NBA", championship_count: 0, all_time_wins: 1196, playoff_appearances: 13 },
    { name: "New Orleans Pelicans", league: "NBA", championship_count: 0, all_time_wins: 852, playoff_appearances: 9 },
    { name: "New York Knicks", league: "NBA", championship_count: 2, all_time_wins: 3025, playoff_appearances: 46 },
    { name: "Oklahoma City Thunder", league: "NBA", championship_count: 2, all_time_wins: 2538, playoff_appearances: 34 },
    { name: "Orlando Magic", league: "NBA", championship_count: 0, all_time_wins: 1356, playoff_appearances: 18 },
    { name: "Philadelphia 76ers", league: "NBA", championship_count: 3, all_time_wins: 3125, playoff_appearances: 54 },
    { name: "Phoenix Suns", league: "NBA", championship_count: 0, all_time_wins: 2465, playoff_appearances: 33 },
    { name: "Portland Trail Blazers", league: "NBA", championship_count: 1, all_time_wins: 2328, playoff_appearances: 37 },
    { name: "Sacramento Kings", league: "NBA", championship_count: 1, all_time_wins: 2788, playoff_appearances: 30 },
    { name: "San Antonio Spurs", league: "NBA", championship_count: 5, all_time_wins: 2717, playoff_appearances: 47 },
    { name: "Toronto Raptors", league: "NBA", championship_count: 1, all_time_wins: 1126, playoff_appearances: 13 },
    { name: "Utah Jazz", league: "NBA", championship_count: 0, all_time_wins: 2194, playoff_appearances: 31 },
    { name: "Washington Wizards", league: "NBA", championship_count: 1, all_time_wins: 2290, playoff_appearances: 30 }
];

// Combine all teams
const allTeams = [...nflTeams, ...nhlTeams, ...mlbTeams, ...nbaTeams];

// Add placeholder data for remaining 9 challenges
const addPlaceholderData = (team, index) => {
    const baseCode = String(index + 2).padStart(3, '0'); // Start at 002 since Cowboys is 001
    return {
        name: team.name,
        code: baseCode,
        league: team.league,
        championship_count: team.championship_count,
        stadium_capacity: 50000, // Placeholder
        team_value: 2.5, // Placeholder in billions
        all_time_wins: team.all_time_wins,
        playoff_appearances: team.playoff_appearances,
        hall_of_fame_players: 10, // Placeholder
        annual_revenue: 300.0, // Placeholder in millions
        payroll_total: 150.0, // Placeholder in millions
        player_salaries_avg: 3.0, // Placeholder in millions
        season_wins: 10, // Placeholder
        social_media_followers: 2.5, // Placeholder in millions
        home_attendance: 90.0, // Placeholder percentage
        originalCode: team.name.toUpperCase().replace(/[^A-Z]/g, '_')
    };
};

// Process all teams
const processedTeams = allTeams.map((team, index) => addPlaceholderData(team, index));

console.log(`Processing ${processedTeams.length} teams across 4 major leagues:`);
console.log(`NFL: ${nflTeams.length} teams`);
console.log(`NHL: ${nhlTeams.length} teams`);
console.log(`MLB: ${mlbTeams.length} teams`);
console.log(`NBA: ${nbaTeams.length} teams`);
console.log(`Total: ${processedTeams.length} teams`);

// Create the items object for data.js
const itemsObject = {};
processedTeams.forEach((team, index) => {
    itemsObject[team.code] = team;
});

// Convert to JSON string with proper formatting
const itemsJson = JSON.stringify(itemsObject, null, 16)
    .replace(/^{/, '')
    .replace(/}$/, '')
    .trim();

console.log('\nSample team entry:');
console.log(JSON.stringify(processedTeams[0], null, 2));

// Write the processed data
fs.writeFileSync('all-teams-processed.json', JSON.stringify(itemsObject, null, 2));
console.log('\nProcessed data saved to all-teams-processed.json');
console.log('Ready to add to data.js sports items section!');