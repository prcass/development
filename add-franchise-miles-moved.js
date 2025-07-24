// Add "Franchise Miles Moved" challenge with real relocation data
const fs = require('fs');

// MLB Franchise Miles Moved (Total Distance of All Relocations)
// Calculated using city-to-city distances for major relocations only
const mlbFranchiseMiles = {
    // Major relocations only (city changes, not just name changes)
    "Baltimore Orioles": 1050, // St. Louis → Baltimore (1954): ~1050 miles
    "Atlanta Braves": 1550, // Boston → Milwaukee (1953): ~850 + Milwaukee → Atlanta (1966): ~700 = ~1550 miles
    "Houston Astros": 0, // No city moves (stayed in Houston, just league change)
    "Los Angeles Dodgers": 2780, // Brooklyn → Los Angeles (1958): ~2780 miles
    "Milwaukee Brewers": 850, // Seattle → Milwaukee (1970): ~850 miles (as Pilots to Brewers)
    "Minnesota Twins": 1120, // Washington → Minneapolis (1961): ~1120 miles
    "Oakland Athletics": 2400, // Philadelphia → Kansas City (1955): ~1150 + KC → Oakland (1968): ~1250 = ~2400 miles
    "Sacramento Athletics": 90, // Oakland → Sacramento (2025): ~90 miles
    "San Francisco Giants": 2900, // New York → San Francisco (1958): ~2900 miles
    "Texas Rangers": 1200, // Washington → Arlington/Dallas (1972): ~1200 miles
    "Washington Nationals": 1100, // Montreal → Washington (2005): ~1100 miles
    
    // Teams that never moved cities (only name changes in same city)
    "Arizona Diamondbacks": 0, // Expansion team in Phoenix
    "Boston Red Sox": 0, // Always in Boston
    "Chicago White Sox": 0, // Always in Chicago
    "Chicago Cubs": 0, // Always in Chicago
    "Cleveland Guardians": 0, // Always in Cleveland
    "Cincinnati Reds": 0, // Always in Cincinnati
    "Detroit Tigers": 0, // Always in Detroit
    "Colorado Rockies": 0, // Expansion team in Denver
    "Kansas City Royals": 0, // Expansion team in Kansas City
    "Miami Marlins": 0, // Always in Miami area
    "Los Angeles Angels": 0, // Always in LA area (just moved within metro)
    "New York Mets": 0, // Expansion team in New York
    "New York Yankees": 0, // Always in New York area
    "Philadelphia Phillies": 0, // Always in Philadelphia
    "Pittsburgh Pirates": 0, // Always in Pittsburgh
    "Seattle Mariners": 0, // Expansion team in Seattle
    "St. Louis Cardinals": 0, // Always in St. Louis
    "Tampa Bay Rays": 0, // Expansion team in Tampa Bay
    "San Diego Padres": 0, // Expansion team in San Diego
    "Toronto Blue Jays": 0 // Expansion team in Toronto
};

// For other leagues - set to 0 for now since we only have MLB data
const otherLeaguesMiles = {
    // NFL teams - will need research
    "Buffalo Bills": 0,
    "Miami Dolphins": 0,
    "New England Patriots": 0,
    "New York Jets": 0,
    "Baltimore Ravens": 0,
    "Cincinnati Bengals": 0,
    "Cleveland Browns": 0,
    "Pittsburgh Steelers": 0,
    "Houston Texans": 0,
    "Indianapolis Colts": 0,
    "Jacksonville Jaguars": 0,
    "Tennessee Titans": 0,
    "Denver Broncos": 0,
    "Kansas City Chiefs": 0,
    "Las Vegas Raiders": 0,
    "Los Angeles Chargers": 0,
    "Dallas Cowboys": 0,
    "New York Giants": 0,
    "Philadelphia Eagles": 0,
    "Washington Commanders": 0,
    "Chicago Bears": 0,
    "Detroit Lions": 0,
    "Green Bay Packers": 0,
    "Minnesota Vikings": 0,
    "Atlanta Falcons": 0,
    "Carolina Panthers": 0,
    "New Orleans Saints": 0,
    "Tampa Bay Buccaneers": 0,
    "Arizona Cardinals": 0,
    "Los Angeles Rams": 0,
    "San Francisco 49ers": 0,
    "Seattle Seahawks": 0,
    
    // NBA teams - will need research
    "Atlanta Hawks": 0,
    "Boston Celtics": 0,
    "Brooklyn Nets": 0,
    "Charlotte Hornets": 0,
    "Chicago Bulls": 0,
    "Cleveland Cavaliers": 0,
    "Detroit Pistons": 0,
    "Indiana Pacers": 0,
    "Miami Heat": 0,
    "Milwaukee Bucks": 0,
    "New York Knicks": 0,
    "Orlando Magic": 0,
    "Philadelphia 76ers": 0,
    "Toronto Raptors": 0,
    "Washington Wizards": 0,
    "Dallas Mavericks": 0,
    "Denver Nuggets": 0,
    "Golden State Warriors": 0,
    "Houston Rockets": 0,
    "Los Angeles Clippers": 0,
    "Los Angeles Lakers": 0,
    "Memphis Grizzlies": 0,
    "Minnesota Timberwolves": 0,
    "New Orleans Pelicans": 0,
    "Oklahoma City Thunder": 0,
    "Phoenix Suns": 0,
    "Portland Trail Blazers": 0,
    "Sacramento Kings": 0,
    "San Antonio Spurs": 0,
    "Utah Jazz": 0,
    
    // NHL teams - will need research
    "Boston Bruins": 0,
    "Buffalo Sabres": 0,
    "Carolina Hurricanes": 0,
    "Columbus Blue Jackets": 0,
    "Detroit Red Wings": 0,
    "Florida Panthers": 0,
    "Montreal Canadiens": 0,
    "Nashville Predators": 0,
    "New Jersey Devils": 0,
    "New York Islanders": 0,
    "New York Rangers": 0,
    "Ottawa Senators": 0,
    "Philadelphia Flyers": 0,
    "Pittsburgh Penguins": 0,
    "Tampa Bay Lightning": 0,
    "Toronto Maple Leafs": 0,
    "Washington Capitals": 0,
    "Anaheim Ducks": 0,
    "Calgary Flames": 0,
    "Chicago Blackhawks": 0,
    "Colorado Avalanche": 0,
    "Dallas Stars": 0,
    "Edmonton Oilers": 0,
    "Los Angeles Kings": 0,
    "Minnesota Wild": 0,
    "San Jose Sharks": 0,
    "Seattle Kraken": 0,
    "St. Louis Blues": 0,
    "Utah Hockey Club": 0,
    "Vancouver Canucks": 0,
    "Vegas Golden Knights": 0,
    "Winnipeg Jets": 0
};

// Combine all franchise miles data
const allFranchiseMiles = { 
    ...mlbFranchiseMiles,
    ...otherLeaguesMiles
};

console.log('✈️ Adding "Franchise Miles Moved" challenge');
console.log('✅ Calculated real MLB franchise relocation distances (2025)');
console.log('⚠️  Note: Only MLB data available currently');
console.log('');

// Read current data.js
let content = fs.readFileSync('data.js', 'utf8');

// 1. Add the new challenge to sports prompts
const newChallenge = `          {
                    "challenge": "franchise_miles_moved",
                    "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which Franchise Traveled The Farthest?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Total Miles Moved in Relocations</div><div style='font-size: 0.85em; color: #666'>(City-to-City Distances)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
          }`;

// Find the sports prompts section and add the new challenge
const sportsStart = content.indexOf('"sports": {');
const promptsStart = content.indexOf('"prompts": [', sportsStart);
const promptsEnd = content.indexOf(']', promptsStart);

if (sportsStart !== -1 && promptsStart !== -1 && promptsEnd !== -1) {
    const beforePrompts = content.substring(0, promptsEnd);
    const afterPrompts = content.substring(promptsEnd);
    
    content = beforePrompts + ',\n' + newChallenge + '\n            ' + afterPrompts;
}

// 2. Add franchise_miles_moved field to each team
Object.keys(allFranchiseMiles).forEach(teamName => {
    const milesMovedInfo = allFranchiseMiles[teamName];
    
    // Find the team entry and add the new field
    const teamPattern = new RegExp(`(\"name\":\\s*\"${teamName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\"[\\s\\S]*?)(\"originalCode\":\\s*\"[^\"]+\")`, 'g');
    
    content = content.replace(teamPattern, (match, beforeOriginal, originalCode) => {
        return beforeOriginal + 
               `"franchise_miles_moved": ${milesMovedInfo},\n                    ` + 
               originalCode;
    });
});

fs.writeFileSync('data.js', content, 'utf8');

console.log('✅ Successfully added "Franchise Miles Moved" challenge!');
console.log('');
console.log('📊 New challenge added:');
console.log('   • franchise_miles_moved - Total miles moved in all relocations');
console.log('');
console.log('📈 Total sports challenges: 16');
console.log('   • championship_count, all_time_wins, playoff_appearances');
console.log('   • winning_percentage, division_titles, years_since_last_championship');
console.log('   • year_founded, average_home_attendance, total_season_attendance');
console.log('   • team_value, stadium_opened, metro_population, mvp_awards');
console.log('   • retired_numbers, longest_winning_streak, franchise_miles_moved');
console.log('');
console.log('🔍 MLB Franchise Travel Leaders:');
console.log('   • San Francisco Giants: 2,900 miles (New York → San Francisco)');
console.log('   • Los Angeles Dodgers: 2,780 miles (Brooklyn → Los Angeles)');
console.log('   • Oakland Athletics: 2,400 miles (Philadelphia → KC → Oakland)');
console.log('   • Atlanta Braves: 1,550 miles (Boston → Milwaukee → Atlanta)');
console.log('');
console.log('📝 Data Notes:');
console.log('   • MLB: Complete franchise relocation distances (2025)');
console.log('   • NFL/NBA/NHL: Currently set to 0 (data needed)');
console.log('   • Only major city relocations counted (not metro moves)');
console.log('   • Perfect measure of franchise wanderlust vs stability!');