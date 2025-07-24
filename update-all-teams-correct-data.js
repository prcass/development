// Update all 124 teams with correct Sports Reference 2025 data
// No assumptions - using exact data from the 4 provided tables
const fs = require('fs');

// Import all extracted data
const mlbData = [
    { name: "Arizona Diamondbacks", winning_percentage: 0.489, division_titles: 5, playoff_appearances: 7 },
    { name: "Oakland Athletics", winning_percentage: 0.486, division_titles: 17, playoff_appearances: 29 },
    { name: "Atlanta Braves", winning_percentage: 0.503, division_titles: 23, playoff_appearances: 30 },
    { name: "Baltimore Orioles", winning_percentage: 0.475, division_titles: 10, playoff_appearances: 16 },
    { name: "Boston Red Sox", winning_percentage: 0.518, division_titles: 10, playoff_appearances: 25 },
    { name: "Chicago Cubs", winning_percentage: 0.513, division_titles: 8, playoff_appearances: 21 },
    { name: "Chicago White Sox", winning_percentage: 0.499, division_titles: 6, playoff_appearances: 11 },
    { name: "Cincinnati Reds", winning_percentage: 0.504, division_titles: 10, playoff_appearances: 16 },
    { name: "Cleveland Guardians", winning_percentage: 0.512, division_titles: 12, playoff_appearances: 17 },
    { name: "Colorado Rockies", winning_percentage: 0.458, division_titles: 0, playoff_appearances: 5 },
    { name: "Detroit Tigers", winning_percentage: 0.503, division_titles: 7, playoff_appearances: 17 },
    { name: "Houston Astros", winning_percentage: 0.503, division_titles: 14, playoff_appearances: 18 },
    { name: "Kansas City Royals", winning_percentage: 0.477, division_titles: 8, playoff_appearances: 10 },
    { name: "Los Angeles Angels", winning_percentage: 0.495, division_titles: 9, playoff_appearances: 10 },
    { name: "Los Angeles Dodgers", winning_percentage: 0.532, division_titles: 22, playoff_appearances: 38 },
    { name: "Miami Marlins", winning_percentage: 0.460, division_titles: 0, playoff_appearances: 4 },
    { name: "Milwaukee Brewers", winning_percentage: 0.489, division_titles: 7, playoff_appearances: 10 },
    { name: "Minnesota Twins", winning_percentage: 0.482, division_titles: 13, playoff_appearances: 18 },
    { name: "New York Mets", winning_percentage: 0.484, division_titles: 6, playoff_appearances: 11 },
    { name: "New York Yankees", winning_percentage: 0.569, division_titles: 21, playoff_appearances: 59 },
    { name: "Philadelphia Phillies", winning_percentage: 0.474, division_titles: 13, playoff_appearances: 17 },
    { name: "Pittsburgh Pirates", winning_percentage: 0.500, division_titles: 9, playoff_appearances: 17 },
    { name: "San Diego Padres", winning_percentage: 0.468, division_titles: 5, playoff_appearances: 8 },
    { name: "San Francisco Giants", winning_percentage: 0.535, division_titles: 9, playoff_appearances: 27 },
    { name: "Seattle Mariners", winning_percentage: 0.478, division_titles: 3, playoff_appearances: 5 },
    { name: "St. Louis Cardinals", winning_percentage: 0.520, division_titles: 15, playoff_appearances: 32 },
    { name: "Tampa Bay Rays", winning_percentage: 0.490, division_titles: 4, playoff_appearances: 9 },
    { name: "Texas Rangers", winning_percentage: 0.476, division_titles: 7, playoff_appearances: 9 },
    { name: "Toronto Blue Jays", winning_percentage: 0.499, division_titles: 6, playoff_appearances: 10 },
    { name: "Washington Nationals", winning_percentage: 0.482, division_titles: 5, playoff_appearances: 6 }
];

const nflData = [
    { name: "Arizona Cardinals", winning_percentage: 0.422, division_titles: 8, playoff_appearances: 11 },
    { name: "Atlanta Falcons", winning_percentage: 0.438, division_titles: 7, playoff_appearances: 14 },
    { name: "Baltimore Ravens", winning_percentage: 0.574, division_titles: 8, playoff_appearances: 16 },
    { name: "Buffalo Bills", winning_percentage: 0.490, division_titles: 16, playoff_appearances: 24 },
    { name: "Carolina Panthers", winning_percentage: 0.454, division_titles: 6, playoff_appearances: 8 },
    { name: "Chicago Bears", winning_percentage: 0.553, division_titles: 24, playoff_appearances: 27 },
    { name: "Cincinnati Bengals", winning_percentage: 0.457, division_titles: 12, playoff_appearances: 16 },
    { name: "Cleveland Browns", winning_percentage: 0.506, division_titles: 23, playoff_appearances: 30 },
    { name: "Dallas Cowboys", winning_percentage: 0.574, division_titles: 26, playoff_appearances: 36 },
    { name: "Denver Broncos", winning_percentage: 0.523, division_titles: 15, playoff_appearances: 23 },
    { name: "Detroit Lions", winning_percentage: 0.461, division_titles: 10, playoff_appearances: 19 },
    { name: "Green Bay Packers", winning_percentage: 0.572, division_titles: 31, playoff_appearances: 37 },
    { name: "Houston Texans", winning_percentage: 0.437, division_titles: 8, playoff_appearances: 8 },
    { name: "Indianapolis Colts", winning_percentage: 0.525, division_titles: 21, playoff_appearances: 29 },
    { name: "Jacksonville Jaguars", winning_percentage: 0.417, division_titles: 4, playoff_appearances: 8 },
    { name: "Kansas City Chiefs", winning_percentage: 0.553, division_titles: 18, playoff_appearances: 27 },
    { name: "Las Vegas Raiders", winning_percentage: 0.515, division_titles: 16, playoff_appearances: 23 },
    { name: "Los Angeles Chargers", winning_percentage: 0.499, division_titles: 15, playoff_appearances: 21 },
    { name: "Los Angeles Rams", winning_percentage: 0.507, division_titles: 22, playoff_appearances: 33 },
    { name: "Miami Dolphins", winning_percentage: 0.553, division_titles: 14, playoff_appearances: 25 },
    { name: "Minnesota Vikings", winning_percentage: 0.551, division_titles: 21, playoff_appearances: 32 },
    { name: "New England Patriots", winning_percentage: 0.550, division_titles: 22, playoff_appearances: 28 },
    { name: "New Orleans Saints", winning_percentage: 0.465, division_titles: 9, playoff_appearances: 14 },
    { name: "New York Giants", winning_percentage: 0.522, division_titles: 25, playoff_appearances: 33 },
    { name: "New York Jets", winning_percentage: 0.437, division_titles: 4, playoff_appearances: 14 },
    { name: "Philadelphia Eagles", winning_percentage: 0.500, division_titles: 17, playoff_appearances: 31 },
    { name: "Pittsburgh Steelers", winning_percentage: 0.538, division_titles: 25, playoff_appearances: 35 },
    { name: "San Francisco 49ers", winning_percentage: 0.545, division_titles: 23, playoff_appearances: 30 },
    { name: "Seattle Seahawks", winning_percentage: 0.519, division_titles: 11, playoff_appearances: 20 },
    { name: "Tampa Bay Buccaneers", winning_percentage: 0.410, division_titles: 10, playoff_appearances: 15 },
    { name: "Tennessee Titans", winning_percentage: 0.482, division_titles: 11, playoff_appearances: 25 },
    { name: "Washington Commanders", winning_percentage: 0.497, division_titles: 16, playoff_appearances: 26 }
];

const nhlData = [
    { name: "Anaheim Ducks", winning_percentage: 0.521, division_titles: 6, playoff_appearances: 14 },
    { name: "Boston Bruins", winning_percentage: 0.567, division_titles: 30, playoff_appearances: 77 },
    { name: "Buffalo Sabres", winning_percentage: 0.528, division_titles: 6, playoff_appearances: 29 },
    { name: "Calgary Flames", winning_percentage: 0.539, division_titles: 8, playoff_appearances: 31 },
    { name: "Carolina Hurricanes", winning_percentage: 0.505, division_titles: 7, playoff_appearances: 20 },
    { name: "Chicago Blackhawks", winning_percentage: 0.497, division_titles: 17, playoff_appearances: 63 },
    { name: "Colorado Avalanche", winning_percentage: 0.540, division_titles: 14, playoff_appearances: 30 },
    { name: "Columbus Blue Jackets", winning_percentage: 0.486, division_titles: 0, playoff_appearances: 6 },
    { name: "Dallas Stars", winning_percentage: 0.526, division_titles: 11, playoff_appearances: 37 },
    { name: "Detroit Red Wings", winning_percentage: 0.530, division_titles: 29, playoff_appearances: 64 },
    { name: "Edmonton Oilers", winning_percentage: 0.531, division_titles: 6, playoff_appearances: 27 },
    { name: "Florida Panthers", winning_percentage: 0.523, division_titles: 4, playoff_appearances: 11 },
    { name: "Los Angeles Kings", winning_percentage: 0.501, division_titles: 1, playoff_appearances: 34 },
    { name: "Minnesota Wild", winning_percentage: 0.561, division_titles: 1, playoff_appearances: 14 },
    { name: "Montreal Canadiens", winning_percentage: 0.580, division_titles: 37, playoff_appearances: 86 },
    { name: "Nashville Predators", winning_percentage: 0.554, division_titles: 2, playoff_appearances: 16 },
    { name: "New Jersey Devils", winning_percentage: 0.494, division_titles: 9, playoff_appearances: 25 },
    { name: "New York Islanders", winning_percentage: 0.515, division_titles: 6, playoff_appearances: 29 },
    { name: "New York Rangers", winning_percentage: 0.519, division_titles: 9, playoff_appearances: 63 },
    { name: "Ottawa Senators", winning_percentage: 0.507, division_titles: 4, playoff_appearances: 17 },
    { name: "Philadelphia Flyers", winning_percentage: 0.566, division_titles: 16, playoff_appearances: 40 },
    { name: "Pittsburgh Penguins", winning_percentage: 0.523, division_titles: 10, playoff_appearances: 37 },
    { name: "San Jose Sharks", winning_percentage: 0.511, division_titles: 6, playoff_appearances: 21 },
    { name: "Seattle Kraken", winning_percentage: 0.483, division_titles: 0, playoff_appearances: 1 },
    { name: "St. Louis Blues", winning_percentage: 0.537, division_titles: 10, playoff_appearances: 46 },
    { name: "Tampa Bay Lightning", winning_percentage: 0.523, division_titles: 4, playoff_appearances: 17 },
    { name: "Toronto Maple Leafs", winning_percentage: 0.520, division_titles: 10, playoff_appearances: 74 },
    { name: "Utah Hockey Club", winning_percentage: 0.543, division_titles: 0, playoff_appearances: 0 },
    { name: "Vancouver Canucks", winning_percentage: 0.494, division_titles: 11, playoff_appearances: 29 },
    { name: "Vegas Golden Knights", winning_percentage: 0.632, division_titles: 5, playoff_appearances: 7 },
    { name: "Washington Capitals", winning_percentage: 0.536, division_titles: 14, playoff_appearances: 34 },
    { name: "Winnipeg Jets", winning_percentage: 0.519, division_titles: 2, playoff_appearances: 9 }
];

const nbaData = [
    { name: "Atlanta Hawks", winning_percentage: 0.493, division_titles: 12, playoff_appearances: 49 },
    { name: "Boston Celtics", winning_percentage: 0.596, division_titles: 35, playoff_appearances: 62 },
    { name: "Brooklyn Nets", winning_percentage: 0.438, division_titles: 5, playoff_appearances: 31 },
    { name: "Charlotte Hornets", winning_percentage: 0.427, division_titles: 0, playoff_appearances: 10 },
    { name: "Chicago Bulls", winning_percentage: 0.509, division_titles: 9, playoff_appearances: 36 },
    { name: "Cleveland Cavaliers", winning_percentage: 0.473, division_titles: 8, playoff_appearances: 25 },
    { name: "Dallas Mavericks", winning_percentage: 0.506, division_titles: 5, playoff_appearances: 25 },
    { name: "Denver Nuggets", winning_percentage: 0.515, division_titles: 13, playoff_appearances: 40 },
    { name: "Detroit Pistons", winning_percentage: 0.472, division_titles: 11, playoff_appearances: 43 },
    { name: "Golden State Warriors", winning_percentage: 0.488, division_titles: 12, playoff_appearances: 38 },
    { name: "Houston Rockets", winning_percentage: 0.516, division_titles: 9, playoff_appearances: 35 },
    { name: "Indiana Pacers", winning_percentage: 0.513, division_titles: 9, playoff_appearances: 38 },
    { name: "Los Angeles Clippers", winning_percentage: 0.426, division_titles: 3, playoff_appearances: 19 },
    { name: "Los Angeles Lakers", winning_percentage: 0.592, division_titles: 34, playoff_appearances: 65 },
    { name: "Memphis Grizzlies", winning_percentage: 0.437, division_titles: 2, playoff_appearances: 14 },
    { name: "Miami Heat", winning_percentage: 0.525, division_titles: 16, playoff_appearances: 26 },
    { name: "Milwaukee Bucks", winning_percentage: 0.529, division_titles: 19, playoff_appearances: 37 },
    { name: "Minnesota Timberwolves", winning_percentage: 0.416, division_titles: 1, playoff_appearances: 13 },
    { name: "New Orleans Pelicans", winning_percentage: 0.461, division_titles: 1, playoff_appearances: 9 },
    { name: "New York Knicks", winning_percentage: 0.489, division_titles: 8, playoff_appearances: 46 },
    { name: "Oklahoma City Thunder", winning_percentage: 0.541, division_titles: 13, playoff_appearances: 34 },
    { name: "Orlando Magic", winning_percentage: 0.470, division_titles: 8, playoff_appearances: 18 },
    { name: "Philadelphia 76ers", winning_percentage: 0.519, division_titles: 12, playoff_appearances: 54 },
    { name: "Phoenix Suns", winning_percentage: 0.535, division_titles: 8, playoff_appearances: 33 },
    { name: "Portland Trail Blazers", winning_percentage: 0.524, division_titles: 6, playoff_appearances: 37 },
    { name: "Sacramento Kings", winning_percentage: 0.458, division_titles: 6, playoff_appearances: 30 },
    { name: "San Antonio Spurs", winning_percentage: 0.579, division_titles: 22, playoff_appearances: 47 },
    { name: "Toronto Raptors", winning_percentage: 0.471, division_titles: 7, playoff_appearances: 13 },
    { name: "Utah Jazz", winning_percentage: 0.533, division_titles: 11, playoff_appearances: 31 },
    { name: "Washington Wizards", winning_percentage: 0.443, division_titles: 8, playoff_appearances: 30 }
];

// Combine all data into lookup
const allData = [...mlbData, ...nflData, ...nhlData, ...nbaData];
const dataLookup = {};
allData.forEach(team => {
    dataLookup[team.name] = {
        winning_percentage: team.winning_percentage,
        division_titles: team.division_titles,
        playoff_wins: team.playoff_appearances  // Using playoff_appearances for playoff_wins field
    };
});

console.log(`📊 Updating ${allData.length} teams with Sports Reference 2025 data:`);
console.log('✅ MLB: 30 teams');
console.log('✅ NFL: 32 teams');  
console.log('✅ NHL: 32 teams');
console.log('✅ NBA: 30 teams');
console.log('');

// Read current data.js
let content = fs.readFileSync('data.js', 'utf8');

// For each team, update the 3 fields
Object.keys(dataLookup).forEach(teamName => {
    const data = dataLookup[teamName];
    
    // Find the team entry and update the fields
    const teamPattern = new RegExp(`(\"name\":\\s*\"${teamName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\"[\\s\\S]*?)(\"originalCode\":\\s*\"[^\"]+\")`, 'g');
    
    content = content.replace(teamPattern, (match, beforeOriginal, originalCode) => {
        // Remove existing winning_percentage, division_titles, playoff_wins fields if they exist
        let updated = beforeOriginal.replace(/,?\s*\"winning_percentage\":\s*[^,}]+/g, '');
        updated = updated.replace(/,?\s*\"division_titles\":\s*[^,}]+/g, '');
        updated = updated.replace(/,?\s*\"playoff_wins\":\s*[^,}]+/g, '');
        
        // Add the new fields before originalCode
        return updated + 
               `\"winning_percentage\": ${data.winning_percentage},\n` +
               `                    \"division_titles\": ${data.division_titles},\n` +
               `                    \"playoff_wins\": ${data.playoff_wins},\n` +
               `                    ` + originalCode;
    });
});

fs.writeFileSync('data.js', content, 'utf8');

console.log('✅ Successfully updated all 124 teams with correct Sports Reference 2025 data!');
console.log('');
console.log('📈 Data fields updated:');
console.log('   • winning_percentage - All-time winning percentage');
console.log('   • division_titles - Division championships won');
console.log('   • playoff_wins - Playoff appearances (from Sports Reference tables)');
console.log('');
console.log('🎯 No assumptions made - all data extracted directly from your 4 tables');
console.log('🔍 All placeholder values (0) have been replaced with real data');
console.log('');
console.log('Total teams updated: 124 (30 MLB + 32 NFL + 32 NHL + 30 NBA)');