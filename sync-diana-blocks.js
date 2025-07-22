// Fix Diana's historical block/token discrepancy
// Run this in browser console

function syncDianaBlocks() {
    console.log('🔧 SYNCING DIANA\'S BLOCKS TO MATCH TOKENS');
    console.log('==========================================');
    
    const dianaStats = getPlayerStats('Diana');
    console.log('\n📊 Before sync:');
    console.log(`  blocksMade: ${dianaStats.blocksMade}`);
    console.log(`  blocksWon: ${dianaStats.blocksWon}`);
    console.log(`  tokensGained: ${dianaStats.tokensGained}`);
    
    // The historical block that wasn't stored can't give a token retroactively
    // So we need to adjust blocksMade to match reality
    if (dianaStats.blocksMade > dianaStats.tokensGained && dianaStats.tokensGained === dianaStats.blocksWon) {
        console.log('\n🔍 Detected historical block made before fix');
        console.log('   This block was never stored in currentBlocks and cannot give a token');
        console.log('   Adjusting blocksMade to match actual processable blocks');
        
        // Set blocksMade to equal tokensGained (since no rankings succeeded)
        dianaStats.blocksMade = dianaStats.tokensGained;
        
        GameState.set('players.stats.Diana', dianaStats);
        
        console.log('\n✅ After sync:');
        console.log(`  blocksMade: ${dianaStats.blocksMade}`);
        console.log(`  blocksWon: ${dianaStats.blocksWon}`);
        console.log(`  tokensGained: ${dianaStats.tokensGained}`);
        console.log('  ✅ All values now consistent!');
        
        return { fixed: true, newBlocksMade: dianaStats.blocksMade };
    } else {
        console.log('❌ Unexpected stats pattern, manual review needed');
        return { fixed: false };
    }
}

// Auto-run
syncDianaBlocks();