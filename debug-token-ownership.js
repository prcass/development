/**
 * Debug script to test token ownership logic isolation
 * Tests if blocksWon and tokensGained increment correctly
 */

// Mock GameState for testing
const mockGameState = {
    data: {
        currentCategory: 'countries',
        currentRound: 1,
        highestBidder: 'Alice',
        bidderSuccess: false
    },
    get: function(path) {
        const parts = path.split('.');
        let obj = this.data;
        for (const part of parts) {
            obj = obj?.[part];
        }
        return obj;
    },
    set: function(path, value) {
        const parts = path.split('.');
        let obj = this.data;
        for (let i = 0; i < parts.length - 1; i++) {
            if (!obj[parts[i]]) obj[parts[i]] = {};
            obj = obj[parts[i]];
        }
        obj[parts[parts.length - 1]] = value;
    }
};

// Initialize test data
mockGameState.set('players.stats.Charlie', {
    blocksMade: 0,
    blocksWon: 0,
    tokensGained: 0
});

mockGameState.set('players.ownedCards.Charlie', {
    countries: [],
    movies: [],
    sports: [],
    companies: []
});

mockGameState.set('players.currentBlocks', {
    Charlie: { cardId: 'USA', tokenValue: 2 }
});

// Mock ACTIVE_RULES
const mockRules = {
    tokenOwnership: true
};

// Mock window.GAME_DATA
const mockGameData = {
    categories: {
        countries: {
            items: {
                USA: { name: 'United States' }
            }
        }
    }
};

console.log('🧪 Testing token ownership logic...');
console.log('Initial stats:', mockGameState.get('players.stats.Charlie'));

// Simulate the token ownership logic from calculateAndApplyScores
function testTokenOwnership() {
    const playerName = 'Charlie';
    const bidderSuccess = false;
    const highestBidder = 'Alice';
    const currentBlocks = mockGameState.get('players.currentBlocks');
    
    console.log('🔍 Starting token ownership test...');
    console.log('  bidderSuccess:', bidderSuccess);
    console.log('  highestBidder:', highestBidder);
    console.log('  currentBlocks:', currentBlocks);
    
    if (!bidderSuccess && mockRules.tokenOwnership) {
        Object.keys(currentBlocks).forEach(function(playerName) {
            console.log('  Processing player:', playerName, 'block:', currentBlocks[playerName]);
            if (playerName !== highestBidder && currentBlocks[playerName]) {
                const blockedCardId = currentBlocks[playerName].cardId;
                const tokenValue = currentBlocks[playerName].tokenValue;
                
                console.log('    blockedCardId:', blockedCardId);
                console.log('    tokenValue:', tokenValue);
                
                // 1. Increment blocksWon
                const currentStats = mockGameState.get('players.stats.' + playerName);
                console.log('    Current stats before:', currentStats);
                
                const oldBlocksWon = currentStats.blocksWon || 0;
                currentStats.blocksWon = oldBlocksWon + 1;
                
                console.log('    blocksWon: ' + oldBlocksWon + ' -> ' + currentStats.blocksWon);
                
                // 2. Check token ownership
                const ownedCards = mockGameState.get('players.ownedCards');
                const currentCategory = mockGameState.get('currentCategory');
                
                console.log('    Current category:', currentCategory);
                console.log('    Owned cards before:', ownedCards[playerName][currentCategory]);
                
                if (!ownedCards[playerName][currentCategory].includes(blockedCardId)) {
                    console.log('    ✅ Adding card to ownership');
                    ownedCards[playerName][currentCategory].push(blockedCardId);
                    
                    // 3. Increment tokensGained
                    const oldTokensGained = currentStats.tokensGained || 0;
                    currentStats.tokensGained = oldTokensGained + 1;
                    
                    console.log('    tokensGained: ' + oldTokensGained + ' -> ' + currentStats.tokensGained);
                    console.log('    Relationship check: blocksWon == tokensGained?', currentStats.blocksWon === currentStats.tokensGained);
                    
                    // Save back to mock state
                    mockGameState.set('players.stats.' + playerName, currentStats);
                    mockGameState.set('players.ownedCards', ownedCards);
                } else {
                    console.log('    ❌ Card already owned, no token gained');
                }
            }
        });
    }
    
    console.log('🏁 Final stats:', mockGameState.get('players.stats.Charlie'));
    console.log('🏁 Final owned cards:', mockGameState.get('players.ownedCards.Charlie.countries'));
}

// Test 1: Single block
console.log('\n=== TEST 1: Single Block ===');
testTokenOwnership();

// Test 2: Multiple blocks in same round (should both work)
console.log('\n=== TEST 2: Multiple Blocks Same Round ===');
mockGameState.set('players.currentBlocks.Charlie2', { cardId: 'CAN', tokenValue: 4 });
mockGameState.set('players.stats.Charlie2', { blocksMade: 0, blocksWon: 0, tokensGained: 0 });
mockGameState.set('players.ownedCards.Charlie2', { countries: [], movies: [], sports: [], companies: [] });
testTokenOwnership();

console.log('\n✅ Token ownership logic test complete');