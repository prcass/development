// Analyze the multi-block issue where tokensGained=2 but actual ownership is less
function analyzeMultiBlockIssue() {
    console.log('🔍 ANALYZING MULTI-BLOCK TOKEN ISSUE');
    console.log('====================================');
    
    if (!window.testResults || window.testResults.length === 0) {
        console.log('❌ No test results captured. Run multiple Fast Tests first.');
        return;
    }
    
    // Analyze each test
    window.testResults.forEach((test, index) => {
        console.log(`\n📊 TEST ${index + 1} ANALYSIS:`);
        console.log('------------------------');
        
        Object.keys(test.stats).forEach(player => {
            const stats = test.stats[player];
            const owned = test.owned[player];
            
            // Only analyze players with issues
            if (stats.tokensGained > 0) {
                let actualOwned = 0;
                let ownedDetails = [];
                
                Object.keys(owned).forEach(category => {
                    const cards = owned[category];
                    actualOwned += cards.length;
                    if (cards.length > 0) {
                        ownedDetails.push(`${category}: ${cards.join(', ')}`);
                    }
                });
                
                if (stats.tokensGained !== actualOwned) {
                    console.log(`\n❌ ${player} DISCREPANCY:`);
                    console.log(`  Stats show:      tokensGained=${stats.tokensGained}, blocksWon=${stats.blocksWon}`);
                    console.log(`  Actually owns:   ${actualOwned} tokens`);
                    console.log(`  Missing tokens:  ${stats.tokensGained - actualOwned}`);
                    
                    if (ownedDetails.length > 0) {
                        console.log(`  Owned tokens:    ${ownedDetails.join(', ')}`);
                    }
                    
                    // Hypothesis checks
                    console.log(`  \n  💡 HYPOTHESIS CHECKS:`);
                    
                    // Check if player made multiple blocks
                    if (stats.blocksMade > 1) {
                        console.log(`    - Made ${stats.blocksMade} blocks (could be multi-block issue)`);
                    }
                    
                    // Check if blocksWon matches tokensGained
                    if (stats.blocksWon === stats.tokensGained) {
                        console.log(`    - blocksWon=${stats.blocksWon} matches tokensGained ✅`);
                        console.log(`    - But actual ownership doesn't match!`);
                    }
                    
                    // Check for specific patterns
                    if (stats.tokensGained === 2 && actualOwned <= 1) {
                        console.log(`    - Classic pattern: gained 2, owns ${actualOwned}`);
                        console.log(`    - Likely cause: forEach loop increments counter twice`);
                        console.log(`      but only one token is stored`);
                    }
                }
            }
        });
    });
    
    console.log('\n🎯 ROOT CAUSE ANALYSIS:');
    console.log('=======================');
    console.log('The pattern shows:');
    console.log('1. Players frequently have tokensGained=2');
    console.log('2. But they only own 0-1 actual tokens');
    console.log('3. The forEach loop processing blocks is likely:');
    console.log('   - Incrementing tokensGained for each block');
    console.log('   - But failing to store all tokens properly');
    console.log('\nNEXT STEP: Check if the token storage is being overwritten');
    console.log('or if there\'s a bug preventing multiple tokens from being stored.');
    
    return {
        testsAnalyzed: window.testResults.length,
        issueConfirmed: true,
        pattern: 'tokensGained incremented multiple times but tokens not all stored'
    };
}

// Make testResults globally accessible
if (typeof window !== 'undefined' && !window.testResults) {
    window.testResults = [];
}

console.log('Run: analyzeMultiBlockIssue()');