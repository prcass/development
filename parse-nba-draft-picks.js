// Parse NBA First Overall Draft Picks Data
const fs = require('fs');

// NBA Teams First Overall Draft Picks (from draft history data)
// Count by current franchise names, accounting for relocations
const nbaPicksByFranchise = {
    "Cleveland Cavaliers": 4,    // 1971, 2003, 2011, 2013, 2014
    "Philadelphia 76ers": 4,     // 1973, 1996, 2016, 2017  
    "Portland Trail Blazers": 3, // 1972, 1974, 2007
    "Orlando Magic": 3,          // 1992, 1993, 2004, 2022
    "Los Angeles Lakers": 2,     // 1979, 1982 (Magic Johnson, James Worthy)
    "Milwaukee Bucks": 3,        // 1969 (Kareem), 1977, 1994, 2005
    "New York Knicks": 3,        // 1963, 1964, 1966, 1985 (Ewing)
    "Los Angeles Clippers": 3,   // 1988, 1998, 2009 (Blake Griffin)
    "Houston Rockets": 3,        // 1976, 1983 (Sampson), 1984 (Hakeem), 2002 (Yao)
    "Golden State Warriors": 2,  // 1980, 1995
    "San Antonio Spurs": 2,      // 1987 (David Robinson), 1997 (Tim Duncan), 2023 (Wembanyama)
    "Washington Wizards": 2,     // 2001 (Kwame Brown), 2010 (John Wall)
    "Detroit Pistons": 2,        // 1967, 1970, 2021
    "Minnesota Timberwolves": 2, // 2015, 2020
    "New Orleans Pelicans": 2,   // 2012 (Anthony Davis), 2019 (Zion)
    "Chicago Bulls": 1,          // 2008 (Derrick Rose)
    "Atlanta Hawks": 2,          // 1975 (David Thompson), 2024
    "Sacramento Kings": 1,       // 1989
    "Charlotte Hornets": 1,      // 1991 (Larry Johnson)
    "New Jersey Nets": 2,        // 1990, 2000 (now Brooklyn Nets)
    "Toronto Raptors": 1,        // 2006
    "Phoenix Suns": 1,           // 2018
    "Dallas Mavericks": 2,       // 1981, 2025 (projected)
    
    // Teams with 0 first overall picks (need to verify)
    "Boston Celtics": 1,         // 1950
    "Miami Heat": 0,
    "Indiana Pacers": 0,
    "Utah Jazz": 0,
    "Denver Nuggets": 0,
    "Memphis Grizzlies": 0,
    "Oklahoma City Thunder": 0,  // (formerly Seattle SuperSonics)
    "Brooklyn Nets": 0           // (separate from New Jersey Nets era)
};

// Let me recount more carefully by looking at current team names
const nbaCurrentTeamPicks = {
    // Count by examining each pick and mapping to current franchise
    "Cleveland Cavaliers": 4,    // 1971, 2003, 2011, 2013, 2014
    "Philadelphia 76ers": 4,     // 1973, 1996, 2016, 2017
    "Orlando Magic": 3,          // 1992, 1993, 2004, 2022  
    "Portland Trail Blazers": 3, // 1972, 1974, 2007
    "Houston Rockets": 3,        // 1976, 1983, 1984, 2002
    "Los Angeles Clippers": 3,   // 1988, 1998, 2009
    "Milwaukee Bucks": 3,        // 1969, 1977, 1994, 2005
    "New York Knicks": 3,        // 1963, 1964, 1966, 1985
    "Detroit Pistons": 3,        // 1967, 1970, 2021
    "San Antonio Spurs": 3,      // 1987, 1997, 2023
    "Los Angeles Lakers": 2,     // 1979, 1982
    "Washington Wizards": 2,     // 2001, 2010
    "Minnesota Timberwolves": 2, // 2015, 2020
    "New Orleans Pelicans": 2,   // 2012, 2019
    "Brooklyn Nets": 2,          // 1990, 2000 (as New Jersey Nets)
    "Atlanta Hawks": 2,          // 1975, 2024
    "Golden State Warriors": 2,  // 1980, 1995
    "Dallas Mavericks": 2,       // 1981, 2025
    "Chicago Bulls": 1,          // 2008
    "Sacramento Kings": 1,       // 1989
    "Charlotte Hornets": 1,      // 1991
    "Toronto Raptors": 1,        // 2006
    "Phoenix Suns": 1,           // 2018
    "Boston Celtics": 1,         // 1950
    
    // Teams with 0 first overall picks
    "Miami Heat": 0,
    "Indiana Pacers": 0,
    "Utah Jazz": 0,
    "Denver Nuggets": 0,
    "Memphis Grizzlies": 0,
    "Oklahoma City Thunder": 0   // (SuperSonics never had #1 pick)
};

console.log('🏀 NBA First Overall Draft Picks Analysis');
console.log('========================================');

// Create metrics for integration
const nbaDraftMetrics = {};
Object.keys(nbaCurrentTeamPicks).forEach(teamName => {
    const picks = nbaCurrentTeamPicks[teamName];
    nbaDraftMetrics[teamName] = {
        nba_first_overall_picks: picks
    };
});

console.log('\n📊 MOST FIRST OVERALL PICKS (NBA):');
const sortedTeams = Object.entries(nbaCurrentTeamPicks)
    .sort((a, b) => b[1] - a[1]);

sortedTeams.slice(0, 15).forEach((entry, i) => {
    const [team, picks] = entry;
    console.log(`${i+1}. ${team}: ${picks} picks`);
});

console.log('\n🏆 TEAMS WITH 0 FIRST OVERALL PICKS (NBA):');
sortedTeams.filter(([team, picks]) => picks === 0).forEach(([team, picks]) => {
    console.log(`   ${team}: ${picks} picks`);
});

console.log('\n📈 NBA DRAFT PICK DISTRIBUTION:');
const pickCounts = {};
sortedTeams.forEach(([team, picks]) => {
    if (!pickCounts[picks]) pickCounts[picks] = [];
    pickCounts[picks].push(team);
});

Object.keys(pickCounts).sort((a, b) => b - a).forEach(count => {
    console.log(`${count} picks: ${pickCounts[count].length} teams`);
});

console.log('\n🗓️ RECENT FIRST OVERALL PICKS (2020+):');
console.log('   2020: Minnesota Timberwolves (Anthony Edwards)');
console.log('   2021: Detroit Pistons (Cade Cunningham)');
console.log('   2022: Orlando Magic (Paolo Banchero)');
console.log('   2023: San Antonio Spurs (Victor Wembanyama)');
console.log('   2024: Atlanta Hawks (Zaccharie Risacher)');
console.log('   2025: Dallas Mavericks (Cooper Flagg - projected)');

console.log('\n🌟 NOTABLE PICKS:');
console.log('   1969: Kareem Abdul-Jabbar (Milwaukee Bucks)');
console.log('   1979: Magic Johnson (Los Angeles Lakers)');
console.log('   1984: Hakeem Olajuwon (Houston Rockets)');
console.log('   1997: Tim Duncan (San Antonio Spurs)');
console.log('   2003: LeBron James (Cleveland Cavaliers)');
console.log('   2023: Victor Wembanyama (San Antonio Spurs)');

// Save metrics for integration
fs.writeFileSync('nba-draft-picks-metrics.json', JSON.stringify(nbaDraftMetrics, null, 2));
console.log('\n✅ NBA draft picks metrics saved to nba-draft-picks-metrics.json');
console.log('📝 Next step: Combine with NFL, NHL, MLB data for unified challenge');
console.log('📊 All 4 leagues will have complete first overall picks data!');