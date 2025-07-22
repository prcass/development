// Debug Diana's round history to understand the 2 blocks vs 1 token issue
// Run this in browser console

function debugDianaRounds() {
    console.log('🔍 DEBUGGING DIANA\'S ROUND HISTORY');
    console.log('==================================');
    
    const dianaStats = getPlayerStats('Diana');
    
    console.log('\n📊 Diana\'s Key Stats:');
    console.log('  Rounds Won (bids won):', dianaStats.bidsWon || 0);
    console.log('  Successful Rankings:', dianaStats.bidsSuccessful || 0);
    console.log('  Blocks Made:', dianaStats.blocksMade);
    console.log('  Blocks Won:', dianaStats.blocksWon);
    console.log('  Tokens Gained:', dianaStats.tokensGained);
    
    console.log('\n📈 Analysis:');
    console.log(`  Diana won ${dianaStats.bidsWon || 0} bids but failed all rankings`);
    console.log(`  Diana made ${dianaStats.blocksMade} blocks total`);
    console.log(`  Only ${dianaStats.tokensGained} resulted in tokens`);
    
    // Check if Diana blocked herself
    console.log('\n🤔 Possible Scenarios:');
    if ((dianaStats.bidsWon || 0) > 0) {
        console.log('  SCENARIO 1: Diana blocked her own bid attempts');
        console.log('    - When Diana wins a bid, she can\'t gain tokens from blocking herself');
        console.log('    - This would cause blocksMade > tokensGained');
        console.log(`    - Diana won ${dianaStats.bidsWon} bids, so ${dianaStats.bidsWon} of her blocks might be self-blocks`);
    }
    
    if (dianaStats.blocksMade > (dianaStats.bidsWon || 0)) {
        const otherBlocks = dianaStats.blocksMade - (dianaStats.bidsWon || 0);
        console.log(`  SCENARIO 2: Diana also blocked ${otherBlocks} other players`);
        console.log('    - These should have given tokens if those bidders failed');
    }
    
    // Check owned cards to verify token count
    const ownedCards = GameState.get('players.ownedCards') || {};
    let actualTokenCount = 0;
    if (ownedCards.Diana) {
        Object.keys(ownedCards.Diana).forEach(category => {
            const cards = ownedCards.Diana[category] || [];
            actualTokenCount += cards.length;
            if (cards.length > 0) {
                console.log(`\n🏆 Diana owns ${cards.length} ${category} cards: [${cards.join(', ')}]`);
            }
        });
    }
    
    console.log(`\n🎯 VERIFICATION:`);
    console.log(`  tokensGained stat: ${dianaStats.tokensGained}`);
    console.log(`  Actual owned cards: ${actualTokenCount}`);
    console.log(`  Match? ${dianaStats.tokensGained === actualTokenCount ? '✅' : '❌'}`);
    
    // Final analysis
    console.log('\n🔍 LIKELY EXPLANATION:');
    if ((dianaStats.bidsWon || 0) > 0) {
        console.log('  Diana likely blocked herself when she was the bidder');
        console.log('  Self-blocks increment blocksMade but don\'t give tokens');
        console.log('  This is correct game behavior');
    } else {
        console.log('  Unknown issue - Diana never won bids but still has blocksMade > tokensGained');
    }
    
    return {
        blocksMade: dianaStats.blocksMade,
        tokensGained: dianaStats.tokensGained,
        actualTokenCount,
        bidsWon: dianaStats.bidsWon || 0,
        isConsistent: dianaStats.tokensGained === actualTokenCount,
        possibleSelfBlocks: dianaStats.bidsWon || 0
    };
}

// Auto-run
debugDianaRounds();