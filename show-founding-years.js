// Show "Year Team Was Founded" rankings
const fs = require('fs');

// Read and parse the data
const content = fs.readFileSync('data.js', 'utf8');

// Extract sports teams data
const sportsMatch = content.match(/"sports":\s*{[\s\S]*?"items":\s*{([\s\S]*?)}\s*}/);
if (!sportsMatch) {
    console.log('❌ Could not find sports data');
    process.exit(1);
}

const teamsData = [];
const itemsContent = sportsMatch[1];

// Parse each team entry
const teamMatches = itemsContent.matchAll(/"(\d+)":\s*{([^}]+)}/g);
for (const match of teamMatches) {
    const teamContent = match[2];
    const team = {};
    
    // Extract each field
    const nameMatch = teamContent.match(/"name":\s*"([^"]+)"/);
    const leagueMatch = teamContent.match(/"league":\s*"([^"]+)"/);
    const foundingMatch = teamContent.match(/"year_founded":\s*([^,\s]+)/);
    
    if (nameMatch && leagueMatch && foundingMatch) {
        team.name = nameMatch[1];
        team.league = leagueMatch[1];
        team.year_founded = parseInt(foundingMatch[1]);
        
        teamsData.push(team);
    }
}

console.log('📅 Year Team Was Founded Rankings');
console.log('═'.repeat(80));
console.log(`Total teams analyzed: ${teamsData.length}`);
console.log('');

// Sort by founding year (oldest first)
const foundingRanking = [...teamsData].sort((a, b) => a.year_founded - b.year_founded);

console.log('🏛️ OLDEST TEAMS (Founded First)');
console.log('═'.repeat(80));
foundingRanking.slice(0, 20).forEach((team, index) => {
    const rank = index + 1;
    const padding = ' '.repeat(3 - rank.toString().length);
    const namePadding = ' '.repeat(25 - team.name.length);
    const age = 2025 - team.year_founded;
    console.log(`${padding}${rank}. ${team.name}${namePadding} ${team.year_founded} (${age} years old) (${team.league})`);
});

console.log('');
console.log('🆕 NEWEST TEAMS (Founded Most Recently)');
console.log('═'.repeat(80));
const newestTeams = [...foundingRanking].reverse();
newestTeams.slice(0, 15).forEach((team, index) => {
    const rank = index + 1;
    const padding = ' '.repeat(3 - rank.toString().length);
    const namePadding = ' '.repeat(25 - team.name.length);
    const age = 2025 - team.year_founded;
    console.log(`${padding}${rank}. ${team.name}${namePadding} ${team.year_founded} (${age} years old) (${team.league})`);
});

console.log('');
console.log('📊 OLDEST BY LEAGUE:');
console.log('═'.repeat(50));

// Find oldest in each league
const leagues = ['NFL', 'NHL', 'MLB', 'NBA'];
leagues.forEach(league => {
    const leagueTeams = foundingRanking.filter(team => team.league === league);
    if (leagueTeams.length > 0) {
        const oldest = leagueTeams[0];
        const age = 2025 - oldest.year_founded;
        console.log(`${league}: ${oldest.name} (${oldest.year_founded}) - ${age} years old`);
    }
});

console.log('');
console.log('📈 FOUNDING ERA BREAKDOWN:');
console.log('═'.repeat(50));

const eras = [
    { name: '1800s', min: 1800, max: 1899 },
    { name: '1900-1920s', min: 1900, max: 1929 },
    { name: '1930-1960s', min: 1930, max: 1969 },
    { name: '1970-1990s', min: 1970, max: 1999 },
    { name: '2000s+', min: 2000, max: 2030 }
];

eras.forEach(era => {
    const eraTeams = teamsData.filter(team => 
        team.year_founded >= era.min && team.year_founded <= era.max
    );
    console.log(`${era.name}: ${eraTeams.length} teams`);
});

console.log('');
console.log('📊 Summary Statistics:');
console.log(`   • Oldest team: ${foundingRanking[0].name} (${foundingRanking[0].year_founded})`);
console.log(`   • Newest team: ${newestTeams[0].name} (${newestTeams[0].year_founded})`);
console.log(`   • Average founding year: ${Math.round(teamsData.reduce((sum, team) => sum + team.year_founded, 0) / teamsData.length)}`);
console.log(`   • Age span: ${newestTeams[0].year_founded - foundingRanking[0].year_founded} years`);
console.log('');
console.log('✅ Perfect for ranking games - who has the most history! 🏛️');