// Test to verify blocksWon = tokensGained after ownership validation fix
// Run this in browser console after game is running and automated test has been run

function testBlocksWonEqualsTokensGained() {
    console.log('🧪 TESTING: blocksWon = tokensGained');
    console.log('==========================================');
    
    const playersList = GameState.get('players.list') || [];
    if (playersList.length === 0) {
        console.log('❌ No players found - start a game first');
        return;
    }
    
    let passCount = 0;
    let failCount = 0;
    let totalIssues = [];
    
    console.log('\n📊 CHECKING ALL PLAYERS:');
    
    playersList.forEach(playerName => {
        const stats = getPlayerStats(playerName);
        console.log(`\n👤 ${playerName}:`);
        console.log(`  blocksMade: ${stats.blocksMade}`);
        console.log(`  blocksWon: ${stats.blocksWon}`);
        console.log(`  blocksLost: ${stats.blocksLost}`);
        console.log(`  tokensGained: ${stats.tokensGained}`);
        
        // Check the critical relationship
        if (stats.blocksWon === stats.tokensGained) {
            console.log(`  ✅ PASS: blocksWon(${stats.blocksWon}) = tokensGained(${stats.tokensGained})`);
            passCount++;
        } else {
            console.log(`  ❌ FAIL: blocksWon(${stats.blocksWon}) ≠ tokensGained(${stats.tokensGained})`);
            failCount++;
            totalIssues.push({
                player: playerName,
                blocksWon: stats.blocksWon,
                tokensGained: stats.tokensGained,
                difference: stats.blocksWon - stats.tokensGained
            });
        }
        
        // Check math consistency
        const expectedTotal = stats.blocksWon + stats.blocksLost;
        if (expectedTotal !== stats.blocksMade) {
            console.log(`  ⚠️ Math issue: ${stats.blocksWon} + ${stats.blocksLost} = ${expectedTotal}, but blocksMade = ${stats.blocksMade}`);
        }
    });
    
    console.log('\n🎯 FINAL RESULTS:');
    console.log(`✅ Players with correct blocksWon = tokensGained: ${passCount}`);
    console.log(`❌ Players with incorrect relationship: ${failCount}`);
    
    if (failCount === 0) {
        console.log('\n🏆 SUCCESS: All players have blocksWon = tokensGained!');
        console.log('The ownership validation fix is working correctly.');
    } else {
        console.log('\n❌ ISSUES FOUND:');
        totalIssues.forEach(issue => {
            console.log(`  ${issue.player}: difference of ${issue.difference}`);
        });
        console.log('\nPossible causes:');
        console.log('- Players may have blocked cards they already owned (before fix)');
        console.log('- Test may need to be run with fresh game state');
        console.log('- Additional validation may be needed');
    }
    
    return {
        passCount,
        failCount,
        totalPlayers: playersList.length,
        issues: totalIssues,
        success: failCount === 0
    };
}

// Auto-run
testBlocksWonEqualsTokensGained();