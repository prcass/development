// Test to debug token allocation issue
function testTokenAllocation() {
    console.log('🧪 TESTING TOKEN ALLOCATION LOGIC');
    console.log('=================================');
    
    // Check the last test data
    if (!window.capturedTestData) {
        console.log('❌ No captured test data. Run Fast Test first.');
        return;
    }
    
    const stats = window.capturedTestData.playerStats;
    const owned = window.capturedTestData.ownedCards;
    
    console.log('\n📊 ALLOCATION ANALYSIS:');
    
    // For each player, check if stats match ownership
    Object.keys(stats).forEach(player => {
        const playerStats = stats[player];
        const playerOwned = owned[player];
        
        // Count actual owned tokens
        let actualOwned = 0;
        Object.keys(playerOwned).forEach(category => {
            actualOwned += playerOwned[category].length;
        });
        
        console.log(`\n${player}:`);
        console.log(`  Stats: tokensGained=${playerStats.tokensGained}, blocksWon=${playerStats.blocksWon}`);
        console.log(`  Actually owns: ${actualOwned} tokens`);
        
        if (playerStats.tokensGained !== actualOwned) {
            console.log(`  ❌ MISMATCH: Should own ${playerStats.tokensGained} but owns ${actualOwned}`);
            
            // List what they actually own
            Object.keys(playerOwned).forEach(category => {
                if (playerOwned[category].length > 0) {
                    console.log(`    Owns in ${category}: ${playerOwned[category].join(', ')}`);
                }
            });
        } else if (actualOwned > 0) {
            console.log(`  ✅ Correct allocation`);
        }
    });
    
    console.log('\n🔍 MISALLOCATED TOKENS:');
    
    // Check for tokens owned by wrong players
    Object.keys(owned).forEach(player => {
        const playerStats = stats[player];
        const playerOwned = owned[player];
        
        // Count actual owned tokens
        let actualOwned = 0;
        Object.keys(playerOwned).forEach(category => {
            actualOwned += playerOwned[category].length;
        });
        
        // If they own more than they should
        if (actualOwned > playerStats.tokensGained) {
            console.log(`❌ ${player} owns ${actualOwned} tokens but only gained ${playerStats.tokensGained}`);
            console.log(`   This player received someone else's token!`);
        }
    });
    
    // Check Charlie specifically
    console.log('\n🎯 CHARLIE SPECIFIC CHECK:');
    console.log('Charlie stats:', stats.Charlie);
    console.log('Charlie owns:', owned.Charlie);
    console.log('Alice owns:', owned.Alice);
    
    if (stats.Charlie.tokensGained > 0) {
        let charlieActualOwned = 0;
        Object.keys(owned.Charlie).forEach(cat => charlieActualOwned += owned.Charlie[cat].length);
        
        if (charlieActualOwned === 0) {
            console.log('❌ Charlie gained tokens but owns none!');
            console.log('   Checking if Alice got Charlie\'s token...');
            
            if (owned.Alice.companies.length > 0 && stats.Alice.tokensGained === 0) {
                console.log('   ✅ CONFIRMED: Alice has company token she shouldn\'t have!');
                console.log('   This is likely Charlie\'s missing token.');
            }
        }
    }
    
    return {
        misallocationDetected: stats.Charlie.tokensGained > 0 && owned.Alice.companies.length > 0 && stats.Alice.tokensGained === 0
    };
}

// Auto-run
if (typeof window !== 'undefined') {
    console.log('Run: testTokenAllocation()');
}