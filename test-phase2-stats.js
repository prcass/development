// Phase 2 Statistics Test - Paste this into browser console after starting a game

function testPhase2Statistics() {
    console.log('🧪 PHASE 2 STATISTICS TEST');
    console.log('==============================');
    
    // Check if new stats fields exist in initialization
    const playersList = GameState.get('players.list') || [];
    if (playersList.length === 0) {
        console.log('❌ No players found - start a game first');
        return;
    }
    
    console.log('📊 Checking stats initialization for all players:');
    let allPlayersHaveNewStats = true;
    
    playersList.forEach(playerName => {
        const stats = getPlayerStats(playerName);
        console.log(`\n👤 ${playerName}:`);
        console.log(`  blocksMade: ${stats.blocksMade}`);
        console.log(`  blocksWon: ${stats.blocksWon} (new field)`);
        console.log(`  blocksLost: ${stats.blocksLost} (new field)`);
        console.log(`  tokensGained: ${stats.tokensGained}`);
        
        // Check if new fields exist
        if (typeof stats.blocksWon === 'undefined') {
            console.log('  ❌ Missing blocksWon field');
            allPlayersHaveNewStats = false;
        }
        if (typeof stats.blocksLost === 'undefined') {
            console.log('  ❌ Missing blocksLost field');
            allPlayersHaveNewStats = false;
        }
        
        // Check relationship
        const expectedTotal = stats.blocksWon + stats.blocksLost;
        if (expectedTotal !== stats.blocksMade) {
            console.log(`  ⚠️ Math check: blocksWon(${stats.blocksWon}) + blocksLost(${stats.blocksLost}) = ${expectedTotal}, but blocksMade = ${stats.blocksMade}`);
        } else if (stats.blocksMade > 0) {
            console.log(`  ✅ Math check: ${stats.blocksWon} + ${stats.blocksLost} = ${stats.blocksMade}`);
        }
        
        // Check token relationship
        if (stats.tokensGained !== stats.blocksWon) {
            console.log(`  ⚠️ Token check: tokensGained(${stats.tokensGained}) should equal blocksWon(${stats.blocksWon})`);
        } else if (stats.blocksWon > 0) {
            console.log(`  ✅ Token check: tokensGained = blocksWon = ${stats.blocksWon}`);
        }
    });
    
    console.log('\n🎯 PHASE 2 TEST RESULTS:');
    if (allPlayersHaveNewStats) {
        console.log('✅ All players have blocksWon and blocksLost fields');
    } else {
        console.log('❌ Some players missing new stats fields');
    }
    
    console.log('\n📝 INSTRUCTIONS FOR FULL TEST:');
    console.log('1. Run the automated test');
    console.log('2. Watch for these console messages:');
    console.log('   📊 BLOCKS WON: [player] total won blocks: X');
    console.log('   📊 BLOCKS LOST: [player] total lost blocks: Y');
    console.log('3. After test completes, run testPhase2Statistics() again');
    console.log('4. Verify: blocksWon = tokensGained for all players');
    
    return {
        allPlayersHaveNewStats,
        playersList,
        stats: playersList.map(name => ({
            name,
            ...getPlayerStats(name)
        }))
    };
}

// Auto-run
testPhase2Statistics();