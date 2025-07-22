// Phase 1 Token Ownership Fix Test - Paste into browser console after automated test

function testPhase1TokenOwnership() {
    console.log('🧪 PHASE 1 TOKEN OWNERSHIP TEST');
    console.log('===============================');
    
    // Check if ownedCards exist in GameState
    const ownedCards = GameState.get('players.ownedCards') || {};
    console.log('📦 Owned cards from GameState:', ownedCards);
    
    const playersList = GameState.get('players.list') || [];
    if (playersList.length === 0) {
        console.log('❌ No players found - start a game first');
        return;
    }
    
    console.log('\n📊 ANALYZING TOKEN OWNERSHIP FOR ALL PLAYERS:');
    let totalTokensOwned = 0;
    let totalBlocksWon = 0;
    let consistencyIssues = 0;
    
    playersList.forEach(playerName => {
        const stats = getPlayerStats(playerName);
        console.log(`\n👤 ${playerName}:`);
        console.log(`  blocksWon: ${stats.blocksWon}`);
        console.log(`  tokensGained: ${stats.tokensGained}`);
        
        // Check owned cards for this player
        let actualTokensOwned = 0;
        if (ownedCards[playerName]) {
            Object.keys(ownedCards[playerName]).forEach(category => {
                const categoryCards = ownedCards[playerName][category] || [];
                actualTokensOwned += categoryCards.length;
                if (categoryCards.length > 0) {
                    console.log(`  ${category}: ${categoryCards.length} cards owned (${categoryCards.join(', ')})`);
                }
            });
        }
        
        console.log(`  actualTokensOwned: ${actualTokensOwned} (from GameState ownedCards)`);
        
        // Check consistency
        if (stats.tokensGained !== stats.blocksWon) {
            console.log(`  ❌ INCONSISTENCY: tokensGained(${stats.tokensGained}) ≠ blocksWon(${stats.blocksWon})`);
            consistencyIssues++;
        } else if (stats.blocksWon > 0) {
            console.log(`  ✅ CONSISTENT: tokensGained = blocksWon = ${stats.blocksWon}`);
        }
        
        if (actualTokensOwned !== stats.tokensGained) {
            console.log(`  ❌ PERSISTENCE ISSUE: actualTokensOwned(${actualTokensOwned}) ≠ tokensGained(${stats.tokensGained})`);
            consistencyIssues++;
        } else if (stats.tokensGained > 0) {
            console.log(`  ✅ PERSISTENT: actualTokensOwned = tokensGained = ${stats.tokensGained}`);
        }
        
        totalTokensOwned += actualTokensOwned;
        totalBlocksWon += stats.blocksWon;
    });
    
    console.log('\n🎯 PHASE 1 TEST RESULTS:');
    console.log(`Total blocks won across all players: ${totalBlocksWon}`);
    console.log(`Total tokens actually owned: ${totalTokensOwned}`);
    console.log(`Consistency issues found: ${consistencyIssues}`);
    
    if (consistencyIssues === 0 && totalBlocksWon > 0) {
        console.log('✅ ALL CHECKS PASSED - Token ownership working correctly!');
    } else if (totalBlocksWon === 0) {
        console.log('⚠️ No blocks won yet - run automated test to generate data');
    } else {
        console.log('❌ Issues found - token ownership may not be working correctly');
    }
    
    console.log('\n📝 EXPECTED CONSOLE MESSAGES DURING AUTOMATED TEST:');
    console.log('🔍 TOKEN OWNERSHIP CHECK for [player] - Rule enabled: true');
    console.log('🔍 Should gain ownership: true (bidder failed, block successful)');
    console.log('🔍 PROCEEDING with token ownership for [player] card: [cardId]');
    console.log('🏆 [player] now owns [cardName] (successful block)!');
    console.log('📊 TOKEN GAINED: [player] now has X tokens total');
    
    return {
        totalTokensOwned,
        totalBlocksWon,
        consistencyIssues,
        playersData: playersList.map(name => ({
            name,
            stats: getPlayerStats(name),
            ownedCards: ownedCards[name] || {}
        }))
    };
}

// Auto-run
testPhase1TokenOwnership();