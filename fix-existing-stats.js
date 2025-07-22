// Fix existing player stats - paste this into browser console

function fixExistingPlayerStats() {
    console.log('🔧 FIXING EXISTING PLAYER STATS...');
    
    const players = GameState.get('players.list') || [];
    let fixed = 0;
    
    players.forEach(playerName => {
        const stats = getPlayerStats(playerName);
        let needsUpdate = false;
        
        console.log(`\n👤 Checking ${playerName}:`);
        
        // Check and add missing blocksWon
        if (typeof stats.blocksWon === 'undefined') {
            stats.blocksWon = 0;
            needsUpdate = true;
            console.log('  ✅ Added blocksWon: 0');
        } else {
            console.log(`  ✓ Has blocksWon: ${stats.blocksWon}`);
        }
        
        // Check and add missing blocksLost
        if (typeof stats.blocksLost === 'undefined') {
            stats.blocksLost = 0;
            needsUpdate = true;
            console.log('  ✅ Added blocksLost: 0');
        } else {
            console.log(`  ✓ Has blocksLost: ${stats.blocksLost}`);
        }
        
        // Save if we made changes
        if (needsUpdate) {
            GameState.set('players.stats.' + playerName, stats);
            fixed++;
            console.log(`  💾 Updated ${playerName}'s stats`);
        }
        
        // Verify math
        const total = stats.blocksWon + stats.blocksLost;
        if (total !== stats.blocksMade) {
            console.log(`  ⚠️ Math warning: ${stats.blocksWon} + ${stats.blocksLost} = ${total}, but blocksMade = ${stats.blocksMade}`);
        }
    });
    
    console.log(`\n🎯 RESULTS: Fixed ${fixed} players`);
    
    // Show updated stats
    console.log('\n📊 ALL PLAYER STATS:');
    players.forEach(playerName => {
        const stats = getPlayerStats(playerName);
        console.log(`${playerName}: blocksMade=${stats.blocksMade}, blocksWon=${stats.blocksWon}, blocksLost=${stats.blocksLost}, tokensGained=${stats.tokensGained}`);
    });
    
    return fixed;
}

// Auto-run
fixExistingPlayerStats();