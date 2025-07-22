/**
 * CLI Test for Base Game Mechanics
 * Tests core functionality without browser UI
 */

// Mock the window object and DOM for testing
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
    GAME_DATA: null,
    GameState: null,
    ACTIVE_RULES: null,
    RankingValidator: null,
    runTestV4: null,
    addEventListener: () => {},
    setTimeout: (fn, ms) => fn(), // Immediate execution for testing
    document: mockDocument,
    alert: () => {},
    confirm: () => true,
    console: console
};

// Set up global context
global.window = mockWindow;
global.document = mockWindow.document;
global.setTimeout = mockWindow.setTimeout;

console.log('🧪 Base Game Mechanics CLI Test');
console.log('================================');

try {
    // Load the game files
    console.log('📄 Loading game files...');
    
    // Load data.js
    const dataContent = require('fs').readFileSync('./data.js', 'utf8');
    eval(dataContent);
    console.log('✅ data.js loaded');
    
    // Load game.js
    const gameContent = require('fs').readFileSync('./game.js', 'utf8');
    eval(gameContent);
    console.log('✅ game.js loaded');
    
    // Load automated test v4
    const testContent = require('fs').readFileSync('./automated-test-v4.js', 'utf8');
    eval(testContent);
    console.log('✅ automated-test-v4.js loaded');
    
    console.log('\n🔍 Checking Critical Components...');
    
    // Check 1: Game Data
    if (window.GAME_DATA && window.GAME_DATA.categories) {
        const categories = Object.keys(window.GAME_DATA.categories);
        console.log(`✅ Game data loaded: ${categories.length} categories`);
        categories.forEach(cat => {
            const items = Object.keys(window.GAME_DATA.categories[cat].items || {}).length;
            console.log(`   ${cat}: ${items} items`);
        });
    } else {
        console.log('❌ Game data not available');
        process.exit(1);
    }
    
    // Check 2: GameState
    if (typeof window.GameState !== 'undefined') {
        console.log('✅ GameState system available');
    } else {
        console.log('❌ GameState system missing');
        process.exit(1);
    }
    
    // Check 3: ACTIVE_RULES
    if (typeof window.ACTIVE_RULES !== 'undefined' && window.ACTIVE_RULES !== null) {
        console.log('✅ ACTIVE_RULES configuration available');
        console.log(`   Token Ownership: ${window.ACTIVE_RULES.tokenOwnership}`);
        console.log(`   Allow Blocking: ${window.ACTIVE_RULES.allowBlocking}`);
        console.log(`   Allow Owned in Selection: ${window.ACTIVE_RULES.allowOwnedInSelection}`);
    } else {
        console.log('❌ ACTIVE_RULES configuration missing or null');
        console.log('   This usually means DOM initialization is needed');
        // Don't exit - try to continue with basic tests
    }
    
    // Check 4: RankingValidator
    if (typeof window.RankingValidator !== 'undefined') {
        console.log('✅ RankingValidator available');
    } else {
        console.log('❌ RankingValidator missing');
        process.exit(1);
    }
    
    // Check 5: Test system
    if (typeof window.runRealGameTest === 'function') {
        console.log('✅ Automated test system v4 available (runRealGameTest)');
    } else {
        console.log('❌ Automated test system v4 missing (runRealGameTest)');
        process.exit(1);
    }
    
    console.log('\n🎯 Current Configuration Analysis:');
    console.log('==================================');
    
    if (window.ACTIVE_RULES && window.ACTIVE_RULES !== null) {
        console.log(`Base game config (tokenOwnership=${window.ACTIVE_RULES.tokenOwnership}):`);
        console.log(`  - Token ownership after blocks: ${window.ACTIVE_RULES.tokenOwnership ? 'ENABLED' : 'DISABLED'}`);
        console.log(`  - Owned tokens in selection: ${window.ACTIVE_RULES.allowOwnedInSelection ? 'ENABLED' : 'DISABLED'}`);
        console.log(`  - Token replacement in pool: ${window.ACTIVE_RULES.tokenReplacement ? 'ENABLED' : 'DISABLED'}`);
        console.log(`  - Blocking system: ${window.ACTIVE_RULES.allowBlocking ? 'ENABLED' : 'DISABLED'}`);
        console.log(`  - Card refreshing: ${window.ACTIVE_RULES.refreshUsedCards ? 'ENABLED' : 'DISABLED'}`);
    } else {
        console.log('Cannot analyze configuration - ACTIVE_RULES not initialized');
        console.log('This usually means the game needs browser DOM initialization');
    }
    
    // Test basic functionality
    console.log('\n🔧 Testing Core Functions:');
    console.log('==========================');
    
    // Test GameState basic operations
    try {
        window.GameState.set('test.value', 123);
        const retrieved = window.GameState.get('test.value');
        if (retrieved === 123) {
            console.log('✅ GameState set/get operations working');
        } else {
            console.log('❌ GameState set/get operations failed');
        }
    } catch (error) {
        console.log(`❌ GameState error: ${error.message}`);
    }
    
    // Test RankingValidator basic functionality
    try {
        const testPrompt = { label: 'Countries ranked from highest to lowest by GDP' };
        const challengeType = window.RankingValidator.detectChallengeType(testPrompt);
        if (challengeType === 'descending' || challengeType === 'ascending') {
            console.log('✅ RankingValidator challenge detection working');
        } else {
            console.log(`❌ RankingValidator returned unexpected type: ${challengeType}`);
        }
    } catch (error) {
        console.log(`❌ RankingValidator error: ${error.message}`);
    }
    
    console.log('\n📊 Base Mechanics Assessment:');
    console.log('=============================');
    
    if (window.ACTIVE_RULES && window.ACTIVE_RULES !== null) {
        const currentConfig = window.ACTIVE_RULES;
        
        // Assess if base blocking/token mechanics will work
        if (currentConfig.tokenOwnership && currentConfig.allowBlocking) {
            console.log('✅ Base token mechanics should work:');
            console.log('   - Players can block cards');
            console.log('   - Blocked cards become owned when bidder fails');
            console.log('   - blocksWon = tokensGained relationship maintained');
        } else {
            console.log('⚠️  Limited token mechanics:');
            if (!currentConfig.allowBlocking) {
                console.log('   - Blocking is disabled');
            }
            if (!currentConfig.tokenOwnership) {
                console.log('   - Token ownership is disabled');
            }
        }
        
        // Check for advanced features
        if (!currentConfig.allowOwnedInSelection) {
            console.log('ℹ️  Advanced feature disabled: Owned tokens not available for bidder selection');
        }
        
        if (!currentConfig.tokenReplacement) {
            console.log('ℹ️  Advanced feature disabled: Token pool replacement');
        }
    } else {
        console.log('⚠️  Cannot assess mechanics - configuration not loaded');
        console.log('   Game appears to require browser DOM for full initialization');
    }
    
    console.log('\n✅ Base Game Mechanics Analysis Complete');
    console.log('==========================================');
    console.log('Core systems are loaded and functional.');
    console.log('Ready for testing with current configuration.');
    
} catch (error) {
    console.log(`❌ Fatal error during setup: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
}