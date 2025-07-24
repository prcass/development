// Recount NBA First Overall Draft Picks - Systematic Review
const fs = require('fs');

// NBA First Overall Draft Picks by Year (from provided data)
const nbaPicksByYear = {
    1947: { team: "Pittsburgh Ironmen", player: "Clifton McNeely" }, // Defunct
    1948: { team: "Providence Steamrollers", player: "Andy Tonkovich" }, // Defunct
    1949: { team: "Providence Steamrollers", player: "Howie Shannon" }, // Defunct
    1950: { team: "Boston Celtics", player: "Charlie Share" },
    1951: { team: "Baltimore Bullets", player: "Gene Melchiorre" }, // Defunct
    1952: { team: "Milwaukee Hawks", player: "Mark Workman" }, // Now Atlanta Hawks
    1953: { team: "Baltimore Bullets", player: "Ray Felix" }, // Defunct
    1954: { team: "Baltimore Bullets", player: "Frank Selvy" }, // Defunct
    1955: { team: "Milwaukee Hawks", player: "Dick Ricketts" }, // Now Atlanta Hawks
    1956: { team: "Rochester Royals", player: "Sihugo Green" }, // Now Sacramento Kings
    1957: { team: "Cincinnati Royals", player: "Rod Hundley" }, // Now Sacramento Kings
    1958: { team: "Minneapolis Lakers", player: "Elgin Baylor" }, // Now LA Lakers
    1959: { team: "Cincinnati Royals", player: "Bob Boozer" }, // Now Sacramento Kings
    1960: { team: "Cincinnati Royals", player: "Oscar Robertson" }, // Now Sacramento Kings
    1961: { team: "Chicago Packers", player: "Walt Bellamy" }, // Now Washington Wizards
    1962: { team: "Chicago Zephyrs", player: "Bill McGill" }, // Now Washington Wizards
    1963: { team: "New York Knicks", player: "Art Heyman" },
    1964: { team: "New York Knicks", player: "Jim Barnes" },
    1965: { team: "San Francisco Warriors", player: "Fred Hetzel" }, // Now Golden State Warriors
    1966: { team: "New York Knicks", player: "Cazzie Russell" },
    1967: { team: "Detroit Pistons", player: "Jimmy Walker" },
    1968: { team: "San Diego Rockets", player: "Elvin Hayes" }, // Now Houston Rockets
    1969: { team: "Milwaukee Bucks", player: "Lew Alcindor" },
    1970: { team: "Detroit Pistons", player: "Bob Lanier" },
    1971: { team: "Cleveland Cavaliers", player: "Austin Carr" },
    1972: { team: "Portland Trail Blazers", player: "LaRue Martin" },
    1973: { team: "Philadelphia 76ers", player: "Doug Collins" },
    1974: { team: "Portland Trail Blazers", player: "Bill Walton" },
    1975: { team: "Atlanta Hawks", player: "David Thompson" },
    1976: { team: "Houston Rockets", player: "John Lucas" },
    1977: { team: "Milwaukee Bucks", player: "Kent Benson" },
    1978: { team: "Portland Trail Blazers", player: "Mychal Thompson" },
    1979: { team: "Los Angeles Lakers", player: "Magic Johnson" },
    1980: { team: "Golden State Warriors", player: "Joe Barry Carroll" },
    1981: { team: "Dallas Mavericks", player: "Mark Aguirre" },
    1982: { team: "Los Angeles Lakers", player: "James Worthy" },
    1983: { team: "Houston Rockets", player: "Ralph Sampson" },
    1984: { team: "Houston Rockets", player: "Akeem Olajuwon" },
    1985: { team: "New York Knicks", player: "Patrick Ewing" },
    1986: { team: "Cleveland Cavaliers", player: "Brad Daugherty" },
    1987: { team: "San Antonio Spurs", player: "David Robinson" },
    1988: { team: "Los Angeles Clippers", player: "Danny Manning" },
    1989: { team: "Sacramento Kings", player: "Pervis Ellison" },
    1990: { team: "New Jersey Nets", player: "Derrick Coleman" }, // Now Brooklyn Nets
    1991: { team: "Charlotte Hornets", player: "Larry Johnson" },
    1992: { team: "Orlando Magic", player: "Shaquille O'Neal" },
    1993: { team: "Orlando Magic", player: "Chris Webber" },
    1994: { team: "Milwaukee Bucks", player: "Glenn Robinson" },
    1995: { team: "Golden State Warriors", player: "Joe Smith" },
    1996: { team: "Philadelphia 76ers", player: "Allen Iverson" },
    1997: { team: "San Antonio Spurs", player: "Tim Duncan" },
    1998: { team: "Los Angeles Clippers", player: "Michael Olowokandi" },
    1999: { team: "Chicago Bulls", player: "Elton Brand" },
    2000: { team: "New Jersey Nets", player: "Kenyon Martin" }, // Now Brooklyn Nets
    2001: { team: "Washington Wizards", player: "Kwame Brown" },
    2002: { team: "Houston Rockets", player: "Yao Ming" },
    2003: { team: "Cleveland Cavaliers", player: "LeBron James" },
    2004: { team: "Orlando Magic", player: "Dwight Howard" },
    2005: { team: "Milwaukee Bucks", player: "Andrew Bogut" },
    2006: { team: "Toronto Raptors", player: "Andrea Bargnani" },
    2007: { team: "Portland Trail Blazers", player: "Greg Oden" },
    2008: { team: "Chicago Bulls", player: "Derrick Rose" },
    2009: { team: "Los Angeles Clippers", player: "Blake Griffin" },
    2010: { team: "Washington Wizards", player: "John Wall" },
    2011: { team: "Cleveland Cavaliers", player: "Kyrie Irving" },
    2012: { team: "New Orleans Hornets", player: "Anthony Davis" }, // Now New Orleans Pelicans
    2013: { team: "Cleveland Cavaliers", player: "Anthony Bennett" },
    2014: { team: "Cleveland Cavaliers", player: "Andrew Wiggins" },
    2015: { team: "Minnesota Timberwolves", player: "Karl-Anthony Towns" },
    2016: { team: "Philadelphia 76ers", player: "Ben Simmons" },
    2017: { team: "Philadelphia 76ers", player: "Markelle Fultz" },
    2018: { team: "Phoenix Suns", player: "Deandre Ayton" },
    2019: { team: "New Orleans Pelicans", player: "Zion Williamson" },
    2020: { team: "Minnesota Timberwolves", player: "Anthony Edwards" },
    2021: { team: "Detroit Pistons", player: "Cade Cunningham" },
    2022: { team: "Orlando Magic", player: "Paolo Banchero" },
    2023: { team: "San Antonio Spurs", player: "Victor Wembanyama" },
    2024: { team: "Atlanta Hawks", player: "Zaccharie Risacher" },
    2025: { team: "Dallas Mavericks", player: "Cooper Flagg" } // Projected
};

// Current NBA team franchise mapping
const franchiseMapping = {
    // Direct matches
    "Boston Celtics": "Boston Celtics",
    "New York Knicks": "New York Knicks", 
    "Detroit Pistons": "Detroit Pistons",
    "Portland Trail Blazers": "Portland Trail Blazers",
    "Philadelphia 76ers": "Philadelphia 76ers",
    "Atlanta Hawks": "Atlanta Hawks",
    "Houston Rockets": "Houston Rockets",
    "Los Angeles Lakers": "Los Angeles Lakers",
    "Golden State Warriors": "Golden State Warriors",
    "Dallas Mavericks": "Dallas Mavericks",
    "Los Angeles Clippers": "Los Angeles Clippers",
    "Sacramento Kings": "Sacramento Kings",
    "Charlotte Hornets": "Charlotte Hornets",
    "Orlando Magic": "Orlando Magic",
    "Milwaukee Bucks": "Milwaukee Bucks",
    "San Antonio Spurs": "San Antonio Spurs",
    "Chicago Bulls": "Chicago Bulls",
    "Washington Wizards": "Washington Wizards",
    "Toronto Raptors": "Toronto Raptors",
    "Cleveland Cavaliers": "Cleveland Cavaliers",
    "Phoenix Suns": "Phoenix Suns",
    "Minnesota Timberwolves": "Minnesota Timberwolves",
    "New Orleans Pelicans": "New Orleans Pelicans",
    "Brooklyn Nets": "Brooklyn Nets",
    
    // Franchise moves/renames
    "Milwaukee Hawks": "Atlanta Hawks",
    "Rochester Royals": "Sacramento Kings",
    "Cincinnati Royals": "Sacramento Kings", 
    "Minneapolis Lakers": "Los Angeles Lakers",
    "Chicago Packers": "Washington Wizards",
    "Chicago Zephyrs": "Washington Wizards",
    "San Francisco Warriors": "Golden State Warriors",
    "San Diego Rockets": "Houston Rockets",
    "New Jersey Nets": "Brooklyn Nets",
    "New Orleans Hornets": "New Orleans Pelicans"
};

// Count picks by current franchise
const currentFranchiseCounts = {};

// Initialize all current NBA teams to 0
const currentNBATeams = [
    "Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets", "Chicago Bulls",
    "Cleveland Cavaliers", "Dallas Mavericks", "Denver Nuggets", "Detroit Pistons", "Golden State Warriors",
    "Houston Rockets", "Indiana Pacers", "Los Angeles Clippers", "Los Angeles Lakers", "Memphis Grizzlies",
    "Miami Heat", "Milwaukee Bucks", "Minnesota Timberwolves", "New Orleans Pelicans", "New York Knicks",
    "Oklahoma City Thunder", "Orlando Magic", "Philadelphia 76ers", "Phoenix Suns", "Portland Trail Blazers",
    "Sacramento Kings", "San Antonio Spurs", "Toronto Raptors", "Utah Jazz", "Washington Wizards"
];

currentNBATeams.forEach(team => {
    currentFranchiseCounts[team] = 0;
});

// Count picks for each current franchise
Object.values(nbaPicksByYear).forEach(pick => {
    const currentTeam = franchiseMapping[pick.team] || pick.team;
    if (currentFranchiseCounts.hasOwnProperty(currentTeam)) {
        currentFranchiseCounts[currentTeam]++;
    } else if (currentNBATeams.includes(pick.team)) {
        currentFranchiseCounts[pick.team]++;
    }
});

console.log('🏀 NBA First Overall Draft Picks - CORRECTED COUNTS');
console.log('===================================================');

console.log('\n📊 MOST FIRST OVERALL PICKS (NBA - CORRECTED):');
const sortedTeams = Object.entries(currentFranchiseCounts)
    .sort((a, b) => b[1] - a[1]);

sortedTeams.forEach((entry, i) => {
    const [team, picks] = entry;
    if (picks > 0) {
        console.log(`${i+1}. ${team}: ${picks} picks`);
    }
});

console.log('\n🔍 VERIFICATION - Cleveland Cavaliers picks:');
Object.entries(nbaPicksByYear).forEach(([year, pick]) => {
    if (pick.team === "Cleveland Cavaliers") {
        console.log(`   ${year}: ${pick.player}`);
    }
});

console.log('\n🔍 VERIFICATION - Other high-count teams:');
const highCountTeams = sortedTeams.filter(([team, picks]) => picks >= 4);
highCountTeams.forEach(([team, picks]) => {
    console.log(`\n${team} (${picks} picks):`);
    Object.entries(nbaPicksByYear).forEach(([year, pick]) => {
        const currentTeam = franchiseMapping[pick.team] || pick.team;
        if (currentTeam === team) {
            console.log(`   ${year}: ${pick.player} (${pick.team})`);
        }
    });
});

console.log('\n📊 TEAMS WITH 0 PICKS:');
const zeroTeams = sortedTeams.filter(([team, picks]) => picks === 0);
zeroTeams.forEach(([team, picks]) => {
    console.log(`   ${team}: ${picks} picks`);
});

// Save corrected metrics
fs.writeFileSync('nba-draft-picks-corrected.json', JSON.stringify(currentFranchiseCounts, null, 2));
console.log('\n✅ Corrected NBA draft picks saved to nba-draft-picks-corrected.json');
console.log(`📊 Total picks accounted for: ${Object.values(currentFranchiseCounts).reduce((a,b) => a+b, 0)}`);
console.log(`📊 Total years in data: ${Object.keys(nbaPicksByYear).length}`);