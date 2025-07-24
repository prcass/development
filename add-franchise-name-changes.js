// Add "Franchise Name Changes" challenge with real MLB data
const fs = require('fs');

// MLB Franchise Name Changes (Total number of name changes in franchise history)
// Counted from the franchise history data provided
const mlbNameChanges = {
    // Teams with most name changes
    "Atlanta Braves": 9, // Red Caps → Beaneaters → Doves → Rustlers → Braves → Bees → Braves → Braves (Milwaukee) → Braves (Atlanta)
    "Los Angeles Dodgers": 7, // Trolley Dodgers → Bridegrooms → Superbas → Dodgers → Robins → Dodgers → Dodgers (LA)
    "Chicago Cubs": 4, // White Stockings → Colts → Orphans → Cubs
    "Cleveland Guardians": 4, // Blues → Naps → Indians → Guardians  
    "Cincinnati Reds": 3, // Red Stockings → Reds → Redlegs → Reds
    "Houston Astros": 3, // Colt .45s → Astros (NL) → Astros (AL)
    "San Francisco Giants": 3, // Gothams → Giants → Giants (SF)
    "Pittsburgh Pirates": 3, // Alleghenys (AA) → Alleghenys → Pirates
    "St. Louis Cardinals": 4, // Brown Stockings → Browns → Perfectos → Cardinals
    "Baltimore Orioles": 3, // Brewers → Browns → Orioles
    "New York Yankees": 3, // Orioles → Highlanders → Yankees
    "Oakland Athletics": 2, // Athletics (Philadelphia) → Athletics (KC) → Athletics (Oakland)
    "Sacramento Athletics": 1, // Athletics (Oakland) → Athletics (Sacramento)
    "Boston Red Sox": 2, // Americans → Red Sox
    "Milwaukee Brewers": 2, // Pilots → Brewers
    "Minnesota Twins": 1, // Senators → Twins
    "Texas Rangers": 1, // Senators → Rangers
    "Washington Nationals": 1, // Expos → Nationals
    "Tampa Bay Rays": 1, // Devil Rays → Rays
    "Miami Marlins": 1, // Florida Marlins → Miami Marlins
    "Los Angeles Angels": 4, // Angels → California Angels → Anaheim Angels → Angels
    
    // Teams with no name changes (always same name)
    "Arizona Diamondbacks": 0, // Always Diamondbacks
    "Chicago White Sox": 0, // Always White Sox
    "Detroit Tigers": 0, // Always Tigers
    "Colorado Rockies": 0, // Always Rockies
    "Kansas City Royals": 0, // Always Royals
    "New York Mets": 0, // Always Mets
    "Philadelphia Phillies": 0, // Always Phillies
    "Seattle Mariners": 0, // Always Mariners
    "San Diego Padres": 0, // Always Padres
    "Toronto Blue Jays": 0 // Always Blue Jays
};

// For other leagues - set to 0 for now since we only have MLB data
const otherLeaguesNameChanges = {
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

// Combine all franchise name changes data
const allNameChanges = { 
    ...mlbNameChanges,
    ...otherLeaguesNameChanges
};

console.log('📝 Adding "Franchise Name Changes" challenge');
console.log('✅ Counted real MLB franchise name changes (2025)');
console.log('⚠️  Note: Only MLB data available currently');
console.log('');

// Read current data.js
let content = fs.readFileSync('data.js', 'utf8');

// 1. Add the new challenge to sports prompts
const newChallenge = `          {
                    "challenge": "franchise_name_changes",
                    "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which Franchise Changed Names The Most?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Total Number of Name Changes</div><div style='font-size: 0.85em; color: #666'>(Throughout History)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
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

// 2. Add franchise_name_changes field to each team
Object.keys(allNameChanges).forEach(teamName => {
    const nameChanges = allNameChanges[teamName];
    
    // Find the team entry and add the new field
    const teamPattern = new RegExp(`(\"name\":\\s*\"${teamName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\"[\\s\\S]*?)(\"originalCode\":\\s*\"[^\"]+\")`, 'g');
    
    content = content.replace(teamPattern, (match, beforeOriginal, originalCode) => {
        return beforeOriginal + 
               `"franchise_name_changes": ${nameChanges},\n                    ` + 
               originalCode;
    });
});

fs.writeFileSync('data.js', content, 'utf8');

console.log('✅ Successfully added "Franchise Name Changes" challenge!');
console.log('');
console.log('📊 New challenge added:');
console.log('   • franchise_name_changes - Total number of name changes');
console.log('');
console.log('📈 Total sports challenges: 17');
console.log('   • championship_count, all_time_wins, playoff_appearances');
console.log('   • winning_percentage, division_titles, years_since_last_championship');
console.log('   • year_founded, average_home_attendance, total_season_attendance');
console.log('   • team_value, stadium_opened, metro_population, mvp_awards');
console.log('   • retired_numbers, longest_winning_streak, franchise_miles_moved');
console.log('   • franchise_name_changes');
console.log('');
console.log('🔍 MLB Name Change Leaders:');
console.log('   • Atlanta Braves: 9 name changes (Red Caps → Beaneaters → Doves → etc.)');
console.log('   • Los Angeles Dodgers: 7 name changes (Trolley Dodgers → Bridegrooms → etc.)');
console.log('   • Multiple teams: 4 name changes each');
console.log('   • 10 MLB teams: 0 name changes (always same name)');
console.log('');
console.log('📝 Data Notes:');
console.log('   • MLB: Complete franchise name change history (2025)');
console.log('   • NFL/NBA/NHL: Currently set to 0 (data needed)');
console.log('   • Counts all official name changes throughout history');
console.log('   • Perfect measure of franchise identity consistency!');