// Show "Years Since Last Championship" rankings
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
    const droughtMatch = teamContent.match(/"years_since_last_championship":\s*([^,\s]+)/);
    
    if (nameMatch && leagueMatch && droughtMatch) {
        team.name = nameMatch[1];
        team.league = leagueMatch[1];
        team.years_since_last_championship = parseInt(droughtMatch[1]);
        
        teamsData.push(team);
    }
}

console.log('📅 Years Since Last Championship Rankings');
console.log('═'.repeat(80));
console.log(`Total teams analyzed: ${teamsData.length}`);
console.log('');

// Sort by years since last championship (highest = longest drought)
const droughtRanking = [...teamsData].sort((a, b) => b.years_since_last_championship - a.years_since_last_championship);

console.log('😢 LONGEST CHAMPIONSHIP DROUGHTS (Most Suffering)');
console.log('═'.repeat(80));

// Show teams that never won (2025 years)
const neverWon = droughtRanking.filter(team => team.years_since_last_championship === 2025);
console.log(`🚫 TEAMS THAT HAVE NEVER WON A CHAMPIONSHIP (${neverWon.length} teams):`);
neverWon.forEach((team, index) => {
    const rank = index + 1;
    const padding = ' '.repeat(3 - rank.toString().length);
    const namePadding = ' '.repeat(25 - team.name.length);
    console.log(`${padding}${rank}. ${team.name}${namePadding} Never! (${team.league})`);
});
console.log('');

// Show teams with actual droughts (not 2025)
const actualDroughts = droughtRanking.filter(team => team.years_since_last_championship < 2025);
console.log(`📅 LONGEST ACTUAL DROUGHTS (${actualDroughts.length} teams):`);
actualDroughts.slice(0, 20).forEach((team, index) => {
    const rank = index + 1;
    const padding = ' '.repeat(3 - rank.toString().length);
    const namePadding = ' '.repeat(25 - team.name.length);
    const years = team.years_since_last_championship;
    const yearText = years === 1 ? 'year' : 'years';
    console.log(`${padding}${rank}. ${team.name}${namePadding} ${years.toString().padStart(3)} ${yearText} (${team.league})`);
});
console.log('');

// Show recent champions (shortest droughts)
console.log('🏆 MOST RECENT CHAMPIONS (Least Suffering)');
console.log('═'.repeat(80));
const recentChamps = actualDroughts.sort((a, b) => a.years_since_last_championship - b.years_since_last_championship);
recentChamps.slice(0, 15).forEach((team, index) => {
    const rank = index + 1;
    const padding = ' '.repeat(3 - rank.toString().length);
    const namePadding = ' '.repeat(25 - team.name.length);
    const years = team.years_since_last_championship;
    const yearText = years === 1 ? 'year' : 'years';
    const championshipYear = 2025 - years;
    console.log(`${padding}${rank}. ${team.name}${namePadding} ${years.toString().padStart(3)} ${yearText} (${team.league}) - Won ${championshipYear}`);
});
console.log('');

console.log('📊 Summary Statistics:');
console.log(`   • Teams that never won: ${neverWon.length}`);
console.log(`   • Longest actual drought: ${actualDroughts[0].name} (${actualDroughts[0].years_since_last_championship} years)`);
console.log(`   • Most recent champion: ${recentChamps[0].name} (${recentChamps[0].years_since_last_championship} ${recentChamps[0].years_since_last_championship === 1 ? 'year' : 'years'})`);
console.log(`   • Average drought (excluding never won): ${Math.round(actualDroughts.reduce((sum, team) => sum + team.years_since_last_championship, 0) / actualDroughts.length)} years`);
console.log('');
console.log('✅ Perfect for ranking games - who has suffered the longest! 😄');