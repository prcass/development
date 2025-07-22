// Debug Diana's block/token discrepancy
// Run this in browser console to trace the issue

function debugDianaBlocks() {
    console.log('🔍 DEBUGGING DIANA BLOCKS vs TOKENS');
    console.log('=====================================');
    
    // Check Diana's current stats
    const dianaStats = getPlayerStats('Diana');
    console.log('\n📊 Diana Stats:');
    console.log('  blocksMade:', dianaStats.blocksMade);
    console.log('  blocksWon:', dianaStats.blocksWon);
    console.log('  blocksLost:', dianaStats.blocksLost);
    console.log('  tokensGained:', dianaStats.tokensGained);
    
    // Check current blocks in memory
    const currentBlocks = GameState.get('players.currentBlocks') || {};
    console.log('\n📋 Current Blocks in GameState:');
    Object.keys(currentBlocks).forEach(playerName => {
        console.log(`  ${playerName}:`, currentBlocks[playerName]);
    });
    
    // Check Diana's owned cards
    const ownedCards = GameState.get('players.ownedCards') || {};
    console.log('\n🏆 Diana Owned Cards:');
    if (ownedCards.Diana) {
        Object.keys(ownedCards.Diana).forEach(category => {
            const cards = ownedCards.Diana[category];
            if (cards && cards.length > 0) {
                console.log(`  ${category}: ${cards.length} cards (${cards.join(', ')})`);
            }
        });
    } else {
        console.log('  No owned cards found for Diana');
    }
    
    // Check game state for successful rankings
    console.log('\n✅ Game Success Stats:');
    const playersList = GameState.get('players.list') || [];
    let totalSuccessfulRankings = 0;
    playersList.forEach(playerName => {
        const stats = getPlayerStats(playerName);
        totalSuccessfulRankings += stats.bidsSuccessful || 0;
        if (stats.bidsSuccessful > 0) {
            console.log(`  ${playerName}: ${stats.bidsSuccessful} successful rankings`);
        }
    });
    console.log(`  Total successful rankings in game: ${totalSuccessfulRankings}`);
    
    // Analyze the discrepancy
    console.log('\n🧮 DISCREPANCY ANALYSIS:');
    if (totalSuccessfulRankings === 0) {
        console.log('✅ No successful rankings confirmed');
        if (dianaStats.blocksMade > dianaStats.tokensGained) {
            console.log(`❌ ISSUE: Diana made ${dianaStats.blocksMade} blocks but only gained ${dianaStats.tokensGained} tokens`);
            console.log('   Expected: blocksMade = tokensGained when no rankings succeed');
            
            const missingTokens = dianaStats.blocksMade - dianaStats.tokensGained;
            console.log(`   Missing tokens: ${missingTokens}`);
            
            // Possible causes
            console.log('\n🔍 POSSIBLE CAUSES:');
            console.log('1. Block made before fix (not stored in currentBlocks)');
            console.log('2. Block against owned card (prevented by validation)');
            console.log('3. Block data corruption or array handling issue');
            console.log('4. Timing issue between blocksMade++ and scoring');
        } else {
            console.log('✅ Diana\'s blocks and tokens are consistent');
        }
    }
    
    return {
        dianaStats,
        currentBlocks,
        ownedCards: ownedCards.Diana,
        totalSuccessfulRankings,
        discrepancy: dianaStats.blocksMade - dianaStats.tokensGained
    };
}

// Auto-run
debugDianaBlocks();