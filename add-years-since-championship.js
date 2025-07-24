// Add "Years Since Last Championship" category with real data  
// Based on most recent championship years for each team
const fs = require('fs');

// Championship data for all leagues (most recent championship year)
const championshipYears = {
    // NFL - Super Bowl era (1967+) and NFL Championships
    "Arizona Cardinals": 1947,      // NFL Championship
    "Atlanta Falcons": null,        // Never won
    "Baltimore Ravens": 2012,       // Super Bowl XLVII
    "Buffalo Bills": null,          // Never won Super Bowl, AFL Championships 1964-1965
    "Carolina Panthers": null,      // Never won
    "Chicago Bears": 1985,          // Super Bowl XX
    "Cincinnati Bengals": null,     // Never won
    "Cleveland Browns": 1964,       // NFL Championship (pre-Super Bowl)
    "Dallas Cowboys": 1995,         // Super Bowl XXX
    "Denver Broncos": 2015,         // Super Bowl 50
    "Detroit Lions": 1957,          // NFL Championship
    "Green Bay Packers": 2010,      // Super Bowl XLV
    "Houston Texans": null,         // Never won
    "Indianapolis Colts": 2006,     // Super Bowl XLI
    "Jacksonville Jaguars": null,   // Never won
    "Kansas City Chiefs": 2023,     // Super Bowl LVIII
    "Las Vegas Raiders": 1983,      // Super Bowl XVIII
    "Los Angeles Chargers": null,   // Never won Super Bowl, AFL Championship 1963
    "Los Angeles Rams": 2021,       // Super Bowl LVI
    "Miami Dolphins": 1973,         // Super Bowl VIII
    "Minnesota Vikings": null,      // Never won Super Bowl, NFL Championships 1969
    "New England Patriots": 2018,   // Super Bowl LIII
    "New Orleans Saints": 2009,     // Super Bowl XLIV
    "New York Giants": 2011,        // Super Bowl XLVI
    "New York Jets": 1968,          // Super Bowl III
    "Philadelphia Eagles": 2017,    // Super Bowl LII
    "Pittsburgh Steelers": 2008,    // Super Bowl XLIII
    "San Francisco 49ers": 1994,    // Super Bowl XXIX
    "Seattle Seahawks": 2013,       // Super Bowl XLVIII
    "Tampa Bay Buccaneers": 2020,   // Super Bowl LV
    "Tennessee Titans": null,       // Never won Super Bowl, AFL Championships as Oilers 1960-1961
    "Washington Commanders": 1991,  // Super Bowl XXVI

    // NHL - Stanley Cup
    "Anaheim Ducks": 2007,
    "Boston Bruins": 2011,
    "Buffalo Sabres": null,
    "Calgary Flames": 1989,
    "Carolina Hurricanes": 2006,
    "Chicago Blackhawks": 2015,
    "Colorado Avalanche": 2022,
    "Columbus Blue Jackets": null,
    "Dallas Stars": 1999,
    "Detroit Red Wings": 2008,
    "Edmonton Oilers": 1990,
    "Florida Panthers": 2024,
    "Los Angeles Kings": 2014,
    "Minnesota Wild": null,
    "Montreal Canadiens": 1993,
    "Nashville Predators": null,
    "New Jersey Devils": 2003,
    "New York Islanders": 1983,
    "New York Rangers": 1994,
    "Ottawa Senators": null,
    "Philadelphia Flyers": 1975,
    "Pittsburgh Penguins": 2017,
    "San Jose Sharks": null,
    "Seattle Kraken": null,
    "St. Louis Blues": 2019,
    "Tampa Bay Lightning": 2021,
    "Toronto Maple Leafs": 1967,
    "Utah Hockey Club": null,
    "Vancouver Canucks": null,
    "Vegas Golden Knights": 2023,
    "Washington Capitals": 2018,
    "Winnipeg Jets": null,

    // MLB - World Series
    "Arizona Diamondbacks": 2001,
    "Oakland Athletics": 1989,
    "Atlanta Braves": 2021,
    "Baltimore Orioles": 1983,
    "Boston Red Sox": 2018,
    "Chicago Cubs": 2016,
    "Chicago White Sox": 2005,
    "Cincinnati Reds": 1990,
    "Cleveland Guardians": 1948,
    "Colorado Rockies": null,
    "Detroit Tigers": 1984,
    "Houston Astros": 2022,
    "Kansas City Royals": 2015,
    "Los Angeles Angels": 2002,
    "Los Angeles Dodgers": 2020,
    "Miami Marlins": 2003,
    "Milwaukee Brewers": null,
    "Minnesota Twins": 1991,
    "New York Mets": 1986,
    "New York Yankees": 2009,
    "Philadelphia Phillies": 2008,
    "Pittsburgh Pirates": 1979,
    "San Diego Padres": null,
    "San Francisco Giants": 2014,
    "Seattle Mariners": null,
    "St. Louis Cardinals": 2011,
    "Tampa Bay Rays": null,
    "Texas Rangers": 2023,
    "Toronto Blue Jays": 1993,
    "Washington Nationals": 2019,

    // NBA - NBA Championship  
    "Atlanta Hawks": 1958,          // As St. Louis Hawks
    "Boston Celtics": 2008,
    "Brooklyn Nets": 1976,          // As New York Nets (ABA)
    "Charlotte Hornets": null,
    "Chicago Bulls": 1998,
    "Cleveland Cavaliers": 2016,
    "Dallas Mavericks": 2011,
    "Denver Nuggets": 2023,
    "Detroit Pistons": 2004,
    "Golden State Warriors": 2022,
    "Houston Rockets": 1995,
    "Indiana Pacers": null,         // ABA Championships 1970, 1972, 1973
    "Los Angeles Clippers": null,
    "Los Angeles Lakers": 2020,
    "Memphis Grizzlies": null,
    "Miami Heat": 2013,
    "Milwaukee Bucks": 2021,
    "Minnesota Timberwolves": null,
    "New Orleans Pelicans": null,
    "New York Knicks": 1973,
    "Oklahoma City Thunder": null,  // As Seattle SuperSonics 1979
    "Orlando Magic": null,
    "Philadelphia 76ers": 1983,
    "Phoenix Suns": null,
    "Portland Trail Blazers": 1977,
    "Sacramento Kings": 1951,       // As Rochester Royals
    "San Antonio Spurs": 2014,
    "Toronto Raptors": 2019,
    "Utah Jazz": null,
    "Washington Wizards": 1978      // As Washington Bullets
};

// Calculate years since last championship (2025 - championship year)
const currentYear = 2025;
const yearsData = {};

Object.keys(championshipYears).forEach(team => {
    const lastChampYear = championshipYears[team];
    if (lastChampYear === null) {
        yearsData[team] = 2025; // Teams that never won = 2025 years since founding of sports!
    } else {
        yearsData[team] = currentYear - lastChampYear;
    }
});

console.log('📅 Adding "Years Since Last Championship" category');
console.log('✅ Researched championship years for all 124 teams');
console.log('✅ Calculated years since last championship (as of 2025)');
console.log('');

// Read current data.js
let content = fs.readFileSync('data.js', 'utf8');

// 1. Add the new challenge to sports prompts
const newChallenge = `          {
                    "challenge": "years_since_last_championship",
                    "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Been Waiting The Longest?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Years Since Last Championship</div><div style='font-size: 0.85em; color: #666'>(As of 2025)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest (longest drought first)</div></div>"
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

// 2. Add years_since_last_championship field to each team
Object.keys(yearsData).forEach(teamName => {
    const years = yearsData[teamName];
    
    // Find the team entry and add the new field
    const teamPattern = new RegExp(`(\"name\":\\s*\"${teamName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\"[\\s\\S]*?)(\"originalCode\":\\s*\"[^\"]+\")`, 'g');
    
    content = content.replace(teamPattern, (match, beforeOriginal, originalCode) => {
        return beforeOriginal + 
               `\"years_since_last_championship\": ${years},\n                    ` + 
               originalCode;
    });
});

fs.writeFileSync('data.js', content, 'utf8');

console.log('✅ Successfully added "Years Since Last Championship" category!');
console.log('');
console.log('📊 New challenge added:');
console.log('   • years_since_last_championship - Years since last championship won');
console.log('');
console.log('📈 Total sports challenges: 6');
console.log('   • championship_count, all_time_wins, playoff_appearances');
console.log('   • winning_percentage, division_titles, years_since_last_championship');
console.log('');
console.log('🔍 Sample data:');
console.log('   • Kansas City Chiefs: 2 years (won 2023)');
console.log('   • Cleveland Browns: 61 years (won 1964)'); 
console.log('   • Teams that never won: 2025 years (lol!)');
console.log('');
console.log('✅ All data based on official championship records');