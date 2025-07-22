// Script to capture test data before it gets reset
function captureTestData() {
    console.log('📸 CAPTURING TEST DATA BEFORE RESET');
    console.log('====================================');
    
    // Store data globally so it persists after game reset
    window.capturedTestData = {
        timestamp: new Date().toISOString(),
        blockedCardsByCategory: GameState.get('players.blockedCardsByCategory'),
        ownedCards: GameState.get('players.ownedCards'),
        playerStats: GameState.get('players.stats'),
        currentBlocks: GameState.get('players.currentBlocks'),
        round: GameState.get('gameFlow.round'),
        category: GameState.get('gameFlow.currentCategory')
    };
    
    console.log('✅ Data captured in window.capturedTestData');
    
    // Display the captured data
    console.log('\n📋 CAPTURED DATA:');
    console.log('Blocked cards by category:', window.capturedTestData.blockedCardsByCategory);
    console.log('Owned cards:', window.capturedTestData.ownedCards);
    console.log('Player stats:', window.capturedTestData.playerStats);
    
    // Analyze owned cards
    console.log('\n🔍 OWNED CARDS ANALYSIS:');
    const ownedCards = window.capturedTestData.ownedCards || {};
    Object.keys(ownedCards).forEach(player => {
        const playerOwned = ownedCards[player] || {};
        let total = 0;
        Object.keys(playerOwned).forEach(cat => {
            const cards = playerOwned[cat] || [];
            total += cards.length;
            if (cards.length > 0) {
                console.log(`  ${player} owns in ${cat}: ${cards.join(', ')}`);
            }
        });
        console.log(`  ${player} total owned: ${total}`);
    });
    
    return window.capturedTestData;
}

// Hook into the test completion to capture data before reset
if (typeof window !== 'undefined') {
    // Try to hook into continueToNextRound
    const originalContinue = window.continueToNextRound;
    if (originalContinue) {
        window.continueToNextRound = function() {
            // Capture data before continuing
            captureTestData();
            return originalContinue.apply(this, arguments);
        };
        console.log('✅ Hooked into continueToNextRound for data capture');
    }
    
    // Also hook into the final results display
    const originalShowFinalResults = window.showFinalResults;
    if (originalShowFinalResults) {
        window.showFinalResults = function() {
            console.log('🏁 CAPTURING FINAL TEST DATA');
            captureTestData();
            return originalShowFinalResults.apply(this, arguments);
        };
        console.log('✅ Hooked into showFinalResults for data capture');
    }
    
    console.log('📸 Test data capture ready');
    console.log('After Fast Test, check: window.capturedTestData');
}