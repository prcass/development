// Console test for block tracking
// Paste this into the browser console after starting a game

function testBlockTracking() {
    console.log('🧪 BLOCK TRACKING TEST STARTING...');
    
    // Check if migration function exists
    if (typeof migrateBlocksToArrayFormat === 'function') {
        console.log('✅ Migration function exists');
        migrateBlocksToArrayFormat();
    } else {
        console.log('❌ Migration function NOT FOUND');
    }
    
    // Check current blocks format
    const currentBlocks = GameState.get('players.currentBlocks');
    console.log('📊 Current blocks state:', currentBlocks);
    
    // Check if all player blocks are arrays
    let allArrays = true;
    Object.keys(currentBlocks).forEach(playerName => {
        if (currentBlocks[playerName] && !Array.isArray(currentBlocks[playerName])) {
            console.log('❌ Non-array blocks found for', playerName, ':', currentBlocks[playerName]);
            allArrays = false;
        }
    });
    
    if (allArrays) {
        console.log('✅ All blocks are in array format');
    }
    
    // Check token tracking function
    if (typeof updatePlayerTokenTracking === 'function') {
        console.log('✅ Token tracking function exists');
    } else {
        console.log('❌ Token tracking function NOT FOUND');
    }
    
    // Test a mock block
    console.log('\n🧪 Testing mock block...');
    const testPlayer = GameState.get('players.list')[0];
    if (testPlayer) {
        console.log('  Test player:', testPlayer);
        
        // Get initial stats
        const initialStats = getPlayerStats(testPlayer);
        console.log('  Initial stats:', initialStats);
        
        // Simulate a block
        updatePlayerTokenTracking(testPlayer, 'block_made');
        updatePlayerTokenTracking(testPlayer, 'token_gained');
        updatePlayerTokenTracking(testPlayer, 'block_points_earned', {points: 4});
        
        // Check updated stats
        const updatedStats = getPlayerStats(testPlayer);
        console.log('  Updated stats:', updatedStats);
        
        if (updatedStats.blocksMade > initialStats.blocksMade) {
            console.log('✅ Block tracking working');
        } else {
            console.log('❌ Block tracking NOT working');
        }
    }
    
    console.log('\n🧪 BLOCK TRACKING TEST COMPLETE');
}

// Run the test
testBlockTracking();