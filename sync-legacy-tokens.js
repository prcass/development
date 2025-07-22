// Sync legacy tokensGained data with new blocksWon tracking
// Run this in browser console to fix historical inconsistencies

function syncLegacyTokenData() {
    console.log('🔧 SYNCING LEGACY TOKEN DATA');
    console.log('==============================');
    
    const playersList = GameState.get('players.list') || [];
    let fixedPlayers = 0;
    
    playersList.forEach(playerName => {
        const stats = getPlayerStats(playerName);
        console.log(`\n👤 Checking ${playerName}:`);
        console.log(`  Current: blocksWon=${stats.blocksWon}, tokensGained=${stats.tokensGained}`);
        
        // If tokensGained > blocksWon, it means we have legacy data
        if (stats.tokensGained > stats.blocksWon) {
            console.log(`  🔄 Legacy data detected: tokensGained(${stats.tokensGained}) > blocksWon(${stats.blocksWon})`);
            
            // Option 1: Sync blocksWon to match tokensGained (assumes all tokens came from blocking)
            stats.blocksWon = stats.tokensGained;
            
            // Update blocksMade to be consistent
            stats.blocksMade = stats.blocksWon + (stats.blocksLost || 0);
            
            GameState.set('players.stats.' + playerName, stats);
            console.log(`  ✅ Synced: blocksWon=${stats.blocksWon}, blocksMade=${stats.blocksMade}`);
            fixedPlayers++;
        } else if (stats.tokensGained === stats.blocksWon) {
            console.log(`  ✅ Already consistent: blocksWon = tokensGained = ${stats.blocksWon}`);
        } else {
            console.log(`  ⚠️ Unusual: blocksWon(${stats.blocksWon}) > tokensGained(${stats.tokensGained})`);
        }
    });
    
    console.log(`\n🎯 RESULTS: Fixed ${fixedPlayers} players with legacy data`);
    
    // Verify final state
    console.log('\n📊 FINAL STATE:');
    playersList.forEach(playerName => {
        const stats = getPlayerStats(playerName);
        const consistent = stats.blocksWon === stats.tokensGained;
        const icon = consistent ? '✅' : '❌';
        console.log(`${icon} ${playerName}: blocksWon=${stats.blocksWon}, tokensGained=${stats.tokensGained}`);
    });
    
    return fixedPlayers;
}

// Auto-run
syncLegacyTokenData();