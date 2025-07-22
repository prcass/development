// Debug Charlie's block/token discrepancy
// Run this in browser console to trace Charlie's issue

function debugCharlieBlocks() {
    console.log('🔍 DEBUGGING CHARLIE BLOCKS vs TOKENS');
    console.log('=====================================');
    
    // Check Charlie's current stats
    const charlieStats = getPlayerStats('Charlie');
    console.log('\n📊 Charlie Stats:');
    console.log('  blocksMade:', charlieStats.blocksMade);
    console.log('  blocksWon:', charlieStats.blocksWon);
    console.log('  blocksLost:', charlieStats.blocksLost);
    console.log('  tokensGained:', charlieStats.tokensGained);
    console.log('  bidsWon:', charlieStats.bidsWon || 0);
    console.log('  bidsSuccessful:', charlieStats.bidsSuccessful || 0);
    
    // Check current blocks in memory
    const currentBlocks = GameState.get('players.currentBlocks') || {};
    console.log('\n📋 Current Blocks in GameState:');
    if (currentBlocks.Charlie) {
        console.log('  Charlie:', currentBlocks.Charlie);
    } else {
        console.log('  Charlie: No current block found');
    }
    
    // Check Charlie's owned cards
    const ownedCards = GameState.get('players.ownedCards') || {};
    console.log('\n🏆 Charlie Owned Cards:');
    let actualTokenCount = 0;
    if (ownedCards.Charlie) {
        Object.keys(ownedCards.Charlie).forEach(category => {
            const cards = ownedCards.Charlie[category];
            if (cards && cards.length > 0) {
                actualTokenCount += cards.length;
                console.log(`  ${category}: ${cards.length} cards (${cards.join(', ')})`);
            }
        });
    } else {
        console.log('  No owned cards found for Charlie');
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
    console.log(`  Charlie made ${charlieStats.blocksMade} blocks`);
    console.log(`  Charlie won ${charlieStats.blocksWon} blocks`);
    console.log(`  Charlie gained ${charlieStats.tokensGained} tokens`);
    console.log(`  Charlie actually owns ${actualTokenCount} cards`);
    
    if (totalSuccessfulRankings === 0) {
        console.log('✅ No successful rankings confirmed');
        
        // Self-blocking analysis
        if ((charlieStats.bidsWon || 0) > 0) {
            console.log(`\n🤔 SELF-BLOCKING ANALYSIS:`);
            console.log(`  Charlie won ${charlieStats.bidsWon} bids`);
            console.log(`  If Charlie blocked during his own bid rounds, those wouldn't give tokens`);
            const possibleSelfBlocks = charlieStats.bidsWon;
            const expectedOtherBlocks = charlieStats.blocksMade - possibleSelfBlocks;
            console.log(`  Possible self-blocks: ${possibleSelfBlocks}`);
            console.log(`  Blocks against others: ${expectedOtherBlocks}`);
            console.log(`  Expected tokens from others: ${expectedOtherBlocks} (if all failed)`);
        }
        
        // Check for inconsistencies
        if (charlieStats.blocksMade > charlieStats.tokensGained) {
            console.log(`\n❌ ISSUE: Charlie made ${charlieStats.blocksMade} blocks but only gained ${charlieStats.tokensGained} tokens`);
            const missingTokens = charlieStats.blocksMade - charlieStats.tokensGained;
            console.log(`   Missing tokens: ${missingTokens}`);
            
            if ((charlieStats.bidsWon || 0) >= missingTokens) {
                console.log(`   ✅ LIKELY EXPLANATION: Charlie blocked himself ${missingTokens} times (self-blocks don't give tokens)`);
            } else {
                console.log(`   ❌ UNKNOWN ISSUE: Missing tokens can't be explained by self-blocking`);
            }
        } else {
            console.log('✅ Charlie\'s blocks and tokens are consistent');
        }
    }
    
    // Verification
    console.log('\n🎯 VERIFICATION:');
    console.log(`  blocksWon = tokensGained? ${charlieStats.blocksWon === charlieStats.tokensGained ? '✅' : '❌'}`);
    console.log(`  tokensGained = actual cards owned? ${charlieStats.tokensGained === actualTokenCount ? '✅' : '❌'}`);
    
    return {
        charlieStats,
        currentBlocks: currentBlocks.Charlie,
        ownedCards: ownedCards.Charlie,
        actualTokenCount,
        totalSuccessfulRankings,
        discrepancy: charlieStats.blocksMade - charlieStats.tokensGained
    };
}

// Auto-run
debugCharlieBlocks();