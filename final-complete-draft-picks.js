// Create Final Complete First Overall Draft Picks Challenge - CORRECTED NBA COUNTS
const fs = require('fs');

// Complete First Overall Draft Picks by team (NFL, NHL, MLB, NBA - CORRECTED)
const completeDraftPicks = {
    // NFL Teams
    "Indianapolis Colts": 7,
    "Los Angeles Rams": 7,
    "Tampa Bay Buccaneers": 5,
    "Cleveland Browns": 5,
    "Arizona Cardinals": 5,
    "Detroit Lions": 4,
    "Atlanta Falcons": 4,
    "Buffalo Bills": 4,
    "Cincinnati Bengals": 4,
    "New England Patriots": 4,
    "Philadelphia Eagles": 3,
    "Chicago Bears": 3,
    "Pittsburgh Steelers": 3,
    "San Francisco 49ers": 3,
    "Dallas Cowboys": 3,
    "Houston Texans": 3,
    "Tennessee Titans": 3,
    "Washington Commanders": 2,
    "New York Giants": 2,
    "Green Bay Packers": 2,
    "Minnesota Vikings": 2,
    "Carolina Panthers": 2,
    "Jacksonville Jaguars": 2,
    "New Orleans Saints": 1,
    "New York Jets": 1,
    "Los Angeles Chargers": 1,
    "Las Vegas Raiders": 1,
    "Miami Dolphins": 1,
    "Kansas City Chiefs": 1,
    "Baltimore Ravens": 0,
    "Denver Broncos": 0,
    "Seattle Seahawks": 0,
    
    // NHL Teams (including trades and franchise moves)
    "Montreal Canadiens": 6,
    "New York Islanders": 5,
    "Buffalo Sabres": 4,
    "Colorado Avalanche": 4,
    "Edmonton Oilers": 4,
    "Boston Bruins": 3,
    "New Jersey Devils": 3,
    "Ottawa Senators": 3,
    "Pittsburgh Penguins": 3,
    "Tampa Bay Lightning": 3,
    "Washington Capitals": 3,
    "Detroit Red Wings": 3,
    "Dallas Stars": 3,
    "Toronto Maple Leafs": 2,
    "Chicago Blackhawks": 2,
    "New York Rangers": 2,
    "Florida Panthers": 2,
    "Winnipeg Jets": 2,
    "Arizona Coyotes": 1,
    "Los Angeles Kings": 1,
    "San Jose Sharks": 1,
    "St. Louis Blues": 1,
    "Columbus Blue Jackets": 1,
    "Philadelphia Flyers": 1,
    "Anaheim Ducks": 0,
    "Calgary Flames": 0,
    "Carolina Hurricanes": 0,
    "Minnesota Wild": 0,
    "Nashville Predators": 0,
    "Seattle Kraken": 0,
    "Utah Hockey Club": 0,
    "Vancouver Canucks": 0,
    "Vegas Golden Knights": 0,
    
    // MLB Teams
    "Pittsburgh Pirates": 6,
    "Houston Astros": 5,
    "New York Mets": 5,
    "San Diego Padres": 5,
    "Seattle Mariners": 4,
    "Tampa Bay Rays": 4,
    "Baltimore Orioles": 3,
    "Detroit Tigers": 3,
    "Minnesota Twins": 3,
    "Washington Nationals": 3,
    "Arizona Diamondbacks": 2,
    "Atlanta Braves": 2,
    "Chicago White Sox": 2,
    "Los Angeles Angels": 2,
    "New York Yankees": 2,
    "Philadelphia Phillies": 2,
    "Texas Rangers": 2,
    "Chicago Cubs": 1,
    "Cleveland Guardians": 1,
    "Kansas City Royals": 1,
    "Miami Marlins": 1,
    "Milwaukee Brewers": 1,
    "Oakland Athletics": 1,
    "Boston Red Sox": 0,
    "Cincinnati Reds": 0,
    "Colorado Rockies": 0,
    "Los Angeles Dodgers": 0,
    "San Francisco Giants": 0,
    "St. Louis Cardinals": 0,
    "Toronto Blue Jays": 0,
    
    // NBA Teams - CORRECTED COUNTS
    "Cleveland Cavaliers": 6,      // CORRECTED: 1971, 1986, 2003, 2011, 2013, 2014
    "Houston Rockets": 5,          // CORRECTED: 1968, 1976, 1983, 1984, 2002
    "Sacramento Kings": 5,         // CORRECTED: 1956, 1957, 1959, 1960, 1989
    "Atlanta Hawks": 4,            // CORRECTED: 1952, 1955, 1975, 2024
    "Milwaukee Bucks": 4,          // CORRECTED: 1969, 1977, 1994, 2005
    "New York Knicks": 4,          // CORRECTED: 1963, 1964, 1966, 1985
    "Orlando Magic": 4,            // CORRECTED: 1992, 1993, 2004, 2022
    "Philadelphia 76ers": 4,       // SAME: 1973, 1996, 2016, 2017
    "Portland Trail Blazers": 4,   // CORRECTED: 1972, 1974, 1978, 2007
    "Washington Wizards": 4,       // CORRECTED: 1961, 1962, 2001, 2010
    "Detroit Pistons": 3,          // CORRECTED: 1967, 1970, 2021
    "Golden State Warriors": 3,    // CORRECTED: 1965, 1980, 1995
    "Los Angeles Clippers": 3,     // SAME: 1988, 1998, 2009
    "Los Angeles Lakers": 3,       // CORRECTED: 1958, 1979, 1982
    "San Antonio Spurs": 3,        // SAME: 1987, 1997, 2023
    "Brooklyn Nets": 2,            // SAME: 1990, 2000
    "Chicago Bulls": 2,            // CORRECTED: 1999, 2008  
    "Dallas Mavericks": 2,         // SAME: 1981, 2025
    "Minnesota Timberwolves": 2,   // SAME: 2015, 2020
    "New Orleans Pelicans": 2,     // SAME: 2012, 2019
    "Boston Celtics": 1,           // SAME: 1950
    "Charlotte Hornets": 1,        // SAME: 1991
    "Phoenix Suns": 1,             // SAME: 2018
    "Toronto Raptors": 1,          // SAME: 2006
    "Denver Nuggets": 0,
    "Indiana Pacers": 0,
    "Memphis Grizzlies": 0,
    "Miami Heat": 0,
    "Oklahoma City Thunder": 0,
    "Utah Jazz": 0
};

// Load current data.js
const window = {};
eval(fs.readFileSync('data.js', 'utf8'));
const gameData = window.GAME_DATA;

console.log('🏈🏒⚾🏀 FINAL Complete First Overall Draft Picks Challenge');
console.log('========================================================');
console.log('📊 Unified challenge for all 124 teams - CORRECTED NBA COUNTS');

let updatedCount = 0;
Object.values(gameData.categories.sports.items).forEach(team => {
    if (completeDraftPicks.hasOwnProperty(team.name)) {
        // Update with corrected counts
        team.draft_picks_first_overall = completeDraftPicks[team.name];
        updatedCount++;
        
        const league = team.league;
        console.log(`✅ ${team.name} (${league}): ${completeDraftPicks[team.name]} picks`);
    }
});

console.log(`\n✅ Updated ${updatedCount} teams with CORRECTED draft pick data`);

// Write updated data.js
const newContent = `/**
 * Outrank Game Data - v4.8 CORRECTED Complete Draft Picks Challenge
 * Updated: ${new Date().toISOString()}
 * CORRECTED First Overall Draft Picks for ALL 4 LEAGUES (NFL, NHL, MLB, NBA)
 * Fixed NBA counts: Cleveland Cavaliers (6), Houston Rockets (5), Sacramento Kings (5), etc.
 * Works across all 124 teams with unified field: draft_picks_first_overall
 * Includes trades, acquisitions, and franchise history for all leagues
 * All 124 teams across 4 leagues with complete data
 * Countries: 40, Movies: 40, Sports: 124, Companies: 40
 * Total Categories: 4, Sports Challenges: 19 (corrected 4-league draft picks)
 */

window.GAME_DATA = ${JSON.stringify(gameData, null, 4)};

// Console output for verification
console.log('✅ Outrank v4.8 CORRECTED Draft Picks - Game data loaded with 4 categories');
console.log('🌍 Countries:', Object.keys(window.GAME_DATA.categories.countries.items).length, 'countries with', window.GAME_DATA.categories.countries.prompts.length, 'challenges');
console.log('🎬 Movies:', Object.keys(window.GAME_DATA.categories.movies.items).length, 'movies with', window.GAME_DATA.categories.movies.prompts.length, 'challenges');
console.log('🏢 Companies:', Object.keys(window.GAME_DATA.categories.companies.items).length, 'companies with', window.GAME_DATA.categories.companies.prompts.length, 'challenges');
console.log('🏈 Sports:', Object.keys(window.GAME_DATA.categories.sports.items).length, 'teams with', window.GAME_DATA.categories.sports.prompts.length, 'challenges (19 total, corrected draft)');
console.log('📊 Total items:', Object.keys(window.GAME_DATA.categories.countries.items).length + Object.keys(window.GAME_DATA.categories.movies.items).length + Object.keys(window.GAME_DATA.categories.companies.items).length + Object.keys(window.GAME_DATA.categories.sports.items).length);
console.log('🎯 Total challenges:', window.GAME_DATA.categories.countries.prompts.length + window.GAME_DATA.categories.movies.prompts.length + window.GAME_DATA.categories.companies.prompts.length + window.GAME_DATA.categories.sports.prompts.length);`;

fs.writeFileSync('data.js', newContent);

// Show CORRECTED complete rankings
console.log('\n🏆 CORRECTED COMPLETE FIRST OVERALL DRAFT PICKS LEADERS:');
console.log('========================================================');

console.log('\n💰 TOP 25 ACROSS ALL 4 LEAGUES (CORRECTED):');
const allTeams = Object.entries(completeDraftPicks)
    .sort((a, b) => b[1] - a[1]);

allTeams.slice(0, 25).forEach((entry, i) => {
    const [team, picks] = entry;
    // Find league for each team
    const teamObj = Object.values(gameData.categories.sports.items).find(t => t.name === team);
    const league = teamObj ? teamObj.league : '?';
    console.log(`${i+1}. ${team} (${league}): ${picks} picks`);
});

console.log('\n📊 KEY CORRECTIONS:');
console.log('✅ Cleveland Cavaliers: 4 → 6 picks (added 1986 Brad Daugherty)');
console.log('✅ Houston Rockets: 3 → 5 picks (NBA franchise, not just current era)');
console.log('✅ Sacramento Kings: 1 → 5 picks (includes Rochester/Cincinnati Royals era)');
console.log('✅ Washington Wizards: 2 → 4 picks (includes Chicago Packers/Zephyrs era)');

console.log('\n🏀 CORRECTED NBA TOP 10:');
allTeams.filter(([team]) => {
    const teamObj = Object.values(gameData.categories.sports.items).find(t => t.name === team);
    return teamObj && teamObj.league === 'NBA';
}).slice(0, 10).forEach(([team, picks], i) => {
    console.log(`${i+1}. ${team}: ${picks} picks`);
});

console.log('\n📊 FINAL CROSS-LEAGUE DISTRIBUTION (CORRECTED):');
const distribution = {};
allTeams.forEach(([team, picks]) => {
    if (!distribution[picks]) distribution[picks] = 0;
    distribution[picks]++;
});

Object.keys(distribution).sort((a, b) => b - a).forEach(picks => {
    console.log(`${picks} picks: ${distribution[picks]} teams`);
});

console.log(`\n📊 Total teams updated: ${updatedCount}/124`);
console.log('📈 CORRECTED challenge: "Most First Overall Draft Picks?" (ALL 4 LEAGUES)');
console.log('🎯 Perfect unified challenge with accurate NBA franchise history!');

// Verify the new file
try {
    const testWindow = {};
    eval(fs.readFileSync('data.js', 'utf8'));
    console.log('\n✅ Syntax validation passed!');
    console.log(`✅ Total sports challenges: ${testWindow.GAME_DATA.categories.sports.prompts.length}`);
    
    // Verify Cleveland Cavaliers specifically
    const cavs = Object.values(testWindow.GAME_DATA.categories.sports.items).find(t => t.name === 'Cleveland Cavaliers');
    console.log(`✅ Cleveland Cavaliers verification: ${cavs ? cavs.draft_picks_first_overall : 'not found'} picks`);
} catch (error) {
    console.error('\n❌ Syntax error in generated file:', error.message);
}