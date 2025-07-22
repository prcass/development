// Debug Charlie's specific block issue
function debugCharlieBlock() {
    console.log('🔍 CHARLIE BLOCK DEBUG - Specific Analysis');
    console.log('==========================================');
    
    const charlieStats = getPlayerStats('Charlie');
    console.log('📊 Charlie Stats:', charlieStats);
    
    // Check current blocks storage
    const currentBlocks = GameState.get('players.currentBlocks') || {};
    console.log('🎯 Current Blocks (should be empty after scoring):', currentBlocks);
    
    // Check blocked cards by category
    const blockedByCategory = GameState.get('players.blockedCardsByCategory') || {};
    console.log('📋 Blocked Cards by Category:', blockedByCategory);
    
    // Check if Charlie has any blocks recorded
    Object.keys(blockedByCategory).forEach(category => {
        const categoryBlocks = blockedByCategory[category];
        const charlieBlocks = categoryBlocks.filter(block => block.blockedBy === 'Charlie');
        if (charlieBlocks.length > 0) {
            console.log(`📍 Charlie blocked in ${category}:`, charlieBlocks);
        }
    });
    
    // Check Charlie's owned cards
    const ownedCards = GameState.get('players.ownedCards') || {};
    const charlieOwned = ownedCards['Charlie'] || {};
    console.log('🏆 Charlie Owned Cards:', charlieOwned);
    
    let actualTokenCount = 0;
    Object.keys(charlieOwned).forEach(category => {
        const cards = charlieOwned[category] || [];
        actualTokenCount += cards.length;
        if (cards.length > 0) {
            console.log(`  ${category}: ${cards.join(', ')}`);
        }
    });
    
    console.log('\n🔍 ANALYSIS:');
    console.log(`Charlie made ${charlieStats.blocksMade} blocks`);
    console.log(`Charlie won ${charlieStats.blocksWon} blocks`);
    console.log(`Charlie gained ${charlieStats.tokensGained} tokens`);
    console.log(`Charlie actually owns ${actualTokenCount} tokens`);
    
    // The key insight: blocksWon should equal tokensGained when no bids succeed
    if (charlieStats.blocksWon !== charlieStats.tokensGained) {
        console.log('❌ CRITICAL: blocksWon ≠ tokensGained');
        console.log('   This means the block was made but never processed in scoring');
        console.log('   Looking for timing issue or storage problem...');
        
        // Check if block was stored but not processed
        if (charlieStats.blocksMade > 0 && charlieStats.blocksWon === 0) {
            console.log('💡 LIKELY ISSUE: Block was made but never scored');
            console.log('   Possible causes:');
            console.log('   1. Block not stored in currentBlocks');
            console.log('   2. Timing issue in calculateAndApplyScores');
            console.log('   3. Charlie was the bidder (should be prevented)');
        }
    }
    
    return {
        blocksMade: charlieStats.blocksMade,
        blocksWon: charlieStats.blocksWon,
        tokensGained: charlieStats.tokensGained,
        actualOwned: actualTokenCount,
        issue: charlieStats.blocksWon !== charlieStats.tokensGained ? 'blocks not scored' : 'no issue'
    };
}

// Auto-run
if (typeof window !== 'undefined') {
    console.log('Run: debugCharlieBlock()');
}