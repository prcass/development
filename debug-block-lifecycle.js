// Enhanced debugging script to track block/token lifecycle
// Tracks the exact flow of blocks from attempt to scoring to token award

function debugBlockLifecycle() {
    console.log('🔬 BLOCK LIFECYCLE TRACKER - Enhanced Debug Mode');
    console.log('=================================================');
    
    const playersList = GameState.get('players.list') || [];
    
    console.log('\n📊 CURRENT GAME STATE:');
    console.log('Round:', GameState.get('gameFlow.round') || 'Unknown');
    console.log('Category:', GameState.get('gameFlow.currentCategory') || 'Unknown');
    console.log('Bidder:', GameState.get('highestBidder') || 'None');
    
    console.log('\n🎯 ACTIVE BLOCKS:');
    const currentBlocks = GameState.get('players.currentBlocks') || {};
    console.log('Active blocks:', Object.keys(currentBlocks).length);
    Object.keys(currentBlocks).forEach(playerName => {
        const block = currentBlocks[playerName];
        console.log(`  ${playerName}: ${block.cardId} (${block.tokenValue} points)`);
    });
    
    console.log('\n📋 BLOCKED CARDS BY CATEGORY:');
    const blockedByCategory = GameState.get('players.blockedCardsByCategory') || {};
    Object.keys(blockedByCategory).forEach(category => {
        console.log(`  ${category}: ${blockedByCategory[category].length} cards`);
        blockedByCategory[category].forEach(blocked => {
            console.log(`    ${blocked.cardId} (round ${blocked.round}, by ${blocked.blockedBy})`);
        });
    });
    
    console.log('\n👥 DETAILED PLAYER ANALYSIS:');
    playersList.forEach(playerName => {
        const stats = getPlayerStats(playerName);
        const ownedCards = GameState.get('players.ownedCards') || {};
        let actualTokenCount = 0;
        
        if (ownedCards[playerName]) {
            Object.keys(ownedCards[playerName]).forEach(category => {
                const cards = ownedCards[playerName][category] || [];
                actualTokenCount += cards.length;
            });
        }
        
        console.log(`\n🧑 ${playerName}:`);
        console.log(`  blocksMade: ${stats.blocksMade || 0}`);
        console.log(`  blocksWon: ${stats.blocksWon || 0}`);
        console.log(`  blocksLost: ${stats.blocksLost || 0}`);
        console.log(`  tokensGained: ${stats.tokensGained || 0}`);
        console.log(`  actualTokensOwned: ${actualTokenCount}`);
        console.log(`  bidsWon: ${stats.bidsWon || 0}`);
        console.log(`  bidsSuccessful: ${stats.bidsSuccessful || 0}`);
        
        // Analyze discrepancies
        const blockDiscrepancy = (stats.blocksMade || 0) - (stats.tokensGained || 0);
        const relationshipOK = (stats.blocksWon || 0) === (stats.tokensGained || 0);
        const ownershipOK = (stats.tokensGained || 0) === actualTokenCount;
        
        console.log(`  📊 Analysis:`);
        console.log(`    Block discrepancy: ${blockDiscrepancy} (blocksMade - tokensGained)`);
        console.log(`    blocksWon == tokensGained: ${relationshipOK ? '✅' : '❌'}`);
        console.log(`    tokensGained == actualOwned: ${ownershipOK ? '✅' : '❌'}`);
        
        if (blockDiscrepancy > 0) {
            const possibleSelfBlocks = stats.bidsWon || 0;
            if (possibleSelfBlocks >= blockDiscrepancy) {
                console.log(`    🤔 Likely explanation: ${blockDiscrepancy} self-blocks (bidder can't win)`);
            } else {
                console.log(`    ❌ UNEXPLAINED: ${blockDiscrepancy - possibleSelfBlocks} blocks unaccounted for`);
                console.log(`       This needs investigation!`);
            }
        }
        
        // Show owned cards by category
        if (ownedCards[playerName]) {
            console.log(`  🎯 Owned cards:`);
            Object.keys(ownedCards[playerName]).forEach(category => {
                const cards = ownedCards[playerName][category] || [];
                if (cards.length > 0) {
                    console.log(`    ${category}: ${cards.join(', ')}`);
                }
            });
        }
    });
    
    console.log('\n🔍 INTEGRITY CHECKS:');
    
    // Check if all blocks are accounted for
    let totalBlocksMade = 0;
    let totalBlocksWon = 0;
    let totalTokensGained = 0;
    
    playersList.forEach(playerName => {
        const stats = getPlayerStats(playerName);
        totalBlocksMade += stats.blocksMade || 0;
        totalBlocksWon += stats.blocksWon || 0;
        totalTokensGained += stats.tokensGained || 0;
    });
    
    console.log(`Total blocks made: ${totalBlocksMade}`);
    console.log(`Total blocks won: ${totalBlocksWon}`);
    console.log(`Total tokens gained: ${totalTokensGained}`);
    console.log(`blocksWon == tokensGained: ${totalBlocksWon === totalTokensGained ? '✅' : '❌'}`);
    
    if (totalBlocksMade > totalTokensGained) {
        console.log(`❓ ${totalBlocksMade - totalTokensGained} blocks made but didn't result in tokens`);
        console.log('   This could be due to:');
        console.log('   1. Bidders attempting to block (should be prevented)');
        console.log('   2. Successful bids (blockers lose, get no tokens)');
        console.log('   3. Bug in block processing');
    }
    
    return {
        totalBlocksMade,
        totalBlocksWon,
        totalTokensGained,
        activeBlocks: Object.keys(currentBlocks).length,
        integrityOK: totalBlocksWon === totalTokensGained
    };
}

// Auto-hook into Fast Test if available
if (typeof window !== 'undefined') {
    console.log('🔬 Block Lifecycle Tracker Loaded');
    console.log('Run: debugBlockLifecycle()');
    
    // Try to hook into Fast Test completion
    if (window.continueToNextRound) {
        const originalContinue = window.continueToNextRound;
        window.continueToNextRound = function() {
            const result = originalContinue.apply(this, arguments);
            
            // Run debug after each round
            setTimeout(() => {
                console.log('\n🔬 AUTO-DEBUG: Round completed, running lifecycle check...');
                debugBlockLifecycle();
            }, 500);
            
            return result;
        };
        console.log('✅ Hooked into round completion for auto-debugging');
    }
}