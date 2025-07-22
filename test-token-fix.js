/**
 * Test script to verify the token ownership fix
 * Tests the exact scenario: multiple blocks in same round, some duplicates
 */

// Load and test the game
const fs = require('fs');

// Mock the DOM environment
const mockDocument = {
    getElementById: () => ({ 
        style: {}, 
        classList: { add: () => {}, remove: () => {}, contains: () => false },
        innerHTML: '',
        textContent: '',
        value: ''
    }),
    createElement: () => ({ 
        onload: null, 
        onerror: null, 
        src: null,
        style: {},
        classList: { add: () => {}, remove: () => {} }
    }),
    head: { appendChild: () => {} },
    addEventListener: () => {},
    querySelectorAll: () => [],
    querySelector: () => null
};

const mockWindow = {
    addEventListener: () => {},
    setTimeout: (fn, ms) => fn(),
    document: mockDocument,
    alert: () => {},
    confirm: () => true,
    console: console
};

global.window = mockWindow;
global.document = mockWindow.document;
global.setTimeout = mockWindow.setTimeout;

console.log('🧪 Testing token ownership fix...');

try {
    // Load data.js
    const dataContent = fs.readFileSync('./data.js', 'utf8');
    eval(dataContent);
    console.log('✅ data.js loaded');
    
    // Load game.js
    const gameContent = fs.readFileSync('./game.js', 'utf8');
    eval(gameContent);
    console.log('✅ game.js loaded');
    
    // Initialize game
    console.log('\n🎮 Initializing test game...');
    window.newGame();
    
    // Set up players
    GameState.initializePlayer('Alice');
    GameState.initializePlayer('Charlie');
    
    // Set up test scenario: Alice bids, Charlie blocks same card multiple times
    GameState.set('currentCategory', 'countries');
    GameState.set('currentRound', 1);
    GameState.set('highestBidder', 'Alice');
    GameState.set('bidderSuccess', false);
    
    // Set up blocks
    GameState.set('players.currentBlocks', {
        Charlie: { cardId: 'USA', tokenValue: 2 }
    });
    
    console.log('\n📊 Before fix test:');
    const statsBefore = GameState.get('players.stats.Charlie');
    console.log('Charlie stats:', statsBefore);
    
    // Run scoring
    console.log('\n💰 Running calculateAndApplyScores...');
    window.calculateAndApplyScores();
    
    console.log('\n📊 After first block:');
    const statsAfter1 = GameState.get('players.stats.Charlie');
    console.log('Charlie stats:', statsAfter1);
    console.log('blocksWon == tokensGained?', statsAfter1.blocksWon === statsAfter1.tokensGained);
    
    // Test duplicate block scenario
    console.log('\n🔄 Testing duplicate block scenario...');
    GameState.set('players.scoresCalculatedThisRound', false); // Reset for second scoring
    GameState.set('players.currentBlocks', {
        Charlie: { cardId: 'USA', tokenValue: 4 } // Same card, different token
    });
    
    window.calculateAndApplyScores();
    
    console.log('\n📊 After duplicate block attempt:');
    const statsAfter2 = GameState.get('players.stats.Charlie');
    console.log('Charlie stats:', statsAfter2);
    console.log('blocksWon == tokensGained?', statsAfter2.blocksWon === statsAfter2.tokensGained);
    
    // Test different card
    console.log('\n🔄 Testing different card block...');
    GameState.set('players.scoresCalculatedThisRound', false); // Reset for third scoring
    GameState.set('players.currentBlocks', {
        Charlie: { cardId: 'CAN', tokenValue: 6 } // Different card
    });
    
    window.calculateAndApplyScores();
    
    console.log('\n📊 After different card block:');
    const statsAfter3 = GameState.get('players.stats.Charlie');
    console.log('Charlie stats:', statsAfter3);
    console.log('blocksWon == tokensGained?', statsAfter3.blocksWon === statsAfter3.tokensGained);
    
    console.log('\n✅ Token ownership fix test complete!');
    console.log('Expected: blocksWon should always equal tokensGained');
    console.log('Result: ' + (statsAfter3.blocksWon === statsAfter3.tokensGained ? 'PASS' : 'FAIL'));
    
} catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
}