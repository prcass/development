// Check which leagues have franchise data
const window = {};
eval(require('fs').readFileSync('data.js', 'utf8'));
const teams = Object.values(window.GAME_DATA.categories.sports.items);

// Check which leagues have franchise data
const leagueStatus = {};
['NFL', 'NBA', 'MLB', 'NHL'].forEach(league => {
  const leagueTeams = teams.filter(t => t.league === league);
  const withNameChanges = leagueTeams.filter(t => t.franchise_name_changes !== undefined).length;
  const withMiles = leagueTeams.filter(t => t.franchise_miles_moved !== undefined).length;
  
  leagueStatus[league] = {
    total: leagueTeams.length,
    withNameChanges,
    withMiles,
    hasData: withNameChanges > 0 && withMiles > 0
  };
});

console.log('📊 Franchise Data Status by League:');
console.log('=====================================');

Object.keys(leagueStatus).forEach(league => {
  const status = leagueStatus[league];
  const statusIcon = status.hasData ? '✅' : '❌';
  console.log(`${statusIcon} ${league}: ${status.withNameChanges}/${status.total} name changes, ${status.withMiles}/${status.total} miles data`);
});

console.log('');
console.log('🔍 Missing Data:');
Object.keys(leagueStatus).forEach(league => {
  const status = leagueStatus[league];
  if (!status.hasData) {
    console.log(`❌ ${league}: Missing franchise history data for all ${status.total} teams`);
  }
});

// Show sample teams without data
console.log('');
console.log('📝 Sample teams missing franchise data:');
['NBA', 'MLB', 'NHL'].forEach(league => {
  const leagueTeams = teams.filter(t => t.league === league);
  const sampleTeam = leagueTeams[0];
  if (sampleTeam) {
    console.log(`${league}: ${sampleTeam.name} - name_changes: ${sampleTeam.franchise_name_changes || 'undefined'}, miles: ${sampleTeam.franchise_miles_moved || 'undefined'}`);
  }
});