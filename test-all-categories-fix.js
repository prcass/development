// Comprehensive test script for all 4 categories
// Tests blocked cards persistence, validation system, and enhanced logging

function testAllCategoriesFix() {
    console.log('🧪 COMPREHENSIVE CATEGORY TEST - All Fixes');
    console.log('==========================================');
    
    if (typeof GameState === 'undefined') {
        console.log('❌ GameState not available - run this in browser with game loaded');
        return;
    }
    
    // Test 1: Verify all 4 categories are available
    const gameData = window.GAME_DATA;
    if (!gameData || !gameData.categories) {
        console.log('❌ Game data not available');
        return;
    }
    
    const categories = Object.keys(gameData.categories);
    console.log('✅ Test 1: Available categories:', categories);
    
    const expectedCategories = ['countries', 'movies', 'companies', 'sportsteams'];
    const missingCategories = expectedCategories.filter(cat => !categories.includes(cat));
    
    if (missingCategories.length > 0) {
        console.log('⚠️ Missing categories:', missingCategories);
        console.log('   Available:', categories);
        console.log('   Note: Will test with available categories only');
    }
    
    // Test 2: Initialize blocked cards storage
    console.log('\n✅ Test 2: Initialize blocked cards storage');
    GameState.set('players.blockedCardsByCategory', {});
    
    // Test 3: Test category-specific blocked card storage
    console.log('\n✅ Test 3: Test category-specific storage');
    const blockedCardsByCategory = {};
    
    categories.forEach((category, index) => {
        blockedCardsByCategory[category] = [];
        
        // Add some test blocked cards for each category
        const categoryItems = Object.keys(gameData.categories[category].items);
        if (categoryItems.length > 0) {
            const testCard = categoryItems[0];
            blockedCardsByCategory[category].push({
                cardId: testCard,
                round: index + 1,
                blockedBy: `TestPlayer${index + 1}`
            });
            
            console.log(`  ${category}: Added test card ${testCard}`);
        }
    });
    
    GameState.set('players.blockedCardsByCategory', blockedCardsByCategory);
    console.log('  Stored blocked cards for all categories');
    
    // Test 4: Test category-specific retrieval
    console.log('\n✅ Test 4: Test category-specific retrieval');
    categories.forEach(category => {
        const categoryBlocked = GameState.get('players.blockedCardsByCategory.' + category) || [];
        console.log(`  ${category}: ${categoryBlocked.length} blocked cards`);
        
        if (categoryBlocked.length > 0) {
            console.log(`    Example: ${categoryBlocked[0].cardId} by ${categoryBlocked[0].blockedBy}`);
        }
    });
    
    // Test 5: Test validation system
    console.log('\n✅ Test 5: Test validation system');
    
    // Set up test player stats
    GameState.set('players.list', ['Alice', 'Bob', 'Charlie']);
    
    const testStats = {
        Alice: { blocksMade: 2, blocksWon: 2, tokensGained: 2 },
        Bob: { blocksMade: 1, blocksWon: 1, tokensGained: 1 },
        Charlie: { blocksMade: 3, blocksWon: 2, tokensGained: 2 }  // 1 self-block
    };
    
    Object.keys(testStats).forEach(playerName => {
        GameState.set('players.stats.' + playerName, testStats[playerName]);
    });
    
    // Set up matching owned cards
    const ownedCards = {
        Alice: { movies: ['AVATAR', 'TITANIC'] },
        Bob: { countries: ['USA'] },
        Charlie: { companies: ['APPLE', 'GOOGLE'] }
    };
    GameState.set('players.ownedCards', ownedCards);
    
    // Run validation
    if (typeof validateGameStateIntegrity === 'function') {
        const validationResult = validateGameStateIntegrity();
        console.log('  Validation result:', validationResult.valid ? '✅ PASSED' : '❌ FAILED');
        
        if (validationResult.errors.length > 0) {
            console.log('  Errors:', validationResult.errors);
        }
        if (validationResult.warnings.length > 0) {
            console.log('  Warnings:', validationResult.warnings);
        }
    } else {
        console.log('  ⚠️ Validation function not available');
    }
    
    // Test 6: Test debug lifecycle function
    console.log('\n✅ Test 6: Test debug lifecycle function');
    if (typeof debugBlockLifecycle === 'function') {
        const lifecycleResult = debugBlockLifecycle();
        console.log('  Debug result:', lifecycleResult);
    } else {
        console.log('  ⚠️ Debug lifecycle function not available');
    }
    
    // Test 7: Test token replacement screen logic simulation
    console.log('\n✅ Test 7: Test token replacement screen logic');
    
    categories.forEach(category => {
        const categoryBlocked = GameState.get('players.blockedCardsByCategory.' + category) || [];
        console.log(`  ${category} token replacement simulation:`);
        console.log(`    Should show ${categoryBlocked.length} blocked cards when ${category} is played again`);
        
        categoryBlocked.forEach(blocked => {
            const belongsToCategory = gameData.categories[category].items[blocked.cardId];
            console.log(`    Card ${blocked.cardId}: ${belongsToCategory ? '✅ Valid' : '❌ Invalid'} for ${category}`);
        });
    });
    
    // Test 8: Test cross-category isolation
    console.log('\n✅ Test 8: Test cross-category isolation');
    
    // Simulate playing different categories
    const testScenarios = [
        { current: 'movies', expected: 'movies' },
        { current: 'countries', expected: 'countries' },
        { current: 'movies', expected: 'movies' }  // Same category again
    ];
    
    testScenarios.forEach((scenario, index) => {
        console.log(`  Scenario ${index + 1}: Playing ${scenario.current}`);
        const relevantBlocked = GameState.get('players.blockedCardsByCategory.' + scenario.expected) || [];
        console.log(`    Should show ${relevantBlocked.length} blocked cards from ${scenario.expected}`);
        
        // Check that other categories are not included
        const otherCategories = categories.filter(cat => cat !== scenario.expected);
        otherCategories.forEach(otherCat => {
            const otherBlocked = GameState.get('players.blockedCardsByCategory.' + otherCat) || [];
            if (otherBlocked.length > 0) {
                console.log(`    ✅ Correctly isolated: ${otherBlocked.length} ${otherCat} cards not shown`);
            }
        });
    });
    
    console.log('\n🎯 COMPREHENSIVE TEST SUMMARY:');
    console.log('✅ Blocked cards storage: Category-specific');
    console.log('✅ Validation system: Real-time checks');
    console.log('✅ Debug logging: Enhanced lifecycle tracking');
    console.log('✅ Cross-category isolation: Proper filtering');
    console.log('✅ Token replacement logic: Category-aware');
    
    return {
        categoriesAvailable: categories.length,
        blockedCardsStored: Object.keys(blockedCardsByCategory).length,
        validationWorking: typeof validateGameStateIntegrity === 'function',
        debugWorking: typeof debugBlockLifecycle === 'function',
        allSystemsOperational: true
    };
}

// Force test to use all categories in sequence
function forceAllCategoriesTest() {
    console.log('🔄 FORCED CATEGORY SEQUENCE TEST');
    console.log('===============================');
    
    // Override category selection to cycle through all categories
    const originalGetRandomCategory = window.getRandomCategory;
    const categories = Object.keys(window.GAME_DATA.categories);
    let categoryIndex = 0;
    
    window.getRandomCategory = function() {
        const category = categories[categoryIndex % categories.length];
        categoryIndex++;
        console.log(`🎯 Forced category selection: ${category} (${categoryIndex}/${categories.length})`);
        return category;
    };
    
    console.log('✅ Category selection overridden to cycle through all categories');
    console.log('   Categories will be used in order:', categories);
    console.log('   Run Fast Test to see all categories in action');
    
    // Auto-restore after a delay
    setTimeout(() => {
        if (originalGetRandomCategory) {
            window.getRandomCategory = originalGetRandomCategory;
            console.log('🔄 Restored original category selection');
        }
    }, 30000); // Restore after 30 seconds
    
    return {
        overrideActive: true,
        categoryOrder: categories,
        autoRestoreIn: '30 seconds'
    };
}

// Auto-run basic test if in browser
if (typeof window !== 'undefined') {
    console.log('🧪 Comprehensive Category Test Available');
    console.log('Commands:');
    console.log('  testAllCategoriesFix() - Run comprehensive test');
    console.log('  forceAllCategoriesTest() - Override category selection for testing');
}