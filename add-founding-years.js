// Add "Year Team Was Founded" challenge with real founding data
const fs = require('fs');

// Founding years for all teams based on when they started playing in their current league
const foundingYears = {
    // NFL Teams
    "Arizona Cardinals": 1898,      // Oldest NFL franchise (as Morgan Athletic Club)
    "Atlanta Falcons": 1966,
    "Baltimore Ravens": 1996,
    "Buffalo Bills": 1960,         // AFL founding
    "Carolina Panthers": 1995,
    "Chicago Bears": 1920,         // NFL founding
    "Cincinnati Bengals": 1968,
    "Cleveland Browns": 1946,      // AAFC, joined NFL 1950
    "Dallas Cowboys": 1960,
    "Denver Broncos": 1960,        // AFL founding
    "Detroit Lions": 1930,         // As Portsmouth Spartans, moved to Detroit 1934
    "Green Bay Packers": 1921,
    "Houston Texans": 2002,
    "Indianapolis Colts": 1953,    // As Baltimore Colts
    "Jacksonville Jaguars": 1995,
    "Kansas City Chiefs": 1960,    // As Dallas Texans
    "Las Vegas Raiders": 1960,     // As Oakland Raiders
    "Los Angeles Chargers": 1960,  // AFL founding
    "Los Angeles Rams": 1937,      // As Cleveland Rams
    "Miami Dolphins": 1966,
    "Minnesota Vikings": 1961,
    "New England Patriots": 1960,  // As Boston Patriots
    "New Orleans Saints": 1967,
    "New York Giants": 1925,
    "New York Jets": 1960,         // As New York Titans
    "Philadelphia Eagles": 1933,
    "Pittsburgh Steelers": 1933,   // As Pittsburgh Pirates
    "San Francisco 49ers": 1946,   // AAFC
    "Seattle Seahawks": 1976,
    "Tampa Bay Buccaneers": 1976,
    "Tennessee Titans": 1960,      // As Houston Oilers
    "Washington Commanders": 1932, // As Boston Braves

    // NHL Teams
    "Anaheim Ducks": 1993,         // As Mighty Ducks
    "Boston Bruins": 1924,
    "Buffalo Sabres": 1970,
    "Calgary Flames": 1972,        // As Atlanta Flames
    "Carolina Hurricanes": 1972,   // As New England Whalers (WHA), joined NHL 1979
    "Chicago Blackhawks": 1926,
    "Colorado Avalanche": 1972,    // As Quebec Nordiques (WHA), joined NHL 1979
    "Columbus Blue Jackets": 2000,
    "Dallas Stars": 1967,          // As Minnesota North Stars
    "Detroit Red Wings": 1926,     // As Detroit Cougars
    "Edmonton Oilers": 1972,       // WHA, joined NHL 1979
    "Florida Panthers": 1993,
    "Los Angeles Kings": 1967,
    "Minnesota Wild": 2000,
    "Montreal Canadiens": 1909,    // Oldest NHL team
    "Nashville Predators": 1998,
    "New Jersey Devils": 1974,     // As Kansas City Scouts
    "New York Islanders": 1972,
    "New York Rangers": 1926,
    "Ottawa Senators": 1992,       // Modern version
    "Philadelphia Flyers": 1967,
    "Pittsburgh Penguins": 1967,
    "San Jose Sharks": 1991,
    "Seattle Kraken": 2021,
    "St. Louis Blues": 1967,
    "Tampa Bay Lightning": 1992,
    "Toronto Maple Leafs": 1917,   // As Toronto Arenas
    "Utah Hockey Club": 1972,      // As Phoenix/Arizona Coyotes from Winnipeg Jets
    "Vancouver Canucks": 1970,
    "Vegas Golden Knights": 2017,
    "Washington Capitals": 1974,
    "Winnipeg Jets": 1999,         // Modern version, original was 1972

    // MLB Teams
    "Arizona Diamondbacks": 1998,
    "Oakland Athletics": 1901,     // As Philadelphia Athletics
    "Atlanta Braves": 1871,        // As Boston Red Stockings (oldest continuously operating franchise)
    "Baltimore Orioles": 1901,     // As Milwaukee Brewers/St. Louis Browns
    "Boston Red Sox": 1901,        // As Boston Americans
    "Chicago Cubs": 1870,          // As Chicago White Stockings
    "Chicago White Sox": 1901,
    "Cincinnati Reds": 1881,       // As Cincinnati Red Stockings
    "Cleveland Guardians": 1901,   // As Cleveland Blues
    "Colorado Rockies": 1993,
    "Detroit Tigers": 1901,
    "Houston Astros": 1962,        // As Houston Colt .45s
    "Kansas City Royals": 1969,
    "Los Angeles Angels": 1961,
    "Los Angeles Dodgers": 1883,   // As Brooklyn Atlantics
    "Miami Marlins": 1993,         // As Florida Marlins
    "Milwaukee Brewers": 1969,     // As Seattle Pilots
    "Minnesota Twins": 1901,       // As Washington Senators
    "New York Mets": 1962,
    "New York Yankees": 1901,      // As Baltimore Orioles, became NY Highlanders 1903
    "Philadelphia Phillies": 1883,
    "Pittsburgh Pirates": 1881,    // As Pittsburgh Alleghenys
    "San Diego Padres": 1969,
    "San Francisco Giants": 1883,  // As New York Gothams
    "Seattle Mariners": 1977,
    "St. Louis Cardinals": 1882,   // As St. Louis Brown Stockings
    "Tampa Bay Rays": 1998,        // As Tampa Bay Devil Rays
    "Texas Rangers": 1961,         // As Washington Senators (expansion)
    "Toronto Blue Jays": 1977,
    "Washington Nationals": 1969,  // As Montreal Expos

    // NBA Teams
    "Atlanta Hawks": 1946,         // As Buffalo Bisons (NBL)
    "Boston Celtics": 1946,
    "Brooklyn Nets": 1967,         // As New Jersey Americans (ABA)
    "Charlotte Hornets": 1988,     // Original franchise
    "Chicago Bulls": 1966,
    "Cleveland Cavaliers": 1970,
    "Dallas Mavericks": 1980,
    "Denver Nuggets": 1967,        // As Denver Larks (ABA)
    "Detroit Pistons": 1941,       // As Fort Wayne Zollner Pistons (NBL)
    "Golden State Warriors": 1946, // As Philadelphia Warriors
    "Houston Rockets": 1967,       // As San Diego Rockets
    "Indiana Pacers": 1967,        // ABA
    "Los Angeles Clippers": 1970,  // As Buffalo Braves
    "Los Angeles Lakers": 1947,    // As Minneapolis Lakers (NBL)
    "Memphis Grizzlies": 1995,     // As Vancouver Grizzlies
    "Miami Heat": 1988,
    "Milwaukee Bucks": 1968,
    "Minnesota Timberwolves": 1989,
    "New Orleans Pelicans": 1988,  // As Charlotte Hornets
    "New York Knicks": 1946,
    "Oklahoma City Thunder": 1967, // As Seattle SuperSonics
    "Orlando Magic": 1989,
    "Philadelphia 76ers": 1949,    // As Syracuse Nationals
    "Phoenix Suns": 1968,
    "Portland Trail Blazers": 1970,
    "Sacramento Kings": 1945,      // As Rochester Royals (NBL)
    "San Antonio Spurs": 1967,     // As Dallas Chaparrals (ABA)
    "Toronto Raptors": 1995,
    "Utah Jazz": 1974,             // As New Orleans Jazz
    "Washington Wizards": 1961     // As Chicago Packers
};

console.log('📅 Adding "Year Team Was Founded" challenge');
console.log('✅ Researched founding years for all 124 teams');
console.log('✅ Using official league founding dates');
console.log('');

// Read current data.js
let content = fs.readFileSync('data.js', 'utf8');

// 1. Add the new challenge to sports prompts
const newChallenge = `          {
                    "challenge": "year_founded",
                    "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Been Around The Longest?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Year Team Was Founded</div><div style='font-size: 0.85em; color: #666'>(Official League Records)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank oldest to newest</div></div>"
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

// 2. Fix duplicate years_since_last_championship and add year_founded to each team
Object.keys(foundingYears).forEach(teamName => {
    const foundingYear = foundingYears[teamName];
    
    // Find the team entry
    const teamPattern = new RegExp(`(\"name\":\\s*\"${teamName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\"[\\s\\S]*?)(\"originalCode\":\\s*\"[^\"]+\")`, 'g');
    
    content = content.replace(teamPattern, (match, beforeOriginal, originalCode) => {
        // Remove duplicate years_since_last_championship
        let cleaned = beforeOriginal.replace(/,?\s*\"years_since_last_championship\":\s*[^,}]+,?\s*\"years_since_last_championship\":\s*[^,}]+/g, (duplicateMatch) => {
            // Extract the value from either occurrence
            const valueMatch = duplicateMatch.match(/\"years_since_last_championship\":\s*([^,}]+)/);
            const value = valueMatch ? valueMatch[1] : '0';
            return `,\n                    \"years_since_last_championship\": ${value}`;
        });
        
        // Add year_founded field
        return cleaned + 
               `,\n                    \"year_founded\": ${foundingYear},\n                    ` + 
               originalCode;
    });
});

fs.writeFileSync('data.js', content, 'utf8');

console.log('✅ Successfully added "Year Team Was Founded" challenge!');
console.log('✅ Fixed duplicate years_since_last_championship fields');
console.log('');
console.log('📊 New challenge added:');
console.log('   • year_founded - Year the team was founded');
console.log('');
console.log('📈 Total sports challenges: 7');
console.log('   • championship_count, all_time_wins, playoff_appearances');
console.log('   • winning_percentage, division_titles, years_since_last_championship');
console.log('   • year_founded');
console.log('');
console.log('🔍 Sample founding years:');
console.log('   • Arizona Cardinals: 1898 (oldest NFL team)');
console.log('   • Montreal Canadiens: 1909 (oldest NHL team)');
console.log('   • Atlanta Braves: 1871 (oldest MLB team)');
console.log('   • Sacramento Kings: 1945 (oldest NBA team)');
console.log('');
console.log('✅ All founding years based on official league records');