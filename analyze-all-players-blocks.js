// Comprehensive analysis of all players' block/token stats
// Auto-runs at end of Fast Test for easy copy/paste

function analyzeAllPlayersBlocks() {
    console.log('🔍 COMPREHENSIVE BLOCK/TOKEN ANALYSIS');
    console.log('=====================================');
    
    const playersList = GameState.get('players.list') || [];
    
    // Game-wide stats
    let totalSuccessfulRankings = 0;
    let totalBlocksMade = 0;
    let totalBlocksWon = 0;
    let totalTokensGained = 0;
    
    console.log('\n📊 INDIVIDUAL PLAYER ANALYSIS:');
    console.log('===============================');
    
    playersList.forEach(playerName => {
        const stats = getPlayerStats(playerName);
        
        // Count owned cards
        const ownedCards = GameState.get('players.ownedCards') || {};
        let actualTokenCount = 0;
        if (ownedCards[playerName]) {
            Object.keys(ownedCards[playerName]).forEach(category => {
                const cards = ownedCards[playerName][category] || [];
                actualTokenCount += cards.length;
            });
        }
        
        // Analysis
        const blockDiscrepancy = stats.blocksMade - stats.tokensGained;
        const statsConsistent = stats.blocksWon === stats.tokensGained;
        const tokensConsistent = stats.tokensGained === actualTokenCount;
        
        console.log(`\n👤 ${playerName}:`);
        console.log(`  blocksMade: ${stats.blocksMade}`);
        console.log(`  blocksWon: ${stats.blocksWon}`);
        console.log(`  blocksLost: ${stats.blocksLost}`);
        console.log(`  tokensGained: ${stats.tokensGained}`);
        console.log(`  actualTokensOwned: ${actualTokenCount}`);
        console.log(`  bidsWon: ${stats.bidsWon || 0}`);
        console.log(`  bidsSuccessful: ${stats.bidsSuccessful || 0}`);
        console.log(`  blockDiscrepancy: ${blockDiscrepancy} (blocksMade - tokensGained)`);
        console.log(`  blocksWon = tokensGained? ${statsConsistent ? '✅' : '❌'}`);
        console.log(`  tokensGained = actualOwned? ${tokensConsistent ? '✅' : '❌'}`);
        
        if (blockDiscrepancy > 0) {
            const possibleSelfBlocks = stats.bidsWon || 0;
            if (possibleSelfBlocks >= blockDiscrepancy) {
                console.log(`  🤔 Likely explanation: ${blockDiscrepancy} self-blocks (bidder can't block)`);
            } else {
                console.log(`  ❌ Unknown issue: discrepancy can't be explained by self-blocks`);
            }
        }
        
        // Accumulate totals
        totalSuccessfulRankings += stats.bidsSuccessful || 0;
        totalBlocksMade += stats.blocksMade;
        totalBlocksWon += stats.blocksWon;
        totalTokensGained += stats.tokensGained;
    });
    
    console.log('\n🎯 GAME-WIDE SUMMARY:');
    console.log('=====================');
    console.log(`Total successful rankings: ${totalSuccessfulRankings}`);
    console.log(`Total blocks made: ${totalBlocksMade}`);
    console.log(`Total blocks won: ${totalBlocksWon}`);
    console.log(`Total tokens gained: ${totalTokensGained}`);
    console.log(`blocksWon = tokensGained? ${totalBlocksWon === totalTokensGained ? '✅' : '❌'}`);
    
    if (totalSuccessfulRankings === 0) {
        console.log('\n✅ No successful rankings - all blocks should result in tokens');
        if (totalBlocksMade > totalTokensGained) {
            console.log(`❌ Issue: ${totalBlocksMade - totalTokensGained} blocks didn't result in tokens`);
        }
    }
    
    console.log('\n📋 COPY/PASTE SUMMARY FOR DEBUGGING:');
    console.log('====================================');
    console.log('PLAYERS_STATS_SUMMARY:');
    playersList.forEach(playerName => {
        const stats = getPlayerStats(playerName);
        const ownedCards = GameState.get('players.ownedCards') || {};
        let actualTokenCount = 0;
        if (ownedCards[playerName]) {
            Object.keys(ownedCards[playerName]).forEach(category => {
                actualTokenCount += (ownedCards[playerName][category] || []).length;
            });
        }
        console.log(`${playerName}: blocksMade=${stats.blocksMade}, blocksWon=${stats.blocksWon}, tokensGained=${stats.tokensGained}, actualOwned=${actualTokenCount}, bidsWon=${stats.bidsWon || 0}, bidsSuccessful=${stats.bidsSuccessful || 0}`);
    });
    
    return {
        totalSuccessfulRankings,
        totalBlocksMade,
        totalBlocksWon,
        totalTokensGained,
        playersData: playersList.map(name => {
            const stats = getPlayerStats(name);
            const ownedCards = GameState.get('players.ownedCards') || {};
            let actualTokenCount = 0;
            if (ownedCards[name]) {
                Object.keys(ownedCards[name]).forEach(category => {
                    actualTokenCount += (ownedCards[name][category] || []).length;
                });
            }
            return {
                name,
                ...stats,
                actualTokenCount,
                discrepancy: stats.blocksMade - stats.tokensGained
            };
        })
    };
}

// Auto-run after automated test completes
if (typeof window !== 'undefined') {
    // Hook into test completion
    const originalCompleteTest = window.completeAutomatedTest;
    if (originalCompleteTest) {
        window.completeAutomatedTest = function() {
            const result = originalCompleteTest.apply(this, arguments);
            setTimeout(() => {
                console.log('\n\n🎯 AUTO-RUNNING BLOCK ANALYSIS:');
                analyzeAllPlayersBlocks();
            }, 1000);
            return result;
        };
    }
}